'use client';

import clsx from 'clsx';
import { useEffect, useState } from 'react';
import type { SiteContent } from '@/content';
import { AppStoreCta } from './AppStoreCta';

/** Simple sticky CTA bar for small screens (DESIGN §4). Shows after the hero, hides near the footer. */
export function MobileCta({ stores, note, showAfterId, hideNearId }: { stores: SiteContent['stores']; note: string; showAfterId: string; hideNearId: string }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const after = document.getElementById(showAfterId);
    const near = document.getElementById(hideNearId);
    if (!after || typeof IntersectionObserver === 'undefined') return;
    let past = false;
    let footer = false;
    const update = () => setVisible(past && !footer);
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.target === after) past = !e.isIntersecting && e.boundingClientRect.top < 0;
        if (e.target === near) footer = e.isIntersecting;
      }
      update();
    });
    io.observe(after);
    if (near) io.observe(near);
    return () => io.disconnect();
  }, [showAfterId, hideNearId]);

  return (
    <div
      className={clsx(
        'fixed inset-x-0 bottom-0 z-40 border-t border-line bg-paper/92 px-4 pt-3 pb-[max(12px,env(safe-area-inset-bottom))] backdrop-blur-md transition-[transform,opacity] duration-250 lg:hidden',
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-full opacity-0',
      )}
      aria-hidden={!visible}
      inert={!visible}
    >
      <AppStoreCta labels={stores} fullWidth />
      <p className="mt-1.5 text-center text-[11.5px] text-muted">{note}</p>
    </div>
  );
}
