import React from 'react';
import { View, Pressable, Text, StyleSheet } from 'react-native';
import { Txt } from '@toss/tds-react-native';
import { colors } from '../../constants/colors';
import { spacing } from '../../constants/spacing';
import type { YearMonth } from '../../lib/date';

// 월 이동 내비 (‹ YYYY년 M월 ›) — 분석/회비 공용
export function MonthNav({ ym, onShift }: { ym: YearMonth; onShift: (delta: number) => void }) {
  return (
    <View style={styles.nav}>
      <Pressable hitSlop={8} onPress={() => onShift(-1)}><Text style={styles.arrow}>‹</Text></Pressable>
      <Txt typography="t4" fontWeight="bold" color={colors.textPrimary}>{ym.y}년 {ym.m}월</Txt>
      <Pressable hitSlop={8} onPress={() => onShift(1)}><Text style={styles.arrow}>›</Text></Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  nav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.xl, paddingVertical: spacing.sm },
  arrow: { fontSize: 22, color: colors.textSecondary, paddingHorizontal: spacing.xs },
});
