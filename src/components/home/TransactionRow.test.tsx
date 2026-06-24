import React from 'react';
import { render } from '@testing-library/react-native';
import type { Transaction } from '../../types/transaction';

// TDS의 @toss/tds-react-native 는 jest 환경에서 import 시점에
// 네이티브 모듈 훅이 "Cannot redefine property" 로 깨진다(jsdom 미지원).
// 컴포넌트 자체 로직(부호/색/라벨)을 검증하기 위해 Txt를
// 텍스트만 렌더하는 가벼운 mock으로 대체한다.
jest.mock('@toss/tds-react-native', () => {
  const ReactLocal = jest.requireActual<typeof import('react')>('react');
  const RN = jest.requireActual<typeof import('react-native')>('react-native');

  /* eslint-disable @typescript-eslint/no-explicit-any */
  const Txt = ({ children }: any) => ReactLocal.createElement(RN.Text, null, children);
  /* eslint-enable @typescript-eslint/no-explicit-any */

  return { Txt };
});

// jest.mock 은 babel-jest 가 import 위로 hoist 하므로,
// 아래 import 가 mock 적용된 모듈을 받는다.
import { TransactionRow } from './TransactionRow';

const baseTx: Transaction = {
  id: 't1',
  merchant: '스타벅스',
  type: 'expense',
  description: '',
  category: '식비',
  amount: 4500,
  date: '2026-06-23',
};

function renderRow(tx: Transaction) {
  return render(<TransactionRow tx={tx} />);
}

it('수입 거래는 + 부호와 가맹점/카테고리를 표시', () => {
  const { getByText } = renderRow({
    ...baseTx,
    type: 'income',
    merchant: '월급',
    amount: 1000000,
  });
  getByText('+₩1,000,000');
  getByText('월급');
});

it('지출 거래는 - 부호를 표시', () => {
  const { getByText } = renderRow(baseTx);
  getByText('-₩4,500');
  getByText('스타벅스');
});
