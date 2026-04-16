# FitTrack Pro — TODO: Workout Page Improvements
> **Created:** 2026-04-16
> **Files affected:** `src/data/splits.js`, `src/components/pages/WorkoutPage.jsx`
> **Effort:** 🟡 Medium
> **Priority:** High — directly affects daily UX for every workout session

---

## 📋 Summary of Changes

| # | Change | Files |
|---|--------|-------|
| 1 | Reduce default sets from 4 → 3 across all splits | `splits.js` |
| 2 | Exercise swap UI on active session | `WorkoutPage.jsx` |
| 3 | Upper Day A — add isolation finisher pairs (2×2 sets each) | `splits.js` |
| 4 | Upper Day B — add isolation finisher pairs (2×2 sets each) | `splits.js` |

---

## ⚠️ Pre-conditions — Read Before Implementing

- **DO NOT touch** any other page, context, or component outside the two files listed above
- **DO NOT change** exercise `primaryMuscle`, `secondaryMuscles`, or `muscle` fields
- **DO NOT change** any logic in `AppContext.jsx`, `muscleData.js`, or `WorkoutHistoryPage.jsx`
- The `splits` field `sets` is just a default — users can always add more sets during a session via the existing `+ Add Set` button. Reducing the default does NOT remove that ability.
- When the agent reads `splits.js`, it will find the split data structure. The Upper Body split days are called `"Upper Day A"` and `"Upper Day B"` (verify exact string by searching the file)

---

## TASK 1 — Reduce All Default Set Counts from 4 → 3

**File:** `src/data/splits.js`

### What to do

Do a global search across all exercises in all splits. Any exercise where `sets: 4` → change to `sets: 3`.

**Do NOT change:**
- `sets: 1` → keep as 1
- `sets: 2` → keep as 2
- `sets: 3` → keep as 3
- `sets: 5` → keep as 5 (powerlifting programs may have 5-set compounds)

**Only change:** `sets: 4` → `sets: 3`

**Grep command to verify before and after:**
```bash
grep -n "sets: 4" src/data/splits.js
```

This should return 0 results after the change is applied.

---

## TASK 2 — Exercise Swap UI During Active Workout Session

**File:** `src/components/pages/WorkoutPage.jsx`

### Overview

When a user is in an active workout session (the `session !== null` render branch), each exercise block has a header showing the exercise name. Currently this is just display text. We need to make it tappable so the user can swap the exercise for that session.

This is **session-only** — it does NOT permanently modify the split. It modifies `session.exs` in-memory (React state), which is already how the session works.

### Substitution Map

Define this constant **at the top of `WorkoutPage.jsx`** (outside the component, near the other constants):

```js
// Exercise substitution options — shown when user taps the swap icon on an exercise
// Key = canonical exercise name as it appears in splits.js
// Value = array of alternatives the user can swap to
const EXERCISE_ALTERNATIVES = {
  // ── UPPER PUSH ──────────────────────────────────────────────────────────────
  'Smith Machine Incline Press': [
    'Incline Barbell Bench Press',
    'Incline Dumbbell Press',
  ],
  'Flat Dumbbell Press': [
    'Flat Barbell Bench Press',
    'Machine Chest Press',
    'Pec Dec Flyes',
  ],

  // ── UPPER PULL ──────────────────────────────────────────────────────────────
  'Wide Grip Lat Pulldown': [],                     // no alternatives
  'Seated Horizontal Row': [
    'Dumbbell Row',
    'Barbell Row',
  ],

  // ── BICEPS ──────────────────────────────────────────────────────────────────
  'Biceps Cable Curls': [
    'Dumbbell Curls',
    'EZ Bar Curls',
  ],
  'Hammer Curls': [
    'Rope Hammer Curls',
  ],
  'Incline Bench Bicep Curls': [],                  // no alternatives (strict isolation)
  'Preacher Curls': [],                             // no alternatives

  // ── TRICEPS ─────────────────────────────────────────────────────────────────
  'Single Hand Tricep Pushdowns': [
    'Tricep Rope Pushdowns',
    'Straight Bar Pushdowns',
  ],
  'Single Hand Overhead Tricep Extension': [
    'Overhead Tricep Extension (Cable)',
    'Overhead Tricep Extension (Dumbbell)',
  ],
  'Single Hand Overhead Cable Tricep Extension': [
    'Overhead Tricep Extension (Cable)',
    'Overhead Tricep Extension (Dumbbell)',
  ],

  // ── LEGS ────────────────────────────────────────────────────────────────────
  'Squats': [
    'Smith Machine Squats',
    'Leg Press',
    'Pendulum Squats',
    'Hack Squats',
  ],
  'Leg Extension': [],                              // no alternatives
  'Seated Leg Curls': [
    'Romanian Deadlift (RDL)',
  ],
  'Leg Abductor Machine': [],                       // no alternatives
  'Standing Calf Raises': [],                       // no alternatives
};
```

### Sub-component: ExerciseSwapModal

Add this **inside `WorkoutPage.jsx`**, defined before the main `WorkoutPage` component:

