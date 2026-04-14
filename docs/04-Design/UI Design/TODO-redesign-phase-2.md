# FitTrack Pro — TODO: Workout History Page Overhaul
> **Phase:** 2 · **Created:** 2026-03-31
> **Reference design:** Stitch-generated `WorkoutHistoryPage` HTML (Kinetic Elite system)
> **Effort:** 🟡 Medium · **Impact:** High — most-visited post-workout page
> **Files affected:** `WorkoutHistoryPage.jsx` (rewrite), `WorkoutPage.jsx` (2-line additive)

---

## 🎯 Goal

Replace the current `WorkoutHistoryPage.jsx` (plain collapsible cards showing day name,
date, exercise count, and set details) with the editorial Kinetic Elite design:
bento stats header, hover-accent session cards with per-session volume/duration/muscle tags,
and an expanded detail section.

---

## ⚠️ Pre-conditions — Codebase Reality Check

### 1. Design Tokens — Already Migrated ✅

The Phase 1 token migration is **done**. `index.css` already defines:
- All 5-tier surface tokens (`--surface` through `--surface-container-highest`)
- `--primary: #FFB59B`, `--primary-container: #F85F1B`, `--signature-gradient`
- `--on-surface`, `--on-surface-variant`, `--on-surface-dim`
- `--glass-bg`, `--glass-blur`, `--glow-primary`, `--shadow-ambient`
- `--outline-variant: rgba(90,65,56,0.15)`
- Light theme warm beige palette
- All easing tokens (`--ease-spring`, `--ease-smooth`, etc.)

**No new tokens needed for this page.**

### 2. Fonts — Already Imported ✅

`index.css` line 15 already imports `Space Grotesk` (500, 700) and `Be Vietnam Pro` (400–700).
`Bebas Neue` and `DM Sans` are **already removed** from the codebase.

**No font changes needed.**

### 3. Typography Classes — Already Defined ✅

`index.css` already defines: `.display-lg`, `.headline-lg`, `.headline-md`, `.title-lg`,
`.title-md`, `.body-md`, `.label-md` — all with correct Kinetic Elite specs including
`clamp()` scaling and `-0.04em` tracking.

**No new typography classes needed.** The TODO's proposed `.font-headline` / `.font-body`
helper classes don't exist and aren't needed — just use inline `fontFamily` where needed
(the same pattern every other page uses).

### 4. Material Symbols — DO NOT ADD ❌

The TODO proposed adding Google Material Symbols Outlined as an icon font. The codebase
uses **Lucide React** exclusively for icons — no other icon system is used anywhere.
Adding a second icon font is unnecessary weight and inconsistency.

**Use Lucide icons instead:**
- `monitoring` → `<Activity />` or `<TrendingUp />` from lucide-react
- `timer` → `<Timer />` from lucide-react
- `fitness_center` → `<Dumbbell />` from lucide-react

### 5. PageHeader + ThemeTogglePill — Keep As-Is ✅

The current page uses `<PageHeader title="Workout History" sub={...} />` which
includes the `ThemeTogglePill` (day/night toggle). The TODO's proposed editorial header
**drops PageHeader entirely**, losing the theme toggle.

**Fix:** Keep `PageHeader` as-is. Add the ghost watermark and subtitle within the
existing header pattern, or render the editorial header **below** PageHeader.
The user explicitly said: keep day/night toggle as-is.

### 6. Data Model — Duration Tracking Needed

The current `WorkoutPage.jsx` `start()` (line 95) creates sessions without `startTime`:
```js
setSession({ day, exs, notes: '' });
```

And `finish()` (line 112–115) creates log objects without duration:
```js
const log = {
  id: gId(), userId: user.id, splitId: activeSplit.id, dayId: session.day.id,
  dayName: session.day.name, date: tod(), notes: session.notes,
  exercises: ...
};
```

**Both need a 1-line addition each.** Existing logs without `durationMinutes`
will show `—` in duration — no migration needed.

### 7. Muscle Tag Logic — `getSessionMuscles` Fix

The TODO's proposed `getSessionMuscles` helper uses `getMusclesForExercise(exMuscleMap[ex.name])`.
This is correct — `getMusclesForExercise` is exported from `muscleData.js` (line 39) and
takes a display-name string like `"Chest"` and returns an array of canonical keys like
`['chest']`.

