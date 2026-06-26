import { createRoute, useNavigation } from '@granite-js/react-native';
import React, { useState } from 'react';
import { ScrollView, View, TextInput, Pressable, StyleSheet } from 'react-native';
import { Txt } from '@toss/tds-react-native';
import { colors } from '../constants/colors';
import { spacing, radius } from '../constants/spacing';
import { DetailHeader } from '../components/layout/DetailHeader';
import { avatarColor } from '../constants/avatar';
import { useProfileStore } from '../store/profileStore';

export const Route = createRoute('/profile', { component: ProfilePage });

function ProfilePage() {
  const navigation = useNavigation();
  const profile = useProfileStore();

  const [name, setName] = useState(profile.name);
  const [nickname, setNickname] = useState(profile.nickname);
  const [handle, setHandle] = useState(profile.handle);

  const canSave = name.trim().length > 0 && nickname.trim().length > 0;
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

        <View style={styles.field}>
          <Txt typography="t7" color={colors.textSecondary}>실명</Txt>
          <TextInput style={styles.box} value={name} onChangeText={setName} placeholder="실명" placeholderTextColor={colors.textTertiary} maxLength={30} />
        </View>

        <View style={styles.field}>
          <Txt typography="t7" color={colors.textSecondary}>닉네임</Txt>
          <TextInput style={styles.box} value={nickname} onChangeText={setNickname} placeholder="닉네임" placeholderTextColor={colors.textTertiary} maxLength={20} />
        </View>

        <View style={styles.field}>
          <Txt typography="t7" color={colors.textSecondary}>고유 ID</Txt>
          <TextInput style={styles.box} value={handle} onChangeText={setHandle} placeholder="영문 소문자·숫자·_" placeholderTextColor={colors.textTertiary} autoCapitalize="none" maxLength={20} />
          <Txt typography="t7" color={colors.textCaption}>멤버 초대 시 검색에 쓰여요</Txt>
        </View>

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
  field: { gap: spacing.sm },
  box: { backgroundColor: colors.grey100, borderRadius: radius.button, paddingHorizontal: spacing.lg, height: 52, justifyContent: 'center', fontSize: 16, color: colors.textPrimary },
  save: { alignItems: 'center', justifyContent: 'center', height: 52, borderRadius: radius.button, backgroundColor: colors.brand, marginTop: spacing.sm },
  saveOff: { backgroundColor: colors.grey300 },
});
