import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Txt } from '@toss/tds-react-native';
import { colors } from '../../constants/colors';
import { spacing } from '../../constants/spacing';
import { Avatar } from './Avatar';

// 아바타 + 이름 + (우측 trailing) 멤버 행. 멤버목록/회비/분담 공용.
// 길게누름·탭 등 상호작용은 호출부에서 Pressable로 감싸 사용.
export function MemberRow({ name, index, trailing }: { name: string; index: number; trailing?: React.ReactNode }) {
  return (
    <View style={styles.row}>
      <Avatar name={name} index={index} />
      <Txt typography="t5" fontWeight="medium" color={colors.textPrimary} numberOfLines={1} style={styles.name}>{name}</Txt>
      <View style={styles.spacer} />
      {trailing}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  name: { flexShrink: 1 },
  spacer: { flex: 1 },
});
