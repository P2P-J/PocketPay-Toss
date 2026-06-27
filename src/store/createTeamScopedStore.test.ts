import { createTeamScopedStore } from './createTeamScopedStore';

it('select은 팀별 값, 미설정 팀은 fallback을 준다', () => {
  const { useStore, select } = createTeamScopedStore<number>({ t1: 10 }, 0);
  expect(select('t1')(useStore.getState())).toBe(10);
  expect(select('t2')(useStore.getState())).toBe(0);
});

it('set은 해당 팀만 갱신하고 다른 팀과 격리된다', () => {
  const { useStore, select } = createTeamScopedStore<number>({ t1: 10 }, 0);
  useStore.getState().set('t2', 5);
  expect(select('t2')(useStore.getState())).toBe(5);
  expect(select('t1')(useStore.getState())).toBe(10);
});
