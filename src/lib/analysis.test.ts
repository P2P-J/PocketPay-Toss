import { buildAnalysisData } from './analysis';
import type { Transaction } from '../types/transaction';

const txs: Transaction[] = [
  { id: '1', merchant: '디즈니', type: 'expense', description: '', category: 'activity', amount: 285000, date: '2026-06-26' },
  { id: '2', merchant: '식사', type: 'expense', description: '', category: 'meal', amount: 23000, date: '2026-06-20' },
  { id: '3', merchant: '회비', type: 'income', description: '', category: 'membership', amount: 120000, date: '2026-06-03' },
];

it('거래에서 요약·카테고리를 파생한다', () => {
  const d = buildAnalysisData(2026, 6, txs);
  expect(d.summary.totalExpense).toBe(308000);
  expect(d.summary.totalIncome).toBe(120000);
  expect(d.categories[0]).toEqual({ category: 'activity', total: 285000, percent: 93 });
  expect(d.transactions.length).toBe(3);
});

it('선택 월로 필터하고 6개월 추세 마지막 칸은 현재 월 지출이다', () => {
  const d = buildAnalysisData(2026, 6, txs);
  expect(d.trend).toHaveLength(6);
  expect(d.trend[5]).toEqual({ label: '6월', expense: 308000 });

  const july = buildAnalysisData(2026, 7, txs);
  expect(july.summary.totalExpense).toBe(0);
  expect(july.transactions).toHaveLength(0);
});

it('예산 사용액은 거래에서, 한도는 더미에서 온다', () => {
  const d = buildAnalysisData(2026, 6, txs);
  expect(d.budget.totalSpent).toBe(308000);
  expect(d.budget.totalLimit).toBe(400000);
  const activity = d.budget.categories.find((c) => c.category === 'activity');
  expect(activity).toEqual({ category: 'activity', spent: 285000, limit: 300000 });
});
