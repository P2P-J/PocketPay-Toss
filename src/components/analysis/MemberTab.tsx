import React, { useState } from 'react';
import { View, Pressable, Alert, StyleSheet } from 'react-native';
import { Txt } from '@toss/tds-react-native';
import { colors } from '../../constants/colors';
import { spacing, radius } from '../../constants/spacing';
import { formatWon, formatSigned } from '../../lib/format';
import { avatarColor } from '../../constants/avatar';
import { PREVIEW_MODE } from '../../constants/config';
import { useTeamStore } from '../../store/teamStore';
import { getTeamId } from '../../types/team';
import { dutchApi } from '../../api/dutch';
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
  const currentTeam = useTeamStore((s) => s.currentTeam);
  const [sending, setSending] = useState(false);

  const onRequest = () => {
    Alert.alert(
      '정산 요청',
      `각 멤버에게 1인당 ${formatWon(split.perPerson)} 정산 요청을 보낼까요?\n실제 송금은 안 되고, 얼마·받을 계좌만 안내돼요.`,
      [
        { text: '취소', style: 'cancel' },
        {
          text: '보내기',
          onPress: async () => {
            if (PREVIEW_MODE) {
              Alert.alert('보냈어요', '정산 요청을 보냈어요. (미리보기)');
              return;
            }
            if (!currentTeam) return;
            setSending(true);
            try {
              await dutchApi.create({
                teamId: getTeamId(currentTeam),
                recipientIds: split.members.map((m) => m.userId).filter(Boolean),
                amount: split.perPerson,
                totalAmount: split.totalExpense,
                participantCount: split.memberCount,
                memo: '이번 달 정산',
              });
              Alert.alert('보냈어요', '멤버들에게 정산 요청을 보냈어요.');
            } catch (e) {
              Alert.alert('실패', e instanceof Error ? e.message : '다시 시도해주세요.');
            } finally {
              setSending(false);
            }
          },
        },
      ]
    );
  };

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

      {/* 정산 요청 — 멤버에게 부담액·계좌 안내 발송 (송금 아님) */}
      <Pressable style={[styles.cta, sending && styles.ctaOff]} disabled={sending} onPress={onRequest}>
        <Txt typography="t4" fontWeight="bold" color={colors.white}>{sending ? '보내는 중…' : '정산 요청하기'}</Txt>
      </Pressable>
      <Txt typography="t7" color={colors.textCaption} style={styles.note}>실제 송금이 아니라 각자 얼마·어디로 보낼지 안내해요</Txt>
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
  ctaOff: { opacity: 0.6 },
  note: { textAlign: 'center' },
  empty: { alignItems: 'center', paddingVertical: 48 },
});
