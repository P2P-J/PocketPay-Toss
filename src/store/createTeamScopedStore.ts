import { create } from 'zustand';

interface TeamScopedState<T> {
  byTeam: Record<string, T>;
  set: (teamId: string, value: T) => void;
}

// 팀(teamId)별로 값을 보관하는 store 공용 팩토리 (예산·계좌·정산규칙 공유).
// seed: 초기값(예: { t1: ... }), fallback: 미설정 팀의 기본값.
export function createTeamScopedStore<T>(seed: Record<string, T>, fallback: T) {
  const useStore = create<TeamScopedState<T>>((set) => ({
    byTeam: seed,
    set: (teamId, value) => set((s) => ({ byTeam: { ...s.byTeam, [teamId]: value } })),
  }));
  const select = (teamId: string) => (s: TeamScopedState<T>): T => s.byTeam[teamId] ?? fallback;
  return { useStore, select };
}
