import { createTranslator, type Locale } from '@tonelle/shared';
import { getLocales } from 'expo-localization';
import { useMemo } from 'react';

import { pickDeviceLocale } from '@/lib/locale';
import { useAppStore } from '@/store/app-store';

let cachedDeviceLocale: Locale | null = null;

/** Locale derived from the device settings (tr on Turkish devices, else en). */
export function deviceLocale(): Locale {
  if (!cachedDeviceLocale) {
    let tags: string[] = [];
    try {
      tags = getLocales().map((l) => l.languageTag);
    } catch {
      tags = [];
    }
    cachedDeviceLocale = pickDeviceLocale(tags);
  }
  return cachedDeviceLocale;
}

export function useLocale(): Locale {
  const stored = useAppStore((s) => s.locale);
  return stored ?? deviceLocale();
}

export function useT() {
  const locale = useLocale();
  return useMemo(() => createTranslator(locale), [locale]);
}

export type Translator = ReturnType<typeof createTranslator>;
