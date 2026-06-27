// 회비 납부 현황 (실제 수금이 아니라 "누가 냈는지" 기록·표시용)
export interface FeeMember {
  userId: string;
  name: string;
  role: string;
  paid: boolean;
  paymentId?: string; // 납부 기록 id (취소 시)
}

export interface FeeStatus {
  feeAmount: number;
  feeDueDay: number;
  year: number;
  month: number;
  members: FeeMember[];
  paidCount: number;
}
