// PermissionProvider abstraction — same shape as ContactPicker. Lazy
// imports of the native modules keep this loadable in pure-Node tests
// where expo-audio / expo-contacts native bindings aren't present.
//
// Tests inject a stub via setPermissionProvider(); production code calls
// getPermissionProvider() which falls back to the expo-backed default.

import type { PermissionKind, PermissionStatus } from './types';

export interface PermissionProvider {
  getStatus(kind: PermissionKind): Promise<PermissionStatus>;
  openSettings(): Promise<void>;
}

let injected: PermissionProvider | null = null;

export function setPermissionProvider(p: PermissionProvider | null): void {
  injected = p;
}

interface ExpoPermissionResponse {
  status: 'granted' | 'denied' | 'undetermined';
  granted?: boolean;
}

function normalize(response: ExpoPermissionResponse): PermissionStatus {
  // PermissionResponse already matches the union; normalize through a
  // single function so any future expo divergence is contained here.
  if (response.granted === true || response.status === 'granted') return 'granted';
  if (response.status === 'denied') return 'denied';
  return 'undetermined';
}

const expoProvider: PermissionProvider = {
  async getStatus(kind) {
    if (kind === 'microphone') {
      const Audio = await import('expo-audio');
      const r = await Audio.getRecordingPermissionsAsync();
      return normalize(r);
    }
    const Contacts = await import('expo-contacts');
    const r = await Contacts.getPermissionsAsync();
    return normalize(r);
  },
  async openSettings() {
    const { Linking } = await import('react-native');
    await Linking.openSettings();
  },
};

export function getPermissionProvider(): PermissionProvider {
  return injected ?? expoProvider;
}
