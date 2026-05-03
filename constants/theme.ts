import { Platform } from 'react-native';

import { colors } from '@/theme';

export { colors, spacing, radius, typography, elevation } from '@/theme';

const palette = {
  text: colors.text.primary,
  background: colors.bg.canvas,
  tint: colors.primary.default,
  icon: colors.text.secondary,
  tabIconDefault: colors.text.secondary,
  tabIconSelected: colors.primary.default,
};

export const Colors = {
  light: palette,
  dark: palette,
};

export const Fonts = Platform.select({
  ios: {
    sans: 'SF Pro Text',
    serif: 'ui-serif',
    rounded: 'SF Pro Rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
