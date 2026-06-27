import React from 'react';
import { Modal, View, Pressable, StyleSheet } from 'react-native';
import { Txt } from '@toss/tds-react-native';
import { colors } from '../../constants/colors';
import { spacing, radius } from '../../constants/spacing';
import { avatarColor } from '../../constants/avatar';
import { getMemberName } from '../../types/team';
import type { Member, TeamDisplayMode } from '../../types/team';

interface Props {
  member: Member | null;
  displayMode?: TeamDisplayMode;
  index: number;
  onClose: () => void;
}

// 멤버 정보 — 공유 가능한 정보만(표시 이름·고유 ID·역할). 이메일 등 개인정보는 노출 안 함.
export function MemberInfoSheet({ member, displayMode, index, onClose }: Props) {
  if (!member) return null;
  const u = typeof member.user === 'string' ? null : member.user;
  const name = getMemberName(member, displayMode);
  const av = avatarColor(index);
  const isOwner = member.role === 'owner';

  return (
    <Modal visible transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View style={styles.sheet}>
        <View style={styles.handle} />
        <View style={[styles.avatar, { backgroundColor: av.bg }]}>
          <Txt typography="t3" fontWeight="bold" color={av.fg}>{name.slice(0, 1)}</Txt>
        </View>
        <Txt typography="t4" fontWeight="bold" color={colors.textPrimary}>{name}</Txt>
        <View style={[styles.badge, isOwner && styles.badgeOwner]}>
          <Txt typography="t7" fontWeight="bold" color={isOwner ? colors.brand : colors.textCaption}>{isOwner ? '방장' : '멤버'}</Txt>
        </View>

        <View style={styles.rows}>
          <View style={styles.row}>
            <Txt typography="t7" color={colors.textCaption}>고유 ID</Txt>
            <Txt typography="t5" color={colors.textPrimary}>{u?.handle ? `@${u.handle}` : '-'}</Txt>
          </View>
        </View>

        <Txt typography="t7" color={colors.textTertiary} textAlign="center">공유 가능한 정보만 보여요</Txt>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' },
  sheet: { backgroundColor: colors.white, borderTopLeftRadius: radius.sheet, borderTopRightRadius: radius.sheet, paddingHorizontal: spacing.screenX, paddingTop: spacing.md, paddingBottom: spacing.section, alignItems: 'center', gap: spacing.sm },
  handle: { width: 40, height: 4, borderRadius: 2, backgroundColor: colors.grey200, marginBottom: spacing.md },
  avatar: { width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center' },
  badge: { paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: radius.pill, backgroundColor: colors.grey100 },
  badgeOwner: { backgroundColor: '#E7F9F1' },
  rows: { alignSelf: 'stretch', marginTop: spacing.md, marginBottom: spacing.sm },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: spacing.sm, borderTopWidth: 1, borderTopColor: colors.divider },
});
