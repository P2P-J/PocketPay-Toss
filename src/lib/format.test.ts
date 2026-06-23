import { formatWon, formatSigned } from './format';

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
});
