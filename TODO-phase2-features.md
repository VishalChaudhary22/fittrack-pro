# FitTrack Pro — Phase 2: Feature Enhancements

<!-- Scope: Enhancements to existing features. Medium priority, moderate effort. -->

> **Last updated:** 2026-03-23 · Medium Priority — tackle after Phase 1 is complete.

---

## 🏋️ Phase 2 — Feature Enhancements (Medium Priority)

### 2.1 Female Anatomy for Muscle Map

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

### 2.2 Post-Workout Summary Screen

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

### 2.3 XP Recalculation — Monthly Reset System

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
   | Diamond      |         200,000 | Outstanding month — elite consistency             |
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

## ⚠️ Known Dependency

- **2.3 must be done before 2.2** — the Post-Workout Summary's XP delta calculation depends on whichever XP formula is active. Implement the monthly reset first, then build the summary screen on top of it.
- **Sample data in `sample.js` needs updating** after 2.3 — existing logs span 10 weeks of history. Once XP is monthly-scoped, sample logs must be regenerated to fall within the current calendar month, otherwise the demo user (Vishal) will show Untrained rank on first load.

---

## 🗓️ Phase 2 Implementation Order

| Order | Item | Effort | Impact |
|:-----:|------|:------:|:------:|
| 1     | 2.3 XP Recalculation | 🔴 Large | High |
| 2     | 2.2 Post-Workout Summary | 🟡 Medium | High |
| 3     | 2.1 Female Anatomy | 🔴 Large | Medium |
