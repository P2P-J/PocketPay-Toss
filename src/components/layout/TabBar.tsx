import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { Icon, Txt } from '@toss/tds-react-native';
import { colors } from '../../constants/colors';
import { spacing } from '../../constants/spacing';

type TabKey = 'home' | 'transactions' | 'history' | 'more';

const TABS: { key: TabKey; label: string; icon: string; path: string }[] = [
  { key: 'home', label: '홈', icon: 'icon-home-mono', path: '/' },
  { key: 'transactions', label: '거래', icon: 'icon-transfer-mono', path: '/transactions' },
  { key: 'history', label: '내역', icon: 'icon-clock-mono', path: '/history' },
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
  return (
    <View style={styles.bar}>
      {TABS.map((t) => (
        <Pressable key={t.key} style={styles.tab} onPress={() => onNavigate(t.path)}>
          <Icon name={t.icon} size={24} color={active === t.key ? colors.brand : colors.textSecondary} />
          <Txt typography="t7" fontWeight="medium" color={active === t.key ? colors.brand : colors.textSecondary}>{t.label}</Txt>
        </Pressable>
      ))}
      <Pressable testID="tab-fab" style={styles.fab} onPress={onAdd}>
        <Icon name="icon-plus-mono" size={28} color={colors.white} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    height: 60,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    backgroundColor: colors.white,
  },
  tab: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.xs },
  fab: {
    position: 'absolute',
    top: -20,
    alignSelf: 'center',
    left: '50%',
    marginLeft: -28,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.brand,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
