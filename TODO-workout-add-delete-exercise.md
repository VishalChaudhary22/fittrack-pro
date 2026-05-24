# FitTrack Pro — TODO: Add & Delete Exercise During Active Session
> **Created:** 2026-05-24
> **Effort:** 🟡 Medium · **Impact:** 🔴 High — #1 mid-workout friction point for Indian gym users
> **Files affected:** `WorkoutPage.jsx` (primary), `index.css` (minor additions)
> **Dependencies:** None — fully self-contained within existing session state

---

## 🎯 Why This Matters (Indian Gym Context)

Indian gyms — especially urban chains like Cult.fit, Gold's Gym, and independent gyms in Delhi NCR, Mumbai, and Bengaluru — are notoriously crowded during peak hours (7–9 AM, 6–9 PM). The top 3 mid-workout friction points for Indian users:

1. **Equipment occupied** — The bench is taken. User needs to swap chest press for cable fly and *add* a dumbbell variation they didn't plan.
2. **Trainer changes the plan** — A gym trainer walks over and suggests an additional finisher (e.g., drop-set cable curls after the planned workout). User needs to add it on the fly.
3. **Impulse volume addition** — User feels strong mid-session and wants to add a fourth exercise ("chhodo yaar, ek aur karo") — extremely common Indian gym culture.

Currently: User cannot add a new exercise to an active session. They must finish, edit the history log, or mentally remember to add it to the next session. Both options cause tracking loss.

The **delete** feature is equally important: users accidentally start the wrong day (Push when they meant Pull), or a trainer tells them to skip an exercise for a specific reason (shoulder impingement, skipping squats on leg day). There is no way to remove it cleanly.

---

## 🏗️ Architecture Overview

### What Currently Exists in `WorkoutPage.jsx`
- `session.exs` — array of exercise objects `{ id, name, muscle, primaryMuscle, secondaryMuscles, sets: [...], sv }` for the active session
- `addS(ei)` — adds a set to exercise at index `ei`
- `rmS(ei, si)` — removes a set from exercise at index `ei`
- `upd(ei, si, field, val)` — updates a field on a specific set
- `swapExercise(ei, newEx)` — replaces exercise at index `ei` with a new exercise (already exists)
- `splits` from `useApp()` — all user splits with full exercise definitions
- `finish()` — saves the session log

### What We Need to Add
1. **`addExercise(newEx)`** — appends a new exercise to `session.exs` with a fresh set of empty sets
2. **`removeExercise(ei)`** — removes the exercise at index `ei` from `session.exs`
3. **`AddExerciseSheet`** — bottom-sheet component (defined inside `WorkoutPage.jsx`) showing all exercises from all splits, categorized by primary muscle
4. **Delete button** — per-exercise-block header action with inline confirm pattern

### Exercise Pool Construction
All exercises from all splits (across all days), deduplicated by `name`, enriched with `primaryMuscle`, `secondaryMuscles`, and a representative `sets × repsRange`. This is built once via `useMemo` when the session is active.

---

## ⚠️ Critical Review — Architectural Edge Cases & Corrections

> **Reviewed 2026-05-24.** The following issues would cause bugs if the plan were implemented as-is. Each references the affected Task and includes inline fixes below.

### 🔴 1. Rest Timer Index Corruption on Exercise Delete → Task 3

`restTimerPosition` stores `{ ei, si }` — the **exercise index** of the currently resting set. Deleting an exercise at index N shifts all subsequent exercises down by 1, causing the rest timer to render on the wrong exercise (or crash if the last exercise is deleted). `removeExercise` **must** adjust `restTimerPosition` — see corrected code in Task 3.

### 🔴 2. React Key Collisions on Added Exercises → Task 2

The render uses `key={ex.id}`. The plan sets `id: ex.id || ex.name`, which can collide with IDs from the split's day exercises already in the session. **Must use `gId()`** (already imported from `helpers.js`) for unique IDs.

### 🔴 3. Missing `exerciseId` Blocks Swap for Added Exercises → Task 2

`getSwappedExercise()` short-circuits with `if (!exercise.exerciseId) return exercise` — the swap button won't function on added exercises unless `exerciseId` is carried over from the pool entry. Fixed in Task 2.

### 🟡 4. Missing `targetRep` on Newly Created Sets → Task 2

Session start populates `targetRep` on every set (used by the UI to show the grey target hint). The plan's `addExercise` omits it, so added exercises would show no target. Fixed in Task 2.

### 🟡 5. `exercisePool` Recomputes on Every Keystroke → Task 1

Dependency array `[splits, session]` recomputes the pool whenever **any set field changes** (every rep/weight keystroke updates `session`). The pool only depends on `splits`. Remove `session` from deps and drop the `if (!session) return []` guard — compute unconditionally. Fixed inline in Task 1.

### 🟡 6. `alreadyAdded` Check Misses Swapped Exercises → Task 5

