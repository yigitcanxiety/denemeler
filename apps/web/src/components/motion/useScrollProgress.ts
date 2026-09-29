'use client';

import { useEffect, useState, type RefObject } from 'react';

/**
 * Tracks how far a tall (sticky) section has been scrolled through, 0 → 1, and derives a
 * step index. Writes `--p` on the element for CSS and only re-renders when the step changes.
 */
export function useScrollSteps(ref: RefObject<HTMLElement | null>, steps: number): number {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const p = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0;
      el.style.setProperty('--p', p.toFixed(4));
      setStep(Math.min(steps - 1, Math.floor(p * steps * 0.999)));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    frame = requestAnimationFrame(update);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(frame);
    };
  }, [ref, steps]);

  return step;
}
