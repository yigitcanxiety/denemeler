'use client';

import clsx from 'clsx';
import { useState } from 'react';
import { luminance } from '@/lib/heat';

/**
 * Segmented swatch bar (DESIGN §5 "palette as a segmented swatch bar"). Each segment is a
 * button that copies its hex code; the hex codes are printed under the bar from `sm` up and
 * the last copied code is announced in a polite live region.
 */
export function SwatchBar({
  colors,
  label,
  copyLabel,
  copiedLabel,
  crossed = false,
  tone = 'ink',
  className,
}: {
  colors: string[];
  label: string;
  copyLabel: string;
  copiedLabel: string;
  crossed?: boolean;
  /** Surface the bar sits on (for the hex text colour). */
  tone?: 'ink' | 'paper';
  className?: string;
}) {
  const [copied, setCopied] = useState<string | null>(null);
  return (
    <div className={className}>
      <ul aria-label={label} className="flex gap-[3px]">
        {colors.map((c, i) => {
          const hex = c.toUpperCase();
          const dark = luminance(c) < 0.35;
          return (
            <li key={`${c}-${i}`} className="min-w-0 flex-1">
              <button
                type="button"
                title={`${copyLabel}: ${hex}`}
                aria-label={`${copyLabel}: ${label} ${hex}`}
                onClick={() => {
                  void navigator.clipboard?.writeText(hex).then(
                    () => {
                      setCopied(hex);
                      window.setTimeout(() => setCopied((v) => (v === hex ? null : v)), 1600);
                    },
                    () => undefined,
                  );
                }}
                className="group flex w-full flex-col gap-1.5 text-left"
              >
                <span
                  className={clsx(
                    'relative block h-14 w-full overflow-hidden transition-transform duration-200 group-hover:-translate-y-0.5 motion-reduce:transform-none',
                    i === 0 && 'rounded-l-[10px]',
                    i === colors.length - 1 && 'rounded-r-[10px]',
                  )}
                  style={{ backgroundColor: c }}
                >
                  {crossed && (
                    <span
                      aria-hidden
                      className={clsx('absolute top-1/2 left-1/2 h-px w-[160%] -translate-x-1/2 -rotate-[58deg]', dark ? 'bg-white/80' : 'bg-[#231816]/70')}
                    />
                  )}
                  {copied === hex && (
                    <span aria-hidden className={clsx('absolute inset-0 grid place-items-center font-mono text-[10px]', dark ? 'text-white' : 'text-[#231816]')}>
                      ✓
                    </span>
                  )}
                </span>
                <span
                  className={clsx(
                    'hidden truncate font-mono text-[10.5px] sm:block',
                    tone === 'ink' ? 'text-ink-inverse-muted' : 'text-ink-muted',
                  )}
                >
                  {hex}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      <p aria-live="polite" className={clsx('mt-2 min-h-4 font-mono text-[11px]', tone === 'ink' ? 'text-ink-inverse-muted' : 'text-ink-muted')}>
        {copied ? `${copiedLabel}: ${copied}` : ''}
      </p>
    </div>
  );
}
