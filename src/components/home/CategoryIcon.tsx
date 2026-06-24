import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';
import { getCategoryEmoji } from '../../constants/categories';

// 카테고리 이모지를 연회색 원형 배경 안에 중앙정렬해 비율을 강제로 맞춘다.
// (이모지를 맨 Text로 두면 글리프 베이스라인이 위로 떠 정렬이 깨진다 — 토스 가계부 스타일로 통일)
export function CategoryIcon({ category, size = 40 }: { category: string | null | undefined; size?: number }) {
  return (
    <View style={[styles.circle, { width: size, height: size, borderRadius: size / 2 }]}>
      <Text
        allowFontScaling={false}
        style={[styles.emoji, { fontSize: size * 0.5, lineHeight: size * 0.5 }]}
      >
        {getCategoryEmoji(category)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  circle: {
    backgroundColor: colors.grey100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: { textAlign: 'center', includeFontPadding: false },
});
