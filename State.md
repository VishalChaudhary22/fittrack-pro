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
├── todo-redesign-phase-1.md     # Kinetic Elite redesign task log (completed)
├── TODO-male-anatomy.md
├── TODO-female-anatomy.md
├── TODO.md
├── vercel.json                  # SPA rewrite rules for Vercel
├── index.html
├── package.json
├── vite.config.js
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
    │   │   ├── ProgressPage.jsx
    │   │   ├── MuscleMapPage.jsx
    │   │   ├── ProfilePage.jsx
    │   │   ├── WeightLogPage.jsx
    │   │   ├── MeasurementsPage.jsx
    │   │   ├── WorkoutHistoryPage.jsx
    │   │   └── ContactPage.jsx
    │   └── shared/
    │       ├── SharedComponents.jsx   # All shared UI components
    │       └── BodyMapSVG.jsx         # Canvas-based anatomical renderer
    ├── context/
    │   └── AppContext.jsx        # Global state (user, logs, splits, toasts)
    ├── data/
    │   ├── constants.js          # NAV, NAV_MOBILE_MAIN, NAV_MOBILE_MORE
    │   ├── splits.js             # Default split programs
    │   ├── muscleData.js         # XP calc, rank system, muscle groups
    │   ├── diets.js              # Macro targets / diet presets
    │   ├── rankBenchmarks.js
    │   └── sample.js
    ├── hooks/
    └── utils/
```

---

## 🎨 Design System

The app uses the **"Kinetic Elite"** design system, defined in `index.css`. It was fully migrated away from the original `Bebas Neue` / `DM Sans` / `#050506` stack.

### Typography
- **Display / Headlines**: `Space Grotesk` (500, 700) — tight tracking (`-0.04em`), used for metrics, page headings, and the app wordmark
- **Body / Labels**: `Be Vietnam Pro` (400, 500, 600, 700) — wide tracking (`0.1em`) on uppercase labels, normal on prose
- CSS utility classes: `.display-lg`, `.headline-lg`, `.headline-md`, `.title-lg`, `.title-md`, `.body-md`, `.label-md`

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

**Light theme:** Warm linen palette (`#F5F0EB` base), same ember accent.

### Key Rules
- **No solid 1px borders** — depth comes from tonal background shifts between surface tiers
- **No standard drop shadows** — only `--shadow-ambient` (diffused) or `--glow-primary` (LED emission at 10% opacity)
- **No `Bebas Neue` or `DM Sans`** — zero remaining references in the codebase
- **Animations use only `transform` / `opacity`** — no layout property animation

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

---

## 📑 Pages

### `/` — Dashboard
Rebuilt around the Kinetic Elite aesthetic. Key sections:
- **Welcome header**: editorial-style `"WELCOME BACK, [NAME]"` in Space Grotesk with text-gradient on first name. Theme toggle pill lives here, not in a sidebar section.
- **Weight Analysis + Metabolic Index**: 2-col glass card row. Weight card shows current / previous log with a goal-aware trend arrow (colour changes based on whether weight direction matches goal direction — not just up/down). BMI card has a concentric CSS ring with ember glow + per-range insight text.
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

**Post-session summary**: XP / Sets / Volume row + `BodyMapSVG` mini-map of muscles trained. "Log Another" + "View Map →" actions.

### `/splits` — Split Management
View and manage training split programs. Accessible from the primary mobile bottom nav.

### `/diet` — Diet & Nutrition
Macro tracking and meal logging interface.

### `/progress` — Analytics
Recharts-powered per-exercise performance charts: AreaChart, BarChart, LineChart. Split → Day → Exercise cascade dropdowns.

### `/muscle-map` — Muscle Map
`MuscleMapPage.jsx` + `BodyMapSVG.jsx`. Monthly XP reset system with consistency and volume bonuses. Full rank ladder. "Past Performance" widget for historical monthly ranks.

**Anatomy asset status:**
- 🟢 **Male** — 17 PNGs, rendering in production
- 🟢 **Female** — 15 PNGs in `public/muscles/female/` (2 bases, 6 back highlights, 7 front highlights), rendering in production
- 🟢 **Fallback** — Canvas renders a styled placeholder if any image fails to load

`BodyMapSVG` renders via HTML5 Canvas pixel compositing — coral-red highlights over teal-blue base, with alpha-blended secondary muscle dimming for primary vs secondary engagement.

### `/profile` — Profile
User settings, unit preferences (kg/lbs), theme toggle, personal info.

### `/history` — Workout History
Log of completed sessions with date, volume, and exercise breakdown.

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

## 🔲 Known Gaps / Pending Work

| Item | Notes |
|------|-------|
| Steps / Calories / Water data | Placeholder cards on Dashboard, no real data source wired |
| `back-calves` / `back-forearms` | Not in `MUSCLE_IMAGES` map in `BodyMapSVG.jsx` |
| `ProgressOrb` usage | Only on Dashboard goal card — not yet on other pages |
| `cascade-item` stagger | Defined in CSS but not applied broadly across card lists |
| Phase 2–5 redesign items | Remaining token migrations, per-page audits, and Stitch cross-reference in `todo-redesign-phase-1.md` |
