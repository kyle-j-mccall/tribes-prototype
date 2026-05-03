// V1 anti-pattern scanner. Enforces the forbidden list from
// docs/shared-context.md "Anti-Patterns" and tp-d6d acceptance criteria.
//
// Scans .ts/.tsx/.js/.jsx (string literals, template texts, JSX text) plus
// any copy.json files. Per-line escape hatch: `// allow-anti: <reason>`.
//
// Why a custom scanner instead of pure ESLint rules: several rules need
// JSON inspection, project-shape awareness (receiver-page directive,
// install-prompt module path), and BRAND_SOUL_LINE allow-listing — all
// awkward inside ESLint's per-file rule API.

const fs = require('fs');
const path = require('path');
const ts = require('typescript');

const ROOT = process.cwd();
const SKIP_DIRS = new Set([
  'node_modules',
  '.expo',
  'dist',
  '.git',
  '.runtime',
  '.beads',
  '.claude',
  '.husky',
  '.vscode',
  'ios',
  'android',
  'assets',
  'web-build',
]);
// The scanner files themselves and their fixtures necessarily contain the
// forbidden tokens. Skip wholesale.
const SKIP_PATH_FRAGMENTS = [
  path.join('scripts', 'lint-antipatterns.js'),
  path.join('scripts', 'lint-antipatterns.test.js'),
  path.join('scripts', '__antipattern_fixtures__'),
  // Style-guide and product docs reference forbidden patterns by name to
  // describe them. They are not user-facing copy.
  'style-guide' + path.sep,
  'docs' + path.sep,
  'CLAUDE.md',
  'CLAUDE.local.md',
  'README.md',
];

const FORBIDDEN_COMPONENTS = new Set([
  'OwnPlansArchive',
  'PlanHistory',
  'ResponseCounter',
  'PublicFeed',
  'LifeDomain',
  'LabelRing',
  'FlickPhysics',
]);

const FORBIDDEN_SUBSTRINGS = [
  { pattern: /\bmaybe\b/i, message: '"maybe" leaks ambivalence (V1 anti-pattern)' },
  { pattern: /\bdeclined\b/i, message: '"declined" — negative-state copy forbidden' },
  { pattern: /\brejected\b/i, message: '"rejected" — negative-state copy forbidden' },
  { pattern: /didn['’]t make it/i, message: '"didn\'t make it" — negative-state copy forbidden' },
  { pattern: /\bno responses\b/i, message: '"no responses" — negative-state copy forbidden' },
  { pattern: /\b0 responses\b/i, message: '"0 responses" — negative-state copy forbidden' },
];

// "this month" / "this week" adjacent to a numeric stat — within ~40 chars
// either side of a digit, in the same literal.
const RECURRING_STAT_PATTERN =
  /(\bthis (?:week|month)\b[^]{0,40}\d)|(\d[^]{0,40}\bthis (?:week|month)\b)/i;

const INSTALL_PROMPT_TOKENS = [
  { pattern: /\bdownload tribes\b/i, message: '"download tribes" outside install-prompt' },
  { pattern: /\bget the app\b/i, message: '"get the app" outside install-prompt' },
];

// The invariant brand-soul receiver-line frame. Allowed only inside the
// BRAND_SOUL_LINE constant declaration.
const BRAND_SOUL_FRAME = /'s thinking about/i;
const BRAND_SOUL_CONST_NAME = 'BRAND_SOUL_LINE';

function isReceiverPagePath(rel) {
  // app/receiver/** is the canonical location; any file may also opt in
  // with a `// receiver-page` directive (see scanFile).
  return rel.split(path.sep).includes('receiver') && rel.includes(path.join('app', 'receiver'));
}

function isInstallPromptPath(rel) {
  // Files anywhere under a directory segment named install-prompt, or any
  // file whose name contains install-prompt.
  const parts = rel.split(path.sep);
  return parts.some((p) => p === 'install-prompt' || p.includes('install-prompt'));
}

function shouldSkipPath(rel) {
  for (const frag of SKIP_PATH_FRAGMENTS) {
    if (rel === frag || rel.startsWith(frag) || rel.includes(path.sep + frag)) return true;
  }
  return false;
}

function walk(dir, out) {
  for (const name of fs.readdirSync(dir)) {
    if (SKIP_DIRS.has(name)) continue;
    const full = path.join(dir, name);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      walk(full, out);
    } else {
      out.push(full);
    }
  }
  return out;
}

function lineOfPos(text, pos) {
  let line = 1;
  for (let i = 0; i < pos && i < text.length; i++) {
    if (text.charCodeAt(i) === 10) line++;
  }
  return line;
}

// Build a set of line numbers (1-based) that have an allow-anti escape on
// that line OR the line immediately before it.
function buildAllowAntiLines(source) {
  const allowed = new Set();
  const lines = source.split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    if (/\/\/\s*allow-anti\s*:/.test(lines[i])) {
      // Permit on this line and the next line (so a block-comment header
      // can grant the next statement a pass).
      allowed.add(i + 1);
      allowed.add(i + 2);
    }
  }
  return allowed;
}

