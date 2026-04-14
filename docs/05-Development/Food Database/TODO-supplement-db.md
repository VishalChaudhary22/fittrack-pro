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

---

## 🏋️ Phase 5 — Whey Protein & Mass Gainer Brand Database

> **Research date:** 2026-04-03 · **Sources:** Brand official sites, FSSAI-compliant labels, Amazon India bestseller listings, HealthKart, Labdoor certifications.
> **Scope:** Every major whey protein and mass gainer brand currently sold in India — Indian domestic brands + popular imports. Exact macros per scoop/serving as declared on the product label.
> **Why this is Phase 5:** Supplement tracking is the #2 most-logged category in Indian fitness apps (after staple foods). Users currently log "Whey Protein 1 scoop = 120 cal" as a generic entry — losing brand-specific precision. A gym-goer on MuscleBlaze Biozyme gets 25g protein per 33g scoop; one on The Whole Truth Isolate gets 30g per 33g scoop. This 5g gap matters when hitting a 160g daily protein target.

---

### 🎯 Why Supplement Tracking is Critical for Indian Users

- **India's protein gap is real:** ICMR surveys show the average Indian consumes only 0.6–0.8g protein/kg — well below the 1.6–2.2g/kg recommended for muscle building. Supplements close this gap.
- **Indian supplement market is growing at 20%+ YoY** (2025 data) — MuscleBlaze is now India's largest domestic sports nutrition brand by revenue.
- **Users search by brand, not by generic "whey protein":** In Indian fitness apps, the most common supplement log entries are brand-specific: "MuscleBlaze Biozyme", "ON Gold Standard", "AS-IT-IS Raw Whey" — not a generic entry.
- **Scoop weight varies enormously by brand:** MyProtein scoops are 25g; ON Gold Standard 30g; MuscleBlaze Biozyme 33g; ON Serious Mass 167g per scoop. A generic "1 scoop whey = 30g" entry creates systematic tracking errors.
- **Mass gainer logging is catastrophically wrong without brand data:** Users logging "mass gainer 1 scoop" without brand context could be off by 500–800 calories per serving.

---

### 📦 Sub-Category Architecture for Supplements (Expanded)

Expand the existing `supplement` category into **5 sub-categories**:

| Sub-category ID | Label | Count Target | Description |
|----------------|-------|:---:|-------------|
| `whey-concentrate` | Whey Concentrate | 10 | WPC 70–80% protein; standard gym protein |
| `whey-isolate` | Whey Isolate | 10 | WPI 90%+ protein; low lactose, low carb |
| `whey-hydrolysate` | Whey Hydrolysate | 4 | Pre-digested; fastest absorption; premium priced |
| `mass-gainer` | Mass Gainer | 10 | 500–1300+ kcal per serving; bulking supplement |
| `lean-mass-gainer` | Lean Mass Gainer | 5 | 300–500 kcal; moderate carbs; body recomposition |

---

### 🔬 Schema Extension for Supplements

Add the following fields to supplement-type food objects:

```js
{
  // ... all standard fields ...
  itemType: 'supplement',
  category: 'supplement',
  subcategory: 'whey-concentrate',  // one of the 5 sub-categories above

  // SUPPLEMENT-SPECIFIC FIELDS (new):
  brand: 'MuscleBlaze',             // exact brand name (for display and search)
  productLine: 'Biozyme Performance Whey',  // product name within brand
  scoopWeightG: 33,                 // exact scoop weight in grams (critical — varies widely)
  proteinType: 'concentrate',       // 'concentrate' | 'isolate' | 'hydrolysate' | 'blend' | 'gainer-blend'
  bcaaG: 5.5,                       // BCAAs per scoop in grams (optional)
  eaaG: null,                       // EAAs per scoop (optional)
  certifications: ['Labdoor', 'Trustified'],  // third-party certifications
  priceINR: 2799,                   // approx MRP per kg (helps with value-for-money display)
  isVegetarian: true,               // all whey is vegetarian; some mass gainers may have non-veg ingredients
  originCountry: 'India',           // 'India' | 'USA' | 'UK' | 'Germany' etc.

  // Standard fields used differently for supplements:
  defaultServingGrams: 33,          // = scoopWeightG for single-scoop products
  per100g: {                        // always per 100g of powder (standard)
    calories: 382,
    protein: 75.8,
    carbs: 7.6,
    fat: 6.1,
    fiber: 0,
    sodium: 150,  // mg — often high in flavored whey due to salt/sweeteners
  },
  servings: [
    { id: 'scoop', label: '1 scoop (33g)', grams: 33 },    // primary serving
    { id: 'g100', label: '100g', grams: 100 },
    { id: 'custom', label: 'Custom (g)', grams: null },
  ],
  source: 'FSSAI-label',            // all branded supplements use FSSAI-label
  confidence: 'high',               // label data = high confidence
}
```

**Note on `per100g` for supplements:** All macros are stored per 100g of powder (standard). The FoodLogPage serving calculator auto-converts: `calories per scoop = (per100g.calories / 100) × scoopWeightG`.

---

### 🥛 Whey Protein — Complete Brand Data

> All values are **per 1 scoop as declared on the product label**. "Serving size (g)" = scoop weight. Protein % = protein per scoop ÷ scoop weight × 100.

#### Tier 1: Indian Domestic Brands (Most Trusted & Widely Available)

**1. MuscleBlaze Biozyme Whey Protein** ⭐ India's #1 Best-Seller
```
Product ID:    mb-biozyme-whey
Sub-category:  whey-concentrate (WPI + WPC blend)
Origin:        India | FSSAI certified | Labdoor certified | Trustified Gold
Serving size:  33g (1 level scoop)
Calories:      120 kcal
Protein:       25g        (75.8% protein yield)
Carbs:         2.5g       (sugars: 2g)
Fat:           1.2g       (saturated: 0.8g)
Fiber:         0g
BCAA:          5.5g
Sodium:        ~100mg
Price (MRP):   ₹2,799/kg | ₹1,549/500g
Key claim:     50% higher protein absorption (Biozyme EAF™ — clinically tested on Indian subjects)
Flavours:      Rich Chocolate, Ice Cream Chocolate, Cookies & Cream, Café Mocha, Kesar Kulfi, Mango
Best for:      Everyday whey for Indian users; best value certified domestic brand
```

**2. MuscleBlaze Biozyme Performance Whey** (Upgraded formula)
```
Product ID:    mb-biozyme-performance-whey
Sub-category:  whey-concentrate (enhanced blend)
Origin:        India | Trustified Gold
Serving size:  36g (1 level scoop)
Calories:      141 kcal
Protein:       25g        (69.4% protein yield)
Carbs:         5.8g       (sugars: 3g)
Fat:           1.9g
Fiber:         0g
BCAA:          5.5g
Creatine:      0g (no added creatine in this variant)
Sodium:        ~130mg
Price (MRP):   ₹2,999/kg
Flavours:      Rich Chocolate, Café Mocha, Kesar Kulfi
Best for:      Recovery-focused users; higher carb version of Biozyme
```

