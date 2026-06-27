import { apiClient } from './client';

// 받은 정산 요청 (돈 안 움직임 — "얼마를 어디로 보내면 되는지" 안내)
export interface DutchRequestItem {
  _id: string;
  teamId: string;
  teamName: string;
  requesterDisplayName: string;
  amount: number;
  totalAmount: number;
  participantCount: number;
  memo?: string;
  accountSnapshot?: { bank?: string; number?: string; holder?: string };
  createdAt: string;
  expiresAt: string;
}

export interface CreateDutchBody {
  teamId: string;
  recipientIds: string[];
  amount: number;
  totalAmount: number;
  participantCount: number;
  memo?: string;
}

export const dutchApi = {
  create: (body: CreateDutchBody) => apiClient.post('/dutch-requests', body) as Promise<{ data: unknown }>,
  list: () => apiClient.get('/dutch-requests') as Promise<{ data: DutchRequestItem[] }>,
  dismiss: (id: string) => apiClient.post(`/dutch-requests/${id}/dismiss`) as Promise<unknown>,
};
