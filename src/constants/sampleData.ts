// ⚠️ TEMP — 디자인 프리뷰용 샘플 데이터. 디자인 확정 후 + Phase 3(생성 기능) 들어오면 제거.
import type { Team } from '../types/team';
import type { Summary, MonthlyStats } from '../types/stats';
import type { Transaction } from '../types/transaction';

export const sampleTeams: Team[] = [
  {
    _id: 't1',
    name: '청바지',
    displayMode: 'nickname',
    members: [
      { user: { _id: 'u1', name: '조보근', nickname: '보근' }, role: 'owner' },
      { user: { _id: 'u2', name: '김토스', nickname: '토스' }, role: 'member' },
      { user: { _id: 'u3', name: '이영희', nickname: '영희' }, role: 'member' },
    ],
  },
  { _id: 't2', name: '주말 동호회', displayMode: 'realName', members: [] },
];

export const sampleSummary: Summary = { income: 620000, expense: 308000, balance: 312000 };

export const sampleStats: MonthlyStats = {
  current: { income: 620000, expense: 308000 },
  previous: { income: 310000, expense: 154000 },
  incomeChange: 100,
  expenseChange: 100,
  categoryBreakdown: [
    { category: 'activity', total: 285000 },
    { category: 'meal', total: 23000 },
  ],
  topCategory: { category: 'activity', total: 285000 },
};

// 거래/분석 mockup과 동일한 4건 (수입 620,000 / 지출 308,000 / 순수익 312,000)
export const sampleTransactions: Transaction[] = [
  { id: 'd1', merchant: '디즈니랜드 1일권(3인)', type: 'expense', category: 'activity', amount: 285000, date: '2026-06-26', description: '' },
  { id: 'd2', merchant: '정기 모임 식사', type: 'expense', category: 'meal', amount: 23000, date: '2026-06-20', description: '' },
  { id: 'd3', merchant: '학교 지원금', type: 'income', category: 'donation', amount: 500000, date: '2026-06-12', description: '' },
  { id: 'd4', merchant: '6월 회비', type: 'income', category: 'membership', amount: 120000, date: '2026-06-03', description: '' },
];
