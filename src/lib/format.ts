// Hermes에는 Intl 천단위 그룹이 불안정 → 정규식 콤마 사용
function withCommas(n: number): string {
  return Math.abs(Math.round(n)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
export function formatWon(amount: number): string {
  return `₩${withCommas(amount)}`;
}
export function formatSigned(amount: number, type: 'income' | 'expense'): string {
  const sign = type === 'income' ? '+' : '-';
  return `${sign}₩${withCommas(amount)}`;
}
