
INSERT INTO public.foods (
  id, name, brand, name_alt, search_terms, category_id, subcategory, item_type, state, region,
  default_serving_grams, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sodium_per_100g,
  diet_types, tags, is_processed, source, confidence, notes
) VALUES (
  'mb-biozyme-whey', 'MuscleBlaze Biozyme Whey Protein', 'MuscleBlaze', ARRAY['muscleblaze', 'protein', 'supplement'], ARRAY['muscleblaze', 'protein', 'whey concentrate'], 'supplement', 'whey-concentrate', 'supplement'::public.item_type_enum, 'raw'::public.food_state_enum, 'pan-indian'::public.region_enum,
  33, 364, 75.8, 7.6, 3.6, 0, 303,
  ARRAY['veg'::public.diet_type_enum, 'nonveg'::public.diet_type_enum], ARRAY['supplement'], true, 'FSSAI-label'::public.source_enum, 'high'::public.confidence_enum, 'lastVerified: 2026-05'
) ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, brand = EXCLUDED.brand, cal_per_100g = EXCLUDED.cal_per_100g, 
  protein_per_100g = EXCLUDED.protein_per_100g, carbs_per_100g = EXCLUDED.carbs_per_100g, fat_per_100g = EXCLUDED.fat_per_100g;
  

INSERT INTO public.foods (
  id, name, brand, name_alt, search_terms, category_id, subcategory, item_type, state, region,
  default_serving_grams, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sodium_per_100g,
  diet_types, tags, is_processed, source, confidence, notes
) VALUES (
  'mb-biozyme-performance-whey', 'MuscleBlaze Biozyme Performance Whey', 'MuscleBlaze', ARRAY['muscleblaze', 'protein', 'supplement'], ARRAY['muscleblaze', 'protein', 'whey concentrate'], 'supplement', 'whey-concentrate', 'supplement'::public.item_type_enum, 'raw'::public.food_state_enum, 'pan-indian'::public.region_enum,
  36, 392, 69.4, 16.1, 5.3, 0, 361,
  ARRAY['veg'::public.diet_type_enum, 'nonveg'::public.diet_type_enum], ARRAY['supplement'], true, 'FSSAI-label'::public.source_enum, 'high'::public.confidence_enum, 'lastVerified: 2026-05'
) ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, brand = EXCLUDED.brand, cal_per_100g = EXCLUDED.cal_per_100g, 
  protein_per_100g = EXCLUDED.protein_per_100g, carbs_per_100g = EXCLUDED.carbs_per_100g, fat_per_100g = EXCLUDED.fat_per_100g;
  

INSERT INTO public.foods (
  id, name, brand, name_alt, search_terms, category_id, subcategory, item_type, state, region,
  default_serving_grams, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sodium_per_100g,
  diet_types, tags, is_processed, source, confidence, notes
) VALUES (
  'mb-raw-whey-concentrate', 'MuscleBlaze Raw Whey Protein Concentrate (80%)', 'MuscleBlaze', ARRAY['muscleblaze', 'protein', 'supplement'], ARRAY['muscleblaze', 'protein', 'whey concentrate'], 'supplement', 'whey-concentrate', 'supplement'::public.item_type_enum, 'raw'::public.food_state_enum, 'pan-indian'::public.region_enum,
  33, 394, 72.7, 12.1, 4.5, 0, 242,
  ARRAY['veg'::public.diet_type_enum, 'nonveg'::public.diet_type_enum], ARRAY['supplement'], true, 'FSSAI-label'::public.source_enum, 'high'::public.confidence_enum, 'lastVerified: 2026-05'
) ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, brand = EXCLUDED.brand, cal_per_100g = EXCLUDED.cal_per_100g, 
  protein_per_100g = EXCLUDED.protein_per_100g, carbs_per_100g = EXCLUDED.carbs_per_100g, fat_per_100g = EXCLUDED.fat_per_100g;
  

INSERT INTO public.foods (
  id, name, brand, name_alt, search_terms, category_id, subcategory, item_type, state, region,
  default_serving_grams, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sodium_per_100g,
  diet_types, tags, is_processed, source, confidence, notes
) VALUES (
  'asitis-atom-whey', 'AS-IT-IS Nutrition ATOM Whey Protein', 'AS-IT-IS', ARRAY['as-it-is', 'protein', 'supplement'], ARRAY['as-it-is', 'protein', 'whey concentrate'], 'supplement', 'whey-concentrate', 'supplement'::public.item_type_enum, 'raw'::public.food_state_enum, 'pan-indian'::public.region_enum,
  33, 385, 81.8, 6.1, 1.5, 0, 273,
  ARRAY['veg'::public.diet_type_enum, 'nonveg'::public.diet_type_enum], ARRAY['supplement'], true, 'FSSAI-label'::public.source_enum, 'high'::public.confidence_enum, 'lastVerified: 2026-05'
) ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, brand = EXCLUDED.brand, cal_per_100g = EXCLUDED.cal_per_100g, 
  protein_per_100g = EXCLUDED.protein_per_100g, carbs_per_100g = EXCLUDED.carbs_per_100g, fat_per_100g = EXCLUDED.fat_per_100g;
  

INSERT INTO public.foods (
  id, name, brand, name_alt, search_terms, category_id, subcategory, item_type, state, region,
  default_serving_grams, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sodium_per_100g,
  diet_types, tags, is_processed, source, confidence, notes
) VALUES (
  'asitis-raw-whey-concentrate', 'AS-IT-IS Raw Whey Protein Concentrate (Unflavored)', 'AS-IT-IS', ARRAY['as-it-is', 'protein', 'supplement'], ARRAY['as-it-is', 'protein', 'whey concentrate'], 'supplement', 'whey-concentrate', 'supplement'::public.item_type_enum, 'raw'::public.food_state_enum, 'pan-indian'::public.region_enum,
  33, 391, 78.8, 9.1, 4.5, 0, 258,
  ARRAY['veg'::public.diet_type_enum, 'nonveg'::public.diet_type_enum], ARRAY['supplement'], true, 'FSSAI-label'::public.source_enum, 'high'::public.confidence_enum, 'lastVerified: 2026-05'
) ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, brand = EXCLUDED.brand, cal_per_100g = EXCLUDED.cal_per_100g, 
  protein_per_100g = EXCLUDED.protein_per_100g, carbs_per_100g = EXCLUDED.carbs_per_100g, fat_per_100g = EXCLUDED.fat_per_100g;
  

