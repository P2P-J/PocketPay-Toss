import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { groupByDate } from '../../lib/date';
import { colors } from '../../constants/colors';
import { TransactionRow } from './TransactionRow';
import type { Transaction } from '../../types/transaction';

export function TransactionList({ transactions }: { transactions: Transaction[] }) {
  if (transactions.length === 0) {
    return <Text style={styles.empty}>이번 달 거래가 없어요</Text>;
  }
  const groups = groupByDate(transactions);
  return (
    <View>
      {groups.map((g) => (
        <View key={g.key}>
          <Text style={styles.dateHeader}>{g.label}</Text>
          {g.items.map((tx) => (
            <TransactionRow key={tx.id} tx={tx} />
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  dateHeader: { fontSize: 13, color: colors.textSecondary, marginTop: 16, marginBottom: 4, paddingHorizontal: 4 },
  empty: { fontSize: 14, color: colors.textTertiary, textAlign: 'center', paddingVertical: 40 },
});
