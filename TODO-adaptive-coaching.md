# FitTrack Pro — TODO: Adaptive Coaching Engine
> **Created:** 2026-04-22  
> **Effort:** 🔴 Large · **Impact:** Very High — flagship AI coaching feature  
> **Files affected:** `adaptiveCalories.js` (NEW), `AppContext.jsx`, `DashboardPage.jsx`, `DietPage.jsx`, `SharedComponents.jsx`, plus one Supabase migration  

---

## 🎯 Goal

Build an **adaptive calorie/protein coaching engine** that monitors the user's weight trajectory week-over-week and automatically surfaces personalised recommendations whenever their body is not responding as expected to their stated goal (loss / gain / maintain).

The engine must:
1. Run silently in the background, needing no user input beyond their existing weight logs
2. Fire only when it has statistically meaningful data (≥ 4 logs over ≥ 14 days)
3. Distinguish 10 clinically grounded scenarios (5 loss, 3 gain, 2 maintenance)
4. Propose a concrete kcal adjustment the user can accept in one tap
5. Surface as a prominent card on both the **Dashboard** (above body composition) and the **Diet page** (above the GOAL card)
6. Fix the broken "Details" button on the Dashboard card

---

## 🔬 Research Basis

### Why Adaptive Calories Matter for Indian Gym-Goers

India's fitness landscape in 2026 has a specific problem: calorie targets are set once at sign-up and never revisited. Apps like HealthifyMe, Fittr, and CureFit all offer "AI coach" features that adjust macros based on progress — it's become a table-stakes expectation for any serious fitness app. Indian users training in Tier 1 cities (Delhi, Mumbai, Bengaluru) are highly metrics-literate and expect this.

Key Indian market reality:
- **High metabolic variance**: The average Indian BMR is lower per kg than Western reference populations (ICMR 2020), making Western calorie formulas over-predict energy expenditure by ~8–12%.
- **Festive eating patterns**: Navratri, Diwali, Eid — Indian users regularly see 1–2 week weight spikes that are not fat gain. The engine must be robust against short-term noise.
- **Weekend eating culture**: Cheat meals, family dinners, and biryani Sundays create predictable within-week variance. Use rolling averages, not point-to-point comparison.
- **Protein gap**: 47% of urban Indians are protein-deficient (ICMR). On fat loss, protecting muscle mass via protein is especially critical.

### Evidence-Based Thresholds (NASM / ISSN / FSSAI-aligned)

| Goal | Optimal Rate | Too Slow | Stagnant | Too Fast |
|------|-------------|----------|----------|----------|
| **Fat Loss** | 0.25–0.75 kg/week | < 0.15 kg/week × 2 weeks | < 0.05 kg/week × 2 weeks | > 1.0 kg/week |
| **Muscle Gain (Clean Bulk)** | 0.15–0.40 kg/week | < 0.10 kg/week × 2 weeks | < 0.05 kg/week × 2 weeks | > 0.55 kg/week |
| **Maintenance** | ±0.5 kg from baseline | — | — | ±1.5 kg from `user.weight` profile value |

ISSN position stand (Helms et al., 2014): "A rate of 0.5–1% of body weight lost per week minimizes lean mass loss during energy restriction." For a typical Indian gym-goer at 70kg, this is 0.35–0.70 kg/week. We use 0.25–0.75 to be slightly more accommodating of natural variance.

### Calorie Adjustment Sizes (Conservative by Design)

We use **conservative 100–200 kcal adjustments** — never larger — because:
1. Users can reject suggestions; multiple small adjustments compound naturally
2. Large jumps (500 kcal) are overwhelming and often cause abandonment
3. Indian dietary patterns already involve high day-to-day variance; small changes are more tolerable
4. A 150 kcal reduction = approximately 1 less roti + 1 less katori dal, which is actionable

---

## 📋 10 Scenario Classification Matrix

| # | ID | Goal | Weight Trend | Headline | kcalDelta | Priority |
|---|----|------|-------------|----------|-----------|----------|
| 1 | `LOSS_WRONG_DIR` | loss | Gaining weight | "Progress Reversed" | −200 | 🔴 P0 |
| 2 | `LOSS_STAGNANT` | loss | Flat (< 0.05 kg/week) | "Scale Has Stopped Moving" | −150 | 🔴 P0 |
| 3 | `LOSS_TOO_SLOW` | loss | < 0.15 kg/week | "Progress Is Too Slow" | −100 | 🟠 P1 |
| 4 | `LOSS_OPTIMAL` | loss | 0.25–0.75 kg/week | "You're on Track 🎯" | 0 | ✅ Info |
| 5 | `LOSS_TOO_FAST` | loss | > 1.0 kg/week | "Losing Too Fast — Muscle Risk" | +150 | 🟠 P1 |
| 6 | `GAIN_STAGNANT` | gain | Flat (< 0.05 kg/week) | "Bulk Has Stalled" | +150 | 🔴 P0 |
| 7 | `GAIN_OPTIMAL` | gain | 0.15–0.40 kg/week | "Clean Bulk Pace 💪" | 0 | ✅ Info |
| 8 | `GAIN_TOO_FAST` | gain | > 0.55 kg/week | "Adding Too Much Fat" | −100 | 🟠 P1 |
| 9 | `MAINTAIN_HIGH` | maintain | +1.5 kg above target | "Weight Creeping Up" | −100 | 🟡 P2 |
| 10 | `MAINTAIN_LOW` | maintain | −1.5 kg below target | "Weight Drifting Down" | +100 | 🟡 P2 |

**`kcalDelta`**: The amount to add to (or subtract from) the user's computed baseline. Stored as `adaptiveCalorieOffset` in `user_profiles`. Positive = eat more, negative = eat less.

---

## 🏗️ Architecture Overview

```
healthLogs (weight entries)
       │
       ▼
adaptiveCalories.js
  └── classifyWeightTrend(healthLogs, user)
         │
         ▼  scenario object
  └── getAdaptiveRecommendation(...)
         │
         ▼
AppContext ─── user.adaptiveCalorieOffset (from user_profiles)
         │
    ┌────┴────┐
    │         │
DashboardPage  DietPage
(compact       (full card
 card above    above GOAL
 body comp)    card)
    │
    └── "Details →" onClick → navigate('/diet')
```

The **offset is cumulative**: each accepted recommendation adds to/subtracts from the running offset. The user can "Reset to Baseline" in the Diet page to zero out `adaptiveCalorieOffset`.

---

## 🗄️ TASK 1 — Supabase Migration

**File:** `supabase/migrations/20260422_adaptive_coaching.sql` [NEW]

```sql
-- Adaptive coaching offset stored on user_profiles
-- Positive = extra kcal added to computed baseline
-- Negative = kcal removed from baseline
ALTER TABLE public.user_profiles
  ADD COLUMN IF NOT EXISTS adaptive_calorie_offset   INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS adaptive_last_applied_at  TIMESTAMPTZ DEFAULT NULL;

-- No RLS changes needed — user_profiles already has "users can read/update own row"
COMMENT ON COLUMN public.user_profiles.adaptive_calorie_offset
  IS 'Running kcal delta applied to the computed TDEE-based target. Set to 0 to reset.';
COMMENT ON COLUMN public.user_profiles.adaptive_last_applied_at
  IS 'Timestamp when the user last accepted an adaptive coaching suggestion.';
```

---

## 🧠 TASK 2 — `src/utils/adaptiveCalories.js` [NEW]

This is the core engine. Pure utility — no React dependencies.

