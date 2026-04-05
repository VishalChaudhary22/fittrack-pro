import { useState, useMemo, useRef, useEffect, useContext } from "react";
import { AppContext } from "../../context/AppContext";

/* ─────────────────────────────────────────────
   MOCK INDIAN FOOD DATABASE  (Phase 1 sample)
   Replace with Supabase fetch when Phase 1 DB is live
───────────────────────────────────────────── */
const INDIAN_FOODS = [
    // GRAINS & CEREALS
    { id: "white-rice-cooked", name: "White Rice (cooked)", nameAlt: ["chawal", "bhaat"], searchTerms: ["chawal", "bhaat", "rice"], category: "grain-cereal", itemType: "base-food", per100g: { calories: 130, protein: 2.7, carbs: 28, fat: 0.3, fiber: 0.4 }, servings: [{ id: "bowl", label: "1 bowl", grams: 200 }, { id: "g100", label: "100g", grams: 100 }, { id: "plate", label: "1 plate", grams: 300 }], dietTypes: ["vegan", "veg", "jain", "egg", "nonveg"], containsRootVeg: false, isFastingFood: false, tags: ["lunch", "dinner"], confidence: "high", source: "IFCT-2017" },
    { id: "chapati", name: "Chapati / Roti", nameAlt: ["roti", "phulka"], searchTerms: ["roti", "chapati", "phulka"], category: "roti-bread", itemType: "base-food", per100g: { calories: 297, protein: 9.5, carbs: 53, fat: 4, fiber: 3 }, servings: [{ id: "roti", label: "1 roti", grams: 35 }, { id: "g100", label: "100g", grams: 100 }], dietTypes: ["vegan", "veg", "jain", "egg", "nonveg"], containsRootVeg: false, isFastingFood: false, tags: ["breakfast", "lunch", "dinner"], confidence: "high", source: "IFCT-2017" },
    { id: "aloo-paratha", name: "Aloo Paratha", nameAlt: ["potato paratha", "stuffed paratha"], searchTerms: ["aloo", "paratha", "potato"], category: "roti-bread", itemType: "dish", per100g: { calories: 280, protein: 6, carbs: 42, fat: 10, fiber: 2 }, servings: [{ id: "paratha", label: "1 paratha", grams: 90 }, { id: "g100", label: "100g", grams: 100 }], dietTypes: ["veg", "egg", "nonveg"], containsRootVeg: true, isFastingFood: false, tags: ["breakfast"], confidence: "medium", source: "curated-estimate" },
    { id: "oats-plain", name: "Oats (plain, cooked)", nameAlt: ["masala oats", "oatmeal"], searchTerms: ["oats", "oatmeal", "daliya"], category: "grain-cereal", itemType: "base-food", per100g: { calories: 68, protein: 2.4, carbs: 12, fat: 1.4, fiber: 1.7 }, servings: [{ id: "bowl", label: "1 bowl", grams: 200 }, { id: "g100", label: "100g", grams: 100 }], dietTypes: ["vegan", "veg", "jain", "egg", "nonveg"], containsRootVeg: false, isFastingFood: false, tags: ["breakfast", "high-fiber"], confidence: "high", source: "USDA" },

    // DALS & LEGUMES
    { id: "dal-toor-cooked", name: "Toor Dal (cooked)", nameAlt: ["arhar dal", "toovar dal", "pigeon pea"], searchTerms: ["toovar", "tuvar", "arhar", "arher", "toor", "dal"], category: "dal-legume", itemType: "dish", per100g: { calories: 116, protein: 7, carbs: 20, fat: 0.4, fiber: 4 }, servings: [{ id: "katori", label: "1 katori", grams: 150 }, { id: "bowl", label: "1 bowl", grams: 200 }, { id: "g100", label: "100g", grams: 100 }], dietTypes: ["vegan", "veg", "jain", "egg", "nonveg"], containsRootVeg: false, cookingOilNote: "Includes ~1 tsp oil for tadka. Add separately for precision.", estimatedOilG: 5, isFastingFood: false, tags: ["lunch", "dinner", "high-fiber"], confidence: "high", source: "IFCT-2017" },
    { id: "dal-makhani", name: "Dal Makhani", nameAlt: ["makhani dal", "black dal"], searchTerms: ["dal makhani", "makhani", "black dal", "urad"], category: "dal-legume", itemType: "dish", supportedConsistencyTypes: ["thin", "thick"], consistencyMultipliers: { thin: 0.7, standard: 1.0, thick: 1.3 }, per100g: { calories: 120, protein: 5, carbs: 14, fat: 5, fiber: 3 }, servings: [{ id: "katori", label: "1 katori", grams: 150 }, { id: "takeaway-container", label: "1 takeaway container", grams: 480 }, { id: "g100", label: "100g", grams: 100 }], dietTypes: ["veg", "egg", "nonveg"], containsRootVeg: false, isFastingFood: false, tags: ["lunch", "dinner", "restaurant-common"], confidence: "medium", source: "healthifyme" },
    { id: "rajma", name: "Rajma Masala", nameAlt: ["kidney beans curry", "rajma chawal"], searchTerms: ["rajma", "kidney beans"], category: "dal-legume", itemType: "dish", per100g: { calories: 105, protein: 7, carbs: 17, fat: 2, fiber: 5 }, servings: [{ id: "katori", label: "1 katori", grams: 150 }, { id: "bowl", label: "1 bowl", grams: 200 }], dietTypes: ["vegan", "veg", "egg", "nonveg"], containsRootVeg: true, isFastingFood: false, tags: ["lunch", "dinner", "high-protein", "high-fiber"], confidence: "medium", source: "healthifyme" },
    { id: "moong-dal-chilla", name: "Moong Dal Chilla", nameAlt: ["moong chilla", "green moong pancake"], searchTerms: ["moong", "chilla", "besan chilla", "green gram pancake"], category: "breakfast", itemType: "dish", per100g: { calories: 135, protein: 9, carbs: 18, fat: 3, fiber: 2 }, servings: [{ id: "piece", label: "1 chilla", grams: 80 }, { id: "g100", label: "100g", grams: 100 }], dietTypes: ["vegan", "veg", "jain", "egg", "nonveg"], containsRootVeg: false, isFastingFood: false, tags: ["breakfast", "high-protein", "muscle-building"], confidence: "medium", source: "curated-estimate" },

    // EGGS & NON-VEG
    { id: "boiled-egg", name: "Boiled Egg", nameAlt: ["anda", "hard boiled egg", "egg"], searchTerms: ["anda", "egg", "boiled"], category: "egg", itemType: "base-food", per100g: { calories: 155, protein: 13, carbs: 1.1, fat: 11, fiber: 0 }, servings: [{ id: "egg", label: "1 egg", grams: 50 }, { id: "g100", label: "100g", grams: 100 }], dietTypes: ["egg", "nonveg"], containsRootVeg: false, isFastingFood: false, tags: ["breakfast", "post-workout", "high-protein"], confidence: "high", source: "USDA" },
    { id: "chicken-breast-grilled", name: "Chicken Breast (grilled)", nameAlt: ["grilled chicken", "boneless chicken"], searchTerms: ["chicken", "breast", "murgi", "poultry"], category: "non-veg", itemType: "base-food", per100g: { calories: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0 }, servings: [{ id: "g100", label: "100g", grams: 100 }, { id: "piece", label: "1 piece", grams: 150 }], dietTypes: ["nonveg"], containsRootVeg: false, isFastingFood: false, tags: ["post-workout", "high-protein", "very-high-protein", "muscle-building"], confidence: "high", source: "USDA" },
    { id: "egg-white", name: "Egg White", nameAlt: ["egg whites", "white of egg"], searchTerms: ["egg white", "anda white"], category: "egg", itemType: "base-food", per100g: { calories: 52, protein: 11, carbs: 0.7, fat: 0.2, fiber: 0 }, servings: [{ id: "egg", label: "1 egg white", grams: 33 }, { id: "g100", label: "100g", grams: 100 }], dietTypes: ["egg", "nonveg"], containsRootVeg: false, isFastingFood: false, tags: ["breakfast", "post-workout", "very-high-protein", "low-fat"], confidence: "high", source: "USDA" },

    // DAIRY
    { id: "paneer", name: "Paneer (full fat)", nameAlt: ["cottage cheese", "chenna"], searchTerms: ["paneer", "cottage cheese", "chenna"], category: "dairy", itemType: "base-food", per100g: { calories: 265, protein: 18, carbs: 3, fat: 20, fiber: 0 }, servings: [{ id: "g100", label: "100g", grams: 100 }, { id: "piece", label: "1 piece (cubed)", grams: 30 }], dietTypes: ["veg", "egg", "nonveg"], containsRootVeg: false, isFastingFood: false, tags: ["high-protein", "muscle-building", "before-bed"], confidence: "high", source: "IFCT-2017" },
    { id: "dahi", name: "Curd / Dahi", nameAlt: ["yogurt", "curd", "dahi"], searchTerms: ["dahi", "curd", "yogurt", "doi"], category: "dairy", itemType: "base-food", per100g: { calories: 61, protein: 3.1, carbs: 4.7, fat: 3.4, fiber: 0 }, servings: [{ id: "katori", label: "1 katori", grams: 150 }, { id: "bowl", label: "1 bowl", grams: 200 }], dietTypes: ["veg", "jain", "egg", "nonveg"], containsRootVeg: false, isFastingFood: false, tags: ["lunch", "dinner", "anytime"], confidence: "high", source: "IFCT-2017" },
    { id: "milk-toned", name: "Toned Milk", nameAlt: ["doodh", "milk", "cow milk"], searchTerms: ["milk", "doodh", "dudh"], category: "dairy", itemType: "drink", per100g: { calories: 58, protein: 3.2, carbs: 4.8, fat: 3, fiber: 0 }, servings: [{ id: "glass", label: "1 glass (250ml)", grams: 250 }, { id: "cup", label: "1 cup (150ml)", grams: 150 }], dietTypes: ["veg", "jain", "egg", "nonveg"], containsRootVeg: false, isFastingFood: false, tags: ["breakfast", "before-bed"], confidence: "high", source: "IFCT-2017" },
    { id: "greek-yogurt", name: "Greek Yogurt (plain)", nameAlt: ["epigamia", "thick yogurt"], searchTerms: ["greek yogurt", "yogurt", "epigamia", "thick curd"], category: "dairy", itemType: "base-food", per100g: { calories: 80, protein: 10, carbs: 4, fat: 3, fiber: 0 }, servings: [{ id: "katori", label: "1 katori (150g)", grams: 150 }, { id: "g100", label: "100g", grams: 100 }], dietTypes: ["veg", "egg", "nonveg"], containsRootVeg: false, isFastingFood: false, tags: ["post-workout", "high-protein", "low-calorie"], confidence: "high", source: "FSSAI-label" },

    // BREAKFAST
    { id: "idli", name: "Idli (steamed)", nameAlt: ["idly", "rice cake"], searchTerms: ["idli", "idly"], category: "breakfast", itemType: "dish", per100g: { calories: 58, protein: 2, carbs: 12, fat: 0.5, fiber: 0.4 }, servings: [{ id: "piece", label: "1 idli", grams: 40 }, { id: "g100", label: "100g", grams: 100 }], dietTypes: ["vegan", "veg", "jain", "egg", "nonveg"], containsRootVeg: false, isFastingFood: false, tags: ["breakfast", "low-fat"], confidence: "high", source: "IFCT-2017" },
    { id: "masala-dosa", name: "Masala Dosa", nameAlt: ["dosa", "dosai"], searchTerms: ["dosa", "dosai", "masala dosa"], category: "breakfast", itemType: "dish", per100g: { calories: 210, protein: 4.5, carbs: 35, fat: 6, fiber: 1.5 }, servings: [{ id: "piece", label: "1 dosa", grams: 120 }, { id: "g100", label: "100g", grams: 100 }], dietTypes: ["veg", "egg", "nonveg"], containsRootVeg: true, isFastingFood: false, tags: ["breakfast"], confidence: "medium", source: "curated-estimate" },
    { id: "poha", name: "Poha", nameAlt: ["beaten rice", "chivda"], searchTerms: ["poha", "beaten rice", "chivda", "atukulu"], category: "breakfast", itemType: "dish", per100g: { calories: 180, protein: 3, carbs: 38, fat: 2, fiber: 2 }, servings: [{ id: "bowl", label: "1 bowl", grams: 200 }, { id: "g100", label: "100g", grams: 100 }], dietTypes: ["vegan", "veg", "egg", "nonveg"], containsRootVeg: true, isFastingFood: false, tags: ["breakfast"], confidence: "medium", source: "healthifyme" },

    // SNACKS & STREET FOOD
    { id: "roasted-chana", name: "Roasted Chana", nameAlt: ["bhuna chana", "dalia", "roasted bengal gram"], searchTerms: ["chana", "bhuna chana", "roasted gram", "dalia"], category: "snack-street", itemType: "snack", per100g: { calories: 364, protein: 22, carbs: 50, fat: 5, fiber: 8 }, servings: [{ id: "handful", label: "1 handful (30g)", grams: 30 }, { id: "g100", label: "100g", grams: 100 }], dietTypes: ["vegan", "veg", "jain", "egg", "nonveg"], containsRootVeg: false, isFastingFood: false, tags: ["snack", "pre-workout", "high-protein", "budget-friendly"], confidence: "high", source: "IFCT-2017" },
    { id: "makhana", name: "Makhana (roasted fox nuts)", nameAlt: ["lotus seeds", "phool makhana"], searchTerms: ["makhana", "fox nuts", "lotus seeds", "phool makhana"], category: "snack-street", itemType: "snack", per100g: { calories: 350, protein: 9, carbs: 77, fat: 0.5, fiber: 0 }, servings: [{ id: "handful", label: "1 handful (30g)", grams: 30 }, { id: "g100", label: "100g", grams: 100 }], dietTypes: ["vegan", "veg", "jain", "egg", "nonveg"], containsRootVeg: false, isFastingFood: true, fastingTypes: ["navratri", "ekadashi"], tags: ["snack", "low-fat", "fasting-safe"], confidence: "high", source: "IFCT-2017" },
    { id: "samosa", name: "Samosa (fried)", nameAlt: ["samosa"], searchTerms: ["samosa"], category: "snack-street", itemType: "snack", per100g: { calories: 308, protein: 5, carbs: 36, fat: 15, fiber: 2 }, servings: [{ id: "piece", label: "1 samosa", grams: 80 }, { id: "g100", label: "100g", grams: 100 }], dietTypes: ["veg", "egg", "nonveg"], containsRootVeg: true, isFastingFood: false, tags: ["snack", "calorie-dense"], confidence: "medium", source: "healthifyme" },

    // DRINKS & BEVERAGES
    { id: "chai-base", name: "Chai (black tea base)", nameAlt: ["tea", "chai"], searchTerms: ["chai", "tea", "chay"], category: "drink", itemType: "drink", hasBeverageModifiers: true, per100g: { calories: 2, protein: 0.1, carbs: 0.3, fat: 0, fiber: 0 }, servings: [{ id: "cup", label: "1 cup (150ml)", grams: 150 }], dietTypes: ["vegan", "veg", "jain", "egg", "nonveg"], containsRootVeg: false, isFastingFood: false, tags: ["breakfast", "anytime"], confidence: "high", source: "IFCT-2017" },
    { id: "coffee-black", name: "Black Coffee", nameAlt: ["coffee", "filter coffee"], searchTerms: ["coffee", "black coffee", "kaapi", "filter coffee"], category: "drink", itemType: "drink", hasBeverageModifiers: true, per100g: { calories: 2, protein: 0.3, carbs: 0.3, fat: 0, fiber: 0 }, servings: [{ id: "cup", label: "1 cup (150ml)", grams: 150 }], dietTypes: ["vegan", "veg", "jain", "egg", "nonveg"], containsRootVeg: false, isFastingFood: false, tags: ["breakfast", "pre-workout", "anytime"], confidence: "high", source: "IFCT-2017" },
    { id: "coconut-water", name: "Coconut Water (tender)", nameAlt: ["nariyal pani", "daab"], searchTerms: ["coconut water", "nariyal pani", "daab", "tender coconut"], category: "drink", itemType: "drink", per100g: { calories: 19, protein: 0.7, carbs: 4, fat: 0.2, fiber: 0 }, servings: [{ id: "glass", label: "1 glass (250ml)", grams: 250 }], dietTypes: ["vegan", "veg", "jain", "egg", "nonveg"], containsRootVeg: false, isFastingFood: true, fastingTypes: ["navratri", "ekadashi", "ramzan"], tags: ["post-workout", "low-calorie", "fasting-safe"], confidence: "high", source: "IFCT-2017" },
    { id: "sattu-sharbat", name: "Sattu Sharbat", nameAlt: ["sattu drink", "sattu water"], searchTerms: ["sattu", "sattu drink", "sattu sharbat"], category: "drink", itemType: "drink", per100g: { calories: 115, protein: 6, carbs: 20, fat: 1.8, fiber: 2 }, servings: [{ id: "glass", label: "1 glass (250ml)", grams: 250 }], dietTypes: ["vegan", "veg", "jain", "egg", "nonveg"], containsRootVeg: false, isFastingFood: false, tags: ["pre-workout", "post-workout", "high-protein", "budget-friendly"], confidence: "medium", source: "curated-estimate" },

    // SUPPLEMENTS
    { id: "whey-protein", name: "Whey Protein (1 scoop)", nameAlt: ["protein powder", "whey"], searchTerms: ["whey", "protein powder", "muscleblaze", "supplement"], category: "supplement", itemType: "supplement", per100g: { calories: 400, protein: 80, carbs: 10, fat: 5, fiber: 0 }, servings: [{ id: "scoop", label: "1 scoop (30g)", grams: 30 }], dietTypes: ["veg", "egg", "nonveg"], containsRootVeg: false, isFastingFood: false, tags: ["post-workout", "very-high-protein", "muscle-building"], confidence: "high", source: "FSSAI-label" },
    { id: "soya-chunks", name: "Soya Chunks (dry)", nameAlt: ["textured soy protein", "TVP", "soya nuggets"], searchTerms: ["soya", "soya chunks", "textured protein", "TVP", "nutrela"], category: "supplement", itemType: "base-food", per100g: { calories: 345, protein: 52, carbs: 33, fat: 0.5, fiber: 13 }, servings: [{ id: "g100", label: "100g", grams: 100 }, { id: "handful", label: "1 handful (50g)", grams: 50 }], dietTypes: ["vegan", "veg", "jain", "egg", "nonveg"], containsRootVeg: false, isFastingFood: false, tags: ["very-high-protein", "muscle-building", "budget-friendly"], confidence: "high", source: "IFCT-2017" },

    // OILS & FATS
    { id: "ghee", name: "Ghee (clarified butter)", nameAlt: ["clarified butter", "desi ghee"], searchTerms: ["ghee", "clarified butter", "desi ghee"], category: "oil-fat", itemType: "base-food", per100g: { calories: 900, protein: 0, carbs: 0, fat: 100, fiber: 0 }, servings: [{ id: "tbsp", label: "1 tbsp (15g)", grams: 15 }], dietTypes: ["veg", "jain", "egg", "nonveg"], containsRootVeg: false, isFastingFood: false, tags: ["anytime", "calorie-dense", "high-fat"], confidence: "high", source: "IFCT-2017" },
    { id: "peanut-butter", name: "Peanut Butter", nameAlt: ["peanut butter"], searchTerms: ["peanut butter", "moongfali butter"], category: "oil-fat", itemType: "base-food", per100g: { calories: 598, protein: 25, carbs: 22, fat: 51, fiber: 6 }, servings: [{ id: "tbsp", label: "1 tbsp (16g)", grams: 16 }, { id: "g100", label: "100g", grams: 100 }], dietTypes: ["vegan", "veg", "jain", "egg", "nonveg"], containsRootVeg: false, isFastingFood: false, tags: ["snack", "muscle-building", "high-fat"], confidence: "high", source: "FSSAI-label" },

    // FRUITS
    { id: "banana", name: "Banana", nameAlt: ["kela", "kele"], searchTerms: ["banana", "kela", "kele"], category: "fruit", itemType: "base-food", per100g: { calories: 89, protein: 1.1, carbs: 23, fat: 0.3, fiber: 2.6 }, servings: [{ id: "medium", label: "1 medium banana", grams: 120 }, { id: "g100", label: "100g", grams: 100 }], dietTypes: ["vegan", "veg", "jain", "egg", "nonveg"], containsRootVeg: false, isFastingFood: true, fastingTypes: ["navratri", "ekadashi"], tags: ["pre-workout", "post-workout", "anytime", "fasting-safe"], confidence: "high", source: "IFCT-2017" },
    { id: "apple", name: "Apple", nameAlt: ["seb"], searchTerms: ["apple", "seb"], category: "fruit", itemType: "base-food", per100g: { calories: 52, protein: 0.3, carbs: 14, fat: 0.2, fiber: 2.4 }, servings: [{ id: "medium", label: "1 medium apple", grams: 150 }, { id: "g100", label: "100g", grams: 100 }], dietTypes: ["vegan", "veg", "jain", "egg", "nonveg"], containsRootVeg: false, isFastingFood: true, fastingTypes: ["navratri", "ekadashi"], tags: ["snack", "low-calorie", "fasting-safe"], confidence: "high", source: "IFCT-2017" },

    // MILLETS
    { id: "ragi-dosa", name: "Ragi Dosa", nameAlt: ["finger millet dosa", "nachni dosa"], searchTerms: ["ragi", "finger millet", "nachni", "ragi dosa"], category: "millet", itemType: "dish", per100g: { calories: 188, protein: 5, carbs: 38, fat: 2, fiber: 3 }, servings: [{ id: "piece", label: "1 dosa", grams: 100 }, { id: "g100", label: "100g", grams: 100 }], dietTypes: ["vegan", "veg", "jain", "egg", "nonveg"], containsRootVeg: false, isFastingFood: false, tags: ["breakfast", "gluten-free"], confidence: "medium", source: "curated-estimate" },
    { id: "jowar-roti", name: "Jowar Roti / Bhakri", nameAlt: ["sorghum roti", "jowar bhakri"], searchTerms: ["jowar", "sorghum", "bhakri", "jowar roti"], category: "millet", itemType: "dish", per100g: { calories: 328, protein: 10, carbs: 68, fat: 2, fiber: 4 }, servings: [{ id: "roti", label: "1 roti (40g)", grams: 40 }, { id: "g100", label: "100g", grams: 100 }], dietTypes: ["vegan", "veg", "jain", "egg", "nonveg"], containsRootVeg: false, isFastingFood: false, tags: ["lunch", "dinner", "gluten-free"], confidence: "high", source: "IFCT-2017" },

    // FASTING FOODS
    { id: "sabudana-khichdi", name: "Sabudana Khichdi", nameAlt: ["tapioca khichdi", "sago khichdi"], searchTerms: ["sabudana", "sago", "tapioca", "vrat", "khichdi"], category: "fasting-food", itemType: "dish", per100g: { calories: 172, protein: 2.5, carbs: 35, fat: 4, fiber: 0.5 }, servings: [{ id: "bowl", label: "1 bowl", grams: 200 }, { id: "g100", label: "100g", grams: 100 }], dietTypes: ["vegan", "veg", "jain", "egg", "nonveg"], containsRootVeg: false, isFastingFood: true, fastingTypes: ["navratri", "ekadashi"], tags: ["breakfast", "fasting-safe"], confidence: "medium", source: "curated-estimate" },

    // PACKAGED
    { id: "haldirams-bhujia", name: "Haldiram's Aloo Bhujia", nameAlt: ["bhujia", "haldirams"], searchTerms: ["bhujia", "haldirams", "namkeen", "aloo bhujia"], category: "packaged-food", itemType: "snack", isProcessed: true, per100g: { calories: 520, protein: 9, carbs: 60, fat: 28, fiber: 4 }, servings: [{ id: "handful", label: "1 handful (30g)", grams: 30 }, { id: "g100", label: "100g", grams: 100 }], dietTypes: ["veg", "egg", "nonveg"], containsRootVeg: true, isFastingFood: false, tags: ["snack", "calorie-dense"], confidence: "high", source: "FSSAI-label" },
];