function hasReceiverPageDirective(source) {
  return /^\s*\/\/\s*receiver-page\b/m.test(source);
}

function findBrandSoulLineRanges(sourceFile) {
  // Return [start, end] ranges where the BRAND_SOUL_LINE constant value
  // lives — string literal positions that should bypass the brand-soul
  // frame check.
  const ranges = [];
  function visit(node) {
    if (
      ts.isVariableDeclaration(node) &&
      ts.isIdentifier(node.name) &&
      node.name.text === BRAND_SOUL_CONST_NAME &&
      node.initializer
    ) {
      ranges.push([node.initializer.getStart(sourceFile), node.initializer.getEnd()]);
    }
    ts.forEachChild(node, visit);
  }
  visit(sourceFile);
  return ranges;
}

function isInsideRange(pos, ranges) {
  for (const [s, e] of ranges) {
    if (pos >= s && pos <= e) return true;
  }
  return false;
}

function isModuleSpecifier(node) {
  // Skip import/export module specifiers — those are paths, not copy.
  const p = node.parent;
  if (!p) return false;
  return (
    (ts.isImportDeclaration(p) && p.moduleSpecifier === node) ||
    (ts.isExportDeclaration(p) && p.moduleSpecifier === node) ||
    (ts.isCallExpression(p) &&
      p.expression.kind === ts.SyntaxKind.ImportKeyword &&
      p.arguments[0] === node) ||
    (ts.isCallExpression(p) &&
      ts.isIdentifier(p.expression) &&
      p.expression.text === 'require' &&
      p.arguments[0] === node)
  );
}

function getStringLiteralRanges(sourceFile) {
  // Collect (start, end, text) for every string-literal-like value. We
  // include JsxText, StringLiteral, NoSubstitutionTemplateLiteral, and
  // each TemplateSpan literal text.
  const out = [];
  function visit(node) {
    if (ts.isStringLiteral(node) && !isModuleSpecifier(node)) {
      out.push({ start: node.getStart(sourceFile), end: node.getEnd(), text: node.text });
    } else if (ts.isNoSubstitutionTemplateLiteral(node)) {
      out.push({ start: node.getStart(sourceFile), end: node.getEnd(), text: node.text });
    } else if (ts.isTemplateExpression(node)) {
      out.push({
        start: node.head.getStart(sourceFile),
        end: node.head.getEnd(),
        text: node.head.text,
      });
      for (const span of node.templateSpans) {
        out.push({
          start: span.literal.getStart(sourceFile),
          end: span.literal.getEnd(),
          text: span.literal.text,
        });
      }
    } else if (ts.isJsxText(node)) {
      const text = node.getText(sourceFile);
      if (text.trim().length > 0) {
        out.push({ start: node.getStart(sourceFile), end: node.getEnd(), text });
      }
    }
    ts.forEachChild(node, visit);
  }
  visit(sourceFile);
  return out;
}

function findForbiddenComponentDeclsAndUsage(sourceFile) {
  const hits = [];
  function check(name, pos, kind) {
    if (FORBIDDEN_COMPONENTS.has(name)) {
      hits.push({ pos, message: `Forbidden component: ${name} (${kind})` });
    }
  }
  function visit(node) {
    if (ts.isFunctionDeclaration(node) && node.name) {
      check(node.name.text, node.name.getStart(sourceFile), 'function decl');
    } else if (ts.isClassDeclaration(node) && node.name) {
      check(node.name.text, node.name.getStart(sourceFile), 'class decl');
    } else if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name)) {
      check(node.name.text, node.name.getStart(sourceFile), 'variable decl');
    } else if (
      (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) &&
      ts.isIdentifier(node.tagName)
    ) {
      check(node.tagName.text, node.tagName.getStart(sourceFile), 'JSX usage');
    }
    ts.forEachChild(node, visit);
  }
  visit(sourceFile);
  return hits;
}

function findReceiverCountProps(sourceFile, isReceiverPage) {
  if (!isReceiverPage) return [];
  const hits = [];
  function visit(node) {
    if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) {
      for (const attr of node.attributes.properties) {
        if (ts.isJsxAttribute(attr) && ts.isIdentifier(attr.name) && attr.name.text === 'count') {
          hits.push({
            pos: attr.name.getStart(sourceFile),
            message: 'count prop on receiver-page component — receiver may not see aggregate stats',
          });
        }
      }
    }
    ts.forEachChild(node, visit);
  }
  visit(sourceFile);
  return hits;
}

