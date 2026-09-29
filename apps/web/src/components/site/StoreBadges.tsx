import clsx from 'clsx';
import { STORE_URLS } from '@/config/company';
import type { SiteContent } from '@/content';
import type { StoreId } from '@/lib/payments';

function AppleGlyph() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="size-6 fill-current">
      <path d="M16.37 12.64c.02 2.5 2.2 3.33 2.22 3.34-.02.06-.35 1.18-1.14 2.34-.69 1-1.4 2-2.53 2.02-1.1.02-1.46-.65-2.72-.65-1.27 0-1.66.63-2.7.67-1.09.04-1.92-1.08-2.61-2.08-1.42-2.05-2.5-5.78-1.05-8.3.72-1.25 2-2.04 3.4-2.06 1.06-.02 2.06.71 2.71.71.65 0 1.87-.88 3.15-.75.54.02 2.04.22 3 1.63-.08.05-1.8 1.05-1.78 3.13ZM14.3 5.2c.58-.7.97-1.68.86-2.65-.84.03-1.85.56-2.45 1.26-.54.62-1.01 1.61-.88 2.56.93.07 1.89-.47 2.47-1.17Z" />
    </svg>
  );
}

function PlayGlyph() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="size-6">
      <path fill="#34A853" d="M3.6 2.3 13.3 12l-9.7 9.7c-.35-.2-.6-.6-.6-1.1V3.4c0-.5.25-.9.6-1.1Z" />
      <path fill="#FBBC04" d="m16.6 15.3-3.3-3.3 3.3-3.3 3.7 2.1c1 .6 1 1.9 0 2.4l-3.7 2.1Z" />
      <path fill="#EA4335" d="M16.6 15.3 13.3 12l-9.7 9.7c.35.2.8.2 1.2 0l11.8-6.4Z" />
      <path fill="#4285F4" d="M16.6 8.7 4.8 2.3c-.4-.2-.85-.2-1.2 0l9.7 9.7 3.3-3.3Z" />
    </svg>
  );
}

export function StoreBadge({
  store,
  url,
  labels,
  className,
}: {
  store: StoreId;
  url: string;
  labels: SiteContent['stores'];
  className?: string;
}) {
  const apple = store === 'app_store';
  const top = apple ? labels.appStoreTop : labels.playTop;
  const bottom = apple ? labels.appStoreBottom : labels.playBottom;
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${top} ${bottom}`}
      className={clsx(
        'press inline-flex h-12 items-center gap-2.5 rounded-[14px] bg-ink px-4 text-white hover:bg-[#2a2535]',
        className,
      )}
    >
      {apple ? <AppleGlyph /> : <PlayGlyph />}
      <span className="flex flex-col leading-none">
        <span className="text-[0.65rem] opacity-80">{top}</span>
        <span className="mt-0.5 text-base font-semibold tracking-tight">{bottom}</span>
      </span>
    </a>
  );
}

/** App Store / Google Play badges; each is hidden while its URL env var is empty. */
export function StoreBadges({
  labels,
  className,
  urls = STORE_URLS,
}: {
  labels: SiteContent['stores'];
  className?: string;
  urls?: { appStore: string; playStore: string };
}) {
  if (!urls.appStore && !urls.playStore) return null;
  return (
    <div className={clsx('flex flex-wrap gap-3', className)}>
      {urls.appStore && <StoreBadge store="app_store" url={urls.appStore} labels={labels} />}
      {urls.playStore && <StoreBadge store="play_store" url={urls.playStore} labels={labels} />}
    </div>
  );
}
