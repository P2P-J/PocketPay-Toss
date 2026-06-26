import { create } from 'zustand';

export interface NotifSettings {
  newDeal: boolean; // 새 거래 등록
  settlement: boolean; // 정산·회비
  notice: boolean; // 공지사항
}

interface NotifState extends NotifSettings {
  set: (key: keyof NotifSettings, value: boolean) => void;
}

// ⚠️ 로컬(세션) — 실제 푸시 발송 연동은 추후(토스 푸시).
export const useNotifStore = create<NotifState>((setState) => ({
  newDeal: true,
  settlement: true,
  notice: true,
  set: (key, value) => setState({ [key]: value } as Pick<NotifSettings, typeof key>),
}));