function scanLiteralForRules(literal, ctx) {
  const findings = [];
  const text = literal.text;

  for (const rule of FORBIDDEN_SUBSTRINGS) {
    if (rule.pattern.test(text)) findings.push({ pos: literal.start, message: rule.message });
  }

  if (RECURRING_STAT_PATTERN.test(text)) {
    findings.push({
      pos: literal.start,
      message: '"this week/month" adjacent to a numeric stat — recurring growth stats forbidden',
    });
  }

  if (!ctx.isInstallPrompt) {
    for (const rule of INSTALL_PROMPT_TOKENS) {
      if (rule.pattern.test(text)) findings.push({ pos: literal.start, message: rule.message });
    }
  }

  if (BRAND_SOUL_FRAME.test(text) && !isInsideRange(literal.start, ctx.brandSoulRanges)) {
    findings.push({
      pos: literal.start,
      message: `brand-soul frame "'s thinking about" outside ${BRAND_SOUL_CONST_NAME}`,
    });
  }

  return findings;
}

function scanFile(absPath, rel) {
  const violations = [];
  const ext = path.extname(absPath);
  const source = fs.readFileSync(absPath, 'utf8');
  const allowedLines = buildAllowAntiLines(source);

  const isCodeFile = ['.ts', '.tsx', '.js', '.jsx'].includes(ext);
  const isCopyJson = path.basename(absPath) === 'copy.json';

  if (isCodeFile) {
    const sf = ts.createSourceFile(
      absPath,
      source,
      ts.ScriptTarget.Latest,
      true,
      ext === '.tsx' || ext === '.jsx' ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
    );
    const isReceiverPage = isReceiverPagePath(rel) || hasReceiverPageDirective(source);
    const ctx = {
      isInstallPrompt: isInstallPromptPath(rel),
      brandSoulRanges: findBrandSoulLineRanges(sf),
    };

    for (const lit of getStringLiteralRanges(sf)) {
      const findings = scanLiteralForRules(lit, ctx);
      for (const f of findings) {
        const line = lineOfPos(source, f.pos);
        if (allowedLines.has(line)) continue;
        violations.push({ file: rel, line, message: f.message });
      }
    }

    for (const hit of findForbiddenComponentDeclsAndUsage(sf)) {
      const line = lineOfPos(source, hit.pos);
      if (allowedLines.has(line)) continue;
      violations.push({ file: rel, line, message: hit.message });
    }

    for (const hit of findReceiverCountProps(sf, isReceiverPage)) {
      const line = lineOfPos(source, hit.pos);
      if (allowedLines.has(line)) continue;
      violations.push({ file: rel, line, message: hit.message });
    }
  } else if (isCopyJson) {
    let json;
    try {
      json = JSON.parse(source);
    } catch (e) {
      violations.push({ file: rel, line: 1, message: `copy.json parse error: ${e.message}` });
      return violations;
    }
    const walkJson = (val) => {
      if (typeof val === 'string') {
        const fakeLit = { start: 0, end: 0, text: val };
        const ctx = { isInstallPrompt: isInstallPromptPath(rel), brandSoulRanges: [] };
        for (const f of scanLiteralForRules(fakeLit, ctx)) {
          violations.push({ file: rel, line: 1, message: f.message });
        }
      } else if (Array.isArray(val)) {
        for (const v of val) walkJson(v);
      } else if (val && typeof val === 'object') {
        for (const k of Object.keys(val)) walkJson(val[k]);
      }
    };
    walkJson(json);
  }

  return violations;
}

function main() {
  const all = walk(ROOT, []);
  const violations = [];
  for (const abs of all) {
    const rel = path.relative(ROOT, abs);
    if (shouldSkipPath(rel)) continue;
    const ext = path.extname(abs);
    const isScannable =
      ['.ts', '.tsx', '.js', '.jsx'].includes(ext) || path.basename(abs) === 'copy.json';
    if (!isScannable) continue;
    violations.push(...scanFile(abs, rel));
  }
  if (violations.length > 0) {
    console.error('Anti-pattern lint failures:');
    for (const v of violations) {
      console.error(`  ${v.file}:${v.line}  ${v.message}`);
    }
    console.error(`\n${violations.length} violation(s).`);
    process.exit(1);
  }
  console.log('Anti-pattern lint passed.');
}

if (require.main === module) main();

module.exports = { scanFile, main };
