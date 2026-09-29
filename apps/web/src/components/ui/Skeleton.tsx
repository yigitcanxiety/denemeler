import clsx from 'clsx';

export function Skeleton({ className, label }: { className?: string; label?: string }) {
  return (
    <div
      role={label ? 'status' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={clsx('tonelle-shimmer rounded-lg bg-surface-sunken', className)}
    />
  );
}