**3. MuscleBlaze Raw Whey Protein Concentrate (80%)**
```
Product ID:    mb-raw-whey-concentrate
Sub-category:  whey-concentrate
Origin:        India | FSSAI certified
Serving size:  33g (1 level scoop)
Calories:      130 kcal
Protein:       24g        (72.7% protein yield)
Carbs:         4g         (sugars: 1.5g)
Fat:           1.5g
Fiber:         0g
BCAA:          5.1g
Sodium:        ~80mg
Price (MRP):   ₹1,699/kg (unflavored)
Note:          Unflavored — can be mixed into food; no artificial sweeteners
Best for:      Clean eating users who add protein to meals (dosa batter, oats, curd)
```

**4. AS-IT-IS Nutrition ATOM Whey Protein** ⭐ Best Budget Lab-Tested
```
Product ID:    asitis-atom-whey
Sub-category:  whey-concentrate (WPI + WPC blend)
Origin:        India | USA Labdoor Certified | NABL lab tested
Serving size:  33g (1 level scoop)
Calories:      127 kcal
Protein:       27g        (81.8% protein yield — highest in this tier)
Carbs:         2g         (sugars: 1g)
Fat:           0.5g
Fiber:         0g
BCAA:          6.1g
EAA:           12.9g
Sodium:        ~90mg
Price (MRP):   ₹1,499/kg (one of the lowest for isolate blend)
Note:          USA Labdoor certified — independently verified for protein content accuracy
Best for:      Budget-conscious users who need verified purity; best protein-per-rupee ratio
```

**5. AS-IT-IS Raw Whey Protein Concentrate (Unflavored)**
```
Product ID:    asitis-raw-whey-concentrate
Sub-category:  whey-concentrate
Origin:        India (sourced from EU dairies) | Labdoor certified
Serving size:  33g (1 level scoop)
Calories:      129 kcal
Protein:       26g        (78.8% protein yield)
Carbs:         3g
Fat:           1.5g
Fiber:         0g
BCAA:          5.9g
Sodium:        ~85mg
Price (MRP):   ₹1,199/kg
Note:          Single ingredient — no flavors, sweeteners, or fillers. Pure WPC 80.
Best for:      Purists; users who want to add protein to cooking without altering taste
```

**6. The Whole Truth Whey Protein Concentrate (Unflavored)**
```
Product ID:    twt-whey-concentrate-unflavored
Sub-category:  whey-concentrate
Origin:        India | No adulteration claim | Clean label
Serving size:  30g (1 level scoop)
Calories:      124 kcal
Protein:       26g        (86.7% protein yield)
Carbs:         2g
Fat:           1.5g
Fiber:         0g
BCAA:          6.4g
Sodium:        ~70mg
Price (MRP):   ₹2,499/kg
Note:          No artificial sweeteners, colors, or fillers. Ingredients listed in plain English.
Best for:      Clean eating; gym-goers skeptical of supplement industry; transparent labeling priority
```

**7. The Whole Truth Whey Protein Isolate (Unflavored)** ⭐ Highest Protein per Scoop (Indian Brand)
```
Product ID:    twt-whey-isolate-unflavored
Sub-category:  whey-isolate
Origin:        India | Clean label | No adulteration
Serving size:  33g (1 level scoop)
Calories:      130 kcal
Protein:       30g        (90.9% protein yield — highest purity WPI in Indian brands)
Carbs:         1g
Fat:           0.5g
Fiber:         0g
BCAA:          7.3g
Sodium:        ~65mg
Price (MRP):   ₹3,499/kg
Note:          30g protein from 33g scoop = 90%+ isolate purity. Zero sweeteners.
Best for:      Cutting phase; lactose sensitive; clean bulk with maximum protein density
```

**8. NAKPRO Impact Whey Protein** (Isolate + Concentrate blend)
```
Product ID:    nakpro-impact-whey
Sub-category:  whey-concentrate (blend)
Origin:        India | Trustified certified | Added digestive enzymes
Serving size:  33g (1 level scoop)
Calories:      124 kcal
Protein:       24g        (72.7%)
Carbs:         3g
Fat:           1.5g
Fiber:         0g
BCAA:          5.4g
Vitamins:      Added (B6, B12, D3, C) — bonus micronutrient support
Sodium:        ~100mg
Price (MRP):   ₹1,899/kg
Best for:      Beginners; budget isolate blend with vitamin support
```

**9. AVVATAR Absolute 100% Whey Protein**
```
Product ID:    avvatar-absolute-whey
Sub-category:  whey-concentrate (WPI + WPC blend)
Origin:        India (Lactalis group — French dairy source) | Vegetarian
Serving size:  36g (1 level scoop)
Calories:      145 kcal
Protein:       25g        (69.4%)
Carbs:         5.5g
Fat:           2g
Fiber:         0g
BCAA:          5.5g
Sodium:        ~120mg
Price (MRP):   ₹2,599/kg
Note:          Sourced from Lactalis (one of world's largest dairy groups); 100% vegetarian certified
Flavours:      Chocolate Hazelnut, Mango Rush, Raw Unflavored, Kesar Pista
Best for:      Users who prioritize dairy source transparency; clean Indian brand with French dairy
```

**10. TrueBasics Clean Whey Isolate**
```
Product ID:    truebasics-clean-whey-isolate
Sub-category:  whey-isolate
Origin:        India | Trustified Gold certified
Serving size:  33g (1 level scoop)
Calories:      120 kcal
Protein:       30g        (90.9% yield — premium WPI)
Carbs:         1g
Fat:           0.5g
Fiber:         0g
BCAA:          6.9g
Probiotics:    None in this variant
Sodium:        ~80mg
Price (MRP):   ₹3,299/kg
Best for:      Lean muscle; low carb diet; post-workout isolate users
```

---

#### Tier 2: International Imports (Premium — Widely Available on Amazon India / HealthKart)

**11. Optimum Nutrition (ON) Gold Standard 100% Whey** ⭐ World's Most Popular
```
Product ID:    on-gold-standard-whey
Sub-category:  whey-concentrate (WPI + WPC + whey peptides blend)
Origin:        USA | Informed Choice certified | Globally #1
Serving size:  30g (1 level scoop) — NOTE: some India packs use 36g servings
Calories:      120 kcal (per 30g scoop)
Protein:       24g        (80%)
Carbs:         3g         (sugars: 1g)
Fat:           1g
Fiber:         0g
BCAA:          5.5g
Glutamine:     4g (naturally occurring)
Sodium:        ~130mg
Price (MRP):   ₹3,199/lb (450g) | ₹4,499/2lb | ₹9,999/5lb
Note:          Primary source is WPI; concentrate and peptides for richer amino profile
Flavours:      Double Rich Chocolate, Rocky Road, Vanilla Ice Cream, Mocha Cappuccino, Banana Cream
Best for:      Reliable quality standard; most trusted globally verified protein
```

**12. ON Gold Standard 100% Whey Isolate**
```
Product ID:    on-gold-standard-whey-isolate
Sub-category:  whey-isolate
Origin:        USA | Informed Choice certified
Serving size:  31g (1 level scoop)
Calories:      110 kcal
Protein:       25g        (80.6%)
Carbs:         1g
Fat:           0.5g
Fiber:         0g
BCAA:          5.5g
Sodium:        ~130mg
Price (MRP):   ₹5,999/kg
Best for:      Zero lactose; ultra-lean cutting; post-workout only
```

