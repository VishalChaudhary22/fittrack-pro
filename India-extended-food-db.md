# TODO — Extended Indian Food Database v3.1
# FitTrack Pro · Extended Food & Beverage Coverage

> **Created:** 2026-04-13 · **v3.1 updated:** 2026-04-13
> **Based on:** `TODO-indian-food-db.md` (v2.2) + Extended Research Report + v3.1 Gap Analysis
> **Purpose:** Maps every new food item (chains, global cuisines, drinks) into the v2.2 schema for AI agent data-entry.
> **New items target:** ~470 additional entries → total database target rises from ~350 → **~820 foods**
> **Schema reference:** Use the v2.2 schema from `TODO-indian-food-db.md`. All new items follow the same schema.

### What changed in v3.1 vs v3.0

| Gap | Description |
|-----|-------------|
| **Batch F (NEW)** | Italian restaurant dishes — pasta, risotto, bruschetta. Zero coverage existed despite pasta being the #2 most-ordered global cuisine in India |
| **Batch G (NEW)** | Vietnamese & SE Asian — Pho, Banh Mi, Nasi Goreng, Laksa; entirely absent in v3.0 |
| **Batch H (NEW)** | Extended Greek, Mediterranean & Turkish — only 4 Middle Eastern items existed; no Greek, no Turkish doner |
| **Batch I (NEW, CRITICAL)** | Bubble Tea / Boba Tea + Matcha + Dalgona — one of India's fastest-growing food trends in 2025–26; not a single entry existed |
| **Batch J (NEW, CRITICAL)** | Health-focused chains, salad bowls, Acai bowls, EatFit meals — essential for a fitness app, entirely absent |
| **Batch K (NEW, CRITICAL)** | Biryani By Kilo (BBK), Popeyes India, Wendy's India, Box8 cloud kitchen — major brands missing from v3.0 |
| **Batch L (NEW)** | International desserts & American brunch — Churros, Crepes, Tiramisu, Pancakes, Avocado Toast; common in Indian cafes |
| **Batch M (NEW)** | Plant-based meat alternatives — Good Dot, Imagine Meats, Evo Foods; fast-growing for veg fitness users |
| **Batch N (NEW, CRITICAL)** | Traditional Indian cooling & festival drinks — Thandai, Aam Panna, Jaljeera, Shikanji, Nannari Sharbat; none existed in v3.0 despite being daily drinks for millions |
| **Batch O (NEW)** | Rajasthani, Marwari & NE Indian regional cuisines — underrepresented regional food coverage |
| **A1 gap fill** | Added Biryani By Kilo (BBK) entries — India's largest biryani delivery chain was missing |
| **D7 gap fill** | Extended Middle Eastern — Baba Ganoush, Fattoush, Tabbouleh, Turkish Doner added |

---

## 📝 How to Read This File (Instructions for AI Agents)

Each item in this file includes the following hint fields to guide data entry:

| Hint field | Meaning |
|---|---|
| `id` | Suggested kebab-case ID — must be globally unique across all 20 categories |
| `category` | One of the 20 v2.2 category IDs |
| `subcategory` | New subcategories introduced in this extension (see §1 below) |
| `itemType` | `dish` / `drink` / `snack` / `supplement` / `base-food` |
| `state` | `cooked` / `fried` / `baked` / `raw` / `steamed` / `grilled` |
| `region` | `pan-indian` / `north` / `south` / `east` / `west` |
| `dietTypes` | Array: `veg` / `nonveg` / `egg` / `vegan` / `jain` |
| `tags` | Comma-separated tag vocabulary from v2.2 schema |
| `source` | `FSSAI-label` / `USDA` / `healthifyme` / `curated-estimate` |
| `confidence` | `high` / `medium` / `low` |
| `serving` | Suggested default serving ID + grams |
| `alcoholG` | Only for alcoholic drinks — ethanol grams per serving |

### Subcategories Added in v3.0 (original set)

```
packaged-food  →  qsr-pizza, qsr-burger, qsr-chicken, qsr-indian, indian-packaged-namkeen, cafe-food, bakery-chain, dessert-chain
rice-dish      →  biryani-chain, indo-chinese-rice, global-bowl
non-veg        →  coastal, east-indian, qsr-chicken
drink          →  hot-beverage, cafe-hot, cafe-cold, chai-shop, cold-shake, packaged-soft-drink, alcoholic, juice-fresh
snack-street   →  momo-dumpling, waffle-dessert, chaat-combo
sweet-mithai   →  ice-cream-scoop, ice-cream-chain
```

### Additional Subcategories Added in v3.1

```
packaged-food  →  qsr-fried-chicken (Popeyes, Wendy's), cloud-kitchen (BBK, Box8, EatFit)
rice-dish      →  italian-pasta, vietnamese-noodle, health-bowl
drink          →  bubble-tea, matcha-drink, traditional-indian-drink, cooling-drink
snack-street   →  italian-starter, vietnamese-snack, greek-street, health-salad, brunch-item
sweet-mithai   →  international-dessert, crepe-waffle, bakery-dessert
supplement     →  plant-based-meat
```

### Data Source Priority (v3.0 + v3.1)

1. **FSSAI-label** — All branded/chain items where label data is accessible on brand website or Zomato/Swiggy menu
2. **USDA** — Generic global dishes (pasta, tacos, sushi, ramen, pho, pad thai)
3. **healthifyme** — Cross-reference for cooked chain dishes not published officially
4. **curated-estimate** — Last resort; flag clearly with `confidence: "low"`

---

## 🗂️ Priority Batches Overview

