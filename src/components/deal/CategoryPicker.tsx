import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Txt } from '@toss/tds-react-native';
import { colors } from '../../constants/colors';
import { spacing, radius } from '../../constants/spacing';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../../constants/categories';

interface Props {
  type: 'income' | 'expense';
  value: string | null;
  onChange: (value: string) => void;
}

export function CategoryPicker({ type, value, onChange }: Props) {
  const cats = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
  return (
    <View style={styles.grid}>
      {cats.map((c) => {
        const on = value === c.value;
        return (
          <Pressable key={c.value} onPress={() => onChange(c.value)} style={[styles.chip, on && styles.chipOn]}>
            <Text allowFontScaling={false} style={styles.emoji}>{c.emoji}</Text>
            <Txt typography="t6" fontWeight={on ? 'bold' : 'medium'} color={on ? colors.white : colors.textSecondary}>{c.label}</Txt>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.divider,
    backgroundColor: colors.white,
  },
  chipOn: { backgroundColor: colors.brand, borderColor: colors.brand },
  emoji: { fontSize: 15, lineHeight: 20, includeFontPadding: false },
});
