# FitTrack Pro — Project State

> Ground truth for the current state of the codebase. Updated manually after each meaningful batch of changes. **Do not copy from design plans or TODO files** — only write what's actually running.

---

## 🛠️ Tech Stack

| Package | Version |
|---------|---------|
| React | 19.2.4 |
| React Router DOM | 7.13.1 |
| Recharts | 3.8.0 |
| Lucide React | 0.577.0 |
| Supabase JS | 2.101.1 |
| Vite | 8.0.0 |
| ESLint | 9.39.4 |

---

## 📂 File Structure

```text
fittrack-pro/
├── State.md                     # This file
├── TODO-redesign-phase-1.md     # Kinetic Elite redesign — Phases 0–8 (completed)
├── TODO-redesign-phase-2.md     # Workout History Page overhaul (completed)
├── TODO-redesign-phase-3.md     # Olympus League Page overhaul (completed + post-ship fixes)
├── TODO-indian-food-db.md       # Indian food DB — schema, categories (Phases 1-4 done)
├── India-extended-food-db.md    # Extended DB v3.1 ingest plans (Injected ~54 QSR/Modern gaps into indianFoods.js)
├── TODO-activity-tracking.md    # Activity tracking roadmap (Phases 1-4 completed using usePedometer & OAuth)
├── TODO-supplement-db.md        # Whey protein & mass gainer brand database (data entry pending)
├── TODO-dietpage-overhaul.md    # DietPage merge with food logging (Phases A–H done)
├── TODO-ux-audit.md             # UX audit across all pages
├── UX-AUDIT-INDEX.md            # Index of per-page UX audit TODOs
├── TODO-UX-01 through 13.md     # Per-page UX audit files
├── TODO-male-anatomy.md
├── TODO-female-anatomy.md
├── TODO-body-wireframe-readiness.md
├── TODO-readiness-plan.md
├── TODO-adaptive-TDEE.md        # Adaptive TDEE Engine — reverse-engineered burn & metabolic adaptation
├── TODO.md
├── vercel.json                  # SPA rewrite rules for Vercel
├── index.html
├── package.json
├── vite.config.js
├── .env                         # VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY
├── .stitch/
│   ├── DESIGN.md                # Stitch-native design system source of truth
│   └── designs/                 # Downloaded Stitch HTML + screenshot references
├── supabase/
│   ├── config.toml              # Supabase project config
│   └── migrations/
│       ├── 20260402091350_init_indian_food_db.sql       # Schema: foods, food_servings, enums
│       ├── 20260402093722_seed_indian_food_batch_1.sql  # Roti, Breads, Grains, Rice, Millets
│       ├── 20260402153716_seed_indian_food_batch_4.sql  # Breakfast, Tiffin, Snacks, Street Food
│       ├── 20260402185051_seed_indian_food_batch_5.sql  # Sweets, Fruits, Drinks + Beverage Builder bases
│       ├── 20260402185908_seed_indian_food_batch_6.sql  # Oils, Condiments, Supplements, Sprouts/Soy
│       ├── 20260406213844_seed_indian_food_batch_7.sql  # Packaged Food, Fasting/Vrat Foods
│       ├── 20260407033900_add_rls_public_read.sql       # RLS policies for public read access
│       ├── 02_cloud_sync.sql                            # Phase Auth-2: workout, health, food, measurements, readiness, splits sync
│       ├── 20260409_add_leaderboard_rls.sql             # Public SELECT policies for leaderboard reads on user_profiles + workout_logs
│       ├── 20260417_body_fat_logs.sql                   # body_fat_logs table + body_fat_goal column on user_profiles + RLS
│       └── 20260501091225_schedule_push_notifications.sql # pg_cron scheduling for Edge Functions
│   └── functions/
│       ├── _shared/
│       │   └── push.ts                             # Shared web-push logic for Edge Functions
│       ├── send-workout-reminder/                   # Scheduled daily workout nudge
│       ├── send-diet-reminder/                      # Scheduled daily macro nudge
│       ├── send-streak-alert/                       # Morning streak motivation
│       └── send-olympus-weekly/                     # Weekly rank summary push
├── scripts/                     # Data population & validation scripts
│   ├── generate_seed.js         # Generates SQL seed from JS food objects
│   ├── validate_foods.cjs       # Schema validation (unique IDs, sane macros, valid categories)
│   ├── add_batch4–7.cjs         # Batch insert scripts for indianFoods.js
│   ├── generate_supplements.cjs # Generates supplement entries
│   ├── insert_supplements.cjs   # Inserts supplements into indianFoods.js
│   ├── insert_whey1.cjs         # Additional whey protein brands
│   └── run_uats.js              # User acceptance test runner
├── public/
│   └── muscles/
│       ├── male/                # 17 PNGs (base + highlight per group)
│       └── female/              # 15 PNGs (2 bases, 6 back, 7 front highlights)
└── src/
    ├── App.jsx                  # Root router + auth gate
    ├── main.jsx
    ├── index.css                # All global tokens, typography, animations
    ├── App.css
    ├── assets/
    ├── components/
    │   ├── layout/
    │   │   └── Layout.jsx       # Sidebar (desktop) + BottomNav (mobile)
    │   ├── pages/               # One file per route
    │   │   ├── AuthModal.jsx
    │   │   ├── DashboardPage.jsx
    │   │   ├── WorkoutPage.jsx
    │   │   ├── SplitsPage.jsx
    │   │   ├── DietPage.jsx            # Full overhaul — food logging merged in, supplements & hydration widgets
    │   │   ├── ProgressPage.jsx        # Display: "Workout Analytics", persistent 1RM calculator, social sharing
    │   │   ├── MuscleMapPage.jsx       # Olympus League — Phase 3 overhaul
    │   │   ├── ProfilePage.jsx
    │   │   ├── WeightLogPage.jsx
    │   │   ├── MeasurementsPage.jsx
    │   │   ├── WorkoutHistoryPage.jsx  # Phase 2 editorial redesign, Cardio logging tab
    │   │   ├── ContactPage.jsx
    │   │   └── CycleTrackerPage.jsx    # Menstrual cycle tracking & advice
    │   └── shared/
    │       ├── SharedComponents.jsx    # All shared UI components
    │       ├── BodyMapSVG.jsx          # Canvas-based anatomical renderer
    │       ├── AvatarInitials.jsx      # Initials avatar circle (Phase 3)
    │       ├── PlayerDetailModal.jsx   # Bottom-sheet muscle modal (Phase 3)
    │       ├── EditWorkoutModal.jsx    # [NEW] Full CRUD editor for history logs (exercises, sets, notes)
    │       ├── ReadinessCheckIn.jsx    # Daily readiness check-in bottom sheet
│       ├── TDEEInsightCard.jsx     # Actionable metabolic insight banner
│       └── TDEEDetailSheet.jsx     # Bottom-sheet for engine transparency (math & logs)
    ├── context/
    │   └── AppContext.jsx        # Global auth + hybrid cloud/local app state, per-user cache, cross-device refresh + sync wrappers
    ├── data/
    │   ├── constants.js          # NAV, NAV_MOBILE_MAIN, NAV_MOBILE_MORE
    │   ├── splits.js             # Default split programs
    │   ├── muscleData.js         # XP calc, rank system, muscle groups
    │   ├── leaderboardData.js    # Static mock leaderboard (7 users + muscleXP)
    │   ├── diets.js              # Macro targets / diet presets
    │   ├── rankBenchmarks.js
    │   ├── sample.js
    │   └── foods/
    │       ├── indianFoods.js    # ~261 food objects (v3.1 schema extended, 350KB+), including Phase 1-5 newly injected QSR/Niche DB
    │       ├── foodCategories.js # 20 category definitions
    │       └── servingTypes.js   # 18 standardized serving types
    ├── hooks/
    │   ├── useLocalStorage.js
    │   ├── useFoodCache.js
    │   ├── usePedometer.js       # Live browser pedometry via DeviceMotion
    │   ├── useScrollRestoration.js # PERSISTENT: saves Y-offset per route key via module Map
    │   ├── useTheme.js
    │   └── useToast.js
    ├── lib/
    │   └── supabaseClient.js     # Supabase client init (URL + anon key from .env)
    └── utils/
        ├── calculations.js       # BMR, TDEE, deficit calculations
        ├── activityUtils.js      # Activity tracking & step goals helpers
        ├── cycleCalculations.js  # Menstrual cycle phase logic
        ├── festivals.js          # Indian holiday detection
        ├── foodUtils.js          # Food search (local + remote), macro calc, beverage builder
        ├── helpers.js            # gId, tod, formatting
        ├── readinessUtils.js     # Readiness scoring (includes steps), muscle recovery, spotlight muscles
        ├── storage.js            # localStorage key constants
        ├── authMigration.js      # Legacy ID migration + first-login cloud upload normalization
        └── adaptiveTDEE.js       # [NEW] Least-squares regression engine for reverse-engineered TDEE
```

---

## 🎨 Design System — "Kinetic Elite"

The app uses the **"Kinetic Elite"** design system, defined in `index.css`. It was fully migrated away from the original `Bebas Neue` / `DM Sans` / `#050506` stack. The canonical Stitch-format design system is at `.stitch/DESIGN.md`.

### Typography
- **Display / Headlines**: `Space Grotesk` (500, 700) — tight tracking (`-0.04em`), used for metrics, page headings, and the app wordmark
- **Body / Labels**: `Be Vietnam Pro` (400, 500, 600, 700) — wide tracking (`0.1em`) on uppercase labels, normal on prose
- CSS utility classes: `.display-lg`, `.headline-lg`, `.headline-md`, `.title-lg`, `.title-md`, `.body-md`, `.label-md`
- `clamp()` scaling on display/headline classes for responsive sizing

