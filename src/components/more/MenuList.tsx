import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Txt } from '@toss/tds-react-native';
import { colors } from '../../constants/colors';
import { spacing } from '../../constants/spacing';

export interface MenuItem {
  emoji: string;
  label: string;
  value?: string;
}

// 메뉴 진입은 추후 — 현재는 시각용(탭해도 동작 없음).
export function MenuSection({ title, items }: { title: string; items: MenuItem[] }) {
  return (
    <View style={styles.section}>
      <Txt typography="t7" fontWeight="medium" color={colors.textCaption}>{title}</Txt>
      <View style={styles.card}>
        {items.map((item, i) => (
          <View key={item.label}>
            {i > 0 && <View style={styles.divider} />}
            <MenuRow item={item} />
          </View>
        ))}
      </View>
    </View>
  );
}

function MenuRow({ item }: { item: MenuItem }) {
  return (
    <Pressable style={styles.row}>
      <Text allowFontScaling={false} style={styles.emoji}>{item.emoji}</Text>
      <Txt typography="t5" color={colors.textPrimary}>{item.label}</Txt>
      <View style={styles.spacer} />
      {item.value && <Txt typography="t6" color={colors.textCaption}>{item.value}</Txt>}
      <Text style={styles.chevron}>›</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  section: { gap: spacing.sm },
  card: {},
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, height: 56 },
  emoji: { fontSize: 20, width: 24, textAlign: 'center', includeFontPadding: false },
  spacer: { flex: 1 },
  chevron: { fontSize: 20, color: colors.textTertiary, marginLeft: spacing.sm },
  divider: { height: 1, backgroundColor: colors.divider, marginLeft: 36 },
});
