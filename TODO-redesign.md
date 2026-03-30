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

- [ ] Add `rawDate: log.date` to each `cd` entry (preserves the original ISO string)
- [ ] Add `dayName: days.find(d => d.id === log.dayId)?.name || 'Session'` to each `cd` entry
- [ ] Final `cd` shape per entry:
  ```js
  { date: fmt(log.date), rawDate: log.date, dayName, maxWeight, volume, avgReps, sets, est1rm }
  ```

---

### 8.1 Rename Page Title (Display Only)
- [ ] Change the `<PageHeader title="Progress Charts" sub="Track your strength gains" />` to:
  - Title: `"Workout Analytics"` (matches the new screen identity)
  - Sub: `"Performance data per exercise"` (more precise for analytics context)
- [ ] ~~Add a super-label above the headline~~ — **Removed:** the `"Performance Analytics"` super-label lives in the hero exercise section (8.2) only, to avoid duplication

---

### 8.2 Hero Exercise Name Display
**When an exercise is selected (`se` is set), replace the plain `headline-md` exercise name with an asymmetric editorial hero title.**

- [ ] Wrap the exercise name in a new hero section (replaces the current plain `<div className="headline-md">`):
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
- [ ] Only render this hero section when `se` is set — fallback to the empty state path as before
- [ ] On mobile (< 480px), reduce to `clamp(2rem, 10vw, 3rem)` via responsive CSS or inline clamp

---

### 8.3 Key Stats Bento Grid (Top Stat Cards)
**Replace the current `StatCard` row with a bento-style 3-column grid matching the reference's 1RM / Max Weight / Total Sets cards.**

- [ ] Render the bento grid when `se && cd.length > 0`:
  ```
  Grid layout: 3 columns on md+, 1 column on mobile
  Cards use: bg-surface-container-low, rounded-2xl (1.5rem), no border
  ```
- [ ] **Card 1 — Estimated 1RM** (Primary accent card):
  - Left border accent: `border-left: 4px solid var(--primary)` — the only border allowed (accent rule exception)
  - Super-label: `"ESTIMATED 1RM"` in `.label-md`
  - Hero number: `est1rm` value in `.display-lg` (Space Grotesk, ~3.5rem)
  - Unit: `"KG"` in `on-surface-variant`, `font-bold`
  - Trend: Pull from `cd` — compare last value to first value. Show `▲ +X kg vs first session` in `var(--success)` or `▼` in `var(--danger)`
  - ⚠️ **Token check:** verify `--success` and `--danger` survive the Phase 1 token migration — they're semantic colors not part of the M3 surface system. If removed, re-add as `--success: #51CF66` / `--danger: #FF6B6B` in the new token set

- [ ] **Card 2 — Personal Record (Max Weight)**:
  - Super-label: `"PERSONAL RECORD"` in `.label-md`
  - Hero number: `pr` value in `.display-lg`
  - Unit: `"KG"`
  - Sub-label: `"Achieved: {date of session with max weight}"` — use `cd.find(d => d.maxWeight === pr)?.rawDate` (requires the `rawDate` field from Pre-Requisite above)
  - No left border

- [ ] **Card 3 — Total Sessions**:
  - Super-label: `"TOTAL SESSIONS"` in `.label-md`
  - Hero number: `cd.length` in `.display-lg`
  - Unit: `"SESSIONS"`
  - Sub-label: Pull `monthlySummary.avgPerWeek` → `"~{avg} per week"` 
  - No left border

- [ ] Apply `cascade-item` staggered animation (Phase 1.6) to the 3 cards

---

### 8.4 Volume Trend Chart (Primary Chart — Hero Section)
**Elevate the Volume (reps × kg) BarChart to a full-width hero section with a premium glass card treatment.**

