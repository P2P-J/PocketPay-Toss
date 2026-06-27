import { create } from 'zustand';

export interface AppAlert {
  id: string;
  title: string;
  body: string;
  date: string;
  read: boolean;
}

interface AlertsState {
  alerts: AppAlert[];
  markAllRead: () => void;
}

// ⚠️ 더미(세션). 실연동 시 /invitations·더치 요청 등으로 채우고 unread는 서버 카운트로.
export const useAlertsStore = create<AlertsState>((set) => ({
  alerts: [
    { id: 'al1', title: '정산 요청', body: '‘정기 모임 식사’ 정산이 요청됐어요.', date: '2026-06-26', read: false },
    { id: 'al2', title: '새 거래', body: '‘디즈니랜드 1일권(3인)’ 거래가 등록됐어요.', date: '2026-06-26', read: false },
    { id: 'al3', title: '환영해요', body: '작은 모임에 오신 걸 환영해요!', date: '2026-06-20', read: true },
  ],
  markAllRead: () => set((s) => ({ alerts: s.alerts.map((a) => ({ ...a, read: true })) })),
}));

export const selectUnreadCount = (s: AlertsState): number => s.alerts.filter((a) => !a.read).length;
