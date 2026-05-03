# Tribes — Agent Style Guide v1.0

> Drop this folder (`/style-guide/`) into any agent's context. It contains everything needed to build a screen that looks and feels like Tribes: tokens, components, copy rules, screen recipes, and anti-patterns.

**Project:** Tribes — anti-isolation coordination
**Aesthetic:** "Warm Adventure" — warm-dark canvas, sunset coral primary, ocean teal secondary
**Platform:** iOS mobile + mobile web (receiver flow)
**Last updated:** 2026-05-03

---

## How to use this guide

1. **Tokens** → `tokens.json` (machine-readable) and `tokens.css` (CSS variables). Always reference tokens by name; never hard-code hex values.
2. **Components** → recipes in this doc, with copy-pastable JSX. Match the API exactly; do not improvise new variants.
3. **Copy rules** → register flex (warm vs. executive) is the hardest constraint. Read the `copy-rules.md` matrix before writing any user-facing string.
4. **Anti-patterns** → things that will not ship. If a design includes one, the design is wrong.
5. **Screen recipes** → 13 reference layouts. New screens should clearly descend from one of these.

---

## 1. Brand essence

|                |                                                                                                                       |
| -------------- | --------------------------------------------------------------------------------------------------------------------- |
| Tagline        | _"Send something that catches before it lands."_                                                                      |
| Promise        | _"Tribes turns thinking-of-someone into doing-something."_                                                            |
| Target feeling | Belonging, lighter load, reverence (on receiver page)                                                                 |
| Anti-feelings  | Rejection anxiety, performance pressure, surveillance, patronizing tenderness                                         |
| Voice          | First-person, low-volume, declarative. Never interrogative on ambient plans. Never celebratory on executive register. |

---

## 2. Color tokens

Reference these by **name only**. The semantic role is the contract, not the hex value.

```
PRIMARY · "Sunset Coral"
  --coral          #E86A58   — primary CTAs, send button, active states, brand wordmark
  --coral-dark     #C4463A   — pressed states, primary on hover
  --coral-light    #FFB4A8   — soft highlights, warm-register accents, focus glow

SECONDARY · "Ocean Teal"
  --teal           #2A9D8F   — confirmations, "I might come too" success, opt-in toggle
  --teal-dark      #1E7268   — pressed teal states
  --teal-light     #A8E6CF   — success backgrounds, executive metric numbers

NEUTRALS · "Deep Night"
  --bg             #121212   — app background
  --surface        #1E1E1E   — cards, elevated surfaces
  --surface-2      #2A2A2A   — modals, sheets, pressed pills
  --text           #FAF8F5   — body text (warm white, NOT pure white)
  --text-2         #B0B0B0   — secondary text, captions
  --text-3         #6B6B6B   — placeholder, disabled, label text
  --divider        #333333   — subtle separators
```

### Color usage rules

- **Coral is for the user's outbound action.** Send buttons, primary CTAs, active nav. Never decorative.
- **Teal is for inbound positive signal.** Responses, confirmations, "I might come too." Never for primary CTAs.
- **No green/red status semantics.** Tribes does not use red as error or green as success; teal carries success, coral carries action.
- **Warm white over pure white.** `#FAF8F5`. Pure white reads clinical against the warm canvas.
- **Never use saturated white-backgrounds.** Tribes is dark-mode-primary. A light-mode variant is V2+; do not invent one.

---

## 3. Typography

```
DISPLAY     Inter / SF Pro Display    32–40pt    weight 600–700
HEADLINE    Inter / SF Pro Display    24–28pt    weight 600
TITLE       Inter / SF Pro Text       18–20pt    weight 600
BODY        Inter / SF Pro Text       16pt       weight 400
CAPTION     Inter / SF Pro Text       14pt       weight 400
LABEL       Inter / SF Pro Text       12–13pt    weight 500    UPPERCASE, tracking 0.08em–0.10em

BRAND-WORDMARK   Caveat               54–84pt    weight 500    — "tribes" wordmark ONLY
SOUL             Inter                20–24pt    weight 300    — receiver brand-soul line + warm prompts
```

