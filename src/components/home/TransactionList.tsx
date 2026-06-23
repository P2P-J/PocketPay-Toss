import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Txt } from '@toss/tds-react-native';
import { groupByDate } from '../../lib/date';
import { colors } from '../../constants/colors';
import { spacing } from '../../constants/spacing';
import { TransactionRow } from './TransactionRow';
import type { Transaction } from '../../types/transaction';

export function TransactionList({ transactions }: { transactions: Transaction[] }) {
  if (transactions.length === 0) {
    return (
      <View style={styles.emptyWrap}>
        <Txt typography="t5" color={colors.textCaption}>이번 달 거래가 없어요</Txt>
      </View>
    );
  }
  const groups = groupByDate(transactions);
  return (
    <View>
      {groups.map((g) => (
        <View key={g.key}>
          <View style={styles.dateHeader}>
            <Txt typography="t7" fontWeight="medium" color={colors.textCaption}>{g.label}</Txt>
          </View>
          {g.items.map((tx) => (
            <TransactionRow key={tx.id} tx={tx} />
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  dateHeader: { marginTop: spacing.section, marginBottom: spacing.xs },
  emptyWrap: { alignItems: 'center', paddingVertical: 40 },
});
