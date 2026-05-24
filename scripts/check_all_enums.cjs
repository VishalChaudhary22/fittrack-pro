const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, '../todo_food_listings.md');
const content = fs.readFileSync(inputPath, 'utf8');
const match = content.match(/```javascript([\s\S]*?)```/);

if (!match) {
  console.error("Could not find javascript block in todo_food_listings.md");
  process.exit(1);
}

const executableCode = match[1].replace(/export const/g, 'const');
const fn = new Function('', `${executableCode}; return foodExpansionListings;`);
let foods = fn();

const dbEnums = {
  diet_type_enum: new Set(['vegan', 'veg', 'jain', 'egg', 'nonveg']),
  fasting_type_enum: new Set(['navratri', 'ekadashi', 'jain-paryushana', 'ramzan']),
  item_type_enum: new Set(['base-food', 'dish', 'drink', 'supplement', 'snack', 'packaged-food']),
  food_state_enum: new Set(['raw', 'cooked', 'fried', 'baked', 'steamed', 'roasted']),
  region_enum: new Set(['pan-indian', 'north', 'south', 'east', 'west']),
  confidence_enum: new Set(['high', 'medium', 'low']),
  source_enum: new Set(['IFCT-2017', 'FSSAI-label', 'USDA', 'healthifyme', 'curated-estimate'])
};

const fileValues = {
  diet_type_enum: new Set(),
  fasting_type_enum: new Set(),
  item_type_enum: new Set(),
  food_state_enum: new Set(),
  region_enum: new Set(),
  confidence_enum: new Set(),
  source_enum: new Set()
};

foods.forEach(f => {
  if (f.source) fileValues.source_enum.add(f.source);
  if (f.confidence) fileValues.confidence_enum.add(f.confidence);
  if (f.itemType) fileValues.item_type_enum.add(f.itemType);
  if (f.state) fileValues.food_state_enum.add(f.state);
  if (f.region) fileValues.region_enum.add(f.region);
  
  if (Array.isArray(f.dietTypes)) {
    f.dietTypes.forEach(d => fileValues.diet_type_enum.add(d));
  } else if (f.dietTypes) {
    fileValues.diet_type_enum.add(f.dietTypes);
  }

  if (Array.isArray(f.fastingTypes)) {
    f.fastingTypes.forEach(ft => fileValues.fasting_type_enum.add(ft));
  } else if (f.fastingTypes) {
    fileValues.fasting_type_enum.add(f.fastingTypes);
  }
});

console.log("=== SCAN RESULTS ===");
for (const [enumName, values] of Object.entries(fileValues)) {
  const initial = dbEnums[enumName];
  const fileArray = Array.from(values);
  const extra = fileArray.filter(v => !initial.has(v));
  
  console.log(`\nEnum: ${enumName}`);
  console.log(`- Unique values in file:`, fileArray);
  console.log(`- EXTRA values not in initial schema:`, extra);
}
