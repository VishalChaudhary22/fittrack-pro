# FitTrack Pro — TODO: Workout Edit + Scroll Restoration

> **Created:** 2026-04-18
> **Effort:**
>   - Feature 1 (Workout Edit) 🔴 Large — core data mutation across Supabase + local state
>   - Feature 2 (Scroll Restoration) 🟢 Small — pure UX, no data changes
> **Files primarily affected:**
>   - Feature 1: `WorkoutHistoryPage.jsx`, `AppContext.jsx`, new `EditWorkoutModal.jsx`, new `LogPastWorkoutModal.jsx`
>   - Feature 2: new `useScrollRestoration.js`, all page-level components, `DietPage.jsx`

---

## 🔍 Indian Market Context

Indian gym-goers are power users of workout logging. Key research findings:

- **"Missed log" is the #1 complaint** in r/IndiaFitness and on HealthifyMe/Fittr reviews — users often train, forget to log immediately, and want to backfill the next day.
- **Gym bro culture in India** means users frequently compare sessions with friends; being unable to edit an incorrect log (entered wrong weight in excitement) is a social embarrassment and an analytics accuracy issue.
- **HealthifyMe, Hevy, and Strong App** all support session editing — not having it makes FitTrack Pro feel less polished by comparison.
- **Scroll restoration is native-app behaviour** Indian users expect (Swiggy, Zomato, Instagram all do it). On the Diet page specifically, if a user has filled in Lunch and scrolls there, losing that position on tab switch is frustrating and common.
- **Offline gym sessions** — many Tier 2/3 gyms have patchy wifi; users start tracking on mobile data but finish the session in airplane mode, then try to edit/correct later. Edits must work on local state first, then sync.

---

## ⚠️ GAPS IDENTIFIED (Codebase Audit — 2026-04-18)

The following gaps were found by cross-referencing this TODO against the live codebase. **Implementing agents MUST read these before starting.**

### GAP 1 — Dashboard route is `/` not `/dashboard`
The route table in `App.jsx` maps `DashboardPage` to `path="/"`, not `"/dashboard"`. The scroll restoration key must be `'/'` not `'/dashboard'`.

### GAP 2 — Saved workout log shape differs from what's documented
The `doFinish()` function in `WorkoutPage.jsx` (line ~882) does NOT save `startTime` to the log object. The actual saved log contains **only**: `id, userId, splitId, dayId, dayName, date, notes, durationMinutes, exercises`. The `startTime` field shown in the Background section (line 42) is misleading — it exists only in the ephemeral `session` state during an active workout, never in persisted logs.

### GAP 3 — Saved sets never contain `done` field
The `doFinish()` function filters out un-done sets AND strips the `done` field: `sets: ex.sets.filter(s => s.done).map(s => ({ reps: parseFloat(s.reps) || 0, weight: parseFloat(s.weight) || 0 }))`. This means saved sets are `{ reps: number, weight: number }` — **no `done` boolean**. The edit modal should display all saved sets as implicitly "done" (full opacity). The guidance in TASK 1A-1 about `done: false` sets rendering at 0.7 opacity is misleading — none will exist in saved logs. However, if users ADD new sets during editing, those new blank sets should use reduced opacity until filled in.

### GAP 4 — DietPage has no `expandedSlot` state (TASK 2-3 is inaccurate)
The DietPage does NOT use an accordion for meal slots. Meal slot sections are always visible; clicking one calls `handleOpenSearch(slot.id)` which opens a full-screen search modal via `showSearch` + `searchMealSlot` state. There is no `expandedSlot` to persist. TASK 2-3 should persist `activeTab` ('tracker' | 'guide' | 'analysis') only — the meal slot accordion pattern described there does not exist. Remove the `dietSlotCache.expandedSlot` approach.

### GAP 5 — WorkoutHistoryPage has a `strength/cardio` tab that needs persistence
TASK 2-5 covers `search` and `filterSplit` but misses `activeTab` (`'strength' | 'cardio'`) state at line 30. This tab controls whether the user sees the strength log list or the cardio activity panel. Without caching it, navigation away resets the user back to the strength tab.

### GAP 6 — MuscleMapPage tab caching can cause stale leaderboard data
`MuscleMapPage.jsx` has `useEffect`s that fire when `activeTab` transitions TO `'leaderboard'` (lines 122-125, 128-157). If `activeTab` is module-cached as `'leaderboard'`, and the user navigates back, `activeTab` starts as `'leaderboard'` from init, so the `useEffect`'s `[activeTab]` dependency doesn't change — `loadLeaderboard()` won't fire and data may be stale. **Fix:** Always call `loadLeaderboard()` on mount in addition to tab change. Add a separate `useEffect(() => { loadLeaderboard(); }, [])` or trigger load based on a visibility/mount signal rather than solely `activeTab`.

### GAP 7 — `useScrollRestoration` hook code is missing React import
The hook code in TASK 2-1 uses `useEffect` but does not include `import { useEffect } from 'react';` at the top. Implementing agents must add this.

### GAP 8 — Use existing `ModalPortal` for `EditWorkoutModal` scroll lock
`SharedComponents.jsx` already exports a `ModalPortal` component that handles `document.body.style.overflow = 'hidden'` on mount, restores on unmount, and renders via `createPortal(children, document.body)`. The `EditWorkoutModal` should use `<ModalPortal>` as its wrapper to avoid reimplementing scroll lock. Note: `PlayerDetailModal` does NOT use `ModalPortal` — it implements its own scroll lock manually. Either approach works, but `ModalPortal` is the DRY choice.

