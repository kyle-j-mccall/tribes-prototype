// Activity tab — header + push-permission banner shell.
//
// List content comes in 5.2; empty state in 5.3. This file owns the
// header (44pt min, text.title) and hosts the PushBanner. The banner is
// dismiss-sticky and only renders in the Activity tab per Shell §5.

import { SafeAreaView, StyleSheet, View } from 'react-native';

import { Text } from '@/src/core/a11y';
import { PushBanner } from '@/src/core/shell';
import { colors, space, text as textTokens } from '@/src/core/theme/tokens';

const HEADER_HEIGHT = 44;

export default function ActivityScreen() {
  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.header} accessibilityRole="header">
        <Text style={styles.title}>Activity</Text>
      </View>
      <PushBanner />
      <View style={styles.placeholder}>
        <Text style={styles.placeholderText}>List · slice 5.2 lands here</Text>
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
    paddingHorizontal: space.md,
    justifyContent: 'center',
  },
  title: {
    ...textTokens.title,
    color: colors.text.primary,
  },
  placeholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    ...textTokens.body,
    color: colors.text.secondary,
  },
});
