// SettingsSection — Profile tab Settings group (Story 5.6).
//
// Currently hosts the attendance-feedback toggle. Notification
// preferences and permission rows ship in 5.7+ and slot in here as
// additional rows under the same heading.

import { StyleSheet, Switch, View } from 'react-native';

import { Text } from '../a11y';
import { copy } from '../copy/copy';
import { currentRegister } from '../copy/registerSignals';
import { colors, radius, space, text as textTokens } from '../theme/tokens';

import { useAttendanceFeedback } from './attendanceFeedback';

export function SettingsSection() {
  const register = currentRegister({});
  const { enabled, hydrated, setEnabled } = useAttendanceFeedback();

  const onToggle = (next: boolean) => {
    void setEnabled(next);
  };

  const label = copy('profile.settings.attendance-feedback.label', { register });
  const body = copy('profile.settings.attendance-feedback.body', { register });

  return (
    <View style={styles.section}>
      <Text style={styles.heading}>{copy('profile.section.settings', { register })}</Text>
      <View accessibilityRole="none" style={styles.row}>
        <View style={styles.copy}>
          <Text style={styles.rowLabel}>{label}</Text>
          <Text style={styles.rowBody}>{body}</Text>
        </View>
        <Switch
          accessibilityLabel={label}
          accessibilityHint={body}
          disabled={!hydrated}
          onValueChange={onToggle}
          thumbColor={enabled ? colors.text.primary : colors.text.secondary}
          trackColor={{ false: colors.border.subtle, true: colors.primary.default }}
          value={enabled}
        />
      </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    paddingHorizontal: space.md,
    paddingVertical: space.md,
    backgroundColor: colors.bg.surface,
    borderRadius: radius.md,
    minHeight: 56,
  },
  copy: {
    flex: 1,
    gap: 2,
  },
  rowLabel: {
    ...textTokens.body,
    color: colors.text.primary,
  },
  rowBody: {
    ...textTokens.caption,
    color: colors.text.secondary,
  },
});