After a swap, `ex.name` becomes the swapped name. Checking `e.name === ex.name` won't detect that "Incline Dumbbell Press" (pool) is already in the session as "Incline Machine Press" (swapped). Must also check `e._originalName` and `e.originalName`. Fixed in Task 5.

### 🟢 7. Sheet Should Use `<Portal>` → Task 4

The existing swap modal uses `<Portal>` (already imported). The plan renders the AddExerciseSheet inline. For z-index reliability and to avoid scroll-container clipping, wrap the sheet in `<Portal>`.

### 🟢 8. FAB Overlaps the Sheet → Task 7

The "Finish Workout" FAB is at `zIndex: 9998` — it will float **above** the sheet (`zIndex: 901`), blocking the bottom of the exercise list. Hide the FAB when `showAddEx` is true, or bump the sheet z-index above 9998.

### 🟢 9. Missing `useCallback` Import → Task 8

`addExercise` and `removeExercise` use `useCallback`, but the current React import only has `useState, useEffect, useRef, useMemo`. Must add `useCallback`.

### 🟢 10. Auto-Dismiss Timeout Code Never Provided → Task 6

The design spec and checklist mention an 8-second auto-dismiss for the delete confirm, but no Task provides the actual `useEffect` code. Added in Implementation Notes.

---

## 📋 Implementation Tasks

### TASK 1 — Exercise Pool `useMemo`

Add inside `WorkoutPage.jsx`, after the existing `useMemo` hooks, only when `session` is truthy:

```js
// All unique exercises across all splits, deduplicated by name, sorted by primaryMuscle
const exercisePool = useMemo(() => {
  // ⚠️ FIXED: Removed session guard — pool computed unconditionally
  // (session removed from deps to avoid recomputing on every keystroke)
  const seen = new Set();
  const pool = [];

  splits.forEach(split => {
    split.days?.forEach(day => {
      day.exercises?.forEach(ex => {
        if (!ex.name || seen.has(ex.name)) return;
        seen.add(ex.name);
        pool.push({
          id:              ex.id || ex.name,
          name:            ex.name,
          muscle:          ex.muscle || '',
          primaryMuscle:   ex.primaryMuscle || ex.muscle?.toLowerCase() || 'other',
          secondaryMuscles: ex.secondaryMuscles || [],
          sets:            ex.sets || 3,
          repsRange:       ex.repsRange || '8-12',
          focusType:       ex.focusType || '',
        });
      });
    });
  });

  // Sort by primaryMuscle, then by name within each group
  return pool.sort((a, b) =>
    a.primaryMuscle.localeCompare(b.primaryMuscle) ||
    a.name.localeCompare(b.name)
  );
}, [splits]); // ⚠️ FIXED: removed 'session' — pool doesn't depend on session state

// Unique muscle categories for the filter pills, in display order
const MUSCLE_DISPLAY_ORDER = [
  'chest', 'back', 'shoulders', 'biceps', 'triceps',
  'forearms', 'traps', 'abs', 'quads', 'hamstrings', 'glutes', 'calves', 'other',
];

const poolCategories = useMemo(() => {
  const cats = new Set(exercisePool.map(ex => ex.primaryMuscle));
  return MUSCLE_DISPLAY_ORDER.filter(c => cats.has(c));
}, [exercisePool]);
```

---

### TASK 2 — `addExercise` Function

Add alongside existing `addS`, `rmS`, `upd` functions:

```js
const addExercise = useCallback((ex) => {
  setSession(prev => {
    if (!prev) return prev;
    const newEx = {
      id:              gId(), // ⚠️ FIXED: unique ID prevents React key collisions
      exerciseId:      ex.exerciseId || null, // ⚠️ FIXED: needed for swap registry
      name:            ex.name,
      muscle:          ex.muscle || '',
      primaryMuscle:   ex.primaryMuscle || '',
      secondaryMuscles: ex.secondaryMuscles || [],
      repsRange:       ex.repsRange || '8-12',
      focusType:       ex.focusType || '',
      // Start with the same default sets as WorkoutPage does on session start
      sets: Array.from({ length: ex.sets || 3 }, () => ({
        reps: '', weight: '', done: false,
        targetRep: ex.repsRange || '8-12', // ⚠️ FIXED: UI shows target reps hint
      })),
      sv: null, // no swap variant yet
    };
    return { ...prev, exs: [...prev.exs, newEx] };
  });
  setShowAddEx(false); // close the sheet after adding
}, []);
```

---

### TASK 3 — `removeExercise` Function + Confirm State

Add state:
```js
const [confirmRemoveIdx, setConfirmRemoveIdx] = useState(null); // index of exercise to remove, or null
```

