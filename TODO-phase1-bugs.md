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

---

### 1.12 Done Button Column Alignment — Workout Tracker

**Problem:** The done button (checkbox) has been moved to the left side of the exercise row, placing it under the "SET" column header instead of under the "DONE" column header where it belongs.

**Root cause:** The `.ex-r` grid (`src/index.css` line 168) defines 4 columns:
```css
.ex-r { grid-template-columns: 34px 1fr 1fr 80px; }
/* Column 1: SET | Column 2: REPS | Column 3: KG | Column 4: DONE */
```

The header row (`WorkoutPage.jsx` line 142) correctly renders `['SET', 'REPS', 'KG', 'DONE']` — "DONE" sits in column 4. However, item 1.5's checkbox implementation placed the done button in column 1 (the SET position), breaking the visual alignment.

**Current broken layout:**
```
[DONE✓] [REPS  ] [KG    ] [✕    ]
 SET      REPS     KG       DONE    ← headers don't match columns
```

**Expected layout:**
```
[ 1   ] [REPS  ] [KG    ] [✓  ✕]
 SET      REPS     KG       DONE    ← headers align correctly
```

**Fix in `WorkoutPage.jsx` (lines 144–151):**

The set number must stay in column 1, both inputs in columns 2–3, and the done button + remove button together in column 4. The done button wrapper `div` is already in column 4 — the checkbox just needs to render inside it, not be extracted out to column 1.

```jsx
// Current broken structure — done button pulled to column 1:
<div key={si} className="ex-r" ...>
  <button onClick={() => upd(ei, si, 'done', !s.done)} ...> ← this is in column 1 (SET)
  <div style={{ fontSize: 12, ... }}>{si + 1}</div>          ← this gets pushed to column 2
  <input type="number" value={s.reps} ... />                 ← column 3
  <input type="number" step=".5" value={s.weight} ... />    ← column 4
  ...
</div>

// Correct structure — set number in col 1, done button in col 4:
<div key={si} className="ex-r" ...>
  <div style={{ fontSize: 12, color: 'var(--t2)', fontWeight: 700 }}>{si + 1}</div>
  <input type="number" value={s.reps} onChange={e => upd(ei, si, 'reps', e.target.value)} style={{ padding: '7px 8px', fontSize: 13 }} />
  <input type="number" step=".5" value={s.weight} onChange={e => upd(ei, si, 'weight', e.target.value)} style={{ padding: '7px 8px', fontSize: 13 }} />
  <div style={{ display: 'flex', gap: 3 }}>
    <button onClick={() => upd(ei, si, 'done', !s.done)} style={{
      flex: 1,
      width: 32, height: 32, borderRadius: 6,
      background: s.done ? 'var(--o)' : 'transparent',
      border: `2px solid ${s.done ? 'var(--o)' : 'var(--bd2)'}`,
      color: s.done ? '#fff' : 'var(--t3)',
      cursor: 'pointer', fontSize: 14,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      transition: 'all .15s'
    }}>{s.done ? '✓' : ''}</button>
    {ex.sets.length > 1 && (
      <button onClick={() => rmS(ei, si)} style={{
        background: 'transparent', border: '1px solid var(--bd)',
        borderRadius: 8, color: 'var(--t3)', cursor: 'pointer',
        padding: '7px 5px', fontSize: 10
      }}>✕</button>
    )}
  </div>
</div>
```

**Files to modify:**
- `src/components/pages/WorkoutPage.jsx` — lines 144–152, restore set number to column 1 and done button to column 4

---

### 1.13 Vercel Client-Side Routing (404 on Reload) — ✅ Done

**Problem:** When reloading the application on a deployed Vercel URL (e.g., `/splits`), Vercel throws a "404: Not found" error. This happens because Vercel looks for a physical file at that path instead of falling back to the React app's `index.html` for client-side routing.

**Fix:**
Create a `vercel.json` configuration file in the project root with a rewrite rule that catches all routes and directs them to `index.html`.

**Content for `vercel.json`:**
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

**Files to modify/create:**
- `vercel.json` (New file)

---

