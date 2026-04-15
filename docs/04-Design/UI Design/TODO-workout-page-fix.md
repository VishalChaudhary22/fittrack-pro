# FitTrack Pro — Workout Page: Timer & Session Persistence Fixes

> **Created:** 2026-04-16 · **Scope:** WorkoutPage.jsx + AppContext.jsx + supporting utilities
> **Design system:** Kinetic Elite (Space Grotesk / Be Vietnam Pro, Ember Peach `#FFB59B` / `#F85F1B`, dark surface tokens)

---

## Overview

Four interrelated bugs and feature gaps on the Workout Page. All four touch the rest timer and session persistence systems. Implement in the order listed — each phase builds on the previous.

---

## 🔴 Fix 1 — Rest Timer: Vibration + Chime on Completion

**Problem:** When the `HeroRestTimer` counts down to zero, nothing happens audibly or haptically. Users frequently miss the rest-complete signal and either rest too long or glance at the screen constantly.

### Implementation

**File:** `src/components/pages/WorkoutPage.jsx`

**Audio — Web Audio API chime (no external file needed):**

```js
// Place outside component, module-level
function playRestCompleteChime() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    
    // Three-note ascending chime: C5 → E5 → G5
    const notes = [523.25, 659.25, 783.99];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.value = freq;
      const t = ctx.currentTime + i * 0.18;
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.35, t + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.55);
      osc.start(t);
      osc.stop(t + 0.55);
    });
  } catch (e) {
    // AudioContext blocked (e.g. no user gesture yet) — fail silently
  }
}
```

**Haptic — Vibration API:**

```js
function vibrateRestComplete() {
  if ('vibrate' in navigator) {
    // Two short pulses: 200ms on, 100ms off, 200ms on
    navigator.vibrate([200, 100, 200]);
  }
}
```

**Trigger location:** Inside the `useEffect` that drives the countdown, fire both when `restSecondsLeft` transitions from `1` → `0`:

```js
useEffect(() => {
  if (!restActive || !restEndsAt) return;

  const interval = setInterval(() => {
    const remaining = Math.max(0, restEndsAt - Date.now());
    setRestSecondsLeft(Math.ceil(remaining / 1000));
    if (remaining <= 0) {
      clearInterval(interval);
      localStorage.removeItem(REST_TIMER_KEY);
      setRestActive(false);
      playRestCompleteChime();
      vibrateRestComplete();
    }
  }, 250);

  return () => clearInterval(interval);
}, [restActive, restEndsAt]);
```

**Notes:**
- Web Audio API requires a prior user gesture (button tap) to unlock the AudioContext on iOS/Android Chrome. Since the rest timer is always started by a user tap, this is already satisfied.
- No external `.mp3` or `.wav` file needed — synthesized tones are instant and offline-safe.
- Do NOT play the chime if the user manually skips the timer (Skip button). Only fire on natural countdown completion.

---

## 🟠 Fix 2 — Rest Timer Duration: Persist User's Choice

**Problem:** When the user changes the rest timer length (e.g. from the default to 3 minutes), it resets to the default on the next set or session. The user has to re-select their preferred rest length every workout.

### Implementation

**Persistence key:** `fittrack_restTimerDuration` in `localStorage` (no Supabase sync needed — this is a local device preference, not a fitness record).

**File:** `src/components/pages/WorkoutPage.jsx`

```js
// On mount — read saved preference
const DEFAULT_REST = 90; // seconds
const [restDuration, setRestDuration] = useState(() => {
  const saved = localStorage.getItem('fittrack_restTimerDuration');
  return saved ? parseInt(saved, 10) : DEFAULT_REST;
});

// On change — write to localStorage
function handleRestDurationChange(newSeconds) {
  setRestDuration(newSeconds);
  localStorage.setItem('fittrack_restTimerDuration', String(newSeconds));
}
```

**Apply:** When starting the rest timer (after logging a set), use `restDuration` instead of any hardcoded constant:

```js
function startRestTimer() {
  const endsAt = Date.now() + restDuration * 1000;
  localStorage.setItem(REST_TIMER_KEY, String(endsAt));
  setRestEndsAt(endsAt);
  setRestActive(true);
}
```

