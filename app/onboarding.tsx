// Onboarding stub.
//
// The real onboarding flow ships in slice 03. This screen exists so the
// cold-start auth gate (T-SHELL-ROUTE-008) has somewhere to send unauthed
// users. "Continue" marks the user authed and pushes them into the Send
// tab, which is enough to satisfy the redirect contract for substrate.
// A queued deep link (if any) replays after the user's first send, not
// from here.

import { useRouter } from 'expo-router';
import { SafeAreaView, StyleSheet, View } from 'react-native';

import { Pressable, Text } from '@/src/core/a11y';
import { useAuth } from '@/src/core/auth';
import { colors, radius, space, text as textTokens } from '@/src/core/theme/tokens';

export default function OnboardingScreen() {
  const router = useRouter();
  const { markAuthed } = useAuth();

  const handleContinue = () => {
    void (async () => {
      await markAuthed();
      router.replace('/(tabs)');
    })();
  };

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.body}>
        <Text style={styles.headline}>Welcome.</Text>
        <Text style={styles.lead}>Onboarding · slice 03 lands here</Text>
      </View>
      <View style={styles.footer}>
        <Pressable
          accessibilityLabel="Continue"
          onPress={handleContinue}
          style={({ pressed }) => [styles.cta, pressed && styles.pressed]}
        >
          <Text style={styles.ctaLabel}>Continue</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg.canvas,
    paddingHorizontal: space.lg,
  },
  body: {
    flex: 1,
    justifyContent: 'center',
    gap: space.sm,
  },
  headline: {
    ...textTokens.headline,
    color: colors.text.primary,
  },
  lead: {
    ...textTokens.body,
    color: colors.text.secondary,
  },
  footer: {
    paddingBottom: space.lg,
  },
  cta: {
    backgroundColor: colors.primary.default,
    borderRadius: radius.md,
    paddingVertical: space.md,
    alignItems: 'center',
  },
  ctaLabel: {
    ...textTokens.title,
    color: colors.text.primary,
  },
  pressed: {
    opacity: 0.85,
  },
});
