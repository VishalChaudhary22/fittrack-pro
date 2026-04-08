# FitTrack Pro — TODO: Live Workout Timer Pill + Refresh State Bug
> **Created:** 2026-04-09
> **Priority:** 🟠 High (bug) · 🟡 Medium (polish)
> **Effort:** 🟢 Small for both
> **Files affected:** `WorkoutPage.jsx`, `AppContext.jsx`

---

## Item 1 — Live Workout Pill: Add Elapsed Time Display

### Problem Statement

The floating "Live tracking" pill (bottom-right Portal) shows only a pulse dot + label.
The user can't see how long their session has been going without leaving the page.
This matters for Indian gym-goers who target 60–90 min sessions and often screenshot
their gym time for social sharing.

### Current Pill JSX (Actual — Line 557-576)

> **⚠️ CORRECTION:** The pill is inside a `<Portal>` at line 556, wrapped in a
> fixed-position column container alongside an optional "Finish Workout" FAB.
> It uses an **inline custom pulse** (not the `<PulseIndicator>` component).

```jsx
{/* Actual code — WorkoutPage.jsx lines 569-575 */}
<div style={{ display: 'flex', alignItems: 'center', gap: 8,
  background: 'var(--glass-bg)', backdropFilter: 'var(--glass-blur-sm)',
  padding: '6px 14px', borderRadius: 999,
  border: '1px solid rgba(248, 95, 27, 0.2)',
  boxShadow: 'var(--shadow-ambient)', width: 130 }}>
  <span style={{ position: 'relative', display: 'flex', width: 8, height: 8, flexShrink: 0 }}>
    <span style={{ animation: 'pulse 2s cubic-bezier(0, 0, 0.2, 1) infinite',
      position: 'absolute', display: 'inline-flex', height: '100%', width: '100%',
      borderRadius: '50%', background: 'var(--primary-container)', opacity: 0.75 }}></span>
    <span style={{ position: 'relative', display: 'inline-flex', borderRadius: '50%',
      height: 8, width: 8, background: 'var(--primary)' }}></span>
  </span>
  <span className="label-md" style={{ color: 'var(--on-surface)', fontSize: 9,
    whiteSpace: 'nowrap' }}>Live tracking</span>
</div>
```

### Root Cause

> **⚠️ CORRECTION:** `elapsed` state and `startTimeRef` do **NOT** exist in
> `WorkoutPage.jsx`. `session.startTime` is set at line 335-336 via
> `new Date().getTime()` but is only consumed in `finish()` to compute
> `durationMinutes`. There is no ticking interval, no `elapsed` counter, and
> no `startTimeRef`. All three must be created from scratch.

The timer infrastructure (state + ref + interval) must be added before the pill
can display elapsed time. This is not a one-line pass-through — it's ~20 lines
of new timer plumbing.

### Implementation

#### Step 1 — Add `fmtElapsed` formatter (above the return statement)

```js
// WorkoutPage.jsx — add near other computed values, above return
const fmtElapsed = (secs) => {
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;
  if (h > 0) return `${h}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
};
```

MM:SS format matches gym stopwatch convention universally understood in fitness.

#### Step 1b — Add `elapsed` state + ticking interval

> **NEW STEP** — this infrastructure does not exist yet.

```js
// WorkoutPage.jsx — add inside WorkoutPage component, near other state
const startTimeRef = useRef(null);
const [elapsed, setElapsed] = useState(0);

// Recover startTime from sessionStorage on mount (survives Ctrl+R)
useEffect(() => {
  const saved = sessionStorage.getItem('fittrack_session_start');
  if (saved && session) startTimeRef.current = parseInt(saved, 10);
}, []);

