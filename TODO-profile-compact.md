# TODO — Profile Page · Personal Details Compaction

> **Created:** 2026-04-14 · **Scope:** `src/components/pages/ProfilePage.jsx`
> **Status:** ⚠️ Code changes NOT yet applied — needs implementation

---

## 🔍 Gap Analysis (Codebase Audit – 2026-04-14)

> [!CAUTION]
> **Every `[x]` item in the original "Completed" section was marked done prematurely.** A line-by-line audit of `ProfilePage.jsx` shows **none** of the claimed changes have been applied to the actual codebase. The TODO described the *desired state*, not the *current state*. All items are re-listed below with their actual status.

| # | Claimed Change | Actual Code (ProfilePage.jsx) | Status |
|---|---|---|---|
| 1 | Removed `weightGoal` from grid | Line 301: `{ l: 'Weight Goal (kg)', k: 'weightGoal', t: 'number' }` — **still present** | ❌ Not done |
| 2 | Restructured into 3 semantic rows | Line 300: `repeat(auto-fit, minmax(200px, 1fr))` — **still flat grid** | ❌ Not done |
| 3 | Reduced section padding 24→18px 20px | Line 295: `padding: 24` | ❌ Not done |
| 4 | Reduced header margin-bottom 20→14px | Line 296: `marginBottom: 20` | ❌ Not done |
| 5 | Reduced cell padding 12px 14px→10px 12px | Lines 309, 315, 316: `padding: '12px 14px'` | ❌ Not done |
| 6 | Reduced cell border-radius 12→10px | Lines 309, 315, 316: `borderRadius: 12` | ❌ Not done |
| 7 | Reduced inter-cell gap 14→10px | Line 300: `gap: 14` | ❌ Not done |
| 8 | Reduced value font-size 14→13px | Lines 311, 315, 316: `fontSize: 14` | ❌ Not done |
| 9 | Reduced label font-size 10→9px | Lines 310, 315, 316: `fontSize: 10` | ❌ Not done |
| 10 | Fixed `uppercase: 'uppercase'` → `textTransform` | Lines 310, 315, 316: still `uppercase: 'uppercase'` | ❌ Not done |
| 11 | Empty value display `'Not set'` → `'—'` | Line 303: `return 'Not set'` | ❌ Not done |
| 12 | Added `textTransform: 'capitalize'` on Gender | Line 315: no transform | ❌ Not done |

> [!WARNING]
> **Additional bug found:** The `uppercase: 'uppercase'` invalid CSS property appears in **6+ locations** across the entire ProfilePage — not just Personal Details. It also affects the Stats Strip (lines 238, 242, 247) and Settings section (line 345). These are **silently ignored** by React, meaning all "uppercase" labels render as normal case. Every instance must be changed to `textTransform: 'uppercase'`.

---

## 📋 Implementation Checklist

Implementation order follows taste-design principles: structure first, then typography, then polish.

### Phase 1 — Layout Restructure (Structural)

> Per taste-design: Grid-first responsive architecture. Strict single-column collapse < 768px.

-[x] **Remove `weightGoal` field** from the Personal Details fields array (line 301). Keep it in `save()` sanitized object — data preserved, just hidden from this page.
-[x] **Replace flat `auto-fit` grid** (line 300) with 3 semantic row groups:
  - **Row 1** (2-col): Full Name + Email
  - **Row 2** (4-col on desktop, 2×2 on mobile < 480px): Age · Weight · Height · Gender
  - **Row 3** (3-col on desktop, stack on mobile): Workout Days/Wk · Daily Steps Goal · Activity Level
-[x] **Reduce section padding** `24px` → `18px 20px` (line 295)
-[x] **Reduce header bottom margin** `20px` → `14px` (line 296)
-[x] **Reduce inter-cell gap** `14px` → `10px`
-[x] **Add Cancel button** next to Save in edit mode — ghost-style, `var(--on-surface-variant)` text, no fill

### Phase 2 — Typography & Micro-Polish

> Per taste-design: Weight-driven hierarchy. Monospace for numbers in high-density contexts. No broken CSS properties.

