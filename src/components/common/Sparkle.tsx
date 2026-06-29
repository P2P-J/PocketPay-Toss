import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { colors } from '../../constants/colors';

// 브랜드 스파클 마크 (4-point) — 로고/빈상태 공용
export function Sparkle({ size = 40, color = colors.white }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M12 2 C12.6 7.2 13.8 9.4 22 12 C13.8 14.6 12.6 16.8 12 22 C11.4 16.8 10.2 14.6 2 12 C10.2 9.4 11.4 7.2 12 2 Z"
        fill={color}
      />
    </Svg>
  );
}
