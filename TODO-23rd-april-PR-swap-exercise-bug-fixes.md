# FitTrack Pro — Bug Fix Sprint TODO
> Created: 2026-04-23 · 5 bugs diagnosed and planned

---

## Design System Constraints (apply to every UI change)

All fixes must stay within Kinetic Elite tokens. Never introduce new colours, shadows, or fonts.

| Token | Value |
|-------|-------|
| `--surface-container-low` | `#1A1A1D` |
| `--surface-container` | `#212124` |
| `--surface-container-high` | `#2B2B2E` |
| `--surface-container-highest` | `#353437` |
| `--primary` | `#FFB59B` |
| `--primary-container` | `#F85F1B` |
| `--signature-gradient` | `135deg, #FFB59B, #F85F1B` |
| `--on-surface` | `#EAEAF0` |
| `--on-surface-variant` | `#E3BFB3` |
| `--on-surface-dim` | `#6E6E76` |
| `--ease-smooth` | — |
| `--ease-spring` | — |

Typography: Space Grotesk for metrics and headings. Be Vietnam Pro for labels and body.
Anti-patterns: No emoji in UI chrome. No Inter. No pure black. No inline rgba() — use CSS vars. No overlapping elements. No 3-column equal grids. No neon glow.

---

## Bug 1 — Adaptive Coach Banner Invisible on Mobile

### Symptom
The `AdaptiveDietBanner` renders correctly on desktop but is not visible on mobile phone browsers (tested on the Dashboard and DietPage). The banner exists in the DOM — it is not a data/logic problem — it is a CSS visibility issue specific to mobile viewport.

### Root Cause Diagnosis

The 2026-04-22 refactor repositioned the banner using "animated pulsing indicator glows" and placed it:
- On Dashboard: above the Body Composition card
- On DietPage: globally above the Goal Tracker card (detached from the `activeTab === 'guide'` guard)

Mobile-specific failures follow this priority order — check each in DevTools:

**Cause A (most likely) — `position: fixed` or `position: sticky` combined with a scroll container that has `overflow: hidden` or `transform` on an ancestor.**
Any ancestor with `transform`, `will-change`, or `overflow: hidden` creates a new stacking context that clips `position: fixed` children on mobile. The Dashboard and DietPage both have scroll containers with `cascadeIn` animations that use `transform`, which is a known offender.

**Cause B — Banner rendered behind the fixed BottomNav.**
On mobile, the fixed `BottomNav` sits at the bottom of the viewport at a high z-index. If the banner uses `position: fixed` with a `bottom` value that overlaps the nav (typically 60–80px height), it is physically present but covered. The `--ember-glow` shadow on the banner may make it appear invisible even when partially showing.

**Cause C — `display: none` or `opacity: 0` caused by a conditional that evaluates differently on mobile.**
The dismiss logic writes to `localStorage` key `fittrack_coaching_dismissed_at_<id>`. If a mobile session has a stale dismiss entry from a prior test, the banner is suppressed for 7 days. Clear `localStorage` and retest to rule this out.

**Cause D — Container overflow clipping.**
The `glass-card` or page container wrapping the banner has `overflow: hidden` or `overflow: clip`. On mobile, where page containers are narrower, content that extends to the edge of a card clips before it can paint.

**Cause E — `z-index` stacking failure on mobile WebKit.**
Safari and Chrome on iOS handle `z-index` stacking contexts differently from desktop. A banner inside a stacking context with `z-index: 0` will not escape that context regardless of its own `z-index` value.

### Fix Plan

**Step 1 — Confirm the banner is in the DOM on mobile**
Open Chrome DevTools Remote Debugging on the phone. On the Dashboard, search the DOM for `AdaptiveDietBanner` or its container class. If the node exists but has `display: none`, the conditional guard is wrong. If it exists with positive dimensions but is invisible, it is a CSS stacking/overflow issue.

**Step 2 — Remove any `position: fixed` or `position: sticky` from the banner itself**
`AdaptiveDietBanner.jsx` — the banner must render as a normal `position: relative` block in the document flow. It should not be `fixed` or `sticky`. If the pulsing animation uses a `position: absolute` pseudo-element or child, that child must be contained within `overflow: hidden` on the badge circle, not the banner card.

**Step 3 — Audit ancestor containers for transform + fixed conflict**
In `DashboardPage.jsx`, find the wrapper div that contains the banner. Check if any ancestor up the tree has any of: `transform`, `will-change: transform`, `filter`, `perspective`, `contain`. If any exists, either:
- Move the banner outside that container so it is a direct child of the page root div, OR
- Change the conflicting ancestor to not use `transform` (use `margin` or `padding` for spacing instead)