### GAP 9 — `updateWorkoutLog` vs direct `setWorkoutLogs` is redundant
TASK 1A-4 shows `onSave` calling `setWorkoutLogs(prev => prev.map(...))` directly. TASK 1C adds `updateWorkoutLog` as a thin wrapper doing the same thing. The TODO should be consistent: **either** use `updateWorkoutLog` from context everywhere, **or** skip adding it and use `setWorkoutLogs` directly (which already triggers the Supabase sync via `createSyncSetter`). Recommendation: add `updateWorkoutLog` in AppContext and use it everywhere for clarity.

### GAP 10 — `createSyncSetter` stale closure risk on rapid edits
The `setWorkoutLogsSync` is wrapped in `useCallback` with `[profile, workoutLogs]` dependencies. The closure captures `workoutLogs` at the time of the last render. If a user edits a session, saves, then immediately edits another session before React re-renders, the diff comparison inside `createSyncSetter` may compare against stale state. This is unlikely in practice (saves are user-initiated), but implementing agents should be aware. The `setLocalState` callback form (`prev => ...`) handles React state correctly — the risk is only in the async Supabase delta computation.

### GAP 11 — ProgressPage filter states could benefit from persistence
ProgressPage has `ss` (selected split), `sd` (selected day), `se` (selected exercise) filter states. These are not mentioned in the TODO. If a user selects "PPL → Push Day A → Bench Press" to view trends, navigates to Workout page, and comes back, they lose their selection. Consider whether this warrants module-level caching.

### GAP 12 — `html { scroll-behavior: smooth }` in CSS conflicts with `behavior: 'instant'`
`index.css` (line 107) sets `html { scroll-behavior: smooth }` globally. The `useScrollRestoration` hook uses `window.scrollTo({ behavior: 'instant' })` to override this. However, **`behavior: 'instant'` on `scrollTo()` does NOT override the CSS `scroll-behavior`** in some browsers. The implementing agent should temporarily override `document.documentElement.style.scrollBehavior = 'auto'` during restoration, then restore it. Without this, restoration will animate smoothly instead of being instant, creating a visible scroll-jump effect.

### GAP 13 — Yoga session logs also use `tod()` and need past-date support
The `handleYogaComplete` function (line ~956) also hardcodes `date: tod()`. If TASK 1B is implemented to support logging past workouts, the yoga flow should also support `pastDate`. This is not mentioned in the TODO.

---

## ═══════════════════════════════════════════════════════
## FEATURE 1 — Edit Saved Workouts & Log Past Sessions
## ═══════════════════════════════════════════════════════

### Background

The workout log shape stored in `workoutLogs` (Supabase `workout_logs` + local cache):

```js
{
  id: 'abc123',
  userId: '<supabase-uid>',
  splitId: 'ppl',
  dayId: 'ppl-push-a',
  dayName: 'Push Day A',
  date: '2026-04-17',          // ISO date string, local time
  notes: '',
  // NOTE: startTime is NOT saved — only exists in ephemeral session state (see GAP 2)
  durationMinutes: 62,
  exercises: [
    {
      name: 'Barbell Bench Press',
      muscle: 'Chest',
      primaryMuscle: 'chest',
      secondaryMuscles: ['triceps', 'shoulders'],
      // NOTE: sv field is NOT saved — the logged name is already the swapped variant
      // NOTE: done field is NOT saved — all saved sets are implicitly done (see GAP 3)
      sets: [
        { reps: 8, weight: 80 },
        { reps: 8, weight: 82.5 },
        { reps: 7, weight: 82.5 },
      ]
    }
  ]
}
```

Mutations must:
1. Update React state (`setWorkoutLogs`)
2. Sync to Supabase `workout_logs` via `createSyncSetter` (upsert by `id`)
3. Invalidate any derived state (XP, Olympus League standings, Analytics charts) — these are all `useMemo`-computed from `workoutLogs`, so React re-renders handle this automatically

---

### Sub-Feature 1A — Edit a Saved Session

**Entry points (two):**
1. `WorkoutHistoryPage.jsx` — "✏ Edit" button on an expanded session card
2. `WorkoutHistoryPage.jsx` — long-press (or context action) on any session row

**Component:** `src/components/shared/EditWorkoutModal.jsx` [NEW]

**Design:** Bottom-sheet slide-up (same pattern as `PlayerDetailModal`) — `90dvh`, drag handle, backdrop to dismiss.

---

#### TASK 1A-1 — `EditWorkoutModal.jsx` [NEW]

**Props:**
```js
{
  log,            // the workoutLog object to edit — passed by value, mutated locally
  splits,         // for the exercise picker (to add exercises from the split)
  onSave(updated) // callback — receives the mutated log object
  onClose()       // dismiss callback
}
```

**Internal state:**
```js
const [draft, setDraft] = useState(() => JSON.parse(JSON.stringify(log)));
// Deep clone on mount — edits never touch the original until Save is confirmed
const [saving, setSaving] = useState(false);
const [addingExercise, setAddingExercise] = useState(false); // controls exercise picker sub-panel
```

**Sections in the modal (top to bottom):**

**1. Header row**
- Drag handle pill (centered, 40×4px)
- Session name: `{draft.dayName}` in `headline-md`
- Date chip (editable — see TASK 1A-2): `"17 Apr"` in `label-md` + calendar icon
- X close button (top-right)

**2. Duration display** (read-only, computed from `draft.exercises`):
- Shows `{draft.durationMinutes}m` — tapping opens a small inline number stepper if the user wants to correct it

**3. Exercise list** — for each exercise in `draft.exercises`:

```
┌──────────────────────────────────────────┐
│ [≡ drag handle] Barbell Bench Press  [✕] │  ← drag to reorder, ✕ deletes exercise
│ Chest · Primary Strength              [ℹ] │
│                                          │
│  SET   REPS    KG    ✓ DONE             │  ← column header
│   1    [8_]  [80_]   ✓                  │  ← each set is editable
│   2    [8_]  [82.5]  ✓                  │
│   3    [7_]  [82.5]  ✓                  │
│                                          │
│  [+ Add Set]                             │  ← .add-set-btn style
└──────────────────────────────────────────┘
```

