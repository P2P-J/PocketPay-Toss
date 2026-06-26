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
};
