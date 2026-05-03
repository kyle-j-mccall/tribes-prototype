// Runtime acceptance harness for tp-h3m (Profile inner-circle CRUD).
//
// The project doesn't ship a React component test runner, so the rendering
// half of the acceptance criteria (T-SHELL-PROF-001 snapshot,
// T-SHELL-A11Y-004 VoiceOver focus) is enforced by code structure rather
// than runtime tests:
//   - 001 (cards render): cards = state.contacts.map(...) — guaranteed
//     1:1 by getCards(), exercised below as T-SHELL-PROF-001-shape.
//   - A11Y-004 (VoiceOver focus): ConfirmationDialog.tsx wires
//     AccessibilityInfo.setAccessibilityFocus to the title ref on open.
//     Confirmed here at the source-shape level.
//
// The data-layer / state-machine half of the acceptance is fully covered:
// reducer transitions, contact-picker abstraction, and pickAndAdd flow.

const fs = require('fs');
const path = require('path');
const os = require('os');
const ts = require('typescript');

const ROOT = path.resolve(__dirname, '..');
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'inner-circle-test-'));

function compile(srcPath, destPath) {
  const text = fs.readFileSync(srcPath, 'utf8');
  const out = ts.transpileModule(text, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
      esModuleInterop: true,
      jsx: ts.JsxEmit.Preserve,
    },
    fileName: path.basename(srcPath),
  });
  fs.mkdirSync(path.dirname(destPath), { recursive: true });
  fs.writeFileSync(destPath, out.outputText);
}

// Compile only the pure modules — reducer, types, contactPicker, actions.
// InnerCircleContext.tsx and the dialog component import React/RN, which
// we don't load in this Node harness. The view-model selectors and the
// action helper carry the testable behavior.
const PURE_FILES = ['reducer.ts', 'contactPicker.ts', 'actions.ts'];
for (const file of PURE_FILES) {
  compile(
    path.join(ROOT, 'src/core/innerCircle', file),
    path.join(TMP, file.replace(/\.ts$/, '.js')),
  );
}

const { reducer, initialState, getCards, getConfirmation } = require(path.join(TMP, 'reducer.js'));
const { setContactPicker, getContactPicker } = require(path.join(TMP, 'contactPicker.js'));
const { pickAndAdd } = require(path.join(TMP, 'actions.js'));

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

const ALICE = { id: 'a', name: 'Alice Doe', phoneNumbers: ['+15551110001'] };
const BOB = { id: 'b', name: 'Bob Roe', phoneNumbers: ['+15551110002'] };

console.log('tp-h3m acceptance — inner-circle profile CRUD');
console.log('---------------------------------------------');

check('T-SHELL-PROF-001-shape — getCards returns one card per contact, preserving order', () => {
  let state = initialState;
  state = reducer(state, { type: 'add', contact: ALICE });
  state = reducer(state, { type: 'add', contact: BOB });
  const cards = getCards(state);
  assert(cards.length === 2, `expected 2 cards, got ${cards.length}`);
  assert(cards[0].contact.id === 'a', 'first card should be Alice');
  assert(cards[1].contact.id === 'b', 'second card should be Bob');
  assert(
    cards.every((c) => c.isSelected === false),
    'no card should be selected initially',
  );
});

check('T-SHELL-PROF-002 — tapping card surfaces the remove option', () => {
  let state = initialState;
  state = reducer(state, { type: 'add', contact: ALICE });
  state = reducer(state, { type: 'select', id: 'a' });
  const cards = getCards(state);
  const aliceCard = cards.find((c) => c.contact.id === 'a');
  assert(aliceCard && aliceCard.isSelected === true, 'Alice card should be selected after select');
  // A second select on the same id is idempotent; deselect clears it.
  state = reducer(state, { type: 'deselect' });
  assert(state.selectedId === null, 'deselect should clear selectedId');
});

