# TODO — Fitness Brand & Packaged Health Foods (India)
# FitTrack Pro · Brand-Level Health & Fitness Foods

> **Created:** 2026-04-16  · **Updated:** 2026-04-16  · **Scope:** Indian fitness / health brands for peanut butter, nut butters, protein bars, oats, muesli, granola, cereals, bread, high-protein milk, RTD shakes, Greek yogurt, protein cookies & chips, biscuits, instant noodles, health snacks, seeds, and trail mixes.
> **Goal:** Give AI agents a brand–product map with ID patterns, categories, subcategories and batch priorities so they can add **all major & mid-sized branded SKUs** to `indianFoods.js` using FSSAI/label data.
> **Schema:** Uses v2.2 food schema + subcategories from `TODO-extended-indian-foods.md`.
>
> **⚠️ Cross-reference:** Whey protein powders & mass gainers are documented separately in [`TODO-supplement-db.md`](docs/05-Development/Food%20Database/TODO-supplement-db.md) (26 whey + 10 mass gainer entries with full label data). Do **not** duplicate supplement powder entries here. This file covers all *other* branded packaged health & fitness foods.

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
- `allergens`: array of standardized allergen labels (e.g., `['peanuts','tree-nuts','soy','gluten','milk','egg']`). Required for all packaged foods — critical for user safety and filtering.

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

// Within `dairy`
greek-yogurt           // strained high-protein yogurt (Epigamia, Milky Mist Skyr, Mother Dairy)
high-protein-curd      // fortified/strained high-protein dahi variants

// Within `supplement` or `snack-street`
protein-cookie         // branded protein cookies (MuscleBlaze, MyFitness, Open Secret)
protein-chip           // protein-fortified chips & puffs (Too Yumm, RiteBite Max Protein Chips)

// Within `drink`
protein-water          // clear protein water / functional protein beverages (Sofit, etc.)

// Within `packaged-food`
instant-noodle         // Maggi, Top Ramen, Knorr Soupy Noodles, YiPPee!, Ching's
packaged-biscuit       // Britannia NutriChoice, Sunfeast Dark Fantasy, McVitie's Digestive

// Within `oil-fat`
nut-butter             // almond butter, cashew butter, seed butters (Happilo, Jus Amazin, etc.)
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
| **B6** | 🟠 P1 | Greek yogurt & high-protein dairy | Epigamia, Milky Mist Skyr — fastest-growing protein dairy segment; very high log frequency among urban gym-goers. |
| **B7** | 🟡 P2 | Protein cookies, chips & biscuits | MuscleBlaze, MyFitness, NutriChoice, Too Yumm — booming snack replacement; critical for accurate snack tracking. |
| **B8** | 🟡 P2 | Instant noodles & ready-to-eat | Maggi, Top Ramen, YiPPee! — among the most frequently logged packaged foods in India; huge calorie awareness gap. |

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


### B1.5 Additional PB Brands (Market Gap Fills)

These brands have significant market presence in India but were missing from the original list:

| Brand | Pattern ID prefix | Example `id` | Notes |
|-------|-------------------|--------------|-------|
| Sundrop | `pb-sundrop-` | `pb-sundrop-crunchy` | One of India’s oldest PB brands (Agro Tech Foods); widely available in retail. Standard sweetened PB. Tag `high-fat`. |
| MuscleBlaze | `pb-muscleblaze-` | `pb-muscleblaze-high-protein-dark-choco` | High-protein PB with added whey; 30–35g protein per 100g. Tag `very-high-protein`. Cross-link with MB bar/whey products. |
| Happilo | `pb-happilo-` | `pb-happilo-natural-creamy` | Premium dry fruit brand expanding into PB; natural & dark chocolate variants. Tag `no-added-sugar` for natural line. |
| Jus Amazin | `pb-jusamazin-` | `pb-jusamazin-crunchy-organic` | Organic, single-ingredient PB; clean-label premium positioning. `dietTypes: ['veg','vegan']`. Tag `organic`. |
| Bagrry’s | `pb-bagrrys-` | `pb-bagrrys-natural-crunchy` | Budget-tier PB from established cereal brand. Standard macro profile. |
| Dr. Oetker FunFoods | `pb-droetker-funfoods-` | `pb-droetker-funfoods-crunchy` | FMCG giant’s PB line; widely available in supermarkets. Sweetened variants only. |
| Nutralite | `pb-nutralite-` | `pb-nutralite-protein-crunchy` | Marketed as high-protein PB; uses soy protein. Check label for protein % vs standard PB. |


### B1.6 Premium Nut Butters (Almond, Cashew, Seed Butters)

> **Category:** `oil-fat`  · **Subcategory:** `nut-butter`  · **itemType:** `'snack'`.
> Higher price point than PB; growing fast in Tier 1 cities among fitness-conscious users.

