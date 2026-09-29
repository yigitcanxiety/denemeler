'use client';

import clsx from 'clsx';
import { Check } from 'lucide-react';
import { useState } from 'react';
import { luminance } from '@/lib/color';

/**
 * Row of rounded swatches (DESIGN §3 "palette swatches"). Each swatch is a button that copies
 * its hex code; hex codes are printed under the swatches from `sm` up and the last copied code
 * is announced in a polite live region.
 */
export function SwatchBar({
  colors,
  label,
  copyLabel,
  copiedLabel,
  crossed = false,
  className,
}: {
  colors: string[];
  label: string;
  copyLabel: string;
  copiedLabel: string;
  crossed?: boolean;
  className?: string;
}) {
  const [copied, setCopied] = useState<string | null>(null);
  return (
    <div className={className}>
      <ul aria-label={label} className="flex gap-1.5">
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
                className="group flex w-full flex-col gap-1.5 rounded-[10px] text-left"
              >
                <span
                  className={clsx(
                    'relative block h-11 w-full overflow-hidden rounded-[10px] ring-1 ring-black/5 ring-inset transition-transform duration-200 group-hover:-translate-y-0.5 motion-reduce:transform-none',
                    crossed && 'opacity-80',
                  )}
                  style={{ backgroundColor: c }}
                >
                  {crossed && (
                    <span
                      aria-hidden
                      className={clsx('absolute top-1/2 left-1/2 h-[1.5px] w-[160%] -translate-x-1/2 -rotate-[50deg]', dark ? 'bg-white/85' : 'bg-ink/60')}
                    />
                  )}
                  {copied === hex && (
                    <span aria-hidden className={clsx('absolute inset-0 grid place-items-center', dark ? 'text-white' : 'text-ink')}>
                      <Check className="size-4" strokeWidth={2.5} />
                    </span>
                  )}
                </span>
                <span className="hidden truncate text-[10.5px] font-medium text-muted sm:block">{hex}</span>
              </button>
            </li>
          );
        })}
      </ul>
      <p aria-live="polite" className="mt-1.5 min-h-4 text-[11px] text-muted">
        {copied ? `${copiedLabel}: ${copied}` : ''}
      </p>
    </div>
  );
}
