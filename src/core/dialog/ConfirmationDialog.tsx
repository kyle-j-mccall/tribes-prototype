// ConfirmationDialog — Foundation modal-confirmation primitive.
//
// VoiceOver behavior (per docs/shared-context.md a11y minima and
// T-SHELL-A11Y-004):
//   - The dialog mounts as an accessibility-modal so the underlying surface
//     is hidden from VoiceOver focus traversal.
//   - On open, focus is moved to the title via AccessibilityInfo so the
//     announcement begins with the question, not whatever was previously
//     focused on the screen below.
//   - The destructive variant uses the warm-pressed token rather than a
//     stock red — V1 palette is intentionally warm.

import { useEffect, useRef } from 'react';
import { AccessibilityInfo, Modal, Platform, StyleSheet, View, findNodeHandle } from 'react-native';

import { Pressable, Text } from '../a11y';
import { colors, radius, space, text as textTokens } from '../theme/tokens';

export interface ConfirmationDialogProps {
  isOpen: boolean;
  title: string;
  body?: string;
  confirmLabel: string;
  cancelLabel: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmationDialog({
  isOpen,
  title,
  body,
  confirmLabel,
  cancelLabel,
  destructive = false,
  onConfirm,
  onCancel,
}: ConfirmationDialogProps) {
  const titleRef = useRef<View>(null);

  useEffect(() => {
    if (!isOpen) return;
    // Defer one tick so the Modal has actually mounted its native view.
    const handle = setTimeout(() => {
      const node = titleRef.current ? findNodeHandle(titleRef.current) : null;
      if (node != null) AccessibilityInfo.setAccessibilityFocus(node);
    }, 0);
    return () => clearTimeout(handle);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
      // RN ignores accessibilityViewIsModal on Modal itself on iOS; we
      // re-apply it on the inner content view where it actually lands.
      statusBarTranslucent
    >
      <View style={styles.scrim} testID="confirmation-dialog-scrim">
        <View
          style={styles.dialog}
          accessibilityViewIsModal={Platform.OS === 'ios'}
          accessibilityRole="alert"
          testID="confirmation-dialog"
        >
          <View ref={titleRef} accessible accessibilityRole="header">
            <Text style={styles.title}>{title}</Text>
          </View>
          {body ? (
            <Text style={styles.body} accessibilityRole="text">
              {body}
            </Text>
          ) : null}
          <View style={styles.actions}>
            <Pressable
              onPress={onCancel}
              accessibilityLabel={cancelLabel}
              style={({ pressed }) => [styles.action, styles.cancel, pressed && styles.pressed]}
              testID="confirmation-dialog-cancel"
            >
              <Text style={styles.cancelLabel}>{cancelLabel}</Text>
            </Pressable>
            <Pressable
              onPress={onConfirm}
              accessibilityLabel={confirmLabel}
              style={({ pressed }) => [
                styles.action,
                destructive ? styles.confirmDestructive : styles.confirm,
                pressed && styles.pressed,
              ]}
              testID="confirmation-dialog-confirm"
            >
              <Text style={destructive ? styles.confirmDestructiveLabel : styles.confirmLabel}>
                {confirmLabel}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  scrim: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: space.lg,
  },
  dialog: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: colors.bg.elevated,
    borderRadius: radius.lg,
    padding: space.lg,
    gap: space.md,
  },
  title: {
    ...textTokens.title,
    color: colors.text.primary,
  },
  body: {
    ...textTokens.body,
    color: colors.text.secondary,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: space.sm,
    marginTop: space.sm,
  },
  action: {
    minHeight: 44,
    minWidth: 88,
    paddingHorizontal: space.md,
    paddingVertical: space.sm,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancel: {
    backgroundColor: colors.bg.surface,
  },
  cancelLabel: {
    ...textTokens.title,
    color: colors.text.primary,
  },
  confirm: {
    backgroundColor: colors.primary.default,
  },
  confirmLabel: {
    ...textTokens.title,
    color: colors.text.primary,
  },
  confirmDestructive: {
    backgroundColor: colors.primary.pressed,
  },
  confirmDestructiveLabel: {
    ...textTokens.title,
    color: colors.text.primary,
  },
  pressed: {
    opacity: 0.85,
  },
});
