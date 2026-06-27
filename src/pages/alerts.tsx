import { createRoute } from '@granite-js/react-native';
import React, { useEffect } from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import { Txt } from '@toss/tds-react-native';
import { colors } from '../constants/colors';
import { spacing, radius } from '../constants/spacing';
import { DetailHeader } from '../components/layout/DetailHeader';
import { CenterNotice } from '../components/common/CenterNotice';
import { useAlertsStore } from '../store/alertsStore';

export const Route = createRoute('/alerts', { component: AlertsPage });

function AlertsPage() {
  const alerts = useAlertsStore((s) => s.alerts);
  const markAllRead = useAlertsStore((s) => s.markAllRead);

  // 진입 시 읽음 처리
  useEffect(() => { markAllRead(); }, [markAllRead]);

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
});
