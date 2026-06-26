import { create } from 'zustand';
import { teamApi } from '../api/team';
import { dealApi } from '../api/deal';
import { getTeamId } from '../types/team';
import { dealToTransaction, type Transaction } from '../types/transaction';
import type { Team } from '../types/team';
import type { Summary, MonthlyStats } from '../types/stats';
// ⚠️ TEMP — 디자인 프리뷰용 샘플 데이터. 디자인 확정/Phase 3 후 제거.
import { sampleTeams, sampleSummary, sampleStats, sampleTransactions } from '../constants/sampleData';

const USE_SAMPLE = true; // ⚠️ TEMP: 디자인 프리뷰. 실서비스 전 false/제거.

interface TeamState {
  teams: Team[];
  currentTeam: Team | null;
  summary: Summary;
  stats: MonthlyStats | null;
  transactions: Transaction[];
  loading: boolean;
  error: string | null;

  fetchTeams: () => Promise<void>;
  setCurrentTeam: (teamId: string) => Promise<void>;
  addTransaction: (input: Omit<Transaction, 'id'>) => void;
  reset: () => void;
}

const EMPTY_SUMMARY: Summary = { income: 0, expense: 0, balance: 0 };

// 로컬 더미 추가용 거래 id 시퀀스 (실 API 연동 시 서버 _id 사용)
let localSeq = 0;

// 거래 목록으로부터 요약/카테고리 통계 재계산 (홈·거래 반영용)
function recompute(transactions: Transaction[]) {
  let income = 0;
  let expense = 0;
  const catMap = new Map<string, number>();
  for (const t of transactions) {
    if (t.type === 'income') {
      income += t.amount;
    } else {
      expense += t.amount;
      catMap.set(t.category, (catMap.get(t.category) ?? 0) + t.amount);
    }
  }
  const categoryBreakdown = [...catMap.entries()]
    .map(([category, total]) => ({ category, total, percent: expense > 0 ? Math.round((total / expense) * 100) : 0 }))
    .sort((a, b) => b.total - a.total);
  const top = categoryBreakdown[0];
  return {
    summary: { income, expense, balance: income - expense },
    categoryBreakdown,
    topCategory: top ? { category: top.category, total: top.total } : null,
  };
}

export const useTeamStore = create<TeamState>((set, get) => ({
  teams: [],
  currentTeam: null,
  summary: EMPTY_SUMMARY,
  stats: null,
  transactions: [],
  loading: false,
  error: null,

  fetchTeams: async () => {
    if (USE_SAMPLE) {
      set({
        teams: sampleTeams,
        currentTeam: sampleTeams[0] ?? null,
        summary: sampleSummary,
        stats: sampleStats,
        transactions: sampleTransactions,
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
        summary: sampleSummary,
        stats: sampleStats,
        transactions: sampleTransactions,
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
    const transactions = [tx, ...get().transactions];
    const r = recompute(transactions);
    const prevStats = get().stats;
    set({
      transactions,
      summary: r.summary,
      stats: prevStats
        ? { ...prevStats, current: { income: r.summary.income, expense: r.summary.expense }, categoryBreakdown: r.categoryBreakdown, topCategory: r.topCategory }
        : {
            current: { income: r.summary.income, expense: r.summary.expense },
            previous: { income: 0, expense: 0 },
            incomeChange: 0,
            expenseChange: 0,
            categoryBreakdown: r.categoryBreakdown,
            topCategory: r.topCategory,
          },
    });
  },

  reset: () =>
    set({ teams: [], currentTeam: null, summary: EMPTY_SUMMARY, stats: null, transactions: [], loading: false, error: null }),
}));
