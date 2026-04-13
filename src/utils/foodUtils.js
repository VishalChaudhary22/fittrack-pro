/**
 * Food Database Utility Functions
 * Used to calculate macros, search foods, and apply modifiers.
 */
import { supabase } from '../lib/supabaseClient';


/**
 * Calculates macros for a given food based on serving type and quantity.
 * 
 * @param {Object} food - The food object from the database
 * @param {String} servingId - The selected serving ID (e.g. 'katori', 'takeaway-container')
 * @param {Number} quantity - The multiple of the serving (e.g. 1.5)
 * @param {String} consistencyType - Optional for dishes: 'thin', 'standard', 'thick'
 * @param {Number} customGrams - Optional for 'custom' serving type
 * @returns {Object} Computed macros (calories, protein, carbs, fat, fiber)
 */
export const calcMacros = (food, servingId, quantity = 1, consistencyType = 'standard', customGrams = null) => {
  if (!food || !food.per100g) return null;

  // 1. Determine base grams for the chosen serving
  let servingGrams = food.defaultServingGrams;
  if (servingId === 'custom' && customGrams) {
    servingGrams = customGrams;
  } else {
    const serving = food.servings?.find(s => s.id === servingId);
    if (serving) {
      // In JS object, we defined food.servings array with grams properties
      servingGrams = serving.grams; 
    }
  }

  // 2. Total grams based on quantity
  const totalGrams = servingGrams * quantity;
  const ratio = totalGrams / 100;

  // 3. Apply consistency multipliers if applicable
  let multiplier = 1.0;
  if (
    food.consistencyMultipliers &&
    consistencyType !== 'standard' &&
    food.consistencyMultipliers[consistencyType]
  ) {
    multiplier = food.consistencyMultipliers[consistencyType];
  }

  // Helper rounding func
  const r = (val) => val === null || val === undefined ? null : Number((val * ratio * multiplier).toFixed(1));

  return {
    grams: Number(totalGrams.toFixed(1)),
    calories: Math.round(food.per100g.calories * ratio * multiplier), // calories usually whole nums
    protein: r(food.per100g.protein),
    carbs: r(food.per100g.carbs),
    fat: r(food.per100g.fat),
    fiber: r(food.per100g.fiber),
    sodium: r(food.per100g.sodium),
    vitaminB12: r(food.per100g.vitaminB12),
    vitaminD: r(food.per100g.vitaminD),
    iron: r(food.per100g.iron),
    calcium: r(food.per100g.calcium)
  };
};

/**
 * Calculates total macros for drinks adopting the Beverage Builder logic (e.g., Chai)
 */
export const calcBeverageMacros = (baseFood, milkModifier = null, sweetenerModifiers = []) => {
  const baseMacros = calcMacros(baseFood, 'cup', 1);

  let addedCal = 0;
  let addedP = 0;
  let addedC = 0;
  let addedF = 0;

  // Milk Modifiers values (approximate per 50ml or 30ml)
  switch (milkModifier) {
    case 'full-fat':
      addedCal += 33; addedP += 1.6; addedC += 2.5; addedF += 3.0; break;
    case 'toned':
      addedCal += 23; addedP += 1.8; addedC += 2.5; addedF += 1.0; break;
    case 'skim':
      addedCal += 17; addedP += 1.8; addedC += 2.6; addedF += 0.1; break;
    case 'condensed':
      addedCal += 90; addedP += 2.0; addedC += 15.0; addedF += 2.5; break;
    default:
      break;
  }

  // Sweetener Modifiers
  sweetenerModifiers.forEach(sw => {
    switch(sw) {
      case 'sugar':
        addedCal += 20; addedC += 5; break; // 1 tsp
      case 'jaggery':
        addedCal += 27; addedC += 7; break; // 1 tsp
      case 'stevia':
        break; // 0 macros
      default: break;
    }
  });

  return {
    calories: baseMacros.calories + addedCal,
    protein: Number((baseMacros.protein + addedP).toFixed(1)),
    carbs: Number((baseMacros.carbs + addedC).toFixed(1)),
    fat: Number((baseMacros.fat + addedF).toFixed(1)),
    fiber: baseMacros.fiber
  };
};

/**
 * Local search function for fuzzy matching arrays of food objects.
 * (If using Supabase remotely, you can instead build a SQL RPC or PostgREST query using their GIN index).
 */
