import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Txt } from '@toss/tds-react-native';
import { colors } from '../../constants/colors';
import { spacing, radius } from '../../constants/spacing';
import { formatMan } from '../../lib/format';
import type { MonthlyTrendPoint } from '../../types/analysis';

const CHART_H = 120; // 막대 영역 높이
const GHOST_H = 56; // 데이터 없는 달의 회색 고스트 막대 높이

export function TrendChart({ trend }: { trend: MonthlyTrendPoint[] }) {
  if (trend.length === 0) {
    return <View style={styles.empty}><Txt typography="t5" color={colors.textCaption}>추세 데이터가 없어요</Txt></View>;
  }
  const max = Math.max(...trend.map((t) => t.expense), 1);
  const lastIdx = trend.length - 1;

  return (
    <View>
      <View style={styles.header}>
        <Txt typography="t4" fontWeight="bold" color={colors.textPrimary}>월별 지출 추세</Txt>
        <Txt typography="t7" color={colors.textCaption}>최근 {trend.length}개월</Txt>
      </View>
      <View style={styles.chart}>
        {trend.map((t, i) => {
          const active = t.expense > 0 && i === lastIdx;
          const h = t.expense > 0 ? Math.max((t.expense / max) * CHART_H, 8) : GHOST_H;
          return (
            <View key={t.label} style={styles.col}>
              <View style={styles.barArea}>
                {active && (
                  <Txt typography="t7" fontWeight="bold" color={colors.brand}>{formatMan(t.expense)}</Txt>
                )}
                <View style={[styles.bar, { height: h, backgroundColor: active ? colors.brand : colors.grey100 }]} />
              </View>
              <Txt typography="t7" fontWeight={active ? 'bold' : 'regular'} color={active ? colors.brand : colors.textCaption}>
                {t.label}
              </Txt>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.lg },
  chart: { flexDirection: 'row', alignItems: 'flex-end' },
  col: { flex: 1, alignItems: 'center', gap: spacing.sm },
  barArea: { height: CHART_H, justifyContent: 'flex-end', alignItems: 'center', gap: spacing.xs },
  bar: { width: 28, borderRadius: radius.button },
  empty: { alignItems: 'center', paddingVertical: 32 },
});
