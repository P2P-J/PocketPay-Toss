import { createRoute } from '@granite-js/react-native';
import React, { useEffect, useState } from 'react';
import { ScrollView, View, Pressable, Alert, StyleSheet } from 'react-native';
import { Txt } from '@toss/tds-react-native';
import { colors } from '../constants/colors';
import { spacing, radius } from '../constants/spacing';
import { PREVIEW_MODE } from '../constants/config';
import { formatWon } from '../lib/format';
import { shiftMonth } from '../lib/date';
import { DetailHeader } from '../components/layout/DetailHeader';
import { CenterNotice } from '../components/common/CenterNotice';
import { MonthNav } from '../components/common/MonthNav';
import { MemberRow } from '../components/common/MemberRow';
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
  const [busy, setBusy] = useState<Record<string, boolean>>({}); // 멤버별 처리 중(연타 방지)

  const fetchStatus = React.useCallback(() => {
    if (PREVIEW_MODE || !teamId) return Promise.resolve();
    return feeApi.getStatus(teamId, ym.y, ym.m).then((res) => setRealStatus(mapRaw(res.data))).catch(() => setRealStatus(null));
  }, [teamId, ym]);

  useEffect(() => { fetchStatus(); }, [fetchStatus]);

  const shift = (d: number) => setYm((cur) => shiftMonth(cur, d));

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
    if (!isOwner || busy[userId]) return;
    if (PREVIEW_MODE) {
      setPaidSet((prev) => {
        const next = new Set(prev);
        if (next.has(userId)) next.delete(userId); else next.add(userId);
        return next;
      });
      return;
    }
    setBusy((b) => ({ ...b, [userId]: true }));
    try {
      if (paid && paymentId) await feeApi.deletePayment(teamId, paymentId);
      else await feeApi.recordPayment(teamId, { userId, year: ym.y, month: ym.m, amount: status.feeAmount });
      await fetchStatus();
    } catch (e) {
      Alert.alert('실패', e instanceof Error ? e.message : '다시 시도해주세요.');
    } finally {
      setBusy((b) => { const n = { ...b }; delete n[userId]; return n; });
    }
  };

  if (!currentTeam) {
    return <View style={styles.container}><DetailHeader title="회비" /><CenterNotice message="모임이 없어요" /></View>;
  }

  return (
    <View style={styles.container}>
      <DetailHeader title="회비" />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <MonthNav ym={ym} onShift={shift} />

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
            return (
              <Pressable key={m.userId || i} style={busy[m.userId] && styles.rowBusy} disabled={!isOwner || busy[m.userId]} onPress={() => toggle(m.userId, m.paid, m.paymentId)}>
                <MemberRow name={m.name} index={i} trailing={
                  <View style={[styles.badge, m.paid ? styles.paid : styles.unpaid]}>
                    <Txt typography="t7" fontWeight="bold" color={m.paid ? colors.brandStrong : colors.textCaption}>{m.paid ? '납부' : '미납'}</Txt>
                  </View>
                } />
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
  card: { backgroundColor: colors.cardBg, borderRadius: radius.card, padding: spacing.cardPadding, gap: spacing.sm },
  cardRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  list: { gap: spacing.lg, marginTop: spacing.xs },
  rowBusy: { opacity: 0.5 },
  badge: { paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: radius.pill },
  paid: { backgroundColor: colors.brandTint },
  unpaid: { backgroundColor: colors.grey100 },
});