```jsx
// Modal for swapping an exercise during a session
// Shown when user taps the swap icon on an exercise header
function ExerciseSwapModal({ exerciseName, onSwap, onClose }) {
  const alternatives = EXERCISE_ALTERNATIVES[exerciseName] || [];

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 500,
        background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'flex-end',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          background: 'var(--surface-container-low)',
          borderRadius: '24px 24px 0 0',
          padding: '20px 20px 32px',
          maxHeight: '60vh', overflowY: 'auto',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Drag handle */}
        <div style={{
          width: 40, height: 4,
          background: 'var(--surface-container-highest)',
          borderRadius: 2, margin: '0 auto 20px',
        }} />

        {/* Header */}
        <div style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: 11, fontWeight: 700,
          textTransform: 'uppercase', letterSpacing: '0.12em',
          color: 'var(--on-surface-dim)', marginBottom: 6,
        }}>
          Swap Exercise
        </div>
        <div style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: 16, fontWeight: 700,
          color: 'var(--primary)', marginBottom: 20,
        }}>
          {exerciseName}
        </div>

        {/* Keep current */}
        <button
          onClick={onClose}
          style={{
            width: '100%', padding: '14px 16px',
            borderRadius: 12, border: 'none', cursor: 'pointer',
            background: 'var(--surface-container-highest)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            fontFamily: "'Be Vietnam Pro', sans-serif",
            fontSize: 14, fontWeight: 600,
            color: 'var(--on-surface)', marginBottom: 10,
          }}
        >
          <span>Keep current</span>
          <span style={{ fontSize: 10, color: 'var(--on-surface-dim)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Current</span>
        </button>

        {/* Alternatives */}
        {alternatives.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '16px',
            fontSize: 13, color: 'var(--on-surface-dim)',
          }}>
            No swap options for this exercise
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {alternatives.map(alt => (
              <button
                key={alt}
                onClick={() => { onSwap(alt); onClose(); }}
                style={{
                  width: '100%', padding: '14px 16px',
                  borderRadius: 12, border: 'none', cursor: 'pointer',
                  background: 'var(--surface-container)',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  fontFamily: "'Be Vietnam Pro', sans-serif",
                  fontSize: 14, fontWeight: 600,
                  color: 'var(--on-surface)',
                  transition: 'background 0.15s',
                }}
                onMouseOver={e => e.currentTarget.style.background = 'var(--surface-container-high)'}
                onMouseOut={e => e.currentTarget.style.background = 'var(--surface-container)'}
              >
                <span>{alt}</span>
                <span style={{
                  fontSize: 10, color: 'var(--primary)',
                  fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em',
                }}>
                  Swap →
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
```

### State changes inside `WorkoutPage`

Add two new state variables to the `WorkoutPage` component:

```js
const [swapTarget, setSwapTarget] = useState(null); // { exerciseIndex: number, name: string } | null
```

### Handler for performing the swap

Add this function inside `WorkoutPage` (alongside the other session handlers like `addS`, `rmS`, `upd`):

```js
// Swap an exercise name in the current session (session-only, does not modify the split)
const swapExercise = (exerciseIndex, newName) => {
  setSession(prev => ({
    ...prev,
    exs: prev.exs.map((ex, i) =>
      i === exerciseIndex ? { ...ex, name: newName } : ex
    ),
  }));
};
```

### Where to add the swap icon in the JSX

In the active session render, find the exercise header block. It shows the exercise name (`.headline-md` or similar) and the muscle subline. To the **right** of the exercise name, add a swap icon button:

```jsx
{/* In the exercise header row — add this button alongside the existing info icon button */}
{(EXERCISE_ALTERNATIVES[ex.name] !== undefined) && (
  <button
    onClick={() => setSwapTarget({ exerciseIndex: ei, name: ex.name })}
    aria-label={`Swap ${ex.name}`}
    style={{
      background: 'none', border: 'none', cursor: 'pointer',
      padding: '6px', borderRadius: 8,
      color: 'var(--on-surface-dim)',
      display: 'flex', alignItems: 'center',
      transition: 'color 0.15s',
    }}
    onMouseOver={e => e.currentTarget.style.color = 'var(--primary)'}
    onMouseOut={e => e.currentTarget.style.color = 'var(--on-surface-dim)'}
  >
    <RefreshCw size={15} />
  </button>
)}
```

**Import `RefreshCw`** from `lucide-react` — add it to the existing Lucide import line at the top of `WorkoutPage.jsx`.

### Render the modal at the bottom of the session JSX

At the very bottom of the session render branch (just before or after the existing `RestTimer` portal), add:

```jsx
{/* Exercise swap modal */}
{swapTarget && (
  <ExerciseSwapModal
    exerciseName={swapTarget.name}
    onSwap={(newName) => swapExercise(swapTarget.exerciseIndex, newName)}
    onClose={() => setSwapTarget(null)}
  />
)}
```

### Visual indicator when exercise has been swapped

When the exercise name no longer matches the original split definition, optionally show a subtle badge next to the name. This is optional polish — implement only if the core swap works cleanly first.

---

## TASK 3 — Upper Day A: Isolation Finisher Updates

**File:** `src/data/splits.js`

Find the day in the Upper Body split (or Upper/Lower split) named `"Upper Day A"` (verify exact string).

### 3a — Set Biceps Cable Curls to 2 sets

Find the exercise object where `name: 'Biceps Cable Curls'` (exact string, verify in file) and change `sets: 3` → `sets: 2`.

After Task 1 runs, all 4-set exercises become 3-set. This exercise should then be further reduced to 2.

### 3b — Set Single Hand Tricep Pushdowns to 2 sets

Find the exercise object where `name: 'Single Hand Tricep Pushdowns'` (exact string, verify in file) and change `sets: 3` → `sets: 2`.

### 3c — Add Hammer Curls (2 sets) after Biceps Cable Curls

After the Biceps Cable Curls entry in Upper Day A, insert:

