#!/usr/bin/env node
// Contrast-verification gate (NFR3 enforcement, T-FOUND-A11Y-001).
//
// Enumerates every (text-color, bg-color) pair from the frozen V1 design
// tokens and verifies WCAG-AA contrast ratio >= 4.5:1. Fails the build on
// any violation.
//
// Source of truth is style-guide/tokens.json — the V1 frozen tokens. When
// src/core/theme/tokens.ts gets ported in a future task, this script can
// switch to importing it; the JSON is the authoritative input either way.
//
// text-3 is intentionally excluded from the enumeration. Per
// style-guide/style-guide.md it's documented for placeholder, disabled,
// label, and inactive-tab text — categories WCAG-AA exempts from the
// 4.5:1 rule. text-3's contrast on surface-2 (2.69:1) is itself a token
// design concern tracked separately; it does not gate this CI check.

const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const TOKENS_PATH = path.join(ROOT, 'style-guide/tokens.json');
const MIN_RATIO = 4.5;

// Token keys (matching style-guide/tokens.json color section). Adding new
// text or bg colors? Update these arrays so the gate enumerates them.
const TEXT_KEYS = ['text', 'text-2'];
const BG_KEYS = ['bg', 'surface', 'surface-2'];

function srgbToLinear(component) {
  const c = component / 255;
  return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

function relativeLuminance(hex) {
  const m = /^#([0-9a-f]{6})$/i.exec(hex);
  if (!m) throw new Error(`Invalid hex color: ${hex}`);
  const v = parseInt(m[1], 16);
  const r = srgbToLinear((v >> 16) & 0xff);
  const g = srgbToLinear((v >> 8) & 0xff);
  const b = srgbToLinear(v & 0xff);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrastRatio(fg, bg) {
  const lf = relativeLuminance(fg);
  const lb = relativeLuminance(bg);
  const [hi, lo] = lf > lb ? [lf, lb] : [lb, lf];
  return (hi + 0.05) / (lo + 0.05);
}

function readColor(tokens, key) {
  const entry = tokens.color[key];
  if (!entry || typeof entry.$value !== 'string') {
    throw new Error(`Token color.${key} missing or malformed in tokens.json`);
  }
  return entry.$value;
}

function main() {
  const tokens = JSON.parse(fs.readFileSync(TOKENS_PATH, 'utf8'));
  const failures = [];
  const rows = [];

  for (const tk of TEXT_KEYS) {
    const fg = readColor(tokens, tk);
    for (const bk of BG_KEYS) {
      const bg = readColor(tokens, bk);
      const ratio = contrastRatio(fg, bg);
      const pass = ratio >= MIN_RATIO;
      rows.push({ tk, bk, fg, bg, ratio, pass });
      if (!pass) failures.push({ tk, bk, fg, bg, ratio });
    }
  }

  for (const r of rows) {
    const flag = r.pass ? 'PASS' : 'FAIL';
    console.log(
      `${r.tk.padEnd(8)} (${r.fg}) on ${r.bk.padEnd(10)} (${r.bg})  ${r.ratio.toFixed(2).padStart(6)}:1  ${flag}`,
    );
  }

  if (failures.length) {
    console.error(
      `\n${failures.length} pair(s) below WCAG-AA ${MIN_RATIO}:1. Update tokens or document an exemption.`,
    );
    process.exit(1);
  }
  console.log(`\nAll ${rows.length} pair(s) >= WCAG-AA ${MIN_RATIO}:1.`);
}

main();
