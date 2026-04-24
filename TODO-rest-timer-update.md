# FitTrack Pro — TODO: Rest Timer Redesign
> **Created:** 2026-04-24
> **Effort:** 🟢 Small — isolated to `WorkoutPage.jsx` + `index.css`
> **Impact:** High — rest timer fires after every set; visible dozens of times per session
> **Files affected:** `WorkoutPage.jsx` (HeroRestTimer section only), `index.css` (one new keyframe)
> **Reference design:** Stitch-generated Kinetic Elite rest timer component (see Step 1)

---

## 🎯 Goal

Replace the current `HeroRestTimer` (large hero countdown number + two buttons stacked below)
with a compact **circular ring countdown** layout:

```
[  SVG ring with number inside  ]  [ +30s ]
                                   [ Skip ]
```

The ring drains clockwise as time passes (like a visual timer depleting).
The entire component shrinks by **25%** vs. the current size.
This matches what Indian gym-goers see in Cult.fit, Strong App, and Nike TC —
the ring countdown is a universally trusted gym-timer pattern.

**Why this matters for Indian users:** Indian gym sessions are typically 60–90 min
with 45–90 s rest periods. Visual ring timers reduce "timer anxiety" — you can glance
at the ring and instantly know how much rest is left without reading a number.
HealthifyMe's workout module uses this exact pattern. Strong App (most popular
English-language lifting app in Indian gyms) uses it. This brings FitTrack Pro
to visual parity with the apps Indian lifters already trust.

---

## ⚠️ Pre-conditions — Codebase Reality Check

### 1. Current `HeroRestTimer` location
In `WorkoutPage.jsx`, the `HeroRestTimer` is an inline component rendered at the **top**
of the active session view when `timer !== null`. It is NOT a Portal/modal — it sits
in the normal document flow above the exercise list.

**Current shape (to be replaced):**
```jsx
// Inside WorkoutPage.jsx active session branch, above exercise list:
{timer !== null && (
  <div style={{ /* rounded-2xl bg-surface-container-low p-8, relative overflow */ }}>
    {/* Ambient blob */}
    {/* "Active Session: {name}" label + PulseIndicator */}
    {/* HUGE number: clamp(4rem, 12vw, 7rem) Space Grotesk */}
    {/* +30s ghost pill + Skip ember pill in a row below */}
  </div>
)}
```

### 2. Timer state shape
```js
// timer is: { secs: number, total: number }
// secs = remaining seconds (counts DOWN from total to 0)
// total = original rest duration in seconds (e.g. 60, 90, 120)
// progress = secs / total  (1.0 = full, 0.0 = done)
```
`secs` and `total` are what drive the SVG ring animation — no new state needed.

### 3. Timer controls already exist
`+30s` adds 30 to `timer.secs`. `Skip`/Done fires `onDone()` callback which calls
`setTimer(null)`. Both handlers are already wired — just the JSX changes.

### 4. No Tailwind — inline styles only ✅
The ring SVG is drawn with inline `stroke-dasharray`/`stroke-dashoffset` attributes.
No Tailwind, no new CSS classes except one optional `@keyframes` for the tick pulse.

### 5. `index.css` — ONE new keyframe only
The rest timer tick glow (`@keyframes restTimerPulse`) — pulses the ring stroke color
from `var(--primary-container)` to `var(--primary)` on each second tick.
Everything else uses existing tokens.

---

## 🎨 Stitch Design Workflow

### Step 1 — Generate Stitch Reference Screen

Use the `stitch-design` skill's `text-to-design` workflow for a pixel-level reference.

**Stitch Prompt:**

