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

### 3.4 Period Tracker Integration (Female Users) [COMPLETED]

**Goal:** Cycle-aware workout recommendations for female users.

**Status:** Completed and integrated. The `CycleTrackerPage` provides a comprehensive view for female athletes, with real-time phase detection and a dynamic Dashboard badge. Requires `gender: 'female'` in profile.

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

### 3.7 Yoga / Meditation Timer [COMPLETED]

**Goal:** Dedicated timer page for yoga and breathwork — the Home Workouts split already has yoga exercises but no tooling to guide them.

**Status:** Completed and integrated. The Yoga Flow view successfully plays an automated audio-guided sequence of poses (with sets/durations), integrated with the web audio API and speech synthesis.

**Requirements:**
- ~~Breath hold timer with configurable inhale / hold / exhale phases (e.g., 4-7-8 breathing, box breathing).~~
- ~~Guided session flow — auto-advance through a list of poses with configurable hold times per pose.~~
- ~~Audio cues on phase transitions using Web Audio API (same pattern as existing rest timer in `WorkoutPage.jsx`).~~
- ~~Session summary at the end: total duration, poses completed.~~
- Preset sessions: ~~Surya Namaskar (12 poses), Evening Wind-Down, Pre-Workout Activation.~~

**New files:**
- ~~`src/components/pages/YogaTimerPage.jsx`~~ (Implemented as `YogaSessionView` inside `WorkoutPage.jsx`)
- ~~Add route `/yoga-timer` in `App.jsx`~~
- ~~Add nav item under "More" in `src/data/constants.js`~~

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

### 3.9 Iron Forge Elite — Premium Powerlifting Program

**Goal:** Replace the `comingSoon: true` powerlifting split stub with a fully populated **premium 8-week peaking program**, locked behind a ₹1,000 in-app purchase.

**Program name:** `IRON FORGE ELITE` — fits the Iron League theme. Tagline: *"8-Week Strength Peak · Squat · Bench · Deadlift"*.

**Source:** Adapted from the YODDHA 8 Week Male 2 Program (RPE-based peaking block). Methodology: RPE-guided top sets + percentage-based back-off sets (-12.5% to -15%).

---

#### Program Structure (4 Days/Week)

| Day | Weekday | Focus | Main Lifts | Accessories (3×8-12 Progressive Overload) |
|:---:|---------|-------|-----------|------------------------------------------|
| **1** | Monday | Primary Squat + Secondary Bench | Competition Squat, Tempo (3-1-X) Bench + Comp Bench | DB RDL, DB Chest Press, Tricep Extensions, Lateral Raises |
| **2** | Wednesday | Primary Deadlift + Tertiary Bench | Competition Deadlift, Larsen Press / Comp Bench | Leg Press, Lat Pulldown, Single-Arm DB Row, BB Bicep Curl |
| **3** | Friday | Secondary Squat + Primary Bench | Paused Squat / Comp Squat, Competition Bench | DB Bench, Hamstring Curls, Tricep Pushdowns, Lateral Raises |
| **4** | Saturday | Secondary Deadlift | Comp. Deadlift (Paused or Regular) | Leg Extensions, Lat Pulldown, Seated Row, Hammer Curls |

#### 8-Week Intensity Arc (Main Lifts)

| Week | RPE | Phase |
|------|-----|-------|
| 1 | @5–6 | Accumulation |
| 2 | @6–7 | Accumulation |
| 3 | @7 | Intensification |
| 4 | @7–8 | Intensification |
| 5 | @8 | Peak |
| 6 | @8–9 | Peak |
| 7 | @9–9.5 | Competition Prep |
| 8 | @10 | Competition / Max |

Back-off sets: **-12.5% to -15%** of the top set weight for that week.

Weekly RPE notes are stored in each exercise's `notes` field (e.g., `"W1:1x3@5,1x5@5,2x5(-12.5%)|W2:..."`). The existing workout logger already renders `notes` as a guide line — no new input type needed.

---

#### Premium Lock System (₹1,000)

- `splits.js`: Add `premium: true, price: 1000, currency: 'INR'` to the `pl` split entry.
- `AppContext.jsx`: Add `purchasedPrograms[]` state (localStorage) + `purchaseProgram(splitId)` helper.
- `SplitsPage` / split card renderer: Detect `premium: true && !purchasedPrograms.includes(id)` → show locked card overlay (gold shimmer border, lock icon, "₹1,000 · Unlock" CTA).
- `PremiumProgramModal.jsx` **[NEW]**: Opens on locked card tap. Shows program preview, feature list, price, and a simulated UPI payment flow. On "Confirm", calls `purchaseProgram('pl')` and unlocks.

> **Payment note:** No real payment gateway. Simulated flow — UPI QR placeholder → user taps "Confirm" → unlocked in localStorage. Razorpay integration can be added later.

---

#### Open Questions (resolve before implementing)

1. **Program name confirmed?** Going with "IRON FORGE ELITE" or prefer something else?
2. **RPE notes format** — shorthand `W1:1x3@5,1x5@5` vs readable prose `Week 1: 1×3 at RPE 5, then 1×5 at RPE 5, then 2×5 at -12.5%`?
3. **Payment mock acceptable**, or want a Razorpay/UPI deep-link stub?

---

**Requirements:**
- Remove `comingSoon: true` from the `pl` split entry.
- Add `premium: true`, `price: 1000`, `currency: 'INR'` to the `pl` entry.
- Populate all 4 days with full exercise list, sets, repsRange, muscle mappings, and 8-week RPE notes.
- Add `purchasedPrograms` state to `AppContext.jsx`.
- Build `PremiumProgramModal` with gold Iron League styling.
- Update split card UI to show lock overlay for unpurchased premium splits.

**Files to modify / create:**
- `src/data/splits.js` — populate `pl` split, add `premium: true`, remove `comingSoon: true`
- `src/data/premiumPrograms.js` — **[NEW]** premium metadata (name, price, features, badge)
- `src/context/AppContext.jsx` — add `purchasedPrograms[]` + `purchaseProgram()` helper
- `src/components/shared/PremiumProgramModal.jsx` — **[NEW]** paywall modal
- `src/components/pages/SplitsPage.jsx` (or wherever split cards render) — locked overlay UI

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
| 6     | ~~3.7 Yoga Timer~~ | 🟢 Done | High |
| 7     | 3.4 Period Tracker | 🟡 Medium | Medium |
| 8     | 3.5 Festival Adaptations | 🟢 Small | Low |
| 9     | 3.10 Social Sharing | 🔴 Large | Medium |
| 10    | 3.6 PWA / Notifications | 🔴 Large | High |
