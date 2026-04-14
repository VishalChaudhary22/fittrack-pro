# FitTrack Pro — Activity Tracking: Steps & Calories Burned
> **Created:** 2026-04-13 · **Priority:** 🟠 High
> **Replaces:** Dashboard placeholder cards for "DAILY ACTIVITY", "CALORIES BURNED"
> **Files primarily affected:** `DashboardPage.jsx`, `AppContext.jsx`, `ProfilePage.jsx`, new Supabase Edge Function

---

## 🔍 Gap Analysis — Issues Found by Codebase Cross-Reference

> **Reviewed 2026-04-13.** Each gap below was identified by reading the actual codebase and comparing it to the plan above.

### GAP 1 — Exercise Name Mismatch in EXERCISE_MET (Critical)

The `EXERCISE_MET` map uses snake_case keys like `'barbell_bench'`, `'overhead_press'`, `'pull_up'`. But actual exercise names stored in `splits.js` and `workoutLogs` are natural-cased strings like `'Flat Dumbbell Press'`, `'Overhead Press'`, `'Squats'`, `'Deadlift'`.

The `calcWorkoutCalories` code does `ex.name?.toLowerCase().replace(/\s+/g, '_')` — so `'Overhead Press'` becomes `'overhead_press'` ✅, but `'Flat Dumbbell Press'` becomes `'flat_dumbbell_press'` which is **not** in the MET table ❌.

**Fix:** Either:
- (a) Expand `EXERCISE_MET` to cover ALL exercise names from `splits.js` with their exact transformed keys, OR
- (b) Add a fuzzy matching step (e.g. check if any MET key is a substring of the transformed name), OR
- (c) Add a secondary lookup by `ex.primaryMuscle` → `CATEGORY_MET` which is already the fallback — **but make this explicit and ensure all muscles in splits are covered**.

The `CATEGORY_MET` fallback already covers this case since `ex.primaryMuscle` is always set on logged exercises. **The MET table should be expanded but the fallback chain is sufficient for v1.**

### GAP 2 — Missing Exercises from EXERCISE_MET

Exercises that appear in `splits.js` but have **no matching key** in `EXERCISE_MET` and would fall through to `CATEGORY_MET`:

| Exercise | Transformed Key | In MET Table? | Fallback via primaryMuscle |
|---|---|---|---|
| Flat Dumbbell Press | `flat_dumbbell_press` | ❌ | ✅ `chest` → 4.0 |
| Incline Dumbbell Press | `incline_dumbbell_press` | ❌ | ✅ `chest` → 4.0 |
| Lateral Raises | `lateral_raises` | ❌ | ✅ `shoulders` → 3.5 |
| Tricep Pushdowns | `tricep_pushdowns` | ❌ | ✅ `triceps` → 3.0 |
| Wide Grip Lat Pulldowns | `wide_grip_lat_pulldowns` | ❌ | ✅ `back` → 4.0 |
| Horizontal Machine Row | `horizontal_machine_row` | ❌ | ✅ `back` → 4.0 |
| Bicep Curls | `bicep_curls` | ❌ | ✅ `biceps` → 3.0 |
| Romanian Deadlift | `romanian_deadlift` | ❌ | ✅ `hamstrings` → 4.5 |
| Leg Press | `leg_press` | ❌ | ✅ `quads` → 5.0 |
| Squats | `squats` | ❌ (`squat`) | ✅ `quads` → 5.0 |
| Deadlift | `deadlift` | ✅ 6.0 | — |
| Overhead Press | `overhead_press` | ✅ 4.0 | — |

**Fix:** Add commonly used exercises from `splits.js` to `EXERCISE_MET` for accuracy. The `CATEGORY_MET` fallback provides a reasonable safety net.

### GAP 3 — Cardio Log Calories Not Included in Dashboard Total

The TODO only computes calories from `workoutLogs` (weight training). But the app already has a **Cardio Log** (`cardioLog` in AppContext, `useLocalStorage('fittrack_cardioLog')`) where users manually enter cardio activities with `calories` already provided. These are **not** included in the `todayCaloriesBurned` calculation.

**Fix:** `todayCaloriesBurned` must also sum `cardioLog.filter(c => c.date === todayStr && c.userId === user?.id).reduce((s, c) => s + (c.calories || 0), 0)` alongside the MET-derived workout calories.

### GAP 4 — Dashboard Layout Reality vs. Plan Assumption

The TODO describes the Dashboard as having a "3-card activity row" with separate DAILY ACTIVITY, CALORIES BURNED, and WATER INTAKE cards. But the **actual Dashboard** (lines 521–556 of `DashboardPage.jsx`) uses a **single unified "DAILY ACTIVITY" glass card** with a `ProgressOrb` and 3 inline progress bars (Steps, Cals Burned, Water). There are no separate cards.

**Fix:** The implementation plan should modify this single unified card rather than replacing separate cards that don't exist. The card redesign section (TASK 1F) needs to be rewritten to work within the existing single-card layout — or the card must be explicitly split into 3 separate cards first.

### GAP 5 — `step_goal` Column: No Migration SQL Provided

The TODO says "Add `step_goal integer DEFAULT 10000` to the SQL table" for `user_profiles`, but:
1. The `user_profiles` table was created directly in Supabase (not via a migration file in this repo).
2. No `ALTER TABLE` statement is provided.
3. The `updateProfile` keyMap in `AppContext.jsx` (line 618) does **not** include `stepGoal: 'step_goal'`.
4. The `user` object (line 652) does **not** expose `stepGoal`.

**Fix required:**
```sql
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS step_goal integer DEFAULT 10000;
```
Plus: add `stepGoal: 'step_goal'` to `updateProfile`'s `keyMap` and `stepGoal: profile.step_goal || 10000` to the `user` object.

### GAP 6 — `step_logs` Supabase Integration Style Mismatch

The TODO's `logSteps` function uses direct `await supabase.from(...).upsert(...)` — but the rest of the app uses `createSyncSetter` with its delta-diffing, value normalization, and write-through cache pattern. Using a different sync pattern for steps creates maintenance inconsistency.

**Recommendation:** Either (a) use `createSyncSetter` for `stepLogs` for consistency, or (b) document why `logSteps` uses a direct upsert (valid reason: step logs are simpler — single entry per date/source, no concurrent edit risk).

### GAP 7 — Fitbit OAuth: Critical Security Flaw in `state` Parameter

The TODO passes the raw `user.id` (Supabase UUID) as the `state` parameter in the Fitbit OAuth URL. The Edge Function then trusts this value blindly to write tokens. **This allows any authenticated user to overwrite another user's wearable connection** by changing the `state` parameter.

**Fix:** The `state` parameter should be a signed JWT or HMAC-protected token that the Edge Function verifies. Alternatively, the Edge Function should read the authenticated Supabase user from the session cookie / auth header rather than trusting client-supplied `state`.

### GAP 8 — Fitbit OAuth Redirect Mismatch

The `authorize` step redirects to Fitbit with `redirect_uri=${APP_URL}/fitbit/callback`. But the `callback` step is handled by the **same Edge Function** (`fitbit-oauth`), not by a route at the app's domain. The redirect from Fitbit will hit `fittrackbyvishal.vercel.app/fitbit/callback`, which the SPA router doesn't have a route for. 

