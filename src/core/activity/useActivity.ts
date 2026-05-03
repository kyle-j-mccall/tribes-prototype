// useActivity — list-data hook for the Activity tab.
//
// Substrate fixture: returns a static set of plausible coordinations so
// the list renders, scrolls, and snapshots correctly. The real data
// layer ships in a later slice; consumers see the same { sent, received,
// isRefreshing, refetch } surface either way, so swapping the
// implementation won't ripple through the UI.

import { useCallback, useEffect, useState } from 'react';

import type { ReceivedCoordination, SentCoordination } from './types';

export interface ActivityState {
  sent: SentCoordination[];
  received: ReceivedCoordination[];
  isRefreshing: boolean;
  refetch: () => Promise<void>;
}

function fixture(now: Date): { sent: SentCoordination[]; received: ReceivedCoordination[] } {
  const minutes = (n: number) => new Date(now.getTime() - n * 60_000);
  const hours = (n: number) => minutes(n * 60);
  const days = (n: number) => hours(n * 24);

  return {
    sent: [
      {
        kind: 'sent',
        id: 'c-001',
        body: 'beach day saturday — bring something cold',
        recipients: [
          { id: 'p-1', name: 'Priya' },
          { id: 'p-2', name: 'Marco' },
          { id: 'p-3', name: 'Luna' },
          { id: 'p-4', name: 'Theo' },
        ],
        responseCount: 3,
        sentAt: hours(2),
      },
      {
        kind: 'sent',
        id: 'c-002',
        body: 'thursday walk before it gets dark',
        recipients: [
          { id: 'p-5', name: 'Imani' },
          { id: 'p-6', name: 'Kit' },
        ],
        responseCount: 0,
        sentAt: hours(8),
      },
    ],
    received: [
      {
        kind: 'received',
        id: 'c-100',
        body: 'porch hangout sunday afternoon',
        sender: { id: 'p-7', name: 'Dana' },
        reciprocated: true,
        receivedAt: hours(5),
      },
      {
        kind: 'received',
        id: 'c-101',
        body: 'climbing wednesday if anyone wants in',
        sender: { id: 'p-8', name: 'Rae' },
        receivedAt: days(1),
      },
    ],
  };
}

export function useActivity(): ActivityState {
  const [state, setState] = useState(() => fixture(new Date()));
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    // Hydrate on mount. The real hook will subscribe to the data layer
    // here; the fixture form just re-evaluates timestamps so recency
    // labels are accurate against the current `now`.
    setState(fixture(new Date()));
  }, []);

  const refetch = useCallback(async () => {
    setIsRefreshing(true);
    try {
      // Real refetch goes here. For substrate, we re-snapshot the
      // fixture so timestamps stay sensible after a pull-to-refresh.
      await new Promise<void>((resolve) => setTimeout(resolve, 250));
      setState(fixture(new Date()));
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  return { sent: state.sent, received: state.received, isRefreshing, refetch };
}
