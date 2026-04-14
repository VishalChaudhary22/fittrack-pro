# FitTrack Pro — Auth Migration Plan
> **Created:** 2026-04-08
> **Priority:** 🔴 Critical (UX-11.1 — plain-text passwords in localStorage is a live security bug)
> **Effort:** Phase Auth-1 = 🟡 Medium (1–2 days) · Phase Auth-2 = 🔴 Large (3–5 days)
> **Prerequisite:** Supabase project already wired — `@supabase/supabase-js v2.101.1`, `.env` keys present, `src/lib/supabaseClient.js` exists

---

## 🎯 Goal

Transform FitTrack Pro from a browser-local toy (data lost on browser clear, password stored as plain text) into a real multi-device app where users register once, own their data permanently, and log in via Google or email from any device.

This is the foundational infrastructure change that unlocks:
- **Iron League real leaderboard** (Phase 3 Friends tab, real social graph)
- **Cross-device sync** — start a workout on phone, review history on laptop
- **Coaching clients** — Vishal can create accounts for clients, view their progress
- **PWA push notifications** — tied to a real user identity

---

## 🏗️ Architecture: Two-Phase Migration

### Phase Auth-1 — Hybrid (Supabase Auth + localStorage data)
**What changes:** Only `AuthModal.jsx`, `AppContext.jsx`, `App.jsx`, and `ProfilePage.jsx`.
**What stays the same:** All fitness data (workouts, food logs, weight entries, splits) stays in localStorage — just re-keyed to the Supabase UID instead of the random local ID.
**Result:** Real login, real Google Sign-In, no plain-text passwords. Users can switch devices but their fitness data is still device-local (acceptable interim state).

### Phase Auth-2 — Full Cloud Sync (Supabase as data backend)
**What changes:** `AppContext.jsx` becomes a thin layer over Supabase queries. All localStorage fitness data migrates to Supabase tables.
**Result:** True cross-device sync. Foundation for real-time features and social graph.

---

## ⚙️ One-Time Setup: Supabase Dashboard (10 min, done manually by Vishal)

### Step 1 — Enable Email Auth
- Supabase Dashboard → **Authentication → Providers → Email**
- Enable "Confirm email" — sends a verification link before allowing login ✅
- Enable "Secure email change" ✅

### Step 2 — Enable Google OAuth