INSERT INTO public.foods (
  id, name, brand, name_alt, search_terms, category_id, subcategory, item_type, state, region,
  default_serving_grams, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sodium_per_100g,
  diet_types, tags, is_processed, source, confidence, notes
) VALUES (
  'twt-whey-concentrate-unflavored', 'The Whole Truth Whey Protein Concentrate (Unflavored)', 'The Whole Truth', ARRAY['the whole truth', 'protein', 'supplement'], ARRAY['the whole truth', 'protein', 'whey concentrate'], 'supplement', 'whey-concentrate', 'supplement'::public.item_type_enum, 'raw'::public.food_state_enum, 'pan-indian'::public.region_enum,
  30, 413, 86.7, 6.7, 5, 0, 233,
  ARRAY['veg'::public.diet_type_enum, 'nonveg'::public.diet_type_enum], ARRAY['supplement'], true, 'FSSAI-label'::public.source_enum, 'high'::public.confidence_enum, 'lastVerified: 2026-05'
) ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, brand = EXCLUDED.brand, cal_per_100g = EXCLUDED.cal_per_100g, 
  protein_per_100g = EXCLUDED.protein_per_100g, carbs_per_100g = EXCLUDED.carbs_per_100g, fat_per_100g = EXCLUDED.fat_per_100g;
  

INSERT INTO public.foods (
  id, name, brand, name_alt, search_terms, category_id, subcategory, item_type, state, region,
  default_serving_grams, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sodium_per_100g,
  diet_types, tags, is_processed, source, confidence, notes
) VALUES (
  'twt-whey-isolate-unflavored', 'The Whole Truth Whey Protein Isolate (Unflavored)', 'The Whole Truth', ARRAY['the whole truth', 'protein', 'supplement'], ARRAY['the whole truth', 'protein', 'whey isolate'], 'supplement', 'whey-isolate', 'supplement'::public.item_type_enum, 'raw'::public.food_state_enum, 'pan-indian'::public.region_enum,
  33, 394, 90.9, 3, 1.5, 0, 197,
  ARRAY['veg'::public.diet_type_enum, 'nonveg'::public.diet_type_enum], ARRAY['supplement'], true, 'FSSAI-label'::public.source_enum, 'high'::public.confidence_enum, 'lastVerified: 2026-05'
) ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, brand = EXCLUDED.brand, cal_per_100g = EXCLUDED.cal_per_100g, 
  protein_per_100g = EXCLUDED.protein_per_100g, carbs_per_100g = EXCLUDED.carbs_per_100g, fat_per_100g = EXCLUDED.fat_per_100g;
  

INSERT INTO public.foods (
  id, name, brand, name_alt, search_terms, category_id, subcategory, item_type, state, region,
  default_serving_grams, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sodium_per_100g,
  diet_types, tags, is_processed, source, confidence, notes
) VALUES (
  'nakpro-impact-whey', 'NAKPRO Impact Whey Protein', 'NAKPRO', ARRAY['nakpro', 'protein', 'supplement'], ARRAY['nakpro', 'protein', 'whey concentrate'], 'supplement', 'whey-concentrate', 'supplement'::public.item_type_enum, 'raw'::public.food_state_enum, 'pan-indian'::public.region_enum,
  33, 376, 72.7, 9.1, 4.5, 0, 303,
  ARRAY['veg'::public.diet_type_enum, 'nonveg'::public.diet_type_enum], ARRAY['supplement'], true, 'FSSAI-label'::public.source_enum, 'high'::public.confidence_enum, 'lastVerified: 2026-05'
) ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, brand = EXCLUDED.brand, cal_per_100g = EXCLUDED.cal_per_100g, 
  protein_per_100g = EXCLUDED.protein_per_100g, carbs_per_100g = EXCLUDED.carbs_per_100g, fat_per_100g = EXCLUDED.fat_per_100g;
  

INSERT INTO public.foods (
  id, name, brand, name_alt, search_terms, category_id, subcategory, item_type, state, region,
  default_serving_grams, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sodium_per_100g,
  diet_types, tags, is_processed, source, confidence, notes
) VALUES (
  'avvatar-absolute-whey', 'AVVATAR Absolute 100% Whey Protein', 'AVVATAR', ARRAY['avvatar', 'protein', 'supplement'], ARRAY['avvatar', 'protein', 'whey concentrate'], 'supplement', 'whey-concentrate', 'supplement'::public.item_type_enum, 'raw'::public.food_state_enum, 'pan-indian'::public.region_enum,
  36, 403, 69.4, 15.3, 5.6, 0, 333,
  ARRAY['veg'::public.diet_type_enum, 'nonveg'::public.diet_type_enum], ARRAY['supplement'], true, 'FSSAI-label'::public.source_enum, 'high'::public.confidence_enum, 'lastVerified: 2026-05'
) ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, brand = EXCLUDED.brand, cal_per_100g = EXCLUDED.cal_per_100g, 
  protein_per_100g = EXCLUDED.protein_per_100g, carbs_per_100g = EXCLUDED.carbs_per_100g, fat_per_100g = EXCLUDED.fat_per_100g;
  

INSERT INTO public.foods (
  id, name, brand, name_alt, search_terms, category_id, subcategory, item_type, state, region,
  default_serving_grams, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sodium_per_100g,
  diet_types, tags, is_processed, source, confidence, notes
) VALUES (
  'truebasics-clean-whey-isolate', 'TrueBasics Clean Whey Isolate', 'TrueBasics', ARRAY['truebasics', 'protein', 'supplement'], ARRAY['truebasics', 'protein', 'whey isolate'], 'supplement', 'whey-isolate', 'supplement'::public.item_type_enum, 'raw'::public.food_state_enum, 'pan-indian'::public.region_enum,
  33, 364, 90.9, 3, 1.5, 0, 242,
  ARRAY['veg'::public.diet_type_enum, 'nonveg'::public.diet_type_enum], ARRAY['supplement'], true, 'FSSAI-label'::public.source_enum, 'high'::public.confidence_enum, 'lastVerified: 2026-05'
) ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, brand = EXCLUDED.brand, cal_per_100g = EXCLUDED.cal_per_100g, 
  protein_per_100g = EXCLUDED.protein_per_100g, carbs_per_100g = EXCLUDED.carbs_per_100g, fat_per_100g = EXCLUDED.fat_per_100g;
  

INSERT INTO public.foods (
  id, name, brand, name_alt, search_terms, category_id, subcategory, item_type, state, region,
  default_serving_grams, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sodium_per_100g,
  diet_types, tags, is_processed, source, confidence, notes
) VALUES (
  'on-gold-standard-whey', 'Optimum Nutrition (ON) Gold Standard 100% Whey', 'Optimum Nutrition', ARRAY['optimum nutrition', 'protein', 'supplement'], ARRAY['optimum nutrition', 'protein', 'whey concentrate'], 'supplement', 'whey-concentrate', 'supplement'::public.item_type_enum, 'raw'::public.food_state_enum, 'pan-indian'::public.region_enum,
  30, 400, 80, 10, 3.3, 0, 433,
  ARRAY['veg'::public.diet_type_enum, 'nonveg'::public.diet_type_enum], ARRAY['supplement'], true, 'FSSAI-label'::public.source_enum, 'high'::public.confidence_enum, 'lastVerified: 2026-05'
) ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, brand = EXCLUDED.brand, cal_per_100g = EXCLUDED.cal_per_100g, 
  protein_per_100g = EXCLUDED.protein_per_100g, carbs_per_100g = EXCLUDED.carbs_per_100g, fat_per_100g = EXCLUDED.fat_per_100g;
  