```js
{
  id: 'uA_hammer',        // unique ID — use any unique string that doesn't conflict
  name: 'Hammer Curls',
  muscle: 'Biceps',
  primaryMuscle: 'biceps',
  secondaryMuscles: ['forearms'],
  sets: 2,
  repsRange: '10-12',
  type: 'isolation',
},
```

> ⚠️ Verify the `id` naming convention from the file. If existing IDs use a different pattern (e.g. `'uA_bc'` for Upper A Bicep Cable), follow the same convention. The key constraint is uniqueness.

### 3d — Add Single Hand Overhead Tricep Extension (2 sets) after Single Hand Tricep Pushdowns

After the Single Hand Tricep Pushdowns entry in Upper Day A, insert:

```js
{
  id: 'uA_ohtext',       // unique ID
  name: 'Single Hand Overhead Tricep Extension',
  muscle: 'Triceps',
  primaryMuscle: 'triceps',
  secondaryMuscles: [],
  sets: 2,
  repsRange: '10-12',
  type: 'isolation',
},
```

### Final Upper Day A exercise order (isolation section)

After all changes, the biceps/triceps isolation section of Upper Day A should look like:

```
... [compound movements] ...
Biceps Cable Curls          — 2 sets, 10-12 reps
Hammer Curls                — 2 sets, 10-12 reps    ← NEW
Single Hand Tricep Pushdowns — 2 sets, 10-12 reps
Single Hand Overhead Tricep Extension — 2 sets, 10-12 reps  ← NEW
```

---

## TASK 4 — Upper Day B: Isolation Finisher Updates

**File:** `src/data/splits.js`

Find the day named `"Upper Day B"` (exact string, verify in file).

### 4a — Set Incline Bench Bicep Curls to 2 sets

Find the exercise object where `name: 'Incline Bench Bicep Curls'` (exact string, verify) and change `sets: 3` → `sets: 2`.

### 4b — Set Single Hand Overhead Cable Tricep Extension to 2 sets

Find the exercise object where `name: 'Single Hand Overhead Cable Tricep Extension'` (exact string, verify) and change `sets: 3` → `sets: 2`.

### 4c — Add Preacher Curls (2 sets) after Incline Bench Bicep Curls

After the Incline Bench Bicep Curls entry in Upper Day B, insert:

```js
{
  id: 'uB_preacher',      // unique ID
  name: 'Preacher Curls',
  muscle: 'Biceps',
  primaryMuscle: 'biceps',
  secondaryMuscles: [],
  sets: 2,
  repsRange: '10-12',
  type: 'isolation',
},
```

### 4d — Add Single Hand Tricep Pushdowns (2 sets) after Single Hand Overhead Cable Tricep Extension

After the Single Hand Overhead Cable Tricep Extension entry in Upper Day B, insert:

```js
{
  id: 'uB_pushdown',      // unique ID
  name: 'Single Hand Tricep Pushdowns',
  muscle: 'Triceps',
  primaryMuscle: 'triceps',
  secondaryMuscles: [],
  sets: 2,
  repsRange: '10-12',
  type: 'isolation',
},
```

### Final Upper Day B exercise order (isolation section)

After all changes, the biceps/triceps isolation section of Upper Day B should look like:

```
... [compound movements] ...
Incline Bench Bicep Curls                 — 2 sets, 10-12 reps
Preacher Curls                            — 2 sets, 10-12 reps    ← NEW
Single Hand Overhead Cable Tricep Extension — 2 sets, 10-12 reps
Single Hand Tricep Pushdowns              — 2 sets, 10-12 reps    ← NEW
```

---

## ✅ Implementation Checklist

### splits.js
- [ ] `grep -n "sets: 4" src/data/splits.js` — note all line numbers
- [ ] Change all `sets: 4` → `sets: 3`
- [ ] Verify: Upper Day A — Biceps Cable Curls `sets: 2` ✓
- [ ] Verify: Upper Day A — Single Hand Tricep Pushdowns `sets: 2` ✓
- [ ] Verify: Hammer Curls entry added after Biceps Cable Curls in Upper Day A ✓
- [ ] Verify: Single Hand Overhead Tricep Extension entry added after Pushdowns in Upper Day A ✓
- [ ] Verify: Upper Day B — Incline Bench Bicep Curls `sets: 2` ✓
- [ ] Verify: Upper Day B — Single Hand Overhead Cable Tricep Extension `sets: 2` ✓
- [ ] Verify: Preacher Curls entry added after Incline Bench Bicep Curls in Upper Day B ✓
- [ ] Verify: Single Hand Tricep Pushdowns entry added after Overhead Extension in Upper Day B ✓
- [ ] No duplicate exercise IDs (grep for each new ID to confirm uniqueness)

### WorkoutPage.jsx
- [ ] `EXERCISE_ALTERNATIVES` constant added at module level (outside component)
- [ ] `ExerciseSwapModal` sub-component added before `WorkoutPage` component
- [ ] `RefreshCw` added to Lucide import line
- [ ] `swapTarget` state added inside `WorkoutPage`
- [ ] `swapExercise(exerciseIndex, newName)` handler added inside `WorkoutPage`
- [ ] Swap icon button (`<RefreshCw size={15} />`) added to exercise header row
  - [ ] Only shown when `EXERCISE_ALTERNATIVES[ex.name] !== undefined`
- [ ] `ExerciseSwapModal` rendered conditionally at bottom of session JSX
- [ ] No existing functionality broken (rest timer, set logging, FAB, finish/discard all still work)

