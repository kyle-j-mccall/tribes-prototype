// Pressable — RN Pressable wrapper with VoiceOver and touch-target safety.
//
// Two safety guarantees:
//
// 1. Dev-warning if accessibilityLabel is missing (T-FOUND-A11Y-005). VoiceOver
//    users hear nothing useful for an unlabeled Pressable, so we surface it
//    loudly during development. Stripped from production builds via __DEV__.
//
// 2. 44pt minimum hit target via hitSlop. iOS HIG / WCAG-2.2 baseline. We do
//    NOT force minWidth/minHeight on the visual element — that would distort
//    layouts. hitSlop expands the touch region without affecting visuals,
//    which is the right tradeoff for icon buttons and inline affordances.
//
// The matching ESLint rule (no-small-touch-target in eslint.config.js)
// catches Pressables whose explicit width/height literals are below 44pt
// without a hitSlop override (T-FOUND-A11Y-008).

import { Pressable as RNPressable, type PressableProps as RNPressableProps } from 'react-native';

export const MIN_TOUCH_TARGET = 44;

export type PressableProps = RNPressableProps;

const DEFAULT_HIT_SLOP = {
  top: MIN_TOUCH_TARGET / 2,
  bottom: MIN_TOUCH_TARGET / 2,
  left: MIN_TOUCH_TARGET / 2,
  right: MIN_TOUCH_TARGET / 2,
};

export function Pressable({
  accessibilityLabel,
  accessibilityRole = 'button',
  hitSlop,
  ...rest
}: PressableProps) {
  if (__DEV__ && !accessibilityLabel) {
    console.warn(
      '[a11y] <Pressable> rendered without accessibilityLabel. VoiceOver users will hear no useful announcement. Provide an accessibilityLabel or use src/core/a11y/labels.ts to build one.',
    );
  }

  return (
    <RNPressable
      accessibilityLabel={accessibilityLabel}
      accessibilityRole={accessibilityRole}
      hitSlop={hitSlop ?? DEFAULT_HIT_SLOP}
      {...rest}
    />
  );
}