**Preset options (keep existing):** 30s · 60s · 90s · 2 min · 3 min · 5 min

**UX note:** No toast or confirmation needed — the persistence is silent. The selector simply remembers its last position across sessions.

---

## 🟡 Fix 3 — Rest Timer: Survives App Backgrounding & Tab Switches

**Problem:** The `HeroRestTimer` countdown pauses or resets when:
- Chrome is minimized to the background
- The user switches to another tab
- The user navigates to another page within the app (e.g. Diet page) and returns

**Root cause:** `setInterval`/`setTimeout`-based countdowns are throttled or killed by browsers when a tab is backgrounded. React state is also lost on page navigation if the session lives only in component state.

### Implementation

**Strategy:** Replace the tick-based countdown with an **absolute-timestamp approach**. Store `restEndsAt` (a Unix timestamp in ms) rather than a decrementing counter. On each render/tick, compute `remaining = restEndsAt - Date.now()`. This is immune to background throttling because it only requires knowing the end time, not counting every tick.

**Files:** `src/components/pages/WorkoutPage.jsx`

#### Step 1 — Store rest timer end-time in localStorage

```js
const REST_TIMER_KEY = 'fittrack_activeRestTimer';

function startRestTimer() {
  const endsAt = Date.now() + restDuration * 1000;
  localStorage.setItem(REST_TIMER_KEY, String(endsAt));
  setRestEndsAt(endsAt);
  setRestActive(true);
}

function cancelRestTimer() {
  localStorage.removeItem(REST_TIMER_KEY);
  setRestActive(false);
  setRestEndsAt(null);
}
```

#### Step 2 — On mount, restore active timer if present

```js
const [restEndsAt, setRestEndsAt] = useState(null);
const [restActive, setRestActive] = useState(false);

useEffect(() => {
  const saved = localStorage.getItem(REST_TIMER_KEY);
  if (saved) {
    const endsAt = parseInt(saved, 10);
    if (endsAt > Date.now()) {
      setRestEndsAt(endsAt);
      setRestActive(true);
    } else {
      // Already expired while backgrounded — clear and fire completion
      localStorage.removeItem(REST_TIMER_KEY);
      playRestCompleteChime();
      vibrateRestComplete();
    }
  }
}, []);
```

#### Step 3 — Tick using 250ms interval (immune to 1s throttling)

```js
useEffect(() => {
  if (!restActive || !restEndsAt) return;

  const interval = setInterval(() => {
    const remaining = Math.max(0, restEndsAt - Date.now());
    setRestSecondsLeft(Math.ceil(remaining / 1000));
    if (remaining <= 0) {
      clearInterval(interval);
      localStorage.removeItem(REST_TIMER_KEY);
      setRestActive(false);
      playRestCompleteChime();
      vibrateRestComplete();
    }
  }, 250);

  return () => clearInterval(interval);
}, [restActive, restEndsAt]);
```

#### Step 4 — Page visibility handler (chime on tab refocus if expired)

```js
useEffect(() => {
  function onVisibilityChange() {
    if (document.visibilityState === 'visible') {
      const saved = localStorage.getItem(REST_TIMER_KEY);
      if (saved) {
        const endsAt = parseInt(saved, 10);
        if (endsAt <= Date.now()) {
          localStorage.removeItem(REST_TIMER_KEY);
          setRestActive(false);
          playRestCompleteChime();
          vibrateRestComplete();
        }
      }
    }
  }
  document.addEventListener('visibilitychange', onVisibilityChange);
  return () => document.removeEventListener('visibilitychange', onVisibilityChange);
}, []);
```

**Result:** Timer survives tab switches, Chrome minimize, and in-app navigation. If the rest period expired while backgrounded, the chime fires the moment the user returns.

---

## 🟢 Fix 4 — Active Session: Persists Across Chrome Reloads + "Resume?" UI

**Problem:** A page reload (accidental or deliberate) completely destroys the active workout session. All sets logged so far are lost and the user must start over. There is no indication that a session was in progress.

### Implementation

Three parts: **A) session persistence to localStorage**, **B) AppContext integration**, **C) Resume UI**.

---

### Part A — Persist Active Session to localStorage

**Key:** `fittrack_activeWorkoutSession`

