#!/usr/bin/env node
// Registry-completeness lint for the copy() API.
//
// Catches drift in BOTH directions:
//   1. CopyKey referenced in code but missing from copy.json
//   2. CopyKey defined in copy.json but never referenced in code
//
// Usage:
//   node scripts/check-copy-registry.js          # error on either direction
//   node scripts/check-copy-registry.js --seed   # tolerate unused keys (bootstrap)
//
// `--seed` mode is for the substrate phase (slice 1.5) when the registry has
// been planted but no screens consume copy() yet. Once slice 02+ wires up
// real callers, drop --seed from CI invocations.

const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const REGISTRY_PATH = path.join(ROOT, 'src/core/copy/copy.json');
const SCAN_DIRS = ['app', 'components', 'hooks', 'src'];
const SELF_FILES = new Set([
  path.join(ROOT, 'src/core/copy/copy.ts'),
  path.join(ROOT, 'src/core/copy/registerSignals.ts'),
]);

// Match calls like: copy('some.key', ...) or copy("some.key", ...).
// Intentionally narrow — we want false negatives over false positives, since
// dynamic keys would break the type contract anyway.
const COPY_CALL = /\bcopy\(\s*['"]([^'"]+)['"]/g;

function* walk(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name.startsWith('.')) continue;
      yield* walk(full);
    } else if (/\.(ts|tsx)$/.test(entry.name) && !SELF_FILES.has(full)) {
      yield full;
    }
  }
}

function loadRegistry() {
  const raw = fs.readFileSync(REGISTRY_PATH, 'utf8');
  const data = JSON.parse(raw);
  for (const [key, entry] of Object.entries(data)) {
    if (typeof entry !== 'object' || entry === null) {
      throw new Error(`Registry entry "${key}" must be an object`);
    }
    for (const register of ['warm', 'executive']) {
      if (typeof entry[register] !== 'string') {
        throw new Error(`Registry entry "${key}" missing string variant "${register}"`);
      }
    }
  }
  return new Set(Object.keys(data));
}

function collectCodeKeys() {
  const keys = new Set();
  for (const dir of SCAN_DIRS) {
    for (const file of walk(path.join(ROOT, dir))) {
      const src = fs.readFileSync(file, 'utf8');
      let m;
      while ((m = COPY_CALL.exec(src)) !== null) {
        keys.add(m[1]);
      }
    }
  }
  return keys;
}

function main() {
  const seedMode = process.argv.includes('--seed');
  const registryKeys = loadRegistry();
  const codeKeys = collectCodeKeys();

  const missingInRegistry = [...codeKeys].filter((k) => !registryKeys.has(k));
  const unusedInCode = [...registryKeys].filter((k) => !codeKeys.has(k));

  let failed = false;

  if (missingInRegistry.length) {
    failed = true;
    console.error('Copy keys referenced in code but missing from copy.json:');
    for (const k of missingInRegistry) console.error('  -', k);
  }

  if (unusedInCode.length) {
    if (seedMode) {
      console.warn(
        `(seed mode) ${unusedInCode.length} key(s) in copy.json not yet referenced in code:`,
      );
      for (const k of unusedInCode) console.warn('  -', k);
    } else {
      failed = true;
      console.error('Copy keys in copy.json but never referenced in code:');
      for (const k of unusedInCode) console.error('  -', k);
    }
  }

  if (failed) {
    console.error('\nCopy registry drift detected. Fix code or update copy.json.');
    process.exit(1);
  }

  console.log(
    `Copy registry clean: ${registryKeys.size} key(s) in registry, ${codeKeys.size} call site(s).`,
  );
}

main();