Per exercise actions:
- **Delete exercise** (`✕` icon button, top-right of each card) → `ConfirmDialog` → removes from `draft.exercises`
- **Add set** (dashed button) → appends `{ reps: '', weight: '', done: false }` to that exercise's sets
- **Delete set** (`✕` on any set row, only shows if exercise has > 1 set) → removes that set index

Per set inputs:
- Reps: `type="text" inputMode="numeric"` — same `.set-row` grid as WorkoutPage
- Weight: `type="text" inputMode="decimal"` — same
- **No `done` toggle needed** — all saved sets are implicitly done (see GAP 3). However, newly ADDED sets (via "+ Add Set") should start as `{ reps: '', weight: '' }` and render at reduced opacity (0.7) until the user fills in values. On save, strip any sets with both reps and weight still empty.

**4. Notes field** (existing `draft.notes`) — resizable textarea, glassmorphic card

**5. "Add Exercise" button**
- Full-width ghost pill: `"+ Add Exercise"` with a `Plus` icon
- Opens the exercise picker sub-panel (TASK 1A-3)

**6. Footer: Save / Cancel**
- `"SAVE CHANGES"` → ember gradient full-width button → calls `onSave(draft)`, shows spinner while saving
- `"Discard Changes"` → error-coloured text button → calls `onClose()` without saving
- If no changes made (deep-equals original), Save button label changes to `"Close"` (no save needed)

**Animation:** Same slide-up as `PlayerDetailModal` — `translateY(100%)` → `translateY(0)`, 350ms `cubic-bezier(.4, 0, .2, 1)`. Use `useState(false)` → set `true` via `requestAnimationFrame` on mount for the transition trigger. On close, set `false` and delay `onClose()` by 300ms for exit animation (same pattern as `PlayerDetailModal.handleClose`).

**Scroll lock:** Wrap the entire modal in `<ModalPortal>` from `SharedComponents.jsx` — this handles `document.body.style.overflow = 'hidden'` on mount and restores on unmount via `createPortal`. Do NOT reimplement scroll lock manually (see GAP 8).

---

#### TASK 1A-2 — Date Editing

Users must be able to correct the date of a saved session (e.g., they logged today but the session was yesterday).

**UI:** Tapping the date chip in the header opens a compact inline date picker — a single `<input type="date" max={today}` styled to match Kinetic Elite inputs (no native picker frame visible on mobile). The `max` attribute prevents setting a future date.

```js
// In draft mutation:
setDraft(prev => ({ ...prev, date: e.target.value }));
```

**Constraint:** Date cannot be set to a future date. Date cannot be more than 90 days in the past (edge case guard).

**Files:** `EditWorkoutModal.jsx` (inline, no new component needed)

---

#### TASK 1A-3 — Exercise Picker Sub-Panel

When "Add Exercise" is tapped, a secondary panel slides in FROM THE RIGHT (or slides up over the main modal on mobile) showing exercises the user can add.

**Sources (two tabs):**
- **From Split** — exercises in the split day that aren't already in this session. If the session has no split (orphaned log), this tab is hidden.
- **Custom** — free-form: text input for exercise name + muscle group selector (dropdown from `MUSCLE_GROUPS`) + sets/reps defaults

**Design for "From Split" list:**
- Each exercise shows: name, muscle label, sets × repsRange
- Tapping one appends to `draft.exercises` with 3 default sets `{ reps: '', weight: '', done: false }`

**Design for "Custom" form:**
```
Exercise name: [_________________]
Muscle group:  [Chest ▾]
Sets: [3] Reps: [8-12]
[+ ADD TO SESSION]
```

On add: appends `{ name, muscle: selected, primaryMuscle: muscleKey, secondaryMuscles: [], sets: [...] }` to `draft.exercises`.

**Files:** Contained within `EditWorkoutModal.jsx` — no separate file needed. State: `addingExercise: false | 'split' | 'custom'`.

---

#### TASK 1A-4 — Wire into `WorkoutHistoryPage.jsx`

**Location:** On the expanded session card (the section that shows exercise details), add an "Edit Session" button alongside the existing "Delete Session" button.

```jsx
// In the expanded detail section:
<button
  onClick={e => { e.stopPropagation(); setEditLog(log); }}
  style={{
    display: 'flex', alignItems: 'center', gap: 6,
    background: 'var(--surface-container-highest)', border: 'none',
    borderRadius: 10, padding: '8px 12px', cursor: 'pointer',
    fontSize: 12, fontWeight: 700, color: 'var(--on-surface)',
    fontFamily: "'Be Vietnam Pro', sans-serif",
  }}
>
  <Pencil size={12} /> Edit Session
</button>
```

**State to add:**
```js
const [editLog, setEditLog] = useState(null); // null = closed, object = open
```

**Modal render** (at page root, outside the log list):
```jsx
{editLog && (
  <EditWorkoutModal
    log={editLog}
    splits={splits}
    onSave={async (updated) => {
      // Update local state
      setWorkoutLogs(prev => prev.map(l => l.id === updated.id ? updated : l));
      setEditLog(null);
      addToast('Session updated!', 'success');
    }}
    onClose={() => setEditLog(null)}
  />
)}
```

**Note on XP re-computation:** Because `calcAllMuscleXP` is a `useMemo` on `workoutLogs`, saving the edited log automatically re-triggers XP recalculation on the Olympus League page. No manual invalidation needed.

**Import to add:**
```js
import { Pencil } from 'lucide-react';
import EditWorkoutModal from '../shared/EditWorkoutModal';
```

