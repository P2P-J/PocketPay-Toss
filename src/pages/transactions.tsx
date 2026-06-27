import { createRoute, useNavigation } from '@granite-js/react-native';
import React, { useState, useMemo } from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import { useTeamStore } from '../store/teamStore';
import { colors } from '../constants/colors';
import { spacing } from '../constants/spacing';
import { PageHeader } from '../components/layout/PageHeader';
import { SearchBar } from '../components/transactions/SearchBar';
import { FilterChips, type TxFilter } from '../components/transactions/FilterChips';
import { TransactionList } from '../components/home/TransactionList';
import { TabBar } from '../components/layout/TabBar';
import { CenterNotice } from '../components/common/CenterNotice';
import { getCategoryLabel } from '../constants/categories';
import { useTransactionActions } from '../hooks/useTransactionActions';

export const Route = createRoute('/transactions', { component: TransactionsPage });

function TransactionsPage() {
  const nav = useNavigation();
  const transactions = useTeamStore((s) => s.transactions);
  const error = useTeamStore((s) => s.error);
  const { onEdit, onDelete } = useTransactionActions();
  const [filter, setFilter] = useState<TxFilter>('all');
  const [query, setQuery] = useState('');
  const filtered = useMemo(() => {
    const q = query.trim();
    return transactions.filter((t) => {
      const byType = filter === 'all' || t.type === filter;
      const byQuery = !q || (t.merchant ?? '').includes(q) || getCategoryLabel(t.category).includes(q);
      return byType && byQuery;
    });
  }, [transactions, filter, query]);

  return (
    <View style={styles.container}>
      <View style={styles.body}>
        <PageHeader title="거래" />
        {error ? (
          <CenterNotice message={error} tone="error" />
        ) : (
          <>
            <SearchBar value={query} onChangeText={setQuery} />
            <View style={styles.chips}>
              <FilterChips value={filter} onChange={setFilter} />
            </View>
            <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
              <TransactionList transactions={filtered} onPressItem={onEdit} onLongPressItem={onDelete} />
            </ScrollView>
          </>
        )}
      </View>
      <TabBar active="transactions" onNavigate={(p) => nav.navigate(p as '/')} onAdd={() => nav.navigate('/deal-new' as '/')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  body: { flex: 1, paddingHorizontal: spacing.screenX },
  chips: { marginTop: spacing.md },
  scroll: { paddingBottom: spacing.section },
});
