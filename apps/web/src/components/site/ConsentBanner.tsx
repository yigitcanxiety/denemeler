'use client';

import type { CoreLocale } from '@tonelle/shared';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui';
import type { SiteContent } from '@/content/types';
import { META_PIXEL_ID, getAdConsent, loadPixel, setAdConsent, track } from '@/lib/tracking';

/** Asks once for ad-cookie consent and loads the Meta Pixel only after "Accept". */
export function ConsentBanner({ locale, copy }: { locale: CoreLocale; copy: SiteContent['cookieBanner'] }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const firstPath = useRef(true);

  useEffect(() => {
    if (!META_PIXEL_ID) return;
    const consent = getAdConsent();
    if (consent === 'granted') loadPixel();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- consent lives in localStorage, known only after mount
    else if (consent === null) setOpen(true);
  }, []);

  // Client-side navigations: loadPixel already sent the first PageView.
  useEffect(() => {
    if (firstPath.current) {
      firstPath.current = false;
      return;
    }
    track('PageView');
  }, [pathname]);

  if (!open) return null;
  const answer = (value: 'granted' | 'denied') => {
    setAdConsent(value);
    setOpen(false);
  };

  return (
    <div role="region" aria-label={copy.more} className="fixed inset-x-3 bottom-3 z-[70] mx-auto max-w-xl rounded-card bg-paper p-4 shadow-[0_8px_30px_rgb(23_20_31/0.18)] ring-1 ring-line sm:p-5">
      <p className="text-[13.5px] leading-relaxed text-ink">
        {copy.text}{' '}
        <Link href={`/${locale}/privacy#device`} className="text-violet underline underline-offset-2">
          {copy.more}
        </Link>
      </p>
      <div className="mt-3 flex gap-2">
        <Button size="sm" onClick={() => answer('granted')}>
          {copy.accept}
        </Button>
        <Button size="sm" variant="secondary" onClick={() => answer('denied')}>
          {copy.decline}
        </Button>
      </div>
    </div>
  );
}
