const fs = require('fs');
const path = require('path');

// Read the foods array from src/data/foods/indianFoods.js using eval hack or just require if it were exported, 
// but it's not exported nicely for commonjs (it's typical ES or just defined in a constant).
// Let's read the file and extract the array.
const indianFoodsPath = path.join(__dirname, '../src/data/foods/indianFoods.js');
let fileContent = fs.readFileSync(indianFoodsPath, 'utf8');

// The file has `const indianFoods = [` and ends with `];`. We also export it.
// The file has `export const indianFoods = [` and ends with `];`.
// We can just construct a safe string to eval:

const code = fileContent.replace('export const indianFoods =', 'const indianFoods =') + '\nmodule.exports = indianFoods;';
const moduleObj = { exports: {} };
const wrappedCode = `(function(module, exports) { ${code} })`;
eval(wrappedCode)(moduleObj, moduleObj.exports);

const foods = moduleObj.exports;

console.log(`Validating ${foods.length} foods...\n`);

let errors = 0;
let warnings = 0;
const ids = new Set();

const VALID_CATEGORIES = [
  'grain-cereal', 'roti-bread', 'rice-dish',
  'dal-legume', 'sabzi-veg', 'non-veg',
  'egg', 'dairy', 'breakfast',
  'snack-street', 'sweet-mithai', 'fruit',
  'drink', 'oil-fat', 'condiment',
  'supplement', 'packaged-food', 'millet',
  'sprout-soy', 'fasting-food'
];

foods.forEach((food, index) => {
  const logError = (msg) => { console.error(`❌ [${food.id || index}] ${msg}`); errors++; };
  const logWarn = (msg) => { console.warn(`⚠️ [${food.id || index}] ${msg}`); warnings++; };

  // 1. Unique IDs
  if (!food.id) {
    logError(`Missing ID`);
  } else if (ids.has(food.id)) {
    logError(`Duplicate ID: ${food.id}`);
  } else {
    ids.add(food.id);
  }

  // 2. Valid Category
  if (!VALID_CATEGORIES.includes(food.category)) {
    logError(`Invalid category: ${food.category}`);
  }

  // 3. Macros in sane ranges (per 100g)
  if (!food.per100g) {
    logError(`Missing per100g macro definition`);
  } else {
    const { calories, protein, carbs, fat } = food.per100g;
    if (calories < 0 || calories > 900) logError(`Suspicious calories: ${calories}`);
    if (protein < 0 || protein > 100) logError(`Suspicious protein: ${protein}`);
    if (carbs < 0 || carbs > 100) logError(`Suspicious carbs: ${carbs}`);
    if (fat < 0 || fat > 100) logError(`Suspicious fat: ${fat}`);
    
    // Quick macro match check (protein*4 + carbs*4 + fat*9 should be roughly total calories ± 20%)
    const estimatedCals = (protein * 4) + (carbs * 4) + (fat * 9);
    // Be lenient with missing macro/fiber math:
    const diff = Math.abs(estimatedCals - calories);
    // Ignore cases where diff is small or macros are 0
    if (calories > 10 && diff > (calories * 0.3) && diff > 30) {
      logWarn(`Macros don't add up correctly. Cals: ${calories}, Est: ${estimatedCals.toFixed(0)}`);
    }
  }

  // 4. At least 1 serving
  if (!food.servings || food.servings.length === 0) {
    logError(`No servings defined`);
  }

  // 5. containsRootVeg set for sabzi/dal/snack (warning if missing and expected)
  if (food.category === 'sabzi-veg' || food.category === 'dal-legume') {
    if (food.containsRootVeg === undefined || food.containsRootVeg === null) {
      logError(`containsRootVeg flag is missing for category ${food.category}`);
    }
  }
});

console.log(`\nValidation Complete!`);
console.log(`Total Foods: ${foods.length}`);
console.log(`Errors: ${errors}`);
console.log(`Warnings: ${warnings}`);

if (errors > 0) {
  process.exit(1);
} else {
  console.log('✅ All foods passed strict validation!');
}