However, there's a subtlety: workout log exercises store names like `"Bench Press"`,
not muscle fields. The `exMuscleMap` is built from splits (`ex.name → ex.muscle`), so
a logged exercise `"Bench Press"` maps to `"Chest"`, which then maps to `['chest']`.
This works **only if the exercise name appears in at least one split**. Exercises from
deleted/changed splits will show no muscle tags — acceptable.

Also: `MUSCLE_GROUPS` items have a `.label` field (e.g., `"Chest"`, `"Hamstrings"`),
and `.key` (e.g., `"chest"`, `"hamstrings"`). The TODO correctly maps keys back to
labels for display.

### 8. Existing State Variables in WorkoutHistoryPage

The current component has these state/computed values that must be preserved:
- `search` (useState)
- `filterSplit` (useState)
- `expandId` (useState)
- `confirm` (useState — for ConfirmDialog)
- `userLogs` (useMemo — filtered + sorted logs)
- `deleteLog()` function

All imports: `useState, useMemo` from React; `Clock, Trash2, ChevronDown, Search`
from lucide-react; `useApp` from context; `PageHeader, EmptyState, ConfirmDialog`
from SharedComponents; `fmt` from helpers.

---

## 📋 Implementation Tasks

### TASK 1 — `WorkoutPage.jsx`: Add duration tracking
**File:** `src/components/pages/WorkoutPage.jsx`

**Change A — `start()` function (line 95):**
```js
// BEFORE
setSession({ day, exs, notes: '' }); setDone(null);

// AFTER
setSession({ day, exs, notes: '', startTime: Date.now() }); setDone(null);
```

**Change B — `finish()` function (lines 112–115):**
```js
// BEFORE
const log = {
  id: gId(), userId: user.id, splitId: activeSplit.id, dayId: session.day.id,
  dayName: session.day.name, date: tod(), notes: session.notes,
  exercises: session.exs.map(ex => ({ ... })).filter(ex => ex.sets.length > 0),
};

// AFTER — add durationMinutes
const log = {
  id: gId(), userId: user.id, splitId: activeSplit.id, dayId: session.day.id,
  dayName: session.day.name, date: tod(), notes: session.notes,
  durationMinutes: session.startTime
    ? Math.round((Date.now() - session.startTime) / 60000)
    : null,
  exercises: session.exs.map(ex => ({ ... })).filter(ex => ex.sets.length > 0),
};
```

---

### TASK 2 — `WorkoutHistoryPage.jsx`: Full redesign
**File:** `src/components/pages/WorkoutHistoryPage.jsx`
**Scope:** Full rewrite of component internals. Keep all existing state/logic,
add helpers + bento stats + new JSX.

#### 2a — Updated imports

```js
import { useState, useMemo } from 'react';
import { Clock, Trash2, ChevronDown, Search, Activity, Timer, Dumbbell } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PageHeader, EmptyState, ConfirmDialog } from '../shared/SharedComponents';
import { fmt } from '../../utils/helpers';
import { getMusclesForExercise, MUSCLE_GROUPS } from '../../data/muscleData';
```

#### 2b — Helper functions (inside component, before return)

```js
// Format duration from durationMinutes
const fmtDuration = (mins) => {
  if (!mins) return '—';
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
};

// Compute total volume (reps × weight) for a session
const calcVolume = (exercises) => {
  if (!exercises?.length) return 0;
  return exercises.reduce((total, ex) =>
    total + ex.sets.reduce((s, set) => s + (set.reps || 0) * (set.weight || 0), 0), 0
  );
};

// Get muscle group labels for a session
const getSessionMuscles = (exercises) => {
  const muscles = new Set();
  exercises?.forEach(ex => {
    const muscleField = exMuscleMap[ex.name];
    if (muscleField) {
      getMusclesForExercise(muscleField).forEach(m => muscles.add(m));
    }
  });
  return [...muscles].slice(0, 3).map(key =>
    MUSCLE_GROUPS.find(mg => mg.key === key)?.label || key
  );
};
```

#### 2c — New computed values (after existing `userLogs` useMemo)

