import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, Switch, StyleSheet } from 'react-native';
import { Txt } from '@toss/tds-react-native';
import { colors } from '../../constants/colors';
import { spacing, radius } from '../../constants/spacing';
import { formatAmountInput, parseAmount } from '../../lib/format';
import { FormField } from '../common/FormField';
import { PrimaryButton } from '../common/PrimaryButton';
import type { NewTeamInput } from '../../store/teamStore';
import type { TeamCategory, TeamDisplayMode, TeamAccountMode } from '../../types/team';

const EMOJI_OPTIONS = ['👥', '🍻', '⚽', '🎮', '📚', '✈️', '🍱', '🎵', '💼', '🏠', '🎨', '🐶', '☕', '🎬', '💪', '🌱'];

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

interface Props {
  initial?: Partial<NewTeamInput>;
  submitLabel: string;
  onSubmit: (input: NewTeamInput) => Promise<void>;
}

// 모임 생성/설정 공용 폼
export function TeamForm({ initial, submitLabel, onSubmit }: Props) {
  const [name, setName] = useState(initial?.name ?? '');
  const [emoji, setEmoji] = useState(initial?.emoji ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [category, setCategory] = useState<TeamCategory>(initial?.category ?? 'friend');
  const [displayMode, setDisplayMode] = useState<TeamDisplayMode>(initial?.displayMode ?? 'nickname');
  const [accountMode, setAccountMode] = useState<TeamAccountMode>(initial?.accountMode ?? 'personal');
  const [feeEnabled, setFeeEnabled] = useState(initial?.feeEnabled ?? false);
  const [feeAmount, setFeeAmount] = useState(initial?.feeAmount ?? 0);
  const [feeDueDay, setFeeDueDay] = useState(initial?.feeDueDay ?? 0);
  const [submitting, setSubmitting] = useState(false);

  const feeValid = !feeEnabled || (feeAmount > 0 && feeDueDay >= 1 && feeDueDay <= 31);
  const canSubmit = name.trim().length > 0 && feeValid && !submitting;

  const submit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      await onSubmit({
        name: name.trim(),
        emoji: emoji || undefined,
        description: description.trim() || undefined,
        category,
        displayMode,
        accountMode,
        feeEnabled,
        feeAmount: feeEnabled ? feeAmount : undefined,
        feeDueDay: feeEnabled ? feeDueDay : undefined,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.wrap}>
      <FormField label="모임 이름" value={name} onChangeText={setName} placeholder="예: 청바지" maxLength={50} />

      <View style={styles.field}>
        <Txt typography="t7" color={colors.textSecondary}>모임 이모지 (선택)</Txt>
        <View style={styles.emojiGrid}>
          {EMOJI_OPTIONS.map((e) => {
            const on = emoji === e;
            return (
              <Pressable key={e} style={[styles.emojiItem, on && styles.emojiItemOn]} onPress={() => setEmoji(on ? '' : e)}>
                <Text allowFontScaling={false} style={styles.emojiText}>{e}</Text>
              </Pressable>
            );
          })}
        </View>
        <Txt typography="t7" color={colors.textCaption}>선택 안 하면 모임명 앞글자로 보여요</Txt>
      </View>

      <FormField label="소개 (선택)" value={description} onChangeText={setDescription} placeholder="모임을 한 줄로 소개해요" maxLength={200} />

      <View style={styles.field}>
        <Txt typography="t7" color={colors.textSecondary}>모임 성격</Txt>
        <Segmented value={category} onChange={setCategory} options={[{ value: 'friend', label: '친구 모임' }, { value: 'club', label: '동호회·동아리' }]} />
      </View>

      <View style={styles.field}>
        <Txt typography="t7" color={colors.textSecondary}>멤버 표시</Txt>
        <Segmented value={displayMode} onChange={setDisplayMode} options={[{ value: 'nickname', label: '닉네임' }, { value: 'realName', label: '실명' }]} />
        <Txt typography="t7" color={colors.textCaption}>이 모임에서 멤버 이름을 어떻게 보여줄지 정해요</Txt>
      </View>

      <View style={styles.field}>
        <Txt typography="t7" color={colors.textSecondary}>정산 계좌</Txt>
        <Segmented value={accountMode} onChange={setAccountMode} options={[{ value: 'personal', label: '개인 계좌' }, { value: 'team', label: '모임 통장' }]} />
        <Txt typography="t7" color={colors.textCaption}>더치페이·정산 시 받을 계좌 종류예요</Txt>
      </View>

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

      <PrimaryButton label={submitLabel} onPress={submit} disabled={!canSubmit} style={styles.submit} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.lg },
  field: { gap: spacing.sm },
  seg: { flexDirection: 'row', backgroundColor: colors.grey100, borderRadius: radius.button, padding: 4 },
  segItem: { flex: 1, alignItems: 'center', justifyContent: 'center', height: 44, borderRadius: radius.button - 2 },
  segItemOn: { backgroundColor: colors.white },
  emojiGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  emojiItem: { width: 44, height: 44, borderRadius: radius.button, backgroundColor: colors.grey100, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.grey100 },
  emojiItemOn: { borderColor: colors.brand, backgroundColor: colors.brandTint },
  emojiText: { fontSize: 22, lineHeight: 28, includeFontPadding: false },
  feeHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  feeBody: { gap: spacing.md, backgroundColor: colors.cardBg, borderRadius: radius.card, padding: spacing.lg },
  feeRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  feeInputWrap: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  won: { fontSize: 16, fontWeight: '600', color: colors.textPrimary },
  feeInput: { minWidth: 90, fontSize: 16, fontWeight: '600', color: colors.textPrimary, textAlign: 'right', padding: 0 },
  dayInput: { minWidth: 36, fontSize: 16, fontWeight: '600', color: colors.textPrimary, textAlign: 'right', padding: 0 },
  dayUnit: { fontSize: 16, color: colors.textSecondary },
  submit: { marginTop: spacing.sm },
});
