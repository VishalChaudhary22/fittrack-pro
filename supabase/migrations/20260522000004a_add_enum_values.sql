-- Step 1: Add missing ENUM values
-- Run this FIRST, then run the seed file.

-- source_enum
ALTER TYPE public.source_enum ADD VALUE IF NOT EXISTS 'brand-website';
ALTER TYPE public.source_enum ADD VALUE IF NOT EXISTS 'INDB-recipe';

-- item_type_enum
ALTER TYPE public.item_type_enum ADD VALUE IF NOT EXISTS 'packaged';
ALTER TYPE public.item_type_enum ADD VALUE IF NOT EXISTS 'raw';
ALTER TYPE public.item_type_enum ADD VALUE IF NOT EXISTS 'raw-food';

-- food_state_enum
ALTER TYPE public.food_state_enum ADD VALUE IF NOT EXISTS 'dry';
ALTER TYPE public.food_state_enum ADD VALUE IF NOT EXISTS 'packaged';
ALTER TYPE public.food_state_enum ADD VALUE IF NOT EXISTS 'liquid';
ALTER TYPE public.food_state_enum ADD VALUE IF NOT EXISTS 'solid';
ALTER TYPE public.food_state_enum ADD VALUE IF NOT EXISTS 'semi-solid';

-- region_enum
ALTER TYPE public.region_enum ADD VALUE IF NOT EXISTS 'north-indian';
ALTER TYPE public.region_enum ADD VALUE IF NOT EXISTS 'south-indian';
ALTER TYPE public.region_enum ADD VALUE IF NOT EXISTS 'east-indian';
ALTER TYPE public.region_enum ADD VALUE IF NOT EXISTS 'west-indian';
ALTER TYPE public.region_enum ADD VALUE IF NOT EXISTS 'kashmiri';
ALTER TYPE public.region_enum ADD VALUE IF NOT EXISTS 'bengali';

-- diet_type_enum
ALTER TYPE public.diet_type_enum ADD VALUE IF NOT EXISTS 'eggetarian';

-- fasting_type_enum
ALTER TYPE public.fasting_type_enum ADD VALUE IF NOT EXISTS 'shivratri';
ALTER TYPE public.fasting_type_enum ADD VALUE IF NOT EXISTS 'janmashtami';
ALTER TYPE public.fasting_type_enum ADD VALUE IF NOT EXISTS 'mahashivratri';

