import { isLocale } from '@tonelle/shared';
import { notFound } from 'next/navigation';
import { SiteFooter } from '@/components/site/SiteFooter';
import { SiteHeader } from '@/components/site/SiteHeader';
import { getContent } from '@/content';

export default async function SiteLayout({ children, params }: LayoutProps<'/[locale]'>) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const content = getContent(locale);
  return (
    <>
      <SiteHeader locale={locale} content={content} />
      {children}
      <SiteFooter locale={locale} content={content} />
    </>
  );
}