INSERT INTO public.foods (
  id, name, brand, name_alt, search_terms, category_id, subcategory, item_type, state, region,
  default_serving_grams, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sodium_per_100g,
  diet_types, tags, is_processed, source, confidence, notes
) VALUES (
  'on-gold-standard-whey-isolate', 'ON Gold Standard 100% Whey Isolate', 'Optimum Nutrition', ARRAY['optimum nutrition', 'protein', 'supplement'], ARRAY['optimum nutrition', 'protein', 'whey isolate'], 'supplement', 'whey-isolate', 'supplement'::public.item_type_enum, 'raw'::public.food_state_enum, 'pan-indian'::public.region_enum,
  31, 355, 80.6, 3.2, 1.6, 0, 419,
  ARRAY['veg'::public.diet_type_enum, 'nonveg'::public.diet_type_enum], ARRAY['supplement'], true, 'FSSAI-label'::public.source_enum, 'high'::public.confidence_enum, 'lastVerified: 2026-05'
) ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, brand = EXCLUDED.brand, cal_per_100g = EXCLUDED.cal_per_100g, 
  protein_per_100g = EXCLUDED.protein_per_100g, carbs_per_100g = EXCLUDED.carbs_per_100g, fat_per_100g = EXCLUDED.fat_per_100g;
  

INSERT INTO public.foods (
  id, name, brand, name_alt, search_terms, category_id, subcategory, item_type, state, region,
  default_serving_grams, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sodium_per_100g,
  diet_types, tags, is_processed, source, confidence, notes
) VALUES (
  'myprotein-impact-whey-concentrate', 'MyProtein Impact Whey Protein (Concentrate)', 'MyProtein', ARRAY['myprotein', 'protein', 'supplement'], ARRAY['myprotein', 'protein', 'whey concentrate'], 'supplement', 'whey-concentrate', 'supplement'::public.item_type_enum, 'raw'::public.food_state_enum, 'pan-indian'::public.region_enum,
  25, 412, 80, 12, 7.6, 0, 440,
  ARRAY['veg'::public.diet_type_enum, 'nonveg'::public.diet_type_enum], ARRAY['supplement'], true, 'FSSAI-label'::public.source_enum, 'high'::public.confidence_enum, 'lastVerified: 2026-05'
) ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, brand = EXCLUDED.brand, cal_per_100g = EXCLUDED.cal_per_100g, 
  protein_per_100g = EXCLUDED.protein_per_100g, carbs_per_100g = EXCLUDED.carbs_per_100g, fat_per_100g = EXCLUDED.fat_per_100g;
  

INSERT INTO public.foods (
  id, name, brand, name_alt, search_terms, category_id, subcategory, item_type, state, region,
  default_serving_grams, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sodium_per_100g,
  diet_types, tags, is_processed, source, confidence, notes
) VALUES (
  'myprotein-impact-whey-isolate', 'MyProtein Impact Whey Isolate', 'MyProtein', ARRAY['myprotein', 'protein', 'supplement'], ARRAY['myprotein', 'protein', 'whey isolate'], 'supplement', 'whey-isolate', 'supplement'::public.item_type_enum, 'raw'::public.food_state_enum, 'pan-indian'::public.region_enum,
  25, 372, 88, 4, 2, 0, 360,
  ARRAY['veg'::public.diet_type_enum, 'nonveg'::public.diet_type_enum], ARRAY['supplement'], true, 'FSSAI-label'::public.source_enum, 'high'::public.confidence_enum, 'lastVerified: 2026-05'
) ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, brand = EXCLUDED.brand, cal_per_100g = EXCLUDED.cal_per_100g, 
  protein_per_100g = EXCLUDED.protein_per_100g, carbs_per_100g = EXCLUDED.carbs_per_100g, fat_per_100g = EXCLUDED.fat_per_100g;
  

INSERT INTO public.foods (
  id, name, brand, name_alt, search_terms, category_id, subcategory, item_type, state, region,
  default_serving_grams, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sodium_per_100g,
  diet_types, tags, is_processed, source, confidence, notes
) VALUES (
  'dymatize-iso100', 'Dymatize ISO 100 (Hydrolyzed Whey Isolate)', 'Dymatize', ARRAY['dymatize', 'protein', 'supplement'], ARRAY['dymatize', 'protein', 'whey hydrolysate'], 'supplement', 'whey-hydrolysate', 'supplement'::public.item_type_enum, 'raw'::public.food_state_enum, 'pan-indian'::public.region_enum,
  31, 355, 80.6, 3.2, 1.6, 0, 516,
  ARRAY['veg'::public.diet_type_enum, 'nonveg'::public.diet_type_enum], ARRAY['supplement'], true, 'FSSAI-label'::public.source_enum, 'high'::public.confidence_enum, 'lastVerified: 2026-05'
) ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, brand = EXCLUDED.brand, cal_per_100g = EXCLUDED.cal_per_100g, 
  protein_per_100g = EXCLUDED.protein_per_100g, carbs_per_100g = EXCLUDED.carbs_per_100g, fat_per_100g = EXCLUDED.fat_per_100g;
  

INSERT INTO public.foods (
  id, name, brand, name_alt, search_terms, category_id, subcategory, item_type, state, region,
  default_serving_grams, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sodium_per_100g,
  diet_types, tags, is_processed, source, confidence, notes
) VALUES (
  'bigmuscles-premium-gold-whey', 'Bigmuscles Nutrition Premium Gold Whey', 'Bigmuscles', ARRAY['bigmuscles', 'protein', 'supplement'], ARRAY['bigmuscles', 'protein', 'whey concentrate'], 'supplement', 'whey-concentrate', 'supplement'::public.item_type_enum, 'raw'::public.food_state_enum, 'pan-indian'::public.region_enum,
  36, 403, 69.4, 19.4, 5.6, 0, 389,
  ARRAY['veg'::public.diet_type_enum, 'nonveg'::public.diet_type_enum], ARRAY['supplement'], true, 'FSSAI-label'::public.source_enum, 'high'::public.confidence_enum, 'lastVerified: 2026-05'
) ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, brand = EXCLUDED.brand, cal_per_100g = EXCLUDED.cal_per_100g, 
  protein_per_100g = EXCLUDED.protein_per_100g, carbs_per_100g = EXCLUDED.carbs_per_100g, fat_per_100g = EXCLUDED.fat_per_100g;
  

