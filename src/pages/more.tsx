import { createRoute, useNavigation } from '@granite-js/react-native';
import React from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import { useTeamStore } from '../store/teamStore';
import { useAccountStore, selectAccount } from '../store/accountStore';
import { getTeamId } from '../types/team';
import { colors } from '../constants/colors';
import { spacing } from '../constants/spacing';
import { PageHeader } from '../components/layout/PageHeader';
import { TeamSummaryCard } from '../components/more/TeamSummaryCard';
import { MenuSection } from '../components/more/MenuList';
import { TabBar } from '../components/layout/TabBar';

export const Route = createRoute('/more', { component: MorePage });

function MorePage() {
  const nav = useNavigation();
  const currentTeam = useTeamStore((s) => s.currentTeam);
  const account = useAccountStore(selectAccount(currentTeam ? getTeamId(currentTeam) : ''));

  return (
    <View style={styles.container}>
      <View style={styles.body}>
        <PageHeader title="더보기" />
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <TeamSummaryCard team={currentTeam} />
          <MenuSection
            title="내 계정"
            items={[{ emoji: '🙂', label: '프로필', path: '/profile' }]}
          />
          <MenuSection
            title="모임 관리"
            items={[
              { emoji: '👥', label: '멤버 관리', value: `${currentTeam?.members?.length ?? 0}명`, path: '/members' },
              { emoji: '🧾', label: '정산 규칙', path: '/settlement-rule' },
              { emoji: '🏷️', label: '카테고리 설정', path: '/category-settings' },
            ]}
          />
          <MenuSection
            title="계좌 · 알림"
            items={[
              { emoji: '🏦', label: '연결 계좌', value: account.bank || '미설정', path: '/account' },
              { emoji: '🔔', label: '알림 설정', path: '/notifications' },
            ]}
          />
          <MenuSection
            title="지원"
            items={[
              { emoji: '📢', label: '공지사항', path: '/notices' },
              { emoji: '💬', label: '고객센터', path: '/support' },
            ]}
          />
        </ScrollView>
      </View>
      <TabBar active="more" onNavigate={(p) => nav.navigate(p as '/')} onAdd={() => nav.navigate('/deal-new' as '/')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  body: { flex: 1, paddingHorizontal: spacing.screenX },
  scroll: { paddingBottom: spacing.section, gap: spacing.section },
});
