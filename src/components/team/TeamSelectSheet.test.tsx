import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import type { Team } from '../../types/team';
import { TeamSelectSheet } from './TeamSelectSheet';

const teams: Team[] = [
  { _id: 'team-a', name: '점심 모임' },
  { _id: 'team-b', name: '여행 모임' },
  { _id: 'team-c', name: '동아리' },
];

it('팀 목록을 표시하고 현재 팀에 ✓를 붙인다', () => {
  const { getByText } = render(
    <TeamSelectSheet
      visible
      teams={teams}
      currentTeamId="team-b"
      onSelect={jest.fn()}
      onClose={jest.fn()}
    />,
  );

  getByText('점심 모임');
  getByText('여행 모임');
  getByText('동아리');
  getByText('✓');
});

it('팀을 탭하면 해당 teamId로 onSelect를 호출한다', () => {
  const onSelect = jest.fn();
  const { getByText } = render(
    <TeamSelectSheet
      visible
      teams={teams}
      currentTeamId="team-b"
      onSelect={onSelect}
      onClose={jest.fn()}
    />,
  );

  fireEvent.press(getByText('점심 모임'));
  expect(onSelect).toHaveBeenCalledWith('team-a');
});