INSERT INTO public.foods (
  id, name, brand, name_alt, search_terms, category_id, subcategory, item_type, state, region,
  default_serving_grams, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sodium_per_100g,
  diet_types, tags, is_processed, source, confidence, notes
) VALUES (
  'gnc-pro-performance-whey', 'GNC Pro Performance Whey Protein', 'GNC', ARRAY['gnc', 'protein', 'supplement'], ARRAY['gnc', 'protein', 'whey concentrate'], 'supplement', 'whey-concentrate', 'supplement'::public.item_type_enum, 'raw'::public.food_state_enum, 'pan-indian'::public.region_enum,
  34, 382, 70.6, 14.7, 4.4, 0, 441,
  ARRAY['veg'::public.diet_type_enum, 'nonveg'::public.diet_type_enum], ARRAY['supplement'], true, 'FSSAI-label'::public.source_enum, 'high'::public.confidence_enum, 'lastVerified: 2026-05'
) ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, brand = EXCLUDED.brand, cal_per_100g = EXCLUDED.cal_per_100g, 
  protein_per_100g = EXCLUDED.protein_per_100g, carbs_per_100g = EXCLUDED.carbs_per_100g, fat_per_100g = EXCLUDED.fat_per_100g;
  

INSERT INTO public.foods (
  id, name, brand, name_alt, search_terms, category_id, subcategory, item_type, state, region,
  default_serving_grams, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sodium_per_100g,
  diet_types, tags, is_processed, source, confidence, notes
) VALUES (
  'tata-1mg-whey', 'Tata 1mg Ultra Clean Whey Protein', 'Tata', ARRAY['tata', 'protein', 'supplement'], ARRAY['tata', 'protein', 'whey concentrate'], 'supplement', 'whey-concentrate', 'supplement'::public.item_type_enum, 'raw'::public.food_state_enum, 'pan-indian'::public.region_enum,
  36, 375, 69.4, 11.1, 4.2, 0, 333,
  ARRAY['veg'::public.diet_type_enum, 'nonveg'::public.diet_type_enum], ARRAY['supplement'], true, 'FSSAI-label'::public.source_enum, 'high'::public.confidence_enum, 'lastVerified: 2026-05'
) ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, brand = EXCLUDED.brand, cal_per_100g = EXCLUDED.cal_per_100g, 
  protein_per_100g = EXCLUDED.protein_per_100g, carbs_per_100g = EXCLUDED.carbs_per_100g, fat_per_100g = EXCLUDED.fat_per_100g;
  

INSERT INTO public.foods (
  id, name, brand, name_alt, search_terms, category_id, subcategory, item_type, state, region,
  default_serving_grams, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sodium_per_100g,
  diet_types, tags, is_processed, source, confidence, notes
) VALUES (
  'mb-mass-gainer-xxl', 'MuscleBlaze Mass Gainer XXL', 'MuscleBlaze', ARRAY['muscleblaze', 'protein', 'supplement'], ARRAY['muscleblaze', 'protein', 'mass gainer'], 'supplement', 'mass-gainer', 'supplement'::public.item_type_enum, 'raw'::public.food_state_enum, 'pan-indian'::public.region_enum,
  150, 374, 15, 74.7, 2, 0.6666666666666667, 133.33333333333331,
  ARRAY['veg'::public.diet_type_enum, 'nonveg'::public.diet_type_enum], ARRAY['supplement', 'extreme-calories'], true, 'FSSAI-label'::public.source_enum, 'high'::public.confidence_enum, 'lastVerified: 2026-05'
) ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, brand = EXCLUDED.brand, cal_per_100g = EXCLUDED.cal_per_100g, 
  protein_per_100g = EXCLUDED.protein_per_100g, carbs_per_100g = EXCLUDED.carbs_per_100g, fat_per_100g = EXCLUDED.fat_per_100g;
  

INSERT INTO public.foods (
  id, name, brand, name_alt, search_terms, category_id, subcategory, item_type, state, region,
  default_serving_grams, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sodium_per_100g,
  diet_types, tags, is_processed, source, confidence, notes
) VALUES (
  'mb-super-gainer-xxl', 'MuscleBlaze Super Gainer XXL', 'MuscleBlaze', ARRAY['muscleblaze', 'protein', 'supplement'], ARRAY['muscleblaze', 'protein', 'mass gainer'], 'supplement', 'mass-gainer', 'supplement'::public.item_type_enum, 'raw'::public.food_state_enum, 'pan-indian'::public.region_enum,
  75, 373, 20, 70.7, 2.7, 0.6666666666666667, 213.33333333333334,
  ARRAY['veg'::public.diet_type_enum, 'nonveg'::public.diet_type_enum], ARRAY['supplement', 'extreme-calories'], true, 'FSSAI-label'::public.source_enum, 'high'::public.confidence_enum, 'lastVerified: 2026-05'
) ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, brand = EXCLUDED.brand, cal_per_100g = EXCLUDED.cal_per_100g, 
  protein_per_100g = EXCLUDED.protein_per_100g, carbs_per_100g = EXCLUDED.carbs_per_100g, fat_per_100g = EXCLUDED.fat_per_100g;
  

INSERT INTO public.foods (
  id, name, brand, name_alt, search_terms, category_id, subcategory, item_type, state, region,
  default_serving_grams, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sodium_per_100g,
  diet_types, tags, is_processed, source, confidence, notes
) VALUES (
  'mb-lean-mass-gainer', 'MuscleBlaze High Protein Lean Mass Gainer', 'MuscleBlaze', ARRAY['muscleblaze', 'protein', 'supplement'], ARRAY['muscleblaze', 'protein', 'lean mass-gainer'], 'supplement', 'lean-mass-gainer', 'supplement'::public.item_type_enum, 'raw'::public.food_state_enum, 'pan-indian'::public.region_enum,
  75, 393, 40, 62.7, 2.7, 2.666666666666667, NULL,
  ARRAY['veg'::public.diet_type_enum, 'nonveg'::public.diet_type_enum], ARRAY['supplement', 'extreme-calories'], true, 'FSSAI-label'::public.source_enum, 'high'::public.confidence_enum, 'lastVerified: 2026-05'
) ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, brand = EXCLUDED.brand, cal_per_100g = EXCLUDED.cal_per_100g, 
  protein_per_100g = EXCLUDED.protein_per_100g, carbs_per_100g = EXCLUDED.carbs_per_100g, fat_per_100g = EXCLUDED.fat_per_100g;
  

