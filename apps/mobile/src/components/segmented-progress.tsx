import { useEffect } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';

import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { colors, motion } from '@/theme';

/**
 * BRIK segmented bar progress (`||||||||`). Segments fill one by one as `value` (0..1) changes.
 * `onInk` uses accent-soft on dark cards; otherwise ink on paper. Reduce motion: no bar-by-bar
 * sweep, just a quick fade to the new state.
 */
export function SegmentedProgress({
  value,
  segments = 20,
  height = 30,
  onInk = false,
  label,
  style,
  duration = 900,
}: {
  value: number;
  segments?: number;
  height?: number;
  onInk?: boolean;
  label?: string;
  style?: StyleProp<ViewStyle>;
  duration?: number;
}) {
  const reduced = useReducedMotion();
  const clamped = Math.min(1, Math.max(0, value));
  const filled = useSharedValue(0);

  useEffect(() => {
    filled.value = withTiming(clamped * segments, {
      duration: reduced ? motion.reducedFade : duration,
      easing: motion.outExpo,
    });
  }, [clamped, segments, duration, reduced, filled]);

  const on = onInk ? colors.accentSoft : colors.ink;
  const off = onInk ? colors.accentSoftDim : colors.line;

  return (
    <View
      style={[styles.row, { height }, style]}
      accessibilityRole="progressbar"
      accessibilityLabel={label}
      accessibilityValue={{ min: 0, max: 100, now: Math.round(clamped * 100) }}
    >
      {Array.from({ length: segments }, (_, i) => (
        <Segment key={i} index={i} filled={filled} on={on} off={off} />
      ))}
    </View>
  );
}

function Segment({ index, filled, on, off }: { index: number; filled: SharedValue<number>; on: string; off: string }) {
  const animated = useAnimatedStyle(() => ({
    opacity: interpolate(filled.value - index, [0, 1], [0, 1], 'clamp'),
  }));
  return (
    <View style={[styles.segment, { backgroundColor: off }]}>
      <Animated.View style={[StyleSheet.absoluteFill, styles.fill, { backgroundColor: on }, animated]} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 3, alignItems: 'stretch' },
  segment: { flex: 1, borderRadius: 2, overflow: 'hidden' },
  fill: { borderRadius: 2 },
});
