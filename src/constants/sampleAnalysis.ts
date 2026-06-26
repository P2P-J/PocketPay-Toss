// ⚠️ TEMP — 예산 "한도"만 더미(예산 모델 없음). 사용액·멤버분담 등은 거래/멤버에서 파생.
// 청바지(t1) 모임 기본 예산 한도. budgetStore에서 팀별로 보관.
export const SAMPLE_BUDGET = {
  totalLimit: 400000,
  limits: [
    { category: 'activity', limit: 300000 },
    { category: 'meal', limit: 50000 },
  ] as { category: string; limit: number }[],
};
