import { createRoute, useNavigation } from '@granite-js/react-native';
import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import { Txt } from '@toss/tds-react-native';
import { colors } from '../constants/colors';
import { spacing } from '../constants/spacing';
import { PREVIEW_MODE } from '../constants/config';
import { useAuthStore } from '../store/authStore';
import { useTeamStore } from '../store/teamStore';
import { getTeamId } from '../types/team';
import { teamApi } from '../api/team';
import { stashInvite } from '../lib/inviteStash';
import { isValidInviteCode } from '../lib/validation';

export const Route = createRoute('/join', { component: JoinPage });

function JoinPage() {
  const navigation = useNavigation();
  const params = Route.useParams() as { token?: string };
  const token = params?.token;
  const accessToken = useAuthStore((s) => s.accessToken);
  const user = useAuthStore((s) => s.user);
  const fetchTeams = useTeamStore((s) => s.fetchTeams);
  const setCurrentTeam = useTeamStore((s) => s.setCurrentTeam);
  const [msg, setMsg] = useState('초대를 확인하고 있어요…');

  useEffect(() => {
    (async () => {
      if (!token || PREVIEW_MODE || !isValidInviteCode(token)) { navigation.navigate('/'); return; }
      // 로그인/온보딩 전이면 보관만 하고 진입 흐름으로 — 홈에서 자동 참가
      if (!accessToken || !user || !user.handle) {
        await stashInvite(token);
        navigation.navigate('/');
        return;
      }
      try {
        const res = await teamApi.joinByToken(token);
        await fetchTeams(true);
        await setCurrentTeam(getTeamId(res.data.team));
        navigation.navigate('/');
        Alert.alert(res.data.alreadyMember ? '이미 참가한 모임이에요' : '참가 완료', `‘${res.data.team.name}’ 모임이에요.`);
      } catch {
        setMsg('초대 코드가 만료됐거나 올바르지 않아요.');
      }
    })();
  }, []);

  return (
    <View style={styles.center}>
      <ActivityIndicator color={colors.brand} />
      <Txt typography="t6" color={colors.textSecondary} style={styles.msg}>{msg}</Txt>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center', gap: spacing.md },
  msg: { textAlign: 'center', paddingHorizontal: spacing.section },
});
