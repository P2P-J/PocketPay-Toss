import React from 'react';
import { View, TextInput, StyleSheet, type KeyboardTypeOptions } from 'react-native';
import { Txt } from '@toss/tds-react-native';
import { colors } from '../../constants/colors';
import { spacing, radius } from '../../constants/spacing';

interface Props {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  hint?: string; // 입력칸 아래 보조 설명
  error?: string; // 있으면 hint 대신 빨강 메시지 + 테두리
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  maxLength?: number;
}

// 라벨 + 박스형 텍스트 입력 (폼 공용)
export function FormField({ label, value, onChangeText, placeholder, hint, error, keyboardType, autoCapitalize, maxLength }: Props) {
  return (
    <View style={styles.field}>
      <Txt typography="t7" color={colors.textSecondary}>{label}</Txt>
      <TextInput
        style={[styles.box, error ? styles.boxError : null]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textTertiary}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        maxLength={maxLength}
      />
      {error ? (
        <Txt typography="t7" color={colors.expense}>{error}</Txt>
      ) : hint ? (
        <Txt typography="t7" color={colors.textCaption}>{hint}</Txt>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  field: { gap: spacing.sm },
  box: { backgroundColor: colors.grey100, borderRadius: radius.button, paddingHorizontal: spacing.lg, height: 52, justifyContent: 'center', fontSize: 16, color: colors.textPrimary },
  boxError: { borderWidth: 1, borderColor: colors.expense },
});
