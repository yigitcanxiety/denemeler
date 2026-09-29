import clsx from 'clsx';

/** Tonelle wordmark: serif name with a small gradient "tone" dot. */
export function Logo({ className, inverse = false }: { className?: string; inverse?: boolean }) {
  return (
    <span className={clsx('inline-flex items-center gap-2 font-display text-[1.6rem] leading-none tracking-tight', className)}>
      <span
        aria-hidden
        className="inline-block size-[0.7em] rounded-full bg-[conic-gradient(from_200deg,#e8cfbf,#c96a71,#a7775e,#e8cfbf)] shadow-soft"
      />
      <span className={inverse ? 'text-ink-inverse' : 'text-ink'}>Tonelle</span>
    </span>
  );
}
