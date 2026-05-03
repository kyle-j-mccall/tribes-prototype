// SuccessState — substrate success animation.
//
// Two animations per 01-foundation §4:
//   - paper-boat: the warm, register-flexing celebration. Lifts up and fades
//     in. Per docs/shared-context.md and 01-foundation §2: when Reduced
//     Motion is on, falls through to an instant fade — no inertia, no slide.
//   - dashboard-transition: the executive equivalent. Already calm
//     (a brief opacity fade), so Reduced Motion does not change it.
//
// onComplete fires after `duration` so the parent can advance the flow
// (e.g., navigate to the dashboard, dismiss a sheet).

import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet } from 'react-native';

import { Text, useReducedMotion } from '../a11y';

import { COLOR, SPACE, TYPE } from './_tokens';

export type SuccessAnimation = 'paper-boat' | 'dashboard-transition';

export interface SuccessStateProps {
  animation: SuccessAnimation;
  /** Total time on-screen before onComplete fires. Default 1000ms. */
  duration?: number;
  /** Optional caption (typically a copy() lookup result for the active register). */
  caption?: string;
  onComplete?: () => void;
}

export function SuccessState({
  animation,
  duration = 1000,
  caption,
  onComplete,
}: SuccessStateProps) {
  const reduced = useReducedMotion();
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const usePaperBoatMotion = animation === 'paper-boat' && !reduced;

    if (usePaperBoatMotion) {
      translateY.setValue(24);
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 400,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 600,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    } else if (animation === 'dashboard-transition') {
      // Already calm — opacity fade runs regardless of Reduced Motion.
      Animated.timing(opacity, {
        toValue: 1,
        duration: 250,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }).start();
    } else {
      // paper-boat + reduced motion: instant fade-in, no slide.
      opacity.setValue(1);
      translateY.setValue(0);
    }

    if (!onComplete) return;
    const t = setTimeout(onComplete, duration);
    return () => clearTimeout(t);
  }, [animation, reduced, duration, onComplete, opacity, translateY]);

  const glyph = animation === 'paper-boat' ? '⛵' : '✓';

  return (
    <Animated.View
      accessibilityLiveRegion="polite"
      accessibilityRole="text"
      style={[styles.root, { opacity, transform: [{ translateY }] }]}
    >
      <Text style={styles.glyph} accessibilityElementsHidden importantForAccessibility="no">
        {glyph}
      </Text>
      {caption ? <Text style={styles.caption}>{caption}</Text> : null}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACE.lg,
    gap: SPACE.sm,
  },
  glyph: {
    fontSize: 56,
    lineHeight: 64,
    color: COLOR.success,
  },
  caption: {
    ...TYPE.body,
    color: COLOR.textPrimary,
    textAlign: 'center',
  },
});
