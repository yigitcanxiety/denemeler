import { AnalyzePage, analyzeMetadata } from '@/features/analyze/AnalyzePage';

export function generateMetadata({ params }: PageProps<'/[locale]/analyze/color'>) {
  return analyzeMetadata(params, 'color');
}

export default function Page({ params }: PageProps<'/[locale]/analyze/color'>) {
  return <AnalyzePage params={params} mode="color" />;
}
