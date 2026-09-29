/**
 * Tonelle design tokens for React Native — Design Language v3 ("Aura").
 * Source of truth: docs/DESIGN.md §2. Mirrors apps/web/src/styles/tokens.css — keep both in sync.
 */
import type { TextStyle, ViewStyle } from 'react-native';
import { Easing } from 'react-native-reanimated';

export const colors = {
  /** Lavender backdrop (marketing / section wells). */
  board: '#E9E5FB',
  /** App surface. */
  paper: '#FFFFFF',
  /** Tinted wells, chips, secondary cards. */
  mist: '#F6F4FE',
  ink: '#17141F',
  /** Secondary text (AA on white). */
  muted: '#6B6679',
  line: '#E6E2F3',

  violet: '#7457F5',
  violet2: '#8E75FF',
  violetSoft: '#EDE8FF',

  /** Makeup accent. */
  rose: '#E4718A',
  roseSoft: '#FCE9EE',
  roseInk: '#B23E5A',

  mint: '#CFF3D6',
  mintInk: '#1E7A3A',
  butter: '#FFE9A8',
  butterInk: '#8A6400',

  /** "İdeal / kaçınılacak" selfie outlines. */
  good: '#44C06A',
  bad: '#F08A8A',

  onViolet: '#FFFFFF',
  floatBg: 'rgba(255,255,255,0.92)',
  scrim: 'rgba(23,20,31,0.45)',
} as const;

/** Chart bar colours (Aura). */
export const chart = {
  warmth: '#F29A5E',
  contrast: '#6C9BEF',
  softness: '#D983E6',
  depth: '#5B6BF0',
} as const;

/** Soft gradients behind the season card, per season family. */
export const seasonGradient = {
  spring: ['#FCEBD5', '#F9DCD6', '#EFE6FB'],
  summer: ['#F3E1EE', '#E9E0FA', '#DDE8F8'],
  autumn: ['#F8E4D8', '#EFD8E6', '#E6E0FA'],
  winter: ['#E6E0FA', '#DCE4F8', '#F4DDEA'],
} as const;

export const radii = {
  sm: 12,
  md: 16,
  card: 18,
  /** Phone-level cards (hero portrait, season card, before/after). */
  xl: 22,
  pill: 999,
} as const;

export const spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

/** Page gutter. */
export const GUTTER = 16;
/** Extra bottom space on tab screens so content clears the raised centre scan button. */
export const TAB_CLEARANCE = 48;

/** Font family names registered with expo-font in app/_layout.tsx (system fonts if loading fails). */
export const fonts = {
  display: 'Gloock_400Regular',
  body: 'PlusJakartaSans_400Regular',
  medium: 'PlusJakartaSans_500Medium',
  semibold: 'PlusJakartaSans_600SemiBold',
  bold: 'PlusJakartaSans_700Bold',
} as const;

export const typography = {
  /** Serif display (screen titles, season names). */
  display: { fontFamily: fonts.display, fontSize: 30, lineHeight: 33, letterSpacing: -0.3, color: colors.ink },
  h2: { fontFamily: fonts.display, fontSize: 24, lineHeight: 27, letterSpacing: -0.2, color: colors.ink },
  section: { fontFamily: fonts.display, fontSize: 18, lineHeight: 22, color: colors.ink },
  body: { fontFamily: fonts.body, fontSize: 15, lineHeight: 22, color: colors.ink },
  bodyMuted: { fontFamily: fonts.body, fontSize: 14, lineHeight: 20, color: colors.muted },
  label: { fontFamily: fonts.semibold, fontSize: 14.5, lineHeight: 19, color: colors.ink },
  small: { fontFamily: fonts.body, fontSize: 12.5, lineHeight: 17, color: colors.muted },
  smallStrong: { fontFamily: fonts.semibold, fontSize: 12.5, lineHeight: 17, color: colors.ink },
  caption: { fontFamily: fonts.medium, fontSize: 11, lineHeight: 14, color: colors.muted },
  /** Uppercase eyebrow chips ("✦ KENDİNİ KEŞFET"). */
  eyebrow: { fontFamily: fonts.semibold, fontSize: 10.5, lineHeight: 13, letterSpacing: 0.7, color: colors.ink },
  /** Big serif numbers (prices, %). */
  number: { fontFamily: fonts.display, fontSize: 44, lineHeight: 48, color: colors.ink, fontVariant: ['tabular-nums'] },
} satisfies Record<string, TextStyle>;

/** Soft, violet-tinted depth. */
export const shadows = {
  button: {
    shadowColor: colors.violet,
    shadowOpacity: 0.45,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },
  card: {
    shadowColor: '#2A1C6E',
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2,
  },
  float: {
    shadowColor: colors.ink,
    shadowOpacity: 0.16,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
} satisfies Record<string, ViewStyle>;

/** Motion tokens (DESIGN.md §6). */
export const motion = {
  spring: { damping: 18, stiffness: 220, mass: 1 },
  /** cubic-bezier(0.22, 1, 0.36, 1) */
  outExpo: Easing.bezier(0.22, 1, 0.36, 1),
  /** Screen / element entrance: fade + 8 px rise. */
  reveal: 250,
  ui: 200,
  scanLoop: 2600,
  radar: 600,
  bars: 500,
  /** Reduced motion: opacity fades only. */
  reducedFade: 150,
  pressScale: 0.98,
} as const;

export const theme = { colors, chart, seasonGradient, radii, spacing, fonts, typography, shadows, motion } as const;
export type Theme = typeof theme;
