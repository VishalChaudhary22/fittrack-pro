# FitTrack Pro — Indian Food Database & Meal Logger

> **Last updated:** 2026-04-02 · Updated from v2 HTML plan + full gap analysis (original) + extended gap analysis (v2 audit) + v3 additions (chai builder, Jain diet, delivery portions, gravy consistency, micronutrients)

---

## 📋 Source Document Analysis

The original plan (`FitTrackPro_IndianFoodDB_Plan_v2.html`) proposes:
- 6 core files, 4 delivery phases
- 100–150 foods for v1 launch
- A food object schema with per100g macros, servings, diet types, confidence levels
- A food log entry schema with snapshot macros, meal types, and legacy migration
- FoodLogPage.jsx as a new route, plus Dashboard/DietPage integration

---

## 🔍 Gaps Identified & Corrections (Original v2 Audit)

### Gap 1 — Food Count is Too Low (100-150)
The plan says 100–150 foods for launch. For a usable Indian food app, this is insufficient:
- HealthifyMe has 10,000+ Indian items
- IFCT 2017 covers 528 raw foods across 19 categories
- A **minimum viable database** for daily use by an Indian gym-goer needs **300–350 items** covering all meal slots, regional diversity, and fitness-specific items

**Correction:** Target **350 foods** for v1 launch, organized into 20 categories (expanded from 17 — see below).

