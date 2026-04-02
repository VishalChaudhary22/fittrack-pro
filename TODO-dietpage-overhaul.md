# DietPage Overhaul — Gap Analysis & Implementation TODO

> Merging the existing production `DietPage.jsx` (diet guide + calorie log) with the new Indian Food Database food logging system (Phase 2), styled to match the Google Stitch `Diet Page.html` template and the Kinetic Elite design system.

---

## Architecture Summary

The final `DietPage.jsx` will have **two sections**:

1. **Section 1 — Existing Diet Guide** (body stats, goal auto-detection, macro targets, diet type meal plans, whey recommendations)
2. **Section 2 — Food Log** (target Kcal/P/C/F display, suggested Kcal per meal slot, food search modal, Indian DB integration)

---

## 🔴 Critical Gaps Identified

### Gap 1: Mock DB vs Real DB — Data Source Mismatch

> [!CAUTION]
> The prototype `Dietpage.jsx` embeds a **hardcoded `INDIAN_FOODS` array of ~35 items** inline. The production app has a **171-item validated database** in `src/data/foods/indianFoods.js` plus utilities in `src/utils/foodUtils.js`. The prototype must be rewired to import from the real sources.

- [ ] **Remove inline `INDIAN_FOODS` array** (lines 9–88 of prototype)
- [ ] **Import from real DB**: `import { indianFoods } from '../../data/foods/indianFoods.js'`
- [ ] **Import existing utilities** instead of duplicating them:
  - `import { calcMacros, calcBeverageMacros, searchLocalFoods, getRecentFoods, getFavoriteFoods } from '../../utils/foodUtils.js'`
- [ ] **Import categories** from `import { foodCategories } from '../../data/foods/foodCategories.js'`
- [ ] Remove duplicate inline `calcMacros`, `calcBeverageMacros`, `searchFoods` functions from prototype
- [ ] Verify the prototype's `CATEGORIES` array matches `foodCategories.js` (20 categories — the prototype has 18, missing `grain-cereal` mapped correctly and `condiment`)

---

### Gap 2: Section 1 — Existing Diet Page Content Missing

> [!IMPORTANT]
> The prototype's Section 1 is a simplified "Goal: CUT/MAINTAIN/BULK" toggle with static presets. The **production DietPage** has significantly more functionality that must be preserved.

- [ ] **Preserve existing diet page logic** — do NOT replace it with static `DIET_PRESETS`:
  - [ ] Keep dynamic `calcBMR`, `calcTDEE`, `calcDeficit` calculations from `src/utils/calculations.js`
  - [ ] Keep auto-detected goal from `user.weight` vs `user.weightGoal` vs `user.goalWeeks`
  - [ ] Keep dynamic protein calculation (`baseWeight × multiplier` based on goal)
  - [ ] Keep carbs/fat split logic based on goal type
  - [ ] Keep whey protein scoop recommendation card
  - [ ] Keep diet type selector (Vegan / Vegetarian / Egg / Non-Veg) with full meal plan cards
  - [ ] Keep the per-meal macro breakdown (P/C/F tags) + micros
  - [ ] Keep body stats bar (Weight, Height, BMI, TDEE, Activity)
  - [ ] Keep auto-detected goal info card (weight loss plan / gain plan / maintenance)
  - [ ] Keep protein sources footer
  - [ ] Keep "Complete Protein Tip" footer
- [ ] **Remove** the prototype's static `DIET_PRESETS` array — use the real computed values from `calcTDEE` and `calcDeficit`
- [ ] **Restyle** Section 1 to match the Google Stitch design (see Gap 6 below)

---

### Gap 3: Section 2 — Missing Phase 2 Features

> [!WARNING]
> The prototype covers ~70% of Phase 2. These features from `TODO-indian-food-db.md` are **missing or incomplete**:

