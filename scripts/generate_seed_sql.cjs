const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, '../todo_food_listings.md');
const outputPath = path.join(__dirname, '../supabase/migrations/20260522000004_seed_final_751_foods.sql');

const content = fs.readFileSync(inputPath, 'utf8');
const match = content.match(/```javascript([\s\S]*?)```/);

if (!match) {
  console.error("Could not find javascript block in markdown.");
  process.exit(1);
}

const executableCode = match[1].replace(/export const/g, 'const');
const fn = new Function('', `${executableCode}; return foodExpansionListings;`);
let foods = [];
try {
  foods = fn();
} catch (e) {
  console.error("Failed to parse foods array:", e);
  process.exit(1);
}

console.log(`Parsed ${foods.length} items from markdown.`);

const knownSources = new Set(['IFCT-2017', 'FSSAI-label', 'USDA', 'healthifyme', 'curated-estimate', 'off-india', 'indb', 'fatsecret']);
const knownItemTypes = new Set(['base-food', 'dish', 'drink', 'supplement', 'snack', 'packaged-food']);
const knownStates = new Set(['raw', 'cooked', 'fried', 'baked', 'steamed', 'roasted']);
const knownRegions = new Set(['pan-indian', 'north', 'south', 'east', 'west']);
const knownDietTypes = new Set(['vegan', 'veg', 'jain', 'egg', 'nonveg']);
const knownFastingTypes = new Set(['navratri', 'ekadashi', 'jain-paryushana', 'ramzan']);

const missingSources = new Set();
const missingItemTypes = new Set();
const missingStates = new Set();
const missingRegions = new Set();
const missingDietTypes = new Set();
const missingFastingTypes = new Set();

foods.forEach(f => {
  if (f.source && !knownSources.has(f.source)) missingSources.add(f.source);
  if (f.itemType && !knownItemTypes.has(f.itemType)) missingItemTypes.add(f.itemType);
  if (f.state && !knownStates.has(f.state)) missingStates.add(f.state);
  if (f.region && !knownRegions.has(f.region)) missingRegions.add(f.region);

  if (Array.isArray(f.dietTypes)) {
    f.dietTypes.forEach(d => {
      if (!knownDietTypes.has(d)) missingDietTypes.add(d);
    });
  } else if (f.dietTypes && !knownDietTypes.has(f.dietTypes)) {
    missingDietTypes.add(f.dietTypes);
  }

  if (Array.isArray(f.fastingTypes)) {
    f.fastingTypes.forEach(ft => {
      if (!knownFastingTypes.has(ft)) missingFastingTypes.add(ft);
    });
  } else if (f.fastingTypes && !knownFastingTypes.has(f.fastingTypes)) {
    missingFastingTypes.add(f.fastingTypes);
  }
});

