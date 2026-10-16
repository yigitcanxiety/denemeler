import { isCoreLocale } from '@tonelle/shared';
import { notFound } from 'next/navigation';
import { SiteFooter } from '@/components/site/SiteFooter';
import { SiteHeader } from '@/components/site/SiteHeader';
import { getContent } from '@/content';

export default async function SiteLayout({ children, params }: LayoutProps<'/[locale]'>) {
  const { locale } = await params;
  if (!isCoreLocale(locale)) notFound();
  const content = getContent(locale);
  return (
    <>
      <div data-app-hide className="contents">
        <SiteHeader locale={locale} content={content} />
      </div>
      {children}
      <div data-app-hide className="contents">
        <SiteFooter locale={locale} content={content} />
      </div>
    </>
  );
}
