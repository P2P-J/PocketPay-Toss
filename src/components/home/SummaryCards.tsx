import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Txt } from '@toss/tds-react-native';
import { colors } from '../../constants/colors';
import { spacing, radius } from '../../constants/spacing';
import { formatSigned } from '../../lib/format';

interface Props {
  income: number;
  expense: number;
  incomeChange: number | null;
  expenseChange: number | null;
}

function changeLabel(pct: number | null): string | null {
  if (pct == null || !isFinite(pct)) return null;
  return `↗ 전월 대비 ${Math.round(pct)}%`;
}

export function SummaryCards({ income, expense, incomeChange, expenseChange }: Props) {
  return (
    <View style={styles.row}>
      <View style={styles.card}>
        <Txt typography="t7" color={colors.textSecondary}>이번 달 수입</Txt>
        <Txt typography="t4" color={colors.income} fontWeight="bold">{formatSigned(income, 'income')}</Txt>
        {changeLabel(incomeChange) && <Txt typography="t7" fontWeight="medium" color={colors.income}>{changeLabel(incomeChange)}</Txt>}
      </View>
      <View style={styles.card}>
        <Txt typography="t7" color={colors.textSecondary}>이번 달 지출</Txt>
        <Txt typography="t4" color={colors.expense} fontWeight="bold">{formatSigned(expense, 'expense')}</Txt>
        {changeLabel(expenseChange) && <Txt typography="t7" fontWeight="medium" color={colors.expense}>{changeLabel(expenseChange)}</Txt>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: spacing.cardGap },
  card: { flex: 1, backgroundColor: colors.cardBg, borderRadius: radius.card, padding: spacing.cardPadding, gap: spacing.xs },
});
