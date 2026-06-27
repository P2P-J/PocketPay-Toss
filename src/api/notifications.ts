import { apiClient } from './client';
import type { Team } from '../types/team';

export interface Invitation {
  teamId: string;
  teamName: string;
  invitedBy?: { name?: string; nickname?: string; handle?: string };
  invitedAt: string;
}

export const notificationsApi = {
  getInvitations: () => apiClient.get('/invitations') as Promise<{ data: Invitation[] }>,
  getUnreadCount: () => apiClient.get('/account/notifications-unread-count') as Promise<{ data: { count: number } }>,
  markViewed: () => apiClient.post('/account/notifications-viewed') as Promise<unknown>,
  accept: (teamId: string) => apiClient.post(`/invitations/${teamId}/accept`) as Promise<{ data: { success: boolean; team: Team } }>,
  reject: (teamId: string) => apiClient.post(`/invitations/${teamId}/reject`) as Promise<unknown>,
};