**Session shape:**

```js
{
  splitDayId: 'day-1',
  splitDayName: 'Push A',
  splitName: 'PPL — 6 Day',
  startTime: 1713245600000,       // Unix ms — original session start, never updated
  userId: 'supabase-user-uuid',   // for cross-account isolation
  exercises: [
    {
      id: 'bench-press',
      name: 'Bench Press',
      muscle: 'Chest',
      primaryMuscle: 'chest',
      secondaryMuscles: ['triceps', 'front-delts'],
      sets: [
        { id: 's1', weight: 80, reps: 10, completed: true },
        { id: 's2', weight: 80, reps: 10, completed: false },
      ]
    },
  ],
  notes: '',
  lastUpdated: 1713245900000,     // Unix ms — updated on every write
}
```

**Key helpers (module-level in WorkoutPage.jsx):**

```js
const ACTIVE_SESSION_KEY = 'fittrack_activeWorkoutSession';
const SESSION_MAX_AGE_MS = 24 * 60 * 60 * 1000; // 24h
const SESSION_STALE_MS   =  8 * 60 * 60 * 1000; // 8h — warn but still allow resume

function persistActiveSession(session) {
  try {
    localStorage.setItem(ACTIVE_SESSION_KEY, JSON.stringify({
      ...session,
      lastUpdated: Date.now(),
    }));
  } catch (e) { /* localStorage full */ }
}

function clearPersistedSession() {
  localStorage.removeItem(ACTIVE_SESSION_KEY);
}

function loadPersistedSession(currentUserId) {
  try {
    const raw = localStorage.getItem(ACTIVE_SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    // Discard if from a different user
    if (parsed.userId && parsed.userId !== currentUserId) return null;
    // Discard if >24h stale
    if (Date.now() - parsed.lastUpdated > SESSION_MAX_AGE_MS) {
      clearPersistedSession();
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}
```

**When to persist:** Call `persistActiveSession(currentSession)` on:

| Event | Action |
|-------|--------|
| `startSession(splitDayId)` — initial creation | ✅ Persist first snapshot |
| Set marked complete (`logSet`) | ✅ Persist |
| Set added (`addSet`) | ✅ Persist |
| Set deleted | ✅ Persist |
| Notes updated | ✅ Persist (debounced 1000ms) |
| `finishWorkout()` — after successful log | 🗑️ `clearPersistedSession()` |
| `discardWorkout()` — after user confirms | 🗑️ `clearPersistedSession()` |

---

### Part B — AppContext: Boot-time Session Check

**File:** `src/context/AppContext.jsx`

Add to context value:

```js
// Derived — computed once on mount from localStorage
// WorkoutPage reads this to decide whether to show the resume card
const [hasPersistedSession, setHasPersistedSession] = useState(false);

useEffect(() => {
  const raw = localStorage.getItem('fittrack_activeWorkoutSession');
  setHasPersistedSession(!!raw);
}, []);
```

Expose `hasPersistedSession` via context. WorkoutPage uses it to conditionally render the resume card without duplicating localStorage reads.

---

### Part C — WorkoutPage: Resume Card UI

**File:** `src/components/pages/WorkoutPage.jsx`

#### On mount — check for persisted session:

```js
const [persistedSession, setPersistedSession] = useState(null);

useEffect(() => {
  const saved = loadPersistedSession(session?.user?.id);
  if (saved) setPersistedSession(saved);
}, []);
```

#### Resume card placement:

Render above the split day cards list, only when `persistedSession !== null` and no active in-memory session exists.

#### Resume card — Kinetic Elite design spec:

```
┌─────────────────────────────────────────────────────┐
│  ● ACTIVE SESSION IN PROGRESS          [last updated]│  ← PulseIndicator + label-md primary color
│                                                     │
│  Push A  ·  PPL — 6 Day                             │  ← title-md Space Grotesk
│  Started 2h 14m ago  ·  3 exercises · 12 sets done  │  ← body-md on-surface-variant
│                                                     │
│  [  RESUME SESSION  ]           [ Discard ]         │  ← ember gradient pill + ghost text button
└─────────────────────────────────────────────────────┘
```

