import { View, useWindowDimensions } from 'react-native';
import Svg, { Ellipse, Path } from 'react-native-svg';

import { colors } from '@/theme';

/**
 * Face-shaped guide over the live camera: a soft dark veil outside a portrait oval keeps the
 * face itself clear, a dashed outline marks where it goes and a shoulder line under it shows
 * how far to hold the phone. `faceOval` returns the geometry so the camera UI can place labels.
 */
export function faceOval(width: number, height: number) {
  const rx = Math.min(width * 0.33, 150);
  const ry = rx * 1.3;
  return { cx: width / 2, cy: Math.min(height * 0.4, ry + 130), rx, ry };
}

export function FaceGuide() {
  const { width, height } = useWindowDimensions();
  const { cx, cy, rx, ry } = faceOval(width, height);
  const shoulderY = cy + ry + 26;
  return (
    <View style={{ flex: 1 }} accessibilityElementsHidden importantForAccessibility="no-hide-descendants" pointerEvents="none">
      <Svg width={width} height={height}>
        <Path
          d={`M0 0H${width}V${height}H0Z M${cx - rx} ${cy} a${rx} ${ry} 0 1 0 ${rx * 2} 0 a${rx} ${ry} 0 1 0 ${-rx * 2} 0 Z`}
          fill="rgba(14,12,20,0.55)"
          fillRule="evenodd"
        />
        <Ellipse cx={cx} cy={cy} rx={rx + 5} ry={ry + 5} stroke={colors.violet} strokeOpacity={0.55} strokeWidth={6} fill="none" />
        <Ellipse cx={cx} cy={cy} rx={rx} ry={ry} stroke="#FFFFFF" strokeWidth={2.5} strokeDasharray={[10, 8]} strokeLinecap="round" fill="none" />
        <Path
          d={`M${cx - rx * 1.55} ${shoulderY + 70} C ${cx - rx * 1.3} ${shoulderY + 6}, ${cx - rx * 0.55} ${shoulderY}, ${cx} ${shoulderY} S ${cx + rx * 1.3} ${shoulderY + 6}, ${cx + rx * 1.55} ${shoulderY + 70}`}
          stroke="#FFFFFF"
          strokeOpacity={0.7}
          strokeWidth={2.5}
          strokeDasharray={[10, 8]}
          strokeLinecap="round"
          fill="none"
        />
      </Svg>
    </View>
  );
}
