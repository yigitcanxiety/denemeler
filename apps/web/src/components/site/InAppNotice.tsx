'use client';

import { X } from 'lucide-react';
import { useState, useSyncExternalStore } from 'react';

const IN_APP_UA = /TikTok|Instagram|FBAN|FBAV/i;

/**
 * Social in-app browsers (TikTok, Instagram, Facebook) often cannot open the App Store link.
 * Shows a dismissible hint there; renders nothing elsewhere. Mounted only when the app is live.
 */
export function InAppNotice({ text, closeLabel }: { text: string; closeLabel: string }) {
  // Server snapshot is false, so hydration matches; the browser snapshot reads the user agent.
  const inApp = useSyncExternalStore(
    () => () => {},
    () => IN_APP_UA.test(navigator.userAgent),
    () => false,
  );
  const [dismissed, setDismissed] = useState(false);
  if (!inApp || dismissed) return null;
  return (
    <div role="status" className="bg-ink text-white">
      <div className="shell flex items-center gap-3 py-2">
        <p className="flex-1 text-[13px] leading-snug font-medium">{text}</p>
        <button type="button" onClick={() => setDismissed(true)} aria-label={closeLabel} className="press grid size-11 shrink-0 place-items-center rounded-full hover:bg-white/10">
          <X aria-hidden className="size-4" strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}