export const searchLocalFoods = (foodsList, query, filters = {}) => {
  const { dietType, fastingType } = filters;
  
  let results = foodsList;

  // 1. Fasting filter
  if (fastingType) {
    results = results.filter(f => f.isFastingFood && f.fastingTypes.includes(fastingType));
  }

  // 2. Jain filter enforces strict constraints universally
  if (dietType === 'jain') {
    results = results.filter(f => !f.containsRootVeg && f.dietTypes.includes('jain'));
  } else if (dietType === 'egg') {
    // Egg category should filter OUT basic veg items like milk
    results = results.filter(f => f.dietTypes.includes('egg') && !f.dietTypes.includes('veg'));
  } else if (dietType === 'nonveg') {
    // Non-veg category should ONLY show meats, not eggs or veg
    results = results.filter(f => f.dietTypes.includes('nonveg') && !f.dietTypes.includes('egg') && !f.dietTypes.includes('veg'));
  } else if (dietType) {
    // Other dietary filters (veg, vegan)
    results = results.filter(f => f.dietTypes.includes(dietType));
  }

  // 3. Query string fuzzy match
  if (query) {
    const q = query.toLowerCase();
    // Short-circuit: require at least 2 chars for meaningful fuzzy matching
    if (q.length < 2) return results;
    results = results.filter(f => {
      if (f.name.toLowerCase().includes(q)) return true;
      if (f.brand && f.brand.toLowerCase().includes(q)) return true;
      if (f.productLine && f.productLine.toLowerCase().includes(q)) return true;
      if (f.hindiName && f.hindiName.includes(q)) return true;
      if (f.nameAlt?.some(alt => alt.toLowerCase().includes(q))) return true;
      if (f.searchTerms?.some(term => term.toLowerCase().includes(q))) return true;
      return false;
    });
  }

  return results;
};

/**
 * Remote search function for fetching foods dynamically from Supabase.
 * Connects to the 'foods' and nested 'food_servings' tables.
 */
export const searchRemoteFoods = async (query, filters = {}) => {
  const { dietType, fastingType } = filters;
  
  let dbQuery = supabase.from('foods').select(`
    *,
    servings:food_servings(
      id:serving_id,
      label,
      grams
    )
  `);

  if (fastingType) {
    dbQuery = dbQuery.eq('is_fasting_food', true)
                     .contains('fasting_types', [fastingType]);
  }

  if (dietType === 'jain') {
    dbQuery = dbQuery.eq('contains_root_veg', false)
                     .contains('diet_types', ['jain']);
  } else if (dietType === 'egg') {
    dbQuery = dbQuery.contains('diet_types', ['egg']).not('diet_types', 'cs', '{"veg"}');
  } else if (dietType === 'nonveg') {
    dbQuery = dbQuery.contains('diet_types', ['nonveg'])
                     .not('diet_types', 'cs', '{"veg"}')
                     .not('diet_types', 'cs', '{"egg"}');
  } else if (dietType && dietType !== 'All') {
    dbQuery = dbQuery.contains('diet_types', [dietType.toLowerCase()]);
  }

  if (query) {
    const q = query.toLowerCase();
    dbQuery = dbQuery.or(`name.ilike.%${q}%,hindi_name.ilike.%${q}%,search_terms.cs.{${q}}`);
  }

  // Limit to 50 results to prevent massive payloads on empty searches
  dbQuery = dbQuery.limit(50);

  const { data, error } = await dbQuery;

  if (error) {
    console.error('Error fetching foods from Supabase:', error);
    return [];
  }

  // Map database snake_case structure to frontend camelCase expectations
  return (data || []).map(f => ({
    id: f.id,
    name: f.name,
    hindiName: f.hindi_name,
    nameAlt: f.name_alt,
    searchTerms: f.search_terms,
    category: f.category_id,
    subcategory: f.subcategory,
    itemType: f.item_type,
    state: f.state,
    region: f.region,
    defaultServingGrams: parseFloat(f.default_serving_grams),
    per100g: {
      calories: parseFloat(f.cal_per_100g),
      protein: parseFloat(f.protein_per_100g),
      carbs: parseFloat(f.carbs_per_100g),
      fat: parseFloat(f.fat_per_100g),
      fiber: parseFloat(f.fiber_per_100g),
      sodium: f.sodium_per_100g ? parseFloat(f.sodium_per_100g) : null,
      vitaminB12: f.vitamin_b12_per_100g ? parseFloat(f.vitamin_b12_per_100g) : null,
      vitaminD: f.vitamin_d_per_100g ? parseFloat(f.vitamin_d_per_100g) : null,
      iron: f.iron_per_100g ? parseFloat(f.iron_per_100g) : null,
      calcium: f.calcium_per_100g ? parseFloat(f.calcium_per_100g) : null
    },
    servings: f.servings || [],
    dietTypes: f.diet_types,
    tags: f.tags,
    fastingTypes: f.fasting_types || [],
    supportedConsistencyTypes: f.supported_consistency_types || [],
    consistencyMultipliers: f.consistency_multipliers || {},
    isProcessed: f.is_processed,
    isFastingFood: f.is_fasting_food,
    isGlutenFree: f.is_gluten_free,
    isRecipe: f.is_recipe,
    containsRootVeg: f.contains_root_veg,
    hasBeverageModifiers: f.has_beverage_modifiers,
    gi: f.gi,
    cookingOilNote: f.cooking_oil_note,
    estimatedOilG: parseFloat(f.estimated_oil_g),
    source: f.source,
    confidence: f.confidence,
    notes: f.notes,
    certifications: f.certifications
  }));
};


