// Deep-link queue — survives a cold-start auth gate.
//
// When an unauthed user follows a push or in-app link, the auth gate
// routes them to onboarding (T-SHELL-ROUTE-008). The intended target is
// queued here and replayed after the user finishes onboarding and
// completes their first send (T-SHELL-ROUTE-009). The "after first send"
// timing is deliberate — we want the user to feel the core loop once
// before being yanked into another flow.
//
// Persistence is delegated to src/core/storage/storage so swapping in
// AsyncStorage later is a one-line change.

import { storage } from '../storage';
import type { DeepLinkTarget } from './routes';

const QUEUE_KEY = 'shell.deepLink.queue';

export async function queueDeepLink(target: DeepLinkTarget): Promise<void> {
  await storage.setItem(QUEUE_KEY, JSON.stringify(target));
}

export async function peekDeepLink(): Promise<DeepLinkTarget | null> {
  const raw = await storage.getItem(QUEUE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as DeepLinkTarget;
  } catch {
    await storage.removeItem(QUEUE_KEY);
    return null;
  }
}

export async function popDeepLink(): Promise<DeepLinkTarget | null> {
  const target = await peekDeepLink();
  if (target) await storage.removeItem(QUEUE_KEY);
  return target;
}
