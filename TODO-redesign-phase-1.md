# TODO — Kinetic Elite Redesign

> Redesign plan based on `DESIGN.md` ("The Obsidian Performance")
> Audited against `stitch-design` + `taste-design` skill standards.
> **Status:** Planning — do not implement until approved.

---

## Stitch Skill Audit — Gap Analysis

> The following gaps were identified by auditing TODO-redesign.md against the
> `stitch-design` SKILL.md, `taste-design` SKILL.md, and their reference files
> (`design-mappings.md`, `prompt-keywords.md`, `generate-design-md` workflow).

| # | Gap | Source Skill | Resolution |
|---|-----|:--------:|------------|
| G1 | **No `.stitch/DESIGN.md` source of truth** — Stitch requires a semantic DESIGN.md in `.stitch/` for prompt consistency. Our `DESIGN.md` is in project root and not in the Stitch-expected format | `stitch-design` | Added **Phase 0** to generate `.stitch/DESIGN.md` |
| G2 | **No atmosphere scoring** — `taste-design` mandates Density/Variance/Motion numerical ratings (1–10 scale) to calibrate output | `taste-design` | Added to Phase 0 |
| G3 | **No motion/animation philosophy** — TODO had individual micro-animations (Pulse, Orbs) but lacked a unified motion engine spec (spring physics, stagger orchestration, performance constraints) | `taste-design §8` | Added **Phase 1.6** |
| G4 | **No anti-pattern enforcement** — `taste-design` requires an explicit "NEVER DO" list baked into the design system. Our TODO had none | `taste-design §9` | Added **Phase 1.7** |
| G5 | **No responsive rules** — Mobile-first collapse, `clamp()` typography, `min-h-[100dvh]`, touch targets (44px) were not addressed | `taste-design §7` | Added **Phase 1.8** |
| G6 | **No staggered animation orchestration** — Lists/cards mounting instantly instead of cascade staggered reveals | `taste-design §8` | Added to Phase 1.6 + Phase 2 components |
| G7 | **No Stitch MCP prototyping phase** — TODO jumps straight to code without generating high-fidelity Stitch screens first for visual validation | `stitch-design` workflow | Added **Phase 0.2** |
| G8 | **Missing Stitch prompt templates** — No structured prompts for `generate_screen_from_text` using the Enhanced Prompt Pipeline format | `stitch-design §3` | Added to Phase 0.2 |
| G9 | **No asset download workflow** — Stitch-generated HTML/screenshots should be saved to `.stitch/designs/` for reference during code implementation | `stitch-design` text-to-design §5 | Added to Phase 0.2 |

---

## Current vs Target: Delta Summary