### Critical typography rules

- **Caveat is reserved for the wordmark "tribes".** Do NOT use Caveat for body copy, prompts, or the receiver brand-soul line. It reads as cute/stylistic and undermines the gravity of the receiver page.
- **The receiver brand-soul line uses `--font-soul` (Inter Light 22pt).** It carries warmth via weight and tracking, not stylization. The line is _invariant_: _"[Sender]'s thinking about [day] and was thinking about you."_ Sameness is liturgy; never reword.
- **Labels are uppercase + tracked.** Section headers, step counters, timestamps. Always `letterSpacing: 0.08em–0.10em`.
- **Body copy uses `text-wrap: balance` on display + headline elements.** Prevents orphan words.

---

## 4. Spacing, radius, elevation

```
SPACING (8pt base)
  --space-xs    4
  --space-sm    8
  --space-md   16    ← standard padding
  --space-lg   24
  --space-xl   32
  --space-2xl  48

RADIUS
  --radius-sm    4    chips, small inputs
  --radius-md    8    cards
  --radius-lg   16    modals, large containers, primary buttons
  --radius-full 9999  avatars, pills

ELEVATION
  --elev-1   0 1px 3px rgba(0,0,0,0.30)        cards at rest
  --elev-2   0 4px 12px rgba(0,0,0,0.35)       active cards, pressed buttons
  --elev-3   0 8px 24px rgba(0,0,0,0.40)       modals, sheets

  GLOW (primary CTA)
  0 0 0 1px color-mix(in oklab, var(--coral) 40%, transparent),
  0 8px 28px color-mix(in oklab, var(--coral) 35%, transparent),
  0 2px 6px rgba(0,0,0,0.3)
```

### Layout rules

- **Touch targets ≥ 44×44pt.** No exceptions.
- **Color contrast ≥ 4.5:1.** Verified for every text-on-bg pair.
- **Generous breathing room.** Default screen padding is 24pt horizontal, 24pt+ vertical. Do not tighten.
- **The warm canvas glow** lives at the top of warm-register screens: `radial-gradient(ellipse 120% 80% at 50% -10%, color-mix(in oklab, var(--coral-light) 18%, transparent) 0%, transparent 60%)` over `var(--bg)`.

---

## 5. Components — canonical recipes

### Button (primary)

```jsx
<button
  style={{
    height: 56,
    padding: '0 28px',
    borderRadius: 16,
    background: 'var(--coral)',
    color: '#fff',
    border: 'none',
    fontSize: 17,
    fontWeight: 600,
    width: '100%',
    boxShadow: 'var(--elev-glow)',
  }}
>
  Open the door
</button>
```

Primary copy on the FIRST send is always **"Open the door"**, not "Send" or "Submit." On subsequent sends, "Send" is acceptable.

### Pill toggle (Survey / Ambient)

- Two pills, equal width, inside a `--surface` track with `border-radius: 9999`.
- Active pill: `background: var(--coral)`, white text. Inactive: transparent, `--text` color.

### Avatar

- Sizes: 32 (chip), 36 (list row), 48 (card), 64 (profile), 92+ (receiver hero).
- If no photo: linear gradient from a per-name palette + 2-letter initials in white, weight 600.
- Selected/ring state: `box-shadow: 0 0 0 2px var(--coral), 0 0 0 4px var(--bg)`.

### Chip (transcribed name, audience tag)

- Height 32, padding `0 12px`, radius 9999.
- **Coral tone:** `background: color-mix(in oklab, var(--coral) 20%, transparent); color: var(--coral-light)`.
- **Teal tone:** same with teal — used for response signals.
- Optional close affordance is a `×` glyph at 60% opacity, never a destructive red.

### Card

