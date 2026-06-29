import React, { PropsWithChildren } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, type ViewStyle } from 'react-native';

// 키보드가 입력칸을 가리지 않도록 화면을 밀어올리는 래퍼. 폼 화면 컨테이너로 사용.
export function KeyboardScreen({ children, style }: PropsWithChildren<{ style?: ViewStyle }>) {
  return (
    <KeyboardAvoidingView style={[styles.flex, style]} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      {children}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({ flex: { flex: 1 } });
