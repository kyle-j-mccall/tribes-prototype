// usePermissionStatus — read-only OS permission watcher.
//
// Status is null while the first lookup is in flight (skeleton state).
// Re-runs on tab focus via expo-router's useFocusEffect so the row
// reflects state changes the user makes by leaving the app, toggling
// Settings, and coming back (T-SHELL-PROF-008/009).

import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';

import { getPermissionProvider } from './provider';
import type { PermissionKind, PermissionStatus } from './types';

export interface PermissionStatusValue {
  status: PermissionStatus | null;
  refresh: () => Promise<void>;
  openSettings: () => Promise<void>;
}

export function usePermissionStatus(kind: PermissionKind): PermissionStatusValue {
  const [status, setStatus] = useState<PermissionStatus | null>(null);

  const refresh = useCallback(async () => {
    const next = await getPermissionProvider().getStatus(kind);
    setStatus(next);
  }, [kind]);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      void (async () => {
        const next = await getPermissionProvider().getStatus(kind);
        if (!cancelled) setStatus(next);
      })();
      return () => {
        cancelled = true;
      };
    }, [kind]),
  );

  const openSettings = useCallback(async () => {
    await getPermissionProvider().openSettings();
  }, []);

  return { status, refresh, openSettings };
}
