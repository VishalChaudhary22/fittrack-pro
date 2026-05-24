# TODO — Fitness Brand & Packaged Health Foods (India)
# FitTrack Pro · Brand-Level Health & Fitness Foods

> **Created:** 2026-04-16  · **Scope:** Indian fitness / health brands for oats, peanut butter, bread, protein bars, protein drinks, cereals and snacks.
> **Goal:** Give AI agents a brand–product map with ID patterns, categories, subcategories and batch priorities so they can add **all major & mid-sized branded SKUs** to `indianFoods.js` using FSSAI/label data.
> **Schema:** Uses v2.2 food schema + subcategories from `TODO-extended-indian-foods.md`.

---

## 🔎 How Agents Should Use This File

Each row below is **not a single SKU**, but a **brand × product-family pattern** that can generate 5–50 individual SKUs (flavours, pack sizes) using label data.

For each pattern, agents will:

1. **Search brand website / FSSAI-compliant marketplaces** (Amazon, BigBasket, HealthKart, Zepto, 1mg, brand D2C site) for all flavours and pack sizes.
2. Create one food object **per unique nutrition panel** (if macros per 100g are identical across pack sizes, only one base entry is needed; serving variants can model sizes).
3. Use this document for:
   - `id` naming convention
   - `category` & `subcategory`
   - `itemType` & `state`
   - initial `tags`, `dietTypes`, `source`, `confidence`

---

## 🧩 Standard Hint Fields for Brand Foods

Every new brand food should be created with the following **minimum fields** filled (in addition to the full v2.2 schema):

- `id`: brand + product + variant in kebab-case (e.g., `pb-pintola-all-natural-crunchy`, `bar-ritebite-max-20g-chocoalmond`).
- `brand`: human-readable brand name, e.g., `'Pintola'`, `'MyFitness'`, `'RiteBite Max Protein'`, `'Amul'`.
- `category`: one of the 20 v2.2 categories.
- `subcategory`: from the new list below (e.g., `peanut-butter`, `protein-bar`, `high-protein-milk`).
- `itemType`: `'base-food' | 'snack' | 'drink' | 'supplement'`.
- `state`: `'raw' | 'cooked' | 'baked' | 'roasted' | 'powder' | 'ready-to-drink'`.
- `dietTypes`: array subset of `['veg','vegan','egg','nonveg']`.
- `tags`: use standardized vocabulary (high-protein, high-fiber, low-sugar, etc.).
- `source`: `'FSSAI-label'` for all packaged products where label is visible; `'USDA'` only for global references; `'curated-estimate'` only when nothing else exists.
- `confidence`: `'high'` for official label, `'medium'` for triangulated (2+ sources), `'low'` for curated estimates.
- `sizeVariant`: logical size label when relevant (e.g., `'250g-jar'`, `'1kg-jar'`, `'single-bar'`, `'250ml-pack'`).

---

## 🗂️ New Subcategories Introduced for Brands

Extend `foodCategories.js` with the following `subcategory` values:

```js
// Within `oil-fat`
peanut-butter          // all PB/nut butters (Pintola, MyFitness, Alpino, etc.)

// Within `grain-cereal` & `breakfast`
breakfast-oats         // plain/instant/rolled oats
breakfast-cereal       // cornflakes, wheat flakes, kids cereals
muesli                 // muesli-style mixes
granola                // baked granola clusters

// Within `roti-bread`
packaged-bread         // all branded sliced bread (white/brown/multigrain)
high-protein-bread     // specialised high-protein or 100% whole wheat breads

// Within `supplement`
protein-bar            // 15–30g protein bars (RiteBite, The Whole Truth, etc.)
energy-bar             // 5–14g protein energy/nutrition bars

// Within `drink`
high-protein-milk      // Amul High Protein Milk, Mother Dairy Promilk, etc.
protein-shake-rtd      // ready-to-drink protein shakes
flavoured-milk-health  // malted/fortified milks (Amul Pro, Bournvita milk, etc.)

// Within `snack-street`
health-snack-packaged  // seeds mixes, trail mixes, baked crisps from True Elements/Yogabar/etc.
```

