import { create } from 'zustand';

export type SettlementMethod = 'equal' | 'ratio' | 'custom';

interface SettlementState {
  method: SettlementMethod;
  setMethod: (method: SettlementMethod) => void;
}

// ⚠️ 로컬(세션). 분석 멤버 분담 계산 방식. 기본 균등(1/N).
export const useSettlementStore = create<SettlementState>((set) => ({
  method: 'equal',
  setMethod: (method) => set({ method }),
}));
