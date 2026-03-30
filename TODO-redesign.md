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
- [ ] Create `.stitch/` directory in project root
- [ ] Translate `DESIGN.md` (Kinetic Elite spec) into `.stitch/DESIGN.md` following the taste-design output format:
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
- [ ] Ensure `.stitch/DESIGN.md` includes hex codes in parentheses after every descriptive name
- [ ] Validate that the DESIGN.md uses natural language descriptions (not Tailwind classes) per taste-design best practices

### 0.2 Stitch MCP Prototype Screens (Visual Validation)
Before coding, generate reference screens in Stitch to validate the Obsidian Performance aesthetic.
- [ ] Create Stitch project (or use existing) via `create_project` → title: "FitTrack Pro — Kinetic Elite"
- [ ] Generate **Dashboard** screen via `generate_screen_from_text` using Enhanced Prompt Pipeline:
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
- [ ] Generate **Workout** screen with exercise grid, bottom-bar inputs, floating timer
- [ ] Generate **Diet** screen with macro rings and food log cards
- [ ] Download all generated HTML + screenshots to `.stitch/designs/` via `curl`
- [ ] Review screens with user — iterate via `edit_screens` if needed
- [ ] Use approved screens as visual reference during Phase 2–3 code implementation

---

## Phase 1 — Design Token Foundation

The entire CSS variable system must be rebuilt to match the Kinetic Elite spec. This phase touches `index.css` only — no component changes.

### 1.1 Replace Font Import
- [ ] Remove `Bebas Neue` + `DM Sans` Google Fonts import
- [ ] Add `Space Grotesk` (weights: 500, 700) + `Be Vietnam Pro` (weights: 400, 500, 600, 700)
- [ ] Update `body { font-family }` to `'Be Vietnam Pro', sans-serif`

### 1.2 Replace Color Token System (Dark Theme)
- [ ] Redefine `--bg` → `#131315` (was `#050506`)
- [ ] Replace 3-tier surface (`--c1/c2/c3`) with 5-tier system:
  - `--surface`: `#131315`
  - `--surface-container-lowest`: `#0E0E10`
  - `--surface-container-low`: `#1A1A1D`
  - `--surface-container`: `#212124`
  - `--surface-container-high`: `#2B2B2E`
  - `--surface-container-highest`: `#353437`
  - `--surface-variant`: `#353437` (used at 60% opacity for glass)
- [ ] Redefine orange accent tokens:
  - `--primary`: `#FFB59B` (peach — for text/icon accents)
  - `--primary-container`: `#F85F1B` (deep ember — for fills/CTAs)
  - `--on-primary`: `#FFFFFF`
  - `--signature-gradient`: `linear-gradient(135deg, #FFB59B, #F85F1B)` ("burning ember")
- [ ] Redefine text color tokens:
  - `--on-surface`: `#EAEAF0` (primary text)
  - `--on-surface-variant`: `#E3BFB3` (secondary text — warm, NOT grey)
  - `--on-surface-dim`: `#6E6E76` (tertiary/metadata)
- [ ] Redefine border tokens:
  - `--outline-variant`: `rgba(90, 65, 56, 0.15)` ("ghost border" — 15% opacity only)
  - Remove `--bd` and `--bd2` (solid borders are banned)
- [ ] Redefine shadow tokens:
  - `--shadow-ambient`: `0 20px 40px rgba(0,0,0,0.4)` (diffused only)
  - `--glow-primary`: `0 0 20px rgba(255,181,155,0.10)` (LED emission)
  - Remove  `--shadow` and `--shadow-lg` (standard drops are banned)
- [ ] Add glassmorphism tokens:
  - `--glass-bg`: `rgba(53, 52, 55, 0.60)`
  - `--glass-blur`: `blur(20px)`
  - `--glass-blur-sm`: `blur(12px)`

### 1.3 Replace Typography Scale
- [ ] Remove `.bb` class (Bebas Neue reference)
- [ ] Add new typography utility classes:

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
- [ ] Remove `.sep` class entirely
- [ ] Remove `.row-sep` border-bottom rule
- [ ] Remove `.dv` divider (line-based)
- [ ] Add `.tonal-break` class that uses background-color shift instead of lines