### QA
- [ ] Start a workout session — all exercises show 3 sets by default (not 4)
- [ ] Upper Day A: count exercises — should see Hammer Curls and Single Hand Overhead Tricep Extension as new additions with 2 sets
- [ ] Upper Day B: count exercises — should see Preacher Curls and Single Hand Tricep Pushdowns as new additions with 2 sets
- [ ] Tap the swap icon on "Squats" — modal appears with 4 alternatives (Smith Machine Squats, Leg Press, Pendulum Squats, Hack Squats)
- [ ] Tap "Leg Extension" swap icon — modal appears with "No swap options" message
- [ ] Select a swap — exercise name updates in the session but does not change the split (verify by exiting and re-entering the workout; original name is restored)
- [ ] Close modal without swapping — exercise name unchanged
- [ ] `+ Add Set` still works on all exercises (including the new 2-set exercises)
- [ ] Completing a session still generates correct XP and workout log
- [ ] No ESLint errors introduced

---

## 🗒️ Implementation Notes

### On exercise name matching in EXERCISE_ALTERNATIVES
The keys in `EXERCISE_ALTERNATIVES` must **exactly match** the `name` field strings in `splits.js`. Before implementing, run:
```bash
grep -n '"name":' src/data/splits.js | head -60
```
Cross-check every key in the map against actual exercise names in the file and fix any mismatches.

### On the swapped exercise and XP calculation
When a user swaps e.g. "Squats" → "Leg Press", the session exercise object now has `name: 'Leg Press'` but still retains the original `primaryMuscle: 'quads'` from the split definition. The XP calculation in `calcAllMuscleXP` uses the 3-priority fallback chain — `ex.primaryMuscle` is Priority 2, so XP still flows correctly to quads regardless of the name swap. No changes to `muscleData.js` are needed.

### On new exercise IDs in splits.js
If the agent finds that `splits.js` uses a pattern like UUID generation or a specific naming scheme, follow it. If IDs are plain strings, follow the existing style. The ID just needs to be unique within the file.

### On `repsRange` and `type` fields for new exercises
Check the existing isolation exercises in Upper Day A and B for the exact field names and value formats. The values above (`'10-12'`, `'isolation'`) are based on typical patterns — verify against actual file content.

### Why 2 sets for the isolation finishers?
This follows the "minimal effective volume" principle for isolation work at the end of a session — the compound movements have already stimulated the target muscle. Two quality sets of curls/extensions at the end is the Indian gym-bro standard (think Hevy, Strong app defaults) and prevents the workout from getting too long. Users can always add a third set.

---

## 🔴 GAP ANALYSIS — Issues Found by Cross-Referencing Source Code

> **Audit date:** 2026-04-16
> **Files audited:** `src/data/splits.js` (124 lines), `src/components/pages/WorkoutPage.jsx` (936 lines)
>
> The following gaps would cause **implementation failures** if not corrected before coding begins.

---

### GAP 1 — ❌ Day Names Are Wrong

**TODO says:** `"Upper Day A"` and `"Upper Day B"`
**Actual `splits.js`:** `"Upper A"` and `"Upper B"`

```js
// Line 60:  { id: 'ul4-ua', name: 'Upper A', ... }
// Line 63:  { id: 'ul4-ub', name: 'Upper B', ... }
// Line 86:  { id: 'ula-ua', name: 'Upper A', ... }
// Line 89:  { id: 'ula-ub', name: 'Upper B', ... }
```

**Impact:** An agent searching for `"Upper Day A"` will find nothing. Tasks 3 and 4 will fail silently.

**Fix:** Replace all references to `"Upper Day A"` → `"Upper A"` and `"Upper Day B"` → `"Upper B"` throughout this document. Note: `mkUpperA()` and `mkUpperB()` are factory functions used by **three** splits (`ul4`, `ula`, `ul6`), so changes to those functions propagate to all of them.

---

### GAP 2 — ❌ Exercise Name Typo: `Wide Grip Lat Pulldown` → `Wide Grip Lat Pulldowns` (Plural)

**TODO EXERCISE_ALTERNATIVES key:** `'Wide Grip Lat Pulldown'` (singular)
**Actual `splits.js` line 23:** `name: 'Wide Grip Lat Pulldowns'` (plural, with an **s**)

**Impact:** The swap icon will never appear for this exercise because the key lookup `EXERCISE_ALTERNATIVES['Wide Grip Lat Pulldowns']` returns `undefined`.

**Fix:** Change the key in EXERCISE_ALTERNATIVES to `'Wide Grip Lat Pulldowns'`.

---

### GAP 3 — ❌ Exercise IDs Use `gId()`, Not String Literals

**TODO suggests:** `id: 'uA_hammer'`, `id: 'uA_ohtext'`, `id: 'uB_preacher'`, `id: 'uB_pushdown'`
**Actual `splits.js`:** Every single exercise uses `id: gId()` which generates a UUID via `import { gId } from '../utils/helpers'`.

```js
// Line 1: import { gId } from '../utils/helpers';
// Line 5: { id: gId(), name: 'Squats', ... }
```

**Impact:** Using string IDs breaks the consistent UUID-based pattern. While it won't crash, it introduces inconsistency and may cause issues with any code that assumes UUID-format IDs.

**Fix:** All new exercises must use `id: gId()` instead of string IDs. Update Tasks 3c, 3d, 4c, 4d accordingly.

---

### GAP 4 — ❌ `type: 'isolation'` Field Does Not Exist

**TODO new exercises include:** `type: 'isolation'`
**Actual `splits.js`:** No exercise object in the entire file has a `type` field. The field simply doesn't exist in the schema.

