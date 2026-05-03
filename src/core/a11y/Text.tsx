// Text — RN Text wrapper that respects iOS Dynamic Type with a sane cap.
//
// Behavior:
//   - allowFontScaling defaults to true (iOS Dynamic Type honored)
//   - maxFontSizeMultiplier defaults to 2 (200% — the contract layouts must hold for)
//
// The cap is the load-bearing piece: without it, iOS will scale text past
// the layouts we ship (xxLarge accessibility sizes go beyond 200%) and
// every screen template breaks. T-FOUND-A11Y-002 enforces 200%.
//
// Callers may override either prop explicitly when they need something
// different (e.g., a brand wordmark that should not scale at all).

import { Text as RNText, type TextProps as RNTextProps } from 'react-native';

export const MAX_FONT_SIZE_MULTIPLIER = 2;

export type TextProps = RNTextProps;

export function Text({
  allowFontScaling = true,
  maxFontSizeMultiplier = MAX_FONT_SIZE_MULTIPLIER,
  ...rest
}: TextProps) {
  return (
    <RNText
      allowFontScaling={allowFontScaling}
      maxFontSizeMultiplier={maxFontSizeMultiplier}
      {...rest}
    />
  );
}