| Brand | Pattern ID prefix | Example `id` | Product type | Notes |
|-------|-------------------|--------------|-------------|-------|
| Pintola | `nb-pintola-almond-` | `nb-pintola-almond-creamy` | Almond butter | Already partially listed in B1.1 but needs dedicated entries. Higher protein than peanut variants. |
| Happilo | `nb-happilo-almond-` | `nb-happilo-almond-unsweetened` | Almond butter | Premium segment; unsweetened & dark chocolate. `dietTypes: ['veg','vegan']`. |
| Jus Amazin | `nb-jusamazin-almond-` | `nb-jusamazin-almond-butter` | Almond butter | Organic, single-ingredient almond butter. |
| Jus Amazin | `nb-jusamazin-cashew-` | `nb-jusamazin-cashew-butter` | Cashew butter | Rich, creamy; higher fat profile than almond. |
| MyFitness | `nb-myfitness-almond-` | `nb-myfitness-almond-crunchy` | Almond butter | Mid-range almond butter from trusted PB brand. |
| Alpino | `nb-alpino-cashew-` | `nb-alpino-cashew-butter-creamy` | Cashew butter | Vegan, gluten-free. |
| The Whole Truth | `nb-twt-almond-` | `nb-twt-almond-butter-natural` | Almond butter | Clean label; no sweeteners; transparent ingredients. |
| Sundrop | `nb-sundrop-mixed-seed-` | `nb-sundrop-mixed-seed-butter` | Seed butter (sunflower/flax/chia blend) | Budget seed butter; good for users with nut allergies. Tag `nut-free`. |

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


### B2.5 Additional Bar Brands (Market Gap Fills)

| Brand | Pattern | Example `id` | Subcategory | Notes |
|-------|---------|--------------|-------------|-------|
| HYP | `bar-hyp-lean-` | `bar-hyp-lean-20g-darkchoco` | `protein-bar` | HYP Lean Protein Bar; popular in Indian fitness community; 20g protein, low sugar. Clean-label, no added sugar. |
| HYP | `bar-hyp-sugarfree-` | `bar-hyp-sugarfree-10g-coconut` | `energy-bar` | HYP Sugar-Free bars; 10–12g protein; sweetened with stevia. Good for diabetic-friendly tracking. |
| Eat Anytime | `bar-eatanytime-protein-` | `bar-eatanytime-protein-10g-cranberry` | `energy-bar` | Mid-range bars; 10g protein; often under ₹60/bar. Popular budget option. |
| Eat Anytime | `bar-eatanytime-energy-` | `bar-eatanytime-energy-fruit-nut` | `energy-bar` | Fruit & nut bars; 5–7g protein; granola-style. |
| Open Secret | `bar-opensecret-protein-` | `bar-opensecret-protein-chocochip` | `protein-bar` | 10–15g protein; clean ingredients; popular D2C brand. Tag `no-artificial-sweetener`. |
| Grenade (Import) | `bar-grenade-carb-killa-` | `bar-grenade-carb-killa-white-choco` | `protein-bar` | UK import; 20g protein, 2g sugar; available on Amazon India. Premium import bar. |
| Max Protein (RiteBite) | `bar-max-protein-active-` | `bar-max-protein-active-greentea-orange` | `energy-bar` | RiteBite’s lighter “Active” range; 5–7g protein; positioned as healthy snack. |
| Epigamia | `bar-epigamia-protein-` | `bar-epigamia-protein-choco-brownie` | `protein-bar` | 15g protein; cross-sell with their Greek yogurt range. Newer entrant. |

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


### B3.5 Additional Muesli, Granola & Cereal Brands (Market Gap Fills)

| Brand | Pattern prefix | Example `id` | Category → Subcategory | Notes |
|-------|----------------|--------------|------------------------|-------|
| MuscleBlaze | `muesli-muscleblaze-` | `muesli-muscleblaze-dark-choco-cranberry` | `breakfast` → `muesli` | Sports-nutrition focused muesli; higher protein (soy/whey isolate added); ~15g protein per 100g. Cross-link with MB whey/bar. |
| MuscleBlaze | `granola-muscleblaze-` | `granola-muscleblaze-dark-choco` | `breakfast` → `granola` | Baked granola clusters; 10–12g protein per 100g; marketed to gym-goers. |
| Nourish Organics | `muesli-nourish-` | `muesli-nourish-amla-acai` | `breakfast` → `muesli` | Premium organic brand; whole-food ingredients; popular among clean-eating segment. |
| TATA Soulfull | `cereal-soulfull-ragi-` | `cereal-soulfull-ragi-flakes-masala` | `grain-cereal` → `breakfast-cereal` | Millet-based (ragi) cereals from TATA group. Ragi Flakes, Ragi Bites in multiple flavours. Tag `gluten-free`, `millet-based`. |
| TATA Soulfull | `muesli-soulfull-` | `muesli-soulfull-millet-muesli-crunchy` | `breakfast` → `muesli` | Millet + oats muesli; crunchy and fruit variants. |
| The Whole Truth | `muesli-twt-` | `muesli-twt-no-added-sugar` | `breakfast` → `muesli` | Clean-label muesli; no added sugar; 5 ingredients. Tag `no-added-sugar`, `clean-label`. |
| The Whole Truth | `granola-twt-` | `granola-twt-dark-choco` | `breakfast` → `granola` | Baked granola; transparent ingredient list. |
| Kellogg’s | `muesli-kelloggs-` | `muesli-kelloggs-fruit-nut` | `breakfast` → `muesli` | Kellogg’s Muesli Fruit, Nut & Seeds (21% Fruit & Nut) and Nuts Delight variants. Widely available FMCG brand. |
| Kellogg’s | `granola-kelloggs-` | `granola-kelloggs-almond-cranberry` | `breakfast` → `granola` | Kellogg’s Granola (almond & cranberry, chocolate). |
| Bagrry’s | `muesli-bagrrys-` | `muesli-bagrrys-no-added-sugar` | `breakfast` → `muesli` | Well-established; their No Added Sugar Swiss Style Muesli is frequently recommended by nutritionists. High-fiber. |
| Bagrry’s | `granola-bagrrys-` | `granola-bagrrys-oat-honey` | `breakfast` → `granola` | Oat & Honey clusters; moderate sugar. |

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


