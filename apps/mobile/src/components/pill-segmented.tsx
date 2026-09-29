import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View, type LayoutChangeEvent, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';

import { useLocale } from '@/hooks/use-i18n';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { upper } from '@/lib/ui-copy';
import { colors, fonts, motion, radii } from '@/theme';

import { IconButton } from './button';
import type { IconName } from './icon';
import { AppText } from './text';

export interface SegmentOption<K extends string> {
  key: K;
  label: string;
}

/**
 * BRIK pill segmented control: ink pill, the active segment is an accent-soft pill that springs
 * between positions (instant with reduce motion). `light` renders on a light card instead.
 */
export function PillSegmented<K extends string>({
  options,
  value,
  onChange,
  role = 'tablist',
  tone = 'ink',
  height = 52,
  style,
}: {
  options: SegmentOption<K>[];
  value: K;
  onChange: (key: K) => void;
  role?: 'tablist' | 'radiogroup';
  tone?: 'ink' | 'light';
  height?: number;
  style?: StyleProp<ViewStyle>;
}) {
  const locale = useLocale();
  const reduced = useReducedMotion();
  const [width, setWidth] = useState(0);
  const index = Math.max(0, options.findIndex((o) => o.key === value));
  const pad = 4;
  const segW = width > 0 ? (width - pad * 2) / options.length : 0;
  const x = useSharedValue(0);

  useEffect(() => {
    if (!segW) return;
    x.value = reduced ? withTiming(index * segW, { duration: 0 }) : withSpring(index * segW, motion.spring);
  }, [index, segW, reduced, x]);

  const indicator = useAnimatedStyle(() => ({ transform: [{ translateX: x.value }] }));
  const dark = tone === 'ink';

  return (
    <View
      style={[styles.track, { height, backgroundColor: dark ? colors.ink : colors.paperSunken }, style]}
      onLayout={(e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width)}
      accessibilityRole={role}
    >
      {segW ? (
        <Animated.View
          style={[
            styles.indicator,
            { width: segW, top: pad, bottom: pad, left: pad, backgroundColor: dark ? colors.accentSoft : colors.ink },
            indicator,
          ]}
        />
      ) : null}
      {options.map((option) => {
        const active = option.key === value;
        const fg = dark ? (active ? colors.ink : colors.onInk) : active ? colors.onInk : colors.ink;
        return (
          <Pressable
            key={option.key}
            onPress={() => onChange(option.key)}
            accessibilityRole={role === 'tablist' ? 'tab' : 'radio'}
            accessibilityState={{ selected: active, checked: role === 'radiogroup' ? active : undefined }}
            accessibilityLabel={option.label}
            style={styles.segment}
          >
            <AppText variant="monoLabel" color={fg} align="center" numberOfLines={1} style={styles.segmentText}>
              {upper(option.label, locale)}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

/** Bottom navigation: round icon button · pill segmented control · round icon button. */
export function BottomNav<K extends string>({
  left,
  right,
  ...segmented
}: {
  left: { icon: IconName; label: string; onPress: () => void };
  right: { icon: IconName; label: string; onPress: () => void };
  options: SegmentOption<K>[];
  value: K;
  onChange: (key: K) => void;
}) {
  return (
    <View style={styles.nav}>
      <IconButton icon={left.icon} label={left.label} onPress={left.onPress} size={52} />
      <PillSegmented {...segmented} style={styles.navPill} />
      <IconButton icon={right.icon} label={right.label} onPress={right.onPress} size={52} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: { flexDirection: 'row', borderRadius: radii.pill, padding: 4, alignItems: 'stretch' },
  indicator: { position: 'absolute', borderRadius: radii.pill },
  segment: { flex: 1, alignItems: 'center', justifyContent: 'center', minHeight: 44, paddingHorizontal: 6 },
  segmentText: { fontFamily: fonts.monoMedium, fontSize: 11.5, letterSpacing: 0.7 },
  nav: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  navPill: { flex: 1 },
});
