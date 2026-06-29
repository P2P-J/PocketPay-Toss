// 공유 백엔드 (메인 PocketPay와 동일한 Railway 서버)
export const API_BASE_URL = 'https://pocketpay-backend-production.up.railway.app';

export const REQUEST_TIMEOUT = 30000;

// 더미(디자인 프리뷰) 모드. 출시는 실연동이어야 하므로 false 고정.
//   PC/샌드박스에서 더미 데이터로 빠르게 보고 싶을 때만 `__DEV__`로 바꿔 쓰면 됨
//   (프로덕션 빌드는 __DEV__가 false라 어차피 실연동).
export const PREVIEW_MODE = false;