### B4.4 Additional RTD & Protein Drink Brands (Market Gap Fills)

**Category:** `drink`  · **itemType:** `'drink'`  · **state:** `'ready-to-drink'`.

| Brand | Pattern prefix | Example `id` | Subcategory | Notes |
|-------|----------------|--------------|-------------|-------|
| Epigamia | `drink-epigamia-proteinshake-` | `drink-epigamia-proteinshake-20g-chocolate` | `protein-shake-rtd` | 20g protein per 200ml pack; available in Chocolate, Coffee, Vanilla. Cross-link with their Greek yogurt and bar range. |
| Sofit | `drink-sofit-protein-soy-` | `drink-sofit-protein-soy-chocolate` | `high-protein-milk` | Soy-based protein milk; 10–15g protein per pack; vegan-friendly. `dietTypes: ['veg','vegan']`. |
| Sofit | `drink-sofit-protein-water-` | `drink-sofit-protein-water-lemon` | `protein-water` | Clear whey-based protein water; 10–15g protein; zero fat; fruit flavours. Tag `zero-fat`. |
| Amul | `drink-amul-kool-protein-` | `drink-amul-kool-protein-cafe` | `flavoured-milk-health` | Amul Kool Protein — flavoured high-protein milk shake; Café, Badam variants. |
| Raw Pressery | `drink-rawpressery-protein-` | `drink-rawpressery-protein-smoothie-berry` | `protein-shake-rtd` | Premium cold-pressed protein smoothies; 15–20g protein; available in select metros. |
| Hershey’s Protein | `drink-hersheys-protein-` | `drink-hersheys-protein-shake-chocolate` | `protein-shake-rtd` | Licensed brand protein shakes available on BigBasket/Blinkit; 25g protein per bottle. |
| Complan Protein | `drink-complan-protein-` | `drink-complan-protein-shake-chocolate` | `flavoured-milk-health` | Complan Protein Shake (HUL); fortified protein milk; 20g protein per serving. Medical-nutrition crossover. |


### B4.5 Additional Bread Brands (Market Gap Fills)

| Brand | Pattern prefix | Example `id` | Subcategory | Notes |
|-------|----------------|--------------|-------------|-------|
| POMO | `bread-pomo-` | `bread-pomo-white-slice` | `packaged-bread` | Popular in South India (Karnataka, AP, Telangana). White, brown, milk bread variants. |
| Wibs | `bread-wibs-` | `bread-wibs-multigrain-slice` | `packaged-bread` | Growing brand; multigrain and whole wheat variants. |
| English Oven | `bread-englishoven-protein-` | `bread-englishoven-protein-slice` | `high-protein-bread` | English Oven Protein Bread; ~8g protein per 2 slices; gaining traction in fitness community. |
| Britannia | `bread-britannia-vita-` | `bread-britannia-vita-wholewheat-slice` | `packaged-bread` | Britannia Vita range — 100% whole wheat; iron-fortified. |

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


### B5.3 Additional Health Snack Brands (Market Gap Fills)

| Brand | Pattern prefix | Example `id` | Notes |
|-------|----------------|--------------|-------|
| Happilo | `snack-happilo-trailmix-` | `snack-happilo-trailmix-seeds-berries` | Premium dry fruit & trail mix brand; wide variety. Tag `high-protein`, `high-fiber`. |
| Happilo | `snack-happilo-roasted-` | `snack-happilo-roasted-almonds-salt-pepper` | Roasted nuts (almonds, cashews, peanuts); multiple flavours. |
| Farmley | `snack-farmley-trailmix-` | `snack-farmley-trailmix-premium` | Premium nuts & trail mixes; gaining market share. |
| Farmley | `snack-farmley-seeds-` | `snack-farmley-seeds-pumpkin-roasted` | Roasted pumpkin, sunflower, chia seed packs. |
| Open Secret | `snack-opensecret-health-` | `snack-opensecret-health-cookie-ragi-choco` | Health-position cookies with hidden nuts/seeds; popular D2C brand. |
| MuscleBlaze | `snack-muscleblaze-roasted-` | `snack-muscleblaze-roasted-superseed-mix` | Roasted seed mixes; branded for fitness users. |
| MuscleBlaze | `snack-muscleblaze-protein-makhana-` | `snack-muscleblaze-protein-makhana-peri-peri` | Protein Makhana — roasted fox nuts with protein coating; trending gym snack. |
| The Whole Truth | `snack-twt-minibar-` | `snack-twt-minibar-cocoa-almond` | TWT Mini Bars — small 27g energy bars; 4–6g protein; clean label. |
| Nourish Organics | `snack-nourish-seedbar-` | `snack-nourish-seedbar-flax-amaranth` | Organic seed bars; no refined sugar. Tag `organic`. |

