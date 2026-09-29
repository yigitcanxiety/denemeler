'use client';

import clsx from 'clsx';
import { useEffect, useState, type ReactNode } from 'react';

/**
 * Dark rounded dock pinned to the bottom edge (store badges / primary CTA). Slides up once
 * the element with id `showAfterId` has scrolled out of view and hides again while the
 * element with id `hideNearId` (the footer) is on screen. Hidden = inert.
 */
export function StickyDock({
  children,
  showAfterId,
  hideNearId,
  label,
}: {
  children: ReactNode;
  showAfterId: string;
  hideNearId: string;
  label: string;
}) {
  const [past, setPast] = useState(false);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const after = document.getElementById(showAfterId);
    const footer = document.getElementById(hideNearId);
    if (typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.target === after) setPast(!e.isIntersecting && e.boundingClientRect.top < 0);
        if (e.target === footer) setNear(e.isIntersecting);
      }
    });
    if (after) io.observe(after);
    if (footer) io.observe(footer);
    return () => io.disconnect();
  }, [showAfterId, hideNearId]);

  const visible = past && !near;

  return (
    <aside
      aria-label={label}
      inert={!visible}
      className={clsx(
        'fixed bottom-0 left-1/2 z-40 w-[calc(100%-24px)] max-w-[440px] -translate-x-1/2 transition-[transform,opacity] duration-500 ease-[var(--ease-out-expo)] motion-reduce:transition-opacity motion-reduce:duration-150',
        visible ? 'translate-y-0 opacity-100' : 'translate-y-[110%] opacity-0 motion-reduce:translate-y-0',
      )}
    >
      <div className="rounded-t-[22px] bg-[#0f0a0a] px-3 pt-3 pb-[max(12px,env(safe-area-inset-bottom))] text-white shadow-lift">
        {children}
      </div>
    </aside>
  );
}
