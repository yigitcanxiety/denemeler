import clsx from 'clsx';
import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';

/** How a decorative element animates in: on page load (CSS), when scrolled into view (IO), or not at all. */
export type EnterMode = 'intro' | 'scroll' | 'none';

const ms = (n: number) => ({ '--d': `${n}ms` }) as CSSProperties;

/* ------------------------------------------------------------------ */
/* ConstructionGrid: hairline columns (4 → 6 → 8) + optional rows      */
/* ------------------------------------------------------------------ */

export function ConstructionGrid({
  className,
  enter = 'scroll',
  rows = [],
  delay = 0,
}: {
  className?: string;
  enter?: EnterMode;
  /** Horizontal hairlines, as CSS `top` values (e.g. '38%', '420px'). */
  rows?: string[];
  delay?: number;
}) {
  return (
    <div aria-hidden className={clsx('pointer-events-none absolute inset-0 overflow-hidden', className)}>
      <div className="cgrid">
        {Array.from({ length: 8 }, (_, i) => (
          <i
            key={i}
            className={enter === 'intro' ? 'intro-grow-y' : undefined}
            data-grow={enter === 'scroll' ? '' : undefined}
            style={ms(delay + i * 60)}
          />
        ))}
      </div>
      {rows.map((top, i) => (
        <span
          key={top}
          className={clsx('hline', enter === 'intro' && 'intro-grow-x')}
          style={{ top, ...ms(delay + 200 + i * 90) }}
        />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* AccentCircle: a big construction circle that draws itself          */
/* ------------------------------------------------------------------ */

export function AccentCircle({
  className,
  style,
  tone = 'accent',
  enter = 'scroll',
  delay = 0,
  strokeWidth = 1,
}: {
  className?: string;
  style?: CSSProperties;
  tone?: 'accent' | 'line';
  enter?: EnterMode;
  delay?: number;
  strokeWidth?: number;
}) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 100 100"
      className={clsx('pointer-events-none absolute overflow-visible', enter === 'intro' && 'intro-draw', className)}
      data-draw={enter === 'scroll' ? '' : undefined}
      style={style}
    >
      <circle
        className="draw"
        cx="50"
        cy="50"
        r="49.8"
        fill="none"
        pathLength={1}
        transform="rotate(-90 50 50)"
        stroke={tone === 'accent' ? 'var(--color-accent)' : 'var(--color-line-strong)'}
        strokeWidth={strokeWidth}
        vectorEffect="non-scaling-stroke"
        style={ms(delay)}
      />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* ConnectorBar: plug ▬ ─────────── [ıll]                              */
/* ------------------------------------------------------------------ */

export function SignalGlyph({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 22 22" className={className}>
      <rect width="22" height="22" rx="1.5" fill="var(--color-accent)" />
      <rect x="6.5" y="9" width="1.6" height="6" fill="#fff" />
      <rect x="10.2" y="6" width="1.6" height="10" fill="#fff" />
      <rect x="13.9" y="7.5" width="1.6" height="8" fill="#fff" />
    </svg>
  );
}

/** Thin accent line from a screen edge with a filled "plug" and a 22px `ıll` square at the inner end. */
export function ConnectorBar({
  from = 'left',
  className,
  enter = 'intro',
  delay = 0,
}: {
  from?: 'left' | 'right';
  className?: string;
  enter?: EnterMode;
  delay?: number;
}) {
  const left = from === 'left';
  return (
    <div aria-hidden className={clsx('pointer-events-none flex h-[22px] items-center overflow-hidden', className)}>
      <div
        className={clsx(
          'flex h-full w-full items-center',
          !left && 'flex-row-reverse',
          enter === 'intro' && (left ? 'intro-slide-l' : 'intro-slide-r'),
        )}
        data-reveal={enter === 'scroll' ? 'fade' : undefined}
        style={ms(delay)}
      >
        <span className="flex h-[12px] shrink-0 items-center">
          <span className="block h-[12px] w-[22px] bg-accent" />
          <span className="block h-[6px] w-[4px] bg-accent" />
        </span>
        <span className="h-px flex-1 bg-accent" />
        <SignalGlyph className={clsx('size-[22px] shrink-0', !left && '-scale-x-100')} />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* NumberTag (01) and mono labels                                      */
/* ------------------------------------------------------------------ */

export function NumberTag({
  n,
  className,
  tone = 'ink',
}: {
  n: number | string;
  className?: string;
  /** `light` is for use on dark cards. */
  tone?: 'ink' | 'accent' | 'light';
}) {
  const text = typeof n === 'number' ? String(n).padStart(2, '0') : n;
  return (
    <span
      className={clsx(
        'inline-grid size-7 shrink-0 place-items-center font-mono text-[12px] leading-none',
        tone === 'ink' && 'bg-ink text-paper',
        tone === 'accent' && 'bg-accent text-accent-contrast',
        tone === 'light' && 'bg-ink-inverse text-[#231816]',
        className,
      )}
    >
      {text}
    </span>
  );
}

/** Small uppercase accent tag, e.g. `ANALİZ EDİLİYOR…`. */
export function AccentTag({ children, className, blink = false }: { children: ReactNode; className?: string; blink?: boolean }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 bg-accent px-2 py-[3px] font-mono text-[10.5px] leading-none tracking-[0.06em] text-accent-contrast uppercase',
        className,
      )}
    >
      <span aria-hidden className={clsx('size-1.5 rounded-full bg-white', blink && 'blink')} />
      {children}
    </span>
  );
}

/** Small uppercase chip (BRIK `3H 41M LEFT`). */
export function Chip({
  children,
  tone = 'soft',
  className,
  ...rest
}: HTMLAttributes<HTMLSpanElement> & { tone?: 'soft' | 'ink' | 'line' | 'paper' }) {
  return (
    <span
      className={clsx(
        'inline-flex h-6 items-center gap-1 rounded-[6px] px-2 font-mono text-[10.5px] font-medium tracking-[0.05em] whitespace-nowrap uppercase',
        tone === 'soft' && 'bg-accent-soft text-ink',
        tone === 'ink' && 'bg-ink text-ink-inverse',
        tone === 'line' && 'border border-current/30',
        tone === 'paper' && 'bg-paper-raised text-ink',
        className,
      )}
      {...rest}
    >
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Dark stacked cards with notch necks                                 */
/* ------------------------------------------------------------------ */

type InkCardProps = HTMLAttributes<HTMLElement> & {
  as?: 'div' | 'section' | 'article' | 'li' | 'header';
  /** Draw a neck joining this card to the card above (`top`) or to its left (`left`). */
  neck?: 'top' | 'left';
  padding?: 'none' | 'sm' | 'md' | 'lg';
};

const PAD = { none: '', sm: 'p-4', md: 'p-5 sm:p-6', lg: 'p-6 sm:p-8' } as const;

export function InkCard({ as: Tag = 'div', neck, padding = 'md', className, ...rest }: InkCardProps) {
  return (
    <Tag
      className={clsx(
        'ink-card',
        neck === 'top' && 'neck-top',
        neck === 'left' && 'neck-left',
        PAD[padding],
        className,
      )}
      {...rest}
    />
  );
}

/** Vertical stack with the neck gap (10px). */
export function Stack({ className, children, as: Tag = 'div' }: { className?: string; children: ReactNode; as?: 'div' | 'ul' | 'ol' }) {
  return <Tag className={clsx('flex flex-col gap-[10px]', className)}>{children}</Tag>;
}

/* ------------------------------------------------------------------ */
/* SegmentedProgress (||||||||)                                        */
/* ------------------------------------------------------------------ */

export function SegmentedProgress({
  value,
  max,
  segments = 20,
  label,
  tone = 'dark',
  className,
}: {
  value: number;
  max: number;
  segments?: number;
  label: string;
  tone?: 'dark' | 'light';
  className?: string;
}) {
  const on = Math.round((Math.max(0, Math.min(value, max)) / max) * segments);
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
      className={clsx('seg h-7', tone === 'light' && 'seg-light', className)}
    >
      {Array.from({ length: segments }, (_, i) => (
        <i key={i} data-on={i < on ? '' : undefined} style={{ '--i': i } as CSSProperties} />
      ))}
    </div>
  );
}

/** Segmented swatch bar: a palette as a row of joined colour segments. */
export function PaletteBar({ colors, className, height = 'h-12' }: { colors: string[]; className?: string; height?: string }) {
  return (
    <div aria-hidden className={clsx('flex gap-[3px] overflow-hidden rounded-[10px]', height, className)}>
      {colors.map((c, i) => (
        <span key={`${c}-${i}`} className="block flex-1" style={{ backgroundColor: c }} />
      ))}
    </div>
  );
}
