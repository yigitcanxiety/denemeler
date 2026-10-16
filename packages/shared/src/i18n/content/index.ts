import { EXTRA_LOCALES, type CoreLocalized, type ExtraLocale, type Localized } from '../../schemas';
import { de } from './de';
import { es } from './es';
import { fr } from './fr';
import { it } from './it';
import { ja } from './ja';
import { ko } from './ko';
import { pt } from './pt';
import type { ContentOverlay } from './types';

export type { ContentOverlay };

/** Catalogue text of the locales that are not written inline (seasons, looks, shades, mock data). */
export const CONTENT_OVERLAYS: Record<ExtraLocale, ContentOverlay> = { es, pt, de, fr, it, ja, ko };

/** Completes an inline tr/en value with the overlay text of every extra locale. */
export function withOverlays<T>(core: CoreLocalized<T>, pick: (overlay: ContentOverlay) => T): Localized<T> {
  const out = { ...core } as Localized<T>;
  for (const locale of EXTRA_LOCALES) out[locale] = pick(CONTENT_OVERLAYS[locale]);
  return out;
}
