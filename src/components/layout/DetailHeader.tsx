import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useNavigation } from '@granite-js/react-native';
import { Txt } from '@toss/tds-react-native';
import { colors } from '../../constants/colors';
import { spacing } from '../../constants/spacing';

// 하위 상세 화면 공용 헤더 (뒤로 + 가운데 제목)
export function DetailHeader({ title }: { title: string }) {
  const navigation = useNavigation();
  return (
    <View style={styles.header}>
      <Pressable hitSlop={8} onPress={() => navigation.goBack()}><Text style={styles.back}>‹</Text></Pressable>
      <Txt typography="t3" fontWeight="bold" color={colors.textPrimary}>{title}</Txt>
      <View style={styles.spacer} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', height: 56, paddingHorizontal: spacing.screenX },
  back: { fontSize: 28, color: colors.textPrimary },
  spacer: { width: 24 },
});
