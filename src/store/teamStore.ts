import { create } from 'zustand';
import { teamApi } from '../api/team';
import { dealApi } from '../api/deal';
import { getTeamId, getMemberId } from '../types/team';
import { dealToTransaction, transactionToDealPayload, type Transaction } from '../types/transaction';
import type { Team, TeamCategory, TeamDisplayMode, TeamAccountMode } from '../types/team';
import type { Summary, MonthlyStats } from '../types/stats';
import { pad } from '../lib/date';
import { PREVIEW_MODE } from '../constants/config';
// ⚠️ TEMP — 디자인 프리뷰용 샘플 데이터. 디자인 확정/Phase 3 후 제거.
import { sampleTeams, sampleTransactions } from '../constants/sampleData';

// 프리뷰 모드면 샘플 데이터 사용(config.PREVIEW_MODE 한 곳에서 토글)
const USE_SAMPLE = PREVIEW_MODE;

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
  createTeam: (input: NewTeamInput) => Promise<void>;
  updateTeam: (input: NewTeamInput) => Promise<void>;
  deleteTeam: () => Promise<void>;
  removeMember: (userId: string) => Promise<void>;
  transferOwner: (userId: string) => Promise<void>;
  addTransaction: (input: Omit<Transaction, 'id'>) => Promise<void>;
  updateTransaction: (id: string, input: Omit<Transaction, 'id'>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  setEditingTransaction: (tx: Transaction | null) => void;
  reset: () => void;
}

const EMPTY_SUMMARY: Summary = { income: 0, expense: 0, balance: 0 };

// 새 모임 생성 입력 (백엔드 Team 생성 페이로드와 동일 필드)
export interface NewTeamInput {
  name: string;
  description?: string;
  category: TeamCategory;
  displayMode: TeamDisplayMode;
  accountMode: TeamAccountMode;
  feeEnabled: boolean;
  feeAmount?: number;
  feeDueDay?: number;
}

// 로컬 더미 추가용 시퀀스 (실 API 연동 시 서버 _id 사용)
let localSeq = 0;
let localTeamSeq = 0;

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

