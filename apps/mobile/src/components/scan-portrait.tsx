import { LinearGradient } from 'expo-linear-gradient';
import { useEffect } from 'react';
import { Image, StyleSheet, View, type ImageSourcePropType } from 'react-native';
import Animated, {
  Easing,
  type SharedValue,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle, G, Path } from 'react-native-svg';

import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { colors, motion } from '@/theme';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

/** Face landmarks in a 188×188 box: jaw/face outline, brows, eyes, nose, lips, cheeks, forehead. */
const mirror = (pts: [number, number][]): [number, number][] => [...pts, ...pts.map(([x, y]): [number, number] => [188 - x, y])];
const OUTLINE: [number, number][] = Array.from({ length: 13 }, (_, i) => {
  const a = ((160 + i * 18.3) * Math.PI) / 180;
  return [94 + 54 * Math.cos(a), 98 - 64 * Math.sin(a)];
});
const BROWS = mirror([[58, 70], [68, 65], [80, 66]]);
const EYES = mirror([[62, 82], [71, 78], [80, 82], [71, 86]]);
const NOSE: [number, number][] = [[94, 84], [94, 98], [87, 109], [94, 112], [101, 109]];
const LIPS: [number, number][] = [[79, 128], [87, 123], [94, 125], [101, 123], [109, 128], [101, 134], [94, 136], [87, 134]];
const CHEEKS = mirror([[58, 104], [70, 112]]);
const FOREHEAD: [number, number][] = [[76, 50], [94, 46], [112, 50]];
/** Order = the order dots light up while the scan progresses (outline first, then features). */
const DOTS = [...OUTLINE, ...FOREHEAD, ...BROWS, ...EYES, ...NOSE, ...CHEEKS, ...LIPS];
const poly = (pts: [number, number][], close = false) =>
  `M${pts.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(' L')}${close ? 'Z' : ''}`;
const MESH = [
  poly(OUTLINE),
  poly(EYES.slice(0, 4), true),
  poly(EYES.slice(4), true),
  poly(BROWS.slice(0, 3)),
  poly(BROWS.slice(3)),
  poly(NOSE.slice(0, 2)) + ' ' + poly(NOSE.slice(2)),
  poly(LIPS, true),
  poly([EYES[2]!, NOSE[0]!, EYES[6]!]),
  poly([CHEEKS[0]!, NOSE[2]!, CHEEKS[2]!]),
  poly([CHEEKS[1]!, LIPS[0]!]) + ' ' + poly([CHEEKS[3]!, LIPS[4]!]),
].join(' ');
const MESH_LEN = 600; // ≈ total path length (589)

const AnimatedPath = Animated.createAnimatedComponent(Path);

/** One landmark: appears once the scan reaches it, then pulses in a wave that runs across the face. */
function Dot({ x, y, index, clock, reveal }: { x: number; y: number; index: number; clock: SharedValue<number>; reveal: SharedValue<number> }) {
  const props = useAnimatedProps(() => {
    const shown = Math.min(1, Math.max(0, reveal.value * DOTS.length - index + 1));
    const wave = 0.5 + 0.5 * Math.sin(2 * Math.PI * (clock.value - index / DOTS.length));
    return { r: shown * (1.3 + wave * 1.5), opacity: shown * (0.45 + wave * 0.55) };
  });
  return <AnimatedCircle cx={x} cy={y} fill="#FFFFFF" animatedProps={props} />;
}

/**
 * Circular photo inside a progress ring with a live face mesh: landmarks light up as the
 * analysis progresses and pulse in a wave, the mesh draws itself, and a soft violet band
 * sweeps the face (DESIGN.md §3.4). Reduced motion: static mesh, the band rests mid-face.
 */
export function ScanPortrait({
  size,
  source,
  progress,
  active = true,
}: {
  size: number;
  source: ImageSourcePropType | null;
  /** 0..1 */
  progress: number;
  active?: boolean;
}) {
  const reduced = useReducedMotion();
  const stroke = 6;
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const inset = 16;
  const inner = size - inset * 2;

  const p = useSharedValue(0);
  useEffect(() => {
    p.set(withTiming(progress, { duration: reduced ? 0 : 450, easing: Easing.out(Easing.quad) }));
  }, [progress, reduced, p]);
  const ringProps = useAnimatedProps(() => ({ strokeDashoffset: circ * (1 - p.value) }));

  const band = useSharedValue(0.4);
  useEffect(() => {
    if (reduced || !active) {
      band.set(0.4);
      return;
    }
    band.set(-0.2);
    band.set(withRepeat(withTiming(0.8, { duration: motion.scanLoop / 2, easing: Easing.inOut(Easing.ease) }), -1, true));
  }, [reduced, active, band]);
  const bandStyle = useAnimatedStyle(() => ({ transform: [{ translateY: band.value * inner }] }));

  // Wave clock for the dot pulse; the mesh keeps redrawing so the face reads as "being read".
  const clock = useSharedValue(0);
  useEffect(() => {
    if (reduced || !active) {
      clock.set(0.25);
      return;
    }
    clock.set(0);
    clock.set(withRepeat(withTiming(1, { duration: 1600, easing: Easing.linear }), -1, false));
  }, [reduced, active, clock]);
  const reveal = useSharedValue(reduced ? 1 : 0);
  useEffect(() => {
    // Dots run a little ahead of the ring so the whole face is mapped well before 100%.
    reveal.set(withTiming(reduced ? 1 : Math.min(1, progress * 1.6 + 0.08), { duration: reduced ? 0 : 450 }));
  }, [progress, reduced, reveal]);
  const meshProps = useAnimatedProps(() => ({ strokeDashoffset: MESH_LEN * (1 - reveal.value) }));

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
        <Circle cx={size / 2} cy={size / 2} r={r} stroke={colors.violetSoft} strokeWidth={stroke} fill="none" />
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={colors.violet}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={[circ, circ]}
          animatedProps={ringProps}
          rotation={-90}
          originX={size / 2}
          originY={size / 2}
        />
      </Svg>
      <View style={[styles.face, { top: inset, left: inset, width: inner, height: inner, borderRadius: inner / 2 }]}>
        {source ? (
          <Image source={source} style={styles.img} resizeMode="cover" accessibilityIgnoresInvertColors />
        ) : null}
        <Animated.View style={[styles.band, { height: inner * 0.2 }, bandStyle]}>
          <LinearGradient
            colors={['rgba(116,87,245,0)', 'rgba(116,87,245,0.38)', 'rgba(116,87,245,0)']}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>
        <Svg width={inner} height={inner} viewBox="0 0 188 188" style={StyleSheet.absoluteFill}>
          <G opacity={0.5}>
            <AnimatedPath
              d={MESH}
              stroke="#FFFFFF"
              strokeWidth={0.7}
              fill="none"
              strokeDasharray={[MESH_LEN, MESH_LEN]}
              animatedProps={meshProps}
            />
          </G>
          {DOTS.map(([x, y], i) => (
            <Dot key={i} x={x} y={y} index={i} clock={clock} reveal={reveal} />
          ))}
        </Svg>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  face: { position: 'absolute', overflow: 'hidden', backgroundColor: colors.mist },
  img: { width: '100%', height: '100%' },
  band: { position: 'absolute', left: 0, right: 0, top: 0 },
});