// Ticking interval — runs only when a non-yoga session is active
useEffect(() => {
  if (!session || session.isYoga || done) return;
  if (!startTimeRef.current) {
    startTimeRef.current = session.startTime || Date.now();
  }
  const tick = setInterval(() => {
    setElapsed(Math.floor((Date.now() - startTimeRef.current) / 1000));
  }, 1000);
  return () => clearInterval(tick);
}, [session, done]);
```

#### Step 2 — Update the live pill JSX

The actual pill is at **line 569-575** inside the `<Portal>` container.
Keep the existing inline pulse animation (not `<PulseIndicator>`).

```jsx
{/* AFTER — replace lines 569-575 with two-line stack */}
<div style={{ display: 'flex', alignItems: 'center', gap: 10,
  background: 'var(--glass-bg)', backdropFilter: 'var(--glass-blur-sm)',
  padding: '8px 14px', borderRadius: 999,
  border: '1px solid rgba(248, 95, 27, 0.2)',
  boxShadow: 'var(--shadow-ambient)', width: 130 }}>
  {/* Existing inline pulse dot — keep as-is */}
  <span style={{ position: 'relative', display: 'flex', width: 8, height: 8, flexShrink: 0 }}>
    <span style={{ animation: 'pulse 2s cubic-bezier(0, 0, 0.2, 1) infinite',
      position: 'absolute', display: 'inline-flex', height: '100%', width: '100%',
      borderRadius: '50%', background: 'var(--primary-container)', opacity: 0.75 }}></span>
    <span style={{ position: 'relative', display: 'inline-flex', borderRadius: '50%',
      height: 8, width: 8, background: 'var(--primary)' }}></span>
  </span>
  {/* NEW — two-line stack: LIVE label + timer */}
  <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
    <span style={{
      fontFamily: "'Be Vietnam Pro', sans-serif",
      fontWeight: 700, fontSize: 9, letterSpacing: '0.12em',
      textTransform: 'uppercase', color: 'var(--on-surface-variant)',
      lineHeight: 1,
    }}>
      Live
    </span>
    <span style={{
      fontFamily: "'Space Grotesk', sans-serif",
      fontWeight: 800, fontSize: 13, letterSpacing: '-0.02em',
      color: 'var(--primary)', lineHeight: 1,
    }}>
      {fmtElapsed(elapsed)}
    </span>
  </div>
</div>
```

**Design rationale:**
- "LIVE" label in Be Vietnam Pro uppercase `--on-surface-variant` — matches how
  every other metadata label works across the app
- Timer in Space Grotesk `--primary` (Ember Peach) — the metric is the headline
- Padding: `8px → 10px` vertical — minimal footprint increase (4px total height)
- `gap: 8 → 10` — breathing room for the taller two-line stack

#### Step 3 — Persist `startTime` across page refresh via `sessionStorage`

`sessionStorage` is the right storage — it clears when the tab closes (no stale
timers), but survives `Ctrl+R`.

```js
// In start() at line 320 — save timestamp to sessionStorage alongside session state
const start = day => {
  // ... existing yoga check unchanged ...
  const timestamp = Date.now(); // replaces new Date().getTime()
  sessionStorage.setItem('fittrack_session_start', String(timestamp));
  startTimeRef.current = timestamp;
  setSession({ day, exs, notes: '', startTime: timestamp });
  setDone(null);
};

// The recovery from sessionStorage is already in Step 1b's useEffect.

// In finish() at line 352 — clean up sessionStorage
const finish = () => {
  sessionStorage.removeItem('fittrack_session_start');
  startTimeRef.current = null;
  setElapsed(0);
  // ... rest of existing finish logic unchanged
};