### Color Tokens

**Dark theme (default):**

| Token | Value | Role |
|-------|-------|------|
| `--surface` | `#131315` | Page background |
| `--surface-container-lowest` | `#0E0E10` | Recessed wells |
| `--surface-container-low` | `#1A1A1D` | Cards |
| `--surface-container` | `#212124` | Elevated cards |
| `--surface-container-high` | `#2B2B2E` | Hover states |
| `--surface-container-highest` | `#353437` | Chips, ghost fills |
| `--primary` | `#FFB59B` | Ember Peach — accent text, icons, active states |
| `--primary-container` | `#F85F1B` | Burning Ember — CTA fills, gradient end |
| `--signature-gradient` | `135deg, #FFB59B → #F85F1B` | Buttons, branding |
| `--on-surface` | `#EAEAF0` | Primary text |
| `--on-surface-variant` | `#E3BFB3` | Secondary text (warm, not grey) |
| `--on-surface-dim` | `#6E6E76` | Metadata, disabled |
| `--outline-variant` | `rgba(90,65,56,0.15)` | Ghost borders (accessibility only) |
| `--glass-bg` | `rgba(53,52,55,0.60)` | Glassmorphic card fill |
| `--ember-glow` | `0 0 20px rgba(248,95,27,0.2)` | High-intensity glow (BMI ring, selected states) |

**Light theme:** Warm linen palette (`#F5F0EB` base), same ember accent.

### Key Rules
- **No solid 1px borders** — depth comes from tonal background shifts between surface tiers
- **No standard drop shadows** — only `--shadow-ambient` (diffused) or `--glow-primary` (LED emission at 10% opacity)
- **No `Bebas Neue` or `DM Sans`** — zero remaining references in the codebase
- **Animations use only `transform` / `opacity`** — no layout property animation
- **No pure black** — minimum `#131315` (Obsidian Canvas)
- **No cold grey secondary text** — use `--on-surface-variant` (`#E3BFB3`, Warm Bone)

### Animations
- Spring easing tokens: `--ease-spring`, `--ease-smooth`, `--ease-decel`, `--ease-accel`
- `@keyframes cascadeIn` — staggered card/list mount (`.cascade-item`, delays up to `:nth-child(5)`)
- `@keyframes pulse` — perpetual live indicator (used on `PulseIndicator` component)
- `@keyframes restTimerPulse` — low-time warning pulse on the rest timer ring stroke
- `@keyframes shimmer` — skeleton loading gradient sweep
- `@keyframes pgIn / pgOut` — page entry/exit transitions

---

## ✨ Shared Components (`SharedComponents.jsx`)

All exported from `src/components/shared/SharedComponents.jsx`:

| Component | What it does |
|-----------|-------------|
| `PulseIndicator` | Animated 8px dot with `pulse` keyframe + LED glow. Used on live session and dashboard suggestion banners. |
| `GlassTooltip` | Glassmorphic Recharts tooltip. Used across all charts. |
| `ProgressOrb` | SVG arc ring with ember peach gradient fill. Animated via `stroke-dashoffset`. Currently used in Dashboard goal progress card. |
| `StatCard` | Standard metric card with icon, display-lg value, trend arrow, and optional badge. |
| `ThemeTogglePill` | Sliding day/night knob toggle. Rendered in `PageHeader` and Dashboard header. |
| `PageHeader` | Title + ember gradient underline + `ThemeTogglePill` + optional action slot. |
| `ScrollPicker` | Snap-scroll wheel for number/weight selection. Used in Log Weight and Set Goal modals. |
| `ToastContainer` | Fixed top-right toast stack with glassmorphic backdrop. |
| `ConfirmDialog` | Glassmorphic modal with confirm/cancel. |
| `Skeleton` / `SkeletonCard` | Shimmer skeleton using the `shimmer` keyframe. |
| `EmptyState` | LED-glow icon container + headline + optional CTA button. |
| `Portal` | `createPortal` wrapper for z-index escape (modals, floating pill). |
| `EditWorkoutModal` | Full-screen bottom sheet with CRUD support for existing workout logs. Allows adding/removing exercises (from split or custom), managing set volume, updating date/duration, and notes. Uses atomic `updateWorkoutLog` in AppContext for cloud synchronization. Features a smart conditional-rendering architecture for the Add Exercise sub-panel to prevent z-index bleed and event-bubbling bugs. |
| `TDEEInsightCard` | Premium banner surfaced on DietPage when actual metabolism diverges from static estimates. Includes "Update targets" action and "Learn more" trigger. |
| `TDEEDetailSheet` | Transparency modal revealing the math behind the Adaptive TDEE estimate (logged days, weight delta, implied deficit, confidence score). |


Additional shared components in separate files:

| Component | File | What it does |
|-----------|------|-------------|
| `AvatarInitials` | `AvatarInitials.jsx` | Circular initials avatar with rank-colored ring border. Used in Olympus League leaderboard and player modal. |
| `PlayerDetailModal` | `PlayerDetailModal.jsx` | Bottom-sheet slide-up modal showing player's BodyMapSVG, overall rank, progress bar to next tier, and per-muscle XP breakdown. |
| `ReadinessCheckIn` | `ReadinessCheckIn.jsx` | Bottom-sheet with 4-step questionnaire (sleep, energy, soreness, stress). Auto-computes a 0–100 readiness score blending subjective answers (60%) with objective training load (40%). Saves via `logReadiness()` into AppContext, syncs to `readiness_logs`, and survives refresh through per-user cache + cloud rehydration. Score reveal animation on completion, auto-closes after 2.2s. |

---

## 📑 Pages

### `/` — Dashboard
Rebuilt around the Kinetic Elite aesthetic. Key sections:
- **Welcome header**: editorial-style headline in Space Grotesk with ember text-gradient on the first name. Greeting is now user-aware: first-time accounts see `"WELCOME, [NAME]"` once, then subsequent visits show `"WELCOME BACK, [NAME]"`. Theme toggle pill lives here. Includes a dynamic cycle-phase badge for female athletes and celebratory banners on Indian holidays / festivals.
- **Daily Readiness widget**: Anatomical wireframe figure (3/4 perspective PNG) with per-muscle recovery status chips (optimal/fatigued/critical). Tapping opens the `ReadinessCheckIn` bottom sheet only if no completed check-in exists for today. Dashboard waits for `dataLoaded` before deciding whether to re-open the questionnaire, preventing false re-prompts during auth/cloud rehydration. Readiness card uses the saved subjective score when present and falls back to the objective training-only score otherwise.
- **Weight Analysis + Metabolic Index**: 2-col glass card row. Weight card shows current / previous log with a goal-aware trend arrow. Metabolic Index card is a dual-stat view showing BMI (left) and Adaptive TDEE (right). The TDEE side displays the estimate, confidence score, and a pulsing red dot if metabolic adaptation (T3) is detected.
- **Sessions / Streak**: 2-col layout converted into a 4-item responsive grid (`var(--surface-container-lowest)` tiles). Displays current-week session count, all-time total, and current/longest streak with a Zap icon for active streaks.
- **Placeholder activity cards**: Steps, Calories Burned — show `—` with a `PulseIndicator + "Coming Soon"` label. Water intake is wired to the global hydration tracker.
- **Goal progress**: Glass card with `ProgressOrb`, target/remaining/weeks-left breakdown. Opens a `ScrollPicker` modal.
- **Weight Trend chart**: `AreaChart` (Recharts) with `GlassTooltip` and an optional goal reference line.
- **Body Composition card**: 3-column grid showing current BF% with ACE category badge + delta vs previous reading, a mini trend `AreaChart` with optional goal reference line, and goal progress bar. Uses `getBFCategory()` for gender-aware classification. When no BF% data exists, shows an empty state CTA linking to Profile. Chart threshold is 1+ entries; dots always visible.
- **BF% badge on Metabolic Index card**: Subtle chip below BMI ranges showing latest BF% and category, using theme-native `surface-container-lowest` background.
- **Live Suggestion banner**: Grayscale gym image with gradient overlay, `PulseIndicator`, active split name and schedule chips, "Start Workout" CTA.
- **Olympus League widget**: `MiniBodyMap` + rank badge + weekly muscle group count. Links to `/muscle-map`.

### `/workout` — Workout Tracker
Three states: **day picker → active session → post-session summary**.

**Day picker**: Cards with left accent stripe, last-session date, exercise preview, "Start Session →" CTA.

**Active session**:
- Session header with `PulseIndicator` + session name + rest-length selector
- **RestTimer**: vertical stacked layout — large `220px` SVG ring with `mm:ss` Space Grotesk countdown (`clamp(3.5rem, 10vw, 4rem)`), ambient blob background, horizontal `+30s` ghost pill and `Skip` ember pill buttons.
- Exercise blocks: `1.5rem / -0.04em` header, `.label-md` muscle/focusType subline, info icon button
- Set grid: `.set-row` layout (`34px 1fr 1fr 44px`), each row is a `surface-container-low` card that lifts to `surface-container` on hover. Completed rows dim to 0.7 opacity. Bottom-bar focus styling on inputs.
- `.add-set-btn`: full-width dashed ghost button below each set list
- Session notes: glassmorphic card with resizable textarea
- Finish/Discard: "FINISH WORKOUT" ember gradient full-width button + "DISCARD WORKOUT" error-coloured text-only button beneath
- **Floating live pill**: fixed bottom-right Portal — glass pill with animated pulse dot + "Live tracking" label

