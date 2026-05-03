// VoiceOver label builders.
//
// Per-component label functions live here so screens don't open-code
// announcement strings. Keeping them pure (string in → string out) means
// they can be unit-tested without RN, and the call sites stay declarative:
//
//   <Pressable accessibilityLabel={sendButtonLabel(audienceCount)} />
//
// Spec source: docs/shared-context.md (VoiceOver register), 01-foundation §2.
//
// Stories 02–07 add more builders here as their components ship. This is
// the substrate; per-feature labels are NOT in scope for Story 1.2.

/**
 * Send button on the composer. Audience count is required so the
 * announcement carries the same weight as the visual ("send to N people").
 */
export function sendButtonLabel(audienceCount: number): string {
  if (audienceCount <= 0) return 'Open the door';
  if (audienceCount === 1) return 'Open the door — send this coordination to 1 person';
  return `Open the door — send this coordination to ${String(audienceCount)} people`;
}

/**
 * Dismiss / close affordances. `target` describes what's being dismissed
 * ("warm prompt", "ambient page") so the announcement isn't just "close".
 */
export function dismissLabel(target: string): string {
  return `Dismiss ${target}`;
}

/**
 * Back navigation. `from` is optional context — when provided, the
 * announcement is "Back to <from>" instead of bare "Back".
 */
export function backLabel(from?: string): string {
  return from ? `Back to ${from}` : 'Back';
}

/**
 * Toggle / switch affordances. State must be the current value so VoiceOver
 * announces "X, on" rather than just "X".
 */
export function toggleLabel(name: string, isOn: boolean): string {
  return `${name}, ${isOn ? 'on' : 'off'}`;
}
