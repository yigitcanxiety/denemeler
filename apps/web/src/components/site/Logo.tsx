import clsx from 'clsx';

/** Tonelle logo: two overlapping "swatch" discs + the wordmark in Inter Tight. */
export function Logo({ className, inverse = false }: { className?: string; inverse?: boolean }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-2 text-[1.3rem] leading-none font-semibold tracking-[-0.045em]',
        inverse ? 'text-ink-inverse' : 'text-ink',
        className,
      )}
    >
      <svg aria-hidden viewBox="0 0 30 20" className="h-[0.9em] w-auto shrink-0">
        <circle cx="10" cy="10" r="9.5" fill="currentColor" />
        <circle cx="20" cy="10" r="9.5" fill="var(--color-accent)" />
        <path d="M15 1.8a9.5 9.5 0 0 1 0 16.4a9.5 9.5 0 0 1 0-16.4Z" fill="var(--color-heat-berry)" />
      </svg>
      <span>Tonelle</span>
    </span>
  );
}