Add function:
```js
const removeExercise = useCallback((ei) => {
  // ⚠️ FIXED: Adjust rest timer — it uses { ei, si } indices that shift on delete
  if (restTimerPosition) {
    if (restTimerPosition.ei === ei) {
      // Timer is on the deleted exercise — cancel it entirely
      setRestActive(false);
      setRestEndsAt(null);
      setRestTimerPosition(null);
      localStorage.removeItem(REST_TIMER_KEY);
      localStorage.removeItem(REST_TIMER_POS_KEY);
    } else if (restTimerPosition.ei > ei) {
      // Timer is after the deleted exercise — shift index down by 1
      const shifted = { ...restTimerPosition, ei: restTimerPosition.ei - 1 };
      setRestTimerPosition(shifted);
      localStorage.setItem(REST_TIMER_POS_KEY, JSON.stringify(shifted));
    }
  }

  setSession(prev => {
    if (!prev) return prev;
    return { ...prev, exs: prev.exs.filter((_, i) => i !== ei) };
  });
  setConfirmRemoveIdx(null);
}, [restTimerPosition]);
```

---

### TASK 4 — `AddExerciseSheet` Component

Define as a function inside `WorkoutPage.jsx` (same file, above the main component export, or as an inner component). It uses the `exercisePool` and `poolCategories` computed above.

**State (local to this sheet):**
```js
// These live inside AddExerciseSheet or as local state in WorkoutPage when showAddEx = true
const [addExSearch, setAddExSearch] = useState('');
const [addExCat, setAddExCat] = useState('all'); // 'all' | muscle key
```

**Filtered list:**
```js
const filteredPool = useMemo(() => {
  let list = exercisePool;
  if (addExCat !== 'all') list = list.filter(ex => ex.primaryMuscle === addExCat);
  if (addExSearch.trim()) {
    const q = addExSearch.toLowerCase();
    list = list.filter(ex =>
      ex.name.toLowerCase().includes(q) ||
      ex.primaryMuscle.includes(q) ||
      ex.muscle.toLowerCase().includes(q)
    );
  }
  return list;
}, [exercisePool, addExCat, addExSearch]);
```

**JSX structure (bottom sheet, same pattern as existing modals):**

```jsx
{showAddEx && (
  // Backdrop
  <div
    className="mo"
    style={{ background: 'rgba(0,0,0,0.75)', zIndex: 900 }}
    onClick={() => setShowAddEx(false)}
  >
    {/* Sheet panel — stop propagation so clicks inside don't close */}
    <div
      className="md"
      onClick={e => e.stopPropagation()}
      style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        maxHeight: '88dvh',
        background: 'var(--surface-container-low)',
        borderRadius: '24px 24px 0 0',
        display: 'flex', flexDirection: 'column',
        overflow: 'hidden',
        zIndex: 901,
        animation: 'sheetUp .28s var(--ease-decel) both',
      }}
    >
      {/* ── DRAG HANDLE ────────────────────────── */}
      <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 12, paddingBottom: 4, flexShrink: 0 }}>
        <div style={{ width: 40, height: 4, borderRadius: 2, background: 'var(--surface-container-highest)' }} />
      </div>

      {/* ── HEADER ─────────────────────────────── */}
      <div style={{ padding: '12px 20px 16px', flexShrink: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div>
            <div style={{
              fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800,
              fontSize: 18, letterSpacing: '-0.03em', color: 'var(--on-surface)',
            }}>
              Add Exercise
            </div>
            <div style={{ fontSize: 11, color: 'var(--on-surface-variant)', marginTop: 2 }}>
              {exercisePool.length} exercises from your splits
            </div>
          </div>
          <button
            onClick={() => setShowAddEx(false)}
            aria-label="Close"
            style={{
              background: 'var(--surface-container-highest)', border: 'none',
              borderRadius: 10, width: 36, height: 36,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: 'var(--on-surface-variant)',
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* ── SEARCH BAR ─────────────────────── */}
        <div style={{ position: 'relative', marginBottom: 14 }}>
          <Search size={15} color="var(--on-surface-dim)"
            style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
          <input
            placeholder="Search exercises…"
            value={addExSearch}
            onChange={e => setAddExSearch(e.target.value)}
            style={{
              width: '100%', padding: '11px 14px 11px 38px',
              background: 'var(--surface-container-highest)',
              border: 'none', borderRadius: 12,
              color: 'var(--on-surface)', fontSize: 14, fontWeight: 500,
              fontFamily: "'Be Vietnam Pro', sans-serif",
              boxSizing: 'border-box',
            }}
          />
        </div>

        {/* ── MUSCLE CATEGORY PILLS ──────────── */}
        <div style={{
          display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4,
          scrollbarWidth: 'none', msOverflowStyle: 'none',
        }}>
          {/* "All" pill */}
          {['all', ...poolCategories].map(cat => (
            <button
              key={cat}
              onClick={() => setAddExCat(cat)}
              style={{
                flexShrink: 0, padding: '7px 14px', borderRadius: 20, border: 'none',
                cursor: 'pointer', fontSize: 11, fontWeight: 700,
                fontFamily: "'Space Grotesk', sans-serif",
                textTransform: 'capitalize', letterSpacing: '0.04em',
                background: addExCat === cat
                  ? 'linear-gradient(135deg, var(--primary), var(--primary-container))'
                  : 'var(--surface-container-highest)',
                color: addExCat === cat ? '#fff' : 'var(--on-surface-variant)',
                boxShadow: addExCat === cat ? '0 2px 10px rgba(248,95,27,0.25)' : 'none',
                transition: 'all .18s var(--ease-smooth)',
              }}
            >
              {cat === 'all' ? 'All' : MUSCLE_LABEL_MAP[cat] || cat}
            </button>
          ))}
        </div>
      </div>

      {/* ── EXERCISE LIST (scrollable) ─────────── */}
      <div style={{
        flex: 1, overflowY: 'auto', padding: '0 20px 20px',
        WebkitOverflowScrolling: 'touch',
      }}>
        {filteredPool.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '40px 20px',
            color: 'var(--on-surface-dim)', fontSize: 13,
          }}>
            No exercises found
          </div>
        ) : (
          // Group by primaryMuscle when in "all" view, flat list in category view
          addExCat === 'all'
            ? poolCategories
                .filter(cat => filteredPool.some(ex => ex.primaryMuscle === cat))
                .map(cat => (
                  <div key={cat} style={{ marginBottom: 8 }}>
                    {/* Section header */}
                    <div style={{
                      fontSize: 9, fontWeight: 700, textTransform: 'uppercase',
                      letterSpacing: '0.15em', color: 'var(--on-surface-dim)',
                      padding: '10px 0 6px', fontFamily: "'Space Grotesk', sans-serif",
                    }}>
                      {MUSCLE_LABEL_MAP[cat] || cat}
                    </div>
                    {filteredPool
                      .filter(ex => ex.primaryMuscle === cat)
                      .map(ex => <ExercisePoolRow key={ex.name} ex={ex} onAdd={addExercise} session={session} />)
                    }
                  </div>
                ))
            : filteredPool.map(ex =>
                <ExercisePoolRow key={ex.name} ex={ex} onAdd={addExercise} session={session} />
              )
        )}
      </div>
    </div>
  </div>
)}
```

