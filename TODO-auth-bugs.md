# FitTrack Pro — Post-Auth Migration Bug Fixes

> **Created:** 2026-04-08
> **Status:** ✅ **ALL BUGS RESOLVED** (2026-04-08)
> **Updated:** 2026-04-08 — Added Bugs 6–8 from codebase audit
> **Priority:** All Critical — these affect every new user's first-run experience
> **Prerequisite:** `TODO-auth-migration.md` has been executed (Supabase Auth is live)
> **Files primarily affected:** `AuthModal.jsx`, `AppContext.jsx`, `authMigration.js`, `DashboardPage.jsx`, `DietPage.jsx`, `ProfilePage.jsx`, `WorkoutPage.jsx`, `WorkoutHistoryPage.jsx`, `ProgressPage.jsx`, `WeightLogPage.jsx`, `MuscleMapPage.jsx`, `muscleData.js`, plus any user-scoped page/helper still filtering on hardcoded demo IDs like `'vishal'` or `'demo'`

---

## Bug Summary

| # | Bug | Severity | Root Cause Area |
|---|-----|----------|----------------|
| 1 | Google sign-in requires 2 attempts for new users | Critical | Race condition in `fetchProfile()` — double-call from `getSession()` and `onAuthStateChange` firing simultaneously |
| 2 | New users see "Welcome Back" instead of "Welcome" | High | Dashboard greeting is unconditional — no new-user detection |
| 3 | Diet page shows wrong phase status with no weight goal | High | `goal` silently defaults to `'maintenance'` even when user has never set a goal |
| 4 | Stats strip shows "nullkg", "nullcm", wrong TDEE | High | No null guards before string interpolation + `activity` / `activityLevel` mismatch keeps TDEE wrong even after profile is filled |
| 5 | New user (same name) inherits another user's data | Critical | Account isolation is broken across old-auth migration, Phase Auth-2 upload, and lingering hardcoded `'vishal'` / `'demo'` fallback filters |
| 6 | ProfilePage activity level edit silently discards changes | High | Form uses `f.activityLevel` but `updateProfile()` keyMap only has `activity` — field never maps to Supabase column |
| 7 | `genSample()` still generates `userId: 'vishal'` data | Medium | Dead code — `SAMPLE` imported but unused in AppContext after cloud migration; risk of re-introduction |
| 8 | Email sign-up users never see "WELCOME" greeting | Medium | `AuthModal.jsx` inserts `user_profiles` but doesn't set `fittrack_onboarding_pending` — only Google sign-up path sets it |

---

## Bug 1 — Google Sign-In Requires 2 Attempts

### Symptom
A brand-new user taps "Continue with Google". OAuth flow completes (Google redirects back), but `AuthModal` is still visible. The user taps Google Sign-In a second time and it works immediately.

### Root Cause Analysis

The current `AppContext.jsx` auth setup from TASK 3c of the migration plan:

```js
useEffect(() => {
  supabase.auth.getSession().then(({ data: { session } }) => {
    setSession(session);
    if (session?.user) fetchProfile(session.user.id);
    else setAuthLoading(false);  // ← Problem A
  });

  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    async (event, session) => {
      setSession(session);
      if (session?.user) await fetchProfile(session.user.id);
      else { setProfile(null); setAuthLoading(false); }
    }
  );

  return () => subscription.unsubscribe();
}, []);
```

