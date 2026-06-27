import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Icon } from '@toss/tds-react-native';
import { colors } from '../../constants/colors';
import { spacing, radius } from '../../constants/spacing';

export function SearchBar({ value, onChangeText }: { value: string; onChangeText: (text: string) => void }) {
  return (
    <View style={styles.bar}>
      <Icon name="icon-search-mono" size={18} color={colors.textTertiary} />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder="거래 내용 검색"
        placeholderTextColor={colors.textTertiary}
        returnKeyType="search"
      />
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
  input: { flex: 1, fontSize: 15, color: colors.textPrimary, padding: 0 },
});
