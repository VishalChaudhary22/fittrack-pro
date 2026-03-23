# FitTrack Pro — Phase 1: Bug Fixes & UI Polish

<!-- Scope: Bug fixes and UI polish. All items have exact file + line references. -->

> **Last updated:** 2026-03-24 · High Priority — fix these first.

---

## 🔧 Phase 1 — Bug Fixes & UI Polish (High Priority)

### 1.1 Theme / Text Readability (Global) — ✅ Done

**Problem:** Card text readability is inconsistent. Some labels (e.g. "BMI Status" heading, BMI boxes) are too faded and too small. The design language is not uniform across all cards.

**Scope of change:**
- **Card heading text** (labels like "Current Weight", "BMI Status"): should be slightly larger (`fontSize: 12` → `13–14`) and use a less-faded gray (`var(--t2)` instead of `var(--t3)`).
- **Primary value text** on every card: should always be **white** (`var(--tx)` or `#fff`), not faded gray.
- **Card icon**: always **orange** (`var(--o)`) — this is already mostly correct.
- **Highlighting elements** (progress bars, status boxes, tags, badges): should all use the orange accent (`var(--o)` / `var(--og)` / `var(--o2)`).
- **BMI boxes** (Under, Normal, Over, Obese) in `DashboardPage.jsx`: increase font size from `9px` → `10–11px`, use slightly brighter color for inactive labels.

**Files to modify:**
- `src/components/pages/DashboardPage.jsx` — StatCard usage, BMI card section
- `src/components/shared/SharedComponents.jsx` — `StatCard` component (if text styles are defined there)
- `src/index.css` — potentially add/update CSS variables for consistent card text hierarchy

---

### 1.2 Mobile Navigation — Move "Splits" to Main Nav — ✅ Done

**Problem:** On mobile, the "Splits" page is buried in the "More" menu (`NAV_MOBILE_MORE` in `constants.js`). It should be the 2nd item after Home.

**Fix in `src/data/constants.js`:**
- Move `{ id: 'splits', label: 'Splits', Icon: Dumbbell, path: '/splits' }` from `NAV_MOBILE_MORE` to `NAV_MOBILE_MAIN` at index 1 (after Home/Dashboard).
- Consider removing one item from `NAV_MOBILE_MAIN` to keep the bottom nav uncluttered (e.g., move "Progress" to "More"), or use 5-tab layout.

---

### 1.3 Workout Page — Blank Reps/Kg by Default — ✅ Done

**Problem:** When starting a workout, the reps and kg counters are pre-filled from the previous session or from the `repsRange`. They should start **blank** (empty string) by default, with **3 sets** unless a custom set count was previously configured.

**Current behavior** (`WorkoutPage.jsx`, line 77–79):
```js
sets: Array.from({ length: ex.sets }, (_, i) => {
  const ps = pe?.sets?.[i];
  return { reps: ps?.reps || ex.repsRange?.split('-')[0] || 8, weight: ps?.weight || 0, done: false };
}),
```

**Fix:**
- Change default `reps` to `''` (empty string) and `weight` to `''` (empty string) so inputs appear blank.
- Lock default set count to `3` unless a user preference or previous log specifies otherwise:
  ```js
  const setCount = pe ? pe.sets.length : 3;
  ```
- Update `upd()` function to handle empty string → 0 conversion only when marking sets as done.
- Show `repsRange` as a **placeholder** on the input fields rather than as a pre-filled value.

---

### 1.4 Rest Timer Icon — Make It Larger & More Readable — ✅ Done

**Problem:** The rest timer icon + dropdown in the workout session header is too small (`Timer` icon at size `14`, select at `fontSize: 11`).

**Fix in `WorkoutPage.jsx` (line 126–129):**
- Increase `Timer` icon size from `14` → `20`.
- Increase select font size from `11` → `13`.
- Add a subtle orange-tinted background behind the timer area for better visibility.
- Consider adding a label "Rest:" before the dropdown.

---

### 1.5 Done Button → Checkbox Redesign — ✅ Done

