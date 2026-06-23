import { createRoute, useNavigation } from '@granite-js/react-native';
import React, { useEffect } from 'react';
import { ActivityIndicator, ScrollView, Text, View, StyleSheet } from 'react-native';
import { useAuthStore } from '../store/authStore';
import { useTeamStore } from '../store/teamStore';
import { colors } from '../constants/colors';
import { TeamHeader } from '../components/team/TeamHeader';
import { BalanceCard } from '../components/home/BalanceCard';
import { SummaryCards } from '../components/home/SummaryCards';
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
          <View style={styles.center}><Text style={styles.error}>{error}</Text></View>
        ) : teams.length === 0 ? (
          <View style={styles.center}><Text style={styles.empty}>아직 모임이 없어요</Text></View>
        ) : (
          <ScrollView contentContainerStyle={styles.scroll}>
            <BalanceCard balance={summary.balance} />
            <SummaryCards income={stats?.current.income ?? 0} expense={stats?.current.expense ?? 0} incomeChange={stats?.incomeChange ?? null} expenseChange={stats?.expenseChange ?? null} />
            <TopCategoryCard topCategory={stats?.topCategory ?? null} />
            <Text style={styles.sectionTitle}>거래 내역</Text>
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
  body: { flex: 1, paddingHorizontal: 20 },
  scroll: { gap: 12, paddingBottom: 24 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  error: { color: colors.expense, fontSize: 14 },
  empty: { color: colors.textTertiary, fontSize: 15 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: colors.textPrimary, marginTop: 12 },
});
