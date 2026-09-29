import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, type LayoutChangeEvent, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';

import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { colors, fonts, motion } from '@/theme';

const BASE = 20;
const TRACKING = -0.055; // em
const LINE = 1.08;
const OVERLAP = 0.17; // em pulled up between lines

/**
 * Giant tight-tracked grotesk that spans the full container width (the TONELLE wordmark, big
 * season names). Every line shares one size: the widest line fits the width exactly (capped by
 * `maxSize`). Letters slide up from a clip mask, staggered 40 ms. Reduce motion: quick fade.
 */
export function FitWordmark({
  lines,
  maxSize = 400,
  color = colors.ink,
  reveal = true,
  delay = 0,
  style,
  accessibilityLabel,
  fontFamily = fonts.display,
}: {
  lines: string[];
  maxSize?: number;
  color?: string;
  reveal?: boolean;
  delay?: number;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
  fontFamily?: string;
}) {
  const [width, setWidth] = useState(0);
  const [measured, setMeasured] = useState<Record<number, number>>({});
  const ready = width > 0 && lines.every((_, i) => (measured[i] ?? 0) > 0);
  const widest = Math.max(1, ...lines.map((_, i) => measured[i] ?? 1));
  const size = ready ? Math.min(maxSize, (width / widest) * BASE * 0.995) : 0;

  let charIndex = 0;
  return (
    <View
      style={style}
      onLayout={(e: LayoutChangeEvent) => setWidth(Math.floor(e.nativeEvent.layout.width))}
      accessible
      accessibilityRole="header"
      accessibilityLabel={accessibilityLabel ?? lines.join(' ')}
    >
      {/* Hidden measuring rows at a small base size. */}
      <View style={styles.measure} pointerEvents="none" accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
        {lines.map((line, i) => (
          <View
            key={`m${i}-${line}`}
            style={styles.row}
            onLayout={(e: LayoutChangeEvent) => {
              const w = e.nativeEvent.layout.width;
              setMeasured((m) => (m[i] === w ? m : { ...m, [i]: w }));
            }}
          >
            {[...line].map((ch, j) => (
              <Text key={j} allowFontScaling={false} style={[styles.letter, { fontFamily, fontSize: BASE, lineHeight: BASE * LINE, letterSpacing: BASE * TRACKING }]}>
                {ch}
              </Text>
            ))}
          </View>
        ))}
      </View>

      {ready
        ? lines.map((line, i) => (
            <View
              key={`${i}-${line}`}
              style={[styles.row, styles.clip, { height: size * LINE, marginTop: i === 0 ? 0 : -size * OVERLAP }]}
            >
              {[...line].map((ch, j) => (
                <Letter
                  key={j}
                  char={ch}
                  size={size}
                  color={color}
                  fontFamily={fontFamily}
                  delay={delay + (charIndex++) * 40}
                  reveal={reveal}
                />
              ))}
            </View>
          ))
        : lines.map((line, i) => <View key={`p${i}-${line}`} style={{ height: 1 }} />)}
    </View>
  );
}

function Letter({
  char,
  size,
  color,
  fontFamily,
  delay,
  reveal,
}: {
  char: string;
  size: number;
  color: string;
  fontFamily: string;
  delay: number;
  reveal: boolean;
}) {
  const reduced = useReducedMotion();
  const p = useSharedValue(reveal ? 0 : 1);
  useEffect(() => {
    if (!reveal) return;
    p.value = reduced
      ? withTiming(1, { duration: motion.reducedFade })
      : withDelay(delay, withTiming(1, { duration: 820, easing: motion.outExpo }));
  }, [reveal, reduced, delay, p]);
  const animated = useAnimatedStyle(() =>
    reduced ? { opacity: p.value } : { transform: [{ translateY: (1 - p.value) * size * 1.05 }] },
  );
  return (
    <Animated.Text
      allowFontScaling={false}
      style={[
        styles.letter,
        { fontFamily, fontSize: size, lineHeight: size * LINE, letterSpacing: size * TRACKING, color },
        animated,
      ]}
    >
      {char}
    </Animated.Text>
  );
}

const styles = StyleSheet.create({
  measure: { position: 'absolute', opacity: 0, left: 0, top: 0 },
  row: { flexDirection: 'row', alignSelf: 'flex-start' },
  clip: { overflow: 'hidden' },
  letter: { includeFontPadding: false, color: colors.ink },
});
