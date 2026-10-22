import { router } from 'expo-router';
import { useCallback } from 'react';

import { useAppStore } from '@/store/app-store';

/** Starts a new colour analysis with the selfie tips (terms are accepted by continuing there). */
export function useStartAnalysis(): () => void {
  return useCallback(() => {
    useAppStore.getState().setScanMode('color');
    router.push('/tips');
  }, []);
}

/** Starts a skin-care analysis: the same selfie flow, with the skin endpoint at the end. */
export function useStartSkinAnalysis(): () => void {
  return useCallback(() => {
    useAppStore.getState().setScanMode('skin');
    router.push('/tips');
  }, []);
}
