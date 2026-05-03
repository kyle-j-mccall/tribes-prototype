# 00 — Shared Context (V1 UX)

> Every slice in this directory assumes the reader has already loaded this file. Slices do not restate V1 framing, copy-register mechanics, design tokens, or anti-patterns — they reference them by name.

---

## V1 Product Premise (Why Anything Below)

Tribes is **anti-isolation infrastructure**. Not a CRM. Not a contact-organizing tool. Not a labeling experience. The product is **a form of asking that doesn't feel like asking** — its shape is engineered to dodge the loneliness paradox, where initiating creates an evidentiary record of the gap.

**One user, two defense mechanisms.** The same hole, described from opposite walls:

- **Transplant** ("Priya"): "I have no one to ask." Doesn't initiate.
- **Coordinator** ("Dana"): "I'm always the one asking." Initiates everything.

V1 serves both with **the same flow** at a **different copy register**. The product never asks the user which they are.

**Defining experience:** _"Send something that catches before it lands."_ The differentiator is the **ambient plan** — declarative, no question mark, no reply required, only affordance is _"I might come too."_ The companion format is the **survey**, used as the V1 default for first-time senders.

**North star:** unsolicited inclusion within 7 days of install. The reciprocity prompt (slice 07) is the engineered moment that makes this metric reachable.

---

## V1 Decisions (Locked)

| #   | Decision                                                   | Implication                                                                                      |
| --- | ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| 1   | Voice is the cold-start input for inner-circle capture     | Slice 03 mic + on-device transcription                                                           |
| 2   | Tap is the input for everything else                       | No voice in composer, match-confirm, etc.                                                        |
| 3   | First send must happen inside onboarding                   | Slice 03 ends in a SEND tap                                                                      |
| 4   | Two coordination formats: Survey + Ambient Plan            | No third format. No invitations.                                                                 |
| 5   | Ambient plans evaporate the day after                      | No archive, no "your plans" tab, no streak                                                       |
| 6   | Receiver flow is mobile web (no app required)              | Slice 06                                                                                         |
| 7   | Tribes branding is invisible on the receiver page          | Until install-prompt threshold is met                                                            |
| 8   | Brand-soul receiver line is invariant across sends         | "X's thinking about Saturday and was thinking about you" — frame is liturgy; only content varies |
| 9   | Three engineered initiation moments — no share-sheet in V1 | Onboarding first send + Friday nudge + reciprocity prompt                                        |
| 10  | No "Maybe" affordance anywhere                             | Leaks ambivalence, creates evidentiary record                                                    |
| 11  | Domains, Labels, Tribes deferred to V1.5+                  | Three-tab nav: Send / Activity / Profile                                                         |
| 12  | Real-time presence + offline mode deferred                 | V1.1+                                                                                            |
| 13  | iOS only for V1 (sender app)                               | iPad and Android in V1.5                                                                         |

---

## Copy Register Flex (Cross-Cutting)

The same UI carries two emotional registers — **warm** (Priya) and **executive** (Dana) — selected by signal, not by user mode toggle.

### Selection signals (locked)

| Signal                                                                    | Implication    |
| ------------------------------------------------------------------------- | -------------- |
| User has < 3 lifetime sends                                               | warm           |
| User has 3+ lifetime sends with > 70% response rate                       | executive      |
| User has named > 8 inner-circle contacts                                  | executive lean |
| User dismisses warm-register prompts repeatedly ("not now" on journaling) | executive lean |

The flex is **soft** — never an explicit switch the user notices. Copy variations are A/B-able for refinement.

### API contract

Every flex-eligible string is authored under a key with two variants:

```ts
copy('post-send.confirmation', { register: currentRegister(userId) });
// register ∈ 'warm' | 'executive'
```

The signal store lives in slice 01 (Foundation). All slices that use copy-register flex import the same `copy()` API and the same `currentRegister()` resolver.

### Tone rules (do not violate)

