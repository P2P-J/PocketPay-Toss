import { create } from 'zustand';

export interface Profile {
  name: string; // 실명
  nickname: string; // 닉네임
  handle: string; // 고유 ID (영문 소문자/숫자/_)
}

interface ProfileState extends Profile {
  set: (patch: Partial<Profile>) => void;
}

// ⚠️ 로컬(세션) 더미. 실 연동 시 authStore.user(/account/me) + PATCH로 교체.
export const useProfileStore = create<ProfileState>((setState) => ({
  name: '조보근',
  nickname: '보근',
  handle: 'bogeun_jo',
  set: (patch) => setState(patch),
}));