### Gap 2 — Missing Categories
The plan mentions "dal, roti, rice, veg, dairy, eggs/chicken/fish, snacks, fruits, drinks, supplements" (10 items). Missing:
- **Street food** (samosa, vada pav, pani puri, bhel, pav bhaji — daily indulgences)
- **Sweets / Mithai** (gulab jamun, ladoo, barfi, jalebi, halwa — festive + regular)
- **Regional breakfast items** (poha, upma, dosa, idli, medu vada, paratha)
- **Fast food / restaurant chains** (Dominos, McDonald's India, Maggi noodles)
- **Cooking oils & fats** (ghee, coconut oil, mustard oil — huge hidden calorie contributor)
- **Condiments & chutneys** (pickle, raita, chutney — hidden calorie sources)
- **Protein powders / supplements** (whey, casein, soy protein, creatine)

**Correction:** Expand to **20 categories** (see Category Architecture below).

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

**Correction:** Standardize serving library with 15 serving types (expanded — see below).

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

## 🔍 NEW Gaps Identified (v2 Extended Audit — 2026-04-02)

### Gap 9 — Critical Trending Fitness Foods Missing Entirely

Research shows the following are the most searched and consumed foods by Indian gym-goers in 2025–26, but **none appear in the current category architecture**:

| Food | Why critical |
|------|-------------|
| **Makhana (Fox Nuts / Lotus Seeds)** | Fastest-growing Indian fitness snack; ~350 cal/100g, 9g protein, low fat, antioxidant-rich. Searched constantly on HealthifyMe, Fittr. |
| **Sattu (Roasted Bengal Gram Flour)** | 20g protein per 100g, very high fiber, 380 cal/100g. Rising from Bihar/UP staple to national fitness trend. Sattu sharbat is the "desi protein shake." |
| **Sprouts** (moong, chana, mixed) | Classic Indian gym food. Sprouting increases protein bioavailability 20–30%. Moong sprouts: 3g protein per 100g raw, used in chaat, salads. |
| **Moong Dal Chilla** | Savory pancake: 12–14g protein per serving. Most popular high-protein Indian breakfast among fitness community. |
| **Roasted Chana** (Bengal gram) | 100g has more protein than chicken breast per weight (18–20g). Classic gym snack. Very affordable. |
| **Soya Chunks / Granules** | 52g protein per 100g dry weight. Most protein-dense Indian food. Critical for vegetarian gym-goers. MuscleBlaze, HK Vitals brand soya chunks widely used. |
| **Khakhra** | Gujarati crispy flatbread. ~400 cal/100g, 10g protein, very popular healthy snack. MuscleBlaze sells "protein khakhra." |
| **Masala Oats / Oats Upma** | Oats adapted to Indian palate. High fiber, good carb source. Quaker Masala Oats is a top-seller in India. |
| **Greek Yogurt** | Growing fast in Tier 1 cities. Epigamia, Sleepy Owl, Mother Dairy brands. 10g protein per 100g. |
| **Peanut Butter** | Saffola, My Fitness, MuscleBlaze brands widely tracked by gym-goers. Serves as cheap protein+fat snack. |
| **Protein Ladoo / Protein Balls** | Trending DIY fitness food: whey + dry fruits + jaggery + oats. Needs a "custom" entry type. |
| **Tofu** | Fast-growing vegan protein source in Indian fitness community. Silken vs firm varieties differ significantly. |
| **Rajgira / Amaranth** | Fasting food AND trending superfood. Protein-rich (14g/100g), gluten-free, used in chikkis and ladoos during Navratri. |
| **Coconut Water** | Most popular post-workout hydration. Electrolyte source. Tender coconut water: 19 cal/100ml, 0.7g protein. |
| **Jaggery (Gud)** | Used instead of sugar; commonly added to chikki, sattu drink, chai. ~383 cal/100g, minimal processing. |

**Correction:** Add these 15 items across existing and new categories. Several need their own subcategory in the food architecture.

---

### Gap 10 — No Hindi / Transliterated Name Field for Search

Indian users search in English-transliterated Hindi. HealthifyMe's #1 differentiator is its ability to match "aloo" with "potato", "gobhi" with "cauliflower", "dahi" with "curd", etc.

**Missing from current schema:** A `hindiName` or `localNames` field that supports transliterated search.

**Evidence from current `nameAlt` approach:** The current schema has `nameAlt: ['arhar dal', 'toovar dal']` which partially solves this, but `nameAlt` is treated as a simple string array. It doesn't handle common spelling variants (`"toovar"` vs `"tuvar"` vs `"tuver"`) or Hindi script.

**Correction:** Expand the schema to:
```js
nameAlt: ['arhar dal', 'toovar dal', 'pigeon pea dal'],  // existing — keep
hindiName: 'तुअर दाल',                                    // NEW — Hindi script (future use)
searchTerms: ['toovar', 'tuvar', 'tuver', 'arhar', 'arher'], // NEW — transliteration variants
```
The `searchTerms` array is what the search util fuzzy-matches against. This directly copies what IFCT 2017 + NIN use in their classification notes.

---

### Gap 11 — Millets Buried in Grains — Must Be Their Own Category

The government's **Shree Anna (Millets) initiative** and ICMR promotion have made millets mainstream in Indian fitness by 2025. Searches for "jowar roti calories", "bajra roti protein", "ragi dosa nutrition" are among the top food queries in Indian fitness communities. Millets are currently lumped into `grain-cereal` with just "ragi, bajra, jowar" as examples.

**Missing millets and millet-based foods:**
- Jowar (Sorghum) roti / bhakri
- Bajra (Pearl Millet) roti / khichdi
- Ragi (Finger Millet) dosa / mudde / roti
- Foxtail Millet (Kangni) khichdi
- Kodo Millet (Kodon) rice
- Little Millet (Kutki) upma
- Barnyard Millet (Sanwa) khichdi (used in fasting)

**Correction:** Create a dedicated `millet` category (Category 18) with 12 items covering both raw flour and cooked dishes.

---

### Gap 12 — No Fasting Food Support (Navratri, Ekadashi, Ramzan)

A significant portion of the Indian population fasts regularly:
- **Navratri** (9 days, twice yearly) — no grains, no onion/garlic; allowed: sabudana, rajgira, singhara atta, makhana, fruits, sendha namak
- **Ekadashi** (twice monthly) — no grains; allowed: fruits, milk, nuts, amaranth
- **Ramzan / Ramadan** — sehri and iftar nutrition tracking; dates, fruit, hydration critical

During fasting periods, users still need accurate calorie/macro tracking. None of the current fasting-friendly foods are tagged or categorized.

**Correction:**
1. Add `isFastingFood: false` boolean to the schema (default false)
2. Add `fastingTypes: []` array (values: `'navratri' | 'ekadashi' | 'jain-paryushana' | 'ramzan'`)
3. Tag all relevant foods: sabudana, rajgira, makhana, kuttu atta, singhara atta, barnyard millet, sendha namak
4. Add a "Fasting" filter toggle on FoodLogPage that shows only `isFastingFood: true` items

---

### Gap 13 — Cooking Oil/Ghee Hidden Calorie Problem Not Addressed

**This is the single biggest calorie tracking failure in Indian diet apps.** Indian cooking almost always involves tempering (tadka) with ghee or oil, which is rarely logged.

- 1 tbsp ghee in dal tadka = 112 calories (logged by almost no one)
- 2 tbsp oil in sabzi = ~240 calories (invisible to most users)
- Deep frying absorption: puri absorbs ~3–4g oil during frying

The current plan treats `oil-fat` as a standalone food category but provides no guidance on how to track cooking oil as a *modifier* on other dishes.

**Correction — two changes:**
1. **Add `cookingOilNote` field to dish-type foods:**
```js
// Example for dal:
cookingOilNote: 'Includes ~1 tsp oil/ghee for tadka. Add separately if tracking precisely.',
estimatedOilG: 5,  // estimated grams of oil/ghee in the stated serving
```
2. **Add "Oil/Ghee Used in Cooking" as a quick-add chip in FoodLogPage** — a small pill below each logged meal: `"+ Add oil used in cooking"` which opens a mini selector for ghee/oil amount. This is how HealthifyMe handles it.

---

### Gap 14 — Namkeen / Packaged Indian Snacks Not Represented

Haldiram's, Bikaji, Bikanervala, and other Indian snack brands are among the most commonly logged items in Indian fitness apps. These are:
- Haldiram's Aloo Bhujia (very popular, but 520 cal/100g — users are shocked)
- Bikaji Moong Dal (fried)
- Haldiram's Mixture
- Parle-G biscuits (already noted)
- Britannia 50-50 biscuits
- Lays chips (masala/classic)

The current plan's `fast-food` category only has "Parle-G biscuits, Marie biscuits" and focuses on Western fast food (Dominos, McD). Indian packaged namkeen is a separate, very large category.

**Correction:** Rename `fast-food` to `packaged-food` and split into two subcategories: `western-fast-food` and `indian-packaged-namkeen`. Target 20 items total instead of 15.

---

### Gap 15 — FSSAI Missing as Data Source

**FSSAI (Food Safety and Standards Authority of India)** mandates nutritional labeling on all packaged Indian food products. Their database and labeling requirements are the legal standard for Indian packaged foods.

For any packaged food (biscuits, chips, protein bars, branded milk), the nutritional data should be sourced from FSSAI-compliant labels, not USDA or HealthifyMe estimates.

**Correction:** Add FSSAI as a data source in the priority order:
```
Priority 1: IFCT-2017 (raw/cooked Indian ingredients)
Priority 2: FSSAI label data (packaged Indian products)    ← NEW
Priority 3: USDA FoodData Central (cross-reference)
Priority 4: HealthifyMe / MyFitnessPal estimates
Priority 5: Curated estimates
```
Add `'FSSAI-label'` as a valid `source` enum value.

---

### Gap 16 — Serving Size Library Is Missing Key Sizes

Three serving sizes are missing that are critical for Indian fitness tracking:

| Missing Serving | Used For | Approx Grams |
|----------------|----------|-------------|
| `handful` | Roasted chana, makhana, nuts, dry fruits | 30g |
| `medium` | Fruits (banana, apple, mango) | varies per fruit |
| `egg` | 1 whole egg unit | 50g |

Currently, the `piece` serving covers too many disparate items (ladoo 40g, idli 40g, samosa 80g, vada 60g). Each piece-type food should declare its own `grams` in the `servings` array, which is already possible — but `handful`, `medium`, and `egg` as named serving types are still missing from the library.

**Correction:** Add 3 serving types to the standardized library. See updated Serving Library section below.

---

### Gap 17 — Soy-Based Foods Have No Category or Subcategory

Soya chunks (textured vegetable protein / TVP) have **52g protein per 100g** — the highest protein density of any common Indian food. They are sold by every major Indian supplement brand (MuscleBlaze, HK Vitals, Urban Platter). Yet they appear nowhere in the category architecture or examples.

Tofu is also rapidly growing in Indian fitness circles, especially in Tier 1 cities.

**Correction:** Add `soy-based` as a subcategory within `supplement` OR create a standalone `plant-protein` category alongside supplements. At minimum, add these items:
- Soya chunks (dry, 52g protein/100g)
- Soya granules (fine, used in bhurji)
- Tofu (silken, 5g protein/100g)
- Tofu (firm, 8g protein/100g)
- Soy milk (unsweetened, 3.3g protein/100ml)

---

### Gap 18 — No Meal Timing / Indian Meal Pattern Context

Indian meal patterns differ significantly from Western ones:
- **Chai + biscuit** at 6–7am (pre-breakfast)
- **Breakfast** at 8–9am
- **Tiffin / Mid-morning snack** at 11am (lunchbox culture)
- **Lunch** at 1–2pm (the largest meal for most Indians)
- **Evening chai + snack** at 4–5pm (mandatory for most)
- **Pre-workout** at 6–7pm (gym session typically 7–9pm for working professionals)
- **Post-workout / Dinner** at 9–10pm

The current FoodLogPage plan has only 6 meal slots: `Breakfast / Mid-Morning / Lunch / Pre-Workout / Dinner / Snack`. This misses:
- **Chai Break** (crucial — chai alone is 30–60 cal depending on sugar + milk)
- **Post-Workout** as a distinct slot from Dinner
- **Before Bed** (casein protein window — many Indian gym-goers drink warm milk with protein here)

**Correction:** Expand meal slots to 8:
```js
MEAL_SLOTS = [
  'Breakfast',
  'Mid-Morning',
  'Lunch',
  'Evening Snack / Chai',   // renamed from generic Snack
  'Pre-Workout',
  'Post-Workout',
  'Dinner',
  'Before Bed',             // new — casein/slow protein window
]
```

---

### Gap 19 — No Support for Homemade Recipe Logging in v1 Schema

Indian cooking is heavily homemade. A user cooking dal-tadka doesn't want to separately log:
- Toor dal (100g)
- Mustard oil (1 tsp)
- Garlic (2 cloves)
- Tomato (1 medium)
- Cumin seeds (0.5 tsp)

They want to log "Dal Tadka (1 katori)" and get an approximate total.

The current plan defers recipe builder to Phase 4. But the schema needs to accommodate it from v1 — even if the UI comes later — so recipes don't require a schema migration.

**Correction:** Add `isRecipe: false` and `recipeIngredients: []` to the food schema now. Pre-built recipes like "Dal Tadka (homestyle)" can be added to the database as curated composite entries with `isRecipe: true` and `confidence: 'medium'`.

---

### Gap 20 — The Chai Customization Problem

**Problem:** Indians drink chai and coffee 2–5 times daily, yet the calorie range is enormous:
- Chai with full-fat milk + 2 tsp sugar = ~80 cal per cup
- Chai with toned milk + 1 tsp sugar = ~45 cal per cup
- Black tea (no milk, no sugar) = ~2 cal per cup
- Cutting-phase drinker replacing sugar with stevia + skim milk = ~20 cal per cup

The current plan's generic `"Chai (with sugar/without)"` entries force users to pick one or the other, making daily tea logging inaccurate by 40–60 cal per cup — which adds up to 120–180 cal/day for a 3-chai-a-day person. For a 1,500 kcal deficit diet, that's a 10% error from a single uncustomized beverage.

**Correction — Beverage Builder for `drink` category items:**

Introduce a `hasBeverageModifiers: true` flag on certain drink entries (`chai-base`, `coffee-base`, `haldi-doodh-base`). When a food with this flag is selected in FoodLogPage, a secondary "Build your drink" picker appears **before** confirming the log entry, with quick-add modifier chips:

**Milk modifiers** (radio — pick one):
- No milk
- 50ml toned milk (+18 cal, +1.8g protein)
- 50ml full-fat milk (+33 cal, +1.6g protein)
- 50ml skim milk (+18 cal, +1.8g protein, less fat)
- 30ml condensed milk (+90 cal — "cutting phase enemy")

**Sweetener modifiers** (optional, stackable):
- No sugar
- 1 tsp sugar (+16 cal)
- 1 tsp jaggery (+15 cal)
- Stevia/sweetener (0 cal)

The Beverage Builder computes the total calories inline before the user confirms. This directly mirrors how HealthifyMe handles "Chai with modifications" and is the #1 UX improvement for daily drink accuracy.

**Database change:** Add 3 new base entries to the `drink` category:
```js
{ id: 'chai-base', name: 'Chai (base — black tea)', hasBeverageModifiers: true,
  per100g: { calories: 2, protein: 0.1, carbs: 0.3, fat: 0 }, ... }
{ id: 'coffee-black', name: 'Black Coffee (no milk/sugar)', hasBeverageModifiers: true,
  per100g: { calories: 2, protein: 0.3, carbs: 0.3, fat: 0 }, ... }
{ id: 'haldi-doodh-base', name: 'Haldi Doodh (Turmeric Milk base)', hasBeverageModifiers: true, ... }
```

**Schema addition:** `hasBeverageModifiers: false` — boolean flag (default false). Only `drink` category items use it.

**Files:** `indianFoods.js` (3 new base entries), `FoodLogPage.jsx` (Beverage Builder UI), `foodUtils.js` (`calcBeverageMacros(baseFood, milkModifier, sweetenerModifier)` helper).

---

### Gap 21 — Core Jain Diet Support

**Problem:** The schema's `dietTypes` array is defined as:
```js
dietTypes: ['vegan', 'veg', 'egg', 'nonveg']
```
This completely omits the Jain diet. Jainism is a **permanent dietary identity** for millions of Indians — not a fasting mode. Everyday Jain restrictions include:
- No root vegetables (potatoes, onions, garlic, carrots, beetroot, radish, ginger — these are treated as living organisms)
- No eating after sunset (some followers)
- During Paryushana: additional restrictions (no green vegetables, no multi-seed fruits)

The current plan references `'jain-paryushana'` in `fastingTypes[]` but this treats Jainism as only relevant during fasting — which is wrong. A Jain user's everyday diet (all year) excludes aloo, gobhi with onion, any dal with garlic tadka, etc.

The impact is concrete: if a Jain user filters by `dietType: 'veg'`, they would be shown aloo paratha, palak paneer with garlic, onion-based chutney — all of which they cannot eat.

**Correction — two changes:**

1. **Add `'jain'` to the `dietTypes` enum in the schema:**
```js
dietTypes: ['vegan', 'veg', 'jain', 'egg', 'nonveg']
//                          ↑ NEW
```

2. **Add `containsRootVeg: false` boolean field** to the schema, populated for all foods. Foods where this is `true` (aloo, onion, garlic, ginger, carrot, radish, beetroot, turnip) are automatically excluded when the user's diet type is `'jain'`. This is simpler and more accurate than trying to tag each food manually:
```js
containsRootVeg: false,  // ← NEW — true for any food with potato, onion, garlic, carrot etc.
```

3. **FoodLogPage filter:** When the user's `user.dietType === 'jain'`, the search results automatically exclude any food where `containsRootVeg: true` OR where `dietTypes` doesn't include `'jain'`. This filter is always-on (not a toggle), since for Jain users it is permanent.

4. **Tag taxonomy addition:** Add `jain-friendly` to the Dietary tags in the tag taxonomy.

**Data impact:** A significant portion of Indian sabzis, dals, chutneys, and street food contain onion or garlic and will need `containsRootVeg: true`. This is a tagging effort, not a schema change, and can be done progressively.

---

### Gap 22 — The Swiggy/Zomato Portion Distortion

**Problem:** Urban Indian users ordering from Swiggy or Zomato are severely underestimating calories because no serving size in the current library maps to how delivery food is packaged and consumed:

| Delivery container | Actual weight | Closest current option | Error |
|---|---|---|---|
| Standard gravy container (dal, sabzi, curry) | 450–550ml / ~480g | `bowl` (200g) | **~140% undercount** |
| Biryani (single order) | 600–800g | `plate` (300g) | **~100–160% undercount** |
| Thali (restaurant, full) | 800–1200g | `plate` (300g) | **~170–300% undercount** |
| Side dish container (raita, chutney) | 80–100g | `katori` (150g) | ~50% overcount |

A user logging "Dal Makhani, 1 bowl" means something completely different at home (200g) vs. a restaurant order (500g). The calorie difference: ~230 cal vs. ~575 cal. For someone tracking a 1,800 cal diet, this single error is 19% of their daily budget.

**Correction — add 3 new serving sizes to the standardized library:**

| Serving ID | Label | Default Grams/ml | Used For |
|-----------|-------|:---:|----------|
| `takeaway-container` | 1 takeaway container | 480g | Swiggy/Zomato standard gravy container (dal, sabzi, curry) |
| `restaurant-portion` | 1 restaurant portion | 600g | Single restaurant biryani order, thali main dish |
| `thali` | 1 full thali | 900g | Complete restaurant/dhaba thali with multiple items |

**FoodLogPage UX:** When a user selects any serving containing "restaurant" or "takeaway" in the label, show a small info chip:
> "📦 Delivery portion sizes vary. This is an estimate for a standard Swiggy/Zomato container."

**Files:** `servingTypes.js` (3 new entries), `FoodLogPage.jsx` (info chip for delivery servings).

---

### Gap 23 — Gravy Consistency: Thick vs. Thin Calorie Variance

**Problem:** The same dish name can have dramatically different calorie densities depending on water content and cooking style:

| Dish | Thick/Restaurant-style | Thin/Home-style | Difference |
|------|------------------------|-----------------|------------|
| Dal Makhani (per 100g) | ~120 cal | ~55 cal | 118% |
| Rajma (per 100g) | ~110 cal | ~65 cal | 69% |
| Sambar (per 100g) | ~80 cal | ~30 cal | 167% |
| Palak Paneer (per 100g) | ~150 cal | ~90 cal | 67% |

The standard katori portion (150g) therefore has calories that could be off by 50–100% depending on whether the user's version is home-cooked and watery vs. restaurant/dhaba-style.

**Correction — Phase 4 feature: Consistency Modifier:**

Add a `supportedConsistencyTypes` field to the schema for `dish` items:
```js
// Only for itemType === 'dish' with significant water-content variance
supportedConsistencyTypes: ['thin', 'thick'],   // ← NEW
consistencyMultipliers: {
  thin: 0.7,    // thin/watery version = 70% of base calorie density
  thick: 1.3,   // thick/restaurant = 130% of base calorie density
  standard: 1.0 // default (medium consistency, homestyle)
},
```

In Phase 4's FoodLogPage, when logging a dish that `supportedConsistencyTypes.length > 0`, show a 3-option toggle after serving selection:
```
How was it cooked?
[💧 Watery/Thin]  [🥣 Normal]  [🍲 Thick/Rich]
```
The macro calculation applies the appropriate `consistencyMultiplier` to the `per100g` values before computing the total.

**Phase 4 rollout priority:** This applies first to the 12 most-logged home dishes (dal, rajma, chole, sambar, palak-based sabzis, curry gravies). Static `per100g` values for dishes should represent the `standard` consistency baseline.

**Files:** `indianFoods.js` (add `supportedConsistencyTypes` and `consistencyMultipliers` to ~30 dish entries in Phase 4), `FoodLogPage.jsx` (consistency toggle UI, Phase 4), `foodUtils.js` (`calcMacrosWithConsistency(food, servingId, qty, consistencyType)` function).

---

### Gap 24 — Tracking India's Critical Micronutrient Deficiencies

**Problem:** The existing micronutrient plan proposes only `sodium` (for water retention/blood pressure). This misses two far more prevalent and serious deficiencies in India's fitness population:

**Vitamin B12 deficiency:**
- 47% of Indians are B12 deficient (ICMR 2019 data)
- Vegetarians are at near-100% risk without supplementation — B12 exists **only** in animal products (meat, eggs, dairy, fermented foods in trace amounts)
- B12 deficiency causes fatigue, weakness, poor muscle recovery, and nerve damage — directly impacting fitness performance
- Gym-going vegetarians are particularly vulnerable: high-protein plant-based diets don't solve B12

**Vitamin D3 deficiency:**
- 70–90% of Indians are D3 deficient (ICMR + AIIMS data), paradoxically despite abundant sunlight
- D3 is critical for testosterone production, calcium absorption (bone density), and muscle function
- Most Indian foods contain near-zero D3; dietary sources are limited to fatty fish, egg yolk, fortified milk
- For gym-goers: D3 deficiency directly limits strength gains and recovery

**Correction — two schema changes:**

```js
per100g: {
  calories: 116,
  protein: 7,
  carbs: 20,
  fat: 0.4,
  fiber: 4,
  sodium: null,        // mg — optional for v1
  vitaminB12: null,    // ← NEW — mcg — optional for v1; critical for vegetarian alert system
  vitaminD: null,      // ← NEW — IU (International Units) — optional for v1
  iron: null,          // ← NEW — mg — optional for v1; already flagged in Gap 5, now formalized
  calcium: null,       // ← NEW — mg — optional for v1; already flagged in Gap 5, now formalized
},
```

**Phase 4 smart alert system:**

The app tracks the user's `dietType` and their logged micronutrients for the week. Two proactive nudges fire on the Dashboard or DietPage:

**B12 alert** (for `dietType: 'veg'` or `dietType: 'vegan'`):
> "🔬 You've logged 0 mcg Vitamin B12 this week. Vegetarians cannot get B12 from plant foods alone. Consider: fortified milk, B12-fortified cereals, or a supplement. [Learn more]"

**D3 alert** (universal, fires if logged D3 < 200 IU/day for 7+ consecutive days):
> "☀️ Your diet has very little Vitamin D3 this week. Indian foods are naturally low in D3. Top sources: egg yolk, fatty fish, fortified milk. A D3 supplement is recommended for most Indians. [Learn more]"

**Data impact:** B12 values are near-zero for all plant foods (set to 0) and meaningful only for: eggs, milk, paneer, curd, chicken, fish, meat. D3 values are meaningful only for: fatty fish (tuna, salmon, mackerel), egg yolk, fortified milk brands. These are quick to populate.

**Priority order for data entry:** B12 first (affects a larger percentage of the app's vegetarian user base), D3 second.

---

## 🏗️ Category Architecture (20 Categories, ~350 Foods)

> Additions vs. original: Categories 18 (millets, split from grains), 19 (sprouts + soy), 20 (packaged namkeen, renamed from fast-food). Count targets revised upward.

| # | Category ID | Label | Count Target | Key Examples (with new additions in **bold**) |
|:-:|-------------|-------|:------------:|---------|
| 1 | `grain-cereal` | Grains & Cereals | 12 | Rice (white, brown, basmati), wheat flour, oats, poha flakes, rava/suji, **masala oats**, **oats upma**, quinoa |
| 2 | `roti-bread` | Roti & Breads | 15 | Chapati, phulka, paratha (plain/aloo/gobi), naan, puri, luchi, thepla, rumali roti, bread (white/brown), **missi roti** |
| 3 | `rice-dish` | Rice Dishes | 12 | Jeera rice, dal khichdi, veg pulao, chicken biryani, mutton biryani, curd rice, lemon rice, veg fried rice |
| 4 | `dal-legume` | Dals & Legumes | 22 | Toor dal, moong dal, chana dal, masoor dal, urad dal, rajma, chole, black-eyed peas, **sprouted moong (cooked)**, **chana dal dry**, sambar, dal makhani, **moong dal chilla** |
| 5 | `sabzi-veg` | Vegetables & Sabzi | 25 | Aloo gobi, palak paneer, bhindi fry, baingan bharta, mix veg, gobi manchurian, paneer butter masala, matar paneer, dal palak, **palak (raw)**, **spinach sauté** |
| 6 | `non-veg` | Non-Veg Dishes | 20 | Chicken curry, butter chicken, tandoori chicken, egg curry, fish curry, mutton rogan josh, chicken tikka, keema, fish fry, **chicken breast (grilled/boiled)**, **tuna (canned)** |
| 7 | `egg` | Eggs | 8 | Boiled egg, omelette (1 egg), scrambled eggs, egg bhurji, anda curry, egg fried rice, **egg white (1)**, **egg white omelette** |
| 8 | `dairy` | Dairy | 20 | Milk (full fat/toned/skim), curd/dahi, paneer, lassi (sweet/salt), chaas, raita, ghee (1 tbsp), cheese slice, butter (1 pat), **Greek yogurt (Epigamia)**, **whey protein milk**, **paneer (low fat)** |
| 9 | `breakfast` | Breakfast & Tiffin | 20 | Masala dosa, plain dosa, idli, medu vada, upma, poha, aloo paratha, chole bhature, uttapam, pongal, appam, puttu, **besan chilla**, **moong dal chilla**, **rava idli** |
| 10 | `snack-street` | Snacks & Street Food | 22 | Samosa, vada pav, pani puri, bhel puri, sev puri, pav bhaji, pakora, dhokla, kachori, aloo tikki, momos, spring roll, chaat, **roasted chana (100g)**, **makhana (roasted, 30g)**, **khakhra (plain/multigrain)** |
| 11 | `sweet-mithai` | Sweets & Mithai | 15 | Gulab jamun, rasgulla, ladoo (besan/motichoor), barfi, jalebi, halwa (sooji/gajar), kheer, rabri, sandesh, kalakand |
| 12 | `fruit` | Fruits | 22 | Banana, apple, mango, papaya, guava, pomegranate, watermelon, chikoo, grapes, orange, pineapple, coconut (fresh), dates (khajoor), dry fruits (almonds, cashews, walnuts, **peanuts**, raisins, **sunflower seeds**, **chia seeds**) |
| 13 | `drink` | Drinks & Beverages | 18 | Chai (with sugar/without), coffee, green tea, nimbu pani, coconut water, mango shake, banana shake, sugarcane juice, Rooh Afza, cola (can), beer (330ml), ORS, **sattu sharbat**, **protein shake (homemade)**, **turmeric milk (haldi doodh)** |
| 14 | `oil-fat` | Oils & Fats | 10 | Ghee (1 tbsp), coconut oil (1 tbsp), mustard oil (1 tbsp), sunflower oil, olive oil, butter (1 pat), cream, mayonnaise, **peanut butter (1 tbsp)**, **almond butter** |
| 15 | `condiment` | Condiments & Sides | 10 | Green chutney, tamarind chutney, pickle (mango), raita, papad (fried/roasted), sugar (1 tsp), honey (1 tbsp), tomato ketchup, **jaggery (1 tsp)**, **sendha namak** |
| 16 | `supplement` | Supplements & Protein | 15 | Whey protein (1 scoop — MuscleBlaze/ON), casein (1 scoop), soy protein isolate, creatine (5g), **soya chunks (dry, 50g)**, **soya granules**, **tofu (firm 100g)**, **tofu (silken)**, protein bar (RiteBite/Yoga Bar), mass gainer (1 serving), BCAA |
| 17 | `packaged-food` | Packaged & Fast Food | 20 | Maggi noodles, pizza slice (Dominos), burger (McD), french fries, momos (frozen), bread toast with butter, Parle-G biscuits, Marie biscuits, **Haldiram's Aloo Bhujia (30g)**, **Haldiram's Mixture (30g)**, **Bikaji Moong Dal (30g)**, **Lays (1 packet/26g)**, **Quaker Masala Oats (1 pouch)** |
| 18 | `millet` | Millets & Ancient Grains | 14 | **Jowar roti**, **bajra roti**, **ragi dosa**, **ragi mudde**, **ragi porridge**, **jowar khichdi**, **bajra khichdi**, **foxtail millet upma**, **barnyard millet khichdi (fasting)**, **rajgira (amaranth) chikki**, **rajgira ladoo**, **sattu roti**, **kuttu atta roti (fasting)**, **singhara atta halwa (fasting)** |
| 19 | `sprout-soy` | Sprouts & Plant Protein | 12 | **Moong sprouts (raw, 100g)**, **chana sprouts (100g)**, **mixed sprouts salad**, **sprouted moong chaat**, **sprouted methi (fenugreek)**, **soy milk (250ml)**, **tofu bhurji**, **soya chunk curry**, **edamame**, **sattu (dry powder, 30g)**, **sattu paratha**, **besan (gram flour, raw, 100g)** |
| 20 | `fasting-food` | Fasting & Vrat Foods | 10 | **Sabudana khichdi**, **sabudana vada**, **makhana kheer**, **rajgira chikki**, **kuttu ka dosa**, **singhara atta puri**, **vrat ki khichdi (sama rice)**, **banana with honey**, **curd with fruits (vrat platter)**, **raw banana sabzi** |
| | | **Total** | **~342** | *(aim for 340–360 with regional variants)* |

---

## 📐 Updated Food Object Schema (v2.3)

> New fields vs. v2.2 are marked with `// ← NEW (v2.3)`; v2.2 fields marked with `// ← NEW (v2.2)`

```js
{
  id: 'dal-toor-cooked',              // unique kebab-case ID
  name: 'Toor Dal (cooked)',           // display name
  nameAlt: ['arhar dal', 'toovar dal', 'pigeon pea dal'],  // search aliases
  hindiName: 'तुअर दाल',              // ← NEW (v2.2) — Hindi script (future use)
  searchTerms: ['toovar', 'tuvar', 'tuver', 'arhar', 'arher'], // ← NEW (v2.2) — transliteration variants
  category: 'dal-legume',             // from 20-category list
  subcategory: 'legume-curry',         // optional sub-grouping
  itemType: 'base-food',              // 'base-food' | 'dish' | 'drink' | 'supplement' | 'snack'
  state: 'cooked',                    // 'raw' | 'cooked' | 'fried' | 'baked' | 'steamed' | 'roasted'
  region: 'pan-indian',               // 'pan-indian' | 'north' | 'south' | 'east' | 'west'
  defaultServingGrams: 150,
  per100g: {
    calories: 116,
    protein: 7,
    carbs: 20,
    fat: 0.4,
    fiber: 4,
    sodium: null,        // mg — optional for v1
    vitaminB12: null,    // ← NEW (v2.3) — mcg; ~0 for all plant foods; meaningful for eggs/dairy/meat
    vitaminD: null,      // ← NEW (v2.3) — IU; meaningful only for fatty fish, egg yolk, fortified milk
    iron: null,          // ← NEW (v2.3) — mg; important for female users
    calcium: null,       // ← NEW (v2.3) — mg; important for dairy tracking
  },
  servings: [
    { id: 'katori', label: '1 katori', grams: 150 },
    { id: 'bowl', label: '1 bowl', grams: 200 },
    { id: 'g100', label: '100g', grams: 100 },
  ],
  dietTypes: ['vegan', 'veg', 'jain', 'egg', 'nonveg'],  // ← 'jain' added (v2.3)
  tags: ['lunch', 'dinner', 'high-fiber', 'high-protein', 'budget-friendly'],
  isProcessed: false,
  isFastingFood: false,                // ← NEW (v2.2) — true for Navratri/Ekadashi-safe foods
  fastingTypes: [],                    // ← NEW (v2.2) — ['navratri', 'ekadashi', 'jain-paryushana', 'ramzan']
  isGlutenFree: false,                 // ← NEW (v2.2)
  isRecipe: false,                     // ← NEW (v2.2) — true for composite curated dishes
  recipeIngredients: [],               // ← NEW (v2.2) — array of {foodId, grams} for recipe type only
  containsRootVeg: false,              // ← NEW (v2.3) — true if contains potato/onion/garlic/carrot/ginger; used for Jain filter
  hasBeverageModifiers: false,         // ← NEW (v2.3) — true for chai/coffee/haldi-doodh; triggers Beverage Builder UI
  supportedConsistencyTypes: [],       // ← NEW (v2.3) — ['thin','thick'] for dish types with significant water-content variance
  consistencyMultipliers: {},          // ← NEW (v2.3) — { thin: 0.7, standard: 1.0, thick: 1.3 } — applied to per100g in Phase 4
  gi: null,                            // glycemic index, optional
  cookingOilNote: null,               // ← NEW (v2.2)
  estimatedOilG: 0,                   // ← NEW (v2.2)
  source: 'IFCT-2017',                // 'IFCT-2017' | 'FSSAI-label' | 'USDA' | 'healthifyme' | 'curated-estimate'
  confidence: 'high',                 // 'high' | 'medium' | 'low'
  notes: '',
}
```

### Schema Tag Taxonomy (standardized)

Replace the ad-hoc tag strings with a defined vocabulary to make filtering possible:

**Meal timing tags:** `breakfast` `lunch` `dinner` `pre-workout` `post-workout` `snack` `before-bed` `anytime`

**Nutrition profile tags:** `high-protein` `very-high-protein` `low-carb` `high-carb` `high-fiber` `low-fat` `high-fat` `low-calorie` `calorie-dense`

**Goal-specific tags:** `muscle-building` `weight-loss` `cutting` `bulking` `maintenance`

**Practical tags:** `budget-friendly` `quick-to-make` `no-cook` `meal-prep-friendly` `restaurant-common`

**Dietary tags:** `vegan` `vegetarian` `jain` `jain-friendly` `gluten-free` `dairy-free` `fasting-safe`

---

## 🔢 Standardized Serving Library (v3 — 18 types)

> v2.2 additions marked with ← NEW (v2.2); v2.3 additions marked with ← NEW (v2.3)

| Serving ID | Label | Default Grams | Used For |
|-----------|-------|:------------:|----------|
| `roti` | 1 roti/chapati | 35 | Roti, chapati, phulka |
| `paratha` | 1 paratha | 60 | Aloo/gobi/plain paratha |
| `katori` | 1 katori | 150 | Dal, sabzi, curry (homestyle) |
| `bowl` | 1 bowl | 200 | Rice, khichdi, soup (homestyle) |
| `plate` | 1 plate | 300 | Biryani, thali portion (homestyle) |
| `piece` | 1 piece | varies | Samosa (~80g), ladoo (~40g) |
| `glass` | 1 glass | 200 | Milk, lassi, juice |
| `cup` | 1 cup | 150 | Tea, coffee |
| `tbsp` | 1 tablespoon | 15 | Ghee, oil, honey, sugar |
| `scoop` | 1 scoop | 30 | Whey protein, mass gainer |
| `slice` | 1 slice | 30 | Bread, pizza, cake |
| `g100` | 100g | 100 | Universal reference |
| `custom` | Custom (g) | user input | Any food |
| `handful` | 1 handful | 30 | ← NEW (v2.2) — roasted chana, makhana, nuts, dry fruits |
| `medium` | 1 medium | varies | ← NEW (v2.2) — banana (~120g), apple (~150g), mango (~200g) |
| `egg` | 1 egg | 50 | ← NEW (v2.2) — whole egg unit |
| `takeaway-container` | 1 takeaway container | 480 | ← NEW (v2.3) — standard Swiggy/Zomato gravy container (dal, sabzi, curry) |
| `restaurant-portion` | 1 restaurant portion | 600 | ← NEW (v2.3) — single restaurant biryani order, dhaba main dish |
| `thali` | 1 full thali | 900 | ← NEW (v2.3) — complete restaurant/dhaba thali with multiple components |

**Note on `medium` serving:** The `grams` value must be specified per-food in the food's `servings[]` array, not globally. E.g.: `{ id: 'medium', label: '1 medium banana', grams: 120 }`.

**Note on delivery servings:** `takeaway-container`, `restaurant-portion`, and `thali` trigger an info chip in FoodLogPage:
> "📦 Delivery & restaurant portions vary. These are estimates for standard Swiggy/Zomato/dhaba servings."

Foods offered with delivery servings should also retain `katori`/`bowl` as alternatives so home-cooked loggers aren't forced to use the larger sizes.

---

## 📦 Files to Create / Modify

| File | Status | Purpose |
|------|:------:|---------|
| `src/data/foods/indianFoods.js` | 🆕 NEW | Master dataset (~350 food objects, v2.3 schema) |
| `src/data/foods/foodCategories.js` | 🆕 NEW | 20 category definitions with icons, labels, sort order |
| `src/data/foods/servingTypes.js` | 🆕 NEW | Standardized 18-type serving library |
| `src/utils/foodUtils.js` | 🆕 NEW | Search, macro calc, serving conversion, beverage builder calc, consistency multiplier |
| `src/components/pages/FoodLogPage.jsx` | 🆕 NEW | Main food logger with search, serving picker, Beverage Builder, fasting filter, delivery size info chips |
| `src/context/AppContext.jsx` | ✏️ MODIFY | Add `foodLog` state (parallel to existing `caloriesLog`), migration helper |
| `src/components/pages/DashboardPage.jsx` | ✏️ MODIFY | Add macro mini-bars widget (Cal/P/C/F) + B12/D3 nudge cards (Phase 4) |
| `src/components/pages/DietPage.jsx` | ✏️ MODIFY | Add "Log Food" CTA, link to FoodLogPage, display recent entries |
| `src/data/constants.js` | ✏️ MODIFY | Add navigation item for `/food-log` route |
| `App.jsx` | ✏️ MODIFY | Add `/food-log` route |

---

## 🗺️ Implementation Roadmap (4 Phases)

### Phase 1 — Data Foundation
- [x] Create Supabase Schema (Tables & Enums) for Categories, Servings, and Foods (Replaces `.js` files)
- [x] Populate 20 category definitions via `seed.sql`
- [x] Populate 18 standardized serving types via `seed.sql`
- [ ] Populate ~350 foods in the Supabase database
  - [x] Batch 1: Grains, Millets, Roti/Breads, Rice Dishes (Sample seeded)
  - [x] Batch 2: Dals/Legumes, Sprouts & Soy, Sabzi/Veg (Sample seeded)
  - [x] Batch 3: Non-Veg, Eggs, Dairy (50 items) — populate `vitaminB12` and `vitaminD` fields for all entries (eggs, chicken, fish, dairy)
  - [x] Batch 4: Breakfast/Tiffin, Snacks/Street Food — include makhana, khakhra, roasted chana (45 items)
  - [x] Batch 5: Sweets, Fruits, Drinks — include sattu sharbat, coconut water + 3 Beverage Builder base entries for chai/coffee/haldi-doodh (55 items)
  - [x] Batch 6: Oils/Fats, Condiments, Supplements — include soya chunks, soy milk, tofu (40 items)
  - [x] Batch 7: Packaged Food, Fasting Foods (48 items) — `isFastingFood: true` + `fastingTypes[]` for all fasting foods; `containsRootVeg: true` for any aloo/onion/garlic items
- [x] Create `foodUtils.js` utilities:
  - [x] `searchFoods(query, { dietType, fastingType })` — fuzzy match on `name` + `nameAlt` + `searchTerms`; auto-filters `containsRootVeg` for Jain users
  - [x] `calcMacros(food, servingId, quantity)` — computes per-serving macros
  - [x] `calcBeverageMacros(baseFood, milkModifierId, sweetenerModifierId)` — computes chai/coffee total (Gap 20)
  - [x] `filterByFasting(foods, fastingType)` — returns `isFastingFood: true` subset
  - [x] `getRecentFoods(foodLog, n)` — returns last N unique foods logged
  - [x] `getFavoriteFoods(foodLog)` — returns foods starred by user
- [x] Add validation script: unique IDs, valid category, macros in sane ranges, at least 1 serving, `containsRootVeg` set for all sabzi/dal/snack entries

### Phase 2 — FoodLogPage MVP
- [x] Create `FoodLogPage.jsx` with:
  - [x] Search bar with fuzzy matching on `name` + `nameAlt` + `searchTerms`
  - [x] Category filter pills (20 categories + "All")
  - [x] Diet type filter (All / Veg / Vegan / **Jain** / Egg / Non-Veg) — Jain filter auto-hides `containsRootVeg: true` foods permanently when user `dietType === 'jain'`
  - [x] **Fasting filter toggle** — shows only `isFastingFood: true` items (with fasting type selector: Navratri / Ekadashi / Ramzan / Jain Paryushana)
  - [x] Meal slot selector (8 slots: Breakfast / Mid-Morning / Lunch / Evening Snack·Chai / Pre-Workout / Post-Workout / Dinner / Before Bed)
  - [x] Serving picker + custom grams input — **delivery servings** (`takeaway-container`, `restaurant-portion`, `thali`) show info chip: "📦 Delivery estimate"
  - [x] Quantity selector (0.5, 1, 1.5, 2, 2.5, 3)
  - [x] Macro preview before adding (Cal / P / C / F)
  - [x] **Beverage Builder** — fires for any food with `hasBeverageModifiers: true` (chai, coffee, haldi-doodh): milk modifier radio (none / toned / full-fat / skim / condensed) + sweetener chips (none / sugar / jaggery / stevia); previews real-time calorie total before confirming
  - [x] **"+ Add oil used in cooking" quick chip** on dish-type entries (ghee/oil tempering tracker)
  - [x] Daily food log with edit and delete, grouped by meal slot
  - [x] "Custom Food" quick-add form (name + cal + macros manually)
- [x] Add `foodLog` state to `AppContext.jsx`
- [x] Add route `/food-log` and nav item
- [x] Search must handle common spelling variants: "gobhi" → cauliflower, "aloo" → potato, "dahi" → curd, "chai" → tea entries

### Phase 3 — Integration & Retention
- [x] Dashboard: Add macro ring/bar widget showing today's Cal / P / C / F progress vs. goal
- [x] DietPage: Add "Log Food →" CTA button that links to FoodLogPage (Merged into DietPage)
- [x] DietPage: Show today's food log entries inline (recent 5, grouped by meal)
- [x] Add "Recent Foods" section (last 10 unique foods logged, quick re-add)
- [x] Add "Quick Add" — re-log yesterday's meals in one tap
- [x] Add date navigation (prev/next day) on FoodLogPage
- [x] **Protein tracking alert** — if user is >20g short of their protein target by 6pm, show a nudge: "You're 24g short on protein — quick options: 2 eggs, 100g paneer, or 1 scoop whey"

### Phase 4 — Smart Nutrition Layer (post-MVP)
- [x] Weekly macro adherence chart (actual vs. target per macro, per day)
- [x] Goal-aware suggestions: "You're 40g short on protein — try: Paneer 100g, Chicken Breast 100g, 2 Eggs, Soya Chunks 50g, or 1 Scoop Whey"
- [ ] Recipe builder for homemade dishes (combine 2–8 base foods with proportions → curated composite entry)
- [ ] Favorites system (star foods, quick-access from top of search)
- [ ] Streak tracking for food logging consistency (7-day log streak badge)
- [ ] **GI-aware carb guidance** — for weight-loss goal users, flag high-GI carbs (white rice >70 GI) and suggest lower-GI alternatives (brown rice, jowar roti)
- [ ] **Gravy Consistency Toggle** — for `dish` items with `supportedConsistencyTypes.length > 0`, show a 3-option toggle after serving selection:
  ```
  How was it? [💧 Watery/Thin]  [🥣 Normal]  [🍲 Thick/Restaurant-style]
  ```
  Applies `consistencyMultipliers[choice]` to per100g before computing totals. Rollout: dal, rajma, chole, sambar, palak sabzis, curry gravies (~30 dishes).
- [x] **Vitamin B12 alert** (fires for `dietType: 'veg'` or `'vegan'` users when weekly logged B12 < 1.5 mcg):
  > "🔬 Very little B12 logged this week. Vegetarians can't get B12 from plants alone — consider fortified milk, or a B12 supplement."
- [x] **Vitamin D3 alert** (fires for all users when daily logged D3 < 200 IU for 7+ consecutive days):
  > "☀️ Low Vitamin D3 in your diet this week. Top food sources: egg yolk, fatty fish, fortified milk. A D3 supplement is recommended for most Indians."
- [x] **Iron alert** (fires for `user.gender === 'female'` when weekly logged iron < 18mg/day average):
  > "🩸 Your iron intake looks low this week. Top sources: palak, rajma, chana, ragi, dates, non-veg options."

---

## 🧪 Verification Plan

### Automated
- Validation script checks all ~350 foods for: unique IDs, valid category (from 20-category list), macros within sane ranges (calories > 0, protein ≥ 0, all macros individually ≤ calories/4 for protein/carbs and ≤ calories/9 for fat), at least 1 serving defined, valid dietTypes
- All `dietTypes` values must be from: `['vegan', 'veg', 'jain', 'egg', 'nonveg']`
- All `containsRootVeg: false` foods in `sabzi-veg` and `snack-street` categories are manually reviewed (common tagging error)
- Search util returns correct results for transliterated queries: "dahi" → curd, "gobhi" → cauliflower, "aloo" → potato, "sattu" → sattu, "makhana" → fox nuts
- `filterByFasting('navratri')` returns only fasting-safe items (no grains, no onion, no garlic)
- `searchFoods('aloo gobi', { dietType: 'jain' })` returns empty (aloo gobi has `containsRootVeg: true`)

### Manual Test Cases
1. Search "chicken" → returns chicken breast (grilled), chicken curry, butter chicken, tandoori chicken, keema
2. Search "makhana" → returns roasted makhana (30g, snack category)
3. Search "sattu" → returns sattu (dry powder), sattu sharbat, sattu roti, sattu paratha
4. Log dal tadka (1 katori) → "Add oil used in cooking?" chip appears → user adds 1 tsp ghee (+45 cal) → daily total updates
5. Enable fasting filter (Navratri) → search "khichdi" → only barnyard millet / sama rice khichdi appears, not regular rice khichdi
6. Log chicken breast 200g → verify macro calculation matches `per100g × 2`
7. Delete a food entry → verify daily totals update correctly
8. Switch to tomorrow's date → log entry → verify it appears on tomorrow, not today
9. Search "gobhi" → returns aloo gobi, gobi manchurian, gobi paratha
10. Add custom food "Homemade Protein Ladoo" with 280 cal, 15g protein → logs with `sourceType: 'custom'`
11. **[Gap 20 — Beverage Builder]** Select "Chai (base)" → Beverage Builder appears → pick "50ml toned milk" + "1 tsp sugar" → macro preview shows ~50 cal, ~1.8g protein → confirm → entry logged correctly
12. **[Gap 21 — Jain filter]** Set `user.dietType = 'jain'` → search "aloo gobi" → zero results (contains root veg) → search "bhindi fry" → returns result (no root veg) → search "dal tadka" (with garlic) → zero results
13. **[Gap 22 — Delivery portions]** Log "Dal Makhani, 1 takeaway container (480g)" → verify calories ≈ 576 (120 cal/100g × 4.8) → delivery info chip visible → compare to "1 katori (150g)" at ~180 cal to validate the 3× difference is surfaced to the user
14. **[Gap 24 — B12 alert]** Set `user.dietType = 'veg'` → log only plant foods for 3 days → verify B12 alert fires on Dashboard/DietPage with correct message and supplement recommendation

---

## 📊 Data Quality Sources (Priority Order)

1. **IFCT 2017** (Indian Food Composition Tables) — NIN Hyderabad, 528 foods, raw values. Use for base ingredients. Confidence: `high`.
2. **FSSAI label data** — For all packaged Indian products (Haldiram's, Parle-G, Quaker, etc.). This is the legal nutritional label data and should be treated as authoritative for packaged foods. Confidence: `high`. *(Source value: `'FSSAI-label'`)*
3. **USDA FoodData Central** — Cross-reference for common items (eggs, chicken, oats, international foods). Confidence: `high`.
4. **HealthifyMe / MyFitnessPal estimates** — For cooked dishes and street food where no official data exists. Cross-reference at least 2 sources before accepting. Confidence: `medium`.
5. **Curated estimates** — For restaurant/fast food items based on typical recipes. Use only when no other source available; flag clearly. Confidence: `low`.

> When adding foods: IFCT/FSSAI → USDA → app estimates → curated. Never assign `confidence: 'high'` to a curated estimate.

---

## 🔑 Key Indian Fitness Food Macros Reference

> Quick reference for the most critical gym-goer foods not in the original v2 plan. All values are per 100g unless noted.

| Food | Cal | Protein | Carbs | Fat | Notes |
|------|-----|---------|-------|-----|-------|
| Soya chunks (dry) | 345 | 52g | 33g | 0.5g | Highest protein density of any common Indian food |
| Sattu (roasted gram flour) | 380 | 20g | 65g | 6g | "Desi protein shake" — the Bihar superfood gone national |
| Roasted chana | 364 | 22g | 50g | 5g | More protein than chicken breast by weight |
| Makhana (fox nuts, roasted) | 350 | 9g | 77g | 0.5g | Low fat, antioxidant-rich; 30g serving ≈ 105 cal |
| Moong dal chilla (1 serving) | 135 | 9g | 18g | 3g | Per chilla (~80g); adjust for oil used |
| Paneer (full fat) | 265 | 18g | 3g | 20g | Casein-rich; great overnight protein |
| Paneer (low fat, 50% fat-reduced) | 195 | 23g | 3g | 10g | Better for cutting phases |
| Greek yogurt (plain, Epigamia) | 80 | 10g | 4g | 3g | Per 100g; excellent post-workout |
| Rajgira / Amaranth (dry) | 371 | 14g | 66g | 7g | Fasting + superfood; gluten-free |
| Peanut butter (1 tbsp = 16g) | 598 | 25g | 22g | 51g | Per 100g; affordable protein+fat combo |
| Tofu (firm) | 144 | 17g | 3g | 8g | Per 100g; growing in Tier 1 Indian cities |
| Coconut water (tender) | 19 | 0.7g | 4g | 0.2g | Per 100ml; electrolyte-rich post-workout drink |
| Egg white (1 large) | 17 | 3.6g | 0.2g | 0g | Per egg white (~33g) |
| Jaggery (1 tsp = 7g) | 383 | 0.4g | 98g | 0.1g | Per 100g; used in sattu drinks, chai |
| Whey protein (1 scoop = 30g) | 120 | 24g | 3g | 1.5g | Values vary by brand — MuscleBlaze Whey Gold used as reference |
| Dal Makhani (homestyle, medium consistency) | 120 | 5g | 14g | 5g | Per 100g; thick restaurant version ≈ 156 cal/100g |
| Rajma (homestyle, medium) | 105 | 7g | 17g | 2g | Per 100g; thick version ≈ 137 cal/100g |
| Sambar (homestyle, thin) | 35 | 2g | 6g | 0.5g | Per 100g; restaurant thick version ≈ 80 cal/100g |

---

### 🍵 Beverage Builder — Chai Calorie Reality Check

> Reference for the Beverage Builder (Gap 20). All add-on values are per modifier unit.

| Chai component | Calories | Protein | Notes |
|---------------|----------|---------|-------|
| Black tea base (1 cup / 150ml) | 3 | 0.1g | Without anything |
| + 50ml full-fat milk | +33 | +1.6g | Most common in North India |
| + 50ml toned milk (2% fat) | +23 | +1.8g | More common in cities |
| + 50ml skim milk | +17 | +1.8g | Cutting phase choice |
| + 30ml condensed milk | +90 | +2g | "Cutting phase enemy" |
| + 1 tsp sugar (5g) | +20 | 0 | Most common; 2 tsp doubles this |
| + 1 tsp jaggery (7g) | +27 | 0 | Slightly more minerals than sugar |
| + Stevia (1 tablet) | 0 | 0 | Zero cal sweetener |
| **Typical Indian chai (toned milk + 1 tsp sugar)** | **~46 cal** | **1.9g** | **3 cups/day = 138 cal — not trivial** |
| **Strong chai (full fat + 2 tsp sugar)** | **~76 cal** | **1.6g** | **3 cups/day = 228 cal** |