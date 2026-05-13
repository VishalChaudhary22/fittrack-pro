# FitTrack Pro — TODO: Notifications, Cross-Split Pre-fill & Global PR

> **Created:** 2026-04-30
> **Features:** (1) Push & Email Notifications, (2) Cross-Split Exercise Pre-fill, (3) Global PR Tracking
> **Priority order:** Feature 2 + 3 first (pure frontend/logic, zero infra), Feature 1 last (requires infra setup, VAPID keys, Edge Functions)

---

## Feature Overview

| # | Feature | Scope | Effort |
|---|---------|-------|--------|
| 1 | Push & Email Notifications | Full-stack: Service Worker + Supabase Edge Functions + Email provider | Large |
| 2 | Cross-Split Exercise Pre-fill | Frontend only — `exerciseHistory.js` + `WorkoutPage.jsx` | Small |
| 3 | Global PR Tracking (cross-split) | Frontend only — `exerciseHistory.js` + `WorkoutPage.jsx` + `ProgressPage.jsx` | Small |

---

---

# Feature 2 — Cross-Split Exercise Pre-fill

> **Ship this first. Zero infra. Pure JS logic fix.**

## Background & Current Behaviour

When a user starts a workout session, each exercise's set rows are pre-filled with the weight and reps from the previous time that exercise was performed. The current implementation in `src/utils/exerciseHistory.js` (`getLastSessionSets`) searches workout logs but was rebuilt during the 2026-04-23 bug sprint — however the search scope is still likely filtered to the **current split** or **current day** context, which means:

- Bench Press done on Upper A last week → starts a **new** Upper B session → Bench Press rows start **empty** instead of pre-filling from the Upper A occurrence.
- Any custom swap (e.g. Incline Press swapped in for Bench on one day) → next session on a different split day → swap history is invisible.

The fix is conceptually simple: when looking up the last-seen sets for an exercise, scan **all** `workoutLogs` for **any** occurrence of that exercise name, irrespective of which split or day it came from, and use the most recent one.

## Root Cause

`getLastSessionSets(exerciseName, workoutLogs, currentSplitId?)` — the third argument (split filter or day filter) currently narrows the search. Remove that constraint entirely and sort by date descending across the full log array.

The same bug exists in `getAllTimePR` — covered in Feature 3.

---

## Implementation Plan

### Step 1 — Fix `getLastSessionSets` in `exerciseHistory.js`

**Current logic (approximate):**
```js
// Searches only logs matching current split or day key
const relevantLogs = workoutLogs.filter(log => log.splitId === currentSplitId);
```

**New logic:**
```js
/**
 * getLastSessionSets(exerciseName, workoutLogs)
 *
 * Returns the full sets array from the MOST RECENT occurrence of
 * `exerciseName` across ALL workout logs, regardless of split or day.
 *
 * Matching is case-insensitive and trims whitespace.
 * Also matches swapped variants stored in ex.sv (swap variant name).
 *
 * Returns [] if the exercise has never been logged.
 */
export function getLastSessionSets(exerciseName, workoutLogs) {
  if (!exerciseName || !workoutLogs?.length) return [];

  const needle = exerciseName.trim().toLowerCase();

  // Sort all logs newest-first
  const sorted = [...workoutLogs].sort(
    (a, b) => new Date(b.date || b.startTime) - new Date(a.date || a.startTime)
  );

  for (const log of sorted) {
    const exercises = log.exercises || [];
    for (const ex of exercises) {
      // Match on primary name OR swap variant name (ex.sv)
      const exName = (ex.name || '').trim().toLowerCase();
      const exSv   = (ex.sv   || '').trim().toLowerCase();

      if (exName === needle || exSv === needle) {
        // Return all sets from this occurrence, stripping the `done` flag
        // (done is session-local state, not historical data)
        return (ex.sets || []).map(s => ({
          weight: s.weight ?? '',
          reps:   s.reps   ?? '',
        }));
      }
    }
  }

  return [];
}
```

**Key points:**
- No `splitId`, `dayKey`, or `splitName` argument — removed entirely.
- Matches on both `ex.name` and `ex.sv` (swap variant) so swapped exercises carry over correctly.
- Strips the `done` boolean — it is session-local state and should never be pre-filled.
- Returns `[]` on a miss so callers can fall through to empty rows (existing behaviour).

---

### Step 2 — Update call sites in `WorkoutPage.jsx`

Wherever `getLastSessionSets` is called, remove any split-scoping argument:

```js
// BEFORE (example — exact arg list may differ)
const prevSets = getLastSessionSets(ex.name, workoutLogs, activeSplitId);

// AFTER
const prevSets = getLastSessionSets(ex.name, workoutLogs);
```

Search `WorkoutPage.jsx` for all `getLastSessionSets` calls (likely 1–2) and strip the third arg.

Also check `EditWorkoutModal.jsx` — if it calls `getLastSessionSets` to pre-populate an edit form, apply the same change.

---

### Step 3 — Pre-fill happens at session initialisation, not on every render

Confirm that the pre-fill runs **once** when the session's exercise list is built (inside `startSession` or equivalent), not on every re-render. This prevents previously-entered live session values from being overwritten.

The guard should be:
```js
// Only pre-fill if the exercise's sets are currently empty
const needsPrefill = ex.sets.every(s => !s.weight && !s.reps);
if (needsPrefill) {
  ex.sets = getLastSessionSets(ex.name, workoutLogs).length
    ? getLastSessionSets(ex.name, workoutLogs).map(s => ({ ...s, done: false }))
    : ex.sets;  // keep default empty rows
}
```