**Problem A — `authLoading` set to false too early:**
When the page first loads before any auth state, `getSession()` can return `null` (OAuth tokens haven't been processed yet from the URL hash). The `else` branch fires immediately → `setAuthLoading(false)` → the app renders `AuthModal`. Then milliseconds later, `onAuthStateChange` fires with the OAuth session. The modal has already rendered and the user sees a flash or thinks login failed.

**Problem B — Race condition on double INSERT:**
On OAuth redirect return, both `getSession()` AND `onAuthStateChange` can fire with a valid session within the same tick. Both call `fetchProfile(userId)`. If the profile doesn't exist yet, both attempt to `INSERT` into `user_profiles` simultaneously. The second INSERT fails with a unique-key conflict. Since there is no error check on `created` in the original plan, `setProfile(null)` is never called → `authLoading` stays `false` → app renders `AuthModal` → user appears not logged in.

**Problem C — OAuth event type not handled:**
On redirect return, Supabase fires `onAuthStateChange` with event `INITIAL_SESSION` (not `SIGNED_IN`). If the listener only guards on specific event types internally, the redirect return may not trigger `fetchProfile` at all on the first attempt.

### Fix

**File:** `src/context/AppContext.jsx`

#### Fix 1a — Use `onAuthStateChange` as the single source of truth

`onAuthStateChange` fires synchronously on setup with the current session as event `INITIAL_SESSION`. This replaces the need for a separate `getSession()` call and eliminates the race condition where both fire in the same tick.

```js
useEffect(() => {
  let initialized = false;

  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    async (event, session) => {
      // Fires immediately on setup with the current session (event: 'INITIAL_SESSION')
      // Also fires for SIGNED_IN, SIGNED_OUT, TOKEN_REFRESHED, USER_UPDATED
      if (session?.user) {
        await fetchProfile(session.user.id);
      } else {
        setSession(null);
        setProfile(null);
        setAuthLoading(false);
      }
      initialized = true;
    }
  );

  // Safety net: unblock loading screen after 3s if onAuthStateChange never fires
  // (handles edge cases like network failure during Supabase client init)
  const timeout = setTimeout(() => {
    if (!initialized) setAuthLoading(false);
  }, 3000);

  return () => {
    subscription.unsubscribe();
    clearTimeout(timeout);
  };
}, []);
```

#### Fix 1b — Guard against double INSERT using a ref + upsert

```js
const isFetchingProfile = useRef(false);  // add at top of component

const fetchProfile = async (userId) => {
  // Prevent simultaneous double-calls
  if (isFetchingProfile.current) return;
  isFetchingProfile.current = true;

  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error && error.code === 'PGRST116') {
      // Profile doesn't exist — create from Google/auth metadata
      const { data: { user: authUser } } = await supabase.auth.getUser();
      const meta = authUser?.user_metadata || {};
      const newProfile = {
        id: userId,
        name: meta.full_name || meta.name || authUser?.email?.split('@')[0] || 'User',
        gender: meta.gender || 'male',
        avatar: (meta.full_name || meta.name || 'U').slice(0, 2).toUpperCase(),
      };

      // KEY CHANGE: upsert instead of insert — gracefully handles duplicate key
      // if a parallel call already created the profile
      const { data: created, error: upsertError } = await supabase
        .from('user_profiles')
        .upsert(newProfile, { onConflict: 'id' })
        .select()
        .single();

      if (upsertError) {
        // Upsert failed for an unexpected reason — retry with a plain select
        console.error('[Auth] Profile upsert failed:', upsertError.message);
        const { data: retryData } = await supabase
          .from('user_profiles').select('*').eq('id', userId).single();
        setProfile(retryData);
      } else {
        setProfile(created);
        // Signal new-user state for greeting and onboarding
        localStorage.setItem('fittrack_onboarding_pending', 'true');
        localStorage.setItem('fittrack_user_created_at', new Date().toISOString());
      }
    } else if (error) {
      console.error('[Auth] Profile fetch error:', error.message);
      setProfile(null);
    } else {
      setProfile(data);
    }

    setSession(await supabase.auth.getSession().then(r => r.data.session));

    // Run data migration — email-gated (see Bug 5 fix)
    const { data: { user: authUser } } = await supabase.auth.getUser();
    const { shouldMigrate, oldUid } = getOldUserIdIfEmailMatches(authUser?.email);
    if (shouldMigrate && oldUid) {
      migrateLocalData(userId, oldUid);
      addToast('Your existing data has been linked to your account!', 'success');
    }
    // Always clean up old auth keys regardless of whether migration ran
    cleanupOldAuthStorage();

  } finally {
    isFetchingProfile.current = false;
    setAuthLoading(false);
  }
};
```

---

## Bug 2 — New Users See "Welcome Back" Instead of "Welcome"

### Symptom
A user signs up for the first time (Google or email). The Dashboard says **"WELCOME BACK, VISHAL"**. This is factually wrong — the user has never been here before.

### Root Cause
`DashboardPage.jsx` unconditionally renders:
```jsx
<span>WELCOME BACK,</span>
<span className="text-gradient-primary">{user.name.split(' ')[0].toUpperCase()}</span>
```
No logic distinguishes a new user from a returning one.

### Fix

**File:** `src/components/pages/DashboardPage.jsx`

#### Fix 2a — Detect new user via per-user localStorage flags

Add a `isNewUser` computed value near the top of the component (after imports and context destructuring):

```js
const isNewUser = useMemo(() => {
  if (!user?.id) return false;
  const onboardingKey = `fittrack_onboarding_pending:${user.id}`;
  const hasSeenWelcomeKey = `fittrack_has_seen_welcome:${user.id}`;
  return localStorage.getItem(onboardingKey) === 'true'
    && localStorage.getItem(hasSeenWelcomeKey) !== 'true';
}, [user?.id]);
```

#### Fix 2b — Update the greeting JSX

```jsx
// Before:
<span>WELCOME BACK,</span>

// After:
<span>{isNewUser ? 'WELCOME,' : 'WELCOME BACK,'}</span>
```

#### Fix 2c — Consume the welcome state once per user

```js
useEffect(() => {
  if (!user?.id || !isNewUser) return;
  const onboardingKey = `fittrack_onboarding_pending:${user.id}`;
  const hasSeenWelcomeKey = `fittrack_has_seen_welcome:${user.id}`;
  localStorage.removeItem(onboardingKey);
  localStorage.setItem(hasSeenWelcomeKey, 'true');
}, [user?.id, isNewUser]);
```

This means:
- First Dashboard load (right after sign-up) → "WELCOME, VISHAL"
- Any later revisit for that same account on that browser → "WELCOME BACK, VISHAL"
- A different account on the same browser gets its own independent welcome state

#### Gap Fix 2d — Make the welcome state one-shot per user, and cover email sign-up too

The current plan has two gaps:

1. The 24-hour `created_at` fallback re-flags the same account as "new" on every fresh session during the first day, which conflicts with the intended "show it once, then Welcome Back" behavior.
2. Email registration already inserts `user_profiles` inside `AuthModal.jsx`, so `fetchProfile()` may never hit the "profile missing → create row" path that sets `fittrack_onboarding_pending`. That means first-time email users can still miss the "WELCOME" state entirely.

Use per-user keys instead of global keys and make the state explicit:

```js
const onboardingKey = `fittrack_onboarding_pending:${user.id}`;
const hasSeenWelcomeKey = `fittrack_has_seen_welcome:${user.id}`;
```

- Set `fittrack_onboarding_pending:${userId}` when a brand-new profile is created in `fetchProfile()`
- Also set the same key in `AuthModal.jsx` immediately after a successful first-time email `user_profiles` insert
- On the first Dashboard render for that user:
  - if `onboarding_pending` is `true` and `has_seen_welcome` is missing → show `"WELCOME,"`
  - then clear `onboarding_pending` and persist `has_seen_welcome = true`
- Never use a plain global `fittrack_onboarding_pending` key because it can bleed across accounts on the same browser

---

## Bug 3 — Diet Page Shows Wrong Phase Status When No Goal Is Set

### Symptom
A new user with no weight goal visits the Diet page. The Goal card shows **"MAINTAIN"** or shows calculated macro numbers as if a maintenance plan was configured — even though the user has set nothing. This is misleading and potentially harmful for a new user trying to understand the app.

### Root Cause

```js
// DietPage.jsx — current goal derivation
const goal = user.weightGoal
  ? user.weight > user.weightGoal ? 'loss' : 'gain'
  : 'maintenance';  // ← silent fallback, triggers the full macro pipeline
```

`'maintenance'` is a valid nutrition goal that generates real numbers. A new user with a null `user.weight` and null `user.weightGoal` gets a "maintenance" plan calculated on `null` inputs → `NaN` macros → broken rings displayed as if they're real data.

### Fix

**File:** `src/components/pages/DietPage.jsx`

#### Fix 3a — Add `'unset'` as a distinct goal state

```js
const goal = useMemo(() => {
  // 'unset' = user has not configured their goals yet
  // This is distinct from 'maintenance' (user deliberately chose same weight as goal)
  if (!user?.weightGoal) return 'unset';
  if (!user?.weight) return 'unset';  // can't determine direction without current weight
  if (user.weight === user.weightGoal) return 'maintenance';  // explicit maintenance choice
  return user.weight > user.weightGoal ? 'loss' : 'gain';
}, [user?.weight, user?.weightGoal]);
```

#### Fix 3b — Guard calculations behind `canCalculate`

```js
// Only run BMR/TDEE/macro calculations if the minimum required fields exist
const canCalculate = !!(user?.weight && user?.height && user?.age && user?.activity);

const bmr    = canCalculate ? calcBMR(user.weight, user.height, user.age, user.gender) : null;
const tdee   = canCalculate && bmr ? calcTDEE(bmr, user.activity) : null;
const goalKcal = tdee && goal !== 'unset' ? calcDeficit(tdee, goal) : null;
const prot   = goalKcal ? /* existing protein formula */ : null;
const carbs  = goalKcal ? /* existing carbs formula */  : null;
const fat    = goalKcal ? /* existing fat formula */    : null;
```

#### Fix 3c — Render the "set your goal" card when `goal === 'unset'`

Replace the Goal card JSX with a conditional:

```jsx
{goal === 'unset' || !canCalculate ? (
  /* ─── UNSET / INCOMPLETE PROFILE STATE ──────── */
  <div className="glass-card" style={{
    padding: 28, borderRadius: 20, textAlign: 'center',
    border: 'none', marginBottom: 20,
  }}>
    <div style={{
      width: 56, height: 56, borderRadius: 16,
      margin: '0 auto 16px',
      background: 'var(--surface-container-highest)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <Target size={24} color="var(--primary)" />
    </div>

    <div style={{
      fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700,
      fontSize: 16, color: 'var(--on-surface)', marginBottom: 8,
    }}>
      {!canCalculate
        ? 'Complete your profile first'
        : 'Set your weight goal'}
    </div>

    <div style={{
      fontSize: 12, color: 'var(--on-surface-variant)', lineHeight: 1.6,
      maxWidth: 280, margin: '0 auto 20px',
    }}>
      {!canCalculate
        ? 'Add your weight, height, and age in Profile — then your personalised calorie target and macro split will appear here.'
        : 'Set a weight goal from the Dashboard to unlock your personalised calorie target, macro split, and daily meal blueprint.'}
    </div>

    <button
      className="btn-p"
      style={{ padding: '12px 24px', fontSize: 13, borderRadius: 14 }}
      onClick={() => navigate(!canCalculate ? '/profile' : '/')}
    >
      {!canCalculate ? 'Go to Profile →' : 'Set Goal on Dashboard →'}
    </button>
  </div>
) : (
  /* ─── EXISTING GOAL CARD WITH MACRO RINGS ───── */
  // ... existing Goal card JSX unchanged ...
)}
```

#### Fix 3d — Meal Guide tab when unset

In the Meal Guide tab, show a simple prompt instead of meal cards:

```jsx
{activeTab === 'guide' && (goal === 'unset' || !canCalculate) && (
  <div style={{ padding: '32px 0', textAlign: 'center' }}>
    <div style={{ fontSize: 13, color: 'var(--on-surface-variant)', lineHeight: 1.6 }}>
      Your personalised meal blueprint will appear here once your profile is complete and a weight goal is set.
    </div>
  </div>
)}
```

The Daily Tracker tab should remain fully usable regardless (users can log food without a goal).

#### Gap Fix 3e — Guard every other `goalKcal` / `protTarget` consumer, not just the Goal card

Right now the broken derived values also leak into other Diet UI surfaces:

- `PageHeader` subtitle: `Target: ${goalKcal} kcal`
- Tracker slot targets: `slotCals = Math.round(goalKcal * slot.targetPct)`
- Protein shortfall banner: `protTarget - todayTotals.protein`
- Meal Guide blueprint copy and whey recommendation cards

So the fix needs a single shared guard such as:

```js
const hasBodyMetrics = Number.isFinite(user?.weight) && Number.isFinite(user?.height) && Number.isFinite(user?.age);
const hasGoal = Number.isFinite(user?.weightGoal);
const hasNutritionTargets = hasBodyMetrics && hasGoal && Number.isFinite(goalKcal) && Number.isFinite(protTarget);
```

Then:

- `PageHeader` should show helper copy instead of `Target: NaN kcal`
- Tracker cards should omit meal target calories when `!hasNutritionTargets`
- Protein shortfall nudges should not render when `!hasNutritionTargets`
- Meal Guide should fully short-circuit to the empty/setup state before blueprint/whey cards try to render

---

## Bug 4 — Stats Strip Shows "nullkg", "nullcm", Wrong TDEE

### Symptom
A new user who has not entered weight and height sees **"nullkg"**, **"nullcm"** in the 5-chip stats strip at the top of the Diet page. BMI shows `NaN`. TDEE shows a broken number or `NaN`.

### Root Cause
String interpolation on null values:
```jsx
{ label: 'Weight', value: `${user.weight} kg` }   // → "null kg"
{ label: 'Height', value: `${user.height} cm` }   // → "null cm"
```
`calcBMR(null, null, null, 'male')` returns `NaN`. Displaying `NaN kcal` as TDEE is confusing.

The same issue exists on the Dashboard's Weight Snapshot card and Metabolic Index (BMI ring).

### Fix

**Files:** `src/components/pages/DietPage.jsx`, `src/components/pages/DashboardPage.jsx`

#### Fix 4a — `safeVal` helper in `DietPage.jsx`

Add this near the top of the component (after state declarations):

```js
// Returns '—' for null, undefined, or NaN values; otherwise returns the value + optional unit
const safeVal = (value, unit = '') => {
  if (value === null || value === undefined) return '—';
  if (typeof value === 'number' && isNaN(value)) return '—';
  return unit ? `${value}${unit}` : String(value);
};
```

#### Fix 4b — Apply to stats strip

```js
const stats = [
  {
    label: 'Weight',
    Icon: Scale,
    value: user?.weight
      ? safeVal(
          isImpWeight ? kgToLbs(user.weight) : user.weight,
          isImpWeight ? ' lbs' : ' kg'
        )
      : '—',
  },
  {
    label: 'Height',
    Icon: Ruler,
    value: user?.height
      ? (isImpHeight ? cmToFtIn(user.height) : `${user.height} cm`)
      : '—',
  },
  {
    label: 'BMI',
    Icon: BarChart2,
    value: (user?.weight && user?.height)
      ? calcBMI(user.weight, user.height).toFixed(1)
      : '—',
  },
  {
    label: 'TDEE',
    Icon: Zap,
    value: tdee ? `${Math.round(tdee)} kcal` : '—',
  },
  {
    label: 'Activity',
    Icon: Activity,
    value: user?.activity
      ? ACTIVITY[user.activity]?.label || user.activity
      : '—',
  },
];
```

#### Fix 4c — Dashboard: Weight Snapshot card null guard

In `DashboardPage.jsx`, the central weight display:

```jsx
// Before:
{isImpWeight ? kgToLbs(latestWeight) : latestWeight}

// After:
{latestWeight
  ? (isImpWeight ? kgToLbs(latestWeight) : latestWeight)
  : '—'
}
```

And the unit label next to it:
```jsx
// Only show unit if there's a value:
{latestWeight && <span style={{ fontSize: 14, color: 'var(--on-surface-variant)' }}>
  {isImpWeight ? 'lbs' : 'kg'}
</span>}
```

#### Fix 4d — Dashboard: BMI ring guard

Only render the concentric ring and category grid when BMI is a valid number:

```jsx
{bmi && !isNaN(bmi) ? (
  <>
    {/* concentric ring + bmi value + category grid */}
  </>
) : (
  <div style={{
    fontSize: 12, color: 'var(--on-surface-dim)',
    textAlign: 'center', padding: '24px 16px',
  }}>
    Add weight & height in Profile to see BMI
  </div>
)}
```

#### Fix 4e — Profile completion nudge on Diet page

A small contextual prompt helps new users understand why the page looks incomplete:

```jsx
{/* Render at the top of DietPage, below PageHeader */}
{(!user?.weight || !user?.height) && (
  <div style={{
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '10px 14px', borderRadius: 12, marginBottom: 16,
    background: 'rgba(255,181,155,0.1)',
    borderLeft: '3px solid var(--primary)',
  }}>
    <span style={{ fontSize: 12, color: 'var(--on-surface-variant)' }}>
      Complete your profile to unlock personalised nutrition targets
    </span>
    <button
      onClick={() => navigate('/profile')}
      style={{
        background: 'none', border: 'none', cursor: 'pointer',
        fontSize: 12, fontWeight: 700, color: 'var(--primary)',
        flexShrink: 0, marginLeft: 12,
      }}
    >
      Complete →
    </button>
  </div>
)}
```

#### Gap Fix 4f — Fix the `activity` / `activityLevel` mismatch at the source

The current codebase stores the profile field as `profile.activity` in `AppContext.jsx`, but the consuming pages still read `user.activityLevel`:

- `src/components/pages/DashboardPage.jsx`
- `src/components/pages/DietPage.jsx`
- `src/components/pages/ProfilePage.jsx`

Without fixing that mapping, TDEE stays wrong even for fully configured users because all three pages silently fall back to `'moderate'`.

Two acceptable implementation paths:

```js
// Option A — compatibility alias in AppContext user shape
activity: profile.activity,
activityLevel: profile.activity,
```

or

```js
// Option B — update every consumer to use user.activity consistently
const tdee = calcTDEE(bmr, user.activity || 'moderate');
```

Option A is safer for this bug-fix pass because it prevents missing a stray consumer.

---

## Bug 5 — New User Inherits Another User's Workout History

### Symptom
User B (`b@gmail.com`, name: "Vishal") signs into the app on a device previously used by User A (`a@gmail.com`, name: "Vishal"). Despite completely different emails and different Supabase UUIDs, User B immediately sees User A's entire workout history, Iron League XP, and food logs.

### Root Cause Analysis

**The contamination chain:**

**GAP-FIX — the live code path is currently broader than the original migration analysis.**

The current `AppContext.jsx` does **not** run `getOldUserId()` / `migrateLocalData()` on login today. Instead, `fetchProfile()` immediately calls `uploadLocalDataToCloud(userId)`, and that helper currently treats any row owned by `userId`, `'vishal'`, or `'demo'` as uploadable to the current account. So Bug 5 is not just an old-ID/email-matching problem anymore; it is also a Phase Auth-2 upload contamination problem.

**Step 1 — User A uses the old localStorage auth system (pre-migration).**
`fittrack_users = [{ id: 'old-rand-A', email: 'a@gmail.com', name: 'Vishal', ... }]`
All workout logs stored with `userId: 'old-rand-A'`.

**Step 2 — If a legacy migration flow runs without email gating, User A's old ID is re-keyed into Supabase Auth.**
`migrateLocalData('supabase-uuid-A', 'old-rand-A')` re-keys all logs to `'supabase-uuid-A'`.
`cleanupOldAuthStorage()` removes `fittrack_users` and `fittrack_uid`. ✓

**Step 3 — BUT `cleanupOldAuthStorage()` may not have run.**
If the migration ran but cleanup was skipped (network error, exception before `finally`, or the code path didn't reach it), `fittrack_users` is still in localStorage.

**Step 4 — User B signs in on the same device.**
A naive old-ID lookup returns `'old-rand-A'` (User A's stale local ID).
`migrateLocalData('supabase-uuid-B', 'old-rand-A')` re-keys ALL of User A's data to User B's UUID.
User B now has User A's entire history. ⛔

**The core flaw:** any stale local old-user lookup without an email check can return the previous account's ID. Any user logging into any account on this device can then trigger migration of User A's data.

**Secondary issue — in-memory state bleed:**
Even without the migration problem, if the app doesn't reset in-memory state on account switch (User A was logged in, User B logs in within the same browser session without a page reload), React's AppContext state still holds User A's `workoutLogs` in memory until the component re-renders. The `filter(l => l.userId === user.id)` picks up the new user.id, but if state was never cleared the old logs may briefly render.

**Tertiary issue — hardcoded demo fallbacks still render foreign data:**
Several pages and helpers still query with patterns like:

```js
filter(l => l.userId === user.id || l.userId === 'vishal')
```

That means even after auth is working, any stale or demo-tagged rows can still appear inside another user's experience. This affects the Dashboard, Workout page, Progress page, Workout History, Weight Log, Profile-derived stats, Muscle Map helpers, and `getStreak()`.

### Fix

**Files:** `src/utils/authMigration.js`, `src/context/AppContext.jsx`

#### Fix 5a — Email-gated migration in `authMigration.js`

**Replace `getOldUserId` with an email-aware version:**

```js
// src/utils/authMigration.js

/**
 * Returns { shouldMigrate: true, oldUid } ONLY if the old localStorage user's email
 * matches the currently authenticated Supabase user's email.
 *
 * This is the critical guard that prevents User B's account from inheriting
 * User A's localStorage data just because they're on the same device.
 *
 * @param {string} currentEmail - email of the currently authenticated Supabase user
 * @returns {{ shouldMigrate: boolean, oldUid: string | null }}
 */
export const getOldUserIdIfEmailMatches = (currentEmail) => {
  if (!currentEmail) return { shouldMigrate: false, oldUid: null };

  const raw = localStorage.getItem('fittrack_users');
  if (!raw) return { shouldMigrate: false, oldUid: null };

  try {
    const users = JSON.parse(raw);
    const oldUser = users?.[0];
    if (!oldUser?.id) return { shouldMigrate: false, oldUid: null };

    // Only migrate if the email matches (case-insensitive comparison)
    if (oldUser.email?.toLowerCase() === currentEmail.toLowerCase()) {
      return { shouldMigrate: true, oldUid: oldUser.id };
    }

    // Emails don't match — different user on the same device. Do not migrate.
    return { shouldMigrate: false, oldUid: null };
  } catch {
    return { shouldMigrate: false, oldUid: null };
  }
};

/**
 * Re-keys all localStorage data entries from oldUid to newUid.
 * Only call this after confirming email match via getOldUserIdIfEmailMatches.
 */
export const migrateLocalData = (newUid, oldUid) => {
  if (!newUid || !oldUid || newUid === oldUid) return;

  const DATA_KEYS = [
    'fittrack_workoutLogs',
    'fittrack_healthLogs',
    'fittrack_measurements',
    'fittrack_foodLog',
    'fittrack_caloriesLog',
    'fittrack_readinessLog',
    'fittrack_waterLog',
    'fittrack_cardioLog',
    'fittrack_supplementLog',
    'fittrack_monthlyRankHistory',
    'fittrack_splits',
  ];

  DATA_KEYS.forEach(key => {
    const raw = localStorage.getItem(key);
    if (!raw) return;
    try {
      const data = JSON.parse(raw);
      if (!Array.isArray(data)) return;
      const migrated = data.map(entry =>
        entry.userId === oldUid ? { ...entry, userId: newUid } : entry
      );
      localStorage.setItem(key, JSON.stringify(migrated));
    } catch (e) {
      console.warn(`[Migration] Failed to migrate ${key}:`, e);
    }
  });

  console.log(`[Auth] Migrated localStorage data from ${oldUid} → ${newUid}`);
};

/**
 * ALWAYS call this after any successful Supabase login — whether or not migration ran.
 * Removes fittrack_users and fittrack_uid so they can never contaminate
 * a future login by a different user on the same device.
 */
export const cleanupOldAuthStorage = () => {
  localStorage.removeItem('fittrack_users');
  localStorage.removeItem('fittrack_uid');
};
```

#### Fix 5b — Force state reset on account switch in `AppContext.jsx`

When the authenticated user's Supabase ID changes (different person logging in within the same browser session), reset all fitness data state before the new user's data loads:

```js
// Add this ref at the top of AppContextProvider:
const prevUserIdRef = useRef(null);

// Add this useEffect inside AppContextProvider:
useEffect(() => {
  if (!user?.id) {
    prevUserIdRef.current = null;
    return;
  }

  if (prevUserIdRef.current && prevUserIdRef.current !== user.id) {
    // A different user has logged in on this device in this session.
    // Reset all in-memory fitness data to prevent the old user's state
    // from flashing on screen while the new user's data loads.
    console.log('[Auth] Account switched — resetting all local state');

    // Reset all state arrays to empty; useLocalStorage will re-read from
    // localStorage filtered by the new user.id on the next render cycle
    setWorkoutLogs([]);
    setHealthLogs([]);
    setMeasurements([]);
    setFoodLog([]);
    setCaloriesLog([]);
    setReadinessLog([]);
    // Note: remaining global preference keys are handled separately in Fix 5g
    // so this reset focuses on the user-scoped fitness datasets

    // Force a tick so React re-renders the cleared state before re-hydrating
    // The useLocalStorage hooks will re-read on the next effect cycle
  }

  prevUserIdRef.current = user.id;
}, [user?.id]);
```

#### Fix 5c — Always clean up in `fetchProfile` regardless of migration outcome

This is the key guarantee: old auth keys are removed on EVERY successful login, not just when migration runs. This is already in the Bug 1 fix (Fix 1b above), but calling it out explicitly here:

```js
// In fetchProfile(), in the finally block (guaranteed to run even if an error occurs):
finally {
  // ALWAYS remove old auth keys, whether or not migration ran
  // This prevents a future login by a different user from ever seeing
  // stale fittrack_users data
  cleanupOldAuthStorage();

  isFetchingProfile.current = false;
  setAuthLoading(false);
}
```

#### Fix 5d — Verify `INIT_USERS` cleanup in `sample.js`

Confirm that `sample.js` has had its `INIT_USERS` array removed (per TASK 9 of auth migration). The demo user should now be a real Supabase account (`demo@fittrackpro.in`), not a hardcoded object:

```js
// src/data/sample.js — expected state after migration
// INIT_USERS should be GONE or an empty array
// The file should only contain non-user data (exercise library, etc.) if anything

export const INIT_USERS = [];  // or remove the export entirely
```

If `INIT_USERS` still contains a hardcoded user with `password: 'admin123'`, any device loading the app would populate `fittrack_users` with that user's static data, which could then be picked up by `getOldUserIdIfEmailMatches` and cause confusion.

#### Fix 5e — Remove demo-user auto-claim from `uploadLocalDataToCloud()`

This is a missing step in the current plan, but it is critical because it exists in the live code today.

Current problematic filter:

```js
return parsed.filter(i => i.userId === userId || i.userId === 'vishal' || i.userId === 'demo');
```

That logic uploads demo/sample rows into whichever real account signs in first on that browser. The uploader must only claim rows that already belong to the authenticated Supabase user, or rows that were just explicitly migrated from a verified old local ID.

Preferred order:

1. Resolve email-gated legacy migration (`oldUid -> newUid`)
2. Cleanup old auth keys
3. Upload only rows whose `userId === newUid`
4. Load cloud data

If demo/sample data is still needed for development, it should be seeded explicitly behind a dev-only action, never piggybacked on user login.

#### Fix 5f — Remove hardcoded `'vishal'` / `'demo'` fallback filters from all user-scoped views

The isolation fix is incomplete unless all user-scoped queries stop merging foreign IDs into the current user's view.

Replace patterns like:

```js
filter(l => l.userId === user.id || l.userId === 'vishal')
```

with:

```js
filter(l => l.userId === user.id)
```

Audit at minimum:

- `src/context/AppContext.jsx` (`getStreak`)
- `src/components/pages/DashboardPage.jsx`
- `src/components/pages/WorkoutPage.jsx`
- `src/components/pages/ProgressPage.jsx`
- `src/components/pages/WorkoutHistoryPage.jsx`
- `src/components/pages/WeightLogPage.jsx`
- `src/components/pages/ProfilePage.jsx`
- `src/components/pages/MuscleMapPage.jsx`
- `src/data/muscleData.js`

#### Fix 5g — Reset or namespace remaining local-only user preferences on account switch

Even after workout/history sync is fixed, some browser-local values are still account-sensitive and currently not namespaced:

- `fittrack_favoriteFoods`
- `fittrack_supplementConfig`
- `fp_cycle_config`
- any other remaining global localStorage keys that represent personal state rather than app-wide preferences

For this bug-fix pass, either:

- namespace them per Supabase user ID, or
- clear them when `prevUserIdRef.current !== user.id`

Otherwise a second account on the same device can still inherit user-specific settings even if workout history is fixed.

---

## Codebase Audit — Confirmed Findings (2026-04-08)

> **Audited by:** Antigravity AI · **Method:** Static analysis (`grep_search` + manual file review)
> **Result:** All 8 bugs confirmed reproducible in the live codebase. No false positives.

### Bug 1 — CONFIRMED

`AppContext.jsx:49-66` — Both `getSession()` (L50) and `onAuthStateChange` (L56) independently call `fetchProfile()`. On OAuth redirect, both fire with a valid session in the same tick → double INSERT race condition.

- `fetchProfile()` (L68-102) calls `insert()` on L87-91 (not `upsert`) → second parallel call fails with unique-key conflict
- `uploadLocalDataToCloud(userId)` is called eagerly on L70 **before** any email-gating or migration check
- No `isFetchingProfile` guard exists
- No safety timeout exists

### Bug 2 — CONFIRMED

`AppContext.jsx:94` — Sets global `fittrack_onboarding_pending` (not per-user scoped)
`AuthModal.jsx:60-72` — Email registration inserts `user_profiles` but **never sets** `fittrack_onboarding_pending` → email sign-up users never get "WELCOME" greeting

### Bug 3 — CONFIRMED (code not audited inline, documented in bug description)

### Bug 4 — CONFIRMED

**`activityLevel` mismatch — 4 live locations reading a field that doesn't exist on the `user` object:**

| File | Line | Reads | But `user` has |
|------|------|-------|----------------|
| `DietPage.jsx` | L92 | `user.activityLevel` | `user.activity` |
| `DietPage.jsx` | L391 | `user.activityLevel` | `user.activity` |
| `DashboardPage.jsx` | L232 | `user.activityLevel` | `user.activity` |
| `ProfilePage.jsx` | L142 | `user.activityLevel` | `user.activity` |
| `ProfilePage.jsx` | L278 | `f.activityLevel` / `user.activityLevel` | `user.activity` |

All silently fall back to `'moderate'` via `|| 'moderate'`, so TDEE is wrong for any user who set a different activity level.

### Bug 5 — CONFIRMED

**`'vishal'` hardcoded fallback — 13 live locations across 8 files:**

| File | Lines | Pattern |
|------|-------|---------|
| `AppContext.jsx` | L233 | `l.userId === user.id \|\| l.userId === 'vishal'` |
| `DashboardPage.jsx` | L139, L170 | Same pattern |
| `WorkoutPage.jsx` | L327, L589 | Same pattern |
| `ProgressPage.jsx` | L22 | Same pattern |
| `WorkoutHistoryPage.jsx` | L40 | Same pattern |
| `WeightLogPage.jsx` | L17 | Same pattern |
| `ProfilePage.jsx` | L154, L157 | Same pattern |
| `MuscleMapPage.jsx` | L110, L161 | Same pattern + fallback `id: user?.id \|\| 'vishal'` |
| `muscleData.js` | L108, L148, L322 | Same pattern |
| `authMigration.js` | L89 | `userId === 'vishal' \|\| userId === 'demo'` in upload filter |

**`sample.js` status:** `INIT_USERS = []` ✅ (L32) — but `genSample()` still generates `userId: 'vishal'` data (L14, L21). `genSample` is imported and assigned to `SAMPLE` in `AppContext.jsx:13` but `SAMPLE` is **never referenced** elsewhere → dead code, but risk of re-introduction.

### Bug 6 — CONFIRMED

`ProfilePage.jsx:278` — Edit form uses `f.activityLevel` and sends it to `updateProfile()`.
`AppContext.jsx:130-138` — `updateProfile()` keyMap has `activity: 'activity'` but **no `activityLevel` key** → field silently dropped, never persisted to Supabase.

### Bug 7 — CONFIRMED

`AppContext.jsx:5,13` — `genSample` imported, `SAMPLE = genSample()` assigned. `SAMPLE` is never used anywhere in the component. Dead code generating `userId: 'vishal'` sample data on every app load.

### Bug 8 — CONFIRMED

`AuthModal.jsx:60-72` — On successful email registration, inserts `user_profiles` but does NOT set `fittrack_onboarding_pending`. Only the Google sign-up path in `AppContext.jsx:94` sets it → email users always get "WELCOME BACK" on first Dashboard visit.

---

## Implementation Plan

### Execution Order (dependency-aware)

> Bugs 5 → 1 → 6 → 7 → 8 → 4 → 3 → 2

**Phase A — Data Isolation & Auth Core (Bugs 5, 1, 6, 7)**
All changes to `AppContext.jsx` and `authMigration.js` should be batched to avoid merge conflicts. Bug 5 rewrites the login flow that Bug 1 also touches.

**Phase B — Null Guards & UX (Bugs 8, 4, 3, 2)**
Page-level fixes. Can be done in parallel across different files.

---

## Implementation Checklist

### Bug 5 — Data Isolation Failure ⛔ CRITICAL — FIX FIRST
- [ ] **authMigration.js** — Add `getOldUserIdIfEmailMatches(email)` (email-gated version of `getOldUserId`)
- [ ] **authMigration.js:89** — Remove `'vishal'` / `'demo'` auto-claim from `uploadLocalDataToCloud()` filter: change `i.userId === userId || i.userId === 'vishal' || i.userId === 'demo'` → `i.userId === userId`
- [ ] **AppContext.jsx** — Rewrite `fetchProfile()` login flow order to: email-gated migration → `cleanupOldAuthStorage()` → upload current-user-only rows → load cloud data
- [ ] **AppContext.jsx** — Move `cleanupOldAuthStorage()` into a `finally` block (guaranteed execution)
- [ ] **AppContext.jsx** — Add `prevUserIdRef` + state-reset `useEffect` for account switching
- [ ] **13 locations across 8 files** — Remove all `|| l.userId === 'vishal'` fallback filters:
  - [ ] `AppContext.jsx:233` — `getStreak()`
  - [ ] `DashboardPage.jsx:139` — `allUserLogs`
  - [ ] `DashboardPage.jsx:170` — `userWo`
  - [ ] `WorkoutPage.jsx:327` — previous session lookup
  - [ ] `WorkoutPage.jsx:589` — day card last session
  - [ ] `ProgressPage.jsx:22` — `ul` filter
  - [ ] `WorkoutHistoryPage.jsx:40` — history filter
  - [ ] `WeightLogPage.jsx:17` — weight log filter
  - [ ] `ProfilePage.jsx:154` — heavy hitter check
  - [ ] `ProfilePage.jsx:157` — monthly volume
  - [ ] `MuscleMapPage.jsx:110` — fallback id
  - [ ] `MuscleMapPage.jsx:161` — weekly filter
  - [ ] `muscleData.js:108,148,322` — XP calc + weekly muscles
- [ ] **Local prefs** — Namespace or clear `fittrack_favoriteFoods`, `fittrack_supplementConfig`, `fp_cycle_config` on account switch
- [ ] **sample.js:32** — Verify `INIT_USERS = []` ✅ Already done
- [ ] **Test:** Two accounts on same device — no data leakage
- [ ] **Test:** Stale `userId: 'vishal'` or `'demo'` rows — never appear for real users
- [ ] **Test:** Migration path with `fittrack_users` present — email gating works

### Bug 1 — Google Sign-In Requires 2 Attempts ⛔ CRITICAL
- [ ] **AppContext.jsx:49-66** — Remove `getSession()` call, use `onAuthStateChange` as sole source of truth (fires `INITIAL_SESSION` synchronously)
- [ ] **AppContext.jsx** — Add `useRef(false)` `isFetchingProfile` guard at top of component
- [ ] **AppContext.jsx:87-91** — Change `insert()` → `upsert({ onConflict: 'id' })` with retry-fetch fallback
- [ ] **AppContext.jsx:70** — Remove eager `uploadLocalDataToCloud(userId)` call (relocated per Bug 5 fix)
- [ ] **AppContext.jsx** — Add 3-second safety timeout if `onAuthStateChange` never fires
- [ ] **Test:** Fresh device, tap Google once → app opens without re-prompting

### Bug 6 — ProfilePage Activity Level Silently Dropped 🟡 HIGH
- [ ] **AppContext.jsx:130-138** — Add `activityLevel: 'activity'` to `updateProfile()` keyMap (maps `f.activityLevel` → Supabase `activity` column)
- [ ] **Test:** Edit activity level in Profile → save → reload → value persists

### Bug 7 — Dead `genSample()` Code 🟡 MEDIUM
- [ ] **AppContext.jsx:5** — Remove `import { genSample } from '../data/sample'`
- [ ] **AppContext.jsx:13** — Remove `const SAMPLE = genSample()`
- [ ] **Test:** App boots without errors after removal

### Bug 8 — Email Sign-Up Missing Onboarding Flag 🟡 MEDIUM
- [ ] **AuthModal.jsx** — After successful `user_profiles` insert (L61-71), add `localStorage.setItem('fittrack_onboarding_pending', 'true')` (or per-user key per Bug 2 fix)
- [ ] **Test:** Email registration → first Dashboard → shows "WELCOME," not "WELCOME BACK,"

### Bug 4 — Null Stats Strip 🟡 HIGH
- [ ] **DietPage.jsx** — Add `safeVal()` helper, apply to all 5 stats chips
- [ ] **AppContext.jsx:160-167** — Add `activityLevel: profile.activity` alias to the `user` object (Option A — compatibility alias, safest)
- [ ] **DashboardPage.jsx** — Null guard for BMI ring + Weight Snapshot card + Today's Nutrition
- [ ] **DietPage.jsx** — Profile completion nudge banner when `!user?.weight || !user?.height`
- [ ] **Test:** New user → all stats "—", no "null" or "NaN" anywhere

### Bug 3 — Diet Page Wrong Phase Status 🟡 HIGH
- [ ] **DietPage.jsx** — Add `'unset'` goal state in `useMemo` derivation
- [ ] **DietPage.jsx** — Add `canCalculate` guard before BMR/TDEE/deficit
- [ ] **DietPage.jsx** — Render "Set your goal" CTA card when unset/incomplete
- [ ] **DietPage.jsx** — Add `hasNutritionTargets` guard for PageHeader subtitle, slot targets, protein nudge, Meal Guide
- [ ] **Test:** New user → CTA card, no macro rings, no NaN

### Bug 2 — "Welcome Back" for New Users 🟢 MEDIUM
- [ ] **DashboardPage.jsx** — Add `isNewUser` computed value using per-user keys: `fittrack_onboarding_pending:${user.id}` and `fittrack_has_seen_welcome:${user.id}`
- [ ] **DashboardPage.jsx** — Update greeting: `isNewUser ? 'WELCOME,' : 'WELCOME BACK,'`
- [ ] **DashboardPage.jsx** — `useEffect` to consume onboarding flag + persist `has_seen_welcome` for that specific user
- [ ] **AppContext.jsx** — Change `fittrack_onboarding_pending` to per-user key: `fittrack_onboarding_pending:${userId}`
- [ ] **AuthModal.jsx** — Also set per-user onboarding key after email registration insert (requires knowing `data.user.id`)
- [ ] **Test:** Fresh sign-up → "WELCOME," once → "WELCOME BACK," after → independent per-account

---

## Priority Order

Fix in this order — each is a blocker for real users:

1. **Bug 5** (Data Isolation) — Critical trust/privacy issue; a coaching platform CANNOT leak client data
2. **Bug 1** (Google 2 Attempts) — Kills first-impression conversion; most Indian users prefer Google login
3. **Bug 6** (Activity Level) — Silent data loss on every profile edit; tiny fix, high impact
4. **Bug 7** (Dead sample code) — 2-line removal, eliminates contamination risk
5. **Bug 8** (Email onboarding flag) — 1-line fix, unblocks Bug 2
6. **Bug 4** (Null Stats) — Looks unfinished/broken to any new user who hasn't set their profile
7. **Bug 3** (Diet Phase Status) — New users see broken/misleading nutrition data immediately
8. **Bug 2** (Welcome vs Welcome Back) — UX polish; lower urgency but impacts first impression


## Open Questions

> [!IMPORTANT]
> 1. **Should `genSample()` and its import be deleted entirely?** It's dead code after the cloud migration but removing it is a one-way door. - ANSWER = NO
> 2. **Should I include the ProfilePage activity edit fix (Issue 6)?** It's directly related to Bug 4 (wrong TDEE) but wasn't explicitly in the TODO. - ANSWER = YES
> 3. **Namespace or clear local-only preferences on account switch?** The TODO suggests either namespacing `fittrack_favoriteFoods`, `fittrack_supplementConfig`, `fp_cycle_config` per Supabase user ID, OR clearing them on account switch. Which approach do you prefer? - ANSWER = clear local-only preferences on account switch


## Indian Market Context

**On Bug 1 priority:** ~65% of Indian smartphone users prefer Google Sign-In over email/password for new app registrations (Google dominates Indian app ecosystem via Play Store integration). A 2-attempt login failure rate means ~65% of your acquisition funnel hits this bug first.

**On Bug 5 priority:** Many Indian gym coaches (like Vishal) use a single phone to demo apps to multiple clients. If Vishal shows the app to two different clients named "Rahul" on the same device, their data leaking into each other's accounts is a catastrophic trust failure that would kill coaching subscriptions.

**On Bug 3:** Indian fitness app users (25–35, urban, gym-going demographic) are increasingly macro-aware (influenced by YouTube coaches like Ranveer Allahbadia, Tarun Gill, Guru Mann). Showing fake/broken macro numbers is worse than showing nothing — it erodes trust in the entire nutrition feature.

---

## 3. Post-Auth Review: Final Bugs
> **Identified:** 2026-04-08

### Bug 9: Diet Page Null Stats Rendering
- **Root Cause:** `DietPage.jsx` renders stats inside a template literal (e.g. `${user.weight}kg`). When the user starts with no stats, it outputs "nullkg" instead of a blank state (`—`).
- **Proposed Fix:** Adjust lines ~390 in `DietPage.jsx` to map a safely validated `stats` array instead of hardcoded JSX output, replacing any `null`/`NaN` calculations (like `tdee`) with `'—'`.

### Bug 10: Strict Per-User Data Isolation Failing For Cross-Account Sign-ups
- **Root Cause:** A combination of previously unpatched `authMigration.js` loops uploading old development data into the first Auth UUID created on the machine, combined with AppContext not forcefully wiping auxiliary local storages (like `fittrack_cardioLog` and `waterLog`) on logout.
- **Proposed Fix:** 
  1. Expand the `AppContext.jsx` account switch listener to wipe `cardioLog`, `waterLog`, `supplementLog`, and `supplementConfig`.
  2. Acknowledge old test instances were contaminated prior to the Auth-1.2 fix. To clear this reliably for local devs, a manual `delete from workout_logs` in Supabase is required for the new conflicting emails, but code logic is now secure against uploading it under `uploadLocalDataToCloud`.

### Bug 11: Newly Registered Users 0XP Visibility
- **Root Cause:** `MuscleMapPage.jsx` renders a pre-baked `MOCK_LEADERBOARD` arrays combined with the local `meEntry`. It currently does not perform a global database fetch for `user_profiles` or `workout_logs` of other real players in the same app.
- **Proposed Fix:** Modify `MuscleMapPage.jsx` to fetch `user_profiles` globally (via a standalone Supabase select) and incorporate them dynamically into the Leaderboard with their corresponding XP (using their logs if available) or 0 XP initially.
