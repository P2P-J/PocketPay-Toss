import { createRoute } from '@granite-js/react-native';
import React from 'react';
import { ScrollView, View, Pressable, Alert, StyleSheet } from 'react-native';
import { Txt } from '@toss/tds-react-native';
import { colors } from '../constants/colors';
import { spacing, radius } from '../constants/spacing';
import { DetailHeader } from '../components/layout/DetailHeader';
import { avatarColor } from '../constants/avatar';
import { useTeamStore } from '../store/teamStore';
import type { Member } from '../types/team';

export const Route = createRoute('/members', { component: MembersPage });

function MembersPage() {
  const team = useTeamStore((s) => s.currentTeam);
  const members = team?.members ?? [];

  const displayName = (m: Member): string => {
    const u = typeof m.user === 'string' ? null : m.user;
    const name = team?.displayMode === 'realName' ? u?.name : u?.nickname ?? u?.name;
    return name ?? '멤버';
  };

  return (
    <View style={styles.container}>
      <DetailHeader title="멤버 관리" />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Txt typography="t7" color={colors.textCaption}>멤버 {members.length}명</Txt>
        <View style={styles.list}>
          {members.map((m, i) => {
            const name = displayName(m);
            const isOwner = m.role === 'owner';
            const av = avatarColor(i);
            return (
              <View key={(typeof m.user === 'string' ? m.user : m.user._id) ?? i} style={styles.row}>
                <View style={[styles.avatar, { backgroundColor: av.bg }]}>
                  <Txt typography="t5" fontWeight="bold" color={av.fg}>{name.slice(0, 1)}</Txt>
                </View>
                <Txt typography="t5" fontWeight="medium" color={colors.textPrimary}>{name}</Txt>
                <View style={styles.spacer} />
                <View style={[styles.badge, isOwner && styles.badgeOwner]}>
                  <Txt typography="t7" fontWeight="bold" color={isOwner ? colors.brand : colors.textCaption}>{isOwner ? '방장' : '멤버'}</Txt>
                </View>
              </View>
            );
          })}
        </View>

        <Pressable style={styles.invite} onPress={() => Alert.alert('멤버 초대', '곧 추가될 기능이에요.')}>
          <Txt typography="t5" fontWeight="bold" color={colors.brand}>+ 멤버 초대</Txt>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  scroll: { paddingHorizontal: spacing.screenX, paddingBottom: spacing.section, gap: spacing.md },
  list: { gap: spacing.lg },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  avatar: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  spacer: { flex: 1 },
  badge: { paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: radius.pill, backgroundColor: colors.grey100 },
  badgeOwner: { backgroundColor: '#E7F9F1' },
  invite: { alignItems: 'center', justifyContent: 'center', height: 52, borderRadius: radius.button, borderWidth: 1, borderColor: colors.divider, borderStyle: 'dashed', marginTop: spacing.sm },
});