---

### Sub-Feature 1B — Log a Past Workout (Backfill)

**Problem:** User trained yesterday but forgot to log it. Currently there is no way to do this from within the app.

**Entry point:** On `WorkoutPage.jsx` day picker screen, add a secondary CTA:

```
┌────────────────────────────────────────────┐
│  PUSH DAY A          Last: 14 Apr          │
│  6 exercises · ~55 min                     │
│  [Start Session →]  [← Log Past Date]      │  ← new ghost button
└────────────────────────────────────────────┘
```

Or alternatively, a floating "Log Past Workout" pill on the day picker that opens a modal.

**Design decision:** Since most users want to backfill "yesterday" (80% case) and occasionally 2–3 days ago, use a compact date picker in a bottom-sheet instead of a full separate flow.

**Component:** `src/components/shared/LogPastWorkoutModal.jsx` [NEW]

---

#### TASK 1B-1 — `LogPastWorkoutModal.jsx` [NEW]

**Flow:**
1. User taps "Log Past Date" on a split day card (WorkoutPage)
2. Modal opens with:
   - **Date picker** — `<input type="date">` with `max={yesterday}`, `min={90 days ago}`
   - Selected split day name (pre-filled, read-only — same day they tapped)
   - Preview of exercises in that day
3. User selects the date and taps "Start Logging →"
4. The existing active workout session UI opens BUT the date is overridden to the selected past date
5. When `finish()` is called, the log is saved with `date: selectedPastDate` (not `tod()`)

**Implementation:** Pass a `pastDate` prop to `WorkoutPage`'s active session flow. Modify `finish()` in `WorkoutPage.jsx`:

```js
// Before:
date: tod(),

// After:
date: pastDate || tod(),
```

Where `pastDate` is a React state lifted from the `LogPastWorkoutModal` or passed via a context/prop.

**Simpler alternative (recommended):** Instead of a full separate flow, make the date on the post-session "done" summary screen editable. After a session is finished, the summary shows `"Logged for: Today (Apr 17)"` with an edit icon. Tapping it opens the date picker. This is a 1-field change on the `done` state before final save.

**Files:** `WorkoutPage.jsx` (add `pastDate` state + edit hook on summary), or `LogPastWorkoutModal.jsx` for the full pre-session flow.

---

#### TASK 1B-2 — "Log Past Date" entry point

**Location:** `WorkoutPage.jsx`, day picker section. Below the "Start Session →" button on each day card:

```jsx
<div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
  <button className="btn-p" style={{ flex: 1 }}
    onClick={() => start(day)}>
    Start Session →
  </button>
  <button
    onClick={() => setPastDateDay(day)}
    style={{
      padding: '10px 14px', borderRadius: 12, border: 'none',
      background: 'var(--surface-container-highest)', cursor: 'pointer',
      fontSize: 11, fontWeight: 700, color: 'var(--on-surface-variant)',
      display: 'flex', alignItems: 'center', gap: 5,
    }}
    title="Log for a past date"
  >
    <Calendar size={13} /> Past Date
  </button>
</div>
```

When `pastDateDay` is set, a compact bottom-sheet opens with just a `<input type="date">` and a confirm button. On confirm, calls `start(pastDateDay)` but passes the selected date into session state. The `finish()` function reads `session.pastDate || tod()`.

---

### Sub-Feature 1C — AppContext Mutations

The `setWorkoutLogs` setter is already a `createSyncSetter` that handles Supabase upsert on conflict by `id`. Editing a log (changing its exercises array) will be an upsert of the full log object — **no new AppContext methods needed**.

However, one helper should be added for convenience:

```js
// In AppContext exposed API:
const updateWorkoutLog = useCallback((updatedLog) => {
  setWorkoutLogs(prev => prev.map(l => l.id === updatedLog.id ? updatedLog : l));
}, [setWorkoutLogs]);
```

Expose `updateWorkoutLog` from context. `EditWorkoutModal.onSave` calls this.

---

### Implementation Checklist — Feature 1

#### New Files
- [ ] `src/components/shared/EditWorkoutModal.jsx`
  - [ ] Deep-clone draft state on mount
  - [ ] Exercise list with editable set rows (same `.set-row` + `.add-set-btn` pattern as WorkoutPage)
  - [ ] Delete exercise (with ConfirmDialog)
  - [ ] Add set per exercise
  - [ ] Delete set per exercise (when > 1 set)
  - [ ] Editable date chip (`<input type="date">` max=today)
  - [ ] Editable duration stepper
  - [ ] Editable notes textarea
  - [ ] "Add Exercise" sub-panel with "From Split" tab and "Custom" tab
  - [ ] Footer: Save (ember gradient) + Discard (error-coloured text)
  - [ ] Slide-up animation (same as PlayerDetailModal)
  - [ ] Scroll lock on `body`
  - [ ] "No changes" detection → Save shows "Close" instead

#### `WorkoutHistoryPage.jsx`
- [ ] Add `editLog` state (`useState(null)`)
- [ ] Add "Edit Session" button inside expanded card detail section
- [ ] Import `Pencil` from lucide-react
- [ ] Import `EditWorkoutModal`
- [ ] Render `EditWorkoutModal` at page root (below the log list, not inside the card)
- [ ] `onSave` callback: call `updateWorkoutLog(updated)` + close modal + toast

#### `WorkoutPage.jsx`
- [ ] Add `pastDateDay` state (which day was selected for past-date logging)
- [ ] Add `pastDate` state (the date string from picker)
- [ ] Add "Past Date" ghost button below "Start Session →" on each day card
- [ ] Modify `finish()` to use `session.pastDate || tod()` for the log `date` field
- [ ] Pass `pastDate` into the session object on `start()`

