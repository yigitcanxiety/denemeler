import { useEffect, useMemo, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import Animated, {
  cancelAnimation,
  interpolate,
  useAnimatedProps,
  useSharedValue,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';
import Svg, { Circle, G, Line } from 'react-native-svg';

import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { colors, fonts, heat } from '@/theme';

import { BigNumber } from './big-number';
import { HeatFace, ScanLine } from './heat-face';
import { Chip } from './labels';
import { AppText } from './text';

const AnimatedLine = Animated.createAnimatedComponent(Line);

const RAYS = 72;
const DRAW_MS = 1500;

/** Deterministic pseudo-random 0..1 per ray (stable lengths without Math.random). */
function hash(i: number): number {
  const x = Math.sin(i * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

/**
 * Radial sunburst preloader (DESIGN.md §3.1, mobile §5 "Analyzing") wrapped around the user's
 * photo in a circle: rays draw outward (stroke-dashoffset, staggered), the four season labels
 * type in at N/E/S/W, a dark pill counts 000%→100%, and an accent "ANALYZING…" tag sits over a
 * scan line crossing the photo. Reduce motion: everything is drawn immediately, no scan loop.
 */
export function Sunburst({
  size,
  photoUri,
  percent,
  labels,
  tag,
  active = true,
}: {
  size: number;
  photoUri?: string | null;
  /** 0..100 — real progress of the request. */
  percent: number;
  /** Season labels N, E, S, W. */
  labels: [string, string, string, string];
  tag: string;
  /** False stops the scan loop (e.g. on error). */
  active?: boolean;
}) {
  const reduced = useReducedMotion();
  const draw = useSharedValue(0);
  const c = size / 2;
  const photoR = size * 0.27;
  const inner = photoR + 12;
  const outer = size / 2 - 26;

  const rays = useMemo(
    () =>
      Array.from({ length: RAYS }, (_, i) => {
        const angle = (i / RAYS) * Math.PI * 2 - Math.PI / 2;
        const major = i % 6 === 0;
        const len = major ? outer - inner : (outer - inner) * (0.35 + hash(i) * 0.55);
        const x1 = c + Math.cos(angle) * inner;
        const y1 = c + Math.sin(angle) * inner;
        const x2 = c + Math.cos(angle) * (inner + len);
        const y2 = c + Math.sin(angle) * (inner + len);
        return { x1, y1, x2, y2, len, major, dot: major || hash(i + 3) > 0.72 };
      }),
    [c, inner, outer],
  );

  useEffect(() => {
    if (reduced) {
      cancelAnimation(draw);
      draw.value = 1;
      return;
    }
    draw.value = 0;
    draw.value = withTiming(1, { duration: DRAW_MS });
  }, [reduced, draw]);

  const typed = useTypewriter(labels.join('|').length, reduced ? 0 : 600, reduced ? 0 : 38);
  const typedLabels = labels.map((l, i) => {
    const offset = labels.slice(0, i).reduce((sum, prev) => sum + prev.length + 1, 0);
    return l.slice(0, Math.max(0, Math.min(l.length, typed - offset)));
  });

  const still = reduced || !active;

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size} accessibilityElementsHidden importantForAccessibility="no">
        <Circle cx={c} cy={c} r={outer + 14} stroke={colors.line} strokeWidth={0.75} fill="none" />
        <Circle cx={c} cy={c} r={photoR + 5} stroke={colors.accent} strokeWidth={1} fill="none" />
        <G>
          {rays.map((ray, i) => (
            <Ray key={i} index={i} ray={ray} draw={draw} />
          ))}
        </G>
        {/* crosshair */}
        <Line x1={c} y1={4} x2={c} y2={c - photoR - 8} stroke={colors.lineStrong} strokeWidth={0.75} />
        <Line x1={c} y1={c + photoR + 8} x2={c} y2={size - 4} stroke={colors.lineStrong} strokeWidth={0.75} />
      </Svg>

      <View
        style={[
          styles.photo,
          { width: photoR * 2, height: photoR * 2, borderRadius: photoR, left: c - photoR, top: c - photoR },
        ]}
      >
        {photoUri ? (
          <Image source={{ uri: photoUri }} style={StyleSheet.absoluteFill} resizeMode="cover" accessibilityIgnoresInvertColors />
        ) : (
          <View style={styles.photoFallback}>
            <HeatFace width={photoR * 1.5} palette={heat} animate={false} />
          </View>
        )}
        <View style={styles.photoTint} />
        <ScanLine width={photoR * 2} height={photoR * 2} still={still} />
      </View>

      <View style={[styles.tag, { top: c + photoR - 11 }]} pointerEvents="none">
        <Chip label={tag} tone="accent" caps={false} />
      </View>

      {/* Season labels at N / E / S / W */}
      <SeasonLabel text={typedLabels[0] ?? ''} full={labels[0]} style={{ top: 0, left: 0, right: 0, alignItems: 'center' }} />
      <SeasonLabel text={typedLabels[1] ?? ''} full={labels[1]} style={{ top: c - 8, right: 0 }} />
      <SeasonLabel text={typedLabels[2] ?? ''} full={labels[2]} style={{ bottom: 0, left: 0, right: 0, alignItems: 'center' }} />
      <SeasonLabel text={typedLabels[3] ?? ''} full={labels[3]} style={{ top: c - 8, left: 0 }} />

      <View style={styles.counter} accessibilityLiveRegion="polite">
        <BigNumber value={percent} pad={3} suffix="%" size={15} color={colors.onInk} duration={600} style={styles.counterText} />
      </View>
    </View>
  );
}

function Ray({
  index,
  ray,
  draw,
}: {
  index: number;
  ray: { x1: number; y1: number; x2: number; y2: number; len: number; major: boolean; dot: boolean };
  draw: SharedValue<number>;
}) {
  const start = (index % 12) / 12 * 0.45 + (index / RAYS) * 0.1;
  const props = useAnimatedProps(() => {
    const t = interpolate(draw.value, [start, start + 0.45], [0, 1], 'clamp');
    return { strokeDashoffset: ray.len * (1 - t) };
  });
  return (
    <>
      <AnimatedLine
        x1={ray.x1}
        y1={ray.y1}
        x2={ray.x2}
        y2={ray.y2}
        stroke={ray.major ? colors.ink : colors.inkMuted}
        strokeOpacity={ray.major ? 0.8 : 0.5}
        strokeWidth={ray.major ? 1 : 0.75}
        strokeDasharray={[ray.len, ray.len]}
        animatedProps={props}
      />
      {ray.dot ? <Circle cx={ray.x2} cy={ray.y2} r={ray.major ? 2 : 1.3} fill={colors.ink} fillOpacity={0.7} /> : null}
    </>
  );
}

function SeasonLabel({ text, full, style }: { text: string; full: string; style: object }) {
  return (
    <View style={[styles.label, style]} pointerEvents="none" accessible accessibilityLabel={full}>
      <AppText variant="monoLabel" color={colors.ink} style={styles.labelText}>
        {text || ' '}
      </AppText>
    </View>
  );
}

/** Number of characters revealed so far (12–40 ms/char). */
function useTypewriter(total: number, delay: number, perChar: number): number {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (perChar === 0) return;
    let interval: ReturnType<typeof setInterval> | undefined;
    const timer = setTimeout(() => {
      setCount(0);
      interval = setInterval(() => {
        setCount((n) => {
          if (n >= total) {
            if (interval) clearInterval(interval);
            return n;
          }
          return n + 1;
        });
      }, perChar);
    }, delay);
    return () => {
      clearTimeout(timer);
      if (interval) clearInterval(interval);
    };
  }, [total, delay, perChar]);
  return perChar === 0 ? total : count;
}

const styles = StyleSheet.create({
  photo: { position: 'absolute', overflow: 'hidden', backgroundColor: colors.paperSunken },
  photoFallback: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  photoTint: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(200,53,74,0.08)' },
  tag: { position: 'absolute', left: 0, right: 0, alignItems: 'center' },
  label: { position: 'absolute', paddingHorizontal: 2 },
  labelText: { fontSize: 10.5, letterSpacing: 0.8, backgroundColor: colors.paper, paddingHorizontal: 3 },
  counter: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    backgroundColor: colors.ink,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  counterText: { fontFamily: fonts.mono, letterSpacing: 0, lineHeight: 18 },
});
