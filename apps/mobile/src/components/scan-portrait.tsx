import { LinearGradient } from 'expo-linear-gradient';
import { useEffect } from 'react';
import { Image, StyleSheet, View, type ImageSourcePropType } from 'react-native';
import Animated, {
  Easing,
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

/** Face-mesh landmarks in a 188×188 box (from the approved prototype). */
const DOTS: [number, number, number][] = [
  [68, 82, 2], [120, 82, 2], [94, 104, 2], [80, 128, 2], [108, 128, 2], [94, 60, 2], [56, 104, 1.6], [132, 104, 1.6],
];
const MESH = 'M68 82 94 60 120 82 94 104Z M56 104 68 82 M132 104 120 82 M80 128 94 104 108 128Z M56 104 80 128 M132 104 108 128';

/**
 * Circular photo inside a progress ring with a face-mesh overlay and a looping soft violet
 * scan band (DESIGN.md §3.4). Reduced motion: no loop, the band rests mid-face.
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
          <G opacity={0.55}>
            <Path d={MESH} stroke="#FFFFFF" strokeWidth={0.8} fill="none" />
          </G>
          <G opacity={0.95}>
            {DOTS.map(([x, y, rad]) => (
              <Circle key={`${x}-${y}`} cx={x} cy={y} r={rad} fill="#FFFFFF" />
            ))}
          </G>
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
