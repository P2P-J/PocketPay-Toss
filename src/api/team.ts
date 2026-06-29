import { apiClient } from './client';
import type { Team, Account } from '../types/team';

export const teamApi = {
  getMyTeams: () => apiClient.get('/teams') as Promise<{ data: Team[] }>,
  getTeam: (teamId: string) => apiClient.get(`/teams/${teamId}`) as Promise<{ data: Team }>,

  create: (payload: Partial<Team>) => apiClient.post('/teams', payload) as Promise<{ data: Team }>,

  update: (teamId: string, payload: Partial<Team> & { account?: Account }) =>
    apiClient.put(`/teams/${teamId}`, payload) as Promise<{ data: Team }>,

  inviteMember: (teamId: string, handle: string) =>
    apiClient.post(`/teams/${teamId}/members`, { handle }) as Promise<{ data: Team }>,

  remove: (teamId: string) => apiClient.delete(`/teams/${teamId}`) as Promise<null>,

  removeMember: (teamId: string, userId: string) =>
    apiClient.delete(`/teams/${teamId}/members/${userId}`) as Promise<null>,

  // 초대 토큰 생성(방장) — 유효 토큰 있으면 재사용
  generateInviteToken: (teamId: string) =>
    apiClient.post(`/teams/${teamId}/invite-token`) as Promise<{ data: { token: string; expiry: string } }>,

  // 초대 토큰으로 참가 (토큰은 외부 입력 — 경로 주입 방지 위해 인코딩)
  joinByToken: (token: string) =>
    apiClient.post(`/teams/join/${encodeURIComponent(token)}`) as Promise<{ data: { alreadyMember: boolean; team: Team } }>,

  // 모임 나가기(멤버) — 방장은 위임 후 가능
  leaveTeam: (teamId: string) =>
    apiClient.delete(`/teams/${teamId}/members/me`) as Promise<null>,

  // 권한 위임 (백엔드 PATCH /teams/:id/owner 배포됨)
  transferOwner: (teamId: string, userId: string) =>
    apiClient.patch(`/teams/${teamId}/owner`, { userId }) as Promise<{ data: Team }>,
};
