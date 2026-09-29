import { isPremium } from '@/lib/entitlement';
import { purchasesMode } from '@/purchases/purchases';
import { useAppStore } from '@/store/app-store';

/** Non-reactive read, for use in callbacks and async flows. */
export function getIsPremium(): boolean {
  const { revenueCatPremium, devEntitlement } = useAppStore.getState();
  return isPremium({ mode: purchasesMode, revenueCatActive: revenueCatPremium, devEntitlement });
}

export function usePremium(): boolean {
  const revenueCatActive = useAppStore((s) => s.revenueCatPremium);
  const devEntitlement = useAppStore((s) => s.devEntitlement);
  return isPremium({ mode: purchasesMode, revenueCatActive, devEntitlement });
}
