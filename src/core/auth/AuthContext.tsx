// Auth context — minimal substrate for the cold-start auth gate.
//
// V1's "auth" surface is intentionally tiny: the user is either onboarded
// (has a profile + at least the inner-circle scaffold) or not. Real
// credential/session handling lands when the backend slice ships; this
// module only tracks the boolean and exposes the hooks the shell needs:
//
//   - isAuthed             — gate routing decisions
//   - markAuthed()         — onboarding completion handler
//   - hasMadeFirstSend     — controls when queued deep links replay
//   - markFirstSend()      — composer calls this after a successful send
//
// Persisted via the Storage abstraction so swapping to AsyncStorage later
// is one line.

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { storage } from '../storage';

const AUTHED_KEY = 'auth.isAuthed';
const FIRST_SEND_KEY = 'auth.hasMadeFirstSend';

export interface AuthValue {
  hydrated: boolean;
  isAuthed: boolean;
  hasMadeFirstSend: boolean;
  markAuthed: () => Promise<void>;
  markFirstSend: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthValue | null>(null);

export interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [hydrated, setHydrated] = useState(false);
  const [isAuthed, setIsAuthed] = useState(false);
  const [hasMadeFirstSend, setHasMadeFirstSend] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const [authedRaw, firstSendRaw] = await Promise.all([
        storage.getItem(AUTHED_KEY),
        storage.getItem(FIRST_SEND_KEY),
      ]);
      if (cancelled) return;
      setIsAuthed(authedRaw === '1');
      setHasMadeFirstSend(firstSendRaw === '1');
      setHydrated(true);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const markAuthed = useCallback(async () => {
    await storage.setItem(AUTHED_KEY, '1');
    setIsAuthed(true);
  }, []);

  const markFirstSend = useCallback(async () => {
    await storage.setItem(FIRST_SEND_KEY, '1');
    setHasMadeFirstSend(true);
  }, []);

  const signOut = useCallback(async () => {
    await Promise.all([storage.removeItem(AUTHED_KEY), storage.removeItem(FIRST_SEND_KEY)]);
    setIsAuthed(false);
    setHasMadeFirstSend(false);
  }, []);

  const value = useMemo<AuthValue>(
    () => ({ hydrated, isAuthed, hasMadeFirstSend, markAuthed, markFirstSend, signOut }),
    [hydrated, isAuthed, hasMadeFirstSend, markAuthed, markFirstSend, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthValue {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth must be used inside <AuthProvider>.');
  return value;
}
