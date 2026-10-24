import { router } from 'expo-router';
import { useCallback } from 'react';


/** Starts a new colour analysis with the selfie tips (terms are accepted by continuing there). */
export function useStartAnalysis(): () => void {
  return useCallback(() => router.push('/tips'), []);
}