- [ ] Move the `volume` bar chart out of the 2-column grid and into a standalone full-width section above the chart grid
- [ ] Wrap in a `rounded-[2rem] bg-surface-container-low p-8 shadow-2xl overflow-hidden` card (matching the reference's `rounded-[2rem]` section)
- [ ] **Card header row:**
  - Left: `"VOLUME TREND"` in `.headline-md`, Space Grotesk — plus a sub-label `"Total load lifted per session"` in `on-surface-variant`
  - Right: Time range pill buttons `[1M] [3M] [6M]` — visual only for now (state wiring is a future task; default shows all `cd` data)
  - **Default active pill:** `1M` starts with the active style; `3M` and `6M` are inactive
  - Active pill style: `bg-surface-container-highest rounded-lg px-3 py-1 text-xs font-bold`
  - Inactive pill style: `text-on-surface-variant rounded-lg px-3 py-1 text-xs font-bold` (no bg fill)

- [ ] **Chart upgrades (BarChart for volume):**
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

- [ ] Render only when `se && cd.length > 0`
- [ ] Two-column layout (below chart): `lg:grid-cols-5` — Left col `lg:col-span-2`, Right col `lg:col-span-3`
- [ ] **Personal Best card** (`lg:col-span-2`):
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

- [ ] **Focus Groups card** (below PB card, same `lg:col-span-2`):
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

- [ ] In the right `lg:col-span-3` column, render the last 5 sessions from `cd` (sorted by date desc)
- [ ] **Section header:**
  - Left: `"RECENT SESSIONS"` in `.headline-md`
  - Right: `"View All"` text-link style in `text-primary text-xs font-bold underline cursor-pointer`
- [ ] **Session row card** (per `cd` entry):
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
- [ ] Apply `cascade-item` stagger to each session row

---

### 8.7 Secondary Charts Section (Collapsed Grid)
**Keep the `est1rm` Area chart and `avgReps` Line chart in a 2-column subordinate grid below the session log.**

- [ ] Move this grid below the 5-column layout (PB card + session log)
- [ ] Grid: `grid-cols-1 md:grid-cols-2 gap-4`
- [ ] Card wrapper: `bg-surface-container-low rounded-2xl p-6` — no border
- [ ] Chart header uses `.label-md` + `<TrendingUp size={14} color="var(--primary)" />` icon inline
- [ ] Chart height: 160px (subordinate, less prominent than the hero volume chart)
- [ ] **Replace tooltip styling** — the current charts reference `boxShadow: 'var(--shadow-md)'` which **doesn't exist** in `index.css` (resolves to nothing). Replace with the same glassmorphic tooltip from 8.4:
  ```js
  contentStyle={{ background: 'var(--glass-bg)', backdropFilter: 'blur(12px)', border: 'none', borderRadius: 12, fontSize: 12, color: 'var(--on-surface)', fontWeight: 600 }}
  ```
- [ ] Remove the Max Weight AreaChart from this grid (it's redundant with the PB bento card above)
- [ ] Remove the Volume BarChart from this grid (it's now the hero section in 8.4)
- [ ] **Grid now contains only 2 charts:** `Est. 1RM over time` (Area) + `Avg Reps/Set` (Line)

---

### 8.8 Filter Controls (Dropdowns) — Reskin
**Keep the 3 dropdowns (Split, Day, Exercise) but upgrade their visual styling to match the Kinetic Elite input system.**

- [ ] Move the filter row between the page header and the hero exercise display (before any exercise-specific content)
- [ ] Grid: `grid-cols-1 md:grid-cols-3 gap-3`
- [ ] Labels: `.label-md` style (`text-xs uppercase tracking-widest on-surface-dim font-bold`) — already close, verify exact match
- [ ] Select elements:
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
- [ ] On focus: apply `outline: 2px solid var(--primary-container)` (accessible, not a line border) and `outline-offset: 2px`
- [ ] Do **NOT** add the bottom-bar input style here — dropdowns look better as rounded boxes vs text inputs

---

### 8.9 Weekly/Monthly Summary Cards — Reskin
**Keep the summary data but integrate it into the bento grid pattern, not standalone cards above everything.**

- [ ] Merge the `weeklySummary` and `monthlySummary` data into a single horizontal "context strip" bar between the filter controls and the hero exercise title
- [ ] Strip layout: `flex gap-6 flex-wrap` — no card background, just inline stats separated by tonal dividers
- [ ] Each stat: super-label (`.label-md`, `on-surface-dim`) + value (`headline-md`, `primary`) + unit (12px, `on-surface-variant`)
- [ ] Stats to show (preserve all 5 meaningful data points from the original cards):
  1. `This Week: {weeklySummary.sessions} sessions`
  2. `Vol: {Math.round(weeklySummary.volume / 1000)}k kg`
  3. `{weeklySummary.volChange > 0 ? '+' : ''}{weeklySummary.volChange}% vs last week` (in success/danger color)
  4. `Monthly: {monthlySummary.sessions} sessions`
  5. `~{monthlySummary.avgPerWeek}/week avg`
- [ ] If no exercise is selected yet, the summary strip still shows — it's always-visible workout context data
- [ ] Remove the current two standalone summary cards (`card` divs at the top of the page)

---

### 8.10 Empty State — Upgrade
**When no exercise is selected, replace the generic EmptyState with an on-brand version.**

- [ ] Keep the `<EmptyState>` component but update props:
  - `title="Select an exercise"` → `title="Choose Your Lift"`
  - `message="Log workouts to see strength progression charts"` → `message="Select split, day, and exercise above to unlock your performance analytics"`
- [ ] The EmptyState component itself will already use the Kinetic Elite token system once Phase 2.11 is implemented

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
- [ ] `--glow-primary` — `0 0 20px rgba(255, 181, 155, 0.10)` (Phase 1.2)
- [ ] `--glass-bg` — `rgba(53, 52, 55, 0.60)` (Phase 1.2)
- [ ] `--glass-blur-sm` — `blur(12px)` (Phase 1.2)
- [ ] `--ease-smooth` — `cubic-bezier(0.4, 0, 0.2, 1)` (Phase 1.6)
- [ ] `cascade-item` stagger animation (Phase 1.6)
- [ ] `.display-lg` — Space Grotesk `clamp(2.5rem, 5vw, 3.5rem)`, weight 700, letter-spacing -0.04em (Phases 1.3 + 6.3)
- [ ] `.headline-md` — Space Grotesk, already defined (Phase 1.3)
- [ ] `.label-md` — Be Vietnam Pro, uppercase, tracking-widest (Phase 1.3)

---

### 8.13 Anti-Pattern Compliance Checklist
- [ ] No `1px solid` borders — only the left-accent border on the 1RM bento card (explicit exception) and the ghost PB glow card border at 20% opacity
- [ ] No `Bebas Neue` or `DM Sans` references
- [ ] All chart tooltips use glassmorphic `contentStyle` (no solid background)
- [ ] No `var(--c1)`, `var(--c2)`, `var(--c3)`, `var(--bd)` references
- [ ] All rounded corners ≥ 12px (0.75rem)
- [ ] Hero number font uses Space Grotesk via `.display-lg`
- [ ] Touch targets on all interactive elements (range pills, dropdowns) ≥ 44px height

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
- [ ] Replace `<BarChart>` + `<Bar>` in the Volume Trend hero section with:
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
- [ ] `type="monotone"` produces the smooth Bézier curve — **do not use `"linear"`**
- [ ] Stroke: `var(--primary-container)` (Burning Ember `#F85F1B`) — not `var(--primary)` (Ember Peach)
- [ ] Import `Area` from `recharts` if not already imported (alongside existing `AreaChart`)

---

### BUG-02 · Personal Best Card — Medal Icon at Top Right

**Observed:** The PB card has no visible icon at top right. The current `workspace_premium` Material Symbol is placed as a near-invisible watermark (10% opacity, absolute positioned) rather than as the prominent medal graphic shown in the reference.  
**Expected:** A medal/award icon at 100% opacity positioned in the top-right corner of the card, acting as the card's primary visual identity badge — matching the reference screenshot (right side, large, dark tonal).

**Fix:**
- [ ] Add a visible medal icon to the top-right of the PB card container:
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
- [ ] Use Material Symbol `military_tech` (medal/award icon) — this matches the star-badge shape in the reference
- [ ] Ensure `material-symbols-outlined` font is loaded in `index.html` (it already is — verify the import includes `FILL@0..1`)
- [ ] Keep the existing faint watermark (10% opacity) OR remove it — do not duplicate the icon. Prefer keeping only the visible top-right version since the watermark adds noise at low opacity alongside the visible icon.
- [ ] PB card `overflow: hidden` must remain so the icon sits flush against the card border

---

### BUG-03 · Personal Best Card — Share Button Shows Text, Not Icon

**Observed:** The Share button at the bottom right of the PB card renders the literal string `"share"` instead of the Material Symbols share icon glyph.  
**Root cause:** The `material-symbols-outlined` font may not be loading correctly, or the `<span>` tag with `className="material-symbols-outlined"` is being treated as raw text by a render path that strips unknown class names.

**Fix:**
- [ ] Verify that `index.html` has the Material Symbols font link with the correct `FILL` axis range:
  ```html
  <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet" />
  ```
- [ ] Replace the `<span className="material-symbols-outlined">share</span>` approach with an inline SVG share icon to guarantee render independence from font loading:
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
- [ ] Same fix should be applied to the `workspace_premium` / `military_tech` icons if they also render as text — use Lucide icons from the existing `lucide-react` import as a fallback (e.g., `import { Share2, Award } from 'lucide-react'`)
- [ ] Preferred approach: **use Lucide React** throughout the PB card since it's already a project dependency, avoiding Material Symbols font-loading fragility entirely:
  - Medal icon: `<Award size={36} color="var(--on-surface-dim)" />` inside the top-right badge
  - Share icon: `<Share2 size={20} color="currentColor" />` inside the share button

---

### BUG-04 · Nav Label — "Progress" → "Analytics"

**Observed:** The bottom navigation bar and sidebar still show `"Progress"` as the tab label.  
**Expected:** Label should read `"Analytics"` to match the renamed page.

**Fix:**
- [ ] In `src/data/constants.js` — update **both** nav arrays (desktop sidebar + mobile bottom nav):
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

- [ ] No `border: '1px solid var(--outline-variant)'` on any card (also applies to logout button — must not use `btn-d` class)
- [ ] No `boxShadow: 'var(--shadow-md)'` on standard cards — glow only on avatar
- [ ] No `#ffffff` or `#000000` literals
- [ ] No emoji as icons — replace `⚡ Admin` with `<Zap size={10} />` in **both ProfilePage.jsx AND Layout.jsx** (line 27)
- [ ] No `font-family: 'Bebas Neue'` — replace with `'Space Grotesk'`
- [ ] No `border-bottom: '2px solid ...'` on field display rows — use `borderRadius: 12` containers instead
- [ ] No inline `style={{ border: 'none' }}` workarounds (cards already have no border by default from design system)
- [ ] Achievement grid cards must have `border-radius: 20px` (not `12px` or `8px`)
- [ ] Use `var(--signature-gradient)` token for ember gradient buttons — do NOT re-specify `linear-gradient(135deg, ...)` inline when the token already exists
- [ ] Old `.g2` responsive class wrapper must be fully removed — verify no leftover `className="g2"` in output
- [ ] `avatarType` must be `'upload'` (not `'preset'`) when user uploads a custom image
- [ ] Uploaded avatar must be canvas-resized to max 256×256 and JPEG-compressed to ~50KB before storing in localStorage
- [ ] Avatar Picker Modal must support `Escape` key to close and click-outside-to-close

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
11. **9.9** Verify final section order + marginBottom consistency
12. **9.12** Anti-pattern sweep (expanded 13-point checklist)
