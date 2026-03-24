# FitTrack Pro — Phase 2: Feature Enhancements

<!-- Scope: Enhancements to existing features. Medium priority, moderate effort. -->

> **Last updated:** 2026-03-24 · Medium Priority — tackle after Phase 1 is complete.

---

## 🏋️ Phase 2 — Feature Enhancements (Medium Priority)

### 2.1 Female Anatomy for Muscle Map ✅ Done

**Problem:** `BodyMapSVG.jsx` only renders male anatomy illustrations. Female body maps are missing entirely.

**Requirements:**
- Create or source a matching set of female anatomy illustrations (front-base, back-base, and per-muscle highlight PNGs) in the same Getty/pop_jop style.
- Store in `public/muscles/female/` (e.g., `female-front-base.png`, `female-front-chest.png`, etc.).
- Read `user.gender` from context. If `gender === 'female'`, swap the base and highlight image paths to use the female versions.
- `AuthModal.jsx` already has a gender field with `male`/`female`/`other` options — no changes needed there.
- For `other` gender, default to male or let user pick on the Muscle Map page.

**Files to modify:**
- `src/components/shared/BodyMapSVG.jsx` — add gender prop, conditional image paths
- `src/components/pages/MuscleMapPage.jsx` — pass `user.gender` to `BodyMapSVG`
- `src/components/pages/DashboardPage.jsx` — pass gender to `MiniBodyMap`
- `public/muscles/female/` — **[NEW]** 13+ illustration PNGs

---

### 2.2 Post-Workout Summary Screen ✅ Done

**Problem:** After finishing a workout, the screen just says "Workout Complete!" with a "Log Another" button. It should instead show a rich summary.

**Design:**
- Display the muscle map with **only the muscles worked in this session** highlighted in orange.
- Show **XP points gained** in this session (compute delta by comparing XP before and after).
- Show total sets completed, total volume (sets × reps × weight), and session duration (if timer is implemented).
- Add a **"View Muscle Map →"** button that navigates to `/muscle-map`.
- Keep a secondary "Log Another Workout" link/button.

**Files to modify:**
- `src/components/pages/WorkoutPage.jsx` — replace the `done` state render block (lines 108–115)
- `src/data/muscleData.js` — may need a helper function to compute session-specific XP

---

### 2.3 XP Recalculation — Monthly Reset System ✅ Done

**Problem:** The current XP formula (`reps × weight` per set, summed forever) causes users to hit Gold/Platinum within a few sessions. The system should **reset monthly** so users earn a fresh rank each month based on that month's training volume and consistency. Each month should have its own Untrained → Legend ladder.

**Current formula** (`muscleData.js`, lines 98–102):
```js
exXP += reps * Math.max(weight, 1);
```

**Proposed redesign — Monthly Reset XP:**

**Core concept:** XP is calculated **only from the current calendar month's workout logs**. At the start of each month, everyone starts at Untrained and works their way up. Past months become a historical record ("March 2026: Gold II", "February 2026: Platinum").

1. **Base formula:** `Set XP = reps × weight` (unchanged).
   - Example per-muscle monthly volume: Chest → 8 sessions × 4 sets × 10 reps × 80kg = 25,600 raw XP.
   - Across 12 muscle groups, a fully dedicated month yields ~150,000–300,000 total raw XP.

2. **Monthly tier thresholds (per muscle group):**

   | Tier        | XP per Muscle | How to Reach (approx.)                          |
   |-------------|-------------:|--------------------------------------------------|
   | Untrained   |            0 | —                                                |
   | Bronze I    |          200 | ~1 session, light weights                        |
   | Bronze II   |          600 | ~2 sessions                                      |
   | Bronze III  |        1,200 | ~3–4 sessions, moderate weights                  |
   | Silver I    |        2,000 | ~5 sessions, consistent                          |
   | Silver II   |        3,000 | ~6 sessions, good volume                         |
   | Silver III  |        4,500 | ~7 sessions, pushing weights                     |
   | Gold I      |        6,500 | ~8 sessions (full month), solid volume            |
   | Gold II     |        9,000 | ~8 sessions with heavy compounds                 |
   | Gold III    |       12,000 | ~8+ sessions, high volume + heavy weights         |
   | Platinum    |       16,000 | Full month, high sets, heavy weights              |
   | Diamond     |       22,000 | Exceptional month — extra sessions + PR weights   |
   | Master      |       30,000 | Near-impossible — requires extreme dedication     |
   | Legend      |       40,000 | Perfect month — every session maxed, PRs hit      |

3. **Overall rank** uses total XP across all muscles for the current month:

   | Overall Tier | Total Monthly XP | What it Means                                    |
   |--------------|----------------:|--------------------------------------------------|
   | Untrained    |               0 | Haven't trained yet this month                   |
   | Bronze I     |           2,000 | Just getting started                             |
   | Bronze II    |           5,000 | A few sessions in                                |
   | Bronze III   |          10,000 | ~1 week of consistent training                   |
   | Silver I     |          20,000 | ~2 weeks, good consistency                       |
   | Silver II    |          35,000 | Solid half-month                                 |
   | Silver III   |          50,000 | Strong 3-week effort                             |
   | Gold I       |          70,000 | ~Full month, consistent across muscle groups      |
   | Gold II      |          95,000 | Full month, pushing harder                       |
   | Gold III     |         125,000 | Full month, high intensity everywhere             |
   | Platinum     |         160,000 | Crushing it — heavy + high frequency              |
   | Diamond     |         200,000 | Outstanding month — elite consistency             |
   | Master       |         250,000 | Near-perfect month across all muscles             |
   | Legend       |         320,000 | The holy grail — max effort, max consistency      |

4. **Consistency bonus:**
   - If a muscle is trained ≥80% of expected sessions → 1.25× XP bonus for that muscle.
   - If 100% of expected sessions → 1.5× bonus.
   - "Expected sessions" = based on the active split schedule (e.g., PPL hits chest 2×/week = 8×/month).

5. **Volume quality bonus:**
   ```js
   // Reward exercises where user completes ≥3 sets with meaningful weight
   const qualityBonus = (completedSets >= 3 && avgWeight >= 20) ? 1.15 : 1.0;
   ```