#### `AppContext.jsx`
- [ ] Add `updateWorkoutLog` helper (thin wrapper over `setWorkoutLogs` map)
- [ ] Expose `updateWorkoutLog` in context value

#### QA
- [ ] Edit session reps/weight → save → check WorkoutHistoryPage reflects changes
- [ ] Edit session reps/weight → save → check ProgressPage (Workout Analytics) reflects changes
- [ ] Edit session reps/weight → save → check Olympus League XP recalculates
- [ ] Delete exercise from saved session → session still shows correctly in history
- [ ] Add exercise to saved session → shows in history + XP recalculates
- [ ] Change session date → log appears correctly in history sorted by new date
- [ ] Log past workout (2 days ago) → appears in history with correct date, not "today"
- [ ] Edit then discard → no changes saved, original log unchanged
- [ ] Edit modal scroll lock → background page does not scroll when modal is open
- [ ] Exercise picker "From Split" → only shows exercises NOT already in the session
- [ ] Custom exercise add → saves with correct muscle mapping
- [ ] Both light and dark themes render correctly in the edit modal

---

## ═══════════════════════════════════════════════════════
## FEATURE 2 — Scroll Position Persistence
## ═══════════════════════════════════════════════════════

### Background

**Expected behaviour (matches native iOS/Android apps):**

| Scenario | Expected scroll behaviour |
|----------|--------------------------|
| Navigate to a page for the FIRST time | Scroll to top |
| Navigate AWAY from a page, come back | Restore last scroll position |
| Hard refresh the browser/app | Scroll to top (clean slate) |
| Modal opens on a page | Scroll position freezes, body locked |
| Modal closes | Scroll position unchanged |
| Tab switch within a page (e.g., Diet: Tracker ↔ Meal Guide) | Restore tab-specific scroll position |

**What React Router v7 does by default:** Scrolls to top on every navigation. There is a `<ScrollRestoration>` component but it does not support same-session persistence per path, and it resets on every route change.

**Chosen approach:** Module-level `Map<string, number>` as the scroll position store. This is not React state (no re-renders) and is not `localStorage` (not persisted after tab close — intentional). It is simply a JS object that lives in memory for the duration of the session.

---

### TASK 2-1 — `useScrollRestoration` Hook [NEW]

**File:** `src/hooks/useScrollRestoration.js`

```js
import { useEffect } from 'react'; // ← GAP 7: must include React import

// Module-level map — persists across component mounts for the entire session.
// Keys: route path strings (e.g., '/diet', '/muscle-map')
// Values: scrollY pixel offset
const scrollPositions = new Map();

/**
 * Saves and restores the window scroll position for a given route.
 *
 * @param {string} key - unique identifier for this page/view (use the route path)
 * @param {object} options
 * @param {boolean} options.disabled - set true to skip restoration (e.g., during modal open)
 * @param {number}  options.debounceMs - how often to save scroll position (default: 150)
 */
export function useScrollRestoration(key, { disabled = false, debounceMs = 150 } = {}) {
  useEffect(() => {
    if (disabled) return;

    // Restore saved position or scroll to top for first visit
    const saved = scrollPositions.get(key);
    if (saved !== undefined) {
      // Use requestAnimationFrame to wait for DOM paint before restoring
      const rafId = requestAnimationFrame(() => {
        // GAP 12: Override CSS scroll-behavior during restoration
        const html = document.documentElement;
        const prev = html.style.scrollBehavior;
        html.style.scrollBehavior = 'auto';
        window.scrollTo({ top: saved, behavior: 'instant' });
        html.style.scrollBehavior = prev;
      });
      return () => cancelAnimationFrame(rafId);
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [key]);

  useEffect(() => {
    if (disabled) return;

    let timer;
    const handleScroll = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        scrollPositions.set(key, window.scrollY);
      }, debounceMs);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timer);
    };
  }, [key, disabled, debounceMs]);
}

/**
 * Manually clear the scroll position for a key.
 * Call this when you want the next visit to a page to start at top
 * (e.g., after a user submits a form and navigates away programmatically).
 */
export function clearScrollPosition(key) {
  scrollPositions.delete(key);
}

/**
 * Manually set the scroll position for a key.
 * Useful for programmatic "scroll to section" scenarios.
 */
export function setScrollPosition(key, y) {
  scrollPositions.set(key, y);
}
```

**Key design decisions:**
- `behavior: 'instant'` (not `'smooth'`) on restore — smooth scrolling on restore is jarring and slow, instant is what native apps do
- 150ms debounce on save — avoids saving on every pixel of scroll
- `requestAnimationFrame` on restore — prevents restoring before the layout is painted (which would scroll to 0 again because content height is 0)
- `passive: true` on the scroll listener — browser optimisation, prevents jank

---

### TASK 2-2 — Wire into Every Page Component

Add `useScrollRestoration` as the **first line** of every page component's body. Use the route path as the key.

```js
// DietPage.jsx:
import { useScrollRestoration } from '../../hooks/useScrollRestoration';

export default function DietPage() {
  useScrollRestoration('/diet');
  // ... rest of component
}
```

**Pages to update:**

| Page File | Key |
|-----------|-----|
| `DashboardPage.jsx` | `'/'` | ⚠️ GAP 1: route is `/`, NOT `/dashboard` |
| `WorkoutPage.jsx` | `'/workout'` |
| `SplitsPage.jsx` | `'/splits'` |
| `DietPage.jsx` | `'/diet'` |
| `ProgressPage.jsx` | `'/progress'` |
| `MuscleMapPage.jsx` | `'/muscle-map'` |
| `ProfilePage.jsx` | `'/profile'` |
| `WeightLogPage.jsx` | `'/weight-log'` |
| `MeasurementsPage.jsx` | `'/measurements'` |
| `WorkoutHistoryPage.jsx` | `'/history'` |
| `ContactPage.jsx` | `'/contact'` |
| `CycleTrackerPage.jsx` | `'/cycle'` |

