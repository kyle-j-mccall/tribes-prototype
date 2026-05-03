// track() — the only emission path for V1 telemetry.
//
// Default sink is a no-op so tests pay nothing and never accidentally log.
// App entry calls setSink() once at startup (see sinks.ts). Tests call
// installSpy() to capture events; the spy restores the previous sink on
// uninstall so suites don't leak state into one another.

import type { EventName, EventPayload } from './events';

export type Sink = (name: EventName, payload: Record<string, unknown>) => void;

const noopSink: Sink = () => {};
let activeSink: Sink = noopSink;

export function setSink(sink: Sink): void {
  activeSink = sink;
}

export function resetSink(): void {
  activeSink = noopSink;
}

export function track<E extends EventName>(name: E, payload: EventPayload<E>): void {
  activeSink(name, payload);
}

export interface CapturedEvent {
  name: EventName;
  payload: Record<string, unknown>;
}

export interface Spy {
  events: CapturedEvent[];
  uninstall: () => void;
}

export function installSpy(): Spy {
  const events: CapturedEvent[] = [];
  const previous = activeSink;
  activeSink = (name, payload) => {
    events.push({ name, payload });
  };
  return {
    events,
    uninstall: () => {
      activeSink = previous;
    },
  };
}
