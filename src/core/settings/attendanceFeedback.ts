// Attendance-feedback setting (Story 5.6 / FR22).
//
// Defaults OFF on first session per the anti-pattern guard in
// docs/shared-context.md (no opt-out attendance prompts surface unless
// the user has explicitly turned them on). Persisted via the storage
// abstraction so it survives cold starts.
//
// The shape — { enabled, hydrated, setEnabled } — mirrors AuthContext so
// callers handle the pre-hydrate flash the same way (don't render a
// derived UI until hydrated is true if it would be wrong with the
// default value showing).

import { useCallback, useEffect, useState } from 'react';

import { storage } from '../storage';

const KEY = 'settings.attendanceFeedback';

export async function getAttendanceFeedback(): Promise<boolean> {
  const raw = await storage.getItem(KEY);
  return raw === '1';
}

export async function setAttendanceFeedback(enabled: boolean): Promise<void> {
  await storage.setItem(KEY, enabled ? '1' : '0');
}

export interface UseAttendanceFeedback {
  enabled: boolean;
  hydrated: boolean;
  setEnabled: (next: boolean) => Promise<void>;
}

export function useAttendanceFeedback(): UseAttendanceFeedback {
  const [enabled, setEnabledState] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const value = await getAttendanceFeedback();
      if (cancelled) return;
      setEnabledState(value);
      setHydrated(true);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const setEnabled = useCallback(async (next: boolean) => {
    setEnabledState(next);
    await setAttendanceFeedback(next);
  }, []);

  return { enabled, hydrated, setEnabled };
}
