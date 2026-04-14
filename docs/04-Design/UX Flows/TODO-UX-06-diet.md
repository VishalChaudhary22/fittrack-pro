# TODO — UX-06: Diet Page

> **Scope:** All UX improvements specific to `DietPage.jsx` and related diet data.  
> **Files primarily affected:** `DietPage.jsx`, `diets.js`

---

## UX-6.1 — Diet Type Selector Looks Like Tags, Not a Radio Group 🟠

**Problem:** The 4 diet type buttons (Vegan / Vegetarian / Egg / Non-Veg) look like filtering chips, not a mutually-exclusive selector. The selected state (orange bg) isn't visually distinct enough from hover state.

**Fix — replace with a pill segmented control:**
```jsx
<div style={{
  display: 'flex',
  background: 'var(--c2)',
  borderRadius: 14,
  padding: 4,
  gap: 2,
  marginBottom: 14,
}}>
  {Object.values(DIET_TYPES).map(d => (
    <button
      key={d.id}
      onClick={() => setDiet(d.id)}
      style={{
        flex: 1,
        padding: '9px 8px',
        borderRadius: 10,
        border: 'none',
        background: diet === d.id ? 'var(--o)' : 'transparent',
        color: diet === d.id ? '#fff' : 'var(--t2)',
        transition: 'all .2s',
        fontSize: 12,
        fontWeight: 600,
        cursor: 'pointer',
      }}
    >
      {d.icon} {d.label}
    </button>
  ))}
</div>
```

**Files:** `DietPage.jsx`.

---

## UX-6.2 — Meal Cards Show Hardcoded Sample Macros, Not User-Scaled Values 🟠

**Problem:** Each meal card shows macros like `P: 38g C: 52g F: 14g` sourced directly from `meal.macros` in `diets.js`. These are hardcoded for an approximate 75kg reference person. A 95kg user and a 55kg user see **exactly the same macro numbers** on every meal card, which is factually misleading.

**Fix — scale displayed meal macros by user's calorie target:**
```js
// In DietPage.jsx meal render:
const REFERENCE_PLAN_KCAL = 2100; // approximate base plan total kcal
const scaleFactor = goalKcal / REFERENCE_PLAN_KCAL;

const scaledMacros = {
  p: Math.round(meal.macros.p * scaleFactor),
  c: Math.round(meal.macros.c * scaleFactor),
  f: Math.round(meal.macros.f * scaleFactor),
};
```
Display scaled values with a tiny `"(scaled)"` note for transparency.

**Files:** `DietPage.jsx`.

---

## UX-6.3 — No Meal Timing Guidance 🟡

**Problem:** Diet plan lists meals as Breakfast / Mid-Morning / Lunch / Pre-Workout / Post-Workout Dinner / Before Bed but provides no suggested times. Indian users following structured diet plans need specific timing.

**Fix — add optional timing to each `mk()` entry in `diets.js`:**
```js
mk('Pre-Workout', 'Bolt', { ... }, { ... }, [...], '45–60 min before training')
mk('Post-Workout Dinner', 'Dinner', { ... }, { ... }, [...], 'Within 30 min post-training')
```
Display as a small time chip in the meal card header (e.g., `"⏰ 45–60 min before training"`).

**Files:** `diets.js` (data), `DietPage.jsx` (render).

---

## UX-6.4 — Calorie Log Has No Edit or Delete 🟡

**Problem:** Today's calorie entries are rendered as read-only tag chips. If a user logs `"Breakfast: 800 kcal"` by mistake, there's no way to remove the entry without going into DevTools.

**Fix — make calorie chips tappable to delete:**
```jsx
{todayCals.map(l => (
  <div
    key={l.id}
    style={{ /* existing chip styles */ cursor: 'pointer' }}
    onClick={() => {
      // Use existing ConfirmDialog component:
      setDeleteTarget(l);
      setShowDeleteConfirm(true);
    }}
  >
    {l.meal}: {l.calories}kcal ✕
  </div>
))}

// ConfirmDialog: "Remove Breakfast (800 kcal)?"
// onConfirm: setCaloriesLog(p => p.filter(e => e.id !== deleteTarget.id))
```

**Files:** `DietPage.jsx`.

---

## UX-6.5 — "Best Protein Sources" Section Has No Quantities 🟢

**Problem:** The protein sources tag cloud at the bottom of `DietPage.jsx` lists items like "Tofu", "Rajma", "Chicken Breast" with no quantities. Users need to know: how much paneer = 30g protein?

**Fix — replace tag cloud with a structured mini-list:**
```
Paneer (100g)           → 18g protein · 265 kcal
Chicken Breast (100g)   → 31g protein · 165 kcal
Rajma, cooked (1 cup)   → 15g protein · 198 kcal
Egg (1 whole)           → 6g protein  · 78 kcal
Tofu (100g)             → 8g protein  · 76 kcal
```
This is extremely high-value for Indian users actively building meal plans. Source data from `indianFoods.js` (see `TODO-UX-12-gamification-indian-market.md` UX-18.2).

**Files:** `DietPage.jsx`, `indianFoods.js` (new data file).
