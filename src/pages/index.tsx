import { createRoute } from '@granite-js/react-native';
import React, { useEffect } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { useAuthStore } from '../store/authStore';

export const Route = createRoute('/', {
  component: Home,
});

function Home() {
  const navigation = Route.useNavigation();
  const user = useAuthStore((s) => s.user);
  const loading = useAuthStore((s) => s.loading);
  const checkAuth = useAuthStore((s) => s.checkAuth);
  const logout = useAuthStore((s) => s.logout);

  // 앱 시작 시 저장된 토큰으로 세션 복구 시도
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (loading && !user) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator color="#3DD598" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.logo}>작은 모임</Text>
        <Text style={styles.subtitle}>모임 회계, 이제 간편하게</Text>
      </View>

      {user ? (
        <View style={styles.card}>
          <Text style={styles.welcome}>✓ 로그인됐어요</Text>
          <Text style={styles.name}>{user.name ?? user.nickname ?? '토스 사용자'}님</Text>
          <Pressable
            style={({ pressed }) => [styles.buttonGhost, pressed && styles.pressed]}
            onPress={() => logout()}
          >
            <Text style={styles.buttonGhostText}>로그아웃</Text>
          </Pressable>
        </View>
      ) : (
        <View style={styles.bottom}>
          <Text style={styles.notice}>로그인하고 시작해요.</Text>
          <Pressable
            style={({ pressed }) => [styles.button, pressed && styles.pressed]}
            onPress={() => navigation.navigate('/login')}
          >
            <Text style={styles.buttonText}>토스로 시작하기</Text>
          </Pressable>
        </View>
      )}
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
  center: {
    alignItems: 'center',
    justifyContent: 'center',
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
    color: '#3DD598',
  },
  subtitle: {
    fontSize: 16,
    color: '#8B95A1',
  },
  card: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 20,
    gap: 6,
    alignItems: 'center',
  },
  welcome: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3DD598',
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: '#191F28',
    marginBottom: 8,
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
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonGhost: {
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonGhostText: {
    color: '#8B95A1',
    fontSize: 15,
    fontWeight: '500',
  },
  pressed: {
    opacity: 0.85,
  },
  notice: {
    fontSize: 13,
    color: '#B0B8C1',
    textAlign: 'center',
  },
});
