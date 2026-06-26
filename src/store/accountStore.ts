import { create } from 'zustand';
import type { Account } from '../types/team';

const EMPTY: Account = { bank: '', number: '', holder: '' };
// 청바지(t1) 기본 계좌 (디자인 프리뷰). 그 외 팀은 미설정.
const SEED: Record<string, Account> = {
  t1: { bank: '토스뱅크', number: '', holder: '' },
};

interface AccountState {
  // ⚠️ 로컬(세션). 실제로는 팀별 Team.account(백엔드).
  byTeam: Record<string, Account>;
  setAccount: (teamId: string, account: Account) => void;
}

export const useAccountStore = create<AccountState>((set) => ({
  byTeam: SEED,
  setAccount: (teamId, account) => set((s) => ({ byTeam: { ...s.byTeam, [teamId]: account } })),
}));

export const selectAccount = (teamId: string) => (s: AccountState): Account => s.byTeam[teamId] ?? EMPTY;
