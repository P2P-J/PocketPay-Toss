import { createRoute, useNavigation } from '@granite-js/react-native';
import React, { useEffect, useRef } from 'react';
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
import { EmptyTeams } from '../components/home/EmptyTeams';
import { SoftBackground } from '../components/common/SoftBackground';
import { TabBar } from '../components/layout/TabBar';
import { getTeamId } from '../types/team';
import { teamApi } from '../api/team';
import { popInvite } from '../lib/inviteStash';
import { useTransactionActions } from '../hooks/useTransactionActions';
import { useAlertsStore } from '../store/alertsStore';
import { PREVIEW_MODE } from '../constants/config';

export const Route = createRoute('/', { component: Home });

function Home() {
  const navigation = useNavigation();
  const accessToken = useAuthStore((s) => s.accessToken);
  const user = useAuthStore((s) => s.user);
  const checkAuth = useAuthStore((s) => s.checkAuth);
  const authLoading = useAuthStore((s) => s.loading);
  const teams = useTeamStore((s) => s.teams);
  const currentTeam = useTeamStore((s) => s.currentTeam);
  const summary = useTeamStore((s) => s.summary);
  const stats = useTeamStore((s) => s.stats);
  const transactions = useTeamStore((s) => s.transactions);
  const loading = useTeamStore((s) => s.loading);
  const error = useTeamStore((s) => s.error);
  const fetchTeams = useTeamStore((s) => s.fetchTeams);
  const setCurrentTeam = useTeamStore((s) => s.setCurrentTeam);
  const { onEdit, onDelete } = useTransactionActions();
  const fetchUnread = useAlertsStore((s) => s.fetchUnread);

  useEffect(() => { checkAuth(); }, [checkAuth]);
  useEffect(() => { if (accessToken) { fetchTeams(); fetchUnread(); } }, [accessToken, fetchTeams, fetchUnread]);
  useEffect(() => { if (!authLoading && !accessToken) navigation.navigate('/login'); }, [authLoading, accessToken, navigation]);
  // 신규유저(핸들 없음) → 온보딩 프로필. replace로 뒤로가기 우회 차단. 프리뷰는 더미라 건너뜀.
  const needsOnboarding = !PREVIEW_MODE && !!accessToken && !!user && !user.handle;
  useEffect(() => { if (needsOnboarding) navigation.replace('/onboarding'); }, [needsOnboarding, navigation]);

  // 딥링크로 보관된 초대 토큰 자동 참가 (로그인+온보딩 완료 후 1회)
  const inviteConsumed = useRef(false);
  useEffect(() => {
    if (PREVIEW_MODE || !accessToken || !user?.handle || inviteConsumed.current) return;
    inviteConsumed.current = true;
    (async () => {
      const token = await popInvite();
      if (!token) return;
      try {
        const res = await teamApi.joinByToken(token);
        await fetchTeams();
        await setCurrentTeam(getTeamId(res.data.team));
      } catch {
        // 만료/무효 초대는 조용히 무시
      }
    })();
  }, [accessToken, user, fetchTeams, setCurrentTeam]);

  if (!accessToken || needsOnboarding) return <View style={[styles.container, styles.center]}><ActivityIndicator color={colors.brand} /></View>;

  return (
    <View style={styles.container}>
      {teams.length === 0 && !error && <SoftBackground />}
      <View style={styles.body}>
        <TeamHeader teams={teams} currentTeam={currentTeam} onSelectTeam={setCurrentTeam} />
        {loading && !currentTeam ? (
          <View style={styles.center}><ActivityIndicator color={colors.brand} /></View>
        ) : error ? (
          <View style={styles.center}>
            <Txt typography="t5" color={colors.expense} style={styles.errorText}>{error}</Txt>
            <Pressable style={styles.retry} onPress={() => fetchTeams()}>
              <Txt typography="t5" fontWeight="bold" color={colors.brand}>다시 시도</Txt>
            </Pressable>
          </View>
        ) : teams.length === 0 ? (
          <EmptyTeams />
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
            <TransactionList transactions={transactions} onPressItem={onEdit} onLongPressItem={onDelete} />
          </ScrollView>
        )}
      </View>
      <TabBar active="home" onNavigate={(p) => navigation.navigate(p as '/')} onAdd={() => navigation.navigate('/deal-new' as '/')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  body: { flex: 1, paddingHorizontal: spacing.screenX },
  scroll: { gap: spacing.cardGap, paddingBottom: spacing.section },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  errorText: { textAlign: 'center', paddingHorizontal: spacing.section },
  retry: { marginTop: spacing.md, paddingVertical: spacing.sm, paddingHorizontal: spacing.lg },
  sectionTitle: { marginTop: spacing.md, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
});
