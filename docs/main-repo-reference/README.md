# 메인 PocketPay 참조 문서

이 폴더는 메인 PocketPay repo(`~/aen-project/PocketPay`)의 핵심 정보 요약입니다.
토스 미니앱 개발 시 자주 참조하는 정보만 정리. 디테일은 메인 코드 직접 Read.

## 빠른 참조

| 파일 | 내용 |
|------|------|
| [api-endpoints.md](api-endpoints.md) | 백엔드 모든 endpoint 요약 (auth/team/deal/fee/ocr 등) |
| [data-models.md](data-models.md) | User/Team/Deal 등 8개 모델 스키마 + 관계 |
| [auth-flow.md](auth-flow.md) | 이메일 + OAuth(PKCE) + Apple native + JWT 흐름 |
| [business-logic.md](business-logic.md) | 카테고리/잔액/회비/더치페이/OCR/handle 로직 |

## 사용법

토스 창 Claude는 `~/aen-project/PocketPay` Read 권한 있음 (`.claude/settings.local.json`).
필요할 때 절대 경로로 직접 Read 가능:

```
~/aen-project/PocketPay/backend/routes/team.route.ts
~/aen-project/PocketPay/backend/services/auth/auth.local.service.ts
~/aen-project/PocketPay/backend/models/Deal.model.ts
~/aen-project/PocketPay/mobile/src/store/authStore.ts
~/aen-project/PocketPay/mobile/src/api/client.ts
~/aen-project/PocketPay/mobile/src/constants/categories.ts
```

## 동기화

메인 PocketPay 코드 변경 시 이 요약 문서들은 자동 업데이트 안 됨. 큰 변경(새 endpoint, 새 모델, 인증 흐름 변경 등) 있으면 이 문서들도 손봐줘야 함.

## 백엔드 베이스 URL

- production (공유): `https://pocketpay-backend-production.up.railway.app`
- 토스 미니앱은 production 그대로 사용

## 메인 repo와의 관계

- 백엔드 100% 공유 (서버 동일)
- DB 100% 공유 (같은 MongoDB Atlas, db: `pocketpay`)
- 클라이언트만 별도: 메인은 Expo+RN, 토스는 Granite+토스SDK
- 한 사용자가 두 클라이언트 모두에서 같은 계정으로 로그인 가능
