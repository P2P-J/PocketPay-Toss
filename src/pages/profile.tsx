import { createRoute, useNavigation } from '@granite-js/react-native';
import React, { useState } from 'react';
import { ScrollView, View, Pressable, StyleSheet } from 'react-native';
import { Txt } from '@toss/tds-react-native';
import { colors } from '../constants/colors';
import { spacing, radius } from '../constants/spacing';
import { DetailHeader } from '../components/layout/DetailHeader';
import { FormField } from '../components/common/FormField';
import { avatarColor } from '../constants/avatar';
import { useProfileStore } from '../store/profileStore';

const HANDLE_RE = /^[a-z0-9_]{3,20}$/;

export const Route = createRoute('/profile', { component: ProfilePage });

function ProfilePage() {
  const navigation = useNavigation();
  const profile = useProfileStore();

  const [name, setName] = useState(profile.name);
  const [nickname, setNickname] = useState(profile.nickname);
  const [handle, setHandle] = useState(profile.handle);

  const handleValid = HANDLE_RE.test(handle.trim());
  const handleError = handle.trim() && !handleValid ? '영문 소문자·숫자·_ 3~20자' : undefined;
  const canSave = name.trim().length > 0 && nickname.trim().length > 0 && handleValid;
  const av = avatarColor(0);

  const onSave = () => {
    if (!canSave) return;
    profile.set({ name: name.trim(), nickname: nickname.trim(), handle: handle.trim() });
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <DetailHeader title="프로필" />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={styles.avatarWrap}>
          <View style={[styles.avatar, { backgroundColor: av.bg }]}>
            <Txt typography="t2" fontWeight="bold" color={av.fg}>{(nickname || name).slice(0, 1)}</Txt>
          </View>
          <Txt typography="t7" color={colors.textCaption}>토스 계정으로 로그인됨</Txt>
        </View>

        <FormField label="실명" value={name} onChangeText={setName} placeholder="실명" maxLength={30} />
        <FormField label="닉네임" value={nickname} onChangeText={setNickname} placeholder="닉네임" maxLength={20} />
        <FormField
          label="고유 ID"
          value={handle}
          onChangeText={setHandle}
          placeholder="영문 소문자·숫자·_"
          autoCapitalize="none"
          maxLength={20}
          hint="멤버 초대 시 검색에 쓰여요"
          error={handleError}
        />

        <Pressable style={[styles.save, !canSave && styles.saveOff]} onPress={onSave} disabled={!canSave}>
          <Txt typography="t4" fontWeight="bold" color={colors.white}>저장</Txt>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  scroll: { paddingHorizontal: spacing.screenX, paddingBottom: spacing.section, gap: spacing.lg },
  avatarWrap: { alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.lg },
  avatar: { width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center' },
  save: { alignItems: 'center', justifyContent: 'center', height: 52, borderRadius: radius.button, backgroundColor: colors.brand, marginTop: spacing.sm },
  saveOff: { backgroundColor: colors.grey300 },
});
