/**
 * Tonelle design tokens for React Native.
 * Mirrors apps/web/src/styles/tokens.css — keep both in sync.
 */

export const palette = {
  nude: {
    50: '#fdf9f6',
    100: '#f9f0ea',
    200: '#f2e2d7',
    300: '#e8cfbf',
    400: '#d9b39c',
    500: '#c4957b',
    600: '#a7775e',
    700: '#835b47',
  },
  blush: {
    50: '#fdf5f5',
    100: '#fae6e6',
    200: '#f4cfd0',
    300: '#eaaeb1',
    400: '#dc8a8f',
    500: '#c96a71',
    600: '#ae5159',
    700: '#8c3f46',
  },
} as const;

export const colors = {
  ink: '#2b2124',
  inkMuted: '#6b5a5e',
  inkSubtle: '#9a8a8d',
  inkInverse: '#fdf9f6',

  surface: '#fdf9f6',
  surfaceRaised: '#ffffff',
  surfaceSunken: '#f6ece6',
  surfaceInverse: '#2b2124',
  border: '#ecdcd3',
  borderStrong: '#d9c2b6',

  accent: '#b85c64',
  accentHover: '#a24c54',
  accentSoft: '#f6dfe0',
  accentContrast: '#ffffff',
  focus: '#c96a71',
  success: '#4f8a6b',
  warning: '#c08a3e',
  danger: '#b3413f',
} as const;

/** rem-based web radii converted at 16px. */
export const radii = {
  sm: 8,
  md: 14,
  lg: 20,
  card: 24,
  pill: 9999,
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

/** Warm-tinted shadows approximating --shadow-soft / --shadow-card / --shadow-lift. */
export const shadows = {
  soft: {
    shadowColor: '#5c3a32',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  card: {
    shadowColor: '#5c3a32',
    shadowOpacity: 0.1,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4,
  },
  lift: {
    shadowColor: '#5c3a32',
    shadowOpacity: 0.16,
    shadowRadius: 40,
    shadowOffset: { width: 0, height: 18 },
    elevation: 8,
  },
} as const;

/**
 * Font family names registered with expo-font in app/_layout.tsx. If fonts fail to load the
 * app still renders with system fonts (see `useAppFonts`).
 */
export const fonts = {
  display: 'Fraunces_500Medium',
  displayBold: 'Fraunces_600SemiBold',
  body: 'Inter_400Regular',
  bodyMedium: 'Inter_500Medium',
  bodySemiBold: 'Inter_600SemiBold',
} as const;

export const typography = {
  display: { fontFamily: fonts.display, fontSize: 34, lineHeight: 40, color: colors.ink, letterSpacing: -0.4 },
  title: { fontFamily: fonts.display, fontSize: 26, lineHeight: 32, color: colors.ink, letterSpacing: -0.2 },
  heading: { fontFamily: fonts.displayBold, fontSize: 20, lineHeight: 26, color: colors.ink },
  body: { fontFamily: fonts.body, fontSize: 16, lineHeight: 24, color: colors.ink },
  bodyMuted: { fontFamily: fonts.body, fontSize: 15, lineHeight: 22, color: colors.inkMuted },
  label: { fontFamily: fonts.bodySemiBold, fontSize: 15, lineHeight: 20, color: colors.ink },
  caption: { fontFamily: fonts.body, fontSize: 13, lineHeight: 18, color: colors.inkSubtle },
  overline: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 1.2,
    textTransform: 'uppercase' as const,
    color: colors.accent,
  },
} as const;

export const theme = { palette, colors, radii, spacing, shadows, fonts, typography } as const;
export type Theme = typeof theme;