INSERT INTO public.foods (
  id, name, brand, name_alt, search_terms, category_id, subcategory, item_type, state, region,
  default_serving_grams, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sodium_per_100g,
  diet_types, tags, is_processed, source, confidence, notes
) VALUES (
  'asitis-atom-mass-gainer', 'AS-IT-IS ATOM Mass Gainer', 'AS-IT-IS', ARRAY['as-it-is', 'protein', 'supplement'], ARRAY['as-it-is', 'protein', 'mass gainer'], 'supplement', 'mass-gainer', 'supplement'::public.item_type_enum, 'raw'::public.food_state_enum, 'pan-indian'::public.region_enum,
  100, 384, 25, 63, 4, 0, NULL,
  ARRAY['veg'::public.diet_type_enum, 'nonveg'::public.diet_type_enum], ARRAY['supplement', 'extreme-calories'], true, 'FSSAI-label'::public.source_enum, 'high'::public.confidence_enum, 'lastVerified: 2026-05'
) ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, brand = EXCLUDED.brand, cal_per_100g = EXCLUDED.cal_per_100g, 
  protein_per_100g = EXCLUDED.protein_per_100g, carbs_per_100g = EXCLUDED.carbs_per_100g, fat_per_100g = EXCLUDED.fat_per_100g;
  

INSERT INTO public.foods (
  id, name, brand, name_alt, search_terms, category_id, subcategory, item_type, state, region,
  default_serving_grams, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sodium_per_100g,
  diet_types, tags, is_processed, source, confidence, notes
) VALUES (
  'on-serious-mass', 'Optimum Nutrition (ON) Serious Mass', 'Optimum Nutrition', ARRAY['optimum nutrition', 'protein', 'supplement'], ARRAY['optimum nutrition', 'protein', 'mass gainer'], 'supplement', 'mass-gainer', 'supplement'::public.item_type_enum, 'raw'::public.food_state_enum, 'pan-indian'::public.region_enum,
  334, 377, 15, 75.7, 1.3, 1.4970059880239521, 125.74850299401197,
  ARRAY['veg'::public.diet_type_enum, 'nonveg'::public.diet_type_enum], ARRAY['supplement', 'extreme-calories'], true, 'FSSAI-label'::public.source_enum, 'high'::public.confidence_enum, 'lastVerified: 2026-05'
) ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, brand = EXCLUDED.brand, cal_per_100g = EXCLUDED.cal_per_100g, 
  protein_per_100g = EXCLUDED.protein_per_100g, carbs_per_100g = EXCLUDED.carbs_per_100g, fat_per_100g = EXCLUDED.fat_per_100g;
  

INSERT INTO public.foods (
  id, name, brand, name_alt, search_terms, category_id, subcategory, item_type, state, region,
  default_serving_grams, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sodium_per_100g,
  diet_types, tags, is_processed, source, confidence, notes
) VALUES (
  'on-serious-mass-half', 'ON Serious Mass — Single Scoop (Half Serving) — IMPORTANT for Indian tracking', 'Optimum Nutrition', ARRAY['optimum nutrition', 'protein', 'supplement'], ARRAY['optimum nutrition', 'protein', 'mass gainer'], 'supplement', 'mass-gainer', 'supplement'::public.item_type_enum, 'raw'::public.food_state_enum, 'pan-indian'::public.region_enum,
  167, 377, 15, 75.7, 1.3, 1.5, NULL,
  ARRAY['veg'::public.diet_type_enum, 'nonveg'::public.diet_type_enum], ARRAY['supplement', 'extreme-calories'], true, 'FSSAI-label'::public.source_enum, 'high'::public.confidence_enum, 'lastVerified: 2026-05'
) ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, brand = EXCLUDED.brand, cal_per_100g = EXCLUDED.cal_per_100g, 
  protein_per_100g = EXCLUDED.protein_per_100g, carbs_per_100g = EXCLUDED.carbs_per_100g, fat_per_100g = EXCLUDED.fat_per_100g;
  

INSERT INTO public.foods (
  id, name, brand, name_alt, search_terms, category_id, subcategory, item_type, state, region,
  default_serving_grams, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sodium_per_100g,
  diet_types, tags, is_processed, source, confidence, notes
) VALUES (
  'labrada-muscle-mass-gainer', 'Labrada Muscle Mass Gainer', 'Labrada', ARRAY['labrada', 'protein', 'supplement'], ARRAY['labrada', 'protein', 'mass gainer'], 'supplement', 'mass-gainer', 'supplement'::public.item_type_enum, 'raw'::public.food_state_enum, 'pan-indian'::public.region_enum,
  336, 370, 15.5, 74.7, 2.4, 1.7857142857142856, 166.66666666666669,
  ARRAY['veg'::public.diet_type_enum, 'nonveg'::public.diet_type_enum], ARRAY['supplement', 'extreme-calories'], true, 'FSSAI-label'::public.source_enum, 'high'::public.confidence_enum, 'lastVerified: 2026-05'
) ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, brand = EXCLUDED.brand, cal_per_100g = EXCLUDED.cal_per_100g, 
  protein_per_100g = EXCLUDED.protein_per_100g, carbs_per_100g = EXCLUDED.carbs_per_100g, fat_per_100g = EXCLUDED.fat_per_100g;
  

INSERT INTO public.foods (
  id, name, brand, name_alt, search_terms, category_id, subcategory, item_type, state, region,
  default_serving_grams, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sodium_per_100g,
  diet_types, tags, is_processed, source, confidence, notes
) VALUES (
  'muscletech-mass-tech-extreme', 'MuscleTech Mass Tech Extreme 2000', 'MuscleTech', ARRAY['muscletech', 'protein', 'supplement'], ARRAY['muscletech', 'protein', 'mass gainer'], 'supplement', 'mass-gainer', 'supplement'::public.item_type_enum, 'raw'::public.food_state_enum, 'pan-indian'::public.region_enum,
  334, 599, 24, 120, 3, 0, NULL,
  ARRAY['veg'::public.diet_type_enum, 'nonveg'::public.diet_type_enum], ARRAY['supplement', 'extreme-calories'], true, 'FSSAI-label'::public.source_enum, 'high'::public.confidence_enum, 'lastVerified: 2026-05'
) ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, brand = EXCLUDED.brand, cal_per_100g = EXCLUDED.cal_per_100g, 
  protein_per_100g = EXCLUDED.protein_per_100g, carbs_per_100g = EXCLUDED.carbs_per_100g, fat_per_100g = EXCLUDED.fat_per_100g;
  

