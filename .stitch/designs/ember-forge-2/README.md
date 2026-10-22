# Ember Forge 2.0

A visual direction for **Kaaya Fit**, proposed as the successor to *Kinetic Elite*.

These files are **static mock-ups**. Nothing here imports from `src/`, and no application file
was modified to produce them.

---

## Open them

```bash
npx serve .stitch/designs/ember-forge-2 -l 4321
```

Then visit `http://localhost:4321/`. (The `design-renders` entry in `.claude/launch.json`
does this too.)

| File | What it shows |
|---|---|
| `00-system.html` | Component sheet — tokens, type, seams, meters, gauges, plaques, controls |
| `01-dashboard.html` | Home: hero, readiness, stat row, session list, recovery |
| `02-workout.html` | In-session tracker: set table, PR, rest timer, live stats |
| `03-diet.html` | Nutrition: remaining budget, macro meters, meal log, hydration |
| `04-olympus.html` | League: rank hero, leaderboard, tier ladder, per-muscle ranks |

Each screen renders desktop and mobile from the same URL (`max-width: 860px` breakpoint).

---

## The three laws

1. **Ember is a signal, not a colour.** Exactly one ember-emphasised element per viewport
   region — the *Ember Cursor*. Everything else earns attention through size and position.
2. **Engrave, don't outline.** Panel edges are a pair of inset shadows: a 1px top highlight
   at 3.5% white over a 1px inner ring at 7% bone. No `border`, no `box-shadow` drop.
3. **Numbers are the hero.** Tabular figures, oversized, left-aligned. Labels are 9–10px,
   tracked out, and never compete with their value.

---

## Tokens

### Surface ladder

| Token | Hex | Role |
|---|---|---|
| `--void` | `#0A0A0C` | Canvas behind everything |
| `--obsidian` | `#101013` | Page background, rail |
| `--charcoal` | `#17171B` | Primary panel |
| `--graphite` | `#1E1E23` | Raised panel, hover |
| `--slate` | `#26262D` | Nested block, input fill |
| `--slate-hi` | `#2F2F37` | Active / selected control |

Kinetic Elite's `#131315` and `#1A1A1D` are ~4% apart and read as one plane. These six give
three legibly separate planes, which is what lets the no-border rule actually work.

### Ember ramp

| Token | Hex | Use |
|---|---|---|
| `--ember-100` | `#FFB59B` | Ember text on dark |
| `--ember-300` | `#FF9570` | Hover |
| `--ember-500` | `#FF7A45` | Arc strokes, meter fill start |
| `--ember-600` | `#F85F1B` | CTA fill, gradient end |
| `--ember-700` | `#C8460D` | Pressed, completed ladder rungs |
| `--ember-wash` | `rgba(255,122,69,.10)` | Tinted panel fill |
| `--ember-seam` | `rgba(255,122,69,.28)` | Active hairline |

Signature gradient gains a mid-stop: `135deg, #FFB59B 0%, #FF7A45 45%, #F85F1B 100%`.

### Ink & signal

| Token | Hex | | Token | Hex |
|---|---|---|---|---|
| `--chalk` | `#F2EEEB` | | `--ok` | `#5BE38B` |
| `--bone` | `#E3BFB3` | | `--warn` | `#F5B224` |
| `--ash` | `#80808A` | | `--danger` | `#FF6B6B` |
| `--smoke` | `#47474F` | | `--info` | `#6BA8FF` |

Signal colours are used only as a 6px dot, a 2px left rule, or a text run — never as a fill.

### Seams

```css
--seam:        inset 0 1px 0 rgba(255,255,255,.035),
               inset 0 0 0 1px rgba(227,191,179,.07);
--seam-active: inset 0 1px 0 rgba(255,181,155,.10),
               inset 0 0 0 1px rgba(255,122,69,.28);
--lift-1/2/3:  0 2px 6px / 0 12px 28px / 0 32px 64px rgba(0,0,0,…)
--ember-emit:  0 0 24px rgba(255,122,69,.14);
```

Replacing `backdrop-filter: blur(20px)` with this seam is the single biggest change in the
direction. The blur is the most expensive paint in the current app and is visually invisible
against a flat dark canvas.

### Type

Space Grotesk (display + numerals) and Be Vietnam Pro (body) are unchanged.
New: **tabular numerals everywhere** (`font-variant-numeric: tabular-nums`), which stops live
counters from jittering as values change.

| Role | Size / weight / tracking |
|---|---|
| Display | `clamp(2.75rem, 6vw, 4.5rem)` · 700 · `-0.045em` |
| H1 | `clamp(1.5rem, 2.6vw, 2rem)` · 700 · `-0.04em` |
| Nano (eyebrow) | 9px · 700 · `0.16em` · uppercase |
| Micro (field label) | 10px · 600 · `0.12em` · uppercase |
| Body | 14px · 400 · 1.6 |

### Geometry & motion

Radii: `4` chip · `10` input · `14` card · `20` panel · `28` sheet · `999` pill.
Spacing: 4px base.
Easing: adds `--ease-forge: cubic-bezier(.16, 1, .3, 1)` for panels.
Durations: `120ms` micro · `220ms` base · `420ms` panel · `2.4s` breathe.
All infinite animation is disabled under `prefers-reduced-motion`.

---

## The five signature elements

**① Molten spine.** A 3px line down the rail's left edge that fills as the current session
progresses. At 80% complete, 80% of the rail edge glows. The navigation chrome is itself a
progress readout.

**② Notched meters.** Progress is 20 discrete notches rather than a smooth gradient. The
leading notch breathes. Readable at 6px height, and "82%" is legible without reading the
number.

**③ Engraved panel headers.** Every panel opens with a `NANO LABEL` / trailing-action row,
separated from the body by a rule that stops 18px in from each edge. One component replaces
a dozen ad-hoc title treatments.

**④ The Ember Cursor.** One element per screen gets ember — a 2px left rule, a wash
background, and a 24px emission. It is always what the user should act on next:

| Screen | Cursor target |
|---|---|
| Dashboard | Readiness card |
| Workout | Active exercise |
| Diet | Remaining-calories block |
| Olympus | Your own leaderboard row |

**⑤ Foil plaques.** Rank badges are three-stop metallic ramps with a bright 1px top edge and
a moving specular sweep. Legend adds a 6s shimmer. A tier never floods a layout with colour.

---

## Reviewing this direction

Worth arguing about:

- **The rail is icon-only.** Labels appear on hover only. It buys 160px of content width and
  a cleaner chrome, but costs first-run discoverability.
- **Rest timer is inline, not a floating pill.** In-session it sits in the right column.
  On mobile it would need to become a sticky bar above the set table.
- **Palette is unchanged.** Same hues as today — the change is discipline, not colour. If
  the app feels too similar, hue is the first dial to turn.

## Implementation sketch (later, not part of this)

`src/index.css` is already token-driven, so most screens would re-skin from a token swap alone:

1. Re-map the ~30 core tokens in `src/index.css` to the ladder above, ship, and eyeball
   every route. No component edits required.
2. Add `.panel` + `--seam` and drop `backdrop-filter` from `.glass-card`, `.md`, `.bn`.
3. Introduce `PanelHeader`, `StatBlock`, `NotchMeter` in `SharedComponents.jsx`; migrate
   Dashboard → Workout → Diet → Olympus in that order.
4. Replace `Sidebar` with the rail, keeping the `NAV` exports in `src/data/constants.js`
   unchanged so routing does not move.
5. Convert inline `style={{}}` to classes **only in files being touched**. There are ~1,500
   inline style blocks across the pages; a blanket refactor is its own project.
