# FitTrack Pro — Roadmap & TODO

> **Last updated:** 2026-03-23 · Organized by priority & grouped by domain.

---

## 🔧 Phase 1 — Bug Fixes & UI Polish (High Priority)

### 1.1 Theme / Text Readability (Global)

**Problem:** Card text readability is inconsistent. Some labels (e.g. "BMI Status" heading, BMI boxes) are too faded and too small. The design language is not uniform across all cards.

**Scope of change:**
- **Card heading text** (labels like "Current Weight", "BMI Status"): should be slightly larger (`fontSize: 12` → `13–14`) and use a less-faded gray (`var(--t2)` instead of `var(--t3)`).
- **Primary value text** on every card: should always be **white** (`var(--tx)` or `#fff`), not faded gray.
- **Card icon**: always **orange** (`var(--o)`) — this is already mostly correct.
- **Highlighting elements** (progress bars, status boxes, tags, badges): should all use the orange accent (`var(--o)` / `var(--og)` / `var(--o2)`).
- **BMI boxes** (Under, Normal, Over, Obese) in `DashboardPage.jsx`: increase font size from `9px` → `10–11px`, use slightly brighter color for inactive labels.

**Files to modify:**
- `src/components/pages/DashboardPage.jsx` — StatCard usage, BMI card section
- `src/components/shared/SharedComponents.jsx` — `StatCard` component (if text styles are defined there)
- `src/index.css` — potentially add/update CSS variables for consistent card text hierarchy

---

### 1.2 Mobile Navigation — Move "Splits" to Main Nav

**Problem:** On mobile, the "Splits" page is buried in the "More" menu (`NAV_MOBILE_MORE` in `constants.js`). It should be the 2nd item after Home.

**Fix in `src/data/constants.js`:**
- Move `{ id: 'splits', label: 'Splits', Icon: Dumbbell, path: '/splits' }` from `NAV_MOBILE_MORE` to `NAV_MOBILE_MAIN` at index 1 (after Home/Dashboard).
- Consider removing one item from `NAV_MOBILE_MAIN` to keep the bottom nav uncluttered (e.g., move "Progress" to "More"), or use 5-tab layout.

---

### 1.3 Workout Page — Blank Reps/Kg by Default

**Problem:** When starting a workout, the reps and kg counters are pre-filled from the previous session or from the `repsRange`. They should start **blank** (empty string) by default, with **3 sets** unless a custom set count was previously configured.

**Current behavior** (`WorkoutPage.jsx`, line 77–79):
```js
sets: Array.from({ length: ex.sets }, (_, i) => {
  const ps = pe?.sets?.[i];
  return { reps: ps?.reps || ex.repsRange?.split('-')[0] || 8, weight: ps?.weight || 0, done: false };
}),
```

**Fix:**
- Change default `reps` to `''` (empty string) and `weight` to `''` (empty string) so inputs appear blank.
- Lock default set count to `3` unless a user preference or previous log specifies otherwise:
  ```js
  const setCount = pe ? pe.sets.length : 3;
  ```
- Update `upd()` function to handle empty string → 0 conversion only when marking sets as done.
- Show `repsRange` as a **placeholder** on the input fields rather than as a pre-filled value.

---

### 1.4 Rest Timer Icon — Make It Larger & More Readable

**Problem:** The rest timer icon + dropdown in the workout session header is too small (`Timer` icon at size `14`, select at `fontSize: 11`).

**Fix in `WorkoutPage.jsx` (line 126–129):**
- Increase `Timer` icon size from `14` → `20`.
- Increase select font size from `11` → `13`.
- Add a subtle orange-tinted background behind the timer area for better visibility.
- Consider adding a label "Rest:" before the dropdown.

---

### 1.5 Done Button → Checkbox Redesign

**Problem:** The "done" button per set is a circular `○` / `✓` toggle. It should be a **checkbox** beside the set and rep counter area. Default: gray empty checkbox. On completion: orange tick mark inside a filled checkbox.

**Current** (`WorkoutPage.jsx`, line 148–150): Round button with `'○'` / `'✓'` text.

**Redesign:**
- Replace the round button with a proper square checkbox (16–18px, border-radius: 4px).
- Default state: gray border (`var(--bd)`), no fill.
- Completed state: orange fill (`var(--o)`) with a white `✓` check icon inside.
- Position: to the left of or inline with the set number, not at the end.
- Ensure it still triggers the rest timer when toggled.

---

### 1.6 Weight Change Arrow — Fix Logic

**Problem:** On the Home page, the weight change arrow under "Current Weight" card does not show the correct delta. It currently computes an average of recent week vs. older entries.

**Current logic** (`DashboardPage.jsx`, lines 35–43):
```js
const trend = useMemo(() => {
  // Compares average of last 7 days vs. average of all older entries
});
```

