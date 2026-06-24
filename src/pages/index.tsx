import { createRoute, useNavigation } from '@granite-js/react-native';
import React, { useEffect } from 'react';
import { ActivityIndicator, Pressable, ScrollView, View, StyleSheet } from 'react-native';
import { Txt } from '@toss/tds-react-native';
import { useAuthStore } from '../store/authStore';
import { useTeamStore } from '../store/teamStore';
import { colors } from '../constants/colors';
import { spacing } from '../constants/spacing';
import { TeamHeader } from '../components/team/TeamHeader';
import { BalanceCard } from '../components/home/BalanceCard';
import { TopCategoryCard } from '../components/home/TopCategoryCard';
import { TransactionList } from '../components/home/TransactionList';
import { TabBar } from '../components/layout/TabBar';

export const Route = createRoute('/', { component: Home });

function Home() {
  const navigation = useNavigation();
  const accessToken = useAuthStore((s) => s.accessToken);
  const checkAuth = useAuthStore((s) => s.checkAuth);
  const authLoading = useAuthStore((s) => s.loading);
  const { teams, currentTeam, summary, stats, transactions, loading, error, fetchTeams, setCurrentTeam } = useTeamStore();

  useEffect(() => { checkAuth(); }, [checkAuth]);
  useEffect(() => { if (accessToken) fetchTeams(); }, [accessToken, fetchTeams]);
  useEffect(() => { if (!authLoading && !accessToken) navigation.navigate('/login'); }, [authLoading, accessToken, navigation]);

  if (!accessToken) return <View style={styles.container} />;

  return (
    <View style={styles.container}>
      <View style={styles.body}>
        <TeamHeader teams={teams} currentTeam={currentTeam} onSelectTeam={setCurrentTeam} />
        {loading && !currentTeam ? (
          <View style={styles.center}><ActivityIndicator color={colors.brand} /></View>
        ) : error ? (
          <View style={styles.center}><Txt typography="t5" color={colors.expense}>{error}</Txt></View>
        ) : teams.length === 0 ? (
          <View style={styles.center}><Txt typography="t5" color={colors.textCaption}>아직 모임이 없어요</Txt></View>
        ) : (
          <ScrollView contentContainerStyle={styles.scroll}>
            <BalanceCard balance={summary.balance} income={stats?.current.income ?? 0} expense={stats?.current.expense ?? 0} />
            <TopCategoryCard topCategory={stats?.topCategory ?? null} />
            <View style={styles.sectionTitle}>
              <Txt typography="t4" fontWeight="bold" color={colors.textPrimary}>거래 내역</Txt>
              <Pressable onPress={() => navigation.navigate('/transactions' as '/')}>
                <Txt typography="t7" color={colors.textCaption}>전체보기</Txt>
              </Pressable>
            </View>
            <TransactionList transactions={transactions} />
          </ScrollView>
        )}
      </View>
      <TabBar active="home" onNavigate={(p) => navigation.navigate(p as '/')} onAdd={() => {}} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  body: { flex: 1, paddingHorizontal: spacing.screenX },
  scroll: { gap: spacing.cardGap, paddingBottom: spacing.section },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  sectionTitle: { marginTop: spacing.md, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
});