```jsx
<div
  style={{
    background: 'var(--surface)',
    borderRadius: 16,
    padding: 16,
    boxShadow: 'var(--elev-1)',
  }}
>
  ...
</div>
```

For elevated/active state: `var(--surface-2)` and `var(--elev-3)`.

### Constellation cluster (audience picker)

The audience on the compose screen is **NOT a vertical list**. It is a loose grouping of avatars positioned by fixed offsets, with first-name labels below each. Selected avatars get a coral ring; deselected drop to 30% opacity. This is the V1 visual signature — same pixels read as "lighter load" for Dana and "my people, together" for Priya.

### Tab bar

Three tabs only: Send, Activity, Profile. Active tab is coral; inactive is `--text-3`. `backdrop-filter: blur(12px)` over a translucent canvas. **Do NOT add a Tribes tab. Do NOT add a Label tab.** Both are V1.5+.

---

## 6. Copy register flex

The single hardest rule. Same screen, two voices, driven by behavior.

| User signal                       | Register       | Voice example                                                      |
| --------------------------------- | -------------- | ------------------------------------------------------------------ |
| < 3 lifetime sends                | **Warm**       | _"Three people just heard from someone they like."_                |
| 3+ sends, > 70% response rate     | **Executive**  | _"You handled this in 38 seconds. Usually takes you 18 messages."_ |
| > 8 inner-circle named            | Executive lean |                                                                    |
| Dismissed warm prompts repeatedly | Executive lean |                                                                    |

### Warm register checklist

- ☑ First-name only ("Sarah," not "Sarah Kim")
- ☑ Sentimental but never patronizing
- ☑ Soft journaling prompts allowed
- ☑ Paper-boat animation on send
- ☐ NEVER: stats, percentages, time-saved math
- ☐ NEVER: "tap" / "submit" / "confirm"

### Executive register checklist

- ☑ Effort-spared math ("38 seconds, usually 18 messages")
- ☑ Calm dashboard transitions, no celebration
- ☑ Visible reduction in steps
- ☐ NEVER: "we" / "let's" / sentimental modifiers
- ☐ NEVER: emoji or hand-drawn elements
- ☐ NEVER: paper-boat or any celebratory animation

### Universal copy rules (both registers)

- **No question marks on ambient plans.** Period or em-dash only. Inline nudge if user types `?`.
- **No "Maybe" state anywhere.** Maybe leaks ambivalence and creates an evidentiary record.
- **Adventure language:** "see," "find," "open the door." Not "submit," "confirm," "send invitation."
- **No aggregate counters of failure.** "3 viewed" is allowed. "2 said no" is forbidden. "0 responses" is forbidden.

---

## 7. The brand-soul receiver line — invariant

This line is the entire V1 brand promise compressed into nine words. It appears on every receiver page. It does not change.

```
[Sender]'s thinking about [day] and was thinking about you.
```

- **Font:** `--font-soul` (Inter Light 22pt) — not Caveat, not handwritten
- **Position:** centered, 32pt margin below sender avatar, 32pt margin above question/plan body
- **Variation:** photo, day, plan body — never the frame
- **Why:** sameness is liturgy; variation reveals the system

---

## 8. Screen recipes — 13 canonical layouts

Each new screen MUST clearly descend from one of these. If a new screen doesn't fit, raise it to the design system owner before shipping.