> **Note:** Subcategories are not brands — they describe **product type**, so that future non-Indian brands or home-made versions can reuse them.

---

## 🚥 Priority Batches (Brand Foods)

| Batch | Priority | Theme | Why it matters |
|-------|:--------:|-------|----------------|
| **B1** | 🔴 P0 | Peanut butter & nut butters | Most logged Indian fitness snack; Pintola, MyFitness, Alpino, Saffola PBs are extremely common in Fitness_India & HealthifyMe communities. |
| **B2** | 🟠 P1 | Protein bars & energy bars | Indian users frequently replace snacks with bars; big impact on protein tracking. |
| **B3** | 🟡 P2 | Oats, muesli, granola & breakfast cereals | Breakfast macros hinge on these; many flavoured mixes differ significantly in sugar/fat. |
| **B4** | 🟢 P3 | High-protein milk, protein RTDs & breads | Important but slightly lower frequency; still critical for completeness. |
| **B5** | 🔵 P4 | Health snacks (seeds, trail mixes) & minor brands | Nice to have; good for advanced users and edge cases. |

---

## 🔴 BATCH B1 — Peanut Butter & Nut Butters

> **Category:** `oil-fat`  · **Subcategory:** `peanut-butter`  · **itemType:** `'supplement'` (for high-protein PB) or `'snack'` (classic PB).  · **state:** `'raw'` (as spread).  
> All entries: `isProcessed: true`, `source: 'FSSAI-label'` where label is visible.

### B1.1 Pintola (All Peanut & Nut Butters)

**Brand:** `Pintola`  · **Batch:** B1 (P0)  
Reference: Pintola website & revised MRP list / all-products catalogue.[web:72][web:78][web:80][web:82]

| Pattern ID (prefix) | Example full `id` | Product family | Category → Subcategory | Notes for agents |
|---------------------|-------------------|----------------|------------------------|------------------|
| `pb-pintola-all-natural-` | `pb-pintola-all-natural-crunchy` | All Natural PB (unsweetened; creamy, crunchy, extra crunchy) | `oil-fat` → `peanut-butter` | 100% peanuts; mark `dietTypes: ['veg','vegan']`, `tags: ['high-protein','high-fat','no-added-sugar']`. Map all pack sizes (200g–2.5kg) via `servings`. |
| `pb-pintola-classic-` | `pb-pintola-classic-crunchy` | Classic PB (sweetened) | `oil-fat` → `peanut-butter` | Contains sugar/salt; tag `high-fat`,`high-calorie`. Distinct per flavour (creamy/crunchy). |
| `pb-pintola-chocolate-` | `pb-pintola-chocolate-creamy` | Chocolate PB | `oil-fat` → `peanut-butter` | Higher sugar; tag `high-sugar`. Use label macros for each flavour. |
| `pb-pintola-high-protein-` | `pb-pintola-high-protein-dark-choco` | High Protein & Performance PB | `supplement` → `peanut-butter` | Whey/plant-protein fortified; tag `very-high-protein`. Separate entries for each protein % and flavour. |
| `pb-pintola-almond-` | `pb-pintola-almond-butter-creamy` | Almond butter range | `oil-fat` → `peanut-butter` | Non-peanut nut butters; still same subcategory. |
| `pb-pintola-mixnut-` | `pb-pintola-mixnut-spread` | Mixed nut spreads | `oil-fat` → `peanut-butter` | Peanut+almond+cashew blends etc. |


### B1.2 MyFitness (Peanut Butters)

**Brand:** `MyFitness`  · **Batch:** B1 (P0)  
Reference: MyFitness D2C site – Original, Natural & Chocolate lines.[web:71][web:73][web:75][web:79][web:81][web:83]

