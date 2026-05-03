// V1 metric → source-event mapping (per 01-foundation §6).
//
// The `satisfies` constraint statically guarantees every listed event is
// present in EventRegistry — adding a metric whose source events aren't
// registered fails typecheck. That is the T-FOUND-TELEM-005 enforcement
// point; the runtime check in the test suite is belt-and-suspenders.

import type { EventName } from './events';

export const V1_METRIC_SOURCES = {
  'time-to-first-send': ['onboarding.welcome.viewed', 'onboarding.first-send.tapped'],
  'first-send-response-rate': ['coordination.sent', 'coordination.response.received'],
  'receiver-response-rate-24h': ['receiver.page.viewed', 'receiver.response.tapped'],
  'reciprocity-prompt-actioned': ['reciprocity-prompt.shown', 'reciprocity-prompt.actioned'],
  'friday-nudge-actioned': ['friday-nudge.shown', 'friday-nudge.actioned'],
  'copy-register-at-first-send': ['onboarding.first-send.tapped'],
} as const satisfies Record<string, readonly EventName[]>;

export type V1Metric = keyof typeof V1_METRIC_SOURCES;
