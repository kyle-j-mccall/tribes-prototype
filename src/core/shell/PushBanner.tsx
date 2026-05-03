// PushBanner — one-shot in-app banner asking for push permission.
//
// Behavior contract (T-SHELL-PUSH-001/002/004):
//   - Renders once. Once dismissed, stays dismissed across launches
//     (sticky via Storage).
//   - "Turn on notifications" → Linking.openSettings(). We don't request
//     the OS prompt here because by the time the user sees this banner,
//     the system prompt was either already shown or already declined.
//   - Hidden during hydration to avoid a flash before the dismiss flag
//     is read.
//
// The actual permission check (Notifications.getPermissionsAsync) is wired
// in a later slice — the substrate just exposes the dismiss-once shell.

import { useEffect, useState } from 'react';
import { Linking, Platform, StyleSheet, View } from 'react-native';

import { Pressable, Text } from '../a11y';
import { colors, radius, space, text as textTokens } from '../theme/tokens';
import { storage } from '../storage';

const DISMISSED_KEY = 'shell.pushBanner.dismissed';

export interface PushBannerProps {
  title?: string;
  cta?: string;
  dismissLabel?: string;
}

export function PushBanner({
  title = 'Turn on notifications so plans arrive in time.',
  cta = 'Turn on notifications',
  dismissLabel = 'Not now',
}: PushBannerProps) {
  const [dismissed, setDismissed] = useState<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const raw = await storage.getItem(DISMISSED_KEY);
      if (!cancelled) setDismissed(raw === '1');
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (dismissed !== false) return null;

  const handleEnable = () => {
    if (Platform.OS === 'web') return;
    void Linking.openSettings();
  };

  const handleDismiss = () => {
    void storage.setItem(DISMISSED_KEY, '1');
    setDismissed(true);
  };

  return (
    <View style={styles.banner} accessibilityRole="alert">
      <Text style={styles.title}>{title}</Text>
      <View style={styles.row}>
        <Pressable
          accessibilityLabel={cta}
          onPress={handleEnable}
          style={({ pressed }) => [styles.primary, pressed && styles.pressed]}
        >
          <Text style={styles.primaryLabel}>{cta}</Text>
        </Pressable>
        <Pressable
          accessibilityLabel={dismissLabel}
          onPress={handleDismiss}
          style={({ pressed }) => [styles.secondary, pressed && styles.pressed]}
        >
          <Text style={styles.secondaryLabel}>{dismissLabel}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: colors.bg.surface,
    borderRadius: radius.lg,
    padding: space.md,
    marginHorizontal: space.md,
    marginTop: space.sm,
    gap: space.sm,
  },
  title: {
    ...textTokens.body,
    color: colors.text.primary,
  },
  row: {
    flexDirection: 'row',
    gap: space.sm,
  },
  primary: {
    backgroundColor: colors.primary.default,
    borderRadius: radius.md,
    paddingHorizontal: space.md,
    paddingVertical: space.sm,
  },
  primaryLabel: {
    ...textTokens.label,
    color: colors.text.primary,
  },
  secondary: {
    paddingHorizontal: space.md,
    paddingVertical: space.sm,
  },
  secondaryLabel: {
    ...textTokens.label,
    color: colors.text.secondary,
  },
  pressed: {
    opacity: 0.7,
  },
});
