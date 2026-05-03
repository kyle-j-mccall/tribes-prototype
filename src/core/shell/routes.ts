// Deep-link route table.
//
// Two URL spaces:
//
// 1. https://tribes.app/r/<token>  — receiver SMS link. We deliberately
//    do NOT register universal links / app associations for tribes.app, so
//    iOS opens these in Safari. The receiver page is web-only by design
//    (T-SHELL-ROUTE-001).
//
// 2. <scheme>://...  — first-party app deep links (push payloads, in-app
//    nudges). The scheme is whatever app.json declares.
//
// parseAppDeepLink returns the in-app target route, or null for unknown
// paths (T-SHELL-ROUTE-011 — caller falls back to /(tabs)).

export type AppRoute = '/(tabs)' | '/(tabs)/activity' | '/(tabs)/profile' | '/onboarding';

export interface ComposeTarget {
  pathname: '/(tabs)';
  params: { prefill?: string; event?: string };
}

export interface ActivityDetailTarget {
  pathname: '/activity/[id]';
  params: { id: string };
}

export interface PlainTarget {
  pathname: AppRoute;
  params?: Record<string, string>;
}

export type DeepLinkTarget = ComposeTarget | ActivityDetailTarget | PlainTarget;

export function parseAppDeepLink(url: string): DeepLinkTarget | null {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return null;
  }

  const path = parsed.pathname.replace(/^\/+/, '');
  const host = parsed.hostname;
  const head = host || path.split('/')[0] || '';

  if (head === 'compose') {
    const prefill = parsed.searchParams.get('prefill') ?? undefined;
    const event = parsed.searchParams.get('event') ?? undefined;
    const params: ComposeTarget['params'] = {};
    if (prefill) params.prefill = prefill;
    if (event) params.event = event;
    return { pathname: '/(tabs)', params };
  }

  if (head === 'activity') {
    const rest = host ? path : path.split('/').slice(1).join('/');
    const id = rest.split('/')[0] ?? '';
    if (id) return { pathname: '/activity/[id]', params: { id } };
  }

  return null;
}

// Tabs in display order. Send is the default (first-open after onboarding).
export const TABS = ['index', 'activity', 'profile'] as const;
export type TabName = (typeof TABS)[number];
