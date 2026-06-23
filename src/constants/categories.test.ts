import { getCategoryEmoji, getCategoryLabel } from './categories';

describe('categories', () => {
  it('알려진 카테고리는 이모지/라벨 반환', () => {
    expect(getCategoryEmoji('activity')).toBe('⚽');
    expect(getCategoryLabel('membership')).toBe('회비');
  });
  it('미지정/미상은 안전 기본값', () => {
    expect(getCategoryEmoji(undefined)).toBe('📋');
    expect(getCategoryLabel(null)).toBe('-');
    expect(getCategoryEmoji('알수없음')).toBe('📋');
  });
});
