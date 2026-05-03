// InnerCircleProvider — React binding over the pure reducer in reducer.ts.
//
// Persists the contact list through the existing storage abstraction so
// swapping memory → AsyncStorage in slice 5.x is a one-line change. The
// hydrate effect runs once at mount; subsequent contact changes get
// serialized back asynchronously. We don't block the UI on persistence —
// optimistic local state is the source of truth during the session.

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  type ReactNode,
} from 'react';

import { storage } from '../storage';

import { pickAndAdd } from './actions';
import { getContactPicker } from './contactPicker';
import {
  getCards,
  getConfirmation,
  initialState,
  reducer,
  type CardViewModel,
  type ConfirmationViewModel,
  type InnerCircleState,
} from './reducer';
import type { InnerCircleContact } from './types';

const STORAGE_KEY = 'innerCircle.contacts';

export interface InnerCircleValue {
  state: InnerCircleState;
  hydrated: boolean;
  cards: CardViewModel[];
  confirmation: ConfirmationViewModel;
  selectCard: (id: string) => void;
  deselectCard: () => void;
  requestRemove: (id: string) => void;
  cancelRemove: () => void;
  confirmRemove: () => void;
  addFromPicker: () => Promise<InnerCircleContact | null>;
}

const InnerCircleContext = createContext<InnerCircleValue | null>(null);

export interface InnerCircleProviderProps {
  children: ReactNode;
}

export function InnerCircleProvider({ children }: InnerCircleProviderProps) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [hydrated, setHydrated] = useState(false);
  const hasHydrated = useRef(false);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const raw = await storage.getItem(STORAGE_KEY);
      if (cancelled) return;
      if (raw) {
        try {
          const parsed = JSON.parse(raw) as InnerCircleContact[];
          if (Array.isArray(parsed)) dispatch({ type: 'hydrate', contacts: parsed });
        } catch {
          // Corrupt payload — drop it and start clean. Real loss recovery
          // belongs in a later slice when accounts back the inner circle.
        }
      }
      hasHydrated.current = true;
      setHydrated(true);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!hasHydrated.current) return;
    void storage.setItem(STORAGE_KEY, JSON.stringify(state.contacts));
  }, [state.contacts]);

  const selectCard = useCallback((id: string) => dispatch({ type: 'select', id }), []);
  const deselectCard = useCallback(() => dispatch({ type: 'deselect' }), []);
  const requestRemove = useCallback((id: string) => dispatch({ type: 'requestRemove', id }), []);
  const cancelRemove = useCallback(() => dispatch({ type: 'cancelRemove' }), []);
  const confirmRemove = useCallback(() => dispatch({ type: 'confirmRemove' }), []);
  const addFromPicker = useCallback(() => pickAndAdd(getContactPicker(), dispatch), []);

  const value = useMemo<InnerCircleValue>(
    () => ({
      state,
      hydrated,
      cards: getCards(state),
      confirmation: getConfirmation(state),
      selectCard,
      deselectCard,
      requestRemove,
      cancelRemove,
      confirmRemove,
      addFromPicker,
    }),
    [
      state,
      hydrated,
      selectCard,
      deselectCard,
      requestRemove,
      cancelRemove,
      confirmRemove,
      addFromPicker,
    ],
  );

  return <InnerCircleContext.Provider value={value}>{children}</InnerCircleContext.Provider>;
}

export function useInnerCircle(): InnerCircleValue {
  const value = useContext(InnerCircleContext);
  if (!value) throw new Error('useInnerCircle must be used inside <InnerCircleProvider>.');
  return value;
}
