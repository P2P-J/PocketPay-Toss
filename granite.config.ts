import { appsInToss } from '@apps-in-toss/framework/plugins';
import { defineConfig } from '@granite-js/react-native/config';

export default defineConfig({
  scheme: 'intoss',
  appName: 'pocketpay',
  plugins: [
    appsInToss({
      brand: {
        displayName: '작은 모임',
        primaryColor: '#3DD598', // 브랜드 메인 그린
        icon: '', // TODO: 콘솔에 아이콘 업로드 후 받은 URL로 교체 (배포 전 필수)
      },
      permissions: [],
    }),
  ],
});
