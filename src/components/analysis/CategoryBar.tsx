import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Txt } from '@toss/tds-react-native';
import { colors } from '../../constants/colors';
import { spacing } from '../../constants/spacing';
import { formatWon } from '../../lib/format';
import { getCategoryLabel, getCategoryEmoji } from '../../constants/categories';

interface Props {
  category: string;
  total: number;
  percent: number; // 0~100
  color?: string; // 막대 색 (도넛 슬라이스와 매칭). 기본 브랜드 그린
}

export function CategoryBar({ category, total, percent, color = colors.brand }: Props) {
  return (
    <View style={styles.wrap}>
      <View style={styles.top}>
        <View style={styles.left}>
          <Text allowFontScaling={false} style={styles.emoji}>{getCategoryEmoji(category)}</Text>
          <Txt typography="t5" fontWeight="medium" color={colors.textPrimary}>{getCategoryLabel(category)}</Txt>
        </View>
        <View style={styles.right}>
          <Txt typography="t5" fontWeight="bold" color={colors.textPrimary}>{formatWon(total)}</Txt>
          <View style={styles.pct}>
            <Txt typography="t7" color={colors.textCaption}>{percent}%</Txt>
          </View>
        </View>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${Math.max(percent, 2)}%`, backgroundColor: color }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.sm },
  top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  left: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  right: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  emoji: { fontSize: 18, lineHeight: 23, includeFontPadding: false },
  pct: { width: 34, alignItems: 'flex-end' },
  track: { height: 8, borderRadius: 5, backgroundColor: colors.grey100, overflow: 'hidden' },
  fill: { height: 8, borderRadius: 5, backgroundColor: colors.brand },
});
