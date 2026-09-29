import { View, useWindowDimensions } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

import { colors } from '@/theme';

/**
 * Circular face guide over the live camera: the area outside the circle is veiled in soft
 * white and a violet ring marks where the face goes. Returns the circle geometry via
 * `faceCircle` so the camera UI can position labels around it.
 */
export function faceCircle(width: number, height: number) {
  const r = Math.min(width * 0.38, 170);
  return { cx: width / 2, cy: Math.min(height * 0.42, r + 150), r };
}

export function FaceGuide() {
  const { width, height } = useWindowDimensions();
  const { cx, cy, r } = faceCircle(width, height);
  return (
    <View style={{ flex: 1 }} accessibilityElementsHidden importantForAccessibility="no-hide-descendants" pointerEvents="none">
      <Svg width={width} height={height}>
        <Path
          d={`M0 0H${width}V${height}H0Z M${cx - r} ${cy} a${r} ${r} 0 1 0 ${r * 2} 0 a${r} ${r} 0 1 0 ${-r * 2} 0 Z`}
          fill="rgba(255,255,255,0.82)"
          fillRule="evenodd"
        />
        <Circle cx={cx} cy={cy} r={r + 7} stroke={colors.violetSoft} strokeWidth={6} fill="none" />
        <Circle cx={cx} cy={cy} r={r + 7} stroke={colors.violet} strokeWidth={3} strokeDasharray={[r * 1.6, r * 0.6]} strokeLinecap="round" fill="none" />
      </Svg>
    </View>
  );
}
