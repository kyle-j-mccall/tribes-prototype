# Tribes — Copy Rules + Register Flex Matrix

> The hardest constraint in the system. Same screen, two voices, driven by behavior — never by an explicit mode toggle.

---

## Decision tree — which register?

```
┌─ User has < 3 lifetime sends?  ─────────────────────────────► WARM
├─ User has 3+ sends AND > 70% response rate?  ──────────────► EXECUTIVE
├─ User has named > 8 inner-circle contacts?  ──────────────► EXECUTIVE LEAN
├─ User dismissed warm prompts 3+ times?  ──────────────────► EXECUTIVE LEAN
└─ Default  ──────────────────────────────────────────────────► WARM
```

The flex is **soft** — never a switch the user notices. Both variants must exist for every flex-eligible string.

---

## Register-flex matrix — every flex-eligible touchpoint

| Surface                    | Warm (Priya)                                                               | Executive (Dana)                                                   |
| -------------------------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| **Welcome subhead**        | _"A gentler way to send a plan. No pressure to reply."_                    | _"Coordinate without the back-and-forth."_                         |
| **Voice prompt**           | _"Say four to six names of people you really feel connected to. No rush."_ | _"Name 4–6 of your inner circle. Tap to start."_                   |
| **Match-confirm header**   | _"Did we get the right people?"_                                           | _"Confirm matches."_                                               |
| **Compose prompt**         | _"What's something you'd love to do but haven't?"_                         | _"What are you proposing?"_                                        |
| **Send button**            | _"Open the door"_ (always, both registers)                                 | _"Open the door"_ (always)                                         |
| **Post-send confirmation** | _"Three people just heard from someone they like."_                        | _"You handled this in 38 seconds. Usually takes you 18 messages."_ |
| **Wait companion**         | _"While they think — what are you hoping for this Saturday?"_ (journaling) | (calm dashboard, no companion prompt)                              |
| **Response notification**  | _"Sarah said yes — she'd love that."_                                      | _"Sarah · I might come too · 11:47am"_                             |
| **Activity empty state**   | _"Your activity will live here. Compose your first send to start."_        | _"Nothing sent yet."_                                              |
| **Reciprocity prompt**     | _"What's something you'd want to invite her to?"_                          | _"You met with Sarah 7 days ago. Send something?"_                 |
| **Friday nudge**           | _"Anyone you'd want to see this weekend?"_                                 | _"Friday catch-up."_                                               |

---

## Universal copy laws (both registers)

### The brand-soul receiver line — invariant

```
[Sender]'s thinking about [day] and was thinking about you.
```

- Never reword. Never condense. Never expand.
- Sameness is liturgy; variation reveals the system.
- The frame is sacred; the content (photo, day, plan) is the variable.

### Format-specific grammar

**Survey** — interrogative. Question marks allowed. Tone is curious.

> _"What sounds good Saturday: hike, brunch, or movie?"_

**Ambient plan** — declarative. **No question marks.** Period or em-dash only.

> _"I'm probably going to the farmer's market Saturday around 10."_

If the user types `?` while Ambient is selected, surface this inline nudge (gentle, not blocking):

> _"Ambient plans don't ask — try a period."_

### Forbidden words & patterns

| Forbidden                   | Why                                           | Use instead                                  |
| --------------------------- | --------------------------------------------- | -------------------------------------------- |
| "Maybe"                     | Leaks ambivalence; creates evidentiary record | (no maybe state, period)                     |
| "Decline"                   | Frames a no                                   | "Good to know"                               |
| "Submit"                    | Transactional                                 | "Open the door" / "Send"                     |
| "Confirm"                   | Bureaucratic                                  | "Looks right" / direct action                |
| "Invite"                    | Heavy; loneliness paradox bait                | "Send" / "open the door"                     |
| "0 responses"               | Manufactures failure                          | (don't surface)                              |
| "2 said no"                 | Surfaces rejection                            | "3 viewed" (forward-motion only)             |
| "Your tribe" / "your group" | Domain language; deferred                     | "your inner circle" / "the people you named" |
| "We" / "Let's" (executive)  | Patronizing to Dana                           | "You" / direct                               |
| "🎉" / "✨" (executive)     | Celebration is too close to applause          | (no decoration)                              |
| Heart / star icons          | Sentimental tropes                            | (warm tones do the work)                     |

### Adventure language

Always prefer exploratory verbs:

- "see" not "view"
- "find" not "search"
- "open the door" not "submit"
- "head out" not "depart"

### First-name register (warm)

Warm-register copy uses **first names only**, never full names:

- ✅ _"Sarah will see this."_
- ❌ _"Sarah Kim will see this."_

Executive register uses whatever's most readable, often last-initial in lists:

- ✅ _"Sarah K · Marcus L · Priya S"_

---

## Counters & metrics — what may be shown

| Metric                  | Sender sees                  | Recipient sees            |
| ----------------------- | ---------------------------- | ------------------------- |
| Number who viewed       | ✅ "3 viewed"                | ❌ never                  |
| Number who responded    | ✅ "3 of 8" (executive only) | ❌ never                  |
| Number who said no      | ❌ never                     | ❌ never                  |
| Number who said maybe   | ❌ never (no maybe state)    | ❌ never (no maybe state) |
| Cumulative monthly stat | ✅ executive only            | ❌ never                  |
| Streaks                 | ❌ never                     | ❌ never                  |
| Growth over time        | ❌ never                     | ❌ never                  |

### The "0 problem"

If a metric would render as 0 (zero responses, zero plans, zero attendees), **do not render the metric at all.** Render the empty state instead. A zero is a manufactured loss the user wouldn't have noticed.

---

## Push notification copy

### Warm

- Response: _"Sarah said yes — she'd love that."_
- Friday nudge: _"Anyone you'd want to see this weekend?"_
- Reciprocity: _"It's been a week since you saw Sarah. Want to send something?"_

### Executive

- Response: _"Sarah · I might come too"_
- Friday nudge: _"Friday catch-up — open composer?"_
- Reciprocity: _"7 days since farmer's market with Sarah."_

### Universal

- Day-of (ambient responder): _"[Sender] is heading to [plan] now."_
- Permissions: _"We'll listen for the names you say — they stay on your phone."_

---

## Receiver-side copy

### Survey, after tap

> _"Sarah will see this. That's it — go enjoy your day."_

### Ambient, after "I might come too"

> _"Sarah will see this. That's it — go enjoy your day."_

### Ambient, after "Good to know"

> _"Got it. Go enjoy your day."_

### Install nudge (only after threshold)

> _"Tribes is the app Sarah used to send this. It's small. You don't need it to reply. Want to send your own?"_

The third sentence is the entire pitch. Lead with agency, not acquisition.

---

## When in doubt

Three tests for any string:

1. **Lighter-load test** — does this remove a thing from the user's shoulders, or add one?
2. **Loneliness paradox test** — does this create an evidentiary record of the gap?
3. **Register match test** — would Priya feel patronized? Would Dana feel celebrated-at?

If any answer is wrong, the copy is wrong.
