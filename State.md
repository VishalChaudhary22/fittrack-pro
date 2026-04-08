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
├── TODO-indian-food-db.md       # Indian food DB — schema, categories, 350 food target (Phase 1–4 done)
├── TODO-supplement-db.md        # Whey protein & mass gainer brand database (Phase 5 — data entry pending)
├── TODO-dietpage-overhaul.md    # DietPage merge with food logging (Phases A–H done)
├── TODO-ux-audit.md             # UX audit across all pages
├── UX-AUDIT-INDEX.md            # Index of per-page UX audit TODOs
├── TODO-UX-01 through 13.md     # Per-page UX audit files
├── TODO-male-anatomy.md
├── TODO-female-anatomy.md
├── TODO-body-wireframe-readiness.md
├── TODO-readiness-plan.md
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
│       └── 20260407033900_add_rls_public_read.sql       # RLS policies for public read access
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
    │       └── ReadinessCheckIn.jsx    # Daily readiness check-in bottom sheet
    ├── context/
    │   └── AppContext.jsx        # Global state (user, logs, splits, foodLog, favorites, toasts)
    ├── data/
    │   ├── constants.js          # NAV, NAV_MOBILE_MAIN, NAV_MOBILE_MORE
    │   ├── splits.js             # Default split programs
    │   ├── muscleData.js         # XP calc, rank system, muscle groups
    │   ├── leaderboardData.js    # Static mock leaderboard (7 users + muscleXP)
    │   ├── diets.js              # Macro targets / diet presets
    │   ├── rankBenchmarks.js
    │   ├── sample.js
    │   └── foods/
    │       ├── indianFoods.js    # ~207 food objects (v2.3 schema, 314KB)
    │       ├── foodCategories.js # 20 category definitions
    │       └── servingTypes.js   # 18 standardized serving types
    ├── hooks/
    │   ├── useLocalStorage.js
    │   ├── useTheme.js
    │   └── useToast.js
    ├── lib/
    │   └── supabaseClient.js     # Supabase client init (URL + anon key from .env)
    └── utils/
        ├── calculations.js       # BMR, TDEE, deficit calculations
        ├── cycleCalculations.js  # Menstrual cycle phase logic
        ├── festivals.js          # Indian holiday detection
        ├── foodUtils.js          # Food search (local + remote), macro calc, beverage builder
        ├── helpers.js            # gId, tod, formatting
        ├── readinessUtils.js     # Readiness scoring, muscle recovery, spotlight muscles
        └── storage.js            # localStorage key constants
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

Additional shared components in separate files:

| Component | File | What it does |
|-----------|------|-------------|
| `AvatarInitials` | `AvatarInitials.jsx` | Circular initials avatar with rank-colored ring border. Used in Olympus League leaderboard and player modal. |
| `PlayerDetailModal` | `PlayerDetailModal.jsx` | Bottom-sheet slide-up modal showing player's BodyMapSVG, overall rank, progress bar to next tier, and per-muscle XP breakdown. |
| `ReadinessCheckIn` | `ReadinessCheckIn.jsx` | Bottom-sheet with 4-step questionnaire (sleep, energy, soreness, stress). Auto-computes a 0–100 readiness score blending subjective answers (60%) with objective training load (40%). Saves to `readinessLog` in AppContext. Score reveal animation on completion, auto-closes after 2.2s. |

---

## 📑 Pages

### `/` — Dashboard
Rebuilt around the Kinetic Elite aesthetic. Key sections:
- **Welcome header**: editorial-style `"WELCOME BACK, [NAME]"` in Space Grotesk with ember text-gradient on first name. Theme toggle pill lives here. Includes a dynamic cycle-phase badge for female athletes and celebratory banners on Indian holidays / festivals.
- **Daily Readiness widget**: Anatomical wireframe figure (3/4 perspective PNG) with per-muscle recovery status chips (optimal/fatigued/critical). Tapping opens the `ReadinessCheckIn` bottom sheet if no check-in exists for today. Readiness score display with tier colouring (Optimal / Good / Moderate / Low).
- **Weight Analysis + Metabolic Index**: 2-col glass card row. Weight card shows current / previous log with a goal-aware trend arrow. BMI card has a concentric CSS ring with ember glow + per-range insight text.
- **Sessions / Streak**: 2-col glass card row with current-week session count, all-time total, and current/longest streak.
- **Placeholder activity cards**: Steps, Calories Burned — show `—` with a `PulseIndicator + "Coming Soon"` label. Water intake is wired to the global hydration tracker.
- **Goal progress**: Glass card with `ProgressOrb`, target/remaining/weeks-left breakdown. Opens a `ScrollPicker` modal.
- **Weight Trend chart**: `AreaChart` (Recharts) with `GlassTooltip` and an optional goal reference line.
- **Live Suggestion banner**: Grayscale gym image with gradient overlay, `PulseIndicator`, active split name and schedule chips, "Start Workout" CTA.
- **Olympus League widget**: `MiniBodyMap` + rank badge + weekly muscle group count. Links to `/muscle-map`.

