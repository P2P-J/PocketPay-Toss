import { AppsInToss } from '@apps-in-toss/framework';
import React, { PropsWithChildren, useEffect } from 'react';
import { InitialProps } from '@granite-js/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { TDSProvider } from '@toss/tds-react-native';
import { context } from '../require.context';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { useAuthStore } from './store/authStore';

function AppContainer({ children }: PropsWithChildren<InitialProps>) {
  // 어떤 진입 경로(딥링크/앱내기능)로 들어와도 세션 인증이 먼저 돌도록 루트에서 실행
  const checkAuth = useAuthStore((s) => s.checkAuth);
  useEffect(() => { checkAuth(); }, [checkAuth]);

  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <TDSProvider>{children}</TDSProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}

export default AppsInToss.registerApp(AppContainer, { context });