-[x] **Fix ALL `uppercase: 'uppercase'`** → `textTransform: 'uppercase'` across entire file:
  - Line 238 (Stats Strip — BMI)
  - Line 242 (Stats Strip — BMR)
  - Line 247 (Stats Strip — TDEE)
  - Line 310 (Personal Details labels — dynamic fields)
  - Line 315 (Gender label)
  - Line 316 (Activity Level label)
  - Line 345 (Settings section label)
-[x] **Reduce cell padding** `12px 14px` → `10px 12px` (lines 309, 315, 316)
-[x] **Reduce cell border-radius** `12px` → `10px`
-[x] **Reduce value font-size** `14px` → `13px` (lines 311, 315, 316)
-[x] **Reduce label font-size** `10px` → `9px` (lines 310, 315, 316)
-[x] **Empty value display** `'Not set'` → `'—'` for numeric fields (line 303)
-[x] **Add `textTransform: 'capitalize'`** on Gender display value (line 315)

### Phase 3 — Input Behavior & Accessibility

> Per taste-design: Touch targets minimum 44px. Label-input wiring for screen readers.

-[x] **Wire labels to inputs** via `htmlFor`/`id` pairing on every field
-[x] **Add `placeholder` on `stepGoal`** — `"e.g. 10000"`
-[x] **Clamp `workoutDays`** — `min="1" max="7"` on input
-[x] **Clamp `age`** — `min="10" max="100"` on input
-[x] **Test on 360px viewport** — verify Row 2 (4-col) collapses to 2×2 without clipping
-[x] **Add Diet footnote** below Personal Details: `"To update your goal weight, visit the Diet page."`

### Phase 4 — Visual Consistency (taste-design audit)

> Per taste-design: No emojis in professional UI. Diffused whisper shadows. Consistent border-radius scale.

-[x] **Remove emojis from Connected Devices** — `🔗` and `🚴` on lines 330, 338. Replace with Lucide `Link` and `Bike` icons respectively.
-[x] **Verify select elements in light mode** — Gender and Activity Level dropdowns use `background: transparent` which may not render correctly in all browsers' light mode
-[x] **Consider sticky bottom save bar** for mobile edit mode — currently Save is at section header, may scroll out of view

---

## 🎨 Design System Notes (via taste-design skill)

**Atmosphere:** Dashboard profile page — Density 6, Variance 4, Motion 3 (restrained, data-focused).

**Typography constraints for this section:**
- Labels: 9px, weight 700, `textTransform: 'uppercase'`, `'Space Grotesk'` or system sans-serif
- Values: 13px, weight 500, standard case
- Numeric values (weight, height, age, steps): Consider monospace rendering at density 6+

**Color roles:**
- Field backgrounds: `var(--surface-container)` — one step above section background
- Label text: `var(--on-surface-dim)` — subdued, non-competing
- Value text: `var(--on-surface)` — primary reading weight
- Empty state: `var(--on-surface-dim)` with `'—'` dash character

**Anti-patterns to avoid (from taste-design):**
- ❌ Emojis in UI elements (Connected Devices uses `🔗` and `🚴`)
- ❌ Broken CSS properties silently failing (`uppercase: 'uppercase'`)
- ❌ Generic auto-fit grids that don't communicate semantic hierarchy
- ❌ No cancel/escape from edit mode — accidental saves possible

---

## 📁 Files to Modify

| File | Phase | Changes |
|---|---|---|
| `src/components/pages/ProfilePage.jsx` | 1, 2, 3, 4 | Full restructure, typography, accessibility, emoji removal |

---

## Implementation Order

1. **Phase 1** — Layout restructure (highest impact, fixes the core scrolling problem)
2. **Phase 2** — Typography and CSS fixes (fixes 7 broken properties + visual density)
3. **Phase 3** — Input behavior (improves data entry, accessibility)
4. **Phase 4** — Polish per taste-design audit (emoji removal, light-mode verify)

---

## 🚫 Explicitly Out of Scope

- Avatar picker modal — untouched
- Muscle Mastery section — untouched (except fixing `uppercase` bug if present)
- Elite Achievements section — untouched
- `AppContext`, `updateProfile`, or any backend schema — `weightGoal` is still saved/synced, just hidden from this page
