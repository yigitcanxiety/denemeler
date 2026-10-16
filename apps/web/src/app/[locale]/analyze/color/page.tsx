import { redirect } from 'next/navigation';

/** The analysis lives in the iOS app; the website only points to it. */
export default async function Page({ params }: PageProps<'/[locale]/analyze/color'>) {
  const { locale } = await params;
  redirect(`/${locale}`);
}
