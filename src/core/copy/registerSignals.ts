// Copy-register signal store.
//
// Resolves a UserStats snapshot to a 'warm' or 'executive' register. Used by
// copy() (slice 1.5) and every screen that flexes copy. The resolver is pure:
// no I/O, no global reads, no mutation. Callers pass an explicit snapshot.
//
// Rules (per docs/shared-context.md "Copy Register Flex" + 01-foundation §3):
//   - lifetimeSends >= 3 AND responseRate > 0.7  -> executive
//   - innerCircleCount > 8                        -> executive (lean)
//   - dismissedWarmPromptCount >= 3               -> executive (lean)
//   - otherwise (incl. lifetimeSends < 3)         -> warm
//
// Why executive triggers are checked first: a high-volume coordinator with
// only 1 lifetime send on a fresh device should still resolve to executive
// once their inner-circle or dismissal signals fire. Strict top-to-bottom
// evaluation of the spec table would lock them into warm.

export type Register = 'warm' | 'executive';

export interface UserStats {
  lifetimeSends?: number;
  responseRate?: number;
  innerCircleCount?: number;
  dismissedWarmPromptCount?: number;
}

export function currentRegister(user: UserStats): Register {
  const lifetimeSends = user.lifetimeSends ?? 0;
  const responseRate = user.responseRate ?? 0;
  const innerCircleCount = user.innerCircleCount ?? 0;
  const dismissedWarmPromptCount = user.dismissedWarmPromptCount ?? 0;

  if (lifetimeSends >= 3 && responseRate > 0.7) return 'executive';
  if (innerCircleCount > 8) return 'executive';
  if (dismissedWarmPromptCount >= 3) return 'executive';
  return 'warm';
}
