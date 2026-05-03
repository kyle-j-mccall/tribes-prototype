---
purpose: 'Claude Design hand-off — single screen mock generation'
target_screen: 'Receiver Web Page — Ambient Plan'
source_slice: '06-receiver-web-spec.md (Sections 2, 3, 5)'
project_name: 'Tribes'
date: '2026-05-03'
---

# Claude Design Input — Receiver Web Page (Ambient Plan)

> **Note for Claude Design:** This file is a self-contained brief for one screen. You do not need to read any other Tribes documents to produce a credible mock. Everything required is below.
>
> **Workflow:** Generate a mock from this brief → I'll tweak it in your interactive view → emit an updated spec back, mirroring the structure of the **"Final Spec"** section at the bottom of this file → I'll drop the updated spec into `06-receiver-web-spec.md` (Section 5) → an engineering agent will build it.

---

## 1. What This Screen Is

A single static **mobile web page** (no app required, no auth, no signup) that opens when someone receives an SMS with a Tribes link. The SMS came from a friend. The page shows the friend's name, a single emotional sentence, and the friend's plan, and offers exactly two buttons: a primary affirmative and a quiet exit.

This is **the most important screen in the V1 product.** It is the first impression of Tribes for everyone except the sender. It must:

- Not feel like a landing page.
- Not feel like a system notification.
- Feel like _a friend's invitation that happens to live on the web._

The recipient is the _primary beneficiary_ of the visit. They are not a conversion target. The page's job is to **not undo** what the friend just did by sending them this message.

## 2. Who's Looking At It

The recipient could be any of three people; the page must serve all three at once without flexing:

- A **close friend** of the sender. Reads it as affection. Taps the affirmative casually.
- A **drifting friend** of the sender — last hung out a year ago. Reads it as reconnection. Taps the affirmative with a small lump in the throat.
- A **lonely Jamie** — someone the sender used to be close to and feels guilty about losing touch with. Reads it as **rescue**. The page is the most affectionate thing they'll see today.

Variation in copy or visual register would break the third altitude. The page is invariant; the recipient brings the meaning.

## 3. Anti-Patterns (Forbidden — Will Fail Review)

This list is not stylistic preference. Each item is a specific failure mode the product was designed to avoid. **Do not include any of these in the mock**, even if standard mobile-web design conventions would suggest them.