### 1.5 Update Light Theme Tokens (Warm Beige Direction)
- [ ] Rebase light theme to warm beige/cream palette instead of neutral white:
  - `--surface`: `#F5F0EB` (warm linen)
  - `--surface-container-lowest`: `#EDE7E0` (recessed warm)
  - `--surface-container-low`: `#FAF6F2` (lifted cream)
  - `--surface-container`: `#FFFFFF` (card white)
  - `--surface-container-high`: `#FFFFFF`
  - `--surface-container-highest`: `#FFFFFF`
- [ ] Update accent colors to match the peach/ember palette in light context
- [ ] Ensure "No-Line" rule also applies in light theme (tonal shifts, not borders)
- [ ] Secondary text uses warm tones (e.g., `#7A6B62`) instead of cold greys

### 1.6 Motion & Animation Philosophy (NEW — Gap G3/G6)
Define the unified motion engine in `index.css` as CSS custom properties and keyframes.
- [ ] Define spring-physics-style easing tokens:
  - `--ease-spring`: `cubic-bezier(0.175, 0.885, 0.32, 1.275)` (overshoot for interactive elements)
  - `--ease-smooth`: `cubic-bezier(0.4, 0, 0.2, 1)` (standard Material-like)
  - `--ease-decel`: `cubic-bezier(0, 0, 0.2, 1)` (entry)
  - `--ease-accel`: `cubic-bezier(0.4, 0, 1, 1)` (exit)
- [ ] Add **staggered cascade reveal** keyframe for list/card mounting:
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
- [ ] Add **perpetual pulse** keyframe for live indicators:
  ```css
  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50%      { opacity: 0.5; transform: scale(1.15); }
  }
  ```
- [ ] Add **shimmer** keyframe for premium loading states:
  ```css
  @keyframes shimmer {
    0%   { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
  ```
- [ ] **Performance constraint:** All animations must use ONLY `transform` and `opacity`. Never animate `top`, `left`, `width`, `height`, `margin`, or `padding`
- [ ] Replace current `pgIn` / `pgOut` page transition keyframes with spring-eased variants

### 1.7 Anti-Pattern Enforcement List (NEW — Gap G4)
Add explicit CSS-level guardrails. These are documented in `.stitch/DESIGN.md` and enforced in Phase 5 audit.
- [ ] Add comment block in `index.css` header:
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
- [ ] Add `clamp()` typography scaling for display/headline classes:
  ```css
  .display-lg { font-size: clamp(2.5rem, 5vw, 3.5rem); }
  .headline-lg { font-size: clamp(1.5rem, 3vw, 2.0rem); }
  ```
- [ ] Ensure body text minimum is `0.875rem` (14px) — never smaller
- [ ] Add `min-height: 100dvh` rule (not `100vh`) for full-height sections (iOS Safari fix)
- [ ] Ensure all interactive elements have minimum `44px` touch targets (already partially done — verify)
- [ ] Add mobile-first collapse rule: all multi-column grids → single column below 768px (existing — verify coverage)
- [ ] Verify no horizontal overflow on mobile — add `overflow-x: hidden` on `body` (existing — keep)

---

## Phase 2 — Core Component Reskin

All shared components in `SharedComponents.jsx` and `Layout.jsx` must be updated.

### 2.1 Card System
- [ ] Remove `border: 1px solid var(--bd)` from `.card` class
- [ ] Remove `::before` gradient pseudo-element
- [ ] Replace `box-shadow: var(--shadow)` with `box-shadow: none` (tonal layering only)
- [ ] Use `background: var(--surface-container-low)` on `--surface` pages to create depth
- [ ] Add `.card-float` variant for floating elements using `box-shadow: var(--shadow-ambient)`
- [ ] Remove `.card-p` class or merge into new system
- [ ] Ensure all rounded corners stay within 12px–24px scale
- [ ] Add **staggered cascade animation** to card lists (`.cascade-item` class from Phase 1.6)