/* ─── CATEGORIES ──────────────────────────────────────────────────────── */
const CATEGORIES = [
    { id: "all", label: "All", icon: "🍽" },
    { id: "grain-cereal", label: "Grains", icon: "🌾" },
    { id: "roti-bread", label: "Roti & Breads", icon: "🫓" },
    { id: "dal-legume", label: "Dal & Legumes", icon: "🫘" },
    { id: "sabzi-veg", label: "Sabzi", icon: "🥬" },
    { id: "non-veg", label: "Non-Veg", icon: "🍗" },
    { id: "egg", label: "Eggs", icon: "🥚" },
    { id: "dairy", label: "Dairy", icon: "🥛" },
    { id: "breakfast", label: "Breakfast", icon: "🍳" },
    { id: "snack-street", label: "Snacks", icon: "🥨" },
    { id: "sweet-mithai", label: "Sweets", icon: "🍬" },
    { id: "fruit", label: "Fruits", icon: "🍎" },
    { id: "drink", label: "Drinks", icon: "☕" },
    { id: "oil-fat", label: "Oils & Fats", icon: "🫙" },
    { id: "supplement", label: "Supplements", icon: "💊" },
    { id: "millet", label: "Millets", icon: "🌾" },
    { id: "fasting-food", label: "Fasting", icon: "🙏" },
    { id: "packaged-food", label: "Packaged", icon: "📦" },
];