```markdown
Kinetic Elite — Compact Workout Rest Timer Component.
A single horizontal UI block rendered inside an active workout session card.
Obsidian Performance aesthetic — dark, focused, athletic.

DESIGN SYSTEM (REQUIRED):
- Platform: Mobile-first, max-width 640px
- Palette: Obsidian Canvas (#131315) background, Burning Ember (#F85F1B) for the
  active ring stroke and CTA fills, Ember Peach (#FFB59B) for accent text/labels,
  Charcoal Layer (#1A1A1D) for the card surface, Frosted Slate (#353437) for ghost fills
- Typography: Space Grotesk (numbers/countdown), Be Vietnam Pro (button labels)
- Shape: Cards 16px radius, pill buttons 999px radius, no border lines
- Atmosphere: Obsidian Performance — dark, warm ember glow, precision instrument feel

COMPONENT STRUCTURE:
Single horizontal flex row, aligned center. Two distinct zones:

LEFT ZONE — Circular Ring Timer (the main visual):
- A circular SVG countdown ring. Outer diameter: 88px (desktop), 76px (mobile).
- Thin dark track ring (6px stroke width): surface-container-highest (#353437), full circle.
- Active progress ring (6px stroke width): Burning Ember (#F85F1B) gradient stroke.
  Starts full (360°) at rest-start and drains clockwise as time passes.
  When 10 seconds remain, ring stroke pulses/glows (ember-glow: 0 0 8px rgba(248,95,27,0.6)).
- Center of ring: large countdown number — Space Grotesk, 28px bold, tracking -0.04em,
  color: on-surface (#EAEAF0). Number is perfectly centered via SVG foreignObject or text.
- Below the number inside the ring (very small): "SEC" label — Be Vietnam Pro, 7px,
  uppercase, letter-spacing 0.2em, color: on-surface-dim (#6E6E76).
- Thin ambient glow behind the entire ring: rgba(248,95,27,0.06) blur-xl radial.

RIGHT ZONE — Two vertically stacked action buttons:
- Gap between left ring and right buttons: 16px
- Button 1 (top): "+30s" — pill shape (border-radius 999px), height 36px, min-width 68px,
  background: surface-container-highest (#353437), color: on-surface (#EAEAF0),
  font: Be Vietnam Pro 12px 700, no border, no glow.
  On press: brief scale(0.94) haptic feedback.
- Button 2 (bottom): "Skip" — pill shape, height 36px, min-width 68px,
  background: linear-gradient(135deg, #FFB59B, #F85F1B) (Burning Ember gradient),
  color: #FFFFFF, font: Be Vietnam Pro 12px 700, uppercase, letter-spacing 0.08em,
  box-shadow: 0 4px 12px rgba(248,95,27,0.25).
  On press: brief scale(0.94).

CARD WRAPPER (contains both zones):
- background: surface-container-low (#1A1A1D)
- border-radius: 20px
- padding: 16px 20px
- display: flex, flex-direction: row, align-items: center, justify-content: space-between
- Total rendered height: ~120px at mobile width
- A very subtle radial ember glow in the top-left corner (opacity 0.07) for depth.

STATES TO SHOW IN REFERENCE:
1. Normal state: ring at ~50% (30s remaining out of 60s total). +30s and Skip buttons visible.
2. Low-time state (≤ 10s): ring glows, number turns Ember Peach (#FFB59B).

NO labels outside the ring ("REST", "RESTING", etc.) — the ring itself communicates.
NO progress percentage text.
NO separate session name text inside this component (handled by parent section above).
```

### Step 2 — Download Reference
Download the generated HTML + screenshot to `.stitch/designs/rest-timer-ring.html`.
Review for any detail differences vs. the prompt before coding.

---

## 📋 Implementation Tasks

### TASK 1 — Add `@keyframes restTimerPulse` to `index.css`

**File:** `src/index.css`
**Location:** After the existing `@keyframes pulse` block

```css
/* Rest timer — low-time warning pulse on the ring stroke */
@keyframes restTimerPulse {
  0%, 100% { filter: drop-shadow(0 0 4px rgba(248, 95, 27, 0.4)); }
  50%       { filter: drop-shadow(0 0 10px rgba(248, 95, 27, 0.8)); }
}
```

Only one new keyframe. The animation is applied conditionally via inline `style` when
`timer.secs <= 10`.

---

### TASK 2 — Rewrite `HeroRestTimer` JSX in `WorkoutPage.jsx`

**File:** `src/components/pages/WorkoutPage.jsx`
**Scope:** Replace the entire `{timer !== null && ( <div>...</div> )}` block.
All handler logic (`addThirty`, `skipTimer`, `onDone`) stays unchanged.

#### 2a — SVG Ring Math

```js
// Inside the HeroRestTimer render (or above the return):
const RING_SIZE = 88;          // outer diameter in px — 25% smaller than old hero
const STROKE_W = 6;            // ring stroke width
const RADIUS = (RING_SIZE - STROKE_W) / 2;   // = 41
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;  // = ~257.6 px

// progress: 1.0 = full ring visible, 0.0 = empty ring
const progress = timer.total > 0 ? timer.secs / timer.total : 0;

// stroke-dashoffset: 0 = full ring shown, CIRCUMFERENCE = empty
// As secs decrease, dashoffset increases (ring drains)
const dashOffset = CIRCUMFERENCE * (1 - progress);

// Low-time warning: ≤ 10 seconds remaining
const isLowTime = timer.secs <= 10;
```

