const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

function dayKey(iso: string): string {
  return iso.slice(0, 10); // YYYY-MM-DD
}

export function formatDateGroup(iso: string): string {
  const d = new Date(dayKey(iso) + 'T00:00:00');
  return `${d.getMonth() + 1}월 ${d.getDate()}일 ${WEEKDAYS[d.getDay()]}요일`;
}

export interface DateGroup<T> {
  key: string;
  label: string;
  items: T[];
}

export function groupByDate<T extends { date: string }>(items: T[]): DateGroup<T>[] {
  const map = new Map<string, T[]>();
  for (const item of items) {
    const key = dayKey(item.date);
    const arr = map.get(key) ?? [];
    arr.push(item);
    map.set(key, arr);
  }
  return [...map.keys()]
    .sort((a, b) => (a < b ? 1 : -1)) // 내림차순(최신 먼저)
    .map((key) => ({ key, label: formatDateGroup(key), items: map.get(key)! }));
}
