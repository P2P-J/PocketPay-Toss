import { useTeamStore } from '../store/teamStore';
import { getTeamId } from '../types/team';

// 현재 선택된 모임의 id (없으면 ''). 팀별 store 조회에 공용 사용.
export function useCurrentTeamId(): string {
  return useTeamStore((s) => (s.currentTeam ? getTeamId(s.currentTeam) : ''));
}