- ❌ **No "Welcome to Tribes" copy.** Anywhere.
- ❌ **No Tribes logo above the fold** on first visit. (A subtle install-prompt line at the bottom appears later, after a presence threshold — not in this mock.)
- ❌ **No spinner, no loading skeleton, no "Loading..."** on first paint. The page just renders.
- ❌ **No "Yes / No / Maybe" trio.** "Maybe" leaks ambivalence. The two affordances are positive ("I might come too") and quiet ("Good to know") — never a "decline."
- ❌ **No event-detail block.** Ambient plans have no details by design. Time, location specifics, RSVP fields — none of it. The plan body is one human sentence the sender wrote, period.
- ❌ **No who-else-responded counter.** No "3 friends are coming!" social proof. (There's a hidden tap-to-reveal "see who's coming" affordance, very small, visible only after the user has tapped a button — see below.)
- ❌ **No tribe-name or system framing.** Never "This is from Sarah's 'Hiking Buddies' tribe."
- ❌ **No "Get the app" prompt** on this first visit. The app prompt appears only after a confirmed-presence threshold, separately.
- ❌ **No celebratory copy** after the user taps. ("Thanks for responding!" is too transactional. "Yay! Sarah will be so happy!" is patronizing.)
- ❌ **No urgency.** No countdown to the plan day. No "respond in the next hour."
- ❌ **No follow-the-OS color scheme.** This page is dark by force. Even on a light-mode browser, it renders dark.

If any of these conventions feel right while you're designing, that's a sign you're optimizing for "good landing page" rather than "good moment of being thought of." Fight the instinct.

## 4. The Brand-Soul Line (Locked Copy — Do Not Edit)

The single most important sentence on the page is this:

> **"Sarah's thinking about Saturday and was thinking about you."**

The frame is invariant. Only the variables (sender name, day) change across sends. The phrasing — particularly the trailing fragment **"was thinking about you"** — does the entire emotional work. It is the V1 brand promise compressed into nine words.

If your mock changes the wording to _"Sarah is inviting you Saturday"_ or _"Sarah wants to see you Saturday"_ or any other phrasing, **you have broken the product.** The "was thinking about you" fragment is not a placeholder. It is the line.

## 5. Layout Specification

Mobile-first, 375pt baseline width. Max width 480pt with auto-margins on tablet/desktop. Background: warm-dark `#121212`.

```
┌──────────────────────────────────┐
│         (32pt top padding)       │
│                                  │
│              ⭕                   │  ← Sender avatar, 80pt circle
│           [Sarah]                │  ← Sender first name, large display type
│                                  │
│         (~32pt gap)              │
│                                  │
│   "Sarah's thinking about        │  ← Brand-soul line, 22pt SF Pro Display
│    Saturday and was thinking     │      Light, warm white #FAF8F5
│    about you."                   │
│                                  │
│         (~24pt gap)              │
│                                  │
│   I'm probably going to the      │  ← The plan body, the sender's own words.
│   farmer's market Saturday        │      18-20pt SF Pro Text Semibold,
│   around 10.                     │      warm white. 1-3 lines typical.
│                                  │
│         (~32pt gap)              │
│                                  │
│  ┌────────────────────────────┐ │
│  │     I might come too       │ │  ← Primary button, full-width, 56pt high,
│  └────────────────────────────┘ │      Ocean Teal #2A9D8F background,
│                                  │      warm white text, 8pt radius.
│         (~12pt gap)              │
│                                  │
│         Good to know             │  ← Ghost button, no background, no border.
│                                  │      14pt SF Pro Text, soft gray #B0B0B0.
│                                  │
│         (32pt bottom padding)    │
│                                  │
└──────────────────────────────────┘
```

### Spacing tokens

| Region                                        | Value |
| --------------------------------------------- | ----- |
| Page horizontal padding                       | 24pt  |
| Page top padding                              | 32pt  |
| Page bottom padding                           | 32pt  |
| Gap between sender header and brand-soul line | 32pt  |
| Gap between brand-soul line and plan body     | 24pt  |
| Gap between plan body and primary button      | 32pt  |
| Gap between primary and ghost button          | 12pt  |

### Color palette

| Element            | Hex       | Notes                                                                                  |
| ------------------ | --------- | -------------------------------------------------------------------------------------- |
| Background         | `#121212` | "Deep Night" — full-bleed, dark by force                                               |
| Text primary       | `#FAF8F5` | "Warm White" — sender name, brand-soul line, plan body, primary button text            |
| Text secondary     | `#B0B0B0` | "Soft Gray" — ghost button text, optional after-tap copy                               |
| Primary button bg  | `#2A9D8F` | "Ocean Teal" — confirmation/affirmative color (this is the _I want to be there_ color) |
| Avatar fallback bg | `#2A2A2A` | "Soft Charcoal" — used when no sender photo                                            |

### Typography

| Element              | Family         | Weight   | Size    |
| -------------------- | -------------- | -------- | ------- |
| Sender name          | SF Pro Display | Bold     | 32pt    |
| Brand-soul line      | SF Pro Display | Light    | 22pt    |
| Plan body            | SF Pro Text    | Semibold | 18-20pt |
| Primary button label | SF Pro Text    | Semibold | 17pt    |
| Ghost button label   | SF Pro Text    | Regular  | 14pt    |

### Button specifications

**Primary button — "I might come too"**

- Full-width minus 24pt horizontal page padding.
- Height: 56pt.
- Background: `#2A9D8F`.
- Text: `#FAF8F5`, 17pt, semibold, centered.
- Border radius: 8pt.
- Pressed state: background darkens to `#1E7268` (Deep Teal). No scale, no shadow change.
- Touch target: full button area (56pt min height already exceeds 44pt minimum).

**Ghost button — "Good to know"**

- No background, no border.
- Centered text, 14pt, regular, color `#B0B0B0`.
- Padding: 12pt vertical to ensure ≥ 44pt touch target.
- No pressed-state color shift; subtle haptic on tap is enough.

### Avatar

- 80pt diameter, perfect circle.
- Center-aligned horizontally.
- If sender has uploaded a photo: use it.
- If no photo: render the sender's first-name initial in `#FAF8F5` at 36pt SF Pro Display Bold on `#2A2A2A` background.

## 6. Interaction Spec

### Page open

The page does **not** spinner. The HTML and CSS render together; the content fades in over ~400ms. The fade is opacity-only — no slide, no scale, no movement.

If the user has Reduced Motion preference enabled in their OS, the fade-in is instant (no animation).

### "I might come too" tap

1. Button background flashes to pressed color (`#1E7268`) for ~120ms.
2. POSTs the response to the server.
3. After-tap copy appears below the button (or replaces the button, your call — design choice for the mock):

   > **"Sarah will see this. That's it — go enjoy your day."**

   Color: `#B0B0B0`. Size: 14pt. Centered.

4. A small toggle appears below the after-tap copy:

   > **"Don't notify me Saturday morning."** (with iOS-style toggle switch)

   This suppresses the day-of "[Sarah] is heading there now" notification that would otherwise fire on the plan day. Default: OFF (notification on).

### "Good to know" tap

1. Button has subtle haptic feedback (no visual flash needed).
2. POSTs the dismissal.
3. After-tap copy appears in the same position:

   > **"Sarah will see this. That's it — go enjoy your day."**

4. **No mute toggle** (the user already opted out of caring about this plan; no further interaction needed).

### Hidden affordance — "see who's coming"

After either tap, a very small text link appears below the after-tap copy, far less prominent than anything else on the page:

> **see who's coming**

- Size: 12pt.
- Color: `#6B6B6B` (muted gray — intentionally low-contrast, must still pass 4.5:1).
- No underline by default; underline on press.
- Tap reveals a list of consenting respondents (avatars + first names only, no last names, no contact info). The list appears inline below the link, expanding the page rather than navigating away.

This is **deliberately quiet.** The page must not push social proof at the recipient. The link exists for those who want it.

## 7. Accessibility Requirements

- **Color contrast:** every text-on-background pair meets WCAG AA 4.5:1.
- **Touch targets:** every interactive element is ≥ 44 × 44 pt (the primary button at 56pt height satisfies; the ghost button needs ≥ 44pt vertical via padding; the "see who's coming" link needs ≥ 44pt via padding around the 12pt text).
- **Screen reader:**
  - Sender header announces _"Sarah sent you something."_
  - Brand-soul line is read in full.
  - Primary button announces _"I might come too — let Sarah know you'll try to be there."_
  - Ghost button announces _"Good to know — acknowledge without committing."_
- **Reduced Motion:** the 400ms fade-in becomes instant.
- **Focus order:** sender → brand-soul → plan → primary → ghost → (after tap) after-tap copy → mute toggle (if shown) → "see who's coming."
- **Dynamic type:** layout must hold at 200% type scale. Buttons are full-width and stack-friendly; brand-soul line wraps cleanly.

## 8. Edge Cases for the Mock

Please render mocks for the following states:

1. **Default state** (page just loaded, neither button tapped). Fade-in complete.
2. **After "I might come too" tap.** Show after-tap copy + mute toggle.
3. **After "Good to know" tap.** Show after-tap copy. No mute toggle.
4. **No sender photo.** Avatar fallback with initial.
5. **Long sender name** (e.g., "Christopher" — 11 chars). Verify name doesn't push the brand-soul line off the visible area.
6. **Long plan body** (e.g., 3 lines, ~140 chars). Verify the buttons remain visible above the fold on a 667pt-tall iPhone SE.
7. **"see who's coming" expanded** state. List of 3-5 consenting respondents inline below the link.

## 9. Variants You May Explore (Optional)

I'm interested in your judgment on the following — feel free to render alternates if you have a strong design instinct:

- **Avatar treatment.** 80pt circle is the spec; explore if a softer alternative (rounded square, soft drop shadow, subtle warm-color ring) reads better at the emotional altitude required.
- **Plan body type weight.** Spec says Semibold; explore if Regular or Medium reads more "human" (the plan is the sender's voice, after all).
- **"see who's coming" placement.** Below the after-tap copy is the spec; explore if it would feel even quieter as a small icon-only affordance somewhere else on the page.
- **Button radius.** 8pt is the spec; you may try 12pt or 16pt to soften the executive feel. Avoid pill shape (`radius-full`) — that read as "social network share button" and breaks the "friend's invitation" feel.

## 10. What I'm Counting On You For

The spec gives you tokens, copy, layout. What it cannot give you is the **visual register**. The page should feel like a friend's text, not like a SaaS product. It should feel **warm and inhabited** — like the reader has walked into a small room, not opened a webpage.

The thing I most want to see in your mock is that you've solved this register problem visually:

- The dark background must feel **warm**, not corporate. (Color choice helps; the tinge of the warm white text helps; consider whether subtle texture or grain would assist.)
- The brand-soul line must feel **handwritten**, not typeset. (SF Pro Display Light at 22pt is the spec; you may try a slightly looser line height — 32pt — to give it air.)
- The primary button must feel **inviting**, not transactional. (Ocean Teal helps; consider whether a slight gradient or soft inner glow would warm it without breaking the "single solid color" feel.)
- The ghost button must feel **genuinely optional**, not a discouragement. (Soft gray helps; placement matters; spacing from primary matters more than visual contrast.)

If you nail register, the rest of the page composes itself. If you don't, no amount of token-correctness will save it.

---

## 11. Final Spec — Format You'll Emit Back to Me

When the mock is approved and you're ready to hand off to engineering, please emit a single replacement section that I can drop into `06-receiver-web-spec.md` Section 5. Use this structure:

```markdown
## 5. Ambient Plan Page (Format-Specific)

[Updated layout spec, integrating any tweaks the user made in the interactive mock session.]

| Element        | Spec  |
| -------------- | ----- |
| The plan       | [...] |
| Affordance     | [...] |
| Quiet exit     | [...] |
| After-tap copy | [...] |
| Per-pair mute  | [...] |

### Updated visual notes (post-Claude-Design session)

- [Bullet list of any visual decisions that came out of the mock review — token adjustments, avatar treatment final answer, "see who's coming" placement, etc.]
- [Reference to any new asset files committed to the repo: e.g., subtle background texture if added.]

### What is NOT on the page

[Carry forward unchanged — the anti-pattern list does not change in the design session.]
```

The structural sections (anti-patterns, telemetry, accessibility, install-prompt thresholds, edge cases) all live in other parts of the slice file and will not be rewritten. This file owns only the visual + interaction details for the ambient page itself.

---

## Appendix — Reference Quotes from the V1 UX Spec

For your context, but **do not include any of these in the mock**:

> "The receiver page is the _primary beneficiary_ in any given send. The sender did the work; the receiver receives the molecule of belonging. The page's job is to _not undo_ what just happened."

> "_'Was thinking about you'_ is the load-bearing fragment — it does the emotional work."

> "The page is designed to serve the **loneliest plausible recipient** — a close friend reads it as affection; a drifting friend reads it as reconnection; a lonely Jamie reads it as rescue. The line works at all three altitudes."

> "Reverence on the receiver page. Brand-soul, not conversion funnel. The receiver is the primary beneficiary, not the viral surface."

> "Sameness is liturgy; variation reveals the system."

These are the authorial intent for the page. They are the standard the mock will be judged against.
