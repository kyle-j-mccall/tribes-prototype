// ContactPicker abstraction.
//
// V1 default uses expo-contacts' native picker on iOS. The abstraction
// (instead of importing expo-contacts inline) lets the test suite swap a
// stub via setContactPicker() and lets web builds substitute a different
// surface later. Lazy import of expo-contacts means the substrate stays
// loadable in pure-Node test environments where the native module isn't
// available.

import type { InnerCircleContact } from './types';

export interface ContactPicker {
  pick(): Promise<InnerCircleContact | null>;
}

let injected: ContactPicker | null = null;

export function setContactPicker(picker: ContactPicker | null): void {
  injected = picker;
}

const expoPicker: ContactPicker = {
  async pick() {
    const Contacts = await import('expo-contacts');
    const permission = await Contacts.requestPermissionsAsync();
    if (!permission.granted) return null;
    const result = await Contacts.presentContactPickerAsync();
    if (!result) return null;
    const phoneNumbers = (result.phoneNumbers ?? [])
      .map((entry) => entry.number)
      .filter((n): n is string => typeof n === 'string');
    return {
      id: result.id ?? `contact-${Date.now()}`,
      name: result.name ?? 'Unknown',
      phoneNumbers,
    };
  },
};

export function getContactPicker(): ContactPicker {
  return injected ?? expoPicker;
}