---

### TASK 5 — `ExercisePoolRow` Sub-component

A single row in the exercise list. Defined as a small function inside `WorkoutPage.jsx` (above the main component):

```jsx
// Maps primaryMuscle keys to display labels
const MUSCLE_LABEL_MAP = {
  chest:       'Chest',
  back:        'Back',
  shoulders:   'Shoulders',
  biceps:      'Biceps',
  triceps:     'Triceps',
  forearms:    'Forearms',
  traps:       'Traps',
  abs:         'Abs',
  quads:       'Quads',
  hamstrings:  'Hamstrings',
  glutes:      'Glutes',
  calves:      'Calves',
  other:       'Other',
};

// Muscle color accent map for pill badges
const MUSCLE_COLOR_MAP = {
  chest:       '#FF6B6B',
  back:        '#4ECDC4',
  shoulders:   '#FFB347',
  biceps:      '#87CEEB',
  triceps:     '#DDA0DD',
  forearms:    '#F0E68C',
  traps:       '#98FB98',
  abs:         '#FFA07A',
  quads:       '#87CEFA',
  hamstrings:  '#F4A460',
  glutes:      '#EE82EE',
  calves:      '#90EE90',
  other:       'var(--on-surface-dim)',
};

function ExercisePoolRow({ ex, onAdd, session }) {
  // Check if this exercise is already in the current session
  // ⚠️ FIXED: Also check original names to catch swapped exercises
  const alreadyAdded = session?.exs?.some(e =>
    e.name === ex.name || e._originalName === ex.name || e.originalName === ex.name
  );
  const accent = MUSCLE_COLOR_MAP[ex.primaryMuscle] || 'var(--on-surface-dim)';

  return (
    <div
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '13px 14px', borderRadius: 14, marginBottom: 6,
        background: 'var(--surface-container)',
        opacity: alreadyAdded ? 0.55 : 1,
        transition: 'opacity .15s, background .15s',
        cursor: alreadyAdded ? 'default' : 'pointer',
      }}
      onMouseOver={e => { if (!alreadyAdded) e.currentTarget.style.background = 'var(--surface-container-high)'; }}
      onMouseOut={e => { e.currentTarget.style.background = 'var(--surface-container)'; }}
      onClick={() => { if (!alreadyAdded) onAdd(ex); }}
    >
      {/* Left: name + muscle badge */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 14, fontWeight: 700, color: 'var(--on-surface)',
          fontFamily: "'Be Vietnam Pro', sans-serif",
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          marginBottom: 4,
        }}>
          {ex.name}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{
            fontSize: 9, fontWeight: 700, textTransform: 'uppercase',
            letterSpacing: '0.08em', color: accent,
            fontFamily: "'Space Grotesk', sans-serif",
          }}>
            {MUSCLE_LABEL_MAP[ex.primaryMuscle] || ex.primaryMuscle}
          </span>
          <span style={{ fontSize: 9, color: 'var(--on-surface-dim)' }}>·</span>
          <span style={{ fontSize: 10, color: 'var(--on-surface-variant)' }}>
            {ex.sets} × {ex.repsRange}
          </span>
        </div>
      </div>

      {/* Right: Add button or "In Session" indicator */}
      {alreadyAdded ? (
        <span style={{
          fontSize: 9, fontWeight: 700, textTransform: 'uppercase',
          letterSpacing: '0.08em', color: 'var(--primary)',
          fontFamily: "'Space Grotesk', sans-serif", flexShrink: 0, marginLeft: 10,
        }}>
          In Session
        </span>
      ) : (
        <div style={{
          width: 30, height: 30, borderRadius: 8, flexShrink: 0, marginLeft: 10,
          background: 'linear-gradient(135deg, var(--primary), var(--primary-container))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 2px 8px rgba(248,95,27,0.3)',
        }}>
          <Plus size={16} color="#fff" strokeWidth={2.5} />
        </div>
      )}
    </div>
  );
}
```