```js
// Typical exercise object (line 26):
{ id: gId(), name: 'Biceps Cable Curls', sets: 3, repsRange: '12-15',
  muscle: 'Biceps', primaryMuscle: 'biceps', secondaryMuscles: ['forearms'], notes: '' }
```

**Impact:** Adding a `type: 'isolation'` field is harmless but inconsistent. It won't be used by any existing code.

**Fix:** Remove `type: 'isolation'` from all new exercise objects. Add `notes: ''` to match the existing schema.

---

### GAP 5 — ⚠️ `repsRange` Mismatch: TODO Says `'10-12'`, Existing Isolation Uses `'12-15'`

**TODO new exercises use:** `repsRange: '10-12'`
**Actual existing isolation exercises in Upper A/B:**

```js
// Line 26: Biceps Cable Curls → repsRange: '12-15'
// Line 27: Single Hand Tricep Pushdowns → repsRange: '12-15'
// Line 37: Incline Bench Bicep Curls → repsRange: '12-15'
// Line 38: Single Hand Overhead Cable Tricep Extension → repsRange: '12-15'
```

**Impact:** Visual inconsistency — existing isolation exercises show `12-15` but new ones alongside them show `10-12`. Not a functional bug but looks sloppy.

**Fix:** Change new exercise `repsRange` from `'10-12'` to `'12-15'` to match existing isolation exercises in Upper A/B.

---

### GAP 6 — ❌ Existing `ex.sv` (Swap Variant) Mechanism Conflicts with Proposed `swapExercise`

**TODO's `swapExercise` handler:** Modifies `ex.name` directly:
```js
i === exerciseIndex ? { ...ex, name: newName } : ex
```

**Actual `WorkoutPage.jsx` already has a swap mechanism using `ex.sv`:**
- Line 556: `sv: prevEx?.name || (ex.variants ? ex.variants[0] : null)` — sets `sv` on session init
- Line 580: `const setV = (ei, v) => ...` — handler to change variant
- Line 601: `name: ex.sv || ex.name` — workout log uses `sv` as the display name
- Line 714: `{ex.sv || ex.name}` — UI renders `sv` over `name`
- Line 729: `e.name === (ex.sv || ex.name)` — prev session lookup uses `sv`

**Impact:** If `swapExercise` changes `ex.name`, but the UI displays `ex.sv || ex.name`, and the workout log saves `ex.sv || ex.name`, the swap will work visually BUT:
1. The swap icon condition `EXERCISE_ALTERNATIVES[ex.name]` will use the NEW name after swap, which may not be in the map — so the swap icon could disappear or show wrong alternatives.
2. The `ex.sv` field will still hold the old value (from variant selection), creating confusion.

**Fix:** The `swapExercise` handler should set `ex.sv` instead of `ex.name`:
```js
const swapExercise = (exerciseIndex, newName) => {
  setSession(prev => ({
    ...prev,
    exs: prev.exs.map((ex, i) =>
      i === exerciseIndex ? { ...ex, sv: newName } : ex
    ),
  }));
};
```
And the swap icon condition should check against the ORIGINAL `ex.name` (not `ex.sv`), which is already correct in the TODO since it uses `EXERCISE_ALTERNATIVES[ex.name]`.

---

### GAP 7 — ⚠️ `Seated Leg Curls` Key Won't Match — Actual Name Is `Leg Curls`

**TODO EXERCISE_ALTERNATIVES key:** `'Seated Leg Curls'`
**Actual `splits.js` line 7:** `name: 'Leg Curls'` (with `variants: ['Seated Leg Curls', 'Lying Leg Curls']`)

**Impact:** The swap icon will never appear for Leg Curls because the base exercise name is `'Leg Curls'`, not `'Seated Leg Curls'`. `Seated Leg Curls` is just a variant, not the primary name.

**Fix:** Change the key to `'Leg Curls'` and update alternatives:
```js
'Leg Curls': [
  'Romanian Deadlift (RDL)',
],
```
Note: The existing `variants` dropdown (Seated/Lying) already handles the sub-variant selection via `ex.sv`. The EXERCISE_ALTERNATIVES map should only reference base exercise names.

---

### GAP 8 — ⚠️ Lucide Icon: `RefreshCw` Not Imported, `RefreshCcw` Already Is

**TODO says:** Import `RefreshCw` from lucide-react
**Actual `WorkoutPage.jsx` line 3:** Already imports `RefreshCcw` (counter-clockwise variant)

```js
import { Trophy, Timer, X, Check, Play, Pause, Square, RefreshCcw } from 'lucide-react';
```

**Impact:** `RefreshCw` is a valid Lucide icon but is not yet imported. Adding it is fine, but using the already-imported `RefreshCcw` avoids adding another import.

**Fix:** Either use `RefreshCcw` (already imported) or explicitly add `RefreshCw` to the import. Both work visually. Recommend using `RefreshCcw` since it's already available.

---

### GAP 9 — ⚠️ Missing PPL/Arms/Home Exercises in EXERCISE_ALTERNATIVES

The `EXERCISE_ALTERNATIVES` map only covers Upper/Lower exercises. Several other exercises exist across splits that have no swap coverage:

**PPL split-specific exercises not in map:**
- `Overhead Press`, `Dumbbell Shoulder Press` (Push days)
- `Deadlift` (Pull Day A)
- `Horizontal Machine Row`, `Seated Cable Row (Bar)`, `Wide Grip T-Bar Rows` (Pull days)
- `Bicep Curls`, `Preacher Curls` (Pull Day B — already in file but not in map as base exercises)
- `Tricep Pushdowns`, `Single Hand Rope Pushdowns`, `Overhead Tricep Extension`, `Single Hand Overhead Tricep Extensions` (Push days)