**In Google Cloud Console:**
1. Go to [console.cloud.google.com](https://console.cloud.google.com) → Create project (or use existing)
2. APIs & Services → Credentials → **Create Credentials → OAuth 2.0 Client ID**
3. Application type: **Web application**
4. Name: `FitTrack Pro`
5. Authorized JavaScript origins: `https://fittrackbyvishal.vercel.app`
6. Authorized redirect URIs:
   ```
   https://<your-supabase-ref>.supabase.co/auth/v1/callback
   ```
   (find your ref in Supabase Dashboard → Settings → API → Reference ID)
7. Copy the **Client ID** and **Client Secret**

**In Supabase Dashboard:**
- Authentication → Providers → **Google** → Enable
- Paste Client ID and Client Secret
- Save

### Step 3 — Configure Redirect URLs
- Supabase Dashboard → **Authentication → URL Configuration**
- Site URL: `https://fittrackbyvishal.vercel.app`
- Redirect URLs (add all of these):
  ```
  https://fittrackbyvishal.vercel.app
  https://fittrackbyvishal.vercel.app/**
  http://localhost:5173
  http://localhost:5173/**
  ```

### Step 4 — Create `user_profiles` Table (SQL Migration)

Run this in Supabase Dashboard → SQL Editor:

```sql
-- user_profiles: extends Supabase auth.users with fitness-specific data
-- ⚠️ GAP-FIX: Added age, workout_days, weight_goal_start, is_admin, unit_weight,
--   unit_height, activity_level (renamed from activity for clarity) that exist
--   in the current user object shape in AppContext / AuthModal / ProfilePage.
create table public.user_profiles (
  id                uuid primary key references auth.users(id) on delete cascade,
  name              text not null,
  gender            text check (gender in ('male', 'female', 'other')) default 'male',
  age               integer,                   -- GAP-FIX: current form collects age, not dob
  dob               date,                      -- optional, for future use
  height            numeric(5,1),              -- cm
  weight            numeric(5,1),              -- kg
  weight_goal       numeric(5,1),              -- kg
  weight_goal_start numeric(5,1),              -- GAP-FIX: starting weight when goal was set
  goal_weeks        integer,
  goal_set_date     date,
  activity          text default 'moderate',
  workout_days      integer default 4,         -- GAP-FIX: days/week (collected in registration)
  diet_type         text default 'veg',
  units             text default 'metric',     -- 'metric' | 'imperial'
  unit_weight       text default 'kg',         -- GAP-FIX: 'kg' | 'lbs' (ProfilePage toggle)
  unit_height       text default 'cm',         -- GAP-FIX: 'cm' | 'ft' (ProfilePage toggle)
  avatar            text,                      -- 2-char initials fallback
  avatar_type       text default 'preset',
  avatar_url        text,
  active_split_id   text,
  is_admin          boolean default false,     -- GAP-FIX: admin flag for Vishal's account
  purchased_programs text[] default '{}',
  created_at        timestamptz default now(),
  updated_at        timestamptz default now()
);

-- Auto-update updated_at on any row change
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger user_profiles_updated_at
  before update on public.user_profiles
  for each row execute function update_updated_at();

-- RLS: users can only read/write their own profile
alter table public.user_profiles enable row level security;

create policy "Users can view own profile"
  on public.user_profiles for select
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.user_profiles for insert
  with check (auth.uid() = id);

create policy "Users can update own profile"
  on public.user_profiles for update
  using (auth.uid() = id);
```

---

## 📋 Phase Auth-1 — Implementation Tasks

### TASK 1 — Update `src/lib/supabaseClient.js`

The existing file likely just exports the client. Verify it exports correctly and add a helper for the current session:

```js
// src/lib/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

// Helper — get current session's user synchronously from cache
export const getCurrentUser = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.user ?? null;
};
```

---

### TASK 2 — Rewrite `AuthModal.jsx`

**File:** `src/components/pages/AuthModal.jsx`
**Scope:** Full rewrite of auth logic. Keep the existing design/UI tokens; replace all `users` array manipulation with Supabase Auth calls.

#### 2a — New State Shape

```js
// Keep existing state fields for the form, add:
const [loading, setLoading] = useState(false);
const [authError, setAuthError] = useState('');
const [mode, setMode] = useState('login'); // 'login' | 'register'
```

#### 2b — Register (Email + Password)

```js
const handleRegister = async () => {
  if (!f.name || !f.email || !f.password) {
    return setAuthError('All fields required');
  }
  if (f.password.length < 8) {
    return setAuthError('Password must be at least 8 characters');
  }
  setLoading(true);
  setAuthError('');

  const { data, error } = await supabase.auth.signUp({
    email: f.email,
    password: f.password,
    options: {
      data: {
        name: f.name,
        gender: f.gender || 'male',
      },
      emailRedirectTo: window.location.origin,
    },
  });

  if (error) {
    setAuthError(error.message);
    setLoading(false);
    return;
  }

  // Create user_profiles row immediately (don't wait for email verify)
  // ⚠️ GAP-FIX: Include ALL registration fields collected by the form.
  //   The original plan only sent name + gender — dropping weight, height,
  //   age, activityLevel, and workoutDays entirely.
  if (data.user) {
    await supabase.from('user_profiles').insert({
      id: data.user.id,
      name: f.name,
      gender: f.gender || 'male',
      age: parseInt(f.age) || null,
      height: parseFloat(f.height) || null,
      weight: parseFloat(f.weight) || null,
      activity: f.activityLevel || 'moderate',
      workout_days: parseInt(f.workoutDays) || 4,
      avatar: f.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
    });
  }

  // If email confirmation is enabled, show a "Check your email" message
  // If not, data.session will be populated and onAuthStateChange fires
  setLoading(false);
  if (!data.session) {
    // Email verification required — show confirmation message
    setMode('verify');
  }
};
```

#### 2c — Login (Email + Password)

```js
const handleLogin = async () => {
  if (!f.email || !f.password) return setAuthError('Email and password required');
  setLoading(true);
  setAuthError('');

  const { error } = await supabase.auth.signInWithPassword({
    email: f.email,
    password: f.password,
  });

  if (error) {
    // Map Supabase error messages to user-friendly text
    const msg = error.message.includes('Invalid login')
      ? 'Incorrect email or password'
      : error.message;
    setAuthError(msg);
  }
  // On success: onAuthStateChange in AppContext fires → modal closes automatically
  setLoading(false);
};
```

#### 2d — Google Sign-In

```js
const handleGoogleSignIn = async () => {
  setLoading(true);
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  });
  if (error) {
    setAuthError(error.message);
    setLoading(false);
  }
  // On success: browser redirects to Google → returns to app → onAuthStateChange fires
};
```

#### 2e — Demo Account (keep existing demo flow)

```js
const handleDemo = async () => {
  setLoading(true);
  const { error } = await supabase.auth.signInWithPassword({
    email: 'demo@fittrackpro.in',
    password: 'FitTrack2026!',
  });
  // Create this demo account once in Supabase Dashboard manually
  if (error) setAuthError('Demo account unavailable — try registering');
  setLoading(false);
};
```

#### 2f — JSX Structure (Updated)

```jsx
return (
  <div className="mo">
    <div className="md" style={{ maxWidth: 420, width: '100%', padding: '32px 28px' }}>

      {/* App wordmark */}
      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800,
          fontSize: 22, letterSpacing: '-0.04em', color: 'var(--primary)',
          textTransform: 'uppercase', marginBottom: 4 }}>
          FitTrack Pro
        </div>
        <div style={{ fontSize: 12, color: 'var(--on-surface-variant)' }}>
          {mode === 'login' ? 'Welcome back' : 'Create your account'}
        </div>
      </div>

      {/* ─── GOOGLE SIGN-IN (PRIMARY CTA) ─── */}
      <button
        onClick={handleGoogleSignIn}
        disabled={loading}
        style={{
          width: '100%', padding: '14px', borderRadius: 14, border: 'none',
          background: 'var(--surface-container-highest)', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 600, fontSize: 14,
          color: 'var(--on-surface)', marginBottom: 20,
          transition: 'background .2s',
        }}
      >
        {/* Google SVG icon */}
        <svg width="18" height="18" viewBox="0 0 48 48">
          <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.2l6.8-6.8C35.8 2.5 30.2 0 24 0 14.8 0 7 5.4 3.2 13.3l7.9 6.1C13 13.2 18.1 9.5 24 9.5z"/>
          <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4 6.9-10 6.9-17z"/>
          <path fill="#FBBC05" d="M11.1 28.6A14.9 14.9 0 0 1 9.5 24c0-1.6.3-3.1.7-4.6l-7.9-6.1A24 24 0 0 0 0 24c0 3.9.9 7.5 2.5 10.7l8.6-6.1z"/>
          <path fill="#34A853" d="M24 48c6.2 0 11.4-2 15.2-5.5l-7.5-5.8c-2 1.4-4.6 2.2-7.7 2.2-5.9 0-11-3.7-12.9-9.2l-8.6 6.1C7 42.6 14.8 48 24 48z"/>
        </svg>
        Continue with Google
      </button>

      {/* Divider */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <div style={{ flex: 1, height: 1, background: 'var(--surface-container-highest)' }} />
        <span style={{ fontSize: 11, color: 'var(--on-surface-dim)', fontWeight: 600 }}>
          OR
        </span>
        <div style={{ flex: 1, height: 1, background: 'var(--surface-container-highest)' }} />
      </div>

      {/* ─── EMAIL FORM ─── */}
      {mode === 'register' && (
        <input placeholder="Full Name" value={f.name}
          onChange={e => setF(p => ({ ...p, name: e.target.value }))}
          style={{ /* existing input styles */ }} />
      )}

      <input placeholder="Email address" type="email" value={f.email}
        onChange={e => setF(p => ({ ...p, email: e.target.value }))}
        style={{ /* existing input styles */ }} />

      <input placeholder="Password (min 8 characters)" type="password" value={f.password}
        onChange={e => setF(p => ({ ...p, password: e.target.value }))}
        style={{ /* existing input styles */ }} />

      {/* ⚠️ GAP-FIX: Keep all existing registration fields from current AuthModal.
          The original plan only had Gender — dropping age, weight, height,
          activity level, and workout days. These fields must be preserved
          since the app uses them for BMI, calorie targets, and split suggestions. */}
      {mode === 'register' && (<>
        {/* Gender selector */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          {['male', 'female', 'other'].map(g => (
            <button key={g} onClick={() => setF(p => ({ ...p, gender: g }))}
              style={{
                flex: 1, padding: '10px', borderRadius: 10, border: 'none',
                cursor: 'pointer',
                background: f.gender === g ? 'var(--primary-container)' : 'var(--surface-container-highest)',
                color: f.gender === g ? '#fff' : 'var(--on-surface-variant)',
                fontSize: 12, fontWeight: 700, textTransform: 'capitalize',
              }}>
              {g}
            </button>
          ))}
        </div>

        {/* Fitness fields — keep from existing AuthModal L74-85 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <input type="number" placeholder="Age" value={f.age}
            onChange={e => setF(p => ({ ...p, age: e.target.value }))} />
          <input type="number" placeholder="Weight (kg)" value={f.weight}
            onChange={e => setF(p => ({ ...p, weight: e.target.value }))} />
          <input type="number" placeholder="Height (cm)" value={f.height}
            onChange={e => setF(p => ({ ...p, height: e.target.value }))} />
          <select value={f.activityLevel} onChange={e => setF(p => ({ ...p, activityLevel: e.target.value }))}>
            {/* Map ACTIVITY entries from constants.js */}
          </select>
        </div>
        <select value={f.workoutDays} onChange={e => setF(p => ({ ...p, workoutDays: e.target.value }))}>
          {[1,2,3,4,5,6,7].map(d => <option key={d} value={d}>{d} days/week</option>)}
        </select>
      </>)}

      {/* Error message */}
      {authError && (
        <div style={{ fontSize: 12, color: 'var(--error)', marginBottom: 12,
          padding: '10px 14px', background: 'rgba(255,59,48,0.08)',
          borderRadius: 10 }}>
          {authError}
        </div>
      )}

      {/* Submit button */}
      <button
        className="btn-p"
        onClick={mode === 'login' ? handleLogin : handleRegister}
        disabled={loading}
        style={{ width: '100%', padding: '14px', fontSize: 15 }}
      >
        {loading ? 'Please wait…' : mode === 'login' ? 'Sign In' : 'Create Account'}
      </button>

      {/* Toggle mode */}
      <div style={{ textAlign: 'center', marginTop: 16, fontSize: 13,
        color: 'var(--on-surface-variant)' }}>
        {mode === 'login' ? (
          <>Don't have an account?{' '}
            <button onClick={() => { setMode('register'); setAuthError(''); }}
              style={{ background: 'none', border: 'none', color: 'var(--primary)',
                fontWeight: 700, cursor: 'pointer', fontSize: 13 }}>
              Sign Up
            </button>
          </>
        ) : (
          <>Already have an account?{' '}
            <button onClick={() => { setMode('login'); setAuthError(''); }}
              style={{ background: 'none', border: 'none', color: 'var(--primary)',
                fontWeight: 700, cursor: 'pointer', fontSize: 13 }}>
              Sign In
            </button>
          </>
        )}
      </div>

      {/* Demo account */}
      <div style={{ textAlign: 'center', marginTop: 12 }}>
        <button onClick={handleDemo} disabled={loading}
          style={{ background: 'none', border: 'none', cursor: 'pointer',
            fontSize: 12, color: 'var(--on-surface-dim)', textDecoration: 'underline' }}>
          ⚡ Try Demo Account
        </button>
      </div>

    </div>
  </div>
);
```

#### 2g — Email Verification Pending Screen

When `mode === 'verify'` (user registered but email not yet confirmed):

```jsx
{mode === 'verify' && (
  <div className="md" style={{ maxWidth: 420, padding: '40px 28px', textAlign: 'center' }}>
    <div style={{ fontSize: 48, marginBottom: 16 }}>📧</div>
    <div className="headline-md" style={{ marginBottom: 12 }}>Check your inbox</div>
    <div style={{ fontSize: 13, color: 'var(--on-surface-variant)', marginBottom: 24,
      lineHeight: 1.6 }}>
      We sent a verification link to <strong style={{ color: 'var(--primary)' }}>{f.email}</strong>.
      Click it to activate your account.
    </div>
    <button className="btn-g" style={{ width: '100%' }}
      onClick={() => setMode('login')}>
      Back to Sign In
    </button>
    <div style={{ marginTop: 12, fontSize: 12, color: 'var(--on-surface-dim)' }}>
      Didn't receive it? Check your spam folder, or{' '}
      <button onClick={handleRegister} style={{ background: 'none', border: 'none',
        color: 'var(--primary)', cursor: 'pointer', fontSize: 12 }}>
        resend email
      </button>
    </div>
  </div>
)}
```

---

### TASK 3 — Update `AppContext.jsx`

**File:** `src/context/AppContext.jsx`
**Scope:** Replace the `fittrack_users` / `fittrack_uid` localStorage pattern with `supabase.auth` as the identity source. Keep ALL other state (workoutLogs, foodLog, etc.) in localStorage but re-key to the Supabase UID.

#### 3a — New Auth Imports

```js
import { supabase } from '../lib/supabaseClient';
```

#### 3b — Replace User Identity State

**Remove:**
```js
const [users, setUsers] = useLocalStorage('fittrack_users', INIT_USERS);
const [uid, setUid] = useLocalStorage('fittrack_uid', null);
const user = users.find(u => u.id === uid) || null;
```

**Add:**
```js
// Supabase auth session — source of truth for identity
const [session, setSession] = useState(null);
const [profile, setProfile] = useState(null);
const [authLoading, setAuthLoading] = useState(true);

// The user object the rest of the app uses — shape unchanged
// Maps Supabase auth + profile → the same {id, name, gender, weight, ...} shape
// ⚠️ GAP-FIX: Added all missing fields that the app references:
//   age, workoutDays, isAdmin, joinDate, weightGoalStart, unitWeight, unitHeight
const user = profile ? {
  id: session?.user?.id,
  email: session?.user?.email,
  name: profile.name,
  gender: profile.gender,
  age: profile.age,                                    // GAP-FIX
  height: profile.height,
  weight: profile.weight,
  weightGoal: profile.weight_goal,
  weightGoalStart: profile.weight_goal_start,           // GAP-FIX
  goalWeeks: profile.goal_weeks,
  goalSetDate: profile.goal_set_date,
  activity: profile.activity,
  workoutDays: profile.workout_days,                    // GAP-FIX
  dietType: profile.diet_type,
  units: profile.units,
  unitWeight: profile.unit_weight || 'kg',              // GAP-FIX
  unitHeight: profile.unit_height || 'cm',              // GAP-FIX
  avatar: profile.avatar,
  avatarType: profile.avatar_type,
  avatarUrl: profile.avatar_url,
  activeSplitId: profile.active_split_id,
  isAdmin: profile.is_admin || false,                   // GAP-FIX
  purchasedPrograms: profile.purchased_programs || [],
  joinDate: profile.created_at?.split('T')[0],          // GAP-FIX: maps created_at → joinDate
} : null;
```

#### 3c — Auth State Listener (replace manual login/logout)

Add this inside the `AppContextProvider` component, near the top:

```js
useEffect(() => {
  // Fetch existing session on mount (handles page reload)
  supabase.auth.getSession().then(({ data: { session } }) => {
    setSession(session);
    if (session?.user) fetchProfile(session.user.id);
    else setAuthLoading(false);
  });

  // Listen to all auth changes (sign in, sign out, token refresh, OAuth redirect)
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    async (event, session) => {
      setSession(session);
      if (session?.user) {
        await fetchProfile(session.user.id);
      } else {
        setProfile(null);
        setAuthLoading(false);
      }
    }
  );

  return () => subscription.unsubscribe();
}, []);

const fetchProfile = async (userId) => {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error && error.code === 'PGRST116') {
    // Profile doesn't exist yet — create it from auth metadata
    // This handles first-time Google Sign-In (no prior register form)
    // ⚠️ GAP-FIX: Use getUser() directly instead of stale `session` closure.
    //   The outer `session` state may not be set yet when this runs from
    //   onAuthStateChange (React state update is async).
    const { data: { user: authUser } } = await supabase.auth.getUser();
    const meta = authUser?.user_metadata || {};
    const newProfile = {
      id: userId,
      name: meta.full_name || meta.name || authUser?.email?.split('@')[0] || 'User',
      gender: meta.gender || 'male',
      avatar: (meta.full_name || meta.name || 'U').slice(0, 2).toUpperCase(),
    };
    const { data: created } = await supabase
      .from('user_profiles')
      .insert(newProfile)
      .select()
      .single();
    setProfile(created);
  } else {
    setProfile(data);
  }
  setAuthLoading(false);
};
```

#### 3d — Update `login` and `logout` methods

**Remove** the old `login(email, password)` function that searches the `users` array.

**Replace with:**
```js
// login / logout are now just thin wrappers for components that still call these
// The actual auth happens in AuthModal via supabase.auth.signIn*
// These are kept for backward compatibility with any component that calls them directly

const logout = async () => {
  await supabase.auth.signOut();
  // onAuthStateChange fires → profile cleared → user = null → AuthModal shows
};

// Remove: login(), register(), setUsers() — no longer needed
```

#### 3e — Re-key localStorage Data to Supabase UID

All existing localStorage data filters by `userId`. The old userId was a random local ID. The new userId is the Supabase UUID. For existing users migrating from local accounts:

```js
// In AppContext, when user is resolved, ensure all data arrays are filtered by user.id
// This is already how it works — as long as uid === supabase user id, everything works
// The re-keying is automatic for new accounts

// For data migration (handled in TASK 6 — Migration Helper):
// We detect old format data and re-key it to the new Supabase UID on first login
```

#### 3f — Update `setActiveSplitId` and profile update methods

```js
const setActiveSplitId = async (splitId) => {
  if (!user) return;
  // Update Supabase profile
  await supabase.from('user_profiles')
    .update({ active_split_id: splitId })
    .eq('id', user.id);
  // Optimistic update local state
  setProfile(prev => ({ ...prev, active_split_id: splitId }));
};

// New: generic profile updater (used by ProfilePage save, DashboardPage goal,
// and any component that previously called setUsers())
// ⚠️ GAP-FIX: Added all missing fields: age, workoutDays, weightGoalStart,
//   goalSetDate, unitWeight, unitHeight, isAdmin, activeSplitId
const updateProfile = async (updates) => {
  if (!user) return;
  // Convert camelCase keys to snake_case for Supabase
  // Only include keys that are actually present in `updates` to avoid
  // overwriting fields with undefined
  const keyMap = {
    name: 'name', gender: 'gender', age: 'age',
    height: 'height', weight: 'weight',
    weightGoal: 'weight_goal', weightGoalStart: 'weight_goal_start',
    goalWeeks: 'goal_weeks', goalSetDate: 'goal_set_date',
    activity: 'activity', workoutDays: 'workout_days',
    dietType: 'diet_type', units: 'units',
    unitWeight: 'unit_weight', unitHeight: 'unit_height',
    avatar: 'avatar', avatarType: 'avatar_type', avatarUrl: 'avatar_url',
    activeSplitId: 'active_split_id', isAdmin: 'is_admin',
  };
  const snakeUpdates = {};
  for (const [camel, snake] of Object.entries(keyMap)) {
    if (updates[camel] !== undefined) snakeUpdates[snake] = updates[camel];
  }
  const { data, error } = await supabase.from('user_profiles')
    .update(snakeUpdates)
    .eq('id', user.id)
    .select()
    .single();
  if (!error) setProfile(data);
  return { error };
};
```

#### 3g — Update the Provider Value

```js
// Add to the context value object:
{
  // ... existing values ...
  user,           // same shape as before — unchanged consumer API
  authLoading,    // new — used in App.jsx to show loading screen on mount
  logout,         // updated — now calls supabase.auth.signOut()
  updateProfile,  // new — replaces setUsers() + save() in ProfilePage
  // Remove: users, setUsers, login (no longer exposed)
}
```

---

### TASK 4 — Update `App.jsx`

**File:** `src/App.jsx`
**Scope:** Replace the `!uid` auth gate with `!session` check. Handle the initial loading state while Supabase checks the existing session.

```jsx
// In AppInner (or wherever the auth gate lives):
const { user, authLoading } = useApp();

// Loading screen while Supabase checks existing session
if (authLoading) {
  return (
    <div style={{
      minHeight: '100dvh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: 'var(--surface)',
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800,
          fontSize: 28, letterSpacing: '-0.04em', color: 'var(--primary)',
          textTransform: 'uppercase', marginBottom: 16,
        }}>
          FitTrack Pro
        </div>
        {/* Use existing Skeleton/shimmer or a simple pulse */}
        <div style={{
          width: 48, height: 4, background: 'var(--signature-gradient)',
          borderRadius: 2, margin: '0 auto',
          animation: 'shimmer 1.5s ease-in-out infinite',
        }} />
      </div>
    </div>
  );
}

// Auth gate — show AuthModal if no user
if (!user) return <AuthModal />;

// Otherwise render the app normally
return (
  <>
    <Sidebar />
    <Routes>...</Routes>
    <BottomNav />
    <ThemeToggle />
  </>
);
```

---

### TASK 5 — Update `ProfilePage.jsx`

**File:** `src/components/pages/ProfilePage.jsx`
**Scope:** Replace `setUsers()` save pattern with `updateProfile()` from context.

```js
// Before (old):
const save = () => {
  setUsers(prev => prev.map(u => u.id === user.id ? { ...u, ...f } : u));
  setEd(false);
};

// After (new):
const save = async () => {
  const { error } = await updateProfile(f);
  if (error) {
    addToast('Failed to save profile', 'error');
  } else {
    addToast('Profile saved!', 'success');
    setEd(false);
  }
};
```

Also update the logout button:

```js
// Before:
onClick={() => { logout(); setConfirm(null); }}

// After (already calls supabase.auth.signOut() via the new logout fn):
onClick={async () => { await logout(); setConfirm(null); }}
```

---

### TASK 5b — Update `DashboardPage.jsx` (Goal Setting) [GAP-FIX]

**File:** `src/components/pages/DashboardPage.jsx`
**Scope:** Replace `setUsers()` calls for weight goal setting and clearing.

> ⚠️ **This was missing from the original plan.** `DashboardPage.jsx` also directly calls `setUsers` at two locations — these must migrate to `updateProfile()` just like ProfilePage.

```js
// Location 1 — Goal set (currently L259):
// Before:
setUsers(p => p.map(u => u.id === user.id ? {
  ...u, weightGoal: goalTarget, weightGoalStart: latestWeight,
  goalWeeks: goalWeeks, goalSetDate: tod()
} : u));

// After:
await updateProfile({
  weightGoal: goalTarget,
  weightGoalStart: latestWeight,
  goalWeeks: goalWeeks,
  goalSetDate: tod(),
});

// Location 2 — Goal clear (currently L864):
// Before:
setUsers(p => p.map(u => u.id === user.id ? {
  ...u, weightGoal: null, weightGoalStart: null, goalWeeks: null
} : u));

// After:
await updateProfile({ weightGoal: null, weightGoalStart: null, goalWeeks: null });
```

Also update the destructured context import from `setUsers` to `updateProfile`:
```js
// Before:
const { ..., setUsers, ... } = useApp();
// After:
const { ..., updateProfile, ... } = useApp();
```

---

### TASK 5c — Update `ProfilePage.jsx` Avatar & Unit Toggles [GAP-FIX]

**File:** `src/components/pages/ProfilePage.jsx`
**Scope:** Migrate the remaining `setUsers()` calls not covered in TASK 5.

> ⚠️ **This was missing from the original plan.** ProfilePage has 4 additional `setUsers()` call sites beyond the main `save()` function.

```js
// 1. Preset avatar selection (L40):
// Before:
setUsers(prev => prev.map(u => u.id === user.id ? { ...u, avatarUrl: url, avatarType: 'preset' } : u));
// After:
await updateProfile({ avatarUrl: url, avatarType: 'preset' });

// 2. Upload avatar (L59):
// Before:
setUsers(prev => prev.map(u => u.id === user.id ? { ...u, avatarUrl: dataUrl, avatarType: 'upload' } : u));
// After:
await updateProfile({ avatarUrl: dataUrl, avatarType: 'upload' });
// Note: For Auth-2, uploaded avatars should use Supabase Storage instead of
// inline base64 (avatar_url text field could be 200kb+). Acceptable for Auth-1.

// 3. Unit weight toggle (L112):
// Before:
setUsers(p => p.map(u => u.id === user.id ? { ...u, unitWeight: unitWeight === 'kg' ? 'lbs' : 'kg' } : u));
// After:
await updateProfile({ unitWeight: unitWeight === 'kg' ? 'lbs' : 'kg' });

// 4. Unit height toggle (L113):
// Before:
setUsers(p => p.map(u => u.id === user.id ? { ...u, unitHeight: unitHeight === 'cm' ? 'ft' : 'cm' } : u));
// After:
await updateProfile({ unitHeight: unitHeight === 'cm' ? 'ft' : 'cm' });
```

---

### TASK 6 — Data Migration Helper

**File:** `src/utils/authMigration.js` [NEW]

When an existing user (who has data in localStorage under the old random ID) signs in with Supabase for the first time, their localStorage data is keyed to the old random ID. This helper re-keys it to their Supabase UID.

```js
// src/utils/authMigration.js

const DATA_KEYS = [
  'fittrack_workoutLogs',
  'fittrack_healthLogs',
  'fittrack_measurements',
  'fittrack_foodLog',
  'fittrack_caloriesLog',
  'fittrack_readinessLog',
  'fittrack_monthlyRankHistory',
  'fittrack_favoriteFoods',
  'fittrack_splits',
];

/**
 * Called once after first Supabase login if old localStorage data exists.
 * Finds data entries with the old random userId and re-keys them to the
 * Supabase UUID so all existing data continues to work.
 *
 * @param {string} newUid - Supabase auth user ID
 * @param {string} oldUid - old localStorage user ID (from fittrack_users[0].id)
 */
export const migrateLocalData = (newUid, oldUid) => {
  if (!newUid || !oldUid || newUid === oldUid) return;

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
      console.warn(`Failed to migrate ${key}:`, e);
    }
  });

  // Also re-key the splits (stored differently — they're not per-userId but per-splitId)
  // Splits don't have userId, so they don't need migration

  console.log(`[Auth] Migrated localStorage data from ${oldUid} → ${newUid}`);
};

/**
 * Returns the old random userId if old localStorage data exists.
 * Returns null if no old data or already migrated.
 */
export const getOldUserId = () => {
  const raw = localStorage.getItem('fittrack_users');
  if (!raw) return null;
  try {
    const users = JSON.parse(raw);
    return users?.[0]?.id || null;
  } catch {
    return null;
  }
};

/**
 * Clean up old auth storage keys once migration is confirmed.
 * Call this AFTER successful migration.
 */
export const cleanupOldAuthStorage = () => {
  localStorage.removeItem('fittrack_users');
  localStorage.removeItem('fittrack_uid');
};
```

**Wire migration into AppContext `fetchProfile()`:**

```js
// Inside fetchProfile(), after profile is set:
import { migrateLocalData, getOldUserId, cleanupOldAuthStorage } from '../utils/authMigration';

// After profile is confirmed and set:
const oldUid = getOldUserId();
if (oldUid && oldUid !== userId) {
  migrateLocalData(userId, oldUid);
  cleanupOldAuthStorage();
  addToast('Your existing data has been linked to your account!', 'success');
}
```

---

### TASK 7 — Handle Google OAuth Redirect

Google Sign-In uses a redirect flow — the user leaves the app, authenticates with Google, and comes back to the app URL. Supabase handles the token exchange automatically, but the app needs to handle the return gracefully.

**File:** `App.jsx` or `main.jsx`

The `onAuthStateChange` listener in `AppContext` automatically handles the token on redirect return. However, you should ensure the app does not flash the `AuthModal` during the ~200ms before the session is restored. The `authLoading` state in TASK 4 handles this.

Also add to `vite.config.js` — no changes needed, Vercel's `vercel.json` rewrite rule already handles deep link redirects.

---

### TASK 8 — Forgot Password Flow

Supabase handles this entirely:

```js
// In AuthModal — add "Forgot Password?" link:
const handleForgotPassword = async () => {
  if (!f.email) return setAuthError('Enter your email first');
  const { error } = await supabase.auth.resetPasswordForEmail(f.email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });
  if (!error) setMode('forgot-sent');
  else setAuthError(error.message);
};
```

No backend code needed — Supabase sends the email and handles the token. A simple "Password Reset Sent" screen (like the verify screen in Task 2g) is all that's required.

---

### TASK 9 — Clean Up Legacy Auth Code [GAP-FIX]

**Scope:** Remove all traces of the old localStorage-based auth system.

> ⚠️ **This was missing from the original plan.** After migration, `INIT_USERS` with its plain-text `password: 'admin123'` remains in the codebase and gets loaded on every app mount.

**Changes:**

#### 9a — `src/data/sample.js`
- Remove the `INIT_USERS` export entirely (or replace with an empty array for backward compatibility during rollout)
- The demo user is now a real Supabase account — no need for a hardcoded user object

#### 9b — `src/context/AppContext.jsx`
- Remove: `import { INIT_USERS } from '../data/sample'`
- Remove: `const [users, setUsers] = useLocalStorage('fittrack_users', INIT_USERS)`
- Remove: `const [uid, setUid] = useLocalStorage('fittrack_uid', null)`
- Remove: `const login = useCallback((u) => { setUid(u.id); }, [setUid])`
- Remove from context value: `users, setUsers, uid, login` — these should not be exposed anymore
- Any component still importing `setUsers` will get a compile error → fix in Task 5/5b/5c

#### 9c — `src/components/pages/AuthModal.jsx`
- Remove: `import { ACTIVITY } from '../../data/constants'` (if no longer needed after form restructure)
- Remove: `import { gId, tod } from '../../utils/helpers'` (no longer generating local IDs)
- Remove: `const { users, setUsers, login } = useApp()` → no longer exists in context
- The entire file is rewritten in TASK 2 anyway — this is just a reminder to not import the old API

---

### TASK 10 — Add Onboarding Hook Point [GAP-FIX]

**Scope:** Establish the integration point for onboarding (UX-17.1) after Auth-1.

> This is **not** a full onboarding implementation — just the hook that makes it trivial to add later.

In `fetchProfile()`, after a new profile is created via Google Sign-In (the `PGRST116` branch), set a flag:

```js
// In AppContext fetchProfile(), after creating a new profile:
if (created) {
  setProfile(created);
  // Signal to the app that this is a brand-new user → show onboarding
  localStorage.setItem('fittrack_onboarding_pending', 'true');
}
```

The `OnboardingPage` (UX-17.1, tracked in `TODO-UX-12-gamification-indian-market.md`) will read this flag and guide new users through:
1. Pick your split
2. Log your current weight
3. Set your goal

This keeps Auth-1 scope clean while ensuring onboarding is a trivial follow-up.

---

## ✅ Phase Auth-1 Checklist

### Supabase Dashboard (Manual by Vishal)
- [ ] Enable Email Auth + "Confirm email" toggle
- [ ] Set up Google OAuth (Google Cloud Console → Supabase Dashboard)
- [ ] Configure Redirect URLs (Vercel domain + localhost)
- [ ] Run `user_profiles` SQL migration in Supabase SQL Editor
- [ ] Create demo account: `demo@fittrackpro.in` / `FitTrack2026!` with a profile row

### Code Changes
- [ ] **TASK 1** — Verify `src/lib/supabaseClient.js` exports correctly
- [ ] **TASK 2** — Rewrite `AuthModal.jsx` — Google button, email/password, new error handling
- [ ] **TASK 3** — Update `AppContext.jsx` — auth listener, profile fetching, re-keyed user object
- [ ] **TASK 4** — Update `App.jsx` — authLoading screen + updated auth gate
- [ ] **TASK 5** — Update `ProfilePage.jsx` — `updateProfile()` instead of `setUsers()` (main save)
- [ ] **TASK 5b** — Update `DashboardPage.jsx` — goal set/clear calls migrate to `updateProfile()` *(GAP-FIX)*
- [ ] **TASK 5c** — Update `ProfilePage.jsx` — avatar selection, avatar upload, unit toggles *(GAP-FIX)*
- [ ] **TASK 6** — Create `src/utils/authMigration.js` + wire into `fetchProfile()`
- [ ] **TASK 7** — Verify Google OAuth redirect handling works end-to-end
- [ ] **TASK 8** — Add Forgot Password link in AuthModal
- [ ] **TASK 9** — Remove `INIT_USERS`, `fittrack_users`, `fittrack_uid`, old `login()` *(GAP-FIX)*
- [ ] **TASK 10** — Add onboarding hook point in `fetchProfile()` for new users *(GAP-FIX)*

### QA
- [ ] Register with email → verify email confirmation works
- [ ] Register with email → all fitness fields (weight, height, age, activity) saved to `user_profiles`
- [ ] Login with email + password → app loads with correct user data
- [ ] Google Sign-In → redirects to Google, returns, app loads correctly
- [ ] Google Sign-In (new user) → profile auto-created from Google metadata
- [ ] Demo account → single tap loads demo data
- [ ] Logout → auth modal shows, all data cleared from view
- [ ] Reload page → existing session restored (no re-login required)
- [ ] Mobile browser → entire flow works without desktop-only quirks
- [ ] Old user with localStorage data → migration runs, data preserved under new UID
- [ ] Forgot Password → email received, reset works
- [ ] `ProfilePage` save → persists to Supabase `user_profiles`, survives page reload
- [ ] `ProfilePage` avatar preset/upload → updates `user_profiles`, persists on reload *(GAP-FIX)*
- [ ] `ProfilePage` unit toggles → updates `user_profiles`, persists on reload *(GAP-FIX)*
- [ ] `DashboardPage` set weight goal → updates `user_profiles`, persists on reload *(GAP-FIX)*
- [ ] `DashboardPage` clear weight goal → updates `user_profiles`, persists on reload *(GAP-FIX)*
- [ ] No reference to `INIT_USERS` or `fittrack_users` localStorage key in codebase *(GAP-FIX)*

---

## 📋 Phase Auth-2 — Full Cloud Sync (Supabase Data Backend)

> **When to do this:** After Phase Auth-1 ships and is stable (~2 weeks of real usage). This is already on the roadmap in `State.md` as "planned for permanent data storage."

### New Tables Required

```sql
-- workout_logs: replaces fittrack_workoutLogs
create table public.workout_logs (
  id              text primary key,
  user_id         uuid not null references auth.users(id) on delete cascade,
  split_id        text,
  day_id          text,
  day_name        text,
  date            date not null,
  notes           text,
  duration_minutes integer,
  exercises       jsonb not null default '[]',
  created_at      timestamptz default now()
);

-- health_logs: replaces fittrack_healthLogs (weight log)
create table public.health_logs (
  id        text primary key,
  user_id   uuid not null references auth.users(id) on delete cascade,
  date      date not null,
  weight    numeric(5,1),
  notes     text,
  created_at timestamptz default now()
);

-- food_logs: replaces fittrack_foodLog
create table public.food_logs (
  id             text primary key,
  user_id        uuid not null references auth.users(id) on delete cascade,
  date           date not null,
  meal_type      text,
  food_id        text,
  food_name      text,
  serving_id     text,
  serving_label  text,
  grams          numeric(7,2),
  quantity       numeric(5,2),
  calories       numeric(7,1),
  protein        numeric(6,1),
  carbs          numeric(6,1),
  fat            numeric(6,1),
  fiber          numeric(6,1),
  source_type    text default 'database',
  created_at     timestamptz default now()
);

-- measurements: replaces fittrack_measurements
create table public.measurements (
  id          text primary key,
  user_id     uuid not null references auth.users(id) on delete cascade,
  date        date not null,
  chest       numeric(5,1),
  waist       numeric(5,1),
  hips        numeric(5,1),
  bicep       numeric(5,1),
  thigh       numeric(5,1),
  neck        numeric(5,1),
  created_at  timestamptz default now()
);

-- user_splits: replaces fittrack_splits (user's custom splits)
create table public.user_splits (
  id        text primary key,
  user_id   uuid not null references auth.users(id) on delete cascade,
  data      jsonb not null,  -- full split object stored as JSON
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- readiness_logs: replaces fittrack_readinessLog
create table public.readiness_logs (
  id                 text primary key,
  user_id            uuid not null references auth.users(id) on delete cascade,
  date               date not null,
  sleep_hours        numeric(3,1),
  energy_level       integer,
  soreness_level     integer,
  stress_level       integer,
  score              integer,
  objective_score    integer,
  check_in_complete  boolean default false,
  created_at         timestamptz default now()
);

-- RLS: users can only access their own data (apply to all tables above)
-- Template — repeat for each table:
alter table public.workout_logs enable row level security;
create policy "workout_logs: own data only"
  on public.workout_logs for all
  using (auth.uid() = user_id);
-- (repeat for health_logs, food_logs, measurements, user_splits, readiness_logs)
```

### Migration Strategy for Phase Auth-2

When Phase Auth-2 ships, existing localStorage data needs to be uploaded to Supabase once. The approach:

1. On first load after Phase Auth-2 deploy, check `localStorage` for each data key
2. If data exists, batch-insert it into the corresponding Supabase table
3. After successful upload, clear localStorage key
4. Show a toast: "Your data has been synced to the cloud ✓"

This "lazy migration" means users automatically migrate on their next login — no admin intervention needed.

### AppContext Changes for Phase Auth-2

Each `useLocalStorage` state is replaced by a `useQuery`-style hook that fetches from Supabase and maintains a local cache:

```js
// Pattern for each data type:
const [workoutLogs, setWorkoutLogs] = useState([]);

useEffect(() => {
  if (!user) return;
  // Initial fetch
  supabase.from('workout_logs')
    .select('*')
    .eq('user_id', user.id)
    .order('date', { ascending: false })
    .then(({ data }) => setWorkoutLogs(data || []));

  // Real-time subscription for cross-device sync
  const channel = supabase.channel(`workout_logs:${user.id}`)
    .on('postgres_changes', {
      event: '*', schema: 'public', table: 'workout_logs',
      filter: `user_id=eq.${user.id}`,
    }, payload => {
      if (payload.eventType === 'INSERT')
        setWorkoutLogs(prev => [payload.new, ...prev]);
      if (payload.eventType === 'DELETE')
        setWorkoutLogs(prev => prev.filter(l => l.id !== payload.old.id));
    })
    .subscribe();

  return () => supabase.removeChannel(channel);
}, [user?.id]);
```

---

## 🔒 Security Notes

| Risk | Mitigation |
|------|-----------|
| Plain-text passwords (current) | Eliminated in Phase Auth-1 — Supabase hashes with bcrypt |
| localStorage data accessible in browser DevTools | Acceptable for fitness data (not financial/medical PII). Phase Auth-2 moves it server-side |
| Google OAuth token leakage | Supabase handles PKCE flow — tokens never touch your app server |
| Unauthorized data access | RLS on all Supabase tables ensures `auth.uid() = user_id` on every query |
| Demo account abuse | Rate-limit the demo email in Supabase Auth settings (5 logins/hour) |

---

## 📦 File Change Summary

### Phase Auth-1

| File | Change |
|------|--------|
| `src/lib/supabaseClient.js` | Add `getCurrentUser` helper |
| `src/components/pages/AuthModal.jsx` | Full rewrite — Supabase Auth calls + Google button + all fitness fields |
| `src/context/AppContext.jsx` | Replace localStorage identity with Supabase session + profile |
| `src/App.jsx` | Add `authLoading` screen + updated auth gate |
| `src/components/pages/ProfilePage.jsx` | Use `updateProfile()` for save, avatar, unit toggles |
| `src/components/pages/DashboardPage.jsx` | *(GAP-FIX)* Migrate goal set/clear `setUsers()` → `updateProfile()` |
| `src/utils/authMigration.js` | **[NEW]** Re-key existing localStorage data to Supabase UID |
| `src/data/sample.js` | *(GAP-FIX)* Remove/deprecate `INIT_USERS` with plain-text password |

### Phase Auth-2

| File | Change |
|------|--------|
| `src/context/AppContext.jsx` | Replace all `useLocalStorage` fitness data with Supabase queries + real-time subscriptions |
| `supabase/migrations/` | 6 new migration SQL files (one per data table) |
| `src/utils/authMigration.js` | Extend with localStorage → Supabase upload function |

---

## 🇮🇳 Indian Market Notes

- **Google Sign-In is mandatory for Indian users** — ~65% prefer it over email/password. A fitness app without Google login feels untrustworthy to the demographic.
- **Phone OTP (Phase Auth-3)** — Supabase supports phone auth via Twilio or MSG91 (Indian SMS gateway, cheaper). Add after Phase Auth-2. Many users have Google accounts but instinctively trust an OTP to their Jio/Airtel number.
- **WhatsApp Login** — Not natively supported by Supabase. Requires Meta Business API. Defer until app has significant scale (1000+ users).
- **Data Privacy** — Indian users in the 18–35 fitness demographic are increasingly aware of data privacy post-DPDP Act 2023. Consider adding a "Your data stays on this device for now" notice during Phase Auth-1 (before Phase Auth-2 cloud sync). This builds trust rather than eroding it.

---

## 🔗 UX Audit Cross-Reference

The following UX audit items from `TODO-ux-audit.md` and `TODO-UX-10-profile-auth-contact.md` are directly impacted by this auth migration:

| UX Item | Description | Status After Auth-1 |
|---------|-------------|---------------------|
| **UX-11.1** 🔴 | Plain-text passwords in localStorage | ✅ **SUPERSEDED** — Supabase bcrypt replaces client-side storage entirely |
| **UX-12.1** 🟡 | No "Try Demo" one-click button | ✅ **SUPERSEDED** — Task 2e adds `handleDemo` with real Supabase demo account |
| **UX-12.2** 🟡 | No password strength indicator | ⚠️ **Still needed** — add strength bar below password field in Task 2f |
| **UX-12.3** 🟡 | Email validation only on submit | ⚠️ **Still needed** — add `onBlur` email regex in Task 2f |
| **UX-17.1** 🔴 | No onboarding flow for new users | ⚠️ **Hook prepared** (Task 10) — full implementation separate ticket |

> **Action:** Mark UX-11.1 and UX-12.1 as `[SUPERSEDED by Auth Migration]` in `TODO-UX-10-profile-auth-contact.md` when Auth-1 ships.

### Items that remain independent (no overlap with auth migration):
- UX-11.2 — Profile cancel edit button
- UX-11.3 — "Member for X days" relative date
- UX-11.4 — Export/Import loading states
- UX-13.1 — WhatsApp CTA on Contact page
- UX-13.2 — Billing frequency on pricing cards

---

## 📝 Gap Fixes Applied (2026-04-08 Audit)

The following gaps were identified during a code-level audit and have been patched into this document:

| Gap | Severity | What was missing | Fixed in |
|-----|----------|-----------------|----------|
| **A** | 🔴 | `age` field: form collects integer, SQL had only `dob` date | SQL table + Task 2b |
| **B** | 🔴 | Registration dropped weight, height, activityLevel, workoutDays | Task 2b + Task 2f |
| **C** | 🟠 | `DashboardPage.jsx` has 2 `setUsers` calls (goal set/clear) — not covered | New Task 5b |
| **D** | 🟠 | SQL table missing `workout_days`, `weight_goal_start`, `unit_weight`, `unit_height`, `is_admin` | SQL table |
| **E** | 🟠 | ProfilePage avatar upload & preset selection `setUsers` calls not covered | New Task 5c |
| **F** | 🟡 | ProfilePage unit toggles (`unitWeight`, `unitHeight`) `setUsers` calls not covered | New Task 5c |
| **G** | 🟡 | No cleanup task for `INIT_USERS` / `sample.js` / old localStorage keys | New Task 9 |
| **H** | 🟡 | No onboarding hook for new user registration flow | New Task 10 |
| **I** | 🟡 | Task 3b user mapping missing 6+ fields (age, workoutDays, isAdmin, joinDate, etc.) | Task 3b |
| **J** | 🟡 | `fetchProfile` had stale closure bug on `session` variable | Task 3c |