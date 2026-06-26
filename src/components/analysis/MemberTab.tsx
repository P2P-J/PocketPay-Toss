import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { Txt } from '@toss/tds-react-native';
import { colors } from '../../constants/colors';
import { spacing, radius } from '../../constants/spacing';
import { formatWon, formatSigned } from '../../lib/format';
import { avatarColor } from '../../constants/avatar';
import type { AnalysisData, MemberShare } from '../../types/analysis';

function MemberRow({ member, index, share }: { member: MemberShare; index: number; share: number }) {
  const av = avatarColor(index);
  return (
    <View style={styles.row}>
      <View style={[styles.avatar, { backgroundColor: av.bg }]}>
        <Txt typography="t5" fontWeight="bold" color={av.fg}>{member.initial}</Txt>
      </View>
      <Txt typography="t5" fontWeight="medium" color={colors.textPrimary} numberOfLines={1} style={styles.name}>{member.name}</Txt>
      <View style={styles.spacer} />
      <Txt typography="t5" fontWeight="bold" color={colors.textPrimary}>{formatWon(share)}</Txt>
    </View>
  );
}

export function MemberTab({ data }: { data: AnalysisData }) {
  const { split } = data;

  if (split.memberCount === 0) {
    return <View style={styles.empty}><Txt typography="t5" color={colors.textCaption}>모임 멤버가 없어요</Txt></View>;
  }
  if (split.totalExpense === 0) {
    return <View style={styles.empty}><Txt typography="t5" color={colors.textCaption}>이번 달 정산할 지출이 없어요</Txt></View>;
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
          <Txt typography="t7" color={colors.textSecondary}>이번 달 총 지출</Txt>
          <Txt typography="t3" fontWeight="bold" color={colors.expense}>{formatSigned(split.totalExpense, 'expense')}</Txt>
        </View>
      </View>

      <Txt typography="t7" color={colors.textCaption}>균등 분배 기준 · 멤버별 분담액</Txt>

      {/* 멤버별 분담액 */}
      <View style={styles.rows}>
        {split.members.map((m, i) => <MemberRow key={m.userId || i} member={m} index={i} share={split.perPerson} />)}
      </View>

      {/* 정산 요청 (시각용 — v2) */}
      <Pressable style={styles.cta}>
        <Txt typography="t4" fontWeight="bold" color={colors.white}>정산 요청하기</Txt>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.lg },
  card: { flexDirection: 'row', backgroundColor: colors.cardBg, borderRadius: radius.card, padding: spacing.cardPadding },
  col: { flex: 1, gap: spacing.xs },
  colRight: { alignItems: 'flex-end' },
  rows: { gap: spacing.lg },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  avatar: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  name: { flexShrink: 1 },
  spacer: { flex: 1 },
  cta: { height: 52, borderRadius: radius.button, backgroundColor: colors.brand, alignItems: 'center', justifyContent: 'center', marginTop: spacing.sm },
  empty: { alignItems: 'center', paddingVertical: 48 },
});
