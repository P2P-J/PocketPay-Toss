import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon, Txt } from '@toss/tds-react-native';
import { colors } from '../../constants/colors';
import { spacing } from '../../constants/spacing';

type TabKey = 'home' | 'transactions' | 'analysis' | 'more';

const TABS: { key: TabKey; label: string; icon: string; path: string }[] = [
  { key: 'home', label: '홈', icon: 'icon-home-mono', path: '/' },
  { key: 'transactions', label: '거래', icon: 'icon-transfer-mono', path: '/transactions' },
  { key: 'analysis', label: '분석', icon: 'icon-chart-mono', path: '/analysis' },
  { key: 'more', label: '더보기', icon: 'icon-dots-mono', path: '/more' },
];

export function TabBar({
  active,
  onNavigate,
  onAdd,
}: {
  active: TabKey;
  onNavigate: (path: string) => void;
  onAdd: () => void;
}) {
  const insets = useSafeAreaInsets();
  const tab = (t: (typeof TABS)[number]) => {
    const on = active === t.key;
    const tint = on ? colors.brand : colors.textTertiary;
    return (
      <Pressable key={t.key} style={styles.tab} onPress={() => onNavigate(t.path)}>
        <Icon name={t.icon} size={26} color={tint} />
        <Txt typography="t7" fontWeight={on ? 'bold' : 'medium'} color={tint}>
          {t.label}
        </Txt>
      </Pressable>
    );
  };

  return (
    <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, spacing.sm) }]}>
      {TABS.slice(0, 2).map(tab)}
      <View style={styles.centerSlot} />
      {TABS.slice(2).map(tab)}
      <Pressable testID="tab-fab" style={styles.fab} onPress={onAdd}>
        <Icon name="icon-plus-mono" size={26} color={colors.white} />
      </Pressable>
    </View>
  );
}

const FAB_SIZE = 54;

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    backgroundColor: colors.white,
  },
  tab: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 3, paddingVertical: spacing.xs },
  centerSlot: { width: FAB_SIZE + spacing.lg },
  fab: {
    position: 'absolute',
    top: -FAB_SIZE / 4,
    alignSelf: 'center',
    left: '50%',
    marginLeft: -FAB_SIZE / 2,
    width: FAB_SIZE,
    height: FAB_SIZE,
    borderRadius: FAB_SIZE / 2,
    backgroundColor: colors.brand,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.brand,
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
});
