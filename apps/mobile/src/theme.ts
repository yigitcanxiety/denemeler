/**
 * Tonelle design tokens for React Native — Design Language v2 ("Editorial Lab").
 * Source of truth: docs/DESIGN.md §2. Mirrors apps/web/src/styles/tokens.css — keep both in sync.
 */
import type { TextStyle } from 'react-native';
import { Easing } from 'react-native-reanimated';

export const colors = {
  /* Canvas */
  paper: '#E6DED7',
  paperRaised: '#EFE9E3',
  paperSunken: '#D9D0C8',
  line: 'rgba(35,24,22,0.14)',
  lineStrong: 'rgba(35,24,22,0.28)',

  /* Ink (text, dark cards, primary buttons) */
  ink: '#231816',
  inkSoft: '#3A2A27',
  inkMuted: '#6E605B',
  inkSubtle: '#9A8C86',

  /* Text on dark (ink / night) surfaces */
  onInk: '#EFE9E3',
  onInkMuted: 'rgba(239,233,227,0.64)',
  onInkSubtle: 'rgba(239,233,227,0.42)',
  inkLine: 'rgba(239,233,227,0.14)',

  /* Accent: lines, markers, tags, focus. Never large fills. */
  accent: '#C8354A',
  accentSoft: '#F2C9CB',
  accentSoftDim: 'rgba(242,201,203,0.18)',
  accentContrast: '#FFFFFF',

  /* Dark section */
  night: '#161010',
  nightLine: 'rgba(242,201,203,0.12)',

  /* States */
  success: '#3F7D5C',
  warning: '#B7791F',
  danger: '#B42335',

  scrim: 'rgba(22,16,16,0.55)',
} as const;

/** "Makeup glow" heat-map ramp (deep berry → champagne). */
export const heat = ['#7A1F2B', '#C8354A', '#E0775E', '#F3B27A', '#FBE3C6'] as const;

/** Heat-map blob palettes per season family (DESIGN.md §2, dark sphere section). */
export const seasonHeat = {
  spring: ['#E8604C', '#F59A6B', '#F7C873', '#FBE3C6', '#F3B27A'],
  summer: ['#C0587A', '#D98FB0', '#A99AD6', '#9DBEE0', '#EAD6E6'],
  autumn: ['#A5482A', '#C8743A', '#7E7B3A', '#C9A06A', '#E7C9A0'],
  winter: ['#7A1F4B', '#C8356E', '#F2C9DB', '#2F4FB0', '#E9EEF8'],
} as const;
export type SeasonFamilyKey = keyof typeof seasonHeat;

export const radii = {
  sm: 8,
  md: 14,
  card: 24,
  xl: 32,
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
  xxxl: 48,
} as const;

/** Page gutter (BRIK cards sit close to the screen edge). */
export const GUTTER = 12;
/** Gap between stacked cards; necks bridge it. */
export const STACK_GAP = 10;

/**
 * Font family names registered with expo-font in app/_layout.tsx. If fonts fail to load the
 * app still renders with system fonts.
 */
export const fonts = {
  light: 'InterTight_300Light',
  body: 'InterTight_400Regular',
  medium: 'InterTight_500Medium',
  display: 'InterTight_600SemiBold',
  mono: 'JetBrainsMono_400Regular',
  monoMedium: 'JetBrainsMono_500Medium',
} as const;

export const typography = {
  /** Giant grotesk (season names, hero). Size is usually overridden/fitted. */
  display: { fontFamily: fonts.display, fontSize: 44, lineHeight: 44, letterSpacing: -2.2, color: colors.ink },
  title: { fontFamily: fonts.display, fontSize: 30, lineHeight: 31, letterSpacing: -1.2, color: colors.ink },
  heading: { fontFamily: fonts.medium, fontSize: 21, lineHeight: 24, letterSpacing: -0.5, color: colors.ink },
  body: { fontFamily: fonts.body, fontSize: 16, lineHeight: 23, color: colors.ink },
  bodyMuted: { fontFamily: fonts.body, fontSize: 15, lineHeight: 22, color: colors.inkMuted },
  label: { fontFamily: fonts.medium, fontSize: 15, lineHeight: 20, letterSpacing: -0.1, color: colors.ink },
  caption: { fontFamily: fonts.body, fontSize: 14, lineHeight: 19, color: colors.inkMuted },
  /** Monospace annotation (JetBrains Mono 12–15). */
  mono: { fontFamily: fonts.mono, fontSize: 13, lineHeight: 17.5, color: colors.ink },
  monoSmall: { fontFamily: fonts.mono, fontSize: 11, lineHeight: 15, color: colors.inkMuted },
  monoLabel: { fontFamily: fonts.monoMedium, fontSize: 11, lineHeight: 14, letterSpacing: 0.6, color: colors.ink },
  /** BRIK big light numerals. */
  numeral: {
    fontFamily: fonts.light,
    fontSize: 56,
    lineHeight: 58,
    letterSpacing: -2,
    color: colors.onInk,
    fontVariant: ['tabular-nums'],
  },
  overline: { fontFamily: fonts.monoMedium, fontSize: 11, lineHeight: 14, letterSpacing: 0.8, color: colors.inkMuted },
} satisfies Record<string, TextStyle>;

/** Motion tokens (DESIGN.md §3). */
export const motion = {
  spring: { damping: 18, stiffness: 180, mass: 1 },
  springSoft: { damping: 20, stiffness: 120, mass: 1 },
  /** cubic-bezier(0.22, 1, 0.36, 1) */
  outExpo: Easing.bezier(0.22, 1, 0.36, 1),
  reveal: 700,
  ui: 220,
  /** Reduced motion: opacity fades only, ≤150 ms. */
  reducedFade: 150,
  pressScale: 0.97,
} as const;

export const theme = { colors, heat, seasonHeat, radii, spacing, fonts, typography, motion } as const;
export type Theme = typeof theme;
