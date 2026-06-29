import React from 'react';
import { Pressable, StyleSheet, type ViewStyle } from 'react-native';
import { Txt } from '@toss/tds-react-native';
import { colors } from '../../constants/colors';
import { radius } from '../../constants/spacing';

// 공통 기본 버튼 — 저장/제출/CTA. 비활성은 grey300으로 통일.
export function PrimaryButton({ label, onPress, disabled = false, tone = 'brand', style }: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  tone?: 'brand' | 'danger';
  style?: ViewStyle;
}) {
  const bg = disabled ? colors.grey300 : tone === 'danger' ? colors.expenseTint : colors.brand;
  const fg = tone === 'danger' ? colors.expense : colors.white;
  return (
    <Pressable style={[styles.btn, { backgroundColor: bg }, style]} onPress={onPress} disabled={disabled}>
      <Txt typography="t4" fontWeight="bold" color={fg}>{label}</Txt>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: { height: 52, borderRadius: radius.button, alignItems: 'center', justifyContent: 'center' },
});
