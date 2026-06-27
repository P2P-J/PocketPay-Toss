import { createRoute, useNavigation } from '@granite-js/react-native';
import React from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import { colors } from '../constants/colors';
import { spacing } from '../constants/spacing';
import { DetailHeader } from '../components/layout/DetailHeader';
import { TeamForm } from '../components/team/TeamForm';
import { useTeamStore } from '../store/teamStore';

export const Route = createRoute('/team-new', { component: TeamNewPage });

function TeamNewPage() {
  const navigation = useNavigation();
  const createTeam = useTeamStore((s) => s.createTeam);

  return (
    <View style={styles.container}>
      <DetailHeader title="새 모임" />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <TeamForm
          submitLabel="모임 만들기"
          onSubmit={async (input) => {
            await createTeam(input);
            navigation.goBack();
          }}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  scroll: { paddingHorizontal: spacing.screenX, paddingBottom: spacing.section },
});
