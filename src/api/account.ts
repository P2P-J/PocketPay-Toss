import { apiClient } from './client';
import type { User } from '../types/user';

export const accountApi = {
  // nickname/name 등 부분 수정
  updateProfile: (payload: { name?: string; nickname?: string }) =>
    apiClient.patch('/account/profile', payload) as Promise<{ data: User }>,

  // handle 변경 (24시간 쿨다운, 서버 검증)
  updateHandle: (handle: string) =>
    apiClient.patch('/account/handle', { handle }) as Promise<{ data: User }>,

  // handle 사용 가능 여부
  checkHandle: (value: string) =>
    apiClient.get(`/account/check-handle?value=${encodeURIComponent(value)}`) as Promise<{ available: boolean; reason?: string }>,

  // 회원 탈퇴 (방장인 모임 + 데이터 삭제)
  deleteAccount: () => apiClient.delete('/account/me') as Promise<null>,
};