**Problem:** The "done" button per set is a circular `○` / `✓` toggle. It should be a **checkbox** beside the set and rep counter area. Default: gray empty checkbox. On completion: orange tick mark inside a filled checkbox.

**Current** (`WorkoutPage.jsx`, line 148–150): Round button with `'○'` / `'✓'` text.

**Redesign:**
- Replace the round button with a proper square checkbox (16–18px, border-radius: 4px).
- Default state: gray border (`var(--bd)`), no fill.
- Completed state: orange fill (`var(--o)`) with a white `✓` check icon inside.
- Position: to the left of or inline with the set number, not at the end.
- Ensure it still triggers the rest timer when toggled.

---

### 1.6 Weight Change Arrow — Fix Logic — ✅ Done

**Problem:** On the Home page, the weight change arrow under "Current Weight" card does not show the correct delta. It currently computes an average of recent week vs. older entries.

**Current logic** (`DashboardPage.jsx`, lines 35–43):
```js
const trend = useMemo(() => {
  // Compares average of last 7 days vs. average of all older entries
});
```

**Fix:**
- Replace with simple previous-log comparison:
  ```js
  const trend = useMemo(() => {
    if (allUserLogs.length < 2) return undefined;
    const latest = allUserLogs[allUserLogs.length - 1].weight;
    const previous = allUserLogs[allUserLogs.length - 2].weight;
    return +(latest - previous).toFixed(1);
  }, [allUserLogs]);
  ```
- This ensures the arrow and value reflect the change **from the last logged weight**, which is what the user expects.

---

### 1.7 Muscle Map Progress Bar — Verify XP Bar Accuracy

**Problem:** Muscle map page shows progress bars per body part that appear under-filled relative to the XP amount.

**Analysis:** Reviewed `getRank()` in `muscleData.js` (line 59–70) — the progress calculation on line 68 is:
```js
const progress = next ? (xp - rank.minXP) / (next.minXP - rank.minXP) : 1;
```
This is **within-tier progress**, not overall progress toward the next tier. E.g., 567 XP in Bronze II (range: 500–1000) means progress = `(567 - 500) / (1000 - 500)` = 13.4%, which looks like ~1/7th filled.

**The math is technically correct for within-tier progress**, but the user expects it to represent overall progress toward the next tier.

**Options:**
1. **Show absolute progress** within the tier bar — label should read "567 / 1000 XP" and bar should fill to 56.7% (i.e., use `xp / nextTierMinXP` instead of delta-based calculation).
2. Keep the current within-tier calculation but add clearer labeling: "67 / 500 XP to Bronze III".

**Recommended fix (Option 1):** Change `getRank()` in `muscleData.js` (line 68) to compute absolute progress:
```js
// muscleData.js L68 — change progress formula
const progress = next ? xp / next.minXP : 1;
```

**Also update `MuscleCard` label in `MuscleMapPage.jsx` (lines 56–61):**
Currently shows `{xp} XP` on the left and `{rank.nextXP} XP` on the right, but doesn't show "X / Y XP" format. Update to be clearer:
```jsx
// MuscleMapPage.jsx L57 — left label
{Math.round(xp).toLocaleString()} / {Math.round(rank.nextXP).toLocaleString()} XP
// MuscleMapPage.jsx L60 — right label: remove or change to tier name
{rank.progress < 1 ? `→ ${RANK_TIERS[RANK_TIERS.indexOf(rank) + 1]?.name}` : 'MAX'}
```

**Files to modify:**
- `src/data/muscleData.js` — line 68 (progress formula in `getRank()`)
- `src/components/pages/MuscleMapPage.jsx` — lines 56–61 (MuscleCard XP labels)

---

### 1.8 Hardcoded Colors → CSS Variables (Global)

**Problem:** Multiple files use hardcoded hex values for semantic states (success, danger, warning) instead of CSS variables. This means those colors never adapt to light/dark theme and can't be updated from one place.

**Hardcoded colors found across the codebase:**