// In Discard button onClick at line 550 — also clean up
onClick={() => {
  sessionStorage.removeItem('fittrack_session_start');
  startTimeRef.current = null;
  setElapsed(0);
  setSession(null); setTimer(null);
}}
```

Side-benefit: `durationMinutes` in the workout log will be accurate even if the user
refreshed mid-session, fixing a subtle data quality issue in `WorkoutHistoryPage`.

### Acceptance Criteria
- [x] Pill shows "LIVE" label + `MM:SS` timer ticking every second
- [x] Pill height increases by ~4px — no other layout elements shift
- [x] Session end (Finish or Discard) hides pill as before
- [x] Timer continues from where it left off after `Ctrl+R` mid-session (Step 3)
- [x] Desktop pill uses `bottom: 24` (no bottom nav), mobile uses `bottom: 88`

### Files to Touch
| File | Change |
|------|--------|
| `src/components/pages/WorkoutPage.jsx` | `startTimeRef` + `elapsed` state + ticking `useEffect` (NEW) · `fmtElapsed` helper · Updated pill JSX · `start()` + `finish()` + Discard for sessionStorage |

---

## Item 2 — Bug: Diet Progress and Readiness Score Reset on Refresh

### Problem Statement

After `Ctrl+R` / `Cmd+R`:
- ❌ Diet progress (food log, macro rings) → shows empty / zero
- ❌ Readiness score → disappears; check-in prompt reappears
- ✅ Workout tracking history → stays visible
- ✅ Water intake → stays

### Root Cause Analysis

**From `State.md` storage table:**

| Data | Storage |
|------|---------|
| `food_logs` | Supabase DB |
| `readiness_logs` | Supabase DB |
| `workout_logs` | Supabase DB |
| `waterLog` | `localStorage` — `fittrack_waterLog` |

All three fitness types are in Supabase, yet workouts survive while food and
readiness don't.

---

#### ~~Root Cause A — UTC Date Mismatch in Supabase Queries~~ ← ❌ DOES NOT APPLY

> **⚠️ CORRECTION (Codebase Audit 2026-04-09):**
> The original analysis assumed `loadCloudData()` used `.eq('date', ...)` filters.
> **It does not.** The actual `loadCloudData()` at `AppContext.jsx:178-198` fetches
> ALL records for the user with no date filter:
>
> ```js
> // Actual code — AppContext.jsx line 184
> supabase.from('food_logs').select('*').eq('user_id', userId),
> // line 186
> supabase.from('readiness_logs').select('*').eq('user_id', userId),
> ```
>
> There is no `.eq('date', ...)`, no `.gte('date', ...)` — just `.eq('user_id', userId)`.
> UTC mismatch is irrelevant here. **Fix 1 is not needed.**

---

#### Root Cause A (Corrected) — Async Latency Gap ← PRIMARY

On every page refresh:
1. `AppContext` state initializes `foodLog` and `readinessLog` to `[]` (line 27, 25)
2. Supabase auth session restores asynchronously (~200–500ms)
3. `onAuthStateChange` fires → `fetchProfile()` → `loadCloudData()` (~300–800ms)
4. During the full ~500–1300ms gap → UI shows empty state, macro rings show zeros

**Why workouts survive:** The workout history page likely caches or the user doesn't
notice the brief flash. The data IS fetched — it's the perceived latency that differs.

**Why water stays:** `localStorage` via `useLocalStorage` hook — reads synchronously
on mount with zero network round-trip.

---

#### Root Cause B — Possible Missing RLS Policies (Edge Case)

If `food_logs` or `readiness_logs` tables are missing RLS `SELECT` policies,
Supabase returns empty results silently (not an error). The symptom looks identical
to the async gap.

---

### Fixes

#### ~~Fix 1 — Replace UTC Date with `tod()` in All Supabase Date Filters~~

> **❌ NOT NEEDED.** `loadCloudData()` has no date filters. See corrected
> Root Cause A above. Skip this fix entirely.

---

#### Fix 2 — Add localStorage Write-Through Cache for foodLog and readinessLog

This eliminates the async gap entirely. The cache provides an instant synchronous
initial render; the Supabase fetch refreshes it in the background.

This is the exact pattern that makes water intake reliable — extend it to food and
readiness.

```js
// AppContext.jsx — replace current useState initializers

// Key includes userId to prevent cross-user contamination
const FOOD_LOG_CACHE_KEY = `fittrack_foodLog_${userId}`;
const READINESS_CACHE_KEY = `fittrack_readinessLog_${userId}`;

// Initialize from cache synchronously (instant render, no flash)
const [foodLog, setFoodLogState] = useState(() => {
  try { return JSON.parse(localStorage.getItem(FOOD_LOG_CACHE_KEY) || '[]'); }
  catch { return []; }
});

const [readinessLog, setReadinessLogState] = useState(() => {
  try { return JSON.parse(localStorage.getItem(READINESS_CACHE_KEY) || '[]'); }
  catch { return []; }
});

// Write-through setter — updates React state AND localStorage atomically
const setFoodLog = (updater) => {
  setFoodLogState(prev => {
    const next = typeof updater === 'function' ? updater(prev) : updater;
    // Prune to last 90 days before caching to keep localStorage small
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 90);
    const cutoffStr = cutoff.toISOString().split('T')[0];
    const pruned = next.filter(e => e.date >= cutoffStr);
    localStorage.setItem(FOOD_LOG_CACHE_KEY, JSON.stringify(pruned));
    return next; // return full array to React state; pruning is cache-only
  });
};

