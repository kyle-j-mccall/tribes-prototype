// V1 permissions surface — only the two surfaces Profile shows status for.
// Story 5.7 is read-only; prompting is owned by feature slices (03 mic,
// 05 contacts). The string union mirrors expo-modules-core's
// PermissionStatus enum values so the default provider can pass the
// string through without translation.

export type PermissionKind = 'microphone' | 'contacts';
export type PermissionStatus = 'granted' | 'denied' | 'undetermined';