**Fix:**
- Replace with simple previous-log comparison:
  ```js
  const trend = useMemo(() => {
    if (allUserLogs.length < 2) return undefined;
    const latest = allUserLogs[allUserLogs.length - 1].weight;
    const previous = allUserLogs[allUserLogs.length - 2].weight;
    return +(latest - previous).toFixed(1);
  }, [allUserLogs]);
  ```
- This ensures the arrow and value reflect the change **from the last logged weight**, which is what the user expects.

---

### 1.7 Muscle Map Progress Bar — Verify XP Bar Accuracy

**Problem:** Muscle map page shows progress bars per body part that appear under-filled relative to the XP amount.

**Analysis:** Reviewed `getRank()` in `muscleData.js` — the progress calculation divides `(xp - currentTier.minXP) / (nextTier.minXP - currentTier.minXP)`. This is **within-tier progress**, not overall progress. E.g., 567 XP in Bronze II (range: 500–1000) means progress = `(567 - 500) / (1000 - 500)` = 13.4%, which looks like ~1/7th filled.

**The math is technically correct for within-tier progress**, but the user expects it to represent overall progress toward the next tier.

**Options:**
1. **Show absolute progress** within the tier bar — label should read "567 / 1000 XP" and bar should fill to 56.7% (i.e., use `xp / nextTierMinXP` instead of delta-based calculation).
2. Keep the current within-tier calculation but add clearer labeling: "67 / 500 XP to Bronze III".

**Recommended fix (Option 1):** Change `getRank()` or the MuscleCard rendering to use `xp / nextXP` as the bar width so that 567/1000 shows as ~57% filled:
```js
// In MuscleCard or getRank:
const barProgress = next ? xp / next.minXP : 1;
```

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

## 🚀 Phase 3 — New Features (Known Gaps)

### 3.1 Water Intake Tracker
- Daily hydration goal (default 3L, adjustable).
- Per-glass logging (250ml increments via tap-to-add).
- Progress ring visualization on Dashboard.
- **New files:** `src/components/pages/WaterPage.jsx`, water data in `AppContext.jsx`.
- Add route `/water` and nav item.

### 3.2 Cardio / Step Logging
- Support for running, cycling, HIIT, swimming, skipping.
- Log: duration (min), distance (km), estimated calories burned.
- Use MET values for calorie estimation: `calories = MET × weight × duration_hours`.
- Show cardio history with weekly/monthly summaries.
- **New files:** `src/components/pages/CardioPage.jsx`, `src/data/cardioExercises.js`.

### 3.3 Supplement & Medicine Reminders
- Creatine, vitamin D, omega-3, protein powder, etc.
- Daily checklist (checkboxes for each supplement).
- Optional time-based reminders (with Push Notification API — see 3.7).
- Store as a separate log in `AppContext.jsx` (`supplementLog`).
- **New files:** `src/components/pages/SupplementsPage.jsx`.

### 3.4 Period Tracker Integration (Female Users)
- Only visible when `user.gender === 'female'`.
- Track cycle phases: menstrual → follicular → ovulation → luteal.
- Show current phase and auto-suggest workout intensity:
  - Menstrual/luteal → lighter loads, more recovery.
  - Follicular/ovulation → higher intensity.
- Display a small badge on Dashboard with current phase.
- **New files:** `src/components/pages/CycleTrackerPage.jsx`, `src/utils/cycleCalculations.js`.

### 3.5 Festival / Holiday Workout Adaptations (Indian Calendar)
- Hard-code major Indian holidays (Diwali, Holi, Eid, Navratri, Pongal, Onam, Christmas, etc.) with their approximate dates.
- On festival days, show a banner on the Dashboard:
  - Suggest home workouts or rest.
  - Optionally mark the day as a "light day" or "rest day".
- Use `new Date()` comparison against holiday list.
- **New: `src/data/indianHolidays.js`** — export an array of `{ name, month, day, type }`.

### 3.6 Push Notifications / PWA Support
- Add `public/manifest.json` for PWA (icons, name, theme_color, display: standalone).
- Register a Service Worker (`public/sw.js`).
- Use Notification API for:
  - Workout reminders (user-configurable time).
  - Water reminders (every 2 hours).
  - Streak nudges ("Don't break your 5-day streak!").
- Update `vite.config.js` to generate the SW (e.g., use `vite-plugin-pwa`).

### 3.7 Yoga / Meditation Timer
- Home Workouts split already has yoga exercises but no dedicated timer.
- Build a `YogaTimerPage.jsx`:
  - Breath hold timer with inhale/hold/exhale phases.
  - Guided session flow (auto-advance through poses with configurable hold times).
  - Audio cues (bell sound on phase transitions, use Web Audio API like the rest timer already does).
  - Session summary at the end with total duration.

