# Tribes — Agent Orientation

This is a React Native app (Expo, expo-router, TypeScript strict). Before producing
any output that touches product, copy, or UI, read the docs below — they are the
authoritative source for V1 scope, tone, and visual language.

## Required reading (in order)

1. **`docs/shared-context.md`** — Product premise, V1 locked decisions, copy register,
   anti-patterns, design tokens, accessibility minima, glossary. Every UX slice
   assumes this is loaded.
2. **`style-guide/style-guide.md`** — Principles, tokens, components, anti-patterns.
3. **`style-guide/copy-rules.md`** — Register flex matrix and forbidden copy patterns.
4. **`style-guide/screen-recipes.md`** — 13 canonical screen layouts.
5. **`style-guide/agent-prompt.md`** — Pre-written system prompt for design/impl agents.

`style-guide/tokens.css` and `style-guide/tokens.json` are the frozen V1 design tokens.
Port to the RN theme as needed; do not invent new ones.

## The shipping criterion (read this every time)

> **Did this screen just remove a thing from the user's shoulders, or add one?**
> If it added one — even a delightful one — we've failed.

Apply at PR review, design review, copy review.

## Build / dev commands

```
npm start              # Expo dev server
npm run ios            # iOS simulator
npm run android        # Android emulator
npm run web            # web preview
npm run check          # typecheck + lint + format-check (run before pushing)
npm run lint:fix       # autofix lint
npm run format         # prettier --write
```

A pre-commit hook runs `lint-staged` (eslint --fix + prettier --write) on staged files.
Never bypass with `--no-verify`.

## Lint / type rules to know

- TypeScript is `strict` plus `noUncheckedIndexedAccess`, `noUnusedLocals`,
  `noUnusedParameters`, `noImplicitOverride`, `noFallthroughCasesInSwitch`.
- ESLint runs type-aware rules (`typescript-eslint` recommended-type-checked).
  `no-floating-promises` and `no-misused-promises` are errors — wrap fire-and-forget
  promises with `void`.
- `no-unsafe-*` rules are warnings (RN's surface area returns `any` too often for
  these to be errors). Don't sprinkle `any` though — use proper types where you can.
- `@tanstack/eslint-plugin-query` is on; honor its query-key / exhaustive-deps rules.
- `.js` files (config, scripts) are excluded from type-checking and allowed to use
  `require()`.

## Anti-patterns (V1 forbidden — see `docs/shared-context.md` for full list)

No "Maybe" state. No archive of own ambient plans. No public feeds. No aggregate
response counters shown to sender. No conversion pressure on receiver's first visit.
No auto-add contacts. No broadcast. No labeling / Life Domains / radial flick UI.
No storing voice audio. No varying the brand-soul receiver line. No negative-state
copy ("0 responses", "X declined").

If you find yourself reaching for one of these, stop and re-read the section.
