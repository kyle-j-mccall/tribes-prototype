// Composer draft store — navigation-persistent in-progress send state.
//
// Mounted above the (tabs) navigator so the draft survives tab switches
// (T-SHELL-NAV-006) regardless of whether the composer component itself
// unmounts internally. expo-router's bottom-tabs already keeps mounted
// tabs alive on switch, but we don't want to depend on that for draft
// integrity — a context above the navigator is the durable contract.
//
// Persisted via the Storage abstraction. With the in-memory shim the
// draft survives every in-app transition (the bead's "at least one
// session" guarantee). When AsyncStorage backs Storage, the draft also
// survives backgrounding and cold starts.
//
// Writes are coalesced: setDraft updates state synchronously and kicks
// off a non-blocking persist. Readers don't wait for the write to
// resolve, but each read on a cold mount waits for hydration.

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';

import { storage } from '../storage';
import { EMPTY_DRAFT, type ComposerDraft } from './types';

const STORAGE_KEY = 'composer.draft';

export interface DraftStoreValue {
  hydrated: boolean;
  draft: ComposerDraft;
  // Replace the whole draft. Pass EMPTY_DRAFT (or call clearDraft) to
  // reset.
  setDraft: (next: ComposerDraft) => void;
  // Shallow merge — convenient for "user typed another character"
  // updates without round-tripping the audience array.
  updateDraft: (patch: Partial<ComposerDraft>) => void;
  clearDraft: () => void;
}

const DraftContext = createContext<DraftStoreValue | null>(null);

function isComposerDraft(value: unknown): value is ComposerDraft {
  if (!value || typeof value !== 'object') return false;
  const v = value as Record<string, unknown>;
  if (typeof v.body !== 'string') return false;
  if (!Array.isArray(v.audience) || !v.audience.every((x) => typeof x === 'string')) return false;
  return true;
}

export interface ComposerDraftProviderProps {
  children: ReactNode;
}

export function ComposerDraftProvider({ children }: ComposerDraftProviderProps) {
  const [draft, setDraftState] = useState<ComposerDraft>(EMPTY_DRAFT);
  const [hydrated, setHydrated] = useState(false);
  // Latch the most recent in-flight write so a rapid sequence of
  // setDraft calls collapses to a single Storage round-trip.
  const pendingRef = useRef<ComposerDraft | null>(null);
  const writingRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const raw = await storage.getItem(STORAGE_KEY);
      if (cancelled) return;
      if (raw) {
        try {
          const parsed: unknown = JSON.parse(raw);
          if (isComposerDraft(parsed)) {
            setDraftState(parsed);
          }
        } catch {
          // Malformed payload — drop it, keep EMPTY_DRAFT.
        }
      }
      setHydrated(true);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const persist = useCallback((next: ComposerDraft) => {
    pendingRef.current = next;
    if (writingRef.current) return;
    writingRef.current = true;
    void (async () => {
      while (pendingRef.current) {
        const snapshot = pendingRef.current;
        pendingRef.current = null;
        await storage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
      }
      writingRef.current = false;
    })();
  }, []);

  const setDraft = useCallback(
    (next: ComposerDraft) => {
      setDraftState(next);
      persist(next);
    },
    [persist],
  );

  const updateDraft = useCallback(
    (patch: Partial<ComposerDraft>) => {
      setDraftState((prev) => {
        const next = { ...prev, ...patch };
        persist(next);
        return next;
      });
    },
    [persist],
  );

  const clearDraft = useCallback(() => {
    setDraftState(EMPTY_DRAFT);
    pendingRef.current = null;
    void storage.removeItem(STORAGE_KEY);
  }, []);

  const value = useMemo<DraftStoreValue>(
    () => ({ hydrated, draft, setDraft, updateDraft, clearDraft }),
    [hydrated, draft, setDraft, updateDraft, clearDraft],
  );

  return <DraftContext.Provider value={value}>{children}</DraftContext.Provider>;
}

export function useDraft(): DraftStoreValue {
  const value = useContext(DraftContext);
  if (!value) {
    throw new Error('useDraft must be used inside <ComposerDraftProvider>.');
  }
  return value;
}