**Options:**
1. Add a `vercel.json` rewrite that sends `/fitbit/callback` to the Edge Function, OR
2. Set the `redirect_uri` to the Edge Function URL directly (e.g. `https://<ref>.supabase.co/functions/v1/fitbit-oauth/callback`)

### GAP 9 — Apple Health Shortcut Auth is Insecure

The Apple Health Edge Function uses `Authorization: Bearer <user-id>` — a raw UUID as an auth token. Anyone who knows a user's ID (which is exposed in various URLs and logs) can POST fake health data.

**Fix:** Generate a per-user secret API key (stored in `user_profiles.apple_health_api_key`) or use a Supabase JWT with the user's session.

### GAP 10 — Readiness Integration Formula Change

The TODO proposes changing readiness weights from `40% objective + 60% subjective` to `35% training + 5% steps + 60% subjective`. But `calcReadinessScore` in `readinessUtils.js` doesn't take steps as input — it only receives `(checkIn, objectiveScore)`. The function signature and the entire `ReadinessCheckIn.jsx` submission flow would need updating.

**Fix:** Either pass `todaySteps` into `calcObjectiveReadiness` (which already computes a composite score) and add the step bonus there, or add a third parameter to `calcReadinessScore`. The former keeps the change isolated.

### GAP 11 — Energy Balance: TDEE Already Computed

The TODO proposes showing `Calories Out (workout + TDEE)` on the Diet Analysis tab. TDEE is already computed via `calcTDEE` in the Diet page. The "energy balance" feature just needs to subtract `todayCaloriesBurned` from `todayTotals.calories` and compare against the TDEE deficit goal. This is roughly 10 lines of code, not a separate phase.

**Recommendation:** Roll this into Phase 1 since it depends only on MET calorie calculation (no APIs).

### GAP 12 — `onConflict` Value Format

The `logSteps` code uses `onConflict: 'user_id,date,source'` but the Supabase JS client expects the column names as an array or single string for single-column conflicts. For multi-column unique constraints, the upsert should use `.upsert(entry, { onConflict: 'id' })` since the `id` is already deterministically constructed as `${user.id}_${date}_${source}`.

**Fix:** Use `onConflict: 'id'` (the primary key) like all other sync setters in the codebase.

### GAP 13 — Missing `source` Column in step_logs Priority Display

The TODO says "dashboard shows highest-priority source" but never defines the actual `getDisplayStepLog(stepLogs, date)` utility function that selects which log to show when multiple sources exist for the same day.

**Fix:** Add this to `activityUtils.js`:
```js
const SOURCE_PRIORITY = ['fitbit', 'strava', 'apple_health', 'browser_sensor', 'manual'];
export const getDisplayStepLog = (stepLogs, date) => {
  const todayLogs = stepLogs.filter(l => l.date === date);
  if (todayLogs.length === 0) return null;
  return todayLogs.sort((a, b) => 
    SOURCE_PRIORITY.indexOf(a.source) - SOURCE_PRIORITY.indexOf(b.source)
  )[0];
};
```

### GAP 14 — `Footprints` Icon Import

The TODO's card code uses `<Footprints>` from lucide-react. The Dashboard already imports `Footprints` (line 4 of DashboardPage.jsx) — this is fine. But it also uses `Zap` (for calories) which is also already imported. ✅ No gap here — just confirming.

---

## 🔬 Research Summary — The Hard Truth About Web Apps & Health Data

Before any implementation, you need to understand the landscape clearly. **This app is a web app (React SPA)** — and that creates fundamental constraints.

### Why You Can't Directly Access Native Health APIs From a Browser

| Platform | Native API | Web-Accessible? | Notes |
|---|---|---|---|
| Android | **Health Connect** | ❌ Native SDK only | Replaced Google Fit in 2024 |
| iOS / Apple Watch | **Apple HealthKit** | ❌ Native SDK only | Safari cannot access it |
| Android (old) | **Google Fit REST API** | ✅ (but deprecated) | Closed to new signups May 2024, shutdown 2026 |
| Fitbit | **Fitbit Web API** | ✅ Works via OAuth | Free. Deprecating Sept 2026, migrating to Health Connect |
| Strava | **Strava API** | ✅ Works via OAuth | Free. Running, cycling, swimming |

### The Indian Market Reality

India has ~95% Android market share and a booming wearables market:

| Brand | Market Position | API Situation |
|---|---|---|
| **Samsung Galaxy Watch** | Top premium brand | Syncs to Health Connect. No public web API. |
| **boAt** (Crest app) | Top budget brand | **No public API** |
| **Noise** (NoiseFit app) | #2 budget brand | **No public API** |
| **Fire-Boltt** | #3 budget brand | **No public API** |
| **Xiaomi / Amazfit** (Zepp) | Popular budget | No web API (syncs to Google Fit optionally) |
| **Fitbit** (Google-owned) | Premium segment | ✅ **Free web API — best option** |
| **Apple Watch** | Premium, ~5% India | Native only (iOS Shortcuts workaround) |

**Bottom line:** boAt, Noise, and Fire-Boltt — the most popular Indian budget wearables — have zero public APIs and likely never will. Their data flows to Android Health Connect, which only native Android apps can access. For a web app, the realistic path is:

1. **Fitbit Web API** (best direct integration, free, works now)
2. **Strava API** (free, popular with Indian runners and cyclists)
3. **MET-based calorie calculation** from existing workout logs (no API needed — high value immediately)
4. **Manual entry** (always the baseline, clean UX)
5. **Browser pedometry** via DeviceMotion API (rough estimate, works while app is open)
6. **iOS Shortcuts automation** (power user feature for Apple Health)
7. **Future: React Native companion app** for Health Connect + HealthKit

---

## 🎯 The Smartest Immediate Win: MET-Based Calorie Calculation

Before any external API work, **calories burned from your existing workout logs** is a completely FREE, zero-API feature that will be accurate, personalized, and immediately useful.

### How It Works

The **MET (Metabolic Equivalent of Task)** formula is the gold standard used by every major fitness app:

```
Calories burned = MET × user_weight_kg × duration_hours
```

FitTrack Pro already stores `durationMinutes` on every workout log (from WorkoutPage.jsx Phase 2 redesign). We have user weight. We can map exercises to MET values. This means **we can calculate total calories burned in every logged session today**.

### MET Values for FitTrack Pro Exercises

