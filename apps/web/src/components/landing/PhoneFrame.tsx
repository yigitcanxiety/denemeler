import clsx from 'clsx';
import type { ReactNode } from 'react';

/**
 * Phone mock. The outer box is the size container, so the inner sizes (cqw) scale with the
 * phone's own width; `cqw` on the container element itself would resolve against an ancestor.
 */
export function PhoneFrame({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={clsx('relative aspect-[9/19] [container-type:inline-size]', className)}>
      <div className="absolute inset-0 overflow-hidden rounded-[14cqw] border-[2.6cqw] border-ink bg-paper-raised shadow-lift">
        <div aria-hidden className="absolute top-[2.2cqw] left-1/2 z-20 h-[7cqw] w-[28cqw] -translate-x-1/2 rounded-full bg-ink" />
        <div aria-hidden className="absolute inset-x-0 top-0 z-10 flex h-[11.4cqw] items-center justify-between px-[8cqw] font-sans text-[3.8cqw] font-semibold text-ink">
          <span>9:41</span>
          <span className="flex items-center gap-[1.2cqw]">
            <span className="h-[2.6cqw] w-[4cqw] rounded-[0.6cqw] bg-ink/80" />
            <span className="h-[2.6cqw] w-[6cqw] rounded-[0.8cqw] border-[0.4cqw] border-ink/80" />
          </span>
        </div>
        {children}
      </div>
    </div>
  );
}
