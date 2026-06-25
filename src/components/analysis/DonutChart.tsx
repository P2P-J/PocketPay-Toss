import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';
import { Txt } from '@toss/tds-react-native';
import { colors } from '../../constants/colors';
import { formatWon } from '../../lib/format';

export interface DonutSlice {
  value: number;
  color: string;
}

interface Props {
  slices: DonutSlice[];
  total: number;
  size?: number;
  stroke?: number;
}

export function DonutChart({ slices, total, size = 184, stroke = 28 }: Props) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  let acc = 0;

  return (
    <View style={[styles.wrap, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        <G rotation={-90} originX={size / 2} originY={size / 2}>
          <Circle cx={size / 2} cy={size / 2} r={r} stroke={colors.grey100} strokeWidth={stroke} fill="none" />
          {total > 0 &&
            slices.map((s, i) => {
              const len = (s.value / total) * c;
              const offset = -((acc / total) * c);
              acc += s.value;
              return (
                <Circle
                  key={i}
                  cx={size / 2}
                  cy={size / 2}
                  r={r}
                  stroke={s.color}
                  strokeWidth={stroke}
                  fill="none"
                  strokeDasharray={`${len} ${c - len}`}
                  strokeDashoffset={offset}
                  strokeLinecap="butt"
                />
              );
            })}
        </G>
      </Svg>
      <View style={styles.center}>
        <Txt typography="t7" color={colors.textSecondary}>총 지출</Txt>
        <Txt typography="t4" fontWeight="bold" color={colors.textPrimary}>{formatWon(total)}</Txt>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center' },
  center: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center' },
});