INSERT INTO public.foods (
  id, name, brand, name_alt, search_terms, category_id, subcategory, item_type, state, region,
  default_serving_grams, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sodium_per_100g,
  diet_types, tags, is_processed, source, confidence, notes
) VALUES (
  'gnc-pro-performance-weight-gainer', 'GNC Pro Performance Weight Gainer', 'GNC', ARRAY['gnc', 'protein', 'supplement'], ARRAY['gnc', 'protein', 'mass gainer'], 'supplement', 'mass-gainer', 'supplement'::public.item_type_enum, 'raw'::public.food_state_enum, 'pan-indian'::public.region_enum,
  315, 407, 16.8, 87.3, 1.6, 0, NULL,
  ARRAY['veg'::public.diet_type_enum, 'nonveg'::public.diet_type_enum], ARRAY['supplement', 'extreme-calories'], true, 'FSSAI-label'::public.source_enum, 'high'::public.confidence_enum, 'lastVerified: 2026-05'
) ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, brand = EXCLUDED.brand, cal_per_100g = EXCLUDED.cal_per_100g, 
  protein_per_100g = EXCLUDED.protein_per_100g, carbs_per_100g = EXCLUDED.carbs_per_100g, fat_per_100g = EXCLUDED.fat_per_100g;
  

INSERT INTO public.foods (
  id, name, brand, name_alt, search_terms, category_id, subcategory, item_type, state, region,
  default_serving_grams, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sodium_per_100g,
  diet_types, tags, is_processed, source, confidence, notes
) VALUES (
  'bsn-true-mass-1200', 'BSN True Mass 1200', 'BSN', ARRAY['bsn', 'protein', 'supplement'], ARRAY['bsn', 'protein', 'mass gainer'], 'supplement', 'mass-gainer', 'supplement'::public.item_type_enum, 'raw'::public.food_state_enum, 'pan-indian'::public.region_enum,
  254, 476, 19.7, 84.6, 6.7, 2.7559055118110236, 275.59055118110234,
  ARRAY['veg'::public.diet_type_enum, 'nonveg'::public.diet_type_enum], ARRAY['supplement', 'extreme-calories'], true, 'FSSAI-label'::public.source_enum, 'high'::public.confidence_enum, 'lastVerified: 2026-05'
) ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, brand = EXCLUDED.brand, cal_per_100g = EXCLUDED.cal_per_100g, 
  protein_per_100g = EXCLUDED.protein_per_100g, carbs_per_100g = EXCLUDED.carbs_per_100g, fat_per_100g = EXCLUDED.fat_per_100g;
  

INSERT INTO public.foods (
  id, name, brand, name_alt, search_terms, category_id, subcategory, item_type, state, region,
  default_serving_grams, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sodium_per_100g,
  diet_types, tags, is_processed, source, confidence, notes
) VALUES (
  'mb-biozyme-iso-zero', 'MuscleBlaze Biozyme Iso-Zero', 'MuscleBlaze', ARRAY['muscleblaze', 'protein', 'supplement'], ARRAY['muscleblaze', 'protein', 'whey isolate'], 'supplement', 'whey-isolate', 'supplement'::public.item_type_enum, 'raw'::public.food_state_enum, 'pan-indian'::public.region_enum,
  34, 368, 79.4, 4.4, 2.9, 0, 265,
  ARRAY['veg'::public.diet_type_enum, 'nonveg'::public.diet_type_enum], ARRAY['supplement'], true, 'FSSAI-label'::public.source_enum, 'high'::public.confidence_enum, 'lastVerified: 2026-05'
) ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, brand = EXCLUDED.brand, cal_per_100g = EXCLUDED.cal_per_100g, 
  protein_per_100g = EXCLUDED.protein_per_100g, carbs_per_100g = EXCLUDED.carbs_per_100g, fat_per_100g = EXCLUDED.fat_per_100g;
  

INSERT INTO public.foods (
  id, name, brand, name_alt, search_terms, category_id, subcategory, item_type, state, region,
  default_serving_grams, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sodium_per_100g,
  diet_types, tags, is_processed, source, confidence, notes
) VALUES (
  'nutrabay-pure-whey-concentrate', 'Nutrabay Pure 100% Whey Protein Concentrate', 'Nutrabay', ARRAY['nutrabay', 'protein', 'supplement'], ARRAY['nutrabay', 'protein', 'whey concentrate'], 'supplement', 'whey-concentrate', 'supplement'::public.item_type_enum, 'raw'::public.food_state_enum, 'pan-indian'::public.region_enum,
  30, 410, 78, 7.7, 7.3, 0, 317,
  ARRAY['veg'::public.diet_type_enum, 'nonveg'::public.diet_type_enum], ARRAY['supplement'], true, 'FSSAI-label'::public.source_enum, 'high'::public.confidence_enum, 'lastVerified: 2026-05'
) ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, brand = EXCLUDED.brand, cal_per_100g = EXCLUDED.cal_per_100g, 
  protein_per_100g = EXCLUDED.protein_per_100g, carbs_per_100g = EXCLUDED.carbs_per_100g, fat_per_100g = EXCLUDED.fat_per_100g;
  

INSERT INTO public.foods (
  id, name, brand, name_alt, search_terms, category_id, subcategory, item_type, state, region,
  default_serving_grams, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sodium_per_100g,
  diet_types, tags, is_processed, source, confidence, notes
) VALUES (
  'nutrabay-pure-whey-isolate', 'Nutrabay Pure Whey Protein Isolate', 'Nutrabay', ARRAY['nutrabay', 'protein', 'supplement'], ARRAY['nutrabay', 'protein', 'whey isolate'], 'supplement', 'whey-isolate', 'supplement'::public.item_type_enum, 'raw'::public.food_state_enum, 'pan-indian'::public.region_enum,
  30, 373, 88.3, 3.3, 1.7, 0, 267,
  ARRAY['veg'::public.diet_type_enum, 'nonveg'::public.diet_type_enum], ARRAY['supplement'], true, 'FSSAI-label'::public.source_enum, 'high'::public.confidence_enum, 'lastVerified: 2026-05'
) ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, brand = EXCLUDED.brand, cal_per_100g = EXCLUDED.cal_per_100g, 
  protein_per_100g = EXCLUDED.protein_per_100g, carbs_per_100g = EXCLUDED.carbs_per_100g, fat_per_100g = EXCLUDED.fat_per_100g;
  

INSERT INTO public.foods (
  id, name, brand, name_alt, search_terms, category_id, subcategory, item_type, state, region,
  default_serving_grams, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sodium_per_100g,
  diet_types, tags, is_processed, source, confidence, notes
) VALUES (
  'amul-whey-protein', 'Amul Whey Protein (Unflavoured)', 'Amul', ARRAY['amul', 'protein', 'supplement'], ARRAY['amul', 'protein', 'whey concentrate'], 'supplement', 'whey-concentrate', 'supplement'::public.item_type_enum, 'raw'::public.food_state_enum, 'pan-indian'::public.region_enum,
  32, 369, 78.1, 6.3, 4.7, 0, 266,
  ARRAY['veg'::public.diet_type_enum, 'nonveg'::public.diet_type_enum], ARRAY['supplement'], true, 'FSSAI-label'::public.source_enum, 'high'::public.confidence_enum, 'lastVerified: 2026-05'
) ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, brand = EXCLUDED.brand, cal_per_100g = EXCLUDED.cal_per_100g, 
  protein_per_100g = EXCLUDED.protein_per_100g, carbs_per_100g = EXCLUDED.carbs_per_100g, fat_per_100g = EXCLUDED.fat_per_100g;
  