```js
// src/data/metValues.js — NEW FILE

// ──── PER-EXERCISE MET VALUES ──────────────────────────────────────
// Keys are the LOWERCASED, UNDERSCORE-SEPARATED versions of exercise
// names from splits.js (e.g. 'Overhead Press' → 'overhead_press').
// Lookup: ex.name.toLowerCase().replace(/\s+/g, '_')
export const EXERCISE_MET = {
  // ── Compound Strength (high metabolic demand) ──
  'squats': 5.0,
  'bodyweight_squats': 4.0,
  'jump_squats': 8.0,
  'bulgarian_split_squats': 5.0,
  'deadlift': 6.0,
  'romanian_deadlift': 5.0,
  'leg_press': 5.0,
  'overhead_press': 4.0,
  'shoulder_press': 4.0,
  'dumbbell_shoulder_press': 4.0,
  'hip_thrust': 4.0,
  'pull-ups': 4.0,
  'pull_ups': 4.0,
  'chin-ups': 4.0,
  'chin_ups': 4.0,
  'push-ups': 3.5,
  'push_ups': 3.5,
  'diamond_push-ups': 3.5,
  'decline_push-ups': 3.5,
  'burpees': 8.0,

  // ── Chest & Press ──
  'flat_dumbbell_press': 3.5,
  'incline_dumbbell_press': 3.5,
  'chest_machine_press': 3.5,
  'incline_smith_machine_press': 3.5,
  'barbell_bench': 3.5,
  'bench_press': 3.5,

  // ── Back & Row ──
  'wide_grip_lat_pulldowns': 3.5,
  'close_grip_lat_pulldowns': 3.5,
  'horizontal_machine_row': 3.5,
  'wide_grip_t-bar_rows': 4.0,
  'seated_cable_row_(bar)': 3.5,
  'seated_horizontal_row': 3.5,
  't-bar_rows': 4.0,
  'australian_pull-ups': 3.5,

  // ── Isolation — Arms ──
  'bicep_curls': 3.0,
  'hammer_curls': 3.0,
  'preacher_curls': 3.0,
  'incline_bench_bicep_curls': 3.0,
  'biceps_cable_curls': 3.0,
  'tricep_pushdowns': 3.0,
  'single_hand_rope_pushdowns': 3.0,
  'single_hand_tricep_pushdowns': 3.0,
  'overhead_tricep_extension': 3.0,
  'single_hand_overhead_tricep_extension': 3.0,
  'single_hand_overhead_tricep_extensions': 3.0,
  'tricep_dips_(chair)': 3.5,

  // ── Isolation — Shoulders ──
  'lateral_raises': 3.0,
  'rear_delt_flyes': 3.0,
  'pike_push-ups': 3.5,

  // ── Legs & Glutes ──
  'leg_extension': 4.0,
  'leg_curls': 3.5,
  'seated_leg_curls': 3.5,
  'lying_leg_curls': 3.5,
  'leg_abductor_machine': 3.0,
  'calf_raises': 3.0,
  'glute_bridges': 3.5,
  'single-leg_glute_bridges': 3.5,
  'walking_lunges': 4.5,

  // ── Core ──
  'plank': 3.5,
  'hollow_body_hold': 3.5,
  'mountain_climbers': 6.0,

  // ── Yoga (whole-session MET is low, individual poses too) ──
  'surya_namaskar_(sun_salutation)': 3.5,
  'adho_mukha_svanasana_(downward_dog)': 2.5,
  'default_yoga': 2.5,

  // ── Cardio types (from WorkoutHistoryPage cardioLog) ──
  'running': 8.0,
  'cycling': 8.0,
  'swimming': 7.0,
  'hiit': 8.0,
  'walking': 3.5,
  'skipping_rope': 10.0,
  'jump_rope': 10.0,
  'cricket': 4.0,
  'badminton': 5.5,
  'football': 7.0,
  'other': 5.0,
};

// Category-level MET fallbacks (for exercises not mapped individually).
// The key matches `ex.primaryMuscle` values used in splits.js.
export const CATEGORY_MET = {
  'chest': 4.0,    'back': 4.0,    'shoulders': 3.5,
  'biceps': 3.0,   'triceps': 3.0, 'legs': 5.0,
  'quads': 5.0,    'hamstrings': 4.5, 'glutes': 4.0,
  'calves': 3.0,   'abs': 3.5,     'traps': 3.5,
  'forearms': 3.0, 'cardio': 7.0,
};

/**
 * Calculate estimated calories burned for a single workout log.
 * Lookup chain: EXERCISE_MET[exact name] → CATEGORY_MET[primaryMuscle] → 3.5 (default)
 * @param {Object} log - A workoutLog entry with exercises[] and durationMinutes
 * @param {number} userWeightKg - The user's body weight in kg
 * @returns {number|null} Estimated kcal or null if duration/weight missing
 */
export const calcWorkoutCalories = (log, userWeightKg) => {
  if (!log.durationMinutes || !userWeightKg) return null;
  const durationHours = log.durationMinutes / 60;
  // Weighted average MET across exercises in the session
  const avgMet = log.exercises?.length
    ? log.exercises.reduce((sum, ex) => {
        const key = ex.name?.toLowerCase().replace(/\s+/g, '_');
        const met = EXERCISE_MET[key]
          || CATEGORY_MET[ex.primaryMuscle]
          || 3.5;
        return sum + met;
      }, 0) / log.exercises.length
    : 3.5;
  return Math.round(avgMet * userWeightKg * durationHours);
};

/**
 * Calculate estimated calories burned for a cardio log entry.
 * Uses the cardioLog's type field to look up MET, or falls back to 5.0.
 * @param {Object} cardioEntry - A cardioLog entry with type, minutes, and optionally calories
 * @param {number} userWeightKg
 * @returns {number} Estimated kcal (prefers entry.calories if already provided by user)
 */
export const calcCardioCalories = (cardioEntry, userWeightKg) => {
  // If user already provided calories on manual entry, use that
  if (cardioEntry.calories && cardioEntry.calories > 0) return cardioEntry.calories;
  if (!cardioEntry.minutes || !userWeightKg) return 0;
  const met = EXERCISE_MET[cardioEntry.type?.toLowerCase()] || 5.0;
  return Math.round(met * userWeightKg * (cardioEntry.minutes / 60));
};
```

This alone turns the "CALORIES BURNED" placeholder into a real, working feature with **zero API integration**.

---

## 🗂️ Supabase Schema — New Tables

Run in Supabase SQL Editor before implementation:

```sql
-- step_logs: daily step counts from any source
CREATE TABLE public.step_logs (
  id            text        PRIMARY KEY,
  user_id       uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date          date        NOT NULL,
  steps         integer     NOT NULL DEFAULT 0,
  distance_km   numeric(6,2),
  calories_active integer,          -- active calories from device (not BMR)
  floors        integer,
  active_minutes integer,
  source        text        NOT NULL DEFAULT 'manual',
  -- source: 'manual' | 'fitbit' | 'strava' | 'browser_sensor'
  raw_provider_id text,            -- provider's own ID for deduplication
  synced_at     timestamptz DEFAULT now(),
  created_at    timestamptz DEFAULT now(),
  UNIQUE(user_id, date, source)    -- one entry per user per day per source
);

-- wearable_connections: OAuth token storage per user per provider
-- ⚠️ Tokens stored encrypted via Supabase Vault or Column Encryption
-- For MVP: store in user_profiles.wearable_tokens jsonb column instead
CREATE TABLE public.wearable_connections (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  provider         text NOT NULL,  -- 'fitbit' | 'strava'
  access_token     text,           -- encrypted
  refresh_token    text,           -- encrypted
  token_expires_at timestamptz,
  provider_user_id text,
  scope            text,
  is_active        boolean DEFAULT true,
  connected_at     timestamptz DEFAULT now(),
  last_synced_at   timestamptz,
  UNIQUE(user_id, provider)
);

-- RLS: users own their own data
ALTER TABLE public.step_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "step_logs: own data" ON public.step_logs
  FOR ALL USING (auth.uid() = user_id);

ALTER TABLE public.wearable_connections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "wearable_connections: own data" ON public.wearable_connections
  FOR ALL USING (auth.uid() = user_id);
```

---

## 📊 Data Model — `step_logs` Merging Logic

Multiple sources can exist for the same day. Priority for display:
```
Fitbit > Strava > browser_sensor > manual
```

The Dashboard card always shows the **highest step count** for today (or the highest-priority source if equal).

