import { useTeamStore } from './teamStore';
import { getMemberId, type Team } from '../types/team';

// recompute는 "이번 달"을 new Date() 기준으로 보므로, 테스트는 현재 월 날짜를 동적으로 사용
const now = new Date();
const ym = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
const D1 = `${ym}-01`;
const D2 = `${ym}-02`;

beforeEach(() => {
  useTeamStore.setState({ transactions: [], summary: { income: 0, expense: 0, balance: 0 }, stats: null });
});

it('addTransaction은 최신 거래를 맨 앞에 추가하고 요약을 재계산한다', () => {
  const add = useTeamStore.getState().addTransaction;
  add({ merchant: '스타벅스', type: 'expense', description: '', category: 'meal', amount: 1000, date: D1 });
  add({ merchant: '회비', type: 'income', description: '', category: 'membership', amount: 5000, date: D2 });

  const s = useTeamStore.getState();
  expect(s.transactions.length).toBe(2);
  expect(s.transactions[0]?.merchant).toBe('회비'); // 최신이 맨 앞
  expect(s.summary).toEqual({ income: 5000, expense: 1000, balance: 4000 });
});

it('지출 카테고리 합산으로 topCategory와 categoryBreakdown을 만든다', () => {
  const add = useTeamStore.getState().addTransaction;
  add({ merchant: 'a', type: 'expense', description: '', category: 'meal', amount: 3000, date: D1 });
  add({ merchant: 'b', type: 'expense', description: '', category: 'cafe', amount: 1000, date: D2 });

  const s = useTeamStore.getState();
  expect(s.stats?.topCategory).toEqual({ category: 'meal', total: 3000 });
  expect(s.stats?.categoryBreakdown[0]).toEqual({ category: 'meal', total: 3000, percent: 75 });
});

it('updateTransaction은 해당 거래를 교체하고 요약을 재계산한다', () => {
  const { addTransaction, updateTransaction } = useTeamStore.getState();
  addTransaction({ merchant: 'a', type: 'expense', description: '', category: 'meal', amount: 1000, date: D1 });
  const id = useTeamStore.getState().transactions[0]!.id;
  updateTransaction(id, { merchant: 'a수정', type: 'expense', description: '', category: 'meal', amount: 3000, date: D1 });

  const s = useTeamStore.getState();
  expect(s.transactions[0]?.merchant).toBe('a수정');
  expect(s.transactions[0]?.amount).toBe(3000);
  expect(s.summary.expense).toBe(3000);
});

it('deleteTransaction은 거래를 제거하고 요약을 재계산한다', () => {
  const { addTransaction, deleteTransaction } = useTeamStore.getState();
  addTransaction({ merchant: 'a', type: 'expense', description: '', category: 'meal', amount: 1000, date: D1 });
  addTransaction({ merchant: 'b', type: 'income', description: '', category: 'membership', amount: 5000, date: D2 });
  const delId = useTeamStore.getState().transactions.find((t) => t.merchant === 'a')!.id;
  deleteTransaction(delId);

  const s = useTeamStore.getState();
  expect(s.transactions).toHaveLength(1);
  expect(s.summary.expense).toBe(0);
  expect(s.summary.income).toBe(5000);
});

const teamFixture = (): Team => ({
  _id: 't',
  name: 'T',
  members: [
    { user: { _id: 'u1', nickname: '방장' }, role: 'owner' },
    { user: { _id: 'u2', nickname: '멤버' }, role: 'member' },
  ],
});

it('removeMember(로컬)는 멤버를 제거한다', async () => {
  const team = teamFixture();
  useTeamStore.setState({ teams: [team], currentTeam: team });
  await useTeamStore.getState().removeMember('u2');

  const members = useTeamStore.getState().currentTeam?.members ?? [];
  expect(members).toHaveLength(1);
  expect(getMemberId(members[0]!)).toBe('u1');
});

it('transferOwner(로컬)는 방장 역할을 넘긴다', async () => {
  const team = teamFixture();
  useTeamStore.setState({ teams: [team], currentTeam: team });
  await useTeamStore.getState().transferOwner('u2');

  const members = useTeamStore.getState().currentTeam?.members ?? [];
  expect(members.find((m) => getMemberId(m) === 'u2')?.role).toBe('owner');
  expect(members.find((m) => getMemberId(m) === 'u1')?.role).toBe('member');
});
