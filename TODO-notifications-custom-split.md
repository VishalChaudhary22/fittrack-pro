# FitTrack Pro — Feature Sprint TODO
# Notifications · Exercise Swap Sync · Custom Splits

> **Created:** 2026-05-17  
> **Status:** Planning complete — **gap review applied 2026-05-17, partially implemented**  
> **Affects:** `WorkoutPage.jsx`, `SplitsPage.jsx`, `AppContext.jsx`, `App.jsx`, `Layout.jsx`, `splits.js`, `exerciseHistory.js`, `src/sw.js` (existing — Workbox/VitePWA), `useNotifications.js` (existing), `supabase/functions/`, `supabase/migrations/`

---

## Overview & Priority Order

| # | Feature | Priority | Complexity | Estimated Scope |
|---|---------|:--------:|:----------:|-----------------|
| 1 | Notification system — web push + weekly email | 🔴 P0 | High | 6 files new, 4 modified |
| 2 | Exercise swap cross-day sync (A↔B parity) | 🟠 P1 | Medium | 2 files modified |
| 3 | User-created custom splits | 🟡 P2 | High | 3 files new, 3 modified |

---

## Feature 1 — Notification System (Web Push + Weekly Email)

### Background & Current State

The backend is largely built:
- **Edge Functions** deployed: `send-workout-reminder`, `send-diet-reminder`, `send-streak-alert`, `send-olympus-weekly`
- **Shared push logic** lives in `supabase/functions/_shared/push.ts`
- **`pg_cron` scheduling** wired in migration `20260501091225_schedule_push_notifications.sql`
- **`push_subscriptions` table** and **`notification_logs` table** exist in Supabase
- **VAPID keys** should already be set as Supabase Edge Function secrets

**What is missing (confirmed after codebase gap review 2026-05-17):**
- ✅ ~~Frontend ServiceWorker~~ — `src/sw.js` exists with push + notificationclick handlers (Workbox/VitePWA). **Needs:** tag-based dedup, `notificationclose` handler
- ✅ ~~Push subscription logic~~ — `src/hooks/useNotifications.js` has `subscribeToPush()`. **Needs:** `unsubscribeFromPush()`, master toggle
- ❌ Permission request UI (NotificationPrompt bottom-sheet) — not implemented
- ✅ ~~Notification preferences UI~~ — exists in ProfilePage (lines 485-523). **Needs:** weekly email toggle, master disable toggle
- ❌ Weekly email / newsletter — not implemented at all (push only)
- ❌ Olympus League reward push when a user climbs a tier — not implemented
- ✅ ~~`VITE_VAPID_PUBLIC_KEY`~~ — already in `.env` line 8
- ✅ ~~`push_subscriptions` + `notification_logs` tables~~ — exist in `20260501000000_push_notifications.sql`
- ✅ ~~`notification_preferences` table~~ — exists with flat columns (workout_reminders, diet_reminders, etc.)
- ❌ `badge-72.png` monochrome icon — not created
- ❌ `unsubscribeFromPush()` — no unsubscribe logic exists anywhere

---

### Phase 1-A — ServiceWorker & Push Subscription Frontend

#### 1. ~~Create `public/sw.js`~~ Update `src/sw.js` — Service Worker (Workbox/VitePWA)

> ✅ **EXISTS:** `src/sw.js` already handles `push` and `notificationclick` events via Workbox precaching. Only the enhancements below are needed.

```js
// ALREADY IMPLEMENTED — push handler + notificationclick handler
// NEEDS ADDING:
self.addEventListener('notificationclose', (event) => { /* analytics log */ });
// Tag-based deduplication in push handler options
```

Requirements:
- Listen for `push` events; parse JSON payload `{ title, body, icon, url, tag }` ✅ **DONE**
- Show notification via `self.registration.showNotification(title, { body, icon, badge, data: { url } })` ✅ **DONE**
- `icon`: use `/fittrack-icon-192.png` ✅ **DONE** (already referenced in existing SW)
- `badge`: use `/badge-72.png` (monochrome, 72×72) ❌ **TODO — file does not exist yet**
- On `notificationclick`: `clients.openWindow(event.notification.data.url)` ✅ **DONE**
- **❌ ADD: Tag-based deduplication** — notifications with the same `tag` replace each other (prevents stacking daily reminders). Add `tag: data.tag || data.type` to showNotification options.
- **❌ ADD: `notificationclose` event handler** — log analytics if desired

#### 2. ~~Create `src/utils/pushUtils.js`~~ Extend `src/hooks/useNotifications.js` — Subscription Helper

> ✅ **EXISTS:** `useNotifications.js` already contains `subscribeToPush()`, `urlBase64ToUint8Array()`, `updatePreferences()`, and Supabase integration. Extend it instead of creating a new file.
export async function subscribeToPush(userId) { ... }
export async function unsubscribeFromPush(userId) { ... }
export async function isPushSupported() { ... }
export async function getPushPermissionState() { ... }
```

Key logic (items needing implementation marked ❌):
- ✅ `subscribeToPush()` — already implemented: requests permission, subscribes to push, upserts to Supabase
- ❌ `unsubscribeFromPush(userId)` — **NOT IMPLEMENTED.** Must:
  1. Get current subscription from `pushManager.getSubscription()`
  2. Call `subscription.unsubscribe()`
  3. Delete the row from `push_subscriptions` by endpoint
- ✅ `isPushSupported()` — can be derived from existing checks in `subscribeToPush`
- ✅ `VITE_VAPID_PUBLIC_KEY` — already in `.env` line 8 and used via `import.meta.env`
  1. Calls `registration.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: urlBase64ToUint8Array(VITE_VAPID_PUBLIC_KEY) })`
  2. Serialises the `PushSubscription` object
  3. Upserts to Supabase `push_subscriptions` table: `{ user_id, endpoint, p256dh, auth, user_agent, created_at }`
- `unsubscribeFromPush(userId)`:
  1. Gets current subscription from `pushManager.getSubscription()`
  2. Calls `subscription.unsubscribe()`
  3. Deletes the row from `push_subscriptions` by endpoint
- `isPushSupported()`: returns `'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window`
- `VITE_VAPID_PUBLIC_KEY` must be added to `.env` and exposed via `import.meta.env`

