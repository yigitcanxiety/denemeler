import type { TranslationKey } from '@tonelle/shared';

/**
 * Helper-character tips per screen (2–3 each, ≤ 110 characters; the camera ones are shorter because
 * they have to fit in the band between the header and the face oval). Copy lives in `assistant.*`.
 */
export const TIPS = {
  home: ['assistant.home.tip1', 'assistant.home.tip2', 'assistant.home.tip3'],
  camera: ['assistant.camera.tip1', 'assistant.camera.tip2', 'assistant.camera.tip3'],
  results: ['assistant.results.tip1', 'assistant.results.tip2', 'assistant.results.tip3'],
  look: ['assistant.look.tip1', 'assistant.look.tip2'],
} as const satisfies Record<string, readonly TranslationKey[]>;

export type TipScreen = keyof typeof TIPS;

/** Only Home keeps the character around (as a small replay button) once its tips were read. */
export const PERSISTENT_SCREEN: TipScreen = 'home';
