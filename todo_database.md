# TODO — Food Database Expansion Strategy

## Current Status
- Existing food database infrastructure is already set up.
- Some food items are already populated.
- Objective now is to massively expand coverage and standardize ingestion pipelines.
- No schema redesign required at this stage.

---

# Primary Goal

Build one of the most comprehensive Indian-focused nutrition databases covering:

- Indian homemade foods
- Regional cuisines
- Packaged foods
- Indian FMCG brands
- Supplements
- Fast food chains
- Restaurant chains
- Protein products
- Health products
- Grocery products
- Barcode products
- Fitness-focused foods

Target coverage should include:
- Macros
- Micronutrients (where available)
- Ingredients
- Serving sizes
- Brand metadata
- Barcode support
- Images (future enhancement)
- AI/NLP-friendly food aliases

---

# Recommended Database Sources

## 1. Open Food Facts India (Highest Priority)

### Why Important
Best open-source database for:
- Indian packaged foods
- FMCG products
- Barcode products
- Branded foods
- Protein products
- Peanut butter
- Oats
- Protein bars
- Breakfast cereals
- Drinks
- Health foods

### Data Available
- Product name
- Barcode
- Brand
- Ingredients
- Nutrition labels
- Macros
- Images
- Categories
- Additives
- Serving information

### Integration Notes
- Use as primary packaged-food ingestion layer
- Build periodic sync/import jobs
- Deduplicate against existing DB
- Normalize serving sizes
- Store aliases for search

### Priority Categories
- MuscleBlaze
- Pintola
- Yoga Bar
- The Whole Truth
- RiteBite
- MyFitness
- Alpino
- Optimum Nutrition
- MyProtein
- GNC
- Fast&Up
- Oziva
- Dabur
- Amul
- Britannia
- ITC
- Nestle
- Kellogg’s
- Bagrry’s
- Slurrp Farm
- Epigamia

### Important Tasks
- Add barcode scanner compatibility
- Build product image ingestion
- Build nutrition label OCR fallback
- Add duplicate resolution logic
- Add brand normalization

---

# 2. Indian Nutrient Databank (INDB)

### Why Important
Strongest source for:
- Indian homemade foods
- Traditional recipes
- Regional Indian dishes

### Covers
- North Indian foods
- South Indian foods
- Gujarati foods
- Punjabi foods
- Bengali foods
- Maharashtrian foods
- Street foods
- Homemade dishes

### Data Quality
- Research-grade nutrition data
- Good micronutrient detail
- Better homemade-food accuracy than most APIs

### Integration Tasks
- Standardize recipe naming
- Create alias mapping
- Add multilingual search aliases later
- Add serving-size conversions

### Example Categories
- Dal variants
- Roti variants
- Sabzis
- Rice dishes
- Chaats
- Parathas
- South Indian breakfasts
- Curries
- Homemade desserts

---

# 3. IFCT 2017 (Indian Food Composition Tables)

### Purpose
Use as:
- Micronutrient enrichment layer
- Raw ingredient reference database
- Scientific nutrition validation source

### Best For
- Raw foods
- Ingredients
- Pulses
- Vegetables
- Fruits
- Dairy
- Grains
- Seeds
- Nuts

### Recommended Usage
- Use for nutrient completion
- Fill missing micronutrient values
- Improve nutrition accuracy
- Cross-check calorie inconsistencies

### Additional Notes
Not consumer-friendly directly.
Should primarily power backend nutrition enrichment.

---

# 4. FatSecret API (Strongly Recommended)

### Why Important
Excellent for:
- Supplements
- Fast food
- Restaurant chains
- International products
- Fitness products

### Best Coverage Areas
- Whey proteins
- Mass gainers
- Protein bars
- RTD protein drinks
- Fast food menus
- International packaged foods

### Indian Relevance
Surprisingly good Indian branded-food coverage.

### Important Categories
- McDonald’s India
- KFC India
- Burger King
- Subway
- Domino’s
- Pizza Hut
- Taco Bell
- Starbucks
- Tim Hortons
- Chaayos
- Blue Tokai

### Supplement Brands
- MuscleBlaze
- ON
- MyProtein
- Avvatar
- GNC
- Nakpro
- Asitis
- Labrada
- Dymatize

### Tasks
- Build API caching
- Add serving normalization
- Add duplicate detection
- Merge overlapping products with OFF data

---

# 5. Edamam API (Optional Enhancement)

### Main Purpose
AI/NLP food parsing.

### Useful For
- Natural language logging
- AI meal parsing
- Voice-based food entry
- Smart food suggestions

### Example Inputs
- “2 rotis and paneer sabzi”
- “protein oats with milk”
- “1 scoop whey and banana”

