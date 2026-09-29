import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef, useState } from 'react';
import { Image, StyleSheet, View, type GestureResponderEvent, type LayoutChangeEvent } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { colors, fonts, radii } from '@/theme';

import { Icon } from './icon';
import { AppText } from './text';
import { Pill } from './ui';

/**
 * Before/after comparison over the user's photo (DESIGN.md §3.8). The divider follows the finger
 * (responder gesture → Reanimated shared value); screen readers adjust it in 10 % steps.
 * Without an `after` image it shows the photo alone; `loading` adds a shimmer.
 */
export function BeforeAfter({
  before,
  after,
  height,
  loading,
  labels,
}: {
  before: string;
  after: string | null;
  height: number;
  loading?: boolean;
  labels: { before: string; after: string; ai: string; slider: string };
}) {
  const [width, setWidth] = useState(0);
  const [percent, setPercent] = useState(50);
  const x = useSharedValue(0);
  const drag = useRef({ width: 0, startX: 0, startPageX: 0 });

  const onLayout = (e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width;
    if (w === drag.current.width) return;
    drag.current.width = w;
    setWidth(w);
    x.set((w * percent) / 100);
  };

  const clamp = (v: number) => Math.max(0, Math.min(drag.current.width, v));
  // Responder handlers: the divider follows the finger from wherever the drag starts.
  const onGrant = (e: GestureResponderEvent) => {
    drag.current.startX = clamp(e.nativeEvent.locationX);
    drag.current.startPageX = e.nativeEvent.pageX;
    x.set(drag.current.startX);
  };
  const onMove = (e: GestureResponderEvent) => {
    x.set(clamp(drag.current.startX + e.nativeEvent.pageX - drag.current.startPageX));
  };
  const onRelease = () => {
    if (drag.current.width > 0) setPercent(Math.round((x.get() / drag.current.width) * 100));
  };

  const beforeStyle = useAnimatedStyle(() => ({ width: x.value }));
  const dividerStyle = useAnimatedStyle(() => ({ transform: [{ translateX: x.value - 1 }] }));
  const knobStyle = useAnimatedStyle(() => ({ transform: [{ translateX: x.value - 18 }] }));

  const adjust = (delta: number) => {
    const next = Math.max(0, Math.min(100, percent + delta));
    setPercent(next);
    x.set(withTiming((drag.current.width * next) / 100, { duration: 200 }));
  };

  if (!after) {
    return (
      <View style={[styles.frame, { height }]} onLayout={onLayout}>
        <Image source={{ uri: before }} style={StyleSheet.absoluteFill} resizeMode="cover" accessibilityIgnoresInvertColors />
        {loading ? <Shimmer /> : null}
      </View>
    );
  }

  return (
    <View
      style={[styles.frame, { height }]}
      onLayout={onLayout}
      accessible
      accessibilityRole="adjustable"
      accessibilityLabel={labels.slider}
      accessibilityValue={{ min: 0, max: 100, now: percent }}
      accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
      onAccessibilityAction={(e) => adjust(e.nativeEvent.actionName === 'increment' ? 10 : -10)}
      onStartShouldSetResponder={() => true}
      onMoveShouldSetResponder={() => true}
      onResponderTerminationRequest={() => false}
      onResponderGrant={onGrant}
      onResponderMove={onMove}
      onResponderRelease={onRelease}
    >
      <Image
        source={{ uri: after }}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
        accessibilityIgnoresInvertColors
      />
      <Animated.View style={[styles.beforeClip, beforeStyle]} pointerEvents="none">
        <Image
          source={{ uri: before }}
          style={{ width: width || 1, height }}
          resizeMode="cover"
          accessibilityIgnoresInvertColors
        />
      </Animated.View>
      <Animated.View style={[styles.divider, dividerStyle]} pointerEvents="none" />
      <Animated.View style={[styles.knob, { top: height / 2 - 18 }, knobStyle]} pointerEvents="none">
        <Icon name="back" size={12} color={colors.violet} strokeWidth={2.4} />
        <Icon name="chevronRight" size={12} color={colors.violet} strokeWidth={2.4} />
      </Animated.View>
      <View style={[styles.label, styles.labelLeft]} pointerEvents="none">
        <AppText style={styles.labelText}>{labels.before}</AppText>
      </View>
      <View style={[styles.label, styles.labelRight]} pointerEvents="none">
        <AppText style={styles.labelText}>{labels.after}</AppText>
      </View>
      <Pill tone="violet" icon="sparkle" label={labels.ai} style={styles.ai} />
      {loading ? <Shimmer /> : null}
    </View>
  );
}

/** Soft light band sweeping over the photo while a look renders (a steady veil with reduce motion). */
export function Shimmer() {
  const reduced = useReducedMotion();
  const p = useSharedValue(0);
  useEffect(() => {
    if (reduced) return;
    p.set(withRepeat(withTiming(1, { duration: 1400, easing: Easing.inOut(Easing.ease) }), -1, false));
  }, [p, reduced]);
  const band = useAnimatedStyle(() => ({ left: `${-100 + p.value * 200}%` }));
  return (
    <View style={[StyleSheet.absoluteFill, styles.veil]} pointerEvents="none">
      {reduced ? null : (
        <Animated.View style={[styles.band, band]}>
          <LinearGradient
            colors={['rgba(255,255,255,0)', 'rgba(255,255,255,0.55)', 'rgba(255,255,255,0)']}
            start={{ x: 0, y: 0.3 }}
            end={{ x: 1, y: 0.7 }}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  frame: { borderRadius: radii.xl, overflow: 'hidden', backgroundColor: colors.mist },
  beforeClip: { position: 'absolute', left: 0, top: 0, bottom: 0, overflow: 'hidden' },
  divider: { position: 'absolute', top: 0, bottom: 0, left: 0, width: 2, backgroundColor: colors.paper },
  knob: {
    position: 'absolute',
    left: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.paper,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  label: {
    position: 'absolute',
    top: 12,
    backgroundColor: colors.floatBg,
    borderRadius: radii.pill,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  labelLeft: { left: 12 },
  labelRight: { right: 12 },
  labelText: { fontFamily: fonts.semibold, fontSize: 11, lineHeight: 15, color: colors.ink },
  ai: { position: 'absolute', right: 12, bottom: 12 },
  band: { position: 'absolute', top: 0, bottom: 0, width: '100%' },
  veil: { backgroundColor: 'rgba(237,232,255,0.35)', overflow: 'hidden' },
});