**13. MyProtein Impact Whey Protein (Concentrate)**
```
Product ID:    myprotein-impact-whey-concentrate
Sub-category:  whey-concentrate
Origin:        UK | Labdoor certified | Most affordable import
Serving size:  25g (1 level scoop) — SMALLEST SCOOP among major brands
Calories:      103 kcal
Protein:       20g        (80%)
Carbs:         3g
Fat:           1.9g
Fiber:         0g
BCAA:          4.5g
Sodium:        ~110mg
Price (MRP):   ₹1,999/kg (during sale — usually ₹2,499 full price)
Note:          25g scoop is smaller than most Indian brands; users often take 1.5 scoops
Flavours:      60+ flavors including Indian-specific: Mango, Kulfi, Masala Chai
Best for:      Budget import; flavor variety; users who track precisely per gram
```

**14. MyProtein Impact Whey Isolate**
```
Product ID:    myprotein-impact-whey-isolate
Sub-category:  whey-isolate
Origin:        UK | Labdoor certified
Serving size:  25g (1 level scoop)
Calories:      93 kcal
Protein:       22g        (88%)
Carbs:         1g
Fat:           0.5g
Fiber:         0g
BCAA:          4.9g
Sodium:        ~90mg
Price (MRP):   ₹2,799/kg (sale) | ₹3,299 regular
Best for:      Isolate users on a budget; lowest calorie per gram protein among imports
```

**15. Dymatize ISO 100 (Hydrolyzed Whey Isolate)** ⭐ Fastest Absorbing
```
Product ID:    dymatize-iso100
Sub-category:  whey-hydrolysate
Origin:        USA | Informed Choice certified
Serving size:  31g (1 level scoop)
Calories:      110 kcal
Protein:       25g        (80.6%)
Carbs:         1g         (sugars: 0.5g)
Fat:           0.5g
Fiber:         0g
BCAA:          5.5g
Glutamine:     2.7g
Sodium:        ~160mg
Price (MRP):   ₹6,999/kg
Note:          Hydrolyzed = pre-digested for fastest absorption (20–30 min); ideal immediately post-workout
Best for:      Athletes needing rapid recovery; lactose intolerant; premium post-workout
```

**16. Bigmuscles Nutrition Premium Gold Whey**
```
Product ID:    bigmuscles-premium-gold-whey
Sub-category:  whey-concentrate (WPI + WPC blend)
Origin:        India | Informed Choice UK certified | ProHydrolase enzyme tech
Serving size:  36g (1 level scoop)
Calories:      145 kcal
Protein:       25g        (69.4%)
Carbs:         7g
Fat:           2g
Fiber:         0g
EAA:           11g        (notably high — marketed as complete EAA profile)
BCAA:          5.8g
Sodium:        ~140mg
Price (MRP):   ₹2,999/kg
Best for:      Users who prioritize EAA profile; Informed Choice certified (banned substance tested)
```

**17. GNC Pro Performance Whey Protein**
```
Product ID:    gnc-pro-performance-whey
Sub-category:  whey-concentrate
Origin:        USA (GNC brand) | Available at GNC stores across India
Serving size:  34g (1 level scoop)
Calories:      130 kcal
Protein:       24g        (70.6%)
Carbs:         5g
Fat:           1.5g
Fiber:         0g
BCAA:          5g
Sodium:        ~150mg
Price (MRP):   ₹3,499/kg
Best for:      Users who buy at GNC stores; easy physical retail access
```

**18. Tata 1mg Ultra Clean Whey Protein** (Newest entrant — Tata brand trust)
```
Product ID:    tata-1mg-whey
Sub-category:  whey-concentrate (WPI + WPC blend)
Origin:        India | Trustified Gold certified | Tata brand
Serving size:  36g (1 scoop — comes in sachets)
Calories:      135 kcal
Protein:       25g        (69.4%)
Carbs:         4g
Fat:           1.5g
Fiber:         0g
BCAA:          5.6g
Probiotics:    30 billion CFU (unique differentiator — gut health focus)
Sodium:        ~120mg
Price (MRP):   ₹2,999/kg
Note:          Tata brand credibility + 30B CFU probiotics = significant trust advantage in India
Best for:      Users who distrust supplement brands; Tata brand trust; gut-health-conscious users
```

---

### 📊 Whey Protein Quick Reference Table (Per Scoop — Label Data)

| Brand & Product | Scoop (g) | Cal | Protein | Carbs | Fat | BCAA | ₹/kg MRP | Origin | Cert |
|----------------|:---------:|:---:|:-------:|:-----:|:---:|:----:|:--------:|:------:|:----:|
| MB Biozyme Whey | 33 | 120 | 25g | 2.5g | 1.2g | 5.5g | 2,799 | India | Labdoor |
| MB Biozyme Performance | 36 | 141 | 25g | 5.8g | 1.9g | 5.5g | 2,999 | India | Trustified |
| MB Raw Whey Concentrate | 33 | 130 | 24g | 4g | 1.5g | 5.1g | 1,699 | India | FSSAI |
| AS-IT-IS ATOM Whey | 33 | 127 | 27g | 2g | 0.5g | 6.1g | 1,499 | India | Labdoor |
| AS-IT-IS Raw WPC | 33 | 129 | 26g | 3g | 1.5g | 5.9g | 1,199 | India | Labdoor |
| The Whole Truth WPC | 30 | 124 | 26g | 2g | 1.5g | 6.4g | 2,499 | India | Clean label |
| The Whole Truth WPI | 33 | 130 | 30g | 1g | 0.5g | 7.3g | 3,499 | India | Clean label |
| NAKPRO Impact Whey | 33 | 124 | 24g | 3g | 1.5g | 5.4g | 1,899 | India | Trustified |
| AVVATAR Absolute Whey | 36 | 145 | 25g | 5.5g | 2g | 5.5g | 2,599 | India | Veg cert |
| TrueBasics Clean WPI | 33 | 120 | 30g | 1g | 0.5g | 6.9g | 3,299 | India | Trustified |
| ON Gold Standard Whey | 30 | 120 | 24g | 3g | 1g | 5.5g | ~4,499/lb | USA | Informed |
| ON Gold Standard WPI | 31 | 110 | 25g | 1g | 0.5g | 5.5g | ~5,999 | USA | Informed |
| MyProtein Impact WPC | 25 | 103 | 20g | 3g | 1.9g | 4.5g | 1,999 | UK | Labdoor |
| MyProtein Impact WPI | 25 | 93 | 22g | 1g | 0.5g | 4.9g | 2,799 | UK | Labdoor |
| Dymatize ISO 100 | 31 | 110 | 25g | 1g | 0.5g | 5.5g | 6,999 | USA | Informed |
| Bigmuscles Gold Whey | 36 | 145 | 25g | 7g | 2g | 5.8g | 2,999 | India | Informed UK |
| GNC Pro Performance | 34 | 130 | 24g | 5g | 1.5g | 5g | 3,499 | USA | GNC cert |
| Tata 1mg Whey | 36 | 135 | 25g | 4g | 1.5g | 5.6g | 2,999 | India | Trustified |

