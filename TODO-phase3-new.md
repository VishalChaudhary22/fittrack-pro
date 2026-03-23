# FitTrack Pro — Phase 3: New Features

<!-- Scope: Brand new pages and capabilities. Each item is a standalone feature addition. -->

> **Last updated:** 2026-03-23 · Known Gaps — these features don't exist yet in the app.

---

## 🚀 Phase 3 — New Features (Known Gaps)

### 3.1 Water Intake Tracker

**Goal:** Help users track daily hydration — a top request in Indian fitness apps.

**Requirements:**
- Daily hydration goal (default 3L, adjustable per user).
- Per-glass logging (250ml increments via tap-to-add buttons).
- Progress ring visualization on the Dashboard widget.
- Reset automatically at midnight.
- Store in `AppContext.jsx` as `waterLog` (array of `{ id, userId, date, ml }`).

**New files:**
- `src/components/pages/WaterPage.jsx` — full page with goal setting + history
- Add `waterLog` state to `src/context/AppContext.jsx`
- Add route `/water` in `App.jsx`
- Add nav item in `src/data/constants.js`

---

### 3.2 Cardio / Step Logging

**Goal:** Add cardio tracking alongside weight training — currently zero cardio support exists.

**Requirements:**
- Support activity types: running, cycling, HIIT, swimming, skipping, walking.
- Log fields: activity type, duration (min), distance (km, optional), estimated calories burned.
- Calorie estimation using MET values:
  ```js
  calories = MET × user.weight × duration_hours
  ```
- Show cardio history with weekly/monthly summaries (total duration, total calories).
- Indian-relevant activities to include: cricket, badminton, yoga (as cardio).

**New files:**
- `src/components/pages/CardioPage.jsx`
- `src/data/cardioExercises.js` — MET values per activity
- Add `cardioLog` state to `src/context/AppContext.jsx`
- Add route `/cardio` in `App.jsx`

---

### 3.3 Supplement & Medicine Reminders

**Goal:** Daily supplement tracking with optional time-based reminders.

**Requirements:**
- Pre-built supplement list: Creatine, Vitamin D, Omega-3, Whey Protein, Multivitamin, Ashwagandha, Zinc, Magnesium.
- User can add custom supplements.
- Daily checklist — tap to mark taken.
- Optional time-based reminders (ties into 3.6 Push Notifications if implemented).
- Store as `supplementLog` in `AppContext.jsx`.
- Indian brands to reference: HealthKart, MuscleBlaze, Himalaya, Dabur.

**New files:**
- `src/components/pages/SupplementsPage.jsx`
- Add `supplementLog` + `supplementConfig` state to `src/context/AppContext.jsx`
- Add route `/supplements` in `App.jsx`

---

### 3.4 Period Tracker Integration (Female Users)

**Goal:** Cycle-aware workout recommendations for female users.

**Requirements:**
- Only visible when `user.gender === 'female'`.
- Track cycle phases: menstrual → follicular → ovulation → luteal.
- Auto-suggest workout intensity per phase:
  - **Menstrual / Luteal** → lighter loads, more recovery, yoga/stretching.
  - **Follicular / Ovulation** → higher intensity, PRs, heavy compounds.
- Display a small phase badge on the Dashboard for female users.
- Store cycle start date in user profile.

**New files:**
- `src/components/pages/CycleTrackerPage.jsx`
- `src/utils/cycleCalculations.js` — phase detection logic
- Add route `/cycle` in `App.jsx`
- Modify `DashboardPage.jsx` — add conditional phase badge for `gender === 'female'`

---

### 3.5 Festival / Holiday Workout Adaptations (Indian Calendar)

**Goal:** Cultural awareness — recognize major Indian holidays and adapt workout suggestions.

**Requirements:**
- Hard-code major Indian holidays with approximate dates:
  - Diwali, Holi, Eid ul-Fitr, Eid ul-Adha, Navratri, Durga Puja, Pongal, Onam, Ganesh Chaturthi, Baisakhi, Christmas, New Year, Republic Day, Independence Day.
- On festival days, show a banner on the Dashboard:
  - Suggest home workouts or rest.
  - Optionally mark the day as a "light day" or "rest day".
