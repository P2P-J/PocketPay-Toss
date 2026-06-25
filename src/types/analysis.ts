import type { Transaction } from './transaction';

// 분석 화면 전체가 소비하는 단일 데이터 인터페이스.
// 지금은 더미(sampleAnalysis)로 채우지만, 실데이터 전환 시 이 타입만 맞추면 됨.
// 각 필드의 실제 출처는 주석 참고.

export interface AnalysisSummary {
  totalExpense: number; // getMonthlyStats.current.expense
  totalIncome: number; // getMonthlyStats.current.income
  net: number; // 순수익 = income - expense
  expenseChangePct: number | null; // 전월 대비 지출 변화 % (getMonthlyStats.expenseChange)
}

export interface MonthlyTrendPoint {
  label: string; // '1월'
  expense: number;
}

export interface CategorySlice {
  category: string;
  total: number;
  percent: number; // 0~100, 전체 지출 대비 (getMonthlyStats.categoryBreakdown)
}

export interface CategoryBudget {
  category: string;
  spent: number;
  limit: number;
}

export interface Budget {
  // ⚠️ 백엔드 모델 없음 — 신규 기능. 지금은 더미.
  totalSpent: number;
  totalLimit: number;
  categories: CategoryBudget[];
}

export interface MemberShare {
  userId: string;
  name: string;
  initial: string; // 아바타 이니셜
  paid: number; // 낸 금액
  balance: number; // 정산 잔액 (낸 금액 - 1인당 부담). +면 받을 돈 / -면 낼 돈
}

export interface MemberSplit {
  // ⚠️ 더치페이(dutch) 확장 + 멤버 집계 필요. 지금은 더미.
  memberCount: number;
  perPerson: number; // 1인당 부담 (totalExpense / memberCount)
  totalExpense: number;
  members: MemberShare[];
}

export interface AnalysisData {
  year: number;
  month: number;
  summary: AnalysisSummary;
  trend: MonthlyTrendPoint[]; // ⚠️ 6개월 집계 — 백엔드 추가 필요
  categories: CategorySlice[]; // 도넛 + 카테고리 막대 공용
  budget: Budget;
  split: MemberSplit;
  transactions: Transaction[]; // 이번 달 거래 — 캘린더/선택일 파생용 (/deals 월별)
}
