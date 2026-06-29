import { createRoute, useNavigation } from '@granite-js/react-native';
import React, { useEffect, useState } from 'react';
import { View, ScrollView, Alert, StyleSheet } from 'react-native';
import { Txt } from '@toss/tds-react-native';
import { colors } from '../constants/colors';
import { spacing } from '../constants/spacing';
import { FormField } from '../components/common/FormField';
import { KeyboardScreen } from '../components/common/KeyboardScreen';
import { PrimaryButton } from '../components/common/PrimaryButton';
import { useAuthStore } from '../store/authStore';
import { isValidHandle } from '../lib/validation';
import { accountApi } from '../api/account';

export const Route = createRoute('/onboarding', { component: OnboardingPage });

type CheckState = { state: 'idle' | 'checking' | 'ok' | 'taken' | 'invalid'; msg?: string };

function OnboardingPage() {
  const navigation = useNavigation();
  const user = useAuthStore((s) => s.user);
  const refreshUser = useAuthStore((s) => s.refreshUser);

  const [name, setName] = useState(user?.name ?? '');
  const [nickname, setNickname] = useState(''); // 실명으로 채우지 않음 — 직접 입력
  const [handle, setHandle] = useState('');
  const [check, setCheck] = useState<CheckState>({ state: 'idle' });
  const [saving, setSaving] = useState(false);

  // 핸들 실시간 형식검증 + 중복확인 (디바운스)
  useEffect(() => {
    const h = handle.trim().toLowerCase();
    if (!h) { setCheck({ state: 'idle' }); return; }
    if (!isValidHandle(h)) { setCheck({ state: 'invalid', msg: '영문 소문자, 숫자, _ 3~20자' }); return; }
    setCheck({ state: 'checking' });
    const t = setTimeout(async () => {
      try {
        const res = await accountApi.checkHandle(h);
        setCheck(res.data.available ? { state: 'ok', msg: '사용 가능한 ID예요' } : { state: 'taken', msg: res.data.reason || '이미 사용 중인 ID예요' });
      } catch {
        setCheck({ state: 'idle' });
      }
    }, 450);
    return () => clearTimeout(t);
  }, [handle]);

  const canSave = !!name.trim() && !!nickname.trim() && check.state === 'ok' && !saving;

  const onSubmit = async () => {
    if (!canSave) return;
    setSaving(true);
    try {
      await accountApi.updateProfile({ name: name.trim(), nickname: nickname.trim() });
      await accountApi.updateHandle(handle.trim().toLowerCase());
      await refreshUser();
      navigation.navigate('/');
    } catch (e) {
      // 중복 레이스 등 — 폼 유지하고 안내
      const msg = e instanceof Error ? e.message : '다시 시도해주세요.';
      if (/사용 중|이미/.test(msg)) setCheck({ state: 'taken', msg: '이미 사용 중인 ID예요' });
      else Alert.alert('저장 실패', msg);
    } finally {
      setSaving(false);
    }
  };

  const handleHint = check.state === 'checking' ? '확인 중…'
    : check.state === 'ok' ? '✓ 사용 가능한 ID예요'
    : '친구가 초대할 때 쓰는 고유 ID · 30일에 한 번만 바꿀 수 있어요';
  const handleError = check.state === 'taken' || check.state === 'invalid' ? check.msg : undefined;

  return (
    <KeyboardScreen style={styles.container}>
      <View style={styles.header}>
        <Txt typography="t4" fontWeight="bold" color={colors.textPrimary}>프로필 설정</Txt>
      </View>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <Txt typography="t5" color={colors.textSecondary} style={styles.intro}>환영해요! 모임에서 쓸 프로필을 만들어요.</Txt>
        <FormField label="실명" value={name} onChangeText={setName} placeholder="실명" maxLength={30} hint="정산·회비 안내에 쓰일 수 있어요" />
        <FormField label="닉네임" value={nickname} onChangeText={setNickname} placeholder="모임에서 보여질 이름" maxLength={20} />
        <FormField label="고유 ID (핸들)" value={handle} onChangeText={setHandle} placeholder="영문 소문자, 숫자, _" autoCapitalize="none" maxLength={20} hint={handleHint} error={handleError} />
      </ScrollView>
      <View style={styles.bottom}>
        <PrimaryButton label={saving ? '저장 중…' : '시작하기'} onPress={onSubmit} disabled={!canSave} />
      </View>
    </KeyboardScreen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  header: { paddingHorizontal: spacing.screenX, paddingVertical: spacing.lg },
  scroll: { paddingHorizontal: spacing.screenX, paddingBottom: spacing.section, gap: spacing.lg },
  intro: { marginBottom: spacing.xs },
  bottom: { paddingHorizontal: spacing.screenX, paddingBottom: 40, paddingTop: spacing.sm },
});
