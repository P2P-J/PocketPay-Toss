import { useNavigation } from '@granite-js/react-native';
import React, { useState } from 'react';
import { View, Pressable, Alert, StyleSheet } from 'react-native';
import { Txt } from '@toss/tds-react-native';
import { colors } from '../../constants/colors';
import { spacing, radius } from '../../constants/spacing';
import { PREVIEW_MODE } from '../../constants/config';
import { Sparkle } from '../common/Sparkle';
import { JoinCodeSheet } from '../team/JoinCodeSheet';
import { useTeamStore } from '../../store/teamStore';
import { getTeamId } from '../../types/team';
import { teamApi } from '../../api/team';

export function EmptyTeams() {
  const navigation = useNavigation();
  const fetchTeams = useTeamStore((s) => s.fetchTeams);
  const setCurrentTeam = useTeamStore((s) => s.setCurrentTeam);
  const [joinOpen, setJoinOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const onJoin = async (code: string) => {
    if (PREVIEW_MODE) {
      Alert.alert('초대 코드 참가', '실연동 시 동작해요. (미리보기)');
      setJoinOpen(false);
      return;
    }
    setSubmitting(true);
    try {
      const res = await teamApi.joinByToken(code);
      const team = res.data.team;
      await fetchTeams();
      await setCurrentTeam(getTeamId(team));
      setJoinOpen(false);
      Alert.alert(res.data.alreadyMember ? '이미 참가한 모임이에요' : '참가 완료', `‘${team.name}’ 모임이에요.`);
    } catch (e) {
      Alert.alert('참가 실패', e instanceof Error ? e.message : '초대 코드가 만료됐거나 올바르지 않아요.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.wrap}>
      <View style={styles.badge}><Sparkle size={40} /></View>
      <Txt typography="t3" fontWeight="bold" color={colors.textPrimary}>아직 모임이 없어요</Txt>
      <Txt typography="t5" color={colors.textCaption} style={styles.sub}>첫 모임을 만들거나{'\n'}초대 코드로 참가해보세요</Txt>

      <View style={styles.actions}>
        <Pressable style={styles.primary} onPress={() => navigation.navigate('/team-new' as '/')}>
          <Txt typography="t4" fontWeight="bold" color={colors.white}>모임 만들기</Txt>
        </Pressable>
        <Pressable style={styles.secondary} onPress={() => setJoinOpen(true)}>
          <Txt typography="t4" fontWeight="bold" color={colors.textSecondary}>초대 코드로 참가</Txt>
        </Pressable>
      </View>

      <JoinCodeSheet visible={joinOpen} onClose={() => setJoinOpen(false)} onSubmit={onJoin} submitting={submitting} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.screenX, gap: spacing.sm },
  badge: { width: 72, height: 72, borderRadius: 24, backgroundColor: colors.brand, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.md },
  sub: { textAlign: 'center', lineHeight: 22, marginBottom: spacing.xl },
  actions: { alignSelf: 'stretch', gap: spacing.sm },
  primary: { height: 54, borderRadius: radius.button, backgroundColor: colors.brand, alignItems: 'center', justifyContent: 'center' },
  secondary: { height: 54, borderRadius: radius.button, backgroundColor: colors.grey100, alignItems: 'center', justifyContent: 'center' },
});
