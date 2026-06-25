import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Txt } from '@toss/tds-react-native';
import { colors } from '../../constants/colors';
import { spacing, radius } from '../../constants/spacing';
import { formatWon, formatSigned } from '../../lib/format';
import type { AnalysisSummary } from '../../types/analysis';

function BarRow({ label, value, max, type }: { label: string; value: number; max: number; type: 'income' | 'expense' }) {
  const pct = max > 0 ? Math.max(Math.round((value / max) * 100), 2) : 0;
  const color = type === 'income' ? colors.income : colors.expense;
  return (
    <View style={styles.barRow}>
      <Txt typography="t7" color={colors.textSecondary}>{label}</Txt>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${pct}%`, backgroundColor: color }]} />
      </View>
      <Txt typography="t6" fontWeight="bold" color={color}>{formatSigned(value, type)}</Txt>
    </View>
  );
}

export function TotalExpenseCard({ summary }: { summary: AnalysisSummary }) {
  const { totalExpense, totalIncome, net, expenseChangePct: change } = summary;
  const max = Math.max(totalIncome, totalExpense, 1);
  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <Txt typography="t7" color={colors.textSecondary}>이번 달 총 지출</Txt>
        {change != null && change !== 0 && (
          <View style={styles.badge}>
            <Txt typography="t7" fontWeight="bold" color={change > 0 ? colors.expense : colors.brand}>
              {change > 0 ? '↗' : '↘'} 전월 {Math.abs(Math.round(change))}%
            </Txt>
          </View>
        )}
      </View>
      <Txt typography="t2" fontWeight="bold" color={colors.textPrimary}>{formatWon(totalExpense)}</Txt>

      <View style={styles.inner}>
        <View style={styles.col}>
          <Txt typography="t7" color={colors.textSecondary}>이번 달 수입</Txt>
          <Txt typography="t4" fontWeight="bold" color={colors.income}>{formatSigned(totalIncome, 'income')}</Txt>
        </View>
        <View style={styles.col}>
          <Txt typography="t7" color={colors.textSecondary}>순수익</Txt>
          <Txt typography="t4" fontWeight="bold" color={colors.brand}>{formatSigned(net, 'income')}</Txt>
        </View>
      </View>

      <View style={styles.bars}>
        <BarRow label="수입" value={totalIncome} max={max} type="income" />
        <BarRow label="지출" value={totalExpense} max={max} type="expense" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.cardBg, borderRadius: radius.card, padding: spacing.cardPadding, gap: spacing.sm },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  badge: { backgroundColor: colors.white, borderRadius: radius.pill, paddingHorizontal: spacing.sm, paddingVertical: 3 },
  inner: { flexDirection: 'row', backgroundColor: colors.white, borderRadius: radius.button, padding: spacing.lg, marginTop: spacing.sm },
  col: { flex: 1, gap: spacing.xs },
  bars: { gap: spacing.md, marginTop: spacing.sm },
  barRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  track: { flex: 1, height: 8, borderRadius: 5, backgroundColor: colors.grey200, overflow: 'hidden' },
  fill: { height: 8, borderRadius: 5 },
});
