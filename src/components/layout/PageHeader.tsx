import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Txt } from '@toss/tds-react-native';
import { colors } from '../../constants/colors';

// 홈 외 화면(거래/내역/더보기)의 큰 페이지 제목.
export function PageHeader({ title }: { title: string }) {
  return (
    <View style={styles.wrap}>
      <Txt typography="t2" fontWeight="bold" color={colors.textPrimary}>{title}</Txt>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { height: 56, justifyContent: 'center' },
});
