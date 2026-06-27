const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

export const pad = (n: number): string => String(n).padStart(2, '0');

export interface YearMonth { y: number; m: number; }

// 연/월 이동 (1월에서 -1 → 전년 12월, 12월에서 +1 → 다음해 1월)
export function shiftMonth({ y, m }: YearMonth, delta: number): YearMonth {
  let nm = m + delta;
  let ny = y;
  if (nm < 1) { nm = 12; ny -= 1; }
  if (nm > 12) { nm = 1; ny += 1; }
  return { y: ny, m: nm };
}

// 오늘 날짜를 로컬 기준 YYYY-MM-DD로
export function todayIso(): string {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

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