| Pattern ID | Example `id` | Product family | Category → Subcategory | Notes |
|-----------|---------------|----------------|------------------------|------|
| `pb-myfitness-original-` | `pb-myfitness-original-crunchy` | Original PB (smooth/crunchy, sweetened) | `oil-fat` → `peanut-butter` | Base flagship SKUs; tag `high-protein`,`high-fat`. |
| `pb-myfitness-natural-` | `pb-myfitness-natural-smooth` | Natural PB (100% peanuts) | `oil-fat` → `peanut-butter` | No sugar; `dietTypes: ['veg','vegan']`. |
| `pb-myfitness-chocolate-` | `pb-myfitness-chocolate-crispy` | Chocolate PB (normal & crispy) | `oil-fat` → `peanut-butter` | Tag `high-sugar`; track per flavour macros. |
| `pb-myfitness-high-protein-` | `pb-myfitness-high-protein-choco-25p` | High-protein PB variants | `supplement` → `peanut-butter` | 25–30% protein; treat like food-supplement. |


### B1.3 Alpino (Peanut Butters & More)

**Brand:** `Alpino`  · **Batch:** B1 (P0)  
Reference: Alpino store & listings on 1mg / BigBasket.[web:129][web:132][web:135][web:138][web:141]

| Pattern ID | Example `id` | Product family | Category → Subcategory | Notes |
|-----------|---------------|----------------|------------------------|------|
| `pb-alpino-natural-` | `pb-alpino-natural-crunch-unsweet` | Natural PB (Crunch & Smooth, unsweetened) | `oil-fat` → `peanut-butter` | Label: gluten-free, non-GMO, vegan; tag accordingly. |
| `pb-alpino-classic-` | `pb-alpino-classic-smooth` | Classic PB sweetened variants | `oil-fat` → `peanut-butter` | Separate for creamy/crunchy. |
| `pb-alpino-honey-` | `pb-alpino-natural-crunch-honey` | PB with honey | `oil-fat` → `peanut-butter` | Higher sugar from honey; tag `high-sugar`. |
| `pb-alpino-chocolate-` | `pb-alpino-chocolate-smooth` | Chocolate PB | `oil-fat` → `peanut-butter` | Use FSSAI macros per flavour. |


### B1.4 Other PB Brands (Saffola, Disano, YogaBar, The Whole Truth, RiteBite)

Treat these as separate brands with similar pattern IDs:

- **Saffola FITTIFY** – Plant Protein PB (extra crunchy, unsweetened, diabetic-friendly).[web:100][web:103][web:109]
- **Disano** – Classic & Natural PB (creamy/crunchy).[web:104][web:107][web:110]
- **Yoga Bar** – Natural PB and flavoured PB (check Yogabar site).[web:97]
- **The Whole Truth** – Clean-label PB (no added sugar).[web:91][web:96]
- **RiteBite Max Protein** – Protein PB spreads.[web:133]

Generic pattern rows:

| Brand | Pattern ID prefix | Example `id` | Notes |
|-------|-------------------|--------------|-------|
| Saffola FITTIFY | `pb-saffola-fittify-` | `pb-saffola-fittify-plant-protein-crunchy` | Tag `very-high-protein`, `diabetic-friendly` where claimed. |
| Disano | `pb-disano-` | `pb-disano-natural-crunchy` | Standard PB brand; same mapping as Pinto/MyFitness. |
| Yoga Bar | `pb-yogabar-` | `pb-yogabar-natural-crunchy` | Follow label for protein %; may cross-link with their bar products. |
| The Whole Truth | `pb-twt-` | `pb-twt-natural-100peanut` | Use `'The Whole Truth'` as `brand`. Clean label; `no-added-sugar`. |
| RiteBite | `pb-ritebite-max-` | `pb-ritebite-max-protein` | Cross-sell with their Max Protein bars. |

---

## 🟠 BATCH B2 — Protein Bars & Energy Bars