### 1.14 Light Mode Toggle — Per-Page Quick Access

**Problem:** The theme toggle is currently buried in two hard-to-reach locations:
- Desktop: at the very bottom of the collapsible sidebar (easy to miss when sidebar is narrow)
- Mobile: inside the Profile page only — requires a full navigation away from the current page

Indian users frequently switch between light and dark based on ambient lighting (outdoors vs. gym vs. office). Requiring navigation to Profile to change the theme is a friction point.

**Design — Fixed Top-Right Button:**

Add a small, always-visible `Sun`/`Moon` icon button fixed to the top-right corner of the viewport. It should:
- Be `position: fixed`, `top: 12px`, `right: 16px`, `z-index: 500`
- Render a `Sun` icon (20px) when in dark mode (click → switch to light)
- Render a `Moon` icon (20px) when in light mode (click → switch to dark)
- Use a pill-shaped background: `background: var(--c2)`, `border: 1px solid var(--bd)`, `border-radius: 20px`, `padding: 6px 10px`
- Smooth transition: `transition: all .2s` with slight scale on hover
- On desktop (sidebar visible), offset right to not overlap with page content: already fine at `right: 16px` since the sidebar is on the left
- On mobile, sit comfortably above the bottom nav

**Why not in PageHeader:** `PageHeader` is used on every page but is not sticky — it scrolls away. A `position: fixed` approach ensures the toggle is always accessible without scrolling back up.

**Implementation:**

Add a single `ThemeToggle` component to `Layout.jsx` and render it as a sibling to `<Sidebar>` and `<BottomNav>` so it mounts once for the whole app, regardless of current page:

```jsx
// Layout.jsx — add ThemeToggle component
const ThemeToggle = () => {
  const { theme, toggleTheme } = useApp();
  return (
    <button
      onClick={toggleTheme}
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      style={{
        position: 'fixed', top: 12, right: 16, zIndex: 500,
        background: 'var(--c2)', border: '1px solid var(--bd)',
        borderRadius: 20, padding: '6px 10px',
        display: 'flex', alignItems: 'center', gap: 5,
        cursor: 'pointer', transition: 'all .2s',
        boxShadow: 'var(--shadow)',
        color: 'var(--t2)',
      }}
      onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.06)'}
      onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
    >
      {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
      <span style={{ fontSize: 11, fontWeight: 600 }}>
        {theme === 'dark' ? 'Light' : 'Dark'}
      </span>
    </button>
  );
};
```

Render it in the main `Layout` export (or `App.jsx`) at the top level so it overlays all pages.

**Relationship to existing toggles:**
- Keep the sidebar toggle (desktop) — power users who know it's there will keep using it
- Remove the redundant one from the Profile page sidebar column to avoid duplication — or keep it for discoverability; it's not harmful

**Files to modify:**
- `src/components/layout/Layout.jsx` — add `ThemeToggle` component and render it globally
- `src/index.css` — no CSS changes needed (uses existing variables)

**⚠️ Gaps identified (must resolve before implementing):**

1. **Wrong file for ThemeToggle placement:** Task says to add `ThemeToggle` to `Layout.jsx` and render as a sibling to `<Sidebar>` and `<BottomNav>`. But `Layout.jsx` only _exports_ `Sidebar` and `BottomNav` as separate named components — they are actually rendered as siblings inside `App.jsx` (`AppInner`, lines 25 and 42). The `ThemeToggle` must either be:
   - (a) Defined in `Layout.jsx` and **imported + rendered in `App.jsx`** alongside `<Sidebar>` and `<BottomNav>`, OR
   - (b) Defined directly inside `App.jsx`'s `AppInner` component.
   → **Recommended: option (a)** — define in `Layout.jsx`, render in `App.jsx`. Update the "Files to modify" list to include `App.jsx`.

2. **Ambiguous Profile page toggle decision:** The task says "Remove the redundant one from the Profile page sidebar column to avoid duplication — or keep it for discoverability; it's not harmful" but doesn't commit to either option. `ProfilePage.jsx` (line 69) has a full-width `btn-g` styled theme toggle. **Decision needed:** keep it (harmless redundancy) or remove it (cleaner UI). Recommendation: keep it — Profile is a natural place users look for settings.

