import React, { useState } from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { Txt, Icon } from '@toss/tds-react-native';
import { colors } from '../../constants/colors';
import { spacing, radius } from '../../constants/spacing';
import { TotalExpenseCard } from './TotalExpenseCard';
import { TrendChart } from './TrendChart';
import { DailyCalendar } from './DailyCalendar';
import { ShareReportSheet } from './ShareReportSheet';
import { useTeamStore } from '../../store/teamStore';
import type { AnalysisData } from '../../types/analysis';

export function SummaryTab({ data }: { data: AnalysisData }) {
  const teamName = useTeamStore((s) => s.currentTeam?.name) ?? '우리 모임';
  const [shareOpen, setShareOpen] = useState(false);

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

      <Pressable style={styles.shareBtn} onPress={() => setShareOpen(true)}>
        <Icon name="icon-share-mono" size={18} color={colors.brand} />
        <Txt typography="t5" fontWeight="bold" color={colors.brand}>이번 달 리포트 공유</Txt>
      </Pressable>

      <ShareReportSheet visible={shareOpen} onClose={() => setShareOpen(false)} teamName={teamName} data={data} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.section },
  shareBtn: { flexDirection: 'row', gap: spacing.xs, alignItems: 'center', justifyContent: 'center', height: 52, borderRadius: radius.button, backgroundColor: '#E7F9F1' },
});