6. **Monthly history / leaderboard:**
   - Store each month's final rank + XP in a `monthlyRankHistory` array in localStorage.
   - Show a "Previous Months" section on the Muscle Map page with badges earned.
   - This gives users a reason to come back every month and try to beat their previous rank.

**Implementation in `calcAllMuscleXP()`:**
```js
// Filter logs to current month only
const startOfMonth = new Date();
startOfMonth.setDate(1);
startOfMonth.setHours(0, 0, 0, 0);
const monthLogs = userLogs.filter(l => new Date(l.date) >= startOfMonth);
```

**Files to modify:**
- `src/data/muscleData.js` — update `RANK_TIERS` thresholds, modify `calcAllMuscleXP()` to filter by current month, add consistency bonus logic
- `src/data/constants.js` — add monthly XP configuration constants
- `src/context/AppContext.jsx` — add `monthlyRankHistory` to localStorage state
- `src/components/pages/MuscleMapPage.jsx` — add "Previous Months" history section

---

### 2.4 XP Distribution Fix — Primary vs Secondary Muscle Weighting ✅ Done

> **Added:** 2026-03-24 — Critical correctness bug discovered post-implementation.

---

#### Problem Statement

The current XP system awards **equal XP to every muscle listed on an exercise**. This is scientifically wrong and produces two major bugs the user reported:

1. **Squats award the same XP to quads and glutes.** EMG research shows the back squat activates the vastus lateralis, vastus medialis, and rectus femoris (quadriceps) as the **primary movers**, while the gluteus maximus acts as a **secondary stabilizer/hip extensor**. Giving equal XP to both groups misrepresents training stimulus.

2. **Lying leg curls do not highlight hamstrings.** The leg curl is a pure hamstring isolation movement. If the exercise's `muscle` field maps to a generic `"legs"` or `"quads"` group, the XP goes to the wrong muscle entirely, and hamstrings show zero activity.

#### Root Cause

The exercise data in `splits.js` uses a single `muscle` string field per exercise (e.g. `muscle: 'legs'`). There is no concept of primary vs secondary muscles. `calcAllMuscleXP()` in `muscleData.js` credits 100% of `reps × weight` XP to whatever that one `muscle` string resolves to.

Two problems compound this:
- **Generic muscle IDs**: Some exercises use coarse IDs like `"legs"` instead of specific IDs like `"quads"` or `"hamstrings"`.
- **No XP weighting**: Even if IDs were correct, compound exercises would still split XP equally across all involved muscles.

---

#### Fix Overview

**Part A — New exercise data schema** (`splits.js` + any custom exercise fields):
Replace the single `muscle` string with:
```js
{
  primaryMuscle: 'quads',          // single string — gets 100% XP
  secondaryMuscles: ['glutes'],    // array — each gets 30% XP
}
```
Keep the existing `muscle` field as a display label (used for the tag chip UI) — it can stay as a human-readable string like `"Legs"`.

**Part B — Updated XP formula** (`muscleData.js` → `calcAllMuscleXP()`):
```js
// Current (wrong):
exXP += reps * Math.max(weight, 1);
// credits all muscle IDs on the exercise equally

// Fixed:
const baseXP = reps * Math.max(weight, 1);
muscleXP[ex.primaryMuscle] += baseXP * 1.0;
(ex.secondaryMuscles || []).forEach(m => {
  muscleXP[m] = (muscleXP[m] || 0) + baseXP * 0.3;
});
```

**Part C — Updated exercise records** (`splits.js`):
Every exercise in every split needs `primaryMuscle` and (where applicable) `secondaryMuscles`. See the complete mapping table below.

**Part D — Body map and post-workout summary UI:**
- **Body map highlights**: Only highlight a muscle if its XP is above the Untrained threshold for the current month. Secondary-muscle XP still accumulates and counts toward rank, but the body map should indicate primary muscles more prominently (e.g., full orange for primary muscles worked this session, dimmer orange for secondary).
- **Post-workout summary**: Show session XP breakdown by muscle. Primary muscles get a full XP chip; secondary muscles get a smaller muted chip to the right.

---

#### Canonical Muscle ID List

The following IDs must match exactly what `muscleData.js` uses as keys. Verify these match `MUSCLE_GROUPS` or whatever constant defines the muscle list:

| ID | Display Name | Body Region |
|----|-------------|-------------|
| `chest` | Chest | Front |
| `lats` | Lats | Back |
| `traps` | Traps | Back |
| `lowerback` | Lower Back | Back |
| `shoulders` | Shoulders | Front |
| `biceps` | Biceps | Front |
| `triceps` | Triceps | Front |
| `forearms` | Forearms | Front |
| `abs` | Abs | Front |
| `obliques` | Obliques | Front |
| `quads` | Quads | Front |
| `hamstrings` | Hamstrings | Back |
| `glutes` | Glutes | Back |
| `calves` | Calves | Back |

> **If the app currently uses different IDs** (e.g. `"back"` instead of `"lats"`) — do not add new IDs. Instead map to the existing ones. The table below uses these canonical IDs; adjust if yours differ.

---

#### Complete Exercise → Primary/Secondary Muscle Mapping

This is the authoritative reference for every exercise that appears in FitTrack Pro's splits and any custom exercise the user may add. Based on peer-reviewed EMG research (Fauth et al., Contreras et al., Martín-Fuentes et al., Barnett et al., and others).

##### Push — Chest

| Exercise | primaryMuscle | secondaryMuscles |
|----------|--------------|-----------------|
| Barbell Bench Press | `chest` | `triceps`, `shoulders` |
| Dumbbell Bench Press | `chest` | `triceps`, `shoulders` |
| Incline Barbell Bench Press | `chest` | `shoulders`, `triceps` |
| Incline Dumbbell Press | `chest` | `shoulders`, `triceps` |
| Decline Bench Press | `chest` | `triceps` |
| Dumbbell Flye | `chest` | *(none)* |
| Cable Flye / Pec Deck | `chest` | *(none)* |
| Push-up | `chest` | `triceps`, `shoulders` |
| Chest Dip | `chest` | `triceps` |
| Cable Crossover | `chest` | *(none)* |

