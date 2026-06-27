import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Txt } from '@toss/tds-react-native';
import { avatarColor } from '../../constants/avatar';

type TxtTypography = React.ComponentProps<typeof Txt>['typography'];

// 멤버 아바타 (이름 앞글자 + 인덱스 파스텔). 크기/타이포는 위치별로 조절.
export function Avatar({ name, index = 0, size = 40, typography = 't5' }: { name: string; index?: number; size?: number; typography?: TxtTypography }) {
  const av = avatarColor(index);
  const initial = (name ?? '').slice(0, 1) || '?';
  return (
    <View style={[styles.base, { width: size, height: size, borderRadius: size / 2, backgroundColor: av.bg }]}>
      <Txt typography={typography} fontWeight="bold" color={av.fg}>{initial}</Txt>
    </View>
  );
}

const styles = StyleSheet.create({
  base: { alignItems: 'center', justifyContent: 'center' },
});
