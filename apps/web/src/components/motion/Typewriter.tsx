'use client';

import clsx from 'clsx';
import { useEffect, useRef } from 'react';
import { prefersReducedMotion } from './usePrefersReducedMotion';

/**
 * Mono annotation that types itself in (12 ms/char) the first time it scrolls into view.
 * The full text is server-rendered; the untyped remainder stays in the layout (transparent)
 * so nothing shifts. Screen readers get the whole sentence once.
 */
export function Typewriter({
  text,
  className,
  as: Tag = 'p',
  speed = 12,
  delay = 0,
}: {
  text: string;
  className?: string;
  as?: 'p' | 'span' | 'div';
  speed?: number;
  delay?: number;
}) {
  const typed = useRef<HTMLSpanElement>(null);
  const rest = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const a = typed.current;
    const b = rest.current;
    if (!a || !b || prefersReducedMotion() || typeof IntersectionObserver === 'undefined') return;
    let timer = 0;
    let first = true;
    const set = (n: number) => {
      a.textContent = text.slice(0, n);
      b.textContent = text.slice(n);
    };
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        if (first) {
          first = false;
          if (entry.isIntersecting && entry.boundingClientRect.top < window.innerHeight * 0.6) {
            io.disconnect();
            return;
          }
          set(0);
          if (!entry.isIntersecting) return;
        }
        if (!entry.isIntersecting) return;
        io.disconnect();
        let n = 0;
        const step = () => {
          n += 1;
          set(n);
          if (n < text.length) timer = window.setTimeout(step, speed);
        };
        timer = window.setTimeout(step, delay);
      },
      { rootMargin: '0px 0px -10% 0px' },
    );
    io.observe(a);
    return () => {
      io.disconnect();
      window.clearTimeout(timer);
      set(text.length);
    };
  }, [text, speed, delay]);

  return (
    <Tag className={clsx('mono', className)}>
      <span className="sr-only">{text}</span>
      <span aria-hidden>
        <span ref={typed}>{text}</span>
        <span ref={rest} className="opacity-0" />
      </span>
    </Tag>
  );
}
