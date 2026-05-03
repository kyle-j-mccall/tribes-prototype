// copy() — typed string lookup keyed by CopyKey + Register.
//
// CopyKey is derived from copy.json via `keyof typeof copyRegistry`, so
// referencing a missing key is a compile-time error (T-FOUND-COPY-007).
// Drift between code and registry is caught by scripts/check-copy-registry.js
// (T-FOUND-COPY-008).

import copyRegistry from './copy.json';
import type { Register } from './registerSignals';

export type CopyKey = keyof typeof copyRegistry;

export interface CopyOptions {
  register: Register;
  vars?: Record<string, string>;
}

const PLACEHOLDER = /\{(\w+)\}/g;

export function copy(key: CopyKey, opts: CopyOptions): string {
  const template = copyRegistry[key][opts.register];
  const vars = opts.vars;
  if (!vars) return template;
  return template.replace(PLACEHOLDER, (match, name: string) => {
    const value = vars[name];
    return value ?? match;
  });
}
