// ⚠️ TEMP — 분석 화면 디자인 프리뷰용 더미. 실 API 연동 시 getAnalysisData를 교체.
import type { Transaction } from '../types/transaction';
import type { AnalysisData } from '../types/analysis';

// 사진 기준 6월 거래 (수입 620,000 / 지출 308,000)
const JUNE_TRANSACTIONS: Transaction[] = [
  { id: 'a1', merchant: '6월 회비', type: 'income', category: 'membership', amount: 120000, date: '2026-06-03', description: '' },
  { id: 'a2', merchant: '학교 지원금', type: 'income', category: 'donation', amount: 500000, date: '2026-06-12', description: '' },
  { id: 'a3', merchant: '정기 모임 식사', type: 'expense', category: 'meal', amount: 23000, date: '2026-06-20', description: '' },
  { id: 'a4', merchant: '디즈니랜드 1일권(3인)', type: 'expense', category: 'activity', amount: 285000, date: '2026-06-26', description: '' },
];

const JUNE_ANALYSIS: AnalysisData = {
  year: 2026,
  month: 6,
  summary: { totalExpense: 308000, totalIncome: 620000, net: 312000, expenseChangePct: 100 },
  trend: [
    { label: '1월', expense: 0 },
    { label: '2월', expense: 0 },
    { label: '3월', expense: 0 },
    { label: '4월', expense: 0 },
    { label: '5월', expense: 0 },
    { label: '6월', expense: 308000 },
  ],
  categories: [
    { category: 'activity', total: 285000, percent: 93 },
    { category: 'meal', total: 23000, percent: 7 },
  ],
  budget: {
    totalSpent: 308000,
    totalLimit: 400000,
    categories: [
      { category: 'activity', spent: 285000, limit: 300000 },
      { category: 'meal', spent: 23000, limit: 50000 },
    ],
  },
  split: {
    memberCount: 5,
    perPerson: 61600,
    totalExpense: 308000,
    members: [
      { userId: 'm1', name: '김민수', initial: '민', paid: 285000, balance: 223400 },
      { userId: 'm2', name: '이종혁', initial: '종', paid: 23000, balance: -38600 },
      { userId: 'm3', name: '박지은', initial: '지', paid: 0, balance: -61600 },
      { userId: 'm4', name: '정하린', initial: '하', paid: 0, balance: -61600 },
      { userId: 'm5', name: '최예나', initial: '예', paid: 0, balance: -61600 },
    ],
  },
  transactions: JUNE_TRANSACTIONS,
};

function emptyAnalysis(year: number, month: number): AnalysisData {
  return {
    year,
    month,
    summary: { totalExpense: 0, totalIncome: 0, net: 0, expenseChangePct: null },
    trend: [],
    categories: [],
    budget: { totalSpent: 0, totalLimit: 0, categories: [] },
    split: { memberCount: 0, perPerson: 0, totalExpense: 0, members: [] },
    transactions: [],
  };
}

// 실 API 교체 지점: 현재는 2026/6만 더미, 그 외 달은 빈 상태.
export function getAnalysisData(year: number, month: number): AnalysisData {
  if (year === 2026 && month === 6) return JUNE_ANALYSIS;
  return emptyAnalysis(year, month);
}
