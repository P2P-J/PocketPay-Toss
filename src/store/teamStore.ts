import { create } from 'zustand';
import { teamApi } from '../api/team';
import { dealApi } from '../api/deal';
import { getTeamId } from '../types/team';
import { dealToTransaction, type Transaction } from '../types/transaction';
import type { Team } from '../types/team';
import type { Summary, MonthlyStats } from '../types/stats';

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
  reset: () => void;
}

const EMPTY_SUMMARY: Summary = { income: 0, expense: 0, balance: 0 };

export const useTeamStore = create<TeamState>((set, get) => ({
  teams: [],
  currentTeam: null,
  summary: EMPTY_SUMMARY,
  stats: null,
  transactions: [],
  loading: false,
  error: null,

  fetchTeams: async () => {
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

  reset: () =>
    set({ teams: [], currentTeam: null, summary: EMPTY_SUMMARY, stats: null, transactions: [], loading: false, error: null }),
}));
