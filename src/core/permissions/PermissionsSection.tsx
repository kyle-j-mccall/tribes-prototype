// Profile permissions section — renders the two V1 permission status rows.

import { StyleSheet, View } from 'react-native';

import { Text } from '../a11y';
import { copy } from '../copy/copy';
import { currentRegister } from '../copy/registerSignals';
import { colors, space, text as textTokens } from '../theme/tokens';

import { PermissionStatusRow } from './PermissionStatusRow';

export function PermissionsSection() {
  const register = currentRegister({});
  return (
    <View style={styles.section}>
      <Text style={styles.heading}>{copy('profile.permissions.section', { register })}</Text>
      <PermissionStatusRow kind="microphone" titleCopyKey="profile.permissions.microphone" />
      <PermissionStatusRow kind="contacts" titleCopyKey="profile.permissions.contacts" />
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingTop: space.lg,
    gap: space.xs,
  },
  heading: {
    ...textTokens.label,
    color: colors.text.tertiary,
    textTransform: 'uppercase',
    marginBottom: space.xs,
  },
});
