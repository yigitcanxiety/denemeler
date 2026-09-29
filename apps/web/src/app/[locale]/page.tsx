import { isLocale, t } from '@tonelle/shared';
import { notFound } from 'next/navigation';

// Placeholder — the landing page is built separately.
export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <main className="mx-auto flex min-h-dvh max-w-xl flex-col items-center justify-center gap-6 px-6 text-center">
      <h1 className="font-display text-5xl text-ink">{t(locale, 'common.appName')}</h1>
      <p className="text-lg text-ink-muted">{t(locale, 'common.tagline')}</p>
      <span className="rounded-pill bg-accent-soft px-4 py-1.5 text-sm text-accent shadow-soft">
        {t(locale, 'common.privacyBadge')}
      </span>
    </main>
  );
}
