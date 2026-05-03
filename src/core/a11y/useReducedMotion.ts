// useReducedMotion — live system preference for "Reduce Motion".
//
// Reads AccessibilityInfo on mount and subscribes to changes so the value
// stays current if the user toggles the setting while the app is running.
// Consumed by SuccessState (Story 1.6), the post-send wait animation
// (slice 05), the recency-strip scroll behavior (slice 04), and any other
// surface that should fall through to instant transitions when reduced.

import { useEffect, useState } from 'react';
import { AccessibilityInfo } from 'react-native';

export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    let cancelled = false;

    AccessibilityInfo.isReduceMotionEnabled()
      .then((enabled) => {
        if (!cancelled) setReduced(enabled);
      })
      .catch(() => {
        // AccessibilityInfo can reject on platforms that don't implement it
        // (web, some Android variants). Treat as "not reduced" — the default.
      });

    const sub = AccessibilityInfo.addEventListener('reduceMotionChanged', (enabled) => {
      setReduced(enabled);
    });

    return () => {
      cancelled = true;
      sub.remove();
    };
  }, []);

  return reduced;
}
