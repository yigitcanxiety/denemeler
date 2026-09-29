import { useEffect, useId } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  cancelAnimation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';
import Svg, { Circle, Defs, Ellipse, LinearGradient, RadialGradient, Stop } from 'react-native-svg';

import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { colors } from '@/theme';

const CYCLE_MS = 3200;

/**
 * Glass sphere holding a heat-map blob (Neurotrace dark section). With several `palettes` the
 * blob cross-fades through them (e.g. the four season families); one palette = static colour.
 * Reduce motion: no cycling, first palette only.
 */
export function GlassSphere({ size = 220, palettes }: { size?: number; palettes: readonly (readonly string[])[] }) {
  const reduced = useReducedMotion();
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  const phase = useSharedValue(0);
  const count = Math.max(1, palettes.length);

  useEffect(() => {
    if (reduced || count < 2) {
      cancelAnimation(phase);
      phase.value = 0;
      return;
    }
    phase.value = 0;
    phase.value = withRepeat(withTiming(count, { duration: CYCLE_MS * count, easing: Easing.linear }), -1, false);
    return () => cancelAnimation(phase);
  }, [reduced, count, phase]);

  const blob = size * 0.52;
  return (
    <View style={{ width: size, height: size }} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
        <Defs>
          <RadialGradient id={`gs-body${uid}`} cx="50%" cy="45%" r="55%">
            <Stop offset="0" stopColor="#2A1D1C" stopOpacity={0.9} />
            <Stop offset="0.75" stopColor="#1B1313" stopOpacity={0.95} />
            <Stop offset="1" stopColor="#EFE9E3" stopOpacity={0.22} />
          </RadialGradient>
        </Defs>
        <Circle cx={size / 2} cy={size / 2} r={size / 2 - 1} fill={`url(#gs-body${uid})`} />
      </Svg>

      <View style={[styles.center, StyleSheet.absoluteFill]}>
        {palettes.map((palette, i) => (
          <PaletteBlob key={i} index={i} count={count} phase={phase} palette={palette} size={blob} still={reduced || count < 2} />
        ))}
      </View>

      <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
        <Defs>
          <LinearGradient id={`gs-spec${uid}`} x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#FFFFFF" stopOpacity={0.42} />
            <Stop offset="1" stopColor="#FFFFFF" stopOpacity={0} />
          </LinearGradient>
        </Defs>
        {/* orbit ring */}
        <Ellipse cx={size / 2} cy={size * 0.6} rx={size * 0.46} ry={size * 0.1} stroke={colors.onInk} strokeOpacity={0.55} strokeWidth={1.5} fill="none" />
        <Ellipse cx={size / 2} cy={size * 0.6} rx={size * 0.3} ry={size * 0.06} stroke={colors.onInk} strokeOpacity={0.18} strokeWidth={1} fill="none" />
        {/* specular highlight */}
        <Ellipse cx={size * 0.36} cy={size * 0.2} rx={size * 0.22} ry={size * 0.1} fill={`url(#gs-spec${uid})`} transform={`rotate(-24 ${size * 0.36} ${size * 0.2})`} />
        <Circle cx={size / 2} cy={size / 2} r={size / 2 - 1} stroke={colors.onInk} strokeOpacity={0.2} strokeWidth={1} fill="none" />
      </Svg>
    </View>
  );
}

function PaletteBlob({
  index,
  count,
  phase,
  palette,
  size,
  still,
}: {
  index: number;
  count: number;
  phase: SharedValue<number>;
  palette: readonly string[];
  size: number;
  still: boolean;
}) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  const style = useAnimatedStyle(() => {
    if (still) return { opacity: index === 0 ? 1 : 0 };
    // distance on the cycle (wraps around)
    const raw = Math.abs(phase.value - index);
    const d = Math.min(raw, count - raw);
    return {
      opacity: interpolate(d, [0, 0.6, 1], [1, 0.4, 0], 'clamp'),
      transform: [{ scale: interpolate(d, [0, 1], [1.02, 0.96], 'clamp') }],
    };
  });
  const [a, b, c, d] = [palette[0], palette[1] ?? palette[0], palette[2] ?? palette[0], palette[3] ?? palette[0]];
  return (
    <Animated.View style={[styles.blob, { width: size, height: size }, style]}>
      <Svg width={size} height={size}>
        <Defs>
          {[a, b, c, d].map((color, i) => (
            <RadialGradient key={i} id={`pb${uid}${i}`} cx="50%" cy="50%" r="50%">
              <Stop offset="0" stopColor={color} stopOpacity={0.95} />
              <Stop offset="1" stopColor={color} stopOpacity={0} />
            </RadialGradient>
          ))}
        </Defs>
        <Circle cx={size * 0.5} cy={size * 0.52} r={size * 0.5} fill={`url(#pb${uid}3)`} />
        <Circle cx={size * 0.38} cy={size * 0.44} r={size * 0.32} fill={`url(#pb${uid}1)`} />
        <Circle cx={size * 0.64} cy={size * 0.5} r={size * 0.3} fill={`url(#pb${uid}2)`} />
        <Circle cx={size * 0.5} cy={size * 0.56} r={size * 0.26} fill={`url(#pb${uid}0)`} />
      </Svg>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  center: { alignItems: 'center', justifyContent: 'center' },
  blob: { position: 'absolute' },
});