| File | Line | Hardcoded Value | Semantic Meaning |
|------|------|----------------|-----------------|
| `SharedComponents.jsx` | 26 | `#FF6B6B`, `#51CF66` | Weight trend up (bad) / down (good) |
| `SharedComponents.jsx` | 123 | `#FF3B30` | Danger confirm button background |
| `Layout.jsx` | 18 | `#0C0C0E` | Sidebar background |
| `WeightLogPage.jsx` | 73 | `#FF6B6B`, `#6BCB77` | Weight delta positive / negative |
| `ProgressPage.jsx` | 69 | `#6BCB77`, `#FF6B6B` | Volume change positive / negative |
| `DietPage.jsx` | 73 | `#FF6B6B` | Calorie progress bar — over-target color |
| `DietPage.jsx` | 76 | `#FF6B6B` | Calorie percentage text — over-target color |
| `DashboardPage.jsx` | 167 (chart defs) | `#E8540D` | Chart gradient — acceptable, Recharts can't consume CSS vars |

> **Note:** The original TODO missed `DietPage.jsx` lines 73 and 76 which use `#FF6B6B` for the calorie over-target state. These were found during codebase audit.

**Fix — add semantic color variables to `index.css`:**
```css
/* Add to both :root and [data-theme="light"] blocks */
--success: #51CF66;   /* green — positive trends, weight loss progress */
--danger:  #FF6B6B;   /* red — negative trends, weight gain, alerts */
--error:   #FF3B30;   /* red — destructive actions, error states */
```

**Then replace all hardcoded instances:**
```js
// SharedComponents.jsx L26 — trend color on StatCard
color: trend > 0 ? 'var(--danger)' : 'var(--success)'

// WeightLogPage.jsx L73 — weight delta
color: parseFloat(diff) > 0 ? 'var(--danger)' : 'var(--success)'

// ProgressPage.jsx L69 — volume change
color: weeklySummary.volChange > 0 ? 'var(--success)' : 'var(--danger)'

// DietPage.jsx L73 — calorie progress bar over-target
background: todayTotal > goalKcal ? 'var(--danger)' : 'var(--og)'

// DietPage.jsx L76 — calorie percentage text over-target
color: todayTotal > goalKcal ? 'var(--danger)' : 'var(--o)'
```

**Note:** `#E8540D` inside Recharts `<stop>`, `stroke`, and `fill` props must stay as hex — Recharts SVG attributes cannot read CSS custom properties.

**Files to modify:**
- `src/index.css` — add `--success`, `--danger`, `--error` to both theme blocks
- `src/components/shared/SharedComponents.jsx` — lines 26, 123
- `src/components/pages/WeightLogPage.jsx` — line 73
- `src/components/pages/ProgressPage.jsx` — line 69
- `src/components/pages/DietPage.jsx` — lines 73, 76 *(newly identified)*

---

### 1.9 Sidebar Background — Light Mode Fix

**Problem:** The sidebar has `background: '#0C0C0E'` hardcoded in `Layout.jsx` (line 18). In light mode, it stays pitch black — the only element on screen that doesn't respond to the theme toggle.

**Full hardcoded values on Layout.jsx line 18:**
- `background: '#0C0C0E'` — dark-only background
- `borderRight: '1px solid rgba(255,255,255,.04)'` — hardcoded rgba (only looks right in dark mode)
- `boxShadow: '4px 0 24px rgba(0,0,0,.3)'` — hardcoded rgba shadow

**Fix in `Layout.jsx` (line 18):**
```js
// Before
background: '#0C0C0E', borderRight: '1px solid rgba(255,255,255,.04)', ... boxShadow: '4px 0 24px rgba(0,0,0,.3)'

// After
background: 'var(--c1)', borderRight: '1px solid var(--bd)', ... boxShadow: 'var(--shadow)'
```

**Files to modify:**
- `src/components/layout/Layout.jsx` — line 18

---

### 1.10 Orange Overload — Reduce & Rebalance

