import { create } from 'zustand';

export interface Account {
  bank: string;
  number: string;
  holder: string;
}

interface AccountState {
  account: Account;
  setAccount: (account: Account) => void;
}

// ⚠️ 로컬(세션). 실제로는 Team.account(백엔드)에 저장될 값.
export const useAccountStore = create<AccountState>((set) => ({
  account: { bank: '토스뱅크', number: '', holder: '' },
  setAccount: (account) => set({ account }),
}));
