import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Icon, Txt } from '@toss/tds-react-native';
import { colors } from '../../constants/colors';
import { spacing, radius } from '../../constants/spacing';

// 시각용 검색바 (검색 동작은 추후) — 입력 필드 모양만.
export function SearchBar() {
  return (
    <View style={styles.bar}>
      <Icon name="icon-search-mono" size={18} color={colors.textTertiary} />
      <Txt typography="t5" color={colors.textTertiary}>거래 내용 검색</Txt>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.grey100,
    borderRadius: radius.button,
    paddingHorizontal: spacing.lg,
    height: 48,
  },
});
