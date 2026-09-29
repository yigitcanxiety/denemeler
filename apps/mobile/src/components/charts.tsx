import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';
import Svg, { Circle, Line, Polygon, Text as SvgText } from 'react-native-svg';

import { useReducedMotion } from '@/hooks/use-reduced-motion';
import type { ProfilePoint } from '@/lib/results';
import { chart, colors, fonts, motion } from '@/theme';

import { AppText } from './text';

/**
 * Colour-profile radar (react-native-svg). The polygon grows from the centre in 600 ms
 * (a fade with reduce motion). Values are descriptive 0–100, never a beauty score.
 */
export function RadarChart({ points, width }: { points: ProfilePoint[]; width: number }) {
  const reduced = useReducedMotion();
  const height = Math.round(width * 0.66);
  const cx = width / 2;
  const cy = height / 2;
  const R = Math.min(height / 2 - 18, width / 2 - 70);
  const n = points.length;
  const pt = (i: number, r: number) => {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / n;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)] as const;
  };
  const ring = (f: number) => points.map((_, i) => pt(i, R * f).join(',')).join(' ');
  const shape = points.map((p, i) => pt(i, (R * p.value) / 100).join(',')).join(' ');

  const grow = useSharedValue(0);
  useEffect(() => {
    grow.set(withTiming(1, { duration: reduced ? motion.reducedFade : motion.radar, easing: motion.outExpo }));
  }, [grow, reduced]);
  const growStyle = useAnimatedStyle(() =>
    reduced ? { opacity: grow.value } : { opacity: Math.min(1, grow.value * 2), transform: [{ scale: grow.value }] },
  );

  return (
    <View
      style={{ width, height, alignSelf: 'center' }}
      accessible
      accessibilityLabel={points.map((p) => `${p.label} ${p.value}`).join(', ')}
    >
      <Svg width={width} height={height} style={StyleSheet.absoluteFill}>
        {[0.33, 0.66, 1].map((f) => (
          <Polygon key={f} points={ring(f)} fill="none" stroke={colors.line} strokeWidth={1} />
        ))}
        {points.map((p, i) => {
          const [x, y] = pt(i, R);
          return <Line key={p.axis} x1={cx} y1={cy} x2={x} y2={y} stroke={colors.line} strokeWidth={1} />;
        })}
        {points.map((p, i) => {
          const [x, y] = pt(i, R + 14);
          const anchor = Math.abs(x - cx) < 5 ? 'middle' : x > cx ? 'start' : 'end';
          return (
            <SvgText
              key={p.axis}
              x={x}
              y={y + 4}
              textAnchor={anchor}
              fontSize={11}
              fontFamily={fonts.medium}
              fill={colors.muted}
            >
              {`${p.label} ${p.value}`}
            </SvgText>
          );
        })}
      </Svg>
      <Animated.View style={[StyleSheet.absoluteFill, growStyle]}>
        <Svg width={width} height={height}>
          <Polygon points={shape} fill="rgba(116,87,245,0.26)" stroke={colors.violet} strokeWidth={1.75} strokeLinejoin="round" />
          {points.map((p, i) => {
            const [x, y] = pt(i, (R * p.value) / 100);
            return <Circle key={p.axis} cx={x} cy={y} r={3} fill={colors.violet} />;
          })}
        </Svg>
      </Animated.View>
    </View>
  );
}

const BAR_COLORS: Record<string, string> = {
  warmth: chart.warmth,
  contrast: chart.contrast,
  softness: chart.softness,
  depth: chart.depth,
};

/** Coloured profile bars that fill in 500 ms, staggered. */
export function ProfileBars({ bars }: { bars: ProfilePoint[] }) {
  return (
    <View style={styles.bars}>
      {bars.map((bar, i) => (
        <Bar key={bar.axis} bar={bar} index={i} />
      ))}
    </View>
  );
}

function Bar({ bar, index }: { bar: ProfilePoint; index: number }) {
  const reduced = useReducedMotion();
  const fill = useSharedValue(reduced ? bar.value : 0);
  useEffect(() => {
    fill.set(
      reduced ? bar.value : withDelay(150 + index * 120, withTiming(bar.value, { duration: motion.bars, easing: motion.outExpo })),
    );
  }, [bar.value, index, reduced, fill]);
  const fillStyle = useAnimatedStyle(() => ({ width: `${fill.value}%` }));

  return (
    <View style={styles.bar} accessible accessibilityLabel={`${bar.label} ${bar.value}`}>
      <View style={styles.barText}>
        <AppText variant="small" color={colors.ink} style={styles.barLabel}>
          {bar.label}
        </AppText>
        <View style={styles.track}>
          <Animated.View style={[styles.fill, { backgroundColor: BAR_COLORS[bar.axis] ?? colors.violet }, fillStyle]} />
        </View>
      </View>
      <AppText style={styles.barValue}>{bar.value}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  bars: { gap: 12 },
  bar: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  barText: { flex: 1, gap: 5 },
  barLabel: { fontSize: 13 },
  track: { height: 8, borderRadius: 4, backgroundColor: colors.mist, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 4 },
  barValue: { fontFamily: fonts.display, fontSize: 20, lineHeight: 24, color: colors.ink, minWidth: 28, textAlign: 'right' },
});
