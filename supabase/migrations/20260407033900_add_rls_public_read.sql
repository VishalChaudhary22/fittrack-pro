-- =========================================================================
-- RLS POLICIES: Enable public read access for food database tables
-- The food database is reference data that should be readable by all users
-- (authenticated or anonymous) via the Supabase anon key.
-- =========================================================================

-- Enable RLS on all food-related tables (may already be enabled by default)
ALTER TABLE public.food_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.standard_servings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.foods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.food_servings ENABLE ROW LEVEL SECURITY;

-- Allow anyone to SELECT (read) from food reference tables
CREATE POLICY "Allow public read access on food_categories"
  ON public.food_categories FOR SELECT
  USING (true);

CREATE POLICY "Allow public read access on standard_servings"
  ON public.standard_servings FOR SELECT
  USING (true);

CREATE POLICY "Allow public read access on foods"
  ON public.foods FOR SELECT
  USING (true);

CREATE POLICY "Allow public read access on food_servings"
  ON public.food_servings FOR SELECT
  USING (true);