#### 3. ~~Modify `src/main.jsx`~~ — SW Registration (**SKIP — VitePWA auto-registers**)

> ✅ **NOT NEEDED:** VitePWA plugin handles service worker registration automatically. The existing `src/sw.js` is bundled and registered by the build system. Manual registration in `main.jsx` would conflict with the Workbox precaching setup.

#### 4. ~~Modify `src/context/AppContext.jsx`~~ Push state lives in `useNotifications.js` hook

> ⚠️ **ARCHITECTURE NOTE:** Push state (`permission`, `preferences`, `subscribeToPush`) already lives in `src/hooks/useNotifications.js`, not AppContext. Adding duplicate state to AppContext would create dual sources of truth. Instead, extend the existing hook.

Enhancements needed in `useNotifications.js`:
```js
const [pushEnabled, setPushEnabled] = useState(false);
const [pushPermission, setPushPermission] = useState('default'); // 'default'|'granted'|'denied'
```

On `loadCloudData`:
- Query `push_subscriptions` where `user_id = userId` — if a row exists, set `pushEnabled = true`
- Check `Notification.permission` and sync to `pushPermission`

Expose via context: `pushEnabled`, `pushPermission`, `enablePush()`, `disablePush()`

`enablePush()`:
1. Calls `Notification.requestPermission()`
2. If `granted` → calls `subscribeToPush(userId)` → sets `pushEnabled = true`
3. If `denied` → shows toast: "Notifications blocked. Enable in browser settings."

`disablePush()`:
1. Calls `unsubscribeFromPush(userId)`
2. Sets `pushEnabled = false`

---

### Phase 1-B — Permission Request UI

#### 5. Create `src/components/shared/NotificationPrompt.jsx`

A bottom-sheet prompt that appears **once** after the user completes their second workout session (first-time reward moment, not on first open — avoids permission denial from cold prompts).

Appearance triggers (all must be true):
- `pushPermission === 'default'` (never asked)
- `workoutLogs.length >= 2` (has meaningful data to be notified about)
- `localStorage.getItem('fittrack_notif_prompt_dismissed')` is null (not permanently dismissed)

UI structure (Kinetic Elite glassmorphic bottom sheet):
```
┌─────────────────────────────────────────┐
│  🔔  Stay on track                      │
│  Get nudges when it matters most —      │
│  workout reminders, streak alerts, and  │
│  your weekly Olympus rank update.       │
│                                         │
│  [Enable Notifications]  [Not now]      │
└─────────────────────────────────────────┘
```

