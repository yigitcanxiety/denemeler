import clsx from 'clsx';
import Link from 'next/link';
import type { ButtonHTMLAttributes, ComponentProps, ReactNode } from 'react';

/**
 * primary   – violet pill with a soft violet shadow (the main CTA)
 * secondary – white pill with a violet-soft border and violet text
 * soft      – mist pill
 * ghost     – text button
 * dark      – ink pill
 * danger    – destructive
 */
export type ButtonVariant = 'primary' | 'secondary' | 'soft' | 'ghost' | 'dark' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface StyleProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
}

const VARIANTS: Record<ButtonVariant, string> = {
  primary: 'bg-violet text-white shadow-violet hover:bg-[#6446ec] disabled:bg-violet/50 disabled:shadow-none',
  secondary: 'bg-paper text-violet ring-[1.5px] ring-inset ring-violet-soft hover:ring-violet/40 hover:bg-mist disabled:text-muted',
  soft: 'bg-mist text-ink ring-1 ring-inset ring-line hover:bg-violet-soft disabled:opacity-60',
  ghost: 'text-muted hover:text-ink hover:bg-mist disabled:opacity-60',
  dark: 'bg-ink text-white hover:bg-[#2a2535]',
  danger: 'bg-danger text-white hover:bg-danger/90',
};

const SIZES: Record<ButtonSize, string> = {
  sm: 'h-11 px-4 text-[14px] gap-1.5',
  md: 'h-12 px-5 text-[14.5px] gap-2',
  lg: 'h-[52px] px-6 text-[15px] gap-2',
};

export function buttonClasses({ variant = 'primary', size = 'md', fullWidth = false }: StyleProps = {}): string {
  return clsx(
    'press inline-flex select-none items-center justify-center whitespace-nowrap rounded-pill font-semibold',
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
