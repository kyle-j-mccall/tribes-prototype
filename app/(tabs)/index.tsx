// Send tab — composer host (full-bleed, no header per Shell §1).
//
// The actual composer ships in slice 04. This is the substrate stub: it
// renders inside the (tabs) layout as the default tab and exists so the
// nav scaffold can resolve. When the composer arrives, it replaces the
// view here directly.

import { StyleSheet, View } from 'react-native';

import { Text } from '@/src/core/a11y';
import { colors, space, text as textTokens } from '@/src/core/theme/tokens';

export default function SendScreen() {
  return (
    <View style={styles.root}>
      <Text style={styles.placeholder}>Compose · slice 04 lands here</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg.canvas,
    alignItems: 'center',
    justifyContent: 'center',
    padding: space.lg,
  },
  placeholder: {
    ...textTokens.body,
    color: colors.text.secondary,
  },
});
