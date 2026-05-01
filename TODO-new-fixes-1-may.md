# FitTrack Pro — TODO: Notifications, Cross-Split Pre-fill & Global PR

> **Created:** 2026-04-30
> **Gap Analysis:** 2026-05-01 (reviewed against actual codebase)
> **Features:** (1) Push & Email Notifications, (2) Cross-Split Exercise Pre-fill, (3) Global PR Tracking
> **Priority order:** Feature 2 + 3 first (pure frontend/logic, zero infra), Feature 1 last (requires infra setup)

---

## ⚠️ GAP ANALYSIS — Corrections to Original Plan

> [!CAUTION]
> The original plan contained several incorrect assumptions about the current codebase.
> The corrections below are based on line-by-line review of the actual source code.

### Gap 1 — Feature 2: `getLastSessionSets` is NOT the bug

**Original claim:** `getLastSessionSets` has a third `currentSplitId` argument that narrows the search.

**Reality:** `getLastSessionSets(workoutLogs, exerciseName)` at `exerciseHistory.js:36` already takes only 2 args and searches ALL logs cross-split. **It is already correct.**

**The REAL bug is in `WorkoutPage.jsx:972`** — the `start()` function's inline pre-fill logic:
```js
const prev = workoutLogs.filter(l => l.userId === user.id && l.dayId === day.id)
  .sort((a, b) => new Date(b.date) - new Date(a.date))[0];
```
This filters by `l.dayId === day.id` — meaning it only looks at logs from the **exact same workout day**. Upper A history is invisible when starting Upper B.

**Fix:** Replace the inline lookup in `start()` with a call to `getLastSessionSets()` per exercise, removing the `dayId` constraint entirely.

---

### Gap 2 — Feature 2: `ex.sv` (swap variant) matching is missing

`getLastSessionSets` at line 43 only matches `norm(ex.name) !== target`. It does NOT check `ex.sv`. If a user swapped Bench Press → Incline Press (stored as `ex.sv = 'Incline Press'`), then `getLastSessionSets('Incline Press', logs)` would miss it because the saved log stores `name: 'Incline Press'` (from `doFinish` line 1054: `name: ex.sv || ex.name`).

**Wait — actually this is fine.** `doFinish()` saves `name: ex.sv || ex.name`, so the swap variant name becomes the canonical `name` in the log. `getLastSessionSets` matching on `ex.name` will find it. **No fix needed for `ex.sv` in `getLastSessionSets`.**

However, `getLastLiftedForExercise` has the same pattern and is also fine for the same reason.

---

### Gap 3 — Feature 3: `getAllTimePR` has the `s.done === false` bug (CONFIRMED)

At `exerciseHistory.js:67`:
```js
if (set.done === false) continue;
```
This skips sets where `done` is explicitly `false`. Saved logs strip `done` entirely (line 1058: `sets: ex.sets.filter(s => s.done).map(s => ({ reps, weight }))`), so `set.done` is `undefined` in historical data → the guard passes. **But** during a live session, if `prMap` is computed from `workoutLogs` (which only has completed sessions), this is harmless.

**However**, there's still a subtle edge case: if old logs (pre-migration) had `done: false` persisted, they'd be skipped. **Fix: Remove the `done` guard entirely** — saved logs already filter to `done === true` sets before saving.

---

### Gap 4 — Feature 3: ProgressPage PR does NOT use `getAllTimePR`

**Original claim:** "The Personal Record card currently calls some lookup for the selected exercise's PR. Update it to use the fixed `getAllTimePR`."

**Reality:** `ProgressPage.jsx:46` computes PR inline:
```js
const pr = cd.length ? Math.max(...cd.map(d => d.maxWeight)) : 0;
```
Where `cd` is filtered by `sd` (selected day) and `ss` (selected split). This means **the ProgressPage PR is already split-scoped by the user's filter selection** — this is intentional UX (user picks a split+day+exercise to see that context's data).

