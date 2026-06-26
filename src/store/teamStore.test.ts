import { useTeamStore } from './teamStore';

beforeEach(() => {
  useTeamStore.setState({ transactions: [], summary: { income: 0, expense: 0, balance: 0 }, stats: null });
});

it('addTransaction은 최신 거래를 맨 앞에 추가하고 요약을 재계산한다', () => {
  const add = useTeamStore.getState().addTransaction;
  add({ merchant: '스타벅스', type: 'expense', description: '', category: 'meal', amount: 1000, date: '2026-06-01' });
  add({ merchant: '회비', type: 'income', description: '', category: 'membership', amount: 5000, date: '2026-06-02' });

  const s = useTeamStore.getState();
  expect(s.transactions.length).toBe(2);
  expect(s.transactions[0]?.merchant).toBe('회비'); // 최신이 맨 앞
  expect(s.summary).toEqual({ income: 5000, expense: 1000, balance: 4000 });
});

it('지출 카테고리 합산으로 topCategory와 categoryBreakdown을 만든다', () => {
  const add = useTeamStore.getState().addTransaction;
  add({ merchant: 'a', type: 'expense', description: '', category: 'meal', amount: 3000, date: '2026-06-01' });
  add({ merchant: 'b', type: 'expense', description: '', category: 'cafe', amount: 1000, date: '2026-06-02' });

  const s = useTeamStore.getState();
  expect(s.stats?.topCategory).toEqual({ category: 'meal', total: 3000 });
  expect(s.stats?.categoryBreakdown[0]).toEqual({ category: 'meal', total: 3000, percent: 75 });
});
