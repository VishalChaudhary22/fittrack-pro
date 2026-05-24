-- 1. Add missing source enum values
ALTER TYPE public.source_enum ADD VALUE IF NOT EXISTS 'off-india';
ALTER TYPE public.source_enum ADD VALUE IF NOT EXISTS 'indb';
ALTER TYPE public.source_enum ADD VALUE IF NOT EXISTS 'fatsecret';

-- 2. Add barcode column
ALTER TABLE public.foods ADD COLUMN IF NOT EXISTS barcode VARCHAR(50);
CREATE INDEX IF NOT EXISTS idx_foods_barcode ON public.foods (barcode) WHERE barcode IS NOT NULL;

-- 3. Add brand column (already used in indianFoods.js Batch 7+)
ALTER TABLE public.foods ADD COLUMN IF NOT EXISTS brand VARCHAR(255);

-- 4. Add allergens column (already used in indianFoods.js Batch 7+)
ALTER TABLE public.foods ADD COLUMN IF NOT EXISTS allergens TEXT[];

-- 5. Add last_verified column
ALTER TABLE public.foods ADD COLUMN IF NOT EXISTS last_verified DATE;

-- Fix orphan 'curry' category entries
UPDATE public.foods SET category_id = 'dal-legume' WHERE category_id = 'curry';

-- Normalise dietTypes inconsistency ('non-veg' -> 'nonveg')
-- We can't easily alter array contents in Postgres without replacing the array, but we can do:
UPDATE public.foods
SET diet_types = array_replace(diet_types, 'non-veg'::public.diet_type_enum, 'nonveg'::public.diet_type_enum)
WHERE 'non-veg' = ANY(diet_types);

-- 6. Add generic 'serving' standard serving definition
INSERT INTO public.standard_servings (id, label, default_grams, used_for)
VALUES ('serving', '1 serving', 50, 'Generic food serving fallback')
ON CONFLICT (id) DO NOTHING;


