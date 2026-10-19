import { useEffect, useMemo } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';

import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { colors } from '@/theme';

import { Icon } from './icon';

/** Tonelle palette pans + light. */
const DEFAULT_COLORS = ['#F6B48A', '#E4718A', '#C79BF2', colors.violet, '#FFFFFF', colors.butter];

/** Deterministic 0..1 noise, so a burst looks random but renders stay pure. */
function jitter(i: number, seed: number, k: number): number {
  const x = Math.sin((i + 1) * 12.9898 + seed * 78.233 + k * 37.719) * 43758.5453;
  return x - Math.floor(x);
}

interface Particle {
  angle: number;
  distance: number;
  size: number;
  color: string;
  star: boolean;
  spin: number;
}

/**
 * One-shot burst of sparkles and dots flying out from the centre of its parent.
 * Change `play` to fire it again; renders nothing with reduce motion.
 */
export function SparkleBurst({
  play = 0,
  count = 18,
  radius = 120,
  delay = 0,
  duration = 950,
  palette = DEFAULT_COLORS,
  style,
}: {
  play?: number;
  count?: number;
  radius?: number;
  delay?: number;
  duration?: number;
  palette?: readonly string[];
  style?: StyleProp<ViewStyle>;
}) {
  const reduced = useReducedMotion();
  const progress = useSharedValue(0);
  const particles = useMemo<Particle[]>(
    () =>
      Array.from({ length: count }, (_, i) => ({
        angle: (i / count) * Math.PI * 2 + jitter(i, play, 1) * 0.5,
        distance: radius * (0.55 + jitter(i, play, 2) * 0.6),
        size: 5 + jitter(i, play, 3) * 9,
        color: palette[i % palette.length] ?? colors.violet,
        star: i % 3 !== 0,
        spin: (jitter(i, play, 4) - 0.5) * 240,
      })),
    // New random layout per burst.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [count, radius, play],
  );

  useEffect(() => {
    if (reduced) return;
    progress.value = 0;
    progress.value = withDelay(delay, withTiming(1, { duration, easing: Easing.out(Easing.cubic) }));
  }, [play, reduced, delay, duration, progress]);

  if (reduced) return null;
  return (
    <View pointerEvents="none" style={[StyleSheet.absoluteFill, styles.center, style]}>
      {particles.map((p, i) => (
        <Spark key={`${play}-${i}`} particle={p} progress={progress} />
      ))}
    </View>
  );
}

function Spark({ particle, progress }: { particle: Particle; progress: SharedValue<number> }) {
  const animated = useAnimatedStyle(() => {
    const p = progress.value;
    const fadeIn = Math.min(1, p / 0.12);
    return {
      opacity: p === 0 ? 0 : fadeIn * (1 - Math.max(0, p - 0.35) / 0.65),
      transform: [
        { translateX: Math.cos(particle.angle) * particle.distance * p },
        { translateY: Math.sin(particle.angle) * particle.distance * p + p * p * 18 },
        { scale: 0.3 + 0.9 * Math.sin(Math.PI * Math.min(1, p * 1.2)) },
        { rotate: `${particle.spin * p}deg` },
      ],
    };
  });
  return (
    <Animated.View style={[styles.spark, animated]}>
      {particle.star ? (
        <Icon name="sparkle" size={particle.size * 1.6} color={particle.color} />
      ) : (
        <View
          style={{ width: particle.size * 0.7, height: particle.size * 0.7, borderRadius: particle.size, backgroundColor: particle.color }}
        />
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  center: { alignItems: 'center', justifyContent: 'center' },
  spark: { position: 'absolute' },
});
