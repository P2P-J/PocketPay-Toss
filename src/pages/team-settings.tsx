import { createRoute, useNavigation } from '@granite-js/react-native';
import React from 'react';
import { ScrollView, View, Pressable, Alert, StyleSheet } from 'react-native';
import { Txt } from '@toss/tds-react-native';
import { colors } from '../constants/colors';
import { spacing, radius } from '../constants/spacing';
import { DetailHeader } from '../components/layout/DetailHeader';
import { TeamForm } from '../components/team/TeamForm';
import { CenterNotice } from '../components/common/CenterNotice';
import { useTeamStore } from '../store/teamStore';
import { useIsOwner } from '../hooks/useIsOwner';

export const Route = createRoute('/team-settings', { component: TeamSettingsPage });

function TeamSettingsPage() {
  const navigation = useNavigation();
  const currentTeam = useTeamStore((s) => s.currentTeam);
  const updateTeam = useTeamStore((s) => s.updateTeam);
  const deleteTeam = useTeamStore((s) => s.deleteTeam);
  const isOwner = useIsOwner();

  if (!currentTeam) {
    return (
      <View style={styles.container}>
        <DetailHeader title="모임 설정" />
        <CenterNotice message="모임이 없어요" />
      </View>
    );
  }
  if (!isOwner) {
    return (
      <View style={styles.container}>
        <DetailHeader title="모임 설정" />
        <CenterNotice message="방장만 모임을 수정할 수 있어요" />
      </View>
    );
  }

  const initial = {
    name: currentTeam.name,
    description: currentTeam.description,
    category: currentTeam.category,
    displayMode: currentTeam.displayMode,
    accountMode: currentTeam.accountMode,
    feeEnabled: currentTeam.feeEnabled ?? false,
    feeAmount: currentTeam.feeAmount,
    feeDueDay: currentTeam.feeDueDay,
  };

  // 모임 삭제 — 강력 2단계 확인
  const onDelete = () => {
    Alert.alert('모임 삭제', `'${currentTeam.name}'의 모든 거래내역과 멤버가 삭제됩니다. 정말 지우시겠습니까?`, [
      { text: '취소', style: 'cancel' },
      {
        text: '삭제',
        style: 'destructive',
        onPress: () => {
          Alert.alert('한 번 더 확인', '되돌릴 수 없어요. 정말 이 모임을 영구 삭제할까요?', [
            { text: '취소', style: 'cancel' },
            { text: '영구 삭제', style: 'destructive', onPress: async () => { await deleteTeam(); navigation.navigate('/'); } },
          ]);
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <DetailHeader title="모임 설정" />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <TeamForm
          initial={initial}
          submitLabel="저장"
          onSubmit={async (input) => {
            await updateTeam(input);
            navigation.goBack();
          }}
        />
        <Pressable style={styles.delete} onPress={onDelete}>
          <Txt typography="t4" fontWeight="bold" color={colors.expense}>모임 삭제</Txt>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  scroll: { paddingHorizontal: spacing.screenX, paddingBottom: spacing.section, gap: spacing.lg },
  delete: { alignItems: 'center', justifyContent: 'center', height: 52, borderRadius: radius.button, backgroundColor: '#FFEDED' },
});
