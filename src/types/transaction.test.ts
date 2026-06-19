import { dealToTransaction, transactionToDealPayload, type Deal } from './transaction';

describe('dealToTransaction', () => {
  const baseDeal: Deal = {
    _id: 'd1',
    storeInfo: '스타벅스',
    division: '지출',
    description: '아메리카노',
    category: '카페',
    price: 4500,
    date: '2026-06-10',
  };

  it('백엔드 division "지출" → 프론트 type "expense"', () => {
    const t = dealToTransaction(baseDeal);
    expect(t).toEqual({
      id: 'd1',
      merchant: '스타벅스',
      type: 'expense',
      description: '아메리카노',
      category: '카페',
      amount: 4500,
      date: '2026-06-10',
      receiptUrl: undefined,
    });
  });

  it('division "수입" → type "income"', () => {
    expect(dealToTransaction({ ...baseDeal, division: '수입' }).type).toBe('income');
  });

  it('빈 필드는 안전한 기본값으로 채운다', () => {
    const t = dealToTransaction({ _id: 'd2', division: '지출' } as Deal);
    expect(t.merchant).toBe('');
    expect(t.amount).toBe(0);
    expect(t.category).toBe('');
  });
});

describe('transactionToDealPayload', () => {
  it('type "income" → division "수입", 금액은 숫자로 변환', () => {
    const p = transactionToDealPayload({
      merchant: '회비',
      type: 'income',
      category: '회비',
      amount: 30000,
      date: '2026-06-01',
      teamId: 't1',
    });
    expect(p.division).toBe('수입');
    expect(p.price).toBe(30000);
    expect(p.storeInfo).toBe('회비');
    expect(p.teamId).toBe('t1');
  });

  it('category 미지정 시 "기타"로 기본 처리', () => {
    const p = transactionToDealPayload({ type: 'expense', amount: 1000, date: '2026-06-01' });
    expect(p.category).toBe('기타');
    expect(p.division).toBe('지출');
  });
});
