import { useTeamStore } from '../store/teamStore';
import { useAuthStore } from '../store/authStore';
import { isTeamOwner } from '../types/team';
import { PREVIEW_MODE } from '../constants/config';

// 현재 모임에서 내가 방장인지. 프리뷰 모드에선 방장 UI를 보여주기 위해 true.
export function useIsOwner(): boolean {
  const currentTeam = useTeamStore((s) => s.currentTeam);
  const user = useAuthStore((s) => s.user);
  if (PREVIEW_MODE) return true;
  return isTeamOwner(currentTeam?.members, user);
}
