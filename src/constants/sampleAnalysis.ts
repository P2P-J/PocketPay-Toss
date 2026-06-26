// ⚠️ TEMP — 분석 화면 중 거래로부터 파생 불가한 부분만 더미로 둔다.
//  - 예산 한도(예산 모델 없음) / 멤버 분담(결제자 데이터 필요)
//  요약·추세·카테고리·캘린더는 teamStore 거래에서 실시간 파생 (lib/analysis.ts)
import type { MemberSplit } from '../types/analysis';

export const SAMPLE_BUDGET = {
  totalLimit: 400000,
  limits: [
    { category: 'activity', limit: 300000 },
    { category: 'meal', limit: 50000 },
  ] as { category: string; limit: number }[],
};

export const SAMPLE_SPLIT: MemberSplit = {
  memberCount: 5,
  perPerson: 61600,
  totalExpense: 308000,
  members: [
    { userId: 'm1', name: '김민수', initial: '민', paid: 285000, balance: 223400 },
    { userId: 'm2', name: '이종혁', initial: '종', paid: 23000, balance: -38600 },
    { userId: 'm3', name: '박지은', initial: '지', paid: 0, balance: -61600 },
    { userId: 'm4', name: '정하린', initial: '하', paid: 0, balance: -61600 },
    { userId: 'm5', name: '최예나', initial: '예', paid: 0, balance: -61600 },
  ],
};
