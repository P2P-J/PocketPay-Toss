import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Txt, Icon } from '@toss/tds-react-native';
import { colors } from '../../constants/colors';
import { spacing, radius } from '../../constants/spacing';
import { formatWon, formatSigned } from '../../lib/format';

// 그린 배경 위 텍스트/요소 색 (흰색 알파) — 배경이 브랜드 그린이라 별도 토큰 사용
const onGreen = {
  strong: '#ffffff',
  soft: 'rgba(255,255,255,0.78)',
  pill: 'rgba(255,255,255,0.20)',
};

interface Props {
  balance: number;
  income: number;
  expense: number;
}

export function BalanceCard({ balance, income, expense }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.pill}>
        <Txt typography="t7" fontWeight="medium" color={onGreen.strong}>이번 달</Txt>
        <Icon name="icon-arrow-down-mono" size={16} color={onGreen.strong} />
      </View>
      <View style={styles.balanceBlock}>
        <Txt typography="t7" color={onGreen.soft}>전체 잔액</Txt>
        <Txt typography="t1" fontWeight="bold" color={onGreen.strong}>{formatWon(balance)}</Txt>
      </View>
      <View style={styles.summary}>
        <View style={styles.col}>
          <Txt typography="t7" color={onGreen.soft}>수입</Txt>
          <Txt typography="t4" fontWeight="bold" color={onGreen.strong}>{formatSigned(income, 'income')}</Txt>
        </View>
        <View style={styles.col}>
          <Txt typography="t7" color={onGreen.soft}>지출</Txt>
          <Txt typography="t4" fontWeight="bold" color={onGreen.strong}>{formatSigned(expense, 'expense')}</Txt>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.brand,
    borderRadius: radius.card,
    padding: spacing.cardPadding,
    gap: spacing.lg,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: onGreen.pill,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    gap: 2,
  },
  balanceBlock: { gap: spacing.xs },
  summary: { flexDirection: 'row' },
  col: { flex: 1, gap: spacing.xs },
});
