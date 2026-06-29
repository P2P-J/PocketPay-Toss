import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { TabBar } from './TabBar';

// TDS(@toss/tds-react-native)는 jest import 시점에 네이티브 의존으로 크래시하므로 Icon/Txt를 목으로 대체.
jest.mock('@toss/tds-react-native', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { Text } = require('react-native');
  return {
    Icon: () => null,
    Txt: ({ children }: { children: React.ReactNode }) => <Text>{children}</Text>,
  };
});

// SafeAreaProvider 없이 렌더하므로 insets 훅을 0으로 모킹.
jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

// 거래추가(+)는 현재 모임이 있을 때만 동작 — 테스트는 모임 있는 상태로 모킹.
jest.mock('../../store/teamStore', () => ({
  useTeamStore: (selector: (s: { currentTeam: unknown }) => unknown) => selector({ currentTeam: { _id: 't1', name: 'T' } }),
}));

it('renders 4 tab labels', () => {
  const { getByText } = render(<TabBar active="home" onNavigate={() => {}} onAdd={() => {}} />);
  expect(getByText('홈')).toBeTruthy();
  expect(getByText('거래')).toBeTruthy();
  expect(getByText('분석')).toBeTruthy();
  expect(getByText('더보기')).toBeTruthy();
});

it('calls onNavigate with the tab path when a tab is pressed', () => {
  const onNavigate = jest.fn();
  const { getByText } = render(<TabBar active="home" onNavigate={onNavigate} onAdd={() => {}} />);
  fireEvent.press(getByText('거래'));
  expect(onNavigate).toHaveBeenCalledWith('/transactions');
});

it('calls onAdd when the FAB is pressed', () => {
  const onAdd = jest.fn();
  const { getByTestId } = render(<TabBar active="home" onNavigate={() => {}} onAdd={onAdd} />);
  fireEvent.press(getByTestId('tab-fab'));
  expect(onAdd).toHaveBeenCalled();
});