const setReadinessLog = (updater) => {
  setReadinessLogState(prev => {
    const next = typeof updater === 'function' ? updater(prev) : updater;
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 90);
    const cutoffStr = cutoff.toISOString().split('T')[0];
    const pruned = next.filter(e => e.date >= cutoffStr);
    localStorage.setItem(READINESS_CACHE_KEY, JSON.stringify(pruned));
    return next;
  });
};
```

> **Why 90 days in localStorage?** Covers all rolling charts, streaks, and weekly
> analytics. At ~300 bytes/food entry × 5 entries/day × 90 days = ~135KB max.
> Readiness is 1 record/day × 90 = ~27KB. Both are well within the 5MB limit.

---

#### Fix 3 — ~~Supabase Background Refresh~~ ✅ ALREADY EXISTS

> **⚠️ CORRECTION:** `loadCloudData()` already performs precisely this function.
> It's called at `AppContext.jsx:170` after `fetchProfile()` completes, and it
> fetches ALL records for the user across all 6 tables via `Promise.all()`.
> No new code is needed here.
>
> Once Fix 2 (localStorage cache) is in place, the existing `loadCloudData()`
> automatically serves as the "background refresh" — it overwrites the cache
> with fresh Supabase data via the write-through `setFoodLog` / `setReadinessLog`
> setters.

---

#### Fix 4 — Verify RLS Policies (Manual — Vishal runs in Supabase SQL Editor)

```sql
-- Step 1: Check what policies exist
SELECT tablename, policyname, cmd
FROM pg_policies
WHERE tablename IN ('food_logs', 'readiness_logs')
ORDER BY tablename;

-- Step 2: If empty results → create the policies
ALTER TABLE public.food_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.readiness_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "food_logs: own data only"
  ON public.food_logs FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "readiness_logs: own data only"
  ON public.readiness_logs FOR ALL
  USING (auth.uid() = user_id);
```

Run Fix 4 first to rule out RLS as a silent failure, then proceed to Fix 2.

---

#### Fix 5 — Extend Account-Switch Cleanup to New Cache Keys

`State.md` confirms AppContext already clears localStorage on account switch.
Extend that cleanup to include the new per-user cache keys:

```js
// In AppContext — wherever account-switch cleanup runs (search for the
// block that removes 'fittrack_cardioLog', 'fittrack_waterLog', etc.)