| Dimension | Current State | Target (Kinetic Elite) | Impact |
|-----------|---------------|----------------------|--------|
| **Fonts** | Bebas Neue + DM Sans | Space Grotesk + Be Vietnam Pro | 🔴 Full swap |
| **Background** | `#050506` | `#131315` (slightly lighter obsidian) | 🟡 Token change |
| **Surface tiers** | 3 tiers (`--c1`, `--c2`, `--c3`) | 5 tiers (`surface` → `surface-container-highest`) | 🔴 New token system |
| **Borders** | 1px solid borders everywhere | **"No-Line" rule** — tonal shifts only | 🔴 All components affected |
| **Cards** | `border: 1px solid var(--bd)` + drop shadow | No border, tonal layering, ambient shadows | 🔴 Card system rewrite |
| **Inputs** | Full border box with focus ring | Bottom-bar-only focus indicator | 🟡 Input style rewrite |
| **Buttons** | Orange gradient, rounded-14px | Orange-to-peach gradient (#FFB59B → #F85F1B), rounded-xl (24px) | 🟡 Button refinement |
| **Modals/Nav** | Solid backgrounds | Glassmorphism (`backdrop-filter: blur(20px)`, 60% opacity) | 🔴 Layout rewrite |
| **Typography sizes** | `bb` class at 34px for stats | `display-lg` at 3.5rem (56px) for hero numbers | 🟡 Typography scale |
| **Shadows** | Standard drop shadows | Ambient-only (0 20px 40px rgba(0,0,0,0.4)), no standard drops | 🟡 Shadow system swap |
| **Orange accent** | `#E8540D` | Primary: `#FFB59B` (peach), Container: `#F85F1B` | 🟡 Accent palette shift |
| **Separators** | `.sep` class with 1px line | Forbidden — use whitespace + tonal shifts | 🔴 Remove all |
| **Text color** | `#EAEAF0` primary, `#6E6E76` secondary | `on-surface` for primary, `#E3BFB3` (warm) for secondary — never pure white | 🟡 Token change |
| **Corner radius** | Mixed (14px, 24px, 28px) | Consistent scale: 0.75rem (12px) to 1.5rem (24px) — **never** sharp 90° | 🟡 Normalize |
| **Glow effects** | Minimal orange glow | Active states get `primary` glow at 10% opacity (LED emission feel) | 🟡 New effect |
| **Progress bars** | Flat `pbar` with gradient fill | **Progress Orbs** — concentric circles with tertiary gradients | 🔴 New component |
| **Live indicator** | None | **Pulse dot** — animated primary dot next to live workouts | 🟢 New micro-animation |

---

## Phase 0 — Stitch Design System Foundation (NEW — from Gap Audit)

Before touching any code, establish the Stitch-native design language and generate high-fidelity reference screens.

### 0.1 Generate `.stitch/DESIGN.md` Source of Truth
Follow the `generate-design-md` workflow to create the Stitch-formatted design system.
- [x] Create `.stitch/` directory in project root
- [x] Translate `DESIGN.md` (Kinetic Elite spec) into `.stitch/DESIGN.md` following the taste-design output format:
  - **§1 Visual Theme & Atmosphere** — with numerical ratings:
    - Density: **7** ("Daily App Balanced" leaning dense — workout data is information-heavy)
    - Variance: **6** ("Offset Asymmetric" — editorial bleeds on hero numbers, but structured data tables)
    - Motion: **6** ("Fluid CSS" — perpetual pulse indicators, spring transitions, staggered card reveals)
  - **§2 Color Palette & Roles** — all tokens from DESIGN.md with descriptive names:
    - Obsidian Canvas (`#131315`) — Primary background surface
    - Void Recess (`#0E0E10`) — Recessed/inactive areas
    - Charcoal Layer (`#1A1A1D`) — Card surfaces on canvas
    - Frosted Slate (`#353437`) — Glassmorphic fill at 60% opacity
    - Ember Peach (`#FFB59B`) — Primary accent for text/icons
    - Burning Ember (`#F85F1B`) — CTA fills, signature gradient end
    - Warm Bone (`#E3BFB3`) — Secondary text (never cold grey)
    - Ghost Outline (`rgba(90, 65, 56, 0.15)`) — Accessibility borders only
  - **§3 Typography Rules** — Space Grotesk (display/headlines) + Be Vietnam Pro (body/labels)
  - **§4 Component Stylings** — as defined in DESIGN.md §5
  - **§5 Layout Principles** — asymmetric hero, no-line rule, tonal depth stacking
  - **§6 Motion & Interaction** — spring physics, staggered reveals, perpetual micro-loops
  - **§7 Anti-Patterns (Banned)** — explicit NEVER DO list
- [x] Ensure `.stitch/DESIGN.md` includes hex codes in parentheses after every descriptive name
- [x] Validate that the DESIGN.md uses natural language descriptions (not Tailwind classes) per taste-design best practices

### 0.2 Stitch MCP Prototype Screens (Visual Validation)
Before coding, generate reference screens in Stitch to validate the Obsidian Performance aesthetic.
- [x] Create Stitch project (or use existing) via `create_project` → title: "FitTrack Pro — Kinetic Elite"
- [x] Generate **Dashboard** screen via `generate_screen_from_text` using Enhanced Prompt Pipeline:
  ```
  A high-performance fitness dashboard with a "heads-up display" (HUD) aesthetic.
  Dark obsidian background. Information layered in 3D space using glassmorphism.

  DESIGN SYSTEM (REQUIRED):
  - Platform: Web, Mobile-first
  - Palette: Obsidian Canvas (#131315 background), Burning Ember (#F85F1B primary CTA),
    Ember Peach (#FFB59B accent text), Warm Bone (#E3BFB3 secondary text)
  - Typography: Space Grotesk (bold, track-tight headlines), Be Vietnam Pro (body)
  - Styles: Softly rounded (12px–24px), no borders, tonal depth layering,
    glassmorphic floating elements with backdrop-filter blur(20px)

  PAGE STRUCTURE:
  1. Header: Translucent glass sidebar with app branding and nav items
  2. Hero Metric: Oversized weight display (3.5rem Space Grotesk) with intentional
     margin bleed, subtle peach glow
  3. Stat Cards: Tonal-layered cards (no borders) showing BMI, streak, rank
  4. Weight Chart: Area chart with glass tooltip, warm peach fill
  5. Body Map: Anatomical silhouette with trained muscle highlights
  ```
- [x] Generate **Workout** screen with exercise grid, bottom-bar inputs, floating timer
- [x] Generate **Diet** screen with macro rings and food log cards
- [x] Download all generated HTML + screenshots to `.stitch/designs/` via `curl`
- [x] Review screens with user — iterate via `edit_screens` if needed
- [x] Use approved screens as visual reference during Phase 2–3 code implementation

---

## Phase 1 — Design Token Foundation

The entire CSS variable system must be rebuilt to match the Kinetic Elite spec. This phase touches `index.css` only — no component changes.

### 1.1 Replace Font Import
- [x] Remove `Bebas Neue` + `DM Sans` Google Fonts import
- [x] Add `Space Grotesk` (weights: 500, 700) + `Be Vietnam Pro` (weights: 400, 500, 600, 700)
- [x] Update `body { font-family }` to `'Be Vietnam Pro', sans-serif`

### 1.2 Replace Color Token System (Dark Theme)
- [x] Redefine `--bg` → `#131315` (was `#050506`)
- [x] Replace 3-tier surface (`--c1/c2/c3`) with 5-tier system:
  - `--surface`: `#131315`
  - `--surface-container-lowest`: `#0E0E10`
  - `--surface-container-low`: `#1A1A1D`
  - `--surface-container`: `#212124`
  - `--surface-container-high`: `#2B2B2E`
  - `--surface-container-highest`: `#353437`
  - `--surface-variant`: `#353437` (used at 60% opacity for glass)
- [x] Redefine orange accent tokens:
  - `--primary`: `#FFB59B` (peach — for text/icon accents)
  - `--primary-container`: `#F85F1B` (deep ember — for fills/CTAs)
  - `--on-primary`: `#FFFFFF`
  - `--signature-gradient`: `linear-gradient(135deg, #FFB59B, #F85F1B)` ("burning ember")
- [x] Redefine text color tokens:
  - `--on-surface`: `#EAEAF0` (primary text)
  - `--on-surface-variant`: `#E3BFB3` (secondary text — warm, NOT grey)
  - `--on-surface-dim`: `#6E6E76` (tertiary/metadata)
- [x] Redefine border tokens:
  - `--outline-variant`: `rgba(90, 65, 56, 0.15)` ("ghost border" — 15% opacity only)
  - Remove `--bd` and `--bd2` (solid borders are banned)
- [x] Redefine shadow tokens:
  - `--shadow-ambient`: `0 20px 40px rgba(0,0,0,0.4)` (diffused only)
  - `--glow-primary`: `0 0 20px rgba(255,181,155,0.10)` (LED emission)
  - Remove  `--shadow` and `--shadow-lg` (standard drops are banned)
- [x] Add glassmorphism tokens:
  - `--glass-bg`: `rgba(53, 52, 55, 0.60)`
  - `--glass-blur`: `blur(20px)`
  - `--glass-blur-sm`: `blur(12px)`

### 1.3 Replace Typography Scale
- [x] Remove `.bb` class (Bebas Neue reference)
- [x] Add new typography utility classes:

```css
.display-lg  { font-family: 'Space Grotesk', sans-serif; font-size: 3.5rem; font-weight: 700; line-height: 1; letter-spacing: -0.5px; }
.headline-lg { font-family: 'Space Grotesk', sans-serif; font-size: 2.0rem; font-weight: 700; line-height: 1.1; }
.headline-md { font-family: 'Space Grotesk', sans-serif; font-size: 1.5rem; font-weight: 700; line-height: 1.2; }
.title-lg    { font-family: 'Be Vietnam Pro', sans-serif; font-size: 1.375rem; font-weight: 600; }
.title-md    { font-family: 'Be Vietnam Pro', sans-serif; font-size: 1.125rem; font-weight: 600; }
.body-md     { font-family: 'Be Vietnam Pro', sans-serif; font-size: 0.875rem; font-weight: 400; line-height: 1.5; }
.label-md    { font-family: 'Be Vietnam Pro', sans-serif; font-size: 0.75rem; font-weight: 500; letter-spacing: 0.5px; text-transform: uppercase; }
```

### 1.4 Replace Separator Rules
- [x] Remove `.sep` class entirely
- [x] Remove `.row-sep` border-bottom rule
- [x] Remove `.dv` divider (line-based)
- [x] Add `.tonal-break` class that uses background-color shift instead of lines

### 1.5 Update Light Theme Tokens (Warm Beige Direction)
- [x] Rebase light theme to warm beige/cream palette instead of neutral white:
  - `--surface`: `#F5F0EB` (warm linen)
  - `--surface-container-lowest`: `#EDE7E0` (recessed warm)
  - `--surface-container-low`: `#FAF6F2` (lifted cream)
  - `--surface-container`: `#FFFFFF` (card white)
  - `--surface-container-high`: `#FFFFFF`
  - `--surface-container-highest`: `#FFFFFF`
- [x] Update accent colors to match the peach/ember palette in light context
- [x] Ensure "No-Line" rule also applies in light theme (tonal shifts, not borders)
- [x] Secondary text uses warm tones (e.g., `#7A6B62`) instead of cold greys

### 1.6 Motion & Animation Philosophy (NEW — Gap G3/G6)
Define the unified motion engine in `index.css` as CSS custom properties and keyframes.
- [x] Define spring-physics-style easing tokens:
  - `--ease-spring`: `cubic-bezier(0.175, 0.885, 0.32, 1.275)` (overshoot for interactive elements)
  - `--ease-smooth`: `cubic-bezier(0.4, 0, 0.2, 1)` (standard Material-like)
  - `--ease-decel`: `cubic-bezier(0, 0, 0.2, 1)` (entry)
  - `--ease-accel`: `cubic-bezier(0.4, 0, 1, 1)` (exit)
- [x] Add **staggered cascade reveal** keyframe for list/card mounting:
  ```css
  @keyframes cascadeIn {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .cascade-item { animation: cascadeIn 0.4s var(--ease-decel) both; }
  .cascade-item:nth-child(1) { animation-delay: 0ms; }
  .cascade-item:nth-child(2) { animation-delay: 60ms; }
  .cascade-item:nth-child(3) { animation-delay: 120ms; }
  /* ... up to n */
  ```
- [x] Add **perpetual pulse** keyframe for live indicators:
  ```css
  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50%      { opacity: 0.5; transform: scale(1.15); }
  }
  ```
- [x] Add **shimmer** keyframe for premium loading states:
  ```css
  @keyframes shimmer {
    0%   { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
  ```
- [x] **Performance constraint:** All animations must use ONLY `transform` and `opacity`. Never animate `top`, `left`, `width`, `height`, `margin`, or `padding`
- [x] Replace current `pgIn` / `pgOut` page transition keyframes with spring-eased variants

### 1.7 Anti-Pattern Enforcement List (NEW — Gap G4)
Add explicit CSS-level guardrails. These are documented in `.stitch/DESIGN.md` and enforced in Phase 5 audit.
- [x] Add comment block in `index.css` header:
  ```css
  /*
   * ─── KINETIC ELITE: BANNED PATTERNS ────────────────────────
   * 1. No 1px solid borders — use tonal shifts (No-Line Rule)
   * 2. No pure #000000 — use Obsidian Canvas (#131315) minimum
   * 3. No pure #FFFFFF for secondary text — use Warm Bone (#E3BFB3)
   * 4. No standard drop shadows — use ambient diffused only
   * 5. No sharp 90° corners — minimum 0.75rem (12px)
   * 6. No Bebas Neue or DM Sans — Space Grotesk + Be Vietnam Pro only
   * 7. No linear easing — use spring/cubic-bezier curves
   * 8. No animating layout properties (top/left/width/height)
   * 9. No neon/outer glow shadows — LED emission at 10% opacity only
   * 10. No oversaturated accents — max saturation 80%
   * ────────────────────────────────────────────────────────────
   */
  ```

### 1.8 Responsive Design Rules (NEW — Gap G5)
Add responsive tokens and rules to `index.css`.
- [x] Add `clamp()` typography scaling for display/headline classes:
  ```css
  .display-lg { font-size: clamp(2.5rem, 5vw, 3.5rem); }
  .headline-lg { font-size: clamp(1.5rem, 3vw, 2.0rem); }
  ```
- [x] Ensure body text minimum is `0.875rem` (14px) — never smaller
- [x] Add `min-height: 100dvh` rule (not `100vh`) for full-height sections (iOS Safari fix)
- [x] Ensure all interactive elements have minimum `44px` touch targets (already partially done — verify)
- [x] Add mobile-first collapse rule: all multi-column grids → single column below 768px (existing — verify coverage)
- [x] Verify no horizontal overflow on mobile — add `overflow-x: hidden` on `body` (existing — keep)

---

## Phase 2 — Core Component Reskin

All shared components in `SharedComponents.jsx` and `Layout.jsx` must be updated.

### 2.1 Card System
- [x] Remove `border: 1px solid var(--bd)` from `.card` class
- [x] Remove `::before` gradient pseudo-element
- [x] Replace `box-shadow: var(--shadow)` with `box-shadow: none` (tonal layering only)
- [x] Use `background: var(--surface-container-low)` on `--surface` pages to create depth
- [x] Add `.card-float` variant for floating elements using `box-shadow: var(--shadow-ambient)`
- [x] Remove `.card-p` class or merge into new system
- [x] Ensure all rounded corners stay within 12px–24px scale
- [x] Add **staggered cascade animation** to card lists (`.cascade-item` class from Phase 1.6)

### 2.2 Button System
- [x] `.btn-p`: Update gradient to `var(--signature-gradient)`, border-radius to `1.5rem` (24px), remove border
- [x] `.btn-p:hover`: Use orange glow (`var(--glow-primary)`) instead of transform lift
- [x] `.btn-g` (ghost button): Remove border, use `var(--surface-container-highest)` fill, white text
- [x] `.btn-d` (outline button): Replace solid border with ghost border at 20% opacity

### 2.3 Input System
- [x] Remove full border from `input, select, textarea`
- [x] Use `var(--surface-container-lowest)` as background
- [x] Add `border-bottom: 2px solid transparent` (default)
- [x] On focus: `border-bottom-color: var(--primary-container)` — no box border, no focus ring glow
- [x] Update `label` styles to use `.label-md` class

### 2.4 Modal System
- [x] `.mo` (overlay): Keep `backdrop-filter: blur(16px)`, add surface-dim for background scrim
- [x] `.md` (modal card): Apply glassmorphism — `background: var(--glass-bg)`, `backdrop-filter: var(--glass-blur)`, remove border
- [x] Add rounded corners at 24px (already 28px — bring down to 24px to match scale)

### 2.5 Navigation — Sidebar
- [x] Remove all `border-right`, `borderBottom`, `borderTop` on sidebar dividers
- [x] Replace with tonal background shifts between sections
- [x] Apply glassmorphism to sidebar: `background: var(--glass-bg)`, `backdrop-filter: var(--glass-blur)`
- [x] Update `.ni.act` (active nav item): Use `--glow-primary` for active state
- [x] Replace `Bebas Neue` branding in header with `Space Grotesk` `.headline-md`

### 2.6 Navigation — Bottom Nav (Mobile)
- [x] Apply glassmorphism: `background: var(--glass-bg)`, `backdrop-filter: var(--glass-blur)`
- [x] Remove `border-top: 1px solid`
- [x] Update "More" sheet to also use glassmorphism + remove border

### 2.7 Tags & Chips
- [x] Update `.tag` to use `var(--surface-container-low)` background
- [x] For selected state: add ghost border with `var(--primary)` at 20% opacity
- [x] Use `.label-md` for text styling

### 2.8 Toast System
- [x] Apply glassmorphism to toast containers
- [x] Remove explicit borders
- [x] Maintain backdrop-filter blur (already has blur — keep)
- [x] Use spring-eased entry animation (`var(--ease-spring)`) instead of linear/ease

### 2.9 StatCard Component
- [x] Replace `className="bb"` with `className="display-lg"` for hero numbers
- [x] Replace icon container orange glow with LED emission glow (`box-shadow: var(--glow-primary)`)
- [x] Remove card border (handled by Phase 2.1)
- [x] Update secondary text color from `var(--t2)` to `var(--on-surface-variant)` (#E3BFB3)

### 2.10 PageHeader Component
- [x] Replace `className="bb pt"` with `className="headline-lg"`
- [x] Replace `.abar` accent bar with a subtle gradient underline using `--signature-gradient`
- [x] Update subtitle color to `var(--on-surface-variant)`

### 2.11 EmptyState Component
- [x] Replace `className="bb"` with `className="headline-md"`
- [x] Replace dashed border with tonal card background
- [x] Apply LED glow to icon container

### 2.12 ConfirmDialog
- [x] Replace `className="bb"` with `className="headline-md"`
- [x] Apply glassmorphism to modal content

### 2.13 ScrollPicker
- [x] Replace `fontFamily: "'Bebas Neue'"` with `'Space Grotesk'`
- [x] Update fade gradients to use new surface tokens
- [x] Replace `.picker-wrap` border with ghost border or remove

---

## Phase 3 — Page-Level Reskin

Each page must be audited and updated to comply with the new design language.

### 3.1 DashboardPage
- [x] Replace all `className="bb"` with appropriate token class (`display-lg`, `headline-lg`, etc.)
- [x] Replace all `border-bottom`, `borderBottom` inline styles with tonal shifts or whitespace
- [x] Update all `color: 'var(--t2)'` → `color: 'var(--on-surface-variant)'`
- [x] Update all `background: 'var(--c1)'` → `background: 'var(--surface-container-low)'`
- [x] Update all `background: 'var(--c2)'` → `background: 'var(--surface-container)'`
- [x] Update weight chart tooltip to use glassmorphism
- [x] Replace flat progress bars with **Progress Orbs** (concentric circles) for volume visualization (**Dashboard only** — other pages keep flat bars for space efficiency)
- [x] Add **Pulse indicator** next to active workout sessions
- [x] Make hero weight number use `display-lg` (3.5rem) with **intentional editorial bleed** — let numbers overflow container margins by ~10-15% for a high-fashion HUD feel

### 3.2 WorkoutPage
- [x] Replace all borders with tonal shifts
- [x] Update exercise row grid (`.ex-r`) separators — remove `row-sep`, use spacing
- [x] Replace `bb` class references with Space Grotesk classes
- [x] Update input fields to bottom-bar style
- [x] Apply glassmorphism to floating workout timer (if present)

### 3.3 SplitsPage
- [x] Replace split card borders with tonal layering
- [x] Update split icons container with LED glow on active
- [x] Replace all typography references

### 3.4 DietPage
- [x] Replace all borders and separators
- [x] Update stat displays with new typography scale
- [x] Replace calorie log card borders with tonal backgrounds

### 3.5 ProfilePage
- [x] Replace all borders
- [x] Update form inputs to bottom-bar style
- [x] Update toggle components with new accent colors

### 3.6 MuscleMapPage
- [x] Replace all typography references
- [x] Update muscle group chips to new tag system
- [x] Replace card borders with tonal shifts

### 3.7 ProgressPage
- [x] Replace progress bars with Progress Orbs
- [x] Update chart tooltips to glassmorphism
- [x] Replace all borders and separators

### 3.8 WeightLogPage & MeasurementsPage
- [x] Replace borders, update typography, apply tonal cards
- [x] Update input styles to bottom-bar

### 3.9 WorkoutHistoryPage
- [x] Replace all borders with tonal layering
- [x] Update history card styles

### 3.10 ContactPage
- [x] Apply glassmorphism to contact form card
- [x] Update form inputs to bottom-bar style

### 3.11 AuthModal
- [x] Apply glassmorphism to auth modal
- [x] Update input fields to bottom-bar style
- [x] Update Google button styling

---

## Phase 4 — New Custom Components

### 4.1 Progress Orbs (Dashboard Only)
- [x] Create `ProgressOrb` component — concentric SVG circles with `tertiary_container` gradients
- [x] Use on **Dashboard only** — other pages keep flat `pbar` for space efficiency
- [x] Animate fill on mount with a smooth arc transition using `var(--ease-spring)`
- [x] Add a perpetual subtle shimmer micro-animation on the filled arc

### 4.2 Pulse Indicator
- [x] Create `PulseIndicator` component — small `primary`-colored dot with CSS `@keyframes pulse` animation
- [x] Add next to "Live Workout" text / active workout session indicator
- [x] Use `animation: pulse 2s var(--ease-smooth) infinite` — spring feel, not linear
- [x] This is a **perpetual micro-interaction** per taste-design §8

### 4.3 Glassmorphic Tooltip
- [x] Create `GlassTooltip` component for Recharts chart tooltips
- [x] Apply `backdrop-filter: var(--glass-blur-sm)`, `background: var(--glass-bg)`, no border
- [x] Use in all chart `<Tooltip content={...} />` slots

### 4.4 Skeleton Shimmer Loader (NEW — Gap G6 alignment)
- [x] Update existing `Skeleton` component to use the new `shimmer` keyframe from Phase 1.6
- [x] Ensure skeleton dimensions match actual layout dimensions (taste-design §5: no generic circular spinners)
- [x] Use `background: linear-gradient(90deg, var(--surface-container-low) 25%, var(--surface-container-high) 50%, var(--surface-container-low) 75%)` with `background-size: 200%`

---

## Phase 5 — Polish & Verification

### 5.1 Audit: No-Line Rule
- [x] `grep` entire codebase for `border:`, `border-bottom:`, `border-top:`, `border-left:`, `border-right:` (inline styles)
- [x] `grep` for `1px solid` in index.css
- [x] Remove or replace every instance with tonal shift or whitespace
- [x] Exception: Ghost borders at 15% opacity are allowed for accessibility

### 5.2 Audit: Typography Migration
- [x] `grep` for `Bebas Neue` — must be zero matches
- [x] `grep` for `DM Sans` — must be zero matches
- [x] `grep` for `className="bb"` — must be zero matches
- [x] `grep` for `.bb` in CSS — must be zero matches

### 5.3 Audit: Old Token References
- [x] `grep` for `var(--c1)`, `var(--c2)`, `var(--c3)` — must be zero matches
- [x] `grep` for `var(--bd)` and `var(--bd2)` — must be zero matches
- [x] `grep` for `var(--t2)`, `var(--t3)`, `var(--t4)` — must be zero matches
- [x] `grep` for `var(--shadow)` and `var(--shadow-lg)` — must be zero matches

### 5.4 Audit: Corner Radius
- [x] `grep` for `border-radius` values — all must be within 12px–24px scale (0.75rem–1.5rem)
- [x] No sharp 90° corners anywhere

### 5.5 Audit: Anti-Patterns (NEW — Gap G4)
- [x] `grep` for `#000000` or `#000` — must be zero matches (pure black banned)
- [x] `grep` for `linear` in animation/transition — verify no linear easing (spring/cubic-bezier only)
- [x] `grep` for `animate.*top\|animate.*left\|animate.*width\|animate.*height` — must be zero (layout properties banned)
- [x] `grep` for `100vh` — must be zero (use `100dvh` for iOS Safari)
- [x] Verify all accent colors have saturation below 80%

### 5.6 Audit: Motion & Stagger (NEW — Gap G3/G6)
- [x] Verify all list/card groups use `.cascade-item` staggered entry
- [x] Verify no components mount instantly without animation
- [x] Verify PulseIndicator has perpetual infinite-loop animation
- [x] Verify all animations use only `transform` and `opacity` (no layout properties)
- [x] Check spring easing is used for interactive elements (buttons, toggles)

### 5.7 Audit: Responsive (NEW — Gap G5)
- [x] Test on 375px viewport — verify single-column collapse
- [x] Verify no horizontal scroll on any page at 375px
- [x] Verify all tap targets ≥ 44px
- [x] Verify `clamp()` is used for display/headline typography
- [x] Verify body text never drops below 14px

### 5.8 Visual Verification
- [x] Run `npm run dev` and verify each page:
  - [x] Dashboard — hero numbers at 56px, no borders, tonal cards, progress orbs, staggered card reveal
  - [x] Workout — exercise grid uses spacing not lines, inputs have bottom-bar focus
  - [x] Splits — cards float with tonal layering, no borders, cascade entry animation
  - [x] Diet — stat cards use new typography, warm secondary text
  - [x] Profile — inputs with bottom-bar, no border boxes
  - [x] Muscle Map — chips use tonal styling, no sharp borders
  - [x] History — history rows separated by whitespace, not lines
  - [x] Modals — glassmorphism on overlay and content card
  - [x] Bottom Nav (mobile) — glass effect, no top border
  - [x] Sidebar (desktop) — glass effect, no section borders
- [x] Verify light theme parity (warm beige — all token changes reflected)
- [x] Test on mobile viewport (375px) — ensure touch targets and spacing are maintained
- [x] Screen reader test — ensure ghost borders provide sufficient visual separation for accessibility

### 5.9 Stitch Cross-Reference (NEW — Gap G7/G9)
- [x] Compare implemented pages side-by-side with Stitch-generated reference screens from Phase 0.2
- [x] Ensure coded output matches the approved Stitch mockups in: color, typography, spacing, motion
- [x] Document any intentional deviations in `.stitch/DEVIATIONS.md`

---

## Estimated Scope

| Phase | Files Touched | Complexity | Risk |
|-------|:------------:|:----------:|:----:|
| **Phase 0** — Stitch Foundation | 1 new (`.stitch/DESIGN.md`) + Stitch MCP screens | Medium | Low |
| **Phase 1** — Tokens | 1 (`index.css`) | High | Low |
| **Phase 2** — Shared Components | 3 (`index.css`, `SharedComponents.jsx`, `Layout.jsx`) | High | Medium |
| **Phase 3** — Page Reskin | 12 page files | High | Medium |
| **Phase 4** — New Components | 4 new/updated files | Medium | Low |
| **Phase 5** — Audit & Polish | All files | Medium | Low |

**Total affected files:** ~18 files + `.stitch/` directory
**New files:** 4 (ProgressOrb, PulseIndicator, GlassTooltip, Skeleton update) + `.stitch/DESIGN.md`
**Deleted CSS rules:** ~15 (sep, row-sep, dv, bb, abar, old shadows, old borders)
**New CSS rules:** ~20 (motion keyframes, cascade stagger, clamp() typography, anti-pattern guardrails)

---

## Resolved Decisions

1. ✅ **Light theme → Warm beige/cream** — rebased to linen/cream palette, not neutral white
2. ✅ **Iron League adapts** — rank colors shift to new peach/ember palette for consistency
3. ✅ **Progress Orbs → Dashboard only** — other pages keep flat `pbar` for space efficiency
4. ✅ **Typography bleeds → Confirmed** — editorial-style intentional overflow on hero numbers (~10-15% margin bleed)

---

## Phase 6 — Advanced Stitch UI Patterns Integration (NEW)

Based on the high-fidelity "Elite Dashboard" mockup generated in Stitch, the following specific patterns and elements need to be integrated into our existing components to reach full 1:1 parity with the "Obsidian Performance" vision:

### 6.1 Unified Glassmorphism
- **Pattern:** Stitch uses `rgba(53, 52, 55, 0.6)` with `backdrop-filter: blur(20px)` heavily for structural cards (e.g., `.glass-card`).
- **Plan:** Upgrade our `.card` baseline in `index.css` (or create a specific `.glass-card` utility) to apply this exact frosted texture to major dashboard cards, replacing opaque `surface-container` fills where applicable to let the deep canvas show through.

### 6.2 "Ember Glow" & Signature Gradients
- **Pattern:** High-intensity elements (like the BMI ring or selected states) use a specific shadow: `box-shadow: 0 0 20px rgba(248, 95, 27, 0.2)` (`.ember-glow`). Typography also uses `bg-clip-text text-transparent bg-gradient-to-r from-primary-container to-tertiary-container`.
- **Plan:**
  - Create the `.ember-glow` utility class in `index.css` to standardize this exact shadow/glow.
  - Apply the text-gradient pattern to the "Welcome Back" user name on the Dashboard.
  - Apply the text-gradient or ember-glow to hero metrics (like the BMI number or streak count).

### 6.3 Track-Tight / Tracking-Widest Typography
- **Pattern:** Stitch utilizes extreme letter-spacing contrast. Display numbers use `tracking-tighter` (`-0.05em`) while small labels/subheaders use `tracking-widest` (`0.1em`) with uppercase formatting.
- **Plan:**
  - Update `.display-lg` and `.headline-lg` in `index.css` to enforce `letter-spacing: -0.04em`.
  - Update `.label-md` and subheader inline styles to use `letter-spacing: 0.1em` with `text-transform: uppercase`.

### 6.4 Concentric Ring Visualization
- **Pattern:** Instead of flat bars for stats, Stitch uses a layered concentric ring system (e.g., the BMI indicator): an inner ring (`border-4 border-surface-container-lowest`), an outer active ring (`border-4 border-primary-container`), and an `.ember-glow`.
- **Plan:** Refactor the BMI widget and the `ProgressOrb` component to use this exact CSS border-ring setup (or SVG equivalent with matching stroke-width and drop-shadows) rather than simple overlapping circles.

### 6.5 Horizontal Gradient Progress Bars
- **Pattern:** Activity/Hydration sub-cards use ultra-thin (`h-1`) progress bars with `bg-gradient-to-r from-primary-container to-tertiary-container` inside a `rounded-full` container.
- **Plan:** Update our `pbar-fill` style in `index.css` to use this exact gradient mix instead of the solid or simple two-stop gradient. Apply this pattern to the Daily Goals or weekly volume bars on the Dashboard.

### 6.6 Asymmetric Hero Imagery
- **Pattern:** The "Live Suggestion" block uses a dark, grayscale background image overlaid with a bottom-to-top transparency mask, floating text, and a pulsing dot to create a highly premium, editorial feel.
- **Plan:** Bring this aesthetic to the "Active Split" or "Next Workout" card. We will incorporate a subtle, dark-theme relevant background image (at 10–20% opacity with grayscale and gradient overlay) behind the active workout summary.

---

## Phase 7 — Active Workout Session Reskin (Stitch: Active Workout Screen)

> Source: Stitch-generated "Active Workout" mockup for the `WorkoutPage.jsx` active session view (`if (session)` branch).
> **Status:** Planning — do not implement until approved.
> **Files affected:** `WorkoutPage.jsx` only. No changes to business logic — purely visual upgrades.

### Gap Analysis: Current vs Stitch Target

| # | Gap | Current State | Stitch Target |
|---|-----|--------------|---------------|
| W1 | **Rest Timer** | Small modal with SVG ring | Full-width hero section with `5rem–7rem` Space Grotesk countdown, ambient blob bg |
| W2 | **Exercise Header** | `headline-md` name + small muscle chip | `2xl font-headline` name + `.label-md` subline `"Muscle • Focus Type"` in `tracking-widest` |
| W3 | **Set Row Grid** | 4-col `.ex-r` grid: `SET \| REPS \| KG \| DONE` | 12-col CSS grid: `col-span-2/4/4/2` with separate `lbs` and `Reps` columns + rounded full-row card |
| W4 | **"Add Set" Button** | Small `+ Set` btn in exercise header | Full-width dashed### 7.1 Hero Rest Timer Redesign
**Replace the modal-based timer with an inline hero section at the top of the active session.**
- [x] Remove the `Portal`-based `RestTimer` overlay
- [x] Add a new `HeroRestTimer` section rendered **inside** the session view, above the exercise list
- [x] Style: `rounded-2xl bg-surface-container-low p-8`, relative overflow for the ambient blob
- [x] Add ambient blob background: `absolute -top-12 -right-12 w-48 h-48 bg-primary-container/5 rounded-full blur-3xl` (CSS via inline style)
- [x] Timer display: `.display-lg` at `5rem` (or `clamp(4rem, 12vw, 7rem)`) with Space Grotesk, `tracking-tighter`
- [x] Add `+30s` ghost pill button and `Skip` ember-gradient pill button in a flex row below the number
- [x] Restore audio beep and `onDone` callback from the existing `RestTimer` component
- [x] Timer still auto-starts when a set is marked done (existing `upd()` logic — keep as-is)
- [x] Add a `label-md` session name above the timer: `"Active Session: {session.day.name}"` with a `PulseIndicator` dot

### 7.2 Exercise Block Header Upgrade
**Upgrade each exercise section header to match the Stitch 2xl + subline format.**
  - [x] Replace `headline-md` exercise name with `font-size: 1.5rem; font-weight: 700; letter-spacing: -0.04em` (or `.headline-md` with explicit override) — `text-on-surface`
  - [x] Add a `.label-md` subline below the name: `"{ex.muscle} • {ex.focusType}"` (e.g., `"Chest • Primary Strength"`)
    - Map `ex.type` / `ex.repsRange` to a focus label: `strength` if repsRange `1-5`, `hypertrophy` if `6-12`, `endurance` if `12+`
  - [x] Move the `+ Set` button to the right of the header block (already there — keep position consistent)
  - [x] Add an info icon (`ℹ`) button to the right of the header for future exercise info modal

### 7.3 Set Row Grid Redesign
**Redesign the set rows from a 4-col `.ex-r` grid to a styled 12-column-equivalent card layout.**
- [x] Replace `.ex-r` with a new `.set-row` grid: `grid-template-columns: 34px 1fr 1fr 44px`
- [x] Wrap each set row in a `rounded-xl bg-surface-container-low p-3` card div with `hover:bg-surface-container` transition
- [x] Column header row: same 4 columns, styled with `var(--outline)` color (#aa8a7f) and `letter-spacing: 0.1em uppercase` — use `color: 'var(--outline)'` inline
- [x] Completed sets: reduce opacity to `0.6` and add a subtle strikethrough or completed accent (existing fade — keep)
- [x] Add `.set-row` to `index.css`:
  ```css
  .set-row { display: grid; grid-template-columns: 34px 1fr 1fr 44px; gap: 8px; align-items: center; }
  ```

### 7.4 "Add Set" Full-Width Dashed Button
**Replace the small header `+ Set` button with a full-width dashed border button below the set list.**
- [x] Remove the `+ Set` button from the exercise header row
- [x] Add a full-width button below `{ex.sets.map(...)}`:
  ```jsx
  <button className="add-set-btn" onClick={() => addS(ei)}>+ Add Set</button>
  ```
- [x] Style `.add-set-btn` in `index.css`:
  ```css
  .add-set-btn {
    width: 100%; padding: 12px; margin-top: 10px; border-radius: 12px;
    border: 1.5px dashed var(--outline-variant); background: transparent;
    font-family: 'Be Vietnam Pro', sans-serif; font-size: 0.75rem; font-weight: 500;
    letter-spacing: 0.1em; text-transform: uppercase; color: var(--on-surface-dim);
    cursor: pointer; transition: all .2s var(--ease-smooth);
  }
  .add-set-btn:hover { border-color: var(--primary-container); color: var(--primary); }
  ```

### 7.5 "Live Tracking" Fixed Floating Pill
**Add a fixed bottom-right live session indicator when a workout is active.**
- [x] Render conditionally when `session` is truthy (inside active session view)
- [x] Use `Portal` to render at document root level
- [x] Structure:
  ```jsx
  <div style={{ position: 'fixed', bottom: 88, right: 24, zIndex: 9998,
    display: 'flex', alignItems: 'center', gap: 8,
    background: 'var(--glass-bg)', backdropFilter: 'var(--glass-blur-sm)',
    padding: '8px 16px', borderRadius: 999,
    border: '1px solid rgba(248, 95, 27, 0.2)' }}>
    <PulseIndicator color="var(--primary-container)" />
    <span className="label-md" style={{ color: 'var(--on-surface)', fontSize: '10px' }}>Live tracking</span>
  </div>
  ```
- [x] Ensure it does not overlap the FAB finish button — adjust `bottom` offset as needed

### 7.6 Finish / Discard Section
**Redesign the finish section to include both Finish and Discard, styled per Stitch spec.**
- [x] Keep the existing `finishBtnRef` intersection observer logic
- [x] Wrap Finish + Discard in a section with `paddingTop: 32`
- [x] `Finish Workout` button: use `.btn-p` with `ember-gradient` style (already has it), full width, `padding: 20px`, `fontSize: 18`, `borderRadius: 16`, `letter-spacing: 0.1em`
- [x] Add `Discard Workout` as a ghost text-only button below, styled as a danger link:
  ```jsx
  <button onClick={() => { setSession(null); setTimer(null); }}
    style={{ width: '100%', marginTop: 14, background: 'none', border: 'none',
             padding: '12px', cursor: 'pointer', fontSize: '0.75rem',
             fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 500,
             letterSpacing: '0.1em', textTransform: 'uppercase',
             color: 'var(--error, #ffb4ab)', opacity: 0.8, transition: 'opacity .2s' }}>
    Discard Workout
  </button>
  ```
- [x] Remove the existing `← Back` button from the session header (replaced by `Discard` at bottom)ick={() => { setSession(null); setTimer(null); }}
    style={{ width: '100%', marginTop: 14, background: 'none', border: 'none',
             padding: '12px', cursor: 'pointer', fontSize: '0.75rem',
             fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 500,
             letterSpacing: '0.1em', textTransform: 'uppercase',
             color: 'var(--error, #ffb4ab)', opacity: 0.8, transition: 'opacity .2s' }}>
    Discard Workout
  </button>
  ```
- [x] Remove the existing `← Back` button from the session header (replaced by `Discard` at bottom)

### 7.7 Header Color Adjustment (Column Labels)
**Change the column header row color from `on-surface-dim` to the softer `outline` token.**
- [x] Update the 4-column header row (`SET / REPS / KG / DONE`) to use `color: 'var(--outline)'` for a lower-contrast HUD feel matching the Stitch spec

---

### Priority Order
1. **7.4** Add Set dashed button (simplest, highest visual impact)
2. **7.7** Column header color (trivial)
3. **7.2** Exercise block header upgrade
4. **7.3** Set row grid redesign
5. **7.6** Finish/Discard section
6. **7.5** Live tracking pill
7. **7.1** Hero rest timer (most complex — last)

---

## Phase 8 — Workout Analytics Page Redesign (ProgressPage → Analytics)

> **Source reference:** Provided "Kinetic Elite" analytics HTML mockup — `BENCH PRESS / Performance Analytics` screen.
> **Status:** Planning — do not implement until approved.
> **Files affected:** `ProgressPage.jsx` only (rename display title, not file). No changes to backend logic.
> **Theme:** Inherit the full Kinetic Elite token system (Space Grotesk + Be Vietnam Pro, Obsidian Canvas, Ember Peach/Burning Ember palette, glassmorphism) already defined in Phases 1–6.

### What We Keep (Unchanged)
- All state variables: `ss` (split), `sd` (day/split dropdown), `se` (exercise) — keep exactly as-is
- All `useMemo` calculations: `cd`, `pr`, `est1rm`, `weeklySummary`, `monthlySummary`, `exN`
- All Recharts chart instances (AreaChart, BarChart, LineChart) — layout changes only, not data logic
- The `best1RMFromSets` / `calc1RM` utility imports
- Split → Day → Exercise dropdown cascade logic
- Dark mode / Light mode theme toggle support (already globally managed by `data-theme` attribute)

### Pre-Requisite: Extend `cd` Data Shape
> **Why:** Several sub-tasks (8.3, 8.5, 8.6) need data that the current `cd` entries don't carry.
> The `cd` `useMemo` callback currently stores `date: fmt(log.date)` — a formatted display string
> like `"31 Mar"`. The raw ISO date is lost, making it impossible to show "Achieved: Oct 14, 2023"
> or derive month/day numbers for the session log date boxes.

- [x] Add `rawDate: log.date` to each `cd` entry (preserves the original ISO string)
- [x] Add `dayName: days.find(d => d.id === log.dayId)?.name || 'Session'` to each `cd` entry
- [x] Final `cd` shape per entry:
  ```js
  { date: fmt(log.date), rawDate: log.date, dayName, maxWeight, volume, avgReps, sets, est1rm }
  ```

---

### 8.1 Rename Page Title (Display Only)
- [x] Change the `<PageHeader title="Progress Charts" sub="Track your strength gains" />` to:
  - Title: `"Workout Analytics"` (matches the new screen identity)
  - Sub: `"Performance data per exercise"` (more precise for analytics context)
- [x] ~~Add a super-label above the headline~~ — **Removed:** the `"Performance Analytics"` super-label lives in the hero exercise section (8.2) only, to avoid duplication

---

### 8.2 Hero Exercise Name Display
**When an exercise is selected (`se` is set), replace the plain `headline-md` exercise name with an asymmetric editorial hero title.**

- [x] Wrap the exercise name in a new hero section (replaces the current plain `<div className="headline-md">`):
  ```jsx
  <section style={{ marginBottom: 32 }}>
    <span className="label-md" style={{ color: 'var(--primary)', display: 'block', marginBottom: 8 }}>
      Performance Analytics
    </span>
    <h2 style={{
      fontFamily: "'Space Grotesk', sans-serif",
      fontSize: 'clamp(2.5rem, 8vw, 4.5rem)',
      fontWeight: 700,
      letterSpacing: '-0.04em',
      lineHeight: 1,
      color: 'var(--on-surface)',
      textTransform: 'uppercase',
    }}>
      {/* Split exercise name into two lines — guard single-word names */}
      {se.includes(' ')
        ? <>{se.split(' ').slice(0, Math.ceil(se.split(' ').length / 2)).join(' ')}
            <br />
            <span style={{ color: 'var(--primary-container)' }}>
              {se.split(' ').slice(Math.ceil(se.split(' ').length / 2)).join(' ')}
            </span>
          </>
        : se  /* Single-word names render on one line — no empty <br/> */
      }
    </h2>
  </section>
  ```
- [x] Only render this hero section when `se` is set — fallback to the empty state path as before
- [x] On mobile (< 480px), reduce to `clamp(2rem, 10vw, 3rem)` via responsive CSS or inline clamp

---

### 8.3 Key Stats Bento Grid (Top Stat Cards)
**Replace the current `StatCard` row with a bento-style 3-column grid matching the reference's 1RM / Max Weight / Total Sets cards.**

- [x] Render the bento grid when `se && cd.length > 0`:
  ```
  Grid layout: 3 columns on md+, 1 column on mobile
  Cards use: bg-surface-container-low, rounded-2xl (1.5rem), no border
  ```
- [x] **Card 1 — Estimated 1RM** (Primary accent card):
  - Left border accent: `border-left: 4px solid var(--primary)` — the only border allowed (accent rule exception)
  - Super-label: `"ESTIMATED 1RM"` in `.label-md`
  - Hero number: `est1rm` value in `.display-lg` (Space Grotesk, ~3.5rem)
  - Unit: `"KG"` in `on-surface-variant`, `font-bold`
  - Trend: Pull from `cd` — compare last value to first value. Show `▲ +X kg vs first session` in `var(--success)` or `▼` in `var(--danger)`
  - ⚠️ **Token check:** verify `--success` and `--danger` survive the Phase 1 token migration — they're semantic colors not part of the M3 surface system. If removed, re-add as `--success: #51CF66` / `--danger: #FF6B6B` in the new token set

- [x] **Card 2 — Personal Record (Max Weight)**:
  - Super-label: `"PERSONAL RECORD"` in `.label-md`
  - Hero number: `pr` value in `.display-lg`
  - Unit: `"KG"`
  - Sub-label: `"Achieved: {date of session with max weight}"` — use `cd.find(d => d.maxWeight === pr)?.rawDate` (requires the `rawDate` field from Pre-Requisite above)
  - No left border

- [x] **Card 3 — Total Sessions**:
  - Super-label: `"TOTAL SESSIONS"` in `.label-md`
  - Hero number: `cd.length` in `.display-lg`
  - Unit: `"SESSIONS"`
  - Sub-label: Pull `monthlySummary.avgPerWeek` → `"~{avg} per week"` 
  - No left border

- [x] Apply `cascade-item` staggered animation (Phase 1.6) to the 3 cards

---

### 8.4 Volume Trend Chart (Primary Chart — Hero Section)
**Elevate the Volume (reps × kg) BarChart to a full-width hero section with a premium glass card treatment.**

- [x] Move the `volume` bar chart out of the 2-column grid and into a standalone full-width section above the chart grid
- [x] Wrap in a `rounded-[2rem] bg-surface-container-low p-8 shadow-2xl overflow-hidden` card (matching the reference's `rounded-[2rem]` section)
- [x] **Card header row:**
  - Left: `"VOLUME TREND"` in `.headline-md`, Space Grotesk — plus a sub-label `"Total load lifted per session"` in `on-surface-variant`
  - Right: Time range pill buttons `[1M] [3M] [6M]` — visual only for now (state wiring is a future task; default shows all `cd` data)
  - **Default active pill:** `1M` starts with the active style; `3M` and `6M` are inactive
  - Active pill style: `bg-surface-container-highest rounded-lg px-3 py-1 text-xs font-bold`
  - Inactive pill style: `text-on-surface-variant rounded-lg px-3 py-1 text-xs font-bold` (no bg fill)

- [x] **Chart upgrades (BarChart for volume):**
  - Use `fill="var(--primary-container)"` (Burning Ember `#F85F1B`) for bars instead of primary peach
  - Bar radius: `[8, 8, 0, 0]`
  - CartesianGrid: `strokeDasharray="3 3"`, stroke `var(--surface-container-highest)`, `vertical={false}` — keep
  - X/Y axis tick styling: `fill: 'var(--on-surface-variant)'`, `fontSize: 10`, `fontWeight: 600`
  - **Glassmorphic Tooltip:** Replace plain `contentStyle` with `.glass-tooltip` approach:
    ```
    contentStyle={{ background: 'var(--glass-bg)', backdropFilter: 'blur(12px)', border: 'none', borderRadius: 12, fontSize: 12, color: 'var(--on-surface)', fontWeight: 600 }}
    ```
  - Height: `h-64` (256px) — larger than current 180px to make the hero chart prominent
  - Add X-axis date labels at the bottom in `tracking-widest uppercase text-[10px] on-surface-variant/40` style (already handled by XAxis, just verify tick formatting via `fmt()`)

---

### 8.5 Personal Best Glow Card + Focus Groups
**Add a premium PB highlight card to the left column (below the bento grid), matching the reference's `glow-primary` pattern.**

- [x] Render only when `se && cd.length > 0`
- [x] Two-column layout (below chart): `lg:grid-cols-5` — Left col `lg:col-span-2`, Right col `lg:col-span-3`
- [x] **Personal Best card** (`lg:col-span-2`):
  ```
  bg: var(--surface-container-highest)
  border: 1px solid rgba(255, 181, 155, 0.2)  [ghost border exception — low opacity]
  box-shadow: var(--glow-primary)  [LED emission at 10%]
  padding: 2rem
  border-radius: 2rem
  overflow: hidden, position: relative
  ```
  - Background watermark icon: absolute `workspace_premium` Material Symbol at `opacity: 0.10`, positioned `-right-4 -top-4 text-9xl`
  - Super-label: `"Personal Best"` in `.label-md`, `color: var(--primary)`, `letterSpacing: '0.2em'`, `marginBottom: 24`
  - Hero number: `pr` in `.display-lg` (clamp `3rem–4rem`), `color: var(--on-surface)`, `letterSpacing: '-0.04em'`
  - Sub-label: Best set details — derive from `cd`: `const pbSession = cd.find(d => d.maxWeight === pr)`, then show `"{pbSession.avgReps} avg reps · {pbSession.sets} sets"` (not `"{sets} reps · {sets} sets"` — that was a copy-paste error)
  - **Date achieved row** (bottom of card):
    - Left: `"Date Achieved"` label (`.label-md` 10px) + formatted date from `pbSession.rawDate` (use `new Date(pbSession.rawDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })` for full format like `"October 14, 2023"`)
    - Right: Share icon button — `w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary` (Material Symbols `share` icon)

- [x] **Focus Groups card** (below PB card, same `lg:col-span-2`):
  - `bg: var(--surface-container-low)`, `padding: 1.5rem`, `border-radius: 1.5rem`
  - Super-label: `"Focus Groups"` in `.label-md`, `marginBottom: 16`
  - **Data source:** Look up the selected exercise in the active split's days:
    ```js
    const exDef = split?.days.flatMap(d => d.exercises).find(e => e.name === se);
    const primaryMuscle = exDef?.primaryMuscle || exDef?.muscle || null;
    const secondaryMuscles = exDef?.secondaryMuscles || [];
    ```
    ⚠️ `exN` is just a list of exercise name strings — it has no muscle data. The lookup must go through `split.days[].exercises[]` which carries `muscle`, `primaryMuscle`, and `secondaryMuscles` fields.
  - If `primaryMuscle` is found → render as primary chip; each `secondaryMuscles` entry → secondary chip. If no match (exercise only in logs, not in current split) → show a single `"General"` placeholder chip
  - Primary chip style: `bg-surface-container-highest rounded-full text-[10px] font-bold text-primary uppercase tracking-wider px-3 py-1`
  - Secondary chip style: same but `text-on-surface-variant`

---

### 8.6 Recent Sessions Log (Right Column)
**Replace / supplement the chart grid with a session log list matching the reference's "RECENT SESSIONS" pattern.**

- [x] In the right `lg:col-span-3` column, render the last 5 sessions from `cd` (sorted by date desc)
- [x] **Section header:**
  - Left: `"RECENT SESSIONS"` in `.headline-md`
  - Right: `"View All"` text-link style in `text-primary text-xs font-bold underline cursor-pointer`
- [x] **Session row card** (per `cd` entry):
  ```
  bg: var(--surface-container-low)
  padding: 20px
  border-radius: 1.5rem   // rounded-2xl
  hover: bg-surface-container-high
  transition: background 0.2s var(--ease-smooth)
  ```
  - Left cluster:
    - Date box: `w-12 h-12 bg-surface-container-highest rounded-xl` — parse `entry.rawDate` to render month abbr (top, 10px, `on-surface-variant`) via `new Date(entry.rawDate).toLocaleDateString('en-US', { month: 'short' })`, and day number (bottom, 18px bold, `on-surface`) via `new Date(entry.rawDate).getDate()`
    - Text block: Session name from `entry.dayName` (populated via Pre-Requisite `cd` extension — falls back to `"Session"`) + `"{sets} sets · {volume.toLocaleString()} kg volume"` in `on-surface-variant text-xs`
  - Right cluster:
    - Top: `"{maxWeight} × {avgReps}"` in `.headline-md` — Space Grotesk, `font-bold`
    - Badge: If this row is the PB session (`entry.maxWeight === pr`) → `"New PB"` in `text-primary uppercase text-[10px] font-bold tracking-widest`. If most recent (index 0 in reversed list) → `"Latest"` in `text-green-500`. Otherwise `"Session"` in `on-surface-variant`
- [x] Apply `cascade-item` stagger to each session row

---

### 8.7 Secondary Charts Section (Collapsed Grid)
**Keep the `est1rm` Area chart and `avgReps` Line chart in a 2-column subordinate grid below the session log.**

- [x] Move this grid below the 5-column layout (PB card + session log)
- [x] Grid: `grid-cols-1 md:grid-cols-2 gap-4`
- [x] Card wrapper: `bg-surface-container-low rounded-2xl p-6` — no border
- [x] Chart header uses `.label-md` + `<TrendingUp size={14} color="var(--primary)" />` icon inline
- [x] Chart height: 160px (subordinate, less prominent than the hero volume chart)
- [x] **Replace tooltip styling** — the current charts reference `boxShadow: 'var(--shadow-md)'` which **doesn't exist** in `index.css` (resolves to nothing). Replace with the same glassmorphic tooltip from 8.4:
  ```js
  contentStyle={{ background: 'var(--glass-bg)', backdropFilter: 'blur(12px)', border: 'none', borderRadius: 12, fontSize: 12, color: 'var(--on-surface)', fontWeight: 600 }}
  ```
- [x] Remove the Max Weight AreaChart from this grid (it's redundant with the PB bento card above)
- [x] Remove the Volume BarChart from this grid (it's now the hero section in 8.4)
- [x] **Grid now contains only 2 charts:** `Est. 1RM over time` (Area) + `Avg Reps/Set` (Line)

---

### 8.8 Filter Controls (Dropdowns) — Reskin
**Keep the 3 dropdowns (Split, Day, Exercise) but upgrade their visual styling to match the Kinetic Elite input system.**

- [x] Move the filter row between the page header and the hero exercise display (before any exercise-specific content)
- [x] Grid: `grid-cols-1 md:grid-cols-3 gap-3`
- [x] Labels: `.label-md` style (`text-xs uppercase tracking-widest on-surface-dim font-bold`) — already close, verify exact match
- [x] Select elements:
  ```css
  padding: 12px 16px;
  border-radius: 1rem;               /* rounded-2xl */
  background: var(--surface-container-highest);
  border: none;                      /* No-Line Rule */
  color: var(--on-surface);
  font-weight: 600;
  font-size: 14px;
  font-family: 'Be Vietnam Pro', sans-serif;
  ```
- [x] On focus: apply `outline: 2px solid var(--primary-container)` (accessible, not a line border) and `outline-offset: 2px`
- [x] Do **NOT** add the bottom-bar input style here — dropdowns look better as rounded boxes vs text inputs

---

### 8.9 Weekly/Monthly Summary Cards — Reskin
**Keep the summary data but integrate it into the bento grid pattern, not standalone cards above everything.**

- [x] Merge the `weeklySummary` and `monthlySummary` data into a single horizontal "context strip" bar between the filter controls and the hero exercise title
- [x] Strip layout: `flex gap-6 flex-wrap` — no card background, just inline stats separated by tonal dividers
- [x] Each stat: super-label (`.label-md`, `on-surface-dim`) + value (`headline-md`, `primary`) + unit (12px, `on-surface-variant`)
- [x] Stats to show (preserve all 5 meaningful data points from the original cards):
  1. `This Week: {weeklySummary.sessions} sessions`
  2. `Vol: {Math.round(weeklySummary.volume / 1000)}k kg`
  3. `{weeklySummary.volChange > 0 ? '+' : ''}{weeklySummary.volChange}% vs last week` (in success/danger color)
  4. `Monthly: {monthlySummary.sessions} sessions`
  5. `~{monthlySummary.avgPerWeek}/week avg`
- [x] If no exercise is selected yet, the summary strip still shows — it's always-visible workout context data
- [x] Remove the current two standalone summary cards (`card` divs at the top of the page)

---

### 8.10 Empty State — Upgrade
**When no exercise is selected, replace the generic EmptyState with an on-brand version.**

- [x] Keep the `<EmptyState>` component but update props:
  - `title="Select an exercise"` → `title="Choose Your Lift"`
  - `message="Log workouts to see strength progression charts"` → `message="Select split, day, and exercise above to unlock your performance analytics"`
- [x] The EmptyState component itself will already use the Kinetic Elite token system once Phase 2.11 is implemented

---

### 8.11 Section Ordering (Final Page Layout)
The redesigned page renders in this top-to-bottom order:

```
1. [ALWAYS]  Page Header — "Workout Analytics" + "Performance Analytics" super-label
2. [ALWAYS]  Filter Controls — Split / Day / Exercise dropdowns (3-col grid)
3. [ALWAYS]  Weekly Summary Context Strip — inline stats
4. [NO_SEL]  Empty State — "Choose Your Lift" (when se is not set)
5. [SELECTED] Hero Exercise Title — editorial asymmetric UPPERCASE two-line display
6. [SELECTED] Bento Stat Grid — 3 cards: Est. 1RM (accent) / PR / Sessions
7. [SELECTED] Volume Trend Chart — full-width hero chart section
8. [SELECTED] 5-col layout:
              Left (col-span-2): PB Glow Card + Focus Groups card (stacked)
              Right (col-span-3): Recent Sessions log (last 5)
9. [SELECTED] Secondary Charts Grid — 2 charts: Est. 1RM trend + Avg Reps/Set
```

---

### 8.12 Tokens & CSS Additions Required
All tokens from Phases 1–6 apply. Additionally verify these are present before implementation:
- [x] `--glow-primary` — `0 0 20px rgba(255, 181, 155, 0.10)` (Phase 1.2)
- [x] `--glass-bg` — `rgba(53, 52, 55, 0.60)` (Phase 1.2)
- [x] `--glass-blur-sm` — `blur(12px)` (Phase 1.2)
- [x] `--ease-smooth` — `cubic-bezier(0.4, 0, 0.2, 1)` (Phase 1.6)
- [x] `cascade-item` stagger animation (Phase 1.6)
- [x] `.display-lg` — Space Grotesk `clamp(2.5rem, 5vw, 3.5rem)`, weight 700, letter-spacing -0.04em (Phases 1.3 + 6.3)
- [x] `.headline-md` — Space Grotesk, already defined (Phase 1.3)
- [x] `.label-md` — Be Vietnam Pro, uppercase, tracking-widest (Phase 1.3)

---

### 8.13 Anti-Pattern Compliance Checklist
- [x] No `1px solid` borders — only the left-accent border on the 1RM bento card (explicit exception) and the ghost PB glow card border at 20% opacity
- [x] No `Bebas Neue` or `DM Sans` references
- [x] All chart tooltips use glassmorphic `contentStyle` (no solid background)
- [x] No `var(--c1)`, `var(--c2)`, `var(--c3)`, `var(--bd)` references
- [x] All rounded corners ≥ 12px (0.75rem)
- [x] Hero number font uses Space Grotesk via `.display-lg`
- [x] Touch targets on all interactive elements (range pills, dropdowns) ≥ 44px height

---

### Priority Order (Phase 8)
1. **8.8** Filter dropdowns reskin (simplest — isolated, no layout change)
2. **8.9** Remove summary cards → inline context strip
3. **8.3** Bento stat grid (high impact, replaces StatCard row)
4. **8.2** Hero exercise title (editorial layout)
5. **8.4** Volume trend hero chart (isolated section)
6. **8.6** Recent sessions log (right column list)
7. **8.5** PB glow card + focus groups (left column)
8. **8.7** Secondary charts subordinate grid
9. **8.1** Rename page title + super-label
10. **8.10** Empty state copy update
11. **8.11** Verify final section ordering is correct
12. **8.12** Token / CSS prerequisite audit
13. **8.13** Anti-pattern compliance sweep

---

## Phase 8 — Bug Fixes (Post-Implementation)

> These issues were identified after the initial Phase 8 implementation and must be resolved before the analytics page is considered production-ready.

---

### BUG-01 · Volume Trend — BarChart → Smooth AreaChart

**Observed:** The Volume Trend hero section renders as a vertical bar chart.  
**Expected:** A smooth, filled area line chart matching the Stitch reference design — a single continuous curve with a gradient fill beneath it (warm orange/ember fill fading to transparent at the bottom).

**Fix:**
- [x] Replace `<BarChart>` + `<Bar>` in the Volume Trend hero section with:
  ```jsx
  <AreaChart data={cd}>
    <defs>
      <linearGradient id="vol-gradient" x1="0" y1="0" x2="0" y2="1">
        <stop offset="5%"  stopColor="var(--primary-container)" stopOpacity={0.45} />
        <stop offset="95%" stopColor="var(--primary-container)" stopOpacity={0} />
      </linearGradient>
    </defs>
    <CartesianGrid strokeDasharray="3 3" stroke="var(--surface-container-lowest)" vertical={false} />
    <XAxis dataKey="date" tick={{ fill: 'var(--on-surface-dim)', fontSize: 11, fontWeight: 600 }} tickLine={false} axisLine={false} dy={10} />
    <YAxis tick={{ fill: 'var(--on-surface-dim)', fontSize: 11, fontWeight: 600 }} tickLine={false} axisLine={false} dx={-10} />
    <Tooltip cursor={false} contentStyle={{ background: 'var(--glass-bg)', backdropFilter: 'var(--glass-blur-sm)', border: 'none', borderRadius: 12, fontSize: 12, color: 'var(--on-surface)', fontWeight: 600 }} itemStyle={{ color: 'var(--primary)' }} />
    <Area type="monotone" dataKey="volume" stroke="var(--primary-container)" strokeWidth={2.5} fill="url(#vol-gradient)" dot={{ fill: 'var(--primary)', r: 3, strokeWidth: 0 }} activeDot={{ r: 5, fill: 'var(--primary)', strokeWidth: 0 }} />
  </AreaChart>
  ```
- [x] `type="monotone"` produces the smooth Bézier curve — **do not use `"linear"`**
- [x] Stroke: `var(--primary-container)` (Burning Ember `#F85F1B`) — not `var(--primary)` (Ember Peach)
- [x] Import `Area` from `recharts` if not already imported (alongside existing `AreaChart`)

---

### BUG-02 · Personal Best Card — Medal Icon at Top Right

**Observed:** The PB card has no visible icon at top right. The current `workspace_premium` Material Symbol is placed as a near-invisible watermark (10% opacity, absolute positioned) rather than as the prominent medal graphic shown in the reference.  
**Expected:** A medal/award icon at 100% opacity positioned in the top-right corner of the card, acting as the card's primary visual identity badge — matching the reference screenshot (right side, large, dark tonal).

**Fix:**
- [x] Add a visible medal icon to the top-right of the PB card container:
  ```jsx
  <div style={{
    position: 'absolute',
    top: 16,
    right: 16,
    width: 56,
    height: 64,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--surface-container-highest)',
    borderRadius: '12px 12px 0 0',
    borderBottom: '4px solid var(--surface-container)',
    color: 'var(--on-surface-variant)',
  }}>
    <span className="material-symbols-outlined" style={{ fontSize: 36, color: 'var(--on-surface-dim)' }}>
      military_tech
    </span>
  </div>
  ```
- [x] Use Material Symbol `military_tech` (medal/award icon) — this matches the star-badge shape in the reference
- [x] Ensure `material-symbols-outlined` font is loaded in `index.html` (it already is — verify the import includes `FILL@0..1`)
- [x] Keep the existing faint watermark (10% opacity) OR remove it — do not duplicate the icon. Prefer keeping only the visible top-right version since the watermark adds noise at low opacity alongside the visible icon.
- [x] PB card `overflow: hidden` must remain so the icon sits flush against the card border

---

### BUG-03 · Personal Best Card — Share Button Shows Text, Not Icon

**Observed:** The Share button at the bottom right of the PB card renders the literal string `"share"` instead of the Material Symbols share icon glyph.  
**Root cause:** The `material-symbols-outlined` font may not be loading correctly, or the `<span>` tag with `className="material-symbols-outlined"` is being treated as raw text by a render path that strips unknown class names.

**Fix:**
- [x] Verify that `index.html` has the Material Symbols font link with the correct `FILL` axis range:
  ```html
  <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet" />
  ```
- [x] Replace the `<span className="material-symbols-outlined">share</span>` approach with an inline SVG share icon to guarantee render independence from font loading:
  ```jsx
  {/* Share SVG icon — no font dependency */}
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
  </svg>
  ```
- [x] Same fix should be applied to the `workspace_premium` / `military_tech` icons if they also render as text — use Lucide icons from the existing `lucide-react` import as a fallback (e.g., `import { Share2, Award } from 'lucide-react'`)
- [x] Preferred approach: **use Lucide React** throughout the PB card since it's already a project dependency, avoiding Material Symbols font-loading fragility entirely:
  - Medal icon: `<Award size={36} color="var(--on-surface-dim)" />` inside the top-right badge
  - Share icon: `<Share2 size={20} color="currentColor" />` inside the share button

---

### BUG-04 · Nav Label — "Progress" → "Analytics"

**Observed:** The bottom navigation bar and sidebar still show `"Progress"` as the tab label.  
**Expected:** Label should read `"Analytics"` to match the renamed page.

**Fix:**
- [x] In `src/data/constants.js` — update **both** nav arrays (desktop sidebar + mobile bottom nav):
  - Line 18: `{ id: 'progress', label: 'Progress', ... }` → change `label` to `'Analytics'`
  - Line 30: same change
  - Keep `id: 'progress'` and `path: '/progress'` unchanged (route and active state logic depends on these)

---

### Bug Fix Priority Order
1. **BUG-04** Nav label (one-line change, lowest risk)
2. **BUG-03** Share icon (font-loading fix or SVG/Lucide swap)
3. **BUG-02** Medal icon at top right of PB card
4. **BUG-01** Volume Trend → AreaChart (chart type change, isolated to one section)

---

## Phase 9 — Profile Page Redesign (Kinetic Elite) [COMPLETED]

> **Goal:** Completely rebuild `ProfilePage.jsx` to match the visual aesthetic from the Stitch design spec, while preserving all existing functionality (edit profile, unit toggles, theme toggle, export/import, logout). The page will be restructured into three new top sections before the existing content: (1) Avatar Hero, (2) Muscle Mastery top-4 from Iron League, (3) Elite Achievements. The remainder of the existing page (Personal Details, settings toggles) will follow, restyled to match the Kinetic Elite theme.

---

### Research Summary

**Existing profile page (`ProfilePage.jsx`):**
- `user.avatar` currently stores a 2-letter text initial (`"VC"`), not an image path
- Two-column desktop layout: left sidebar (avatar initials, BMI/BMR/TDEE, toggles, export/logout) + right card (Personal Details form)
- BMI, BMR, TDEE calculated inline using `calcBMI`, `calcBMR`, `calcTDEE` utilities
- `getStreak()` available from `useApp()` for Streak achievement
- `workoutLogs` available for Volume King and Heavy Hitter achievement computation
- `user.weight` available for 2.5× bodyweight Heavy Hitter check

**Iron League data available for import:**
- `calcAllMuscleXP(workoutLogs, splits, user?.id)` → `{ chest, back, shoulders, ... }` (12 muscle groups)
- `getRank(xp)` → `{ name, color, bg, progress, nextXP }`
- `MUSCLE_GROUPS` → sorted by XP descending → slice top 4
- `getOverallRank(muscleXP)` → `{ name, color, totalXP, progress }` — used for LVL badge and rank label

**Avatar system — current state:**
- `user.avatar` is a 2-char text string (`"VC"`) used as initials in Profile and Layout header
- No image URL or type field currently exists on the user object
- `INIT_USERS` in `sample.js` and new-user creation in `AuthModal.jsx` both set `avatar` to initials — both need extending

---

### 9.1 — Data Model Extension: `avatarType` + `avatarUrl`

**Files:** `src/data/sample.js`, `src/components/pages/AuthModal.jsx`, `src/components/pages/ProfilePage.jsx`, `src/components/layout/Layout.jsx`

- Add `avatarType: 'preset'` and `avatarUrl: null` to `INIT_USERS[0]` in `sample.js`
- In `AuthModal.jsx` new-user creation (line 31), add `avatarType: 'preset', avatarUrl: null` to the user object
- In `ProfilePage.jsx` `save()` function, persist `avatarType` and `avatarUrl` as passthrough fields
- **Keep `user.avatar` (initials) intact** — it is still used by `Layout.jsx` header as text fallback; do not remove it
- **Update `Layout.jsx` sidebar header (line 24):** Replace the initials-only circle with a conditional render — if `user?.avatarUrl` exists, render `<img src={user.avatarUrl} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />`, else keep the text initials. This ensures the sidebar avatar updates when the user picks a character or uploads a photo.
- **Also in `Layout.jsx` line 27:** Replace emoji `'⚡ Admin'` with JSX using Lucide `<Zap size={10} />` — import `Zap` from `lucide-react`. This fixes the same anti-pattern flagged for ProfilePage.

---

### 9.2 — Avatar Hero Section

**Position:** Replaces the entire left `230px` sidebar. The page becomes single-column, full-width.

**Design (matches Stitch reference exactly):**
- Centered layout: ambient glow blob behind avatar → avatar card → LVL badge → name → rank sub-label → Edit + Share CTA row
- Avatar container: `128×128px`, `border-radius: 24px`, inner `border-radius: 18px` for image, `padding: 4px`, `border: 2px solid rgba(255,181,155,0.20)`, `boxShadow: var(--glow-primary)`, `background: var(--surface-container)`
- If `user.avatarUrl` → render `<img>` covering the container. Else → render initials text with `Space Grotesk` font
- LVL badge: `position: absolute`, `bottom: -8, right: -8`, use existing `var(--signature-gradient)` token (DO NOT re-specify gradient literals), `border-radius: 8px`, `12px` bold text. Level = `Math.min(99, Math.floor(overall.totalXP / 5000) + 1)`
- Name: `Space Grotesk`, `28px`, `700`, uppercase, `letterSpacing: -0.03em`
- Rank sub-label row: Lucide `Shield` icon + `"{overall.name} · Iron League"`, `13px`, `var(--on-surface-variant)`
- **Edit Profile button:** Uses `var(--signature-gradient)` token as `background` (reuses existing token instead of raw `linear-gradient(135deg, var(--primary-container), var(--primary))`). `color: var(--on-primary)`, `border-radius: 14px`, `font-weight: 700`, `font-size: 13px`, `text-transform: uppercase`, `letter-spacing: 0.12em`. **The `onClick` scrolls to the Personal Details card (9.6)** — use `document.getElementById('personal-details').scrollIntoView({ behavior: 'smooth' })` and set `setEd(true)` to enter edit mode simultaneously. It does NOT open the avatar picker.
- Share button: icon-only, `var(--surface-container-highest)` tonal bg, `48×48px`, `border-radius: 14px`
- **Clicking the avatar image/initials** opens the Avatar Picker Modal (9.3), indicated by a hoverable overlay with `<Camera size={24} />` icon centered, `background: rgba(0,0,0,0.5)`, `borderRadius: 18px` to match the inner image container.

---

### 9.3 — Avatar Picker Modal

**Character roster (12 presets):**

| ID | Character | Universe |
|----|-----------|----------|
| `iron-man` | Iron Man | Marvel |
| `captain-america` | Captain America | Marvel |
| `black-panther` | Black Panther | Marvel |
| `doctor-strange` | Doctor Strange | Marvel |
| `wonder-woman` | Wonder Woman | DC |
| `batman` | Batman | DC |
| `superman` | Superman | DC |
| `aquaman` | Aquaman | DC |
| `aang` | Aang | Avatar TLA |
| `zuko` | Zuko | Avatar TLA |
| `toph` | Toph | Avatar TLA |
| `katara` | Katara | Avatar TLA |

**Image generation:**
- All images generated using `generate_image` tool during implementation
- Style: cinematic dark background, amber/orange rim lighting, stylized portrait bust, consistent mood across all 12
- Saved to: `public/avatars/{id}.png`

**Modal design:**
- Full-screen overlay: `position: fixed`, `inset: 0`, `background: rgba(0,0,0,0.7)`, `backdropFilter: blur(24px)`, `zIndex: var(--z-modal)`
- **Escape key handler:** `useEffect` with `keydown` listener → close modal on `Escape`
- **Click outside to close:** Click on the overlay backdrop (outside the bottom sheet) closes modal
- Bottom sheet card: slide up from bottom, `border-radius: 24px 24px 0 0`, `background: var(--surface-container-low)`, max height 80vh with `overflowY: auto`
- 3-column grid (`repeat(3, 1fr)`), each cell: `80×80px` image + character name label below
- Selected state: `2px solid var(--primary)` ring + `boxShadow: var(--glow-primary)`
- Last cell: "Upload" tile with `Camera` lucide icon + `<input type="file" accept="image/*">` hidden trigger
- **Upload handler:** Use `FileReader.readAsDataURL()` but **first resize to max 256×256 and compress** using a `<canvas>` element to keep the base64 string under ~50KB. This prevents localStorage overflow (5MB limit). Pseudocode:
  ```js
  const img = new Image();
  img.onload = () => {
    const canvas = document.createElement('canvas');
    const max = 256;
    const scale = Math.min(max / img.width, max / img.height);
    canvas.width = img.width * scale;
    canvas.height = img.height * scale;
    canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
    // Save dataUrl as avatarUrl
  };
  img.src = reader.result;
  ```
- **On preset selection:** `setUsers(prev => prev.map(u => u.id === user.id ? { ...u, avatarUrl: selectedUrl, avatarType: 'preset' } : u))`
- **On upload selection:** `setUsers(prev => prev.map(u => u.id === user.id ? { ...u, avatarUrl: compressedDataUrl, avatarType: 'upload' } : u))` — note `avatarType: 'upload'` (NOT `'preset'`)
- Universe tabs (Marvel / DC / Avatar TLA / Upload) to filter the grid

---

### 9.4 — Muscle Mastery Section (Top 4 from Iron League)

**Position:** Immediately after the BMI/BMR/TDEE stats strip (9.8).

**Data:**
```js
const muscleXP = useMemo(() => calcAllMuscleXP(workoutLogs, splits, user?.id), [workoutLogs, splits, user?.id]);
const overall  = useMemo(() => getOverallRank(muscleXP), [muscleXP]);
const top4     = useMemo(() =>
  [...MUSCLE_GROUPS].sort((a,b) => (muscleXP[b.key]||0) - (muscleXP[a.key]||0)).slice(0,4),
  [muscleXP]);
```

**Render per muscle row:**
- Left: `Space Grotesk`, `13px`, `700`, uppercase, muscle label
- Right top: `9px` rank name label (`BRONZE II`, etc.)
- Right bottom: `14px`, `700` XP value — `var(--primary)` if active (xp > 200), else `var(--on-surface-variant)`
- Bar: `12px` pill, `background: var(--surface-container-lowest)`, inner fill:
  - Active: `linear-gradient(90deg, var(--primary-container), var(--primary))` + `boxShadow: 0 0 12px rgba(248,95,27,0.4)`
  - Inactive: `var(--surface-container-highest)` flat fill, no shadow
- Bar width: `Math.max(2, rank.progress * 100)%` (minimum 2% for visual affordance)

---

### 9.5 — Elite Achievements Section

**Achievements (computed via `useMemo`):**

| ID | Icon | Label | Unlock Condition |
|----|------|-------|-----------------|
| `streak` | `Flame` | 7 Day Streak | `streak.current >= 7` (see note below) |
| `volume-king` | `Dumbbell` | Volume King | Monthly volume `>= 50,000 kg` |
| `heavy-hitter` | `Trophy` | Heavy Hitter | Any set weight `>= user.weight * 2.5` |
| `early-bird` | `Clock` | Early Bird | Locked — `workoutLog.startTime` not yet in data model; description explains unlock condition |

**Important — `getStreak()` call pattern:** `getStreak` is a `useCallback` from `useApp()`. Call it ONCE above the achievements memo and store the result:
```js
const streak = getStreak(); // Call once, outside useMemo
const achievements = useMemo(() => {
  // use streak.current inside here
}, [streak, workoutLogs, user]);
```
Do NOT call `getStreak()` inside the `useMemo` callback — it would cause a stale closure if the dependency array omits `getStreak`, and unnecessary re-computation if it includes it.

**Card render:**
- Grid: `repeat(2, 1fr)`, `gap: 16`
- Each card: `background: var(--surface-container-low)`, `border-radius: 20px`, `padding: 20px`, **no border**
- Locked state: `opacity: 0.40` on entire card wrapper
- Icon container (unlocked): `48×48px`, `border-radius: 14px`, `background: rgba(255,181,155,0.10)`
- Icon container (locked): `48×48px`, `border-radius: 14px`, `background: var(--surface-container-highest)`
- Icon color (unlocked): `var(--primary)` / locked: `var(--on-surface-variant)`
- Title: `Space Grotesk`, `12px`, `700`, uppercase, `letterSpacing: 0.08em`
- Description: `10px`, `var(--on-surface-variant)`, `lineHeight: 1.5`

---

### 9.6 — Restyled Personal Details Form

**Replace** the 2-column `230px + 1fr` sidebar layout with a single full-width card:
- Remove outer `display: grid` wrapper entirely — the page becomes a clean single-column stack
- Card: `background: var(--surface-container-low)`, `border-radius: 20px`, `padding: 24px`, **no border**
- Header row: "Personal Details" headline-md left, `[Edit]` / `[✓ Save]` button right
  - Save button: ember gradient (`linear-gradient(135deg, var(--primary-container), var(--primary))`), `color: var(--on-primary)`, `border-radius: 12px`
  - Edit button: `background: var(--surface-container-highest)`, `border-radius: 12px`
- Field display rows: `background: var(--surface-container)`, `border-radius: 12px`, `padding: 12px 14px`, **no `border-bottom`**
- Field label: `10px`, `700`, uppercase, `var(--on-surface-dim)` 
- Fields grid: `repeat(auto-fit, minmax(200px, 1fr))`, `gap: 14`
- Replace `⚡ Admin` emoji with `<Zap size={10} />` from lucide-react

---

### 9.7 — Settings & Actions Card

**Single card below Personal Details:**
- Card styling: same as 9.6 — `var(--surface-container-low)`, `border-radius: 20px`, **no border**
- "Settings" section header: `label-md` class, uppercase, `var(--on-surface-dim)`, `marginBottom: 16`
- Row separator between toggle rows: `height: 1px`, `background: var(--surface-container-highest)` — **not `var(--outline-variant)`**
- Toggle segments: keep existing pill segmented design — just wrap in new container
- **Logout button:** `background: rgba(255,107,107,0.08)`, `color: var(--danger)`, `border-radius: 12px`, full-width, flex center, `border: none`. **Must NOT use `btn-d` class** — that class has `border: 1px solid var(--outline-variant)` which violates our anti-pattern rules. Restyle inline with explicit `border: 'none'`.
- Export/Import row: two tonal buttons side-by-side, `background: var(--surface-container-highest)`, `border-radius: 12px`, `border: 'none'`, `cursor: 'pointer'`
- **All `marginBottom` between sections:** Use `16px` gap between settings rows, `24px` between the last toggle and the export/import row, `16px` between export/import and logout

---

### 9.8 — BMI / BMR / TDEE Stats Strip

Move from left sidebar to a horizontal inline strip between Avatar Hero and Muscle Mastery:
- Layout: `display: grid`, `gridTemplateColumns: repeat(3, 1fr)`, `gap: 12`, `marginBottom: 32`
- Each cell: `background: var(--surface-container-low)`, `border-radius: 16px`, `padding: 20px`, **no border**
- BMI value: `.display-lg`, `color: var(--primary)`
- BMR/TDEE value: `.headline-lg`, `color: var(--on-surface)`
- Unit label: `10px`, uppercase, `var(--on-surface-dim)`
- BMI category: `8px`, `background: var(--surface-container-highest)`, `border-radius: 8px`, `color: var(--on-surface-variant)`, `padding: 3px 8px`

---

### 9.9 — Final Page Structure

```
1. PageHeader "My Profile" (existing — no change)
2. Avatar Hero (9.2) + Avatar Picker Modal (9.3)    [marginBottom: 32]
3. BMI / BMR / TDEE Stats Strip (9.8)                [marginBottom: 32]
4. Muscle Mastery Top-4 (9.4)                         [marginBottom: 40]
5. Elite Achievements 2×2 grid (9.5)                  [marginBottom: 40]
6. Personal Details Card (9.6)  id="personal-details" [marginBottom: 24]
7. Settings & Actions Card (9.7)                      [marginBottom: 24]
```

**Remove:**
- The entire `display: grid, gridTemplateColumns: '230px 1fr'` outer `<div>` wrapper with `className="g2"`
- The `.g2` responsive class reference (if used in CSS)
- Both inner `className="card"` wrappers from the old sidebar and details panel — replace with the new section structure above

---

### 9.10 — New Imports Required for `ProfilePage.jsx`

```jsx
import { useState, useMemo } from 'react';
import { LogOut, Download, Upload, Share2, Flame, Dumbbell, Trophy, Clock, BarChart2, Camera, Zap, Shield } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PageHeader, ConfirmDialog, ThemeTogglePill } from '../shared/SharedComponents';
import { ACTIVITY } from '../../data/constants';
import { calcBMI, getBMICat, calcBMR, calcTDEE } from '../../utils/calculations';
import { fmt, kgToLbs, cmToFtIn } from '../../utils/helpers';
import { exportData, importData } from '../../utils/storage';
import { calcAllMuscleXP, getRank, MUSCLE_GROUPS, getOverallRank } from '../../data/muscleData';
```

---

### 9.11 — Avatar Image Generation Plan

During implementation, use `generate_image` tool for each of the 12 character portraits:
- **Style:** Cinematic dark gym/action background with warm amber/orange rim lighting from the side. Each portrait is a close-up bust, cleansed from messy environments, consistent across all 12.
- **Output path:** `public/avatars/{id}.png`
- Generate all 12 in parallel during the implementation step to save time.

---

### 9.12 — Anti-Pattern Compliance Checklist

- [x] No `border: '1px solid var(--outline-variant)'` on any card (also applies to logout button — must not use `btn-d` class)
- [x] No `boxShadow: 'var(--shadow-md)'` on standard cards — glow only on avatar
- [x] No `#ffffff` or `#000000` literals
- [x] No emoji as icons — replace `⚡ Admin` with `<Zap size={10} />` in **both ProfilePage.jsx AND Layout.jsx** (line 27)
- [x] No `font-family: 'Bebas Neue'` — replace with `'Space Grotesk'`
- [x] No `border-bottom: '2px solid ...'` on field display rows — use `borderRadius: 12` containers instead
- [x] No inline `style={{ border: 'none' }}` workarounds (cards already have no border by default from design system)
- [x] Achievement grid cards must have `border-radius: 20px` (not `12px` or `8px`)
- [x] Use `var(--signature-gradient)` token for ember gradient buttons — do NOT re-specify `linear-gradient(135deg, ...)` inline when the token already exists
- [x] Old `.g2` responsive class wrapper must be fully removed — verify no leftover `className="g2"` in output
- [x] `avatarType` must be `'upload'` (not `'preset'`) when user uploads a custom image
- [x] Uploaded avatar must be canvas-resized to max 256×256 and JPEG-compressed to ~50KB before storing in localStorage
- [x] Avatar Picker Modal must support `Escape` key to close and click-outside-to-close

---

### Priority Order (Phase 9)

1. **9.1** Data model: `avatarType` + `avatarUrl` fields (+ Layout.jsx avatar/admin fixes)
2. **9.11** Generate character portrait images → `public/avatars/`
3. **9.10** Update imports in `ProfilePage.jsx`
4. **9.2** Avatar Hero section (single-column layout conversion)
5. **9.8** BMI/BMR/TDEE stats strip
6. **9.4** Muscle Mastery Top-4
7. **9.5** Elite Achievements
8. **9.6** Personal Details card restyle
9. **9.7** Settings & Actions card restyle
10. **9.3** Avatar Picker Modal (+ canvas-compress upload handler)
12. **9.12** Anti-pattern sweep (expanded 13-point checklist)

---

## Phase 9 — Bug Fixes (Post-Implementation)

> These issues were identified after the initial Phase 9 implementation and must be resolved before the profile page is considered production-ready.

### Bug Fix Priority Order

- [x] **Bug 9.1: Avatar Level Badge Clipping**
  - **Issue:** The `LVL X` badge on the bottom right of the profile picture is cut out and not fully visible.
  - **Cause:** The outer container of the avatar hero section (`<div style={{ position: 'relative', width: 128... }}`) has `overflow: 'hidden'`, clipping the absolute-positioned badge mounted at `bottom: -8, right: -8`.
  - **Fix:** Remove `overflow: 'hidden'` from the outer container. The inner container wrapping the image already has `overflow: 'hidden'` to restrict the image bounds, allowing the outer container to freely overflow the badge.

- [x] **Bug 9.2: Avatar Selection Modal Positioning**
  - **Issue:** The profile picture selection pop-up appears at the bottom of the screen after scrolling down, instead of appearing centered where the user is looking.
  - **Cause:** The `AvatarPickerModal` wrapper uses `alignItems: 'flex-end'`, anchoring the modal to the bottom of the viewport.
  - **Fix:** Update the modal overlay's fixed container to use `alignItems: 'center'` and `justifyContent: 'center'` so the pop-up is perfectly centered in the screen regardless of scroll position.

---

## Phase 10 — Dashboard (Home) Page Redesign (Kinetic Elite)

**Status:** Planned (Reviewed)
**Goal:** Rebuild `DashboardPage.jsx` to match the Kinetic Elite / Stitch design aesthetic, incorporating all Stitch-provided elements while selectively preserving existing functional content and removing what doesn't fit.

---

### Review Notes (11 gaps patched)

| # | Gap | Resolution |
|---|-----|------------|
| R1 | **12-col CSS grid won't collapse on mobile** — The app uses `.g2` class which forces `grid-template-columns:1fr!important` at `<768px`. A 12-col `repeat(12,1fr)` grid would need a new media query or custom class. | Use a simpler `gridTemplateColumns` approach with fractional columns (e.g., `'2fr 1fr'`) and apply `.g2` class for mobile collapse, matching all other pages. |
| R2 | **Delta badge needs unit awareness** — Plan says `+/- X.X KG THIS MONTH` but ignores the `unitWeight` toggle (kg vs lbs). | Delta badge must check `isImpWeight` and display lbs if active. |
| R3 | **Weight Trend chart Y-axis doesn't convert to lbs** — Current chart always shows kg on Y-axis regardless of user preference. | Pass converted data to chart when `isImpWeight` is true. |
| R4 | **Missing import cleanup** — Plan removes `StatCard`, `Ruler`, `BarChart2`, `Scale` but doesn't list them as imports to remove. Unused imports cause lint warnings. | Add explicit import cleanup step. |
| R5 | **Log Weight button placement unclear** — Plan says "moves here as a small pill button" but doesn't specify exact DOM position. | Place it `position: absolute; top: 0; right: 0` inside the welcome header `<header>` block. |
| R6 | **Date subtitle dropped** — Current header shows `new Date().toLocaleDateString(...)` as a subtitle. Plan doesn't mention keeping or removing it. | Keep the date subtitle below the welcome name, styled as `fontSize: 12, color: var(--on-surface-variant)`. |
| R7 | **Skeleton loader not updated** — Current loading state renders 5 `SkeletonCard` in a stats grid. New layout has no stats grid. | Update skeleton to render 2 placeholder glass-cards matching the bento aspect ratio. |
| R8 | **Modals inside `.pg-in` transform context** — Same bug as Profile Page (Phase 9 Bug 9.2). `position: fixed` modals inside a CSS-animated container won't position to viewport on mobile. | Wrap return in `<>` Fragment, render `<Portal>`-wrapped modals outside `.pg-in`. (Already using `<Portal>` — verify it renders to `document.body`.) |
| R9 | **`text-gradient-primary` class already exists** — Plan says to use `background-clip: text` inline for the gradient name, but the existing `.text-gradient-primary` utility already does this. | Use the existing `className="text-gradient-primary"` instead of inline styles. Simpler, consistent. |
| R10 | **`.ember-glow` class verified** — Plan mentions ember-glow inline `boxShadow` but the class already exists in `index.css`. | Use `className="ember-glow"` on the Metabolic Index ring instead of inline shadow. |
| R11 | **`ProgressOrb` import at risk** — Removing `StatCard` from import might accidentally remove `ProgressOrb` or `ScrollPicker` if bulk-deleted. | Explicitly list the retained imports from `SharedComponents`. |

---

### Design System Reference (from Stitch HTML)

The Stitch design provides these key visual tokens to carry over into our CSS variable system:
- **backgrounds**: `#131315` (bg), `#201f21` (surface-container), `#353437` (surface-container-highest)
- **primary accent**: `#F85F1B` (primary-container / action orange)
- **muted accent**: `#FFB59B` (primary / warm peach)
- **glass effect**: `background: rgba(53, 52, 55, 0.6); backdrop-filter: blur(20px)` → use existing `.glass-card` class
- **ember glow**: `box-shadow: 0 0 20px rgba(248, 95, 27, 0.2)` → use existing `.ember-glow` class
- **fonts**: `Space Grotesk` (headline, bold, uppercase, tight tracking) + `Be Vietnam Pro` (body, label) → already in CSS

---

### Layout Architecture (Bento Grid)

The page will use a **bento grid** layout with fractional columns and the `.g2` class for mobile collapse.

```
[  Weight Trend (2fr)  ] [ Metabolic Index (1fr) ]   ← className="g2"
[ Sessions/Streak (1fr)] [ Weight Goal (1fr)     ]   ← className="g2"
[  Live Suggestion / Active Split CTA (full)     ]
[  Recent Sessions (full)                        ]
[  Muscle Activity Widget (full)                 ]
```

---

### Section Inventory

#### ✅ Elements to KEEP from current Dashboard

| Element | Notes |
|---|---|
| Sessions/Week stat | Keep, restyle into bento cell |
| All Time Sessions stat | Keep, restyle into bento cell |
| Current Streak / Best Streak card | Keep, restyle into horizontal bento cell |
| Weight Goal card (with `ProgressOrb`, set-goal modal) | Keep in full, restyle to match Kinetic Elite dark glass style |
| Weight Trend area chart | Keep, elevate to hero-sized chart card (2fr column) |
| Log Weight button & modal | Keep, position inside welcome header |
| Set Goal modal | Keep as is |
| Active Split card | Keep with Stitch image-banner style |
| Recent Sessions | Keep, relocate below goal area |
| Muscle Activity widget | Keep, relocate to bottom |
| BMI categories grid on Metabolic Index card | Keep (per requirement 5), highlight active category |
| Date subtitle | Keep below welcome name |

#### ❌ Elements to REMOVE

| Element | Reason |
|---|---|
| Height stat card (`Ruler`) | Explicitly requested to be removed |
| Current Weight stat card (`Scale`) | Replaced by the hero area chart header block |
| BMI standalone stat card (`BarChart2`) | Replaced by the enhanced Metabolic Index card |
| Plain `PageHeader` title | Replaced by Stitch "Welcome Back, NAME" hero header |
| `StatCard` import | No longer needed — all stats rendered inline |

#### ✨ NEW Elements from Stitch

| Element | Notes |
|---|---|
| Hero welcome header | `"WELCOME BACK, [FIRST NAME]"` with `className="text-gradient-primary"` for the name |
| Glass-card weight chart (2fr) | Hero card with current weight, unit-aware delta badge, and area chart |
| Metabolic Index card (1fr) | Concentric circle dial (`className="ember-glow"`) + BMI category highlight grid |
| Live Suggestion Banner (full) | Full-width image banner with dark gym background, active split context, and START WORKOUT CTA |
| Sessions/Streak bento cells (1fr+1fr) | Styled as glass metric cells with icons |

---

### Detailed Section Specs

#### 10.1 — Welcome Header
- Remove `<PageHeader>` component.
- Replace with a styled `<header style={{ position: 'relative', marginBottom: 32 }}>` block:
  - Subtitle: `"SESSION ACTIVE"` — `fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--on-surface-variant)', fontFamily: "'Space Grotesk'"`.
  - Title: `"WELCOME BACK,"` line break + `<span className="text-gradient-primary">{user.name.split(' ')[0].toUpperCase()}</span>` — `fontFamily: "'Space Grotesk'", fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 700, letterSpacing: '-0.04em', lineHeight: 1`.
  - Date subtitle: `new Date().toLocaleDateString(...)` in `fontSize: 12, color: 'var(--on-surface-variant)', marginTop: 8`.
  - Decorative watermark: `<Dumbbell size={120} style={{ position: 'absolute', top: -16, right: -16, opacity: 0.06, color: 'var(--on-surface)' }} />`.
  - Log Weight button: `<button className="btn-p" style={{ position: 'absolute', top: 0, right: 0, padding: '10px 18px', fontSize: 13 }}>+ Log Weight</button>` — triggers `setShowLog(true)`.

#### 10.2 — Bento Grid Container
- Use `style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}` with `className="g2"` for mobile collapse.
- Each subsequent row uses its own grid wrapper with `.g2`.

#### 10.3 — Weight Trend Card (hero, 2fr column)
- Apply `className="glass-card"`, `style={{ padding: 24, borderRadius: 16 }}`.
- Header row: `flex` with `justifyContent: space-between`.
  - Left: label `"PERFORMANCE TREND"` (uppercase, `fontSize: 10, letterSpacing: '0.15em'`) + title `"WEIGHT ANALYSIS"` (`headline-md`).
  - Right: delta badge `<span>` — pill with `background: 'var(--primary-container)', color: 'var(--on-primary)', borderRadius: 999, padding: '4px 12px', fontSize: 11, fontWeight: 700`. Value = difference between first and last health log of the current month. **Must respect `isImpWeight`** to show lbs.
- Below header: Current weight large display — `display-lg` class, `fontSize: '3.5rem'`.
  - Append `trending_down`/`trending_up` icon (use `TrendingDown`/`TrendingUp` from Lucide — **add to imports**).
  - Previous weight: `opacity: 0.4, fontSize: '1.5rem'`.
  - **Both must respect `isImpWeight`** unit conversion.
- Chart: Reuse existing `<AreaChart>` + `<Area>` with `type="monotone"`. Height `180`.
  - If `isImpWeight`, map `chartData` to convert weight values to lbs.
  - Retain `<ReferenceLine>` for goal weight (also convert if lbs mode).

#### 10.4 — Metabolic Index Card (1fr column)
- Apply `className="glass-card"`, style: `padding: 24, borderRadius: 16, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center'`.
- Decorative watermark: `<Activity size={28} style={{ position: 'absolute', top: 16, right: 16, opacity: 0.15 }} />`.
- Label: `"METABOLIC INDEX"` (uppercase small tracking).
- Concentric ring container: `width: 140, height: 140, position: 'relative'`.
  - Outer ring: `borderRadius: '50%', border: '4px solid var(--surface-container-lowest)'`.
  - Inner half-ring: `className="ember-glow"`, `border: '4px solid var(--primary-container)', borderTopColor: 'transparent', borderRightColor: 'transparent', transform: 'rotate(45deg)'`.
  - Center content: BMI value (`headline-lg, fontSize: 2.5rem`) + category label (`var(--primary-container)`).
- **Below the dial**: 2×2 grid of BMI categories — `Under (<18.5)`, `Normal (18.5–25)`, `Over (25–30)`, `Obese (>30)`.
  - Active category gets `background: var(--surface-container-highest), color: var(--primary)`.
  - Inactive: `background: var(--surface-container-lowest), color: var(--on-surface-variant)`.

#### 10.5 — Sessions + Streak Row (1fr + 1fr)
- Wrapper: `display: grid, gridTemplateColumns: '1fr 1fr', gap: 16`, `className="g2"`.
- **Left cell** (`glass-card`): Two stat groups stacked vertically.
  - "Sessions / Week" — `thisWk` large number + `<Flame>` icon.
  - "All Time Sessions" — `userWo.length` + `<Trophy>` icon.
  - Each stat: label `fontSize: 10, uppercase`, value `headline-lg, color: var(--primary)`.
- **Right cell** (`glass-card`): Current Streak + Best Streak.
  - Same layout as current streak card but inside glass-card.
  - Retain `<Flame>` icon with `var(--glow-primary)` background circle.
  - Retain `{streak.current >= 3 && <span className="tag"><Zap size={10} /> On Fire!</span>}`.

#### 10.6 — Weight Goal Card (full width)
- Full-width `className="glass-card"`, `style={{ padding: 20, borderRadius: 16, cursor: 'pointer' }}`.
- Restyle from `.card.stripe` → remove both classes, use pure `glass-card`.
- Retain all existing internal content: header row with `<Target>` icon, Target/Remaining/Weeks Left grid, `<ProgressOrb>`, start/goal weights.
- `onClick={() => setShowGoal(true)}` preserved.
- **Weight values must respect `isImpWeight`** — already handled in existing code.

#### 10.7 — Live Suggestion Banner (full width)
- Full-width card: `borderRadius: 16, overflow: hidden, position: relative, minHeight: 180`.
- Background: `<img src="[gym image URL]" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.4, filter: 'grayscale(100%)' }} />`.
- Gradient overlay: `<div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, var(--background) 15%, transparent 100%)' }} />`.
- Content: `position: relative, zIndex: 1, padding: 24, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', height: '100%', minHeight: 180`.
  - `<PulseIndicator />` + `"LIVE SUGGESTION"` label.
  - If `activeSplit`: split name as `headline-md uppercase` + schedule description.
  - If no split: `"Set up a split to get personalized recommendations"`.
- CTA: `<button>` positioned `absolute, bottom: 24, right: 24` with `background: var(--signature-gradient)`, navigates to `/workout`.

#### 10.8 — Recent Sessions (full width)
- Wrap in `glass-card, borderRadius: 16, padding: 20`.
- Title: `"RECENT SESSIONS"` uppercase label.
- Keep existing session `recent.map(w => ...)` rendering.
- Restyle each row: remove hard `.tonal-break` class, use `background: var(--surface-container-lowest), borderRadius: 12, marginBottom: 8`.
- Retain `<Check>` icon on right.

#### 10.9 — Muscle Activity Widget (full width)
- Keep as is — already Kinetic-Elite styled. No changes needed.

#### 10.10 — Import Cleanup
- **Remove**: `Scale`, `BarChart2`, `Ruler`, `StatCard`, `PageHeader` from imports.
- **Add**: `TrendingDown`, `TrendingUp` to Lucide imports.
- **Retain**: `AreaChart`, `Area`, `XAxis`, `YAxis`, `CartesianGrid`, `Tooltip`, `ResponsiveContainer`, `ReferenceLine` (Recharts); `Flame`, `Trophy`, `Target`, `ChevronDown`, `ChevronRight`, `Check`, `X`, `Zap`, `Dumbbell`, `Activity`, `Shield` (Lucide); `ProgressOrb`, `ScrollPicker`, `SkeletonCard`, `Portal`, `GlassTooltip`, `PulseIndicator`, `ConfirmDialog`, `ThemeTogglePill` (SharedComponents); `MiniBodyMap` (BodyMapSVG).

#### 10.11 — Modal Render Context
- Wrap the return in `<>` React Fragment.
- Render the Log Weight and Set Goal `<Portal>` modals **outside** the `.pg-in` div (same fix as Profile Page Bug 9.2).

#### 10.12 — Skeleton Loader Update
- Replace the current `SkeletonCard` × 5 grid with 2 placeholder `glass-card` divs:
  - One spanning `2fr` (chart placeholder) and one spanning `1fr` (metabolic placeholder).
  - Each with `height: 200, borderRadius: 16, background: var(--surface-container-high), animation: pulse 1.5s infinite`.

---

### Files to Modify

| File | Change |
|---|---|
| `src/components/pages/DashboardPage.jsx` | Full layout rebuild |

> **Note:** No CSS changes needed. `.glass-card`, `.ember-glow`, `.text-gradient-primary`, and `.g2` already exist in `index.css`.

---

### Anti-pattern Checklist (Phase 10)

- [x] No `border` on any card element (use `border: 'none'` explicitly).
- [x] No `shadow-md` — use `.ember-glow` or `var(--glow-primary)` only.
- [x] No emoji icons — Lucide components only (`Flame`, `Trophy`, etc.).
- [x] No `<hr>` tags — use `height: 1px; background: var(--surface-container-highest)`.
- [x] All gradients use `var(--signature-gradient)` or `.text-gradient-primary` class.
- [x] Welcome name uses `className="text-gradient-primary"`, not inline gradient styles.
- [x] Height stat card is removed.
- [x] No `.card` class used — `glass-card` only throughout.
- [x] No hardcoded `linear-gradient(...)` inline strings — use CSS variables.
- [x] All weight/height values respect `isImpWeight` / `isImpHeight` user preferences.
- [x] Modals rendered outside `.pg-in` container via `<Portal>`.

---

### Priority Order (Phase 10)

1. **10.10** Import cleanup (remove unused, add new)
2. **10.1** Welcome Header (hero replacement for PageHeader)
3. **10.3** Weight Trend card as 2fr hero + unit-aware delta badge
4. **10.4** Metabolic Index concentric ring card + BMI category grid
5. **10.5** Sessions + Streak row (1fr+1fr bento)
6. **10.6** Weight Goal card (full-width, glass restyle)
7. **10.7** Live Suggestion Banner (Active Split CTA card)
8. **10.8** Recent Sessions restyle
9. **10.9** Verify Muscle Activity Widget (no change needed)
10. **10.11** Modal render context fix (Fragment wrapper)
11. **10.12** Skeleton loader update
12. **10.13** Anti-pattern sweep

---

## Phase 10 — Post-Implementation Refinements

**Status:** Planned (Reviewed)
**Goal:** Apply 6 targeted improvements to `DashboardPage.jsx` following user review of the newly redesigned dashboard.

---

### Review Notes (8 gaps patched)

| # | Gap | Resolution |
|---|-----|------------|
| V1 | **Lucide icon availability unverified** — Plan says to check `Footprints` and `Droplets` at runtime. | ✅ Verified: both `Footprints` and `Droplets` exist in `lucide-react@0.577.0`. No fallback needed. |
| V2 | **R1 footer date needs `fmt()` function** — "Latest Log" date display needs the existing `fmt` helper, already imported. | Use `fmt(allUserLogs[allUserLogs.length - 1].date)` — no new import needed. |
| V3 | **R1 Weight Snapshot trend icon logic** — Plan uses `delta ≤ 0` threshold but the existing `trend` variable compares last-two-logs, not the monthly delta. Inconsistent. | Use `monthDelta` for the icon direction, not the `trend` variable. The trend icon is associated with "THIS MONTH", so `monthDelta ≤ 0` → `TrendingDown` (green/primary), `monthDelta > 0` → `TrendingUp` (red/error). |
| V4 | **R5 dual `className` on glass-card + ember-glow** — Plan puts `className="ember-glow"` on the same `div` as the icon pill. This mixes box-shadow with the pill's background. | Apply `ember-glow` to the inner icon pill `div` only (not the card wrapper). The card wrapper uses plain `glass-card`. Already correct in the plan template — just confirming. |
| V5 | **R6 no-split CTA navigates to `/splits`** — This route may not exist as a standalone page. | Verified: the app uses `/splits` as part of the workout flow. Route exists via `SplitsPage`. ✓ Safe. |
| V6 | **R4 insight text inside 140px ring is cramped** — Plan says "between bmiCat.label and the 2×2 grid" but the ring is only 140px tall. Placing multi-line text inside it will overflow. | Place the insight text **below the ring container** (after `marginBottom: 16` of the ring div), not inside it. Before the 2×2 grid. |
| V7 | **R1 previous weight needs < 2 logs guard** — Footer shows "Previous: weight" but crashes if only 1 log exists. | Guard with `allUserLogs.length >= 2 ? ... : '—'`. |
| V8 | **R3 removing `Check` import safe** — Verified `Check` is only used in Recent Sessions. After deletion, it's unused. | ✓ Safe to remove. |

---

### Change Inventory

| # | Change | Type |
|---|--------|------|
| R1 | Weight Analysis card → match Stitch static weight snapshot; Weight Trend becomes a separate full-width card | Redesign |
| R2 | Rename "Muscle Activity" card → "Iron League" + swap to `Shield` icon | Rename |
| R3 | Remove "Recent Sessions" card entirely | Delete |
| R4 | Metabolic Index card — add per-BMI-range insight text below ring | Enhancement |
| R5 | Add 3 placeholder activity cards: Daily Steps, Calories Burned, Water Intake (3-col row) | New |
| R6 | Live Suggestion banner — fix full image layout, show schedule pills, fix no-split CTA | Bug fix |

---

### Detailed Specs

#### R1 — Weight Analysis Card Split (Stitch Layout)

**Current:** A single combined `glass-card` holds the static weight display (number + delta badge) AND the area chart together (lines 139–176).

**Target:** Split into **two separate cards**:

**Card A — Weight Snapshot** (`1fr` in the first row, beside Metabolic Index):
- `glass-card`, `padding: 24`, `borderRadius: 16`, `border: 'none'`
- Label block (top-left): `"WEIGHT ANALYSIS"` uppercase `fontSize: 10`, `letterSpacing: '0.15em'` + sub-line `"PERFORMANCE TREND"` `fontSize: 9`, `color: var(--on-surface-dim)`
- Delta badge (top-right): pill `background: 'var(--primary-container)'`, `color: 'var(--on-primary)'`, `borderRadius: 999`, `padding: '4px 12px'`, `fontSize: 11`, `fontWeight: 700` — shows `{monthDelta > 0 ? '+' : ''}{monthDelta} {isImpWeight ? 'lbs' : 'kg'} THIS MONTH`
- Central weight block: `fontFamily: "'Space Grotesk'"`, `fontSize: 'clamp(2.5rem, 6vw, 3.5rem)'`, `fontWeight: 700`, `color: 'var(--on-surface)'` displaying `{isImpWeight ? kgToLbs(latestWeight) : latestWeight}`. Beside it: unit label `fontSize: 14`, `color: 'var(--on-surface-variant)'`, `marginLeft: 4` showing `{isImpWeight ? 'lbs' : 'kg'}`
- Trend icon: directly below the weight number. Use `monthDelta` (not `trend`):
  - `monthDelta <= 0` → `<TrendingDown size={20} color="var(--primary)" />`
  - `monthDelta > 0` → `<TrendingUp size={20} color="var(--error)" />`
- Footer row: `display: flex`, `gap: 16`, `marginTop: 16`, `paddingTop: 12`, top border via `borderTop: '1px solid var(--surface-container-highest)'`
  - Left: `"Latest Log"` label (`fontSize: 10`, `textTransform: 'uppercase'`, `color: var(--on-surface-dim)`) + date value `fmt(allUserLogs[allUserLogs.length - 1]?.date || '') ` (`fontSize: 12`, `color: var(--on-surface-variant)`)
  - Right: `"Previous"` label + `{allUserLogs.length >= 2 ? (isImpWeight ? kgToLbs(allUserLogs[allUserLogs.length - 2].weight) : allUserLogs[allUserLogs.length - 2].weight) + ' ' + (isImpWeight ? 'lbs' : 'kg') : '—'}`

**Card B — Weight Trend Chart** (full-width standalone, placed **after** 3 placeholder activity cards, **before** Weight Goal card):
- `glass-card`, `padding: 24`, `borderRadius: 16`, `border: 'none'`, `marginBottom: 16`
- Label: `"WEIGHT TREND"` uppercase `fontSize: 10`, `letterSpacing: '0.15em'`, `color: var(--on-surface-variant)`, `marginBottom: 16`
- Chart: existing `<AreaChart>` + `<Area>` with `type="monotone"`, gradient fill `url(#wg)`, `height: 200`
- `<CartesianGrid>`, `<XAxis>`, `<YAxis>` with `axisLine={false}`, `tickLine={false}`
- `<ReferenceLine>` for goal weight (convert to lbs if `isImpWeight`)
- Keep `<defs>` gradient block and `<GlassTooltip />`

**Updated layout after all refinements:**
```
Row 1: [Weight Snapshot (1fr)] [Metabolic Index (1fr)]   ← g2
Row 2: [Sessions (1fr)] [Streak (1fr)]                   ← g2
Row 3: [Steps (1fr)] [Calories (1fr)] [Water (1fr)]      ← g3
Row 4: [Weight Trend Chart (full)]
Row 5: [Weight Goal (full)]
Row 6: [Live Suggestion Banner (full)]
Row 7: [Iron League (full)]
```

---

#### R2 — Rename "Muscle Activity" → "Iron League"

- Change the label text from `Muscle Activity` → `IRON LEAGUE` (line ~327).
- Change the icon from `<Activity size={13} color="var(--primary)" />` → `<Shield size={13} color="var(--primary)" />`.
- No layout changes. All data (`MiniBodyMap`, `overallRank`, `weeklyMuscles`) identical.
- Note: keep the `Activity` import — it's still used in the Metabolic Index card watermark.

---

#### R3 — Remove "Recent Sessions" Card

- Delete the entire `{/* Recent Sessions */}` JSX block (lines 307–320).
- Remove the `recent` variable declaration (line ~64): `const recent = [...userWo].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 3);`
- Remove `Check` from Lucide imports (verified: not used elsewhere after this deletion).

---

#### R4 — Metabolic Index: Per-Category Insight Text

Add a `getBMIInsight(bmi)` pure function **after imports, before the component** (between line 10 and `export default function DashboardPage()`):

```js
const getBMIInsight = (bmi) => {
  if (!bmi) return '';
  if (bmi < 16)   return "Severely underweight. Consult a nutritionist and increase caloric intake immediately.";
  if (bmi < 18.5) return "You're underweight. A caloric surplus with protein focus will help build lean mass.";
  if (bmi < 25)   return "You're within the healthy range. Maintain current caloric deficit to hit peak definition.";
  if (bmi < 30)   return "Slightly above the healthy range. A moderate deficit and strength training will get you there.";
  if (bmi < 35)   return "Obese range detected. Focus on a sustainable caloric deficit and daily movement.";
  return "High obesity range. Prioritise medical guidance alongside your fitness plan.";
};
```

**Placement in JSX:** **Below** the concentric ring container (after the `div` with `marginBottom: 16` wrapping the ring), and **above** the 2×2 category grid.

```jsx
{/* Insight text — below ring, above category grid */}
<div style={{ fontSize: 11, color: 'var(--on-surface-variant)', textAlign: 'center', padding: '0 8px', lineHeight: 1.4, marginBottom: 12 }}>
  {getBMIInsight(bmi)}
</div>
```

---

#### R5 — 3 Placeholder Activity Cards

**Placement:** New row inserted **after** Sessions/Streak row, **before** Weight Trend Chart.

**Wrapper:** `<div className="g3" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 16 }}>`

**CSS:** `.g3` already exists in `index.css` (mobile collapse to `1fr`). ✓ No CSS change.

**Lucide icons:** `Footprints` and `Droplets` both verified available in `lucide-react@0.577.0`. `Zap` already imported.

**Each card structure** (`glass-card`, `padding: 20`, `borderRadius: 16`, `border: 'none'`):
```jsx
<div className="glass-card" style={{ padding: 20, borderRadius: 16, border: 'none' }}>
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
    <div style={{ fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--on-surface-variant)' }}>{LABEL}</div>
    <div className="ember-glow" style={{ width: 40, height: 40, borderRadius: 12, background: 'var(--surface-container-highest)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <ICON size={18} color="var(--primary)" />
    </div>
  </div>
  <div className="headline-lg" style={{ color: 'var(--primary)', marginBottom: 4 }}>—</div>
  <div style={{ fontSize: 11, color: 'var(--on-surface-variant)', marginBottom: 12 }}>{UNIT}</div>
  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
    <PulseIndicator />
    <span style={{ fontSize: 10, color: 'var(--on-surface-dim)' }}>Coming Soon</span>
  </div>
</div>
```

**Card values:**

| Slot | `LABEL` | `ICON` | `UNIT` |
|------|---------|--------|--------|
| 1 | `DAILY ACTIVITY` | `Footprints` | `steps today` |
| 2 | `CALORIES BURNED` | `Zap` | `kcal today` |
| 3 | `WATER INTAKE` | `Droplets` | `ml today` |

---

#### R6 — Live Suggestion Banner Fixes

**Issues to fix:**
1. **Image crop** — no `objectPosition`; gym image can look misaligned.
2. **Schedule pills missing** — only `name` + `description` shown; need `D1: Push` schedule tags.
3. **No-split CTA misleading** — "START WORKOUT" shown even when no split is set.

**Image fix (line ~286):**
```jsx
<img src="[gym URL]" alt="Gym" style={{
  position: 'absolute', inset: 0,
  width: '100%', height: '100%',
  objectFit: 'cover', objectPosition: 'center 30%',
  opacity: 0.45, filter: 'grayscale(50%)'
}} />
```

**When `activeSplit` exists:** Add schedule pills below description:
```jsx
<>
  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
    <PulseIndicator />
    <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--on-surface)' }}>LIVE SUGGESTION</span>
  </div>
  <div className="headline-md" style={{ color: 'var(--on-surface)', textTransform: 'uppercase', marginBottom: 4 }}>{activeSplit.name}</div>
  <div style={{ fontSize: 13, color: 'var(--on-surface-variant)', marginBottom: 10, maxWidth: '75%' }}>{activeSplit.description}</div>
  {/* Schedule pills — up to 4 */}
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
    {activeSplit.schedule.slice(0, 4).map((d, i) => (
      <div key={i} style={{ padding: '4px 8px', borderRadius: 8, fontSize: 10, fontWeight: 700, background: d === 'Rest' ? 'rgba(255,255,255,0.07)' : 'var(--primary-container)', color: d === 'Rest' ? 'var(--on-surface-dim)' : 'var(--on-primary)', backdropFilter: 'blur(10px)' }}>
        D{i + 1}: {d}
      </div>
    ))}
    {activeSplit.schedule.length > 4 && (
      <div style={{ padding: '4px 8px', borderRadius: 8, fontSize: 10, color: 'var(--on-surface-dim)', background: 'rgba(255,255,255,0.05)' }}>
        +{activeSplit.schedule.length - 4} more
      </div>
    )}
  </div>
</>
```

**CTA button:** Conditional label and route:
- If `activeSplit`: `"START WORKOUT"` → `navigate('/workout')`
- If no split: `"SET UP A SPLIT"` → `navigate('/splits')`

**No-split fallback:**
```jsx
<>
  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
    <PulseIndicator color="var(--on-surface-dim)" />
    <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--on-surface-dim)' }}>NO ACTIVE SPLIT</span>
  </div>
  <div style={{ fontSize: 13, color: 'var(--on-surface-variant)', maxWidth: '75%' }}>
    Set up a training split to get personalised workout recommendations.
  </div>
</>
```

---

### Files to Modify

| File | Change |
|---|---|
| `src/components/pages/DashboardPage.jsx` | All 6 refinements |

> **Note:** No CSS changes needed. `.g3` already exists in `index.css`.

---

### Import Changes

- **Add**: `Footprints`, `Droplets` to Lucide imports
- **Remove**: `Check` from Lucide imports (unused after R3)
- **Keep**: `Activity` (still used in Metabolic Index watermark)

---

### Priority Order (Phase 10 Refinements)

1. **R3** Remove Recent Sessions card + `recent` variable + `Check` import
2. **R1** Split Weight Analysis into snapshot card + standalone trend chart
3. **R4** Add `getBMIInsight()` function + insight text below Metabolic Index ring
4. **R2** Rename "Muscle Activity" → "Iron League" + swap icon to `Shield`
5. **R6** Fix Live Suggestion banner image + schedule pills + conditional CTA
6. **R5** Add 3 placeholder activity cards (Steps / Calories / Water)
7. **Cleanup** Add `Footprints`, `Droplets` imports; remove `Check` import


---

### Change Inventory

| # | Change | Type |
|---|--------|------|
| R1 | Weight Analysis card → match Stitch static weight snapshot; Weight Trend becomes a separate full-width card | Redesign |
| R2 | Rename "Muscle Activity" card → "Iron League" + swap to `Shield` icon | Rename |
| R3 | Remove "Recent Sessions" card entirely | Delete |
| R4 | Metabolic Index card — add per-BMI-range insight text below dial | Enhancement |
| R5 | Add 3 placeholder activity cards: Daily Steps, Calories Burned, Water Intake (3-col row) | New |
| R6 | Live Suggestion banner — fix full image layout, show schedule pills, fix no-split CTA | Bug fix |

---

### Detailed Specs

#### R1 — Weight Analysis Card Split (Stitch Layout)

**Current:** A single combined `glass-card` holds the static weight display (number + delta badge) AND the area chart together.

**Target:** Split into **two separate cards**:

**Card A — Weight Snapshot** (`1fr` in the first row, beside Metabolic Index):
- Label block (top-left): `"WEIGHT ANALYSIS"` uppercase `fontSize: 10` + sub `"PERFORMANCE TREND"` `fontSize: 9` below it
- Delta badge (top-right): pill `background: var(--primary-container)`, `color: var(--on-primary)`, `borderRadius: 999`, `padding: '4px 12px'`, `fontSize: 11`, `fontWeight: 700` — shows `+/-X.X kg/lbs THIS MONTH`
- Central weight: `fontFamily: "'Space Grotesk'"`, `fontSize: 'clamp(2.5rem, 6vw, 3.5rem)'`, `fontWeight: 700`, `color: var(--on-surface)` + unit label `fontSize: 14`, `color: var(--on-surface-variant)` beside it
- Trend icon below weight: `TrendingDown` (delta ≤ 0, `color: var(--primary)`) or `TrendingUp` (delta > 0, `color: var(--error)`)
- Footer row: `Latest Log: [date]` and `Previous: [weight] [unit]` — `fontSize: 11`, `color: var(--on-surface-variant)`, separated by a `1px solid var(--surface-container-highest)` vertical divider

**Card B — Weight Trend Chart** (full-width standalone, placed after Sessions + Streak row):
- `glass-card`, `padding: 24`, `borderRadius: 16`, `border: none`, `marginBottom: 16`
- Label: `"WEIGHT TREND"` uppercase `fontSize: 10`
- Chart: existing Recharts `AreaChart` (`type="monotone"`, gradient fill, `ReferenceLine` for goal), `height: 200`
- Unit-aware (`isImpWeight`): convert Y-axis data and ReferenceLine value
- **Full width** — no column splitting on this row

**Layout after change:**
```
Row 1: [Weight Snapshot (1fr)] [Metabolic Index (1fr)]   ← g2
Row 2: [Sessions (1fr)] [Streak (1fr)]                   ← g2
Row 3: [Steps (1fr)] [Calories (1fr)] [Water (1fr)]      ← g3  (NEW)
Row 4: [Weight Goal (full)]
Row 5: [Weight Trend Chart (full)]                        ← MOVED here
Row 6: [Live Suggestion Banner (full)]
Row 7: [Iron League (full)]
```

---

#### R2 — Rename "Muscle Activity" → "Iron League"

- Change the section label text from `"Muscle Activity"` → `"IRON LEAGUE"`.
- Change the icon in the label from `<Activity size={13} color="var(--primary)" />` → `<Shield size={13} color="var(--primary)" />`.
- The card already uses  `glass-card` — no layout change needed.
- All data (`MiniBodyMap`, `overallRank`, `weeklyMuscles`) stays identical.

---

#### R3 — Remove "Recent Sessions" Card

- Delete the `{/* Recent Sessions */}` JSX block (the full `<div className="glass-card"...>` containing `recent.map(...)`).
- Remove the `recent` variable declaration on line ~64: `const recent = [...userWo].sort(...).slice(0, 3);`
- Remove `Check` from Lucide imports (no longer used after this deletion).

---

#### R4 — Metabolic Index: Per-Category Insight Text

Add a `getBMIInsight(bmi)` pure function near the top of the file (after imports, before the component):

```js
const getBMIInsight = (bmi) => {
  if (!bmi) return '';
  if (bmi < 16)   return "Severely underweight. Consult a nutritionist and increase caloric intake immediately.";
  if (bmi < 18.5) return "You're underweight. A caloric surplus with protein focus will help build lean mass.";
  if (bmi < 25)   return "You're within the healthy range. Maintain current caloric deficit to hit peak definition.";
  if (bmi < 30)   return "Slightly above the healthy range. A moderate deficit and strength training will get you there.";
  if (bmi < 35)   return "Obese range detected. Focus on a sustainable caloric deficit and daily movement.";
  return "High obesity range. Prioritise medical guidance alongside your fitness plan.";
};
```

**Placement in JSX:** Between the `bmiCat.label` span and the 2×2 category grid, inside the Metabolic Index card. Style:
```
fontSize: 11, color: 'var(--on-surface-variant)', textAlign: 'center',
padding: '0 8px', lineHeight: 1.4, marginTop: 12, marginBottom: 12
```

---

#### R5 — 3 Placeholder Activity Cards

**Placement:** New row inserted between Sessions/Streak row and Weight Goal card.

**Wrapper:** `<div className="g3" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 16 }}>`

**CSS check:** Verify `.g3` in `index.css` — it already exists (`.g3{grid-template-columns:1fr!important}` in the `@media(max-width:768px)` block). ✓ No CSS change needed.

**Each card is a `glass-card`:**
```jsx
<div className="glass-card" style={{ padding: 20, borderRadius: 16, border: 'none' }}>
  {/* Top row: label + icon pill */}
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
    <div style={{ fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--on-surface-variant)' }}>{LABEL}</div>
    <div style={{ width: 40, height: 40, borderRadius: 12, background: 'var(--surface-container-highest)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} className="ember-glow">
      <ICON size={18} color="var(--primary)" />
    </div>
  </div>
  {/* Value */}
  <div className="headline-lg" style={{ color: 'var(--primary)', marginBottom: 4 }}>—</div>
  <div style={{ fontSize: 11, color: 'var(--on-surface-variant)', marginBottom: 12 }}>{UNIT}</div>
  {/* Coming soon tag */}
  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
    <PulseIndicator />
    <span style={{ fontSize: 10, color: 'var(--on-surface-dim)' }}>Coming Soon</span>
  </div>
</div>
```

**Card values:**

| Slot | `LABEL` | `ICON` | `UNIT` |
|------|---------|--------|--------|
| 1 | `DAILY ACTIVITY` | `Footprints` | `steps today` |
| 2 | `CALORIES BURNED` | `Zap` | `kcal today` |
| 3 | `WATER INTAKE` | `Droplets` | `ml today` |

**Import note:** Add `Footprints` and `Droplets` to Lucide imports. If `Footprints` is unavailable in the installed lucide-react version, use `MapPin` as fallback (check available version first with `npm list lucide-react`).

---

#### R6 — Live Suggestion Banner Fixes

**Issues to fix:**
1. **Image misalignment** — `objectPosition` not set; gym image sometimes shows wrong crop.
2. **Schedule pills missing** — only name + description shown; should also show `D1: Push` etc.
3. **No-split state has wrong CTA** — "START WORKOUT" when no split exists is confusing.

**Implementation:**

Image element:
```jsx
<img
  src="[gym URL]"
  alt="Gym"
  style={{
    position: 'absolute', inset: 0,
    width: '100%', height: '100%',
    objectFit: 'cover', objectPosition: 'center 30%',
    opacity: 0.45, filter: 'grayscale(50%)'
  }}
/>
```

When `activeSplit` exists — content block:
```jsx
<div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
  <PulseIndicator />
  <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--on-surface)' }}>LIVE SUGGESTION</span>
</div>
<div className="headline-md" style={{ color: 'var(--on-surface)', textTransform: 'uppercase', marginBottom: 4 }}>
  {activeSplit.name}
</div>
<div style={{ fontSize: 13, color: 'var(--on-surface-variant)', marginBottom: 10, maxWidth: '75%' }}>
  {activeSplit.description}
</div>
{/* Schedule pills — up to 4 */}
<div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
  {activeSplit.schedule.slice(0, 4).map((d, i) => (
    <div key={i} style={{ padding: '4px 8px', borderRadius: 8, fontSize: 10, fontWeight: 700, background: d === 'Rest' ? 'rgba(255,255,255,0.07)' : 'var(--primary-container)', color: d === 'Rest' ? 'var(--on-surface-dim)' : 'var(--on-primary)', backdropFilter: 'blur(10px)' }}>
      D{i + 1}: {d}
    </div>
  ))}
  {activeSplit.schedule.length > 4 && (
    <div style={{ padding: '4px 8px', borderRadius: 8, fontSize: 10, color: 'var(--on-surface-dim)', background: 'rgba(255,255,255,0.05)' }}>
      +{activeSplit.schedule.length - 4} more
    </div>
  )}
</div>
```

CTA button (always `position: absolute`, `bottom: 24`, `right: 24`):
- If `activeSplit`: label `"START WORKOUT"` → `navigate('/workout')`
- If no split: label `"SET UP A SPLIT"` → `navigate('/splits')`

No-split fallback content (when `activeSplit` is null):
```jsx
<div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
  <PulseIndicator color="var(--on-surface-dim)" />
  <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--on-surface-dim)' }}>NO ACTIVE SPLIT</span>
</div>
<div style={{ fontSize: 13, color: 'var(--on-surface-variant)', maxWidth: '75%' }}>
  Set up a training split to get personalised workout recommendations.
</div>
```

---

### Files to Modify

| File | Change |
|---|---|
| `src/components/pages/DashboardPage.jsx` | All 6 refinements |
| `src/index.css` | Verified `.g3` exists — no change needed |

---

### New Imports Needed

- **Add**: `Footprints`, `Droplets` (Lucide) — verify availability with `npm list lucide-react` before adding
- **Remove**: `Check` (unused after R3 Recent Sessions removal)

---

### Priority Order (Phase 10 Refinements)

1. **R3** Remove Recent Sessions card
2. **R1** Split Weight Analysis into snapshot card + standalone trend chart
3. **R4** Add `getBMIInsight()` to Metabolic Index card
4. **R2** Rename to "Iron League" + swap icon
5. **R6** Fix Live Suggestion banner image + schedule pills + CTA
6. **R5** Add 3 placeholder activity cards
7. **Cleanup** Import additions/removals

---

## Phase 10.1 — Post-Implementation Bug Fixes (Completed)

This phase addressed specific UI bugs and layout adjustments following the initial Phase 10 implementation on the Dashboard.

### Objectives

1.  **Weight Analysis Card Alignment**: Restructured the "Weight Analysis" card to identically match the Stitch design reference. Swapped the label out for "PERFORMANCE TREND" as a small subtitle, and made "WEIGHT ANALYSIS" the bold primary headline. Moved "CURRENT" and "PREVIOUS" weight statistics into a side-by-side flex layout beneath the primary weight value.
2.  **Live Suggestion Banner Overlap**: Fixed the overlapping issue where the "START WORKOUT" button blocked the D1/D2/D3 schedule pills. Removed `position: absolute` from the button, placing it within the standard document flex flow below the schedule pills with a `16px` margin.
3.  **Live Suggestion Banner Image Grayscale**: Adjusted the background image filter from `grayscale(50%)` to `grayscale(100%)` and tweaked opacity to `0.5` to achieve the fully desaturated, high-contrast look present in the original design.
4.  **Log Weight Button Sizing**: Shrunk the "Log Weight" header button by approximately 30% (padding from `10px 18px` to `7px 13px`, font size from `13px` to `10px`) to better balance the header hierarchy.
5.  **Dashboard Theme Toggle Integration**: Reintroduced the `ThemeTogglePill` directly onto the Dashboard page header, positioned just under the Log Weight button. Additionally, reduced the text size within the toggle pill by 10% (from `8px` to `7px`) across the entire application.
6.  **Navigation Active State Coloring**: Updated the active icon color for both the mobile Bottom Navigation and the desktop Sidebar Navigation. Swapped the softer peach `var(--primary)` color for the more vibrant orange `var(--primary-container)` (`#F85F1B`) for better visual distinction when a tab is active.

### Files Modified

*   `src/components/pages/DashboardPage.jsx` (Fixes 1-5)
*   `src/components/shared/SharedComponents.jsx` (Fix 5: ThemeTogglePill font size)
*   `src/index.css` (Fix 6: `.ni.act` color variable)
*   `src/components/layout/Layout.jsx` (Fix 6: BottomNav active color variables)

---

## Phase 10.2 — Gap Analysis: Weight Analysis Card vs Stitch Reference (Completed)

After reviewing the Phase 10.1 implementation against the original Stitch reference screenshot, the following discrepancies remain on the **Weight Analysis card only**. All other 10.1 fixes (banner overlap, grayscale, button shrink, theme toggle, nav color) are complete and accurate.

### Gap 1 — "WEIGHT ANALYSIS" Title Size

**Stitch reference**: The title "WEIGHT ANALYSIS" is rendered in very large, heavy text — it visually spans two lines and dominates the top half of the card. It appears to be at least `headline-lg` scale (`clamp(1.5rem, 3vw, 2rem)`) or larger.

**Current implementation**: Uses `headline-md` (`1.5rem` / 24px), which appears noticeably smaller than the reference.

**Planned fix**: Change from `className="headline-md"` to `className="headline-lg"` on the "WEIGHT ANALYSIS" text in `DashboardPage.jsx` line 156.

---

### Gap 2 — Decorative Mini-Sparkline / Trend Curve

**Stitch reference**: A subtle **orange/coral curved SVG line** runs across the lower portion of the card, sweeping from left to right between and below the CURRENT and PREVIOUS values. This gives the card its "Performance Trend" visual identity.

**Current implementation**: No decorative curve exists. The bottom of the card is just the CURRENT / PREVIOUS flex row with no visual element connecting them.

**Planned fix**: Add a lightweight inline `<svg>` element (or a `position: absolute` CSS pseudo-element) between the header and the numbers row. The curve should:
- Use `stroke: var(--primary-container)` (`#F85F1B`) at ~30% opacity
- Be a simple quadratic Bézier (`<path>` with `Q` command) sweeping from bottom-left to center-right
- Sit behind the numbers with `position: absolute` and low `z-index`
- Not interfere with the text layout

Example SVG approach:
```jsx
<svg
  viewBox="0 0 300 80"
  style={{
    position: 'absolute',
    bottom: 20,
    left: 0,
    width: '100%',
    height: 80,
    opacity: 0.3,
    pointerEvents: 'none'
  }}
>
  <path
    d="M 0 60 Q 100 10, 200 40 T 300 20"
    fill="none"
    stroke="#F85F1B"
    strokeWidth="2"
  />
</svg>
```

The card's `<div>` wrapper needs `position: relative` (already has it via glass-card styling) for this to work.

---

### Gap 3 — Trend Arrow Placement

**Stitch reference**: The small orange down-arrow appears **horizontally between** the CURRENT and PREVIOUS values, roughly at the midpoint, visually sitting on or near the sparkline curve.

**Current implementation**: The `TrendingDown`/`TrendingUp` icon is placed **below** the CURRENT weight number in a separate `<div>` with `marginTop: 4`.

**Planned fix**: Move the trend icon out of the CURRENT column and into the flex gap between CURRENT and PREVIOUS. Restructure the bottom flex row to be a 3-part layout:
```
[ CURRENT column ] [ Trend Icon (centered) ] [ PREVIOUS column ]
```
The icon should be vertically centered relative to the numbers and use `alignSelf: 'center'`.

---

### Files to Modify

| File | Change |
|---|---|
| `src/components/pages/DashboardPage.jsx` | All 3 gaps (title size, SVG sparkline, icon position) |

### Priority Order

1. **Gap 1** — Title size (`headline-md` → `headline-lg`) — trivial, 1 line
2. **Gap 3** — Trend arrow placement — small restructure of flex layout
3. **Gap 2** — Mini-sparkline SVG — new visual element, needs positioning tuning
