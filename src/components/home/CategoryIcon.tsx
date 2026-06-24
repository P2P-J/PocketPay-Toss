import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';
import { getCategoryEmoji } from '../../constants/categories';

// 카테고리 이모지를 연회색 둥근 사각형 안에 중앙정렬한다 (HTML 레퍼런스: 42px / radius 13 / emoji 20px).
// lineHeight를 fontSize보다 넉넉히 줘야 이모지 글리프 위아래가 잘리지 않는다.
export function CategoryIcon({ category, size = 42 }: { category: string | null | undefined; size?: number }) {
  const fontSize = Math.round(size * 0.48);
  return (
    <View style={[styles.box, { width: size, height: size, borderRadius: Math.round(size * 0.31) }]}>
      <Text
        allowFontScaling={false}
        style={[styles.emoji, { fontSize, lineHeight: Math.round(fontSize * 1.3) }]}
      >
        {getCategoryEmoji(category)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    backgroundColor: colors.grey100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: { textAlign: 'center', includeFontPadding: false },
});
