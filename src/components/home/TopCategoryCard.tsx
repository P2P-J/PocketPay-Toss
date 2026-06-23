import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Txt } from '@toss/tds-react-native';
import { colors } from '../../constants/colors';
import { formatSigned } from '../../lib/format';
import { getCategoryEmoji, getCategoryLabel } from '../../constants/categories';

export function TopCategoryCard({ topCategory }: { topCategory: { category: string; total: number } | null }) {
  if (!topCategory) return null;
  return (
    <View style={styles.card}>
      <Txt typography="t6" color={colors.textSecondary}>이번 달 최다 지출</Txt>
      <View style={styles.row}>
        <Text style={styles.emoji}>{getCategoryEmoji(topCategory.category)}</Text>
        <Txt typography="t5" color={colors.textPrimary}>{getCategoryLabel(topCategory.category)}</Txt>
        <View style={{ flex: 1 }} />
        <Txt typography="t5" color={colors.expense} fontWeight="bold">{formatSigned(topCategory.total, 'expense')}</Txt>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.cardBg, borderRadius: 16, padding: 16, gap: 8 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  emoji: { fontSize: 20 },
});