```js
// src/utils/adaptiveCalories.js
// Adaptive Calorie Coaching Engine for FitTrack Pro
// Research basis: NASM ISSA, ISSN Position Stand (Helms et al. 2014),
// ICMR Dietary Guidelines 2020, Indian fitness coaching best practices.

// ─── CONSTANTS ────────────────────────────────────────────────────────────────

export const SCENARIOS = {
  LOSS_WRONG_DIR:   'LOSS_WRONG_DIR',
  LOSS_STAGNANT:    'LOSS_STAGNANT',
  LOSS_TOO_SLOW:    'LOSS_TOO_SLOW',
  LOSS_OPTIMAL:     'LOSS_OPTIMAL',
  LOSS_TOO_FAST:    'LOSS_TOO_FAST',
  GAIN_STAGNANT:    'GAIN_STAGNANT',
  GAIN_OPTIMAL:     'GAIN_OPTIMAL',
  GAIN_TOO_FAST:    'GAIN_TOO_FAST',
  MAINTAIN_HIGH:    'MAINTAIN_HIGH',
  MAINTAIN_LOW:     'MAINTAIN_LOW',
};

// Minimum data requirements before showing any recommendation
const MIN_LOGS   = 4;       // at least 4 weight entries
const MIN_DAYS   = 14;      // spanning at least 14 calendar days
const COOLDOWN_DAYS = 14;   // minimum days between applied adjustments

// ─── DATA GATE ────────────────────────────────────────────────────────────────

/**
 * Returns true if we have enough data for a reliable classification.
 * @param {Array} healthLogs - all user health log entries, any order
 * @returns {boolean}
 */
export function hasEnoughData(healthLogs) {
  if (!Array.isArray(healthLogs) || healthLogs.length < MIN_LOGS) return false;
  const sorted = [...healthLogs].sort((a, b) => new Date(a.date) - new Date(b.date));
  const first  = new Date(sorted[0].date + 'T00:00:00');
  const last   = new Date(sorted[sorted.length - 1].date + 'T00:00:00');
  const spanDays = (last - first) / 86400000;
  return spanDays >= MIN_DAYS;
}

// ─── TREND COMPUTATION ────────────────────────────────────────────────────────

/**
 * Computes weekly rate of weight change (kg/week) using simple linear regression
 * over the last 28 days of logs. Using regression rather than point-to-point
 * comparison eliminates single-day noise (water retention, meal timing, etc.).
 *
 * Returns positive number for weight gain, negative for loss.
 *
 * @param {Array} healthLogs - all user health log entries
 * @returns {number|null} kg per week, or null if insufficient data
 */
export function computeWeeklyRate(healthLogs) {
  if (!hasEnoughData(healthLogs)) return null;

  // Use last 28 days of data (or all data if less)
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 28);
  const recentLogs = healthLogs
    .filter(l => new Date(l.date + 'T00:00:00') >= cutoff)
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  // Fall back to all logs sorted if not enough recent ones
  const logs = recentLogs.length >= MIN_LOGS
    ? recentLogs
    : [...healthLogs].sort((a, b) => new Date(a.date) - new Date(b.date));

  if (logs.length < MIN_LOGS) return null;

  // Day-indexed linear regression (x = days from first log, y = weight)
  const t0   = new Date(logs[0].date + 'T00:00:00').getTime();
  const n    = logs.length;
  const xArr = logs.map(l => (new Date(l.date + 'T00:00:00').getTime() - t0) / 86400000);
  const yArr = logs.map(l => parseFloat(l.weight));

  const xMean = xArr.reduce((s, v) => s + v, 0) / n;
  const yMean = yArr.reduce((s, v) => s + v, 0) / n;

  const num   = xArr.reduce((s, x, i) => s + (x - xMean) * (yArr[i] - yMean), 0);
  const denom = xArr.reduce((s, x)    => s + (x - xMean) ** 2, 0);

  if (denom === 0) return 0; // all logs on same day

  const slopePerDay = num / denom;  // kg per day
  return +(slopePerDay * 7).toFixed(3); // kg per week, rounded to 3dp
}

// ─── GOAL DETECTION ───────────────────────────────────────────────────────────

/**
 * Derives the user's macro goal from their profile.
 * @param {Object} user - user profile from AppContext
 * @returns {'loss' | 'gain' | 'maintain'}
 */
export function detectGoal(user) {
  if (!user?.weight || !user?.weightGoal) return 'maintain';
  const diff = user.weightGoal - user.weight;
  if (diff <= -1)  return 'loss';
  if (diff >= 1)   return 'gain';
  return 'maintain';
}

// ─── CLASSIFICATION ───────────────────────────────────────────────────────────

/**
 * Classifies the user's current weight trajectory into one of 10 scenarios.
 *
 * @param {Array}  healthLogs - all health log entries (any order)
 * @param {Object} user       - user profile from AppContext
 * @returns {{ scenario: string, weeklyRate: number } | null}
 *          Returns null when insufficient data.
 */
export function classifyWeightTrend(healthLogs, user) {
  if (!hasEnoughData(healthLogs)) return null;

  const weeklyRate = computeWeeklyRate(healthLogs);
  if (weeklyRate === null) return null;

  const goal = detectGoal(user);

  if (goal === 'loss') {
    if (weeklyRate >  0.05)  return { scenario: SCENARIOS.LOSS_WRONG_DIR, weeklyRate };
    if (weeklyRate >= -0.05) return { scenario: SCENARIOS.LOSS_STAGNANT,  weeklyRate };
    if (weeklyRate >= -0.15) return { scenario: SCENARIOS.LOSS_TOO_SLOW,  weeklyRate };
    if (weeklyRate >= -0.75) return { scenario: SCENARIOS.LOSS_OPTIMAL,   weeklyRate };
    /* weeklyRate < -1.0 */   return { scenario: SCENARIOS.LOSS_TOO_FAST, weeklyRate };
  }

  if (goal === 'gain') {
    if (weeklyRate <= 0.05)  return { scenario: SCENARIOS.GAIN_STAGNANT,  weeklyRate };
    if (weeklyRate <= 0.40)  return { scenario: SCENARIOS.GAIN_OPTIMAL,   weeklyRate };
    /* weeklyRate > 0.55 */  return { scenario: SCENARIOS.GAIN_TOO_FAST,  weeklyRate };
  }

  // maintain
  const latestWeight = parseFloat([...healthLogs].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  )[0]?.weight) || user.weight;
  const delta = latestWeight - user.weight;
  if (delta >  1.5) return { scenario: SCENARIOS.MAINTAIN_HIGH, weeklyRate };
  if (delta < -1.5) return { scenario: SCENARIOS.MAINTAIN_LOW,  weeklyRate };
  return null; // Maintain and within tolerance — no card needed
}

// ─── RECOMMENDATION FACTORY ───────────────────────────────────────────────────

const SCENARIO_CONFIG = {
  [SCENARIOS.LOSS_WRONG_DIR]: {
    kcalDelta:   -200,
    urgency:     'high',
    icon:        'TrendingDown',
    accentColor: 'var(--danger)',
    headline:    'Progress Reversed',
    body:        'Your weight has been climbing over the past 2 weeks despite a fat-loss goal. A 200 kcal reduction will restore a caloric deficit.',
    proteinTip:  null,
    action:      'Reduce daily target by 200 kcal',
  },
  [SCENARIOS.LOSS_STAGNANT]: {
    kcalDelta:   -150,
    urgency:     'high',
    icon:        'Minus',
    accentColor: 'var(--danger)',
    headline:    'Scale Has Stopped Moving',
    body:        'No meaningful weight change in 2 weeks. Your body has adapted to the current intake. A 150 kcal reduction re-establishes the deficit.',
    proteinTip:  'Keep protein high (≥2.0g/kg) to protect muscle while in a deeper deficit.',
    action:      'Reduce daily target by 150 kcal',
  },
  [SCENARIOS.LOSS_TOO_SLOW]: {
    kcalDelta:   -100,
    urgency:     'medium',
    icon:        'ChevronDown',
    accentColor: '#F59E0B',
    headline:    'Progress Is Too Slow',
    body:        'You\'re losing weight but below the optimal 0.25 kg/week pace. A small 100 kcal reduction keeps you on track without feeling deprived.',
    proteinTip:  null,
    action:      'Reduce daily target by 100 kcal',
  },
  [SCENARIOS.LOSS_OPTIMAL]: {
    kcalDelta:    0,
    urgency:     'info',
    icon:        'CheckCircle',
    accentColor: 'var(--success)',
    headline:    'You\'re on Track 🎯',
    body:        'Losing 0.25–0.75 kg per week — the ideal fat-loss pace that preserves muscle. No adjustment needed. Keep the current plan.',
    proteinTip:  null,
    action:      null,
  },
  [SCENARIOS.LOSS_TOO_FAST]: {
    kcalDelta:   +150,
    urgency:     'high',
    icon:        'AlertTriangle',
    accentColor: 'var(--danger)',
    headline:    'Losing Too Fast — Muscle Risk',
    body:        'Dropping more than 1 kg per week puts your hard-earned muscle at serious risk. ISSN guidelines recommend a maximum 1% body weight per week. Eat 150 kcal more to slow the rate.',
    proteinTip:  'Prioritise protein (≥2.5g/kg of current weight) — it\'s your best defence against muscle loss during aggressive cuts.',
    action:      'Increase daily target by 150 kcal',
  },
  [SCENARIOS.GAIN_STAGNANT]: {
    kcalDelta:   +150,
    urgency:     'high',
    icon:        'TrendingUp',
    accentColor: 'var(--success)',
    headline:    'Bulk Has Stalled',
    body:        'No measurable weight gain in 2 weeks. Your intake is at maintenance. Add 150 kcal to kickstart muscle growth — ideally from complex carbs around your workouts.',
    proteinTip:  'Increase protein to 2.0g/kg to support the extra training volume a caloric surplus enables.',
    action:      'Increase daily target by 150 kcal',
  },
  [SCENARIOS.GAIN_OPTIMAL]: {
    kcalDelta:    0,
    urgency:     'info',
    icon:        'CheckCircle',
    accentColor: 'var(--primary)',
    headline:    'Clean Bulk Pace 💪',
    body:        'Gaining 0.15–0.40 kg per week — textbook lean bulk territory. You\'re adding muscle with minimal fat accumulation. Stay the course.',
    proteinTip:  null,
    action:      null,
  },
  [SCENARIOS.GAIN_TOO_FAST]: {
    kcalDelta:   -100,
    urgency:     'medium',
    icon:        'AlertTriangle',
    accentColor: '#F59E0B',
    headline:    'Adding Too Much Fat',
    body:        'Gaining more than 0.5 kg per week exceeds the rate at which muscle tissue can be synthesised — the excess is being stored as fat. Trim 100 kcal to slow the pace.',
    proteinTip:  null,
    action:      'Reduce daily target by 100 kcal',
  },
  [SCENARIOS.MAINTAIN_HIGH]: {
    kcalDelta:   -100,
    urgency:     'medium',
    icon:        'TrendingUp',
    accentColor: '#F59E0B',
    headline:    'Weight Creeping Up',
    body:        'You\'re 1.5+ kg above your registered weight on a maintenance goal. A small 100 kcal reduction brings things back on track without a hard cut.',
    proteinTip:  null,
    action:      'Reduce daily target by 100 kcal',
  },
  [SCENARIOS.MAINTAIN_LOW]: {
    kcalDelta:   +100,
    urgency:     'medium',
    icon:        'TrendingDown',
    accentColor: '#F59E0B',
    headline:    'Weight Drifting Down',
    body:        'You\'re 1.5+ kg below your maintenance weight. If this is unintentional, add 100 kcal to stabilise. If you\'re trying to lose weight, update your goal.',
    proteinTip:  null,
    action:      'Increase daily target by 100 kcal',
  },
};

/**
 * Returns the full recommendation object for a given health log set and user.
 * Returns null when there is no actionable recommendation (not enough data,
 * or scenario is OPTIMAL and would just be informational noise).
 *
 * @param {Array}  healthLogs         - all health log entries
 * @param {Object} user               - user profile from AppContext
 * @param {number} currentOffset      - user.adaptiveCalorieOffset (current cumulative offset)
 * @param {string} lastAppliedAt      - ISO string of last accepted suggestion (or null)
 * @returns {Object|null}
 */
export function getAdaptiveRecommendation(healthLogs, user, currentOffset, lastAppliedAt) {
  const result = classifyWeightTrend(healthLogs, user);
  if (!result) return null;

  const { scenario, weeklyRate } = result;

  // Check cooldown — don't suggest again within 14 days of last applied
  if (lastAppliedAt) {
    const daysSinceApplied = (Date.now() - new Date(lastAppliedAt)) / 86400000;
    if (daysSinceApplied < COOLDOWN_DAYS) return null;
  }

  const config = SCENARIO_CONFIG[scenario];
  if (!config) return null;

  const weeklyRateDisplay = weeklyRate >= 0
    ? `+${Math.abs(weeklyRate).toFixed(2)} kg/week`
    : `−${Math.abs(weeklyRate).toFixed(2)} kg/week`;

  return {
    scenario,
    ...config,
    weeklyRate,
    weeklyRateDisplay,
    newOffset:          currentOffset + config.kcalDelta,
    // The proposed absolute target delta (so UI can show "from X to Y")
    proposedDelta:      config.kcalDelta,
  };
}

// ─── COACHING STATE HELPERS ───────────────────────────────────────────────────

const COACHING_STATE_PREFIX = 'fittrack_adaptive_coaching_';

/**
 * Reads the per-user coaching state from localStorage.
 * @param {string} userId
 * @returns {{ dismissedAt: string|null }}
 */
export function readCoachingState(userId) {
  try {
    const raw = localStorage.getItem(COACHING_STATE_PREFIX + userId);
    return raw ? JSON.parse(raw) : { dismissedAt: null };
  } catch {
    return { dismissedAt: null };
  }
}

/**
 * Dismisses the current recommendation for 7 days.
 * @param {string} userId
 */
export function dismissCoaching(userId) {
  const state = readCoachingState(userId);
  state.dismissedAt = new Date().toISOString();
  try {
    localStorage.setItem(COACHING_STATE_PREFIX + userId, JSON.stringify(state));
  } catch {/* quota — ignore */}
}

/**
 * Returns true if the coaching banner should be suppressed due to a recent dismissal.
 * @param {string} userId
 * @param {number} suppressDays - default 7
 */
export function isCoachingDismissed(userId, suppressDays = 7) {
  const { dismissedAt } = readCoachingState(userId);
  if (!dismissedAt) return false;
  const daysSince = (Date.now() - new Date(dismissedAt)) / 86400000;
  return daysSince < suppressDays;
}
```