```js
// Build exercise name → muscle field lookup from splits
const exMuscleMap = useMemo(() => {
  const map = {};
  splits.forEach(split => split.days?.forEach(day =>
    day.exercises?.forEach(ex => {
      if (ex.name && ex.muscle) map[ex.name] = ex.muscle;
    })
  ));
  return map;
}, [splits]);

// Monthly aggregate stats for the bento header
const monthlyStats = useMemo(() => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthLogs = userLogs.filter(l => new Date(l.date) >= startOfMonth);

  const volume = monthLogs.reduce((t, l) => t + calcVolume(l.exercises), 0);
  const timeHrs = monthLogs.reduce((t, l) => t + (l.durationMinutes || 0), 0) / 60;

  return {
    volumeTons: (volume / 1000).toFixed(1),
    timeHrs: timeHrs.toFixed(1),
    sessions: monthLogs.length,
  };
}, [userLogs]);
```

**NOTE:** `monthlyStats` depends on `calcVolume` which is defined as a plain function
(not a hook). `calcVolume` must be defined *before* `monthlyStats` — either as a
function declaration (hoisted) or placed above the useMemo. Safest: define `calcVolume`
outside the component as a module-level utility, or use a function declaration.

#### 2d — JSX structure

Keep `PageHeader` at top. Add editorial elements below it.

