import { createRoute } from '@granite-js/react-native';
import React, { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

// 공유 백엔드 (메인 PocketPay와 동일한 Railway 서버)
const API_BASE_URL = 'https://pocketpay-backend-production.up.railway.app';

type HealthState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'ok'; body: string }
  | { status: 'error'; message: string };

export const Route = createRoute('/', {
  component: Home,
});

function Home() {
  const [health, setHealth] = useState<HealthState>({ status: 'idle' });

  async function checkHealth() {
    setHealth({ status: 'loading' });
    try {
      const res = await fetch(`${API_BASE_URL}/health`);
      const text = await res.text();
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      setHealth({ status: 'ok', body: text });
    } catch (e) {
      setHealth({ status: 'error', message: e instanceof Error ? e.message : '알 수 없는 오류' });
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.logo}>작은 모임</Text>
        <Text style={styles.subtitle}>모임 회계, 이제 간편하게</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>백엔드 연결 확인</Text>
        <Text style={styles.cardDesc}>공유 백엔드(Railway)와 통신이 되는지 확인해요.</Text>

        <Pressable
          style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
          onPress={checkHealth}
          disabled={health.status === 'loading'}
        >
          {health.status === 'loading' ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>연결 확인하기</Text>
          )}
        </Pressable>

        <View style={styles.result}>
          {health.status === 'idle' && <Text style={styles.resultIdle}>아직 확인 전이에요.</Text>}
          {health.status === 'ok' && <Text style={styles.resultOk}>✓ 연결 성공 · {health.body}</Text>}
          {health.status === 'error' && (
            <Text style={styles.resultError}>✗ 연결 실패 · {health.message}</Text>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    justifyContent: 'center',
    gap: 32,
  },
  hero: {
    alignItems: 'center',
    gap: 8,
  },
  logo: {
    fontSize: 32,
    fontWeight: '700',
    color: '#3DD598', // 브랜드 메인 그린
  },
  subtitle: {
    fontSize: 16,
    color: '#8B95A1',
  },
  card: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 20,
    gap: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#191F28',
  },
  cardDesc: {
    fontSize: 14,
    color: '#8B95A1',
  },
  button: {
    backgroundColor: '#3DD598',
    borderRadius: 12,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  buttonPressed: {
    opacity: 0.85,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  result: {
    minHeight: 22,
    justifyContent: 'center',
  },
  resultIdle: {
    fontSize: 14,
    color: '#B0B8C1',
  },
  resultOk: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3DD598',
  },
  resultError: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F04452', // 지출/에러 레드
  },
});
