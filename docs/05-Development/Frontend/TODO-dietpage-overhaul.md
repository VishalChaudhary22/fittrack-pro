# DietPage Overhaul — Gap Analysis & Implementation TODO

> Merging the existing production `DietPage.jsx` (diet guide + calorie log) with the new Indian Food Database food logging system (Phase 2), styled to match the Google Stitch `Diet Page.html` template and the Kinetic Elite design system.

---

## 🐛 Phase H — Modal Keyboard & Scroll Architecture Overhaul (Round 4 Feedback)

> [!IMPORTANT]
> These are recurring, deeply-rooted mobile UX issues. The root cause is architectural — the modal uses `height: 90vh` which does NOT shrink when the virtual keyboard opens on iOS/Android. This causes the entire panel to sit behind the keyboard, making scrolling broken and content invisible. All 4 bugs below share this same root cause.

> [!CAUTION]
> The "fixed bottom" save bar on line 626 uses `position: fixed` INSIDE a `overflow: hidden` panel. On mobile, `position: fixed` inside a transformed/overflowed container is clipped and misplaced — this is the #1 cause of the scroll-gets-stuck bug after keyboard dismissal.

---

### Bug H1: Keyboard Opens → Pop-up Scrolls Down & Gets Stuck ✦ Root Cause CONFIRMED

**Problem:**
- When the keyboard opens after tapping the food search input, the virtual keyboard reduces the visible viewport.
- The modal panel is `height: 90vh` (line 522), but `vh` units do NOT change when the keyboard opens on iOS — the panel extends behind the keyboard.
- The user can then touch-drag the page behind the modal (iOS scroll passthrough), which scrolls the background page, not the modal.
- When the keyboard closes, the page scroll position has changed — so the modal appears to be "stuck below" the visible area.

**Root Cause (line 521):** The `.mo` overlay uses `position: fixed` with `overflowY: hidden`. On iOS, when the keyboard opens, `window.visualViewport` shrinks but `fixed` elements don't reflow. The panel stays at the original `90vh` and the keyboard covers the bottom portion.

**Planned Fix:**
- [x] **H1a.** Switch the modal height from `height: 90vh` → `height: 90dvh` (`dvh` = dynamic viewport height, automatically accounts for keyboard on modern iOS/Android). ✅
- [x] **H1b.** Add `document.body.style.overflow = 'hidden'` on modal open and restore on close via a `useEffect` tied to `showSearch` state, to prevent background page scrolling entirely. ✅ Enhanced with `position: fixed` + scroll position save/restore
- [x] **H1c.** The `.mo` overlay should also use `height: 100dvh` instead of `top:0; bottom:0` to ensure it fills only the visible viewport. ✅
- [x] **H1d.** Add a `visualViewport` resize listener — replaced with `position: fixed` body lock + `dvh` which handles this natively. ✅

---

### Bug H2: Results List Scroll Locked on Initial Open ✦ FIXED ✅

**Problem:** When the search modal opens, the food results list is not scrollable. The user must tap a filter chip (e.g. "Veg") to trigger a re-render before scrolling works.

**Root Cause:** The root cause is that on initial render, the `autoFocus` on the search input (line 663) immediately triggers the keyboard, resizing the viewport. This resize event fires before React has finished painting the scroll container, so the browser's scroll heuristic locks onto the nearest scrollable container (the background page). The `-webkit-overflow-scrolling: touch` + `overscrollBehavior: contain` we added in Phase G is correct but fires too late.

**Planned Fix:**
- [x] **H2a.** Remove `autoFocus` from the search input. Instead, use a `useEffect` with a 350ms delay to focus programmatically: `setTimeout(() => inputRef.current?.focus(), 350)`. ✅
- [x] **H2b.** The `autoFocus` triggers keyboard open immediately, which resizes viewport before the modal DOM is stable. The 350ms delay decouples these two events. ✅
- [x] **H2c.** Additionally, add `touch-action: pan-y` CSS to the results list `<div>` to explicitly tell the browser that this element handles vertical pan gestures. ✅

---

### Bug H3: Detail Pane — Content Hidden Behind Keyboard, Serving Cards Not Side-By-Side ✦ FIXED ✅

**Problem:**
1. When viewing a selected food's detail (serving selection, gram input, macros), the content is pushed behind the keyboard.
2. The macro preview bar at the bottom (lines 626–648) uses `position: fixed; bottom: 0` — when the keyboard opens, this bar is hidden behind the keyboard.
3. The serving size buttons (line 553–558) use `flexWrap: wrap` but each button is large (`padding: 10px 16px`, `fontSize: 13`), so they stack vertically instead of sitting side by side.

**Root Cause:**
- `position: fixed; bottom: 0` on line 626 does NOT respect the virtual keyboard inset on iOS. It anchors to the bottom of the layout viewport (full screen height), not the visual viewport (above keyboard). So the save bar and macro preview disappear behind the keyboard.
- The serving buttons have no `maxWidth` constraint and the button text is long (e.g. "1 takeaway container ( 480g)"), causing them to be wider than half the screen.

