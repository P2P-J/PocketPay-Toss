import { createRoute, useNavigation } from '@granite-js/react-native';
import React, { useState } from 'react';
import { ScrollView, View, Text, TextInput, Pressable, Switch, StyleSheet } from 'react-native';
import { Txt } from '@toss/tds-react-native';
import { colors } from '../constants/colors';
import { spacing, radius } from '../constants/spacing';
import { formatAmountInput, parseAmount } from '../lib/format';
import { DetailHeader } from '../components/layout/DetailHeader';
import { FormField } from '../components/common/FormField';
import { useTeamStore } from '../store/teamStore';
import type { TeamCategory, TeamDisplayMode, TeamAccountMode } from '../types/team';

export const Route = createRoute('/team-new', { component: TeamNewPage });

function Segmented<T extends string>({ value, onChange, options }: { value: T; onChange: (v: T) => void; options: { value: T; label: string }[] }) {
  return (
    <View style={styles.seg}>
      {options.map((o) => {
        const on = value === o.value;
        return (
          <Pressable key={o.value} style={[styles.segItem, on && styles.segItemOn]} onPress={() => onChange(o.value)}>
            <Txt typography="t5" fontWeight={on ? 'bold' : 'medium'} color={on ? colors.brand : colors.textCaption}>{o.label}</Txt>
          </Pressable>
        );
      })}
    </View>
  );
}

function TeamNewPage() {
  const navigation = useNavigation();
  const createTeam = useTeamStore((s) => s.createTeam);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<TeamCategory>('friend');
  const [displayMode, setDisplayMode] = useState<TeamDisplayMode>('nickname');
  const [accountMode, setAccountMode] = useState<TeamAccountMode>('personal');
  const [feeEnabled, setFeeEnabled] = useState(false);
  const [feeAmount, setFeeAmount] = useState(0);
  const [feeDueDay, setFeeDueDay] = useState(0);

  // 회비 켜면 금액>0 + 납부일 1~31 필수
  const feeValid = !feeEnabled || (feeAmount > 0 && feeDueDay >= 1 && feeDueDay <= 31);
  const canCreate = name.trim().length > 0 && feeValid;

  const [creating, setCreating] = useState(false);
  const onCreate = async () => {
    if (!canCreate || creating) return;
    setCreating(true);
    try {
      await createTeam({
      name: name.trim(),
      description: description.trim() || undefined,
      category,
      displayMode,
      accountMode,
      feeEnabled,
        feeAmount: feeEnabled ? feeAmount : undefined,
        feeDueDay: feeEnabled ? feeDueDay : undefined,
      });
      navigation.goBack();
    } finally {
      setCreating(false);
    }
  };

  return (
    <View style={styles.container}>
      <DetailHeader title="새 모임" />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <FormField label="모임 이름" value={name} onChangeText={setName} placeholder="예: 청바지" maxLength={50} />
        <FormField label="소개 (선택)" value={description} onChangeText={setDescription} placeholder="모임을 한 줄로 소개해요" maxLength={200} />

        {/* 성격 */}
        <View style={styles.field}>
          <Txt typography="t7" color={colors.textSecondary}>모임 성격</Txt>
          <Segmented value={category} onChange={setCategory} options={[{ value: 'friend', label: '친구 모임' }, { value: 'club', label: '동호회·동아리' }]} />
        </View>

        {/* 멤버 표시 */}
        <View style={styles.field}>
          <Txt typography="t7" color={colors.textSecondary}>멤버 표시</Txt>
          <Segmented value={displayMode} onChange={setDisplayMode} options={[{ value: 'nickname', label: '닉네임' }, { value: 'realName', label: '실명' }]} />
          <Txt typography="t7" color={colors.textCaption}>이 모임에서 멤버 이름을 어떻게 보여줄지 정해요</Txt>
        </View>

        {/* 계좌 모드 */}
        <View style={styles.field}>
          <Txt typography="t7" color={colors.textSecondary}>정산 계좌</Txt>
          <Segmented value={accountMode} onChange={setAccountMode} options={[{ value: 'personal', label: '개인 계좌' }, { value: 'team', label: '모임 통장' }]} />
          <Txt typography="t7" color={colors.textCaption}>더치페이·정산 시 받을 계좌 종류예요</Txt>
        </View>

        {/* 회비 */}
        <View style={styles.field}>
          <View style={styles.feeHead}>
            <Txt typography="t7" color={colors.textSecondary}>월 회비</Txt>
            <Switch value={feeEnabled} onValueChange={setFeeEnabled} trackColor={{ false: colors.grey200, true: colors.brand }} thumbColor={colors.white} />
          </View>
          {feeEnabled && (
            <View style={styles.feeBody}>
              <View style={styles.feeRow}>
                <Txt typography="t7" color={colors.textCaption}>회비 금액</Txt>
                <View style={styles.feeInputWrap}>
                  <Text style={styles.won}>₩</Text>
                  <TextInput style={styles.feeInput} value={formatAmountInput(feeAmount)} onChangeText={(t) => setFeeAmount(parseAmount(t))} keyboardType="number-pad" placeholder="0" placeholderTextColor={colors.textTertiary} />
                </View>
              </View>
              <View style={styles.feeRow}>
                <Txt typography="t7" color={colors.textCaption}>납부일 (매월)</Txt>
                <View style={styles.feeInputWrap}>
                  <TextInput style={styles.dayInput} value={feeDueDay ? String(feeDueDay) : ''} onChangeText={(t) => setFeeDueDay(Math.min(parseAmount(t), 31))} keyboardType="number-pad" placeholder="1" placeholderTextColor={colors.textTertiary} />
                  <Text style={styles.dayUnit}>일</Text>
                </View>
              </View>
            </View>
          )}
        </View>

        <Pressable style={[styles.create, (!canCreate || creating) && styles.createOff]} onPress={onCreate} disabled={!canCreate || creating}>
          <Txt typography="t4" fontWeight="bold" color={colors.white}>모임 만들기</Txt>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  scroll: { paddingHorizontal: spacing.screenX, paddingBottom: spacing.section, gap: spacing.lg },
  field: { gap: spacing.sm },
  seg: { flexDirection: 'row', backgroundColor: colors.grey100, borderRadius: radius.button, padding: 4 },
  segItem: { flex: 1, alignItems: 'center', justifyContent: 'center', height: 44, borderRadius: radius.button - 2 },
  segItemOn: { backgroundColor: colors.white },
  feeHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  feeBody: { gap: spacing.md, backgroundColor: colors.cardBg, borderRadius: radius.card, padding: spacing.lg },
  feeRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  feeInputWrap: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  won: { fontSize: 16, fontWeight: '600', color: colors.textPrimary },
  feeInput: { minWidth: 90, fontSize: 16, fontWeight: '600', color: colors.textPrimary, textAlign: 'right', padding: 0 },
  dayInput: { minWidth: 36, fontSize: 16, fontWeight: '600', color: colors.textPrimary, textAlign: 'right', padding: 0 },
  dayUnit: { fontSize: 16, color: colors.textSecondary },
  create: { alignItems: 'center', justifyContent: 'center', height: 52, borderRadius: radius.button, backgroundColor: colors.brand, marginTop: spacing.sm },
  createOff: { backgroundColor: colors.grey300 },
});