/* ─── MEAL SLOTS ──────────────────────────────────────────────────────── */
const MEAL_SLOTS = [
    { id: "breakfast", label: "Breakfast", icon: "sunny", suggestedKcal: 500, note: "High Protein" },
    { id: "mid-morning", label: "Mid-Morning", icon: "coffee", suggestedKcal: 150, note: "Liquid / Fruit" },
    { id: "lunch", label: "Lunch", icon: "restaurant", suggestedKcal: 700, note: "Balanced Macro" },
    { id: "evening-snack", label: "Evening Snack & Chai", icon: "cookie", suggestedKcal: 150, note: "Pre-Workout Fuel" },
    { id: "pre-workout", label: "Pre-Workout", icon: "sports_gymnastics", suggestedKcal: 200, note: "Fast Carbs" },
    { id: "post-workout", label: "Post-Workout", icon: "fitness_center", suggestedKcal: 300, note: "Protein Priority" },
    { id: "dinner", label: "Dinner", icon: "dinner_dining", suggestedKcal: 550, note: "Low Carb" },
    { id: "before-bed", label: "Before Bed", icon: "bedtime", suggestedKcal: 100, note: "Casein / Slow Protein" },
];

/* ─── BEVERAGE MODIFIER DATA ─────────────────────────────────────────── */
const MILK_MODIFIERS = [
    { id: "none", label: "No milk", cal: 0, protein: 0 },
    { id: "toned", label: "50ml toned milk", cal: 23, protein: 1.8 },
    { id: "full-fat", label: "50ml full-fat milk", cal: 33, protein: 1.6 },
    { id: "skim", label: "50ml skim milk", cal: 17, protein: 1.8 },
    { id: "condensed", label: "30ml condensed milk", cal: 90, protein: 2 },
];
const SWEETENER_MODIFIERS = [
    { id: "none", label: "No sugar", cal: 0 },
    { id: "sugar", label: "1 tsp sugar", cal: 20 },
    { id: "jaggery", label: "1 tsp jaggery", cal: 27 },
    { id: "stevia", label: "Stevia", cal: 0 },
];

