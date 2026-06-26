import { createRoute } from '@granite-js/react-native';
import React, { useState } from 'react';
import { ScrollView, View, Pressable, Alert, StyleSheet } from 'react-native';
import { Txt } from '@toss/tds-react-native';
import { colors } from '../constants/colors';
import { spacing, radius } from '../constants/spacing';
import { PREVIEW_MODE } from '../constants/config';
import { DetailHeader } from '../components/layout/DetailHeader';
import { FormField } from '../components/common/FormField';
import { avatarColor } from '../constants/avatar';
import { useTeamStore } from '../store/teamStore';
import { getMemberId, getMemberName, getTeamId } from '../types/team';
import { teamApi } from '../api/team';

export const Route = createRoute('/members', { component: MembersPage });

const HANDLE_RE = /^[a-z0-9_]{3,20}$/;

function MembersPage() {
  const team = useTeamStore((s) => s.currentTeam);
  const setCurrentTeam = useTeamStore((s) => s.setCurrentTeam);
  const members = team?.members ?? [];

  const [handle, setHandle] = useState('');
  const [inviting, setInviting] = useState(false);
  const handleValid = HANDLE_RE.test(handle.trim());

  const onInvite = async () => {
    if (!handleValid || inviting || !team) return;
    if (PREVIEW_MODE) {
      Alert.alert('멤버 초대', '실연동 시 동작해요. (handle로 초대)');
      return;
    }
    setInviting(true);
    try {
      await teamApi.inviteMember(getTeamId(team), handle.trim());
      await setCurrentTeam(getTeamId(team));
      setHandle('');
      Alert.alert('초대 완료', '초대 요청을 보냈어요.');
    } catch (e) {
      Alert.alert('초대 실패', e instanceof Error ? e.message : '다시 시도해주세요.');
    } finally {
      setInviting(false);
    }
  };

  return (
    <View style={styles.container}>
      <DetailHeader title="멤버 관리" />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Txt typography="t7" color={colors.textCaption}>멤버 {members.length}명</Txt>
        <View style={styles.list}>
          {members.map((m, i) => {
            const name = getMemberName(m, team?.displayMode);
            const isOwner = m.role === 'owner';
            const av = avatarColor(i);
            return (
              <View key={getMemberId(m) || i} style={styles.row}>
                <View style={[styles.avatar, { backgroundColor: av.bg }]}>
                  <Txt typography="t5" fontWeight="bold" color={av.fg}>{name.slice(0, 1)}</Txt>
                </View>
                <Txt typography="t5" fontWeight="medium" color={colors.textPrimary} numberOfLines={1} style={styles.name}>{name}</Txt>
                <View style={styles.spacer} />
                <View style={[styles.badge, isOwner && styles.badgeOwner]}>
                  <Txt typography="t7" fontWeight="bold" color={isOwner ? colors.brand : colors.textCaption}>{isOwner ? '방장' : '멤버'}</Txt>
                </View>
              </View>
            );
          })}
        </View>

        <View style={styles.inviteSection}>
          <FormField label="멤버 초대" value={handle} onChangeText={setHandle} placeholder="상대방 고유 ID(handle)" autoCapitalize="none" maxLength={20} hint="영문 소문자·숫자·_ 로 검색해 초대해요" />
          <Pressable style={[styles.invite, (!handleValid || inviting) && styles.inviteOff]} onPress={onInvite} disabled={!handleValid || inviting}>
            <Txt typography="t5" fontWeight="bold" color={handleValid ? colors.brand : colors.textTertiary}>+ 초대하기</Txt>
          </Pressable>
        </View>
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
  name: { flexShrink: 1 },
  spacer: { flex: 1 },
  badge: { paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: radius.pill, backgroundColor: colors.grey100 },
  badgeOwner: { backgroundColor: '#E7F9F1' },
  inviteSection: { marginTop: spacing.lg, gap: spacing.sm },
  invite: { alignItems: 'center', justifyContent: 'center', height: 52, borderRadius: radius.button, borderWidth: 1, borderColor: colors.divider, borderStyle: 'dashed' },
  inviteOff: { opacity: 0.6 },
});