INSERT INTO public.foods (
  id, name, brand, name_alt, search_terms, category_id, subcategory, item_type, state, region,
  default_serving_grams, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sodium_per_100g,
  diet_types, tags, is_processed, source, confidence, notes
) VALUES (
  'naturaltein-whey-concentrate', 'Naturaltein Whey Protein Concentrate', 'Naturaltein', ARRAY['naturaltein', 'protein', 'supplement'], ARRAY['naturaltein', 'protein', 'whey concentrate'], 'supplement', 'whey-concentrate', 'supplement'::public.item_type_enum, 'raw'::public.food_state_enum, 'pan-indian'::public.region_enum,
  30, 367, 72, 8.3, 5.3, 0, 267,
  ARRAY['veg'::public.diet_type_enum, 'nonveg'::public.diet_type_enum], ARRAY['supplement'], true, 'FSSAI-label'::public.source_enum, 'high'::public.confidence_enum, 'lastVerified: 2026-05'
) ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, brand = EXCLUDED.brand, cal_per_100g = EXCLUDED.cal_per_100g, 
  protein_per_100g = EXCLUDED.protein_per_100g, carbs_per_100g = EXCLUDED.carbs_per_100g, fat_per_100g = EXCLUDED.fat_per_100g;
  

INSERT INTO public.foods (
  id, name, brand, name_alt, search_terms, category_id, subcategory, item_type, state, region,
  default_serving_grams, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sodium_per_100g,
  diet_types, tags, is_processed, source, confidence, notes
) VALUES (
  'muscletech-nitrotech-whey', 'MuscleTech NitroTech Whey Protein', 'MuscleTech', ARRAY['muscletech', 'protein', 'supplement'], ARRAY['muscletech', 'protein', 'whey isolate'], 'supplement', 'whey-isolate', 'supplement'::public.item_type_enum, 'raw'::public.food_state_enum, 'pan-indian'::public.region_enum,
  46, 348, 65.2, 8.7, 5.4, 0, 348,
  ARRAY['veg'::public.diet_type_enum, 'nonveg'::public.diet_type_enum], ARRAY['supplement'], true, 'FSSAI-label'::public.source_enum, 'high'::public.confidence_enum, 'lastVerified: 2026-05'
) ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, brand = EXCLUDED.brand, cal_per_100g = EXCLUDED.cal_per_100g, 
  protein_per_100g = EXCLUDED.protein_per_100g, carbs_per_100g = EXCLUDED.carbs_per_100g, fat_per_100g = EXCLUDED.fat_per_100g;
  

INSERT INTO public.foods (
  id, name, brand, name_alt, search_terms, category_id, subcategory, item_type, state, region,
  default_serving_grams, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sodium_per_100g,
  diet_types, tags, is_processed, source, confidence, notes
) VALUES (
  'protyze-clear-whey', 'Protyze Anytime Clear Whey Protein', 'Protyze', ARRAY['protyze', 'protein', 'supplement'], ARRAY['protyze', 'protein', 'clear whey'], 'supplement', 'clear-whey', 'supplement'::public.item_type_enum, 'raw'::public.food_state_enum, 'pan-indian'::public.region_enum,
  30, 343, 80, 5, 0, 0, 167,
  ARRAY['veg'::public.diet_type_enum, 'nonveg'::public.diet_type_enum], ARRAY['supplement'], true, 'FSSAI-label'::public.source_enum, 'high'::public.confidence_enum, 'lastVerified: 2026-05'
) ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, brand = EXCLUDED.brand, cal_per_100g = EXCLUDED.cal_per_100g, 
  protein_per_100g = EXCLUDED.protein_per_100g, carbs_per_100g = EXCLUDED.carbs_per_100g, fat_per_100g = EXCLUDED.fat_per_100g;
  

INSERT INTO public.foods (
  id, name, brand, name_alt, search_terms, category_id, subcategory, item_type, state, region,
  default_serving_grams, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sodium_per_100g,
  diet_types, tags, is_processed, source, confidence, notes
) VALUES (
  'kevin-levrone-gold-whey', 'Kevin Levrone Gold Whey', 'Kevin', ARRAY['kevin', 'protein', 'supplement'], ARRAY['kevin', 'protein', 'whey concentrate'], 'supplement', 'whey-concentrate', 'supplement'::public.item_type_enum, 'raw'::public.food_state_enum, 'pan-indian'::public.region_enum,
  30, 397, 73.3, 10, 6.7, 0, 283,
  ARRAY['veg'::public.diet_type_enum, 'nonveg'::public.diet_type_enum], ARRAY['supplement'], true, 'FSSAI-label'::public.source_enum, 'high'::public.confidence_enum, 'lastVerified: 2026-05'
) ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, brand = EXCLUDED.brand, cal_per_100g = EXCLUDED.cal_per_100g, 
  protein_per_100g = EXCLUDED.protein_per_100g, carbs_per_100g = EXCLUDED.carbs_per_100g, fat_per_100g = EXCLUDED.fat_per_100g;
  


INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES 
  ('mb-biozyme-whey', 'scoop', '1 scoop (33g)', 33),
  ('mb-biozyme-whey', 'g100', '100g', 100)
ON CONFLICT DO NOTHING;
  

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES 
  ('mb-biozyme-performance-whey', 'scoop', '1 scoop (36g)', 36),
  ('mb-biozyme-performance-whey', 'g100', '100g', 100)
ON CONFLICT DO NOTHING;
  

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES 
  ('mb-raw-whey-concentrate', 'scoop', '1 scoop (33g)', 33),
  ('mb-raw-whey-concentrate', 'g100', '100g', 100)
ON CONFLICT DO NOTHING;
  

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES 
  ('asitis-atom-whey', 'scoop', '1 scoop (33g)', 33),
  ('asitis-atom-whey', 'g100', '100g', 100)
ON CONFLICT DO NOTHING;
  

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES 
  ('asitis-raw-whey-concentrate', 'scoop', '1 scoop (33g)', 33),
  ('asitis-raw-whey-concentrate', 'g100', '100g', 100)
ON CONFLICT DO NOTHING;
  

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES 
  ('twt-whey-concentrate-unflavored', 'scoop', '1 scoop (30g)', 30),
  ('twt-whey-concentrate-unflavored', 'g100', '100g', 100)