**Planned Fix:**
- [x] **H3a.** Replace `position: fixed; bottom: 0` on the macro bar with `position: sticky; bottom: 0` inside the scrollable flex container. ✅
- [x] **H3b.** The detail pane scroll container already has `overflowY: auto` — the sticky bar anchors correctly. ✅
- [x] **H3c.** Serving selection buttons: reduced `padding` → `8px 12px`, `fontSize` → `12`, added `flexShrink: 0` and `whiteSpace: nowrap`. Changed to `overflowX: auto` for horizontal scroll. ✅
- [x] **H3d.** Compressed detail pane spacing: padding `24→16`, food name `fontSize 28→22`, `marginBottom 24→12`, container padding `20→16`, multiplier gaps/padding reduced. ✅

---

### Bug H4: Scrolling "Half-Baked" — Can't Scroll Down, Can't Get Back Up ✦ FIXED ✅

**Problem:** The overall modal scroll behaviour is unreliable — sometimes won't scroll down, other times won't bounce back up. This affects both the search results pane and the detail pane.

**Root Cause (multi-factor):**
1. **`overscrollBehavior: contain` without `touch-action: pan-y`**: The browser needs an explicit `touch-action` declaration to delegate pan gestures to the child scroll container rather than the page.
2. **`position: fixed; bottom: 0` save bar inside `overflow: hidden` container (line 626)**: This creates a "scroll trap" — the fixed element prevents the scroll container from calculating its correct `scrollHeight`, causing the browser to think there is nothing left to scroll to, so bounce-back overshoot causes the content to snap back up.
3. **`height: 90vh` not accounting for keyboard**: After the keyboard appears and disappears, the panel's scroll position can be corrupted because the underlying viewport height changed mid-scroll.

**Planned Fix:**
- [x] **H4a.** Added `touch-action: pan-y; -webkit-overflow-scrolling: touch` to both scroll containers — results list and detail pane. ✅
- [x] **H4b.** Replaced `position: fixed` on save bar with `position: sticky; bottom: 0; z-index: 10`. ✅
- [x] **H4c.** Detail pane content now uses `paddingBottom: 16` with sticky bar handling the rest. ✅
- [x] **H4d.** Used `height: 90dvh` (not `vh`) for the panel. ✅

---

## 🐛 Phase G — Food Log Modal Bugs (Round 3 Feedback)

> [!IMPORTANT]
> These bugs were observed on mobile. Studied against `DietPage.jsx` (lines 517–738) and `foodUtils.js` before planning.

---

### Bug G1: Scroll Locked on Search Results List (Mobile) ✦ Root Cause Identified

**Problem:** On mobile, after the food search modal opens, the results list is not scrollable by touch. It only becomes scrollable after switching a filter tab (e.g. tapping "Veg"). This is a classic iOS/Android touch event capture bug.

**Root Cause:** The outer `.mo` overlay now has `overflowY: 'hidden'` (added to fix modal position). On mobile, `overflow: hidden` on a parent `position: fixed` element causes touch scroll events on children to be silently swallowed by the OS. The inner scroll div (`{ overflowY: 'auto', flex: 1 }` on line 687) never receives the touch events.

**Planned Fix:**
- [x] **G1a.** On the Results List `<div>` (line 687: `style={{ overflowY: 'auto', flex: 1 }}`), add `-webkit-overflow-scrolling: 'touch'` to unlock momentum scrolling on iOS.
- [x] **G1b.** Add `overscrollBehavior: 'contain'` so touch events don't bubble up to the frozen outer `.mo` overlay.
- [x] **G1c.** Also apply the same fix to the inner Detail Pane scroll div (line 526: `style={{ flex: 1, overflowY: 'auto', ... }}`).

---

### Bug G2: Modal Page Itself Scrolls Instead of Inner Content (Mobile) ✦ Root Cause Identified

**Problem:** The `90vh` modal panel can be dragged/scrolled as a whole, rather than only the inner content area scrolling. The user can swipe the entire panel up.

**Root Cause:** The `.md` container (line 522) does not prevent its own scroll — it relies on children having `overflowY: 'auto'`, but on mobile the touch target is ambiguous. The panel's `display: flex; flexDirection: column; height: 90vh` is correct, but `overflow: hidden` is not set on the panel itself.

**Planned Fix:**
- [x] **G2a.** Add `overflow: 'hidden'` to the `.md` modal panel div (line 522) so the panel cannot be scrolled — only its scrollable children can be.
- [x] **G2b.** Ensure the sticky header area (`padding: 24; paddingBottom: 16` on line 656) has `flexShrink: 0` so it never compresses when the inner list overflows.

---

### Bug G3: Festival/Fasting Filter Has No Active State Indicator ✦ Root Cause Identified

**Problem:** The "All", "Veg", "Vegan", "Egg", "Non-Veg", "Jain" buttons show a highlighted active state (primary background). But the "Fasting/Vrat?" dropdown (`<select>`) has no visible active/selected indicator — when a fasting type is chosen, the user cannot easily see it is active without inspecting the dropdown value.

**Root Cause:** The `<select>` element at line 673 uses a CSS background change (`searchFasting ? 'var(--primary-container)' : 'var(--surface-container-low)'`) but this relies on the browser's native select rendering, which ignores CSS `background` on mobile browsers. Native `<select>` elements on iOS/Android are rendered by the OS and ignore most CSS styling.

