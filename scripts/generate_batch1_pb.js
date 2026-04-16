const fs = require('fs');
const path = require('path');

const pbData = [
  // Pintola
  {
    id: 'pb-pintola-all-natural-crunchy',
    name: 'Pintola All Natural Peanut Butter (Crunchy)',
    nameAlt: ['unsweetened peanut butter'],
    hindiName: 'पिनटोला पीनट बटर (क्रंची)',
    searchTerms: ['pintola', 'all natural', 'peanut butter', 'crunchy', 'unsweetened'],
    category: 'oil-fat',
    subcategory: 'peanut-butter',
    itemType: 'snack',
    state: 'raw',
    region: 'pan-indian',
    defaultServingGrams: 32,
    brand: 'Pintola',
    allergens: ['peanuts'],
    per100g: {
      calories: 600, protein: 30.0, carbs: 18.0, fat: 50.0, fiber: 9.0, sodium: 10,
      vitaminB12: 0, vitaminD: 0, iron: 1.5, calcium: 45
    },
    servings: [
      { id: 'tbsp-1', label: '1 Tbsp', grams: 15 },
      { id: 'tbsp-2', label: '2 Tbsp (Standard)', grams: 32 },
      { id: 'g100', label: '100g', grams: 100 }
    ],
    dietTypes: ['vegan', 'veg', 'jain'],
    tags: ['high-protein', 'high-fat', 'no-added-sugar'],
    isProcessed: true,
    isFastingFood: true,
    fastingTypes: ['navratri', 'ekadashi'],
    isGlutenFree: true,
    isRecipe: false,
    containsRootVeg: false,
    hasBeverageModifiers: false,
    supportedConsistencyTypes: [],
    consistencyMultipliers: {},
    gi: 14,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: 'FSSAI-label',
    confidence: 'high',
    notes: 'No added sugar or salt. 100% roasted peanuts.'
  },
  {
    id: 'pb-pintola-classic-crunchy',
    name: 'Pintola Classic Peanut Butter (Crunchy)',
    nameAlt: ['sweetened peanut butter'],
    hindiName: 'पिनटोला क्लासिक पीनट बटर',
    searchTerms: ['pintola', 'classic', 'peanut butter', 'sweetened', 'crunchy'],
    category: 'oil-fat',
    subcategory: 'peanut-butter',
    itemType: 'snack',
    state: 'raw',
    region: 'pan-indian',
    defaultServingGrams: 32,
    brand: 'Pintola',
    allergens: ['peanuts'],
    per100g: {
      calories: 605, protein: 26.0, carbs: 22.0, fat: 44.6, fiber: 7.2, sodium: 280,
      vitaminB12: 0, vitaminD: 0, iron: 1.2, calcium: 40
    },
    servings: [
      { id: 'tbsp-1', label: '1 Tbsp', grams: 15 },
      { id: 'tbsp-2', label: '2 Tbsp (Standard)', grams: 32 },
      { id: 'g100', label: '100g', grams: 100 }
    ],
    dietTypes: ['veg', 'vegan'],
    tags: ['high-fat', 'high-calorie'],
    isProcessed: true,
    isFastingFood: false,
    fastingTypes: [],
    isGlutenFree: true,
    isRecipe: false,
    containsRootVeg: false,
    hasBeverageModifiers: false,
    supportedConsistencyTypes: [],
    consistencyMultipliers: {},
    gi: 25,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: 'FSSAI-label',
    confidence: 'high',
    notes: 'Contains added sugar and salt.'
  },
  {
    id: 'pb-pintola-high-protein-dark-choco',
    name: 'Pintola High Protein Dark Chocolate Peanut Butter',
    nameAlt: ['whey peanut butter'],
    hindiName: 'पिनटोला हाई प्रोटीन पीनट बटर',
    searchTerms: ['pintola', 'high protein', 'dark chocolate', 'whey'],
    category: 'supplement',
    subcategory: 'peanut-butter',
    itemType: 'supplement',
    state: 'raw',
    region: 'pan-indian',
    defaultServingGrams: 32,
    brand: 'Pintola',
    allergens: ['peanuts', 'milk', 'soy'],
    per100g: {
      calories: 583, protein: 30.0, carbs: 36.0, fat: 38.0, fiber: 6.2, sodium: 120,
      vitaminB12: 0, vitaminD: 0, iron: 2.0, calcium: 60
    },
    servings: [
      { id: 'tbsp-1', label: '1 Tbsp', grams: 15 },
      { id: 'tbsp-2', label: '2 Tbsp (Standard)', grams: 32 },
      { id: 'g100', label: '100g', grams: 100 }
    ],
    dietTypes: ['veg'],
    tags: ['very-high-protein', 'high-sugar'],
    isProcessed: true,
    isFastingFood: false,
    fastingTypes: [],
    isGlutenFree: true,
    isRecipe: false,
    containsRootVeg: false,
    hasBeverageModifiers: false,
    supportedConsistencyTypes: [],
    consistencyMultipliers: {},
    gi: 35,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: 'FSSAI-label',
    confidence: 'high',
    notes: 'Fortified with whey protein concentrate.'
  },
  
  // MyFitness
  {
    id: 'pb-myfitness-original-crunchy',
    name: 'MyFitness Original Peanut Butter (Crunchy)',
    nameAlt: ['my fitness classic peanut butter'],
    hindiName: 'मायफिटनेस पीनट बटर',
    searchTerms: ['myfitness', 'original', 'peanut butter', 'crunchy', 'sweetened'],
    category: 'oil-fat',
    subcategory: 'peanut-butter',
    itemType: 'snack',
    state: 'raw',
    region: 'pan-indian',
    defaultServingGrams: 32,
    brand: 'MyFitness',
    allergens: ['peanuts', 'soy'],
    per100g: {
      calories: 620, protein: 26.0, carbs: 19.0, fat: 46.0, fiber: 6.0, sodium: 300,
      vitaminB12: 0, vitaminD: 0, iron: 1.1, calcium: 35
    },
    servings: [
       { id: 'tbsp-1', label: '1 Tbsp', grams: 15 },
       { id: 'tbsp-2', label: '2 Tbsp (Standard)', grams: 32 },
       { id: 'g100', label: '100g', grams: 100 }
    ],
    dietTypes: ['veg', 'vegan'],
    tags: ['high-protein', 'high-fat'],
    isProcessed: true,
    isFastingFood: false,
    fastingTypes: [],
    isGlutenFree: true,
    isRecipe: false,
    containsRootVeg: false,
    hasBeverageModifiers: false,
    supportedConsistencyTypes: [],
    consistencyMultipliers: {},
    gi: 25,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: 'FSSAI-label',
    confidence: 'high',
    notes: 'Contains sugar, salt and permitted stabilizing agent (INS 471).'
  },
  {
    id: 'pb-myfitness-chocolate-crispy',
    name: 'MyFitness Chocolate Peanut Butter (Crispy)',
    nameAlt: ['chocolate peanut butter my fitness'],
    hindiName: 'मायफिटनेस चॉकलेट पीनट बटर',
    searchTerms: ['myfitness', 'chocolate', 'peanut butter', 'crispy'],
    category: 'oil-fat',
    subcategory: 'peanut-butter',
    itemType: 'snack',
    state: 'raw',
    region: 'pan-indian',
    defaultServingGrams: 30,
    brand: 'MyFitness',
    allergens: ['peanuts', 'soy'],
    per100g: {
      calories: 630, protein: 24.0, carbs: 30.0, fat: 50.0, fiber: 10.0, sodium: 186,
      vitaminB12: 0, vitaminD: 0, iron: 1.5, calcium: 40
    },
    servings: [
       { id: 'tbsp-1', label: '1 Tbsp', grams: 15 },
       { id: 'tbsp-2', label: '2 Tbsp (Standard)', grams: 30 },
       { id: 'g100', label: '100g', grams: 100 }
    ],
    dietTypes: ['veg'],
    tags: ['high-sugar', 'high-fat'],
    isProcessed: true,
    isFastingFood: false,
    fastingTypes: [],
    isGlutenFree: true,
    isRecipe: false,
    containsRootVeg: false,
    hasBeverageModifiers: false,
    supportedConsistencyTypes: [],
    consistencyMultipliers: {},
    gi: 38,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: 'FSSAI-label',
    confidence: 'high',
    notes: 'Includes added rice crisps for texture.'
  },

  // Alpino
  {
    id: 'pb-alpino-natural-crunch-unsweet',
    name: 'Alpino Natural Peanut Butter (Crunchy)',
    nameAlt: ['alpino unsweetened'],
    hindiName: 'अल्पिनो नेचुरल पीनट बटर',
    searchTerms: ['alpino', 'natural', 'peanut butter', 'crunchy', 'unsweetened'],
    category: 'oil-fat',
    subcategory: 'peanut-butter',
    itemType: 'snack',
    state: 'raw',
    region: 'pan-indian',
    defaultServingGrams: 32,
    brand: 'Alpino',
    allergens: ['peanuts'],
    per100g: {
      calories: 625, protein: 30.0, carbs: 18.0, fat: 49.0, fiber: 9.0, sodium: 25,
      vitaminB12: 0, vitaminD: 0, iron: 1.5, calcium: 40
    },
    servings: [
      { id: 'tbsp-1', label: '1 Tbsp', grams: 15 },
      { id: 'tbsp-2', label: '2 Tbsp (Standard)', grams: 32 },
      { id: 'g100', label: '100g', grams: 100 }
    ],
    dietTypes: ['vegan', 'veg', 'jain'],
    tags: ['high-protein', 'high-fat', 'no-added-sugar'],
    isProcessed: true,
    isFastingFood: true,
    fastingTypes: ['navratri', 'ekadashi'],
    isGlutenFree: true,
    isRecipe: false,
    containsRootVeg: false,
    hasBeverageModifiers: false,
    supportedConsistencyTypes: [],
    consistencyMultipliers: {},
    gi: 14,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: 'FSSAI-label',
    confidence: 'high',
    notes: '100% roasted peanuts.'
  },
  
  // Sundrop
  {
    id: 'pb-sundrop-crunchy',
    name: 'Sundrop Peanut Butter (Crunchy)',
    nameAlt: ['sundrop regular peanut butter'],
    hindiName: 'सनड्रॉप पीनट बटर (क्रंची)',
    searchTerms: ['sundrop', 'peanut butter', 'crunchy', 'sweetened'],
    category: 'oil-fat',
    subcategory: 'peanut-butter',
    itemType: 'snack',
    state: 'raw',
    region: 'pan-indian',
    defaultServingGrams: 30,
    brand: 'Sundrop',
    allergens: ['peanuts', 'soy'],
    per100g: {
      calories: 600, protein: 26.0, carbs: 20.0, fat: 45.0, fiber: 6.0, sodium: 320,
      vitaminB12: 0, vitaminD: 0, iron: 1.0, calcium: 35
    },
    servings: [
      { id: 'tbsp-1', label: '1 Tbsp', grams: 15 },
      { id: 'tbsp-2', label: '2 Tbsp (Standard)', grams: 30 },
      { id: 'g100', label: '100g', grams: 100 }
    ],
    dietTypes: ['veg'],
    tags: ['high-fat', 'high-calorie'],
    isProcessed: true,
    isFastingFood: false,
    fastingTypes: [],
    isGlutenFree: true,
    isRecipe: false,
    containsRootVeg: false,
    hasBeverageModifiers: false,
    supportedConsistencyTypes: [],
    consistencyMultipliers: {},
    gi: 28,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: 'FSSAI-label',
    confidence: 'high',
    notes: 'Classic sweetened PB.'
  },

  // MuscleBlaze
  {
    id: 'pb-muscleblaze-high-protein-dark-choco',
    name: 'MuscleBlaze High Protein Peanut Butter (Dark Choco)',
    nameAlt: ['mb peanut butter'],
    hindiName: 'मसलब्लेज़ हाई प्रोटीन पीनट बटर',
    searchTerms: ['muscleblaze', 'mb', 'high protein', 'peanut butter', 'dark chocolate'],
    category: 'supplement',
    subcategory: 'peanut-butter',
    itemType: 'supplement',
    state: 'raw',
    region: 'pan-indian',
    defaultServingGrams: 30,
    brand: 'MuscleBlaze',
    allergens: ['peanuts', 'milk', 'soy'],
    per100g: {
      calories: 590, protein: 30.0, carbs: 25.0, fat: 42.0, fiber: 5.0, sodium: 100,
      vitaminB12: 0, vitaminD: 0, iron: 1.5, calcium: 50
    },
    servings: [
      { id: 'tbsp-1', label: '1 Tbsp', grams: 15 },
      { id: 'tbsp-2', label: '2 Tbsp (Standard)', grams: 30 },
      { id: 'g100', label: '100g', grams: 100 }
    ],
    dietTypes: ['veg'],
    tags: ['very-high-protein'],
    isProcessed: true,
    isFastingFood: false,
    fastingTypes: [],
    isGlutenFree: true,
    isRecipe: false,
    containsRootVeg: false,
    hasBeverageModifiers: false,
    supportedConsistencyTypes: [],
    consistencyMultipliers: {},
    gi: 30,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: 'FSSAI-label',
    confidence: 'high',
    notes: 'Added whey protein.'
  }
];

const dbPath = path.join(__dirname, '../src/data/foods/indianFoods.js');
let dbContent = fs.readFileSync(dbPath, 'utf8');

// The file ends with ];
// We will replace the last ]; with our new items

const insertPattern = /\];\s*$/;

let newContentString = `\n  // ==========================================\n  // BRAND FOODS: BATCH B1 - Peanut Butters\n  // ==========================================\n`;

pbData.forEach(item => {
  newContentString += `  ${JSON.stringify(item, null, 2).replace(/\n/g, '\n  ')},\n`;
});

// Remove trailing comma
newContentString = newContentString.replace(/,\n$/, '\n');

// Append to the array
const finalContent = dbContent.replace(insertPattern, newContentString + '];\n');

fs.writeFileSync(dbPath, finalContent, 'utf8');
console.log('Successfully added Batch B1 Brand Foods to indianFoods.js!');
