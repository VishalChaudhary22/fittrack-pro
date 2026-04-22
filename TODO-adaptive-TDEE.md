# FitTrack Pro — Adaptive TDEE Engine [COMPLETED]

> **Created:** 2026-04-22
> **Completed:** 2026-04-22
> **Depends on:** `adaptiveCalories.js` (existing), `calculations.js`, `food_logs`, `health_logs`
> **Related:** `TODO-indian-food-db.md`, `State.md` (Adaptive Coaching Engine Refinements 2026-04-22)

---

## ✅ FINAL STATUS: IMPLEMENTED & STABILIZED
All core estimation logic, priority cascades, safety debouncing, and high-fidelity Kinetic Elite UI components have been successfully integrated. 

### Recent Critical Fixes (Post-Implementation):
- **`DietPage.jsx` Resolution**: Fixed missing `calcTDEE` import crashing the page.
- **`AppContext.jsx` Stability**: Added `try/catch` guards to the 2s debounced recompute and recommendation memos.
- **Redesign**: Overhauled Metabolic Index card on Dashboard to meet premium non-generic design standards (no emojis, ember-glow accents).
- **Profile Fix**: Corrected `ScrollPicker` modal usage.

---

## 🧭 Overview & Motivation

The current TDEE displayed throughout the app is **static** — it is calculated once from the Mifflin-St Jeor formula using the user's age, height, weight, and a fixed activity multiplier. This value is then frozen into the macro ring targets on DietPage, the TDEE chip on the stats strip, and the deficit calculation.

**The problem:** Static TDEE is structurally wrong for most users over time.

| Scenario | Static TDEE behaviour | Real-world consequence |
|---|---|---|
| User loses 5 kg over 8 weeks | TDEE never updates | App still suggests 2100 kcal/day; actual maintenance is now ~2000; progress stalls |
| Metabolic adaptation during prolonged cut | TDEE unmeasured | User eats at a calculated 500 kcal deficit but is actually at 150 kcal — plateaus for weeks with no explanation |
| Sedentary desk worker who logged "Moderately Active" during signup | Static multiplier (1.55) never questioned | App overcounts TDEE by 200–300 kcal, causing zero weight loss despite user following the plan |
| User starts going to the gym for the first time | Activity multiplier not re-evaluated | Macro targets still based on old sedentary baseline |

**The solution:** Continuously estimate TDEE from **observed data** (actual weight change + actual logged calories) and surface that estimate alongside the static value. When the two diverge meaningfully, raise an insight and optionally update the working TDEE.

This is categorically different from `adaptiveCalories.js`, which adjusts calorie *targets* reactively. The Adaptive TDEE engine is about estimating the user's *actual metabolic rate* empirically — the input to the calorie adjustment system, not the output.

---

## 🔬 Core Science

### The Reverse-Engineering Formula

If a user eats a known average intake over N days and their weight changes by ΔW kg, their actual TDEE can be estimated:

```
Estimated TDEE = Avg Daily Intake − (ΔW × 7700 / N)
```

Where:
- `Avg Daily Intake` = mean of all logged calorie totals over the window (days with ≥1 food log entry)
- `ΔW` = weight at end of window − weight at start of window (negative = loss, positive = gain)
- `7700` = kcal per kg of body mass change (standard approximation; accounts for ~90% fat + glycogen/water component)
- `N` = number of days in the window

**Example:**
- User logs avg 1,850 kcal/day over 14 days
- Weight goes from 82.0 kg → 81.2 kg (ΔW = −0.8 kg)
- Estimated deficit = 0.8 × 7700 / 14 = **440 kcal/day**
- Estimated TDEE = 1,850 + 440 = **2,290 kcal/day**
- App's static TDEE (Mifflin-St Jeor, sedentary) = 2,050 kcal/day
- **Insight: Real activity level is higher than logged. TDEE underestimated by 240 kcal.**

### Confidence Scoring

The estimate is only as reliable as the underlying data. Confidence is computed from:

| Factor | High confidence | Low confidence |
|---|---|---|
| Days with food logged in window | ≥10 of 14 days | <6 of 14 days |
| Number of weight entries in window | ≥3 entries | 1 entry (just endpoints) |
| Calorie variance | Low day-to-day swing (< ±400 kcal) | High variance (cheat days, irregular meals) |
| Weight noise | Smooth trend | Erratic (water retention spikes) |
| Window length | 14–28 days | < 10 days |

Confidence output: `'high'` / `'medium'` / `'low'` / `'insufficient'`.

Only `'high'` and `'medium'` estimates are shown to the user or fed into the adaptive system.

### Metabolic Adaptation Detection

When a user has been in a deficit for **6+ consecutive weeks**, TDEE can drop below what body composition math would predict. The engine flags this as **metabolic adaptation** when:

```
Observed TDEE < Static TDEE × 0.90
AND  avg_weekly_loss < expected_loss_at_logged_deficit × 0.60
AND  deficit_weeks >= 6
```

This is a separate insight from normal TDEE drift — it surfaces a different recommendation (diet break, refeed, or calorie cycling rather than a further cut).

---

## 📐 Calculation Windows

Three rolling windows are maintained simultaneously to give short-term, medium-term, and trend views:

| Window | Days | Use |
|---|---|---|
| `short` | 7 | Highly reactive; noisy but current. Only shown as context, never used to auto-update targets. |
| `medium` | 14 | Primary working estimate. Used for TDEE comparisons and insight triggers. |
| `long` | 28 | Trend direction only — confirms whether TDEE is drifting up or down over a month. |

The working estimate displayed to the user is always from the **14-day window**. The 7-day and 28-day windows are used internally for trend confirmation.

---

## 🗂️ Files To Create / Modify

