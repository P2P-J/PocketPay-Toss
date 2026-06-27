import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useNavigation } from '@granite-js/react-native';
import { Txt } from '@toss/tds-react-native';
import { colors } from '../../constants/colors';
import { spacing, radius } from '../../constants/spacing';
import type { Team } from '../../types/team';

export function TeamSummaryCard({ team }: { team: Team | null }) {
  const navigation = useNavigation();
  const name = team?.name ?? '작은 모임';
  const memberCount = team?.members?.length ?? 0;
  return (
    <Pressable style={styles.card} onPress={() => navigation.navigate('/members' as '/')}>
      <View style={styles.icon}>
        {team?.emoji ? (
          <Text allowFontScaling={false} style={styles.emoji}>{team.emoji}</Text>
        ) : (
          <Txt typography="t4" fontWeight="bold" color={colors.white}>{name.slice(0, 1)}</Txt>
        )}
      </View>
      <View style={styles.texts}>
        <Txt typography="t4" fontWeight="bold" color={colors.textPrimary} numberOfLines={1}>{name}</Txt>
        <Txt typography="t7" color={colors.textCaption}>멤버 {memberCount}명</Txt>
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
  emoji: { fontSize: 26, lineHeight: 32, includeFontPadding: false },
  texts: { flex: 1, gap: 2 },
  chevron: { fontSize: 22, color: colors.textTertiary },
});
