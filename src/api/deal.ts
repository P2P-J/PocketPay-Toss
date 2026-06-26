import { apiClient } from './client';
import type { Deal, DealPayload } from '../types/transaction';
import type { Summary, MonthlyStats } from '../types/stats';

export const dealApi = {
  getMonthly: (teamId: string, year: number, month: number) =>
    apiClient.get(`/deals?teamId=${teamId}&year=${year}&month=${month}`) as Promise<{ data: Deal[] }>,

  getSummary: (teamId: string) =>
    apiClient.get(`/deals/summary/${teamId}`) as Promise<{ data: Summary }>,

  getMonthlyStats: (teamId: string, year: number, month: number) =>
    apiClient.get(`/deals/stats/${teamId}?year=${year}&month=${month}`) as Promise<{ data: MonthlyStats }>,

  create: (payload: DealPayload) => apiClient.post('/deals', payload) as Promise<{ data: Deal }>,

  update: (dealId: string, payload: Partial<DealPayload>) =>
    apiClient.put(`/deals/${dealId}`, payload) as Promise<{ data: Deal }>,

  remove: (dealId: string) => apiClient.delete(`/deals/${dealId}`) as Promise<null>,
};