---

### Step 4 — Handle swapped exercises correctly

When a user taps the swap button during a session and picks a different exercise (stored in `ex.sv`), the next time they start a session:

- If they do the **original** exercise again → pre-fill from the original's history ✅
- If they swap to the **same variant** again → pre-fill from the variant's history ✅

This is already handled by the `exSv` match in Step 1, but confirm the swap variant name is saved correctly to `workout_logs` in the `exercises[].sv` field on session finish (verify in `WorkoutPage.jsx` `finish()` function).

---

### Step 5 — Smoke Tests

| Test | Expected Result |
|------|----------------|
| Upper A: Bench 3×(60kg,8) → Upper B: open Bench | Pre-fills 60kg, 8 reps on all 3 rows |
| Upper A: Bench → swapped to Incline on Upper B (ex.sv = 'Incline Press') → next Upper B | Pre-fills Incline sets from last Incline occurrence |
| Brand new exercise never done before | All set rows empty (no crash) |
| Log with missing sets array | Returns [] gracefully |
| Two logs on same date | Uses the one with higher timestamp / later `startTime` |
| User has no workout history at all | Returns [], all rows start blank |

---

### Files Modified

| File | Change |
|------|--------|
| `src/utils/exerciseHistory.js` | Rewrite `getLastSessionSets` — remove split scoping, add `ex.sv` matching, strip `done` flag |
| `src/components/pages/WorkoutPage.jsx` | Remove split/day argument from all `getLastSessionSets` call sites |
| `src/components/shared/EditWorkoutModal.jsx` | Same argument removal if applicable |

---

---

# Feature 3 — Global PR Tracking (Cross-Split)

> **Ship alongside Feature 2. Same file, same PR.**

## Background & Current Behaviour

The Personal Record badge shown on each set row during a live session (the "PR" pill introduced in the 2026-04-23 bug sprint) is computed by `getAllTimePR(exerciseName, workoutLogs)` in `exerciseHistory.js`. The PR displayed in `ProgressPage.jsx`'s bento stat grid ("Personal Record" card) uses the same or a similar function.

Current problem:
- PR is scoped to workout logs from the current split context, so a bench press PR achieved on Upper A is invisible when the user is on Upper B.
- Alternatively the function scans all logs correctly but the **bug where `s.done` caused silent failures** (noted in 2026-04-23 sprint) may have partially masked cross-split data because only `done: true` sets were counted. This needs to be confirmed and fixed regardless.

## Implementation Plan

### Step 1 — Fix `getAllTimePR` in `exerciseHistory.js`

```js
/**
 * getAllTimePR(exerciseName, workoutLogs)
 *
 * Returns the single highest weight (number) ever logged for
 * `exerciseName` across ALL workout logs, all splits, all days.
 *
 * Weight comparison is numeric. Returns null if no history exists.
 * Does NOT require s.done === true — historical logs don't have this flag.
 * Matches on ex.name and ex.sv (swap variant).
 */
export function getAllTimePR(exerciseName, workoutLogs) {
  if (!exerciseName || !workoutLogs?.length) return null;

  const needle = exerciseName.trim().toLowerCase();
  let pr = null;

  for (const log of workoutLogs) {
    for (const ex of (log.exercises || [])) {
      const exName = (ex.name || '').trim().toLowerCase();
      const exSv   = (ex.sv   || '').trim().toLowerCase();

      if (exName !== needle && exSv !== needle) continue;

      for (const s of (ex.sets || [])) {
        // Accept any set regardless of s.done — historical logs don't carry this flag
        const w = parseFloat(s.weight);
        if (!isNaN(w) && w > 0 && (pr === null || w > pr)) {
          pr = w;
        }
      }
    }
  }

  return pr;
}
```

**Key points:**
- No `splitId` filter — scans entire log array.
- Does **not** require `s.done === true` — this was the original bug. Historical session data never has `done` set on it.
- Matches `ex.sv` for swap variant history.
- Returns `null` (not `0`) on a miss so callers can distinguish "no history" from "PR is 0kg".

---

### Step 2 — PR Badge in `WorkoutPage.jsx` Live Session

During an active session, the PR badge pill on a set row should light up when the user enters a weight that **exceeds** `getAllTimePR(ex.name, workoutLogs)`.

```js
// Per set row render
const globalPR = getAllTimePR(ex.name, workoutLogs); // from all logs
const isNewPR  = globalPR !== null
  && parseFloat(set.weight) > globalPR
  && set.weight !== '';

// Render the PR pill only when isNewPR is true
```

This replaces any current per-split or per-day PR comparison.

**Important:** The live session's own sets (the ones being typed right now) should **not** be included in the PR lookup — only `workoutLogs` (completed historical sessions). This prevents the badge from flickering based on earlier sets within the same current session. The current session is not in `workoutLogs` until `finish()` is called.

---

### Step 3 — PR Badge UX Details

- The pill should appear **as the user types** in the weight field (real-time comparison).
- If a row is the **first set in the session to beat the PR** (e.g. Row 1 beats it), subsequent rows also show the PR pill because the global PR threshold is still the historical one — this is correct.
- After the session is **saved**, the new PR is part of `workoutLogs` and will be the reference point next time. No special "update PR" step needed.
- The PR pill text should show the delta: `PR +2.5kg` when possible, or just `PR` if space is tight on mobile.

