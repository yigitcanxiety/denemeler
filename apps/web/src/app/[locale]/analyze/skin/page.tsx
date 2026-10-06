import { AnalyzePage, analyzeMetadata } from '@/features/analyze/AnalyzePage';

export function generateMetadata({ params }: PageProps<'/[locale]/analyze/skin'>) {
  return analyzeMetadata(params, 'skin');
}

export default function Page({ params }: PageProps<'/[locale]/analyze/skin'>) {
  return <AnalyzePage params={params} mode="skin" />;
}