- [ ] **"+ Add oil used in cooking" quick chip** — on dish-type entries (Phase 2 line 691). When logging a `dal-legume`, `sabzi-veg`, or `dish` itemType, show a chip: "🫙 Add cooking oil?" → tapping it opens a mini-picker for ghee (15g = 135 kcal) or oil (15g = 130 kcal) → auto-adds a secondary entry to the same meal slot
- [ ] **"Custom Food" quick-add form** — (Phase 2 line 693). A button in the search modal: "Can't find it? Add custom" → opens a mini-form: name, calories, protein, carbs, fat → logs with `sourceType: 'custom'`
- [ ] **Jain Paryushana fasting type** — The fasting type selector has `"navratri", "ekadashi", "ramzan"` but is **missing `"jain-paryushana"` and `"maha-shivratri"`** from the schema
- [ ] **Custom grams input** — The serving picker has pre-set servings but **no free-text custom grams input** (Phase 2 line 687). Add a "Custom (g)" option with a number input field
- [ ] **Hindi/transliteration search handling** — (Phase 2 line 696). Verify search matches: "gobhi" → cauliflower items, "aloo" → potato items, "dahi" → curd entries, "chai" → tea entries. The `searchLocalFoods` utility already handles this via `searchTerms` arrays, but confirm integration
- [ ] **Haldi-Doodh missing from Beverage Builder** — The prototype's `hasBeverageModifiers` only triggers for `chai-base` and `coffee-black`. The DB also has `haldi-doodh-base`. Verify the Beverage Builder fires for ALL foods with `hasBeverageModifiers: true`

---

### Gap 4: State Management — AppContext Integration

> [!IMPORTANT]
> The prototype uses local `useState` for `foodLog`. The production app needs this in `AppContext` with `localStorage` persistence (Phase 2 line 694).

- [ ] **Add `foodLog` state to `AppContext.jsx`**:
  ```js
  const [foodLog, setFoodLog] = useLocalStorage('fittrack_foodLog', []);
  ```
- [ ] **Expose in AppContext provider**: `foodLog, setFoodLog`
- [ ] **Add `favoriteIds` state**: `const [favoriteIds, setFavoriteIds] = useLocalStorage('fittrack_favoriteFoods', []);`
- [ ] **Keep backward compat** with existing `caloriesLog` / `setCaloriesLog` (the old simple calorie logger) — we can deprecate it later but don't break existing DashboardPage references
- [ ] **DietPage should consume `foodLog` from context**, not local state
- [ ] Add `'fittrack_foodLog'` and `'fittrack_favoriteFoods'` to the storage keys in `src/utils/storage.js`

---

### Gap 5: Route & Navigation

- [ ] **No new route needed** — food log is integrated INTO the existing `/diet` route (DietPage), NOT a separate `/food-log` route. Update `TODO-indian-food-db.md` Phase 2 accordingly.
- [ ] **No nav item change needed** — Diet nav link already exists

---

### Gap 6: Design Fidelity — Stitch Template Gaps

> [!WARNING]
> The prototype uses **inline `style={{}}` objects** throughout. The production app uses **CSS Variables from the existing design system** (`var(--primary)`, `var(--surface-container-lowest)`, etc.) and CSS class-based styling. The Stitch HTML template uses Tailwind classes. We must reconcile these.

#### 6a. Color Token Mismatches
- [ ] Replace hardcoded hex values with CSS variables or match to Kinetic Elite tokens:

  | Prototype Hex | Should Be | Kinetic Elite Token |
  |---|---|---|
  | `#131315` | `var(--surface)` | Obsidian Canvas |
  | `#1A1A1D` | `var(--surface-container-low)` | Charcoal Layer |
  | `#0E0E10` | `var(--surface-container-lowest)` | Void Recess |
  | `#212124` | `var(--surface-container-high)` | — |
  | `#353437` | `var(--surface-container-highest)` | Frosted Slate |
  | `#FFB59B` | `var(--primary)` | Ember Peach |
  | `#F85F1B` | `var(--primary-container)` | Burning Ember |
  | `#E3BFB3` | `var(--on-surface-variant)` | Warm Bone |
  | `#6E6E76` | `var(--outline)` | — |
  | `#2692FF` | `var(--tertiary-container)` | Tertiary accent |
  | `#AA8A7F` | `var(--outline)` | — |
  | `#EAEAF0` | `var(--on-surface)` | — |

- [ ] Remove **all `#FFFFFF`, `#000000`** (banned by DESIGN.md Anti-Patterns)

#### 6b. Typography
- [ ] Use existing CSS classes: `.headline-md`, `.headline-lg` instead of inline `fontFamily: "'Space Grotesk'"` everywhere
- [ ] Label styling should match: `uppercase`, `letter-spacing: 0.2em`, `font-weight: 700`, `font-size: 9px`