/**
 * Fetches ALL foods from Supabase for local caching (hybrid approach).
 * No filters, no limit — returns the full mapped dataset.
 * @returns {Promise<Array>} Array of food objects in camelCase format
 */
export const fetchAllFoods = async () => {
  const { data, error } = await supabase.from('foods').select(`
    *,
    servings:food_servings(
      id:serving_id,
      label,
      grams
    )
  `);

  if (error) {
    console.error('Error fetching all foods from Supabase:', error);
    throw error;
  }

  // Map database snake_case to frontend camelCase (same mapping as searchRemoteFoods)
  return (data || []).map(f => ({
    id: f.id,
    name: f.name,
    hindiName: f.hindi_name,
    nameAlt: f.name_alt,
    searchTerms: f.search_terms,
    category: f.category_id,
    subcategory: f.subcategory,
    itemType: f.item_type,
    state: f.state,
    region: f.region,
    defaultServingGrams: parseFloat(f.default_serving_grams),
    per100g: {
      calories: parseFloat(f.cal_per_100g),
      protein: parseFloat(f.protein_per_100g),
      carbs: parseFloat(f.carbs_per_100g),
      fat: parseFloat(f.fat_per_100g),
      fiber: parseFloat(f.fiber_per_100g),
      sodium: f.sodium_per_100g ? parseFloat(f.sodium_per_100g) : null,
      vitaminB12: f.vitamin_b12_per_100g ? parseFloat(f.vitamin_b12_per_100g) : null,
      vitaminD: f.vitamin_d_per_100g ? parseFloat(f.vitamin_d_per_100g) : null,
      iron: f.iron_per_100g ? parseFloat(f.iron_per_100g) : null,
      calcium: f.calcium_per_100g ? parseFloat(f.calcium_per_100g) : null
    },
    servings: f.servings || [],
    dietTypes: f.diet_types,
    tags: f.tags,
    fastingTypes: f.fasting_types || [],
    supportedConsistencyTypes: f.supported_consistency_types || [],
    consistencyMultipliers: f.consistency_multipliers || {},
    isProcessed: f.is_processed,
    isFastingFood: f.is_fasting_food,
    isGlutenFree: f.is_gluten_free,
    isRecipe: f.is_recipe,
    containsRootVeg: f.contains_root_veg,
    hasBeverageModifiers: f.has_beverage_modifiers,
    gi: f.gi,
    cookingOilNote: f.cooking_oil_note,
    estimatedOilG: parseFloat(f.estimated_oil_g),
    source: f.source,
    confidence: f.confidence,
    notes: f.notes,
    certifications: f.certifications
  }));
};


/**
 * Returns the last N unique foods logged by parsing the foodLog array.
 * @param {Array} foodLog - Array of log entries { foodId, food: {...}, timestamp }
 * @param {Number} n - Number of recent unique foods to return
 * @returns {Array} Array of food objects
 */
export const getRecentFoods = (foodLog = [], n = 5) => {
  const uniqueFoods = new Map();
  // Sort log by newest first
  const sortedLog = [...foodLog].sort((a, b) => new Date(b.timestamp || b.created_at) - new Date(a.timestamp || a.created_at));
  
  for (const entry of sortedLog) {
    const foodId = entry.foodId || (entry.food && entry.food.id);
    if (entry.food && foodId && !uniqueFoods.has(foodId)) {
      uniqueFoods.set(foodId, entry.food);
    }
    if (uniqueFoods.size >= n) break;
  }
  
  return Array.from(uniqueFoods.values());
};

/**
 * Returns the subset of foods that the user has marked as favorite.
 * @param {Array} foodsList - Array of available food objects
 * @param {Array} favoriteIds - Array of food IDs the user has starred
 * @returns {Array} Array of food objects
 */
export const getFavoriteFoods = (foodsList = [], favoriteIds = []) => {
  const favSet = new Set(favoriteIds);
  return foodsList.filter(food => favSet.has(food.id));
};
