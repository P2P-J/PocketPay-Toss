import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { Txt } from '@toss/tds-react-native';
import { colors } from '../../constants/colors';
import { spacing, radius } from '../../constants/spacing';

export type TxFilter = 'all' | 'income' | 'expense';

const CHIPS: { key: TxFilter; label: string }[] = [
  { key: 'all', label: '전체' },
  { key: 'income', label: '수입' },
  { key: 'expense', label: '지출' },
];

export function FilterChips({ value, onChange }: { value: TxFilter; onChange: (v: TxFilter) => void }) {
  return (
    <View style={styles.row}>
      {CHIPS.map((c) => {
        const on = value === c.key;
        return (
          <Pressable key={c.key} onPress={() => onChange(c.key)} style={[styles.chip, on && styles.chipOn]}>
            <Txt typography="t6" fontWeight={on ? 'bold' : 'medium'} color={on ? colors.white : colors.textSecondary}>
              {c.label}
            </Txt>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: spacing.sm },
  chip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: colors.grey100,
  },
  chipOn: { backgroundColor: colors.brand },
});