---

### TASK 6 — Delete Exercise UX (Inline Confirm Pattern)

The delete UX must be **fast but protected** — users delete by accident. The pattern:
- Each exercise block header has a `<Trash2>` icon button (16px, `color: var(--on-surface-dim)`, far right of the header)
- Tapping it sets `confirmRemoveIdx = ei` — **the button morphs in-place** into a two-button inline confirm row ("Remove?" · [Cancel] [Remove])
- No separate modal. No sheet. Resolves in one tap.

**State already added in Task 3:** `confirmRemoveIdx`

**In the exercise block header JSX** (inside the `session.exs.map((ex, ei) => ...)` render):

```jsx
{/* Exercise block header */}
<div style={{
  display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
  marginBottom: 10,
}}>
  {/* Left: exercise name + subline */}
  <div style={{ flex: 1, minWidth: 0, paddingRight: 10 }}>
    <div style={{
      fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.04em',
      lineHeight: 1.1, color: 'var(--on-surface)',
      fontFamily: "'Space Grotesk', sans-serif",
    }}>
      {ex.name}
    </div>
    <div className="label-md" style={{ color: 'var(--on-surface-variant)', marginTop: 4 }}>
      {ex.muscle}{ex.focusType ? ` · ${ex.focusType}` : ''}
    </div>
  </div>

  {/* Right: swap + delete controls */}
  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>

    {/* ─── INLINE DELETE CONFIRM ─────────────── */}
    {confirmRemoveIdx === ei ? (
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6,
        background: 'rgba(255,59,48,0.08)', borderRadius: 10, padding: '6px 10px',
        animation: 'cascadeIn .2s var(--ease-decel) both',
      }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--error)',
          fontFamily: "'Space Grotesk', sans-serif", marginRight: 2 }}>
          Remove?
        </span>
        <button
          onClick={() => setConfirmRemoveIdx(null)}
          style={{
            background: 'var(--surface-container-highest)', border: 'none',
            borderRadius: 7, padding: '4px 10px', fontSize: 11, fontWeight: 700,
            color: 'var(--on-surface-variant)', cursor: 'pointer',
            fontFamily: "'Be Vietnam Pro', sans-serif",
          }}
        >
          Cancel
        </button>
        <button
          onClick={() => removeExercise(ei)}
          style={{
            background: 'var(--error, #FF3B30)', border: 'none',
            borderRadius: 7, padding: '4px 10px', fontSize: 11, fontWeight: 700,
            color: '#fff', cursor: 'pointer',
            fontFamily: "'Be Vietnam Pro', sans-serif",
          }}
        >
          Remove
        </button>
      </div>
    ) : (
      <>
        {/* ─── EXISTING SWAP BUTTON (keep as-is) ─ */}
        {/* ... existing swap icon button ... */}

        {/* ─── DELETE TRIGGER ─────────────────── */}
        <button
          onClick={() => setConfirmRemoveIdx(ei)}
          aria-label={`Remove ${ex.name}`}
          style={{
            background: 'transparent', border: 'none', cursor: 'pointer',
            padding: 6, borderRadius: 8,
            color: 'var(--on-surface-dim)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'color .15s, background .15s',
          }}
          onMouseOver={e => {
            e.currentTarget.style.color = 'var(--error, #FF3B30)';
            e.currentTarget.style.background = 'rgba(255,59,48,0.08)';
          }}
          onMouseOut={e => {
            e.currentTarget.style.color = 'var(--on-surface-dim)';
            e.currentTarget.style.background = 'transparent';
          }}
        >
          <Trash2 size={16} />
        </button>
      </>
    )}
  </div>
</div>
```

**Clear confirm state when navigating exercises:** add a `useEffect` that resets `confirmRemoveIdx` to `null` when `session?.exs?.length` changes (so a completed remove clears any stale state):
```js
useEffect(() => { setConfirmRemoveIdx(null); }, [session?.exs?.length]);
```

---

### TASK 7 — "+ Add Exercise" Button in Session

Add a full-width dashed call-to-action **after the last exercise block** and before the Finish Workout section. This opens the `AddExerciseSheet`.