- "Enable Notifications" → calls `enablePush()` from context
- "Not now" → sets `localStorage.setItem('fittrack_notif_prompt_dismissed', Date.now())` — re-shows after 14 days
- "Not now" does NOT set permission to denied (that's browser-level)
- Render via `Portal` to escape z-index stacking

Where to mount: inside `Layout.jsx` so it appears globally regardless of active route.

#### 6. Modify `src/components/layout/Layout.jsx`

Import and render `<NotificationPrompt />` inside the layout root (below nav, above page content). It self-manages its own visibility.

---

### Phase 1-C — Notification Preferences UI

#### 7. Modify `src/components/pages/ProfilePage.jsx` — Notifications Section

Add a "Notifications" section card between the Metabolism card and the Muscle Mastery card.

```
┌─────────────────────────────────────────────┐
│  🔔  Notifications                          │
│                                             │
│  [Toggle: Master Switch]  Push alerts       │
│  ─────────────────────────────────────────  │
│  Workout reminder         [Toggle]  6:00 PM │
│  Diet / macro nudge       [Toggle]  8:00 PM │
│  Streak alert             [Toggle]  7:00 AM │
│  Olympus weekly update    [Toggle]  Sunday  │
│                                             │
│  📧  Weekly email summary  [Toggle]         │
│  Sent every Sunday with your week's stats   │
└─────────────────────────────────────────────┘
```

State model — ~~add `notificationPrefs` to `user_profiles` (JSONB)~~ extend existing `notification_preferences` table:

> ⚠️ **SCHEMA CORRECTION:** A separate `notification_preferences` table already exists (created in `20260501000000_push_notifications.sql`) with flat columns: `workout_reminders`, `diet_reminders`, `streak_alerts`, `olympus_weekly`, `olympus_overtaken`, `podium_proximity`. This table is actively queried by `useNotifications.js` and all 4 edge functions. **Do NOT create a parallel JSONB column on `user_profiles`.** Extend the existing table instead.

Columns to ADD to `notification_preferences`:
```sql
ALTER TABLE notification_preferences
ADD COLUMN IF NOT EXISTS email_weekly BOOLEAN DEFAULT false;
```

The existing `useNotifications.js` hook already reads/writes this table. Edge functions query it directly. No JSONB migration needed.

- Master switch: calls `subscribeToPush()` / new `unsubscribeFromPush()` from `useNotifications` hook
- Individual toggles: already implemented in ProfilePage via `updatePreferences({ [key]: value })` ✅
- Supabase Edge Functions already read flat columns from `notification_preferences` to decide whether to send ✅
- **❌ MISSING:** `email_weekly` toggle in ProfilePage UI
- **❌ MISSING:** Master disable toggle (unsubscribe button) when permission is already granted

> **Note:** Time pickers for individual reminder times are Phase 1-D (deferred). For now, use hardcoded defaults with a "Coming soon: customize time" note.

---

### Phase 1-D — Weekly Email Newsletter

This requires an email delivery service. Recommended: **Resend** (free tier: 3,000 emails/month, excellent Supabase integration, TypeScript SDK).

#### 8. Create `supabase/functions/send-weekly-email/index.ts`

Triggered by `pg_cron` every Sunday at 8:00 AM IST (02:30 UTC).

Email content (per user):
```
Subject: Your FitTrack Week in Review 💪

Hi [Name],

Here's your week at a glance:

🏋️ WORKOUTS
  Sessions completed: 4 / 5 planned
  Total volume: 12,400 kg
  Longest streak: 6 days

🍽 NUTRITION
  Avg daily calories: 2,180 kcal
  Protein goal hit: 5 / 7 days
  Best day: Wednesday (2,340 kcal, 178g protein)

🏆 OLYMPUS LEAGUE
  Current rank: Iron League — Top 34%
  XP earned this week: +1,240 XP
  Trending muscle: Chest (+380 XP)
  [View your rank →]

📈 THIS WEEK'S HIGHLIGHT
  New PR on Bench Press: 90kg × 5 reps

Keep climbing. 🔥
The FitTrack Team

[Open App →]  [Unsubscribe]
```

Implementation steps:
1. Add `RESEND_API_KEY` as Supabase Edge Function secret
2. Create HTML email template (inline CSS only — email clients strip `<style>` blocks)
3. Query `user_profiles` for users where `notification_prefs->>'email_weekly' = 'true'`
4. For each user, query last 7 days of `workout_logs`, `food_logs`, `health_logs`
5. Compute week summary stats
6. Send via Resend API: `POST https://api.resend.com/emails`
7. Log to `notification_logs` table: `{ user_id, type: 'email_weekly', sent_at, status }`

#### 9. Add Resend to `pg_cron` schedule

In new migration `20260517_weekly_email_schedule.sql`:
```sql
SELECT cron.schedule(
  'weekly-email-sunday',
  '30 2 * * 0',  -- 02:30 UTC = 08:00 IST every Sunday
  $$SELECT net.http_post(
    url := current_setting('app.supabase_url') || '/functions/v1/send-weekly-email',
    headers := jsonb_build_object('Authorization', 'Bearer ' || current_setting('app.service_role_key')),
    body := '{}'::jsonb
  )$$
);
```

---

### Phase 1-E — Olympus League Rank-Up Push

#### 10. Add tier-change detection to `send-olympus-weekly/index.ts`

Currently `send-olympus-weekly` sends a weekly summary. Extend it (or create a separate trigger) to fire an **instant push** when a user's XP crosses a tier boundary.

Tier thresholds (from `muscleData.js`):
```
Bronze → Silver: 5,000 XP
Silver → Gold: 15,000 XP  
Gold → Platinum: 30,000 XP
Platinum → Diamond: 60,000 XP
```

Implementation:
- Add `last_known_tier` column to `user_profiles` (or `notification_logs`)
- On each `workout_logs` insert (via Supabase database trigger or within the weekly cron), compute current total XP
- If `currentTier !== lastKnownTier` → fire push immediately via the shared `push.ts` helper:
  ```
  🏆 You've reached SILVER LEAGUE!
  You're now in the top 40% of FitTrack athletes.
  Keep training — Gold is 9,800 XP away.
  ```
- Update `last_known_tier` in `user_profiles`
- This should use a Supabase **database webhook** on `workout_logs` INSERT rather than cron, for immediacy

#### 11. Create `supabase/migrations/20260517_notification_enhancements.sql`

```sql
-- Extend existing notification_preferences table (NOT user_profiles JSONB)
-- The notification_preferences table was created in 20260501000000_push_notifications.sql
ALTER TABLE notification_preferences
ADD COLUMN IF NOT EXISTS email_weekly BOOLEAN DEFAULT false;

-- Add last_known_tier for rank-up push detection (on user_profiles)
ALTER TABLE user_profiles
ADD COLUMN IF NOT EXISTS last_known_tier TEXT DEFAULT 'Unranked';

-- Add email column to user_profiles (if not already present from auth)
ALTER TABLE user_profiles
ADD COLUMN IF NOT EXISTS email TEXT;
```

---

### Phase 1 — File Checklist

| File | Action | Status | Notes |
|------|--------|--------|-------|
| `src/sw.js` | ✅ EXISTS / ✏️ ENHANCE | ⚠️ Partial | Add `tag` dedup + `notificationclose` handler |
| `public/fittrack-icon-192.png` | ✅ EXISTS | Done | Already referenced by SW (68 bytes — verify not placeholder) |
| `public/badge-72.png` | 🆕 CREATE | ❌ TODO | Monochrome badge for Android notification bar |
| `src/hooks/useNotifications.js` | ✅ EXISTS / ✏️ ENHANCE | ⚠️ Partial | Add `unsubscribeFromPush()`, expose `isPushSupported()` |
| `src/components/shared/NotificationPrompt.jsx` | 🆕 CREATE | ❌ TODO | Bottom-sheet permission prompt |
| `supabase/functions/send-weekly-email/index.ts` | 🆕 CREATE | ❌ TODO | Resend-powered weekly digest |
| `supabase/migrations/20260517_notification_enhancements.sql` | 🆕 CREATE | ❌ TODO | `email_weekly` column + `last_known_tier` column |
| ~~`src/main.jsx`~~ | ❎ SKIP | N/A | VitePWA auto-registers SW — no manual registration needed |
| ~~`src/context/AppContext.jsx`~~ | ❎ SKIP | N/A | Push state lives in `useNotifications.js` hook |
| `src/components/layout/Layout.jsx` | ✏️ MODIFY | ❌ TODO | Mount `<NotificationPrompt />` globally |
| `src/components/pages/ProfilePage.jsx` | ✅ EXISTS / ✏️ ENHANCE | ⚠️ Partial | Add `email_weekly` toggle + master disable toggle |
| `supabase/functions/send-olympus-weekly/index.ts` | ✏️ MODIFY | ❌ TODO | Add tier-change detection + instant rank-up push |
| ~~`.env`~~ | ✅ DONE | Done | `VITE_VAPID_PUBLIC_KEY` already present |

---

### Phase 1 — Test Cases

1. **SW registration**: Open DevTools → Application → Service Workers → confirm `sw.js` registered with status "activated and is running"
2. **Permission prompt timing**: Create account, complete 1 workout → prompt does NOT appear. Complete 2nd workout → prompt appears on next page load
3. **Subscribe flow**: Click "Enable Notifications" → OS permission dialog appears → Accept → `push_subscriptions` row appears in Supabase → `pushEnabled = true` in context
4. **Deny flow**: Click "Enable Notifications" → OS permission dialog → Deny → toast "Notifications blocked. Enable in browser settings." → master toggle in Profile remains off
5. **"Not now" flow**: Dismiss prompt → re-open app same session → prompt does NOT reappear → re-open after 14 days → prompt reappears
6. **Workout reminder push**: Manually invoke Edge Function → notification appears in OS tray → clicking opens `/workout`
7. **Weekly email**: Trigger `send-weekly-email` manually via Supabase dashboard → email arrives in inbox with correct stats
8. **Rank-up push**: Log enough workout XP to cross Silver threshold → push fires within 30s → notification reads correct tier name and next-tier XP delta
9. **Unsubscribe**: Toggle master switch off in Profile → `push_subscriptions` row deleted → no further push events received

---

## Feature 2 — Exercise Swap Cross-Day Sync (A↔B Parity)

### Background & Root Cause

**The problem:** The swap system uses `ex.sv` (saved variant) stored per exercise *instance* within a split day. When "Incline Machine Press" is swapped to "Dumbbell Incline Press" on Upper A, Upper B still shows the original, because Upper B is a different day object with its own exercise instances.

**Current architecture** (from State.md):
> "Adopted `ex.sv` to locally persist swapped variants without poisoning the global split array."

> ⚠️ **GAP FOUND:** `ex.sv` was NOT found anywhere in the codebase (grep returned 0 results). Either it was removed, never implemented, or the State.md reference is stale. The swap mechanism may be non-functional. This means **Feature 2 is building swap sync from scratch**, not refactoring an existing system.

**What should happen:** A swap is conceptually an equipment substitution at the gym — if the incline machine isn't available today, it isn't available tomorrow either. Swaps should persist at the **exercise-ID level across all days in the same split**, not at the day-exercise level.

---

### Root Cause Diagram

```
CURRENT (broken):
splits[mkUpperPush].days[0].exercises[2].sv = 'Dumbbell Incline Press'  ← Upper A only
splits[mkUpperPush].days[2].exercises[0]     ← Upper B — still shows original

TARGET (correct):
swapRegistry['incline-machine-press'] = 'Dumbbell Incline Press'
↓ Applied at render time to ALL days containing that exercise ID
```

---

### Solution: Split-Level Swap Registry

Store swaps as a flat map keyed by **original exercise ID** (not day+index), persisted to `localStorage` and synced to Supabase. Apply the swap at render time across all days that reference the original exercise.

---

### Phase 2-A — Data Model

#### Exercise ID Standardisation

> ⚠️ **CRITICAL BLOCKER:** This is the single most important prerequisite for Feature 2. Without stable IDs, the entire swap registry concept is non-functional.

**Current state:** Every exercise in `splits.js` has `id: gId()` where `gId()` generates a **random UUID on every call**. This means:
- Exercise IDs change every time the app reloads
- The same exercise gets a different ID on Upper A vs Upper B (different `gId()` call)
- You cannot build a registry keyed by exercise ID because the key is ephemeral

**Option A (CHOSEN — hardcoded stable IDs):**

Replace `id: gId()` with deterministic kebab-case IDs like `id: 'incline-machine-press'` on every exercise object. This is a one-time migration touching all ~120 exercises across `splits.js`.

Why this is robust:
1. **Name changes don't break lookups** — if you rename "Leg Press" to "45° Leg Press", the ID `leg-press` stays the same. With runtime derivation, every rename would silently orphan all swap registry entries and workout history references.
2. **Cross-day matching is explicit** — "Lateral Raises" on Upper A and Upper B both have `id: 'lateral-raises'`, making the registry lookup `O(1)` by key.
3. **Build-time validation** — you can write a test that checks every exercise has a non-null, unique-per-name `id` string. Runtime derivation can't be validated without running the app.
4. **Future-proof for exerciseLibrary.js** — Feature 3 (Custom Splits) needs a deduplicated exercise library keyed by ID. Stable IDs make deduplication trivial.
5. **Workout history correlation** — if you ever want to track PRs or progression per exercise across sessions, you need a stable identifier. Random UUIDs make this impossible.

**Option B (REJECTED — runtime derivation):**

Derive ID at runtime: `name.toLowerCase().replace(/\s+/g, '-')`. No data change needed.

Why this is fragile:
1. **Renaming an exercise silently breaks all references** — "Leg Curls" → "Hamstring Curls" changes the derived ID from `leg-curls` to `hamstring-curls`, orphaning swap registry entries, workout history lookups, and custom exercise overrides.
2. **No way to detect breakage** — there's no compile-time or runtime error; the swap just silently stops working.
3. **Name collisions** — "Cable Fly" and "Cable-Fly" would produce the same ID. Edge cases with special characters (`T-Bar Rows` → `t-bar-rows`) need careful handling.
4. **Cannot rename exercises for UX improvement** without a coordinated data migration.

**Decision: Use Option A for all exercises, with Option B as a runtime fallback for any legacy entry missing an `id`.**

Generation rule: `id = name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-')`

The `gId()` calls remain on exercise instances (for React `key` purposes) but a NEW `exerciseId` or stable `eid` field is added alongside. Alternatively, replace `id: gId()` entirely with the stable ID and use array index or a separate `key` prop for React rendering.

#### Swap Registry Schema

```js
// Stored in localStorage at: fittrack_swapRegistry_<splitId>_<userId>
// Also synced to user_profiles.swap_registry JSONB column
{
  "incline-machine-press": {
    replacementName: "Dumbbell Incline Press",
    replacementId: "dumbbell-incline-press",
    swappedAt: "2026-05-17T10:30:00Z",
    reason: null   // future: 'equipment unavailable' | 'injury' | 'preference'
  },
  "lat-pulldown-cable": {
    replacementName: "Assisted Pull-Up",
    replacementId: "assisted-pull-up",
    swappedAt: "2026-05-14T08:00:00Z"
  }
}
```

The registry is **per split** (`splitId`) because the same exercise might be available in one split's gym but not another.

---

### Phase 2-B — Code Changes

#### 1. Modify `src/data/splits.js`

For every exercise object, add an `id` field:

```js
// Before
{ name: 'Incline Machine Press', sets: [...], muscle: 'chest', ... }

// After
{ id: 'incline-machine-press', name: 'Incline Machine Press', sets: [...], muscle: 'chest', ... }
```

Rule: `id = name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-')`

This is a bulk find-and-replace pass over `splits.js`. Every exercise across all default splits (Upper/Lower, PPL, Full Body, Bro Split, etc.) needs an `id`. Duplicates across days are intentional — the same `id` appearing on both Upper A and Upper B is exactly what enables the cross-day lookup.

#### 2. Create `src/utils/swapRegistry.js`

```js
const REGISTRY_KEY = (splitId, userId) => `fittrack_swapRegistry_${splitId}_${userId}`;

export function getSwapRegistry(splitId, userId) {
  // Returns the full registry object for this split, or {}
}

export function getSwappedExercise(exercise, splitId, userId) {
  // Given an exercise object, returns it with name/id replaced by the swap if one exists
  // Falls back to original if no swap registered
}

export function registerSwap(originalId, replacement, splitId, userId) {
  // Writes { replacementName, replacementId, swappedAt } to the registry
  // Persists to localStorage immediately
  // Queues Supabase sync (debounced 1s)
}

export function clearSwap(originalId, splitId, userId) {
  // Removes the swap for this exercise, reverting to original
  // Also restores ex.sv = null on matching exercise instances
}

export function clearAllSwaps(splitId, userId) {
  // Nuclear option — clears all swaps for this split (e.g., "I'm at a different gym")
}
```

#### 3. Modify `src/components/pages/WorkoutPage.jsx`

**At session build time** (when the user taps "Start Session"):
```js
import { getSwappedExercise } from '../../utils/swapRegistry';

// When building sessionExercises from the split day:
const sessionExercises = day.exercises.map(ex => 
  getSwappedExercise(ex, activeSplitId, userId)
);
```

This applies all registered swaps before the session starts, meaning both Upper A and Upper B will show the swapped exercise.

**The swap modal** (the `ArrowRightLeft` pill that opens the exercise picker):
- On confirmation of a swap: call `registerSwap(originalExercise.id, selectedExercise, activeSplitId, userId)`
- Remove the old `ex.sv` logic — the registry replaces it entirely

**"Reset to original" option** in the swap modal: call `clearSwap(originalId, splitId, userId)`

**Swap indicator** on exercise card: if `getSwapRegistry(...)[ex.id]` is set, show a small `ArrowRightLeft` icon badge on the exercise header (dim color, `--on-surface-dim`) to indicate this is a substitution. Tapping it opens the swap modal pre-filled with the current replacement.

#### 4. Modify `src/context/AppContext.jsx`

Add `swapRegistries` to state — object keyed by `splitId`:
```js
const [swapRegistries, setSwapRegistries] = useState({});
```

Expose via context: `swapRegistries`, `setSwapRegistry(splitId, registry)`

`setSwapRegistry` should:
1. Update in-memory state
2. Write to `localStorage` via `swapRegistry.js`
3. Sync to Supabase `user_profiles.swap_registry` JSONB column (debounced)

#### 5. Add `swap_registry` column to Supabase

In new migration `20260517_swap_registry.sql`:
```sql
ALTER TABLE user_profiles
ADD COLUMN IF NOT EXISTS swap_registry JSONB DEFAULT '{}'::jsonb;
```

The full structure stored in Supabase:
```json
{
  "mkUpperPush": {
    "incline-machine-press": { "replacementName": "...", ... }
  },
  "mkPPLPush": {
    "cable-crossover": { "replacementName": "...", ... }
  }
}
```

---

### Phase 2-C — UX: "Apply to all days" Confirmation

When a user swaps an exercise, show a contextual confirmation before saving:

```
Swap "Incline Machine Press" everywhere?

This exercise also appears on:
  • Upper B (Day 3)

Your swap to "Dumbbell Incline Press" will apply
to all days in this split.

[Swap everywhere]  [Just today]
```

- "Swap everywhere" → calls `registerSwap(...)` → applies on both A and B
- "Just today" → retains old `ex.sv` behaviour (split-instance only, backwards compatible)

This dialog only appears when the exercise `id` is found in more than one day of the active split.

---

### Phase 2 — File Checklist

| File | Action | Notes |
|------|--------|-------|
| `src/utils/swapRegistry.js` | 🆕 CREATE | Registry read/write/sync helpers |
| `supabase/migrations/20260517_swap_registry.sql` | 🆕 CREATE | `swap_registry` JSONB column on `user_profiles` |
| `src/data/splits.js` | ✏️ MODIFY | Add `id` field to every exercise object (bulk pass) |
| `src/components/pages/WorkoutPage.jsx` | ✏️ MODIFY | Use `getSwappedExercise()` at session build; update swap modal to call `registerSwap()` |
| `src/context/AppContext.jsx` | ✏️ MODIFY | Add `swapRegistries` state, `setSwapRegistry()`, load/persist from Supabase |

---

### Phase 2 — Test Cases

1. **Same exercise on A and B**: Confirm "Incline Machine Press" appears on both Upper A (Day 1) and Upper B (Day 3) in the Upper/Lower split before any swap
2. **Swap on A propagates to B**: Swap "Incline Machine Press" → "Dumbbell Incline Press" on Upper A → tap Upper B day card → verify "Dumbbell Incline Press" appears (not the original)
3. **Swap indicator badge**: After swap, Upper A and Upper B both show the `ArrowRightLeft` icon badge on the exercise card header
4. **Reset swap**: Tap the swap badge → tap "Reset to original" → both Upper A and Upper B revert to "Incline Machine Press"
5. **Different splits independent**: Swap "Lat Pulldown" in PPL split → verify Upper/Lower split's Lat Pulldown is unaffected
6. **"Just today" option**: If user picks "Just today" → Upper B still shows original → Upper A shows swap
7. **Refresh persistence**: Swap on Upper A → hard refresh browser → Upper A and Upper B still show the swap (loaded from localStorage or Supabase)
8. **Cross-device sync**: Swap on mobile → open on desktop → same swap reflected (via Supabase `swap_registry` column)
9. **New exercise IDs**: Run validation — every exercise in every default split has a non-null, unique `id` string
10. **Swap modal pre-fill**: Tap swap badge on a swapped exercise → modal opens with the replacement already selected (not blank)

---

## Feature 3 — User-Created Custom Splits

### Background & Current State

`SplitsPage.jsx` shows predefined splits from `splits.js`. Users can activate a split but cannot create, edit, rename, or delete them. The `user_splits` table already exists in Supabase (wired in `02_cloud_sync.sql`) and stores active split state — but there is no schema or UI for user-authored split definitions.

---

### Phase 3-A — Data Model

#### Custom Split Schema

```js
// Stored in user_splits table + mirrored in AppContext splits state
{
  id: 'custom-abc123',          // generated: 'custom-' + nanoid(8)
  userId: 'uuid...',
  name: 'My Push/Pull/Legs',    // user-defined, max 40 chars
  description: '',              // optional, max 120 chars
  isCustom: true,               // distinguishes from predefined splits
  daysPerWeek: 4,               // computed from days array length
  type: 'custom',               // 'push-pull-legs' | 'upper-lower' | 'full-body' | 'bro-split' | 'custom'
  days: [
    {
      id: 'day-1',
      name: 'Push A',           // user-defined day label
      focus: 'chest-shoulders-triceps',  // auto-suggested from exercises, user can override
      exercises: [
        {
          id: 'bench-press-barbell',
          name: 'Barbell Bench Press',
          muscle: 'chest',
          sets: [
            { reps: 8, weight: 80, unit: 'kg' },
            { reps: 8, weight: 80, unit: 'kg' },
            { reps: 8, weight: 80, unit: 'kg' },
          ],
          focusType: 'compound',
          restSeconds: 120,
        }
      ]
    }
  ],
  createdAt: '2026-05-17T...',
  updatedAt: '2026-05-17T...',
}
```

#### Supabase Schema Change

Current `user_splits` table stores `split_id` (reference to predefined) and `split_data`. We need it to also store full custom split definitions.

New migration `20260517_custom_splits.sql`:
```sql
-- Extend user_splits to store custom split definitions
ALTER TABLE user_splits
ADD COLUMN IF NOT EXISTS is_custom BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS split_definition JSONB DEFAULT NULL,
ADD COLUMN IF NOT EXISTS split_name TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS split_description TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- RLS: users can only CRUD their own splits
CREATE POLICY "Users manage own custom splits"
  ON user_splits FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
```

---

### Phase 3-B — Exercise Library

Custom splits need an exercise picker. Extract the existing exercise pool from all predefined splits into a queryable library.

#### Create `src/data/exerciseLibrary.js`

Compiled from all exercises in `splits.js` — deduplicated by `id`. Structure:
```js
export const EXERCISE_LIBRARY = [
  {
    id: 'barbell-bench-press',
    name: 'Barbell Bench Press',
    muscle: 'chest',
    primaryMuscle: 'chest',
    secondaryMuscles: ['front-delts', 'triceps'],
    focusType: 'compound',
    equipment: 'barbell',
    defaultSets: 3,
    defaultReps: 8,
    defaultRestSeconds: 120,
  },
  // ... all exercises from splits.js
];

export const EXERCISE_BY_MUSCLE = {
  chest: [...],
  back: [...],
  legs: [...],
  shoulders: [...],
  arms: [...],
  core: [...],
};

export const EXERCISE_BY_EQUIPMENT = {
  barbell: [...],
  dumbbell: [...],
  machine: [...],
  cable: [...],
  bodyweight: [...],
};
```

Total expected library size: ~80–120 exercises (all unique exercises across current splits + common additions).

Additionally allow users to add a **custom exercise** (name only — no ID from library):
```js
{ id: 'custom-ex-abc', name: 'Reverse Pec Deck', muscle: 'chest', isUserCreated: true }
```
Custom exercises are stored inline in the split definition and also persisted to `localStorage` for reuse.

---

### Phase 3-C — UI Implementation

#### Create `src/components/pages/SplitBuilderPage.jsx`

A dedicated full-screen page at route `/splits/new` and `/splits/:id/edit`.

**Page structure:**

```
┌─────────────────────────────────────────────┐
│  ← Back        Create Split         [Save]  │  ← sticky header
├─────────────────────────────────────────────┤
│  Split name (editable inline)               │
│  e.g., "My Push/Pull/Legs"                  │
├─────────────────────────────────────────────┤
│  DAYS                            [+ Add Day]│
│                                             │
│  ┌──────────────────────────────────────┐   │
│  │ Day 1: Push A                [✎] [🗑] │   │
│  │ ├─ Barbell Bench Press  3×8   [≡]   │   │
│  │ ├─ Incline DB Press     3×10  [≡]   │   │
│  │ └─ Cable Fly            3×12  [≡]   │   │
│  │ [+ Add Exercise]                     │   │
│  └──────────────────────────────────────┘   │
│                                             │
│  ┌──────────────────────────────────────┐   │
│  │ Day 2: Pull A                [✎] [🗑] │   │
│  │ ...                                  │   │
│  └──────────────────────────────────────┘   │
│                                             │
│  [+ Add Day]                                │
└─────────────────────────────────────────────┘
```

Key interactions:
- **Split name**: Tappable text → inline edit with a `contentEditable` or `<input>` — auto-saves on blur
- **Add Day**: Appends a new empty day card. Prompts for day name (inline input, placeholder: "e.g., Push A, Leg Day, Upper")
- **Day rename** (✎ icon): Inline edit of the day label
- **Delete day** (🗑 icon): ConfirmDialog before removal
- **Drag to reorder days**: React drag handles (`[≡]` icon) — use CSS-only drag-sort or a lightweight library. Reorder only within the day list, not exercises within a day on first pass.
- **Add Exercise**: Opens exercise picker bottom sheet (see below)
- **Drag to reorder exercises within a day**: Same drag handle pattern
- **Delete exercise**: Swipe left or trash icon on exercise row
- **Edit exercise sets**: Tap exercise row → inline set editor expands (like the WorkoutPage set grid — same component ideally)
- **Save**: Calls `saveCustomSplit(splitDefinition)` in AppContext → upserts to `user_splits` → navigates back to `/splits`

#### Create `src/components/shared/ExercisePicker.jsx`

Reusable bottom-sheet exercise picker (also useful for the swap modal — consider refactoring swap modal to use this same component).

```
┌─────────────────────────────────────────────┐
│  Add Exercise                          [✕]  │
│  ┌──────────────────────────────────────┐   │
│  │ 🔍 Search exercises...              │   │
│  └──────────────────────────────────────┘   │
│                                             │
│  Filter: [All] [Chest] [Back] [Legs]        │
│          [Shoulders] [Arms] [Core]          │
│                                             │
│  Equipment: [All] [Barbell] [Dumbbell]      │
│             [Machine] [Cable] [Bodyweight]  │
│                                             │
│  ──────── CHEST ──────────────────────────  │
│  ◉ Barbell Bench Press     compound  ✓      │
│  ○ Dumbbell Bench Press    compound         │
│  ○ Incline Machine Press   compound         │
│  ○ Cable Fly               isolation        │
│                                             │
│  ──────── BACK ────────────────────────────  │
│  ○ Deadlift                compound         │
│  ...                                        │
│                                             │
│  + Create custom exercise                   │
└─────────────────────────────────────────────┘
```

- Search: fuzzy match on `name`, `muscle`, `equipment`
- Muscle filter pills scroll horizontally
- Checkmark on already-added exercises (grayed out, not re-addable)
- "+ Create custom exercise": text input for name + muscle group selector → creates `{ id: 'custom-ex-...' }` inline
- Selecting an exercise → adds it to the current day with default sets, dismisses sheet

#### Modify `src/components/pages/SplitsPage.jsx`

**"My Splits" section** (new, above the predefined splits grid):

```
MY SPLITS                                 [+ Create Split]

┌──────────────────┐  ┌──────────────────┐
│ My Push Pull Legs│  │ Summer Cut       │
│ 4 days/week      │  │ 3 days/week      │
│ Created May 17   │  │ Created May 10   │
│                  │  │                  │
│ [Activate] [✎]  │  │ [Activate] [✎]  │
└──────────────────┘  └──────────────────┘
```

- If no custom splits: show an `EmptyState`-style card:
  ```
  Design your own training plan.
  [+ Create your first split]
  ```
- "[+ Create Split]" button → navigates to `/splits/new`
- "[✎]" (Edit) → navigates to `/splits/:id/edit`
- "[🗑]" (Delete) → ConfirmDialog → deletes from Supabase + state
- Custom split cards use the same glass card design as predefined splits but with a subtle "CUSTOM" badge in `--primary` color (top-right corner pill)
- Predefined splits section renamed to "TRAINING PROGRAMS" to distinguish from user splits

#### Add Route in `src/App.jsx`

```jsx
<Route path="/splits/new" element={<SplitBuilderPage />} />
<Route path="/splits/:splitId/edit" element={<SplitBuilderPage />} />
```

#### Modify `src/data/constants.js`

No nav change needed — `/splits/new` and `/splits/:id/edit` are child routes accessed from SplitsPage, not primary nav destinations.

---

### Phase 3-D — AppContext Integration

Add to `AppContext.jsx`:

```js
// Custom splits CRUD — synced to user_splits table
const saveCustomSplit = async (splitDef) => {
  const isNew = !splitDef.id || splitDef.id.startsWith('custom-new');
  const id = isNew ? `custom-${nanoid(8)}` : splitDef.id;
  const now = new Date().toISOString();
  const enriched = { ...splitDef, id, userId, isCustom: true, updatedAt: now,
    createdAt: splitDef.createdAt || now };
  
  // Optimistic UI update
  setSplits(prev => isNew
    ? [...prev, enriched]
    : prev.map(s => s.id === id ? enriched : s)
  );
  
  // Supabase upsert to user_splits
  await supabase.from('user_splits').upsert({
    user_id: userId,
    split_id: id,
    is_custom: true,
    split_name: enriched.name,
    split_definition: enriched,
    updated_at: now,
  }, { onConflict: 'split_id' });
};

const deleteCustomSplit = async (splitId) => {
  setSplits(prev => prev.filter(s => s.id !== splitId));
  if (activeSplitId === splitId) setActiveSplitId(null);
  await supabase.from('user_splits').delete().eq('split_id', splitId).eq('user_id', userId);
};
```

Expose: `saveCustomSplit`, `deleteCustomSplit`

**Load custom splits on boot** (in `loadCloudData`):
```js
const { data: customSplitsRows } = await supabase
  .from('user_splits')
  .select('*')
  .eq('user_id', userId)
  .eq('is_custom', true);

const customSplits = (customSplitsRows || []).map(row => row.split_definition);
setSplits([...INIT_SPLITS, ...customSplits]);
```

---

### Phase 3-E — WorkoutPage Integration

Custom splits activate exactly like predefined splits — `setActiveSplitId(split.id)`. The `WorkoutPage` already reads from the `splits` array in context, so custom splits just work, with one guard:

**Session build**: ensure the exercise objects from custom splits have the same shape as predefined ones (all fields present: `id`, `name`, `muscle`, `primaryMuscle`, `secondaryMuscles`, `sets`, `focusType`, `restSeconds`). The `SplitBuilderPage` must fill defaults for any optional fields.

**Olympus XP calculation**: works immediately because `muscleData.js` reads `ex.muscle` / `ex.primaryMuscle` from logged exercise objects — not from a static split lookup.

**ProgressPage analytics**: works immediately — reads from `workout_logs` which store exercise data inline.

---

### Phase 3 — File Checklist

| File | Action | Notes |
|------|--------|-------|
| `src/components/pages/SplitBuilderPage.jsx` | 🆕 CREATE | Full split creation / edit UI |
| `src/components/shared/ExercisePicker.jsx` | 🆕 CREATE | Reusable exercise search + filter bottom sheet |
| `src/data/exerciseLibrary.js` | 🆕 CREATE | Deduplicated exercise pool from all splits; by muscle / equipment |
| `supabase/migrations/20260517_custom_splits.sql` | 🆕 CREATE | Extend `user_splits` schema for custom definitions + RLS |
| `src/components/pages/SplitsPage.jsx` | ✏️ MODIFY | "My Splits" section + [+ Create Split] CTA |
| `src/context/AppContext.jsx` | ✏️ MODIFY | `saveCustomSplit()`, `deleteCustomSplit()`, load custom splits in `loadCloudData` |
| `src/App.jsx` | ✏️ MODIFY | Add `/splits/new` and `/splits/:splitId/edit` routes |

---

### Phase 3 — Test Cases

1. **Create empty split**: Tap "+ Create Split" → SplitBuilderPage opens → enter name "My PPL" → tap Save without adding days → validation error: "Add at least 1 day with 1 exercise"
2. **Add day and exercise**: Add "Push Day" → tap "+ Add Exercise" → ExercisePicker opens → search "bench" → select "Barbell Bench Press" → added with 3 sets × 8 reps default
3. **Edit sets**: Tap the exercise row in SplitBuilderPage → inline set editor expands → change reps to 10 → tap elsewhere → set saves
4. **Add custom exercise**: In ExercisePicker, tap "+ Create custom exercise" → type "Bulgarian Split Squat" → pick muscle "legs" → confirm → appears in day
5. **Reorder days**: Drag Day 2 above Day 1 → order updates → Save → reopening edit reflects new order
6. **Save and activate**: Save "My PPL" → appears in SplitsPage under "MY SPLITS" → tap "Activate" → WorkoutPage shows "My PPL" days
7. **Start session from custom split**: Activate custom split → tap "Start Session" on Push Day → session screen shows the custom exercises
8. **XP earned**: Complete custom split session → post-session summary shows XP → Olympus League "My Stats" reflects muscle XP
9. **Edit existing split**: From SplitsPage, tap ✎ on a custom split → SplitBuilderPage loads pre-filled with existing days and exercises
10. **Delete custom split**: Tap 🗑 on custom split → ConfirmDialog → confirm → split removed from "My Splits" list → Supabase row deleted
11. **Custom split persists across refresh**: Create split → hard refresh → custom split still in "My Splits" (loaded from Supabase)
12. **Cross-device**: Create split on phone → open on desktop → split appears under "My Splits"
13. **Predefined splits unaffected**: After creating custom splits, all original predefined splits still appear under "TRAINING PROGRAMS" unchanged

---

## Cross-Feature Dependency Map

```
Feature 1 (Notifications)
└── Depends on: Supabase `user_profiles` table (existing) ✅
└── Depends on: `push_subscriptions` table (existing) ✅
└── Depends on: `notification_preferences` table (existing) ✅
└── Depends on: `notification_logs` table (existing) ✅
└── Depends on: `src/sw.js` (existing, Workbox/VitePWA) ✅
└── Depends on: `src/hooks/useNotifications.js` (existing) ✅
└── Depends on: `VITE_VAPID_PUBLIC_KEY` in .env (existing) ✅
└── New: `email_weekly` column on `notification_preferences`
└── New: `last_known_tier` column on `user_profiles`
└── New: Resend API key
└── New: `NotificationPrompt.jsx` component
└── Enhance: `useNotifications.js` — add `unsubscribeFromPush()`
└── Enhance: `src/sw.js` — add tag dedup + notificationclose
└── Enhance: `ProfilePage.jsx` — add email_weekly toggle + master disable

Feature 2 (Swap Sync)
└── ⚠️ BLOCKER: `splits.js` exercise `id` field uses gId() random UUIDs — must migrate to stable kebab-case IDs first
└── ⚠️ GAP: `ex.sv` swap mechanism not found in codebase — building from scratch
└── Depends on: `user_profiles` table (existing) ✅
└── New: `swap_registry` column on `user_profiles`
└── New: `src/utils/swapRegistry.js`
└── Modify: `WorkoutPage.jsx` swap modal flow
└── Modify: `splits.js` — bulk migration of ~120 exercise IDs

Feature 3 (Custom Splits)
└── Depends on: `user_splits` table (existing) ✅
└── Depends on: `splits.js` (for `exerciseLibrary.js` extraction)
└── Depends on: Feature 2's stable exercise IDs (shared prerequisite)
└── New: `is_custom`, `split_definition` columns on `user_splits`
└── New: SplitBuilderPage route
└── New: ExercisePicker.jsx
└── New: exerciseLibrary.js

Feature 2 + 3 share:
└── `ExercisePicker.jsx` — the swap modal (Feature 2) and the exercise adder
    in SplitBuilderPage (Feature 3) should use the same component.
    Build ExercisePicker.jsx as part of Feature 3 and refactor the
    swap modal in Feature 2 to use it.
└── Stable exercise IDs in splits.js — both features need them.
    Migrate IDs FIRST before starting either feature.

Recommended implementation order:
0. PREREQUISITE: Migrate splits.js exercise IDs from gId() to stable kebab-case (blocks Features 2 + 3)
1. Feature 2 (smallest, isolated, builds on stable IDs)
2. Feature 3 (builds ExercisePicker which Feature 2 can reuse)
3. Feature 1 (most complex, touches infra — but least blocked by codebase gaps)
```

---

## Migration Run Order

```sql
-- Run in this exact order:
1. 20260517_notification_enhancements.sql  -- adds email_weekly to notification_preferences, last_known_tier to user_profiles
2. 20260517_swap_registry.sql              -- adds swap_registry to user_profiles
3. 20260517_custom_splits.sql              -- extends user_splits with is_custom, split_definition
4. 20260517_weekly_email_schedule.sql       -- adds pg_cron job for weekly email
```

---

## State.md Updates Required After Implementation

When these features are shipped, add the following to Known Gaps (resolve) and Bug Fixes sections:

**Resolve from Known Gaps:**
- "Web Push Subscription Flow" → partially resolved (Feature 1) — SW + subscribe exist, unsubscribe + prompt still needed

**Add to Known Gaps (new):**
- Weekly email time zone: emails sent at 02:30 UTC (08:00 IST) — users in other time zones receive at a different local time. Per-user send-time preference deferred.
- ExercisePicker in SplitBuilderPage does not support drag-to-reorder within a single day on first ship — tap-to-reorder only.
- Custom splits do not support "yoga" type days (no `YogaSessionView` integration). Custom days always create weight-tracking sessions.
- Notification time customisation (per-type reminder time picker) deferred to a follow-up sprint.
- `ex.sv` swap mechanism referenced in State.md not found in codebase — State.md entry may be stale.
- `fittrack-icon-192.png` is 68 bytes (likely empty/placeholder) — needs a real icon asset.
- `notification_preferences` table uses `notification_preferences` (not `notification_prefs` on `user_profiles`) — State.md should reflect this.