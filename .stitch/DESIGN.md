# Design System: FitTrack Pro — Kinetic Elite

## 1. Visual Theme & Atmosphere
A high-performance "heads-up display" (HUD) aesthetic that balances clinical data density with a warm, premium tactile feel. 
- **Density: 7** (Daily App Balanced leaning dense — workout data is information-heavy)
- **Variance: 6** (Offset Asymmetric — editorial bleeds on hero numbers, but structured data tables)
- **Motion: 6** (Fluid CSS — perpetual pulse indicators, spring transitions, staggered card reveals)

The atmosphere is "Obsidian Performance" — deeply recessed dark canvases elevated by glassmorphic layers and warm, burning ember accents.

## 2. Color Palette & Roles
- **Obsidian Canvas** (#131315) — Primary background surface
- **Void Recess** (#0E0E10) — Recessed, inactive, or deeply nested areas
- **Charcoal Layer** (#1A1A1D) — Primary tonal card surface floating on canvas
- **Frosted Slate** (#353437) — Glassmorphic fill (used at 60% opacity)
- **Ember Peach** (#FFB59B) — Primary accent for active text, icons, and subtle LED glows
- **Burning Ember** (#F85F1B) — Primary accent for CTA fills and signature gradient end
- **Warm Bone** (#E3BFB3) — Secondary text color (cold greys are banned)
- **Ghost Outline** (rgba(90, 65, 56, 0.15)) — 15% opacity border for accessibility only

## 3. Typography Rules
- **Display/Headlines:** Space Grotesk — Track-tight, controlled scale. For hero metrics, allow intentional 10-15% margin bleeds (editorial asymmetry).
- **Body:** Be Vietnam Pro — Relaxed leading, maximum 65ch width for readability.
- **Labels:** Be Vietnam Pro — Uppercase, letter-spaced, strictly functional.

## 4. Component Stylings
- **Buttons:** Pill-shaped (24px radius). No strict borders. On active/hover, they push inward mechanically with a subtle LED ember glow (10% opacity).
- **Cards:** Softly rounded (12px to 24px). Tonal layering only — no explicit border lines. They derive depth entirely from background shifts.
- **Inputs:** Clean, bottom-bar only. Focus indicator uses Ember Peach on the bottom edge without boxed borders.
- **Data Visuals (Progress Orbs):** Concentric circular SVG progress indicators instead of flat bars.

## 5. Layout Principles
- **No-Line Rule:** Every structural divider must use whitespace or tonal background shifts; explicit 1px borders are removed.
- **Depth Stacking:** Content is layered conceptually, separated by diffused shadows.
- **Asymmetric Hero:** Key metrics are oversized and intentionally break strict grid alignment to serve as focal anchor points.

## 6. Motion & Interaction
- **Perpetual Micro-Loops:** Live indicators use infinite smooth pulse animations.
- **Staggered Orchestration:** List data mounts via cascading reveals; they never appear simultaneously.
- **Spring Physics:** All interactive elements use `cubic-bezier` overshoot logic rather than generic linear transitions.

## 7. Anti-Patterns (Banned)
- No `1px solid` border lines (No-Line Rule)
- No pure black (`#000000`)
- No pure white (`#FFFFFF`) for secondary text — always use Warm Bone
- No generic serif fonts, Bebas Neue, or DM Sans
- No neon / aggressive outer glows — use diffused LED emission at max 10% opacity
- No generic AI terminology or filler text
- No animating `height/width` — transforms and opacity only
