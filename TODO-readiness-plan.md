# FitTrack Pro — TODO: Readiness Score Widget (Dashboard)
> **Feature:** Daily Readiness Score — Dashboard Widget
> **Created:** 2026-04-01
> **Reference:** Stitch "Visual Recovery Dashboard" design + FitTrack Pro Kinetic Elite system
> **Effort:** 🟡 Medium · **Impact:** 🔴 Very High
> **Files affected:**
>   - `src/utils/readinessUtils.js` [NEW]
>   - `src/context/AppContext.jsx` [ADDITIVE — 3 small changes]
>   - `src/components/shared/ReadinessCheckIn.jsx` [NEW]
>   - `src/components/pages/DashboardPage.jsx` [MODIFY — replace Iron League widget]

---

## 🔍 Gap Analysis (Verified Against Codebase — 2026-04-01)

The following gaps were identified by cross-referencing this plan against the actual source files.
Each gap is also annotated inline at the relevant task.

| # | Gap | Severity | Location |
|---|-----|----------|----------|
| G1 | `mini={false}` on `BodyMapSVG` renders **two side-by-side canvases** (Front + Back) with "Front"/"Back" labels, not a single silhouette | 🔴 Critical | Task 4d, Layer 1 |
| G2 | Pre-Conditions table label **"MiniBodyMap stays"** directly contradicts the detail cell which says it is **removed** | 🟡 Clarity | Pre-Conditions |
| G3 | `DashboardPage.jsx` imports `MiniBodyMap` as a **named export** on L7; the default `BodyMapSVG` is **not imported** — Task 4a must update L7, not just add a new import line | 🔴 Critical | Task 4a |
| G4 | `muscleXP` already exists in DashboardPage (L29). The widget JSX reuses it — plan must flag this as **reuse, not re-declare** (a duplicate `const` would error) | 🟠 High | Task 4c / 4d |
| G5 | `MUSCLE_LABELS` defines `back: 'Back (Lats)'` and `abs: 'Core'` but `MUSCLE_GROUPS` in `muscleData.js` uses `back: 'Back'` and `abs: 'Abs'` — inconsistency visible to users navigating between pages | 🟡 Medium | Task 1 |
| G6 | Light-theme chip fix is documented in **Implementation Notes only** — the JSX in Task 4d still uses hardcoded `rgba(14, 14, 16, 0.82)` which breaks light mode | 🟠 High | Task 4d, Layer 4 |
| G7 | `useEffect` deps `[todayReadiness, user?.id]` — React ESLint will warn because `todayReadiness` is a `useMemo` result, not a primitive; the actual dep is `readinessLog` | 🟡 Medium | Task 4c |
| G8 | `ReadinessCheckIn` uses fixed `zIndex: 1001` but Dashboard modals also use `Portal` — `ReadinessCheckIn` **must** use `Portal` to guarantee correct layer order | 🟠 High | Task 2 / 4d |
| G9 | `logReadiness` is defined as a plain `const` in AppContext but all other mutations use `useCallback` — missing wrapper causes unnecessary re-renders | 🟡 Medium | Task 3 |
| G10 | After Iron League widget removal, `weeklyMuscles` (L28) and `overallRank` (L30) on Dashboard become **dead computations** — plan must include a cleanup item | 🟡 Medium | Task 4e |
| G11 | `src/utils/readinessUtils.js` — `src/utils/` already exists but is not stated; no ambiguity about path, just a clarity note | 🟢 Low | Task 1 |
| G12 | No handling documented when `spotlightMuscles.length === 0` at render time (race condition before `muscleStatuses` resolves) | 🟡 Medium | Task 4d, Layer 4 |

---

## 🎯 Goal

Replace the "Iron League" widget at the bottom of `DashboardPage.jsx` with a
**Daily Readiness Score** card that matches the Stitch "Visual Recovery Dashboard"
visual language:

- A large dark-tinted body map figure as the card background
- Glassmorphic score badge (top-left) showing the 0–100 readiness score
- Color legend (top-right): Recovered / Fatigued / Critical
- Per-muscle recovery status chips floating along the bottom
- Score computed from objective training load data + optional 30-second check-in

---

## ⚠️ Pre-Conditions — Zero New Dependencies

| Constraint | Detail |
|---|---|
| BodyMapSVG — NO changes | The body figure is rendered by the existing `BodyMapSVG` component with a CSS filter applied to its container. Zero modifications to `BodyMapSVG.jsx`. |
| No Tailwind | All styles use inline styles + existing CSS tokens (`var(--surface-container-low)`, etc.) |
| No Material Symbols | The Stitch reference uses Material Symbols. FitTrack Pro uses Lucide React exclusively. Replacements: `local_fire_department → Flame`, `water_drop → Droplets`, `notifications → Bell` |
| ~~MiniBodyMap stays~~ → **MiniBodyMap removed** | **⚠️ GAP-G2 (contradictory label fixed):** `MiniBodyMap` is **removed** from `DashboardPage.jsx` imports entirely. `BodyMapSVG` (the default export) is used instead for the readiness card. The Pre-Conditions table previously said "stays" in the key column — this was a copy error. |

---

## 🔬 Key Visual Decoding (Stitch → FitTrack Pro)

The Stitch screenshot has 4 distinct layers inside a single card:

### Layer 1 — Dark Body Figure (Card background)
**Stitch uses:** A 3D wireframe AI-rendered body image with `grayscale + mix-blend-screen`
**FitTrack Pro uses:** `<BodyMapSVG>` wrapped in a div with:
```css
filter: grayscale(50%) brightness(0.45) contrast(1.1)
```
This mutes the coral-red highlights and teal body into a dark grey silhouette,
matching the Stitch wireframe aesthetic closely without any AI image dependency.
The canvas aspect ratio is 1:2 (640×1280 → renders at container width × 2× height).
Wrap `<BodyMapSVG>` in `maxWidth: 260, margin: '0 auto'` to keep it centered and
proportional inside the card.

### Layer 2 — Score Badge (absolute, top-left)
**Matches:** `"84% / OVERALL READINESS"` chip from Stitch
```jsx
// Glassmorphic chip — top-left of the card
position: 'absolute', top: 20, left: 20, zIndex: 10
background: 'rgba(20, 20, 22, 0.75)'
backdropFilter: 'blur(16px)'
borderRadius: 16
padding: '12px 16px'
// Inner: score number in var(--primary), "OVERALL READINESS" label below
```
Score number styling:
```js
fontFamily: "'Space Grotesk', sans-serif"
fontSize: '2.2rem', fontWeight: 800, color: tier.color
lineHeight: 1
```

### Layer 3 — Color Legend (absolute, top-right)
**Matches:** 3 stacked chips "● RECOVERED / ● FATIGUED / ● CRITICAL" from Stitch
```jsx
position: 'absolute', top: 20, right: 20, zIndex: 10
display: 'flex', flexDirection: 'column', gap: 6
```
Each legend item:
```jsx
// One chip per status
background: 'rgba(20, 20, 22, 0.7)', backdropFilter: 'blur(12px)'
borderRadius: 10, padding: '5px 10px'
display: 'flex', alignItems: 'center', gap: 6
fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase'
color: 'var(--on-surface)'
// Dot: width 8, height 8, borderRadius '50%', background: statusColor
// Dot also has: boxShadow: `0 0 8px ${statusColor}80`
```
Status colors (consistent across widget):
- `optimal` / recovered: `'#4ADE80'` (green)
- `fatigued`: `'#FBBF24'` (amber)
- `critical`: `'#F87171'` (soft red — NOT the harsh `#FF0000`)

