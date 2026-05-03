// Catch-all for unknown deep-link paths (T-SHELL-ROUTE-011).
//
// expo-router renders +not-found whenever a route doesn't resolve. We
// redirect to /(tabs) — Send is the safe landing surface and the tab
// scaffold is always available.

import { Redirect } from 'expo-router';

export default function NotFoundScreen() {
  return <Redirect href="/(tabs)" />;
}
