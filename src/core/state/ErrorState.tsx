// ErrorState — substrate error scaffold (banner / toast / inline).
//
// Per 01-foundation §4: title and recovery.label are plain strings, typically
// the result of a copy() lookup keyed on the calling screen's register.
//
// Variants:
//   - banner: persistent strip at the top of the surface, with recovery action
//   - toast:  transient overlay; auto-dismisses after `duration` (default 4s)
//   - inline: in-flow row, no overlay, no auto-dismiss
//
// The toast variant calls onDismiss when the timer fires so the parent can
// unmount it. Auto-dismiss is paused (timer not started) when duration is 0
// so screens that want a "stays until acknowledged" toast can opt out.

import { useEffect } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';

import { Pressable, Text } from '../a11y';

import { COLOR, RADIUS, SPACE, TYPE } from './_tokens';

export type ErrorVariant = 'banner' | 'toast' | 'inline';

export interface ErrorStateProps {
  variant: ErrorVariant;
  title: string;
  recovery?: { label: string; onPress: () => void };
  /** Toast only. Milliseconds before auto-dismiss. 0 disables. Default 4000. */
  duration?: number;
  /** Toast only. Called when the auto-dismiss timer fires. */
  onDismiss?: () => void;
}

export function ErrorState({
  variant,
  title,
  recovery,
  duration = 4000,
  onDismiss,
}: ErrorStateProps) {
  useEffect(() => {
    if (variant !== 'toast' || duration <= 0 || !onDismiss) return;
    const t = setTimeout(onDismiss, duration);
    return () => clearTimeout(t);
  }, [variant, duration, onDismiss]);

  return (
    <View
      accessibilityLiveRegion="polite"
      accessibilityRole="alert"
      style={[styles.root, VARIANT_STYLE[variant]]}
    >
      <Text style={styles.title}>{title}</Text>
      {recovery ? (
        <Pressable
          accessibilityLabel={recovery.label}
          accessibilityRole="button"
          onPress={recovery.onPress}
          style={styles.recovery}
        >
          <Text style={styles.recoveryLabel}>{recovery.label}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const VARIANT_STYLE: Record<ErrorVariant, ViewStyle> = {
  banner: {
    borderRadius: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
  },
  toast: {
    borderRadius: RADIUS.md,
    marginHorizontal: SPACE.md,
  },
  inline: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    paddingVertical: SPACE.sm,
  },
};

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: SPACE.md,
    paddingHorizontal: SPACE.md,
    paddingVertical: SPACE.md,
    backgroundColor: COLOR.errorBg,
    borderColor: COLOR.errorBorder,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: RADIUS.md,
  },
  title: {
    ...TYPE.body,
    color: COLOR.textPrimary,
    flexShrink: 1,
  },
  recovery: {
    paddingHorizontal: SPACE.md,
    paddingVertical: SPACE.sm,
    minHeight: 44,
    minWidth: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recoveryLabel: {
    ...TYPE.title,
    color: COLOR.primary,
  },
});