### Layer 4 — Muscle Recovery Chips (absolute, bottom of card)
**Matches:** "QUADS: Optimal", "LOWER BACK: 92h Rest", "DELTOIDS: Prime" chips from Stitch
```jsx
// Container — pinned to bottom of the card body, inside a gradient fade
position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 10
// Gradient fade from transparent to card background, masking the body figure
background: 'linear-gradient(to bottom, transparent 0%, rgba(20,20,22,0.9) 60%, #131315 100%)'
padding: '48px 20px 20px' // top padding creates the fade space
display: 'flex', flexWrap: 'wrap', gap: 10
```
Each muscle chip (left-border accent style matching Stitch exactly):
```jsx
background: 'rgba(20, 20, 22, 0.8)'
backdropFilter: 'blur(12px)'
borderRadius: 12
padding: '10px 14px'
borderLeft: `3px solid ${statusColor}`
// Top line: muscle name — label-md style, var(--on-surface-variant)
// Bottom line: status label — 'Space Grotesk', fontWeight 700, fontSize 15, var(--on-surface)
```

---

## 🧮 TASK 1 — `src/utils/readinessUtils.js` [NEW]

This file exports everything the Dashboard widget needs. No imports from React.
```js
// ─── CONSTANTS ────────────────────────────────────────────────

export const READINESS_TIERS = [
  { min: 80, label: 'Optimal',  color: '#4ADE80', message: "Go heavy. This is your window." },
  { min: 60, label: 'Good',     color: '#FBBF24', message: "Solid session. Moderate intensity." },
  { min: 40, label: 'Moderate', color: '#F85F1B', message: "Light session or active recovery." },
  { min: 0,  label: 'Low',      color: '#F87171', message: "Rest day. Your body is building." },
];

export const getTier = (score) =>
  READINESS_TIERS.find(t => score >= t.min) ?? READINESS_TIERS[READINESS_TIERS.length - 1];

// ⚠️ GAP-G5: Labels below must match the display names used in MUSCLE_GROUPS (muscleData.js).
// muscleData.js uses `back: 'Back'` and `abs: 'Abs'` — align these or users will see
// different names for the same muscle group on different pages.
// CORRECTED values below (matching muscleData.js MUSCLE_GROUPS):
export const MUSCLE_LABELS = {
  chest: 'Chest', back: 'Back', shoulders: 'Deltoids',
  biceps: 'Biceps', triceps: 'Triceps', traps: 'Traps',
  quads: 'Quads', hamstrings: 'Hamstrings', glutes: 'Glutes',
  calves: 'Calves', abs: 'Abs', forearms: 'Forearms',
};

export const STATUS_COLORS = {
  optimal:  '#4ADE80',
  fatigued: '#FBBF24',
  critical: '#F87171',
};


// ─── MUSCLE RECOVERY STATUS ────────────────────────────────────
// Returns: { [muscleKey]: { status, hoursSince, label } }
// Uses the same 3-priority fallback chain as calcAllMuscleXP.
// Does NOT modify any existing util — this is a new standalone fn.

export function getMuscleRecoveryStatuses(workoutLogs, splits, userId) {
  const now = new Date();

  // Build exercise→primaryMuscle lookup from splits
  const exPrimaryMap = {};
  splits.forEach(split =>
    split.days?.forEach(day =>
      day.exercises?.forEach(ex => {
        if (ex.primaryMuscle && ex.name) exPrimaryMap[ex.name] = ex.primaryMuscle;
      })
    )
  );

  // Filter and sort user logs newest-first
  const userLogs = [...workoutLogs]
    .filter(l => l.userId === userId)
    .sort((a, b) => b.date.localeCompare(a.date));

  // Find most recent training date per muscle
  const lastTrainedMs = {}; // muscleKey → timestamp (ms)

  for (const log of userLogs) {
    const logTime = new Date(log.date + 'T00:00:00').getTime();
    for (const ex of (log.exercises || [])) {
      const completedSets = (ex.sets || []).filter(s => s.done !== false && s.reps > 0);
      if (completedSets.length === 0) continue;

      // Priority 1: split-based lookup
      // Priority 2: log exercise's own primaryMuscle field
      // Priority 3: log exercise's own muscle field (display name) — skip for now (label-only)
      const primary = exPrimaryMap[ex.name] || ex.primaryMuscle || null;
      if (primary && !lastTrainedMs[primary]) {
        lastTrainedMs[primary] = logTime;
      }
      for (const sec of (ex.secondaryMuscles || [])) {
        if (!lastTrainedMs[sec]) lastTrainedMs[sec] = logTime;
      }
    }
  }

  // Build status objects for all 12 muscle keys
  const ALL_MUSCLES = Object.keys(MUSCLE_LABELS);
  const result = {};

  for (const muscle of ALL_MUSCLES) {
    const lastMs = lastTrainedMs[muscle];
    if (!lastMs) {
      result[muscle] = { status: 'optimal', hoursSince: null, label: 'Fresh' };
      continue;
    }
    const hoursSince = (now.getTime() - lastMs) / 3600000;
    let status, label;
    if (hoursSince < 24) {
      status = 'critical';
      label = `${Math.round(hoursSince)}h Rest`;
    } else if (hoursSince < 48) {
      status = 'fatigued';
      label = `${Math.round(hoursSince)}h Rest`;
    } else {
      status = 'optimal';
      label = 'Optimal';
    }
    result[muscle] = { status, hoursSince, label };
  }

  return result;
}


// ─── OBJECTIVE READINESS (from training data only) ────────────
// 0–100 score based purely on workout history.
// Called even when check-in hasn't been completed.

export function calcObjectiveReadiness(workoutLogs, userId) {
  const now = new Date();

  const userLogs = workoutLogs.filter(l => l.userId === userId);

  const logVolume = (log) =>
    (log.exercises || []).reduce((t, ex) =>
      t + (ex.sets || []).reduce((s, set) =>
        s + (set.reps || 0) * Math.max(set.weight || 0, 0), 0), 0);

  // 7-day rolling average (baseline)
  const d7Ago = new Date(now); d7Ago.setDate(d7Ago.getDate() - 7);
  const weekLogs = userLogs.filter(l =>
    new Date(l.date + 'T00:00:00') >= d7Ago
  );
  const avgDailyVol = weekLogs.length > 0
    ? weekLogs.reduce((t, l) => t + logVolume(l), 0) / 7
    : 0;

  // Last 3 days volume
  const d3Ago = new Date(now); d3Ago.setDate(d3Ago.getDate() - 3);
  const recentLogs = userLogs.filter(l =>
    new Date(l.date + 'T00:00:00') >= d3Ago
  );
  const recentVol = recentLogs.reduce((t, l) => t + logVolume(l), 0);

  // Load ratio: how hard were the last 3 days vs weekly baseline?
  const loadRatio = avgDailyVol > 0
    ? recentVol / (avgDailyVol * 3)
    : recentLogs.length > 0 ? 1.0 : 0.3; // 0.3 = fresh/new user

  // Load → base score
  let loadScore;
  if (loadRatio > 1.5)      loadScore = 38;
  else if (loadRatio > 1.2) loadScore = 58;
  else if (loadRatio > 0.9) loadScore = 72;
  else if (loadRatio > 0.5) loadScore = 86;
  else                      loadScore = 95; // well rested

  // Rest gap bonus
  const latestLog = [...userLogs].sort((a, b) => b.date.localeCompare(a.date))[0];
  let restBonus = 0;
  if (!latestLog) {
    restBonus = 10; // never trained → fresh
  } else {
    const daysSince = Math.floor(
      (now - new Date(latestLog.date + 'T00:00:00')) / 86400000
    );
    if (daysSince === 0)      restBonus = 0;   // trained today
    else if (daysSince === 1) restBonus = 4;   // trained yesterday
    else if (daysSince === 2) restBonus = 8;   // 1 rest day (ideal)
    else                      restBonus = 4;   // 2+ rest days (slight detrain offset)
  }

  // Overtraining penalty (6+ sessions in 7 days)
  const penalty = weekLogs.length >= 6 ? 14 : weekLogs.length >= 5 ? 6 : 0;

  return {
    score: Math.round(Math.min(100, Math.max(0, loadScore + restBonus - penalty))),
    loadRatio,
  };
}


// ─── FULL SCORE (objective + check-in) ────────────────────────

export function calcReadinessScore(checkIn, objectiveScore) {
  // Sleep: 4–10h mapped to 0–100
  const sleepScore = (() => {
    const h = checkIn.sleepHours;
    if (h >= 8) return 100;
    if (h >= 7) return 88;
    if (h >= 6) return 68;
    if (h >= 5) return 44;
    return 20;
  })();

  // Energy: 1–5 → 0–100
  const energyScore = (checkIn.energyLevel - 1) * 25;

  // Soreness
  const sorenessScore = { none: 100, mild: 60, significant: 25 }[checkIn.sorenessLevel] ?? 60;

  // Stress
  const stressScore = { low: 100, medium: 62, high: 28 }[checkIn.stressLevel] ?? 62;

  // Weighted subjective blend
  const subjective =
    sleepScore    * 0.35 +
    energyScore   * 0.30 +
    sorenessScore * 0.20 +
    stressScore   * 0.15;

  // 40% objective (training history) + 60% subjective (check-in feelings)
  return Math.round(Math.min(100, Math.max(0, objectiveScore * 0.40 + subjective * 0.60)));
}


// ─── SPOTLIGHT MUSCLES (for the bottom chips) ─────────────────
// Returns 3–4 muscles worth showing in the widget.
// Priority: Critical first, then Fatigued, then one Optimal muscle.

export function getSpotlightMuscles(muscleStatuses, limit = 4) {
  const all = Object.entries(muscleStatuses)
    .map(([key, val]) => ({ key, ...val }));

  const critical = all.filter(m => m.status === 'critical');
  const fatigued = all.filter(m => m.status === 'fatigued');
  // Pick one fresh muscle (the most recently trained that is now optimal, or just any)
  const optimal = all
    .filter(m => m.status === 'optimal' && m.hoursSince !== null)
    .sort((a, b) => a.hoursSince - b.hoursSince) // most recently recovered first
    .slice(0, 1);

  const combined = [...critical, ...fatigued, ...optimal].slice(0, limit);

  // If nothing was ever trained (all "Fresh"), show top 3 muscle groups as Fresh
  if (combined.length === 0) {
    return all.slice(0, 3);
  }

  return combined;
}
```

