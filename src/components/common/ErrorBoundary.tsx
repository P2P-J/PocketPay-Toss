import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';
import { spacing, radius } from '../../constants/spacing';

interface Props {
  children: React.ReactNode;
}
interface State {
  hasError: boolean;
}

// 렌더 중 예외로 미니앱 전체가 화이트아웃되는 것을 막는 최상위 경계.
// (RN은 함수형 ErrorBoundary가 없어 클래스로 작성)
export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  componentDidCatch(_error: unknown) {
    // 실연동 시 에러 리포팅 연결 지점 (토큰 등 민감정보는 로깅 금지)
  }

  reset = () => this.setState({ hasError: false });

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Text style={styles.emoji}>😵</Text>
          <Text style={styles.title}>문제가 발생했어요</Text>
          <Text style={styles.desc}>잠시 후 다시 시도해 주세요.</Text>
          <Pressable style={styles.button} onPress={this.reset}>
            <Text style={styles.buttonText}>다시 시도</Text>
          </Pressable>
        </View>
      );
    }
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.white, padding: spacing.section, gap: spacing.sm },
  emoji: { fontSize: 40 },
  title: { fontSize: 18, fontWeight: '700', color: colors.textPrimary },
  desc: { fontSize: 14, color: colors.textCaption, marginBottom: spacing.md },
  button: { backgroundColor: colors.brand, borderRadius: radius.button, paddingHorizontal: spacing.xl, height: 48, alignItems: 'center', justifyContent: 'center' },
  buttonText: { color: colors.white, fontSize: 15, fontWeight: '600' },
});
