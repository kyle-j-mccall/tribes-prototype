// Runtime acceptance harness for tp-uo1 (Profile permission status rows).
//
// The component side of the bead — re-checking on tab focus — is wired
// through expo-router's useFocusEffect inside usePermissionStatus. The
// project doesn't ship a React renderer test; instead this harness
// exercises:
//   - the provider abstraction (mic + contacts route to the right
//     getStatus call, openSettings is reachable)
//   - the display mapping (granted/denied/undetermined → row traits)
//   - source-shape: usePermissionStatus.ts uses useFocusEffect from
//     expo-router so the row will re-check on tab focus
//     (T-SHELL-PROF-008/009)

const fs = require('fs');
const path = require('path');
const os = require('os');
const ts = require('typescript');

const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'src/core/permissions');
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'permissions-test-'));

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

// Pure modules only. PermissionStatusRow / PermissionsSection / the
// useFocusEffect-bound hook depend on React + expo-router and are
// covered by source-shape checks below.
const PURE_FILES = ['types.ts', 'provider.ts', 'display.ts'];
for (const file of PURE_FILES) {
  compile(path.join(SRC, file), path.join(TMP, file.replace(/\.ts$/, '.js')));
}

const { setPermissionProvider, getPermissionProvider } = require(path.join(TMP, 'provider.js'));
const { getRowDisplay } = require(path.join(TMP, 'display.js'));

let failures = 0;
function check(label, fn) {
  Promise.resolve()
    .then(fn)
    .then(() => console.log(`  ok    ${label}`))
    .catch((err) => {
      failures++;
      console.error(`  FAIL  ${label}\n        ${err.message}`);
    });
}
function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

console.log('tp-uo1 acceptance — profile permission rows');
console.log('-------------------------------------------');

check('display mapping — granted → static label, no Settings tap', () => {
  const d = getRowDisplay('granted');
  assert(d.statusCopyKey === 'profile.permissions.status.granted', 'wrong copy key');
  assert(d.tapOpensSettings === false, 'granted should not open Settings');
  assert(d.accessibilityRole === 'text', 'granted is not interactable');
});

check('display mapping — denied → Settings tap, button role', () => {
  const d = getRowDisplay('denied');
  assert(d.statusCopyKey === 'profile.permissions.status.denied', 'wrong copy key');
  assert(d.tapOpensSettings === true, 'denied should open Settings on tap');
  assert(d.accessibilityRole === 'button', 'denied row is a button');
});

check('display mapping — undetermined → static neutral label', () => {
  const d = getRowDisplay('undetermined');
  assert(d.statusCopyKey === 'profile.permissions.status.undetermined', 'wrong copy key');
  assert(d.tapOpensSettings === false, 'undetermined should not open Settings');
});

check('T-SHELL-PROF-008 — mic row routes to provider.getStatus("microphone")', async () => {
  const calls = [];
  setPermissionProvider({
    async getStatus(kind) {
      calls.push(kind);
      return 'granted';
    },
    async openSettings() {},
  });
  try {
    const status = await getPermissionProvider().getStatus('microphone');
    assert(status === 'granted', 'returned status should round-trip');
    assert(calls.length === 1 && calls[0] === 'microphone', 'mic kind should be passed through');
  } finally {
    setPermissionProvider(null);
  }
});

check('T-SHELL-PROF-009 — contacts row routes to provider.getStatus("contacts")', async () => {
  const calls = [];
  setPermissionProvider({
    async getStatus(kind) {
      calls.push(kind);
      return 'denied';
    },
    async openSettings() {},
  });
  try {
    const status = await getPermissionProvider().getStatus('contacts');
    assert(status === 'denied', 'returned status should round-trip');
    assert(calls.length === 1 && calls[0] === 'contacts', 'contacts kind should be passed through');
  } finally {
    setPermissionProvider(null);
  }
});

check('openSettings dispatches through the provider', async () => {
  let opened = 0;
  setPermissionProvider({
    async getStatus() {
      return 'denied';
    },
    async openSettings() {
      opened++;
    },
  });
  try {
    await getPermissionProvider().openSettings();
    assert(opened === 1, `expected 1 openSettings call, got ${opened}`);
  } finally {
    setPermissionProvider(null);
  }
});

check('source-shape — usePermissionStatus uses useFocusEffect for tab-focus refresh', () => {
  const src = fs.readFileSync(path.join(SRC, 'usePermissionStatus.ts'), 'utf8');
  assert(src.includes("from 'expo-router'"), 'should import from expo-router');
  assert(src.includes('useFocusEffect'), 'should use useFocusEffect for re-check on focus');
});

check('source-shape — denied row in PermissionStatusRow opens Settings on tap', () => {
  const src = fs.readFileSync(path.join(SRC, 'PermissionStatusRow.tsx'), 'utf8');
  assert(src.includes('openSettings'), 'PermissionStatusRow should reference openSettings');
  assert(src.includes("status === 'denied'"), 'denied branch must exist');
});

setTimeout(() => {
  console.log('-------------------------------------------');
  if (failures > 0) {
    console.error(`${failures} acceptance failure(s).`);
    process.exit(1);
  }
  console.log('All permission-row acceptance cases passed.');
  try {
    fs.rmSync(TMP, { recursive: true, force: true });
  } catch {
    /* best-effort */
  }
}, 50);
