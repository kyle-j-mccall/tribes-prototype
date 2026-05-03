// ComposerDraft — minimal in-progress send state.
//
// Slice 04 owns the composer screen and will extend this shape with
// format-specific bits (survey vs. ambient, time/place fields, etc.).
// The substrate keeps it intentionally narrow so the draft store and
// its persistence contract land first; widening the shape later is
// strictly additive.
//
// `sendStatus` exists so that an in-flight send can survive a tab
// switch (T-SHELL-EDGE-003). The state machine itself is slice 04's
// responsibility — substrate just allows the field to round-trip.

export type ComposerSendStatus = 'idle' | 'sending' | 'error' | 'sent';

export interface ComposerDraft {
  body: string;
  audience: string[];
  prefill?: string;
  event?: string;
  sendStatus?: ComposerSendStatus;
}

export const EMPTY_DRAFT: ComposerDraft = Object.freeze({
  body: '',
  audience: [],
});
