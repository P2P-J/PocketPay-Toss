import React from 'react';
import { render } from '@testing-library/react-native';
import type { Transaction } from '../../types/transaction';

// TransactionRow 는 @toss/tds-react-native 를 import 하는데, 이 패키지는 jest
// 환경에서 import 시점에 네이티브 모듈 훅이 "Cannot redefine property" 로 깨진다
// (jsdom 미지원). 날짜 그룹핑/빈 상태 로직만 검증하면 되므로, TransactionRow 를
// 가맹점명만 텍스트로 렌더하는 가벼운 mock 으로 대체한다.
jest.mock('./TransactionRow', () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TransactionRow: ({ tx }: any) => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { Text } = require('react-native');
    return <Text>{tx.merchant}</Text>;
  },
}));

// jest.mock 은 import 위로 hoist 되므로 아래 import 가 mock 을 받는다.
import { TransactionList } from './TransactionList';

const baseTx: Transaction = {
  id: 't1',
  merchant: '스타벅스',
  type: 'expense',
  description: '',
  category: '식비',
  amount: 4500,
  date: '2026-04-26', // 일요일
};

it('거래가 없으면 빈 상태 문구를 표시', () => {
  const { getByText } = render(<TransactionList transactions={[]} />);
  getByText('이번 달 거래가 없어요');
});

it('거래가 있으면 날짜 그룹 헤더와 행을 표시', () => {
  const { getByText } = render(
    <TransactionList
      transactions={[
        baseTx,
        { ...baseTx, id: 't2', merchant: '월급' },
      ]}
    />,
  );
  getByText('4월 26일 일요일');
  getByText('스타벅스');
  getByText('월급');
});
