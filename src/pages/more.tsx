import { createRoute, useNavigation } from '@granite-js/react-native';
import React from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import { useTeamStore } from '../store/teamStore';
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

  return (
    <View style={styles.container}>
      <View style={styles.body}>
        <PageHeader title="더보기" />
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <TeamSummaryCard team={currentTeam} />
          <MenuSection
            title="모임 관리"
            items={[
              { emoji: '👥', label: '멤버 관리', value: `${currentTeam?.members?.length ?? 0}명` },
              { emoji: '🧾', label: '정산 규칙' },
              { emoji: '🏷️', label: '카테고리 설정' },
            ]}
          />
          <MenuSection
            title="계좌 · 알림"
            items={[
              { emoji: '🏦', label: '연결 계좌', value: '토스뱅크' },
              { emoji: '🔔', label: '알림 설정' },
            ]}
          />
          <MenuSection
            title="지원"
            items={[
              { emoji: '📢', label: '공지사항' },
              { emoji: '💬', label: '고객센터' },
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
