// ActivityRow — shared chrome for sent and received list rows.
//
// Layout (T-SHELL-ACT-002): leading visual (avatar / cluster), 1-line
// truncated body, status string. The visual differs between sent
// (recipient cluster) and received (single sender avatar); the body and
// status presentation are identical, so they live here. SentRow and
// ReceivedRow compose this and pass a leading slot.

import { type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { Pressable, Text } from '../a11y';
import { colors, space, text as textTokens } from '../theme/tokens';

export interface ActivityRowProps {
  leading: ReactNode;
  body: string;
  status: string;
  accessibilityLabel: string;
  onPress: () => void;
}

export function ActivityRow({
  leading,
  body,
  status,
  accessibilityLabel,
  onPress,
}: ActivityRowProps) {
  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
    >
      <View style={styles.leading}>{leading}</View>
      <View style={styles.content}>
        <Text style={styles.body} numberOfLines={1} ellipsizeMode="tail">
          {body}
        </Text>
        <Text style={styles.status}>{status}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: space.sm,
    paddingHorizontal: space.md,
    gap: space.md,
    minHeight: 64,
  },
  leading: {
    minWidth: 44,
    alignItems: 'flex-start',
  },
  content: {
    flex: 1,
    gap: 2,
  },
  body: {
    ...textTokens.body,
    color: colors.text.primary,
  },
  status: {
    ...textTokens.caption,
    color: colors.text.secondary,
  },
  pressed: {
    opacity: 0.7,
  },
});