---

## 📋 Implementation Phases

---

## Phase 1 — MET Calorie Calculation + Manual Entry + Supabase Schema

> **Effort:** 🟢 Small · **External APIs:** None · **Delivers immediate value**

### TASK 1A — Create `src/data/metValues.js`

New file with the MET table above. Export:
- `EXERCISE_MET` — per-exercise MET map
- `CATEGORY_MET` — per-muscle-group fallback
- `calcWorkoutCalories(log, userWeightKg)` — computes calories for one workout log

### TASK 1B — Wire Calories to Dashboard (no API needed)

**File:** `src/components/pages/DashboardPage.jsx`

> ⚠️ **GAP 3 fix:** Must include cardioLog calories alongside MET-derived workout calories.
> ⚠️ **GAP 4 fix:** The Dashboard uses a single unified "DAILY ACTIVITY" card with inline progress bars — not 3 separate cards. The `todayCaloriesBurned` value should be wired into the existing `Cals Burned` row (line 538) which currently hard-codes `val: 0`.

```js
import { calcWorkoutCalories, calcCardioCalories } from '../../data/metValues';

// In DashboardPage, compute calories from BOTH workout logs AND cardio logs:
const todayCaloriesBurned = useMemo(() => {
  const todayStr = tod();
  // Strength training calories (MET-based)
  const workoutCals = workoutLogs
    .filter(l => l.date === todayStr && l.userId === user?.id)
    .reduce((sum, log) => sum + (calcWorkoutCalories(log, user?.weight) || 0), 0);
  // Cardio log calories (user-provided or MET-based fallback)
  const cardioCals = (cardioLog || [])
    .filter(c => c.date === todayStr && c.userId === user?.id)
    .reduce((sum, c) => sum + calcCardioCalories(c, user?.weight), 0);
  return workoutCals + cardioCals;
}, [workoutLogs, cardioLog, user]);

// Wire into the existing card's data array:
{ label: 'Cals Burned', val: todayCaloriesBurned, target: 500, color: '#F85F1B' },
```

Replace the "CALORIES BURNED" placeholder card with:
- Today's workout calories
- "From your training sessions" sub-label
- Tap → opens a detail modal showing per-session breakdown
- If step_log has active calories from a device, add those on top

### TASK 1C — Manual Step Entry

Replace the "DAILY ACTIVITY" placeholder card with a tappable card that opens a manual entry modal:

```jsx
// StepEntryModal state:
// steps (number), date (today), note

// Card shows:
// Today's steps → progress toward goal (10,000 default)
// Progress ring (same pattern as water tracker)
// "🚶 8,200 / 10,000 steps · 82%"
// Tap → opens bottom sheet modal with number input + date picker
```

**Step goal stored in `user_profiles`:** Add `step_goal integer DEFAULT 10000` to the SQL table.

> ⚠️ **GAP 5 fix:** The following SQL, keyMap update, and user object update are ALL required:
>
> ```sql
> -- Migration: add step_goal to user_profiles
> ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS step_goal integer DEFAULT 10000;
> ```
>
> In `AppContext.jsx` `updateProfile` keyMap (line ~618), add: `stepGoal: 'step_goal'`
>
> In `AppContext.jsx` `user` object (line ~652), add: `stepGoal: profile.step_goal || 10000`

### TASK 1D — `src/utils/activityUtils.js` (NEW)

```js
export const calcStepsCalories = (steps, userWeightKg) => {
  // Average stride length: 0.762m for Indian men (~5'8"), 0.6858m for women (~5'4")
  // 1 kcal ≈ burned every 20 steps at moderate pace for 70kg person
  // MET for walking at 4 km/h = 3.0
  // This is an estimate — device data is always more accurate
  const kcalPer1000Steps = userWeightKg * 0.05; // approx
  return Math.round((steps / 1000) * kcalPer1000Steps);
};

export const getStepGoalPercent = (steps, goal = 10000) =>
  Math.min(100, Math.round((steps / goal) * 100));

export const formatSteps = (steps) =>
  steps >= 1000 ? `${(steps / 1000).toFixed(1)}k` : `${steps}`;

// GAP 13 fix: source priority selector for multi-source step logs
const SOURCE_PRIORITY = ['fitbit', 'strava', 'apple_health', 'browser_sensor', 'manual'];

export const getDisplayStepLog = (stepLogs, date) => {
  const todayLogs = stepLogs.filter(l => l.date === date);
  if (todayLogs.length === 0) return null;
  // Sort by source priority, then pick the first (highest priority)
  return todayLogs.sort((a, b) => 
    SOURCE_PRIORITY.indexOf(a.source) - SOURCE_PRIORITY.indexOf(b.source)
  )[0];
};

export const getSourceLabel = (source) => {
  const labels = {
    fitbit: '🔵 From Fitbit',
    strava: '🟣 From Strava',
    apple_health: '🍎 From Apple Health',
    browser_sensor: '📱 Browser sensor',
    manual: '✋ Manual entry',
  };
  return labels[source] || source;
};
```

### TASK 1E — `step_logs` Supabase Integration in AppContext

```js
// AppContext additions:
const [stepLogs, setStepLogState] = useState([]);

// Load from Supabase on boot (inside loadCloudData):
const { data: stepData } = await supabase
  .from('step_logs')
  .select('*')
  .eq('user_id', userId)
  .order('date', { ascending: false })
  .limit(90);
setStepLogState(stepData || []);

// logSteps(steps, source = 'manual', extras = {}):
const logSteps = useCallback(async ({ steps, date, source = 'manual', distanceKm, caloriesActive, floors }) => {
  if (!user?.id) return;
  const entry = {
    id: `${user.id}_${date}_${source}`,
    user_id: user.id,
    date,
    steps,
    distance_km: distanceKm || null,
    calories_active: caloriesActive || null,
    floors: floors || null,
    source,
    synced_at: new Date().toISOString(),
  };
  // GAP 12 fix: use 'id' as conflict target since id is deterministic from user+date+source
  await supabase.from('step_logs').upsert(entry, { onConflict: 'id' });
  setStepLogState(prev => {
    const filtered = prev.filter(l => !(l.date === date && l.source === source));
    return [...filtered, entry].sort((a, b) => b.date.localeCompare(a.date));
  });
}, [user?.id]);

// Expose: stepLogs, logSteps, todaySteps
```

### TASK 1F — Dashboard Cards Redesign

Replace both placeholder cards (DAILY ACTIVITY + CALORIES BURNED) in the 3-col activity row:

