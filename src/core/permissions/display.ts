// Pure mapping from a PermissionStatus to display traits. Extracted so
// the row component stays a thin renderer and the test harness can
// validate the table without rendering React.

import type { PermissionStatus } from './types';

export interface RowDisplay {
  /** Copy key under `profile.permissions.status.*`. */
  statusCopyKey:
    | 'profile.permissions.status.granted'
    | 'profile.permissions.status.denied'
    | 'profile.permissions.status.undetermined';
  /** Tap should open OS Settings only when the user can't unblock in-app. */
  tapOpensSettings: boolean;
  /** Used by VoiceOver to announce the actionable role. */
  accessibilityRole: 'button' | 'text';
}

export function getRowDisplay(status: PermissionStatus): RowDisplay {
  switch (status) {
    case 'granted':
      return {
        statusCopyKey: 'profile.permissions.status.granted',
        tapOpensSettings: false,
        accessibilityRole: 'text',
      };
    case 'denied':
      return {
        statusCopyKey: 'profile.permissions.status.denied',
        tapOpensSettings: true,
        accessibilityRole: 'button',
      };
    case 'undetermined':
      return {
        statusCopyKey: 'profile.permissions.status.undetermined',
        tapOpensSettings: false,
        accessibilityRole: 'text',
      };
  }
}
