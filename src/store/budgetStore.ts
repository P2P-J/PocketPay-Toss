import { SAMPLE_BUDGET } from '../constants/sampleAnalysis';
import { createTeamScopedStore } from './createTeamScopedStore';

export interface BudgetLimit {
  category: string;
  limit: number;
}

export interface BudgetConfig {
  totalLimit: number;
  limits: BudgetLimit[];
}

const EMPTY: BudgetConfig = { totalLimit: 0, limits: [] };
// 청바지(t1) 기본 예산 한도 (디자인 프리뷰). 그 외 팀은 미설정.
const SEED: Record<string, BudgetConfig> = {
  t1: { totalLimit: SAMPLE_BUDGET.totalLimit, limits: SAMPLE_BUDGET.limits },
};

// ⚠️ 백엔드 예산 모델 없음 → 팀별 로컬 보관(세션).
const { useStore, select } = createTeamScopedStore<BudgetConfig>(SEED, EMPTY);
export const useBudgetStore = useStore;
export const selectBudget = select;