function escapeSql(str) {
  if (str === null || str === undefined) return 'NULL';
  if (typeof str === 'boolean') return str ? 'TRUE' : 'FALSE';
  if (typeof str === 'number') return str.toString();
  return "'" + String(str).replace(/'/g, "''") + "'";
}

function pgArray(arr, type = 'text') {
  if (!arr || arr.length === 0) return `'{}'::${type}[]`;
  const escaped = arr.map(item => `"${String(item).replace(/"/g, '\\"')}"`);
  return `'{${escaped.join(',')}}'::${type}[]`;
}

function pgEnumArray(arr, enumType) {
  if (!arr || arr.length === 0) return `'{}'::public.${enumType}[]`;
  return `'{${arr.join(',')}}'::public.${enumType}[]`;
}

let sql = `-- Migration: Seed 751 highly standardized food items
-- Generated automatically from todo_food_listings.md

-- Add Missing ENUM Values (MUST BE OUTSIDE TRANSACTION BLOCK)
COMMIT;

`;

missingSources.forEach(val => {
  sql += `ALTER TYPE public.source_enum ADD VALUE IF NOT EXISTS '${val}';\n`;
});
missingItemTypes.forEach(val => {
  sql += `ALTER TYPE public.item_type_enum ADD VALUE IF NOT EXISTS '${val}';\n`;
});
missingStates.forEach(val => {
  sql += `ALTER TYPE public.food_state_enum ADD VALUE IF NOT EXISTS '${val}';\n`;
});
missingRegions.forEach(val => {
  sql += `ALTER TYPE public.region_enum ADD VALUE IF NOT EXISTS '${val}';\n`;
});
missingDietTypes.forEach(val => {
  sql += `ALTER TYPE public.diet_type_enum ADD VALUE IF NOT EXISTS '${val}';\n`;
});
missingFastingTypes.forEach(val => {
  sql += `ALTER TYPE public.fasting_type_enum ADD VALUE IF NOT EXISTS '${val}';\n`;
});

sql += `
BEGIN;

-- 1. Wipe existing noisy data completely
TRUNCATE TABLE public.foods CASCADE;

`;

// 2. Extract and insert unique categories
const categories = new Map();
foods.forEach(f => {
  if (!categories.has(f.category)) categories.set(f.category, f.category);
});

sql += `-- 2. Insert Categories\n`;
sql += `INSERT INTO public.food_categories (id, label) VALUES\n`;
const catValues = Array.from(categories.keys()).map(c => `(${escapeSql(c)}, ${escapeSql(c)})`);
sql += catValues.join(',\n') + '\nON CONFLICT (id) DO NOTHING;\n\n';

// 3. Extract and insert unique standard servings
const standardServings = new Map();
foods.forEach(f => {
  f.servings.forEach(s => {
    if (!standardServings.has(s.id)) {
      standardServings.set(s.id, { id: s.id, label: s.label, default_grams: s.grams });
    }
  });
});

sql += `-- 3. Insert Standard Servings\n`;
if (standardServings.size > 0) {
  sql += `INSERT INTO public.standard_servings (id, label, default_grams, used_for) VALUES\n`;
  const srvValues = Array.from(standardServings.values()).map(s => 
    `(${escapeSql(s.id)}, ${escapeSql(s.label)}, ${s.default_grams}, 'Auto-generated')`
  );
  sql += srvValues.join(',\n') + '\nON CONFLICT (id) DO NOTHING;\n\n';
}

// 4. Insert Foods
sql += `-- 4. Insert Foods\n`;
sql += `INSERT INTO public.foods (
  id, name, hindi_name, name_alt, search_terms, category_id, subcategory, 
  item_type, state, region, default_serving_grams, 
  cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, 
  sodium_per_100g, vitamin_b12_per_100g, vitamin_d_per_100g, iron_per_100g, calcium_per_100g, 
  diet_types, tags, fasting_types, supported_consistency_types, consistency_multipliers, 
  is_processed, is_fasting_food, is_gluten_free, is_recipe, contains_root_veg, has_beverage_modifiers, 
  gi, cooking_oil_note, estimated_oil_g, source, confidence, notes
) VALUES\n`;

const foodValues = foods.map(f => {
  return `(
    ${escapeSql(f.id)}, ${escapeSql(f.name)}, ${escapeSql(f.hindiName)}, ${pgArray(f.nameAlt)}, ${pgArray(f.searchTerms)}, ${escapeSql(f.category)}, ${escapeSql(f.subcategory)},
    ${escapeSql(f.itemType)}::public.item_type_enum, ${escapeSql(f.state)}::public.food_state_enum, ${escapeSql(f.region)}::public.region_enum, ${f.defaultServingGrams},
    ${f.per100g.calories}, ${f.per100g.protein}, ${f.per100g.carbs}, ${f.per100g.fat}, ${f.per100g.fiber},
    ${f.per100g.sodium || 0}, ${f.per100g.vitaminB12 || 0}, ${f.per100g.vitaminD || 0}, ${f.per100g.iron || 0}, ${f.per100g.calcium || 0},
    ${pgEnumArray(f.dietTypes, 'diet_type_enum')}, ${pgArray(f.tags)}, ${pgEnumArray(f.fastingTypes, 'fasting_type_enum')}, ${pgArray(f.supportedConsistencyTypes)}, '${JSON.stringify(f.consistencyMultipliers || {})}'::jsonb,
    ${f.isProcessed}, ${f.isFastingFood}, ${f.isGlutenFree}, ${f.isRecipe}, ${f.containsRootVeg}, ${f.hasBeverageModifiers},
    ${f.gi || 'NULL'}, ${escapeSql(f.cookingOilNote)}, ${f.estimatedOilG || 0}, ${escapeSql(f.source)}::public.source_enum, ${escapeSql(f.confidence)}::public.confidence_enum, ${escapeSql(f.notes)}
  )`;
});

sql += foodValues.join(',\n') + ';\n\n';

// 5. Insert Food Servings mappings
sql += `-- 5. Insert Food Servings Mappings\n`;
sql += `INSERT INTO public.food_servings (food_id, serving_id, label, grams) VALUES\n`;

let servingMappings = [];
foods.forEach(f => {
  f.servings.forEach(s => {
    servingMappings.push(`(${escapeSql(f.id)}, ${escapeSql(s.id)}, ${escapeSql(s.label)}, ${s.grams})`);
  });
});

sql += servingMappings.join(',\n') + ';\n\n';

sql += `COMMIT;\n`;

fs.writeFileSync(outputPath, sql, 'utf8');
console.log(`Successfully generated migration script at: ${outputPath}`);