---

### TASK 2-3 — Diet Page: Tab State Persistence

> ⚠️ **GAP 4 CORRECTION:** The DietPage does NOT have an `expandedSlot` accordion. Meal slots are always visible as cards. Clicking a meal slot card calls `handleOpenSearch(slot.id)` which opens a full-screen food search modal (via `showSearch` + `searchMealSlot` state). There is nothing to "expand" or "collapse". The original TASK 2-3 description was based on an incorrect assumption about the DietPage UI architecture.

**What actually needs persistence:**

**Concern A: Tab state (Tracker / Meal Guide / Analysis)**

The `activeTab` state in `DietPage.jsx` (line 65) resets to `'tracker'` on every navigation. This should be session-scoped:

```js
const dietTabCache = { activeTab: 'tracker' };

// In DietPage component:
const [activeTab, setActiveTabRaw] = useState(dietTabCache.activeTab);

const setActiveTab = useCallback((tab) => {
  dietTabCache.activeTab = tab;
  setActiveTabRaw(tab);
}, []);
```

Replace all existing `setActiveTab(...)` calls in the JSX — there are 3 tab buttons (around lines 542-548) that call `setActiveTab('tracker')`, `setActiveTab('guide')`, `setActiveTab('analysis')`. These will work as-is since we're replacing the setter.

**Concern B: Scroll position (handled by TASK 2-2)**

`useScrollRestoration('/diet')` handles this. When the user returns to `/diet`, the scroll is restored to where they were.

**Files:** `DietPage.jsx` only. No new file needed.

---

### TASK 2-4 — Olympus League / Muscle Map Tab Persistence

`MuscleMapPage.jsx` has a `activeTab` state (`'leaderboard' | 'friends' | 'mystats'`). Same pattern:

```js
const muscleMapTabCache = { activeTab: 'leaderboard' };

const [activeTab, setActiveTabRaw] = useState(muscleMapTabCache.activeTab);
const setActiveTab = (tab) => { muscleMapTabCache.activeTab = tab; setActiveTabRaw(tab); };
```

> ⚠️ **GAP 6 WARNING — Stale leaderboard data:** `MuscleMapPage` has `useEffect`s (lines 122-125, 128-157) that only fire when `activeTab` transitions TO `'leaderboard'`. If the tab is cached as `'leaderboard'` and the user navigates back, the `[activeTab]` dependency doesn't change, so `loadLeaderboard()` doesn't re-fire and data may be stale.
>
> **Required fix:** Add a separate mount-time effect that loads the leaderboard regardless of cached tab:
> ```js
> // Always refresh leaderboard data on page mount (not just tab change)
> useEffect(() => {
>   if (muscleMapTabCache.activeTab === 'leaderboard') {
>     loadLeaderboard();
>   }
> }, []); // mount-only, supplements the existing [activeTab] effect
> ```

**Files:** `MuscleMapPage.jsx` only.

---

### TASK 2-5 — WorkoutHistoryPage Search/Filter/Tab Persistence

The search query, split filter, **and the strength/cardio tab** in `WorkoutHistoryPage.jsx` should all be preserved across navigation.

> ⚠️ **GAP 5:** The original TASK 2-5 missed the `activeTab` state (`'strength' | 'cardio'`, line 30) which controls whether the user sees the strength log list or the cardio activity panel.

```js
const historyFilterCache = { search: '', filterSplit: '', activeTab: 'strength' };

const [search, setSearchRaw] = useState(historyFilterCache.search);
const [filterSplit, setFilterSplitRaw] = useState(historyFilterCache.filterSplit);
const [activeTab, setActiveTabRaw] = useState(historyFilterCache.activeTab);

const setSearch = (v) => { historyFilterCache.search = v; setSearchRaw(v); };
const setFilterSplit = (v) => { historyFilterCache.filterSplit = v; setFilterSplitRaw(v); };
const setActiveTab = (v) => { historyFilterCache.activeTab = v; setActiveTabRaw(v); };
```

**Files:** `WorkoutHistoryPage.jsx` only.

---

### TASK 2-6 — WorkoutPage Day Selection Persistence

When user is on Workout page, selects the day, views details, navigates away, and comes back — they should see the same day still highlighted/focused (not reset to day picker top). The `useScrollRestoration('/workout')` handles the scroll part. However, the `session` state being `null` means we need scroll only (no extra state needed since the day picker shows all days anyway).

**No extra work needed here** — scroll restoration is sufficient for this page.

---

### TASK 2-6b — ProgressPage Filter State Persistence (NEW — GAP 11)

ProgressPage has three filter dropdowns that control which workout data is displayed:
- `ss` — selected split ID
- `sd` — selected day ID
- `se` — selected exercise name

If a user configures "PPL → Push Day A → Bench Press" to view their strength trend chart, navigates away, and comes back, they lose the selection. Apply the same module-level cache pattern:

```js
const progressFilterCache = { ss: null, sd: '', se: '' };

// In component (after splits are available):
const [ss, setSsRaw] = useState(progressFilterCache.ss || activeSplit?.id || splits[0]?.id);
const [sd, setSdRaw] = useState(progressFilterCache.sd);
const [se, setSeRaw] = useState(progressFilterCache.se);

const setSs = (v) => { progressFilterCache.ss = v; setSsRaw(v); };
const setSd = (v) => { progressFilterCache.sd = v; setSdRaw(v); };
const setSe = (v) => { progressFilterCache.se = v; setSeRaw(v); };
```

**Files:** `ProgressPage.jsx` only.

---

### TASK 2-7 — Handle Edge Cases

