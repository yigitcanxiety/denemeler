import { AnalyzePage, analyzeMetadata } from '@/features/analyze/AnalyzePage';

export function generateMetadata({ params }: PageProps<'/[locale]/analyze'>) {
  return analyzeMetadata(params, 'full');
}

export default function Page({ params }: PageProps<'/[locale]/analyze'>) {
  return <AnalyzePage params={params} mode="full" />;
}
