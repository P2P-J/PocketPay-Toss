import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { ListRow } from '@toss/tds-react-native';
import { colors } from '../../constants/colors';
import { formatSigned } from '../../lib/format';
import { getCategoryEmoji, getCategoryLabel } from '../../constants/categories';
import type { Transaction } from '../../types/transaction';

export function TransactionRow({ tx }: { tx: Transaction }) {
  const amountColor = tx.type === 'income' ? colors.income : colors.expense;
  return (
    <ListRow
      left={<Text style={styles.emoji}>{getCategoryEmoji(tx.category)}</Text>}
      contents={
        <ListRow.Texts
          type="2RowTypeA"
          top={tx.merchant || getCategoryLabel(tx.category)}
          topProps={{ fontWeight: 'medium', color: colors.textPrimary }}
          bottom={getCategoryLabel(tx.category)}
          bottomProps={{ typography: 't7', color: colors.textCaption }}
        />
      }
      right={
        <ListRow.RightTexts
          type="1RowTypeA"
          top={formatSigned(tx.amount, tx.type)}
          topProps={{ fontWeight: 'semiBold', color: amountColor }}
        />
      }
    />
  );
}

const styles = StyleSheet.create({ emoji: { fontSize: 22 } });