---

## ⚙️ TASK 3 — `AppContext.jsx` Changes

### 3a — Extend the `user` object mapping

In the `user` useMemo / derived object (where `profile` fields are mapped to camelCase), add:

```js
adaptiveCalorieOffset:  profile.adaptive_calorie_offset     ?? 0,
adaptiveLastAppliedAt:  profile.adaptive_last_applied_at    || null,
```

### 3b — Extend `updateProfile` keyMap

In the `keyMap` object inside `updateProfile`:

```js
adaptiveCalorieOffset: 'adaptive_calorie_offset',
adaptiveLastAppliedAt: 'adaptive_last_applied_at',
```

### 3c — Expose `applyAdaptiveAdjustment` method

Add a new context method that atomically applies a coaching recommendation:

```js
/**
 * Accepts a coaching recommendation — updates the calorie offset on user_profiles
 * and records the timestamp.
 *
 * @param {number} newOffset  - the new cumulative offset (currentOffset + kcalDelta)
 * @returns {Promise<{error}>}
 */
const applyAdaptiveAdjustment = async (newOffset) => {
  const appliedAt = new Date().toISOString();
  return updateProfile({
    adaptiveCalorieOffset: Math.round(newOffset),
    adaptiveLastAppliedAt: appliedAt,
  });
};

/**
 * Resets the calorie offset back to 0 (baseline computed value).
 */
const resetAdaptiveAdjustment = async () => {
  return updateProfile({
    adaptiveCalorieOffset: 0,
    adaptiveLastAppliedAt: null,
  });
};
```