**Arms Day (ula split):**
- `Shoulder Press`
- `Single Hand Overhead Tricep Extensions` (note: plural "Extensions" vs singular in Upper A)

**Home/Yoga exercises:** Not applicable for swap (bodyweight-specific).

**Impact:** Users on PPL or UL+Arms splits won't see swap icons for most exercises. The feature is UL-only in practice.

**Fix:** Either:
1. Expand `EXERCISE_ALTERNATIVES` to cover PPL exercises (recommended, Phase 2)
2. Add a comment noting this is UL-focused for now and PPL coverage is a future TODO

---

### GAP 10 — ⚠️ Arms Day Name Inconsistency: `'Extensions'` vs `'Extension'` (Plural)

**In `splits.js` line 91 (Arms Day):** `name: 'Single Hand Overhead Tricep Extensions'` (plural **s**)
**In `splits.js` line 38 (Upper B):** `name: 'Single Hand Overhead Cable Tricep Extension'` (singular, no **s**)

These are treated as different exercises by the name-matching system. The `EXERCISE_ALTERNATIVES` map has a key for `'Single Hand Overhead Tricep Extension'` (singular, no "Cable") but not for `'Single Hand Overhead Tricep Extensions'` (plural, as in Arms Day).

**Impact:** Arms Day users won't see swap options for this exercise.

**Fix:** If intentional (different exercises), add a separate key for the plural form. If unintentional, fix the name in `splits.js` to be consistent.

---

### GAP 11 — ⚠️ `mkUpperA`/`mkUpperB` Are Shared Factory Functions

The TODO treats Upper A/B modifications as if they only affect one split. In reality:

```js
// Line 60: ul4 split → exercises: mkUpperA()
// Line 86: ula split → exercises: mkUpperA()
// Line 99: ul6 split → exercises: mkUpperA()
// (same for mkUpperB)
```

**Impact:** Changes to `mkUpperA()` and `mkUpperB()` will propagate to **all three splits** (UL4, UL+Arms, UL6). This is likely the desired behavior but should be explicitly documented.

**Fix:** Add a note in Tasks 3/4 confirming that the changes intentionally affect all splits that use these factory functions.

---

### GAP 12 — Missing: `grep` Pattern in Pre-conditions Uses Wrong Field Format

**TODO pre-conditions (line 26):** Says to verify names by searching for field strings
**TODO notes (line 492):** `grep -n '"name":' src/data/splits.js | head -60`

**Actual `splits.js`:** Uses unquoted key syntax `name:`, not `"name":`.

```js
// Actual format (line 5):
{ id: gId(), name: 'Squats', sets: 4, ... }
// NOT: { "id": gId(), "name": "Squats", ... }
```

**Impact:** The grep command returns nothing — agent has no way to verify names programmatically.

**Fix:** Change grep to: `grep -n "name: '" src/data/splits.js | head -60`

---

## 📝 Corrected Exercise Objects (Ready to Copy-Paste)

After applying all gap fixes, here are the corrected new exercise objects:

### Task 3c — Hammer Curls (Upper A)
```js
{ id: gId(), name: 'Hammer Curls', muscle: 'Biceps', primaryMuscle: 'biceps', secondaryMuscles: ['forearms'], sets: 2, repsRange: '12-15', notes: '' },
```

### Task 3d — Single Hand Overhead Tricep Extension (Upper A)
```js
{ id: gId(), name: 'Single Hand Overhead Tricep Extension', muscle: 'Triceps', primaryMuscle: 'triceps', secondaryMuscles: [], sets: 2, repsRange: '12-15', notes: '' },
```

### Task 4c — Preacher Curls (Upper B)
```js
{ id: gId(), name: 'Preacher Curls', muscle: 'Biceps', primaryMuscle: 'biceps', secondaryMuscles: [], sets: 2, repsRange: '12-15', notes: '' },
```

### Task 4d — Single Hand Tricep Pushdowns (Upper B)
```js
{ id: gId(), name: 'Single Hand Tricep Pushdowns', muscle: 'Triceps', primaryMuscle: 'triceps', secondaryMuscles: [], sets: 2, repsRange: '12-15', notes: '' },
```

---

## 📝 Corrected EXERCISE_ALTERNATIVES Map