#### 2b — New JSX

Replace the old `HeroRestTimer` block with:

```jsx
{timer !== null && (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: 'var(--surface-container-low)',
    borderRadius: 20,
    padding: '16px 20px',
    marginBottom: 16,
    position: 'relative',
    overflow: 'hidden',
  }}>

    {/* Ambient radial glow — top-left corner */}
    <div style={{
      position: 'absolute',
      top: -24, left: -24,
      width: 80, height: 80,
      background: 'rgba(248,95,27,0.06)',
      borderRadius: '50%',
      filter: 'blur(20px)',
      pointerEvents: 'none',
    }} />

    {/* LEFT — SVG Ring Timer */}
    <div style={{ position: 'relative', flexShrink: 0 }}>
      <svg
        width={RING_SIZE}
        height={RING_SIZE}
        style={{
          transform: 'rotate(-90deg)',  // start drain from top
          display: 'block',
          // Pulse glow when low time
          animation: isLowTime ? 'restTimerPulse 1s var(--ease-smooth) infinite' : 'none',
        }}
      >
        {/* Track ring — static grey background */}
        <circle
          cx={RING_SIZE / 2}
          cy={RING_SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke="var(--surface-container-highest)"
          strokeWidth={STROKE_W}
        />
        {/* Progress ring — drains clockwise */}
        <circle
          cx={RING_SIZE / 2}
          cy={RING_SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke={isLowTime ? 'var(--primary)' : 'var(--primary-container)'}
          strokeWidth={STROKE_W}
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={dashOffset}
          style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.3s' }}
        />
      </svg>

      {/* Number + label centered over the SVG ring */}
      <div style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <span style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: 26,
          fontWeight: 700,
          letterSpacing: '-0.04em',
          lineHeight: 1,
          color: isLowTime ? 'var(--primary)' : 'var(--on-surface)',
          transition: 'color 0.3s',
        }}>
          {timer.secs}
        </span>
        <span style={{
          fontFamily: "'Be Vietnam Pro', sans-serif",
          fontSize: 7,
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.2em',
          color: 'var(--on-surface-dim)',
          marginTop: 1,
        }}>
          SEC
        </span>
      </div>
    </div>

    {/* RIGHT — +30s and Skip stacked vertically */}
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      marginLeft: 16,
    }}>

      {/* +30s ghost pill */}
      <button
        onClick={addThirty}
        style={{
          padding: '0 16px',
          height: 36,
          minWidth: 68,
          borderRadius: 999,
          border: 'none',
          cursor: 'pointer',
          background: 'var(--surface-container-highest)',
          color: 'var(--on-surface)',
          fontFamily: "'Be Vietnam Pro', sans-serif",
          fontSize: 12,
          fontWeight: 700,
          transition: 'transform 0.1s var(--ease-smooth)',
        }}
        onMouseDown={e => e.currentTarget.style.transform = 'scale(0.94)'}
        onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        onTouchStart={e => e.currentTarget.style.transform = 'scale(0.94)'}
        onTouchEnd={e => e.currentTarget.style.transform = 'scale(1)'}
      >
        +30s
      </button>

      {/* Skip ember pill */}
      <button
        onClick={skipTimer}
        style={{
          padding: '0 16px',
          height: 36,
          minWidth: 68,
          borderRadius: 999,
          border: 'none',
          cursor: 'pointer',
          background: 'linear-gradient(135deg, var(--primary), var(--primary-container))',
          color: '#fff',
          fontFamily: "'Be Vietnam Pro', sans-serif",
          fontSize: 12,
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          boxShadow: '0 4px 12px rgba(248,95,27,0.25)',
          transition: 'transform 0.1s var(--ease-smooth)',
        }}
        onMouseDown={e => e.currentTarget.style.transform = 'scale(0.94)'}
        onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        onTouchStart={e => e.currentTarget.style.transform = 'scale(0.94)'}
        onTouchEnd={e => e.currentTarget.style.transform = 'scale(1)'}
      >
        Skip
      </button>
    </div>

  </div>
)}
```

#### 2c — Handler names to verify

Before implementing, confirm the exact handler names in the existing `WorkoutPage.jsx`:

| Action | Handler name (verify in file) |
|--------|-------------------------------|
| Add 30 seconds | `addThirty` or `add30` — check and use exact name |
| Skip / dismiss timer | `skipTimer` or inline `setTimer(null)` — check and use exact name |