// Add these two lines alongside the existing removals:
localStorage.removeItem(`fittrack_foodLog_${prevUserId}`);
localStorage.removeItem(`fittrack_readinessLog_${prevUserId}`);
```

The per-user key format (`_${userId}`) means different users on the same device
already can't see each other's cached data — but explicit cleanup on switch is
good hygiene.

---

### Implementation Priority Order

| Order | Fix | Time | Why this order |
|:-----:|-----|:----:|----------------|
| 1 | **Fix 4** — RLS policy audit (SQL check) | 5 min | Rules out a silent failure before writing code |
| 2 | **Fix 2** — localStorage write-through cache | 45 min | **The actual fix.** Eliminates async gap permanently |
| 3 | **Fix 5** — Account-switch cleanup | 5 min | Extend existing pattern, 2-line add |
| — | ~~Fix 1~~ — UTC date | SKIP | Not needed — no date filters exist in `loadCloudData` |
| — | ~~Fix 3~~ — Background refresh | SKIP | Already exists as `loadCloudData()` |

---

### Acceptance Criteria

- [x] After `Ctrl+R`, today's food log and macro rings render immediately (no flash of zeros)
- [x] After `Ctrl+R`, readiness score/tier shows immediately; check-in prompt absent if done today
- [x] ~~Entries logged between 00:00–05:30 IST~~ (N/A — no date filter exists; this was a misdiagnosis)
- [x] All four persist correctly: diet ✅ readiness ✅ workout tracking ✅ water ✅
- [x] Switching accounts → each account sees only its own data
- [x] localStorage cache for food log stays under 200KB

### Files to Touch

| File | Change |
|------|--------|
| `src/context/AppContext.jsx` | Fix 2 (localStorage write-through cache) · Fix 5 (cleanup on account switch) |
| Supabase SQL Editor | Fix 4 — manual RLS audit (no migration file unless policies are missing) |

---

## Summary

| # | Item | Root Cause | File | Effort |
|:---:|------|-----------|------|:------:|
| 1 | Live pill elapsed timer | No `elapsed` state / `startTimeRef` / ticking interval exist — must be built from scratch | `WorkoutPage.jsx` | 🟡 ~45 min |
| ~~2a~~ | ~~Diet/Readiness UTC date~~ | ~~UTC date in `.eq('date', ...)`~~ — **WRONG: no date filter exists in `loadCloudData`** | ~~`AppContext.jsx`~~ | ~~SKIP~~ |
| 2b | Diet/Readiness async gap **(PRIMARY)** | No localStorage fallback — async Supabase fetch leaves state empty during ~500-1300ms auth+data restore | `AppContext.jsx` | 🟡 ~45 min |
| 2c | RLS policy gap (edge case) | Missing SELECT policy on `food_logs` or `readiness_logs` | Supabase SQL Editor | 🟢 ~10 min |

---
---

# Bug Round 3 — 2026-04-09 (Post-Deploy QA)

> **Status:** 🔴 Active  
> **Reported by:** Vishal, post-deployment testing  
> **Priority:** All P0 (fundamentally broken UX)

---

## Bug 3.1 — Readiness Check-In Questionnaire Re-Appears After Every Refresh

### Problem
The readiness check-in modal auto-opens every time the user refreshes the Dashboard,
even if they already completed it today. It should only appear **once per calendar day**
(after midnight IST).

### Root Cause

**The `todayReadiness` lookup is correct** — `DashboardPage.jsx:128`:
```js
const todayReadiness = useMemo(() =>
  readinessLog.find(r => r.userId === user?.id && r.date === todayStr),
  [readinessLog, user?.id, todayStr]
);
```

But **on refresh, `readinessLog` starts as `[]`** until `loadCloudData()` finishes.
During that ~500-1300ms async gap, `todayReadiness` is `undefined`, so the auto-open
`useEffect` at line 148 fires:

```js
useEffect(() => {
  if (!todayReadiness && user?.id) {
    const timer = setTimeout(() => setShowCheckIn(true), 1400);
    return () => clearTimeout(timer);
  }
}, [todayReadiness, user?.id]);
```

The 1400ms delay is designed to wait for data, but the Supabase round-trip can
exceed 1400ms on slow connections, causing the modal to open before `readinessLog`
is populated.

**Secondary issue:** Even with the localStorage cache (Fix 2 from earlier), the
cache may be empty for the first session or if the user cleared localStorage.

### Fix

1. **Guard the auto-open with `authLoading`** — Don't auto-open the modal while
   auth is still initializing. This ensures `loadCloudData()` has had a chance to run.
2. **Increase the timeout to 2500ms** or better, **tie it to a "data loaded" flag**.

```js
// DashboardPage.jsx — line 148
// BEFORE:
useEffect(() => {
  if (!todayReadiness && user?.id) {
    const timer = setTimeout(() => setShowCheckIn(true), 1400);
    return () => clearTimeout(timer);
  }
}, [todayReadiness, user?.id]);

