// Recency formatter — human-readable "time since" labels for the
// activity row status line (T-SHELL-ACT-009).
//
// Exposed as a pure function so it can be snapshotted / property-tested
// without mocking system clock state — callers pass `now` explicitly.

export function recency(at: Date, now: Date = new Date()): string {
  const ms = now.getTime() - at.getTime();
  const minutes = Math.floor(ms / 60_000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'yesterday';
  if (days < 7) return `${days}d ago`;
  return at.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// Status string for a sent coordination. Crucially: when responseCount is
// zero we surface the recency line, never "0 responses" — that's a
// forbidden negative-state copy (T-SHELL-ACT-004, scripts/lint-antipatterns).
export function sentStatus(responseCount: number, sentAt: Date, now: Date = new Date()): string {
  if (responseCount > 0) {
    return `${responseCount} responded`;
  }
  return `Sent ${recency(sentAt, now)}`;
}

// Status for a received coordination. If the recipient has opted in, the
// "I might come too" line is the surface; otherwise the recency line.
export function receivedStatus(
  reciprocated: boolean,
  receivedAt: Date,
  now: Date = new Date(),
): string {
  if (reciprocated) return 'I might come too';
  return recency(receivedAt, now);
}
