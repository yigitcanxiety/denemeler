import clsx from 'clsx';
import type { ReactNode } from 'react';

export function Section({
  id,
  eyebrow,
  title,
  subtitle,
  children,
  className,
  align = 'center',
}: {
  id?: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
  align?: 'center' | 'left';
}) {
  const headingId = id ? `${id}-title` : undefined;
  return (
    <section id={id} aria-labelledby={headingId} className={clsx('px-4 py-16 sm:px-6 sm:py-24', className)}>
      <div className="mx-auto max-w-6xl">
        <div className={clsx('max-w-2xl', align === 'center' && 'mx-auto text-center')}>
          {eyebrow && <p className="text-sm font-semibold tracking-wide text-accent">{eyebrow}</p>}
          <h2 id={headingId} className="mt-2 text-3xl leading-tight text-ink sm:text-[2.6rem]">
            {title}
          </h2>
          {subtitle && <p className="mt-4 text-lg leading-relaxed text-ink-muted">{subtitle}</p>}
        </div>
        <div className="mt-10 sm:mt-14">{children}</div>
      </div>
    </section>
  );
}
