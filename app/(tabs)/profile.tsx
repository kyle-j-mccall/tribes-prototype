// Profile tab — inner-circle CRUD (Story 5.5) + Settings (5.6)
// + Account section (5.8).
//
// Two-step removal: tap card → reveals Remove button → triggers Foundation
// confirmation dialog. Manual-add opens the iOS contacts picker via the
// ContactPicker abstraction in src/core/innerCircle/contactPicker.ts.
//
// Layout follows Shell §4: Inner circle → Settings → Account.
// Permission rows (5.7) will slot into SettingsSection as additional
// rows under the same heading.

import { ScrollView, StyleSheet, View } from 'react-native';

import { Pressable, Text } from '@/src/core/a11y';
import { AccountSection } from '@/src/core/account';
import { copy } from '@/src/core/copy/copy';
import { currentRegister } from '@/src/core/copy/registerSignals';
import { ConfirmationDialog } from '@/src/core/dialog';
import { useInnerCircle } from '@/src/core/innerCircle';
import { PermissionsSection } from '@/src/core/permissions';
import { SettingsSection } from '@/src/core/settings';
import { EmptyState } from '@/src/core/state';
import { colors, radius, space, text as textTokens } from '@/src/core/theme/tokens';

const HEADER_HEIGHT = 44;

export default function ProfileScreen() {
  // Substrate phase: register defaults to warm. Real signals plug in once
  // the auth context tracks lifetime sends.
  const register = currentRegister({});
  const {
    cards,
    confirmation,
    selectCard,
    deselectCard,
    requestRemove,
    cancelRemove,
    confirmRemove,
    addFromPicker,
  } = useInnerCircle();

  const onAddPress = () => {
    void addFromPicker();
  };

  const removeName = confirmation.contact?.name ?? '';

  return (
    <View style={styles.root}>
      <View style={styles.header} accessibilityRole="header">
        <Text style={styles.title}>{copy('nav.tab.profile', { register })}</Text>
      </View>
      <ScrollView contentContainerStyle={styles.body}>
        <Text style={styles.sectionLabel}>
          {copy('profile.section.inner-circle', { register })}
        </Text>
        {cards.length === 0 ? (
          <EmptyState
            illustration="compass"
            title={copy('profile.empty.title', { register })}
            body={copy('profile.empty.body', { register })}
          />
        ) : (
          <View style={styles.cardList}>
            {cards.map(({ contact, isSelected }) => (
              <View key={contact.id} style={styles.cardRow}>
                <Pressable
                  onPress={() => (isSelected ? deselectCard() : selectCard(contact.id))}
                  accessibilityLabel={contact.name}
                  accessibilityState={{ selected: isSelected, expanded: isSelected }}
                  style={[styles.card, isSelected && styles.cardSelected]}
                  testID={`inner-circle-card-${contact.id}`}
                >
                  <View style={styles.avatar} accessible={false}>
                    <Text style={styles.avatarLabel}>{initialsOf(contact.name)}</Text>
                  </View>
                  <Text style={styles.cardName}>{contact.name}</Text>
                </Pressable>
                {isSelected ? (
                  <Pressable
                    onPress={() => requestRemove(contact.id)}
                    accessibilityLabel={`${copy('profile.card.remove-action', { register })} ${contact.name}`}
                    style={styles.removeAction}
                    testID={`inner-circle-remove-${contact.id}`}
                  >
                    <Text style={styles.removeActionLabel}>
                      {copy('profile.card.remove-action', { register })}
                    </Text>
                  </Pressable>
                ) : null}
              </View>
            ))}
          </View>
        )}
        <Pressable
          onPress={onAddPress}
          accessibilityLabel={copy('profile.add-button', { register })}
          style={styles.addButton}
          testID="inner-circle-add-button"
        >
          <Text style={styles.addButtonLabel}>{copy('profile.add-button', { register })}</Text>
        </Pressable>
        <SettingsSection />
        <PermissionsSection />
        <AccountSection />
      </ScrollView>
      <ConfirmationDialog
        isOpen={confirmation.isOpen}
        title={copy('profile.remove-confirm.title', { register, vars: { name: removeName } })}
        body={copy('profile.remove-confirm.body', { register })}
        confirmLabel={copy('profile.remove-confirm.confirm', { register })}
        cancelLabel={copy('profile.remove-confirm.cancel', { register })}
        destructive
        onConfirm={confirmRemove}
        onCancel={cancelRemove}
      />
    </View>
  );
}

function initialsOf(name: string): string {
  const parts = name
    .trim()
    .split(/\s+/)
    .filter((p) => p.length > 0);
  if (parts.length === 0) return '?';
  const first = parts[0]?.[0] ?? '';
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? '') : '';
  return (first + last).toUpperCase();
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
  body: {
    paddingHorizontal: space.md,
    paddingBottom: space.xl,
    gap: space.md,
  },
  sectionLabel: {
    ...textTokens.label,
    color: colors.text.secondary,
    marginTop: space.sm,
  },
  cardList: {
    gap: space.sm,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
  },
  card: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    paddingVertical: space.sm,
    paddingHorizontal: space.md,
    backgroundColor: colors.bg.surface,
    borderRadius: radius.md,
    minHeight: 56,
  },
  cardSelected: {
    backgroundColor: colors.bg.elevated,
    borderColor: colors.primary.default,
    borderWidth: 1,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: radius.full,
    backgroundColor: colors.primary.tint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLabel: {
    ...textTokens.label,
    color: colors.bg.canvas,
  },
  cardName: {
    ...textTokens.body,
    color: colors.text.primary,
  },
  removeAction: {
    paddingVertical: space.sm,
    paddingHorizontal: space.md,
    backgroundColor: colors.primary.pressed,
    borderRadius: radius.md,
    minHeight: 44,
    minWidth: 88,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeActionLabel: {
    ...textTokens.label,
    color: colors.text.primary,
  },
  addButton: {
    marginTop: space.md,
    paddingVertical: space.md,
    paddingHorizontal: space.lg,
    backgroundColor: colors.primary.default,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  addButtonLabel: {
    ...textTokens.title,
    color: colors.text.primary,
  },
});
