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
  tone = 'paper',
  onNavigate,
}: {
  locale: Locale;
  className?: string;
  /** Show language codes (TR / EN) instead of names. */
  compact?: boolean;
  tone?: 'paper' | 'ink';
  onNavigate?: () => void;
}) {
  const pathname = usePathname() ?? `/${locale}`;
  return (
    <nav
      aria-label={t(locale, 'language.label')}
      className={clsx(
        'inline-flex items-center gap-0.5 rounded-[12px] border p-0.5 font-mono text-[12px]',
        tone === 'paper' ? 'border-line-strong' : 'border-white/20',
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
              'press grid h-10 min-w-11 place-items-center rounded-[10px] px-3 tracking-[0.04em] uppercase',
              active
                ? tone === 'paper'
                  ? 'bg-ink text-ink-inverse'
                  : 'bg-ink-inverse text-[#231816]'
                : tone === 'paper'
                  ? 'text-ink-muted hover:text-ink'
                  : 'text-ink-inverse-muted hover:text-ink-inverse',
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
