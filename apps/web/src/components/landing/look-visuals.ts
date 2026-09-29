import type { LookId } from '@tonelle/shared';

/**
 * Decorative colour trio per look for the marketing gallery (eyes, cheeks, lips).
 * Real recommendations always come from the user's analysis.
 */
export const LOOK_VISUALS: Record<LookId, { eye: string; cheek: string; lip: string; bg: string }> = {
  natural_glow: { eye: '#C2A383', cheek: '#E0A58F', lip: '#D08C7E', bg: '#FBEFE8' },
  office_chic: { eye: '#A0785A', cheek: '#D4927D', lip: '#B5655B', bg: '#F5EBE4' },
  soft_glam: { eye: '#B5838D', cheek: '#DC8A8F', lip: '#C27C6B', bg: '#FAE6E6' },
  evening_smoky: { eye: '#4B3A3F', cheek: '#C97B6B', lip: '#8C3F46', bg: '#EFE3E0' },
  bridal: { eye: '#E8CFBF', cheek: '#EAAEB1', lip: '#D49A94', bg: '#FDF5F5' },
  bold_lip: { eye: '#8C6E5D', cheek: '#D4927D', lip: '#A3202C', bg: '#F9E8E6' },
  no_makeup_makeup: { eye: '#D9B39C', cheek: '#E8B7A6', lip: '#C9907C', bg: '#FDF9F6' },
  festival_color: { eye: '#40B5AD', cheek: '#F88379', lip: '#E2725B', bg: '#EAF6F3' },
};
