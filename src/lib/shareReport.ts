import { formatWon } from './format';
import { getCategoryLabel } from '../constants/categories';
import type { AnalysisData } from '../types/analysis';

// 정산 리포트를 단톡방 등에 공유할 텍스트로 변환 (토스 share는 텍스트만 지원)
export function buildReportText(teamName: string, data: AnalysisData): string {
  const { year, month, summary, categories } = data;
  const net = summary.net;
  const lines: string[] = [
    `[${teamName}] ${year}년 ${month}월 정산 리포트`,
    `수입 +${formatWon(summary.totalIncome)}`,
    `지출 -${formatWon(summary.totalExpense)}`,
    `순수익 ${net >= 0 ? '+' : '-'}${formatWon(Math.abs(net))}`,
  ];
  const top = categories.slice(0, 2);
  if (top.length > 0) {
    lines.push('', '지출 TOP');
    top.forEach((c, i) => lines.push(`${i + 1}. ${getCategoryLabel(c.category)} ${formatWon(c.total)} (${Math.round(c.percent)}%)`));
  }
  lines.push('', '— 작은 모임');
  return lines.join('\n');
}