```js
const EXERCISE_ALTERNATIVES = {
  // ── UPPER PUSH ──────────────────────────────────────────────────────
  'Smith Machine Incline Press': ['Incline Barbell Bench Press', 'Incline Dumbbell Press'],
  'Flat Dumbbell Press': ['Flat Barbell Bench Press', 'Machine Chest Press', 'Pec Dec Flyes'],
  'Incline Dumbbell Press': ['Smith Machine Incline Press', 'Incline Barbell Bench Press'],
  'Chest Machine Press': ['Flat Barbell Bench Press', 'Flat Dumbbell Press'],

  // ── UPPER PULL ──────────────────────────────────────────────────────
  'Wide Grip Lat Pulldowns': [],                        // FIXED: plural
  'Close Grip Lat Pulldowns': ['Wide Grip Lat Pulldowns'],
  'Seated Horizontal Row': ['Dumbbell Row', 'Barbell Row'],
  'T-Bar Rows': ['Seated Cable Row', 'Dumbbell Row'],

  // ── SHOULDERS ───────────────────────────────────────────────────────
  'Lateral Raises': [],                                  // no alternatives
  'Rear Delt Flyes': ['Face Pulls'],

  // ── BICEPS ──────────────────────────────────────────────────────────
  'Biceps Cable Curls': ['Dumbbell Curls', 'EZ Bar Curls'],
  'Hammer Curls': ['Rope Hammer Curls'],
  'Incline Bench Bicep Curls': [],
  'Preacher Curls': [],

  // ── TRICEPS ─────────────────────────────────────────────────────────
  'Single Hand Tricep Pushdowns': ['Tricep Rope Pushdowns', 'Straight Bar Pushdowns'],
  'Single Hand Overhead Tricep Extension': ['Overhead Tricep Extension (Cable)', 'Overhead Tricep Extension (Dumbbell)'],
  'Single Hand Overhead Cable Tricep Extension': ['Overhead Tricep Extension (Cable)', 'Overhead Tricep Extension (Dumbbell)'],

  // ── LEGS ────────────────────────────────────────────────────────────
  'Squats': ['Smith Machine Squats', 'Leg Press', 'Pendulum Squats', 'Hack Squats'],
  'Leg Press': ['Squats', 'Hack Squats', 'Pendulum Squats'],
  'Leg Extension': [],
  'Leg Curls': ['Romanian Deadlift (RDL)'],             // FIXED: was 'Seated Leg Curls'
  'Romanian Deadlift': ['Leg Curls'],
  'Leg Abductor Machine': [],
  'Leg Adductor Machine': [],
  'Standing Calf Raises': [],
};
```

---

## 📝 Corrected `swapExercise` Handler

```js
// Uses ex.sv (existing swap variant field) instead of overwriting ex.name
const swapExercise = (exerciseIndex, newName) => {
  setSession(prev => ({
    ...prev,
    exs: prev.exs.map((ex, i) =>
      i === exerciseIndex ? { ...ex, sv: newName } : ex
    ),
  }));
};
```

---

### GAP 13 — ❌ WorkoutHistoryPage: Muscle Tags Break for Swapped Exercises

**File:** `src/components/pages/WorkoutHistoryPage.jsx`

**The problem:** When a user swaps "Squats" → "Hack Squats" (or any name NOT in splits.js), the history page's `getSessionMuscles()` function fails to show muscle tags.

**Root cause (lines 54-76):** The `exMuscleMap` is built from split definitions only:
```js
// Line 54-62: builds lookup from splits
const exMuscleMap = useMemo(() => {
  const map = {};
  splits.forEach(split => split.days?.forEach(day =>
    day.exercises?.forEach(ex => {
      if (ex.name && ex.muscle) map[ex.name] = ex.muscle;
    })
  ));
  return map;
}, [splits]);

// Line 68: looks up by log exercise name — fails for swapped names NOT in splits
const muscleField = exMuscleMap[ex.name];
```

If the user swapped to "Hack Squats", `exMuscleMap['Hack Squats']` returns `undefined` → no muscle tag.

**But the data is already there!** The workout log (saved by `WorkoutPage.jsx` line 600-606) already stores `primaryMuscle` and `secondaryMuscles` on each exercise entry. The history page just ignores them.

**Fix — Update `getSessionMuscles` to use log data first, split lookup as fallback:**
```js
const getSessionMuscles = (exercises) => {
  const muscles = new Set();
  exercises?.forEach(ex => {
    // Priority 1: use primaryMuscle stored directly in the log (works for swapped exercises)
    if (ex.primaryMuscle) {
      muscles.add(ex.primaryMuscle);
      (ex.secondaryMuscles || []).forEach(m => muscles.add(m));
    } else {
      // Priority 2: fallback to split-based name lookup
      const muscleField = exMuscleMap[ex.name];
      if (muscleField) {
        getMusclesForExercise(muscleField).forEach(m => muscles.add(m));
      }
    }
  });
  return [...muscles].slice(0, 3).map(key =>
    MUSCLE_GROUPS.find(mg => mg.key === key)?.label || key
  );
};
```

**Impact:** Without this fix, any workout where the user used the swap feature and chose an exercise not defined in splits.js will show NO muscle tags in history — making it look like a data corruption bug.

---

### GAP 14 — ❌ ProgressPage: Focus Groups & Exercise Dropdown Break for Swapped Names

**File:** `src/components/pages/ProgressPage.jsx`

**The problem:** Two related issues when the user has swapped exercises:

**14a — Focus Groups lookup (line 301):**
```js
const exDef = split?.days.flatMap(d => d.exercises).find(e => e.name === se);
```
If the user logged "Hack Squats" (a swapped name), this lookup finds nothing → "Focus Groups" section shows "General" instead of "quads" / "glutes".

**14b — Exercise dropdown (line 24):**
```js
const exN = useMemo(() => {
  const n = new Set();
  ul.filter(l => !sd || l.dayId === sd).forEach(l => l.exercises?.forEach(e => n.add(e.name)));
  if (sd) days.find(d => d.id === sd)?.exercises.forEach(e => n.add(e.name));
  return [...n];
}, [sd, ul, days]);
```
This correctly pulls exercise names from logs, so "Hack Squats" WILL appear in the dropdown ✅. But the Focus Groups lookup then fails ❌.