---

## 🪟 TASK 2 — `src/components/shared/ReadinessCheckIn.jsx` [NEW]

A bottom-sheet modal with 4 questions. Auto-advances on selection.
Calls `logReadiness(entry)` from `useApp()` when complete.
```jsx
import { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { calcReadinessScore, getTier } from '../../utils/readinessUtils';

export default function ReadinessCheckIn({ objectiveScore, onClose }) {
  const { user, logReadiness } = useApp();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({
    sleepHours: null,
    energyLevel: null,
    sorenessLevel: null,
    stressLevel: null,
  });
  const [visible, setVisible] = useState(false);
  const [finalScore, setFinalScore] = useState(null);

  // Slide-up animation on mount
  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const close = () => {
    setVisible(false);
    setTimeout(onClose, 320);
  };

  const answer = (field, value) => {
    const updated = { ...answers, [field]: value };
    setAnswers(updated);

    if (step < 3) {
      setTimeout(() => setStep(s => s + 1), 220);
    } else {
      // Final step — compute and save
      const score = calcReadinessScore(updated, objectiveScore);
      setFinalScore(score);
      const today = new Date().toISOString().split('T')[0];
      logReadiness({
        userId: user.id,
        date: today,
        ...updated,
        score,
        objectiveScore,
        checkInComplete: true,
      });
      setTimeout(close, 2200); // show score for 2.2s then close
    }
  };

  // ── Question definitions ──────────────────────────────────────
  const questions = [
    {
      field: 'sleepHours',
      label: 'How much did you sleep last night?',
      options: [
        { label: '< 5h', value: 4.5 },
        { label: '5–6h', value: 5.5 },
        { label: '6–7h', value: 6.5 },
        { label: '7–8h', value: 7.5 },
        { label: '8–9h', value: 8.5 },
        { label: '9h+',  value: 9.5 },
      ],
    },
    {
      field: 'energyLevel',
      label: "How's your energy right now?",
      options: [
        { label: '😴 Drained', value: 1 },
        { label: '😪 Low',     value: 2 },
        { label: '😐 Okay',    value: 3 },
        { label: '💪 Good',    value: 4 },
        { label: '⚡ Peak',    value: 5 },
      ],
    },
    {
      field: 'sorenessLevel',
      label: 'Any muscle soreness today?',
      options: [
        { label: 'None — feeling fresh',          value: 'none' },
        { label: 'Mild — slight stiffness',       value: 'mild' },
        { label: 'Significant — clearly sore',   value: 'significant' },
      ],
    },
    {
      field: 'stressLevel',
      label: 'Mental stress level today?',
      options: [
        { label: '😌 Chill',    value: 'low' },
        { label: '😤 Some',     value: 'medium' },
        { label: '🥵 Stressed', value: 'high' },
      ],
    },
  ];

  const q = questions[step];

  // ── Render ───────────────────────────────────────────────────
  return (
    <>
      {/* Backdrop */}
      <div
        onClick={close}
        style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)',
          backdropFilter: 'blur(4px)', zIndex: 1000,
        }}
      />

      {/* Sheet */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1001,
        background: 'var(--surface-container-low)',
        borderRadius: '24px 24px 0 0',
        padding: '24px 24px 40px',
        maxHeight: '80vh', overflowY: 'auto',
        transform: visible ? 'translateY(0)' : 'translateY(100%)',
        transition: 'transform .32s cubic-bezier(.4,0,.2,1)',
      }}>
        {/* Drag handle */}
        <div style={{
          width: 40, height: 4, borderRadius: 2,
          background: 'var(--surface-container-highest)',
          margin: '0 auto 24px',
        }} />

        {finalScore !== null ? (
          /* ── Score reveal ── */
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <div style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '5rem', fontWeight: 800, lineHeight: 1,
              color: getTier(finalScore).color,
              marginBottom: 8,
            }}>
              {finalScore}
            </div>
            <div style={{
              fontSize: 12, fontWeight: 700, textTransform: 'uppercase',
              letterSpacing: '0.15em', color: 'var(--on-surface-variant)',
              marginBottom: 8,
            }}>
              Readiness Score
            </div>
            <div style={{ fontSize: 14, color: 'var(--on-surface-variant)' }}>
              {getTier(finalScore).message}
            </div>
          </div>
        ) : (
          /* ── Questions ── */
          <>
            {/* Progress dots */}
            <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginBottom: 28 }}>
              {questions.map((_, i) => (
                <div key={i} style={{
                  width: i <= step ? 20 : 8, height: 8, borderRadius: 4,
                  background: i <= step ? 'var(--primary-container)' : 'var(--surface-container-highest)',
                  transition: 'all .3s var(--ease-smooth)',
                }} />
              ))}
            </div>

            {/* Question */}
            <div style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700, fontSize: '1.1rem',
              color: 'var(--on-surface)', marginBottom: 20, lineHeight: 1.3,
            }}>
              {q.label}
            </div>

            {/* Options */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {q.options.map(opt => (
                <button key={opt.value} onClick={() => answer(q.field, opt.value)}
                  style={{
                    padding: '14px 18px', borderRadius: 14, border: 'none',
                    background: answers[q.field] === opt.value
                      ? 'linear-gradient(135deg, #FFB59B, #F85F1B)'
                      : 'var(--surface-container-highest)',
                    color: answers[q.field] === opt.value ? '#fff' : 'var(--on-surface)',
                    fontSize: 14, fontWeight: 600, cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all .18s var(--ease-smooth)',
                  }}>
                  {opt.label}
                </button>
              ))}
            </div>

            {/* Skip */}
            <button onClick={close} style={{
              display: 'block', margin: '20px auto 0',
              background: 'none', border: 'none',
              fontSize: 12, color: 'var(--on-surface-dim)',
              cursor: 'pointer', fontWeight: 600,
              textTransform: 'uppercase', letterSpacing: '0.08em',
            }}>
              Skip today
            </button>
          </>
        )}
      </div>
    </>
  );
}
```

---

## 🗄️ TASK 3 — `AppContext.jsx` Additions [ADDITIVE ONLY — 3 changes]