> **Category:** primarily `supplement`  · **Subcategories:** `protein-bar`, `energy-bar`  · **itemType:** `'supplement'`.

### B2.1 RiteBite Max Protein

**Brand:** `RiteBite Max Protein`  · **Batch:** B2 (P1)  
References: MaxProtein website collections & BigBasket SKUs.[web:130][web:133][web:136][web:139][web:142]

| Pattern ID | Example `id` | Product family | Subcategory | Notes |
|-----------|---------------|----------------|-------------|------|
| `bar-ritebite-max-10g-` | `bar-ritebite-max-10g-chocoalmond` | 10g protein bars (Daily) | `energy-bar` | Lower protein; tag `snack`,`moderate-protein`. |
| `bar-ritebite-max-20g-` | `bar-ritebite-max-20g-chocobadamm` | 20g protein bars (Active) | `protein-bar` | Standard protein bar; 60–70g bar size. |
| `bar-ritebite-max-30g-` | `bar-ritebite-max-30g-chocoberry` | 30g protein bars (Ultimate) | `protein-bar` | Meal-replacement style; tag `very-high-protein`. |
| `bar-ritebite-max-snack-` | `bar-ritebite-max-snack-nuts-seeds` | Nutrition/snack bars | `energy-bar` | Lower protein, higher fiber/fat. |


### B2.2 The Whole Truth (TWT) Protein Bars

**Brand:** `The Whole Truth`  · **Batch:** B2 (P1)  
References: TWT store, 1mg listings, BigBasket catalog.[web:87][web:91][web:94][web:96][web:98][web:125]

| Pattern ID | Example `id` | Product family | Subcategory | Notes |
|-----------|---------------|----------------|-------------|------|
| `bar-twt-protein-20g-` | `bar-twt-protein-20g-double-cocoa` | 20g protein bars | `protein-bar` | Clean label; `no-added-sugar`,`no-artificial-sweetener`. |
| `bar-twt-protein-15g-` | `bar-twt-protein-15g-coffee-cocoa` | 15–16g protein bars | `protein-bar` | Use label macros. |
| `bar-twt-energy-` | `bar-twt-energy-choco-fruit-nut` | Energy bars with lower protein | `energy-bar` | Tag `high-fiber`. |


### B2.3 Yoga Bar Bars

**Brand:** `Yogabar`  · **Batch:** B2 (P1)  
References: Yogabar site & Zepto listing of bars/muesli.[web:86][web:90][web:95][web:97][web:125]

| Pattern ID | Example `id` | Product family | Subcategory | Notes |
|-----------|---------------|----------------|-------------|------|
| `bar-yogabar-energy-` | `bar-yogabar-energy-chocolate-chunk` | Multigrain energy bars | `energy-bar` | Oats + millets + nuts; 5–10g protein. |
| `bar-yogabar-protein-` | `bar-yogabar-protein-20g-chocobrownie` | High-protein bars | `protein-bar` | 20g protein; list all flavours. |


### B2.4 Other Popular Bar Brands (Phab, Superyou, MuscleBlaze)

Based on Indian fitness community comparisons.[web:117][web:121][web:125]

| Brand | Pattern | Example `id` | Notes |
|-------|---------|--------------|-------|
| Phab | `bar-phab-protein-` | `bar-phab-protein-20g-chocoalmond` | Known for good protein/₹; treat similar to Max/TWT. |
| Superyou | `bar-superyou-protein-` | `bar-superyou-protein-20g-cookie` | Includes wafers; but use same subcategory `protein-bar`. |
| MuscleBlaze | `bar-muscleblaze-protein-` | `bar-muscleblaze-protein-20g-cookiescream` | MuscleBlaze branded bars; cross-link with their whey range. |

---

## 🟡 BATCH B3 — Oats, Muesli, Granola & Breakfast Cereals