**Correction:** Do NOT replace ProgressPage's inline PR with `getAllTimePR`. Instead, **add a secondary "All-Time PR" stat** next to the existing per-context PR so users see both. The existing per-split PR is useful context.

---

### Gap 5 — Feature 1: PWA already exists via `vite-plugin-pwa`

**Original claim:** "Create `public/manifest.json`" and "Create `public/sw.js`" and "Register SW in `main.jsx`".

**Reality:** `vite.config.js` already uses `VitePWA({ registerType: 'autoUpdate', manifest: {...} })`. This auto-generates:
- `manifest.webmanifest` (NOT `manifest.json`)
- Service Worker via Workbox (`sw.js` + `workbox-*.js`)
- Auto-registration in the built output

**Correction:** Do NOT create manual `manifest.json` or `sw.js`. Instead:
- Add push event handling by extending the VitePWA config with `injectManifest` strategy (instead of `generateSW`) to write a custom SW that includes both Workbox caching AND push event handlers.
- The manifest is already correct — just verify `display: 'standalone'` is set (it is).
- Icons (`fittrack-icon-192.png`, `fittrack-icon-512.png`) may or may not exist — need to verify and create if missing.

---

### Gap 6 — Feature 1: Service Worker registration already handled

`VitePWA({ registerType: 'autoUpdate' })` auto-injects SW registration. Adding manual `navigator.serviceWorker.register('/sw.js')` in `main.jsx` would cause a **double registration conflict**. 

**Fix:** Use VitePWA's `injectManifest` mode with a custom `src/sw.js` source file that includes both Workbox precaching and push handlers.

---

### Gap 7 — Feature 3: Post-session summary PR highlight is missing context

The TODO proposes computing PRs in `finish()` before saving. But `doFinish()` at line 1043 doesn't compute anything beyond XP — the summary screen (line 1070-1120) only shows XP, sets, volume, and a body map.

**Implementation note:** The PR highlight computation must happen BEFORE `setWorkoutLogs` is called (line 1061), because after that call `workoutLogs` includes the new session and the comparison baseline changes. Store `newPRs` in a ref or state variable before the log is appended.

---

### Gap 8 — Feature 2: `start()` pre-fill also determines swap variant (`sv`)

The `start()` function at line 978 sets `sv: prevEx?.name || (ex.variants ? ex.variants[0] : null)`. This means the swap variant selection also depends on the day-scoped lookup. When we remove the `dayId` filter, we need to ensure the cross-split lookup still correctly identifies which variant was last used.

**Fix:** After removing `dayId` scoping, scan ALL user logs for any exercise matching `ex.name` or any of `ex.variants`, take the most recent, and use that as the `sv` value.

---

## Feature Overview

| # | Feature | Scope | Effort |
|---|---------|-------|--------|
| 1 | Push & Email Notifications | Full-stack: VitePWA injectManifest + Supabase Edge Functions + Resend | Large |
| 2 | Cross-Split Exercise Pre-fill | Frontend only — `WorkoutPage.jsx` `start()` function | Small |
| 3 | Global PR Tracking (cross-split) | Frontend only — `exerciseHistory.js` + `WorkoutPage.jsx` + `ProgressPage.jsx` | Small |

---

# Feature 2 — Cross-Split Exercise Pre-fill (CORRECTED)

## Root Cause (CORRECTED)

The bug is **NOT** in `getLastSessionSets` — that function is already cross-split.

The bug is in `WorkoutPage.jsx` line 972, inside the `start()` function:
```js
const prev = workoutLogs.filter(l => l.userId === user.id && l.dayId === day.id)...
```
This `l.dayId === day.id` constraint means pre-fill only finds history from the exact same workout day.

## Implementation Plan (CORRECTED)

### Step 1 — Fix `start()` in `WorkoutPage.jsx`

Replace lines 971-984 with cross-split lookup:

