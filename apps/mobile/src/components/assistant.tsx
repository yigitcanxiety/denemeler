import { useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { AccessibilityInfo, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Defs, Ellipse, G, LinearGradient, Path, Stop } from 'react-native-svg';

import { Icon } from '@/components/icon';
import { PressableScale } from '@/components/motion';
import { AppText } from '@/components/text';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { useT } from '@/hooks/use-i18n';
import { PERSISTENT_SCREEN, TIPS, type TipScreen } from '@/lib/assistant';
import { useAppStore } from '@/store/app-store';
import { colors, fonts, GUTTER, motion, radii, shadows, spacing } from '@/theme';

const INK = '#2A2140';
/** Pan colours of the app icon: peach, rose, orchid, violet. */
const PANS = ['#F2B08A', '#E4718A', '#C98BE0', '#7457F5'] as const;

/**
 * The helper ("asistan"): the app icon's lavender glass makeup compact with a tiny face, drawn in
 * code. Idle bob (±3 px, 2.4 s loop), a blink every ~4 s and a hop + tilt whenever `hop` changes.
 * Purely decorative (hidden from accessibility) and completely static with reduced motion.
 */
export function AssistantCharacter({ size = 56, hop = 0 }: { size?: number; hop?: number }) {
  const reduced = useReducedMotion();
  const bob = useSharedValue(0);
  const blink = useSharedValue(0);
  const jump = useSharedValue(0);
  const tilt = useSharedValue(0);

  useEffect(() => {
    if (reduced) return;
    bob.value = withRepeat(withTiming(1, { duration: 1200, easing: Easing.inOut(Easing.sin) }), -1, true);
    blink.value = withRepeat(
      withSequence(withDelay(3800, withTiming(1, { duration: 70 })), withTiming(0, { duration: 110 })),
      -1,
    );
    return () => {
      cancelAnimation(bob);
      cancelAnimation(blink);
      bob.value = 0;
      blink.value = 0;
    };
  }, [reduced, bob, blink]);

  useEffect(() => {
    if (reduced || hop === 0) return;
    jump.value = withSequence(withTiming(1, { duration: 140, easing: Easing.out(Easing.quad) }), withSpring(0, { damping: 8, stiffness: 260 }));
    tilt.value = withSequence(
      withTiming(-1, { duration: 110 }),
      withTiming(0.7, { duration: 130 }),
      withSpring(0, { damping: 10, stiffness: 200 }),
    );
  }, [hop, reduced, jump, tilt]);

  const body = useAnimatedStyle(() => ({
    transform: [
      { translateY: (bob.value * 2 - 1) * 3 - jump.value * 10 },
      { rotate: `${tilt.value * 9}deg` },
    ],
  }));
  const eyes = useAnimatedStyle(() => ({ transform: [{ scaleY: 1 - 0.92 * blink.value }] }));

  const k = size / 64;
  return (
    <Animated.View
      style={[{ width: size, height: size }, reduced ? null : body]}
      pointerEvents="none"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <Svg width={size} height={size} viewBox="0 0 64 64">
        <Defs>
          <LinearGradient id="ast-rim" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor="#FFFFFF" stopOpacity={0.95} />
            <Stop offset="0.5" stopColor="#DCD0FF" stopOpacity={0.8} />
            <Stop offset="1" stopColor="#F7D6EE" stopOpacity={0.9} />
          </LinearGradient>
          <LinearGradient id="ast-body" x1="0.2" y1="0" x2="0.8" y2="1">
            <Stop offset="0" stopColor="#EDE8FF" />
            <Stop offset="1" stopColor="#FFFFFF" />
          </LinearGradient>
        </Defs>
        {/* Translucent pearly rim, then the lavender glass lid. */}
        <Circle cx={32} cy={32} r={30} fill="url(#ast-rim)" stroke="#C9B8FF" strokeOpacity={0.55} strokeWidth={1} />
        <Circle cx={32} cy={32} r={25.5} fill="url(#ast-body)" stroke="#D9CEFF" strokeWidth={0.8} />
        <Path d="M13 24 A21 21 0 0 1 26 12" stroke="#FFFFFF" strokeWidth={2.6} strokeLinecap="round" fill="none" opacity={0.9} />
        <Circle cx={47} cy={15.5} r={1.3} fill="#FFFFFF" />
        {/* Face: blush and smile (the eyes are a separate layer so they can blink). */}
        <Ellipse cx={18.5} cy={34} rx={4} ry={2.4} fill="#F58FA9" opacity={0.5} />
        <Ellipse cx={45.5} cy={34} rx={4} ry={2.4} fill="#F58FA9" opacity={0.5} />
        <Path d="M28 35.2 Q32 39.2 36 35.2" stroke={INK} strokeWidth={1.8} strokeLinecap="round" fill="none" />
        {/* Four tiny pans along the bottom. */}
        {PANS.map((fill, i) => (
          <G key={fill} x={20.5 + i * 7.67}>
            <Circle cy={47.5} r={3.6} fill={fill} stroke="#FFFFFF" strokeOpacity={0.8} strokeWidth={0.8} />
            <Circle cx={-1} cy={46.4} r={1.1} fill="#FFFFFF" opacity={0.5} />
          </G>
        ))}
      </Svg>
      <Animated.View
        style={[{ position: 'absolute', left: 0, top: 22 * k, width: size, height: 11 * k }, reduced ? null : eyes]}
      >
        <Svg width={size} height={11 * k} viewBox="0 22 64 11">
          <Ellipse cx={24.5} cy={27.5} rx={2.1} ry={2.9} fill={INK} />
          <Ellipse cx={39.5} cy={27.5} rx={2.1} ry={2.9} fill={INK} />
          <Circle cx={25.2} cy={26.5} r={0.7} fill="#FFFFFF" />
          <Circle cx={40.2} cy={26.5} r={0.7} fill="#FFFFFF" />
        </Svg>
      </Animated.View>
    </Animated.View>
  );
}

export interface AssistantProps {
  screen: TipScreen;
  /** Screen sits outside the tab bar (adds the bottom safe-area inset). */
  stack?: boolean;
  /** Small bar under the header instead of the bottom-right corner (camera). */
  compact?: boolean;
}

/**
 * Floating helper for one screen: shows that screen's tips the first time it is visited, then
 * hides (Home keeps a small replay button). Render it as a sibling after the screen content; it
 * is an absolute overlay below modals, so it never appears over the paywall, consent or share.
 */
export function Assistant({ screen, stack = false, compact = false }: AssistantProps) {
  const t = useT();
  const insets = useSafeAreaInsets();
  const enabled = useAppStore((s) => s.tipsEnabled);
  const seen = useAppStore((s) => s.seenTips[screen] === true);
  const markTipSeen = useAppStore((s) => s.markTipSeen);
  const [focused, setFocused] = useState(false);
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [hop, setHop] = useState(0);
  const keys = TIPS[screen];
  const text = t(keys[Math.min(index, keys.length - 1)]!);

  useFocusEffect(
    useCallback(() => {
      setFocused(true);
      return () => {
        setFocused(false);
        setOpen(false);
      };
    }, []),
  );

  // First visit: let the screen settle, then open the tips.
  useEffect(() => {
    if (!enabled || !focused || seen) return;
    const timer = setTimeout(() => {
      setIndex(0);
      setOpen(true);
      setHop((h) => h + 1);
    }, 700);
    return () => clearTimeout(timer);
  }, [enabled, focused, seen]);

  useEffect(() => {
    if (open) void AccessibilityInfo.announceForAccessibility?.(text);
  }, [open, text]);

  if (!enabled || !focused) return null; // `open` is reset on blur; disabling hides the bubble here
  const persistent = screen === PERSISTENT_SCREEN;
  if (!open && !persistent) return null;

  const dismiss = () => {
    setOpen(false);
    markTipSeen(screen);
  };
  const next = () => {
    setIndex((i) => i + 1);
    setHop((h) => h + 1);
  };
  const replay = () => {
    setIndex(0);
    setOpen(true);
    setHop((h) => h + 1);
  };
  const last = index >= keys.length - 1;
  const size = compact ? 40 : open ? 56 : 44;

  return (
    <View
      pointerEvents="box-none"
      style={[
        styles.layer,
        compact
          ? { top: insets.top + spacing.sm, left: 64, alignItems: 'flex-start' }
          : { bottom: (stack ? insets.bottom : 0) + spacing.md, alignItems: 'flex-end' },
      ]}
    >
      {open ? (
        <TipBubble
          text={text}
          step={index + 1}
          total={keys.length}
          last={last}
          compact={compact}
          onNext={next}
          onDismiss={dismiss}
        />
      ) : null}
      <PressableScale
        onPress={replay}
        accessibilityRole="button"
        accessibilityLabel={t('assistant.replay')}
        hitSlop={6}
        style={open ? styles.charOpen : styles.charIdle}
      >
        <AssistantCharacter size={size} hop={hop} />
      </PressableScale>
    </View>
  );
}

function TipBubble({
  text,
  step,
  total,
  last,
  compact,
  onNext,
  onDismiss,
}: {
  text: string;
  step: number;
  total: number;
  last: boolean;
  compact: boolean;
  onNext: () => void;
  onDismiss: () => void;
}) {
  const t = useT();
  const reduced = useReducedMotion();
  const appear = useSharedValue(0);

  useEffect(() => {
    appear.value = reduced
      ? withTiming(1, { duration: motion.reducedFade })
      : withSpring(1, { damping: 14, stiffness: 200, mass: 0.8 });
  }, [appear, reduced]);

  const animated = useAnimatedStyle(() => ({
    opacity: Math.min(1, appear.value * 1.6),
    transform: reduced ? [] : [{ scale: 0.82 + 0.18 * appear.value }],
  }));

  const primary = <MiniButton label={last ? t('assistant.gotIt') : t('assistant.next')} onPress={last ? onDismiss : onNext} primary />;

  return (
    <Animated.View
      style={[styles.bubble, { transformOrigin: compact ? 'top right' : 'bottom right' }, animated]}
      accessibilityLiveRegion="polite"
    >
      {compact ? (
        <View style={styles.compactRow}>
          <AppText style={styles.compactText} numberOfLines={2}>
            {text}
          </AppText>
          {primary}
        </View>
      ) : (
        <>
          <AppText style={styles.text}>{text}</AppText>
          <View style={styles.footer}>
            <AppText variant="caption">{total > 1 ? `${step}/${total}` : ''}</AppText>
            <View style={styles.actions}>
              {last ? null : <MiniButton label={t('assistant.gotIt')} onPress={onDismiss} />}
              {primary}
            </View>
          </View>
        </>
      )}
      <PressableScale
        onPress={onDismiss}
        accessibilityRole="button"
        accessibilityLabel={t('assistant.close')}
        hitSlop={11}
        style={styles.close}
      >
        <Icon name="close" size={12} color={colors.muted} strokeWidth={2.2} />
      </PressableScale>
      <View style={[styles.tail, compact ? styles.tailTop : styles.tailBottom]} />
    </Animated.View>
  );
}

function MiniButton({ label, onPress, primary }: { label: string; onPress: () => void; primary?: boolean }) {
  return (
    <PressableScale
      onPress={onPress}
      accessibilityRole="button"
      hitSlop={{ top: 7, bottom: 7, left: 2, right: 2 }}
      style={[styles.mini, primary && styles.miniPrimary]}
    >
      <AppText style={[styles.miniText, primary && styles.miniTextPrimary]} numberOfLines={1}>
        {label}
      </AppText>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  layer: {
    position: 'absolute',
    left: GUTTER,
    right: GUTTER,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  charOpen: { width: 56, height: 56 },
  charIdle: { opacity: 0.92 },
  bubble: {
    flexShrink: 1,
    maxWidth: 260,
    gap: 8,
    backgroundColor: colors.paper,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radii.card,
    paddingHorizontal: 14,
    paddingVertical: 12,
    ...shadows.float,
  },
  text: { fontFamily: fonts.medium, fontSize: 14, lineHeight: 20, color: colors.ink },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  actions: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  compactRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  compactText: { flex: 1, fontFamily: fonts.medium, fontSize: 12.5, lineHeight: 16, color: colors.ink },
  mini: { minHeight: 30, paddingHorizontal: 12, borderRadius: radii.pill, alignItems: 'center', justifyContent: 'center' },
  miniPrimary: { backgroundColor: colors.violet },
  miniText: { fontFamily: fonts.semibold, fontSize: 12.5, lineHeight: 16, color: colors.muted },
  miniTextPrimary: { color: colors.onViolet },
  close: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.paper,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tail: {
    position: 'absolute',
    right: -6,
    width: 12,
    height: 12,
    backgroundColor: colors.paper,
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderColor: colors.line,
    transform: [{ rotate: '45deg' }],
  },
  tailBottom: { bottom: 20 },
  tailTop: { top: 20 },
});