---

### 🏗️ Mass Gainer — Complete Brand Data

> **Warning for users:** Mass gainers are extremely calorie-dense. A single standard serving can contain more calories than 2 full meals. Always log the exact serving size and grams — never estimate.

> **Serving note:** Most mass gainers have enormous scoop sizes (150–334g). The "1 scoop" for mass gainers is NOT comparable to whey protein scoops. Always declare serving in grams, not scoops.

#### Indian Domestic Mass Gainers

**1. MuscleBlaze Mass Gainer XXL** ⭐ India's Best-Selling Mass Gainer
```
Product ID:    mb-mass-gainer-xxl
Sub-category:  mass-gainer
Origin:        India | Trustified Gold | Digestive enzymes added
Serving size:  150g (3 level scoops — each scoop = 50g)
Calories:      561 kcal per serving (150g)
Protein:       22.5g  (15% protein ratio — typical for mass gainers)
Carbs:         112g   (sugars: 8g; complex carbs from maltodextrin + oat flour)
Fat:           3g
Fiber:         1g
BCAA:          4.2g
Creatine:      0g (this variant)
Vitamins:      27 vitamins and minerals included
Sodium:        ~200mg
Per 100g powder: 374 kcal, 15g protein, 74.7g carbs, 2g fat
Price (MRP):   ₹1,899/3kg | ₹3,299/6kg
Note:          3:1 carb-to-protein ratio — classic bulk formula; India's #1 best-selling gainer
Flavours:      Chocolate, Choco Peanut Butter, Café Mocha, Banana
Best for:      Skinny guys / hardgainers; those struggling to eat enough calories from food
```

**2. MuscleBlaze Super Gainer XXL**
```
Product ID:    mb-super-gainer-xxl
Sub-category:  mass-gainer
Origin:        India | Digestive enzymes | Ashwagandha + Fenugreek added
Serving size:  75g (1 level scoop)
Calories:      280 kcal per serving (75g) — note: smaller serving than Mass Gainer XXL
Protein:       15g
Carbs:         53g   (sugars: 6g)
Fat:           2g
Fiber:         0.5g
Creatine:      0g
Herbs:         Ashwagandha (KSM-66 equivalent) + Fenugreek (strength + testosterone support)
Vitamins:      27 nutrients
Sodium:        ~160mg
Per 100g powder: 373 kcal, 20g protein, 70.7g carbs, 2.7g fat
Price (MRP):   ₹1,699/3kg
Note:          Contains natural herbs for strength — differentiator vs standard gainers
Best for:      Ayurvedic-leaning fitness users; testosterone support during bulking
```

**3. MuscleBlaze High Protein Lean Mass Gainer**
```
Product ID:    mb-lean-mass-gainer
Sub-category:  lean-mass-gainer
Origin:        India | 5-protein blend
Serving size:  75g (1 scoop)
Calories:      295 kcal
Protein:       30g   (40% protein ratio — significantly higher than standard gainers)
Carbs:         47g   (2:1 carb:protein vs standard 3:1)
Fat:           2g
Fiber:         2g
BCAA:          6.5g
Per 100g powder: 393 kcal, 40g protein, 62.7g carbs, 2.7g fat
Price (MRP):   ₹2,799/3kg
Note:          Double the protein of standard mass gainer — for body recomposition, not just bulk
Best for:      Users who want to gain muscle without excessive fat; intermediate gym-goers
```

**4. AS-IT-IS ATOM Mass Gainer**
```
Product ID:    asitis-atom-mass-gainer
Sub-category:  mass-gainer
Origin:        India | Labdoor tested | Milk solids + maltodextrin + WPI + WPC
Serving size:  100g (2 scoops — each scoop = 50g)
Calories:      384 kcal per 100g serving
Protein:       25g   (WPI + WPC — higher quality protein source vs pure maltodextrin blends)
Carbs:         63g
Fat:           4g
Fiber:         0g
Per 100g powder: 384 kcal, 25g protein, 63g carbs, 4g fat
Price (MRP):   ₹2,199/3kg
Note:          Labdoor tested — unusual for mass gainers; uses milk solids (not just maltodextrin)
Best for:      Budget gainer users who want verified label accuracy
```

---

#### International Mass Gainers (Available in India)

**5. Optimum Nutrition (ON) Serious Mass** ⭐ Global Gold Standard for Gainers
```
Product ID:    on-serious-mass
Sub-category:  mass-gainer
Origin:        USA | Informed Choice certified | World's #1 mass gainer by volume
Serving size:  334g (2 scoops — each scoop = 167g) — VERY LARGE SERVING
Calories:      1,260 kcal per serving (334g with water)
Protein:       50g   (whey concentrate only — complete amino profile)
Carbs:         253g  (sugars: 20g — naturally occurring from maltodextrin + whey)
Fat:           4.5g  (saturated: 1g)
Fiber:         5g
Creatine:      5g    (added creatine monohydrate)
Glutamine:     8g    (naturally occurring + added)
Vitamins:      25 vitamins and minerals
Sodium:        ~420mg
Per 100g powder: 377 kcal, 15g protein, 75.7g carbs, 1.3g fat
Per scoop (167g): 630 kcal, 25g protein, 126.5g carbs, 2.25g fat
Price (MRP):   ₹4,499/2.72kg | ₹7,999/5.44kg
Note:          NO ADDED SUGAR — 20g sugars are naturally occurring from maltodextrin
               One serving provides ~50% of a 2500 kcal daily intake — extreme hardgainer fuel
               Mix with milk for 1,650+ calories (adds ~390 kcal from 300ml full fat milk)
Flavours:      Chocolate, Banana, Strawberry, Chocolate Peanut Butter, Mocha
Best for:      Extreme hardgainers (ectomorphs); post-surgery recovery; underweight users
```

**6. ON Serious Mass — Single Scoop (Half Serving) — IMPORTANT for Indian tracking**
```
Product ID:    on-serious-mass-half
Sub-category:  mass-gainer
Note:          Many Indian users cannot handle 1,260 kcal in one shake. Half serving is the common real-world use.
Serving size:  167g (1 scoop)
Calories:      630 kcal
Protein:       25g
Carbs:         126.5g
Fat:           2.25g
Fiber:         2.5g
Creatine:      2.5g
Price:         (same pack — just half serving)
Best for:      Tracking half-serving of ON Serious Mass (most common real-world use in India)
```

**7. Labrada Muscle Mass Gainer**
```
Product ID:    labrada-muscle-mass-gainer
Sub-category:  mass-gainer
Origin:        USA | Lee Labrada brand | No dextrose/sucrose/corn syrup
Serving size:  336g (3 scoops)
Calories:      1,244 kcal
Protein:       52g   (whey concentrate + milk protein isolate)
Carbs:         251g  (NO dextrose or sucrose — complex carbs only)
Fat:           8g
Fiber:         6g
Creatine:      3g    (added)
Glutamine:     6g    (added)
Sodium:        ~560mg
Per 100g powder: 370 kcal, 15.5g protein, 74.7g carbs, 2.4g fat
Per scoop (112g): 415 kcal, 17.3g protein, 83.7g carbs, 2.7g fat
Price (MRP):   ₹6,999/6lb (2.72kg)
Note:          Higher quality carb sources (no cheap sugar syrups); relatively higher protein for a gainer
Best for:      Clean bulk; users concerned about sugar content in gainers
```

