# 디자인 시스템 규칙 (TDS 충실)

앱인토스 미니앱이므로 **토스 디자인 시스템(TDS)에 충실**하게. 임의 값 금지.

## 1. 타이포 — `Txt`(@toss/tds-react-native) 토큰만, fontSize 하드코딩 금지
TDS 공식 원칙: 폰트 크기를 외우거나 하드코딩하지 말고 토큰을 쓴다(접근성·일관성).
토큰: `t1`(최대)~`t7`(최소), `st1~st13`. `fontWeight`: `regular|medium|semiBold|bold`.

| 용도 | typography | fontWeight | color |
|---|---|---|---|
| 잔액 히어로 숫자 | `t1` | bold | brand |
| 카드 라벨(전체 잔액/이번 달 수입) | `t7` | regular | textSecondary |
| 수입/지출 금액 | `t4` | bold | income/expense |
| 전월 대비 % | `t7` | medium | income/expense |
| 최다지출 카테고리명 | `t5` | medium | textPrimary |
| 섹션 제목(거래 내역) | `t4` | bold | textPrimary |
| 날짜 그룹 헤더 | `t7` | medium | textCaption |
| 거래 가맹점명(ListRow top) | (ListRow 기본) | medium | textPrimary |
| 거래 카테고리(ListRow bottom) | `t7` | regular | textCaption |
| 거래 금액(RightTexts) | (기본) | semiBold | income/expense |
| 팀명(헤더) | `t3` | bold | textPrimary |
| 빈 상태 문구 | `t5` | regular | textCaption |

## 2. 색 — `colors`(src/constants/colors) = TDS 그레이 스케일
본문 grey900 · 라벨 grey600(textSecondary) · 캡션 grey500(textCaption) · 비활성 grey400 · 구분선 grey200 · 카드배경 grey50.
수입 income(blue500) · 지출 expense(red500) · 잔액 brand(#3DD598).

## 3. 간격 — `spacing`(src/constants/spacing) 토스 리듬(4배수)
화면 좌우 거터 `screenX`(24) · 섹션 간격 `section`(24) · 카드 패딩 `cardPadding`(20) · 카드 사이 `cardGap`(12).
**ListRow는 자체 verticalPadding 사용 — 행에 수동 패딩 금지.**

## 4. 카드 / 컴포넌트
- 잔액 카드: **흰 배경 + grey200 1px 보더**, radius `card`(16), 패딩 cardPadding. (강조)
- 수입/지출·최다지출 카드: **grey50 배경**, radius 16, 패딩 cardPadding.
- 리스트: TDS `List` + `ListRow`(내장 패딩) + `Border`/separator.
- 모서리 반경: `radius`(card 16 / button 12 / sheet 20).

## 5. 원칙
- 새 컴포넌트/수정 시 fontSize/색/간격을 **토큰으로만**. 매직넘버 금지.
- 텍스트는 가능하면 `Txt`(TDS). 순수 RN Text가 필요하면 colors 토큰 + 의미에 맞는 크기.
