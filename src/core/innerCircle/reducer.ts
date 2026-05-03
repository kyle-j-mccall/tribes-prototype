// Pure reducer + selectors for the inner-circle profile screen.
//
// Two-step removal interaction (per 02-app-shell §4):
//   idle              — no card selected
//   select(id)        — card tap reveals the Remove affordance
//   requestRemove(id) — Remove tap opens the Foundation confirmation dialog
//   confirmRemove     — dialog confirm wipes the contact, returns to idle
//   cancelRemove      — dialog cancel closes the dialog, keeps the card
//
// Keeping the state machine pure lets the runtime test suite exercise every
// transition without rendering React (the project doesn't ship a component
// test runner; see scripts/test-inner-circle.js).

import type { InnerCircleContact } from './types';

export interface InnerCircleState {
  contacts: InnerCircleContact[];
  selectedId: string | null;
  confirmingRemovalId: string | null;
}

export const initialState: InnerCircleState = {
  contacts: [],
  selectedId: null,
  confirmingRemovalId: null,
};

export type Action =
  | { type: 'hydrate'; contacts: InnerCircleContact[] }
  | { type: 'add'; contact: InnerCircleContact }
  | { type: 'select'; id: string }
  | { type: 'deselect' }
  | { type: 'requestRemove'; id: string }
  | { type: 'cancelRemove' }
  | { type: 'confirmRemove' };

export function reducer(state: InnerCircleState, action: Action): InnerCircleState {
  switch (action.type) {
    case 'hydrate':
      return { ...state, contacts: action.contacts };
    case 'add': {
      if (state.contacts.some((c) => c.id === action.contact.id)) return state;
      return { ...state, contacts: [...state.contacts, action.contact] };
    }
    case 'select':
      return { ...state, selectedId: action.id };
    case 'deselect':
      return { ...state, selectedId: null };
    case 'requestRemove':
      return { ...state, confirmingRemovalId: action.id };
    case 'cancelRemove':
      return { ...state, confirmingRemovalId: null };
    case 'confirmRemove': {
      const targetId = state.confirmingRemovalId;
      if (!targetId) return state;
      return {
        contacts: state.contacts.filter((c) => c.id !== targetId),
        selectedId: null,
        confirmingRemovalId: null,
      };
    }
  }
}

export interface CardViewModel {
  contact: InnerCircleContact;
  isSelected: boolean;
}

export function getCards(state: InnerCircleState): CardViewModel[] {
  return state.contacts.map((contact) => ({
    contact,
    isSelected: state.selectedId === contact.id,
  }));
}

export interface ConfirmationViewModel {
  isOpen: boolean;
  contact: InnerCircleContact | null;
}

export function getConfirmation(state: InnerCircleState): ConfirmationViewModel {
  if (!state.confirmingRemovalId) return { isOpen: false, contact: null };
  const contact = state.contacts.find((c) => c.id === state.confirmingRemovalId) ?? null;
  return { isOpen: contact !== null, contact };
}
