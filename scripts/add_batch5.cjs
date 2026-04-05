const fs = require('fs');
const path = require('path');

const batch5Foods = [
  // ==========================================
  // BATCH 5: Sweets & Mithai
  // ==========================================
  {
    id: 'gulab-jamun',
    name: 'Gulab Jamun',
    nameAlt: ['jamun', 'kala jamun'],
    hindiName: 'गुलाब जामुन',
    searchTerms: ['gulab', 'jamun', 'kala jamun', 'sweet'],
    category: 'sweet-mithai',
    subcategory: 'milk-sweet',
    itemType: 'dish',
    state: 'fried',
    region: 'pan-indian',
    defaultServingGrams: 50,
    per100g: {
      calories: 320,
      protein: 6.0,
      carbs: 55.0,
      fat: 10.0,
      fiber: 0.5,
      sodium: 50,
      vitaminB12: 0,
      vitaminD: 0,
      iron: 0.5,
      calcium: 50
    },
    servings: [
      { id: 'piece', label: '1 piece', grams: 50 },
      { id: 'g100', label: '100g', grams: 100 }
    ],
    dietTypes: ['veg', 'jain', 'nonveg'],
    tags: ['snack', 'high-sugar'],
    isProcessed: false,
    isFastingFood: false,
    fastingTypes: [],
    isGlutenFree: false, // Made with maida usually
    isRecipe: false,
    containsRootVeg: false,
    hasBeverageModifiers: false,
    supportedConsistencyTypes: [],
    consistencyMultipliers: {},
    gi: 75,
    cookingOilNote: 'Deep fried in oil or ghee, then soaked in sugar syrup.',
    estimatedOilG: 8,
    source: 'healthifyme',
    confidence: 'high',
    notes: 'Very high sugar and calorie content.'
  },
  {
    id: 'rasgulla',
    name: 'Rasgulla',
    nameAlt: ['roshogolla', 'rasagolla'],
    hindiName: 'रसगुल्ला',
    searchTerms: ['rasgulla', 'roshogolla', 'sponge rasgulla', 'sweet'],
    category: 'sweet-mithai',
    subcategory: 'milk-sweet',
    itemType: 'dish',
    state: 'cooked',
    region: 'east',
    defaultServingGrams: 50,
    per100g: {
      calories: 186,
      protein: 4.5,
      carbs: 40.0,
      fat: 1.5,
      fiber: 0.1,
      sodium: 20,
      vitaminB12: 0.2, // from chhena
      vitaminD: 0,
      iron: 0.1,
      calcium: 80
    },
    servings: [
      { id: 'piece', label: '1 piece', grams: 50 },
      { id: 'g100', label: '100g', grams: 100 }
    ],
    dietTypes: ['veg', 'jain', 'nonveg'],
    tags: ['snack', 'high-sugar', 'low-fat'],
    isProcessed: false,
    isFastingFood: false,
    fastingTypes: [],
    isGlutenFree: true,
    isRecipe: false,
    containsRootVeg: false,
    hasBeverageModifiers: false,
    supportedConsistencyTypes: [],
    consistencyMultipliers: {},
    gi: 65,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: 'healthifyme',
    confidence: 'high',
    notes: 'Lower in fat than most Indian sweets because it is boiled, not fried. Calories come mostly from sugar syrup.'
  },
  {
    id: 'besan-ladoo',
    name: 'Besan Ladoo',
    nameAlt: ['basen laddu'],
    hindiName: 'बेसन के लड्डू',
    searchTerms: ['besan', 'ladoo', 'laddu', 'sweet'],
    category: 'sweet-mithai',
    subcategory: 'dry-sweet',
    itemType: 'dish',
    state: 'cooked',
    region: 'pan-indian',
    defaultServingGrams: 40,
    per100g: {
      calories: 485,
      protein: 10.0,
      carbs: 55.0,
      fat: 25.0,
      fiber: 3.5,
      sodium: 10,
      vitaminB12: 0,
      vitaminD: 0,
      iron: 2.0,
      calcium: 30
    },
    servings: [
      { id: 'piece', label: '1 piece', grams: 40 },
      { id: 'g100', label: '100g', grams: 100 }
    ],
    dietTypes: ['veg', 'jain', 'nonveg'],
    tags: ['snack', 'high-calorie', 'high-fat', 'high-sugar'],
    isProcessed: false,
    isFastingFood: false,
    fastingTypes: [],
    isGlutenFree: true,
    isRecipe: false,
    containsRootVeg: false,
    hasBeverageModifiers: false,
    supportedConsistencyTypes: [],
    consistencyMultipliers: {},
    gi: 60,
    cookingOilNote: 'Very high ghee content.',
    estimatedOilG: 10, // per piece
    source: 'healthifyme',
    confidence: 'medium',
    notes: 'Calorie dense due to heavy use of ghee.'
  },
  {
    id: 'motichoor-ladoo',
    name: 'Motichoor Ladoo',
    nameAlt: ['boondi laddu', 'motichur'],
    hindiName: 'मोतीचूर के लड्डू',
    searchTerms: ['motichoor', 'ladoo', 'laddu', 'boondi'],
    category: 'sweet-mithai',
    subcategory: 'dry-sweet',
    itemType: 'dish',
    state: 'fried',
    region: 'north',
    defaultServingGrams: 40,
    per100g: {
      calories: 450,
      protein: 4.0,
      carbs: 65.0,
      fat: 20.0,
      fiber: 1.5,
      sodium: 15,
      vitaminB12: 0,
      vitaminD: 0,
      iron: 1.0,
      calcium: 20
    },
    servings: [
      { id: 'piece', label: '1 piece', grams: 40 },
      { id: 'g100', label: '100g', grams: 100 }
    ],
    dietTypes: ['veg', 'jain', 'nonveg'],
    tags: ['snack', 'high-sugar', 'high-fat'],
    isProcessed: false,
    isFastingFood: false,
    fastingTypes: [],
    isGlutenFree: true,
    isRecipe: false,
    containsRootVeg: false,
    hasBeverageModifiers: false,
    supportedConsistencyTypes: [],
    consistencyMultipliers: {},
    gi: 70,
    cookingOilNote: 'Boondi is deep fried in ghee/oil before shaping.',
    estimatedOilG: 8,
    source: 'healthifyme',
    confidence: 'medium',
  },
  {
    id: 'kaju-katli',
    name: 'Kaju Katli (Cashew Fudge)',
    nameAlt: ['kaju barfi'],
    hindiName: 'काजू कतली',
    searchTerms: ['kaju', 'katli', 'barfi', 'cashew sweet'],
    category: 'sweet-mithai',
    subcategory: 'dry-sweet',
    itemType: 'dish',
    state: 'cooked',
    region: 'pan-indian',
    defaultServingGrams: 15, // usually quite small/thin
    per100g: {
      calories: 450,
      protein: 10.0,
      carbs: 55.0,
      fat: 22.0,
      fiber: 2.0,
      sodium: 10,
      vitaminB12: 0,
      vitaminD: 0,
      iron: 3.0,
      calcium: 30
    },
    servings: [
      { id: 'piece', label: '1 piece', grams: 15 },
      { id: 'g100', label: '100g', grams: 100 }
    ],
    dietTypes: ['vegan', 'veg', 'jain', 'nonveg'], // often no milk used
    tags: ['snack', 'high-sugar', 'high-fat', 'premium'],
    isProcessed: false,
    isFastingFood: true,
    fastingTypes: ['navratri', 'ekadashi', 'jain-paryushana'],
    isGlutenFree: true,
    isRecipe: false,
    containsRootVeg: false,
    hasBeverageModifiers: false,
    supportedConsistencyTypes: [],
    consistencyMultipliers: {},
    gi: 50, // cashews lower the GI compared to pure sugar treats
    cookingOilNote: null,
    estimatedOilG: 0,
    source: 'healthifyme',
    confidence: 'high',
    notes: 'About 60-70 calories per piece.'
  },
  {
    id: 'jalebi',
    name: 'Jalebi',
    nameAlt: ['jilebi', 'imarti'],
    hindiName: 'जलेबी',
    searchTerms: ['jalebi', 'jilbi', 'sweet', 'imarti'],
    category: 'sweet-mithai',
    subcategory: 'fried-sweet',
    itemType: 'dish',
    state: 'fried',
    region: 'pan-indian',
    defaultServingGrams: 50,
    per100g: {
      calories: 380,
      protein: 3.0,
      carbs: 70.0,
      fat: 10.5,
      fiber: 0.5,
      sodium: 5,
      vitaminB12: 0,
      vitaminD: 0,
      iron: 0.5,
      calcium: 15
    },
    servings: [
      { id: 'piece', label: '1 medium piece', grams: 50 },
      { id: 'g100', label: '100g', grams: 100 }
    ],
    dietTypes: ['veg', 'jain', 'nonveg'], // fermented batter has curd
    tags: ['snack', 'high-sugar', 'high-carb'],
    isProcessed: false,
    isFastingFood: false,
    fastingTypes: [],
    isGlutenFree: false, // maida
    isRecipe: false,
    containsRootVeg: false,
    hasBeverageModifiers: false,
    supportedConsistencyTypes: [],
    consistencyMultipliers: {},
    gi: 80,
    cookingOilNote: 'Deep fried and soaked in sugar syrup.',
    estimatedOilG: 5, // per 50g
    source: 'healthifyme',
    confidence: 'medium',
  },
  // ==========================================
  // BATCH 5: Fruits & Nuts
  // ==========================================
  {
    id: 'banana-raw',
    name: 'Banana (Raw / Ripe)',
    nameAlt: ['kela'],
    hindiName: 'केला',
    searchTerms: ['banana', 'kela', 'fruit'],
    category: 'fruit',
    subcategory: 'fresh-fruit',
    itemType: 'base-food',
    state: 'raw',
    region: 'pan-indian',
    defaultServingGrams: 120, // 1 medium banana
    per100g: {
      calories: 89,
      protein: 1.1,
      carbs: 22.8,
      fat: 0.3,
      fiber: 2.6,
      sodium: 1,
      vitaminB12: 0,
      vitaminD: 0,
      iron: 0.3,
      calcium: 5
    },
    servings: [
      { id: 'medium', label: '1 medium', grams: 120 },
      { id: 'g100', label: '100g', grams: 100 }
    ],
    dietTypes: ['vegan', 'veg', 'jain', 'nonveg'],
    tags: ['snack', 'pre-workout', 'high-carb', 'budget-friendly'],
    isProcessed: false,
    isFastingFood: true,
    fastingTypes: ['navratri', 'ekadashi', 'jain-paryushana', 'ramzan'],
    isGlutenFree: true,
    isRecipe: false,
    containsRootVeg: false,
    hasBeverageModifiers: false,
    supportedConsistencyTypes: [],
    consistencyMultipliers: {},
    gi: 52,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: 'USDA',
    confidence: 'high',
    notes: 'Excellent pre-workout carb source. Value excludes peel.'
  },
  {
    id: 'mango-raw',
    name: 'Mango (Ripe)',
    nameAlt: ['aam'],
    hindiName: 'आम',
    searchTerms: ['mango', 'aam', 'fruit', 'alphonso'],
    category: 'fruit',
    subcategory: 'fresh-fruit',
    itemType: 'base-food',
    state: 'raw',
    region: 'pan-indian',
    defaultServingGrams: 200, // Flesh of 1 medium mango
    per100g: {
      calories: 60,
      protein: 0.8,
      carbs: 15.0,
      fat: 0.4,
      fiber: 1.6,
      sodium: 1,
      vitaminB12: 0,
      vitaminD: 0,
      iron: 0.2,
      calcium: 11
    },
    servings: [
      { id: 'medium', label: '1 medium (flesh only)', grams: 200 },
      { id: 'katori', label: '1 katori (cubed)', grams: 150 },
      { id: 'g100', label: '100g', grams: 100 }
    ],
    dietTypes: ['vegan', 'veg', 'jain', 'nonveg'],
    tags: ['snack', 'high-sugar'],
    isProcessed: false,
    isFastingFood: true,
    fastingTypes: ['navratri', 'ekadashi', 'jain-paryushana', 'ramzan'],
    isGlutenFree: true,
    isRecipe: false,
    containsRootVeg: false,
    hasBeverageModifiers: false,
    supportedConsistencyTypes: [],
    consistencyMultipliers: {},
    gi: 51,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: 'USDA',
    confidence: 'high',
  },
  {
    id: 'almonds-raw',
    name: 'Almonds (Badam, Raw)',
    nameAlt: ['badam'],
    hindiName: 'बादाम',
    searchTerms: ['almond', 'badam', 'nuts', 'dry fruit'],
    category: 'fruit',
    subcategory: 'dry-fruits-nuts',
    itemType: 'base-food',
    state: 'raw',
    region: 'pan-indian',
    defaultServingGrams: 30, // handful
    per100g: {
      calories: 579,
      protein: 21.2,
      carbs: 21.7,
      fat: 49.9,
      fiber: 12.5,
      sodium: 1,
      vitaminB12: 0,
      vitaminD: 0,
      iron: 3.7,
      calcium: 269
    },
    servings: [
      { id: 'handful', label: '1 handful', grams: 30 },
      { id: 'piece', label: '5 pieces', grams: 6 },
      { id: 'g100', label: '100g', grams: 100 }
    ],
    dietTypes: ['vegan', 'veg', 'jain', 'nonveg'],
    tags: ['snack', 'high-fat', 'high-protein', 'healthy-fats'],
    isProcessed: false,
    isFastingFood: true,
    fastingTypes: ['navratri', 'ekadashi', 'jain-paryushana', 'ramzan'],
    isGlutenFree: true,
    isRecipe: false,
    containsRootVeg: false,
    hasBeverageModifiers: false,
    supportedConsistencyTypes: [],
    consistencyMultipliers: {},
    gi: 0,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: 'USDA',
    confidence: 'high',
  },
  {
    id: 'dates-khajoor',
    name: 'Dates (Khajoor, Dried)',
    nameAlt: ['khajur', 'pind khajoor'],
    hindiName: 'खजूर',
    searchTerms: ['dates', 'khajoor', 'khajur', 'dry fruit'],
    category: 'fruit',
    subcategory: 'dry-fruits-nuts',
    itemType: 'base-food',
    state: 'raw', // dried
    region: 'pan-indian',
    defaultServingGrams: 24, // Approx 3 dates
    per100g: {
      calories: 277,
      protein: 1.8,
      carbs: 75.0,
      fat: 0.2,
      fiber: 8.0,
      sodium: 1,
      vitaminB12: 0,
      vitaminD: 0,
      iron: 1.0,
      calcium: 64
    },
    servings: [
      { id: 'piece', label: '1 date (pitted)', grams: 8 },
      { id: 'g100', label: '100g', grams: 100 }
    ],
    dietTypes: ['vegan', 'veg', 'jain', 'nonveg'],
    tags: ['snack', 'pre-workout', 'high-sugar'],
    isProcessed: false,
    isFastingFood: true,
    fastingTypes: ['navratri', 'ekadashi', 'jain-paryushana', 'ramzan'],
    isGlutenFree: true,
    isRecipe: false,
    containsRootVeg: false,
    hasBeverageModifiers: false,
    supportedConsistencyTypes: [],
    consistencyMultipliers: {},
    gi: 42,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: 'USDA',
    confidence: 'high',
    notes: 'Excellent natural pre-workout energy. Staple for Ramzan iftar.'
  },
  // ==========================================
  // BATCH 5: Drinks & Beverages
  // ==========================================
  {
    id: 'chai-base',
    name: 'Chai (Base — Black Tea)',
    nameAlt: ['chai', 'tea black', 'plain tea'],
    hindiName: 'चाय',
    searchTerms: ['chai', 'tea', 'black tea'],
    category: 'drink',
    subcategory: 'tea-coffee',
    itemType: 'drink',
    state: 'cooked',
    region: 'pan-indian',
    defaultServingGrams: 150, // 1 cup
    per100g: {
      calories: 2,
      protein: 0.1,
      carbs: 0.3,
      fat: 0,
      fiber: 0,
      sodium: 4,
      vitaminB12: 0,
      vitaminD: 0,
      iron: 0.1,
      calcium: 0
    },
    servings: [
      { id: 'cup', label: '1 cup (150ml)', grams: 150 },
      { id: 'glass', label: '1 tall glass', grams: 250 },
      { id: 'g100', label: '100ml', grams: 100 }
    ],
    dietTypes: ['vegan', 'veg', 'jain', 'nonveg'],
    tags: ['breakfast', 'snack', 'low-calorie'],
    isProcessed: false,
    isFastingFood: true,
    fastingTypes: ['navratri', 'ekadashi', 'jain-paryushana', 'ramzan'],
    isGlutenFree: true,
    isRecipe: false,
    containsRootVeg: false,
    hasBeverageModifiers: true, // Triggers Milk/Sugar builder in FoodLogPage
    supportedConsistencyTypes: [],
    consistencyMultipliers: {},
    gi: 0,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: 'USDA',
    confidence: 'high',
    notes: 'Base values only. Use the Beverage Builder to add milk and sugar.'
  },
  {
    id: 'coffee-black',
    name: 'Black Coffee (Base)',
    nameAlt: ['filter coffee base', 'nescafe black'],
    hindiName: 'ब्लैक कॉफ़ी',
    searchTerms: ['coffee', 'black coffee', 'americano', 'nescafe'],
    category: 'drink',
    subcategory: 'tea-coffee',
    itemType: 'drink',
    state: 'cooked',
    region: 'pan-indian',
    defaultServingGrams: 150,
    per100g: {
      calories: 2,
      protein: 0.3,
      carbs: 0.3,
      fat: 0,
      fiber: 0,
      sodium: 2,
      vitaminB12: 0,
      vitaminD: 0,
      iron: 0,
      calcium: 2
    },
    servings: [
      { id: 'cup', label: '1 cup (150ml)', grams: 150 },
      { id: 'glass', label: '1 tall glass', grams: 250 },
      { id: 'g100', label: '100ml', grams: 100 }
    ],
    dietTypes: ['vegan', 'veg', 'jain', 'nonveg'],
    tags: ['breakfast', 'pre-workout', 'low-calorie'],
    isProcessed: false,
    isFastingFood: true,
    fastingTypes: ['navratri', 'ekadashi', 'jain-paryushana'],
    isGlutenFree: true,
    isRecipe: false,
    containsRootVeg: false,
    hasBeverageModifiers: true, // Triggers Milk/Sugar builder
    supportedConsistencyTypes: [],
    consistencyMultipliers: {},
    gi: 0,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: 'USDA',
    confidence: 'high',
  },
  {
    id: 'haldi-doodh-base',
    name: 'Haldi Doodh (Base — Turmeric Water/Mix)',
    nameAlt: ['turmeric latte base', 'golden milk base'],
    hindiName: 'हल्दी दूध बेस',
    searchTerms: ['haldi', 'doodh', 'turmeric', 'golden milk'],
    category: 'drink',
    subcategory: 'milk-based',
    itemType: 'drink',
    state: 'cooked',
    region: 'pan-indian',
    defaultServingGrams: 150,
    per100g: {
      // Just the turmeric and minor spices
      calories: 5,
      protein: 0.2,
      carbs: 1.0,
      fat: 0.1,
      fiber: 0.5,
      sodium: 2,
      vitaminB12: 0,
      vitaminD: 0,
      iron: 0.5,
      calcium: 5
    },
    servings: [
      { id: 'glass', label: '1 glass (200ml)', grams: 200 },
      { id: 'cup', label: '1 cup', grams: 150 },
      { id: 'g100', label: '100ml', grams: 100 }
    ],
    dietTypes: ['veg', 'jain', 'nonveg'],
    tags: ['before-bed', 'immunity', 'low-calorie'],
    isProcessed: false,
    isFastingFood: true,
    fastingTypes: ['navratri', 'ekadashi'],
    isGlutenFree: true,
    isRecipe: false,
    containsRootVeg: false, // Turmeric is rhizome but usually allowed, but strictly ginger/haldi can be debated in Jainism; we assume dry powder is fine for most. Let's keep false.
    hasBeverageModifiers: true, // Triggers Milk/Sugar builder
    supportedConsistencyTypes: [],
    consistencyMultipliers: {},
    gi: 0,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: 'curated-estimate',
    confidence: 'medium',
    notes: 'Base values for haldi+water. Must add milk and sugar/honey via Beverage Builder.'
  },
  {
    id: 'sattu-sharbat',
    name: 'Sattu Sharbat (Namkeen/Salty)',
    nameAlt: ['sattu drink', 'sattu cooler'],
    hindiName: 'सत्तू शर्बत',
    searchTerms: ['sattu', 'sharbat', 'drink', 'desi protein shake'],
    category: 'drink',
    subcategory: 'cooling',
    itemType: 'dish', // composite
    state: 'raw',
    region: 'north',
    defaultServingGrams: 300, // 300ml glass
    per100g: {
      calories: 45, // Roughly 10-12g sattu per 100ml water
      protein: 2.2,
      carbs: 7.5,
      fat: 0.7,
      fiber: 2.0,
      sodium: 120, // kala namak
      vitaminB12: 0,
      vitaminD: 0,
      iron: 0.8,
      calcium: 15
    },
    servings: [
      { id: 'glass', label: '1 tall glass (300ml)', grams: 300 },
      { id: 'g100', label: '100ml', grams: 100 }
    ],
    dietTypes: ['vegan', 'veg', 'jain', 'nonveg'],
    tags: ['snack', 'high-protein', 'cooling', 'budget-friendly'],
    isProcessed: false,
    isFastingFood: false, // Bengal gram is a legume, not allowed in strict vrat
    fastingTypes: [],
    isGlutenFree: true,
    isRecipe: false,
    containsRootVeg: true, // Often garnished with raw onion
    hasBeverageModifiers: false,
    supportedConsistencyTypes: [],
    consistencyMultipliers: {},
    gi: 25,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: 'healthifyme',
    confidence: 'medium',
    notes: 'The Indian "Desi Protein Shake". Made with 30-40g roasted bengal gram powder per glass.'
  },
  {
    id: 'coconut-water',
    name: 'Coconut Water (Tender)',
    nameAlt: ['nariyal pani', 'daab'],
    hindiName: 'नारियल पानी',
    searchTerms: ['coconut water', 'nariyal pani', 'daab'],
    category: 'drink',
    subcategory: 'fruit-juice',
    itemType: 'base-food',
    state: 'raw',
    region: 'pan-indian',
    defaultServingGrams: 250, // Typical medium coconut yield
    per100g: {
      calories: 19,
      protein: 0.7,
      carbs: 4.0,
      fat: 0.2,
      fiber: 1.1,
      sodium: 105, // Great natural electrolyte
      vitaminB12: 0,
      vitaminD: 0,
      iron: 0.3,
      calcium: 24
    },
    servings: [
      { id: 'medium', label: '1 medium coconut (~250ml)', grams: 250 },
      { id: 'glass', label: '1 glass', grams: 200 },
      { id: 'g100', label: '100ml', grams: 100 }
    ],
    dietTypes: ['vegan', 'veg', 'jain', 'nonveg'],
    tags: ['post-workout', 'hydration', 'low-calorie'],
    isProcessed: false,
    isFastingFood: true,
    fastingTypes: ['navratri', 'ekadashi', 'jain-paryushana', 'ramzan'],
    isGlutenFree: true,
    isRecipe: false,
    containsRootVeg: false,
    hasBeverageModifiers: false,
    supportedConsistencyTypes: [],
    consistencyMultipliers: {},
    gi: 35, // low GI
    cookingOilNote: null,
    estimatedOilG: 0,
    source: 'USDA',
    confidence: 'high',
    notes: 'Must-have post-workout hydration. Very rich in potassium.'
  }
];

