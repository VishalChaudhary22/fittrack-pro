-- INDB Deep Expansion (Phase 3)

INSERT INTO public.food_categories (id, label)
VALUES ('veg-dish', 'Vegetarian Dishes')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.food_categories (id, label)
VALUES ('meal-combo', 'Meal Combos')
ON CONFLICT (id) DO NOTHING;


INSERT INTO public.foods (
  id, name, brand, name_alt, search_terms, category_id, subcategory, item_type, state, region,
  default_serving_grams, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sodium_per_100g,
  diet_types, tags, is_processed, is_recipe, source, confidence, last_verified, notes
) VALUES (
  'bisi-bele-bath', 'Bisi Bele Bath', 'Generic', ARRAY['bisi bele bath', 'bisi', 'bele', 'bath'], ARRAY['bisi bele bath', 'bisi', 'bele', 'bath', 'rice dish'], 'rice-dish', 'regional', 'dish'::public.item_type_enum, 'cooked'::public.food_state_enum, 'pan-indian'::public.region_enum,
  250, 140, 3.5, 22, 4, 2, NULL,
  ARRAY['veg'::public.diet_type_enum], ARRAY['regional', 'indb-deep'], false, true, 'curated-estimate'::public.source_enum, 'high'::public.confidence_enum, '2026-05-01', 'Karnataka spicy rice and dal'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.foods (
  id, name, brand, name_alt, search_terms, category_id, subcategory, item_type, state, region,
  default_serving_grams, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sodium_per_100g,
  diet_types, tags, is_processed, is_recipe, source, confidence, last_verified, notes
) VALUES (
  'neer-dosa', 'Neer Dosa', 'Generic', ARRAY['neer dosa', 'neer', 'dosa'], ARRAY['neer dosa', 'neer', 'dosa', 'roti bread'], 'roti-bread', 'regional', 'dish'::public.item_type_enum, 'cooked'::public.food_state_enum, 'pan-indian'::public.region_enum,
  45, 150, 2.5, 30, 2, 1, NULL,
  ARRAY['veg'::public.diet_type_enum], ARRAY['regional', 'indb-deep'], false, true, 'curated-estimate'::public.source_enum, 'high'::public.confidence_enum, '2026-05-01', 'Mangalorean thin rice crepe'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.foods (
  id, name, brand, name_alt, search_terms, category_id, subcategory, item_type, state, region,
  default_serving_grams, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sodium_per_100g,
  diet_types, tags, is_processed, is_recipe, source, confidence, last_verified, notes
) VALUES (
  'kuzhi-paniyaram', 'Kuzhi Paniyaram', 'Generic', ARRAY['kuzhi paniyaram', 'kuzhi', 'paniyaram'], ARRAY['kuzhi paniyaram', 'kuzhi', 'paniyaram', 'snack street'], 'snack-street', 'regional', 'dish'::public.item_type_enum, 'cooked'::public.food_state_enum, 'pan-indian'::public.region_enum,
  25, 195, 4, 30, 6, 2, NULL,
  ARRAY['veg'::public.diet_type_enum], ARRAY['regional', 'indb-deep'], false, true, 'curated-estimate'::public.source_enum, 'high'::public.confidence_enum, '2026-05-01', 'South Indian rice batter balls'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.foods (
  id, name, brand, name_alt, search_terms, category_id, subcategory, item_type, state, region,
  default_serving_grams, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sodium_per_100g,
  diet_types, tags, is_processed, is_recipe, source, confidence, last_verified, notes
) VALUES (
  'puttu', 'Puttu', 'Generic', ARRAY['puttu', 'puttu'], ARRAY['puttu', 'puttu', 'roti bread'], 'roti-bread', 'regional', 'dish'::public.item_type_enum, 'cooked'::public.food_state_enum, 'pan-indian'::public.region_enum,
  100, 170, 3.5, 35, 1, 2, NULL,
  ARRAY['veg'::public.diet_type_enum], ARRAY['regional', 'indb-deep'], false, true, 'curated-estimate'::public.source_enum, 'high'::public.confidence_enum, '2026-05-01', 'Kerala steamed rice cake'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.foods (
  id, name, brand, name_alt, search_terms, category_id, subcategory, item_type, state, region,
  default_serving_grams, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sodium_per_100g,
  diet_types, tags, is_processed, is_recipe, source, confidence, last_verified, notes
) VALUES (
  'kadala-curry', 'Kadala Curry', 'Generic', ARRAY['kadala curry', 'kadala', 'curry'], ARRAY['kadala curry', 'kadala', 'curry', 'dal legume'], 'dal-legume', 'regional', 'dish'::public.item_type_enum, 'cooked'::public.food_state_enum, 'pan-indian'::public.region_enum,
  150, 135, 6, 18, 4.5, 5, NULL,
  ARRAY['veg'::public.diet_type_enum], ARRAY['regional', 'indb-deep'], false, true, 'curated-estimate'::public.source_enum, 'high'::public.confidence_enum, '2026-05-01', 'Kerala black chickpea curry'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.foods (
  id, name, brand, name_alt, search_terms, category_id, subcategory, item_type, state, region,
  default_serving_grams, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sodium_per_100g,
  diet_types, tags, is_processed, is_recipe, source, confidence, last_verified, notes
) VALUES (
  'chettinad-chicken', 'Chettinad Chicken', 'Generic', ARRAY['chettinad chicken', 'chettinad', 'chicken'], ARRAY['chettinad chicken', 'chettinad', 'chicken', 'non veg'], 'non-veg', 'regional', 'dish'::public.item_type_enum, 'cooked'::public.food_state_enum, 'pan-indian'::public.region_enum,
  150, 160, 14, 5, 9, 1, NULL,
  ARRAY['nonveg'::public.diet_type_enum], ARRAY['regional', 'indb-deep'], false, true, 'curated-estimate'::public.source_enum, 'high'::public.confidence_enum, '2026-05-01', 'Spicy Tamil Nadu chicken curry'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.foods (
  id, name, brand, name_alt, search_terms, category_id, subcategory, item_type, state, region,
  default_serving_grams, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sodium_per_100g,
  diet_types, tags, is_processed, is_recipe, source, confidence, last_verified, notes
) VALUES (
  'vangi-bath', 'Vangi Bath', 'Generic', ARRAY['vangi bath', 'vangi', 'bath'], ARRAY['vangi bath', 'vangi', 'bath', 'rice dish'], 'rice-dish', 'regional', 'dish'::public.item_type_enum, 'cooked'::public.food_state_enum, 'pan-indian'::public.region_enum,
  250, 160, 3, 28, 4, 2, NULL,
  ARRAY['veg'::public.diet_type_enum], ARRAY['regional', 'indb-deep'], false, true, 'curated-estimate'::public.source_enum, 'high'::public.confidence_enum, '2026-05-01', 'Karnataka eggplant rice'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.foods (
  id, name, brand, name_alt, search_terms, category_id, subcategory, item_type, state, region,
  default_serving_grams, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sodium_per_100g,
  diet_types, tags, is_processed, is_recipe, source, confidence, last_verified, notes
) VALUES (
  'gatte-ki-sabzi', 'Gatte ki Sabzi', 'Generic', ARRAY['gatte ki sabzi', 'gatte', 'ki', 'sabzi'], ARRAY['gatte ki sabzi', 'gatte', 'ki', 'sabzi', 'veg dish'], 'veg-dish', 'regional', 'dish'::public.item_type_enum, 'cooked'::public.food_state_enum, 'pan-indian'::public.region_enum,
  150, 145, 5, 14, 8, 2, NULL,
  ARRAY['veg'::public.diet_type_enum], ARRAY['regional', 'indb-deep'], false, true, 'curated-estimate'::public.source_enum, 'high'::public.confidence_enum, '2026-05-01', 'Rajasthani gram flour dumplings in yogurt gravy'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.foods (
  id, name, brand, name_alt, search_terms, category_id, subcategory, item_type, state, region,
  default_serving_grams, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sodium_per_100g,
  diet_types, tags, is_processed, is_recipe, source, confidence, last_verified, notes
) VALUES (
  'pyaaz-kachori', 'Pyaaz Kachori', 'Generic', ARRAY['pyaaz kachori', 'pyaaz', 'kachori'], ARRAY['pyaaz kachori', 'pyaaz', 'kachori', 'snack street'], 'snack-street', 'regional', 'dish'::public.item_type_enum, 'cooked'::public.food_state_enum, 'pan-indian'::public.region_enum,
  120, 310, 4, 38, 16, 2, NULL,
  ARRAY['veg'::public.diet_type_enum], ARRAY['regional', 'indb-deep'], false, true, 'curated-estimate'::public.source_enum, 'high'::public.confidence_enum, '2026-05-01', 'Rajasthani deep-fried onion pastry'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.foods (
  id, name, brand, name_alt, search_terms, category_id, subcategory, item_type, state, region,
  default_serving_grams, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sodium_per_100g,
  diet_types, tags, is_processed, is_recipe, source, confidence, last_verified, notes
) VALUES (
  'laal-maas', 'Laal Maas', 'Generic', ARRAY['laal maas', 'laal', 'maas'], ARRAY['laal maas', 'laal', 'maas', 'non veg'], 'non-veg', 'regional', 'dish'::public.item_type_enum, 'cooked'::public.food_state_enum, 'pan-indian'::public.region_enum,
  150, 190, 12, 4, 14, 1, NULL,
  ARRAY['nonveg'::public.diet_type_enum], ARRAY['regional', 'indb-deep'], false, true, 'curated-estimate'::public.source_enum, 'high'::public.confidence_enum, '2026-05-01', 'Rajasthani spicy mutton curry'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.foods (
  id, name, brand, name_alt, search_terms, category_id, subcategory, item_type, state, region,
  default_serving_grams, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sodium_per_100g,
  diet_types, tags, is_processed, is_recipe, source, confidence, last_verified, notes
) VALUES (
  'mirchi-bada', 'Mirchi Bada', 'Generic', ARRAY['mirchi bada', 'mirchi', 'bada'], ARRAY['mirchi bada', 'mirchi', 'bada', 'snack street'], 'snack-street', 'regional', 'dish'::public.item_type_enum, 'cooked'::public.food_state_enum, 'pan-indian'::public.region_enum,
  100, 240, 4, 26, 13, 3, NULL,
  ARRAY['veg'::public.diet_type_enum], ARRAY['regional', 'indb-deep'], false, true, 'curated-estimate'::public.source_enum, 'high'::public.confidence_enum, '2026-05-01', 'Rajasthani potato stuffed chili fritter'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.foods (
  id, name, brand, name_alt, search_terms, category_id, subcategory, item_type, state, region,
  default_serving_grams, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sodium_per_100g,
  diet_types, tags, is_processed, is_recipe, source, confidence, last_verified, notes
) VALUES (
  'undhiyu', 'Undhiyu', 'Generic', ARRAY['undhiyu', 'undhiyu'], ARRAY['undhiyu', 'undhiyu', 'veg dish'], 'veg-dish', 'regional', 'dish'::public.item_type_enum, 'cooked'::public.food_state_enum, 'pan-indian'::public.region_enum,
  150, 130, 3, 15, 6, 4, NULL,
  ARRAY['veg'::public.diet_type_enum], ARRAY['regional', 'indb-deep'], false, true, 'curated-estimate'::public.source_enum, 'high'::public.confidence_enum, '2026-05-01', 'Gujarati mixed vegetable dish'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.foods (
  id, name, brand, name_alt, search_terms, category_id, subcategory, item_type, state, region,
  default_serving_grams, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sodium_per_100g,
  diet_types, tags, is_processed, is_recipe, source, confidence, last_verified, notes
) VALUES (
  'khandvi', 'Khandvi', 'Generic', ARRAY['khandvi', 'khandvi'], ARRAY['khandvi', 'khandvi', 'snack street'], 'snack-street', 'regional', 'dish'::public.item_type_enum, 'cooked'::public.food_state_enum, 'pan-indian'::public.region_enum,
  15, 110, 4, 16, 3, 2, NULL,
  ARRAY['veg'::public.diet_type_enum], ARRAY['regional', 'indb-deep'], false, true, 'curated-estimate'::public.source_enum, 'high'::public.confidence_enum, '2026-05-01', 'Gujarati gram flour rolls'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.foods (
  id, name, brand, name_alt, search_terms, category_id, subcategory, item_type, state, region,
  default_serving_grams, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sodium_per_100g,
  diet_types, tags, is_processed, is_recipe, source, confidence, last_verified, notes
) VALUES (
  'thepla', 'Thepla', 'Generic', ARRAY['thepla', 'thepla'], ARRAY['thepla', 'thepla', 'roti bread'], 'roti-bread', 'regional', 'dish'::public.item_type_enum, 'cooked'::public.food_state_enum, 'pan-indian'::public.region_enum,
  40, 280, 7, 42, 9, 5, NULL,
  ARRAY['veg'::public.diet_type_enum], ARRAY['regional', 'indb-deep'], false, true, 'curated-estimate'::public.source_enum, 'high'::public.confidence_enum, '2026-05-01', 'Gujarati spiced flatbread with fenugreek'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.foods (
  id, name, brand, name_alt, search_terms, category_id, subcategory, item_type, state, region,
  default_serving_grams, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sodium_per_100g,
  diet_types, tags, is_processed, is_recipe, source, confidence, last_verified, notes
) VALUES (
  'fafda', 'Fafda', 'Generic', ARRAY['fafda', 'fafda'], ARRAY['fafda', 'fafda', 'snack street'], 'snack-street', 'regional', 'dish'::public.item_type_enum, 'cooked'::public.food_state_enum, 'pan-indian'::public.region_enum,
  30, 480, 10, 45, 28, 4, NULL,
  ARRAY['veg'::public.diet_type_enum], ARRAY['regional', 'indb-deep'], false, true, 'curated-estimate'::public.source_enum, 'high'::public.confidence_enum, '2026-05-01', 'Gujarati deep-fried chickpea snack'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.foods (
  id, name, brand, name_alt, search_terms, category_id, subcategory, item_type, state, region,
  default_serving_grams, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sodium_per_100g,
  diet_types, tags, is_processed, is_recipe, source, confidence, last_verified, notes
) VALUES (
  'handvo', 'Handvo', 'Generic', ARRAY['handvo', 'handvo'], ARRAY['handvo', 'handvo', 'snack street'], 'snack-street', 'regional', 'dish'::public.item_type_enum, 'cooked'::public.food_state_enum, 'pan-indian'::public.region_enum,
  60, 210, 7, 30, 7, 4, NULL,
  ARRAY['veg'::public.diet_type_enum], ARRAY['regional', 'indb-deep'], false, true, 'curated-estimate'::public.source_enum, 'high'::public.confidence_enum, '2026-05-01', 'Gujarati savory baked lentil cake'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.foods (
  id, name, brand, name_alt, search_terms, category_id, subcategory, item_type, state, region,
  default_serving_grams, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sodium_per_100g,
  diet_types, tags, is_processed, is_recipe, source, confidence, last_verified, notes
) VALUES (
  'patra', 'Patra', 'Generic', ARRAY['patra', 'patra'], ARRAY['patra', 'patra', 'snack street'], 'snack-street', 'regional', 'dish'::public.item_type_enum, 'cooked'::public.food_state_enum, 'pan-indian'::public.region_enum,
  25, 180, 5, 28, 5, 3, NULL,
  ARRAY['veg'::public.diet_type_enum], ARRAY['regional', 'indb-deep'], false, true, 'curated-estimate'::public.source_enum, 'high'::public.confidence_enum, '2026-05-01', 'Gujarati colocasia leaves snack'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.foods (
  id, name, brand, name_alt, search_terms, category_id, subcategory, item_type, state, region,
  default_serving_grams, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sodium_per_100g,
  diet_types, tags, is_processed, is_recipe, source, confidence, last_verified, notes
) VALUES (
  'cholar-dal', 'Cholar Dal', 'Generic', ARRAY['cholar dal', 'cholar', 'dal'], ARRAY['cholar dal', 'cholar', 'dal', 'dal legume'], 'dal-legume', 'regional', 'dish'::public.item_type_enum, 'cooked'::public.food_state_enum, 'pan-indian'::public.region_enum,
  150, 140, 5.5, 20, 4.5, 4, NULL,
  ARRAY['veg'::public.diet_type_enum], ARRAY['regional', 'indb-deep'], false, true, 'curated-estimate'::public.source_enum, 'high'::public.confidence_enum, '2026-05-01', 'Bengali chana dal with coconut'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.foods (
  id, name, brand, name_alt, search_terms, category_id, subcategory, item_type, state, region,
  default_serving_grams, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sodium_per_100g,
  diet_types, tags, is_processed, is_recipe, source, confidence, last_verified, notes
) VALUES (
  'shukto', 'Shukto', 'Generic', ARRAY['shukto', 'shukto'], ARRAY['shukto', 'shukto', 'veg dish'], 'veg-dish', 'regional', 'dish'::public.item_type_enum, 'cooked'::public.food_state_enum, 'pan-indian'::public.region_enum,
  150, 100, 2.5, 12, 4.5, 3, NULL,
  ARRAY['veg'::public.diet_type_enum], ARRAY['regional', 'indb-deep'], false, true, 'curated-estimate'::public.source_enum, 'high'::public.confidence_enum, '2026-05-01', 'Bengali mixed veg bitter stew'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.foods (
  id, name, brand, name_alt, search_terms, category_id, subcategory, item_type, state, region,
  default_serving_grams, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sodium_per_100g,
  diet_types, tags, is_processed, is_recipe, source, confidence, last_verified, notes
) VALUES (
  'kosha-mangsho', 'Kosha Mangsho', 'Generic', ARRAY['kosha mangsho', 'kosha', 'mangsho'], ARRAY['kosha mangsho', 'kosha', 'mangsho', 'non veg'], 'non-veg', 'regional', 'dish'::public.item_type_enum, 'cooked'::public.food_state_enum, 'pan-indian'::public.region_enum,
  150, 210, 13, 5, 15, 1, NULL,
  ARRAY['nonveg'::public.diet_type_enum], ARRAY['regional', 'indb-deep'], false, true, 'curated-estimate'::public.source_enum, 'high'::public.confidence_enum, '2026-05-01', 'Bengali slow-cooked mutton curry'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.foods (
  id, name, brand, name_alt, search_terms, category_id, subcategory, item_type, state, region,
  default_serving_grams, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sodium_per_100g,
  diet_types, tags, is_processed, is_recipe, source, confidence, last_verified, notes
) VALUES (
  'machher-jhol', 'Machher Jhol', 'Generic', ARRAY['machher jhol', 'machher', 'jhol'], ARRAY['machher jhol', 'machher', 'jhol', 'non veg'], 'non-veg', 'regional', 'dish'::public.item_type_enum, 'cooked'::public.food_state_enum, 'pan-indian'::public.region_enum,
  150, 120, 10, 4, 7, 1, NULL,
  ARRAY['nonveg'::public.diet_type_enum], ARRAY['regional', 'indb-deep'], false, true, 'curated-estimate'::public.source_enum, 'high'::public.confidence_enum, '2026-05-01', 'Bengali light fish curry'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.foods (
  id, name, brand, name_alt, search_terms, category_id, subcategory, item_type, state, region,
  default_serving_grams, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sodium_per_100g,
  diet_types, tags, is_processed, is_recipe, source, confidence, last_verified, notes
) VALUES (
  'aloo-posto', 'Aloo Posto', 'Generic', ARRAY['aloo posto', 'aloo', 'posto'], ARRAY['aloo posto', 'aloo', 'posto', 'veg dish'], 'veg-dish', 'regional', 'dish'::public.item_type_enum, 'cooked'::public.food_state_enum, 'pan-indian'::public.region_enum,
  150, 160, 3, 22, 6, 2, NULL,
  ARRAY['veg'::public.diet_type_enum], ARRAY['regional', 'indb-deep'], false, true, 'curated-estimate'::public.source_enum, 'high'::public.confidence_enum, '2026-05-01', 'Bengali potato with poppy seeds'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.foods (
  id, name, brand, name_alt, search_terms, category_id, subcategory, item_type, state, region,
  default_serving_grams, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sodium_per_100g,
  diet_types, tags, is_processed, is_recipe, source, confidence, last_verified, notes
) VALUES (
  'jhal-muri', 'Jhal Muri', 'Generic', ARRAY['jhal muri', 'jhal', 'muri'], ARRAY['jhal muri', 'jhal', 'muri', 'snack street'], 'snack-street', 'regional', 'dish'::public.item_type_enum, 'cooked'::public.food_state_enum, 'pan-indian'::public.region_enum,
  60, 350, 8, 65, 7, 5, NULL,
  ARRAY['veg'::public.diet_type_enum], ARRAY['regional', 'indb-deep'], false, true, 'curated-estimate'::public.source_enum, 'high'::public.confidence_enum, '2026-05-01', 'Bengali puffed rice snack'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.foods (
  id, name, brand, name_alt, search_terms, category_id, subcategory, item_type, state, region,
  default_serving_grams, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sodium_per_100g,
  diet_types, tags, is_processed, is_recipe, source, confidence, last_verified, notes
) VALUES (
  'misal-pav', 'Misal Pav', 'Generic', ARRAY['misal pav', 'misal', 'pav'], ARRAY['misal pav', 'misal', 'pav', 'meal combo'], 'meal-combo', 'regional', 'dish'::public.item_type_enum, 'cooked'::public.food_state_enum, 'pan-indian'::public.region_enum,
  300, 220, 7, 32, 7, 5, NULL,
  ARRAY['veg'::public.diet_type_enum], ARRAY['regional', 'indb-deep'], false, true, 'curated-estimate'::public.source_enum, 'high'::public.confidence_enum, '2026-05-01', 'Maharashtrian sprouted moth bean curry with bread'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.foods (
  id, name, brand, name_alt, search_terms, category_id, subcategory, item_type, state, region,
  default_serving_grams, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sodium_per_100g,
  diet_types, tags, is_processed, is_recipe, source, confidence, last_verified, notes
) VALUES (
  'dabeli', 'Dabeli', 'Generic', ARRAY['dabeli', 'dabeli'], ARRAY['dabeli', 'dabeli', 'snack street'], 'snack-street', 'regional', 'dish'::public.item_type_enum, 'cooked'::public.food_state_enum, 'pan-indian'::public.region_enum,
  120, 240, 4, 42, 6, 3, NULL,
  ARRAY['veg'::public.diet_type_enum], ARRAY['regional', 'indb-deep'], false, true, 'curated-estimate'::public.source_enum, 'high'::public.confidence_enum, '2026-05-01', 'Kutchi sweet & spicy potato burger'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.foods (
  id, name, brand, name_alt, search_terms, category_id, subcategory, item_type, state, region,
  default_serving_grams, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sodium_per_100g,
  diet_types, tags, is_processed, is_recipe, source, confidence, last_verified, notes
) VALUES (
  'litti-chokha', 'Litti Chokha', 'Generic', ARRAY['litti chokha', 'litti', 'chokha'], ARRAY['litti chokha', 'litti', 'chokha', 'meal combo'], 'meal-combo', 'regional', 'dish'::public.item_type_enum, 'cooked'::public.food_state_enum, 'pan-indian'::public.region_enum,
  200, 250, 8, 40, 6, 6, NULL,
  ARRAY['veg'::public.diet_type_enum], ARRAY['regional', 'indb-deep'], false, true, 'curated-estimate'::public.source_enum, 'high'::public.confidence_enum, '2026-05-01', 'Bihari stuffed wheat balls with roasted eggplant'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.foods (
  id, name, brand, name_alt, search_terms, category_id, subcategory, item_type, state, region,
  default_serving_grams, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sodium_per_100g,
  diet_types, tags, is_processed, is_recipe, source, confidence, last_verified, notes
) VALUES (
  'thalipeeth', 'Thalipeeth', 'Generic', ARRAY['thalipeeth', 'thalipeeth'], ARRAY['thalipeeth', 'thalipeeth', 'roti bread'], 'roti-bread', 'regional', 'dish'::public.item_type_enum, 'cooked'::public.food_state_enum, 'pan-indian'::public.region_enum,
  80, 260, 8, 40, 7, 6, NULL,
  ARRAY['veg'::public.diet_type_enum], ARRAY['regional', 'indb-deep'], false, true, 'curated-estimate'::public.source_enum, 'high'::public.confidence_enum, '2026-05-01', 'Maharashtrian multigrain flatbread'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.foods (
  id, name, brand, name_alt, search_terms, category_id, subcategory, item_type, state, region,
  default_serving_grams, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sodium_per_100g,
  diet_types, tags, is_processed, is_recipe, source, confidence, last_verified, notes
) VALUES (
  'puran-poli', 'Puran Poli', 'Generic', ARRAY['puran poli', 'puran', 'poli'], ARRAY['puran poli', 'puran', 'poli', 'sweet mithai'], 'sweet-mithai', 'regional', 'dish'::public.item_type_enum, 'cooked'::public.food_state_enum, 'pan-indian'::public.region_enum,
  80, 310, 6, 58, 6, 4, NULL,
  ARRAY['veg'::public.diet_type_enum], ARRAY['regional', 'indb-deep'], false, true, 'curated-estimate'::public.source_enum, 'high'::public.confidence_enum, '2026-05-01', 'Maharashtrian sweet lentil flatbread'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.foods (
  id, name, brand, name_alt, search_terms, category_id, subcategory, item_type, state, region,
  default_serving_grams, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sodium_per_100g,
  diet_types, tags, is_processed, is_recipe, source, confidence, last_verified, notes
) VALUES (
  'sabudana-khichdi', 'Sabudana Khichdi', 'Generic', ARRAY['sabudana khichdi', 'sabudana', 'khichdi'], ARRAY['sabudana khichdi', 'sabudana', 'khichdi', 'snack street'], 'snack-street', 'regional', 'dish'::public.item_type_enum, 'cooked'::public.food_state_enum, 'pan-indian'::public.region_enum,
  200, 280, 2, 50, 8, 1, NULL,
  ARRAY['veg'::public.diet_type_enum], ARRAY['regional', 'indb-deep'], false, true, 'curated-estimate'::public.source_enum, 'high'::public.confidence_enum, '2026-05-01', 'Maharashtrian tapioca pearl dish'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.foods (
  id, name, brand, name_alt, search_terms, category_id, subcategory, item_type, state, region,
  default_serving_grams, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sodium_per_100g,
  diet_types, tags, is_processed, is_recipe, source, confidence, last_verified, notes
) VALUES (
  'kanda-poha', 'Kanda Poha', 'Generic', ARRAY['kanda poha', 'kanda', 'poha'], ARRAY['kanda poha', 'kanda', 'poha', 'snack street'], 'snack-street', 'regional', 'dish'::public.item_type_enum, 'cooked'::public.food_state_enum, 'pan-indian'::public.region_enum,
  150, 180, 4, 32, 4, 2, NULL,
  ARRAY['veg'::public.diet_type_enum], ARRAY['regional', 'indb-deep'], false, true, 'curated-estimate'::public.source_enum, 'high'::public.confidence_enum, '2026-05-01', 'Maharashtrian flattened rice with onions'
) ON CONFLICT (id) DO NOTHING;


INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('bisi-bele-bath', 'plate', '1 plate', 250)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('bisi-bele-bath', 'bowl', '1 bowl', 200)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('bisi-bele-bath', 'g100', '100g', 100)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('neer-dosa', 'piece', '1 dosa', 45)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('neer-dosa', 'g100', '100g', 100)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('kuzhi-paniyaram', 'piece', '1 piece', 25)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('kuzhi-paniyaram', 'g100', '100g', 100)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('puttu', 'piece', '1 piece (log)', 100)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('puttu', 'g100', '100g', 100)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('kadala-curry', 'katori', '1 katori', 150)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('kadala-curry', 'g100', '100g', 100)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('chettinad-chicken', 'katori', '1 katori', 150)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('chettinad-chicken', 'bowl', '1 bowl', 250)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('chettinad-chicken', 'g100', '100g', 100)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('vangi-bath', 'plate', '1 plate', 250)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('vangi-bath', 'g100', '100g', 100)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('gatte-ki-sabzi', 'katori', '1 katori', 150)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('gatte-ki-sabzi', 'g100', '100g', 100)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('pyaaz-kachori', 'piece', '1 piece', 120)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('pyaaz-kachori', 'g100', '100g', 100)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('laal-maas', 'katori', '1 katori', 150)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('laal-maas', 'bowl', '1 bowl', 250)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('laal-maas', 'g100', '100g', 100)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('mirchi-bada', 'piece', '1 piece', 100)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('mirchi-bada', 'g100', '100g', 100)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('undhiyu', 'katori', '1 katori', 150)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('undhiyu', 'g100', '100g', 100)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('khandvi', 'piece', '1 piece', 15)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('khandvi', 'g100', '100g', 100)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('thepla', 'piece', '1 thepla', 40)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('thepla', 'g100', '100g', 100)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('fafda', 'handful', '1 handful', 30)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('fafda', 'plate', '1 plate', 100)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('fafda', 'g100', '100g', 100)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('handvo', 'piece', '1 slice', 60)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('handvo', 'g100', '100g', 100)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('patra', 'piece', '1 slice', 25)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('patra', 'g100', '100g', 100)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('cholar-dal', 'katori', '1 katori', 150)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('cholar-dal', 'g100', '100g', 100)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('shukto', 'katori', '1 katori', 150)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('shukto', 'g100', '100g', 100)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('kosha-mangsho', 'katori', '1 katori', 150)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('kosha-mangsho', 'bowl', '1 bowl', 250)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('kosha-mangsho', 'g100', '100g', 100)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('machher-jhol', 'katori', '1 katori', 150)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('machher-jhol', 'bowl', '1 bowl', 250)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('machher-jhol', 'g100', '100g', 100)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('aloo-posto', 'katori', '1 katori', 150)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('aloo-posto', 'g100', '100g', 100)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('jhal-muri', 'packet', '1 thonga/cone', 60)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('jhal-muri', 'g100', '100g', 100)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('misal-pav', 'plate', '1 plate (2 pav)', 300)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('misal-pav', 'g100', '100g', 100)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('dabeli', 'piece', '1 piece', 120)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('dabeli', 'g100', '100g', 100)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('litti-chokha', 'plate', '1 plate (2 litti)', 200)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('litti-chokha', 'g100', '100g', 100)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('thalipeeth', 'piece', '1 thalipeeth', 80)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('thalipeeth', 'g100', '100g', 100)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('puran-poli', 'piece', '1 puran poli', 80)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('puran-poli', 'g100', '100g', 100)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('sabudana-khichdi', 'plate', '1 plate', 200)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('sabudana-khichdi', 'katori', '1 katori', 100)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('sabudana-khichdi', 'g100', '100g', 100)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('kanda-poha', 'plate', '1 plate', 150)
ON CONFLICT DO NOTHING;

INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('kanda-poha', 'g100', '100g', 100)
ON CONFLICT DO NOTHING;