#### 6c. Stitch Template Components to Match
- [ ] **Top Row (Stats)** — Stitch has a 4-column stat bar: Weight / Height / BMI / TDEE (with icons, border-left accent, hover opacity ghost icon). The existing production DietPage has this as a flex-wrap "BODY STATS" bar — restyle to match Stitch's `grid grid-cols-2 lg:grid-cols-4` card layout
- [ ] **Goal Section** — Stitch wraps goal + gauges in a single `bg-surface-container-lowest` card with `kinetic-glow` shadow and `border-outline-variant/10`. Match this container treatment
- [ ] **Macro Gauges** — Stitch uses **SVG concentric circle gauges** (stroke-dasharray/offset) for Kcal, Protein, Carbs, Fats. The prototype has a `MacroRing` component that partially matches. Ensure:
  - Ring sizes match (Stitch uses `w-28 h-28` = 112px)
  - Stroke width matches (6px)
  - Colors match: Kcal = `primary-container`, Protein = `primary`, Carbs = `tertiary`, Fats = `outline`
  - Text inside rings uses `font-headline text-xl font-black tracking-tighter`
  - Label below uses `text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant`
- [ ] **Meal Slot Cards** — Stitch uses `glass-panel` class (backdrop-blur + rgba bg) with:
  - 48×48 icon container (`bg-surface-container-highest rounded-lg`)
  - Material Symbols icon (not emoji)
  - Slot name in `font-headline text-lg font-bold tracking-tight`
  - Suggested kcal in `text-[10px] text-outline-variant uppercase tracking-wider`
  - Right side: kcal value + circular `+` add button with `border-outline-variant` and `hover:bg-primary-container`
  - **Match the hover border animation**: `hover:border-primary/20 transition-all`
- [ ] **Bottom Nav** — Stitch has a fixed bottom nav with 5 items. This is already in the production app's layout. Ensure no duplication

#### 6d. Anti-Pattern Violations to Fix
- [ ] Remove `border: "1px solid ..."` from inline styles (No-Line Rule — DESIGN.md §5)
- [ ] Replace with tonal background shifts or transparent borders
- [ ] Remove all `borderTop: "1px solid..."` dividers — use whitespace or `var(--surface-container-highest)` background strips
- [ ] Ensure no `transition: "..."` on height/width — use `transform` and `opacity` only (DESIGN.md §6)

---

### Gap 7: Consistency Modifier Location

- [ ] The prototype has the gravy consistency toggle ("Watery / Normal / Thick") inside the food detail pane. This is correct per Phase 4 (line 715–719 of TODO). However, it's listed as Phase 4, not Phase 2. **Decision needed**: include it now since it's already coded, or defer? 
  - **Recommendation**: Keep it — it's already working and the data has `consistencyMultipliers` in the DB. Just move it from Phase 4 to Phase 2 checklist.

---

### Gap 8: Missing Phase 3 Items to Pre-Wire

> [!NOTE]
> These Phase 3 features should be **pre-wired** into the architecture now, even if not fully implemented:

- [ ] **"Recent Foods" section** — (Phase 3 line 702). The `getRecentFoods()` utility exists. Pre-wire a "Recent" tab/section at the top of the search modal showing last 10 unique foods for quick re-add
- [ ] **"Quick Add — Re-log yesterday"** — (Phase 3 line 703). Add a ghost button above meal slots: "📋 Copy yesterday's meals" that clones all entries from `logDate - 1 day`
- [ ] **Date navigation** — The prototype already has prev/next day navigation. ✅ Already present
- [ ] **Protein tracking alert** — (Phase 3 line 705). Pre-wire: if `todayTotals.protein < preset.protein - 20` and current hour > 18 (6pm), show a nudge card below the progress section with quick-add suggestions from the DB (2 eggs, 100g paneer, 1 scoop whey)

---

## Implementation Checklist

### Phase A: Foundation & State

- [ ] A1. Add `foodLog` + `favoriteIds` to `AppContext.jsx` with `useLocalStorage`
- [ ] A2. Add storage keys to `src/utils/storage.js`
- [ ] A3. Keep `caloriesLog` for backward compat (deprecate later)

---

### Phase B: Section 1 Restyle (Existing Diet Guide → Stitch Design)

