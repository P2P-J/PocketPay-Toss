import React from 'react';
import { render } from '@testing-library/react-native';

// TDS(@toss/tds-react-native)는 jest 환경에서 모듈 로드 시 native 의존성으로
// "Cannot redefine property" 에러가 나므로 Txt만 가벼운 Text로 모킹한다.
jest.mock('@toss/tds-react-native', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { Text } = require('react-native');
  return { Txt: ({ children }: { children: React.ReactNode }) => <Text>{children}</Text> };
});

import { TopCategoryCard } from './TopCategoryCard';

describe('TopCategoryCard', () => {
  it('topCategory가 있으면 라벨과 금액을 보여준다', () => {
    const { getByText } = render(
      <TopCategoryCard topCategory={{ category: 'cafe', total: 35000 }} />,
    );
    expect(getByText('카페/음료')).toBeTruthy();
    expect(getByText('-₩35,000')).toBeTruthy();
  });

  it('topCategory가 null이면 아무것도 렌더하지 않는다', () => {
    const { toJSON } = render(<TopCategoryCard topCategory={null} />);
    expect(toJSON()).toBeNull();
  });
});
