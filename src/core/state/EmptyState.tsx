// EmptyState — substrate empty-screen scaffold.
//
// Per 01-foundation §4: callers pass register-flexed copy via the copy() API.
// Title/body/cta.label are plain strings — typically the result of a copy()
// call — so this scaffold stays substrate and doesn't pin specific keys.
//
// The illustration prop names a glyph the screen can swap for an SVG/Lottie
// later. For substrate we render a typographic placeholder so layout and
// VoiceOver order are testable without bringing the asset pipeline in.

import { StyleSheet, View } from 'react-native';

import { Pressable, Text } from '../a11y';

import { COLOR, RADIUS, SPACE, TYPE } from './_tokens';

export type EmptyIllustration = 'paper-boat' | 'compass' | 'star' | 'door';

const ILLUSTRATION_GLYPH: Record<EmptyIllustration, string> = {
  'paper-boat': '⛵',
  compass: '🧭',
  star: '✦',
  door: '🚪',
};

export interface EmptyStateProps {
  illustration?: EmptyIllustration;
  title: string;
  body: string;
  cta?: { label: string; onPress: () => void };
}

export function EmptyState({ illustration, title, body, cta }: EmptyStateProps) {
  return (
    <View style={styles.root} accessibilityRole="summary">
      {illustration ? (
        <Text
          style={styles.illustration}
          accessibilityElementsHidden
          importantForAccessibility="no"
        >
          {ILLUSTRATION_GLYPH[illustration]}
        </Text>
      ) : null}
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.body}>{body}</Text>
      {cta ? (
        <Pressable
          accessibilityLabel={cta.label}
          accessibilityRole="button"
          onPress={cta.onPress}
          style={styles.cta}
        >
          <Text style={styles.ctaLabel}>{cta.label}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACE.lg,
    paddingVertical: SPACE.xl,
    gap: SPACE.md,
  },
  illustration: {
    fontSize: 48,
    lineHeight: 56,
    marginBottom: SPACE.sm,
  },
  title: {
    ...TYPE.title,
    color: COLOR.textPrimary,
    textAlign: 'center',
  },
  body: {
    ...TYPE.body,
    color: COLOR.textSecondary,
    textAlign: 'center',
  },
  cta: {
    marginTop: SPACE.md,
    paddingHorizontal: SPACE.lg,
    paddingVertical: SPACE.sm,
    backgroundColor: COLOR.primary,
    borderRadius: RADIUS.md,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaLabel: {
    ...TYPE.title,
    color: COLOR.textPrimary,
  },
});
