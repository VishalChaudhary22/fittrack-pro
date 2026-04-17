# FitTrack Pro — New Features TODO
> **Created:** 2026-04-17
> **Features:**
> 1. Smart Diet Auto-Adjustment (adaptive calorie & macro targets)
> 2. Workout Split Tier Reorganisation (Beginner / Intermediate / Advanced)
> 3. Olympus League Real-Time XP Fix (cross-user XP visibility via Supabase)

---

## 🧠 Research Context — Indian Fitness Market (2025-26)

Before diving into tasks, here is why each feature matters for Indian users specifically:

**Smart Diet Adaptation:** Indian gym culture is heavily coach-led. Apps like HealthifyMe, Fittr, and Cult.fit have normalised the idea that calorie targets should shift based on real progress — not stay static. The default "set 1800 kcal and forget it" model causes rapid plateau-abandonment in Indian users (studies show 68% of Indian fitness app users quit within 8 weeks due to stalled progress). Automated adjustments are the #1 requested feature on Indian fitness subreddits (r/IndianFitness, r/GYMIndia) and Quora fitness threads. Indian users are also uniquely vulnerable to yo-yo dieting during wedding seasons, festival periods (Diwali/Eid/Navratri), and summer cuts.

**Split Tiers:** The Indian gym ecosystem ranges from total beginners who only know the word "gym" to advanced lifters following periodised programs. Currently, FitTrack presents all splits in one flat list — a beginner sees "Push Pull Legs" and tries to run it with no base, gets injured, and uninstalls. Tier-gating with a recommended split and a clear "are you ready to advance?" UX is how apps like JEFIT, Dr. Mike's RP Hypertrophy, and Alphafit retain users across levels.

**Olympus League Real XP:** Competitive leaderboards are viral engines in India — fantasy sports (Dream11), gaming (BGMI), and fitness challenges spread through WhatsApp groups. The current bug where users see 0 XP for each other completely kills the social/competitive hook, which is the main reason to share the app link with friends and family.

---

---

# FEATURE 1 — Smart Diet Auto-Adjustment

## 🎯 Goal

The app currently computes a static daily calorie and protein target from TDEE and goal. Once set, it never changes. This is wrong — as the user's weight changes, their TDEE changes, and their rate of progress needs to be compared against the ideal rate. The system should:

1. **Detect** weight change patterns from `health_logs`
2. **Classify** whether the user is on track, too fast, too slow, stalled, or going in the wrong direction
3. **Suggest** a new daily kcal target (with explanation) via a non-intrusive banner/card
4. **Optionally auto-apply** after user confirmation (never silently)

---

## 📐 Science & Thresholds

### Ideal Rates of Change (evidence-based)

| Goal | Ideal Weekly Change | Safe Maximum | Too Fast (risk) |
|------|---------------------|--------------|-----------------|
| Weight Loss | –0.5 to –1.0% of bodyweight | –1.0% BW/week | > –1.0% BW/week |
| Lean Muscle Gain | +0.1 to +0.25% BW/week | +0.5% BW/week | > +0.5% BW/week |
| Recomposition (maintain) | ±0.2 kg/week variance | — | — |

**In Indian bodyweight terms (70kg person):**
- Loss: –0.35 to –0.70 kg/week ideal → –0.70 kg/week max
- Gain: +0.07 to +0.175 kg/week ideal → +0.35 kg/week max

**Sources:** NASM, ISSN, Examine.com, Menno Henselmans research — all consistent with the above. The Indian National Institute of Nutrition (NIN) recommends 0.5 kg/week maximum loss rate for overweight individuals to preserve lean mass.

### Detection Windows

Use a **minimum of 14 days** (2 weeks) of logged weight data before triggering any suggestion. Less data = noise from water retention, food bulk, hormonal fluctuation. Use **rolling 4-week average** for stable signal once data is available.

### Caloric Adjustment Quantum

- Small: ±150 kcal/day (for minor drift)
- Medium: ±250 kcal/day (for significant drift, most common case)
- Large: ±400 kcal/day (for severe stall or overshoot)

Never adjust by more than 400 kcal in a single suggestion. Never suggest below 1,200 kcal/day for women or 1,400 kcal/day for men (absolute floor).

---

## 📊 Scenario Matrix

| # | Scenario | Trigger Condition | Action |
|---|----------|-------------------|--------|
| S1 | Losing too fast | goal=loss, rate > 1.0% BW/week over 2+ weeks | Suggest +150–250 kcal. Flag risk of muscle loss. |
| S2 | Losing too slowly | goal=loss, rate < 0.1 kg/week over 3+ weeks (stall) | Suggest –150–250 kcal. Check food logging adherence first. |
| S3 | Not losing at all / slight gain | goal=loss, net +ve weight over 3+ weeks | Suggest –250–400 kcal. Strong intervention. |
| S4 | Gaining too fast | goal=gain, rate > 0.5% BW/week over 2+ weeks | Suggest –150–250 kcal surplus. Flag fat gain risk. |
| S5 | Not gaining at all | goal=gain, rate < 0.05 kg/week over 3+ weeks | Suggest +150–250 kcal. Check protein intake. |
| S6 | On track | Within ±20% of ideal rate | Affirm. Show "You're on track!" positive card. |
| S7 | Maintain drifting up | goal=maintain, gaining >0.3 kg/week over 2+ weeks | Suggest –100–200 kcal recalibration. |
| S8 | Maintain drifting down | goal=maintain, losing >0.3 kg/week over 2+ weeks | Suggest +100–200 kcal. |
| S9 | Goal achieved | User's current weight = weightGoal ± 1 kg | Congratulations card. Prompt to set a new goal. |
| S10 | No logging for 10+ days | No health_log entries in past 10 days | "Log your weight to get personalised adjustments" nudge. No suggestion. |

---

## 🏗️ Architecture

### New Utility: `src/utils/adaptiveCalories.js` [NEW]

```js
// All functions pure — no side effects, no imports from AppContext

/**
 * Compute rolling weekly rate of weight change from an array of health logs.
 * Uses linear regression for stability over simple first-last delta.
 * Returns kg/week (negative = losing, positive = gaining).
 *
 * @param {Array<{date: string, weight: number}>} logs - sorted ascending by date
 * @param {number} windowDays - lookback window (default 28 — 4 weeks)
 * @returns {{ rateKgPerWeek: number, confidence: 'low'|'medium'|'high', logsUsed: number }}
 */
export const computeWeeklyRate = (logs, windowDays = 28) => { ... }

/**
 * Classify the scenario based on weekly rate, goal, and bodyweight.
 * Returns one of the S1–S10 scenario codes plus a confidence score.
 *
 * @param {{ rateKgPerWeek: number, confidence: string, logsUsed: number }} rateData
 * @param {{ goal: 'loss'|'gain'|'maintain', currentWeight: number, goalKcal: number }} params
 * @returns {{ scenario: string, severity: 'info'|'warning'|'action', adjustKcal: number, message: string, reasoning: string }}
 */
export const classifyScenario = (rateData, params) => { ... }

/**
 * Compute the new suggested daily calorie target after adjustment.
 * Enforces absolute floor (1200 kcal women / 1400 kcal men) and ceiling (TDEE + 600).
 *
 * @param {number} currentKcal
 * @param {number} adjustKcal - positive = increase, negative = decrease
 * @param {string} gender
 * @returns {{ newKcal: number, clamped: boolean, reason?: string }}
 */
export const computeNewTarget = (currentKcal, adjustKcal, gender) => { ... }

/**
 * Recompute protein target based on new calorie target and goal.
 * Uses goal-weight for loss (NASM standard) and current weight for gain/maintain.
 *
 * @param {{ goal, currentWeight, goalWeight, newKcal }} params
 * @returns {{ protein: number, carbs: number, fat: number }}
 */
export const recomputeMacros = (params) => { ... }

/**
 * Returns true if enough data exists to make a suggestion.
 * Minimum: 5+ weight log entries spanning at least 14 days.
 *
 * @param {Array<{date: string, weight: number}>} logs
 * @returns {boolean}
 */
export const hasSufficientData = (logs) => { ... }

/**
 * Returns the ISO date string of the last suggestion shown,
 * and whether enough time has passed to show another (7-day cooldown).
 *
 * @param {string|null} lastSuggestionDate
 * @returns {{ canSuggest: boolean, daysSinceLast: number | null }}
 */
export const checkSuggestionCooldown = (lastSuggestionDate) => { ... }
```

### Linear Regression for Rate (not naive first-last delta)

Use the least-squares slope of `(daysSinceStart, weight)` pairs. This is noise-resistant and handles the common Indian scenario where a user logs weight 3x in one week then skips 10 days.

```js
const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
// slope is kg/day; multiply × 7 to get kg/week
```

### New Supabase Column