---

## 🟠 BATCH B6 — Greek Yogurt & High-Protein Dairy

> **Category:** `dairy`  · **Subcategories:** `greek-yogurt`, `high-protein-curd`  · **itemType:** `'snack'` or `'base-food'`.
> **state:** `'raw'` (refrigerated dairy, not cooked).
> This is the **fastest-growing protein dairy segment** in urban India. Epigamia alone has >60% market share in branded Greek yogurt. Gym-goers use these as breakfast, post-workout, or evening snacks for their high protein-to-calorie ratio.

### B6.1 Epigamia (Greek Yogurt & Protein Range)

**Brand:** `Epigamia`  · **Batch:** B6 (P1)

| Pattern ID | Example `id` | Product family | Category → Subcategory | Notes |
|-----------|---------------|----------------|------------------------|-------|
| `dairy-epigamia-greek-plain-` | `dairy-epigamia-greek-plain-90g` | Greek Yogurt (Plain, Unflavoured) | `dairy` → `greek-yogurt` | ~10g protein per 100g; low sugar. Base offering. `dietTypes: ['veg']`. Sizes: 85g, 180g, 400g cups. |
| `dairy-epigamia-greek-flavoured-` | `dairy-epigamia-greek-strawberry-85g` | Greek Yogurt (Flavoured: Strawberry, Mixed Berry, Alphonso Mango, Lemon, Blueberry) | `dairy` → `greek-yogurt` | Higher sugar than plain (~12g per 100g); use per-flavour FSSAI macros. |
| `dairy-epigamia-turbo-` | `dairy-epigamia-turbo-coffee-200ml` | Turbo Protein Yogurt (17–20g protein per serving) | `dairy` → `greek-yogurt` | High-protein fortified; 17g protein per 200ml (Coffee, Strawberry, Mango). Tag `very-high-protein`, `post-workout`. Cross-link with Epigamia bars. |
| `dairy-epigamia-turbo50-` | `dairy-epigamia-turbo50-chocolate-350ml` | Turbo 50g Protein Drink (350ml bottle) | `drink` → `protein-shake-rtd` | 50g protein per bottle. Tag `very-high-protein`, `meal-replacement`. |
| `dairy-epigamia-mishti-doi-` | `dairy-epigamia-mishti-doi-cup` | Mishti Doi (Bengali Sweet Yogurt) | `dairy` → `greek-yogurt` | Higher sugar (~14g/100g); festive/indulgence positioning. |


### B6.2 Milky Mist (Greek Yogurt & Skyr)

**Brand:** `Milky Mist`  · **Batch:** B6 (P1)

| Pattern ID | Example `id` | Product family | Category → Subcategory | Notes |
|-----------|---------------|----------------|------------------------|-------|
| `dairy-milkymist-greek-plain-` | `dairy-milkymist-greek-plain-100g` | Greek Yogurt (Plain) | `dairy` → `greek-yogurt` | Strained yogurt; ~8–10g protein per 100g. `dietTypes: ['veg']`. Popular in South India. |
| `dairy-milkymist-greek-flavoured-` | `dairy-milkymist-greek-strawberry-100g` | Greek Yogurt (Strawberry, Mango, Blueberry) | `dairy` → `greek-yogurt` | Flavoured variants; check sugar per flavour. |
| `dairy-milkymist-skyr-` | `dairy-milkymist-skyr-plain-150g` | Skyr (Icelandic-Style Strained Yogurt) | `dairy` → `greek-yogurt` | Extremely thick; ~11–12g protein per 100g; very low fat (<1g). Tag `very-high-protein`, `low-fat`. One of the best protein-to-calorie ratios in Indian dairy. |
| `dairy-milkymist-skyr-flavoured-` | `dairy-milkymist-skyr-mixed-berry-150g` | Skyr (Flavoured: Mixed Berry, Strawberry) | `dairy` → `greek-yogurt` | Slightly more sugar than plain skyr; still high-protein. |


### B6.3 Mother Dairy (Greek Yogurt & Protein Curd)

**Brand:** `Mother Dairy`  · **Batch:** B6 (P1)

