import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { foodCategories } from '../src/data/foods/foodCategories.js';
import { servingTypes } from '../src/data/foods/servingTypes.js';
import { indianFoods } from '../src/data/foods/indianFoods.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const MIGRATIONS_DIR = path.join(__dirname, '../supabase/migrations');

// Helper to escape SQL strings
const escapeSql = (str) => {
  if (str === null || str === undefined) return 'NULL';
  if (typeof str === 'boolean') return str ? 'TRUE' : 'FALSE';
  if (typeof str === 'number') return str;
  return `'${String(str).replace(/'/g, "''")}'`;
};

// Helper to format Postgres Arrays 
const formatArray = (arr, isEnum = false) => {
  if (!arr || arr.length === 0) return "'{}'";
  
  if (isEnum) {
    // For enums, the syntax ARRAY['item1', 'item2']::enum_type[] works better than curly syntax
    // Wait, curly braces string '{veg, vegan}' works universally in Postgres Text array parsing
    // but requires quotes around enum items if they have special characters. 
    // Best standard way: "'{" + arr.join(',') + "}'"
    return `'{"${arr.join('","')}"}'`;
  }
  
  // For text array
  return `ARRAY[${arr.map(a => escapeSql(a)).join(', ')}]::TEXT[]`;
};

// Start building SQL
let sql = `-- =========================================================================\n`;
sql += `-- SEED DATA: INDIAN FOOD DB\n`;
sql += `-- Generated automatically by scripts/generate_seed.js\n`;
sql += `-- =========================================================================\n\n`;

// 1. Insert Categories
sql += `-- =================== FOOD CATEGORIES ===================\n`;
foodCategories.forEach(cat => {
  sql += `INSERT INTO public.food_categories (id, label) VALUES (${escapeSql(cat.id)}, ${escapeSql(cat.label)}) ON CONFLICT (id) DO NOTHING;\n`;
});
sql += `\n`;

// 2. Insert Standard Servings
sql += `-- =================== STANDARD SERVINGS ===================\n`;
servingTypes.forEach(srv => {
  sql += `INSERT INTO public.standard_servings (id, label, default_grams, used_for) VALUES (${escapeSql(srv.id)}, ${escapeSql(srv.label)}, ${srv.defaultGrams}, ${escapeSql(srv.usedFor)}) ON CONFLICT (id) DO NOTHING;\n`;
});
sql += `\n`;

// 3. Insert Foods
sql += `-- =================== CORE FOOD DATA ===================\n`;
indianFoods.forEach(food => {
  const p = food.per100g;
  
  // Convert JSON to string safely
  const multipliersJson = Object.keys(food.consistencyMultipliers).length > 0 
    ? escapeSql(JSON.stringify(food.consistencyMultipliers)) + '::jsonb'
    : "'{}'::jsonb";

  sql += `
INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams,
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g,
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers,
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers,
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES (
  ${escapeSql(food.id)}, 
  ${escapeSql(food.name)}, 
  ${escapeSql(food.hindiName)}, 
  ${formatArray(food.nameAlt)}, 
  ${formatArray(food.searchTerms)}, 
  ${escapeSql(food.category)}, 
  ${escapeSql(food.subcategory)}, 
  ${escapeSql(food.itemType)}::public.item_type_enum, 
  ${escapeSql(food.state)}::public.food_state_enum, 
  ${escapeSql(food.region)}::public.region_enum, 
  ${food.defaultServingGrams},
  ${p.calories}, ${p.protein}, ${p.carbs}, ${p.fat}, ${p.fiber},
  ${p.sodium || 'NULL'}, ${p.vitaminB12 || 'NULL'}, ${p.vitaminD || 'NULL'}, ${p.iron || 'NULL'}, ${p.calcium || 'NULL'},
  ${formatArray(food.dietTypes, true)}::public.diet_type_enum[], 
  ${formatArray(food.tags)}, 
  ${formatArray(food.fastingTypes, true)}::public.fasting_type_enum[], 
  ${formatArray(food.supportedConsistencyTypes)}, 
  ${multipliersJson},
  ${food.isProcessed}, ${food.isFastingFood}, ${food.isGlutenFree}, ${food.isRecipe}, ${food.containsRootVeg}, ${food.hasBeverageModifiers},
  ${food.gi || 'NULL'}, 
  ${escapeSql(food.cookingOilNote)}, 
  ${food.estimatedOilG}, 
  ${escapeSql(food.source)}::public.source_enum, 
  ${escapeSql(food.confidence)}::public.confidence_enum, 
  ${escapeSql(food.notes)}
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  hindi_name = EXCLUDED.hindi_name,
  name_alt = EXCLUDED.name_alt,
  search_terms = EXCLUDED.search_terms,
  category_id = EXCLUDED.category_id,
  subcategory = EXCLUDED.subcategory,
  item_type = EXCLUDED.item_type,
  state = EXCLUDED.state,
  region = EXCLUDED.region,
  default_serving_grams = EXCLUDED.default_serving_grams,
  cal_per_100g = EXCLUDED.cal_per_100g,
  protein_per_100g = EXCLUDED.protein_per_100g,
  carbs_per_100g = EXCLUDED.carbs_per_100g,
  fat_per_100g = EXCLUDED.fat_per_100g,
  fiber_per_100g = EXCLUDED.fiber_per_100g,
  diet_types = EXCLUDED.diet_types,
  tags = EXCLUDED.tags,
  is_processed = EXCLUDED.is_processed,
  contains_root_veg = EXCLUDED.contains_root_veg;
`;

  // 4. Insert specific Servings for this food
  if (food.servings && food.servings.length > 0) {
    sql += `\n  -- Servings for ${food.id}\n`;
    // We clear old servings in case they were updated
    sql += `  DELETE FROM public.food_servings WHERE food_id = ${escapeSql(food.id)};\n`;
    food.servings.forEach(srv => {
      sql += `  INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES (${escapeSql(food.id)}, ${escapeSql(srv.id)}, ${escapeSql(srv.label)}, ${srv.grams});\n`;
    });
  }
  sql += `\n`;

});

// Determine next migration file timestamp
const timestamp = new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14);
const filename = `${timestamp}_seed_indian_food_batch_7.sql`;
const outputPath = path.join(MIGRATIONS_DIR, filename);

fs.writeFileSync(outputPath, sql);
console.log(`✅ Successfully generated seed migration at: supabase/migrations/${filename}`);