| File | Action | Purpose |
|---|:---:|---|
| `src/utils/adaptiveTDEE.js` | 🆕 NEW | Core engine: estimation, confidence scoring, metabolic adaptation detection, insight generation |
| `src/utils/adaptiveCalories.js` | ✏️ MODIFY | Feed `estimatedTDEE` into the calorie adjustment engine as the primary TDEE source when confidence ≥ `medium` |
| `src/context/AppContext.jsx` | ✏️ MODIFY | Expose `tdeeEstimate` object via context; persist to `fittrack_tdeeEstimate_<userId>` in localStorage |
| `src/components/pages/DietPage.jsx` | ✏️ MODIFY | Show estimated vs static TDEE chip on the stats strip; show TDEE insight card when divergence is significant |
| `src/components/pages/DashboardPage.jsx` | ✏️ MODIFY | Update the "Metabolic Index" card to show estimated TDEE when available; show TDEE drift insight banner |
| `src/components/pages/ProfilePage.jsx` | ✏️ MODIFY | Add "Estimated TDEE" row in Metabolic Cards section; show confidence badge; manual override option |
| `src/utils/calculations.js` | ✏️ MODIFY | Export a `calcTDEESource(profile, tdeeEstimate)` helper that returns the best available TDEE — estimated if confidence ≥ `medium`, static otherwise |

---

## 🔧 Phase 1 — Core Engine (`adaptiveTDEE.js`)

### Data Inputs

```js
/**
 * @param {Object[]} weightLogs   - from AppContext healthLogs, shape: { date: 'YYYY-MM-DD', weight: number }
 * @param {Object[]} foodLogs     - from AppContext foodLog, shape: { date: 'YYYY-MM-DD', macros: { calories } }
 * @param {Object}   profile      - user profile with age, height, weight, activityLevel, gender
 * @param {string}   windowType   - 'short' | 'medium' | 'long'
 */
```

### Primary Exports

```js
// Returns the full estimate object for the specified window
estimateTDEE(weightLogs, foodLogs, profile, windowType = 'medium')
→ {
    windowDays: 14,
    windowStart: 'YYYY-MM-DD',
    windowEnd: 'YYYY-MM-DD',
    avgDailyIntake: 1850,        // kcal — mean of logged days only
    weightDelta: -0.8,           // kg — positive = gain
    estimatedTDEE: 2290,         // kcal/day
    staticTDEE: 2050,            // from calcTDEE(profile)
    delta: 240,                  // estimatedTDEE - staticTDEE
    deltaPercent: 11.7,          // %
    confidence: 'high',          // 'high' | 'medium' | 'low' | 'insufficient'
    loggedDays: 12,              // days with ≥1 food log in window
    weightEntries: 4,
    calorieVarianceKcal: 180,    // std dev of daily intake
    insights: [],                // array of insight objects (see §Insights below)
    metabolicAdaptation: false,  // boolean
    deficitWeeks: 0,             // consecutive weeks in deficit
    updatedAt: 'ISO timestamp'
  }

// Convenience: returns the best TDEE to use for target-setting
getBestTDEE(weightLogs, foodLogs, profile)
→ { value: 2290, source: 'estimated', confidence: 'high' }
  or
→ { value: 2050, source: 'static', confidence: null }  // fallback when data insufficient

// Checks if metabolic adaptation criteria are met
detectMetabolicAdaptation(estimateHistory, profile)
→ { detected: boolean, deficitWeeks: number, adaptationPercent: number }
```

### Confidence Scoring Rules (Detailed)

```js
function scoreConfidence({ loggedDays, weightEntries, calorieVarianceKcal, windowDays }) {
  let score = 0

  // Logged days coverage (max 40 pts)
  const coverageRatio = loggedDays / windowDays
  if (coverageRatio >= 0.85) score += 40
  else if (coverageRatio >= 0.65) score += 25
  else if (coverageRatio >= 0.45) score += 10
  // else 0

  // Weight entries in window (max 30 pts)
  if (weightEntries >= 4) score += 30
  else if (weightEntries >= 2) score += 20
  else if (weightEntries === 1) score += 0  // only endpoints = unreliable
  // else: no weight data = return 'insufficient' early before reaching here

  // Calorie variance (max 30 pts)
  if (calorieVarianceKcal < 200) score += 30
  else if (calorieVarianceKcal < 400) score += 20
  else if (calorieVarianceKcal < 600) score += 10
  // else 0

  if (score >= 80) return 'high'
  if (score >= 50) return 'medium'
  if (score >= 25) return 'low'
  return 'insufficient'
}
```

