import { createRoute } from '@granite-js/react-native';
import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import { Txt } from '@toss/tds-react-native';
import { useAuthStore } from '../store/authStore';
import { colors } from '../constants/colors';
import { spacing, radius } from '../constants/spacing';
import { Sparkle } from '../components/common/Sparkle';

export const Route = createRoute('/login', { component: Login });

const FEATURES = [
  '영수증 찍으면 거래가 자동 기록돼요',
  '회비·정산, 누가 얼마인지 한눈에',
  '월말 리포트를 단톡방에 바로 공유',
];

function Login() {
  const navigation = Route.useNavigation();
  const loginWithToss = useAuthStore((s) => s.loginWithToss);
  const loading = useAuthStore((s) => s.loading);
  const error = useAuthStore((s) => s.error);

  async function handleLogin() {
    try {
      await loginWithToss();
      navigation.navigate('/');
    } catch {
      // 에러는 store.error로 화면에 표시됨
    }
  }

  return (
    <View style={styles.container}>
      {/* 파스텔 배경 블롭 */}
      <View pointerEvents="none" style={[styles.blob, styles.blobGreen]} />
      <View pointerEvents="none" style={[styles.blob, styles.blobBlue]} />
      <View pointerEvents="none" style={[styles.blob, styles.blobPink]} />

      <View style={styles.hero}>
        <View style={styles.logoBadge}>
          <Sparkle size={44} />
        </View>
        <Txt typography="t2" fontWeight="bold" color={colors.textPrimary} style={styles.title}>작은 모임</Txt>
        <Txt typography="t5" color={colors.textSecondary}>모임 회계, 이제 간편하게</Txt>

        <View style={styles.features}>
          {FEATURES.map((f) => (
            <View key={f} style={styles.featureRow}>
              <View style={styles.dot} />
              <Txt typography="t6" color={colors.textSecondary} style={styles.featureText}>{f}</Txt>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.bottom}>
        {error ? <Txt typography="t6" color={colors.expense} style={styles.error}>{error}</Txt> : null}
        <Pressable
          style={({ pressed }) => [styles.button, pressed && styles.buttonPressed, loading && styles.buttonOff]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? <ActivityIndicator color={colors.white} /> : (
            <Txt typography="t4" fontWeight="bold" color={colors.white}>토스로 시작하기</Txt>
          )}
        </Pressable>
        <Txt typography="t7" color={colors.textTertiary} style={styles.notice}>토스 계정으로 3초 만에 시작해요</Txt>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white, paddingHorizontal: spacing.screenX, paddingTop: 80, paddingBottom: 40, justifyContent: 'space-between', overflow: 'hidden' },
  blob: { position: 'absolute', width: 320, height: 320, borderRadius: 160, opacity: 0.5 },
  blobGreen: { backgroundColor: colors.brandTint, top: -90, left: -80 },
  blobBlue: { backgroundColor: '#EAF2FE', top: 40, right: -120 },
  blobPink: { backgroundColor: '#FFF0F0', bottom: 60, left: -110 },
  hero: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: spacing.sm },
  logoBadge: { width: 84, height: 84, borderRadius: 26, backgroundColor: colors.brand, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.md, shadowColor: colors.brand, shadowOpacity: 0.35, shadowRadius: 16, shadowOffset: { width: 0, height: 8 }, elevation: 6 },
  title: { marginTop: spacing.xs },
  features: { marginTop: spacing.section, gap: spacing.md, alignSelf: 'stretch', paddingHorizontal: spacing.md },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.brand },
  featureText: { flexShrink: 1 },
  bottom: { gap: spacing.md },
  button: { backgroundColor: colors.brand, borderRadius: radius.button, height: 54, alignItems: 'center', justifyContent: 'center' },
  buttonPressed: { opacity: 0.9 },
  buttonOff: { opacity: 0.7 },
  notice: { textAlign: 'center' },
  error: { textAlign: 'center' },
});