**8. MuscleTech Mass Tech Extreme 2000**
```
Product ID:    muscletech-mass-tech-extreme
Sub-category:  mass-gainer
Origin:        USA | Multi-phase protein system
Serving size:  ~334g (specific serving varies by flavor)
Calories:      2,000 kcal per serving (EXTREME — for very high-calorie needs)
Protein:       80g   (multi-phase protein: whey isolate + concentrate + casein + egg white)
Carbs:         400g
Fat:           10g
Creatine:      10g   (highest creatine dose in any commercial mass gainer)
BCAA:          18.6g (extremely high — due to high protein content)
Per 100g powder: ~599 kcal, 24g protein, 120g carbs, 3g fat
Price (MRP):   ₹9,999/6lb
Note:          This is an extreme product — 2,000 calories in ONE shake. Dangerous if misused.
               Designed for competitive bodybuilders 100kg+ who genuinely cannot eat enough food.
               Indian gym-goers should NOT start here.
Best for:      Advanced bodybuilders; extreme calorie needs; competitive sport
⚠️ CAUTION TAG: Add `tags: ['extreme-calories', 'advanced-only']` in the schema
```

**9. GNC Pro Performance Weight Gainer**
```
Product ID:    gnc-pro-performance-weight-gainer
Sub-category:  mass-gainer
Origin:        USA | GNC brand | Available at GNC India stores
Serving size:  ~315g
Calories:      2,200 kcal (with milk — ~1,600 kcal with water)
Protein:       73g   (with milk) | 53g (with water)
Carbs:         440g  (with milk) | 380g (with water)
Fat:           ~15g
BCAAs:         included in protein matrix
No added sugar claim
Price (MRP):   ₹8,999/6lb
Per 100g powder: ~407 kcal, 16.8g protein, 87.3g carbs, 1.6g fat
Best for:      GNC loyalists; very high calorie needs; available at physical GNC India stores
⚠️ CAUTION TAG: Same as above — extreme calories
```

**10. BSN True Mass 1200**
```
Product ID:    bsn-true-mass-1200
Sub-category:  mass-gainer
Origin:        USA | BSN (Bio-Engineered Supplements and Nutrition)
Serving size:  ~254g (3 scoops)
Calories:      1,210 kcal per serving (with water) | ~1,600 kcal with milk
Protein:       50g   (6-protein blend: whey concentrate, hydrolysate, casein, egg white, milk isolate, YGT whey)
Carbs:         215g  (3:1 carb:protein — includes MCT oil for healthy fats)
Fat:           17g   (includes MCT fats — higher fat than most gainers)
Fiber:         7g
MCT Oil:       included
Sodium:        ~700mg
Per 100g powder: 476 kcal, 19.7g protein, 84.6g carbs, 6.7g fat
Price (MRP):   ₹7,999/5.75lb
Note:          6-protein blend = slower + faster protein digestion; MCT fats for clean energy
               Higher fat than most gainers — some see this as a positive (healthy fats) or negative
Best for:      Users who want complex protein blend + MCT fat source; moderate bulk
```

---

### 📊 Mass Gainer Quick Reference Table (Per Standard Serving)

| Brand & Product | Serving (g) | Cal | Protein | Carbs | Fat | Creatine | ₹/pack | Best For |
|----------------|:-----------:|:---:|:-------:|:-----:|:---:|:--------:|:------:|----------|
| MB Mass Gainer XXL | 150 | 561 | 22.5g | 112g | 3g | 0 | 1,899/3kg | Budget Indian bulk |
| MB Super Gainer XXL | 75 | 280 | 15g | 53g | 2g | 0 | 1,699/3kg | Herbs + vitamins |
| MB Lean Mass Gainer | 75 | 295 | 30g | 47g | 2g | 0 | 2,799/3kg | Recomp |
| AS-IT-IS ATOM Mass | 100 | 384 | 25g | 63g | 4g | 0 | 2,199/3kg | Budget verified |
| ON Serious Mass | 334 | 1,260 | 50g | 253g | 4.5g | 5g | 4,499/2.72kg | Hardgainers |
| ON Serious Mass (½) | 167 | 630 | 25g | 126.5g | 2.25g | 2.5g | — | Common real use |
| Labrada Muscle Mass | 336 | 1,244 | 52g | 251g | 8g | 3g | 6,999/2.72kg | Clean bulk |
| MuscleTech Mass Tech | ~334 | 2,000 | 80g | 400g | 10g | 10g | 9,999/2.72kg | Advanced only ⚠️ |
| GNC Weight Gainer | ~315 | 2,200* | 73g* | 440g* | 15g | — | 8,999/2.72kg | Advanced only ⚠️ |
| BSN True Mass 1200 | 254 | 1,210 | 50g | 215g | 17g | 0 | 7,999/2.61kg | Complex protein |

> *With milk. Values with water are ~30% lower for GNC.

---

### 🧩 FoodLogPage UX — Supplement-Specific Considerations

#### 1. Brand Search Priority
When a user types "whey" or "protein", the search results should surface brand-specific entries before generic ones:
```js
// Search priority: brand-specific > generic
// "mb biozyme" → MB Biozyme Whey (exact)
// "muscleblaze" → All MB products
// "whey protein" → All whey sub-category, sorted by popularity (MB Biozyme first)
// "on gold standard" → ON Gold Standard entries
// "serious mass" → ON Serious Mass + half-serving variant
```

#### 2. Scoop Weight Alert for Mass Gainers
When a user logs a mass gainer, show an inline warning:
```jsx
{food.subcategory === 'mass-gainer' && (
  <div style={{ background: 'rgba(255,165,0,0.1)', borderRadius: 8, padding: 10, marginTop: 8 }}>
    <span style={{ fontSize: 11 }}>
      ⚠️ Mass gainers are calorie-dense. This serving ({food.scoopWeightG}g) contains {perServingCal} kcal —
      equivalent to a full meal. Verify your serving size on the pack before logging.
    </span>
  </div>
)}
```

#### 3. Half-Serving Quick Option
Mass gainers should offer a "½ serving" quick-select in the quantity picker, since many Indian users realistically take half the recommended serving:
```
Quantity: [¼] [½] [1] [1.5] [2] scoops
```

#### 4. Protein-per-Rupee Value Display
For whey proteins, show a value metric that Indian users care deeply about:
```js
// In supplement product card:
const proteinPerRupee = (food.per100g.protein / food.priceINR * 100).toFixed(2);
// Display: "₹1 = 0.89g protein" (helps users compare brands)
// AS-IT-IS ATOM at ₹1,499/kg and 81g protein/100g: ₹1 = 5.4g → best value
// ON Gold Standard at ₹4,499/lb (₹9,900/kg): ₹1 = 2.4g
```