**Card 1 — Daily Steps:**
```jsx
<div className="glass-card" style={{ padding: 20, borderRadius: 16, cursor: 'pointer' }}
  onClick={() => setShowStepModal(true)}>
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
    <div style={{ fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase',
      color: 'var(--on-surface-variant)' }}>DAILY ACTIVITY</div>
    <div style={{ /* ember-glow icon pill */ }}>
      <Footprints size={18} color="var(--primary)" />
    </div>
  </div>
  {todaySteps > 0 ? (<>
    <div className="headline-lg" style={{ color: 'var(--primary)', marginBottom: 4 }}>
      {formatSteps(todaySteps)}
    </div>
    <div style={{ fontSize: 11, color: 'var(--on-surface-variant)', marginBottom: 12 }}>
      steps today · {getStepGoalPercent(todaySteps, user.stepGoal || 10000)}% of goal
    </div>
    {/* Mini progress bar */}
    <div style={{ height: 4, background: 'var(--surface-container-highest)', borderRadius: 2 }}>
      <div style={{
        height: '100%',
        width: `${getStepGoalPercent(todaySteps, user.stepGoal || 10000)}%`,
        background: 'linear-gradient(90deg, var(--primary-container), var(--primary))',
        borderRadius: 2,
        transition: 'width 0.5s var(--ease-smooth)',
      }} />
    </div>
  </>) : (<>
    <div className="headline-lg" style={{ color: 'var(--on-surface-dim)', marginBottom: 4 }}>—</div>
    <div style={{ fontSize: 11, color: 'var(--on-surface-dim)', marginBottom: 12 }}>
      tap to log steps
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <PulseIndicator />
      <span style={{ fontSize: 10, color: 'var(--on-surface-dim)' }}>Connect a wearable for auto-sync</span>
    </div>
  </>)}
</div>
```

**Card 2 — Calories Burned:**
```jsx
// Shows workout calories (computed) + device active calories (if connected)
// Sub-label shows source: "From 1 workout · +1,240 kcal"
// If no workout today: "—" with "Complete a workout to track"
```

**Card 3 — Water Intake:** (already wired, keep as-is)

### Phase 1 Checklist
- [ ] Create `src/data/metValues.js` with MET table + `calcWorkoutCalories` + `calcCardioCalories` (GAP 2+3 fix: cover all splits exercises + include cardio)
- [ ] Create `src/utils/activityUtils.js` with step helpers + `getDisplayStepLog` + `getSourceLabel` (GAP 13 fix)
- [ ] Run Supabase SQL for `step_logs` + `wearable_connections` tables
- [ ] Run `ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS step_goal integer DEFAULT 10000` (GAP 5)
- [ ] Update `AppContext.jsx` — add `stepGoal` to `updateProfile` keyMap + `user` object (GAP 5)
- [ ] Update `AppContext.jsx` — add `stepLogs`, `logSteps`, expose `todaySteps`
- [ ] Update Dashboard unified DAILY ACTIVITY card — wire `todayCaloriesBurned` (MET + cardio) into existing `Cals Burned` row; wire `todaySteps` into `Steps` row (GAP 4 fix)
- [ ] Build `StepEntryModal` (bottom sheet, number input, date-aware)
- [ ] Step Goal setting on Profile page (simple number input, default 10,000)
- [ ] Add simple energy balance row on Diet Analysis tab (Calories In - Calories Out) (GAP 11)
- [ ] Wire step/calorie logs into daily Readiness score via `calcObjectiveReadiness` (GAP 10: pass steps there, not into `calcReadinessScore`)

---

## Phase 2 — Browser Pedometry (DeviceMotion API)

> **Effort:** 🟢 Small · **External APIs:** None · **Works on any device while app is open**
> **Use case:** Indian users who don't have a wearable but want approximate step counts

### How It Works

Modern browsers expose `DeviceMotionEvent` which fires at ~50Hz with accelerometer data. Step detection uses peak-valley analysis on the magnitude of the acceleration vector.

```
magnitude = √(ax² + ay² + az²)
```

A "step" is detected when `magnitude` crosses a threshold (~10 m/s²) with minimum time gap between steps (~300ms for natural walking). This is the same algorithm that phone pedometer apps use.

### Implementation

```js
// src/hooks/usePedometer.js — NEW HOOK
import { useState, useEffect, useRef, useCallback } from 'react';

const STEP_THRESHOLD = 10;        // m/s² magnitude threshold
const MIN_STEP_INTERVAL_MS = 300; // minimum 300ms between detected steps (max 3.3 steps/sec)
const SMOOTHING_WINDOW = 5;       // samples to smooth before peak detection

export const usePedometer = (isActive = false) => {
  const [steps, setSteps] = useState(0);
  const [isAvailable, setIsAvailable] = useState(false);
  const [isPermissionGranted, setIsPermissionGranted] = useState(false);
  const lastStepTime = useRef(0);
  const magnitudeBuffer = useRef([]);
  const prevSmoothed = useRef(0);
  const isAboveThreshold = useRef(false);

  const requestPermission = useCallback(async () => {
    // iOS 13+ requires explicit permission for DeviceMotion
    if (typeof DeviceMotionEvent?.requestPermission === 'function') {
      const result = await DeviceMotionEvent.requestPermission();
      setIsPermissionGranted(result === 'granted');
      return result === 'granted';
    }
    setIsPermissionGranted(true);
    return true;
  }, []);

  useEffect(() => {
    setIsAvailable('DeviceMotionEvent' in window);
  }, []);

  useEffect(() => {
    if (!isActive || !isAvailable || !isPermissionGranted) return;

    const handleMotion = (event) => {
      const { x, y, z } = event.accelerationIncludingGravity || {};
      if (x == null || y == null || z == null) return;

      const magnitude = Math.sqrt(x * x + y * y + z * z);

      // Smooth over last N samples
      magnitudeBuffer.current.push(magnitude);
      if (magnitudeBuffer.current.length > SMOOTHING_WINDOW) {
        magnitudeBuffer.current.shift();
      }
      const smoothed = magnitudeBuffer.current.reduce((a, b) => a + b, 0)
        / magnitudeBuffer.current.length;

      const now = Date.now();

      // Peak detection: crossing threshold upward
      if (!isAboveThreshold.current && smoothed > STEP_THRESHOLD) {
        isAboveThreshold.current = true;
        if (now - lastStepTime.current > MIN_STEP_INTERVAL_MS) {
          lastStepTime.current = now;
          setSteps(s => s + 1);
        }
      } else if (isAboveThreshold.current && smoothed <= STEP_THRESHOLD) {
        isAboveThreshold.current = false;
      }

      prevSmoothed.current = smoothed;
    };

    window.addEventListener('devicemotion', handleMotion);
    return () => window.removeEventListener('devicemotion', handleMotion);
  }, [isActive, isAvailable, isPermissionGranted]);

  const reset = useCallback(() => setSteps(0), []);

  return { steps, isAvailable, isPermissionGranted, requestPermission, reset };
};
```

### UX for Browser Pedometry

- Only offered as an option on the Step card — not auto-started
- Shows a clear disclaimer: "Approximate count. Requires this page to be open. Less accurate than a wearable."
- iOS 13+: requests DeviceMotion permission with a clear explanation
- Android Chrome: works without permission
- At end of day, saves to `step_logs` with `source: 'browser_sensor'`
- PWA installed users get the best experience (always-open background)

### Phase 2 Checklist
- [ ] Create `src/hooks/usePedometer.js`
- [ ] Add "Track Steps Now" button on Step card (only if no wearable connected + no manual entry for today)
- [ ] iOS permission request flow with user-friendly explanation
- [ ] Auto-save pedometer count to `step_logs` at midnight or on page close (`beforeunload`)
- [ ] Show live step counter in the Step card while active
- [ ] Accuracy disclaimer UI

---

## Phase 3 — Fitbit Web API Integration (Free, ~30k Indian Users)

> **Effort:** 🟡 Medium · **External APIs:** Fitbit Web API (FREE) · **Note: Deprecating Sept 2026**
> **Why Fitbit:** Free, OAuth web flow, most accurate data, covers the premium Indian segment

### Why Fitbit Despite Deprecation?

