// LoadingState — substrate loading affordance.
//
// Two patterns per 01-foundation §4:
//   - skeleton-cards: 3 stacked card placeholders with a gentle shimmer
//   - inline-spinner: small ActivityIndicator that sits inside a button
//
// Shimmer respects useReducedMotion (no oscillation when reduced — the
// placeholders just stay at their dim resting state).

import { useEffect, useRef } from 'react';
import { ActivityIndicator, Animated, StyleSheet, View } from 'react-native';

import { useReducedMotion } from '../a11y';

import { COLOR, RADIUS, SPACE } from './_tokens';

export type LoadingPattern = 'skeleton-cards' | 'inline-spinner';

export interface LoadingStateProps {
  pattern: LoadingPattern;
  /** For skeleton-cards: how many placeholder cards. Default 3. */
  count?: number;
}

export function LoadingState({ pattern, count = 3 }: LoadingStateProps) {
  if (pattern === 'inline-spinner') {
    return (
      <ActivityIndicator
        accessibilityLabel="Loading"
        color={COLOR.textPrimary}
        size="small"
        style={styles.inlineSpinner}
      />
    );
  }
  return <SkeletonCards count={count} />;
}

function SkeletonCards({ count }: { count: number }) {
  const reduced = useReducedMotion();
  const opacity = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    if (reduced) {
      opacity.setValue(0.4);
      return;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.7, duration: 800, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.3, duration: 800, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [reduced, opacity]);

  return (
    <View accessibilityLabel="Loading" accessibilityRole="progressbar" style={styles.skeletonRoot}>
      {Array.from({ length: count }).map((_, i) => (
        <Animated.View
          key={i}
          style={[styles.skeletonCard, { opacity }]}
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  inlineSpinner: {
    marginHorizontal: SPACE.xs,
  },
  skeletonRoot: {
    paddingHorizontal: SPACE.md,
    paddingVertical: SPACE.md,
    gap: SPACE.md,
  },
  skeletonCard: {
    height: 96,
    borderRadius: RADIUS.md,
    backgroundColor: COLOR.surfaceElevated,
  },
});
