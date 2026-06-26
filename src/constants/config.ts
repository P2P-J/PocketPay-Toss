// 공유 백엔드 (메인 PocketPay와 동일한 Railway 서버)
export const API_BASE_URL = 'https://pocketpay-backend-production.up.railway.app';

export const REQUEST_TIMEOUT = 30000;

// ⚠️ 디자인 프리뷰 모드 — true면 더미 데이터 + 로그인 우회(PC/더미 확인용).
//   __DEV__로 묶여 프로덕션 빌드에선 항상 false(실연동).
//   실기기에서 실연동 테스트하려면 아래 true → false 한 곳만 바꾸면 됨.
export const PREVIEW_MODE = __DEV__ && true;
