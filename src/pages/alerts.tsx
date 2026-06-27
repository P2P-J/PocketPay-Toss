import { createRoute } from '@granite-js/react-native';
import React, { useEffect } from 'react';
import { ScrollView, View, Pressable, Alert, StyleSheet } from 'react-native';
import { Txt } from '@toss/tds-react-native';
import { colors } from '../constants/colors';
import { spacing, radius } from '../constants/spacing';
import { DetailHeader } from '../components/layout/DetailHeader';
import { CenterNotice } from '../components/common/CenterNotice';
import { useAlertsStore } from '../store/alertsStore';
import { useTeamStore } from '../store/teamStore';
import { notificationsApi } from '../api/notifications';

export const Route = createRoute('/alerts', { component: AlertsPage });

function AlertsPage() {
  const alerts = useAlertsStore((s) => s.alerts);
  const fetchAlerts = useAlertsStore((s) => s.fetchAlerts);
  const markAllRead = useAlertsStore((s) => s.markAllRead);
  const dismissDutch = useAlertsStore((s) => s.dismissDutch);
  const fetchTeams = useTeamStore((s) => s.fetchTeams);

  // 진입 시 목록 로드 + 읽음 처리
  useEffect(() => {
    fetchAlerts();
    markAllRead();
  }, [fetchAlerts, markAllRead]);

  const onAccept = async (teamId: string) => {
    try {
      await notificationsApi.accept(teamId);
      await fetchTeams();
      await fetchAlerts();
      Alert.alert('수락 완료', '모임에 참여했어요.');
    } catch (e) {
      Alert.alert('실패', e instanceof Error ? e.message : '다시 시도해주세요.');
    }
  };

  const onReject = async (teamId: string) => {
    try {
      await notificationsApi.reject(teamId);
      await fetchAlerts();
    } catch (e) {
      Alert.alert('실패', e instanceof Error ? e.message : '다시 시도해주세요.');
    }
  };

  return (
    <View style={styles.container}>
      <DetailHeader title="알림" />
      {alerts.length === 0 ? (
        <CenterNotice message="새 알림이 없어요" />
      ) : (
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {alerts.map((a) => (
            <View key={a.id} style={styles.card}>
              <View style={styles.cardHead}>
                <Txt typography="t5" fontWeight="bold" color={colors.textPrimary}>{a.title}</Txt>
                <Txt typography="t7" color={colors.textCaption}>{a.date}</Txt>
              </View>
              <Txt typography="t6" color={colors.textSecondary}>{a.body}</Txt>
              {a.kind === 'invite' && a.teamId && (
                <View style={styles.actions}>
                  <Pressable style={[styles.btn, styles.reject]} onPress={() => onReject(a.teamId!)}>
                    <Txt typography="t6" fontWeight="bold" color={colors.textSecondary}>거절</Txt>
                  </Pressable>
                  <Pressable style={[styles.btn, styles.accept]} onPress={() => onAccept(a.teamId!)}>
                    <Txt typography="t6" fontWeight="bold" color={colors.white}>수락</Txt>
                  </Pressable>
                </View>
              )}
              {a.kind === 'dutch' && a.dutchId && (
                <>
                  {a.account && (
                    <View style={styles.accountBox}>
                      <Txt typography="t7" color={colors.textCaption}>받을 계좌</Txt>
                      <Txt typography="t6" fontWeight="medium" color={colors.textPrimary}>{a.account}</Txt>
                    </View>
                  )}
                  <View style={styles.actions}>
                    <Pressable style={[styles.btn, styles.accept]} onPress={() => dismissDutch(a.dutchId!)}>
                      <Txt typography="t6" fontWeight="bold" color={colors.white}>확인</Txt>
                    </Pressable>
                  </View>
                </>
              )}
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  scroll: { paddingHorizontal: spacing.screenX, paddingBottom: spacing.section, gap: spacing.md },
  card: { backgroundColor: colors.cardBg, borderRadius: radius.card, padding: spacing.cardPadding, gap: spacing.xs },
  cardHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  accountBox: { backgroundColor: colors.white, borderRadius: radius.button, padding: spacing.md, gap: 2, marginTop: spacing.xs },
  actions: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm },
  btn: { flex: 1, alignItems: 'center', justifyContent: 'center', height: 44, borderRadius: radius.button },
  reject: { backgroundColor: colors.grey100 },
  accept: { backgroundColor: colors.brand },
});
