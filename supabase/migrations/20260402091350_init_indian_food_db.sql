-- Schema for Indian Food Database (FitTrack Pro)

-- =========================================================================
-- CUSTOM ENUMS
-- =========================================================================

CREATE TYPE public.diet_type_enum AS ENUM (
  'vegan',
  'veg',
  'jain',
  'egg',
  'nonveg'
);

CREATE TYPE public.fasting_type_enum AS ENUM (
  'navratri',
  'ekadashi',
  'jain-paryushana',
  'ramzan'
);

CREATE TYPE public.item_type_enum AS ENUM (
  'base-food',
  'dish',
  'drink',
  'supplement',
  'snack',
  'packaged-food'
);

CREATE TYPE public.food_state_enum AS ENUM (
  'raw',
  'cooked',
  'fried',
  'baked',
  'steamed',
  'roasted'
);

CREATE TYPE public.region_enum AS ENUM (
  'pan-indian',
  'north',
  'south',
  'east',
  'west'
);

CREATE TYPE public.confidence_enum AS ENUM (
  'high',
  'medium',
  'low'
);

CREATE TYPE public.source_enum AS ENUM (
  'IFCT-2017',
  'FSSAI-label',
  'USDA',
  'healthifyme',
  'curated-estimate'
);

-- =========================================================================
-- TABLES
-- =========================================================================

-- 1. Food Categories
CREATE TABLE public.food_categories (
    id VARCHAR(50) PRIMARY KEY,
    label VARCHAR(100) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Standardized Servings Library
CREATE TABLE public.standard_servings (
    id VARCHAR(50) PRIMARY KEY,
    label VARCHAR(100) NOT NULL,
    default_grams NUMERIC NOT NULL,
    used_for TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Core Foods Table
CREATE TABLE public.foods (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    hindi_name VARCHAR(255),
    name_alt TEXT[] DEFAULT '{}',
    search_terms TEXT[] DEFAULT '{}',
    category_id VARCHAR(50) NOT NULL REFERENCES public.food_categories(id),
    subcategory VARCHAR(100),
    item_type public.item_type_enum NOT NULL,
    state public.food_state_enum NOT NULL,
    region public.region_enum NOT NULL,
    default_serving_grams NUMERIC NOT NULL,
    
    -- Nutrients per 100g
    cal_per_100g NUMERIC NOT NULL,
    protein_per_100g NUMERIC NOT NULL,
    carbs_per_100g NUMERIC NOT NULL,
    fat_per_100g NUMERIC NOT NULL,
    fiber_per_100g NUMERIC NOT NULL,
    sodium_per_100g NUMERIC,        -- mg
    vitamin_b12_per_100g NUMERIC,   -- mcg
    vitamin_d_per_100g NUMERIC,     -- IU
    iron_per_100g NUMERIC,          -- mg
    calcium_per_100g NUMERIC,       -- mg
    
    -- Arrays inside foods mapping complex properties
    diet_types public.diet_type_enum[] NOT NULL DEFAULT '{}',
    tags TEXT[] DEFAULT '{}',
    fasting_types public.fasting_type_enum[] DEFAULT '{}',
    supported_consistency_types TEXT[] DEFAULT '{}',

    -- JSONB for dynamic properties
    consistency_multipliers JSONB DEFAULT '{}'::jsonb,
    
    -- Boolean flags
    is_processed BOOLEAN NOT NULL DEFAULT FALSE,
    is_fasting_food BOOLEAN NOT NULL DEFAULT FALSE,
    is_gluten_free BOOLEAN NOT NULL DEFAULT FALSE,
    is_recipe BOOLEAN NOT NULL DEFAULT FALSE,
    contains_root_veg BOOLEAN NOT NULL DEFAULT FALSE,
    has_beverage_modifiers BOOLEAN NOT NULL DEFAULT FALSE,
    
    -- Other numeric/text fields
    gi INTEGER,
    cooking_oil_note TEXT,
    estimated_oil_g NUMERIC DEFAULT 0,
    source public.source_enum NOT NULL,
    confidence public.confidence_enum NOT NULL,
    notes TEXT,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Serving specific to foods
CREATE TABLE public.food_servings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    food_id VARCHAR(100) NOT NULL REFERENCES public.foods(id) ON DELETE CASCADE,
    serving_id VARCHAR(50) NOT NULL REFERENCES public.standard_servings(id),
    label VARCHAR(100) NOT NULL,
    grams NUMERIC NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Recipes (For composition of base foods)
CREATE TABLE public.recipe_ingredients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipe_food_id VARCHAR(100) NOT NULL REFERENCES public.foods(id) ON DELETE CASCADE,
    ingredient_food_id VARCHAR(100) NOT NULL REFERENCES public.foods(id),
    grams NUMERIC NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================================================
-- INDEXES & TRIGGERS
-- =========================================================================

-- Improve search performance for arrays
CREATE INDEX idx_foods_name_alt ON public.foods USING GIN (name_alt);
CREATE INDEX idx_foods_search_terms ON public.foods USING GIN (search_terms);
CREATE INDEX idx_foods_tags ON public.foods USING GIN (tags);

-- Automate updated_at triggers
CREATE OR REPLACE FUNCTION public.update_modified_column() 
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW; 
END;
$$ language 'plpgsql';

CREATE TRIGGER update_food_categories_modtime
BEFORE UPDATE ON public.food_categories FOR EACH ROW EXECUTE FUNCTION public.update_modified_column();

CREATE TRIGGER update_standard_servings_modtime
BEFORE UPDATE ON public.standard_servings FOR EACH ROW EXECUTE FUNCTION public.update_modified_column();

CREATE TRIGGER update_foods_modtime
BEFORE UPDATE ON public.foods FOR EACH ROW EXECUTE FUNCTION public.update_modified_column();

CREATE TRIGGER update_food_servings_modtime
BEFORE UPDATE ON public.food_servings FOR EACH ROW EXECUTE FUNCTION public.update_modified_column();

CREATE TRIGGER update_recipe_ingredients_modtime
BEFORE UPDATE ON public.recipe_ingredients FOR EACH ROW EXECUTE FUNCTION public.update_modified_column();