> **Research note:** The pectoralis major (sternal head) is the dominant mover in all horizontal pressing. The triceps are synergists. EMG shows pec activation is near-maximal even at 70% 1RM, while triceps activation scales more with heavier loads (Król & Golaś, 2017).

##### Push — Shoulders

| Exercise | primaryMuscle | secondaryMuscles |
|----------|--------------|-----------------|
| Overhead Press (Barbell) | `shoulders` | `triceps` |
| Dumbbell Shoulder Press | `shoulders` | `triceps` |
| Arnold Press | `shoulders` | `triceps` |
| Lateral Raise | `shoulders` | *(none)* |
| Front Raise | `shoulders` | *(none)* |
| Upright Row | `traps` | `shoulders` |
| Face Pull | `shoulders` | `traps` |
| Cable Lateral Raise | `shoulders` | *(none)* |

> **Research note:** OHP primarily loads the anterior and lateral deltoid heads. Lateral raises isolate the lateral deltoid — they have zero meaningful secondary activation.

##### Push — Triceps

| Exercise | primaryMuscle | secondaryMuscles |
|----------|--------------|-----------------|
| Tricep Pushdown (Bar) | `triceps` | *(none)* |
| Rope Pushdown | `triceps` | *(none)* |
| Overhead Tricep Extension | `triceps` | *(none)* |
| Skull Crusher (EZ Bar / Barbell) | `triceps` | *(none)* |
| Close Grip Bench Press | `triceps` | `chest` |
| Tricep Dip (narrow grip) | `triceps` | `chest`, `shoulders` |
| Kickback | `triceps` | *(none)* |

##### Pull — Back / Lats

| Exercise | primaryMuscle | secondaryMuscles |
|----------|--------------|-----------------|
| Pull-up | `lats` | `biceps`, `traps` |
| Chin-up | `lats` | `biceps` |
| Lat Pulldown (wide grip) | `lats` | `biceps`, `traps` |
| Seated Cable Row (wide grip) | `lats` | `biceps`, `traps` |
| Seated Cable Row (close grip) | `traps` | `lats`, `biceps` |
| Barbell Row (overhand) | `lats` | `traps`, `biceps`, `lowerback` |
| Barbell Row (underhand / Pendlay) | `lats` | `biceps`, `traps` |
| Dumbbell Row (one arm) | `lats` | `biceps`, `traps` |
| T-Bar Row | `lats` | `traps`, `biceps` |
| Cable Pullover | `lats` | *(none)* |
| Straight-Arm Pulldown | `lats` | *(none)* |

> **Research note:** The latissimus dorsi is the primary mover in all vertical pulling and most horizontal rows. Close-grip rows shift emphasis toward mid-traps/rhomboids.

##### Pull — Traps / Upper Back

| Exercise | primaryMuscle | secondaryMuscles |
|----------|--------------|-----------------|
| Barbell Shrug | `traps` | *(none)* |
| Dumbbell Shrug | `traps` | *(none)* |
| Reverse Fly (Dumbbell) | `traps` | `shoulders` |
| Reverse Fly (Cable / Pec Deck) | `traps` | `shoulders` |
| Face Pull | `shoulders` | `traps` |

##### Pull — Biceps

| Exercise | primaryMuscle | secondaryMuscles |
|----------|--------------|-----------------|
| Barbell Curl | `biceps` | `forearms` |
| Dumbbell Curl | `biceps` | `forearms` |
| Hammer Curl | `biceps` | `forearms` |
| Preacher Curl | `biceps` | *(none)* |
| Concentration Curl | `biceps` | *(none)* |
| Cable Curl | `biceps` | `forearms` |
| Incline Dumbbell Curl | `biceps` | *(none)* |

##### Pull — Lower Back

| Exercise | primaryMuscle | secondaryMuscles |
|----------|--------------|-----------------|
| Deadlift (Conventional) | `lowerback` | `hamstrings`, `glutes`, `traps` |
| Sumo Deadlift | `quads` | `glutes`, `hamstrings`, `lowerback` |
| Romanian Deadlift (RDL) | `hamstrings` | `glutes`, `lowerback` |
| Good Morning | `hamstrings` | `lowerback`, `glutes` |
| Hyperextension / Back Extension | `lowerback` | `glutes`, `hamstrings` |
| Jefferson Curl | `lowerback` | `hamstrings` |

> **Research note (Deadlift):** EMG meta-analysis (Martín-Fuentes et al., 2020) confirms erector spinae is the most consistently activated muscle in deadlift, followed by vastus lateralis and biceps femoris. Conventional deadlift is a **lower back / hip hinge** movement. Sumo shifts emphasis toward quads due to wider stance and more upright torso.

> **Research note (RDL):** The Romanian deadlift involves controlled hip flexion with minimal knee bend, placing the hamstrings under maximal eccentric stretch. This is a **hamstring-primary** movement, not a lower-back movement.

##### Legs — Quads

| Exercise | primaryMuscle | secondaryMuscles |
|----------|--------------|-----------------|
| Back Squat | `quads` | `glutes`, `hamstrings` |
| Front Squat | `quads` | `glutes` |
| Goblet Squat | `quads` | `glutes` |
| Hack Squat | `quads` | `glutes` |
| Leg Press | `quads` | `glutes`, `hamstrings` |
| Leg Extension | `quads` | *(none)* |
| Bulgarian Split Squat | `quads` | `glutes`, `hamstrings` |
| Lunge (forward / reverse / walking) | `quads` | `glutes`, `hamstrings` |
| Step-up | `glutes` | `quads`, `hamstrings` |
| Sumo Squat | `quads` | `glutes` |
| Sissy Squat | `quads` | *(none)* |
| Wall Sit | `quads` | *(none)* |

> **Research note (Back Squat):** This is the most researched lower-body exercise. EMG consistently shows the highest activation in the vastus lateralis, vastus medialis, and rectus femoris — the quadriceps group. Gluteus maximus activates significantly but at a lower level, functioning as a hip extensor during the ascending phase. Hamstrings co-contract for knee stability but are not primary movers. Do **not** award equal XP to quads and glutes from back squats.

