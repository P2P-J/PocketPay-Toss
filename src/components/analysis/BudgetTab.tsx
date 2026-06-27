import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useNavigation } from '@granite-js/react-native';
import { Txt } from '@toss/tds-react-native';
import { colors } from '../../constants/colors';
import { spacing, radius } from '../../constants/spacing';
import { formatWon } from '../../lib/format';
import { getCategoryLabel, getCategoryEmoji } from '../../constants/categories';
import type { AnalysisData, CategoryBudget } from '../../types/analysis';

const WARN = colors.warn; // 80%↑ 경고(주황)

// 사용률에 따른 막대 색: 초과 빨강 / 임박 주황 / 정상 그린
function usageColor(pct: number): string {
  if (pct >= 100) return colors.expense;
  if (pct >= 80) return WARN;
  return colors.brand;
}

function pctOf(spent: number, limit: number): number {
  return limit > 0 ? Math.round((spent / limit) * 100) : 0;
}

function CategoryBudgetRow({ item }: { item: CategoryBudget }) {
  const pct = pctOf(item.spent, item.limit);
  const color = usageColor(pct);
  return (
    <View style={styles.catRow}>
      <View style={styles.catTop}>
        <View style={styles.catLeft}>
          <Text allowFontScaling={false} style={styles.emoji}>{getCategoryEmoji(item.category)}</Text>
          <Txt typography="t5" fontWeight="medium" color={colors.textPrimary}>{getCategoryLabel(item.category)}</Txt>
        </View>
        <Txt typography="t5" fontWeight="bold" color={color}>{pct}%</Txt>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${Math.min(Math.max(pct, 2), 100)}%`, backgroundColor: color }]} />
      </View>
      <Txt typography="t7" color={colors.textCaption} textAlign="right">
        {formatWon(item.spent)} / {formatWon(item.limit)}
      </Txt>
    </View>
  );
}

export function BudgetTab({ data }: { data: AnalysisData }) {
  const navigation = useNavigation();
  const { budget } = data;
  const goSettings = () => navigation.navigate('/budget-settings' as '/');

  if (budget.totalLimit === 0) {
    return (
      <View style={styles.empty}>
        <Txt typography="t5" color={colors.textCaption}>설정된 예산이 없어요</Txt>
        <Pressable style={styles.emptyBtn} onPress={goSettings}>
          <Txt typography="t5" fontWeight="bold" color={colors.brand}>예산 설정하기</Txt>
        </Pressable>
      </View>
    );
  }

  const totalPct = pctOf(budget.totalSpent, budget.totalLimit);
  const remain = budget.totalLimit - budget.totalSpent;

  return (
    <View style={styles.wrap}>
      {/* 전체 예산 */}
      <View style={styles.card}>
        <View style={styles.cardTop}>
          <Txt typography="t7" color={colors.textSecondary}>전체 예산</Txt>
          <Pressable hitSlop={8} onPress={goSettings}>
            <Txt typography="t7" fontWeight="medium" color={colors.brand}>예산 설정</Txt>
          </Pressable>
        </View>
        <View style={styles.amountRow}>
          <Txt typography="t4" fontWeight="bold" color={colors.textPrimary}>{formatWon(budget.totalSpent)}</Txt>
          <Txt typography="t5" color={colors.textCaption}> / {formatWon(budget.totalLimit)}</Txt>
        </View>
        <View style={[styles.track, styles.trackLg]}>
          <View style={[styles.fillLg, { width: `${Math.min(Math.max(totalPct, 2), 100)}%`, backgroundColor: usageColor(totalPct) }]} />
        </View>
        <View style={styles.metaRow}>
          <Txt typography="t7" color={colors.textCaption}>{totalPct}% 사용</Txt>
          <Txt typography="t7" fontWeight="bold" color={remain >= 0 ? colors.brand : colors.expense}>
            {formatWon(remain)} {remain >= 0 ? '남음' : '초과'}
          </Txt>
        </View>
      </View>

      {/* 카테고리별 예산 */}
      <View style={styles.cats}>
        {budget.categories.map((c) => <CategoryBudgetRow key={c.category} item={c} />)}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.section },
  card: { backgroundColor: colors.cardBg, borderRadius: radius.card, padding: spacing.cardPadding, gap: spacing.md },
  cardTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  amountRow: { flexDirection: 'row', alignItems: 'baseline' },
  metaRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cats: { gap: spacing.xl },
  catRow: { gap: spacing.sm },
  catTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  catLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  emoji: { fontSize: 18, lineHeight: 23, includeFontPadding: false },
  track: { height: 8, borderRadius: 5, backgroundColor: colors.grey100, overflow: 'hidden' },
  trackLg: { height: 10, borderRadius: 6 },
  fill: { height: 8, borderRadius: 5 },
  fillLg: { height: 10, borderRadius: 6 },
  empty: { alignItems: 'center', paddingVertical: 48, gap: spacing.lg },
  emptyBtn: { paddingHorizontal: spacing.xl, paddingVertical: spacing.md, borderRadius: radius.button, backgroundColor: colors.grey100 },
});
