// Activity tab — header, push-permission banner, sent/received list,
// and compose FAB.
//
// Empty state ships in 5.3. The header and PushBanner are 5.1 substrate;
// the list comes from 5.2 (ActivityList); the FAB is mounted here (and
// ONLY here) per Shell §3 / FR19 — visibility is structural, not
// flag-driven. List items deep-link to /activity/[id] (5.1 route).

import { useRouter } from 'expo-router';
import { useCallback } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';

import { Text } from '@/src/core/a11y';
import { ActivityList } from '@/src/core/activity';
import { ComposeFAB, PushBanner, getLastUsedAudience } from '@/src/core/shell';
import { colors, space, text as textTokens } from '@/src/core/theme/tokens';

const HEADER_HEIGHT = 44;

export default function ActivityScreen() {
  const router = useRouter();

  const onComposePress = useCallback(() => {
    void (async () => {
      const audience = await getLastUsedAudience();
      const params: Record<string, string> = { source: 'activity-fab' };
      if (audience && audience.length > 0) {
        params.audience = audience.join(',');
      }
      router.navigate({ pathname: '/(tabs)', params });
    })();
  }, [router]);

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.header} accessibilityRole="header">
        <Text style={styles.title}>Activity</Text>
      </View>
      <PushBanner />
      <ActivityList />
      <ComposeFAB onPress={onComposePress} />
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
    paddingHorizontal: space.md,
    justifyContent: 'center',
  },
  title: {
    ...textTokens.title,
    color: colors.text.primary,
  },
});