**Edge case 1: When to clear scroll position**

Some navigations should intentionally start at top even when returning:
- After finishing a workout (user is on summary → navigates to history → history should start at top to see the new entry)
- After submitting a contact form
- After logging a new weight entry (Dashboard should start at top to see the updated weight)

Use `clearScrollPosition(key)` from the hook in these cases:

```js
// In WorkoutPage.jsx, after finish():
import { clearScrollPosition } from '../../hooks/useScrollRestoration';
// ...
clearScrollPosition('/history'); // history should show the new entry at top
```

**Edge case 2: Modals**

When a modal opens, `body.overflow = 'hidden'` is set. The scroll listener in `useScrollRestoration` will still fire briefly. Since the body is locked, `window.scrollY` won't change during modal open, so saved positions remain correct. No special handling needed.

**Edge case 3: Tab visibility change**

When the user backgrounds the app (tab hidden) and returns, the scroll position is still valid in the `scrollPositions` Map (module-level, survives tab hide/show). No special handling needed.

**Edge case 4: Programmatic scroll (e.g., "Jump to Today" on Diet page)**

After a programmatic scroll, manually update the cache so it persists:

```js
import { setScrollPosition } from '../../hooks/useScrollRestoration';

// After scrolling to the daily tracker:
window.scrollTo({ top: trackerRef.current.offsetTop, behavior: 'smooth' });
setScrollPosition('/diet', trackerRef.current.offsetTop);
```

---

### Implementation Checklist — Feature 2

#### New Files
- [ ] `src/hooks/useScrollRestoration.js`
  - [ ] Module-level `Map<string, number>` scroll position store
  - [ ] `useScrollRestoration(key, options)` hook — restore on mount, save on scroll (debounced)
  - [ ] `clearScrollPosition(key)` exported utility
  - [ ] `setScrollPosition(key, y)` exported utility
  - [ ] `requestAnimationFrame` on restore to wait for DOM paint
  - [ ] `behavior: 'instant'` on restore (not smooth)
  - [ ] `passive: true` on scroll listener for browser optimisation

#### Page components (add `useScrollRestoration` as first hook call)
- [ ] `DashboardPage.jsx` — `useScrollRestoration('/')` ← GAP 1: route is `/`, NOT `/dashboard`
- [ ] `WorkoutPage.jsx` — `useScrollRestoration('/workout')`
- [ ] `SplitsPage.jsx` — `useScrollRestoration('/splits')`
- [ ] `DietPage.jsx` — `useScrollRestoration('/diet')`
- [ ] `ProgressPage.jsx` — `useScrollRestoration('/progress')`
- [ ] `MuscleMapPage.jsx` — `useScrollRestoration('/muscle-map')`
- [ ] `ProfilePage.jsx` — `useScrollRestoration('/profile')`
- [ ] `WeightLogPage.jsx` — `useScrollRestoration('/weight-log')`
- [ ] `MeasurementsPage.jsx` — `useScrollRestoration('/measurements')`
- [ ] `WorkoutHistoryPage.jsx` — `useScrollRestoration('/history')`
- [ ] `ContactPage.jsx` — `useScrollRestoration('/contact')`
- [ ] `CycleTrackerPage.jsx` — `useScrollRestoration('/cycle')`

#### Tab / accordion state persistence (module-level cache pattern)
- [ ] `DietPage.jsx` — persist `activeTab` only (GAP 4: no `expandedSlot` exists — meal slots are not an accordion)
- [ ] `MuscleMapPage.jsx` — persist `activeTab` + add mount-time leaderboard refresh (GAP 6)
- [ ] `WorkoutHistoryPage.jsx` — persist `search`, `filterSplit`, `activeTab` (GAP 5: strength/cardio tab was missing)
- [ ] `ProgressPage.jsx` — persist `ss`, `sd`, `se` filter states (GAP 11: new)

#### `clearScrollPosition` call sites (intentional resets)
- [ ] `WorkoutPage.jsx` after `finish()` — clear `'/history'` so new entry shows at top
- [ ] `DashboardPage.jsx` after logging weight — clear `'/'` (not `'/dashboard'` — GAP 1) — optional
- [ ] `ContactPage.jsx` after form submit — clear `'/contact'` so page starts fresh

#### QA
- [ ] Navigate Diet → Workout → Diet: Diet scroll position preserved
- [ ] Navigate Diet → close app tab → reopen → Diet starts at top (cleared on tab close ✓)
- [ ] Open Lunch on Diet → switch to Meal Guide tab → switch back to Tracker: Lunch still open
- [ ] Open Lunch on Diet → navigate to Workout → come back: Lunch still open, scroll at Lunch
- [ ] Navigate to History for first time → at top. Scroll down → navigate away → come back → restored
- [ ] Finish workout → navigate to History → History at top (new entry visible)
- [ ] Olympus League: switch to My Stats → navigate to Dashboard → come back → still on My Stats
- [ ] History page: type "push" in search → go to Splits → come back → filter still "push"
- [ ] Modal open: scroll lock active, scroll position not changed in cache
- [ ] Modal close: scroll position restored correctly (body lock removed)
- [ ] WorkoutPage: `requestAnimationFrame` timing — scroll restores after content is painted (no jump to 0)
- [ ] Desktop browser: scroll within the `.pg-in` content area (not window) — verify the hook captures the right scroll target. If pages use `overflow-y: auto` on a wrapper instead of `window`, the hook needs to target that element's `scrollTop` instead of `window.scrollY`. **⚠️ Check this during implementation — may need to pass a `containerRef` option.**

---

## 📦 File Change Summary

