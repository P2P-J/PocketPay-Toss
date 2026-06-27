import { createTeamScopedStore } from './createTeamScopedStore';

export type SettlementMethod = 'equal' | 'ratio' | 'custom';

// ⚠️ 로컬(세션). 팀별 정산 분배 방식. 기본 균등(1/N).
const { useStore, select } = createTeamScopedStore<SettlementMethod>({}, 'equal');
export const useSettlementStore = useStore;
export const selectMethod = select;
