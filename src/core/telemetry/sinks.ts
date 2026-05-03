// Sink implementations for the two non-test environments.
//
// Why firebaseSink is a factory rather than a hard import: the substrate
// stays pure-TS and unit-testable, and the Firebase package only loads in
// the app entry that actually needs it. App entry passes the bound
// logEvent reference at startup.

import type { Sink } from './track';

export const consoleSink: Sink = (name, payload) => {
  console.log(`[telemetry] ${name}`, payload);
};

export type LogEventFn = (name: string, params?: Record<string, unknown>) => void;

export function firebaseSink(logEvent: LogEventFn): Sink {
  return (name, payload) => {
    logEvent(name, payload);
  };
}
