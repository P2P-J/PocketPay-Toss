import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { TabBar } from './TabBar';

it('renders 4 tab labels', () => {
  const { getByText } = render(
    <TabBar active="home" onNavigate={() => {}} onAdd={() => {}} />,
  );
  expect(getByText('홈')).toBeTruthy();
  expect(getByText('거래')).toBeTruthy();
  expect(getByText('내역')).toBeTruthy();
  expect(getByText('더보기')).toBeTruthy();
});

it('calls onNavigate with the tab path when a tab is pressed', () => {
  const onNavigate = jest.fn();
  const { getByText } = render(
    <TabBar active="home" onNavigate={onNavigate} onAdd={() => {}} />,
  );
  fireEvent.press(getByText('거래'));
  expect(onNavigate).toHaveBeenCalledWith('/transactions');
});

it('calls onAdd when the FAB is pressed', () => {
  const onAdd = jest.fn();
  const { getByText } = render(
    <TabBar active="home" onNavigate={() => {}} onAdd={onAdd} />,
  );
  fireEvent.press(getByText('+'));
  expect(onAdd).toHaveBeenCalled();
});