- **Sentimental copy for the executive register** patronizes Coordinators. Don't.
- **Mechanical copy for the warm register** feels like the world said no again. Don't.
- **Recognition is too close to applause** — Dana does not get celebrated. She gets _witnessed for effort spared_: "you handled this in 38 seconds."
- **Adventure over obligation** for both registers — "see who wants to come," not "send invitations."

---

## Anti-Patterns (V1 Forbidden List)

These show up as build-time lints in slice 01 and as test assertions in every other slice. If you find yourself reaching for one, stop.

| Anti-Pattern                                                   | Why                                                                     |
| -------------------------------------------------------------- | ----------------------------------------------------------------------- |
| "Maybe" state anywhere                                         | Leaks ambivalence; manufactures the evidentiary record                  |
| Archive of own ambient plans                                   | Slow-leak failure mode — user authors their own loneliness log          |
| Aggregate response counter shown to sender                     | Primes expectation, manufactures disappointment                         |
| Public feed of any kind                                        | Performance pressure; conflicts with relaxed-confidence emotional goal  |
| Conversion pressure on receiver's first visit                  | Degrades the felt-belonging moment we just delivered                    |
| Default attendance measurement                                 | Reintroduces survey semantics through the back door                     |
| Sentimental copy for executive register                        | Patronizes Coordinators                                                 |
| Mechanical copy for warm register                              | Feels cold to a Transplant who needs tenderness                         |
| Auto-add contacts                                              | The user names; the system suggests; the user confirms. Always.         |
| Broadcast (no audience selection)                              | Plans go to user-selected audience only                                 |
| Re-introducing labeling / Life Domains / radial flick UI in V1 | Deferred to V1.5+ — explicitly removed from V1 scope                    |
| Storing voice audio                                            | Transcription only; discard audio after match                           |
| Varying the brand-soul receiver line across sends              | Sameness is liturgy; variation reveals the system                       |
| Showing the recipient any growth/cumulative stat               | "5 people thought of you this month" creates a number to watch and lose |
| "0 responses" or "X people declined" copy                      | Negative-state surface is itself the wound                              |

---

## Design Tokens (V1 Freeze)

### Color — "Warm Adventure"

**Primary (action surface)**
| Role | Token | Hex |
|---|---|---|
| Primary | `color.primary.default` | `#E86A58` (Sunset Coral) |
| Primary Dark (pressed) | `color.primary.pressed` | `#C4463A` (Terracotta) |
| Primary Light (warm bg) | `color.primary.tint` | `#FFB4A8` (Peach) |

**Secondary (confirmation surface)**
| Role | Token | Hex |
|---|---|---|
| Secondary | `color.secondary.default` | `#2A9D8F` (Ocean Teal) |
| Secondary Dark (pressed) | `color.secondary.pressed` | `#1E7268` (Deep Teal) |
| Secondary Light (success bg) | `color.secondary.tint` | `#A8E6CF` (Mint) |

**Neutral (dark mode primary)**
| Role | Token | Hex |
|---|---|---|
| Background | `color.bg.canvas` | `#121212` |
| Surface | `color.bg.surface` | `#1E1E1E` |
| Surface elevated | `color.bg.elevated` | `#2A2A2A` |
| Text primary | `color.text.primary` | `#FAF8F5` (Warm White) |
| Text secondary | `color.text.secondary` | `#B0B0B0` |
| Text tertiary | `color.text.tertiary` | `#6B6B6B` |
| Divider | `color.border.subtle` | `#333333` |

Domain-specific colors and Life-Domain colors from the original spec are deferred to V1.5+.

### Typography (SF Pro)

| Role                       | Token            | Family         | Weight   | Size    |
| -------------------------- | ---------------- | -------------- | -------- | ------- |
| Display                    | `text.display`   | SF Pro Display | Bold     | 32–40pt |
| Headline                   | `text.headline`  | SF Pro Display | Semibold | 24–28pt |
| Title                      | `text.title`     | SF Pro Text    | Semibold | 18–20pt |
| Body                       | `text.body`      | SF Pro Text    | Regular  | 16pt    |
| Caption                    | `text.caption`   | SF Pro Text    | Regular  | 14pt    |
| Label                      | `text.label`     | SF Pro Text    | Medium   | 12–14pt |
| Brand-soul body (receiver) | `text.brandsoul` | SF Pro Display | Light    | 22pt    |