- **Free today**, works until September 2026 (18 months of runway)
- Fitbit is the #1 fitness tracker used by Indian working professionals (₹8k–₹25k price range)
- After deprecation: Fitbit data migrates to Google Health Connect, which requires a native app (Phase 6 handles this)
- **Now is exactly the right time** — users who connect Fitbit get 18+ months of automatic sync

### Setup (Vishal — One-Time Manual Steps)

1. Go to `https://dev.fitbit.com/apps` → "Register an App"
2. **Application Name**: FitTrack Pro
3. **OAuth 2.0 Application Type**: Server (not Personal — allows all users to connect)
4. **Callback URL**: `https://fittrackbyvishal.vercel.app/fitbit/callback`
   - Also add: `http://localhost:5173/fitbit/callback` (for dev)
5. **Default Access Type**: Read Only
6. Note down: `Client ID`, `Client Secret`
7. Add both to Vercel env vars: `FITBIT_CLIENT_ID`, `FITBIT_CLIENT_SECRET`
8. Add to Supabase secrets for Edge Functions

### Architecture — OAuth Flow for Web App

```
User clicks "Connect Fitbit"
       ↓
App redirects to Fitbit OAuth page
       ↓
User authorizes → Fitbit redirects to /fitbit/callback?code=XXX
       ↓
Supabase Edge Function: exchange code → access_token + refresh_token
       ↓
Store tokens in wearable_connections table (encrypted)
       ↓
Edge Function fetches today's steps/calories from Fitbit API
       ↓
Writes to step_logs with source: 'fitbit'
       ↓
Scheduled daily sync at midnight IST
```

### Supabase Edge Function — `fitbit-oauth` (NEW)

**File:** `supabase/functions/fitbit-oauth/index.ts`

```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const FITBIT_CLIENT_ID = Deno.env.get('FITBIT_CLIENT_ID')!;
const FITBIT_CLIENT_SECRET = Deno.env.get('FITBIT_CLIENT_SECRET')!;
const APP_URL = 'https://fittrackbyvishal.vercel.app';

serve(async (req) => {
  const url = new URL(req.url);
  const path = url.pathname.split('/').pop();

  // Step 1: Generate authorization URL
  if (path === 'authorize') {
    const scope = 'activity heartrate profile';
    const authUrl = `https://www.fitbit.com/oauth2/authorize?` +
      `response_type=code&client_id=${FITBIT_CLIENT_ID}&` +
      `redirect_uri=${APP_URL}/fitbit/callback&scope=${encodeURIComponent(scope)}`;
    return Response.redirect(authUrl, 302);
  }

  // Step 2: Handle callback — exchange code for tokens
  if (path === 'callback') {
    const code = url.searchParams.get('code');
    const userId = url.searchParams.get('state'); // passed from frontend

    const tokenRes = await fetch('https://api.fitbit.com/oauth2/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(`${FITBIT_CLIENT_ID}:${FITBIT_CLIENT_SECRET}`)}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code!,
        redirect_uri: `${APP_URL}/fitbit/callback`,
      }),
    });

    const tokens = await tokenRes.json();

    // Store tokens in Supabase
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    await supabase.from('wearable_connections').upsert({
      user_id: userId,
      provider: 'fitbit',
      access_token: tokens.access_token,    // TODO: encrypt before storing
      refresh_token: tokens.refresh_token,
      token_expires_at: new Date(Date.now() + tokens.expires_in * 1000).toISOString(),
      provider_user_id: tokens.user_id,
      scope: tokens.scope,
      is_active: true,
    }, { onConflict: 'user_id,provider' });

    // Trigger immediate sync
    await syncFitbitData(userId, tokens.access_token, supabase);

    // Redirect back to profile with success
    return Response.redirect(`${APP_URL}/profile?fitbit=connected`, 302);
  }

  // Step 3: Sync endpoint (called by cron or manually)
  if (path === 'sync') {
    const { user_id } = await req.json();
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );
    const { data: conn } = await supabase
      .from('wearable_connections')
      .select('*')
      .eq('user_id', user_id)
      .eq('provider', 'fitbit')
      .single();

    if (!conn) return new Response('No connection', { status: 404 });

    // Refresh token if expired
    let accessToken = conn.access_token;
    if (new Date(conn.token_expires_at) < new Date()) {
      accessToken = await refreshFitbitToken(conn.refresh_token, conn.user_id, supabase);
    }

    await syncFitbitData(user_id, accessToken, supabase);
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  }

  return new Response('Not found', { status: 404 });
});

async function syncFitbitData(userId: string, accessToken: string, supabase: any) {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

  // Fetch today's activity summary from Fitbit
  const res = await fetch(
    `https://api.fitbit.com/1/user/-/activities/date/${today}.json`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  const data = await res.json();
  const summary = data.summary;

  if (!summary) return;

  await supabase.from('step_logs').upsert({
    id: `${userId}_${today}_fitbit`,
    user_id: userId,
    date: today,
    steps: summary.steps || 0,
    distance_km: (summary.distances?.find((d: any) => d.activity === 'total')?.distance || 0),
    calories_active: summary.activityCalories || 0,
    floors: summary.floors || 0,
    active_minutes: (summary.fairlyActiveMinutes || 0) + (summary.veryActiveMinutes || 0),
    source: 'fitbit',
    synced_at: new Date().toISOString(),
  }, { onConflict: 'user_id,date,source' });

  // Update last synced timestamp
  await supabase.from('wearable_connections')
    .update({ last_synced_at: new Date().toISOString() })
    .eq('user_id', userId).eq('provider', 'fitbit');
}

async function refreshFitbitToken(refreshToken: string, userId: string, supabase: any) {
  const tokenRes = await fetch('https://api.fitbit.com/oauth2/token', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${btoa(`${FITBIT_CLIENT_ID}:${FITBIT_CLIENT_SECRET}`)}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({ grant_type: 'refresh_token', refresh_token: refreshToken }),
  });
  const tokens = await tokenRes.json();
  await supabase.from('wearable_connections').update({
    access_token: tokens.access_token,
    refresh_token: tokens.refresh_token,
    token_expires_at: new Date(Date.now() + tokens.expires_in * 1000).toISOString(),
  }).eq('user_id', userId).eq('provider', 'fitbit');
  return tokens.access_token;
}
```

### Supabase Cron Job (pg_cron) — Daily Sync at Midnight IST

```sql
-- Run in Supabase SQL Editor (pg_cron extension must be enabled)
SELECT cron.schedule(
  'fitbit-daily-sync',
  '30 18 * * *',  -- 18:30 UTC = 00:00 IST
  $$
  SELECT net.http_post(
    url := 'https://<your-supabase-ref>.supabase.co/functions/v1/fitbit-oauth/sync-all',
    body := '{}'::jsonb,
    headers := '{"Authorization": "Bearer <service_role_key>"}'::jsonb
  );
  $$
);
```

### Frontend: "Connect Fitbit" on Profile Page

```jsx
// In ProfilePage.jsx — "Connected Devices" section (NEW):
<div className="glass-card" style={{ padding: 20, borderRadius: 20, marginBottom: 24, border: 'none' }}>
  <div className="headline-md" style={{ marginBottom: 16 }}>Connected Devices</div>
  {fitbitConnected ? (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div>
        <div style={{ fontWeight: 700 }}>Fitbit</div>
        <div style={{ fontSize: 12, color: 'var(--on-surface-variant)' }}>
          Last synced: {fmt(lastSyncedAt)} · Steps syncing daily
        </div>
      </div>
      <button onClick={disconnectFitbit} style={{ /* ghost danger button */ }}>
        Disconnect
      </button>
    </div>
  ) : (
    <button
      onClick={() => {
        // Pass user ID as state for OAuth callback
        window.location.href =
          `https://<supabase-ref>.supabase.co/functions/v1/fitbit-oauth/authorize?state=${user.id}`;
      }}
      style={{ /* btn-g style */ }}
    >
      🔗 Connect Fitbit — Auto-sync steps daily
    </button>
  )}
