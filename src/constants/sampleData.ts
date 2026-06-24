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
    { category: 'cafe', total: 23000 },
  ],
  topCategory: { category: 'activity', total: 285000 },
};

export const sampleTransactions: Transaction[] = [
  { id: 'd1', merchant: '디즈니랜드 1일권(3인)', type: 'expense', category: 'activity', amount: 285000, date: '2026-06-26', description: '' },
  { id: 'd2', merchant: '학교 지원금', type: 'income', category: 'donation', amount: 500000, date: '2026-06-12', description: '' },
  { id: 'd3', merchant: '이상이 회비', type: 'income', category: 'dues', amount: 20000, date: '2026-06-01', description: '' },
  { id: 'd4', merchant: '김거을 회비', type: 'income', category: 'dues', amount: 20000, date: '2026-06-01', description: '' },
  { id: 'd5', merchant: '스타벅스', type: 'expense', category: 'cafe', amount: 12000, date: '2026-06-01', description: '' },
  { id: 'd6', merchant: '동아리방 간식', type: 'expense', category: 'snack', amount: 11000, date: '2026-06-01', description: '' },
];