- [ ] B1. Refactor stats bar to Stitch's 4-column grid with icon ghost overlays + border-left accent
- [ ] B2. Wrap goal section in `kinetic-glow` card container per Stitch template
- [ ] B3. Replace existing macro number cards with SVG ring gauges per Stitch template
- [ ] B4. Restyle diet type selector pills to match Stitch button group (`bg-surface-container-highest p-1 rounded-lg`)
- [ ] B5. Restyle meal plan cards to match glass-panel treatment with material icons
- [ ] B6. Restyle calorie tracker / today's intake section
- [ ] B7. Add "Log Food →" CTA that scrolls to Section 2 (Phase 3 line 700)
- [ ] B8. Preserve ALL existing calculation logic (BMR, TDEE, deficit, protein, whey)
- [ ] B9. **Replace all hardcoded hex colors** with CSS variable tokens

---

### Phase C: Section 2 Build (Food Log with Indian DB)

- [ ] C1. Import `indianFoods` from real DB + `foodCategories` + all `foodUtils`
- [ ] C2. Build Section 2 header: "DAILY TRACKER / FOOD LOG" with date navigation
- [ ] C3. Build "Today's Progress" card:
  - Master calorie bar (consumed vs target)
  - P/C/F sub-bars (consumed vs target)
  - Use computed values from existing `goalKcal`, `prot`, `carbs`, `fat`
- [ ] C4. Build 8 meal slot cards per Stitch template design:
  - Slot icon (Material Symbols), name, suggested kcal, note
  - Tracked kcal display
  - Circular `+` add button
  - Expand on click to show logged foods
  - Each logged food shows: name, P/C/F tags, kcal, ✕ delete
- [ ] C5. Build Food Search Modal (bottom sheet):
  - Search bar with icon
  - Diet type filter chips (All / Veg / Vegan / Jain / Egg / Non-Veg)
  - Fasting filter toggle + fasting type sub-chips (Navratri / Ekadashi / Ramzan / **Jain Paryushana** / Maha Shivratri)
  - Category pills (20 categories from `foodCategories.js`)
  - Results list with: name, badges (Root Veg / Customisable / Fasting), default serving + kcal
  - **"Recent" quick section** at top before results (last 10 unique foods)
- [ ] C6. Build Food Detail Pane (inside modal):
  - Back arrow + food name + category
  - Serving picker chips (including delivery serving info chip)
  - **Custom grams input** field
  - Cooking oil note display
  - Consistency toggle (for `supportedConsistencyTypes.length > 0`)
  - Quantity selector (0.5, 1, 1.5, 2, 2.5, 3)
  - Beverage Builder sub-pane (for `hasBeverageModifiers: true`)
  - **"+ Add oil used" chip** for dish-type foods
  - Macro preview card (Cal / P / C / F)
  - "Add to [Meal Slot]" CTA button
- [ ] C7. Build "Custom Food" quick-add form:
  - Name input
  - Calories, Protein, Carbs, Fat number inputs
  - Saves with `sourceType: 'custom'`
- [ ] C8. Wire delete functionality (remove entry → update totals)
- [ ] C9. Wire edit functionality (tap existing entry → re-open detail pane pre-filled)
- [ ] C10. Pre-wire "Copy yesterday's meals" ghost button

---

### Phase D: Polish & Verify

- [ ] D1. **Design audit** — ensure every component matches Stitch template
- [ ] D2. **Anti-pattern check** — no `1px solid` borders, no `#000`/`#FFF`, no height/width animations
- [ ] D3. **Mobile responsiveness** — test modal on mobile viewport (bottom sheet behavior)
- [ ] D4. **A11y** — unique IDs on all interactive elements, ARIA labels on icon buttons
- [ ] D5. Run the **manual test cases** from TODO-indian-food-db.md (lines 740–753):
  - Search "chicken" → returns correct results
  - Search "makhana" → returns roasted makhana
  - Log dal tadka → "Add oil?" chip appears
  - Enable Navratri fasting → search "khichdi" → only fasting-safe results
  - Log chicken breast 200g → verify macro math
  - Delete entry → verify totals update
  - Switch date → verify isolation
  - Beverage Builder: Chai (base) → add milk + sugar → verify preview
  - Jain filter: search "aloo gobi" → zero results
  - Delivery portion: Dal Makhani takeaway (480g) → verify ~576 kcal + info chip