CSS: `background: var(--surface-container-low)`, `border-left: 3px solid var(--primary-container)`, `border-radius: 12px`, `padding: 16px`, `margin-bottom: 16px`.

**Stale session (8–24h):** Replace `PulseIndicator` with `⚠️` and change headline to `"SESSION FROM ${hrs}H AGO"` in `--on-surface-variant` amber.

#### Stats line computation:

```js
const exerciseCount = persistedSession.exercises.length;
const completedSets = persistedSession.exercises
  .flatMap(e => e.sets)
  .filter(s => s.completed).length;
const timeAgo = formatTimeAgo(persistedSession.startTime);
```

#### `formatTimeAgo` helper (add to `src/utils/helpers.js`):

```js
export function formatTimeAgo(ms) {
  const mins = Math.floor((Date.now() - ms) / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  const rem = mins % 60;
  return rem > 0 ? `${hrs}h ${rem}m ago` : `${hrs}h ago`;
}
```

#### Resume handler:

```js
function handleResumeSession() {
  // Restore exercises, sets, notes, startTime from persistedSession
  setCurrentDay(persistedSession.splitDayId);
  setSessionExercises(persistedSession.exercises);
  setSessionNotes(persistedSession.notes || '');
  setSessionStartTime(persistedSession.startTime); // keep original start time
  setSessionActive(true);
  setPersistedSession(null); // hide the resume card
  // Do NOT re-persist here — will auto-persist on next set action
}
```

#### Discard handler:

```js
function handleDiscardSession() {
  // Use existing ConfirmDialog component
  showConfirm({
    title: 'Discard Session?',
    message: `This will permanently delete all ${completedSets} sets logged in this session.`,
    confirmLabel: 'Discard',
    onConfirm: () => {
      clearPersistedSession();
      setPersistedSession(null);
    }
  });
}
```

---

## 🗂️ Files to Modify

| File | Changes |
|------|---------|
| `src/components/pages/WorkoutPage.jsx` | All four fixes: `playRestCompleteChime`, `vibrateRestComplete`, timestamp-based timer state, timer localStorage persistence, visibility change handler, session persistence helpers, auto-save trigger on every set action, resume card UI, `handleResumeSession`, `handleDiscardSession` |
| `src/context/AppContext.jsx` | Add `hasPersistedSession` state; expose via context |
| `src/utils/helpers.js` | Add `formatTimeAgo(ms)` export |

**No new files. No Supabase schema changes.** All session persistence is localStorage-only — appropriate for unsaved in-progress data.

---

## 🧪 Verification / Test Cases

| # | Test | Expected |
|---|------|----------|
| 1 | Log 2 sets → reload Chrome → go to Workout page | Resume card appears: correct day name, "2 sets done", time elapsed |
| 2 | Log sets → navigate to Diet → return to Workout | Same active session, all sets intact |
| 3 | Change rest timer to 3 min → finish → start new session | Timer defaults to 3 min |
| 4 | Start 90s timer → switch tab → return at ~45s | Timer shows ~45s (not reset) |
| 5 | Start timer → let expire while on another tab | Chime + haptic fires when returning to Workout tab |
| 6 | Start timer → let expire on-screen | Chime + haptic at T=0, timer dismissed |
| 7 | Click Skip on timer | No chime, no haptic |
| 8 | Resume session → finish all sets → Finish | Logged normally; resume card gone; `fittrack_activeWorkoutSession` key removed |
| 9 | Resume card → Discard → confirm | Card gone; key removed; day cards still visible |
| 10 | Session persisted 9h ago | Amber stale warning variant shown; still resumable |
| 11 | Session persisted 25h ago | No resume card — silently discarded on mount |
| 12 | Log in as user B after user A had active session | User B does not see user A's session (userId mismatch check) |

---

## ⚠️ Edge Cases

- **iOS audio lock:** `playRestCompleteChime` is always called from a timer completion, never spontaneously. The AudioContext was unlocked by the original "Start Timer" tap gesture. However, if the page reloads between unlock and completion, the context is locked again — wrap in `try/catch` and fail silently.
- **Multiple tabs:** Two tabs share the same localStorage key. The first tab to finish/discard wins. Acceptable edge case — no coordination needed.
- **Offline use:** All four fixes work fully offline — no Supabase dependency.
- **Demo user:** No special-casing needed. localStorage works without an authenticated Supabase session.

