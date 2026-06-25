import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Txt } from '@toss/tds-react-native';
import { colors } from '../../constants/colors';
import { spacing } from '../../constants/spacing';
import { DonutChart } from './DonutChart';
import { CategoryBar } from './CategoryBar';
import type { AnalysisData } from '../../types/analysis';

// 슬라이스 색 팔레트 (카테고리 순서대로 배정) — 도넛/막대 공유
const SLICE_COLORS = [colors.brand, colors.income, '#FFA94D', '#845EF7', colors.expense, '#20C997'];

export function CategoryTab({ data }: { data: AnalysisData }) {
  const { categories, summary } = data;

  if (categories.length === 0) {
    return <View style={styles.empty}><Txt typography="t5" color={colors.textCaption}>이번 달 지출이 없어요</Txt></View>;
  }

  const sliceColor = (i: number) => SLICE_COLORS[i % SLICE_COLORS.length] ?? colors.brand;

  return (
    <View style={styles.wrap}>
      <View style={styles.donut}>
        <DonutChart slices={categories.map((c, i) => ({ value: c.total, color: sliceColor(i) }))} total={summary.totalExpense} />
      </View>
      <View style={styles.bars}>
        {categories.map((c, i) => (
          <CategoryBar key={c.category} category={c.category} total={c.total} percent={c.percent} color={sliceColor(i)} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.section },
  donut: { alignItems: 'center', paddingVertical: spacing.sm },
  bars: { gap: spacing.lg },
  empty: { alignItems: 'center', paddingVertical: 48 },
});
