import clsx from 'clsx';

/** Tonelle wordmark in the Gloock display serif (DESIGN §2). */
export function Logo({ className }: { className?: string }) {
  return <span className={clsx('serif inline-block text-[1.65rem] leading-none tracking-[-0.02em] text-ink', className)}>Tonelle</span>;
}
