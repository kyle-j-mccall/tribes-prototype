// DeleteAccountFlow — three-step delete confirmation modal (Story 5.8).
//
// Per Shell §4 and bead acceptance T-SHELL-PROF-011: deletion is a
// deliberate, multi-tap action with a password challenge between the
// initial intent and the irreversible step.
//
//   confirm  → "Are you sure?" with Cancel / Continue
//   password → re-enter password, blocking Continue when empty
//   final    → "Delete forever?" with Cancel / Delete forever
//
// The password is currently a UI gate only — there's no auth backend in
// V1 substrate to validate against. The flow shape is the contract; the
// real validation lands when the backend slice wires signalServerSideDelete.
//
// Cancel at any step, or closing the modal, resets to step 1 and discards
// the typed password. We never persist the password.

import { useEffect, useState } from 'react';
import { Modal, StyleSheet, View } from 'react-native';

import { Pressable, Text, TextField } from '../a11y';
import { colors, radius, space, text as textTokens } from '../theme/tokens';

type Step = 'confirm' | 'password' | 'final';

export interface DeleteAccountFlowProps {
  visible: boolean;
  onCancel: () => void;
  /** Fired only after the user taps "Delete forever" on the final step. */
  onConfirmed: () => void;
}

export function DeleteAccountFlow({ visible, onCancel, onConfirmed }: DeleteAccountFlowProps) {
  const [step, setStep] = useState<Step>('confirm');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (!visible) {
      setStep('confirm');
      setPassword('');
    }
  }, [visible]);

  return (
    <Modal
      animationType="fade"
      onRequestClose={onCancel}
      transparent
      visible={visible}
      accessibilityViewIsModal
    >
      <View style={styles.scrim}>
        <View accessibilityRole="alert" style={styles.sheet}>
          {step === 'confirm' ? (
            <ConfirmStep onCancel={onCancel} onContinue={() => setStep('password')} />
          ) : null}
          {step === 'password' ? (
            <PasswordStep
              onCancel={onCancel}
              onContinue={() => setStep('final')}
              password={password}
              setPassword={setPassword}
            />
          ) : null}
          {step === 'final' ? <FinalStep onCancel={onCancel} onDelete={onConfirmed} /> : null}
        </View>
      </View>
    </Modal>
  );
}

function ConfirmStep({ onCancel, onContinue }: { onCancel: () => void; onContinue: () => void }) {
  return (
    <>
      <Text style={styles.title}>Are you sure?</Text>
      <Text style={styles.body}>
        Deleting your account erases all your data. This can&apos;t be undone.
      </Text>
      <View style={styles.row}>
        <SecondaryButton label="Cancel" onPress={onCancel} />
        <PrimaryButton label="Continue" onPress={onContinue} />
      </View>
    </>
  );
}

function PasswordStep({
  onCancel,
  onContinue,
  password,
  setPassword,
}: {
  onCancel: () => void;
  onContinue: () => void;
  password: string;
  setPassword: (next: string) => void;
}) {
  const canContinue = password.length > 0;
  return (
    <>
      <Text style={styles.title}>Enter your password</Text>
      <Text style={styles.body}>Confirm it&apos;s you before we erase your account.</Text>
      <TextField
        accessibilityLabel="Password"
        autoCapitalize="none"
        autoCorrect={false}
        onChangeText={setPassword}
        placeholder="Password"
        placeholderTextColor={colors.text.tertiary}
        secureTextEntry
        style={styles.input}
        value={password}
      />
      <View style={styles.row}>
        <SecondaryButton label="Cancel" onPress={onCancel} />
        <PrimaryButton disabled={!canContinue} label="Continue" onPress={onContinue} />
      </View>
    </>
  );
}

function FinalStep({ onCancel, onDelete }: { onCancel: () => void; onDelete: () => void }) {
  return (
    <>
      <Text style={styles.title}>Delete forever?</Text>
      <Text style={styles.body}>
        This is the last step. Your data will be erased on this device and on our servers.
      </Text>
      <View style={styles.row}>
        <SecondaryButton label="Cancel" onPress={onCancel} />
        <DestructiveButton label="Delete forever" onPress={onDelete} />
      </View>
    </>
  );
}

function PrimaryButton({
  disabled,
  label,
  onPress,
}: {
  disabled?: boolean;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.btn,
        styles.btnPrimary,
        disabled ? styles.btnDisabled : null,
        pressed && !disabled ? styles.btnPressed : null,
      ]}
    >
      <Text style={styles.btnPrimaryLabel}>{label}</Text>
    </Pressable>
  );
}

function SecondaryButton({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.btn, styles.btnSecondary, pressed ? styles.btnPressed : null]}
    >
      <Text style={styles.btnSecondaryLabel}>{label}</Text>
    </Pressable>
  );
}

function DestructiveButton({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.btn,
        styles.btnDestructive,
        pressed ? styles.btnPressed : null,
      ]}
    >
      <Text style={styles.btnPrimaryLabel}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  scrim: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    paddingHorizontal: space.lg,
  },
  sheet: {
    backgroundColor: colors.bg.elevated,
    borderRadius: radius.lg,
    padding: space.lg,
    gap: space.md,
  },
  title: {
    ...textTokens.headline,
    color: colors.text.primary,
  },
  body: {
    ...textTokens.body,
    color: colors.text.secondary,
  },
  input: {
    ...textTokens.body,
    color: colors.text.primary,
    borderColor: colors.border.subtle,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: radius.md,
    paddingHorizontal: space.md,
    paddingVertical: space.sm,
    minHeight: 44,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: space.sm,
  },
  btn: {
    paddingHorizontal: space.md,
    paddingVertical: space.sm,
    borderRadius: radius.md,
    minHeight: 44,
    minWidth: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnPrimary: {
    backgroundColor: colors.primary.default,
  },
  btnSecondary: {
    backgroundColor: 'transparent',
  },
  btnDestructive: {
    backgroundColor: colors.primary.pressed,
  },
  btnDisabled: {
    opacity: 0.4,
  },
  btnPressed: {
    opacity: 0.7,
  },
  btnPrimaryLabel: {
    ...textTokens.label,
    color: colors.text.primary,
  },
  btnSecondaryLabel: {
    ...textTokens.label,
    color: colors.text.secondary,
  },
});