> **Categories:** primarily `grain-cereal` and `breakfast`  · **Subcategories:** `breakfast-oats`, `muesli`, `granola`, `breakfast-cereal`.

### B3.1 Mainstream Oats Brands (Quaker, Saffola, Kellogg’s, Bagrry’s)

References: oats brand rankings and manufacturer lists.[web:101][web:104][web:107][web:110][web:112]

#### Brand: Quaker

Patterns:

- `oats-quaker-plain-` → `oats-quaker-plain-quick` (instant oats)
- `oats-quaker-rolled-` → `oats-quaker-rolled` (rolled oats)
- `oats-quaker-masala-` → `oats-quaker-masala-tomato` (masala oats flavours)

All under `grain-cereal` → `breakfast-oats`.  `itemType: 'base-food'`, `state: 'raw'` (dry product) with `servings` for cooked portion.

#### Brand: Saffola (Marico)

Patterns:

- `oats-saffola-plain-` → plain oats.
- `oats-saffola-masala-` → flavours like Classic Masala, Veggie Twist, Curry & Pepper.[web:101][web:104][web:110]

Same category/subcategory as Quaker.

#### Brand: Kellogg’s & Bagrry’s

Patterns:

- `oats-kelloggs-plain-` / `oats-kelloggs-masala-`.
- `oats-bagrrys-white` / `oats-bagrrys-rolled`.


### B3.2 Health-Focused Cereals — True Elements

**Brand:** `True Elements`  · **Batch:** B3 (P2)  
References: True Elements site and best-sellers.[web:99][web:102][web:105][web:108][web:111][web:113]

| Pattern ID | Example `id` | Product family | Category → Subcategory |
|-----------|---------------|----------------|------------------------|
| `oats-trueelements-rolled-` | `oats-trueelements-rolled` | Rolled Oats (dust-free) | `grain-cereal` → `breakfast-oats` |
| `muesli-trueelements-nas-` | `muesli-trueelements-nas-mix` | No Added Sugar Muesli | `breakfast` → `muesli` |
| `muesli-trueelements-berries-` | `muesli-trueelements-berries` | Nuts & Berries Muesli | `breakfast` → `muesli` |
| `granola-trueelements-baked-` | `granola-trueelements-dark-choc` | Baked Granola (Dark Chocolate) | `breakfast` → `granola` |
| `cereal-trueelements-cornflakes-` | `cereal-trueelements-cornflakes-millet-crunch` | Cornflakes & millet cereals | `grain-cereal` → `breakfast-cereal` |


### B3.3 Yoga Bar Breakfast Range

**Brand:** `Yogabar`  · **Batch:** B3 (P2)  
References: Yogabar cereals & muesli.[web:86][web:90][web:93][web:95][web:97]

| Pattern ID | Example `id` | Product family | Category → Subcategory |
|-----------|---------------|----------------|------------------------|
| `oats-yogabar-highprotein-` | `oats-yogabar-highprotein-26g-fruitnut` | High Protein Oats | `grain-cereal` → `breakfast-oats` |
| `muesli-yogabar-protein-` | `muesli-yogabar-protein-chocoalmond` | Protein Muesli (21g) | `breakfast` → `muesli` |
| `cereal-yogabar-breakfast-` | `cereal-yogabar-millets` | Other breakfast cereals (millets, flakes) | `grain-cereal` → `breakfast-cereal` |


### B3.4 Other Oats/Cereal Brands (Disano, Patanjali, NesPlus, Slurrp Farm, etc.)

Create generic brand patterns:

| Brand | Pattern prefix | Example `id` | Notes |
|-------|----------------|--------------|-------|
| Disano | `oats-disano-` | `oats-disano-plain` | Popular in budget oats lists. |
| Patanjali | `oats-patanjali-` | `oats-patanjali-plain` | Ayurvedic FMCG brand. |
| Nestlé NesPlus | `cereal-nesplus-` | `cereal-nesplus-multigrain` | Multigrain cereals & muesli. |
| Slurrp Farm/Soulfull | `cereal-slurrpfarm-` | `cereal-slurrpfarm-millet-muesli` | Millet-based kids/adult cereals. |

