import clsx from 'clsx';
import Link from 'next/link';
import type { ButtonHTMLAttributes, ComponentProps, ReactNode } from 'react';

/**
 * primary  – ink pill (the main CTA on paper)
 * secondary – outlined pill on paper
 * soft     – accent-soft pill (primary CTA on dark cards)
 * ghost    – text button
 * inverse  – light pill on dark surfaces
 * danger   – destructive
 */
export type ButtonVariant = 'primary' | 'secondary' | 'soft' | 'ghost' | 'inverse' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface StyleProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
}

const VARIANTS: Record<ButtonVariant, string> = {
  primary: 'bg-ink text-ink-inverse hover:bg-ink-soft disabled:bg-ink-subtle',
  secondary: 'text-ink ring-1 ring-inset ring-ink/70 hover:bg-ink hover:text-ink-inverse disabled:text-ink-subtle disabled:ring-line-strong',
  soft: 'bg-accent-soft text-[#231816] hover:bg-white disabled:opacity-60',
  ghost: 'text-ink-muted hover:text-ink hover:bg-ink/5 disabled:text-ink-subtle',
  inverse: 'bg-ink-inverse text-[#231816] hover:bg-white',
  danger: 'bg-danger text-white hover:bg-danger/90',
};

const SIZES: Record<ButtonSize, string> = {
  sm: 'h-11 px-4 text-sm gap-1.5',
  md: 'h-12 px-5 text-[0.95rem] gap-2',
  lg: 'h-14 px-7 text-base gap-2.5',
};

export function buttonClasses({ variant = 'primary', size = 'md', fullWidth = false }: StyleProps = {}): string {
  return clsx(
    'press inline-flex select-none items-center justify-center whitespace-nowrap rounded-pill font-medium tracking-[-0.01em]',
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus',
    'disabled:cursor-not-allowed',
    VARIANTS[variant],
    SIZES[size],
    fullWidth && 'w-full',
  );
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & StyleProps & { loading?: boolean; icon?: ReactNode };

export function Button({
  variant,
  size,
  fullWidth,
  loading = false,
  icon,
  className,
  children,
  disabled,
  type = 'button',
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={clsx(buttonClasses({ variant, size, fullWidth }), className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading ? <span aria-hidden className="spin size-4 rounded-full border-2 border-current border-r-transparent" /> : icon}
      {children}
    </button>
  );
}

type ButtonLinkProps = ComponentProps<typeof Link> & StyleProps & { icon?: ReactNode };

export function ButtonLink({ variant, size, fullWidth, icon, className, children, ...rest }: ButtonLinkProps) {
  return (
    <Link className={clsx(buttonClasses({ variant, size, fullWidth }), className)} {...rest}>
      {icon}
      {children}
    </Link>
  );
}