> **⚠️ GAP-G9:** All existing mutations in AppContext (`setActiveSplitId`, `getStreak`, `login`, `logout`) use `useCallback`. The new `logReadiness` must also be wrapped in `useCallback` to prevent unnecessary downstream re-renders.

**Change A — add `readinessLog` to initial state (alongside `weightLog`):**
```js
// In the useState / useLocalStorage initialization block:
const [readinessLog, setReadinessLog] = useLocalStorage('fittrack_readiness', []);
```

**Change B — add `logReadiness` helper:**
```js
// Upserts — one entry per user per date
// ⚠️ GAP-G9 FIX: wrap in useCallback (import useCallback is already imported on L1)
const logReadiness = useCallback((entry) => {
  setReadinessLog(prev => {
    const filtered = prev.filter(
      r => !(r.userId === entry.userId && r.date === entry.date)
    );
    return [...filtered, { ...entry, id: entry.id || `${entry.userId}_${entry.date}` }];
  });
}, [setReadinessLog]);
```

**Change C — expose in context value:**
```js
// In the context value object (same spot as logWeight, addToast, etc.):
readinessLog,
logReadiness,
```

---

## 📊 TASK 4 — `DashboardPage.jsx` Widget Replacement

### 4a — New Imports

> **⚠️ GAP-G3:** `DashboardPage.jsx` L7 currently imports `{ MiniBodyMap }` as a named export from `BodyMapSVG.jsx`. The default export `BodyMapSVG` is **not imported**. You must **replace** L7 entirely — do not add a second import from the same file (ESLint will error).

```js
// REPLACE L7 (currently: import { MiniBodyMap } from '../shared/BodyMapSVG';)
// With:
import BodyMapSVG from '../shared/BodyMapSVG';  // default export — the dual front+back canvas renderer
// Note: MiniBodyMap named export is removed from Dashboard since the Iron League widget is gone.

// ADD new icons to the existing lucide-react import on L4 (merge, don't duplicate):
// Add RefreshCw to the existing import { Flame, Trophy, ... } line
// Moon, Zap, Activity are already imported on L4 — do NOT re-import them
import { ..., RefreshCw /* add only this */ } from 'lucide-react';

// New util imports (new line after existing data imports):
import {
  calcObjectiveReadiness,
  getMuscleRecoveryStatuses,
  getTier,
  getSpotlightMuscles,
  STATUS_COLORS,
  MUSCLE_LABELS,
} from '../../utils/readinessUtils';

// New component:
import ReadinessCheckIn from '../shared/ReadinessCheckIn';
```

### 4b — New State (inside DashboardPage component)
```js
const [showCheckIn, setShowCheckIn] = useState(false);

// From AppContext — EXTEND the existing useApp() destructure on L24, do not add a second call:
// BEFORE (L24): const { user, healthLogs, setHealthLogs, workoutLogs, splits, setUsers, addToast, getStreak } = useApp();
// AFTER (L24): const { user, healthLogs, setHealthLogs, workoutLogs, splits, setUsers, addToast, getStreak, readinessLog, logReadiness } = useApp();
```

### 4c — New Computed Values (useMemo)
```js
// Today's check-in entry (if any)
const todayReadiness = useMemo(() => {
  const today = new Date().toISOString().split('T')[0];
  return readinessLog.find(r => r.userId === user?.id && r.date === today) || null;
}, [readinessLog, user?.id]);

// Objective score — always computable from training history
const { score: objectiveScore } = useMemo(
  () => calcObjectiveReadiness(workoutLogs, user?.id),
  [workoutLogs, user?.id]
);

// Display score — full if check-in done, objective-only if not
const readinessScore = todayReadiness?.checkInComplete
  ? todayReadiness.score
  : objectiveScore;

const readinessTier = useMemo(() => getTier(readinessScore), [readinessScore]);

// Per-muscle recovery statuses
const muscleStatuses = useMemo(
  () => getMuscleRecoveryStatuses(workoutLogs, splits, user?.id),
  [workoutLogs, splits, user?.id]
);

// 3–4 most notable muscles for the bottom chips
const spotlightMuscles = useMemo(
  () => getSpotlightMuscles(muscleStatuses, 4),
  [muscleStatuses]
);

// Auto-open check-in once per day on first dashboard load (if not done)
// ⚠️ GAP-G7 FIX: todayReadiness is a useMemo result — React ESLint exhaustive-deps rule will
// warn that the actual reactive dep is `readinessLog`, not `todayReadiness`. Two options:
// Option A (recommended): add eslint-disable comment and keep todayReadiness (correct semantics)
// Option B: list readinessLog + user?.id and recompute today check inline in the effect.
// Use Option A:
// eslint-disable-next-line react-hooks/exhaustive-deps
useEffect(() => {
  if (!todayReadiness && user?.id) {
    const timer = setTimeout(() => setShowCheckIn(true), 1400);
    return () => clearTimeout(timer);
  }
}, [todayReadiness, user?.id]); // intentional — todayReadiness is stable per-render
```

### 4d — Replace Iron League Widget JSX

> **⚠️ GAP-G4:** `muscleXP` is already computed on DashboardPage L29 (`const muscleXP = useMemo(...)`). The widget JSX below references it directly. **Do not declare `muscleXP` again** — it is the same variable used by the Iron League widget. After removing the Iron League widget, `muscleXP` is now used exclusively by the readiness card.
>
> **⚠️ GAP-G1 (BodyMapSVG API):** `<BodyMapSVG mini={false}>` renders **two side-by-side canvases** (Front + Back, each 42% wide, with "Front" and "Back" text labels). This is wrong for a full-bleed card background. For the readiness widget, we only want the **front view** rendered at full width. Two options:
> - **Option A (recommended):** Use `mini={true}` but override its `width: 55px` wrapper via a parent `div` — but mini only shows 55px, not full-width.
> - **Option B (correct):** The `BodyMapSVG` component does not expose a single-panel mode directly. For the readiness card, **use `primaryMuscles` and `secondaryMuscles` props** (the component still renders both Front + Back). Accept the side-by-side layout and use CSS `overflow: 'hidden'` on the wrapper to crop to just the front canvas, OR use the internal `CanvasBodyMap` directly by importing it. 
> - **Option C (simplest):** render `<BodyMapSVG mini={false}>` as-is — the front+back pair darkened as a silhouette still conveys the body figure aesthetic. The muscle chip overlay + gradient fade will cover the gap between them. The `maxWidth: 260` wrapper will constrain the total width. **This is the pragmatic choice.**
>
> **Chosen approach: Option C.** Wrap in `maxWidth: 260, margin: '0 auto'`. The two-panel layout still works; the dark filter + gradient overlay unifies them visually.

