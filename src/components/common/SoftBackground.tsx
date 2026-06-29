import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet } from 'react-native';
import Svg, { Defs, RadialGradient, Stop, Rect } from 'react-native-svg';
import { colors } from '../../constants/colors';

// 가장자리 없이 은은하게 퍼지는 풀스크린 파스텔 배경 (부드러운 글로우 3개) + 미세한 드리프트
export function SoftBackground() {
  const drift = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(drift, { toValue: 1, duration: 7000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(drift, { toValue: 0, duration: 7000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [drift]);
  const translateY = drift.interpolate({ inputRange: [0, 1], outputRange: [-10, 10] });

  return (
    <Animated.View pointerEvents="none" style={[styles.fill, { transform: [{ translateY }] }]}>
      <Svg width="100%" height="100%">
        <Defs>
          <RadialGradient id="sb-green" cx="18%" cy="10%" r="75%">
            <Stop offset="0" stopColor={colors.brand} stopOpacity="0.18" />
            <Stop offset="1" stopColor={colors.brand} stopOpacity="0" />
          </RadialGradient>
          <RadialGradient id="sb-blue" cx="92%" cy="32%" r="65%">
            <Stop offset="0" stopColor={colors.income} stopOpacity="0.12" />
            <Stop offset="1" stopColor={colors.income} stopOpacity="0" />
          </RadialGradient>
          <RadialGradient id="sb-pink" cx="35%" cy="98%" r="75%">
            <Stop offset="0" stopColor={colors.expense} stopOpacity="0.10" />
            <Stop offset="1" stopColor={colors.expense} stopOpacity="0" />
          </RadialGradient>
        </Defs>
        <Rect width="100%" height="100%" fill={colors.white} />
        <Rect width="100%" height="100%" fill="url(#sb-green)" />
        <Rect width="100%" height="100%" fill="url(#sb-blue)" />
        <Rect width="100%" height="100%" fill="url(#sb-pink)" />
      </Svg>
    </Animated.View>
  );
}

// 드리프트로 가장자리가 드러나지 않도록 화면보다 살짝 크게
const styles = StyleSheet.create({
  fill: { position: 'absolute', top: -24, left: -24, right: -24, bottom: -24 },
});