| Pattern ID | Example `id` | Product family | Category → Subcategory | Notes |
|-----------|---------------|----------------|------------------------|-------|
| `dairy-motherdairy-greek-` | `dairy-motherdairy-greek-plain-100g` | Greek Yogurt (Plain) | `dairy` → `greek-yogurt` | Available in limited metros; ~8g protein per 100g. |
| `dairy-motherdairy-greek-flavoured-` | `dairy-motherdairy-greek-strawberry-100g` | Greek Yogurt (Flavoured) | `dairy` → `greek-yogurt` | Strawberry, Mango variants. |
| `dairy-motherdairy-protein-curd-` | `dairy-motherdairy-protein-curd-400g` | Protein Curd (High-Protein Dahi) | `dairy` → `high-protein-curd` | Fortified dahi with higher protein (~8–10g per 100g vs standard dahi ~3g). |


### B6.4 Other Greek Yogurt & Protein Dairy Brands

| Brand | Pattern ID prefix | Example `id` | Notes |
|-------|-------------------|--------------|-------|
| Amul | `dairy-amul-greek-` | `dairy-amul-greek-plain-125g` | Amul Greek Yogurt — new entrant; massive distribution advantage. Check for availability expansion. |
| Amul | `dairy-amul-highprotein-curd-` | `dairy-amul-highprotein-curd-400g` | Amul High Protein Probiotic Dahi; fortified curd. |
| Nestle a+ | `dairy-nestle-aplus-greek-` | `dairy-nestle-aplus-greek-plain-100g` | Nestlé a+ Grekyo — earlier branded Greek yogurt. Check if still sold. |
| Country Delight | `dairy-countrydelight-greek-` | `dairy-countrydelight-greek-150g` | D2C farm-fresh dairy brand; Greek yogurt in select cities. |

---

## 🟡 BATCH B7 — Protein Cookies, Chips & Biscuits

> **Categories:** `supplement` or `snack-street`  · **Subcategories:** `protein-cookie`, `protein-chip`, `packaged-biscuit`  · **itemType:** `'snack'`.
> This is the **fastest-growing packaged snack segment** in Indian fitness. Users replace traditional biscuits with protein cookies for macro tracking. Including standard biscuits because they are among the most frequently logged items in India.

### B7.1 Protein Cookies (MuscleBlaze, MyFitness, Open Secret)

**Subcategory:** `protein-cookie`  · **itemType:** `'snack'`.

| Brand | Pattern ID | Example `id` | Product family | Notes |
|-------|-----------|---------------|----------------|-------|
| MuscleBlaze | `cookie-muscleblaze-protein-` | `cookie-muscleblaze-protein-20g-doublechoco` | MuscleBlaze Protein Cookie (20g protein) | 20g protein per 60g cookie; multiple flavours (Double Choco, Almond Choco). Tag `high-protein`. `allergens: ['gluten','milk','soy']`. |
| MuscleBlaze | `cookie-muscleblaze-protein-10g-` | `cookie-muscleblaze-protein-10g-chocochip` | MuscleBlaze Protein Cookie (10g protein) | Lighter version; 10g protein; snack-positioned. |
| MyFitness | `cookie-myfitness-protein-` | `cookie-myfitness-protein-chocochip` | MyFitness Protein Cookie | ~12–15g protein per cookie; cross-sell with their PB range. |
| Open Secret | `cookie-opensecret-protein-` | `cookie-opensecret-protein-cashew-choco` | Open Secret Protein Cookies | 8–12g protein; hidden nuts & seeds inside. Clean ingredients; D2C favourite. |
| The Whole Truth | `cookie-twt-protein-` | `cookie-twt-protein-15g-choco-chip` | TWT Protein Cookie | 15g protein; clean label. No added sugar, no artificial sweeteners. |
| Yoga Bar | `cookie-yogabar-protein-` | `cookie-yogabar-protein-almond-choco` | Yogabar Protein Cookie | 10–12g protein; almond and dark choco variants. |


### B7.2 Protein Chips & Puffs

**Subcategory:** `protein-chip`  · **itemType:** `'snack'`.

| Brand | Pattern ID | Example `id` | Product family | Notes |
|-------|-----------|---------------|----------------|-------|
| Too Yumm | `chip-tooyumm-protein-puff-` | `chip-tooyumm-protein-puff-herbs-cheese` | Too Yumm Protein Puffs | ~6–8g protein per 28g pack; baked not fried; Herbs & Cheese, Chilli Lime, Thai Sweet Chilli. Tag `baked`, `high-protein`. |
| Too Yumm | `chip-tooyumm-multigrain-` | `chip-tooyumm-multigrain-chinese-hot` | Too Yumm Multigrain Chips | Multigrain (oats, ragi, corn, rice); not protein-focused but commonly logged health chip. |
| RiteBite Max Protein | `chip-ritebite-protein-chips-` | `chip-ritebite-protein-chips-cheese-jalapeno` | Max Protein Chips | 10g protein per 60g pack; baked. Multiple flavours. Cross-link with their protein bar range. |
| MuscleBlaze | `chip-muscleblaze-protein-chips-` | `chip-muscleblaze-protein-chips-peri-peri` | MuscleBlaze Protein Chips | 10–12g protein per pack; gym-snack positioned. |
| Cornitos | `chip-cornitos-protein-` | `chip-cornitos-protein-nachos-cheese` | Cornitos Protein Nachos | Protein-fortified nachos; 8–10g protein per 60g pack. |


