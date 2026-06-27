import { create } from 'zustand';
import { PREVIEW_MODE } from '../constants/config';
import { notificationsApi } from '../api/notifications';

export interface AppAlert {
  id: string;
  title: string;
  body: string;
  date: string;
  read: boolean;
  kind?: 'invite';
  teamId?: string; // invite일 때 수락/거절 대상
}

// 더미(프리뷰) 샘플 알림
const SAMPLE: AppAlert[] = [
  { id: 'al1', title: '정산 요청', body: '‘정기 모임 식사’ 정산이 요청됐어요.', date: '2026-06-26', read: false },
  { id: 'al2', title: '새 거래', body: '‘디즈니랜드 1일권(3인)’ 거래가 등록됐어요.', date: '2026-06-26', read: false },
  { id: 'al3', title: '환영해요', body: '작은 모임에 오신 걸 환영해요!', date: '2026-06-20', read: true },
];

interface AlertsState {
  alerts: AppAlert[];
  unreadCount: number;
  fetchUnread: () => Promise<void>; // 종 뱃지용(가벼움)
  fetchAlerts: () => Promise<void>; // 알림함 진입 시
  markAllRead: () => Promise<void>; // 알림함 진입 시 읽음 처리
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
    try {
      const res = await notificationsApi.getInvitations();
      const alerts: AppAlert[] = res.data.map((iv) => ({
        id: `invite-${iv.teamId}`,
        title: '모임 초대',
        body: `‘${iv.teamName}’에 초대받았어요.`,
        date: (iv.invitedAt ?? '').slice(0, 10),
        read: false,
        kind: 'invite',
        teamId: iv.teamId,
      }));
      set({ alerts });
    } catch {
      // 무시 — 빈 목록 유지
    }
  },

  markAllRead: async () => {
    if (!PREVIEW_MODE) {
      try { await notificationsApi.markViewed(); } catch { /* 무시 */ }
    }
    set((s) => ({ alerts: s.alerts.map((a) => ({ ...a, read: true })), unreadCount: 0 }));
  },
}));

export const selectUnreadCount = (s: AlertsState): number => s.unreadCount;