Add both to the context provider value object.

---

## 🎨 TASK 4 — `AdaptiveCoachingBanner` Component

**Location:** Add as an exported component in `src/components/shared/SharedComponents.jsx`

The banner has two display modes:
- **`variant="compact"`** — Dashboard card (1–2 line summary + icon + "Details →" button)
- **`variant="full"`** — Diet page card (full scenario explanation + protein tip + CTA buttons)

### 4a — Props

```js
AdaptiveCoachingBanner({
  recommendation,        // object from getAdaptiveRecommendation() or null
  variant,               // 'compact' | 'full'
  currentGoalKcal,       // number — only needed for 'full' variant to show "X → Y"
  onApply,               // async () => void — called when user accepts
  onDismiss,             // () => void — called when user dismisses
  onDetails,             // () => void — called on "Details" click (compact only)
  loading,               // boolean — shows spinner during apply
})
```

### 4b — Design Spec (Kinetic Elite)

**Import icons:**
```js
import {
  TrendingUp, TrendingDown, Minus, ChevronDown, AlertTriangle,
  CheckCircle, Brain, ChevronRight, X, Zap,
} from 'lucide-react';
```

**Compact variant (Dashboard):**
```jsx
// Overall container
<div style={{
  background: 'var(--surface-container-low)',
  borderRadius: 16,
  padding: '16px 18px',
  marginBottom: 16,
  borderLeft: `4px solid ${recommendation.accentColor}`,
  position: 'relative',
  overflow: 'hidden',
}}>
  {/* Radial glow in top-right corner — matches dashboard aesthetic */}
  <div style={{
    position: 'absolute', top: -30, right: -30, width: 100, height: 100,
    background: `${recommendation.accentColor}15`,
    borderRadius: '50%', filter: 'blur(24px)', pointerEvents: 'none',
  }} />

  {/* Small label above headline */}
  <div style={{
    fontSize: 9, fontWeight: 700, letterSpacing: '0.15em',
    textTransform: 'uppercase', color: recommendation.accentColor,
    marginBottom: 6,
    fontFamily: "'Be Vietnam Pro', sans-serif",
  }}>
    ⚡ Adaptive Coach
  </div>

  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    <div style={{ flex: 1, minWidth: 0 }}>
      {/* Headline */}
      <div style={{
        fontFamily: "'Space Grotesk', sans-serif",
        fontWeight: 700, fontSize: 15,
        color: 'var(--on-surface)', marginBottom: 4,
      }}>
        {recommendation.headline}
      </div>

      {/* Weekly rate chip */}
      <div style={{
        fontSize: 11, color: 'var(--on-surface-variant)',
        display: 'flex', alignItems: 'center', gap: 6,
      }}>
        <span style={{
          padding: '2px 8px', borderRadius: 6,
          background: `${recommendation.accentColor}18`,
          color: recommendation.accentColor,
          fontFamily: "'Space Grotesk', sans-serif",
          fontWeight: 700, fontSize: 10,
        }}>
          {recommendation.weeklyRateDisplay}
        </span>
        <span style={{ color: 'var(--on-surface-dim)' }}>
          {recommendation.proposedDelta !== 0
            ? `${recommendation.proposedDelta > 0 ? '+' : ''}${recommendation.proposedDelta} kcal/day suggested`
            : 'No change needed'}
        </span>
      </div>
    </div>

    {/* Details → button */}
    <button
      onClick={onDetails}
      style={{
        background: `${recommendation.accentColor}15`,
        border: 'none',
        borderRadius: 10,
        padding: '8px 14px',
        cursor: 'pointer',
        display: 'flex', alignItems: 'center', gap: 5,
        fontSize: 12, fontWeight: 700,
        color: recommendation.accentColor,
        fontFamily: "'Be Vietnam Pro', sans-serif",
        flexShrink: 0, marginLeft: 12,
        transition: 'background .15s',
      }}
    >
      Details <ChevronRight size={13} />
    </button>
  </div>
</div>
```

**Full variant (Diet page):**
```jsx
// Outer glass card — more prominent, matches GOAL card treatment
<div style={{
  background: 'var(--surface-container-low)',
  borderRadius: 20,
  padding: '20px 20px 16px',
  marginBottom: 20,
  borderLeft: `4px solid ${recommendation.accentColor}`,
  position: 'relative',
  overflow: 'hidden',
}}>
  {/* Radial glow */}
  <div style={{
    position: 'absolute', top: -40, right: -40, width: 130, height: 130,
    background: `${recommendation.accentColor}10`,
    borderRadius: '50%', filter: 'blur(30px)', pointerEvents: 'none',
  }} />

  {/* Header row */}
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14, position: 'relative', zIndex: 1 }}>
    <div style={{ flex: 1 }}>
      {/* Label */}
      <div style={{
        fontSize: 9, fontWeight: 700, letterSpacing: '0.15em',
        textTransform: 'uppercase', color: recommendation.accentColor,
        marginBottom: 6, fontFamily: "'Be Vietnam Pro', sans-serif",
      }}>
        ⚡ Adaptive Coach · Based on {Math.round(weeksOfData)} weeks of data
      </div>

      {/* Headline */}
      <div style={{
        fontFamily: "'Space Grotesk', sans-serif",
        fontWeight: 800, fontSize: 18,
        color: 'var(--on-surface)', marginBottom: 8, lineHeight: 1.2,
      }}>
        {recommendation.headline}
      </div>

      {/* Weekly rate pill */}
      <span style={{
        padding: '3px 10px', borderRadius: 8,
        background: `${recommendation.accentColor}18`,
        color: recommendation.accentColor,
        fontFamily: "'Space Grotesk', sans-serif",
        fontWeight: 700, fontSize: 11,
      }}>
        {recommendation.weeklyRateDisplay}
      </span>
    </div>

    {/* Dismiss X button */}
    <button
      onClick={onDismiss}
      style={{
        background: 'transparent', border: 'none',
        cursor: 'pointer', color: 'var(--on-surface-dim)',
        padding: 4, borderRadius: 6,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0, marginLeft: 8,
      }}
      aria-label="Dismiss coaching suggestion"
    >
      <X size={16} />
    </button>
  </div>

  {/* Body text */}
  <div style={{
    fontSize: 13, color: 'var(--on-surface-variant)',
    lineHeight: 1.6, marginBottom: 14, position: 'relative', zIndex: 1,
  }}>
    {recommendation.body}
  </div>

  {/* Protein tip (conditional) */}
  {recommendation.proteinTip && (
    <div style={{
      background: 'var(--surface-container)',
      borderRadius: 10, padding: '10px 14px',
      marginBottom: 14, position: 'relative', zIndex: 1,
      display: 'flex', gap: 10, alignItems: 'flex-start',
    }}>
      <Zap size={14} color="var(--primary)" style={{ flexShrink: 0, marginTop: 1 }} />
      <span style={{ fontSize: 12, color: 'var(--on-surface-variant)', lineHeight: 1.5 }}>
        {recommendation.proteinTip}
      </span>
    </div>
  )}

  {/* Proposed change summary (only when kcalDelta !== 0) */}
  {recommendation.proposedDelta !== 0 && (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      background: 'var(--surface-container-high)',
      borderRadius: 12, padding: '12px 16px',
      marginBottom: 16, position: 'relative', zIndex: 1,
    }}>
      <div>
        <div style={{ fontSize: 10, color: 'var(--on-surface-dim)', marginBottom: 2, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Current Target
        </div>
        <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 16, color: 'var(--on-surface)' }}>
          {currentGoalKcal.toLocaleString()} kcal
        </div>
      </div>
      <ChevronRight size={16} color="var(--on-surface-dim)" />
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontSize: 10, color: recommendation.accentColor, marginBottom: 2, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Suggested Target
        </div>
        <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: 16, color: recommendation.accentColor }}>
          {(currentGoalKcal + recommendation.proposedDelta).toLocaleString()} kcal
        </div>
      </div>
    </div>
  )}

  {/* CTA buttons */}
  {recommendation.proposedDelta !== 0 ? (
    <div style={{ display: 'flex', gap: 10, position: 'relative', zIndex: 1 }}>
      <button
        onClick={onApply}
        disabled={loading}
        style={{
          flex: 1, padding: '13px 16px',
          background: `linear-gradient(135deg, ${recommendation.accentColor}, ${recommendation.accentColor}CC)`,
          border: 'none', borderRadius: 12,
          fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 13,
          color: '#fff', cursor: loading ? 'default' : 'pointer',
          opacity: loading ? 0.7 : 1,
          transition: 'opacity .15s',
          letterSpacing: '0.04em',
        }}
      >
        {loading ? 'Applying…' : `Apply — ${recommendation.action}`}
      </button>
      <button
        onClick={onDismiss}
        style={{
          padding: '13px 16px',
          background: 'var(--surface-container-highest)',
          border: 'none', borderRadius: 12,
          fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 600, fontSize: 13,
          color: 'var(--on-surface-variant)', cursor: 'pointer',
        }}
      >
        Skip (7d)
      </button>
    </div>
  ) : (
    /* Optimal scenario — info only, no apply button */
    <div style={{ position: 'relative', zIndex: 1 }}>
      <button
        onClick={onDismiss}
        style={{
          width: '100%', padding: '13px',
          background: 'var(--surface-container-highest)',
          border: 'none', borderRadius: 12,
          fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 600, fontSize: 13,
          color: 'var(--on-surface-variant)', cursor: 'pointer',
        }}
      >
        Got it
      </button>
    </div>
  )}
</div>
```

