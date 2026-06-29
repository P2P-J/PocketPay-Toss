import { useNavigation } from '@granite-js/react-native';
import React, { useEffect, useRef, useState } from 'react';
import { View, Animated, Easing, Pressable, Alert, StyleSheet } from 'react-native';
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

  // 은은하게 떠다니는 배경
  const drift = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(drift, { toValue: 1, duration: 6000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(drift, { toValue: 0, duration: 6000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [drift]);
  const float = drift.interpolate({ inputRange: [0, 1], outputRange: [0, -10] });

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
      <View style={styles.hero}>
        <Animated.View style={[styles.badge, { transform: [{ translateY: float }] }]}>
          <Sparkle size={40} />
        </Animated.View>
        <Txt typography="t3" fontWeight="bold" color={colors.textPrimary}>작은 모임</Txt>
        <Txt typography="t6" color={colors.textCaption} style={styles.sub}>아직 참여 중인 모임이 없어요{'\n'}첫 모임을 만들거나 초대 코드로 참가해보세요</Txt>
      </View>

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
  wrap: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.screenX },
  hero: { alignItems: 'center', gap: spacing.sm },
  badge: { width: 80, height: 80, borderRadius: 26, backgroundColor: colors.brand, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.md, shadowColor: colors.brand, shadowOpacity: 0.35, shadowRadius: 16, shadowOffset: { width: 0, height: 8 }, elevation: 6 },
  sub: { textAlign: 'center', lineHeight: 22, marginTop: spacing.xs },
  actions: { alignSelf: 'stretch', gap: spacing.sm, marginTop: spacing.section },
  primary: { height: 54, borderRadius: radius.button, backgroundColor: colors.brand, alignItems: 'center', justifyContent: 'center' },
  secondary: { height: 54, borderRadius: radius.button, backgroundColor: colors.grey100, alignItems: 'center', justifyContent: 'center' },
});
