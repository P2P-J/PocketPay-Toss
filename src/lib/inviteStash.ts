import { storage } from './storage';

// 미로그인/미온보딩 상태로 들어온 초대 토큰을 보관했다가, 로그인·온보딩 완료 후 자동 참가에 사용.
const KEY = 'pendingInviteToken';

export const stashInvite = (token: string): Promise<void> => storage.setItem(KEY, token);

export async function popInvite(): Promise<string | null> {
  const t = await storage.getItem(KEY);
  if (t) await storage.removeItem(KEY);
  return t;
}