> **Research note (Step-up / Lunge):** EMG research (Fauth et al., McCurdy et al.) shows unilateral movements shift more activation to the gluteus maximus and gluteus medius due to single-leg pelvic stabilisation requirements. Step-up is one of the best glute exercises; its `primaryMuscle` should be `glutes`, not `quads`.

##### Legs — Hamstrings

| Exercise | primaryMuscle | secondaryMuscles |
|----------|--------------|-----------------|
| Lying Leg Curl | `hamstrings` | *(none)* |
| Seated Leg Curl | `hamstrings` | *(none)* |
| Nordic Curl | `hamstrings` | *(none)* |
| Stiff-Leg Deadlift | `hamstrings` | `lowerback`, `glutes` |
| Romanian Deadlift | `hamstrings` | `glutes`, `lowerback` |
| Good Morning | `hamstrings` | `lowerback`, `glutes` |
| Glute Ham Raise (GHR) | `hamstrings` | `glutes` |

> **Root cause of the user's bug:** Lying leg curl was mapped to `"legs"` or `"quads"` instead of `"hamstrings"`. It is a pure knee-flexion isolation exercise. Only the hamstrings should receive XP.

##### Legs — Glutes

| Exercise | primaryMuscle | secondaryMuscles |
|----------|--------------|-----------------|
| Hip Thrust (Barbell) | `glutes` | `hamstrings` |
| Glute Bridge | `glutes` | `hamstrings` |
| Cable Kickback | `glutes` | *(none)* |
| Donkey Kickback | `glutes` | *(none)* |
| Abductor Machine | `glutes` | *(none)* |
| Sumo Deadlift | `quads` | `glutes`, `hamstrings`, `lowerback` |
| Step-up | `glutes` | `quads`, `hamstrings` |
| Clamshell | `glutes` | *(none)* |

> **Research note (Hip Thrust):** Barbell hip thrust produces the highest gluteus maximus EMG activation of any resistance exercise (Contreras et al., 2015), well above squats. Primary muscle is unambiguously `glutes`.

##### Legs — Calves

| Exercise | primaryMuscle | secondaryMuscles |
|----------|--------------|-----------------|
| Standing Calf Raise | `calves` | *(none)* |
| Seated Calf Raise | `calves` | *(none)* |
| Leg Press Calf Raise | `calves` | *(none)* |
| Donkey Calf Raise | `calves` | *(none)* |
| Box Jump (calf emphasis) | `calves` | `quads` |

##### Core

| Exercise | primaryMuscle | secondaryMuscles |
|----------|--------------|-----------------|
| Plank | `abs` | `shoulders` |
| Crunch | `abs` | *(none)* |
| Sit-up | `abs` | `obliques` |
| Cable Crunch | `abs` | *(none)* |
| Ab Wheel Rollout | `abs` | `lats`, `shoulders` |
| Hanging Leg Raise | `abs` | *(none)* |
| Leg Raise (flat) | `abs` | *(none)* |
| Russian Twist | `obliques` | `abs` |
| Side Plank | `obliques` | `abs` |
| Woodchop | `obliques` | `abs`, `shoulders` |
| Dead Bug | `abs` | *(none)* |
| Dragon Flag | `abs` | *(none)* |

---

#### Implementation Steps

**Step 1 — Update `splits.js`**

For every exercise object in every split, add `primaryMuscle` and `secondaryMuscles`:
```js
// Before:
{ id: 'bs', name: 'Back Squat', muscle: 'Legs', sets: 4, repsRange: '6-8' }

// After:
{
  id: 'bs',
  name: 'Back Squat',
  muscle: 'Legs',              // keep — used for display tag
  primaryMuscle: 'quads',      // NEW — used for XP calculation
  secondaryMuscles: ['glutes', 'hamstrings'],  // NEW — 30% XP each
  sets: 4,
  repsRange: '6-8'
}
```

Pay special attention to exercises that were previously wrong:
- `Lying Leg Curl` → `primaryMuscle: 'hamstrings'`, `secondaryMuscles: []`
- `Seated Leg Curl` → `primaryMuscle: 'hamstrings'`, `secondaryMuscles: []`
- `Romanian Deadlift` → `primaryMuscle: 'hamstrings'`, `secondaryMuscles: ['glutes', 'lowerback']`
- `Deadlift` → `primaryMuscle: 'lowerback'`, `secondaryMuscles: ['hamstrings', 'glutes', 'traps']`
- `Hip Thrust` → `primaryMuscle: 'glutes'`, `secondaryMuscles: ['hamstrings']`
- `Back Squat` → `primaryMuscle: 'quads'`, `secondaryMuscles: ['glutes', 'hamstrings']`
- `Step-up` → `primaryMuscle: 'glutes'`, `secondaryMuscles: ['quads', 'hamstrings']`

**Step 2 — Update `calcAllMuscleXP()` in `muscleData.js`**

Replace the flat muscle credit loop with weighted primary/secondary distribution:
```js
// Inside the per-set XP loop:
const baseXP = completedSet.reps * Math.max(completedSet.weight, 1);

// Primary muscle — full XP
const primary = exercise.primaryMuscle || exercise.muscle?.toLowerCase();
if (primary && muscleXP[primary] !== undefined) {
  muscleXP[primary] += baseXP;
}

// Secondary muscles — 30% XP each
(exercise.secondaryMuscles || []).forEach(musId => {
  if (muscleXP[musId] !== undefined) {
    muscleXP[musId] += baseXP * 0.3;
  }
});
```

> **Why 30%?** Secondary muscle contribution in EMG studies for compound exercises is typically 25–40% of primary activation. 30% is a clean, well-calibrated midpoint. This means doing 4 sets of 10 squats at 100kg gives quads 4,000 XP and glutes 1,200 XP — reflecting the real biomechanical stimulus.

**Step 3 — Fallback for exercises missing `primaryMuscle`**

Any user-added custom exercise or old log entry without `primaryMuscle` should fall back gracefully:
```js
// Fallback: if no primaryMuscle, try muscle field lowercased, else skip
const primary = exercise.primaryMuscle
  || muscleIdFromDisplayName(exercise.muscle)
  || null;
if (!primary) return; // skip rather than crash
```

