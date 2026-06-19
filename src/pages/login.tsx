import { createRoute } from '@granite-js/react-native';
import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { useAuthStore } from '../store/authStore';

export const Route = createRoute('/login', {
  component: Login,
});

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
      <View style={styles.hero}>
        <Text style={styles.logo}>작은 모임</Text>
        <Text style={styles.subtitle}>모임 회계, 이제 간편하게</Text>
      </View>

      <View style={styles.bottom}>
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Pressable
          style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>토스로 시작하기</Text>
          )}
        </Pressable>
        <Text style={styles.notice}>토스 계정으로 간편하게 시작해요.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 56,
    justifyContent: 'space-between',
  },
  hero: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  logo: {
    fontSize: 34,
    fontWeight: '700',
    color: '#3DD598', // 브랜드 메인 그린
  },
  subtitle: {
    fontSize: 16,
    color: '#8B95A1',
  },
  bottom: {
    gap: 12,
  },
  button: {
    backgroundColor: '#3DD598',
    borderRadius: 12,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPressed: {
    opacity: 0.85,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  notice: {
    fontSize: 13,
    color: '#B0B8C1',
    textAlign: 'center',
  },
  error: {
    fontSize: 14,
    color: '#F04452',
    textAlign: 'center',
  },
});
