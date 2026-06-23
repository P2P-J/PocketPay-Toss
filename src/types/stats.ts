export interface Summary {
  income: number;
  expense: number;
  balance: number;
}

export interface MonthlyStats {
  current: { income: number; expense: number };
  previous: { income: number; expense: number };
  incomeChange: number;
  expenseChange: number;
  categoryBreakdown: { category: string; total: number }[];
  topCategory: { category: string; total: number } | null;
}
