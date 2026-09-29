import { memo } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import Svg, { Circle, Line } from 'react-native-svg';

import { colors, GUTTER } from '@/theme';

/**
 * Subtle Neurotrace construction grid behind a screen: hairline columns, a few rows and one
 * large circle outline. Static (no motion), decorative, hidden from accessibility.
 */
export const HairlineGrid = memo(function HairlineGrid({
  tone = 'paper',
  circle = true,
  accentCircle = false,
  circleY = 0.34,
}: {
  tone?: 'paper' | 'night';
  circle?: boolean;
  accentCircle?: boolean;
  /** Circle centre as a fraction of the height. */
  circleY?: number;
}) {
  const { width, height } = useWindowDimensions();
  const line = tone === 'night' ? colors.nightLine : colors.line;
  const cols = [GUTTER + 0.5, width * 0.25, width * 0.5, width * 0.75, width - GUTTER - 0.5];
  const rows = [height * 0.18, height * 0.52, height * 0.86];
  const r = width * 0.62;
  return (
    <View
      style={StyleSheet.absoluteFill}
      pointerEvents="none"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <Svg width={width} height={height}>
        {cols.map((x, i) => (
          <Line key={`c${i}`} x1={x} y1={0} x2={x} y2={height} stroke={line} strokeWidth={i === 2 ? 0.5 : 0.75} />
        ))}
        {rows.map((y, i) => (
          <Line key={`r${i}`} x1={0} y1={y} x2={width} y2={y} stroke={line} strokeWidth={0.5} />
        ))}
        {circle ? (
          <Circle
            cx={width / 2}
            cy={height * circleY}
            r={r}
            stroke={accentCircle ? colors.accent : line}
            strokeOpacity={accentCircle ? 0.35 : 1}
            strokeWidth={0.75}
            fill="none"
          />
        ) : null}
      </Svg>
    </View>
  );
});
