// Activity Detail — deep-link target for app://activity/<coord-id> and
// the day-of ambient push.
//
// Substrate just renders the resolved id and a back affordance. Real
// detail content (responses, compose-reciprocity CTA, etc.) lands with
// the Activity slice.

import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView, StyleSheet, View } from 'react-native';

import { Pressable, Text } from '@/src/core/a11y';
import { colors, space, text as textTokens } from '@/src/core/theme/tokens';

const HEADER_HEIGHT = 44;

export default function ActivityDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.header} accessibilityRole="header">
        <Pressable accessibilityLabel="Back" onPress={() => router.back()} style={styles.back}>
          <Text style={styles.backLabel}>Back</Text>
        </Pressable>
        <Text style={styles.title}>Activity</Text>
      </View>
      <View style={styles.body}>
        <Text style={styles.bodyText}>Coordination {id ?? '(missing id)'}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg.canvas,
  },
  header: {
    height: HEADER_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: space.md,
    gap: space.md,
  },
  back: {
    paddingVertical: space.xs,
    paddingRight: space.sm,
  },
  backLabel: {
    ...textTokens.body,
    color: colors.primary.default,
  },
  title: {
    ...textTokens.title,
    color: colors.text.primary,
  },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: space.lg,
  },
  bodyText: {
    ...textTokens.body,
    color: colors.text.secondary,
  },
});
