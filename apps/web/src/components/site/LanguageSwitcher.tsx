'use client';

import { LOCALES, t, type Locale } from '@tonelle/shared';
import clsx from 'clsx';
import { Globe } from 'lucide-react';
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
}: {
  locale: Locale;
  className?: string;
  /** Show language codes (TR / EN) instead of names. */
  compact?: boolean;
}) {
  const pathname = usePathname() ?? `/${locale}`;
  return (
    <nav aria-label={t(locale, 'language.label')} className={clsx('flex items-center gap-1 text-sm', className)}>
      {!compact && <Globe aria-hidden className="size-4 text-ink-subtle" />}
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
            }}
            className={clsx(
              'rounded-pill px-2.5 py-1 transition-colors',
              active ? 'bg-surface-sunken font-semibold text-ink' : 'text-ink-muted hover:text-ink',
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
