// ⚠️ TEMP — 디자인 프리뷰용 샘플 데이터. 디자인 확정 후 + Phase 3(생성 기능) 들어오면 제거.
// summary/stats는 teamStore.recompute(sampleTransactions)로 파생 — 여기선 거래만 정의.
import type { Team } from '../types/team';
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

// 거래/분석 mockup과 동일한 4건 (수입 620,000 / 지출 308,000 / 순수익 312,000)
export const sampleTransactions: Transaction[] = [
  { id: 'd1', merchant: '디즈니랜드 1일권(3인)', type: 'expense', category: 'activity', amount: 285000, date: '2026-06-26', description: '' },
  { id: 'd2', merchant: '정기 모임 식사', type: 'expense', category: 'meal', amount: 23000, date: '2026-06-20', description: '' },
  { id: 'd3', merchant: '학교 지원금', type: 'income', category: 'donation', amount: 500000, date: '2026-06-12', description: '' },
  { id: 'd4', merchant: '6월 회비', type: 'income', category: 'membership', amount: 120000, date: '2026-06-03', description: '' },
];
