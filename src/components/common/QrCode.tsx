import React, { useMemo } from 'react';
import Svg, { Rect } from 'react-native-svg';
import qrcode from 'qrcode-generator';
import { colors } from '../../constants/colors';

// 순수 JS QR 매트릭스 → svg 셀 렌더 (네이티브 모듈 의존 없음)
export function QrCode({ value, size = 200 }: { value: string; size?: number }) {
  const { count, cells } = useMemo(() => {
    const qr = qrcode(0, 'M');
    qr.addData(value);
    qr.make();
    const n = qr.getModuleCount();
    const list: { r: number; c: number }[] = [];
    for (let r = 0; r < n; r++) {
      for (let c = 0; c < n; c++) {
        if (qr.isDark(r, c)) list.push({ r, c });
      }
    }
    return { count: n, cells: list };
  }, [value]);

  const cell = size / count;
  return (
    <Svg width={size} height={size}>
      <Rect x={0} y={0} width={size} height={size} fill={colors.white} />
      {cells.map(({ r, c }) => (
        <Rect key={`${r}-${c}`} x={c * cell} y={r * cell} width={cell} height={cell} fill={colors.grey900} />
      ))}
    </Svg>
  );
}
