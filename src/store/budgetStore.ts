import { create } from 'zustand';
import { SAMPLE_BUDGET } from '../constants/sampleAnalysis';

export interface BudgetLimit {
  category: string;
  limit: number;
}

export interface BudgetConfig {
  totalLimit: number;
  limits: BudgetLimit[];
}

interface BudgetState {
  config: BudgetConfig;
  setBudget: (config: BudgetConfig) => void;
}

// ⚠️ 백엔드 예산 모델 없음 → 로컬 보관(세션). 초기값은 더미.
export const useBudgetStore = create<BudgetState>((set) => ({
  config: { totalLimit: SAMPLE_BUDGET.totalLimit, limits: SAMPLE_BUDGET.limits },
  setBudget: (config) => set({ config }),
}));
