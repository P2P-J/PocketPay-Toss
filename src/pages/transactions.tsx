import { createRoute, useNavigation } from '@granite-js/react-native';
import React, { useState } from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import { useTeamStore } from '../store/teamStore';
import { colors } from '../constants/colors';
import { spacing } from '../constants/spacing';
import { PageHeader } from '../components/layout/PageHeader';
import { SearchBar } from '../components/transactions/SearchBar';
import { FilterChips, type TxFilter } from '../components/transactions/FilterChips';
import { TransactionList } from '../components/home/TransactionList';
import { TabBar } from '../components/layout/TabBar';

export const Route = createRoute('/transactions', { component: TransactionsPage });

function TransactionsPage() {
  const nav = useNavigation();
  const transactions = useTeamStore((s) => s.transactions);
  const [filter, setFilter] = useState<TxFilter>('all');
  const filtered = filter === 'all' ? transactions : transactions.filter((t) => t.type === filter);

  return (
    <View style={styles.container}>
      <View style={styles.body}>
        <PageHeader title="거래" />
        <SearchBar />
        <View style={styles.chips}>
          <FilterChips value={filter} onChange={setFilter} />
        </View>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <TransactionList transactions={filtered} />
        </ScrollView>
      </View>
      <TabBar active="transactions" onNavigate={(p) => nav.navigate(p as '/')} onAdd={() => {}} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  body: { flex: 1, paddingHorizontal: spacing.screenX },
  chips: { marginTop: spacing.md },
  scroll: { paddingBottom: spacing.section },
});