| Batch | Priority | Theme | Item Count | Rationale |
|-------|:--------:|-------|:----------:|-----------|
| **Batch A** | 🔴 P0 Critical | Biryani chains + Top QSR (Domino's, McD, KFC, BK) | ~78 items | Swiggy #1–3 most ordered; biryani 93M orders, burgers 44M, pizza 40M in 2025 |
| **Batch B** | 🟠 P1 High | Chai chains, Extended Indo-Chinese, More QSR sides | ~65 items | Evening chai + snacks = high daily frequency; Indo-Chinese is #4 most ordered cuisine |
| **Batch C** | 🟡 P2 Medium | Café chains (Starbucks, CCD, Barista), Bakeries, Ice Cream | ~55 items | Urban Tier-1 users; calorie-dense drinks often untracked |
| **Batch D** | 🟢 P3 Standard | Global cuisines (Mexican, Korean, Thai, Middle Eastern) | ~57 items | 16M+ Mexican orders on Swiggy 2025; Korean/Tibetan fast-growing |
| **Batch E** | 🔵 P4 Coverage | Alcoholic beverages, Packaged soft drinks, Goan/Bengali/NE regional, Dessert chains | ~35 items | Completeness |
| **Batch F** | 🟠 P1 High *(NEW)* | Italian restaurant dishes — pasta, risotto, antipasti | ~22 items | Pasta is #2 most-ordered global cuisine in India; completely absent in v3.0 |
| **Batch G** | 🟡 P2 Medium *(NEW)* | Vietnamese & SE Asian cuisines | ~18 items | Pho & Banh Mi growing rapidly; entirely missing in v3.0 |
| **Batch H** | 🟡 P2 Medium *(NEW)* | Extended Greek, Mediterranean & Turkish | ~16 items | Only 4 Middle Eastern items existed; no Greek, no Turkish, no Levantine sides |
| **Batch I** | 🔴 P0 Critical *(NEW)* | Bubble Tea / Boba + Matcha + Dalgona + trending café drinks | ~20 items | Fastest-growing food trend in India 2024–26; zero entries existed in v3.0 |
| **Batch J** | 🔴 P0 Critical *(NEW)* | Health-focused chains, salad bowls, Acai bowls, EatFit | ~22 items | Critical gap for a fitness app; urban gym-goers' primary meal delivery choice |
| **Batch K** | 🔴 P0 Critical *(NEW)* | Additional cloud kitchens & QSR — BBK, Popeyes, Wendy's, Box8 | ~28 items | Biryani By Kilo is India's largest biryani delivery brand; was entirely absent |
| **Batch L** | 🟢 P3 Standard *(NEW)* | International desserts & American brunch | ~16 items | Churros, Crepes, Tiramisu, Pancakes — ubiquitous in Indian cafes and brunch spots |
| **Batch M** | 🟡 P2 Medium *(NEW)* | Plant-based meat alternatives | ~12 items | Good Dot, Imagine Meats, Evo Foods — fast-growing for vegetarian fitness users |
| **Batch N** | 🟠 P1 High *(NEW)* | Traditional Indian cooling drinks & festival beverages | ~14 items | Thandai, Aam Panna, Jaljeera, Shikanji — daily drinks for millions; zero coverage existed |
| **Batch O** | 🟢 P3 Standard *(NEW)* | Rajasthani, Marwari & NE Indian regional cuisines | ~12 items | Regional coverage gap — no Laal Maas, Dal Baati Churma, or NE Indian dishes |

**Total new items (v3.1): ~470**
**Grand total database target: ~820 foods**

---

## 🔍 Gap Analysis — Issues Found by Codebase Cross-Reference

> **Reviewed 2026-04-13.** Each gap below was identified by reading the actual `indianFoods.js` (663 existing entries), `servingTypes.js` (24 types), and `foodCategories.js` (20 categories + 6 supplement subcategories) and comparing them to this document.

### GAP 1 — Duplicates with Existing Database (Critical for Agents)

The following items proposed in this TODO **already exist** in `indianFoods.js`. Agents must **skip or merge** these — do NOT create duplicate entries:

| Proposed ID in TODO | Existing ID in `indianFoods.js` | Action |
|---|---|---|
| `sugarcane-juice-glass` (#458, Batch N) | `sugarcane-juice` | ❌ SKIP — already in DB as `drink` category |
| `chole-bhature-restaurant` (#123, Batch B6) | `chole-bhature` | ⚠️ MERGE — existing is homestyle; proposed is restaurant-style. Add `restaurant-portion` serving to existing entry instead of creating a new one |
| `chaayos-vada-pav` (#86, Batch B1) | `vada-pav` | ⚠️ SKIP or add as `chainName: 'Chaayos'` variant — base `vada-pav` already covered |
| `haldirams-pav-bhaji` (#274, Batch E4) | `pav-bhaji` | ⚠️ MERGE — existing is generic; add chain variant serving or create distinct chain entry |
| `coffee-filter-south` (#100, Batch B3) | `coffee-black` (partially) | ⚠️ KEEP — filter coffee is distinct (milk-based), not a duplicate of black coffee |
| `soy-milk` (Batch M, #442 Sofit) | `soy-milk` | ❌ SKIP — generic soy milk already exists; brand-specific variants may be added |

**Fix:** Add a pre-entry validation step: `grep -cE "id: '${proposedId}'" indianFoods.js` before inserting any new entry.

### GAP 2 — Missing Major Food Category: Instant Noodles / Packaged Ready-to-Eat (CRITICAL)

Maggi 2-Minute Noodles is consumed by **hundreds of millions** of Indians and is the #1 packaged snack food in the country. Not a single instant noodle entry exists anywhere in v3.0 or v3.1. This is arguably a bigger gap than bubble tea for a fitness app — instant noodles are high-calorie, high-sodium, and frequently eaten by gym-goers as a convenience meal.

**Required new Batch P** added below.

### GAP 3 — Missing: Dry Fruits & Nuts (CRITICAL for Fitness Users)

Almonds, cashews, walnuts, peanuts, raisins, dates, and mixed dry fruits are **daily staples** for fitness-conscious Indians. Not a single nut/dry fruit entry exists in the database despite the `fruit` category having 19 entries and `condiment` having 14. Every gym-goer tracks almonds and peanuts daily.

**Required new Batch Q** added below.

### GAP 4 — Missing: Protein Bars & Packaged Health Snacks

Protein bars (RiteBite Max, Yoga Bar, HYP, Muesli bars) are the most-tracked packaged foods by fitness app users. The `supplement` category has 46 entries (all whey/gainer powders) but zero packaged food bars. This is a critical gap for FitTrack Pro's core demographic.

**Required new Batch R** added below.

### GAP 5 — Wendy's India: Franchise Partner is Rebel Foods, NOT Sapphire Foods

The K2 section states Wendy's India was "relaunched 2023 under Sapphire Foods." This is **factually incorrect**:
- **Rebel Foods** (EatSure parent) is the master franchise holder for Wendy's in India
- **Sapphire Foods** operates KFC, Pizza Hut, and Taco Bell (Yum! Brands)
- Wendy's India has 160+ outlets as of Oct 2024, not "30+"
- Menu includes India-exclusive items (Spicy Aloo Crunch, Nachoburg, Tandoori Paneer)

**Fix applied below** in Batch K2.

### GAP 6 — Item Count Arithmetic Error

The batch overview table claims Batch A has ~78 items, but the actual A1–A6 tables contain exactly **78 items** (16+16+20+13+9+4). However:
- Batch B claims ~65 items but tables B1–B6 total only **57 items** (10+7+7+13+6+14)
- Batch C claims ~55 items but tables C1–C5 total only **44 items** (14+7+5+9+12 = 47... actually the tables need recount)
- Batch K claims ~28 items but tables K1–K5 total **32 items** (8+8+7+3+6)

**Impact:** The "grand total ~820" is an estimate. Agents should count enumerated rows, not batch headers.

### GAP 7 — `condiment` Category Items Need Attention

Kimchi (#214), Tzatziki (#240) are tagged as `condiment` category but `condiment` in `foodCategories.js` is labeled "Condiments & Sides." This is correct but the TODO doesn't note that `condiment` entries need standard schemas like `per100g` macros that differ from dish entries (condiments are typically small portions). Ensure `defaultServingGrams` is small (30–80g).

### GAP 8 — Serving Types Missing from `servingTypes.js`

The TODO proposes 4 new serving types (`handi`, `roll`, `boba-cup`, `skewer`) but the existing `servingTypes.js` already has some overlapping concepts:
- `roll` overlaps with `piece` (defaultGrams: 40) — but `roll` needs 200g default. ✅ Distinct, add it.
- `handi` (500g) is close to `takeaway-container` (480g) — but semantically distinct for BBK. ✅ Add.
- Also missing: `wrap` (for shawarma, burrito, kathi roll — ~220g), `cutting` (for chai — 100ml).

### GAP 9 — No `hindiName` or `searchTerms` Specified for ANY Extended Item

The v2.2 schema requires `hindiName` and `searchTerms[]` on every entry (see existing entries like `'रोटी'` for roti). This TODO provides neither for any of the 470+ items. Without search terms, users typing "McD" or "dominos" or "maggi" won't find entries.

**Fix:** Each batch's agent instructions should explicitly state: *"Generate `hindiName` (where applicable — not for international brands) and at least 3 `searchTerms` per item (brand abbreviation, common misspelling, colloquial name)."*

### GAP 10 — `per100g` Macros Missing for Most Items

Batch F (Italian) provides indicative `per100g` macros for pasta items, which is excellent. But **no other batch** provides per100g values — only serving sizes. The actual `indianFoods.js` schema requires a full `per100g` object with: `calories, protein, carbs, fat, fiber, sodium, vitaminB12, vitaminD, iron, calcium`. Without these, entries cannot be created.

**Fix:** Each batch's agent instructions should include: *"Look up per100g macro data from the specified source (FSSAI-label, USDA, healthifyme). All 10 macro fields are required."*

### GAP 11 — Missing Schema Fields in TODO Entries

Comparing the TODO's hint fields against the actual v2.2 schema shape in `indianFoods.js`, these required fields are never mentioned in any batch instruction:

| Required field | Present in TODO hints? | Impact |
|---|---|---|
| `nameAlt` | ❌ Never | Users search by alternate names |
| `hindiName` | ❌ Never | Hindi-speaking users (majority) |
| `searchTerms` | ❌ Never | Critical for search functionality |
| `defaultServingGrams` | ✅ Via serving column | OK |
| `per100g` (full 10-field object) | ❌ Only in Batch F | Entries unusable without this |
| `servings[]` (array of objects) | ❌ Only text hints | Need structured `{ id, label, grams }` |
| `isFastingFood` | ❌ Never | Some items (Thandai) are fasting foods |
| `fastingTypes[]` | ❌ Never | Navratri/Ekadashi context |
| `isGlutenFree` | ❌ Never | Important for fitness users |
| `gi` (Glycemic Index) | ❌ Never | Key for diabetic/weight-loss users |
| `estimatedOilG` | ❌ Never | Required for cooked dishes |

**Fix:** Add a master instruction at the top: *"When generating entries, fill ALL fields from the v2.2 schema. Use `null` or `0` for unknown micronutrients. Set `gi: null` if GI data is unavailable. Set `isGlutenFree: false` for wheat-containing items, `true` for rice/millet-based items."*

### GAP 12 — `foodCategories.js` Has No Subcategory Registry

The TODO introduces 20+ new subcategories (`qsr-pizza`, `bubble-tea`, `cloud-kitchen`, etc.) but `foodCategories.js` has **no subcategory list** — only the supplement subcategories are defined as `supplementSubcategories[]`. The subcategory field on food items is a free-form string. This means:
- New subcategories don't need to be "registered" in `foodCategories.js` (they'll just work)
- BUT the UI's category filter won't show subcategory groups unless code is added

**Impact:** Low for data entry, but the implementation checklist items saying "Add subcategory X to category definition" are misleading. There is no category-to-subcategory mapping to update.

### GAP 13 — Sattu Drink Missing from Batch N (Traditional Indian Drinks)

Sattu (roasted gram flour) drink is one of North/East India's most popular protein-rich traditional drinks (especially Bihar, UP, Jharkhand). It's a natural high-protein drink (~20g protein per glass) that gym-goers actively consume. Missing from Batch N.

### GAP 14 — Egg Bhurji / Anda Bhurji Missing

Egg Bhurji (Indian scrambled eggs) is one of the most commonly tracked non-veg breakfast/dinner items in India. The existing DB has `egg-boiled` and some egg dishes but not bhurji specifically. Should be in Batch B6.

### GAP 15 — Paneer Bhurji / Paneer Tikka Missing

Paneer Bhurji (scrambled paneer) is a daily meal for millions of vegetarian Indians. The DB has `palak-paneer` but not standalone paneer bhurji or paneer tikka (non-gravy). These are the most common paneer preparations.

### GAP 16 — Meal-Level Combinations Not Addressed

Indian meals are almost always eaten as combinations (Dal + Rice + Roti + Sabzi). The TODO models every item individually but doesn't address the "meal combo" logging UX problem. This affects calorie accuracy since restaurant thalis (#271, #275) are single entries but homestyle meals require 3–5 separate entries.

**Recommendation:** Add documentation noting that the DietPage UI should support "Quick Meal" presets: `{name: 'Simple North Indian Meal', items: ['dal-toor-cooked', 'rice-white-cooked', 'roti-wheat', 'raita-mixed']}` — but this is a DietPage feature, not a DB schema issue.

### GAP 17 — Chaas / Buttermilk Missing

Chaas (buttermilk/mattha) is the single most consumed cooling drink in Western and Northern India during summers. Not in the existing DB and not in Batch N. Should be P0.

### GAP 18 — Raita Missing

Raita (yogurt + cucumber/onion/boondi) is a near-universal accompaniment to every North Indian meal. Not in the existing DB and not proposed. Should be in B6.

---

## 🔴 NEW BATCH P — P0 Critical · Instant Noodles & Packaged Ready-to-Eat (~14 items) *(GAP 2 fix)*

*Rationale: Maggi alone has >60% market share in India's instant noodle category. Every hostel student, working professional, and even gym-goer consumes instant noodles. High sodium, high refined carbs — critical to track for a fitness app. The `packaged-food` category has 21 existing entries but zero noodle entries.*

**Category:** `packaged-food` | **Subcategory:** `instant-noodle` | **Source:** `FSSAI-label`

| # | `id` | `name` | `dietTypes` | Key macros | Default serving |
|---|------|--------|-------------|-----------|------------------|
| P1 | `maggi-masala-single` | Maggi 2-Minute Masala Noodles (1 pack) | veg | ~310 kcal, 7g P, 42g C, 12g F, 860mg Na | 1 packet (70g) |
| P2 | `maggi-atta-masala` | Maggi Atta (Whole Wheat) Noodles (1 pack) | veg | ~290 kcal, 8g P, 40g C, 11g F | 1 packet (75g) |
| P3 | `yippee-noodles-masala` | Sunfeast YiPPee! Noodles (1 pack) | veg | ~350 kcal, 8g P, 48g C, 14g F | 1 packet (70g) |
| P4 | `nissin-cup-noodles-masala` | Nissin Cup Noodles (Masala) | veg | ~290 kcal, 6g P, 38g C, 12g F | 1 cup (70g) |
| P5 | `top-ramen-curry-noodles` | Top Ramen Curry Noodles (1 pack) | veg | ~310 kcal, 7g P, 42g C, 12g F | 1 packet (70g) |
| P6 | `knorr-soupy-noodles` | Knorr Soupy Noodles (1 pack) | veg | ~240 kcal, 5g P, 36g C, 9g F | 1 packet (66g) |
| P7 | `maggi-hot-heads-cup` | Maggi Hot Heads Cup Noodles | veg | ~300 kcal, 6g P, 40g C, 13g F | 1 cup (71g) |
| P8 | `mtr-ready-to-eat-rajma-rice` | MTR Ready to Eat Rajma Rice | veg | ~160 kcal/100g, 5g P, 24g C, 5g F | 1 pack (300g) |
| P9 | `mtr-ready-to-eat-dal-fry` | MTR Ready to Eat Dal Fry | veg | ~100 kcal/100g, 5g P, 12g C, 3g F | 1 pack (300g) |
| P10 | `mtr-ready-to-eat-palak-paneer` | MTR Ready to Eat Palak Paneer | veg | ~125 kcal/100g, 5g P, 6g C, 9g F | 1 pack (300g) |
| P11 | `haldiram-minute-khana-biryani` | Haldiram's Minute Khana Biryani | nonveg | ~170 kcal/100g | 1 pack (300g) |
| P12 | `canned-baked-beans-generic` | Canned Baked Beans (Generic) | vegan | ~95 kcal/100g, 5g P, 17g C, 0.5g F | 1 can (200g) |
| P13 | `instant-upma-mix` | Instant Upma Mix (MTR/Gits) | veg | ~380 kcal/100g dry | 1 pack (170g cooked) |
| P14 | `instant-poha-mix` | Instant Poha Mix (MTR) | veg | ~360 kcal/100g dry | 1 pack (180g cooked) |

---

## 🔴 NEW BATCH Q — P0 Critical · Dry Fruits, Nuts & Seeds (~16 items) *(GAP 3 fix)*

*Rationale: Every Indian gym-goer tracks almonds and peanuts daily. Peanut butter is the #1 searched food on HealthifyMe. Dry fruits are consumed at every festival, wedding, and as daily snacks. The existing DB has zero nut/dry fruit entries despite the `fruit` category having 19 entries. This is the #1 most critical gap for fitness users.*

**Category:** `fruit` (for whole nuts/dry fruits) / `condiment` (for nut butters) | **Source:** `FSSAI-label` / `USDA`

| # | `id` | `name` | `dietTypes` | Key macros (per 100g) | Default serving |
|---|------|--------|-------------|----------------------|------------------|
| Q1 | `almonds-raw` | Almonds (Raw/Soaked, Badam) | vegan,jain | 579 kcal, 21g P, 22g C, 50g F | 1 handful (10 pcs ~14g) |
| Q2 | `cashews-raw` | Cashews (Raw, Kaju) | vegan,jain | 553 kcal, 18g P, 30g C, 44g F | 1 handful (10 pcs ~15g) |
| Q3 | `walnuts-raw` | Walnuts (Raw, Akhrot) | vegan,jain | 654 kcal, 15g P, 14g C, 65g F | 1 handful (4 halves ~14g) |
| Q4 | `peanuts-roasted` | Peanuts (Roasted, Moongphali) | vegan,jain | 567 kcal, 26g P, 16g C, 49g F | 1 handful (~30g) |
| Q5 | `peanuts-boiled` | Peanuts (Boiled, Soak & Eat) | vegan,jain | 318 kcal, 14g P, 22g C, 22g F | 1 katori (~100g) |
| Q6 | `raisins-kishmish` | Raisins / Kishmish | vegan,jain | 299 kcal, 3g P, 79g C, 0.5g F | 1 handful (~20g) |
| Q7 | `dates-khajoor` | Dates (Khajoor, Medjool/Indian) | vegan,jain | 277 kcal, 2g P, 75g C, 0.2g F | 2 pieces (~40g) |
| Q8 | `anjeer-dried-fig` | Dried Figs (Anjeer) | vegan,jain | 249 kcal, 3g P, 64g C, 1g F | 2 pieces (~30g) |
| Q9 | `pistachios-salted` | Pistachios (Salted, Pista) | vegan | 560 kcal, 20g P, 28g C, 45g F | 1 handful (~20g) |
| Q10 | `mixed-dry-fruits-trail-mix` | Mixed Dry Fruits / Trail Mix | vegan | ~520 kcal, 15g P, 40g C, 35g F | 1 handful (~30g) |
| Q11 | `peanut-butter-creamy` | Peanut Butter (Creamy, Plain) | vegan | 588 kcal, 25g P, 20g C, 50g F | 1 tbsp (~15g) |
| Q12 | `peanut-butter-crunchy` | Peanut Butter (Crunchy) | vegan | 588 kcal, 25g P, 20g C, 50g F | 1 tbsp (~15g) |
| Q13 | `almond-butter` | Almond Butter | vegan | 614 kcal, 21g P, 19g C, 56g F | 1 tbsp (~15g) |
| Q14 | `flax-seeds` | Flax Seeds (Alsi) | vegan,jain | 534 kcal, 18g P, 29g C, 42g F; high omega-3 | 1 tbsp (~10g) |
| Q15 | `chia-seeds` | Chia Seeds | vegan,jain | 486 kcal, 17g P, 42g C, 31g F; high fiber | 1 tbsp (~12g) |
| Q16 | `pumpkin-seeds` | Pumpkin Seeds (Kaddu ke Beej) | vegan,jain | 559 kcal, 30g P, 11g C, 49g F | 1 tbsp (~10g) |

---

## 🔴 NEW BATCH R — P0 Critical · Protein Bars & Packaged Health Snacks (~10 items) *(GAP 4 fix)*

*Rationale: Protein bars are the #1 most-tracked packaged food among gym-going users. RiteBite Max Protein, Yoga Bar, and HYP are India's top brands. The `supplement` category has 46 entries (all powders) but zero bars. This is a major gap for a fitness app.*

**Category:** `supplement` | **Subcategory:** `protein-bar` | **Source:** `FSSAI-label`

| # | `id` | `name` | `dietTypes` | Key macros (per bar) | Default serving |
|---|------|--------|-------------|---------------------|------------------|
| R1 | `ritebite-max-protein-choco-fudge` | RiteBite Max Protein Bar (Choco Fudge) | veg | ~190 kcal, 20g P, 17g C, 6g F | 1 bar (67g) |
| R2 | `ritebite-max-protein-peanut-butter` | RiteBite Max Protein Bar (Peanut Butter) | veg | ~195 kcal, 20g P, 18g C, 6g F | 1 bar (67g) |
| R3 | `yogabar-protein-bar-almond-fudge` | Yoga Bar Protein Bar (Almond Fudge) | veg | ~200 kcal, 15g P, 22g C, 7g F | 1 bar (60g) |
| R4 | `yogabar-muesli-bar-dark-choc` | Yoga Bar Muesli Bar (Dark Chocolate) | veg | ~120 kcal, 4g P, 18g C, 4g F | 1 bar (38g) |
| R5 | `hyp-lean-protein-bar-choc` | HYP Lean Protein Bar (Chocolate) | veg | ~170 kcal, 10g P, 20g C, 5g F | 1 bar (40g) |
| R6 | `muscleblaze-protein-bar-chocofudge` | MuscleBlaze Protein Bar (Choco Fudge) | veg | ~195 kcal, 20g P, 17g C, 6g F | 1 bar (72g) |
| R7 | `questbar-cookies-cream` | Quest Bar (Cookies & Cream) (Imported) | veg | ~200 kcal, 21g P, 21g C, 8g F | 1 bar (60g) |
| R8 | `muesli-kelloggs-100g` | Kellogg's Oats & Muesli (Generic) | veg | ~370 kcal/100g, 10g P, 65g C, 8g F | 1 bowl (50g + milk) |
| R9 | `granola-yogabar-100g` | Yoga Bar Granola (Dark Chocolate, per 100g) | veg | ~440 kcal, 10g P, 60g C, 18g F | 1 bowl (50g) |
| R10 | `roasted-makhana-foxnut-plain` | Roasted Makhana / Fox Nuts (Plain) | veg,jain | ~350 kcal/100g, 10g P, 65g C, 1.5g F | 1 handful (~30g) |

---

## 🟠 NEW ADDITIONS TO EXISTING BATCHES (Gap Fixes 13–15, 17–18)

The following items should be appended to their respective batches:

### Add to Batch N (Traditional Indian Drinks):

| # | `id` | `name` | `dietTypes` | Region | Key note | Default serving |
|---|------|--------|-------------|--------|---------|------------------|
| N15 | `sattu-drink-sweet` | Sattu Drink (Sweet, Bihar-style) | vegan | east | ~180 kcal/glass; ~20g protein; natural plant protein drink | 1 glass (250ml) |
| N16 | `sattu-drink-namkeen` | Sattu Drink (Savoury/Namkeen) | vegan | east | ~160 kcal/glass; high protein, low sugar; gym-friendly | 1 glass (250ml) |
| N17 | `chaas-plain` | Chaas / Buttermilk (Plain, Mattha) | veg | pan-indian | ~40 kcal/glass; most consumed cooling drink in India | 1 glass (200ml) |
| N18 | `chaas-masala` | Chaas / Buttermilk (Masala, with jeera & mint) | veg | pan-indian | ~50 kcal/glass; digestive, probiotic | 1 glass (200ml) |
| N19 | `sol-kadhi` | Sol Kadhi (Kokum Coconut Milk Drink) | vegan | west | ~70 kcal/glass; Malvani/Konkan/Goan post-meal drink | 1 glass (200ml) |

### Add to Batch B6 (Extended North Indian):

| # | `id` | `name` | Category | `dietTypes` | Default serving |
|---|------|--------|----------|-------------|------------------|
| B6-15 | `egg-bhurji-masala` | Egg Bhurji (Indian Scrambled Eggs) | non-veg | egg | 1 plate (2 eggs ~120g) |
| B6-16 | `paneer-bhurji` | Paneer Bhurji (Scrambled Paneer) | sabzi-veg | veg | 1 katori (~150g) |
| B6-17 | `paneer-tikka-dry` | Paneer Tikka (Dry, 6 pcs) | snack-street | veg | 1 serving (6 pcs ~180g) |
| B6-18 | `raita-mixed-veg` | Mixed Raita (Yogurt + Cucumber + Onion) | condiment | veg | 1 katori (~100g) |
| B6-19 | `raita-boondi` | Boondi Raita | condiment | veg | 1 katori (~100g) |

---

## 🔴 BATCH A — P0 Critical (~78 items)

*Rationale: Swiggy 2025 data shows these are the 3 most-ordered food categories in India. Must ship alongside the core v2.2 database for urban users.*

---

### A1 · Biryani Chains & Restaurant Biryani Variants
**Category:** `rice-dish` | **Subcategory:** `biryani-chain` | **Region:** `pan-indian`

> **Note for agents:** All biryani entries should have `isRecipe: true`, `cookingOilNote`, `defaultServingGrams: 400` (restaurant plate), serving ID `plate`. Source `curated-estimate` unless chain publishes official data. Confidence `medium`.

| # | `id` | `name` | `dietTypes` | `tags` | Key serving |
|---|------|--------|-------------|--------|-------------|
| 1 | `biryani-chicken-restaurant` | Chicken Biryani (Restaurant style) | nonveg | lunch,dinner,restaurant-common,calorie-dense | 1 plate (400g) |
| 2 | `biryani-mutton-restaurant` | Mutton Biryani (Restaurant style) | nonveg | lunch,dinner,restaurant-common,calorie-dense | 1 plate (400g) |
| 3 | `biryani-egg-restaurant` | Egg Biryani (Restaurant) | egg | lunch,dinner,restaurant-common | 1 plate (350g) |
| 4 | `biryani-veg-restaurant` | Veg Biryani / Veg Pulao (Restaurant) | veg | lunch,dinner,restaurant-common | 1 plate (350g) |
| 5 | `biryani-hyderabadi-chicken` | Hyderabadi Chicken Biryani (Dum) | nonveg | lunch,dinner,restaurant-common,high-protein | 1 plate (400g) |
| 6 | `biryani-kolkata-chicken` | Kolkata Chicken Biryani (with egg & potato) | nonveg,egg | lunch,dinner,east,restaurant-common | 1 plate (420g) |
| 7 | `biryani-lucknowi-chicken` | Lucknowi (Awadhi) Chicken Biryani | nonveg | lunch,dinner,north,restaurant-common | 1 plate (400g) |
| 8 | `biryani-malabari` | Malabari / Kerala Chicken Biryani | nonveg | lunch,dinner,south,restaurant-common | 1 plate (380g) |
| 9 | `biryani-behrouz-chicken` | Behrouz Lazeez Bhuna Murgh Biryani | nonveg | lunch,dinner,restaurant-common,calorie-dense | 1 plate (400g) |
| 10 | `biryani-behrouz-mutton` | Behrouz Dum Gosht Mutton Biryani | nonveg | lunch,dinner,restaurant-common,calorie-dense | 1 plate (400g) |
| 11 | `biryani-behrouz-veg` | Behrouz Veg Biryani | veg | lunch,dinner,restaurant-common | 1 plate (350g) |
| 12 | `biryani-paradise-chicken` | Paradise Restaurant Chicken Biryani | nonveg | lunch,dinner,south,restaurant-common | 1 plate (400g) |
| 13 | `biryani-paradise-mutton` | Paradise Restaurant Mutton Biryani | nonveg | lunch,dinner,south,restaurant-common | 1 plate (400g) |
| 14 | `bbk-hyderabadi-chicken-handi` | Biryani By Kilo (BBK) Hyderabadi Chicken Biryani (1 handi) | nonveg | lunch,dinner,restaurant-common,calorie-dense | 1 handi (~500g) |
| 15 | `bbk-mutton-handi` | Biryani By Kilo (BBK) Mutton Biryani (1 handi) | nonveg | lunch,dinner,restaurant-common,calorie-dense | 1 handi (~500g) |
| 16 | `bbk-veg-handi` | Biryani By Kilo (BBK) Veg Biryani (1 handi) | veg | lunch,dinner,restaurant-common | 1 handi (~450g) |

> **⚠️ BBK gap note:** Biryani By Kilo is consistently among the top 5 delivery brands in India by order volume but was entirely absent in v3.0. The `handi` serving (≈500g) is critical — BBK is known for individual clay pot servings, which are significantly larger than a restaurant plate. Source: `curated-estimate`, confidence `medium`. Add `sizeVariant: 'Handi-1'` and serving `{ id: 'handi', label: '1 handi', grams: 500 }` — this serving type needs to be added to `servingTypes.js`.

---

### A2 · Domino's Pizza India
**Category:** `packaged-food` | **Subcategory:** `qsr-pizza` | **Region:** `pan-indian` | **Source:** `FSSAI-label` / `curated-estimate`

> **Note for agents:** Model per **Regular (7") slice** as default serving (`slice`, ~100g). Also add per-pizza `plate` serving (whole Regular ~4 slices / Medium ~6 slices). Confidence `medium`. Tag: `restaurant-common`, `isProcessed: true`. All entries `state: baked`.

| # | `id` | `name` | `dietTypes` | Crust | Notes |
|---|------|--------|-------------|-------|-------|
| 17 | `dominos-margherita-regular` | Domino's Margherita Pizza (Regular) | veg | Hand-tossed | 1 slice default; add `plate` (whole pizza) serving |
| 18 | `dominos-double-cheese-margherita` | Domino's Double Cheese Margherita | veg | Hand-tossed | Higher fat than plain margherita |
| 19 | `dominos-farmhouse` | Domino's Farmhouse Pizza | veg | Hand-tossed | Veg loaded |
| 20 | `dominos-peppy-paneer` | Domino's Peppy Paneer | veg | Hand-tossed | Popular India-specific topping |
| 21 | `dominos-veg-extravaganza` | Domino's Veg Extravaganza | veg | Hand-tossed | Max toppings veg |
| 22 | `dominos-mexican-green-wave` | Domino's Mexican Green Wave | veg | Hand-tossed | Jalapeño + capsicum |
| 23 | `dominos-indi-tandoori-paneer` | Domino's Indi Tandoori Paneer | veg | Hand-tossed | India exclusive |
| 24 | `dominos-achari-do-pyaza` | Domino's Achari Do Pyaza | veg | Hand-tossed | Pickle-spiced topping |
| 25 | `dominos-chicken-dominator` | Domino's Chicken Dominator | nonveg | Hand-tossed | Most loaded non-veg |
| 26 | `dominos-chicken-fiesta` | Domino's Chicken Fiesta | nonveg | Hand-tossed | — |
| 27 | `dominos-pepper-bbq-chicken` | Domino's Pepper Barbecue Chicken | nonveg | Hand-tossed | — |
| 28 | `dominos-non-veg-supreme` | Domino's Non-Veg Supreme | nonveg | Hand-tossed | — |
| 29 | `dominos-keema-do-pyaza` | Domino's Keema Do Pyaza | nonveg | Hand-tossed | India exclusive |
| 30 | `dominos-garlic-breadsticks` | Domino's Garlic Breadsticks | veg | — | `state: baked`, serving: piece (2 sticks ~80g) |
| 31 | `dominos-stuffed-garlic-bread` | Domino's Stuffed/Cheesy Garlic Bread | veg | — | Higher calories; cheese-filled |
| 32 | `dominos-choco-lava-cake` | Domino's Choco Lava Cake | veg | — | category: `sweet-mithai`, subcategory: `dessert-chain`; serving: piece 1 (~85g) |

---

### A3 · McDonald's India
**Category:** `packaged-food` | **Subcategory:** `qsr-burger` | **Region:** `pan-indian` | **Source:** `FSSAI-label`

> **Note for agents:** McDonald's India publishes official nutrition data on mcdelivery.co.in — use as `source: "FSSAI-label"`, `confidence: "high"`. Each burger = 1 `piece` serving (actual grams from label). All `state: fried` or `baked` as applicable. `isProcessed: true`.

| # | `id` | `name` | `dietTypes` | `tags` | Default serving |
|---|------|--------|-------------|--------|-----------------|
| 33 | `mcd-mcaloo-tikki` | McDonald's McAloo Tikki Burger | veg | snack,restaurant-common,budget-friendly | 1 piece (~140g) |
| 34 | `mcd-mcveggie` | McDonald's McVeggie Burger | veg | snack,restaurant-common | 1 piece (~155g) |
| 35 | `mcd-maharaja-mac-chicken` | McDonald's Maharaja Mac (Chicken) | nonveg | lunch,dinner,restaurant-common,high-protein | 1 piece (~220g) |
| 36 | `mcd-maharaja-mac-veg` | McDonald's Maharaja Mac (Veg) | veg | lunch,dinner,restaurant-common | 1 piece (~215g) |
| 37 | `mcd-mcspicy-paneer` | McDonald's McSpicy Paneer Burger | veg | snack,restaurant-common,spicy | 1 piece (~180g) |
| 38 | `mcd-mcspicy-chicken` | McDonald's McSpicy Chicken Burger | nonveg | snack,restaurant-common,spicy,high-protein | 1 piece (~180g) |
| 39 | `mcd-mcchicken` | McDonald's McChicken Burger | nonveg | snack,restaurant-common | 1 piece (~165g) |
| 40 | `mcd-mcegg` | McDonald's McEgg Burger | egg | snack,restaurant-common,budget-friendly | 1 piece (~145g) |
| 41 | `mcd-veg-pizza-mcpuff` | McDonald's Veg Pizza McPuff | veg | snack,restaurant-common | 1 piece (~75g) |
| 42 | `mcd-filet-o-fish` | McDonald's Filet-o-Fish | nonveg | snack,restaurant-common | 1 piece (~145g) |
| 43 | `mcd-french-fries-medium` | McDonald's French Fries (Medium) | veg | snack,restaurant-common,high-fat | 1 portion (~117g) |
| 44 | `mcd-french-fries-large` | McDonald's French Fries (Large) | veg | snack,restaurant-common,high-fat | 1 portion (~154g) |
| 45 | `mcd-chicken-nuggets-6pc` | McDonald's Chicken McNuggets (6 pcs) | nonveg | snack,restaurant-common | 1 serving (6 pcs ~105g) |
| 46 | `mcd-mcmuffin-veg` | McDonald's Veg McMuffin (Breakfast) | veg | breakfast,restaurant-common | 1 piece (~130g) |
| 47 | `mcd-hash-browns` | McDonald's Hash Browns | veg | breakfast,restaurant-common | 1 piece (~55g) |
| 48 | `mcd-paneer-wrap` | McDonald's Big Spicy Paneer Wrap | veg | lunch,restaurant-common | 1 wrap (~180g) |
| 49 | `mcd-chicken-wrap` | McDonald's Chicken McGrill Wrap | nonveg | lunch,restaurant-common | 1 wrap (~175g) |
| 50 | `mcd-soft-serve-cone` | McDonald's Soft Serve Cone (Vanilla) | veg | snack | 1 piece (~115g) |
| 51 | `mcd-mcflurry-oreo` | McDonald's McFlurry Oreo | veg | snack,high-sugar | 1 cup (~200g) |
| 52 | `mcd-cold-coffee-mccafe` | McCafé Cold Coffee (Medium) | veg | drink,cafe-cold | category: `drink`, subcategory: `cafe-cold`; 1 cup (300ml) |

---

### A4 · KFC India
**Category:** `packaged-food` | **Subcategory:** `qsr-chicken` | **Region:** `pan-indian` | **Source:** `FSSAI-label`

> **Note for agents:** KFC India publishes nutrition data at online.kfc.co.in — use `source: "FSSAI-label"`, `confidence: "high"`. Chicken pieces should be modeled per individual piece, not per bucket. `state: fried` for most. `isProcessed: true`.

| # | `id` | `name` | `dietTypes` | `tags` | Default serving |
|---|------|--------|-------------|--------|-----------------|
| 53 | `kfc-hot-crispy-1pc` | KFC Hot & Crispy Chicken (1 pc) | nonveg | snack,restaurant-common,high-protein,high-fat | 1 piece (~120g) |
| 54 | `kfc-original-recipe-1pc` | KFC Original Recipe Chicken (1 pc) | nonveg | snack,restaurant-common,high-protein | 1 piece (~120g) |
| 55 | `kfc-hot-wings-2pc` | KFC Hot Wings (2 pcs) | nonveg | snack,restaurant-common,spicy | 1 serving (2 pcs ~80g) |
| 56 | `kfc-popcorn-chicken-regular` | KFC Chicken Popcorn (Regular) | nonveg | snack,restaurant-common | 1 portion (~100g) |
| 57 | `kfc-zinger-burger-chicken` | KFC Zinger Burger (Classic Chicken) | nonveg | lunch,restaurant-common,high-protein | 1 piece (~185g) |
| 58 | `kfc-spicy-zinger` | KFC Spicy Zinger Burger | nonveg | lunch,restaurant-common,spicy | 1 piece (~185g) |
| 59 | `kfc-veg-zinger` | KFC Veg Zinger Burger | veg | lunch,restaurant-common | 1 piece (~175g) |
| 60 | `kfc-gold-veg-zinger` | KFC Gold Edition Veg Zinger | veg | lunch,restaurant-common | 1 piece (~175g) |
| 61 | `kfc-twister-chicken` | KFC Twister Wrap (Chicken) | nonveg | lunch,restaurant-common | 1 wrap (~200g) |
| 62 | `kfc-rice-bowlz-chicken` | KFC Rice Bowlz (Chicken) | nonveg | lunch,dinner,restaurant-common | 1 bowl (~280g) |
| 63 | `kfc-rice-bowlz-veg` | KFC Rice Bowlz (Veg) | veg | lunch,dinner,restaurant-common | 1 bowl (~280g) |
| 64 | `kfc-fries-regular` | KFC Fries (Regular) | veg | snack,restaurant-common,high-fat | 1 portion (~100g) |
| 65 | `kfc-coleslaw` | KFC Coleslaw | veg | snack | 1 portion (~100g) |

---

### A5 · Burger King India
**Category:** `packaged-food` | **Subcategory:** `qsr-burger` | **Region:** `pan-indian` | **Source:** `FSSAI-label`

| # | `id` | `name` | `dietTypes` | Default serving |
|---|------|--------|-------------|-----------------|
| 66 | `bk-veg-whopper` | Burger King Veg Whopper | veg | 1 piece (~250g) |
| 67 | `bk-chicken-whopper` | Burger King Chicken Whopper | nonveg | 1 piece (~270g) |
| 68 | `bk-crispy-veg-burger` | Burger King Crispy Veg Burger | veg | 1 piece (~180g) |
| 69 | `bk-crispy-chicken-burger` | Burger King Crispy Chicken Burger | nonveg | 1 piece (~180g) |
| 70 | `bk-paneer-king-burger` | Burger King Paneer King Burger | veg | 1 piece (~200g) |
| 71 | `bk-fries-medium` | Burger King Fries (Medium) | veg | 1 portion (~117g) |
| 72 | `bk-onion-rings` | Burger King Onion Rings | veg | 1 portion (~90g) |
| 73 | `jumboking-classic-vada-pav` | Jumbo King Classic Vada Pav | veg | 1 piece (~120g) |
| 74 | `jumboking-cheese-vada-pav` | Jumbo King Cheese Vada Pav | veg | 1 piece (~135g) |

---

### A6 · Wow! Momo & Wow! China
**Category:** `snack-street` | **Subcategory:** `momo-dumpling` | **Region:** `pan-indian` | **Source:** `curated-estimate`

| # | `id` | `name` | `dietTypes` | `state` | Default serving |
|---|------|--------|-------------|---------|-----------------|
| 75 | `wow-momo-steamed-veg` | Wow! Momo Steamed Momos (Veg, 6 pcs) | veg | steamed | 1 plate (6 pcs ~180g) |
| 76 | `wow-momo-steamed-chicken` | Wow! Momo Steamed Momos (Chicken, 6 pcs) | nonveg | steamed | 1 plate (6 pcs ~180g) |
| 77 | `wow-momo-fried-veg` | Wow! Momo Fried Momos (Veg, 6 pcs) | veg | fried | 1 plate (~200g) |
| 78 | `wow-momo-fried-chicken` | Wow! Momo Fried Momos (Chicken, 6 pcs) | nonveg | fried | 1 plate (~200g) |

---

## 🟠 BATCH B — P1 High (~65 items)

*Rationale: Chai + snack chains are consumed daily by millions of Indians; Indo-Chinese is the most popular "non-Indian" cuisine ordered on delivery apps.*

---

### B1 · Chaayos Menu
**Category:** `drink` (for beverages) / `snack-street` (for snacks) | **Subcategory:** `chai-shop` | **Region:** `pan-indian`

| # | `id` | `name` | Category | `dietTypes` | Default serving |
|---|------|--------|----------|-------------|-----------------|
| 79 | `chaayos-kulhad-masala-chai` | Kulhad Masala Chai | drink | veg | 1 kulhad (150ml) |
| 80 | `chaayos-kadak-chai` | Kadak Chai (Strong Tea) | drink | veg | 1 cup (150ml) |
| 81 | `chaayos-elaichi-chai` | Elaichi Chai (Cardamom Tea) | drink | veg | 1 cup (150ml) |
| 82 | `chaayos-ginger-chai` | Adrak Chai (Ginger Tea) | drink | veg | 1 cup (150ml) |
| 83 | `chaayos-iced-masala-chai` | Iced Masala Chai | drink | veg | 1 glass (300ml) |
| 84 | `chaayos-bun-maska` | Bun Maska (Chaayos) | snack-street | veg | 1 piece (~100g) |
| 85 | `chaayos-bun-bhujia` | Bun Bhujia (bun with sev filling) | snack-street | veg | 1 piece (~110g) |
| 86 | `chaayos-vada-pav` | Vada Pav (Chaayos) | snack-street | veg | 1 piece (~130g) |
| 87 | `chaayos-bun-samosa` | Bun Samosa | snack-street | veg | 1 piece (~140g) |
| 88 | `chaayos-samosa-chaat` | Samosa Chaat | snack-street | veg | 1 plate (~200g) |

---

### B2 · Chai Point Menu
**Category:** `drink` / `snack-street` | **Subcategory:** `chai-shop` | **Region:** `pan-indian`

| # | `id` | `name` | Category | Default serving |
|---|------|--------|----------|-----------------|
| 89 | `chaipoint-masala-chai` | Chai Point Masala Chai | drink | 1 cup (150ml) |
| 90 | `chaipoint-cutting-chai` | Chai Point Cutting Chai | drink | 1 cutting (100ml) |
| 91 | `chaipoint-adrak-chai` | Chai Point Adrak Chai | drink | 1 cup (150ml) |
| 92 | `chaipoint-green-tea` | Chai Point Green Tea (bag) | drink | 1 cup (200ml) |
| 93 | `chaipoint-iced-lemon-tea` | Chai Point Iced Lemon Tea | drink | 1 glass (300ml) |
| 94 | `chaipoint-veg-puff` | Chai Point Veg Puff (pastry) | snack-street | 1 piece (~90g) |
| 95 | `chaipoint-paneer-puff` | Chai Point Paneer Puff (pastry) | snack-street | 1 piece (~95g) |

---

### B3 · Generic Chai Variants (Roadside / Non-chain)
**Category:** `drink` | **Subcategory:** `hot-beverage` | **Region:** `pan-indian`

| # | `id` | `name` | `dietTypes` | Default serving |
|---|------|--------|-------------|-----------------|
| 96 | `chai-cutting-roadside` | Cutting Chai (Roadside) | veg | 1 cutting (100ml) |
| 97 | `chai-tandoori` | Tandoori Chai (Kulhad Roasted) | veg | 1 kulhad (150ml) |
| 98 | `chai-suleimani` | Suleimani Chai (Black Tea, Lemon) | veg | 1 cup (150ml) |
| 99 | `tea-lemon-honey-hot` | Lemon Honey Tea (Hot) | veg | 1 cup (200ml) |
| 100 | `coffee-filter-south` | Filter Coffee (South Indian Style) | veg | 1 cup (150ml) |
| 101 | `coffee-instant-milk-sugar` | Instant Coffee with Milk & Sugar | veg | 1 cup (200ml) |
| 102 | `hot-chocolate-cafe` | Hot Chocolate (Café-style) | veg | 1 cup (250ml) |

---

### B4 · Extended Indo-Chinese Dishes
**Category:** `rice-dish` / `snack-street` | **Subcategory:** `indo-chinese-rice` / `indo-chinese-starter` | **Region:** `pan-indian`

| # | `id` | `name` | Category | `dietTypes` | Default serving |
|---|------|--------|----------|-------------|-----------------|
| 103 | `noodles-veg-hakka` | Veg Hakka Noodles | rice-dish | veg | 1 plate (~300g) |
| 104 | `noodles-chicken-hakka` | Chicken Hakka Noodles | rice-dish | nonveg | 1 plate (~320g) |
| 105 | `noodles-veg-schezwan` | Veg Schezwan Noodles | rice-dish | veg | 1 plate (~300g) |
| 106 | `noodles-chicken-schezwan` | Chicken Schezwan Noodles | rice-dish | nonveg | 1 plate (~320g) |
| 107 | `rice-schezwan-veg` | Veg Schezwan Fried Rice | rice-dish | veg | 1 plate (~300g) |
| 108 | `rice-schezwan-chicken` | Chicken Schezwan Fried Rice | rice-dish | nonveg | 1 plate (~320g) |
| 109 | `manchurian-veg-dry` | Veg Manchurian (Dry) | snack-street | veg | 1 plate (~200g) |
| 110 | `manchurian-veg-gravy` | Veg Manchurian (Gravy) | snack-street | veg | 1 bowl (~250g) |
| 111 | `chilli-paneer-dry` | Chilli Paneer (Dry) | snack-street | veg | 1 plate (~200g) |
| 112 | `chilli-chicken-boneless` | Chilli Chicken (Boneless) | snack-street | nonveg | 1 plate (~200g) |
| 113 | `chicken-lollipop-fried` | Chicken Lollipop (4 pcs, Fried) | snack-street | nonveg | 1 serving (4 pcs ~200g) |
| 114 | `soup-hot-sour-veg` | Hot & Sour Soup (Veg) | snack-street | veg | 1 bowl (~300ml) |
| 115 | `soup-sweet-corn-veg` | Sweet Corn Soup (Veg) | snack-street | veg | 1 bowl (~300ml) |

---

### B5 · Subway India
**Category:** `packaged-food` | **Subcategory:** `qsr-indian` | **Region:** `pan-indian` | **Source:** `FSSAI-label`

| # | `id` | `name` | `dietTypes` | Tags |
|---|------|--------|-------------|------|
| 116 | `subway-veggie-delite-6in` | Subway Veggie Delite (6-inch) | veg | lunch,low-calorie,weight-loss |
| 117 | `subway-paneer-tikka-6in` | Subway Paneer Tikka Sub (6-inch) | veg | lunch,restaurant-common,high-protein |
| 118 | `subway-aloo-patty-6in` | Subway Aloo Patty Sub (6-inch) | veg | lunch,restaurant-common,budget-friendly |
| 119 | `subway-chicken-tikka-6in` | Subway Chicken Tikka Sub (6-inch) | nonveg | lunch,restaurant-common,high-protein |
| 120 | `subway-chicken-teriyaki-6in` | Subway Chicken Teriyaki Sub (6-inch) | nonveg | lunch,restaurant-common,high-protein |
| 121 | `subway-tuna-6in` | Subway Tuna Sub (6-inch) | nonveg | lunch,high-protein |

---

### B6 · Extended North Indian Restaurant Dishes
**Category:** `non-veg` / `sabzi-veg` / `roti-bread` | **Region:** `north`

| # | `id` | `name` | Category | `dietTypes` | Default serving |
|---|------|--------|----------|-------------|-----------------|
| 122 | `amritsari-kulcha-chole` | Amritsari Kulcha with Chole (Plate) | snack-street | veg | 1 plate (2 kulchas + chole ~400g) |
| 123 | `chole-bhature-restaurant` | Chole Bhature (Restaurant, 2 bhature) | snack-street | veg | 1 plate (~400g) |
| 124 | `dal-tadka-restaurant` | Dal Tadka (Restaurant — extra ghee) | dal-legume | veg | 1 bowl (~250g) |
| 125 | `dal-fry-restaurant` | Dal Fry (Restaurant) | dal-legume | veg | 1 bowl (~250g) |
| 126 | `kadhai-paneer` | Kadhai Paneer | sabzi-veg | veg | 1 katori (~150g) |
| 127 | `kadhai-chicken` | Kadhai Chicken | non-veg | nonveg | 1 katori (~150g) |
| 128 | `chicken-tikka-masala` | Chicken Tikka Masala | non-veg | nonveg | 1 katori (~150g) |
| 129 | `mutton-rogan-josh-restaurant` | Mutton Rogan Josh (Restaurant) | non-veg | nonveg | 1 katori (~150g) |
| 130 | `butter-naan` | Butter Naan | roti-bread | veg | 1 piece (~90g) |
| 131 | `garlic-naan` | Garlic Naan | roti-bread | veg | 1 piece (~90g) |
| 132 | `lachha-paratha-restaurant` | Lachha Paratha (Restaurant) | roti-bread | veg | 1 piece (~80g) |
| 133 | `tandoori-roti-ghee` | Tandoori Roti (with ghee) | roti-bread | veg | 1 piece (~50g + ghee) |
| 134 | `chicken-malai-tikka` | Chicken Malai Tikka (6 pcs) | non-veg | nonveg | 1 serving (~180g) |
| 135 | `seekh-kebab-mutton` | Seekh Kebab (Mutton, 2 pcs) | non-veg | nonveg | 1 serving (2 pcs ~100g) |

---

## 🟡 BATCH C — P2 Medium (~55 items)

*Rationale: Café chains serve calorie-dense beverages that urban users frequently under-log. Ice cream and bakery dessert chains are common cheat-meal entries.*

---

### C1 · Starbucks India
**Category:** `drink` | **Subcategory:** `cafe-hot` / `cafe-cold` | **Region:** `pan-indian` | **Source:** `FSSAI-label`

| # | `id` | `name` | `itemType` | `tags` | Default serving |
|---|------|--------|-----------|--------|-----------------|
| 136 | `starbucks-cappuccino-tall` | Starbucks Cappuccino (Tall) | drink | cafe-hot,cafe-drink | Tall (355ml) |
| 137 | `starbucks-latte-tall` | Starbucks Caffè Latte (Tall) | drink | cafe-hot,cafe-drink | Tall (355ml) |
| 138 | `starbucks-americano-hot` | Starbucks Americano (Hot, Tall) | drink | cafe-hot,cafe-drink,low-calorie | Tall (355ml) |
| 139 | `starbucks-cold-brew-black` | Starbucks Cold Brew (Black, Tall) | drink | cafe-cold,cafe-drink,low-calorie | Tall (355ml) |
| 140 | `starbucks-vanilla-sweet-cream-cold-brew` | Starbucks Vanilla Sweet Cream Cold Brew | drink | cafe-cold,cafe-drink,high-fat | Tall (355ml) |
| 141 | `starbucks-signature-hot-choc` | Starbucks Signature Hot Chocolate (Tall) | drink | cafe-hot,cafe-drink,high-sugar | Tall (355ml) |
| 142 | `starbucks-caramel-frappuccino-tall` | Starbucks Caramel Frappuccino (Tall) | drink | cafe-cold,cafe-drink,high-sugar,calorie-dense | Tall (355ml) |
| 143 | `starbucks-java-chip-frappuccino-tall` | Starbucks Java Chip Frappuccino (Tall) | drink | cafe-cold,cafe-drink,high-sugar,calorie-dense | Tall (355ml) |
| 144 | `starbucks-saffron-latte` | Starbucks Saffron Latte (India special) | drink | cafe-hot,cafe-drink | Tall (355ml) |
| 145 | `starbucks-iced-saffron-latte` | Starbucks Iced Saffron Latte | drink | cafe-cold,cafe-drink | Tall (355ml) |
| 146 | `starbucks-spinach-corn-sandwich` | Starbucks Spinach & Corn Sandwich | packaged-food | cafe-food,breakfast,veg | 1 piece (~150g) |
| 147 | `starbucks-paneer-tikka-sandwich` | Starbucks Paneer Tikka Sandwich | packaged-food | cafe-food,lunch,veg | 1 piece (~155g) |
| 148 | `starbucks-butter-croissant` | Starbucks Butter Croissant | packaged-food | cafe-food,breakfast,veg | 1 piece (~100g) |
| 149 | `starbucks-double-choc-chip-cookie` | Starbucks Double Chocolate Chip Cookie | sweet-mithai | cafe-food,snack,high-sugar | 1 piece (~75g) |

---

### C2 · Café Coffee Day (CCD)
**Category:** `drink` / `packaged-food` | **Subcategory:** `cafe-hot` / `cafe-cold` / `cafe-food` | **Region:** `pan-indian`

| # | `id` | `name` | Category | `dietTypes` | Default serving |
|---|------|--------|----------|-------------|-----------------|
| 150 | `ccd-cappuccino` | CCD Cappuccino (Regular) | drink | veg | 1 cup (300ml) |
| 151 | `ccd-cold-coffee` | CCD Cold Coffee (Classic) | drink | veg | 1 glass (300ml) |
| 152 | `ccd-frappe-chocolate` | CCD Frappe (Chocolate, cream-based) | drink | veg | 1 glass (300ml) |
| 153 | `ccd-filter-coffee` | CCD Filter Coffee | drink | veg | 1 cup (150ml) |
| 154 | `ccd-veg-grilled-sandwich` | CCD Veg Grilled Sandwich | packaged-food | veg | 1 piece (~150g) |
| 155 | `ccd-paneer-tikka-sandwich` | CCD Paneer Tikka Sandwich | packaged-food | veg | 1 piece (~160g) |
| 156 | `ccd-chocolate-brownie` | CCD Chocolate Brownie | sweet-mithai | veg | 1 piece (~90g) |

---

### C3 · Barista / Third Wave / Blue Tokai (Specialty Coffee)
**Category:** `drink` | **Subcategory:** `cafe-cold` / `cafe-hot` | **Region:** `pan-indian`

| # | `id` | `name` | `dietTypes` | Default serving |
|---|------|--------|-------------|-----------------|
| 157 | `cafe-flat-white` | Flat White (Specialty Café) | veg | 1 cup (180ml) |
| 158 | `cafe-iced-latte` | Iced Latte (Specialty Café) | veg | 1 glass (350ml) |
| 159 | `cafe-iced-mocha` | Iced Mocha (Specialty Café) | veg | 1 glass (350ml) |
| 160 | `cafe-cold-brew-milk` | Cold Brew with Milk | veg | 1 glass (300ml) |
| 161 | `cafe-affogato` | Affogato (espresso over ice cream) | veg | 1 serving (~150g) |

---

### C4 · Bakery Chains (Monginis, Theobroma, Karachi Bakery)
**Category:** `sweet-mithai` | **Subcategory:** `bakery-chain` | **Region:** `pan-indian` | **Source:** `FSSAI-label` / `curated-estimate`

| # | `id` | `name` | `dietTypes` | Default serving |
|---|------|--------|-------------|-----------------|
| 162 | `pastry-black-forest-slice` | Black Forest Pastry (1 slice) | veg | 1 slice (~120g) |
| 163 | `pastry-chocolate-truffle-slice` | Chocolate Truffle Pastry (1 slice) | veg | 1 slice (~120g) |
| 164 | `pastry-red-velvet-slice` | Red Velvet Pastry (1 slice) | veg | 1 slice (~120g) |
| 165 | `pastry-fruit-cream-slice` | Fruit Cream Pastry (1 slice) | veg | 1 slice (~100g) |
| 166 | `cake-mawa-slice` | Mawa Cake (1 slice) | veg | 1 slice (~80g) |
| 167 | `cupcake-chocolate` | Cupcake (Chocolate, generic) | veg | 1 piece (~80g) |
| 168 | `brownie-eggless` | Eggless Brownie (Bakery) | veg | 1 piece (~75g) |
| 169 | `cheesecake-slice-generic` | Cheesecake Slice (Generic) | veg | 1 slice (~110g) |
| 170 | `karachi-bakery-fruit-biscuit` | Karachi Bakery Fruit Biscuit (3 pcs) | veg | 1 serving (3 pcs ~50g); `source: FSSAI-label` |

---

### C5 · Ice Cream Chains & Dessert Parlours
**Category:** `sweet-mithai` | **Subcategory:** `ice-cream-chain` | **Region:** `pan-indian`

| # | `id` | `name` | `dietTypes` | Default serving |
|---|------|--------|-------------|-----------------|
| 171 | `icecream-vanilla-scoop` | Vanilla Ice Cream (1 scoop, generic) | veg | 1 scoop (~80g) |
| 172 | `icecream-chocolate-scoop` | Chocolate Ice Cream (1 scoop, generic) | veg | 1 scoop (~80g) |
| 173 | `icecream-naturals-coconut` | Naturals Tender Coconut Ice Cream (1 scoop) | veg | 1 scoop (~80g); `source: FSSAI-label` |
| 174 | `icecream-naturals-sitaphal` | Naturals Sitaphal (Custard Apple) Ice Cream | veg | 1 scoop (~80g); `source: FSSAI-label` |
| 175 | `icecream-baskin-robbins-single` | Baskin Robbins Single Scoop (generic) | veg | 1 scoop (~100g) |
| 176 | `icecream-cornetto-cone` | Cornetto Cone (Kwality Wall's) | veg | 1 cone (~75g); `source: FSSAI-label` |
| 177 | `icecream-magnum-classic` | Magnum Classic Bar (Kwality Wall's) | veg | 1 bar (~90g); `source: FSSAI-label` |
| 178 | `soft-serve-cone-generic` | Soft Serve Ice Cream Cone (Generic) | veg | 1 cone (~115g) |
| 179 | `keventers-thick-shake-choc` | Keventers Thick Shake (Chocolate) | veg | 1 glass (400ml) |
| 180 | `waffle-nutella-belgian` | Belgian Waffle with Nutella | veg | 1 waffle (~180g) |
| 181 | `waffle-choc-overload` | Chocolate Overload Waffle | veg | 1 waffle (~200g) |
| 182 | `waffle-bubble-generic` | Bubble Waffle (Generic, Chocolate) | veg | 1 waffle (~150g) |

---

## 🟢 BATCH D — P3 Standard (~57 items)

*Rationale: Global cuisines with documented Swiggy growth. Extended regional Indian cuisines for better national coverage.*

---

### D1 · Extended South Indian Dishes
**Category:** `breakfast` / `non-veg` / `roti-bread` | **Region:** `south`

| # | `id` | `name` | Category | `dietTypes` | Default serving |
|---|------|--------|----------|-------------|-----------------|
| 183 | `dosa-ghee-roast-plain` | Ghee Roast Dosa (Plain) | breakfast | veg | 1 dosa (~120g) |
| 184 | `dosa-ghee-roast-masala` | Ghee Roast Masala Dosa | breakfast | veg | 1 dosa (~180g) |
| 185 | `dosa-mysore-masala` | Mysore Masala Dosa | breakfast | veg | 1 dosa (~200g) |
| 186 | `dosa-neer` | Neer Dosa (Rice crepe, 2 pcs) | breakfast | veg | 2 pcs (~120g) |
| 187 | `dosa-set-3pc` | Set Dosa (3 small dosas with sambar) | breakfast | veg | 1 plate (3 pcs ~250g) |
| 188 | `kerala-parotta` | Kerala Parotta (1 piece) | roti-bread | veg | 1 parotta (~100g) |
| 189 | `kerala-parotta-chicken-combo` | Kerala Parotta with Chicken Curry (Combo) | roti-bread | nonveg | 1 plate (2 parottas + curry ~450g) |
| 190 | `chettinad-chicken-curry` | Chettinad Chicken Curry | non-veg | nonveg | 1 katori (~180g) |
| 191 | `malabar-fish-curry` | Malabar Fish Curry | non-veg | nonveg | 1 katori (~180g) |
| 192 | `andhra-chicken-fry` | Andhra Chicken Fry | non-veg | nonveg | 1 serving (~150g) |
| 193 | `hyderabadi-haleem` | Hyderabadi Haleem (non-veg, 1 bowl) | non-veg | nonveg | 1 bowl (~250g) |

---

### D2 · East & Bengali Dishes
**Category:** `non-veg` / `breakfast` / `sweet-mithai` | **Region:** `east`

| # | `id` | `name` | Category | `dietTypes` | Default serving |
|---|------|--------|----------|-------------|-----------------|
| 194 | `bengali-macher-jhol` | Bengali Fish Curry (Macher Jhol) | non-veg | nonveg | 1 katori (~200g) |
| 195 | `bengali-fish-fry` | Bengali Fish Fry (1 piece) | non-veg | nonveg | 1 piece (~120g) |
| 196 | `luchi-aloo-dum` | Luchi with Aloo Dum | breakfast | veg | 1 plate (3 luchis + aloo ~300g) |
| 197 | `kosha-mangsho` | Kosha Mangsho (Dry Bengali Mutton Curry) | non-veg | nonveg | 1 katori (~180g) |
| 198 | `mishti-doi` | Mishti Doi (Bengali Sweet Yogurt) | sweet-mithai | veg | 1 cup (~150g) |
| 199 | `thukpa-veg` | Thukpa (Tibetan Noodle Soup, Veg) | rice-dish | veg | 1 bowl (~350g) |
| 200 | `thukpa-chicken` | Thukpa (Tibetan Noodle Soup, Chicken) | rice-dish | nonveg | 1 bowl (~380g) |

---

### D3 · Goan & Coastal Dishes
**Category:** `non-veg` / `snack-street` | **Region:** `west`

| # | `id` | `name` | Category | `dietTypes` | Default serving |
|---|------|--------|----------|-------------|-----------------|
| 201 | `goan-fish-curry-rice` | Goan Fish Curry with Rice | non-veg | nonveg | 1 plate (~450g) |
| 202 | `goan-prawn-curry` | Goan Prawn Curry | non-veg | nonveg | 1 katori (~180g) |
| 203 | `goan-xacuti-chicken` | Goan Chicken Xacuti | non-veg | nonveg | 1 katori (~200g) |
| 204 | `malvani-fish-curry` | Malvani Fish Curry | non-veg | nonveg | 1 katori (~180g) |
| 205 | `bombil-fry` | Bombil Fry (Bombay Duck, 2 pcs) | non-veg | nonveg | 1 serving (2 pcs ~100g) |
| 206 | `prawn-koliwada` | Prawn Koliwada (Fried, 6 pcs) | snack-street | nonveg | 1 serving (~150g) |

---

### D4 · Japanese & Korean Dishes
**Category:** `rice-dish` / `snack-street` | **Subcategory:** `global-bowl` | **Region:** `pan-indian`

| # | `id` | `name` | Category | `dietTypes` | Default serving |
|---|------|--------|----------|-------------|-----------------|
| 207 | `sushi-roll-veg` | Sushi Roll (Veg — avocado/cucumber, 6 pcs) | snack-street | veg | 1 plate (6 pcs ~180g) |
| 208 | `sushi-roll-salmon` | Sushi Roll (Salmon, 6 pcs) | snack-street | nonveg | 1 plate (6 pcs ~180g) |
| 209 | `ramen-veg-bowl` | Ramen Bowl (Veg) | rice-dish | veg | 1 bowl (~450ml) |
| 210 | `ramen-chicken-bowl` | Ramen Bowl (Chicken) | rice-dish | nonveg | 1 bowl (~500ml) |
| 211 | `bibimbap-veg` | Korean Bibimbap (Veg) | rice-dish | veg | 1 bowl (~400g) |
| 212 | `bibimbap-chicken` | Korean Bibimbap (Chicken) | rice-dish | nonveg | 1 bowl (~430g) |
| 213 | `korean-fried-chicken-wings` | Korean Fried Chicken (Wings, 6 pcs) | snack-street | nonveg | 1 serving (6 pcs ~250g) |
| 214 | `kimchi-side` | Kimchi (Side Portion) | condiment | vegan | 1 small bowl (~50g) |
| 215 | `japchae-veg` | Japchae (Korean Glass Noodles, Veg) | rice-dish | veg | 1 bowl (~250g) |

---

### D5 · Thai Dishes
**Category:** `rice-dish` | **Region:** `pan-indian` | **Source:** `USDA` / `curated-estimate`

| # | `id` | `name` | `dietTypes` | Default serving |
|---|------|--------|-------------|-----------------|
| 216 | `pad-thai-veg` | Pad Thai Noodles (Veg) | veg | 1 plate (~300g) |
| 217 | `pad-thai-chicken` | Pad Thai Noodles (Chicken) | nonveg | 1 plate (~320g) |
| 218 | `thai-green-curry-veg-rice` | Thai Green Curry with Rice (Veg) | veg | 1 bowl (~400g) |
| 219 | `thai-red-curry-chicken-rice` | Thai Red Curry with Rice (Chicken) | nonveg | 1 bowl (~430g) |

---

### D6 · Mexican Dishes
**Category:** `rice-dish` / `snack-street` | **Region:** `pan-indian`

| # | `id` | `name` | Category | `dietTypes` | Default serving |
|---|------|--------|----------|-------------|-----------------|
| 220 | `taco-bell-veg-burrito` | Taco Bell Veg Burrito | rice-dish | veg | 1 wrap (~280g) |
| 221 | `taco-bell-chicken-burrito` | Taco Bell Chicken Burrito | rice-dish | nonveg | 1 wrap (~300g) |
| 222 | `burrito-bowl-veg` | Burrito Bowl (Veg — rice, beans, salsa) | rice-dish | veg | 1 bowl (~400g) |
| 223 | `burrito-bowl-chicken` | Burrito Bowl (Chicken) | rice-dish | nonveg | 1 bowl (~430g) |
| 224 | `taco-soft-veg-2pc` | Soft Tacos (Veg, 2 pcs) | snack-street | veg | 1 serving (2 pcs ~200g) |
| 225 | `taco-soft-chicken-2pc` | Soft Tacos (Chicken, 2 pcs) | snack-street | nonveg | 1 serving (2 pcs ~220g) |
| 226 | `nachos-cheese` | Nachos with Cheese | snack-street | veg | 1 portion (~120g) |
| 227 | `nachos-loaded-veg` | Loaded Nachos (Veg — beans, cheese, salsa) | snack-street | veg | 1 portion (~200g) |
| 228 | `taco-bell-mexican-rice-bowl-veg` | Taco Bell Mexican Rice Bowl (Veg) | rice-dish | veg | 1 bowl (~350g) |

---

### D7 · Middle Eastern & Levantine Dishes (Extended in v3.1)
**Category:** `snack-street` / `roti-bread` | **Region:** `pan-indian`

> **v3.1 addition:** Original D7 had only 4 items. Added Baba Ganoush, Fattoush, Tabbouleh, Turkish Doner Kebab, and Pita (standalone). These are now widely available at Lebanese/Mediterranean restaurants and cloud kitchens in India.

| # | `id` | `name` | Category | `dietTypes` | Default serving |
|---|------|--------|----------|-------------|-----------------|
| 229 | `hummus-pita` | Hummus with Pita Bread | snack-street | vegan | 1 plate (hummus 100g + 2 pita ~120g) |
| 230 | `falafel-wrap` | Falafel Wrap | snack-street | vegan | 1 wrap (~220g) |
| 231 | `chicken-shawarma-roll` | Chicken Shawarma Roll | snack-street | nonveg | 1 roll (~250g) |
| 232 | `shawarma-platter-chicken` | Shawarma Platter (Chicken, pita, hummus, salad) | snack-street | nonveg | 1 plate (~400g) |
| 233 | `baba-ganoush-pita` | Baba Ganoush with Pita | snack-street | vegan | 1 plate (~150g) |
| 234 | `fattoush-salad` | Fattoush Salad | snack-street | vegan | 1 bowl (~200g) |
| 235 | `tabbouleh-salad` | Tabbouleh (Parsley-Bulgur Salad) | snack-street | vegan | 1 bowl (~150g) |
| 236 | `kibbeh-2pc` | Kibbeh (Lamb/Beef, 2 pcs) | snack-street | nonveg | 1 serving (2 pcs ~120g) |
| 237 | `turkish-doner-kebab-roll` | Turkish Doner Kebab Roll (Chicken) | snack-street | nonveg | 1 roll (~280g) |
| 238 | `pita-bread-plain` | Pita Bread (Plain, 1 piece) | roti-bread | vegan | 1 piece (~60g) |
| 239 | `baklava-piece` | Baklava (1 piece) | sweet-mithai | veg | 1 piece (~40g); very calorie-dense (~220 kcal) |
| 240 | `tzatziki-portion` | Tzatziki (Greek Yogurt Dip) | condiment | veg | 1 small bowl (~80g) |

---

## 🔵 BATCH E — P4 Coverage (~35 items)

*Rationale: Completeness. Alcohol logging is growing; coastal/regional cuisine coverage gaps.*

---

### E1 · Cold Beverages, Shakes & Juices (Extended)
**Category:** `drink` | **Subcategory:** `cold-shake` / `juice-fresh` | **Region:** `pan-indian`

| # | `id` | `name` | `dietTypes` | Default serving |
|---|------|--------|-------------|-----------------|
| 241 | `shake-chocolate-milk` | Chocolate Milkshake | veg | 1 glass (300ml) |
| 242 | `shake-strawberry-milk` | Strawberry Milkshake | veg | 1 glass (300ml) |
| 243 | `shake-oreo-cookies-cream` | Oreo / Cookies & Cream Shake | veg | 1 glass (350ml) |
| 244 | `juice-orange-packaged` | Packaged Orange Juice (tetra-pack) | veg | 1 pack (200ml); `source: FSSAI-label` |
| 245 | `juice-mixed-fruit-packaged` | Packaged Mixed Fruit Juice | veg | 1 pack (200ml); `source: FSSAI-label` |
| 246 | `sports-drink-electrolyte` | Electrolyte Sports Drink (Generic) | veg | 1 bottle (500ml); tag: `post-workout` |
| 247 | `energy-drink-caffeinated` | Energy Drink (Caffeinated, Generic) | veg | 1 can (250ml); `isProcessed: true` |

---

### E2 · Packaged Soft Drinks (Size Variants)
**Category:** `drink` | **Subcategory:** `packaged-soft-drink` | **Region:** `pan-indian` | **Source:** `FSSAI-label`

| # | `id` | `name` | `dietTypes` | Default serving |
|---|------|--------|-------------|-----------------|
| 248 | `cola-glass-200ml` | Cola — Glass Bottle (200ml) | veg | 1 bottle (200ml) |
| 249 | `cola-can-330ml` | Cola — Can (330ml) | veg | 1 can (330ml) |
| 250 | `cola-pet-600ml` | Cola — PET Bottle (600ml) | veg | 1 bottle (600ml) |
| 251 | `cola-diet-330ml` | Diet / Zero Cola — Can (330ml) | veg | 1 can (330ml) |
| 252 | `soda-lemon-lime-200ml` | Lemon-Lime Soda (200ml) | veg | 1 bottle (200ml) |
| 253 | `sparkling-water-flavoured` | Flavoured Sparkling Water (250ml) | veg | 1 can (250ml) |

---

### E3 · Alcoholic Beverages
**Category:** `drink` | **Subcategory:** `alcoholic` | **Region:** `pan-indian`

> **Note for agents:** Set `alcoholG` to actual ethanol grams per serving (ethanol = 7 kcal/g). Tag: `alcoholic`, `isProcessed: true`. **Do NOT tag alcoholic drinks as `pre-workout`, `post-workout`, or `high-protein`.**

| # | `id` | `name` | Alcohol % | `alcoholG` | Default serving |
|---|------|--------|-----------|------------|-----------------|
| 254 | `beer-regular-lager-330ml` | Regular Beer / Lager (330ml pint) | ~5% | ~13g | 1 pint (330ml) |
| 255 | `beer-strong-500ml` | Strong Beer (500ml can) | ~8% | ~32g | 1 can (500ml) |
| 256 | `beer-wheat-500ml` | Wheat Beer (500ml glass) | ~5.5% | ~22g | 1 glass (500ml) |
| 257 | `wine-red-150ml` | Red Wine (1 glass) | ~13% | ~16g | 1 glass (150ml) |
| 258 | `wine-white-150ml` | White Wine (1 glass) | ~12% | ~14g | 1 glass (150ml) |
| 259 | `whisky-indian-30ml` | Indian Whisky (1 peg) | ~42.8% | ~10g | 1 peg (30ml) |
| 260 | `whisky-soda-glass` | Whisky with Soda (1 glass) | — | ~10g | 1 glass (30ml whisky + 120ml soda) |
| 261 | `rum-dark-30ml` | Dark Rum (1 peg) | ~42.8% | ~10g | 1 peg (30ml) |
| 262 | `rum-cola-glass` | Rum and Cola (1 glass) | — | ~10g | 1 glass (30ml rum + 120ml cola) |
| 263 | `vodka-shot-30ml` | Vodka (1 shot) | ~40% | ~9.5g | 1 shot (30ml) |
| 264 | `vodka-soda-glass` | Vodka with Soda (1 glass) | — | ~9.5g | 1 glass (30ml vodka + 120ml soda) |
| 265 | `gin-tonic-glass` | Gin and Tonic (1 glass) | — | ~9.5g | 1 glass (30ml gin + 120ml tonic) |
| 266 | `tequila-shot-30ml` | Tequila Shot (30ml) | ~40% | ~9.5g | 1 shot (30ml) |
| 267 | `cocktail-mojito` | Mojito Cocktail (Standard) | ~8% | ~16g | 1 glass (~250ml) |
| 268 | `cocktail-margarita` | Margarita Cocktail (Standard) | ~15% | ~18g | 1 glass (~150ml) |
| 269 | `cocktail-liit` | Long Island Iced Tea (LIIT) | ~22% | ~33g | 1 glass (~300ml) |
| 270 | `cider-bottle-330ml` | Apple Cider (330ml bottle) | ~5% | ~13g | 1 bottle (330ml) |

---

### E4 · Haldirams & South Indian Chain Restaurant Dishes
**Category:** `snack-street` / `rice-dish` / `breakfast` | **Region:** `north` / `south`

| # | `id` | `name` | Category | `dietTypes` | Default serving |
|---|------|--------|----------|-------------|-----------------|
| 271 | `haldirams-veg-thali` | Haldiram's Veg Thali (Restaurant) | rice-dish | veg | 1 plate (~600g) |
| 272 | `haldirams-chole-bhature` | Haldiram's Chole Bhature | snack-street | veg | 1 plate (~400g) |
| 273 | `haldirams-raj-kachori` | Haldiram's Raj Kachori | snack-street | veg | 1 piece (~200g) |
| 274 | `haldirams-pav-bhaji` | Haldiram's Pav Bhaji | snack-street | veg | 1 plate (bhaji + 2 pav ~380g) |
| 275 | `saravana-bhavan-south-thali` | Saravana Bhavan South Indian Thali | rice-dish | veg | 1 full meal (~700g) |
| 276 | `saravana-bhavan-mini-tiffin` | Saravana Bhavan Mini Tiffin | breakfast | veg | 1 plate (~450g) |
| 277 | `a2b-ghee-pongal` | A2B (Adyar Ananda Bhavan) Ghee Pongal | breakfast | veg | 1 plate (~200g) |
| 278 | `a2b-rava-kesari` | A2B Rava Kesari | sweet-mithai | veg | 1 portion (~150g) |

---

### E5 · Pizza Hut India
**Category:** `packaged-food` | **Subcategory:** `qsr-pizza` | **Source:** `FSSAI-label`

| # | `id` | `name` | `dietTypes` | Default serving |
|---|------|--------|-------------|-----------------|
| 279 | `pizzahut-veggie-supreme` | Pizza Hut Veggie Supreme (1 slice, pan) | veg | 1 slice (~110g) |
| 280 | `pizzahut-tandoori-paneer` | Pizza Hut Tandoori Paneer Pizza (1 slice) | veg | 1 slice (~110g) |
| 281 | `pizzahut-chicken-supreme` | Pizza Hut Chicken Supreme (1 slice) | nonveg | 1 slice (~115g) |
| 282 | `pizzahut-cheese-garlic-bread` | Pizza Hut Cheese Garlic Bread | veg | 1 piece (2 sticks ~100g) |

---

### E6 · Barbeque Nation Aggregate Plates
**Category:** `non-veg` / `snack-street` | **Region:** `pan-indian` | **Source:** `curated-estimate`

| # | `id` | `name` | Category | `dietTypes` | Default serving |
|---|------|--------|----------|-------------|-----------------|
| 283 | `bbq-nation-veg-starter-plate` | Barbeque Nation Veg Starter Plate | snack-street | veg | 1 plate (~300g) |
| 284 | `bbq-nation-nonveg-starter-plate` | Barbeque Nation Non-Veg Starter Plate | non-veg | nonveg | 1 plate (~280g) |
| 285 | `bbq-nation-main-course-plate` | Barbeque Nation Main Course (generic) | rice-dish | nonveg | 1 plate (~500g) |

---

### E7 · Faasos & Indian Roll QSRs
**Category:** `snack-street` / `packaged-food` | **Subcategory:** `qsr-indian` | **Region:** `pan-indian`

| # | `id` | `name` | `dietTypes` | Default serving |
|---|------|--------|-------------|-----------------|
| 286 | `faasos-veg-paneer-roll` | Faasos Veg Paneer Roll | veg | 1 roll (~200g) |
| 287 | `faasos-egg-roll` | Faasos Egg Roll | egg | 1 roll (~200g) |
| 288 | `faasos-chicken-tikka-roll` | Faasos Chicken Tikka Roll | nonveg | 1 roll (~210g) |

---

## 🟠 BATCH F — P1 High · Italian Restaurant Dishes (~22 items) *(NEW in v3.1)*

*Rationale: Italian cuisine, led by pasta, is the second most-ordered global cuisine in India after pizza (Swiggy 2025 data). Not a single pasta dish existed in v3.0 — the Domino's and Pizza Hut entries only covered pizza. Italian restaurants (Olive, Artusi, Social) are ubiquitous in Tier-1 cities.*

**Category:** `rice-dish` (pasta/risotto bowls) / `snack-street` (antipasti, bruschetta) / `sweet-mithai` (Italian desserts)
**Subcategory:** `italian-pasta` | **Region:** `pan-indian` | **Source:** `USDA` (generic dishes), `curated-estimate` (restaurant versions)

> **Note for agents:** Default serving for pasta is 1 `plate` (~300g cooked). All pasta is `state: cooked`, `isRecipe: true`, `cookingOilNote` required (olive oil is used in most Italian dishes). `containsRootVeg: false` for most pasta unless garlic/onion is explicitly named in the dish. Tag `high-carb`, `restaurant-common`. Confidence `medium`.

### F1 · Pasta Dishes

| # | `id` | `name` | `dietTypes` | Key macros (per 100g) | Default serving |
|---|------|--------|-------------|----------------------|-----------------|
| 289 | `pasta-arrabbiata-veg` | Pasta Arrabbiata (Veg) | veg | ~130 kcal, 4g P, 22g C, 3g F | 1 plate (~300g) |
| 290 | `pasta-aglio-olio-veg` | Pasta Aglio e Olio (Veg) | veg | ~180 kcal, 5g P, 24g C, 7g F | 1 plate (~280g) |
| 291 | `pasta-pesto-veg` | Pasta with Pesto (Veg) | veg | ~200 kcal, 6g P, 22g C, 10g F | 1 plate (~280g) |
| 292 | `pasta-marinara-veg` | Pasta Marinara (Veg, tomato-basil) | vegan | ~120 kcal, 4g P, 22g C, 2g F | 1 plate (~300g) |
| 293 | `pasta-alfredo-veg` | Pasta Alfredo (Veg, cream-based) | veg | ~195 kcal, 6g P, 22g C, 9g F | 1 plate (~300g) |
| 294 | `pasta-alfredo-chicken` | Pasta Alfredo (Chicken) | nonveg | ~210 kcal, 13g P, 20g C, 9g F | 1 plate (~320g) |
| 295 | `pasta-bolognese-chicken` | Pasta Bolognese (Chicken/Mutton mince) | nonveg | ~145 kcal, 10g P, 18g C, 4g F | 1 plate (~320g) |
| 296 | `pasta-pink-sauce-veg` | Pasta in Pink/Rosé Sauce (Veg) | veg | ~170 kcal, 5g P, 21g C, 7g F | 1 plate (~300g) |
| 297 | `pasta-pink-sauce-chicken` | Pasta in Pink Sauce (Chicken) | nonveg | ~180 kcal, 12g P, 19g C, 7g F | 1 plate (~320g) |
| 298 | `lasagna-veg` | Vegetable Lasagna (1 portion) | veg | ~165 kcal, 7g P, 18g C, 7g F | 1 piece (~250g) |
| 299 | `lasagna-chicken` | Chicken Lasagna (1 portion) | nonveg | ~185 kcal, 13g P, 17g C, 7g F | 1 piece (~250g) |

### F2 · Risotto & Other Italian Mains

| # | `id` | `name` | `dietTypes` | Default serving |
|---|------|--------|-------------|-----------------|
| 300 | `risotto-mushroom-veg` | Mushroom Risotto | veg | 1 bowl (~300g) |
| 301 | `risotto-chicken` | Chicken Risotto | nonveg | 1 bowl (~320g) |

### F3 · Italian Starters & Sides

| # | `id` | `name` | `dietTypes` | Default serving |
|---|------|--------|-------------|-----------------|
| 302 | `bruschetta-tomato` | Bruschetta (Tomato & Basil, 2 pcs) | vegan | 1 serving (2 pcs ~120g) |
| 303 | `caprese-salad` | Caprese Salad (Tomato + Mozzarella) | veg | 1 plate (~200g) |
| 304 | `caesar-salad-veg` | Caesar Salad (Veg, no chicken) | veg | 1 bowl (~200g) |
| 305 | `caesar-salad-chicken` | Caesar Salad with Grilled Chicken | nonveg | 1 bowl (~250g) |
| 306 | `garlic-bread-restaurant` | Garlic Bread (Restaurant, 4 slices) | veg | 1 serving (4 slices ~120g) |
| 307 | `pizza-express-margherita-slice` | Pizza Express Margherita (1 slice) | veg | 1 slice (~110g); `chainName: 'Pizza Express'`, `source: FSSAI-label` |
| 308 | `pizza-express-dough-balls-6pc` | Pizza Express Dough Balls (6 pcs) | veg | 1 serving (6 pcs ~120g) |

### F4 · Italian Desserts

| # | `id` | `name` | `dietTypes` | Default serving |
|---|------|--------|-------------|-----------------|
| 309 | `tiramisu-generic` | Tiramisu (Restaurant, 1 portion) | veg | 1 slice (~120g) |
| 310 | `panna-cotta-generic` | Panna Cotta (1 portion) | veg | 1 cup (~120g) |

---

## 🟡 BATCH G — P2 Medium · Vietnamese & Southeast Asian (~18 items) *(NEW in v3.1)*

*Rationale: Vietnamese cuisine is growing rapidly on Indian delivery platforms. Pho restaurants and Banh Mi stalls now operate in every major Indian city. Nasi Goreng and Laksa appear on restaurant menus frequently. Not a single Vietnamese item existed in v3.0.*

**Category:** `rice-dish` (soups, noodle bowls) / `snack-street` (rolls, dim sum)
**Subcategory:** `vietnamese-noodle` | **Source:** `USDA` / `curated-estimate`

> **Note for agents:** All Vietnamese soups (pho) default to 1 `bowl` (~450ml). Banh Mi = 1 roll (~200g). Mark `isRecipe: true` for all cooked dishes. Confidence `medium`.

### G1 · Vietnamese Dishes

| # | `id` | `name` | `dietTypes` | Default serving |
|---|------|--------|-------------|-----------------|
| 311 | `pho-veg` | Pho (Vegetable Broth, Tofu) | vegan | 1 bowl (~450ml) |
| 312 | `pho-chicken` | Pho (Chicken) | nonveg | 1 bowl (~500ml) |
| 313 | `pho-beef` | Pho (Beef — Bò Phở) | nonveg | 1 bowl (~500ml) |
| 314 | `banh-mi-chicken` | Bánh Mì (Chicken, baguette) | nonveg | 1 roll (~200g) |
| 315 | `banh-mi-tofu-veg` | Bánh Mì (Tofu, veg) | vegan | 1 roll (~190g) |
| 316 | `goi-cuon-veg` | Fresh Spring Rolls / Gỏi Cuốn (Veg, 2 pcs) | vegan | 1 serving (2 pcs ~120g) |
| 317 | `goi-cuon-chicken` | Fresh Spring Rolls / Gỏi Cuốn (Chicken, 2 pcs) | nonveg | 1 serving (2 pcs ~130g) |
| 318 | `vietnamese-fried-spring-roll-veg` | Vietnamese Fried Spring Roll (Veg, 4 pcs) | veg | 1 serving (4 pcs ~160g) |
| 319 | `ca-phe-sua-da` | Vietnamese Iced Coffee (Cà Phê Sữa Đá) | veg | 1 glass (300ml) |

### G2 · Indonesian & Malaysian Dishes

| # | `id` | `name` | `dietTypes` | Default serving |
|---|------|--------|-------------|-----------------|
| 320 | `nasi-goreng-veg` | Nasi Goreng (Indonesian Fried Rice, Veg) | veg | 1 plate (~300g) |
| 321 | `nasi-goreng-chicken` | Nasi Goreng (Indonesian Fried Rice, Chicken) | nonveg | 1 plate (~320g) |
| 322 | `laksa-veg` | Laksa (Malaysian Noodle Soup, Veg) | veg | 1 bowl (~450ml) |
| 323 | `laksa-chicken` | Laksa (Malaysian Noodle Soup, Chicken) | nonveg | 1 bowl (~500ml) |
| 324 | `roti-canai-curry` | Roti Canai with Curry (Malaysian) | veg | 1 plate (2 rotis + curry ~280g) |
| 325 | `satay-chicken-4pc` | Chicken Satay (4 sticks) with peanut sauce | nonveg | 1 serving (4 sticks ~160g) |

### G3 · Singaporean Dishes

| # | `id` | `name` | `dietTypes` | Default serving |
|---|------|--------|-------------|-----------------|
| 326 | `singapore-chicken-rice` | Singaporean Hainanese Chicken Rice | nonveg | 1 plate (~380g) |
| 327 | `chilli-crab-gravy` | Chilli Crab (Gravy, 1 serving) | nonveg | 1 katori (~200g); confidence `low` |
| 328 | `laksa-singapore-prawn` | Singapore Prawn Laksa | nonveg | 1 bowl (~450ml) |

---

## 🟡 BATCH H — P2 Medium · Extended Greek, Mediterranean & Turkish (~16 items) *(NEW in v3.1)*

*Rationale: Greek, Turkish, and Mediterranean restaurants have expanded significantly in Indian metros. The original D7 had only 4 items (hummus, falafel wrap, shawarma, shawarma platter). This fills the remaining gap with Greek salads, souvlaki, gyros, and Turkish items.*

**Category:** `snack-street` / `roti-bread` / `sweet-mithai` | **Region:** `pan-indian`

> **Note for agents:** Source `USDA` for generic Mediterranean items; `curated-estimate` for Indian restaurant versions. Greek salad has near-zero `containsRootVeg` concern (no potato/onion in traditional version but red onion is used — flag `containsRootVeg: true`). Confidence `medium`.

### H1 · Greek Dishes

| # | `id` | `name` | `dietTypes` | Default serving |
|---|------|--------|-------------|-----------------|
| 329 | `greek-salad-classic` | Greek Salad (Classic — tomato, cucumber, feta, olives) | veg | 1 bowl (~250g) |
| 330 | `gyros-chicken` | Gyros Wrap (Chicken, with tzatziki) | nonveg | 1 wrap (~250g) |
| 331 | `gyros-veg-paneer` | Gyros Wrap (Veg — paneer substitution, Indian café style) | veg | 1 wrap (~230g) |
| 332 | `souvlaki-chicken-plate` | Souvlaki (Grilled Chicken, 2 skewers + pita) | nonveg | 1 plate (~300g) |
| 333 | `spanakopita-slice` | Spanakopita (Spinach & Feta Pie, 1 slice) | veg | 1 piece (~120g) |

### H2 · Turkish Dishes

| # | `id` | `name` | `dietTypes` | Default serving |
|---|------|--------|-------------|-----------------|
| 334 | `turkish-doner-plate-chicken` | Turkish Doner Plate (Chicken, rice, salad) | nonveg | 1 plate (~450g) |
| 335 | `turkish-adana-kebab` | Turkish Adana Kebab (2 skewers) | nonveg | 1 serving (2 skewers ~160g) |
| 336 | `turkish-lahmacun` | Lahmacun (Turkish Meat Pizza, 1 piece) | nonveg | 1 piece (~150g) |
| 337 | `turkish-baklava-2pc` | Turkish Baklava (2 pieces) | veg | 1 serving (2 pcs ~80g) |

### H3 · Levantine / General Mediterranean

| # | `id` | `name` | `dietTypes` | Default serving |
|---|------|--------|-------------|-----------------|
| 338 | `mujaddara-lentil-rice` | Mujaddara (Lentils with Rice & Crispy Onion) | vegan | 1 bowl (~250g) |
| 339 | `mediterranean-mezze-platter` | Mediterranean Mezze Platter (hummus, baba ganoush, pita, salad) | vegan | 1 plate (~350g); confidence `low` |
| 340 | `shakshuka-eggs` | Shakshuka (Poached Eggs in Tomato Sauce) | egg | 1 skillet (~300g) |
| 341 | `kofta-kebab-plate` | Kofta Kebab (Lamb/Beef, 3 pcs + pita) | nonveg | 1 plate (~350g) |
| 342 | `dolma-stuffed-grape-leaves` | Dolma / Stuffed Grape Leaves (4 pcs) | vegan | 1 serving (4 pcs ~100g) |
| 343 | `moussaka-slice` | Moussaka (1 slice, Eggplant Lamb Bake) | nonveg | 1 slice (~200g) |
| 344 | `pita-chips-plain` | Pita Chips (30g portion) | vegan | 1 handful (~30g) |

---

## 🔴 BATCH I — P0 Critical · Bubble Tea, Matcha & Trending Café Drinks (~20 items) *(NEW in v3.1)*

*Rationale: Bubble Tea / Boba Tea is one of the fastest-growing food trends in India in 2024–26. Chatime, LaBoba, Boba Bhai, and thousands of independent boba shops are present in every Indian city. Not a single boba entry existed in the entire v3.0 database. This is a critical gap for urban users aged 18–30, which is FitTrack Pro's core demographic. Matcha lattes and Dalgona coffee are equally ubiquitous in Indian specialty cafés.*

---

### I1 · Bubble Tea / Boba Tea
**Category:** `drink` | **Subcategory:** `bubble-tea` | **Region:** `pan-indian`

> **Note for agents:** Bubble tea contains TWO significant calorie sources — the tea base + the tapioca pearls. Pearls add ~80–120 kcal per serving (30g dry pearls, cooked weight ~90g). `defaultServingGrams: 400` (standard boba cup with pearls). `isProcessed: true`, `hasBeverageModifiers: false` (unlike chai, boba uses standard fixed recipes). Tag `high-sugar`. Source `curated-estimate`, confidence `medium`. Key macro note: a standard 400ml boba drink ranges from ~200–450 kcal depending on sugar level and milk base.

| # | `id` | `name` | `dietTypes` | Key notes | Default serving |
|---|------|--------|-------------|-----------|-----------------|
| 345 | `boba-classic-milk-tea-pearls` | Classic Milk Tea Boba (with pearls) | veg | ~280 kcal/cup; most popular globally | 1 cup (400ml) |
| 346 | `boba-taro-milk-tea-pearls` | Taro Milk Tea Boba (with pearls) | veg | ~290 kcal/cup; purple, slightly sweet | 1 cup (400ml) |
| 347 | `boba-matcha-milk-tea-pearls` | Matcha Milk Tea Boba (with pearls) | veg | ~260 kcal/cup | 1 cup (400ml) |
| 348 | `boba-brown-sugar-fresh-milk` | Brown Sugar Boba Fresh Milk (Tiger Milk Tea) | veg | ~350 kcal/cup; very sweet; trending | 1 cup (400ml) |
| 349 | `boba-passion-fruit-tea` | Passion Fruit Tea Boba (no milk) | vegan | ~180 kcal/cup; lighter option | 1 cup (400ml) |
| 350 | `boba-lychee-tea` | Lychee Tea Boba (no milk) | vegan | ~170 kcal/cup | 1 cup (400ml) |
| 351 | `boba-strawberry-milk-tea` | Strawberry Milk Tea Boba | veg | ~270 kcal/cup | 1 cup (400ml) |
| 352 | `boba-thai-iced-tea-pearls` | Thai Iced Tea Boba (with pearls) | veg | ~300 kcal/cup; condensed milk-based | 1 cup (400ml) |
| 353 | `boba-tapioca-pearls-only` | Tapioca Pearls / Boba Pearls (add-on) | vegan | ~100 kcal/30g serving; for custom entries | 1 serving (~90g cooked) |

---

### I2 · Matcha & Specialty Café Trend Drinks
**Category:** `drink` | **Subcategory:** `matcha-drink` | **Region:** `pan-indian`

> **Note for agents:** Matcha latte is now sold at virtually every Indian specialty café (Blue Tokai, Third Wave, Araku, etc.). Source `curated-estimate`, confidence `medium`. Tag `cafe-drink`. `defaultServingGrams: 300` (standard café cup). Note: matcha has ~5–7g caffeine equivalent — relevant for pre-workout tracking context.

| # | `id` | `name` | `dietTypes` | Key notes | Default serving |
|---|------|--------|-------------|-----------|-----------------|
| 354 | `matcha-latte-hot` | Matcha Latte (Hot, with oat/dairy milk) | veg | ~120 kcal; growing in Indian cafes | 1 cup (300ml) |
| 355 | `matcha-latte-iced` | Matcha Latte (Iced) | veg | ~130 kcal/cup (more milk) | 1 glass (350ml) |
| 356 | `dalgona-coffee-hot` | Dalgona Coffee (Hot, whipped) | veg | ~150 kcal; popular home + café | 1 cup (250ml) |
| 357 | `dalgona-coffee-iced` | Dalgona Coffee (Iced, over milk) | veg | ~180 kcal | 1 glass (300ml) |
| 358 | `lavender-latte` | Lavender Latte (Specialty Café) | veg | ~140 kcal | 1 cup (300ml) |
| 359 | `rose-latte` | Rose Latte (Specialty Café) | veg | ~130 kcal | 1 cup (300ml) |
| 360 | `dirty-chai-latte` | Dirty Chai Latte (Espresso + Masala Chai) | veg | ~160 kcal; hybrid trend drink | 1 cup (300ml) |
| 361 | `cold-brew-tonic` | Cold Brew + Tonic Water (Sparkling) | veg | ~70 kcal; cafe trend | 1 glass (300ml) |
| 362 | `oat-milk-latte` | Oat Milk Latte (Specialty Café) | vegan | ~130 kcal; plant-milk option | 1 cup (300ml) |
| 363 | `mushroom-coffee-adaptogen` | Mushroom / Adaptogen Coffee (powder + milk) | veg | ~90 kcal; wellness café trend; Lion's Mane | 1 cup (250ml) |
| 364 | `probiotic-kombucha-bottle` | Kombucha (Probiotic Fermented Tea, 330ml) | vegan | ~35 kcal; Bira Kombucha, Soda Story brands in India | 1 bottle (330ml) |

---

## 🔴 BATCH J — P0 Critical · Health Chains, Salad Bowls & Fitness Foods (~22 items) *(NEW in v3.1)*

*Rationale: This is the single most critical gap for a fitness-focused app. Urban gym-goers (FitTrack Pro's primary users) frequently order from EatFit, Salad Days, and similar health-focused delivery services. Not a single salad chain or fitness meal delivery entry existed in v3.0. These users are actively trying to eat clean — the database not supporting their actual food choices is a major product gap.*

---

### J1 · EatFit / Cure.fit Meal Boxes
**Category:** `packaged-food` | **Subcategory:** `cloud-kitchen` | **Region:** `pan-indian`

> **Note for agents:** EatFit (by Cult.fit / Cure.fit) is the leading health-focused meal delivery service in India with millions of monthly orders. Source `FSSAI-label` (EatFit publishes macros on app). `confidence: "high"` for published items, `"medium"` for estimates. Tag `muscle-building` or `weight-loss` based on dish goal. `isProcessed: false` (fresh-cooked meals).

| # | `id` | `name` | `dietTypes` | Tags | Default serving |
|---|------|--------|-------------|------|-----------------|
| 365 | `eatfit-high-protein-paneer-bowl` | EatFit High Protein Paneer Bowl | veg | lunch,dinner,high-protein,muscle-building | 1 bowl (~350g) |
| 366 | `eatfit-grilled-chicken-bowl` | EatFit Grilled Chicken Bowl | nonveg | lunch,dinner,high-protein,muscle-building,low-fat | 1 bowl (~350g) |
| 367 | `eatfit-dal-chawal-healthy` | EatFit Dal Chawal (Balanced Macro) | veg | lunch,dinner,high-fiber,muscle-building | 1 bowl (~400g) |
| 368 | `eatfit-oats-overnight-jar` | EatFit Overnight Oats Jar | veg | breakfast,high-fiber,weight-loss | 1 jar (~300g) |
| 369 | `eatfit-egg-white-omelette-meal` | EatFit Egg White Omelette + Toast | egg | breakfast,high-protein,cutting | 1 meal (~250g) |
| 370 | `eatfit-rajma-rice-bowl` | EatFit Rajma Rice Bowl | veg | lunch,dinner,high-protein,high-fiber | 1 bowl (~400g) |
| 371 | `eatfit-chicken-tikka-salad` | EatFit Chicken Tikka Salad | nonveg | lunch,high-protein,weight-loss,low-carb | 1 bowl (~280g) |

---

### J2 · Generic Health & Salad Bowls (Salad Days, etc.)
**Category:** `snack-street` | **Subcategory:** `health-salad` | **Region:** `pan-indian`

> **Note for agents:** Model generically — applies to Salad Days, Sarvi, Love & Greens, or any salad chain. Source `curated-estimate`, confidence `medium`. Tag `weight-loss`, `low-carb`, `no-cook` (assembled, not cooked). `containsRootVeg` varies per salad — check ingredients.

| # | `id` | `name` | `dietTypes` | Tags | Default serving |
|---|------|--------|-------------|------|-----------------|
| 372 | `salad-greek-bowl-generic` | Greek Salad Bowl (Generic Café) | veg | lunch,low-carb,weight-loss | 1 bowl (~250g) |
| 373 | `salad-power-greens-chicken` | Power Greens Salad (Grilled Chicken) | nonveg | lunch,high-protein,low-carb,weight-loss,muscle-building | 1 bowl (~300g) |
| 374 | `salad-quinoa-veg` | Quinoa Salad Bowl (Veg) | vegan | lunch,high-fiber,weight-loss,gluten-free | 1 bowl (~300g) |
| 375 | `salad-caesar-chicken-bowl` | Caesar Salad Bowl (Chicken) | nonveg | lunch,high-protein,restaurant-common | 1 bowl (~280g) |
| 376 | `salad-poke-bowl-tuna` | Poke Bowl (Tuna, Rice, Avocado) | nonveg | lunch,high-protein,omega-3 | 1 bowl (~380g) |
| 377 | `salad-burrito-bowl-veg-health` | Burrito Bowl (High-protein Veg, Health Café) | veg | lunch,high-fiber,high-protein | 1 bowl (~380g) |

---

### J3 · Smoothie Bowls & Acai Bowls
**Category:** `breakfast` | **Subcategory:** `health-bowl` | **Region:** `pan-indian`

> **Note for agents:** Acai bowls and smoothie bowls are now served at most fitness cafes and Swiggy-partnered health cloud kitchens in India. Despite looking "healthy," these are often calorie-dense (400–700 kcal per bowl) due to granola, nut butter, and fruit toppings. Tag both `breakfast` and `calorie-dense` where applicable. Source `curated-estimate`, confidence `medium`.

| # | `id` | `name` | `dietTypes` | Key calorie note | Default serving |
|---|------|--------|-------------|-----------------|-----------------|
| 378 | `acai-bowl-classic` | Acai Bowl (Classic — granola, banana, honey) | vegan | ~420 kcal — calorie-dense despite healthy image | 1 bowl (~350g) |
| 379 | `smoothie-bowl-berry` | Mixed Berry Smoothie Bowl (Greek yogurt base) | veg | ~380 kcal; high protein from yogurt | 1 bowl (~300g) |
| 380 | `smoothie-bowl-peanut-butter-banana` | Peanut Butter Banana Smoothie Bowl | veg | ~480 kcal; bulking-phase appropriate | 1 bowl (~350g) |
| 381 | `granola-bowl-milk` | Granola Bowl with Milk | veg | ~320 kcal; standard café breakfast | 1 bowl (~200g granola + 150ml milk) |
| 382 | `chia-seed-pudding` | Chia Seed Pudding (with almond milk) | vegan | ~220 kcal; low GI; growing in India | 1 jar (~200g) |
| 383 | `protein-smoothie-whey-banana` | Protein Smoothie (Whey + Banana + Milk) | veg | ~350 kcal, ~30g protein; gym staple | 1 glass (400ml) |

---

### J4 · Healthy Wraps & Whole Wheat Options
**Category:** `snack-street` | **Subcategory:** `health-salad` | **Region:** `pan-indian`

| # | `id` | `name` | `dietTypes` | Default serving |
|---|------|--------|-------------|-----------------|
| 384 | `whole-wheat-wrap-veg` | Whole Wheat Veg Wrap (Hummus + Greens) | vegan | 1 wrap (~200g) |
| 385 | `whole-wheat-wrap-chicken` | Whole Wheat Grilled Chicken Wrap | nonveg | 1 wrap (~220g) |
| 386 | `lettuce-wrap-chicken` | Lettuce Wrap (Chicken, Thai-style) | nonveg | 1 serving (2 wraps ~180g) |

---

## 🔴 BATCH K — P0 Critical · Additional Cloud Kitchens & QSR Chains (~28 items) *(NEW in v3.1)*

*Rationale: Biryani By Kilo (BBK) is consistently among the top 5 Swiggy brands in India by order volume and was entirely absent from v3.0. Popeyes India launched in 2022 and has rapidly grown to 30+ outlets. Wendy's India (relaunched 2023) is the fastest-growing QSR in premium burger segment. Box8 has millions of active monthly orders.*

---

### K1 · Popeyes India
**Category:** `packaged-food` | **Subcategory:** `qsr-fried-chicken` | **Region:** `pan-indian` | **Source:** `FSSAI-label`

> **Note for agents:** Popeyes India publishes nutrition data on their website. Use `source: "FSSAI-label"`, `confidence: "high"`. All chicken items `state: fried`. `isProcessed: true`. Key differentiation from KFC: Popeyes uses Cajun spice profile and Louisiana-style breading — higher fat content per piece.

| # | `id` | `name` | `dietTypes` | Tags | Default serving |
|---|------|--------|-------------|------|-----------------|
| 387 | `popeyes-classic-chicken-1pc` | Popeyes Classic Chicken (1 pc) | nonveg | snack,restaurant-common,high-protein,high-fat | 1 piece (~130g) |
| 388 | `popeyes-spicy-chicken-1pc` | Popeyes Spicy Chicken (1 pc) | nonveg | snack,restaurant-common,spicy,high-protein | 1 piece (~130g) |
| 389 | `popeyes-classic-chicken-sandwich` | Popeyes Classic Chicken Sandwich | nonveg | lunch,restaurant-common,high-protein | 1 piece (~200g) |
| 390 | `popeyes-spicy-chicken-sandwich` | Popeyes Spicy Chicken Sandwich | nonveg | lunch,restaurant-common,spicy | 1 piece (~200g) |
| 391 | `popeyes-chicken-strips-3pc` | Popeyes Chicken Tenders / Strips (3 pcs) | nonveg | snack,restaurant-common | 1 serving (3 pcs ~150g) |
| 392 | `popeyes-cajun-fries` | Popeyes Cajun Fries (Regular) | veg | snack,restaurant-common,high-fat,spicy | 1 portion (~115g) |
| 393 | `popeyes-coleslaw` | Popeyes Coleslaw | veg | snack | 1 portion (~120g) |
| 394 | `popeyes-mashed-potato-gravy` | Popeyes Mashed Potato with Gravy | veg | snack | 1 portion (~130g) |

---

### K2 · Wendy's India
**Category:** `packaged-food` | **Subcategory:** `qsr-burger` | **Region:** `pan-indian` | **Source:** `FSSAI-label`

> **Note for agents:** Wendy's India is operated by **Rebel Foods** (EatSure parent, NOT Sapphire Foods — Sapphire operates KFC/Pizza Hut/Taco Bell). As of Oct 2024, Wendy's India has 160+ outlets across 25+ cities. Uses a hybrid model (cloud kitchens + dine-in "Global Next Gen" restaurants). Menu includes India-exclusive items (Spicy Aloo Crunch, Nachoburg, Tandoori Paneer range). `confidence: "high"` where official data is available. Check EatSure app or wendysindia.com for latest menu/nutrition.

| # | `id` | `name` | `dietTypes` | Default serving |
|---|------|--------|-------------|-----------------|
| 395 | `wendys-daves-single` | Wendy's Dave's Single Burger | nonveg | 1 piece (~230g) |
| 396 | `wendys-daves-double` | Wendy's Dave's Double Burger | nonveg | 1 piece (~300g) |
| 397 | `wendys-jr-cheeseburger` | Wendy's Jr. Cheeseburger | nonveg | 1 piece (~150g) |
| 398 | `wendys-spicy-chicken-sandwich` | Wendy's Spicy Chicken Sandwich | nonveg | 1 piece (~200g) |
| 399 | `wendys-crispy-paneer-burger` | Wendy's Crispy Paneer Burger (India exclusive) | veg | 1 piece (~190g) |
| 400 | `wendys-frosty-chocolate` | Wendy's Frosty (Chocolate, Small) | veg | 1 cup (~227g) |
| 401 | `wendys-frosty-vanilla` | Wendy's Frosty (Vanilla, Small) | veg | 1 cup (~227g) |
| 402 | `wendys-natural-cut-fries-medium` | Wendy's Natural Cut Fries (Medium) | veg | 1 portion (~117g) |

---

### K3 · Box8 Cloud Kitchen
**Category:** `packaged-food` | **Subcategory:** `cloud-kitchen` | **Region:** `pan-indian`

> **Note for agents:** Box8 (by Allot.in / Hunger Box) is one of India's largest cloud kitchens with millions of monthly orders. They specialize in Indian comfort food delivered in signature boxes. Source `curated-estimate`, confidence `medium`. `cookingOilNote` required on all curry-based dishes.

| # | `id` | `name` | `dietTypes` | Default serving |
|---|------|--------|-------------|-----------------|
| 403 | `box8-butter-chicken-roti-box` | Box8 Butter Chicken + 2 Rotis (Box) | nonveg | 1 box (~400g) |
| 404 | `box8-dal-makhani-rice-box` | Box8 Dal Makhani + Rice (Box) | veg | 1 box (~420g) |
| 405 | `box8-paneer-tikka-masala-box` | Box8 Paneer Tikka Masala + Roti (Box) | veg | 1 box (~380g) |
| 406 | `box8-chicken-biryani-box` | Box8 Chicken Biryani (Box) | nonveg | 1 box (~400g) |
| 407 | `box8-egg-curry-rice-box` | Box8 Egg Curry + Rice (Box) | egg | 1 box (~380g) |
| 408 | `box8-chole-rice-box` | Box8 Chole + Rice (Box) | veg | 1 box (~400g) |
| 409 | `box8-chicken-keema-roti-box` | Box8 Chicken Keema + Roti (Box) | nonveg | 1 box (~380g) |

---

### K4 · The Good Bowl (Rebel Foods)
**Category:** `packaged-food` | **Subcategory:** `cloud-kitchen` | **Region:** `pan-indian`

| # | `id` | `name` | `dietTypes` | Default serving |
|---|------|--------|-------------|-----------------|
| 410 | `tgb-hyderabadi-chicken-biryani` | The Good Bowl Hyderabadi Chicken Biryani | nonveg | 1 bowl (~450g) |
| 411 | `tgb-veg-pulao-dal` | The Good Bowl Veg Pulao + Dal | veg | 1 bowl (~420g) |
| 412 | `tgb-schezwan-chicken-noodles` | The Good Bowl Schezwan Chicken Noodles | nonveg | 1 bowl (~350g) |

---

### K5 · Kolkata-Style Egg Roll QSRs
**Category:** `snack-street` | **Subcategory:** `qsr-indian` | **Region:** `east` / `pan-indian`

> **Note for agents:** The Kolkata-style egg roll (kathi roll) is distinct from Faasos rolls — it uses a paratha base with a layer of fried egg, then fillings. It is now sold across India (Kusum Rolls, Bedwin's, Mr. Frankie, Tibbs Frankie chains). Calorie note: the egg-paratha base alone adds ~250 kcal before fillings.

| # | `id` | `name` | `dietTypes` | Default serving |
|---|------|--------|-------------|-----------------|
| 413 | `kathi-roll-egg-only` | Egg Kathi Roll (Kolkata style, 1 egg) | egg | 1 roll (~180g) |
| 414 | `kathi-roll-chicken-egg` | Chicken + Egg Kathi Roll | nonveg | 1 roll (~220g) |
| 415 | `kathi-roll-paneer-egg` | Paneer + Egg Kathi Roll | egg,veg | 1 roll (~220g) |
| 416 | `tibbs-frankie-aloo` | Tibbs Frankie — Aloo (Classic) | veg | 1 roll (~180g) |
| 417 | `tibbs-frankie-paneer` | Tibbs Frankie — Paneer | veg | 1 roll (~200g) |
| 418 | `tibbs-frankie-chicken` | Tibbs Frankie — Chicken | nonveg | 1 roll (~200g) |

---

## 🟢 BATCH L — P3 Standard · International Desserts & American Brunch (~16 items) *(NEW in v3.1)*

*Rationale: Churros stalls are now in virtually every mall in India. Crepes are sold at café chains and standalone stalls. American-style brunch (Pancakes, Avocado Toast, French Toast, Eggs Benedict) is the dominant weekend meal for urban young professionals — these items appear regularly in Indian café menus but have zero coverage in the database.*

---

### L1 · Churros & Crepes
**Category:** `sweet-mithai` | **Subcategory:** `international-dessert` | **Region:** `pan-indian`

| # | `id` | `name` | `dietTypes` | Default serving |
|---|------|--------|-------------|-----------------|
| 419 | `churros-plain-6pc` | Churros (Plain, 6 pcs) | veg | 1 serving (6 pcs ~120g); ~480 kcal — high fat |
| 420 | `churros-chocolate-dip-6pc` | Churros with Chocolate Dip (6 pcs) | veg | 1 serving (6 pcs + 30g dip ~150g) |
| 421 | `crepe-sweet-nutella-banana` | Sweet Crepe — Nutella + Banana | veg | 1 crepe (~180g) |
| 422 | `crepe-sweet-strawberry-cream` | Sweet Crepe — Strawberry + Cream | veg | 1 crepe (~170g) |
| 423 | `crepe-savoury-cheese-mushroom` | Savoury Crepe — Cheese + Mushroom | veg | 1 crepe (~180g) |
| 424 | `crepe-savoury-chicken-pesto` | Savoury Crepe — Chicken + Pesto | nonveg | 1 crepe (~200g) |

---

### L2 · American Brunch Staples (Café Style)
**Category:** `breakfast` | **Subcategory:** `brunch-item` | **Region:** `pan-indian`

> **Note for agents:** These are served at cafés like Social, Smoke House Deli, The Bombay Canteen, and hundreds of independent brunch spots across India. Source `USDA` for plain versions, `curated-estimate` for loaded café versions. `containsRootVeg: false` for most items (check onion in hash browns). `isRecipe: true`.

| # | `id` | `name` | `dietTypes` | Key note | Default serving |
|---|------|--------|-------------|---------|-----------------|
| 425 | `pancakes-plain-3pc` | Plain Pancakes (3 pcs, café style) | veg | ~300 kcal base before toppings | 1 plate (3 pcs ~150g) |
| 426 | `pancakes-blueberry-3pc` | Blueberry Pancakes (3 pcs) | veg | ~340 kcal | 1 plate (3 pcs ~170g) |
| 427 | `pancakes-chocolate-chip-3pc` | Chocolate Chip Pancakes (3 pcs) | veg | ~380 kcal | 1 plate (3 pcs ~175g) |
| 428 | `french-toast-2slice` | French Toast (2 slices, with maple syrup) | egg | ~380 kcal; popular brunch item | 1 plate (2 slices ~160g) |
| 429 | `eggs-benedict-2pc` | Eggs Benedict (2 eggs, hollandaise, muffin) | egg | ~480 kcal; high fat from hollandaise | 1 plate (~250g) |
| 430 | `avocado-toast-cafe` | Avocado Toast (Café — multigrain, 1 egg) | egg | ~350 kcal; trending brunch item | 1 plate (~220g) |
| 431 | `avocado-toast-vegan` | Avocado Toast (Vegan — no egg) | vegan | ~280 kcal | 1 plate (~180g) |
| 432 | `english-breakfast-full` | Full English Breakfast (egg, sausage, beans, toast) | nonveg | ~650 kcal; high protein | 1 plate (~450g); confidence `low` |
| 433 | `granola-parfait-yogurt` | Granola Parfait with Greek Yogurt & Berries | veg | ~320 kcal; high protein from yogurt | 1 glass (~250g) |
| 434 | `breakfast-burrito-egg-cheese` | Breakfast Burrito (Egg + Cheese + Salsa) | egg | ~420 kcal | 1 wrap (~250g) |

---

## 🟡 BATCH M — P2 Medium · Plant-Based Meat & Vegan Alternatives (~12 items) *(NEW in v3.1)*

*Rationale: India's plant-based meat market is growing at 40%+ CAGR (2023–26). Brands like Good Dot (backed by Mukesh Ambani's associate), Imagine Meats (Virat Kohli + Anushka Sharma venture), and Evo Foods are actively sold on Swiggy and Blinkit. These are critical for the veg/vegan gym-goer who wants meat-like protein density without animal products.*

**Category:** `supplement` | **Subcategory:** `plant-based-meat` | **Region:** `pan-indian`

> **Note for agents:** Plant-based meat has substantially different macros from actual meat — typically lower protein, higher carbs, higher sodium than equivalent animal products. Always note this in `notes` field. Source: `FSSAI-label` where brand data available, `curated-estimate` otherwise. `isProcessed: true` for all plant-based meats. Tag `vegan`, `high-protein`, `high-sodium`.

| # | `id` | `name` | `dietTypes` | Per 100g macros | Default serving |
|---|------|--------|-------------|-----------------|-----------------|
| 435 | `gooddot-mutton-keema-dry` | Good Dot Mutton Keema (Plant-Based, dry) | vegan | ~300 kcal, 28g P, 22g C, 11g F | 1 portion (dry, ~50g) |
| 436 | `gooddot-chicken-chunks-dry` | Good Dot Chicken Chunks (Plant-Based, dry) | vegan | ~280 kcal, 30g P, 20g C, 9g F | 1 portion (dry, ~50g) |
| 437 | `imagine-meats-seekh-kebab` | Imagine Meats Plant-Based Seekh Kebab (2 pcs) | vegan | ~220 kcal/100g, 18g P | 1 serving (2 pcs ~100g) |
| 438 | `imagine-meats-chicken-nuggets` | Imagine Meats Plant-Based Chicken Nuggets (4 pcs) | vegan | ~200 kcal/100g, 15g P | 1 serving (4 pcs ~100g) |
| 439 | `evo-foods-plant-egg-liquid` | Evo Foods Plant Egg (Liquid, scrambled) | vegan | ~80 kcal/100g, 6g P (lower than real egg) | 1 serving (~100ml) |
| 440 | `beyond-meat-burger-patty` | Beyond Meat Burger Patty (1 patty) | vegan | ~250 kcal/patty, 20g P, 9g C, 18g F | 1 patty (~113g); `source: FSSAI-label` |
| 441 | `oatmilk-goodmylk-250ml` | GoodMylk Oat Milk (250ml, unsweetened) | vegan | ~45 kcal/100ml, 1g P | 1 glass (250ml); `source: FSSAI-label` |
| 442 | `sofit-soy-milk-200ml` | Sofit Soy Milk (200ml, plain) | vegan | ~50 kcal/100ml, 3.3g P | 1 pack (200ml); `source: FSSAI-label` |
| 443 | `alpro-almond-milk-250ml` | Alpro Almond Milk (250ml, unsweetened) | vegan | ~13 kcal/100ml, 0.5g P | 1 glass (250ml); `source: FSSAI-label` |
| 444 | `urban-platter-jackfruit-pulled` | Urban Platter Raw Jackfruit (Pulled, veg "pulled pork") | vegan | ~95 kcal/100g, 1.5g P | 1 portion (~150g) |
| 445 | `vegetarian-sausage-veg` | Vegetarian Sausage / Veg Frank (Processed, Generic) | veg | ~200 kcal/100g, 12g P | 1 sausage (~60g) |
| 446 | `vegan-cheese-slice-cashew` | Vegan Cashew Cheese Slice (Generic) | vegan | ~320 kcal/100g, 5g P | 1 slice (~25g) |

---

## 🟠 BATCH N — P1 High · Traditional Indian Cooling Drinks & Festival Beverages (~14 items) *(NEW in v3.1)*

*Rationale: These are daily or weekly beverages for tens of millions of Indians — consumed at home, roadside stalls, festivals, and weddings. None of them existed anywhere in the v3.0 database. A fitness app user in North India in summer will drink Aam Panna daily; a South Indian user will have Nannari Sharbat or Rose Milk. A Holi-celebrating user will drink Thandai. These are not niche — they are mainstream.*

**Category:** `drink` | **Subcategory:** `traditional-indian-drink` / `cooling-drink` | **Region:** `pan-indian` / `north` / `south`

> **Note for agents:** Many of these have variable sugar content (homemade vs. shop-bought). Use medium confidence. Add `isFastingFood: false` by default; `thandai` and `sattu` variants may be tagged for specific fasting types. Source `IFCT-2017` where base ingredients are documented, `healthifyme` for composed drink estimates. Tag `anytime`, `cooling` (new tag — add to tag taxonomy).

| # | `id` | `name` | `dietTypes` | Region | Key calorie note | Default serving |
|---|------|--------|-------------|--------|-----------------|-----------------|
| 447 | `aam-panna-glass` | Aam Panna (Green Mango Drink, sweetened) | vegan | north | ~80 kcal/glass; classic summer cooling drink | 1 glass (200ml) |
| 448 | `jaljeera-glass` | Jaljeera (Cumin-Lemon Water) | vegan | north | ~45 kcal/glass; minimal sugar | 1 glass (200ml) |
| 449 | `shikanji-glass` | Shikanji (Indian Lemonade with Spices) | vegan | north | ~60 kcal/glass (sugared) | 1 glass (200ml) |
| 450 | `thandai-glass` | Thandai (Holi drink — milk, nuts, spices) | veg | north | ~180 kcal/glass; calorie-dense; Holi staple | 1 glass (200ml) |
| 451 | `thandai-bhang-glass` | Thandai with Bhang (Holi, cannabis-infused) | veg | north | ~200 kcal/glass; `notes: "Bhang (cannabis) version; seasonal — Holi"` | 1 glass (200ml) |
| 452 | `nannari-sharbat-glass` | Nannari / Sarsaparilla Sharbat | vegan | south | ~90 kcal/glass; popular cooling drink in TN/Karnataka | 1 glass (200ml) |
| 453 | `rose-milk-south` | Rose Milk (South Indian café style) | veg | south | ~120 kcal/glass; rose syrup + cold milk; Tamil Nadu staple | 1 glass (200ml) |
| 454 | `badam-milk-warm` | Badam Milk (Warm Almond Milk, sweetened) | veg | north/west | ~160 kcal/glass; high fat from almonds; before-bed drink | 1 glass (200ml) |
| 455 | `khus-sharbat-glass` | Khus Sharbat (Vetiver Syrup Drink) | vegan | north | ~75 kcal/glass; earthy cooling drink | 1 glass (200ml) |
| 456 | `imli-panna-glass` | Imli Panna (Tamarind Cooler) | vegan | pan-indian | ~60 kcal/glass | 1 glass (200ml) |
| 457 | `bael-sharbat-glass` | Bael / Bel Fruit Sharbat (Wood Apple Drink) | vegan | north/east | ~90 kcal/glass; digestive; popular in Bihar/UP summers | 1 glass (200ml) |
| 458 | `sugarcane-juice-glass` | Sugarcane Juice (Ganna Juice, fresh) | vegan | pan-indian | ~83 kcal/100ml; high GI but electrolyte-rich | 1 glass (250ml) |
| 459 | `roohafza-milk-glass` | Rooh Afza with Milk (Full glass) | veg | north | ~170 kcal/glass; rose syrup + milk | 1 glass (200ml) |
| 460 | `gulkand-milk-glass` | Gulkand Milk (Rose Petal Preserve + Milk) | veg | pan-indian | ~150 kcal/glass; digestive; cooling | 1 glass (200ml) |

---

## 🟢 BATCH O — P3 Standard · Rajasthani, Marwari & Northeast Indian Regional Cuisines (~12 items) *(NEW in v3.1)*

*Rationale: v3.0 had good coverage of South Indian, Bengali, and Goan cuisines but virtually nothing from Rajasthan (the source of Marwari vegetarian cuisine, which is the dominant restaurant cuisine in Mumbai's veg-only category) or from Northeast India (Manipuri, Assamese, Nagaland cuisines, which are becoming mainstream in Delhi and Mumbai via NE Indian restaurants). Dal Baati Churma is among the most Googled Indian recipes globally.*

---

### O1 · Rajasthani & Marwari Dishes
**Category:** `rice-dish` / `dal-legume` / `non-veg` | **Region:** `north` | **Source:** `healthifyme` / `curated-estimate`

| # | `id` | `name` | Category | `dietTypes` | Key note | Default serving |
|---|------|--------|----------|-------------|---------|-----------------|
| 461 | `dal-baati-churma-plate` | Dal Baati Churma (Full Plate — 2 baati, dal, churma) | dal-legume | veg | Rajasthan's signature dish; ~750 kcal per plate; calorie-dense | 1 plate (2 baati + dal + churma ~450g) |
| 462 | `gatte-ki-sabzi` | Gatte ki Sabzi (Chickpea Flour Dumplings in Gravy) | sabzi-veg | veg | ~150 kcal/100g; jain-friendly | 1 katori (~150g) |
| 463 | `laal-maas` | Laal Maas (Rajasthani Spicy Mutton Curry) | non-veg | nonveg | ~180 kcal/100g; fiery red chilli curry | 1 katori (~150g) |
| 464 | `ker-sangri-sabzi` | Ker Sangri (Desert Bean & Berry Sabzi) | sabzi-veg | vegan | ~100 kcal/100g; jain-friendly; unique desert vegetable | 1 katori (~150g) |
| 465 | `bajre-ki-raab` | Bajre ki Raab (Pearl Millet Porridge, Rajasthani) | millet | veg | ~65 kcal/100g; winter comfort drink | 1 glass (250ml) |
| 466 | `pyaaz-kachori-rajasthani` | Pyaaz Kachori (Rajasthani Onion-filled Pastry) | snack-street | veg | ~350 kcal each; hugely popular; containsRootVeg: true | 1 piece (~100g) |

---

### O2 · Northeast Indian Dishes
**Category:** `non-veg` / `breakfast` | **Region:** `east` | **Source:** `curated-estimate`

> **Note for agents:** NE Indian cuisine has exploded in Delhi, Bangalore, and Mumbai via restaurants like NE Kitchen, Yeti, and many cloud kitchens. Confidence `low` (limited published data). All NE Indian dishes `containsRootVeg: false` unless specified (NE Indian cuisine uses minimal root vegetables). Tag `east`.

| # | `id` | `name` | Category | `dietTypes` | Default serving |
|---|------|--------|----------|-------------|-----------------|
| 467 | `manipuri-singju-salad` | Singju (Manipuri Raw Vegetable Salad) | snack-street | vegan | 1 plate (~200g); fermented fish optional — use vegan version |
| 468 | `assamese-duck-curry` | Assamese Duck Curry (Hanh'r Mangkho) | non-veg | nonveg | 1 katori (~180g) |
| 469 | `nagaland-smoked-pork-bamboo` | Smoked Pork with Bamboo Shoot (Nagaland) | non-veg | nonveg | 1 katori (~180g); distinctive smoky flavour |
| 470 | `mizo-bai-stew` | Bai (Mizo Pork & Leafy Veg Stew) | non-veg | nonveg | 1 bowl (~250g) |
| 471 | `assamese-fish-tenga` | Fish Tenga (Assamese Sour Fish Curry) | non-veg | nonveg | 1 katori (~180g) |
| 472 | `momos-tibetan-buff-steamed` | Tibetan / Buff Momo (Steamed, 6 pcs) | snack-street | nonveg | 1 plate (6 pcs ~180g); common in Himalayan belt |

---

## 📋 Implementation Checklist for Agents

### Phase A — Data Entry (Batches A1–A6)
- [ ] Add 78 Batch A entries to `indianFoods.js` — QSR chains + biryani variants + BBK
- [ ] Add `qsr-pizza`, `qsr-burger`, `qsr-chicken`, `biryani-chain` to `foodCategories.js` subcategory list
- [ ] Add `handi` serving type to `servingTypes.js` (500g, used for BBK biryani)
- [ ] Cross-reference Domino's / McD / KFC official FSSAI-label data from brand websites
- [ ] Set `isProcessed: true` for all QSR/packaged entries
- [ ] Set `cookingOilNote` on all restaurant-style curries and biryani dishes
- [ ] Run validation script: unique IDs, macros in sane range, at least 1 serving defined

### Phase B — Data Entry (Batches B1–B6)
- [ ] Add 65 Batch B entries — chai chains + Indo-Chinese + Subway + Extended North Indian
- [ ] Add `chai-shop` subcategory to `drink` category definition
- [ ] Add `indo-chinese-starter` subcategory to `snack-street`
- [ ] Source Subway India official nutrition data (published on their website)
- [ ] Tag all chai entries with `restaurant-common`; roadside variants with `budget-friendly`

### Phase C — Data Entry (Batches C1–C5)
- [ ] Add 55 Batch C entries — café chains + bakeries + ice cream
- [ ] Add `cafe-hot`, `cafe-cold`, `cafe-food`, `bakery-chain`, `dessert-chain` subcategories
- [ ] Source Starbucks India nutrition data (published on website, confidence: high)
- [ ] Tag all Frappuccinos with `high-sugar`

### Phase D — Data Entry (Batches D1–D7)
- [ ] Add 57 Batch D entries — global cuisines + extended regional Indian + extended Middle Eastern
- [ ] Source generic dish macros from USDA for sushi, ramen, pad thai, bibimbap
- [ ] Use `healthifyme` cross-reference for Indian restaurant versions of global dishes
- [ ] Set region correctly: `south` for Chettinad/Kerala, `east` for Bengali/Tibetan, `pan-indian` for global cuisines
- [ ] Set `containsRootVeg: true` for Greek Salad (contains red onion), Turkish Doner (contains onion)

### Phase E — Data Entry (Batches E1–E7)
- [ ] Add 35 Batch E entries — alcoholic beverages + packaged soft drinks + coverage items
- [ ] For all alcoholic entries: calculate `alcoholG` accurately (serving_ml × ABV × 0.789)
- [ ] Add `alcoholic` subcategory to drink category
- [ ] Ensure alcohol entries appear in search results for: "beer", "wine", "whisky", "rum", "cocktail", "vodka", "gin"
- [ ] Set `confidence: "low"` for BBQ Nation aggregate plates

### Phase F — Data Entry (Batch F — Italian) *(NEW)*
- [ ] Add 22 Batch F entries — pasta, risotto, Italian starters, Italian desserts
- [ ] Add `italian-pasta` subcategory to `rice-dish` category definition
- [ ] Set `cookingOilNote` on all pasta dishes (olive oil base)
- [ ] Set `containsRootVeg: true` for any pasta containing garlic/onion (most do — add note in `containsRootVeg` tagging)
- [ ] Source Pizza Express India nutrition data from their website (`chainName: 'Pizza Express'`, `source: FSSAI-label`)

### Phase G — Data Entry (Batch G — Vietnamese & SE Asian) *(NEW)*
- [ ] Add 18 Batch G entries — Vietnamese, Indonesian, Malaysian, Singaporean
- [ ] Add `vietnamese-noodle` subcategory to `rice-dish`
- [ ] Source pho/pad thai macros from USDA FoodData Central
- [ ] Set all pho entries with `isRecipe: true`, `cookingOilNote` for broth-based dishes
- [ ] Note: Vietnamese fresh spring rolls (Gỏi Cuốn) are raw/assembled — `state: raw`, very low calorie (~60 kcal per 2 rolls)

### Phase H — Data Entry (Batch H — Greek, Mediterranean & Turkish) *(NEW)*
- [ ] Add 16 Batch H entries — Greek, Turkish, Levantine
- [ ] Source Greek salad macros from USDA; tzatziki from USDA
- [ ] Set `containsRootVeg: true` for: Greek Salad (red onion), Fattoush (onion), Turkish Doner (onion)
- [ ] Add `international-dessert` subcategory to `sweet-mithai` for Baklava

### Phase I — Data Entry (Batch I — Bubble Tea & Trending Drinks) *(NEW — CRITICAL)*
- [ ] Add 20 Batch I entries — boba tea, matcha, dalgona, specialty café drinks, kombucha
- [ ] Add `bubble-tea` and `matcha-drink` subcategories to `drink` category definition
- [ ] **Critical:** Add tapioca pearl add-on entry (`boba-tapioca-pearls-only`) so users can customize their boba order
- [ ] Tag all boba entries with `high-sugar`; add `calorie-dense` for brown sugar boba (~350 kcal)
- [ ] Note in `cookingOilNote` equivalent field: "Boba shops vary sugar levels (0%/25%/50%/75%/100%). Default uses 50% sugar — adjust custom grams accordingly."
- [ ] Add `cooling` to the tag taxonomy

### Phase J — Data Entry (Batch J — Health Chains & Fitness Foods) *(NEW — CRITICAL)*
- [ ] Add 22 Batch J entries — EatFit, salad chains, smoothie bowls, healthy wraps
- [ ] Source EatFit nutrition from cult.fit app macro disclosure (confidence: high for disclosed items)
- [ ] Tag acai bowl / smoothie bowl entries with both `breakfast` AND `calorie-dense` — critical calorie trap
- [ ] Add `health-salad` and `health-bowl` subcategories

### Phase K — Data Entry (Batch K — Additional Chains & Cloud Kitchens) *(NEW — CRITICAL)*
- [ ] Add 28 Batch K entries — Popeyes, Wendy's, Box8, The Good Bowl, kathi rolls
- [ ] Source Popeyes India nutrition from popeyes.in (`confidence: "high"`)
- [ ] Source Wendy's India nutrition from wendysindia.com (`confidence: "high"`)
- [ ] Add `cloud-kitchen` and `qsr-fried-chicken` subcategories
- [ ] Add `qsr-indian` subcategory entries for Tibbs Frankie and kathi rolls

### Phase L — Data Entry (Batch L — International Desserts & Brunch) *(NEW)*
- [ ] Add 16 Batch L entries — churros, crepes, pancakes, avocado toast, eggs benedict
- [ ] Add `brunch-item` subcategory to `snack-street`
- [ ] Source pancake/French toast macros from USDA; café versions from `curated-estimate` (more butter/sugar)
- [ ] Tag avocado toast vegan version with `vegan`; egg version with `egg`
- [ ] Note: Eggs Benedict has very high fat from hollandaise sauce — flag `high-fat` and `calorie-dense`

### Phase M — Data Entry (Batch M — Plant-Based Meat) *(NEW)*
- [ ] Add 12 Batch M entries — Good Dot, Imagine Meats, Evo Foods, oat milk, soy milk, almond milk
- [ ] Source Good Dot nutrition from gooddot.in (`source: FSSAI-label`, `confidence: "high"`)
- [ ] Source Imagine Meats nutrition from brand website (`source: FSSAI-label`)
- [ ] Source Beyond Meat nutrition from official site (`source: FSSAI-label`)
- [ ] Add `plant-based-meat` subcategory to `supplement`
- [ ] Critical note in `notes` field for all plant-based meats: "Higher sodium than equivalent animal protein; check label"

### Phase N — Data Entry (Batch N — Traditional Indian Drinks) *(NEW — CRITICAL)*
- [ ] Add 14 Batch N entries — Thandai, Aam Panna, Jaljeera, Shikanji, regional sharbats
- [ ] Add `traditional-indian-drink` and `cooling-drink` subcategories to `drink`
- [ ] Add `cooling` tag to the tag taxonomy in `indianFoods.js` documentation header
- [ ] Flag Thandai Bhang entry with appropriate notes: `notes: "Bhang (cannabis-infused) version — seasonal Holi drink. Calorie estimate only."`
- [ ] Source Aam Panna, Jaljeera, Shikanji from `IFCT-2017` base ingredients; composed calorie from `healthifyme`

### Phase O — Data Entry (Batch O — Rajasthani & NE Indian) *(NEW)*
- [ ] Add 12 Batch O entries — Rajasthani cuisine + NE Indian cuisine
- [ ] Source Dal Baati Churma macros from `healthifyme` (multiple source cross-reference required)
- [ ] Set `confidence: "low"` for all NE Indian dishes (limited published nutrition data)
- [ ] Set `containsRootVeg: false` for most NE Indian dishes (verify per dish)
- [ ] Flag Pyaaz Kachori with `containsRootVeg: true` (onion-filled)

### Phase P — Data Entry (Batch P — Instant Noodles & RTE) *(NEW — CRITICAL)*
- [ ] Add 14 Batch P entries — Maggi, YiPPee, Cup Noodles, MTR Ready-to-Eat packs
- [ ] Source Maggi, YiPPee, Nissin nutrition from FSSAI-label on packet (`confidence: "high"`)
- [ ] Tag ALL instant noodles with `high-sodium`, `isProcessed: true`, `high-carb`
- [ ] Set `isGlutenFree: false` for all maida-based noodles; note atta variants separately
- [ ] Add `instant-noodle` and `ready-to-eat` subcategories to `packaged-food`

### Phase Q — Data Entry (Batch Q — Dry Fruits, Nuts & Seeds) *(NEW — CRITICAL)*
- [ ] Add 16 Batch Q entries — almonds, cashews, peanuts, seeds, nut butters
- [ ] Source from USDA (high confidence for raw nuts); FSSAI-label for branded items (Happilo, etc.)
- [ ] Set `isProcessed: false` for raw nuts; `true` for roasted/salted variants and nut butters
- [ ] Set `isFastingFood: true` for plain nuts (almonds, cashews — common navratri/ekadashi foods)
- [ ] Use `handful` serving (30g) as default; also add `tbsp` for nut butters
- [ ] Tag as `muscle-building`, `very-high-protein` (for peanuts, pumpkin seeds), `high-fat`, `snack`

### Phase R — Data Entry (Batch R — Protein Bars & Health Snacks) *(NEW — CRITICAL)*
- [ ] Add 10 Batch R entries — RiteBite, Yoga Bar, HYP, MuscleBlaze bars, granola, makhana
- [ ] Source from FSSAI-label on packaging (`confidence: "high"` for all branded items)
- [ ] Add `protein-bar` subcategory to `supplement` category definition in `foodCategories.js`
- [ ] Set `isProcessed: true` for all bars; `false` for plain roasted makhana
- [ ] Set `containsRootVeg: false` for all items in this batch

### Cross-Validation Steps (ALL Phases)
- [ ] **Duplicate check:** Before inserting any entry, run `grep -cE "id: '${proposedId}'" indianFoods.js` — if >0, skip or merge
- [ ] **Schema completeness:** Every entry MUST have ALL fields from v2.2 schema (see GAP 11 for full field list). Use `null`/`0` for unknown micronutrients.
- [ ] **searchTerms generation:** Add at least 3 `searchTerms` per entry: brand abbreviation, common misspelling, colloquial name (e.g., `['maggi', 'maggie', 'instant noodles', 'two minute']`)
- [ ] **hindiName:** Add `hindiName` for all Indian dishes. Skip for international brands (Starbucks, etc.).
- [ ] **per100g validation:** All macro values must sum correctly: `calories ≈ (protein × 4) + (carbs × 4) + (fat × 9) + (alcohol × 7)` — tolerance ±15%

---

## 🔧 Schema Additions Required

### Original v3.0 Chain/QSR Fields
```js
// Optional — only for chain/QSR items
chainName: 'Dominos',               // brand name for display/search
chainItemCode: 'DOM-PEP-PAN-REG',   // optional internal SKU
menuCategory: 'Veg Pizzas',         // as displayed on the chain's official menu
nutritionSource: 'https://...',     // URL to official nutrition page (for auditability)
sizeVariant: 'Regular',             // 'Regular' | 'Medium' | 'Large' | 'Small' | 'Tall' | 'Grande' | 'Single' | 'Double'
```

### New v3.1 Fields
```js
// For bubble tea entries only
bobaSugarLevel: '50%',              // '0%' | '25%' | '50%' | '75%' | '100%' — default sugar level used in calorie calculation
bobaMilkType: 'dairy',              // 'dairy' | 'oat' | 'none' — base milk type

// For alcohol entries (already in v3.0 but clarified here)
alcoholG: 13,                       // ethanol grams per serving; calories from alcohol = alcoholG × 7

// For cloud kitchen entries
cloudKitchenBrand: 'EatFit',        // 'EatFit' | 'Box8' | 'The Good Bowl' | 'Behrouz' | 'BBK' | 'Rebel Foods' etc.
```

### New Serving Type to Add to `servingTypes.js`

| Serving ID | Label | Default Grams | Used For |
|-----------|-------|:---:|----------|
| `handi` | 1 handi | 500 | Biryani By Kilo individual clay pot serving |
| `roll` | 1 roll | 200 | Kathi rolls, Frankie, Shawarma, Banh Mi |
| `boba-cup` | 1 boba cup | 400 | Standard bubble tea cup (includes pearls) |
| `skewer` | 1 skewer | 40 | Satay, Souvlaki, Seekh Kebab (per stick) |

### Tag Taxonomy Additions (v3.1)
Add these tags to the standardized vocabulary:

**New meal/experience tags:** `brunch` `cooling` `festive` `street-cart`

**New cuisine tags:** `italian` `vietnamese` `greek` `turkish` `mediterranean` `boba` `southeast-asian` `northeast-indian` `rajasthani`

**New nutrition profile tags:** `high-sodium` (for plant-based meats, QSR items) `omega-3` (for fatty fish, poke bowls)

---

## 📊 Updated Database Targets

| Version | Core Categories | Total Items |
|---------|----------------|-------------|
| v2.2 (original Indian DB) | 20 | ~350 |
| v2.2 actual (`indianFoods.js` today) | 20 | **663** (verified by grep) |
| v3.0 (first extension — chains, global cuisines) | 20 + subcategories | ~635 proposed |
| **v3.1 (this update — gap fills + new batches P/Q/R)** | **20 + expanded subcategories** | **~870** |

> ⚠️ **Actual current count:** `indianFoods.js` already contains **663 entries** (not ~350 as the original v2.2 doc assumed). The v3.0 "~635" target was based on the v2.2 assumption of ~350 base items. Since the actual base is 663, the real grand total after all batches will be **~663 + 470 (v3.0/v3.1) + 40 (new P/Q/R) ≈ ~1,170 items** — but subtract ~10 duplicates = **~1,160 items**.

**New items added in v3.1 (beyond v3.0):**
- Batch A gap fill (BBK): 3 items
- Batch D gap fill (Extended Middle Eastern): 8 items
- Batch F (Italian): ~22 items
- Batch G (Vietnamese & SE Asian): ~18 items
- Batch H (Greek, Mediterranean & Turkish): ~16 items
- Batch I (Bubble Tea + Matcha + Trending Drinks): ~20 items
- Batch J (Health Chains, Salad Bowls, EatFit): ~22 items
- Batch K (Popeyes, Wendy's, Box8, BBK, Kathi Rolls): ~32 items (corrected from ~28)
- Batch L (International Desserts & Brunch): ~16 items
- Batch M (Plant-Based Meat & Alternatives): ~12 items
- Batch N (Traditional Indian Cooling Drinks): ~14 + 5 gap fills = ~19 items
- Batch O (Rajasthani & NE Indian): ~12 items
- **Batch P (Instant Noodles & Ready-to-Eat): ~14 items** *(NEW — GAP 2 fix)*
- **Batch Q (Dry Fruits, Nuts & Seeds): ~16 items** *(NEW — GAP 3 fix)*
- **Batch R (Protein Bars & Health Snacks): ~10 items** *(NEW — GAP 4 fix)*
- Batch B6 gap fills (Bhurji, Raita): ~5 items
- **Total new in v3.1: ~250 items** (corrected from ~191)

---

## ✅ Validation Rules for New Items

All existing validation rules from `TODO-indian-food-db.md` apply. Additional rules for v3.0 extensions:

1. **Chain items** (`chainName` set) → `source` must be `FSSAI-label` or `curated-estimate`; never leave `source` blank
2. **Alcoholic drinks** → must have `alcoholG > 0`; calories must account for alcohol (alcoholG × 7 kcal)
3. **Size variants** (e.g., Medium vs Large fries) → must have different IDs; suffix ID with size: `mcd-french-fries-medium`, `mcd-french-fries-large`
4. **Aggregate plates** (BBQ Nation, thalis) → `confidence: "low"`, `isRecipe: true`, must include `cookingOilNote`
5. **All QSR/packaged items** → `isProcessed: true`
6. **Café drinks** → `itemType: "drink"`, `category: "drink"`, appropriate subcategory

Additional rules added in v3.1:

7. **Bubble tea entries** → must include `bobaSugarLevel` field; calories must account for tapioca pearls in base calculation; tag `high-sugar`
8. **Plant-based meat entries** → must have `notes` warning about high sodium; `isProcessed: true`; do NOT assign `confidence: "high"` unless official FSSAI-label data is available
9. **Vietnamese pho entries** → model as broth-based; per100g calories should reflect the full bowl (broth + noodles + protein), not just noodles dry — use `state: cooked`
10. **Boba tea tapioca pearls** → the `boba-tapioca-pearls-only` entry must be modeled as cooked weight (~90g cooked = 30g dry); this is the standard add-on for custom orders
11. **Cloud kitchen entries** → `cloudKitchenBrand` field must be set; `isRecipe: true`; `cookingOilNote` required for all curry/rice dishes
12. **Traditional Indian drinks** → always model at "standard sweetness" (50% sugar / 1 tsp per glass); document in `notes` field that calorie varies by sugar level
13. **NE Indian dishes** → `confidence` must be `"low"` for all Batch O items unless official source data exists; flag in `notes`

---

*This file is intended to be fed to AI agents for automated data entry into `src/data/foods/indianFoods.js`. All items follow the v2.2 schema defined in `TODO-indian-food-db.md`.*