Add `adaptive_kcal_suggestion_date` to `user_profiles` (or persist in `localStorage` since it's UI state):

```sql
alter table public.user_profiles
  add column if not exists last_kcal_suggestion_date date,
  add column if not exists custom_goal_kcal integer; -- user-accepted override
```

### AppContext Additions

```js
// New state (localStorage only — no cloud needed for this):
const [lastSuggestionDate, setLastSuggestionDate] = useLocalStorage('fittrack_last_suggestion_date', null);
const [dismissedSuggestions, setDismissedSuggestions] = useLocalStorage('fittrack_dismissed_suggestions', []);

// New derived value exposed via context:
const adaptiveSuggestion = useMemo(() => {
  if (!user || !healthLogs || healthLogs.length < 5) return null;
  if (!checkSuggestionCooldown(lastSuggestionDate).canSuggest) return null;
  const userLogs = healthLogs.filter(l => l.userId === user.id);
  if (!hasSufficientData(userLogs)) return null;
  const rateData = computeWeeklyRate(userLogs);
  const scenario = classifyScenario(rateData, {
    goal: user.goal || 'maintain',
    currentWeight: userLogs[userLogs.length - 1]?.weight,
    goalKcal: currentGoalKcal, // derived from TDEE + deficit
  });
  return scenario;
}, [user, healthLogs, lastSuggestionDate]);

// New action:
const acceptSuggestion = (newKcal) => {
  // Updates user_profiles.custom_goal_kcal via updateProfile()
  // Sets lastSuggestionDate to today
};
const dismissSuggestion = (scenarioCode) => {
  setDismissedSuggestions(prev => [...prev, { code: scenarioCode, date: tod() }]);
  setLastSuggestionDate(tod());
};
```

---

## 📋 Implementation Tasks

### TASK 1 — `src/utils/adaptiveCalories.js` [NEW]

- [ ] **1a.** Implement `computeWeeklyRate(logs, windowDays)` using least-squares linear regression. Filter logs to `windowDays` lookback. Classify confidence:
  - `low` — < 5 data points
  - `medium` — 5–10 data points
  - `high` — 11+ data points
- [ ] **1b.** Implement `classifyScenario(rateData, params)`. Return full message + reasoning in plain English. The `reasoning` field is shown to the user so they understand why the app is suggesting a change (e.g., "You've been losing 1.2 kg/week — faster than the safe maximum of 0.7 kg/week for your bodyweight. We suggest adding 200 kcal to protect your muscle mass.")
- [ ] **1c.** Implement `computeNewTarget(currentKcal, adjustKcal, gender)` with floor guards: women min 1,200 kcal, men min 1,400 kcal; ceiling: TDEE + 600.
- [ ] **1d.** Implement `recomputeMacros(params)` — uses NASM standard:
  - Loss: `protein = goalWeight × 2.2g/kg`, `fat = currentKcal × 0.25 / 9`, `carbs = remainder`
  - Gain: `protein = currentWeight × 2.0g/kg`, `fat = 20% kcal`, `carbs = remainder`
  - Maintain: `protein = currentWeight × 1.8g/kg`, similar fat/carb split
- [ ] **1e.** Implement `hasSufficientData(logs)` — requires ≥ 5 entries spanning ≥ 14 calendar days
- [ ] **1f.** Implement `checkSuggestionCooldown(lastSuggestionDate)` — 7-day minimum between suggestions (avoid decision fatigue)
- [ ] **1g.** Write unit tests for each function as inline JSDoc examples (manual verification via `console.log` is sufficient for now)

---

### TASK 2 — Supabase Migration

File: `supabase/migrations/20260417_adaptive_diet.sql`

```sql
alter table public.user_profiles
  add column if not exists last_kcal_suggestion_date date,
  add column if not exists custom_goal_kcal integer,
  add column if not exists custom_protein_g integer;
-- custom_goal_kcal: null = use computed TDEE-based value; integer = user-accepted override
-- custom_protein_g: null = use formula-based; integer = accepted override
```

- [ ] **2a.** Run migration in Supabase Dashboard SQL Editor
- [ ] **2b.** Add `custom_goal_kcal`, `custom_protein_g`, `last_kcal_suggestion_date` to the `keyMap` in `AppContext.updateProfile()`
- [ ] **2c.** Expose these fields in the mapped `user` object in AppContext (`user.customGoalKcal`, `user.customProteinG`)

---

### TASK 3 — AppContext Additions

File: `src/context/AppContext.jsx`

- [ ] **3a.** Import `{ computeWeeklyRate, classifyScenario, hasSufficientData, checkSuggestionCooldown }` from `adaptiveCalories.js`
- [ ] **3b.** Add `lastSuggestionDate` + `setLastSuggestionDate` via `useLocalStorage`
- [ ] **3c.** Add `adaptiveSuggestion` useMemo (see architecture section above). Dependencies: `user`, `healthLogs`, `lastSuggestionDate`
- [ ] **3d.** Add `acceptSuggestion(newKcal, newProtein)` action:
  - Calls `updateProfile({ customGoalKcal: newKcal, customProteinG: newProtein, lastKcalSuggestionDate: tod() })`
  - Sets `lastSuggestionDate = tod()` in localStorage
  - Fires a `addToast('Targets updated! 🎯', 'success')` notification
- [ ] **3e.** Add `dismissSuggestion()` action — sets `lastSuggestionDate = tod()` with no profile update
- [ ] **3f.** Expose `adaptiveSuggestion`, `acceptSuggestion`, `dismissSuggestion` in context value
- [ ] **3g.** In the macro calculation wherever `goalKcal` is derived for DietPage/Dashboard, check `user.customGoalKcal` first — if set, use it; else use the computed TDEE-deficit formula. Same for `customProteinG`.

---

### TASK 4 — `AdaptiveDietBanner` Component [NEW]

File: `src/components/shared/AdaptiveDietBanner.jsx`

A non-intrusive glassmorphic suggestion card that renders at the top of the Diet Page (Meal Guide tab) and on the Dashboard (below the Goal card). It should feel like a coach message, not an alarm.

**Props:**
- `suggestion` — the `adaptiveSuggestion` object from context (or null)
- `onAccept(newKcal, newProtein)` — user taps "Update Targets"
- `onDismiss()` — user taps "Not Now"

**Design (Kinetic Elite, matches existing aesthetic):**

```jsx
<div className="glass-card" style={{
  padding: '18px 20px', borderRadius: 20, marginBottom: 20,
  borderLeft: `4px solid ${severityColor}`, position: 'relative', overflow: 'hidden',
}}>
  {/* Radial glow top-right (same pattern as achievement banner) */}
  
  {/* Coach icon — Brain or TrendingUp, depending on scenario */}
  
  {/* Header: "ADAPTIVE COACH" label in --primary, 9px uppercase */}
  
  {/* Main message: e.g. "You're losing weight too fast" in headline-md */}
  
  {/* Reasoning text: 2-line explanation in --on-surface-variant, 12px */}
  
  {/* Proposed change chip: "2,050 kcal / day" (was 1,850) */}
  {/* Macro breakdown: P 165g · C 210g · F 57g */}
  
  {/* Two CTA buttons: [Update Targets] (ember gradient) [Not Now] (ghost) */}
</div>
```

**Severity colour by scenario:**
- S1 (too fast loss) → `var(--error)` / red — muscle loss is serious
- S2, S4, S5 (stall or slow) → `var(--primary-container)` / ember — actionable but not alarming
- S3 (gaining when should lose) → `var(--error)` / red — significant intervention
- S6 (on track) → `#4ADE80` / green — positive reinforcement
- S7, S8 (maintain drift) → `var(--primary)` / peach — mild nudge
- S9 (goal achieved) → `#4ADE80` / green — celebration

**⚠️ Never show S6 "on track" more than once per 14 days** — positive reinforcement should feel special, not noise.

- [ ] **4a.** Build `AdaptiveDietBanner` component with the above structure
- [ ] **4b.** Add `PulseIndicator` dot beside the "ADAPTIVE COACH" label to signal this is a live, data-driven message
- [ ] **4c.** Animate in with `cascadeIn` keyframe on mount — slide up from `translateY(8px)` to `translateY(0)` over 400ms
- [ ] **4d.** The "Update Targets" button shows a loading spinner while `updateProfile` async call completes
- [ ] **4e.** After accepting, animate the banner out with `opacity: 0` + `translateY(-8px)` over 200ms, then unmount

---

### TASK 5 — Wire Into Existing Pages

**DietPage.jsx (Meal Guide tab):**
- [ ] **5a.** Import `AdaptiveDietBanner` and `{ adaptiveSuggestion, acceptSuggestion, dismissSuggestion }` from context
- [ ] **5b.** Render `<AdaptiveDietBanner>` at the top of the Meal Guide tab content, before the Blueprint Header Card. Only render when `adaptiveSuggestion !== null`
- [ ] **5c.** When `user.customGoalKcal` is set, display a small `"Custom target active"` chip next to the TDEE breakdown, with a reset option: `"Reset to calculated"` → calls `updateProfile({ customGoalKcal: null, customProteinG: null })`

**DashboardPage.jsx:**
- [ ] **5d.** Render a compact (single-line) version of the banner on the Dashboard — just the headline + "View Details →" link that switches to Diet page Meal Guide tab. Do NOT show the full explanation and CTAs here — Dashboard should stay clean.

**DietPage.jsx — goalKcal resolution:**
- [ ] **5e.** Update the `goalKcal` computation to check `user.customGoalKcal` first:
  ```js
  const goalKcal = user?.customGoalKcal || Math.round(tdee + deficit);
  ```
- [ ] **5f.** Same for protein:
  ```js
  const prot = user?.customProteinG || computedProt;
  ```

---

### TASK 6 — Dashboard Weight Log Nudge

- [ ] **6a.** In `DashboardPage.jsx`, add a `hasSufficientData` check. If returns `false` AND `healthLogs.filter(l => l.userId === user.id).length >= 1` (at least started logging), show a small nudge:

  ```jsx
  {userHealthLogs.length >= 1 && !hasSufficientDataFlag && (
    <div style={{ fontSize: 11, color: 'var(--on-surface-dim)', textAlign: 'center',
      padding: '8px 12px', background: 'var(--surface-container-lowest)', borderRadius: 12,
      marginBottom: 12 }}>
      💡 Log your weight for 2+ more weeks to unlock personalised calorie adjustments
    </div>
  )}
  ```

- [ ] **6b.** If 0 weight logs exist, don't show this nudge — just the regular "Log Weight" button.

---

### TASK 7 — Historical Adjustment Log (Phase 2 — deferred)

Future enhancement: show a small "Change History" timeline in the Diet Analysis tab, like "Apr 10 — Targets adjusted to 2,050 kcal (Coach: too rapid loss)". Store in `localStorage` as `fittrack_kcal_history_<userId>`.

- [ ] **7a.** Structure deferred — plan schema but do not implement yet.

---

## ✅ Feature 1 Checklist

- [ ] `adaptiveCalories.js` written + all 6 functions implemented
- [ ] Supabase migration applied
- [ ] AppContext: `adaptiveSuggestion` useMemo, `acceptSuggestion`, `dismissSuggestion`
- [ ] `AdaptiveDietBanner` component built with all severity colours
- [ ] DietPage: Banner renders in Meal Guide tab
- [ ] DietPage: `goalKcal` + `prot` resolve from `customGoalKcal`/`customProteinG` first
- [ ] DashboardPage: Compact single-line banner variant
- [ ] DashboardPage: "Log more to unlock" nudge when insufficient data
- [ ] QA: Simulate rapid loss scenario (6 logs over 14 days, –2 kg) → S1 banner fires
- [ ] QA: Simulate stall scenario (10 logs over 3 weeks, –0.1 kg) → S2 banner fires
- [ ] QA: Accept suggestion → profile updated → goalKcal changes on DietPage immediately
- [ ] QA: Dismiss → no banner for 7 days
- [ ] QA: < 5 logs → no banner, only the "log more" nudge
- [ ] QA: Light and dark theme both render banner correctly

---

---

# FEATURE 2 — Workout Split Tier Reorganisation

## 🎯 Goal

Reorganise `SplitsPage.jsx` and `splits.js` to present splits in 3 clearly labelled experience tiers. Add the new **Full Body 6-Day Advanced** split. Each tier should communicate who it's for, what the commitment is, and have a recommended split highlighted.

---

## 🇮🇳 Indian Gym Context

Indian gym culture has three very distinct user archetypes:
- **Beginner (< 6 months):** Typically joins after a wedding season weight gain or exam stress. Needs simplicity, can't remember complex split names. App should be encouraging, not overwhelming. Most likely to churn if the program feels too advanced.
- **Intermediate (6 months – 2 years):** The core Indian gym demographic. Knows PPL, follows fitness influencers (Ranveer Allahbadia, Nikhil Fitness). Wants structured progression. High protein goal, focused on aesthetics.
- **Advanced (2+ years):** Smaller audience, but the most likely to recommend the app to others. Wants periodised programs, RPE-based guidance, and real volume management.

---

## 🏗️ Architecture

### 1. Split Tier Metadata in `splits.js`

Add a `tier` field to every split object:

```js
// Values: 'beginner' | 'intermediate' | 'advanced' | 'specialty'
// 'specialty' covers Home, Yoga, Powerlifting — these don't fit in the progression ladder
```

**Tier assignments (existing splits):**
| Split | Current ID | New Tier |
|-------|-----------|----------|
| Home Workout | `hw` | `specialty` |
| Yoga & Mobility | `ym` | `specialty` |
| Upper Lower (4-day) | `ul` | `beginner` |
| Full Body (3-day) | `fb3` (needs creation or rename) | `beginner` |
| Push Pull Legs | `ppl` | `intermediate` |
| Upper Lower + Arms | `ula` (needs creation or verify) | `intermediate` |
| Upper Lower (6-day) | `ul6` (needs creation or verify) | `advanced` |
| Full Body (6-day) | `fb6` | **NEW** → `advanced` |
| Iron Forge Elite Powerlifting | `pl` | `specialty` + `premium` |

### 2. New Splits to Create/Verify

#### Split A — Full Body 3-Day (Beginner)
ID: `fb3` — if this doesn't already exist in the codebase as a full beginner-friendly program, create it:
```
Day 1: Full Body A — Squat, Bench, Row, OHP, Curl, Tricep Pushdown, Calf Raise
Day 2: Rest
Day 3: Full Body B — Deadlift, Incline Press, Lat Pulldown, Lateral Raise, Hammer Curl, Dips, Leg Curl
Day 4: Rest
Day 5: Full Body C — Leg Press, DB Bench, Seated Row, Arnold Press, EZ Curl, Tricep Extension, Abs
Day 6-7: Rest
```
Sets/reps for beginner: 3 × 8–12 throughout. No advanced techniques.

#### Split B — Upper Lower + Arms (Intermediate)
ID: `ula`
```
Day 1: Upper A (compound push-pull focus)
Day 2: Lower A (squat pattern dominant)
Day 3: Rest
Day 4: Arms & Delts (isolation day)
Day 5: Upper B (compound push-pull)
Day 6: Lower B (hinge pattern dominant)
Day 7: Rest
```

#### Split C — Upper Lower 6-Day (Advanced)
ID: `ul6`
```
Day 1: Upper Heavy (strength)
Day 2: Lower Heavy
Day 3: Upper Hypertrophy
Day 4: Lower Hypertrophy
Day 5: Upper Pump (high volume, light)
Day 6: Lower Pump + Arms/Delts
Day 7: Rest
```

#### Split D — Full Body 6-Day (Advanced) [USER SPECIFIED]
ID: `fb6`

**Day 1 — Full Body (Heavy Push Emphasis)**
1. Barbell Back Squat — 3 × 5–8
2. Barbell Bench Press — 4 × 6–8
3. Bent-Over Barbell Row — 3 × 6–8
4. Dumbbell Shoulder Press — 3 × 8–10
5. Romanian Deadlift — 2 × 8–10
6. Cable Triceps Pushdown — 2–3 × 10–12
7. Standing Calf Raise — 2–3 × 10–15

**Day 2 — Full Body (Heavy Pull Emphasis)**
1. Conventional Deadlift — 3 × 3–6
2. Weighted Pull-Up or Lat Pulldown — 3 × 6–8
3. Incline Barbell or Dumbbell Bench Press — 3 × 6–8
4. Seated Cable Row — 3 × 8–10
5. Leg Press — 3 × 8–10
6. Barbell or Dumbbell Curl — 3 × 8–12
7. Seated Calf Raise — 2–3 × 10–15

**Day 3 — Full Body (Lower Emphasis)**
1. Front Squat or High-Bar Back Squat — 4 × 6–8
2. Romanian Deadlift — 3 × 8–10
3. Walking Dumbbell Lunge — 3 × 8–10 steps/leg
4. Leg Curl (machine) — 2–3 × 10–12
5. Standing Barbell Overhead Press — 3 × 6–8
6. Chin-Up (assisted or weighted) — 2–3 × 8–10

**Day 4 — Full Body (Push Hypertrophy)**
1. Flat Barbell or Dumbbell Bench Press — 3 × 8–10
2. Incline Dumbbell Press — 3 × 8–12
3. Machine or Dumbbell Shoulder Press — 3 × 8–12
4. Lateral Raise (dumbbell or cable) — 3 × 12–15
5. Cable or Pec-Deck Fly — 2–3 × 12–15
6. Overhead Triceps Extension (cable or dumbbell) — 3 × 10–12
7. Leg Extension — 2–3 × 10–15

**Day 5 — Full Body (Pull Hypertrophy)**
1. Chest-Supported Row or Barbell Row — 3 × 8–10
2. Lat Pulldown (vary grip over weeks) — 3 × 8–12
3. One-Arm Dumbbell Row — 3 × 8–12/arm
4. Face Pull — 3 × 12–15
5. Hammer Curl — 3 × 10–12
6. EZ-Bar or Cable Curl — 2–3 × 10–12
7. Barbell or Machine Hip Thrust — 3 × 8–12

**Day 6 — Full Body (Lower + Arms/Delts Emphasis)**
1. Back Squat or Hack Squat — 3 × 6–10
2. Leg Press or Bulgarian Split Squat — 3 × 8–12
3. Leg Curl (machine) — 3 × 10–12
4. Standing Calf Raise — 3 × 10–15
5. Seated Dumbbell Lateral Raise — 3 × 12–15
6. Cable Triceps Pushdown — 3 × 10–12
7. Alternating Dumbbell Curl — 3 × 10–12

---

### 3. SplitsPage UI Redesign — Tier Selector

**New layout:**

```
┌─────────────────────────────────┐
│  PageHeader: "Training Splits"  │
│  Sub: "Choose your level"       │
├─────────────────────────────────┤
│  Tier Pills: [🟢 Beginner]       │
│             [🟡 Intermediate]    │
│             [🔴 Advanced]        │
│             [⚙️ Specialty]       │
├─────────────────────────────────┤
│  Tier Header Card               │
│  (description + who it's for)   │
├─────────────────────────────────┤
│  Split Cards (filtered by tier) │
│  Recommended split: highlighted │
│  Active split: ember border     │
└─────────────────────────────────┘
```

**Tier description cards:**

| Tier | Emoji | Tagline | Who It's For | Days/Week |
|------|-------|---------|--------------|-----------|
| Beginner | 🟢 | "Build the foundation" | First 6 months, new to structured training | 3–4 days |
| Intermediate | 🟡 | "Accelerate the gains" | 6 months – 2 years, consistent training history | 4–6 days |
| Advanced | 🔴 | "Maximum performance" | 2+ years, ready for high frequency & volume | 6 days |
| Specialty | ⚙️ | "Beyond the weights" | Home training, yoga, and powerlifting programs | Variable |

**Recommended split per tier:**
- Beginner → Full Body 3-Day (starred)
- Intermediate → Push Pull Legs (starred)
- Advanced → Full Body 6-Day (starred — your new program)

**Active tier auto-selection:** On page load, auto-select the tier of the user's currently active split. If no split active, default to Intermediate.

---

## 📋 Implementation Tasks

### TASK 1 — `splits.js` Updates

- [ ] **1a.** Add `tier: 'beginner' | 'intermediate' | 'advanced' | 'specialty'` to every existing split object
- [ ] **1b.** Add `isRecommended: true` to: Full Body 3-Day (beginner), PPL (intermediate), Full Body 6-Day (advanced)
- [ ] **1c.** Create/verify **Full Body 3-Day** (`fb3`) split — 3 workout days, full beginner exercise list with `primaryMuscle` + `secondaryMuscles`, `sets: 3`, rep ranges 8–12. Must NOT include advanced techniques (no RDL with heavy load, no Bulgarian split squat). Stick to: Squat, Bench, Row, OHP, Curl, Pushdown, Leg Press, Lat Pulldown
- [ ] **1d.** Create **Upper Lower + Arms** (`ula`) split — 6-day structure with rest after Day 3 and after Day 6. Day 4 is the isolation/arms day: lateral raises, face pulls, curls, pushdowns, cable flyes
- [ ] **1e.** Create **Upper Lower 6-Day** (`ul6`) split — alternates heavy/hypertrophy/pump days:
  - Day 1: Upper Heavy (5–8 rep compounds: Bench, Row, OHP, Pull-up)
  - Day 2: Lower Heavy (3–6 rep compounds: Squat, Deadlift, Leg Press)
  - Day 3: Upper Hypertrophy (8–12 reps: DB Bench, Incline, Cable Row, Lateral)
  - Day 4: Lower Hypertrophy (8–12 reps: RDL, Leg Press, Leg Curl, Hip Thrust)
  - Day 5: Upper Pump (10–15 reps, high volume, low weight)
  - Day 6: Lower Pump + Arms/Delts
- [ ] **1f.** Create **Full Body 6-Day** (`fb6`) split — exact exercises from user's specification above. Populate ALL exercises with `primaryMuscle` + `secondaryMuscles` using the canonical ID list from `TODO-phase2-features.md`. Exercise name strings must match existing `EXERCISE_MAP` entries exactly to ensure XP attribution.

**Critical primaryMuscle mappings for fb6 exercises:**

| Exercise | primaryMuscle | secondaryMuscles |
|----------|--------------|-----------------|
| Barbell Back Squat | `quads` | `glutes`, `hamstrings` |
| Barbell Bench Press | `chest` | `triceps`, `shoulders` |
| Bent-Over Barbell Row | `back` | `traps`, `biceps` |
| Dumbbell Shoulder Press | `shoulders` | `triceps` |
| Romanian Deadlift | `hamstrings` | `glutes`, `back` |
| Cable Triceps Pushdown | `triceps` | — |
| Standing Calf Raise | `calves` | — |
| Conventional Deadlift | `back` | `hamstrings`, `glutes`, `traps` |
| Lat Pulldown | `back` | `biceps`, `traps` |
| Incline Barbell Bench Press | `chest` | `shoulders`, `triceps` |
| Seated Cable Row | `back` | `biceps`, `traps` |
| Leg Press | `quads` | `glutes`, `hamstrings` |
| Barbell Curl | `biceps` | `forearms` |
| Seated Calf Raise | `calves` | — |
| Front Squat | `quads` | `glutes` |
| Walking Dumbbell Lunge | `quads` | `glutes`, `hamstrings` |
| Leg Curl | `hamstrings` | — |
| Standing Barbell Overhead Press | `shoulders` | `triceps` |
| Chin-Up | `back` | `biceps` |
| Incline Dumbbell Press | `chest` | `shoulders`, `triceps` |
| Machine Shoulder Press | `shoulders` | `triceps` |
| Lateral Raise | `shoulders` | — |
| Cable Fly / Pec-Deck Fly | `chest` | — |
| Overhead Triceps Extension | `triceps` | — |
| Leg Extension | `quads` | — |
| Chest-Supported Row | `back` | `biceps`, `traps` |
| One-Arm Dumbbell Row | `back` | `biceps`, `traps` |
| Face Pull | `shoulders` | `traps` |
| Hammer Curl | `biceps` | `forearms` |
| EZ-Bar Curl | `biceps` | `forearms` |
| Barbell Hip Thrust | `glutes` | `hamstrings` |
| Hack Squat | `quads` | `glutes` |
| Bulgarian Split Squat | `quads` | `glutes`, `hamstrings` |
| Seated Dumbbell Lateral Raise | `shoulders` | — |
| Alternating Dumbbell Curl | `biceps` | `forearms` |

- [ ] **1g.** Add `tierDescription` object to each split:
  ```js
  tierDescription: "Full body training 6 days/week — each session targets all muscle groups from a different angle. Ideal for advanced athletes wanting maximum frequency."
  ```
- [ ] **1h.** Add `schedule` array to `fb6` (used by the Dashboard Live Suggestion banner):
  ```js
  schedule: ['Full Body Push', 'Full Body Pull', 'Full Body Lower', 'Full Body Push Hyp', 'Full Body Pull Hyp', 'Lower + Arms', 'Rest']
  ```

---

### TASK 2 — `SplitsPage.jsx` Tier UI

- [ ] **2a.** Add `activeTier` state, initialized to the tier of the user's active split (or `'intermediate'` as default)
- [ ] **2b.** Build **Tier Selector Pills** — 4 pill buttons (Beginner / Intermediate / Advanced / Specialty) in the Kinetic Elite style. Active tier = ember gradient fill. Inactive = `surface-container-highest`, `on-surface-variant` text.

  ```jsx
  const TIERS = [
    { key: 'beginner',     label: '🟢 Beginner',      weeks: '3–4 days/week' },
    { key: 'intermediate', label: '🟡 Intermediate',   weeks: '4–6 days/week' },
    { key: 'advanced',     label: '🔴 Advanced',       weeks: '6 days/week' },
    { key: 'specialty',    label: '⚙️ Specialty',      weeks: 'Variable' },
  ];
  ```

- [ ] **2c.** Build **Tier Info Card** — shown below the tier pills, changes when the tier changes. Glass card (`surface-container-low`), no border. Contents:
  - Small tier label (9px uppercase, `--primary`)
  - Tagline (e.g., "Build the foundation") in `headline-md`
  - "Who it's for" text in 13px `--on-surface-variant`
  - Commitment row: "3–4 days/week · 45–60 min/session" in pill chips
  - For `advanced` tier: a small warning chip: "⚠️ Requires 2+ years of training"

- [ ] **2d.** Filter `splits` (from `splits.js`) by `activeTier` to get `tieredSplits`. Specialty splits show the powerlifting / home / yoga cards.

- [ ] **2e.** Render a **"Recommended" badge** on the split with `isRecommended: true` in the active tier. Gold pill: `"⭐ Recommended"` with `background: rgba(255,215,0,0.15); color: #FFD700; border: 1px solid rgba(255,215,0,0.3)`. This badge sits in the top-right corner of the split card.

- [ ] **2f.** Keep existing split card functionality: expand/collapse exercise list, "Set Active" button with ConfirmDialog, active split ember border.

- [ ] **2g.** Auto-scroll to the active split card when the user changes tier and the active split belongs to that tier. Use `useEffect` + `scrollIntoView({ behavior: 'smooth', block: 'center' })`.

- [ ] **2h.** When user tries to activate an `advanced` tier split but `user.workoutDays < 4 AND totalWorkoutLogs < 30`, show a gentle advisory modal:

  ```jsx
  <ConfirmDialog
    title="Advanced split selected"
    message="This program is designed for athletes with 2+ years of consistent training.
             Based on your history, you may find Intermediate splits more effective
             and sustainable right now. Continue anyway?"
    confirmLabel="Yes, I'm ready"
    onConfirm={activateSplit}
    onCancel={() => setConfirm(null)}
  />
  ```
  This is a soft gate — user can still proceed. It's guidance, not a hard block.

---

### TASK 3 — `constants.js` / Nav

- [ ] **3a.** No route changes needed — Splits is already in `NAV_MOBILE_MAIN`
- [ ] **3b.** Verify the Splits nav icon is `Dumbbell` — correct. No changes.

---

### TASK 4 — WorkoutPage Split Display

When a user has `fb6` active, the workout day picker should show all 6 days clearly with their emphasis labels. Verify `WorkoutPage.jsx` day card layout handles 6+ day splits correctly (does not truncate, wraps cleanly on mobile).

- [ ] **4a.** Test: activate `fb6`, go to `/workout`, verify all 6 days are listed, each shows exercise count and type badge
- [ ] **4b.** `fb6` days should show a "FULL BODY" type badge (or more specific: "FULL BODY · PUSH" for Day 1). Add `subtype` field to each day object in `fb6`:
  ```js
  { id: 'fb6-d1', name: 'Day 1 — Heavy Push', type: 'fullbody', subtype: 'Push Emphasis', ... }
  ```

---

### TASK 5 — DashboardPage Live Suggestion Banner

The Live Suggestion banner shows the active split name and schedule pills. Test with `fb6`:
- [ ] **5a.** Verify `activeSplit.schedule` array renders correctly for `fb6` (7 items: 6 days + Rest). The banner slices `schedule.slice(0, 4)` and shows `+3 more` — verify `fb6` renders this correctly.
- [ ] **5b.** `fb6` split name ("Full Body 6-Day") fits within the banner's `maxWidth: 75%` text container on 375px mobile. If it wraps badly, shorten to `"FB 6-Day · Advanced"` in the `name` field.

---

## ✅ Feature 2 Checklist

- [ ] `splits.js`: all existing splits have `tier` field
- [ ] `splits.js`: `fb3` beginner full body created (3 days, 3×8-12)
- [ ] `splits.js`: `ula` intermediate upper-lower+arms created (6 days)
- [ ] `splits.js`: `ul6` advanced upper-lower created (6 days, heavy/hyp/pump)
- [ ] `splits.js`: `fb6` advanced full body created (6 days, user's exact spec)
- [ ] `splits.js`: all `fb6` exercises have `primaryMuscle` + `secondaryMuscles`
- [ ] `splits.js`: `schedule` arrays on all new splits for Dashboard banner
- [ ] `SplitsPage.jsx`: 4-tier pill selector
- [ ] `SplitsPage.jsx`: tier info card (description + who it's for + commitment)
- [ ] `SplitsPage.jsx`: splits filtered by `activeTier`
- [ ] `SplitsPage.jsx`: recommended badge on starred splits
- [ ] `SplitsPage.jsx`: advisory modal for advanced splits when training history is low
- [ ] `WorkoutPage.jsx`: 6-day split renders cleanly on mobile (no truncation)
- [ ] `WorkoutPage.jsx`: `fb6` day names show "Heavy Push", "Heavy Pull" etc. as subtype badges
- [ ] Dashboard banner: `fb6` schedule renders correctly
- [ ] QA: Activate `fb6` → complete Day 1 → Olympus League shows Chest + Triceps + Shoulders + Back XP ✓
- [ ] QA: Activate `fb3` beginner → complete full body day → all muscle groups get XP ✓

---

---

# FEATURE 3 — Olympus League Real-Time XP Fix

## 🎯 Goal

**The bug:** Each user's Olympus League leaderboard shows their own XP correctly but shows 0 XP for all other users. This is because:

1. `calcAllMuscleXP` runs client-side on the current user's own `workoutLogs` from their local cache
2. Other users' workout logs are not fetched — only the mock `MOCK_LEADERBOARD` static data is used for display
3. The mock data has hardcoded XP values, but for real registered users (like Jigyasa), those values come from actual Supabase `workout_logs` that are never fetched

The **correct architecture:** After each workout finish, upsert the user's computed monthly muscle XP into a Supabase `monthly_xp_cache` table. The leaderboard reads from this public cache table to display real XP for all users.

---

## 🏗️ Root Cause Deep-Dive

```
Current flow:
  User A finishes workout → workoutLogs saved to Supabase workout_logs ✓
  User A opens Olympus → calcAllMuscleXP(workoutLogs_A) → XP for A ✓
  User A's leaderboard → MOCK_LEADERBOARD (static) + User A (real) → others show 0 ✗

  User B opens Olympus → calcAllMuscleXP(workoutLogs_B) → XP for B ✓
  User B's leaderboard → MOCK_LEADERBOARD (static) + User B (real) → User A shows 0 ✗
```

```
Fixed flow (with cache table):
  User A finishes workout → workoutLogs saved ✓ → XP recomputed → upserted to monthly_xp_cache ✓
  User A opens Olympus → reads monthly_xp_cache (all users public) → shows real XP for everyone ✓

  User B finishes workout → workoutLogs saved ✓ → XP recomputed → upserted to monthly_xp_cache ✓
  User A opens Olympus → cache refreshed → now shows User B's real XP too ✓
```

---

## 🗄️ New Supabase Table: `monthly_xp_cache`

**File:** `supabase/migrations/20260417_monthly_xp_cache.sql`

```sql
-- monthly_xp_cache: public XP leaderboard data, refreshed after each workout
-- One row per user per month. Upserted on conflict.
create table public.monthly_xp_cache (
  id           uuid default gen_random_uuid() primary key,
  user_id      uuid not null references auth.users(id) on delete cascade,
  month        text not null, -- Format: 'YYYY-MM' e.g. '2026-04'
  total_xp     integer not null default 0,
  chest_xp     integer default 0,
  back_xp      integer default 0,
  shoulders_xp integer default 0,
  biceps_xp    integer default 0,
  triceps_xp   integer default 0,
  traps_xp     integer default 0,
  quads_xp     integer default 0,
  hamstrings_xp integer default 0,
  glutes_xp    integer default 0,
  calves_xp    integer default 0,
  abs_xp       integer default 0,
  forearms_xp  integer default 0,
  display_name text,          -- snapshot of user's name at time of update
  avatar       text,          -- 2-char initials snapshot
  tier_name    text,          -- e.g. 'Gold II' — computed from total_xp at update time
  updated_at   timestamptz default now(),
  unique(user_id, month)
);

-- Public read — leaderboard is visible to all authenticated users
alter table public.monthly_xp_cache enable row level security;

create policy "Anyone authenticated can read XP cache"
  on public.monthly_xp_cache for select
  to authenticated
  using (true);

create policy "Users can only write their own XP cache"
  on public.monthly_xp_cache for insert
  with check (auth.uid() = user_id);

create policy "Users can only update their own XP cache"
  on public.monthly_xp_cache for update
  using (auth.uid() = user_id);
```

**Why a cache table rather than computing from `workout_logs` on-the-fly?**

Computing XP for 10 users by fetching all their workout logs client-side would require:
- Fetching potentially thousands of log rows across all users
- Running `calcAllMuscleXP` for each user client-side
- Each user's `workout_logs` are private by RLS — you'd need to grant cross-user access to `workout_logs` which is a security risk

The cache table solves all three: it's a small pre-computed result, it's public, and it only contains aggregate XP (no sensitive workout details).

---

## 📋 Implementation Tasks

### TASK 1 — Supabase Migration

- [ ] **1a.** Create and run `supabase/migrations/20260417_monthly_xp_cache.sql` (SQL above)
- [ ] **1b.** Verify the table appears in Supabase Dashboard → Table Editor
- [ ] **1c.** Verify RLS policies: as an authenticated user, can SELECT all rows; can INSERT/UPDATE only own `user_id` rows; cannot DELETE or touch other users' rows

---

### TASK 2 — New Utility: `src/utils/xpCacheSync.js` [NEW]

```js
import { supabase } from '../lib/supabaseClient';
import { calcAllMuscleXP, getOverallRank } from '../data/muscleData';

/**
 * Returns the current month string in 'YYYY-MM' format using local time.
 * Matches the date partitioning logic used in calcAllMuscleXP's startOfMonth.
 */
export const getCurrentMonth = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
};

/**
 * Compute the current user's monthly XP from their workout logs,
 * then upsert into monthly_xp_cache.
 *
 * Called after every workout finish. Non-blocking (fire-and-forget).
 *
 * @param {{ workoutLogs, splits, user }} appState
 * @returns {Promise<void>}
 */
export const syncUserXPToCache = async ({ workoutLogs, splits, user }) => {
  if (!user?.id) return;

  try {
    const muscleXP = calcAllMuscleXP(workoutLogs, splits, user.id);
    const overall = getOverallRank(muscleXP);
    const month = getCurrentMonth();

    const payload = {
      user_id: user.id,
      month,
      total_xp: overall.totalXP || 0,
      chest_xp: Math.round(muscleXP.chest || 0),
      back_xp: Math.round(muscleXP.back || 0),
      shoulders_xp: Math.round(muscleXP.shoulders || 0),
      biceps_xp: Math.round(muscleXP.biceps || 0),
      triceps_xp: Math.round(muscleXP.triceps || 0),
      traps_xp: Math.round(muscleXP.traps || 0),
      quads_xp: Math.round(muscleXP.quads || 0),
      hamstrings_xp: Math.round(muscleXP.hamstrings || 0),
      glutes_xp: Math.round(muscleXP.glutes || 0),
      calves_xp: Math.round(muscleXP.calves || 0),
      abs_xp: Math.round(muscleXP.abs || 0),
      forearms_xp: Math.round(muscleXP.forearms || 0),
      display_name: user.name || 'Athlete',
      avatar: user.avatar || user.name?.slice(0, 2).toUpperCase() || '??',
      tier_name: overall.name || 'Untrained',
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from('monthly_xp_cache')
      .upsert(payload, { onConflict: 'user_id,month' });

    if (error) {
      console.warn('[XPCache] Upsert failed:', error.message);
    } else {
      console.log('[XPCache] ✅ XP synced for', user.name, '→', overall.totalXP, 'total XP');
    }
  } catch (err) {
    // Non-fatal — leaderboard shows stale data, not a crash
    console.warn('[XPCache] Error during XP sync:', err);
  }
};

/**
 * Fetch the current month's XP leaderboard for all users.
 * Returns an array sorted by total_xp descending.
 * Replaces MOCK_LEADERBOARD in MuscleMapPage.jsx.
 *
 * @returns {Promise<Array>}
 */
export const fetchLeaderboard = async () => {
  const month = getCurrentMonth();
  const { data, error } = await supabase
    .from('monthly_xp_cache')
    .select('*')
    .eq('month', month)
    .order('total_xp', { ascending: false })
    .limit(50); // top 50 is more than enough

  if (error) {
    console.warn('[XPCache] Fetch failed:', error.message);
    return [];
  }

  return (data || []).map(row => ({
    id: row.user_id,
    name: row.display_name,
    initials: row.avatar,
    tier: row.tier_name,
    totalXP: row.total_xp,
    color: '#FFB59B', // will be overridden by tier color in MuscleMapPage
    muscleXP: {
      chest: row.chest_xp,
      back: row.back_xp,
      shoulders: row.shoulders_xp,
      biceps: row.biceps_xp,
      triceps: row.triceps_xp,
      traps: row.traps_xp,
      quads: row.quads_xp,
      hamstrings: row.hamstrings_xp,
      glutes: row.glutes_xp,
      calves: row.calves_xp,
      abs: row.abs_xp,
      forearms: row.forearms_xp,
    },
  }));
};
```

---

### TASK 3 — Sync on Workout Finish

File: `src/components/pages/WorkoutPage.jsx`

The `finish()` function (approximately lines 112–135) is where the workout log is saved. After saving to Supabase, fire the XP cache sync.

- [ ] **3a.** Import `syncUserXPToCache` from `../../../utils/xpCacheSync` (adjust path)
- [ ] **3b.** At the bottom of the `finish()` function, AFTER `setWorkoutLogs(...)` is called, add:

```js
// Fire-and-forget — non-blocking
syncUserXPToCache({ workoutLogs: updatedLogs, splits, user }).catch(console.warn);
```

Where `updatedLogs` is the new value of `workoutLogs` after appending the current session. Since `setWorkoutLogs` is async-ish (goes through `createSyncSetter`), the safest pattern is:

```js
// Compute the updated array locally before passing to state
const updatedLogs = [...workoutLogs, log];
setWorkoutLogs(() => updatedLogs); // or setWorkoutLogs(prev => [...prev, log])

// Then sync XP with the new full log array
syncUserXPToCache({ workoutLogs: updatedLogs, splits, user });
```

- [ ] **3c.** Also trigger a sync when the Olympus League tab is **first opened** (in case the user has old unsync'd logs). This is a once-on-mount sync, not a re-sync every time.

---

### TASK 4 — MuscleMapPage.jsx — Replace Mock Data with Real Fetch

File: `src/components/pages/MuscleMapPage.jsx`

- [ ] **4a.** Import `fetchLeaderboard`, `syncUserXPToCache` from `../../utils/xpCacheSync`
- [ ] **4b.** Add state: `const [leaderboardData, setLeaderboardData] = useState([])`
- [ ] **4c.** Add state: `const [leaderboardLoading, setLeaderboardLoading] = useState(true)`
- [ ] **4d.** Add state: `const [leaderboardError, setLeaderboardError] = useState(null)`
- [ ] **4e.** On component mount (and when `activeTab` switches to `'leaderboard'`), fetch and sync:

```js
useEffect(() => {
  if (activeTab !== 'leaderboard') return;

  const loadLeaderboard = async () => {
    setLeaderboardLoading(true);
    setLeaderboardError(null);

    // First: ensure our own XP is up to date in the cache
    await syncUserXPToCache({ workoutLogs, splits, user });

    // Then: fetch the full leaderboard
    const data = await fetchLeaderboard();
    if (data.length === 0) {
      setLeaderboardError('Could not load leaderboard. Check your connection.');
    } else {
      setLeaderboardData(data);
    }
    setLeaderboardLoading(false);
  };

  loadLeaderboard();
}, [activeTab]); // only re-run when tab switches to leaderboard
```

- [ ] **4f.** Replace the `fullLeaderboard` useMemo that merges `MOCK_LEADERBOARD` with the real user. New `fullLeaderboard`:

```js
const fullLeaderboard = useMemo(() => {
  if (leaderboardLoading || leaderboardData.length === 0) {
    // While loading or empty, show just the current user's data so the page isn't blank
    const meEntry = {
      id: user?.id || 'me',
      name: 'You',
      isMe: true,
      totalXP: overall.totalXP,
      tier: overall.name,
      initials: (user?.name || 'ME').slice(0, 2).toUpperCase(),
      color: '#FFB59B',
      muscleXP: muscleXP,
    };
    return [{ ...meEntry, rank: 1 }];
  }

  // Map leaderboard data: mark the current user, merge with their live muscleXP
  const list = leaderboardData.map(player => ({
    ...player,
    isMe: player.id === user?.id,
    // For the current user, always use live computed XP (not the cached snapshot)
    muscleXP: player.id === user?.id ? muscleXP : player.muscleXP,
    totalXP: player.id === user?.id ? overall.totalXP : player.totalXP,
    tier: player.id === user?.id ? overall.name : player.tier,
    name: player.id === user?.id ? 'You' : player.name,
  }));

  // Sort by totalXP desc and assign rank
  return list
    .sort((a, b) => b.totalXP - a.totalXP)
    .map((p, i) => ({ ...p, rank: i + 1 }));
}, [leaderboardData, leaderboardLoading, overall, muscleXP, user]);
```

- [ ] **4g.** Remove the `import { MOCK_LEADERBOARD } from '../../data/leaderboardData'` line. The mock data is no longer used.

- [ ] **4h.** Handle the loading state in the Leaderboard tab JSX. Show skeleton rows while `leaderboardLoading` is true:

```jsx
{activeTab === 'leaderboard' && leaderboardLoading && (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
    {[1, 2, 3, 4, 5].map(i => (
      <div key={i} style={{
        height: 72, borderRadius: 16,
        background: 'var(--surface-container-low)',
        animation: 'shimmer 1.5s ease-in-out infinite',
      }} />
    ))}
  </div>
)}
```

- [ ] **4i.** Handle the error state:

```jsx
{activeTab === 'leaderboard' && leaderboardError && !leaderboardLoading && (
  <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--on-surface-variant)', fontSize: 13 }}>
    <p style={{ marginBottom: 16 }}>{leaderboardError}</p>
    <button className="btn-g" onClick={() => { setLeaderboardError(null); setLeaderboardLoading(true); loadLeaderboard(); }}>
      Retry
    </button>
  </div>
)}
```

- [ ] **4j.** Add a small "Last updated" timestamp below the ranked list. Use `updated_at` from the current user's row in `leaderboardData`:

```jsx
{!leaderboardLoading && leaderboardData.length > 0 && (
  <div style={{ textAlign: 'center', fontSize: 10, color: 'var(--on-surface-dim)', marginTop: 16, paddingBottom: 20 }}>
    Leaderboard updated · Tap a player to view their muscle breakdown
  </div>
)}
```

---

### TASK 5 — Tier Color by XP (for real users)

The mock leaderboard had hardcoded `color` fields (gold, silver). For real users, the color should be computed from their `tier_name`:

- [ ] **5a.** Create a `getTierColor(tierName)` helper in `muscleData.js` or inline in `MuscleMapPage.jsx`:

```js
const TIER_COLORS = {
  'Untrained': '#6E6E76',
  'Bronze I': '#CD7F32', 'Bronze II': '#CD7F32', 'Bronze III': '#CD7F32',
  'Silver I': '#C0C0C0', 'Silver II': '#C0C0C0', 'Silver III': '#C0C0C0',
  'Gold I': '#FFD700', 'Gold II': '#FFD700', 'Gold III': '#FFD700',
  'Platinum': '#E5E4E2',
  'Diamond': '#B9F2FF',
  'Master': '#FF6B9D',
  'Legend': '#FFB59B',
};
const getTierColor = (tierName) => TIER_COLORS[tierName] || '#FFB59B';
```

- [ ] **5b.** In the `fullLeaderboard` useMemo, set `color: getTierColor(player.tier)` for all players

---

### TASK 6 — Real-Time Leaderboard Refresh via Supabase Realtime

For the competitive experience: when another user finishes a workout and their XP updates in `monthly_xp_cache`, the leaderboard should refresh automatically for users who are currently viewing it.

- [ ] **6a.** In `MuscleMapPage.jsx`, when `activeTab === 'leaderboard'`, subscribe to Supabase realtime on `monthly_xp_cache`:

```js
useEffect(() => {
  if (activeTab !== 'leaderboard') return;

  const channel = supabase
    .channel('leaderboard-updates')
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'monthly_xp_cache',
    }, () => {
      // Another user updated — refresh after 2 seconds (debounce multiple rapid updates)
      const timer = setTimeout(() => loadLeaderboard(), 2000);
      return () => clearTimeout(timer);
    })
    .on('postgres_changes', {
      event: 'UPDATE',
      schema: 'public',
      table: 'monthly_xp_cache',
    }, () => {
      setTimeout(() => loadLeaderboard(), 2000);
    })
    .subscribe();

  return () => supabase.removeChannel(channel);
}, [activeTab]);
```

- [ ] **6b.** Add an RLS policy to `monthly_xp_cache` that allows realtime subscriptions for authenticated users (Supabase requires enabling realtime on the table in the Dashboard):
  - Supabase Dashboard → Database → Replication → enable `monthly_xp_cache` for realtime

---

### TASK 7 — Backfill: Sync On Login

To backfill XP for users who have workout history but no cache entry yet:

- [ ] **7a.** In `AppContext.jsx`, in `loadCloudData()` (or at the end of `fetchProfile()`), call `syncUserXPToCache` once after the initial cloud data load:

```js
// After loadCloudData completes and workoutLogs are populated:
if (user?.id && workoutLogs.length > 0) {
  // Delay slightly to avoid racing with state updates
  setTimeout(() => {
    syncUserXPToCache({ workoutLogs, splits, user }).catch(console.warn);
  }, 2000);
}
```

- [ ] **7b.** This means every login automatically updates the cache with the user's current XP. Silent, non-blocking.

---

### TASK 8 — Remove / Retire `leaderboardData.js`

- [ ] **8a.** Remove `import { MOCK_LEADERBOARD } from '../../data/leaderboardData'` from `MuscleMapPage.jsx`
- [ ] **8b.** Do NOT delete `leaderboardData.js` immediately — keep it as a fallback for offline mode. Add a comment: `// Deprecated — used only as offline fallback if Supabase fetch fails`
- [ ] **8c.** Optional: in `fetchLeaderboard()`, if the Supabase fetch returns an empty array (no connected users in the cache yet), fall back to `MOCK_LEADERBOARD` to avoid a completely empty leaderboard during early app usage. Mark mock entries with `isMock: true` so they render slightly differently (no click → no modal).

---

### TASK 9 — PlayerDetailModal for Real Users

The `PlayerDetailModal` shows `BodyMapSVG` with `muscleXP`. For real users now in the leaderboard, their `muscleXP` comes from the cache table (per-muscle breakdown stored in the row).

- [ ] **9a.** Verify `PlayerDetailModal` renders correctly when `player.muscleXP` comes from the cache (integer XP values, possibly 0 for untrained muscles). No changes needed if the modal already handles 0-XP muscles gracefully (renders them as unlit in the body map).
- [ ] **9b.** For the current user's modal, `player` is set to `null` and `realMuscleXP` is passed — this path already uses live computed data. No changes.
- [ ] **9c.** Add the user's `display_name` (not just initials) to the modal header. The `leaderboardData` row has `display_name` — ensure it flows through to the modal's `player.name` field.

---

## ✅ Feature 3 Checklist

### Supabase
- [ ] `monthly_xp_cache` table created and verified in Dashboard
- [ ] RLS: authenticated SELECT all; INSERT/UPDATE own rows only
- [ ] Realtime replication enabled on `monthly_xp_cache` in Supabase Dashboard

### Backend / Utils
- [ ] `xpCacheSync.js` created with `syncUserXPToCache`, `fetchLeaderboard`, `getCurrentMonth`
- [ ] `getTierColor(tierName)` helper added
- [ ] MOCK_LEADERBOARD retired as primary data source

### WorkoutPage.jsx
- [ ] `syncUserXPToCache` called after `finish()` writes the new log

### MuscleMapPage.jsx
- [ ] `leaderboardData`, `leaderboardLoading`, `leaderboardError` state added
- [ ] `loadLeaderboard()` fetches real data on tab mount
- [ ] `fullLeaderboard` useMemo rebuilt from real data + current user live merge
- [ ] Loading skeleton shows while fetching
- [ ] Error state with Retry button
- [ ] Realtime subscription refreshes on INSERT/UPDATE to `monthly_xp_cache`

### AppContext.jsx
- [ ] `syncUserXPToCache` called (delayed) on login/load when workout logs exist

### QA
- [ ] User A finishes workout → opens Olympus League → their XP shows ✓
- [ ] User B (Jigyasa) finishes workout on her phone → User A re-opens Olympus → both show real XP ✓
- [ ] User with 0 workouts this month → appears on leaderboard with 0 XP or is excluded (exclude if totalXP === 0 to avoid cluttering the board with inactive users) → Decide: **exclude users with 0 XP** from the leaderboard list. The current user is always shown even with 0 XP.
- [ ] Offline: `fetchLeaderboard` returns empty → fallback to MOCK_LEADERBOARD, labeled as mock ✓
- [ ] Realtime: User B finishes workout → User A's open Olympus tab auto-refreshes within ~4 seconds ✓
- [ ] PlayerDetailModal for a real user shows their actual muscle breakdown ✓
- [ ] `syncUserXPToCache` on login: verify Supabase shows a row for this user + this month after first login ✓

---

---

# FEATURE 4 — Universal Exercise Swap ✅ COMPLETED

## 🎯 Goal

The swap exercise button was previously only available for exercises explicitly listed in the `EXERCISE_ALTERNATIVES` map (~20 exercises). Many entries had **empty arrays** (`[]`), and exercises not in the map had no swap button at all. Users opening the swap modal saw "No swap options available" for Lateral Raises, Leg Extension, Calves, Incline Bench Curls, Preacher Curls, and most bodyweight exercises.

**Fix:** Expand the alternatives database to cover every exercise across all splits with scientifically relevant swap options based on:
1. **Same primary muscle group** (chest → chest, back → back)
2. **Same movement pattern** (horizontal push → horizontal push, vertical pull → vertical pull, hinge → hinge)
3. **Similar difficulty / equipment category** (compound ↔ compound, machine ↔ cable, bodyweight ↔ bodyweight)

---

## 🏋️ Research Basis

Exercise substitutions follow established kinesiology principles (NASM, NSCA, Examine.com):

| Movement Pattern | Examples | Swap Logic |
|-----------------|----------|------------|
| Horizontal Push | Bench Press, DB Press, Machine Press | Same joint action (shoulder flexion + elbow extension), targets pec major |
| Vertical Pull | Lat Pulldown, Pull-ups, Chin-ups | Same joint action (shoulder adduction + elbow flexion), targets lats |
| Horizontal Pull | Rows (cable, barbell, dumbbell, T-bar) | Same scapular retraction pattern, targets mid-back |
| Squat Pattern | Back Squat, Front Squat, Leg Press, Hack Squat | Knee-dominant compound, targets quads/glutes |
| Hinge Pattern | RDL, Deadlift, Good Mornings | Hip-dominant compound, targets hamstrings/glutes |
| Unilateral Legs | Lunges, Bulgarian Split Squat, Step-ups | Single-leg balance + quad/glute loading |
| Isolation | Same muscle isolation swaps (curl ↔ curl, extension ↔ extension) | Same muscle, different angle/grip |

---

## ✅ Changes Applied (2026-04-17)

### File: `src/components/pages/WorkoutPage.jsx`

**1. `EXERCISE_ALTERNATIVES` expanded from ~20 to 100+ entries:**

Every exercise across all splits (`ppl`, `ul4`, `fb3`, `ula`, `ul6`, `home`) now has 2–4 scientifically relevant alternatives. Organized by muscle group:

| Muscle Group | Exercises Covered | Example Swaps |
|-------------|-------------------|---------------|
| **Chest** | 11 entries | Flat DB Press → Flat BB Press, Machine Press, DB Floor Press |
| **Back (Vertical)** | 6 entries | Wide Grip Lat PD → Close Grip PD, Pull-ups, Straight-Arm PD |
| **Back (Horizontal)** | 11 entries | T-Bar Rows → Seated Cable Row, Barbell Row, Chest-Supported Row |
| **Back (Deadlift)** | 2 entries | Conventional DL → Trap Bar DL, Block Pull, Sumo DL |
| **Shoulders (Compound)** | 5 entries | OHP → DB Shoulder Press, Machine Press, Arnold Press |
| **Shoulders (Lateral)** | 3 entries | Lateral Raises → Cable Lateral, Machine Lateral, Seated DB Lateral |
| **Shoulders (Rear)** | 3 entries | Rear Delt Flyes → Face Pulls, Cable Reverse Fly, Band Pull-Apart |
| **Biceps** | 12 entries | Preacher Curls → Spider Curls, Concentration Curls, Machine Preacher |
| **Triceps** | 10 entries | Overhead Extension → Skull Crushers, Rope Pushdowns |
| **Quads (Squat)** | 11 entries | Squats → Smith Machine, Leg Press, Hack Squats, Goblet |
| **Quads (Unilateral)** | 5 entries | Walking Lunges → Bulgarian Split Squat, Step-Ups, Reverse Lunges |
| **Quads (Isolation)** | 1 entry | Leg Extension → Sissy Squats, Wall Sits |
| **Hamstrings** | 6 entries | Leg Curls → Seated, Lying, Nordic Hamstring Curls |
| **Glutes** | 5 entries | Hip Thrust → Glute Bridge, Cable Pull-Through |
| **Calves** | 4 entries | Standing Calf → Seated, Smith Machine, Leg Press Calf |
| **Core** | 4 entries | Plank → Dead Bug, Hollow Hold, Ab Wheel |
| **Bodyweight** | 5 entries | Push-ups → Diamond, Decline, Wide Push-ups |

**2. Swap button visibility expanded:**

Changed the rendering condition from:
```js
// OLD: Only exercises explicitly in the map got the button
{(EXERCISE_ALTERNATIVES[ex.name] !== undefined && !ex.variants) && ( ... )}
```
to:
```js
// NEW: All exercises get the swap button (unless they have a variants dropdown)
{!ex.variants && ( ... )}
```

This ensures **every exercise in every split** shows the swap button. Exercises with the `variants` property (e.g., Leg Curls → Seated/Lying dropdown, Leg Press → Leg Press/Pendulum Squats) continue to use their dedicated dropdown instead.

**3. Duplicate key fix:**

Removed duplicate `'Incline Smith Machine Press'` that appeared in both CHEST and SHOULDERS sections.

---

## ✅ Feature 4 Checklist

- [x] `EXERCISE_ALTERNATIVES` expanded from ~20 to 100+ entries
- [x] Zero exercises with empty `[]` alternatives remaining
- [x] Swap button shows for ALL exercises (not just mapped ones)
- [x] Alternatives are scientifically relevant (same muscle + movement pattern)
- [x] Both singular and plural exercise name variants covered (e.g., `'Hammer Curls'` and `'Hammer Curl'`)
- [x] Build passes with no errors
- [x] Existing `variants` dropdown still works (not broken by swap expansion)

---

---

# 📋 Gaps Identified in Feature 2

> [!NOTE]
> The TODO describes `fb3`, `ula`, and `ul6` as needing to be created, but **all three already exist** in `splits.js`:
> - `fb3` (Full Body 3 Day) — exists at line 74, 3 full body days + rest days ✓
> - `ula` (Upper Lower + Arms) — exists at line 87, includes Arms Day ✓
> - `ul6` (Upper Lower 6 Day) — exists at line 100, 6 training days ✓
>
> **What still needs to be done for Feature 2:**
> - Add `tier` field to all existing split objects
> - Add `isRecommended` flag
> - Add `tierDescription` to each split
> - Create `fb6` (Full Body 6-Day Advanced) — this is the only **new** split
> - Build the Tier Selector UI in `SplitsPage.jsx`
> - Add `subtype` badges to workout day cards
>
> The TODO also references `hw` as the Home Workout ID, but the actual codebase uses `home`. Keep `home`.

---

---

# Priority Order & File Change Summary

## Priority Order

| # | Feature | Priority | Effort | Impact | Status |
|---|---------|----------|--------|--------|--------|
| 0 | **Universal Exercise Swap (F4)** | 🟢 Done | Small | Medium — improves workout UX | ✅ Completed |
| 1 | **Olympus XP Fix (F3)** | 🔴 Critical — breaks core social feature | Medium | High — every user affected | ⬜ Pending |
| 2 | **Split Tier Reorganisation (F2)** | 🟠 High — UX improvement + new split | Medium | High — improves onboarding | ⬜ Pending |
| 3 | **Smart Diet Adjustment (F1)** | 🟡 Medium — powerful but complex | Large | High — key retention driver | ⬜ Pending |

**Recommended implementation order: F4 ✅ → F3 → F2 → F1**

F4 is shipped. F3 is a bug that actively undermines trust in the social feature. Fix it next. F2 is additive and relatively contained (note: `fb3`, `ula`, `ul6` already exist — only `fb6` + tier UI needed). F1 is the most architecturally complex (new utility, new state, new component, new migration).

---

## Files to Create or Modify

| File | Status | Feature |
|------|--------|---------|
| `src/components/pages/WorkoutPage.jsx` | ✅ MODIFIED — expanded `EXERCISE_ALTERNATIVES` + universal swap button | F4 (done) |
| `supabase/migrations/20260417_monthly_xp_cache.sql` | 🆕 NEW | F3 |
| `supabase/migrations/20260417_adaptive_diet.sql` | 🆕 NEW | F1 |
| `src/utils/xpCacheSync.js` | 🆕 NEW | F3 |
| `src/utils/adaptiveCalories.js` | 🆕 NEW | F1 |
| `src/components/shared/AdaptiveDietBanner.jsx` | 🆕 NEW | F1 |
| `src/data/splits.js` | ✏️ MODIFY — add `fb6` split + tier metadata to all | F2 |
| `src/data/leaderboardData.js` | ✏️ MODIFY — demote to fallback | F3 |
| `src/data/muscleData.js` | ✏️ MODIFY — add `getTierColor` helper | F3 |
| `src/context/AppContext.jsx` | ✏️ MODIFY — adaptive suggestion state + XP backfill | F1 + F3 |
| `src/components/pages/MuscleMapPage.jsx` | ✏️ MODIFY — real leaderboard fetch + realtime | F3 |
| `src/components/pages/SplitsPage.jsx` | ✏️ MODIFY — tier selector UI | F2 |
| `src/components/pages/DietPage.jsx` | ✏️ MODIFY — AdaptiveDietBanner + customGoalKcal resolve | F1 |
| `src/components/pages/DashboardPage.jsx` | ✏️ MODIFY — compact banner + insufficient data nudge | F1 |

**Files NOT touched:** `index.css`, `Layout.jsx`, `App.jsx`, `AuthModal.jsx`, `SharedComponents.jsx` (unless AdaptiveDietBanner uses existing shared styles — it does, via `glass-card` and CSS variable tokens)