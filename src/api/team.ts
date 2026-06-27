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

  // ⚠️ 백엔드 엔드포인트 추가 예정(권한 위임). 더미는 로컬 처리, 실모드는 이 경로 구현 필요.
  transferOwner: (teamId: string, userId: string) =>
    apiClient.patch(`/teams/${teamId}/owner`, { userId }) as Promise<{ data: Team }>,
};
