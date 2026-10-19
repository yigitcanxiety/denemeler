import { LinearGradient } from 'expo-linear-gradient';
import { useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle, Defs, RadialGradient, Stop } from 'react-native-svg';

import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { haptic, playSound } from '@/lib/feedback';
import { colors } from '@/theme';

import { SparkleBurst } from './sparkle-burst';
import { AppText } from './text';

/** Matches the native splash (app.config.ts) so the hand-off is invisible. */
export const INTRO_BG = '#F3EFFD';
export const INTRO_PALETTE_SIZE = 160;
const PALETTE = require('../../assets/images/palette.png');
const RAYS = 12;

/**
 * Opening: the palette from the logo spins, throws out light and sparkles and vanishes into a
 * soft flash, the wordmark rises, then everything fades into the app. ~2.5 s, tap to skip.
 * With reduce motion: a short static logo and a fade.
 */
export function Intro({ onDone }: { onDone: () => void }) {
  const reduced = useReducedMotion();
  const spin = useSharedValue(0);
  const palette = useSharedValue(1);
  const light = useSharedValue(0);
  const flash = useSharedValue(0);
  const word = useSharedValue(0);
  const veil = useSharedValue(1);

  const finish = (fast = false) => {
    veil.value = withTiming(0, { duration: fast ? 180 : 420, easing: Easing.out(Easing.quad) }, (done) => {
      if (done) runOnJS(onDone)();
    });
  };

  useEffect(() => {
    playSound('intro', 0.9);
    haptic.soft();
    if (reduced) {
      word.value = withTiming(1, { duration: 150 });
      const timer = setTimeout(() => finish(), 800);
      return () => clearTimeout(timer);
    }
    const inOut = Easing.bezier(0.65, 0, 0.35, 1);
    spin.value = withTiming(1, { duration: 950, easing: inOut });
    palette.value = withSequence(
      withTiming(1.12, { duration: 600, easing: inOut }),
      withDelay(350, withTiming(0, { duration: 330, easing: Easing.in(Easing.cubic) })),
    );
    light.value = withDelay(500, withSequence(withTiming(1, { duration: 450 }), withDelay(250, withTiming(0, { duration: 700 }))));
    flash.value = withDelay(950, withTiming(1, { duration: 600, easing: Easing.out(Easing.cubic) }));
    word.value = withDelay(1200, withTiming(1, { duration: 500, easing: Easing.out(Easing.cubic) }));
    const timers = [
      setTimeout(() => haptic.thud(), 600),
      setTimeout(() => haptic.soft(), 1200),
      setTimeout(() => finish(), 2100),
    ];
    return () => timers.forEach(clearTimeout);
    // One run per mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced]);

  const paletteStyle = useAnimatedStyle(() => ({
    opacity: Math.min(1, palette.value * 1.4),
    transform: [{ rotate: `${spin.value * 360}deg` }, { scale: palette.value }],
  }));
  const glowStyle = useAnimatedStyle(() => ({ opacity: light.value, transform: [{ scale: 0.7 + light.value * 0.5 }] }));
  const raysStyle = useAnimatedStyle(() => ({
    opacity: light.value * 0.9,
    transform: [{ rotate: `${spin.value * 90}deg` }, { scale: 0.5 + light.value * 0.9 }],
  }));
  const flashStyle = useAnimatedStyle(() => ({
    opacity: (1 - flash.value) * (flash.value > 0 ? 0.85 : 0),
    transform: [{ scale: 0.4 + flash.value * 3 }],
  }));
  const wordStyle = useAnimatedStyle(() => ({ opacity: word.value, transform: [{ translateY: (1 - word.value) * 14 }] }));
  const veilStyle = useAnimatedStyle(() => ({ opacity: veil.value }));

  return (
    <Animated.View style={[StyleSheet.absoluteFill, styles.root, veilStyle]}>
      <Pressable style={[StyleSheet.absoluteFill, styles.center]} onPress={() => finish(true)} accessibilityLabel="Tonelle">
        <Animated.View style={[styles.layer, glowStyle]}>
          <Svg width={560} height={560}>
            <Defs>
              <RadialGradient id="glow" cx="50%" cy="50%" r="50%">
                <Stop offset="0" stopColor="#FFFFFF" stopOpacity={1} />
                <Stop offset="0.35" stopColor={colors.violet2} stopOpacity={0.45} />
                <Stop offset="1" stopColor={colors.violet2} stopOpacity={0} />
              </RadialGradient>
            </Defs>
            <Circle cx={280} cy={280} r={280} fill="url(#glow)" />
          </Svg>
        </Animated.View>

        <Animated.View style={[styles.layer, styles.rays, raysStyle]}>
          {Array.from({ length: RAYS }, (_, i) => (
            <View key={i} style={[styles.rayArm, { transform: [{ rotate: `${(360 / RAYS) * i}deg` }] }]}>
              <LinearGradient
                colors={['rgba(255,255,255,0)', i % 2 ? 'rgba(255,255,255,0.95)' : 'rgba(199,155,242,0.8)', 'rgba(255,255,255,0)']}
                style={[styles.ray, i % 2 ? styles.rayLong : null]}
              />
            </View>
          ))}
        </Animated.View>

        <Animated.View style={[styles.layer, styles.flash, flashStyle]} />

        <SparkleBurst play={reduced ? 0 : 1} count={22} radius={170} delay={560} duration={1100} />

        <Animated.Image source={PALETTE} style={[styles.palette, paletteStyle]} accessibilityIgnoresInvertColors />

        <Animated.View style={[styles.word, wordStyle]}>
          <AppText variant="display" style={styles.wordText} accessibilityRole="header">
            Tonelle
          </AppText>
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: { backgroundColor: INTRO_BG, zIndex: 1000, elevation: 1000 },
  center: { alignItems: 'center', justifyContent: 'center' },
  layer: { position: 'absolute' },
  rays: { width: 440, height: 440, alignItems: 'center', justifyContent: 'center' },
  rayArm: { position: 'absolute', width: 440, height: 440, alignItems: 'center' },
  ray: { width: 3, height: 150, borderRadius: 2 },
  rayLong: { width: 2, height: 200 },
  flash: { width: 200, height: 200, borderRadius: 100, borderWidth: 6, borderColor: '#FFFFFF', backgroundColor: 'rgba(255,255,255,0.35)' },
  palette: { width: INTRO_PALETTE_SIZE, height: INTRO_PALETTE_SIZE },
  word: { position: 'absolute', alignItems: 'center' },
  wordText: { fontSize: 46, lineHeight: 52, color: colors.ink, letterSpacing: -0.9 },
});