```jsx
{/* After all exercise blocks, before the Finish section */}
<button
  className="add-set-btn"
  onClick={() => { setAddExSearch(''); setAddExCat('all'); setShowAddEx(true); }}
  style={{
    width: '100%', padding: '16px', marginTop: 8, marginBottom: 24,
    borderRadius: 14, border: '1.5px dashed var(--primary)',
    background: 'rgba(255,181,155,0.05)',
    fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, fontWeight: 700,
    letterSpacing: '0.12em', textTransform: 'uppercase',
    color: 'var(--primary)', cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    transition: 'all .2s var(--ease-smooth)',
  }}
  onMouseOver={e => {
    e.currentTarget.style.background = 'rgba(255,181,155,0.1)';
    e.currentTarget.style.boxShadow = '0 0 20px rgba(255,181,155,0.1)';
  }}
  onMouseOut={e => {
    e.currentTarget.style.background = 'rgba(255,181,155,0.05)';
    e.currentTarget.style.boxShadow = 'none';
  }}
>
  <Plus size={14} strokeWidth={2.5} />
  Add Exercise
</button>
```

**State needed:**
```js
const [showAddEx, setShowAddEx]   = useState(false);
const [addExSearch, setAddExSearch] = useState('');
const [addExCat, setAddExCat]     = useState('all');
```

---

### TASK 8 — New Imports

Add to the existing **React** import:
- `useCallback` — ⚠️ **not currently imported** but used by `addExercise` and `removeExercise`

Add to the existing **Lucide React** import:
- `Trash2` (for delete trigger)
- `Search` (for add exercise search input)
- `Plus` (for the add exercise button + ExercisePoolRow add icon)

`X` is already imported ✓. No change needed.

---

### TASK 9 — `index.css` Addition (minor)

The `sheetUp` keyframe may already exist. Verify — if not, add:

```css
@keyframes sheetUp {
  from { transform: translateY(100%); opacity: 0; }
  to   { transform: translateY(0);    opacity: 1; }
}
.sheet-up { animation: sheetUp .28s var(--ease-decel) both; }
```

Also add scroll-bar hiding for the category pill row:

```css
/* Used on the exercise category pill scrollbar in AddExerciseSheet */
.pills-scroll::-webkit-scrollbar { display: none; }
```

---

## 🎨 Stitch Design Reference

### Enhanced Prompt — Add Exercise Bottom Sheet

```markdown
Kinetic Elite — "Add Exercise" mid-workout bottom sheet panel for a premium Indian fitness app.

DESIGN SYSTEM (REQUIRED):
- Platform: Mobile-first, 390px viewport
- Background: Obsidian Canvas (#131315), surface-container-low (#1A1A1D) for sheet
- Primary: Ember Peach (#FFB59B) accent text, Burning Ember (#F85F1B) for CTAs
- Typography: Space Grotesk (headlines, labels), Be Vietnam Pro (body, descriptions)
- Atmosphere: Obsidian Performance — dark glassmorphism, warm ember glows, HUD feel

COMPONENT STRUCTURE:
1. Drag Handle: 40px × 4px pill, centered, frosted slate color, top of sheet
2. Sheet Header (non-scrollable):
   - Title: "Add Exercise" in Space Grotesk bold 18px, left-aligned
   - Subtitle: "47 exercises from your splits" in 11px on-surface-variant, below title
   - Close (X) icon button, 36×36 rounded square, top-right, surface-container-highest bg
3. Search Bar: Full-width pill input, surface-container-highest bg, Lucide Search icon 
   left-inset 14px, placeholder "Search exercises…", Be Vietnam Pro 14px
4. Muscle Category Pill Row: Horizontally scrollable. Active pill: ember gradient fill 
   + white text + subtle glow. Inactive: surface-container-highest + on-surface-variant text.
   Pills: "All", "Chest", "Back", "Shoulders", "Biceps", "Triceps", "Abs", "Quads", etc.
5. Grouped Exercise List (scrollable):
   - Section headers: 9px uppercase Space Grotesk, on-surface-dim, 10px top padding
   - Exercise rows: 14px height cards, surface-container bg, left: exercise name (700 weight)
     + below it muscle badge (9px accent color) + "3 × 8-12" reps label (10px)
   - Right: if not in session — 30×30 ember gradient rounded square with Plus icon
   - Right: if already in session — small "In Session" text in primary color
   - Row already added has 55% opacity, no hover effect
6. The sheet should feel like a premium command palette — fast, dark, precision-tool aesthetic
```

### Enhanced Prompt — Delete Exercise Inline Confirm