```jsx
return (
  <div className="pg-in">
    {/* Keep existing PageHeader with ThemeTogglePill */}
    <PageHeader title="Workout History" sub={`${userLogs.length} sessions logged`} />

    {/* ── BENTO STATS GRID ─────────────────────────────── */}
    <section style={{
      display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 28,
    }} className="g3">
      {[
        { Icon: Activity, label: 'Monthly Volume', value: monthlyStats.volumeTons, unit: 'tons' },
        { Icon: Timer,    label: 'Time Active',    value: monthlyStats.timeHrs,    unit: 'hrs'  },
        { Icon: Dumbbell, label: 'Sessions',       value: monthlyStats.sessions,   unit: 'this month' },
      ].map(stat => (
        <div key={stat.label} className="glass-card" style={{
          padding: '20px 18px', borderRadius: 16, border: 'none',
          position: 'relative', overflow: 'hidden',
        }}>
          {/* Ghost icon watermark */}
          <stat.Icon size={44} style={{
            position: 'absolute', top: 10, right: 12,
            color: 'var(--on-surface)', opacity: 0.06, pointerEvents: 'none',
          }} />
          <div className="label-md" style={{
            color: 'var(--on-surface-variant)', marginBottom: 8,
          }}>
            {stat.label}
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
            <span className="display-lg" style={{ color: 'var(--primary)' }}>
              {stat.value}
            </span>
            <span style={{ fontSize: 11, color: 'var(--on-surface-dim)' }}>
              {stat.unit}
            </span>
          </div>
        </div>
      ))}
    </section>

    {/* ── FILTERS ───────────────────────────────────────── */}
    <div style={{
      display: 'grid', gridTemplateColumns: 'minmax(200px, 1fr) auto',
      gap: 12, marginBottom: 24,
    }}>
      <div style={{ position: 'relative' }}>
        <Search size={16} color="var(--on-surface-dim)" style={{
          position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)',
        }} />
        <input
          placeholder="Search exercises or days..."
          value={search} onChange={e => setSearch(e.target.value)}
          style={{
            width: '100%', padding: '12px 16px 12px 42px',
            background: 'var(--surface-container-highest)',
            border: 'none', borderRadius: 12,
            color: 'var(--on-surface)', fontWeight: 600, fontSize: 14,
          }}
        />
      </div>
      <select
        value={filterSplit} onChange={e => setFilterSplit(e.target.value)}
        style={{
          padding: '12px 16px',
          background: 'var(--surface-container-highest)',
          border: 'none', borderRadius: 12,
          color: 'var(--on-surface)', fontWeight: 600, fontSize: 14,
        }}
      >
        <option value="">All Splits</option>
        {splits.filter(s => !s.comingSoon).map(s =>
          <option key={s.id} value={s.id}>{s.name}</option>
        )}
      </select>
    </div>

    {/* ── SESSION CARDS ──────────────────────────────────── */}
    {userLogs.length === 0 ? (
      <EmptyState Icon={Clock} title="No Workout History"
        message="Start logging workouts to see your history here" />
    ) : (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {userLogs.map(log => {
          const vol = calcVolume(log.exercises);
          const muscles = getSessionMuscles(log.exercises);
          const isExpanded = expandId === log.id;

          return (
            <div key={log.id} className="card" style={{
              overflow: 'hidden', border: 'none',
              background: 'var(--surface-container-low)',
              borderLeft: isExpanded ? '3px solid var(--primary-container)' : '3px solid transparent',
              transition: 'all .2s var(--ease-smooth)',
            }}>
              {/* Clickable header */}
              <div style={{
                padding: '18px 20px', cursor: 'pointer',
                transition: 'background .2s var(--ease-smooth)',
              }}
                onClick={() => setExpandId(isExpanded ? null : log.id)}
                onMouseOver={e => e.currentTarget.style.background = 'var(--surface-container)'}
                onMouseOut={e => e.currentTarget.style.background = 'transparent'}
              >
                {/* Top row: date + day name + icon */}
                <div style={{
                  display: 'flex', justifyContent: 'space-between',
                  alignItems: 'flex-start', marginBottom: 14,
                }}>
                  <div>
                    <div className="label-md" style={{
                      color: 'var(--primary)', marginBottom: 4,
                    }}>
                      {fmt(log.date)}
                    </div>
                    <div style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontSize: '1.1rem', fontWeight: 700, letterSpacing: '-0.02em',
                      textTransform: 'uppercase', color: 'var(--on-surface)',
                    }}>
                      {log.dayName}
                    </div>
                  </div>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                  }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 10,
                      background: 'rgba(248,95,27,0.1)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Dumbbell size={18} color="var(--primary)" />
                    </div>
                    <ChevronDown size={16} color="var(--on-surface-dim)" style={{
                      transform: isExpanded ? 'rotate(180deg)' : '',
                      transition: '.2s',
                    }} />
                  </div>
                </div>

                {/* Stats row */}
                <div style={{ display: 'flex', gap: 24, marginBottom: muscles.length > 0 ? 14 : 0 }}>
                  {[
                    { label: 'Volume',    value: vol >= 1000 ? `${(vol/1000).toFixed(1)}k` : `${vol}`, unit: 'kg' },
                    { label: 'Duration',  value: fmtDuration(log.durationMinutes), unit: '' },
                    { label: 'Exercises', value: `${log.exercises?.length || 0}`, unit: '' },
                    { label: 'Sets',      value: `${log.exercises?.reduce((s, e) => s + e.sets.length, 0) || 0}`, unit: '' },
                  ].map(s => (
                    <div key={s.label}>
                      <div className="label-md" style={{
                        color: 'var(--on-surface-variant)', marginBottom: 2,
                      }}>
                        {s.label}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: 3 }}>
                        <span style={{
                          fontFamily: "'Space Grotesk', sans-serif",
                          fontSize: '1.1rem', fontWeight: 700,
                          color: 'var(--on-surface)',
                        }}>{s.value}</span>
                        {s.unit && <span style={{
                          fontSize: 10, color: 'var(--on-surface-dim)',
                        }}>{s.unit}</span>}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Muscle group tags */}
                {muscles.length > 0 && (
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {muscles.map(m => (
                      <span key={m} style={{
                        padding: '3px 10px', borderRadius: 20,
                        background: 'var(--surface-container-highest)',
                        fontSize: 10, fontWeight: 600, letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        color: 'var(--on-surface-variant)',
                        fontFamily: "'Be Vietnam Pro', sans-serif",
                      }}>{m}</span>
                    ))}
                  </div>
                )}
              </div>

              {/* Expanded detail */}
              {isExpanded && (
                <div style={{
                  padding: '0 20px 20px 20px',
                  borderTop: '1px solid var(--outline-variant)',
                }}>
                  <div style={{ paddingTop: 16 }}>
                    {log.exercises?.map((ex, i) => (
                      <div key={i} style={{ marginBottom: 14 }}>
                        <div style={{
                          fontWeight: 600, fontSize: 13, marginBottom: 6,
                          color: 'var(--primary)',
                        }}>
                          {ex.name}
                        </div>
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                          {ex.sets.map((s, j) => (
                            <span key={j} style={{
                              padding: '4px 10px',
                              background: 'var(--surface-container-highest)',
                              borderRadius: 8, fontSize: 12, fontWeight: 600,
                              color: 'var(--on-surface)',
                            }}>
                              {s.reps}r × {s.weight}kg
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                    {log.notes && (
                      <div style={{
                        fontSize: 12, color: 'var(--on-surface-variant)',
                        fontStyle: 'italic', marginTop: 8, padding: '12px',
                        background: 'var(--surface-container-lowest)',
                        borderRadius: 8,
                      }}>
                        {log.notes}
                      </div>
                    )}
                    <button className="btn-d" style={{
                      marginTop: 16, display: 'flex', alignItems: 'center', gap: 6,
                      fontSize: 12, padding: '8px 12px', borderRadius: 8,
                      color: 'var(--error)', borderColor: 'rgba(255,59,48,0.3)',
                    }} onClick={e => { e.stopPropagation(); deleteLog(log.id); }}>
                      <Trash2 size={12} /> Delete Session
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    )}

    <ConfirmDialog open={!!confirm} title={confirm?.title} message={confirm?.message}
      onConfirm={confirm?.onConfirm} onCancel={() => setConfirm(null)}
      confirmLabel={confirm?.confirmLabel} danger={confirm?.danger} />
  </div>
);
```