```js
const exs = day.exercises.map(ex => {
  // Cross-split: find the most recent log containing this exercise (any split, any day)
  const allNames = [ex.name, ...(ex.variants || [])];
  let prevEx = null;
  let prevDate = null;

  const sorted = [...workoutLogs]
    .filter(l => l.userId === user.id)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  for (const log of sorted) {
    for (const logEx of (log.exercises || [])) {
      if (allNames.some(n => n.toLowerCase() === logEx.name.toLowerCase())) {
        prevEx = logEx;
        prevDate = log.date;
        break;
      }
    }
    if (prevEx) break;
  }

  return {
    ...ex,
    sv: prevEx?.name || (ex.variants ? ex.variants[0] : null),
    sets: Array.from({ length: ex.sets || 3 }, (_, i) => {
      const pSet = prevEx?.sets?.[i] ?? prevEx?.sets?.[prevEx.sets.length - 1];
      return {
        reps: '',
        weight: pSet ? String(pSet.weight) : '',
        done: false,
        targetRep: pSet ? String(pSet.reps) : (ex.repsRange || '8-12'),
      };
    }),
  };
});
```

### Step 2 — `swapExercise` already uses cross-split `getLastSessionSets` ✅

Line 1006: `getLastSessionSets(workoutLogs, newName)` — no split arg. Already correct.

### Step 3 — No changes needed to `exerciseHistory.js` for Feature 2

`getLastSessionSets` and `getLastLiftedForExercise` are already cross-split.

### Files Modified (CORRECTED)

| File | Change |
|------|--------|
| `src/components/pages/WorkoutPage.jsx` | Rewrite `start()` pre-fill logic — remove `dayId` constraint, scan all logs |

---

# Feature 3 — Global PR Tracking (CORRECTED)

## Implementation Plan (CORRECTED)

### Step 1 — Fix `getAllTimePR` in `exerciseHistory.js`

Remove the `s.done === false` guard at line 67. Everything else is already correct (no split scoping, scans all logs).

```diff
- if (set.done === false) continue;
```

### Step 2 — PR Badge in WorkoutPage ✅ Already Correct

Lines 782-789 (`prMap`) and line 1268 (`beatsAllTimePR`) already work correctly:
- `prMap` calls `getAllTimePR(workoutLogs, name)` with no split arg
- `beatsAllTimePR` compares correctly
- Live session sets are not in `workoutLogs` until `doFinish()`

**No changes needed here** (after Step 1 fix).

### Step 3 — ProgressPage: Add All-Time PR alongside per-context PR (CORRECTED)

The existing PR at line 46 is intentionally scoped to the user's selected split/day filter. Do NOT replace it.

Instead, add a secondary stat:
```js
import { getAllTimePR } from '../../utils/exerciseHistory';

// After line 48
const allTimePR = se ? getAllTimePR(ul, se) : null;
```

Add a new "All-Time PR" indicator in the bento grid Card 2, below the existing per-context PR:
```jsx
{allTimePR && allTimePR.weight > pr && (
  <div style={{ fontSize: 11, color: 'var(--primary)', fontWeight: 600, marginTop: 4 }}>
    All-time: {allTimePR.weight}kg ({allTimePR.isBodyweight ? `${allTimePR.reps} reps` : ''})
  </div>
)}
```

### Step 4 — PR Highlights in Post-Session Summary (NEW)

In `doFinish()`, before `setWorkoutLogs` is called, compute PRs:

```js
const newPRs = session.exs
  .map(ex => {
    const name = ex.sv || ex.name;
    const oldPR = getAllTimePR(workoutLogs, name);
    const sessionBest = Math.max(
      ...ex.sets.filter(s => s.done).map(s => parseFloat(s.weight) || 0)
    );
    const sessionBestReps = ex.sets
      .filter(s => s.done && parseFloat(s.weight) === sessionBest)
      .reduce((max, s) => Math.max(max, parseFloat(s.reps) || 0), 0);
    if (beatsAllTimePR(oldPR, sessionBest, sessionBestReps)) {
      return { name, newWeight: sessionBest, oldWeight: oldPR?.weight ?? null };
    }
    return null;
  })
  .filter(Boolean);
```

Pass `newPRs` to the summary screen via the `done` state or a separate state var, and render below the XP row if `newPRs.length > 0`.