---

## 📊 TASK 5 — `DietPage.jsx` Changes

### 5a — New imports

At the top of `DietPage.jsx`, add:

```js
import { useNavigate } from 'react-router-dom';
import {
  getAdaptiveRecommendation,
  isCoachingDismissed,
  dismissCoaching,
  hasEnoughData,
} from '../../utils/adaptiveCalories';
import { AdaptiveCoachingBanner } from '../shared/SharedComponents';
```

### 5b — New state

Inside the `DietPage` component (after existing `useState` calls):

```js
const [adaptiveLoading, setAdaptiveLoading] = useState(false);
const [adaptiveDismissed, setAdaptiveDismissed] = useState(
  () => user ? isCoachingDismissed(user.id) : false
);
```

### 5c — New computed values

After the existing `goalKcal`, `prot`, `carbs`, `fat` computations:

```js
// Apply adaptive offset on top of computed baseline
// user.adaptiveCalorieOffset comes from user_profiles (stored delta)
const adaptiveOffset = user?.adaptiveCalorieOffset || 0;
const adjustedGoalKcal = goalKcal + adaptiveOffset;
// ⚠️ From this point on, use `adjustedGoalKcal` everywhere the old `goalKcal`
//    was used for macro ring targets, protein suggestions, etc.
//    Keep original `goalKcal` only for the adaptive banner's "before" display.

// Adaptive recommendation (computed once, memoized)
const adaptiveRec = useMemo(() => {
  if (!user || adaptiveDismissed) return null;
  return getAdaptiveRecommendation(
    healthLogs,
    user,
    adaptiveOffset,
    user.adaptiveLastAppliedAt,
  );
}, [healthLogs, user, adaptiveOffset, adaptiveDismissed]);
```

### 5d — Handlers

```js
const handleAdaptiveApply = async () => {
  if (!adaptiveRec) return;
  setAdaptiveLoading(true);
  await applyAdaptiveAdjustment(adaptiveRec.newOffset);
  setAdaptiveLoading(false);
  addToast(`Daily target updated to ${(adjustedGoalKcal + adaptiveRec.proposedDelta).toLocaleString()} kcal`, 'success');
};

const handleAdaptiveDismiss = () => {
  if (user) dismissCoaching(user.id);
  setAdaptiveDismissed(true);
};
```

### 5e — JSX insertion (above GOAL card)

Find the existing GOAL card in the JSX and insert **above it**:

```jsx
{/* ── ADAPTIVE COACHING BANNER ── */}
{adaptiveRec && !adaptiveDismissed && (
  <AdaptiveCoachingBanner
    recommendation={adaptiveRec}
    variant="full"
    currentGoalKcal={adjustedGoalKcal}
    onApply={handleAdaptiveApply}
    onDismiss={handleAdaptiveDismiss}
    loading={adaptiveLoading}
    weeksOfData={
      healthLogs.length >= 2
        ? Math.round(
            (new Date(healthLogs[healthLogs.length - 1]?.date) -
             new Date(healthLogs[0]?.date)) / (7 * 86400000)
          )
        : 0
    }
  />
)}
```

### 5f — Replace `goalKcal` with `adjustedGoalKcal` throughout

**Every reference to `goalKcal`** after the computation section must become `adjustedGoalKcal`. This affects:
- The macro ring gauge targets (Kcal ring `max` value)
- The `todayTotals` comparison that drives ring fill percentage
- The summary row above rings (`🔥 X kcal`)
- The protein/carbs/fat splits (these are derived as fractions of `goalKcal` — use `adjustedGoalKcal` instead)
- The calorie progress bar in the tracker tab header

**⚠️ Critical:** Do NOT replace `goalKcal` in the adaptive banner's "Current Target" display — that field intentionally shows the pre-offset baseline for comparison.

### 5g — "Reset to Baseline" link

In the DietPage, below the GOAL card header row (or at the very bottom of the Goal card), add a small reset affordance when the offset is non-zero:

```jsx
{adaptiveOffset !== 0 && (
  <div style={{
    display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
    marginTop: 8, marginBottom: -4,
  }}>
    <button
      onClick={() => resetAdaptiveAdjustment()}
      style={{
        background: 'none', border: 'none', cursor: 'pointer',
        fontSize: 11, color: 'var(--on-surface-dim)',
        fontFamily: "'Be Vietnam Pro', sans-serif",
        textDecoration: 'underline', textDecorationColor: 'var(--outline-variant)',
        padding: 0,
      }}
    >
      {adaptiveOffset > 0 ? `+${adaptiveOffset}` : adaptiveOffset} kcal offset applied · Reset to baseline
    </button>
  </div>
)}
```

---

## 🏠 TASK 6 — `DashboardPage.jsx` Changes

### 6a — New imports

```js
import { useNavigate } from 'react-router-dom';
import {
  getAdaptiveRecommendation,
  isCoachingDismissed,
  dismissCoaching,
} from '../../utils/adaptiveCalories';
import { AdaptiveCoachingBanner } from '../shared/SharedComponents';
```

### 6b — New state and computed values