</div>
```

### Fitbit Data Available (all free)

| Data | Fitbit API Endpoint | FitTrack Usage |
|---|---|---|
| Steps | `/activities/date/{date}` | DAILY ACTIVITY card |
| Active calories | `/activities/date/{date}` | CALORIES BURNED card |
| Floors climbed | `/activities/date/{date}` | Future: activity score |
| Active minutes | `/activities/date/{date}` | Readiness score input |
| Heart rate zones | `/activities/heart/date/{date}/1d/1min` | Future |
| Sleep | `/sleep/date/{date}` | Future: Readiness score |

### Phase 3 Checklist
- [ ] Register Fitbit app at `dev.fitbit.com` (Vishal does this manually)
- [ ] Add `FITBIT_CLIENT_ID`, `FITBIT_CLIENT_SECRET` to Vercel + Supabase secrets
- [ ] Create Supabase Edge Function `fitbit-oauth` (authorize, callback, sync, sync-all)
- [ ] Add `/fitbit/callback` route to `vercel.json` rewrite rules
- [ ] Run `wearable_connections` SQL schema
- [ ] "Connected Devices" section in ProfilePage
- [ ] Dashboard step/calorie card shows "From Fitbit" source badge
- [ ] Set up pg_cron daily sync at midnight IST
- [ ] Token refresh logic (Fitbit tokens expire in 8 hours)
- [ ] Disconnect flow (revoke token + delete from `wearable_connections`)
- [ ] Test full OAuth flow on mobile (critical — most users on phone)

---

## Phase 4 — Strava Integration (Free, Indian Runners & Cyclists)

> **Effort:** 🟡 Medium · **External APIs:** Strava API (FREE) · **No deprecation concerns**
> **Why Strava:** Free forever, very popular with Indian urban fitness community (Delhi, Mumbai, Bangalore running clubs)

### Strava Data Available

- **Activities**: Running, cycling, swimming, HIIT, yoga — syncs with workout logs
- **Steps**: NOT available (Strava doesn't track steps)
- **Calories**: Per-activity estimate (uses heart rate + pace)
- **Distance**: GPS-accurate
- **Heart rate**: From connected HRM or Apple Watch

### Setup

1. Go to `https://www.strava.com/settings/api` → Create Application
2. **Authorization Callback Domain**: `fittrackbyvishal.vercel.app`
3. Note `Client ID` and `Client Secret`

### What Strava Adds

