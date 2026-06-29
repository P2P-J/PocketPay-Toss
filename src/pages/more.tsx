import { createRoute, useNavigation } from '@granite-js/react-native';
import React from 'react';
import { ScrollView, View, Pressable, Alert, StyleSheet } from 'react-native';
import { Txt } from '@toss/tds-react-native';
import { useTeamStore } from '../store/teamStore';
import { useAccountStore, selectAccount } from '../store/accountStore';
import { getTeamId } from '../types/team';
import { PREVIEW_MODE } from '../constants/config';
import { useIsOwner } from '../hooks/useIsOwner';
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
  const dummyAccount = useAccountStore(selectAccount(currentTeam ? getTeamId(currentTeam) : ''));
  const accountBank = PREVIEW_MODE ? dummyAccount.bank : currentTeam?.account?.bank;
  const isOwner = useIsOwner();
  const leaveTeam = useTeamStore((s) => s.leaveTeam);

  const onLeave = () => {
    if (!currentTeam) return;
    if (isOwner) {
      Alert.alert('모임 나가기', '방장은 바로 나갈 수 없어요. 다른 멤버에게 방장을 위임한 뒤 나가거나, 모임 설정에서 모임을 삭제해주세요.');
      return;
    }
    Alert.alert('모임 나가기', `‘${currentTeam.name}’ 모임에서 나갈까요? 다시 들어오려면 초대가 필요해요.`, [
      { text: '취소', style: 'cancel' },
      { text: '나가기', style: 'destructive', onPress: () => leaveTeam() },
    ]);
  };

  const manageItems = [
    { emoji: '👥', label: '멤버 관리', value: `${currentTeam?.members?.length ?? 0}명`, path: '/members' },
    ...(currentTeam?.feeEnabled ? [{ emoji: '💰', label: '회비', path: '/fees' }] : []),
    { emoji: '🧾', label: '정산 규칙', path: '/settlement-rule' },
    { emoji: '🏷️', label: '카테고리 설정', path: '/category-settings' },
    ...(isOwner ? [{ emoji: '⚙️', label: '모임 설정', path: '/team-settings' }] : []),
  ];

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
          <MenuSection title="모임 관리" items={manageItems} />
          <MenuSection
            title="계좌 · 알림"
            items={[
              { emoji: '🏦', label: '연결 계좌', value: accountBank || '미설정', path: '/account' },
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
          {currentTeam && (
            <Pressable style={styles.leave} onPress={onLeave}>
              <Txt typography="t5" fontWeight="medium" color={colors.expense}>모임 나가기</Txt>
            </Pressable>
          )}
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
  leave: { alignItems: 'center', paddingVertical: spacing.md },
});
