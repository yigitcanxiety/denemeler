'use client';

import { LOCALES, t, type Locale } from '@tonelle/shared';
import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LOCALE_COOKIE } from '@/lib/locale';

function swapLocale(pathname: string, target: Locale): string {
  const parts = pathname.split('/');
  parts[1] = target;
  return parts.join('/') || `/${target}`;
}

/** Links to the current page in every other locale and remembers the choice in a cookie. */
export function LanguageSwitcher({
  locale,
  className,
  compact = false,
  onNavigate,
}: {
  locale: Locale;
  className?: string;
  /** Show language codes (TR / EN) instead of names. */
  compact?: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname() ?? `/${locale}`;
  return (
    <nav
      aria-label={t(locale, 'language.label')}
      className={clsx(
        'inline-flex items-center gap-0.5 rounded-pill bg-mist p-1 text-[12.5px] font-semibold ring-1 ring-line ring-inset',
        className,
      )}
    >
      {LOCALES.map((l) => {
        const active = l === locale;
        return (
          <Link
            key={l}
            href={swapLocale(pathname, l)}
            hrefLang={l}
            lang={l}
            aria-current={active ? 'true' : undefined}
            onClick={() => {
              document.cookie = `${LOCALE_COOKIE}=${l}; path=/; max-age=31536000; samesite=lax`;
              onNavigate?.();
            }}
            className={clsx(
              'press grid h-10 min-w-11 place-items-center rounded-pill px-3 tracking-[0.04em]',
              active ? 'bg-paper text-ink shadow-[0_1px_3px_rgb(23_20_31/0.12)]' : 'text-muted hover:text-ink',
            )}
          >
            {compact ? (
              <>
                <span aria-hidden>{l.toUpperCase()}</span>
                <span className="sr-only">{t(l, `language.${l}`)}</span>
              </>
            ) : (
              t(l, `language.${l}`)
            )}
          </Link>
        );
      })}
    </nav>
  );
}
