-- OFF India FMCG Ingestion

INSERT INTO public.standard_servings (id, label, default_grams, used_for)
VALUES ('serving', '1 serving', 50, 'Generic food serving fallback')
ON CONFLICT (id) DO NOTHING;


INSERT INTO public.foods (
  id, name, brand, barcode, allergens, name_alt, search_terms, category_id, subcategory, item_type, state, region,
  default_serving_grams, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sodium_per_100g,
  diet_types, tags, is_processed, source, confidence, last_verified, notes
) VALUES (
  'off-8908013479092', 'double cocoa protein bar', 'The Whole Truth', '8908013479092', ARRAY['milk', 'nuts'], ARRAY['the whole truth', 'double', 'cocoa'], ARRAY['the whole truth', 'double', 'cocoa', 'protein', 'bar'], 'packaged-food', 'packaged', 'packaged-food'::public.item_type_enum, 'raw'::public.food_state_enum, 'pan-indian'::public.region_enum,
  52, 493, 25.6, 37.7, 26.5, 10.4, 14,
  ARRAY['veg'::public.diet_type_enum, 'nonveg'::public.diet_type_enum], ARRAY['packaged', 'fmcg'], true, 'off-india'::public.source_enum, 'medium'::public.confidence_enum, '2026-05-01', 'Open Food Facts India'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.foods (
  id, name, brand, barcode, allergens, name_alt, search_terms, category_id, subcategory, item_type, state, region,
  default_serving_grams, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sodium_per_100g,
  diet_types, tags, is_processed, source, confidence, last_verified, notes
) VALUES (
  'off-8906143890152', 'Dark Chocolate Peanut Spread - Crunchy', 'The Whole Truth', '8906143890152', ARRAY['peanuts'], ARRAY['the whole truth', 'dark', 'chocolate'], ARRAY['the whole truth', 'dark', 'chocolate', 'peanut', 'spread', '-', 'crunchy'], 'oil-fat', 'packaged', 'packaged-food'::public.item_type_enum, 'raw'::public.food_state_enum, 'pan-indian'::public.region_enum,
  35, 590, 17.7, 42, 39.1, 10, 104,
  ARRAY['veg'::public.diet_type_enum, 'nonveg'::public.diet_type_enum], ARRAY['packaged', 'fmcg'], true, 'off-india'::public.source_enum, 'medium'::public.confidence_enum, '2026-05-01', 'Open Food Facts India'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.foods (
  id, name, brand, barcode, allergens, name_alt, search_terms, category_id, subcategory, item_type, state, region,
  default_serving_grams, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sodium_per_100g,
  diet_types, tags, is_processed, source, confidence, last_verified, notes
) VALUES (
  'off-8906143891661', 'Whey Protein Concentrate Unflavoured', 'The Whole Truth', '8906143891661', ARRAY['milk'], ARRAY['the whole truth', 'whey', 'protein'], ARRAY['the whole truth', 'whey', 'protein', 'concentrate', 'unflavoured'], 'supplement', 'packaged', 'packaged-food'::public.item_type_enum, 'raw'::public.food_state_enum, 'pan-indian'::public.region_enum,
  35, 386, 75.7, 9.1, 4.9, 0.1, 187,
  ARRAY['veg'::public.diet_type_enum, 'nonveg'::public.diet_type_enum], ARRAY['packaged', 'fmcg'], true, 'off-india'::public.source_enum, 'medium'::public.confidence_enum, '2026-05-01', 'Open Food Facts India'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.foods (
  id, name, brand, barcode, allergens, name_alt, search_terms, category_id, subcategory, item_type, state, region,
  default_serving_grams, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sodium_per_100g,
  diet_types, tags, is_processed, source, confidence, last_verified, notes
) VALUES (
  'off-8906143891654', 'Cocoa Whey Protein', 'The Whole Truth', '8906143891654', NULL, ARRAY['the whole truth', 'cocoa', 'whey'], ARRAY['the whole truth', 'cocoa', 'whey', 'protein'], 'supplement', 'packaged', 'packaged-food'::public.item_type_enum, 'raw'::public.food_state_enum, 'pan-indian'::public.region_enum,
  35, 397, 71.1, 18.3, 4.3, 4.3, 292,
  ARRAY['veg'::public.diet_type_enum, 'nonveg'::public.diet_type_enum], ARRAY['packaged', 'fmcg'], true, 'off-india'::public.source_enum, 'medium'::public.confidence_enum, '2026-05-01', 'Open Food Facts India'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.foods (
  id, name, brand, barcode, allergens, name_alt, search_terms, category_id, subcategory, item_type, state, region,
  default_serving_grams, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sodium_per_100g,
  diet_types, tags, is_processed, source, confidence, last_verified, notes
) VALUES (
  'off-8906143890510', 'The Whole Truth Hazelnut Dark Chocolate', 'The Whole Truth', '8906143890510', ARRAY['nuts'], ARRAY['the whole truth', 'the', 'whole'], ARRAY['the whole truth', 'the', 'whole', 'truth', 'hazelnut', 'dark', 'chocolate'], 'sweet-mithai', 'packaged', 'packaged-food'::public.item_type_enum, 'raw'::public.food_state_enum, 'pan-indian'::public.region_enum,
  10, 577, 8.1, 48.3, 39, 9.7, 13,
  ARRAY['veg'::public.diet_type_enum, 'nonveg'::public.diet_type_enum], ARRAY['packaged', 'fmcg'], true, 'off-india'::public.source_enum, 'medium'::public.confidence_enum, '2026-05-01', 'Open Food Facts India'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.foods (
  id, name, brand, barcode, allergens, name_alt, search_terms, category_id, subcategory, item_type, state, region,
  default_serving_grams, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sodium_per_100g,
  diet_types, tags, is_processed, source, confidence, last_verified, notes
) VALUES (
  'off-8908013479139', 'The Whole Truth Bar Cranberry', 'The Whole Truth', '8908013479139', NULL, ARRAY['the whole truth', 'the', 'whole'], ARRAY['the whole truth', 'the', 'whole', 'truth', 'bar', 'cranberry'], 'packaged-food', 'packaged', 'packaged-food'::public.item_type_enum, 'raw'::public.food_state_enum, 'pan-indian'::public.region_enum,
  52, 452, 23.1, 40.8, 22.7, 4.2, 4,
  ARRAY['veg'::public.diet_type_enum, 'nonveg'::public.diet_type_enum], ARRAY['packaged', 'fmcg'], true, 'off-india'::public.source_enum, 'medium'::public.confidence_enum, '2026-05-01', 'Open Food Facts India'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.foods (
  id, name, brand, barcode, allergens, name_alt, search_terms, category_id, subcategory, item_type, state, region,
  default_serving_grams, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sodium_per_100g,
  diet_types, tags, is_processed, source, confidence, last_verified, notes
) VALUES (
  'off-8906143891647', 'Cold Coffee Whey Protein Isolate + Concentrate', 'The Whole Truth', '8906143891647', ARRAY['milk'], ARRAY['the whole truth', 'cold', 'coffee'], ARRAY['the whole truth', 'cold', 'coffee', 'whey', 'protein', 'isolate', '+', 'concentrate'], 'packaged-food', 'packaged', 'packaged-food'::public.item_type_enum, 'raw'::public.food_state_enum, 'pan-indian'::public.region_enum,
  35, 383, 70.9, 18, 2.9, 4.6, 170,
  ARRAY['veg'::public.diet_type_enum, 'nonveg'::public.diet_type_enum], ARRAY['packaged', 'fmcg'], true, 'off-india'::public.source_enum, 'medium'::public.confidence_enum, '2026-05-01', 'Open Food Facts India'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.foods (
  id, name, brand, barcode, allergens, name_alt, search_terms, category_id, subcategory, item_type, state, region,
  default_serving_grams, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sodium_per_100g,
  diet_types, tags, is_processed, source, confidence, last_verified, notes
) VALUES (
  'off-8906143892002', 'Whole truth hazelnut 20g', 'The Whole Truth', '8906143892002', ARRAY['nuts'], ARRAY['the whole truth', 'whole', 'truth'], ARRAY['the whole truth', 'whole', 'truth', 'hazelnut', '20g'], 'packaged-food', 'packaged', 'packaged-food'::public.item_type_enum, 'raw'::public.food_state_enum, 'pan-indian'::public.region_enum,
  67, 513, 31.3, 30.6, 29.6, 10.7, 157,
  ARRAY['veg'::public.diet_type_enum, 'nonveg'::public.diet_type_enum], ARRAY['packaged', 'fmcg'], true, 'off-india'::public.source_enum, 'medium'::public.confidence_enum, '2026-05-01', 'Open Food Facts India'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.foods (
  id, name, brand, barcode, allergens, name_alt, search_terms, category_id, subcategory, item_type, state, region,
  default_serving_grams, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sodium_per_100g,
  diet_types, tags, is_processed, source, confidence, last_verified, notes
) VALUES (
  'off-8906143890145', 'date sweetened peanut butter', 'The Whole Truth', '8906143890145', NULL, ARRAY['the whole truth', 'date', 'sweetened'], ARRAY['the whole truth', 'date', 'sweetened', 'peanut', 'butter'], 'oil-fat', 'packaged', 'packaged-food'::public.item_type_enum, 'raw'::public.food_state_enum, 'pan-indian'::public.region_enum,
  35, 637, 24.3, 22, 50.3, 8, 31,
  ARRAY['veg'::public.diet_type_enum, 'nonveg'::public.diet_type_enum], ARRAY['packaged', 'fmcg'], true, 'off-india'::public.source_enum, 'medium'::public.confidence_enum, '2026-05-01', 'Open Food Facts India'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.foods (
  id, name, brand, barcode, allergens, name_alt, search_terms, category_id, subcategory, item_type, state, region,
  default_serving_grams, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sodium_per_100g,
  diet_types, tags, is_processed, source, confidence, last_verified, notes
) VALUES (
  'off-8906143890473', 'The Whole Truth 71% Dark Chocolate', 'The Whole Truth', '8906143890473', NULL, ARRAY['the whole truth', 'the', 'whole'], ARRAY['the whole truth', 'the', 'whole', 'truth', '71%', 'dark', 'chocolate'], 'sweet-mithai', 'packaged', 'packaged-food'::public.item_type_enum, 'raw'::public.food_state_enum, 'pan-indian'::public.region_enum,
  10, 597, 8.1, 40.2, 44.8, 8.2, 3,
  ARRAY['veg'::public.diet_type_enum, 'nonveg'::public.diet_type_enum], ARRAY['packaged', 'fmcg'], true, 'off-india'::public.source_enum, 'medium'::public.confidence_enum, '2026-05-01', 'Open Food Facts India'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.foods (
  id, name, brand, barcode, allergens, name_alt, search_terms, category_id, subcategory, item_type, state, region,
  default_serving_grams, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sodium_per_100g,
  diet_types, tags, is_processed, source, confidence, last_verified, notes
) VALUES (
  'off-8904335600312', 'YogaBar Muesli+', 'YogaBar', '8904335600312', ARRAY['nuts'], ARRAY['yogabar', 'yogabar', 'muesli+'], ARRAY['yogabar', 'yogabar', 'muesli+'], 'grain-cereal', 'packaged', 'packaged-food'::public.item_type_enum, 'raw'::public.food_state_enum, 'pan-indian'::public.region_enum,
  40, 418, 13, 70, 9.5, 7.4, 61200,
  ARRAY['veg'::public.diet_type_enum, 'nonveg'::public.diet_type_enum], ARRAY['packaged', 'fmcg'], true, 'off-india'::public.source_enum, 'medium'::public.confidence_enum, '2026-05-01', 'Open Food Facts India'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.foods (
  id, name, brand, barcode, allergens, name_alt, search_terms, category_id, subcategory, item_type, state, region,
  default_serving_grams, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sodium_per_100g,
  diet_types, tags, is_processed, source, confidence, last_verified, notes
) VALUES (
  'off-8904335602521', 'Chocolate Muesli', 'Yogabar', '8904335602521', ARRAY['nuts', 'soybeans'], ARRAY['yogabar', 'chocolate', 'muesli'], ARRAY['yogabar', 'chocolate', 'muesli'], 'grain-cereal', 'packaged', 'packaged-food'::public.item_type_enum, 'raw'::public.food_state_enum, 'pan-indian'::public.region_enum,
  100, 437, 12.3, 67, 13.3, 9.4, 91,
  ARRAY['veg'::public.diet_type_enum, 'nonveg'::public.diet_type_enum], ARRAY['packaged', 'fmcg'], true, 'off-india'::public.source_enum, 'medium'::public.confidence_enum, '2026-05-01', 'Open Food Facts India'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.foods (
  id, name, brand, barcode, allergens, name_alt, search_terms, category_id, subcategory, item_type, state, region,
  default_serving_grams, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sodium_per_100g,
  diet_types, tags, is_processed, source, confidence, last_verified, notes
) VALUES (
  'off-8904335603429', '26g High Protein Oats Dark Chocolate', 'Yogabar', '8904335603429', ARRAY['gluten', 'milk', 'nuts', 'soybeans'], ARRAY['yogabar', '26g', 'high'], ARRAY['yogabar', '26g', 'high', 'protein', 'oats', 'dark', 'chocolate'], 'grain-cereal', 'packaged', 'packaged-food'::public.item_type_enum, 'raw'::public.food_state_enum, 'pan-indian'::public.region_enum,
  50, 354, 26, 52, 7.2, 11.2, 100,
  ARRAY['veg'::public.diet_type_enum, 'nonveg'::public.diet_type_enum], ARRAY['packaged', 'fmcg'], true, 'off-india'::public.source_enum, 'medium'::public.confidence_enum, '2026-05-01', 'Open Food Facts India'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.foods (
  id, name, brand, barcode, allergens, name_alt, search_terms, category_id, subcategory, item_type, state, region,
  default_serving_grams, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sodium_per_100g,
  diet_types, tags, is_processed, source, confidence, last_verified, notes
) VALUES (
  'off-8904335602064', 'Yoga bar Breakfast Protein Bar', 'Yogabar', '8904335602064', ARRAY['sesame-seeds', 'soybeans'], ARRAY['yogabar', 'yoga', 'bar'], ARRAY['yogabar', 'yoga', 'bar', 'breakfast', 'protein', 'bar'], 'packaged-food', 'packaged', 'packaged-food'::public.item_type_enum, 'raw'::public.food_state_enum, 'pan-indian'::public.region_enum,
  50, 404, 9, 69, 12.6, 11, 120,
  ARRAY['veg'::public.diet_type_enum, 'nonveg'::public.diet_type_enum], ARRAY['packaged', 'fmcg'], true, 'off-india'::public.source_enum, 'medium'::public.confidence_enum, '2026-05-01', 'Open Food Facts India'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.foods (
  id, name, brand, barcode, allergens, name_alt, search_terms, category_id, subcategory, item_type, state, region,
  default_serving_grams, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sodium_per_100g,
  diet_types, tags, is_processed, source, confidence, last_verified, notes
) VALUES (
  'off-8904335605218', 'Coffee Flavour Plant Protein', 'Yogabar', '8904335605218', NULL, ARRAY['yogabar', 'coffee', 'flavour'], ARRAY['yogabar', 'coffee', 'flavour', 'plant', 'protein'], 'packaged-food', 'packaged', 'packaged-food'::public.item_type_enum, 'raw'::public.food_state_enum, 'pan-indian'::public.region_enum,
  100, 399, 66.5, 17.9, 8.4, 6.2, 698,
  ARRAY['veg'::public.diet_type_enum, 'nonveg'::public.diet_type_enum], ARRAY['packaged', 'fmcg'], true, 'off-india'::public.source_enum, 'medium'::public.confidence_enum, '2026-05-01', 'Open Food Facts India'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.foods (
  id, name, brand, barcode, allergens, name_alt, search_terms, category_id, subcategory, item_type, state, region,
  default_serving_grams, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sodium_per_100g,
  diet_types, tags, is_processed, source, confidence, last_verified, notes
) VALUES (
  'off-8904335603931', 'High Protein Muesli Fruit+ Nuts & Seeds', 'Yogabar', '8904335603931', NULL, ARRAY['yogabar', 'high', 'protein'], ARRAY['yogabar', 'high', 'protein', 'muesli', 'fruit+', 'nuts', '&', 'seeds'], 'packaged-food', 'packaged', 'packaged-food'::public.item_type_enum, 'raw'::public.food_state_enum, 'pan-indian'::public.region_enum,
  40, 403, 23.5, 57.2, 10.5, 7.1, 221,
  ARRAY['veg'::public.diet_type_enum, 'nonveg'::public.diet_type_enum], ARRAY['packaged', 'fmcg'], true, 'off-india'::public.source_enum, 'medium'::public.confidence_enum, '2026-05-01', 'Open Food Facts India'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.foods (
  id, name, brand, barcode, allergens, name_alt, search_terms, category_id, subcategory, item_type, state, region,
  default_serving_grams, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sodium_per_100g,
  diet_types, tags, is_processed, source, confidence, last_verified, notes
) VALUES (
  'off-8908005144007', 'vanilla almond multigrain energy bar', 'yogabar', '8908005144007', ARRAY['nuts', 'peanuts', 'sesame-seeds'], ARRAY['yogabar', 'vanilla', 'almond'], ARRAY['yogabar', 'vanilla', 'almond', 'multigrain', 'energy', 'bar'], 'packaged-food', 'packaged', 'packaged-food'::public.item_type_enum, 'raw'::public.food_state_enum, 'pan-indian'::public.region_enum,
  38, 437, 13.9, 57.4, 19.5, 7.9, NULL,
  ARRAY['veg'::public.diet_type_enum, 'nonveg'::public.diet_type_enum], ARRAY['packaged', 'fmcg'], true, 'off-india'::public.source_enum, 'medium'::public.confidence_enum, '2026-05-01', 'Open Food Facts India'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.foods (
  id, name, brand, barcode, allergens, name_alt, search_terms, category_id, subcategory, item_type, state, region,
  default_serving_grams, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sodium_per_100g,
  diet_types, tags, is_processed, source, confidence, last_verified, notes
) VALUES (
  'off-8904335600657', 'super muesli no added sugar', 'yogabar', '8904335600657', ARRAY['milk', 'nuts', 'sesame-seeds', 'soybeans'], ARRAY['yogabar', 'super', 'muesli'], ARRAY['yogabar', 'super', 'muesli', 'no', 'added', 'sugar'], 'grain-cereal', 'packaged', 'packaged-food'::public.item_type_enum, 'raw'::public.food_state_enum, 'pan-indian'::public.region_enum,
  40, 425, 17.4, 54.9, 21.6, 15.1, 60,
  ARRAY['veg'::public.diet_type_enum, 'nonveg'::public.diet_type_enum], ARRAY['packaged', 'fmcg'], true, 'off-india'::public.source_enum, 'medium'::public.confidence_enum, '2026-05-01', 'Open Food Facts India'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.foods (
  id, name, brand, barcode, allergens, name_alt, search_terms, category_id, subcategory, item_type, state, region,
  default_serving_grams, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sodium_per_100g,
  diet_types, tags, is_processed, source, confidence, last_verified, notes
) VALUES (
  'off-8904335602859', 'YogaBar Nuts & Seeds Crunch Super Muesli', 'YogaBar', '8904335602859', ARRAY['nuts'], ARRAY['yogabar', 'yogabar', 'nuts'], ARRAY['yogabar', 'yogabar', 'nuts', '&', 'seeds', 'crunch', 'super', 'muesli'], 'grain-cereal', 'packaged', 'packaged-food'::public.item_type_enum, 'raw'::public.food_state_enum, 'pan-indian'::public.region_enum,
  40, 388, 12, 64, 12, 7.5, 15,
  ARRAY['veg'::public.diet_type_enum, 'nonveg'::public.diet_type_enum], ARRAY['packaged', 'fmcg'], true, 'off-india'::public.source_enum, 'medium'::public.confidence_enum, '2026-05-01', 'Open Food Facts India'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.foods (
  id, name, brand, barcode, allergens, name_alt, search_terms, category_id, subcategory, item_type, state, region,
  default_serving_grams, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sodium_per_100g,
  diet_types, tags, is_processed, source, confidence, last_verified, notes
) VALUES (
  'off-8904335604266', 'Yogabar Whey Concentrate', 'Yogabar', '8904335604266', NULL, ARRAY['yogabar', 'yogabar', 'whey'], ARRAY['yogabar', 'yogabar', 'whey', 'concentrate'], 'packaged-food', 'packaged', 'packaged-food'::public.item_type_enum, 'raw'::public.food_state_enum, 'pan-indian'::public.region_enum,
  35, 383, 77.1, 6.6, 5.4, 0, NULL,
  ARRAY['veg'::public.diet_type_enum, 'nonveg'::public.diet_type_enum], ARRAY['packaged', 'fmcg'], true, 'off-india'::public.source_enum, 'medium'::public.confidence_enum, '2026-05-01', 'Open Food Facts India'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.foods (
  id, name, brand, barcode, allergens, name_alt, search_terms, category_id, subcategory, item_type, state, region,
  default_serving_grams, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sodium_per_100g,
  diet_types, tags, is_processed, source, confidence, last_verified, notes
) VALUES (
  'off-8906009532356', 'Max protein daily choco almond bar', 'Ritebite', '8906009532356', ARRAY['milk', 'nuts', 'soybeans'], ARRAY['ritebite', 'max', 'protein'], ARRAY['ritebite', 'max', 'protein', 'daily', 'choco', 'almond', 'bar'], 'packaged-food', 'packaged', 'packaged-food'::public.item_type_enum, 'raw'::public.food_state_enum, 'pan-indian'::public.region_enum,
  50, 358, 20, 39, 13.6, 27.4, NULL,
  ARRAY['veg'::public.diet_type_enum, 'nonveg'::public.diet_type_enum], ARRAY['packaged', 'fmcg'], true, 'off-india'::public.source_enum, 'medium'::public.confidence_enum, '2026-05-01', 'Open Food Facts India'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.foods (
  id, name, brand, barcode, allergens, name_alt, search_terms, category_id, subcategory, item_type, state, region,
  default_serving_grams, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sodium_per_100g,
  diet_types, tags, is_processed, source, confidence, last_verified, notes
) VALUES (
  'off-8906009533148', 'Max Protein GrainBreakfast Cookie', 'RiteBite', '8906009533148', NULL, ARRAY['ritebite', 'max', 'protein'], ARRAY['ritebite', 'max', 'protein', 'grainbreakfast', 'cookie'], 'packaged-food', 'packaged', 'packaged-food'::public.item_type_enum, 'raw'::public.food_state_enum, 'pan-indian'::public.region_enum,
  55, 478, 18.2, 45.1, 24.9, 7.3, 220,
  ARRAY['veg'::public.diet_type_enum, 'nonveg'::public.diet_type_enum], ARRAY['packaged', 'fmcg'], true, 'off-india'::public.source_enum, 'medium'::public.confidence_enum, '2026-05-01', 'Open Food Facts India'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.foods (
  id, name, brand, barcode, allergens, name_alt, search_terms, category_id, subcategory, item_type, state, region,
  default_serving_grams, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sodium_per_100g,
  diet_types, tags, is_processed, source, confidence, last_verified, notes
) VALUES (
  'off-8906009532998', 'Nutrition Bar', 'RiteBite', '8906009532998', ARRAY['peanuts', 'soybeans'], ARRAY['ritebite', 'nutrition', 'bar'], ARRAY['ritebite', 'nutrition', 'bar'], 'packaged-food', 'packaged', 'packaged-food'::public.item_type_enum, 'raw'::public.food_state_enum, 'pan-indian'::public.region_enum,
  40, 204, 4.1, 23, 10.2, 2.3, 48,
  ARRAY['veg'::public.diet_type_enum, 'nonveg'::public.diet_type_enum], ARRAY['packaged', 'fmcg'], true, 'off-india'::public.source_enum, 'medium'::public.confidence_enum, '2026-05-01', 'Open Food Facts India'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.foods (
  id, name, brand, barcode, allergens, name_alt, search_terms, category_id, subcategory, item_type, state, region,
  default_serving_grams, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sodium_per_100g,
  diet_types, tags, is_processed, source, confidence, last_verified, notes
) VALUES (
  'off-8906009536477', 'Max Protein Dark Choco Crunchy Spread Peanut Butter', 'RiteBite', '8906009536477', ARRAY['peanuts', 'soybeans'], ARRAY['ritebite', 'max', 'protein'], ARRAY['ritebite', 'max', 'protein', 'dark', 'choco', 'crunchy', 'spread', 'peanut', 'butter'], 'oil-fat', 'packaged', 'packaged-food'::public.item_type_enum, 'raw'::public.food_state_enum, 'pan-indian'::public.region_enum,
  100, 593, 18, 38, 41, 4, NULL,
  ARRAY['veg'::public.diet_type_enum, 'nonveg'::public.diet_type_enum], ARRAY['packaged', 'fmcg'], true, 'off-india'::public.source_enum, 'medium'::public.confidence_enum, '2026-05-01', 'Open Food Facts India'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.foods (
  id, name, brand, barcode, allergens, name_alt, search_terms, category_id, subcategory, item_type, state, region,
  default_serving_grams, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sodium_per_100g,
  diet_types, tags, is_processed, source, confidence, last_verified, notes
) VALUES (
  'off-8906009531236', 'RiteBite Nutrition Bar', 'RiteBite', '8906009531236', ARRAY['milk', 'soybeans'], ARRAY['ritebite', 'ritebite', 'nutrition'], ARRAY['ritebite', 'ritebite', 'nutrition', 'bar'], 'packaged-food', 'packaged', 'packaged-food'::public.item_type_enum, 'raw'::public.food_state_enum, 'pan-indian'::public.region_enum,
  35, 386, 9.4, 58.9, 11.1, 3.4, 135,
  ARRAY['veg'::public.diet_type_enum, 'nonveg'::public.diet_type_enum], ARRAY['packaged', 'fmcg'], true, 'off-india'::public.source_enum, 'medium'::public.confidence_enum, '2026-05-01', 'Open Food Facts India'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.foods (
  id, name, brand, barcode, allergens, name_alt, search_terms, category_id, subcategory, item_type, state, region,
  default_serving_grams, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sodium_per_100g,
  diet_types, tags, is_processed, source, confidence, last_verified, notes
) VALUES (
  'off-8906009532837', 'Max protein (7 grain protein snack)', 'RiteBite', '8906009532837', ARRAY['celery', 'gluten', 'soybeans'], ARRAY['ritebite', 'max', 'protein'], ARRAY['ritebite', 'max', 'protein', '(7', 'grain', 'protein', 'snack)'], 'snack-street', 'packaged', 'packaged-food'::public.item_type_enum, 'raw'::public.food_state_enum, 'pan-indian'::public.region_enum,
  60, 477, 16.7, 49, 23.3, 6.7, 833,
  ARRAY['veg'::public.diet_type_enum, 'nonveg'::public.diet_type_enum], ARRAY['packaged', 'fmcg'], true, 'off-india'::public.source_enum, 'medium'::public.confidence_enum, '2026-05-01', 'Open Food Facts India'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.foods (
  id, name, brand, barcode, allergens, name_alt, search_terms, category_id, subcategory, item_type, state, region,
  default_serving_grams, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sodium_per_100g,
  diet_types, tags, is_processed, source, confidence, last_verified, notes
) VALUES (
  'off-8906009532844', 'Max Protien', 'RiteBite', '8906009532844', NULL, ARRAY['ritebite', 'max', 'protien'], ARRAY['ritebite', 'max', 'protien'], 'packaged-food', 'packaged', 'packaged-food'::public.item_type_enum, 'raw'::public.food_state_enum, 'pan-indian'::public.region_enum,
  60, 478, 16.7, 49.7, 22.8, 6.7, 833,
  ARRAY['veg'::public.diet_type_enum, 'nonveg'::public.diet_type_enum], ARRAY['packaged', 'fmcg'], true, 'off-india'::public.source_enum, 'medium'::public.confidence_enum, '2026-05-01', 'Open Food Facts India'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.foods (
  id, name, brand, barcode, allergens, name_alt, search_terms, category_id, subcategory, item_type, state, region,
  default_serving_grams, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sodium_per_100g,
  diet_types, tags, is_processed, source, confidence, last_verified, notes
) VALUES (
  'off-8906009532981', 'RiteBite Nutrition Bar Nuts & Seeds', 'RiteBite', '8906009532981', ARRAY['gluten', 'nuts', 'sesame-seeds', 'soybeans'], ARRAY['ritebite', 'ritebite', 'nutrition'], ARRAY['ritebite', 'ritebite', 'nutrition', 'bar', 'nuts', '&', 'seeds'], 'packaged-food', 'packaged', 'packaged-food'::public.item_type_enum, 'raw'::public.food_state_enum, 'pan-indian'::public.region_enum,
  50, 110, 4.2, 20.8, 3.9, 3.9, 55,
  ARRAY['veg'::public.diet_type_enum, 'nonveg'::public.diet_type_enum], ARRAY['packaged', 'fmcg'], true, 'off-india'::public.source_enum, 'medium'::public.confidence_enum, '2026-05-01', 'Open Food Facts India'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.foods (
  id, name, brand, barcode, allergens, name_alt, search_terms, category_id, subcategory, item_type, state, region,
  default_serving_grams, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sodium_per_100g,
  diet_types, tags, is_processed, source, confidence, last_verified, notes
) VALUES (
  'off-4906409532363', 'Max Protein by RiteBite', 'RiteBite', '4906409532363', ARRAY['milk', 'soybeans'], ARRAY['ritebite', 'max', 'protein'], ARRAY['ritebite', 'max', 'protein', 'by', 'ritebite'], 'packaged-food', 'packaged', 'packaged-food'::public.item_type_enum, 'raw'::public.food_state_enum, 'pan-indian'::public.region_enum,
  50, 346, 20, 55.6, 11.6, 10, 276,
  ARRAY['veg'::public.diet_type_enum, 'nonveg'::public.diet_type_enum], ARRAY['packaged', 'fmcg'], true, 'off-india'::public.source_enum, 'medium'::public.confidence_enum, '2026-05-01', 'Open Food Facts India'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.foods (
  id, name, brand, barcode, allergens, name_alt, search_terms, category_id, subcategory, item_type, state, region,
  default_serving_grams, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sodium_per_100g,
  diet_types, tags, is_processed, source, confidence, last_verified, notes
) VALUES (
  'off-8906009532950', 'RiteBite MAXPROTEIN snack', 'RiteBite', '8906009532950', ARRAY['soybeans', 'cereals'], ARRAY['ritebite', 'ritebite', 'maxprotein'], ARRAY['ritebite', 'ritebite', 'maxprotein', 'snack'], 'packaged-food', 'packaged', 'packaged-food'::public.item_type_enum, 'raw'::public.food_state_enum, 'pan-indian'::public.region_enum,
  60, 477, 16.7, 49.8, 22.7, 6.7, 833,
  ARRAY['veg'::public.diet_type_enum, 'nonveg'::public.diet_type_enum], ARRAY['packaged', 'fmcg'], true, 'off-india'::public.source_enum, 'medium'::public.confidence_enum, '2026-05-01', 'Open Food Facts India'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.foods (
  id, name, brand, barcode, allergens, name_alt, search_terms, category_id, subcategory, item_type, state, region,
  default_serving_grams, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sodium_per_100g,
  diet_types, tags, is_processed, source, confidence, last_verified, notes
) VALUES (
  'off-8906136651968', 'High Protein Oats Chocolate', 'Pintola', '8906136651968', ARRAY['gluten', 'milk', 'nuts', 'soybeans'], ARRAY['pintola', 'high', 'protein'], ARRAY['pintola', 'high', 'protein', 'oats', 'chocolate'], 'grain-cereal', 'packaged', 'packaged-food'::public.item_type_enum, 'raw'::public.food_state_enum, 'pan-indian'::public.region_enum,
  50, 392, 25, 54.6, 8, 9.6, 130,
  ARRAY['veg'::public.diet_type_enum, 'nonveg'::public.diet_type_enum], ARRAY['packaged', 'fmcg'], true, 'off-india'::public.source_enum, 'medium'::public.confidence_enum, '2026-05-01', 'Open Food Facts India'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.foods (
  id, name, brand, barcode, allergens, name_alt, search_terms, category_id, subcategory, item_type, state, region,
  default_serving_grams, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sodium_per_100g,
  diet_types, tags, is_processed, source, confidence, last_verified, notes
) VALUES (
  'off-8908010900063', 'Peanut Butter All Natural Creamy Unsweetened', 'Pintola', '8908010900063', NULL, ARRAY['pintola', 'peanut', 'butter'], ARRAY['pintola', 'peanut', 'butter', 'all', 'natural', 'creamy', 'unsweetened'], 'oil-fat', 'packaged', 'packaged-food'::public.item_type_enum, 'raw'::public.food_state_enum, 'pan-indian'::public.region_enum,
  30, 639, 30, 18, 49, 9, 19,
  ARRAY['veg'::public.diet_type_enum, 'nonveg'::public.diet_type_enum], ARRAY['packaged', 'fmcg'], true, 'off-india'::public.source_enum, 'medium'::public.confidence_enum, '2026-05-01', 'Open Food Facts India'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.foods (
  id, name, brand, barcode, allergens, name_alt, search_terms, category_id, subcategory, item_type, state, region,
  default_serving_grams, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sodium_per_100g,
  diet_types, tags, is_processed, source, confidence, last_verified, notes
) VALUES (
  'off-8906136651951', 'Pintola High Protein Oats Dark Chocolate', 'Pintola', '8906136651951', ARRAY['gluten', 'milk', 'nuts', 'soybeans'], ARRAY['pintola', 'pintola', 'high'], ARRAY['pintola', 'pintola', 'high', 'protein', 'oats', 'dark', 'chocolate'], 'grain-cereal', 'packaged', 'packaged-food'::public.item_type_enum, 'raw'::public.food_state_enum, 'pan-indian'::public.region_enum,
  50, 392, 25, 54.6, 8, 9.6, 130,
  ARRAY['veg'::public.diet_type_enum, 'nonveg'::public.diet_type_enum], ARRAY['packaged', 'fmcg'], true, 'off-india'::public.source_enum, 'medium'::public.confidence_enum, '2026-05-01', 'Open Food Facts India'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.foods (
  id, name, brand, barcode, allergens, name_alt, search_terms, category_id, subcategory, item_type, state, region,
  default_serving_grams, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sodium_per_100g,
  diet_types, tags, is_processed, source, confidence, last_verified, notes
) VALUES (
  'off-8908010900971', 'High Protein Peanut Butter Dark Chocolate', 'Pintola', '8908010900971', NULL, ARRAY['pintola', 'high', 'protein'], ARRAY['pintola', 'high', 'protein', 'peanut', 'butter', 'dark', 'chocolate'], 'oil-fat', 'packaged', 'packaged-food'::public.item_type_enum, 'raw'::public.food_state_enum, 'pan-indian'::public.region_enum,
  100, 583, 30, 27, 38, 6.2, 14,
  ARRAY['veg'::public.diet_type_enum, 'nonveg'::public.diet_type_enum], ARRAY['packaged', 'fmcg'], true, 'off-india'::public.source_enum, 'medium'::public.confidence_enum, '2026-05-01', 'Open Food Facts India'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.foods (
  id, name, brand, barcode, allergens, name_alt, search_terms, category_id, subcategory, item_type, state, region,
  default_serving_grams, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sodium_per_100g,
  diet_types, tags, is_processed, source, confidence, last_verified, notes
) VALUES (
  'off-8908010900209', 'Dark chocolate peanut butter creamy', 'Pintola', '8908010900209', ARRAY['peanuts'], ARRAY['pintola', 'dark', 'chocolate'], ARRAY['pintola', 'dark', 'chocolate', 'peanut', 'butter', 'creamy'], 'oil-fat', 'packaged', 'packaged-food'::public.item_type_enum, 'raw'::public.food_state_enum, 'pan-indian'::public.region_enum,
  100, 580, 18.6, 36.4, 40, 5.2, NULL,
  ARRAY['veg'::public.diet_type_enum, 'nonveg'::public.diet_type_enum], ARRAY['packaged', 'fmcg'], true, 'off-india'::public.source_enum, 'medium'::public.confidence_enum, '2026-05-01', 'Open Food Facts India'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.foods (
  id, name, brand, barcode, allergens, name_alt, search_terms, category_id, subcategory, item_type, state, region,
  default_serving_grams, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sodium_per_100g,
  diet_types, tags, is_processed, source, confidence, last_verified, notes
) VALUES (
  'off-8908010900995', 'Pintola High Protien Peanut Butter', 'Pintola', '8908010900995', ARRAY['milk', 'peanuts'], ARRAY['pintola', 'pintola', 'high'], ARRAY['pintola', 'pintola', 'high', 'protien', 'peanut', 'butter'], 'oil-fat', 'packaged', 'packaged-food'::public.item_type_enum, 'raw'::public.food_state_enum, 'pan-indian'::public.region_enum,
  32, 584, 30, 26.9, 38.1, 6.3, 14,
  ARRAY['veg'::public.diet_type_enum, 'nonveg'::public.diet_type_enum], ARRAY['packaged', 'fmcg'], true, 'off-india'::public.source_enum, 'medium'::public.confidence_enum, '2026-05-01', 'Open Food Facts India'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.foods (
  id, name, brand, barcode, allergens, name_alt, search_terms, category_id, subcategory, item_type, state, region,
  default_serving_grams, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sodium_per_100g,
  diet_types, tags, is_processed, source, confidence, last_verified, notes
) VALUES (
  'off-8908010900384', 'Pintola Peanut Butter', 'pintola', '8908010900384', ARRAY['peanuts'], ARRAY['pintola', 'pintola', 'peanut'], ARRAY['pintola', 'pintola', 'peanut', 'butter'], 'oil-fat', 'packaged', 'packaged-food'::public.item_type_enum, 'raw'::public.food_state_enum, 'pan-indian'::public.region_enum,
  16, 639, 30, 18, 49, 9, 19,
  ARRAY['veg'::public.diet_type_enum, 'nonveg'::public.diet_type_enum], ARRAY['packaged', 'fmcg'], true, 'off-india'::public.source_enum, 'medium'::public.confidence_enum, '2026-05-01', 'Open Food Facts India'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.foods (
  id, name, brand, barcode, allergens, name_alt, search_terms, category_id, subcategory, item_type, state, region,
  default_serving_grams, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sodium_per_100g,
  diet_types, tags, is_processed, source, confidence, last_verified, notes
) VALUES (
  'off-8908010900636', 'Pintola Wholegrain brown rice cakes unsalted', 'Pintola', '8908010900636', NULL, ARRAY['pintola', 'pintola', 'wholegrain'], ARRAY['pintola', 'pintola', 'wholegrain', 'brown', 'rice', 'cakes', 'unsalted'], 'packaged-food', 'packaged', 'packaged-food'::public.item_type_enum, 'raw'::public.food_state_enum, 'pan-indian'::public.region_enum,
  100, 378, 7.9, 81, 2.2, 7.1, NULL,
  ARRAY['veg'::public.diet_type_enum, 'nonveg'::public.diet_type_enum], ARRAY['packaged', 'fmcg'], true, 'off-india'::public.source_enum, 'medium'::public.confidence_enum, '2026-05-01', 'Open Food Facts India'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.foods (
  id, name, brand, barcode, allergens, name_alt, search_terms, category_id, subcategory, item_type, state, region,
  default_serving_grams, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sodium_per_100g,
  diet_types, tags, is_processed, source, confidence, last_verified, notes
) VALUES (
  'off-8904327600924', 'Myfitness Peanut Butter', 'Myfitness', '8904327600924', NULL, ARRAY['myfitness', 'myfitness', 'peanut'], ARRAY['myfitness', 'myfitness', 'peanut', 'butter'], 'oil-fat', 'packaged', 'packaged-food'::public.item_type_enum, 'raw'::public.food_state_enum, 'pan-indian'::public.region_enum,
  32, 637, 23, 24, 50, 9, 54,
  ARRAY['veg'::public.diet_type_enum, 'nonveg'::public.diet_type_enum], ARRAY['packaged', 'fmcg'], true, 'off-india'::public.source_enum, 'medium'::public.confidence_enum, '2026-05-01', 'Open Food Facts India'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.foods (
  id, name, brand, barcode, allergens, name_alt, search_terms, category_id, subcategory, item_type, state, region,
  default_serving_grams, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sodium_per_100g,
  diet_types, tags, is_processed, source, confidence, last_verified, notes
) VALUES (
  'off-8904327600351', 'Chocolate Peanut butter smooth', 'Myfitness', '8904327600351', ARRAY['peanuts'], ARRAY['myfitness', 'chocolate', 'peanut'], ARRAY['myfitness', 'chocolate', 'peanut', 'butter', 'smooth'], 'oil-fat', 'packaged', 'packaged-food'::public.item_type_enum, 'raw'::public.food_state_enum, 'pan-indian'::public.region_enum,
  32, 628, 28.1, 17.5, 49.4, 8.4, 434,
  ARRAY['veg'::public.diet_type_enum, 'nonveg'::public.diet_type_enum], ARRAY['packaged', 'fmcg'], true, 'off-india'::public.source_enum, 'medium'::public.confidence_enum, '2026-05-01', 'Open Food Facts India'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.foods (
  id, name, brand, barcode, allergens, name_alt, search_terms, category_id, subcategory, item_type, state, region,
  default_serving_grams, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sodium_per_100g,
  diet_types, tags, is_processed, source, confidence, last_verified, notes
) VALUES (
  'off-8904327600436', 'Peanut butter - Chocolate', 'MyFitness', '8904327600436', NULL, ARRAY['myfitness', 'peanut', 'butter'], ARRAY['myfitness', 'peanut', 'butter', '-', 'chocolate'], 'oil-fat', 'packaged', 'packaged-food'::public.item_type_enum, 'raw'::public.food_state_enum, 'pan-indian'::public.region_enum,
  100, 640, 22, 22, 52, 0, NULL,
  ARRAY['veg'::public.diet_type_enum, 'nonveg'::public.diet_type_enum], ARRAY['packaged', 'fmcg'], true, 'off-india'::public.source_enum, 'medium'::public.confidence_enum, '2026-05-01', 'Open Food Facts India'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.foods (
  id, name, brand, barcode, allergens, name_alt, search_terms, category_id, subcategory, item_type, state, region,
  default_serving_grams, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sodium_per_100g,
  diet_types, tags, is_processed, source, confidence, last_verified, notes
) VALUES (
  'off-8904327600955', 'MYFITNESS Peanut Butter - Chocolate', 'MYFITNESS', '8904327600955', ARRAY['gluten', 'milk', 'peanuts'], ARRAY['myfitness', 'myfitness', 'peanut'], ARRAY['myfitness', 'myfitness', 'peanut', 'butter', '-', 'chocolate'], 'oil-fat', 'packaged', 'packaged-food'::public.item_type_enum, 'raw'::public.food_state_enum, 'pan-indian'::public.region_enum,
  16, 201, 8.4, 7.1, 15.4, 0, 48,
  ARRAY['veg'::public.diet_type_enum, 'nonveg'::public.diet_type_enum], ARRAY['packaged', 'fmcg'], true, 'off-india'::public.source_enum, 'medium'::public.confidence_enum, '2026-05-01', 'Open Food Facts India'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.foods (
  id, name, brand, barcode, allergens, name_alt, search_terms, category_id, subcategory, item_type, state, region,
  default_serving_grams, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sodium_per_100g,
  diet_types, tags, is_processed, source, confidence, last_verified, notes
) VALUES (
  'off-8904327601969', 'Dark Chocolate Peanut Butter with added Whey', 'Myfitness', '8904327601969', ARRAY['milk', 'peanuts'], ARRAY['myfitness', 'dark', 'chocolate'], ARRAY['myfitness', 'dark', 'chocolate', 'peanut', 'butter', 'with', 'added', 'whey'], 'oil-fat', 'packaged', 'packaged-food'::public.item_type_enum, 'raw'::public.food_state_enum, 'pan-indian'::public.region_enum,
  32, 638, 25, 21.9, 50, 6.3, 69,
  ARRAY['veg'::public.diet_type_enum, 'nonveg'::public.diet_type_enum], ARRAY['packaged', 'fmcg'], true, 'off-india'::public.source_enum, 'medium'::public.confidence_enum, '2026-05-01', 'Open Food Facts India'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.foods (
  id, name, brand, barcode, allergens, name_alt, search_terms, category_id, subcategory, item_type, state, region,
  default_serving_grams, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sodium_per_100g,
  diet_types, tags, is_processed, source, confidence, last_verified, notes
) VALUES (
  'off-8904327600696', 'Chocolate Peanut Butter - Almond Crunch', 'MYFITNESS', '8904327600696', NULL, ARRAY['myfitness', 'chocolate', 'peanut'], ARRAY['myfitness', 'chocolate', 'peanut', 'butter', '-', 'almond', 'crunch'], 'packaged-food', 'packaged', 'packaged-food'::public.item_type_enum, 'raw'::public.food_state_enum, 'pan-indian'::public.region_enum,
  32, 634, 21.9, 25, 50, 9.4, 97,
  ARRAY['veg'::public.diet_type_enum, 'nonveg'::public.diet_type_enum], ARRAY['packaged', 'fmcg'], true, 'off-india'::public.source_enum, 'medium'::public.confidence_enum, '2026-05-01', 'Open Food Facts India'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.foods (
  id, name, brand, barcode, allergens, name_alt, search_terms, category_id, subcategory, item_type, state, region,
  default_serving_grams, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sodium_per_100g,
  diet_types, tags, is_processed, source, confidence, last_verified, notes
) VALUES (
  'off-8904327600399', 'Myfitness Peanut butter', 'Myfitness', '8904327600399', ARRAY['peanuts'], ARRAY['myfitness', 'myfitness', 'peanut'], ARRAY['myfitness', 'myfitness', 'peanut', 'butter'], 'oil-fat', 'packaged', 'packaged-food'::public.item_type_enum, 'raw'::public.food_state_enum, 'pan-indian'::public.region_enum,
  32, 625, 26, 19, 50, 5, 350,
  ARRAY['veg'::public.diet_type_enum, 'nonveg'::public.diet_type_enum], ARRAY['packaged', 'fmcg'], true, 'off-india'::public.source_enum, 'medium'::public.confidence_enum, '2026-05-01', 'Open Food Facts India'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.foods (
  id, name, brand, barcode, allergens, name_alt, search_terms, category_id, subcategory, item_type, state, region,
  default_serving_grams, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sodium_per_100g,
  diet_types, tags, is_processed, source, confidence, last_verified, notes
) VALUES (
  'off-8904327600382', 'Myfitness Original Peanut Butter (Smooth)', 'Myfitness', '8904327600382', ARRAY['peanuts'], ARRAY['myfitness', 'myfitness', 'original'], ARRAY['myfitness', 'myfitness', 'original', 'peanut', 'butter', '(smooth)'], 'oil-fat', 'packaged', 'packaged-food'::public.item_type_enum, 'raw'::public.food_state_enum, 'pan-indian'::public.region_enum,
  32, 625, 25, 18.8, 50, 6.3, 350,
  ARRAY['veg'::public.diet_type_enum, 'nonveg'::public.diet_type_enum], ARRAY['packaged', 'fmcg'], true, 'off-india'::public.source_enum, 'medium'::public.confidence_enum, '2026-05-01', 'Open Food Facts India'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.foods (
  id, name, brand, barcode, allergens, name_alt, search_terms, category_id, subcategory, item_type, state, region,
  default_serving_grams, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sodium_per_100g,
  diet_types, tags, is_processed, source, confidence, last_verified, notes
) VALUES (
  'off-8904327601914', 'MYFITNESS Peanut Butter Smooth - Dark Chocolate', 'MYFITNESS', '8904327601914', ARRAY['milk', 'peanuts', 'soybeans'], ARRAY['myfitness', 'myfitness', 'peanut'], ARRAY['myfitness', 'myfitness', 'peanut', 'butter', 'smooth', '-', 'dark', 'chocolate'], 'oil-fat', 'packaged', 'packaged-food'::public.item_type_enum, 'raw'::public.food_state_enum, 'pan-indian'::public.region_enum,
  32, 638, 31.3, 21.9, 50, 6.3, 69,
  ARRAY['veg'::public.diet_type_enum, 'nonveg'::public.diet_type_enum], ARRAY['packaged', 'fmcg'], true, 'off-india'::public.source_enum, 'medium'::public.confidence_enum, '2026-05-01', 'Open Food Facts India'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.foods (
  id, name, brand, barcode, allergens, name_alt, search_terms, category_id, subcategory, item_type, state, region,
  default_serving_grams, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sodium_per_100g,
  diet_types, tags, is_processed, source, confidence, last_verified, notes
) VALUES (
  'off-8904327600788', 'Peanut Butter (Coffee Flavour)', 'MyFitness', '8904327600788', NULL, ARRAY['myfitness', 'peanut', 'butter'], ARRAY['myfitness', 'peanut', 'butter', '(coffee', 'flavour)'], 'packaged-food', 'packaged', 'packaged-food'::public.item_type_enum, 'raw'::public.food_state_enum, 'pan-indian'::public.region_enum,
  32, 205, 8, 6, 16, 2, 9,
  ARRAY['veg'::public.diet_type_enum, 'nonveg'::public.diet_type_enum], ARRAY['packaged', 'fmcg'], true, 'off-india'::public.source_enum, 'medium'::public.confidence_enum, '2026-05-01', 'Open Food Facts India'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.foods (
  id, name, brand, barcode, allergens, name_alt, search_terms, category_id, subcategory, item_type, state, region,
  default_serving_grams, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sodium_per_100g,
  diet_types, tags, is_processed, source, confidence, last_verified, notes
) VALUES (
  'off-8906127550010', 'Natural Peanut Butter Crunch', 'ALPINO', '8906127550010', ARRAY['peanuts'], ARRAY['alpino', 'natural', 'peanut'], ARRAY['alpino', 'natural', 'peanut', 'butter', 'crunch'], 'oil-fat', 'packaged', 'packaged-food'::public.item_type_enum, 'raw'::public.food_state_enum, 'pan-indian'::public.region_enum,
  100, 625, 30, 18, 49, 6, 25,
  ARRAY['veg'::public.diet_type_enum, 'nonveg'::public.diet_type_enum], ARRAY['packaged', 'fmcg'], true, 'off-india'::public.source_enum, 'medium'::public.confidence_enum, '2026-05-01', 'Open Food Facts India'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.foods (
  id, name, brand, barcode, allergens, name_alt, search_terms, category_id, subcategory, item_type, state, region,
  default_serving_grams, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sodium_per_100g,
  diet_types, tags, is_processed, source, confidence, last_verified, notes
) VALUES (
  'off-8906127551086', 'Alpino Super Oats Chocolate', 'Alpino', '8906127551086', ARRAY['nuts', 'peanuts', 'soybeans'], ARRAY['alpino', 'alpino', 'super'], ARRAY['alpino', 'alpino', 'super', 'oats', 'chocolate'], 'grain-cereal', 'packaged', 'packaged-food'::public.item_type_enum, 'raw'::public.food_state_enum, 'pan-indian'::public.region_enum,
  40, 445, 22, 52.2, 16.4, 11.3, 11,
  ARRAY['veg'::public.diet_type_enum, 'nonveg'::public.diet_type_enum], ARRAY['packaged', 'fmcg'], true, 'off-india'::public.source_enum, 'medium'::public.confidence_enum, '2026-05-01', 'Open Food Facts India'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.foods (
  id, name, brand, barcode, allergens, name_alt, search_terms, category_id, subcategory, item_type, state, region,
  default_serving_grams, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sodium_per_100g,
  diet_types, tags, is_processed, source, confidence, last_verified, notes
) VALUES (
  'off-8906127551437', 'high protein super oats', 'Alpino', '8906127551437', NULL, ARRAY['alpino', 'high', 'protein'], ARRAY['alpino', 'high', 'protein', 'super', 'oats'], 'grain-cereal', 'packaged', 'packaged-food'::public.item_type_enum, 'raw'::public.food_state_enum, 'pan-indian'::public.region_enum,
  100, 458, 22, 51.3, 18.6, 11, 13240,
  ARRAY['veg'::public.diet_type_enum, 'nonveg'::public.diet_type_enum], ARRAY['packaged', 'fmcg'], true, 'off-india'::public.source_enum, 'medium'::public.confidence_enum, '2026-05-01', 'Open Food Facts India'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.foods (
  id, name, brand, barcode, allergens, name_alt, search_terms, category_id, subcategory, item_type, state, region,
  default_serving_grams, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sodium_per_100g,
  diet_types, tags, is_processed, source, confidence, last_verified, notes
) VALUES (
  'off-8906127550294', 'Alpino unsweetened super oats', 'Alpino', '8906127550294', ARRAY['gluten', 'peanuts'], ARRAY['alpino', 'alpino', 'unsweetened'], ARRAY['alpino', 'alpino', 'unsweetened', 'super', 'oats'], 'grain-cereal', 'packaged', 'packaged-food'::public.item_type_enum, 'raw'::public.food_state_enum, 'pan-indian'::public.region_enum,
  40, 480, 24, 55.1, 19.5, 18, 38,
  ARRAY['veg'::public.diet_type_enum, 'nonveg'::public.diet_type_enum], ARRAY['packaged', 'fmcg'], true, 'off-india'::public.source_enum, 'medium'::public.confidence_enum, '2026-05-01', 'Open Food Facts India'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.foods (
  id, name, brand, barcode, allergens, name_alt, search_terms, category_id, subcategory, item_type, state, region,
  default_serving_grams, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sodium_per_100g,
  diet_types, tags, is_processed, source, confidence, last_verified, notes
) VALUES (
  'off-8906127551161', 'SUPER MUESLI Chocolate', 'Alpino', '8906127551161', ARRAY['gluten', 'milk', 'nuts', 'sulphur-dioxide-and-sulphites', 'nuts-almond-peanuts'], ARRAY['alpino', 'super', 'muesli'], ARRAY['alpino', 'super', 'muesli', 'chocolate'], 'grain-cereal', 'packaged', 'packaged-food'::public.item_type_enum, 'raw'::public.food_state_enum, 'pan-indian'::public.region_enum,
  40, 410, 18, 69.1, 6.9, 16.6, 394,
  ARRAY['veg'::public.diet_type_enum, 'nonveg'::public.diet_type_enum], ARRAY['packaged', 'fmcg'], true, 'off-india'::public.source_enum, 'medium'::public.confidence_enum, '2026-05-01', 'Open Food Facts India'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.foods (
  id, name, brand, barcode, allergens, name_alt, search_terms, category_id, subcategory, item_type, state, region,
  default_serving_grams, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sodium_per_100g,
  diet_types, tags, is_processed, source, confidence, last_verified, notes
) VALUES (
  'off-8906127550126', 'Chocolate Peanut Butter Smooth', 'Alpino', '8906127550126', ARRAY['peanuts'], ARRAY['alpino', 'chocolate', 'peanut'], ARRAY['alpino', 'chocolate', 'peanut', 'butter', 'smooth'], 'oil-fat', 'packaged', 'packaged-food'::public.item_type_enum, 'raw'::public.food_state_enum, 'pan-indian'::public.region_enum,
  32, 591, 26, 16, 47, 7, 70,
  ARRAY['veg'::public.diet_type_enum, 'nonveg'::public.diet_type_enum], ARRAY['packaged', 'fmcg'], true, 'off-india'::public.source_enum, 'medium'::public.confidence_enum, '2026-05-01', 'Open Food Facts India'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.foods (
  id, name, brand, barcode, allergens, name_alt, search_terms, category_id, subcategory, item_type, state, region,
  default_serving_grams, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sodium_per_100g,
  diet_types, tags, is_processed, source, confidence, last_verified, notes
) VALUES (
  'off-8906127551178', 'Alpino Super Muesli', 'Alpino', '8906127551178', NULL, ARRAY['alpino', 'alpino', 'super'], ARRAY['alpino', 'alpino', 'super', 'muesli'], 'grain-cereal', 'packaged', 'packaged-food'::public.item_type_enum, 'raw'::public.food_state_enum, 'pan-indian'::public.region_enum,
  100, 395, 16, 70, 5.7, 9, 307,
  ARRAY['veg'::public.diet_type_enum, 'nonveg'::public.diet_type_enum], ARRAY['packaged', 'fmcg'], true, 'off-india'::public.source_enum, 'medium'::public.confidence_enum, '2026-05-01', 'Open Food Facts India'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.foods (
  id, name, brand, barcode, allergens, name_alt, search_terms, category_id, subcategory, item_type, state, region,
  default_serving_grams, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sodium_per_100g,
  diet_types, tags, is_processed, source, confidence, last_verified, notes
) VALUES (
  'off-8906127551338', 'Peanut Protein Dark Chocolate', 'Alpino', '8906127551338', NULL, ARRAY['alpino', 'peanut', 'protein'], ARRAY['alpino', 'peanut', 'protein', 'dark', 'chocolate'], 'packaged-food', 'packaged', 'packaged-food'::public.item_type_enum, 'raw'::public.food_state_enum, 'pan-indian'::public.region_enum,
  36, 407, 67.5, 19.6, 5, 3.3, 3,
  ARRAY['veg'::public.diet_type_enum, 'nonveg'::public.diet_type_enum], ARRAY['packaged', 'fmcg'], true, 'off-india'::public.source_enum, 'medium'::public.confidence_enum, '2026-05-01', 'Open Food Facts India'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.foods (
  id, name, brand, barcode, allergens, name_alt, search_terms, category_id, subcategory, item_type, state, region,
  default_serving_grams, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sodium_per_100g,
  diet_types, tags, is_processed, source, confidence, last_verified, notes
) VALUES (
  'off-8906127551642', 'Supernatural Peanut Protein Powder Kesar Mango', 'Alpino', '8906127551642', NULL, ARRAY['alpino', 'supernatural', 'peanut'], ARRAY['alpino', 'supernatural', 'peanut', 'protein', 'powder', 'kesar', 'mango'], 'packaged-food', 'packaged', 'packaged-food'::public.item_type_enum, 'raw'::public.food_state_enum, 'pan-indian'::public.region_enum,
  37, 364, 68.4, 17.3, 5.1, 3.5, 156,
  ARRAY['veg'::public.diet_type_enum, 'nonveg'::public.diet_type_enum], ARRAY['packaged', 'fmcg'], true, 'off-india'::public.source_enum, 'medium'::public.confidence_enum, '2026-05-01', 'Open Food Facts India'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.foods (
  id, name, brand, barcode, allergens, name_alt, search_terms, category_id, subcategory, item_type, state, region,
  default_serving_grams, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sodium_per_100g,
  diet_types, tags, is_processed, source, confidence, last_verified, notes
) VALUES (
  'off-8906127551703', 'Oats - Classic Coffee', 'Alpino', '8906127551703', ARRAY['peanuts', 'soybeans'], ARRAY['alpino', 'oats', '-'], ARRAY['alpino', 'oats', '-', 'classic', 'coffee'], 'drink', 'packaged', 'packaged-food'::public.item_type_enum, 'raw'::public.food_state_enum, 'pan-indian'::public.region_enum,
  40, 394, 24, 43, 14, 11, 45,
  ARRAY['veg'::public.diet_type_enum, 'nonveg'::public.diet_type_enum], ARRAY['packaged', 'fmcg'], true, 'off-india'::public.source_enum, 'medium'::public.confidence_enum, '2026-05-01', 'Open Food Facts India'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.foods (
  id, name, brand, barcode, allergens, name_alt, search_terms, category_id, subcategory, item_type, state, region,
  default_serving_grams, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sodium_per_100g,
  diet_types, tags, is_processed, source, confidence, last_verified, notes
) VALUES (
  'off-8906059636936', 'Epigamia Everyday Yogurt Mango', 'Epigamia', '8906059636936', ARRAY['gluten', 'milk'], ARRAY['epigamia', 'epigamia', 'everyday'], ARRAY['epigamia', 'epigamia', 'everyday', 'yogurt', 'mango'], 'dairy', 'packaged', 'packaged-food'::public.item_type_enum, 'raw'::public.food_state_enum, 'pan-indian'::public.region_enum,
  75, 95, 4, 17.3, 1.3, 0, 59,
  ARRAY['veg'::public.diet_type_enum, 'nonveg'::public.diet_type_enum], ARRAY['packaged', 'fmcg'], true, 'off-india'::public.source_enum, 'medium'::public.confidence_enum, '2026-05-01', 'Open Food Facts India'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.foods (
  id, name, brand, barcode, allergens, name_alt, search_terms, category_id, subcategory, item_type, state, region,
  default_serving_grams, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sodium_per_100g,
  diet_types, tags, is_processed, source, confidence, last_verified, notes
) VALUES (
  'off-8906059635069', 'Greek yogurt wild raspberry', 'Epigamia', '8906059635069', NULL, ARRAY['epigamia', 'greek', 'yogurt'], ARRAY['epigamia', 'greek', 'yogurt', 'wild', 'raspberry'], 'dairy', 'packaged', 'packaged-food'::public.item_type_enum, 'raw'::public.food_state_enum, 'pan-indian'::public.region_enum,
  85, 94, 6.5, 12.9, 1.9, 0, 52,
  ARRAY['veg'::public.diet_type_enum, 'nonveg'::public.diet_type_enum], ARRAY['packaged', 'fmcg'], true, 'off-india'::public.source_enum, 'medium'::public.confidence_enum, '2026-05-01', 'Open Food Facts India'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.foods (
  id, name, brand, barcode, allergens, name_alt, search_terms, category_id, subcategory, item_type, state, region,
  default_serving_grams, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sodium_per_100g,
  diet_types, tags, is_processed, source, confidence, last_verified, notes
) VALUES (
  'off-8906059636639', 'Epigamia turbo protein shake', 'Epigamia', '8906059636639', NULL, ARRAY['epigamia', 'epigamia', 'turbo'], ARRAY['epigamia', 'epigamia', 'turbo', 'protein', 'shake'], 'packaged-food', 'packaged', 'packaged-food'::public.item_type_enum, 'raw'::public.food_state_enum, 'pan-indian'::public.region_enum,
  250, 56, 10, 3.6, 0.1, 0, 98,
  ARRAY['veg'::public.diet_type_enum, 'nonveg'::public.diet_type_enum], ARRAY['packaged', 'fmcg'], true, 'off-india'::public.source_enum, 'medium'::public.confidence_enum, '2026-05-01', 'Open Food Facts India'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.foods (
  id, name, brand, barcode, allergens, name_alt, search_terms, category_id, subcategory, item_type, state, region,
  default_serving_grams, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sodium_per_100g,
  diet_types, tags, is_processed, source, confidence, last_verified, notes
) VALUES (
  'off-8906059637285', 'Turbo Protein Milkshake', 'Epigamia', '8906059637285', NULL, ARRAY['epigamia', 'turbo', 'protein'], ARRAY['epigamia', 'turbo', 'protein', 'milkshake'], 'dairy', 'packaged', 'packaged-food'::public.item_type_enum, 'raw'::public.food_state_enum, 'pan-indian'::public.region_enum,
  100, 55, 10, 3.6, 0.1, 0, 84,
  ARRAY['veg'::public.diet_type_enum, 'nonveg'::public.diet_type_enum], ARRAY['packaged', 'fmcg'], true, 'off-india'::public.source_enum, 'medium'::public.confidence_enum, '2026-05-01', 'Open Food Facts India'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.foods (
  id, name, brand, barcode, allergens, name_alt, search_terms, category_id, subcategory, item_type, state, region,
  default_serving_grams, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sodium_per_100g,
  diet_types, tags, is_processed, source, confidence, last_verified, notes
) VALUES (
  'off-8906059639890', 'Chocolate Milk Shake', 'Epigamia', '8906059639890', ARRAY['milk'], ARRAY['epigamia', 'chocolate', 'milk'], ARRAY['epigamia', 'chocolate', 'milk', 'shake'], 'dairy', 'packaged', 'packaged-food'::public.item_type_enum, 'raw'::public.food_state_enum, 'pan-indian'::public.region_enum,
  100, 80, 3.3, 16.1, 0.3, 0, 50,
  ARRAY['veg'::public.diet_type_enum, 'nonveg'::public.diet_type_enum], ARRAY['packaged', 'fmcg'], true, 'off-india'::public.source_enum, 'medium'::public.confidence_enum, '2026-05-01', 'Open Food Facts India'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.foods (
  id, name, brand, barcode, allergens, name_alt, search_terms, category_id, subcategory, item_type, state, region,
  default_serving_grams, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sodium_per_100g,
  diet_types, tags, is_processed, source, confidence, last_verified, notes
) VALUES (
  'off-8906059636264', 'Greek Yoghurt Zero Added Sugar Mixed Berries', 'Epigamia', '8906059636264', NULL, ARRAY['epigamia', 'greek', 'yoghurt'], ARRAY['epigamia', 'greek', 'yoghurt', 'zero', 'added', 'sugar', 'mixed', 'berries'], 'dairy', 'packaged', 'packaged-food'::public.item_type_enum, 'raw'::public.food_state_enum, 'pan-indian'::public.region_enum,
  110, 90, 7, 11, 2.2, 0, 59,
  ARRAY['veg'::public.diet_type_enum, 'nonveg'::public.diet_type_enum], ARRAY['packaged', 'fmcg'], true, 'off-india'::public.source_enum, 'medium'::public.confidence_enum, '2026-05-01', 'Open Food Facts India'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.foods (
  id, name, brand, barcode, allergens, name_alt, search_terms, category_id, subcategory, item_type, state, region,
  default_serving_grams, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sodium_per_100g,
  diet_types, tags, is_processed, source, confidence, last_verified, notes
) VALUES (
  'off-8906059636912', 'Everyday Yogurt', 'Epigamia', '8906059636912', NULL, ARRAY['epigamia', 'everyday', 'yogurt'], ARRAY['epigamia', 'everyday', 'yogurt'], 'dairy', 'packaged', 'packaged-food'::public.item_type_enum, 'raw'::public.food_state_enum, 'pan-indian'::public.region_enum,
  75, 95, 4, 17.3, 1.3, 0, 59,
  ARRAY['veg'::public.diet_type_enum, 'nonveg'::public.diet_type_enum], ARRAY['packaged', 'fmcg'], true, 'off-india'::public.source_enum, 'medium'::public.confidence_enum, '2026-05-01', 'Open Food Facts India'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.foods (
  id, name, brand, barcode, allergens, name_alt, search_terms, category_id, subcategory, item_type, state, region,
  default_serving_grams, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sodium_per_100g,
  diet_types, tags, is_processed, source, confidence, last_verified, notes
) VALUES (
  'off-8906059635014', 'Greek Yogurt Mango Flavour', 'Epigamia', '8906059635014', NULL, ARRAY['epigamia', 'greek', 'yogurt'], ARRAY['epigamia', 'greek', 'yogurt', 'mango', 'flavour'], 'dairy', 'packaged', 'packaged-food'::public.item_type_enum, 'raw'::public.food_state_enum, 'pan-indian'::public.region_enum,
  85, 100, 6.1, 14.1, 1.6, 0, 47,
  ARRAY['veg'::public.diet_type_enum, 'nonveg'::public.diet_type_enum], ARRAY['packaged', 'fmcg'], true, 'off-india'::public.source_enum, 'medium'::public.confidence_enum, '2026-05-01', 'Open Food Facts India'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.foods (
  id, name, brand, barcode, allergens, name_alt, search_terms, category_id, subcategory, item_type, state, region,
  default_serving_grams, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sodium_per_100g,
  diet_types, tags, is_processed, source, confidence, last_verified, notes
) VALUES (
  'off-8906059635021', 'Epigamia Greek Yogurt Strawberry', 'epigamia', '8906059635021', NULL, ARRAY['epigamia', 'epigamia', 'greek'], ARRAY['epigamia', 'epigamia', 'greek', 'yogurt', 'strawberry'], 'dairy', 'packaged', 'packaged-food'::public.item_type_enum, 'raw'::public.food_state_enum, 'pan-indian'::public.region_enum,
  120, 111, 6.3, 17, 2, 0, NULL,
  ARRAY['veg'::public.diet_type_enum, 'nonveg'::public.diet_type_enum], ARRAY['packaged', 'fmcg'], true, 'off-india'::public.source_enum, 'medium'::public.confidence_enum, '2026-05-01', 'Open Food Facts India'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.foods (
  id, name, brand, barcode, allergens, name_alt, search_terms, category_id, subcategory, item_type, state, region,
  default_serving_grams, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sodium_per_100g,
  diet_types, tags, is_processed, source, confidence, last_verified, notes
) VALUES (
  'off-8906059636752', 'epigamia TURBO 50g protein yogurt', 'epigamia', '8906059636752', NULL, ARRAY['epigamia', 'epigamia', 'turbo'], ARRAY['epigamia', 'epigamia', 'turbo', '50g', 'protein', 'yogurt'], 'dairy', 'packaged', 'packaged-food'::public.item_type_enum, 'raw'::public.food_state_enum, 'pan-indian'::public.region_enum,
  100, 65, 12, 4, 0.1, 0, NULL,
  ARRAY['veg'::public.diet_type_enum, 'nonveg'::public.diet_type_enum], ARRAY['packaged', 'fmcg'], true, 'off-india'::public.source_enum, 'medium'::public.confidence_enum, '2026-05-01', 'Open Food Facts India'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.foods (
  id, name, brand, barcode, allergens, name_alt, search_terms, category_id, subcategory, item_type, state, region,
  default_serving_grams, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sodium_per_100g,
  diet_types, tags, is_processed, source, confidence, last_verified, notes
) VALUES (
  'off-8901262010016', 'Amul Pasteurized Butter', 'Amul', '8901262010016', ARRAY['milk'], ARRAY['amul', 'amul', 'pasteurized'], ARRAY['amul', 'amul', 'pasteurized', 'butter'], 'dairy', 'packaged', 'packaged-food'::public.item_type_enum, 'raw'::public.food_state_enum, 'pan-indian'::public.region_enum,
  100, 714, 0, 0, 78.6, 0, 821,
  ARRAY['veg'::public.diet_type_enum, 'nonveg'::public.diet_type_enum], ARRAY['packaged', 'fmcg'], true, 'off-india'::public.source_enum, 'medium'::public.confidence_enum, '2026-05-01', 'Open Food Facts India'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.foods (
  id, name, brand, barcode, allergens, name_alt, search_terms, category_id, subcategory, item_type, state, region,
  default_serving_grams, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sodium_per_100g,
  diet_types, tags, is_processed, source, confidence, last_verified, notes
) VALUES (
  'off-8901262200196', 'Amul Masti Spiced Buttermilk 200ml', 'Amul', '8901262200196', ARRAY['milk'], ARRAY['amul', 'amul', 'masti'], ARRAY['amul', 'amul', 'masti', 'spiced', 'buttermilk', '200ml'], 'dairy', 'packaged', 'packaged-food'::public.item_type_enum, 'raw'::public.food_state_enum, 'pan-indian'::public.region_enum,
  100, 29, 1.5, 1.8, 1.5, 0, 250,
  ARRAY['veg'::public.diet_type_enum, 'nonveg'::public.diet_type_enum], ARRAY['packaged', 'fmcg'], true, 'off-india'::public.source_enum, 'medium'::public.confidence_enum, '2026-05-01', 'Open Food Facts India'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.foods (
  id, name, brand, barcode, allergens, name_alt, search_terms, category_id, subcategory, item_type, state, region,
  default_serving_grams, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sodium_per_100g,
  diet_types, tags, is_processed, source, confidence, last_verified, notes
) VALUES (
  'off-8901262260121', 'Amul Taaza Milky Milk', 'Amul taaza', '8901262260121', ARRAY['milk'], ARRAY['amul taaza', 'amul', 'taaza'], ARRAY['amul taaza', 'amul', 'taaza', 'milky', 'milk'], 'dairy', 'packaged', 'packaged-food'::public.item_type_enum, 'raw'::public.food_state_enum, 'pan-indian'::public.region_enum,
  100, 29, 1.5, 2.4, 1.5, 0, 20,
  ARRAY['veg'::public.diet_type_enum, 'nonveg'::public.diet_type_enum], ARRAY['packaged', 'fmcg'], true, 'off-india'::public.source_enum, 'medium'::public.confidence_enum, '2026-05-01', 'Open Food Facts India'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.foods (
  id, name, brand, barcode, allergens, name_alt, search_terms, category_id, subcategory, item_type, state, region,
  default_serving_grams, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sodium_per_100g,
  diet_types, tags, is_processed, source, confidence, last_verified, notes
) VALUES (
  'off-8901262070546', 'Chocominis', 'Amul', '8901262070546', ARRAY['milk'], ARRAY['amul', 'chocominis'], ARRAY['amul', 'chocominis'], 'dairy', 'packaged', 'packaged-food'::public.item_type_enum, 'raw'::public.food_state_enum, 'pan-indian'::public.region_enum,
  10, 526, 5.3, 61.1, 29.3, 0, 60,
  ARRAY['veg'::public.diet_type_enum, 'nonveg'::public.diet_type_enum], ARRAY['packaged', 'fmcg'], true, 'off-india'::public.source_enum, 'medium'::public.confidence_enum, '2026-05-01', 'Open Food Facts India'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.foods (
  id, name, brand, barcode, allergens, name_alt, search_terms, category_id, subcategory, item_type, state, region,
  default_serving_grams, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sodium_per_100g,
  diet_types, tags, is_processed, source, confidence, last_verified, notes
) VALUES (
  'off-8901262180115', 'malai paneer fresh', 'Amul', '8901262180115', ARRAY['milk'], ARRAY['amul', 'malai', 'paneer'], ARRAY['amul', 'malai', 'paneer', 'fresh'], 'dairy', 'packaged', 'packaged-food'::public.item_type_enum, 'raw'::public.food_state_enum, 'pan-indian'::public.region_enum,
  50, 312, 20, 4, 24, 0, 10,
  ARRAY['veg'::public.diet_type_enum, 'nonveg'::public.diet_type_enum], ARRAY['packaged', 'fmcg'], true, 'off-india'::public.source_enum, 'medium'::public.confidence_enum, '2026-05-01', 'Open Food Facts India'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.foods (
  id, name, brand, barcode, allergens, name_alt, search_terms, category_id, subcategory, item_type, state, region,
  default_serving_grams, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sodium_per_100g,
  diet_types, tags, is_processed, source, confidence, last_verified, notes
) VALUES (
  'off-8901262200189', 'Amul Lassi 200ml', 'Amul', '8901262200189', ARRAY['milk'], ARRAY['amul', 'amul', 'lassi'], ARRAY['amul', 'amul', 'lassi', '200ml'], 'dairy', 'packaged', 'packaged-food'::public.item_type_enum, 'raw'::public.food_state_enum, 'pan-indian'::public.region_enum,
  100, 89, 2.1, 14.5, 2.1, 0, 30,
  ARRAY['veg'::public.diet_type_enum, 'nonveg'::public.diet_type_enum], ARRAY['packaged', 'fmcg'], true, 'off-india'::public.source_enum, 'medium'::public.confidence_enum, '2026-05-01', 'Open Food Facts India'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.foods (
  id, name, brand, barcode, allergens, name_alt, search_terms, category_id, subcategory, item_type, state, region,
  default_serving_grams, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sodium_per_100g,
  diet_types, tags, is_processed, source, confidence, last_verified, notes
) VALUES (
  'off-8901262020039', 'Amul cheese', 'Amul', '8901262020039', ARRAY['milk'], ARRAY['amul', 'amul', 'cheese'], ARRAY['amul', 'amul', 'cheese'], 'dairy', 'packaged', 'packaged-food'::public.item_type_enum, 'raw'::public.food_state_enum, 'pan-indian'::public.region_enum,
  25, 320, 20, 0, 28, 0, 1400,
  ARRAY['veg'::public.diet_type_enum, 'nonveg'::public.diet_type_enum], ARRAY['packaged', 'fmcg'], true, 'off-india'::public.source_enum, 'medium'::public.confidence_enum, '2026-05-01', 'Open Food Facts India'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.foods (
  id, name, brand, barcode, allergens, name_alt, search_terms, category_id, subcategory, item_type, state, region,
  default_serving_grams, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sodium_per_100g,
  diet_types, tags, is_processed, source, confidence, last_verified, notes
) VALUES (
  'off-8901262020015', 'Cheese slices', 'Amul', '8901262020015', ARRAY['milk'], ARRAY['amul', 'cheese', 'slices'], ARRAY['amul', 'cheese', 'slices'], 'dairy', 'packaged', 'packaged-food'::public.item_type_enum, 'raw'::public.food_state_enum, 'pan-indian'::public.region_enum,
  20, 311, 20, 1.5, 25, 0, 1200,
  ARRAY['veg'::public.diet_type_enum, 'nonveg'::public.diet_type_enum], ARRAY['packaged', 'fmcg'], true, 'off-india'::public.source_enum, 'medium'::public.confidence_enum, '2026-05-01', 'Open Food Facts India'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.foods (
  id, name, brand, barcode, allergens, name_alt, search_terms, category_id, subcategory, item_type, state, region,
  default_serving_grams, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sodium_per_100g,
  diet_types, tags, is_processed, source, confidence, last_verified, notes
) VALUES (
  'off-8901262172448', 'Amul Chocolate Brownie', 'Amul', '8901262172448', ARRAY['gluten', 'milk'], ARRAY['amul', 'amul', 'chocolate'], ARRAY['amul', 'amul', 'chocolate', 'brownie'], 'packaged-food', 'packaged', 'packaged-food'::public.item_type_enum, 'raw'::public.food_state_enum, 'pan-indian'::public.region_enum,
  100, 232, 4.4, 26.3, 12.5, 0, 46,
  ARRAY['veg'::public.diet_type_enum, 'nonveg'::public.diet_type_enum], ARRAY['packaged', 'fmcg'], true, 'off-india'::public.source_enum, 'medium'::public.confidence_enum, '2026-05-01', 'Open Food Facts India'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.foods (
  id, name, brand, barcode, allergens, name_alt, search_terms, category_id, subcategory, item_type, state, region,
  default_serving_grams, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sodium_per_100g,
  diet_types, tags, is_processed, source, confidence, last_verified, notes
) VALUES (
  'off-8901262150088', 'Amul Taaza 200ml', 'Amul', '8901262150088', ARRAY['milk'], ARRAY['amul', 'amul', 'taaza'], ARRAY['amul', 'amul', 'taaza', '200ml'], 'dairy', 'packaged', 'packaged-food'::public.item_type_enum, 'raw'::public.food_state_enum, 'pan-indian'::public.region_enum,
  100, 58, 3, 4.8, 3, 0, 37,
  ARRAY['veg'::public.diet_type_enum, 'nonveg'::public.diet_type_enum], ARRAY['packaged', 'fmcg'], true, 'off-india'::public.source_enum, 'medium'::public.confidence_enum, '2026-05-01', 'Open Food Facts India'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.foods (
  id, name, brand, barcode, allergens, name_alt, search_terms, category_id, subcategory, item_type, state, region,
  default_serving_grams, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sodium_per_100g,
  diet_types, tags, is_processed, source, confidence, last_verified, notes
) VALUES (
  'off-8901725007102', 'Bingo', 'Itc', '8901725007102', ARRAY['gluten', 'milk', 'soybeans'], ARRAY['itc', 'bingo'], ARRAY['itc', 'bingo'], 'snack-street', 'packaged', 'packaged-food'::public.item_type_enum, 'raw'::public.food_state_enum, 'pan-indian'::public.region_enum,
  30, 531, 7.1, 50.5, 33.4, 0, 825,
  ARRAY['veg'::public.diet_type_enum, 'nonveg'::public.diet_type_enum], ARRAY['packaged', 'fmcg'], true, 'off-india'::public.source_enum, 'medium'::public.confidence_enum, '2026-05-01', 'Open Food Facts India'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.foods (
  id, name, brand, barcode, allergens, name_alt, search_terms, category_id, subcategory, item_type, state, region,
  default_serving_grams, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sodium_per_100g,
  diet_types, tags, is_processed, source, confidence, last_verified, notes
) VALUES (
  'off-8901725007508', 'Bingo! Potato Chips Chilli Sprinkled', 'ITC', '8901725007508', ARRAY['gluten', 'milk', 'soybeans'], ARRAY['itc', 'bingo!', 'potato'], ARRAY['itc', 'bingo!', 'potato', 'chips', 'chilli', 'sprinkled'], 'snack-street', 'packaged', 'packaged-food'::public.item_type_enum, 'raw'::public.food_state_enum, 'pan-indian'::public.region_enum,
  20, 531, 7.1, 50.5, 33.4, 0, 825,
  ARRAY['veg'::public.diet_type_enum, 'nonveg'::public.diet_type_enum], ARRAY['packaged', 'fmcg'], true, 'off-india'::public.source_enum, 'medium'::public.confidence_enum, '2026-05-01', 'Open Food Facts India'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.foods (
  id, name, brand, barcode, allergens, name_alt, search_terms, category_id, subcategory, item_type, state, region,
  default_serving_grams, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sodium_per_100g,
  diet_types, tags, is_processed, source, confidence, last_verified, notes
) VALUES (
  'off-8901725013684', 'Madangle Achari Masti', 'ITC', '8901725013684', ARRAY['soybeans'], ARRAY['itc', 'madangle', 'achari'], ARRAY['itc', 'madangle', 'achari', 'masti'], 'snack-street', 'packaged', 'packaged-food'::public.item_type_enum, 'raw'::public.food_state_enum, 'pan-indian'::public.region_enum,
  20, 526, 5.6, 61.2, 29.5, 0, 759,
  ARRAY['veg'::public.diet_type_enum, 'nonveg'::public.diet_type_enum], ARRAY['packaged', 'fmcg'], true, 'off-india'::public.source_enum, 'medium'::public.confidence_enum, '2026-05-01', 'Open Food Facts India'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.foods (
  id, name, brand, barcode, allergens, name_alt, search_terms, category_id, subcategory, item_type, state, region,
  default_serving_grams, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sodium_per_100g,
  diet_types, tags, is_processed, source, confidence, last_verified, notes
) VALUES (
  'off-8901725004682', 'farmlite oats & chocolate Cookies', 'Sunfeast', '8901725004682', ARRAY['gluten', 'milk', 'nuts', 'soybeans'], ARRAY['sunfeast', 'farmlite', 'oats'], ARRAY['sunfeast', 'farmlite', 'oats', '&', 'chocolate', 'cookies'], 'packaged-food', 'packaged', 'packaged-food'::public.item_type_enum, 'raw'::public.food_state_enum, 'pan-indian'::public.region_enum,
  18.75, 484, 11, 63.6, 21.6, 4.6, 249,
  ARRAY['veg'::public.diet_type_enum, 'nonveg'::public.diet_type_enum], ARRAY['packaged', 'fmcg'], true, 'off-india'::public.source_enum, 'medium'::public.confidence_enum, '2026-05-01', 'Open Food Facts India'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.foods (
  id, name, brand, barcode, allergens, name_alt, search_terms, category_id, subcategory, item_type, state, region,
  default_serving_grams, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sodium_per_100g,
  diet_types, tags, is_processed, source, confidence, last_verified, notes
) VALUES (
  'off-8901725007096', 'Potato Chips Salted', 'Bingo', '8901725007096', NULL, ARRAY['bingo', 'potato', 'chips'], ARRAY['bingo', 'potato', 'chips', 'salted'], 'snack-street', 'packaged', 'packaged-food'::public.item_type_enum, 'raw'::public.food_state_enum, 'pan-indian'::public.region_enum,
  30, 553, 7, 54.7, 34.9, 0, 573,
  ARRAY['veg'::public.diet_type_enum, 'nonveg'::public.diet_type_enum], ARRAY['packaged', 'fmcg'], true, 'off-india'::public.source_enum, 'medium'::public.confidence_enum, '2026-05-01', 'Open Food Facts India'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.foods (
  id, name, brand, barcode, allergens, name_alt, search_terms, category_id, subcategory, item_type, state, region,
  default_serving_grams, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sodium_per_100g,
  diet_types, tags, is_processed, source, confidence, last_verified, notes
) VALUES (
  'off-8901725016562', 'Sunfeast 5-grain Digestive', 'Sunfeast', '8901725016562', ARRAY['gluten', 'milk', 'soybeans'], ARRAY['sunfeast', 'sunfeast', '5-grain'], ARRAY['sunfeast', 'sunfeast', '5-grain', 'digestive'], 'packaged-food', 'packaged', 'packaged-food'::public.item_type_enum, 'raw'::public.food_state_enum, 'pan-indian'::public.region_enum,
  20, 474, 7.9, 68.4, 20.4, 7.4, 268,
  ARRAY['veg'::public.diet_type_enum, 'nonveg'::public.diet_type_enum], ARRAY['packaged', 'fmcg'], true, 'off-india'::public.source_enum, 'medium'::public.confidence_enum, '2026-05-01', 'Open Food Facts India'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.foods (
  id, name, brand, barcode, allergens, name_alt, search_terms, category_id, subcategory, item_type, state, region,
  default_serving_grams, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sodium_per_100g,
  diet_types, tags, is_processed, source, confidence, last_verified, notes
) VALUES (
  'off-8901725121747', 'Superior MP Atta', 'Aashirvaad', '8901725121747', ARRAY['gluten'], ARRAY['aashirvaad', 'superior', 'mp'], ARRAY['aashirvaad', 'superior', 'mp', 'atta'], 'drink', 'packaged', 'packaged-food'::public.item_type_enum, 'raw'::public.food_state_enum, 'pan-indian'::public.region_enum,
  60, 338, 10.7, 76, 1.3, 10.4, 2,
  ARRAY['veg'::public.diet_type_enum, 'nonveg'::public.diet_type_enum], ARRAY['packaged', 'fmcg'], true, 'off-india'::public.source_enum, 'medium'::public.confidence_enum, '2026-05-01', 'Open Food Facts India'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.foods (
  id, name, brand, barcode, allergens, name_alt, search_terms, category_id, subcategory, item_type, state, region,
  default_serving_grams, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sodium_per_100g,
  diet_types, tags, is_processed, source, confidence, last_verified, notes
) VALUES (
  'off-8909081001499', 'Jelimals', 'ITC', '8909081001499', NULL, ARRAY['itc', 'jelimals'], ARRAY['itc', 'jelimals'], 'drink', 'packaged', 'packaged-food'::public.item_type_enum, 'raw'::public.food_state_enum, 'pan-indian'::public.region_enum,
  2.7, 327, 0.2, 81.5, 0, 0, 194,
  ARRAY['veg'::public.diet_type_enum, 'nonveg'::public.diet_type_enum], ARRAY['packaged', 'fmcg'], true, 'off-india'::public.source_enum, 'medium'::public.confidence_enum, '2026-05-01', 'Open Food Facts India'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.foods (
  id, name, brand, barcode, allergens, name_alt, search_terms, category_id, subcategory, item_type, state, region,
  default_serving_grams, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sodium_per_100g,
  diet_types, tags, is_processed, source, confidence, last_verified, notes
) VALUES (
  'off-8901725100063', 'B Natural apple juice 1ltr tpk', 'ITC', '8901725100063', NULL, ARRAY['itc', 'b', 'natural'], ARRAY['itc', 'b', 'natural', 'apple', 'juice', '1ltr', 'tpk'], 'drink', 'packaged', 'packaged-food'::public.item_type_enum, 'raw'::public.food_state_enum, 'pan-indian'::public.region_enum,
  200, 49, 0, 12.6, 0, 0.7, 5,
  ARRAY['veg'::public.diet_type_enum, 'nonveg'::public.diet_type_enum], ARRAY['packaged', 'fmcg'], true, 'off-india'::public.source_enum, 'medium'::public.confidence_enum, '2026-05-01', 'Open Food Facts India'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.foods (
  id, name, brand, barcode, allergens, name_alt, search_terms, category_id, subcategory, item_type, state, region,
  default_serving_grams, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sodium_per_100g,
  diet_types, tags, is_processed, source, confidence, last_verified, notes
) VALUES (
  'off-8901725001070', 'Aashirvaad Double Roasted Suji Rava', 'ITC', '8901725001070', NULL, ARRAY['itc', 'aashirvaad', 'double'], ARRAY['itc', 'aashirvaad', 'double', 'roasted', 'suji', 'rava'], 'drink', 'packaged', 'packaged-food'::public.item_type_enum, 'raw'::public.food_state_enum, 'pan-indian'::public.region_enum,
  200, 360, 11, 77.5, 0.7, 0, 3,
  ARRAY['veg'::public.diet_type_enum, 'nonveg'::public.diet_type_enum], ARRAY['packaged', 'fmcg'], true, 'off-india'::public.source_enum, 'medium'::public.confidence_enum, '2026-05-01', 'Open Food Facts India'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.foods (
  id, name, brand, barcode, allergens, name_alt, search_terms, category_id, subcategory, item_type, state, region,
  default_serving_grams, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sodium_per_100g,
  diet_types, tags, is_processed, source, confidence, last_verified, notes
) VALUES (
  'off-8901491103794', 'Quaker oats', 'Quaker', '8901491103794', NULL, ARRAY['quaker', 'quaker', 'oats'], ARRAY['quaker', 'quaker', 'oats'], 'grain-cereal', 'packaged', 'packaged-food'::public.item_type_enum, 'raw'::public.food_state_enum, 'pan-indian'::public.region_enum,
  40, 407, 11.8, 68.5, 9.5, 10, 10,
  ARRAY['veg'::public.diet_type_enum, 'nonveg'::public.diet_type_enum], ARRAY['packaged', 'fmcg'], true, 'off-india'::public.source_enum, 'medium'::public.confidence_enum, '2026-05-01', 'Open Food Facts India'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.foods (
  id, name, brand, barcode, allergens, name_alt, search_terms, category_id, subcategory, item_type, state, region,
  default_serving_grams, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sodium_per_100g,
  diet_types, tags, is_processed, source, confidence, last_verified, notes
) VALUES (
  'off-8901491702546', 'Oats Multigrain', 'Quaker', '8901491702546', NULL, ARRAY['quaker', 'oats', 'multigrain'], ARRAY['quaker', 'oats', 'multigrain'], 'drink', 'packaged', 'packaged-food'::public.item_type_enum, 'raw'::public.food_state_enum, 'pan-indian'::public.region_enum,
  100, 407, 11.1, 71, 9, 12, 117,
  ARRAY['veg'::public.diet_type_enum, 'nonveg'::public.diet_type_enum], ARRAY['packaged', 'fmcg'], true, 'off-india'::public.source_enum, 'medium'::public.confidence_enum, '2026-05-01', 'Open Food Facts India'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.foods (
  id, name, brand, barcode, allergens, name_alt, search_terms, category_id, subcategory, item_type, state, region,
  default_serving_grams, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sodium_per_100g,
  diet_types, tags, is_processed, source, confidence, last_verified, notes
) VALUES (
  'off-8901491103787', 'Flocon d''avoine pour poridg', 'Pepsico', '8901491103787', NULL, ARRAY['pepsico', 'flocon', 'd''avoine'], ARRAY['pepsico', 'flocon', 'd''avoine', 'pour', 'poridg'], 'grain-cereal', 'packaged', 'packaged-food'::public.item_type_enum, 'raw'::public.food_state_enum, 'pan-indian'::public.region_enum,
  100, 407, 11.8, 68.5, 9.5, 0, 3800,
  ARRAY['veg'::public.diet_type_enum, 'nonveg'::public.diet_type_enum], ARRAY['packaged', 'fmcg'], true, 'off-india'::public.source_enum, 'medium'::public.confidence_enum, '2026-05-01', 'Open Food Facts India'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.foods (
  id, name, brand, barcode, allergens, name_alt, search_terms, category_id, subcategory, item_type, state, region,
  default_serving_grams, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sodium_per_100g,
  diet_types, tags, is_processed, source, confidence, last_verified, notes
) VALUES (
  'off-8901491702539', 'Oats Multigrain', 'Quaker', '8901491702539', ARRAY['gluten'], ARRAY['quaker', 'oats', 'multigrain'], ARRAY['quaker', 'oats', 'multigrain'], 'grain-cereal', 'packaged', 'packaged-food'::public.item_type_enum, 'raw'::public.food_state_enum, 'pan-indian'::public.region_enum,
  40, 407, 11.1, 71, 9, 12, 117,
  ARRAY['veg'::public.diet_type_enum, 'nonveg'::public.diet_type_enum], ARRAY['packaged', 'fmcg'], true, 'off-india'::public.source_enum, 'medium'::public.confidence_enum, '2026-05-01', 'Open Food Facts India'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.foods (
  id, name, brand, barcode, allergens, name_alt, search_terms, category_id, subcategory, item_type, state, region,
  default_serving_grams, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sodium_per_100g,
  diet_types, tags, is_processed, source, confidence, last_verified, notes
) VALUES (
  'off-8901491703055', 'Rolled Oat Flakes', 'Quaker', '8901491703055', NULL, ARRAY['quaker', 'rolled', 'oat'], ARRAY['quaker', 'rolled', 'oat', 'flakes'], 'grain-cereal', 'packaged', 'packaged-food'::public.item_type_enum, 'raw'::public.food_state_enum, 'pan-indian'::public.region_enum,
  40, 407, 11.8, 68.5, 9.5, 10, 10,
  ARRAY['veg'::public.diet_type_enum, 'nonveg'::public.diet_type_enum], ARRAY['packaged', 'fmcg'], true, 'off-india'::public.source_enum, 'medium'::public.confidence_enum, '2026-05-01', 'Open Food Facts India'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.foods (
  id, name, brand, barcode, allergens, name_alt, search_terms, category_id, subcategory, item_type, state, region,
  default_serving_grams, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sodium_per_100g,
  diet_types, tags, is_processed, source, confidence, last_verified, notes
) VALUES (
  'off-8901491100106', 'Rolled Oats (Natural Wholegrain)', 'Quaker', '8901491100106', NULL, ARRAY['quaker', 'rolled', 'oats'], ARRAY['quaker', 'rolled', 'oats', '(natural', 'wholegrain)'], 'grain-cereal', 'packaged', 'packaged-food'::public.item_type_enum, 'raw'::public.food_state_enum, 'pan-indian'::public.region_enum,
  40, 407, 11.8, 68.5, 9.5, 10, 10,
  ARRAY['veg'::public.diet_type_enum, 'nonveg'::public.diet_type_enum], ARRAY['packaged', 'fmcg'], true, 'off-india'::public.source_enum, 'medium'::public.confidence_enum, '2026-05-01', 'Open Food Facts India'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.foods (
  id, name, brand, barcode, allergens, name_alt, search_terms, category_id, subcategory, item_type, state, region,
  default_serving_grams, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sodium_per_100g,
  diet_types, tags, is_processed, source, confidence, last_verified, notes
) VALUES (
  'off-8908006217090', 'Millet Pancake', 'Slurrp farm', '8908006217090', ARRAY['nuts'], ARRAY['slurrp farm', 'millet', 'pancake'], ARRAY['slurrp farm', 'millet', 'pancake'], 'packaged-food', 'packaged', 'packaged-food'::public.item_type_enum, 'raw'::public.food_state_enum, 'pan-indian'::public.region_enum,
  100, 383, 8.1, 79.7, 3.6, 6, NULL,
  ARRAY['veg'::public.diet_type_enum, 'nonveg'::public.diet_type_enum], ARRAY['packaged', 'fmcg'], true, 'off-india'::public.source_enum, 'medium'::public.confidence_enum, '2026-05-01', 'Open Food Facts India'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.foods (
  id, name, brand, barcode, allergens, name_alt, search_terms, category_id, subcategory, item_type, state, region,
  default_serving_grams, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sodium_per_100g,
  diet_types, tags, is_processed, source, confidence, last_verified, notes
) VALUES (
  'off-8906131681717', 'NO0DLES 6.4', 'Slurrp Farm', '8906131681717', ARRAY['gluten', 'milk'], ARRAY['slurrp farm', 'no0dles', '6.4'], ARRAY['slurrp farm', 'no0dles', '6.4'], 'packaged-food', 'packaged', 'packaged-food'::public.item_type_enum, 'raw'::public.food_state_enum, 'pan-indian'::public.region_enum,
  100, 365, 10, 78.7, 1.1, 11.5, NULL,
  ARRAY['veg'::public.diet_type_enum, 'nonveg'::public.diet_type_enum], ARRAY['packaged', 'fmcg'], true, 'off-india'::public.source_enum, 'medium'::public.confidence_enum, '2026-05-01', 'Open Food Facts India'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.foods (
  id, name, brand, barcode, allergens, name_alt, search_terms, category_id, subcategory, item_type, state, region,
  default_serving_grams, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sodium_per_100g,
  diet_types, tags, is_processed, source, confidence, last_verified, notes
) VALUES (
  'off-8908006217113', 'Mighty Puffs Cheese And Herb', 'Slurrp Farm', '8908006217113', NULL, ARRAY['slurrp farm', 'mighty', 'puffs'], ARRAY['slurrp farm', 'mighty', 'puffs', 'cheese', 'and', 'herb'], 'packaged-food', 'packaged', 'packaged-food'::public.item_type_enum, 'raw'::public.food_state_enum, 'pan-indian'::public.region_enum,
  100, 420, 6.4, 63.6, 16.2, 3.3, 565,
  ARRAY['veg'::public.diet_type_enum, 'nonveg'::public.diet_type_enum], ARRAY['packaged', 'fmcg'], true, 'off-india'::public.source_enum, 'medium'::public.confidence_enum, '2026-05-01', 'Open Food Facts India'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.foods (
  id, name, brand, barcode, allergens, name_alt, search_terms, category_id, subcategory, item_type, state, region,
  default_serving_grams, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sodium_per_100g,
  diet_types, tags, is_processed, source, confidence, last_verified, notes
) VALUES (
  'off-8906131680581', 'millet noodles', 'Slurrp Farm', '8906131680581', NULL, ARRAY['slurrp farm', 'millet', 'noodles'], ARRAY['slurrp farm', 'millet', 'noodles'], 'drink', 'packaged', 'packaged-food'::public.item_type_enum, 'raw'::public.food_state_enum, 'pan-indian'::public.region_enum,
  70, 196, 6.3, 36.3, 0.3, 5.6, 62,
  ARRAY['veg'::public.diet_type_enum, 'nonveg'::public.diet_type_enum], ARRAY['packaged', 'fmcg'], true, 'off-india'::public.source_enum, 'medium'::public.confidence_enum, '2026-05-01', 'Open Food Facts India'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.foods (
  id, name, brand, barcode, allergens, name_alt, search_terms, category_id, subcategory, item_type, state, region,
  default_serving_grams, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sodium_per_100g,
  diet_types, tags, is_processed, source, confidence, last_verified, notes
) VALUES (
  'off-8906131684794', 'Plant Protein Coffee Hazelnut bar', 'Mille', '8906131684794', NULL, ARRAY['mille', 'plant', 'protein'], ARRAY['mille', 'plant', 'protein', 'coffee', 'hazelnut', 'bar'], 'packaged-food', 'packaged', 'packaged-food'::public.item_type_enum, 'raw'::public.food_state_enum, 'pan-indian'::public.region_enum,
  38, 368, 65.5, 23.2, 1.3, 63.2, 49,
  ARRAY['veg'::public.diet_type_enum, 'nonveg'::public.diet_type_enum], ARRAY['packaged', 'fmcg'], true, 'off-india'::public.source_enum, 'medium'::public.confidence_enum, '2026-05-01', 'Open Food Facts India'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.foods (
  id, name, brand, barcode, allergens, name_alt, search_terms, category_id, subcategory, item_type, state, region,
  default_serving_grams, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sodium_per_100g,
  diet_types, tags, is_processed, source, confidence, last_verified, notes
) VALUES (
  'off-8906131682035', 'Mighty Puffs Cheddar Cheese', 'Slurrp Farm', '8906131682035', NULL, ARRAY['slurrp farm', 'mighty', 'puffs'], ARRAY['slurrp farm', 'mighty', 'puffs', 'cheddar', 'cheese'], 'packaged-food', 'packaged', 'packaged-food'::public.item_type_enum, 'raw'::public.food_state_enum, 'pan-indian'::public.region_enum,
  20, 435, 6.5, 60, 18, 4.5, 825,
  ARRAY['veg'::public.diet_type_enum, 'nonveg'::public.diet_type_enum], ARRAY['packaged', 'fmcg'], true, 'off-india'::public.source_enum, 'medium'::public.confidence_enum, '2026-05-01', 'Open Food Facts India'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.foods (
  id, name, brand, barcode, allergens, name_alt, search_terms, category_id, subcategory, item_type, state, region,
  default_serving_grams, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sodium_per_100g,
  diet_types, tags, is_processed, source, confidence, last_verified, notes
) VALUES (
  'off-8906131681557', 'Oats jumbo rolled', 'Slurrp farm', '8906131681557', NULL, ARRAY['slurrp farm', 'oats', 'jumbo'], ARRAY['slurrp farm', 'oats', 'jumbo', 'rolled'], 'packaged-food', 'packaged', 'packaged-food'::public.item_type_enum, 'raw'::public.food_state_enum, 'pan-indian'::public.region_enum,
  40, 392, 14.2, 65.1, 8.3, 11.9, 2,
  ARRAY['veg'::public.diet_type_enum, 'nonveg'::public.diet_type_enum], ARRAY['packaged', 'fmcg'], true, 'off-india'::public.source_enum, 'medium'::public.confidence_enum, '2026-05-01', 'Open Food Facts India'
) ON CONFLICT (id) DO NOTHING;


INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8908013479092', 'piece', '1 bar', 52)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8908013479092', 'g100', '100g', 100)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8906143890152', 'tbsp', '1 tablespoon', 35)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8906143890152', 'g100', '100g', 100)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8906143891661', 'scoop', '1 scoop', 35)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8906143891661', 'g100', '100g', 100)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8906143891654', 'scoop', '1 scoop', 35)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8906143891654', 'g100', '100g', 100)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8906143890510', 'serving', '1 serving', 10)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8906143890510', 'g100', '100g', 100)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8908013479139', 'piece', '1 bar', 52)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8908013479139', 'g100', '100g', 100)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8906143891647', 'scoop', '1 scoop', 35)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8906143891647', 'g100', '100g', 100)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8906143892002', 'serving', '1 serving', 67)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8906143892002', 'g100', '100g', 100)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8906143890145', 'tbsp', '1 tablespoon', 35)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8906143890145', 'g100', '100g', 100)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8906143890473', 'serving', '1 serving', 10)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8906143890473', 'g100', '100g', 100)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8904335600312', 'bowl', '1 bowl', 40)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8904335600312', 'g100', '100g', 100)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8904335602521', 'bowl', '1 bowl', 100)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8904335602521', 'g100', '100g', 100)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8904335603429', 'bowl', '1 bowl', 50)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8904335603429', 'g100', '100g', 100)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8904335602064', 'piece', '1 bar', 50)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8904335602064', 'g100', '100g', 100)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8904335605218', 'g100', '100g', 100)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8904335603931', 'bowl', '1 bowl', 40)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8904335603931', 'g100', '100g', 100)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8908005144007', 'piece', '1 bar', 38)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8908005144007', 'g100', '100g', 100)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8904335600657', 'bowl', '1 bowl', 40)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8904335600657', 'g100', '100g', 100)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8904335602859', 'bowl', '1 bowl', 40)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8904335602859', 'g100', '100g', 100)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8904335604266', 'piece', '1 bar', 35)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8904335604266', 'g100', '100g', 100)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8906009532356', 'piece', '1 bar', 50)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8906009532356', 'g100', '100g', 100)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8906009533148', 'piece', '1 biscuit', 55)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8906009533148', 'g100', '100g', 100)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8906009532998', 'piece', '1 bar', 40)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8906009532998', 'g100', '100g', 100)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8906009536477', 'tbsp', '1 tablespoon', 100)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8906009536477', 'g100', '100g', 100)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8906009531236', 'piece', '1 bar', 35)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8906009531236', 'g100', '100g', 100)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8906009532837', 'packet', '1 packet', 60)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8906009532837', 'handful', '1 handful', 30)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8906009532837', 'g100', '100g', 100)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8906009532844', 'serving', '1 serving', 60)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8906009532844', 'g100', '100g', 100)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8906009532981', 'piece', '1 bar', 50)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8906009532981', 'g100', '100g', 100)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-4906409532363', 'serving', '1 serving', 50)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-4906409532363', 'g100', '100g', 100)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8906009532950', 'serving', '1 serving', 60)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8906009532950', 'g100', '100g', 100)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8906136651968', 'bowl', '1 bowl', 50)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8906136651968', 'g100', '100g', 100)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8908010900063', 'tbsp', '1 tablespoon', 30)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8908010900063', 'g100', '100g', 100)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8906136651951', 'bowl', '1 bowl', 50)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8906136651951', 'g100', '100g', 100)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8908010900971', 'tbsp', '1 tablespoon', 100)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8908010900971', 'g100', '100g', 100)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8908010900209', 'tbsp', '1 tablespoon', 100)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8908010900209', 'g100', '100g', 100)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8908010900995', 'tbsp', '1 tablespoon', 32)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8908010900995', 'g100', '100g', 100)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8908010900384', 'tbsp', '1 tablespoon', 16)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8908010900384', 'g100', '100g', 100)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8908010900636', 'g100', '100g', 100)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8904327600924', 'tbsp', '1 tablespoon', 32)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8904327600924', 'g100', '100g', 100)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8904327600351', 'tbsp', '1 tablespoon', 32)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8904327600351', 'g100', '100g', 100)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8904327600436', 'tbsp', '1 tablespoon', 100)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8904327600436', 'g100', '100g', 100)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8904327600955', 'tbsp', '1 tablespoon', 16)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8904327600955', 'g100', '100g', 100)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8904327601969', 'tbsp', '1 tablespoon', 32)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8904327601969', 'g100', '100g', 100)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8904327600696', 'tbsp', '1 tablespoon', 32)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8904327600696', 'g100', '100g', 100)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8904327600399', 'tbsp', '1 tablespoon', 32)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8904327600399', 'g100', '100g', 100)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8904327600382', 'tbsp', '1 tablespoon', 32)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8904327600382', 'g100', '100g', 100)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8904327601914', 'tbsp', '1 tablespoon', 32)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8904327601914', 'g100', '100g', 100)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8904327600788', 'tbsp', '1 tablespoon', 32)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8904327600788', 'g100', '100g', 100)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8906127550010', 'tbsp', '1 tablespoon', 100)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8906127550010', 'g100', '100g', 100)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8906127551086', 'bowl', '1 bowl', 40)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8906127551086', 'g100', '100g', 100)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8906127551437', 'bowl', '1 bowl', 100)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8906127551437', 'g100', '100g', 100)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8906127550294', 'bowl', '1 bowl', 40)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8906127550294', 'g100', '100g', 100)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8906127551161', 'bowl', '1 bowl', 40)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8906127551161', 'g100', '100g', 100)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8906127550126', 'tbsp', '1 tablespoon', 32)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8906127550126', 'g100', '100g', 100)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8906127551178', 'bowl', '1 bowl', 100)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8906127551178', 'g100', '100g', 100)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8906127551338', 'serving', '1 serving', 36)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8906127551338', 'g100', '100g', 100)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8906127551642', 'serving', '1 serving', 37)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8906127551642', 'g100', '100g', 100)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8906127551703', 'bowl', '1 bowl', 40)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8906127551703', 'g100', '100g', 100)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8906059636936', 'bowl', '1 cup/tub', 75)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8906059636936', 'g100', '100g', 100)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8906059635069', 'bowl', '1 cup/tub', 85)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8906059635069', 'g100', '100g', 100)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8906059636639', 'serving', '1 serving', 250)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8906059636639', 'g100', '100g', 100)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8906059637285', 'g100', '100g', 100)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8906059639890', 'g100', '100g', 100)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8906059636264', 'serving', '1 serving', 110)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8906059636264', 'g100', '100g', 100)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8906059636912', 'bowl', '1 cup/tub', 75)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8906059636912', 'g100', '100g', 100)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8906059635014', 'bowl', '1 cup/tub', 85)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8906059635014', 'g100', '100g', 100)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8906059635021', 'bowl', '1 cup/tub', 120)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8906059635021', 'g100', '100g', 100)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8906059636752', 'bowl', '1 cup/tub', 100)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8906059636752', 'g100', '100g', 100)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8901262010016', 'serving', '1 serving', 100)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8901262010016', 'g100', '100g', 100)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8901262200196', 'g100', '100g', 100)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8901262260121', 'g100', '100g', 100)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8901262070546', 'serving', '1 serving', 10)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8901262070546', 'g100', '100g', 100)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8901262180115', 'serving', '1 serving', 50)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8901262180115', 'g100', '100g', 100)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8901262200189', 'g100', '100g', 100)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8901262020039', 'serving', '1 serving', 25)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8901262020039', 'g100', '100g', 100)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8901262020015', 'slice', '1 slice', 20)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8901262020015', 'g100', '100g', 100)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8901262172448', 'g100', '100g', 100)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8901262150088', 'g100', '100g', 100)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8901725007102', 'handful', '1 handful', 30)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8901725007102', 'g100', '100g', 100)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8901725007508', 'packet', '1 packet', 20)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8901725007508', 'handful', '1 handful', 30)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8901725007508', 'g100', '100g', 100)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8901725013684', 'packet', '1 packet', 20)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8901725013684', 'handful', '1 handful', 30)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8901725013684', 'g100', '100g', 100)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8901725004682', 'piece', '1 biscuit', 18.75)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8901725004682', 'g100', '100g', 100)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8901725007096', 'handful', '1 handful', 30)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8901725007096', 'g100', '100g', 100)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8901725016562', 'serving', '1 serving', 20)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8901725016562', 'g100', '100g', 100)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8901725121747', 'glass', '1 glass', 60)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8901725121747', 'g100', '100g', 100)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8909081001499', 'glass', '1 glass', 2.7)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8909081001499', 'g100', '100g', 100)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8901725100063', 'glass', '1 glass', 200)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8901725100063', 'g100', '100g', 100)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8901725001070', 'glass', '1 glass', 200)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8901725001070', 'g100', '100g', 100)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8901491103794', 'bowl', '1 bowl', 40)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8901491103794', 'g100', '100g', 100)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8901491702546', 'bowl', '1 bowl', 100)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8901491702546', 'g100', '100g', 100)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8901491103787', 'g100', '100g', 100)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8901491702539', 'bowl', '1 bowl', 40)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8901491702539', 'g100', '100g', 100)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8901491703055', 'serving', '1 serving', 40)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8901491703055', 'g100', '100g', 100)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8901491100106', 'bowl', '1 bowl', 40)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8901491100106', 'g100', '100g', 100)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8908006217090', 'serving', '1 serving', 100)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8908006217090', 'g100', '100g', 100)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8906131681717', 'g100', '100g', 100)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8908006217113', 'serving', '1 serving', 100)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8908006217113', 'g100', '100g', 100)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8906131680581', 'piece', '1 packet', 70)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8906131680581', 'g100', '100g', 100)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8906131684794', 'piece', '1 bar', 38)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8906131684794', 'g100', '100g', 100)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8906131682035', 'serving', '1 serving', 20)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8906131682035', 'g100', '100g', 100)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8906131681557', 'bowl', '1 bowl', 40)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('off-8906131681557', 'g100', '100g', 100)
ON CONFLICT DO NOTHING;