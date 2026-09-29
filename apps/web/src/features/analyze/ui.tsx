'use client';

import clsx from 'clsx';
import { Check, ChevronLeft } from 'lucide-react';
import { useId, type ReactNode } from 'react';

export { delay } from '@/components/ui/aura';

/** Round icon button (mist by default). */
export function RoundButton({
  label,
  onClick,
  children,
  className,
}: {
  label: string;
  onClick: () => void;
  children: ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={clsx('press grid size-11 shrink-0 place-items-center rounded-full bg-mist text-ink hover:bg-violet-soft', className)}
    >
      {children}
    </button>
  );
}

/** "‹ Title" screen header used by the flow screens (serif title, optional back action). */
export function ScreenTitle({
  title,
  backLabel,
  onBack,
  aside,
  className,
}: {
  title: ReactNode;
  backLabel?: string;
  onBack?: () => void;
  aside?: ReactNode;
  className?: string;
}) {
  return (
    <div className={clsx('flex items-center gap-2', className)}>
      {onBack && backLabel && (
        <button
          type="button"
          onClick={onBack}
          aria-label={backLabel}
          className="press -ml-2 grid size-11 shrink-0 place-items-center rounded-full text-ink hover:bg-mist"
        >
          <ChevronLeft aria-hidden className="size-6" strokeWidth={1.75} />
        </button>
      )}
      <h1 className="min-w-0 flex-1 text-[clamp(1.6rem,6.6vw,2rem)] text-ink">{title}</h1>
      {aside}
    </div>
  );
}

/** Segmented step bar with an `n/total` pill. */
export function StepBar({ current, total, label, className }: { current: number; total: number; label: string; className?: string }) {
  return (
    <div className={clsx('flex items-center gap-2.5', className)} role="progressbar" aria-label={label} aria-valuemin={1} aria-valuemax={total} aria-valuenow={current}>
      <span aria-hidden className="rounded-pill bg-violet px-2.5 py-0.5 text-[11px] font-bold text-white tabular-nums">
        {current}/{total}
      </span>
      <span aria-hidden className="flex flex-1 gap-1">
        {Array.from({ length: total }, (_, i) => (
          <i key={i} className={clsx('block h-1 flex-1 rounded-full transition-colors', i < current ? 'bg-violet' : 'bg-line')} />
        ))}
      </span>
    </div>
  );
}

/** Light checkbox row (violet-soft when checked). */
export function CheckRow({
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
        'flex gap-3 rounded-card p-4 ring-[1.5px] transition-colors ring-inset',
        checked ? 'bg-violet-soft ring-violet' : invalid ? 'bg-paper ring-rose' : 'bg-paper ring-line',
      )}
    >
      <span className="relative mt-0.5 grid size-6 shrink-0 place-items-center">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          aria-invalid={invalid && !checked ? true : undefined}
          className="peer size-6 cursor-pointer appearance-none rounded-[7px] border-[1.5px] border-[#CFC8E6] bg-paper transition-colors checked:border-violet checked:bg-violet focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet"
        />
        <Check aria-hidden strokeWidth={3} className="pointer-events-none absolute size-3.5 text-white opacity-0 peer-checked:opacity-100" />
      </span>
      <label htmlFor={id} className="cursor-pointer text-[14.5px] leading-snug text-ink">
        {children}
      </label>
    </div>
  );
}

/** Small note (success / warning / error / neutral). */
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
        'flex gap-2.5 rounded-card px-4 py-3 text-[13.5px] leading-snug',
        tone === 'neutral' && 'bg-mist text-ink',
        tone === 'success' && 'bg-mint/60 text-mint-ink',
        tone === 'warning' && 'bg-butter/70 text-butter-ink',
        tone === 'danger' && 'bg-rose-soft text-rose-ink',
        className,
      )}
    >
      <span
        aria-hidden
        className={clsx(
          'mt-[5px] size-2 shrink-0 rounded-full',
          tone === 'neutral' && 'bg-violet',
          tone === 'success' && 'bg-mint-ink',
          tone === 'warning' && 'bg-butter-ink',
          tone === 'danger' && 'bg-rose-ink',
        )}
      />
      <span>{children}</span>
    </p>
  );
}

/** Round photo with a violet double ring (avatar / confirmation). */
export function RingPhoto({ src, alt, size, className }: { src: string | null; alt: string; size: number; className?: string }) {
  return (
    <span
      className={clsx('relative mx-auto block overflow-hidden rounded-full bg-mist', className)}
      style={{ width: size, height: size, maxWidth: '100%', boxShadow: '0 0 0 4px #fff, 0 0 0 7px var(--color-violet-soft)' }}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element -- in-memory data URL, never uploaded
        <img src={src} alt={alt} className="size-full object-cover" />
      ) : (
        <span role="img" aria-label={alt} className="block size-full bg-[linear-gradient(160deg,#F8E4D8,#EFD8E6_55%,#E6E0FA)]" />
      )}
    </span>
  );
}
