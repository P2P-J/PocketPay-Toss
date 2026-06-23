import React from 'react';
import TestRenderer from 'react-test-renderer';

// TDS의 @toss/tds-react-native는 jest 환경에서 모듈 로드 중 실패한다
// (Cannot redefine property). 렌더 검증을 위해 Txt를 RN Text로 대체한다.
jest.mock('@toss/tds-react-native', () => {
  const { Text } = jest.requireActual('react-native');
  return { Txt: Text };
});

import { SummaryCards } from './SummaryCards';

function texts(tree: TestRenderer.ReactTestRenderer): string[] {
  const out: string[] = [];
  const walk = (node: TestRenderer.ReactTestRendererJSON | string) => {
    if (typeof node === 'string') {
      out.push(node);
      return;
    }
    (node.children ?? []).forEach((c) =>
      walk(c as TestRenderer.ReactTestRendererJSON | string),
    );
  };
  const json = tree.toJSON();
  const roots = Array.isArray(json) ? json : json ? [json] : [];
  roots.forEach(walk);
  return out;
}

describe('SummaryCards', () => {
  it('renders amounts and 전월 대비 labels when changes are non-null', () => {
    let tree!: TestRenderer.ReactTestRenderer;
    TestRenderer.act(() => {
      tree = TestRenderer.create(
        <SummaryCards income={50000} expense={30000} incomeChange={12} expenseChange={-5} />,
      );
    });
    const all = texts(tree).join(' ');
    expect(all).toContain('+₩50,000');
    expect(all).toContain('-₩30,000');
    expect(all).toContain('전월 대비');
  });

  it('omits 전월 대비 text when changes are null', () => {
    let tree!: TestRenderer.ReactTestRenderer;
    TestRenderer.act(() => {
      tree = TestRenderer.create(
        <SummaryCards income={50000} expense={30000} incomeChange={null} expenseChange={null} />,
      );
    });
    const all = texts(tree).join(' ');
    expect(all).not.toContain('전월 대비');
  });
});
