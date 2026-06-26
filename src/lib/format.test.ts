import { formatWon, formatSigned, formatAmountInput, parseAmount } from './format';

describe('format', () => {
  it('formatWon: ₩ + 천단위 콤마(절댓값)', () => {
    expect(formatWon(312000)).toBe('₩312,000');
    expect(formatWon(-285000)).toBe('₩285,000');
    expect(formatWon(0)).toBe('₩0');
  });
  it('formatSigned: 수입 +, 지출 -', () => {
    expect(formatSigned(620000, 'income')).toBe('+₩620,000');
    expect(formatSigned(308000, 'expense')).toBe('-₩308,000');
  });
  it('formatAmountInput: 0은 빈 문자열, 그 외 콤마', () => {
    expect(formatAmountInput(0)).toBe('');
    expect(formatAmountInput(50000)).toBe('50,000');
  });
  it('parseAmount: 숫자만 추출 + 음수 불가 + 상한 1억 클램프', () => {
    expect(parseAmount('₩50,000')).toBe(50000);
    expect(parseAmount('abc')).toBe(0);
    expect(parseAmount('-3000')).toBe(3000); // 음수기호 제거
    expect(parseAmount('999999999999')).toBe(100000000); // 1억 클램프
  });
});