Find and remove the existing Iron League widget block. Replace with:
```jsx
{/* ════════════════════════════════════════════════════════ */}
{/* DAILY READINESS SCORE                                   */}
{/* Replaces: Iron League / MiniBodyMap widget              */}
{/* ════════════════════════════════════════════════════════ */}
<div className="glass-card" style={{
  padding: 0, borderRadius: 20, overflow: 'hidden',
  position: 'relative', border: 'none',
}}>

  {/* ── Section header (above the body map card) ── */}
  <div style={{
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '18px 20px 14px',
  }}>
    <div>
      <div style={{
        fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase',
        color: 'var(--on-surface-dim)', marginBottom: 3, fontWeight: 700,
      }}>
        Daily
      </div>
      <div style={{
        fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700,
        fontSize: '1rem', color: 'var(--on-surface)', letterSpacing: '-0.02em',
      }}>
        TRAINING READINESS
      </div>
    </div>
    <button
      onClick={() => setShowCheckIn(true)}
      aria-label="Update readiness check-in"
      style={{
        width: 36, height: 36, borderRadius: 10,
        background: 'var(--surface-container-highest)',
        border: 'none', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
      <RefreshCw size={14} color="var(--on-surface-variant)" />
    </button>
  </div>

  {/* ── Body Map Card (the visual hero) ── */}
  <div style={{
    position: 'relative',
    background: 'var(--surface-container-lowest)',
    minHeight: 340,
    overflow: 'hidden',
  }}>

    {/* Body map — darkened via CSS filter on the wrapper */}
    {/* ⚠️ GAP-G1 resolved: Option C — full BodyMapSVG (front+back) constrained + darkened */}
    {/* muscleXP reused from L29 (GAP-G4) — no redeclaration needed */}
    <div style={{
      filter: 'grayscale(45%) brightness(0.42) contrast(1.15)',
      maxWidth: 260, margin: '0 auto',
      // Constrains the dual-panel canvas to a centered column
      // The gradient overlay below visually unifies the two panels
    }}>
      <BodyMapSVG
        muscleXP={muscleXP}    // ← reuses existing muscleXP from DashboardPage L29
        gender={user?.gender}
        mini={false}
      />
    </div>

    {/* Gradient fade at bottom — critical for the Stitch look */}
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0,
      height: '55%',
      background: 'linear-gradient(to bottom, transparent 0%, rgba(14,14,16,0.92) 65%, #0E0E10 100%)',
      pointerEvents: 'none',
    }} />

    {/* ── Layer 2: Score Badge (top-left) ── */}
    <div style={{
      position: 'absolute', top: 16, left: 16, zIndex: 5,
      background: 'rgba(14, 14, 16, 0.78)',
      backdropFilter: 'blur(16px)',
      borderRadius: 14, padding: '10px 14px',
    }}>
      <div style={{
        fontFamily: "'Space Grotesk', sans-serif",
        fontWeight: 800, fontSize: '2rem',
        color: readinessTier.color, lineHeight: 1,
        textShadow: `0 0 20px ${readinessTier.color}60`,
      }}>
        {readinessScore}
        <span style={{ fontSize: '1rem', fontWeight: 600, marginLeft: 2 }}>
          %
        </span>
      </div>
      <div style={{
        fontSize: 9, fontWeight: 700, textTransform: 'uppercase',
        letterSpacing: '0.1em', color: 'var(--on-surface-variant)',
        marginTop: 3,
      }}>
        Overall Readiness
      </div>
    </div>

    {/* ── Layer 3: Color Legend (top-right) ── */}
    <div style={{
      position: 'absolute', top: 16, right: 16, zIndex: 5,
      display: 'flex', flexDirection: 'column', gap: 6,
    }}>
      {[
        { label: 'Recovered', color: STATUS_COLORS.optimal },
        { label: 'Fatigued',  color: STATUS_COLORS.fatigued },
        { label: 'Critical',  color: STATUS_COLORS.critical },
      ].map(({ label, color }) => (
        <div key={label} style={{
          display: 'flex', alignItems: 'center', gap: 7,
          background: 'rgba(14, 14, 16, 0.72)',
          backdropFilter: 'blur(12px)',
          borderRadius: 10, padding: '5px 10px',
        }}>
          <div style={{
            width: 8, height: 8, borderRadius: '50%',
            background: color,
            boxShadow: `0 0 8px ${color}90`,
            flexShrink: 0,
          }} />
          <span style={{
            fontSize: 10, fontWeight: 700,
            textTransform: 'uppercase', letterSpacing: '0.08em',
            color: 'var(--on-surface)',
          }}>
            {label}
          </span>
        </div>
      ))}
    </div>

    {/* ── Layer 4: Muscle Recovery Chips (bottom overlay) ── */}
    {/* ⚠️ GAP-G6 FIX: Use var(--surface-container) instead of rgba for light theme compatibility */}
    {/* ⚠️ GAP-G12: Guard with spotlightMuscles.length check — during first render before useMemo */}
    {/*             resolves, array may be empty. The guard prevents rendering an empty chip row. */}
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 5,
      padding: '56px 16px 20px', // top padding = fade space
      display: 'flex', flexWrap: 'wrap', gap: 8,
    }}>
      {spotlightMuscles.length === 0 ? null : spotlightMuscles.map(m => (
        <div key={m.key} style={{
          // ⚠️ GAP-G6 FIX: was rgba(14,14,16,0.82) — breaks light mode. Use CSS var instead:
          background: 'var(--surface-container)',
          border: '1px solid var(--outline-variant)', // definition on light backgrounds
          backdropFilter: 'blur(14px)',
          borderRadius: 12, padding: '9px 14px',
          borderLeft: `3px solid ${STATUS_COLORS[m.status]}`,
          minWidth: 100,
        }}>
          <div style={{
            fontSize: 9, fontWeight: 700,
            textTransform: 'uppercase', letterSpacing: '0.1em',
            color: 'var(--on-surface-variant)', marginBottom: 3,
          }}>
            {MUSCLE_LABELS[m.key]}
          </div>
          <div style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 700, fontSize: 15,
            color: 'var(--on-surface)',
          }}>
            {m.label}
          </div>
        </div>
      ))}
    </div>
  </div>

  {/* ── Check-in CTA (below body map, if not completed) ── */}
  {!todayReadiness?.checkInComplete && (
    <div style={{ padding: '14px 16px' }}>
      <button
        className="btn-p"
        onClick={() => setShowCheckIn(true)}
        style={{
          width: '100%', padding: '14px', fontSize: 12,
          borderRadius: 14, letterSpacing: '0.1em',
          textTransform: 'uppercase', fontWeight: 700,
        }}>
        ✦ Complete Check-In for Full Score
      </button>
      <div style={{
        fontSize: 10, color: 'var(--on-surface-dim)',
        textAlign: 'center', marginTop: 8,
      }}>
        Showing objective score only · Takes 30 seconds
      </div>
    </div>
  )}

  {/* ── Tier message (shown when check-in done) ── */}
  {todayReadiness?.checkInComplete && (
    <div style={{
      padding: '14px 20px',
      display: 'flex', alignItems: 'center', gap: 10,
    }}>
      <div style={{
        width: 8, height: 8, borderRadius: '50%',
        background: readinessTier.color,
        boxShadow: `0 0 10px ${readinessTier.color}`,
        flexShrink: 0,
      }} />
      <div style={{
        fontSize: 12, color: 'var(--on-surface-variant)', lineHeight: 1.4,
      }}>
        <span style={{ color: readinessTier.color, fontWeight: 700 }}>
          {readinessTier.label} —{' '}
        </span>
        {readinessTier.message}
      </div>
    </div>
  )}
</div>

{/* ── Check-in Modal ── */}
{/* ⚠️ GAP-G8 FIX: Wrap in Portal to guarantee z-index layering above all Dashboard modals */}
{showCheckIn && (
  <Portal>
    <ReadinessCheckIn
      objectiveScore={objectiveScore}
      onClose={() => setShowCheckIn(false)}
    />
  </Portal>
)}
```

### 4e — Remove Iron League Widget

Find and delete the existing Iron League block in `DashboardPage.jsx`. It renders:
- A `<div className="glass-card"` with `<MiniBodyMap>` inside (L416–L442)
- The overall rank badge and "Iron League" label
- The `navigate('/muscle-map')` link

Delete this entire block. Steps:
1. Delete the JSX block (L416–L442 in the current file)
2. **⚠️ GAP-G3:** Update L7 — replace `import { MiniBodyMap } from '../shared/BodyMapSVG';` with `import BodyMapSVG from '../shared/BodyMapSVG';`
3. **⚠️ GAP-G10:** After removing the Iron League widget, the following computed values on L28–L30 become **unused dead code** and should also be removed or kept only if used elsewhere:
   - `weeklyMuscles` (L28) — only used inside the Iron League widget → **DELETE**
   - `overallRank` (L30) — only used inside the Iron League widget → **DELETE**
   - `muscleXP` (L29) — **KEEP** — reused by the new readiness widget's `<BodyMapSVG muscleXP={muscleXP}>`