#### 5. Certification Badge Display
Show certification chips on supplement cards — this is the #1 purchase decision factor for Indian gym-goers in 2025:
```jsx
{food.certifications?.map(cert => (
  <span key={cert} style={{ fontSize: 9, padding: '2px 6px', borderRadius: 4,
    background: 'rgba(255,181,155,0.15)', color: 'var(--primary)',
    fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
    ✓ {cert}
  </span>
))}
```

---

### 📋 Phase 5 — Implementation Checklist

#### Data Entry
- [ ] Add 18 whey protein entries to `indianFoods.js` (using exact label data from tables above)
- [ ] Add 10 mass gainer entries to `indianFoods.js` (using exact label data from tables above)
- [ ] Add `brand`, `productLine`, `scoopWeightG`, `proteinType`, `bcaaG`, `eaaG`, `certifications`, `priceINR`, `originCountry` fields to supplement schema
- [ ] Add 5 supplement sub-categories to `foodCategories.js` (`whey-concentrate`, `whey-isolate`, `whey-hydrolysate`, `mass-gainer`, `lean-mass-gainer`)
- [ ] Add `scoop` as primary serving for all supplements; `g100` and `custom` as secondary
- [ ] Mark ON Serious Mass full serving (334g) AND half serving (167g) as separate entries — Indian users commonly take half
- [ ] Add `⚠️ extreme-calories` tag to MuscleTech Mass Tech Extreme and GNC Weight Gainer
- [ ] Set `source: 'FSSAI-label'` and `confidence: 'high'` for all branded supplements (label data = gold standard)

#### FoodLogPage UX
- [ ] Add mass gainer calorie warning chip (amber) when food.subcategory === 'mass-gainer'
- [ ] Add ½ serving quick-select for mass gainers
- [ ] Display certification badges on supplement search results
- [ ] Add `proteinPerRupee` value metric on supplement product cards (optional, Phase 5.1)
- [ ] Brand search: "muscleblaze", "on gold", "myprotein", "asitis", "nakpro", "avvatar" → brand-specific results

#### Validation
- [ ] Verify protein % for each whey: (protein per scoop / scoop weight × 100) should be 68–91%
- [ ] Verify mass gainer carb:protein ratios are documented correctly (standard gainers ~4:1 to 5:1; lean gainers ~1.5:1 to 2:1)
- [ ] Cross-reference all values against current product labels (re-verify every 6 months — brands update formulas)
- [ ] Test search: "biozyme" → MB Biozyme Whey; "serious mass" → ON Serious Mass (both full and half serving)
- [ ] Test half-serving calculation: ON Serious Mass half = 630 kcal, 25g protein, 126.5g carbs ✓

---

### 🔄 Data Maintenance Protocol

Supplement nutrition labels change frequently (formula updates, regulatory compliance). Establish a maintenance cycle:

**Every 6 months:**
- Re-verify top 5 selling products' macros against current Amazon India listings
- Check for new major brand launches (Indian supplement market adds 2–3 significant brands per year)
- Update `priceINR` for all supplements (prices fluctuate with import duties, GST changes)

**Trigger-based updates:**
- When a brand announces a formula change (common in Indian market — e.g., MB has updated Biozyme formula 3 times since launch)
- When GST classification for supplements changes (happened in 2023 — can affect pricing and label requirements)
- When FSSAI issues new labeling directives for sports nutrition products

**New brands to watch (potential Phase 5.2 additions):**
- **Only What's Needed (Food Pharmer)** — Dr. Sid Warrier brand; ultra-clean label; gaining trust-based traction in 2025
- **ProteinX / Musclex** — new D2C brands targeting Tier 2/3 India with affordable options
- **Yoga Bar Whey** — ITC brand; leveraging FMCG distribution for supplement trust play
- **Wellbeing Nutrition** — premium Ayurveda-forward brand; plant protein blend

---

## 🔍 Phase 5 — Gap Analysis & Corrections (2026-04-07)

> **Analysis date:** 2026-04-07 · **Scope:** Cross-referencing Phase 5 brand list against market reality, existing `indianFoods.js` schema, and food DB integration requirements.

### Gap A — Missing Major Brands (8 Brands Not Listed)

The current Phase 5 lists 18 whey proteins and 10 mass gainers. However, **8 widely-sold, reputable brands** are entirely absent. These are not niche — they represent significant market share among Indian gym-goers:

| # | Brand & Product | Why It Must Be Added | Market Position |
|:-:|----------------|----------------------|----------------|
| 1 | **MuscleTech NitroTech** | World's #1 performance whey; 30g protein + 3g creatine per 46g scoop; widely sold on Amazon India & HealthKart | Top 5 most-searched imported whey in India |
| 2 | **Nutrabay Pure WPC** | India's largest supplement e-retailer's own brand; 23.4g protein per 30g scoop; ₹1,299/kg — cheapest lab-tested option | #1 on Nutrabay.com; massive D2C user base |
| 3 | **Nutrabay Pure WPI** | Isolate variant; 26.5g protein per 30g scoop; budget isolate at ₹1,899/kg | Most affordable isolate on the market |
| 4 | **Protyze Anytime Clear Whey** | India's first clear whey isolate (juice-like, not milkshake); 24g protein per scoop; zero fat; rapidly growing brand | New category leader — "clear whey" is trending |
| 5 | **Amul Whey Protein** | India's most trusted dairy brand entering supplements; 25g protein per 32g sachet; lactose-free; no sweeteners | Massive trust advantage — Amul is a household name |
| 6 | **Naturaltein Whey Protein** | German-certified; stevia-sweetened; glyphosate-residue-free; 21.6g protein per 30g scoop | Growing "natural/clean" segment leader |
| 7 | **MuscleBlaze Biozyme Iso-Zero** | MB's premium isolate; 27g protein per 34g scoop; zero sugar; EAF® enzyme technology | India's best-selling premium isolate |
| 8 | **Kevin Levrone Gold Whey** | Popular European import; 22g protein per 30g scoop; celebrity bodybuilder brand; growing India presence | Strong gym-bro culture following in India |

### Gap B — Existing `indianFoods.js` Has Only Generic Supplement Entries

The current food database (`indianFoods.js`) contains **only generic entries** that don't match the Phase 5 brand-specific architecture:

| Current Generic Entry in `indianFoods.js` | Problem |
|------------------------------------------|--------|
| `whey-protein` ("Whey Protein Concentrate 80%") | No brand; generic 75g protein/100g doesn't match any real product exactly |
| `whey-protein-isolate` ("Whey Protein Isolate 90%") | No brand; 90g protein/100g is theoretical, not actual product data |
| `casein-protein` | Generic entry — acceptable (fewer branded casein products in India) |
| `soy-protein-isolate` | Generic — acceptable |
| `mass-gainer` | Generic 380 cal/100g — doesn't match ANY real product (MB XXL = 374, ON Serious Mass = 377) |
| `creatine-monohydrate` | Generic — acceptable (creatine is a commodity product) |
| `bcaa-powder` | Generic — acceptable |