### 2.2 Button System
- [ ] `.btn-p`: Update gradient to `var(--signature-gradient)`, border-radius to `1.5rem` (24px), remove border
- [ ] `.btn-p:hover`: Use orange glow (`var(--glow-primary)`) instead of transform lift
- [ ] `.btn-g` (ghost button): Remove border, use `var(--surface-container-highest)` fill, white text
- [ ] `.btn-d` (outline button): Replace solid border with ghost border at 20% opacity

### 2.3 Input System
- [ ] Remove full border from `input, select, textarea`
- [ ] Use `var(--surface-container-lowest)` as background
- [ ] Add `border-bottom: 2px solid transparent` (default)
- [ ] On focus: `border-bottom-color: var(--primary-container)` — no box border, no focus ring glow
- [ ] Update `label` styles to use `.label-md` class

### 2.4 Modal System
- [ ] `.mo` (overlay): Keep `backdrop-filter: blur(16px)`, add surface-dim for background scrim
- [ ] `.md` (modal card): Apply glassmorphism — `background: var(--glass-bg)`, `backdrop-filter: var(--glass-blur)`, remove border
- [ ] Add rounded corners at 24px (already 28px — bring down to 24px to match scale)

### 2.5 Navigation — Sidebar
- [ ] Remove all `border-right`, `borderBottom`, `borderTop` on sidebar dividers
- [ ] Replace with tonal background shifts between sections
- [ ] Apply glassmorphism to sidebar: `background: var(--glass-bg)`, `backdrop-filter: var(--glass-blur)`
- [ ] Update `.ni.act` (active nav item): Use `--glow-primary` for active state
- [ ] Replace `Bebas Neue` branding in header with `Space Grotesk` `.headline-md`

### 2.6 Navigation — Bottom Nav (Mobile)
- [ ] Apply glassmorphism: `background: var(--glass-bg)`, `backdrop-filter: var(--glass-blur)`
- [ ] Remove `border-top: 1px solid`
- [ ] Update "More" sheet to also use glassmorphism + remove border

### 2.7 Tags & Chips
- [ ] Update `.tag` to use `var(--surface-container-low)` background
- [ ] For selected state: add ghost border with `var(--primary)` at 20% opacity
- [ ] Use `.label-md` for text styling

### 2.8 Toast System
- [ ] Apply glassmorphism to toast containers
- [ ] Remove explicit borders
- [ ] Maintain backdrop-filter blur (already has blur — keep)
- [ ] Use spring-eased entry animation (`var(--ease-spring)`) instead of linear/ease

