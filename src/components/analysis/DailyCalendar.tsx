import React, { useState } from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { Txt } from '@toss/tds-react-native';
import { colors } from '../../constants/colors';
import { spacing, radius } from '../../constants/spacing';
import { formatMan } from '../../lib/format';
import { formatDateGroup } from '../../lib/date';
import { TransactionRow } from '../home/TransactionRow';
import type { Transaction } from '../../types/transaction';

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

function dayOf(iso: string): number {
  return Number(iso.slice(8, 10));
}

export function DailyCalendar({ year, month, transactions }: { year: number; month: number; transactions: Transaction[] }) {
  // 날짜별 순액(수입+ / 지출-) 집계
  const net = new Map<number, number>();
  for (const tx of transactions) {
    const d = dayOf(tx.date);
    net.set(d, (net.get(d) ?? 0) + (tx.type === 'income' ? tx.amount : -tx.amount));
  }
  const txDays = transactions.map((t) => dayOf(t.date));
  const [selected, setSelected] = useState<number | null>(txDays.length ? Math.max(...txDays) : null);

  const daysInMonth = new Date(year, month, 0).getDate();
  const firstDow = new Date(year, month - 1, 1).getDay(); // 0=일
  const cells: (number | null)[] = [
    ...Array.from({ length: firstDow }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const selectedTx = selected ? transactions.filter((t) => dayOf(t.date) === selected) : [];
  const firstTx = selectedTx[0];

  return (
    <View>
      <View style={styles.header}>
        <Txt typography="t4" fontWeight="bold" color={colors.textPrimary}>날짜별 내역</Txt>
        <View style={styles.legend}>
          <View style={[styles.dot, { backgroundColor: colors.income }]} />
          <Txt typography="t7" color={colors.textCaption}>수입</Txt>
          <View style={[styles.dot, { backgroundColor: colors.expense, marginLeft: spacing.sm }]} />
          <Txt typography="t7" color={colors.textCaption}>지출</Txt>
        </View>
      </View>

      {/* 요일 헤더 */}
      <View style={styles.weekRow}>
        {WEEKDAYS.map((w, i) => (
          <View key={w} style={styles.cell}>
            <Txt typography="t7" fontWeight="medium" color={i === 0 ? colors.expense : i === 6 ? colors.income : colors.textCaption}>{w}</Txt>
          </View>
        ))}
      </View>

      {/* 날짜 그리드 */}
      <View style={styles.grid}>
        {cells.map((d, i) => {
          if (d == null) return <View key={`e${i}`} style={styles.cell} />;
          const amount = net.get(d);
          const dow = i % 7;
          const isSel = d === selected;
          const numColor = isSel ? colors.white : dow === 0 ? colors.expense : dow === 6 ? colors.income : colors.textPrimary;
          return (
            <Pressable key={d} style={styles.cell} disabled={amount == null} onPress={() => setSelected(d)}>
              <View style={[styles.dayCircle, isSel && styles.dayCircleOn]}>
                <Txt typography="t7" fontWeight={isSel ? 'bold' : 'regular'} color={numColor}>{d}</Txt>
              </View>
              {amount != null && (
                <Txt typography="t7" fontWeight="medium" color={amount >= 0 ? colors.income : colors.expense}>
                  {amount >= 0 ? '+' : '-'}{formatMan(amount)}
                </Txt>
              )}
            </Pressable>
          );
        })}
      </View>

      {/* 선택일 거래 */}
      {firstTx && (
        <View style={styles.detail}>
          <Txt typography="t7" fontWeight="medium" color={colors.textCaption}>{formatDateGroup(firstTx.date)}</Txt>
          <View style={styles.detailRows}>
            {selectedTx.map((tx) => <TransactionRow key={tx.id} tx={tx} />)}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.lg },
  legend: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  dot: { width: 7, height: 7, borderRadius: 4 },
  weekRow: { flexDirection: 'row' },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  cell: { width: `${100 / 7}%`, alignItems: 'center', paddingVertical: spacing.xs, gap: 2, minHeight: 44 },
  dayCircle: { width: 26, height: 26, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  dayCircleOn: { backgroundColor: colors.brand },
  detail: { marginTop: spacing.lg, backgroundColor: colors.cardBg, borderRadius: radius.card, padding: spacing.lg, gap: spacing.xs },
  detailRows: { marginTop: spacing.xs },
});
