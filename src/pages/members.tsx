import { createRoute } from '@granite-js/react-native';
import React, { useState } from 'react';
import { ScrollView, View, Pressable, Alert, StyleSheet } from 'react-native';
import { Txt } from '@toss/tds-react-native';
import { colors } from '../constants/colors';
import { spacing, radius } from '../constants/spacing';
import { PREVIEW_MODE } from '../constants/config';
import { DetailHeader } from '../components/layout/DetailHeader';
import { FormField } from '../components/common/FormField';
import { MemberInfoSheet } from '../components/team/MemberInfoSheet';
import { InviteSheet } from '../components/team/InviteSheet';
import { Avatar } from '../components/common/Avatar';
import { useTeamStore } from '../store/teamStore';
import { useIsOwner } from '../hooks/useIsOwner';
import { getMemberId, getMemberName, getTeamId, type Member } from '../types/team';
import { isValidHandle } from '../lib/validation';
import { teamApi } from '../api/team';

export const Route = createRoute('/members', { component: MembersPage });

function MembersPage() {
  const team = useTeamStore((s) => s.currentTeam);
  const setCurrentTeam = useTeamStore((s) => s.setCurrentTeam);
  const removeMember = useTeamStore((s) => s.removeMember);
  const transferOwner = useTeamStore((s) => s.transferOwner);
  const isOwner = useIsOwner();
  const members = team?.members ?? [];

  const [handle, setHandle] = useState('');
  const [inviting, setInviting] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [infoTarget, setInfoTarget] = useState<{ member: Member; index: number } | null>(null);
  const handleValid = isValidHandle(handle);

  const confirmKick = (m: Member) => {
    const name = getMemberName(m, team?.displayMode);
    Alert.alert('멤버 강퇴', `${name}님을 모임에서 내보낼까요? 다시 초대해야 들어올 수 있어요.`, [
      { text: '취소', style: 'cancel' },
      { text: '강퇴', style: 'destructive', onPress: () => removeMember(getMemberId(m)) },
    ]);
  };

  const confirmTransfer = (m: Member) => {
    const name = getMemberName(m, team?.displayMode);
    Alert.alert('방장 위임', `${name}님에게 방장을 넘기면 내 방장 권한이 사라져요. 진행할까요?`, [
      { text: '취소', style: 'cancel' },
      { text: '위임', style: 'destructive', onPress: () => transferOwner(getMemberId(m)) },
    ]);
  };

  const onLongPress = (m: Member, index: number) => {
    const name = getMemberName(m, team?.displayMode);
    const targetIsOwner = m.role === 'owner';
    const buttons: { text: string; style?: 'cancel' | 'destructive'; onPress?: () => void }[] = [
      { text: '멤버 정보 보기', onPress: () => setInfoTarget({ member: m, index }) },
    ];
    if (isOwner && !targetIsOwner) {
      buttons.push({ text: '방장 위임', onPress: () => confirmTransfer(m) });
      buttons.push({ text: '강퇴', style: 'destructive', onPress: () => confirmKick(m) });
    }
    buttons.push({ text: '취소', style: 'cancel' });
    Alert.alert(name, undefined, buttons);
  };

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
        <Txt typography="t7" color={colors.textCaption}>멤버 {members.length}명 · 길게 눌러 정보 보기{isOwner ? '·관리' : ''}</Txt>
        <View style={styles.list}>
          {members.map((m, i) => {
            const name = getMemberName(m, team?.displayMode);
            const isOwnerMember = m.role === 'owner';
            return (
              <Pressable key={getMemberId(m) || i} style={styles.row} onLongPress={() => onLongPress(m, i)} delayLongPress={350}>
                <Avatar name={name} index={i} />
                <Txt typography="t5" fontWeight="medium" color={colors.textPrimary} numberOfLines={1} style={styles.name}>{name}</Txt>
                <View style={styles.spacer} />
                <View style={[styles.badge, isOwnerMember && styles.badgeOwner]}>
                  <Txt typography="t7" fontWeight="bold" color={isOwnerMember ? colors.brand : colors.textCaption}>{isOwnerMember ? '방장' : '멤버'}</Txt>
                </View>
              </Pressable>
            );
          })}
        </View>

        {isOwner && (
          <View style={styles.inviteSection}>
            <FormField label="멤버 초대" value={handle} onChangeText={setHandle} placeholder="상대방 고유 ID(handle)" autoCapitalize="none" maxLength={20} hint="영문 소문자·숫자·_ 로 검색해 초대해요" />
            <Pressable style={[styles.invite, (!handleValid || inviting) && styles.inviteOff]} onPress={onInvite} disabled={!handleValid || inviting}>
              <Txt typography="t5" fontWeight="bold" color={handleValid ? colors.brand : colors.textTertiary}>+ 초대하기</Txt>
            </Pressable>
            <Pressable style={styles.codeInvite} onPress={() => setInviteOpen(true)}>
              <Txt typography="t5" fontWeight="bold" color={colors.textSecondary}>초대 코드 · QR로 초대</Txt>
            </Pressable>
          </View>
        )}
      </ScrollView>

      {team && (
        <InviteSheet visible={inviteOpen} onClose={() => setInviteOpen(false)} teamId={getTeamId(team)} teamName={team.name} />
      )}

      <MemberInfoSheet
        member={infoTarget?.member ?? null}
        index={infoTarget?.index ?? 0}
        displayMode={team?.displayMode}
        onClose={() => setInfoTarget(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  scroll: { paddingHorizontal: spacing.screenX, paddingBottom: spacing.section, gap: spacing.md },
  list: { gap: spacing.lg },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  name: { flexShrink: 1 },
  spacer: { flex: 1 },
  badge: { paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: radius.pill, backgroundColor: colors.grey100 },
  badgeOwner: { backgroundColor: colors.brandTint },
  inviteSection: { marginTop: spacing.lg, gap: spacing.sm },
  invite: { alignItems: 'center', justifyContent: 'center', height: 52, borderRadius: radius.button, borderWidth: 1, borderColor: colors.divider, borderStyle: 'dashed' },
  inviteOff: { opacity: 0.6 },
  codeInvite: { alignItems: 'center', justifyContent: 'center', height: 52, borderRadius: radius.button, backgroundColor: colors.grey100 },
});
