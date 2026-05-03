// Account-level operations: sign out and delete.
//
// The shell (Story 5.1) already exposes signOut() on AuthContext — that
// covers Story 5.8 sign-out. This module owns the harder side: account
// deletion, which has two responsibilities:
//
//   1. Wipe ALL local persisted state (auth, deep-link queue, push-banner
//      dismiss flag, last-used audience, anything future modules persist).
//      Done via storage.clear() so we don't need to track keys manually.
//   2. Signal the backend so the user record is removed server-side.
//      The backend API is out of scope for this slice (per bead) — the
//      stub here resolves immediately and exists as the wiring point the
//      backend slice will implement.
//
// Caller is responsible for navigation after deletion. The auth gate in
// app/_layout.tsx will redirect to /onboarding once isAuthed flips false,
// so a re-render is enough — no router.replace needed at the call site.

import { storage } from '../storage';

/**
 * Backend hand-off for account deletion.
 *
 * Substrate stub: resolves immediately. The backend slice will replace
 * the body to POST a delete-self request to the server. Errors must
 * surface — local data is wiped only after this resolves so a server
 * failure leaves the user able to retry from the same device.
 */
export async function signalServerSideDelete(): Promise<void> {
  return Promise.resolve();
}

/**
 * Wipe every key in the storage backend. Used by deleteAccount and
 * available as a primitive if other flows need a "fresh device" reset
 * (e.g., a future "switch user" affordance).
 */
export async function wipeAllLocalData(): Promise<void> {
  await storage.clear();
}

/**
 * Full account-deletion sequence: server-side first, then local wipe.
 * Order matters — see signalServerSideDelete().
 */
export async function deleteAccount(): Promise<void> {
  await signalServerSideDelete();
  await wipeAllLocalData();
}
