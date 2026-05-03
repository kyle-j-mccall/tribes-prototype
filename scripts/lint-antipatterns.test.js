// Acceptance harness for tp-d6d. Each `case()` corresponds to one
// T-FOUND-LINT-xxx test ID from the bead. Failures print which case broke
// and exit non-zero. Run via `npm run test:antipatterns`.

const fs = require('fs');
const path = require('path');
const os = require('os');
const { scanFile } = require('./lint-antipatterns');

const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'antipattern-fixtures-'));

let failures = 0;

function write(rel, content) {
  const abs = path.join(TMP, rel);
  fs.mkdirSync(path.dirname(abs), { recursive: true });
  fs.writeFileSync(abs, content, 'utf8');
  return abs;
}

function run(fixtureRel, content, expect, label) {
  const abs = write(fixtureRel, content);
  // Pass the fixture's logical rel as the second arg so install-prompt /
  // receiver-page path detection sees the intended path shape.
  const violations = scanFile(abs, fixtureRel);
  const got = violations.length;
  let ok;
  if (typeof expect === 'number') {
    ok = got === expect;
  } else if (typeof expect === 'function') {
    ok = expect(violations);
  }
  if (ok) {
    console.log(`  ok    ${label} (${got} violation${got === 1 ? '' : 's'})`);
  } else {
    failures++;
    console.error(`  FAIL  ${label}`);
    console.error(`        expected ${expect}, got ${got}`);
    for (const v of violations) console.error(`        - ${v.file}:${v.line}  ${v.message}`);
  }
}

console.log('tp-d6d acceptance — anti-pattern lint suite');
console.log('--------------------------------------------');

run(
  'app/maybe.tsx',
  `export const Msg = () => <Text>Maybe</Text>;\n`,
  (v) => v.length >= 1 && v.some((x) => /maybe/i.test(x.message)),
  'T-FOUND-LINT-001 — "Maybe" in user-facing string fails',
);

run(
  'app/zero-responses.tsx',
  `export const Msg = () => <Text>0 responses today</Text>;\n`,
  (v) => v.length >= 1 && v.some((x) => /0 responses/i.test(x.message)),
  'T-FOUND-LINT-002 — "0 responses" fails',
);

run(
  'app/label-ring.tsx',
  `export function LabelRing() { return null; }\n`,
  (v) => v.some((x) => /LabelRing/.test(x.message)),
  'T-FOUND-LINT-003 — component named LabelRing fails',
);

run(
  'app/own-plans-archive.tsx',
  `export function OwnPlansArchive() { return null; }\n`,
  (v) => v.some((x) => /OwnPlansArchive/.test(x.message)),
  'T-FOUND-LINT-004 — component named OwnPlansArchive fails',
);

run(
  'app/cta.tsx',
  `export const Msg = () => <Text>Get the app</Text>;\n`,
  (v) => v.some((x) => /get the app/i.test(x.message)),
  'T-FOUND-LINT-005 — "Get the app" outside install-prompt fails',
);

run(
  'components/install-prompt/index.tsx',
  `export const Msg = () => <Text>Get the app</Text>;\n`,
  0,
  'T-FOUND-LINT-006 — "Get the app" inside install-prompt passes',
);

run(
  'app/glossary.tsx',
  `// allow-anti: glossary-only\nexport const term = 'maybe';\n`,
  0,
  'T-FOUND-LINT-007 — "// allow-anti: glossary-only" suppresses on that line',
);

run(
  'app/brand-soul-misuse.tsx',
  `export const Msg = () => <Text>Priya's thinking about Saturday</Text>;\n`,
  (v) => v.some((x) => /brand-soul/i.test(x.message)),
  'T-FOUND-LINT-008 — brand-soul frame outside BRAND_SOUL_LINE fails',
);

run(
  'app/brand-soul-constant.tsx',
  `export const BRAND_SOUL_LINE = "{name}'s thinking about {day} and was thinking about you";\n`,
  0,
  'T-FOUND-LINT-009 — BRAND_SOUL_LINE constant itself does not trigger',
);

run(
  'app/receiver/page.tsx',
  `// receiver-page\nexport const Page = () => <Stat count={5} />;\n`,
  (v) => v.some((x) => /count prop/i.test(x.message)),
  'T-FOUND-LINT-010 — count prop on receiver-page component fails',
);

run(
  'app/stat.tsx',
  `export const Msg = () => <Text>5 people thought of you this month</Text>;\n`,
  (v) => v.some((x) => /this week\/month/i.test(x.message) || /recurring/i.test(x.message)),
  'T-FOUND-LINT-011 — "this month" adjacent to numeric stat fails',
);

run(
  'app/declined.tsx',
  `export const Msg = () => <Text>Sara declined.</Text>;\n`,
  (v) => v.some((x) => /declined/i.test(x.message)),
  'T-FOUND-LINT-012 — "declined" fails',
);

console.log('--------------------------------------------');
if (failures > 0) {
  console.error(`${failures} acceptance failure(s).`);
  process.exit(1);
}
console.log('All acceptance cases passed.');

// Cleanup temp fixtures.
try {
  fs.rmSync(TMP, { recursive: true, force: true });
} catch {
  /* best-effort */
}
