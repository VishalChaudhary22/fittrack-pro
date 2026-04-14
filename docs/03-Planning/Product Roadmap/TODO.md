# FitTrack Pro — Roadmap & TODO

> **Last updated:** 2026-03-23 · Organized by priority & grouped by domain.

---

## ✅ Phase 1 — Bug Fixes & UI Polish (COMPLETED)

*(All items in Phase 1 were successfully implemented on 2026-03-23)*

### 1.1 Theme / Text Readability (Global) [DONE]
**Fix applied:** Increased font size and contrast for `StatCard` labels and BMI status boxes. Ensured primary values are pure white (`var(--tx)`).

### 1.2 Mobile Navigation [DONE]
**Fix applied:** Moved "Splits" from the "More" menu to the main bottom navigation bar `NAV_MOBILE_MAIN`.

### 1.3 Workout Page — Blank Reps/Kg by Default [DONE]
**Fix applied:** Sets now default to 3 (or match split definition) and inputs begin entirely blank, using standard placeholders (e.g. `8-12` or `kg`), avoiding coercion to `0`.

### 1.4 Rest Timer Icon [DONE]
**Fix applied:** Increased `Timer` icon to size 20, increased dropdown font size to 13, and added a bold "REST:" label for better tap targets and visibility.

### 1.5 Done Button → Checkbox Redesign [DONE]
**Fix applied:** Replaced the circular `○`/`✓` toggle with a sleek, square checkbox that fills orange with a checkmark when completed. positioned next to the set number.

### 1.6 Weight Change Arrow [DONE]
**Fix applied:** The trend calculation in `DashboardPage.jsx` now strictly compares the *latest* log against the *immediately previous* log, accurately reflecting the change since the last entry.

### 1.7 Muscle Map Progress Bar [DONE]
*(Note: Visual update pending if required, determined that current math is technically correct for within-tier progress).*

---

## ✅ Phase 2 — Feature Enhancements (COMPLETED)

*(All items in Phase 2 were successfully implemented on 2026-03-24)*

### 2.1 Female Anatomy for Muscle Map [DONE]
**Implementation:** `BodyMapSVG.jsx` now dynamically selects from 13+ dedicated female anatomical PNGs based on the `user.gender` profile setting.

### 2.2 Post-Workout Summary Screen [DONE]
**Implementation:** Redesigned the "Workout Complete" flow to compute session-specific muscle activity, XP delta, and total volume, rendering an interactive summary map.

### 2.3 XP Recalculation — Monthly Reset System [DONE]
**Implementation:** Overhauled `calcAllMuscleXP` to compute progress from the current calendar month logs. Included **Consistency Bonuses** (1.25x-1.5x) and monthly ranking persistence.

### 2.4 XP Distribution Fix (Primary vs Secondary) [DONE]
**Implementation:** Mapped all exercises in `splits.js` to specific primary and secondary muscle IDs. Rewrote calculation logic to distribute weighted XP and updated `BodyMapSVG` for alpha-blended secondary layer highlights.

---

## 🚀 Phase 3 — New Features (High Priority)

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