**Step 4 — Ensure the banner is above the bottom nav on mobile**
The `BottomNav` is `position: fixed; bottom: 0; z-index: 1000` (approximate). The banner must:
- Be rendered as a flow element (not fixed) so it scrolls with the page content
- The page content area must have enough `padding-bottom` to clear the fixed nav (already set app-wide — confirm it applies to the banner's containing section)

**Step 5 — Remove `overflow: hidden` from the banner's parent card on mobile**
In `DashboardPage.jsx` and `DietPage.jsx`, wherever the banner is placed, ensure the immediate parent div does not have `overflow: hidden`. If the parent is a `glass-card` with `border-radius` that clips the banner's animated glow, replace `overflow: hidden` with `overflow: clip` for the rounded corners, and wrap the glow in a contained child instead of relying on the parent clip.

**Step 6 — Simplify the pulsing animation for mobile**
The `AdaptiveDietBanner.jsx` "animated pulsing indicator glows" use a `box-shadow` pulse animation. On low-power mobile rendering, `box-shadow` animations can cause paint storms that result in the element being composited out of the visible layer. Replace the `box-shadow` animation with a `transform: scale()` pulse on the indicator dot — this is GPU-composited and reliable on all mobile WebKit versions:

```css
/* Replace box-shadow pulse with transform scale */
@keyframes coachPulse {
  0%, 100% { transform: scale(1);   opacity: 1;    }
  50%       { transform: scale(1.4); opacity: 0.65; }
}

.coach-indicator-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--primary-container);
  animation: coachPulse 1.8s var(--ease-smooth) infinite;
  will-change: transform, opacity;
  flex-shrink: 0;
}
```

**Step 7 — Add explicit `z-index` and `position: relative` to the banner card**
```jsx
// AdaptiveDietBanner.jsx — outermost wrapper div
<div
  style={{
    position: 'relative',
    zIndex: 10,
    // ... rest of existing styles
  }}
>
```
This lifts the banner above any sibling elements that may have been painted over it without creating a new problematic stacking context.

**Step 8 — Test the dismiss guard**
On mobile DevTools → Application → Local Storage → clear all `fittrack_coaching_dismissed_at_*` keys. Reload. If the banner now appears, the issue was a stale dismiss from testing. The 7-day suppress logic is correct — no code change needed for this path.

### Files to Modify
| File | Change |
|------|--------|
| `src/components/shared/AdaptiveDietBanner.jsx` | Add `position: relative; z-index: 10` to outer wrapper; replace box-shadow pulse with transform scale pulse |
| `src/index.css` | Replace `@keyframes coachPulse` (if defined there) with transform-based version |
| `src/components/pages/DashboardPage.jsx` | Ensure banner parent container has no `overflow: hidden`; no `transform` ancestor conflict |
| `src/components/pages/DietPage.jsx` | Same audit — ensure banner parent container is clean |

### QA Checklist
- [ ] Banner visible on iOS Safari (iPhone)
- [ ] Banner visible on Android Chrome
- [ ] Banner not covered by BottomNav
- [ ] Pulse animation smooth (no jank on lower-end phones)
- [ ] Dismiss still works on mobile — banner stays hidden for 7 days after tap
- [ ] Desktop unchanged — banner still renders correctly

### Acceptance Criteria
- Banner visible on mobile phone browsers on both Dashboard and DietPage
- Pulse animation GPU-composited (transform-based, not box-shadow)
- No layout shift caused by the banner on mobile

---

## Bug 2 — PR Badge: Replace Flame Icon with "PR" Text

### Symptom
The PR badge currently renders as a 22px gradient circle with a Lucide `Flame` icon. The desired design is the text label **"PR"** instead.

### Design Spec (Kinetic Elite + taste-design)

**New badge design:**
- Shape: rounded rectangle pill (not a circle) — `border-radius: 6px`
- Size: auto-width by text, height `20px`, horizontal padding `5px`
- Background: `linear-gradient(135deg, #FFB59B, #F85F1B)` — signature gradient
- Text: `"PR"` in `Space Grotesk 700`, `10px`, `letter-spacing: 0.06em`, `color: #fff`
- No border, no outer glow — the gradient is the signal
- Replaces the set-number cell content (same 34px cell, badge is centred within it)
- Box-shadow: `0 1px 6px rgba(248, 95, 27, 0.30)` — diffused ember, not neon

This is more legible at small sizes than an icon, more explicit for new users, and follows the taste-design principle of pure type signals over decorative icons where the text is the clearest option.

**"NEW PR" floating label:** Remove entirely — the pill text already communicates the achievement. The set row `prFlash` animation and ember left-border remain unchanged.

### Files to Modify
| File | Change |
|------|--------|
| `src/components/pages/WorkoutPage.jsx` | Remove `Flame` import; replace badge circle JSX with text pill |
| `src/index.css` | Replace `.pr-badge-circle` with `.pr-badge-pill`; remove `.pr-new-label` and `@keyframes prLabelFade` |

### Changes to WorkoutPage.jsx

Remove import:
```js
// Remove this line:
import { Flame } from 'lucide-react';
```

Replace the badge circle JSX in the set row:
```jsx
{/* BEFORE */}
<div className="pr-badge-circle" title="Personal Record">
  <Flame size={11} color="#fff" strokeWidth={2.5} />
</div>

{/* AFTER */}
<div className="pr-badge-pill" title="Personal Record">
  PR
</div>
```

Remove the `isFirstPR` calculation and the `pr-new-label` div entirely — the pill is self-explanatory:
```jsx
// Remove these lines:
const isFirstPR = isPR && !ex.sets
  .slice(0, setIndex)
  .some(s => s.done && beatsAllTimePR(pr, s.weight ?? 0, s.reps ?? 0));

// Remove this JSX block:
{isFirstPR && <div className="pr-new-label">NEW PR</div>}
```

### Changes to src/index.css

Remove old badge and label CSS, add new pill:
```css
/* Remove: */
.pr-badge-circle { ... }
.pr-new-label { ... }
@keyframes prLabelFade { ... }

/* Add: */
.pr-badge-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 20px;
  padding: 0 5px;
  border-radius: 6px;
  background: linear-gradient(135deg, #FFB59B, #F85F1B);
  box-shadow: 0 1px 6px rgba(248, 95, 27, 0.30);

  font-family: 'Space Grotesk', sans-serif;
  font-weight: 700;
  font-size: 10px;
  letter-spacing: 0.06em;
  color: #fff;
  white-space: nowrap;

  /* GPU-composited */
  will-change: transform;
}
```

Keep unchanged: `.set-row.is-pr`, `@keyframes prFlash` — the row-level animation and ember border are still correct.

### QA Checklist
- [ ] "PR" pill visible in 34px set-number cell without overflow
- [ ] Gradient renders correctly on both light and dark theme
- [ ] `prFlash` row animation still fires when set is marked done as a PR
- [ ] No `Flame` icon import remaining in WorkoutPage.jsx
- [ ] No `.pr-new-label` floating element rendering
- [ ] Swapped exercises still show pill (confirms prMap key is using sv.name)

### Acceptance Criteria
- Set-number cell shows "PR" gradient pill (not an icon) when a PR is set
- Ember left-border and prFlash glow animation remain on the row
- No floating "NEW PR" label

---

## Bug 3 — KCAL Goal Out of Sync: Dashboard Shows 3227, DietPage Shows 2827 (400 kcal discrepancy)

### Symptom
The calorie goal displayed on the Dashboard "Goal Progress" card (3227 kcal) does not match the calorie target shown on the DietPage macro rings (2827 kcal). The 400 kcal delta is exactly the size of a typical deficit adjustment, strongly suggesting the two pages are reading from different steps in the TDEE priority chain.

### Root Cause Diagnosis

From `State.md`:

> "All values are computed dynamically using the TDEE priority chain (Manual > Accepted Adaptive > Static fallback)"

The TDEE priority chain has three levels:
1. **Manual override** — user-set value stored in `fittrack_tdeePreferences_<userId>` → `manualTDEE`
2. **Accepted Adaptive estimate** — from `adaptiveTDEE.js` engine, stored in `fittrack_tdeeEstimate_<userId>` → `estimatedTDEE`
3. **Static fallback** — Mifflin-St Jeor BMR × activity multiplier, computed from `profile.weight / age / height / activity`

The Adaptive TDEE engine applies a **deficit or surplus** on top of the base TDEE to produce a *calorie target* (not just a maintenance number). The discrepancy is:

- **DietPage** (2827 kcal) is likely reading the **Static fallback TDEE** and correctly subtracting the goal deficit (e.g., TDEE 3227 − 400 deficit = 2827 target).
- **Dashboard** (3227 kcal) is likely reading the **raw TDEE value** (maintenance) without applying the deficit, or it is reading a different step in the chain entirely (e.g., Manual TDEE which was set to 3227, while DietPage uses the calculated target after deficit).

**Alternative diagnosis:** The Dashboard `protTarget` calibration update (2026-04-16) changed how `protTarget` is computed. If the same logic change also touched the calorie display calculation and only applied it in one file (`DietPage.jsx`) but not the other (`DashboardPage.jsx`), the two pages diverged.

**The fix must centralise the TDEE → calorie-target calculation into one shared utility so both pages read the same value.**

### Fix Plan

**Step 1 — Audit the calorie target calculation in both files**

In `DashboardPage.jsx`, find how the displayed kcal goal is computed. Look for any of:
- `tdee`, `profile.tdee`, `estimatedTDEE`, `manualTDEE`, `calcTDEE(...)`, `adaptiveTDEE`
- The goal card reads something like `targetKcal` or `kcalGoal` — trace where that variable is set

In `DietPage.jsx`, find the same variable — `targetKcal`, `kcalGoal`, or similar — and trace its computation path.

Document the exact formula each page uses and where they diverge.

**Step 2 — Create a single shared function `getActiveKcalTarget(profile, tdeePreferences, tdeeEstimate)`**

Add to `src/utils/calculations.js` (where BMR, TDEE, deficit calculations already live):

```js
/**
 * Returns the active daily kcal TARGET (maintenance TDEE minus/plus goal deficit/surplus).
 * This is the single source of truth for the calorie goal shown on Dashboard and DietPage.
 *
 * Priority chain:
 * 1. Manual TDEE override (user-set) — used as-is (user already accounted for deficit)
 * 2. Accepted Adaptive TDEE estimate — subtract goal deficit
 * 3. Static TDEE (Mifflin-St Jeor × activity multiplier) — subtract goal deficit
 *
 * @param {object} profile       — from AppContext (weight, height, age, activity, etc.)
 * @param {object} tdeePrefs     — from localStorage fittrack_tdeePreferences_<userId>
 * @param {object} tdeeEstimate  — from localStorage fittrack_tdeeEstimate_<userId>
 * @returns {number} kcal target per day (rounded to nearest integer)
 */
export function getActiveKcalTarget(profile, tdeePrefs, tdeeEstimate) {
  // Derive goal deficit from profile (positive = cut, negative = bulk)
  const deficit = calcGoalDeficit(profile);  // existing function — e.g. 400 for cut

  // Priority 1: Manual override
  if (tdeePrefs?.useManual && tdeePrefs?.manualTDEE > 0) {
    // Manual TDEE is set by the user who presumably already included their deficit
    // Return as-is, but apply deficit if the manual value looks like a maintenance number
    // (This behaviour should match how ProfilePage explains the manual TDEE to the user)
    return Math.round(tdeePrefs.manualTDEE - deficit);
    // NOTE: confirm with the existing manual TDEE semantics — if manualTDEE already IS
    // the target (not maintenance), remove the deficit subtraction here.
  }

  // Priority 2: Accepted Adaptive estimate
  if (tdeePrefs?.useAdaptive !== false && tdeeEstimate?.estimatedTDEE > 0 && tdeeEstimate?.confidence !== 'low') {
    return Math.round(tdeeEstimate.estimatedTDEE - deficit);
  }

  // Priority 3: Static Mifflin-St Jeor fallback
  const staticTDEE = calcTDEE(profile);  // existing function
  return Math.round(staticTDEE - deficit);
}
```

**Step 3 — Replace both pages' inline calculations with the shared function**

In `DashboardPage.jsx`:
```js
import { getActiveKcalTarget } from '../../utils/calculations';

// Replace whatever produces the kcal goal number:
const kcalTarget = getActiveKcalTarget(profile, tdeePreferences, tdeeEstimate);
```

In `DietPage.jsx`:
```js
import { getActiveKcalTarget } from '../../utils/calculations';

// Replace the existing kcal target computation:
const kcalTarget = getActiveKcalTarget(profile, tdeePreferences, tdeeEstimate);
```

Both pages now read from the identical logic tree. Any future change to the priority chain only needs to happen in one place.

**Step 4 — Verify the `calcGoalDeficit` function is correct**

`calcGoalDeficit(profile)` should return:
- A positive number (e.g. 400) when `profile.goal === 'loss'` (cut)
- A negative number (e.g. −300) when `profile.goal === 'bulk'` (surplus)
- 0 when `profile.goal === 'maintain'`

If this function does not exist yet, create it. The deficit value should be derived from the user's `profile.weightGoal` vs `profile.weight` delta and their goal pace, matching whatever DietPage currently computes.

**Step 5 — Add a console.log during development to confirm both pages read the same value**
```js
console.log('[TDEE Debug] kcalTarget:', kcalTarget, 'source:', tdeePrefs?.useManual ? 'manual' : tdeeEstimate?.estimatedTDEE > 0 ? 'adaptive' : 'static');
```
Remove before shipping.

### Files to Modify
| File | Change |
|------|--------|
| `src/utils/calculations.js` | Add `getActiveKcalTarget(profile, tdeePrefs, tdeeEstimate)` and `calcGoalDeficit(profile)` |
| `src/components/pages/DashboardPage.jsx` | Replace inline kcal goal calculation with `getActiveKcalTarget(...)` |
| `src/components/pages/DietPage.jsx` | Replace inline kcal target calculation with `getActiveKcalTarget(...)` |

### QA Checklist
- [ ] Dashboard kcal goal === DietPage kcal goal for the same user
- [ ] Matches when goal is "loss" (cut deficit applied)
- [ ] Matches when goal is "bulk" (surplus applied)
- [ ] Matches when goal is "maintain" (no delta)
- [ ] Matches with Manual TDEE override enabled
- [ ] Matches with Adaptive TDEE accepted
- [ ] Matches on Static fallback (no logs yet)
- [ ] Changing profile weight/goal/activity updates both pages simultaneously on next render

### Acceptance Criteria
- Dashboard and DietPage show the same kcal goal number for every user under every TDEE mode
- A single `getActiveKcalTarget` function in `calculations.js` is the only place this logic lives

---

## Bug 4 — Profile Page Top Metric Cards Overflow on Mobile

### Symptom
The four metric cards at the top of `/profile` (BMI, BF%, BMR, TDEE) overflow their container on phone browsers — content leaks outside card bounds or cards extend beyond the screen width, requiring horizontal scroll.

### Root Cause Diagnosis

The four cards are almost certainly rendered in a single `display: flex` row with `flex-wrap: nowrap` or a fixed `min-width` on each card. On a 375px screen, four cards at equal width = 93.75px each, which is too narrow for the metric labels and values. Possible causes:
- Cards use `width: 25%` with `min-width` that sums to more than 100%
- Cards use `flex: 1 0 auto` with a `min-width` that prevents shrinking
- Cards use fixed `px` widths that work on desktop but overflow mobile
- The row container has no `overflow: hidden` so cards bleed visually

### Design Spec for Fixed Layout (Kinetic Elite + taste-design)

The four metric cards must be redesigned as a **2×2 CSS Grid** on mobile (< 640px) and a **1×4 row** on desktop. No flexbox percentage math.

Each card:
- Background: `var(--surface-container-low)`
- Border-radius: `14px`
- Padding: `14px 16px`
- Metric value: `Space Grotesk 700`, `clamp(1.2rem, 4vw, 1.6rem)`, `var(--primary)` — scales with viewport
- Metric label: `Be Vietnam Pro 500`, `10px`, `letter-spacing: 0.08em`, uppercase, `var(--on-surface-dim)`
- Sub-label / category badge: `Be Vietnam Pro 400`, `11px`, `var(--on-surface-variant)`
- No outer glow, no border, no shadow heavier than `0 1px 4px rgba(0,0,0,0.15)`

Grid layout:
```css
.profile-metrics-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;   /* 2 cols on mobile */
  gap: 10px;
  width: 100%;
}

@media (min-width: 640px) {
  .profile-metrics-grid {
    grid-template-columns: repeat(4, 1fr);  /* 4 cols on tablet/desktop */
  }
}
```

### Files to Modify
| File | Change |
|------|--------|
| `src/components/pages/ProfilePage.jsx` | Replace flex row with CSS Grid `.profile-metrics-grid`; apply `clamp()` font scaling to metric values |
| `src/index.css` | Add `.profile-metrics-grid` and `.profile-metric-card` rules with responsive breakpoint |

### Changes to ProfilePage.jsx

Replace the current metric row container and card structure:

```jsx
{/* BEFORE — likely something like: */}
<div style={{ display: 'flex', gap: 12 }}>
  <div style={{ flex: 1, minWidth: 80 }}>...</div>
  <div style={{ flex: 1, minWidth: 80 }}>...</div>
  <div style={{ flex: 1, minWidth: 80 }}>...</div>
  <div style={{ flex: 1, minWidth: 80 }}>...</div>
</div>

{/* AFTER — CSS Grid with responsive collapse: */}
<div className="profile-metrics-grid">
  
  {/* BMI */}
  <div className="profile-metric-card">
    <span className="metric-label">BMI</span>
    <span className="metric-value">{bmi ?? '—'}</span>
    <span className="metric-sub">{bmiCategory}</span>
  </div>

  {/* BF% */}
  <div className="profile-metric-card">
    <span className="metric-label">Body Fat</span>
    <span className="metric-value">
      {latestBF != null ? `${latestBF}%` : '—'}
    </span>
    <span className="metric-sub">{bfCategory ?? 'Not logged'}</span>
  </div>

  {/* BMR */}
  <div className="profile-metric-card">
    <span className="metric-label">BMR</span>
    <span className="metric-value">
      {bmr != null ? `${Math.round(bmr)}` : '—'}
    </span>
    <span className="metric-sub">kcal / day</span>
  </div>

  {/* TDEE */}
  <div className="profile-metric-card">
    <span className="metric-label">TDEE</span>
    <span className="metric-value">
      {activeTDEE != null ? `${Math.round(activeTDEE)}` : '—'}
    </span>
    <span className="metric-sub">kcal / day</span>
  </div>

</div>
```

### Changes to src/index.css

```css
/* ── Profile metrics 2×2 / 1×4 grid ────────────────────────────── */

.profile-metrics-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  width: 100%;
}

@media (min-width: 640px) {
  .profile-metrics-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

.profile-metric-card {
  background: var(--surface-container-low);
  border-radius: 14px;
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;           /* critical: allows grid cell to shrink below content width */
  overflow: hidden;
}

.profile-metric-card .metric-label {
  font-family: 'Be Vietnam Pro', sans-serif;
  font-weight: 500;
  font-size: 10px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--on-surface-dim);
  white-space: nowrap;
}

.profile-metric-card .metric-value {
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 700;
  font-size: clamp(1.1rem, 4vw, 1.5rem);
  color: var(--primary);
  letter-spacing: -0.02em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.profile-metric-card .metric-sub {
  font-family: 'Be Vietnam Pro', sans-serif;
  font-weight: 400;
  font-size: 11px;
  color: var(--on-surface-variant);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
```

### QA Checklist
- [ ] 375px (iPhone SE) — 2×2 grid, no horizontal overflow, all values visible
- [ ] 393px (iPhone 14 Pro) — same 2×2, comfortable spacing
- [ ] 768px (iPad) — switches to 1×4 row layout
- [ ] Desktop — 1×4 row, all cards same height
- [ ] `clamp()` font size scales gracefully between 375px and 1200px
- [ ] Dark theme: cards use `var(--surface-container-low)` correctly
- [ ] Light theme: cards use the warm linen light-theme equivalent
- [ ] `—` shown for any metric that has no data (null-safe)
- [ ] No horizontal scroll bar on profile page on any mobile viewport

### Acceptance Criteria
- Four metric cards render in a 2-column grid on mobile, 4-column on desktop
- No overflow, no horizontal scroll, no content clipping on any viewport
- Metric values scale with `clamp()` — never clip or wrap within the card
- Design follows Kinetic Elite tokens throughout (no new colours or shadows)

---

## Bug 5 — Swap Exercise Pre-fill: Populates Old Exercise Data, Not New

### Symptom
When swapping an exercise mid-session, the replacement exercise's set rows are pre-filled with the weight and reps of the **original (pre-swap) exercise**, not the replacement. Example: Barbell Incline Bench Press had 100 kg × 6 reps → swapping to Dumbbell Press (which has 50 kg × 6 reps in history) → sets still show 100 kg × 6.

### Root Cause Diagnosis

The `getLastLiftedForExercise` function and the swap pre-fill handler were planned in the previous TODO sprint. Based on the bug report, the most likely implementation error is one of two things:

**Root Cause A (most likely) — Lookup called with the wrong name.**
The swap handler calls `getLastLiftedForExercise(workoutLogs, ex.name)` where `ex.name` is still the **original** exercise name at the time the call runs, before `ex.sv` has been committed. The correct call is `getLastLiftedForExercise(workoutLogs, newExercise.name)` where `newExercise` is the exercise object selected in the swap modal.

**Root Cause B — `ex.sv` lookup failing, falling back to original.**
The pre-fill sets `weight` from `history?.weight ?? set.weight`. If `history` is `null` (because the lookup ran on the wrong name and found nothing), the fallback `set.weight` is the existing weight from the original exercise — which is exactly the symptom observed (100 kg from the original exercise, not 50 kg from the new one). This confirms Root Cause A.

**Root Cause C — The session state mutation order is wrong.**
If `ex.sv` is committed to session state **before** the lookup runs, then reading `ex.sv?.name ?? ex.name` in the lookup correctly finds the new name. But if the lookup runs **before** `ex.sv` is committed (i.e., inside the same `setSession` batch), then `ex.sv` is undefined and `ex.name` is the old name.

The fix depends on which root cause is confirmed, but the most robust fix addresses all three simultaneously.

### Fix Plan

**Step 1 — Locate the swap confirm handler in WorkoutPage.jsx**

Find the handler that fires when the user confirms a swap in the Portal modal. It will look roughly like:
```js
// Somewhere in WorkoutPage.jsx:
const handleSwapConfirm = (newExercise) => {
  // This sets ex.sv on the exercise
  setSession(prev => ({ ... }));
  // The history lookup may be happening here, or before/after
};
```

**Step 2 — Identify the exact name being passed to `getLastLiftedForExercise`**

Check if the call is:
```js
// WRONG — uses original exercise name:
const history = getLastLiftedForExercise(workoutLogs, session.exercises[swappedExIndex].name);

// WRONG — ex.sv may not be set yet if called before setSession:
const history = getLastLiftedForExercise(workoutLogs, ex.sv?.name ?? ex.name);

// CORRECT — uses the new exercise object directly from the swap modal selection:
const history = getLastLiftedForExercise(workoutLogs, newExercise.name);
```

**Step 3 — Restructure the handler to guarantee correct order**

The correct implementation:

```js
const handleSwapConfirm = (newExercise, swappedExIndex) => {
  // Step A: Look up history BEFORE state mutation, using newExercise.name directly
  // newExercise is the object the user selected in the swap modal
  const history = getLastLiftedForExercise(workoutLogs, newExercise.name);

  // Step B: Commit the swap and pre-fill in a single setSession call
  setSession(prev => ({
    ...prev,
    exercises: prev.exercises.map((ex, idx) => {
      if (idx !== swappedExIndex) return ex;
      return {
        ...ex,
        // sv stores the swapped-in exercise details
        sv: newExercise,
        // History chip metadata
        _swapHistory: history ?? null,
        // Pre-fill pending sets from the NEW exercise's history
        sets: ex.sets.map(set => ({
          ...set,
          weight: set.done ? set.weight : (history?.weight ?? ''),
          reps:   set.done ? set.reps   : (history?.reps   ?? ''),
        })),
      };
    }),
  }));
};
```

Key points:
- `getLastLiftedForExercise(workoutLogs, newExercise.name)` — `newExercise` is the swap target, passed directly from the modal, not read from session state
- The fallback when no history is `''` (empty string), not `set.weight` — this prevents the old exercise's weight from bleeding through
- Both `sv: newExercise` and the set pre-fill happen in the same `setSession` batch

**Step 4 — Verify the `getLastLiftedForExercise` function's name normalisation**

The function uses `norm()` which is `s?.trim().toLowerCase()`. Confirm that exercise names in `workoutLogs` match the names in the swap modal's exercise list. If exercises are stored as `"Dumbbell Press"` in logs but the swap modal lists them as `"Dumbbell Bench Press"`, the lookup will return `null` and pre-fill will silently fall through to empty. This is a data naming consistency issue — not a bug in the function, but worth confirming.

**Step 5 — Confirm the "Last session" chip shows the correct exercise**

After the fix, the `_swapHistory` chip should display:
- For Dumbbell Press swap: "Last: 50 kg × 6 reps · 20 Apr" (from Dumbbell Press history)
- NOT: "Last: 100 kg × 6 reps · 20 Apr" (from Barbell Incline Bench Press history)

If the chip shows the correct data, the lookup is working. If the chip shows the old exercise's data, Root Cause A is confirmed and the `newExercise.name` fix is what's needed.

**Step 6 — Clear any cached session state during development**

The in-progress workout session may be reading from a cached state object that was set before the fix. Clear the active session by discarding the current workout and starting fresh after deploying the fix.

### Files to Modify
| File | Change |
|------|--------|
| `src/components/pages/WorkoutPage.jsx` | Fix `handleSwapConfirm` (or equivalent) to call `getLastLiftedForExercise(workoutLogs, newExercise.name)` with the correct argument; ensure `sv` and set pre-fill happen in one `setSession` batch; fallback to `''` not `set.weight` |
| `src/utils/exerciseHistory.js` | Likely no changes needed — the function logic is correct; the bug is in how it's called |

### QA Checklist
- [ ] Swap Barbell Incline Bench Press → Dumbbell Press: sets show 50 kg × 6 reps (Dumbbell Press history), not 100 kg
- [ ] "Last session" chip under exercise name shows Dumbbell Press history date
- [ ] Original exercise (Barbell Incline Bench Press) pre-fill still correct if not swapped
- [ ] Swapping an exercise that has NO history: sets are blank (empty string), not populated with old exercise values
- [ ] Already-done sets in the current session are not overwritten regardless of swap
- [ ] Swapping back to original exercise: pre-fills from original exercise's history correctly
- [ ] Bodyweight swap: weight stays 0, reps pre-filled from bodyweight history
- [ ] PR badge (if implemented): evaluates against the new exercise's PR after swap

### Acceptance Criteria
- Swapping any exercise pre-fills sets with the **replacement exercise's** last session weight and reps — never the original exercise's values
- Sets with no history for the replacement exercise are blank (empty input), not pre-populated
- The "Last session" chip reflects the replacement exercise's history date and values
- Already-done sets in the current session are never modified by a swap

---

## Implementation Order

| # | Bug | Effort | Risk |
|:-:|-----|:------:|------|
| 1 | **Swap pre-fill wrong exercise (Bug 5)** | 30 min | Low — surgical fix to one argument |
| 2 | **PR badge text "PR" (Bug 2)** | 30 min | Low — CSS + JSX swap only |
| 3 | **KCAL goal sync (Bug 3)** | 2–3 hrs | Medium — shared utility + audit both pages |
| 4 | **Profile cards overflow (Bug 4)** | 1–2 hrs | Low — CSS Grid refactor |
| 5 | **Adaptive coach banner mobile (Bug 1)** | 1–2 hrs | Medium — requires mobile DevTools session to confirm root cause |

**Recommended sequence:** 1 → 2 → 4 → 3 → 5

Fix the two surgical low-risk bugs first (swap name and PR label), then the layout fix, then the TDEE sync (requires careful audit to avoid breaking the priority chain), then the mobile rendering issue last (requires device testing to confirm the root cause before applying the fix).

---

## Regression Test Suite

After all 5 fixes, run these cross-checks to confirm no regressions:

- [ ] Dashboard kcal goal === DietPage kcal goal (Bug 3)
- [ ] Swapping exercise → correct history, not original (Bug 5)
- [ ] PR badge shows "PR" text, not icon (Bug 2)
- [ ] Profile page metrics no overflow on 375px (Bug 4)
- [ ] Adaptive coach banner visible on iOS Safari and Android Chrome (Bug 1)
- [ ] Existing PR badge flash animation still plays on set done
- [ ] Existing set pre-fill chip shows correct exercise name and date
- [ ] DietPage macro rings (P/C/F) still correct after kcal sync fix
- [ ] TDEE shown on Profile page matches the value used in DietPage goal rings
- [ ] Manual TDEE override in Profile still respected by both Dashboard and DietPage

---

## Gap Analysis (Added 2026-04-23)

> Cross-referenced every bug plan against the live codebase. 12 gaps found.
> **Do NOT follow the original plan sections blindly — use the corrected instructions below.**

### Quick Reference: All Gaps Found

| # | Bug | Gap | Severity |
|:-:|:---:|-----|:--------:|
| 1 | Bug 5 | Root Cause A is wrong — lookup already uses `newName` correctly | **Critical** (would waste time searching for a non-bug) |
| 2 | Bug 5 | Fallback `set.weight` → `''` is the real fix (TODO correctly identifies this) | Confirmed |
| 3 | Bug 5 | TODO says `sv: newExercise` (object) — actual code uses `sv: newName` (string) — no change needed | Info |
| 4 | Bug 2 | `Flame` is destructured in a multi-import — remove `, Flame` not the whole line | Medium |
| 5 | Bug 2 | `isFirstPR` snippet uses `setIndex` — actual variable is `si` | Typo (breaks if copy-pasted) |
| 6 | Bug 2 | CSS removal must include `@keyframes prLabelFade` (lines 377–382) not just the class | Medium |
| 7 | Bug 3 | `calcGoalDeficit()` does not exist — existing function is `calcDeficit(w, g, wk)` | **Critical** (code won't compile) |
| 8 | Bug 3 | Real root cause: DietPage reads `user.customGoalKcal`, Dashboard ignores it | **Critical** (wrong diagnosis) |
| 9 | Bug 3 | Full shared utility is unnecessary — one-line fix on Dashboard | Effort savings |
| 10 | Bug 4 | Profile grid is already CSS Grid (`repeat(4, 1fr)`) not flexbox | Medium (wrong diagnosis) |
| 11 | Bug 4 | Variable names differ: `latestBFPct` not `latestBF`, `tdee` not `activeTDEE`, `getBMICat(bmi).label` not `bmiCategory` | Medium (JSX won't compile if copy-pasted) |
| 12 | Bug 1 | Banner does NOT use `position: fixed/sticky` — it's a normal flow element | Medium (Causes A/B/E are unlikely) |

---

### Corrected Implementation: Bug 5 — Swap Pre-fill

**Original diagnosis wrong.** The TODO claims `getLastLiftedForExercise` is called with the old exercise name (Root Cause A). In reality, the actual code at line 875–893 of `WorkoutPage.jsx` already passes `newName` (the replacement exercise string from the swap modal):

```js
// ACTUAL CODE (line 875-876) — lookup is CORRECT:
const swapExercise = (exerciseIndex, newName) => {
  const history = getLastLiftedForExercise(workoutLogs, newName);  // ✅ correct arg
```

**The real bug is only the fallback value (Gap 2).** When `history` is `null` (no prior data for the replacement exercise), the current code falls back to `set.weight` / `set.reps` — which are the **original exercise's values** still sitting in the set. This is what causes "100 kg from Barbell Press" to appear in the Dumbbell Press row after swap.

**Exact fix — `WorkoutPage.jsx` line 888–889:**
```js
// BEFORE (buggy — old exercise values bleed through):
weight: set.done ? set.weight : (history ? String(history.weight) : set.weight),
reps:   set.done ? set.reps   : (history ? String(history.reps)   : set.reps),

// AFTER (fixed — blank when no history):
weight: set.done ? set.weight : (history ? String(history.weight) : ''),
reps:   set.done ? set.reps   : (history ? String(history.reps)   : ''),
```

**No other changes needed.** The `sv: newName` (string) is correct. The `_swapHistory` metadata is correct. The `getLastLiftedForExercise` function is correct. Only the two fallback values need to change from `set.weight`/`set.reps` to `''`.

**Files to modify:** `src/components/pages/WorkoutPage.jsx` only (2 string changes on lines 888–889).

---

### Corrected Implementation: Bug 2 — PR Badge Pill

**Gap 4 — Import fix.** `Flame` is part of a multi-icon destructured import on line 3:
```js
// BEFORE:
import { Trophy, Timer, X, Check, Play, Pause, Square, ArrowRightLeft, Clock, Flame } from 'lucide-react';

// AFTER (just remove ', Flame'):
import { Trophy, Timer, X, Check, Play, Pause, Square, ArrowRightLeft, Clock } from 'lucide-react';
```

**Gap 5 — `isFirstPR` uses `si` not `setIndex`.** The TODO snippet to remove uses `setIndex` which doesn't exist. The actual code to remove is at lines 1132–1134:
```js
// REMOVE these 3 lines (actual code):
const isFirstPR = isPR && !ex.sets
  .slice(0, si)    // <-- actual variable is `si`, not `setIndex`
  .some(prev => prev.done && beatsAllTimePR(pr, parseFloat(prev.weight) || 0, parseFloat(prev.reps) || 0));
```

**Badge JSX replacement — lines 1149–1155:**
```jsx
// BEFORE:
{isPR ? (
  <div className="pr-badge-circle" title="Personal Record">
    <Flame size={11} color="#fff" strokeWidth={2.5} />
  </div>
) : (
  si + 1
)}

// AFTER:
{isPR ? (
  <div className="pr-badge-pill" title="Personal Record">
    PR
  </div>
) : (
  si + 1
)}
```

**Remove `pr-new-label` JSX — line 1183:**
```jsx
// REMOVE this line:
{isFirstPR && <div className="pr-new-label">NEW PR</div>}
```

**Gap 6 — CSS changes in `src/index.css` — remove 3 blocks, add 1:**

Remove (lines 377–382):
```css
@keyframes prLabelFade { ... }
```

Remove (lines 395–406):
```css
.pr-badge-circle { ... }
```

Remove (lines 410–424):
```css
.pr-new-label { ... }
```

Add:
```css
.pr-badge-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 20px;
  padding: 0 5px;
  border-radius: 6px;
  background: linear-gradient(135deg, #FFB59B, #F85F1B);
  box-shadow: 0 1px 6px rgba(248, 95, 27, 0.30);
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 700;
  font-size: 10px;
  letter-spacing: 0.06em;
  color: #fff;
  white-space: nowrap;
  will-change: transform;
}
```

Keep unchanged: `.set-row.is-pr` and `@keyframes prFlash`.

**Files to modify:** `src/components/pages/WorkoutPage.jsx` (import, JSX, remove isFirstPR) + `src/index.css` (swap CSS classes).

---

### Corrected Implementation: Bug 3 — KCAL Goal Sync

> **The entire original plan is wrong. Do NOT create `getActiveKcalTarget` or `calcGoalDeficit`. Do NOT refactor both pages.**

**Corrected root cause (Gaps 7–9):**

The DietPage's `goalKcal` computation (line 167) is:
```js
const goalKcal = user?.customGoalKcal || computedGoalKcal;
```

When the user accepts an adaptive coaching suggestion via `acceptSuggestion()`, the handler calls `updateProfile({ customGoalKcal: computedKcal })`. DietPage reads this override. Dashboard does NOT — it always computes `goalKcal` from scratch using `calcTDEE` + `calcDeficit` (lines 283–301).

The 400 kcal discrepancy is exactly the adaptive adjustment saved to `customGoalKcal`.

**Exact fix — `DashboardPage.jsx` line 297:**
```js
// BEFORE:
goalKcal: Math.round(k),

// AFTER:
goalKcal: user?.customGoalKcal || Math.round(k),
```

One line. Both pages now use the same logic: prefer `customGoalKcal` (set by adaptive coach acceptance) → fall back to computed value.

**No new utility functions. No `calcGoalDeficit`. No shared module. No changes to `calculations.js`.**

**Files to modify:** `src/components/pages/DashboardPage.jsx` only (1 line change on line 297).

---

### Corrected Implementation: Bug 4 — Profile Cards Overflow

**Gap 10 — Already CSS Grid, not flexbox.** The actual code (line 288) is:
```jsx
<div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 12 }}>
```

The fix is to move the grid to a CSS class with a responsive breakpoint, NOT to convert from flexbox.

**Gap 11 — Variable names.** Actual variable names in the existing JSX:
- BMI value: `bmi` (from `calcBMI`)
- BMI category: `getBMICat(bmi).label`
- BF%: `latestBFPct` → displayed as `latestBFPct.toFixed(1)%`
- BMR: `bmr` (from `calcBMR`)
- TDEE: `tdee` (from `calcTDEESource` on line 226–227)

**Exact fix approach:**

Step 1 — Replace inline grid style on line 288 with a class:
```jsx
// BEFORE:
<div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 12 }}>

// AFTER:
<div className="profile-metrics-grid">
```

Step 2 — Keep the existing 4 card children **as-is** (do NOT change variable names or card internal JSX — they already work). Just add `min-width: 0; overflow: hidden` to each card's inline style to prevent content overflow:

For each of the 4 card divs (lines 289, 293, 297, 302), add `minWidth: 0, overflow: 'hidden'` to the existing style object.

Step 3 — Add CSS to `src/index.css`:
```css
/* ── Profile metrics 2×2 / 1×4 grid ────────────────────────────── */

.profile-metrics-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 12px;
  width: 100%;
}

@media (min-width: 640px) {
  .profile-metrics-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
```

**Do NOT rewrite the card JSX** — the existing structure with `display-lg`, `headline-lg`, inline styles is already working. Only the grid container and the responsive breakpoint need to change.

**Files to modify:** `src/components/pages/ProfilePage.jsx` (container class + minWidth on cards) + `src/index.css` (grid rules).

---

### Corrected Implementation: Bug 1 — Adaptive Banner Mobile

**Gap 12 — Wrong root cause assumptions.** The `AdaptiveDietBanner.jsx` component:
- Does NOT use `position: fixed` or `position: sticky` (Causes A/B ruled out)
- Uses `position: relative` (implicit) as a normal flow element
- Uses `animation: cascadeIn` with `transform: translateY(8px)` → creates a transient stacking context, not a persistent one
- Does NOT have any `z-index` stacking issues (Cause E unlikely)
- Does NOT use `box-shadow` pulse animation — the pulse is on an inner `<span>` using the `@keyframes pulse` which is already `transform`-based (Cause from Step 6 is already handled)

**Most likely real causes (in order):**
1. **Stale `localStorage` dismiss** (Cause C) — the `exiting` state or dismiss logic may be firing from a prior test session
2. **`adaptiveSuggestion` is `null` on mobile** — the banner conditionally renders `if (!suggestion || exiting) return null` (line 21). If the adaptive TDEE engine isn't producing a suggestion on mobile (perhaps due to insufficient data or a timing issue with data loading), the banner won't render at all
3. **Container clipping** (Cause D) — a parent with `overflow: hidden` may clip the banner on narrow viewports

**Recommended approach:** Do NOT apply the speculative CSS fixes from the original plan. Instead:

1. On a mobile device, open the deployed app with Chrome DevTools remote debugging
2. Check `localStorage` for any `fittrack_coaching_dismissed_at_*` keys → clear them
3. Check if `adaptiveSuggestion` is truthy by adding a temporary `console.log` before the banner render guard
4. If the banner DOM node exists but is invisible, THEN apply the CSS fixes from the original plan (Steps 5–7)
5. If the banner DOM node does NOT exist, the bug is in the adaptive engine data flow, not CSS

**Files to modify:** TBD after device testing. Likely no CSS changes needed — most likely a data/timing issue.

---

### Updated Implementation Order

| # | Bug | Corrected Effort | Fix Summary |
|:-:|-----|:----------------:|-------------|
| 1 | **Bug 5 — Swap fallback** | 5 min | Change 2 fallback strings from `set.weight`/`set.reps` to `''` |
| 2 | **Bug 2 — PR pill** | 15 min | Remove `Flame` import, swap badge JSX, remove `isFirstPR`, swap CSS classes |
| 3 | **Bug 4 — Profile grid** | 15 min | Add responsive CSS class, keep existing card JSX |
| 4 | **Bug 3 — KCAL sync** | 5 min | Add `user?.customGoalKcal ||` to DashboardPage line 297 |
| 5 | **Bug 1 — Banner mobile** | 30–60 min | Device testing first, then targeted fix based on findings |

**Recommended sequence:** 1 → 2 → 3 → 4 → 5 (unchanged, but effort reduced from ~6–8 hrs to ~1 hr for bugs 1–4)