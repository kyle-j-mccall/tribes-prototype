// Local token literals for the state-pattern scaffolds.
//
// These mirror the V1 design tokens from docs/shared-context.md exactly.
// They're inlined here as a temporary stand-in until src/core/theme (Story 1.1,
// in-flight on branch tp-4pi) lands on main. When it does, swap each constant
// for its useTheme() equivalent and delete this file — the names map 1:1.

export const COLOR = {
  bg: '#121212',
  surface: '#1E1E1E',
  surfaceElevated: '#2A2A2A',
  textPrimary: '#FAF8F5',
  textSecondary: '#B0B0B0',
  textTertiary: '#6B6B6B',
  borderSubtle: '#333333',
  primary: '#E86A58',
  primaryPressed: '#C4463A',
  success: '#2A9D8F',
  successTint: '#A8E6CF',
  // Error red is not in the V1 token set (the palette is intentionally warm).
  // Used only by ErrorState — derive from primary-pressed so it stays warm.
  errorBg: '#3A1F1B',
  errorBorder: '#C4463A',
} as const;

export const SPACE = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 } as const;

export const RADIUS = { sm: 4, md: 8, lg: 16, full: 9999 } as const;

export const TYPE = {
  title: { fontSize: 18, lineHeight: 24, fontWeight: '600' as const },
  body: { fontSize: 16, lineHeight: 22, fontWeight: '400' as const },
  caption: { fontSize: 14, lineHeight: 20, fontWeight: '400' as const },
  label: { fontSize: 12, lineHeight: 16, fontWeight: '500' as const },
};
