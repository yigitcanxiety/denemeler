import { useEffect, useId } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle, Defs, Path, RadialGradient, Stop } from 'react-native-svg';

import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { colors, heat } from '@/theme';

import { Chip } from './labels';

/** Blob layout in the 200×240 face viewBox: [cx, cy, r, inner palette index, outer palette index]. */
const BLOBS: [number, number, number, number, number][] = [
  [100, 112, 92, 4, 4], // overall champagne glow
  [66, 139, 34, 2, 3], // left cheek
  [134, 139, 34, 2, 3], // right cheek
  [73, 104, 20, 3, 4], // left lid
  [127, 104, 20, 3, 4], // right lid
  [100, 172, 27, 0, 1], // lips
];

const VIEW_W = 200;
const VIEW_H = 240;

/**
 * Line-art face (single-weight strokes) with heat-map makeup blobs on lips, cheeks and eyelids
 * that slowly breathe (scale 0.97↔1.03). `palette` = 5 colours, deep → light (defaults to the
 * makeup heat ramp). `scanning` adds the accent "ANALYZING…" tag with a moving scan line.
 * Reduce motion: static blobs, no scan movement.
 */
export function HeatFace({
  width = 240,
  palette = heat,
  stroke = colors.ink,
  scanning,
  scanLabel,
  animate = true,
}: {
  width?: number;
  palette?: readonly string[];
  stroke?: string;
  scanning?: boolean;
  scanLabel?: string;
  /** Set false for static renders (share card capture). */
  animate?: boolean;
}) {
  const reduced = useReducedMotion();
  const still = reduced || !animate;
  const k = width / VIEW_W;
  const height = VIEW_H * k;
  return (
    <View
      style={{ width, height }}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      {BLOBS.map(([cx, cy, r, inner, outer], i) => (
        <HeatBlob
          key={i}
          size={r * 2 * k}
          left={(cx - r) * k}
          top={(cy - r) * k}
          inner={palette[inner] ?? heat[inner] ?? heat[0]}
          outer={palette[outer] ?? heat[outer] ?? heat[4]}
          still={still}
          phase={i * 420}
          soft={i === 0}
        />
      ))}
      <Svg width={width} height={height} viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} style={StyleSheet.absoluteFill}>
        <FaceLines stroke={stroke} />
      </Svg>
      {scanning ? <ScanLine width={width} height={height} still={still} label={scanLabel} /> : null}
    </View>
  );
}

function FaceLines({ stroke }: { stroke: string }) {
  const p = { stroke, strokeWidth: 1.25, fill: 'none', strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  return (
    <>
      {/* head */}
      <Path d="M100 30 C136 30 158 58 158 100 C158 142 146 176 126 196 C116 206 108 210 100 210 C92 210 84 206 74 196 C54 176 42 142 42 100 C42 58 64 30 100 30 Z" {...p} />
      {/* hair */}
      <Path d="M44 96 C40 52 70 22 104 24 C140 26 164 54 160 104 C164 150 170 196 186 236" {...p} />
      <Path d="M44 96 C38 140 34 190 16 236" {...p} />
      <Path d="M58 60 C76 44 110 40 134 52 C146 58 154 70 158 84" {...p} />
      {/* neck */}
      <Path d="M82 204 C84 218 82 228 76 240 M118 204 C116 218 118 228 124 240" {...p} />
      {/* brows */}
      <Path d="M58 90 C66 84 78 83 88 87" {...p} />
      <Path d="M112 87 C122 83 134 84 142 90" {...p} />
      {/* eyes (soft lids) */}
      <Path d="M60 106 C66 100 80 100 86 106" {...p} />
      <Path d="M62 107 C68 111 78 111 85 107" {...p} strokeWidth={0.9} />
      <Path d="M114 106 C120 100 134 100 140 106" {...p} />
      <Path d="M115 107 C122 111 132 111 138 107" {...p} strokeWidth={0.9} />
      {/* nose */}
      <Path d="M102 108 C104 124 108 138 110 148 C106 152 98 153 92 150" {...p} />
      {/* lips */}
      <Path d="M80 172 C88 166 95 164 100 168 C105 164 112 166 120 172 C112 180 106 184 100 184 C94 184 88 180 80 172 Z" {...p} />
      <Path d="M80 172 C90 174 110 174 120 172" {...p} strokeWidth={0.9} />
    </>
  );
}

function HeatBlob({
  size,
  left,
  top,
  inner,
  outer,
  still,
  phase,
  soft,
}: {
  size: number;
  left: number;
  top: number;
  inner: string;
  outer: string;
  still: boolean;
  phase: number;
  soft?: boolean;
}) {
  const id = `hb${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  const breath = useSharedValue(0);

  useEffect(() => {
    if (still) {
      cancelAnimation(breath);
      breath.value = 0.5;
      return;
    }
    breath.value = 0;
    breath.value = withDelay(
      phase,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 2600, easing: Easing.inOut(Easing.sin) }),
          withTiming(0, { duration: 2600, easing: Easing.inOut(Easing.sin) }),
        ),
        -1,
      ),
    );
    return () => cancelAnimation(breath);
  }, [still, phase, breath]);

  const animated = useAnimatedStyle(() => ({
    opacity: soft ? 0.55 + breath.value * 0.15 : 0.82 + breath.value * 0.18,
    transform: still ? [] : [{ scale: 0.97 + breath.value * 0.06 }],
  }));

  return (
    <Animated.View style={[styles.blob, { width: size, height: size, left, top }, animated]}>
      <Svg width={size} height={size}>
        <Defs>
          <RadialGradient id={id} cx="50%" cy="50%" r="50%">
            <Stop offset="0" stopColor={inner} stopOpacity={soft ? 0.7 : 0.95} />
            <Stop offset="0.45" stopColor={outer} stopOpacity={soft ? 0.45 : 0.6} />
            <Stop offset="1" stopColor={outer} stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Circle cx={size / 2} cy={size / 2} r={size / 2} fill={`url(#${id})`} />
      </Svg>
    </Animated.View>
  );
}

/** Accent tag with a thin scan line sweeping over the object. */
export function ScanLine({ width, height, still, label }: { width: number; height: number; still: boolean; label?: string }) {
  const y = useSharedValue(0.5);
  useEffect(() => {
    if (still) {
      cancelAnimation(y);
      y.value = 0.5;
      return;
    }
    y.value = 0.15;
    y.value = withRepeat(
      withSequence(
        withTiming(0.85, { duration: 1700, easing: Easing.inOut(Easing.quad) }),
        withTiming(0.15, { duration: 1700, easing: Easing.inOut(Easing.quad) }),
      ),
      -1,
    );
    return () => cancelAnimation(y);
  }, [still, y]);

  const line = useAnimatedStyle(() => ({ transform: [{ translateY: y.value * height }] }));

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Animated.View style={[styles.scanWrap, { width }, line]}>
        <View style={styles.scanLine} />
        {label ? (
          <View style={styles.scanTag}>
            <Chip label={label} tone="accent" caps={false} />
          </View>
        ) : null}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  blob: { position: 'absolute' },
  scanWrap: { position: 'absolute', top: 0, left: 0, height: 0, alignItems: 'center', justifyContent: 'center' },
  scanLine: { position: 'absolute', left: 0, right: 0, height: 1, backgroundColor: colors.accent },
  scanTag: { position: 'absolute', top: -11 },
});
