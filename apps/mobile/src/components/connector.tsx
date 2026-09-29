import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';

import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { colors, motion } from '@/theme';

/**
 * Neurotrace connector bar: a 1 px accent line from the screen edge, ending in a filled accent
 * "plug" at the edge and a small accent square with `ıll` glyph bars near the object. Slides in
 * from its edge (fade only with reduce motion). Decorative.
 */
export function Connector({ side, delay = 0, width = 80 }: { side: 'left' | 'right'; delay?: number; width?: number }) {
  const reduced = useReducedMotion();
  const p = useSharedValue(0);
  useEffect(() => {
    p.value = reduced
      ? withTiming(1, { duration: motion.reducedFade })
      : withDelay(delay, withTiming(1, { duration: 900, easing: motion.outExpo }));
  }, [reduced, delay, p]);
  const dir = side === 'left' ? -1 : 1;
  const animated = useAnimatedStyle(() =>
    reduced ? { opacity: p.value } : { opacity: p.value, transform: [{ translateX: (1 - p.value) * dir * 60 }] },
  );
  const plug = <View style={styles.plug} />;
  const square = (
    <View style={styles.square}>
      <View style={[styles.glyph, { height: 4 }]} />
      <View style={[styles.glyph, { height: 7 }]} />
      <View style={[styles.glyph, { height: 10 }]} />
    </View>
  );
  return (
    <Animated.View
      style={[styles.row, { width }, animated]}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      pointerEvents="none"
    >
      {side === 'left' ? plug : square}
      <View style={styles.line} />
      {side === 'left' ? square : plug}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  plug: { width: 12, height: 6, backgroundColor: colors.accent },
  line: { flex: 1, height: 1, backgroundColor: colors.accent },
  square: {
    width: 18,
    height: 18,
    borderWidth: 1,
    borderColor: colors.accent,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 2,
    paddingBottom: 3,
  },
  glyph: { width: 1.5, backgroundColor: colors.accent },
});