⚠️ Do NOT rename handlers — only the JSX changes.

#### 2d — Remove old constants / variables that are now dead

After the rewrite, check if any of these from the old `HeroRestTimer` block
are now unreferenced:
- Any large `fontSize: clamp(4rem, 12vw, 7rem)` number display
- The ambient blob div (replaced by the smaller corner glow above)
- The `Active Session:` label + `PulseIndicator` inside the timer block
  (these may have moved to the session header above — verify not duplicated)

---

### TASK 3 — Size Verification (25% shrink target)

The old `HeroRestTimer` effectively occupied the full card width with a
`clamp(4rem, 12vw, 7rem)` hero number (~56px–112px tall number alone).

The new component:
- Ring outer diameter: **88px** — the ring is the visual anchor, not a huge number
- Total card height: **~120px** (16px padding top + 88px ring + 16px padding bottom)
- Card is full-width (same as before) but the visual weight is ~25% of the old hero

No hardcoded `height` or `minHeight` needed — the ring drives the natural height.

If the ring looks too large on very small phones (< 360px), reduce `RING_SIZE` to `72`:
```js
// Mobile override — can be done with a simple conditional:
const RING_SIZE = window.innerWidth < 360 ? 72 : 88;
const STROKE_W = 6;
// RADIUS and CIRCUMFERENCE recompute from these
```

---

## 📦 File Change Summary

| File | Change |
|------|--------|
| `src/index.css` | Add `@keyframes restTimerPulse` (3 lines) |
| `src/components/pages/WorkoutPage.jsx` | Replace HeroRestTimer JSX block (~40 lines) |

**Files NOT touched:** `SharedComponents.jsx`, `AppContext.jsx`, `muscleData.js`,
`index.html`, `Layout.jsx`, `BodyMapSVG.jsx` — zero collateral.

---

## ✅ Implementation Checklist

### Stitch Design Phase
- [x] ~~Run `stitch-design` `text-to-design` workflow with the prompt from Step 1~~ — Skipped; implemented directly from spec
- [x] ~~Download reference HTML + screenshot to `.stitch/designs/rest-timer-ring.html`~~ — Skipped; spec was detailed enough
- [x] Review: ring drain direction (clockwise from top), low-time glow, button sizing — Verified in code
- [x] Note any deviations from prompt before coding — See **Gaps Found** below

### `index.css`
- [x] Add `@keyframes restTimerPulse` after existing `@keyframes pulse`

### `WorkoutPage.jsx`
- [x] Confirm exact handler names: `addThirty` / `skipTimer` (or aliases) — **GAP FOUND:** actual props are `onExtend(30)` / `onSkip`, NOT `addThirty`/`skipTimer`. Kept existing prop interface.
- [x] Compute `RING_SIZE`, `STROKE_W`, `RADIUS`, `CIRCUMFERENCE` constants
- [x] Compute `progress` and `dashOffset` from `secondsLeft` / `totalDuration` — **GAP FOUND:** TODO assumed `timer.secs`/`timer.total` shape but actual component receives `secondsLeft` prop. Added `totalDuration` prop from parent's `restDuration` state.
- [x] Compute `isLowTime = secondsLeft <= 10`
- [x] Replace old HeroRestTimer `<div>` block with new horizontal flex layout
- [x] SVG ring: track circle + progress circle with `strokeDasharray` / `strokeDashoffset`
- [x] Center countdown number + "SEC" label via `position: absolute; inset: 0`
- [x] `+30s` ghost pill — right side, top
- [x] `Skip` ember gradient pill — right side, bottom
- [x] `onMouseDown`/`onTouchStart` scale(0.94) on both buttons (haptic feel)
- [x] Ambient corner glow (optional but adds depth)
- [x] `animation: restTimerPulse` applied when `isLowTime`
- [x] Number color transitions to `var(--primary)` when `isLowTime`
- [x] SVG `rotate(-90deg)` so drain starts from 12 o'clock position

### QA
- [ ] Set rest timer to 60s — ring starts full, drains smoothly over 60 seconds
- [ ] At 10s remaining: ring glows, number turns ember peach
- [ ] At 0s: `onDone()` fires, timer disappears
- [ ] `+30s` tap: `timer.secs` increases, ring visually refills proportionally
- [ ] `Skip` tap: timer disappears immediately, no crash
- [ ] Component height is ~120px on 375px screen — not taller than old hero
- [ ] Ring does NOT overflow the card on any screen width
- [ ] `strokeDashoffset` transition is smooth (`1s linear`) — no jump or flicker
- [ ] Light theme: ring and buttons render correctly on warm linen background
- [ ] Dark theme: ember glow visible, ring clearly legible
- [ ] Android Chrome + iOS Safari: `transform: rotate(-90deg)` on SVG works correctly
- [ ] No console errors from undefined `addThirty` / `skipTimer` — names verified

