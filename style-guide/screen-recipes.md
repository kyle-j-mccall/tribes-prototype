# Tribes — Screen Recipes

> Each new screen MUST clearly descend from one of these. JSX uses the canonical primitives in `tokens.css` + the recipes below.

---

## Shared primitives

```jsx
// All examples assume tokens.css is loaded at :root.
const Stage = ({ warm = true, children }) => (
  <div
    style={{
      minHeight: '100vh',
      background: warm ? 'var(--canvas-warm-glow), var(--color-bg)' : 'var(--color-bg)',
      color: 'var(--color-text)',
      fontFamily: 'var(--font-body)',
      paddingTop: 56,
    }}
  >
    {children}
  </div>
);
```

---

## 01 · Welcome

```
LAYOUT
  ┌──────────────┐
  │              │
  │   tribes     │  ← Caveat 84pt, --color-coral, only place Caveat is used
  │              │
  │              │
  │              │
  │  Promise     │  ← Display 32pt semibold, balanced wrap
  │  sentence.   │
  │              │
  │  Subhead.    │  ← Body 16pt, --color-text-2
  │              │
  │  ┌────────┐  │
  │  │ Get... │  │  ← Primary button, full-width, glow
  │  └────────┘  │
  │  Takes ~90s  │  ← Caption 13pt, --color-text-3
  └──────────────┘
```

**Critical:**

- Caveat wordmark is the ONLY use of Caveat in V1. Do not reuse for body copy.
- One promise sentence. No bullets, no benefits list. Lighter-load test fails otherwise.
- "Get started" CTA — never "Sign up" / "Create account."

---

## 02 · Voice inner-circle capture

```
LAYOUT
  Step 1 of 3                    ← --tribes-label
  Who's in your inner circle?    ← Display 28pt semibold
  Subhead instruction.           ← Body 15pt --color-text-2

  [Sarah] [Marcus] [Priya]       ← coral chips, animate in 80ms stagger
  [Jamie] listening…             ← italic placeholder

  ───────────────────────────
                                  ← waveform (21 bars, animated)
       ●                          ← mic button 96px, coral gradient
       MIC                        ← pulsing glow ring -12px inset
                                  ← "Tap to pause" hint

       Type instead               ← underlined fallback link
```

**Critical:**

- Permission copy: _"We'll listen for the names you say — they stay on your phone."_
- "Type instead" must be visible — not buried, not in a menu.
- Transcription latency target: < 300ms. Voice audio discarded after match.
- Each chip animates in: `animation: chipIn 400ms ease [i*80ms] both`.

---

## 03 · Match-confirm

Vertical list of cards, one per spoken name.

```
┌─────────────────────────────────────┐
│  ◉  YOU SAID "Sarah"          ✓ ✕  │  ← coral label, teal/divider buttons
│  Sarah Kim                          │
│  Last texted 2 days ago             │
└─────────────────────────────────────┘

  Confirmed cards: 8% teal tint background, single ✓ check disc.
  Multi-match: small gray chips below as alts: [Priya R.] [Priya M.]
  No-match: card shows "Add someone we missed" affordance.

[Looks right]                          ← primary CTA at bottom
```

---

## 04 · Compose

```
Step 3 of 3
Prompt question.                       ← Display 24pt semibold

      ●        ●         ●             ← CONSTELLATION CLUSTER
   ●     ●         ●       ●           ← absolute-positioned avatars
                                       ← unselected: opacity 0.3
   4 PEOPLE · + Add more               ← --tribes-label, centered

  ┌─[Survey]──[Ambient plan]─┐         ← format toggle, coral active
  └──────────────────────────┘

  ┌────────────────────────────┐
  │  THEY'LL SEE                │       ← preview card
  │  Hey, random — would you   │
  │  be up for [thing] sometime │
  │  in the next two weeks?    │
  └────────────────────────────┘

  ┌──────────────────────────┐
  │   Open the door  →       │         ← primary CTA, glow, 60px tall
  └──────────────────────────┘
```

