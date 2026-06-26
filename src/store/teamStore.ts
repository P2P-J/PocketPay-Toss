import { create } from 'zustand';
import { teamApi } from '../api/team';
import { dealApi } from '../api/deal';
import { getTeamId } from '../types/team';
import { dealToTransaction, type Transaction } from '../types/transaction';
import type { Team } from '../types/team';
import type { Summary, MonthlyStats } from '../types/stats';
import { pad } from '../lib/date';
// ⚠️ TEMP — 디자인 프리뷰용 샘플 데이터. 디자인 확정/Phase 3 후 제거.
import { sampleTeams, sampleTransactions } from '../constants/sampleData';

const USE_SAMPLE = true; // ⚠️ TEMP: 디자인 프리뷰. 실서비스 전 false/제거.

interface TeamState {
  teams: Team[];
  currentTeam: Team | null;
  summary: Summary;
  stats: MonthlyStats | null;
  transactions: Transaction[];
  loading: boolean;
  error: string | null;

  editingTransaction: Transaction | null;

  fetchTeams: () => Promise<void>;
  setCurrentTeam: (teamId: string) => Promise<void>;
  addTransaction: (input: Omit<Transaction, 'id'>) => void;
  updateTransaction: (id: string, input: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
  setEditingTransaction: (tx: Transaction | null) => void;
  reset: () => void;
}

const EMPTY_SUMMARY: Summary = { income: 0, expense: 0, balance: 0 };

// 로컬 더미 추가용 거래 id 시퀀스 (실 API 연동 시 서버 _id 사용)
let localSeq = 0;

const changePct = (cur: number, prev: number) => (prev > 0 ? Math.round(((cur - prev) / prev) * 100) : cur > 0 ? 100 : 0);

// 거래 목록으로부터 요약/통계 재계산.
//  - summary: 누적(전체 거래) income/expense/balance — "전체 잔액"
//  - stats: 이번 달 vs 지난 달 (전월 대비), 카테고리·최다지출은 이번 달 기준
function recompute(transactions: Transaction[]): { summary: Summary; stats: MonthlyStats } {
  const now = new Date();
  const curYm = `${now.getFullYear()}-${pad(now.getMonth() + 1)}`;
  const prev = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const prevYm = `${prev.getFullYear()}-${pad(prev.getMonth() + 1)}`;

  let allIncome = 0;
  let allExpense = 0;
  let curIncome = 0;
  let curExpense = 0;
  let prevIncome = 0;
  let prevExpense = 0;
  const catMap = new Map<string, number>(); // 이번 달 지출 카테고리별

  for (const t of transactions) {
    const ym = t.date.slice(0, 7);
    if (t.type === 'income') {
      allIncome += t.amount;
      if (ym === curYm) curIncome += t.amount;
      else if (ym === prevYm) prevIncome += t.amount;
    } else {
      allExpense += t.amount;
      if (ym === curYm) {
        curExpense += t.amount;
        catMap.set(t.category, (catMap.get(t.category) ?? 0) + t.amount);
      } else if (ym === prevYm) {
        prevExpense += t.amount;
      }
    }
  }

  const categoryBreakdown = [...catMap.entries()]
    .map(([category, total]) => ({ category, total, percent: curExpense > 0 ? Math.round((total / curExpense) * 100) : 0 }))
    .sort((a, b) => b.total - a.total);
  const top = categoryBreakdown[0];

  return {
    summary: { income: allIncome, expense: allExpense, balance: allIncome - allExpense },
    stats: {
      current: { income: curIncome, expense: curExpense },
      previous: { income: prevIncome, expense: prevExpense },
      incomeChange: changePct(curIncome, prevIncome),
      expenseChange: changePct(curExpense, prevExpense),
      categoryBreakdown,
      topCategory: top ? { category: top.category, total: top.total } : null,
    },
  };
}

// 거래 목록 변경(추가/수정/삭제) 시 요약·통계 동시 갱신
function statePatch(transactions: Transaction[]) {
  const r = recompute(transactions);
  return { transactions, summary: r.summary, stats: r.stats };
}

export const useTeamStore = create<TeamState>((set, get) => ({
  teams: [],
  currentTeam: null,
  summary: EMPTY_SUMMARY,
  stats: null,
  transactions: [],
  loading: false,
  error: null,
  editingTransaction: null,

  fetchTeams: async () => {
    if (USE_SAMPLE) {
      set({
        teams: sampleTeams,
        currentTeam: sampleTeams[0] ?? null,
        ...statePatch(sampleTransactions),
        loading: false,
        error: null,
      });
      return;
    }
    set({ loading: true, error: null });
    try {
      const res = await teamApi.getMyTeams();
      const teams = res.data || [];
      set({ teams });
      if (teams.length > 0 && teams[0]) {
        await get().setCurrentTeam(getTeamId(teams[0]));
      } else {
        set({ loading: false });
      }
    } catch (e) {
      set({ loading: false, error: e instanceof Error ? e.message : '모임을 불러오지 못했어요.' });
    }
  },

  setCurrentTeam: async (teamId: string) => {
    if (USE_SAMPLE) {
      set({
        currentTeam: sampleTeams.find((t) => getTeamId(t) === teamId) ?? sampleTeams[0] ?? null,
        ...statePatch(sampleTransactions),
        loading: false,
      });
      return;
    }
    set({ loading: true, error: null });
    try {
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth() + 1;
      const [teamRes, summaryRes, statsRes, dealsRes] = await Promise.all([
        teamApi.getTeam(teamId),
        dealApi.getSummary(teamId),
        dealApi.getMonthlyStats(teamId, year, month),
        dealApi.getMonthly(teamId, year, month),
      ]);
      set({
        currentTeam: teamRes.data,
        summary: summaryRes.data,
        stats: statsRes.data,
        transactions: (dealsRes.data || []).map(dealToTransaction),
        loading: false,
      });
    } catch (e) {
      set({ loading: false, error: e instanceof Error ? e.message : '데이터를 불러오지 못했어요.' });
    }
  },

  addTransaction: (input) => {
    const tx: Transaction = { ...input, id: `local-${++localSeq}` };
    set(statePatch([tx, ...get().transactions]));
  },

  updateTransaction: (id, input) => {
    set(statePatch(get().transactions.map((t) => (t.id === id ? { ...input, id } : t))));
  },

  deleteTransaction: (id) => {
    set(statePatch(get().transactions.filter((t) => t.id !== id)));
  },

  setEditingTransaction: (tx) => set({ editingTransaction: tx }),

  reset: () =>
    set({ teams: [], currentTeam: null, summary: EMPTY_SUMMARY, stats: null, transactions: [], loading: false, error: null, editingTransaction: null }),
}));