### B7.3 Standard Biscuits & Health Biscuits (Most-Logged Indian Packaged Snacks)

**Subcategory:** `packaged-biscuit`  · **itemType:** `'snack'`.

> **Why include non-fitness biscuits?** Parle-G, Britannia Marie, and NutriChoice are among the top 10 most-logged packaged items in Indian diet apps. A single Parle-G packet (70–80g) is ~340–390 calories — many users have NO idea. Including these enables accurate tracking of India's most consumed packaged snack.

| Brand | Pattern ID | Example `id` | Product family | Notes |
|-------|-----------|---------------|----------------|-------|
| Britannia NutriChoice | `biscuit-britannia-nutrichoice-` | `biscuit-britannia-nutrichoice-oats-chocolate` | NutriChoice (Oats, Multi-Grain, High Fibre, Digestive) | "Health" biscuit range; tag `high-fiber`. Multiple sub-lines: Oats, Digestive, Seeds, Hi-Fibre. Still ~440–480 cal/100g. |
| Britannia NutriChoice | `biscuit-britannia-nutrichoice-protein-` | `biscuit-britannia-nutrichoice-protein-bites` | NutriChoice Protein Bites | Protein-fortified biscuits; ~8g protein per 40g serving. |
| Sunfeast Dark Fantasy | `biscuit-sunfeast-darkfantasy-` | `biscuit-sunfeast-darkfantasy-choco-fills` | Dark Fantasy Choco Fills / Original | Premium chocolate biscuit; very high calorie (~530 cal/100g). Tag `calorie-dense`. |
| McVitie's Digestive | `biscuit-mcvities-digestive-` | `biscuit-mcvities-digestive-original` | McVitie's Digestive Biscuit | ~450 cal/100g; 7g fibre per 100g; perceived as "healthy" but calorie-dense. Tag `high-fiber`. |
| Parle-G | `biscuit-parle-g-` | `biscuit-parle-g-original` | Parle-G Glucose Biscuit | ~460 cal/100g; India's most consumed biscuit; glucose-based. Critical for calorie awareness. |
| Britannia Marie Gold | `biscuit-britannia-marie-` | `biscuit-britannia-marie-gold` | Britannia Marie Gold | ~430 cal/100g; perceived as "lite" but still calorie-dense. |
| Britannia 50-50 | `biscuit-britannia-5050-` | `biscuit-britannia-5050-potazos` | Britannia 50-50 (Sweet & Salty, Potazos) | Sweet & salty; ~480 cal/100g; commonly snacked. |
| Sunfeast Bounce | `biscuit-sunfeast-bounce-` | `biscuit-sunfeast-bounce-creamfilled-choco` | Sunfeast Bounce Cream Biscuit | Cream-filled; ~490 cal/100g. Tag `calorie-dense`. |
| Unibic | `biscuit-unibic-` | `biscuit-unibic-oatmeal-raisin` | Unibic Cookies (Oatmeal, Choco Chip, Cashew) | Premium cookies; ~470 cal/100g. |
| Britannia Good Day | `biscuit-britannia-goodday-` | `biscuit-britannia-goodday-butterscotch` | Good Day (Cashew, Butter, Choco-Nut) | ~480 cal/100g; commonly paired with chai. |

---

## 🟡 BATCH B8 — Instant Noodles & Ready-to-Eat Packaged Foods

> **Category:** `packaged-food`  · **Subcategory:** `instant-noodle`  · **itemType:** `'snack'` or `'base-food'`.
> **Why this matters:** Maggi 2-Minute Noodles is the **single most-logged packaged food item** in Indian diet apps. The calorie density surprises most users — a standard 70g Maggi pack is ~310 calories. Yet most entries in existing apps use wrong values. Including all major instant noodle brands with correct FSSAI label data is critical for tracking accuracy.

### B8.1 Maggi (Nestlé) — India's #1 Instant Noodle

**Brand:** `Maggi`  · **Batch:** B8 (P2)