**Critical:**

- Audience is the constellation, not a list. Fixed positions, varied sizes (36–56px).
- Selected = coral ring + 100% opacity. Deselected = 30% opacity.
- Survey body auto-composes from a single free-text answer.
- Toggling Survey ↔ Ambient updates the preview body in place.
- Ambient plans get inline nudge if user types `?`.

---

## 05 · Wait — warm (Priya)

```
       ╱╲                              ← paper boat SVG (coral tones)
      ╱──╲                             ← drift animation 3s, slight rotation
     ─────                             ← ripple line below

  Three people just heard              ← Display 24pt weight 500
  from someone they like.

  We'll let you know when              ← Body 14pt --color-text-2
  they answer.

  ┌────────────────────────────┐
  │  WHILE THEY THINK —         │       ← --tribes-label, coral-light
  │  What are you hoping for    │
  │  this Saturday?             │
  │  ┌──────────────────────┐  │
  │  │ (a few words…)        │  │      ← optional journaling field
  │  └──────────────────────┘  │
  └────────────────────────────┘

  Stays on your phone. Always.         ← Caption --color-text-3
```

**Reduce Motion:** paper-boat → fade in, no drift, no ripple.

---

## 06 · Wait — executive (Dana)

```
SENT · 11:42 AM                        ← --tribes-label

You handled this in 38 seconds.        ← Display 22pt semibold
Usually takes you 18 messages.         ← Body 14pt --color-text-2

┌────────────────────────────┐
│ SURVEY · SATURDAY           │         ← teal-light label
│ What sounds good Saturday:  │
│ hike, brunch, or movie?     │
│ ●●●●●●+2  · 8 sent · 3 viewed│         ← stacked avatars, no failure counts
└────────────────────────────┘

┌────────────────────────────┐
│ THIS MONTH                  │
│  14         76%        2.3h │         ← three big numbers
│ plans      response   saved │         ← captions below
└────────────────────────────┘

[View activity]   [Send another]       ← two equal-width buttons
```

**Critical:**

- No paper-boat. No celebration. No journaling prompt.
- Metric values: only "viewed" and "response rate." Never "didn't reply."
- If response rate would be 0, hide the card entirely (the "0 problem").

---

## 07 · Activity

Sectioned by recency (Today, This week). Each row:

```
[avatar/icon] FROM SARAH      2h         ← --tribes-label + timestamp
              "I might come too…"        ← body 14pt
              Sarah responded to your…   ← caption --color-text-2
```

- Sent rows use a coral icon disc instead of an avatar.
- Received rows show responder avatar.
- FAB top-right: coral 44px disc with "+" — opens composer with last-used audience.
- **Never** show aggregate "X total sends" or streak counters.

---

## 08 · Profile

Three sections: user header → Inner circle → Settings.

```
[avatar 64px]  Priya Shah
               priya@example.com · joined April

INNER CIRCLE · 5 PEOPLE
┌───────────────────────────────────┐
│ [●] Sarah Kim     last sent 2d ›  │
│ [●] Marcus Lee    last sent 1w ›  │
│ ...                                │
│ + Add or change someone            │
└───────────────────────────────────┘

SETTINGS
┌───────────────────────────────────┐
│ Friday weekly nudge      [●  ◯]   │  ← teal toggle when on
│ 4:00pm local time                  │
│ Attendance feedback     [◯  ●]   │  ← off by default
│ Reduce motion           [●  ◯]   │
└───────────────────────────────────┘

Sign out · Delete account            ← --color-text-3, footer
```

---

## 09 · Reciprocity prompt