---

## 🔑 localStorage Keys Added

| Key | Purpose | TTL / Cleared When |
|-----|---------|-------------------|
| `fittrack_restTimerDuration` | User's preferred rest duration in seconds | Never (device pref) |
| `fittrack_activeRestTimer` | Rest timer absolute end timestamp (Unix ms) | Timer expires naturally or is skipped |
| `fittrack_activeWorkoutSession` | Full in-progress session JSON snapshot | `finishWorkout()` or `discardWorkout()` confirmed |

---

## 🔍 GAP ANALYSIS — Code vs. Spec Conflicts

> **Audited:** 2026-04-16 · **Auditor:** Code audit against `WorkoutPage.jsx` (720 lines), `AppContext.jsx`, `SharedComponents.jsx`

### Summary

The spec was written against an **older or idealized** version of the codebase. The actual code uses **different variable names, different state shapes, different storage keys, and already has partial implementations** of Fix 3 and Fix 4. Implementing the spec verbatim would cause duplicate state, key collisions, and broken resume flows.

---

### GAP-1: `HeroRestTimer` does not exist — the component is called `RestTimer`

**Spec says:** "When the `HeroRestTimer` counts down to zero…"
**Actual code:** The component is `const RestTimer = ({ seconds, onDone, onCancel })` at line 247. There is no `HeroRestTimer` anywhere in the codebase.

**Impact:** Cosmetic — the spec references a non-existent component name. All code targeting `HeroRestTimer` should target `RestTimer`.

---

### GAP-2: `RestTimer` already has a beep — but it's a crude 2-note beep, not the 3-note chime

**Spec proposes:** A 3-note ascending chime (`playRestCompleteChime`) and vibration.
**Actual code (lines 256–264):** RestTimer already plays a 2-note beep (880Hz → 1100Hz) via Web Audio API on completion. No vibration.

**Required action:** Replace the existing 2-note beep with the spec's 3-note chime and add the vibration call. The trigger location is correct (inside `RestTimer`'s `setInterval` callback at `p <= 1`), but the spec's code assumes new state variables (`restActive`, `restEndsAt`, `restSecondsLeft`) that don't exist yet. The existing timer uses a simple decrementing `left` state.

**Fix for spec:** The chime/vibration code is correct, but the "Trigger location" section (lines 63–83) should reference the actual `RestTimer` component's effect at line 251, not a hypothetical `useEffect` in the parent. OR, if Fix 3 refactors the timer to the timestamp approach, the trigger moves to the parent — in which case the `RestTimer` component is **deleted and replaced** entirely. The spec doesn't mention this deletion.

---

### GAP-3: Rest timer state uses DIFFERENT variable names than the spec

**Spec uses:** `restActive`, `restEndsAt`, `restSecondsLeft`, `restDuration`
**Actual code uses:**
- `timer` — `useState(null)`, shape `{ active: true, ei, si }` (stores WHICH exercise/set triggered the timer)
- `restSeconds` — `useState(90)`, the duration selector value
- Inside `RestTimer` component: `left` — the decrementing counter

**Impact:** The spec's code snippets won't compile against the current state. The `timer` state carries `ei` and `si` (exercise index, set index) which determines WHERE in the exercise list the rest timer UI renders (line 585). The spec's proposed state (`restActive` boolean) **loses this positional information**, meaning the timer would no longer render inline below the specific set that triggered it.

**Fix for spec:** Add `restTimerPosition: { ei, si }` to the new state model, or keep `timer.ei`/`timer.si` alongside `restEndsAt`. The inline rendering at line 585 depends on `timer.ei === ei && timer.si === si`.

---

### GAP-4: Session persistence ALREADY EXISTS — uses `sessionStorage`, not `localStorage`

**Spec proposes:** Fix 4 "Active Session Persists Across Chrome Reloads" using `localStorage` key `fittrack_activeWorkoutSession`.
**Already implemented (our previous fix):**
- Line 301-306: `session` state has a lazy initializer reading from `sessionStorage` key `fittrack_active_workout`
- Lines 325-332: `useEffect` persists `session` to `sessionStorage` on every change
- Lines 426-427: `doFinish()` clears both `fittrack_session_start` and `fittrack_active_workout` from `sessionStorage`
- Line 647: Discard handler also clears `fittrack_active_workout`

