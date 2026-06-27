import { apiClient } from './client';

// 백엔드 /fees 응답 멤버 형태
export interface FeeStatusMemberRaw {
  userId: string;
  name: string;
  role: string;
  payment: { id: string; amount: number; paidAt: string; note?: string } | null;
}
export interface FeeStatusRaw {
  feeAmount: number;
  feeDueDay: number;
  year: number;
  month: number;
  members: FeeStatusMemberRaw[];
  paidCount: number;
}

export const feeApi = {
  getStatus: (teamId: string, year: number, month: number) =>
    apiClient.get(`/fees/${teamId}?year=${year}&month=${month}`) as Promise<{ data: FeeStatusRaw }>,

  recordPayment: (teamId: string, body: { userId: string; year: number; month: number; amount: number }) =>
    apiClient.post(`/fees/${teamId}`, body) as Promise<{ data: { _id: string } }>,

  deletePayment: (teamId: string, paymentId: string) =>
    apiClient.delete(`/fees/${teamId}/${paymentId}`) as Promise<null>,
};