**Problem:** Orange (`--o`, `--o2`, `--og`) is used on almost every element across every page. The user specifically flagged this. The orange accent should be reserved for **primary actions, active states, and key data points** — not applied uniformly to everything.

**Specific instances of over-use found by audit:**

**A — Day type tags are all orange (SplitsPage + WorkoutPage):**
Both pages use `className="tag"` (orange) for day type labels like "push", "pull", "legs", "upper", "lower", "arms", "home", "yoga", "full". These are informational/categorical — they should use `className="tag-d"` (grey) instead. Orange `.tag` should be reserved for status indicators like "Active" and "On Fire!".

```jsx
// Before — SplitsPage.jsx L82
<span className="tag" style={{ fontSize: 9 }}>{day.type}</span>

// After
<span className="tag-d" style={{ fontSize: 9 }}>{day.type}</span>

// Also in WorkoutPage.jsx L184 (day selection grid)
<span className="tag" style={{ fontSize: 9 }}>{day.type}</span>
// → <span className="tag-d" style={{ fontSize: 9 }}>{day.type}</span>
```

> **Line correction:** WorkoutPage day type tag is at **L184** (not L173 as originally noted). L173 is inside the active session view.

**A2 — Muscle group label tag in WorkoutPage active session (missed previously):**
In the active workout session, the muscle group label on each exercise also uses orange `className="tag"` (WorkoutPage L138). This is informational — change to `"tag-d"`.

```jsx
// WorkoutPage.jsx L138
// Before: <span className="tag" style={{ fontSize: 9 }}>{ex.muscle}</span>
// After: <span className="tag-d" style={{ fontSize: 9 }}>{ex.muscle}</span>
```

**B — All split names and icons are orange in SplitsPage:**
Every split card has an orange icon container + orange split name. On a page with 6 splits, this creates 6 rows of back-to-back orange. The split name should use `var(--tx)` (white/primary text) and only the active split's name should use `var(--o)`.

```jsx
// SplitsPage.jsx L66 — split name
// Before: color: 'var(--o)'
// After: color: user.activeSplitId === split.id ? 'var(--o)' : 'var(--tx)'
```

**C — Exercise muscle labels are orange in SplitsPage:**
Every exercise row shows its muscle group label in orange (`color: 'var(--o)'` — SplitsPage L101). With 6+ exercises per day, this is too much. Change to `var(--t2)`.

```jsx
// SplitsPage.jsx L101
// Before: color: 'var(--o)'
// After: color: 'var(--t2)'
```

**D — Exercise set/rep counts are orange in WorkoutPage day cards:**
In the workout day selection grid, each exercise row shows set counts in orange (`color: 'var(--o)'` — WorkoutPage L186). Change to `var(--t2)`.

```jsx
// WorkoutPage.jsx L186
// Before: <span style={{ color: 'var(--o)' }}>{ex.sets}×{ex.repsRange}</span>
// After: <span style={{ color: 'var(--t2)' }}>{ex.sets}×{ex.repsRange}</span>
```

> **Line correction:** This is at **L186** (not L175 as originally noted).

**E — `.stripe` left border is used too broadly:**
The orange left stripe (`.stripe` class) appears on: Streak card (Dashboard L106), Goal card (Dashboard L124), Diet stats bar (DietPage L51), Calorie Tracker card (DietPage L62), Diet footer (DietPage L177), Progress "This Week" card (ProgressPage L63), Progress "This Month" card (ProgressPage L72). It should be reserved only for the 1–2 most important cards per page — use it on Streak and Goal on Dashboard; remove it from Progress weekly/monthly summary cards and DietPage stats bars.

```jsx
// ProgressPage.jsx L63, L72 — remove .stripe from both weekly/monthly cards
// DietPage.jsx L51 — remove .stripe from the body stats bar
// DietPage.jsx L62 — remove .stripe from the calorie tracker card
// DietPage.jsx L177 — remove .stripe from the footer card
```