**Hard gates** — always return `'insufficient'` if:
- `weightEntries < 2` in the window (can't compute ΔW)
- `loggedDays < 4` in the window
- Window spans fewer than 7 days

### Edge Cases to Handle

| Edge case | Handling |
|---|---|
| Weight spike (e.g. +1.2 kg in 2 days mid-window) | Use linear regression on all weight entries rather than just start/end points to smooth noise |
| All weight entries on the same day | Return `'insufficient'` — no trend data |
| Zero food logs in window | Return `'insufficient'` — no intake data |
| User is bulking (intentional surplus) | Engine still works — estimatedTDEE will be below avg intake; delta is still useful |
| User skips logging on "bad" days (selection bias) | Document known limitation in `notes` field; low-calorie variance days will have lower `calorieVarianceKcal` — but coverage penalty will reduce confidence correctly |
| Large weight drop in first few days (water/glycogen) | 28-day window detects if trend normalizes; short-window estimate should not be auto-applied to targets |
| `ΔW / N` would imply TDEE < 800 kcal (physiologically impossible) | Clamp estimated TDEE to `max(800, estimated)` and downgrade confidence to `'low'` with `notes: 'physiological floor applied'` |
| `ΔW / N` would imply TDEE > 6000 kcal | Clamp to `min(6000, estimated)` and downgrade confidence similarly |

---

## 🔧 Phase 2 — Context Integration

### `AppContext.jsx` Changes

1. **Compute on load**: After `loadCloudData` completes and both `foodLog` and `healthLogs` are populated, call `getBestTDEE(healthLogs, foodLog, profile)` and store in state:

```js
const [tdeeEstimate, setTdeeEstimate] = useState(null)
// shape: { value, source, confidence, estimatedTDEE, staticTDEE, delta, deltaPercent, insights, metabolicAdaptation }
```

2. **Recompute triggers**: Re-run the estimate when:
   - `foodLog` changes (new meal logged)
   - `healthLogs` changes (new weight entry)
   - `profile` changes (weight/height/activity update)

3. **Debounce**: Wrap recompute in a 2-second debounce — estimate is expensive and doesn't need to run on every individual food entry within a meal.

4. **Persistence**: Persist the last estimate to `fittrack_tdeeEstimate_<userId>` in localStorage. On boot, load from cache immediately (so the UI shows something before async cloud data loads). Invalidate if cache is > 24 hours old.

5. **Expose via context**: Add `tdeeEstimate` to the context value. All pages read it; none compute it themselves.

---

## 🔧 Phase 3 — `adaptiveCalories.js` Integration

Currently, `adaptiveCalories.js` scenarios (S1, S2, S2b, S3, etc.) use the static `profile.tdee` or a `calcTDEE(profile)` call as the baseline. This phase threads the estimated TDEE into the engine.

### Change: Use `getBestTDEE` as the Baseline

```js
// Before (current)
const tdee = calcTDEE(profile)

// After
const { value: tdee, source: tdeeSource } = getBestTDEE(weightLogs, foodLogs, profile)
// tdeeSource: 'estimated' | 'static'
```

### New Scenario: `S5` — TDEE Meaningfully Higher Than Static

Fires when `estimatedTDEE - staticTDEE > 250 kcal` and `confidence === 'high'`:

```
Scenario S5: "Your real calorie burn is higher than estimated"
Trigger: estimatedTDEE > staticTDEE + 250, confidence: 'high'
Action:  +150 kcal to daily target (conservative — do not jump to full delta at once)
Message: "Your logged data shows you're burning ~{delta} kcal more than your calculated target.
          Increasing your daily target by 150 kcal. Eat more to keep fuelling your progress."
```

### New Scenario: `S6` — TDEE Meaningfully Lower Than Static

Fires when `staticTDEE - estimatedTDEE > 250 kcal` and `confidence === 'high'`:

```
Scenario S6: "Your activity level may be lower than selected"
Trigger: estimatedTDEE < staticTDEE - 250, confidence: 'high'
Action:  −100 kcal to daily target (gentle — avoid triggering low-calorie anxiety)
Message: "Your weight data suggests your actual calorie burn is ~{delta} kcal below the estimate.
          Nudging your target down slightly."
```

### New Scenario: `S7` — Metabolic Adaptation Detected

```
Scenario S7: "Signs of metabolic adaptation"
Trigger: detectMetabolicAdaptation(...).detected === true
Action:  No calorie cut. Instead: recommend a 1–2 week diet break at maintenance.
Message: "You've been in a deficit for {deficitWeeks} weeks and your estimated TDEE has
          dropped by ~{adaptationPercent}%. This is metabolic adaptation — your body is
          getting efficient. A short diet break at maintenance ({maintenanceKcal} kcal)
          can reset this and make your next cut more effective."
```

### Adjustment Caps (Existing rule — still applies)

All adjustments from S5/S6/S7 are capped at ±200 kcal per suggestion cycle, same as S1–S4.

---

## 🔧 Phase 4 — UI Integration

### 4a. DietPage — Stats Strip Update

The current stats strip shows 5 chips: `Weight · Height · BMI · TDEE · Activity`.

**Change the TDEE chip:**

```
// When tdeeEstimate is available and confidence >= 'medium':
TDEE: 2,290 kcal ↑               ← estimated TDEE, with up/down arrow vs static
     └── small subscript: "Est. from data · ●●○ Medium"

// When confidence is 'low' or 'insufficient':
TDEE: 2,050 kcal                  ← static only, no annotation (avoid noise)
```

Tapping the chip opens a bottom sheet (see `TDEEDetailSheet` below).

### 4b. DietPage — TDEE Insight Card

A new card between the Goal Card and the Tab Switcher, shown only when `tdeeEstimate.confidence >= 'medium'` and `Math.abs(tdeeEstimate.deltaPercent) >= 8`:

```
┌──────────────────────────────────────────────────────┐
│  ⚡ Your real TDEE may be higher than expected        │
│                                                       │
│  Calculated:  2,050 kcal  (Mifflin formula)          │
│  From data:   2,290 kcal  (14-day estimate ●●● High)  │
│  Difference:  +240 kcal/day                           │
│                                                       │
│  [Update my targets]          [Learn more]           │
└──────────────────────────────────────────────────────┘
```

- `[Update my targets]` — applies `estimatedTDEE` as the new working TDEE and recalculates macro rings. Stores `useEstimatedTDEE: true` in profile preferences.
- `[Learn more]` — opens `TDEEDetailSheet` (see below).
- Card dismisses for 7 days if the user taps the `×` close. Uses same dismiss logic as `AdaptiveDietBanner.jsx` (localStorage key `fittrack_tdee_insight_dismissed_at`).
- Show one card maximum — do not stack TDEE insight + `AdaptiveDietBanner` at the same time; TDEE insight takes precedence if both would fire.

### 4c. DashboardPage — Metabolic Index Card Update

Currently shows BMI + BF% badge. Add an **Estimated TDEE row** below the BMI ring:

```
TDEE
Calculated:  2,050 kcal
Estimated:   2,290 kcal  ↑ +240  [●●● High confidence]
```

When `tdeeEstimate` is not available or `'insufficient'`: show only the static value as today.

Metabolic adaptation warning: if `S7` fires, add a pulsing `PulseIndicator` dot next to the estimated TDEE value with tooltip: `"Possible metabolic adaptation — see Diet page"`.

### 4d. ProfilePage — Metabolic Cards Section

Add a new **"Adaptive TDEE"** card below the existing BMR/TDEE cards:

```
┌──────────────────────────────────────────────────────────┐
│  ⚡ Estimated TDEE (from your logged data)                │
│                                                           │
│  2,290 kcal/day                                           │
│  Based on 14 days · 12 logged days · 4 weight entries     │
│  Confidence: ●●● High                                     │
│                                                           │
│  vs. calculated: 2,050 kcal  (+240 kcal / +11.7%)        │
│                                                           │
│  Possible reason: Activity level logged as "Sedentary"   │
│  but data suggests "Lightly Active" or above.            │
│                                                           │
│  [Use this as my target TDEE]    [Override manually]     │
└──────────────────────────────────────────────────────────┘
```

When `'insufficient'`: show a prompt instead:
```
Log your food and weight consistently for 10+ days to unlock
your personalised TDEE estimate.
```

**Manual Override**: `[Override manually]` opens a `ScrollPicker` for custom TDEE (1,200–5,000 kcal in 50 kcal steps). Stored as `manualTDEEOverride` in profile. When set, it overrides both static and estimated TDEE throughout the app. A `[Clear override]` button appears when active.

### 4e. `TDEEDetailSheet` Component

A new bottom sheet opened from the DietPage TDEE chip and "Learn more" buttons. Content:

```
How your TDEE is estimated

Your app tracks two TDEE values:

1. Calculated TDEE
   Mifflin-St Jeor formula using your age, height,
   weight, and activity level. Starting point only.

2. Estimated TDEE (from your data)
   Reverse-engineered from your actual logged calories
   and weight changes. More accurate over time.

Data used (last 14 days):
  Avg daily intake:    1,850 kcal
  Weight change:       −0.8 kg
  Implied deficit:     440 kcal/day
  → Estimated TDEE:    2,290 kcal/day

Confidence: ●●● High
(12 of 14 days logged · 4 weight entries · low variance)

Why they differ:
  Your activity multiplier may be set too low. Consider
  updating it to "Lightly Active" in your profile.

[Update activity level]   [Close]
```

---

## 🔧 Phase 5 — Insights System

`estimateTDEE()` populates an `insights[]` array with structured objects. These drive the UI in Phase 4.

### Insight Shapes

```js
// Insight type definitions
{ type: 'tdee-higher-than-static',  delta: 240, deltaPercent: 11.7, confidence: 'high' }
{ type: 'tdee-lower-than-static',   delta: -180, deltaPercent: -8.8, confidence: 'medium' }
{ type: 'metabolic-adaptation',     deficitWeeks: 8, adaptationPercent: 12 }
{ type: 'activity-level-mismatch',  currentActivityLabel: 'Sedentary', suggestedLabel: 'Lightly Active' }
{ type: 'low-logging-coverage',     loggedDays: 5, windowDays: 14 }       // informational only
{ type: 'high-calorie-variance',    varianceKcal: 620 }                    // informational only
```

### Activity Level Mismatch Detection

When `estimatedTDEE > staticTDEE × 1.08`, try to infer which activity multiplier the estimated TDEE falls closest to:

| Multiplier | Label | Range |
|---|---|---|
| 1.2 | Sedentary | BMR × 1.15 – 1.25 |
| 1.375 | Lightly Active | BMR × 1.30 – 1.45 |
| 1.55 | Moderately Active | BMR × 1.48 – 1.62 |
| 1.725 | Very Active | BMR × 1.65 – 1.80 |
| 1.9 | Extra Active | BMR × 1.82+ |

If the estimated TDEE falls into a different bucket than the user's current `profile.activityLevel`, generate an `'activity-level-mismatch'` insight with the suggested label. This is purely informational — the app never auto-changes the activity level.

---

## 📊 Data Requirements & Minimum Viable Estimates

| Scenario | What you get |
|---|---|
| < 4 days logged food OR < 2 weight entries | `confidence: 'insufficient'` — nothing shown in UI |
| 4–6 days food + 2 weight entries, 7-day window | `confidence: 'low'` — shown only in ProfilePage detail card, not in DietPage strip |
| 7–10 days food + 2–3 weight entries, 14-day window | `confidence: 'medium'` — shown in DietPage chip and insight card |
| 10+ days food + 4+ weight entries, 14-day window | `confidence: 'high'` — shown everywhere, feeds into `adaptiveCalories.js` |

**Nudge for new users:** On DietPage, when `confidence === 'insufficient'`, show a small inline prompt below the stats strip:
> "📊 Log your food and weight for 10 days to unlock your personalised TDEE estimate."
This nudge disappears permanently once the first `'medium'` estimate is computed.

---

## 🗺️ Implementation Phases

### Phase A — Core Engine (No UI)
- [ ] Create `src/utils/adaptiveTDEE.js`
  - [ ] `estimateTDEE(weightLogs, foodLogs, profile, windowType)` — linear regression on weight, avg intake, TDEE reverse-engineering
  - [ ] `getBestTDEE(weightLogs, foodLogs, profile)` — returns `{ value, source, confidence }`
  - [ ] `scoreConfidence({ loggedDays, weightEntries, calorieVarianceKcal, windowDays })` — returns `'high' | 'medium' | 'low' | 'insufficient'`
  - [ ] `detectMetabolicAdaptation(estimateHistory, profile)` — 6-week deficit detection
  - [ ] `inferActivityLevelMismatch(estimatedTDEE, profile)` — bucket comparison
  - [ ] All edge case guards: floor/ceiling clamping, physiological impossibility check, insufficient data early returns
- [ ] Write unit tests (in `scripts/` or `__tests__/`) covering:
  - [ ] Standard weight loss scenario → correct TDEE estimate
  - [ ] Maintenance (ΔW ≈ 0) → estimated TDEE ≈ avg intake
  - [ ] Weight gain scenario → estimated TDEE < avg intake
  - [ ] Insufficient data → `'insufficient'` return
  - [ ] High variance → confidence downgrade
  - [ ] Metabolic adaptation trigger

### Phase B — Context Integration
- [ ] Add `tdeeEstimate` state to `AppContext.jsx`
- [ ] Compute on `loadCloudData` completion, debounced recompute on `foodLog`/`healthLogs`/`profile` changes
- [ ] Persist to/load from `fittrack_tdeeEstimate_<userId>` in localStorage (24h TTL invalidation)
- [ ] Expose `tdeeEstimate` in context value
- [ ] Update `calcTDEESource(profile, tdeeEstimate)` helper in `calculations.js` — returns best TDEE with source label

### Phase C — `adaptiveCalories.js` Integration
- [ ] Thread `getBestTDEE()` into scenario engine as baseline
- [ ] Implement `S5` scenario (TDEE higher than static)
- [ ] Implement `S6` scenario (TDEE lower than static)
- [ ] Implement `S7` scenario (metabolic adaptation — diet break recommendation)
- [ ] Verify `S5`/`S6`/`S7` respect existing ±200 kcal cap
- [ ] Verify `S7` never recommends a further calorie cut

### Phase D — DietPage UI
- [ ] Update TDEE chip in stats strip to show estimated value with confidence indicator
- [ ] Build TDEE insight card (between Goal Card and Tab Switcher)
- [ ] Implement 7-day dismiss with `fittrack_tdee_insight_dismissed_at` localStorage key
- [ ] Mutual exclusion: TDEE insight card vs `AdaptiveDietBanner` — TDEE card takes precedence
- [ ] "Update my targets" — apply `estimatedTDEE` as working TDEE, recalculate macro rings
- [ ] `TDEEDetailSheet` bottom sheet component
- [ ] "10-day nudge" prompt for new users with `'insufficient'` confidence

### Phase E — Dashboard & Profile UI
- [ ] Add estimated TDEE row to Metabolic Index card on Dashboard
- [ ] `PulseIndicator` for metabolic adaptation warning on Dashboard
- [ ] Add "Adaptive TDEE" card to ProfilePage Metabolic Cards section
- [ ] Manual TDEE override via `ScrollPicker` (1,200–5,000 kcal, 50-step)
- [ ] `manualTDEEOverride` field: persist in `user_profiles` (or localStorage if DB schema change is deferred)
- [ ] `[Clear override]` button when override is active
- [ ] `[Update activity level]` deep-link inside `TDEEDetailSheet` → navigates to ProfilePage activity section

---

## 🔑 Schema Additions

### `user_profiles` table (optional — can defer to Phase E)

```sql
ALTER TABLE user_profiles
  ADD COLUMN manual_tdee_override INTEGER DEFAULT NULL,  -- kcal; NULL = use estimated or static
  ADD COLUMN use_estimated_tdee   BOOLEAN DEFAULT FALSE; -- user confirmed "use this as my TDEE"
```

If DB migration is deferred, `manualTDEEOverride` and `useEstimatedTDEE` can be stored in `fittrack_profile_<userId>` localStorage cache under the same key names.

### `tdeeEstimate` shape stored in `fittrack_tdeeEstimate_<userId>`

```js
{
  windowDays: 14,
  windowStart: 'YYYY-MM-DD',
  windowEnd: 'YYYY-MM-DD',
  avgDailyIntake: 1850,
  weightDelta: -0.8,
  estimatedTDEE: 2290,
  staticTDEE: 2050,
  delta: 240,
  deltaPercent: 11.7,
  confidence: 'high',
  loggedDays: 12,
  weightEntries: 4,
  calorieVarianceKcal: 180,
  insights: [...],
  metabolicAdaptation: false,
  deficitWeeks: 0,
  updatedAt: '2026-04-22T...'
}
```

---

## ✅ Verification Plan

### Automated
- [ ] Unit tests in `adaptiveTDEE.js` cover all scenarios listed in Phase A
- [ ] `getBestTDEE()` returns `source: 'static'` when foodLog is empty
- [ ] `getBestTDEE()` returns `source: 'estimated'` with `confidence: 'high'` for a 14-day full dataset
- [ ] Clamping: estimated TDEE of 650 kcal → clamped to 800, confidence downgraded to `'low'`
- [ ] `detectMetabolicAdaptation` returns `false` for 4 deficit weeks, `true` for 8 weeks with TDEE drop

### Manual Test Cases
1. **New user (< 4 days data)**: ProfilePage shows `'Log 10 days to unlock'` prompt. DietPage strip shows static TDEE only.
2. **10 days logged, avg 1,800 kcal, −0.6 kg**: Estimated TDEE = 1,800 + (0.6 × 7700 / 10) = 2,262 kcal. DietPage chip shows `2,262 kcal ↑` with `Medium` badge.
3. **User at maintenance (ΔW = 0)**: Estimated TDEE ≈ avg intake ± noise. Insight card should NOT fire (delta < 8%).
4. **Bulking user (+0.3 kg over 14 days, avg 2,800 kcal)**: Estimated TDEE = 2,800 − (0.3 × 7700 / 14) = 2,635 kcal. Engine correctly computes TDEE below intake.
5. **S5 scenario**: `estimatedTDEE − staticTDEE = 280`, confidence `'high'` → `adaptiveCalories.js` fires S5, suggests +150 kcal target increase. Verify `AdaptiveDietBanner` shows new scenario message.
6. **Metabolic adaptation**: 8 weeks deficit, TDEE estimate dropped 13% → S7 fires, banner recommends diet break. Verify no calorie cut is suggested.
7. **Manual override**: Set 2,400 kcal override in ProfilePage → DietPage macro rings recalculate. Override persists after refresh. `[Clear override]` restores estimated/static TDEE.
8. **Activity level mismatch**: User on `'Sedentary'` but estimated TDEE maps to `'Lightly Active'` → ProfilePage shows mismatch insight. TDEEDetailSheet shows `[Update activity level]` CTA.
9. **7-day dismiss**: Dismiss TDEE insight card → card hidden for 7 days → reappears on day 8 if TDEE drift is still present.

---

## 🔲 Known Limitations (Document in UI)

These are inherent to the reverse-engineering approach and should be communicated to users in the `TDEEDetailSheet`:

1. **Selection bias in logging**: Users who don't log on "cheat days" will have an inflated average intake estimate and thus an inflated TDEE estimate. Confidence scoring reduces this via variance penalty, but it cannot fully eliminate it.
2. **Water retention noise**: Weight can fluctuate 1–2 kg from sodium, carbs, hydration, hormones, and cycle phase. The 14-day window and linear regression smooth this, but short-term estimates are noisy.
3. **Non-fat weight change**: The 7,700 kcal/kg factor assumes weight change is primarily fat. Early in a diet, glycogen depletion (~500g × 4 g water/g glycogen) can cause 1–2 kg weight loss that doesn't represent a fat energy deficit. This is most pronounced in week 1 of a new diet.
4. **Minimum 10 days of consistent data**: Results before this threshold are marked `'low'` or `'insufficient'` and never auto-applied to targets.

---

## 🔗 Integration Diagram

```
health_logs (weight)  +  food_logs (calories)
              ↓
        adaptiveTDEE.js
        ├── estimateTDEE()
        ├── scoreConfidence()
        ├── detectMetabolicAdaptation()
        └── inferActivityLevelMismatch()
              ↓
        AppContext.tdeeEstimate
        ├── → DietPage (chip, insight card, TDEEDetailSheet)
        ├── → DashboardPage (Metabolic Index card)
        ├── → ProfilePage (Adaptive TDEE card, manual override)
        └── → adaptiveCalories.js (S5, S6, S7 scenarios)
                   ↓
```

---

## ⚠️ GAPS IDENTIFIED (Codebase Audit — 2026-04-22)

> **Context:** The spec above was written against an idealised architecture. The audit below compares it against the **actual codebase** (as of 2026-04-22) and identifies conflicts, ambiguities, and missing details that must be resolved before implementation.

### Gap 1: Scenario ID Collision with Existing `adaptiveCalories.js`

**Problem:** The TODO proposes new scenarios `S5`, `S6`, `S7` for TDEE-based insights. But the existing `adaptiveCalories.js` **already uses** those IDs:

| ID | Existing Use (LIVE) | Proposed Use (THIS TODO) |
|---|---|---|
| `S5` | Not gaining at all (goal=gain) | TDEE higher than static |
| `S6` | On track — loss AND gain AND maintain (overloaded!) | TDEE lower than static |
| `S7` | Weight creeping up (goal=maintain) | Metabolic adaptation detected |

**Fix:** The TDEE scenarios must use a separate namespace to avoid collision. Recommended naming:

```
T1 — TDEE meaningfully higher than static
T2 — TDEE meaningfully lower than static
T3 — Metabolic adaptation detected
```

These are structurally different from weight-rate scenarios (S1–S10) — they fire based on TDEE *estimate divergence*, not on *weight change rate*. They should be evaluated in a separate pass, not interleaved into `classifyScenario()`. Add a new function: `classifyTDEEScenario(tdeeEstimate, profile)` that returns `{ scenario: 'T1'|'T2'|'T3'|null, ... }`.

**Impact:** Phase 3 section must be rewritten with `T1`/`T2`/`T3` naming. `AdaptiveDietBanner.jsx` `SEVERITY_COLORS` map needs entries for `T1`, `T2`, `T3`.

---

### Gap 2: Food Log Shape Mismatch

**Problem:** The TODO assumes food log entries have shape `{ date: 'YYYY-MM-DD', macros: { calories } }`. The **actual** `foodLog` in AppContext has this shape:

```js
{
  id, date: 'YYYY-MM-DD', slot: 'Breakfast',
  macros: { calories, protein, carbs, fats },  // ← 'fats' not 'fat'
  name, qty, foodId, ...
}
```

Multiple entries exist per day (one per food item logged). To compute daily intake, the engine must:
1. Group all entries by `date`
2. Sum `macros.calories` across all entries for that day
3. Count a day as "logged" only if it has ≥1 entry with `calories > 0`

**Fix:** Add to `adaptiveTDEE.js`:

```js
function aggregateDailyIntake(foodLogs, startDate, endDate) {
  const dailyMap = {}; // { 'YYYY-MM-DD': totalCals }
  for (const entry of foodLogs) {
    if (entry.date < startDate || entry.date > endDate) continue;
    const cals = entry.macros?.calories || 0;
    if (cals <= 0) continue;
    dailyMap[entry.date] = (dailyMap[entry.date] || 0) + cals;
  }
  return dailyMap; // keys = logged days, values = total kcal
}
```

**Impact:** Phase 1 data input JSDoc and `estimateTDEE` implementation must use this aggregation.

---

### Gap 3: Weight ΔW Calculation — Regression vs Endpoints

**Problem:** The formula section says `ΔW = weight at end − weight at start`. But the Edge Cases section says "use linear regression on all weight entries rather than just start/end points to smooth noise". These contradict each other.

**Fix:** The engine should use **linear regression** (already implemented in `adaptiveCalories.js` → `computeWeeklyRate()`) as the primary method. The formula using raw endpoints is only valid as a simplified explanation.

Specifically:
- Reuse the **same** least-squares regression from `computeWeeklyRate()` — it already returns `rateKgPerWeek` and `logsUsed`
- Derive `ΔW = rateKgPerWeek × (windowDays / 7)` for the TDEE formula
- This automatically smooths water spikes and noisy single-day readings

**Impact:** Add this clarification to the Phase 1 spec. Remove the simple endpoint formula from the implementation (keep it in the "Core Science" section as a conceptual explanation only).

---

### Gap 4: TDEE Priority Chain Not Fully Specified

**Problem:** There are now **four** possible TDEE sources. The TODO mentions manual override and estimated vs static, but doesn't define a clear priority chain.

**Fix:** Define explicitly:

```
Priority 1: manualTDEEOverride (user set a specific number)
Priority 2: estimatedTDEE (confidence ≥ 'medium' AND user accepted via "Use this as my TDEE")
Priority 3: estimatedTDEE (confidence === 'high' — auto-applied without explicit user acceptance)
Priority 4: staticTDEE (Mifflin + activity multiplier — the default fallback)
```

`calcTDEESource()` in `calculations.js` must implement this chain. The `getBestTDEE()` function should also accept `manualTDEEOverride` as a parameter.

**Impact:** Phase 2 context integration and Phase 4/5 UI must respect this chain. `getBestTDEE()` signature needs a 4th parameter.

---

### Gap 5: Formula Sign Convention Inconsistency

**Problem:** The formula `Estimated TDEE = Avg Daily Intake − (ΔW × 7700 / N)` uses a **subtraction**, and defines `ΔW` as `end − start`. This means:
- Weight loss → ΔW is negative → `−(negative) = positive` → TDEE > intake ✓
- Weight gain → ΔW is positive → `−(positive) = negative` → TDEE < intake ✓

This is mathematically correct, but the sign direction is easy to get wrong in code because it uses a double-negative for the common weight-loss case.

**Fix:** Add an explicit implementation note:

```js
// TDEE = avgIntake - (weightDelta * 7700 / windowDays)
// weightDelta = endWeight - startWeight (negative for loss)
// So for weight loss: TDEE = avgIntake - (negative * 7700 / N) = avgIntake + |deficit|
// This is correct: TDEE is HIGHER than what you ate when losing weight.
```

**Impact:** Add this as an inline comment in the Phase 1 code section.

---

### Gap 6: Missing `estimateHistory` Definition for `detectMetabolicAdaptation()`

**Problem:** `detectMetabolicAdaptation(estimateHistory, profile)` accepts an `estimateHistory` parameter, but the TODO never defines:
1. What shape `estimateHistory` has
2. Where it's stored
3. How it accumulates over time

Metabolic adaptation detection requires **weekly TDEE estimates over 6+ weeks**. A single 14-day snapshot isn't enough — you need to know that TDEE has been *trending downward* over time.

**Fix:** Define:

```js
// estimateHistory shape — array of weekly snapshots
[
  { weekOf: '2026-03-11', estimatedTDEE: 2290, staticTDEE: 2050, avgIntake: 1850, weightDelta: -0.4 },
  { weekOf: '2026-03-18', estimatedTDEE: 2220, staticTDEE: 2050, avgIntake: 1830, weightDelta: -0.3 },
  // ... 6+ entries
]
```

Storage: Append the latest weekly estimate to `fittrack_tdeeHistory_<userId>` in localStorage every 7 days (or on every recompute, deduplicating by `weekOf`). Cap at 12 entries (3 months).

`detectMetabolicAdaptation` then checks:
1. At least 6 entries exist
2. User has been in a deficit for all 6+ weeks (`avgIntake < estimatedTDEE` for each week)
3. The most recent `estimatedTDEE` is ≤ 90% of the oldest `estimatedTDEE` in the history

**Impact:** Add `fittrack_tdeeHistory_<userId>` to Phase 2 persistence. Add history accumulation logic. Add to Data State table in `State.md`.

---

### Gap 7: Menstrual Cycle Water Retention Not Considered

**Problem:** The app has `CycleTrackerPage.jsx` and `cycleCalculations.js` for menstrual cycle tracking. During the **luteal phase** (days ~15–28), women can retain 1–3 kg of water. This would cause the TDEE estimate to appear **lower** than reality (because weight went up despite eating at a deficit).

**Fix:** When `user.gender === 'female'` and cycle data is available:
- If the 14-day window overlaps significantly with the luteal phase (>50% of window days), downgrade confidence by one tier (e.g., `'high'` → `'medium'`) and add an insight:

```js
{ type: 'cycle-phase-overlap', phase: 'luteal', note: 'Weight may be elevated from water retention' }
```

- Document this in the Known Limitations section.

**Impact:** Add cycle-awareness to `estimateTDEE()`. Import `getCyclePhase()` from `cycleCalculations.js` when available.

---

### Gap 8: `getBestTDEE` Doesn't Account for `customGoalKcal`

**Problem:** Currently, `AppContext.jsx` uses `user.customGoalKcal || computedKcal` as the working calorie target. If the user has already accepted an adaptive coaching suggestion (S1–S4), their `customGoalKcal` is set and differs from the TDEE-derived target.

When the TDEE insight card shows "Update my targets", it would overwrite `customGoalKcal` with a TDEE-derived value — potentially **undoing** a previous adaptive coaching adjustment the user already accepted.

**Fix:** The "Update my targets" action should:
1. Update the working TDEE (used by `calcDeficit` and macro computation)
2. **Recompute** `goalKcal` from `estimatedTDEE - dailyDelta` rather than setting it to `estimatedTDEE` directly
3. Only then update `customGoalKcal` to the recomputed value

Add a note that TDEE updates cascade through the deficit calculation, not bypass it.

**Impact:** Phase 4b "Update my targets" logic in DietPage must use `calcDeficit()` with the new TDEE, not set TDEE as the calorie target.

---

### Gap 9: Debounce Implementation Detail

**Problem:** Phase 2 says "2-second debounce" but doesn't specify the mechanism. AppContext already has a `scheduleCloudRefresh` debounce pattern (250ms via `cloudRefreshTimerRef`). A 2-second debounce on TDEE recompute that uses `setTimeout` will create stale-closure issues with the current React state model.

**Fix:** Use `useRef` + `setTimeout` pattern matching `scheduleCloudRefresh`:

```js
const tdeeRecomputeTimerRef = useRef(null);

const scheduleTDEERecompute = useCallback(() => {
  clearTimeout(tdeeRecomputeTimerRef.current);
  tdeeRecomputeTimerRef.current = setTimeout(() => {
    // read from refs, not state closures
    const estimate = estimateTDEE(healthLogsRef.current, foodLogRef.current, userRef.current);
    setTdeeEstimate(estimate);
    // persist to localStorage
  }, 2000);
}, []);
```

**Impact:** Phase 2 must specify this ref-based debounce approach. Requires adding `userRef` (or reading from `currentUserIdRef`).

---

### Gap 10: No TDEE Insight Dismiss Key Per-User Scoping

**Problem:** The TODO says dismiss is stored in `fittrack_tdee_insight_dismissed_at`. But dismissals must be scoped per-user (same as `fittrack_coaching_dismissed_at_<userId>` in `adaptiveCalories.js`).

**Fix:** Key should be `fittrack_tdee_insight_dismissed_at_<userId>`. Use the same `dismissCoaching` / `isCoachingDismissed` pattern already established.

**Impact:** Phase 4b localStorage key must include `userId`.

---

### Gap 11: `TDEEDetailSheet` File Location Not Specified

**Problem:** The TODO proposes `TDEEDetailSheet` as a new component but doesn't say where the file goes.

**Fix:** Two options:
1. Add it to `SharedComponents.jsx` (if small — <100 lines)
2. Create `src/components/shared/TDEEDetailSheet.jsx` (if it's a full bottom-sheet with educational content)

Given the wireframe content (~30 lines of UI), Option 2 is better for maintainability.

**Impact:** Add to the Files table.

---

### Gap 12: Missing `AdaptiveDietBanner.jsx` Support for TDEE Scenarios

**Problem:** The existing `AdaptiveDietBanner` component has `SEVERITY_COLORS` mapped for `S1`–`S9`. The new TDEE scenarios (`T1`, `T2`, `T3`) need:
1. Color entries in `SEVERITY_COLORS`
2. Different icon treatments (TDEE insights are educational, not urgent)
3. Different CTA labels ("Update TDEE" vs "Apply New Targets")

**Fix:** Either:
- Extend `AdaptiveDietBanner` to handle `T*` scenarios (preferred — single component)
- Or build a separate `TDEEInsightCard` component (if the visual language is substantially different)

**Recommendation:** Separate component. TDEE insights are informational with a "Learn more" CTA — they're structurally different from the coaching banner's accept/dismiss model.

**Impact:** Add `TDEEInsightCard.jsx` to the Files table. Keep `AdaptiveDietBanner` for S-scenarios only.

---

### Updated File Change Summary

| File | Change Type | What Changes |
|------|-------------|--------------|
| `src/utils/adaptiveTDEE.js` | **NEW** | Core engine: `estimateTDEE`, `getBestTDEE`, `scoreConfidence`, `detectMetabolicAdaptation`, `inferActivityLevelMismatch`, `aggregateDailyIntake` |
| `src/utils/adaptiveCalories.js` | **Patch** | Thread `getBestTDEE` as baseline TDEE source; add `classifyTDEEScenario()` for `T1`/`T2`/`T3` |
| `src/utils/calculations.js` | **Patch** | Export `calcTDEESource(profile, tdeeEstimate, manualOverride)` with 4-level priority chain |
| `src/context/AppContext.jsx` | **Patch** | Add `tdeeEstimate` state, debounced recompute, localStorage persistence, expose in context |
| `src/components/shared/TDEEInsightCard.jsx` | **NEW** | Informational card for TDEE divergence + "Update my targets" / "Learn more" CTAs |
| `src/components/shared/TDEEDetailSheet.jsx` | **NEW** | Educational bottom sheet explaining TDEE estimation |
| `src/components/shared/AdaptiveDietBanner.jsx` | **Patch** | Add `T1`/`T2`/`T3` to `SEVERITY_COLORS` (if reusing), or no change (if separate component) |
| `src/components/pages/DietPage.jsx` | **Patch** | TDEE chip upgrade, insight card, nudge prompt, mutual exclusion with coaching banner |
| `src/components/pages/DashboardPage.jsx` | **Patch** | Estimated TDEE row in Metabolic Index card, metabolic adaptation pulse indicator |
| `src/components/pages/ProfilePage.jsx` | **Patch** | Adaptive TDEE card, manual override picker, activity level mismatch display |

### Implementation Order (Revised)

1. `adaptiveTDEE.js` — core engine with `T*` scenario naming, aggregation helpers, regression-based ΔW
2. `calculations.js` — `calcTDEESource()` priority chain
3. `AppContext.jsx` — state, debounced recompute, persistence
4. `TDEEInsightCard.jsx` + `TDEEDetailSheet.jsx` — new UI components
5. `DietPage.jsx` — chip, insight card, mutual exclusion, nudge
6. `DashboardPage.jsx` — metabolic index update
7. `ProfilePage.jsx` — adaptive TDEE card, manual override
8. Browser verification across all pages