import type { Transaction } from '../types/transaction';
import type { AnalysisData, CategorySlice, MonthlyTrendPoint } from '../types/analysis';
import type { BudgetConfig } from '../store/budgetStore';
import { SAMPLE_BUDGET, SAMPLE_SPLIT } from '../constants/sampleAnalysis';

const pad = (n: number) => String(n).padStart(2, '0');
const ymStr = (y: number, m: number) => `${y}-${pad(m)}`;

function monthMinus(y: number, m: number, i: number): { y: number; m: number } {
  let mm = m - i;
  let yy = y;
  while (mm < 1) { mm += 12; yy -= 1; }
  return { y: yy, m: mm };
}

function monthExpense(all: Transaction[], y: number, m: number): number {
  const ym = ymStr(y, m);
  return all.filter((t) => t.type === 'expense' && t.date.slice(0, 7) === ym).reduce((s, t) => s + t.amount, 0);
}

// teamStore 거래에서 분석 화면 데이터를 파생한다.
// 거래로부터 못 구하는 예산 한도·멤버 분담만 더미(sampleAnalysis) 사용.
export function buildAnalysisData(
  year: number,
  month: number,
  all: Transaction[],
  budgetConfig: BudgetConfig = SAMPLE_BUDGET,
): AnalysisData {
  const cur = ymStr(year, month);
  const txs = all.filter((t) => t.date.slice(0, 7) === cur);

  let income = 0;
  let expense = 0;
  const catMap = new Map<string, number>();
  for (const t of txs) {
    if (t.type === 'income') {
      income += t.amount;
    } else {
      expense += t.amount;
      catMap.set(t.category, (catMap.get(t.category) ?? 0) + t.amount);
    }
  }

  const prev = monthMinus(year, month, 1);
  const prevExpense = monthExpense(all, prev.y, prev.m);
  const expenseChangePct = prevExpense > 0 ? Math.round(((expense - prevExpense) / prevExpense) * 100) : expense > 0 ? 100 : null;

  const categories: CategorySlice[] = [...catMap.entries()]
    .map(([category, total]) => ({ category, total, percent: expense > 0 ? Math.round((total / expense) * 100) : 0 }))
    .sort((a, b) => b.total - a.total);

  const trend: MonthlyTrendPoint[] = [];
  for (let i = 5; i >= 0; i -= 1) {
    const d = monthMinus(year, month, i);
    trend.push({ label: `${d.m}월`, expense: monthExpense(all, d.y, d.m) });
  }

  const budget = {
    totalSpent: expense,
    totalLimit: budgetConfig.totalLimit,
    categories: budgetConfig.limits.map((l) => ({ category: l.category, spent: catMap.get(l.category) ?? 0, limit: l.limit })),
  };

  return {
    year,
    month,
    summary: { totalExpense: expense, totalIncome: income, net: income - expense, expenseChangePct },
    trend,
    categories,
    budget,
    split: SAMPLE_SPLIT, // ⚠️ 결제자 데이터 필요 → 더미 유지
    transactions: txs,
  };
}