**Fix — Use log data for Focus Groups when split lookup fails:**
```js
{(() => {
  // Try split definition first
  let exDef = split?.days.flatMap(d => d.exercises).find(e => e.name === se);
  
  // Fallback: scan workout logs for primaryMuscle data
  if (!exDef) {
    const logEx = ul.flatMap(l => l.exercises || []).find(e => e.name === se);
    if (logEx) exDef = logEx; // log entries also have primaryMuscle/secondaryMuscles
  }
  
  const pM = exDef?.primaryMuscle || exDef?.muscle || null;
  const sM = exDef?.secondaryMuscles || [];
  // ... rest unchanged
})()}
```

---

### GAP 15 — ⚠️ ExerciseSwapModal Must Follow Taste-Design System

**Reference:** `.agents/skills/taste-design/SKILL.md` and `.agents/skills/stitch-design/SKILL.md`

The `ExerciseSwapModal` code in Task 2 uses hardcoded inline styles with design tokens, which is acceptable. However, several taste-design anti-patterns need correction:

**Issues in the current modal code:**
1. **Font stacks:** Uses `'Space Grotesk'` and `'Be Vietnam Pro'` directly — this is fine as they match the existing FitTrack design system, but the modal should NOT introduce any new fonts
2. **Touch targets:** All buttons must be minimum `44px` tap height — ✅ already satisfied (`padding: '14px 16px'`)
3. **Motion:** The modal slides up from the bottom (`alignItems: 'flex-end'`) but has no entrance animation. Taste-design requires spring physics for interactive elements
4. **Backdrop blur:** Uses `blur(8px)` — acceptable but should match the existing `var(--glass-blur-sm)` token
5. **No emojis:** ✅ correct — no emojis used
6. **No neon/glow:** ✅ correct — no outer glows

**Fix — Updated modal styles that conform to the design system:**

```jsx
// Overlay — use existing glass token
background: 'var(--glass-bg-heavy, rgba(0,0,0,0.7))',
backdropFilter: 'var(--glass-blur-sm)',

// Sheet — add entrance animation
animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',

// Add this keyframe to the component or global CSS:
// @keyframes slideUp {
//   from { transform: translateY(100%); opacity: 0.8; }
//   to   { transform: translateY(0); opacity: 1; }
// }
```

---

## 📝 Corrected ExerciseSwapModal (Design-System Compliant)

```jsx
function ExerciseSwapModal({ exerciseName, onSwap, onClose }) {
  const alternatives = EXERCISE_ALTERNATIVES[exerciseName] || [];

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 500,
        background: 'rgba(0,0,0,0.7)',
        backdropFilter: 'var(--glass-blur-sm, blur(8px))',
        display: 'flex', alignItems: 'flex-end',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          background: 'var(--surface-container-low)',
          borderRadius: '24px 24px 0 0',
          padding: '20px 20px 32px',
          maxHeight: '60vh', overflowY: 'auto',
          animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Drag handle */}
        <div style={{
          width: 40, height: 4,
          background: 'var(--surface-container-highest)',
          borderRadius: 2, margin: '0 auto 20px',
        }} />

        {/* Header */}
        <div style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: 10, fontWeight: 700,
          textTransform: 'uppercase', letterSpacing: '0.15em',
          color: 'var(--on-surface-dim)', marginBottom: 6,
        }}>
          Swap Exercise
        </div>
        <div style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: 16, fontWeight: 700,
          color: 'var(--primary)', marginBottom: 20,
          letterSpacing: '-0.02em',
        }}>
          {exerciseName}
        </div>

        {/* Keep current */}
        <button
          onClick={onClose}
          style={{
            width: '100%', padding: '14px 16px', minHeight: 44,
            borderRadius: 12, border: 'none', cursor: 'pointer',
            background: 'var(--surface-container-highest)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            fontFamily: "'Be Vietnam Pro', sans-serif",
            fontSize: 14, fontWeight: 600,
            color: 'var(--on-surface)', marginBottom: 10,
            transition: 'transform 0.1s',
          }}
          onMouseDown={e => e.currentTarget.style.transform = 'scale(0.98)'}
          onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          <span>Keep current</span>
          <span style={{
            fontSize: 9, color: 'var(--on-surface-dim)',
            textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 700,
          }}>Current</span>
        </button>

        {/* Alternatives */}
        {alternatives.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '20px 16px',
            fontSize: 13, color: 'var(--on-surface-dim)',
            fontFamily: "'Be Vietnam Pro', sans-serif",
          }}>
            No swap options available for this exercise
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {alternatives.map(alt => (
              <button
                key={alt}
                onClick={() => { onSwap(alt); onClose(); }}
                style={{
                  width: '100%', padding: '14px 16px', minHeight: 44,
                  borderRadius: 12, border: 'none', cursor: 'pointer',
                  background: 'var(--surface-container)',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  fontFamily: "'Be Vietnam Pro', sans-serif",
                  fontSize: 14, fontWeight: 600,
                  color: 'var(--on-surface)',
                  transition: 'background 0.15s, transform 0.1s',
                }}
                onMouseOver={e => e.currentTarget.style.background = 'var(--surface-container-high)'}
                onMouseOut={e => e.currentTarget.style.background = 'var(--surface-container)'}
                onMouseDown={e => e.currentTarget.style.transform = 'scale(0.98)'}
                onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
              >
                <span>{alt}</span>
                <span style={{
                  fontSize: 9, color: 'var(--primary)',
                  fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em',
                }}>
                  Swap
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
```

> **Note:** Add the `slideUp` keyframe to your global CSS or inline it via a `<style>` tag injected once:
> ```css
> @keyframes slideUp {
>   from { transform: translateY(100%); opacity: 0.8; }
>   to   { transform: translateY(0); opacity: 1; }
> }
> ```