**F — Muscle group mini-tags in Dashboard are orange:**
The weekly muscle tags (`"chest"`, `"back"` etc.) in the muscle activity widget use `background: 'var(--o2)', color: 'var(--o)'`. Since these are informational labels nested inside an already-orange-accented card, tone them down:
```jsx
// DashboardPage.jsx L241
// Before: background: 'var(--o2)', color: 'var(--o)'
// After: background: 'var(--c3)', color: 'var(--t2)'
```

> **Line correction:** Muscle mini-tags are at **L241** (not L244 as originally noted).

**Files to modify:**
- `src/components/pages/SplitsPage.jsx` — lines 66, 82, 101
- `src/components/pages/WorkoutPage.jsx` — lines 138 *(new)*, 184, 186
- `src/components/pages/ProgressPage.jsx` — lines 63, 72 (remove `.stripe`)
- `src/components/pages/DietPage.jsx` — lines 51, 62, 177 (remove `.stripe`)
- `src/components/pages/DashboardPage.jsx` — line 241 (muscle tags)

---

### 1.11 ConfirmDialog — Add Proper Danger Button Class

**Problem:** `ConfirmDialog` in `SharedComponents.jsx` (line 121–123) applies `.btn-p` (orange CTA class) and then overrides its background inline with a hardcoded red:
```jsx
<button className={danger ? 'btn-p' : 'btn-p'} style={{
  flex: 1, padding: '12px',
  background: danger ? '#FF3B30' : 'var(--og)',
}} onClick={onConfirm}>{confirmLabel}</button>
```
This is fragile — the class name logic is also wrong (both branches return `'btn-p'`).

**Fix — add a `.btn-danger` class to `index.css`:**
```css
.btn-danger {
  background: var(--error);
  color: #fff;
  border: none;
  border-radius: 14px;
  padding: 13px 26px;
  font-family: 'DM Sans', sans-serif;
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
  transition: all .25s cubic-bezier(.4,0,.2,1);
  box-shadow: 0 4px 16px rgba(255,59,48,.25);
}
.btn-danger:hover { opacity: .92; transform: translateY(-2px); box-shadow: 0 6px 24px rgba(255,59,48,.35); }
.btn-danger:active { transform: translateY(0); }
```

**Then update `SharedComponents.jsx`:**
```jsx
// Before
<button className={danger ? 'btn-p' : 'btn-p'} style={{ flex: 1, padding: '12px', background: danger ? '#FF3B30' : 'var(--og)' }} onClick={onConfirm}>

// After
<button className={danger ? 'btn-danger' : 'btn-p'} style={{ flex: 1, padding: '12px' }} onClick={onConfirm}>
```

**Files to modify:**
- `src/index.css` — add `.btn-danger` class (depends on `--error` variable from item 1.8)
- `src/components/shared/SharedComponents.jsx` — lines 121–124

---

## 🗓️ Phase 1 Implementation Order

| Order | Item | Status | Effort | Impact |
|:-----:|------|:------:|:------:|:------:|
| 1     | 1.2 Mobile Nav Fix | ✅ Done | 🟢 Small | High |
| 2     | 1.6 Weight Change Fix | ✅ Done | 🟢 Small | High |
| 3     | 1.3 Blank Reps/Kg | ✅ Done | 🟢 Small | High |
| 4     | 1.4 Timer Icon Size | ✅ Done | 🟢 Small | Medium |
| 5     | 1.5 Done → Checkbox | ✅ Done | 🟡 Medium | Medium |
| 6     | 1.1 Theme Readability | ✅ Done | 🟡 Medium | High |
| 7     | 1.7 XP Bar Accuracy | ✅ Done | 🟡 Medium | High |
| 8     | 1.8 Hardcoded Colors → CSS Variables | ✅ Done | 🟢 Small | High |
| 9     | 1.9 Sidebar Light Mode Fix | ✅ Done | 🟢 Small | High |
| 10    | 1.10 Orange Overload Reduction | ✅ Done | 🟡 Medium | High |
| 11    | 1.11 ConfirmDialog Danger Button | ✅ Done | 🟢 Small | Medium |