```js
const navigate = useNavigate();

const [adaptiveDashDismissed, setAdaptiveDashDismissed] = useState(
  () => user ? isCoachingDismissed(user.id) : false
);

// Derive the adaptive rec for the compact banner
// Uses same engine as DietPage — the computation is fast (regression on a small array)
const adaptiveRecDash = useMemo(() => {
  if (!user || adaptiveDashDismissed) return null;
  return getAdaptiveRecommendation(
    healthLogs,
    user,
    user.adaptiveCalorieOffset || 0,
    user.adaptiveLastAppliedAt,
  );
}, [healthLogs, user, adaptiveDashDismissed]);
```

### 6c — Handlers

```js
const handleDashAdaptiveDismiss = () => {
  if (user) dismissCoaching(user.id);
  setAdaptiveDashDismissed(true);
};
```

### 6d — JSX insertion — above Body Composition card

Find the Body Composition card section (added 2026-04-17, described in State.md as "Glass card before Muscle Mastery"). Insert **directly above** it:

```jsx
{/* ── ADAPTIVE COACHING BANNER (compact) ── */}
{adaptiveRecDash && !adaptiveDashDismissed && (
  <AdaptiveCoachingBanner
    recommendation={adaptiveRecDash}
    variant="compact"
    onDetails={() => navigate('/diet')}
    onDismiss={handleDashAdaptiveDismiss}
  />
)}
```

### 6e — Fix "Details" button (ROOT CAUSE + FIX)

**Root cause of the broken "Details" button:**

The Dashboard's `AdaptiveCoachingBanner` was likely rendered as a static component that received an `onDetails` prop that was never wired — or the button had an `onClick` that referenced a stale `navigate` variable (the component was possibly defined outside `DashboardPage` without access to the hook).

**Fix:** The `AdaptiveCoachingBanner` component (Task 4) must **always receive `onDetails` as a prop** from the calling page — it must not call `useNavigate` internally. This ensures the hook is called in a valid Router context (the page-level component). The Dashboard passes `onDetails={() => navigate('/diet')}` and the banner just calls `props.onDetails()` in the button's `onClick`.

**⚠️ If the banner was previously a local inline card with a broken navigate:**
```jsx
// BROKEN (previously): navigate was undefined or called incorrectly
<button onClick={() => window.location.href = '/diet'}>Details</button>
// or:
<button onClick={navigate('/diet')}>Details</button> // called immediately, not on click!

// CORRECT (after this fix):
<button onClick={() => navigate('/diet')}>Details →</button>
// where navigate = useNavigate() called at DashboardPage component level
```

---

## 🔌 TASK 7 — AppContext expose `applyAdaptiveAdjustment`

Verify the following is in the provider value:

```js
// In the value prop of <AppContext.Provider>:
applyAdaptiveAdjustment,
resetAdaptiveAdjustment,
```

And add to the destructuring in DietPage:
```js
const { ..., applyAdaptiveAdjustment, resetAdaptiveAdjustment, healthLogs } = useApp();
```

---

## 🗓️ Implementation Checklist

### Database
- [ ] Create `supabase/migrations/20260422_adaptive_coaching.sql`
- [ ] Run migration against Supabase project (or apply manually via Supabase Dashboard SQL Editor)
- [ ] Verify `adaptive_calorie_offset` column exists on `user_profiles` with `DEFAULT 0`

### adaptiveCalories.js
- [ ] Create `src/utils/adaptiveCalories.js` with full content from Task 2
- [ ] Verify `hasEnoughData(healthLogs)` returns `false` for < 4 logs or < 14-day span
- [ ] Verify `computeWeeklyRate` returns negative number for consistent weight loss
- [ ] Verify all 10 scenarios are covered in `SCENARIO_CONFIG`
- [ ] Verify cooldown logic prevents re-surfacing within 14 days of `lastAppliedAt`

### AppContext.jsx
- [ ] Add `adaptiveCalorieOffset: profile.adaptive_calorie_offset ?? 0` to user mapping
- [ ] Add `adaptiveLastAppliedAt: profile.adaptive_last_applied_at || null` to user mapping
- [ ] Add `adaptiveCalorieOffset` and `adaptiveLastAppliedAt` to `updateProfile` keyMap
- [ ] Implement `applyAdaptiveAdjustment(newOffset)` method
- [ ] Implement `resetAdaptiveAdjustment()` method
- [ ] Expose both in provider value

### SharedComponents.jsx — AdaptiveCoachingBanner
- [ ] Add all required Lucide imports (`ChevronRight`, `X`, `Zap`, `CheckCircle`, etc.)
- [ ] Implement `AdaptiveCoachingBanner` with `compact` and `full` variants
- [ ] Compact: label + headline + rate chip + "Details →" button calls `props.onDetails()`
- [ ] Full: label + headline + rate chip + X dismiss + body text + protein tip + change summary + CTA buttons
- [ ] Accent color is taken from `recommendation.accentColor` (scenario-specific)
- [ ] Radial glow behind card using `accentColor` at 10–15% opacity
- [ ] No hardcoded dark hex values — all backgrounds use `var()` tokens (light-theme safe)
- [ ] `loading` prop disables Apply button with "Applying…" label

### DietPage.jsx
- [ ] Import `useNavigate`, adaptive utils, `AdaptiveCoachingBanner`
- [ ] Add `adaptiveLoading`, `adaptiveDismissed` state
- [ ] Add `adaptiveOffset = user?.adaptiveCalorieOffset || 0`
- [ ] Add `adjustedGoalKcal = goalKcal + adaptiveOffset`
- [ ] Add `adaptiveRec` useMemo
- [ ] **Replace ALL uses of `goalKcal`** (rings, bars, summary, protein calc) with `adjustedGoalKcal`
- [ ] Insert `<AdaptiveCoachingBanner variant="full" ...>` above GOAL card
- [ ] Insert "Reset to Baseline" link below GOAL card header when offset ≠ 0
- [ ] Wire `handleAdaptiveApply` and `handleAdaptiveDismiss`
- [ ] `applyAdaptiveAdjustment` and `resetAdaptiveAdjustment` destructured from context

### DashboardPage.jsx
- [ ] Import `useNavigate`, adaptive utils, `AdaptiveCoachingBanner`
- [ ] Add `adaptiveDashDismissed` state
- [ ] Add `adaptiveRecDash` useMemo
- [ ] Insert `<AdaptiveCoachingBanner variant="compact" ...>` above Body Composition card
- [ ] Wire `onDetails={() => navigate('/diet')}` — this is the critical Details button fix
- [ ] Wire `onDismiss={handleDashAdaptiveDismiss}`
- [ ] Confirm `healthLogs` is destructured from `useApp()` in DashboardPage

---

## ✅ QA Scenarios

### Happy Path
- [ ] User with ≤ 3 weight logs: no banner appears on either page
- [ ] User with 4+ logs spanning ≥ 14 days + loss goal + flat weight: "Scale Has Stopped Moving" banner on both pages
- [ ] "Details →" on Dashboard banner navigates to `/diet` without page reload
- [ ] Compact banner on Dashboard shows: label, headline, rate chip, Details button
- [ ] Full banner on Diet page shows: label, headline, rate chip, X dismiss, body, protein tip (if applicable), change summary, Apply and Skip buttons
- [ ] Clicking "Apply" updates `user.adaptiveCalorieOffset` in Supabase and reflects immediately in GOAL card targets
- [ ] After applying: the "Scale Has Stopped Moving" banner disappears (cooldown)
- [ ] 14 days later (simulate by setting `lastAppliedAt` to 15 days ago in dev tools): banner reappears if weight still stagnant
- [ ] "Skip (7d)" hides banner on both pages for 7 days
- [ ] After 7 days (simulate by setting `dismissedAt` to 8 days ago in dev tools): banner reappears
- [ ] Optimal scenarios (`LOSS_OPTIMAL`, `GAIN_OPTIMAL`) show no "Apply" button, only "Got it"
- [ ] "Reset to Baseline" link appears when `adaptiveOffset ≠ 0`; clicking it zeros the offset and removes the link

