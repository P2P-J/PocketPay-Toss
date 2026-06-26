import { createRoute, useNavigation } from '@granite-js/react-native';
import React, { useState } from 'react';
import { ScrollView, View, TextInput, Pressable, StyleSheet } from 'react-native';
import { Txt } from '@toss/tds-react-native';
import { colors } from '../constants/colors';
import { spacing, radius } from '../constants/spacing';
import { DetailHeader } from '../components/layout/DetailHeader';
import { useAccountStore, selectAccount } from '../store/accountStore';
import { useTeamStore } from '../store/teamStore';
import { getTeamId } from '../types/team';

export const Route = createRoute('/account', { component: AccountPage });

function AccountPage() {
  const navigation = useNavigation();
  const currentTeam = useTeamStore((s) => s.currentTeam);
  const teamId = currentTeam ? getTeamId(currentTeam) : '';
  const account = useAccountStore(selectAccount(teamId));
  const setAccount = useAccountStore((s) => s.setAccount);

  const [bank, setBank] = useState(account.bank);
  const [number, setNumber] = useState(account.number);
  const [holder, setHolder] = useState(account.holder);

  const onSave = () => {
    setAccount(teamId, { bank: bank.trim(), number: number.trim(), holder: holder.trim() });
    navigation.goBack();
  };

  const field = (label: string, value: string, onChange: (t: string) => void, placeholder: string, keyboard?: 'default' | 'number-pad') => (
    <View style={styles.field}>
      <Txt typography="t7" color={colors.textSecondary}>{label}</Txt>
      <TextInput style={styles.box} value={value} onChangeText={onChange} placeholder={placeholder} placeholderTextColor={colors.textTertiary} keyboardType={keyboard ?? 'default'} />
    </View>
  );

  return (
    <View style={styles.container}>
      <DetailHeader title="연결 계좌" />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <Txt typography="t7" color={colors.textCaption}>모임 정산에 사용할 계좌예요</Txt>
        {field('은행', bank, setBank, '예: 토스뱅크')}
        {field('계좌번호', number, setNumber, '- 없이 숫자만', 'number-pad')}
        {field('예금주', holder, setHolder, '예금주명')}
        <Pressable style={styles.save} onPress={onSave}>
          <Txt typography="t4" fontWeight="bold" color={colors.white}>저장</Txt>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  scroll: { paddingHorizontal: spacing.screenX, paddingBottom: spacing.section, gap: spacing.lg },
  field: { gap: spacing.sm },
  box: { backgroundColor: colors.grey100, borderRadius: radius.button, paddingHorizontal: spacing.lg, height: 52, justifyContent: 'center', fontSize: 16, color: colors.textPrimary },
  save: { alignItems: 'center', justifyContent: 'center', height: 52, borderRadius: radius.button, backgroundColor: colors.brand, marginTop: spacing.sm },
});
