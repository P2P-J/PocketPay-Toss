import { createRoute } from '@granite-js/react-native';
import React from 'react';
import { ScrollView, View, Text, Switch, StyleSheet } from 'react-native';
import { Txt } from '@toss/tds-react-native';
import { colors } from '../constants/colors';
import { spacing } from '../constants/spacing';
import { DetailHeader } from '../components/layout/DetailHeader';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../constants/categories';
import { useCategoryStore } from '../store/categoryStore';

export const Route = createRoute('/category-settings', { component: CategorySettingsPage });

function CategoryGroup({ title, items }: { title: string; items: readonly { value: string; label: string; emoji: string }[] }) {
  const hidden = useCategoryStore((s) => s.hidden);
  const toggle = useCategoryStore((s) => s.toggle);
  return (
    <View style={styles.group}>
      <Txt typography="t7" fontWeight="medium" color={colors.textCaption}>{title}</Txt>
      <View>
        {items.map((c) => {
          const visible = !hidden.includes(c.value);
          return (
            <View key={c.value} style={styles.row}>
              <Text allowFontScaling={false} style={styles.emoji}>{c.emoji}</Text>
              <Txt typography="t5" color={colors.textPrimary}>{c.label}</Txt>
              <View style={styles.spacer} />
              <Switch
                value={visible}
                onValueChange={() => toggle(c.value)}
                trackColor={{ false: colors.grey200, true: colors.brand }}
                thumbColor={colors.white}
              />
            </View>
          );
        })}
      </View>
    </View>
  );
}

function CategorySettingsPage() {
  return (
    <View style={styles.container}>
      <DetailHeader title="카테고리 설정" />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Txt typography="t7" color={colors.textCaption}>끄면 거래 입력·예산에서 숨겨져요</Txt>
        <CategoryGroup title="지출" items={EXPENSE_CATEGORIES} />
        <CategoryGroup title="수입" items={INCOME_CATEGORIES} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  scroll: { paddingHorizontal: spacing.screenX, paddingBottom: spacing.section, gap: spacing.section },
  group: { gap: spacing.sm },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, height: 52 },
  emoji: { fontSize: 18, lineHeight: 23, width: 24, textAlign: 'center', includeFontPadding: false },
  spacer: { flex: 1 },
});