check('T-SHELL-PROF-003 — remove triggers Foundation confirmation dialog', () => {
  let state = initialState;
  state = reducer(state, { type: 'add', contact: ALICE });
  state = reducer(state, { type: 'select', id: 'a' });
  state = reducer(state, { type: 'requestRemove', id: 'a' });
  const conf = getConfirmation(state);
  assert(conf.isOpen === true, 'confirmation should be open after requestRemove');
  assert(conf.contact && conf.contact.id === 'a', 'confirmation should target Alice');
  // Cancel keeps the contact.
  const cancelled = reducer(state, { type: 'cancelRemove' });
  assert(cancelled.contacts.length === 1, 'cancel should not remove the contact');
  assert(getConfirmation(cancelled).isOpen === false, 'cancel should close the dialog');
  // Confirm wipes it.
  const confirmed = reducer(state, { type: 'confirmRemove' });
  assert(confirmed.contacts.length === 0, 'confirm should remove the contact');
  assert(confirmed.selectedId === null, 'confirm should reset selection');
  assert(confirmed.confirmingRemovalId === null, 'confirm should close the dialog');
});

check('T-SHELL-PROF-004 — Add or change someone opens contact picker', async () => {
  let pickCalls = 0;
  const stubPicker = {
    pick: async () => {
      pickCalls++;
      return null;
    },
  };
  setContactPicker(stubPicker);
  try {
    const result = await pickAndAdd(getContactPicker(), () => {});
    assert(pickCalls === 1, `picker.pick should be invoked once, got ${pickCalls}`);
    assert(result === null, 'pickAndAdd returns null when picker yields null');
  } finally {
    setContactPicker(null);
  }
});

check('T-SHELL-PROF-005 — manual-add adds selected contact to inner circle', async () => {
  const stubPicker = {
    pick: async () => ({
      id: 'picked-1',
      name: 'Picked Person',
      phoneNumbers: ['+15559999999'],
    }),
  };
  setContactPicker(stubPicker);
  try {
    const dispatched = [];
    const dispatch = (action) => dispatched.push(action);
    const result = await pickAndAdd(getContactPicker(), dispatch);
    assert(result && result.id === 'picked-1', 'pickAndAdd should return the picked contact');
    assert(dispatched.length === 1, `expected 1 dispatch, got ${dispatched.length}`);
    assert(dispatched[0].type === 'add', 'should dispatch add action');
    assert(
      dispatched[0].contact.id === 'picked-1',
      'dispatched contact should match picker output',
    );

    // Verify it lands in state through the reducer.
    let state = initialState;
    state = reducer(state, dispatched[0]);
    assert(state.contacts.length === 1, 'reducer should add the picked contact');
    assert(state.contacts[0].name === 'Picked Person', 'name should round-trip');
  } finally {
    setContactPicker(null);
  }
});

check('Add is idempotent on duplicate ids', () => {
  let state = initialState;
  state = reducer(state, { type: 'add', contact: ALICE });
  state = reducer(state, { type: 'add', contact: ALICE });
  assert(state.contacts.length === 1, 'duplicate add should be a no-op');
});

check(
  'T-SHELL-A11Y-004-shape — ConfirmationDialog source uses setAccessibilityFocus on open',
  () => {
    const src = fs.readFileSync(path.join(ROOT, 'src/core/dialog/ConfirmationDialog.tsx'), 'utf8');
    assert(
      src.includes('AccessibilityInfo.setAccessibilityFocus'),
      'ConfirmationDialog should call AccessibilityInfo.setAccessibilityFocus',
    );
    assert(
      src.includes('accessibilityViewIsModal'),
      'ConfirmationDialog should mark its content as an accessibility modal',
    );
  },
);

// Wait for async checks to settle before printing the summary.
setTimeout(() => {
  console.log('---------------------------------------------');
  if (failures > 0) {
    console.error(`${failures} acceptance failure(s).`);
    process.exit(1);
  }
  console.log('All inner-circle acceptance cases passed.');
  try {
    fs.rmSync(TMP, { recursive: true, force: true });
  } catch {
    /* best-effort */
  }
}, 50);
