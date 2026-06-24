import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Txt } from '@toss/tds-react-native';
import { colors } from '../../constants/colors';
import { spacing, radius } from '../../constants/spacing';
import type { Team } from '../../types/team';

export function TeamSummaryCard({ team }: { team: Team | null }) {
  const name = team?.name ?? '작은 모임';
  const memberCount = team?.members?.length ?? 0;
  return (
    <Pressable style={styles.card}>
      <View style={styles.icon}>
        <Text allowFontScaling={false} style={styles.emoji}>👖</Text>
      </View>
      <View style={styles.texts}>
        <Txt typography="t4" fontWeight="bold" color={colors.textPrimary}>{name}</Txt>
        <Txt typography="t7" color={colors.textCaption}>멤버 {memberCount}명 · 2024년 3월 개설</Txt>
      </View>
      <Text style={styles.chevron}>›</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.cardBg,
    borderRadius: radius.card,
    padding: spacing.cardPadding,
  },
  icon: {
    width: 52,
    height: 52,
    borderRadius: radius.card,
    backgroundColor: colors.brand,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: { fontSize: 24, lineHeight: 31, includeFontPadding: false },
  texts: { flex: 1, gap: 2 },
  chevron: { fontSize: 22, color: colors.textTertiary },
});