Add a `muscleIdFromDisplayName()` helper in `muscleData.js` that maps common display strings to canonical IDs:
```js
const DISPLAY_TO_ID = {
  'chest': 'chest', 'pecs': 'chest',
  'back': 'lats', 'lats': 'lats', 'lat': 'lats',
  'shoulders': 'shoulders', 'delts': 'shoulders',
  'biceps': 'biceps', 'bi': 'biceps',
  'triceps': 'triceps', 'tri': 'triceps',
  'legs': 'quads',   // generic "legs" defaults to quads — better than nothing
  'quads': 'quads', 'quadriceps': 'quads',
  'hamstrings': 'hamstrings', 'hams': 'hamstrings',
  'glutes': 'glutes', 'glute': 'glutes', 'butt': 'glutes',
  'calves': 'calves', 'calf': 'calves',
  'abs': 'abs', 'core': 'abs',
  'traps': 'traps', 'trapezius': 'traps',
  'forearms': 'forearms',
  'lower back': 'lowerback', 'lowerback': 'lowerback',
  'obliques': 'obliques',
};
```

**Step 4 — Update Post-Workout Summary (`WorkoutPage.jsx`)**

The summary screen's `sessionMuscles` array (used to highlight body map) should now distinguish:
```js
const sessionPrimaryMuscles = [...new Set(
  completedExercises.map(ex => ex.primaryMuscle).filter(Boolean)
)];
const sessionSecondaryMuscles = [...new Set(
  completedExercises.flatMap(ex => ex.secondaryMuscles || [])
)].filter(m => !sessionPrimaryMuscles.includes(m));
```

Pass both arrays to `BodyMapSVG`:
- Primary muscles: full orange highlight
- Secondary muscles: dimmer orange (e.g. 40% opacity or `var(--o2)` tint)

**Step 5 — Update `getWeeklyMuscles()` in `muscleData.js`**

This function powers the "Muscles trained this week" widget on the dashboard. Update it to return `{ primary: [...], secondary: [...] }` instead of a flat array, so the dashboard chips can show primary muscles in orange and secondary in gray.

**Step 6 — Update `sample.js`**

Add `primaryMuscle` and `secondaryMuscles` to every exercise in the sample data. Sample workout logs reference exercises by ID — make sure the resolved exercise objects have the new fields when XP is calculated.

---

#### XP Impact Analysis

To verify the fix produces sensible numbers, here's what a typical leg day should look like after the fix:

**Workout: Back Squat 4×8 @ 100kg, Leg Press 3×12 @ 150kg, Lying Leg Curl 3×12 @ 50kg, Standing Calf Raise 3×15 @ 60kg**

| Muscle | Raw XP (before) | Raw XP (after) | Reason |
|--------|----------------|----------------|--------|
| Quads | 3,200 (squat) + 5,400 (leg press) = 8,600 | 3,200 + 5,400 = 8,600 | Primary for both |
| Glutes | 3,200 (squat, wrong) | 960 + 1,620 = 2,580 | 30% secondary |
| Hamstrings | 0 (leg curl broken) | 1,800 (curl primary) | Now correctly credited |
| Calves | 0 (mapped to "legs") | 2,700 (calf raise primary) | Now correctly credited |

This is the intended behaviour — quads dominate on a quad day, hamstrings only get credited when you actually do hamstring work.

---

#### Files to Modify

| File | Change |
|------|--------|
| `src/data/splits.js` | Add `primaryMuscle` + `secondaryMuscles` to **every** exercise in all splits |
| `src/data/muscleData.js` | Update `calcAllMuscleXP()` for weighted distribution; add `muscleIdFromDisplayName()`; update `getWeeklyMuscles()` |
| `src/components/pages/WorkoutPage.jsx` | Update post-workout summary to separate primary/secondary highlight arrays |
| `src/components/shared/BodyMapSVG.jsx` | Accept `primaryMuscles` + `secondaryMuscles` props; render secondary at reduced opacity |
| `src/data/sample.js` | Add `primaryMuscle` + `secondaryMuscles` to all sample exercise entries |

---

#### 🔍 Research Notes — Gaps & Corrections (2026-03-24)

After analysing the codebase against this spec, the following issues **must be addressed** before or during implementation:

**Gap 1 — Canonical IDs `lats`, `lowerback`, `obliques` do NOT exist in the codebase**

`MUSCLE_GROUPS` in `muscleData.js` uses **12 keys**: `chest`, `back`, `shoulders`, `biceps`, `triceps`, `traps`, `quads`, `hamstrings`, `glutes`, `calves`, `abs`, `forearms`. There is no `lats`, `lowerback`, or `obliques`.

> [!IMPORTANT]
> **Resolution:** Do NOT add new muscle group IDs (that would require new body-map PNGs). Instead, map in the exercise data:
> - `lats` → use `back`
> - `lowerback` → use `back`
> - `obliques` → use `abs`
>
> Update the Canonical Muscle ID table and all exercise mappings in this doc accordingly before implementing.

**Gap 2 — The `MAP` object and `getMusclesForExercise()` must be kept as fallback**

The current `calcAllMuscleXP()` resolves muscles via `exMuscleMap[ex.name]` → `getMusclesForExercise(muscleField)`. With 2.4, exercises in splits will have explicit `primaryMuscle`/`secondaryMuscles`, but **old workout logs and custom exercises won't**. The `MAP` + `getMusclesForExercise()` must remain as a fallback path, not be removed.

**Gap 3 — Workout logs do NOT store `primaryMuscle`/`secondaryMuscles`**

Workout log entries only contain `{ name, sets }`. The Step 2 code snippet in this doc assumes the exercise object has `exercise.primaryMuscle`, but logged exercises don't carry that field. The fix must build an `exPrimaryMap` and `exSecondaryMap` from split definitions (keyed by exercise name), similar to the existing `exMuscleMap` pattern, and look up the logged exercise name against it.

```js
// Build enhanced muscle lookup from splits
const exPrimaryMap = {};   // exerciseName → primaryMuscle key
const exSecondaryMap = {};  // exerciseName → secondaryMuscles[] keys
splits.forEach(split => {
  split.days?.forEach(day => {
    day.exercises?.forEach(ex => {
      if (ex.primaryMuscle) exPrimaryMap[ex.name] = ex.primaryMuscle;
      if (ex.secondaryMuscles) exSecondaryMap[ex.name] = ex.secondaryMuscles;
    });
  });
});
```