---

## 🟢 BATCH B4 — High-Protein Milk, RTD Protein Shakes & Bread

### B4.1 High-Protein Milk — Amul & Mother Dairy

**Brands:** `Amul`, `Mother Dairy`  · **Batch:** B4 (P3)  
References: Amul High Protein Milk & Whey Protein; Mother Dairy Promilk.[web:115][web:119][web:123][web:127][web:116][web:120][web:124][web:128]

**Category:** `drink`  · **Subcategory:** `high-protein-milk`  · **itemType:** `'drink'`  · **state:** `'ready-to-drink'`.

| Brand | Pattern ID | Example `id` | Notes |
|-------|-----------|--------------|-------|
| Amul | `drink-amul-highprotein-milk-` | `drink-amul-highprotein-milk-250ml` | 35g protein per 250ml; lactose-free; vanilla flavour. One entry per pack size. |
| Amul | `supp-amul-whey-` | `supp-amul-whey-1scoop` | Use `category: 'supplement'`; `state: 'powder'`; macros per scoop. |
| Amul | `drink-amul-pro-` | `drink-amul-pro-malt` | Malted fortified milk powder with milk; subcategory `flavoured-milk-health`. |
| Mother Dairy | `drink-motherdairy-promilk-` | `drink-motherdairy-promilk-500ml` | Promilk high-protein milk; 20g protein per 500ml pouch; add 1L variant. |


### B4.2 RTD Protein Shakes (MuscleBlaze, Fast&Up, Protinex, etc.)

**Category:** `drink` → `protein-shake-rtd`  · **itemType:** `'drink'`.

Patterns:

| Brand | Pattern prefix | Example `id` | Notes |
|-------|----------------|--------------|-------|
| MuscleBlaze | `drink-muscleblaze-proteinshake-` | `drink-muscleblaze-proteinshake-chocolate-250ml` | RTD shakes; use label macros; `high-protein`. |
| Fast&Up | `drink-fastandup-proteinshake-` | `drink-fastandup-proteinshake-24g-coffee` | Ready-to-drink or prepared from powder; use FSSAI labels where available.[web:131][web:134][web:137][web:140][web:143] |
| Protinex/Nestlé Resource | `drink-protinex-rt` | `drink-protinex-rtd-vanilla` | Medical nutrition drinks; important for some users. |


### B4.3 Packaged Bread — Britannia, Harvest Gold, English Oven, Modern, Bonn

**Category:** `roti-bread`  · **Subcategory:** `packaged-bread` / `high-protein-bread`  · **itemType:** `'base-food'`.

References: FSSAI / consumer reports on white and brown breads.[web:122][web:114][web:118][web:126]

Generic pattern per brand:

| Brand | Pattern prefix | Example `id` | Subcategory |
|-------|----------------|--------------|-------------|
| Britannia | `bread-britannia-white-` | `bread-britannia-white-slice` | `packaged-bread` |
| Britannia | `bread-britannia-brown-` | `bread-britannia-brown-slice` | `packaged-bread` |
| Britannia | `bread-britannia-multigrain-` | `bread-britannia-multigrain-slice` | `packaged-bread` |
| Harvest Gold | `bread-harvestgold-white-` | `bread-harvestgold-white-slice` | `packaged-bread` |
| Harvest Gold | `bread-harvestgold-brown-` | `bread-harvestgold-brown-slice` | `packaged-bread` |
| English Oven | `bread-englishoven-brown-` | `bread-englishoven-brown-slice` | `packaged-bread` |
| English Oven | `bread-englishoven-100ww-` | `bread-englishoven-100ww-slice` | `high-protein-bread` (zero maida, higher fiber/protein).[web:118][web:126] |
| Modern | `bread-modern-` | `bread-modern-white-slice` | `packaged-bread` |
| Bonn | `bread-bonn-` | `bread-bonn-brown-slice` | `packaged-bread` |