**Critical difference:** `sessionStorage` is cleared on tab close / browser restart. `localStorage` survives. The spec explicitly wants survival across **Chrome reloads** (Ctrl+R) and **tab close/reopen**. `sessionStorage` survives Ctrl+R but NOT tab close. So the existing implementation is **partially correct** but doesn't meet the full spec.

**Required action:** Migrate from `sessionStorage` to `localStorage`. But this introduces new concerns:
1. Need `userId` checking (done in spec's `loadPersistedSession`)
2. Need `lastUpdated` and TTL aging (24h max, 8h stale warning — done in spec)
3. Need to clear existing `sessionStorage` keys during migration to avoid dual-state

**Fix for spec:** Add an explicit migration step:
```js
// Migration: clear old sessionStorage keys if present
sessionStorage.removeItem('fittrack_active_workout');
sessionStorage.removeItem('fittrack_session_start');
```

---

### GAP-5: Session shape mismatch — spec uses `completed`, code uses `done`

**Spec's session shape (line 271-272):** `{ id: 's1', weight: 80, reps: 10, completed: true }`
**Actual session shape (line 391):** `{ reps: '', weight: '', done: false, targetRep: '8-12' }`

Key differences:
| Field | Spec | Actual |
|-------|------|--------|
| Completion flag | `completed` | `done` |
| Set ID | `id: 's1'` | No ID (uses array index) |
| Reps | `reps: 10` (number) | `reps: ''` (string, edited by user) |
| Weight | `weight: 80` (number) | `weight: ''` (string) |
| Target rep range | Not present | `targetRep: '8-12'` |

**Impact:** The `completedSets` computation in the resume card (line 397) filters on `s.completed` — but the actual data uses `s.done`. The stats would always show 0 completed sets.

**Fix for spec:** Change resume card stats to:
```js
const completedSets = persistedSession.exercises
  .flatMap(e => e.sets)
  .filter(s => s.done).length;
```

Also update the example session shape to match actual:
```js
sets: [
  { reps: '10', weight: '80', done: true, targetRep: '8-12' },
  { reps: '', weight: '', done: false, targetRep: '8-12' },
]
```

---

### GAP-6: Session shape uses `exercises` but code uses `exs` + `day`

**Spec's session shape:** `{ splitDayId, splitDayName, splitName, exercises: [...] }`
**Actual session shape (line 398):** `{ day: { id, name, exercises, ... }, exs: [...], notes: '', startTime: epoch }`

The actual session stores the full `day` object (from the split) and `exs` (the working copy with user inputs). The spec's flattened shape (`splitDayId`, `splitDayName`) doesn't match.

**Impact:** The resume handler's code (`setCurrentDay`, `setSessionExercises`, `setSessionNotes`, `setSessionStartTime`, `setSessionActive`) references **state setters that don't exist**. The actual code uses a single `setSession()` call with the full session object.

**Fix for spec:** The resume handler should be:
```js
function handleResumeSession() {
  const saved = loadPersistedSession(user.id);
  if (saved) {
    setSession(saved);             // restores the full { day, exs, notes, startTime }
    startTimeRef.current = saved.startTime;
    sessionStorage.setItem('fittrack_session_start', String(saved.startTime));
    setPersistedSession(null);
  }
}
```

---

### GAP-7: AppContext `hasPersistedSession` is unnecessary

**Spec proposes** (Part B): Adding `hasPersistedSession` state to `AppContext` so WorkoutPage can check it.

**Why it's unnecessary:** WorkoutPage already does its own `loadPersistedSession()` on mount. Adding a context value creates split ownership — WorkoutPage modifies `localStorage` directly, but AppContext also reads it. The context value would go stale whenever WorkoutPage clears the session without re-syncing context.

**Better approach:** Delete Part B entirely. WorkoutPage handles its own persistence lifecycle. The `loadPersistedSession()` call on mount is sufficient and doesn't require context coordination.

---

### GAP-8: `playRestCompleteChime` creates a new AudioContext every call — iOS will block after reload

The spec acknowledges the iOS audio lock issue in Edge Cases but doesn't solve it. Creating `new AudioContext()` on every chime call works, but iOS Safari limits the number of AudioContext instances (typically 4-6). If the user does many sets in a session, the chime will silently fail.

**Fix for spec:** Use a singleton AudioContext, created once on first user gesture:
```js
let _audioCtx = null;
function getAudioCtx() {
  if (!_audioCtx) _audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (_audioCtx.state === 'suspended') _audioCtx.resume();
  return _audioCtx;
}
```

---

### GAP-9: RestTimer refactor path is unclear — is the component kept or replaced?

Fix 3 proposes moving all timer logic to the **parent component** (`WorkoutPage`) using `restEndsAt` state with timestamp-based math. But the current `RestTimer` is a **self-contained component** (lines 247-295) with its own `useEffect`, its own `setInterval`, and its own UI rendering.

The spec doesn't say whether:
- (a) Keep `RestTimer` as a presentational component, pass `restSecondsLeft` as a prop
- (b) Delete `RestTimer` entirely and inline the UI into WorkoutPage
- (c) Keep `RestTimer` but gut its internal timer logic and make it driven by props

**Recommended approach (a):** Refactor `RestTimer` to accept `secondsLeft` (computed by parent) and `onSkip`/`onExtend` callbacks. Remove its internal `setInterval`. The parent owns the timestamp logic and passes `Math.ceil((restEndsAt - Date.now()) / 1000)` on each tick.

---

### GAP-10: `+30s` button in RestTimer doesn't update `restEndsAt`

The existing RestTimer has a "+30s" button (line 289) that calls `setLeft(p => p + 30)`. Under the timestamp approach, this needs to update `restEndsAt` instead:
```js
function extendRestTimer(extraSeconds) {
  setRestEndsAt(prev => {
    const newEnd = (prev || Date.now()) + extraSeconds * 1000;
    localStorage.setItem(REST_TIMER_KEY, String(newEnd));
    return newEnd;
  });
}
```
The spec doesn't mention the +30s button at all.

---

### GAP-11: `cancelRestTimer` vs Skip — the spec conflates them

The spec defines `cancelRestTimer()` (line 161) which clears localStorage and state. But the actual code has TWO dismissal paths:
1. **Skip button** (line 290): `onCancel()` → `setTimer(null)` — user intentionally skips
2. **Natural completion** (line 265): `onDone()` → `setTimer(null)` — timer reaches zero

The spec says "Do NOT play the chime if the user manually skips the timer" but the `cancelRestTimer` function is used for both cancellation AND as the basis for Skip. Need separate semantics:
- `skipRestTimer()` — no chime, no vibration, clear localStorage
- `restTimerCompleted()` — play chime, vibrate, clear localStorage

---

### GAP-12: Missing `restSecondsLeft` state declaration

The spec references `setRestSecondsLeft(Math.ceil(remaining / 1000))` in multiple effects but never declares the state:
```js
const [restSecondsLeft, setRestSecondsLeft] = useState(0);
```
This should be added to the state declarations block alongside `restEndsAt` and `restActive`.

---

## ✅ Corrected Implementation Order

Based on the gaps above, the actual implementation order should be:

1. **Add `playRestCompleteChime` + `vibrateRestComplete`** (Fix 1) — standalone functions, no state changes
2. **Refactor `RestTimer` to prop-driven** (prerequisite for Fix 3) — remove internal interval, accept `secondsLeft` prop
3. **Replace timer state model** (Fix 3) — `timer` → `restEndsAt` + `restActive` + `restTimerPosition` + `restSecondsLeft`
4. **Wire chime/vibration** into the new timestamp-based completion (Fix 1 + Fix 3 merge)
5. **Persist `restDuration`** to localStorage (Fix 2) — rename `restSeconds` → `restDuration`, add lazy init
6. **Migrate session persistence** from `sessionStorage` → `localStorage` (Fix 4) — update key, add userId/TTL, clean up old keys
7. **Add Resume Card UI** (Fix 4 Part C) — uses actual session shape (`day`, `exs`, `done`), not spec shape
8. **Add `formatTimeAgo`** to helpers.js