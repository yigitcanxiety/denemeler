'use client';

import { useEffect, useRef } from 'react';
import { prefersReducedMotion } from './usePrefersReducedMotion';

function format(value: number, decimals: number, locale: string, pad: number) {
  const s = new Intl.NumberFormat(locale, { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(value);
  return pad ? s.padStart(pad, '0') : s;
}

/**
 * Big numeral that counts up once when it scrolls into view. The final value is rendered
 * on the server (crawlers and no-JS see it); numbers already on screen at load don't animate.
 */
export function BigNumber({
  value,
  decimals = 0,
  prefix = '',
  suffix = '',
  locale = 'en',
  pad = 0,
  duration = 1100,
  className,
}: {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  locale?: string;
  pad?: number;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const final = `${prefix}${format(value, decimals, locale, pad)}${suffix}`;

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion() || typeof IntersectionObserver === 'undefined') return;
    let frame = 0;
    let first = true;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        if (first) {
          first = false;
          if (entry.isIntersecting) {
            io.disconnect();
            return;
          }
          el.textContent = `${prefix}${format(0, decimals, locale, pad)}${suffix}`;
          return;
        }
        if (!entry.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / duration);
          const eased = 1 - (1 - t) ** 4;
          el.textContent = `${prefix}${format(value * eased, decimals, locale, pad)}${suffix}`;
          if (t < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(frame);
      el.textContent = final;
    };
  }, [value, decimals, prefix, suffix, locale, pad, duration, final]);

  return (
    <span className={className}>
      <span className="sr-only">{final}</span>
      <span ref={ref} aria-hidden>
        {final}
      </span>
    </span>
  );
}
