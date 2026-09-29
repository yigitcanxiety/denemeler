'use client';

import clsx from 'clsx';
import { Check } from 'lucide-react';
import { useId, type CSSProperties, type ReactNode } from 'react';

/** Stagger helper for `.enter` step animations. */
export const delay = (ms: number) => ({ '--d': `${ms}ms` }) as CSSProperties;

/** Mono uppercase eyebrow used at the top of dark flow cards: `01 — PRIVACY`. */
export function Eyebrow({ n, children, className }: { n?: string; children: ReactNode; className?: string }) {
  return (
    <p className={clsx('mono-caps flex items-center gap-2 text-ink-inverse-muted', className)}>
      {n && <span className="text-accent-soft">{n}</span>}
      {n && <span aria-hidden className="h-px w-5 bg-white/25" />}
      {children}
    </p>
  );
}

/**
 * Oval selfie guide (DESIGN §5): dashed hairline oval + crosshair + accent corner ticks.
 * Drawn in a 300×375 box (4:5) that stretches over the frame.
 */
export function OvalGuide({ className, dim = true }: { className?: string; dim?: boolean }) {
  const maskId = useId().replace(/:/g, '');
  const ticks = [
    'M28 60V28H60',
    'M240 28H272V60',
    'M272 315V347H240',
    'M60 347H28V315',
  ];
  return (
    <svg viewBox="0 0 300 375" preserveAspectRatio="none" aria-hidden className={clsx('pointer-events-none absolute inset-0 size-full', className)}>
      {dim && (
        <>
          <defs>
            <mask id={maskId}>
              <rect width="300" height="375" fill="white" />
              <ellipse cx="150" cy="178" rx="96" ry="128" fill="black" />
            </mask>
          </defs>
          <rect width="300" height="375" fill="rgb(22 16 16 / 0.42)" mask={`url(#${maskId})`} />
        </>
      )}
      <g fill="none" vectorEffect="non-scaling-stroke">
        <ellipse cx="150" cy="178" rx="96" ry="128" stroke="rgb(243 236 230 / 0.9)" strokeWidth="1.2" strokeDasharray="4 5" vectorEffect="non-scaling-stroke" />
        <path d="M150 38V70M150 286V318M42 178H74M226 178H258" stroke="rgb(243 236 230 / 0.55)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
        <path d="M144 178H156M150 172V184" stroke="rgb(243 236 230 / 0.7)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
        {ticks.map((d) => (
          <path key={d} d={d} stroke="var(--color-accent)" strokeWidth="2.5" strokeLinecap="square" vectorEffect="non-scaling-stroke" />
        ))}
      </g>
    </svg>
  );
}

/** Square checkbox styled for dark cards (accent-soft when checked). */
export function DarkCheckbox({
  checked,
  onChange,
  invalid,
  children,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  invalid: boolean;
  children: ReactNode;
}) {
  const id = useId();
  return (
    <div
      className={clsx(
        'flex gap-3 rounded-[16px] p-4 ring-1 transition-colors ring-inset',
        checked ? 'bg-white/[0.06] ring-accent-soft/70' : invalid ? 'ring-[#ff8a98]/70' : 'ring-white/15',
      )}
    >
      <span className="relative mt-0.5 grid size-6 shrink-0 place-items-center">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          aria-invalid={invalid && !checked ? true : undefined}
          className="peer size-6 cursor-pointer appearance-none rounded-[6px] border border-white/40 transition-colors checked:border-accent-soft checked:bg-accent-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-soft"
        />
        <Check aria-hidden strokeWidth={2.5} className="pointer-events-none absolute size-4 text-[#231816] opacity-0 peer-checked:opacity-100" />
      </span>
      <label htmlFor={id} className="cursor-pointer text-[0.95rem] leading-snug text-ink-inverse">
        {children}
      </label>
    </div>
  );
}

/** Round ink icon button (BRIK nav flank / back button). */
export function RoundButton({
  label,
  onClick,
  children,
  tone = 'ink',
  className,
}: {
  label: string;
  onClick: () => void;
  children: ReactNode;
  tone?: 'ink' | 'glass';
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={clsx(
        'press grid size-11 shrink-0 place-items-center rounded-full',
        tone === 'ink' ? 'bg-ink text-ink-inverse hover:bg-ink-soft' : 'text-ink-inverse ring-1 ring-white/20 ring-inset hover:bg-white/10',
        className,
      )}
    >
      {children}
    </button>
  );
}

/** Small note on the paper canvas (success / warning / error / neutral). */
export function Note({
  tone = 'neutral',
  children,
  role,
  className,
}: {
  tone?: 'neutral' | 'success' | 'warning' | 'danger';
  children: ReactNode;
  role?: 'status' | 'alert';
  className?: string;
}) {
  return (
    <p
      role={role}
      className={clsx(
        'mono flex gap-2.5 rounded-[14px] px-4 py-3 text-[12.5px]',
        tone === 'neutral' && 'bg-paper-raised text-ink',
        tone === 'success' && 'bg-paper-raised text-ink',
        tone === 'warning' && 'bg-[#f3e2c4] text-ink',
        tone === 'danger' && 'bg-[#f4d3d6] text-[#7d1726]',
        className,
      )}
    >
      <span
        aria-hidden
        className={clsx(
          'mt-[4px] size-2 shrink-0',
          tone === 'neutral' && 'bg-ink',
          tone === 'success' && 'bg-success',
          tone === 'warning' && 'bg-warning',
          tone === 'danger' && 'bg-danger',
        )}
      />
      <span>{children}</span>
    </p>
  );
}
