import React from 'react';
import { render } from '@testing-library/react-native';
import type { Team } from '../../types/team';
import { MemberSheet } from './MemberSheet';

const team: Team = {
  name: '주말 등산팀',
  members: [
    { _id: 'm1', user: { _id: 'u1', name: '김철수', nickname: '철수짱' }, role: 'owner' },
    { _id: 'm2', user: { _id: 'u2', name: '이영희', nickname: '영희' }, role: 'member' },
  ],
};

it('멤버 수와 이름을 표시하고 owner에게 모임장 배지를 보여준다', () => {
  const { getByText } = render(<MemberSheet visible team={team} onClose={() => {}} />);
  getByText('멤버 2명');
  getByText('모임장');
});

it('displayMode realName이면 실명을 표시한다', () => {
  const realNameTeam: Team = { ...team, displayMode: 'realName' };
  const { getByText, queryByText } = render(
    <MemberSheet visible team={realNameTeam} onClose={() => {}} />
  );
  getByText('김철수');
  getByText('이영희');
  expect(queryByText('철수짱')).toBeNull();
});

it('displayMode nickname이면 닉네임을 표시한다', () => {
  const nicknameTeam: Team = { ...team, displayMode: 'nickname' };
  const { getByText, queryByText } = render(
    <MemberSheet visible team={nicknameTeam} onClose={() => {}} />
  );
  getByText('철수짱');
  getByText('영희');
  expect(queryByText('김철수')).toBeNull();
});