```
ONE WEEK AGO                          ← --tribes-label

┌─────────────────────────────────────┐
│ [Sarah]  You went to the farmer's   │  ← anchored to specific event + person
│          market with Sarah last     │
│          Saturday.                  │
│                                     │
│ What's something you'd want to      │  ← --font-soul 22pt
│ invite her to?                      │
│                                     │
│ [Send something]                    │  ← primary CTA
│ Not now                             │  ← dismiss text-link
└─────────────────────────────────────┘

We'll suggest people you've actually  ← caption
spent time with — never a generic
nudge.
```

**Critical:**

- Always anchored to a specific event AND a specific person. Never a generic prompt.
- Dismiss = 7-day snooze, resurface with different anchor.
- Mute-for-this-person hidden in a secondary menu.

---

## 10 · Friday nudge (lock screen)

System notification on a dimmed lock-screen background.

```
            Friday, May 1
            4:00                       ← system clock 84pt light

┌─────────────────────────────────────┐  ← liquid-glass card
│ [t] TRIBES                  now     │
│ Friday catch-up                     │
│ Anyone you'd want to see            │
│ this weekend?                       │
└─────────────────────────────────────┘

⌃ swipe up to reply
```

- Tap → composer pre-filled (last-used audience, survey format, soft suggested prompt).
- Once per week, 4pm local. No escalation copy. Opt-out in Profile.

---

## 11 · Receiver — Survey

Mobile web. Sender first, brand-soul line, chips, optional reply.

```
                [Sarah avatar 92px]
                     Sarah                ← display 22pt

  Sarah's thinking about Saturday          ← --tribes-soul-line (Inter Light 22pt)
  and was thinking about you.

  quick thing — what sounds good            ← --color-text-2
  Saturday?

┌─────────────────────────┐
│ hike                ✓   │  ← tapped: teal tint + check disc
└─────────────────────────┘
┌─────────────────────────┐
│ brunch                  │  ← untapped: --surface + divider border
└─────────────────────────┘
┌─────────────────────────┐
│ movie               ✓   │
└─────────────────────────┘
┌─────────────────────────┐
│ something else?         │
└─────────────────────────┘

OPTIONAL
┌─────────────────────────┐
│ say something nice…     │
└─────────────────────────┘
```

**Critical:**

- No submit button — taps register live.
- No "Maybe" option ever.
- No Tribes branding visible until install threshold met.

---

## 12 · Receiver — Ambient

```
                [Marcus avatar 92px]
                    Marcus

  Marcus is thinking about Saturday        ← --tribes-soul-line, INVARIANT
  and was thinking about you.

  ┌─────────────────────────────────┐
  │ I'm probably going to the      │      ← plan body, plain
  │ farmer's market Saturday        │
  │ around 10.                      │
  └─────────────────────────────────┘

  ┌─────────────────────────────────┐
  │     I might come too            │      ← teal primary CTA
  └─────────────────────────────────┘
  ┌─────────────────────────────────┐
  │     Good to know                │      ← divider-bordered ghost
  └─────────────────────────────────┘

  No reply needed.                          ← caption
```

---

## 13 · Receiver — confirmed

After tap. Felt-belonging moment.

```
       [avatar with teal check disc]      ← glow animation 2s

       Sarah will see this.               ← display 26pt weight 500
       That's it — go enjoy your day.     ← body 16pt --color-text-2

  ┌─────────────────────────────────┐
  │ Tribes is the app Sarah used   │      ← THIS BLOCK ONLY appears
  │ to send this. It's small. You  │      ← when threshold is met
  │ don't need it to reply.        │      ← (confirmed presence OR
  │ Want to send your own?         │      ← 2-from-2 volume fallback)
  └─────────────────────────────────┘
```

---

## When the recipe doesn't fit

If a new screen genuinely doesn't descend from one of these 13:

1. Apply the lighter-load test — does the screen remove a thing or add one?
2. Apply the loneliness-paradox test — does it create an evidentiary record?
3. Bring the proposal to the design system owner BEFORE shipping.

Most "new screen" requests are actually a missed pattern from this list. Look twice.