/* ─── DIET PRESETS ────────────────────────────────────────────────────── */
const DIET_PRESETS = [
    { id: "cut", label: "CUT", kcal: 1900, protein: 185, carbs: 130, fat: 60 },
    { id: "maintain", label: "MAINTAIN", kcal: 2400, protein: 160, carbs: 240, fat: 75 },
    { id: "bulk", label: "BULK", kcal: 3000, protein: 190, carbs: 330, fat: 90 },
];

/* ─── UTILS ──────────────────────────────────────────────────────────── */
function calcMacros(food, servingId, qty) {
    const serving = food.servings.find(s => s.id === servingId) || food.servings[0];
    const factor = (serving.grams * qty) / 100;
    return {
        calories: Math.round(food.per100g.calories * factor),
        protein: Math.round(food.per100g.protein * factor * 10) / 10,
        carbs: Math.round(food.per100g.carbs * factor * 10) / 10,
        fat: Math.round(food.per100g.fat * factor * 10) / 10,
    };
}

function calcBeverageMacros(food, milkModId, sweetenerId, qty) {
    const base = calcMacros(food, food.servings[0].id, qty);
    const milk = MILK_MODIFIERS.find(m => m.id === milkModId) || MILK_MODIFIERS[0];
    const sweet = SWEETENER_MODIFIERS.find(s => s.id === sweetenerId) || SWEETENER_MODIFIERS[0];
    return {
        calories: Math.round((base.calories + milk.cal + sweet.cal) * qty),
        protein: Math.round((base.protein + milk.protein) * qty * 10) / 10,
        carbs: base.carbs,
        fat: base.fat,
    };
}

function searchFoods(query, category, dietType, fastingType, jainMode) {
    const q = query.toLowerCase().trim();
    return INDIAN_FOODS.filter(food => {
        if (category !== "all" && food.category !== category) return false;
        if (jainMode && food.containsRootVeg) return false;
        if (fastingType && !food.isFastingFood) return false;
        if (dietType !== "all" && !food.dietTypes.includes(dietType)) return false;
        if (!q) return true;
        return (
            food.name.toLowerCase().includes(q) ||
            food.nameAlt?.some(n => n.toLowerCase().includes(q)) ||
            food.searchTerms?.some(t => t.toLowerCase().includes(q))
        );
    });
}

/* ─── MACRO RING COMPONENT ───────────────────────────────────────────── */
function MacroRing({ label, value, max, unit, color, size = 120 }) {
    const r = (size / 2) - 8;
    const circumference = 2 * Math.PI * r;
    const pct = Math.min(value / max, 1);
    const offset = circumference * (1 - pct);
    const cx = size / 2;
    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            <div style={{ position: "relative", width: size, height: size }}>
                <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
                    <circle cx={cx} cy={cx} r={r} fill="none" stroke="rgba(53,52,55,0.8)" strokeWidth={6} />
                    <circle cx={cx} cy={cx} r={r} fill="none" stroke={color} strokeWidth={6}
                        strokeDasharray={circumference} strokeDashoffset={offset}
                        strokeLinecap="butt" style={{ transition: "stroke-dashoffset 0.6s cubic-bezier(0.34,1.56,0.64,1)" }} />
                </svg>
                <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 20, fontWeight: 700, color: "#EAEAF0", letterSpacing: "-0.04em", lineHeight: 1 }}>{value}</span>
                    <span style={{ fontFamily: "'Be Vietnam Pro',sans-serif", fontSize: 9, fontWeight: 700, color: "#6E6E76", textTransform: "uppercase", letterSpacing: "0.15em" }}>{unit}</span>
                </div>
            </div>
            <span style={{ fontFamily: "'Be Vietnam Pro',sans-serif", fontSize: 10, fontWeight: 700, color: "#E3BFB3", textTransform: "uppercase", letterSpacing: "0.15em" }}>{label}</span>
        </div>
    );
}

