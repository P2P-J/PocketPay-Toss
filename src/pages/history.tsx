import { createRoute, useNavigation } from '@granite-js/react-native';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../constants/colors';
import { TabBar } from '../components/layout/TabBar';

export const Route = createRoute('/history', { component: HistoryPage });
function HistoryPage() {
  const nav = useNavigation();
  return (
    <View style={styles.container}>
      <View style={styles.center}><Text style={styles.text}>곧 추가돼요</Text></View>
      <TabBar active="history" onNavigate={(p) => nav.navigate(p as '/')} onAdd={() => {}} />
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  text: { fontSize: 16, color: colors.textTertiary },
});
