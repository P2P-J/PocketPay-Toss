import { createRoute, useNavigation } from '@granite-js/react-native';
import React from 'react';
import { ScrollView, Alert, StyleSheet } from 'react-native';
import { colors } from '../constants/colors';
import { spacing } from '../constants/spacing';
import { DetailHeader } from '../components/layout/DetailHeader';
import { KeyboardScreen } from '../components/common/KeyboardScreen';
import { TeamForm } from '../components/team/TeamForm';
import { useTeamStore } from '../store/teamStore';

export const Route = createRoute('/team-new', { component: TeamNewPage });

function TeamNewPage() {
  const navigation = useNavigation();
  const createTeam = useTeamStore((s) => s.createTeam);

  return (
    <KeyboardScreen style={styles.container}>
      <DetailHeader title="새 모임" />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <TeamForm
          submitLabel="모임 만들기"
          onSubmit={async (input) => {
            try {
              await createTeam(input);
              navigation.navigate('/'); // 새 모임이 현재 모임으로 잡힌 홈으로
            } catch (e) {
              Alert.alert('모임 생성 실패', e instanceof Error ? e.message : '다시 시도해주세요.');
            }
          }}
        />
      </ScrollView>
    </KeyboardScreen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  scroll: { paddingHorizontal: spacing.screenX, paddingBottom: spacing.section },
});