- Use `new Date()` comparison against holiday list.
- Banner should be dismissible (don't show again today).

**New files:**
- `src/data/indianHolidays.js` — export array of `{ name, month, day, type: 'major' | 'minor' }`
- Modify `src/components/pages/DashboardPage.jsx` — add festival banner logic

---

### 3.6 Push Notifications / PWA Support

**Goal:** Make FitTrack Pro installable as a PWA with native-feeling notifications.

**Requirements:**
- Add `public/manifest.json` (icons, name: "FitTrack Pro", theme_color: `#E8540D`, display: standalone).
- Register a Service Worker at `public/sw.js`.
- Notification types:
  - Workout reminders (user-configurable time of day).
  - Water reminders (every 2 hours when goal not met).
  - Streak nudges ("Don't break your 5-day streak!").
- Update `vite.config.js` to support SW generation (consider `vite-plugin-pwa`).
- **New dependency:** `vite-plugin-pwa`

---

### 3.7 Yoga / Meditation Timer

**Goal:** Dedicated timer page for yoga and breathwork — the Home Workouts split already has yoga exercises but no tooling to guide them.

**Requirements:**
- Breath hold timer with configurable inhale / hold / exhale phases (e.g., 4-7-8 breathing, box breathing).
- Guided session flow — auto-advance through a list of poses with configurable hold times per pose.
- Audio cues on phase transitions using Web Audio API (same pattern as existing rest timer in `WorkoutPage.jsx`).
- Session summary at the end: total duration, poses completed.
- Preset sessions: Surya Namaskar (12 poses), Evening Wind-Down, Pre-Workout Activation.

**New files:**
- `src/components/pages/YogaTimerPage.jsx`
- Add route `/yoga-timer` in `App.jsx`
- Add nav item under "More" in `src/data/constants.js`

---

### 3.8 1RM Calculator — Standalone Tool Page

**Goal:** Surface the existing `calc1RM()` utility as a proper standalone tool.

**Requirements:**
- Input: weight lifted (kg) + reps performed.
- Output: estimated 1RM via Epley formula (already exists in `utils/calculations.js`).
- Show a full percentage table: 100% / 95% / 90% / 85% / 80% / 75% / 70% / 65% → kg + suggested rep range.
- Support multiple formula options: Epley, Brzycki, Lander (toggle between them).
- Save last entered values in `localStorage` for convenience.

**Files to modify / create:**
- `src/components/pages/OneRMPage.jsx` — **[NEW]**
- `src/utils/calculations.js` — add Brzycki and Lander formulas alongside existing Epley
- Add route `/tools/1rm` in `App.jsx`
- Add to "More" nav in `src/data/constants.js`

---

### 3.9 Powerlifting Split — Build Out

**Goal:** Complete the `comingSoon: true` powerlifting split in `splits.js`.

**Requirements:**
- Program style: 5/3/1 variant (Wendler) — 4-day upper/lower with main compound + accessories.
- Structure:
  - **Day 1 — Squat:** Back Squat (main) + Leg Press, Walking Lunges, Leg Curls, Calf Raises.
  - **Day 2 — Bench:** Bench Press (main) + Incline DB Press, Cable Flyes, Tricep Pushdowns, Face Pulls.
  - **Day 3 — Deadlift:** Deadlift (main) + Romanian Deadlift, Barbell Row, Back Extensions, Leg Curls.
  - **Day 4 — OHP:** Overhead Press (main) + Lateral Raises, Rear Delt Flyes, Bicep Curls, Hammer Curls.
- Add percentage-based programming note in exercise `notes` field (e.g., "Week 1: 65% 1RM × 5, Week 2: 75% × 3, Week 3: 85% × 1+").
- Remove `comingSoon: true` from the split entry.

**Files to modify:**
- `src/data/splits.js` — populate the `pl` split object, remove `comingSoon: true`

---

### 3.10 Social / Sharing

**Goal:** Let users share achievements — drives organic growth and motivation.

**Shareable cards for:**
- Personal Records (PRs) — "I hit a new 1RM: 100kg Bench Press!"
- Streak milestones — 7 days, 30 days, 100 days.
- Workout summaries — exercises + volume logged.
- Rank-ups — "Promoted to Silver I in Chest this month!"

**Requirements:**
- Generate card as canvas (using `html2canvas`) or custom SVG → PNG.
- Share via Web Share API (native share sheet on mobile — Android/iOS).
- Cards should use FitTrack Pro branding: orange `#E8540D`, Bebas Neue font, dark background.
- Fallback: copy image to clipboard on desktop.

**Files to modify / create:**
- `src/components/shared/ShareCard.jsx` — **[NEW]** canvas-based card renderer
- `src/components/pages/WorkoutPage.jsx` — add share button on the done/summary screen
- `src/components/pages/MuscleMapPage.jsx` — add share button on rank-up moments
- **New dependency:** `html2canvas`

---

## 🗓️ Phase 3 Implementation Order

| Order | Item | Effort | Impact |
|:-----:|------|:------:|:------:|
| 1     | 3.9 Powerlifting Split | 🟡 Medium | Medium |
| 2     | 3.1 Water Tracker | 🟡 Medium | High |
| 3     | 3.8 1RM Calculator Page | 🟡 Medium | Medium |
| 4     | 3.2 Cardio Logging | 🟡 Medium | Medium |
| 5     | 3.3 Supplement Reminders | 🟡 Medium | Medium |
| 6     | 3.7 Yoga Timer | 🟡 Medium | Low |
| 7     | 3.4 Period Tracker | 🟡 Medium | Medium |
| 8     | 3.5 Festival Adaptations | 🟢 Small | Low |
| 9     | 3.10 Social Sharing | 🔴 Large | Medium |
| 10    | 3.6 PWA / Notifications | 🔴 Large | High |