---

### Step 4 — `ProgressPage.jsx` — Personal Record card in bento grid

The bento stat grid's "Personal Record" card currently calls some lookup for the selected exercise's PR. Update it to use the fixed `getAllTimePR`:

```js
// Inside ProgressPage — when an exercise is selected from the dropdown
const prValue = getAllTimePR(selectedExercise, workoutLogs);
// Display: prValue !== null ? `${prValue} kg` : '—'
```

This card already exists — just ensure it's calling the updated function with no split argument.

Also confirm:
- The PR value shown updates correctly when the user switches the exercise dropdown.
- The PR value shown matches what would trigger the live session badge (same function, same data).

---

### Step 5 — PR in Post-Session Summary

The post-session summary screen (shown after `FINISH WORKOUT`) currently shows XP gained, sets, and volume. Optionally (and recommended), add a **PR Highlights** section:

```
🏆 New PRs This Session
  Bench Press    85kg  (was 80kg)
  Shoulder Press  52kg  (was 50kg)
```

Implementation:
```js
// In finish() — compute before saving the session
const newPRs = exercises
  .filter(ex => {
    const globalPR = getAllTimePR(ex.name, workoutLogs); // pre-save logs
    const sessionBest = Math.max(...ex.sets.map(s => parseFloat(s.weight) || 0));
    return sessionBest > (globalPR ?? -Infinity);
  })
  .map(ex => ({
    name: ex.name,
    newPR: Math.max(...ex.sets.map(s => parseFloat(s.weight) || 0)),
    oldPR: getAllTimePR(ex.name, workoutLogs),
  }));

// Pass newPRs into the summary screen state
```

Render as a compact list below the XP row, only if `newPRs.length > 0`. Use the ember gradient on the trophy icon. This is additive — do not remove existing summary content.

---

### Step 6 — Smoke Tests

| Test | Expected Result |
|------|----------------|
| Bench 80kg on Upper A last month, do 85kg on Upper B today | PR badge shows on the 85kg set row |
| PR from a swapped exercise (ex.sv = 'Incline Press') | Counted in PR lookup for 'Incline Press' |
| No history for exercise | No PR badge shown, PR card shows `—` |
| All historical sets lack `s.done` | PR lookup still returns correct max weight |
| ProgressPage: switch exercise dropdown | PR card updates to show that exercise's all-time best |
| Post-session summary: beat 2 PRs | PR Highlights section shows both with old → new values |
| Same weight as existing PR (not exceeded) | No PR badge |

---

### Files Modified

| File | Change |
|------|--------|
| `src/utils/exerciseHistory.js` | Rewrite `getAllTimePR` — remove split scoping, remove `s.done` guard, add `ex.sv` matching |
| `src/components/pages/WorkoutPage.jsx` | Update PR badge comparison to use `getAllTimePR(ex.name, workoutLogs)` with no split arg; add PR Highlights to post-session summary |
| `src/components/pages/ProgressPage.jsx` | Confirm Personal Record bento card uses updated `getAllTimePR` with no split argument |

---

---

# Feature 1 — Push & Email Notifications

> **Implement after Features 2 and 3 are shipped.** Requires infra setup, VAPID keys, and Supabase Edge Functions.

## Goals

Send timely, contextual nudges that drive two core behaviors:
1. **Log workouts** on scheduled days (drives Olympus League XP).
2. **Log diet** before end of day (drives streak, macro adherence).

Notifications are framed around **Olympus League positioning** — "You're 400 XP from Silver. One session away." — making them feel motivating rather than nagging.

## Notification Types

| ID | Trigger | Channel | Copy Direction |
|----|---------|---------|----------------|
| `workout-reminder` | User has a workout scheduled today but hasn't started one by 6pm | Push + Email | "Your Upper A session is waiting. Log today and stay on track for the podium." |
| `diet-reminder` | User has logged < 2 meals by 8pm on any day | Push only | "You've only logged 1 meal today. Hit your protein target before bed." |
| `streak-at-risk` | User's workout streak will break at midnight if no session is logged | Push + Email | "⚡ Your X-day streak ends tonight. Quick session — even 20 min counts." |
| `olympus-nudge-weekly` | Sent every Sunday evening with the user's Olympus League standing | Email | "This week: You're ranked #4. [Name] is 200 XP ahead. Train Monday to move up." |
| `olympus-overtaken` | Another user passes the authenticated user on the leaderboard | Push | "You've been overtaken by [Name] in Olympus League. Log a session to reclaim your rank." |
| `podium-proximity` | User is within 500 XP of a podium position (top 3) | Push + Email | "🥈 You're 380 XP from the podium. Two sessions this week could get you there." |

For MVP, implement **`workout-reminder`** and **`diet-reminder`** and **`streak-at-risk`** only. The Olympus-specific ones require real-time leaderboard computation — add in Phase 2.

---

## Technical Architecture

### Channel 1: Web Push (Chrome + Firefox + Edge + Safari)

**How Web Push works:**
1. Browser requests notification permission from the user.
2. If granted, app registers a Service Worker and subscribes to the browser's push service (FCM for Chrome, APNs relay for Safari).
3. The subscription object (endpoint URL + keys) is stored server-side.
4. A backend process sends a push message to the endpoint using the Web Push Protocol (RFC 8030) with VAPID authentication.
5. The Service Worker receives the push event (even when the app tab is closed) and calls `self.registration.showNotification(...)`.

