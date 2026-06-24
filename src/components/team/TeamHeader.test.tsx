import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import type { Team } from '../../types/team';
import { TeamHeader } from './TeamHeader';

// TDS(@toss/tds-react-native)는 jest import 시점에 네이티브 의존으로 크래시하므로 Icon/Txt를 목으로 대체.
jest.mock('@toss/tds-react-native', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { Text } = require('react-native');
  return {
    Icon: () => null,
    Txt: ({ children }: { children: React.ReactNode }) => <Text>{children}</Text>,
  };
});

const teams: Team[] = [
  { _id: 'team-a', name: '점심 모임' },
  { _id: 'team-b', name: '여행 모임' },
];

const currentTeam: Team = { _id: 'team-a', name: '점심 모임' };

it('현재 팀 이름을 표시한다', () => {
  const { getByText } = render(
    <TeamHeader teams={teams} currentTeam={currentTeam} onSelectTeam={jest.fn()} />,
  );

  getByText('점심 모임');
});

it('팀명을 탭하면 팀 선택 시트가 열린다', () => {
  const { getByText, queryByText } = render(
    <TeamHeader teams={teams} currentTeam={currentTeam} onSelectTeam={jest.fn()} />,
  );

  expect(queryByText('모임 선택')).toBeNull();

  fireEvent.press(getByText('점심 모임'));

  getByText('모임 선택');
});
