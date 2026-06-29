import { createRoute, useNavigation } from '@granite-js/react-native';
import React, { useState } from 'react';
import { ScrollView, Pressable, Alert, StyleSheet } from 'react-native';
import { Txt } from '@toss/tds-react-native';
import { colors } from '../constants/colors';
import { spacing, radius } from '../constants/spacing';
import { DetailHeader } from '../components/layout/DetailHeader';
import { FormField } from '../components/common/FormField';
import { KeyboardScreen } from '../components/common/KeyboardScreen';
import { PREVIEW_MODE } from '../constants/config';
import { useAccountStore, selectAccount } from '../store/accountStore';
import { useTeamStore } from '../store/teamStore';
import { teamApi } from '../api/team';
import { useCurrentTeamId } from '../hooks/useCurrentTeamId';

export const Route = createRoute('/account', { component: AccountPage });

function AccountPage() {
  const navigation = useNavigation();
  const teamId = useCurrentTeamId();
  const currentTeam = useTeamStore((s) => s.currentTeam);
  const setCurrentTeam = useTeamStore((s) => s.setCurrentTeam);
  const dummyAccount = useAccountStore(selectAccount(teamId));
  const setAccount = useAccountStore((s) => s.set);

  // 더미: accountStore, 실모드: Team.account
  const account = PREVIEW_MODE ? dummyAccount : currentTeam?.account ?? { bank: '', number: '', holder: '' };
  const [bank, setBank] = useState(account.bank);
  const [number, setNumber] = useState(account.number);
  const [holder, setHolder] = useState(account.holder);
  const [saving, setSaving] = useState(false);

  // 빈 계좌(전부 미입력)는 허용, 일부만 입력하면 안내. 번호는 숫자 8~16자리.
  const anyFilled = !!(bank.trim() || number.trim() || holder.trim());
  const digits = number.replace(/[^\d]/g, '');
  const numberError = anyFilled && number.trim() && (digits.length < 8 || digits.length > 16) ? '계좌번호는 숫자 8~16자리예요' : undefined;
  const canSave = !saving && (!anyFilled || (!!bank.trim() && !!holder.trim() && digits.length >= 8 && digits.length <= 16));

  const onSave = async () => {
    if (!canSave) return;
    setSaving(true);
    const next = { bank: bank.trim(), number: digits, holder: holder.trim() };
    try {
      if (PREVIEW_MODE) {
        setAccount(teamId, next);
      } else {
        await teamApi.update(teamId, { account: next });
        await setCurrentTeam(teamId);
      }
      navigation.goBack();
    } catch (e) {
      Alert.alert('저장 실패', e instanceof Error ? e.message : '다시 시도해주세요.'); // 실패 시 화면 유지
    } finally {
      setSaving(false);
    }
  };

  return (
    <KeyboardScreen style={styles.container}>
      <DetailHeader title="연결 계좌" />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <Txt typography="t7" color={colors.textCaption}>모임 정산에 사용할 계좌예요</Txt>
        <FormField label="은행" value={bank} onChangeText={setBank} placeholder="예: 토스뱅크" maxLength={20} />
        <FormField label="계좌번호" value={number} onChangeText={setNumber} placeholder="- 없이 숫자만" keyboardType="number-pad" maxLength={20} error={numberError} />
        <FormField label="예금주" value={holder} onChangeText={setHolder} placeholder="예금주명" maxLength={20} />
        <Pressable style={[styles.save, !canSave && styles.saveOff]} onPress={onSave} disabled={!canSave}>
          <Txt typography="t4" fontWeight="bold" color={colors.white}>저장</Txt>
        </Pressable>
      </ScrollView>
    </KeyboardScreen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  scroll: { paddingHorizontal: spacing.screenX, paddingBottom: spacing.section, gap: spacing.lg },
  save: { alignItems: 'center', justifyContent: 'center', height: 52, borderRadius: radius.button, backgroundColor: colors.brand, marginTop: spacing.sm },
  saveOff: { backgroundColor: colors.grey300 },
});
