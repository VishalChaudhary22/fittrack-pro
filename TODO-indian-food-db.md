# FitTrack Pro — Indian Food Database & Meal Logger

> **Last updated:** 2026-03-30 · Created from v2 HTML plan + research gaps analysis

---

## 📋 Source Document Analysis

The original plan (`FitTrackPro_IndianFoodDB_Plan_v2.html`) proposes:
- 6 core files, 4 delivery phases
- 100–150 foods for v1 launch
- A food object schema with per100g macros, servings, diet types, confidence levels
- A food log entry schema with snapshot macros, meal types, and legacy migration
- FoodLogPage.jsx as a new route, plus Dashboard/DietPage integration

---

## 🔍 Gaps Identified & Corrections

### Gap 1 — Food Count is Too Low (100-150)
The plan says 100–150 foods for launch. For a usable Indian food app, this is insufficient:
- HealthifyMe has 10,000+ Indian items
- IFCT 2017 covers 528 raw foods across 19 categories
- A **minimum viable database** for daily use by an Indian gym-goer needs **250–300 items** covering all meal slots, regional diversity, and fitness-specific items

**Correction:** Target **300 foods** for v1 launch, organized into 17 categories.

### Gap 2 — Missing Categories
The plan mentions "dal, roti, rice, veg, dairy, eggs/chicken/fish, snacks, fruits, drinks, supplements" (10 items). Missing:
- **Street food** (samosa, vada pav, pani puri, bhel, pav bhaji — these are daily indulgences for Indian users)
- **Sweets / Mithai** (gulab jamun, ladoo, barfi, jalebi, halwa — festive and regular consumption)
- **Regional breakfast items** (poha, upma, dosa, idli, medu vada, paratha — critical for South/West India)
- **Fast food / restaurant chains** (Dominos, McDonald's India menu items, Maggi noodles)
- **Cooking oils & fats** (ghee, coconut oil, mustard oil — huge calorie contributor)
- **Condiments & chutneys** (pickle, raita, chutney — hidden calorie sources)
- **Protein powders / supplements** (whey, casein, soy protein, creatine — fitness users log these daily)

**Correction:** Expand to 17 categories (see Category Architecture below).

### Gap 3 — No Regional Coverage
The plan doesn't address India's regional food diversity:
- **North:** Roti, paratha, chole, rajma, paneer dishes, dal makhani
- **South:** Dosa, idli, sambar, rasam, coconut chutney, uttapam, upma, appam
- **East (Bengali):** Macher jhol, luchi, mishti doi, rasgulla
- **West (Gujarati/Maharashtra):** Dhokla, thepla, poha, vada pav, pav bhaji, undhiyu
- **Pan-Indian:** Biryani, khichdi, curd rice, maggi

**Correction:** Add a `region` field to the food schema (`'pan-indian' | 'north' | 'south' | 'east' | 'west'`).

### Gap 4 — Missing Serving Sizes Relevant to India
The plan uses "katori" and "cup" but misses:
- **Roti/chapati unit** (1 roti ≈ 30–35g)
- **Slice** (for bread, cake, pizza)
- **Piece** (for samosa, vada, pakora, ladoo)
- **Glass** (for lassi, chaas, milk — 200ml)
- **Bowl** (for dal, sabzi — ~200g)
- **Plate** (for rice + dal + sabzi combos)
- **Scoop** (for protein powder — 30g)
- **Tablespoon** (for ghee, oil, sugar — 15ml/13g)

**Correction:** Standardize serving library with 12 serving types.

### Gap 5 — No Micronutrient Support
The plan only tracks calories, protein, carbs, fat, and fiber. For fitness users:
- **Sodium** is critical (affects water retention, blood pressure)
- **Iron** matters for female users
- **Calcium** matters for dairy tracking

**Correction:** Add optional `sodium` field (mg per 100g) to the schema — not required for v1, but plan the schema for it.

### Gap 6 — Schema Missing Fields for Fitness Users
- No **glycemic index** (GI) — important for diabetic users and cutting phases
- No **alcohol content** — beer, wine, rum are logged by gym-goers tracking calories
- No **isProcessed** flag — useful for food quality scoring

**Correction:** Add `gi` (optional), `isProcessed` (boolean), and support `drink` itemType with optional `alcoholG` field.

### Gap 7 — Current App Has Calorie-Only Logging
The existing `caloriesLog` in `AppContext.jsx` stores only `{ id, userId, date, meal, calories }`. The new system needs to:
1. Keep old entries working (backward compatibility)
2. Add macros (protein/carbs/fat/fiber) to new entries
3. Auto-calculate macros from the food database

**Correction:** Already addressed in the plan's migration rules — confirm implementation preserves `caloriesLog` and adds `foodLog` as a new parallel state.

### Gap 8 — No Barcode / Photo Logging Mentioned for Future
While not v1, the architecture should not preclude future barcode scanning or photo-based logging.

**Correction:** Add `sourceType: 'barcode' | 'photo-ai'` as future-proof enum values.

---

## 🏗️ Category Architecture (17 Categories, ~300 Foods)

| # | Category ID | Label | Count Target | Examples |
|:-:|-------------|-------|:------------:|---------|
| 1 | `grain-cereal` | Grains & Cereals | 15 | Rice (white, brown, basmati), wheat flour, oats, poha flakes, rava, ragi, bajra, jowar |
| 2 | `roti-bread` | Roti & Breads | 15 | Chapati, phulka, paratha (plain/aloo/gobi), naan, puri, luchi, thepla, rumali roti, bread (white/brown) |
| 3 | `rice-dish` | Rice Dishes | 12 | Jeera rice, dal khichdi, veg pulao, chicken biryani, mutton biryani, curd rice, lemon rice, veg fried rice |
| 4 | `dal-legume` | Dals & Legumes | 20 | Toor dal, moong dal, chana dal, masoor dal, urad dal, rajma, chole, black-eyed peas, sprouted moong, sambar |
| 5 | `sabzi-veg` | Vegetables & Sabzi | 25 | Aloo gobi, palak paneer, bhindi fry, baingan bharta, mix veg, gobi manchurian, paneer butter masala, matar paneer, dal palak |
| 6 | `non-veg` | Non-Veg Dishes | 20 | Chicken curry, butter chicken, tandoori chicken, egg curry, fish curry, mutton rogan josh, chicken tikka, keema, fish fry |
| 7 | `egg` | Eggs | 8 | Boiled egg, omelette (1 egg), scrambled eggs, egg bhurji, anda curry, egg fried rice |
| 8 | `dairy` | Dairy | 18 | Milk (full fat/toned/skim), curd/dahi, paneer, lassi (sweet/salt), chaas, raita, ghee (1 tbsp), cheese slice, butter (1 pat) |
| 9 | `breakfast` | Breakfast & Tiffin | 18 | Masala dosa, plain dosa, idli, medu vada, upma, poha, aloo paratha, chole bhature, uttapam, pongal, appam, puttu |
| 10 | `snack-street` | Snacks & Street Food | 20 | Samosa, vada pav, pani puri, bhel puri, sev puri, pav bhaji, pakora, dhokla, kachori, aloo tikki, momos, spring roll, chaat |
| 11 | `sweet-mithai` | Sweets & Mithai | 15 | Gulab jamun, rasgulla, ladoo (besan/motichoor), barfi, jalebi, halwa (sooji/gajar), kheer, rabri, sandesh, kalakand |
| 12 | `fruit` | Fruits | 20 | Banana, apple, mango, papaya, guava, pomegranate, watermelon, chikoo, grapes, orange, pineapple, coconut (fresh), dates, dry fruits (almonds, cashews, walnuts, peanuts, raisins) |
| 13 | `drink` | Drinks & Beverages | 15 | Chai (with sugar/without), coffee, green tea, nimbu pani, coconut water, mango shake, banana shake, sugarcane juice, Rooh Afza, cola (can), beer (330ml), ORS |
| 14 | `oil-fat` | Oils & Fats | 8 | Ghee, coconut oil, mustard oil, sunflower oil, olive oil, butter, cream, mayonnaise |
| 15 | `condiment` | Condiments & Sides | 10 | Green chutney, tamarind chutney, pickle (mango), raita, papad (fried/roasted), sugar (1 tsp), honey (1 tbsp), tomato ketchup |
| 16 | `supplement` | Supplements & Powder | 10 | Whey protein (1 scoop), casein, soy protein isolate, creatine, peanut butter (1 tbsp), protein bar, mass gainer, BCAA |
| 17 | `fast-food` | Fast Food & Packaged | 15 | Maggi noodles, pizza slice (Dominos), burger (McD), french fries, momos (frozen), bread toast with butter, Parle-G biscuits, Marie biscuits |
| | | **Total** | **~264** | *(aim for 280-300 with regional variants)* |

---

## 📐 Updated Food Object Schema (v2.1)

```js
{
  id: 'dal-toor-cooked',              // unique kebab-case ID
  name: 'Toor Dal (cooked)',           // display name
  nameAlt: ['arhar dal', 'toovar dal', 'pigeon pea dal'],  // search aliases
  category: 'dal-legume',             // from 17-category list
  subcategory: 'legume-curry',         // optional sub-grouping
  itemType: 'base-food',              // 'base-food' | 'dish' | 'drink' | 'supplement' | 'snack'
  state: 'cooked',                    // 'raw' | 'cooked' | 'fried' | 'baked' | 'steamed'
  region: 'pan-indian',               // 'pan-indian' | 'north' | 'south' | 'east' | 'west'
  defaultServingGrams: 150,
  per100g: {
    calories: 116,
    protein: 7,
    carbs: 20,
    fat: 0.4,
    fiber: 4,
    sodium: null,                      // mg, optional for v1
  },
  servings: [
    { id: 'katori', label: '1 katori', grams: 150 },
    { id: 'bowl', label: '1 bowl', grams: 200 },
    { id: 'g100', label: '100g', grams: 100 },
  ],
  dietTypes: ['vegan', 'veg', 'egg', 'nonveg'],  // applicable diet filters
  tags: ['lunch', 'dinner', 'high-fiber', 'high-protein'],
  isProcessed: false,
  gi: null,                            // glycemic index, optional
  source: 'IFCT-2017',                // 'IFCT-2017' | 'USDA' | 'healthifyme' | 'curated-estimate'
  confidence: 'high',                 // 'high' | 'medium' | 'low'
  notes: '',
}
```

---

## 🔢 Standardized Serving Library

| Serving ID | Label | Default Grams | Used For |
|-----------|-------|:------------:|----------|
| `roti` | 1 roti/chapati | 35 | Roti, chapati, phulka |
| `paratha` | 1 paratha | 60 | Aloo/gobi/plain paratha |
| `katori` | 1 katori | 150 | Dal, sabzi, curry |
| `bowl` | 1 bowl | 200 | Rice, khichdi, soup |
| `plate` | 1 plate | 300 | Biryani, thali portion |
| `piece` | 1 piece | varies | Samosa (~80g), ladoo (~40g), idli (~40g) |
| `glass` | 1 glass | 200 | Milk, lassi, juice |
| `cup` | 1 cup | 150 | Tea, coffee |
| `tbsp` | 1 tablespoon | 15 | Ghee, oil, honey, sugar |
| `scoop` | 1 scoop | 30 | Whey protein, mass gainer |
| `slice` | 1 slice | 30 | Bread, pizza, cake |
| `g100` | 100g | 100 | Universal reference |
| `custom` | Custom (g) | user input | Any food |

---

## 📦 Files to Create / Modify

| File | Status | Purpose |
|------|:------:|---------|
| `src/data/foods/indianFoods.js` | 🆕 NEW | Master dataset (~300 food objects) |
| `src/data/foods/foodCategories.js` | 🆕 NEW | 17 category definitions with icons, labels, sort order |
| `src/data/foods/servingTypes.js` | 🆕 NEW | Standardized serving library |
| `src/utils/foodUtils.js` | 🆕 NEW | Search, macro calculation, serving conversion, validation |
| `src/components/pages/FoodLogPage.jsx` | 🆕 NEW | Main food logger screen with search, serving picker, meal grouping |
| `src/context/AppContext.jsx` | ✏️ MODIFY | Add `foodLog` state (parallel to existing `caloriesLog`), migration helper |
| `src/components/pages/DashboardPage.jsx` | ✏️ MODIFY | Add macro mini-bars widget (Cal/P/C/F) |
| `src/components/pages/DietPage.jsx` | ✏️ MODIFY | Add "Log Food" CTA, link to FoodLogPage, display recent entries |
| `src/data/constants.js` | ✏️ MODIFY | Add navigation item for `/food-log` route |
| `App.jsx` | ✏️ MODIFY | Add `/food-log` route |

---

## 🗺️ Implementation Roadmap (4 Phases)

### Phase 1 — Data Foundation
- [ ] Create `foodCategories.js` with 17 category definitions
- [ ] Create `servingTypes.js` with 13 standardized serving types
- [ ] Create `indianFoods.js` with **~300 foods** in the v2.1 schema
  - [ ] Batch 1: Grains, Roti/Breads, Rice Dishes (42 items)
  - [ ] Batch 2: Dals/Legumes, Sabzi/Veg (45 items)
  - [ ] Batch 3: Non-Veg, Eggs, Dairy (46 items)
  - [ ] Batch 4: Breakfast/Tiffin, Snacks/Street Food (38 items)
  - [ ] Batch 5: Sweets, Fruits, Drinks (50 items)
  - [ ] Batch 6: Oils/Fats, Condiments, Supplements, Fast Food (43 items)
- [ ] Create `foodUtils.js` utilities (search, macro calc, serving conversion)
- [ ] Add validation script to detect duplicate IDs, missing macros, invalid categories

### Phase 2 — FoodLogPage MVP
- [ ] Create `FoodLogPage.jsx` with:
  - [ ] Search bar with fuzzy matching on `name` + `nameAlt`
  - [ ] Category filter pills
  - [ ] Diet type filter (Veg / Egg / Non-Veg)
  - [ ] Meal slot selector (Breakfast / Mid-Morning / Lunch / Pre-Workout / Dinner / Snack)
  - [ ] Serving picker (from food's `servings[]`) + custom grams input
  - [ ] Quantity selector (1, 1.5, 2, etc.)
  - [ ] Macro preview before adding (shows calories, protein, carbs, fat for selected serving × quantity)
  - [ ] Daily food log with edit and delete
  - [ ] Grouped view by meal slot
- [ ] Add `foodLog` state to `AppContext.jsx` (parallel to `caloriesLog`, not replacing it)
- [ ] Add route `/food-log` and navigation item
- [ ] Add "Custom Food" quick-add form (name + calories + macros manually)

### Phase 3 — Integration & Retention
- [ ] Dashboard: Add macro ring/bar widget showing today's Cal / P / C / F progress
- [ ] DietPage: Add "Log Food →" CTA button that links to FoodLogPage
- [ ] DietPage: Show today's food log entries inline (recent 5)
- [ ] Add "Recent Foods" section (last 10 unique foods logged)
- [ ] Add "Quick Add" — re-log yesterday's meals in one tap
- [ ] Add date navigation (prev/next day) on FoodLogPage

### Phase 4 — Smart Nutrition Layer (post-MVP)
- [ ] Weekly macro adherence chart (actual vs target for each macro)
- [ ] Goal-aware suggestions ("You're 40g short on protein — try: Paneer 100g, Chicken Breast 100g, 2 Eggs")
- [ ] Recipe builder for homemade dishes (combine 2-5 base foods with custom proportions)
- [ ] Favorites system (star foods for quick access)
- [ ] Streak tracking for food logging consistency

---

## 🧪 Verification Plan

### Automated
- Validation script checks all ~300 foods for: unique IDs, valid category, macros within sane ranges (calories > 0, protein ≥ 0, etc.), at least 1 serving defined, valid dietTypes
- Search util returns correct results for common queries ("dal", "chicken", "dosa", "paneer")

### Manual
1. Navigate to `/food-log`, search for "chicken breast", select 200g, verify macro calculation matches per100g × 2
2. Log a meal → verify it appears in today's grouped view under the correct meal slot
3. Switch to DietPage → verify the "Log Food" CTA links correctly
4. Check Dashboard → verify macro widget reflects today's logged food totals
5. Add a custom food → verify it logs correctly with manually entered macros
6. Delete a food entry → verify it's removed and daily totals update

---

## 📊 Data Quality Sources (Priority Order)

1. **IFCT 2017** (Indian Food Composition Tables) — NIN Hyderabad, 528 foods, raw values. Use for base ingredients. Confidence: `high`.
2. **USDA FoodData Central** — cross-reference for common items (eggs, chicken, oats). Confidence: `high`.
3. **HealthifyMe / MyFitnessPal estimates** — for cooked dishes and street food where no official data exists. Confidence: `medium`.
4. **Curated estimates** — for restaurant/fast food items based on typical recipes. Confidence: `low`.

> Each food item's `source` and `confidence` fields make the data provenance transparent. When expanding the database, always prefer IFCT → USDA → app estimates → curated.