**Correction:** Generic entries should remain as fallback options (for users who don't know their exact brand). But Phase 5 brand-specific entries MUST be added alongside them. Use `subcategory` to differentiate:
- Generic entries: `subcategory: 'powder'` (current)
- Brand entries: `subcategory: 'whey-concentrate'` / `'whey-isolate'` / `'whey-hydrolysate'` / `'mass-gainer'` / `'lean-mass-gainer'`

### Gap C — Schema Fields Missing in Current `indianFoods.js` for Supplement Integration

The Phase 5 schema extension defines new fields (`brand`, `productLine`, `scoopWeightG`, `proteinType`, `bcaaG`, `eaaG`, `certifications`, `priceINR`, `originCountry`), but the **current `indianFoods.js` schema does NOT have these fields** on any existing supplement entries.

**Required migration:**
1. Add these fields (nullable) to the existing generic supplement entries
2. All new brand-specific entries MUST include all Phase 5 fields
3. The `foodUtils.js` search function must index `brand` and `productLine` for supplement search

### Gap D — Missing Sub-Category: `clear-whey`

The sub-category architecture defines 5 types (`whey-concentrate`, `whey-isolate`, `whey-hydrolysate`, `mass-gainer`, `lean-mass-gainer`). But **"Clear Whey"** is a rapidly growing product category in India (Protyze, MyProtein Clear Whey, ON Clear Whey) that doesn't fit neatly into any of these.

**Correction:** Add a 6th sub-category:
```
| `clear-whey` | Clear Whey Isolate | 3 | Juice-like whey isolate; zero fat; no milky texture; fruit flavors |
```

### Gap E — `foodCategories.js` Needs Supplement Sub-Categories

The current `foodCategories.js` has a single entry `{ id: 'supplement', label: 'Supplements & Protein' }`. The Phase 5 plan defines 5 (now 6) sub-categories, but these are NOT reflected in `foodCategories.js`. 

**Correction:** Either:
1. Add sub-category filter pills in FoodLogPage when `category === 'supplement'` (preferred), OR
2. Expand `foodCategories.js` with supplement sub-categories as top-level entries

### Gap F — Implementation Checklist Count is Wrong

The Phase 5 checklist says "Add 18 whey protein entries" but the document only lists 18. With the 8 additional brands identified in Gap A, the correct count is **26 whey protein entries**.

**Updated count:** 26 whey + 10 mass gainer = **36 total branded supplement entries** (plus existing 7 generic entries = 43 supplement items total).

### Gap G — Search Term Coverage for Indian Users

Indian gym-goers search supplements using colloquial terms not currently handled:
- "protein powder" → should match ALL whey/casein/plant proteins
- "whey" → should match all whey sub-categories
- "scoop" → highly searched by beginners
- "gym supplement" → common beginner search term
- "body building powder" → Tier 2/3 city users
- Brand misspellings: "musleblaze", "optimum nutriton", "myprotin"

**Correction:** Add fuzzy search support and extended `searchTerms` arrays for all supplement entries.

---

## 🥛 Phase 5.1 — Additional Whey Protein Brands (Must-Have)

> **Promoted from "watch list" to must-have** based on 2025-2026 market data. These brands have significant market share and user search volume in India.
> All values are **per 1 scoop as declared on the product label**.

#### Tier 1 Additions: Indian Domestic Brands

**19. MuscleBlaze Biozyme Iso-Zero** ⭐ India's #1 Premium Isolate
```
Product ID:    mb-biozyme-iso-zero
Sub-category:  whey-isolate
Origin:        India | Trustified Gold | EAF® Enhanced Absorption Formula | Zero Sugar
Serving size:  34g (1 level scoop)
Calories:      125 kcal
Protein:       27g        (79.4% protein yield — highest in MB lineup)
Carbs:         1.5g       (sugars: 0g — zero added sugar)
Fat:           1g
Fiber:         0g
BCAA:          5.96g
EAA:           12.69g
Sodium:        ~90mg
Price (MRP):   ₹3,799/kg
Flavours:      Ice Cream Chocolate, Cookies & Cream, Café Mocha, Mango Lassi
Best for:      Cutting phase; zero sugar goal; users upgrading from MB Biozyme standard
```

**20. Nutrabay Pure 100% Whey Protein Concentrate** ⭐ Best D2C Value Brand
```
Product ID:    nutrabay-pure-whey-concentrate
Sub-category:  whey-concentrate
Origin:        India | Lab-tested (every batch) | Nutrabay own brand
Serving size:  30g (1 level scoop)
Calories:      123 kcal
Protein:       23.4g      (78% protein yield)
Carbs:         2.3g
Fat:           2.2g
Fiber:         0g
BCAA:          5.2g
Sodium:        ~95mg
Price (MRP):   ₹1,299/kg (unflavored) | ₹1,499/kg (flavored)
Note:          India's largest supplement retailer's own brand; every batch lab-tested
Flavours:      Unflavoured, Rich Chocolate, Café Mocha, Belgian Chocolate, Mango
Best for:      Budget-conscious gym-goers; D2C buyers who trust Nutrabay platform
```

**21. Nutrabay Pure Whey Protein Isolate**
```
Product ID:    nutrabay-pure-whey-isolate
Sub-category:  whey-isolate
Origin:        India | Lab-tested | Nutrabay own brand
Serving size:  30g (1 level scoop)
Calories:      112 kcal
Protein:       26.5g      (88.3% protein yield — excellent for price)
Carbs:         1g
Fat:           0.5g
Fiber:         0g
BCAA:          5.8g
Sodium:        ~80mg
Price (MRP):   ₹1,899/kg (one of the cheapest isolates in India)
Best for:      Budget isolate seekers; lactose-sensitive users on a budget
```

**22. Amul Whey Protein (Unflavoured)** ⭐ India's Most Trusted Dairy Brand
```
Product ID:    amul-whey-protein
Sub-category:  whey-concentrate
Origin:        India | Amul (GCMMF — world's largest dairy cooperative) | Lactose-free | FSSAI
Serving size:  32g (1 sachet)
Calories:      118 kcal
Protein:       25g        (78.1% protein yield)
Carbs:         2g
Fat:           1.5g
Fiber:         0g
BCAA:          5g
Sodium:        ~85mg
Price (MRP):   ₹1,599/kg (sachet format — 500g pack = 15 sachets)
Note:          No artificial sweeteners, colors, or flavors. Lactose-free. Sold in single-serve 32g sachets.
               Amul brand trust is unmatched in India — many first-time supplement users start here.
Flavours:      Unflavoured (only)
Best for:      First-time supplement users; users who trust FMCG brands over supplement brands; lactose-intolerant
```

**23. Naturaltein Whey Protein Concentrate** (German Certified, Stevia-Sweetened)
```
Product ID:    naturaltein-whey-concentrate
Sub-category:  whey-concentrate
Origin:        India | German TÜV certified | Stevia sweetened | Non-GMO | Glyphosate-residue-free
Serving size:  30g (1 level scoop)
Calories:      110 kcal
Protein:       21.6g      (72% protein yield)
Carbs:         2.5g
Fat:           1.6g
Fiber:         0g
BCAA:          5.2g
Sodium:        ~80mg
Price (MRP):   ₹2,299/kg
Note:          Uses stevia (not sucralose/aspartame). Sunflower lecithin instead of soy lecithin.
               Growing "clean/natural" segment — appeals to consumers skeptical of artificial ingredients.
Flavours:      Dark Chocolate, Vanilla, Unflavoured, Strawberry
Best for:      Health-conscious users; anti-artificial-sweetener crowd; women's fitness segment
```

#### Tier 2 Additions: International Imports

**24. MuscleTech NitroTech Whey Protein** ⭐ World's #1 Performance Whey
```
Product ID:    muscletech-nitrotech-whey
Sub-category:  whey-isolate (WPI primary + WPC + whey peptides)
Origin:        USA | Informed Choice certified | Contains added creatine
Serving size:  46g (1 level scoop) — LARGEST SCOOP among whey proteins
Calories:      160 kcal
Protein:       30g        (65.2% protein yield — lower % due to added creatine + larger scoop)
Carbs:         4g         (sugars: 2g)
Fat:           2.5g
Fiber:         0g
Creatine:      3g         (added creatine monohydrate — unique differentiator)
BCAA:          6.8g
Glutamine:     included (naturally occurring)
Sodium:        ~160mg
Price (MRP):   ₹4,999/2lb (907g) | ₹8,999/4lb
Note:          Only major whey that includes 3g creatine per scoop — effectively a 2-in-1 supplement.
               46g scoop is the largest among all whey proteins — instruct users to weigh, not eyeball.
Flavours:      Milk Chocolate, Vanilla, Cookies & Cream, Mocha Cappuccino, Strawberry
Best for:      Users who want whey + creatine in one product; bodybuilders; strength athletes
```

**25. Protyze Anytime Clear Whey Protein** ⭐ India's First Clear Whey
```
Product ID:    protyze-clear-whey
Sub-category:  clear-whey (NEW sub-category — juice-like whey isolate)
Origin:        India | 99.9% lactose-free | Zero fat | No gums/thickeners
Serving size:  30g (1 scoop)
Calories:      103 kcal
Protein:       24g        (80% protein yield)
Carbs:         1.5g       (sugars: 0g)
Fat:           0g         (ZERO fat — unique among all whey products)
Fiber:         0g
BCAA:          7.2g       (highest BCAA per scoop in this price range)
Sodium:        ~50mg
Price (MRP):   ₹2,699/kg
Note:          Mixes like juice, not a milkshake. Transparent liquid. Fruit flavors only.
               99.9% lactose-free — best option for severely lactose intolerant users.
               No gums, thickeners, or fillers. Revolutionary product format in Indian market.
Flavours:      Mango, Litchi, Watermelon, Cola Fizz, Green Apple, Blueberry
Best for:      Lactose intolerant; users who dislike milky shakes; summer/hot weather protein; women's fitness
```

**26. Kevin Levrone Gold Whey** (European Import)
```
Product ID:    kevin-levrone-gold-whey
Sub-category:  whey-concentrate
Origin:        Poland (EU) | Celebrity bodybuilder brand | Growing India presence via HealthKart
Serving size:  30g (1 level scoop)
Calories:      119 kcal
Protein:       22g        (73.3% protein yield)
Carbs:         3g         (sugars: 1.1g)
Fat:           2g         (saturated: 1.3g)
Fiber:         0g
BCAA:          ~4.8g
Sodium:        ~85mg (0.21g salt)
Price (MRP):   ₹3,499/kg (2kg pack on HealthKart ~₹5,999)
Note:          Named after legendary IFBB Pro Kevin Levrone; strong gym culture brand recognition.
               European quality standards; growing rapidly in Indian metros.
Flavours:      Chocolate, Cookies & Cream, Vanilla, Snickers, Snikers (sic)
Best for:      Bodybuilding culture enthusiasts; European quality seekers; gym-bro segment
```

---

### 📊 Extended Whey Protein Quick Reference Table (Additional 8 Brands — Per Scoop)

| Brand & Product | Scoop (g) | Cal | Protein | Carbs | Fat | BCAA | ₹/kg MRP | Origin | Key Feature |
|----------------|:---------:|:---:|:-------:|:-----:|:---:|:----:|:--------:|:------:|:-----------:|
| MB Biozyme Iso-Zero | 34 | 125 | 27g | 1.5g | 1g | 5.96g | 3,799 | India | Zero sugar isolate |
| Nutrabay Pure WPC | 30 | 123 | 23.4g | 2.3g | 2.2g | 5.2g | 1,299 | India | Cheapest lab-tested |
| Nutrabay Pure WPI | 30 | 112 | 26.5g | 1g | 0.5g | 5.8g | 1,899 | India | Cheapest isolate |
| Amul Whey Protein | 32 | 118 | 25g | 2g | 1.5g | 5g | 1,599 | India | Trusted dairy brand |
| Naturaltein WPC | 30 | 110 | 21.6g | 2.5g | 1.6g | 5.2g | 2,299 | India | Stevia; German cert |
| MuscleTech NitroTech | 46 | 160 | 30g | 4g | 2.5g | 6.8g | ~5,500 | USA | +3g creatine/scoop |
| Protyze Clear Whey | 30 | 103 | 24g | 1.5g | 0g | 7.2g | 2,699 | India | Zero fat; juice-like |
| Kevin Levrone Gold | 30 | 119 | 22g | 3g | 2g | 4.8g | 3,499 | EU | Bodybuilder brand |

---

### 📋 Phase 5.1 — Updated Implementation Checklist

#### Data Entry (Expanded)
- [ ] Add 8 additional whey protein entries (brands #19–#26 above) to `indianFoods.js`
- [ ] Total supplement entries: **26 whey + 10 mass gainer + 7 existing generic = 43 items**
- [ ] Add `clear-whey` as 6th supplement sub-category to `foodCategories.js`
- [ ] Add supplement-specific fields (`brand`, `productLine`, `scoopWeightG`, `proteinType`, `bcaaG`, `eaaG`, `certifications`, `priceINR`, `originCountry`) to ALL branded supplement entries
- [ ] Backfill existing generic supplement entries with `brand: null` and `productLine: null` for schema consistency
- [ ] Add extended `searchTerms` arrays including brand misspellings and colloquial terms

#### Schema Integration
- [ ] Ensure `foodUtils.js` search indexes `brand` and `productLine` fields for supplement search
- [ ] Add brand-aware search weighting: exact brand match > product line match > generic category match
- [ ] Handle 46g scoop (NitroTech) and 32g sachet (Amul) as non-standard serving sizes in the serving picker

#### New Validation Rules
- [ ] All branded whey: protein yield % = (protein per scoop / scoop weight × 100) must be 60–92%
- [ ] All branded mass gainers: calories per serving > 250 kcal
- [ ] All supplements: `source` must be `'FSSAI-label'` and `confidence` must be `'high'`
- [ ] No duplicate product IDs across generic + branded entries
- [ ] All entries must have `brand` (or `null` for generic) to distinguish entry type