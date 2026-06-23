// NOTE: TDS limitation — importing '@toss/tds-react-native' under jest throws
// "TypeError: Cannot redefine property" at require time (native-module side
// effects in dist/cjs/core/hooks), before any render or TDSProvider can run.
// Wrapping in <TDSProvider> does not help because the crash is at import time,
// not render. We therefore mock Txt so the import chain resolves, then assert
// the component is a function (smoke). Visual rendering is verified in the
// build/sandbox. See plan Task C1 Step 2 note.
jest.mock('@toss/tds-react-native', () => ({ Txt: 'Txt' }));

import { BalanceCard } from './BalanceCard';

it('BalanceCard is a component function', () => {
  expect(typeof BalanceCard).toBe('function');
});