### `/workout` — Workout Tracker
Three states: **day picker → active session → post-session summary**.

**Day picker**: Cards with left accent stripe, last-session date, exercise preview, "Start Session →" CTA.

**Active session**:
- Session header with `PulseIndicator` + session name + rest-length selector
- `HeroRestTimer`: inline section (not a modal) — `clamp(4rem, 12vw, 7rem)` Space Grotesk countdown, ambient blob background, `+30s` ghost pill + `Skip` ember pill
- Exercise blocks: `1.5rem / -0.04em` header, `.label-md` muscle/focusType subline, info icon button
- Set grid: `.set-row` layout (`34px 1fr 1fr 44px`), each row is a `surface-container-low` card that lifts to `surface-container` on hover. Completed rows dim to 0.7 opacity. Bottom-bar focus styling on inputs.
- `.add-set-btn`: full-width dashed ghost button below each set list
- Session notes: glassmorphic card with resizable textarea
- Finish/Discard: "FINISH WORKOUT" ember gradient full-width button + "DISCARD WORKOUT" error-coloured text-only button beneath
- **Floating live pill**: fixed bottom-right Portal — glass pill with animated pulse dot + "Live tracking" label

**Session data model**: Each session stores `startTime: Date.now()` on start. On finish, the log records `durationMinutes` (rounded to nearest minute) plus `muscle`, `primaryMuscle`, and `secondaryMuscles` on every exercise (enabling reliable XP calculation independent of split lookup).

**Post-session summary**: XP / Sets / Volume row + `BodyMapSVG` mini-map of muscles trained. "Log Another" + "View Map →" actions.

**Yoga Sessions**: Selecting a `type: 'yoga'` day renders the inline `YogaSessionView` — a full-screen guided mobility player with `playBeep` audio sequencing and Box Breathing integration. These do not create tracked workout logs.

### `/splits` — Split Management
View and manage training split programs. Accessible from the primary mobile bottom nav.

### `/diet` — Diet & Nutrition (Overhauled)

Fully rebuilt. Merges the original diet guide/meal plan content with the Indian Food Database food logging system. ~69KB component file. Architecture:

```
┌─────────────────────────────────┐
│  PageHeader (Diet & Nutrition)  │
│  Compact Stats Strip (5 chips)  │  ← Weight, Height, BMI, TDEE, Activity
│  GOAL Card (macro rings:        │
│    consumed/target — always on) │
│  [Daily Tracker] [Meal Guide]   │  ← Tab switcher
├─────────────────────────────────┤
│  TAB: Daily Tracker (default)   │
│    Date navigation (< Today >)  │
│    Hydration Tracker Widget     │  ← Dynamic glass-fill progress bar
│    Supplements Daily Stack      │  ← Click-to-complete pills
│    8 Meal Slot Cards            │
│    Protein Nudge Alert          │
│    Food Log Streak badge        │
│  FAB: + Log Food (bottom-right) │
├─────────────────────────────────┤
│  TAB: Meal Guide                │
│    Blueprint Header Card        │
│    Whey Card + Diet Selector    │
│    Meal Plan Cards grid         │
│    Protein Sources Footer       │
│    Complete Protein Tip         │
└─────────────────────────────────┘
```

**Stats strip**: 5 compact pill chips showing Weight, Height, BMI, TDEE, Activity. Label in `--on-surface-variant` @ 10px, value in `--primary` @ 13px bold. Replaced the old full-width material icon cards.

**Goal card**: SVG ring gauges for Kcal, Protein, Carbs, Fat — showing consumed vs target. Rings use `stroke-dasharray`/`stroke-dashoffset`. Summary row above rings shows daily targets (`🔥 2100 kcal · 💪 160g P · 🌾 210g C · 🧈 58g F`). All values are computed dynamically from `calcBMR` / `calcTDEE` / `calcDeficit`, not static presets.

**Tab switcher**: `[🍽 Daily Tracker]` (default) and `[📋 Meal Guide]`. Pill-style with ember gradient on active tab.

**Daily Tracker tab**:
- Date navigation (prev / "Today" / next), date-aware log filtering
- 8 meal slot cards: Breakfast, Mid-Morning, Lunch, Evening Snack · Chai, Pre-Workout, Post-Workout, Dinner, Before Bed
- Each slot shows: icon, name, suggested kcal range, tracked total, circular `+` button
- Expanding a slot reveals logged food entries (name, P/C/F chips, kcal, delete ✕)
- "Copy yesterday" ghost button for quick re-logging
- Protein nudge alert: fires when `consumed protein < target - 20g` and it's past 6pm
- Food log streak badge showing consecutive logging days

**Meal Guide tab**: Preserved all original diet page logic — BMR/TDEE/deficit calculations, goal detection from weight vs weightGoal, protein multiplier, carb/fat splits, whey scoop recommendation card, diet type selector (Vegan/Vegetarian/Egg/Non-Veg), per-meal macro breakdown cards, protein sources footer.