export const useTeamStore = create<TeamState>((set, get) => {
  // 실모드 변이 공통: 현재 팀 기준 loading→호출→재조회→에러 처리 (USE_SAMPLE 분기는 각 액션에서)
  const runMutation = async (errMsg: string, call: (teamId: string) => Promise<unknown>) => {
    const team = get().currentTeam;
    if (!team) return;
    const id = getTeamId(team);
    set({ loading: true, error: null });
    try {
      await call(id);
      await get().setCurrentTeam(id);
    } catch (e) {
      set({ loading: false, error: e instanceof Error ? e.message : errMsg });
    }
  };

  return {
  teams: [],
  currentTeam: null,
  summary: EMPTY_SUMMARY,
  stats: null,
  transactions: [],
  loading: false,
  error: null,
  editingTransaction: null,

  fetchTeams: async () => {
    // 더미: 이미 로드됐으면 재시드 안 함(생성 모임 보존). 실모드는 재조회 허용(초대 수락 등 반영).
    if (USE_SAMPLE && get().teams.length > 0) return;
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
      // 샘플 거래는 청바지(t1)만. 그 외 팀(주말 동호회/새 모임)은 빈 거래.
      set({
        currentTeam: sampleTeams.find((t) => getTeamId(t) === teamId) ?? sampleTeams[0] ?? null,
        ...statePatch(teamId === 't1' ? sampleTransactions : []),
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

  addTransaction: async (input) => {
    if (USE_SAMPLE) {
      const tx: Transaction = { ...input, id: `local-${++localSeq}` };
      set(statePatch([tx, ...get().transactions]));
      return;
    }
    await runMutation('거래 등록에 실패했어요.', (teamId) => dealApi.create(transactionToDealPayload({ ...input, teamId })));
  },

  updateTransaction: async (id, input) => {
    if (USE_SAMPLE) {
      set(statePatch(get().transactions.map((t) => (t.id === id ? { ...input, id } : t))));
      return;
    }
    await runMutation('거래 수정에 실패했어요.', () => dealApi.update(id, transactionToDealPayload(input)));
  },

  deleteTransaction: async (id) => {
    if (USE_SAMPLE) {
      set(statePatch(get().transactions.filter((t) => t.id !== id)));
      return;
    }
    await runMutation('거래 삭제에 실패했어요.', () => dealApi.remove(id));
  },

  createTeam: async (input) => {
    if (USE_SAMPLE) {
      // 로컬 생성(세션). 생성자 owner + 빈 거래.
      const team: Team = {
        _id: `local-team-${++localTeamSeq}`,
        name: input.name,
        description: input.description,
        category: input.category,
        displayMode: input.displayMode,
        accountMode: input.accountMode,
        feeEnabled: input.feeEnabled,
        feeAmount: input.feeEnabled ? input.feeAmount : undefined,
        feeDueDay: input.feeEnabled ? input.feeDueDay : undefined,
        members: [{ user: { _id: 'me', name: '나', nickname: '나' }, role: 'owner' }],
      };
      set({ teams: [...get().teams, team], currentTeam: team, ...statePatch([]) });
      return;
    }
    set({ loading: true, error: null });
    try {
      const res = await teamApi.create(input); // 생성자 owner는 백엔드가 처리
      const teamsRes = await teamApi.getMyTeams();
      set({ teams: teamsRes.data || [] });
      if (res.data) await get().setCurrentTeam(getTeamId(res.data));
      else set({ loading: false });
    } catch (e) {
      set({ loading: false, error: e instanceof Error ? e.message : '모임 생성에 실패했어요.' });
    }
  },

  updateTeam: async (input) => {
    const team = get().currentTeam;
    if (!team) return;
    const id = getTeamId(team);
    const fields = {
      name: input.name,
      description: input.description,
      category: input.category,
      displayMode: input.displayMode,
      accountMode: input.accountMode,
      feeEnabled: input.feeEnabled,
      feeAmount: input.feeEnabled ? input.feeAmount : undefined,
      feeDueDay: input.feeEnabled ? input.feeDueDay : undefined,
    };
    if (USE_SAMPLE) {
      const updated = { ...team, ...fields };
      set({ teams: get().teams.map((t) => (getTeamId(t) === id ? updated : t)), currentTeam: updated });
      return;
    }
    await runMutation('모임 수정에 실패했어요.', () => teamApi.update(id, fields));
  },

  deleteTeam: async () => {
    const team = get().currentTeam;
    if (!team) return;
    const id = getTeamId(team);
    if (USE_SAMPLE) {
      const remaining = get().teams.filter((t) => getTeamId(t) !== id);
      const next = remaining[0] ?? null;
      set({
        teams: remaining,
        currentTeam: next,
        ...statePatch(next && getTeamId(next) === 't1' ? sampleTransactions : []),
      });
      return;
    }
    set({ loading: true, error: null });
    try {
      await teamApi.remove(id);
      set({ teams: [], currentTeam: null });
      await get().fetchTeams();
    } catch (e) {
      set({ loading: false, error: e instanceof Error ? e.message : '모임 삭제에 실패했어요.' });
    }
  },

  removeMember: async (userId) => {
    const team = get().currentTeam;
    if (!team) return;
    const id = getTeamId(team);
    if (USE_SAMPLE) {
      const members = (team.members ?? []).filter((m) => getMemberId(m) !== userId);
      const updated = { ...team, members };
      set({ teams: get().teams.map((t) => (getTeamId(t) === id ? updated : t)), currentTeam: updated });
      return;
    }
    await runMutation('멤버 강퇴에 실패했어요.', (teamId) => teamApi.removeMember(teamId, userId));
  },

  transferOwner: async (userId) => {
    const team = get().currentTeam;
    if (!team) return;
    const id = getTeamId(team);
    if (USE_SAMPLE) {
      const members = (team.members ?? []).map((m) => {
        const mid = getMemberId(m);
        if (mid === userId) return { ...m, role: 'owner' };
        if (m.role === 'owner') return { ...m, role: 'member' };
        return m;
      });
      const updated = { ...team, members };
      set({ teams: get().teams.map((t) => (getTeamId(t) === id ? updated : t)), currentTeam: updated });
      return;
    }
    await runMutation('권한 위임에 실패했어요.', (teamId) => teamApi.transferOwner(teamId, userId));
  },

  setEditingTransaction: (tx) => set({ editingTransaction: tx }),

  reset: () =>
    set({ teams: [], currentTeam: null, summary: EMPTY_SUMMARY, stats: null, transactions: [], loading: false, error: null, editingTransaction: null }),
  };
});
