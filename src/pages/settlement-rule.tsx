import { createRoute } from '@granite-js/react-native';
import React from 'react';
import { ScrollView, View, Text, Pressable, StyleSheet } from 'react-native';
import { Txt } from '@toss/tds-react-native';
import { colors } from '../constants/colors';
import { spacing, radius } from '../constants/spacing';
import { DetailHeader } from '../components/layout/DetailHeader';
import { useSettlementStore, selectMethod, type SettlementMethod } from '../store/settlementStore';
import { useCurrentTeamId } from '../hooks/useCurrentTeamId';

export const Route = createRoute('/settlement-rule', { component: SettlementRulePage });

const RULES: { value: SettlementMethod; label: string; desc: string }[] = [
  { value: 'equal', label: '균등 분배', desc: '총 지출을 인원수로 똑같이 나눠요 (1/N)' },
  { value: 'ratio', label: '사용량 비례', desc: '각자 낸 금액 비율에 맞춰 분배해요' },
  { value: 'custom', label: '직접 지정', desc: '멤버별 부담 금액을 직접 정해요' },
];

function SettlementRulePage() {
  const teamId = useCurrentTeamId();
  const method = useSettlementStore(selectMethod(teamId));
  const setMethod = useSettlementStore((s) => s.setMethod);

  return (
    <View style={styles.container}>
      <DetailHeader title="정산 규칙" />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Txt typography="t7" color={colors.textCaption}>모임 정산 시 분담을 어떻게 나눌지 정해요</Txt>
        <View style={styles.list}>
          {RULES.map((r) => {
            const on = method === r.value;
            return (
              <Pressable key={r.value} style={[styles.row, on && styles.rowOn]} onPress={() => setMethod(teamId, r.value)}>
                <View style={styles.texts}>
                  <Txt typography="t5" fontWeight="bold" color={colors.textPrimary}>{r.label}</Txt>
                  <Txt typography="t7" color={colors.textCaption}>{r.desc}</Txt>
                </View>
                <Text style={[styles.check, { color: on ? colors.brand : colors.grey200 }]}>{on ? '◉' : '○'}</Text>
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
  list: { gap: spacing.md },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.lg, borderRadius: radius.card, borderWidth: 1, borderColor: colors.divider },
  rowOn: { borderColor: colors.brand, backgroundColor: colors.cardBg },
  texts: { flex: 1, gap: 2 },
  check: { fontSize: 20 },
});
