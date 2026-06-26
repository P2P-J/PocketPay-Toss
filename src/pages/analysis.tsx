import { createRoute, useNavigation } from '@granite-js/react-native';
import React, { useState } from 'react';
import { ScrollView, View, Pressable, Text, StyleSheet } from 'react-native';
import { Txt, Tab } from '@toss/tds-react-native';
import { colors } from '../constants/colors';
import { spacing } from '../constants/spacing';
import { PageHeader } from '../components/layout/PageHeader';
import { TabBar } from '../components/layout/TabBar';
import { SummaryTab } from '../components/analysis/SummaryTab';
import { CategoryTab } from '../components/analysis/CategoryTab';
import { BudgetTab } from '../components/analysis/BudgetTab';
import { MemberTab } from '../components/analysis/MemberTab';
import { useTeamStore } from '../store/teamStore';
import { useBudgetStore } from '../store/budgetStore';
import { buildAnalysisData } from '../lib/analysis';

export const Route = createRoute('/analysis', { component: AnalysisPage });

type TabValue = 'summary' | 'category' | 'budget' | 'member';
const TABS: { value: TabValue; label: string }[] = [
  { value: 'summary', label: '요약' },
  { value: 'category', label: '카테고리' },
  { value: 'budget', label: '예산' },
  { value: 'member', label: '멤버' },
];

const BASE = { y: 2026, m: 6 };

function AnalysisPage() {
  const nav = useNavigation();
  const [ym, setYm] = useState(BASE);
  const [tab, setTab] = useState<TabValue>('summary');
  const transactions = useTeamStore((s) => s.transactions);
  const budgetConfig = useBudgetStore((s) => s.config);
  const data = buildAnalysisData(ym.y, ym.m, transactions, budgetConfig);

  const shift = (delta: number) =>
    setYm(({ y, m }) => {
      let nm = m + delta;
      let ny = y;
      if (nm < 1) { nm = 12; ny -= 1; }
      if (nm > 12) { nm = 1; ny += 1; }
      return { y: ny, m: nm };
    });

  return (
    <View style={styles.container}>
      <View style={styles.body}>
        <PageHeader title="분석" />
        {/* 월 선택 — 모든 탭에 공통 적용 */}
        <View style={styles.monthNav}>
          <Pressable hitSlop={8} onPress={() => shift(-1)}><Text style={styles.arrow}>‹</Text></Pressable>
          <Txt typography="t4" fontWeight="bold" color={colors.textPrimary}>{ym.y}년 {ym.m}월</Txt>
          <Pressable hitSlop={8} onPress={() => shift(1)}><Text style={styles.arrow}>›</Text></Pressable>
        </View>
        {/* 상단 섹션 탭 */}
        <Tab value={tab} onChange={(v) => setTab(v as TabValue)}>
          {TABS.map((t) => (
            <Tab.Item key={t.value} value={t.value}>{t.label}</Tab.Item>
          ))}
        </Tab>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {tab === 'summary' && <SummaryTab data={data} />}
          {tab === 'category' && <CategoryTab data={data} />}
          {tab === 'budget' && <BudgetTab data={data} />}
          {tab === 'member' && <MemberTab data={data} />}
        </ScrollView>
      </View>
      <TabBar active="analysis" onNavigate={(p) => nav.navigate(p as '/')} onAdd={() => nav.navigate('/deal-new' as '/')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  body: { flex: 1, paddingHorizontal: spacing.screenX },
  monthNav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.xl, paddingVertical: spacing.sm },
  arrow: { fontSize: 22, color: colors.textSecondary, paddingHorizontal: spacing.xs },
  scroll: { paddingBottom: spacing.section, paddingTop: spacing.lg },
});
