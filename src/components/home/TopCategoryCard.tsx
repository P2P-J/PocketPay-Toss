import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Txt } from '@toss/tds-react-native';
import { colors } from '../../constants/colors';
import { spacing, radius } from '../../constants/spacing';
import { formatSigned } from '../../lib/format';
import { getCategoryLabel } from '../../constants/categories';
import { CategoryIcon } from './CategoryIcon';

export function TopCategoryCard({ topCategory }: { topCategory: { category: string; total: number } | null }) {
  if (!topCategory) return null;
  return (
    <View style={styles.card}>
      <CategoryIcon category={topCategory.category} size={42} />
      <View style={styles.texts}>
        <Txt typography="t7" color={colors.textCaption}>이번 달 최다 지출</Txt>
        <Txt typography="t5" fontWeight="bold" color={colors.textPrimary}>{getCategoryLabel(topCategory.category)}</Txt>
      </View>
      <Txt typography="t5" color={colors.expense} fontWeight="bold">{formatSigned(topCategory.total, 'expense')}</Txt>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, backgroundColor: colors.cardBg, borderRadius: radius.card, padding: spacing.cardPadding },
  texts: { flex: 1, gap: 2 },
});
