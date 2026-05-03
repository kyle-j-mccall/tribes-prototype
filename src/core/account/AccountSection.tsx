// AccountSection — sign-out + delete-account rows for the Profile tab.
//
// Sign out uses the OS-native confirmation (Alert.alert) — it's a single
// reversible action, so the native one-tap confirm is the right
// affordance. Delete account opens DeleteAccountFlow, which steps the
// user through Are-you-sure → password → final confirm.
//
// On either success path we don't navigate manually: AuthContext.signOut
// flips isAuthed → the auth gate in app/_layout.tsx redirects to
// /onboarding (T-SHELL-PROF-010). This keeps the redirect contract in
// one place.

import { useCallback, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';

import { Pressable, Text } from '../a11y';
import { useAuth } from '../auth';
import { colors, radius, space, text as textTokens } from '../theme/tokens';

import { deleteAccount } from './api';
import { DeleteAccountFlow } from './DeleteAccountFlow';

export function AccountSection() {
  const { signOut } = useAuth();
  const [deleteOpen, setDeleteOpen] = useState(false);

  const handleSignOutPress = useCallback(() => {
    Alert.alert('Sign out?', 'You can sign back in any time.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign out',
        style: 'destructive',
        onPress: () => {
          void signOut();
        },
      },
    ]);
  }, [signOut]);

  const handleDeleteConfirmed = useCallback(() => {
    void (async () => {
      await deleteAccount();
      // signOut() also drops the React state so the auth gate sees
      // isAuthed=false and routes to /onboarding. wipeAllLocalData()
      // already removed the storage keys, but signOut() is idempotent.
      await signOut();
      setDeleteOpen(false);
    })();
  }, [signOut]);

  return (
    <View style={styles.section}>
      <Text style={styles.heading}>Account</Text>
      <Pressable
        accessibilityHint="Confirms before signing out"
        accessibilityLabel="Sign out"
        accessibilityRole="button"
        onPress={handleSignOutPress}
        style={({ pressed }) => [styles.row, pressed ? styles.rowPressed : null]}
      >
        <Text style={styles.rowLabel}>Sign out</Text>
      </Pressable>
      <Pressable
        accessibilityHint="Multi-step confirmation, requires password"
        accessibilityLabel="Delete account"
        accessibilityRole="button"
        onPress={() => setDeleteOpen(true)}
        style={({ pressed }) => [styles.row, pressed ? styles.rowPressed : null]}
      >
        <Text style={styles.rowLabelDestructive}>Delete account</Text>
      </Pressable>
      <DeleteAccountFlow
        onCancel={() => setDeleteOpen(false)}
        onConfirmed={handleDeleteConfirmed}
        visible={deleteOpen}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: space.md,
    paddingTop: space.lg,
    gap: space.xs,
  },
  heading: {
    ...textTokens.label,
    color: colors.text.tertiary,
    textTransform: 'uppercase',
    marginBottom: space.xs,
  },
  row: {
    paddingVertical: space.md,
    paddingHorizontal: space.md,
    backgroundColor: colors.bg.surface,
    borderRadius: radius.md,
    minHeight: 44,
    justifyContent: 'center',
  },
  rowPressed: {
    opacity: 0.7,
  },
  rowLabel: {
    ...textTokens.body,
    color: colors.text.primary,
  },
  rowLabelDestructive: {
    ...textTokens.body,
    color: colors.primary.default,
  },
});
