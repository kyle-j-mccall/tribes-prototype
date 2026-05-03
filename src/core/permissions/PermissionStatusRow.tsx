// PermissionStatusRow — one OS-permission status indicator for the Profile
// tab. Tap behavior is data-driven: only the 'denied' row routes to OS
// Settings. The granted/undetermined rows render as static text — V1
// doesn't surface "Ask now" affordances here (prompting belongs to the
// feature slices that need the permission).

import { StyleSheet, View } from 'react-native';

import { Pressable, Text } from '../a11y';
import { copy } from '../copy/copy';
import { currentRegister } from '../copy/registerSignals';
import { colors, radius, space, text as textTokens } from '../theme/tokens';

import { getRowDisplay } from './display';
import { usePermissionStatus } from './usePermissionStatus';
import type { PermissionKind } from './types';

interface Props {
  kind: PermissionKind;
  titleCopyKey: 'profile.permissions.microphone' | 'profile.permissions.contacts';
}

export function PermissionStatusRow({ kind, titleCopyKey }: Props) {
  const register = currentRegister({});
  const { status, openSettings } = usePermissionStatus(kind);

  const title = copy(titleCopyKey, { register });
  const statusText =
    status === null ? '…' : copy(getRowDisplay(status).statusCopyKey, { register });

  if (status === 'denied') {
    return (
      <Pressable
        accessibilityHint="Opens Settings"
        accessibilityLabel={`${title}: ${statusText}`}
        accessibilityRole="button"
        onPress={() => {
          void openSettings();
        }}
        style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
        testID={`permission-row-${kind}`}
      >
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.statusDenied}>{statusText}</Text>
      </Pressable>
    );
  }

  return (
    <View
      accessible
      accessibilityLabel={`${title}: ${statusText}`}
      accessibilityRole="text"
      style={styles.row}
      testID={`permission-row-${kind}`}
    >
      <Text style={styles.title}>{title}</Text>
      <Text style={status === 'granted' ? styles.statusGranted : styles.statusNeutral}>
        {statusText}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: space.md,
    paddingHorizontal: space.md,
    backgroundColor: colors.bg.surface,
    borderRadius: radius.md,
    minHeight: 44,
  },
  rowPressed: {
    opacity: 0.7,
  },
  title: {
    ...textTokens.body,
    color: colors.text.primary,
  },
  statusGranted: {
    ...textTokens.caption,
    color: colors.secondary.default,
  },
  statusDenied: {
    ...textTokens.caption,
    color: colors.primary.default,
  },
  statusNeutral: {
    ...textTokens.caption,
    color: colors.text.secondary,
  },
});
