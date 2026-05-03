// Compile-time assertions for the telemetry contract. The file's job is
// to drive `tsc --noEmit` to confirm:
//   - T-FOUND-TELEM-003: track('not.in.registry', {}) is a TypeScript error
//   - T-FOUND-TELEM-004: unknown payload key on a registered event errors
//
// Each negative case carries a `// @ts-expect-error` directive — TypeScript
// will fail compile if the line beneath it does NOT error, so passing
// typecheck IS the test passing.

import { track } from './track';

// Positive controls — these must compile.
track('onboarding.welcome.viewed', {});
track('onboarding.first-send.tapped', { register: 'warm' });
track('coordination.sent', { coordinationId: 'c1', format: 'survey', recipientCount: 5 });
track('friday-nudge.actioned', {});

// T-FOUND-TELEM-003: event not in registry.
// @ts-expect-error — event name not in registry
track('not.in.registry', {});

// T-FOUND-TELEM-004: excess key on registered event. (Single-line so the
// directive's one-line scope catches the error.)
// prettier-ignore
// @ts-expect-error — extra payload property is not part of the event type
track('coordination.sent', { coordinationId: 'c1', format: 'survey', recipientCount: 5, extra: 'nope' });

// T-FOUND-TELEM-004 (negative space): missing required payload key.
// @ts-expect-error — register is required on onboarding.first-send.tapped
track('onboarding.first-send.tapped', {});

// T-FOUND-TELEM-004 (wrong literal): payload key with disallowed value.
// @ts-expect-error — format must be 'survey' | 'ambient'
track('coordination.sent', { coordinationId: 'c1', format: 'broadcast', recipientCount: 1 });
