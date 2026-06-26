import { appLogin } from '@apps-in-toss/framework';
import { create } from 'zustand';
import { authApi } from '../api/auth';
import { setAuthStateGetter } from '../api/client';
import { storage, STORAGE_KEYS } from '../lib/storage';
import type { User } from '../types/user';

// ⚠️ 디자인 프리뷰용 로그인 우회. __DEV__로 묶어 프로덕션 빌드에선 자동으로 꺼짐(인증 우회 출시 방지).
// 실연동 테스트 시 dev에서 끄려면 뒤의 true→false. (teamStore.USE_SAMPLE와 함께)
const DEV_PREVIEW = __DEV__ && true;

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
      // 저장 실패가 토큰 갱신(401 재시도) 흐름을 깨지 않도록 삼킴
      try {
        await storage.setItem(STORAGE_KEYS.accessToken, token);
      } catch {
        // 저장소 실패 — 메모리 토큰은 유지됨
      }
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
      try {
        await storage.removeItem(STORAGE_KEYS.accessToken);
        await storage.removeItem(STORAGE_KEYS.refreshToken);
      } catch {
        // 저장소 제거 실패해도 메모리 세션은 비움
      }
      set({ user: null, accessToken: null, refreshToken: null, error: null });
    },
  };
});