| File | Change Type | What Changes |
|------|------------|--------------|
| `src/hooks/useScrollRestoration.js` | **[NEW]** | Module-level scroll position cache + hook (includes GAP 7 React import + GAP 12 scroll-behavior override) |
| `src/components/shared/EditWorkoutModal.jsx` | **[NEW]** | Full session editor with exercise/set CRUD, wrapped in `<ModalPortal>` (GAP 8) |
| `src/components/pages/WorkoutHistoryPage.jsx` | Moderate | Add Edit button, editLog state, modal render + module-level cache for search, filterSplit, activeTab (GAP 5) + useScrollRestoration |
| `src/components/pages/WorkoutPage.jsx` | Small | Past date support on finish(), Past Date button on day picker, yoga pastDate (GAP 13) |
| `src/context/AppContext.jsx` | Small | Expose `updateWorkoutLog` helper (GAP 9) |
| `src/components/pages/DietPage.jsx` | Small | Module-level cache for `activeTab` only (GAP 4: no expandedSlot) + useScrollRestoration |
| `src/components/pages/MuscleMapPage.jsx` | Small | Module-level cache for activeTab + mount-time leaderboard refetch (GAP 6) + useScrollRestoration |
| `src/components/pages/ProgressPage.jsx` | Small | Module-level cache for `ss`, `sd`, `se` filter states (GAP 11: new) + useScrollRestoration |
| All other page components (9 files) | Trivial | Add single `useScrollRestoration` hook call |

**Files NOT touched:** `index.css`, routing in `App.jsx`, `SharedComponents.jsx` (only imported from, not modified), Supabase schema
**Note:** Layout.jsx is at `src/components/layout/Layout.jsx`, not `src/components/Layout.jsx`.

---

## 🗒️ Implementation Notes

### Feature 1

- **Deep clone on modal open** — always `JSON.parse(JSON.stringify(log))` the log into draft state. Never mutate the original log object in AppContext until Save is confirmed.
- **Optimistic save** — `setWorkoutLogs` (the `createSyncSetter` wrapper) updates React state immediately and syncs to Supabase asynchronously. The UI closes the modal and shows a toast as soon as local state is updated, not after the Supabase round-trip.
- **Drag-to-reorder exercises** — not in scope for this TODO. Can be added in a future pass using `react-beautiful-dnd` or CSS drag handles. The exercises array order in the log object is respected by the editor as-is.
- **Exercise deletions** — soft delete by filtering the exercises array. The Supabase upsert of the whole log object handles this (exercises is stored as a `jsonb` column, not separate rows).
- **Saved sets have no `done` field** (GAP 3) — `doFinish()` filters out `done: false` sets and strips the `done` boolean before saving. All saved sets are `{ reps: number, weight: number }`. When editing, display all saved sets at full opacity. NEW sets added during editing should render at reduced opacity until filled in, and be stripped on save if both reps and weight are empty.
- **XP side effect** — after a session edit, if the user is on the Olympus League page, the XP recalculates because `calcAllMuscleXP` is a `useMemo` on `workoutLogs`. This is automatic. No manual invalidation.
- **`createSyncSetter` stale closure** (GAP 10) — the `setWorkoutLogsSync` captures `workoutLogs` in its closure. Rapid consecutive edits are unlikely (users save one session at a time), but be aware the async Supabase delta comparison may reference stale state if React hasn't re-rendered between saves.
- **Yoga sessions** (GAP 13) — the `handleYogaComplete` function also hardcodes `date: tod()`. If past-date logging is implemented, ensure the yoga flow also supports `pastDate` override.
- **Use `ModalPortal`** (GAP 8) — the `EditWorkoutModal` should wrap content in `<ModalPortal>` from `SharedComponents.jsx` to get automatic scroll-lock + portal rendering. Do NOT reimplement scroll lock manually.
- **Use `updateWorkoutLog` consistently** (GAP 9) — add the helper in AppContext, use it in `onSave`, do NOT call `setWorkoutLogs(prev => prev.map(...))` directly from the page component.

### Feature 2

- **Desktop scroll container** — verified: `.pg-in` is just a CSS animation class (`animation: pgIn .38s var(--ease-spring) forwards`), NOT a scroll container. The Layout uses a sticky sidebar (`position: sticky; height: 100dvh`) with page content scrolling via `window`. The hook targeting `window.scrollY` is correct for both mobile and desktop. No `containerRef` option needed.
- **`requestAnimationFrame` is critical** — without it, restoring scroll before React has painted the full page content will silently fail (scroll to 0 because page height is 0). The RAF delays restoration by one frame, by which time the content is rendered.
- **CSS `scroll-behavior: smooth` conflict** (GAP 12) — `index.css` line 107 sets `html { scroll-behavior: smooth }` globally. The `window.scrollTo({ behavior: 'instant' })` call may NOT override this in all browsers (notably Safari). During restoration, temporarily override the CSS: `document.documentElement.style.scrollBehavior = 'auto'` → restore → then reset. The updated hook code in TASK 2-1 includes this fix.
- **Module-level caches (not `sessionStorage`)** — `sessionStorage` has serialization overhead and would persist across browser tab duplications (undesirable). Module-level variables are isolated per tab and cleared on browser close. This is exactly the behaviour we want.
- **Don't use `useLocation().pathname` as the key** — use hardcoded string constants per page. This avoids bugs where the same component renders at different paths. Critical: Dashboard is at `'/'`, NOT `'/dashboard'` (GAP 1).
- **Nested tabs in Diet page** — the Diet page `activeTab` persists the tab (Tracker / Meal Guide / Analysis). Each tab effectively has its own content block but shares the same page-level scroll. This means restoring `/diet` scroll position will put the user at the right vertical position AND the right tab is restored by the module-level cache — together, the user is exactly where they left off. Note: there is NO `expandedSlot` accordion to cache (GAP 4 — meal slots are always visible, not collapsible).