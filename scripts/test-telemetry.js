// Runtime acceptance harness for tp-tkg.
//
// Compiles the telemetry sources to JS in a temp dir using the bundled
// `typescript` package, then exercises the runtime contract:
//   - T-FOUND-TELEM-001: track() is a no-op by default
//   - T-FOUND-TELEM-002: spy installs cleanly and captures event + payload
//   - T-FOUND-TELEM-005: every V1 metric has at least one source event
//   - T-FOUND-TELEM-006: prod (Firebase) and dev (console) sinks both wire
//
// T-FOUND-TELEM-003 and T-FOUND-TELEM-004 are compile-time tests; they live
// in src/core/telemetry/types.test-d.ts and are validated by `npm run
// typecheck`.

const fs = require('fs');
const path = require('path');
const os = require('os');
const ts = require('typescript');

const ROOT = path.resolve(__dirname, '..');
const TELEM_SRC = path.join(ROOT, 'src/core/telemetry');
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'telemetry-test-'));

function compile(srcPath, destPath) {
  const text = fs.readFileSync(srcPath, 'utf8');
  const out = ts.transpileModule(text, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
      esModuleInterop: true,
    },
    fileName: path.basename(srcPath),
  });
  fs.mkdirSync(path.dirname(destPath), { recursive: true });
  fs.writeFileSync(destPath, out.outputText);
}

// Compile every telemetry .ts (skip type-only test fixtures and .d.ts).
for (const file of fs.readdirSync(TELEM_SRC)) {
  if (!file.endsWith('.ts') || file.endsWith('.d.ts') || file.endsWith('.test-d.ts')) continue;
  compile(path.join(TELEM_SRC, file), path.join(TMP, file.replace(/\.ts$/, '.js')));
}

// telemetry imports `Register` from ../copy/registerSignals as a *type
// only* — the import is erased at compile time. No need to compile the
// copy module.

const telemetry = require(path.join(TMP, 'index.js'));

let failures = 0;
function check(label, fn) {
  try {
    fn();
    console.log(`  ok    ${label}`);
  } catch (err) {
    failures++;
    console.error(`  FAIL  ${label}`);
    console.error(`        ${err.message}`);
  }
}
function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

console.log('tp-tkg acceptance — telemetry');
console.log('-----------------------------');

check('T-FOUND-TELEM-001 — track() is a no-op by default', () => {
  // No sink installed; calling track must not throw or emit anywhere.
  telemetry.resetSink();
  telemetry.track('onboarding.welcome.viewed', {});
  telemetry.track('coordination.sent', {
    coordinationId: 'c1',
    format: 'survey',
    recipientCount: 1,
  });
});

check('T-FOUND-TELEM-002 — installSpy captures event + payload, uninstall restores', () => {
  telemetry.resetSink();
  const spy = telemetry.installSpy();
  telemetry.track('coordination.sent', {
    coordinationId: 'c1',
    format: 'survey',
    recipientCount: 3,
  });
  telemetry.track('friday-nudge.shown', {});
  assert(spy.events.length === 2, `expected 2 captured events, got ${spy.events.length}`);
  assert(spy.events[0].name === 'coordination.sent', 'first event name mismatch');
  assert(spy.events[0].payload.coordinationId === 'c1', 'first event payload mismatch');
  assert(spy.events[0].payload.recipientCount === 3, 'first event recipientCount mismatch');
  assert(spy.events[1].name === 'friday-nudge.shown', 'second event name mismatch');
  spy.uninstall();
  telemetry.track('onboarding.welcome.viewed', {});
  assert(spy.events.length === 2, 'spy captured events after uninstall');
});

check('T-FOUND-TELEM-005 — every V1 metric has at least one source event', () => {
  const sources = telemetry.V1_METRIC_SOURCES;
  const expectedMetrics = [
    'time-to-first-send',
    'first-send-response-rate',
    'receiver-response-rate-24h',
    'reciprocity-prompt-actioned',
    'friday-nudge-actioned',
    'copy-register-at-first-send',
  ];
  for (const metric of expectedMetrics) {
    const events = sources[metric];
    assert(Array.isArray(events) && events.length > 0, `metric ${metric} has no source events`);
  }
});

check('T-FOUND-TELEM-006a — consoleSink writes to stdout (dev wiring)', () => {
  const calls = [];
  const original = console.log;
  console.log = (...args) => calls.push(args);
  try {
    telemetry.consoleSink('friday-nudge.shown', {});
  } finally {
    console.log = original;
  }
  assert(calls.length === 1, 'consoleSink did not log');
  assert(
    String(calls[0][0]).includes('friday-nudge.shown'),
    'consoleSink output missing event name',
  );
});

check('T-FOUND-TELEM-006b — firebaseSink delegates to injected logEvent (prod wiring)', () => {
  const seen = [];
  const sink = telemetry.firebaseSink((name, params) => seen.push({ name, params }));
  sink('reciprocity-prompt.actioned', { coordinationId: 'c9' });
  assert(seen.length === 1, 'firebaseSink did not delegate');
  assert(seen[0].name === 'reciprocity-prompt.actioned', 'firebaseSink wrong event name');
  assert(seen[0].params.coordinationId === 'c9', 'firebaseSink wrong payload');
});

check('T-FOUND-TELEM-006c — track() routes through the active sink', () => {
  const seen = [];
  telemetry.setSink((name, payload) => seen.push({ name, payload }));
  telemetry.track('receiver.page.viewed', { coordinationId: 'c2' });
  telemetry.resetSink();
  // After reset, further calls are no-ops.
  telemetry.track('receiver.page.viewed', { coordinationId: 'c3' });
  assert(seen.length === 1, `expected 1 routed event, got ${seen.length}`);
  assert(seen[0].name === 'receiver.page.viewed', 'wrong routed event name');
});

console.log('-----------------------------');
if (failures > 0) {
  console.error(`${failures} acceptance failure(s).`);
  process.exit(1);
}
console.log('All telemetry acceptance cases passed.');

try {
  fs.rmSync(TMP, { recursive: true, force: true });
} catch {
  /* best-effort */
}
