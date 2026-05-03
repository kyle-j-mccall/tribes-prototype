// Last-used audience — persisted across sessions for the Activity FAB.
//
// Per Shell §3 / FR19: tapping the FAB on the Activity tab opens the
// composer with the most recent send's audience pre-selected. This module
// owns the read/write surface; the composer (slice 04) consumes it on
// mount. The storage backend is the same in-memory shim every other
// substrate module uses — swapping in AsyncStorage later is a one-line
// change in src/core/storage.
//
// Returns null (not [] ) when no audience has ever been recorded so the
// composer can distinguish "first run" from "user previously sent to nobody."

import { storage } from '../storage';

const KEY = 'shell.lastUsedAudience';

export async function getLastUsedAudience(): Promise<string[] | null> {
  const raw = await storage.getItem(KEY);
  if (!raw) return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.every((x): x is string => typeof x === 'string')) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

export async function setLastUsedAudience(recipientIds: string[]): Promise<void> {
  await storage.setItem(KEY, JSON.stringify(recipientIds));
}

export async function clearLastUsedAudience(): Promise<void> {
  await storage.removeItem(KEY);
}
