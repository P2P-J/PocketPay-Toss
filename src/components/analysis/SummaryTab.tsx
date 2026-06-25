import React from 'react';
import { View, StyleSheet } from 'react-native';
import { spacing } from '../../constants/spacing';
import { TotalExpenseCard } from './TotalExpenseCard';
import { TrendChart } from './TrendChart';
import { DailyCalendar } from './DailyCalendar';
import type { AnalysisData } from '../../types/analysis';

export function SummaryTab({ data }: { data: AnalysisData }) {
  return (
    <View style={styles.wrap}>
      <TotalExpenseCard summary={data.summary} />
      <TrendChart trend={data.trend} />
      <DailyCalendar
        key={`${data.year}-${data.month}`}
        year={data.year}
        month={data.month}
        transactions={data.transactions}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.section },
});