ON CONFLICT DO NOTHING;
  

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES 
  ('twt-whey-isolate-unflavored', 'scoop', '1 scoop (33g)', 33),
  ('twt-whey-isolate-unflavored', 'g100', '100g', 100)
ON CONFLICT DO NOTHING;
  

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES 
  ('nakpro-impact-whey', 'scoop', '1 scoop (33g)', 33),
  ('nakpro-impact-whey', 'g100', '100g', 100)
ON CONFLICT DO NOTHING;
  

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES 
  ('avvatar-absolute-whey', 'scoop', '1 scoop (36g)', 36),
  ('avvatar-absolute-whey', 'g100', '100g', 100)
ON CONFLICT DO NOTHING;
  

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES 
  ('truebasics-clean-whey-isolate', 'scoop', '1 scoop (33g)', 33),
  ('truebasics-clean-whey-isolate', 'g100', '100g', 100)
ON CONFLICT DO NOTHING;
  

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES 
  ('on-gold-standard-whey', 'scoop', '1 scoop (30g)', 30),
  ('on-gold-standard-whey', 'g100', '100g', 100)
ON CONFLICT DO NOTHING;
  

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES 
  ('on-gold-standard-whey-isolate', 'scoop', '1 scoop (31g)', 31),
  ('on-gold-standard-whey-isolate', 'g100', '100g', 100)
ON CONFLICT DO NOTHING;
  

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES 
  ('myprotein-impact-whey-concentrate', 'scoop', '1 scoop (25g)', 25),
  ('myprotein-impact-whey-concentrate', 'g100', '100g', 100)
ON CONFLICT DO NOTHING;
  

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES 
  ('myprotein-impact-whey-isolate', 'scoop', '1 scoop (25g)', 25),
  ('myprotein-impact-whey-isolate', 'g100', '100g', 100)
ON CONFLICT DO NOTHING;
  

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES 
  ('dymatize-iso100', 'scoop', '1 scoop (31g)', 31),
  ('dymatize-iso100', 'g100', '100g', 100)
ON CONFLICT DO NOTHING;
  

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES 
  ('bigmuscles-premium-gold-whey', 'scoop', '1 scoop (36g)', 36),
  ('bigmuscles-premium-gold-whey', 'g100', '100g', 100)
ON CONFLICT DO NOTHING;
  

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES 
  ('gnc-pro-performance-whey', 'scoop', '1 scoop (34g)', 34),
  ('gnc-pro-performance-whey', 'g100', '100g', 100)
ON CONFLICT DO NOTHING;
  

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES 
  ('tata-1mg-whey', 'scoop', '1 scoop (36g)', 36),
  ('tata-1mg-whey', 'g100', '100g', 100)
ON CONFLICT DO NOTHING;
  

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES 
  ('mb-mass-gainer-xxl', 'scoop', '1 scoop (150g)', 150),
  ('mb-mass-gainer-xxl', 'g100', '100g', 100)
ON CONFLICT DO NOTHING;
  

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES 
  ('mb-super-gainer-xxl', 'scoop', '1 scoop (75g)', 75),
  ('mb-super-gainer-xxl', 'g100', '100g', 100)
ON CONFLICT DO NOTHING;
  

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES 
  ('mb-lean-mass-gainer', 'scoop', '1 scoop (75g)', 75),
  ('mb-lean-mass-gainer', 'g100', '100g', 100)
ON CONFLICT DO NOTHING;
  

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES 
  ('asitis-atom-mass-gainer', 'scoop', '1 scoop (100g)', 100),
  ('asitis-atom-mass-gainer', 'g100', '100g', 100)
ON CONFLICT DO NOTHING;
  

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES 
  ('on-serious-mass', 'scoop', '1 scoop (334g)', 334),
  ('on-serious-mass', 'g100', '100g', 100)
ON CONFLICT DO NOTHING;
  

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES 
  ('on-serious-mass-half', 'scoop', '1 scoop (167g)', 167),
  ('on-serious-mass-half', 'g100', '100g', 100)
ON CONFLICT DO NOTHING;
  

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES 
  ('labrada-muscle-mass-gainer', 'scoop', '1 scoop (336g)', 336),
  ('labrada-muscle-mass-gainer', 'g100', '100g', 100)
ON CONFLICT DO NOTHING;
  

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES 
  ('muscletech-mass-tech-extreme', 'scoop', '1 scoop (334g)', 334),
  ('muscletech-mass-tech-extreme', 'g100', '100g', 100)
ON CONFLICT DO NOTHING;
  

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES 
  ('gnc-pro-performance-weight-gainer', 'scoop', '1 scoop (315g)', 315),
  ('gnc-pro-performance-weight-gainer', 'g100', '100g', 100)
ON CONFLICT DO NOTHING;
  

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES 
  ('bsn-true-mass-1200', 'scoop', '1 scoop (254g)', 254),
  ('bsn-true-mass-1200', 'g100', '100g', 100)
ON CONFLICT DO NOTHING;
  

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES 
  ('mb-biozyme-iso-zero', 'scoop', '1 scoop (34g)', 34),
  ('mb-biozyme-iso-zero', 'g100', '100g', 100)
ON CONFLICT DO NOTHING;
  

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES 
  ('nutrabay-pure-whey-concentrate', 'scoop', '1 scoop (30g)', 30),
  ('nutrabay-pure-whey-concentrate', 'g100', '100g', 100)
ON CONFLICT DO NOTHING;
  

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES 
  ('nutrabay-pure-whey-isolate', 'scoop', '1 scoop (30g)', 30),
  ('nutrabay-pure-whey-isolate', 'g100', '100g', 100)
ON CONFLICT DO NOTHING;
  

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES 
  ('amul-whey-protein', 'scoop', '1 scoop (32g)', 32),
  ('amul-whey-protein', 'g100', '100g', 100)
ON CONFLICT DO NOTHING;
  

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES 
  ('naturaltein-whey-concentrate', 'scoop', '1 scoop (30g)', 30),
  ('naturaltein-whey-concentrate', 'g100', '100g', 100)
ON CONFLICT DO NOTHING;
  

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES 
  ('muscletech-nitrotech-whey', 'scoop', '1 scoop (46g)', 46),
  ('muscletech-nitrotech-whey', 'g100', '100g', 100)
ON CONFLICT DO NOTHING;
  

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES 
  ('protyze-clear-whey', 'scoop', '1 scoop (30g)', 30),
  ('protyze-clear-whey', 'g100', '100g', 100)
ON CONFLICT DO NOTHING;
  

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES 
  ('kevin-levrone-gold-whey', 'scoop', '1 scoop (30g)', 30),
  ('kevin-levrone-gold-whey', 'g100', '100g', 100)
ON CONFLICT DO NOTHING;
  