**Gap 4 — Sample data logs don't need `primaryMuscle` fields**

Step 6 says to "add `primaryMuscle` and `secondaryMuscles` to every exercise in the sample data." This is **unnecessary** — sample logs in `sample.js` only store `{ name, sets }`. The XP function resolves muscles from splits, not from logs. No changes needed to `sample.js` exercise entries specifically for primary/secondary. The sample log exercise names just need to match split exercise names (which they already do).

**Gap 5 — `BodyMapSVG` secondary muscle dimming requires canvas changes**

The current `CanvasBodyMap` does pixel-level red-channel detection to composite layers. It has no concept of per-layer opacity. To render secondary muscles dimmer:
- Use `ctx.globalAlpha = 0.4` before drawing secondary layer images on the offscreen canvas.
- Or reduce R channel intensity during pixel compositing for secondary layers.
- `CanvasBodyMap` needs a new prop (e.g. `opacity`) or a separate `secondaryLayerSrcs` prop with built-in dimming.

**Gap 6 — `getWeeklyMuscles()` return type change will break Dashboard**

If `getWeeklyMuscles()` returns `{ primary: [...], secondary: [...] }` instead of a flat array, `DashboardPage.jsx` will break on:
- `weeklyMuscles.length` (line ~238)
- `weeklyMuscles.slice(0, 6)` (line ~240)
- `<MiniBodyMap weeklyMuscles={weeklyMuscles} ...>` (line ~231)

**Resolution:** Either keep `getWeeklyMuscles()` returning a flat array (simpler), or update all Dashboard references to use the new shape. Recommend keeping flat array for now — the primary/secondary distinction is lower value on the dashboard widget.

**Gap 7 — Home/Yoga split exercises use compound `muscle` labels**

Exercises like `'Push-ups'` have `muscle: 'Chest/Triceps'`, `'Pull-ups'` have `muscle: 'Back/Biceps'`. The `muscleIdFromDisplayName()` fallback function must handle slash-separated strings by splitting on `/` and resolving each part independently. The first part should be treated as primary, subsequent parts as secondary.

```js
// Handle compound labels like 'Chest/Triceps'
const parts = displayName.split('/').map(s => DISPLAY_TO_ID[s.trim().toLowerCase()]);
return { primary: parts[0] || null, secondary: parts.slice(1).filter(Boolean) };
```

---

### 2.5 Body Map — Blank Canvas Fix + Gender Prop Implementation

> **Added:** 2026-03-24 — Body map completely invisible in production. Confirmed via screenshot.

---

#### Problem Statement

The Muscle Rankings page shows "FRONT" and "BACK" labels but completely black/invisible canvas areas where the body illustrations should appear. The XP data and rank cards are unaffected. This is a **production bug** affecting every user.

---

#### Root Cause — Full Chain of Failure

**Step 1 — PNG images return 404 in production**

The base and highlight PNGs in `public/muscles/` are either missing from the deployed build or not committed to the repository. Vite serves `public/` as static assets — if the files aren't there, every image request returns 404.

**Step 2 — `onerror` silently swallows the failure**

`BodyMapSVG.jsx` lines 50–56:
```js
img.onerror = () => {
  console.warn(`Failed to load image: ${src}`);
  const dummy = new Image();
  dummy.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
  dummy.onload = () => resolve(dummy);
};
```
No visible error state is set. The failed image is replaced with a **1×1 transparent GIF** and the Promise resolves normally.

**Step 3 — 1×1 dummy collapses the canvas**

```js
canvas.width = baseImg.width || 800;   // dummy.width = 1, not 0 → sets to 1px
canvas.height = baseImg.height || 800; // dummy.height = 1 → sets to 1px
```
The `|| 800` fallback never fires because the dummy GIF actually has a width/height of 1, not 0. Canvas becomes 1×1 pixels.

**Step 4 — CSS stretches the 1px canvas invisibly**

```css
canvas { width: 100%; height: auto; }
```
A 1×1 canvas stretched to container width renders as a ~1px transparent hairline. Against the dark card background this is completely invisible — exactly what the screenshot shows.

**Additional Issue — Gender Prop Never Implemented in Code**

Despite State.md marking 2.1 as ✅ Done, the actual `BodyMapSVG.jsx` source code:
- Has no `gender` prop in the component signature
- Always hardcodes `/muscles/front-base.png` and `/muscles/back-base.png`
- Has no `FEMALE_MUSCLE_IMAGES` constant or conditional path logic
- `MiniBodyMap` also has no gender awareness

The female anatomy implementation described in State.md does not exist in the codebase. It needs to be built.

---

#### Fix Plan

**Fix A — Deployment: Verify PNG files exist in `public/muscles/`**

Confirm the following files are committed to the repository and present in the deployed build. These are the required male anatomy PNGs:

```
public/muscles/
├── front-base.png
├── back-base.png
├── front-shoulders.png
├── front-chest.png
├── front-abs.png
├── front-biceps.png
├── front-forearms.png
├── front-quads.png
├── front-calves.png
├── back-traps.png
├── back-back.png
├── back-triceps.png
├── back-glutes.png
├── back-hamstrings.png
└── back-shoulders.png
```

And the female anatomy PNGs (needed for Fix C):
```
public/muscles/female/
├── front-base.png
├── back-base.png
├── front-shoulders.png
├── front-chest.png
├── front-abs.png
├── front-biceps.png
├── front-forearms.png
├── front-quads.png
├── front-calves.png
├── back-traps.png
├── back-back.png
├── back-triceps.png
├── back-glutes.png
├── back-hamstrings.png
└── back-shoulders.png
```

**Fix B — Replace silent dummy with visible error + loading state**

Update `CanvasBodyMap` in `BodyMapSVG.jsx` to track loading/error state and render a meaningful fallback when images fail:

```jsx
const CanvasBodyMap = ({ baseSrc, layerSrcs, label, borderRadius = 8 }) => {
  const canvasRef = useRef(null);
  const [loadError, setLoadError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setLoadError(false);
    // ... existing load logic
    Promise.all([loadImg(baseSrc), ...layerSrcs.map(loadImg)])
      .then(([baseImg, ...layerImgs]) => {
        if (!active) return;
        // If base image is the dummy (1×1), treat as error
        if (baseImg.width <= 1 || baseImg.height <= 1) {
          setLoadError(true);
          setLoading(false);
          return;
        }
        // ... rest of canvas drawing
        setLoading(false);
      })
      .catch(() => { setLoadError(true); setLoading(false); });
  }, [baseSrc, layerSrcs]);

  if (loadError) return (
    <div style={{
      width: '100%', aspectRatio: '1/2', borderRadius,
      background: 'var(--c3)', border: '1px dashed var(--bd2)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: 6,
    }}>
      {label && <div style={{ fontSize: 9, color: 'var(--t3)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px' }}>{label}</div>}
      <div style={{ fontSize: 10, color: 'var(--t3)' }}>Image unavailable</div>
    </div>
  );

  // ... rest of render with canvas
};
```

This prevents the invisible canvas problem regardless of whether Fix A is applied — if images are missing, user sees a clear placeholder instead of nothing.

**Fix C — Implement `gender` prop and female image paths**

Add `gender` prop to `BodyMapSVG` and define female image constants:

```js
// Add to BodyMapSVG.jsx alongside MUSCLE_IMAGES
const FEMALE_MUSCLE_IMAGES = {
  shoulders:  { view: 'front', file: '/muscles/female/front-shoulders.png' },
  chest:      { view: 'front', file: '/muscles/female/front-chest.png' },
  abs:        { view: 'front', file: '/muscles/female/front-abs.png' },
  biceps:     { view: 'front', file: '/muscles/female/front-biceps.png' },
  forearms:   { view: 'front', file: '/muscles/female/front-forearms.png' },
  quads:      { view: 'front', file: '/muscles/female/front-quads.png' },
  calves:     { view: 'front', file: '/muscles/female/front-calves.png' },
  traps:      { view: 'back',  file: '/muscles/female/back-traps.png' },
  back:       { view: 'back',  file: '/muscles/female/back-back.png' },
  triceps:    { view: 'back',  file: '/muscles/female/back-triceps.png' },
  glutes:     { view: 'back',  file: '/muscles/female/back-glutes.png' },
  hamstrings: { view: 'back',  file: '/muscles/female/back-hamstrings.png' },
};
const FEMALE_BACK_SHOULDER_IMG = '/muscles/female/back-shoulders.png';
```

Update the component signature and path selection:
```js
// BodyMapSVG component
export default function BodyMapSVG({ muscleXP = {}, mini = false, gender = 'male' }) {
  const isFemale = gender === 'female';
  const muscleImages = isFemale ? FEMALE_MUSCLE_IMAGES : MUSCLE_IMAGES;
  const backShoulderImg = isFemale ? FEMALE_BACK_SHOULDER_IMG : BACK_SHOULDER_IMG;
  const frontBase = isFemale ? '/muscles/female/front-base.png' : '/muscles/front-base.png';
  const backBase  = isFemale ? '/muscles/female/back-base.png'  : '/muscles/back-base.png';

  // Use muscleImages and backShoulderImg in layer resolution logic
  // Use frontBase / backBase in CanvasBodyMap baseSrc props
}
```

Update `MiniBodyMap` similarly:
```js
export const MiniBodyMap = ({ weeklyMuscles = [], gender = 'male' }) => {
  const isFemale = gender === 'female';
  const muscleImages = isFemale ? FEMALE_MUSCLE_IMAGES : MUSCLE_IMAGES;
  const frontBase = isFemale ? '/muscles/female/front-base.png' : '/muscles/front-base.png';
  // ...
};
```

**Fix D — Pass `gender` from context in calling components**

```jsx
// MuscleMapPage.jsx
const { user, workoutLogs, splits } = useApp();
// ...
<BodyMapSVG muscleXP={muscleXP} gender={user?.gender || 'male'} />

// DashboardPage.jsx
<MiniBodyMap weeklyMuscles={weeklyMuscles} gender={user?.gender || 'male'} />
```

---

#### Priority Order Within This Fix

1. **Fix B first** (error state) — immediate user-visible improvement, no assets needed
2. **Fix A next** (verify/add PNG files to repo) — makes the actual images appear
3. **Fix C + D together** (gender prop) — completes the female anatomy feature properly

---

#### Files to Modify

| File | Change |
|------|--------|
| `src/components/shared/BodyMapSVG.jsx` | Add `useState` for loading/error, visible error fallback, `gender` prop, `FEMALE_MUSCLE_IMAGES` constant, conditional path logic in both `BodyMapSVG` and `MiniBodyMap` |
| `src/components/pages/MuscleMapPage.jsx` | Pass `gender={user?.gender \|\| 'male'}` to `BodyMapSVG` |
| `src/components/pages/DashboardPage.jsx` | Pass `gender={user?.gender \|\| 'male'}` to `MiniBodyMap` |
| `public/muscles/` | Verify all 15 male PNGs are present and committed |
| `public/muscles/female/` | Add all 15 female PNGs (same naming convention as male) |

---

### 2.5 Research Notes — Gap Analysis (2026-03-24)

> Codebase audit performed against the Task 2.5 spec. **7 gaps identified**.

---

#### Gap 1 — Fix C & D are already implemented ✅ (Spec is wrong)

The spec claims BodyMapSVG has "no `gender` prop" and "always hardcodes `/muscles/front-base.png`." This is **factually incorrect** in the current codebase.

**Actual code (`BodyMapSVG.jsx` L143–144):**
```js
export default function BodyMapSVG({ muscleXP = {}, primaryMuscles = null, secondaryMuscles = null, mini = false, gender = 'male' }) {
  const getAssetUrl = (file) => gender === 'female' ? `/muscles/female/female-${file}` : `/muscles/${file}`;
```

**Actual callers — all 3 already pass `gender`:**
- `MuscleMapPage.jsx` L102: `<BodyMapSVG muscleXP={muscleXP} gender={user?.gender} />`
- `DashboardPage.jsx` L231: `<MiniBodyMap weeklyMuscles={weeklyMuscles} gender={user?.gender} />`
- `WorkoutPage.jsx` L148: `<BodyMapSVG ... gender={user?.gender} />`

