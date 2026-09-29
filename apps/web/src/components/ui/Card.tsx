import clsx from 'clsx';
import type { HTMLAttributes } from 'react';

type CardProps = HTMLAttributes<HTMLDivElement> & {
  as?: 'div' | 'section' | 'article';
  tone?: 'raised' | 'sunken' | 'accent' | 'inverse';
  padding?: 'none' | 'sm' | 'md' | 'lg';
};

const TONES = {
  raised: 'bg-surface-raised border border-border/70 shadow-card',
  sunken: 'bg-surface-sunken',
  accent: 'bg-accent-soft',
  inverse: 'bg-surface-inverse text-ink-inverse',
} as const;

const PADDING = { none: '', sm: 'p-4', md: 'p-5 sm:p-6', lg: 'p-6 sm:p-8' } as const;

export function Card({ as: Tag = 'div', tone = 'raised', padding = 'md', className, ...rest }: CardProps) {
  return <Tag className={clsx('rounded-card', TONES[tone], PADDING[padding], className)} {...rest} />;
}
