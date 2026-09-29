'use client';

import clsx from 'clsx';
import { useState, type ReactNode } from 'react';

type SwatchProps = {
  color: string;
  size?: 'sm' | 'md' | 'lg';
  /** Accessible name; the hex code is appended. */
  label?: string;
  /** Show a copy-to-clipboard button with this tooltip text. */
  copyLabel?: string;
  copiedLabel?: string;
  showHex?: boolean;
  crossed?: boolean;
  className?: string;
};

const SIZES = { sm: 'size-7', md: 'size-11', lg: 'size-14' } as const;

export function Swatch({
  color,
  size = 'md',
  label,
  copyLabel,
  copiedLabel,
  showHex = false,
  crossed = false,
  className,
}: SwatchProps) {
  const [copied, setCopied] = useState(false);
  const hex = color.toUpperCase();
  const name = label ? `${label} ${hex}` : hex;

  const dot = (
    <span
      aria-hidden
      className={clsx(
        'relative block shrink-0 rounded-full ring-1 ring-black/5 ring-inset shadow-soft',
        SIZES[size],
        crossed &&
          'after:absolute after:inset-0 after:m-auto after:h-[2px] after:w-[120%] after:-translate-x-[8%] after:rotate-45 after:rounded after:bg-surface-raised/90',
      )}
      style={{ backgroundColor: color }}
    />
  );

  const body = (
    <>
      {dot}
      {showHex && <span className="font-mono text-[0.7rem] tracking-tight text-ink-muted">{copied ? copiedLabel : hex}</span>}
    </>
  );

  if (!copyLabel) {
    return (
      <span role="img" aria-label={name} className={clsx('inline-flex flex-col items-center gap-1', className)}>
        {body}
      </span>
    );
  }

  return (
    <button
      type="button"
      title={copyLabel}
      aria-label={`${copyLabel}: ${name}`}
      className={clsx(
        'inline-flex flex-col items-center gap-1 rounded-md p-0.5 transition-transform hover:-translate-y-0.5',
        className,
      )}
      onClick={() => {
        void navigator.clipboard?.writeText(hex).then(
          () => {
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1200);
          },
          () => undefined,
        );
      }}
    >
      {body}
    </button>
  );
}

export function SwatchRow({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={clsx('flex flex-wrap gap-2.5', className)}>{children}</div>;
}
