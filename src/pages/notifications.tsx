import { createRoute } from '@granite-js/react-native';
import React from 'react';
import { ScrollView, View, Switch, StyleSheet } from 'react-native';
import { Txt } from '@toss/tds-react-native';
import { colors } from '../constants/colors';
import { spacing } from '../constants/spacing';
import { DetailHeader } from '../components/layout/DetailHeader';
import { useNotifStore, type NotifSettings } from '../store/notifStore';

export const Route = createRoute('/notifications', { component: NotificationsPage });

const ROWS: { key: keyof NotifSettings; label: string; desc: string }[] = [
  { key: 'newDeal', label: '새 거래 알림', desc: '모임에 거래가 등록되면 알려드려요' },
  { key: 'settlement', label: '정산·회비 알림', desc: '정산 요청·회비 납부를 알려드려요' },
  { key: 'notice', label: '공지사항 알림', desc: '새 공지가 올라오면 알려드려요' },
];

function NotificationsPage() {
  const store = useNotifStore();
  return (
    <View style={styles.container}>
      <DetailHeader title="알림 설정" />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {ROWS.map((r) => (
          <View key={r.key} style={styles.row}>
            <View style={styles.texts}>
              <Txt typography="t5" fontWeight="medium" color={colors.textPrimary}>{r.label}</Txt>
              <Txt typography="t7" color={colors.textCaption}>{r.desc}</Txt>
            </View>
            <Switch
              value={store[r.key]}
              onValueChange={(v) => store.set(r.key, v)}
              trackColor={{ false: colors.grey200, true: colors.brand }}
              thumbColor={colors.white}
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  scroll: { paddingHorizontal: spacing.screenX, paddingBottom: spacing.section },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.lg },
  texts: { flex: 1, gap: 2 },
});
