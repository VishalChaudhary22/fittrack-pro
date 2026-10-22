# MARGIN

A second design language for **Kaaya Fit**. Mobile only. Static reference renders.

Same palette as the shipping app. What changes is what we're willing to remove.

---

## Open them

```bash
npx serve .stitch/designs/margin -l 4322
```

The screens are built at **390 × 844** and use fluid widths up to 430px, so they read
correctly on a phone and still look right in a desktop browser.

| File | Screen |
|---|---|
| `00-language.html` | The language itself — laws, geometry, components |
| `01-today.html` | Today: weight, the one thing, ledger, recovery, adherence |
| `02-session.html` | In-session: progress, set table, rest, live ledger |
| `03-food.html` | Nutrition: budget, macros, meals, quick add, water |
| `04-body.html` | Body: weight, measurements, composition, Olympus |

---

## The idea

> Kinect Elite drew the machine. **MARGIN leaves the page alone.**

Every fitness app on the store is a stack of cards. Card for weight, card for calories,
card for the workout — each one a rounded rectangle with a fill, a border, and a shadow,
and each one competing with the others for attention because *nothing* establishes
hierarchy on a phone except size and contrast.

MARGIN removes the containers and lets typography do the work. There are no cards. No
borders. No fills. No shadows. No icons in navigation. A single 1px vertical rule runs
the height of every screen and everything hangs off it.

What's left is a page that reads like a well-set ledger — which is what a training log
actually is.

---

## The four laws

**① No containers.**
Nothing gets a rounded rectangle. Grouping happens through distance (46px between
sections) and shared baseline. The only fills in the entire system are the canvas and
one ember accent.

**② One vertical rule holds the page.**
A 1px hairline at `x = 18`. Section numerals ride it, coach notes hang off it, hero
numerals cross it. It's the spine of the composition and the only structural line in
the app.

**③ Ember appears once per screen.**
Exactly one element wears `#F85F1B`. It is always what to do next. On Today it's the
weight delta; on Food it's the protein gap; on Session it's the log-set action. Every
other emphasis is ink, bone, or ash.

**④ Space is a material.**
Sections breathe at 46–64px where the current app uses 12–16. The empty regions *are*
the design. A phone screen shows about one and a half ideas at a time, and that's
correct — it's a glance app, not a dashboard.

---

## Geometry

```
viewport x =   0   page edge
viewport x =  18   ─── the margin rule
viewport x =  56   content starts
viewport x = 408   content ends (430 − 22)
```

The gutter between the page edge and the rule is 18px wide. Section numerals are
right-aligned inside it; nothing else goes there except the ember tick that marks a
note. Hero numerals set at `margin-left: -34px` so they cross the rule and run to the
page edge — the one intentional break, used once per screen.

---

## Components

| | |
|---|---|
| **Hero numeral** | 82px Space Grotesk, tabular, `-0.055em`. Bleeds across the rule. One per screen. |
| **Ledger row** | Label · dotted leader · value. The leader carries the eye across the gap and makes 12px type read at arm's length. |
| **Amplitude rule** | Progress as a 1px line that fills, with a 1px cap tick at the leading edge. No bars, no gradients, no radius. |
| **Tick paper** | Adherence drawn as ruled marks. Height encodes load, ember marks today, a rest day is a near-flat tick rather than an empty slot. |
| **The One Thing** | A 2px ember rule with a two-line statement. Replaces the readiness card, the adaptive-diet banner, and every "insight" panel. |
| **Margin note** | Coach asides set at weight 300 in the gutter, hanging off the rule with a 22px ember tick. Reads as marginalia, not as a chatbot card. |
| **Word status** | Recovery shown as `READY` / `LOADED` / `RECOVERING` rather than a coloured dot. Colour is one channel; the word carries the meaning. Works in sunlight, works for colour-blind users. |
| **Action bar** | Primary actions are typographic lines bounded by hairlines. No fill, no radius, no shadow. |
| **Tab bar** | Five words, no icons. The active one gets an 18px ember rule above it. |

---

## New sections this language makes room for

MARGIN's density is low, so screens need fewer, larger ideas. These are worth adding:

**Today — "The one thing."** Already in the render. Collapses readiness, the adaptive
diet suggestion, the deload warning, and the notification prompt into a single
sentence with one action. Replaces four banners currently stacking on the dashboard.

**Today — "Adherence."** The tick-paper strip. Answers "am I actually consistent" in
one glance, which the app currently can't do without opening Analytics and reading a
chart. Cheap to compute — it's already in `workoutLogs`.

**Session — "Session so far."** A live ledger of volume, sets, RPE, and calories
*while* you train, not after. The current tracker shows the plan; this shows the work.

**Session — "Hold it."** After a PR set, an inline note that names the previous best
("82.5 × 8 beats 80 × 8 from September"). The app knows this already; it has never
said it.

**Food — "The gap."** A single line naming the one macro that's off and what closes it,
instead of a full macro panel with four bars. Protein is usually the answer.

**Body — "Lean mass held."** The composition section's real insight isn't body-fat
percentage, it's whether lean mass survived the cut. This language gives that sentence
room to be the point.

**Body — "Olympus, without the game."** Rank rendered as a name and a fraction
(`Gold II · 12,480 · #7 of 34`) rather than a foil badge and a tier ladder. Same data,
no chrome.

**Global — "Marginalia."** Notes in the gutter could carry the coach, form cues, or
a logged injury. It's a place for the app to *talk* without adding a card.

---

## What this costs

Worth arguing about before anything is built:

- **Discoverability.** No icons means the tab bar requires reading. That's fine for a
  daily app past week one and hostile on first run. The current bottom nav has icons
  and labels; this has only words.
- **Density.** A phone user who wants to see calories, macros, and water at once will
  have to scroll. This is a deliberate trade — the bet is that a *glance* app should
  show one thing well rather than six things adequately.
- **Charts.** Sparklines and area charts have no home in this language. If a chart is
  genuinely needed, it has to be redrawn as tick paper or a line, not dropped in as a
  card containing a Recharts component.
- **The empty gutter.** 18px of unused width on a 390px screen is 4.6% of the viewport
  given to a rule and some numbers. On a small phone that's a real cost.

## Relationship to Ember Forge 2.0

`../ember-forge-2/` is the other direction: same palette, but *denser* — engraved
panels, notched meters, a rail with a molten progress spine. Ember Forge assumes a
dashboard; MARGIN assumes a glance.

They can coexist as a density setting, but the components don't share a vocabulary and
shouldn't be mixed. Pick one.

## Contrast audit

Measured against `#131315` (canvas). All text passes WCAG AA:

| Token | Ratio | |
|---|---|---|
| `--ink` `#EAEAF0` | 15.49:1 | AAA |
| `--bone` `#E3BFB3` | 10.93:1 | AAA |
| `--ember-soft` `#FFB59B` | 10.90:1 | AAA |
| `--ash` `#8A8A94` | 5.43:1 | AA |
| `--ash-dim` `#7E7E8C` | 4.64:1 | AA |
| `--ember` `#F85F1B` | 5.87:1 | AA |
| `--ok` `#6FCF97` | 9.76:1 | AAA |
| `--warn` `#E0B060` | 9.32:1 | AAA |
| `--bad` `#E0685F` | 5.58:1 | AA |

`--ash-dim` started at `#5A5A63` (2.72:1, failing) because the design wanted a very
quiet gutter. It was raised to `#7E7E8C` — still clearly recessive against `--ash` at
5.43, but now readable for the section numerals and kickers that rely on it.
