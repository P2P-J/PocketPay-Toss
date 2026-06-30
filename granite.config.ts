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
        icon: 'https://static.toss.im/appsintoss/14613/a6a86854-9796-44da-b5aa-e32a052883cf.png',
      },
      permissions: [
        { name: 'camera', access: 'access' }, // 영수증 촬영(openCamera)
        { name: 'photos', access: 'read' }, // 영수증 앨범 선택(fetchAlbumPhotos)
      ],
    }),
  ],
});
