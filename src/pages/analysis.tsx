import { createRoute, useNavigation } from '@granite-js/react-native';
import React, { useState, useMemo } from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import { Tab } from '@toss/tds-react-native';
import { colors } from '../constants/colors';
import { spacing } from '../constants/spacing';
import { PageHeader } from '../components/layout/PageHeader';
import { TabBar } from '../components/layout/TabBar';
import { SummaryTab } from '../components/analysis/SummaryTab';
import { CategoryTab } from '../components/analysis/CategoryTab';
import { BudgetTab } from '../components/analysis/BudgetTab';
import { MemberTab } from '../components/analysis/MemberTab';
import { CenterNotice } from '../components/common/CenterNotice';
import { MonthNav } from '../components/common/MonthNav';
import { shiftMonth } from '../lib/date';
import { useTeamStore } from '../store/teamStore';
import { useBudgetStore, selectBudget } from '../store/budgetStore';
import { getTeamId } from '../types/team';
import { buildAnalysisData } from '../lib/analysis';

export const Route = createRoute('/analysis', { component: AnalysisPage });

type TabValue = 'summary' | 'category' | 'budget' | 'member';
const TABS: { value: TabValue; label: string }[] = [
  { value: 'summary', label: '요약' },
  { value: 'category', label: '카테고리' },
  { value: 'budget', label: '예산' },
  { value: 'member', label: '멤버' },
];

function AnalysisPage() {
  const nav = useNavigation();
  const [ym, setYm] = useState(() => {
    const now = new Date();
    return { y: now.getFullYear(), m: now.getMonth() + 1 };
  });
  const [tab, setTab] = useState<TabValue>('summary');
  const transactions = useTeamStore((s) => s.transactions);
  const error = useTeamStore((s) => s.error);
  const currentTeam = useTeamStore((s) => s.currentTeam);
  const teamId = currentTeam ? getTeamId(currentTeam) : '';
  const budgetConfig = useBudgetStore(selectBudget(teamId));
  const members = currentTeam?.members;
  const displayMode = currentTeam?.displayMode;
  const data = useMemo(
    () => buildAnalysisData(ym.y, ym.m, transactions, budgetConfig, members ?? [], displayMode),
    [ym, transactions, budgetConfig, members, displayMode],
  );

  const shift = (delta: number) => setYm((cur) => shiftMonth(cur, delta));

  return (
    <View style={styles.container}>
      <View style={styles.body}>
        <PageHeader title="분석" />
        {error ? (
          <CenterNotice message={error} tone="error" />
        ) : (
          <>
            {/* 월 선택 — 모든 탭에 공통 적용 */}
            <MonthNav ym={ym} onShift={shift} />
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
          </>
        )}
      </View>
      <TabBar active="analysis" onNavigate={(p) => nav.navigate(p as '/')} onAdd={() => nav.navigate('/deal-new' as '/')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  body: { flex: 1, paddingHorizontal: spacing.screenX },
  scroll: { paddingBottom: spacing.section, paddingTop: spacing.lg },
});