### Recommendation
Optional for MVP.
Useful later for AI-driven logging.

---

# Core Expansion Categories

## Indian Homemade Foods
Expand heavily into:
- Regional dishes
- Street foods
- Festival foods
- Homemade recipes
- Common household meals

### Examples
- Rajma chawal
- Chole bhature
- Idli sambar
- Dosa variants
- Poha
- Upma
- Khichdi
- Kadhi chawal
- Pav bhaji
- Vada pav
- Momos
- Kathi rolls

---

# Packaged Foods

## High Priority Categories
- Peanut butter
- Oats
- Muesli
- Granola
- Whole wheat bread
- White bread
- Protein bars
- Greek yogurt
- Paneer products
- Milk products
- Cheese slices
- Frozen foods
- Instant foods
- Namkeen
- Chips
- Cookies
- Biscuits
- Ice creams
- Beverages
- Energy drinks
- Electrolyte drinks

---

# Supplement Database

## Must Include
- Whey proteins
- Isolates
- Concentrates
- Plant proteins
- Creatine
- Pre-workouts
- BCAAs
- EAA products
- Mass gainers
- Protein cookies
- Protein chips
- RTD protein drinks

### Important Metadata
- Scoop size
- Protein %
- Amino profile
- Flavor variants
- Serving size
- Caffeine content
- Sugar content

---

# Restaurant & Fast Food Layer

## Chains to Prioritize
### Fast Food
- McDonald’s
- KFC
- Burger King
- Subway
- Domino’s
- Pizza Hut
- Taco Bell

### Cafes
- Starbucks
- Blue Tokai
- Third Wave Coffee
- Tim Hortons
- Chaayos

### Indian Chains
- Haldiram’s
- Bikanervala
- Sagar Ratna
- Saravana Bhavan
- Wow Momo

### Tasks
- Add standard serving sizes
- Add combo meals
- Add beverage menus
- Add regional menu variations

---

# Search & Alias Improvements

## Alias System
Store multiple aliases for foods.

### Example
Paneer Butter Masala:
- PBM
- Paneer makhani
- Butter paneer masala

### Include
- Hinglish spellings
- Misspellings
- Regional spellings
- Brand abbreviations

---

# Barcode System

## Requirements
- Barcode lookup support
- Barcode deduplication
- Barcode-to-product matching
- Product image association

### Recommended Source
Open Food Facts India

---

# Data Cleaning & Standardization

## Important Pipelines

### Deduplication
Detect duplicates using:
- Barcode
- Product name similarity
- Brand
- Serving size
- Calories/macros similarity

### Serving Normalization
Standardize:
- Per 100g
- Per serving
- Per scoop
- Per piece

### Unit Standardization
Normalize:
- grams
- ml
- scoops
- tbsp
- tsp
- cups
- pieces

---

# AI/NLP Readiness

## Future-Proofing
Prepare database for:
- AI meal logging
- Voice logging
- OCR food scanning
- Image recognition
- Chat-based nutrition queries

### Store
- Aliases
- Synonyms
- Search keywords
- Brand keywords
- Meal tags
- Cuisine tags

---

# Recommended Priority Order

## Phase 1 — Core Expansion
1. Open Food Facts India ingestion
2. Supplement database expansion
3. Indian homemade foods expansion
4. Brand normalization
5. Barcode support

## Phase 2 — Intelligence Layer
1. Alias system
2. Duplicate resolution
3. Serving normalization
4. NLP search optimization

## Phase 3 — Advanced Features
1. OCR label scanning
2. AI food parsing
3. Voice logging
4. Image-based meal recognition

---

# Suggested Engineering Tasks

## Backend
- Build ingestion workers
- Build sync jobs
- Build dedupe engine
- Add nutrition enrichment pipeline
- Add barcode indexing

## Search
- Fuzzy search
- Hinglish search
- Brand-aware ranking
- Synonym support

## Nutrition
- Micronutrient completion
- Serving-size conversion
- Protein quality scoring
- Meal scoring

---

# Important Long-Term Goal

The real competitive advantage is NOT only the food database size.

It is:
- search quality,
- Indian-food understanding,
- serving-size accuracy,
- AI logging capability,
- and clean normalization.

A smaller but highly standardized and intelligent database is more valuable than a huge noisy dataset.

---

# Final Recommended Stack

## Primary Sources
- Open Food Facts India
- INDB
- IFCT
- FatSecret

## Optional Intelligence Layer
- Edamam

## Internal Layers to Build
- Alias engine
- Deduplication engine
- Serving normalization
- Barcode system
- AI/NLP enrichment
