import { formatDateGroup, groupByDate } from './date';

describe('date', () => {
  it('formatDateGroup: "M월 D일 요일"', () => {
    // 2026-04-26 은 일요일
    expect(formatDateGroup('2026-04-26')).toBe('4월 26일 일요일');
  });
  it('groupByDate: 날짜 내림차순 그룹', () => {
    const items = [
      { id: 'a', date: '2026-04-02' },
      { id: 'b', date: '2026-04-26' },
      { id: 'c', date: '2026-04-26' },
    ];
    const groups = groupByDate(items);
    expect(groups.map((g) => g.label)).toEqual(['4월 26일 일요일', '4월 2일 목요일']);
    expect(groups[0]!.items.map((i) => i.id)).toEqual(['b', 'c']);
  });
});
