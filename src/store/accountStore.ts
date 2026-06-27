import type { Account } from '../types/team';
import { createTeamScopedStore } from './createTeamScopedStore';

const EMPTY: Account = { bank: '', number: '', holder: '' };
// 청바지(t1) 기본 계좌 (디자인 프리뷰). 그 외 팀은 미설정.
const SEED: Record<string, Account> = {
  t1: { bank: '토스뱅크', number: '', holder: '' },
};

// ⚠️ 로컬(세션). 실제로는 팀별 Team.account(백엔드).
const { useStore, select } = createTeamScopedStore<Account>(SEED, EMPTY);
export const useAccountStore = useStore;
export const selectAccount = select;