**Food Search Modal** (bottom sheet, opens from FAB or slot `+` button):
- Search bar with fuzzy matching on `name`, `nameAlt`, `searchTerms`, `brand`, `productLine`
- Diet type filter chips: All / Veg / Vegan / Jain / Egg / Non-Veg
- Fasting/Vrat filter chips: None · Navratri · Ekadashi · Ramzan · Jain Paryushana · Maha Shivratri
- Category pills (20 categories from `foodCategories.js`)
- "Recent" section at top (last 10 unique foods logged)
- Favorites section (starred foods, quick re-add)
- Results list with badges (Root Veg, Customisable, Fasting-safe)
- Custom Food quick-add form (name + calories + macros)

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

### `/cycle` — Cycle Syncing (Period Tracker)
Female-focused view computing whether the athlete is in menstruation, follicular, ovulation, or luteal phase. Provides contextualized training cues (e.g., dial back heavy lifts in luteal). Syncs to contextual Dashboard profile badge.

### `/profile` — Profile
User settings, unit preferences (kg/lbs), theme toggle, personal info.

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
- **Auth gate**: `AuthModal` blocks all routes until a user is selected/created.

---

## 🍛 Indian Food Database

### Data Layer

**Dual storage**: The food database exists in two places simultaneously:
1. **Local JS** — `src/data/foods/indianFoods.js` (~207 entries, 314KB). Used as the primary runtime data source via `searchLocalFoods()`.
2. **Supabase (cloud)** — Full Postgres database with `foods` and `food_servings` tables. Populated via 7 migration files. Queryable via `searchRemoteFoods()` in `foodUtils.js`.

The local JS file is the current fallback and primary source. The Supabase remote search is wired and functional but the app defaults to local search in DietPage for offline resilience.

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

### Final Score
40% objective (training history) + 60% subjective (check-in). Stored in `readinessLog` via AppContext with shape `{ userId, date, sleepHours, energyLevel, sorenessLevel, stressLevel, score, objectiveScore, checkInComplete }`.

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

All persistent state in `AppContext.jsx`, backed by `useLocalStorage`:

| Key | Type | Purpose |
|-----|------|---------|
| `fittrack_users` | array | User profiles |
| `fittrack_uid` | string | Active user ID |
| `fittrack_splits` | array | Training split programs |
| `fittrack_healthLogs` | array | Weight log entries |
| `fittrack_workoutLogs` | array | Workout session logs |
| `fittrack_readinessLog` | array | Daily readiness check-in entries |
| `fittrack_measurements` | array | Body measurement entries |
| `fittrack_caloriesLog` | array | Legacy calorie-only log (deprecated, kept for backward compat) |
| `fittrack_foodLog` | array | Food log entries with full macro snapshots |
| `fittrack_favoriteFoods` | array | Starred food IDs |
| `fittrack_monthlyRankHistory` | array | Olympus League monthly XP history |
| `fp_water_log` | array | Hydration tracking logs |
| `fittrack_cardioLog` | array | Session history for cardio logs |
| `fittrack_supplementLog` | array | User-logged supplements intake history |
| `fittrack_supplementConfig` | array | Custom doses and supplements (Whey, Creatine, etc) |
| `fp_cycle_config` | object | Start date & length for cycle tracking |

Exposed methods: `login`, `logout`, `setActiveSplitId`, `logReadiness`, `getStreak` (workout), `getFoodStreak` (food logging), `toggleFavoriteFood`.

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

---

## 🔲 Known Gaps / Pending Work

| Item | Notes |
|------|-------|
| Supplement brand entries | 26 whey + 10 mass gainer entries documented in `TODO-supplement-db.md` — not yet added to `indianFoods.js` |
| Food count vs target | ~207 entries in `indianFoods.js` vs 350 target. Missing items mainly in sweets/mithai, fruits, and regional variants |
| Steps / Calories data | Placeholder cards on Dashboard, no real data source wired |
| `back-calves` / `back-forearms` | Not in `MUSCLE_IMAGES` map in `BodyMapSVG.jsx` |
| `ProgressOrb` usage | Only on Dashboard goal card — not yet on other pages |
| `cascade-item` stagger | Defined in CSS but not applied broadly across all card lists |
| Friends tab (Olympus League) | EmptyState stub — no real social graph backend |
| Time-range filter pills (Analytics) | `[1M] [3M] [6M]` pills are visual only — state wiring deferred |
| Olympus League Phase 3 post-ship fixes | Fixes 1–8 documented in `TODO-redesign-phase-3.md §Phase 3.1`; all marked `[x]` (implemented) |
| Leaderboard light-theme rows | Inline `rgba` glass values on leaderboard rows may look off in light mode; prefer `var(--glass-bg)` |
| B12/D3/Iron alerts | Documented in Phase 4 of food DB plan — not yet implemented in DietPage |
| GI-aware carb guidance | Documented in Phase 4 — not yet implemented |
| Recipe builder | Cancelled — comprehensive pre-built coverage + custom food entry is enough |
| Supabase as primary food source | Remote search is wired but local JS is still the default. Switch pending once data parity is confirmed |
| UX audit items | `TODO-ux-audit.md` + 13 per-page audit files (`TODO-UX-01` through `TODO-UX-13`) pending review |