### Edge Cases
- [ ] `healthLogs` is empty: no crash, no banner
- [ ] `user.weightGoal` is null: falls back to 'maintain' goal
- [ ] All weight logs on the same date (span = 0 days): no banner (< MIN_DAYS)
- [ ] Very large `adaptiveOffset` (e.g., +500): ring targets update correctly, no NaN
- [ ] `computeWeeklyRate` with only 4 logs returns a valid number (not null)
- [ ] Light theme: banner uses CSS variable backgrounds (no dark rgba artifacts)
- [ ] Mobile: banner is readable at 375px, buttons are ≥ 44px tall

### Regression
- [ ] DietPage macro rings still fill correctly after `goalKcal → adjustedGoalKcal` substitution
- [ ] DietPage protein nudge alert still fires correctly (uses `adjustedGoalKcal`-derived protein)
- [ ] DashboardPage body composition card is still visible and correctly positioned below the coaching banner
- [ ] Other cards on Dashboard are unaffected

---

## 🚫 Out of Scope

- Protein multiplier adjustment (protein is display-advice only — no stored offset)
- Push notifications for coaching triggers
- Real-time streaming of recommendation as weight is being logged (fires on next page visit)
- A/B testing different adjustment sizes
- Machine learning model (linear regression on ≤28 logs is sufficient and interpretable)
- Carbs/fat macro adjustment (calorie offset is distributed proportionally by DietPage's existing split logic)

---

## 🗒️ Implementation Notes

- **Why localStorage for dismiss state?** The dismiss is a UI preference, not a fitness metric. Storing it server-side would add an unnecessary Supabase column. If the user switches devices, the banner reappears — which is acceptable (they just tap dismiss again).
- **Why only calorie offset, not protein override?** Protein recommendations are already displayed as text advice in `proteinTip`. Storing a second number and propagating it through the diet calculations adds complexity for marginal benefit. The primary mechanism is calories.
- **Why not show `adjustedGoalKcal` on the Dashboard nutrition widget?** The Dashboard currently shows food logged vs a computed target. The adaptive offset should affect the same target so the rings are consistent. Verify the Dashboard's "Today's Nutrition" widget reads from the same source as DietPage. If it computes independently: also apply the offset there.
- **Linear regression vs simple 2-point slope:** Using `computeWeeklyRate` with regression is essential. A user who weighed 70kg two weeks ago and 69.8kg today would compute to −0.1 kg/week. But if their intermediate logs were 70.4, 70.1, 69.9, 69.8 — the trend is actually −0.25 kg/week (the last point was a water-retention low). Linear regression captures the true trend, not just endpoint comparison.
- **Duplicate banner dismissal:** Both Dashboard and DietPage share the same `dismissCoaching(userId)` call which writes to the same localStorage key. Dismissing on either page suppresses both. This is intentional.
- **`weeksOfData` prop in full banner:** Compute as `Math.round(daySpan / 7)` and display in the label ("Based on 4 weeks of data") to build trust in the recommendation.

---

## 📦 File Change Summary

| File | Change Type | What Changes |
|------|-------------|--------------|
| `supabase/migrations/20260422_adaptive_coaching.sql` | **[NEW]** | Adds `adaptive_calorie_offset` and `adaptive_last_applied_at` to `user_profiles` |
| `src/utils/adaptiveCalories.js` | **[NEW]** | Full coaching engine: trend classification, 10 scenarios, state helpers |
| `src/context/AppContext.jsx` | **Additive** | User mapping + `updateProfile` keyMap + 2 new methods |
| `src/components/shared/SharedComponents.jsx` | **Additive** | New `AdaptiveCoachingBanner` export (compact + full variants) |
| `src/components/pages/DietPage.jsx` | **Moderate edit** | Coaching banner insertion, `goalKcal → adjustedGoalKcal` substitution, reset link |
| `src/components/pages/DashboardPage.jsx` | **Moderate edit** | Compact banner insertion above body comp, "Details" button fix via `navigate('/diet')` |

---

## ⚠️ GAPS IDENTIFIED (Codebase Audit — 2026-04-22)

> **Context:** An implementation already exists in the codebase that predates this TODO. The audit below compares the planned vs actual architecture and identifies what needs to change.

### Architecture Divergence

The TODO above describes a **planned** architecture. The **actual codebase** already has a different, working implementation:

| Aspect | TODO (Planned) | Actual (Live Code) |
|--------|---------------|-------------------|
| **Engine file** | `src/utils/adaptiveCalories.js` — 10 named scenarios, offset model | `src/utils/adaptiveCalories.js` — S1–S10 numbered scenarios, direct `customGoalKcal` overwrite |
| **Scenario IDs** | `LOSS_WRONG_DIR`, `LOSS_STAGNANT`, `LOSS_TOO_SLOW`, etc. | `S1` (too fast loss), `S2` (stall), `S3` (wrong dir), `S4` (too fast gain), `S5` (not gaining), `S6` (on track), `S7` (drift up), `S8` (drift down), `S10` (insufficient data) |
| **Banner component** | `AdaptiveCoachingBanner` in `SharedComponents.jsx` | `AdaptiveDietBanner.jsx` — standalone file |
| **Storage model** | `adaptive_calorie_offset` + `adaptive_last_applied_at` columns on `user_profiles` | `customGoalKcal` + `customProteinG` + `lastKcalSuggestionDate` on `user_profiles`; `fittrack_last_suggestion_date` in localStorage |
| **Cooldown** | 14 days, Supabase-backed | 7 days, localStorage |
| **AppContext** | `applyAdaptiveAdjustment()`, `resetAdaptiveAdjustment()` | `acceptSuggestion(newKcal, newProtein)`, `dismissSuggestion()` |
| **Supabase migration** | `20260422_adaptive_coaching.sql` — new columns | Not needed — uses existing `custom_goal_kcal`, `custom_protein_g`, `last_kcal_suggestion_date` |

**Decision:** Keep the existing engine as runtime. Adopt the TODO's improvements as targeted patches.

### Side-by-Side Engine Comparison

| Aspect | Existing (Live) | TODO Spec | Better |
|--------|----------------|-----------|--------|
| Data gate | 5 logs, 14 days | 4 logs, 14 days | Existing (more reliable regression) |
| Regression math | Least-squares (`sumXY/sumXX`) | Least-squares (mean-centered) | Tie (mathematically identical) |
| Confidence output | `low/medium/high` based on log count | None | Existing |
| Loss "wrong direction" adjust | -250 to -400 kcal | -200 kcal | TODO (safer) |
| Loss "stagnant" adjust | -200 kcal (needs 7+ logs) | -150 kcal | TODO (more conservative) |
| **Loss "too slow"** | **Missing entirely** | -100 kcal (rate -0.05 to -0.15) | **TODO (real gap)** |
| Gain thresholds | BW% based | Absolute kg/week | TODO (clearer) |
| Maintenance triggers | Rate-based (>0.3 kg/week) | Delta from profile (±1.5 kg) | TODO |
| Max adjustment size | -400 kcal (aggressive) | -200 kcal (conservative) | TODO |
| Floor/ceiling safety | 1200F/1400M floor, TDEE+600 ceiling | None | Existing |
| Macro recomputation | `recomputeMacros()` shows exact new P/C/F | Relies on DietPage split logic | Existing |
| Dismiss vs accept | Same cooldown for both | Separate mechanisms | TODO |
| Goal detection | Uses `calcDeficit()` (accounts for goalWeeks) | Simple weight delta | Existing |

### Hybrid Fix Plan — Adopt into Existing Engine

#### Fix 1: Add `LOSS_TOO_SLOW` scenario (NEW)

**File:** `src/utils/adaptiveCalories.js` — `classifyScenario()`

The existing engine jumps from "abs(rate) < 0.1 → stall (S2)" to "rate < -0.1 → on track (S6)". There's no intermediate nudge. Add a new `S2b` (or rename to maintain S-numbering):

```js
// After the S2 stall check, before the S6 on-track check, add:
// S2b: Losing but too slowly (between stall and optimal)
if (rateKgPerWeek < -0.05 && Math.abs(rateKgPerWeek) < 0.15) {
  return {
    scenario: 'S2b',
    severity: 'warning',
    adjustKcal: -100,
    message: 'Progress is too slow',
    reasoning: `You're losing ${Math.abs(rateKgPerWeek).toFixed(2)} kg/week — below the optimal 0.25 kg/week pace. A small 100 kcal reduction keeps momentum without feeling deprived.`,
  };
}
```

#### Fix 2: Cap adjustments at ±200 kcal

**File:** `src/utils/adaptiveCalories.js` — `classifyScenario()`

- **S1** (too fast loss): Change `adjust = bwPct > 1.5 ? 250 : 150` → cap at `+200`
- **S3** (wrong direction): Change `adjust = rateKgPerWeek > 0.3 ? -400 : -250` → cap at `-200`
- **S4** (too fast gain): Change `adjust = bwPct > 0.8 ? -250 : -150` → cap at `-200`

#### Fix 3: Separate dismiss vs accept cooldown

**File:** `src/utils/adaptiveCalories.js` — Add new helpers:

```js
const DISMISS_KEY = 'fittrack_coaching_dismissed_at_';