| Pattern ID | Example `id` | Product family | Notes |
|-----------|---------------|----------------|-------|
| `noodle-maggi-2min-masala-` | `noodle-maggi-2min-masala-70g` | Maggi 2-Minute Masala Noodles | ~310 cal per 70g pack (dry); 7g protein; 42g carbs; 13g fat. THE most logged instant food in India. Sizes: 70g (single), 140g (double), 420g (6-pack). |
| `noodle-maggi-atta-` | `noodle-maggi-atta-masala-70g` | Maggi Atta Noodles (Whole Wheat) | Slightly more fibre (~4g vs 2g); similar calories. Tag `high-fiber`. Marketed as "healthier." |
| `noodle-maggi-no-onion-garlic-` | `noodle-maggi-no-onion-garlic-70g` | Maggi No Onion No Garlic | Jain-friendly variant. Tag `jain-friendly`. `containsRootVeg: false`. `dietTypes: ['veg','jain']`. |
| `noodle-maggi-veggie-` | `noodle-maggi-veggie-masala-70g` | Maggi Veggie Masala / Veggie Atta Noodles | Contains dehydrated vegetables; slightly different macros. |
| `noodle-maggi-hot-heads-` | `noodle-maggi-hot-heads-piri-piri-71g` | Maggi Hot Heads (Piri Piri, Barbeque, etc.) | Spicier variant; ~310 cal per 71g. |
| `noodle-maggi-oats-` | `noodle-maggi-oats-masala-40g` | Maggi Oats Noodles (Masala) | Oat-flour based; ~155 cal per 40g pack; lower calorie option. Tag `high-fiber`. |
| `soup-maggi-cuppa-` | `soup-maggi-cuppa-masala-15g` | Maggi Cup-a-Noodles / Cuppa Mania | Mini instant soup noodles; ~60–70 cal per cup. |


### B8.2 Other Instant Noodle Brands

| Brand | Pattern prefix | Example `id` | Notes |
|-------|----------------|--------------|-------|
| ITC YiPPee! | `noodle-yippee-` | `noodle-yippee-magic-masala-70g` | India's #2 instant noodle; ~300 cal per 70g; Magic Masala and Classic Masala flavours. "Round block" shape (unique vs Maggi). |
| ITC YiPPee! | `noodle-yippee-scoopz-` | `noodle-yippee-scoopz-70g` | YiPPee Scoopz — different shape (short noodles, eaten with spoon); ~295 cal per 70g. |
| Top Ramen | `noodle-topramen-` | `noodle-topramen-curry-70g` | Top Ramen (Nissin); Curry, Sour & Spicy, Masala flavours. ~290 cal per 70g. |
| Top Ramen | `noodle-topramen-soupier-` | `noodle-topramen-soupier-noodles-280g` | Top Ramen Soupier Noodles — cup noodles format; ~350 cal per serving. |
| Knorr | `noodle-knorr-soupy-` | `noodle-knorr-soupy-noodles-tomato-chatpata` | Knorr Soupy Noodles (HUL); Tomato Chatpata, Mast Masala; ~270 cal per pack. Thinner noodles. |
| Ching's Secret | `noodle-chings-` | `noodle-chings-schezwan-60g` | Ching's Instant Noodles (Schezwan, Hot Garlic, Manchurian); ~280 cal per 60g. Desi Chinese flavour profile. |
| Wai Wai | `noodle-waiwai-` | `noodle-waiwai-chicken-75g` | Wai Wai Instant Noodles; hugely popular in NE India and Nepal. Chicken & Veg variants. ~310 cal per 75g. |
| Patanjali | `noodle-patanjali-atta-` | `noodle-patanjali-atta-noodles-70g` | Patanjali Atta Noodles; whole wheat; ~300 cal per 70g. Ayurvedic FMCG brand. |
| Ching's Secret | `noodle-chings-cup-` | `noodle-chings-cup-schezwan-60g` | Ching's Cup Noodles; hot water cup format. |


### B8.3 Ready-to-Eat Packaged Meals (Commonly Logged)

> **Category:** `packaged-food`  · **itemType:** `'base-food'` or `'snack'`.

| Brand | Pattern prefix | Example `id` | Notes |
|-------|----------------|--------------|-------|
| MTR | `rte-mtr-` | `rte-mtr-dal-makhani-300g` | MTR Ready-to-Eat range (Dal Makhani, Rajma Masala, Palak Paneer, Pav Bhaji). Retort pouch; ~150–180 cal per 100g. Use FSSAI label; `source: 'FSSAI-label'`. |
| Haldiram's Minute Khana | `rte-haldirams-` | `rte-haldirams-dal-tadka-300g` | Haldiram's RTE pouches; popular for travel/hostel use. Moderate calorie density. |
| ITC Kitchens of India | `rte-itc-koi-` | `rte-itc-koi-dal-bukhara-285g` | Premium RTE range from ITC Hotels recipes. Higher calorie (restaurant-style richness). |
| Gits | `rte-gits-` | `rte-gits-rajma-masala-300g` | Gits Ready Meals; budget-friendly RTE. |
| Kohinoor | `rte-kohinoor-` | `rte-kohinoor-dal-makhani-300g` | Kohinoor RTE range. |

---

## ✅ Agent Implementation Checklist (Brand Foods)

**Phase 1 — Schema & Subcategories**
- [ ] Add new `subcategory` values to `foodCategories.js` exactly as listed above (original 10 + 9 new = 19 subcategories).
- [ ] Add `brand`, `sizeVariant`, and `allergens` optional fields to the v2.2 schema.
- [ ] Update validation script to ensure brand foods have `source: 'FSSAI-label'` or explicit alternative.

