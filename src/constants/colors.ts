// 컬러 토큰 — TDS 그레이 스케일(토스 실제 값) + 브랜드/시맨틱.
// 폰트 "크기"는 하드코딩하지 않고 TDS Txt typography 토큰을 쓴다(접근성). 색은 이 토큰을 쓴다.
export const colors = {
  // 브랜드 / 시맨틱
  brand: '#3DD598', // 잔액 · primary
  brandTint: '#E7F9F1', // 브랜드 연한 배경(뱃지/선택/버튼틴트)
  brandStrong: '#12B886', // 브랜드 진한 톤(납부완료 등 강조 텍스트)
  income: '#3182f6', // = TDS blue500 (수입)
  expense: '#f04452', // = TDS red500 (지출)
  expenseTint: '#FFEDED', // 지출/삭제 연한 배경
  warn: '#FF922B', // 경고(예산 80%↑ 등)

  // TDS 그레이 스케일 (텍스트 위계 / 라인 / 배경)
  grey900: '#191f28',
  grey800: '#333d4b',
  grey700: '#4e5968',
  grey600: '#6b7684',
  grey500: '#8b95a1',
  grey400: '#b0b8c1',
  grey300: '#d1d6db',
  grey200: '#e5e8eb',
  grey100: '#f2f4f6',
  grey50: '#f9fafb',
  white: '#ffffff',

  // 시맨틱 별칭 (텍스트 위계)
  textPrimary: '#191f28', // grey900 본문/제목
  textSecondary: '#6b7684', // grey600 라벨
  textCaption: '#8b95a1', // grey500 캡션/약한 텍스트
  textTertiary: '#b0b8c1', // grey400 비활성/플레이스홀더
  divider: '#e5e8eb', // grey200
  cardBg: '#f9fafb', // grey50

  // 차트(도넛/카테고리) 팔레트 — 한 곳에서 관리
  chart: ['#3DD598', '#3182f6', '#FFA94D', '#845EF7', '#f04452', '#20C997'],
} as const;
