// V1 event registry. The shape of each entry is the typed payload contract
// for `track(name, payload)`. Adding or removing an event is a contract
// change — metric mappings in metrics.ts and downstream dashboards depend
// on the names and payloads here.

import type { Register } from '../copy/registerSignals';

export interface EventRegistry {
  'onboarding.welcome.viewed': Record<string, never>;
  'onboarding.first-send.tapped': { register: Register };
  'coordination.sent': {
    coordinationId: string;
    format: 'survey' | 'ambient';
    recipientCount: number;
  };
  'coordination.response.received': { coordinationId: string };
  'receiver.page.viewed': { coordinationId: string };
  'receiver.response.tapped': { coordinationId: string };
  'reciprocity-prompt.shown': { coordinationId: string };
  'reciprocity-prompt.actioned': { coordinationId: string };
  'friday-nudge.shown': Record<string, never>;
  'friday-nudge.actioned': Record<string, never>;
}

export type EventName = keyof EventRegistry;
export type EventPayload<E extends EventName> = EventRegistry[E];