**Session data model**: Each session stores `startTime: Date.now()` on start. On finish, the log records `durationMinutes` (rounded to nearest minute) plus `muscle`, `primaryMuscle`, and `secondaryMuscles` on every exercise (enabling reliable XP calculation independent of split lookup).

**Scroll Persistence**: `WorkoutPage` uses a module-level `workoutPageCache` to track the scroll position of the tracker list before a session starts. This ensures that when a session is finished, discarded, or yoga is completed, the page restores the user's exact scroll position in the split list rather than jumping to the top. Programmatic scrolls use `behavior: 'instant'` to bypass global CSS smooth scrolling.

**Post-session summary**: XP / Sets / Volume row + `BodyMapSVG` mini-map of muscles trained. "Log Another" + "View Map →" actions.

**Yoga Sessions**: Selecting a `type: 'yoga'` day renders the inline `YogaSessionView` — a full-screen guided mobility player with `playBeep` audio sequencing and Box Breathing integration. These do not create tracked workout logs.

### `/splits` — Split Management
View and manage training split programs. Accessible from the primary mobile bottom nav.

### `/diet` — Diet & Nutrition (Overhauled)

Fully rebuilt. Merges the original diet guide/meal plan content with the Indian Food Database food logging system. Uses `useFoodCache()` for one-time Supabase fetch + local fallback, and survives refresh through a hybrid `food_logs` cloud model plus per-user local cache in AppContext. Architecture:

```
┌─────────────────────────────────┐
│  PageHeader (Diet & Nutrition)  │
│  Compact Stats Strip (5 chips)  │  ← Weight, Height, BMI, TDEE, Activity
│  Goal / Setup Card              │  ← Macro rings OR "Targets Locked" CTA
│  [Daily Tracker] [Meal Guide]   │
│  [Analysis]                     │  ← 3-tab switcher
├─────────────────────────────────┤
│  TAB: Daily Tracker (default)   │
│    Date navigation (< Today >)  │
│    Hydration Tracker Widget     │  ← Dynamic glass-fill progress bar
│    Supplements Daily Stack      │  ← Click-to-complete pills
│    6 Meal Slot Cards            │
│    Protein Nudge Alert          │
│    Food Log Streak badge        │
│    Per-slot food list + edit    │
├─────────────────────────────────┤
│  TAB: Meal Guide                │
│    Blueprint Header Card        │
│    Whey Card + Diet Selector    │
│    Meal Plan Cards grid         │
│    Protein Sources Footer       │
│    Complete Protein Tip         │
├─────────────────────────────────┤
│  TAB: Analysis                  │
│    B12 / D3 / Iron alerts       │
│    Weekly macro adherence chart │
└─────────────────────────────────┘
```

**Stats strip**: 5 compact pill chips showing Weight, Height, BMI, TDEE, Activity. Label in `--on-surface-variant` @ 10px, value in `--primary` @ 13px bold. Replaced the old full-width material icon cards.

**Goal card**:
- **Configured profile**: SVG ring gauges for Kcal, Protein, Carbs, Fat — showing consumed vs target. Rings use `stroke-dasharray`/`stroke-dashoffset`. Summary row above rings shows daily targets (`🔥 2100 kcal · 💪 160g P · 🌾 210g C · ☎️ 58g F`). All values are computed dynamically using the TDEE priority chain (`Manual > Accepted Adaptive > Static fallback`).
- **TDEE Insights**: An `AdaptiveDietBanner` or `TDEEInsightCard` appears above the goal card to nudge users toward calculated adjustments or inform them of metabolic changes.
- **Incomplete profile**: The card switches to a `"Targets Locked"` setup state with a CTA to update the profile when age, height, weight, or target weight is missing. Includes a "Learning your metabolism" nudge if logs are < 10 days.

**Tab switcher**: `[🍽 Daily Tracker]`, `[📋 Meal Guide]`, `[📊 Analysis]`. Pill-style with ember gradient on active tab.

**Daily Tracker tab**:
- Date navigation (prev / "Today" / next), date-aware log filtering
- 6 meal slot cards: Breakfast, Mid-Morning, Lunch, Pre-Workout, Post-Workout Dinner, Before Bed
- Each slot shows: icon, name, suggested kcal range, tracked total, circular `+` button
- Expanding a slot reveals logged food entries (name, P/C/F chips, kcal, edit/delete actions)
- "Copy yesterday" ghost button for quick re-logging
- Protein nudge alert: fires when `consumed protein < target - 30g` and it's past 6pm
- Food log streak badge showing consecutive logging days
- Hydration widget persists independently via `fittrack_waterLog`
- Supplement daily stack persists independently via `fittrack_supplementLog`
- Food entries persist through optimistic in-memory state, per-user local cache `fittrack_foodLog_<supabase-user-id>`, cloud sync to `food_logs`, and refresh rehydration that merges cloud rows with richer cached local entry shape when needed

**Meal Guide tab**: Preserved all original diet page logic — BMR/TDEE/deficit calculations, goal detection from weight vs weightGoal, protein multiplier, carb/fat splits, whey scoop recommendation card, diet type selector (`veg`, `vegan`, `jain`, `egg`, `nonveg`), per-meal macro breakdown cards, protein sources footer.

**Analysis tab**:
- Weekly macro adherence stacked bar chart (Protein / Carbs / Fat)
- Weekly micronutrient rollups for B12, Vitamin D, and Iron
- Conditional deficiency alerts:
  - Low B12 for veg / vegan / jain diets
  - Low Vitamin D3
  - Low Iron for female users

**Food Search Modal** (bottom sheet, opens from a meal slot `+` button and related quick-log entry points):
- Search bar with fuzzy matching on `name`, `nameAlt`, `searchTerms`, `brand`, `productLine`
- Diet type filter chips: All / Veg / Vegan / Jain / Egg / Non-Veg
- Fasting/Vrat filter chips: None · Navratri · Ekadashi · Ramzan · Jain Paryushana · Maha Shivratri
- Category pills (20 categories from `foodCategories.js`)
- "Recent" section at top (last 10 unique foods logged)
- Favorites section (starred foods, quick re-add)
- Results list with badges (Root Veg, Customisable, Fasting-safe)
- Custom Food quick-add form (name + calories + macros)

**Scroll Persistence**: `DietPage` uses a module-level `dietTabCache` to store the scroll position of the tracker when the search modal opens. Closing search (via cancel or log) restores the scroll position instantly using the `dietTabCache.trackerScroll` offset.

**Food Detail Pane** (inside modal, when a food is selected):
- Food name + category badge
- Serving picker chips (horizontal scroll, includes delivery sizes with info chip: "📦 Delivery estimate")
- Custom grams input field
- Consistency toggle for dishes with `supportedConsistencyTypes` (Watery / Normal / Thick)
- Quantity multiplier (0.5, 1, 1.5, 2, 2.5, 3)
- Beverage Builder for `hasBeverageModifiers: true` foods (chai, coffee, haldi-doodh): milk modifier radio + sweetener chips with live calorie preview
- "🫙 Add cooking oil?" chip for dish-type foods
- Macro preview card (Cal / P / C / F) — live-updating
- "Add to [Meal Slot]" CTA
- Favorite ★ toggle

**Mobile keyboard fixes (Phase H)**: Modal uses `90dvh` (not `vh`) to account for virtual keyboard. `position: fixed` body lock on modal open with scroll position save/restore. Removed `autoFocus` on search input — replaced with 350ms delayed programmatic focus. Save bar uses `position: sticky` (not `fixed`) to avoid scroll traps. `touch-action: pan-y` and `-webkit-overflow-scrolling: touch` on all scroll containers.

### `/progress` — Workout Analytics
Display title: **"Workout Analytics"** (file still `ProgressPage.jsx`). Recharts-powered per-exercise performance charts. Layout:

1. **Filter controls** — Split / Day / Exercise cascading dropdowns (3-col grid, Kinetic Elite styled). Include a persistent **1RM Calculator** on top mapping history vs custom parameters.
2. **Weekly context strip** — inline stats: sessions this week, volume, % change vs prior week, monthly sessions, avg/week
3. **Hero exercise title** — asymmetric editorial two-line UPPERCASE display (`clamp(2.5rem, 8vw, 4.5rem)`) when exercise is selected
4. **Bento stat grid** — 3 cards: Est. 1RM (accent, left-border exception), Personal Record, Total Sessions — with `cascade-item` stagger
5. **Volume Trend chart** — full-width hero `AreaChart` with gradient fill, glassmorphic tooltip, time-range pills `[1M] [3M] [6M]` (visual only)
6. **5-col layout**: Left (Personal Best glow card with **html2canvas social sharing** + Focus Groups card) · Right (Recent Sessions log, last 5)
7. **Secondary charts** — 2-chart grid: Est. 1RM trend (Area) + Avg Reps/Set (Line), 160px height, glassmorphic tooltips

Each `cd` entry shape: `{ date, rawDate, dayName, maxWeight, volume, avgReps, sets, est1rm }`.

### `/muscle-map` — Olympus League
**Phase 3 overhaul complete.** `MuscleMapPage.jsx` is now a 3-tab leaderboard + stats page.

#### Architecture
- **3-tab switcher**: Global → Friends → My Stats (pill-style with ember gradient active state)
- **State**: `activeTab`, `selectedPlayer`, `filter` (muscle region filter, preserved from pre-Phase 3), `muscleFilter` (leaderboard column filter), `filterOpen`

