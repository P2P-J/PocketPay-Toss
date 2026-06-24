import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Txt } from '@toss/tds-react-native';
import { colors } from '../../constants/colors';
import { spacing } from '../../constants/spacing';
import { formatSigned } from '../../lib/format';
import { getCategoryLabel } from '../../constants/categories';
import { CategoryIcon } from './CategoryIcon';
import type { Transaction } from '../../types/transaction';

// HTML 레퍼런스와 동일한 행: 좌측 거터에 flush, 아이콘~글자 gap 12.
// (TDS ListRow는 자체 paddingHorizontal:24가 있어 본문 거터와 합쳐 안쪽으로 밀림 → 커스텀 행 사용)
export function TransactionRow({ tx }: { tx: Transaction }) {
  const amountColor = tx.type === 'income' ? colors.income : colors.expense;
  return (
    <View style={styles.row}>
      <CategoryIcon category={tx.category} />
      <View style={styles.texts}>
        <Txt typography="t5" fontWeight="medium" color={colors.textPrimary} numberOfLines={1}>
          {tx.merchant || getCategoryLabel(tx.category)}
        </Txt>
        <Txt typography="t7" color={colors.textCaption}>{getCategoryLabel(tx.category)}</Txt>
      </View>
      <Txt typography="t5" fontWeight="bold" color={amountColor}>{formatSigned(tx.amount, tx.type)}</Txt>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.cardGap, paddingBottom: 18 },
  texts: { flex: 1, gap: 3 },
});
