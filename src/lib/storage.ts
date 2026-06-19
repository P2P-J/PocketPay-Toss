import { Storage } from '@apps-in-toss/framework';

// 영속 저장소 어댑터.
// ⚠️ 앱인토스에선 RN AsyncStorage가 화이트아웃을 유발하므로 반드시 앱인토스 Storage 사용.
// 기존 expo-secure-store(SecureStore)를 이 한 곳에서 대체한다.
export const storage = {
  getItem: (key: string): Promise<string | null> => Storage.getItem(key),
  setItem: (key: string, value: string): Promise<void> => Storage.setItem(key, value),
  removeItem: (key: string): Promise<void> => Storage.removeItem(key),
};

export const STORAGE_KEYS = {
  accessToken: 'accessToken',
  refreshToken: 'refreshToken',
} as const;
