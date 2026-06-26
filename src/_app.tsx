import { AppsInToss } from '@apps-in-toss/framework';
import React, { PropsWithChildren } from 'react';
import { InitialProps } from '@granite-js/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { TDSProvider } from '@toss/tds-react-native';
import { context } from '../require.context';
import { ErrorBoundary } from './components/common/ErrorBoundary';

function AppContainer({ children }: PropsWithChildren<InitialProps>) {
  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <TDSProvider>{children}</TDSProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}

export default AppsInToss.registerApp(AppContainer, { context });
