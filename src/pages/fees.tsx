import { createRoute } from '@granite-js/react-native';
import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, Pressable, StyleSheet } from 'react-native';
import { Txt } from '@toss/tds-react-native';
import { colors } from '../constants/colors';
import { spacing, radius } from '../constants/spacing';
import { PREVIEW_MODE } from '../constants/config';
import { formatWon } from '../lib/format';
import { DetailHeader } from '../components/layout/DetailHeader';
import { CenterNotice } from '../components/common/CenterNotice';
import { avatarColor } from '../constants/avatar';
import { useTeamStore } from '../store/teamStore';
import { useIsOwner } from '../hooks/useIsOwner';
import { getMemberId, getMemberName, getTeamId } from '../types/team';
import { feeApi, type FeeStatusRaw } from '../api/fee';
import type { FeeStatus } from '../types/fee';

export const Route = createRoute('/fees', { component: FeesPage });

const mapRaw = (raw: FeeStatusRaw): FeeStatus => ({
  feeAmount: raw.feeAmount,
  feeDueDay: raw.feeDueDay,
  year: raw.year,
  month: raw.month,
  paidCount: raw.paidCount,
  members: raw.members.map((m) => ({ userId: m.userId, name: m.name, role: m.role, paid: !!m.payment, paymentId: m.payment?.id })),
});

function FeesPage() {
  const currentTeam = useTeamStore((s) => s.currentTeam);
  const isOwner = useIsOwner();
  const teamId = currentTeam ? getTeamId(currentTeam) : '';

  const now = new Date();
  const [ym, setYm] = useState({ y: now.getFullYear(), m: now.getMonth() + 1 });
  const [paidSet, setPaidSet] = useState<Set<string>>(new Set()); // 더미 토글
  const [realStatus, setRealStatus] = useState<FeeStatus | null>(null);

  const fetchStatus = React.useCallback(() => {
    if (PREVIEW_MODE || !teamId) return;
    feeApi.getStatus(teamId, ym.y, ym.m).then((res) => setRealStatus(mapRaw(res.data))).catch(() => setRealStatus(null));
  }, [teamId, ym]);

  useEffect(() => { fetchStatus(); }, [fetchStatus]);

  const shift = (d: number) => setYm(({ y, m }) => {
    let nm = m + d; let ny = y;
    if (nm < 1) { nm = 12; ny -= 1; }
    if (nm > 12) { nm = 1; ny += 1; }
    return { y: ny, m: nm };
  });

  // 더미: currentTeam 멤버 + 회비로 구성 / 실모드: API 결과
  const dummyStatus: FeeStatus = {
    feeAmount: currentTeam?.feeAmount ?? 0,
    feeDueDay: currentTeam?.feeDueDay ?? 1,
    year: ym.y,
    month: ym.m,
    members: (currentTeam?.members ?? []).map((m) => {
      const id = getMemberId(m);
      return { userId: id, name: getMemberName(m, currentTeam?.displayMode), role: m.role, paid: paidSet.has(id) };
    }),
    paidCount: (currentTeam?.members ?? []).filter((m) => paidSet.has(getMemberId(m))).length,
  };
  const status: FeeStatus = PREVIEW_MODE ? dummyStatus : realStatus ?? { feeAmount: 0, feeDueDay: 1, year: ym.y, month: ym.m, members: [], paidCount: 0 };

  const toggle = async (userId: string, paid: boolean, paymentId?: string) => {
    if (!isOwner) return;
    if (PREVIEW_MODE) {
      setPaidSet((prev) => {
        const next = new Set(prev);
        if (next.has(userId)) next.delete(userId); else next.add(userId);
        return next;
      });
      return;
    }
    try {
      if (paid && paymentId) await feeApi.deletePayment(teamId, paymentId);
      else await feeApi.recordPayment(teamId, { userId, year: ym.y, month: ym.m, amount: status.feeAmount });
      fetchStatus();
    } catch {
      // 무시 — 다음 조회 시 정정
    }
  };

  if (!currentTeam) {
    return <View style={styles.container}><DetailHeader title="회비" /><CenterNotice message="모임이 없어요" /></View>;
  }

  return (
    <View style={styles.container}>
      <DetailHeader title="회비" />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.monthNav}>
          <Pressable hitSlop={8} onPress={() => shift(-1)}><Text style={styles.arrow}>‹</Text></Pressable>
          <Txt typography="t4" fontWeight="bold" color={colors.textPrimary}>{ym.y}년 {ym.m}월</Txt>
          <Pressable hitSlop={8} onPress={() => shift(1)}><Text style={styles.arrow}>›</Text></Pressable>
        </View>

        <View style={styles.card}>
          <View style={styles.cardRow}>
            <Txt typography="t7" color={colors.textSecondary}>1인당 회비</Txt>
            <Txt typography="t5" fontWeight="bold" color={colors.textPrimary}>{formatWon(status.feeAmount)} · 매월 {status.feeDueDay}일</Txt>
          </View>
          <View style={styles.cardRow}>
            <Txt typography="t7" color={colors.textSecondary}>납부 현황</Txt>
            <Txt typography="t5" fontWeight="bold" color={colors.brand}>{status.paidCount} / {status.members.length}명</Txt>
          </View>
        </View>

        <Txt typography="t7" color={colors.textCaption}>실제 수금이 아니라 납부 현황만 기록해요{isOwner ? ' · 눌러서 체크' : ''}</Txt>

        <View style={styles.list}>
          {status.members.map((m, i) => {
            const av = avatarColor(i);
            return (
              <Pressable key={m.userId || i} style={styles.row} disabled={!isOwner} onPress={() => toggle(m.userId, m.paid, m.paymentId)}>
                <View style={[styles.avatar, { backgroundColor: av.bg }]}>
                  <Txt typography="t5" fontWeight="bold" color={av.fg}>{m.name.slice(0, 1)}</Txt>
                </View>
                <Txt typography="t5" fontWeight="medium" color={colors.textPrimary} numberOfLines={1} style={styles.name}>{m.name}</Txt>
                <View style={styles.spacer} />
                <View style={[styles.badge, m.paid ? styles.paid : styles.unpaid]}>
                  <Txt typography="t7" fontWeight="bold" color={m.paid ? '#12B886' : colors.textCaption}>{m.paid ? '납부' : '미납'}</Txt>
                </View>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  scroll: { paddingHorizontal: spacing.screenX, paddingBottom: spacing.section, gap: spacing.md },
  monthNav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.xl, paddingVertical: spacing.sm },
  arrow: { fontSize: 22, color: colors.textSecondary, paddingHorizontal: spacing.xs },
  card: { backgroundColor: colors.cardBg, borderRadius: radius.card, padding: spacing.cardPadding, gap: spacing.sm },
  cardRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  list: { gap: spacing.lg, marginTop: spacing.xs },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  avatar: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  name: { flexShrink: 1 },
  spacer: { flex: 1 },
  badge: { paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: radius.pill },
  paid: { backgroundColor: '#E7F9F1' },
  unpaid: { backgroundColor: colors.grey100 },
});
