// Profile tab — header only at substrate phase.
//
// Inner-circle CRUD (5.5), permission rows (5.7), sign out / delete
// account (5.8) all replace the body in later slices.

import { SafeAreaView, StyleSheet, View } from 'react-native';

import { Text } from '@/src/core/a11y';
import { colors, space, text as textTokens } from '@/src/core/theme/tokens';

const HEADER_HEIGHT = 44;

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.header} accessibilityRole="header">
        <Text style={styles.title}>Profile</Text>
      </View>
      <View style={styles.placeholder}>
        <Text style={styles.placeholderText}>Profile · slice 5.5+ lands here</Text>
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