const indianFoodsPath = path.join(__dirname, '../src/data/foods/indianFoods.js');
let fileContent = fs.readFileSync(indianFoodsPath, 'utf8');

const insertIndex = fileContent.lastIndexOf('];');
if (insertIndex === -1) {
    console.error("Could not find array end '  ,
  {
    id: "gajar-halwa",
    name: "Gajar Ka Halwa (Carrot Pudding)",
    nameAlt: [
        "carrot halwa"
    ],
    hindiName: "गाजर का हलवा",
    searchTerms: [
        "gajar",
        "halwa",
        "carrot",
        "sweet"
    ],
    category: "sweet-mithai",
    subcategory: "halwa",
    itemType: "dish",
    state: "cooked",
    region: "north",
    defaultServingGrams: 100,
    per100g: {
        calories: 280,
        protein: 4.5,
        carbs: 32,
        fat: 15,
        fiber: 2,
        sodium: 50,
        vitaminB12: 0.1,
        vitaminD: 0,
        iron: 0.8,
        calcium: 150
    },
    servings: [
        {
            id: "katori",
            label: "1 katori",
            grams: 150
        },
        {
            id: "g100",
            label: "100g",
            grams: 100
        }
    ],
    dietTypes: [
        "veg",
        "jain",
        "nonveg"
    ],
    tags: [
        "snack",
        "high-sugar"
    ],
    isProcessed: false,
    isFastingFood: false,
    fastingTypes: [],
    isGlutenFree: true,
    isRecipe: false,
    containsRootVeg: true,
    hasBeverageModifiers: false,
    supportedConsistencyTypes: [],
    consistencyMultipliers: {},
    gi: 60,
    cookingOilNote: "Cooked in significant ghee.",
    estimatedOilG: 12,
    source: "healthifyme",
    confidence: "medium"
}  ,
  {
    id: "sooji-halwa",
    name: "Sooji Halwa",
    nameAlt: [
        "sheera",
        "rava kesari"
    ],
    hindiName: "सूजी का हलवा",
    searchTerms: [
        "sooji",
        "halwa",
        "sheera",
        "rava",
        "sweet"
    ],
    category: "sweet-mithai",
    subcategory: "halwa",
    itemType: "dish",
    state: "cooked",
    region: "pan-indian",
    defaultServingGrams: 100,
    per100g: {
        calories: 350,
        protein: 3.5,
        carbs: 45,
        fat: 18,
        fiber: 1,
        sodium: 10,
        vitaminB12: 0,
        vitaminD: 0,
        iron: 1,
        calcium: 20
    },
    servings: [
        {
            id: "katori",
            label: "1 katori",
            grams: 100
        },
        {
            id: "g100",
            label: "100g",
            grams: 100
        }
    ],
    dietTypes: [
        "veg",
        "jain",
        "nonveg"
    ],
    tags: [
        "snack",
        "high-sugar"
    ],
    isProcessed: false,
    isFastingFood: false,
    fastingTypes: [],
    isGlutenFree: false,
    isRecipe: false,
    containsRootVeg: false,
    hasBeverageModifiers: false,
    supportedConsistencyTypes: [],
    consistencyMultipliers: {},
    gi: 70,
    cookingOilNote: "Roasted in ghee.",
    estimatedOilG: 15,
    source: "healthifyme",
    confidence: "medium"
}  ,
  {
    id: "kheer",
    name: "Rice Kheer (Payasam)",
    nameAlt: [
        "payasam",
        "rice pudding"
    ],
    hindiName: "खीर",
    searchTerms: [
        "kheer",
        "payasam",
        "rice sweet"
    ],
    category: "sweet-mithai",
    subcategory: "milk-sweet",
    itemType: "dish",
    state: "cooked",
    region: "pan-indian",
    defaultServingGrams: 150,
    per100g: {
        calories: 120,
        protein: 3,
        carbs: 18,
        fat: 4,
        fiber: 0.2,
        sodium: 40,
        vitaminB12: 0.2,
        vitaminD: 0,
        iron: 0.2,
        calcium: 90
    },
    servings: [
        {
            id: "katori",
            label: "1 katori",
            grams: 150
        },
        {
            id: "g100",
            label: "100g",
            grams: 100
        }
    ],
    dietTypes: [
        "veg",
        "jain",
        "nonveg"
    ],
    tags: [
        "snack",
        "high-sugar"
    ],
    isProcessed: false,
    isFastingFood: false,
    fastingTypes: [],
    isGlutenFree: true,
    isRecipe: false,
    containsRootVeg: false,
    hasBeverageModifiers: false,
    supportedConsistencyTypes: [],
    consistencyMultipliers: {},
    gi: 65,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: "healthifyme",
    confidence: "medium"
}  ,
  {
    id: "barfi-plain",
    name: "Barfi (Plain/Mawa)",
    nameAlt: [
        "mawa barfi",
        "milk burfi"
    ],
    hindiName: "बर्फी",
    searchTerms: [
        "barfi",
        "burfi",
        "mawa",
        "sweet"
    ],
    category: "sweet-mithai",
    subcategory: "dry-sweet",
    itemType: "dish",
    state: "cooked",
    region: "north",
    defaultServingGrams: 30,
    per100g: {
        calories: 370,
        protein: 12,
        carbs: 45,
        fat: 15,
        fiber: 0,
        sodium: 50,
        vitaminB12: 0.5,
        vitaminD: 0,
        iron: 0.5,
        calcium: 150
    },
    servings: [
        {
            id: "piece",
            label: "1 piece",
            grams: 30
        },
        {
            id: "g100",
            label: "100g",
            grams: 100
        }
    ],
    dietTypes: [
        "veg",
        "jain",
        "nonveg"
    ],
    tags: [
        "snack",
        "high-sugar"
    ],
    isProcessed: false,
    isFastingFood: true,
    fastingTypes: [
        "navratri",
        "ekadashi"
    ],
    isGlutenFree: true,
    isRecipe: false,
    containsRootVeg: false,
    hasBeverageModifiers: false,
    supportedConsistencyTypes: [],
    consistencyMultipliers: {},
    gi: 60,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: "healthifyme",
    confidence: "medium"
}  ,
  {
    id: "sandesh",
    name: "Sandesh (Sondesh)",
    nameAlt: [
        "sondesh"
    ],
    hindiName: "संदेश",
    searchTerms: [
        "sandesh",
        "sondesh",
        "bengali sweet"
    ],
    category: "sweet-mithai",
    subcategory: "milk-sweet",
    itemType: "dish",
    state: "cooked",
    region: "east",
    defaultServingGrams: 30,
    per100g: {
        calories: 280,
        protein: 10,
        carbs: 35,
        fat: 11,
        fiber: 0,
        sodium: 30,
        vitaminB12: 0.4,
        vitaminD: 0,
        iron: 0.3,
        calcium: 110
    },
    servings: [
        {
            id: "piece",
            label: "1 piece",
            grams: 30
        },
        {
            id: "g100",
            label: "100g",
            grams: 100
        }
    ],
    dietTypes: [
        "veg",
        "jain",
        "nonveg"
    ],
    tags: [
        "snack",
        "high-sugar",
        "low-fat"
    ],
    isProcessed: false,
    isFastingFood: true,
    fastingTypes: [
        "navratri",
        "ekadashi"
    ],
    isGlutenFree: true,
    isRecipe: false,
    containsRootVeg: false,
    hasBeverageModifiers: false,
    supportedConsistencyTypes: [],
    consistencyMultipliers: {},
    gi: 55,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: "healthifyme",
    confidence: "medium"
}  ,
  {
    id: "kalakand",
    name: "Kalakand",
    nameAlt: [
        "milk cake",
        "ajmeri kalakand"
    ],
    hindiName: "कलाकंद",
    searchTerms: [
        "kalakand",
        "milk cake",
        "sweet"
    ],
    category: "sweet-mithai",
    subcategory: "milk-sweet",
    itemType: "dish",
    state: "cooked",
    region: "north",
    defaultServingGrams: 50,
    per100g: {
        calories: 330,
        protein: 14,
        carbs: 30,
        fat: 18,
        fiber: 0,
        sodium: 50,
        vitaminB12: 0.6,
        vitaminD: 0,
        iron: 0.5,
        calcium: 180
    },
    servings: [
        {
            id: "piece",
            label: "1 piece",
            grams: 50
        },
        {
            id: "g100",
            label: "100g",
            grams: 100
        }
    ],
    dietTypes: [
        "veg",
        "jain",
        "nonveg"
    ],
    tags: [
        "snack",
        "high-sugar",
        "high-protein"
    ],
    isProcessed: false,
    isFastingFood: true,
    fastingTypes: [
        "navratri",
        "ekadashi"
    ],
    isGlutenFree: true,
    isRecipe: false,
    containsRootVeg: false,
    hasBeverageModifiers: false,
    supportedConsistencyTypes: [],
    consistencyMultipliers: {},
    gi: 55,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: "healthifyme",
    confidence: "medium"
}  ,
  {
    id: "rabri",
    name: "Rabri (Basundi)",
    nameAlt: [
        "basundi"
    ],
    hindiName: "रबड़ी",
    searchTerms: [
        "rabri",
        "basundi",
        "milk sweet"
    ],
    category: "sweet-mithai",
    subcategory: "milk-sweet",
    itemType: "dish",
    state: "cooked",
    region: "north",
    defaultServingGrams: 100,
    per100g: {
        calories: 250,
        protein: 8,
        carbs: 22,
        fat: 15,
        fiber: 0,
        sodium: 45,
        vitaminB12: 0.4,
        vitaminD: 0,
        iron: 0.2,
        calcium: 150
    },
    servings: [
        {
            id: "katori",
            label: "1 katori",
            grams: 100
        },
        {
            id: "g100",
            label: "100g",
            grams: 100
        }
    ],
    dietTypes: [
        "veg",
        "jain",
        "nonveg"
    ],
    tags: [
        "snack",
        "high-sugar",
        "high-fat"
    ],
    isProcessed: false,
    isFastingFood: true,
    fastingTypes: [
        "navratri",
        "ekadashi"
    ],
    isGlutenFree: true,
    isRecipe: false,
    containsRootVeg: false,
    hasBeverageModifiers: false,
    supportedConsistencyTypes: [],
    consistencyMultipliers: {},
    gi: 50,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: "healthifyme",
    confidence: "medium"
}  ,
  {
    id: "mysore-pak",
    name: "Mysore Pak",
    nameAlt: [
        "mysuru pak"
    ],
    hindiName: "मैसूर पाक",
    searchTerms: [
        "mysore",
        "pak",
        "besan sweet"
    ],
    category: "sweet-mithai",
    subcategory: "dry-sweet",
    itemType: "dish",
    state: "cooked",
    region: "south",
    defaultServingGrams: 30,
    per100g: {
        calories: 530,
        protein: 4.5,
        carbs: 45,
        fat: 38,
        fiber: 1.5,
        sodium: 15,
        vitaminB12: 0,
        vitaminD: 0,
        iron: 1,
        calcium: 20
    },
    servings: [
        {
            id: "piece",
            label: "1 piece",
            grams: 30
        },
        {
            id: "g100",
            label: "100g",
            grams: 100
        }
    ],
    dietTypes: [
        "veg",
        "jain",
        "nonveg"
    ],
    tags: [
        "snack",
        "high-calorie",
        "high-fat",
        "high-sugar"
    ],
    isProcessed: false,
    isFastingFood: false,
    fastingTypes: [],
    isGlutenFree: true,
    isRecipe: false,
    containsRootVeg: false,
    hasBeverageModifiers: false,
    supportedConsistencyTypes: [],
    consistencyMultipliers: {},
    gi: 65,
    cookingOilNote: "Extremely high ghee content.",
    estimatedOilG: 20,
    source: "healthifyme",
    confidence: "medium"
}  ,
  {
    id: "dharwad-peda",
    name: "Dharwad Peda",
    nameAlt: [
        "peda",
        "brown peda"
    ],
    hindiName: "धारवाड़ पेड़ा",
    searchTerms: [
        "dharwad",
        "peda",
        "sweet"
    ],
    category: "sweet-mithai",
    subcategory: "dry-sweet",
    itemType: "dish",
    state: "cooked",
    region: "south",
    defaultServingGrams: 25,
    per100g: {
        calories: 380,
        protein: 12,
        carbs: 50,
        fat: 14,
        fiber: 0,
        sodium: 30,
        vitaminB12: 0.5,
        vitaminD: 0,
        iron: 0.5,
        calcium: 130
    },
    servings: [
        {
            id: "piece",
            label: "1 piece",
            grams: 25
        },
        {
            id: "g100",
            label: "100g",
            grams: 100
        }
    ],
    dietTypes: [
        "veg",
        "jain",
        "nonveg"
    ],
    tags: [
        "snack",
        "high-sugar"
    ],
    isProcessed: false,
    isFastingFood: true,
    fastingTypes: [
        "navratri",
        "ekadashi"
    ],
    isGlutenFree: true,
    isRecipe: false,
    containsRootVeg: false,
    hasBeverageModifiers: false,
    supportedConsistencyTypes: [],
    consistencyMultipliers: {},
    gi: 60,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: "healthifyme",
    confidence: "medium"
}  ,
  {
    id: "papaya-ripe",
    name: "Papaya (Ripe)",
    nameAlt: [
        "papita"
    ],
    hindiName: "पपीता",
    searchTerms: [
        "papaya",
        "papita",
        "fruit"
    ],
    category: "fruit",
    subcategory: "fresh-fruit",
    itemType: "base-food",
    state: "raw",
    region: "pan-indian",
    defaultServingGrams: 150,
    per100g: {
        calories: 43,
        protein: 0.5,
        carbs: 11,
        fat: 0.3,
        fiber: 1.7,
        sodium: 8,
        vitaminB12: 0,
        vitaminD: 0,
        iron: 0.2,
        calcium: 20
    },
    servings: [
        {
            id: "bowl",
            label: "1 bowl (cubed)",
            grams: 150
        },
        {
            id: "g100",
            label: "100g",
            grams: 100
        }
    ],
    dietTypes: [
        "vegan",
        "veg",
        "jain",
        "nonveg"
    ],
    tags: [
        "snack",
        "low-calorie",
        "high-fiber"
    ],
    isProcessed: false,
    isFastingFood: true,
    fastingTypes: [
        "navratri",
        "ekadashi",
        "jain-paryushana",
        "ramzan"
    ],
    isGlutenFree: true,
    isRecipe: false,
    containsRootVeg: false,
    hasBeverageModifiers: false,
    supportedConsistencyTypes: [],
    consistencyMultipliers: {},
    gi: 60,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: "USDA",
    confidence: "high"
}  ,
  {
    id: "guava-raw",
    name: "Guava (Amrood)",
    nameAlt: [
        "amrood",
        "peru"
    ],
    hindiName: "अमरूद",
    searchTerms: [
        "guava",
        "amrood",
        "peru",
        "fruit"
    ],
    category: "fruit",
    subcategory: "fresh-fruit",
    itemType: "base-food",
    state: "raw",
    region: "pan-indian",
    defaultServingGrams: 150,
    per100g: {
        calories: 68,
        protein: 2.6,
        carbs: 14.3,
        fat: 1,
        fiber: 5.4,
        sodium: 2,
        vitaminB12: 0,
        vitaminD: 0,
        iron: 0.3,
        calcium: 18
    },
    servings: [
        {
            id: "medium",
            label: "1 medium",
            grams: 150
        },
        {
            id: "g100",
            label: "100g",
            grams: 100
        }
    ],
    dietTypes: [
        "vegan",
        "veg",
        "jain",
        "nonveg"
    ],
    tags: [
        "snack",
        "high-fiber",
        "low-calorie"
    ],
    isProcessed: false,
    isFastingFood: true,
    fastingTypes: [
        "navratri",
        "ekadashi",
        "jain-paryushana",
        "ramzan"
    ],
    isGlutenFree: true,
    isRecipe: false,
    containsRootVeg: false,
    hasBeverageModifiers: false,
    supportedConsistencyTypes: [],
    consistencyMultipliers: {},
    gi: 12,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: "USDA",
    confidence: "high"
}  ,
  {
    id: "pomegranate-seeds",
    name: "Pomegranate (Anaar)",
    nameAlt: [
        "anaar"
    ],
    hindiName: "अनार",
    searchTerms: [
        "pomegranate",
        "anaar",
        "fruit",
        "seeds"
    ],
    category: "fruit",
    subcategory: "fresh-fruit",
    itemType: "base-food",
    state: "raw",
    region: "pan-indian",
    defaultServingGrams: 100,
    per100g: {
        calories: 83,
        protein: 1.7,
        carbs: 18.7,
        fat: 1.2,
        fiber: 4,
        sodium: 3,
        vitaminB12: 0,
        vitaminD: 0,
        iron: 0.3,
        calcium: 10
    },
    servings: [
        {
            id: "katori",
            label: "1 katori (seeds)",
            grams: 100
        },
        {
            id: "medium",
            label: "1 medium (whole)",
            grams: 280
        },
        {
            id: "g100",
            label: "100g",
            grams: 100
        }
    ],
    dietTypes: [
        "vegan",
        "veg",
        "jain",
        "nonveg"
    ],
    tags: [
        "snack",
        "healthy-fats"
    ],
    isProcessed: false,
    isFastingFood: true,
    fastingTypes: [
        "navratri",
        "ekadashi",
        "jain-paryushana",
        "ramzan"
    ],
    isGlutenFree: true,
    isRecipe: false,
    containsRootVeg: false,
    hasBeverageModifiers: false,
    supportedConsistencyTypes: [],
    consistencyMultipliers: {},
    gi: 53,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: "USDA",
    confidence: "high"
}  ,
  {
    id: "watermelon-raw",
    name: "Watermelon (Tarbooz)",
    nameAlt: [
        "tarbooz"
    ],
    hindiName: "तरबूज",
    searchTerms: [
        "watermelon",
        "tarbooz",
        "fruit"
    ],
    category: "fruit",
    subcategory: "fresh-fruit",
    itemType: "base-food",
    state: "raw",
    region: "pan-indian",
    defaultServingGrams: 280,
    per100g: {
        calories: 30,
        protein: 0.6,
        carbs: 7.6,
        fat: 0.2,
        fiber: 0.4,
        sodium: 1,
        vitaminB12: 0,
        vitaminD: 0,
        iron: 0.2,
        calcium: 7
    },
    servings: [
        {
            id: "bowl",
            label: "1 bowl",
            grams: 280
        },
        {
            id: "slice",
            label: "1 wedge/slice",
            grams: 280
        },
        {
            id: "g100",
            label: "100g",
            grams: 100
        }
    ],
    dietTypes: [
        "vegan",
        "veg",
        "jain",
        "nonveg"
    ],
    tags: [
        "snack",
        "low-calorie",
        "hydration"
    ],
    isProcessed: false,
    isFastingFood: true,
    fastingTypes: [
        "navratri",
        "ekadashi",
        "jain-paryushana",
        "ramzan"
    ],
    isGlutenFree: true,
    isRecipe: false,
    containsRootVeg: false,
    hasBeverageModifiers: false,
    supportedConsistencyTypes: [],
    consistencyMultipliers: {},
    gi: 72,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: "USDA",
    confidence: "high"
}  ,
  {
    id: "chikoo-raw",
    name: "Chikoo (Sapota)",
    nameAlt: [
        "sapota",
        "chikku"
    ],
    hindiName: "चीकू",
    searchTerms: [
        "chikoo",
        "sapota",
        "chikku",
        "fruit"
    ],
    category: "fruit",
    subcategory: "fresh-fruit",
    itemType: "base-food",
    state: "raw",
    region: "pan-indian",
    defaultServingGrams: 100,
    per100g: {
        calories: 83,
        protein: 0.4,
        carbs: 20,
        fat: 1.1,
        fiber: 5.3,
        sodium: 12,
        vitaminB12: 0,
        vitaminD: 0,
        iron: 0.8,
        calcium: 21
    },
    servings: [
        {
            id: "medium",
            label: "1 medium",
            grams: 100
        },
        {
            id: "g100",
            label: "100g",
            grams: 100
        }
    ],
    dietTypes: [
        "vegan",
        "veg",
        "jain",
        "nonveg"
    ],
    tags: [
        "snack",
        "high-sugar",
        "high-fiber"
    ],
    isProcessed: false,
    isFastingFood: true,
    fastingTypes: [
        "navratri",
        "ekadashi",
        "jain-paryushana",
        "ramzan"
    ],
    isGlutenFree: true,
    isRecipe: false,
    containsRootVeg: false,
    hasBeverageModifiers: false,
    supportedConsistencyTypes: [],
    consistencyMultipliers: {},
    gi: 56,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: "USDA",
    confidence: "high"
}  ,
  {
    id: "grapes-green",
    name: "Grapes (Angoor)",
    nameAlt: [
        "angoor",
        "green grapes"
    ],
    hindiName: "अंगूर",
    searchTerms: [
        "grapes",
        "angoor",
        "fruit",
        "green grapes"
    ],
    category: "fruit",
    subcategory: "fresh-fruit",
    itemType: "base-food",
    state: "raw",
    region: "pan-indian",
    defaultServingGrams: 150,
    per100g: {
        calories: 69,
        protein: 0.7,
        carbs: 18.1,
        fat: 0.2,
        fiber: 0.9,
        sodium: 2,
        vitaminB12: 0,
        vitaminD: 0,
        iron: 0.4,
        calcium: 10
    },
    servings: [
        {
            id: "katori",
            label: "1 katori (bunches)",
            grams: 150
        },
        {
            id: "g100",
            label: "100g",
            grams: 100
        }
    ],
    dietTypes: [
        "vegan",
        "veg",
        "jain",
        "nonveg"
    ],
    tags: [
        "snack",
        "high-sugar"
    ],
    isProcessed: false,
    isFastingFood: true,
    fastingTypes: [
        "navratri",
        "ekadashi",
        "jain-paryushana",
        "ramzan"
    ],
    isGlutenFree: true,
    isRecipe: false,
    containsRootVeg: false,
    hasBeverageModifiers: false,
    supportedConsistencyTypes: [],
    consistencyMultipliers: {},
    gi: 53,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: "USDA",
    confidence: "high"
}  ,
  {
    id: "orange-raw",
    name: "Orange (Santra)",
    nameAlt: [
        "santra",
        "kinnow"
    ],
    hindiName: "संतरा",
    searchTerms: [
        "orange",
        "santra",
        "kinnow",
        "fruit"
    ],
    category: "fruit",
    subcategory: "fresh-fruit",
    itemType: "base-food",
    state: "raw",
    region: "pan-indian",
    defaultServingGrams: 130,
    per100g: {
        calories: 47,
        protein: 0.9,
        carbs: 11.8,
        fat: 0.1,
        fiber: 2.4,
        sodium: 0,
        vitaminB12: 0,
        vitaminD: 0,
        iron: 0.1,
        calcium: 40
    },
    servings: [
        {
            id: "medium",
            label: "1 medium",
            grams: 130
        },
        {
            id: "g100",
            label: "100g",
            grams: 100
        }
    ],
    dietTypes: [
        "vegan",
        "veg",
        "jain",
        "nonveg"
    ],
    tags: [
        "snack",
        "low-calorie"
    ],
    isProcessed: false,
    isFastingFood: true,
    fastingTypes: [
        "navratri",
        "ekadashi",
        "jain-paryushana",
        "ramzan"
    ],
    isGlutenFree: true,
    isRecipe: false,
    containsRootVeg: false,
    hasBeverageModifiers: false,
    supportedConsistencyTypes: [],
    consistencyMultipliers: {},
    gi: 40,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: "USDA",
    confidence: "high"
}  ,
  {
    id: "pineapple-raw",
    name: "Pineapple (Ananas)",
    nameAlt: [
        "ananas",
        "anarash"
    ],
    hindiName: "अनानास",
    searchTerms: [
        "pineapple",
        "ananas",
        "fruit"
    ],
    category: "fruit",
    subcategory: "fresh-fruit",
    itemType: "base-food",
    state: "raw",
    region: "pan-indian",
    defaultServingGrams: 165,
    per100g: {
        calories: 50,
        protein: 0.5,
        carbs: 13.1,
        fat: 0.1,
        fiber: 1.4,
        sodium: 1,
        vitaminB12: 0,
        vitaminD: 0,
        iron: 0.3,
        calcium: 13
    },
    servings: [
        {
            id: "katori",
            label: "1 katori (cubed)",
            grams: 165
        },
        {
            id: "slice",
            label: "1 slice",
            grams: 85
        },
        {
            id: "g100",
            label: "100g",
            grams: 100
        }
    ],
    dietTypes: [
        "vegan",
        "veg",
        "jain",
        "nonveg"
    ],
    tags: [
        "snack",
        "low-calorie"
    ],
    isProcessed: false,
    isFastingFood: true,
    fastingTypes: [
        "navratri",
        "ekadashi",
        "jain-paryushana",
        "ramzan"
    ],
    isGlutenFree: true,
    isRecipe: false,
    containsRootVeg: false,
    hasBeverageModifiers: false,
    supportedConsistencyTypes: [],
    consistencyMultipliers: {},
    gi: 59,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: "USDA",
    confidence: "high"
}  ,
  {
    id: "coconut-fresh",
    name: "Coconut (Fresh Meat/Shreds)",
    nameAlt: [
        "nariyal giri",
        "fresh coconut"
    ],
    hindiName: "नारियल (ताजा)",
    searchTerms: [
        "coconut",
        "nariyal",
        "fresh coconut"
    ],
    category: "fruit",
    subcategory: "fresh-fruit",
    itemType: "base-food",
    state: "raw",
    region: "south",
    defaultServingGrams: 45,
    per100g: {
        calories: 354,
        protein: 3.3,
        carbs: 15.2,
        fat: 33.5,
        fiber: 9,
        sodium: 20,
        vitaminB12: 0,
        vitaminD: 0,
        iron: 2.4,
        calcium: 14
    },
    servings: [
        {
            id: "tbsp",
            label: "1 tbsp (grated)",
            grams: 15
        },
        {
            id: "piece",
            label: "1 piece (wedge)",
            grams: 45
        },
        {
            id: "g100",
            label: "100g",
            grams: 100
        }
    ],
    dietTypes: [
        "vegan",
        "veg",
        "jain",
        "nonveg"
    ],
    tags: [
        "snack",
        "high-fat",
        "healthy-fats"
    ],
    isProcessed: false,
    isFastingFood: true,
    fastingTypes: [
        "navratri",
        "ekadashi",
        "jain-paryushana"
    ],
    isGlutenFree: true,
    isRecipe: false,
    containsRootVeg: false,
    hasBeverageModifiers: false,
    supportedConsistencyTypes: [],
    consistencyMultipliers: {},
    gi: 42,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: "USDA",
    confidence: "high",
    notes: "Extremely high calorie/fat density. Often used in chutneys."
}  ,
  {
    id: "cashews-raw",
    name: "Cashews (Kaju)",
    nameAlt: [
        "kaju"
    ],
    hindiName: "काजू",
    searchTerms: [
        "cashew",
        "kaju",
        "nuts",
        "dry fruit"
    ],
    category: "fruit",
    subcategory: "dry-fruits-nuts",
    itemType: "base-food",
    state: "raw",
    region: "pan-indian",
    defaultServingGrams: 30,
    per100g: {
        calories: 553,
        protein: 18.2,
        carbs: 30.2,
        fat: 43.8,
        fiber: 3.3,
        sodium: 12,
        vitaminB12: 0,
        vitaminD: 0,
        iron: 6.7,
        calcium: 37
    },
    servings: [
        {
            id: "handful",
            label: "1 handful",
            grams: 30
        },
        {
            id: "piece",
            label: "5 pieces",
            grams: 8
        },
        {
            id: "g100",
            label: "100g",
            grams: 100
        }
    ],
    dietTypes: [
        "vegan",
        "veg",
        "jain",
        "nonveg"
    ],
    tags: [
        "snack",
        "high-fat",
        "healthy-fats"
    ],
    isProcessed: false,
    isFastingFood: true,
    fastingTypes: [
        "navratri",
        "ekadashi",
        "jain-paryushana",
        "ramzan"
    ],
    isGlutenFree: true,
    isRecipe: false,
    containsRootVeg: false,
    hasBeverageModifiers: false,
    supportedConsistencyTypes: [],
    consistencyMultipliers: {},
    gi: 25,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: "USDA",
    confidence: "high"
}  ,
  {
    id: "walnuts-raw",
    name: "Walnuts (Akhrot)",
    nameAlt: [
        "akhrot"
    ],
    hindiName: "अखरोट",
    searchTerms: [
        "walnut",
        "akhrot",
        "nuts",
        "dry fruit"
    ],
    category: "fruit",
    subcategory: "dry-fruits-nuts",
    itemType: "base-food",
    state: "raw",
    region: "pan-indian",
    defaultServingGrams: 30,
    per100g: {
        calories: 654,
        protein: 15.2,
        carbs: 13.7,
        fat: 65.2,
        fiber: 6.7,
        sodium: 2,
        vitaminB12: 0,
        vitaminD: 0,
        iron: 2.9,
        calcium: 98
    },
    servings: [
        {
            id: "handful",
            label: "1 handful",
            grams: 30
        },
        {
            id: "piece",
            label: "5 halves",
            grams: 14
        },
        {
            id: "g100",
            label: "100g",
            grams: 100
        }
    ],
    dietTypes: [
        "vegan",
        "veg",
        "jain",
        "nonveg"
    ],
    tags: [
        "snack",
        "high-fat",
        "healthy-fats"
    ],
    isProcessed: false,
    isFastingFood: true,
    fastingTypes: [
        "navratri",
        "ekadashi",
        "jain-paryushana",
        "ramzan"
    ],
    isGlutenFree: true,
    isRecipe: false,
    containsRootVeg: false,
    hasBeverageModifiers: false,
    supportedConsistencyTypes: [],
    consistencyMultipliers: {},
    gi: 15,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: "USDA",
    confidence: "high"
}  ,
  {
    id: "peanuts-roasted",
    name: "Peanuts (Moongfali, Roasted)",
    nameAlt: [
        "moongfali",
        "shengdana",
        "groundnuts"
    ],
    hindiName: "मूँगफली",
    searchTerms: [
        "peanut",
        "moongfali",
        "shengdana",
        "groundnut",
        "nuts"
    ],
    category: "fruit",
    subcategory: "dry-fruits-nuts",
    itemType: "base-food",
    state: "roasted",
    region: "pan-indian",
    defaultServingGrams: 30,
    per100g: {
        calories: 585,
        protein: 23.7,
        carbs: 21.3,
        fat: 49.7,
        fiber: 8,
        sodium: 5,
        vitaminB12: 0,
        vitaminD: 0,
        iron: 2.3,
        calcium: 54
    },
    servings: [
        {
            id: "handful",
            label: "1 handful",
            grams: 30
        },
        {
            id: "katori",
            label: "1 katori",
            grams: 150
        },
        {
            id: "g100",
            label: "100g",
            grams: 100
        }
    ],
    dietTypes: [
        "vegan",
        "veg",
        "jain",
        "nonveg"
    ],
    tags: [
        "snack",
        "high-fat",
        "high-protein",
        "budget-friendly"
    ],
    isProcessed: false,
    isFastingFood: true,
    fastingTypes: [
        "navratri",
        "ekadashi"
    ],
    isGlutenFree: true,
    isRecipe: false,
    containsRootVeg: false,
    hasBeverageModifiers: false,
    supportedConsistencyTypes: [],
    consistencyMultipliers: {},
    gi: 14,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: "USDA",
    confidence: "high"
}  ,
  {
    id: "raisins",
    name: "Raisins (Kishmish)",
    nameAlt: [
        "kishmish",
        "kismis"
    ],
    hindiName: "किशमिश",
    searchTerms: [
        "raisins",
        "kishmish",
        "kismis",
        "dry fruit"
    ],
    category: "fruit",
    subcategory: "dry-fruits-nuts",
    itemType: "base-food",
    state: "raw",
    region: "pan-indian",
    defaultServingGrams: 30,
    per100g: {
        calories: 299,
        protein: 3.1,
        carbs: 79.2,
        fat: 0.5,
        fiber: 3.7,
        sodium: 11,
        vitaminB12: 0,
        vitaminD: 0,
        iron: 1.9,
        calcium: 50
    },
    servings: [
        {
            id: "handful",
            label: "1 handful",
            grams: 30
        },
        {
            id: "tbsp",
            label: "1 tbsp",
            grams: 15
        },
        {
            id: "g100",
            label: "100g",
            grams: 100
        }
    ],
    dietTypes: [
        "vegan",
        "veg",
        "jain",
        "nonveg"
    ],
    tags: [
        "snack",
        "high-sugar"
    ],
    isProcessed: false,
    isFastingFood: true,
    fastingTypes: [
        "navratri",
        "ekadashi",
        "jain-paryushana",
        "ramzan"
    ],
    isGlutenFree: true,
    isRecipe: false,
    containsRootVeg: false,
    hasBeverageModifiers: false,
    supportedConsistencyTypes: [],
    consistencyMultipliers: {},
    gi: 64,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: "USDA",
    confidence: "high"
}  ,
  {
    id: "sunflower-seeds",
    name: "Sunflower Seeds",
    nameAlt: [
        "surajmukhi beej"
    ],
    hindiName: "सूरजमुखी के बीज",
    searchTerms: [
        "sunflower",
        "seeds",
        "surajmukhi"
    ],
    category: "fruit",
    subcategory: "dry-fruits-nuts",
    itemType: "base-food",
    state: "raw",
    region: "pan-indian",
    defaultServingGrams: 15,
    per100g: {
        calories: 584,
        protein: 20.8,
        carbs: 20,
        fat: 51.5,
        fiber: 8.6,
        sodium: 9,
        vitaminB12: 0,
        vitaminD: 0,
        iron: 5.3,
        calcium: 78
    },
    servings: [
        {
            id: "tbsp",
            label: "1 tbsp",
            grams: 15
        },
        {
            id: "handful",
            label: "1 handful",
            grams: 30
        },
        {
            id: "g100",
            label: "100g",
            grams: 100
        }
    ],
    dietTypes: [
        "vegan",
        "veg",
        "jain",
        "nonveg"
    ],
    tags: [
        "snack",
        "healthy-fats",
        "high-protein"
    ],
    isProcessed: false,
    isFastingFood: true,
    fastingTypes: [
        "navratri",
        "ekadashi"
    ],
    isGlutenFree: true,
    isRecipe: false,
    containsRootVeg: false,
    hasBeverageModifiers: false,
    supportedConsistencyTypes: [],
    consistencyMultipliers: {},
    gi: 20,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: "USDA",
    confidence: "high"
}  ,
  {
    id: "chia-seeds",
    name: "Chia Seeds",
    nameAlt: [
        "sabza",
        "tukmaria"
    ],
    hindiName: "चिया के बीज",
    searchTerms: [
        "chia",
        "seeds",
        "sabza",
        "falooda seed"
    ],
    category: "fruit",
    subcategory: "dry-fruits-nuts",
    itemType: "base-food",
    state: "raw",
    region: "pan-indian",
    defaultServingGrams: 15,
    per100g: {
        calories: 486,
        protein: 16.5,
        carbs: 42.1,
        fat: 30.7,
        fiber: 34.4,
        sodium: 16,
        vitaminB12: 0,
        vitaminD: 0,
        iron: 7.7,
        calcium: 631
    },
    servings: [
        {
            id: "tbsp",
            label: "1 tbsp",
            grams: 15
        },
        {
            id: "g100",
            label: "100g",
            grams: 100
        }
    ],
    dietTypes: [
        "vegan",
        "veg",
        "jain",
        "nonveg"
    ],
    tags: [
        "snack",
        "high-fiber",
        "healthy-fats"
    ],
    isProcessed: false,
    isFastingFood: true,
    fastingTypes: [
        "navratri",
        "ekadashi"
    ],
    isGlutenFree: true,
    isRecipe: false,
    containsRootVeg: false,
    hasBeverageModifiers: false,
    supportedConsistencyTypes: [],
    consistencyMultipliers: {},
    gi: 1,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: "USDA",
    confidence: "high",
    notes: "Almost all carbs are fiber. Excellent calcium source."
}  ,
  {
    id: "green-tea",
    name: "Green Tea (No Sugar)",
    nameAlt: [
        "green tea bag"
    ],
    hindiName: "ग्रीन टी",
    searchTerms: [
        "green tea",
        "tea",
        "weight loss tea"
    ],
    category: "drink",
    subcategory: "tea-coffee",
    itemType: "drink",
    state: "cooked",
    region: "pan-indian",
    defaultServingGrams: 150,
    per100g: {
        calories: 1,
        protein: 0,
        carbs: 0,
        fat: 0,
        fiber: 0,
        sodium: 1,
        vitaminB12: 0,
        vitaminD: 0,
        iron: 0,
        calcium: 0
    },
    servings: [
        {
            id: "cup",
            label: "1 cup (150ml)",
            grams: 150
        },
        {
            id: "g100",
            label: "100ml",
            grams: 100
        }
    ],
    dietTypes: [
        "vegan",
        "veg",
        "jain",
        "nonveg"
    ],
    tags: [
        "breakfast",
        "snack",
        "low-calorie"
    ],
    isProcessed: false,
    isFastingFood: true,
    fastingTypes: [
        "navratri",
        "ekadashi",
        "jain-paryushana"
    ],
    isGlutenFree: true,
    isRecipe: false,
    containsRootVeg: false,
    hasBeverageModifiers: false,
    supportedConsistencyTypes: [],
    consistencyMultipliers: {},
    gi: 0,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: "USDA",
    confidence: "high"
}  ,
  {
    id: "nimbu-pani",
    name: "Nimbu Pani (Lemonade, Sweet & Salt)",
    nameAlt: [
        "shikanji",
        "lemon water"
    ],
    hindiName: "नींबू पानी",
    searchTerms: [
        "nimbu",
        "pani",
        "shikanji",
        "lemonade",
        "lemon water"
    ],
    category: "drink",
    subcategory: "cooling",
    itemType: "drink",
    state: "raw",
    region: "pan-indian",
    defaultServingGrams: 200,
    per100g: {
        calories: 25,
        protein: 0.1,
        carbs: 6.5,
        fat: 0,
        fiber: 0,
        sodium: 150,
        vitaminB12: 0,
        vitaminD: 0,
        iron: 0.1,
        calcium: 5
    },
    servings: [
        {
            id: "glass",
            label: "1 glass (200ml)",
            grams: 200
        },
        {
            id: "g100",
            label: "100ml",
            grams: 100
        }
    ],
    dietTypes: [
        "vegan",
        "veg",
        "jain",
        "nonveg"
    ],
    tags: [
        "snack",
        "hydration",
        "cooling"
    ],
    isProcessed: false,
    isFastingFood: true,
    fastingTypes: [
        "navratri",
        "ekadashi",
        "ramzan"
    ],
    isGlutenFree: true,
    isRecipe: false,
    containsRootVeg: false,
    hasBeverageModifiers: false,
    supportedConsistencyTypes: [],
    consistencyMultipliers: {},
    gi: 65,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: "healthifyme",
    confidence: "medium",
    notes: "Assume 1 tbsp sugar and salt/black salt."
}  ,
  {
    id: "mango-shake",
    name: "Mango Shake (With Sugar & Milk)",
    nameAlt: [
        "aamras milk"
    ],
    hindiName: "मैंगो शेक",
    searchTerms: [
        "mango",
        "shake",
        "milkshake",
        "aam"
    ],
    category: "drink",
    subcategory: "milk-based",
    itemType: "drink",
    state: "raw",
    region: "pan-indian",
    defaultServingGrams: 250,
    per100g: {
        calories: 110,
        protein: 3.5,
        carbs: 17.5,
        fat: 3,
        fiber: 0.6,
        sodium: 40,
        vitaminB12: 0.4,
        vitaminD: 15,
        iron: 0.1,
        calcium: 110
    },
    servings: [
        {
            id: "glass",
            label: "1 tall glass (250ml)",
            grams: 250
        },
        {
            id: "g100",
            label: "100ml",
            grams: 100
        }
    ],
    dietTypes: [
        "veg",
        "jain",
        "nonveg"
    ],
    tags: [
        "snack",
        "high-sugar",
        "high-calorie"
    ],
    isProcessed: false,
    isFastingFood: true,
    fastingTypes: [
        "navratri",
        "ekadashi",
        "ramzan"
    ],
    isGlutenFree: true,
    isRecipe: false,
    containsRootVeg: false,
    hasBeverageModifiers: false,
    supportedConsistencyTypes: [],
    consistencyMultipliers: {},
    gi: 60,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: "healthifyme",
    confidence: "medium"
}  ,
  {
    id: "banana-shake",
    name: "Banana Shake (With Sugar & Milk)",
    nameAlt: [
        "banana milkshake"
    ],
    hindiName: "बनाना शेक",
    searchTerms: [
        "banana",
        "shake",
        "milkshake",
        "kela"
    ],
    category: "drink",
    subcategory: "milk-based",
    itemType: "drink",
    state: "raw",
    region: "pan-indian",
    defaultServingGrams: 250,
    per100g: {
        calories: 125,
        protein: 3.8,
        carbs: 20.5,
        fat: 3.2,
        fiber: 1,
        sodium: 45,
        vitaminB12: 0.5,
        vitaminD: 15,
        iron: 0.2,
        calcium: 115
    },
    servings: [
        {
            id: "glass",
            label: "1 tall glass (250ml)",
            grams: 250
        },
        {
            id: "g100",
            label: "100ml",
            grams: 100
        }
    ],
    dietTypes: [
        "veg",
        "jain",
        "nonveg"
    ],
    tags: [
        "snack",
        "pre-workout",
        "high-sugar"
    ],
    isProcessed: false,
    isFastingFood: true,
    fastingTypes: [
        "navratri",
        "ekadashi",
        "ramzan"
    ],
    isGlutenFree: true,
    isRecipe: false,
    containsRootVeg: false,
    hasBeverageModifiers: false,
    supportedConsistencyTypes: [],
    consistencyMultipliers: {},
    gi: 55,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: "healthifyme",
    confidence: "medium"
}  ,
  {
    id: "sugarcane-juice",
    name: "Sugarcane Juice (Ganne Ka Ras)",
    nameAlt: [
        "ganne ka ras",
        "karumbu juice"
    ],
    hindiName: "गन्ने का रस",
    searchTerms: [
        "sugarcane",
        "ganne",
        "juice",
        "ras"
    ],
    category: "drink",
    subcategory: "fruit-juice",
    itemType: "drink",
    state: "raw",
    region: "pan-indian",
    defaultServingGrams: 200,
    per100g: {
        calories: 39,
        protein: 0.2,
        carbs: 9.8,
        fat: 0,
        fiber: 0.5,
        sodium: 2,
        vitaminB12: 0,
        vitaminD: 0,
        iron: 0.4,
        calcium: 10
    },
    servings: [
        {
            id: "glass",
            label: "1 glass (200ml)",
            grams: 200
        },
        {
            id: "g100",
            label: "100ml",
            grams: 100
        }
    ],
    dietTypes: [
        "vegan",
        "veg",
        "jain",
        "nonveg"
    ],
    tags: [
        "snack",
        "cooling",
        "hydration"
    ],
    isProcessed: false,
    isFastingFood: true,
    fastingTypes: [
        "navratri",
        "ekadashi",
        "ramzan"
    ],
    isGlutenFree: true,
    isRecipe: false,
    containsRootVeg: false,
    hasBeverageModifiers: false,
    supportedConsistencyTypes: [],
    consistencyMultipliers: {},
    gi: 43,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: "healthifyme",
    confidence: "medium"
}  ,
  {
    id: "rooh-afza",
    name: "Rooh Afza (with Water)",
    nameAlt: [
        "rose syrup drink"
    ],
    hindiName: "रूह अफ़ज़ा",
    searchTerms: [
        "rooh",
        "afza",
        "rose syrup",
        "drink"
    ],
    category: "drink",
    subcategory: "cooling",
    itemType: "drink",
    state: "raw",
    region: "pan-indian",
    defaultServingGrams: 250,
    per100g: {
        calories: 35,
        protein: 0,
        carbs: 8.5,
        fat: 0,
        fiber: 0,
        sodium: 5,
        vitaminB12: 0,
        vitaminD: 0,
        iron: 0,
        calcium: 0
    },
    servings: [
        {
            id: "glass",
            label: "1 glass",
            grams: 250
        },
        {
            id: "g100",
            label: "100ml",
            grams: 100
        }
    ],
    dietTypes: [
        "vegan",
        "veg",
        "jain",
        "nonveg"
    ],
    tags: [
        "snack",
        "cooling",
        "high-sugar"
    ],
    isProcessed: true,
    isFastingFood: true,
    fastingTypes: [
        "ramzan"
    ],
    isGlutenFree: true,
    isRecipe: false,
    containsRootVeg: false,
    hasBeverageModifiers: false,
    supportedConsistencyTypes: [],
    consistencyMultipliers: {},
    gi: 65,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: "healthifyme",
    confidence: "medium"
}  ,
  {
    id: "cola-can",
    name: "Cola / Soft Drink (Thums Up, Coke, Pepsi)",
    nameAlt: [
        "coke",
        "pepsi",
        "thums up",
        "cold drink"
    ],
    hindiName: "कोला",
    searchTerms: [
        "cola",
        "coke",
        "pepsi",
        "thums up",
        "cold drink",
        "soft drink"
    ],
    category: "drink",
    subcategory: "packaged",
    itemType: "drink",
    state: "raw",
    region: "pan-indian",
    defaultServingGrams: 330,
    per100g: {
        calories: 43,
        protein: 0,
        carbs: 10.6,
        fat: 0,
        fiber: 0,
        sodium: 11,
        vitaminB12: 0,
        vitaminD: 0,
        iron: 0,
        calcium: 0
    },
    servings: [
        {
            id: "glass",
            label: "1 Can (330ml)",
            grams: 330
        },
        {
            id: "g100",
            label: "100ml",
            grams: 100
        }
    ],
    dietTypes: [
        "vegan",
        "veg",
        "jain",
        "nonveg"
    ],
    tags: [
        "snack",
        "high-sugar"
    ],
    isProcessed: true,
    isFastingFood: false,
    fastingTypes: [],
    isGlutenFree: true,
    isRecipe: false,
    containsRootVeg: false,
    hasBeverageModifiers: false,
    supportedConsistencyTypes: [],
    consistencyMultipliers: {},
    gi: 63,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: "USDA",
    confidence: "high"
}  ,
  {
    id: "beer",
    name: "Beer (Standard, 5% Alc)",
    nameAlt: [
        "kingfisher",
        "bira",
        "lager"
    ],
    hindiName: "बीयर",
    searchTerms: [
        "beer",
        "alcohol",
        "kingfisher",
        "bira",
        "drink"
    ],
    category: "drink",
    subcategory: "alcohol",
    itemType: "drink",
    state: "raw",
    region: "pan-indian",
    defaultServingGrams: 330,
    per100g: {
        calories: 43,
        protein: 0.5,
        carbs: 3.6,
        fat: 0,
        fiber: 0,
        sodium: 4,
        vitaminB12: 0,
        vitaminD: 0,
        iron: 0,
        calcium: 4
    },
    servings: [
        {
            id: "glass",
            label: "1 Pint/Can (330ml)",
            grams: 330
        },
        {
            id: "g100",
            label: "100ml",
            grams: 100
        }
    ],
    dietTypes: [
        "vegan",
        "veg",
        "jain",
        "nonveg"
    ],
    tags: [
        "snack",
        "high-calorie"
    ],
    isProcessed: true,
    isFastingFood: false,
    fastingTypes: [],
    isGlutenFree: false,
    isRecipe: false,
    containsRootVeg: false,
    hasBeverageModifiers: false,
    supportedConsistencyTypes: [],
    consistencyMultipliers: {},
    gi: 89,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: "USDA",
    confidence: "high"
}  ,
  {
    id: "ors-drink",
    name: "ORS (Oral Rehydration Solution)",
    nameAlt: [
        "ors water",
        "electral"
    ],
    hindiName: "ओआरएस",
    searchTerms: [
        "ors",
        "electral",
        "rehydration",
        "drink"
    ],
    category: "drink",
    subcategory: "hydration",
    itemType: "drink",
    state: "raw",
    region: "pan-indian",
    defaultServingGrams: 200,
    per100g: {
        calories: 15,
        protein: 0,
        carbs: 3.5,
        fat: 0,
        fiber: 0,
        sodium: 150,
        vitaminB12: 0,
        vitaminD: 0,
        iron: 0,
        calcium: 0
    },
    servings: [
        {
            id: "glass",
            label: "1 glass (200ml)",
            grams: 200
        },
        {
            id: "g100",
            label: "100ml",
            grams: 100
        }
    ],
    dietTypes: [
        "vegan",
        "veg",
        "jain",
        "nonveg"
    ],
    tags: [
        "hydration",
        "low-calorie"
    ],
    isProcessed: true,
    isFastingFood: true,
    fastingTypes: [
        "navratri",
        "ekadashi"
    ],
    isGlutenFree: true,
    isRecipe: false,
    containsRootVeg: false,
    hasBeverageModifiers: false,
    supportedConsistencyTypes: [],
    consistencyMultipliers: {},
    gi: 70,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: "healthifyme",
    confidence: "high"
}  ,
  {
    id: "protein-shake-homemade",
    name: "Protein Shake (1 Scoop + 200ml Milk)",
    nameAlt: [
        "whey with milk"
    ],
    hindiName: "प्रोटीन शेक",
    searchTerms: [
        "protein",
        "shake",
        "whey",
        "milk shake"
    ],
    category: "drink",
    subcategory: "milk-based",
    itemType: "drink",
    state: "raw",
    region: "pan-indian",
    defaultServingGrams: 230,
    per100g: {
        calories: 100,
        protein: 12,
        carbs: 7,
        fat: 3,
        fiber: 0,
        sodium: 60,
        vitaminB12: 0.5,
        vitaminD: 10,
        iron: 0.1,
        calcium: 150
    },
    servings: [
        {
            id: "glass",
            label: "1 shaker (230g)",
            grams: 230
        },
        {
            id: "g100",
            label: "100g",
            grams: 100
        }
    ],
    dietTypes: [
        "veg",
        "jain",
        "nonveg"
    ],
    tags: [
        "post-workout",
        "high-protein"
    ],
    isProcessed: true,
    isFastingFood: false,
    fastingTypes: [],
    isGlutenFree: true,
    isRecipe: true,
    containsRootVeg: false,
    hasBeverageModifiers: false,
    supportedConsistencyTypes: [],
    consistencyMultipliers: {},
    gi: 30,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: "healthifyme",
    confidence: "medium",
    notes: "Composite of 1 scoop (~30g) whey + 200ml toned milk."
}];' in indianFoods.js");
    process.exit(1);
}

let injectedString = "";
for (let i = 0; i < batch5Foods.length; i++) {
   injectedString += "  ,\n  " + JSON.stringify(batch5Foods[i], null, 4).replace(/"([^"]+)":/g, '$1:');
}
injectedString += "\n";

const newFileContent = fileContent.slice(0, insertIndex) + injectedString + fileContent.slice(insertIndex);

fs.writeFileSync(indianFoodsPath, newFileContent);
console.log("Successfully appended Batch 5 items to indianFoods.js");
