import React, { useEffect, useState } from 'react';
import { Modal, View, Pressable, Text, StyleSheet } from 'react-native';
import { Txt } from '@toss/tds-react-native';
import { colors } from '../../constants/colors';
import { spacing, radius } from '../../constants/spacing';
import { shiftMonth } from '../../lib/date';

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];
const pad = (n: number) => String(n).padStart(2, '0');

interface Props {
  visible: boolean;
  value: string; // YYYY-MM-DD
  onSelect: (iso: string) => void;
  onClose: () => void;
}

export function DatePickerSheet({ visible, value, onSelect, onClose }: Props) {
  const [ym, setYm] = useState(() => ({ y: Number(value.slice(0, 4)), m: Number(value.slice(5, 7)) }));

  // 열릴 때 현재 선택값의 연/월로 동기화
  useEffect(() => {
    if (visible) setYm({ y: Number(value.slice(0, 4)), m: Number(value.slice(5, 7)) });
  }, [visible, value]);

  const shift = (delta: number) => setYm((cur) => shiftMonth(cur, delta));

  const daysInMonth = new Date(ym.y, ym.m, 0).getDate();
  const firstDow = new Date(ym.y, ym.m - 1, 1).getDay();
  const cells: (number | null)[] = [
    ...Array.from({ length: firstDow }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  const selDay = value.slice(0, 7) === `${ym.y}-${pad(ym.m)}` ? Number(value.slice(8, 10)) : null;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View style={styles.sheet}>
        <View style={styles.handle} />
        <View style={styles.nav}>
          <Pressable hitSlop={8} onPress={() => shift(-1)}><Text style={styles.arrow}>‹</Text></Pressable>
          <Txt typography="t4" fontWeight="bold" color={colors.textPrimary}>{ym.y}년 {ym.m}월</Txt>
          <Pressable hitSlop={8} onPress={() => shift(1)}><Text style={styles.arrow}>›</Text></Pressable>
        </View>
        <View style={styles.week}>
          {WEEKDAYS.map((w, i) => (
            <View key={w} style={styles.cell}>
              <Txt typography="t7" fontWeight="medium" color={i === 0 ? colors.expense : i === 6 ? colors.income : colors.textCaption}>{w}</Txt>
            </View>
          ))}
        </View>
        <View style={styles.grid}>
          {cells.map((d, i) => {
            if (d == null) return <View key={`e${i}`} style={styles.cell} />;
            const isSel = d === selDay;
            const dow = i % 7;
            const numColor = isSel ? colors.white : dow === 0 ? colors.expense : dow === 6 ? colors.income : colors.textPrimary;
            return (
              <Pressable key={d} style={styles.cell} onPress={() => { onSelect(`${ym.y}-${pad(ym.m)}-${pad(d)}`); onClose(); }}>
                <View style={[styles.dayCircle, isSel && styles.dayCircleOn]}>
                  <Txt typography="t5" fontWeight={isSel ? 'bold' : 'regular'} color={numColor}>{d}</Txt>
                </View>
              </Pressable>
            );
          })}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' },
  sheet: { backgroundColor: colors.white, borderTopLeftRadius: radius.sheet, borderTopRightRadius: radius.sheet, paddingHorizontal: spacing.screenX, paddingBottom: spacing.section, paddingTop: spacing.md },
  handle: { alignSelf: 'center', width: 40, height: 4, borderRadius: 2, backgroundColor: colors.grey200, marginBottom: spacing.lg },
  nav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.xl, paddingVertical: spacing.sm, marginBottom: spacing.sm },
  arrow: { fontSize: 22, color: colors.textSecondary, paddingHorizontal: spacing.xs },
  week: { flexDirection: 'row' },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  cell: { width: `${100 / 7}%`, alignItems: 'center', justifyContent: 'center', paddingVertical: spacing.xs, minHeight: 44 },
  dayCircle: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  dayCircleOn: { backgroundColor: colors.brand },
});