#### Tab 1: Global (Leaderboard)
- **Achievement banner** (above tabs, always visible on Global): "IRON LEAGUE STANDING" label → "You are in the top X%" hero text → XP-to-next-tier sub-label. Ember Sparkles icon in gradient circle.
- **Podium**: 3-column layout — 2nd (left), 1st (center/elevated with Trophy icon), 3rd (right). Rank number displayed inside circle (not initials). Medal colors: #1 = `var(--primary)`, #2 = `#C0C0C0`, #3 = `#CD7F32`. Clicking any podium slot opens `PlayerDetailModal`.
- **Column headers**: "RANK & ATHLETE" | "All Muscles ▾" (filter pill) | "TOTAL XP"
- **Muscle filter dropdown**: Custom glass floating panel; sorts `filteredLeaderboard` by `player.muscleXP[selectedMuscle]` when active
- **Ranked list**: All ranked players (glassmorphic rows, left ember border on "You" row, MVP badge). Clicking opens `PlayerDetailModal`.

#### Tab 2: Friends
`EmptyState` — "Friends Coming Soon" (no real social graph).

#### Tab 3: My Stats
All existing muscle map content in a single scroll:
- Overall Rank card (`BodyMapSVG` + rank display)
- Rank legend tier badges
- Muscle region filter pills (all / upper / lower / core)
- `MuscleCard` list — filtered + sorted by XP
- Monthly Rank Hero card (overall.name + progress bar)
- Per-Muscle League Table (grid rows)
- Percentile benchmarks + monthly rank history timeline

#### Player Detail Modal (`PlayerDetailModal.jsx`)
- Bottom-sheet slide-up (`translateY(100%)` → `translateY(0)`, 350ms cubic-bezier)
- Drag handle pill at top; backdrop click closes; scroll lock on `body`
- `AvatarInitials` + tier badge + X close button header
- `BodyMapSVG` centered (parent `maxWidth: 200` → ~400px tall)
- Overall rank block: rank name, total XP, progress bar (`progress × 100` for CSS width — bug fix applied)
- Per-muscle breakdown: sorted by XP desc, each row shows label, rank badge, XP, mini progress bar. Background uses `var(--surface-container-highest)` (theme-aware — light theme bug fix applied)
- Close ghost button at bottom

#### Leaderboard Data
`src/data/leaderboardData.js` — 7 static mock users: `marcus_k` (Gold III, 24.2K XP) → `zen_squat` (Silver I, 10.1K XP). Each has `id`, `name`, `tier`, `totalXP`, `initials`, `color`, `muscleXP` per-muscle breakdown. Real user merged in at runtime, sorted, ranked.

**Anatomy asset status:**
- 🟢 **Male** — 17 PNGs, rendering in production
- 🟢 **Female** — 15 PNGs in `public/muscles/female/`, rendering in production
- 🟢 **Fallback** — Canvas renders a styled placeholder if any image fails to load

`BodyMapSVG` renders via HTML5 Canvas pixel compositing — coral-red highlights over teal-blue base, with alpha-blended secondary muscle dimming.

### `/history` — Workout History
**Phase 2 editorial redesign complete.** `WorkoutHistoryPage.jsx` now renders a top-level tab switcher to toggle between **Weights** and **Cardio** logging. Let users manually enter discrete cardio sessions (e.g. Activity Type, Minutes, Distance, Calories Burned). Gives a rich view into session-specific exercises with ghost watermarks and dynamic volume stats.

**Workout Editing**: Added "Edit Session" capability to every weight log entry. Tapping "Edit" opens `EditWorkoutModal`, enabling full CRUD for the session. Changes are saved optimistically via `updateWorkoutLog` in AppContext and synced to Supabase.

**Scroll Persistence**: Integrated `useScrollRestoration('/history')` to save and restore the list position when navigating to and from the History page.

### `/cycle` — Cycle Syncing (Period Tracker)
Female-focused view computing whether the athlete is in menstruation, follicular, ovulation, or luteal phase. Provides contextualized training cues (e.g., dial back heavy lifts in luteal). Syncs to contextual Dashboard profile badge.

### `/profile` — Profile
User settings, unit preferences (kg/lbs and cm/ft), theme toggle, personal info, avatar selection/upload, export/import, streak/achievement summaries, and metabolic cards (BMI / BMR / TDEE). `activityLevel` UI is mapped back to the `activity` column in `user_profiles`.

**Metabolism & Targets section**: Dedicated glass card for Managing TDEE.
- **Adaptive TDEE toggle**: Allows turning the auto-applied engine ON/OFF.
- **Manual Override**: `ScrollPicker` button to force a specific TDEE baseline (locks at Priority 1 in the cascade).
- Lists currently active TDEE source (Manual / Estimated / Static).

**Body Composition section** (added 2026-04-17): Glass card before Muscle Mastery showing latest BF%, ACE category badge, measurement method, target BF% (set via themed modal), and recent log history (last 4 entries with ▼/▲ deltas). "+ Log BF%" button opens a modal with date input, BF% number input with live category preview, 6-method pill selector (InBody, DEXA, Smart Scale, Calipers, Navy Method, Visual), embedded Navy Method calculator (waist/neck/hips/height inputs with auto-fill), and optional notes field. Data persists via `setBodyFatLogSync` (Supabase + localStorage write-through cache). CSV export includes `bodyFatLog`.

### `/weight-log` — Weight Log
Dedicated view for body weight history entries.

### `/measurements` — Measurements
Body dimension tracking.

### `/contact` — Contact
Feedback / support form.

---

## 🗺️ Layout & Navigation

- **Desktop**: collapsible `Sidebar` (230px expanded, 54px icon-only). No right border — tonal background separation only. `headline-md` "FITTRACK" wordmark in Space Grotesk. Active nav items use `--glow-primary` and `--primary-container` colour.
- **Mobile**: fixed `BottomNav` — glassmorphic fill, no top border. "More" sheet opens a second-level glassmorphic card with secondary routes.
- **Auth gate**: `AuthModal` blocks all routes until Supabase auth + profile hydration finishes.
- **AuthModal modes**: `login`, `register`, `verify`, `forgot-sent`.
- **Providers**: Email/password, Google OAuth, and a hardcoded demo sign-in (`demo@fittrackpro.in`).
- **Registration flow**: Inserts `user_profiles` immediately after `signUp`, captures age/height/weight/activity/workout_days, and marks `fittrack_onboarding_pending:<userId>` so the first dashboard visit uses the new-user greeting.
- **Forgot password**: `resetPasswordForEmail()` is wired to `${window.location.origin}/reset-password`, but no in-app reset-password route is currently mounted in `App.jsx`.

---

## 🍛 Indian Food Database

### Data Layer

**Dual storage**: The food database exists in two places simultaneously:
1. **Local JS** — `src/data/foods/indianFoods.js` (~207 entries, 314KB). Used as the guaranteed fallback runtime data source via `searchLocalFoods()`.
2. **Supabase (cloud)** — Full Postgres database with `foods` and `food_servings` tables. Populated via 7 migration files. Queryable via `searchRemoteFoods()` / `fetchAllFoods()` in `foodUtils.js`.

The current runtime path is hybrid: `useFoodCache()` first attempts a one-time full Supabase fetch, then falls back to local `indianFoods.js` if that fetch fails or returns empty. All actual Diet search/filter UI runs synchronously against the cached in-memory array.

