import { useEffect } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';

import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { readableTextOn } from '@/lib/results';
import { colors, motion, radii, spacing } from '@/theme';

import { NumberTag } from './labels';
import { AppText } from './text';

export function Swatch({ hex, size = 44, showHex, onInk }: { hex: string; size?: number; showHex?: boolean; onInk?: boolean }) {
  return (
    <View style={styles.swatchWrap} accessible accessibilityLabel={hex}>
      <View
        style={[
          styles.swatch,
          { width: size, height: size, borderRadius: size / 2, backgroundColor: hex },
          onInk && styles.swatchOnInk,
        ]}
      >
        {showHex && size >= 56 ? (
          <AppText variant="monoSmall" color={readableTextOn(hex)}>
            {hex.toUpperCase()}
          </AppText>
        ) : null}
      </View>
      {showHex && size < 56 ? (
        <AppText variant="monoSmall" color={onInk ? colors.onInkMuted : colors.inkMuted} style={styles.swatchCaption}>
          {hex.toUpperCase()}
        </AppText>
      ) : null}
    </View>
  );
}

export function SwatchRow({ colors: hexes, size, showHex, onInk }: { colors: string[]; size?: number; showHex?: boolean; onInk?: boolean }) {
  return (
    <View style={styles.swatchRow}>
      {hexes.map((hex, i) => (
        <Swatch key={`${hex}-${i}`} hex={hex} size={size} showHex={showHex} onInk={onInk} />
      ))}
    </View>
  );
}

/**
 * Palette as a segmented swatch bar (BRIK segmented progress, in colour). Segments grow in one
 * by one (opacity only with reduce motion). `showHex` prints mono codes under each segment.
 */
export function SwatchBar({
  colors: hexes,
  height = 56,
  showHex,
  onInk,
  style,
}: {
  colors: string[];
  height?: number;
  showHex?: boolean;
  onInk?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View style={style} accessible accessibilityLabel={hexes.join(', ')}>
      <View style={[styles.bar, { height }]}>
        {hexes.map((hex, i) => (
          <BarSegment key={`${hex}-${i}`} hex={hex} index={i} first={i === 0} last={i === hexes.length - 1} />
        ))}
      </View>
      {showHex ? (
        <View style={styles.hexRow}>
          {hexes.map((hex, i) => (
            <AppText
              key={`${hex}-${i}`}
              variant="monoSmall"
              color={onInk ? colors.onInkSubtle : colors.inkSubtle}
              style={styles.hex}
              numberOfLines={1}
              adjustsFontSizeToFit
            >
              {hex.replace('#', '').toUpperCase()}
            </AppText>
          ))}
        </View>
      ) : null}
    </View>
  );
}

function BarSegment({ hex, index, first, last }: { hex: string; index: number; first: boolean; last: boolean }) {
  const reduced = useReducedMotion();
  const p = useSharedValue(0);
  useEffect(() => {
    p.value = reduced
      ? withTiming(1, { duration: motion.reducedFade })
      : withDelay(120 + index * 60, withTiming(1, { duration: 600, easing: motion.outExpo }));
  }, [reduced, index, p]);
  const animated = useAnimatedStyle(() =>
    reduced ? { opacity: p.value } : { opacity: p.value, transform: [{ scaleY: 0.4 + p.value * 0.6 }] },
  );
  return (
    <Animated.View
      style={[
        styles.segment,
        { backgroundColor: hex },
        first && styles.segFirst,
        last && styles.segLast,
        animated,
      ]}
    />
  );
}

export function SectionTitle({ children, index, onInk }: { children: string; index?: string; onInk?: boolean }) {
  return (
    <View style={styles.sectionTitle}>
      {index ? <NumberTag label={index} tone={onInk ? 'light' : 'ink'} size={24} /> : null}
      <AppText variant="heading" color={onInk ? colors.onInk : colors.ink} accessibilityRole="header" style={styles.flex}>
        {children}
      </AppText>
    </View>
  );
}

/** Thin hairline divider. */
export function Rule({ onInk, style }: { onInk?: boolean; style?: StyleProp<ViewStyle> }) {
  return <View style={[styles.rule, { backgroundColor: onInk ? colors.inkLine : colors.line }, style]} />;
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  swatchWrap: { alignItems: 'center', gap: spacing.xs },
  swatch: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(35,24,22,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  swatchOnInk: { borderColor: 'rgba(239,233,227,0.2)' },
  swatchCaption: { fontSize: 9.5 },
  swatchRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  bar: { flexDirection: 'row', gap: 3 },
  segment: { flex: 1, borderRadius: 3 },
  segFirst: { borderTopLeftRadius: radii.md, borderBottomLeftRadius: radii.md },
  segLast: { borderTopRightRadius: radii.md, borderBottomRightRadius: radii.md },
  hexRow: { flexDirection: 'row', gap: 3, marginTop: 6 },
  hex: { flex: 1, textAlign: 'center', fontSize: 9 },
  sectionTitle: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  rule: { height: StyleSheet.hairlineWidth },
});
