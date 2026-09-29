import { useEffect, useRef, useState } from 'react';
import { Text, type StyleProp, type TextStyle } from 'react-native';

import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { paddedCounter } from '@/lib/ui-copy';
import { colors, typography } from '@/theme';

const outExpo = (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));

/** Animates a number from its previous value to `value` (out-expo). Instant with reduce motion. */
export function useCountUp(value: number, duration = 1200, delay = 0): number {
  const reduced = useReducedMotion();
  const [shown, setShown] = useState(0);
  const from = useRef(0);

  useEffect(() => {
    if (reduced) {
      from.current = value;
      return;
    }
    let raf = 0;
    let start = 0;
    const startValue = from.current;
    const timer = setTimeout(() => {
      const tick = (now: number) => {
        if (!start) start = now;
        const p = Math.min(1, (now - start) / duration);
        const next = startValue + (value - startValue) * outExpo(p);
        from.current = next;
        setShown(next);
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, delay);
    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(raf);
    };
  }, [value, duration, delay, reduced]);

  return reduced ? value : shown;
}

/**
 * BRIK big light numeral that counts up. `pad` renders leading zeros dimmed ("000%" preloader
 * style). The accessible label is always the final value.
 */
export function BigNumber({
  value,
  suffix = '',
  prefix = '',
  pad,
  size = 56,
  color = colors.onInk,
  dimColor,
  duration,
  delay,
  style,
}: {
  value: number;
  suffix?: string;
  prefix?: string;
  pad?: number;
  size?: number;
  color?: string;
  dimColor?: string;
  duration?: number;
  delay?: number;
  style?: StyleProp<TextStyle>;
}) {
  const shown = useCountUp(value, duration, delay);
  const rounded = Math.round(shown);
  const final = `${prefix}${Math.round(value)}${suffix}`;
  const textStyle = [
    typography.numeral,
    { fontSize: size, lineHeight: Math.round(size * 1.04), letterSpacing: -size * 0.04, color },
    style,
  ];
  if (pad) {
    const { lead, digits } = paddedCounter(rounded, pad);
    return (
      <Text style={textStyle} accessibilityLabel={final} maxFontSizeMultiplier={1.2}>
        {prefix}
        <Text style={{ color: dimColor ?? withAlpha(color, 0.3) }}>{lead}</Text>
        {digits}
        {suffix}
      </Text>
    );
  }
  return (
    <Text style={textStyle} accessibilityLabel={final} maxFontSizeMultiplier={1.2}>
      {prefix}
      {rounded}
      {suffix}
    </Text>
  );
}

function withAlpha(hex: string, alpha: number): string {
  const m = /^#([0-9a-f]{6})$/i.exec(hex);
  if (!m) return hex;
  const v = parseInt(m[1] as string, 16);
  return `rgba(${(v >> 16) & 255},${(v >> 8) & 255},${v & 255},${alpha})`;
}
