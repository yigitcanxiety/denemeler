import { useEffect, type ReactNode } from 'react';
import { Pressable, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { motion } from '@/theme';

/**
 * Entrance: 8 px rise + fade with the out-expo curve (DESIGN.md §3.9). With reduce motion it is
 * an opacity-only fade of ≤150 ms and no transform.
 */
export function Reveal({
  children,
  delay = 0,
  distance = 8,
  duration = motion.reveal,
  style,
}: {
  children: ReactNode;
  delay?: number;
  distance?: number;
  duration?: number;
  style?: StyleProp<ViewStyle>;
}) {
  const reduced = useReducedMotion();
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = reduced
      ? withTiming(1, { duration: motion.reducedFade })
      : withDelay(delay, withTiming(1, { duration, easing: motion.outExpo }));
  }, [delay, duration, progress, reduced]);

  const animated = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: reduced ? [] : [{ translateY: (1 - progress.value) * distance }],
  }));

  return <Animated.View style={[style, animated]}>{children}</Animated.View>;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export interface PressableScaleProps extends Omit<PressableProps, 'style'> {
  style?: StyleProp<ViewStyle>;
  /** Scale while pressed (default 0.97). */
  pressedScale?: number;
  children?: ReactNode;
}

/** Pressable that springs down to 0.97 while pressed (no transform with reduce motion). */
export function PressableScale({ style, pressedScale = motion.pressScale, onPressIn, onPressOut, ...rest }: PressableScaleProps) {
  const reduced = useReducedMotion();
  const scale = useSharedValue(1);
  const pressed = useSharedValue(0);

  const animated = useAnimatedStyle(() =>
    reduced ? { opacity: 1 - pressed.value * 0.2 } : { transform: [{ scale: scale.value }] },
  );

  return (
    <AnimatedPressable
      {...rest}
      onPressIn={(e) => {
        if (reduced) pressed.set(1);
        else scale.set(withSpring(pressedScale, motion.spring));
        onPressIn?.(e);
      }}
      onPressOut={(e) => {
        if (reduced) pressed.set(0);
        else scale.set(withSpring(1, motion.spring));
        onPressOut?.(e);
      }}
      style={[style, animated]}
    />
  );
}