---

## 📦 File Change Summary

| File | Change Type | What Changes |
|------|------------|--------------|
| `src/components/pages/WorkoutPage.jsx` | **Additive (2 lines)** | `startTime` on session object, `durationMinutes` on log object |
| `src/components/pages/WorkoutHistoryPage.jsx` | **Rewrite** | New imports, 3 helper functions, 2 new useMemos, full JSX redesign |

**Files NOT touched** (corrected from original TODO):
- `src/index.css` — all tokens, fonts, classes already exist
- `index.html` — no Material Symbols needed

---

## ✅ Implementation Checklist

### WorkoutPage.jsx
- [ ] Add `startTime: Date.now()` in `start()` (line 95)
- [ ] Add `durationMinutes` in `finish()` log object (line 112–115)

### WorkoutHistoryPage.jsx
- [ ] Add `Activity, Timer, Dumbbell` to lucide-react import
- [ ] Add `getMusclesForExercise, MUSCLE_GROUPS` import from muscleData
- [ ] Define `calcVolume()` as module-level helper (above component)
- [ ] Add `exMuscleMap` useMemo inside component
- [ ] Add `fmtDuration()` function inside component
- [ ] Add `getSessionMuscles()` function inside component (depends on `exMuscleMap`)
- [ ] Add `monthlyStats` useMemo inside component (depends on `calcVolume`)
- [ ] Replace full return block with new JSX
- [ ] Keep `PageHeader` with `ThemeTogglePill` (day/night toggle stays as-is)
- [ ] Verify `expandId` accordion still works
- [ ] Verify `deleteLog` + `ConfirmDialog` flow still works
- [ ] Verify search + filterSplit still narrows `userLogs`

### QA
- [ ] Existing sessions (without `durationMinutes`) show `—` in Duration — not a crash
- [ ] Sessions with 0 volume (bodyweight only) show `0 kg` — not undefined
- [ ] Filter + search still narrows the list correctly
- [ ] Delete confirm dialog still fires and removes entry
- [ ] Expand/collapse of exercise detail works (left accent stripe appears on expanded)
- [ ] New session logged from WorkoutPage has `durationMinutes` populated
- [ ] Both dark and light themes render correctly
- [ ] Bento grid collapses to 1-column on mobile (`.g3` class handles this via `index.css` media query)
- [ ] `monthlyStats` shows `0.0 tons / 0.0 hrs / 0` when no sessions this month — not NaN
- [ ] Muscle tags show correctly for exercises that exist in current splits
- [ ] Exercises from deleted splits show no muscle tags (acceptable, not a crash)

---

## 🚫 Out of Scope

- Adding new CSS tokens or font imports (already done in Phase 1)
- Adding Material Symbols or any new icon library
- Pagination / infinite scroll (cosmetic "Load More" deferred)
- Session time-of-day display
- Changing PageHeader or ThemeTogglePill behaviour

---

## 🗒️Implementation Notes

- Use inline `fontFamily: "'Space Grotesk', sans-serif"` for headline-style text in cards (same pattern as DashboardPage, WorkoutPage)
- Use existing `.glass-card`, `.card`, `.label-md`, `.display-lg` classes — they're already in `index.css`
- Use `var(--error)` for the delete button color (token exists: `#FF3B30`)
- `calcVolume` should be defined at module level (outside the component) so it can be used inside `monthlyStats` useMemo without dependency issues
- The left accent stripe on expanded cards uses `borderLeft` directly on the `.card` div rather than a separate positioned element (cleaner, no `previousSibling` DOM traversal)
- The stats row includes "Sets" as a 4th column — the current page already shows set count in a chip; this preserves that data point
- Use `fmt()` from helpers for date formatting (already imported) — same format used across the app