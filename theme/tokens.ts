import { Platform, type TextStyle, type ViewStyle } from 'react-native';

const fontFamily = Platform.select({
  ios: { display: 'SF Pro Display', text: 'SF Pro Text' },
  default: { display: 'System', text: 'System' },
});

export const colors = {
  primary: {
    default: '#E86A58',
    pressed: '#C4463A',
    tint: '#FFB4A8',
  },
  secondary: {
    default: '#2A9D8F',
    pressed: '#1E7268',
    tint: '#A8E6CF',
  },
  bg: {
    canvas: '#121212',
    surface: '#1E1E1E',
    elevated: '#2A2A2A',
  },
  text: {
    primary: '#FAF8F5',
    secondary: '#B0B0B0',
    tertiary: '#6B6B6B',
  },
  border: {
    subtle: '#333333',
  },
  receiver: {
    deepNight: '#121212',
    warmWhite: '#FAF8F5',
    softGray: '#B0B0B0',
    oceanTeal: '#2A9D8F',
    deepTeal: '#1E7268',
    softCharcoal: '#2A2A2A',
  },
} as const;

export const spacing = {
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

export const typography = {
  display: {
    fontFamily: fontFamily.display,
    fontWeight: '700',
    fontSize: 32,
  },
  headline: {
    fontFamily: fontFamily.display,
    fontWeight: '600',
    fontSize: 24,
  },
  title: {
    fontFamily: fontFamily.text,
    fontWeight: '600',
    fontSize: 18,
  },
  body: {
    fontFamily: fontFamily.text,
    fontWeight: '400',
    fontSize: 16,
  },
  caption: {
    fontFamily: fontFamily.text,
    fontWeight: '400',
    fontSize: 14,
  },
  label: {
    fontFamily: fontFamily.text,
    fontWeight: '500',
    fontSize: 12,
  },
  brandsoul: {
    fontFamily: fontFamily.display,
    fontWeight: '300',
    fontSize: 22,
  },
} as const satisfies Record<string, Pick<TextStyle, 'fontFamily' | 'fontWeight' | 'fontSize'>>;

export const elevation = {
  0: {},
  1: {
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 1,
  },
  2: {
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 4,
  },
  3: {
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 24,
    elevation: 8,
  },
} as const satisfies Record<0 | 1 | 2 | 3, ViewStyle>;