### Files Modified (CORRECTED)

| File | Change |
|------|--------|
| `src/utils/exerciseHistory.js` | Remove `s.done === false` guard in `getAllTimePR` (1 line) |
| `src/components/pages/WorkoutPage.jsx` | Add PR highlights computation in `doFinish()`, render in summary |
| `src/components/pages/ProgressPage.jsx` | Import `getAllTimePR`, add all-time PR stat to bento Card 2 |

---

# Feature 1 — Push & Email Notifications (CORRECTED)

> **Implement after Features 2 and 3 are shipped.**

## Corrections to Original Plan

### PWA Setup — Already Done ✅

- `vite-plugin-pwa` is already installed and configured in `vite.config.js`
- Manifest is auto-generated with correct `display: 'standalone'`
- Service Worker is auto-generated via Workbox
- SW registration is handled by VitePWA's `registerType: 'autoUpdate'`

**Do NOT create manual `manifest.json`, `sw.js`, or SW registration code.**

### What Needs to Change for Push

Switch from `generateSW` (default) to `injectManifest` strategy in `vite.config.js`:

```js
VitePWA({
  strategies: 'injectManifest',
  srcDir: 'src',
  filename: 'sw.js',  // custom SW source
  registerType: 'autoUpdate',
  manifest: { /* existing config */ },
  injectManifest: {
    globPatterns: ['**/*.{js,css,html,svg,png,ico,webp,woff2}'],
  },
})
```

Then create `src/sw.js` (NOT `public/sw.js`) with both Workbox precaching AND push handlers:

```js
import { precacheAndRoute } from 'workbox-precaching';

// Workbox precaching (auto-injected by VitePWA)
precacheAndRoute(self.__WB_MANIFEST);

// Push notification handler
self.addEventListener('push', (event) => { /* ... */ });
self.addEventListener('notificationclick', (event) => { /* ... */ });
```

### Verify Icons Exist

Check if `public/fittrack-icon-192.png` and `public/fittrack-icon-512.png` exist. If not, generate them.

### Rest of Feature 1 Plan

The Supabase tables (`push_subscriptions`, `notification_preferences`, `notification_logs`), Edge Functions, `useNotifications` hook, ProfilePage UI, and pg_cron scheduling from the original plan are all correct and can be implemented as-is. Only the PWA/SW setup sections needed correction.

---

## Implementation Order (CORRECTED)

```
Phase 1 (this sprint — Features 2+3):
  [x] Fix start() pre-fill in WorkoutPage.jsx — remove dayId constraint (Feature 2)
  [x] Remove s.done === false guard in getAllTimePR (Feature 3, 1 line)
  [x] Add all-time PR stat to ProgressPage bento card (Feature 3)
  [x] Add PR Highlights to post-session summary (Feature 3)
  [x] Smoke test: cross-split pre-fill + PR badge + ProgressPage

Phase 2 (next sprint — Push frontend):
  [x] Generate VAPID keys, add to .env + Supabase secrets
  [x] Switch VitePWA to injectManifest strategy
  [x] Create src/sw.js with Workbox + push handlers
  [x] Verify/create PWA icons (192px, 512px)
  [x] Create useNotifications.js hook
  [x] Add Notifications card to ProfilePage
  [x] Add iOS PWA banner to DashboardPage
  [x] Add Android beforeinstallprompt intercept
  [x] Run DB migrations: push_subscriptions, notification_preferences, notification_logs

Phase 3 (infra sprint — Edge Functions):
  [x] Create send-workout-reminder Edge Function
  [x] Create send-diet-reminder Edge Function
  [x] Create send-streak-alert Edge Function
  [x] Create send-olympus-weekly Edge Function
  [x] Create unsubscribe Edge Function
  [ ] Set up Resend account + verify domain (Deferred/EmailJS)
  [x] Create pg_cron schedules
  [x] Test end-to-end

Phase 4 (Olympus-specific):
  [x] olympus-overtaken push
  [x] podium-proximity push
```
