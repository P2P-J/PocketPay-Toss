import { createRoute, useNavigation } from '@granite-js/react-native';
import React, { useState } from 'react';
import { ScrollView, View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { Txt } from '@toss/tds-react-native';
import { colors } from '../constants/colors';
import { spacing, radius } from '../constants/spacing';
import { formatAmountInput, parseAmount } from '../lib/format';
import { getCategoryLabel, getCategoryEmoji } from '../constants/categories';
import { CategoryPicker } from '../components/deal/CategoryPicker';
import { DetailHeader } from '../components/layout/DetailHeader';
import { KeyboardScreen } from '../components/common/KeyboardScreen';
import { useBudgetStore, selectBudget, type BudgetLimit } from '../store/budgetStore';
import { useCurrentTeamId } from '../hooks/useCurrentTeamId';

export const Route = createRoute('/budget-settings', { component: BudgetSettingsPage });

function BudgetSettingsPage() {
  const navigation = useNavigation();
  const teamId = useCurrentTeamId();
  const config = useBudgetStore(selectBudget(teamId));
  const setBudget = useBudgetStore((s) => s.set);

  const [totalLimit, setTotalLimit] = useState(config.totalLimit);
  const [limits, setLimits] = useState<BudgetLimit[]>(config.limits);
  const [adding, setAdding] = useState(false);

  const updateLimit = (i: number, val: number) => setLimits((prev) => prev.map((l, idx) => (idx === i ? { ...l, limit: val } : l)));
  const removeLimit = (i: number) => setLimits((prev) => prev.filter((_, idx) => idx !== i));
  const addCategory = (cat: string) => {
    setLimits((prev) => (prev.some((l) => l.category === cat) ? prev : [...prev, { category: cat, limit: 0 }]));
    setAdding(false);
  };

  const onSave = () => {
    setBudget(teamId, { totalLimit, limits: limits.filter((l) => l.limit > 0) });
    navigation.goBack();
  };

  return (
    <KeyboardScreen style={styles.container}>
      <DetailHeader title="예산 설정" />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        {/* 전체 예산 */}
        <View style={styles.field}>
          <Txt typography="t7" color={colors.textSecondary}>전체 예산 한도</Txt>
          <View style={styles.amountRow}>
            <Text style={styles.won}>₩</Text>
            <TextInput
              style={styles.amountInput}
              value={formatAmountInput(totalLimit)}
              onChangeText={(t) => setTotalLimit(parseAmount(t))}
              keyboardType="number-pad"
              placeholder="0"
              placeholderTextColor={colors.textTertiary}
            />
          </View>
        </View>

        {/* 카테고리별 한도 */}
        <View style={styles.field}>
          <Txt typography="t7" color={colors.textSecondary}>카테고리별 한도 (선택)</Txt>
          <View style={styles.catList}>
            {limits.map((l, i) => (
              <View key={l.category} style={styles.catRow}>
                <Text allowFontScaling={false} style={styles.emoji}>{getCategoryEmoji(l.category)}</Text>
                <Txt typography="t5" fontWeight="medium" color={colors.textPrimary}>{getCategoryLabel(l.category)}</Txt>
                <View style={styles.catInputWrap}>
                  <Text style={styles.wonSm}>₩</Text>
                  <TextInput
                    style={styles.catInput}
                    value={formatAmountInput(l.limit)}
                    onChangeText={(t) => updateLimit(i, parseAmount(t))}
                    keyboardType="number-pad"
                    placeholder="0"
                    placeholderTextColor={colors.textTertiary}
                  />
                </View>
                <Pressable hitSlop={8} onPress={() => removeLimit(i)}><Text style={styles.remove}>✕</Text></Pressable>
              </View>
            ))}
          </View>

          {adding ? (
            <View style={styles.picker}>
              <CategoryPicker type="expense" value={null} onChange={addCategory} />
            </View>
          ) : (
            <Pressable style={styles.addBtn} onPress={() => setAdding(true)}>
              <Txt typography="t5" fontWeight="medium" color={colors.textSecondary}>+ 카테고리 추가</Txt>
            </Pressable>
          )}
        </View>

        <Pressable style={styles.save} onPress={onSave}>
          <Txt typography="t4" fontWeight="bold" color={colors.white}>저장</Txt>
        </Pressable>
      </ScrollView>
    </KeyboardScreen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  scroll: { paddingHorizontal: spacing.screenX, paddingBottom: spacing.section, gap: spacing.section },
  field: { gap: spacing.sm },
  amountRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, borderBottomWidth: 2, borderBottomColor: colors.divider, paddingBottom: spacing.sm },
  won: { fontSize: 28, fontWeight: '700', color: colors.textPrimary },
  amountInput: { flex: 1, fontSize: 28, fontWeight: '700', color: colors.textPrimary, padding: 0 },
  catList: { gap: spacing.md },
  catRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  emoji: { fontSize: 18, lineHeight: 23, includeFontPadding: false },
  catInputWrap: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: 2 },
  wonSm: { fontSize: 15, fontWeight: '600', color: colors.textSecondary },
  catInput: { minWidth: 80, fontSize: 16, fontWeight: '600', color: colors.textPrimary, textAlign: 'right', padding: 0 },
  remove: { fontSize: 16, color: colors.textTertiary, paddingLeft: spacing.xs },
  picker: { marginTop: spacing.sm },
  addBtn: { alignItems: 'center', justifyContent: 'center', height: 48, borderRadius: radius.button, borderWidth: 1, borderColor: colors.divider, borderStyle: 'dashed', marginTop: spacing.sm },
  save: { alignItems: 'center', justifyContent: 'center', height: 52, borderRadius: radius.button, backgroundColor: colors.brand },
});