**Phase 2 — Batch B1 & B2 (Highest Impact)**
- [ ] Implement all Pintola, MyFitness, Alpino, Saffola FITTIFY, Disano, Yogabar, The Whole Truth, RiteBite PB patterns.
- [ ] Implement B1.5 brands: Sundrop, MuscleBlaze, Happilo, Jus Amazin, Bagrry's, Dr. Oetker, Nutralite PBs.
- [ ] Implement B1.6 premium nut butter patterns (almond, cashew, seed butters).
- [ ] Implement all RiteBite, TWT, Yogabar, Phab, Superyou, MuscleBlaze protein/energy bar patterns.
- [ ] Implement B2.5 brands: HYP, Eat Anytime, Open Secret, Grenade, Max Protein Active, Epigamia bars.
- [ ] For each pattern, enumerate actual SKUs from brand/marketplace pages and add 1 food object per unique nutrition panel.

**Phase 3 — Batch B3 (Breakfast Cereals)**
- [ ] Implement Quaker, Saffola, Kellogg's, Bagrry's oats patterns.
- [ ] Implement True Elements & Yogabar cereal/muesli/granola patterns.
- [ ] Add other brands (Disano, Patanjali, NesPlus, Slurrp Farm) as generic patterns.
- [ ] Implement B3.5 brands: MuscleBlaze, Nourish Organics, TATA Soulfull, TWT, Kellogg's, Bagrry's muesli/granola.

**Phase 4 — Batch B4 & B5 (Drinks, Bread, Snacks)**
- [ ] Implement Amul/Mother Dairy high-protein milk; RTD shakes from MuscleBlaze, Fast&Up, Protinex.
- [ ] Implement B4.4 brands: Epigamia RTD, Sofit Protein Water, Amul Kool Protein, Raw Pressery, Hershey's, Complan.
- [ ] Implement bread patterns for Britannia, Harvest Gold, English Oven, Modern, Bonn + B4.5 additions (POMO, Wibs).
- [ ] Implement health snack patterns for True Elements, Yogabar and similar brands.
- [ ] Implement B5.3 brands: Happilo, Farmley, Open Secret, MuscleBlaze, TWT, Nourish Organics.

**Phase 5 — Batch B6 (Greek Yogurt & High-Protein Dairy)**
- [ ] Implement all Epigamia Greek Yogurt patterns (plain, flavoured, Turbo, Turbo 50g, Mishti Doi).
- [ ] Implement Milky Mist Greek Yogurt & Skyr patterns (plain, flavoured).
- [ ] Implement Mother Dairy Greek Yogurt & Protein Curd patterns.
- [ ] Add other brands (Amul Greek, Nestlé a+, Country Delight) as generic patterns.

**Phase 6 — Batch B7 (Protein Cookies, Chips & Biscuits)**
- [ ] Implement protein cookie patterns: MuscleBlaze, MyFitness, Open Secret, TWT, Yogabar.
- [ ] Implement protein chip patterns: Too Yumm, RiteBite, MuscleBlaze, Cornitos.
- [ ] Implement standard biscuit patterns: NutriChoice, Dark Fantasy, McVitie's, Parle-G, Marie Gold, 50-50, Good Day, Bounce, Unibic.
- [ ] Ensure `allergens` array is correctly populated for all biscuit/cookie entries.

**Phase 7 — Batch B8 (Instant Noodles & RTE)**
- [ ] Implement all Maggi patterns (2-Min, Atta, NONG, Veggie, Hot Heads, Oats, Cuppa).
- [ ] Implement other noodle brands: YiPPee!, Top Ramen, Knorr, Ching's, Wai Wai, Patanjali.
- [ ] Implement RTE meal patterns: MTR, Haldiram's Minute Khana, ITC Kitchens of India, Gits, Kohinoor.
- [ ] Flag Jain-friendly variants (Maggi No Onion No Garlic) with `containsRootVeg: false` and `dietTypes: ['veg','jain']`.

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
8. **Allergen field required for packaged foods:** all biscuits, cookies, chips, noodles, and bars must populate `allergens` array. Common values: `['gluten']`, `['milk','gluten']`, `['peanuts','soy']`, etc.
9. **Greek yogurt protein threshold:** any Greek yogurt / skyr entry must have ≥8g protein per 100g. If lower, re-verify label — it may be regular flavoured yogurt, not Greek.
10. **Protein cookie threshold:** any entry in `protein-cookie` subcategory must have ≥8g protein per single-serve unit. Otherwise recategorize as `packaged-biscuit`.
11. **Instant noodle sodium warning:** all instant noodle entries should populate `per100g.sodium` if available. Typical range: 800–1500mg per 100g dry. Flag if missing.
12. **No supplement powder duplication:** Do NOT add whey protein, casein, creatine, BCAA, or mass gainer entries in this file. Those are maintained in `TODO-supplement-db.md`. Cross-reference before adding any `category: 'supplement'` item.

---

*This file is intended for automated ingestion by AI agents to build out brand-specific fitness foods in `src/data/foods/indianFoods.js`. It complements (does not replace) the core base-food and restaurant-items TODOs. For whey protein & mass gainer brand data, see `TODO-supplement-db.md`.*