/* ─── MAIN COMPONENT ─────────────────────────────────────────────────── */
export default function DietPage() {
    const { user, caloriesLog = [], addToast } = useContext(AppContext) || {};

    /* — Diet / Macro Goals state — */
    const [activeGoal, setActiveGoal] = useState("cut");
    const preset = DIET_PRESETS.find(p => p.id === activeGoal) || DIET_PRESETS[0];

    /* — Food Log state — */
    const today = new Date();
    const [logDate, setLogDate] = useState(today);
    const [foodLog, setFoodLog] = useState([]);   // [{id, foodId, mealSlot, servingId, qty, macros, beverageMods?, note?, ts}]
    const [expandedSlot, setExpandedSlot] = useState(null);

    /* — Food Search Modal — */
    const [showSearch, setShowSearch] = useState(false);
    const [activeMealSlot, setActiveMealSlot] = useState("breakfast");
    const [searchQuery, setSearchQuery] = useState("");
    const [activeCategory, setActiveCategory] = useState("all");
    const [dietFilter, setDietFilter] = useState("all");
    const [fastingFilter, setFastingFilter] = useState(null);
    const [jainMode, setJainMode] = useState(false);

    /* — Food Entry state — */
    const [selectedFood, setSelectedFood] = useState(null);
    const [selectedServingId, setSelectedServingId] = useState(null);
    const [quantity, setQuantity] = useState(1);

    /* — Beverage Builder state — */
    const [showBeverageBuilder, setShowBeverageBuilder] = useState(false);
    const [milkMod, setMilkMod] = useState("toned");
    const [sweetenerMod, setSweetenerMod] = useState("sugar");

    /* — Consistency Modifier — */
    const [consistencyMod, setConsistencyMod] = useState("standard");

    const searchInputRef = useRef(null);

    /* computed: today's totals */
    const todayKey = logDate.toDateString();
    const todayLog = foodLog.filter(e => new Date(e.ts).toDateString() === todayKey);

    const totals = todayLog.reduce((acc, e) => ({
        calories: acc.calories + (e.macros?.calories || 0),
        protein: acc.protein + (e.macros?.protein || 0),
        carbs: acc.carbs + (e.macros?.carbs || 0),
        fat: acc.fat + (e.macros?.fat || 0),
    }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

    const filteredFoods = useMemo(() => searchFoods(searchQuery, activeCategory, dietFilter, fastingFilter, jainMode), [searchQuery, activeCategory, dietFilter, fastingFilter, jainMode]);

    /* open search modal for a slot */
    function openSearch(slotId) {
        setActiveMealSlot(slotId);
        setShowSearch(true);
        setSearchQuery("");
        setSelectedFood(null);
        setShowBeverageBuilder(false);
        setTimeout(() => searchInputRef.current?.focus(), 80);
    }

    /* select a food from results */
    function handleFoodSelect(food) {
        setSelectedFood(food);
        setSelectedServingId(food.servings[0].id);
        setQuantity(1);
        setConsistencyMod("standard");
        if (food.hasBeverageModifiers) {
            setShowBeverageBuilder(true);
            setMilkMod("toned");
            setSweetenerMod("sugar");
        } else {
            setShowBeverageBuilder(false);
        }
    }

    /* compute preview macros */
    function previewMacros() {
        if (!selectedFood) return null;
        if (selectedFood.hasBeverageModifiers && showBeverageBuilder) {
            return calcBeverageMacros(selectedFood, milkMod, sweetenerMod, quantity);
        }
        let macros = calcMacros(selectedFood, selectedServingId, quantity);
        if (selectedFood.supportedConsistencyTypes?.length && consistencyMod !== "standard") {
            const mult = selectedFood.consistencyMultipliers?.[consistencyMod] ?? 1;
            macros = { ...macros, calories: Math.round(macros.calories * mult) };
        }
        return macros;
    }

    /* confirm log entry */
    function confirmEntry() {
        if (!selectedFood) return;
        const macros = previewMacros();
        const entry = {
            id: Date.now().toString(),
            foodId: selectedFood.id,
            foodName: selectedFood.name,
            mealSlot: activeMealSlot,
            servingId: selectedServingId,
            qty: quantity,
            macros,
            ts: new Date().toISOString(),
            beverageMods: showBeverageBuilder ? { milk: milkMod, sweetener: sweetenerMod } : null,
            consistency: consistencyMod !== "standard" ? consistencyMod : null,
        };
        setFoodLog(prev => [...prev, entry]);
        setSelectedFood(null);
        setShowSearch(false);
        setShowBeverageBuilder(false);
        addToast?.({ message: `${selectedFood.name} added to ${MEAL_SLOTS.find(m => m.id === activeMealSlot)?.label}`, type: "success" });
    }

    function deleteEntry(id) {
        setFoodLog(prev => prev.filter(e => e.id !== id));
    }

    /* date navigation */
    function changeDate(delta) {
        const d = new Date(logDate);
        d.setDate(d.getDate() + delta);
        setLogDate(d);
    }
    const isToday = logDate.toDateString() === today.toDateString();
    const dateLabel = isToday ? "Today" : logDate.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });

    const macroPreview = previewMacros();

    /* ─────── STYLES ──────────────────────────────────────────────────── */
    const S = {
        page: { background: "#131315", minHeight: "100dvh", padding: "0 0 6rem", fontFamily: "'Be Vietnam Pro', sans-serif" },
        section: { maxWidth: 900, margin: "0 auto", padding: "0 1rem" },
        card: { background: "#1A1A1D", borderRadius: 12, padding: "1.25rem", marginBottom: "0.75rem" },
        cardHigher: { background: "#212124", borderRadius: 12, padding: "1.25rem", marginBottom: "0.75rem" },
        glass: { background: "rgba(53,52,55,0.55)", backdropFilter: "blur(12px)", borderRadius: 12, padding: "1.25rem", marginBottom: "0.75rem" },
        label: { fontFamily: "'Be Vietnam Pro',sans-serif", fontSize: 9, fontWeight: 700, color: "#6E6E76", textTransform: "uppercase", letterSpacing: "0.2em" },
        headline: { fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, letterSpacing: "-0.04em", color: "#EAEAF0" },
        ember: { background: "linear-gradient(135deg,#FFB59B,#F85F1B)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" },
        btn: { background: "linear-gradient(135deg,#FFB59B,#F85F1B)", border: "none", borderRadius: 8, padding: "0.65rem 1.25rem", fontFamily: "'Be Vietnam Pro',sans-serif", fontWeight: 700, fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", color: "#1A0A00", cursor: "pointer" },
        ghostBtn: { background: "transparent", border: "1px solid rgba(90,65,56,0.3)", borderRadius: 8, padding: "0.55rem 1rem", fontFamily: "'Be Vietnam Pro',sans-serif", fontWeight: 600, fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "#E3BFB3", cursor: "pointer" },
        chip: { background: "#212124", border: "none", borderRadius: 20, padding: "0.35rem 0.85rem", fontFamily: "'Be Vietnam Pro',sans-serif", fontSize: 11, fontWeight: 600, color: "#E3BFB3", cursor: "pointer", letterSpacing: "0.05em", whiteSpace: "nowrap" },
        chipActive: { background: "linear-gradient(135deg,#FFB59B,#F85F1B)", color: "#1A0A00" },
        input: { width: "100%", background: "#0E0E10", border: "none", borderRadius: 10, padding: "0.75rem 1rem", fontFamily: "'Space Grotesk',sans-serif", fontSize: 16, color: "#EAEAF0", outline: "none", boxSizing: "border-box" },
        overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.72)", backdropFilter: "blur(6px)", zIndex: 100, display: "flex", flexDirection: "column", justifyContent: "flex-end" },
        modal: { background: "#1A1A1D", borderRadius: "16px 16px 0 0", maxHeight: "90dvh", display: "flex", flexDirection: "column", overflow: "hidden" },
        modalScroll: { overflowY: "auto", flex: 1, padding: "0 1rem 1rem" },
        divider: { borderTop: "1px solid rgba(90,65,56,0.12)", margin: "0.75rem 0" },
        macroTag: { display: "inline-flex", alignItems: "center", gap: 4, background: "#212124", borderRadius: 6, padding: "2px 8px", fontSize: 11, color: "#E3BFB3", fontWeight: 600 },
    };

    /* ─────── RENDER ─────────────────────────────────────────────────── */
    return (
        <div style={S.page}>
            {/* ── PAGE HEADER ─────────────────────────────────────────── */}
            <div style={{ ...S.section, paddingTop: "1.5rem", paddingBottom: "0.5rem" }}>
                <p style={S.label}>Nutrition</p>
                <h1 style={{ ...S.headline, fontSize: "clamp(1.8rem,6vw,2.5rem)", marginTop: 4, marginBottom: 0 }}>
                    <span style={S.ember}>DIET</span>{" & MACROS"}
                </h1>
            </div>

            {/* ═══════════════════════════════════════════════════════════
          SECTION 1 ── EXISTING DIET PAGE (Goals + Macro Targets)
         ═══════════════════════════════════════════════════════════ */}
            <div style={{ ...S.section, marginTop: "1rem" }}>

                {/* ── Goal Phase Toggle ────────────────────────────────── */}
                <div style={S.card}>
                    <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
                        <div>
                            <p style={S.label}>Phase Status</p>
                            <h2 style={{ ...S.headline, fontSize: "clamp(2rem,7vw,3rem)", marginTop: 4, fontStyle: "italic" }}>
                                GOAL: <span style={S.ember}>{preset.label}</span>
                            </h2>
                        </div>
                        <div style={{ display: "flex", background: "#0E0E10", borderRadius: 10, padding: 4, gap: 2 }}>
                            {DIET_PRESETS.map(p => (
                                <button key={p.id} onClick={() => setActiveGoal(p.id)} style={{ ...S.chip, ...(activeGoal === p.id ? S.chipActive : {}), fontSize: 10, padding: "0.4rem 0.9rem" }}>
                                    {p.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── Macro Target Rings ───────────────────────────────── */}
                <div style={{ ...S.cardHigher, display: "flex", justifyContent: "space-around", flexWrap: "wrap", gap: "1rem", padding: "1.5rem 1rem" }}>
                    <MacroRing label="Daily Energy" value={preset.kcal} max={4000} unit="Kcal" color="#F85F1B" />
                    <MacroRing label="Protein" value={preset.protein} max={250} unit="Grams" color="#FFB59B" />
                    <MacroRing label="Carbs" value={preset.carbs} max={400} unit="Grams" color="#2692FF" />
                    <MacroRing label="Fats" value={preset.fat} max={150} unit="Grams" color="#AA8A7F" />
                </div>

                {/* ── Quick Stats Row ──────────────────────────────────── */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(130px,1fr))", gap: "0.5rem", marginBottom: "0.75rem" }}>
                    {[
                        { label: "TDEE", value: "2,840", unit: "kcal/day" },
                        { label: "Deficit / Surplus", value: preset.id === "cut" ? "-490" : preset.id === "bulk" ? "+360" : "0", unit: "kcal" },
                        { label: "Protein / kg", value: (preset.protein / (user?.weight || 80)).toFixed(1), unit: "g/kg BW" },
                    ].map(stat => (
                        <div key={stat.label} style={{ ...S.card, margin: 0, display: "flex", flexDirection: "column", gap: 4 }}>
                            <p style={S.label}>{stat.label}</p>
                            <p style={{ ...S.headline, fontSize: 22, margin: 0 }}>
                                {stat.value}<span style={{ fontSize: 10, color: "#6E6E76", fontFamily: "'Be Vietnam Pro'", letterSpacing: "0.1em", marginLeft: 4 }}>{stat.unit}</span>
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* ═══════════════════════════════════════════════════════════
          SECTION 2 ── FOOD LOG (Indian DB + Meal Slots)
         ═══════════════════════════════════════════════════════════ */}
            <div style={{ ...S.section, marginTop: "2rem" }}>

                {/* ── Section Title + Date Nav ─────────────────────────── */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                    <div>
                        <p style={S.label}>Daily Tracker</p>
                        <h2 style={{ ...S.headline, fontSize: "clamp(1.4rem,5vw,1.8rem)", marginTop: 4 }}>FOOD LOG</h2>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#1A1A1D", borderRadius: 10, padding: "0.4rem 0.75rem" }}>
                        <button onClick={() => changeDate(-1)} style={{ background: "none", border: "none", color: "#FFB59B", cursor: "pointer", padding: "2px 6px", fontSize: 18, lineHeight: 1 }}>‹</button>
                        <span style={{ fontFamily: "'Space Grotesk'", fontSize: 13, fontWeight: 600, color: "#EAEAF0", minWidth: 72, textAlign: "center" }}>{dateLabel}</span>
                        <button onClick={() => changeDate(1)} disabled={isToday} style={{ background: "none", border: "none", color: isToday ? "#353437" : "#FFB59B", cursor: isToday ? "default" : "pointer", padding: "2px 6px", fontSize: 18, lineHeight: 1 }}>›</button>
                    </div>
                </div>

                {/* ── Today's Macro Progress ───────────────────────────── */}
                <div style={{ ...S.cardHigher, background: "linear-gradient(135deg,rgba(248,95,27,0.07),rgba(255,181,155,0.04))", border: "1px solid rgba(248,95,27,0.15)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                        <p style={{ ...S.label, color: "#FFB59B" }}>Today's Progress</p>
                        <span style={{ fontFamily: "'Space Grotesk'", fontSize: 20, fontWeight: 700, color: "#EAEAF0" }}>
                            {totals.calories}<span style={{ fontSize: 11, color: "#6E6E76", marginLeft: 4 }}>/ {preset.kcal} kcal</span>
                        </span>
                    </div>
                    {/* Master calorie bar */}
                    <div style={{ background: "#0E0E10", borderRadius: 4, height: 6, marginBottom: "1rem", overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${Math.min(totals.calories / preset.kcal * 100, 100)}%`, background: "linear-gradient(90deg,#FFB59B,#F85F1B)", borderRadius: 4, transition: "width 0.5s ease" }} />
                    </div>
                    {/* P/C/F mini bars */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "0.75rem" }}>
                        {[
                            { label: "Protein", val: totals.protein, max: preset.protein, color: "#FFB59B", unit: "g" },
                            { label: "Carbs", val: totals.carbs, max: preset.carbs, color: "#2692FF", unit: "g" },
                            { label: "Fat", val: totals.fat, max: preset.fat, color: "#AA8A7F", unit: "g" },
                        ].map(m => (
                            <div key={m.label}>
                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                                    <span style={{ ...S.label, color: m.color }}>{m.label}</span>
                                    <span style={{ fontFamily: "'Space Grotesk'", fontSize: 11, color: "#EAEAF0" }}>{m.val.toFixed(0)}<span style={{ color: "#6E6E76" }}>/{m.max}g</span></span>
                                </div>
                                <div style={{ background: "#0E0E10", borderRadius: 3, height: 4, overflow: "hidden" }}>
                                    <div style={{ height: "100%", width: `${Math.min(m.val / m.max * 100, 100)}%`, background: m.color, borderRadius: 3, transition: "width 0.5s ease" }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Meal Slot Cards ──────────────────────────────────── */}
                <div style={{ marginTop: "1rem" }}>
                    {MEAL_SLOTS.map(slot => {
                        const slotEntries = todayLog.filter(e => e.mealSlot === slot.id);
                        const slotKcal = slotEntries.reduce((a, e) => a + (e.macros?.calories || 0), 0);
                        const isExpanded = expandedSlot === slot.id;
                        const pct = Math.min(slotKcal / slot.suggestedKcal, 1);

                        return (
                            <div key={slot.id} style={{ ...S.glass, border: isExpanded ? "1px solid rgba(255,181,155,0.18)" : "1px solid transparent", transition: "border-color 0.2s" }}>
                                {/* Slot Header Row */}
                                <div style={{ display: "flex", alignItems: "center", gap: 14, cursor: "pointer" }} onClick={() => setExpandedSlot(isExpanded ? null : slot.id)}>
                                    {/* Icon */}
                                    <div style={{ width: 44, height: 44, background: "#212124", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                        <span className="material-symbols-outlined" style={{ fontSize: 22, color: slotKcal > 0 ? "#FFB59B" : "#6E6E76" }}>{slot.icon}</span>
                                    </div>
                                    {/* Name + note */}
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <p style={{ ...S.headline, fontSize: 15, margin: 0 }}>{slot.label}</p>
                                        <p style={{ ...S.label, margin: "2px 0 0", color: "#6E6E76" }}>Suggested {slot.suggestedKcal} kcal · {slot.note}</p>
                                        {/* mini progress */}
                                        {slotKcal > 0 && (
                                            <div style={{ background: "rgba(14,14,16,0.6)", borderRadius: 3, height: 3, marginTop: 6, overflow: "hidden", maxWidth: 160 }}>
                                                <div style={{ height: "100%", width: `${pct * 100}%`, background: pct >= 1 ? "#F85F1B" : "#FFB59B", borderRadius: 3 }} />
                                            </div>
                                        )}
                                    </div>
                                    {/* Kcal tracked + add btn */}
                                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                        <div style={{ textAlign: "right" }}>
                                            <p style={{ ...S.headline, fontSize: 18, margin: 0, color: slotKcal > 0 ? "#FFB59B" : "#353437" }}>{slotKcal || 0}</p>
                                            <p style={{ ...S.label, margin: 0, fontSize: 8 }}>kcal</p>
                                        </div>
                                        <button
                                            onClick={e => { e.stopPropagation(); openSearch(slot.id); }}
                                            style={{ width: 36, height: 36, borderRadius: "50%", background: "none", border: "1px solid rgba(90,65,56,0.35)", color: "#F85F1B", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}
                                        >+</button>
                                    </div>
                                </div>

                                {/* Expanded: logged foods */}
                                {isExpanded && slotEntries.length > 0 && (
                                    <div style={{ marginTop: "0.75rem" }}>
                                        <div style={S.divider} />
                                        {slotEntries.map(entry => (
                                            <div key={entry.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.5rem 0", gap: 8 }}>
                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                    <p style={{ fontFamily: "'Be Vietnam Pro'", fontSize: 13, fontWeight: 600, color: "#EAEAF0", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{entry.foodName}</p>
                                                    <div style={{ display: "flex", gap: 6, marginTop: 3, flexWrap: "wrap" }}>
                                                        <span style={S.macroTag}>P {entry.macros?.protein?.toFixed(0)}g</span>
                                                        <span style={S.macroTag}>C {entry.macros?.carbs?.toFixed(0)}g</span>
                                                        <span style={S.macroTag}>F {entry.macros?.fat?.toFixed(0)}g</span>
                                                        {entry.consistency && <span style={{ ...S.macroTag, color: "#FFB59B" }}>{entry.consistency}</span>}
                                                    </div>
                                                </div>
                                                <span style={{ ...S.headline, fontSize: 15, color: "#FFB59B", flexShrink: 0 }}>{entry.macros?.calories} kcal</span>
                                                <button onClick={() => deleteEntry(entry.id)} style={{ background: "none", border: "none", color: "#6E6E76", cursor: "pointer", fontSize: 16, padding: "0 4px", lineHeight: 1 }}>✕</button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {isExpanded && slotEntries.length === 0 && (
                                    <div style={{ marginTop: "0.75rem", textAlign: "center" }}>
                                        <div style={S.divider} />
                                        <p style={{ color: "#6E6E76", fontSize: 13, fontFamily: "'Be Vietnam Pro'", padding: "0.5rem 0" }}>No foods logged yet — tap + to add</p>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* ═══════════════════════════════════════════════════════════
          FOOD SEARCH MODAL
         ═══════════════════════════════════════════════════════════ */}
            {showSearch && (
                <div style={S.overlay} onClick={() => { setShowSearch(false); setSelectedFood(null); }}>
                    <div style={S.modal} onClick={e => e.stopPropagation()}>

                        {/* Drag handle */}
                        <div style={{ display: "flex", justifyContent: "center", padding: "10px 0 0" }}>
                            <div style={{ width: 36, height: 4, borderRadius: 2, background: "#353437" }} />
                        </div>

                        {/* Modal Header */}
                        <div style={{ padding: "0.75rem 1rem 0.5rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <div>
                                <p style={S.label}>Adding to</p>
                                <p style={{ ...S.headline, fontSize: 16, margin: 0, color: "#FFB59B" }}>{MEAL_SLOTS.find(s => s.id === activeMealSlot)?.label}</p>
                            </div>
                            <button onClick={() => { setShowSearch(false); setSelectedFood(null); }} style={{ background: "none", border: "none", color: "#6E6E76", cursor: "pointer", fontSize: 22, lineHeight: 1, padding: 4 }}>✕</button>
                        </div>

                        {/* ── If food selected: detail pane ────────────────── */}
                        {selectedFood ? (
                            <div style={S.modalScroll}>
                                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: "1rem" }}>
                                    <button onClick={() => { setSelectedFood(null); setShowBeverageBuilder(false); }} style={{ background: "none", border: "none", color: "#FFB59B", cursor: "pointer", fontSize: 22, padding: 0 }}>‹</button>
                                    <div>
                                        <p style={{ ...S.headline, fontSize: 17, margin: 0 }}>{selectedFood.name}</p>
                                        <p style={{ ...S.label, margin: "3px 0 0" }}>{selectedFood.category}</p>
                                    </div>
                                </div>

                                {/* Serving Picker */}
                                <p style={{ ...S.label, marginBottom: 6 }}>Serving Size</p>
                                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: "0.75rem" }}>
                                    {selectedFood.servings.map(sv => {
                                        const isDelivery = ["takeaway-container", "restaurant-portion", "thali"].includes(sv.id);
                                        return (
                                            <button key={sv.id} onClick={() => setSelectedServingId(sv.id)}
                                                style={{ ...S.chip, ...(selectedServingId === sv.id ? S.chipActive : {}), display: "flex", alignItems: "center", gap: 4 }}>
                                                {isDelivery && <span style={{ fontSize: 12 }}>📦</span>}
                                                {sv.label}
                                            </button>
                                        );
                                    })}
                                </div>
                                {["takeaway-container", "restaurant-portion", "thali"].includes(selectedServingId) && (
                                    <p style={{ fontSize: 11, color: "#FFB59B", fontFamily: "'Be Vietnam Pro'", background: "rgba(248,95,27,0.08)", borderRadius: 6, padding: "6px 10px", marginBottom: "0.75rem" }}>
                                        📦 Delivery &amp; restaurant portions vary. This is an estimate for a standard Swiggy/Zomato container.
                                    </p>
                                )}

                                {/* Cooking oil note */}
                                {selectedFood.cookingOilNote && (
                                    <p style={{ fontSize: 11, color: "#E3BFB3", fontFamily: "'Be Vietnam Pro'", background: "rgba(90,65,56,0.15)", borderRadius: 6, padding: "6px 10px", marginBottom: "0.75rem" }}>
                                        🫙 {selectedFood.cookingOilNote}
                                    </p>
                                )}

                                {/* Consistency toggle */}
                                {selectedFood.supportedConsistencyTypes?.length > 0 && !showBeverageBuilder && (
                                    <div style={{ marginBottom: "0.75rem" }}>
                                        <p style={{ ...S.label, marginBottom: 6 }}>How was it cooked?</p>
                                        <div style={{ display: "flex", gap: 6 }}>
                                            {[{ id: "thin", label: "💧 Watery/Thin" }, { id: "standard", label: "🥣 Normal" }, { id: "thick", label: "🍲 Thick/Rich" }].map(c => (
                                                <button key={c.id} onClick={() => setConsistencyMod(c.id)}
                                                    style={{ ...S.chip, ...(consistencyMod === c.id ? S.chipActive : {}), fontSize: 11 }}>
                                                    {c.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Quantity */}
                                <p style={{ ...S.label, marginBottom: 6 }}>Quantity</p>
                                <div style={{ display: "flex", gap: 6, marginBottom: "0.75rem", flexWrap: "wrap" }}>
                                    {[0.5, 1, 1.5, 2, 2.5, 3].map(q => (
                                        <button key={q} onClick={() => setQuantity(q)}
                                            style={{ ...S.chip, ...(quantity === q ? S.chipActive : {}), fontSize: 12 }}>
                                            {q}
                                        </button>
                                    ))}
                                </div>

                                {/* Beverage Builder */}
                                {showBeverageBuilder && (
                                    <div style={{ background: "#0E0E10", borderRadius: 10, padding: "0.85rem", marginBottom: "0.75rem" }}>
                                        <p style={{ ...S.label, color: "#FFB59B", marginBottom: 8 }}>☕ Build your drink</p>
                                        <p style={{ ...S.label, marginBottom: 4 }}>Milk</p>
                                        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: "0.65rem" }}>
                                            {MILK_MODIFIERS.map(m => (
                                                <button key={m.id} onClick={() => setMilkMod(m.id)}
                                                    style={{ ...S.chip, ...(milkMod === m.id ? S.chipActive : {}), fontSize: 10 }}>
                                                    {m.label}
                                                </button>
                                            ))}
                                        </div>
                                        <p style={{ ...S.label, marginBottom: 4 }}>Sweetener</p>
                                        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                                            {SWEETENER_MODIFIERS.map(m => (
                                                <button key={m.id} onClick={() => setSweetenerMod(m.id)}
                                                    style={{ ...S.chip, ...(sweetenerMod === m.id ? S.chipActive : {}), fontSize: 10 }}>
                                                    {m.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Macro Preview */}
                                {macroPreview && (
                                    <div style={{ background: "rgba(248,95,27,0.07)", border: "1px solid rgba(255,181,155,0.18)", borderRadius: 10, padding: "0.85rem", marginBottom: "1rem" }}>
                                        <p style={{ ...S.label, color: "#FFB59B", marginBottom: 8 }}>Macro Preview</p>
                                        <div style={{ display: "flex", justifyContent: "space-around" }}>
                                            {[
                                                { l: "Calories", v: macroPreview.calories, u: "kcal", c: "#F85F1B" },
                                                { l: "Protein", v: macroPreview.protein, u: "g", c: "#FFB59B" },
                                                { l: "Carbs", v: macroPreview.carbs, u: "g", c: "#2692FF" },
                                                { l: "Fat", v: macroPreview.fat, u: "g", c: "#AA8A7F" },
                                            ].map(m => (
                                                <div key={m.l} style={{ textAlign: "center" }}>
                                                    <p style={{ ...S.headline, fontSize: 20, margin: 0, color: m.c }}>{m.v}</p>
                                                    <p style={{ ...S.label, margin: "2px 0 0", fontSize: 8 }}>{m.u}</p>
                                                    <p style={{ ...S.label, margin: 0, fontSize: 8 }}>{m.l}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <button onClick={confirmEntry} style={{ ...S.btn, width: "100%", padding: "0.85rem", fontSize: 13 }}>
                                    Add to {MEAL_SLOTS.find(s => s.id === activeMealSlot)?.label}
                                </button>
                            </div>
                        ) : (
                            /* ── Food Search Pane ─────────────────────────── */
                            <>
                                {/* Search bar */}
                                <div style={{ padding: "0 1rem 0.5rem" }}>
                                    <div style={{ position: "relative" }}>
                                        <span className="material-symbols-outlined" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#6E6E76", fontSize: 20 }}>search</span>
                                        <input ref={searchInputRef} type="text" placeholder="Search foods — try 'dal', 'chai', 'sattu'…"
                                            value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                                            style={{ ...S.input, paddingLeft: "2.5rem" }} />
                                    </div>
                                </div>

                                {/* Diet + Fasting filters */}
                                <div style={{ padding: "0 1rem 0.5rem" }}>
                                    <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 4 }}>
                                        {[{ id: "all", label: "All" }, { id: "veg", label: "Veg 🌿" }, { id: "vegan", label: "Vegan" }, { id: "jain", label: "Jain" }, { id: "egg", label: "Egg" }, { id: "nonveg", label: "Non-Veg" }].map(d => (
                                            <button key={d.id} onClick={() => { setDietFilter(d.id); setJainMode(d.id === "jain"); }}
                                                style={{ ...S.chip, ...(dietFilter === d.id ? S.chipActive : {}), fontSize: 10 }}>
                                                {d.label}
                                            </button>
                                        ))}
                                        <button onClick={() => setFastingFilter(f => f ? null : "navratri")}
                                            style={{ ...S.chip, ...(fastingFilter ? S.chipActive : {}), fontSize: 10 }}>
                                            🙏 Fasting
                                        </button>
                                    </div>
                                    {fastingFilter && (
                                        <div style={{ display: "flex", gap: 5, marginTop: 5 }}>
                                            {["navratri", "ekadashi", "ramzan"].map(ft => (
                                                <button key={ft} onClick={() => setFastingFilter(ft)}
                                                    style={{ ...S.chip, ...(fastingFilter === ft ? S.chipActive : {}), fontSize: 9 }}>
                                                    {ft.charAt(0).toUpperCase() + ft.slice(1)}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Category pills */}
                                <div style={{ padding: "0 1rem 0.5rem" }}>
                                    <div style={{ display: "flex", gap: 5, overflowX: "auto", paddingBottom: 4 }}>
                                        {CATEGORIES.map(cat => (
                                            <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
                                                style={{ ...S.chip, ...(activeCategory === cat.id ? S.chipActive : {}), fontSize: 9 }}>
                                                {cat.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Results */}
                                <div style={S.modalScroll}>
                                    {filteredFoods.length === 0 ? (
                                        <p style={{ color: "#6E6E76", textAlign: "center", fontFamily: "'Be Vietnam Pro'", padding: "2rem 0", fontSize: 14 }}>No foods found. Try a different search or filter.</p>
                                    ) : filteredFoods.map(food => (
                                        <div key={food.id} onClick={() => handleFoodSelect(food)}
                                            style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.7rem 0", borderBottom: "1px solid rgba(90,65,56,0.1)", cursor: "pointer", gap: 12 }}>
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <p style={{ fontFamily: "'Be Vietnam Pro'", fontSize: 14, fontWeight: 600, color: "#EAEAF0", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                                    {food.name}
                                                    {food.containsRootVeg && <span style={{ fontSize: 9, marginLeft: 6, background: "rgba(248,95,27,0.15)", color: "#FFB59B", borderRadius: 4, padding: "1px 5px" }}>Root Veg</span>}
                                                    {food.hasBeverageModifiers && <span style={{ fontSize: 9, marginLeft: 6, background: "rgba(38,146,255,0.15)", color: "#2692FF", borderRadius: 4, padding: "1px 5px" }}>Customisable</span>}
                                                    {food.isFastingFood && <span style={{ fontSize: 9, marginLeft: 6, background: "rgba(53,52,55,0.6)", color: "#E3BFB3", borderRadius: 4, padding: "1px 5px" }}>🙏 Fasting</span>}
                                                </p>
                                                <div style={{ display: "flex", gap: 6, marginTop: 3, flexWrap: "wrap" }}>
                                                    <span style={{ ...S.label, fontSize: 9, color: "#6E6E76" }}>{food.servings[0].label}</span>
                                                    <span style={{ ...S.macroTag, fontSize: 9, padding: "1px 5px" }}>{food.per100g.protein}g P</span>
                                                </div>
                                            </div>
                                            <div style={{ textAlign: "right", flexShrink: 0 }}>
                                                <p style={{ ...S.headline, fontSize: 16, margin: 0, color: "#FFB59B" }}>
                                                    {Math.round(food.per100g.calories * food.servings[0].grams / 100)}
                                                </p>
                                                <p style={{ ...S.label, margin: 0, fontSize: 8 }}>kcal</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}