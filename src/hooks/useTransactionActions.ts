import { Alert } from 'react-native';
import { useNavigation } from '@granite-js/react-native';
import { useTeamStore } from '../store/teamStore';
import { getCategoryLabel } from '../constants/categories';
import type { Transaction } from '../types/transaction';

// 거래 행 탭 → 수정 / 꾹 누름 → 삭제(확인) 공통 핸들러
export function useTransactionActions() {
  const navigation = useNavigation();
  const setEditing = useTeamStore((s) => s.setEditingTransaction);
  const deleteTransaction = useTeamStore((s) => s.deleteTransaction);

  const onEdit = (tx: Transaction) => {
    setEditing(tx);
    navigation.navigate('/deal-new' as '/');
  };

  const onDelete = (tx: Transaction) => {
    const name = tx.merchant || getCategoryLabel(tx.category);
    Alert.alert('거래 삭제', `'${name}' 거래를 삭제하시겠습니까?`, [
      { text: '취소', style: 'cancel' },
      { text: '삭제', style: 'destructive', onPress: () => deleteTransaction(tx.id) },
    ]);
  };

  return { onEdit, onDelete };
}