**Planned Fix:**
- [x] **G3a.** Replace the native `<select>` with a **custom styled button row** matching the Diet Type filter chips. Display all fasting options as individual pill buttons: `None · Navratri · Ekadashi · Ramzan · Jain Paryushana · Maha Shivratri`.
- [x] **G3b.** Active fasting chip styling: `background: var(--primary); color: var(--on-primary)`. Inactive: `background: var(--surface-container-low); color: var(--on-surface-variant)`. Match the exact same pill style as the Diet filter row above it.
- [x] **G3c.** Keep them in the same horizontally scrollable `<div>` row as the other filter chips (line 668), separated by a `|` divider from the diet chips — or split into a second scroll row labelled "Festival/Vrat".
- [x] **G3d.** "None" chip when selected should display text like "Vrat: Off" making the inactive state explicit.

---

### Bug G4: Custom Grams Input Does Not Update Macro Preview ✦ Root Cause Identified

**Problem:** When a user types a custom gram amount (e.g. 120g) in the "Or enter exact grams" input, the Kcal / Pro / Carb / Fat preview at the bottom does NOT update. Only selecting a serving chip OR adjusting the multiplier refreshes the preview.

**Root Cause (confirmed in `foodUtils.js` line 21):**
```js
if (servingId === 'custom' && customGrams) {
  servingGrams = customGrams;
}
```
`calcMacros` only uses `customGrams` when `servingId === 'custom'`. But in `DietPage.jsx` line 562, the input handler sets `servingId('')` (empty string), not `'custom'`:
```js
onChange={e => { setCustomGrams(e.target.value); setServingId(''); }}
```
So `calcMacros(food, '', qty, consistency, parseFloat(customGrams))` is called with `servingId = ''`, which never hits the `servingId === 'custom'` branch. `customGrams` is passed as the 5th argument but only used when `servingId === 'custom'`.

**Planned Fix:**
- [x] **G4a.** In `DietPage.jsx` line 562, change the input handler so that setting a custom gram value also sets `servingId` to `'custom'`:
  ```js
  onChange={e => { setCustomGrams(e.target.value); setServingId('custom'); }}
  ```
- [x] **G4b.** Confirm that `calcMacros` in `foodUtils.js` (line 21) correctly triggers: `if (servingId === 'custom' && customGrams)` — this is already correct, just the caller was wrong.
- [x] **G4c.** Also confirm `previewMacros` useMemo (line 129–138) re-runs when `customGrams` changes — it already lists `customGrams` in its dependencies, so this will work automatically once G4a is fixed.

---

### Bug G5: Category Pills ("All", "Grains & Cereals", etc.) Show No Results ✦ Root Cause CONFIRMED

**Problem:** Tapping any category pill (including "All") in the food search modal shows an empty results list.

**Root Cause (CONFIRMED via code audit):**
The food data in `indianFoods.js` uses the property name **`category`** (e.g. `category: 'roti-bread'`). But `DietPage.jsx` references **`f.categoryId`** in 3 places:
- Line 123: `res.filter(f => f.categoryId === searchCat)` — **filter check fails**, returns empty
- Line 548: `foodCategories.find(c => c.id === selectedFood.categoryId)` — shows "Food" fallback
- Line 709: `f.categoryId === 'dish'` — dish badge never shows

The property names don't match. `categoryId` does not exist on any food item.

**Planned Fix:**
- [x] **G5a.** Change all 3 references from `f.categoryId` → `f.category` in `DietPage.jsx`:
  - Line 123: `f.category === searchCat`
  - Line 548: `selectedFood.category`
  - Line 709: `f.category === 'dish'`
- [x] **G5b.** Verify the `id` values in `foodCategories.js` exactly match the `category` values in `indianFoods.js`. Confirmed match: `roti-bread`, `millet`, `rice-dish`, `dal-legume`, `sabzi-veg`, `non-veg`, `egg`, `dairy`, `breakfast`, `snack-street`, `oil-fat`, `sprout-soy` — all match.

---

### Bug G6: Serving Field Mismatch — `desc` vs `label` ✦ Root Cause CONFIRMED

**Problem:** When viewing a food item in the search results or detail pane, the serving description text does not display (shows blank or undefined).

**Root Cause (CONFIRMED via code audit):**
The food data in `indianFoods.js` uses `label` in servings (e.g. `{ id: 'roti', label: '1 roti', grams: 35 }`). But `DietPage.jsx` references `s.desc` in 2 places:
- Line 556: `{s.desc} ({s.grams}g)` — serving chip text in detail pane
- Line 707: `{f.servings[0].desc}` — serving description in search results list

Also: `DietPage.jsx` line 177 references `s.isDefault` which does not exist in the food data. The fallback `food.servings[0].id` saves this, but it's a silent gap.

**Planned Fix:**
- [x] **G6a.** Change `s.desc` → `s.label` on lines 556 and 707 of `DietPage.jsx`.
- [x] **G6b.** Remove or refactor the `s.isDefault` reference on line 177 — since it always falls through to `food.servings[0].id`, it's harmless but misleading. Clean it up to: `const defServing = food.servings?.[0]?.id || '';`