- Accurately log running/cycling/swimming calories (GPS-based, more accurate than MET)
- Pull cardio activities directly into the Cardio Log tab (WorkoutHistoryPage)
- No steps data (Strava doesn't provide this)
- Works perfectly alongside Fitbit (Fitbit = steps, Strava = GPS cardio)

### Phase 4 Checklist
- [ ] Register Strava app
- [ ] Supabase Edge Function `strava-oauth` (similar pattern to Fitbit)
- [ ] Pull last 7 days of activities on connect
- [ ] Map Strava activities to `cardioLog` entries (type, duration, distance, calories)
- [ ] Add Strava to "Connected Devices" section in ProfilePage
- [ ] Show Strava badge on cardio activity cards in WorkoutHistoryPage

---

## Phase 5 — iOS Shortcuts: Apple Health Bridge (Power Users)

> **Effort:** 🟢 Small (server side) + user effort to set up
> **No API fees, no native app needed — but requires user knowledge**

### How It Works

Apple Shortcuts can read from HealthKit and make HTTP requests. Users who are willing to spend 5 minutes can set up automatic daily health data posting to FitTrack Pro.

### Setup Guide (for Vishal to document / video tutorial)

**Create a Supabase Edge Function endpoint that accepts health data:**

```typescript
// supabase/functions/apple-health-sync/index.ts
serve(async (req) => {
  const authHeader = req.headers.get('Authorization');
  const userId = authHeader?.replace('Bearer ', '');
  if (!userId) return new Response('Unauthorized', { status: 401 });

  const body = await req.json();
  // body: { steps, caloriesActive, heartRate, sleepHours, date }

  await supabase.from('step_logs').upsert({
    id: `${userId}_${body.date}_apple_health`,
    user_id: userId,
    date: body.date,
    steps: body.steps || 0,
    calories_active: body.caloriesActive || null,
    source: 'apple_health',
  }, { onConflict: 'user_id,date,source' });

  return new Response(JSON.stringify({ success: true }), { status: 200 });
});
```

**Apple Shortcut (user creates this):**
```
Shortcut: "FitTrack Daily Sync"
Trigger: Automation → Daily at 11 PM

Steps:
1. Get Health Samples → Steps, Last 24 hours
2. Get Health Samples → Active Energy Burned, Last 24 hours
3. Text → today's date (YYYY-MM-DD)
4. URL → https://<ref>.supabase.co/functions/v1/apple-health-sync
5. Get Contents of URL
   Method: POST
   Body: JSON
   {
     "steps": (Step count from step 1),
     "caloriesActive": (Calories from step 2),
     "date": (Date from step 3)
   }
   Headers: Authorization: Bearer <their-user-id>
```

**User ID is found in Profile → "Apple Health Setup" card with a pre-filled Shortcut download link.**

### Making the Shortcut Easy

Using `shortcuts.apple.com`, Vishal can create the Shortcut with pre-filled endpoint URL and distribute it as an iCloud link. Users just tap "Add Shortcut" and enter their FitTrack user ID. This is how apps like Notion, Airtable, and smaller health apps handle iOS data without a native app.

### Phase 5 Checklist
- [ ] Create `apple-health-sync` Supabase Edge Function
- [ ] Generate per-user API token for shortcut authentication (or use existing Supabase JWT)
- [ ] "Apple Health Setup" section in ProfilePage (iOS users only — detect via `navigator.userAgent`)
- [ ] Create the Shortcut template and host on iCloud Shortcuts
- [ ] Write a step-by-step guide / YouTube tutorial (great content for Vishal's fitness creator brand!)

---

## Phase 6 — Future: React Native / PWA Companion App

> **Effort:** 🔴 Large · **This is the long-term solution for full native health data**

This phase is documented for planning but NOT for immediate implementation.

### Why This is Eventually Necessary

All the major Indian budget wearables (boAt, Noise, Fire-Boltt) sync to **Android Health Connect**. Health Connect is only accessible via native Android apps (or a properly declared `reads health data` PWA, which has extremely limited browser support). Similarly, Apple HealthKit requires a native iOS app.

**Without a native app, you can never access data from these 50%+ of the Indian wearable market.**

### Options

**Option A — React Native wrapper (recommended)**
- Use `expo-health` which wraps both HealthKit (iOS) and Health Connect (Android)
- Share 95% of your React business logic with the native app
- The web app and native app co-exist, sharing the same Supabase backend
- Native app handles only health data collection → pushes to `step_logs` via Supabase

**Option B — Progressive Web App with native health permissions**
- Chrome on Android 14+ supports a limited Health Connect integration via `chrome://flags`
- Not production-ready in 2026 but worth watching

**Option C — Third-party aggregator (paid)**
- **Terra API** ($399/month) — supports all platforms including Health Connect + HealthKit
- **Vital API** (similar pricing) 
- **Spike API** (lower pricing, check their dev tier)
- Only viable once FitTrack Pro has paying users to cover the cost

### Phase 6 Milestone Triggers
- When FitTrack Pro has 500+ regular users
- When Vishal starts monetizing coaching clients through the app
- When Fitbit Web API deprecation forces migration (September 2026)

---

## 📊 Dashboard UX — Final Redesign of Activity Row

After all phases, the 3-card activity row on Dashboard becomes:

```
┌─────────────────────────┬─────────────────────────┬─────────────────────────┐
│  DAILY ACTIVITY         │  CALORIES BURNED         │  WATER INTAKE           │
│  🚶 Footprints          │  ⚡ Zap                   │  💧 Droplets            │
│                         │                          │                         │
│  8,247                  │  1,840                   │  2.4L / 3.0L            │
│  steps today            │  kcal total today        │  80% of goal            │
│  82% of 10k goal        │  Workout: 600            │  ███████░░ ←progress    │
│  ███████░░ ←progress    │  Resting est: 1,240      │                         │
│                         │  🔵 From Fitbit          │  5 glasses              │
│  🔵 From Fitbit ·       │                          │  + Log Water            │
│     auto-synced 9:30am  │                          │                         │
└─────────────────────────┴─────────────────────────┴─────────────────────────┘
```

**Source badges (small pill, bottom of card):**
- 🔵 `From Fitbit` — synced automatically
- 🟣 `From Strava` — synced automatically
- 🍎 `From Apple Health` — via shortcut
- ✋ `Manual entry` — user logged themselves
- 📱 `Browser sensor` — DeviceMotion API estimate

---

## 📈 Weekly Steps + Calories Widget (New Dashboard Section)

Add a weekly bar chart below the 3-card row, similar to the existing weight trend chart:

```jsx
// 7-day bar chart using Recharts BarChart
// X-axis: Mon, Tue, Wed, Thu, Fri, Sat, Sun
// Primary bars: Steps (scaled to step goal = 100%)
// Secondary bars or overlay: Calories from workouts

// Step goal line (10,000 steps) as a ReferenceLine
// Days at 100%+ highlighted in var(--primary)
```

This gives users the same motivation as a HealthifyMe or Fitbit weekly report — directly in the app.

---

## 🔗 Integration with Existing Features

### Iron League / Olympus League XP
- Award bonus XP for hitting step goals: `steps >= 10,000 → +50 XP` to `abs` or `calves` or `cardio` muscle group
- Creates a direct incentive to walk more

### Daily Readiness Score
Current formula: 40% objective (training load) + 60% subjective (check-in).
Add step data to objective score:
```js
// In readinessUtils.js — update calcObjectiveReadiness():
const stepBonus = todaySteps >= 10000 ? 10      // full goal
  : todaySteps >= 7500 ? 5                        // 75%
  : todaySteps >= 5000 ? 2                        // 50%
  : 0;
// Adjust weights: training 35% + steps 5% + recovery 60%
```

### Diet Page — Energy Balance
Show a net energy balance on the Analysis tab:
```
Calories In (food log): 2,400 kcal
Calories Out (workout + TDEE): -2,840 kcal
━━━━━━━━━━━━━━━━━━━━━━━━━━━
Net Balance: -440 kcal deficit ✓ (on track for 0.5kg/week loss)
```
This is the killer feature — connecting food tracking with activity tracking for actual weight management guidance.

---

## 📦 New Files Summary

| File | Status | Description |
|------|--------|-------------|
| `src/data/metValues.js` | 🆕 NEW | MET table for calorie calculation from workouts |
| `src/utils/activityUtils.js` | 🆕 NEW | Step helpers, calorie calculators |
| `src/hooks/usePedometer.js` | 🆕 NEW | DeviceMotion API step counter hook |
| `supabase/functions/fitbit-oauth/index.ts` | 🆕 NEW | Fitbit OAuth + sync Edge Function |
| `supabase/functions/strava-oauth/index.ts` | 🆕 NEW | Strava OAuth + sync Edge Function |
| `supabase/functions/apple-health-sync/index.ts` | 🆕 NEW | Apple Shortcuts webhook receiver |
| `supabase/migrations/YYYYMMDD_activity_tables.sql` | 🆕 NEW | `step_logs` + `wearable_connections` tables |

| File | Change |
|------|--------|
| `src/components/pages/DashboardPage.jsx` | Replace placeholder cards, add weekly chart, energy balance |
| `src/components/pages/ProfilePage.jsx` | Add "Connected Devices" section |
| `src/context/AppContext.jsx` | Add `stepLogs`, `logSteps`, expose `todaySteps`, `todayWorkoutCalories` |
| `src/data/constants.js` | Add wearable provider constants |
| `vercel.json` | Add `/fitbit/callback` and `/strava/callback` rewrite rules |

---

## 🚦 Implementation Priority Order

| Phase | What | Effort | Impact | External Cost |
|---|---|---|---|---|
| **1A** | MET calorie calculation from workout logs | 🟢 S | 🔴 High | ₹0 |
| **1B** | Manual step entry + step_logs Supabase table | 🟢 S | 🔴 High | ₹0 |
| **1C** | Dashboard card redesign (steps + calories) | 🟢 S | 🔴 High | ₹0 |
| **1D** | Weekly bar chart (steps 7-day) | 🟢 S | 🟠 High | ₹0 |
| **2** | Browser pedometry (DeviceMotion API) | 🟢 S | 🟡 Medium | ₹0 |
| **3** | Fitbit OAuth Web API | 🟡 M | 🔴 High | ₹0 (free API) |
| **4** | Strava OAuth | 🟡 M | 🟠 High | ₹0 (free API) |
| **5** | iOS Shortcuts bridge | 🟢 S | 🟡 Medium | ₹0 |
| **6** | React Native companion app | 🔴 L | 🔴 High | Dev cost only |

---

## ⚠️ Key Decisions & Notes for Antigravity Agents

1. **No Google Fit REST API** — new signups closed May 2024, use Fitbit instead
2. **Health Connect = Native Android only** — a web app cannot access it directly
3. **Apple HealthKit = Native iOS only** — use Shortcuts as workaround
4. **boAt / Noise / Fire-Boltt** — no public APIs exist, their data lives in Health Connect (Phase 6 solves this)
5. **Fitbit tokens expire every 8 hours** — the Edge Function must handle refresh automatically
6. **OAuth tokens stored in Supabase** — never in `localStorage` or exposed to the client
7. **Step source priority**: Fitbit > Strava > Apple Health > Browser Sensor > Manual — dashboard always shows best source
8. **MET calorie calculation** requires `durationMinutes` on workout logs — already implemented in WorkoutPage
9. **Calories from workouts ≠ total daily calories burned** — always show them as separate line items (workout calories + estimated resting calories = total)
10. **Indian context**: 10,000 steps/day goal resonates strongly with Indian urban professionals who walk between metro stations, office corridors, etc. Show this as a "metro commute challenge" if needed.