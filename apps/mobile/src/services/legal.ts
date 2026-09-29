import type { Locale } from '@tonelle/shared';
import * as WebBrowser from 'expo-web-browser';

import { legalUrl, type LegalPage } from '@/lib/config';
import { env } from '@/lib/env';
import { colors } from '@/theme';

export function openLegal(locale: Locale, page: LegalPage): Promise<unknown> {
  return WebBrowser.openBrowserAsync(legalUrl(env.siteUrl, locale, page), {
    controlsColor: colors.accent,
    toolbarColor: colors.surface,
    presentationStyle: WebBrowser.WebBrowserPresentationStyle.PAGE_SHEET,
  }).catch(() => undefined);
}
