-- Extend enums with values used by food items
-- Must be in a separate migration so values are committed before use

ALTER TYPE public.item_type_enum ADD VALUE IF NOT EXISTS 'condiment';
ALTER TYPE public.food_state_enum ADD VALUE IF NOT EXISTS 'ready-to-drink';
ALTER TYPE public.region_enum ADD VALUE IF NOT EXISTS 'imported';
ALTER TYPE public.region_enum ADD VALUE IF NOT EXISTS 'north-indian';
ALTER TYPE public.diet_type_enum ADD VALUE IF NOT EXISTS 'keto';
ALTER TYPE public.diet_type_enum ADD VALUE IF NOT EXISTS 'non-veg';
ALTER TYPE public.source_enum ADD VALUE IF NOT EXISTS 'brand-nutrition';
