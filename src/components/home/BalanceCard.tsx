import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Txt } from '@toss/tds-react-native';
import { colors } from '../../constants/colors';
import { spacing, radius } from '../../constants/spacing';
import { formatWon } from '../../lib/format';

export function BalanceCard({ balance }: { balance: number }) {
  return (
    <View style={styles.card}>
      <Txt typography="t7" color={colors.textSecondary}>전체 잔액</Txt>
      <Txt typography="t1" color={colors.brand} fontWeight="bold">{formatWon(balance)}</Txt>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.divider,
    borderRadius: radius.card,
    padding: spacing.cardPadding,
    gap: spacing.xs,
  },
});
