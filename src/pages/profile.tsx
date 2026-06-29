import { createRoute, useNavigation } from '@granite-js/react-native';
import React, { useState } from 'react';
import { ScrollView, View, Pressable, Alert, StyleSheet } from 'react-native';
import { Txt } from '@toss/tds-react-native';
import { colors } from '../constants/colors';
import { spacing, radius } from '../constants/spacing';
import { PREVIEW_MODE } from '../constants/config';
import { DetailHeader } from '../components/layout/DetailHeader';
import { FormField } from '../components/common/FormField';
import { Avatar } from '../components/common/Avatar';
import { useProfileStore } from '../store/profileStore';
import { useAuthStore } from '../store/authStore';
import { useTeamStore } from '../store/teamStore';
import { isTeamOwner } from '../types/team';
import { isValidHandle } from '../lib/validation';
import { accountApi } from '../api/account';

export const Route = createRoute('/profile', { component: ProfilePage });

function ProfilePage() {
  const navigation = useNavigation();
  const profileStore = useProfileStore();
  const user = useAuthStore((s) => s.user);
  const refreshUser = useAuthStore((s) => s.refreshUser);
  const logout = useAuthStore((s) => s.logout);
  const teams = useTeamStore((s) => s.teams);

  // 더미: profileStore, 실모드: authStore.user(/account/me)
  const init = PREVIEW_MODE ? profileStore : { name: user?.name ?? '', nickname: user?.nickname ?? '', handle: user?.handle ?? '' };
  const [name, setName] = useState(init.name);
  const [nickname, setNickname] = useState(init.nickname);
  const [handle, setHandle] = useState(init.handle);
  const [saving, setSaving] = useState(false);

  const handleValid = isValidHandle(handle);
  const handleError = handle.trim() && !handleValid ? '영문 소문자, 숫자, _ 3~20자' : undefined;
  const canSave = name.trim().length > 0 && nickname.trim().length > 0 && handleValid && !saving;

  const onSave = async () => {
    if (!canSave) return;
    setSaving(true);
    try {
      if (PREVIEW_MODE) {
        profileStore.set({ name: name.trim(), nickname: nickname.trim(), handle: handle.trim() });
      } else {
        await accountApi.updateProfile({ name: name.trim(), nickname: nickname.trim() });
        if (handle.trim() !== (user?.handle ?? '')) await accountApi.updateHandle(handle.trim());
        await refreshUser();
      }
      navigation.goBack();
    } catch (e) {
      Alert.alert('저장 실패', e instanceof Error ? e.message : '다시 시도해주세요.');
    } finally {
      setSaving(false);
    }
  };

  const onLogout = () => {
    Alert.alert('로그아웃', '로그아웃 할까요?', [
      { text: '취소', style: 'cancel' },
      { text: '로그아웃', onPress: async () => { await logout(); navigation.navigate('/login'); } },
    ]);
  };

  const onDeleteAccount = () => {
    // 방장으로 있는 모임 목록 (프리뷰는 전체를 내 소유로 간주)
    const ownedNames = (PREVIEW_MODE ? teams : teams.filter((t) => isTeamOwner(t.members, user))).map((t) => t.name);
    const warn = ownedNames.length
      ? `방장으로 계신 '${ownedNames.join(', ')}' 모임이 전부 삭제됩니다. 모임이 운영 중이라면 다른 멤버에게 위임한 뒤 탈퇴해 주세요.`
      : '계정을 삭제하면 모든 데이터가 사라지고 되돌릴 수 없어요.';
    Alert.alert('계정 탈퇴', warn, [
      { text: '취소', style: 'cancel' },
      {
        text: '탈퇴 진행',
        style: 'destructive',
        onPress: () => {
          Alert.alert('한 번 더 확인', '정말 탈퇴할까요? 되돌릴 수 없어요.', [
            { text: '취소', style: 'cancel' },
            { text: '영구 탈퇴', style: 'destructive', onPress: async () => {
              try { if (!PREVIEW_MODE) await accountApi.deleteAccount(); } catch (e) { Alert.alert('탈퇴 실패', e instanceof Error ? e.message : '다시 시도해주세요.'); return; }
              await logout();
              navigation.navigate('/login');
            } },
          ]);
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <DetailHeader title="프로필" />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={styles.avatarWrap}>
          <Avatar name={nickname || name} index={0} size={72} typography="t2" />
          <Txt typography="t7" color={colors.textCaption}>토스 계정으로 로그인됨</Txt>
        </View>

        <FormField label="실명" value={name} onChangeText={setName} placeholder="실명" maxLength={30} />
        <FormField label="닉네임" value={nickname} onChangeText={setNickname} placeholder="닉네임" maxLength={20} />
        <FormField
          label="고유 ID"
          value={handle}
          onChangeText={setHandle}
          placeholder="영문 소문자, 숫자, _"
          autoCapitalize="none"
          maxLength={20}
          hint="멤버 초대 시 검색에 쓰여요 · 30일에 한 번 바꿀 수 있어요"
          error={handleError}
        />

        <Pressable style={[styles.save, !canSave && styles.saveOff]} onPress={onSave} disabled={!canSave}>
          <Txt typography="t4" fontWeight="bold" color={colors.white}>저장</Txt>
        </Pressable>

        <View style={styles.account}>
          <Pressable style={styles.textBtn} onPress={onLogout}>
            <Txt typography="t5" fontWeight="medium" color={colors.textSecondary}>로그아웃</Txt>
          </Pressable>
          <Pressable style={styles.textBtn} onPress={onDeleteAccount}>
            <Txt typography="t5" fontWeight="medium" color={colors.expense}>계정 탈퇴</Txt>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  scroll: { paddingHorizontal: spacing.screenX, paddingBottom: spacing.section, gap: spacing.lg },
  avatarWrap: { alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.lg },
  save: { alignItems: 'center', justifyContent: 'center', height: 52, borderRadius: radius.button, backgroundColor: colors.brand, marginTop: spacing.sm },
  saveOff: { backgroundColor: colors.grey300 },
  account: { marginTop: spacing.section, flexDirection: 'row', justifyContent: 'center', gap: spacing.xl },
  textBtn: { paddingVertical: spacing.sm, paddingHorizontal: spacing.md },
});
