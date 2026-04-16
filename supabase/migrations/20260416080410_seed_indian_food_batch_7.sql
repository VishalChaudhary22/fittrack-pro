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
INSERT INTO public.standard_servings (id, label, default_grams, used_for) VALUES ('packet', '1 packet', 70, 'maggi, noodles, small snacks') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.standard_servings (id, label, default_grams, used_for) VALUES ('packet-lg', '1 large packet', 100, 'large snacks') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.standard_servings (id, label, default_grams, used_for) VALUES ('packet-sm', '1 small packet', 30, 'small snacks') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.standard_servings (id, label, default_grams, used_for) VALUES ('sachet', '1 sachet', 15, 'ketchup, sauces') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.standard_servings (id, label, default_grams, used_for) VALUES ('grande', 'grande (auto)', 50, 'Auto-extracted') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.standard_servings (id, label, default_grams, used_for) VALUES ('chicken-breast-raw', 'chicken-breast-raw (auto)', 50, 'Auto-extracted') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.standard_servings (id, label, default_grams, used_for) VALUES ('mtr-ready-to-eat-dal-fry', 'mtr-ready-to-eat-dal-fry (auto)', 50, 'Auto-extracted') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.standard_servings (id, label, default_grams, used_for) VALUES ('butter-chicken', 'butter-chicken (auto)', 50, 'Auto-extracted') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.standard_servings (id, label, default_grams, used_for) VALUES ('upma-rava', 'upma-rava (auto)', 50, 'Auto-extracted') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.standard_servings (id, label, default_grams, used_for) VALUES ('subway-paneer-tikka-sub', 'subway-paneer-tikka-sub (auto)', 50, 'Auto-extracted') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.standard_servings (id, label, default_grams, used_for) VALUES ('chaas-plain', 'chaas-plain (auto)', 50, 'Auto-extracted') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.standard_servings (id, label, default_grams, used_for) VALUES ('gulab-jamun', 'gulab-jamun (auto)', 50, 'Auto-extracted') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.standard_servings (id, label, default_grams, used_for) VALUES ('maggi-hot-heads-cup', 'maggi-hot-heads-cup (auto)', 50, 'Auto-extracted') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.standard_servings (id, label, default_grams, used_for) VALUES ('pack-300', 'pack-300 (auto)', 50, 'Auto-extracted') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.standard_servings (id, label, default_grams, used_for) VALUES ('pani-puri', 'pani-puri (auto)', 50, 'Auto-extracted') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.standard_servings (id, label, default_grams, used_for) VALUES ('cafe-latte-regular', 'cafe-latte-regular (auto)', 50, 'Auto-extracted') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.standard_servings (id, label, default_grams, used_for) VALUES ('can-full', 'can-full (auto)', 50, 'Auto-extracted') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.standard_servings (id, label, default_grams, used_for) VALUES ('dal-toor-cooked', 'dal-toor-cooked (auto)', 50, 'Auto-extracted') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.standard_servings (id, label, default_grams, used_for) VALUES ('pav-bhaji', 'pav-bhaji (auto)', 50, 'Auto-extracted') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.standard_servings (id, label, default_grams, used_for) VALUES ('bottle-large', 'bottle-large (auto)', 50, 'Auto-extracted') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.standard_servings (id, label, default_grams, used_for) VALUES ('moong-dal-chilla', 'moong-dal-chilla (auto)', 50, 'Auto-extracted') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.standard_servings (id, label, default_grams, used_for) VALUES ('chicken-tikka', 'chicken-tikka (auto)', 50, 'Auto-extracted') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.standard_servings (id, label, default_grams, used_for) VALUES ('dominos-choco-lava-cake', 'dominos-choco-lava-cake (auto)', 50, 'Auto-extracted') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.standard_servings (id, label, default_grams, used_for) VALUES ('besan-chilla', 'besan-chilla (auto)', 50, 'Auto-extracted') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.standard_servings (id, label, default_grams, used_for) VALUES ('besan-ladoo', 'besan-ladoo (auto)', 50, 'Auto-extracted') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.standard_servings (id, label, default_grams, used_for) VALUES ('kfc-hot-crispy-1pc', 'kfc-hot-crispy-1pc (auto)', 50, 'Auto-extracted') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.standard_servings (id, label, default_grams, used_for) VALUES ('yippee-noodles-masala', 'yippee-noodles-masala (auto)', 50, 'Auto-extracted') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.standard_servings (id, label, default_grams, used_for) VALUES ('ghee', 'ghee (auto)', 50, 'Auto-extracted') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.standard_servings (id, label, default_grams, used_for) VALUES ('sattu-drink-namkeen', 'sattu-drink-namkeen (auto)', 50, 'Auto-extracted') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.standard_servings (id, label, default_grams, used_for) VALUES ('vada-pav', 'vada-pav (auto)', 50, 'Auto-extracted') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.standard_servings (id, label, default_grams, used_for) VALUES ('khakhra-plain', 'khakhra-plain (auto)', 50, 'Auto-extracted') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.standard_servings (id, label, default_grams, used_for) VALUES ('mcd-mcspicy-chicken', 'mcd-mcspicy-chicken (auto)', 50, 'Auto-extracted') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.standard_servings (id, label, default_grams, used_for) VALUES ('mutton-rogan-josh', 'mutton-rogan-josh (auto)', 50, 'Auto-extracted') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.standard_servings (id, label, default_grams, used_for) VALUES ('beer-lager', 'beer-lager (auto)', 50, 'Auto-extracted') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.standard_servings (id, label, default_grams, used_for) VALUES ('dal-baati-churma', 'dal-baati-churma (auto)', 50, 'Auto-extracted') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.standard_servings (id, label, default_grams, used_for) VALUES ('chicken-curry', 'chicken-curry (auto)', 50, 'Auto-extracted') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.standard_servings (id, label, default_grams, used_for) VALUES ('knorr-soupy-noodles', 'knorr-soupy-noodles (auto)', 50, 'Auto-extracted') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.standard_servings (id, label, default_grams, used_for) VALUES ('egg-bhurji-masala', 'egg-bhurji-masala (auto)', 50, 'Auto-extracted') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.standard_servings (id, label, default_grams, used_for) VALUES ('mcd-mcspicy-paneer', 'mcd-mcspicy-paneer (auto)', 50, 'Auto-extracted') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.standard_servings (id, label, default_grams, used_for) VALUES ('pack-400', 'pack-400 (auto)', 50, 'Auto-extracted') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.standard_servings (id, label, default_grams, used_for) VALUES ('rasgulla', 'rasgulla (auto)', 50, 'Auto-extracted') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.standard_servings (id, label, default_grams, used_for) VALUES ('maggi-atta-masala', 'maggi-atta-masala (auto)', 50, 'Auto-extracted') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.standard_servings (id, label, default_grams, used_for) VALUES ('greek-yogurt-epigamia', 'greek-yogurt-epigamia (auto)', 50, 'Auto-extracted') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.standard_servings (id, label, default_grams, used_for) VALUES ('rajma-curry', 'rajma-curry (auto)', 50, 'Auto-extracted') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.standard_servings (id, label, default_grams, used_for) VALUES ('paneer-bhurji', 'paneer-bhurji (auto)', 50, 'Auto-extracted') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.standard_servings (id, label, default_grams, used_for) VALUES ('chaayos-kulhad-chai', 'chaayos-kulhad-chai (auto)', 50, 'Auto-extracted') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.standard_servings (id, label, default_grams, used_for) VALUES ('egg-boiled', 'egg-boiled (auto)', 50, 'Auto-extracted') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.standard_servings (id, label, default_grams, used_for) VALUES ('makhana-roasted', 'makhana-roasted (auto)', 50, 'Auto-extracted') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.standard_servings (id, label, default_grams, used_for) VALUES ('pasta-arabiatta-veg', 'pasta-arabiatta-veg (auto)', 50, 'Auto-extracted') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.standard_servings (id, label, default_grams, used_for) VALUES ('bhel-puri', 'bhel-puri (auto)', 50, 'Auto-extracted') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.standard_servings (id, label, default_grams, used_for) VALUES ('tbsp-2', 'tbsp-2 (auto)', 50, 'Auto-extracted') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.standard_servings (id, label, default_grams, used_for) VALUES ('soya-chunks-dry', 'soya-chunks-dry (auto)', 50, 'Auto-extracted') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.standard_servings (id, label, default_grams, used_for) VALUES ('mcd-french-fries-medium', 'mcd-french-fries-medium (auto)', 50, 'Auto-extracted') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.standard_servings (id, label, default_grams, used_for) VALUES ('peanut-butter-creamy', 'peanut-butter-creamy (auto)', 50, 'Auto-extracted') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.standard_servings (id, label, default_grams, used_for) VALUES ('kaju-katli', 'kaju-katli (auto)', 50, 'Auto-extracted') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.standard_servings (id, label, default_grams, used_for) VALUES ('banana-raw', 'banana-raw (auto)', 50, 'Auto-extracted') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.standard_servings (id, label, default_grams, used_for) VALUES ('oats-bagrrys-rolled', 'oats-bagrrys-rolled (auto)', 50, 'Auto-extracted') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.standard_servings (id, label, default_grams, used_for) VALUES ('box8-paneer-makhani-meal', 'box8-paneer-makhani-meal (auto)', 50, 'Auto-extracted') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.standard_servings (id, label, default_grams, used_for) VALUES ('roasted-chana', 'roasted-chana (auto)', 50, 'Auto-extracted') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.standard_servings (id, label, default_grams, used_for) VALUES ('ml100', 'ml100 (auto)', 50, 'Auto-extracted') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.standard_servings (id, label, default_grams, used_for) VALUES ('idli-steamed', 'idli-steamed (auto)', 50, 'Auto-extracted') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.standard_servings (id, label, default_grams, used_for) VALUES ('egg-bhurji', 'egg-bhurji (auto)', 50, 'Auto-extracted') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.standard_servings (id, label, default_grams, used_for) VALUES ('ice-cream-vanilla-scoop', 'ice-cream-vanilla-scoop (auto)', 50, 'Auto-extracted') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.standard_servings (id, label, default_grams, used_for) VALUES ('maggi-masala-single', 'maggi-masala-single (auto)', 50, 'Auto-extracted') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.standard_servings (id, label, default_grams, used_for) VALUES ('pack-285', 'pack-285 (auto)', 50, 'Auto-extracted') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.standard_servings (id, label, default_grams, used_for) VALUES ('chole-bhature', 'chole-bhature (auto)', 50, 'Auto-extracted') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.standard_servings (id, label, default_grams, used_for) VALUES ('dhokla', 'dhokla (auto)', 50, 'Auto-extracted') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.standard_servings (id, label, default_grams, used_for) VALUES ('rice-white-cooked', 'rice-white-cooked (auto)', 50, 'Auto-extracted') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.standard_servings (id, label, default_grams, used_for) VALUES ('egg-curry', 'egg-curry (auto)', 50, 'Auto-extracted') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.standard_servings (id, label, default_grams, used_for) VALUES ('poha', 'poha (auto)', 50, 'Auto-extracted') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.standard_servings (id, label, default_grams, used_for) VALUES ('tuna-canned', 'tuna-canned (auto)', 50, 'Auto-extracted') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.standard_servings (id, label, default_grams, used_for) VALUES ('milk-full-fat', 'milk-full-fat (auto)', 50, 'Auto-extracted') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.standard_servings (id, label, default_grams, used_for) VALUES ('jalebi', 'jalebi (auto)', 50, 'Auto-extracted') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.standard_servings (id, label, default_grams, used_for) VALUES ('slice-2', 'slice-2 (auto)', 50, 'Auto-extracted') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.standard_servings (id, label, default_grams, used_for) VALUES ('motichoor-ladoo', 'motichoor-ladoo (auto)', 50, 'Auto-extracted') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.standard_servings (id, label, default_grams, used_for) VALUES ('acai-bowl-berry', 'acai-bowl-berry (auto)', 50, 'Auto-extracted') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.standard_servings (id, label, default_grams, used_for) VALUES ('curd-full-fat', 'curd-full-fat (auto)', 50, 'Auto-extracted') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.standard_servings (id, label, default_grams, used_for) VALUES ('milk-toned', 'milk-toned (auto)', 50, 'Auto-extracted') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.standard_servings (id, label, default_grams, used_for) VALUES ('paneer-low-fat', 'paneer-low-fat (auto)', 50, 'Auto-extracted') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.standard_servings (id, label, default_grams, used_for) VALUES ('peg-large', 'peg-large (auto)', 50, 'Auto-extracted') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.standard_servings (id, label, default_grams, used_for) VALUES ('pack-small', 'pack-small (auto)', 50, 'Auto-extracted') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.standard_servings (id, label, default_grams, used_for) VALUES ('shawarma-chicken-wrap', 'shawarma-chicken-wrap (auto)', 50, 'Auto-extracted') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.standard_servings (id, label, default_grams, used_for) VALUES ('masala-dosa', 'masala-dosa (auto)', 50, 'Auto-extracted') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.standard_servings (id, label, default_grams, used_for) VALUES ('omelette-1-egg', 'omelette-1-egg (auto)', 50, 'Auto-extracted') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.standard_servings (id, label, default_grams, used_for) VALUES ('tandoori-chicken', 'tandoori-chicken (auto)', 50, 'Auto-extracted') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.standard_servings (id, label, default_grams, used_for) VALUES ('boba-taro-milk-tea', 'boba-taro-milk-tea (auto)', 50, 'Auto-extracted') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.standard_servings (id, label, default_grams, used_for) VALUES ('aloo-gobi', 'aloo-gobi (auto)', 50, 'Auto-extracted') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.standard_servings (id, label, default_grams, used_for) VALUES ('samosa', 'samosa (auto)', 50, 'Auto-extracted') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.standard_servings (id, label, default_grams, used_for) VALUES ('roti-wheat', 'roti-wheat (auto)', 50, 'Auto-extracted') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.standard_servings (id, label, default_grams, used_for) VALUES ('subway-chicken-slice-sub', 'subway-chicken-slice-sub (auto)', 50, 'Auto-extracted') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.standard_servings (id, label, default_grams, used_for) VALUES ('biryani-veg-restaurant', 'biryani-veg-restaurant (auto)', 50, 'Auto-extracted') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.standard_servings (id, label, default_grams, used_for) VALUES ('egg-white', 'egg-white (auto)', 50, 'Auto-extracted') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.standard_servings (id, label, default_grams, used_for) VALUES ('lassi-sweet', 'lassi-sweet (auto)', 50, 'Auto-extracted') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.standard_servings (id, label, default_grams, used_for) VALUES ('plant-mock-meat-sausage', 'plant-mock-meat-sausage (auto)', 50, 'Auto-extracted') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.standard_servings (id, label, default_grams, used_for) VALUES ('bajra-roti', 'bajra-roti (auto)', 50, 'Auto-extracted') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.standard_servings (id, label, default_grams, used_for) VALUES ('dominos-peppy-paneer', 'dominos-peppy-paneer (auto)', 50, 'Auto-extracted') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.standard_servings (id, label, default_grams, used_for) VALUES ('wow-momo-steamed-chicken', 'wow-momo-steamed-chicken (auto)', 50, 'Auto-extracted') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.standard_servings (id, label, default_grams, used_for) VALUES ('hakka-noodles-veg', 'hakka-noodles-veg (auto)', 50, 'Auto-extracted') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.standard_servings (id, label, default_grams, used_for) VALUES ('paratha-aloo', 'paratha-aloo (auto)', 50, 'Auto-extracted') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.standard_servings (id, label, default_grams, used_for) VALUES ('uttapam', 'uttapam (auto)', 50, 'Auto-extracted') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.standard_servings (id, label, default_grams, used_for) VALUES ('moong-sprouts-raw', 'moong-sprouts-raw (auto)', 50, 'Auto-extracted') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.standard_servings (id, label, default_grams, used_for) VALUES ('top-ramen-curry-noodles', 'top-ramen-curry-noodles (auto)', 50, 'Auto-extracted') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.standard_servings (id, label, default_grams, used_for) VALUES ('mango-raw', 'mango-raw (auto)', 50, 'Auto-extracted') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.standard_servings (id, label, default_grams, used_for) VALUES ('medu-vada', 'medu-vada (auto)', 50, 'Auto-extracted') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.standard_servings (id, label, default_grams, used_for) VALUES ('palak-paneer', 'palak-paneer (auto)', 50, 'Auto-extracted') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.standard_servings (id, label, default_grams, used_for) VALUES ('boba-classic-milk-tea', 'boba-classic-milk-tea (auto)', 50, 'Auto-extracted') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.standard_servings (id, label, default_grams, used_for) VALUES ('plain-dosa', 'plain-dosa (auto)', 50, 'Auto-extracted') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.standard_servings (id, label, default_grams, used_for) VALUES ('whiskey-30ml', 'whiskey-30ml (auto)', 50, 'Auto-extracted') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.standard_servings (id, label, default_grams, used_for) VALUES ('pack-140', 'pack-140 (auto)', 50, 'Auto-extracted') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.standard_servings (id, label, default_grams, used_for) VALUES ('pho-chicken-noodle-soup', 'pho-chicken-noodle-soup (auto)', 50, 'Auto-extracted') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.standard_servings (id, label, default_grams, used_for) VALUES ('paneer-full-fat', 'paneer-full-fat (auto)', 50, 'Auto-extracted') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.standard_servings (id, label, default_grams, used_for) VALUES ('mcd-mcaloo-tikki', 'mcd-mcaloo-tikki (auto)', 50, 'Auto-extracted') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.standard_servings (id, label, default_grams, used_for) VALUES ('bk-veg-whopper', 'bk-veg-whopper (auto)', 50, 'Auto-extracted') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.standard_servings (id, label, default_grams, used_for) VALUES ('pakora-onion', 'pakora-onion (auto)', 50, 'Auto-extracted') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.standard_servings (id, label, default_grams, used_for) VALUES ('oats-quaker-rolled', 'oats-quaker-rolled (auto)', 50, 'Auto-extracted') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.standard_servings (id, label, default_grams, used_for) VALUES ('tiramisu-slice', 'tiramisu-slice (auto)', 50, 'Auto-extracted') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.standard_servings (id, label, default_grams, used_for) VALUES ('rava-idli', 'rava-idli (auto)', 50, 'Auto-extracted') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.standard_servings (id, label, default_grams, used_for) VALUES ('fish-curry', 'fish-curry (auto)', 50, 'Auto-extracted') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.standard_servings (id, label, default_grams, used_for) VALUES ('pongal', 'pongal (auto)', 50, 'Auto-extracted') ON CONFLICT (id) DO NOTHING;

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
  'maggi-masala-single', 
  'Maggi 2-Minute Masala Noodles', 
  'मैगी मसाला', 
  ARRAY['magi', 'instant noodles']::TEXT[], 
  ARRAY['maggi', 'magi', '2 minute noodles', 'masala maggi']::TEXT[], 
  'packaged-food', 
  'instant-noodle', 
  'snack'::public.item_type_enum, 
  'cooked'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  70,
  442, 10, 60, 17.1, 2,
  1228, NULL, NULL, 2, 20,
  '{"veg"}'::public.diet_type_enum[], 
  ARRAY['snack', 'high-sodium', 'high-carb']::TEXT[], 
  '{}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  true, false, false, false, false, false,
  70, 
  'Contains pre-added fat in the seasoning and noodle block.', 
  0, 
  'FSSAI-label'::public.source_enum, 
  'high'::public.confidence_enum, 
  'Calculated using typical 70g packet cooked in water. High sodium content.'
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

  -- Servings for maggi-masala-single
  DELETE FROM public.food_servings WHERE food_id = 'maggi-masala-single';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('maggi-masala-single', 'packet', '1 packet', 70);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('maggi-masala-single', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'maggi-atta-masala', 
  'Maggi Atta (Whole Wheat) Noodles', 
  'मैगी आटा नूडल्स', 
  ARRAY['atta magi']::TEXT[], 
  ARRAY['maggi atta', 'wheat maggi', 'atta noodles']::TEXT[], 
  'packaged-food', 
  'instant-noodle', 
  'snack'::public.item_type_enum, 
  'cooked'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  75,
  386, 10.6, 53.3, 14.6, 5.3,
  900, NULL, NULL, 2.5, 40,
  '{"veg"}'::public.diet_type_enum[], 
  ARRAY['snack', 'high-carb']::TEXT[], 
  '{}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  true, false, false, false, false, false,
  65, 
  NULL, 
  0, 
  'FSSAI-label'::public.source_enum, 
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

  -- Servings for maggi-atta-masala
  DELETE FROM public.food_servings WHERE food_id = 'maggi-atta-masala';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('maggi-atta-masala', 'packet', '1 packet', 75);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('maggi-atta-masala', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'yippee-noodles-masala', 
  'Sunfeast YiPPee! Noodles', 
  'यिप्पी नूडल्स', 
  ARRAY['ipee noodles', 'yipee']::TEXT[], 
  ARRAY['yippee', 'yipee', 'sunfeast', 'instant noodles']::TEXT[], 
  'packaged-food', 
  'instant-noodle', 
  'snack'::public.item_type_enum, 
  'cooked'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  70,
  500, 11.4, 68.5, 20, 2,
  1100, NULL, NULL, 1.5, 25,
  '{"veg"}'::public.diet_type_enum[], 
  ARRAY['snack', 'high-carb', 'high-sodium']::TEXT[], 
  '{}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  true, false, false, false, false, false,
  70, 
  NULL, 
  0, 
  'FSSAI-label'::public.source_enum, 
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

  -- Servings for yippee-noodles-masala
  DELETE FROM public.food_servings WHERE food_id = 'yippee-noodles-masala';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('yippee-noodles-masala', 'packet', '1 packet', 70);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('yippee-noodles-masala', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'nissin-cup-noodles-masala', 
  'Nissin Cup Noodles (Masala)', 
  'कप नूडल्स', 
  ARRAY['cup maggi']::TEXT[], 
  ARRAY['cup noodles', 'nissin', 'masala cup', 'instant cup']::TEXT[], 
  'packaged-food', 
  'instant-noodle', 
  'snack'::public.item_type_enum, 
  'cooked'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  70,
  414, 8.5, 54.2, 17.1, 2,
  950, NULL, NULL, 1, 15,
  '{"veg"}'::public.diet_type_enum[], 
  ARRAY['snack', 'high-carb']::TEXT[], 
  '{}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  true, false, false, false, false, false,
  70, 
  NULL, 
  0, 
  'FSSAI-label'::public.source_enum, 
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

  -- Servings for nissin-cup-noodles-masala
  DELETE FROM public.food_servings WHERE food_id = 'nissin-cup-noodles-masala';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('nissin-cup-noodles-masala', 'cup', '1 cup', 70);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('nissin-cup-noodles-masala', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'top-ramen-curry-noodles', 
  'Top Ramen Curry Noodles', 
  'टॉप रेमन करी', 
  ARRAY['ramen india']::TEXT[], 
  ARRAY['top ramen', 'curry noodles', 'ramen', 'instant curry']::TEXT[], 
  'packaged-food', 
  'instant-noodle', 
  'snack'::public.item_type_enum, 
  'cooked'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  70,
  442, 10, 60, 17.1, 2,
  1200, NULL, NULL, 2, 20,
  '{"veg"}'::public.diet_type_enum[], 
  ARRAY['snack', 'high-sodium']::TEXT[], 
  '{}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  true, false, false, false, false, false,
  70, 
  NULL, 
  0, 
  'FSSAI-label'::public.source_enum, 
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

  -- Servings for top-ramen-curry-noodles
  DELETE FROM public.food_servings WHERE food_id = 'top-ramen-curry-noodles';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('top-ramen-curry-noodles', 'packet', '1 packet', 70);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('top-ramen-curry-noodles', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'knorr-soupy-noodles', 
  'Knorr Soupy Noodles', 
  'नोर सूपी नूडल्स', 
  ARRAY['soupy maggi']::TEXT[], 
  ARRAY['knorr', 'soupy noodles', 'knor', 'soup maggi']::TEXT[], 
  'packaged-food', 
  'instant-noodle', 
  'snack'::public.item_type_enum, 
  'cooked'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  66,
  363, 7.5, 54.5, 13.6, 2,
  1050, NULL, NULL, 1.5, 15,
  '{"veg"}'::public.diet_type_enum[], 
  ARRAY['snack', 'high-sodium']::TEXT[], 
  '{}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  true, false, false, false, false, false,
  68, 
  NULL, 
  0, 
  'FSSAI-label'::public.source_enum, 
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

  -- Servings for knorr-soupy-noodles
  DELETE FROM public.food_servings WHERE food_id = 'knorr-soupy-noodles';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('knorr-soupy-noodles', 'packet', '1 packet', 66);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('knorr-soupy-noodles', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'maggi-hot-heads-cup', 
  'Maggi Hot Heads Cup Noodles', 
  'मैगी हॉट हेड्स', 
  ARRAY['spicy maggi cup']::TEXT[], 
  ARRAY['hot heads', 'maggi spicy cup', 'spicy maggi']::TEXT[], 
  'packaged-food', 
  'instant-noodle', 
  'snack'::public.item_type_enum, 
  'cooked'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  71,
  422, 8.4, 56.3, 18.3, 2,
  1100, NULL, NULL, 1.5, 20,
  '{"veg"}'::public.diet_type_enum[], 
  ARRAY['snack', 'spicy']::TEXT[], 
  '{}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  true, false, false, false, false, false,
  70, 
  NULL, 
  0, 
  'FSSAI-label'::public.source_enum, 
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

  -- Servings for maggi-hot-heads-cup
  DELETE FROM public.food_servings WHERE food_id = 'maggi-hot-heads-cup';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('maggi-hot-heads-cup', 'cup', '1 cup', 71);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('maggi-hot-heads-cup', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'mtr-ready-to-eat-rajma-rice', 
  'MTR Ready to Eat Rajma Rice', 
  'एमटीआर राजमा चावल', 
  ARRAY['packaged rajma chawal']::TEXT[], 
  ARRAY['mtr rajma', 'rajma rice ready', 'packaged rajma']::TEXT[], 
  'packaged-food', 
  'cloud-kitchen', 
  'dish'::public.item_type_enum, 
  'cooked'::public.food_state_enum, 
  'north'::public.region_enum, 
  300,
  160, 5, 24, 5, 4.5,
  350, NULL, NULL, 1.8, 30,
  '{"veg"}'::public.diet_type_enum[], 
  ARRAY['lunch', 'dinner']::TEXT[], 
  '{}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  true, false, true, false, true, false,
  58, 
  NULL, 
  3, 
  'FSSAI-label'::public.source_enum, 
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

  -- Servings for mtr-ready-to-eat-rajma-rice
  DELETE FROM public.food_servings WHERE food_id = 'mtr-ready-to-eat-rajma-rice';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('mtr-ready-to-eat-rajma-rice', 'packet', '1 packet', 300);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('mtr-ready-to-eat-rajma-rice', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'mtr-ready-to-eat-dal-fry', 
  'MTR Ready to Eat Dal Fry', 
  'एमटीआर दाल फ्राई', 
  ARRAY['packaged dal']::TEXT[], 
  ARRAY['mtr dal fry', 'packaged dal']::TEXT[], 
  'packaged-food', 
  'indian-packaged-namkeen', 
  'dish'::public.item_type_enum, 
  'cooked'::public.food_state_enum, 
  'north'::public.region_enum, 
  300,
  100, 5, 12, 3, 3,
  380, NULL, NULL, 1.5, 20,
  '{"veg"}'::public.diet_type_enum[], 
  ARRAY['lunch', 'dinner']::TEXT[], 
  '{}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  true, false, true, false, true, false,
  48, 
  NULL, 
  2, 
  'FSSAI-label'::public.source_enum, 
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

  -- Servings for mtr-ready-to-eat-dal-fry
  DELETE FROM public.food_servings WHERE food_id = 'mtr-ready-to-eat-dal-fry';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('mtr-ready-to-eat-dal-fry', 'packet', '1 packet', 300);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('mtr-ready-to-eat-dal-fry', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'canned-baked-beans-generic', 
  'Canned Baked Beans (Generic)', 
  'बेक्ड बीन्स', 
  ARRAY['heinz baked beans', 'beans in tomato sauce']::TEXT[], 
  ARRAY['baked beans', 'canned beans', 'heinz beans', 'tomato beans']::TEXT[], 
  'packaged-food', 
  'cafe-food', 
  'dish'::public.item_type_enum, 
  'cooked'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  200,
  95, 5, 17, 0.5, 4,
  300, NULL, NULL, 1.5, 30,
  '{"vegan","veg","nonveg"}'::public.diet_type_enum[], 
  ARRAY['breakfast', 'high-fiber']::TEXT[], 
  '{}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  true, false, true, false, false, false,
  48, 
  NULL, 
  0, 
  'FSSAI-label'::public.source_enum, 
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

  -- Servings for canned-baked-beans-generic
  DELETE FROM public.food_servings WHERE food_id = 'canned-baked-beans-generic';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('canned-baked-beans-generic', 'can-half', 'Half can', 200);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('canned-baked-beans-generic', 'can-full', 'Full can', 400);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('canned-baked-beans-generic', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'peanut-butter-creamy', 
  'Peanut Butter (Creamy, Plain)', 
  'पीनट बटर', 
  ARRAY['smooth peanut butter']::TEXT[], 
  ARRAY['peanut butter', 'pb', 'creamy peanut butter', 'sandwich butter']::TEXT[], 
  'condiment', 
  'spreads', 
  'condiment'::public.item_type_enum, 
  'raw'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  15,
  588, 25, 20, 50, 6,
  400, NULL, NULL, 1.9, 43,
  '{"vegan","veg","jain"}'::public.diet_type_enum[], 
  ARRAY['snack', 'high-protein', 'high-fat']::TEXT[], 
  '{}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  true, false, true, false, false, false,
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

  -- Servings for peanut-butter-creamy
  DELETE FROM public.food_servings WHERE food_id = 'peanut-butter-creamy';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('peanut-butter-creamy', 'tbsp', '1 tbsp', 15);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('peanut-butter-creamy', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'ritebite-max-protein-choco-fudge', 
  'RiteBite Max Protein Bar (Choco Fudge)', 
  'मैक्स प्रोटीन बार', 
  ARRAY['rite bite bar']::TEXT[], 
  ARRAY['ritebite', 'max protein', 'protein bar', 'choco fudge bar']::TEXT[], 
  'supplement', 
  'protein-bar', 
  'snack'::public.item_type_enum, 
  'raw'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  67,
  283, 29.8, 25.3, 8.9, 8,
  250, 2, 2.5, 3.5, 150,
  '{"veg"}'::public.diet_type_enum[], 
  ARRAY['snack', 'high-protein']::TEXT[], 
  '{}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  true, false, false, false, false, false,
  NULL, 
  NULL, 
  0, 
  'FSSAI-label'::public.source_enum, 
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

  -- Servings for ritebite-max-protein-choco-fudge
  DELETE FROM public.food_servings WHERE food_id = 'ritebite-max-protein-choco-fudge';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('ritebite-max-protein-choco-fudge', 'bar', '1 bar', 67);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('ritebite-max-protein-choco-fudge', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'sattu-drink-namkeen', 
  'Sattu Drink (Savoury/Namkeen)', 
  'सत्तू नमकीन', 
  ARRAY['sattu sharbat']::TEXT[], 
  ARRAY['sattu', 'sattu sharbat', 'roasted gram drink', 'namkeen sattu']::TEXT[], 
  'drink', 
  'cooling-drink', 
  'drink'::public.item_type_enum, 
  'raw'::public.food_state_enum, 
  'east'::public.region_enum, 
  250,
  64, 3.2, 10.4, 1, 2.5,
  150, NULL, NULL, 1.5, 15,
  '{"vegan","veg","jain","nonveg"}'::public.diet_type_enum[], 
  ARRAY['high-protein', 'cooling', 'budget-friendly']::TEXT[], 
  '{}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  false, false, true, true, false, false,
  40, 
  NULL, 
  0, 
  'curated-estimate'::public.source_enum, 
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

  -- Servings for sattu-drink-namkeen
  DELETE FROM public.food_servings WHERE food_id = 'sattu-drink-namkeen';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('sattu-drink-namkeen', 'glass', '1 glass', 250);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('sattu-drink-namkeen', 'ml100', '100ml', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'chaas-plain', 
  'Chaas / Buttermilk (Plain, Mattha)', 
  'छाछ', 
  ARRAY['mattha', 'taak', 'majjiga']::TEXT[], 
  ARRAY['chaas', 'buttermilk', 'mattha', 'taak', 'majjiga', 'chhas']::TEXT[], 
  'drink', 
  'cooling-drink', 
  'drink'::public.item_type_enum, 
  'raw'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  200,
  20, 1.2, 2.4, 0.5, 0,
  40, 0.1, NULL, 0.1, 45,
  '{"veg","jain"}'::public.diet_type_enum[], 
  ARRAY['cooling', 'probiotic', 'low-calorie']::TEXT[], 
  '{"navratri","ekadashi"}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  false, true, true, true, false, false,
  30, 
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

  -- Servings for chaas-plain
  DELETE FROM public.food_servings WHERE food_id = 'chaas-plain';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('chaas-plain', 'glass', '1 glass', 200);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('chaas-plain', 'ml100', '100ml', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'paneer-bhurji', 
  'Paneer Bhurji (Scrambled Paneer)', 
  'पनीर भुर्जी', 
  ARRAY['masala paneer scramble']::TEXT[], 
  ARRAY['paneer bhurji', 'scrambled paneer', 'paneer masala']::TEXT[], 
  'sabzi-veg', 
  'north-indian', 
  'dish'::public.item_type_enum, 
  'cooked'::public.food_state_enum, 
  'north'::public.region_enum, 
  150,
  240, 12, 6, 18, 1.5,
  300, NULL, NULL, 1, 200,
  '{"veg"}'::public.diet_type_enum[], 
  ARRAY['lunch', 'dinner', 'high-protein', 'low-carb']::TEXT[], 
  '{}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  false, false, true, true, true, false,
  20, 
  'Cooked with oil/ghee and onions/tomatoes.', 
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

  -- Servings for paneer-bhurji
  DELETE FROM public.food_servings WHERE food_id = 'paneer-bhurji';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('paneer-bhurji', 'katori', '1 katori', 150);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('paneer-bhurji', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'egg-bhurji-masala', 
  'Egg Bhurji (Indian Scrambled Eggs)', 
  'अंडा भुर्जी', 
  ARRAY['anda bhurji']::TEXT[], 
  ARRAY['egg bhurji', 'anda bhurji', 'scrambled eggs', 'spicy egg']::TEXT[], 
  'non-veg', 
  'egg-dish', 
  'dish'::public.item_type_enum, 
  'cooked'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  120,
  183, 11.5, 3.5, 13.5, 0.5,
  350, 1.1, 1, 1.4, 45,
  '{"egg","nonveg"}'::public.diet_type_enum[], 
  ARRAY['breakfast', 'high-protein', 'low-carb']::TEXT[], 
  '{}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  false, false, true, true, true, false,
  NULL, 
  'Contains 1 tbsp oil/butter per 2 eggs.', 
  7, 
  'USDA'::public.source_enum, 
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

  -- Servings for egg-bhurji-masala
  DELETE FROM public.food_servings WHERE food_id = 'egg-bhurji-masala';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('egg-bhurji-masala', 'plate', '1 plate (2 eggs)', 120);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('egg-bhurji-masala', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'biryani-chicken-restaurant', 
  'Chicken Biryani (Restaurant Style)', 
  'चिकन बिरयानी', 
  ARRAY['murgh biryani']::TEXT[], 
  ARRAY['biryani', 'chicken biryani', 'murgh biryani', 'restaurant biryani']::TEXT[], 
  'rice-dish', 
  'biryani-chain', 
  'dish'::public.item_type_enum, 
  'cooked'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  400,
  180, 8.5, 22, 6.5, 1.5,
  400, 0.8, NULL, 1.2, 30,
  '{"nonveg"}'::public.diet_type_enum[], 
  ARRAY['lunch', 'dinner', 'restaurant-common', 'calorie-dense']::TEXT[], 
  '{}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  false, false, true, true, true, false,
  62, 
  'Cooked with ghee and oil.', 
  12, 
  'curated-estimate'::public.source_enum, 
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

  -- Servings for biryani-chicken-restaurant
  DELETE FROM public.food_servings WHERE food_id = 'biryani-chicken-restaurant';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('biryani-chicken-restaurant', 'plate', '1 plate', 400);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('biryani-chicken-restaurant', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'biryani-hyderabadi-chicken', 
  'Hyderabadi Chicken Biryani (Dum)', 
  'हैदराबादी चिकन बिरयानी', 
  ARRAY['dum biryani']::TEXT[], 
  ARRAY['hyderabadi', 'dum biryani', 'chicken dum']::TEXT[], 
  'rice-dish', 
  'biryani-chain', 
  'dish'::public.item_type_enum, 
  'cooked'::public.food_state_enum, 
  'south'::public.region_enum, 
  400,
  195, 9, 21, 8, 1.2,
  420, 0.9, NULL, 1.4, 35,
  '{"nonveg"}'::public.diet_type_enum[], 
  ARRAY['lunch', 'dinner', 'restaurant-common', 'high-protein']::TEXT[], 
  '{}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  false, false, true, true, true, false,
  60, 
  'Contains more ghee/fat due to dum style.', 
  15, 
  'curated-estimate'::public.source_enum, 
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

  -- Servings for biryani-hyderabadi-chicken
  DELETE FROM public.food_servings WHERE food_id = 'biryani-hyderabadi-chicken';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('biryani-hyderabadi-chicken', 'plate', '1 plate', 400);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('biryani-hyderabadi-chicken', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'biryani-veg-restaurant', 
  'Veg Biryani / Pulao (Restaurant)', 
  'वेज बिरयानी', 
  ARRAY['vegetable biryani', 'tarkari biryani']::TEXT[], 
  ARRAY['veg biryani', 'pulao', 'vegetable biryani']::TEXT[], 
  'rice-dish', 
  'biryani-chain', 
  'dish'::public.item_type_enum, 
  'cooked'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  350,
  160, 4, 26, 4.5, 2.5,
  350, NULL, NULL, 1, 25,
  '{"veg"}'::public.diet_type_enum[], 
  ARRAY['lunch', 'dinner', 'restaurant-common']::TEXT[], 
  '{}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  false, false, true, true, true, false,
  64, 
  'Variables depend on vegetable mix.', 
  10, 
  'curated-estimate'::public.source_enum, 
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

  -- Servings for biryani-veg-restaurant
  DELETE FROM public.food_servings WHERE food_id = 'biryani-veg-restaurant';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('biryani-veg-restaurant', 'plate', '1 plate', 350);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('biryani-veg-restaurant', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'dominos-margherita-regular', 
  'Domino''s Margherita Pizza (Regular)', 
  'डोमिनोज़ मार्गेरिटा', 
  ARRAY['dominos plain cheese']::TEXT[], 
  ARRAY['dominos', 'margherita', 'regular pizza', 'cheese pizza dominos']::TEXT[], 
  'packaged-food', 
  'qsr-pizza', 
  'snack'::public.item_type_enum, 
  'baked'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  100,
  266, 11.5, 33.1, 9.8, 2,
  520, NULL, NULL, 1.5, 150,
  '{"veg"}'::public.diet_type_enum[], 
  ARRAY['snack', 'restaurant-common']::TEXT[], 
  '{}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  true, false, false, false, false, false,
  72, 
  NULL, 
  0, 
  'FSSAI-label'::public.source_enum, 
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

  -- Servings for dominos-margherita-regular
  DELETE FROM public.food_servings WHERE food_id = 'dominos-margherita-regular';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('dominos-margherita-regular', 'slice', '1 slice', 55);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('dominos-margherita-regular', 'plate', '1 whole regular pizza (4 slices)', 220);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('dominos-margherita-regular', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'dominos-peppy-paneer', 
  'Domino''s Peppy Paneer', 
  'डोमिनोज़ पेप्पी पनीर', 
  ARRAY['dominos paneer pizza']::TEXT[], 
  ARRAY['dominos', 'peppy paneer', 'paneer pizza']::TEXT[], 
  'packaged-food', 
  'qsr-pizza', 
  'dish'::public.item_type_enum, 
  'baked'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  100,
  275, 12, 30.5, 11.5, 2,
  540, NULL, NULL, 1.5, 160,
  '{"veg"}'::public.diet_type_enum[], 
  ARRAY['lunch', 'restaurant-common']::TEXT[], 
  '{}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  true, false, false, false, false, false,
  70, 
  NULL, 
  0, 
  'FSSAI-label'::public.source_enum, 
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

  -- Servings for dominos-peppy-paneer
  DELETE FROM public.food_servings WHERE food_id = 'dominos-peppy-paneer';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('dominos-peppy-paneer', 'slice', '1 slice', 65);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('dominos-peppy-paneer', 'plate', '1 whole regular pizza', 260);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('dominos-peppy-paneer', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'dominos-chicken-dominator', 
  'Domino''s Chicken Dominator', 
  'डोमिनोज़ चिकन डोमिनेटर', 
  ARRAY['dominos meat pizza']::TEXT[], 
  ARRAY['dominos', 'chicken dominator', 'chicken pizza dominos']::TEXT[], 
  'packaged-food', 
  'qsr-pizza', 
  'dish'::public.item_type_enum, 
  'baked'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  100,
  285, 14.5, 27.5, 13, 1.5,
  610, 0.5, NULL, 1.8, 150,
  '{"nonveg"}'::public.diet_type_enum[], 
  ARRAY['lunch', 'dinner', 'restaurant-common']::TEXT[], 
  '{}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  true, false, false, false, false, false,
  68, 
  NULL, 
  0, 
  'FSSAI-label'::public.source_enum, 
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

  -- Servings for dominos-chicken-dominator
  DELETE FROM public.food_servings WHERE food_id = 'dominos-chicken-dominator';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('dominos-chicken-dominator', 'slice', '1 slice', 70);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('dominos-chicken-dominator', 'plate', '1 whole regular pizza', 280);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('dominos-chicken-dominator', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'dominos-choco-lava-cake', 
  'Domino''s Choco Lava Cake', 
  'चोको लावा केक', 
  ARRAY['choco lava decandence']::TEXT[], 
  ARRAY['dominos', 'choco lava', 'lava cake', 'chocolate dessert']::TEXT[], 
  'sweet-mithai', 
  'dessert-chain', 
  'snack'::public.item_type_enum, 
  'baked'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  85,
  412, 5.5, 52, 21.5, 2.5,
  320, NULL, NULL, 2, 40,
  '{"veg"}'::public.diet_type_enum[], 
  ARRAY['snack', 'high-sugar', 'high-fat']::TEXT[], 
  '{}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  true, false, false, false, false, false,
  65, 
  NULL, 
  0, 
  'FSSAI-label'::public.source_enum, 
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

  -- Servings for dominos-choco-lava-cake
  DELETE FROM public.food_servings WHERE food_id = 'dominos-choco-lava-cake';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('dominos-choco-lava-cake', 'piece', '1 piece', 85);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('dominos-choco-lava-cake', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'mcd-mcaloo-tikki', 
  'McDonald''s McAloo Tikki Burger', 
  'मैकआलू टिक्की', 
  ARRAY['mc aloo']::TEXT[], 
  ARRAY['mcdonalds', 'mcd', 'mcaloo', 'aloo tikki burger']::TEXT[], 
  'packaged-food', 
  'qsr-burger', 
  'snack'::public.item_type_enum, 
  'fried'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  146,
  232, 3.5, 34, 9.2, 2,
  480, NULL, NULL, 1.2, 25,
  '{"veg"}'::public.diet_type_enum[], 
  ARRAY['snack', 'restaurant-common', 'budget-friendly']::TEXT[], 
  '{}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  true, false, false, false, true, false,
  72, 
  NULL, 
  0, 
  'FSSAI-label'::public.source_enum, 
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

  -- Servings for mcd-mcaloo-tikki
  DELETE FROM public.food_servings WHERE food_id = 'mcd-mcaloo-tikki';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('mcd-mcaloo-tikki', 'piece', '1 burger', 146);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('mcd-mcaloo-tikki', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'mcd-mcspicy-paneer', 
  'McDonald''s McSpicy Paneer Burger', 
  'मैकस्पाइसी पनीर', 
  ARRAY['mc spicy paneer']::TEXT[], 
  ARRAY['mcdonalds', 'mcd', 'mcspicy paneer', 'paneer burger']::TEXT[], 
  'packaged-food', 
  'qsr-burger', 
  'snack'::public.item_type_enum, 
  'fried'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  180,
  290, 10.5, 30, 14.2, 1.5,
  580, NULL, NULL, 1.5, 120,
  '{"veg"}'::public.diet_type_enum[], 
  ARRAY['snack', 'restaurant-common', 'spicy']::TEXT[], 
  '{}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  true, false, false, false, true, false,
  68, 
  NULL, 
  0, 
  'FSSAI-label'::public.source_enum, 
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

  -- Servings for mcd-mcspicy-paneer
  DELETE FROM public.food_servings WHERE food_id = 'mcd-mcspicy-paneer';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('mcd-mcspicy-paneer', 'piece', '1 burger', 180);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('mcd-mcspicy-paneer', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'mcd-mcspicy-chicken', 
  'McDonald''s McSpicy Chicken Burger', 
  'मैकस्पाइसी चिकन', 
  ARRAY['mc spicy chicken']::TEXT[], 
  ARRAY['mcdonalds', 'mcd', 'mcspicy chicken', 'chicken burger mcd']::TEXT[], 
  'packaged-food', 
  'qsr-burger', 
  'snack'::public.item_type_enum, 
  'fried'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  185,
  247, 11.5, 23, 12, 1.5,
  610, 0.5, NULL, 1.5, 30,
  '{"nonveg"}'::public.diet_type_enum[], 
  ARRAY['snack', 'restaurant-common', 'high-protein']::TEXT[], 
  '{}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  true, false, false, false, false, false,
  65, 
  NULL, 
  0, 
  'FSSAI-label'::public.source_enum, 
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

  -- Servings for mcd-mcspicy-chicken
  DELETE FROM public.food_servings WHERE food_id = 'mcd-mcspicy-chicken';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('mcd-mcspicy-chicken', 'piece', '1 burger', 185);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('mcd-mcspicy-chicken', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'mcd-french-fries-medium', 
  'McDonald''s French Fries (Medium)', 
  'मैकडॉनल्ड्स फ्रेंच फ्राइज़', 
  ARRAY['mcd fries']::TEXT[], 
  ARRAY['mcdonalds', 'mcd', 'french fries', 'fries']::TEXT[], 
  'packaged-food', 
  'qsr-burger', 
  'snack'::public.item_type_enum, 
  'fried'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  117,
  288, 3.5, 38, 13.5, 3.5,
  250, NULL, NULL, 0.8, 15,
  '{"veg"}'::public.diet_type_enum[], 
  ARRAY['snack', 'restaurant-common', 'high-fat']::TEXT[], 
  '{}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  true, false, true, false, true, false,
  75, 
  NULL, 
  0, 
  'FSSAI-label'::public.source_enum, 
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

  -- Servings for mcd-french-fries-medium
  DELETE FROM public.food_servings WHERE food_id = 'mcd-french-fries-medium';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('mcd-french-fries-medium', 'portion', '1 medium portion', 117);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('mcd-french-fries-medium', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'kfc-hot-crispy-1pc', 
  'KFC Hot & Crispy Chicken (1 pc)', 
  'केएफसी हॉट एंड क्रिस्पी (1 पीस)', 
  ARRAY['kfc fried chicken']::TEXT[], 
  ARRAY['kfc', 'hot and crispy', 'kfc chicken', 'fried chicken piece']::TEXT[], 
  'packaged-food', 
  'qsr-chicken', 
  'snack'::public.item_type_enum, 
  'fried'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  115,
  250, 15, 11, 16.5, 1,
  480, 1, NULL, 1.2, 20,
  '{"nonveg"}'::public.diet_type_enum[], 
  ARRAY['snack', 'restaurant-common', 'high-protein', 'high-fat']::TEXT[], 
  '{}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  true, false, false, false, false, false,
  50, 
  NULL, 
  0, 
  'FSSAI-label'::public.source_enum, 
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

  -- Servings for kfc-hot-crispy-1pc
  DELETE FROM public.food_servings WHERE food_id = 'kfc-hot-crispy-1pc';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('kfc-hot-crispy-1pc', 'piece', '1 piece', 115);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('kfc-hot-crispy-1pc', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'kfc-zinger-burger-chicken', 
  'KFC Zinger Burger (Classic Chicken)', 
  'केएफसी सिंगर बर्गर', 
  ARRAY['kfc zinger']::TEXT[], 
  ARRAY['kfc', 'zinger', 'chicken zinger', 'zinger burger']::TEXT[], 
  'packaged-food', 
  'qsr-chicken', 
  'snack'::public.item_type_enum, 
  'fried'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  185,
  243, 12, 23.5, 11, 1.5,
  620, 0.8, NULL, 1.5, 30,
  '{"nonveg"}'::public.diet_type_enum[], 
  ARRAY['lunch', 'restaurant-common', 'high-protein']::TEXT[], 
  '{}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  true, false, false, false, false, false,
  62, 
  NULL, 
  0, 
  'FSSAI-label'::public.source_enum, 
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

  -- Servings for kfc-zinger-burger-chicken
  DELETE FROM public.food_servings WHERE food_id = 'kfc-zinger-burger-chicken';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('kfc-zinger-burger-chicken', 'piece', '1 burger', 185);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('kfc-zinger-burger-chicken', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'bk-veg-whopper', 
  'Burger King Veg Whopper', 
  'बर्गर किंग वेज व्हॉपर', 
  ARRAY['veg whopper bk']::TEXT[], 
  ARRAY['bk', 'burger king', 'whopper veg', 'veg whopper']::TEXT[], 
  'packaged-food', 
  'qsr-burger', 
  'dish'::public.item_type_enum, 
  'fried'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  250,
  228, 3.5, 25.5, 12.4, 2.5,
  510, NULL, NULL, 1.1, 30,
  '{"veg"}'::public.diet_type_enum[], 
  ARRAY['lunch', 'dinner', 'restaurant-common']::TEXT[], 
  '{}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  true, false, false, false, true, false,
  65, 
  NULL, 
  0, 
  'FSSAI-label'::public.source_enum, 
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

  -- Servings for bk-veg-whopper
  DELETE FROM public.food_servings WHERE food_id = 'bk-veg-whopper';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('bk-veg-whopper', 'piece', '1 burger', 250);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('bk-veg-whopper', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'wow-momo-steamed-chicken', 
  'Wow! Momo Steamed Chicken (6 pcs)', 
  'वाओ मोमो स्टीम्ड चिकन', 
  ARRAY['wow momos chicken']::TEXT[], 
  ARRAY['wow momo', 'steamed momo', 'chicken momo', 'momos']::TEXT[], 
  'snack-street', 
  'momo-dumpling', 
  'snack'::public.item_type_enum, 
  'steamed'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  180,
  140, 9, 20, 3, 1.2,
  350, 0.5, NULL, 1.2, 15,
  '{"nonveg"}'::public.diet_type_enum[], 
  ARRAY['snack', 'restaurant-common']::TEXT[], 
  '{}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  true, false, false, false, true, false,
  60, 
  NULL, 
  2, 
  'curated-estimate'::public.source_enum, 
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

  -- Servings for wow-momo-steamed-chicken
  DELETE FROM public.food_servings WHERE food_id = 'wow-momo-steamed-chicken';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('wow-momo-steamed-chicken', 'plate', '1 plate (6 pcs)', 180);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('wow-momo-steamed-chicken', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'boba-classic-milk-tea', 
  'Boba Classic Milk Tea (with Tapioca Pearls)', 
  'बोबा मिल्क टी', 
  ARRAY['bubble tea']::TEXT[], 
  ARRAY['boba', 'bubble tea', 'milk tea tapioca', 'classic boba']::TEXT[], 
  'drink', 
  'cafe-beverage', 
  'drink'::public.item_type_enum, 
  'raw'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  500,
  60, 0.5, 12, 1, 0.1,
  15, NULL, NULL, 0.2, 15,
  '{"veg"}'::public.diet_type_enum[], 
  ARRAY['sweet', 'high-sugar', 'high-carb', 'beverage']::TEXT[], 
  '{}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  true, false, true, true, false, true,
  85, 
  NULL, 
  0, 
  'curated-estimate'::public.source_enum, 
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

  -- Servings for boba-classic-milk-tea
  DELETE FROM public.food_servings WHERE food_id = 'boba-classic-milk-tea';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('boba-classic-milk-tea', 'cup-medium', '1 medium cup (500ml)', 500);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('boba-classic-milk-tea', 'ml100', '100ml', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'boba-taro-milk-tea', 
  'Taro Bubble Tea (with Tapioca Pearls)', 
  'टैरो बोबा टी', 
  ARRAY['taro boba']::TEXT[], 
  ARRAY['boba taro', 'taro bubble tea', 'purple boba']::TEXT[], 
  'drink', 
  'cafe-beverage', 
  'drink'::public.item_type_enum, 
  'raw'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  500,
  75, 0.5, 14, 1.8, 0.2,
  20, NULL, NULL, 0.2, 20,
  '{"veg"}'::public.diet_type_enum[], 
  ARRAY['sweet', 'high-sugar', 'high-carb', 'beverage']::TEXT[], 
  '{}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  true, false, true, true, true, true,
  85, 
  NULL, 
  0, 
  'curated-estimate'::public.source_enum, 
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

  -- Servings for boba-taro-milk-tea
  DELETE FROM public.food_servings WHERE food_id = 'boba-taro-milk-tea';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('boba-taro-milk-tea', 'cup-medium', '1 medium cup (500ml)', 500);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('boba-taro-milk-tea', 'ml100', '100ml', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'eatfit-chicken-tikka-super-bowl', 
  'EatFit Chicken Tikka Super Bowl', 
  'ईटफिट चिकन टिक्का बाउल', 
  ARRAY['eat fit chicken bowl']::TEXT[], 
  ARRAY['eatfit', 'chicken tikka bowl', 'super bowl', 'healthy chicken bowl']::TEXT[], 
  'rice-dish', 
  'cloud-kitchen', 
  'dish'::public.item_type_enum, 
  'cooked'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  450,
  120, 8.5, 15, 3.5, 3,
  150, 0.5, NULL, 1.5, 25,
  '{"nonveg"}'::public.diet_type_enum[], 
  ARRAY['lunch', 'dinner', 'high-protein', 'healthy-choice']::TEXT[], 
  '{}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  false, false, true, true, true, false,
  45, 
  'Minimal oil usage as per brand standard.', 
  2, 
  'brand-nutrition'::public.source_enum, 
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

  -- Servings for eatfit-chicken-tikka-super-bowl
  DELETE FROM public.food_servings WHERE food_id = 'eatfit-chicken-tikka-super-bowl';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('eatfit-chicken-tikka-super-bowl', 'bowl', '1 super bowl', 450);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('eatfit-chicken-tikka-super-bowl', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'eatfit-paneer-makhani-bowl', 
  'EatFit Paneer Makhani Millet Bowl', 
  'ईटफिट पनीर मखनी बाउल', 
  ARRAY['eat fit paneer bowl']::TEXT[], 
  ARRAY['eatfit', 'paneer makhani bowl', 'millet bowl veg']::TEXT[], 
  'rice-dish', 
  'cloud-kitchen', 
  'dish'::public.item_type_enum, 
  'cooked'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  450,
  135, 5.5, 16, 6, 4,
  180, NULL, NULL, 2, 80,
  '{"veg"}'::public.diet_type_enum[], 
  ARRAY['lunch', 'dinner', 'healthy-choice']::TEXT[], 
  '{}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  false, false, true, true, true, false,
  50, 
  'Controlled oil usage.', 
  3, 
  'brand-nutrition'::public.source_enum, 
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

  -- Servings for eatfit-paneer-makhani-bowl
  DELETE FROM public.food_servings WHERE food_id = 'eatfit-paneer-makhani-bowl';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('eatfit-paneer-makhani-bowl', 'bowl', '1 super bowl', 450);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('eatfit-paneer-makhani-bowl', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'salad-bowl-chicken-caesar', 
  'Chicken Caesar Salad Bowl', 
  'चिकन सीज़र सलाद', 
  ARRAY['caesar salad']::TEXT[], 
  ARRAY['caesar salad', 'chicken salad', 'salad bowl', 'healthy salad']::TEXT[], 
  'sabzi-veg', 
  'cafe-food', 
  'dish'::public.item_type_enum, 
  'raw'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  300,
  110, 8, 4, 7.5, 1.5,
  250, 0.4, NULL, 1, 50,
  '{"nonveg"}'::public.diet_type_enum[], 
  ARRAY['lunch', 'dinner', 'low-carb', 'high-protein']::TEXT[], 
  '{}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  false, false, false, true, false, false,
  30, 
  'Calculated with typical Caesar dressing portion.', 
  5, 
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

  -- Servings for salad-bowl-chicken-caesar
  DELETE FROM public.food_servings WHERE food_id = 'salad-bowl-chicken-caesar';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('salad-bowl-chicken-caesar', 'bowl', '1 standard bowl', 300);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('salad-bowl-chicken-caesar', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'acai-bowl-berry', 
  'Acai Bowl (Mixed Berry, Granola)', 
  'असाई बाउल', 
  ARRAY['smoothie bowl']::TEXT[], 
  ARRAY['acai bowl', 'smoothie bowl', 'berry bowl', 'healthy dessert']::TEXT[], 
  'fruit', 
  'cafe-food', 
  'dish'::public.item_type_enum, 
  'raw'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  350,
  95, 2, 18, 2.5, 4.5,
  20, NULL, NULL, 1.2, 30,
  '{"veg","vegan"}'::public.diet_type_enum[], 
  ARRAY['breakfast', 'fruit', 'high-sugar']::TEXT[], 
  '{}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  false, false, false, true, false, false,
  55, 
  NULL, 
  0, 
  'USDA'::public.source_enum, 
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

  -- Servings for acai-bowl-berry
  DELETE FROM public.food_servings WHERE food_id = 'acai-bowl-berry';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('acai-bowl-berry', 'bowl', '1 bowl', 350);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('acai-bowl-berry', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'box8-paneer-makhani-meal', 
  'Box8 Paneer Makhani Meal Box', 
  'पनीर मखनी मील बॉक्स', 
  ARRAY['box 8 paneer meal']::TEXT[], 
  ARRAY['box8', 'box 8', 'paneer meal box', 'paneer makhani paratha']::TEXT[], 
  'rice-dish', 
  'cloud-kitchen', 
  'dish'::public.item_type_enum, 
  'cooked'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  500,
  165, 5, 20, 8, 2.5,
  300, NULL, NULL, 1.5, 60,
  '{"veg"}'::public.diet_type_enum[], 
  ARRAY['lunch', 'dinner', 'heavy-meal']::TEXT[], 
  '{}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  false, false, false, true, true, false,
  62, 
  'Includes gravies with oil and ghee.', 
  10, 
  'curated-estimate'::public.source_enum, 
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

  -- Servings for box8-paneer-makhani-meal
  DELETE FROM public.food_servings WHERE food_id = 'box8-paneer-makhani-meal';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('box8-paneer-makhani-meal', 'box', '1 meal box', 500);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('box8-paneer-makhani-meal', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'wendys-spicy-paneer-burger', 
  'Wendy''s Spicy Paneer Burger', 
  'वेंडीज़ स्पाइसी पनीर', 
  ARRAY['wendys paneer']::TEXT[], 
  ARRAY['wendys', 'spicy paneer burger', 'paneer burger wendys']::TEXT[], 
  'packaged-food', 
  'qsr-burger', 
  'snack'::public.item_type_enum, 
  'fried'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  165,
  275, 10, 28, 13.5, 2,
  550, NULL, NULL, 1.4, 110,
  '{"veg"}'::public.diet_type_enum[], 
  ARRAY['snack', 'restaurant-common']::TEXT[], 
  '{}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  true, false, false, false, true, false,
  68, 
  NULL, 
  0, 
  'curated-estimate'::public.source_enum, 
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

  -- Servings for wendys-spicy-paneer-burger
  DELETE FROM public.food_servings WHERE food_id = 'wendys-spicy-paneer-burger';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('wendys-spicy-paneer-burger', 'piece', '1 burger', 165);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('wendys-spicy-paneer-burger', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'subway-paneer-tikka-sub', 
  'Subway Paneer Tikka Sub (6 inch, Multigrain)', 
  'सबवे पनीर टिक्का सब', 
  ARRAY['paneer sub']::TEXT[], 
  ARRAY['subway', 'paneer tikka sub', 'subway paneer', '6 inch sub', 'sandwich']::TEXT[], 
  'packaged-food', 
  'qsr-sandwich', 
  'dish'::public.item_type_enum, 
  'raw'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  235,
  168, 8.5, 22, 5.5, 2.5,
  380, NULL, NULL, 1.5, 120,
  '{"veg"}'::public.diet_type_enum[], 
  ARRAY['lunch', 'dinner', 'healthy-choice']::TEXT[], 
  '{}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  true, false, false, false, true, false,
  58, 
  NULL, 
  0, 
  'FSSAI-label'::public.source_enum, 
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

  -- Servings for subway-paneer-tikka-sub
  DELETE FROM public.food_servings WHERE food_id = 'subway-paneer-tikka-sub';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('subway-paneer-tikka-sub', 'sub-6inch', '1 6-inch sub', 235);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('subway-paneer-tikka-sub', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'subway-chicken-slice-sub', 
  'Subway Roasted Chicken Slice Sub (6 inch)', 
  'सबवे चिकन स्लाइस सब', 
  ARRAY['chicken sub']::TEXT[], 
  ARRAY['subway', 'chicken slice', 'roasted chicken sub', 'healthy sub']::TEXT[], 
  'packaged-food', 
  'qsr-sandwich', 
  'dish'::public.item_type_enum, 
  'raw'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  225,
  132, 10, 18.5, 1.8, 2.5,
  400, 0.5, NULL, 1.2, 30,
  '{"nonveg"}'::public.diet_type_enum[], 
  ARRAY['lunch', 'dinner', 'high-protein', 'low-fat']::TEXT[], 
  '{}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  true, false, false, false, true, false,
  55, 
  'Excluding high fat sauces (mayo/ southwest).', 
  0, 
  'FSSAI-label'::public.source_enum, 
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

  -- Servings for subway-chicken-slice-sub
  DELETE FROM public.food_servings WHERE food_id = 'subway-chicken-slice-sub';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('subway-chicken-slice-sub', 'sub-6inch', '1 6-inch sub', 225);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('subway-chicken-slice-sub', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'chaayos-kulhad-chai', 
  'Chaayos Kulhad Chai (Desi Chai)', 
  'चायोस कुल्हड़ चाय', 
  ARRAY['masala chai', 'chaayos tea']::TEXT[], 
  ARRAY['chaayos', 'kulhad chai', 'masala chai', 'desi chai']::TEXT[], 
  'drink', 
  'cafe-beverage', 
  'drink'::public.item_type_enum, 
  'cooked'::public.food_state_enum, 
  'north'::public.region_enum, 
  200,
  65, 2, 8.5, 2.5, 0,
  30, 0.2, 0.5, 0.1, 70,
  '{"veg"}'::public.diet_type_enum[], 
  ARRAY['beverage', 'hot-drink']::TEXT[], 
  '{"navratri","ekadashi"}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  false, true, true, true, false, true,
  45, 
  NULL, 
  0, 
  'curated-estimate'::public.source_enum, 
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

  -- Servings for chaayos-kulhad-chai
  DELETE FROM public.food_servings WHERE food_id = 'chaayos-kulhad-chai';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('chaayos-kulhad-chai', 'kulhad', '1 regular kulhad (200ml)', 200);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('chaayos-kulhad-chai', 'ml100', '100ml', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'starbucks-java-chip-frappuccino', 
  'Starbucks Java Chip Frappuccino (Tall)', 
  'स्टारबक्स जावा चिप', 
  ARRAY['java chip', 'cold coffee']::TEXT[], 
  ARRAY['starbucks', 'java chip', 'frappuccino', 'cold coffee']::TEXT[], 
  'drink', 
  'cafe-beverage', 
  'drink'::public.item_type_enum, 
  'raw'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  350,
  95, 1.5, 14.5, 3.5, 0.5,
  50, 0.1, NULL, 0.5, 40,
  '{"veg"}'::public.diet_type_enum[], 
  ARRAY['beverage', 'sweet', 'high-sugar']::TEXT[], 
  '{}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  true, false, false, false, false, true,
  75, 
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

  -- Servings for starbucks-java-chip-frappuccino
  DELETE FROM public.food_servings WHERE food_id = 'starbucks-java-chip-frappuccino';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('starbucks-java-chip-frappuccino', 'tall', '1 Tall (354ml)', 350);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('starbucks-java-chip-frappuccino', 'grande', '1 Grande (473ml)', 470);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('starbucks-java-chip-frappuccino', 'ml100', '100ml', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'cafe-latte-regular', 
  'Cafe Latte (Regular/Whole Milk)', 
  'कैफे लाटे', 
  ARRAY['latte coffee']::TEXT[], 
  ARRAY['latte', 'cafe latte', 'coffee milk', 'cappuccino']::TEXT[], 
  'drink', 
  'cafe-beverage', 
  'drink'::public.item_type_enum, 
  'cooked'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  350,
  54, 3, 4.5, 2.8, 0,
  40, 0.3, 0.5, NULL, 100,
  '{"veg"}'::public.diet_type_enum[], 
  ARRAY['beverage', 'hot-drink', 'sugar-free']::TEXT[], 
  '{"navratri","ekadashi"}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  false, true, true, true, false, true,
  30, 
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

  -- Servings for cafe-latte-regular
  DELETE FROM public.food_servings WHERE food_id = 'cafe-latte-regular';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('cafe-latte-regular', 'regular', '1 Regular Cup (350ml)', 350);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('cafe-latte-regular', 'ml100', '100ml', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'ice-cream-vanilla-scoop', 
  'Vanilla Ice Cream (Amul/Kwality Walls)', 
  'वनिला आइसक्रीम', 
  ARRAY['vanilla scoop']::TEXT[], 
  ARRAY['ice cream', 'vanilla ice cream', 'amul vanilla', 'dessert']::TEXT[], 
  'sweet-mithai', 
  'dessert-chain', 
  'snack'::public.item_type_enum, 
  'raw'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  65,
  207, 3.5, 23.6, 11, 0,
  80, 0.3, NULL, 0.1, 128,
  '{"veg"}'::public.diet_type_enum[], 
  ARRAY['snack', 'sweet', 'high-sugar']::TEXT[], 
  '{}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  true, false, true, false, false, false,
  60, 
  NULL, 
  0, 
  'FSSAI-label'::public.source_enum, 
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

  -- Servings for ice-cream-vanilla-scoop
  DELETE FROM public.food_servings WHERE food_id = 'ice-cream-vanilla-scoop';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('ice-cream-vanilla-scoop', 'scoop', '1 scoop (100ml / 65g)', 65);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('ice-cream-vanilla-scoop', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'hakka-noodles-veg', 
  'Veg Hakka Noodles (Restaurant/Indo-Chinese)', 
  'वेज हक्का नूडल्स', 
  ARRAY['chowmein']::TEXT[], 
  ARRAY['hakka noodles', 'chowmein', 'chinese noodles', 'veg noodles']::TEXT[], 
  'sabzi-veg', 
  'indo-chinese', 
  'dish'::public.item_type_enum, 
  'cooked'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  300,
  145, 3.5, 23, 4.5, 1.5,
  350, NULL, NULL, 1, 20,
  '{"veg"}'::public.diet_type_enum[], 
  ARRAY['lunch', 'dinner', 'restaurant-common']::TEXT[], 
  '{}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  false, false, false, true, true, false,
  65, 
  'Contains wok-tossed oil.', 
  5, 
  'curated-estimate'::public.source_enum, 
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

  -- Servings for hakka-noodles-veg
  DELETE FROM public.food_servings WHERE food_id = 'hakka-noodles-veg';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('hakka-noodles-veg', 'plate', '1 plate', 300);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('hakka-noodles-veg', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'beer-lager', 
  'Beer (Standard Lager - Kingfisher/Tuborg)', 
  'बियर', 
  ARRAY['pint', 'brew']::TEXT[], 
  ARRAY['beer', 'kingfisher', 'tuborg', 'lager', 'alcohol']::TEXT[], 
  'drink', 
  'alcohol', 
  'drink'::public.item_type_enum, 
  'raw'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  330,
  43, 0.5, 10.2, 0, 0,
  4, 0.02, NULL, 0.1, 4,
  '{"vegan","veg","nonveg"}'::public.diet_type_enum[], 
  ARRAY['alcohol', 'empty-calories']::TEXT[], 
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

  -- Servings for beer-lager
  DELETE FROM public.food_servings WHERE food_id = 'beer-lager';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('beer-lager', 'pint', '1 Pint (330ml)', 330);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('beer-lager', 'bottle-large', '1 Large Bottle (650ml)', 650);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('beer-lager', 'ml100', '100ml', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'whiskey-30ml', 
  'Whiskey / Scotch (Neat)', 
  'विस्की', 
  ARRAY['whisky']::TEXT[], 
  ARRAY['whiskey', 'whisky', 'scotch', 'peg', 'alcohol']::TEXT[], 
  'drink', 
  'alcohol', 
  'drink'::public.item_type_enum, 
  'raw'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  30,
  250, 0, 62.5, 0, 0,
  1, NULL, NULL, 0.04, NULL,
  '{"vegan","veg","nonveg"}'::public.diet_type_enum[], 
  ARRAY['alcohol', 'empty-calories']::TEXT[], 
  '{}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  true, false, true, false, false, false,
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

  -- Servings for whiskey-30ml
  DELETE FROM public.food_servings WHERE food_id = 'whiskey-30ml';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('whiskey-30ml', 'peg-small', '1 Small Peg (30ml)', 30);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('whiskey-30ml', 'peg-large', '1 Large Peg (60ml)', 60);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('whiskey-30ml', 'ml100', '100ml', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'pasta-arabiatta-veg', 
  'Veg Penne Arrabbiata (Red Sauce Pasta)', 
  'वेज पेन्ने अरैबिका', 
  ARRAY['red sauce pasta', 'arabiatta']::TEXT[], 
  ARRAY['pasta', 'red sauce pasta', 'arrabbiata', 'penne', 'italian']::TEXT[], 
  'packaged-food', 
  'italian-restaurant', 
  'dish'::public.item_type_enum, 
  'cooked'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  300,
  125, 4.5, 21, 3.5, 2,
  350, NULL, NULL, 1.2, 20,
  '{"veg","vegan"}'::public.diet_type_enum[], 
  ARRAY['lunch', 'dinner', 'restaurant-common']::TEXT[], 
  '{}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  false, false, false, true, true, false,
  50, 
  'Cooked with olive oil.', 
  4, 
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

  -- Servings for pasta-arabiatta-veg
  DELETE FROM public.food_servings WHERE food_id = 'pasta-arabiatta-veg';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('pasta-arabiatta-veg', 'plate', '1 plate / bowl', 300);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('pasta-arabiatta-veg', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'shawarma-chicken-wrap', 
  'Chicken Shawarma Wrap (Pita & Garlic Toum)', 
  'चिकन शवरमा रैप', 
  ARRAY['chicken shwarma']::TEXT[], 
  ARRAY['shawarma', 'chicken wrap', 'lebanese', 'shwarma']::TEXT[], 
  'non-veg', 
  'mediterranean', 
  'dish'::public.item_type_enum, 
  'cooked'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  200,
  220, 11, 23, 9.5, 1.5,
  480, 0.6, NULL, 1.5, 30,
  '{"nonveg"}'::public.diet_type_enum[], 
  ARRAY['lunch', 'dinner', 'snack', 'restaurant-common']::TEXT[], 
  '{}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  false, false, false, true, true, false,
  60, 
  'Contains heavy oil/mayo base in the garlic sauce.', 
  8, 
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

  -- Servings for shawarma-chicken-wrap
  DELETE FROM public.food_servings WHERE food_id = 'shawarma-chicken-wrap';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('shawarma-chicken-wrap', 'wrap', '1 wrap', 200);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('shawarma-chicken-wrap', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'pho-chicken-noodle-soup', 
  'Pho Noodle Soup (Chicken, Vietnamese)', 
  'फो नूडल सूप', 
  ARRAY['vietnamese soup', 'pho ga']::TEXT[], 
  ARRAY['pho', 'vietnamese soup', 'chicken soup', 'pho ga', 'noodles soup']::TEXT[], 
  'non-veg', 
  'asian-restaurant', 
  'dish'::public.item_type_enum, 
  'cooked'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  500,
  65, 4, 9, 1.5, 0.5,
  250, 0.2, NULL, 0.5, 10,
  '{"nonveg"}'::public.diet_type_enum[], 
  ARRAY['lunch', 'dinner', 'low-calorie']::TEXT[], 
  '{}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  false, false, true, true, true, false,
  50, 
  'Minimal oil. Fat primarily from chicken broth.', 
  1, 
  'USDA'::public.source_enum, 
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

  -- Servings for pho-chicken-noodle-soup
  DELETE FROM public.food_servings WHERE food_id = 'pho-chicken-noodle-soup';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('pho-chicken-noodle-soup', 'bowl-large', '1 large bowl', 500);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('pho-chicken-noodle-soup', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'tiramisu-slice', 
  'Tiramisu (Classic Italian Dessert)', 
  'तिरामिसू', 
  ARRAY['coffee cake', 'tiramisu cake']::TEXT[], 
  ARRAY['tiramisu', 'cake', 'italian dessert', 'coffee dessert']::TEXT[], 
  'sweet-mithai', 
  'global-dessert', 
  'snack'::public.item_type_enum, 
  'raw'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  110,
  330, 5.5, 27.5, 22, 0.5,
  80, 0.4, 0.2, 0.5, 100,
  '{"veg","egg"}'::public.diet_type_enum[], 
  ARRAY['snack', 'high-fat', 'sweet']::TEXT[], 
  '{}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  false, false, false, true, false, false,
  62, 
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

  -- Servings for tiramisu-slice
  DELETE FROM public.food_servings WHERE food_id = 'tiramisu-slice';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('tiramisu-slice', 'slice', '1 slice / portion', 110);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('tiramisu-slice', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'plant-mock-meat-sausage', 
  'Plant-Based Mock Meat Sausage (Soya/Pea)', 
  'वेगन सॉसेज', 
  ARRAY['vegan sausage']::TEXT[], 
  ARRAY['mock meat', 'vegan sausage', 'plant based', 'fake meat']::TEXT[], 
  'packaged-food', 
  'plant-based', 
  'dish'::public.item_type_enum, 
  'cooked'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  85,
  215, 16.5, 6, 13.5, 3.5,
  480, NULL, NULL, 2.5, 40,
  '{"vegan","veg"}'::public.diet_type_enum[], 
  ARRAY['breakfast', 'high-protein', 'processed']::TEXT[], 
  '{}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  true, false, true, false, false, false,
  30, 
  NULL, 
  0, 
  'USDA'::public.source_enum, 
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

  -- Servings for plant-mock-meat-sausage
  DELETE FROM public.food_servings WHERE food_id = 'plant-mock-meat-sausage';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('plant-mock-meat-sausage', 'link', '1 sausage link', 85);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('plant-mock-meat-sausage', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'dal-baati-churma', 
  'Dal Baati Churma (Rajasthani Thali)', 
  'दाल बाटी चूरमा', 
  ARRAY['daal bati']::TEXT[], 
  ARRAY['dal baati', 'churma', 'rajasthani', 'daal bati']::TEXT[], 
  'sabzi-veg', 
  'rajasthani', 
  'dish'::public.item_type_enum, 
  'cooked'::public.food_state_enum, 
  'north'::public.region_enum, 
  400,
  320, 7, 45, 14.5, 4.5,
  350, NULL, NULL, 2, 45,
  '{"veg"}'::public.diet_type_enum[], 
  ARRAY['lunch', 'dinner', 'heavy-meal', 'high-fat']::TEXT[], 
  '{}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  false, false, false, true, true, false,
  58, 
  'Extremely high in Ghee.', 
  20, 
  'curated-estimate'::public.source_enum, 
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

  -- Servings for dal-baati-churma
  DELETE FROM public.food_servings WHERE food_id = 'dal-baati-churma';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('dal-baati-churma', 'plate', '1 plate (2 baati, dal, churma)', 400);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('dal-baati-churma', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'pb-pintola-all-natural', 
  'Pintola All Natural Peanut Butter', 
  'पिनटोला नेचुरल पीनट बटर', 
  ARRAY['unsweetened peanut butter']::TEXT[], 
  ARRAY['pintola', 'all natural', 'peanut butter', 'unsweetened', 'natural']::TEXT[], 
  'oil-fat', 
  'peanut-butter', 
  'snack'::public.item_type_enum, 
  'raw'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  32,
  600, 30, 18, 50, 9,
  10, NULL, NULL, 1.5, 45,
  '{"vegan","veg","jain"}'::public.diet_type_enum[], 
  ARRAY['high-protein', 'high-fat', 'no-added-sugar']::TEXT[], 
  '{"navratri","ekadashi"}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  true, true, true, false, false, false,
  14, 
  NULL, 
  0, 
  'FSSAI-label'::public.source_enum, 
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

  -- Servings for pb-pintola-all-natural
  DELETE FROM public.food_servings WHERE food_id = 'pb-pintola-all-natural';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('pb-pintola-all-natural', 'tbsp-1', '1 Tbsp', 15);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('pb-pintola-all-natural', 'tbsp-2', '2 Tbsp (Standard)', 32);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('pb-pintola-all-natural', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'pb-pintola-classic', 
  'Pintola Classic Peanut Butter', 
  'पिनटोला क्लासिक पीनट बटर', 
  ARRAY['sweetened peanut butter']::TEXT[], 
  ARRAY['pintola', 'classic', 'peanut butter', 'sweetened']::TEXT[], 
  'oil-fat', 
  'peanut-butter', 
  'snack'::public.item_type_enum, 
  'raw'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  32,
  605, 26, 22, 44.6, 7.2,
  280, NULL, NULL, 1.2, 40,
  '{"veg","vegan"}'::public.diet_type_enum[], 
  ARRAY['high-fat', 'high-calorie']::TEXT[], 
  '{}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  true, false, true, false, false, false,
  25, 
  NULL, 
  0, 
  'FSSAI-label'::public.source_enum, 
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

  -- Servings for pb-pintola-classic
  DELETE FROM public.food_servings WHERE food_id = 'pb-pintola-classic';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('pb-pintola-classic', 'tbsp-1', '1 Tbsp', 15);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('pb-pintola-classic', 'tbsp-2', '2 Tbsp (Standard)', 32);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('pb-pintola-classic', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'pb-pintola-high-protein-dark-choco', 
  'Pintola High Protein Dark Chocolate Peanut Butter', 
  'पिनटोला हाई प्रोटीन पीनट बटर', 
  ARRAY['whey peanut butter']::TEXT[], 
  ARRAY['pintola', 'high protein', 'dark chocolate', 'whey']::TEXT[], 
  'supplement', 
  'peanut-butter', 
  'supplement'::public.item_type_enum, 
  'raw'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  32,
  583, 30, 36, 38, 6.2,
  120, NULL, NULL, 2, 60,
  '{"veg"}'::public.diet_type_enum[], 
  ARRAY['very-high-protein', 'high-sugar']::TEXT[], 
  '{}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  true, false, true, false, false, false,
  35, 
  NULL, 
  0, 
  'FSSAI-label'::public.source_enum, 
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

  -- Servings for pb-pintola-high-protein-dark-choco
  DELETE FROM public.food_servings WHERE food_id = 'pb-pintola-high-protein-dark-choco';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('pb-pintola-high-protein-dark-choco', 'tbsp-1', '1 Tbsp', 15);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('pb-pintola-high-protein-dark-choco', 'tbsp-2', '2 Tbsp (Standard)', 32);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('pb-pintola-high-protein-dark-choco', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'pb-myfitness-original', 
  'MyFitness Original Peanut Butter', 
  'मायफिटनेस पीनट बटर', 
  ARRAY['my fitness classic peanut butter']::TEXT[], 
  ARRAY['myfitness', 'original', 'peanut butter', 'sweetened']::TEXT[], 
  'oil-fat', 
  'peanut-butter', 
  'snack'::public.item_type_enum, 
  'raw'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  32,
  620, 26, 19, 46, 6,
  300, NULL, NULL, 1.1, 35,
  '{"veg","vegan"}'::public.diet_type_enum[], 
  ARRAY['high-protein', 'high-fat']::TEXT[], 
  '{}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  true, false, true, false, false, false,
  25, 
  NULL, 
  0, 
  'FSSAI-label'::public.source_enum, 
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

  -- Servings for pb-myfitness-original
  DELETE FROM public.food_servings WHERE food_id = 'pb-myfitness-original';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('pb-myfitness-original', 'tbsp-1', '1 Tbsp', 15);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('pb-myfitness-original', 'tbsp-2', '2 Tbsp (Standard)', 32);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('pb-myfitness-original', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'pb-myfitness-chocolate-crispy', 
  'MyFitness Chocolate Peanut Butter (Crispy)', 
  'मायफिटनेस चॉकलेट पीनट बटर', 
  ARRAY['chocolate peanut butter my fitness']::TEXT[], 
  ARRAY['myfitness', 'chocolate', 'peanut butter', 'crispy']::TEXT[], 
  'oil-fat', 
  'peanut-butter', 
  'snack'::public.item_type_enum, 
  'raw'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  30,
  630, 24, 30, 50, 10,
  186, NULL, NULL, 1.5, 40,
  '{"veg"}'::public.diet_type_enum[], 
  ARRAY['high-sugar', 'high-fat']::TEXT[], 
  '{}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  true, false, true, false, false, false,
  38, 
  NULL, 
  0, 
  'FSSAI-label'::public.source_enum, 
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

  -- Servings for pb-myfitness-chocolate-crispy
  DELETE FROM public.food_servings WHERE food_id = 'pb-myfitness-chocolate-crispy';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('pb-myfitness-chocolate-crispy', 'tbsp-1', '1 Tbsp', 15);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('pb-myfitness-chocolate-crispy', 'tbsp-2', '2 Tbsp (Standard)', 30);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('pb-myfitness-chocolate-crispy', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'pb-alpino-natural', 
  'Alpino Natural Peanut Butter', 
  'अल्पिनो नेचुरल पीनट बटर', 
  ARRAY['alpino unsweetened']::TEXT[], 
  ARRAY['alpino', 'natural', 'peanut butter', 'unsweetened']::TEXT[], 
  'oil-fat', 
  'peanut-butter', 
  'snack'::public.item_type_enum, 
  'raw'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  32,
  625, 30, 18, 49, 9,
  25, NULL, NULL, 1.5, 40,
  '{"vegan","veg","jain"}'::public.diet_type_enum[], 
  ARRAY['high-protein', 'high-fat', 'no-added-sugar']::TEXT[], 
  '{"navratri","ekadashi"}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  true, true, true, false, false, false,
  14, 
  NULL, 
  0, 
  'FSSAI-label'::public.source_enum, 
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

  -- Servings for pb-alpino-natural
  DELETE FROM public.food_servings WHERE food_id = 'pb-alpino-natural';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('pb-alpino-natural', 'tbsp-1', '1 Tbsp', 15);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('pb-alpino-natural', 'tbsp-2', '2 Tbsp (Standard)', 32);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('pb-alpino-natural', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'pb-sundrop-crunchy', 
  'Sundrop Peanut Butter (Crunchy)', 
  'सनड्रॉप पीनट बटर (क्रंची)', 
  ARRAY['sundrop regular peanut butter']::TEXT[], 
  ARRAY['sundrop', 'peanut butter', 'crunchy', 'sweetened']::TEXT[], 
  'oil-fat', 
  'peanut-butter', 
  'snack'::public.item_type_enum, 
  'raw'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  30,
  600, 26, 20, 45, 6,
  320, NULL, NULL, 1, 35,
  '{"veg"}'::public.diet_type_enum[], 
  ARRAY['high-fat', 'high-calorie']::TEXT[], 
  '{}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  true, false, true, false, false, false,
  28, 
  NULL, 
  0, 
  'FSSAI-label'::public.source_enum, 
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

  -- Servings for pb-sundrop-crunchy
  DELETE FROM public.food_servings WHERE food_id = 'pb-sundrop-crunchy';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('pb-sundrop-crunchy', 'tbsp-1', '1 Tbsp', 15);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('pb-sundrop-crunchy', 'tbsp-2', '2 Tbsp (Standard)', 30);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('pb-sundrop-crunchy', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'pb-muscleblaze-high-protein-dark-choco', 
  'MuscleBlaze High Protein Peanut Butter (Dark Choco)', 
  'मसलब्लेज़ हाई प्रोटीन पीनट बटर', 
  ARRAY['mb peanut butter']::TEXT[], 
  ARRAY['muscleblaze', 'mb', 'high protein', 'peanut butter', 'dark chocolate']::TEXT[], 
  'supplement', 
  'peanut-butter', 
  'supplement'::public.item_type_enum, 
  'raw'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  30,
  590, 30, 25, 42, 5,
  100, NULL, NULL, 1.5, 50,
  '{"veg"}'::public.diet_type_enum[], 
  ARRAY['very-high-protein']::TEXT[], 
  '{}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  true, false, true, false, false, false,
  30, 
  NULL, 
  0, 
  'FSSAI-label'::public.source_enum, 
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

  -- Servings for pb-muscleblaze-high-protein-dark-choco
  DELETE FROM public.food_servings WHERE food_id = 'pb-muscleblaze-high-protein-dark-choco';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('pb-muscleblaze-high-protein-dark-choco', 'tbsp-1', '1 Tbsp', 15);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('pb-muscleblaze-high-protein-dark-choco', 'tbsp-2', '2 Tbsp (Standard)', 30);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('pb-muscleblaze-high-protein-dark-choco', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'pb-yogabar-natural', 
  'Yoga Bar 100% Peanut Butter', 
  'योगा बार पीनट बटर', 
  ARRAY['yogabar natural PB']::TEXT[], 
  ARRAY['yogabar', 'yoga bar', 'peanut butter', 'natural', 'unsweetened']::TEXT[], 
  'oil-fat', 
  'peanut-butter', 
  'snack'::public.item_type_enum, 
  'raw'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  32,
  646, 31, 14, 51.5, 6.2,
  20, NULL, NULL, 1, 40,
  '{"vegan","veg","jain"}'::public.diet_type_enum[], 
  ARRAY['high-protein', 'high-fat', 'no-added-sugar']::TEXT[], 
  '{"navratri"}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  true, true, true, false, false, false,
  14, 
  NULL, 
  0, 
  'FSSAI-label'::public.source_enum, 
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

  -- Servings for pb-yogabar-natural
  DELETE FROM public.food_servings WHERE food_id = 'pb-yogabar-natural';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('pb-yogabar-natural', 'tbsp-1', '1 Tbsp', 15);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('pb-yogabar-natural', 'tbsp-2', '2 Tbsp (Standard)', 32);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('pb-yogabar-natural', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'pb-twt-natural-100peanut', 
  'The Whole Truth Peanut Butter (Natural)', 
  'द होल ट्रुथ पीनट बटर', 
  ARRAY['twt 100% peanut butter']::TEXT[], 
  ARRAY['the whole truth', 'twt', 'peanut butter', 'natural', 'unsweetened']::TEXT[], 
  'oil-fat', 
  'peanut-butter', 
  'snack'::public.item_type_enum, 
  'raw'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  32,
  651.4, 25, 17.7, 53.4, 8.7,
  26, NULL, NULL, 1.1, 35,
  '{"vegan","veg","jain"}'::public.diet_type_enum[], 
  ARRAY['high-fat', 'no-added-sugar', 'clean-label']::TEXT[], 
  '{"navratri"}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  true, true, true, false, false, false,
  14, 
  NULL, 
  0, 
  'FSSAI-label'::public.source_enum, 
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

  -- Servings for pb-twt-natural-100peanut
  DELETE FROM public.food_servings WHERE food_id = 'pb-twt-natural-100peanut';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('pb-twt-natural-100peanut', 'tbsp-1', '1 Tbsp', 15);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('pb-twt-natural-100peanut', 'tbsp-2', '2 Tbsp (Standard)', 32);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('pb-twt-natural-100peanut', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'pb-happilo-natural', 
  'Happilo All Natural Peanut Butter', 
  'हैपिलो नेचुरल पीनट बटर', 
  ARRAY['happilo unsweetened pb']::TEXT[], 
  ARRAY['happilo', 'natural', 'peanut butter', 'unsweetened']::TEXT[], 
  'oil-fat', 
  'peanut-butter', 
  'snack'::public.item_type_enum, 
  'raw'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  32,
  646, 29, 20, 50, 6,
  30, NULL, NULL, 1.2, 40,
  '{"vegan","veg","jain"}'::public.diet_type_enum[], 
  ARRAY['high-protein', 'high-fat', 'no-added-sugar']::TEXT[], 
  '{"navratri"}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  true, true, true, false, false, false,
  14, 
  NULL, 
  0, 
  'FSSAI-label'::public.source_enum, 
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

  -- Servings for pb-happilo-natural
  DELETE FROM public.food_servings WHERE food_id = 'pb-happilo-natural';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('pb-happilo-natural', 'tbsp-1', '1 Tbsp', 15);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('pb-happilo-natural', 'tbsp-2', '2 Tbsp (Standard)', 32);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('pb-happilo-natural', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'pb-saffola-fittify-plant-protein-creamy', 
  'Saffola FITTIFY Plant Protein Peanut Butter', 
  'सफोला फिट्टीफाई प्लांट प्रोटीन पीनट बटर', 
  ARRAY['saffola peanut butter fittify']::TEXT[], 
  ARRAY['saffola', 'fittify', 'plant protein', 'peanut butter', 'creamy']::TEXT[], 
  'supplement', 
  'peanut-butter', 
  'supplement'::public.item_type_enum, 
  'raw'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  32,
  634, 34.5, 12.3, 49.6, 6.3,
  112, NULL, NULL, 2, 45,
  '{"vegan","veg","jain"}'::public.diet_type_enum[], 
  ARRAY['very-high-protein']::TEXT[], 
  '{}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  true, false, true, false, false, false,
  18, 
  NULL, 
  0, 
  'FSSAI-label'::public.source_enum, 
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

  -- Servings for pb-saffola-fittify-plant-protein-creamy
  DELETE FROM public.food_servings WHERE food_id = 'pb-saffola-fittify-plant-protein-creamy';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('pb-saffola-fittify-plant-protein-creamy', 'tbsp-1', '1 Tbsp', 15);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('pb-saffola-fittify-plant-protein-creamy', 'tbsp-2', '2 Tbsp (Standard)', 32);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('pb-saffola-fittify-plant-protein-creamy', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'pb-droetker-funfoods-crunchy', 
  'Dr. Oetker FunFoods Crunchy Peanut Butter', 
  'डॉ ओटेकर फनफूड्स पीनट बटर', 
  ARRAY['funfoods peanut butter']::TEXT[], 
  ARRAY['dr oetker', 'funfoods', 'peanut butter', 'crunchy']::TEXT[], 
  'oil-fat', 
  'peanut-butter', 
  'snack'::public.item_type_enum, 
  'raw'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  32,
  636, 25.6, 20.3, 50.3, 6.5,
  345, NULL, NULL, 1.1, 40,
  '{"veg"}'::public.diet_type_enum[], 
  ARRAY['high-fat', 'high-calorie']::TEXT[], 
  '{}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  true, false, true, false, false, false,
  28, 
  NULL, 
  0, 
  'FSSAI-label'::public.source_enum, 
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

  -- Servings for pb-droetker-funfoods-crunchy
  DELETE FROM public.food_servings WHERE food_id = 'pb-droetker-funfoods-crunchy';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('pb-droetker-funfoods-crunchy', 'tbsp-1', '1 Tbsp', 15);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('pb-droetker-funfoods-crunchy', 'tbsp-2', '2 Tbsp (Standard)', 32);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('pb-droetker-funfoods-crunchy', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'pb-disano-natural', 
  'DiSano Natural Peanut Butter (Unsweetened)', 
  'दिसानो नेचुरल पीनट बटर', 
  ARRAY['disano unsweetened pb']::TEXT[], 
  ARRAY['disano', 'natural', 'peanut butter', 'unsweetened']::TEXT[], 
  'oil-fat', 
  'peanut-butter', 
  'snack'::public.item_type_enum, 
  'raw'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  32,
  639, 30, 18, 49, 9,
  19, NULL, NULL, 1.5, 40,
  '{"vegan","veg","jain"}'::public.diet_type_enum[], 
  ARRAY['high-protein', 'high-fat', 'no-added-sugar']::TEXT[], 
  '{"navratri"}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  true, true, true, false, false, false,
  14, 
  NULL, 
  0, 
  'FSSAI-label'::public.source_enum, 
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

  -- Servings for pb-disano-natural
  DELETE FROM public.food_servings WHERE food_id = 'pb-disano-natural';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('pb-disano-natural', 'tbsp-1', '1 Tbsp', 15);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('pb-disano-natural', 'tbsp-2', '2 Tbsp (Standard)', 32);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('pb-disano-natural', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'pb-bagrrys-natural', 
  'Bagrry''s Natural Peanut Butter', 
  'बॅगरीज नेचुरल पीनट बटर', 
  ARRAY['bagrrys unsweetened pb']::TEXT[], 
  ARRAY['bagrrys', 'bagrry', 'natural', 'peanut butter', 'unsweetened']::TEXT[], 
  'oil-fat', 
  'peanut-butter', 
  'snack'::public.item_type_enum, 
  'raw'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  32,
  640, 30, 18, 50, 9,
  20, NULL, NULL, 1.5, 40,
  '{"vegan","veg","jain"}'::public.diet_type_enum[], 
  ARRAY['high-protein', 'high-fat', 'no-added-sugar']::TEXT[], 
  '{"navratri"}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  true, true, true, false, false, false,
  14, 
  NULL, 
  0, 
  'FSSAI-label'::public.source_enum, 
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

  -- Servings for pb-bagrrys-natural
  DELETE FROM public.food_servings WHERE food_id = 'pb-bagrrys-natural';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('pb-bagrrys-natural', 'tbsp-1', '1 Tbsp', 15);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('pb-bagrrys-natural', 'tbsp-2', '2 Tbsp (Standard)', 32);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('pb-bagrrys-natural', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'pb-nutralite-protein', 
  'Nutralite Activ Protein Peanut Butter Crunchy', 
  'न्यूट्रालाइट प्रोटीन पीनट बटर', 
  ARRAY['nutralite peanut butter']::TEXT[], 
  ARRAY['nutralite', 'activ', 'protein', 'peanut butter']::TEXT[], 
  'supplement', 
  'peanut-butter', 
  'supplement'::public.item_type_enum, 
  'raw'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  32,
  600, 26, 20, 45, 6,
  200, NULL, NULL, 1.5, 40,
  '{"vegan","veg"}'::public.diet_type_enum[], 
  ARRAY['high-protein']::TEXT[], 
  '{}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  true, false, true, false, false, false,
  25, 
  NULL, 
  0, 
  'curated-estimate'::public.source_enum, 
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

  -- Servings for pb-nutralite-protein
  DELETE FROM public.food_servings WHERE food_id = 'pb-nutralite-protein';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('pb-nutralite-protein', 'tbsp-1', '1 Tbsp', 15);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('pb-nutralite-protein', 'tbsp-2', '2 Tbsp (Standard)', 32);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('pb-nutralite-protein', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'pb-ritebite-max-protein', 
  'RiteBite Max Protein Peanut Butter', 
  'रइटबाइट मैक्स प्रोटीन पीनट बटर', 
  ARRAY['max protein pb']::TEXT[], 
  ARRAY['ritebite', 'max protein', 'peanut butter']::TEXT[], 
  'supplement', 
  'peanut-butter', 
  'supplement'::public.item_type_enum, 
  'raw'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  32,
  600, 26, 20, 45, 6,
  150, NULL, NULL, 1.5, 40,
  '{"veg"}'::public.diet_type_enum[], 
  ARRAY['high-protein', 'high-fat']::TEXT[], 
  '{}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  true, false, true, false, false, false,
  25, 
  NULL, 
  0, 
  'curated-estimate'::public.source_enum, 
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

  -- Servings for pb-ritebite-max-protein
  DELETE FROM public.food_servings WHERE food_id = 'pb-ritebite-max-protein';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('pb-ritebite-max-protein', 'tbsp-1', '1 Tbsp', 15);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('pb-ritebite-max-protein', 'tbsp-2', '2 Tbsp (Standard)', 32);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('pb-ritebite-max-protein', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'pb-jusamazin-crunchy-organic', 
  'Jus Amazin Organic Peanut Butter (Crunchy)', 
  'जस अमेज़िन ऑर्गेनिक पीनट बटर', 
  ARRAY['jus amazin pb unsweetened']::TEXT[], 
  ARRAY['jus amazin', 'organic', 'peanut butter', 'unsweetened', 'crunchy']::TEXT[], 
  'oil-fat', 
  'peanut-butter', 
  'snack'::public.item_type_enum, 
  'raw'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  32,
  576.4, 27.8, 29.3, 38.6, 14.2,
  15, NULL, NULL, 2, 40,
  '{"vegan","veg","jain"}'::public.diet_type_enum[], 
  ARRAY['high-protein', 'organic', 'no-added-sugar', 'clean-label']::TEXT[], 
  '{"navratri"}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  true, true, true, false, false, false,
  14, 
  NULL, 
  0, 
  'FSSAI-label'::public.source_enum, 
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

  -- Servings for pb-jusamazin-crunchy-organic
  DELETE FROM public.food_servings WHERE food_id = 'pb-jusamazin-crunchy-organic';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('pb-jusamazin-crunchy-organic', 'tbsp-1', '1 Tbsp', 15);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('pb-jusamazin-crunchy-organic', 'tbsp-2', '2 Tbsp (Standard)', 32);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('pb-jusamazin-crunchy-organic', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'nb-pintola-almond-unsweetened', 
  'Pintola Almond Butter (Unsweetened)', 
  'पिनटोला बादाम मक्खन', 
  ARRAY['pintola natural almond butter']::TEXT[], 
  ARRAY['pintola', 'almond butter', 'unsweetened', 'natural']::TEXT[], 
  'oil-fat', 
  'nut-butter', 
  'snack'::public.item_type_enum, 
  'raw'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  32,
  582, 24, 22, 49, 12,
  1, NULL, NULL, 3.7, 269,
  '{"vegan","veg","jain"}'::public.diet_type_enum[], 
  ARRAY['high-fat', 'no-added-sugar', 'keto-friendly']::TEXT[], 
  '{"navratri","ekadashi"}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  true, true, true, false, false, false,
  10, 
  NULL, 
  0, 
  'FSSAI-label'::public.source_enum, 
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

  -- Servings for nb-pintola-almond-unsweetened
  DELETE FROM public.food_servings WHERE food_id = 'nb-pintola-almond-unsweetened';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('nb-pintola-almond-unsweetened', 'tbsp-1', '1 Tbsp', 15);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('nb-pintola-almond-unsweetened', 'tbsp-2', '2 Tbsp (Standard)', 32);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('nb-pintola-almond-unsweetened', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'nb-happilo-almond-unsweetened', 
  'Happilo All Natural Almond Butter', 
  'हैपिलो बादाम मक्खन', 
  ARRAY['happilo unsweetened almond butter']::TEXT[], 
  ARRAY['happilo', 'almond butter', 'unsweetened', 'natural']::TEXT[], 
  'oil-fat', 
  'nut-butter', 
  'snack'::public.item_type_enum, 
  'raw'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  32,
  600, 22, 20, 50, 12,
  5, NULL, NULL, 3.5, 260,
  '{"vegan","veg","jain"}'::public.diet_type_enum[], 
  ARRAY['high-fat', 'no-added-sugar', 'keto-friendly']::TEXT[], 
  '{"navratri","ekadashi"}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  true, true, true, false, false, false,
  10, 
  NULL, 
  0, 
  'curated-estimate'::public.source_enum, 
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

  -- Servings for nb-happilo-almond-unsweetened
  DELETE FROM public.food_servings WHERE food_id = 'nb-happilo-almond-unsweetened';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('nb-happilo-almond-unsweetened', 'tbsp-1', '1 Tbsp', 15);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('nb-happilo-almond-unsweetened', 'tbsp-2', '2 Tbsp (Standard)', 32);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('nb-happilo-almond-unsweetened', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'nb-twt-almond-unsweetened', 
  'The Whole Truth Almond Butter', 
  'द होल ट्रुथ बादाम मक्खन', 
  ARRAY['twt 100% almond butter']::TEXT[], 
  ARRAY['the whole truth', 'twt', 'almond butter', 'unsweetened', '100%']::TEXT[], 
  'oil-fat', 
  'nut-butter', 
  'snack'::public.item_type_enum, 
  'raw'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  32,
  620, 21, 18, 52, 11,
  5, NULL, NULL, 3.4, 265,
  '{"vegan","veg","jain"}'::public.diet_type_enum[], 
  ARRAY['high-fat', 'no-added-sugar', 'clean-label', 'keto-friendly']::TEXT[], 
  '{"navratri","ekadashi"}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  true, true, true, false, false, false,
  10, 
  NULL, 
  0, 
  'curated-estimate'::public.source_enum, 
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

  -- Servings for nb-twt-almond-unsweetened
  DELETE FROM public.food_servings WHERE food_id = 'nb-twt-almond-unsweetened';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('nb-twt-almond-unsweetened', 'tbsp-1', '1 Tbsp', 15);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('nb-twt-almond-unsweetened', 'tbsp-2', '2 Tbsp (Standard)', 32);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('nb-twt-almond-unsweetened', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'bar-ritebite-max-10g-chocoalmond', 
  'RiteBite Max Protein Daily Bar (10g Protein)', 
  'रइटबाइट मैक्स प्रोटीन बार 10g', 
  ARRAY['max protein 10g bar', 'ritebite daily']::TEXT[], 
  ARRAY['ritebite', 'max protein', '10g', 'choco almond', 'daily bar']::TEXT[], 
  'supplement', 
  'energy-bar', 
  'supplement'::public.item_type_enum, 
  'raw'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  50,
  420, 20, 50, 15, 10,
  200, 1, 2.5, 3, 100,
  '{"veg"}'::public.diet_type_enum[], 
  ARRAY['moderate-protein', 'snack']::TEXT[], 
  '{}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  true, false, true, false, false, false,
  40, 
  NULL, 
  0, 
  'FSSAI-label'::public.source_enum, 
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

  -- Servings for bar-ritebite-max-10g-chocoalmond
  DELETE FROM public.food_servings WHERE food_id = 'bar-ritebite-max-10g-chocoalmond';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('bar-ritebite-max-10g-chocoalmond', 'bar-1', '1 Bar (50g)', 50);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('bar-ritebite-max-10g-chocoalmond', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'bar-ritebite-max-20g-chocobadamm', 
  'RiteBite Max Protein Active Bar (20g Protein)', 
  'रइटबाइट मैक्स प्रोटीन बार 20g', 
  ARRAY['max protein 20g bar', 'ritebite active choco']::TEXT[], 
  ARRAY['ritebite', 'max protein', '20g', 'choco badam', 'active bar']::TEXT[], 
  'supplement', 
  'protein-bar', 
  'supplement'::public.item_type_enum, 
  'raw'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  67,
  467, 29.8, 44.8, 17.9, 10.4,
  224, 1.5, 5, 4.5, 200,
  '{"veg"}'::public.diet_type_enum[], 
  ARRAY['high-protein', 'no-added-sugar']::TEXT[], 
  '{}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  true, false, true, false, false, false,
  35, 
  NULL, 
  0, 
  'FSSAI-label'::public.source_enum, 
  'high'::public.confidence_enum, 
  'Zero added sugar, contains sugar alcohols.'
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

  -- Servings for bar-ritebite-max-20g-chocobadamm
  DELETE FROM public.food_servings WHERE food_id = 'bar-ritebite-max-20g-chocobadamm';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('bar-ritebite-max-20g-chocobadamm', 'bar-1', '1 Bar (67g)', 67);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('bar-ritebite-max-20g-chocobadamm', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'bar-ritebite-max-30g-chocoberry', 
  'RiteBite Max Protein Ultimate Bar (30g Protein)', 
  'रइटबाइट मैक्स प्रोटीन 30g अल्टीमेट', 
  ARRAY['max protein 30g bar', 'ritebite ultimate']::TEXT[], 
  ARRAY['ritebite', 'max protein', '30g', 'choco berry', 'ultimate bar']::TEXT[], 
  'supplement', 
  'protein-bar', 
  'supplement'::public.item_type_enum, 
  'raw'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  100,
  401, 30, 40, 12, 10,
  350, 2, 5, 5, 250,
  '{"veg"}'::public.diet_type_enum[], 
  ARRAY['very-high-protein', 'no-added-sugar']::TEXT[], 
  '{}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  true, false, true, false, false, false,
  30, 
  NULL, 
  0, 
  'FSSAI-label'::public.source_enum, 
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

  -- Servings for bar-ritebite-max-30g-chocoberry
  DELETE FROM public.food_servings WHERE food_id = 'bar-ritebite-max-30g-chocoberry';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('bar-ritebite-max-30g-chocoberry', 'bar-1', '1 Bar (100g)', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'bar-twt-protein-20g-double-cocoa', 
  'The Whole Truth 20g Protein Bar (Double Cocoa)', 
  'द होल ट्रुथ 20g प्रोटीन बार', 
  ARRAY['twt 20g protein bar', 'whole truth bar']::TEXT[], 
  ARRAY['the whole truth', 'twt', '20g', 'protein bar', 'double cocoa']::TEXT[], 
  'supplement', 
  'protein-bar', 
  'supplement'::public.item_type_enum, 
  'raw'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  67,
  502, 30.3, 31.9, 28, 8.6,
  213, NULL, NULL, 1, 60,
  '{"veg"}'::public.diet_type_enum[], 
  ARRAY['high-protein', 'clean-label', 'no-added-sugar', 'no-artificial-sweetener']::TEXT[], 
  '{"navratri"}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  true, true, true, false, false, false,
  35, 
  NULL, 
  0, 
  'FSSAI-label'::public.source_enum, 
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

  -- Servings for bar-twt-protein-20g-double-cocoa
  DELETE FROM public.food_servings WHERE food_id = 'bar-twt-protein-20g-double-cocoa';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('bar-twt-protein-20g-double-cocoa', 'bar-1', '1 Bar (67g)', 67);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('bar-twt-protein-20g-double-cocoa', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'bar-twt-energy-choco-fruit-nut', 
  'The Whole Truth Energy Bar (Choco Fruit & Nut)', 
  'द होल ट्रुथ एनर्जी बार', 
  ARRAY['twt energy bar']::TEXT[], 
  ARRAY['the whole truth', 'twt', 'energy bar', 'choco fruit nut']::TEXT[], 
  'supplement', 
  'energy-bar', 
  'supplement'::public.item_type_enum, 
  'raw'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  40,
  425, 10, 55, 20, 9,
  15, NULL, NULL, 2, 40,
  '{"vegan","veg"}'::public.diet_type_enum[], 
  ARRAY['high-fiber', 'clean-label', 'no-added-sugar']::TEXT[], 
  '{"navratri"}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  true, true, true, false, false, false,
  45, 
  NULL, 
  0, 
  'curated-estimate'::public.source_enum, 
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

  -- Servings for bar-twt-energy-choco-fruit-nut
  DELETE FROM public.food_servings WHERE food_id = 'bar-twt-energy-choco-fruit-nut';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('bar-twt-energy-choco-fruit-nut', 'bar-1', '1 Bar (40g)', 40);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('bar-twt-energy-choco-fruit-nut', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'bar-yogabar-protein-20g-chocobrownie', 
  'Yogabar 20g Protein Bar (Choco Brownie)', 
  'योगा बार 20g प्रोटीन बार', 
  ARRAY['yogabar protein bar']::TEXT[], 
  ARRAY['yogabar', '20g', 'protein bar', 'choco brownie']::TEXT[], 
  'supplement', 
  'protein-bar', 
  'supplement'::public.item_type_enum, 
  'raw'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  60,
  533, 33.3, 43.3, 25, 15,
  166, NULL, NULL, 2.5, 100,
  '{"veg"}'::public.diet_type_enum[], 
  ARRAY['high-protein', 'high-fiber', 'no-added-sugar']::TEXT[], 
  '{}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  true, false, true, false, false, false,
  35, 
  NULL, 
  0, 
  'FSSAI-label'::public.source_enum, 
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

  -- Servings for bar-yogabar-protein-20g-chocobrownie
  DELETE FROM public.food_servings WHERE food_id = 'bar-yogabar-protein-20g-chocobrownie';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('bar-yogabar-protein-20g-chocobrownie', 'bar-1', '1 Bar (60g)', 60);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('bar-yogabar-protein-20g-chocobrownie', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'bar-yogabar-energy-chocolate-chunk', 
  'Yogabar Multigrain Energy Bar (Chocolate Chunk)', 
  'योगा बार एनर्जी बार', 
  ARRAY['yogabar energy bar']::TEXT[], 
  ARRAY['yogabar', 'energy bar', 'multigrain', 'chocolate chunk']::TEXT[], 
  'supplement', 
  'energy-bar', 
  'supplement'::public.item_type_enum, 
  'raw'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  38,
  420, 11, 58, 15, 10,
  120, NULL, NULL, 2, 50,
  '{"veg"}'::public.diet_type_enum[], 
  ARRAY['high-fiber', 'snack']::TEXT[], 
  '{}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  true, false, false, false, false, false,
  50, 
  NULL, 
  0, 
  'curated-estimate'::public.source_enum, 
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

  -- Servings for bar-yogabar-energy-chocolate-chunk
  DELETE FROM public.food_servings WHERE food_id = 'bar-yogabar-energy-chocolate-chunk';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('bar-yogabar-energy-chocolate-chunk', 'bar-1', '1 Bar (38g)', 38);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('bar-yogabar-energy-chocolate-chunk', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'bar-phab-protein-20g-chocoalmond', 
  'Phab Protein Bar (20g, Choco Almond)', 
  'फैब 20g प्रोटीन बार', 
  ARRAY['phab 20g bar']::TEXT[], 
  ARRAY['phab', '20g', 'protein bar', 'choco almond']::TEXT[], 
  'supplement', 
  'protein-bar', 
  'supplement'::public.item_type_enum, 
  'raw'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  65,
  380, 30.7, 40, 12, 8,
  180, NULL, NULL, 2, 80,
  '{"veg"}'::public.diet_type_enum[], 
  ARRAY['high-protein']::TEXT[], 
  '{}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  true, false, true, false, false, false,
  40, 
  NULL, 
  0, 
  'curated-estimate'::public.source_enum, 
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

  -- Servings for bar-phab-protein-20g-chocoalmond
  DELETE FROM public.food_servings WHERE food_id = 'bar-phab-protein-20g-chocoalmond';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('bar-phab-protein-20g-chocoalmond', 'bar-1', '1 Bar (65g)', 65);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('bar-phab-protein-20g-chocoalmond', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'bar-muscleblaze-protein-20g-cookiescream', 
  'MuscleBlaze Protein Bar (20g, Cookies & Cream)', 
  'मसलब्लेज़ 20g प्रोटीन बार', 
  ARRAY['mb protein bar cookies and cream']::TEXT[], 
  ARRAY['muscleblaze', 'mb', '20g', 'protein bar', 'cookies cream']::TEXT[], 
  'supplement', 
  'protein-bar', 
  'supplement'::public.item_type_enum, 
  'raw'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  65,
  372, 30.7, 38, 13, 6,
  200, NULL, NULL, 1.5, 100,
  '{"veg"}'::public.diet_type_enum[], 
  ARRAY['high-protein']::TEXT[], 
  '{}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  true, false, false, false, false, false,
  42, 
  NULL, 
  0, 
  'FSSAI-label'::public.source_enum, 
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

  -- Servings for bar-muscleblaze-protein-20g-cookiescream
  DELETE FROM public.food_servings WHERE food_id = 'bar-muscleblaze-protein-20g-cookiescream';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('bar-muscleblaze-protein-20g-cookiescream', 'bar-1', '1 Bar (65g)', 65);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('bar-muscleblaze-protein-20g-cookiescream', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'bar-hyp-lean-20g-darkchoco', 
  'HYP Lean Protein Bar (20g, Dark Choco)', 
  'हाइप लीन प्रोटीन बार', 
  ARRAY['hyp lean bar']::TEXT[], 
  ARRAY['hyp', 'lean', '20g', 'protein bar', 'dark choco']::TEXT[], 
  'supplement', 
  'protein-bar', 
  'supplement'::public.item_type_enum, 
  'raw'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  60,
  360, 33.3, 33, 11, 12,
  110, NULL, NULL, 2, 120,
  '{"veg"}'::public.diet_type_enum[], 
  ARRAY['high-protein', 'no-added-sugar', 'clean-label']::TEXT[], 
  '{}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  true, false, true, false, false, false,
  30, 
  NULL, 
  0, 
  'curated-estimate'::public.source_enum, 
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

  -- Servings for bar-hyp-lean-20g-darkchoco
  DELETE FROM public.food_servings WHERE food_id = 'bar-hyp-lean-20g-darkchoco';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('bar-hyp-lean-20g-darkchoco', 'bar-1', '1 Bar (60g)', 60);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('bar-hyp-lean-20g-darkchoco', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'bar-eatanytime-protein-10g-cranberry', 
  'Eat Anytime Protein Bar (10g, Cranberry)', 
  'ईट एनीटाइम प्रोटीन बार', 
  ARRAY['eat anytime bar']::TEXT[], 
  ARRAY['eat anytime', '10g', 'protein bar', 'cranberry']::TEXT[], 
  'supplement', 
  'energy-bar', 
  'supplement'::public.item_type_enum, 
  'raw'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  40,
  410, 25, 55, 12, 8,
  150, NULL, NULL, 1, 50,
  '{"veg"}'::public.diet_type_enum[], 
  ARRAY['moderate-protein']::TEXT[], 
  '{}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  true, false, false, false, false, false,
  45, 
  NULL, 
  0, 
  'curated-estimate'::public.source_enum, 
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

  -- Servings for bar-eatanytime-protein-10g-cranberry
  DELETE FROM public.food_servings WHERE food_id = 'bar-eatanytime-protein-10g-cranberry';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('bar-eatanytime-protein-10g-cranberry', 'bar-1', '1 Bar (40g)', 40);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('bar-eatanytime-protein-10g-cranberry', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'bar-opensecret-protein-chocochip', 
  'Open Secret Protein Bar (Choco Chip)', 
  'ओपन सीक्रेट प्रोटीन बार', 
  ARRAY['open secret bar']::TEXT[], 
  ARRAY['open secret', 'protein bar', 'choco chip', 'un-junked']::TEXT[], 
  'supplement', 
  'protein-bar', 
  'supplement'::public.item_type_enum, 
  'raw'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  40,
  450, 25, 45, 18, 7,
  100, NULL, NULL, 1.5, 60,
  '{"veg"}'::public.diet_type_enum[], 
  ARRAY['moderate-protein', 'clean-label', 'no-artificial-sweetener']::TEXT[], 
  '{}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  true, false, true, false, false, false,
  40, 
  NULL, 
  0, 
  'curated-estimate'::public.source_enum, 
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

  -- Servings for bar-opensecret-protein-chocochip
  DELETE FROM public.food_servings WHERE food_id = 'bar-opensecret-protein-chocochip';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('bar-opensecret-protein-chocochip', 'bar-1', '1 Bar (40g)', 40);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('bar-opensecret-protein-chocochip', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'bar-grenade-carb-killa-white-choco', 
  'Grenade Carb Killa Protein Bar (White Choco)', 
  'ग्रेनेड कार्ब किला प्रोटीन बार', 
  ARRAY['carb killa bar grenade']::TEXT[], 
  ARRAY['grenade', 'carb killa', 'protein bar', 'white choco', 'import']::TEXT[], 
  'supplement', 
  'protein-bar', 
  'supplement'::public.item_type_enum, 
  'raw'::public.food_state_enum, 
  'imported'::public.region_enum, 
  60,
  386, 36.6, 33.3, 16.6, 8.3,
  233, NULL, NULL, 1, 150,
  '{"veg"}'::public.diet_type_enum[], 
  ARRAY['high-protein', 'low-sugar']::TEXT[], 
  '{}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  true, false, true, false, false, false,
  25, 
  NULL, 
  0, 
  'FSSAI-label'::public.source_enum, 
  'high'::public.confidence_enum, 
  'Imported product. Sweetened with maltitol.'
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

  -- Servings for bar-grenade-carb-killa-white-choco
  DELETE FROM public.food_servings WHERE food_id = 'bar-grenade-carb-killa-white-choco';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('bar-grenade-carb-killa-white-choco', 'bar-1', '1 Bar (60g)', 60);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('bar-grenade-carb-killa-white-choco', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'oats-quaker-rolled', 
  'Quaker Rolled Oats', 
  'क्वेकर रोल्ड ओट्स', 
  ARRAY['quaker plain oats']::TEXT[], 
  ARRAY['quaker', 'oats', 'rolled', 'plain', 'breakfast']::TEXT[], 
  'grain-cereal', 
  'breakfast-oats', 
  'base-food'::public.item_type_enum, 
  'raw'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  40,
  380, 13, 68, 6.5, 10,
  5, NULL, NULL, 4, 50,
  '{"vegan","veg","jain"}'::public.diet_type_enum[], 
  ARRAY['high-fiber']::TEXT[], 
  '{}'::public.fasting_type_enum[], 
  ARRAY['porridge']::TEXT[], 
  '{"porridge":0.25}'::jsonb,
  false, false, false, false, false, false,
  55, 
  'Use milk or water to boil.', 
  0, 
  'curated-estimate'::public.source_enum, 
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

  -- Servings for oats-quaker-rolled
  DELETE FROM public.food_servings WHERE food_id = 'oats-quaker-rolled';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('oats-quaker-rolled', 'cup-half', '1/2 cup (dry)', 40);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('oats-quaker-rolled', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'oats-bagrrys-rolled', 
  'Bagrry''s White Oats (Rolled)', 
  'बॅगरीज व्हाइट ओट्स', 
  ARRAY['bagrrys plain oats']::TEXT[], 
  ARRAY['bagrrys', 'bagrry', 'oats', 'white', 'plain']::TEXT[], 
  'grain-cereal', 
  'breakfast-oats', 
  'base-food'::public.item_type_enum, 
  'raw'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  40,
  380, 14, 66, 8, 10.5,
  5, NULL, NULL, 4, 50,
  '{"vegan","veg","jain"}'::public.diet_type_enum[], 
  ARRAY['high-fiber', 'clean-label']::TEXT[], 
  '{}'::public.fasting_type_enum[], 
  ARRAY['porridge']::TEXT[], 
  '{"porridge":0.25}'::jsonb,
  false, false, false, false, false, false,
  55, 
  'Use milk or water to boil.', 
  0, 
  'curated-estimate'::public.source_enum, 
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

  -- Servings for oats-bagrrys-rolled
  DELETE FROM public.food_servings WHERE food_id = 'oats-bagrrys-rolled';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('oats-bagrrys-rolled', 'cup-half', '1/2 cup (dry)', 40);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('oats-bagrrys-rolled', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'oats-saffola-masala-classic', 
  'Saffola Masala Oats (Classic Masala)', 
  'सफोला मसाला ओट्स', 
  ARRAY['saffola masala oats']::TEXT[], 
  ARRAY['saffola', 'masala oats', 'classic masala', 'savoury']::TEXT[], 
  'grain-cereal', 
  'breakfast-oats', 
  'base-food'::public.item_type_enum, 
  'raw'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  40,
  380, 10, 65, 8, 10,
  1100, NULL, NULL, 2, 40,
  '{"veg"}'::public.diet_type_enum[], 
  ARRAY['high-sodium', 'savoury']::TEXT[], 
  '{}'::public.fasting_type_enum[], 
  ARRAY['cooked']::TEXT[], 
  '{"cooked":0.3}'::jsonb,
  true, false, false, false, true, false,
  60, 
  'Cooked with water.', 
  0, 
  'FSSAI-label'::public.source_enum, 
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

  -- Servings for oats-saffola-masala-classic
  DELETE FROM public.food_servings WHERE food_id = 'oats-saffola-masala-classic';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('oats-saffola-masala-classic', 'pouch-1', '1 Small Pouch (40g dry)', 40);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('oats-saffola-masala-classic', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'muesli-bagrrys-no-added-sugar', 
  'Bagrry''s Muesli (No Added Sugar)', 
  'बॅगरीज मूसली नो एडेड शुगर', 
  ARRAY['bagrrys diet muesli']::TEXT[], 
  ARRAY['bagrrys', 'bagrry', 'muesli', 'no added sugar', 'nas']::TEXT[], 
  'breakfast', 
  'muesli', 
  'base-food'::public.item_type_enum, 
  'raw'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  30,
  383, 10, 75, 5, 10,
  50, NULL, NULL, 3, 60,
  '{"vegan","veg"}'::public.diet_type_enum[], 
  ARRAY['no-added-sugar', 'high-fiber']::TEXT[], 
  '{}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  true, false, false, false, false, false,
  50, 
  NULL, 
  0, 
  'FSSAI-label'::public.source_enum, 
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

  -- Servings for muesli-bagrrys-no-added-sugar
  DELETE FROM public.food_servings WHERE food_id = 'muesli-bagrrys-no-added-sugar';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('muesli-bagrrys-no-added-sugar', 'bowl-1', '1 Bowl (30g)', 30);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('muesli-bagrrys-no-added-sugar', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'muesli-yogabar-protein-chocoalmond', 
  'Yogabar High Protein Muesli (Choco Almond)', 
  'योगा बार प्रोटीन मूसली', 
  ARRAY['yogabar protein muesli']::TEXT[], 
  ARRAY['yogabar', 'muesli', 'high protein', 'choco almond']::TEXT[], 
  'breakfast', 
  'muesli', 
  'base-food'::public.item_type_enum, 
  'raw'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  50,
  430, 25, 55, 11.4, 9,
  150, NULL, NULL, 3.5, 80,
  '{"veg"}'::public.diet_type_enum[], 
  ARRAY['high-protein']::TEXT[], 
  '{}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  true, false, false, false, false, false,
  55, 
  NULL, 
  0, 
  'FSSAI-label'::public.source_enum, 
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

  -- Servings for muesli-yogabar-protein-chocoalmond
  DELETE FROM public.food_servings WHERE food_id = 'muesli-yogabar-protein-chocoalmond';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('muesli-yogabar-protein-chocoalmond', 'bowl-1', '1 Bowl (50g)', 50);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('muesli-yogabar-protein-chocoalmond', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'granola-trueelements-dark-choc', 
  'True Elements Baked Granola (Dark Chocolate)', 
  'ट्रू एलीमेंट्स बेक्ड ग्रेनोला', 
  ARRAY['true elements granola']::TEXT[], 
  ARRAY['true elements', 'granola', 'baked', 'dark chocolate']::TEXT[], 
  'breakfast', 
  'granola', 
  'base-food'::public.item_type_enum, 
  'raw'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  30,
  431, 11.8, 71.2, 11, 10,
  19, NULL, NULL, 2.5, 60,
  '{"veg"}'::public.diet_type_enum[], 
  ARRAY['high-fiber']::TEXT[], 
  '{}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  true, false, false, false, false, false,
  55, 
  NULL, 
  0, 
  'FSSAI-label'::public.source_enum, 
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

  -- Servings for granola-trueelements-dark-choc
  DELETE FROM public.food_servings WHERE food_id = 'granola-trueelements-dark-choc';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('granola-trueelements-dark-choc', 'bowl-1', '1 Bowl (30g)', 30);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('granola-trueelements-dark-choc', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'muesli-muscleblaze-dark-choco-cranberry', 
  'MuscleBlaze Protein Muesli (Dark Choco Cranberry)', 
  'मसलब्लेज़ प्रोटीन मूसली', 
  ARRAY['mb muesli']::TEXT[], 
  ARRAY['muscleblaze', 'mb', 'muesli', 'protein', 'dark choco', 'cranberry']::TEXT[], 
  'breakfast', 
  'muesli', 
  'base-food'::public.item_type_enum, 
  'raw'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  50,
  410, 22, 58, 10, 7,
  160, NULL, NULL, 3, 80,
  '{"veg"}'::public.diet_type_enum[], 
  ARRAY['high-protein']::TEXT[], 
  '{}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  true, false, false, false, false, false,
  55, 
  NULL, 
  0, 
  'curated-estimate'::public.source_enum, 
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

  -- Servings for muesli-muscleblaze-dark-choco-cranberry
  DELETE FROM public.food_servings WHERE food_id = 'muesli-muscleblaze-dark-choco-cranberry';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('muesli-muscleblaze-dark-choco-cranberry', 'bowl-1', '1 Bowl (50g)', 50);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('muesli-muscleblaze-dark-choco-cranberry', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'muesli-soulfull-millet-muesli-crunchy', 
  'Tata Soulfull Millet Muesli (Crunchy)', 
  'टाटा सोलफुल मिलेट मूसली', 
  ARRAY['tata soulfull muesli', 'millet muesli']::TEXT[], 
  ARRAY['tata', 'soulfull', 'millet', 'muesli', 'crunchy']::TEXT[], 
  'breakfast', 
  'muesli', 
  'base-food'::public.item_type_enum, 
  'raw'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  40,
  390, 9, 75, 5.7, 8,
  185, NULL, NULL, 2.5, 70,
  '{"veg"}'::public.diet_type_enum[], 
  ARRAY['millet-based']::TEXT[], 
  '{}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  true, false, false, false, false, false,
  55, 
  NULL, 
  0, 
  'FSSAI-label'::public.source_enum, 
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

  -- Servings for muesli-soulfull-millet-muesli-crunchy
  DELETE FROM public.food_servings WHERE food_id = 'muesli-soulfull-millet-muesli-crunchy';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('muesli-soulfull-millet-muesli-crunchy', 'bowl-1', '1 Bowl (40g)', 40);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('muesli-soulfull-millet-muesli-crunchy', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'muesli-kelloggs-fruit-nut', 
  'Kellogg''s Muesli (Fruit Nut & Seeds)', 
  'केलॉग्स मूसली फ्रूट एंड नट', 
  ARRAY['kelloggs muesli fruit & nut']::TEXT[], 
  ARRAY['kelloggs', 'muesli', 'fruit nut', 'seeds']::TEXT[], 
  'breakfast', 
  'muesli', 
  'base-food'::public.item_type_enum, 
  'raw'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  40,
  396, 9, 75, 6.5, 5,
  120, NULL, NULL, 2, 40,
  '{"veg"}'::public.diet_type_enum[], 
  ARRAY['high-sugar']::TEXT[], 
  '{}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  true, false, false, false, false, false,
  60, 
  NULL, 
  0, 
  'curated-estimate'::public.source_enum, 
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

  -- Servings for muesli-kelloggs-fruit-nut
  DELETE FROM public.food_servings WHERE food_id = 'muesli-kelloggs-fruit-nut';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('muesli-kelloggs-fruit-nut', 'bowl-1', '1 Bowl (40g)', 40);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('muesli-kelloggs-fruit-nut', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'muesli-twt-no-added-sugar', 
  'The Whole Truth Muesli (No Added Sugar)', 
  'द होल ट्रुथ मूसली', 
  ARRAY['twt muesli']::TEXT[], 
  ARRAY['the whole truth', 'twt', 'muesli', 'no added sugar', 'nas']::TEXT[], 
  'breakfast', 
  'muesli', 
  'base-food'::public.item_type_enum, 
  'raw'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  40,
  400, 12, 60, 12, 10,
  50, NULL, NULL, 3, 60,
  '{"vegan","veg"}'::public.diet_type_enum[], 
  ARRAY['no-added-sugar', 'clean-label', 'high-fiber']::TEXT[], 
  '{}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  true, false, false, false, false, false,
  50, 
  NULL, 
  0, 
  'curated-estimate'::public.source_enum, 
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

  -- Servings for muesli-twt-no-added-sugar
  DELETE FROM public.food_servings WHERE food_id = 'muesli-twt-no-added-sugar';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('muesli-twt-no-added-sugar', 'bowl-1', '1 Bowl (40g)', 40);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('muesli-twt-no-added-sugar', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'drink-amul-highprotein-milk-250ml', 
  'Amul High Protein Milk (Lactose Free)', 
  'अमूल हाई प्रोटीन मिल्क', 
  ARRAY['amul protein milk 35g']::TEXT[], 
  ARRAY['amul', 'high protein milk', '35g', 'lactose free']::TEXT[], 
  'drink', 
  'high-protein-milk', 
  'drink'::public.item_type_enum, 
  'ready-to-drink'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  250,
  90, 14, 8, 0.2, 0,
  60, 0.5, NULL, 0.1, 150,
  '{"veg"}'::public.diet_type_enum[], 
  ARRAY['very-high-protein', 'lactose-free', 'low-fat']::TEXT[], 
  '{}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  true, false, true, false, false, false,
  35, 
  NULL, 
  0, 
  'FSSAI-label'::public.source_enum, 
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

  -- Servings for drink-amul-highprotein-milk-250ml
  DELETE FROM public.food_servings WHERE food_id = 'drink-amul-highprotein-milk-250ml';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('drink-amul-highprotein-milk-250ml', 'pack-1', '1 Pack (250ml)', 250);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('drink-amul-highprotein-milk-250ml', 'g100', '100ml', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'drink-epigamia-proteinshake-chocolate', 
  'Epigamia Turbo Chocolate Protein Shake', 
  'एपिगेमिया टर्बो प्रोटीन शेक', 
  ARRAY['epigamia 25g protein shake']::TEXT[], 
  ARRAY['epigamia', 'turbo', 'protein shake', 'chocolate', '25g']::TEXT[], 
  'drink', 
  'protein-shake-rtd', 
  'drink'::public.item_type_enum, 
  'ready-to-drink'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  250,
  54, 10, 3.6, 0.4, 0,
  50, 0.2, NULL, 0.5, 120,
  '{"veg"}'::public.diet_type_enum[], 
  ARRAY['high-protein', 'no-added-sugar', 'low-fat']::TEXT[], 
  '{}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  true, false, true, false, false, false,
  40, 
  NULL, 
  0, 
  'FSSAI-label'::public.source_enum, 
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

  -- Servings for drink-epigamia-proteinshake-chocolate
  DELETE FROM public.food_servings WHERE food_id = 'drink-epigamia-proteinshake-chocolate';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('drink-epigamia-proteinshake-chocolate', 'pack-1', '1 Bottle (250ml)', 250);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('drink-epigamia-proteinshake-chocolate', 'g100', '100ml', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'drink-muscleblaze-proteinshake-chocolate', 
  'MuscleBlaze Protein Shake (Chocolate)', 
  'मसलब्लेज़ प्रोटीन शेक', 
  ARRAY['mb shake 18g']::TEXT[], 
  ARRAY['muscleblaze', 'mb', 'protein shake', 'chocolate', 'rtd']::TEXT[], 
  'drink', 
  'protein-shake-rtd', 
  'drink'::public.item_type_enum, 
  'ready-to-drink'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  200,
  65, 9, 5, 1, 0.5,
  60, NULL, NULL, 0.5, 100,
  '{"veg"}'::public.diet_type_enum[], 
  ARRAY['high-protein']::TEXT[], 
  '{}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  true, false, true, false, false, false,
  40, 
  NULL, 
  0, 
  'curated-estimate'::public.source_enum, 
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

  -- Servings for drink-muscleblaze-proteinshake-chocolate
  DELETE FROM public.food_servings WHERE food_id = 'drink-muscleblaze-proteinshake-chocolate';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('drink-muscleblaze-proteinshake-chocolate', 'pack-1', '1 Bottle (200ml)', 200);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'bread-britannia-white-slice', 
  'Britannia White Bread', 
  'ब्रिटानिया वाइट ब्रेड', 
  ARRAY['white bread slice']::TEXT[], 
  ARRAY['britannia', 'white bread', 'maida bread', 'slice']::TEXT[], 
  'roti-bread', 
  'packaged-bread', 
  'base-food'::public.item_type_enum, 
  'raw'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  25,
  250, 7, 50, 2, 2,
  350, NULL, NULL, 2, 50,
  '{"vegan","veg"}'::public.diet_type_enum[], 
  ARRAY['high-carb']::TEXT[], 
  '{}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  true, false, false, false, false, false,
  75, 
  NULL, 
  0, 
  'FSSAI-label'::public.source_enum, 
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

  -- Servings for bread-britannia-white-slice
  DELETE FROM public.food_servings WHERE food_id = 'bread-britannia-white-slice';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('bread-britannia-white-slice', 'slice-1', '1 Slice (25g)', 25);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('bread-britannia-white-slice', 'slice-2', '2 Slices (50g)', 50);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('bread-britannia-white-slice', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'bread-britannia-brown-slice', 
  'Britannia Brown Bread', 
  'ब्रिटानिया ब्राउन ब्रेड', 
  ARRAY['brown bread slice']::TEXT[], 
  ARRAY['britannia', 'brown bread', 'slice', 'wheat bread']::TEXT[], 
  'roti-bread', 
  'packaged-bread', 
  'base-food'::public.item_type_enum, 
  'raw'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  25,
  252, 8, 48, 2.5, 4,
  360, NULL, NULL, 2.5, 60,
  '{"vegan","veg"}'::public.diet_type_enum[], 
  ARRAY['moderate-fiber']::TEXT[], 
  '{}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  true, false, false, false, false, false,
  65, 
  NULL, 
  0, 
  'FSSAI-label'::public.source_enum, 
  'high'::public.confidence_enum, 
  'Blend of refined and whole wheat flour.'
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

  -- Servings for bread-britannia-brown-slice
  DELETE FROM public.food_servings WHERE food_id = 'bread-britannia-brown-slice';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('bread-britannia-brown-slice', 'slice-1', '1 Slice (25g)', 25);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('bread-britannia-brown-slice', 'slice-2', '2 Slices (50g)', 50);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('bread-britannia-brown-slice', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'bread-englishoven-100ww-slice', 
  'English Oven 100% Whole Wheat Bread', 
  'इंग्लिश ओवन 100% व्होल वीट ब्रेड', 
  ARRAY['english oven whole wheat']::TEXT[], 
  ARRAY['english oven', '100% whole wheat', 'zero maida', 'brown bread', 'slice']::TEXT[], 
  'roti-bread', 
  'high-protein-bread', 
  'base-food'::public.item_type_enum, 
  'raw'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  30,
  281, 10.6, 50.1, 2, 10,
  474, NULL, NULL, 3, 70,
  '{"vegan","veg"}'::public.diet_type_enum[], 
  ARRAY['high-fiber', 'clean-label', 'zero-maida']::TEXT[], 
  '{}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  true, false, false, false, false, false,
  50, 
  NULL, 
  0, 
  'FSSAI-label'::public.source_enum, 
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

  -- Servings for bread-englishoven-100ww-slice
  DELETE FROM public.food_servings WHERE food_id = 'bread-englishoven-100ww-slice';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('bread-englishoven-100ww-slice', 'slice-1', '1 Slice (~30g)', 30);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('bread-englishoven-100ww-slice', 'slice-2', '2 Slices (~60g)', 60);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('bread-englishoven-100ww-slice', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'bread-harvestgold-white-slice', 
  'Harvest Gold White Bread', 
  'हार्वेस्ट गोल्ड वाइट ब्रेड', 
  ARRAY['harvest gold white']::TEXT[], 
  ARRAY['harvest gold', 'white bread', 'maida', 'slice']::TEXT[], 
  'roti-bread', 
  'packaged-bread', 
  'base-food'::public.item_type_enum, 
  'raw'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  30,
  255, 7.5, 52, 1.5, 1.5,
  400, NULL, NULL, 1.5, 45,
  '{"vegan","veg"}'::public.diet_type_enum[], 
  ARRAY['high-carb']::TEXT[], 
  '{}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  true, false, false, false, false, false,
  75, 
  NULL, 
  0, 
  'curated-estimate'::public.source_enum, 
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

  -- Servings for bread-harvestgold-white-slice
  DELETE FROM public.food_servings WHERE food_id = 'bread-harvestgold-white-slice';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('bread-harvestgold-white-slice', 'slice-1', '1 Slice (~30g)', 30);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('bread-harvestgold-white-slice', 'slice-2', '2 Slices (~60g)', 60);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('bread-harvestgold-white-slice', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'snack-trueelements-seedsmix-roasted', 
  'True Elements Roasted Seeds Mix', 
  'ट्रू एलीमेंट्स रोस्टेड सीड्स मिक्स', 
  ARRAY['true elements seed mix', 'sunflower pumpkin flax']::TEXT[], 
  ARRAY['true elements', 'seeds', 'roasted', 'mix', 'sunflower', 'pumpkin', 'flax']::TEXT[], 
  'snack-street', 
  'health-snack-packaged', 
  'snack'::public.item_type_enum, 
  'raw'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  30,
  648, 27.7, 45.1, 56.4, 9.8,
  16, NULL, NULL, 4.5, 60,
  '{"vegan","veg","keto","jain"}'::public.diet_type_enum[], 
  ARRAY['high-fat', 'high-protein', 'keto-friendly']::TEXT[], 
  '{"navratri"}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  true, true, true, false, false, false,
  20, 
  NULL, 
  0, 
  'FSSAI-label'::public.source_enum, 
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

  -- Servings for snack-trueelements-seedsmix-roasted
  DELETE FROM public.food_servings WHERE food_id = 'snack-trueelements-seedsmix-roasted';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('snack-trueelements-seedsmix-roasted', 'tbsp-1', '1 Tbsp (15g)', 15);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('snack-trueelements-seedsmix-roasted', 'handful', 'Small Handful (30g)', 30);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('snack-trueelements-seedsmix-roasted', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'snack-farmley-seeds-pumpkin-roasted', 
  'Farmley Roasted Pumpkin Seeds', 
  'रोस्टेड कद्दू के बीज', 
  ARRAY['roasted pumpkin seeds farmley']::TEXT[], 
  ARRAY['farmley', 'pumpkin seeds', 'roasted', 'kaddu beej']::TEXT[], 
  'snack-street', 
  'health-snack-packaged', 
  'snack'::public.item_type_enum, 
  'raw'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  30,
  569, 30.8, 11.5, 44.4, 6.4,
  305, NULL, NULL, 8.8, 45,
  '{"vegan","veg","keto","jain"}'::public.diet_type_enum[], 
  ARRAY['high-protein', 'high-fat', 'keto-friendly']::TEXT[], 
  '{"navratri"}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  true, true, true, false, false, false,
  15, 
  NULL, 
  0, 
  'FSSAI-label'::public.source_enum, 
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

  -- Servings for snack-farmley-seeds-pumpkin-roasted
  DELETE FROM public.food_servings WHERE food_id = 'snack-farmley-seeds-pumpkin-roasted';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('snack-farmley-seeds-pumpkin-roasted', 'tbsp-1', '1 Tbsp (15g)', 15);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('snack-farmley-seeds-pumpkin-roasted', 'handful', 'Small Handful (30g)', 30);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('snack-farmley-seeds-pumpkin-roasted', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'snack-happilo-trailmix-seeds-berries', 
  'Happilo Premium Trail Mix (Seeds & Berries)', 
  'हैप्पीलो प्रीमियम ट्रेल मिक्स', 
  ARRAY['happilo trail mix']::TEXT[], 
  ARRAY['happilo', 'trail mix', 'seeds', 'berries', 'premium']::TEXT[], 
  'snack-street', 
  'health-snack-packaged', 
  'snack'::public.item_type_enum, 
  'raw'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  30,
  480, 14, 42, 30, 8,
  15, NULL, NULL, 3, 50,
  '{"vegan","veg","jain"}'::public.diet_type_enum[], 
  ARRAY['nutrient-dense', 'snack']::TEXT[], 
  '{"navratri"}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  true, true, true, false, false, false,
  40, 
  NULL, 
  0, 
  'curated-estimate'::public.source_enum, 
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

  -- Servings for snack-happilo-trailmix-seeds-berries
  DELETE FROM public.food_servings WHERE food_id = 'snack-happilo-trailmix-seeds-berries';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('snack-happilo-trailmix-seeds-berries', 'handful', 'Small Handful (30g)', 30);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('snack-happilo-trailmix-seeds-berries', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'snack-yogabar-trailmix-fruits-nuts', 
  'Yogabar Trail Mix (Fruits & Nuts)', 
  'योगा बार ट्रेल मिक्स', 
  ARRAY['yogabar trail mix']::TEXT[], 
  ARRAY['yogabar', 'trail mix', 'fruits', 'nuts']::TEXT[], 
  'snack-street', 
  'health-snack-packaged', 
  'snack'::public.item_type_enum, 
  'raw'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  30,
  450, 12, 50, 25, 7,
  50, NULL, NULL, 2.5, 40,
  '{"vegan","veg","jain"}'::public.diet_type_enum[], 
  ARRAY['sweet-snack', 'nutrient-dense']::TEXT[], 
  '{"navratri"}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  true, true, true, false, false, false,
  45, 
  NULL, 
  0, 
  'curated-estimate'::public.source_enum, 
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

  -- Servings for snack-yogabar-trailmix-fruits-nuts
  DELETE FROM public.food_servings WHERE food_id = 'snack-yogabar-trailmix-fruits-nuts';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('snack-yogabar-trailmix-fruits-nuts', 'handful', 'Small Handful (30g)', 30);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('snack-yogabar-trailmix-fruits-nuts', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'snack-opensecret-cookie-choco-almond', 
  'Open Secret Nutty Cookies (Choco Almond)', 
  'ओपन सीक्रेट चोको बादाम कुकीज़', 
  ARRAY['open secret cookies']::TEXT[], 
  ARRAY['open secret', 'cookie', 'choco almond', 'nutty', 'un-junked']::TEXT[], 
  'snack-street', 
  'health-snack-packaged', 
  'snack'::public.item_type_enum, 
  'raw'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  25,
  417, 10.5, 42, 23, 4,
  110, NULL, NULL, 2, 50,
  '{"veg"}'::public.diet_type_enum[], 
  ARRAY['sweet-snack', 'high-sugar']::TEXT[], 
  '{}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  true, false, false, false, false, false,
  55, 
  NULL, 
  0, 
  'FSSAI-label'::public.source_enum, 
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

  -- Servings for snack-opensecret-cookie-choco-almond
  DELETE FROM public.food_servings WHERE food_id = 'snack-opensecret-cookie-choco-almond';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('snack-opensecret-cookie-choco-almond', 'cookie-1', '1 Cookie (25g)', 25);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('snack-opensecret-cookie-choco-almond', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'snack-muscleblaze-protein-makhana-peri-peri', 
  'MuscleBlaze Protein Makhana (Peri Peri)', 
  'मसलब्लेज़ प्रोटीन मखाना पेरी पेरी', 
  ARRAY['mb makhana']::TEXT[], 
  ARRAY['muscleblaze', 'mb', 'protein', 'makhana', 'fox nuts', 'peri peri']::TEXT[], 
  'snack-street', 
  'health-snack-packaged', 
  'snack'::public.item_type_enum, 
  'raw'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  40,
  390, 20, 60, 10, 5,
  650, NULL, NULL, 1.5, 250,
  '{"veg"}'::public.diet_type_enum[], 
  ARRAY['high-protein', 'savoury', 'high-sodium']::TEXT[], 
  '{}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  true, false, true, false, false, false,
  45, 
  NULL, 
  0, 
  'curated-estimate'::public.source_enum, 
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

  -- Servings for snack-muscleblaze-protein-makhana-peri-peri
  DELETE FROM public.food_servings WHERE food_id = 'snack-muscleblaze-protein-makhana-peri-peri';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('snack-muscleblaze-protein-makhana-peri-peri', 'pack-1', '1 Pack (40g)', 40);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('snack-muscleblaze-protein-makhana-peri-peri', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'snack-twt-minibar-cocoa-almond', 
  'The Whole Truth Mini Bar (Cocoa Almond)', 
  'द होल ट्रुथ मिनी बार', 
  ARRAY['twt mini bar']::TEXT[], 
  ARRAY['twt', 'the whole truth', 'mini bar', 'cocoa almond', 'bite sized']::TEXT[], 
  'snack-street', 
  'health-snack-packaged', 
  'snack'::public.item_type_enum, 
  'raw'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  27,
  481, 22, 44, 25, 8,
  150, NULL, NULL, 1.5, 60,
  '{"veg"}'::public.diet_type_enum[], 
  ARRAY['clean-label', 'snack']::TEXT[], 
  '{}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  true, false, true, false, false, false,
  40, 
  NULL, 
  0, 
  'curated-estimate'::public.source_enum, 
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

  -- Servings for snack-twt-minibar-cocoa-almond
  DELETE FROM public.food_servings WHERE food_id = 'snack-twt-minibar-cocoa-almond';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('snack-twt-minibar-cocoa-almond', 'bar-mini', '1 Mini Bar (27g)', 27);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('snack-twt-minibar-cocoa-almond', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'dairy-epigamia-greek-plain-90g', 
  'Epigamia Greek Yogurt (Plain)', 
  'एपिगेमिया ग्रीक दही (प्लेन)', 
  ARRAY['epigamia natural', 'epigamia plain greek']::TEXT[], 
  ARRAY['epigamia', 'greek yogurt', 'plain', 'natural', 'dahi']::TEXT[], 
  'dairy', 
  'greek-yogurt', 
  'snack'::public.item_type_enum, 
  'raw'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  90,
  76.6, 8, 6.2, 2.2, 0,
  55, 0.5, NULL, 0.1, 175.5,
  '{"veg","keto","jain"}'::public.diet_type_enum[], 
  ARRAY['high-protein', 'low-sugar']::TEXT[], 
  '{"navratri"}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  true, true, true, false, false, false,
  15, 
  NULL, 
  0, 
  'FSSAI-label'::public.source_enum, 
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

  -- Servings for dairy-epigamia-greek-plain-90g
  DELETE FROM public.food_servings WHERE food_id = 'dairy-epigamia-greek-plain-90g';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('dairy-epigamia-greek-plain-90g', 'cup-90', '1 Cup (90g)', 90);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('dairy-epigamia-greek-plain-90g', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'dairy-epigamia-greek-strawberry-85g', 
  'Epigamia Greek Yogurt (Strawberry)', 
  'एपिगेमिया ग्रीक दही (स्ट्रॉबेरी)', 
  ARRAY['epigamia strawberry']::TEXT[], 
  ARRAY['epigamia', 'greek yogurt', 'strawberry', 'flavoured']::TEXT[], 
  'dairy', 
  'greek-yogurt', 
  'snack'::public.item_type_enum, 
  'raw'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  85,
  98, 6.6, 13.7, 1.8, 0.5,
  45, 0.2, NULL, 0.1, 145.7,
  '{"veg"}'::public.diet_type_enum[], 
  ARRAY['sweet-snack', 'moderate-protein']::TEXT[], 
  '{}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  true, false, true, false, false, false,
  40, 
  NULL, 
  0, 
  'FSSAI-label'::public.source_enum, 
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

  -- Servings for dairy-epigamia-greek-strawberry-85g
  DELETE FROM public.food_servings WHERE food_id = 'dairy-epigamia-greek-strawberry-85g';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('dairy-epigamia-greek-strawberry-85g', 'cup-85', '1 Cup (85g)', 85);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('dairy-epigamia-greek-strawberry-85g', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'dairy-epigamia-turbo-coffee-200ml', 
  'Epigamia Turbo Yogurt Drink (Coffee)', 
  'एपिगेमिया टर्बो कॉफी', 
  ARRAY['epigamia turbo coffee']::TEXT[], 
  ARRAY['epigamia', 'turbo', 'coffee', 'yogurt drink', 'high protein']::TEXT[], 
  'dairy', 
  'greek-yogurt', 
  'drink'::public.item_type_enum, 
  'ready-to-drink'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  200,
  60, 8.5, 5, 1.5, 0,
  40, 0.3, NULL, 0.1, 130,
  '{"veg"}'::public.diet_type_enum[], 
  ARRAY['very-high-protein', 'post-workout']::TEXT[], 
  '{}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  true, false, true, false, false, false,
  25, 
  NULL, 
  0, 
  'curated-estimate'::public.source_enum, 
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

  -- Servings for dairy-epigamia-turbo-coffee-200ml
  DELETE FROM public.food_servings WHERE food_id = 'dairy-epigamia-turbo-coffee-200ml';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('dairy-epigamia-turbo-coffee-200ml', 'bottle', '1 Bottle (200ml)', 200);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'dairy-milkymist-skyr-plain-150g', 
  'Milky Mist Skyr (Plain)', 
  'मिल्की मिस्ट स्काईर (प्लेन)', 
  ARRAY['milky mist skyr plain', 'icelandic yogurt']::TEXT[], 
  ARRAY['milky mist', 'skyr', 'plain', 'icelandic', 'thick yogurt']::TEXT[], 
  'dairy', 
  'greek-yogurt', 
  'snack'::public.item_type_enum, 
  'raw'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  150,
  70, 12, 10, 1.5, 0,
  60, 0.4, NULL, 0.1, 200,
  '{"veg","jain"}'::public.diet_type_enum[], 
  ARRAY['very-high-protein', 'low-fat']::TEXT[], 
  '{"navratri"}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  true, true, true, false, false, false,
  15, 
  NULL, 
  0, 
  'FSSAI-label'::public.source_enum, 
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

  -- Servings for dairy-milkymist-skyr-plain-150g
  DELETE FROM public.food_servings WHERE food_id = 'dairy-milkymist-skyr-plain-150g';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('dairy-milkymist-skyr-plain-150g', 'cup-150', '1 Cup (150g)', 150);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('dairy-milkymist-skyr-plain-150g', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'dairy-milkymist-greek-plain-100g', 
  'Milky Mist Greek Yogurt (Plain)', 
  'मिल्की मिस्ट ग्रीक दही', 
  ARRAY['milky mist greek']::TEXT[], 
  ARRAY['milky mist', 'greek yogurt', 'plain']::TEXT[], 
  'dairy', 
  'greek-yogurt', 
  'snack'::public.item_type_enum, 
  'raw'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  100,
  85, 8, 6.5, 3, 0,
  50, 0.3, NULL, 0.1, 150,
  '{"veg","jain"}'::public.diet_type_enum[], 
  ARRAY['high-protein']::TEXT[], 
  '{"navratri"}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  true, true, true, false, false, false,
  15, 
  NULL, 
  0, 
  'curated-estimate'::public.source_enum, 
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

  -- Servings for dairy-milkymist-greek-plain-100g
  DELETE FROM public.food_servings WHERE food_id = 'dairy-milkymist-greek-plain-100g';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('dairy-milkymist-greek-plain-100g', 'cup-100', '1 Cup (100g)', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'dairy-amul-highprotein-curd-400g', 
  'Amul High Protein Dahi', 
  'अमूल हाई प्रोटीन दही', 
  ARRAY['amul protein curd']::TEXT[], 
  ARRAY['amul', 'high protein dahi', 'curd', 'protein curd', '25g']::TEXT[], 
  'dairy', 
  'high-protein-curd', 
  'base-food'::public.item_type_enum, 
  'raw'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  100,
  68, 6.3, 10, 0.1, 0,
  60, 0.3, NULL, 0.1, 140,
  '{"veg","jain"}'::public.diet_type_enum[], 
  ARRAY['high-protein', 'fat-free']::TEXT[], 
  '{"navratri"}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  true, true, true, false, false, false,
  20, 
  NULL, 
  0, 
  'FSSAI-label'::public.source_enum, 
  'high'::public.confidence_enum, 
  '25g protein per 400g pack.'
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

  -- Servings for dairy-amul-highprotein-curd-400g
  DELETE FROM public.food_servings WHERE food_id = 'dairy-amul-highprotein-curd-400g';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('dairy-amul-highprotein-curd-400g', 'cup-100', 'Small Bowl (100g)', 100);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('dairy-amul-highprotein-curd-400g', 'pack-400', 'Full Pack (400g)', 400);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'dairy-motherdairy-protein-curd-400g', 
  'Mother Dairy High Protein Curd', 
  'मदर डेयरी हाई प्रोटीन दही', 
  ARRAY['mother dairy protein curd', 'protein dahi']::TEXT[], 
  ARRAY['mother dairy', 'high protein curd', 'dahi']::TEXT[], 
  'dairy', 
  'high-protein-curd', 
  'base-food'::public.item_type_enum, 
  'raw'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  100,
  65, 8, 5, 1, 0,
  55, 0.3, NULL, 0.1, 150,
  '{"veg","jain"}'::public.diet_type_enum[], 
  ARRAY['high-protein', 'low-fat']::TEXT[], 
  '{"navratri"}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  true, true, true, false, false, false,
  20, 
  NULL, 
  0, 
  'curated-estimate'::public.source_enum, 
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

  -- Servings for dairy-motherdairy-protein-curd-400g
  DELETE FROM public.food_servings WHERE food_id = 'dairy-motherdairy-protein-curd-400g';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('dairy-motherdairy-protein-curd-400g', 'cup-100', 'Small Bowl (100g)', 100);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('dairy-motherdairy-protein-curd-400g', 'pack-400', 'Full Tub (400g)', 400);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'cookie-muscleblaze-protein-20g-doublechoco', 
  'MuscleBlaze Protein Cookie (Double Choco)', 
  'मसलब्लेज़ प्रोटीन कुकी', 
  ARRAY['mb protein cookie 20g']::TEXT[], 
  ARRAY['muscleblaze', 'mb', 'protein cookie', 'double choco', '20g']::TEXT[], 
  'supplement', 
  'protein-cookie', 
  'snack'::public.item_type_enum, 
  'raw'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  60,
  400, 33.3, 40, 15, 5,
  150, NULL, NULL, 2, 100,
  '{"veg"}'::public.diet_type_enum[], 
  ARRAY['high-protein']::TEXT[], 
  '{}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  true, false, false, false, false, false,
  45, 
  NULL, 
  0, 
  'curated-estimate'::public.source_enum, 
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

  -- Servings for cookie-muscleblaze-protein-20g-doublechoco
  DELETE FROM public.food_servings WHERE food_id = 'cookie-muscleblaze-protein-20g-doublechoco';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('cookie-muscleblaze-protein-20g-doublechoco', 'cookie-1', '1 Cookie (60g)', 60);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'cookie-twt-protein-15g-choco-chip', 
  'The Whole Truth Protein Cookie (Choco Chip)', 
  'द होल ट्रुथ प्रोटीन कुकी', 
  ARRAY['twt protein cookie']::TEXT[], 
  ARRAY['the whole truth', 'twt', 'protein cookie', '15g', 'choco chip']::TEXT[], 
  'supplement', 
  'protein-cookie', 
  'snack'::public.item_type_enum, 
  'raw'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  50,
  420, 30, 35, 20, 8,
  80, NULL, NULL, 1.5, 80,
  '{"veg"}'::public.diet_type_enum[], 
  ARRAY['high-protein', 'clean-label', 'no-added-sugar']::TEXT[], 
  '{}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  true, false, true, false, false, false,
  35, 
  NULL, 
  0, 
  'curated-estimate'::public.source_enum, 
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

  -- Servings for cookie-twt-protein-15g-choco-chip
  DELETE FROM public.food_servings WHERE food_id = 'cookie-twt-protein-15g-choco-chip';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('cookie-twt-protein-15g-choco-chip', 'cookie-1', '1 Cookie (50g)', 50);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'chip-ritebite-protein-chips-cheese-jalapeno', 
  'RiteBite Max Protein Chips (Cheese Jalapeno)', 
  'रइटबाइट मैक्स प्रोटीन चिप्स', 
  ARRAY['max protein chips']::TEXT[], 
  ARRAY['ritebite', 'max protein', 'chips', 'cheese jalapeno', 'baked']::TEXT[], 
  'snack-street', 
  'protein-chip', 
  'snack'::public.item_type_enum, 
  'raw'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  60,
  420, 20, 60, 11, 10,
  650, NULL, NULL, 2, 50,
  '{"veg"}'::public.diet_type_enum[], 
  ARRAY['high-sodium', 'high-protein', 'baked']::TEXT[], 
  '{}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  true, false, false, false, false, false,
  40, 
  NULL, 
  0, 
  'FSSAI-label'::public.source_enum, 
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

  -- Servings for chip-ritebite-protein-chips-cheese-jalapeno
  DELETE FROM public.food_servings WHERE food_id = 'chip-ritebite-protein-chips-cheese-jalapeno';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('chip-ritebite-protein-chips-cheese-jalapeno', 'pack-1', '1 Pack (60g)', 60);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('chip-ritebite-protein-chips-cheese-jalapeno', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'chip-tooyumm-protein-puff-herbs-cheese', 
  'Too Yumm! Protein Puffs (Herbs & Cheese)', 
  'टू यम प्रोटीन पफ्स', 
  ARRAY['too yumm protein puffs']::TEXT[], 
  ARRAY['too yumm', 'protein puffs', 'herbs cheese', 'baked']::TEXT[], 
  'snack-street', 
  'protein-chip', 
  'snack'::public.item_type_enum, 
  'raw'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  28,
  469, 10, 68, 17.7, 4,
  760, NULL, NULL, 1.5, 60,
  '{"veg"}'::public.diet_type_enum[], 
  ARRAY['baked', 'high-sodium']::TEXT[], 
  '{}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  true, false, false, false, false, false,
  50, 
  NULL, 
  0, 
  'FSSAI-label'::public.source_enum, 
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

  -- Servings for chip-tooyumm-protein-puff-herbs-cheese
  DELETE FROM public.food_servings WHERE food_id = 'chip-tooyumm-protein-puff-herbs-cheese';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('chip-tooyumm-protein-puff-herbs-cheese', 'pack-1', '1 Pack (28g)', 28);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('chip-tooyumm-protein-puff-herbs-cheese', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'biscuit-parle-g-original', 
  'Parle-G Glucose Biscuit', 
  'पारले-जी बिस्कुट', 
  ARRAY['parle g']::TEXT[], 
  ARRAY['parle', 'parle-g', 'glucose', 'biscuit', 'chai']::TEXT[], 
  'snack-street', 
  'packaged-biscuit', 
  'snack'::public.item_type_enum, 
  'raw'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  15,
  450, 7, 77, 13, 1.5,
  280, NULL, NULL, 1, 30,
  '{"veg"}'::public.diet_type_enum[], 
  ARRAY['high-carb', 'high-sugar', 'calorie-dense']::TEXT[], 
  '{}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  true, false, false, false, false, false,
  70, 
  NULL, 
  0, 
  'FSSAI-label'::public.source_enum, 
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

  -- Servings for biscuit-parle-g-original
  DELETE FROM public.food_servings WHERE food_id = 'biscuit-parle-g-original';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('biscuit-parle-g-original', 'biscuit-3', '3 Biscuits (~15g)', 15);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('biscuit-parle-g-original', 'pack-small', '1 Small Pack (75g)', 75);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('biscuit-parle-g-original', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'biscuit-britannia-nutrichoice-digestive', 
  'Britannia NutriChoice High Fibre Digestive', 
  'ब्रिटानिया न्यूट्रीचॉइस', 
  ARRAY['nutrichoice digestive']::TEXT[], 
  ARRAY['britannia', 'nutrichoice', 'digestive', 'high fibre', 'biscuit']::TEXT[], 
  'snack-street', 
  'packaged-biscuit', 
  'snack'::public.item_type_enum, 
  'raw'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  20,
  493, 8, 68, 21, 6,
  400, NULL, NULL, 2, 45,
  '{"veg"}'::public.diet_type_enum[], 
  ARRAY['high-fat', 'moderate-fiber', 'calorie-dense']::TEXT[], 
  '{}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  true, false, false, false, false, false,
  55, 
  NULL, 
  0, 
  'FSSAI-label'::public.source_enum, 
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

  -- Servings for biscuit-britannia-nutrichoice-digestive
  DELETE FROM public.food_servings WHERE food_id = 'biscuit-britannia-nutrichoice-digestive';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('biscuit-britannia-nutrichoice-digestive', 'biscuit-2', '2 Biscuits (~20g)', 20);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('biscuit-britannia-nutrichoice-digestive', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'biscuit-britannia-marie-gold', 
  'Britannia Marie Gold Biscuit', 
  'मरी गोल्ड बिस्कुट', 
  ARRAY['marie gold']::TEXT[], 
  ARRAY['britannia', 'marie', 'gold', 'biscuit', 'tea time']::TEXT[], 
  'snack-street', 
  'packaged-biscuit', 
  'snack'::public.item_type_enum, 
  'raw'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  20,
  440, 8, 76, 11.5, 2,
  350, NULL, NULL, 1.5, 40,
  '{"veg"}'::public.diet_type_enum[], 
  ARRAY['high-carb', 'calorie-dense']::TEXT[], 
  '{}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  true, false, false, false, false, false,
  65, 
  NULL, 
  0, 
  'curated-estimate'::public.source_enum, 
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

  -- Servings for biscuit-britannia-marie-gold
  DELETE FROM public.food_servings WHERE food_id = 'biscuit-britannia-marie-gold';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('biscuit-britannia-marie-gold', 'biscuit-4', '4 Biscuits (~20g)', 20);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('biscuit-britannia-marie-gold', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'biscuit-sunfeast-darkfantasy-choco-fills', 
  'Sunfeast Dark Fantasy (Choco Fills)', 
  'डार्क फैंटेसी चोको फिल्स', 
  ARRAY['dark fantasy biscuit']::TEXT[], 
  ARRAY['sunfeast', 'dark fantasy', 'choco fills', 'chocolate biscuit']::TEXT[], 
  'snack-street', 
  'packaged-biscuit', 
  'snack'::public.item_type_enum, 
  'raw'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  25,
  530, 5, 65, 28, 2,
  180, NULL, NULL, 1.5, 50,
  '{"veg"}'::public.diet_type_enum[], 
  ARRAY['very-high-fat', 'high-sugar', 'calorie-dense', 'sweet-snack']::TEXT[], 
  '{}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  true, false, false, false, false, false,
  65, 
  NULL, 
  0, 
  'curated-estimate'::public.source_enum, 
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

  -- Servings for biscuit-sunfeast-darkfantasy-choco-fills
  DELETE FROM public.food_servings WHERE food_id = 'biscuit-sunfeast-darkfantasy-choco-fills';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('biscuit-sunfeast-darkfantasy-choco-fills', 'biscuit-2', '2 Biscuits (~25g)', 25);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('biscuit-sunfeast-darkfantasy-choco-fills', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'noodle-maggi-2min-masala-70g', 
  'Maggi 2-Minute Noodles (Masala)', 
  'मैगी 2-मिनट नूडल्स (मसाला)', 
  ARRAY['maggi masala', 'maggi noodles']::TEXT[], 
  ARRAY['maggi', '2 minute', 'masala noodles', 'nestle']::TEXT[], 
  'packaged-food', 
  'instant-noodle', 
  'base-food'::public.item_type_enum, 
  'raw'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  70,
  442, 10, 60, 18, 2,
  1200, NULL, NULL, 2.5, 50,
  '{"veg"}'::public.diet_type_enum[], 
  ARRAY['high-carb', 'high-sodium', 'calorie-dense']::TEXT[], 
  '{}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  true, false, false, false, true, false,
  65, 
  NULL, 
  0, 
  'FSSAI-label'::public.source_enum, 
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

  -- Servings for noodle-maggi-2min-masala-70g
  DELETE FROM public.food_servings WHERE food_id = 'noodle-maggi-2min-masala-70g';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('noodle-maggi-2min-masala-70g', 'pack-70', '1 Single Pack (70g)', 70);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('noodle-maggi-2min-masala-70g', 'pack-140', '1 Double Pack (140g)', 140);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('noodle-maggi-2min-masala-70g', 'g100', '100g (Dry weight)', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'noodle-maggi-atta-masala-70g', 
  'Maggi Atta Noodles (Masala)', 
  'मैगी आटा नूडल्स', 
  ARRAY['maggi atta', 'whole wheat maggi']::TEXT[], 
  ARRAY['maggi', 'atta', 'whole wheat', 'masala noodles']::TEXT[], 
  'packaged-food', 
  'instant-noodle', 
  'base-food'::public.item_type_enum, 
  'raw'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  70,
  440, 10.5, 58, 17, 5,
  1150, NULL, NULL, 3, 55,
  '{"veg"}'::public.diet_type_enum[], 
  ARRAY['high-carb', 'high-sodium', 'moderate-fiber']::TEXT[], 
  '{}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  true, false, false, false, true, false,
  55, 
  NULL, 
  0, 
  'FSSAI-label'::public.source_enum, 
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

  -- Servings for noodle-maggi-atta-masala-70g
  DELETE FROM public.food_servings WHERE food_id = 'noodle-maggi-atta-masala-70g';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('noodle-maggi-atta-masala-70g', 'pack-70', '1 Pack (70g)', 70);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('noodle-maggi-atta-masala-70g', 'g100', '100g (Dry weight)', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'noodle-maggi-no-onion-garlic-70g', 
  'Maggi 2-Minute Noodles (No Onion No Garlic)', 
  'मैगी नो अनियन नो गार्लिक', 
  ARRAY['maggi jain', 'maggi nong']::TEXT[], 
  ARRAY['maggi', 'jain maggi', 'nong', 'no onion garlic']::TEXT[], 
  'packaged-food', 
  'instant-noodle', 
  'base-food'::public.item_type_enum, 
  'raw'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  70,
  442, 10, 60, 18, 2,
  1100, NULL, NULL, 2.5, 50,
  '{"veg","jain"}'::public.diet_type_enum[], 
  ARRAY['high-carb', 'high-sodium', 'jain-friendly']::TEXT[], 
  '{}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  true, false, false, false, false, false,
  65, 
  NULL, 
  0, 
  'curated-estimate'::public.source_enum, 
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

  -- Servings for noodle-maggi-no-onion-garlic-70g
  DELETE FROM public.food_servings WHERE food_id = 'noodle-maggi-no-onion-garlic-70g';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('noodle-maggi-no-onion-garlic-70g', 'pack-70', '1 Pack (70g)', 70);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('noodle-maggi-no-onion-garlic-70g', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'noodle-yippee-magic-masala-70g', 
  'YiPPee! Magic Masala Noodles', 
  'यीप्पी मैजिक मसाला नूडल्स', 
  ARRAY['yippee noodles']::TEXT[], 
  ARRAY['yippee', 'magic masala', 'itc noodles', 'round block']::TEXT[], 
  'packaged-food', 
  'instant-noodle', 
  'base-food'::public.item_type_enum, 
  'raw'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  70,
  428, 9.5, 62, 16.5, 2.5,
  1150, NULL, NULL, 2, 40,
  '{"veg"}'::public.diet_type_enum[], 
  ARRAY['high-carb', 'high-sodium']::TEXT[], 
  '{}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  true, false, false, false, true, false,
  65, 
  NULL, 
  0, 
  'curated-estimate'::public.source_enum, 
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

  -- Servings for noodle-yippee-magic-masala-70g
  DELETE FROM public.food_servings WHERE food_id = 'noodle-yippee-magic-masala-70g';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('noodle-yippee-magic-masala-70g', 'pack-70', '1 Single Pack (70g)', 70);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('noodle-yippee-magic-masala-70g', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'noodle-waiwai-chicken-75g', 
  'Wai Wai Chicken Noodles', 
  'वाई वाई चिकन नूडल्स', 
  ARRAY['wai wai brown']::TEXT[], 
  ARRAY['wai wai', 'chicken noodles', 'nepali noodles', 'instant chicken']::TEXT[], 
  'packaged-food', 
  'instant-noodle', 
  'snack'::public.item_type_enum, 
  'raw'::public.food_state_enum, 
  'pan-indian'::public.region_enum, 
  75,
  471, 10, 61, 21, 2,
  1300, 0.5, NULL, 2, 30,
  '{"non-veg"}'::public.diet_type_enum[], 
  ARRAY['high-sodium', 'high-fat', 'calorie-dense']::TEXT[], 
  '{}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  true, false, false, false, true, false,
  65, 
  NULL, 
  0, 
  'FSSAI-label'::public.source_enum, 
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

  -- Servings for noodle-waiwai-chicken-75g
  DELETE FROM public.food_servings WHERE food_id = 'noodle-waiwai-chicken-75g';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('noodle-waiwai-chicken-75g', 'pack-75', '1 Pack (75g)', 75);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('noodle-waiwai-chicken-75g', 'g100', '100g', 100);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'rte-mtr-dal-makhani-300g', 
  'MTR Ready-To-Eat Dal Makhani', 
  'एमटीआर दाल मखनी (RTE)', 
  ARRAY['mtr dal makhni rte']::TEXT[], 
  ARRAY['mtr', 'dal makhani', 'rte', 'ready to eat', 'pouch dal']::TEXT[], 
  'curry', 
  'dal-lentils', 
  'base-food'::public.item_type_enum, 
  'cooked'::public.food_state_enum, 
  'north-indian'::public.region_enum, 
  150,
  86, 3.3, 6.6, 5.3, 3.3,
  233, 0.2, NULL, 1.5, 40,
  '{"veg"}'::public.diet_type_enum[], 
  ARRAY['convenience', 'moderate-fat']::TEXT[], 
  '{}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  true, false, true, false, true, false,
  35, 
  'Includes butter/cream in product matrix', 
  4, 
  'FSSAI-label'::public.source_enum, 
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

  -- Servings for rte-mtr-dal-makhani-300g
  DELETE FROM public.food_servings WHERE food_id = 'rte-mtr-dal-makhani-300g';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('rte-mtr-dal-makhani-300g', 'half-pack', 'Half Pouch (150g)', 150);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('rte-mtr-dal-makhani-300g', 'pack-300', 'Full Pouch (300g)', 300);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('rte-mtr-dal-makhani-300g', 'bowl', '1 Bowl (200g)', 200);


INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  'rte-itc-koi-dal-bukhara-285g', 
  'Kitchens of India Dal Bukhara (RTE)', 
  'किचन्स ऑफ इंडिया दाल बुखारा', 
  ARRAY['itc dal bukhara']::TEXT[], 
  ARRAY['itc', 'kitchens of india', 'dal bukhara', 'rte', 'premium dal']::TEXT[], 
  'curry', 
  'dal-lentils', 
  'base-food'::public.item_type_enum, 
  'cooked'::public.food_state_enum, 
  'north-indian'::public.region_enum, 
  142,
  115, 4, 12, 5.5, 3,
  480, 0.3, NULL, 1.2, 30,
  '{"veg"}'::public.diet_type_enum[], 
  ARRAY['restaurant-style', 'high-sodium', 'convenience']::TEXT[], 
  '{}'::public.fasting_type_enum[], 
  '{}', 
  '{}'::jsonb,
  true, false, true, false, true, false,
  40, 
  'Includes butter/cream', 
  5, 
  'FSSAI-label'::public.source_enum, 
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

  -- Servings for rte-itc-koi-dal-bukhara-285g
  DELETE FROM public.food_servings WHERE food_id = 'rte-itc-koi-dal-bukhara-285g';
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('rte-itc-koi-dal-bukhara-285g', 'half-pack', 'Half Pouch (~142g)', 142);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('rte-itc-koi-dal-bukhara-285g', 'pack-285', 'Full Pouch (285g)', 285);
  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES ('rte-itc-koi-dal-bukhara-285g', 'g100', '100g', 100);