**Supabase schema** (`20260402091350_init_indian_food_db.sql`):
- `foods` table — stores all food entries with snake_case columns mapping to the v2.3 schema
- `food_servings` table — per-food serving options (FK to `foods.id`)
- RLS policies — public read access enabled (`20260407033900_add_rls_public_read.sql`)
- Client at `src/lib/supabaseClient.js`, credentials via `.env` (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`)
- `@supabase/supabase-js` v2.101.1 in dependencies

### Schema (v2.3)

Each food object follows this shape:

```js
{
  id, name, nameAlt, hindiName, searchTerms,
  category,          // one of 20 category IDs
  subcategory, itemType, state, region,
  defaultServingGrams,
  per100g: { calories, protein, carbs, fat, fiber, sodium, vitaminB12, vitaminD, iron, calcium },
  servings: [{ id, label, grams }],
  dietTypes,         // subset of ['vegan','veg','jain','egg','nonveg']
  tags,
  isProcessed, isFastingFood, fastingTypes, isGlutenFree, isRecipe,
  containsRootVeg,   // for Jain filter
  hasBeverageModifiers,
  supportedConsistencyTypes, consistencyMultipliers,
  gi, cookingOilNote, estimatedOilG,
  source, confidence, notes
}
```

### Categories (20)

`grain-cereal`, `roti-bread`, `rice-dish`, `dal-legume`, `sabzi-veg`, `non-veg`, `egg`, `dairy`, `breakfast`, `snack-street`, `sweet-mithai`, `fruit`, `drink`, `oil-fat`, `condiment`, `supplement`, `packaged-food`, `millet`, `sprout-soy`, `fasting-food`

### Serving Library (18 types)

`roti`, `paratha`, `katori`, `bowl`, `plate`, `piece`, `glass`, `cup`, `tbsp`, `scoop`, `slice`, `g100`, `custom`, `handful`, `medium`, `egg`, `takeaway-container`, `restaurant-portion`, `thali`

Delivery-sized servings (`takeaway-container` 480g, `restaurant-portion` 600g, `thali` 900g) trigger an info chip in the food logger.

### Food Utils (`src/utils/foodUtils.js`)

| Function | What it does |
|----------|-------------|
| `calcMacros(food, servingId, qty, consistency, customGrams)` | Computes macros for a given food × serving × quantity, with optional consistency multiplier |
| `calcBeverageMacros(baseFood, milk, sweeteners)` | Handles chai/coffee/haldi-doodh with milk modifier + sweetener add-ons |
| `searchLocalFoods(foodsList, query, { dietType, fastingType })` | Fuzzy search across name, nameAlt, searchTerms, hindiName, brand, productLine. Auto-filters `containsRootVeg` for Jain users |
| `searchRemoteFoods(query, { dietType, fastingType })` | Supabase query with snake_case ↔ camelCase mapping. Joins `food_servings`. Limit 50 |
| `getRecentFoods(foodLog, n)` | Last N unique foods from the user's log |
| `getFavoriteFoods(foodsList, favoriteIds)` | Returns foods matching the user's starred IDs |

### Supplement Data (Phase 5 — Planned, Not Yet in DB)

`TODO-supplement-db.md` documents 26 whey protein products and 10 mass gainer products with exact per-scoop label data. These cover major Indian brands (MuscleBlaze, AS-IT-IS, The Whole Truth, NAKPRO, AVVATAR, TrueBasics, Nutrabay, Amul, Naturaltein, Protyze, Tata 1mg) and imports (ON, MyProtein, Dymatize, MuscleTech, Bigmuscles, GNC, Kevin Levrone). The current `indianFoods.js` has 7 generic supplement entries; the brand-specific entries have not been added yet.

Schema extensions for supplements include: `brand`, `productLine`, `scoopWeightG`, `proteinType`, `bcaaG`, `eaaG`, `certifications`, `priceINR`, `originCountry`. These fields exist in the plan but are not yet present on the generic entries in the codebase.

---

## 💪 Daily Readiness System

Located in `src/utils/readinessUtils.js` and `src/components/shared/ReadinessCheckIn.jsx`.

### Objective Readiness (`calcObjectiveReadiness`)
Pure training-data-based score (0–100). Considers 7-day rolling volume average, last 3-day load ratio, rest gap bonus, and overtraining penalty (6+ sessions/week).

### Subjective Check-In (`ReadinessCheckIn`)
4-step bottom-sheet questionnaire: sleep hours, energy level, soreness, stress. Each answer is mapped to a 0–100 sub-score with weighted blending (sleep 35%, energy 30%, soreness 20%, stress 15%).

For storage/sync:
- UI keeps soreness as `'none' | 'mild' | 'significant'`
- UI keeps stress as `'low' | 'medium' | 'high'`
- AppContext maps those to integer DB values for `readiness_logs` and back on rehydration

### Final Score
40% objective (training history) + 60% subjective (check-in). Stored in `readinessLog` via AppContext with shape `{ userId, date, sleepHours, energyLevel, sorenessLevel, stressLevel, score, objectiveScore, checkInComplete }`.

Refresh persistence:
- cached locally per authenticated user in `fittrack_readinessLog_<supabase-user-id>`
- synced to Supabase `readiness_logs`
- dashboard rehydrates the saved score before deciding whether to reopen the questionnaire

### Muscle Recovery Statuses (`getMuscleRecoveryStatuses`)
Returns per-muscle recovery state (optimal / fatigued / critical) based on hours since last training. Uses the same 3-priority fallback chain as Olympus League XP (split lookup → log exercise fields → display name parsing).

### Tiers
| Score | Label | Color | Guidance |
|-------|-------|-------|----------|
| 80+ | Optimal | `#4ADE80` | Go heavy. This is your window. |
| 60–79 | Good | `#FBBF24` | Solid session. Moderate intensity. |
| 40–59 | Moderate | `#F85F1B` | Light session or active recovery. |
| 0–39 | Low | `#F87171` | Rest day. Your body is building. |

---

## 🔄 AppContext State

Hybrid state in `AppContext.jsx`. Identity and core fitness data are cloud-synched to **Supabase**, while some preferences and refresh-resilience caches remain in `localStorage`.

### Helper Utilities (module-level, not exported)

| Function | Purpose |
|----------|--------|
| `readPersistedUserArray(prefix, userId)` | Safely reads a per-user array from localStorage, returns `[]` on missing / corrupt data |
| `normalizeNumber(value)` | Coerces a value to a finite `Number` or `null`; guards against `''`, `undefined`, `NaN` before Supabase upserts |
| `readCachedProfile(userId)` | Reads the last-known profile object from `fittrack_profile_<userId>` |
| `persistCachedProfile(profile)` | Writes a profile snapshot to `fittrack_profile_<userId>`; ignores quota/private-mode errors |
| `buildFallbackProfile(sessionUser, cachedProfile)` | Constructs a minimal usable profile from the Supabase session + cached field so the app never blocks on a live DB fetch |
| `getEntryTime(entry)` | Returns a comparable timestamp for a food/readiness entry using `updated_at` → `created_at` → `timestamp` → `date` fallback chain |
| `mergeFoodEntries(cloudEntries, localEntries, userId)` | Merges cloud and local food log arrays by `id`, appending any local-only items and sorting by entry time |
| `mergeReadinessEntries(cloudEntries, localEntries, userId)` | Deduplicates readiness entries by `userId:date` key, preferring completed/newer entries |
| `pickPreferredReadinessEntry(existing, next)` | Tie-breaks two same-day readiness entries: prioritises `checkInComplete`, then newer timestamp |
| `mapFoodLogFromCloud(item, cachedItem)` | Normalises a raw `food_logs` DB row into the full Diet entry shape, merging with optional cached item for micro-fields (`iron`, `vitaminB12`, `vitaminD`) |
| `mapReadinessFromCloud(item, cachedItem)` | Normalises a raw `readiness_logs` DB row back to UI enums (`soreness` 0-2 → `'none'/'mild'/'significant'`, same for stress) |
| `READINESS_SORENESS_TO_DB / FROM_DB` | Bidirectional maps `none/mild/significant` ↔ `0/1/2` |
| `READINESS_STRESS_TO_DB / FROM_DB` | Bidirectional maps `low/medium/high` ↔ `0/1/2` |
| `getAvatarInitials(value)` | Returns 1–2 uppercase initials from a display name string |

### Auth / Boot Flow
- `supabase.auth.onAuthStateChange()` is the single auth source of truth — fires for every session event
- Boot sequence runs `handleSessionBootstrap` which is called by both `onAuthStateChange` and the initial `getSession()` check (deduplicated via `initialized` flag)
- `initialized` is set **synchronously** at the top of `handleSessionBootstrap` before any async work, so the 3-second safety timeout cannot interfere after a valid session has started bootstrapping
- When a session exists, `authLoading` is cleared immediately using `buildFallbackProfile` + the `fittrack_profile_<userId>` cache — the live `user_profiles` fetch runs **in the background** and updates profile/session state when done, without blocking the app
- When no session exists, all cloud state is cleared and both `authLoading` and `dataLoaded` are set to `false`
- `dataLoaded` is set to `true` only once `loadCloudData` completes; the Dashboard readiness auto-open guard waits on this flag to avoid a false empty-state prompt during cloud rehydration
- on login:
  1. `handleSessionBootstrap` seeds fallback profile + clears `authLoading`
  2. `fetchProfile` fetches/creates live `user_profiles` row, writes to cache
  3. `uploadLocalDataToCloud` migrates any legacy local data (email-gated)
  4. `loadCloudData` fetches all tables in parallel and merges into React state, setting `dataLoaded = true`
- on logout:
  - `logout()` immediately clears `profile`, `session`, and `dataLoaded` so the UI snaps to login without waiting for the `SIGNED_OUT` event
  - `onAuthStateChange(SIGNED_OUT)` then fires and clears remaining cloud state
- on account switch:
  - A `useEffect` on `session.user.id` detects the ID change and zeroes all in-memory fitness logs
  - Clears per-user food/readiness/bodyFat localStorage keys for the previous `userId`
  - Resets all auxiliary local-only logs (`waterLog`, `cardioLog`, `supplementLog`, `bodyFatLog`, etc.)

### Data State

| Data Domain | Storage | Persistence Key / Table |
|-------------|---------|-------------------------|
| **Identity** | Supabase Auth | `auth.users` / `user_profiles` |
| **Workouts** | Supabase DB | `workout_logs` |
| **Health Logs** | Supabase DB | `health_logs` |
| **Measurements** | Supabase DB | `measurements` |
| **Food Logs** | Supabase DB + per-user write-through cache | `food_logs` + `fittrack_foodLog_<userId>` (90-day TTL prune on every write) |
| **Splits** | Supabase DB | `user_splits` |
| **Readiness** | Supabase DB + per-user write-through cache | `readiness_logs` + `fittrack_readinessLog_<userId>` (90-day TTL prune on every write) |
| **Profile cache** | localStorage | `fittrack_profile_<userId>` |
| **Last user** | localStorage | `fittrack_last_user_id` |
| **Favorites** | localStorage | `fittrack_favoriteFoods` |
| **Water Log** | localStorage | `fittrack_waterLog` |
| **Cardio Log** | localStorage | `fittrack_cardioLog` |
| **Supplements** | localStorage | `fittrack_supplementLog` |
| **Supplement Config** | localStorage | `fittrack_supplementConfig` |
| **Cycle Config**| localStorage | `fp_cycle_config` |
| **Body Fat Logs** | Supabase DB + per-user write-through cache | `body_fat_logs` + `fittrack_bodyFatLog_<userId>` |
| **Body Fat Goal** | Supabase DB (user_profiles) | `body_fat_goal` column on `user_profiles` |
| **Adaptive TDEE** | localStorage (per-user) | `fittrack_tdeeEstimate_<userId>` |
| **TDEE Preferences** | localStorage (per-user) | `fittrack_tdeePreferences_<userId>` |
| **Active Rest Timer** | localStorage | `fittrack_activeRestTimer` |
| **Active Rest Timer Pos** | localStorage | `fittrack_activeRestTimerPos` |


### Live Refs
- `foodLogRef` — always mirrors current `foodLog` state; used by `loadCloudData` to merge against live data rather than a stale closure snapshot
- `readinessLogRef` — same pattern for `readinessLog`
- `currentUserIdRef` — mirrors `session.user.id || profile.id || localStorage fittrack_last_user_id`; read inside `createSyncSetter`'s `setTimeout` to avoid stale closure userId
- `isFetchingProfile` — ref-based mutex preventing concurrent `fetchProfile` calls
- `cloudRefreshTimerRef` — debounce handle (250 ms) for `scheduleCloudRefresh` to coalesce rapid realtime events
- `tdeeRecomputeTimerRef` — 2-second debounce handle for `adaptiveTDEE` logic re-runs on diet/health changes.


### Cloud Sync & Realtime
- **`scheduleCloudRefresh(userId)`**: 250ms debounced wrapper around `loadCloudData` so multiple rapid realtime events collapse into a single re-fetch
- **Supabase realtime**: subscribes channel `fittrack-sync-<userId>` to `postgres_changes` for `food_logs` and `readiness_logs` scoped by `user_id=eq.<userId>`. Any insert/update/delete triggers `scheduleCloudRefresh`.
- **Browser lifecycle**: `focus`, `online`, `pageshow`, and `visibilitychange` all trigger `scheduleCloudRefresh` when the tab is visible
- **15-second polling**: `setInterval` calls `scheduleCloudRefresh` every 15 s whenever the tab is visible — catches browsers that miss the realtime push
- All listeners and the realtime channel are torn down in the `useEffect` cleanup when the user changes or logs out

### Write-Through Cache (Food & Readiness)
`setFoodLog` and `setReadinessLog` are not plain React state setters — they wrap `setFoodLogState` / `setReadinessLogState` with a write-through that:
1. Computes the next array from the updater
2. Prunes entries older than 90 days
3. Immediately writes the pruned array to `fittrack_foodLog_<userId>` / `fittrack_readinessLog_<userId>` in localStorage
4. Returns `next` to React for re-render

This guarantees that even if the Supabase upsert fails, the local cache is always up-to-date for the next refresh fallback.

`setBodyFatLog` follows the same write-through pattern (without the 90-day prune).

### `createSyncSetter` (Cloud Delta Sync)
Factory function used to build all six cloud-backed setters. Given a `table`, a current state array, a `setState`, and a `mapperToCloud`:
1. Calls `setLocalState(prev => ...)` synchronously to update React state
2. Inside a `setTimeout(0)`, reads `currentUserIdRef.current` (avoids stale closure userId)
3. Computes `toUpsert` (new or changed items by deep JSON comparison) and `toDeleteIds`
4. Normalizes every field to remove `undefined`, `''`, and `NaN` before the Supabase payload
5. Calls `supabase.from(table).upsert(mapped, { onConflict: 'id' })`; logs `✅` on success or `❌` with the full Supabase error on failure
6. Calls `supabase.from(table).delete().in('id', toDeleteIds)` for removed rows

### Exposed Context API
**Methods:** `updateProfile`, `logout`, `setActiveSplitId`, `logReadiness`, `getStreak`, `getFoodStreak`, `toggleFavoriteFood`, `addToast`, `removeToast`, `updateWorkoutLog`

**Sync setters (replace original setters):** `setSplits`, `setWorkoutLogs`, `setHealthLogs`, `setFoodLog`, `setMeasurements`, `setReadinessLog`, `setBodyFatLog`, `setWorkoutLogsSync` (atomic update)

**Local-only setters (no cloud):** `setCaloriesLog`, `setFavoriteIds`, `setMonthlyRankHistory`, `toggleTheme`, `setWaterLog`, `setCardioLog`, `setSupplementLog`, `setSupplementConfig`, `setCycleConfig`

### Cloud Rehydration Notes
- **Food logs**: `mapFoodLogFromCloud` reconstructs the full Diet entry shape from the flat `food_logs` row, merging with the cached local item for micro-nutrient fields not stored in Supabase (`iron`, `vitaminB12`, `vitaminD`). `slot` and `mealType` default to `'Breakfast'` when `meal_type` is null. Macro values use `normalizeNumber` + `Number()` coercion for null-safety.
- **Readiness logs**: `mapReadinessFromCloud` maps integer DB columns back to UI enum strings and restores `score`, `objectiveScore`, and `checkInComplete`.
- **Merge priority**: `loadCloudData` reads live `foodLogRef.current` / `readinessLogRef.current` (not stale render snapshots) when computing the cache source, eliminating race conditions when another device writes during an in-flight load.
- **Fallback chain**: if cloud returns 0 food rows, `cachedFoodSource` (ref → localStorage) is used directly. Same for readiness. Cloud data is written into state only if `mergedLog.length > 0 || currentRef.length === 0`.
- **Splits**: falls back to `INIT_SPLITS` (default programs) when `user_splits` returns empty.
- **Body fat logs**: `loadCloudData` fetches `body_fat_logs` ordered by date descending, maps `user_id` → `userId`, `percentage` → `parseFloat`, and sets `bodyFatLog` state. Write-through localStorage cache at `fittrack_bodyFatLog_<userId>` ensures persistence across refreshes before cloud sync completes.

---

## 🐛 Bug Fixes Applied

### Olympus League XP — 0 XP After Workout (Fixed 2026-04-01)

**Symptom:** Completing a workout showed `+0 XP GAINED` on the post-session screen; Olympus League "My Stats" tab showed "Untrained" with 0 Total XP.

**Root causes (two):**

1. **Missing muscle data in workout logs** — `WorkoutPage.jsx` `finish()` previously saved only `name` and `sets` per exercise. The `calcAllMuscleXP` function in `muscleData.js` relied on a name-based lookup from splits (`exPrimaryMap`) to determine which muscle each exercise targets. If this lookup failed (e.g., stale localStorage splits, exercise name mismatch, or variant name not registered), XP was silently 0.

2. **No fallback in XP calculation** — `calcAllMuscleXP` had no fallback to read muscle data directly from the log exercise entry itself.

**Fixes applied:**

- **`WorkoutPage.jsx` `finish()`**: Log exercises now include `muscle`, `primaryMuscle`, and `secondaryMuscles` fields (copied from the session exercise object at the time of finish). These are persisted to localStorage with the log.

- **`muscleData.js` `calcAllMuscleXP()` and `getWeeklyMuscles()`**: Both functions now use a 3-priority fallback chain when resolving a muscle mapping for each log exercise:
  1. **Priority 1** (existing): Split-based name lookup via `exPrimaryMap[ex.name]`
  2. **Priority 2** (new): Direct read from `ex.primaryMuscle` / `ex.secondaryMuscles` on the log exercise itself
  3. **Priority 3** (existing): Display name parsing via `exMuscleMap[ex.name]` / `ex.muscle` → `muscleIdFromDisplayName()`

> **Note on monthly reset:** The Olympus League is designed to reset each calendar month. Workouts logged in a previous month do not carry over — only new sessions logged in the current month earn XP. This is intentional behaviour.

### DietPage — Food Search Modal Bugs (Fixed across Phases E–H)

Several rounds of mobile UX fixes on the food search modal:

- **`categoryId` → `category`**: Food data uses `category` but DietPage was referencing `f.categoryId` in 3 places — all category filtering returned empty. Fixed to `f.category`.
- **`s.desc` → `s.label`**: Serving descriptions were blank because the data uses `label`, not `desc`. Fixed in 2 places.
- **Custom grams not updating macros**: The input handler was setting `servingId` to `''` instead of `'custom'`, so `calcMacros` never entered the custom grams branch. Fixed to `setServingId('custom')`.
- **Keyboard scroll issues (iOS)**: Modal height changed from `90vh` to `90dvh`. Body scroll lock via `position: fixed` + scroll position save/restore. Replaced `autoFocus` with 350ms delayed focus. Save bar changed from `position: fixed` to `position: sticky`.
- **Results list scroll locked**: Added `touch-action: pan-y`, `-webkit-overflow-scrolling: touch`, and `overscrollBehavior: contain` on scroll containers.
- **Fasting filter**: Replaced native `<select>` with styled pill chips matching the diet type filter row.

### DietPage — Food Search Re-architecture (Fixed 2026-04-07)
**Symptom:** Opening the food search modal showed a spinner overlaid on previous search results, sometimes causing race conditions and stale UI due to per-keystroke Supabase calls. Favorites crashed because `indianFoods` wasn't imported. Favourites star and chevron icons were very faint in dark mode.
**Fixes applied:**
- Created `hooks/useFoodCache.js` for hybrid caching (fetches complete Supabase dataset on mount with local fallback).
- Modified `searchLocalFoods` to use this synchronous cache — eliminated network latency and race conditions.
- Fixed `DietPage.jsx` to clear `searchQuery` and `searchCat` state upon modal open/re-open.
- Fixed favourites crash by correctly passing the `allFoods` array.
- Updated `Star` and `ChevronRight` icon color tokens from `var(--outline-variant)` to `var(--on-surface-dim)` for visibility.
- Added missing `@keyframes spin` to `index.css`.

### DashboardPage — Stale Nutrition & NaN Fats (Fixed 2026-04-07)
**Symptom:** "Today's Nutrition" card on the home page showed yesterday's calories and `NaN` for fats.
**Fixes applied:**
- Fixed UTC date bug: `new Date().toISOString().split('T')[0]` was returning the UTC date, which lagged local midnight. Replaced with local `tod()` helper.
- Fixed typo: `todayTotals.fat` → `todayTotals.fats`, resolving the `NaN` display.

### Auth Migration & Data Isolation (Fixed 2026-04-08)
**Symptom:** Race conditions causing double Google sign-in attempts, cross-user data contamination from local migration & demo fallbacks, and UI crashes/NaNs from unset goals or missing physical stats.
**Fixes applied:**
- Switched to `onAuthStateChange` as the single source of truth for auth (no double calls with `getSession`).
- Added robust data isolation: `authMigration.js` now strictly requires email matching before migrating local data to Supabase.
- Purged all hardcoded `'vishal'` and `'demo'` ID fallbacks across the app.
- Clear in-memory fitness logs via React `useEffect` when the authenticated `user.id` switches.
- Per-user scoping for onboarding flags (`fittrack_onboarding_pending:${user.id}`).
- Null guards on Diet and Dashboard pages: replaced `nullkg`/`nullcm` and `NaN` TDEE with blank states (`—`).
- Hardened account isolation: `AppContext` now resets auxiliary local storage (`cardioLog`, `waterLog`, etc.) on account switch.
- Olympus League Global Leaderboard: Real-time Supabase fetch for `user_profiles` ensures newly registered 0XP users are visible. **Note:** Requires public SELECT policies on `user_profiles` and `workout_logs` (added in `supabase/migrations/20260409_add_leaderboard_rls.sql`). Added debug console logging to `MuscleMapPage.jsx`.

### Readiness & Diet Refresh Persistence (Fixed 2026-04-09)
**Symptoms:**
- Readiness score reset to the objective number after refresh, questionnaire reopened, and widget score drifted from the score revealed in the check-in sheet.
- Diet page lost logged meals after refresh even though workout tracking and water intake were still present.

**Fixes applied:**
- **Readiness**:
  - AppContext now normalizes `readiness_logs` DB rows back into the UI shape, including `score`, `objectiveScore`, `sorenessLevel`, and `stressLevel`.
  - Dashboard now treats a day as "completed" only when the saved readiness entry has both `checkInComplete` and a valid numeric `score`.
  - The readiness questionnaire waits for `dataLoaded` before deciding whether today's check-in is missing.
- **Diet**:
  - AppContext now normalizes `food_logs` rows back into the full Diet entry shape (`slot`, `mealType`, `qty`, `customGrams`, `macros`, `sourceType`).
  - Added a direct per-user local fallback (`fittrack_foodLog_<userId>`) during cloud rehydration so logged meals still appear after refresh even if older cloud rows are incomplete or absent.
  - `authMigration.js` upload mapping now sends normalized food/readiness payloads so future rows land in Supabase in the correct shape.

### Desktop Auth Bootstrap Loading Hang (Fixed 2026-04-09)
**Symptom:** Desktop web sessions could stay on the FitTrack Pro loading screen indefinitely if the live Supabase profile fetch stalled during startup.
**Root cause:** The original boot sequence blocked `authLoading` on the completion of `fetchProfile`, which includes `user_profiles` DB fetch, migration, and `loadCloudData` — a chain that can take 3–10 s. Any transient error left `authLoading` stuck forever.
**Fixes applied:**
- `handleSessionBootstrap` now sets `initialized = true` **synchronously** before any `await`, so the 3-second fallback timer only fires for truly unresponsive sessions.
- `authLoading` is cleared immediately after constructing a `buildFallbackProfile` from the session + `fittrack_profile_<userId>` cache — the live profile fetch runs in the background.
- `fetchProfile` is guarded by an `isFetchingProfile` ref-mutex to prevent double-calls from the `onAuthStateChange` + `getSession` race.
- Errors in `fetchProfile` are caught and logged; the `finally` block always clears `isFetchingProfile` and ensures `authLoading` is false.
- Removed the custom `storageKey` from the Supabase client config (it orphaned existing sessions using the default `sb-<ref>-auth-token` key).

### Cross-Device Readiness & Meal Sync (Fixed 2026-04-09)
**Symptoms:**
- Logging readiness on phone and then opening Mac could still reopen the questionnaire and create a conflicting same-day score.
- Meals and readiness updates were reliable from Mac → phone, but not consistently from phone → Mac.

**Fixes applied:**
- Added Supabase realtime channel `fittrack-sync-<userId>` subscribing to `postgres_changes` for `food_logs` and `readiness_logs` filtered to the authenticated user.
- Added browser-side refresh triggers on `focus`, `visibilitychange`, `online`, and `pageshow`, plus a 15-second visible-tab polling interval.
- All triggers call the debounced `scheduleCloudRefresh(userId)` (250 ms) to coalesce bursts.
- Switched `loadCloudData` to read from live refs (`foodLogRef.current` / `readinessLogRef.current`) instead of stale render closures, eliminating a race where mid-flight cloud loads overwrote concurrent local writes.
- Readiness merge deduplicates by `userId:date` key and applies `pickPreferredReadinessEntry` tie-breaking (completed > newer timestamp).
- Dashboard auto-closes the readiness sheet when a completed check-in arrives from the cloud before the local form is submitted.

### Write-Through Cache & 90-Day Pruning (Implemented 2026-04-09)
**Motivation:** The `setFoodLog` / `setReadinessLog` setters previously only updated React state. A Supabase upsert failure would cause data to appear on-screen but disappear after refresh.
**Implementation:** Both setters now write-through to their per-user localStorage key on every state update, pruning entries older than 90 days to prevent unbounded growth. This makes the local cache reliably authoritative for the next refresh fallback, independent of Supabase availability.

### Diet Page Header Layout Overlap (Fixed 2026-04-09)
**Symptom:** On mobile screens, the "DAILY TRACKER" headline, 3-Day Streak badge, "Copy Y'day" button, and `< Today >` date picker were all on a single flex row, causing text bleed, overflow off-screen, and overlapping elements.
**Fix:** Restructured into a responsive 2-row layout:
- Row 1: `DAILY TRACKER` title (left) + Streak badge (right), ember-themed pill using `var(--primary-container)` color
- Row 2: `< Today >` date navigator and `Copy Y'day` button as equal-flex siblings, both using `var(--surface-container-highest)` background + 12px border-radius — visually unified, no `minWidth` constraint that caused bleed
- `white-space: nowrap` added to both pill labels to prevent letter-stacking on very narrow screens

### Supabase Upsert Debug Logging (Added 2026-04-09)
`createSyncSetter` now emits `[CloudSync] ✅ Upserted N row(s) to <table>` on success and `[CloudSync] ❌ Upsert FAILED for <table>: <message>` on error, making it trivial to confirm from browser DevTools whether data is actually reaching the cloud.

### Workout Page Optimization & Swap Upgrades (Applied 2026-04-16)
**Fixes Applied:**
- **Swapper Mechanism Refactor:** Substituted bottom-sheet swap design for a fixed-viewport centered `Portal` modal that displays directly over the focused element. Adopted `ex.sv` to locally persist swapped variants without poisoning the global split array. Upgraded the generic refresh icon to an explicit `ArrowRightLeft` boxed pill UI.
- **Data Fallback Model:** Updated `WorkoutHistoryPage` and `ProgressPage` to read muscle targets and focus groups directly from the logged exercises before falling back to static split definitions (Log-First attribution). Handles all custom swap permutations perfectly in analytics.
- **Volume & Programming Tweaks:** Reduced default working sets across all predefined splits from 4 down to 3. Injected isolated 2-set finishers (Bicep/Tricep) into `mkUpperA` / `mkUpperB` factory functions.
- **Granular Weight Steps:** Redefined `mkWtItems` default step to `0.1kg` allowing micro-tracking of body weight across Dashboard and Profile pickers. Barbell and dumbbell entries in `/workout` explicitly retain standard `0.5kg` / integer increments.
- **Dynamic Protein Scaling:** Re-calibrated `protTarget` rules synchronously in `DashboardPage` and `DietPage`. Now securely defaults to `1.8g/kg`, but selectively bumps to `2.0g/kg` for athletes on an active cut (`loss`) while training `5+` days heavily per week.

### Body Fat Tracking Redesign & Sync Fix (Applied 2026-04-17)
**Symptoms:** 
- The Body Composition card's original SVG "ring" visual was not accurately conveying trend information over time. 
- The UI occupied too much vertical real estate alongside the Weight Trend card natively, and the previous/latest trend logic caused screen flickering. 
- Fast cloud refreshes overwrote unsynced local body fat entries before Supabase UPSERTs finalized, causing dropped entries.

**Fixes Applied:**
- **UI/UX Overhaul (`BodyFatRingCard.jsx`)**: Ripped out the circle SVG and replaced it with a `Recharts` Area chart that perfectly mimics the app's Weight Trend styling (ember-gradient fill, dash-array dashed reference lines for Goals). 
- **Layout Tweaks**: Shrunk the overarching weight-goal column by 25% to optimize card symmetry. Decoupled the "Log Body Fat" button from its full-width treatment—redesigning it as an isolated, compact pill strictly matching the dashboard header's `+ Log Weight` visual signature (padding: 7px 13px, border-radius: 100px).
- **Data Display**: Refactored the stat row above the chart to simultaneously inline Current %, Previous %, and Target Goal %, rendering them instantly stable across component mounts. Null states instruct the user to "Log for at least two days to see your trend," acknowledging the system's strict 1-log-per-day restriction.
- **Cloud Sync Loss Bug (`AppContext.jsx`)**: Restructured `.loadCloudData` to stop natively overwriting the state with raw `cloudBF`. Integrated an ID-mapped merger function alongside a fresh `bodyFatLogRef` hook to deterministically merge fast-path local unsynced entries against the backend row load. Eliminates the data disappearing act previously observed midway through logging a new state update.

### Workout Editing & Scroll Restoration (Fixed 2026-04-18)
**Symptoms:** 
- The "Add Exercise" modal inside the log editor was a transparent overlay that didn't fully cover the background, causing UI text bleed and accidental click-through closings.
- The "Custom" exercise feature was non-functional (modal closed without adding).
- Navigating back from a workout session or cancelling a food log reset the page scroll to the top, causing user frustration on long lists.

**Fixes Applied:**
- **EditWorkoutModal Re-architecture**: Implemented a conditional-rendering model that swaps the editor for the exercise picker rather than layering them with `z-index`. Fixed the nonexistent `--background` variable by mapping to `--surface`. Added `stopPropagation` to prevent events from bubbling to the backdrop close handler.
- **Improved Duration Input**: Fixed visibility by adding explicit `Space Grotesk` font styling and an inline "min" label, ensuring the number is readable on all devices.
- **Module-Level Scroll Caching**: Implemented `workoutPageCache` and `dietTabCache` Map objects that store the exact `window.scrollY` offset before entering a dedicated "mode" (like a session or a search overlay). These offsets are restored with `behavior: 'instant'` upon exit.
- **Global `useScrollRestoration`**: Deployed a persistent route-based scroll hook that preserves list position when navigating between pages (e.g., History → Dashboard → History).

### Adaptive Coaching Engine Refinements (Applied 2026-04-22)
**Symptoms:**
- The engine lacked a scenario for when weight loss was occurring, but too slowly (-0.05 to -0.15 kg/week).
- Aggressive calorie cuts (e.g., -400 kcal) on weight stalls or sudden weight spikes were demoralizing to users and violated adherence principles.
- Dismissing the coaching banner locked out the engine for 7 days but simultaneously reset the timeline, treating a "Dismiss" as an "Accept".
- The UI had broken CSS tokens, a non-functional "Review" button reliant on hash-routing, and rendered in suboptimal locations on both the Dashboard and Diet pages.
- The Body Composition target progress ring incorrectly increased when weight moved away from the target goal instead of clamping to 0%.

**Fixes Applied:**
- **Engine Patches (`adaptiveCalories.js`)**: Injected the new `S2b` (Loss Too Slow) scenario for a conservative -100 kcal nudge. Capped all adjustment extremes via `Math.min` / `Math.max` to ±200 kcal for adherence safety.
- **Dismiss Separation (`AppContext.jsx`)**: Rerouted `dismissSuggestion` to write exclusively to a `localStorage` cache (`fittrack_coaching_dismissed_at_<id>`). This suppresses the banner for 7 days but preserves the `lastKcalSuggestionDate` so the underlying model's regression cooldown doesn't reset.
- **UI & Routing Overhaul (`AdaptiveDietBanner.jsx`)**: Scrubbed hardcoded `glass-card` classes and undefined ember tokens in favor of implicit Kinetic Elite theming. Rebuilt both the compact and full banner variants to feature explicit typographic grids and animated pulsing indicator glows. Mapped the compact "Review" button to use the `onDetails` prop for native `react-router` navigation.
- **Strategic Repositioning**: Moved the Dashboard coaching banner out of the data metrics scroll and placed it immediately above the Body Composition card. Detached the Diet Page banner from the `activeTab === 'guide'` conditional array so the user sees the prompt globally above the main Goal Tracker card.
- **Progress Ring Patch (`BodyFatRingCard.jsx`)**: Updated the math in `goalPct` to be directionally aware (`isLossGoal`), clamping progress to `0%` using `Math.max` when the user's weight diverges inversely from their objective.

### Critical Bug Fix Sprint (Applied 2026-04-23)
**Symptoms:**
- The "swap exercise" pre-fill logic was completely broken, returning `null` because saved workout logs strip the `done` flag, causing the `exerciseHistory.js` lookup to fail. Even when partially fixed, it only mapped the final set's values to all rows.
- The PR badge on the workout tracker used a redundant `Flame` icon and had outdated CSS animations that no longer matched the Kinetic Elite system.
- The Profile Page metrics grid overflowed the viewport on small mobile devices (375px widths).
- The Dashboard "Today's Nutrition" card desynced from the Diet Page's primary TDEE target when the Adaptive Engine applied adjustments.
- The Adaptive Coaching Banner appeared to mysteriously vanish on mobile.

**Fixes Applied:**
- **Swap & Pre-fill Engine (`exerciseHistory.js` & `WorkoutPage.jsx`)**: Rebuilt the historical lookup logic. Added `getLastSessionSets()` to retrieve the full array of sets from the most recent session (ignoring the missing `done` flag). `swapExercise` now maps these sets 1:1 (Set 1 → Set 1, Set 2 → Set 2). Also fixed a latent bug where `getAllTimePR` was silently failing for the exact same `s.done` reason.
- **PR Badge Redesign (`WorkoutPage.jsx` & `index.css`)**: Removed the `Flame` icon and "NEW PR" floating label. Replaced the UI with a minimal, text-based "PR" pill (`.pr-badge-pill`) that aligns with current token standards. Cleaned up unused `@keyframes prLabelFade`.
- **Responsive Layouts (`ProfilePage.jsx` & `index.css`)**: Migrated the profile metrics grid to a dedicated `.profile-metrics-grid` CSS class utilizing `grid-template-columns` with a 640px breakpoint (2x2 on mobile, 1x4 on desktop) and `min-width: 0` constraints to eliminate horizontal overflow.
- **TDEE State Sync (`DashboardPage.jsx`)**: Updated the dashboard `goalKcal` calculation to strictly prioritize `user.customGoalKcal` (the adaptive adjustment override), bringing it into perfect parity with the Diet Page's logic.
- **Adaptive Banner Audit**: Verified that the "vanishing" banner is not a bug; it is the intended behavior of the 7-day `localStorage` dismissal cooldown.
- **Rest Timer Layout & Progress (Applied 2026-04-24)**:
  - **Layout Refactor**: Reverted the rest timer from a horizontal flex layout to a vertical stack to fix excessive button spacing on mobile.
  - **Format Update**: Updated countdown text from seconds (`126s`) to minutes and seconds (`02:06s`).
  - **Stateful Max Tracking**: Fixed a bug where the ring stayed at 100% after adding time. Introduced `maxObserved` local state to track the highest time value reached, ensuring the ring drains proportionally immediately from the new peak.
  - **Reference Error Fix**: Resolved a "try again" crash caused by an undefined `React` object in a functional component that only imported specific hooks.

### Push Notifications & History Depth (Applied 2026-05-01)
**Fixes Applied:**
- **Push Notification Infrastructure**: Deployed `web-push` based Edge Functions for workout, diet, streak, and Olympus rank reminders. Integrated `pg_cron` and `pg_net` via migration `20260501091225` for server-side scheduling. Established `push_subscriptions` and `notification_logs` schema.
- **Exercise Swap & History Restoration (`exerciseHistory.js`)**: Overhauled historical lookup to fix a major pre-fill bug where saved logs (stripped of `done: true`) were ignored. Added `getLastSessionSets()` to enable 1:1 set mapping (Set 1 → Set 1) during swaps, ensuring users don't lose their previous session's progress context.
- **Vercel Production Syntax Fix**: Resolved a "black screen" production failure by escaping problematic characters in inline Babel scripts within `index.html`.
- **Adaptive TDEE UI Polish**: Fixed the Metabolic Index card to render a cleaner formula breakdown and confidence score, removing generic icons in favor of high-fidelity typographic hierarchy.

---

## 🔲 Known Gaps / Pending Work

| Item | Notes |
|------|-------|
| Web Push Subscription Flow | Backend is ready, but frontend `ServiceWorker` and permission request UI are not yet implemented. |
| Supplement brand entries | 26 whey + 10 mass gainer entries documented in `TODO-supplement-db.md` — not yet added to `indianFoods.js` |
| Food count vs target | ~207 entries in `indianFoods.js` vs 350 target. Missing items mainly in sweets/mithai, fruits, and regional variants |
| Steps / Calories data | Placeholder cards on Dashboard, no real data source wired |
| `back-calves` / `back-forearms` | Not in `MUSCLE_IMAGES` map in `BodyMapSVG.jsx` |
| `ProgressOrb` usage | Only on Dashboard goal card — not yet on other pages |
| `cascade-item` stagger | Defined in CSS but not applied broadly across all card lists |
| Friends tab (Olympus League) | EmptyState stub — no real social graph backend |
| Time-range filter pills (Analytics) | `[1M] [3M] [6M]` pills are visual only — state wiring deferred |
| Reset-password route | Forgot-password email flow is wired, but `/reset-password` is not yet mounted in the router |
| GI-aware carb guidance | Documented in Phase 4 — not yet implemented |