4. **⚠️ GAP-G10:** Also remove the Iron League-specific imports from L10 since `overallRank` comes from `getOverallRank` — but `MUSCLE_GROUPS` is still used in the widget for the weekly count label. After the full widget is removed, `getWeeklyMuscles`, `getOverallRank`, and `MUSCLE_GROUPS` should also be dropped from the L10 import:
   - `import { calcAllMuscleXP } from '../../data/muscleData';` ← keep `calcAllMuscleXP` only
   - Remove: `getWeeklyMuscles, getOverallRank, MUSCLE_GROUPS`
5. Remove `Shield` from the lucide-react import on L4 (only used in the Iron League widget header) — unless it appears elsewhere on the page.

---

## 📦 File Change Summary

| File | Change | Scope |
|------|--------|-------|
| `src/utils/readinessUtils.js` | **[NEW]** | All score logic, recovery statuses, tier defs |
| `src/components/shared/ReadinessCheckIn.jsx` | **[NEW]** | 4-step bottom-sheet check-in modal |
| `src/context/AppContext.jsx` | **Additive** | `readinessLog` state + `logReadiness()` helper |
| `src/components/pages/DashboardPage.jsx` | **Modify** | Replace Iron League widget; add 4 new imports; 3 new useMemos; 1 useEffect; `showCheckIn` state |

**Zero changes to:** `BodyMapSVG.jsx`, `index.css`, `muscleData.js`, any other page.

---

## ✅ Implementation Checklist

### readinessUtils.js
- [x] `READINESS_TIERS` array
- [x] `STATUS_COLORS` object (optimal/fatigued/critical hex values)
- [x] `MUSCLE_LABELS` map (12 muscle keys → display names)
- [x] `getTier(score)` 
- [x] `getMuscleRecoveryStatuses(workoutLogs, splits, userId)`
- [x] `calcObjectiveReadiness(workoutLogs, userId)` → returns `{ score, loadRatio }`
- [x] `calcReadinessScore(checkIn, objectiveScore)`
- [x] `getSpotlightMuscles(muscleStatuses, limit)` → sorted by priority

### AppContext.jsx
- [x] `readinessLog` useLocalStorage with key `'fittrack_readiness'`
- [x] `logReadiness(entry)` upserts by `userId + date`
- [x] Both exposed in context value

### ReadinessCheckIn.jsx
- [x] Bottom-sheet slide-up animation
- [x] Progress dots (4 steps, filled on completion)
- [x] Auto-advance on selection (220ms delay)
- [x] Skip link on every step
- [x] Score reveal screen after final answer (2.2s then auto-close)
- [x] `logReadiness()` called on completion
- [x] `document.body.style.overflow = 'hidden'` on mount, restored on unmount

