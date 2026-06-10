# 메인 PocketPay 백엔드 API 엔드포인트 요약

> **출처**: `~/aen-project/PocketPay/backend/routes/`
> 모든 endpoint는 `https://pocketpay-backend-production.up.railway.app` 베이스.
> 별도 표기 없으면 **JWT 인증 필수** (Authorization: Bearer <accessToken>).
> 디테일/스키마는 해당 .route.ts + controller 파일 직접 Read 가능.

## /auth — 인증 (`routes/auth.route.ts`)

| 메서드 | 경로 | 설명 | 인증 |
|--------|------|------|-----|
| POST | `/auth/signup/local` | 이메일 회원가입 (사전 verify-code 통과 필요) | X |
| POST | `/auth/login/local` | 이메일 로그인 | X |
| POST | `/auth/refresh` | 토큰 갱신 (rate limit 적용) | refreshToken |
| GET | `/auth/login/oauth/:provider` | OAuth 진입(redirect) — provider: google/naver/kakao | X |
| GET | `/auth/login/oauth/:provider/callback` | OAuth 콜백 (PKCE exchange code 발급) | X |
| POST | `/auth/oauth/exchange` | exchange code → access/refreshToken 교환 (PKCE) | X |
| POST | `/auth/login/oauth/apple/native` | Apple 네이티브 로그인 (identityToken + nonce 검증) | X |
| POST | `/auth/oauth/complete-profile` | OAuth 가입자 추가정보(handle 등) 입력 | accessToken |
| POST | `/auth/send-code` | 이메일 인증코드 발송 (회원가입/비번재설정) | X |
| POST | `/auth/verify-code` | 인증코드 검증 | X |
| POST | `/auth/reset-password` | 인증 통과 후 비번 재설정 | X |

## /account — 사용자 본인 (`routes/account.route.ts`)

| 메서드 | 경로 | 설명 |
|--------|------|------|
| GET | `/account/me` | 내 정보 (User 직렬화, pushTokens 제외) |
| DELETE | `/account/me` | 회원 탈퇴 (OAuth provider revoke + 트랜잭션) |
| PUT | `/account/me/changePassword` | 현재 비번 + 새 비번 |
| GET | `/account/check-handle?value=...` | handle 사용 가능 여부 (4~16자, 영문/숫자/언더스코어) |
| PATCH | `/account/profile` | nickname/name/profileImage 등 부분 수정 |
| PATCH | `/account/handle` | handle 변경 (24시간 쿨다운) |
| POST/GET | (line 35+) | 알림 관련 — pushToken 등록, 마지막 조회 시각 등 |

## /teams — 모임 (`routes/team.route.ts`)

| 메서드 | 경로 | 설명 |
|--------|------|------|
| POST | `/teams` | 모임 생성 |
| GET | `/teams` | 내가 속한 모임 목록 ($lookup 단일 쿼리, latestDeal 포함) |
| POST | `/teams/join/:token` | 초대 토큰으로 가입 |
| GET | `/teams/:teamId` | 모임 상세 |
| PUT | `/teams/:teamId` | 모임 정보 수정 |
| DELETE | `/teams/:teamId` | 모임 삭제 (owner만, 트랜잭션) |
| POST | `/teams/:teamId/invite-token` | 초대 토큰 생성 (24시간 만료) |
| POST | `/teams/:teamId/members` | 이메일 또는 handle로 멤버 초대 |
| DELETE | `/teams/:teamId/members/me` | 모임 탈퇴 |
| DELETE | `/teams/:teamId/members/:userId` | 멤버 추방 (owner만) |

## /deals — 거래 (`routes/deal.route.ts`)

| 메서드 | 경로 | 설명 |
|--------|------|------|
| POST | `/deals` | 거래 등록 |
| GET | `/deals?teamId&year&month` | 월별 거래 조회 |
| GET | `/deals/all/:teamId?page=&limit=` | 페이지네이션 전체 거래 |
| GET | `/deals/summary/:teamId` | 잔액/총수입/총지출 요약 |
| GET | `/deals/stats/:teamId?year=&month=` | 월별 통계 (전월 비교 + 카테고리 + topCategory, aggregate $group) |
| GET | `/deals/:dealId` | 거래 상세 |
| PUT | `/deals/:dealId` | 거래 수정 |
| DELETE | `/deals/:dealId` | 거래 삭제 |

## /fees — 회비 (`routes/fee.route.ts`)

| 메서드 | 경로 | 설명 |
|--------|------|------|
| GET | `/fees/:teamId?year=&month=` | 멤버별 납부 현황 |
| POST | `/fees/:teamId` | 납부 기록 |
| DELETE | `/fees/:teamId/:paymentId` | 납부 기록 삭제 |
| PATCH | `/fees/:teamId/rule` | 회비 정책(금액/마감일) 수정 |

## /dutch-requests — 더치페이 요청 (`routes/dutch-request.route.ts`)

| 메서드 | 경로 | 설명 |
|--------|------|------|
| POST | `/dutch-requests` | 멤버들에게 더치페이 요청 발송 (푸시 알림) |
| GET | `/dutch-requests` | 내 받은 요청 목록 (pending + 미만료) |
| POST | (line 19) | dismiss(거절) 또는 처리 완료 |

## /invitations — 모임 초대 알림 (`routes/invitation.route.ts`)

| 메서드 | 경로 | 설명 |
|--------|------|------|
| GET | `/invitations` | 내가 받은 pending 초대 목록 |
| POST | (line 11) | 초대 수락 |
| POST | (line 16) | 초대 거절 |

## /ocr — 영수증 OCR (`routes/ocr.route.ts`)

| 메서드 | 경로 | 설명 |
|--------|------|------|
| POST | `/ocr/analyze` | multipart/form-data (image file) → NCP Clova Document + General 병렬 호출 → 거래처/금액/날짜/사업자번호 추출. rate limit + magic byte 검증 |

## 인증 흐름 한 줄

- **이메일**: send-code → verify-code → signup/login/local → accessToken+refreshToken
- **OAuth (web)**: redirect → callback → exchange (PKCE) → accessToken+refreshToken
- **Apple (native)**: identityToken+nonce → login/oauth/apple/native → accessToken+refreshToken
- **갱신**: refreshToken → /auth/refresh → 새 accessToken

자세한 흐름: `auth-flow.md` 참조.