### 2.9 StatCard Component
- [ ] Replace `className="bb"` with `className="display-lg"` for hero numbers
- [ ] Replace icon container orange glow with LED emission glow (`box-shadow: var(--glow-primary)`)
- [ ] Remove card border (handled by Phase 2.1)
- [ ] Update secondary text color from `var(--t2)` to `var(--on-surface-variant)` (#E3BFB3)

### 2.10 PageHeader Component
- [ ] Replace `className="bb pt"` with `className="headline-lg"`
- [ ] Replace `.abar` accent bar with a subtle gradient underline using `--signature-gradient`
- [ ] Update subtitle color to `var(--on-surface-variant)`

### 2.11 EmptyState Component
- [ ] Replace `className="bb"` with `className="headline-md"`
- [ ] Replace dashed border with tonal card background
- [ ] Apply LED glow to icon container

### 2.12 ConfirmDialog
- [ ] Replace `className="bb"` with `className="headline-md"`
- [ ] Apply glassmorphism to modal content

### 2.13 ScrollPicker
- [ ] Replace `fontFamily: "'Bebas Neue'"` with `'Space Grotesk'`
- [ ] Update fade gradients to use new surface tokens
- [ ] Replace `.picker-wrap` border with ghost border or remove

---

## Phase 3 — Page-Level Reskin

Each page must be audited and updated to comply with the new design language.

### 3.1 DashboardPage
- [ ] Replace all `className="bb"` with appropriate token class (`display-lg`, `headline-lg`, etc.)
- [ ] Replace all `border-bottom`, `borderBottom` inline styles with tonal shifts or whitespace
- [ ] Update all `color: 'var(--t2)'` → `color: 'var(--on-surface-variant)'`
- [ ] Update all `background: 'var(--c1)'` → `background: 'var(--surface-container-low)'`
- [ ] Update all `background: 'var(--c2)'` → `background: 'var(--surface-container)'`
- [ ] Update weight chart tooltip to use glassmorphism
- [ ] Replace flat progress bars with **Progress Orbs** (concentric circles) for volume visualization (**Dashboard only** — other pages keep flat bars for space efficiency)
- [ ] Add **Pulse indicator** next to active workout sessions
- [ ] Make hero weight number use `display-lg` (3.5rem) with **intentional editorial bleed** — let numbers overflow container margins by ~10-15% for a high-fashion HUD feel

### 3.2 WorkoutPage
- [ ] Replace all borders with tonal shifts
- [ ] Update exercise row grid (`.ex-r`) separators — remove `row-sep`, use spacing
- [ ] Replace `bb` class references with Space Grotesk classes
- [ ] Update input fields to bottom-bar style
- [ ] Apply glassmorphism to floating workout timer (if present)

### 3.3 SplitsPage
- [ ] Replace split card borders with tonal layering
- [ ] Update split icons container with LED glow on active
- [ ] Replace all typography references

### 3.4 DietPage
- [ ] Replace all borders and separators
- [ ] Update stat displays with new typography scale
- [ ] Replace calorie log card borders with tonal backgrounds

### 3.5 ProfilePage
- [ ] Replace all borders
- [ ] Update form inputs to bottom-bar style
- [ ] Update toggle components with new accent colors

### 3.6 MuscleMapPage
- [ ] Replace all typography references
- [ ] Update muscle group chips to new tag system
- [ ] Replace card borders with tonal shifts

### 3.7 ProgressPage
- [ ] Replace progress bars with Progress Orbs
- [ ] Update chart tooltips to glassmorphism
- [ ] Replace all borders and separators

### 3.8 WeightLogPage & MeasurementsPage
- [ ] Replace borders, update typography, apply tonal cards
- [ ] Update input styles to bottom-bar

### 3.9 WorkoutHistoryPage
- [ ] Replace all borders with tonal layering
- [ ] Update history card styles

### 3.10 ContactPage
- [ ] Apply glassmorphism to contact form card
- [ ] Update form inputs to bottom-bar style

### 3.11 AuthModal
- [ ] Apply glassmorphism to auth modal
- [ ] Update input fields to bottom-bar style
- [ ] Update Google button styling

---

## Phase 4 — New Custom Components

### 4.1 Progress Orbs (Dashboard Only)
- [ ] Create `ProgressOrb` component — concentric SVG circles with `tertiary_container` gradients
- [ ] Use on **Dashboard only** — other pages keep flat `pbar` for space efficiency
- [ ] Animate fill on mount with a smooth arc transition using `var(--ease-spring)`
- [ ] Add a perpetual subtle shimmer micro-animation on the filled arc

### 4.2 Pulse Indicator
- [ ] Create `PulseIndicator` component — small `primary`-colored dot with CSS `@keyframes pulse` animation
- [ ] Add next to "Live Workout" text / active workout session indicator
- [ ] Use `animation: pulse 2s var(--ease-smooth) infinite` — spring feel, not linear
- [ ] This is a **perpetual micro-interaction** per taste-design §8

### 4.3 Glassmorphic Tooltip
- [ ] Create `GlassTooltip` component for Recharts chart tooltips
- [ ] Apply `backdrop-filter: var(--glass-blur-sm)`, `background: var(--glass-bg)`, no border
- [ ] Use in all chart `<Tooltip content={...} />` slots

### 4.4 Skeleton Shimmer Loader (NEW — Gap G6 alignment)
- [ ] Update existing `Skeleton` component to use the new `shimmer` keyframe from Phase 1.6
- [ ] Ensure skeleton dimensions match actual layout dimensions (taste-design §5: no generic circular spinners)
- [ ] Use `background: linear-gradient(90deg, var(--surface-container-low) 25%, var(--surface-container-high) 50%, var(--surface-container-low) 75%)` with `background-size: 200%`

---

## Phase 5 — Polish & Verification

### 5.1 Audit: No-Line Rule
- [ ] `grep` entire codebase for `border:`, `border-bottom:`, `border-top:`, `border-left:`, `border-right:` (inline styles)
- [ ] `grep` for `1px solid` in index.css
- [ ] Remove or replace every instance with tonal shift or whitespace
- [ ] Exception: Ghost borders at 15% opacity are allowed for accessibility

### 5.2 Audit: Typography Migration
- [ ] `grep` for `Bebas Neue` — must be zero matches
- [ ] `grep` for `DM Sans` — must be zero matches
- [ ] `grep` for `className="bb"` — must be zero matches
- [ ] `grep` for `.bb` in CSS — must be zero matches

### 5.3 Audit: Old Token References
- [ ] `grep` for `var(--c1)`, `var(--c2)`, `var(--c3)` — must be zero matches
- [ ] `grep` for `var(--bd)` and `var(--bd2)` — must be zero matches
- [ ] `grep` for `var(--t2)`, `var(--t3)`, `var(--t4)` — must be zero matches
- [ ] `grep` for `var(--shadow)` and `var(--shadow-lg)` — must be zero matches

### 5.4 Audit: Corner Radius
- [ ] `grep` for `border-radius` values — all must be within 12px–24px scale (0.75rem–1.5rem)
- [ ] No sharp 90° corners anywhere

### 5.5 Audit: Anti-Patterns (NEW — Gap G4)
- [ ] `grep` for `#000000` or `#000` — must be zero matches (pure black banned)
- [ ] `grep` for `linear` in animation/transition — verify no linear easing (spring/cubic-bezier only)
- [ ] `grep` for `animate.*top\|animate.*left\|animate.*width\|animate.*height` — must be zero (layout properties banned)
- [ ] `grep` for `100vh` — must be zero (use `100dvh` for iOS Safari)
- [ ] Verify all accent colors have saturation below 80%

### 5.6 Audit: Motion & Stagger (NEW — Gap G3/G6)
- [ ] Verify all list/card groups use `.cascade-item` staggered entry
- [ ] Verify no components mount instantly without animation
- [ ] Verify PulseIndicator has perpetual infinite-loop animation
- [ ] Verify all animations use only `transform` and `opacity` (no layout properties)
- [ ] Check spring easing is used for interactive elements (buttons, toggles)

### 5.7 Audit: Responsive (NEW — Gap G5)
- [ ] Test on 375px viewport — verify single-column collapse
- [ ] Verify no horizontal scroll on any page at 375px
- [ ] Verify all tap targets ≥ 44px
- [ ] Verify `clamp()` is used for display/headline typography
- [ ] Verify body text never drops below 14px

### 5.8 Visual Verification
- [ ] Run `npm run dev` and verify each page:
  - [ ] Dashboard — hero numbers at 56px, no borders, tonal cards, progress orbs, staggered card reveal
  - [ ] Workout — exercise grid uses spacing not lines, inputs have bottom-bar focus
  - [ ] Splits — cards float with tonal layering, no borders, cascade entry animation
  - [ ] Diet — stat cards use new typography, warm secondary text
  - [ ] Profile — inputs with bottom-bar, no border boxes
  - [ ] Muscle Map — chips use tonal styling, no sharp borders
  - [ ] History — history rows separated by whitespace, not lines
  - [ ] Modals — glassmorphism on overlay and content card
  - [ ] Bottom Nav (mobile) — glass effect, no top border
  - [ ] Sidebar (desktop) — glass effect, no section borders
- [ ] Verify light theme parity (warm beige — all token changes reflected)
- [ ] Test on mobile viewport (375px) — ensure touch targets and spacing are maintained
- [ ] Screen reader test — ensure ghost borders provide sufficient visual separation for accessibility

### 5.9 Stitch Cross-Reference (NEW — Gap G7/G9)
- [ ] Compare implemented pages side-by-side with Stitch-generated reference screens from Phase 0.2
- [ ] Ensure coded output matches the approved Stitch mockups in: color, typography, spacing, motion
- [ ] Document any intentional deviations in `.stitch/DEVIATIONS.md`

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
- [ ] Remove the existing `← Back` button from the session header (replaced by `Discard` at bottom)

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