**Safari specifics:**
- macOS Safari 16+ (Ventura) supports Web Push via standard Service Worker API — no special handling needed beyond the standard implementation.
- iOS Safari 16.4+ supports Web Push **only for installed PWAs** (Add to Home Screen). The app must have a `manifest.json` with `display: "standalone"` and the Service Worker must be registered. Users must first install the PWA — a Safari push without installation is not possible.
- iOS push is routed through APNs (Apple's servers) but this is transparent to the developer — the same VAPID + Web Push Protocol is used. No separate APNs certificate is needed in modern Safari.

**VAPID Keys:**
- Generate once: `npx web-push generate-vapid-keys`
- Store public key in `VITE_VAPID_PUBLIC_KEY` (exposed to client for subscription)
- Store private key in Supabase secrets as `VAPID_PRIVATE_KEY` (server-only, never in client bundle)
- Store `VAPID_SUBJECT` (e.g. `mailto:support@fittrackpro.in`) in Supabase secrets

### Channel 2: Email

Use **Resend** (preferred — has a generous free tier and excellent deliverability from Indian IPs) or SendGrid as the email provider. Supabase has a native email sending option but it is limited to auth flows. For product emails, use Resend via a Supabase Edge Function.

**Setup:**
- Create a Resend account at `resend.com`, verify the sending domain (`fittrackpro.in` or subdomain `mail.fittrackpro.in`)
- Store `RESEND_API_KEY` in Supabase secrets
- Edge Function calls Resend API with HTML email body

---

## Phase A — Infrastructure Setup

### A1. Generate VAPID Keys
```bash
npx web-push generate-vapid-keys --json
# Outputs: { publicKey: '...', privateKey: '...' }
```
- Add `VITE_VAPID_PUBLIC_KEY=<publicKey>` to `.env`
- Add `VAPID_PRIVATE_KEY`, `VAPID_PUBLIC_KEY`, and `VAPID_SUBJECT=mailto:hello@fittrackpro.in` to Supabase project secrets via Dashboard → Settings → Edge Functions → Secrets

### A2. PWA Manifest (required for iOS push)

Create `public/manifest.json`:
```json
{
  "name": "FitTrack Pro",
  "short_name": "FitTrack",
  "description": "Your Indian fitness tracker",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#131315",
  "theme_color": "#F85F1B",
  "icons": [
    { "src": "/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icon-512.png", "sizes": "512x512", "type": "image/png" },
    { "src": "/icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
  ]
}
```
- Add `<link rel="manifest" href="/manifest.json">` to `index.html`
- Create PNG icons at 192px and 512px (use the ember flame logo). Place in `public/`.

### A3. Service Worker

Create `public/sw.js`:
```js
// ====================================================
// FitTrack Pro — Service Worker
// Handles: push events, notification clicks, offline cache
// ====================================================

self.addEventListener('push', (event) => {
  if (!event.data) return;

  let payload;
  try {
    payload = event.data.json();
  } catch {
    payload = { title: 'FitTrack Pro', body: event.data.text(), url: '/' };
  }

  const { title, body, url, icon, badge, tag } = payload;

  event.waitUntil(
    self.registration.showNotification(title || 'FitTrack Pro', {
      body:  body  || '',
      icon:  icon  || '/icon-192.png',
      badge: badge || '/icon-192.png',
      tag:   tag   || 'fittrack-general',   // replaces previous notif with same tag
      data:  { url: url || '/' },
      renotify: false,                       // don't vibrate again if tag is same
      requireInteraction: false,
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      // Focus existing tab if open
      for (const client of windowClients) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.focus();
          client.navigate(targetUrl);
          return;
        }
      }
      // Otherwise open a new tab
      if (clients.openWindow) return clients.openWindow(targetUrl);
    })
  );
});
```

Register the Service Worker in `src/main.jsx`:
```js
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(console.error);
  });
}
```

### A4. Supabase — `push_subscriptions` Table

```sql
-- supabase/migrations/YYYYMMDD_push_subscriptions.sql

CREATE TABLE push_subscriptions (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  endpoint      text NOT NULL,
  p256dh        text NOT NULL,   -- subscription key
  auth          text NOT NULL,   -- subscription auth secret
  user_agent    text,            -- browser/platform hint for debugging
  created_at    timestamptz DEFAULT now(),
  updated_at    timestamptz DEFAULT now(),
  UNIQUE (user_id, endpoint)     -- one row per user per browser
);

-- RLS: users can only read/write their own subscriptions
ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own push subscriptions"
  ON push_subscriptions FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
```

### A5. Supabase — `notification_preferences` Table

```sql
-- supabase/migrations/YYYYMMDD_notification_prefs.sql

CREATE TABLE notification_preferences (
  user_id              uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  push_enabled         boolean DEFAULT true,
  email_enabled        boolean DEFAULT true,
  workout_reminder     boolean DEFAULT true,
  diet_reminder        boolean DEFAULT true,
  streak_alert         boolean DEFAULT true,
  olympus_nudge        boolean DEFAULT true,
  reminder_hour        smallint DEFAULT 18,  -- hour of day (24h) for workout reminders; default 6pm
  updated_at           timestamptz DEFAULT now()
);

ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage their own notification preferences"
  ON notification_preferences FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
```

---

## Phase B — Frontend: Permission Request + Subscription Management

### B1. `useNotifications` hook — `src/hooks/useNotifications.js`

```js
/**
 * useNotifications
 *
 * Manages Web Push permission, subscription lifecycle, and
 * notification preference sync with Supabase.
 *
 * Exported:
 *   permission        — 'default' | 'granted' | 'denied'
 *   isSupported       — boolean (false on iOS < 16.4 non-PWA)
 *   isSubscribed      — boolean
 *   requestPermission — async fn — calls Notification.requestPermission()
 *                        then subscribes to push and saves to Supabase
 *   unsubscribe       — async fn — unsubscribes and removes from Supabase
 *   prefs             — current notification_preferences row
 *   updatePrefs       — async fn(partial) — upserts to notification_preferences
 */
export function useNotifications(userId) { ... }
```

Internal flow of `requestPermission()`:
1. Call `Notification.requestPermission()` — returns `'granted'` | `'denied'` | `'default'`.
2. If granted, get the active Service Worker registration.
3. Call `registration.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: urlBase64ToUint8Array(import.meta.env.VITE_VAPID_PUBLIC_KEY) })`.
4. Extract `endpoint`, `keys.p256dh`, `keys.auth` from the subscription object.
5. Upsert to `push_subscriptions` in Supabase (`ON CONFLICT (user_id, endpoint) DO UPDATE`).
6. Set `isSubscribed = true`.

Helper — `urlBase64ToUint8Array(base64String)`:
```js
// Converts VAPID public key from URL-safe Base64 to Uint8Array
// This is a standard utility function, copy from web-push docs
```

### B2. Permission Prompt UI

**Where to show it:** In `ProfilePage.jsx` — add a "Notifications" glass card section between "Metabolism & Targets" and "Muscle Mastery". Do NOT use a browser-style popup on first load — this is terrible UX and browsers block auto-triggered permission requests. Always require a user tap first.

```
┌─────────────────────────────────┐
│ 🔔  Notifications               │
│                                 │
│ Get reminders to log workouts   │
│ and diet, and stay on top of    │
│ your Olympus League rank.       │
│                                 │
│ [Enable Notifications]          │  ← ember gradient CTA button
│                                 │
│ — or if already enabled: —      │
│                                 │
│ Workout reminders  [toggle]     │
│ Diet reminders     [toggle]     │
│ Streak alerts      [toggle]     │
│ Olympus League     [toggle]     │
│                                 │
│ Reminder time: [6:00 PM ▾]     │
└─────────────────────────────────┘
```

States:
- `isSupported === false` (old iOS Safari, desktop Firefox private mode): Show a grey card with "Notifications not supported on this browser." Do not show the CTA.
- `permission === 'denied'`: Show "Notifications blocked. Enable them in your browser settings." with a settings icon link. Do not show the CTA (re-requesting is futile).
- `permission === 'default'` or `!isSubscribed`: Show the CTA.
- `permission === 'granted' && isSubscribed`: Show the preference toggles only.

**iOS PWA Install prompt:** On iOS Safari where the app is not yet installed as a PWA, add a small info chip below the CTA:
> "📱 On iPhone: tap Share → 'Add to Home Screen' first, then enable notifications."

Show this chip only when: `navigator.userAgent.includes('Safari')` and NOT `window.matchMedia('(display-mode: standalone)').matches`.

### B3. Notification Preferences in AppContext

Add to the context's local-only state and surface via `useNotifications`:
```js
// notification preferences — loaded once from Supabase on login, then local
const [notifPrefs, setNotifPrefs] = useState(null);
```

Expose `updateNotifPrefs(partial)` that upserts to `notification_preferences` and updates local state optimistically.

---

## Phase C — Backend: Supabase Edge Functions

All scheduled notification sending happens in Supabase Edge Functions (Deno runtime). These are triggered by Supabase's `pg_cron` scheduler.

### C1. Edge Function: `send-workout-reminder`

**Trigger:** pg_cron, daily at 18:00 IST (12:30 UTC)

**Logic:**
1. Query `user_profiles` for all users where today (IST date) is in their `workout_days` array.
2. Left join `workout_logs` to check if they have any log for today's date (IST).
3. Keep only users who have **no log today** (they haven't worked out yet).
4. Filter by users who have `notification_preferences.workout_reminder = true`.
5. For each matching user:
   - Fetch their `push_subscriptions` rows.
   - Send a push notification via Web Push Protocol using the `web-push` npm package.
   - If `notification_preferences.email_enabled = true`, also send an email via Resend.
6. Log results (sent count, failed count) to a `notification_logs` table for debugging.

**Push payload:**
```json
{
  "title": "FitTrack Pro — Time to Train",
  "body": "Your workout is scheduled for today. Log it now and earn Olympus XP.",
  "url": "/workout",
  "tag": "workout-reminder",
  "icon": "/icon-192.png"
}
```

**Email template (HTML):** Transactional email with:
- Subject: `"Your [Split Name] session is waiting, [First Name]"`
- Hero section: Olympus League rank + XP to next tier (pull from `workout_logs` aggregation)
- CTA button: `"Start My Workout"` → `https://fittrackpro.in/workout`
- Footer: unsubscribe link that POSTs to a `/unsubscribe` edge function

**IST timezone handling:**
```js
// Supabase Edge Functions run in UTC. Convert to IST before date comparisons.
const now = new Date();
const istOffset = 5.5 * 60 * 60 * 1000; // UTC+5:30
const istDate = new Date(now.getTime() + istOffset);
const todayIST = istDate.toISOString().split('T')[0]; // 'YYYY-MM-DD'
```

**Web Push sending in Deno:**
The `web-push` npm package works in Deno via the `npm:` specifier:
```js
import webpush from 'npm:web-push@3.6.7';

webpush.setVapidDetails(
  Deno.env.get('VAPID_SUBJECT'),
  Deno.env.get('VAPID_PUBLIC_KEY'),
  Deno.env.get('VAPID_PRIVATE_KEY')
);

await webpush.sendNotification(subscription, JSON.stringify(payload));
```

Handle `410 Gone` responses: if the push service returns 410 or 404, the subscription is expired — delete it from `push_subscriptions`.

### C2. Edge Function: `send-diet-reminder`

**Trigger:** pg_cron, daily at 20:00 IST (14:30 UTC)

**Logic:**
1. Get all users with `notification_preferences.diet_reminder = true`.
2. For each user, count `food_logs` entries where `created_at` date (IST) = today AND `user_id = <user>`.
3. If count < 2 (fewer than 2 meals logged today): send a push notification.
4. No email for diet reminders — push only (too frequent for email).

**Push payload:**
```json
{
  "title": "Log Your Meals 🍛",
  "body": "You've logged less than 2 meals today. Hit your protein target.",
  "url": "/diet",
  "tag": "diet-reminder",
  "icon": "/icon-192.png"
}
```

### C3. Edge Function: `send-streak-alert`

**Trigger:** pg_cron, daily at 22:00 IST (16:30 UTC)

**Logic:**
1. Get all users with `notification_preferences.streak_alert = true`.
2. For each user, compute their current streak (same logic as `getStreak()` in AppContext).
3. Check if they have a workout log for today (IST).
4. If streak > 2 days AND no log today: send push (and email if streak > 7 days — long streaks warrant email urgency).

**Push payload (dynamic):**
```json
{
  "title": "⚡ Streak at Risk",
  "body": "Your 14-day streak ends at midnight. Log a session — even a quick one.",
  "url": "/workout",
  "tag": "streak-alert",
  "icon": "/icon-192.png"
}
```

### C4. Edge Function: `send-olympus-weekly`

**Trigger:** pg_cron, every Sunday at 19:00 IST (13:30 UTC)

**Logic:**
1. For each user, compute their current Olympus rank position relative to all other users (same leaderboard logic as `MuscleMapPage.jsx`).
2. Compute XP gap to the person ahead, and to the podium (top 3).
3. Send a weekly email summary:
   - Subject: `"Your Olympus Week — Rank #X, [Tier Name]"`
   - Body: current rank, XP this week, XP to next tier, XP to podium, top 3 names
   - CTA: `"Train This Week"` → `/muscle-map`
4. Send push only if user is within 500 XP of a podium position.

**Email is the primary channel here** — weekly digest emails have high open rates and are appropriate for this cadence. Push for podium proximity only.

### C5. pg_cron Schedule Configuration

```sql
-- supabase/migrations/YYYYMMDD_cron_schedules.sql

-- Enable pg_cron (already available in Supabase)
SELECT cron.schedule(
  'workout-reminder-daily',
  '30 12 * * *',  -- 18:00 IST = 12:30 UTC
  $$SELECT net.http_post(
    url := 'https://<project-ref>.supabase.co/functions/v1/send-workout-reminder',
    headers := '{"Authorization": "Bearer <service-role-key>", "Content-Type": "application/json"}'::jsonb,
    body := '{}'::jsonb
  )$$
);

SELECT cron.schedule(
  'diet-reminder-daily',
  '30 14 * * *',  -- 20:00 IST = 14:30 UTC
  $$SELECT net.http_post(...)$$
);

SELECT cron.schedule(
  'streak-alert-daily',
  '30 16 * * *',  -- 22:00 IST = 16:30 UTC
  $$SELECT net.http_post(...)$$
);

SELECT cron.schedule(
  'olympus-weekly-sunday',
  '30 13 * * 0',  -- Sunday 19:00 IST = 13:30 UTC
  $$SELECT net.http_post(...)$$
);
```

Note: The `net.http_post` function is available in Supabase via the `pg_net` extension. Alternatively use `supabase-js` admin client inside the Edge Function invoked by a cron job in the Supabase dashboard (Dashboard → Edge Functions → Schedule).

---

## Phase D — `notification_logs` Table (for debugging)

```sql
-- supabase/migrations/YYYYMMDD_notification_logs.sql

CREATE TABLE notification_logs (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  notification_type text NOT NULL,    -- 'workout-reminder' | 'diet-reminder' | etc.
  user_id         uuid REFERENCES auth.users(id),
  channel         text NOT NULL,      -- 'push' | 'email'
  status          text NOT NULL,      -- 'sent' | 'failed' | 'skipped'
  error_message   text,
  sent_at         timestamptz DEFAULT now()
);

-- No RLS on this table — Edge Functions write with service role key
-- Admins can query this for debugging. Regular users have no access.
```

---

## Phase E — Email Template Design

All emails must match the Kinetic Elite design system:
- Background: `#131315` (Obsidian Canvas)
- Accent: `#F85F1B` (Burning Ember) for CTA button
- Text: `#EAEAF0` (Primary on-surface)
- Font: System fallback (`-apple-system, 'Segoe UI', sans-serif`) — web fonts don't reliably load in email clients
- Use inline CSS only (no external stylesheets in email)
- Test in Gmail app (Android/iOS), Apple Mail, Outlook (web), and Gmail web

**Recommended email structure (for all types):**
```
[Header: FitTrack Pro wordmark + ember flame icon]
[Hero: 1 large number or stat — e.g. "Rank #4" in 48px]
[Body copy: 2–3 lines max]
[CTA button: ember background, white text, 48px tall]
[Divider]
[3-stat strip: Sessions This Week | XP Earned | Protein Avg]
[Footer: Unsubscribe · Privacy · FitTrack Pro]
```

---

## Phase F — Unsubscribe Flow

All emails must have an unsubscribe link (legal requirement in India under TRAI regulations, and required by email providers to maintain deliverability).

### Edge Function: `unsubscribe`

```
GET /functions/v1/unsubscribe?user_id=<uuid>&type=<notification_type>&token=<hmac>
```

- `token` is an HMAC-SHA256 of `user_id + type` using `UNSUBSCRIBE_SECRET` from Supabase secrets.
- Verify token before processing (prevents CSRF / enumeration attacks).
- On success: upsert `notification_preferences` with the relevant column set to `false`.
- Return a plain HTML page: "You've been unsubscribed from [type] emails. [Re-enable in app]"

This keeps the unsubscribe flow completely stateless — no session required.

---

## Phase G — iOS PWA Install Prompt

Since iOS push requires PWA installation, add a smart install prompt on mobile:

**Where:** A dismissable banner on the Dashboard (mobile only), shown once per app session, only if:
- `navigator.userAgent.includes('iPhone') || navigator.userAgent.includes('iPad')`
- `!window.matchMedia('(display-mode: standalone)').matches` (not already installed)
- User has not dismissed the banner in the last 14 days (check localStorage `fittrack_pwa_prompt_dismissed`)

**Banner copy:**
> "📱 Add FitTrack to your Home Screen to get workout and diet notifications on iPhone."
> `[Add to Home Screen →]`  `[Dismiss]`

Tapping `[Add to Home Screen →]` opens a bottom sheet with step-by-step instructions:
1. Tap the **Share button** (square with arrow) in Safari's toolbar
2. Scroll down and tap **"Add to Home Screen"**
3. Tap **"Add"** in the top right

This is the standard iOS PWA install guidance pattern (Apple does not allow a programmatic install prompt unlike Android).

---

## Phase H — Android Chrome Install Prompt

Chrome on Android fires the `beforeinstallprompt` event when the app is installable. Intercept it and show a non-intrusive banner.

```js
// In main.jsx or App.jsx
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  // Show a subtle "Install App" chip in the header or Dashboard
});

// When the user taps the chip:
const handleInstallClick = async () => {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  deferredPrompt = null;
  // If outcome === 'accepted', show "Welcome to FitTrack Pro" toast
};
```

After installation, Android Chrome will auto-subscribe to push if permission was already granted. If not, show the notification permission CTA in Profile as usual.

---

## Notification Preference Defaults

| Preference | Default | Rationale |
|-----------|---------|-----------|
| `push_enabled` | `true` | Opt-out model — if user grants permission, assume they want nudges |
| `email_enabled` | `true` | Same — email is less intrusive than push |
| `workout_reminder` | `true` | Core value prop |
| `diet_reminder` | `true` | Core value prop |
| `streak_alert` | `true` | High emotional engagement |
| `olympus_nudge` | `true` | Differentiator — unique to FitTrack |
| `reminder_hour` | `18` (6pm) | Covers gym-going window; user can change to 5pm or 7pm |

---

## Files to Create / Modify — Feature 1

| File | Status | Purpose |
|------|:------:|---------|
| `public/sw.js` | 🆕 NEW | Service Worker — push event handler, notification click handler |
| `public/manifest.json` | 🆕 NEW | PWA manifest for iOS install |
| `public/icon-192.png` | 🆕 NEW | App icon for notifications |
| `public/icon-512.png` | 🆕 NEW | App icon for PWA splash |
| `src/hooks/useNotifications.js` | 🆕 NEW | Permission request, subscribe, unsubscribe, preference management |
| `src/components/pages/ProfilePage.jsx` | ✏️ MODIFY | Add Notifications card with CTA and preference toggles |
| `src/components/pages/DashboardPage.jsx` | ✏️ MODIFY | Add iOS PWA install prompt banner (mobile only) |
| `src/main.jsx` | ✏️ MODIFY | Register Service Worker; intercept `beforeinstallprompt` |
| `index.html` | ✏️ MODIFY | Add `<link rel="manifest">` and `<meta name="theme-color">` |
| `src/context/AppContext.jsx` | ✏️ MODIFY | Add `notifPrefs` state + `updateNotifPrefs` method |
| `supabase/migrations/YYYYMMDD_push_subscriptions.sql` | 🆕 NEW | `push_subscriptions` table + RLS |
| `supabase/migrations/YYYYMMDD_notification_prefs.sql` | 🆕 NEW | `notification_preferences` table + RLS |
| `supabase/migrations/YYYYMMDD_notification_logs.sql` | 🆕 NEW | `notification_logs` table |
| `supabase/migrations/YYYYMMDD_cron_schedules.sql` | 🆕 NEW | pg_cron schedules for all 4 notification types |
| `supabase/functions/send-workout-reminder/index.ts` | 🆕 NEW | Edge Function — workout reminder push + email |
| `supabase/functions/send-diet-reminder/index.ts` | 🆕 NEW | Edge Function — diet reminder push |
| `supabase/functions/send-streak-alert/index.ts` | 🆕 NEW | Edge Function — streak-at-risk push + email |
| `supabase/functions/send-olympus-weekly/index.ts` | 🆕 NEW | Edge Function — weekly Olympus league email |
| `supabase/functions/unsubscribe/index.ts` | 🆕 NEW | Edge Function — stateless email unsubscribe |

---

## Files to Create / Modify — Features 2 & 3

| File | Status | Purpose |
|------|:------:|---------|
| `src/utils/exerciseHistory.js` | ✏️ MODIFY | Rewrite `getLastSessionSets` and `getAllTimePR` — remove split scoping, add `ex.sv` matching, remove `s.done` guard |
| `src/components/pages/WorkoutPage.jsx` | ✏️ MODIFY | Remove split arg from call sites; update PR badge logic; add PR Highlights to post-session summary |
| `src/components/pages/ProgressPage.jsx` | ✏️ MODIFY | Confirm Personal Record bento card uses updated `getAllTimePR` without split arg |
| `src/components/shared/EditWorkoutModal.jsx` | ✏️ MODIFY | Remove split arg from `getLastSessionSets` call if present |

---

## Implementation Order

```
Phase 1 (this sprint):
  [ ] Fix getLastSessionSets — cross-split (Feature 2, Step 1)
  [ ] Fix getAllTimePR — cross-split (Feature 3, Step 1)
  [ ] Update WorkoutPage call sites — remove split args (Features 2+3, Steps 2+2)
  [ ] Update PR badge in live session (Feature 3, Step 2+3)
  [ ] Update ProgressPage PR card (Feature 3, Step 4)
  [ ] Add PR Highlights to post-session summary (Feature 3, Step 5)
  [ ] Run smoke tests for Features 2+3

Phase 2 (next sprint):
  [ ] Generate VAPID keys, add to .env + Supabase secrets
  [ ] Create public/manifest.json + icons
  [ ] Create public/sw.js
  [ ] Register SW in main.jsx
  [ ] Add <link manifest> + <meta theme-color> to index.html
  [ ] Create useNotifications.js hook
  [ ] Add Notifications card to ProfilePage
  [ ] Add iOS PWA banner to DashboardPage
  [ ] Add Android beforeinstallprompt intercept to main.jsx
  [ ] Run DB migrations: push_subscriptions, notification_preferences, notification_logs

Phase 3 (infra sprint):
  [ ] Create supabase/functions/send-workout-reminder
  [ ] Create supabase/functions/send-diet-reminder
  [ ] Create supabase/functions/send-streak-alert
  [ ] Create supabase/functions/send-olympus-weekly
  [ ] Create supabase/functions/unsubscribe
  [ ] Set up Resend account + verify domain
  [ ] Create pg_cron schedules migration
  [ ] Test Edge Functions locally with Supabase CLI: supabase functions serve
  [ ] Deploy Edge Functions: supabase functions deploy <name>
  [ ] Test end-to-end on staging: trigger a notification manually, verify push + email delivery
  [ ] Test on iOS Safari PWA install + push flow
  [ ] Test on Android Chrome + beforeinstallprompt flow

Phase 4 (Olympus-specific notifications):
  [ ] olympus-overtaken push (requires real-time leaderboard scoring in DB)
  [ ] podium-proximity push (within 500 XP of top 3)
  [ ] Send olympus-weekly with live rank data from workout_logs aggregation
```

---

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|-----------|
| iOS push requires PWA install | Many users won't see push on iOS initially | Show install prompt banner early; email is the primary channel for iOS users |
| Users denying notification permission | No push delivery | Email is the fallback; never auto-prompt on page load |
| Email deliverability from Indian IPs | Emails land in spam | Use Resend with verified domain; add SPF, DKIM, DMARC DNS records |
| VAPID private key leak | All push subscriptions compromised | Store only in Supabase secrets, never in client bundle or git |
| pg_cron Edge Function timeout | Notifications not sent | Batch users in chunks of 100; use Supabase queue pattern if scale requires |
| Timezone bugs (IST vs UTC) | Wrong reminder time | Always compute IST dates explicitly in Edge Functions; never rely on server's local TZ |
| Duplicate notifications (double trigger) | User annoyance | Use `notification_logs` to check for same-day sends before firing |
| `web-push` in Deno compatibility | Edge Function fails | Pin to `npm:web-push@3.6.7`; test locally with `supabase functions serve` |

---

## State.md Updates Required (after ship)

After each phase is complete, update `State.md`:

**After Phase 1 (Features 2+3):**
- Update `exerciseHistory.js` description under Data/Utils
- Add note under WorkoutPage: "Pre-fill and PR badge are now cross-split (all-time, all-splits)"
- Remove "PR is per-split" from Known Gaps

**After Phase 2 (Frontend notifications):**
- Add `useNotifications.js` to hooks table
- Add `sw.js` and `manifest.json` to file structure
- Add Notifications card to ProfilePage description

**After Phase 3 (Edge Functions):**
- Add `push_subscriptions` and `notification_preferences` to Data State table
- Add `notification_logs` table
- Add Edge Functions to a new "Edge Functions" section
- Add Resend as an external service dependency