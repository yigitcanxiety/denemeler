import clsx from 'clsx';
import type { HTMLAttributes, ReactNode } from 'react';

type ChipProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: 'neutral' | 'accent' | 'outline' | 'inverse';
  icon?: ReactNode;
  size?: 'sm' | 'md';
};

const TONES = {
  neutral: 'bg-surface-sunken text-ink',
  accent: 'bg-accent-soft text-accent-hover',
  outline: 'border border-border-strong text-ink-muted bg-surface-raised',
  inverse: 'bg-surface-inverse/85 text-ink-inverse backdrop-blur',
} as const;

export function Chip({ tone = 'neutral', size = 'md', icon, className, children, ...rest }: ChipProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 rounded-pill font-medium',
        size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3.5 py-1.5 text-sm',
        TONES[tone],
        className,
      )}
      {...rest}
    >
      {icon}
      {children}
    </span>
  );
}

/** Label + value chip used for analysis attributes (undertone, contrast…). */
export function AttributeChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col rounded-lg border border-border bg-surface-raised px-3.5 py-2.5">
      <span className="text-xs text-ink-muted">{label}</span>
      <span className="font-semibold text-ink">{value}</span>
    </div>
  );
}