export function dismissCoaching(userId) {
  try {
    localStorage.setItem(DISMISS_KEY + userId, new Date().toISOString());
  } catch { /* quota */ }
}

export function isCoachingDismissed(userId, suppressDays = 7) {
  try {
    const raw = localStorage.getItem(DISMISS_KEY + userId);
    if (!raw) return false;
    return (Date.now() - new Date(raw)) / 86400000 < suppressDays;
  } catch { return false; }
}
```

**File:** `src/context/AppContext.jsx`
- `dismissSuggestion()` should call `dismissCoaching(user.id)` instead of setting `lastSuggestionDate`
- `acceptSuggestion()` continues to set `lastSuggestionDate` (7-day cooldown for re-evaluation)
- `adaptiveSuggestion` useMemo should check both: `!checkSuggestionCooldown(...)` AND `!isCoachingDismissed(user.id)`

#### Fix 4: "Details →" button broken (CRITICAL)

**File:** `src/components/shared/AdaptiveDietBanner.jsx` line 65

**Root cause:** `window.location.hash = '#/diet'` assumes hash routing. App uses `BrowserRouter`.

**Fix:** Accept `onDetails` prop. Replace line 65:
```jsx
// BEFORE (broken):
onClick={() => window.location.hash = '#/diet'}

// AFTER (fixed):
onClick={onDetails}
```

**File:** `src/components/pages/DashboardPage.jsx` — pass the prop:
```jsx
<AdaptiveDietBanner
  ...
  compact
  onDetails={() => navigate('/diet')}
/>
```

#### Fix 5: Dashboard banner is in the wrong position (CRITICAL)

**File:** `src/components/pages/DashboardPage.jsx`

Banner currently renders at **line ~696** (after weight trend chart). Must move to **directly above line ~460** (`{/* Row 2: Body Composition */}`).

Move the entire IIFE block (lines 696–731) to just before `{/* Row 2: Body Composition */}`.

#### Fix 6: DietPage banner is in the wrong position (CRITICAL)

**File:** `src/components/pages/DietPage.jsx`

Banner currently renders at **line ~572** inside `activeTab === 'guide'` conditional. Must move to **above line ~477** (`{/* GOAL SECTION WRAPPER */}`), outside any tab conditional.

Move both the action banner and the on-track banner blocks to just before `{/* GOAL SECTION WRAPPER */}`.

#### Fix 7: Banner CSS uses non-existent tokens

**File:** `src/components/shared/AdaptiveDietBanner.jsx`

- **Line 180:** `background: 'linear-gradient(135deg, var(--ember-start), var(--ember-end))'` — these variables DON'T EXIST in `index.css`
- **Fix:** Change to `background: 'var(--signature-gradient)'`
- **Lines 4–14:** `var(--error)` used for S1/S3 → standardise to `var(--danger)` (#FF6B6B) for consistency with the rest of the app's error states
- **Remove** `className="glass-card"` from line 83 to avoid uncontrolled z-index from global CSS rules

#### Fix 8: Redesign banner to match Kinetic Elite

**File:** `src/components/shared/AdaptiveDietBanner.jsx` — full rewrite

The compact variant is too basic. Upgrade both variants to match the premium aesthetic:
- Add `⚡ Adaptive Coach` label (9px, uppercase, letter-spacing 0.15em)
- Add radial glow in top-right corner using scenario accent color at 10% opacity
- Use `Space Grotesk` for headlines and rate values
- Use `Be Vietnam Pro` for body text and labels
- Add weekly rate chip with scenario-tinted background
- Full variant: include protein tip section, current→suggested kcal comparison strip
- Replace `glass-card` class with explicit `var(--surface-container-low)` background
- CTA button: use `var(--signature-gradient)` instead of non-existent ember tokens

### Updated File Change Summary

| File | Change Type | What Changes |
|------|-------------|--------------|
| `src/utils/adaptiveCalories.js` | **Patch** | Add S2b (LOSS_TOO_SLOW), cap adjustments at ±200, add `dismissCoaching`/`isCoachingDismissed` helpers |
| `src/components/shared/AdaptiveDietBanner.jsx` | **Rewrite** | Premium Kinetic Elite redesign, accept `onDetails` prop, fix CSS tokens, remove glass-card class |
| `src/context/AppContext.jsx` | **Patch** | Wire `dismissCoaching()` into `dismissSuggestion`, add `isCoachingDismissed` check to `adaptiveSuggestion` memo |
| `src/components/pages/DashboardPage.jsx` | **Move + wire** | Move banner block from line ~696 to above body comp card (~460), pass `onDetails={() => navigate('/diet')}` |
| `src/components/pages/DietPage.jsx` | **Move** | Move banner from inside `guide` tab to above GOAL card, visible on all tabs |

### Implementation Order

1. `adaptiveCalories.js` — engine patches (S2b, caps, dismiss helpers)
2. `AdaptiveDietBanner.jsx` — full rewrite with Kinetic Elite styling
3. `AppContext.jsx` — wire dismiss separation
4. `DashboardPage.jsx` — move banner + pass `onDetails`
5. `DietPage.jsx` — move banner above GOAL card
6. Browser verification on both pages

### Verification Checklist

- [ ] Dashboard: adaptive banner appears **above** Body Composition card
- [ ] Dashboard: "Details →" button navigates to `/diet` without page reload
- [ ] Diet page: adaptive banner appears **above** the GOAL card
- [ ] Diet page: banner is visible on Daily Tracker tab (not just Meal Guide)
- [ ] CTA "Update Targets" button has ember gradient background (not transparent/broken)
- [ ] Compact banner shows: "⚡ Adaptive Coach" label, headline, rate chip, Details button
- [ ] Full banner shows: label, headline, body text, protein tip (if applicable), change comparison, CTA buttons
- [ ] S2b scenario fires when rate is between -0.05 and -0.15 kg/week
- [ ] No adjustment exceeds ±200 kcal
- [ ] Dismissing banner = hides for 7 days but doesn't reset accept cooldown
- [ ] Accepting suggestion = sets cooldown; banner reappears after 7 days if trend persists
- [ ] Light theme: all backgrounds use CSS variables, no dark artifacts