---

## 🔍 Gaps Found During Review (Resolved)

### Gap 1 — Handler name mismatch
**TODO assumed:** `addThirty` / `skipTimer` handlers exist in `WorkoutPage.jsx`
**Actual codebase:** `RestTimer` is a separate component receiving props `onExtend` / `onSkip`. Parent wires `extendRestTimer` and `skipRestTimer` functions.
**Resolution:** Kept existing prop-based interface. `onExtend(30)` maps to `extendRestTimer`, `onSkip` maps to `skipRestTimer`. No handler renaming needed.

### Gap 2 — `timer.total` does not exist
**TODO assumed:** Timer state has shape `{ secs, total }` with `timer.total` available for ring progress.
**Actual codebase:** `RestTimer` receives a flat `secondsLeft` integer. There is no `total` in the timer object — the codebase uses an absolute-timestamp model (`restEndsAt`), not a `{secs, total}` object.
**Resolution:** Added `totalDuration` prop to `RestTimer`, sourced from the parent's `restDuration` state (the user-selected rest period: 30s/60s/90s/etc.). This correctly represents the ring's "full" value.

### Gap 3 — Component structure differs from TODO description
**TODO §2 (Pre-conditions):** Describes `HeroRestTimer` as inline JSX inside `WorkoutPage` (not a separate component), rendered `{timer !== null && (...)}` at the top of the session view.
**Actual codebase:** `RestTimer` is a separately-defined component rendered **inline within each set row** (at `restTimerPosition.ei/si`), not at the top of the session. It appears between the completed set and the next set.
**Resolution:** Kept the inline-per-set rendering position (this is the correct UX — the timer appears contextually after the set you just completed). Only the visual rendering was changed, not the placement logic.

---

## 🗒️ Implementation Notes

- **`rotate(-90deg)` on the SVG**: SVG arcs naturally start at the 3 o'clock position.
  Rotating the entire SVG by -90deg makes the drain start from 12 o'clock (top),
  which is the natural "clock" orientation users expect.

- **`strokeLinecap: 'round'`**: Gives the progress arc a rounded tip, making it look
  premium rather than a hard mechanical edge. Common in fitness app ring timers.

- **`transition: 'stroke-dashoffset 1s linear'`**: This creates smooth per-second
  movement. Since `timer.secs` decrements every second (integer), the CSS transition
  smoothly animates each 1-second step rather than jumping. Matches how Cult.fit
  and Strong App handle their ring timers.

- **`isLowTime` threshold at 10s**: This is the industry standard (Fitbod, Strong,
  Nike TC all use ~10s as the warning threshold). Indian users expect this as
  a pre-set signal.

- **`skipTimer` vs `setTimer(null)`**: Verify whether the codebase uses a named
  `skipTimer` function (which may also play a sound/beep on completion) vs a direct
  `setTimer(null)`. If there's a `playBeep` tied to the skip, we want to call the
  full handler, not bypass it.

- **`total` field in timer state**: Verify `timer.total` exists. If the timer object
  only has `secs` (no total), you'll need to capture the initial value in a `useRef`
  when the timer first mounts, e.g.:
  ```js
  const timerTotalRef = useRef(timer?.secs || 60);
  useEffect(() => {
    if (timer && timerTotalRef.current !== timer.secs)
      timerTotalRef.current = timer.secs; // capture on first set
  }, [timer === null]);
  const progress = timer ? timer.secs / timerTotalRef.current : 0;
  ```
  This fallback only needed if `timer.total` is absent.

- **Performance**: `stroke-dashoffset` animates via CSS, not JS — it runs on the
  compositor thread. No layout recalculation. No `requestAnimationFrame` loop.
  Total JS work per second: one integer decrement on `timer.secs`.

---

## 🚫 Out of Scope

- Audio chime / vibration on timer completion (tracked in State.md Known Gaps)
- Cross-session persistence of rest duration preference (tracked separately)
- Multiple timer presets / rest duration selector (Phase 3+ feature)
- Any change to how the timer starts (that's in the `upd()` set-done handler — untouched)
- Any change to the "Active Session:" label and `PulseIndicator` in the session header
  above the timer — those remain exactly as-is