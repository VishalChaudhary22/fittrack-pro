-- =========================================================================
-- SEED DATA: INDIAN FOOD DB
-- Generated automatically by scripts/generate_seed.js
-- =========================================================================

-- =================== FOOD CATEGORIES ===================
INSERT INTO public.food_categories (id, label) VALUES ('grain-cereal', 'Grains & Cereals') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_categories (id, label) VALUES ('roti-bread', 'Roti & Breads') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_categories (id, label) VALUES ('rice-dish', 'Rice Dishes') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_categories (id, label) VALUES ('dal-legume', 'Dals & Legumes') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_categories (id, label) VALUES ('sabzi-veg', 'Vegetables & Sabzi') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_categories (id, label) VALUES ('non-veg', 'Non-Veg Dishes') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_categories (id, label) VALUES ('egg', 'Eggs') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_categories (id, label) VALUES ('dairy', 'Dairy') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_categories (id, label) VALUES ('breakfast', 'Breakfast & Tiffin') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_categories (id, label) VALUES ('snack-street', 'Snacks & Street Food') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_categories (id, label) VALUES ('sweet-mithai', 'Sweets & Mithai') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_categories (id, label) VALUES ('fruit', 'Fruits') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_categories (id, label) VALUES ('drink', 'Drinks & Beverages') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_categories (id, label) VALUES ('oil-fat', 'Oils & Fats') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_categories (id, label) VALUES ('condiment', 'Condiments & Sides') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_categories (id, label) VALUES ('supplement', 'Supplements & Protein') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_categories (id, label) VALUES ('packaged-food', 'Packaged & Fast Food') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_categories (id, label) VALUES ('millet', 'Millets & Ancient Grains') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_categories (id, label) VALUES ('sprout-soy', 'Sprouts & Plant Protein') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_categories (id, label) VALUES ('fasting-food', 'Fasting & Vrat Foods') ON CONFLICT (id) DO NOTHING;

-- =================== STANDARD SERVINGS ===================
INSERT INTO public.standard_servings (id, label, default_grams, used_for) VALUES ('roti', '1 roti/chapati', 35, 'Roti, chapati, phulka') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.standard_servings (id, label, default_grams, used_for) VALUES ('paratha', '1 paratha', 60, 'Aloo/gobi/plain paratha') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.standard_servings (id, label, default_grams, used_for) VALUES ('katori', '1 katori', 150, 'Dal, sabzi, curry (homestyle)') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.standard_servings (id, label, default_grams, used_for) VALUES ('bowl', '1 bowl', 200, 'Rice, khichdi, soup (homestyle)') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.standard_servings (id, label, default_grams, used_for) VALUES ('plate', '1 plate', 300, 'Biryani, thali portion (homestyle)') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.standard_servings (id, label, default_grams, used_for) VALUES ('piece', '1 piece', 40, 'Samosa (~80g), ladoo (~40g)') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.standard_servings (id, label, default_grams, used_for) VALUES ('glass', '1 glass', 200, 'Milk, lassi, juice') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.standard_servings (id, label, default_grams, used_for) VALUES ('cup', '1 cup', 150, 'Tea, coffee') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.standard_servings (id, label, default_grams, used_for) VALUES ('tbsp', '1 tablespoon', 15, 'Ghee, oil, honey, sugar') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.standard_servings (id, label, default_grams, used_for) VALUES ('scoop', '1 scoop', 30, 'Whey protein, mass gainer') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.standard_servings (id, label, default_grams, used_for) VALUES ('slice', '1 slice', 30, 'Bread, pizza, cake') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.standard_servings (id, label, default_grams, used_for) VALUES ('g100', '100g', 100, 'Universal reference') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.standard_servings (id, label, default_grams, used_for) VALUES ('custom', 'Custom (g)', 1, 'Any food') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.standard_servings (id, label, default_grams, used_for) VALUES ('handful', '1 handful', 30, 'roasted chana, makhana, nuts, dry fruits') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.standard_servings (id, label, default_grams, used_for) VALUES ('medium', '1 medium', 120, 'banana (~120g), apple (~150g), mango (~200g)') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.standard_servings (id, label, default_grams, used_for) VALUES ('egg', '1 egg', 50, 'whole egg unit') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.standard_servings (id, label, default_grams, used_for) VALUES ('takeaway-container', '1 takeaway container', 480, 'standard Swiggy/Zomato gravy container (dal, sabzi, curry)') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.standard_servings (id, label, default_grams, used_for) VALUES ('restaurant-portion', '1 restaurant portion', 600, 'single restaurant biryani order, dhaba main dish') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.standard_servings (id, label, default_grams, used_for) VALUES ('thali', '1 full thali', 900, 'complete restaurant/dhaba thali with multiple components') ON CONFLICT (id) DO NOTHING;

-- =================== CORE FOOD DATA ===================

INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'roti-wheat', 
  'Roti (Whole Wheat, Unbuttered)', 
  'रोटी', 
  ARRAY['chapati', 'phulka']::TEXT[], 
  ARRAY['roti', 'chapati', 'phulka', 'fulka', 'wheat bread']::TEXT[], 
  'roti-bread', 
  'flatbread', 
  'base-food'::public.item_type_enum, 
  'cooked'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  35,
  298, 9.7, 60.1, 1.8, 9.4,
  NULL, NULL, NULL, 3.5, 34,
  '{"vegan","veg","jain"}'::public.diet_type_enum[], 
  ARRAY['lunch', 'dinner', 'budget-friendly']::TEXT[], 
  '{}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  false, false, false, false, false, false,
  62, 
  NULL, 
  0, 
  'IFCT-2017'::public.source_enum, 
  'high'::public.confidence_enum, 
  'Base values without ghee/oil brushing.'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  hindi_name = EXCLUDED.hindi_name,
  name_alt = EXCLUDED.name_alt,
  search_terms = EXCLUDED.search_terms,
  category_id = EXCLUDED.category_id,
  subcategory = EXCLUDED.subcategory,
  item_type = EXCLUDED.item_type,
  state = EXCLUDED.state,
  region = EXCLUDED.region,
  default_serving_grams = EXCLUDED.default_serving_grams,
  cal_per_100g = EXCLUDED.cal_per_100g,
  protein_per_100g = EXCLUDED.protein_per_100g,
  carbs_per_100g = EXCLUDED.carbs_per_100g,
  fat_per_100g = EXCLUDED.fat_per_100g,
  fiber_per_100g = EXCLUDED.fiber_per_100g,
  diet_types = EXCLUDED.diet_types,
  tags = EXCLUDED.tags,
  is_processed = EXCLUDED.is_processed,
  contains_root_veg = EXCLUDED.contains_root_veg;

  -- Servings for roti-wheat
  DELETE FROM public.food_servings WHERE food_id = 'roti-wheat';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('roti-wheat', 'roti', '1 roti', 35);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('roti-wheat', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'paratha-aloo', 
  'Aloo Paratha (Stuffed)', 
  'आलू पराठा', 
  ARRAY['potato stuffed paratha', 'aloo ka paratha']::TEXT[], 
  ARRAY['aloo', 'paratha', 'potato parata', 'parata']::TEXT[], 
  'roti-bread', 
  'stuffed-flatbread', 
  'dish'::public.item_type_enum, 
  'cooked'::public.food_state_enum, 
  'north'::public.region_enum, 
  100,
  260, 5.5, 38, 9.5, 4,
  300, NULL, NULL, 2.1, 25,
  '{"vegan","veg"}'::public.diet_type_enum[], 
  ARRAY['breakfast', 'lunch', 'high-carb']::TEXT[], 
  '{}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  false, false, false, false, true, false,
  70, 
  'Values include oil used during cooking inside the dough. Add extra for external butter/ghee.', 
  6, 
  'healthifyme'::public.source_enum, 
  'medium'::public.confidence_enum, 
  'Slightly higher calorie content than plain roti due to potato mixture and residual pan oil.'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  hindi_name = EXCLUDED.hindi_name,
  name_alt = EXCLUDED.name_alt,
  search_terms = EXCLUDED.search_terms,
  category_id = EXCLUDED.category_id,
  subcategory = EXCLUDED.subcategory,
  item_type = EXCLUDED.item_type,
  state = EXCLUDED.state,
  region = EXCLUDED.region,
  default_serving_grams = EXCLUDED.default_serving_grams,
  cal_per_100g = EXCLUDED.cal_per_100g,
  protein_per_100g = EXCLUDED.protein_per_100g,
  carbs_per_100g = EXCLUDED.carbs_per_100g,
  fat_per_100g = EXCLUDED.fat_per_100g,
  fiber_per_100g = EXCLUDED.fiber_per_100g,
  diet_types = EXCLUDED.diet_types,
  tags = EXCLUDED.tags,
  is_processed = EXCLUDED.is_processed,
  contains_root_veg = EXCLUDED.contains_root_veg;

  -- Servings for paratha-aloo
  DELETE FROM public.food_servings WHERE food_id = 'paratha-aloo';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('paratha-aloo', 'paratha', '1 medium paratha', 100);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('paratha-aloo', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'bajra-roti', 
  'Bajra Roti (Pearl Millet)', 
  'बाजरे की रोटी', 
  ARRAY['bajre ki roti', 'bajra bhakri']::TEXT[], 
  ARRAY['bajra', 'millet roti', 'bhakri', 'bajri']::TEXT[], 
  'millet', 
  'flatbread', 
  'base-food'::public.item_type_enum, 
  'cooked'::public.food_state_enum, 
  'north'::public.region_enum, 
  50,
  361, 11.6, 67.5, 5, 11.5,
  10, NULL, NULL, 8, 42,
  '{"vegan","veg","jain"}'::public.diet_type_enum[], 
  ARRAY['lunch', 'dinner', 'high-fiber', 'high-protein', 'budget-friendly', 'gluten-free']::TEXT[], 
  '{}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  false, false, true, false, false, false,
  54, 
  NULL, 
  0, 
  'IFCT-2017'::public.source_enum, 
  'high'::public.confidence_enum, 
  'Excellent high-fiber alternative to wheat. Often consumed with ghee in winters.'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  hindi_name = EXCLUDED.hindi_name,
  name_alt = EXCLUDED.name_alt,
  search_terms = EXCLUDED.search_terms,
  category_id = EXCLUDED.category_id,
  subcategory = EXCLUDED.subcategory,
  item_type = EXCLUDED.item_type,
  state = EXCLUDED.state,
  region = EXCLUDED.region,
  default_serving_grams = EXCLUDED.default_serving_grams,
  cal_per_100g = EXCLUDED.cal_per_100g,
  protein_per_100g = EXCLUDED.protein_per_100g,
  carbs_per_100g = EXCLUDED.carbs_per_100g,
  fat_per_100g = EXCLUDED.fat_per_100g,
  fiber_per_100g = EXCLUDED.fiber_per_100g,
  diet_types = EXCLUDED.diet_types,
  tags = EXCLUDED.tags,
  is_processed = EXCLUDED.is_processed,
  contains_root_veg = EXCLUDED.contains_root_veg;

  -- Servings for bajra-roti
  DELETE FROM public.food_servings WHERE food_id = 'bajra-roti';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('bajra-roti', 'roti', '1 medium roti', 50);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('bajra-roti', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'rice-white-cooked', 
  'White Rice (Cooked, Boiled)', 
  'सफेद चावल', 
  ARRAY['chawal', 'steamed rice', 'plain rice']::TEXT[], 
  ARRAY['chawal', 'rice', 'boiled rice', 'white rice']::TEXT[], 
  'rice-dish', 
  'base', 
  'base-food'::public.item_type_enum, 
  'cooked'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  200,
  130, 2.7, 28, 0.3, 0.4,
  1, NULL, NULL, 0.2, 10,
  '{"vegan","veg","jain"}'::public.diet_type_enum[], 
  ARRAY['lunch', 'dinner', 'high-carb', 'budget-friendly', 'gluten-free']::TEXT[], 
  '{}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  false, false, true, false, false, false,
  73, 
  NULL, 
  0, 
  'USDA'::public.source_enum, 
  'high'::public.confidence_enum, 
  'Calorie density varies slightly by water absorption (sona masuri vs basmati).'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  hindi_name = EXCLUDED.hindi_name,
  name_alt = EXCLUDED.name_alt,
  search_terms = EXCLUDED.search_terms,
  category_id = EXCLUDED.category_id,
  subcategory = EXCLUDED.subcategory,
  item_type = EXCLUDED.item_type,
  state = EXCLUDED.state,
  region = EXCLUDED.region,
  default_serving_grams = EXCLUDED.default_serving_grams,
  cal_per_100g = EXCLUDED.cal_per_100g,
  protein_per_100g = EXCLUDED.protein_per_100g,
  carbs_per_100g = EXCLUDED.carbs_per_100g,
  fat_per_100g = EXCLUDED.fat_per_100g,
  fiber_per_100g = EXCLUDED.fiber_per_100g,
  diet_types = EXCLUDED.diet_types,
  tags = EXCLUDED.tags,
  is_processed = EXCLUDED.is_processed,
  contains_root_veg = EXCLUDED.contains_root_veg;

  -- Servings for rice-white-cooked
  DELETE FROM public.food_servings WHERE food_id = 'rice-white-cooked';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('rice-white-cooked', 'bowl', '1 bowl', 200);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('rice-white-cooked', 'katori', '1 katori', 150);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('rice-white-cooked', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'dal-toor-cooked', 
  'Toor Dal (Cooked, Arhar Dal)', 
  'तुअर दाल', 
  ARRAY['arhar dal', 'toovar dal', 'pigeon pea', 'yellow dal']::TEXT[], 
  ARRAY['toovar', 'tuvar', 'tuver', 'arhar', 'toor dal', 'yellow dal']::TEXT[], 
  'dal-legume', 
  'legume-curry', 
  'dish'::public.item_type_enum, 
  'cooked'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  150,
  116, 7, 20, 0.4, 4,
  120, NULL, NULL, 1.5, 25,
  '{"vegan","veg","jain"}'::public.diet_type_enum[], 
  ARRAY['lunch', 'dinner', 'high-fiber', 'high-protein', 'budget-friendly']::TEXT[], 
  '{}'::public.fasting_type_enum[], 
  ARRAY['thin', 'thick']::TEXT[], 
  '{"thin":0.7,"standard":1,"thick":1.3}'::jsonb,
  false, false, true, false, false, false,
  42, 
  'Includes ~1 tsp oil/ghee for tadka. Add separately if tracking precisely.', 
  4, 
  'healthifyme'::public.source_enum, 
  'medium'::public.confidence_enum, 
  'Thick restaurant versions will have ~30% higher calories and fat.'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  hindi_name = EXCLUDED.hindi_name,
  name_alt = EXCLUDED.name_alt,
  search_terms = EXCLUDED.search_terms,
  category_id = EXCLUDED.category_id,
  subcategory = EXCLUDED.subcategory,
  item_type = EXCLUDED.item_type,
  state = EXCLUDED.state,
  region = EXCLUDED.region,
  default_serving_grams = EXCLUDED.default_serving_grams,
  cal_per_100g = EXCLUDED.cal_per_100g,
  protein_per_100g = EXCLUDED.protein_per_100g,
  carbs_per_100g = EXCLUDED.carbs_per_100g,
  fat_per_100g = EXCLUDED.fat_per_100g,
  fiber_per_100g = EXCLUDED.fiber_per_100g,
  diet_types = EXCLUDED.diet_types,
  tags = EXCLUDED.tags,
  is_processed = EXCLUDED.is_processed,
  contains_root_veg = EXCLUDED.contains_root_veg;

  -- Servings for dal-toor-cooked
  DELETE FROM public.food_servings WHERE food_id = 'dal-toor-cooked';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('dal-toor-cooked', 'katori', '1 katori (homestyle)', 150);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('dal-toor-cooked', 'bowl', '1 bowl', 200);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('dal-toor-cooked', 'takeaway-container', '1 takeaway container', 480);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('dal-toor-cooked', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'rajma-curry', 
  'Rajma Masala (Kidney Bean Curry)', 
  'राजमा मसाला', 
  ARRAY['rajma chawal gravy', 'red kidney beans']::TEXT[], 
  ARRAY['rajma', 'rajhma', 'kidney beans', 'red beans']::TEXT[], 
  'dal-legume', 
  'legume-curry', 
  'dish'::public.item_type_enum, 
  'cooked'::public.food_state_enum, 
  'north'::public.region_enum, 
  150,
  105, 7, 17, 2, 6,
  250, NULL, NULL, 2.5, 30,
  '{"vegan","veg"}'::public.diet_type_enum[], 
  ARRAY['lunch', 'dinner', 'high-fiber', 'high-protein']::TEXT[], 
  '{}'::public.fasting_type_enum[], 
  ARRAY['thin', 'thick']::TEXT[], 
  '{"thin":0.7,"standard":1,"thick":1.3}'::jsonb,
  false, false, true, false, true, false,
  30, 
  'Estimates 1-2 tsp oil per serving. Usually requires more oil to sautée onion base.', 
  6, 
  'healthifyme'::public.source_enum, 
  'medium'::public.confidence_enum, 
  'Very high fiber and low GI.'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  hindi_name = EXCLUDED.hindi_name,
  name_alt = EXCLUDED.name_alt,
  search_terms = EXCLUDED.search_terms,
  category_id = EXCLUDED.category_id,
  subcategory = EXCLUDED.subcategory,
  item_type = EXCLUDED.item_type,
  state = EXCLUDED.state,
  region = EXCLUDED.region,
  default_serving_grams = EXCLUDED.default_serving_grams,
  cal_per_100g = EXCLUDED.cal_per_100g,
  protein_per_100g = EXCLUDED.protein_per_100g,
  carbs_per_100g = EXCLUDED.carbs_per_100g,
  fat_per_100g = EXCLUDED.fat_per_100g,
  fiber_per_100g = EXCLUDED.fiber_per_100g,
  diet_types = EXCLUDED.diet_types,
  tags = EXCLUDED.tags,
  is_processed = EXCLUDED.is_processed,
  contains_root_veg = EXCLUDED.contains_root_veg;

  -- Servings for rajma-curry
  DELETE FROM public.food_servings WHERE food_id = 'rajma-curry';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('rajma-curry', 'katori', '1 katori (homestyle)', 150);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('rajma-curry', 'bowl', '1 bowl', 200);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('rajma-curry', 'takeaway-container', '1 takeaway container', 480);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('rajma-curry', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'soya-chunks-dry', 
  'Soya Chunks (Dry/Raw)', 
  'सोया चंक्स', 
  ARRAY['soyabean badi', 'tvp', 'nutrela', 'textured vegetable protein']::TEXT[], 
  ARRAY['soya', 'soyabean', 'nutrela', 'badi', 'tvp', 'chunks']::TEXT[], 
  'sprout-soy', 
  'soy', 
  'supplement'::public.item_type_enum, 
  'raw'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  50,
  345, 52, 33, 0.5, 13,
  15, NULL, NULL, 15, 350,
  '{"vegan","veg","jain"}'::public.diet_type_enum[], 
  ARRAY['muscle-building', 'very-high-protein', 'budget-friendly', 'high-fiber']::TEXT[], 
  '{}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  true, false, true, false, false, false,
  15, 
  NULL, 
  0, 
  'FSSAI-label'::public.source_enum, 
  'high'::public.confidence_enum, 
  'Extremely protein dense. Values are for DRY weight. Multiply weight by ~3 after boiling.'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  hindi_name = EXCLUDED.hindi_name,
  name_alt = EXCLUDED.name_alt,
  search_terms = EXCLUDED.search_terms,
  category_id = EXCLUDED.category_id,
  subcategory = EXCLUDED.subcategory,
  item_type = EXCLUDED.item_type,
  state = EXCLUDED.state,
  region = EXCLUDED.region,
  default_serving_grams = EXCLUDED.default_serving_grams,
  cal_per_100g = EXCLUDED.cal_per_100g,
  protein_per_100g = EXCLUDED.protein_per_100g,
  carbs_per_100g = EXCLUDED.carbs_per_100g,
  fat_per_100g = EXCLUDED.fat_per_100g,
  fiber_per_100g = EXCLUDED.fiber_per_100g,
  diet_types = EXCLUDED.diet_types,
  tags = EXCLUDED.tags,
  is_processed = EXCLUDED.is_processed,
  contains_root_veg = EXCLUDED.contains_root_veg;

  -- Servings for soya-chunks-dry
  DELETE FROM public.food_servings WHERE food_id = 'soya-chunks-dry';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('soya-chunks-dry', 'cup', '1 cup (dry)', 50);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('soya-chunks-dry', 'custom', 'Custom (g)', 1);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('soya-chunks-dry', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'moong-sprouts-raw', 
  'Moong Sprouts (Raw)', 
  'अंकुरित मूंग', 
  ARRAY['sprouted green gram', 'ankurit moong']::TEXT[], 
  ARRAY['moong', 'sprouts', 'ankur', 'green gram', 'sprouted']::TEXT[], 
  'sprout-soy', 
  'sprouts', 
  'base-food'::public.item_type_enum, 
  'raw'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  100,
  30, 3, 5.9, 0.2, 1.8,
  12, NULL, NULL, 1.4, 13,
  '{"vegan","veg","jain"}'::public.diet_type_enum[], 
  ARRAY['snack', 'low-calorie', 'high-fiber', 'no-cook']::TEXT[], 
  '{}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  false, false, true, false, false, false,
  25, 
  NULL, 
  0, 
  'USDA'::public.source_enum, 
  'high'::public.confidence_enum, 
  'Great volume food. Easily combined into chaats or salads.'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  hindi_name = EXCLUDED.hindi_name,
  name_alt = EXCLUDED.name_alt,
  search_terms = EXCLUDED.search_terms,
  category_id = EXCLUDED.category_id,
  subcategory = EXCLUDED.subcategory,
  item_type = EXCLUDED.item_type,
  state = EXCLUDED.state,
  region = EXCLUDED.region,
  default_serving_grams = EXCLUDED.default_serving_grams,
  cal_per_100g = EXCLUDED.cal_per_100g,
  protein_per_100g = EXCLUDED.protein_per_100g,
  carbs_per_100g = EXCLUDED.carbs_per_100g,
  fat_per_100g = EXCLUDED.fat_per_100g,
  fiber_per_100g = EXCLUDED.fiber_per_100g,
  diet_types = EXCLUDED.diet_types,
  tags = EXCLUDED.tags,
  is_processed = EXCLUDED.is_processed,
  contains_root_veg = EXCLUDED.contains_root_veg;

  -- Servings for moong-sprouts-raw
  DELETE FROM public.food_servings WHERE food_id = 'moong-sprouts-raw';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('moong-sprouts-raw', 'katori', '1 katori', 100);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('moong-sprouts-raw', 'handful', '1 handful', 30);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('moong-sprouts-raw', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'palak-paneer', 
  'Palak Paneer', 
  'पालक पनीर', 
  ARRAY['spinach and cottage cheese', 'saag paneer']::TEXT[], 
  ARRAY['palak', 'paneer', 'saag', 'spinach']::TEXT[], 
  'sabzi-veg', 
  'veg-curry', 
  'dish'::public.item_type_enum, 
  'cooked'::public.food_state_enum, 
  'north'::public.region_enum, 
  150,
  150, 6, 5, 12, 2.5,
  350, 0.4, NULL, 2.8, 150,
  '{"veg"}'::public.diet_type_enum[], 
  ARRAY['lunch', 'dinner', 'high-protein', 'high-fat']::TEXT[], 
  '{}'::public.fasting_type_enum[], 
  ARRAY['thin', 'thick']::TEXT[], 
  '{"thin":0.8,"standard":1,"thick":1.3}'::jsonb,
  false, false, true, false, true, false,
  34, 
  'Significant fat comes from paneer. Restaurant versions may add cream and extra butter.', 
  8, 
  'healthifyme'::public.source_enum, 
  'medium'::public.confidence_enum, 
  'Calcium from paneer inhibits some iron absorption from spinach.'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  hindi_name = EXCLUDED.hindi_name,
  name_alt = EXCLUDED.name_alt,
  search_terms = EXCLUDED.search_terms,
  category_id = EXCLUDED.category_id,
  subcategory = EXCLUDED.subcategory,
  item_type = EXCLUDED.item_type,
  state = EXCLUDED.state,
  region = EXCLUDED.region,
  default_serving_grams = EXCLUDED.default_serving_grams,
  cal_per_100g = EXCLUDED.cal_per_100g,
  protein_per_100g = EXCLUDED.protein_per_100g,
  carbs_per_100g = EXCLUDED.carbs_per_100g,
  fat_per_100g = EXCLUDED.fat_per_100g,
  fiber_per_100g = EXCLUDED.fiber_per_100g,
  diet_types = EXCLUDED.diet_types,
  tags = EXCLUDED.tags,
  is_processed = EXCLUDED.is_processed,
  contains_root_veg = EXCLUDED.contains_root_veg;

  -- Servings for palak-paneer
  DELETE FROM public.food_servings WHERE food_id = 'palak-paneer';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('palak-paneer', 'katori', '1 katori', 150);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('palak-paneer', 'restaurant-portion', '1 restaurant portion', 450);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('palak-paneer', 'takeaway-container', '1 takeaway container', 480);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('palak-paneer', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'aloo-gobi', 
  'Aloo Gobi (Potato Cauliflower Dry)', 
  'आलू गोभी', 
  ARRAY['aloo cauliflower', 'gobi sabzi']::TEXT[], 
  ARRAY['aloo', 'gobi', 'cauliflower', 'potato sabzi', 'gobhi']::TEXT[], 
  'sabzi-veg', 
  'dry-sabzi', 
  'dish'::public.item_type_enum, 
  'cooked'::public.food_state_enum, 
  'north'::public.region_enum, 
  150,
  90, 2, 10, 5, 3.5,
  250, NULL, NULL, 0.8, 22,
  '{"vegan","veg","jain"}'::public.diet_type_enum[], 
  ARRAY['lunch', 'dinner', 'budget-friendly']::TEXT[], 
  '{}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  false, false, true, false, true, false,
  60, 
  'Fat content primarily from oil tempering in a dry sabzi.', 
  6, 
  'healthifyme'::public.source_enum, 
  'medium'::public.confidence_enum, 
  NULL
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  hindi_name = EXCLUDED.hindi_name,
  name_alt = EXCLUDED.name_alt,
  search_terms = EXCLUDED.search_terms,
  category_id = EXCLUDED.category_id,
  subcategory = EXCLUDED.subcategory,
  item_type = EXCLUDED.item_type,
  state = EXCLUDED.state,
  region = EXCLUDED.region,
  default_serving_grams = EXCLUDED.default_serving_grams,
  cal_per_100g = EXCLUDED.cal_per_100g,
  protein_per_100g = EXCLUDED.protein_per_100g,
  carbs_per_100g = EXCLUDED.carbs_per_100g,
  fat_per_100g = EXCLUDED.fat_per_100g,
  fiber_per_100g = EXCLUDED.fiber_per_100g,
  diet_types = EXCLUDED.diet_types,
  tags = EXCLUDED.tags,
  is_processed = EXCLUDED.is_processed,
  contains_root_veg = EXCLUDED.contains_root_veg;

  -- Servings for aloo-gobi
  DELETE FROM public.food_servings WHERE food_id = 'aloo-gobi';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('aloo-gobi', 'katori', '1 katori', 150);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('aloo-gobi', 'takeaway-container', '1 takeaway container', 400);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('aloo-gobi', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'chicken-breast-raw', 
  'Chicken Breast (Raw/Boneless)', 
  'चिकन ब्रेस्ट', 
  ARRAY['murgh', 'boneless chicken']::TEXT[], 
  ARRAY['chicken', 'murgh', 'breast', 'boneless']::TEXT[], 
  'non-veg', 
  'chicken', 
  'base-food'::public.item_type_enum, 
  'raw'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  100,
  120, 22.5, 0, 2.6, 0,
  70, 0.3, NULL, 1, 15,
  '{"nonveg"}'::public.diet_type_enum[], 
  ARRAY['muscle-building', 'very-high-protein', 'low-fat', 'low-carb']::TEXT[], 
  '{}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  false, false, true, false, false, false,
  NULL, 
  NULL, 
  0, 
  'USDA'::public.source_enum, 
  'high'::public.confidence_enum, 
  'Base values for raw weight. Cooked weight shrinks by roughly 25%.'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  hindi_name = EXCLUDED.hindi_name,
  name_alt = EXCLUDED.name_alt,
  search_terms = EXCLUDED.search_terms,
  category_id = EXCLUDED.category_id,
  subcategory = EXCLUDED.subcategory,
  item_type = EXCLUDED.item_type,
  state = EXCLUDED.state,
  region = EXCLUDED.region,
  default_serving_grams = EXCLUDED.default_serving_grams,
  cal_per_100g = EXCLUDED.cal_per_100g,
  protein_per_100g = EXCLUDED.protein_per_100g,
  carbs_per_100g = EXCLUDED.carbs_per_100g,
  fat_per_100g = EXCLUDED.fat_per_100g,
  fiber_per_100g = EXCLUDED.fiber_per_100g,
  diet_types = EXCLUDED.diet_types,
  tags = EXCLUDED.tags,
  is_processed = EXCLUDED.is_processed,
  contains_root_veg = EXCLUDED.contains_root_veg;

  -- Servings for chicken-breast-raw
  DELETE FROM public.food_servings WHERE food_id = 'chicken-breast-raw';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('chicken-breast-raw', 'g100', '100g', 100);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('chicken-breast-raw', 'piece', '1 piece (~150g)', 150);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('chicken-breast-raw', 'custom', 'Custom (g)', 1);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'chicken-curry', 
  'Chicken Curry (Homestyle)', 
  'चिकन करी', 
  ARRAY['murgh masala', 'chicken gravy']::TEXT[], 
  ARRAY['chicken', 'curry', 'murgh', 'gravy']::TEXT[], 
  'non-veg', 
  'chicken', 
  'dish'::public.item_type_enum, 
  'cooked'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  200,
  145, 14, 4, 8, 0.8,
  300, 0.4, NULL, 1.2, 20,
  '{"nonveg"}'::public.diet_type_enum[], 
  ARRAY['lunch', 'dinner', 'high-protein']::TEXT[], 
  '{}'::public.fasting_type_enum[], 
  ARRAY['thin', 'thick']::TEXT[], 
  '{"thin":0.7,"standard":1,"thick":1.4}'::jsonb,
  false, false, true, false, true, false,
  NULL, 
  'Fat primarily comes from oil used in frying the masala base.', 
  10, 
  'healthifyme'::public.source_enum, 
  'medium'::public.confidence_enum, 
  'Restaurant portions have significantly more oil and potential cream (thick modifier).'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  hindi_name = EXCLUDED.hindi_name,
  name_alt = EXCLUDED.name_alt,
  search_terms = EXCLUDED.search_terms,
  category_id = EXCLUDED.category_id,
  subcategory = EXCLUDED.subcategory,
  item_type = EXCLUDED.item_type,
  state = EXCLUDED.state,
  region = EXCLUDED.region,
  default_serving_grams = EXCLUDED.default_serving_grams,
  cal_per_100g = EXCLUDED.cal_per_100g,
  protein_per_100g = EXCLUDED.protein_per_100g,
  carbs_per_100g = EXCLUDED.carbs_per_100g,
  fat_per_100g = EXCLUDED.fat_per_100g,
  fiber_per_100g = EXCLUDED.fiber_per_100g,
  diet_types = EXCLUDED.diet_types,
  tags = EXCLUDED.tags,
  is_processed = EXCLUDED.is_processed,
  contains_root_veg = EXCLUDED.contains_root_veg;

  -- Servings for chicken-curry
  DELETE FROM public.food_servings WHERE food_id = 'chicken-curry';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('chicken-curry', 'bowl', '1 bowl', 200);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('chicken-curry', 'katori', '1 katori', 150);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('chicken-curry', 'takeaway-container', '1 takeaway container', 480);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('chicken-curry', 'restaurant-portion', '1 restaurant portion', 650);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('chicken-curry', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'egg-boiled', 
  'Boiled Egg (Whole)', 
  'उबला हुआ अंडा', 
  ARRAY['anda', 'hard boiled egg']::TEXT[], 
  ARRAY['egg', 'anda', 'boiled', 'whole egg']::TEXT[], 
  'egg', 
  'whole', 
  'base-food'::public.item_type_enum, 
  'cooked'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  50,
  155, 12.6, 1.1, 10.6, 0,
  124, 1.1, 82, 1.2, 50,
  '{"egg","nonveg"}'::public.diet_type_enum[], 
  ARRAY['breakfast', 'snack', 'high-protein', 'budget-friendly']::TEXT[], 
  '{}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  false, false, true, false, false, false,
  NULL, 
  NULL, 
  0, 
  'USDA'::public.source_enum, 
  'high'::public.confidence_enum, 
  'Most of the calories, fat, B12, and D3 are in the yolk.'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  hindi_name = EXCLUDED.hindi_name,
  name_alt = EXCLUDED.name_alt,
  search_terms = EXCLUDED.search_terms,
  category_id = EXCLUDED.category_id,
  subcategory = EXCLUDED.subcategory,
  item_type = EXCLUDED.item_type,
  state = EXCLUDED.state,
  region = EXCLUDED.region,
  default_serving_grams = EXCLUDED.default_serving_grams,
  cal_per_100g = EXCLUDED.cal_per_100g,
  protein_per_100g = EXCLUDED.protein_per_100g,
  carbs_per_100g = EXCLUDED.carbs_per_100g,
  fat_per_100g = EXCLUDED.fat_per_100g,
  fiber_per_100g = EXCLUDED.fiber_per_100g,
  diet_types = EXCLUDED.diet_types,
  tags = EXCLUDED.tags,
  is_processed = EXCLUDED.is_processed,
  contains_root_veg = EXCLUDED.contains_root_veg;

  -- Servings for egg-boiled
  DELETE FROM public.food_servings WHERE food_id = 'egg-boiled';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('egg-boiled', 'egg', '1 egg (large)', 50);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('egg-boiled', 'custom', 'Custom (g)', 1);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('egg-boiled', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'milk-full-fat', 
  'Milk (Full Fat / Whole)', 
  'फुल क्रीम दूध', 
  ARRAY['doodh', 'amul gold', 'buffalo milk']::TEXT[], 
  ARRAY['milk', 'doodh', 'full fat', 'amul gold']::TEXT[], 
  'dairy', 
  'milk', 
  'base-food'::public.item_type_enum, 
  'raw'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  200,
  61, 3.2, 4.8, 3.3, 0,
  43, 0.5, 40, NULL, 113,
  '{"veg","jain","egg","nonveg"}'::public.diet_type_enum[], 
  ARRAY['breakfast', 'before-bed', 'high-protein']::TEXT[], 
  '{"navratri","ekadashi","jain-paryushana","ramzan"}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  false, true, true, false, false, false,
  31, 
  NULL, 
  0, 
  'IFCT-2017'::public.source_enum, 
  'high'::public.confidence_enum, 
  'Crucial for Indian diet. Often fortified with Vitamin D. Excellent B12 source for vegetarians.'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  hindi_name = EXCLUDED.hindi_name,
  name_alt = EXCLUDED.name_alt,
  search_terms = EXCLUDED.search_terms,
  category_id = EXCLUDED.category_id,
  subcategory = EXCLUDED.subcategory,
  item_type = EXCLUDED.item_type,
  state = EXCLUDED.state,
  region = EXCLUDED.region,
  default_serving_grams = EXCLUDED.default_serving_grams,
  cal_per_100g = EXCLUDED.cal_per_100g,
  protein_per_100g = EXCLUDED.protein_per_100g,
  carbs_per_100g = EXCLUDED.carbs_per_100g,
  fat_per_100g = EXCLUDED.fat_per_100g,
  fiber_per_100g = EXCLUDED.fiber_per_100g,
  diet_types = EXCLUDED.diet_types,
  tags = EXCLUDED.tags,
  is_processed = EXCLUDED.is_processed,
  contains_root_veg = EXCLUDED.contains_root_veg;

  -- Servings for milk-full-fat
  DELETE FROM public.food_servings WHERE food_id = 'milk-full-fat';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('milk-full-fat', 'glass', '1 glass (200ml)', 200);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('milk-full-fat', 'cup', '1 cup (150ml)', 150);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('milk-full-fat', 'g100', '100ml', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'paneer-full-fat', 
  'Paneer (Full Fat, Raw)', 
  'पनीर', 
  ARRAY['cottage cheese']::TEXT[], 
  ARRAY['paneer', 'cottage cheese']::TEXT[], 
  'dairy', 
  'cheese', 
  'base-food'::public.item_type_enum, 
  'raw'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  100,
  265, 18, 3, 20, 0,
  18, 1.1, 10, 0.1, 480,
  '{"veg","jain","egg","nonveg"}'::public.diet_type_enum[], 
  ARRAY['lunch', 'dinner', 'high-protein', 'high-fat', 'muscle-building']::TEXT[], 
  '{"navratri","ekadashi","jain-paryushana"}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  false, true, true, false, false, false,
  27, 
  NULL, 
  0, 
  'IFCT-2017'::public.source_enum, 
  'high'::public.confidence_enum, 
  'Very high in casein protein, ideal for before sleep, but calorie dense due to fat.'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  hindi_name = EXCLUDED.hindi_name,
  name_alt = EXCLUDED.name_alt,
  search_terms = EXCLUDED.search_terms,
  category_id = EXCLUDED.category_id,
  subcategory = EXCLUDED.subcategory,
  item_type = EXCLUDED.item_type,
  state = EXCLUDED.state,
  region = EXCLUDED.region,
  default_serving_grams = EXCLUDED.default_serving_grams,
  cal_per_100g = EXCLUDED.cal_per_100g,
  protein_per_100g = EXCLUDED.protein_per_100g,
  carbs_per_100g = EXCLUDED.carbs_per_100g,
  fat_per_100g = EXCLUDED.fat_per_100g,
  fiber_per_100g = EXCLUDED.fiber_per_100g,
  diet_types = EXCLUDED.diet_types,
  tags = EXCLUDED.tags,
  is_processed = EXCLUDED.is_processed,
  contains_root_veg = EXCLUDED.contains_root_veg;

  -- Servings for paneer-full-fat
  DELETE FROM public.food_servings WHERE food_id = 'paneer-full-fat';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('paneer-full-fat', 'g100', '100g', 100);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('paneer-full-fat', 'custom', 'Custom (g)', 1);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'butter-chicken', 
  'Butter Chicken (Murgh Makhani)', 
  'बटर चिकन', 
  ARRAY['murgh makhani', 'chicken makhanwala']::TEXT[], 
  ARRAY['butter chicken', 'murgh makhani', 'chicken', 'gravy']::TEXT[], 
  'non-veg', 
  'chicken', 
  'dish'::public.item_type_enum, 
  'cooked'::public.food_state_enum, 
  'north'::public.region_enum, 
  200,
  175, 12, 6, 11.5, 1,
  350, 0.4, NULL, 1.1, 30,
  '{"nonveg"}'::public.diet_type_enum[], 
  ARRAY['dinner', 'high-protein', 'high-fat']::TEXT[], 
  '{}'::public.fasting_type_enum[], 
  ARRAY['thin', 'thick']::TEXT[], 
  '{"thin":0.8,"standard":1,"thick":1.3}'::jsonb,
  false, false, true, false, true, false,
  NULL, 
  'Values include cream and butter. Heavy restaurant versions may be higher.', 
  12, 
  'healthifyme'::public.source_enum, 
  'medium'::public.confidence_enum, 
  'High in fat due to butter and cream.'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  hindi_name = EXCLUDED.hindi_name,
  name_alt = EXCLUDED.name_alt,
  search_terms = EXCLUDED.search_terms,
  category_id = EXCLUDED.category_id,
  subcategory = EXCLUDED.subcategory,
  item_type = EXCLUDED.item_type,
  state = EXCLUDED.state,
  region = EXCLUDED.region,
  default_serving_grams = EXCLUDED.default_serving_grams,
  cal_per_100g = EXCLUDED.cal_per_100g,
  protein_per_100g = EXCLUDED.protein_per_100g,
  carbs_per_100g = EXCLUDED.carbs_per_100g,
  fat_per_100g = EXCLUDED.fat_per_100g,
  fiber_per_100g = EXCLUDED.fiber_per_100g,
  diet_types = EXCLUDED.diet_types,
  tags = EXCLUDED.tags,
  is_processed = EXCLUDED.is_processed,
  contains_root_veg = EXCLUDED.contains_root_veg;

  -- Servings for butter-chicken
  DELETE FROM public.food_servings WHERE food_id = 'butter-chicken';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('butter-chicken', 'bowl', '1 bowl', 200);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('butter-chicken', 'restaurant-portion', '1 restaurant portion', 600);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('butter-chicken', 'takeaway-container', '1 takeaway container', 480);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('butter-chicken', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'tandoori-chicken', 
  'Tandoori Chicken', 
  'तंदूरी चिकन', 
  ARRAY['roasted chicken', 'chicken tandoori']::TEXT[], 
  ARRAY['tandoori', 'chicken', 'roasted chicken', 'dry chicken']::TEXT[], 
  'non-veg', 
  'chicken', 
  'dish'::public.item_type_enum, 
  'roasted'::public.food_state_enum, 
  'north'::public.region_enum, 
  150,
  140, 21, 2, 5, 0.5,
  400, 0.3, NULL, 1.2, 15,
  '{"nonveg"}'::public.diet_type_enum[], 
  ARRAY['dinner', 'high-protein', 'low-carb', 'muscle-building']::TEXT[], 
  '{}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  false, false, true, false, true, false,
  NULL, 
  'Often brushed with butter/oil while roasting.', 
  5, 
  'healthifyme'::public.source_enum, 
  'medium'::public.confidence_enum, 
  'Excellent high protein, low carb option.'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  hindi_name = EXCLUDED.hindi_name,
  name_alt = EXCLUDED.name_alt,
  search_terms = EXCLUDED.search_terms,
  category_id = EXCLUDED.category_id,
  subcategory = EXCLUDED.subcategory,
  item_type = EXCLUDED.item_type,
  state = EXCLUDED.state,
  region = EXCLUDED.region,
  default_serving_grams = EXCLUDED.default_serving_grams,
  cal_per_100g = EXCLUDED.cal_per_100g,
  protein_per_100g = EXCLUDED.protein_per_100g,
  carbs_per_100g = EXCLUDED.carbs_per_100g,
  fat_per_100g = EXCLUDED.fat_per_100g,
  fiber_per_100g = EXCLUDED.fiber_per_100g,
  diet_types = EXCLUDED.diet_types,
  tags = EXCLUDED.tags,
  is_processed = EXCLUDED.is_processed,
  contains_root_veg = EXCLUDED.contains_root_veg;

  -- Servings for tandoori-chicken
  DELETE FROM public.food_servings WHERE food_id = 'tandoori-chicken';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('tandoori-chicken', 'piece', '1 piece (leg/breast)', 150);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('tandoori-chicken', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'mutton-rogan-josh', 
  'Mutton Rogan Josh', 
  'मटन रोगन जोश', 
  ARRAY['lamb curry', 'meat curry']::TEXT[], 
  ARRAY['mutton', 'lamb', 'rogan josh', 'meat curry', 'gravy']::TEXT[], 
  'non-veg', 
  'mutton', 
  'dish'::public.item_type_enum, 
  'cooked'::public.food_state_enum, 
  'north'::public.region_enum, 
  200,
  190, 14.5, 4.5, 12.5, 1,
  320, 2.5, NULL, 2.5, 20,
  '{"nonveg"}'::public.diet_type_enum[], 
  ARRAY['dinner', 'high-protein', 'high-fat']::TEXT[], 
  '{}'::public.fasting_type_enum[], 
  ARRAY['thin', 'thick']::TEXT[], 
  '{"thin":0.8,"standard":1,"thick":1.3}'::jsonb,
  false, false, true, false, true, false,
  NULL, 
  'Mutton inherently has higher fat.', 
  10, 
  'healthifyme'::public.source_enum, 
  'medium'::public.confidence_enum, 
  'Rich source of iron and B12.'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  hindi_name = EXCLUDED.hindi_name,
  name_alt = EXCLUDED.name_alt,
  search_terms = EXCLUDED.search_terms,
  category_id = EXCLUDED.category_id,
  subcategory = EXCLUDED.subcategory,
  item_type = EXCLUDED.item_type,
  state = EXCLUDED.state,
  region = EXCLUDED.region,
  default_serving_grams = EXCLUDED.default_serving_grams,
  cal_per_100g = EXCLUDED.cal_per_100g,
  protein_per_100g = EXCLUDED.protein_per_100g,
  carbs_per_100g = EXCLUDED.carbs_per_100g,
  fat_per_100g = EXCLUDED.fat_per_100g,
  fiber_per_100g = EXCLUDED.fiber_per_100g,
  diet_types = EXCLUDED.diet_types,
  tags = EXCLUDED.tags,
  is_processed = EXCLUDED.is_processed,
  contains_root_veg = EXCLUDED.contains_root_veg;

  -- Servings for mutton-rogan-josh
  DELETE FROM public.food_servings WHERE food_id = 'mutton-rogan-josh';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('mutton-rogan-josh', 'bowl', '1 bowl', 200);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('mutton-rogan-josh', 'restaurant-portion', '1 restaurant portion', 650);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('mutton-rogan-josh', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'fish-curry', 
  'Fish Curry', 
  'मछली करी', 
  ARRAY['macher jhol', 'meen curry']::TEXT[], 
  ARRAY['fish', 'curry', 'macher jhol', 'meen', 'seafood']::TEXT[], 
  'non-veg', 
  'fish', 
  'dish'::public.item_type_enum, 
  'cooked'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  200,
  110, 11, 5, 5, 0.5,
  250, 2, 150, 0.8, 35,
  '{"nonveg"}'::public.diet_type_enum[], 
  ARRAY['lunch', 'dinner', 'high-protein']::TEXT[], 
  '{}'::public.fasting_type_enum[], 
  ARRAY['thin', 'thick']::TEXT[], 
  '{"thin":0.8,"standard":1,"thick":1.2}'::jsonb,
  false, false, true, false, true, false,
  NULL, 
  'Fish takes up some oil in the gravy preparation.', 
  7, 
  'healthifyme'::public.source_enum, 
  'medium'::public.confidence_enum, 
  'Great source of omega-3 and Vitamin D depending on fish type.'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  hindi_name = EXCLUDED.hindi_name,
  name_alt = EXCLUDED.name_alt,
  search_terms = EXCLUDED.search_terms,
  category_id = EXCLUDED.category_id,
  subcategory = EXCLUDED.subcategory,
  item_type = EXCLUDED.item_type,
  state = EXCLUDED.state,
  region = EXCLUDED.region,
  default_serving_grams = EXCLUDED.default_serving_grams,
  cal_per_100g = EXCLUDED.cal_per_100g,
  protein_per_100g = EXCLUDED.protein_per_100g,
  carbs_per_100g = EXCLUDED.carbs_per_100g,
  fat_per_100g = EXCLUDED.fat_per_100g,
  fiber_per_100g = EXCLUDED.fiber_per_100g,
  diet_types = EXCLUDED.diet_types,
  tags = EXCLUDED.tags,
  is_processed = EXCLUDED.is_processed,
  contains_root_veg = EXCLUDED.contains_root_veg;

  -- Servings for fish-curry
  DELETE FROM public.food_servings WHERE food_id = 'fish-curry';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('fish-curry', 'bowl', '1 bowl', 200);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('fish-curry', 'takeaway-container', '1 takeaway container', 480);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('fish-curry', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'chicken-tikka', 
  'Chicken Tikka (Dry)', 
  'चिकन टिक्का', 
  ARRAY['chicken kebab', 'murgh tikka']::TEXT[], 
  ARRAY['chicken', 'tikka', 'kebab', 'dry chicken']::TEXT[], 
  'non-veg', 
  'chicken', 
  'dish'::public.item_type_enum, 
  'roasted'::public.food_state_enum, 
  'north'::public.region_enum, 
  150,
  150, 20, 3.5, 5.5, 0.5,
  380, 0.3, NULL, 1, 20,
  '{"nonveg"}'::public.diet_type_enum[], 
  ARRAY['snack', 'dinner', 'high-protein', 'low-carb']::TEXT[], 
  '{}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  false, false, true, false, true, false,
  NULL, 
  'Yogurt based marinade with slight oil brushing.', 
  4, 
  'healthifyme'::public.source_enum, 
  'medium'::public.confidence_enum, 
  'Lean and high protein.'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  hindi_name = EXCLUDED.hindi_name,
  name_alt = EXCLUDED.name_alt,
  search_terms = EXCLUDED.search_terms,
  category_id = EXCLUDED.category_id,
  subcategory = EXCLUDED.subcategory,
  item_type = EXCLUDED.item_type,
  state = EXCLUDED.state,
  region = EXCLUDED.region,
  default_serving_grams = EXCLUDED.default_serving_grams,
  cal_per_100g = EXCLUDED.cal_per_100g,
  protein_per_100g = EXCLUDED.protein_per_100g,
  carbs_per_100g = EXCLUDED.carbs_per_100g,
  fat_per_100g = EXCLUDED.fat_per_100g,
  fiber_per_100g = EXCLUDED.fiber_per_100g,
  diet_types = EXCLUDED.diet_types,
  tags = EXCLUDED.tags,
  is_processed = EXCLUDED.is_processed,
  contains_root_veg = EXCLUDED.contains_root_veg;

  -- Servings for chicken-tikka
  DELETE FROM public.food_servings WHERE food_id = 'chicken-tikka';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('chicken-tikka', 'piece', '1 piece (medium)', 40);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('chicken-tikka', 'plate', '1 plate (6 pieces)', 240);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('chicken-tikka', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'tuna-canned', 
  'Tuna (Canned in Water)', 
  'टूना', 
  ARRAY['canned fish', 'chunk light tuna']::TEXT[], 
  ARRAY['tuna', 'fish', 'canned', 'seafood']::TEXT[], 
  'non-veg', 
  'fish', 
  'base-food'::public.item_type_enum, 
  'cooked'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  100,
  86, 19, 0, 0.9, 0,
  250, 2.5, 40, 1.5, 15,
  '{"nonveg"}'::public.diet_type_enum[], 
  ARRAY['muscle-building', 'very-high-protein', 'low-fat', 'low-carb']::TEXT[], 
  '{}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  true, false, true, false, false, false,
  NULL, 
  NULL, 
  0, 
  'USDA'::public.source_enum, 
  'high'::public.confidence_enum, 
  'Excellent lean protein. Values for tuna packed in water, drained.'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  hindi_name = EXCLUDED.hindi_name,
  name_alt = EXCLUDED.name_alt,
  search_terms = EXCLUDED.search_terms,
  category_id = EXCLUDED.category_id,
  subcategory = EXCLUDED.subcategory,
  item_type = EXCLUDED.item_type,
  state = EXCLUDED.state,
  region = EXCLUDED.region,
  default_serving_grams = EXCLUDED.default_serving_grams,
  cal_per_100g = EXCLUDED.cal_per_100g,
  protein_per_100g = EXCLUDED.protein_per_100g,
  carbs_per_100g = EXCLUDED.carbs_per_100g,
  fat_per_100g = EXCLUDED.fat_per_100g,
  fiber_per_100g = EXCLUDED.fiber_per_100g,
  diet_types = EXCLUDED.diet_types,
  tags = EXCLUDED.tags,
  is_processed = EXCLUDED.is_processed,
  contains_root_veg = EXCLUDED.contains_root_veg;

  -- Servings for tuna-canned
  DELETE FROM public.food_servings WHERE food_id = 'tuna-canned';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('tuna-canned', 'g100', '100g', 100);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('tuna-canned', 'custom', 'Custom (g)', 1);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'omelette-1-egg', 
  'Omelette (1 Egg)', 
  'आमलेट', 
  ARRAY['anda bhurji base', 'egg omelet']::TEXT[], 
  ARRAY['omelette', 'omelet', 'egg', 'anda']::TEXT[], 
  'egg', 
  'dish', 
  'dish'::public.item_type_enum, 
  'fried'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  60,
  190, 11.5, 2.5, 14.5, 0.5,
  250, 0.9, 65, 1.5, 55,
  '{"egg","nonveg"}'::public.diet_type_enum[], 
  ARRAY['breakfast', 'high-protein']::TEXT[], 
  '{}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  false, false, true, false, true, false,
  NULL, 
  'Cooked with roughly 1 tsp oil/butter.', 
  4, 
  'healthifyme'::public.source_enum, 
  'medium'::public.confidence_enum, 
  'Calorie variation depends heavily on oil/butter used.'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  hindi_name = EXCLUDED.hindi_name,
  name_alt = EXCLUDED.name_alt,
  search_terms = EXCLUDED.search_terms,
  category_id = EXCLUDED.category_id,
  subcategory = EXCLUDED.subcategory,
  item_type = EXCLUDED.item_type,
  state = EXCLUDED.state,
  region = EXCLUDED.region,
  default_serving_grams = EXCLUDED.default_serving_grams,
  cal_per_100g = EXCLUDED.cal_per_100g,
  protein_per_100g = EXCLUDED.protein_per_100g,
  carbs_per_100g = EXCLUDED.carbs_per_100g,
  fat_per_100g = EXCLUDED.fat_per_100g,
  fiber_per_100g = EXCLUDED.fiber_per_100g,
  diet_types = EXCLUDED.diet_types,
  tags = EXCLUDED.tags,
  is_processed = EXCLUDED.is_processed,
  contains_root_veg = EXCLUDED.contains_root_veg;

  -- Servings for omelette-1-egg
  DELETE FROM public.food_servings WHERE food_id = 'omelette-1-egg';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('omelette-1-egg', 'piece', '1 omelette (from 1 egg)', 60);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('omelette-1-egg', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'egg-bhurji', 
  'Egg Bhurji (Scrambled Eggs)', 
  'अंडा भुर्जी', 
  ARRAY['anda bhurji', 'paneer bhurji egg']::TEXT[], 
  ARRAY['bhurji', 'egg', 'anda', 'scrambled']::TEXT[], 
  'egg', 
  'dish', 
  'dish'::public.item_type_enum, 
  'fried'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  100,
  180, 11, 4.5, 12.5, 1,
  300, 0.8, 60, 1.6, 50,
  '{"egg","nonveg"}'::public.diet_type_enum[], 
  ARRAY['breakfast', 'lunch', 'dinner', 'high-protein']::TEXT[], 
  '{}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  false, false, true, false, true, false,
  30, 
  'Contains oils from onion/tomato masala base.', 
  6, 
  'healthifyme'::public.source_enum, 
  'medium'::public.confidence_enum, 
  'Added vegetables bulk up the volume and lower calorie density slightly compared to pure egg.'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  hindi_name = EXCLUDED.hindi_name,
  name_alt = EXCLUDED.name_alt,
  search_terms = EXCLUDED.search_terms,
  category_id = EXCLUDED.category_id,
  subcategory = EXCLUDED.subcategory,
  item_type = EXCLUDED.item_type,
  state = EXCLUDED.state,
  region = EXCLUDED.region,
  default_serving_grams = EXCLUDED.default_serving_grams,
  cal_per_100g = EXCLUDED.cal_per_100g,
  protein_per_100g = EXCLUDED.protein_per_100g,
  carbs_per_100g = EXCLUDED.carbs_per_100g,
  fat_per_100g = EXCLUDED.fat_per_100g,
  fiber_per_100g = EXCLUDED.fiber_per_100g,
  diet_types = EXCLUDED.diet_types,
  tags = EXCLUDED.tags,
  is_processed = EXCLUDED.is_processed,
  contains_root_veg = EXCLUDED.contains_root_veg;

  -- Servings for egg-bhurji
  DELETE FROM public.food_servings WHERE food_id = 'egg-bhurji';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('egg-bhurji', 'katori', '1 katori (from 2 eggs)', 150);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('egg-bhurji', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'egg-white', 
  'Egg White (Boiled/Raw)', 
  'अंडे की सफेदी', 
  ARRAY['safedi', 'anda white']::TEXT[], 
  ARRAY['egg white', 'safedi', 'egg', 'white']::TEXT[], 
  'egg', 
  'white', 
  'base-food'::public.item_type_enum, 
  'cooked'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  33,
  52, 10.9, 0.7, 0.2, 0,
  166, 0.1, NULL, 0.1, 7,
  '{"egg","nonveg"}'::public.diet_type_enum[], 
  ARRAY['muscle-building', 'very-high-protein', 'low-fat', 'low-carb']::TEXT[], 
  '{}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  false, false, true, false, false, false,
  NULL, 
  NULL, 
  0, 
  'USDA'::public.source_enum, 
  'high'::public.confidence_enum, 
  'Pure protein source. Almost all fat and micronutrients are left behind in the yolk.'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  hindi_name = EXCLUDED.hindi_name,
  name_alt = EXCLUDED.name_alt,
  search_terms = EXCLUDED.search_terms,
  category_id = EXCLUDED.category_id,
  subcategory = EXCLUDED.subcategory,
  item_type = EXCLUDED.item_type,
  state = EXCLUDED.state,
  region = EXCLUDED.region,
  default_serving_grams = EXCLUDED.default_serving_grams,
  cal_per_100g = EXCLUDED.cal_per_100g,
  protein_per_100g = EXCLUDED.protein_per_100g,
  carbs_per_100g = EXCLUDED.carbs_per_100g,
  fat_per_100g = EXCLUDED.fat_per_100g,
  fiber_per_100g = EXCLUDED.fiber_per_100g,
  diet_types = EXCLUDED.diet_types,
  tags = EXCLUDED.tags,
  is_processed = EXCLUDED.is_processed,
  contains_root_veg = EXCLUDED.contains_root_veg;

  -- Servings for egg-white
  DELETE FROM public.food_servings WHERE food_id = 'egg-white';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('egg-white', 'egg', '1 egg white (~33g)', 33);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('egg-white', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'egg-curry', 
  'Egg Curry (Anda Masala)', 
  'अंडा करी', 
  ARRAY['anda curry', 'egg gravy']::TEXT[], 
  ARRAY['egg', 'curry', 'anda masala', 'gravy']::TEXT[], 
  'egg', 
  'dish', 
  'dish'::public.item_type_enum, 
  'cooked'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  200,
  125, 6.5, 5.5, 8.5, 1,
  250, 0.5, 30, 1.2, 35,
  '{"egg","nonveg"}'::public.diet_type_enum[], 
  ARRAY['lunch', 'dinner', 'high-protein']::TEXT[], 
  '{}'::public.fasting_type_enum[], 
  ARRAY['thin', 'thick']::TEXT[], 
  '{"thin":0.8,"standard":1,"thick":1.3}'::jsonb,
  false, false, true, false, true, false,
  30, 
  'Contains oil for frying eggs and masala base.', 
  6, 
  'healthifyme'::public.source_enum, 
  'medium'::public.confidence_enum, 
  'Assumes half egg and half gravy by weight.'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  hindi_name = EXCLUDED.hindi_name,
  name_alt = EXCLUDED.name_alt,
  search_terms = EXCLUDED.search_terms,
  category_id = EXCLUDED.category_id,
  subcategory = EXCLUDED.subcategory,
  item_type = EXCLUDED.item_type,
  state = EXCLUDED.state,
  region = EXCLUDED.region,
  default_serving_grams = EXCLUDED.default_serving_grams,
  cal_per_100g = EXCLUDED.cal_per_100g,
  protein_per_100g = EXCLUDED.protein_per_100g,
  carbs_per_100g = EXCLUDED.carbs_per_100g,
  fat_per_100g = EXCLUDED.fat_per_100g,
  fiber_per_100g = EXCLUDED.fiber_per_100g,
  diet_types = EXCLUDED.diet_types,
  tags = EXCLUDED.tags,
  is_processed = EXCLUDED.is_processed,
  contains_root_veg = EXCLUDED.contains_root_veg;

  -- Servings for egg-curry
  DELETE FROM public.food_servings WHERE food_id = 'egg-curry';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('egg-curry', 'bowl', '1 bowl', 200);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('egg-curry', 'katori', '1 katori', 150);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('egg-curry', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'milk-toned', 
  'Milk (Toned, 3% Fat)', 
  'टोंड दूध', 
  ARRAY['toned doodh', 'amul taaza']::TEXT[], 
  ARRAY['milk', 'doodh', 'toned', 'amul taaza']::TEXT[], 
  'dairy', 
  'milk', 
  'base-food'::public.item_type_enum, 
  'raw'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  200,
  59, 3.2, 4.8, 3, 0,
  43, 0.4, 40, NULL, 115,
  '{"veg","jain","egg","nonveg"}'::public.diet_type_enum[], 
  ARRAY['breakfast', 'before-bed', 'high-protein']::TEXT[], 
  '{"navratri","ekadashi","jain-paryushana","ramzan"}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  false, true, true, false, false, false,
  31, 
  NULL, 
  0, 
  'IFCT-2017'::public.source_enum, 
  'high'::public.confidence_enum, 
  'Common Indian household milk.'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  hindi_name = EXCLUDED.hindi_name,
  name_alt = EXCLUDED.name_alt,
  search_terms = EXCLUDED.search_terms,
  category_id = EXCLUDED.category_id,
  subcategory = EXCLUDED.subcategory,
  item_type = EXCLUDED.item_type,
  state = EXCLUDED.state,
  region = EXCLUDED.region,
  default_serving_grams = EXCLUDED.default_serving_grams,
  cal_per_100g = EXCLUDED.cal_per_100g,
  protein_per_100g = EXCLUDED.protein_per_100g,
  carbs_per_100g = EXCLUDED.carbs_per_100g,
  fat_per_100g = EXCLUDED.fat_per_100g,
  fiber_per_100g = EXCLUDED.fiber_per_100g,
  diet_types = EXCLUDED.diet_types,
  tags = EXCLUDED.tags,
  is_processed = EXCLUDED.is_processed,
  contains_root_veg = EXCLUDED.contains_root_veg;

  -- Servings for milk-toned
  DELETE FROM public.food_servings WHERE food_id = 'milk-toned';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('milk-toned', 'glass', '1 glass (200ml)', 200);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('milk-toned', 'cup', '1 cup (150ml)', 150);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('milk-toned', 'g100', '100ml', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'curd-full-fat', 
  'Curd / Dahi (Full Fat)', 
  'दही', 
  ARRAY['dahi', 'plain yogurt']::TEXT[], 
  ARRAY['curd', 'dahi', 'yogurt', 'plain dahi']::TEXT[], 
  'dairy', 
  'curd', 
  'base-food'::public.item_type_enum, 
  'raw'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  100,
  98, 3.5, 4.5, 4.3, 0,
  45, 0.4, 5, 0.1, 120,
  '{"veg","jain","egg","nonveg"}'::public.diet_type_enum[], 
  ARRAY['lunch', 'dinner', 'breakfast']::TEXT[], 
  '{"navratri","ekadashi","jain-paryushana","ramzan"}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  false, true, true, false, false, false,
  28, 
  NULL, 
  0, 
  'IFCT-2017'::public.source_enum, 
  'high'::public.confidence_enum, 
  'Made from full fat milk. Excellent probiotic.'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  hindi_name = EXCLUDED.hindi_name,
  name_alt = EXCLUDED.name_alt,
  search_terms = EXCLUDED.search_terms,
  category_id = EXCLUDED.category_id,
  subcategory = EXCLUDED.subcategory,
  item_type = EXCLUDED.item_type,
  state = EXCLUDED.state,
  region = EXCLUDED.region,
  default_serving_grams = EXCLUDED.default_serving_grams,
  cal_per_100g = EXCLUDED.cal_per_100g,
  protein_per_100g = EXCLUDED.protein_per_100g,
  carbs_per_100g = EXCLUDED.carbs_per_100g,
  fat_per_100g = EXCLUDED.fat_per_100g,
  fiber_per_100g = EXCLUDED.fiber_per_100g,
  diet_types = EXCLUDED.diet_types,
  tags = EXCLUDED.tags,
  is_processed = EXCLUDED.is_processed,
  contains_root_veg = EXCLUDED.contains_root_veg;

  -- Servings for curd-full-fat
  DELETE FROM public.food_servings WHERE food_id = 'curd-full-fat';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('curd-full-fat', 'katori', '1 katori', 150);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('curd-full-fat', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'greek-yogurt-epigamia', 
  'Greek Yogurt (Plain, Epigamia)', 
  'ग्रीक योगर्ट', 
  ARRAY['strained yogurt']::TEXT[], 
  ARRAY['greek yogurt', 'epigamia', 'yogurt', 'curd']::TEXT[], 
  'dairy', 
  'curd', 
  'packaged-food'::public.item_type_enum, 
  'raw'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  100,
  80, 10, 4, 3, 0,
  40, 0.5, 5, 0.1, 110,
  '{"veg","jain","egg","nonveg"}'::public.diet_type_enum[], 
  ARRAY['snack', 'post-workout', 'high-protein']::TEXT[], 
  '{"navratri","ekadashi"}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  true, true, true, false, false, false,
  25, 
  NULL, 
  0, 
  'FSSAI-label'::public.source_enum, 
  'high'::public.confidence_enum, 
  'Popular commercial greek yogurt in India.'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  hindi_name = EXCLUDED.hindi_name,
  name_alt = EXCLUDED.name_alt,
  search_terms = EXCLUDED.search_terms,
  category_id = EXCLUDED.category_id,
  subcategory = EXCLUDED.subcategory,
  item_type = EXCLUDED.item_type,
  state = EXCLUDED.state,
  region = EXCLUDED.region,
  default_serving_grams = EXCLUDED.default_serving_grams,
  cal_per_100g = EXCLUDED.cal_per_100g,
  protein_per_100g = EXCLUDED.protein_per_100g,
  carbs_per_100g = EXCLUDED.carbs_per_100g,
  fat_per_100g = EXCLUDED.fat_per_100g,
  fiber_per_100g = EXCLUDED.fiber_per_100g,
  diet_types = EXCLUDED.diet_types,
  tags = EXCLUDED.tags,
  is_processed = EXCLUDED.is_processed,
  contains_root_veg = EXCLUDED.contains_root_veg;

  -- Servings for greek-yogurt-epigamia
  DELETE FROM public.food_servings WHERE food_id = 'greek-yogurt-epigamia';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('greek-yogurt-epigamia', 'g100', '100g', 100);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('greek-yogurt-epigamia', 'custom', 'Custom (g)', 1);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'paneer-low-fat', 
  'Paneer (Low Fat)', 
  'लो फैट पनीर', 
  ARRAY['skim milk paneer']::TEXT[], 
  ARRAY['paneer', 'low fat', 'cottage cheese']::TEXT[], 
  'dairy', 
  'cheese', 
  'base-food'::public.item_type_enum, 
  'raw'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  100,
  195, 23, 3, 10, 0,
  18, 1.1, 2, 0.1, 400,
  '{"veg","jain","egg","nonveg"}'::public.diet_type_enum[], 
  ARRAY['muscle-building', 'high-protein', 'cutting']::TEXT[], 
  '{"navratri","ekadashi","jain-paryushana"}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  false, true, true, false, false, false,
  25, 
  NULL, 
  0, 
  'healthifyme'::public.source_enum, 
  'medium'::public.confidence_enum, 
  'Made from double toned or skim milk. High protein-to-calorie ratio.'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  hindi_name = EXCLUDED.hindi_name,
  name_alt = EXCLUDED.name_alt,
  search_terms = EXCLUDED.search_terms,
  category_id = EXCLUDED.category_id,
  subcategory = EXCLUDED.subcategory,
  item_type = EXCLUDED.item_type,
  state = EXCLUDED.state,
  region = EXCLUDED.region,
  default_serving_grams = EXCLUDED.default_serving_grams,
  cal_per_100g = EXCLUDED.cal_per_100g,
  protein_per_100g = EXCLUDED.protein_per_100g,
  carbs_per_100g = EXCLUDED.carbs_per_100g,
  fat_per_100g = EXCLUDED.fat_per_100g,
  fiber_per_100g = EXCLUDED.fiber_per_100g,
  diet_types = EXCLUDED.diet_types,
  tags = EXCLUDED.tags,
  is_processed = EXCLUDED.is_processed,
  contains_root_veg = EXCLUDED.contains_root_veg;

  -- Servings for paneer-low-fat
  DELETE FROM public.food_servings WHERE food_id = 'paneer-low-fat';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('paneer-low-fat', 'g100', '100g', 100);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('paneer-low-fat', 'custom', 'Custom (g)', 1);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'lassi-sweet', 
  'Lassi (Sweet)', 
  'मीठी लस्सी', 
  ARRAY['meethi lassi', 'sweetened yogurt drink']::TEXT[], 
  ARRAY['lassi', 'sweet lassi', 'meethi', 'dahi drink']::TEXT[], 
  'dairy', 
  'drink', 
  'drink'::public.item_type_enum, 
  'raw'::public.food_state_enum, 
  'north'::public.region_enum, 
  200,
  75, 2.5, 12, 2, 0,
  25, 0.2, NULL, 0.1, 80,
  '{"veg","jain","egg","nonveg"}'::public.diet_type_enum[], 
  ARRAY['snack', 'drink', 'high-carb']::TEXT[], 
  '{"navratri","ekadashi"}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  false, true, true, false, false, false,
  60, 
  NULL, 
  0, 
  'healthifyme'::public.source_enum, 
  'medium'::public.confidence_enum, 
  'High in added sugar.'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  hindi_name = EXCLUDED.hindi_name,
  name_alt = EXCLUDED.name_alt,
  search_terms = EXCLUDED.search_terms,
  category_id = EXCLUDED.category_id,
  subcategory = EXCLUDED.subcategory,
  item_type = EXCLUDED.item_type,
  state = EXCLUDED.state,
  region = EXCLUDED.region,
  default_serving_grams = EXCLUDED.default_serving_grams,
  cal_per_100g = EXCLUDED.cal_per_100g,
  protein_per_100g = EXCLUDED.protein_per_100g,
  carbs_per_100g = EXCLUDED.carbs_per_100g,
  fat_per_100g = EXCLUDED.fat_per_100g,
  fiber_per_100g = EXCLUDED.fiber_per_100g,
  diet_types = EXCLUDED.diet_types,
  tags = EXCLUDED.tags,
  is_processed = EXCLUDED.is_processed,
  contains_root_veg = EXCLUDED.contains_root_veg;

  -- Servings for lassi-sweet
  DELETE FROM public.food_servings WHERE food_id = 'lassi-sweet';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('lassi-sweet', 'glass', '1 glass (200ml)', 200);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('lassi-sweet', 'g100', '100ml', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'ghee', 
  'Ghee (Clarified Butter)', 
  'घी', 
  ARRAY['desi ghee']::TEXT[], 
  ARRAY['ghee', 'butter', 'desi ghee', 'fat']::TEXT[], 
  'oil-fat', 
  'fat', 
  'base-food'::public.item_type_enum, 
  'raw'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  15,
  900, 0, 0, 100, 0,
  NULL, NULL, 60, NULL, NULL,
  '{"veg","jain","egg","nonveg"}'::public.diet_type_enum[], 
  ARRAY['high-fat', 'cooking']::TEXT[], 
  '{"navratri","ekadashi","jain-paryushana","ramzan"}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  false, true, true, false, false, false,
  NULL, 
  NULL, 
  0, 
  'IFCT-2017'::public.source_enum, 
  'high'::public.confidence_enum, 
  'Pure fat. Critical to log accurately.'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  hindi_name = EXCLUDED.hindi_name,
  name_alt = EXCLUDED.name_alt,
  search_terms = EXCLUDED.search_terms,
  category_id = EXCLUDED.category_id,
  subcategory = EXCLUDED.subcategory,
  item_type = EXCLUDED.item_type,
  state = EXCLUDED.state,
  region = EXCLUDED.region,
  default_serving_grams = EXCLUDED.default_serving_grams,
  cal_per_100g = EXCLUDED.cal_per_100g,
  protein_per_100g = EXCLUDED.protein_per_100g,
  carbs_per_100g = EXCLUDED.carbs_per_100g,
  fat_per_100g = EXCLUDED.fat_per_100g,
  fiber_per_100g = EXCLUDED.fiber_per_100g,
  diet_types = EXCLUDED.diet_types,
  tags = EXCLUDED.tags,
  is_processed = EXCLUDED.is_processed,
  contains_root_veg = EXCLUDED.contains_root_veg;

  -- Servings for ghee
  DELETE FROM public.food_servings WHERE food_id = 'ghee';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('ghee', 'tbsp', '1 tablespoon', 15);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('ghee', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'masala-dosa', 
  'Masala Dosa', 
  'मसाला डोसा', 
  ARRAY['dosai', 'potato stuffed dosa']::TEXT[], 
  ARRAY['dosa', 'masala dosa', 'dosai', 'crepe']::TEXT[], 
  'breakfast', 
  'south-indian', 
  'dish'::public.item_type_enum, 
  'cooked'::public.food_state_enum, 
  'south'::public.region_enum, 
  150,
  165, 3.5, 23, 6, 2,
  250, NULL, NULL, 1, 15,
  '{"vegan","veg","nonveg"}'::public.diet_type_enum[], 
  ARRAY['breakfast', 'high-carb']::TEXT[], 
  '{}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  false, false, true, false, true, false,
  65, 
  'Values include oil/ghee used for roasting.', 
  5, 
  'healthifyme'::public.source_enum, 
  'medium'::public.confidence_enum, 
  'Excludes chutney and sambar calories.'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  hindi_name = EXCLUDED.hindi_name,
  name_alt = EXCLUDED.name_alt,
  search_terms = EXCLUDED.search_terms,
  category_id = EXCLUDED.category_id,
  subcategory = EXCLUDED.subcategory,
  item_type = EXCLUDED.item_type,
  state = EXCLUDED.state,
  region = EXCLUDED.region,
  default_serving_grams = EXCLUDED.default_serving_grams,
  cal_per_100g = EXCLUDED.cal_per_100g,
  protein_per_100g = EXCLUDED.protein_per_100g,
  carbs_per_100g = EXCLUDED.carbs_per_100g,
  fat_per_100g = EXCLUDED.fat_per_100g,
  fiber_per_100g = EXCLUDED.fiber_per_100g,
  diet_types = EXCLUDED.diet_types,
  tags = EXCLUDED.tags,
  is_processed = EXCLUDED.is_processed,
  contains_root_veg = EXCLUDED.contains_root_veg;

  -- Servings for masala-dosa
  DELETE FROM public.food_servings WHERE food_id = 'masala-dosa';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('masala-dosa', 'piece', '1 medium dosa', 150);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('masala-dosa', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'plain-dosa', 
  'Plain Dosa', 
  'सादा डोसा', 
  ARRAY['sada dosa']::TEXT[], 
  ARRAY['dosa', 'plain dosa', 'sada dosa']::TEXT[], 
  'breakfast', 
  'south-indian', 
  'dish'::public.item_type_enum, 
  'cooked'::public.food_state_enum, 
  'south'::public.region_enum, 
  100,
  133, 3, 25, 2.5, 1,
  200, NULL, NULL, 0.8, 10,
  '{"vegan","veg","jain","nonveg"}'::public.diet_type_enum[], 
  ARRAY['breakfast', 'high-carb', 'budget-friendly']::TEXT[], 
  '{}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  false, false, true, false, false, false,
  75, 
  'Includes minimal oil for roasting.', 
  2, 
  'healthifyme'::public.source_enum, 
  'medium'::public.confidence_enum, 
  'A healthier choice than masala dosa, but very high GI.'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  hindi_name = EXCLUDED.hindi_name,
  name_alt = EXCLUDED.name_alt,
  search_terms = EXCLUDED.search_terms,
  category_id = EXCLUDED.category_id,
  subcategory = EXCLUDED.subcategory,
  item_type = EXCLUDED.item_type,
  state = EXCLUDED.state,
  region = EXCLUDED.region,
  default_serving_grams = EXCLUDED.default_serving_grams,
  cal_per_100g = EXCLUDED.cal_per_100g,
  protein_per_100g = EXCLUDED.protein_per_100g,
  carbs_per_100g = EXCLUDED.carbs_per_100g,
  fat_per_100g = EXCLUDED.fat_per_100g,
  fiber_per_100g = EXCLUDED.fiber_per_100g,
  diet_types = EXCLUDED.diet_types,
  tags = EXCLUDED.tags,
  is_processed = EXCLUDED.is_processed,
  contains_root_veg = EXCLUDED.contains_root_veg;

  -- Servings for plain-dosa
  DELETE FROM public.food_servings WHERE food_id = 'plain-dosa';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('plain-dosa', 'piece', '1 medium dosa', 100);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('plain-dosa', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'idli-steamed', 
  'Idli (Steamed Rice Cake)', 
  'इडली', 
  ARRAY['rice idli']::TEXT[], 
  ARRAY['idli', 'steamed idli', 'rice cake']::TEXT[], 
  'breakfast', 
  'south-indian', 
  'dish'::public.item_type_enum, 
  'steamed'::public.food_state_enum, 
  'south'::public.region_enum, 
  40,
  145, 4.5, 32, 0.2, 1.5,
  150, NULL, NULL, 0.5, 15,
  '{"vegan","veg","jain","nonveg"}'::public.diet_type_enum[], 
  ARRAY['breakfast', 'snack', 'low-fat', 'budget-friendly']::TEXT[], 
  '{}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  false, false, true, false, false, false,
  70, 
  NULL, 
  0, 
  'healthifyme'::public.source_enum, 
  'high'::public.confidence_enum, 
  'Does not include sambar or chutney calories. Healthy low fat option.'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  hindi_name = EXCLUDED.hindi_name,
  name_alt = EXCLUDED.name_alt,
  search_terms = EXCLUDED.search_terms,
  category_id = EXCLUDED.category_id,
  subcategory = EXCLUDED.subcategory,
  item_type = EXCLUDED.item_type,
  state = EXCLUDED.state,
  region = EXCLUDED.region,
  default_serving_grams = EXCLUDED.default_serving_grams,
  cal_per_100g = EXCLUDED.cal_per_100g,
  protein_per_100g = EXCLUDED.protein_per_100g,
  carbs_per_100g = EXCLUDED.carbs_per_100g,
  fat_per_100g = EXCLUDED.fat_per_100g,
  fiber_per_100g = EXCLUDED.fiber_per_100g,
  diet_types = EXCLUDED.diet_types,
  tags = EXCLUDED.tags,
  is_processed = EXCLUDED.is_processed,
  contains_root_veg = EXCLUDED.contains_root_veg;

  -- Servings for idli-steamed
  DELETE FROM public.food_servings WHERE food_id = 'idli-steamed';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('idli-steamed', 'piece', '1 medium idli', 40);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('idli-steamed', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'medu-vada', 
  'Medu Vada (Fried Lentil Donut)', 
  'मेदु वडा', 
  ARRAY['urad dal vada', 'vadai']::TEXT[], 
  ARRAY['vada', 'vadai', 'medu vada', 'fried donut']::TEXT[], 
  'breakfast', 
  'south-indian', 
  'dish'::public.item_type_enum, 
  'fried'::public.food_state_enum, 
  'south'::public.region_enum, 
  50,
  335, 10, 35, 17.5, 5,
  350, NULL, NULL, 2, 40,
  '{"vegan","veg","jain","nonveg"}'::public.diet_type_enum[], 
  ARRAY['breakfast', 'snack', 'high-fat']::TEXT[], 
  '{}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  false, false, true, false, false, false,
  45, 
  'Deep fried. ~10-15g of oil absorbed per 100g.', 
  8, 
  'healthifyme'::public.source_enum, 
  'medium'::public.confidence_enum, 
  'High calorie density due to deep frying.'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  hindi_name = EXCLUDED.hindi_name,
  name_alt = EXCLUDED.name_alt,
  search_terms = EXCLUDED.search_terms,
  category_id = EXCLUDED.category_id,
  subcategory = EXCLUDED.subcategory,
  item_type = EXCLUDED.item_type,
  state = EXCLUDED.state,
  region = EXCLUDED.region,
  default_serving_grams = EXCLUDED.default_serving_grams,
  cal_per_100g = EXCLUDED.cal_per_100g,
  protein_per_100g = EXCLUDED.protein_per_100g,
  carbs_per_100g = EXCLUDED.carbs_per_100g,
  fat_per_100g = EXCLUDED.fat_per_100g,
  fiber_per_100g = EXCLUDED.fiber_per_100g,
  diet_types = EXCLUDED.diet_types,
  tags = EXCLUDED.tags,
  is_processed = EXCLUDED.is_processed,
  contains_root_veg = EXCLUDED.contains_root_veg;

  -- Servings for medu-vada
  DELETE FROM public.food_servings WHERE food_id = 'medu-vada';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('medu-vada', 'piece', '1 piece', 50);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('medu-vada', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'upma-rava', 
  'Upma (Rava / Semolina)', 
  'उपमा', 
  ARRAY['suji upma', 'uppumavu']::TEXT[], 
  ARRAY['upma', 'rava', 'suji', 'uppumavu']::TEXT[], 
  'breakfast', 
  'south-indian', 
  'dish'::public.item_type_enum, 
  'cooked'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  150,
  140, 3.5, 22, 4.5, 1.5,
  250, NULL, NULL, 1.2, 15,
  '{"vegan","veg","nonveg"}'::public.diet_type_enum[], 
  ARRAY['breakfast', 'quick-to-make']::TEXT[], 
  '{}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  false, false, false, false, true, false,
  68, 
  'Values assume standard oil tempering.', 
  5, 
  'healthifyme'::public.source_enum, 
  'medium'::public.confidence_enum, 
  'Add vegetables to increase fiber and reduce glycemic load.'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  hindi_name = EXCLUDED.hindi_name,
  name_alt = EXCLUDED.name_alt,
  search_terms = EXCLUDED.search_terms,
  category_id = EXCLUDED.category_id,
  subcategory = EXCLUDED.subcategory,
  item_type = EXCLUDED.item_type,
  state = EXCLUDED.state,
  region = EXCLUDED.region,
  default_serving_grams = EXCLUDED.default_serving_grams,
  cal_per_100g = EXCLUDED.cal_per_100g,
  protein_per_100g = EXCLUDED.protein_per_100g,
  carbs_per_100g = EXCLUDED.carbs_per_100g,
  fat_per_100g = EXCLUDED.fat_per_100g,
  fiber_per_100g = EXCLUDED.fiber_per_100g,
  diet_types = EXCLUDED.diet_types,
  tags = EXCLUDED.tags,
  is_processed = EXCLUDED.is_processed,
  contains_root_veg = EXCLUDED.contains_root_veg;

  -- Servings for upma-rava
  DELETE FROM public.food_servings WHERE food_id = 'upma-rava';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('upma-rava', 'katori', '1 katori', 150);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('upma-rava', 'bowl', '1 bowl', 200);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('upma-rava', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'poha', 
  'Poha (Flattened Rice)', 
  'पोहा', 
  ARRAY['kanda batata poha', 'aval', 'chiwda']::TEXT[], 
  ARRAY['poha', 'chiwda', 'flattened rice', 'kanda batata']::TEXT[], 
  'breakfast', 
  'west-indian', 
  'dish'::public.item_type_enum, 
  'cooked'::public.food_state_enum, 
  'west'::public.region_enum, 
  150,
  130, 2.5, 23, 3.5, 1,
  220, NULL, NULL, 1.5, 12,
  '{"vegan","veg","nonveg"}'::public.diet_type_enum[], 
  ARRAY['breakfast', 'snack', 'quick-to-make']::TEXT[], 
  '{}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  false, false, true, false, true, false,
  65, 
  'Includes oil for tempering and peanuts.', 
  4, 
  'healthifyme'::public.source_enum, 
  'medium'::public.confidence_enum, 
  'Often garnished with peanuts and sev, which adds extra calories and fats.'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  hindi_name = EXCLUDED.hindi_name,
  name_alt = EXCLUDED.name_alt,
  search_terms = EXCLUDED.search_terms,
  category_id = EXCLUDED.category_id,
  subcategory = EXCLUDED.subcategory,
  item_type = EXCLUDED.item_type,
  state = EXCLUDED.state,
  region = EXCLUDED.region,
  default_serving_grams = EXCLUDED.default_serving_grams,
  cal_per_100g = EXCLUDED.cal_per_100g,
  protein_per_100g = EXCLUDED.protein_per_100g,
  carbs_per_100g = EXCLUDED.carbs_per_100g,
  fat_per_100g = EXCLUDED.fat_per_100g,
  fiber_per_100g = EXCLUDED.fiber_per_100g,
  diet_types = EXCLUDED.diet_types,
  tags = EXCLUDED.tags,
  is_processed = EXCLUDED.is_processed,
  contains_root_veg = EXCLUDED.contains_root_veg;

  -- Servings for poha
  DELETE FROM public.food_servings WHERE food_id = 'poha';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('poha', 'katori', '1 katori', 150);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('poha', 'bowl', '1 bowl', 200);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('poha', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'chole-bhature', 
  'Chole Bhature', 
  'छोले भटूरे', 
  ARRAY['chana bhatura']::TEXT[], 
  ARRAY['chole', 'bhature', 'chana', 'bhatura']::TEXT[], 
  'breakfast', 
  'north-indian', 
  'dish'::public.item_type_enum, 
  'cooked'::public.food_state_enum, 
  'north'::public.region_enum, 
  350,
  220, 6, 26, 10, 4,
  350, NULL, NULL, 2.5, 40,
  '{"vegan","veg","nonveg"}'::public.diet_type_enum[], 
  ARRAY['breakfast', 'lunch', 'high-calorie', 'high-fat']::TEXT[], 
  '{}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  false, false, false, false, true, false,
  60, 
  'Bhature are deep-fried; chole is oil-rich.', 
  20, 
  'healthifyme'::public.source_enum, 
  'low'::public.confidence_enum, 
  'Extremely high calorie. Portion size heavily dictates total calories.'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  hindi_name = EXCLUDED.hindi_name,
  name_alt = EXCLUDED.name_alt,
  search_terms = EXCLUDED.search_terms,
  category_id = EXCLUDED.category_id,
  subcategory = EXCLUDED.subcategory,
  item_type = EXCLUDED.item_type,
  state = EXCLUDED.state,
  region = EXCLUDED.region,
  default_serving_grams = EXCLUDED.default_serving_grams,
  cal_per_100g = EXCLUDED.cal_per_100g,
  protein_per_100g = EXCLUDED.protein_per_100g,
  carbs_per_100g = EXCLUDED.carbs_per_100g,
  fat_per_100g = EXCLUDED.fat_per_100g,
  fiber_per_100g = EXCLUDED.fiber_per_100g,
  diet_types = EXCLUDED.diet_types,
  tags = EXCLUDED.tags,
  is_processed = EXCLUDED.is_processed,
  contains_root_veg = EXCLUDED.contains_root_veg;

  -- Servings for chole-bhature
  DELETE FROM public.food_servings WHERE food_id = 'chole-bhature';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('chole-bhature', 'plate', '1 plate (2 bhature + chole)', 350);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('chole-bhature', 'restaurant-portion', '1 restaurant portion', 500);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('chole-bhature', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'besan-chilla', 
  'Besan Chilla (Gram Flour Pancake)', 
  'बेसन का चीला', 
  ARRAY['veg omelette', 'cheela']::TEXT[], 
  ARRAY['besan', 'chilla', 'cheela', 'pancake', 'veg omelette']::TEXT[], 
  'breakfast', 
  'north-indian', 
  'dish'::public.item_type_enum, 
  'cooked'::public.food_state_enum, 
  'north'::public.region_enum, 
  80,
  160, 7.5, 22, 4.5, 3.5,
  250, NULL, NULL, 2, 20,
  '{"vegan","veg","nonveg"}'::public.diet_type_enum[], 
  ARRAY['breakfast', 'high-protein', 'quick-to-make']::TEXT[], 
  '{}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  false, false, true, false, true, false,
  48, 
  'Assumes minimal oil brushed on pan.', 
  3, 
  'healthifyme'::public.source_enum, 
  'medium'::public.confidence_enum, 
  'A great vegan high-protein alternative to eggs.'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  hindi_name = EXCLUDED.hindi_name,
  name_alt = EXCLUDED.name_alt,
  search_terms = EXCLUDED.search_terms,
  category_id = EXCLUDED.category_id,
  subcategory = EXCLUDED.subcategory,
  item_type = EXCLUDED.item_type,
  state = EXCLUDED.state,
  region = EXCLUDED.region,
  default_serving_grams = EXCLUDED.default_serving_grams,
  cal_per_100g = EXCLUDED.cal_per_100g,
  protein_per_100g = EXCLUDED.protein_per_100g,
  carbs_per_100g = EXCLUDED.carbs_per_100g,
  fat_per_100g = EXCLUDED.fat_per_100g,
  fiber_per_100g = EXCLUDED.fiber_per_100g,
  diet_types = EXCLUDED.diet_types,
  tags = EXCLUDED.tags,
  is_processed = EXCLUDED.is_processed,
  contains_root_veg = EXCLUDED.contains_root_veg;

  -- Servings for besan-chilla
  DELETE FROM public.food_servings WHERE food_id = 'besan-chilla';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('besan-chilla', 'piece', '1 chilla', 80);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('besan-chilla', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'moong-dal-chilla', 
  'Moong Dal Chilla', 
  'मूंग दाल चीला', 
  ARRAY['pesarattu', 'moong cheela']::TEXT[], 
  ARRAY['moong', 'chilla', 'cheela', 'pesarattu', 'pancake']::TEXT[], 
  'breakfast', 
  'north-indian', 
  'dish'::public.item_type_enum, 
  'cooked'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  80,
  155, 8.5, 19, 5, 3,
  200, NULL, NULL, 2.2, 25,
  '{"vegan","veg","jain","nonveg"}'::public.diet_type_enum[], 
  ARRAY['breakfast', 'high-protein', 'low-carb']::TEXT[], 
  '{}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  false, false, true, false, false, false,
  45, 
  '1 tsp oil assumed per chilla.', 
  4, 
  'healthifyme'::public.source_enum, 
  'medium'::public.confidence_enum, 
  'Often stuffed with paneer for extra protein.'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  hindi_name = EXCLUDED.hindi_name,
  name_alt = EXCLUDED.name_alt,
  search_terms = EXCLUDED.search_terms,
  category_id = EXCLUDED.category_id,
  subcategory = EXCLUDED.subcategory,
  item_type = EXCLUDED.item_type,
  state = EXCLUDED.state,
  region = EXCLUDED.region,
  default_serving_grams = EXCLUDED.default_serving_grams,
  cal_per_100g = EXCLUDED.cal_per_100g,
  protein_per_100g = EXCLUDED.protein_per_100g,
  carbs_per_100g = EXCLUDED.carbs_per_100g,
  fat_per_100g = EXCLUDED.fat_per_100g,
  fiber_per_100g = EXCLUDED.fiber_per_100g,
  diet_types = EXCLUDED.diet_types,
  tags = EXCLUDED.tags,
  is_processed = EXCLUDED.is_processed,
  contains_root_veg = EXCLUDED.contains_root_veg;

  -- Servings for moong-dal-chilla
  DELETE FROM public.food_servings WHERE food_id = 'moong-dal-chilla';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('moong-dal-chilla', 'piece', '1 chilla', 80);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('moong-dal-chilla', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'uttapam', 
  'Uttapam (Mixed Veg)', 
  'उत्तपम', 
  ARRAY['south indian pizza']::TEXT[], 
  ARRAY['uttapam', 'uthappam', 'oothappam']::TEXT[], 
  'breakfast', 
  'south-indian', 
  'dish'::public.item_type_enum, 
  'cooked'::public.food_state_enum, 
  'south'::public.region_enum, 
  120,
  140, 3.5, 23, 3.5, 2,
  280, NULL, NULL, 1, 20,
  '{"vegan","veg","nonveg"}'::public.diet_type_enum[], 
  ARRAY['breakfast', 'high-carb']::TEXT[], 
  '{}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  false, false, true, false, true, false,
  60, 
  'Pan-fried with some oil.', 
  3, 
  'healthifyme'::public.source_enum, 
  'medium'::public.confidence_enum, 
  'Veggies add fiber, lowering GI compared to plain dosa.'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  hindi_name = EXCLUDED.hindi_name,
  name_alt = EXCLUDED.name_alt,
  search_terms = EXCLUDED.search_terms,
  category_id = EXCLUDED.category_id,
  subcategory = EXCLUDED.subcategory,
  item_type = EXCLUDED.item_type,
  state = EXCLUDED.state,
  region = EXCLUDED.region,
  default_serving_grams = EXCLUDED.default_serving_grams,
  cal_per_100g = EXCLUDED.cal_per_100g,
  protein_per_100g = EXCLUDED.protein_per_100g,
  carbs_per_100g = EXCLUDED.carbs_per_100g,
  fat_per_100g = EXCLUDED.fat_per_100g,
  fiber_per_100g = EXCLUDED.fiber_per_100g,
  diet_types = EXCLUDED.diet_types,
  tags = EXCLUDED.tags,
  is_processed = EXCLUDED.is_processed,
  contains_root_veg = EXCLUDED.contains_root_veg;

  -- Servings for uttapam
  DELETE FROM public.food_servings WHERE food_id = 'uttapam';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('uttapam', 'piece', '1 medium uttapam', 120);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('uttapam', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'pongal', 
  'Ven Pongal (Ghee Rice & Lentils)', 
  'पोंगल', 
  ARRAY['khara pongal']::TEXT[], 
  ARRAY['pongal', 'ven pongal', 'khara pongal', 'rice lentil']::TEXT[], 
  'breakfast', 
  'south-indian', 
  'dish'::public.item_type_enum, 
  'cooked'::public.food_state_enum, 
  'south'::public.region_enum, 
  200,
  145, 4, 19, 6, 1.5,
  250, NULL, NULL, 1.2, 25,
  '{"veg","jain","nonveg"}'::public.diet_type_enum[], 
  ARRAY['breakfast', 'comfort-food', 'high-fat']::TEXT[], 
  '{}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  false, false, true, false, false, false,
  65, 
  'Rich in ghee. High fat content.', 
  6, 
  'healthifyme'::public.source_enum, 
  'medium'::public.confidence_enum, 
  'Ghee provides fat while rice & lentils are carbs/protein.'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  hindi_name = EXCLUDED.hindi_name,
  name_alt = EXCLUDED.name_alt,
  search_terms = EXCLUDED.search_terms,
  category_id = EXCLUDED.category_id,
  subcategory = EXCLUDED.subcategory,
  item_type = EXCLUDED.item_type,
  state = EXCLUDED.state,
  region = EXCLUDED.region,
  default_serving_grams = EXCLUDED.default_serving_grams,
  cal_per_100g = EXCLUDED.cal_per_100g,
  protein_per_100g = EXCLUDED.protein_per_100g,
  carbs_per_100g = EXCLUDED.carbs_per_100g,
  fat_per_100g = EXCLUDED.fat_per_100g,
  fiber_per_100g = EXCLUDED.fiber_per_100g,
  diet_types = EXCLUDED.diet_types,
  tags = EXCLUDED.tags,
  is_processed = EXCLUDED.is_processed,
  contains_root_veg = EXCLUDED.contains_root_veg;

  -- Servings for pongal
  DELETE FROM public.food_servings WHERE food_id = 'pongal';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('pongal', 'bowl', '1 bowl', 200);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('pongal', 'katori', '1 katori', 150);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('pongal', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'rava-idli', 
  'Rava Idli (Semolina Idli)', 
  'रवा इडली', 
  ARRAY['suji idli']::TEXT[], 
  ARRAY['rava idli', 'suji idli', 'semolina idli']::TEXT[], 
  'breakfast', 
  'south-indian', 
  'dish'::public.item_type_enum, 
  'steamed'::public.food_state_enum, 
  'south'::public.region_enum, 
  60,
  145, 3.5, 23, 4.5, 1,
  250, NULL, NULL, 1, 15,
  '{"veg","nonveg"}'::public.diet_type_enum[], 
  ARRAY['breakfast', 'quick-to-make']::TEXT[], 
  '{}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  false, false, false, false, false, false,
  60, 
  'Tempering before steaming adds small oil.', 
  2, 
  'healthifyme'::public.source_enum, 
  'medium'::public.confidence_enum, 
  'Slightly higher fat than rice idli due to cashew & mustard tempering.'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  hindi_name = EXCLUDED.hindi_name,
  name_alt = EXCLUDED.name_alt,
  search_terms = EXCLUDED.search_terms,
  category_id = EXCLUDED.category_id,
  subcategory = EXCLUDED.subcategory,
  item_type = EXCLUDED.item_type,
  state = EXCLUDED.state,
  region = EXCLUDED.region,
  default_serving_grams = EXCLUDED.default_serving_grams,
  cal_per_100g = EXCLUDED.cal_per_100g,
  protein_per_100g = EXCLUDED.protein_per_100g,
  carbs_per_100g = EXCLUDED.carbs_per_100g,
  fat_per_100g = EXCLUDED.fat_per_100g,
  fiber_per_100g = EXCLUDED.fiber_per_100g,
  diet_types = EXCLUDED.diet_types,
  tags = EXCLUDED.tags,
  is_processed = EXCLUDED.is_processed,
  contains_root_veg = EXCLUDED.contains_root_veg;

  -- Servings for rava-idli
  DELETE FROM public.food_servings WHERE food_id = 'rava-idli';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('rava-idli', 'piece', '1 piece', 60);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('rava-idli', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'samosa', 
  'Samosa (Aloo / Potato)', 
  'समोसा', 
  ARRAY['aloo samosa', 'singara']::TEXT[], 
  ARRAY['samosa', 'singara', 'aloo samosa', 'fried pastry']::TEXT[], 
  'snack-street', 
  'fried-snack', 
  'dish'::public.item_type_enum, 
  'fried'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  80,
  320, 4.5, 35, 18, 3,
  400, NULL, NULL, 1.5, 20,
  '{"vegan","veg","nonveg"}'::public.diet_type_enum[], 
  ARRAY['snack', 'high-calorie', 'high-fat', 'comfort-food']::TEXT[], 
  '{}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  false, false, false, false, true, false,
  70, 
  'Deep fried crust and oil in filling.', 
  12, 
  'healthifyme'::public.source_enum, 
  'high'::public.confidence_enum, 
  'Classic street food. Roughly 250-260 calories per piece.'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  hindi_name = EXCLUDED.hindi_name,
  name_alt = EXCLUDED.name_alt,
  search_terms = EXCLUDED.search_terms,
  category_id = EXCLUDED.category_id,
  subcategory = EXCLUDED.subcategory,
  item_type = EXCLUDED.item_type,
  state = EXCLUDED.state,
  region = EXCLUDED.region,
  default_serving_grams = EXCLUDED.default_serving_grams,
  cal_per_100g = EXCLUDED.cal_per_100g,
  protein_per_100g = EXCLUDED.protein_per_100g,
  carbs_per_100g = EXCLUDED.carbs_per_100g,
  fat_per_100g = EXCLUDED.fat_per_100g,
  fiber_per_100g = EXCLUDED.fiber_per_100g,
  diet_types = EXCLUDED.diet_types,
  tags = EXCLUDED.tags,
  is_processed = EXCLUDED.is_processed,
  contains_root_veg = EXCLUDED.contains_root_veg;

  -- Servings for samosa
  DELETE FROM public.food_servings WHERE food_id = 'samosa';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('samosa', 'piece', '1 regular samosa', 80);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('samosa', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'vada-pav', 
  'Vada Pav', 
  'वड़ा पाव', 
  ARRAY['bombay burger', 'batata vada pav']::TEXT[], 
  ARRAY['vada pav', 'wada pav', 'bombay burger']::TEXT[], 
  'snack-street', 
  'street-food', 
  'dish'::public.item_type_enum, 
  'cooked'::public.food_state_enum, 
  'west'::public.region_enum, 
  120,
  250, 5, 33, 10.5, 2.5,
  450, NULL, NULL, 2, 35,
  '{"vegan","veg","nonveg"}'::public.diet_type_enum[], 
  ARRAY['snack', 'high-calorie', 'high-carb', 'comfort-food']::TEXT[], 
  '{}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  false, false, false, false, true, false,
  75, 
  'Vada is deep fried. Pav is refined flour.', 
  8, 
  'healthifyme'::public.source_enum, 
  'medium'::public.confidence_enum, 
  'Total calories roughly 300 per vada pav.'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  hindi_name = EXCLUDED.hindi_name,
  name_alt = EXCLUDED.name_alt,
  search_terms = EXCLUDED.search_terms,
  category_id = EXCLUDED.category_id,
  subcategory = EXCLUDED.subcategory,
  item_type = EXCLUDED.item_type,
  state = EXCLUDED.state,
  region = EXCLUDED.region,
  default_serving_grams = EXCLUDED.default_serving_grams,
  cal_per_100g = EXCLUDED.cal_per_100g,
  protein_per_100g = EXCLUDED.protein_per_100g,
  carbs_per_100g = EXCLUDED.carbs_per_100g,
  fat_per_100g = EXCLUDED.fat_per_100g,
  fiber_per_100g = EXCLUDED.fiber_per_100g,
  diet_types = EXCLUDED.diet_types,
  tags = EXCLUDED.tags,
  is_processed = EXCLUDED.is_processed,
  contains_root_veg = EXCLUDED.contains_root_veg;

  -- Servings for vada-pav
  DELETE FROM public.food_servings WHERE food_id = 'vada-pav';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('vada-pav', 'piece', '1 piece', 120);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('vada-pav', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'pani-puri', 
  'Pani Puri / Golgappa', 
  'पानी पूरी', 
  ARRAY['puchka', 'gupchup']::TEXT[], 
  ARRAY['pani puri', 'golgappa', 'puchka', 'gupchup', 'chaat']::TEXT[], 
  'snack-street', 
  'chaat', 
  'dish'::public.item_type_enum, 
  'cooked'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  100,
  140, 3, 22, 4.5, 2,
  500, NULL, NULL, 1.5, 20,
  '{"vegan","veg","nonveg"}'::public.diet_type_enum[], 
  ARRAY['snack', 'low-calorie']::TEXT[], 
  '{}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  false, false, false, false, true, false,
  55, 
  'Puris are deep fried, but the water volume dilutes overall calorie density.', 
  3, 
  'healthifyme'::public.source_enum, 
  'medium'::public.confidence_enum, 
  'Surprising low calorie snack due to high water content, but high in sodium.'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  hindi_name = EXCLUDED.hindi_name,
  name_alt = EXCLUDED.name_alt,
  search_terms = EXCLUDED.search_terms,
  category_id = EXCLUDED.category_id,
  subcategory = EXCLUDED.subcategory,
  item_type = EXCLUDED.item_type,
  state = EXCLUDED.state,
  region = EXCLUDED.region,
  default_serving_grams = EXCLUDED.default_serving_grams,
  cal_per_100g = EXCLUDED.cal_per_100g,
  protein_per_100g = EXCLUDED.protein_per_100g,
  carbs_per_100g = EXCLUDED.carbs_per_100g,
  fat_per_100g = EXCLUDED.fat_per_100g,
  fiber_per_100g = EXCLUDED.fiber_per_100g,
  diet_types = EXCLUDED.diet_types,
  tags = EXCLUDED.tags,
  is_processed = EXCLUDED.is_processed,
  contains_root_veg = EXCLUDED.contains_root_veg;

  -- Servings for pani-puri
  DELETE FROM public.food_servings WHERE food_id = 'pani-puri';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('pani-puri', 'plate', '1 plate (6 pieces)', 100);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('pani-puri', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'bhel-puri', 
  'Bhel Puri (With Chutney)', 
  'भेल पूरी', 
  ARRAY['bheel']::TEXT[], 
  ARRAY['bhel', 'bhel puri', 'chaat']::TEXT[], 
  'snack-street', 
  'chaat', 
  'dish'::public.item_type_enum, 
  'cooked'::public.food_state_enum, 
  'west'::public.region_enum, 
  150,
  160, 4, 28, 4, 3.5,
  450, NULL, NULL, 2, 30,
  '{"vegan","veg","nonveg"}'::public.diet_type_enum[], 
  ARRAY['snack', 'high-carb']::TEXT[], 
  '{}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  false, false, false, false, true, false,
  65, 
  'Sev and puri components are fried.', 
  3, 
  'healthifyme'::public.source_enum, 
  'medium'::public.confidence_enum, 
  'Sweet tamarind chutney adds sugar carbs.'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  hindi_name = EXCLUDED.hindi_name,
  name_alt = EXCLUDED.name_alt,
  search_terms = EXCLUDED.search_terms,
  category_id = EXCLUDED.category_id,
  subcategory = EXCLUDED.subcategory,
  item_type = EXCLUDED.item_type,
  state = EXCLUDED.state,
  region = EXCLUDED.region,
  default_serving_grams = EXCLUDED.default_serving_grams,
  cal_per_100g = EXCLUDED.cal_per_100g,
  protein_per_100g = EXCLUDED.protein_per_100g,
  carbs_per_100g = EXCLUDED.carbs_per_100g,
  fat_per_100g = EXCLUDED.fat_per_100g,
  fiber_per_100g = EXCLUDED.fiber_per_100g,
  diet_types = EXCLUDED.diet_types,
  tags = EXCLUDED.tags,
  is_processed = EXCLUDED.is_processed,
  contains_root_veg = EXCLUDED.contains_root_veg;

  -- Servings for bhel-puri
  DELETE FROM public.food_servings WHERE food_id = 'bhel-puri';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('bhel-puri', 'plate', '1 plate', 150);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('bhel-puri', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'pav-bhaji', 
  'Pav Bhaji (With Butter)', 
  'पाव भाजी', 
  ARRAY['paav bhaji']::TEXT[], 
  ARRAY['pav', 'bhaji', 'pav bhaji', 'paavbhaji']::TEXT[], 
  'snack-street', 
  'street-food', 
  'dish'::public.item_type_enum, 
  'cooked'::public.food_state_enum, 
  'west'::public.region_enum, 
  300,
  135, 3, 18, 5.5, 3.5,
  380, NULL, NULL, 1.5, 30,
  '{"veg","nonveg"}'::public.diet_type_enum[], 
  ARRAY['snack', 'lunch', 'high-calorie']::TEXT[], 
  '{}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  false, false, false, false, true, false,
  68, 
  'Heavily buttered. A lot of fat comes from Amul butter additions.', 
  12, 
  'healthifyme'::public.source_enum, 
  'medium'::public.confidence_enum, 
  'About 400 calories per plate. Adding extra butter increases calories steeply.'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  hindi_name = EXCLUDED.hindi_name,
  name_alt = EXCLUDED.name_alt,
  search_terms = EXCLUDED.search_terms,
  category_id = EXCLUDED.category_id,
  subcategory = EXCLUDED.subcategory,
  item_type = EXCLUDED.item_type,
  state = EXCLUDED.state,
  region = EXCLUDED.region,
  default_serving_grams = EXCLUDED.default_serving_grams,
  cal_per_100g = EXCLUDED.cal_per_100g,
  protein_per_100g = EXCLUDED.protein_per_100g,
  carbs_per_100g = EXCLUDED.carbs_per_100g,
  fat_per_100g = EXCLUDED.fat_per_100g,
  fiber_per_100g = EXCLUDED.fiber_per_100g,
  diet_types = EXCLUDED.diet_types,
  tags = EXCLUDED.tags,
  is_processed = EXCLUDED.is_processed,
  contains_root_veg = EXCLUDED.contains_root_veg;

  -- Servings for pav-bhaji
  DELETE FROM public.food_servings WHERE food_id = 'pav-bhaji';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('pav-bhaji', 'plate', '1 plate (2 pav + bhaji)', 300);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('pav-bhaji', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'roasted-chana', 
  'Roasted Chana (Bengal Gram)', 
  'भुना हुआ चना', 
  ARRAY['bhuna chana', 'dry roasted chickpea']::TEXT[], 
  ARRAY['chana', 'roasted chana', 'bhuna chana', 'gram']::TEXT[], 
  'snack-street', 
  'dry-snack', 
  'base-food'::public.item_type_enum, 
  'roasted'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  30,
  364, 22, 50, 5.2, 15,
  80, NULL, NULL, 5.5, 150,
  '{"vegan","veg","jain","nonveg"}'::public.diet_type_enum[], 
  ARRAY['snack', 'high-protein', 'high-fiber', 'muscle-building', 'budget-friendly']::TEXT[], 
  '{}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  false, false, true, false, false, false,
  28, 
  NULL, 
  0, 
  'IFCT-2017'::public.source_enum, 
  'high'::public.confidence_enum, 
  'Amazing protein-dense snack.'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  hindi_name = EXCLUDED.hindi_name,
  name_alt = EXCLUDED.name_alt,
  search_terms = EXCLUDED.search_terms,
  category_id = EXCLUDED.category_id,
  subcategory = EXCLUDED.subcategory,
  item_type = EXCLUDED.item_type,
  state = EXCLUDED.state,
  region = EXCLUDED.region,
  default_serving_grams = EXCLUDED.default_serving_grams,
  cal_per_100g = EXCLUDED.cal_per_100g,
  protein_per_100g = EXCLUDED.protein_per_100g,
  carbs_per_100g = EXCLUDED.carbs_per_100g,
  fat_per_100g = EXCLUDED.fat_per_100g,
  fiber_per_100g = EXCLUDED.fiber_per_100g,
  diet_types = EXCLUDED.diet_types,
  tags = EXCLUDED.tags,
  is_processed = EXCLUDED.is_processed,
  contains_root_veg = EXCLUDED.contains_root_veg;

  -- Servings for roasted-chana
  DELETE FROM public.food_servings WHERE food_id = 'roasted-chana';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('roasted-chana', 'handful', '1 handful', 30);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('roasted-chana', 'katori', '1 katori small', 60);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('roasted-chana', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'makhana-roasted', 
  'Makhana (Roasted Fox Nuts, Slightly Salted/Oiled)', 
  'भुना हुआ मखाना', 
  ARRAY['lotus seeds', 'phool makhana']::TEXT[], 
  ARRAY['makhana', 'fox nuts', 'lotus seeds', 'roasted makhana']::TEXT[], 
  'snack-street', 
  'dry-snack', 
  'base-food'::public.item_type_enum, 
  'roasted'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  30,
  350, 9, 77, 0.5, 14,
  150, NULL, NULL, 1.4, 60,
  '{"vegan","veg","jain","nonveg"}'::public.diet_type_enum[], 
  ARRAY['snack', 'low-calorie', 'high-fiber']::TEXT[], 
  '{"navratri","ekadashi","jain-paryushana"}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  false, true, true, false, false, false,
  55, 
  '100g usually includes ~2g ghee used for roasting.', 
  1, 
  'IFCT-2017'::public.source_enum, 
  'medium'::public.confidence_enum, 
  'Extremely light, so 30g is a very large portion visually.'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  hindi_name = EXCLUDED.hindi_name,
  name_alt = EXCLUDED.name_alt,
  search_terms = EXCLUDED.search_terms,
  category_id = EXCLUDED.category_id,
  subcategory = EXCLUDED.subcategory,
  item_type = EXCLUDED.item_type,
  state = EXCLUDED.state,
  region = EXCLUDED.region,
  default_serving_grams = EXCLUDED.default_serving_grams,
  cal_per_100g = EXCLUDED.cal_per_100g,
  protein_per_100g = EXCLUDED.protein_per_100g,
  carbs_per_100g = EXCLUDED.carbs_per_100g,
  fat_per_100g = EXCLUDED.fat_per_100g,
  fiber_per_100g = EXCLUDED.fiber_per_100g,
  diet_types = EXCLUDED.diet_types,
  tags = EXCLUDED.tags,
  is_processed = EXCLUDED.is_processed,
  contains_root_veg = EXCLUDED.contains_root_veg;

  -- Servings for makhana-roasted
  DELETE FROM public.food_servings WHERE food_id = 'makhana-roasted';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('makhana-roasted', 'bowl', '1 bowl', 30);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('makhana-roasted', 'handful', '1 handful', 15);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('makhana-roasted', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'khakhra-plain', 
  'Khakhra (Plain / Whole Wheat)', 
  'खाखरा', 
  ARRAY['khakra']::TEXT[], 
  ARRAY['khakhra', 'khakra', 'gujarati snack', 'crispy roti']::TEXT[], 
  'snack-street', 
  'dry-snack', 
  'base-food'::public.item_type_enum, 
  'roasted'::public.food_state_enum, 
  'west'::public.region_enum, 
  20,
  420, 10.5, 65, 12, 6,
  600, NULL, NULL, 3.5, 40,
  '{"vegan","veg","jain","nonveg"}'::public.diet_type_enum[], 
  ARRAY['snack', 'budget-friendly']::TEXT[], 
  '{}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  false, false, false, false, false, false,
  55, 
  'Values include oil used in the dough.', 
  1, 
  'healthifyme'::public.source_enum, 
  'high'::public.confidence_enum, 
  'Great substitute for fried chips. 1 piece is usually 80-90 calories.'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  hindi_name = EXCLUDED.hindi_name,
  name_alt = EXCLUDED.name_alt,
  search_terms = EXCLUDED.search_terms,
  category_id = EXCLUDED.category_id,
  subcategory = EXCLUDED.subcategory,
  item_type = EXCLUDED.item_type,
  state = EXCLUDED.state,
  region = EXCLUDED.region,
  default_serving_grams = EXCLUDED.default_serving_grams,
  cal_per_100g = EXCLUDED.cal_per_100g,
  protein_per_100g = EXCLUDED.protein_per_100g,
  carbs_per_100g = EXCLUDED.carbs_per_100g,
  fat_per_100g = EXCLUDED.fat_per_100g,
  fiber_per_100g = EXCLUDED.fiber_per_100g,
  diet_types = EXCLUDED.diet_types,
  tags = EXCLUDED.tags,
  is_processed = EXCLUDED.is_processed,
  contains_root_veg = EXCLUDED.contains_root_veg;

  -- Servings for khakhra-plain
  DELETE FROM public.food_servings WHERE food_id = 'khakhra-plain';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('khakhra-plain', 'piece', '1 piece', 20);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('khakhra-plain', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'dhokla', 
  'Khaman Dhokla (Besan Steamed, Sweet/Salty)', 
  'ढोकला', 
  ARRAY['besan dhokla', 'khaman']::TEXT[], 
  ARRAY['dhokla', 'khaman', 'steamed besan', 'gujarati snack']::TEXT[], 
  'snack-street', 
  'street-food', 
  'dish'::public.item_type_enum, 
  'steamed'::public.food_state_enum, 
  'west'::public.region_enum, 
  50,
  160, 7, 22, 4.5, 2.5,
  400, NULL, NULL, 1.5, 30,
  '{"vegan","veg","jain","nonveg"}'::public.diet_type_enum[], 
  ARRAY['snack', 'breakfast', 'low-fat']::TEXT[], 
  '{}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  false, false, true, false, false, false,
  55, 
  'Oil primarily from mustard seed tempering on top.', 
  1, 
  'healthifyme'::public.source_enum, 
  'high'::public.confidence_enum, 
  'Healthy snack option. Sugar water tempering adds to carbs.'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  hindi_name = EXCLUDED.hindi_name,
  name_alt = EXCLUDED.name_alt,
  search_terms = EXCLUDED.search_terms,
  category_id = EXCLUDED.category_id,
  subcategory = EXCLUDED.subcategory,
  item_type = EXCLUDED.item_type,
  state = EXCLUDED.state,
  region = EXCLUDED.region,
  default_serving_grams = EXCLUDED.default_serving_grams,
  cal_per_100g = EXCLUDED.cal_per_100g,
  protein_per_100g = EXCLUDED.protein_per_100g,
  carbs_per_100g = EXCLUDED.carbs_per_100g,
  fat_per_100g = EXCLUDED.fat_per_100g,
  fiber_per_100g = EXCLUDED.fiber_per_100g,
  diet_types = EXCLUDED.diet_types,
  tags = EXCLUDED.tags,
  is_processed = EXCLUDED.is_processed,
  contains_root_veg = EXCLUDED.contains_root_veg;

  -- Servings for dhokla
  DELETE FROM public.food_servings WHERE food_id = 'dhokla';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('dhokla', 'piece', '1 piece (medium)', 50);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('dhokla', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'pakora-onion', 
  'Onion Pakora (Pyaz Ke Pakode, Bhajiya)', 
  'प्याज के पकोड़े', 
  ARRAY['onion bhaji', 'kanda bhaji']::TEXT[], 
  ARRAY['pakora', 'bhajiya', 'onion bhaji', 'pyaz pakoda', 'fritters']::TEXT[], 
  'snack-street', 
  'fried-snack', 
  'dish'::public.item_type_enum, 
  'fried'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  50,
  290, 6, 25, 18, 3.5,
  350, NULL, NULL, 1.5, 35,
  '{"vegan","veg","nonveg"}'::public.diet_type_enum[], 
  ARRAY['snack', 'high-fat']::TEXT[], 
  '{}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  false, false, true, false, true, false,
  60, 
  'Deep fried item.', 
  15, 
  'healthifyme'::public.source_enum, 
  'medium'::public.confidence_enum, 
  'Extremely high calorie density due to deep frying.'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  hindi_name = EXCLUDED.hindi_name,
  name_alt = EXCLUDED.name_alt,
  search_terms = EXCLUDED.search_terms,
  category_id = EXCLUDED.category_id,
  subcategory = EXCLUDED.subcategory,
  item_type = EXCLUDED.item_type,
  state = EXCLUDED.state,
  region = EXCLUDED.region,
  default_serving_grams = EXCLUDED.default_serving_grams,
  cal_per_100g = EXCLUDED.cal_per_100g,
  protein_per_100g = EXCLUDED.protein_per_100g,
  carbs_per_100g = EXCLUDED.carbs_per_100g,
  fat_per_100g = EXCLUDED.fat_per_100g,
  fiber_per_100g = EXCLUDED.fiber_per_100g,
  diet_types = EXCLUDED.diet_types,
  tags = EXCLUDED.tags,
  is_processed = EXCLUDED.is_processed,
  contains_root_veg = EXCLUDED.contains_root_veg;

  -- Servings for pakora-onion
  DELETE FROM public.food_servings WHERE food_id = 'pakora-onion';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('pakora-onion', 'piece', '1 medium pakora', 25);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('pakora-onion', 'handful', '1 small plate', 100);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('pakora-onion', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'gulab-jamun', 
  'Gulab Jamun', 
  'गुलाब जामुन', 
  ARRAY['jamun', 'kala jamun']::TEXT[], 
  ARRAY['gulab', 'jamun', 'kala jamun', 'sweet']::TEXT[], 
  'sweet-mithai', 
  'milk-sweet', 
  'dish'::public.item_type_enum, 
  'fried'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  50,
  320, 6, 55, 10, 0.5,
  50, NULL, NULL, 0.5, 50,
  '{"veg","jain","nonveg"}'::public.diet_type_enum[], 
  ARRAY['snack', 'high-sugar']::TEXT[], 
  '{}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  false, false, false, false, false, false,
  75, 
  'Deep fried in oil or ghee, then soaked in sugar syrup.', 
  8, 
  'healthifyme'::public.source_enum, 
  'high'::public.confidence_enum, 
  'Very high sugar and calorie content.'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  hindi_name = EXCLUDED.hindi_name,
  name_alt = EXCLUDED.name_alt,
  search_terms = EXCLUDED.search_terms,
  category_id = EXCLUDED.category_id,
  subcategory = EXCLUDED.subcategory,
  item_type = EXCLUDED.item_type,
  state = EXCLUDED.state,
  region = EXCLUDED.region,
  default_serving_grams = EXCLUDED.default_serving_grams,
  cal_per_100g = EXCLUDED.cal_per_100g,
  protein_per_100g = EXCLUDED.protein_per_100g,
  carbs_per_100g = EXCLUDED.carbs_per_100g,
  fat_per_100g = EXCLUDED.fat_per_100g,
  fiber_per_100g = EXCLUDED.fiber_per_100g,
  diet_types = EXCLUDED.diet_types,
  tags = EXCLUDED.tags,
  is_processed = EXCLUDED.is_processed,
  contains_root_veg = EXCLUDED.contains_root_veg;

  -- Servings for gulab-jamun
  DELETE FROM public.food_servings WHERE food_id = 'gulab-jamun';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('gulab-jamun', 'piece', '1 piece', 50);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('gulab-jamun', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'rasgulla', 
  'Rasgulla', 
  'रसगुल्ला', 
  ARRAY['roshogolla', 'rasagolla']::TEXT[], 
  ARRAY['rasgulla', 'roshogolla', 'sponge rasgulla', 'sweet']::TEXT[], 
  'sweet-mithai', 
  'milk-sweet', 
  'dish'::public.item_type_enum, 
  'cooked'::public.food_state_enum, 
  'east'::public.region_enum, 
  50,
  186, 4.5, 40, 1.5, 0.1,
  20, 0.2, NULL, 0.1, 80,
  '{"veg","jain","nonveg"}'::public.diet_type_enum[], 
  ARRAY['snack', 'high-sugar', 'low-fat']::TEXT[], 
  '{}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  false, false, true, false, false, false,
  65, 
  NULL, 
  0, 
  'healthifyme'::public.source_enum, 
  'high'::public.confidence_enum, 
  'Lower in fat than most Indian sweets because it is boiled, not fried. Calories come mostly from sugar syrup.'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  hindi_name = EXCLUDED.hindi_name,
  name_alt = EXCLUDED.name_alt,
  search_terms = EXCLUDED.search_terms,
  category_id = EXCLUDED.category_id,
  subcategory = EXCLUDED.subcategory,
  item_type = EXCLUDED.item_type,
  state = EXCLUDED.state,
  region = EXCLUDED.region,
  default_serving_grams = EXCLUDED.default_serving_grams,
  cal_per_100g = EXCLUDED.cal_per_100g,
  protein_per_100g = EXCLUDED.protein_per_100g,
  carbs_per_100g = EXCLUDED.carbs_per_100g,
  fat_per_100g = EXCLUDED.fat_per_100g,
  fiber_per_100g = EXCLUDED.fiber_per_100g,
  diet_types = EXCLUDED.diet_types,
  tags = EXCLUDED.tags,
  is_processed = EXCLUDED.is_processed,
  contains_root_veg = EXCLUDED.contains_root_veg;

  -- Servings for rasgulla
  DELETE FROM public.food_servings WHERE food_id = 'rasgulla';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('rasgulla', 'piece', '1 piece', 50);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('rasgulla', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'besan-ladoo', 
  'Besan Ladoo', 
  'बेसन के लड्डू', 
  ARRAY['basen laddu']::TEXT[], 
  ARRAY['besan', 'ladoo', 'laddu', 'sweet']::TEXT[], 
  'sweet-mithai', 
  'dry-sweet', 
  'dish'::public.item_type_enum, 
  'cooked'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  40,
  485, 10, 55, 25, 3.5,
  10, NULL, NULL, 2, 30,
  '{"veg","jain","nonveg"}'::public.diet_type_enum[], 
  ARRAY['snack', 'high-calorie', 'high-fat', 'high-sugar']::TEXT[], 
  '{}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  false, false, true, false, false, false,
  60, 
  'Very high ghee content.', 
  10, 
  'healthifyme'::public.source_enum, 
  'medium'::public.confidence_enum, 
  'Calorie dense due to heavy use of ghee.'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  hindi_name = EXCLUDED.hindi_name,
  name_alt = EXCLUDED.name_alt,
  search_terms = EXCLUDED.search_terms,
  category_id = EXCLUDED.category_id,
  subcategory = EXCLUDED.subcategory,
  item_type = EXCLUDED.item_type,
  state = EXCLUDED.state,
  region = EXCLUDED.region,
  default_serving_grams = EXCLUDED.default_serving_grams,
  cal_per_100g = EXCLUDED.cal_per_100g,
  protein_per_100g = EXCLUDED.protein_per_100g,
  carbs_per_100g = EXCLUDED.carbs_per_100g,
  fat_per_100g = EXCLUDED.fat_per_100g,
  fiber_per_100g = EXCLUDED.fiber_per_100g,
  diet_types = EXCLUDED.diet_types,
  tags = EXCLUDED.tags,
  is_processed = EXCLUDED.is_processed,
  contains_root_veg = EXCLUDED.contains_root_veg;

  -- Servings for besan-ladoo
  DELETE FROM public.food_servings WHERE food_id = 'besan-ladoo';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('besan-ladoo', 'piece', '1 piece', 40);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('besan-ladoo', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'motichoor-ladoo', 
  'Motichoor Ladoo', 
  'मोतीचूर के लड्डू', 
  ARRAY['boondi laddu', 'motichur']::TEXT[], 
  ARRAY['motichoor', 'ladoo', 'laddu', 'boondi']::TEXT[], 
  'sweet-mithai', 
  'dry-sweet', 
  'dish'::public.item_type_enum, 
  'fried'::public.food_state_enum, 
  'north'::public.region_enum, 
  40,
  450, 4, 65, 20, 1.5,
  15, NULL, NULL, 1, 20,
  '{"veg","jain","nonveg"}'::public.diet_type_enum[], 
  ARRAY['snack', 'high-sugar', 'high-fat']::TEXT[], 
  '{}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  false, false, true, false, false, false,
  70, 
  'Boondi is deep fried in ghee/oil before shaping.', 
  8, 
  'healthifyme'::public.source_enum, 
  'medium'::public.confidence_enum, 
  NULL
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  hindi_name = EXCLUDED.hindi_name,
  name_alt = EXCLUDED.name_alt,
  search_terms = EXCLUDED.search_terms,
  category_id = EXCLUDED.category_id,
  subcategory = EXCLUDED.subcategory,
  item_type = EXCLUDED.item_type,
  state = EXCLUDED.state,
  region = EXCLUDED.region,
  default_serving_grams = EXCLUDED.default_serving_grams,
  cal_per_100g = EXCLUDED.cal_per_100g,
  protein_per_100g = EXCLUDED.protein_per_100g,
  carbs_per_100g = EXCLUDED.carbs_per_100g,
  fat_per_100g = EXCLUDED.fat_per_100g,
  fiber_per_100g = EXCLUDED.fiber_per_100g,
  diet_types = EXCLUDED.diet_types,
  tags = EXCLUDED.tags,
  is_processed = EXCLUDED.is_processed,
  contains_root_veg = EXCLUDED.contains_root_veg;

  -- Servings for motichoor-ladoo
  DELETE FROM public.food_servings WHERE food_id = 'motichoor-ladoo';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('motichoor-ladoo', 'piece', '1 piece', 40);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('motichoor-ladoo', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'kaju-katli', 
  'Kaju Katli (Cashew Fudge)', 
  'काजू कतली', 
  ARRAY['kaju barfi']::TEXT[], 
  ARRAY['kaju', 'katli', 'barfi', 'cashew sweet']::TEXT[], 
  'sweet-mithai', 
  'dry-sweet', 
  'dish'::public.item_type_enum, 
  'cooked'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  15,
  450, 10, 55, 22, 2,
  10, NULL, NULL, 3, 30,
  '{"vegan","veg","jain","nonveg"}'::public.diet_type_enum[], 
  ARRAY['snack', 'high-sugar', 'high-fat', 'premium']::TEXT[], 
  '{"navratri","ekadashi","jain-paryushana"}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  false, true, true, false, false, false,
  50, 
  NULL, 
  0, 
  'healthifyme'::public.source_enum, 
  'high'::public.confidence_enum, 
  'About 60-70 calories per piece.'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  hindi_name = EXCLUDED.hindi_name,
  name_alt = EXCLUDED.name_alt,
  search_terms = EXCLUDED.search_terms,
  category_id = EXCLUDED.category_id,
  subcategory = EXCLUDED.subcategory,
  item_type = EXCLUDED.item_type,
  state = EXCLUDED.state,
  region = EXCLUDED.region,
  default_serving_grams = EXCLUDED.default_serving_grams,
  cal_per_100g = EXCLUDED.cal_per_100g,
  protein_per_100g = EXCLUDED.protein_per_100g,
  carbs_per_100g = EXCLUDED.carbs_per_100g,
  fat_per_100g = EXCLUDED.fat_per_100g,
  fiber_per_100g = EXCLUDED.fiber_per_100g,
  diet_types = EXCLUDED.diet_types,
  tags = EXCLUDED.tags,
  is_processed = EXCLUDED.is_processed,
  contains_root_veg = EXCLUDED.contains_root_veg;

  -- Servings for kaju-katli
  DELETE FROM public.food_servings WHERE food_id = 'kaju-katli';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('kaju-katli', 'piece', '1 piece', 15);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('kaju-katli', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'jalebi', 
  'Jalebi', 
  'जलेबी', 
  ARRAY['jilebi', 'imarti']::TEXT[], 
  ARRAY['jalebi', 'jilbi', 'sweet', 'imarti']::TEXT[], 
  'sweet-mithai', 
  'fried-sweet', 
  'dish'::public.item_type_enum, 
  'fried'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  50,
  380, 3, 70, 10.5, 0.5,
  5, NULL, NULL, 0.5, 15,
  '{"veg","jain","nonveg"}'::public.diet_type_enum[], 
  ARRAY['snack', 'high-sugar', 'high-carb']::TEXT[], 
  '{}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  false, false, false, false, false, false,
  80, 
  'Deep fried and soaked in sugar syrup.', 
  5, 
  'healthifyme'::public.source_enum, 
  'medium'::public.confidence_enum, 
  NULL
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  hindi_name = EXCLUDED.hindi_name,
  name_alt = EXCLUDED.name_alt,
  search_terms = EXCLUDED.search_terms,
  category_id = EXCLUDED.category_id,
  subcategory = EXCLUDED.subcategory,
  item_type = EXCLUDED.item_type,
  state = EXCLUDED.state,
  region = EXCLUDED.region,
  default_serving_grams = EXCLUDED.default_serving_grams,
  cal_per_100g = EXCLUDED.cal_per_100g,
  protein_per_100g = EXCLUDED.protein_per_100g,
  carbs_per_100g = EXCLUDED.carbs_per_100g,
  fat_per_100g = EXCLUDED.fat_per_100g,
  fiber_per_100g = EXCLUDED.fiber_per_100g,
  diet_types = EXCLUDED.diet_types,
  tags = EXCLUDED.tags,
  is_processed = EXCLUDED.is_processed,
  contains_root_veg = EXCLUDED.contains_root_veg;

  -- Servings for jalebi
  DELETE FROM public.food_servings WHERE food_id = 'jalebi';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('jalebi', 'piece', '1 medium piece', 50);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('jalebi', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'banana-raw', 
  'Banana (Raw / Ripe)', 
  'केला', 
  ARRAY['kela']::TEXT[], 
  ARRAY['banana', 'kela', 'fruit']::TEXT[], 
  'fruit', 
  'fresh-fruit', 
  'base-food'::public.item_type_enum, 
  'raw'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  120,
  89, 1.1, 22.8, 0.3, 2.6,
  1, NULL, NULL, 0.3, 5,
  '{"vegan","veg","jain","nonveg"}'::public.diet_type_enum[], 
  ARRAY['snack', 'pre-workout', 'high-carb', 'budget-friendly']::TEXT[], 
  '{"navratri","ekadashi","jain-paryushana","ramzan"}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  false, true, true, false, false, false,
  52, 
  NULL, 
  0, 
  'USDA'::public.source_enum, 
  'high'::public.confidence_enum, 
  'Excellent pre-workout carb source. Value excludes peel.'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  hindi_name = EXCLUDED.hindi_name,
  name_alt = EXCLUDED.name_alt,
  search_terms = EXCLUDED.search_terms,
  category_id = EXCLUDED.category_id,
  subcategory = EXCLUDED.subcategory,
  item_type = EXCLUDED.item_type,
  state = EXCLUDED.state,
  region = EXCLUDED.region,
  default_serving_grams = EXCLUDED.default_serving_grams,
  cal_per_100g = EXCLUDED.cal_per_100g,
  protein_per_100g = EXCLUDED.protein_per_100g,
  carbs_per_100g = EXCLUDED.carbs_per_100g,
  fat_per_100g = EXCLUDED.fat_per_100g,
  fiber_per_100g = EXCLUDED.fiber_per_100g,
  diet_types = EXCLUDED.diet_types,
  tags = EXCLUDED.tags,
  is_processed = EXCLUDED.is_processed,
  contains_root_veg = EXCLUDED.contains_root_veg;

  -- Servings for banana-raw
  DELETE FROM public.food_servings WHERE food_id = 'banana-raw';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('banana-raw', 'medium', '1 medium', 120);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('banana-raw', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'mango-raw', 
  'Mango (Ripe)', 
  'आम', 
  ARRAY['aam']::TEXT[], 
  ARRAY['mango', 'aam', 'fruit', 'alphonso']::TEXT[], 
  'fruit', 
  'fresh-fruit', 
  'base-food'::public.item_type_enum, 
  'raw'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  200,
  60, 0.8, 15, 0.4, 1.6,
  1, NULL, NULL, 0.2, 11,
  '{"vegan","veg","jain","nonveg"}'::public.diet_type_enum[], 
  ARRAY['snack', 'high-sugar']::TEXT[], 
  '{"navratri","ekadashi","jain-paryushana","ramzan"}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  false, true, true, false, false, false,
  51, 
  NULL, 
  0, 
  'USDA'::public.source_enum, 
  'high'::public.confidence_enum, 
  NULL
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  hindi_name = EXCLUDED.hindi_name,
  name_alt = EXCLUDED.name_alt,
  search_terms = EXCLUDED.search_terms,
  category_id = EXCLUDED.category_id,
  subcategory = EXCLUDED.subcategory,
  item_type = EXCLUDED.item_type,
  state = EXCLUDED.state,
  region = EXCLUDED.region,
  default_serving_grams = EXCLUDED.default_serving_grams,
  cal_per_100g = EXCLUDED.cal_per_100g,
  protein_per_100g = EXCLUDED.protein_per_100g,
  carbs_per_100g = EXCLUDED.carbs_per_100g,
  fat_per_100g = EXCLUDED.fat_per_100g,
  fiber_per_100g = EXCLUDED.fiber_per_100g,
  diet_types = EXCLUDED.diet_types,
  tags = EXCLUDED.tags,
  is_processed = EXCLUDED.is_processed,
  contains_root_veg = EXCLUDED.contains_root_veg;

  -- Servings for mango-raw
  DELETE FROM public.food_servings WHERE food_id = 'mango-raw';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('mango-raw', 'medium', '1 medium (flesh only)', 200);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('mango-raw', 'katori', '1 katori (cubed)', 150);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('mango-raw', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'almonds-raw', 
  'Almonds (Badam, Raw)', 
  'बादाम', 
  ARRAY['badam']::TEXT[], 
  ARRAY['almond', 'badam', 'nuts', 'dry fruit']::TEXT[], 
  'fruit', 
  'dry-fruits-nuts', 
  'base-food'::public.item_type_enum, 
  'raw'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  30,
  579, 21.2, 21.7, 49.9, 12.5,
  1, NULL, NULL, 3.7, 269,
  '{"vegan","veg","jain","nonveg"}'::public.diet_type_enum[], 
  ARRAY['snack', 'high-fat', 'high-protein', 'healthy-fats']::TEXT[], 
  '{"navratri","ekadashi","jain-paryushana","ramzan"}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  false, true, true, false, false, false,
  NULL, 
  NULL, 
  0, 
  'USDA'::public.source_enum, 
  'high'::public.confidence_enum, 
  NULL
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  hindi_name = EXCLUDED.hindi_name,
  name_alt = EXCLUDED.name_alt,
  search_terms = EXCLUDED.search_terms,
  category_id = EXCLUDED.category_id,
  subcategory = EXCLUDED.subcategory,
  item_type = EXCLUDED.item_type,
  state = EXCLUDED.state,
  region = EXCLUDED.region,
  default_serving_grams = EXCLUDED.default_serving_grams,
  cal_per_100g = EXCLUDED.cal_per_100g,
  protein_per_100g = EXCLUDED.protein_per_100g,
  carbs_per_100g = EXCLUDED.carbs_per_100g,
  fat_per_100g = EXCLUDED.fat_per_100g,
  fiber_per_100g = EXCLUDED.fiber_per_100g,
  diet_types = EXCLUDED.diet_types,
  tags = EXCLUDED.tags,
  is_processed = EXCLUDED.is_processed,
  contains_root_veg = EXCLUDED.contains_root_veg;

  -- Servings for almonds-raw
  DELETE FROM public.food_servings WHERE food_id = 'almonds-raw';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('almonds-raw', 'handful', '1 handful', 30);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('almonds-raw', 'piece', '5 pieces', 6);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('almonds-raw', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'dates-khajoor', 
  'Dates (Khajoor, Dried)', 
  'खजूर', 
  ARRAY['khajur', 'pind khajoor']::TEXT[], 
  ARRAY['dates', 'khajoor', 'khajur', 'dry fruit']::TEXT[], 
  'fruit', 
  'dry-fruits-nuts', 
  'base-food'::public.item_type_enum, 
  'raw'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  24,
  277, 1.8, 75, 0.2, 8,
  1, NULL, NULL, 1, 64,
  '{"vegan","veg","jain","nonveg"}'::public.diet_type_enum[], 
  ARRAY['snack', 'pre-workout', 'high-sugar']::TEXT[], 
  '{"navratri","ekadashi","jain-paryushana","ramzan"}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  false, true, true, false, false, false,
  42, 
  NULL, 
  0, 
  'USDA'::public.source_enum, 
  'high'::public.confidence_enum, 
  'Excellent natural pre-workout energy. Staple for Ramzan iftar.'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  hindi_name = EXCLUDED.hindi_name,
  name_alt = EXCLUDED.name_alt,
  search_terms = EXCLUDED.search_terms,
  category_id = EXCLUDED.category_id,
  subcategory = EXCLUDED.subcategory,
  item_type = EXCLUDED.item_type,
  state = EXCLUDED.state,
  region = EXCLUDED.region,
  default_serving_grams = EXCLUDED.default_serving_grams,
  cal_per_100g = EXCLUDED.cal_per_100g,
  protein_per_100g = EXCLUDED.protein_per_100g,
  carbs_per_100g = EXCLUDED.carbs_per_100g,
  fat_per_100g = EXCLUDED.fat_per_100g,
  fiber_per_100g = EXCLUDED.fiber_per_100g,
  diet_types = EXCLUDED.diet_types,
  tags = EXCLUDED.tags,
  is_processed = EXCLUDED.is_processed,
  contains_root_veg = EXCLUDED.contains_root_veg;

  -- Servings for dates-khajoor
  DELETE FROM public.food_servings WHERE food_id = 'dates-khajoor';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('dates-khajoor', 'piece', '1 date (pitted)', 8);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('dates-khajoor', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'chai-base', 
  'Chai (Base — Black Tea)', 
  'चाय', 
  ARRAY['chai', 'tea black', 'plain tea']::TEXT[], 
  ARRAY['chai', 'tea', 'black tea']::TEXT[], 
  'drink', 
  'tea-coffee', 
  'drink'::public.item_type_enum, 
  'cooked'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  150,
  2, 0.1, 0.3, 0, 0,
  4, NULL, NULL, 0.1, NULL,
  '{"vegan","veg","jain","nonveg"}'::public.diet_type_enum[], 
  ARRAY['breakfast', 'snack', 'low-calorie']::TEXT[], 
  '{"navratri","ekadashi","jain-paryushana","ramzan"}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  false, true, true, false, false, true,
  NULL, 
  NULL, 
  0, 
  'USDA'::public.source_enum, 
  'high'::public.confidence_enum, 
  'Base values only. Use the Beverage Builder to add milk and sugar.'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  hindi_name = EXCLUDED.hindi_name,
  name_alt = EXCLUDED.name_alt,
  search_terms = EXCLUDED.search_terms,
  category_id = EXCLUDED.category_id,
  subcategory = EXCLUDED.subcategory,
  item_type = EXCLUDED.item_type,
  state = EXCLUDED.state,
  region = EXCLUDED.region,
  default_serving_grams = EXCLUDED.default_serving_grams,
  cal_per_100g = EXCLUDED.cal_per_100g,
  protein_per_100g = EXCLUDED.protein_per_100g,
  carbs_per_100g = EXCLUDED.carbs_per_100g,
  fat_per_100g = EXCLUDED.fat_per_100g,
  fiber_per_100g = EXCLUDED.fiber_per_100g,
  diet_types = EXCLUDED.diet_types,
  tags = EXCLUDED.tags,
  is_processed = EXCLUDED.is_processed,
  contains_root_veg = EXCLUDED.contains_root_veg;

  -- Servings for chai-base
  DELETE FROM public.food_servings WHERE food_id = 'chai-base';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('chai-base', 'cup', '1 cup (150ml)', 150);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('chai-base', 'glass', '1 tall glass', 250);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('chai-base', 'g100', '100ml', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'coffee-black', 
  'Black Coffee (Base)', 
  'ब्लैक कॉफ़ी', 
  ARRAY['filter coffee base', 'nescafe black']::TEXT[], 
  ARRAY['coffee', 'black coffee', 'americano', 'nescafe']::TEXT[], 
  'drink', 
  'tea-coffee', 
  'drink'::public.item_type_enum, 
  'cooked'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  150,
  2, 0.3, 0.3, 0, 0,
  2, NULL, NULL, NULL, 2,
  '{"vegan","veg","jain","nonveg"}'::public.diet_type_enum[], 
  ARRAY['breakfast', 'pre-workout', 'low-calorie']::TEXT[], 
  '{"navratri","ekadashi","jain-paryushana"}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  false, true, true, false, false, true,
  NULL, 
  NULL, 
  0, 
  'USDA'::public.source_enum, 
  'high'::public.confidence_enum, 
  NULL
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  hindi_name = EXCLUDED.hindi_name,
  name_alt = EXCLUDED.name_alt,
  search_terms = EXCLUDED.search_terms,
  category_id = EXCLUDED.category_id,
  subcategory = EXCLUDED.subcategory,
  item_type = EXCLUDED.item_type,
  state = EXCLUDED.state,
  region = EXCLUDED.region,
  default_serving_grams = EXCLUDED.default_serving_grams,
  cal_per_100g = EXCLUDED.cal_per_100g,
  protein_per_100g = EXCLUDED.protein_per_100g,
  carbs_per_100g = EXCLUDED.carbs_per_100g,
  fat_per_100g = EXCLUDED.fat_per_100g,
  fiber_per_100g = EXCLUDED.fiber_per_100g,
  diet_types = EXCLUDED.diet_types,
  tags = EXCLUDED.tags,
  is_processed = EXCLUDED.is_processed,
  contains_root_veg = EXCLUDED.contains_root_veg;

  -- Servings for coffee-black
  DELETE FROM public.food_servings WHERE food_id = 'coffee-black';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('coffee-black', 'cup', '1 cup (150ml)', 150);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('coffee-black', 'glass', '1 tall glass', 250);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('coffee-black', 'g100', '100ml', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'haldi-doodh-base', 
  'Haldi Doodh (Base — Turmeric Water/Mix)', 
  'हल्दी दूध बेस', 
  ARRAY['turmeric latte base', 'golden milk base']::TEXT[], 
  ARRAY['haldi', 'doodh', 'turmeric', 'golden milk']::TEXT[], 
  'drink', 
  'milk-based', 
  'drink'::public.item_type_enum, 
  'cooked'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  150,
  5, 0.2, 1, 0.1, 0.5,
  2, NULL, NULL, 0.5, 5,
  '{"veg","jain","nonveg"}'::public.diet_type_enum[], 
  ARRAY['before-bed', 'immunity', 'low-calorie']::TEXT[], 
  '{"navratri","ekadashi"}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  false, true, true, false, false, true,
  NULL, 
  NULL, 
  0, 
  'curated-estimate'::public.source_enum, 
  'medium'::public.confidence_enum, 
  'Base values for haldi+water. Must add milk and sugar/honey via Beverage Builder.'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  hindi_name = EXCLUDED.hindi_name,
  name_alt = EXCLUDED.name_alt,
  search_terms = EXCLUDED.search_terms,
  category_id = EXCLUDED.category_id,
  subcategory = EXCLUDED.subcategory,
  item_type = EXCLUDED.item_type,
  state = EXCLUDED.state,
  region = EXCLUDED.region,
  default_serving_grams = EXCLUDED.default_serving_grams,
  cal_per_100g = EXCLUDED.cal_per_100g,
  protein_per_100g = EXCLUDED.protein_per_100g,
  carbs_per_100g = EXCLUDED.carbs_per_100g,
  fat_per_100g = EXCLUDED.fat_per_100g,
  fiber_per_100g = EXCLUDED.fiber_per_100g,
  diet_types = EXCLUDED.diet_types,
  tags = EXCLUDED.tags,
  is_processed = EXCLUDED.is_processed,
  contains_root_veg = EXCLUDED.contains_root_veg;

  -- Servings for haldi-doodh-base
  DELETE FROM public.food_servings WHERE food_id = 'haldi-doodh-base';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('haldi-doodh-base', 'glass', '1 glass (200ml)', 200);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('haldi-doodh-base', 'cup', '1 cup', 150);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('haldi-doodh-base', 'g100', '100ml', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'sattu-sharbat', 
  'Sattu Sharbat (Namkeen/Salty)', 
  'सत्तू शर्बत', 
  ARRAY['sattu drink', 'sattu cooler']::TEXT[], 
  ARRAY['sattu', 'sharbat', 'drink', 'desi protein shake']::TEXT[], 
  'drink', 
  'cooling', 
  'dish'::public.item_type_enum, 
  'raw'::public.food_state_enum, 
  'north'::public.region_enum, 
  300,
  45, 2.2, 7.5, 0.7, 2,
  120, NULL, NULL, 0.8, 15,
  '{"vegan","veg","jain","nonveg"}'::public.diet_type_enum[], 
  ARRAY['snack', 'high-protein', 'cooling', 'budget-friendly']::TEXT[], 
  '{}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  false, false, true, false, true, false,
  25, 
  NULL, 
  0, 
  'healthifyme'::public.source_enum, 
  'medium'::public.confidence_enum, 
  'The Indian "Desi Protein Shake". Made with 30-40g roasted bengal gram powder per glass.'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  hindi_name = EXCLUDED.hindi_name,
  name_alt = EXCLUDED.name_alt,
  search_terms = EXCLUDED.search_terms,
  category_id = EXCLUDED.category_id,
  subcategory = EXCLUDED.subcategory,
  item_type = EXCLUDED.item_type,
  state = EXCLUDED.state,
  region = EXCLUDED.region,
  default_serving_grams = EXCLUDED.default_serving_grams,
  cal_per_100g = EXCLUDED.cal_per_100g,
  protein_per_100g = EXCLUDED.protein_per_100g,
  carbs_per_100g = EXCLUDED.carbs_per_100g,
  fat_per_100g = EXCLUDED.fat_per_100g,
  fiber_per_100g = EXCLUDED.fiber_per_100g,
  diet_types = EXCLUDED.diet_types,
  tags = EXCLUDED.tags,
  is_processed = EXCLUDED.is_processed,
  contains_root_veg = EXCLUDED.contains_root_veg;

  -- Servings for sattu-sharbat
  DELETE FROM public.food_servings WHERE food_id = 'sattu-sharbat';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('sattu-sharbat', 'glass', '1 tall glass (300ml)', 300);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('sattu-sharbat', 'g100', '100ml', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'coconut-water', 
  'Coconut Water (Tender)', 
  'नारियल पानी', 
  ARRAY['nariyal pani', 'daab']::TEXT[], 
  ARRAY['coconut water', 'nariyal pani', 'daab']::TEXT[], 
  'drink', 
  'fruit-juice', 
  'base-food'::public.item_type_enum, 
  'raw'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  250,
  19, 0.7, 4, 0.2, 1.1,
  105, NULL, NULL, 0.3, 24,
  '{"vegan","veg","jain","nonveg"}'::public.diet_type_enum[], 
  ARRAY['post-workout', 'hydration', 'low-calorie']::TEXT[], 
  '{"navratri","ekadashi","jain-paryushana","ramzan"}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  false, true, true, false, false, false,
  35, 
  NULL, 
  0, 
  'USDA'::public.source_enum, 
  'high'::public.confidence_enum, 
  'Must-have post-workout hydration. Very rich in potassium.'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  hindi_name = EXCLUDED.hindi_name,
  name_alt = EXCLUDED.name_alt,
  search_terms = EXCLUDED.search_terms,
  category_id = EXCLUDED.category_id,
  subcategory = EXCLUDED.subcategory,
  item_type = EXCLUDED.item_type,
  state = EXCLUDED.state,
  region = EXCLUDED.region,
  default_serving_grams = EXCLUDED.default_serving_grams,
  cal_per_100g = EXCLUDED.cal_per_100g,
  protein_per_100g = EXCLUDED.protein_per_100g,
  carbs_per_100g = EXCLUDED.carbs_per_100g,
  fat_per_100g = EXCLUDED.fat_per_100g,
  fiber_per_100g = EXCLUDED.fiber_per_100g,
  diet_types = EXCLUDED.diet_types,
  tags = EXCLUDED.tags,
  is_processed = EXCLUDED.is_processed,
  contains_root_veg = EXCLUDED.contains_root_veg;

  -- Servings for coconut-water
  DELETE FROM public.food_servings WHERE food_id = 'coconut-water';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('coconut-water', 'medium', '1 medium coconut (~250ml)', 250);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('coconut-water', 'glass', '1 glass', 200);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('coconut-water', 'g100', '100ml', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'gajar-halwa', 
  'Gajar Ka Halwa (Carrot Pudding)', 
  'गाजर का हलवा', 
  ARRAY['carrot halwa']::TEXT[], 
  ARRAY['gajar', 'halwa', 'carrot', 'sweet']::TEXT[], 
  'sweet-mithai', 
  'halwa', 
  'dish'::public.item_type_enum, 
  'cooked'::public.food_state_enum, 
  'north'::public.region_enum, 
  100,
  280, 4.5, 32, 15, 2,
  50, 0.1, NULL, 0.8, 150,
  '{"veg","jain","nonveg"}'::public.diet_type_enum[], 
  ARRAY['snack', 'high-sugar']::TEXT[], 
  '{}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  false, false, true, false, true, false,
  60, 
  'Cooked in significant ghee.', 
  12, 
  'healthifyme'::public.source_enum, 
  'medium'::public.confidence_enum, 
  NULL
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  hindi_name = EXCLUDED.hindi_name,
  name_alt = EXCLUDED.name_alt,
  search_terms = EXCLUDED.search_terms,
  category_id = EXCLUDED.category_id,
  subcategory = EXCLUDED.subcategory,
  item_type = EXCLUDED.item_type,
  state = EXCLUDED.state,
  region = EXCLUDED.region,
  default_serving_grams = EXCLUDED.default_serving_grams,
  cal_per_100g = EXCLUDED.cal_per_100g,
  protein_per_100g = EXCLUDED.protein_per_100g,
  carbs_per_100g = EXCLUDED.carbs_per_100g,
  fat_per_100g = EXCLUDED.fat_per_100g,
  fiber_per_100g = EXCLUDED.fiber_per_100g,
  diet_types = EXCLUDED.diet_types,
  tags = EXCLUDED.tags,
  is_processed = EXCLUDED.is_processed,
  contains_root_veg = EXCLUDED.contains_root_veg;

  -- Servings for gajar-halwa
  DELETE FROM public.food_servings WHERE food_id = 'gajar-halwa';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('gajar-halwa', 'katori', '1 katori', 150);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('gajar-halwa', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'sooji-halwa', 
  'Sooji Halwa', 
  'सूजी का हलवा', 
  ARRAY['sheera', 'rava kesari']::TEXT[], 
  ARRAY['sooji', 'halwa', 'sheera', 'rava', 'sweet']::TEXT[], 
  'sweet-mithai', 
  'halwa', 
  'dish'::public.item_type_enum, 
  'cooked'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  100,
  350, 3.5, 45, 18, 1,
  10, NULL, NULL, 1, 20,
  '{"veg","jain","nonveg"}'::public.diet_type_enum[], 
  ARRAY['snack', 'high-sugar']::TEXT[], 
  '{}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  false, false, false, false, false, false,
  70, 
  'Roasted in ghee.', 
  15, 
  'healthifyme'::public.source_enum, 
  'medium'::public.confidence_enum, 
  NULL
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  hindi_name = EXCLUDED.hindi_name,
  name_alt = EXCLUDED.name_alt,
  search_terms = EXCLUDED.search_terms,
  category_id = EXCLUDED.category_id,
  subcategory = EXCLUDED.subcategory,
  item_type = EXCLUDED.item_type,
  state = EXCLUDED.state,
  region = EXCLUDED.region,
  default_serving_grams = EXCLUDED.default_serving_grams,
  cal_per_100g = EXCLUDED.cal_per_100g,
  protein_per_100g = EXCLUDED.protein_per_100g,
  carbs_per_100g = EXCLUDED.carbs_per_100g,
  fat_per_100g = EXCLUDED.fat_per_100g,
  fiber_per_100g = EXCLUDED.fiber_per_100g,
  diet_types = EXCLUDED.diet_types,
  tags = EXCLUDED.tags,
  is_processed = EXCLUDED.is_processed,
  contains_root_veg = EXCLUDED.contains_root_veg;

  -- Servings for sooji-halwa
  DELETE FROM public.food_servings WHERE food_id = 'sooji-halwa';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('sooji-halwa', 'katori', '1 katori', 100);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('sooji-halwa', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'kheer', 
  'Rice Kheer (Payasam)', 
  'खीर', 
  ARRAY['payasam', 'rice pudding']::TEXT[], 
  ARRAY['kheer', 'payasam', 'rice sweet']::TEXT[], 
  'sweet-mithai', 
  'milk-sweet', 
  'dish'::public.item_type_enum, 
  'cooked'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  150,
  120, 3, 18, 4, 0.2,
  40, 0.2, NULL, 0.2, 90,
  '{"veg","jain","nonveg"}'::public.diet_type_enum[], 
  ARRAY['snack', 'high-sugar']::TEXT[], 
  '{}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  false, false, true, false, false, false,
  65, 
  NULL, 
  0, 
  'healthifyme'::public.source_enum, 
  'medium'::public.confidence_enum, 
  NULL
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  hindi_name = EXCLUDED.hindi_name,
  name_alt = EXCLUDED.name_alt,
  search_terms = EXCLUDED.search_terms,
  category_id = EXCLUDED.category_id,
  subcategory = EXCLUDED.subcategory,
  item_type = EXCLUDED.item_type,
  state = EXCLUDED.state,
  region = EXCLUDED.region,
  default_serving_grams = EXCLUDED.default_serving_grams,
  cal_per_100g = EXCLUDED.cal_per_100g,
  protein_per_100g = EXCLUDED.protein_per_100g,
  carbs_per_100g = EXCLUDED.carbs_per_100g,
  fat_per_100g = EXCLUDED.fat_per_100g,
  fiber_per_100g = EXCLUDED.fiber_per_100g,
  diet_types = EXCLUDED.diet_types,
  tags = EXCLUDED.tags,
  is_processed = EXCLUDED.is_processed,
  contains_root_veg = EXCLUDED.contains_root_veg;

  -- Servings for kheer
  DELETE FROM public.food_servings WHERE food_id = 'kheer';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('kheer', 'katori', '1 katori', 150);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('kheer', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'barfi-plain', 
  'Barfi (Plain/Mawa)', 
  'बर्फी', 
  ARRAY['mawa barfi', 'milk burfi']::TEXT[], 
  ARRAY['barfi', 'burfi', 'mawa', 'sweet']::TEXT[], 
  'sweet-mithai', 
  'dry-sweet', 
  'dish'::public.item_type_enum, 
  'cooked'::public.food_state_enum, 
  'north'::public.region_enum, 
  30,
  370, 12, 45, 15, 0,
  50, 0.5, NULL, 0.5, 150,
  '{"veg","jain","nonveg"}'::public.diet_type_enum[], 
  ARRAY['snack', 'high-sugar']::TEXT[], 
  '{"navratri","ekadashi"}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  false, true, true, false, false, false,
  60, 
  NULL, 
  0, 
  'healthifyme'::public.source_enum, 
  'medium'::public.confidence_enum, 
  NULL
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  hindi_name = EXCLUDED.hindi_name,
  name_alt = EXCLUDED.name_alt,
  search_terms = EXCLUDED.search_terms,
  category_id = EXCLUDED.category_id,
  subcategory = EXCLUDED.subcategory,
  item_type = EXCLUDED.item_type,
  state = EXCLUDED.state,
  region = EXCLUDED.region,
  default_serving_grams = EXCLUDED.default_serving_grams,
  cal_per_100g = EXCLUDED.cal_per_100g,
  protein_per_100g = EXCLUDED.protein_per_100g,
  carbs_per_100g = EXCLUDED.carbs_per_100g,
  fat_per_100g = EXCLUDED.fat_per_100g,
  fiber_per_100g = EXCLUDED.fiber_per_100g,
  diet_types = EXCLUDED.diet_types,
  tags = EXCLUDED.tags,
  is_processed = EXCLUDED.is_processed,
  contains_root_veg = EXCLUDED.contains_root_veg;

  -- Servings for barfi-plain
  DELETE FROM public.food_servings WHERE food_id = 'barfi-plain';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('barfi-plain', 'piece', '1 piece', 30);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('barfi-plain', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'sandesh', 
  'Sandesh (Sondesh)', 
  'संदेश', 
  ARRAY['sondesh']::TEXT[], 
  ARRAY['sandesh', 'sondesh', 'bengali sweet']::TEXT[], 
  'sweet-mithai', 
  'milk-sweet', 
  'dish'::public.item_type_enum, 
  'cooked'::public.food_state_enum, 
  'east'::public.region_enum, 
  30,
  280, 10, 35, 11, 0,
  30, 0.4, NULL, 0.3, 110,
  '{"veg","jain","nonveg"}'::public.diet_type_enum[], 
  ARRAY['snack', 'high-sugar', 'low-fat']::TEXT[], 
  '{"navratri","ekadashi"}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  false, true, true, false, false, false,
  55, 
  NULL, 
  0, 
  'healthifyme'::public.source_enum, 
  'medium'::public.confidence_enum, 
  NULL
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  hindi_name = EXCLUDED.hindi_name,
  name_alt = EXCLUDED.name_alt,
  search_terms = EXCLUDED.search_terms,
  category_id = EXCLUDED.category_id,
  subcategory = EXCLUDED.subcategory,
  item_type = EXCLUDED.item_type,
  state = EXCLUDED.state,
  region = EXCLUDED.region,
  default_serving_grams = EXCLUDED.default_serving_grams,
  cal_per_100g = EXCLUDED.cal_per_100g,
  protein_per_100g = EXCLUDED.protein_per_100g,
  carbs_per_100g = EXCLUDED.carbs_per_100g,
  fat_per_100g = EXCLUDED.fat_per_100g,
  fiber_per_100g = EXCLUDED.fiber_per_100g,
  diet_types = EXCLUDED.diet_types,
  tags = EXCLUDED.tags,
  is_processed = EXCLUDED.is_processed,
  contains_root_veg = EXCLUDED.contains_root_veg;

  -- Servings for sandesh
  DELETE FROM public.food_servings WHERE food_id = 'sandesh';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('sandesh', 'piece', '1 piece', 30);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('sandesh', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'kalakand', 
  'Kalakand', 
  'कलाकंद', 
  ARRAY['milk cake', 'ajmeri kalakand']::TEXT[], 
  ARRAY['kalakand', 'milk cake', 'sweet']::TEXT[], 
  'sweet-mithai', 
  'milk-sweet', 
  'dish'::public.item_type_enum, 
  'cooked'::public.food_state_enum, 
  'north'::public.region_enum, 
  50,
  330, 14, 30, 18, 0,
  50, 0.6, NULL, 0.5, 180,
  '{"veg","jain","nonveg"}'::public.diet_type_enum[], 
  ARRAY['snack', 'high-sugar', 'high-protein']::TEXT[], 
  '{"navratri","ekadashi"}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  false, true, true, false, false, false,
  55, 
  NULL, 
  0, 
  'healthifyme'::public.source_enum, 
  'medium'::public.confidence_enum, 
  NULL
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  hindi_name = EXCLUDED.hindi_name,
  name_alt = EXCLUDED.name_alt,
  search_terms = EXCLUDED.search_terms,
  category_id = EXCLUDED.category_id,
  subcategory = EXCLUDED.subcategory,
  item_type = EXCLUDED.item_type,
  state = EXCLUDED.state,
  region = EXCLUDED.region,
  default_serving_grams = EXCLUDED.default_serving_grams,
  cal_per_100g = EXCLUDED.cal_per_100g,
  protein_per_100g = EXCLUDED.protein_per_100g,
  carbs_per_100g = EXCLUDED.carbs_per_100g,
  fat_per_100g = EXCLUDED.fat_per_100g,
  fiber_per_100g = EXCLUDED.fiber_per_100g,
  diet_types = EXCLUDED.diet_types,
  tags = EXCLUDED.tags,
  is_processed = EXCLUDED.is_processed,
  contains_root_veg = EXCLUDED.contains_root_veg;

  -- Servings for kalakand
  DELETE FROM public.food_servings WHERE food_id = 'kalakand';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('kalakand', 'piece', '1 piece', 50);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('kalakand', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'rabri', 
  'Rabri (Basundi)', 
  'रबड़ी', 
  ARRAY['basundi']::TEXT[], 
  ARRAY['rabri', 'basundi', 'milk sweet']::TEXT[], 
  'sweet-mithai', 
  'milk-sweet', 
  'dish'::public.item_type_enum, 
  'cooked'::public.food_state_enum, 
  'north'::public.region_enum, 
  100,
  250, 8, 22, 15, 0,
  45, 0.4, NULL, 0.2, 150,
  '{"veg","jain","nonveg"}'::public.diet_type_enum[], 
  ARRAY['snack', 'high-sugar', 'high-fat']::TEXT[], 
  '{"navratri","ekadashi"}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  false, true, true, false, false, false,
  50, 
  NULL, 
  0, 
  'healthifyme'::public.source_enum, 
  'medium'::public.confidence_enum, 
  NULL
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  hindi_name = EXCLUDED.hindi_name,
  name_alt = EXCLUDED.name_alt,
  search_terms = EXCLUDED.search_terms,
  category_id = EXCLUDED.category_id,
  subcategory = EXCLUDED.subcategory,
  item_type = EXCLUDED.item_type,
  state = EXCLUDED.state,
  region = EXCLUDED.region,
  default_serving_grams = EXCLUDED.default_serving_grams,
  cal_per_100g = EXCLUDED.cal_per_100g,
  protein_per_100g = EXCLUDED.protein_per_100g,
  carbs_per_100g = EXCLUDED.carbs_per_100g,
  fat_per_100g = EXCLUDED.fat_per_100g,
  fiber_per_100g = EXCLUDED.fiber_per_100g,
  diet_types = EXCLUDED.diet_types,
  tags = EXCLUDED.tags,
  is_processed = EXCLUDED.is_processed,
  contains_root_veg = EXCLUDED.contains_root_veg;

  -- Servings for rabri
  DELETE FROM public.food_servings WHERE food_id = 'rabri';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('rabri', 'katori', '1 katori', 100);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('rabri', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'mysore-pak', 
  'Mysore Pak', 
  'मैसूर पाक', 
  ARRAY['mysuru pak']::TEXT[], 
  ARRAY['mysore', 'pak', 'besan sweet']::TEXT[], 
  'sweet-mithai', 
  'dry-sweet', 
  'dish'::public.item_type_enum, 
  'cooked'::public.food_state_enum, 
  'south'::public.region_enum, 
  30,
  530, 4.5, 45, 38, 1.5,
  15, NULL, NULL, 1, 20,
  '{"veg","jain","nonveg"}'::public.diet_type_enum[], 
  ARRAY['snack', 'high-calorie', 'high-fat', 'high-sugar']::TEXT[], 
  '{}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  false, false, true, false, false, false,
  65, 
  'Extremely high ghee content.', 
  20, 
  'healthifyme'::public.source_enum, 
  'medium'::public.confidence_enum, 
  NULL
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  hindi_name = EXCLUDED.hindi_name,
  name_alt = EXCLUDED.name_alt,
  search_terms = EXCLUDED.search_terms,
  category_id = EXCLUDED.category_id,
  subcategory = EXCLUDED.subcategory,
  item_type = EXCLUDED.item_type,
  state = EXCLUDED.state,
  region = EXCLUDED.region,
  default_serving_grams = EXCLUDED.default_serving_grams,
  cal_per_100g = EXCLUDED.cal_per_100g,
  protein_per_100g = EXCLUDED.protein_per_100g,
  carbs_per_100g = EXCLUDED.carbs_per_100g,
  fat_per_100g = EXCLUDED.fat_per_100g,
  fiber_per_100g = EXCLUDED.fiber_per_100g,
  diet_types = EXCLUDED.diet_types,
  tags = EXCLUDED.tags,
  is_processed = EXCLUDED.is_processed,
  contains_root_veg = EXCLUDED.contains_root_veg;

  -- Servings for mysore-pak
  DELETE FROM public.food_servings WHERE food_id = 'mysore-pak';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('mysore-pak', 'piece', '1 piece', 30);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('mysore-pak', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'dharwad-peda', 
  'Dharwad Peda', 
  'धारवाड़ पेड़ा', 
  ARRAY['peda', 'brown peda']::TEXT[], 
  ARRAY['dharwad', 'peda', 'sweet']::TEXT[], 
  'sweet-mithai', 
  'dry-sweet', 
  'dish'::public.item_type_enum, 
  'cooked'::public.food_state_enum, 
  'south'::public.region_enum, 
  25,
  380, 12, 50, 14, 0,
  30, 0.5, NULL, 0.5, 130,
  '{"veg","jain","nonveg"}'::public.diet_type_enum[], 
  ARRAY['snack', 'high-sugar']::TEXT[], 
  '{"navratri","ekadashi"}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  false, true, true, false, false, false,
  60, 
  NULL, 
  0, 
  'healthifyme'::public.source_enum, 
  'medium'::public.confidence_enum, 
  NULL
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  hindi_name = EXCLUDED.hindi_name,
  name_alt = EXCLUDED.name_alt,
  search_terms = EXCLUDED.search_terms,
  category_id = EXCLUDED.category_id,
  subcategory = EXCLUDED.subcategory,
  item_type = EXCLUDED.item_type,
  state = EXCLUDED.state,
  region = EXCLUDED.region,
  default_serving_grams = EXCLUDED.default_serving_grams,
  cal_per_100g = EXCLUDED.cal_per_100g,
  protein_per_100g = EXCLUDED.protein_per_100g,
  carbs_per_100g = EXCLUDED.carbs_per_100g,
  fat_per_100g = EXCLUDED.fat_per_100g,
  fiber_per_100g = EXCLUDED.fiber_per_100g,
  diet_types = EXCLUDED.diet_types,
  tags = EXCLUDED.tags,
  is_processed = EXCLUDED.is_processed,
  contains_root_veg = EXCLUDED.contains_root_veg;

  -- Servings for dharwad-peda
  DELETE FROM public.food_servings WHERE food_id = 'dharwad-peda';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('dharwad-peda', 'piece', '1 piece', 25);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('dharwad-peda', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'papaya-ripe', 
  'Papaya (Ripe)', 
  'पपीता', 
  ARRAY['papita']::TEXT[], 
  ARRAY['papaya', 'papita', 'fruit']::TEXT[], 
  'fruit', 
  'fresh-fruit', 
  'base-food'::public.item_type_enum, 
  'raw'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  150,
  43, 0.5, 11, 0.3, 1.7,
  8, NULL, NULL, 0.2, 20,
  '{"vegan","veg","jain","nonveg"}'::public.diet_type_enum[], 
  ARRAY['snack', 'low-calorie', 'high-fiber']::TEXT[], 
  '{"navratri","ekadashi","jain-paryushana","ramzan"}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  false, true, true, false, false, false,
  60, 
  NULL, 
  0, 
  'USDA'::public.source_enum, 
  'high'::public.confidence_enum, 
  NULL
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  hindi_name = EXCLUDED.hindi_name,
  name_alt = EXCLUDED.name_alt,
  search_terms = EXCLUDED.search_terms,
  category_id = EXCLUDED.category_id,
  subcategory = EXCLUDED.subcategory,
  item_type = EXCLUDED.item_type,
  state = EXCLUDED.state,
  region = EXCLUDED.region,
  default_serving_grams = EXCLUDED.default_serving_grams,
  cal_per_100g = EXCLUDED.cal_per_100g,
  protein_per_100g = EXCLUDED.protein_per_100g,
  carbs_per_100g = EXCLUDED.carbs_per_100g,
  fat_per_100g = EXCLUDED.fat_per_100g,
  fiber_per_100g = EXCLUDED.fiber_per_100g,
  diet_types = EXCLUDED.diet_types,
  tags = EXCLUDED.tags,
  is_processed = EXCLUDED.is_processed,
  contains_root_veg = EXCLUDED.contains_root_veg;

  -- Servings for papaya-ripe
  DELETE FROM public.food_servings WHERE food_id = 'papaya-ripe';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('papaya-ripe', 'bowl', '1 bowl (cubed)', 150);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('papaya-ripe', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'guava-raw', 
  'Guava (Amrood)', 
  'अमरूद', 
  ARRAY['amrood', 'peru']::TEXT[], 
  ARRAY['guava', 'amrood', 'peru', 'fruit']::TEXT[], 
  'fruit', 
  'fresh-fruit', 
  'base-food'::public.item_type_enum, 
  'raw'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  150,
  68, 2.6, 14.3, 1, 5.4,
  2, NULL, NULL, 0.3, 18,
  '{"vegan","veg","jain","nonveg"}'::public.diet_type_enum[], 
  ARRAY['snack', 'high-fiber', 'low-calorie']::TEXT[], 
  '{"navratri","ekadashi","jain-paryushana","ramzan"}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  false, true, true, false, false, false,
  12, 
  NULL, 
  0, 
  'USDA'::public.source_enum, 
  'high'::public.confidence_enum, 
  NULL
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  hindi_name = EXCLUDED.hindi_name,
  name_alt = EXCLUDED.name_alt,
  search_terms = EXCLUDED.search_terms,
  category_id = EXCLUDED.category_id,
  subcategory = EXCLUDED.subcategory,
  item_type = EXCLUDED.item_type,
  state = EXCLUDED.state,
  region = EXCLUDED.region,
  default_serving_grams = EXCLUDED.default_serving_grams,
  cal_per_100g = EXCLUDED.cal_per_100g,
  protein_per_100g = EXCLUDED.protein_per_100g,
  carbs_per_100g = EXCLUDED.carbs_per_100g,
  fat_per_100g = EXCLUDED.fat_per_100g,
  fiber_per_100g = EXCLUDED.fiber_per_100g,
  diet_types = EXCLUDED.diet_types,
  tags = EXCLUDED.tags,
  is_processed = EXCLUDED.is_processed,
  contains_root_veg = EXCLUDED.contains_root_veg;

  -- Servings for guava-raw
  DELETE FROM public.food_servings WHERE food_id = 'guava-raw';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('guava-raw', 'medium', '1 medium', 150);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('guava-raw', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'pomegranate-seeds', 
  'Pomegranate (Anaar)', 
  'अनार', 
  ARRAY['anaar']::TEXT[], 
  ARRAY['pomegranate', 'anaar', 'fruit', 'seeds']::TEXT[], 
  'fruit', 
  'fresh-fruit', 
  'base-food'::public.item_type_enum, 
  'raw'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  100,
  83, 1.7, 18.7, 1.2, 4,
  3, NULL, NULL, 0.3, 10,
  '{"vegan","veg","jain","nonveg"}'::public.diet_type_enum[], 
  ARRAY['snack', 'healthy-fats']::TEXT[], 
  '{"navratri","ekadashi","jain-paryushana","ramzan"}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  false, true, true, false, false, false,
  53, 
  NULL, 
  0, 
  'USDA'::public.source_enum, 
  'high'::public.confidence_enum, 
  NULL
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  hindi_name = EXCLUDED.hindi_name,
  name_alt = EXCLUDED.name_alt,
  search_terms = EXCLUDED.search_terms,
  category_id = EXCLUDED.category_id,
  subcategory = EXCLUDED.subcategory,
  item_type = EXCLUDED.item_type,
  state = EXCLUDED.state,
  region = EXCLUDED.region,
  default_serving_grams = EXCLUDED.default_serving_grams,
  cal_per_100g = EXCLUDED.cal_per_100g,
  protein_per_100g = EXCLUDED.protein_per_100g,
  carbs_per_100g = EXCLUDED.carbs_per_100g,
  fat_per_100g = EXCLUDED.fat_per_100g,
  fiber_per_100g = EXCLUDED.fiber_per_100g,
  diet_types = EXCLUDED.diet_types,
  tags = EXCLUDED.tags,
  is_processed = EXCLUDED.is_processed,
  contains_root_veg = EXCLUDED.contains_root_veg;

  -- Servings for pomegranate-seeds
  DELETE FROM public.food_servings WHERE food_id = 'pomegranate-seeds';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('pomegranate-seeds', 'katori', '1 katori (seeds)', 100);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('pomegranate-seeds', 'medium', '1 medium (whole)', 280);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('pomegranate-seeds', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'watermelon-raw', 
  'Watermelon (Tarbooz)', 
  'तरबूज', 
  ARRAY['tarbooz']::TEXT[], 
  ARRAY['watermelon', 'tarbooz', 'fruit']::TEXT[], 
  'fruit', 
  'fresh-fruit', 
  'base-food'::public.item_type_enum, 
  'raw'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  280,
  30, 0.6, 7.6, 0.2, 0.4,
  1, NULL, NULL, 0.2, 7,
  '{"vegan","veg","jain","nonveg"}'::public.diet_type_enum[], 
  ARRAY['snack', 'low-calorie', 'hydration']::TEXT[], 
  '{"navratri","ekadashi","jain-paryushana","ramzan"}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  false, true, true, false, false, false,
  72, 
  NULL, 
  0, 
  'USDA'::public.source_enum, 
  'high'::public.confidence_enum, 
  NULL
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  hindi_name = EXCLUDED.hindi_name,
  name_alt = EXCLUDED.name_alt,
  search_terms = EXCLUDED.search_terms,
  category_id = EXCLUDED.category_id,
  subcategory = EXCLUDED.subcategory,
  item_type = EXCLUDED.item_type,
  state = EXCLUDED.state,
  region = EXCLUDED.region,
  default_serving_grams = EXCLUDED.default_serving_grams,
  cal_per_100g = EXCLUDED.cal_per_100g,
  protein_per_100g = EXCLUDED.protein_per_100g,
  carbs_per_100g = EXCLUDED.carbs_per_100g,
  fat_per_100g = EXCLUDED.fat_per_100g,
  fiber_per_100g = EXCLUDED.fiber_per_100g,
  diet_types = EXCLUDED.diet_types,
  tags = EXCLUDED.tags,
  is_processed = EXCLUDED.is_processed,
  contains_root_veg = EXCLUDED.contains_root_veg;

  -- Servings for watermelon-raw
  DELETE FROM public.food_servings WHERE food_id = 'watermelon-raw';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('watermelon-raw', 'bowl', '1 bowl', 280);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('watermelon-raw', 'slice', '1 wedge/slice', 280);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('watermelon-raw', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'chikoo-raw', 
  'Chikoo (Sapota)', 
  'चीकू', 
  ARRAY['sapota', 'chikku']::TEXT[], 
  ARRAY['chikoo', 'sapota', 'chikku', 'fruit']::TEXT[], 
  'fruit', 
  'fresh-fruit', 
  'base-food'::public.item_type_enum, 
  'raw'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  100,
  83, 0.4, 20, 1.1, 5.3,
  12, NULL, NULL, 0.8, 21,
  '{"vegan","veg","jain","nonveg"}'::public.diet_type_enum[], 
  ARRAY['snack', 'high-sugar', 'high-fiber']::TEXT[], 
  '{"navratri","ekadashi","jain-paryushana","ramzan"}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  false, true, true, false, false, false,
  56, 
  NULL, 
  0, 
  'USDA'::public.source_enum, 
  'high'::public.confidence_enum, 
  NULL
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  hindi_name = EXCLUDED.hindi_name,
  name_alt = EXCLUDED.name_alt,
  search_terms = EXCLUDED.search_terms,
  category_id = EXCLUDED.category_id,
  subcategory = EXCLUDED.subcategory,
  item_type = EXCLUDED.item_type,
  state = EXCLUDED.state,
  region = EXCLUDED.region,
  default_serving_grams = EXCLUDED.default_serving_grams,
  cal_per_100g = EXCLUDED.cal_per_100g,
  protein_per_100g = EXCLUDED.protein_per_100g,
  carbs_per_100g = EXCLUDED.carbs_per_100g,
  fat_per_100g = EXCLUDED.fat_per_100g,
  fiber_per_100g = EXCLUDED.fiber_per_100g,
  diet_types = EXCLUDED.diet_types,
  tags = EXCLUDED.tags,
  is_processed = EXCLUDED.is_processed,
  contains_root_veg = EXCLUDED.contains_root_veg;

  -- Servings for chikoo-raw
  DELETE FROM public.food_servings WHERE food_id = 'chikoo-raw';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('chikoo-raw', 'medium', '1 medium', 100);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('chikoo-raw', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'grapes-green', 
  'Grapes (Angoor)', 
  'अंगूर', 
  ARRAY['angoor', 'green grapes']::TEXT[], 
  ARRAY['grapes', 'angoor', 'fruit', 'green grapes']::TEXT[], 
  'fruit', 
  'fresh-fruit', 
  'base-food'::public.item_type_enum, 
  'raw'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  150,
  69, 0.7, 18.1, 0.2, 0.9,
  2, NULL, NULL, 0.4, 10,
  '{"vegan","veg","jain","nonveg"}'::public.diet_type_enum[], 
  ARRAY['snack', 'high-sugar']::TEXT[], 
  '{"navratri","ekadashi","jain-paryushana","ramzan"}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  false, true, true, false, false, false,
  53, 
  NULL, 
  0, 
  'USDA'::public.source_enum, 
  'high'::public.confidence_enum, 
  NULL
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  hindi_name = EXCLUDED.hindi_name,
  name_alt = EXCLUDED.name_alt,
  search_terms = EXCLUDED.search_terms,
  category_id = EXCLUDED.category_id,
  subcategory = EXCLUDED.subcategory,
  item_type = EXCLUDED.item_type,
  state = EXCLUDED.state,
  region = EXCLUDED.region,
  default_serving_grams = EXCLUDED.default_serving_grams,
  cal_per_100g = EXCLUDED.cal_per_100g,
  protein_per_100g = EXCLUDED.protein_per_100g,
  carbs_per_100g = EXCLUDED.carbs_per_100g,
  fat_per_100g = EXCLUDED.fat_per_100g,
  fiber_per_100g = EXCLUDED.fiber_per_100g,
  diet_types = EXCLUDED.diet_types,
  tags = EXCLUDED.tags,
  is_processed = EXCLUDED.is_processed,
  contains_root_veg = EXCLUDED.contains_root_veg;

  -- Servings for grapes-green
  DELETE FROM public.food_servings WHERE food_id = 'grapes-green';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('grapes-green', 'katori', '1 katori (bunches)', 150);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('grapes-green', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'orange-raw', 
  'Orange (Santra)', 
  'संतरा', 
  ARRAY['santra', 'kinnow']::TEXT[], 
  ARRAY['orange', 'santra', 'kinnow', 'fruit']::TEXT[], 
  'fruit', 
  'fresh-fruit', 
  'base-food'::public.item_type_enum, 
  'raw'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  130,
  47, 0.9, 11.8, 0.1, 2.4,
  NULL, NULL, NULL, 0.1, 40,
  '{"vegan","veg","jain","nonveg"}'::public.diet_type_enum[], 
  ARRAY['snack', 'low-calorie']::TEXT[], 
  '{"navratri","ekadashi","jain-paryushana","ramzan"}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  false, true, true, false, false, false,
  40, 
  NULL, 
  0, 
  'USDA'::public.source_enum, 
  'high'::public.confidence_enum, 
  NULL
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  hindi_name = EXCLUDED.hindi_name,
  name_alt = EXCLUDED.name_alt,
  search_terms = EXCLUDED.search_terms,
  category_id = EXCLUDED.category_id,
  subcategory = EXCLUDED.subcategory,
  item_type = EXCLUDED.item_type,
  state = EXCLUDED.state,
  region = EXCLUDED.region,
  default_serving_grams = EXCLUDED.default_serving_grams,
  cal_per_100g = EXCLUDED.cal_per_100g,
  protein_per_100g = EXCLUDED.protein_per_100g,
  carbs_per_100g = EXCLUDED.carbs_per_100g,
  fat_per_100g = EXCLUDED.fat_per_100g,
  fiber_per_100g = EXCLUDED.fiber_per_100g,
  diet_types = EXCLUDED.diet_types,
  tags = EXCLUDED.tags,
  is_processed = EXCLUDED.is_processed,
  contains_root_veg = EXCLUDED.contains_root_veg;

  -- Servings for orange-raw
  DELETE FROM public.food_servings WHERE food_id = 'orange-raw';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('orange-raw', 'medium', '1 medium', 130);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('orange-raw', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'pineapple-raw', 
  'Pineapple (Ananas)', 
  'अनानास', 
  ARRAY['ananas', 'anarash']::TEXT[], 
  ARRAY['pineapple', 'ananas', 'fruit']::TEXT[], 
  'fruit', 
  'fresh-fruit', 
  'base-food'::public.item_type_enum, 
  'raw'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  165,
  50, 0.5, 13.1, 0.1, 1.4,
  1, NULL, NULL, 0.3, 13,
  '{"vegan","veg","jain","nonveg"}'::public.diet_type_enum[], 
  ARRAY['snack', 'low-calorie']::TEXT[], 
  '{"navratri","ekadashi","jain-paryushana","ramzan"}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  false, true, true, false, false, false,
  59, 
  NULL, 
  0, 
  'USDA'::public.source_enum, 
  'high'::public.confidence_enum, 
  NULL
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  hindi_name = EXCLUDED.hindi_name,
  name_alt = EXCLUDED.name_alt,
  search_terms = EXCLUDED.search_terms,
  category_id = EXCLUDED.category_id,
  subcategory = EXCLUDED.subcategory,
  item_type = EXCLUDED.item_type,
  state = EXCLUDED.state,
  region = EXCLUDED.region,
  default_serving_grams = EXCLUDED.default_serving_grams,
  cal_per_100g = EXCLUDED.cal_per_100g,
  protein_per_100g = EXCLUDED.protein_per_100g,
  carbs_per_100g = EXCLUDED.carbs_per_100g,
  fat_per_100g = EXCLUDED.fat_per_100g,
  fiber_per_100g = EXCLUDED.fiber_per_100g,
  diet_types = EXCLUDED.diet_types,
  tags = EXCLUDED.tags,
  is_processed = EXCLUDED.is_processed,
  contains_root_veg = EXCLUDED.contains_root_veg;

  -- Servings for pineapple-raw
  DELETE FROM public.food_servings WHERE food_id = 'pineapple-raw';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('pineapple-raw', 'katori', '1 katori (cubed)', 165);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('pineapple-raw', 'slice', '1 slice', 85);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('pineapple-raw', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'coconut-fresh', 
  'Coconut (Fresh Meat/Shreds)', 
  'नारियल (ताजा)', 
  ARRAY['nariyal giri', 'fresh coconut']::TEXT[], 
  ARRAY['coconut', 'nariyal', 'fresh coconut']::TEXT[], 
  'fruit', 
  'fresh-fruit', 
  'base-food'::public.item_type_enum, 
  'raw'::public.food_state_enum, 
  'south'::public.region_enum, 
  45,
  354, 3.3, 15.2, 33.5, 9,
  20, NULL, NULL, 2.4, 14,
  '{"vegan","veg","jain","nonveg"}'::public.diet_type_enum[], 
  ARRAY['snack', 'high-fat', 'healthy-fats']::TEXT[], 
  '{"navratri","ekadashi","jain-paryushana"}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  false, true, true, false, false, false,
  42, 
  NULL, 
  0, 
  'USDA'::public.source_enum, 
  'high'::public.confidence_enum, 
  'Extremely high calorie/fat density. Often used in chutneys.'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  hindi_name = EXCLUDED.hindi_name,
  name_alt = EXCLUDED.name_alt,
  search_terms = EXCLUDED.search_terms,
  category_id = EXCLUDED.category_id,
  subcategory = EXCLUDED.subcategory,
  item_type = EXCLUDED.item_type,
  state = EXCLUDED.state,
  region = EXCLUDED.region,
  default_serving_grams = EXCLUDED.default_serving_grams,
  cal_per_100g = EXCLUDED.cal_per_100g,
  protein_per_100g = EXCLUDED.protein_per_100g,
  carbs_per_100g = EXCLUDED.carbs_per_100g,
  fat_per_100g = EXCLUDED.fat_per_100g,
  fiber_per_100g = EXCLUDED.fiber_per_100g,
  diet_types = EXCLUDED.diet_types,
  tags = EXCLUDED.tags,
  is_processed = EXCLUDED.is_processed,
  contains_root_veg = EXCLUDED.contains_root_veg;

  -- Servings for coconut-fresh
  DELETE FROM public.food_servings WHERE food_id = 'coconut-fresh';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('coconut-fresh', 'tbsp', '1 tbsp (grated)', 15);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('coconut-fresh', 'piece', '1 piece (wedge)', 45);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('coconut-fresh', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'cashews-raw', 
  'Cashews (Kaju)', 
  'काजू', 
  ARRAY['kaju']::TEXT[], 
  ARRAY['cashew', 'kaju', 'nuts', 'dry fruit']::TEXT[], 
  'fruit', 
  'dry-fruits-nuts', 
  'base-food'::public.item_type_enum, 
  'raw'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  30,
  553, 18.2, 30.2, 43.8, 3.3,
  12, NULL, NULL, 6.7, 37,
  '{"vegan","veg","jain","nonveg"}'::public.diet_type_enum[], 
  ARRAY['snack', 'high-fat', 'healthy-fats']::TEXT[], 
  '{"navratri","ekadashi","jain-paryushana","ramzan"}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  false, true, true, false, false, false,
  25, 
  NULL, 
  0, 
  'USDA'::public.source_enum, 
  'high'::public.confidence_enum, 
  NULL
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  hindi_name = EXCLUDED.hindi_name,
  name_alt = EXCLUDED.name_alt,
  search_terms = EXCLUDED.search_terms,
  category_id = EXCLUDED.category_id,
  subcategory = EXCLUDED.subcategory,
  item_type = EXCLUDED.item_type,
  state = EXCLUDED.state,
  region = EXCLUDED.region,
  default_serving_grams = EXCLUDED.default_serving_grams,
  cal_per_100g = EXCLUDED.cal_per_100g,
  protein_per_100g = EXCLUDED.protein_per_100g,
  carbs_per_100g = EXCLUDED.carbs_per_100g,
  fat_per_100g = EXCLUDED.fat_per_100g,
  fiber_per_100g = EXCLUDED.fiber_per_100g,
  diet_types = EXCLUDED.diet_types,
  tags = EXCLUDED.tags,
  is_processed = EXCLUDED.is_processed,
  contains_root_veg = EXCLUDED.contains_root_veg;

  -- Servings for cashews-raw
  DELETE FROM public.food_servings WHERE food_id = 'cashews-raw';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('cashews-raw', 'handful', '1 handful', 30);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('cashews-raw', 'piece', '5 pieces', 8);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('cashews-raw', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'walnuts-raw', 
  'Walnuts (Akhrot)', 
  'अखरोट', 
  ARRAY['akhrot']::TEXT[], 
  ARRAY['walnut', 'akhrot', 'nuts', 'dry fruit']::TEXT[], 
  'fruit', 
  'dry-fruits-nuts', 
  'base-food'::public.item_type_enum, 
  'raw'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  30,
  654, 15.2, 13.7, 65.2, 6.7,
  2, NULL, NULL, 2.9, 98,
  '{"vegan","veg","jain","nonveg"}'::public.diet_type_enum[], 
  ARRAY['snack', 'high-fat', 'healthy-fats']::TEXT[], 
  '{"navratri","ekadashi","jain-paryushana","ramzan"}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  false, true, true, false, false, false,
  15, 
  NULL, 
  0, 
  'USDA'::public.source_enum, 
  'high'::public.confidence_enum, 
  NULL
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  hindi_name = EXCLUDED.hindi_name,
  name_alt = EXCLUDED.name_alt,
  search_terms = EXCLUDED.search_terms,
  category_id = EXCLUDED.category_id,
  subcategory = EXCLUDED.subcategory,
  item_type = EXCLUDED.item_type,
  state = EXCLUDED.state,
  region = EXCLUDED.region,
  default_serving_grams = EXCLUDED.default_serving_grams,
  cal_per_100g = EXCLUDED.cal_per_100g,
  protein_per_100g = EXCLUDED.protein_per_100g,
  carbs_per_100g = EXCLUDED.carbs_per_100g,
  fat_per_100g = EXCLUDED.fat_per_100g,
  fiber_per_100g = EXCLUDED.fiber_per_100g,
  diet_types = EXCLUDED.diet_types,
  tags = EXCLUDED.tags,
  is_processed = EXCLUDED.is_processed,
  contains_root_veg = EXCLUDED.contains_root_veg;

  -- Servings for walnuts-raw
  DELETE FROM public.food_servings WHERE food_id = 'walnuts-raw';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('walnuts-raw', 'handful', '1 handful', 30);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('walnuts-raw', 'piece', '5 halves', 14);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('walnuts-raw', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'peanuts-roasted', 
  'Peanuts (Moongfali, Roasted)', 
  'मूँगफली', 
  ARRAY['moongfali', 'shengdana', 'groundnuts']::TEXT[], 
  ARRAY['peanut', 'moongfali', 'shengdana', 'groundnut', 'nuts']::TEXT[], 
  'fruit', 
  'dry-fruits-nuts', 
  'base-food'::public.item_type_enum, 
  'roasted'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  30,
  585, 23.7, 21.3, 49.7, 8,
  5, NULL, NULL, 2.3, 54,
  '{"vegan","veg","jain","nonveg"}'::public.diet_type_enum[], 
  ARRAY['snack', 'high-fat', 'high-protein', 'budget-friendly']::TEXT[], 
  '{"navratri","ekadashi"}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  false, true, true, false, false, false,
  14, 
  NULL, 
  0, 
  'USDA'::public.source_enum, 
  'high'::public.confidence_enum, 
  NULL
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  hindi_name = EXCLUDED.hindi_name,
  name_alt = EXCLUDED.name_alt,
  search_terms = EXCLUDED.search_terms,
  category_id = EXCLUDED.category_id,
  subcategory = EXCLUDED.subcategory,
  item_type = EXCLUDED.item_type,
  state = EXCLUDED.state,
  region = EXCLUDED.region,
  default_serving_grams = EXCLUDED.default_serving_grams,
  cal_per_100g = EXCLUDED.cal_per_100g,
  protein_per_100g = EXCLUDED.protein_per_100g,
  carbs_per_100g = EXCLUDED.carbs_per_100g,
  fat_per_100g = EXCLUDED.fat_per_100g,
  fiber_per_100g = EXCLUDED.fiber_per_100g,
  diet_types = EXCLUDED.diet_types,
  tags = EXCLUDED.tags,
  is_processed = EXCLUDED.is_processed,
  contains_root_veg = EXCLUDED.contains_root_veg;

  -- Servings for peanuts-roasted
  DELETE FROM public.food_servings WHERE food_id = 'peanuts-roasted';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('peanuts-roasted', 'handful', '1 handful', 30);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('peanuts-roasted', 'katori', '1 katori', 150);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('peanuts-roasted', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'raisins', 
  'Raisins (Kishmish)', 
  'किशमिश', 
  ARRAY['kishmish', 'kismis']::TEXT[], 
  ARRAY['raisins', 'kishmish', 'kismis', 'dry fruit']::TEXT[], 
  'fruit', 
  'dry-fruits-nuts', 
  'base-food'::public.item_type_enum, 
  'raw'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  30,
  299, 3.1, 79.2, 0.5, 3.7,
  11, NULL, NULL, 1.9, 50,
  '{"vegan","veg","jain","nonveg"}'::public.diet_type_enum[], 
  ARRAY['snack', 'high-sugar']::TEXT[], 
  '{"navratri","ekadashi","jain-paryushana","ramzan"}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  false, true, true, false, false, false,
  64, 
  NULL, 
  0, 
  'USDA'::public.source_enum, 
  'high'::public.confidence_enum, 
  NULL
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  hindi_name = EXCLUDED.hindi_name,
  name_alt = EXCLUDED.name_alt,
  search_terms = EXCLUDED.search_terms,
  category_id = EXCLUDED.category_id,
  subcategory = EXCLUDED.subcategory,
  item_type = EXCLUDED.item_type,
  state = EXCLUDED.state,
  region = EXCLUDED.region,
  default_serving_grams = EXCLUDED.default_serving_grams,
  cal_per_100g = EXCLUDED.cal_per_100g,
  protein_per_100g = EXCLUDED.protein_per_100g,
  carbs_per_100g = EXCLUDED.carbs_per_100g,
  fat_per_100g = EXCLUDED.fat_per_100g,
  fiber_per_100g = EXCLUDED.fiber_per_100g,
  diet_types = EXCLUDED.diet_types,
  tags = EXCLUDED.tags,
  is_processed = EXCLUDED.is_processed,
  contains_root_veg = EXCLUDED.contains_root_veg;

  -- Servings for raisins
  DELETE FROM public.food_servings WHERE food_id = 'raisins';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('raisins', 'handful', '1 handful', 30);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('raisins', 'tbsp', '1 tbsp', 15);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('raisins', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'sunflower-seeds', 
  'Sunflower Seeds', 
  'सूरजमुखी के बीज', 
  ARRAY['surajmukhi beej']::TEXT[], 
  ARRAY['sunflower', 'seeds', 'surajmukhi']::TEXT[], 
  'fruit', 
  'dry-fruits-nuts', 
  'base-food'::public.item_type_enum, 
  'raw'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  15,
  584, 20.8, 20, 51.5, 8.6,
  9, NULL, NULL, 5.3, 78,
  '{"vegan","veg","jain","nonveg"}'::public.diet_type_enum[], 
  ARRAY['snack', 'healthy-fats', 'high-protein']::TEXT[], 
  '{"navratri","ekadashi"}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  false, true, true, false, false, false,
  20, 
  NULL, 
  0, 
  'USDA'::public.source_enum, 
  'high'::public.confidence_enum, 
  NULL
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  hindi_name = EXCLUDED.hindi_name,
  name_alt = EXCLUDED.name_alt,
  search_terms = EXCLUDED.search_terms,
  category_id = EXCLUDED.category_id,
  subcategory = EXCLUDED.subcategory,
  item_type = EXCLUDED.item_type,
  state = EXCLUDED.state,
  region = EXCLUDED.region,
  default_serving_grams = EXCLUDED.default_serving_grams,
  cal_per_100g = EXCLUDED.cal_per_100g,
  protein_per_100g = EXCLUDED.protein_per_100g,
  carbs_per_100g = EXCLUDED.carbs_per_100g,
  fat_per_100g = EXCLUDED.fat_per_100g,
  fiber_per_100g = EXCLUDED.fiber_per_100g,
  diet_types = EXCLUDED.diet_types,
  tags = EXCLUDED.tags,
  is_processed = EXCLUDED.is_processed,
  contains_root_veg = EXCLUDED.contains_root_veg;

  -- Servings for sunflower-seeds
  DELETE FROM public.food_servings WHERE food_id = 'sunflower-seeds';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('sunflower-seeds', 'tbsp', '1 tbsp', 15);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('sunflower-seeds', 'handful', '1 handful', 30);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('sunflower-seeds', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'chia-seeds', 
  'Chia Seeds', 
  'चिया के बीज', 
  ARRAY['sabza', 'tukmaria']::TEXT[], 
  ARRAY['chia', 'seeds', 'sabza', 'falooda seed']::TEXT[], 
  'fruit', 
  'dry-fruits-nuts', 
  'base-food'::public.item_type_enum, 
  'raw'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  15,
  486, 16.5, 42.1, 30.7, 34.4,
  16, NULL, NULL, 7.7, 631,
  '{"vegan","veg","jain","nonveg"}'::public.diet_type_enum[], 
  ARRAY['snack', 'high-fiber', 'healthy-fats']::TEXT[], 
  '{"navratri","ekadashi"}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  false, true, true, false, false, false,
  1, 
  NULL, 
  0, 
  'USDA'::public.source_enum, 
  'high'::public.confidence_enum, 
  'Almost all carbs are fiber. Excellent calcium source.'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  hindi_name = EXCLUDED.hindi_name,
  name_alt = EXCLUDED.name_alt,
  search_terms = EXCLUDED.search_terms,
  category_id = EXCLUDED.category_id,
  subcategory = EXCLUDED.subcategory,
  item_type = EXCLUDED.item_type,
  state = EXCLUDED.state,
  region = EXCLUDED.region,
  default_serving_grams = EXCLUDED.default_serving_grams,
  cal_per_100g = EXCLUDED.cal_per_100g,
  protein_per_100g = EXCLUDED.protein_per_100g,
  carbs_per_100g = EXCLUDED.carbs_per_100g,
  fat_per_100g = EXCLUDED.fat_per_100g,
  fiber_per_100g = EXCLUDED.fiber_per_100g,
  diet_types = EXCLUDED.diet_types,
  tags = EXCLUDED.tags,
  is_processed = EXCLUDED.is_processed,
  contains_root_veg = EXCLUDED.contains_root_veg;

  -- Servings for chia-seeds
  DELETE FROM public.food_servings WHERE food_id = 'chia-seeds';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('chia-seeds', 'tbsp', '1 tbsp', 15);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('chia-seeds', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'green-tea', 
  'Green Tea (No Sugar)', 
  'ग्रीन टी', 
  ARRAY['green tea bag']::TEXT[], 
  ARRAY['green tea', 'tea', 'weight loss tea']::TEXT[], 
  'drink', 
  'tea-coffee', 
  'drink'::public.item_type_enum, 
  'cooked'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  150,
  1, 0, 0, 0, 0,
  1, NULL, NULL, NULL, NULL,
  '{"vegan","veg","jain","nonveg"}'::public.diet_type_enum[], 
  ARRAY['breakfast', 'snack', 'low-calorie']::TEXT[], 
  '{"navratri","ekadashi","jain-paryushana"}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  false, true, true, false, false, false,
  NULL, 
  NULL, 
  0, 
  'USDA'::public.source_enum, 
  'high'::public.confidence_enum, 
  NULL
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  hindi_name = EXCLUDED.hindi_name,
  name_alt = EXCLUDED.name_alt,
  search_terms = EXCLUDED.search_terms,
  category_id = EXCLUDED.category_id,
  subcategory = EXCLUDED.subcategory,
  item_type = EXCLUDED.item_type,
  state = EXCLUDED.state,
  region = EXCLUDED.region,
  default_serving_grams = EXCLUDED.default_serving_grams,
  cal_per_100g = EXCLUDED.cal_per_100g,
  protein_per_100g = EXCLUDED.protein_per_100g,
  carbs_per_100g = EXCLUDED.carbs_per_100g,
  fat_per_100g = EXCLUDED.fat_per_100g,
  fiber_per_100g = EXCLUDED.fiber_per_100g,
  diet_types = EXCLUDED.diet_types,
  tags = EXCLUDED.tags,
  is_processed = EXCLUDED.is_processed,
  contains_root_veg = EXCLUDED.contains_root_veg;

  -- Servings for green-tea
  DELETE FROM public.food_servings WHERE food_id = 'green-tea';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('green-tea', 'cup', '1 cup (150ml)', 150);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('green-tea', 'g100', '100ml', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'nimbu-pani', 
  'Nimbu Pani (Lemonade, Sweet & Salt)', 
  'नींबू पानी', 
  ARRAY['shikanji', 'lemon water']::TEXT[], 
  ARRAY['nimbu', 'pani', 'shikanji', 'lemonade', 'lemon water']::TEXT[], 
  'drink', 
  'cooling', 
  'drink'::public.item_type_enum, 
  'raw'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  200,
  25, 0.1, 6.5, 0, 0,
  150, NULL, NULL, 0.1, 5,
  '{"vegan","veg","jain","nonveg"}'::public.diet_type_enum[], 
  ARRAY['snack', 'hydration', 'cooling']::TEXT[], 
  '{"navratri","ekadashi","ramzan"}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  false, true, true, false, false, false,
  65, 
  NULL, 
  0, 
  'healthifyme'::public.source_enum, 
  'medium'::public.confidence_enum, 
  'Assume 1 tbsp sugar and salt/black salt.'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  hindi_name = EXCLUDED.hindi_name,
  name_alt = EXCLUDED.name_alt,
  search_terms = EXCLUDED.search_terms,
  category_id = EXCLUDED.category_id,
  subcategory = EXCLUDED.subcategory,
  item_type = EXCLUDED.item_type,
  state = EXCLUDED.state,
  region = EXCLUDED.region,
  default_serving_grams = EXCLUDED.default_serving_grams,
  cal_per_100g = EXCLUDED.cal_per_100g,
  protein_per_100g = EXCLUDED.protein_per_100g,
  carbs_per_100g = EXCLUDED.carbs_per_100g,
  fat_per_100g = EXCLUDED.fat_per_100g,
  fiber_per_100g = EXCLUDED.fiber_per_100g,
  diet_types = EXCLUDED.diet_types,
  tags = EXCLUDED.tags,
  is_processed = EXCLUDED.is_processed,
  contains_root_veg = EXCLUDED.contains_root_veg;

  -- Servings for nimbu-pani
  DELETE FROM public.food_servings WHERE food_id = 'nimbu-pani';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('nimbu-pani', 'glass', '1 glass (200ml)', 200);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('nimbu-pani', 'g100', '100ml', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'mango-shake', 
  'Mango Shake (With Sugar & Milk)', 
  'मैंगो शेक', 
  ARRAY['aamras milk']::TEXT[], 
  ARRAY['mango', 'shake', 'milkshake', 'aam']::TEXT[], 
  'drink', 
  'milk-based', 
  'drink'::public.item_type_enum, 
  'raw'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  250,
  110, 3.5, 17.5, 3, 0.6,
  40, 0.4, 15, 0.1, 110,
  '{"veg","jain","nonveg"}'::public.diet_type_enum[], 
  ARRAY['snack', 'high-sugar', 'high-calorie']::TEXT[], 
  '{"navratri","ekadashi","ramzan"}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  false, true, true, false, false, false,
  60, 
  NULL, 
  0, 
  'healthifyme'::public.source_enum, 
  'medium'::public.confidence_enum, 
  NULL
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  hindi_name = EXCLUDED.hindi_name,
  name_alt = EXCLUDED.name_alt,
  search_terms = EXCLUDED.search_terms,
  category_id = EXCLUDED.category_id,
  subcategory = EXCLUDED.subcategory,
  item_type = EXCLUDED.item_type,
  state = EXCLUDED.state,
  region = EXCLUDED.region,
  default_serving_grams = EXCLUDED.default_serving_grams,
  cal_per_100g = EXCLUDED.cal_per_100g,
  protein_per_100g = EXCLUDED.protein_per_100g,
  carbs_per_100g = EXCLUDED.carbs_per_100g,
  fat_per_100g = EXCLUDED.fat_per_100g,
  fiber_per_100g = EXCLUDED.fiber_per_100g,
  diet_types = EXCLUDED.diet_types,
  tags = EXCLUDED.tags,
  is_processed = EXCLUDED.is_processed,
  contains_root_veg = EXCLUDED.contains_root_veg;

  -- Servings for mango-shake
  DELETE FROM public.food_servings WHERE food_id = 'mango-shake';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('mango-shake', 'glass', '1 tall glass (250ml)', 250);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('mango-shake', 'g100', '100ml', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'banana-shake', 
  'Banana Shake (With Sugar & Milk)', 
  'बनाना शेक', 
  ARRAY['banana milkshake']::TEXT[], 
  ARRAY['banana', 'shake', 'milkshake', 'kela']::TEXT[], 
  'drink', 
  'milk-based', 
  'drink'::public.item_type_enum, 
  'raw'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  250,
  125, 3.8, 20.5, 3.2, 1,
  45, 0.5, 15, 0.2, 115,
  '{"veg","jain","nonveg"}'::public.diet_type_enum[], 
  ARRAY['snack', 'pre-workout', 'high-sugar']::TEXT[], 
  '{"navratri","ekadashi","ramzan"}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  false, true, true, false, false, false,
  55, 
  NULL, 
  0, 
  'healthifyme'::public.source_enum, 
  'medium'::public.confidence_enum, 
  NULL
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  hindi_name = EXCLUDED.hindi_name,
  name_alt = EXCLUDED.name_alt,
  search_terms = EXCLUDED.search_terms,
  category_id = EXCLUDED.category_id,
  subcategory = EXCLUDED.subcategory,
  item_type = EXCLUDED.item_type,
  state = EXCLUDED.state,
  region = EXCLUDED.region,
  default_serving_grams = EXCLUDED.default_serving_grams,
  cal_per_100g = EXCLUDED.cal_per_100g,
  protein_per_100g = EXCLUDED.protein_per_100g,
  carbs_per_100g = EXCLUDED.carbs_per_100g,
  fat_per_100g = EXCLUDED.fat_per_100g,
  fiber_per_100g = EXCLUDED.fiber_per_100g,
  diet_types = EXCLUDED.diet_types,
  tags = EXCLUDED.tags,
  is_processed = EXCLUDED.is_processed,
  contains_root_veg = EXCLUDED.contains_root_veg;

  -- Servings for banana-shake
  DELETE FROM public.food_servings WHERE food_id = 'banana-shake';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('banana-shake', 'glass', '1 tall glass (250ml)', 250);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('banana-shake', 'g100', '100ml', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'sugarcane-juice', 
  'Sugarcane Juice (Ganne Ka Ras)', 
  'गन्ने का रस', 
  ARRAY['ganne ka ras', 'karumbu juice']::TEXT[], 
  ARRAY['sugarcane', 'ganne', 'juice', 'ras']::TEXT[], 
  'drink', 
  'fruit-juice', 
  'drink'::public.item_type_enum, 
  'raw'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  200,
  39, 0.2, 9.8, 0, 0.5,
  2, NULL, NULL, 0.4, 10,
  '{"vegan","veg","jain","nonveg"}'::public.diet_type_enum[], 
  ARRAY['snack', 'cooling', 'hydration']::TEXT[], 
  '{"navratri","ekadashi","ramzan"}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  false, true, true, false, false, false,
  43, 
  NULL, 
  0, 
  'healthifyme'::public.source_enum, 
  'medium'::public.confidence_enum, 
  NULL
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  hindi_name = EXCLUDED.hindi_name,
  name_alt = EXCLUDED.name_alt,
  search_terms = EXCLUDED.search_terms,
  category_id = EXCLUDED.category_id,
  subcategory = EXCLUDED.subcategory,
  item_type = EXCLUDED.item_type,
  state = EXCLUDED.state,
  region = EXCLUDED.region,
  default_serving_grams = EXCLUDED.default_serving_grams,
  cal_per_100g = EXCLUDED.cal_per_100g,
  protein_per_100g = EXCLUDED.protein_per_100g,
  carbs_per_100g = EXCLUDED.carbs_per_100g,
  fat_per_100g = EXCLUDED.fat_per_100g,
  fiber_per_100g = EXCLUDED.fiber_per_100g,
  diet_types = EXCLUDED.diet_types,
  tags = EXCLUDED.tags,
  is_processed = EXCLUDED.is_processed,
  contains_root_veg = EXCLUDED.contains_root_veg;

  -- Servings for sugarcane-juice
  DELETE FROM public.food_servings WHERE food_id = 'sugarcane-juice';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('sugarcane-juice', 'glass', '1 glass (200ml)', 200);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('sugarcane-juice', 'g100', '100ml', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'rooh-afza', 
  'Rooh Afza (with Water)', 
  'रूह अफ़ज़ा', 
  ARRAY['rose syrup drink']::TEXT[], 
  ARRAY['rooh', 'afza', 'rose syrup', 'drink']::TEXT[], 
  'drink', 
  'cooling', 
  'drink'::public.item_type_enum, 
  'raw'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  250,
  35, 0, 8.5, 0, 0,
  5, NULL, NULL, NULL, NULL,
  '{"vegan","veg","jain","nonveg"}'::public.diet_type_enum[], 
  ARRAY['snack', 'cooling', 'high-sugar']::TEXT[], 
  '{"ramzan"}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  true, true, true, false, false, false,
  65, 
  NULL, 
  0, 
  'healthifyme'::public.source_enum, 
  'medium'::public.confidence_enum, 
  NULL
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  hindi_name = EXCLUDED.hindi_name,
  name_alt = EXCLUDED.name_alt,
  search_terms = EXCLUDED.search_terms,
  category_id = EXCLUDED.category_id,
  subcategory = EXCLUDED.subcategory,
  item_type = EXCLUDED.item_type,
  state = EXCLUDED.state,
  region = EXCLUDED.region,
  default_serving_grams = EXCLUDED.default_serving_grams,
  cal_per_100g = EXCLUDED.cal_per_100g,
  protein_per_100g = EXCLUDED.protein_per_100g,
  carbs_per_100g = EXCLUDED.carbs_per_100g,
  fat_per_100g = EXCLUDED.fat_per_100g,
  fiber_per_100g = EXCLUDED.fiber_per_100g,
  diet_types = EXCLUDED.diet_types,
  tags = EXCLUDED.tags,
  is_processed = EXCLUDED.is_processed,
  contains_root_veg = EXCLUDED.contains_root_veg;

  -- Servings for rooh-afza
  DELETE FROM public.food_servings WHERE food_id = 'rooh-afza';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('rooh-afza', 'glass', '1 glass', 250);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('rooh-afza', 'g100', '100ml', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'cola-can', 
  'Cola / Soft Drink (Thums Up, Coke, Pepsi)', 
  'कोला', 
  ARRAY['coke', 'pepsi', 'thums up', 'cold drink']::TEXT[], 
  ARRAY['cola', 'coke', 'pepsi', 'thums up', 'cold drink', 'soft drink']::TEXT[], 
  'drink', 
  'packaged', 
  'drink'::public.item_type_enum, 
  'raw'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  330,
  43, 0, 10.6, 0, 0,
  11, NULL, NULL, NULL, NULL,
  '{"vegan","veg","jain","nonveg"}'::public.diet_type_enum[], 
  ARRAY['snack', 'high-sugar']::TEXT[], 
  '{}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  true, false, true, false, false, false,
  63, 
  NULL, 
  0, 
  'USDA'::public.source_enum, 
  'high'::public.confidence_enum, 
  NULL
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  hindi_name = EXCLUDED.hindi_name,
  name_alt = EXCLUDED.name_alt,
  search_terms = EXCLUDED.search_terms,
  category_id = EXCLUDED.category_id,
  subcategory = EXCLUDED.subcategory,
  item_type = EXCLUDED.item_type,
  state = EXCLUDED.state,
  region = EXCLUDED.region,
  default_serving_grams = EXCLUDED.default_serving_grams,
  cal_per_100g = EXCLUDED.cal_per_100g,
  protein_per_100g = EXCLUDED.protein_per_100g,
  carbs_per_100g = EXCLUDED.carbs_per_100g,
  fat_per_100g = EXCLUDED.fat_per_100g,
  fiber_per_100g = EXCLUDED.fiber_per_100g,
  diet_types = EXCLUDED.diet_types,
  tags = EXCLUDED.tags,
  is_processed = EXCLUDED.is_processed,
  contains_root_veg = EXCLUDED.contains_root_veg;

  -- Servings for cola-can
  DELETE FROM public.food_servings WHERE food_id = 'cola-can';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('cola-can', 'glass', '1 Can (330ml)', 330);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('cola-can', 'g100', '100ml', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'beer', 
  'Beer (Standard, 5% Alc)', 
  'बीयर', 
  ARRAY['kingfisher', 'bira', 'lager']::TEXT[], 
  ARRAY['beer', 'alcohol', 'kingfisher', 'bira', 'drink']::TEXT[], 
  'drink', 
  'alcohol', 
  'drink'::public.item_type_enum, 
  'raw'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  330,
  43, 0.5, 3.6, 0, 0,
  4, NULL, NULL, NULL, 4,
  '{"vegan","veg","jain","nonveg"}'::public.diet_type_enum[], 
  ARRAY['snack', 'high-calorie']::TEXT[], 
  '{}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  true, false, false, false, false, false,
  89, 
  NULL, 
  0, 
  'USDA'::public.source_enum, 
  'high'::public.confidence_enum, 
  NULL
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  hindi_name = EXCLUDED.hindi_name,
  name_alt = EXCLUDED.name_alt,
  search_terms = EXCLUDED.search_terms,
  category_id = EXCLUDED.category_id,
  subcategory = EXCLUDED.subcategory,
  item_type = EXCLUDED.item_type,
  state = EXCLUDED.state,
  region = EXCLUDED.region,
  default_serving_grams = EXCLUDED.default_serving_grams,
  cal_per_100g = EXCLUDED.cal_per_100g,
  protein_per_100g = EXCLUDED.protein_per_100g,
  carbs_per_100g = EXCLUDED.carbs_per_100g,
  fat_per_100g = EXCLUDED.fat_per_100g,
  fiber_per_100g = EXCLUDED.fiber_per_100g,
  diet_types = EXCLUDED.diet_types,
  tags = EXCLUDED.tags,
  is_processed = EXCLUDED.is_processed,
  contains_root_veg = EXCLUDED.contains_root_veg;

  -- Servings for beer
  DELETE FROM public.food_servings WHERE food_id = 'beer';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('beer', 'glass', '1 Pint/Can (330ml)', 330);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('beer', 'g100', '100ml', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'ors-drink', 
  'ORS (Oral Rehydration Solution)', 
  'ओआरएस', 
  ARRAY['ors water', 'electral']::TEXT[], 
  ARRAY['ors', 'electral', 'rehydration', 'drink']::TEXT[], 
  'drink', 
  'hydration', 
  'drink'::public.item_type_enum, 
  'raw'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  200,
  15, 0, 3.5, 0, 0,
  150, NULL, NULL, NULL, NULL,
  '{"vegan","veg","jain","nonveg"}'::public.diet_type_enum[], 
  ARRAY['hydration', 'low-calorie']::TEXT[], 
  '{"navratri","ekadashi"}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  true, true, true, false, false, false,
  70, 
  NULL, 
  0, 
  'healthifyme'::public.source_enum, 
  'high'::public.confidence_enum, 
  NULL
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  hindi_name = EXCLUDED.hindi_name,
  name_alt = EXCLUDED.name_alt,
  search_terms = EXCLUDED.search_terms,
  category_id = EXCLUDED.category_id,
  subcategory = EXCLUDED.subcategory,
  item_type = EXCLUDED.item_type,
  state = EXCLUDED.state,
  region = EXCLUDED.region,
  default_serving_grams = EXCLUDED.default_serving_grams,
  cal_per_100g = EXCLUDED.cal_per_100g,
  protein_per_100g = EXCLUDED.protein_per_100g,
  carbs_per_100g = EXCLUDED.carbs_per_100g,
  fat_per_100g = EXCLUDED.fat_per_100g,
  fiber_per_100g = EXCLUDED.fiber_per_100g,
  diet_types = EXCLUDED.diet_types,
  tags = EXCLUDED.tags,
  is_processed = EXCLUDED.is_processed,
  contains_root_veg = EXCLUDED.contains_root_veg;

  -- Servings for ors-drink
  DELETE FROM public.food_servings WHERE food_id = 'ors-drink';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('ors-drink', 'glass', '1 glass (200ml)', 200);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('ors-drink', 'g100', '100ml', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'protein-shake-homemade', 
  'Protein Shake (1 Scoop + 200ml Milk)', 
  'प्रोटीन शेक', 
  ARRAY['whey with milk']::TEXT[], 
  ARRAY['protein', 'shake', 'whey', 'milk shake']::TEXT[], 
  'drink', 
  'milk-based', 
  'drink'::public.item_type_enum, 
  'raw'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  230,
  100, 12, 7, 3, 0,
  60, 0.5, 10, 0.1, 150,
  '{"veg","jain","nonveg"}'::public.diet_type_enum[], 
  ARRAY['post-workout', 'high-protein']::TEXT[], 
  '{}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  true, false, true, true, false, false,
  30, 
  NULL, 
  0, 
  'healthifyme'::public.source_enum, 
  'medium'::public.confidence_enum, 
  'Composite of 1 scoop (~30g) whey + 200ml toned milk.'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  hindi_name = EXCLUDED.hindi_name,
  name_alt = EXCLUDED.name_alt,
  search_terms = EXCLUDED.search_terms,
  category_id = EXCLUDED.category_id,
  subcategory = EXCLUDED.subcategory,
  item_type = EXCLUDED.item_type,
  state = EXCLUDED.state,
  region = EXCLUDED.region,
  default_serving_grams = EXCLUDED.default_serving_grams,
  cal_per_100g = EXCLUDED.cal_per_100g,
  protein_per_100g = EXCLUDED.protein_per_100g,
  carbs_per_100g = EXCLUDED.carbs_per_100g,
  fat_per_100g = EXCLUDED.fat_per_100g,
  fiber_per_100g = EXCLUDED.fiber_per_100g,
  diet_types = EXCLUDED.diet_types,
  tags = EXCLUDED.tags,
  is_processed = EXCLUDED.is_processed,
  contains_root_veg = EXCLUDED.contains_root_veg;

  -- Servings for protein-shake-homemade
  DELETE FROM public.food_servings WHERE food_id = 'protein-shake-homemade';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('protein-shake-homemade', 'glass', '1 shaker (230g)', 230);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('protein-shake-homemade', 'g100', '100g', 100);

