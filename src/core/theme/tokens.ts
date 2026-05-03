import { Platform, type TextStyle, type ViewStyle } from 'react-native';

export const colors = {
  primary: { default: '#E86A58', pressed: '#C4463A', tint: '#FFB4A8' },
  secondary: { default: '#2A9D8F', pressed: '#1E7268', tint: '#A8E6CF' },
  bg: { canvas: '#121212', surface: '#1E1E1E', elevated: '#2A2A2A' },
  text: { primary: '#FAF8F5', secondary: '#B0B0B0', tertiary: '#6B6B6B' },
  border: { subtle: '#333333' },
} as const;

export const space = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
} as const;

export const radius = {
  sm: 4,
  md: 8,
  lg: 16,
  full: 9999,
} as const;

export const elevation = {
  '0': {},
  '1': {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    shadowOpacity: 0.3,
    elevation: 1,
  },
  '2': {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    shadowOpacity: 0.35,
    elevation: 4,
  },
  '3': {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 24,
    shadowOpacity: 0.4,
    elevation: 8,
  },
} as const satisfies Record<'0' | '1' | '2' | '3', ViewStyle>;

const displayFamily = Platform.select({
  ios: 'SF Pro Display',
  default: 'System',
});

const textFamily = Platform.select({
  ios: 'SF Pro Text',
  default: 'System',
});

export const text = {
  display: {
    fontFamily: displayFamily,
    fontWeight: '700',
    fontSize: 32,
    lineHeight: 38,
  },
  headline: {
    fontFamily: displayFamily,
    fontWeight: '600',
    fontSize: 24,
    lineHeight: 30,
  },
  title: {
    fontFamily: textFamily,
    fontWeight: '600',
    fontSize: 18,
    lineHeight: 24,
  },
  body: {
    fontFamily: textFamily,
    fontWeight: '400',
    fontSize: 16,
    lineHeight: 22,
  },
  caption: {
    fontFamily: textFamily,
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 20,
  },
  label: {
    fontFamily: textFamily,
    fontWeight: '500',
    fontSize: 12,
    lineHeight: 16,
  },
  brandsoul: {
    fontFamily: displayFamily,
    fontWeight: '300',
    fontSize: 22,
    lineHeight: 30,
  },
} as const satisfies Record<
  'display' | 'headline' | 'title' | 'body' | 'caption' | 'label' | 'brandsoul',
  TextStyle
>;

export const tokens = { colors, space, radius, elevation, text } as const;

export type Tokens = typeof tokens;
export type Theme = Tokens;