```markdown
Kinetic Elite — Inline exercise deletion confirm row inside an active workout card.

DESIGN SYSTEM: Same as parent workout screen (dark Obsidian Performance).

COMPONENT:
- Triggered by tapping a small Trash2 icon (16px, on-surface-dim color) in the 
  exercise block header, far right of the exercise name
- On tap: the trash icon area morphs (in-place via CSS animation) into a compact 
  inline confirm bar:
  * Background: rgba(255,59,48,0.08) — a subtle red tint pill
  * "Remove?" label: 11px Space Grotesk bold, var(--error) red color, left side
  * "Cancel" button: surface-container-highest bg, on-surface-variant text, 7px rounded
  * "Remove" button: var(--error) solid fill, white text, 7px rounded, same height
  * Entry animation: cascadeIn 0.2s — fades and slides in from right
- The confirm morphs within the same header row without pushing content down
- If user doesn't interact for 8 seconds, automatically resets to the trash icon 
  (auto-dismiss timeout for safety)
- The trash icon on hover: color shifts to var(--error), background gets the same 
  rgba(255,59,48,0.08) tint
```

---

## 📦 File Change Summary

| File | Change Type | What Changes |
|------|------------|--------------|
| `src/components/pages/WorkoutPage.jsx` | **Additive** | `exercisePool` + `poolCategories` useMemos, `addExercise()`, `removeExercise()`, `confirmRemoveIdx` state, `showAddEx` + `addExSearch` + `addExCat` state, `ExercisePoolRow` sub-component, `AddExerciseSheet` JSX, "+ Add Exercise" button, inline delete confirm in exercise block header, 4 new Lucide icon imports |
| `src/index.css` | **Additive (minor)** | `sheetUp` keyframe (if not present), `.pills-scroll::-webkit-scrollbar` rule |

**Files NOT touched:** `AppContext.jsx`, `muscleData.js`, `splits.js`, `SharedComponents.jsx`, any other page component

---

## ✅ Implementation Checklist

### New State & Functions
- [ ] Add `showAddEx`, `addExSearch`, `addExCat` state (useState)
- [ ] Add `confirmRemoveIdx` state (useState, null)
- [ ] Add `exercisePool` useMemo — deduplicated exercises from all splits
- [ ] Add `poolCategories` useMemo — unique primary muscle keys in display order
- [ ] Add `addExercise(ex)` useCallback
- [ ] Add `removeExercise(ei)` useCallback
- [ ] Add `useEffect` to reset `confirmRemoveIdx` on `session.exs.length` change
- [ ] Add auto-dismiss timeout for confirm state (8s useEffect)

### New Sub-components (in WorkoutPage.jsx)
- [ ] Define `MUSCLE_LABEL_MAP` constant (above component)
- [ ] Define `MUSCLE_COLOR_MAP` constant (above component)
- [ ] Define `MUSCLE_DISPLAY_ORDER` constant (above component)
- [ ] Define `ExercisePoolRow` function component (above component)

### JSX Changes
- [ ] Add delete button (`Trash2`) to each exercise block header
- [ ] Add inline confirm row (`confirmRemoveIdx === ei`) to each exercise block header
- [ ] Add "+ Add Exercise" full-width dashed button after last exercise block
- [ ] Add `AddExerciseSheet` JSX (backdrop + sheet panel) at end of session JSX tree
- [ ] Sheet includes: drag handle, header, close button, search bar, category pills, grouped exercise list

### Import Updates
- [ ] Add `Trash2` to Lucide imports
- [ ] Add `Search` to Lucide imports (if not already present)
- [ ] Add `Plus` to Lucide imports (if not already present)
- [ ] Verify `X` is in Lucide imports

### CSS
- [ ] Verify `sheetUp` keyframe exists in `index.css` — add if missing
- [ ] Add category pills scrollbar hide rule

### QA
- [ ] Adding an exercise appends it to the bottom of the session list with empty sets (reps: '', weight: '')
- [ ] The number of default sets matches `ex.sets` from the split definition
- [ ] "In Session" indicator appears on exercises already in the current session
- [ ] Exercises already in the session cannot be added again (no duplicate)
- [ ] Category filter pills correctly filter the exercise list
- [ ] Search works across exercise name AND muscle name
- [ ] "All" view groups exercises by body part with section headers
- [ ] Category view shows a flat list with no section headers
- [ ] Tapping backdrop closes the sheet
- [ ] Tapping X button closes the sheet
- [ ] Delete icon appears on every exercise block header during an active session
- [ ] Tapping delete shows the inline confirm, NOT a full modal
- [ ] "Cancel" dismisses the confirm, restores the trash icon
- [ ] "Remove" removes the exercise from `session.exs` and closes the confirm
- [ ] Auto-dismiss timeout (8s) resets confirm state without removing the exercise
- [ ] Completing a removal resets `confirmRemoveIdx` to null
- [ ] Removing the last exercise leaves an empty session (user can still finish or add more)
- [ ] Sheet opens and closes with `sheetUp` animation
- [ ] Both dark and light themes render correctly (all CSS tokens, no hardcoded dark values)
- [ ] Mobile responsive — sheet is `88dvh` max, does not extend behind keyboard
- [ ] `exercisePool` correctly deduplicates exercises with the same name from different splits
- [ ] `exercisePool` does NOT depend on `session` (no `if (!session)` guard, no `session` in deps)