### Spacing (8pt base)

| Token       | Value |
| ----------- | ----- |
| `space.xs`  | 4pt   |
| `space.sm`  | 8pt   |
| `space.md`  | 16pt  |
| `space.lg`  | 24pt  |
| `space.xl`  | 32pt  |
| `space.2xl` | 48pt  |

### Elevation

| Token         | Shadow                        |
| ------------- | ----------------------------- |
| `elevation.0` | none                          |
| `elevation.1` | `0 1px 3px rgba(0,0,0,0.30)`  |
| `elevation.2` | `0 4px 12px rgba(0,0,0,0.35)` |
| `elevation.3` | `0 8px 24px rgba(0,0,0,0.40)` |

### Radius

| Token         | Value | Usage                  |
| ------------- | ----- | ---------------------- |
| `radius.sm`   | 4pt   | chips, small buttons   |
| `radius.md`   | 8pt   | cards, inputs          |
| `radius.lg`   | 16pt  | modals, sheets         |
| `radius.full` | 50%   | avatars, round buttons |

---

## Accessibility Minima (Cross-Cutting)

Every slice must hit these. Slice 01 ships the primitives; every other slice consumes them.

| Requirement             | Target                                                                                   |
| ----------------------- | ---------------------------------------------------------------------------------------- |
| Color contrast          | 4.5:1 minimum (WCAG AA) — verified in CI per token pair                                  |
| Touch targets           | 44 × 44 pt minimum                                                                       |
| Dynamic Type            | Full support; layouts must hold at 200% type scale                                       |
| VoiceOver               | Full coverage; every interactive announces purpose + state                               |
| Voice-input alternative | Typed-input path equivalent in functionality and outcome                                 |
| Voice-input persistence | Once user chooses typed input, system remembers across sessions                          |
| Reduced Motion          | Honor system preference; paper-boat off, instant transitions, snap-not-inertia scrolling |

---

## Lighter-Load Test

The single shipping criterion that overrides all others.

> **Did this screen just remove a thing from the user's shoulders, or add one?**
> If it added one — even a delightful one — we've failed.

Apply at PR review. Apply at design review. Apply at copy review.

---

## Cross-Slice Dependency Map

```
01 Foundation
   ↓
02 App Shell ──────────────────────────┐
   ↓                                    │
03 Onboarding (introduces composer surface)
   ↓                                    │
04 Send Composer (recurring)            │
   ↓                                    │
05 Post-Send & Day-Of                   │
                                        │
06 Receiver Web ←────── independent leaf, depends on 01 only
                                        │
07 Engagement Loops ←─ deep-links into 04 composer; uses 02 push routing
```

- **04, 05, 07** all reuse the composer surface from **03**.
- **06** is fully independent of **02–05**; it touches only Foundation tokens and the SMS payload contract.
- **07** consumes the push-notification routing introduced in **02**.

---

## Glossary (V1)

- **Inner circle** — the 4–6 (max 15) confirmed contacts captured in onboarding screen 2.
- **Coordination** — a single send. Either a Survey or an Ambient Plan.
- **Survey** — declarative-question format. Recipient picks chips. The V1 default for first-time senders.
- **Ambient plan** — declarative-statement format, no question mark, no reply required, only affordance is "I might come too."
- **Audience** — the user-selected recipient set for a coordination. Grouped layout (constellation) on the composer.
- **Recency strip** — horizontal avatars of recently-coordinated-with contacts, on the composer.
- **Brand-soul line** — the invariant body line on the receiver page. Frame never varies; only content (sender name, day, plan) varies.
- **Reciprocity prompt** — 7-day-post-event prompt that flips a recipient into a sender, anchored to a specific event + specific person.
- **Friday nudge** — single weekly push notification that deep-links into the composer with last-used recipients pre-checked.
- **Copy register** — warm vs. executive — the soft, signal-driven tone variant for flex-eligible strings.
- **Lighter-load test** — the shipping criterion: did this screen remove a thing or add one?