// AFTER:
const { authLoading } = useApp();  // already destructured in component
useEffect(() => {
  if (authLoading) return;  // wait for Supabase data to finish loading
  if (!todayReadiness && user?.id) {
    const timer = setTimeout(() => setShowCheckIn(true), 800);
    return () => clearTimeout(timer);
  }
}, [todayReadiness, user?.id, authLoading]);
```

### Files to Touch
| File | Change |
|------|--------|
| `DashboardPage.jsx` | Add `authLoading` guard to readiness auto-open `useEffect` |

---

## Bug 3.2 — Diet Logs Disappear on Refresh (Macros Schema Mismatch)

### Problem
Food log entries vanish after refresh. All macro rings show zero. The data IS
stored in Supabase (confirmed by the `food_logs` table), but it comes back as
if the macros are missing.

### Root Cause — **CRITICAL: Schema Mismatch**

This is NOT the async gap bug from earlier. This is a **data format mismatch**
between how DietPage writes food entries and how AppContext reads them back
from Supabase.

**How DietPage writes food entries** (`DietPage.jsx:313-328`):
```js
const item = {
  id: gId(), userId: user.id, date: dateStr, slot: searchMealSlot,
  macros: macrosToLog,  // ← NESTED object: { calories, protein, carbs, fat }
  // ...
};
setFoodLog(p => [...updated, item]);
```

**How the cloud sync mapper sends to Supabase** (`AppContext.jsx:326-328`):
```js
setFoodLogSync = createSyncSetter('food_logs', foodLog, setFoodLog, (l) => ({
  id: l.id, date: l.date, /* ... */
  calories: l.calories, protein: l.protein, carbs: l.carbs, fat: l.fat, fiber: l.fiber
  //        ^^^^^^^^^^^ reads FLAT top-level fields like l.calories
}));
```

**The mismatch:** DietPage stores macros inside `item.macros.calories`, but the
cloud sync mapper reads `l.calories` (flat). This means:
- **`l.calories` is `undefined`** → Supabase gets `null` for all macro columns
- The sync "succeeds" but writes zeroes/nulls to the DB
- On refresh, `loadCloudData()` reads back those nulls
- DietPage reads `item.macros?.calories` → `undefined` → shows zero

**Why it works pre-refresh:** The in-memory `foodLog` array still has the correct
`item.macros` object from the current session. The cloud sync silently fails to
persist the actual macro values.

**How DietPage/DashboardPage reads macros** (both files):
```js
// Always reads via nested .macros property:
curr.macros?.calories || 0
curr.macros?.protein || 0
```

**How `loadCloudData` reconstructs entries** (`AppContext.jsx:237`):
```js
setFoodLog(fl?.map(i => ({
  ...i, userId: i.user_id, mealType: i.meal_type, foodId: i.food_id,
  foodName: i.food_name, servingId: i.serving_id, servingLabel: i.serving_label
  // ❌ MISSING: does NOT reconstruct the `macros` nested object
})) || []);
```

The data comes back from Supabase with FLAT columns (`calories`, `protein`, etc.)
but is never wrapped back into a `macros: { ... }` object. So `item.macros` is
`undefined` on every entry loaded from the cloud.

### Fix — Two-Part

#### Part A: Fix the cloud sync mapper to read from `macros` object

```js
// AppContext.jsx — setFoodLogSync mapper
setFoodLogSync = createSyncSetter('food_logs', foodLog, setFoodLog, (l) => ({
  id: l.id, date: l.date, meal_type: l.mealType || l.slot,
  food_id: l.foodId, food_name: l.foodName || l.name,
  serving_id: l.servingId, serving_label: l.servingLabel,
  grams: l.grams || l.customGrams, quantity: l.quantity || l.qty,
  // ✅ Read from nested macros object (how DietPage stores it)
  calories: l.macros?.calories ?? l.calories,
  protein: l.macros?.protein ?? l.protein,
  carbs: l.macros?.carbs ?? l.carbs,
  fat: l.macros?.fat ?? l.fat,
  fiber: l.macros?.fiber ?? l.fiber,
}));
```

#### Part B: Reconstruct `macros` object when loading from Supabase

```js
// AppContext.jsx — loadCloudData food_logs mapping
setFoodLog(fl?.map(i => ({
  ...i,
  userId: i.user_id,
  mealType: i.meal_type,
  foodId: i.food_id,
  foodName: i.food_name,
  name: i.food_name,            // DietPage also reads `.name`
  servingId: i.serving_id,
  servingLabel: i.serving_label,
  slot: i.meal_type,            // DietPage uses `.slot` for grouping
  // ✅ Reconstruct nested macros object for DietPage/DashboardPage
  macros: {
    calories: i.calories || 0,
    protein: i.protein || 0,
    carbs: i.carbs || 0,
    fat: i.fat || 0,
    fiber: i.fiber || 0,
    iron: 0, vitaminB12: 0, vitaminD: 0,
  },
})) || []);
```

### Files to Touch
| File | Change |
|------|--------|
| `AppContext.jsx` | Fix `setFoodLogSync` mapper to read `l.macros?.X` · Fix `loadCloudData` to reconstruct `macros` object |

---

## Bug 3.3 — Auth Session Lost on Page Refresh

### Problem
Users must re-log in every time they refresh the page. Supabase sessions should
persist across page refreshes automatically via its built-in `localStorage` token.

### Root Cause

The Supabase client at `src/lib/supabaseClient.js:6` uses default options:
```js
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

