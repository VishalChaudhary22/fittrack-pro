# TODO — Food Database Expansion Strategy

> **Version:** 3.0 — Updated with codebase audit corrections
> **Scope:** Data sources, ingestion rules, and population targets only.
> **Current count:** ~170–180 entries · **Target:** 350+ entries

---

> [!CAUTION]
> ## Schema Gaps Identified During Review
>
> The original doc claimed "No schema changes needed." This is **incorrect**. The following
> fields referenced in this document **do not exist** in the Supabase `foods` table and will
> require migrations before the corresponding ingestion rules can be executed:
>
> | Field | Referenced In | Status |
> |-------|--------------|--------|
> | `barcode` | Barcode System section, OFF ingestion | ❌ Column does not exist |
> | `lastVerified` | Rule 3 — Data Freshness | ❌ Column does not exist (use `notes` as workaround) |
> | `brand` | OFF ingestion, supplement entries | ⚠️ Exists in `indianFoods.js` (Batch 7+) but NOT in Supabase schema |
> | `allergens` | Newer food entries | ⚠️ Exists in `indianFoods.js` (Batch 7+) but NOT in Supabase schema |
>
> Additionally, the `source` enum in Supabase only allows: `IFCT-2017`, `FSSAI-label`, `USDA`,
> `healthifyme`, `curated-estimate`, `brand-nutrition`. Values like `off-india`, `indb`, and
> `fatsecret` used throughout this document are **not valid** and will require an
> `ALTER TYPE source_enum ADD VALUE` migration.

---

## Context

The food database infrastructure (Supabase tables, categories, serving types, search utilities) is
already built and running. This document is exclusively about **where to get data from** and **how
to ingest it correctly** into the existing system.

