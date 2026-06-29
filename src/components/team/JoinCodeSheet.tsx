import React, { useEffect, useState } from 'react';
import { Modal, View, TextInput, Pressable, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { Txt } from '@toss/tds-react-native';
import { colors } from '../../constants/colors';
import { spacing, radius } from '../../constants/spacing';

export function JoinCodeSheet({ visible, onClose, onSubmit, submitting }: {
  visible: boolean;
  onClose: () => void;
  onSubmit: (code: string) => void;
  submitting: boolean;
}) {
  const [code, setCode] = useState('');
  useEffect(() => { if (visible) setCode(''); }, [visible]);
  const trimmed = code.trim();
  const canSubmit = trimmed.length > 0 && !submitting;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView style={styles.fill} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View style={styles.sheet}>
        <View style={styles.handle} />
        <Txt typography="t4" fontWeight="bold" color={colors.textPrimary}>초대 코드로 참가</Txt>
        <Txt typography="t6" color={colors.textSecondary} style={styles.sub}>방장에게 받은 초대 코드를 입력하세요</Txt>
        <TextInput
          style={styles.input}
          value={code}
          onChangeText={setCode}
          placeholder="초대 코드"
          placeholderTextColor={colors.textTertiary}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <Pressable style={[styles.submit, !canSubmit && styles.submitOff]} onPress={() => onSubmit(trimmed)} disabled={!canSubmit}>
          <Txt typography="t4" fontWeight="bold" color={colors.white}>{submitting ? '참가 중…' : '참가하기'}</Txt>
        </Pressable>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' },
  sheet: { backgroundColor: colors.white, borderTopLeftRadius: radius.sheet, borderTopRightRadius: radius.sheet, paddingHorizontal: spacing.screenX, paddingTop: spacing.md, paddingBottom: spacing.section, gap: spacing.sm },
  handle: { alignSelf: 'center', width: 40, height: 4, borderRadius: 2, backgroundColor: colors.grey200, marginBottom: spacing.md },
  sub: { marginBottom: spacing.sm },
  input: { height: 52, borderRadius: radius.button, backgroundColor: colors.grey100, paddingHorizontal: spacing.lg, fontSize: 16, color: colors.textPrimary },
  submit: { height: 52, borderRadius: radius.button, backgroundColor: colors.brand, alignItems: 'center', justifyContent: 'center', marginTop: spacing.sm },
  submitOff: { backgroundColor: colors.grey300 },
});
