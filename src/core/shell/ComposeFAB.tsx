// ComposeFAB — Activity-tab floating action button (Shell §3, FR19).
//
// 56pt diameter, 16pt margin from the bottom-right edge, color.primary.default.
// Tap routes to the Send tab; the composer (slice 04) reads the last-used
// audience from src/core/shell/lastUsedAudience to pre-select recipients.
//
// Visibility is enforced by where the FAB is mounted: only activity.tsx
// renders it, so it is naturally absent from Send and Profile
// (T-SHELL-FAB-002, T-SHELL-FAB-003). Don't add an `enabled` prop or
// route-aware visibility logic here — keeping the contract structural
// (mount = visible) prevents drift between the spec and the runtime.
//
// VoiceOver label per T-SHELL-A11Y-002: 'Compose — opens send composer'.

import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { Pressable, Text } from '../a11y';
import { colors, elevation, radius, space } from '../theme/tokens';

export const FAB_DIAMETER = 56;
export const FAB_MARGIN = space.md;

export interface ComposeFABProps {
  onPress: () => void;
  /** Override the absolute container — escape hatch for snapshot/visual tests. */
  containerStyle?: StyleProp<ViewStyle>;
}

export function ComposeFAB({ onPress, containerStyle }: ComposeFABProps) {
  return (
    <View pointerEvents="box-none" style={[styles.container, containerStyle]}>
      <Pressable
        accessibilityHint="Opens the composer to send a coordination"
        accessibilityLabel="Compose — opens send composer"
        accessibilityRole="button"
        onPress={onPress}
        style={({ pressed }) => [styles.fab, pressed ? styles.fabPressed : null]}
      >
        <Text accessibilityElementsHidden importantForAccessibility="no" style={styles.glyph}>
          +
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  // The container fills the parent so we can absolutely position the FAB
  // in its bottom-right without the parent needing to know. pointerEvents
  // is 'box-none' so taps fall through everywhere except the FAB itself.
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  fab: {
    position: 'absolute',
    bottom: FAB_MARGIN,
    right: FAB_MARGIN,
    width: FAB_DIAMETER,
    height: FAB_DIAMETER,
    borderRadius: radius.full,
    backgroundColor: colors.primary.default,
    alignItems: 'center',
    justifyContent: 'center',
    ...elevation['2'],
  },
  fabPressed: {
    backgroundColor: colors.primary.pressed,
  },
  glyph: {
    color: colors.text.primary,
    fontSize: 28,
    lineHeight: 32,
    fontWeight: '600',
  },
});