### ⚠️ Review Corrections (discovered during architectural review)
- [ ] `addExercise` uses `gId()` for `id` (not `ex.id || ex.name`) — prevents React key collisions
- [ ] `addExercise` includes `exerciseId` from pool entry — enables swap functionality
- [ ] `addExercise` includes `targetRep` on each set — enables target reps hint in UI
- [ ] `removeExercise` adjusts `restTimerPosition` — clears if on deleted exercise, shifts if after
- [ ] `removeExercise` has `[restTimerPosition]` in `useCallback` deps
- [ ] `alreadyAdded` check also matches `_originalName` and `originalName` (swapped exercises)
- [ ] AddExerciseSheet wrapped in `<Portal>` (matches swap modal pattern)
- [ ] FAB hidden or z-index adjusted when `showAddEx` is true
- [ ] `useCallback` added to React imports
- [ ] Auto-dismiss `useEffect` for `confirmRemoveIdx` (8s timeout) — see Implementation Notes for code

---

## 🚫 Out of Scope

- Custom exercise (free-text, not from splits) — deferred to a follow-up task. The sheet has room for a "Can't find it? Add custom +" link row at the bottom.
- Reordering exercises mid-session (drag-and-drop) — deferred.
- Undo/restore a deleted exercise — deferred.
- Filtering exercises by equipment (barbell / dumbbell / cable) — deferred (data model needs `equipment` field on split exercises first).
- Persisting the add/delete to the cloud mid-session — the session is already in-memory; the cloud sync happens only on `finish()`.

---

## 🗒️ Implementation Notes

- **Exercise block header structure** (from codebase): Outer flex with `justifyContent: 'space-between'`. Left side = name + swap button (nested flex) + variant dropdown + muscle label. Right side = info button (inline SVG circle-i, 44×44). Place the trash icon **between the swap button and the info button**, or replace the info button.
- **`addExercise` resets the sheet search:** On `setShowAddEx(false)`, the search and category state can be reset via the opening handler: `onClick={() => { setAddExSearch(''); setAddExCat('all'); setShowAddEx(true); }}` — this ensures a fresh state each time.
- **`exercisePool` deduplication:** The `seen` Set uses `ex.name` as the key. If two splits have the same exercise name with slightly different `sets`/`repsRange`, the first occurrence wins. Note: `EXERCISE_LIBRARY` (already imported on line 13) does similar deduplication from `INIT_SPLITS` via `exerciseId` — consider merging both sources for maximum coverage (user-custom splits + predefined splits).
- **Font for the sheet header** uses `Space Grotesk` inline — consistent with all exercise block headers across the app.
- **Light theme:** All backgrounds reference CSS tokens (`var(--surface-container)`, `var(--surface-container-highest)`) so the sheet is fully theme-aware. The muscle color map values (teal, coral, sky blue etc.) are vibrant enough to show on both dark and light themes.
- **`confirmRemoveIdx` auto-dismiss** — concrete code:
  ```js
  useEffect(() => {
    if (confirmRemoveIdx === null) return;
    const timer = setTimeout(() => setConfirmRemoveIdx(null), 8000);
    return () => clearTimeout(timer);
  }, [confirmRemoveIdx]);
  ```
- **Z-index layering** (actual values from codebase):
  | Layer | z-index | Component |
  |-------|---------|----------|
  | Bottom nav | ~100 | App shell |
  | Swap modal | 500 | `ExerciseSwapModal` via `<Portal>` |
  | **Add sheet** | **900/901** | New — ⚠️ wrap in `<Portal>` |
  | FAB (Finish + Live) | **9998** | Via `<Portal>` — **will overlap sheet bottom** |
  
  **Fix:** Hide the FAB when `showAddEx` is true, or set the sheet z-index to `10000+`.
- **`exercisePool` dependency fix:** Remove `session` from the useMemo deps — the pool is derived only from `splits`. With `session` in the dep array, the pool recomputes on every keystroke (each `upd()` call creates a new `session` object). Also remove the `if (!session) return []` guard to avoid stale empty arrays.
- **`<Portal>` for the sheet:** The swap modal already uses `<Portal>` (imported from `SharedComponents`). The AddExerciseSheet should do the same to avoid overflow clipping from the scrollable session container.
- **Rest timer and delete (🔴 critical):** `restTimerPosition` stores `{ ei, si }` (exercise index, set index). Deleting exercise at index N shifts all exercises after it. The corrected `removeExercise` in Task 3 handles this by adjusting or clearing the timer position. Also persists the shifted position to `REST_TIMER_POS_KEY` in localStorage.
- **Session persistence:** `persistActiveSession` serializes the full `session` object (including `exs`) to localStorage on every session change. Newly added exercises are automatically persisted via the existing `useEffect`. No additional work needed.
- **`prMap` useMemo:** Uses name-based lookup (`ex.sv || ex.name`), not indices. Safe with add/delete — recomputes automatically since `session?.exs` is a dependency.
- **`doFinish` compatibility:** Maps exercises by value (not index), filters out exercises with zero completed sets. Added-then-never-touched exercises are silently excluded from the log. No index references — fully safe.
