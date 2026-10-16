import type { FaceAnalysis, LookId, Season, SkinAnalysis } from '../../schemas';
import type { ProfileAxis, ShadeName } from '../../profile';

type Tuple<T, N extends number, R extends T[] = []> = R['length'] extends N ? R : Tuple<T, N, [...R, T]>;

/** Number of steps of each look in `looks.ts`; the overlay must translate every one (checked by catalogue.test.ts). */
export interface LookStepCounts {
  natural_glow: 5;
  office_chic: 5;
  soft_glam: 6;
  evening_smoky: 5;
  bridal: 6;
  bold_lip: 4;
  no_makeup_makeup: 4;
  festival_color: 5;
}

export interface LookText {
  name: string;
  description: string;
}

/**
 * All catalogue text of one extra locale (everything except tr/en, which stay inline in
 * seasons.ts / looks.ts / profile.ts / fixtures.ts). One file per language in this folder;
 * the compiler rejects a missing season, look, step, axis or shade name.
 */
export interface ContentOverlay {
  /** `seasons.ts`: name and description of each of the 12 colour seasons. */
  seasons: Record<Season, LookText>;
  /** `looks.ts`: name, description and every step (same order as the English steps) of each look. */
  looks: { [K in LookId]: LookText & { steps: Tuple<{ title: string; body: string }, LookStepCounts[K]> } };
  /** `profile.ts`: labels of the colour-profile radar axes. */
  profileAxes: Record<ProfileAxis, string>;
  /** `profile.ts`: makeup colour names, keyed by the English name. */
  shades: Record<ShadeName, string>;
  /** `profile.ts`: "Light {name}" / "Deep {name}" for repeated shade names; `{name}` is the translated shade name as written above. */
  shadeModifiers: { light: string; deep: string };
  /** `fixtures.ts`: human-readable text of the deterministic mock analyses. */
  mock: {
    analysis: Pick<FaceAnalysis, 'foundation' | 'summary'>;
    skin: Pick<SkinAnalysis, 'routine' | 'ingredients' | 'summary'>;
  };
}
