# Sprint 1 — 셋업 마무리 + 첫 화면 + 백엔드 호출 검증

**목표**: Granite/TDS 환경에서 작은 모임 첫 화면이 토스 샌드박스 앱에 정상 로드되고, 메인 백엔드(Railway)와 통신이 되는 것까지 확인. 끝나는 시점에 "계속 갈지 / 멈출지" 판단할 수 있게.

**예상 기간**: 약 1주 (1인 페이스)

---

## 사전 작업

- [ ] 앱인토스 콘솔에서 미니앱 등록 + 등록명 확정 (`pocketpay`)
- [ ] 콘솔에서 아이콘 업로드 (메인 repo의 `mobile/assets/icon.png` 사용) → URL 확보
- [ ] 토스 샌드박스 앱 설치 방법 확인 (iOS 시뮬레이터/실기기)

## Task 1. ait init + granite.config 확정

```bash
cd ~/aen-project/pocketpay-toss
npx ait init
```

- 프레임워크 선택: React Native
- appName 입력: `pocketpay` (콘솔 등록명과 정확히 일치)
- `granite.config.ts` 생성된 후:
  - `displayName`: `작은 모임`
  - `primaryColor`: `#3DD598`
  - `icon`: 콘솔 업로드 URL

검증: `granite.config.ts` 값 정상.

## Task 2. TDS 설치

```bash
npm install @toss/tds-react-native
```

검증: package.json에 추가됨.

## Task 3. 메인 repo 백엔드 CORS 토스 도메인 추가

메인 repo (`~/aen-project/PocketPay`) 의 `backend/server.ts` CORS allowlist에 토스 미니앱이 호출할 도메인 추가.

- 토스 미니앱 실행 환경의 origin 확인 필요 (커뮤니티 문의 또는 첫 호출 시 응답 확인)
- 임시로 dev 시점에는 origin: true 허용했다가 production에서 좁히기

검증: 토스 샌드박스 앱에서 백엔드 `/health` 응답 200 받기.

## Task 4. 첫 화면 작성 — 로그인 또는 Hello World

방향 선택 (Sprint 1 진행 시 결정):
- **A. Hello World 화면** — 작은 모임 로고 + "환영합니다" + 백엔드 `/health` 호출 + 응답 표시
- **B. 로그인 화면 (이메일 + 비번)** — 메인 백엔드 `/auth/login/local` 호출

추천: **A 먼저** (검증용). 동작 확인되면 B로 확장.

검증 체크리스트:
- [ ] 토스 샌드박스 앱에서 미니앱 정상 로드
- [ ] 로고/텍스트 정상 표시
- [ ] 백엔드 `/health` 응답 200
- [ ] 응답 화면에 표시됨

## Task 5. 첫 commit + push

```bash
git add .
git commit -m "feat: Sprint 1 — 첫 화면 + 백엔드 호출 검증"
git push origin main
```

## Sprint 1 종료 시 의사 결정

- ✅ "잘 되니까 Sprint 2로" → 모임 목록 + 거래 추가 핵심 흐름
- ⚠️ "Granite 학습 부담 크니까 WebView로 전환" → 폴더 비우고 WebView CLI로 재셋업
- ❌ "현실적으로 안 되겠다" → 토스 미니앱 보류, 메인 앱 안정화에 집중

## Sprint 1 산출물
- 동작하는 첫 화면 1개
- 백엔드 통신 검증 완료
- 작업 시간 견적 데이터 (Sprint 2~4 일정 정확화)
