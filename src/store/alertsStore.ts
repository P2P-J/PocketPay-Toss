import { create } from 'zustand';
import { PREVIEW_MODE } from '../constants/config';
import { notificationsApi } from '../api/notifications';
import { dutchApi } from '../api/dutch';
import { formatWon } from '../lib/format';

export interface AppAlert {
  id: string;
  title: string;
  body: string;
  date: string;
  read: boolean;
  kind?: 'invite' | 'dutch';
  teamId?: string; // invite일 때 수락/거절 대상
  dutchId?: string; // dutch일 때 확인(dismiss) 대상
  amount?: number; // dutch 금액
  account?: string; // dutch 받을 계좌 안내
}

// 더미(프리뷰) 샘플 알림
const SAMPLE: AppAlert[] = [
  { id: 'd0', title: '정산 요청', body: '민수님이 정산을 요청했어요 · 1인당 ₩35,000', date: '2026-06-26', read: false, kind: 'dutch', dutchId: 'sample-d1', amount: 35000, account: '토스뱅크 1000-1234-5678 (김민수)' },
  { id: 'al2', title: '새 거래', body: '‘디즈니랜드 1일권(3인)’ 거래가 등록됐어요.', date: '2026-06-26', read: false },
  { id: 'al3', title: '환영해요', body: '작은 모임에 오신 걸 환영해요!', date: '2026-06-20', read: true },
];

interface AlertsState {
  alerts: AppAlert[];
  unreadCount: number;
  fetchUnread: () => Promise<void>; // 종 뱃지용(가벼움)
  fetchAlerts: () => Promise<void>; // 알림함 진입 시
  markAllRead: () => Promise<void>; // 알림함 진입 시 읽음 처리
  dismissDutch: (dutchId: string) => Promise<void>; // 정산 요청 확인
}

export const useAlertsStore = create<AlertsState>((set) => ({
  alerts: PREVIEW_MODE ? SAMPLE : [],
  unreadCount: PREVIEW_MODE ? SAMPLE.filter((a) => !a.read).length : 0,

  fetchUnread: async () => {
    if (PREVIEW_MODE) return;
    try {
      const res = await notificationsApi.getUnreadCount();
      set({ unreadCount: res.data.count });
    } catch {
      // 무시 — 뱃지만 못 갱신
    }
  },

  fetchAlerts: async () => {
    if (PREVIEW_MODE) return; // 더미는 SAMPLE 유지
    const [invRes, dutchRes] = await Promise.all([
      notificationsApi.getInvitations().catch(() => ({ data: [] })),
      dutchApi.list().catch(() => ({ data: [] })),
    ]);
    const invites: AppAlert[] = invRes.data.map((iv) => ({
      id: `invite-${iv.teamId}`,
      title: '모임 초대',
      body: `‘${iv.teamName}’에 초대받았어요.`,
      date: (iv.invitedAt ?? '').slice(0, 10),
      read: false,
      kind: 'invite',
      teamId: iv.teamId,
    }));
    const dutches: AppAlert[] = dutchRes.data.map((d) => {
      const acc = d.accountSnapshot;
      return {
        id: `dutch-${d._id}`,
        title: '정산 요청',
        body: `${d.requesterDisplayName}님이 정산을 요청했어요 · 1인당 ${formatWon(d.amount)}`,
        date: (d.createdAt ?? '').slice(0, 10),
        read: false,
        kind: 'dutch' as const,
        dutchId: d._id,
        amount: d.amount,
        account: acc?.bank && acc?.number && acc?.holder ? `${acc.bank} ${acc.number} (${acc.holder})` : undefined,
      };
    });
    const merged = [...invites, ...dutches].sort((a, b) => b.date.localeCompare(a.date));
    set({ alerts: merged });
  },

  markAllRead: async () => {
    if (!PREVIEW_MODE) {
      try { await notificationsApi.markViewed(); } catch { /* 무시 */ }
    }
    set((s) => ({ alerts: s.alerts.map((a) => ({ ...a, read: true })), unreadCount: 0 }));
  },

  dismissDutch: async (dutchId: string) => {
    if (!PREVIEW_MODE) {
      try { await dutchApi.dismiss(dutchId); } catch { /* 무시 */ }
    }
    set((s) => {
      const alerts = s.alerts.filter((a) => a.dutchId !== dutchId);
      // 프리뷰는 뱃지를 알림에서 파생, 실모드는 서버 카운트 유지
      return PREVIEW_MODE ? { alerts, unreadCount: alerts.filter((a) => !a.read).length } : { alerts };
    });
  },
}));

export const selectUnreadCount = (s: AlertsState): number => s.unreadCount;