---

## 🐛 Phase F — UX Polish Round 2 (Follow-up Feedback)

> [!IMPORTANT]
> These are UX issues identified after Phase E was deployed. Plan — do NOT implement yet.

---

### Bug F1: Goal Card — Daily Macro Targets Not Visible on Rings

**Problem:** The macro rings (Kcal, Protein, Carbs, Fat) show consumed/remaining values but the user has no clear reference for what the **total daily goal** is. They have to mentally calculate or go to the Meal Guide to see it.

**Planned Fix:**
- [x] **F1a.** Above or below each macro ring, display both consumed **and** the target. Format: `consumed / target` (e.g. `"1200 / 2100 kcal"`). Use small text: `font-size: 10px`, `color: var(--on-surface-dim)` for the `/ target` part and primary weight for consumed.
- [x] **F1b.** Alternatively, add a compact summary row **above the 4 rings** showing the key daily numbers as a horizontal stat strip:
  - `🔥 2100 kcal` | `💪 160g P` | `🌾 210g C` | `🧈 58g F`
  - Style: `font-size: 11px`, `font-weight: 800`, `color: var(--primary)` for values, `color: var(--on-surface-dim)` for labels. Single row, divided by `·` separators.
- [x] **F1c.** Decide and implement one of the two approaches above (F1a or F1b). Recommendation: **F1b (summary row above rings)** — less cluttered, quick scanability.

---

### Bug F2: Remove Redundant "Consumed Intake" Section

**Problem:** The "Consumed Intake" card/section is now redundant since the Goal card's macro rings already reflect what has been logged today. Showing it a second time creates visual duplication and clutters the tracker tab.

**Planned Fix:**
- [x] **F2a.** Locate and **remove the "Consumed Intake" section** from the Daily Tracker tab entirely.
- [x] **F2b.** Ensure the macro rings in the Goal card are the **single source of truth** for today's consumed vs. target display. The rings already pull from `todayTotals` — confirm this is wired correctly.
- [x] **F2c.** After removal, verify the remaining Tracker tab layout flows well: Goal Card → Tab Switcher → Meal Slot Cards → FAB. Adjust spacing/margin if needed.

---

### Bug F3: Food Search Modal — Always Anchor to Top of Screen

**Problem:** When the user taps `+` on a meal slot that is low on the page (e.g. Dinner, which requires scrolling down), the Food Search modal/bottom-sheet opens at the **scroll position of that card**, not at the top of the viewport. This means the user may need to scroll back up to see the modal header and search bar.

**Planned Fix:**
- [x] **F3a.** When the modal opens, scroll the page to `window.scrollTo({ top: 0, behavior: 'smooth' })` **before** the modal becomes visible, or lock the modal to viewport-top using `position: fixed` with `top: 0`.
- [x] **F3b.** Ensure the modal container uses `position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: 1000` so it always overlays the entire screen, regardless of scroll position. This is likely already attempted, but verify no `position: absolute` is leaking from a parent container.
- [x] **F3c.** Add `document.body.style.overflow = 'hidden'` when the modal opens and restore on close — this prevents the background from scrolling while the modal is active, which is a common cause of the "modal at wrong position" bug.
- [x] **F3d.** Test: open modal from Breakfast (top) and from Before Bed (bottom). Both should render the search bar and modal header visible without scrolling.

---

### Bug F4: Meal Slot Cards — Suggested Kcal Text Too Faint

**Problem:** The "~ 400–600 kcal suggested" hint text below each meal slot name is barely readable. The color is too close to the background, making it inaccessible and unhelpful.

**Planned Fix:**
- [x] **F4a.** Increase the contrast on the suggested kcal hint text. Change from `color: var(--on-surface-dim)` or similar low-contrast token to `color: var(--on-surface-variant)` — still subtle, but readable.
- [x] **F4b.** Increase `font-size` from `10px` to `11px` for slightly better legibility without breaking the layout.
- [x] **F4c.** Optionally, prefix the text with a `🔥` emoji or a small `~` tilde to signal it is an estimate, making it visually distinct from logged data.

---

### Bug F5: Stats Chip Strip — Alignment and Color Refinement

