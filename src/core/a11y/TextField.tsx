// TextField — RN TextInput wrapper that ensures a VoiceOver label exists.
//
// If the caller provides accessibilityLabel, we use it. Otherwise we fall
// through to the placeholder (T-FOUND-A11Y-006). This is a deliberate
// best-effort fallback, not an excuse to ship un-labeled fields: the
// placeholder is often visual-only ("Saturday afternoon?") and a real
// label tied to the form ("Free-text plan idea") is still better.
//
// Also caps font scaling at 200% to match <Text> (Story 1.2 contract).

import { TextInput, type TextInputProps } from 'react-native';

import { MAX_FONT_SIZE_MULTIPLIER } from './Text';

export type TextFieldProps = TextInputProps;

export function TextField({
  accessibilityLabel,
  placeholder,
  allowFontScaling = true,
  maxFontSizeMultiplier = MAX_FONT_SIZE_MULTIPLIER,
  ...rest
}: TextFieldProps) {
  return (
    <TextInput
      accessibilityLabel={accessibilityLabel ?? placeholder}
      placeholder={placeholder}
      allowFontScaling={allowFontScaling}
      maxFontSizeMultiplier={maxFontSizeMultiplier}
      {...rest}
    />
  );
}