Supabase JS v2 **does** persist sessions to `localStorage` by default
(`auth.persistSession = true`, `auth.storage = localStorage`). However, there
are two possible failure modes:

1. **The `cleanupOldAuthStorage()` function** at `AppContext.jsx:172` runs after
   every successful login. If it aggressively removes `localStorage` keys that
   Supabase uses for session storage, the session would be lost.

2. **The 3-second auth timeout** at lines 103-105:
   ```js
   const timeout = setTimeout(() => {
     if (!initialized) setAuthLoading(false);
   }, 3000);
   ```
   If `onAuthStateChange` doesn't fire within 3 seconds (e.g., network-queued
   Supabase token refresh), the app renders the login page prematurely.

### Investigation Needed
- Check what `cleanupOldAuthStorage()` removes — if it touches any `sb-*` keys
- Check if the Supabase URL and anon key env vars are correctly set in production
- Verify the Supabase dashboard auth settings (session expiry, refresh token rotation)

### Fix

```js
// supabaseClient.js — explicitly set persistent session options
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    storageKey: 'fittrack-auth-token',
    storage: window.localStorage,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
```

Also audit `cleanupOldAuthStorage()` to ensure it does NOT remove:
- `fittrack-auth-token` (or whatever `storageKey` we pick)
- Any keys starting with `sb-`

### Files to Touch
| File | Change |
|------|--------|
| `src/lib/supabaseClient.js` | Add explicit `auth` options with `persistSession: true` |
| `src/utils/authMigration.js` | Audit `cleanupOldAuthStorage()` |
| `src/context/AppContext.jsx` | Possibly extend the 3s timeout or add retry logic |

---

## Bug 3.4 — New Users Not Visible in Olympus League

### Problem
Newly registered users don't appear in the Olympus League leaderboard even though
they have a `user_profiles` row in Supabase.

### Root Cause

The `fetchPlayers` function at `MuscleMapPage.jsx:125-142` explicitly skips the
current user (line 126: `if (u.id === user?.id) return null;`) and adds them as
the `meEntry` separately. **This is correct.**

The probable issue is the **RLS policy on `user_profiles`**. The previous fix
(`20260409_add_leaderboard_rls.sql`) was supposed to add a public SELECT policy,
but it may not have been applied to the production Supabase instance.

Verify by checking:
1. Does `supabase.from('user_profiles').select('id, name, avatar')` return ALL
   users or only the current user?
2. Check the RLS policies on `user_profiles` in the Supabase SQL editor.

### Fix

If the public SELECT policy is missing, add it:
```sql
-- Already created in migration but may not have been applied
CREATE POLICY "user_profiles: public read"
  ON public.user_profiles FOR SELECT
  USING (true);
```

Also, add defensive logging to `fetchPlayers`:
```js
console.log(`[Olympus] Fetched ${users.length} users, ${allLogs.length} total workout logs`);
```

### Files to Touch
| File | Change |
|------|--------|
| Supabase SQL Editor | Verify and add public SELECT RLS on `user_profiles` |
| `MuscleMapPage.jsx` | Add logging if not already present |

---

## Bug Round 3 — Implementation Priority Order

| Order | Bug | Time | Priority |
|:-----:|-----|:----:|:--------:|
| 1 | **3.2** — Diet macros schema mismatch | 30 min | P0 — data loss |
| 2 | **3.3** — Auth session not persisting | 15 min | P0 — broken UX |
| 3 | **3.1** — Readiness check-in re-opens | 10 min | P1 — annoying |
| 4 | **3.4** — Olympus new users | 10 min | P1 — visibility |

### Acceptance Criteria

- [ ] Food logs survive page refresh with correct macro values displayed
- [ ] Auth session persists across `Ctrl+R` — no re-login required
- [ ] Readiness check-in only auto-opens if not completed today (even after refresh)
- [ ] Newly registered users appear in Olympus League with 0 XP