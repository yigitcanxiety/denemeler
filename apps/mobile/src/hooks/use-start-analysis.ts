import { router } from 'expo-router';
import { useCallback } from 'react';

import { useAppStore } from '@/store/app-store';

/** Starts a new colour analysis: consent first (once), then the selfie tips. */
export function useStartAnalysis(): () => void {
  const consented = useAppStore((s) => s.consentAt !== null);
  return useCallback(() => router.push(consented ? '/tips' : '/consent'), [consented]);
}
