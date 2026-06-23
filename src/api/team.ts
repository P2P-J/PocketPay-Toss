import { apiClient } from './client';
import type { Team } from '../types/team';

export const teamApi = {
  getMyTeams: () => apiClient.get('/teams') as Promise<{ data: Team[] }>,
  getTeam: (teamId: string) => apiClient.get(`/teams/${teamId}`) as Promise<{ data: Team }>,
};
