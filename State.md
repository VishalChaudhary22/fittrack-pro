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
| Vite | 8.0.0 |
| ESLint | 9.39.4 |

---

## 📂 File Structure

```text
fittrack-pro/
├── State.md                     # This file
├── TODO-redesign-phase-1.md     # Kinetic Elite redesign — Phases 0–8 (completed)
├── TODO-redesign-phase-2.md     # Workout History Page overhaul (completed)
├── TODO-redesign-phase-3.md     # Iron League Page overhaul (completed + post-ship fixes)
├── TODO-indian-food-db.md
├── TODO-male-anatomy.md
├── TODO-female-anatomy.md
├── TODO.md
├── vercel.json                  # SPA rewrite rules for Vercel
├── index.html
├── package.json
├── vite.config.js
├── .stitch/
│   ├── DESIGN.md                # Stitch-native design system source of truth
│   └── designs/                 # Downloaded Stitch HTML + screenshot references
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
    │   │   ├── DietPage.jsx
    │   │   ├── ProgressPage.jsx         # Renamed display: "Workout Analytics"
    │   │   ├── MuscleMapPage.jsx        # Iron League — Phase 3 overhaul
    │   │   ├── ProfilePage.jsx
    │   │   ├── WeightLogPage.jsx
    │   │   ├── MeasurementsPage.jsx
    │   │   ├── WorkoutHistoryPage.jsx   # Phase 2 editorial redesign
    │   │   └── ContactPage.jsx
    │   └── shared/
    │       ├── SharedComponents.jsx     # All shared UI components
    │       ├── BodyMapSVG.jsx           # Canvas-based anatomical renderer
    │       ├── AvatarInitials.jsx       # NEW — Initials avatar circle (Phase 3)
    │       └── PlayerDetailModal.jsx    # NEW — Bottom-sheet muscle modal (Phase 3)
    ├── context/
    │   └── AppContext.jsx        # Global state (user, logs, splits, toasts)
    ├── data/
    │   ├── constants.js          # NAV, NAV_MOBILE_MAIN, NAV_MOBILE_MORE
    │   ├── splits.js             # Default split programs
    │   ├── muscleData.js         # XP calc, rank system, muscle groups
    │   ├── leaderboardData.js    # NEW — Static mock leaderboard (7 users + muscleXP)
    │   ├── diets.js              # Macro targets / diet presets
    │   ├── rankBenchmarks.js
    │   └── sample.js
    ├── hooks/
    └── utils/
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
| `AvatarInitials` | `AvatarInitials.jsx` | Circular initials avatar with rank-colored ring border. Used in Iron League leaderboard and player modal. |
| `PlayerDetailModal` | `PlayerDetailModal.jsx` | Bottom-sheet slide-up modal showing player's BodyMapSVG, overall rank, progress bar to next tier, and per-muscle XP breakdown. |

---

## 📑 Pages

### `/` — Dashboard
Rebuilt around the Kinetic Elite aesthetic. Key sections:
- **Welcome header**: editorial-style `"WELCOME BACK, [NAME]"` in Space Grotesk with ember text-gradient on first name. Theme toggle pill lives here.
- **Weight Analysis + Metabolic Index**: 2-col glass card row. Weight card shows current / previous log with a goal-aware trend arrow. BMI card has a concentric CSS ring with ember glow + per-range insight text.
- **Sessions / Streak**: 2-col glass card row with current-week session count, all-time total, and current/longest streak.
- **Placeholder activity cards**: Steps, Calories Burned, Water Intake — show `—` with a `PulseIndicator + "Coming Soon"` label. No real data sources yet.
- **Goal progress**: Glass card with `ProgressOrb`, target/remaining/weeks-left breakdown. Opens a `ScrollPicker` modal.
- **Weight Trend chart**: `AreaChart` (Recharts) with `GlassTooltip` and an optional goal reference line.
- **Live Suggestion banner**: Grayscale gym image with gradient overlay, `PulseIndicator`, active split name and schedule chips, "Start Workout" CTA.
- **Iron League widget**: `MiniBodyMap` + rank badge + weekly muscle group count. Links to `/muscle-map`.

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

### `/splits` — Split Management
View and manage training split programs. Accessible from the primary mobile bottom nav.

### `/diet` — Diet & Nutrition
Macro tracking and meal logging interface.

### `/progress` — Workout Analytics
Display title: **"Workout Analytics"** (file still `ProgressPage.jsx`). Recharts-powered per-exercise performance charts. Layout:

1. **Filter controls** — Split / Day / Exercise cascading dropdowns (3-col grid, Kinetic Elite styled)
2. **Weekly context strip** — inline stats: sessions this week, volume, % change vs prior week, monthly sessions, avg/week
3. **Hero exercise title** — asymmetric editorial two-line UPPERCASE display (`clamp(2.5rem, 8vw, 4.5rem)`) when exercise is selected
4. **Bento stat grid** — 3 cards: Est. 1RM (accent, left-border exception), Personal Record, Total Sessions — with `cascade-item` stagger
5. **Volume Trend chart** — full-width hero `AreaChart` with gradient fill, glassmorphic tooltip, time-range pills `[1M] [3M] [6M]` (visual only)
6. **5-col layout**: Left (Personal Best glow card + Focus Groups card) · Right (Recent Sessions log, last 5)
7. **Secondary charts** — 2-chart grid: Est. 1RM trend (Area) + Avg Reps/Set (Line), 160px height, glassmorphic tooltips

Each `cd` entry shape: `{ date, rawDate, dayName, maxWeight, volume, avgReps, sets, est1rm }`.

### `/muscle-map` — Iron League
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
**Phase 2 editorial redesign complete.** `WorkoutHistoryPage.jsx` now renders:
- **Bento stats header**: 3-col grid (Monthly Volume in tons / Time Active in hrs / Sessions this month) with ghost icon watermarks and `display-lg` primary values
- **Filters**: Search input with inline icon + Split dropdown (Kinetic Elite styled)
- **Session cards**: hover-accent cards with left ember border when expanded; shows date (label-md primary), day name (Space Grotesk uppercase), Volume / Duration / Exercises / Sets stats row, muscle group tags (derived from split exercise lookup). Expanded section shows per-exercise sets (`Xr × Ykg` chips) and notes.
- Duration sourced from `durationMinutes` field on log (logs without it show `—`)

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

## 🐛 Bug Fixes Applied

### Iron League XP — 0 XP After Workout (Fixed 2026-04-01)

**Symptom:** Completing a workout showed `+0 XP GAINED` on the post-session screen; Iron League "My Stats" tab showed "Untrained" with 0 Total XP.

**Root causes (two):**

1. **Missing muscle data in workout logs** — `WorkoutPage.jsx` `finish()` previously saved only `name` and `sets` per exercise. The `calcAllMuscleXP` function in `muscleData.js` relied on a name-based lookup from splits (`exPrimaryMap`) to determine which muscle each exercise targets. If this lookup failed (e.g., stale localStorage splits, exercise name mismatch, or variant name not registered), XP was silently 0.

2. **No fallback in XP calculation** — `calcAllMuscleXP` had no fallback to read muscle data directly from the log exercise entry itself.

**Fixes applied:**

- **`WorkoutPage.jsx` `finish()`**: Log exercises now include `muscle`, `primaryMuscle`, and `secondaryMuscles` fields (copied from the session exercise object at the time of finish). These are persisted to localStorage with the log.

- **`muscleData.js` `calcAllMuscleXP()` and `getWeeklyMuscles()`**: Both functions now use a 3-priority fallback chain when resolving a muscle mapping for each log exercise:
  1. **Priority 1** (existing): Split-based name lookup via `exPrimaryMap[ex.name]`
  2. **Priority 2** (new): Direct read from `ex.primaryMuscle` / `ex.secondaryMuscles` on the log exercise itself
  3. **Priority 3** (existing): Display name parsing via `exMuscleMap[ex.name]` / `ex.muscle` → `muscleIdFromDisplayName()`

> **Note on monthly reset:** The Iron League is designed to reset each calendar month. Workouts logged in a previous month do not carry over — only new sessions logged in the current month earn XP. This is intentional behaviour.

---

## 🔲 Known Gaps / Pending Work

| Item | Notes |
|------|-------|
| Steps / Calories / Water data | Placeholder cards on Dashboard, no real data source wired |
| `back-calves` / `back-forearms` | Not in `MUSCLE_IMAGES` map in `BodyMapSVG.jsx` |
| `ProgressOrb` usage | Only on Dashboard goal card — not yet on other pages |
| `cascade-item` stagger | Defined in CSS but not applied broadly across all card lists |
| Friends tab (Iron League) | EmptyState stub — no real social graph backend |
| Time-range filter pills (Analytics) | `[1M] [3M] [6M]` pills are visual only — state wiring deferred |
| Iron League Phase 3 post-ship fixes | Fixes 1–8 documented in `TODO-redesign-phase-3.md §Phase 3.1`; all marked `[x]` (implemented) |
| Leaderboard light-theme rows | Inline `rgba` glass values on leaderboard rows may look off in light mode; prefer `var(--glass-bg)` |