3. **Missing mobile-specific positioning:** On mobile (≤768px), the sidebar is hidden (`.ds{display:none!important}`) and the bottom nav (`.bn`) appears at `position: fixed; bottom: 0; z-index: 100`. The task says the toggle should "sit comfortably above the bottom nav" on mobile but provides no mobile-specific CSS (e.g., adjusting `bottom` instead of `top` positioning, or smaller padding). The fixed `top: 12px, right: 16px` position should work on mobile too (it's at top-right, not near the bottom nav), so the "above bottom nav" note is misleading — clarify that it's fine at top-right on mobile.

4. **Icon size inconsistency (minor):** Sidebar toggle uses `Sun`/`Moon` at `size={16}`, ProfilePage uses `size={13}`, proposed ThemeToggle uses `size={14}`. Not a blocker, but worth being intentional about sizing — the `14px` icon + `11px` text in the proposal is a good size for a floating pill.

5. **No `@media` adjustments specified:** The task says no CSS changes needed, which is correct since it uses inline styles. However, on very small screens (<375px), the fixed button at `right: 16px` could feel cramped. Consider adding a note that this should be tested on small viewports.

---

### 1.15 Muscle Map — XP Text Readability

**Problem:** Inside each `MuscleCard` on the Muscle Map page, the XP figures (`"2,400 XP"` on the left, `"6,500 XP"` on the right) are rendered at `fontSize: 10` with `color: var(--t3)` — the faintest gray in the palette. On mobile screens and in dark mode, these labels are nearly illegible against the card background.

This is especially frustrating because XP is one of the most motivating numbers on the page — users want to read exactly how close they are to the next tier.

**Current code (`MuscleMapPage.jsx`, `MuscleCard` component, lines ~55–61):**
```jsx
<div style={{ fontSize: 10, color: 'var(--t3)' }}>
  {Math.round(xp).toLocaleString()} XP
</div>
<div style={{ fontSize: 10, color: 'var(--t3)' }}>
  {rank.progress < 1 ? `${Math.round(rank.nextXP).toLocaleString()} XP` : 'MAX'}
</div>
```

**Fix — three-part improvement:**

**Part A — Increase font size and contrast:**
```jsx
// Left label: current XP
<div style={{ fontSize: 11, fontWeight: 600, color: 'var(--t2)' }}>
  {Math.round(xp).toLocaleString()} XP
</div>

// Right label: next tier threshold or MAX
<div style={{ fontSize: 11, fontWeight: 600, color: 'var(--t2)' }}>
  {rank.progress < 1
    ? `→ ${Math.round(rank.nextXP).toLocaleString()} XP`
    : <span style={{ color: rank.color, fontWeight: 700 }}>MAX</span>}
</div>
```

**Part B — Add a contextual "X / Y XP" format below the bar:**
Instead of showing XP on the left and next-tier XP on the right (which requires mental math to understand progress), show them as a ratio in one place:
```jsx
// Replace the two separate labels with a single centered label:
<div style={{
  display: 'flex', justifyContent: 'space-between',
  fontSize: 11, fontWeight: 600, color: 'var(--t2)',
  marginTop: 4
}}>
  <span style={{ color: rank.color }}>
    {Math.round(xp).toLocaleString()} XP
  </span>
  <span>
    {rank.progress < 1
      ? `Next: ${Math.round(rank.nextXP).toLocaleString()} XP`
      : <span style={{ color: rank.color }}>✓ MAX TIER</span>}
  </span>
</div>
```

**Part C — Color the current XP in the rank's own color:**
The current XP number carries emotional weight (it's the user's achievement). Coloring it in the rank tier color (bronze, silver, gold, etc.) creates a strong visual association:
- Bronze tier user sees their XP number in bronze color
- Gold tier user sees it in gold
- This makes the number feel earned rather than just informational

**Also fix the overall rank XP on the main card** (`MuscleMapPage.jsx` line ~93):
```jsx
// Current: fontSize: 11, color: 'var(--t2)'
// Fix: fontSize: 13, fontWeight: 600, color: 'var(--t2)'
<div style={{ fontSize: 13, color: 'var(--t2)', fontWeight: 600 }}>
  {Math.round(overall.totalXP).toLocaleString()} Total XP
</div>
```

**Files to modify:**
- `src/components/pages/MuscleMapPage.jsx` — `MuscleCard` component XP label section (lines ~55–61), overall rank XP line (~93)

**⚠️ Gaps identified (must resolve before implementing):**

1. **Stale "Current code" reference:** The task quotes the current MuscleCard code as:
   ```jsx
   <div style={{ fontSize: 10, color: 'var(--t3)' }}>
     {Math.round(xp).toLocaleString()} XP
   </div>
   <div style={{ fontSize: 10, color: 'var(--t3)' }}>
     {rank.progress < 1 ? `${Math.round(rank.nextXP).toLocaleString()} XP` : 'MAX'}
   </div>
   ```
   But the **actual code** (lines 55–62) is:
   ```jsx
   <div style={{ fontSize: 10, color: 'var(--t3)' }}>
     {Math.round(xp).toLocaleString()} / {Math.round(rank.nextXP).toLocaleString()} XP
   </div>
   <div style={{ fontSize: 10, color: 'var(--t3)' }}>
     {rank.progress < 1 ? `→ ${RANK_TIERS[RANK_TIERS.findIndex(t => t.name === rank.name) + 1]?.name}` : 'MAX'}
   </div>
   ```
   The left label shows `xp / nextXP XP` (ratio format), and the right label shows the **next rank name** (e.g., "→ Silver"), not the next XP value. The fix must be written against the actual code.

2. **Part A vs Part B are contradictory:** Part A says keep two separate left/right labels with improved styling. Part B says "Replace the two separate labels with a single centered label" but then still uses `justifyContent: 'space-between'` (two-sided, not centered). These are mutually exclusive approaches. **Decision needed:** apply only Part B (which supersedes Part A) and ignore Part A entirely.

3. **Part C is already embedded in Part B:** Part C describes "Color the current XP in the rank's own color" as a separate step, but Part B's code snippet already includes `<span style={{ color: rank.color }}>` on the left XP value. Part C is therefore redundant as a separate section — it's already implemented in Part B's code. Remove Part C or mark it as "included in Part B".

4. **Overall rank XP line number is wrong:** The task references "line ~93" for the overall rank XP, but the actual code is at **line 117** of `MuscleMapPage.jsx`:
   ```jsx
   <div style={{ fontSize: 11, color: 'var(--t2)' }}>{Math.round(overall.totalXP).toLocaleString()} Total XP</div>
   ```
   The proposed fix (fontSize: 13, fontWeight: 600) is correct; only the line reference needs updating.

5. **Right-side label content change not acknowledged:** The current right label shows the next **rank name** (e.g., "→ Silver"), which is useful context. The proposed fix replaces this with `Next: X,XXX XP` — losing the rank name information. Consider combining both: `→ Silver (6,500 XP)` or keeping the rank name and just fixing the styling.

6. **MAX tier `rank.nextXP` safety:** When `rank.progress >= 1` (MAX tier), the code guards with `rank.progress < 1` before accessing `rank.nextXP`. This is correct, but worth verifying that `getRank()` returns a sensible `nextXP` value at max tier (or that it's never accessed). The `RANK_TIERS` array index lookup `[findIndex + 1]` could return `undefined` if at the last tier — the `?.name` optional chaining handles this, but the proposed code using `rank.nextXP` directly should also be safe.

---

### 1.16 Theme Toggle Header Integration

**Problem:** The `<ThemeToggle>` positioned `fixed` at the top right overlaps with page actions on the Dashboard and Splits pages.

**Fix:**
Keep the exact styling of the original Theme Toggle (the pill with the Sun/Moon icon and "Light"/"Dark" text), but remove its fixed positioning.
Move it directly into the `<PageHeader>` component next to any existing `action` buttons, so it flows naturally and doesn't overlap text.

**Files to modify:**
- `src/components/layout/Layout.jsx`: Remove `ThemeToggle` export.
- `src/App.jsx`: Remove `<ThemeToggle />` global render.
- `src/components/shared/SharedComponents.jsx`: Add the `ThemeToggle` component logic here without fixed positioning rules. Integrate it into `PageHeader` in a flex container next to the `action` prop.

---

## 1.17 Day / Night Mode Toggle Redesign

**Problem:** The current theme toggle button is a simple floating dark pill. The user wants a customized "Day Mode" / "Night Mode" pill toggle based on a new reference design, while keeping its current floating position.

**Design Specifics:**
The new toggle is a horizontal pill container functioning as a slider.
- **Day Mode (Light):**
  - Pill Background: Light gray (`#EFEFEF` or similar)
  - Text: "DAY MODE" on the left side (black, bold text).
  - Knob: A white circular knob positioned on the right side.
  - Icon: A black Sun icon centered inside the white knob.
- **Night Mode (Dark):**
  - Pill Background: Solid black (`#000000` or similar dark color).
  - Text: "NIGHT MODE" on the right side (white, bold text).
  - Knob: A white circular knob positioned on the left side.
  - Icon: A black Moon/Stars icon centered inside the white knob.

**Animation & Behavior:**
Clicking the pill slides the white knob from one side to the other, cross-fading the icons and the background container color, while the text swaps between "DAY MODE" and "NIGHT MODE".

**Implementation Plan:**
1. Keep the exact position and fixed styling of the current global `<ThemeToggle>` component in `App.jsx`.
2. Rewrite the internal JSX of the `<ThemeToggle>` component in `src/App.jsx` (or extract it to `SharedComponents.jsx` if preferred).
3. Use a flex container with relative positioning for the track. Set fixed dimensions (e.g., ~130px width, 44px height).
4. Implement the sliding knob using `transform: translateX(...)` based on the `theme` state.
5. Use Lucide icons (`Sun` and `Moon`) inside the knob, dynamically swapping them out based on state.

---

## 1.18 Day / Night Toggle Resizing (10% scale-down)

**Problem:** The Day/Night theme toggle pill implemented in 1.17 is currently a bit too bulky inside the `PageHeader`.
**Fix:** Shrink the entire toggle component (track, knob, and text) by exactly 10%.

**Implementation Plan:**
Update the hardcoded dimensions inside `ThemeTogglePill` in `src/components/shared/SharedComponents.jsx`:
- Track width: 120px → 108px
- Track height: 40px → 36px
- Inner padding: 4px → 3px (this proportionally resizes the knob to 30px)
- Font size: 10px → 9px.

---

## 1.19 Day / Night Toggle Resizing (Additional 10% scale-down)

**Problem:** The Day/Night theme toggle pill is still slightly larger than preferred.
**Fix:** Shrink the entire toggle component down by another 10% from its current size.

**Implementation Plan:**
Update the hardcoded dimensions inside `ThemeTogglePill` in `src/components/shared/SharedComponents.jsx`:
- Track width: 108px → 96px
- Track height: 36px → 32px
- Inner padding: 3px → 2px or 3px (keeping it balanced)
- Font size: 9px → 8px.

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
| 12    | 1.12 Done Button Column Alignment | ✅ Done | 🟢 Small | High |
| 13    | 1.13 Vercel Client-Side Routing Fix | ✅ Done | 🟢 Small | 🔴 Critical |
| 14    | 1.14 Light Mode Toggle Quick Access | ✅ Done | 🟢 Small | High |
| 15    | 1.15 Muscle Map XP Text Readability | ✅ Done | 🟢 Small | High |
| 16    | 1.16 Theme Toggle Header Integration | ✅ Done | 🟢 Small | High |
| 17    | 1.17 Day / Night Toggle Redesign | ✅ Done | 🟡 Medium | High |
| 18    | 1.18 Day / Night Toggle Resizing | ✅ Done | 🟢 Small | Medium |
| 19    | 1.19 Day / Night Toggle Resizing II | ✅ Done | 🟢 Small | Medium |