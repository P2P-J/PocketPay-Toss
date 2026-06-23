// 간격 토큰 — 토스 리듬 (4의 배수). 컴포넌트는 이 값을 쓴다.
export const spacing = {
  screenX: 24, // 화면 좌우 거터
  section: 24, // 섹션 간 세로 간격
  cardPadding: 20, // 카드 내부 패딩
  cardGap: 12, // 카드 사이 간격
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
} as const;

// 모서리 반경
export const radius = {
  card: 16,
  button: 12,
  sheet: 20,
  pill: 999,
} as const;