> [!IMPORTANT]
> ### Dual-Insert Requirement
>
> The app uses a **fallback architecture**: the `useFoodCache` hook (in
> [`useFoodCache.js`](file:///Users/ample/Desktop/fittrack-pro/src/hooks/useFoodCache.js)) tries
> Supabase first, then falls back to the local
> [`indianFoods.js`](file:///Users/ample/Desktop/fittrack-pro/src/data/foods/indianFoods.js) file.
> **Every new food entry must be added to BOTH locations** — a Supabase migration SQL file AND
> the local `indianFoods.js` — or offline/fallback users will see incomplete data.

> [!WARNING]
> ### Orphaned Inline Food Database
>
> [`DietPage.jsx`](file:///Users/ample/Desktop/fittrack-pro/Dietpage.jsx) (69KB, root level)
> contains a **separate inline food database** of ~60 entries that is completely independent
> from `indianFoods.js`. This appears to be an older prototype. Any expansion work should
> determine whether this file is still in use and, if so, either deprecate it or keep it in
> sync. Ignoring it risks users seeing different nutritional data depending on which code path
> they hit.

---

## Per-Category Gap Table

Before any expansion work begins, understand where the actual deficit is.
Use this table to prioritise ingestion efforts.

| # | Category | Current (approx) | Target | Gap | Priority |
|:-:|----------|:----------------:|:------:|:---:|:--------:|
| 1 | `grain-cereal` | 8 | 12 | 4 | Medium |
| 2 | `roti-bread` | 10 | 15 | 5 | Medium |
| 3 | `rice-dish` | 8 | 12 | 4 | Medium |
| 4 | `dal-legume` | 14 | 22 | 8 | High |
| 5 | `sabzi-veg` | 16 | 25 | 9 | High |
| 6 | `non-veg` | 12 | 20 | 8 | High |
| 7 | `egg` | 5 | 8 | 3 | Low |
| 8 | `dairy` | 12 | 20 | 8 | High |
| 9 | `breakfast` | 14 | 20 | 6 | Medium |
| 10 | `snack-street` | 14 | 22 | 8 | High |
| 11 | `sweet-mithai` | 6 | 15 | 9 | 🔴 Critical |
| 12 | `fruit` | 12 | 22 | 10 | 🔴 Critical |
| 13 | `drink` | 10 | 18 | 8 | High |
| 14 | `oil-fat` | 6 | 10 | 4 | Medium |
| 15 | `condiment` | 6 | 10 | 4 | Medium |
| 16 | `supplement` | 7 (generic only) | 43 | 36 | 🔴 Critical |
| 17 | `packaged-food` | 8 | 20 | 12 | 🔴 Critical |
| 18 | `millet` | 8 | 14 | 6 | High |
| 19 | `sprout-soy` | 6 | 12 | 6 | High |
| 20 | `fasting-food` | 6 | 10 | 4 | Medium |
| | **TOTAL** | **~170–180** | **~354** | **~174–184** | |

> [!WARNING]
> The per-category counts above were estimated in v2.0 and sum to ~207, but an audit of
> [`indianFoods.js`](file:///Users/ample/Desktop/fittrack-pro/src/data/foods/indianFoods.js)
> shows only **~170–180 actual entries**. The per-category numbers should be re-counted before
> starting expansion work — the real gap is likely **larger** than shown.

> [!WARNING]
> **Orphan category `curry`**: Batch 7 entries in `indianFoods.js` (e.g., `rte-mtr-dal-makhani-300g`)
> use `category: 'curry'`, but [`foodCategories.js`](file:///Users/ample/Desktop/fittrack-pro/src/data/foods/foodCategories.js)
> does **not define** a `curry` category. These entries will not appear in category-based browsing.
> They should be re-categorised to `dal-legume`, `sabzi-veg`, or `non-veg` as appropriate.

> The supplement category is the single largest gap (36 items).
> All 26 whey proteins and 10 mass gainer brand entries are already researched and documented
> in [`TODO-supplement-db.md`](file:///Users/ample/Desktop/fittrack-pro/docs/05-Development/Food%20Database/TODO-supplement-db.md)
> — refer to that file as the authoritative source for Phase 5.
> Do not re-research supplement data; just execute the insertions.

---

## Recommended Data Sources

---

### Source 1 — Open Food Facts India (OFF)

**Priority:** 🔴 Highest — use as the primary packaged food ingestion layer.

**Best for:**
- Indian packaged foods (FMCG)
- Branded products (biscuits, cereals, snacks, dairy)
- Barcode-indexed products
- Protein bars and health foods
- Beverages and energy drinks

**What is available per product:**
- Product name, brand, barcode
- Full ingredients list
- Nutrition label (per 100g and per serving)
- Macros: calories, protein, carbs, fat, fiber, sodium, sugar
- Product images
- FSSAI certification status (where tagged)
- Category tags

**Access:** `https://world.openfoodfacts.org/data` — full database dump available as CSV/JSON.
India-specific subset: filter by `countries_tags` containing `india` or `en:india`.

**Priority Brands to Ingest First:**

| Brand | Category | Why |
|-------|----------|-----|
| MuscleBlaze | Supplement / Packaged | India's #1 sports nutrition brand |
| The Whole Truth | Supplement / Packaged | Fast-growing clean-label brand |
| Yoga Bar | Packaged / Supplement | ITC brand, wide distribution |
| RiteBite | Packaged | Top protein bar brand in India |
| Pintola | Oil-fat / Packaged | Leading peanut butter brand |
| MyFitness | Oil-fat / Packaged | Most searched peanut butter on Amazon India |
| Alpino | Oil-fat / Packaged | Popular peanut butter brand |
| Epigamia | Dairy | Greek yogurt — growing fast |
| Amul | Dairy / Supplement | India's most trusted dairy brand |
| Britannia | Packaged | Marie biscuits, NutriChoice, cheese |
| Parle | Packaged | Parle-G, Monaco, Hide & Seek |
| ITC | Packaged | Sunfeast, Dark Fantasy, Bingo |
| Nestle | Packaged | Maggi, KitKat, Munch |
| Kellogg's | Grain-cereal | Corn Flakes, Muesli, Granola |
| Bagrry's | Grain-cereal | Oats, muesli — fitness segment |
| Quaker | Grain-cereal | Most sold oats brand in India |
| Slurrp Farm | Grain-cereal | Millet-based cereals, growing |
| Haldiram's | Snack-street | Most popular namkeen brand |
| Bikaji | Snack-street | Leading bhujia/namkeen brand |
| Bikanervala | Snack-street | Premium namkeen |
| Fast&Up | Supplement | Electrolytes, recovery drinks |
| Oziva | Supplement | Plant protein, vitamin gummies |
| Dabur | Packaged | Chyawanprash, honey, juices |
| Patanjali | Packaged | Growing Tier 2/3 market share |

**Ingestion rules:**
- Filter to products with at least `calories`, `protein`, `carbs`, and `fat` populated
- Skip products with `data_quality_errors` or `unknown` nutrition grade
- Map OFF category → your 20-category system (see Category Mapping table below)
- Map OFF `serving_size` → your serving types using the Indian Serving Mapper (see below)
- Populate `searchTerms` with brand abbreviations and common misspellings for every product
- ⚠️ `source` must use a valid enum value. `'off-india'` does **not** exist in the DB enum.
  Either add it via migration (`ALTER TYPE source_enum ADD VALUE 'off-india'`) or map to
  the closest existing value and note the real source in the `notes` field.
- Set `confidence: 'high'` for products with verified FSSAI tags
- Set `confidence: 'medium'` for all other OFF entries
- Set `isProcessed: true` for all packaged food entries by default

**OFF → FitTrack Category Mapping:**

| OFF Category Tag | FitTrack Category |
|-----------------|-------------------|
| `en:breakfast-cereals` | `grain-cereal` |
| `en:breads` | `roti-bread` |
| `en:biscuits-and-cakes` | `packaged-food` |
| `en:chips-and-crisps` | `snack-street` |
| `en:dairy-products` | `dairy` |
| `en:protein-supplements` | `supplement` |
| `en:peanut-butters` | `oil-fat` |
| `en:juices-and-nectars` | `drink` |
| `en:energy-drinks` | `drink` |
| `en:instant-noodles` | `packaged-food` |
| `en:confectioneries` | `sweet-mithai` |
| `en:frozen-foods` | `packaged-food` |

> [!NOTE]
> This mapping covers only 12 of the hundreds of OFF category tags. Any OFF product whose
> category tag does not match this table needs a **fallback rule**. Recommended default:
> map to `packaged-food` and flag for manual review. Products with no mappable category
> should be skipped rather than ingested with an incorrect category.

---

### Source 2 — Indian Nutrient Databank (INDB)

**Priority:** 🔴 High — best source for homemade and traditional Indian foods.

**Best for:**
- Regional home-cooked dishes
- Street foods
- Traditional recipes
- Dal and sabzi variants
- South Indian items

**Covers:**
- North Indian foods (rajma, chole, aloo dishes, parathas)
- South Indian foods (dosa, idli, sambar, rasam, appam, uttapam)
- Gujarati foods (dhokla, thepla, undhiyu)
- Punjabi foods (butter chicken, sarson da saag)
- Bengali foods (macher jhol, mishti doi)
- Maharashtrian foods (pav bhaji, vada pav, poha)
- Street foods (chaat, momos, kathi rolls)

**Data quality:** Research-grade. Better micronutrient depth than any API for Indian dishes.

**Ingestion rules:**
- Use as primary source for categories `dal-legume`, `sabzi-veg`, `breakfast`, `rice-dish`, `snack-street`
- Cross-reference calorie values with IFCT 2017 for raw ingredient cross-checks
- Add `region` tag based on dish origin (must be a valid `region_enum`: `pan-indian`, `north`, `south`, `east`, `west`, `imported`, `north-indian`)
- ⚠️ `source: 'indb'` does **not** exist in the DB enum. Use `'curated-estimate'` and add
  `"Source: INDB"` in the `notes` field, or add `'indb'` to the enum via migration.
- Set `confidence: 'high'`
- Homemade items should default to `state: 'cooked'`
- Add Hindi and regional names to `searchTerms` for every INDB entry

**Priority categories for INDB ingestion:**

| Category | Specific gaps to fill |
|----------|-----------------------|
| `dal-legume` | Panchmel dal, chana masala, rajma masala, sambhar (restaurant vs home), dal tadka |
| `sabzi-veg` | Aloo matar, jeera aloo, lauki sabzi, tinda sabzi, arbi fry, methi aloo, baingan fry |
| `sweet-mithai` | Motichoor ladoo, Mysore pak, kalakand, peda, rasgulla, chamcham, chenna poda |
| `breakfast` | Rava upma, pesarattu, akki roti, thalipeeth, set dosa, neer dosa, kande pohe |
| `rice-dish` | Bisi bele bath, tamarind rice, coconut rice, rajma chawal, kadala curry + rice |

---

### Source 3 — IFCT 2017 (Indian Food Composition Tables)

**Priority:** 🟡 Medium — use as enrichment and cross-reference, not primary ingestion.

**Best for:**
- Raw ingredients (uncooked grains, pulses, vegetables)
- Micronutrient values (iron, calcium, B12, D3, zinc)
- Validating calorie numbers from other sources
- Fruits and vegetables at raw weight

**How to use:**
- After any new food is added, check IFCT for its micronutrient profile
- Prioritise filling `vitaminB12` for all animal products (eggs, meat, dairy, fish)
- Prioritise filling `vitaminD` for fatty fish (tuna, salmon, mackerel, hilsa) and egg yolk
- Prioritise filling `iron` for: palak, rajma, chana, ragi, dates, meat
- Prioritise filling `calcium` for: dairy products, ragi, sesame, tofu
- Set `source: 'ifct-2017'` when using IFCT as the primary data reference

**INDB vs IFCT distinction — important:**
- IFCT = raw ingredient data (100g uncooked toor dal, raw chicken breast)
- INDB = prepared dish data (cooked dal, grilled chicken)
- Never mix the two without checking `state` field — a raw vs cooked mismatch causes calories to be off by 30–50%

---

### Source 4 — FSSAI Nutrition Disclosure PDFs (Restaurant & QSR Chains)

**Priority:** 🔴 High for restaurant chains — use before any third-party API.

**Why this source first:**
Under FSSAI regulations, all restaurant chains operating in India are legally required to publish
complete nutrition information. This means the data comes directly from the brand and is more
accurate and current than any third-party API (which can lag by months after menu changes).

**Access method:**
- Visit the brand's official India website → Nutrition / Health Information section
- Search `"[brand name] nutrition menu PDF India site:brand.com"` for downloadable PDFs
- FSSAI inspection reports are also public at `fssai.gov.in`

**Tier 1 — Self-maintained, always use FSSAI PDF:**

| Chain | Data Source URL Pattern |
|-------|------------------------|
| McDonald's India | `mcdonaldsindia.com/menu/nutrition` |
| Domino's India | `dominos.co.in/menu` → Nutritional info |
| KFC India | `kfc.co.in` → Menu → Nutritional info |
| Burger King India | `burgerkingindia.com` |
| Subway India | `subway.com/en-IN/MenuNutrition` |
| Pizza Hut India | `pizzahut.co.in` |

**Tier 2 — Use FatSecret (see Source 5) as supplement only:**
- Starbucks India, Tim Hortons, Taco Bell India

**Tier 3 — Manual curation required (no standardised public disclosure):**
- Haldiram's restaurants (different from packaged products), Bikanervala, Saravana Bhavan,
  Wow Momo, Chai Point, Chaayos

**Ingestion rules for restaurant items:**
- Set `itemType: 'dish'`, `region: 'pan-indian'`
- Add both a "single item" and a "combo/meal" serving where applicable
- Include delivery-platform portion sizes where relevant (`takeaway-container` serving type)
- Set `source: 'fssai-label'` and `confidence: 'high'`
- Menu items that differ by topping/sauce (e.g., McAloo Tikki vs McSpicy) are separate entries

---

### Source 5 — FatSecret API

**Priority:** 🟡 Medium — use as supplement for international chains and fitness products.

**⚠️ Licensing note — read before using:**
FatSecret's free tier allows 500 API calls/day and restricts commercial redistribution of stored
data. Since FitTrack Pro is publicly accessible to registered users, storing FatSecret data
permanently in Supabase likely requires a commercial licence (~$150–500/month depending on tier).

**Recommended usage to stay within ToS:**
- Use FatSecret for real-time lookup only (search → display result) — do NOT bulk-store
- Use it for items where FSSAI/INDB/OFF sources don't have coverage
- Prioritise OFF and FSSAI PDF for any Indian product that has both sources available
- Limit FatSecret storage to supplement brands confirmed to have no OFF entry
- ⚠️ `source: 'fatsecret'` does **not** exist in the DB enum. If storing FatSecret-sourced
  items, use `'curated-estimate'` with `"Source: FatSecret"` in `notes`, or add the enum value.

**Best coverage areas:**
- International supplement brands (Dymatize, MuscleTech, BSN, Labrada, GNC)
- International fast food chains (Starbucks menu items, Tim Hortons, Taco Bell)
- RTD protein drinks and protein snacks
- Niche fitness products not in OFF

**Do NOT use FatSecret as primary source for:**
- Any product available on Open Food Facts India
- Any Indian QSR chain with a public FSSAI PDF
- Any Indian FMCG product (use OFF instead)

---

### Source 6 — Supplement Brand Labels (Direct)

**Priority:** 🔴 Critical — already researched, just needs execution.

[`TODO-supplement-db.md`](file:///Users/ample/Desktop/fittrack-pro/docs/05-Development/Food%20Database/TODO-supplement-db.md)
(located at `docs/05-Development/Food Database/TODO-supplement-db.md`) documents the complete
data for 26 whey protein products and 10 mass gainer products with exact per-scoop label macros.
Do not re-research this.

**Execution task only:** Insert the 36 brand-specific supplement entries into **both**
[`indianFoods.js`](file:///Users/ample/Desktop/fittrack-pro/src/data/foods/indianFoods.js)
(for local fallback) **and** a Supabase migration SQL file (for the `foods` table + `food_servings` table).

**Brands covered (do not source again):**
MuscleBlaze (Biozyme, Biozyme Performance, Raw WPC, Biozyme Iso-Zero), AS-IT-IS (ATOM Whey,
Raw WPC), The Whole Truth (WPC, WPI), NAKPRO Impact, AVVATAR Absolute, TrueBasics Clean WPI,
ON Gold Standard (Whey, WPI), MyProtein (WPC, WPI), Dymatize ISO100, Bigmuscles Gold Whey,
GNC Pro Performance, Tata 1mg, Nutrabay Pure (WPC, WPI), Amul Whey, Naturaltein, MuscleTech
NitroTech, Protyze Clear Whey, Kevin Levrone Gold Whey.
Mass gainers: MuscleBlaze (XXL, Super, Lean), AS-IT-IS ATOM, ON Serious Mass (full + half
serving), Labrada, MuscleTech Mass Tech (extreme — needs caution tag), GNC Weight Gainer,
BSN True Mass 1200.

**After insertion, verify:**
- Every entry has `scoopWeightG` set correctly (varies from 25g to 334g across brands)
- Mass gainers with >1,000 kcal per serving have `tags: ['extreme-calories']`
- All entries have `source: 'FSSAI-label'` (note capitalisation to match DB enum) and `confidence: 'high'`
- `subcategory` is set to one of: `whey-concentrate`, `whey-isolate`, `whey-hydrolysate`,
  `mass-gainer`, `lean-mass-gainer`, `clear-whey`
- `brand` field is populated (exists in `indianFoods.js` but ⚠️ not in Supabase schema —
  add migration for `brand VARCHAR(255)` column before bulk insert)

---

### Source 7 — Edamam API (Optional, Phase 3+)

**Priority:** 🟢 Low — defer until database exceeds 500 items.

**Best for:** AI/NLP food parsing, voice logging, natural-language meal entry.

**Useful inputs:**
- "2 rotis and paneer sabzi"
- "1 scoop whey with banana and 200ml toned milk"
- "plate of chole bhature"

**Recommendation:** Do not build this integration until the core database reaches at least
500 high-quality entries. A strong local database with good aliases will outperform Edamam
for Indian foods in the near term.

---

## Ingestion Quality Rules

These rules apply to **every** new food item regardless of source.

### Rule 1 — Mandatory searchTerms Population

Every new entry must have at least 3 entries in the `searchTerms` array before it is considered
complete. Programmatic ingestion from external APIs will not provide Indian transliterations —
these must be added manually or via a post-processing script.

**Examples:**

| Food name | Required searchTerms entries |
|-----------|------------------------------|
| Toor Dal (cooked) | `['arhar', 'tuvar', 'toovar', 'tuver', 'arher dal']` |
| Cauliflower stir-fry | `['gobhi', 'phool gobhi', 'cauliflower sabzi']` |
| Whey Protein (MuscleBlaze) | `['mb whey', 'muscleblaze biozyme', 'mb biozyme', 'biozyme protein']` |
| Peanut Butter (Pintola) | `['mungfali butter', 'pb pintola', 'pintola pb']` |
| Greek Yogurt | `['greek dahi', 'thick curd', 'hung curd', 'chakka']` |

**Acceptable shortcut:** For OFF-ingested branded products, auto-populate `searchTerms` with:
brand name, brand abbreviation, product name without brand, and any slash-separated variant in
the product name.

---

### Rule 2 — Indian Serving Mapper (OFF ingestion)

OFF data uses EU/US serving conventions. Every OFF-ingested item must have its serving mapped
to Indian-style serving types using this category-aware lookup table:

| OFF serving / product type | Map to FitTrack serving(s) |
|---------------------------|---------------------------|
| Instant noodles packet (70g) | `{ id: 'piece', label: '1 packet', grams: 70 }` |
| Biscuit (per biscuit ~13g) | `{ id: 'piece', label: '1 biscuit', grams: 13 }` + `100g` |
| Peanut butter (per 100g) | `{ id: 'tbsp', label: '1 tablespoon', grams: 16 }` + `100g` |
| Oats, dry (per 100g or 40g bowl) | `{ id: 'bowl', label: '1 bowl dry', grams: 40 }` + `100g` |
| Greek yogurt (per 100g) | `{ id: 'bowl', label: '1 cup/tub', grams: 120 }` + `100g` |
| Protein bar (per bar) | `{ id: 'piece', label: '1 bar', grams: as declared }` |
| Chips (per 26g packet) | `{ id: 'piece', label: '1 packet', grams: 26 }` + `handful (30g)` |
| Cheese slice (per slice ~20g) | `{ id: 'slice', label: '1 slice', grams: 20 }` + `100g` |
| Milk (per 100ml) | `{ id: 'glass', label: '1 glass', grams: 200 }` + `100g` |
| Protein powder / scoop (per scoop) | `{ id: 'scoop', label: '1 scoop', grams: declared scoop weight }` + `100g` |
| Cereal / muesli (per 30-40g) | `{ id: 'bowl', label: '1 bowl', grams: 40 }` + `100g` |
| Bread / toast (per slice) | `{ id: 'slice', label: '1 slice', grams: 30 }` + `100g` |
| Dal / curry / gravy (per 100g) | `{ id: 'katori', label: '1 katori', grams: 150 }` + `bowl (200g)` + `100g` |
| Rice dish (per 100g) | `{ id: 'bowl', label: '1 bowl', grams: 200 }` + `100g` |
| Snack / namkeen (per 30g) | `{ id: 'handful', label: '1 handful', grams: 30 }` + `100g` |

If no serving match is found from the table, default to `100g` serving + one contextually
appropriate serving (ask a human reviewer if unclear).

---

### Rule 3 — Data Freshness Tagging

> [!NOTE]
> There is **no `lastVerified` column** in the Supabase `foods` table. Until a migration adds
> one, embed the value inside the `notes` text field as: `"lastVerified: 2026-05"`. This is
> not queryable but is better than nothing.

Every new entry must include a `lastVerified` value in the `notes` field.
Use the format: `lastVerified: 'YYYY-MM'`.

**Review cadence after initial entry:**

| Food type | Re-verify every |
|-----------|----------------|
| Supplement brand data (formula can change) | 6 months |
| Restaurant / QSR menu items | 3 months |
| FMCG packaged foods | 12 months |
| Homemade / traditional dishes | Rarely — only if INDB updates |
| Raw ingredients | Rarely — IFCT data is stable |

The MuscleBlaze Biozyme formula has changed 3 times since launch. ON Serious Mass has different
macros on US vs India packaging. Always re-check before assuming supplement data is current.

---

### Rule 4 — Deduplication Before Insertion

Before inserting any new item, check for existing entries using:
1. Exact `id` match
2. Substring name match on `name` + `brand` combination (the current search layer uses
   `.toLowerCase().includes()`, not Levenshtein — keep dedup logic consistent with what
   the codebase actually supports)
3. Barcode match (when barcode data is available from OFF) — ⚠️ requires adding a `barcode`
   column to the schema first

If a duplicate is found, update the existing entry with the new source's data rather than
creating a new row — prefer more complete entries and more trusted sources.

**Source trust ranking (higher = prefer its data in conflicts):**
```
FSSAI-label > IFCT-2017 > INDB* > off-india* > fatsecret* > curated-estimate
```
\* Not currently valid DB enum values — see Schema Gaps section at top of document.

---

### Rule 5 — Beverage Modifier Data Accuracy

The app's Beverage Builder (chai, coffee, haldi-doodh) depends on modifier accuracy.
The 3 beverage base entries (`chai-base`, `coffee-black`, `haldi-doodh-base`) must have
verified `per100g` values, and the modifier add-ons (milk types, sweeteners) must use
values cross-referenced against IFCT 2017.

When expanding the `drink` category, flag any new drink with `hasBeverageModifiers: true`
if it is a base beverage that users commonly customise with milk or sweetener. At minimum:
- Masala chai variants (ginger chai, cardamom chai, tulsi chai)
- South Indian filter coffee (base decoction)
- Protein shakes (base without add-ins)
- Hot chocolate / cocoa drinks
- Haldi milk variants

---

## Core Expansion Priorities

### Priority 1 — Supplement brand entries (36 items)
Execute insertions from `TODO-supplement-db.md`. All data is ready.

### Priority 2 — Packaged food via Open Food Facts (target +12 items)
Focus on namkeen, biscuits, cereals, peanut butter, Greek yogurt, cheese, instant foods.

### Priority 3 — Homemade sabzi and dal via INDB (target +17 items)
Fill the `sabzi-veg` and `dal-legume` gaps with regional variants not yet covered.

### Priority 4 — Sweets and mithai via INDB (target +9 items)
The most under-covered category. Motichoor ladoo, Mysore pak, kalakand, peda, chamcham,
chenna poda, Rajasthani ghevar, Bengali sandesh variants.

### Priority 5 — Fruits (target +10 items)
Seasonal Indian fruits and dry fruits. Chikoo, jamun, sitaphal, jackfruit, tamarind,
dried figs, prunes, musambi (sweet lime), papaya, amla, bael.

### Priority 6 — Restaurant menus via FSSAI PDFs (target +12 items)
McDonald's India (McAloo Tikki, McSpicy Paneer, McVeggie, McChicken, McEgg, Filet-O-Fish),
Domino's India (Margherita, Farm House, Peppy Paneer, Chicken Tikka per slice).

---

## Search & Alias Quality Standards

### Hinglish Alias Coverage

Every food item must be discoverable by the way Indian users actually search.
Run a post-insertion check for each new item to verify these alias types are covered:

| Alias type | Example |
|------------|---------|
| Hindi transliteration | `gobhi` for cauliflower |
| Regional name | `pesarattu` for green moong dosa |
| Common abbreviation | `PBM` for paneer butter masala |
| Brand abbreviation | `MB` for MuscleBlaze, `ON` for Optimum Nutrition |
| Common misspelling | `biryaani`, `byriyan`, `daal`, `rotti` |
| Colloquial form | `protein shake`, `gym shake` for whey protein |
| Ingredient-based search | `soya chunks`, `TVP`, `nutrela` for soya granules |

### Brand-Aware Ranking

When multiple products match a search (e.g., "peanut butter"), surface results in this order:
1. Exact brand + product name match
2. Brand match + partial product name
3. Category match with high confidence
4. Category match with medium confidence

This ensures a user searching "Pintola peanut butter" sees Pintola first, not a generic entry.

---

## Barcode System

**Future readiness — not blocking current expansion.**

> [!WARNING]
> There is **no `barcode` column** in the Supabase `foods` table or in `indianFoods.js` entries.
> Storing barcodes **does** require a schema migration:
> ```sql
> ALTER TABLE public.foods ADD COLUMN barcode VARCHAR(50);
> CREATE INDEX idx_foods_barcode ON public.foods (barcode) WHERE barcode IS NOT NULL;
> ```
> Until this migration is run, store barcodes in the `notes` field as a temporary measure:
> `"Barcode: 8901234567890"`. This is not indexable but preserves the data for later migration.

**Required per OFF-ingested product:**
- Store barcode as `barcode: '8901234567890'` if the column exists, otherwise in `notes`
- Index barcodes for fast lookup (future feature — requires migration above)
- Products without barcodes: set `barcode: null` (or omit from `notes`)

---

## Recommended Priority Order

### Phase 1 — Execute Existing Research (no new sourcing needed)
1. Insert 36 brand-specific supplement entries from `TODO-supplement-db.md`
2. Insert restaurant menu items from Domino's, McDonald's India FSSAI PDFs
3. Fill `sweet-mithai` and `fruit` category gaps using INDB

### Phase 2 — Open Food Facts Ingestion
1. Build OFF India dataset import for priority brands listed above
2. Apply Indian Serving Mapper to every imported product
3. Apply searchTerms post-processing script
4. Apply deduplication check against existing entries
5. Tag all items with `lastVerified: 'YYYY-MM'`

### Phase 3 — INDB Deep Expansion
1. Regional sabzi and dal variants
2. South Indian breakfast items
3. Bengali and Gujarati specialty dishes
4. Street foods with accurate per-piece weights

### Phase 4 — Intelligence Layer
1. Micronutrient enrichment using IFCT 2017 cross-reference
2. `searchTerms` audit across all existing 207 entries
3. Serving size accuracy review (are katori weights realistic?)
4. Consistency multiplier data for ~30 dish-type entries

### Phase 5 — Advanced (defer)
1. AI/NLP food parsing (Edamam) — only after 500+ items
2. OCR label scanning
3. Image association
4. Voice-based logging

---

## What Good Looks Like

A database entry is considered **complete** when:
- [ ] Macros populated: calories, protein, carbs, fat, fiber
- [ ] At least one Indian-style serving defined (not just 100g)
- [ ] At least 3 entries in `searchTerms` covering Indian spellings
- [ ] `source` and `confidence` are set (using valid DB enum values — see Schema Gaps section)
- [ ] `lastVerified` is noted in `notes` field
- [ ] `dietTypes` array is correct and uses consistent enum values (`'nonveg'` not `'non-veg'` — see note below)
- [ ] `containsRootVeg` is set if applicable
- [ ] `isFastingFood` and `fastingTypes` are set where relevant
- [ ] `itemType` is set (must be valid enum: `base-food`, `dish`, `drink`, `supplement`, `snack`, `packaged-food`, `condiment`)
- [ ] `category` uses one of the 20 defined categories (not orphan values like `curry`)
- [ ] Entry exists in **both** `indianFoods.js` and Supabase (see Dual-Insert Requirement above)

> [!WARNING]
> **`dietTypes` enum inconsistency**: The codebase has entries using both `'nonveg'` and
> `'non-veg'`. The Supabase enum (`diet_type_enum`) defines the canonical values. Pick one
> form and normalise all existing entries before adding new ones, or search filtering will
> silently miss items. Audit existing entries for: `'nonveg'` vs `'non-veg'` and `'veg'` vs
> `'vegetarian'`.

A database entry is considered **incomplete** and should not be published when:
- Calories or protein are `null` or `0` (unless item genuinely has zero, e.g., water)
- No serving beyond `100g` is defined
- `searchTerms` is empty
- `confidence` is not set
- `category` is not one of the 20 defined values in `foodCategories.js`

---

## Important Long-Term Principle

The real competitive advantage over HealthifyMe and MyFitnessPal is not database size.
It is:
- Indian-food-first understanding (katori not serving, gobhi not cauliflower)
- Serving-size accuracy (a restaurant katori of dal is 200g, not 150g)
- Supplement brand precision (MuscleBlaze Biozyme scoop is 33g, not 30g)
- Clean deduplication (no 5 versions of the same product with contradictory macros)
- Micronutrient intelligence (B12/D3 alerts relevant to vegetarian Indian gym-goers)

A database of 500 clean, well-aliased, accurately-served Indian foods will outperform
a noisy database of 5,000 poorly-normalized entries for this specific audience.

---

## Pre-Expansion Migration Checklist

Before starting any expansion phase, run these migrations to unblock the ingestion rules
documented above:

```sql
-- 1. Add missing source enum values
ALTER TYPE source_enum ADD VALUE IF NOT EXISTS 'off-india';
ALTER TYPE source_enum ADD VALUE IF NOT EXISTS 'indb';
ALTER TYPE source_enum ADD VALUE IF NOT EXISTS 'fatsecret';

-- 2. Add barcode column
ALTER TABLE public.foods ADD COLUMN IF NOT EXISTS barcode VARCHAR(50);
CREATE INDEX IF NOT EXISTS idx_foods_barcode ON public.foods (barcode) WHERE barcode IS NOT NULL;

-- 3. Add brand column (already used in indianFoods.js Batch 7+)
ALTER TABLE public.foods ADD COLUMN IF NOT EXISTS brand VARCHAR(255);

-- 4. Add allergens column (already used in indianFoods.js Batch 7+)
ALTER TABLE public.foods ADD COLUMN IF NOT EXISTS allergens TEXT[];

-- 5. Add lastVerified column (optional — can remain in notes)
ALTER TABLE public.foods ADD COLUMN IF NOT EXISTS last_verified DATE;
```

Also fix existing data issues:
```sql
-- Fix orphan 'curry' category entries
UPDATE public.foods SET category_id = 'dal-legume' WHERE category_id = 'curry';

-- Normalise dietTypes inconsistency (if 'non-veg' is not the canonical value)
-- Check diet_type_enum definition first, then update accordingly.
```
