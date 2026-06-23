import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';

type TabKey = 'home' | 'transactions' | 'history' | 'more';

const TABS: { key: TabKey; label: string; icon: string; path: string }[] = [
  { key: 'home', label: '홈', icon: '🏠', path: '/' },
  { key: 'transactions', label: '거래', icon: '🔁', path: '/transactions' },
  { key: 'history', label: '내역', icon: '🕘', path: '/history' },
  { key: 'more', label: '더보기', icon: '⋯', path: '/more' },
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
          <Text style={styles.icon}>{t.icon}</Text>
          <Text style={[styles.label, active === t.key && styles.active]}>{t.label}</Text>
        </Pressable>
      ))}
      <Pressable style={styles.fab} onPress={onAdd}>
        <Text style={styles.fabPlus}>+</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    height: 64,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    backgroundColor: colors.white,
  },
  tab: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 2 },
  icon: { fontSize: 18 },
  label: { fontSize: 11, color: colors.textSecondary },
  active: { color: colors.brand, fontWeight: '600' },
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
  fabPlus: { color: colors.white, fontSize: 28, fontWeight: '300' },
});
