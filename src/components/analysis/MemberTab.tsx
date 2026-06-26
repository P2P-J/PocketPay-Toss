import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { Txt } from '@toss/tds-react-native';
import { colors } from '../../constants/colors';
import { spacing, radius } from '../../constants/spacing';
import { formatWon, formatSigned } from '../../lib/format';
import { avatarColor } from '../../constants/avatar';
import type { AnalysisData, MemberShare } from '../../types/analysis';

function MemberRow({ member, index }: { member: MemberShare; index: number }) {
  const av = avatarColor(index);
  const positive = member.balance >= 0;
  return (
    <View style={styles.row}>
      <View style={[styles.avatar, { backgroundColor: av.bg }]}>
        <Txt typography="t5" fontWeight="bold" color={av.fg}>{member.initial}</Txt>
      </View>
      <View style={styles.info}>
        <Txt typography="t5" fontWeight="bold" color={colors.textPrimary} numberOfLines={1}>{member.name}</Txt>
        <Txt typography="t7" color={colors.textCaption}>낸 금액 {formatWon(member.paid)}</Txt>
      </View>
      <View style={[styles.badge, { backgroundColor: positive ? '#E7F9F1' : '#FFEDED' }]}>
        <Txt typography="t6" fontWeight="bold" color={positive ? '#12B886' : colors.expense}>
          {positive ? formatSigned(member.balance, 'income') : formatSigned(Math.abs(member.balance), 'expense')}
        </Txt>
      </View>
    </View>
  );
}

export function MemberTab({ data }: { data: AnalysisData }) {
  const { split } = data;

  if (split.memberCount === 0) {
    return <View style={styles.empty}><Txt typography="t5" color={colors.textCaption}>멤버 정보가 없어요</Txt></View>;
  }

  return (
    <View style={styles.wrap}>
      {/* 1인당 부담 / 총 지출 */}
      <View style={styles.card}>
        <View style={styles.col}>
          <Txt typography="t7" color={colors.textSecondary}>1인당 부담 ({split.memberCount}명)</Txt>
          <Txt typography="t3" fontWeight="bold" color={colors.textPrimary}>{formatWon(split.perPerson)}</Txt>
        </View>
        <View style={[styles.col, styles.colRight]}>
          <Txt typography="t7" color={colors.textSecondary}>총 지출</Txt>
          <Txt typography="t3" fontWeight="bold" color={colors.expense}>{formatSigned(split.totalExpense, 'expense')}</Txt>
        </View>
      </View>

      {/* 멤버별 분담 */}
      <View style={styles.rows}>
        {split.members.map((m, i) => <MemberRow key={m.userId} member={m} index={i} />)}
      </View>

      {/* 정산 요청 (시각용) */}
      <Pressable style={styles.cta}>
        <Txt typography="t4" fontWeight="bold" color={colors.white}>정산 요청하기</Txt>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.section },
  card: { flexDirection: 'row', backgroundColor: colors.cardBg, borderRadius: radius.card, padding: spacing.cardPadding },
  col: { flex: 1, gap: spacing.xs },
  colRight: { alignItems: 'flex-end' },
  rows: { gap: spacing.lg },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  avatar: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  info: { flex: 1, gap: 2 },
  badge: { borderRadius: radius.button, paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
  cta: { height: 52, borderRadius: radius.button, backgroundColor: colors.brand, alignItems: 'center', justifyContent: 'center' },
  empty: { alignItems: 'center', paddingVertical: 48 },
});
