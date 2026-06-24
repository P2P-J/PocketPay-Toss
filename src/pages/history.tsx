import { createRoute, useNavigation } from '@granite-js/react-native';
import React, { useState } from 'react';
import { ScrollView, View, Pressable, Text, StyleSheet } from 'react-native';
import { Txt } from '@toss/tds-react-native';
import { useTeamStore } from '../store/teamStore';
import { colors } from '../constants/colors';
import { spacing, radius } from '../constants/spacing';
import { formatWon, formatSigned } from '../lib/format';
import { PageHeader } from '../components/layout/PageHeader';
import { CategoryBar } from '../components/history/CategoryBar';
import { TabBar } from '../components/layout/TabBar';

export const Route = createRoute('/history', { component: HistoryPage });

// 샘플 프리뷰 기준 월. 이 달만 데이터가 있고 다른 달은 빈 상태로 보여준다.
const BASE = { y: 2026, m: 6 };

function HistoryPage() {
  const nav = useNavigation();
  const stats = useTeamStore((s) => s.stats);
  const summary = useTeamStore((s) => s.summary);
  const [ym, setYm] = useState(BASE);
  const isCurrent = ym.y === BASE.y && ym.m === BASE.m;

  const shift = (delta: number) =>
    setYm(({ y, m }) => {
      let nm = m + delta;
      let ny = y;
      if (nm < 1) { nm = 12; ny -= 1; }
      if (nm > 12) { nm = 1; ny += 1; }
      return { y: ny, m: nm };
    });

  const expense = isCurrent ? stats?.current.expense ?? 0 : 0;
  const income = isCurrent ? stats?.current.income ?? 0 : 0;
  const net = isCurrent ? summary.balance : 0;
  const change = isCurrent ? stats?.expenseChange ?? null : null;
  const breakdown = isCurrent ? stats?.categoryBreakdown ?? [] : [];

  return (
    <View style={styles.container}>
      <View style={styles.body}>
        <PageHeader title="내역" />
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {/* 월 선택 */}
          <View style={styles.monthNav}>
            <Pressable hitSlop={8} onPress={() => shift(-1)}><Text style={styles.arrow}>‹</Text></Pressable>
            <Txt typography="t4" fontWeight="bold" color={colors.textPrimary}>{ym.y}년 {ym.m}월</Txt>
            <Pressable hitSlop={8} onPress={() => shift(1)}><Text style={styles.arrow}>›</Text></Pressable>
          </View>

          {/* 총 지출 카드 */}
          <View style={styles.totalCard}>
            <Txt typography="t7" color={colors.textSecondary}>이번 달 총 지출</Txt>
            <Txt typography="t2" fontWeight="bold" color={colors.textPrimary}>{formatWon(expense)}</Txt>
            {change != null && change !== 0 && (
              <Txt typography="t7" fontWeight="medium" color={change > 0 ? colors.expense : colors.brand}>
                {change > 0 ? '↗' : '↘'} 전월 대비 {Math.abs(Math.round(change))}% {change > 0 ? '증가' : '감소'}
              </Txt>
            )}
          </View>

          {/* 카테고리별 지출 */}
          <View style={styles.sectionTitle}>
            <Txt typography="t4" fontWeight="bold" color={colors.textPrimary}>카테고리별 지출</Txt>
          </View>
          {breakdown.length === 0 ? (
            <View style={styles.empty}><Txt typography="t5" color={colors.textCaption}>이번 달 지출이 없어요</Txt></View>
          ) : (
            <View style={styles.bars}>
              {breakdown.map((c) => (
                <CategoryBar
                  key={c.category}
                  category={c.category}
                  total={c.total}
                  percent={expense > 0 ? Math.round((c.total / expense) * 100) : 0}
                />
              ))}
            </View>
          )}

          {/* 수입 / 순수익 요약 */}
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Txt typography="t5" color={colors.textSecondary}>이번 달 수입</Txt>
            <Txt typography="t5" fontWeight="bold" color={colors.income}>{formatSigned(income, 'income')}</Txt>
          </View>
          <View style={styles.summaryRow}>
            <Txt typography="t5" color={colors.textSecondary}>순수익</Txt>
            <Txt typography="t5" fontWeight="bold" color={colors.brand}>{formatSigned(net, 'income')}</Txt>
          </View>
        </ScrollView>
      </View>
      <TabBar active="history" onNavigate={(p) => nav.navigate(p as '/')} onAdd={() => {}} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  body: { flex: 1, paddingHorizontal: spacing.screenX },
  scroll: { paddingBottom: spacing.section },
  monthNav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.xl, paddingVertical: spacing.sm },
  arrow: { fontSize: 22, color: colors.textSecondary, paddingHorizontal: spacing.xs },
  totalCard: { backgroundColor: colors.cardBg, borderRadius: radius.card, padding: spacing.cardPadding, alignItems: 'center', gap: spacing.xs, marginTop: spacing.md },
  sectionTitle: { marginTop: spacing.section, marginBottom: spacing.lg },
  bars: { gap: spacing.lg },
  empty: { alignItems: 'center', paddingVertical: 32 },
  divider: { height: 1, backgroundColor: colors.divider, marginVertical: spacing.section },
  summaryRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: spacing.sm },
});
