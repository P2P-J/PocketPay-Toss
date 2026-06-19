import { apiClient } from './client';
import type { User } from '../types/user';

export const authApi = {
  // 토스 로그인: appLogin 인가코드를 백엔드로 보내 자체 JWT를 받는다.
  loginToss: (data: { authorizationCode: string; referrer: string }) =>
    apiClient.post('/auth/login/toss', data) as Promise<{
      accessToken: string;
      refreshToken: string;
    }>,

  me: () => apiClient.get('/account/me') as Promise<User>,
};
