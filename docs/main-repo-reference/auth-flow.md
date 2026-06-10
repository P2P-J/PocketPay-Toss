# 메인 PocketPay 인증 흐름 요약

> **출처**: `backend/services/auth/`, `backend/controllers/auth.controller.ts`, `mobile/src/store/authStore.ts`
> 코드 디테일은 해당 파일 직접 Read.

## JWT 토큰 설계
- `accessToken`: 15분 만료. 모든 인증 요청에 `Authorization: Bearer ...` 헤더.
- `refreshToken`: 7일 만료. 갱신 전용.
- 시크릿: `JWT_SECRET` env (fail-fast — 미설정 시 서버 시작 안 됨).

## 1. 이메일 회원가입 + 로그인

```
1. POST /auth/send-code            { email, purpose: "회원가입" }
                                    → 6자리 코드 이메일 발송 (rate limit)

2. POST /auth/verify-code          { email, code, purpose: "회원가입" }
                                    → VerificationCode 검증 통과 + DB에 verified=true 표기

3. POST /auth/signup/local         { email, password, name, nickname, handle? }
                                    → 검증된 VerificationCode 있는지 확인 후 User 생성
                                    → accessToken + refreshToken 응답

4. POST /auth/login/local          { email, password }
                                    → User.password select:false → 명시 select해서 bcrypt 비교
                                    → accessToken + refreshToken
```

## 2. OAuth 로그인 (Google/Naver/Kakao) — PKCE-style

기존 OAuth는 콜백 URL에 토큰 평문 노출 위험 있어서 PKCE 패턴으로 재작성됨.

```
[모바일 앱]
1. utils/oauthPkce.ts 에서 verifier + challenge(SHA-256) 생성
2. challenge를 GET /auth/login/oauth/:provider?challenge=... 로 redirect
   (또는 WebBrowser.openAuthSessionAsync)

[백엔드]
3. provider 콘솔로 redirect → 사용자가 동의
4. provider → /auth/login/oauth/:provider/callback?code=... 으로 callback
5. controller가:
   a. provider에 code 보내서 사용자 정보 받음
   b. User 찾거나 생성
   c. accessToken/refreshToken 발급
   d. OAuthExchangeCode 모델에 일회용 exchange code + challenge 저장 (30초~1분 TTL)
   e. 딥링크 `pocketpay://oauth-callback?code=<exchangeCode>` 로 모바일에 전달
      (토큰 자체는 안 보냄)

[모바일]
6. 딥링크에서 exchangeCode 추출
7. POST /auth/oauth/exchange     { exchangeCode, verifier }
   → 백엔드가 challenge(저장된 것) === SHA256(verifier) 검증
   → 검증 통과면 accessToken + refreshToken 반환
   → used=true 마킹 (재사용 불가)
```

## 3. Apple Sign-In (Native)

iOS에선 native Apple Authentication 사용. 별도 PKCE 없이 identity token + nonce.

```
[모바일]
1. AppleAuthentication.signInAsync → credential.identityToken + nonce(SHA-256 해시)
2. POST /auth/login/oauth/apple/native { identityToken, nonce, name? }

[백엔드]
3. apple.provider.ts:
   - jwks-rsa로 Apple 공개키 가져옴
   - identityToken 검증 (RS256, audience=BUNDLE_ID, issuer=apple)
   - nonce 일치 확인
4. User 찾거나 생성 (providerId = Apple sub)
5. accessToken + refreshToken 응답

회원 탈퇴 시:
- ES256 client_secret JWT 생성
- POST https://appleid.apple.com/auth/revoke (refresh_token + client_secret)
```

## 4. 토큰 갱신

```
1. POST /auth/refresh            { refreshToken }
                                  → 검증 통과 시 새 accessToken 발급
                                  → refreshLimiter 분당 20회
```

## 5. 비밀번호 재설정

```
1. POST /auth/send-code          { email, purpose: "비밀번호재설정" }
2. POST /auth/verify-code        { email, code, purpose: "비밀번호재설정" }
3. POST /auth/reset-password     { email, newPassword }
                                  → 검증된 VerificationCode 있는지 확인 후 변경
                                  → 코드 삭제
```

## 6. OAuth 가입자 추가정보 입력
OAuth는 nickname/handle 안 받을 수도 있어서 첫 로그인 후 별도 입력 단계:

```
POST /auth/oauth/complete-profile  { nickname, handle?, name? }  (인증 필요)
```

## 7. 모바일 클라이언트 처리 (`mobile/src/api/client.ts`, `store/authStore.ts`)

- 모든 요청에 `Authorization: Bearer ${accessToken}` 자동 첨부.
- 401 응답 시: 정확 문자열 매칭 X (이전에 버그 있었음 — 5/12 fix). 모든 401에서 refresh 시도.
- refresh 성공 → 원래 요청 재시도.
- refresh 실패 → 강제 logout + 로그인 화면 이동.
- 토큰은 `expo-secure-store` 에 저장 (앱 삭제 시 자동 정리).

## 🔐 토스 미니앱에서 주의할 점

토스 미니앱은 **토스 자체 로그인 강제** 가능성 큼. 자체 OAuth/이메일 흐름이 그대로 동작하는지 확인 필요:
- 메모리 `aitoss-auth.md` 참조 — 토스 appLogin 필수 / userKey 받는 흐름
- 토스 미니앱 백엔드 인증 흐름은 `토스 userKey → 백엔드에서 우리 User 매핑 → 우리 JWT 발급` 패턴이 될 수 있음
- 우리 기존 /auth/login/oauth/apple/native 같은 native flow를 토스 패턴으로 어떻게 매핑할지 Sprint 1~2에서 결정 필요