**Problem:** The 5 body-stat chips (Weight, Height, BMI, TDEE, Activity) at the top of the Diet Page have two issues:
1. They feel right-aligned / unbalanced within the chip — the text label and value don't look centred inside the pill.
2. The label text (e.g. "Weight", "Height") and value text (e.g. "72 kg", "5'9"") are the same colour, making it hard to tell which is the semantic label vs the data value.

**Planned Fix:**
- [x] **F5a.** Label text (e.g. "Weight", "Height", "BMI"): `color: var(--on-surface-variant)`, `font-size: 10px`, `font-weight: 500`. This makes labels recede visually.
- [x] **F5b.** Value text (e.g. "72 kg", "5'9"", "22.3"): `color: var(--primary)`, `font-size: 13px`, `font-weight: 800`. This makes values pop with the signature Kinetic Elite orange/ember accent.
- [x] **F5c.** Set `text-align: center` and `align-items: center` on the chip's inner flex column so the label + value pair are centred both horizontally and vertically within each pill.
- [x] **F5d.** Ensure the chip strip itself uses `justify-content: center` (or `flex-start` with even gap) so the 5 chips sit balanced across the width, not pushed to one edge.

---

## 🐛 Phase E — Production Bug Fixes (from Screenshot Review)

> [!IMPORTANT]
> These are live bugs observed on the deployed app. Plan these changes before implementing.

---

### Bug 1: Stats Bar Cards Are Too Large + Raw Icon Text Visible

**Problem (Screenshot 1):** The 5 body stats cards (Weight, Height, BMI, TDEE, Activity) are stacked as full-width oversized blocks, each with the raw `material-symbols-outlined` icon string (`monitor_weight`, `straighten`, `calculate`, `bolt`, `directions_run`) rendering as visible text instead of an icon. The cards are way too tall and prominent for what is incidental context info.

**Root Cause:** `material-symbols-outlined` font is not loaded in the project. The `<span className="material-symbols-outlined">` fallback is just text. Cards use `minHeight` auto which expands due to large font size (24px value).

**Planned Fix:**
- [x] **E1a.** Replace the `<span className="material-symbols-outlined">` icon with Lucide React icons already available in the codebase (`Scale`, `Ruler`, `Activity`, `Zap`, `PersonStanding` or equivalents). No external font dependency.
- [x] **E1b.** Restyle the stats bar from 5 tall vertical cards to a **compact horizontal chip strip** — a single row of small pill-shaped stat badges. Target: `height ~36px` per chip, `font-size: 11px` for label, `font-size: 13px` for value. All 5 stats in one row that wraps gracefully on mobile.
- [x] **E1c.** Remove the ghost icon div entirely (the oversized background watermark icon) — it only made sense with the real Material Symbols font.

---

### Bug 2: "Log Food →" Button Feels Out of Place

**Problem (Screenshot 2):** The "Log Food →" button inside the GOAL card uses `btn-g` style — a plain ghost rounded button in the top-right corner of the goal card, visually inconsistent with the bold Kinetic Elite aesthetic. It looks like an afterthought.

**Planned Fix:**
- [x] **E2a.** Replace the plain ghost button with a **tonal chip** styled as: `background: var(--surface-container-highest)`, small `border-radius: 20px`, `font-size: 10px`, `font-weight: 800`, `text-transform: uppercase`, `letter-spacing: 2px` with a small `ChevronDown` or `ArrowDown` Lucide icon beside the text "TRACK TODAY ↓".
- [x] **E2b.** Position it below the macro rings row, centered, spanning partial width — not floating top-right inside the card header. This makes it a clear secondary CTA that flows naturally after the target information.

---

### Bug 3: Daily Tracker Should Be a Separate Tab, Not a Scrolled Section

**Problem:** The "Daily Tracker" section is currently rendered below the "Recommended Meals" section, requiring the user to scroll far down. The user wants the tracker to be **the primary view** and accessible without scrolling past recommendations.

**Planned Fix — Tab Architecture:**
- [x] **E3a.** Add a **tab switcher** at the top of the Diet Page (below the compact stats bar), with two tabs:
  - `[🍽 Daily Tracker]` — **default/active tab**
  - `[📋 Meal Guide]` — the existing recommended meals section
- [x] **E3b.** The tab switcher should use the existing Kinetic Elite pill-style tab pattern: `background: var(--surface-container-highest)` container, active tab = `background: var(--primary)`, `color: var(--on-primary)`.
- [x] **E3c.** Manage with a `activeTab` local state: `useState('tracker')`. Render only the active tab content — no scrolling between sections.
- [x] **E3d.** The GOAL card (macro rings + target display) should remain **above the tabs** — always visible regardless of which tab is active. It is shared context, not tab-specific.
- [x] **E3e.** Remove the `scrollToLog()` function and the "Log Food →" CTA since navigation is now handled by the tab switcher.

---

### Bug 4: Recommended Meals Section Needs an Explanatory Header

**Problem (Screenshot 3):** The meal cards (Breakfast, Lunch, etc.) appear immediately with no framing. A new user doesn't know what these are — are they today's logged meals? Are they editable? The section has no heading explaining the context.

**Planned Fix:**
- [x] **E4a.** Add a section header card at the top of the "Meal Guide" tab content:
  - Headline: `📋 Your Personalised Meal Blueprint`
  - Subtext: `"These are AI-curated meal suggestions based on your ${goal === 'loss' ? 'cut' : goal === 'gain' ? 'bulk' : 'maintenance'} goal and ${dt.label} diet. Use these as a daily reference — log your actual intake in the Daily Tracker."`
  - Style: `background: var(--surface-container-lowest)`, `border-left: 4px solid var(--primary)`, padded card treatment.
- [x] **E4b.** Add a small `"BLUEPRINT"` label badge above the first meal card (`font-size: 9px`, `letter-spacing: 3px`, `color: var(--outline)`).

---

### Bug 5: Daily Tracker as Primary Section

**Problem:** Currently the Daily Tracker renders as a secondary afterthought below a long recommended meals list. The user's primary intent on the Diet page is to **log food and track macros** — not read meal plans.

**Planned Fix (ties into Bug 3):**
- [x] **E5a.** Make `tracker` the **default tab** (`useState('tracker')`) — the tracker is what opens first on page load.
- [x] **E5b.** The GOAL card (macro targets + consumed rings) should show **live consumed vs target** data — reflecting today's food log — so it doubles as the tracker header even before the user scrolls into meal slots.
- [x] **E5c.** Add a prominent "**+ Log Food**" FAB (Floating Action Button) at the bottom-right of the tracker tab — a circular button (`56×56px`, `background: var(--primary-container)`, Lucide `Plus` icon) that opens the food search modal for whichever slot is next chronologically (or "General" if no active slot). This replaces the awkward inline `+` buttons on each slot card as the primary entry point.

---

## Architecture Summary (Updated after Phase E)

The revised `DietPage.jsx` layout:

```
┌─────────────────────────────────┐
│  PageHeader (Diet Guide & Log)  │
│  Compact Stats Strip (5 chips)  │
│  GOAL Card (rings: consumed/    │
│    target — always visible)     │
│  [Daily Tracker] [Meal Guide]   │  ← Tab switcher
├─────────────────────────────────┤
│  TAB: Daily Tracker (default)   │
│    Today's Progress bar         │
│    6 Meal Slot Cards            │
│    Protein Nudge Alert          │
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

---

## Architecture Summary (original)

---

## 🔴 Critical Gaps Identified

### Gap 1: Mock DB vs Real DB — Data Source Mismatch

> [!CAUTION]
> The prototype `Dietpage.jsx` embeds a **hardcoded `INDIAN_FOODS` array of ~35 items** inline. The production app has a **171-item validated database** in `src/data/foods/indianFoods.js` plus utilities in `src/utils/foodUtils.js`. The prototype must be rewired to import from the real sources.

- [x] **Remove inline `INDIAN_FOODS` array** (lines 9–88 of prototype)
- [x] **Import from real DB**: `import { indianFoods } from '../../data/foods/indianFoods.js'`
- [x] **Import existing utilities** instead of duplicating them:
  - `import { calcMacros, calcBeverageMacros, searchLocalFoods, getRecentFoods, getFavoriteFoods } from '../../utils/foodUtils.js'`
- [x] **Import categories** from `import { foodCategories } from '../../data/foods/foodCategories.js'`
- [x] Remove duplicate inline `calcMacros`, `calcBeverageMacros`, `searchFoods` functions from prototype
- [x] Verify the prototype's `CATEGORIES` array matches `foodCategories.js` (20 categories — the prototype has 18, missing `grain-cereal` mapped correctly and `condiment`)

---

### Gap 2: Section 1 — Existing Diet Page Content Missing

> [!IMPORTANT]
> The prototype's Section 1 is a simplified "Goal: CUT/MAINTAIN/BULK" toggle with static presets. The **production DietPage** has significantly more functionality that must be preserved.

- [x] **Preserve existing diet page logic** — do NOT replace it with static `DIET_PRESETS`:
  - [x] Keep dynamic `calcBMR`, `calcTDEE`, `calcDeficit` calculations from `src/utils/calculations.js`
  - [x] Keep auto-detected goal from `user.weight` vs `user.weightGoal` vs `user.goalWeeks`
  - [x] Keep dynamic protein calculation (`baseWeight × multiplier` based on goal)
  - [x] Keep carbs/fat split logic based on goal type
  - [x] Keep whey protein scoop recommendation card
  - [x] Keep diet type selector (Vegan / Vegetarian / Egg / Non-Veg) with full meal plan cards
  - [x] Keep the per-meal macro breakdown (P/C/F tags) + micros
  - [x] Keep body stats bar (Weight, Height, BMI, TDEE, Activity)
  - [x] Keep auto-detected goal info card (weight loss plan / gain plan / maintenance)
  - [x] Keep protein sources footer
  - [x] Keep "Complete Protein Tip" footer
- [x] **Remove** the prototype's static `DIET_PRESETS` array — use the real computed values from `calcTDEE` and `calcDeficit`
- [x] **Restyle** Section 1 to match the Google Stitch design (see Gap 6 below)

---

### Gap 3: Section 2 — Missing Phase 2 Features

> [!WARNING]
> The prototype covers ~70% of Phase 2. These features from `TODO-indian-food-db.md` are **missing or incomplete**:

- [x] **"+ Add oil used in cooking" quick chip** — on dish-type entries (Phase 2 line 691). When logging a `dal-legume`, `sabzi-veg`, or `dish` itemType, show a chip: "🫙 Add cooking oil?" → tapping it opens a mini-picker for ghee (15g = 135 kcal) or oil (15g = 130 kcal) → auto-adds a secondary entry to the same meal slot
- [x] **"Custom Food" quick-add form** — (Phase 2 line 693). A button in the search modal: "Can't find it? Add custom" → opens a mini-form: name, calories, protein, carbs, fat → logs with `sourceType: 'custom'`
- [x] **Jain Paryushana fasting type** — The fasting type selector has `"navratri", "ekadashi", "ramzan"` but is **missing `"jain-paryushana"` and `"maha-shivratri"`** from the schema
- [x] **Custom grams input** — The serving picker has pre-set servings but **no free-text custom grams input** (Phase 2 line 687). Add a "Custom (g)" option with a number input field
- [x] **Hindi/transliteration search handling** — (Phase 2 line 696). Verify search matches: "gobhi" → cauliflower items, "aloo" → potato items, "dahi" → curd entries, "chai" → tea entries. The `searchLocalFoods` utility already handles this via `searchTerms` arrays, but confirm integration
- [x] **Haldi-Doodh missing from Beverage Builder** — The prototype's `hasBeverageModifiers` only triggers for `chai-base` and `coffee-black`. The DB also has `haldi-doodh-base`. Verify the Beverage Builder fires for ALL foods with `hasBeverageModifiers: true`

---

### Gap 4: State Management — AppContext Integration

> [!IMPORTANT]
> The prototype uses local `useState` for `foodLog`. The production app needs this in `AppContext` with `localStorage` persistence (Phase 2 line 694).

- [x] **Add `foodLog` state to `AppContext.jsx`**:
  ```js
  const [foodLog, setFoodLog] = useLocalStorage('fittrack_foodLog', []);
  ```
- [x] **Expose in AppContext provider**: `foodLog, setFoodLog`
- [x] **Add `favoriteIds` state**: `const [favoriteIds, setFavoriteIds] = useLocalStorage('fittrack_favoriteFoods', []);`
- [x] **Keep backward compat** with existing `caloriesLog` / `setCaloriesLog` (the old simple calorie logger) — we can deprecate it later but don't break existing DashboardPage references
- [x] **DietPage should consume `foodLog` from context**, not local state
- [x] Add `'fittrack_foodLog'` and `'fittrack_favoriteFoods'` to the storage keys in `src/utils/storage.js`

---

### Gap 5: Route & Navigation

- [x] **No new route needed** — food log is integrated INTO the existing `/diet` route (DietPage), NOT a separate `/food-log` route. Update `TODO-indian-food-db.md` Phase 2 accordingly.
- [x] **No nav item change needed** — Diet nav link already exists

---

### Gap 6: Design Fidelity — Stitch Template Gaps

> [!WARNING]
> The prototype uses **inline `style={{}}` objects** throughout. The production app uses **CSS Variables from the existing design system** (`var(--primary)`, `var(--surface-container-lowest)`, etc.) and CSS class-based styling. The Stitch HTML template uses Tailwind classes. We must reconcile these.

#### 6a. Color Token Mismatches
- [x] Replace hardcoded hex values with CSS variables or match to Kinetic Elite tokens:

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

- [x] Remove **all `#FFFFFF`, `#000000`** (banned by DESIGN.md Anti-Patterns)

#### 6b. Typography
- [x] Use existing CSS classes: `.headline-md`, `.headline-lg` instead of inline `fontFamily: "'Space Grotesk'"` everywhere
- [x] Label styling should match: `uppercase`, `letter-spacing: 0.2em`, `font-weight: 700`, `font-size: 9px`

#### 6c. Stitch Template Components to Match
- [x] **Top Row (Stats)** — Stitch has a 4-column stat bar: Weight / Height / BMI / TDEE (with icons, border-left accent, hover opacity ghost icon). The existing production DietPage has this as a flex-wrap "BODY STATS" bar — restyle to match Stitch's `grid grid-cols-2 lg:grid-cols-4` card layout
- [x] **Goal Section** — Stitch wraps goal + gauges in a single `bg-surface-container-lowest` card with `kinetic-glow` shadow and `border-outline-variant/10`. Match this container treatment
- [x] **Macro Gauges** — Stitch uses **SVG concentric circle gauges** (stroke-dasharray/offset) for Kcal, Protein, Carbs, Fats. The prototype has a `MacroRing` component that partially matches. Ensure:
  - [x] Ring sizes match (Stitch uses `w-28 h-28` = 112px)
  - [x] Stroke width matches (6px)
  - [x] Colors match: Kcal = `primary-container`, Protein = `primary`, Carbs = `tertiary`, Fats = `outline`
  - [x] Text inside rings uses `font-headline text-xl font-black tracking-tighter`
  - [x] Label below uses `text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant`
- [x] **Meal Slot Cards** — Stitch uses `glass-panel` class (backdrop-blur + rgba bg) with:
  - [x] 48×48 icon container (`bg-surface-container-highest rounded-lg`)
  - [x] Material Symbols icon (not emoji)
  - [x] Slot name in `font-headline text-lg font-bold tracking-tight`
  - [x] Suggested kcal in `text-[10px] text-outline-variant uppercase tracking-wider`
  - [x] Right side: kcal value + circular `+` add button with `border-outline-variant` and `hover:bg-primary-container`
  - [x] **Match the hover border animation**: `hover:border-primary/20 transition-all`
- [x] **Bottom Nav** — Stitch has a fixed bottom nav with 5 items. This is already in the production app's layout. Ensure no duplication

#### 6d. Anti-Pattern Violations to Fix
- [x] Remove `border: "1px solid ..."` from inline styles (No-Line Rule — DESIGN.md §5)
- [x] Replace with tonal background shifts or transparent borders
- [x] Remove all `borderTop: "1px solid..."` dividers — use whitespace or `var(--surface-container-highest)` background strips
- [x] Ensure no `transition: "..."` on height/width — use `transform` and `opacity` only (DESIGN.md §6)

---

### Gap 7: Consistency Modifier Location

- [x] The prototype has the gravy consistency toggle ("Watery / Normal / Thick") inside the food detail pane. This is correct per Phase 4 (line 715–719 of TODO). However, it's listed as Phase 4, not Phase 2. **Decision needed**: include it now since it's already coded, or defer? 
  - **Recommendation**: Keep it — it's already working and the data has `consistencyMultipliers` in the DB. Just move it from Phase 4 to Phase 2 checklist.

---

### Gap 8: Missing Phase 3 Items to Pre-Wire

> [!NOTE]
> These Phase 3 features should be **pre-wired** into the architecture now, even if not fully implemented:

- [x] **"Recent Foods" section** — (Phase 3 line 702). The `getRecentFoods()` utility exists. Pre-wire a "Recent" tab/section at the top of the search modal showing last 10 unique foods for quick re-add
- [x] **"Quick Add — Re-log yesterday"** — (Phase 3 line 703). Add a ghost button above meal slots: "📋 Copy yesterday's meals" that clones all entries from `logDate - 1 day`
- [x] **Date navigation** — The prototype already has prev/next day navigation. ✅ Already present
- [x] **Protein tracking alert** — (Phase 3 line 705). Pre-wire: if `todayTotals.protein < preset.protein - 20` and current hour > 18 (6pm), show a nudge card below the progress section with quick-add suggestions from the DB (2 eggs, 100g paneer, 1 scoop whey)

---

## Implementation Checklist

### Phase A: Foundation & State

- [x] A1. Add `foodLog` + `favoriteIds` to `AppContext.jsx` with `useLocalStorage`
- [x] A2. Add storage keys to `src/utils/storage.js`
- [x] A3. Keep `caloriesLog` for backward compat (deprecate later)

---

### Phase B: Section 1 Restyle (Existing Diet Guide → Stitch Design)

- [x] B1. Refactor stats bar to Stitch's 4-column grid with icon ghost overlays + border-left accent
- [x] B2. Wrap goal section in `kinetic-glow` card container per Stitch template
- [x] B3. Replace existing macro number cards with SVG ring gauges per Stitch template
- [x] B4. Restyle diet type selector pills to match Stitch button group (`bg-surface-container-highest p-1 rounded-lg`)
- [x] B5. Restyle meal plan cards to match glass-panel treatment with material icons
- [x] B6. Restyle calorie tracker / today's intake section
- [x] B7. Add "Log Food →" CTA that scrolls to Section 2 (Phase 3 line 700)
- [x] B8. Preserve ALL existing calculation logic (BMR, TDEE, deficit, protein, whey)
- [x] B9. **Replace all hardcoded hex colors** with CSS variable tokens

---

### Phase C: Section 2 Build (Food Log with Indian DB)

- [x] C1. Import `indianFoods` from real DB + `foodCategories` + all `foodUtils`
- [x] C2. Build Section 2 header: "DAILY TRACKER / FOOD LOG" with date navigation
- [x] C3. Build "Today's Progress" card:
  - Master calorie bar (consumed vs target)
  - P/C/F sub-bars (consumed vs target)
  - Use computed values from existing `goalKcal`, `prot`, `carbs`, `fat`
- [x] C4. Build 8 meal slot cards per Stitch template design:
  - Slot icon (Material Symbols), name, suggested kcal, note
  - Tracked kcal display
  - Circular `+` add button
  - Expand on click to show logged foods
  - Each logged food shows: name, P/C/F tags, kcal, ✕ delete
- [x] C5. Build Food Search Modal (bottom sheet):
  - Search bar with icon
  - Diet type filter chips (All / Veg / Vegan / Jain / Egg / Non-Veg)
  - Fasting filter toggle + fasting type sub-chips (Navratri / Ekadashi / Ramzan / **Jain Paryushana** / Maha Shivratri)
  - Category pills (20 categories from `foodCategories.js`)
  - Results list with: name, badges (Root Veg / Customisable / Fasting), default serving + kcal
  - **"Recent" quick section** at top before results (last 10 unique foods)
- [x] C6. Build Food Detail Pane (inside modal):
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
- [x] C7. Build "Custom Food" quick-add form:
  - Name input
  - Calories, Protein, Carbs, Fat number inputs
  - Saves with `sourceType: 'custom'`
- [x] C8. Wire delete functionality (remove entry → update totals)
- [x] C9. Wire edit functionality (tap existing entry → re-open detail pane pre-filled)
- [x] C10. Pre-wire "Copy yesterday's meals" ghost button

---

### Phase D: Polish & Verify

  - Beverage Builder: Chai (base) → add milk + sugar → verify preview
  - Jain filter: search "aloo gobi" → zero results
  - Delivery portion: Dal Makhani takeaway (480g) → verify ~576 kcal + info chip