### DashboardPage.jsx
- [x] Import `ReadinessCheckIn` from shared
- [x] Import `calcObjectiveReadiness`, `getMuscleRecoveryStatuses`, `getTier`, `getSpotlightMuscles`, `STATUS_COLORS`, `MUSCLE_LABELS` from readinessUtils
- [x] Import `{ RefreshCw, Moon, Zap, Activity }` added to Lucide import
- [x] Remove `MiniBodyMap` from import (no longer used on Dashboard)
- [x] `readinessLog` and `logReadiness` destructured from `useApp()`
- [x] `todayReadiness` useMemo (filters today's entry)
- [x] `objectiveScore` useMemo (calcObjectiveReadiness)
- [x] `readinessScore` derived (check-in score or objective fallback)
- [x] `readinessTier` useMemo (getTier)
- [x] `muscleStatuses` useMemo (getMuscleRecoveryStatuses)
- [x] `spotlightMuscles` useMemo (getSpotlightMuscles — limit 4)
- [x] `useEffect` for auto-open check-in after 1400ms if `!todayReadiness`
- [x] Iron League widget block fully deleted
- [x] Readiness widget JSX added in its place
- [x] `{showCheckIn && <ReadinessCheckIn ... />}` rendered inside return (use Portal if needed for z-index)

### QA
- [x] Body map renders dark — CSS filter applied correctly to wrapper div only (not the whole card)
- [x] Body map displays as two-panel (Front + Back) constrained within `maxWidth: 260` wrapper — verify both panels are still visible and dark (**GAP-G1 resolution**)
- [x] Score badge shows correct color (green 80+, amber 60–79, ember 40–59, red <40)
- [x] Legend chips show correct dot colors with glow
- [x] Gradient fade at bottom of body map matches Stitch screenshot depth
- [x] Muscle chips show correct border-left color per status
- [x] Muscle chip background is theme-aware (`var(--surface-container)`) — verify on light theme (**GAP-G6**)
- [x] New user (no workout logs) → score ~90, `spotlightMuscles.length === 3` (Fresh chips shown, not empty) (**GAP-G12**)
- [x] `spotlightMuscles.length === 0` guard renders `null` without crashing (edge case before useMemo settles) (**GAP-G12**)
- [x] After 3 consecutive heavy days → score drops to 40s–50s
- [x] Check-in opens automatically 1.4s after first Dashboard load (when no today entry)
- [x] Completing check-in closes modal, updates score live, shows tier message
- [x] Skipping shows objective-only score with "Complete Check-In" CTA
- [x] Re-opening via RefreshCw updates today's entry (upsert, not duplicate)
- [x] Midnight crossover — score resets next day (new ISO date → no today entry)
- [x] Check-in modal renders inside `Portal` — confirm it layers above Log Weight / Set Goal modals (**GAP-G8**)
- [x] React DevTools: no lint warning about `useEffect` exhaustive-deps (**GAP-G7 — eslint-disable comment present**)
- [x] Console: no ESLint "duplicate import" warning for `BodyMapSVG` / `MiniBodyMap` (**GAP-G3**)
- [x] `muscleXP` is not re-declared — verify only one `const muscleXP = useMemo(...)` in DashboardPage (**GAP-G4**)
- [x] `weeklyMuscles` and `overallRank` useMemos removed from DashboardPage after Iron League widget deletion (**GAP-G10**)
- [x] `getWeeklyMuscles`, `getOverallRank`, `MUSCLE_GROUPS` removed from L10 muscleData import (**GAP-G10**)
- [x] `Shield` icon removed from lucide-react import if no other usage on DashboardPage (**GAP-G10**)
- [x] MUSCLE_LABELS in readinessUtils.js uses `'Back'` (not `'Back (Lats)'`) and `'Abs'` (not `'Core'`) — matches muscleData.js MUSCLE_GROUPS (**GAP-G5**)
- [x] Mobile 375px — muscle chips wrap correctly, don't overflow card
- [x] `logReadiness` wrapped in `useCallback` in AppContext (**GAP-G9**)

---

## 🚫 Out of Scope

- 3D wireframe body render (we use existing `BodyMapSVG` with CSS filter)
- Wearable HRV/RHR integration (deferred to Supabase phase)
- Weekly readiness trend chart (Phase 2 — needs 7 days of data first)
- Push notification reminders for daily check-in
- Cycle-aware readiness adjustment for female users (Phase 3.4)

---

## 🗒️ Implementation Notes

**CSS Filter approach is the key creative decision.**
`filter: grayscale(45%) brightness(0.42) contrast(1.15)` on the `BodyMapSVG` wrapper
converts the teal/coral canvas into a dark, slightly desaturated figure that closely
matches the wireframe aesthetic in the Stitch reference — without any AI image or
3D render dependency. Tweak the `brightness` value (0.35–0.50) to taste after first render.

**The gradient fade is what sells the Stitch look.**
The `linear-gradient(to bottom, transparent 0%, rgba(14,14,16,0.92) 65%)` overlay
creates the seamless bleed between the dark body figure and the muscle chips below —
exactly as shown in the screenshot. Without this, the chips would look bolted on.

**Light theme chip background.** The `rgba(14, 14, 16, 0.82)` chip background works
perfectly in dark mode. In light mode, the chip will look like a dark blob on a light
card. Solution: use a CSS variable instead:
```js
background: 'var(--surface-container)'  // theme-aware, reads correctly in both
```
...and add `border: '1px solid var(--outline-variant)'` for definition on light backgrounds.

**`BodyMapSVG` already receives `muscleXP` on the Dashboard** (from the Iron League
widget's existing code). The same `muscleXP` variable is reused — the muscles with
XP will still have their coral highlights underneath the darkening filter, which actually
adds subtle warm tones to the silhouette exactly like the Stitch glow effect.

**`MiniBodyMap` removal note.** Removing `MiniBodyMap` from Dashboard imports may
generate an ESLint "unused import" warning during the build if other cleanup doesn't
catch it. Verify `MiniBodyMap` is not used anywhere else on DashboardPage before removing.
---

# PHASE 2 — READINESS WIDGET UI OVERHAUL (Stitch Fidelity)

> **Status:** PLANNED — Not yet implemented
> **Created:** 2026-04-01
> **Priority:** High — Backend logic is solid; UI must match Stitch reference
> **Effort:** Medium — JSX-only changes to DashboardPage.jsx; no logic changes
> **Files affected:** src/components/pages/DashboardPage.jsx only (widget JSX block)

---

## Phase 2 Goal

The Phase 1 implementation correctly wired up all the score logic, state, and the check-in modal.
The widget JSX must now be rebuilt to exactly match the Stitch "Visual Recovery Dashboard" reference.

### Visual Gaps vs Stitch Design

| Issue | Current | Stitch Target |
|---|---|---|
| Body map coverage | Two canvases, maxWidth 260 centered | Full-bleed silhouette covering entire card |
| Body map blend mode | brightness(0.42) — just darkens | grayscale(100%) + mix-blend-screen → glowing wireframe |
| Card height | minHeight: 380 | minHeight: 500 |
| Score suffix | No % | Shows 84% with percent sign |
| Score label | "Daily Score" | "OVERALL READINESS" below the number |
| Tier label | Shown beside number (e.g. Optimal) | REMOVED from badge entirely |
| Legend order | label → dot | dot → label (● RECOVERED) |
| Legend wording | Optimal / Fatigued / Critical | RECOVERED / FATIGUED / CRITICAL |
| Legend styling | No glass chip per item | Each item is its own glass pill |
| Legend header | "Recovery Status" header | No header |
| Factor pills | High Load / Sleep pills mid-card | Not in Stitch — REMOVE |
| Check-in CTA | Inside the score badge | Standalone button below the top row |
| Chip background | var(--surface-container) | rgba(19,19,21,0.80) — Stitch bg-surface/80 |
| Chip border left | 3px | 4px (Stitch border-l-4) |
| Chip radius | 12px | 8px (Stitch rounded-lg) |
| Chip outer border | 1px solid var(--outline-variant) | None |
| Chip value font | default | Space Grotesk, 14px, 700 |
| Chips gap | 8px | 12px (Stitch gap-3) |
| Card background | var(--surface-container-low) | var(--surface-container-lowest) — near-black for blend |
| Card border | 1px solid | No border |

---

## Stitch Layout Structure

```
+-----------------------------------------------------+
|  [84%          ]              [● RECOVERED         ] |
|  [OVERALL      ]              [● FATIGUED          ] |
|  [READINESS    ]              [● CRITICAL          ] |
|  * Complete Check-In ->                              |
|                                                      |
|          BODY SILHOUETTE (full bleed)                |
|                                                      |
|  [QUADS   ] [LOWER BACK] [DELTOIDS  ]               |
|   Optimal     92h Rest    Prime                      |
+-----------------------------------------------------+
```

---

## Change 1 — Body Map: Full-Bleed + Mix-Blend-Screen

WHY: The BodyMapSVG canvas renders teal-blue pixels on black. After grayscale(100%)
and brightness(1.8), those become bright grey/white glows. mix-blend-screen on a
near-black parent makes the dark areas transparent and only bright pixels show through —
identical visual to the Stitch 3D wireframe render.

```jsx
{/* REPLACE the current body map wrapper with this: */}
<div style={{
  position: 'absolute', inset: 0, zIndex: 0,
  WebkitMaskImage: 'linear-gradient(to bottom, black 65%, transparent 100%)',
  maskImage: 'linear-gradient(to bottom, black 65%, transparent 100%)',
  pointerEvents: 'none',
}}>
  {/* Black base required for mix-blend-screen to work */}
  <div style={{ position: 'absolute', inset: 0, background: 'var(--surface-container-lowest)', zIndex: 0 }} />
  {/* Canvas with screen blend creates glowing wireframe effect */}
  <div style={{
    position: 'absolute', inset: 0, zIndex: 1,
    filter: 'grayscale(100%) brightness(1.8) contrast(1.3)',
    mixBlendMode: 'screen',
    display: 'flex', alignItems: 'stretch',
  }}>
    <div style={{ width: '100%', height: '100%' }}>
      <BodyMapSVG muscleXP={muscleXP} gender={user?.gender} mini={false} />
    </div>
  </div>
</div>
```

Option D (if two-panel looks odd): wrap BodyMapSVG in width: '200%' + overflow hidden to crop to front panel only.

---

## Change 2 — Card Wrapper

```
BEFORE: background: var(--surface-container-low), border, boxShadow, minHeight: 380, padding: 24
AFTER:  background: var(--surface-container-lowest), no border, no boxShadow, minHeight: 500, no padding on wrapper
```

---

## Change 3 — Content Layer (single wrapper div for all content)

Replace scattered Layer 2/3/4 comment structure with one content layer:
```
position: relative, zIndex: 10, padding: 24, flex: 1
display: flex, flexDirection: column, justifyContent: space-between, minHeight: 500
```
Inner structure: TOP ROW div + CTA button + BOTTOM chips div (mt-auto)

---

## Change 4 — Score Badge

```
REMOVE: tier label beside number (e.g. "Optimal")
REMOVE: "Daily Score" header text
REMOVE: Check-in CTA button from inside badge
ADD: % suffix to score number (84%)
CHANGE label to: "Overall Readiness"
CHANGE background to: rgba(53, 52, 55, 0.4) with border rgba(90,65,56,0.15)
```

Score number style: fontFamily Space Grotesk, fontSize 2.4rem, fontWeight 700, color activeTier.color

---

## Change 5 — Legend Column

```
REMOVE: "Recovery Status" header
CHANGE: dot moves LEFT of text (was right)
CHANGE: labels to RECOVERED / FATIGUED / CRITICAL
ADD: each item gets its own glass chip (bg rgba(53,52,55,0.4), blur 12px, border rgba(90,65,56,0.15), borderRadius 8)
DOT style: width 8, height 8, borderRadius 50%, boxShadow 0 0 8px colorWithAlpha
TEXT style: fontSize 10, fontWeight 700, uppercase, letterSpacing 0.08em, color var(--on-surface)
```

---

## Change 6 — Muscle Status Chips

```
CHANGE background: rgba(19, 19, 21, 0.80)  (was var(--surface-container))
CHANGE borderLeft: 4px solid  (was 3px)
CHANGE borderRadius: 8  (was 12)
REMOVE outer border (was 1px solid var(--outline-variant))
CHANGE chip value font: fontFamily Space Grotesk, fontSize 14, fontWeight 700
Chips row gap: 12  (was 8)
```

---

## Change 7 — Remove Factor Pills, Relocate CTA

DELETE the entire "Layer 3: Factor Pills" block (High Load / Sleep pills).

Check-in CTA becomes a standalone button BELOW the top row and ABOVE the chips:
- When not done: "* Complete Check-In ->" in var(--primary) color
- When done: "<RefreshCw /> Update Check-In" in var(--on-surface-dim)

---

## Phase 2 Implementation Checklist

### DashboardPage.jsx — Widget JSX Only

- [ ] Card wrapper: background var(--surface-container-lowest), no border, no boxShadow, minHeight 500
- [ ] Body map: full-bleed position absolute inset 0, with maskImage/WebkitMaskImage fade
- [ ] Body map filter: grayscale(100%) brightness(1.8) contrast(1.3) + mixBlendMode screen
- [ ] Remove maxWidth 260 / margin auto constraint from body map
- [ ] Remove opacity 0.65 from body map wrapper
- [ ] Content layer: single div, position relative, zIndex 10, padding 24, flex 1, justifyContent space-between, minHeight 500
- [ ] Score badge: rgba(53,52,55,0.4) bg, score shows {activeScore}%, label "Overall Readiness"
- [ ] Tier label (activeTier.label) REMOVED from next to score number
- [ ] Legend: dot LEFT of text, each item glass chip, wording RECOVERED/FATIGUED/CRITICAL
- [ ] "Recovery Status" header removed
- [ ] Factor Pills (Layer 3) deleted entirely
- [ ] Check-in CTA moved outside badge — standalone button below TOP ROW
- [ ] Chips: rgba(19,19,21,0.80) bg, 4px borderLeft, 8px radius, no outer border
- [ ] Chip value: fontSize 14, fontWeight 700, fontFamily Space Grotesk
- [ ] Chips row: gap 12, marginTop auto
- [ ] Tune brightness (1.6 to 2.2) until wireframe glow looks correct
- [ ] If dual-panel bad: implement Option D (200% width crop to front only)

### No changes to
- [ ] readinessUtils.js
- [ ] ReadinessCheckIn.jsx
- [ ] AppContext.jsx
- [ ] BodyMapSVG.jsx

### QA
- [x] Body map fills card edge to edge (no gaps visible)
- [x] Glowing wireframe effect: muscles glow on near-black bg
- [x] maskImage fade: body fades at bottom 35%, chips readable on top
- [x] Score shows 84% format
- [x] Score label reads OVERALL READINESS (not "Daily Score")
- [x] Tier label not shown beside score number
- [x] Legend: dot LEFT, text RIGHT, each in glass chip
- [x] No "Recovery Status" heading above legend
- [x] Chips: muscle name uppercase muted on top, status bolded on bottom
- [x] No Factor Pills mid-card
- [x] Check-in CTA below badge row, not inside it
- [x] Card height ~500px min
- [x] Light theme: rgba chips look readable
- [x] Mobile 375px: chips wrap without overflow

*End of Phase 2 Plan*

---

## ⚠️ Phase 2 Gap Analysis (Verified Against Codebase — 2026-04-01)

The following gaps were identified by cross-referencing the Phase 2 plan against
the actual source files (`DashboardPage.jsx`, `BodyMapSVG.jsx`, `index.css`).
Each gap must be addressed during implementation.

| # | Gap | Severity | Detail |
|---|-----|----------|--------|
| P2-G1 | **Light theme breaks `mix-blend-screen`** — `--surface-container-lowest` is `#EDE7E0` (light beige) in light mode. Using it as the card bg turns `mix-blend-screen` into a blown-out white mess. | 🔴 Critical | Card must use a hardcoded near-black bg (`#0E0E10`) instead of a CSS var, OR conditionally only apply blend-mode in dark theme, OR wrap the body layer in an isolated `#0E0E10` div regardless of theme. |
| P2-G2 | **`loadRatio` (L42) becomes dead code** — It's only used in the Factor Pills (L562). Deleting pills → unused variable → lint error. | 🟠 High | Delete `const loadRatio = objectiveScoreObj.loadRatio;` at L42. Keep `objectiveScoreObj.loadRatio` available if needed later. |
| P2-G3 | **`Moon` import becomes dead code** — `Moon` is only used in the Factor Pills sleep display (L571). After deletion → unused import → lint error. `Activity` at L560 is also in pills BUT survives because it's used elsewhere (L252 activity card). | 🟠 High | Remove `Moon` from the lucide-react import on L4. Keep `Activity`. |
| P2-G4 | **Chip inner dot not documented for removal** — Current chip has a colored dot (L602, `width: 4, height: 4`) inside a `space-between` row. Stitch has NO dot inside the muscle chip — dots are in the legend only. Change 6 updates bg/border/radius but never says to remove the dot. | 🟡 Medium | Remove the `<div style={{ width: 4, height: 4, borderRadius: '50%', ... }} />` from inside each chip. Also remove the `justifyContent: 'space-between'` flex row wrapper — replace with simple vertical stack (label above, value below). |
| P2-G5 | **BodyMapSVG renders "Front" / "Back" labels** — When `mini={false}`, component passes `label="Front"` (L290) and `label="Back"` (L298). These render as 9px uppercase text above each canvas. Under `mix-blend-screen` + `brightness(1.8)` they'll appear as bright white text floating on the card. | 🟡 Medium | Either: (a) hide them with CSS on the widget's body-map wrapper using `fontSize: 0` or `color: transparent`, or (b) pass a new prop to suppress labels (but this violates "zero changes to BodyMapSVG"). Best option: use the CSS approach — add `color: transparent` or `visibility: hidden` scoped via a wrapper class/style targeting `div > div` text nodes. Simplest: add `opacity: 0` to only the label divs by targeting via `> div > div:first-child` in the filter wrapper. |
| P2-G6 | **Canvas overflow — 1:2 aspect ratio exceeds card height** — Each canvas is 640×1280 (1:2 ratio). Two side-by-side panels at ~42% width each will attempt ~500px+ height. The `position: absolute, inset: 0` wrapper won't constrain `height: auto` canvases. Body map will bleed out of the card. | �� High | Add `overflow: 'hidden'` to the body map background layer div (`position: absolute, inset: 0`). This is already partially implied by the card's `overflow: 'hidden'`, but the inner wrapper's `display: flex, alignItems: stretch` combined with `height: '100%'` may not clip properly. Test and confirm. |
| P2-G7 | **Old gradient overlay div (L482-485) not flagged for deletion** — The Phase 1 code has a separate `<div>` with `linear-gradient(to top, var(--surface-container-low) 10%, ...)` as a ground-depth fade. Phase 2 replaces this with `maskImage` on the parent. But the old overlay div is NOT mentioned for deletion in the checklist. | �� Medium | Explicitly delete the `<div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '45%', background: 'linear-gradient(...)' }} />` at L482-485. The `maskImage` approach handles the fade instead. |
| P2-G8 | **Chip absolute positioning lost** — Current chips (L583-608) use `position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 5`. Phase 2 Content Layer uses `marginTop: 'auto'` on a flex child instead. This is correct (Stitch uses `mt-auto`), but the plan must explicitly note that the absolute positioning and `padding: '56px 16px 20px'` on the chip row are removed — otherwise the implementer might accidentally keep both. | 🟢 Low | Confirm: chips row changes from `position: absolute, bottom: 0` to `marginTop: auto` inside the flex content layer. Remove `zIndex: 5`. Remove `padding: '56px 16px 20px'` (the 56px fade space is no longer needed since maskImage handles it). |

---

### Phase 2 Additional Checklist Items (from Gap Analysis)

Add these to the Phase 2 Implementation Checklist:

- [x] **P2-G1:** Card wrapper uses hardcoded `#0E0E10` bg instead of `var(--surface-container-lowest)` — OR — wrap body map layer in an opaque `#0E0E10` isolation div so blend-mode works regardless of theme
- [x] **P2-G2:** Delete `const loadRatio = objectiveScoreObj.loadRatio;` at L42 (dead code after pills removed)
- [x] **P2-G3:** Remove `Moon` from lucide-react import on L4 (dead after pills removal). Keep `Activity`.
- [x] **P2-G4:** Inside each chip: remove the 4×4 colored dot div and the `justifyContent: 'space-between'` row wrapper. Simple vertical stack: label → value.
- [x] **P2-G5:** Suppress "Front" / "Back" labels on BodyMapSVG — use CSS `color: transparent` on the body-map wrapper's nested text divs. Zero changes to BodyMapSVG.jsx.
- [x] **P2-G6:** Add `overflow: 'hidden'` to the body map background layer wrapper. Verify canvas doesn't bleed below card.
- [x] **P2-G7:** Delete the old gradient overlay div at L482-485 (`<div style={{ position: 'absolute', bottom: 0, ... linear-gradient ... }} />`). maskImage replaces it.
- [x] **P2-G8:** Chips row: remove `position: absolute, bottom: 0, zIndex: 5, padding: '56px 16px 20px'`. Use `marginTop: 'auto'` in flex content layer instead.
