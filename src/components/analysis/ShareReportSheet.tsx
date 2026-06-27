import React from 'react';
import { Modal, View, Pressable, Alert, StyleSheet } from 'react-native';
import { Txt, Icon } from '@toss/tds-react-native';
import { share } from '@apps-in-toss/framework';
import { colors } from '../../constants/colors';
import { spacing, radius } from '../../constants/spacing';
import { formatWon } from '../../lib/format';
import { getCategoryLabel } from '../../constants/categories';
import { buildReportText } from '../../lib/shareReport';
import type { AnalysisData } from '../../types/analysis';

export function ShareReportSheet({ visible, onClose, teamName, data }: { visible: boolean; onClose: () => void; teamName: string; data: AnalysisData }) {
  const { year, month, summary, categories } = data;
  const top = categories.slice(0, 2);

  const onShare = async () => {
    try {
      await share({ message: buildReportText(teamName, data) });
    } catch {
      Alert.alert('공유 실패', '다시 시도해주세요.');
    } finally {
      onClose();
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          {/* 헤더 */}
          <View style={styles.header}>
            <Txt typography="t7" color="rgba(255,255,255,0.85)">{year}년 {month}월 정산 리포트</Txt>
            <Txt typography="t3" fontWeight="bold" color={colors.white}>{teamName}</Txt>
          </View>

          {/* 본문 */}
          <View style={styles.body}>
            <View style={styles.row}>
              <View style={styles.col}>
                <Txt typography="t7" color={colors.textSecondary}>이번 달 수입</Txt>
                <Txt typography="t4" fontWeight="bold" color={colors.income}>+{formatWon(summary.totalIncome)}</Txt>
              </View>
              <View style={[styles.col, styles.colRight]}>
                <Txt typography="t7" color={colors.textSecondary}>이번 달 지출</Txt>
                <Txt typography="t4" fontWeight="bold" color={colors.expense}>-{formatWon(summary.totalExpense)}</Txt>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.netRow}>
              <Txt typography="t6" color={colors.textPrimary}>이번 달 순수익</Txt>
              <Txt typography="t4" fontWeight="bold" color={summary.net >= 0 ? colors.brand : colors.expense}>
                {summary.net >= 0 ? '+' : '-'}{formatWon(Math.abs(summary.net))}
              </Txt>
            </View>

            {top.length > 0 && (
              <View style={styles.topWrap}>
                <Txt typography="t7" color={colors.textSecondary}>지출 TOP {top.length}</Txt>
                {top.map((c) => (
                  <View key={c.category} style={styles.topItem}>
                    <View style={styles.topHead}>
                      <Txt typography="t6" fontWeight="medium" color={colors.textPrimary}>{getCategoryLabel(c.category)}</Txt>
                      <Txt typography="t6" fontWeight="bold" color={colors.expense}>{formatWon(c.total)}</Txt>
                    </View>
                    <View style={styles.barBg}>
                      <View style={[styles.barFill, { width: `${Math.max(4, Math.round(c.percent))}%` }]} />
                    </View>
                  </View>
                ))}
              </View>
            )}

            <View style={styles.footer}>
              <View style={styles.dot} />
              <Txt typography="t7" color={colors.textCaption}>작은 모임 · 모임 회계, 이제 간편하게</Txt>
            </View>
          </View>

          {/* 버튼 */}
          <View style={styles.actions}>
            <Pressable style={[styles.btn, styles.cancel]} onPress={onClose}>
              <Txt typography="t5" fontWeight="bold" color={colors.textSecondary}>취소</Txt>
            </Pressable>
            <Pressable style={[styles.btn, styles.shareBtn]} onPress={onShare}>
              <Icon name="icon-share-mono" size={18} color={colors.white} />
              <Txt typography="t5" fontWeight="bold" color={colors.white}>공유하기</Txt>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', alignItems: 'center', justifyContent: 'center', padding: spacing.screenX },
  card: { width: '100%', maxWidth: 360, backgroundColor: colors.white, borderRadius: radius.card, overflow: 'hidden' },
  header: { backgroundColor: colors.brand, paddingHorizontal: spacing.cardPadding, paddingVertical: spacing.lg, gap: 2 },
  body: { padding: spacing.cardPadding, gap: spacing.lg },
  row: { flexDirection: 'row' },
  col: { flex: 1, gap: spacing.xs },
  colRight: { alignItems: 'flex-end' },
  divider: { height: 1, backgroundColor: colors.grey100 },
  netRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  topWrap: { gap: spacing.sm },
  topItem: { gap: spacing.xs },
  topHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  barBg: { height: 6, borderRadius: 3, backgroundColor: colors.grey100, overflow: 'hidden' },
  barFill: { height: 6, borderRadius: 3, backgroundColor: colors.expense },
  footer: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginTop: spacing.xs },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.brand },
  actions: { flexDirection: 'row', gap: spacing.sm, paddingHorizontal: spacing.cardPadding, paddingBottom: spacing.cardPadding },
  btn: { flex: 1, flexDirection: 'row', gap: spacing.xs, alignItems: 'center', justifyContent: 'center', height: 48, borderRadius: radius.button },
  cancel: { backgroundColor: colors.grey100 },
  shareBtn: { backgroundColor: colors.brand },
});