| #   | Screen               | Purpose                  | Critical elements                                                                           |
| --- | -------------------- | ------------------------ | ------------------------------------------------------------------------------------------- |
| 01  | Welcome              | First impression         | Caveat wordmark, one promise sentence, "Get started" CTA                                    |
| 02  | Voice capture        | Inner-circle naming      | Mic with pulse + waveform, real-time chips, "Type instead" fallback                         |
| 03  | Match-confirm        | Address-book matching    | Vertical cards with ✓/✕, alts as small chips, "Add someone we missed"                       |
| 04  | Compose              | First send               | Constellation audience, format toggle, message preview, "Open the door"                     |
| 05  | Wait — warm          | Post-send (Priya)        | Paper-boat, "3 people just heard...", soft journaling prompt                                |
| 06  | Wait — executive     | Post-send (Dana)         | Effort-spared math, event card, metric strip, no celebration                                |
| 07  | Activity             | Sent + received feed     | No aggregate counters, no streak, FAB to compose                                            |
| 08  | Profile              | Settings + inner circle  | Editable contact list, register-flex-eligible toggles, attendance opt-in                    |
| 09  | Reciprocity prompt   | 1-week post-meet         | Anchored to specific person + specific event, never generic                                 |
| 10  | Friday nudge         | Lock-screen notification | "Anyone you'd want to see this weekend?" — once per week, no escalation                     |
| 11  | Receiver — Survey    | Web flow                 | Sender first, brand-soul line, multi-select chips, optional reply                           |
| 12  | Receiver — Ambient   | Web flow                 | Sender first, plan body, "I might come too" + "Good to know"                                |
| 13  | Receiver — confirmed | Post-tap                 | Avatar + check, "Sarah will see this. That's it.", soft install nudge ONLY if threshold met |

---

## 9. Anti-patterns — will not ship

If you find any of these in a draft, the draft is wrong.

- ❌ "Maybe" state (anywhere)
- ❌ Archive of user's own ambient plans
- ❌ Aggregate response counter shown to sender
- ❌ Public feed of any kind
- ❌ Conversion pressure on receiver's first visit
- ❌ Default attendance measurement (opt-in only)
- ❌ Sentimental copy for executive register
- ❌ Mechanical copy for warm register
- ❌ Auto-add contacts (always: user names, system suggests, user confirms)
- ❌ Broadcast send (no audience selection)
- ❌ Re-introducing labeling / Life-Domains / radial UI / flick gesture (V1.5+)
- ❌ Storing voice audio (transcription only, discard after match)
- ❌ Varying the brand-soul receiver line
- ❌ Showing recipient any growth/cumulative stat
- ❌ Caveat font on body, prompts, or the receiver line
- ❌ Pure white text on dark (use `--text` warm white)
- ❌ Red-as-error / green-as-success status colors
- ❌ Domain tab, Tribes tab, Label tab in nav
- ❌ Pure-emoji icons in primary UI
- ❌ Question marks on ambient plans

---

## 10. Accessibility floor

Every screen must clear:

- ☑ Color contrast ≥ 4.5:1 (WCAG AA)
- ☑ Touch targets ≥ 44 × 44pt
- ☑ Dynamic Type holds at 200%
- ☑ VoiceOver coverage on all interactives
- ☑ Voice-input has typed-input alternative, equivalently discoverable
- ☑ Reduce Motion honored: paper-boat → fade, no inertia, no celebrations

---

## 11. Files in this guide

| File                | Use                                                       |
| ------------------- | --------------------------------------------------------- |
| `style-guide.md`    | This file — read first                                    |
| `tokens.json`       | Machine-readable design tokens (W3C Design Tokens format) |
| `tokens.css`        | CSS variables — drop into any HTML/React app              |
| `copy-rules.md`     | Register-flex matrix and copy decision tree               |
| `screen-recipes.md` | Detailed JSX recipes for each of the 13 screens           |
| `agent-prompt.md`   | Pre-written system prompt for design agents               |

---

## 12. Versioning + change discipline

The visual system survives V1 stable. Tokens and the brand-soul line are **frozen** for V1. Anything else may evolve, but changes require:

1. A written reason that traces back to user research or a metric (response rate, time-to-first-send, silent churn)
2. Update of this style guide in the same PR as the implementation change
3. Sign-off from someone who can recite the lighter-load test from memory

> _"Every screen must remove a thing from the user's shoulders, not add one. If it added one — even a delightful one — we've failed."_
