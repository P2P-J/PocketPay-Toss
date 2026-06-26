import { create } from 'zustand';

export type SettlementMethod = 'equal' | 'ratio' | 'custom';

interface SettlementState {
  // ⚠️ 로컬(세션). 팀별 정산 분배 방식. 기본 균등(1/N).
  byTeam: Record<string, SettlementMethod>;
  setMethod: (teamId: string, method: SettlementMethod) => void;
}

export const useSettlementStore = create<SettlementState>((set) => ({
  byTeam: {},
  setMethod: (teamId, method) => set((s) => ({ byTeam: { ...s.byTeam, [teamId]: method } })),
}));

export const selectMethod = (teamId: string) => (s: SettlementState): SettlementMethod => s.byTeam[teamId] ?? 'equal';