**Action:** Remove Fix C and Fix D from the implementation plan entirely. No code changes needed.

---

#### Gap 2 — Female path convention mismatch

The spec proposes files named `female/front-base.png` but the code constructs the URL as `/muscles/female/female-front-base.png` (via `` `/muscles/female/female-${file}` ``).

**Decision needed:** Either:
- **(A)** Rename the PNGs to `female-front-base.png`, `female-back-base.png`, etc. to match the code. ← **Recommended (no code change)**
- **(B)** Change the code from `female-${file}` to just `${file}`. ← Requires code change.

**Action:** Document this mismatch. When female PNGs are sourced, name them to match the existing code convention (`female-front-base.png`).

---

#### Gap 3 — `public/muscles/female/` directory is empty

The directory does not exist at all on the filesystem. No female anatomy PNGs have been created or sourced.

**Impact:** The gender toggle works in code but will trigger the 1×1 dummy fallback for any female user, producing the same blank canvas bug.

**Action:** This is a known limitation. The error state fallback (Fix B) will handle this gracefully by showing "Image unavailable" instead of a blank canvas. Female PNGs remain a **separate asset-sourcing task**.

---

#### Gap 4 — Male PNGs ARE git-tracked (Spec root cause partially wrong)

The spec's "Step 1" says PNGs "are either missing from the deployed build or not committed to the repository."

**Verified:** All 17 male PNGs are committed to `origin/main`:
```
public/muscles/back-back.png     public/muscles/front-abs.png
public/muscles/back-base.png     public/muscles/front-base.png
public/muscles/back-calves.png   public/muscles/front-biceps.png
...etc (17 total, all tracked, git status clean)
```

**Updated root cause:** If the body map is blank in production, the issue is NOT missing files from the repo. Possible real causes:
1. Vercel build cache serving a stale version without the `public/muscles/` directory.
2. The canvas is working but the images are rendering at sub-pixel size due to CSS or container constraints.
3. A CORS issue on the deployed domain preventing canvas `getImageData()` from functioning (canvas gets "tainted" and silently fails).

**Action:** Fix B (error state) still addresses this regardless of root cause. Additionally, add CORS verification to the testing plan.

---

#### Gap 5 — Fix B code is missing `useState` import

The spec's Fix B snippet uses `useState` for `loadError` and `loading` state, but `BodyMapSVG.jsx` currently only imports:
```js
import { useMemo, useEffect, useRef } from 'react';
```

**Action:** When implementing Fix B, add `useState` to the import statement.

---

#### Gap 6 — Fix B code snippet is stale vs Task 2.4

The spec's Fix B code block shows `CanvasBodyMap` with only `layerSrcs` but Task 2.4 added the `secondaryLayerSrcs` prop. The error-state and loading-state logic must account for both arrays.

**Corrected signature for Fix B:**
```jsx
const CanvasBodyMap = ({ baseSrc, layerSrcs = [], secondaryLayerSrcs = [], label, borderRadius = 8 }) => {
  const [loadError, setLoadError] = useState(false);
  // ... rest of Fix B logic, but Promise.all must include secondaryLayerSrcs
```

**Action:** Update Fix B implementation to preserve `secondaryLayerSrcs` in the `Promise.all` chain and error handling.

---

#### Gap 7 — No verification plan

The spec has no section describing how to verify the fix works.

**Proposed verification:**
1. **Local dev:** Run `npm run dev`, navigate to `/muscle-map`. Canvas should render with all muscle highlights. Open Console — no errors.
2. **Simulated failure:** Temporarily rename `front-base.png` → `front-base.bak`. Reload. Should see "Image unavailable" placeholder instead of blank canvas.
3. **Female fallback:** Set `user.gender` to `'female'` in the app. Should show "Image unavailable" gracefully (since female PNGs don't exist yet).
4. **Production deploy:** Push to Vercel. Verify `/muscle-map` renders correctly on the deployed URL. Check Network tab for 200 status on all PNG requests.
5. **CORS check:** On the deployed site, open Console. Confirm no `SecurityError` or "tainted canvas" warnings.

---

#### Revised Implementation Plan (after gap analysis)

| Fix | Description | Status | Still Needed? |
|-----|-------------|--------|:-------------:|
| Fix A | Verify PNGs exist in repo | ✅ Verified — all 17 tracked on `main` | ❌ No |
| Fix B | Error/loading state for `CanvasBodyMap` | Needs implementation | ✅ Yes |
| Fix C | Gender prop + female image constants | ✅ Already implemented | ❌ No |
| Fix D | Pass `gender` from context in callers | ✅ Already implemented | ❌ No |

**Only Fix B remains to be implemented.** The scope is significantly smaller than the original spec suggested.

---

## ⚠️ Known Dependency

- **2.3 must be done before 2.2** — the Post-Workout Summary's XP delta calculation depends on whichever XP formula is active. Implement the monthly reset first, then build the summary screen on top of it.
- **2.4 must be done after 2.3** — the weighted XP formula in 2.4 builds on top of the monthly-reset architecture from 2.3. Do not implement 2.4 before 2.3.
- **Sample data in `sample.js` needs updating** after 2.3 — existing logs span 10 weeks of history. Once XP is monthly-scoped, sample logs must be regenerated to fall within the current calendar month, otherwise the demo user (Vishal) will show Untrained rank on first load.

---

## 🗓️ Phase 2 Implementation Order

| Order | Item | Effort | Impact | Status |
|:-----:|------|:------:|:------:|:------:|
| 1     | 2.3 XP Recalculation | 🔴 Large | High | ✅ Done |
| 2     | 2.2 Post-Workout Summary | 🟡 Medium | High | ✅ Done |
| 3     | 2.1 Female Anatomy | 🔴 Large | Medium | ✅ Done |
| 4     | 2.4 XP Distribution Fix | 🟡 Medium | 🔴 Critical | ✅ Done |
| 5     | 2.5 Body Map Blank Canvas + Gender Fix | 🟢 Small | 🔴 Critical | ✅ Done |