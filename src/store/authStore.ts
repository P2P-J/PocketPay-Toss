import { appLogin } from '@apps-in-toss/framework';
import { create } from 'zustand';
import { authApi } from '../api/auth';
import { setAuthStateGetter } from '../api/client';
import { storage, STORAGE_KEYS } from '../lib/storage';
import type { User } from '../types/user';

// ⚠️ TEMP: 디자인 프리뷰용 로그인 우회. 토스 로그인/백엔드 실연동 전 true.
// 실연동 시 false로 바꿔 실제 토스 로그인 게이트를 켠다. (teamStore.USE_SAMPLE와 함께 끔)
const DEV_PREVIEW = true;

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  loading: boolean;
  error: string | null;

  setAccessToken: (token: string) => Promise<void>;
  checkAuth: () => Promise<void>;
  loginWithToss: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => {
  // api client에 인증 상태 getter 연결 (401 자동 refresh/logout에 사용)
  setAuthStateGetter(() => ({
    accessToken: get().accessToken,
    refreshToken: get().refreshToken,
    setAccessToken: get().setAccessToken,
    logout: get().logout,
  }));

  return {
    user: null,
    accessToken: null,
    refreshToken: null,
    loading: false,
    error: null,

    setAccessToken: async (token) => {
      set({ accessToken: token });
      await storage.setItem(STORAGE_KEYS.accessToken, token);
    },

    // 앱 시작 시 저장된 토큰으로 세션 복구
    checkAuth: async () => {
      set({ loading: true });
      try {
        const savedAccess = await storage.getItem(STORAGE_KEYS.accessToken);
        const savedRefresh = await storage.getItem(STORAGE_KEYS.refreshToken);
        if (!savedAccess) {
          // ⚠️ 프리뷰: 토큰 없으면 임시 토큰으로 게이트 통과(PC/더미에서 화면 확인용)
          if (DEV_PREVIEW) {
            set({ accessToken: 'dev-preview', loading: false });
            return;
          }
          set({ loading: false });
          return;
        }
        set({ accessToken: savedAccess, refreshToken: savedRefresh });
        const userData = await authApi.me();
        set({ user: userData, loading: false });
      } catch {
        await storage.removeItem(STORAGE_KEYS.accessToken);
        await storage.removeItem(STORAGE_KEYS.refreshToken);
        set({ user: null, accessToken: null, refreshToken: null, loading: false });
      }
    },

    // 토스 로그인: appLogin → 인가코드 → 백엔드 교환 → 자체 JWT 저장 → 내 정보 로드
    loginWithToss: async () => {
      set({ loading: true, error: null });
      try {
        const { authorizationCode, referrer } = await appLogin();
        const { accessToken, refreshToken } = await authApi.loginToss({
          authorizationCode,
          referrer,
        });
        await storage.setItem(STORAGE_KEYS.accessToken, accessToken);
        await storage.setItem(STORAGE_KEYS.refreshToken, refreshToken);
        set({ accessToken, refreshToken });

        const userData = await authApi.me();
        set({ user: userData, loading: false });
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : '로그인에 실패했어요.';
        set({ error: message, loading: false });
        throw err;
      }
    },

    logout: async () => {
      await storage.removeItem(STORAGE_KEYS.accessToken);
      await storage.removeItem(STORAGE_KEYS.refreshToken);
      set({ user: null, accessToken: null, refreshToken: null, error: null });
    },
  };
});