---

## 🔵 BATCH B5 — Health Snacks, Seeds, Trail Mixes (True Elements, Yogabar, etc.)

> **Category:** `snack-street`  · **Subcategory:** `health-snack-packaged`  · **itemType:** `'snack'`.

### B5.1 True Elements Health Snacks

Patterns (brand `True Elements`).[web:99][web:102][web:105][web:108][web:111][web:113]

- `snack-trueelements-seedsmix-` → roasted seeds mix (sunflower, pumpkin, flax, chia).
- `snack-trueelements-trailmix-` → nuts & berries trail mix.
- `snack-trueelements-baked-snack-` → baked millet snacks.

### B5.2 Yogabar Health Snacks

Patterns (brand `Yogabar`).[web:86][web:90][web:95][web:97]

- `snack-yogabar-trailmix-` → fruit & nut mixes.
- `snack-yogabar-baked-crisp-` → baked chips/crisps.

---

## ✅ Agent Implementation Checklist (Brand Foods)

**Phase 1 — Schema & Subcategories**
- [ ] Add new `subcategory` values to `foodCategories.js` exactly as listed above.
- [ ] Add `brand` and `sizeVariant` optional fields to the v2.2 schema.
- [ ] Update validation script to ensure brand foods have `source: 'FSSAI-label'` or explicit alternative.

**Phase 2 — Batch B1 & B2 (Highest Impact)**
- [ ] Implement all Pintola, MyFitness, Alpino, Saffola FITTIFY, Disano, Yogabar, The Whole Truth, RiteBite PB patterns.
- [ ] Implement all RiteBite, TWT, Yogabar, Phab, Superyou, MuscleBlaze protein/energy bar patterns.
- [ ] For each pattern, enumerate actual SKUs from brand/marketplace pages and add 1 food object per unique nutrition panel.

**Phase 3 — Batch B3 (Breakfast Cereals)**
- [ ] Implement Quaker, Saffola, Kellogg's, Bagrry's oats patterns.
- [ ] Implement True Elements & Yogabar cereal/muesli/granola patterns.
- [ ] Add other brands (Disano, Patanjali, NesPlus, Slurrp Farm) as generic patterns.

**Phase 4 — Batch B4 & B5 (Drinks, Bread, Snacks)**
- [ ] Implement Amul/Mother Dairy high-protein milk; RTD shakes from MuscleBlaze, Fast&Up, Protinex.
- [ ] Implement bread patterns for Britannia, Harvest Gold, English Oven, Modern, Bonn.
- [ ] Implement health snack patterns for True Elements, Yogabar and similar brands.

---

## 🔒 Validation Rules (Brand Foods)

On top of existing rules from `TODO-indian-food-db.md`:

1. **Brand field required:** all new rows that follow this file must set `brand`.
2. **FSSAI priority:** if a packaged product has an Indian FSSAI label, always set `source: 'FSSAI-label'` and `confidence: 'high'`.
3. **Macronutrient sanity:** calories must roughly equal `protein×4 + carbs×4 + fat×9` (±10%). If not, cross-check another label.
4. **Size variants:** if macros per 100g are identical, avoid duplicate base entries; use servings and `sizeVariant` to model different pack sizes.
5. **Protein bars vs energy bars:** any bar with ≥15g protein per serving → `subcategory: 'protein-bar'`; otherwise `energy-bar`.
6. **Vegan tagging:** PBs and plant-based items with no dairy should include `dietTypes` containing `'vegan'`.
7. **Alcohol-free assumption:** all products in this file are non-alcoholic; do **not** set `alcoholG`.

---

*This file is intended for automated ingestion by AI agents to build out brand-specific fitness foods in `src/data/foods/indianFoods.js`. It complements (does not replace) the core base-food and restaurant-items TODOs.*