### 3.8 1RM Calculator — Standalone Tool Page
- Currently buried inside `ProgressPage.jsx`. The `calc1RM()` function exists in `utils/calculations.js`.
- Create a dedicated `/tools/1rm` page:
  - Input: weight lifted + reps performed.
  - Output: estimated 1RM (Epley formula), percentage chart (e.g., 90% 1RM = X kg for 3 reps).
  - Show a table of rep ranges and their corresponding weights.
- Add to nav as a sub-item or under "More" on mobile.

### 3.9 Powerlifting Split — Build Out
- Currently `comingSoon: true` in `splits.js` with empty schedule/days.
- Design a proper Powerlifting program (e.g., 5/3/1, Texas Method, or starting strength variant):
  - **Day 1:** Squat (main) + accessories (leg press, lunges, leg curls)
  - **Day 2:** Bench Press (main) + accessories (incline DB, flyes, triceps)
  - **Day 3:** Deadlift (main) + accessories (rows, RDL, back extensions)
  - **Day 4:** OHP (main) + accessories (lateral raises, face pulls, biceps)
- Add percentage-based programming: main lifts at % of 1RM by week.
- Remove `comingSoon: true` and populate schedule/days.

### 3.10 Social / Sharing
- Generate a shareable card (canvas-based or HTML-to-image) for:
  - Personal Records (PRs).
  - Streak milestones (7, 30, 100 days).
  - Workout summaries.
  - Rank-ups (e.g., "Promoted to Silver I in Chest!").
- Use `html2canvas` or SVG → PNG conversion.
- Share via Web Share API (native share sheet on mobile).
- **New dependency:** `html2canvas` (or custom canvas rendering).

---

## 📋 Phase 4 — Technical Improvements

### 4.1 Data Export / Import
- Allow users to export all data (workout logs, health logs, measurements) as JSON or CSV.
- Import from JSON to restore data on a new device.
- Add to Profile page.

### 4.2 Offline Support
- Service Worker caching of app shell and static assets.
- Queue workout logs when offline, sync when back online.
- Tie into PWA work (Phase 3.6).

### 4.3 Dark/Light Theme Polish
- Audit all pages for theme consistency (some inline styles use hardcoded colors instead of CSS variables).
- Ensure all cards, modals, and inputs respect `data-theme`.

### 4.4 Accessibility (a11y)
- Add `aria-label` to all icon-only buttons (rest timer, close buttons, etc.).
- Ensure proper focus management in modals.
- Add keyboard navigation for the ScrollPicker component.
- Color contrast: verify orange-on-dark meets WCAG AA (4.5:1 ratio for normal text).

### 4.5 Performance
- Lazy-load page components using `React.lazy()` + `Suspense`.
- Memoize expensive computations in DashboardPage (some are already using `useMemo`).
- Consider `useCallback` for event handlers passed as props.

### 4.6 Testing
- Add unit tests for utility functions (`calculations.js`, `helpers.js`, `muscleData.js`).
- Add component tests for key flows (login, workout logging, weight logging).
- Consider `vitest` (Vite-native) + `@testing-library/react`.

---

## 🗓️ Suggested Implementation Order

| Order | Item | Effort | Impact |
|:-----:|------|:------:|:------:|
| 1     | 1.2 Mobile Nav Fix | 🟢 Small | High |
| 2     | 1.6 Weight Change Fix | 🟢 Small | High |
| 3     | 1.3 Blank Reps/Kg | 🟢 Small | High |
| 4     | 1.4 Timer Icon Size | 🟢 Small | Medium |
| 5     | 1.5 Done → Checkbox | 🟡 Medium | Medium |
| 6     | 1.1 Theme Readability | 🟡 Medium | High |
| 7     | 1.7 XP Bar Accuracy | 🟡 Medium | High |
| 8     | 2.3 XP Recalculation | 🔴 Large | High |
| 9     | 2.2 Post-Workout Summary | 🟡 Medium | High |
| 10    | 2.1 Female Anatomy | 🔴 Large | Medium |
| 11    | 3.9 Powerlifting Split | 🟡 Medium | Medium |
| 12    | 3.1 Water Tracker | 🟡 Medium | High |
| 13    | 3.8 1RM Calculator Page | 🟡 Medium | Medium |
| 14    | 3.2 Cardio Logging | 🟡 Medium | Medium |
| 15    | 3.3 Supplement Reminders | 🟡 Medium | Medium |
| 16    | 3.7 Yoga Timer | 🟡 Medium | Low |
| 17    | 3.4 Period Tracker | 🟡 Medium | Medium |
| 18    | 3.5 Festival Adaptations | 🟢 Small | Low |
| 19    | 3.10 Social Sharing | 🔴 Large | Medium |
| 20    | 3.6 PWA / Notifications | 🔴 Large | High |
| 21    | 4.1–4.6 Technical Debt | 🔴 Ongoing | High |