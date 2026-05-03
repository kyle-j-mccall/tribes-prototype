# Tribes Style Guide — for agents

This folder is everything an agent (or human) needs to ship Tribes-aligned UI.

## Files

| File                | Purpose                                                        |
| ------------------- | -------------------------------------------------------------- |
| `style-guide.md`    | **Start here.** Principles, tokens, components, anti-patterns. |
| `tokens.css`        | CSS variables — drop into any app at `:root`.                  |
| `tokens.json`       | Machine-readable tokens (W3C Design Tokens format).            |
| `copy-rules.md`     | Register flex matrix + forbidden patterns.                     |
| `screen-recipes.md` | The 13 canonical screen layouts with ASCII diagrams.           |
| `agent-prompt.md`   | Pre-written system prompt for design/implementation agents.    |

## Quick start for an agent

```
You are designing for Tribes. Before you produce any output, read:

1. style-guide/style-guide.md
2. style-guide/tokens.css
3. style-guide/copy-rules.md
4. style-guide/screen-recipes.md
5. style-guide/agent-prompt.md

Then apply the rules in agent-prompt.md to your task.
```

## Quick start for a human dev

```bash
# Copy tokens into your app
cp style-guide/tokens.css src/styles/tokens.css

# Reference at the root of your stylesheet
@import './styles/tokens.css';

# Use vars everywhere
.button { background: var(--color-coral); }
```

## Versioning

V1.0 · 2026-05-03 · "Warm Adventure"

Frozen for V1: tokens, the brand-soul receiver line, the 13 screen recipes, the register-flex matrix, the anti-pattern list.

Changes require a written rationale + style-guide update in the same PR.
