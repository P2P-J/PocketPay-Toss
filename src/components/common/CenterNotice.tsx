import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Txt } from '@toss/tds-react-native';
import { colors } from '../../constants/colors';

// 화면 중앙 안내(에러/빈 상태) 공용
export function CenterNotice({ message, tone = 'caption' }: { message: string; tone?: 'caption' | 'error' }) {
  return (
    <View style={styles.center}>
      <Txt typography="t5" color={tone === 'error' ? colors.expense : colors.textCaption}>{message}</Txt>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 48 },
});
