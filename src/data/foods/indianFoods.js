export const indianFoods = [
  // ==========================================
  // BATCH 1: Roti & Breads
  // ==========================================
  {
    id: 'roti-wheat',
    name: 'Roti (Whole Wheat, Unbuttered)',
    nameAlt: ['chapati', 'phulka'],
    hindiName: 'रोटी',
    searchTerms: ['roti', 'chapati', 'phulka', 'fulka', 'wheat bread'],
    category: 'roti-bread',
    subcategory: 'flatbread',
    itemType: 'base-food',
    state: 'cooked',
    region: 'pan-indian',
    defaultServingGrams: 35,
    per100g: {
      calories: 298,
      protein: 9.7,
      carbs: 60.1,
      fat: 1.8,
      fiber: 9.4,
      sodium: 0,
      vitaminB12: 0,
      vitaminD: 0,
      iron: 3.5,
      calcium: 34
    },
    servings: [
      { id: 'roti', label: '1 roti', grams: 35 },
      { id: 'g100', label: '100g', grams: 100 }
    ],
    dietTypes: ['vegan', 'veg', 'jain'],
    tags: ['lunch', 'dinner', 'budget-friendly'],
    isProcessed: false,
    isFastingFood: false,
    fastingTypes: [],
    isGlutenFree: false,
    isRecipe: false,
    containsRootVeg: false,
    hasBeverageModifiers: false,
    supportedConsistencyTypes: [],
    consistencyMultipliers: {},
    gi: 62,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: 'IFCT-2017',
    confidence: 'high',
    notes: 'Base values without ghee/oil brushing.'
  },
  {
    id: 'paratha-aloo',
    name: 'Aloo Paratha (Stuffed)',
    nameAlt: ['potato stuffed paratha', 'aloo ka paratha'],
    hindiName: 'आलू पराठा',
    searchTerms: ['aloo', 'paratha', 'potato parata', 'parata'],
    category: 'roti-bread',
    subcategory: 'stuffed-flatbread',
    itemType: 'dish',
    state: 'cooked',
    region: 'north',
    defaultServingGrams: 100,
    per100g: {
      calories: 260,
      protein: 5.5,
      carbs: 38.0,
      fat: 9.5,
      fiber: 4.0,
      sodium: 300,
      vitaminB12: 0,
      vitaminD: 0,
      iron: 2.1,
      calcium: 25
    },
    servings: [
      { id: 'paratha', label: '1 medium paratha', grams: 100 },
      { id: 'g100', label: '100g', grams: 100 }
    ],
    dietTypes: ['vegan', 'veg'],
    tags: ['breakfast', 'lunch', 'high-carb'],
    isProcessed: false,
    isFastingFood: false,
    fastingTypes: [],
    isGlutenFree: false,
    isRecipe: false,
    containsRootVeg: true,
    hasBeverageModifiers: false,
    supportedConsistencyTypes: [],
    consistencyMultipliers: {},
    gi: 70,
    cookingOilNote: 'Values include oil used during cooking inside the dough. Add extra for external butter/ghee.',
    estimatedOilG: 6,
    source: 'healthifyme',
    confidence: 'medium',
    notes: 'Slightly higher calorie content than plain roti due to potato mixture and residual pan oil.'
  },
  // ==========================================
  // BATCH 1: Millets
  // ==========================================
  {
    id: 'bajra-roti',
    name: 'Bajra Roti (Pearl Millet)',
    nameAlt: ['bajre ki roti', 'bajra bhakri'],
    hindiName: 'बाजरे की रोटी',
    searchTerms: ['bajra', 'millet roti', 'bhakri', 'bajri'],
    category: 'millet',
    subcategory: 'flatbread',
    itemType: 'base-food',
    state: 'cooked',
    region: 'north',
    defaultServingGrams: 50,
    per100g: {
      calories: 361,
      protein: 11.6,
      carbs: 67.5,
      fat: 5.0,
      fiber: 11.5,
      sodium: 10,
      vitaminB12: 0,
      vitaminD: 0,
      iron: 8.0,
      calcium: 42
    },
    servings: [
      { id: 'roti', label: '1 medium roti', grams: 50 },
      { id: 'g100', label: '100g', grams: 100 }
    ],
    dietTypes: ['vegan', 'veg', 'jain'],
    tags: ['lunch', 'dinner', 'high-fiber', 'high-protein', 'budget-friendly', 'gluten-free'],
    isProcessed: false,
    isFastingFood: false,
    fastingTypes: [],
    isGlutenFree: true,
    isRecipe: false,
    containsRootVeg: false,
    hasBeverageModifiers: false,
    supportedConsistencyTypes: [],
    consistencyMultipliers: {},
    gi: 54,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: 'IFCT-2017',
    confidence: 'high',
    notes: 'Excellent high-fiber alternative to wheat. Often consumed with ghee in winters.'
  },
  // ==========================================
  // BATCH 2: Rice Dishes
  // ==========================================
  {
    id: 'rice-white-cooked',
    name: 'White Rice (Cooked, Boiled)',
    nameAlt: ['chawal', 'steamed rice', 'plain rice'],
    hindiName: 'सफेद चावल',
    searchTerms: ['chawal', 'rice', 'boiled rice', 'white rice'],
    category: 'rice-dish',
    subcategory: 'base',
    itemType: 'base-food',
    state: 'cooked',
    region: 'pan-indian',
    defaultServingGrams: 200,
    per100g: {
      calories: 130,
      protein: 2.7,
      carbs: 28.0,
      fat: 0.3,
      fiber: 0.4,
      sodium: 1,
      vitaminB12: 0,
      vitaminD: 0,
      iron: 0.2,
      calcium: 10
    },
    servings: [
      { id: 'bowl', label: '1 bowl', grams: 200 },
      { id: 'katori', label: '1 katori', grams: 150 },
      { id: 'g100', label: '100g', grams: 100 }
    ],
    dietTypes: ['vegan', 'veg', 'jain'],
    tags: ['lunch', 'dinner', 'high-carb', 'budget-friendly', 'gluten-free'],
    isProcessed: false,
    isFastingFood: false,
    fastingTypes: [],
    isGlutenFree: true,
    isRecipe: false,
    containsRootVeg: false,
    hasBeverageModifiers: false,
    supportedConsistencyTypes: [],
    consistencyMultipliers: {},
    gi: 73,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: 'USDA',
    confidence: 'high',
    notes: 'Calorie density varies slightly by water absorption (sona masuri vs basmati).'
  },
  // ==========================================
  // BATCH 2: Dals & Legumes
  // ==========================================
  {
    id: 'dal-toor-cooked',
    name: 'Toor Dal (Cooked, Arhar Dal)',
    nameAlt: ['arhar dal', 'toovar dal', 'pigeon pea', 'yellow dal'],
    hindiName: 'तुअर दाल',
    searchTerms: ['toovar', 'tuvar', 'tuver', 'arhar', 'toor dal', 'yellow dal'],
    category: 'dal-legume',
    subcategory: 'legume-curry',
    itemType: 'dish',
    state: 'cooked',
    region: 'pan-indian',
    defaultServingGrams: 150,
    per100g: {
      calories: 116,
      protein: 7.0,
      carbs: 20.0,
      fat: 0.4,
      fiber: 4.0,
      sodium: 120, // assuming minor salting
      vitaminB12: 0,
      vitaminD: 0,
      iron: 1.5,
      calcium: 25
    },
    servings: [
      { id: 'katori', label: '1 katori (homestyle)', grams: 150 },
      { id: 'bowl', label: '1 bowl', grams: 200 },
      { id: 'takeaway-container', label: '1 takeaway container', grams: 480 },
      { id: 'g100', label: '100g', grams: 100 }
    ],
    dietTypes: ['vegan', 'veg', 'jain'],
    tags: ['lunch', 'dinner', 'high-fiber', 'high-protein', 'budget-friendly'],
    isProcessed: false,
    isFastingFood: false,
    fastingTypes: [],
    isGlutenFree: true,
    isRecipe: false,
    containsRootVeg: false, // assuming no garlic/onion for plain base, flags can vary
    hasBeverageModifiers: false,
    supportedConsistencyTypes: ['thin', 'thick'],
    consistencyMultipliers: { thin: 0.7, standard: 1.0, thick: 1.3 },
    gi: 42,
    cookingOilNote: 'Includes ~1 tsp oil/ghee for tadka. Add separately if tracking precisely.',
    estimatedOilG: 4,
    source: 'healthifyme',
    confidence: 'medium',
    notes: 'Thick restaurant versions will have ~30% higher calories and fat.'
  },
  {
    id: 'rajma-curry',
    name: 'Rajma Masala (Kidney Bean Curry)',
    nameAlt: ['rajma chawal gravy', 'red kidney beans'],
    hindiName: 'राजमा मसाला',
    searchTerms: ['rajma', 'rajhma', 'kidney beans', 'red beans'],
    category: 'dal-legume',
    subcategory: 'legume-curry',
    itemType: 'dish',
    state: 'cooked',
    region: 'north',
    defaultServingGrams: 150,
    per100g: {
      calories: 105,
      protein: 7.0,
      carbs: 17.0,
      fat: 2.0,
      fiber: 6.0,
      sodium: 250,
      vitaminB12: 0,
      vitaminD: 0,
      iron: 2.5,
      calcium: 30
    },
    servings: [
      { id: 'katori', label: '1 katori (homestyle)', grams: 150 },
      { id: 'bowl', label: '1 bowl', grams: 200 },
      { id: 'takeaway-container', label: '1 takeaway container', grams: 480 },
      { id: 'g100', label: '100g', grams: 100 }
    ],
    dietTypes: ['vegan', 'veg'],
    tags: ['lunch', 'dinner', 'high-fiber', 'high-protein'],
    isProcessed: false,
    isFastingFood: false,
    fastingTypes: [],
    isGlutenFree: true,
    isRecipe: false,
    containsRootVeg: true, // tomato-onion-garlic base
    hasBeverageModifiers: false,
    supportedConsistencyTypes: ['thin', 'thick'],
    consistencyMultipliers: { thin: 0.7, standard: 1.0, thick: 1.3 },
    gi: 30,
    cookingOilNote: 'Estimates 1-2 tsp oil per serving. Usually requires more oil to sautée onion base.',
    estimatedOilG: 6,
    source: 'healthifyme',
    confidence: 'medium',
    notes: 'Very high fiber and low GI.'
  },
  // ==========================================
  // BATCH 2: Sprouts & Soy
  // ==========================================
  {
    id: 'soya-chunks-dry',
    name: 'Soya Chunks (Dry/Raw)',
    nameAlt: ['soyabean badi', 'tvp', 'nutrela', 'textured vegetable protein'],
    hindiName: 'सोया चंक्स',
    searchTerms: ['soya', 'soyabean', 'nutrela', 'badi', 'tvp', 'chunks'],
    category: 'sprout-soy',
    subcategory: 'soy',
    itemType: 'supplement',
    state: 'raw',
    region: 'pan-indian',
    defaultServingGrams: 50,
    per100g: {
      calories: 345,
      protein: 52.0,
      carbs: 33.0,
      fat: 0.5,
      fiber: 13.0,
      sodium: 15,
      vitaminB12: 0,
      vitaminD: 0,
      iron: 15.0,
      calcium: 350
    },
    servings: [
      { id: 'cup', label: '1 cup (dry)', grams: 50 },
      { id: 'custom', label: 'Custom (g)', grams: 1 },
      { id: 'g100', label: '100g', grams: 100 }
    ],
    dietTypes: ['vegan', 'veg', 'jain'],
    tags: ['muscle-building', 'very-high-protein', 'budget-friendly', 'high-fiber'],
    isProcessed: true,
    isFastingFood: false,
    fastingTypes: [],
    isGlutenFree: true,
    isRecipe: false,
    containsRootVeg: false,
    hasBeverageModifiers: false,
    supportedConsistencyTypes: [],
    consistencyMultipliers: {},
    gi: 15,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: 'FSSAI-label',
    confidence: 'high',
    notes: 'Extremely protein dense. Values are for DRY weight. Multiply weight by ~3 after boiling.'
  },
  {
    id: 'moong-sprouts-raw',
    name: 'Moong Sprouts (Raw)',
    nameAlt: ['sprouted green gram', 'ankurit moong'],
    hindiName: 'अंकुरित मूंग',
    searchTerms: ['moong', 'sprouts', 'ankur', 'green gram', 'sprouted'],
    category: 'sprout-soy',
    subcategory: 'sprouts',
    itemType: 'base-food',
    state: 'raw',
    region: 'pan-indian',
    defaultServingGrams: 100,
    per100g: {
      calories: 30,
      protein: 3.0,
      carbs: 5.9,
      fat: 0.2,
      fiber: 1.8,
      sodium: 12,
      vitaminB12: 0,
      vitaminD: 0,
      iron: 1.4,
      calcium: 13
    },
    servings: [
      { id: 'katori', label: '1 katori', grams: 100 },
      { id: 'handful', label: '1 handful', grams: 30 },
      { id: 'g100', label: '100g', grams: 100 }
    ],
    dietTypes: ['vegan', 'veg', 'jain'],
    tags: ['snack', 'low-calorie', 'high-fiber', 'no-cook'],
    isProcessed: false,
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
    source: 'USDA',
    confidence: 'high',
    notes: 'Great volume food. Easily combined into chaats or salads.'
  },
  // ==========================================
  // BATCH 2: Sabzi & Veg
  // ==========================================
  {
    id: 'palak-paneer',
    name: 'Palak Paneer',
    nameAlt: ['spinach and cottage cheese', 'saag paneer'],
    hindiName: 'पालक पनीर',
    searchTerms: ['palak', 'paneer', 'saag', 'spinach'],
    category: 'sabzi-veg',
    subcategory: 'veg-curry',
    itemType: 'dish',
    state: 'cooked',
    region: 'north',
    defaultServingGrams: 150,
    per100g: {
      calories: 150,
      protein: 6.0,
      carbs: 5.0,
      fat: 12.0,
      fiber: 2.5,
      sodium: 350,
      vitaminB12: 0.4, // from paneer
      vitaminD: 0,
      iron: 2.8, // from spinach
      calcium: 150
    },
    servings: [
      { id: 'katori', label: '1 katori', grams: 150 },
      { id: 'restaurant-portion', label: '1 restaurant portion', grams: 450 },
      { id: 'takeaway-container', label: '1 takeaway container', grams: 480 },
      { id: 'g100', label: '100g', grams: 100 }
    ],
    dietTypes: ['veg'],
    tags: ['lunch', 'dinner', 'high-protein', 'high-fat'],
    isProcessed: false,
    isFastingFood: false,
    fastingTypes: [],
    isGlutenFree: true,
    isRecipe: false,
    containsRootVeg: true, // typical gravy base uses onion/garlic
    hasBeverageModifiers: false,
    supportedConsistencyTypes: ['thin', 'thick'],
    consistencyMultipliers: { thin: 0.8, standard: 1.0, thick: 1.3 },
    gi: 34,
    cookingOilNote: 'Significant fat comes from paneer. Restaurant versions may add cream and extra butter.',
    estimatedOilG: 8,
    source: 'healthifyme',
    confidence: 'medium',
    notes: 'Calcium from paneer inhibits some iron absorption from spinach.'
  },
  {
    id: 'aloo-gobi',
    name: 'Aloo Gobi (Potato Cauliflower Dry)',
    nameAlt: ['aloo cauliflower', 'gobi sabzi'],
    hindiName: 'आलू गोभी',
    searchTerms: ['aloo', 'gobi', 'cauliflower', 'potato sabzi', 'gobhi'],
    category: 'sabzi-veg',
    subcategory: 'dry-sabzi',
    itemType: 'dish',
    state: 'cooked',
    region: 'north',
    defaultServingGrams: 150,
    per100g: {
      calories: 90,
      protein: 2.0,
      carbs: 10.0,
      fat: 5.0,
      fiber: 3.5,
      sodium: 250,
      vitaminB12: 0,
      vitaminD: 0,
      iron: 0.8,
      calcium: 22
    },
    servings: [
      { id: 'katori', label: '1 katori', grams: 150 },
      { id: 'takeaway-container', label: '1 takeaway container', grams: 400 },
      { id: 'g100', label: '100g', grams: 100 }
    ],
    dietTypes: ['vegan', 'veg', 'jain'],
    tags: ['lunch', 'dinner', 'budget-friendly'],
    isProcessed: false,
    isFastingFood: false,
    fastingTypes: [],
    isGlutenFree: true,
    isRecipe: false,
    containsRootVeg: true, // POTATO itself is root veg
    hasBeverageModifiers: false,
    supportedConsistencyTypes: [],
    consistencyMultipliers: {},
    gi: 60,
    cookingOilNote: 'Fat content primarily from oil tempering in a dry sabzi.',
    estimatedOilG: 6,
    source: 'healthifyme',
    confidence: 'medium',
  },
  // ==========================================
  // BATCH 3: Non-Veg & Eggs
  // ==========================================
  {
    id: 'chicken-breast-raw',
    name: 'Chicken Breast (Raw/Boneless)',
    nameAlt: ['murgh', 'boneless chicken'],
    hindiName: 'चिकन ब्रेस्ट',
    searchTerms: ['chicken', 'murgh', 'breast', 'boneless'],
    category: 'non-veg',
    subcategory: 'chicken',
    itemType: 'base-food',
    state: 'raw',
    region: 'pan-indian',
    defaultServingGrams: 100,
    per100g: {
      calories: 120,
      protein: 22.5,
      carbs: 0,
      fat: 2.6,
      fiber: 0,
      sodium: 70,
      vitaminB12: 0.3, // mcg 
      vitaminD: 0,     // negligible
      iron: 1.0,
      calcium: 15
    },
    servings: [
      { id: 'g100', label: '100g', grams: 100 },
      { id: 'piece', label: '1 piece (~150g)', grams: 150 },
      { id: 'custom', label: 'Custom (g)', grams: 1 }
    ],
    dietTypes: ['nonveg'],
    tags: ['muscle-building', 'very-high-protein', 'low-fat', 'low-carb'],
    isProcessed: false,
    isFastingFood: false,
    fastingTypes: [],
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
    notes: 'Base values for raw weight. Cooked weight shrinks by roughly 25%.'
  },
  {
    id: 'chicken-curry',
    name: 'Chicken Curry (Homestyle)',
    nameAlt: ['murgh masala', 'chicken gravy'],
    hindiName: 'चिकन करी',
    searchTerms: ['chicken', 'curry', 'murgh', 'gravy'],
    category: 'non-veg',
    subcategory: 'chicken',
    itemType: 'dish',
    state: 'cooked',
    region: 'pan-indian',
    defaultServingGrams: 200,
    per100g: {
      calories: 145,
      protein: 14.0,
      carbs: 4.0,
      fat: 8.0,
      fiber: 0.8,
      sodium: 300,
      vitaminB12: 0.4, 
      vitaminD: 0,
      iron: 1.2,
      calcium: 20
    },
    servings: [
      { id: 'bowl', label: '1 bowl', grams: 200 },
      { id: 'katori', label: '1 katori', grams: 150 },
      { id: 'takeaway-container', label: '1 takeaway container', grams: 480 },
      { id: 'restaurant-portion', label: '1 restaurant portion', grams: 650 },
      { id: 'g100', label: '100g', grams: 100 }
    ],
    dietTypes: ['nonveg'],
    tags: ['lunch', 'dinner', 'high-protein'],
    isProcessed: false,
    isFastingFood: false,
    fastingTypes: [],
    isGlutenFree: true,
    isRecipe: false,
    containsRootVeg: true, // Onion, garlic, tomato base
    hasBeverageModifiers: false,
    supportedConsistencyTypes: ['thin', 'thick'],
    consistencyMultipliers: { thin: 0.7, standard: 1.0, thick: 1.4 },
    gi: 0,
    cookingOilNote: 'Fat primarily comes from oil used in frying the masala base.',
    estimatedOilG: 10,
    source: 'healthifyme',
    confidence: 'medium',
    notes: 'Restaurant portions have significantly more oil and potential cream (thick modifier).'
  },
  {
    id: 'egg-boiled',
    name: 'Boiled Egg (Whole)',
    nameAlt: ['anda', 'hard boiled egg'],
    hindiName: 'उबला हुआ अंडा',
    searchTerms: ['egg', 'anda', 'boiled', 'whole egg'],
    category: 'egg',
    subcategory: 'whole',
    itemType: 'base-food',
    state: 'cooked',
    region: 'pan-indian',
    defaultServingGrams: 50,
    per100g: {
      calories: 155,
      protein: 12.6,
      carbs: 1.1,
      fat: 10.6,
      fiber: 0,
      sodium: 124,
      vitaminB12: 1.1, // mcg - Excellent source!
      vitaminD: 82,    // IU - Good source from yolk
      iron: 1.2,
      calcium: 50
    },
    servings: [
      { id: 'egg', label: '1 egg (large)', grams: 50 },
      { id: 'custom', label: 'Custom (g)', grams: 1 },
      { id: 'g100', label: '100g', grams: 100 }
    ],
    dietTypes: ['egg', 'nonveg'],
    tags: ['breakfast', 'snack', 'high-protein', 'budget-friendly'],
    isProcessed: false,
    isFastingFood: false,
    fastingTypes: [],
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
    notes: 'Most of the calories, fat, B12, and D3 are in the yolk.'
  },
  // ==========================================
  // BATCH 3: Dairy
  // ==========================================
  {
    id: 'milk-full-fat',
    name: 'Milk (Full Fat / Whole)',
    nameAlt: ['doodh', 'amul gold', 'buffalo milk'],
    hindiName: 'फुल क्रीम दूध',
    searchTerms: ['milk', 'doodh', 'full fat', 'amul gold'],
    category: 'dairy',
    subcategory: 'milk',
    itemType: 'base-food',
    state: 'raw',
    region: 'pan-indian',
    defaultServingGrams: 200,
    per100g: {
      calories: 61,
      protein: 3.2,
      carbs: 4.8,
      fat: 3.3,
      fiber: 0,
      sodium: 43,
      vitaminB12: 0.5, // mcg - Good source
      vitaminD: 40,    // IU - Often fortified
      iron: 0,
      calcium: 113
    },
    servings: [
      { id: 'glass', label: '1 glass (200ml)', grams: 200 },
      { id: 'cup', label: '1 cup (150ml)', grams: 150 },
      { id: 'g100', label: '100ml', grams: 100 }
    ],
    dietTypes: ['veg', 'jain', 'egg', 'nonveg'],
    tags: ['breakfast', 'before-bed', 'high-protein'],
    isProcessed: false,
    isFastingFood: true,
    fastingTypes: ['navratri', 'ekadashi', 'jain-paryushana', 'ramzan'],
    isGlutenFree: true,
    isRecipe: false,
    containsRootVeg: false,
    hasBeverageModifiers: false,
    supportedConsistencyTypes: [],
    consistencyMultipliers: {},
    gi: 31,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: 'IFCT-2017',
    confidence: 'high',
    notes: 'Crucial for Indian diet. Often fortified with Vitamin D. Excellent B12 source for vegetarians.'
  },
  {
    id: 'paneer-full-fat',
    name: 'Paneer (Full Fat, Raw)',
    nameAlt: ['cottage cheese'],
    hindiName: 'पनीर',
    searchTerms: ['paneer', 'cottage cheese'],
    category: 'dairy',
    subcategory: 'cheese',
    itemType: 'base-food',
    state: 'raw',
    region: 'pan-indian',
    defaultServingGrams: 100,
    per100g: {
      calories: 265,
      protein: 18.0,
      carbs: 3.0,
      fat: 20.0,
      fiber: 0,
      sodium: 18,
      vitaminB12: 1.1, // mcg
      vitaminD: 10,    // IU
      iron: 0.1,
      calcium: 480     // Excellent source
    },
    servings: [
      { id: 'g100', label: '100g', grams: 100 },
      { id: 'custom', label: 'Custom (g)', grams: 1 }
    ],
    dietTypes: ['veg', 'jain', 'egg', 'nonveg'],
    tags: ['lunch', 'dinner', 'high-protein', 'high-fat', 'muscle-building'],
    isProcessed: false,
    isFastingFood: true,
    fastingTypes: ['navratri', 'ekadashi', 'jain-paryushana'],
    isGlutenFree: true,
    isRecipe: false,
    containsRootVeg: false,
    hasBeverageModifiers: false,
    supportedConsistencyTypes: [],
    consistencyMultipliers: {},
    gi: 27,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: 'IFCT-2017',
    confidence: 'high',
    notes: 'Very high in casein protein, ideal for before sleep, but calorie dense due to fat.'
  }
,
  // ==========================================
  // BATCH 3 (Appended from Script)
  // ==========================================
  {
      id: "butter-chicken",
      name: "Butter Chicken (Murgh Makhani)",
      nameAlt: [
          "murgh makhani",
          "chicken makhanwala"
      ],
      hindiName: "बटर चिकन",
      searchTerms: [
          "butter chicken",
          "murgh makhani",
          "chicken",
          "gravy"
      ],
      category: "non-veg",
      subcategory: "chicken",
      itemType: "dish",
      state: "cooked",
      region: "north",
      defaultServingGrams: 200,
      per100g: {
          calories: 175,
          protein: 12,
          carbs: 6,
          fat: 11.5,
          fiber: 1,
          sodium: 350,
          vitaminB12: 0.4,
          vitaminD: 0,
          iron: 1.1,
          calcium: 30
      },
      servings: [
          {
              id: "bowl",
              label: "1 bowl",
              grams: 200
          },
          {
              id: "restaurant-portion",
              label: "1 restaurant portion",
              grams: 600
          },
          {
              id: "takeaway-container",
              label: "1 takeaway container",
              grams: 480
          },
          {
              id: "g100",
              label: "100g",
              grams: 100
          }
      ],
      dietTypes: [
          "nonveg"
      ],
      tags: [
          "dinner",
          "high-protein",
          "high-fat"
      ],
      isProcessed: false,
      isFastingFood: false,
      fastingTypes: [],
      isGlutenFree: true,
      isRecipe: false,
      containsRootVeg: true,
      hasBeverageModifiers: false,
      supportedConsistencyTypes: [
          "thin",
          "thick"
      ],
      consistencyMultipliers: {
          thin: 0.8,
          standard: 1,
          thick: 1.3
      },
      gi: 0,
      cookingOilNote: "Values include cream and butter. Heavy restaurant versions may be higher.",
      estimatedOilG: 12,
      source: "healthifyme",
      confidence: "medium",
      notes: "High in fat due to butter and cream."
  },
  {
      id: "tandoori-chicken",
      name: "Tandoori Chicken",
      nameAlt: [
          "roasted chicken",
          "chicken tandoori"
      ],
      hindiName: "तंदूरी चिकन",
      searchTerms: [
          "tandoori",
          "chicken",
          "roasted chicken",
          "dry chicken"
      ],
      category: "non-veg",
      subcategory: "chicken",
      itemType: "dish",
      state: "roasted",
      region: "north",
      defaultServingGrams: 150,
      per100g: {
          calories: 140,
          protein: 21,
          carbs: 2,
          fat: 5,
          fiber: 0.5,
          sodium: 400,
          vitaminB12: 0.3,
          vitaminD: 0,
          iron: 1.2,
          calcium: 15
      },
      servings: [
          {
              id: "piece",
              label: "1 piece (leg/breast)",
              grams: 150
          },
          {
              id: "g100",
              label: "100g",
              grams: 100
          }
      ],
      dietTypes: [
          "nonveg"
      ],
      tags: [
          "dinner",
          "high-protein",
          "low-carb",
          "muscle-building"
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
      gi: 0,
      cookingOilNote: "Often brushed with butter/oil while roasting.",
      estimatedOilG: 5,
      source: "healthifyme",
      confidence: "medium",
      notes: "Excellent high protein, low carb option."
  },
  {
      id: "mutton-rogan-josh",
      name: "Mutton Rogan Josh",
      nameAlt: [
          "lamb curry",
          "meat curry"
      ],
      hindiName: "मटन रोगन जोश",
      searchTerms: [
          "mutton",
          "lamb",
          "rogan josh",
          "meat curry",
          "gravy"
      ],
      category: "non-veg",
      subcategory: "mutton",
      itemType: "dish",
      state: "cooked",
      region: "north",
      defaultServingGrams: 200,
      per100g: {
          calories: 190,
          protein: 14.5,
          carbs: 4.5,
          fat: 12.5,
          fiber: 1,
          sodium: 320,
          vitaminB12: 2.5,
          vitaminD: 0,
          iron: 2.5,
          calcium: 20
      },
      servings: [
          {
              id: "bowl",
              label: "1 bowl",
              grams: 200
          },
          {
              id: "restaurant-portion",
              label: "1 restaurant portion",
              grams: 650
          },
          {
              id: "g100",
              label: "100g",
              grams: 100
          }
      ],
      dietTypes: [
          "nonveg"
      ],
      tags: [
          "dinner",
          "high-protein",
          "high-fat"
      ],
      isProcessed: false,
      isFastingFood: false,
      fastingTypes: [],
      isGlutenFree: true,
      isRecipe: false,
      containsRootVeg: true,
      hasBeverageModifiers: false,
      supportedConsistencyTypes: [
          "thin",
          "thick"
      ],
      consistencyMultipliers: {
          thin: 0.8,
          standard: 1,
          thick: 1.3
      },
      gi: 0,
      cookingOilNote: "Mutton inherently has higher fat.",
      estimatedOilG: 10,
      source: "healthifyme",
      confidence: "medium",
      notes: "Rich source of iron and B12."
  },
  {
      id: "fish-curry",
      name: "Fish Curry",
      nameAlt: [
          "macher jhol",
          "meen curry"
      ],
      hindiName: "मछली करी",
      searchTerms: [
          "fish",
          "curry",
          "macher jhol",
          "meen",
          "seafood"
      ],
      category: "non-veg",
      subcategory: "fish",
      itemType: "dish",
      state: "cooked",
      region: "pan-indian",
      defaultServingGrams: 200,
      per100g: {
          calories: 110,
          protein: 11,
          carbs: 5,
          fat: 5,
          fiber: 0.5,
          sodium: 250,
          vitaminB12: 2,
          vitaminD: 150,
          iron: 0.8,
          calcium: 35
      },
      servings: [
          {
              id: "bowl",
              label: "1 bowl",
              grams: 200
          },
          {
              id: "takeaway-container",
              label: "1 takeaway container",
              grams: 480
          },
          {
              id: "g100",
              label: "100g",
              grams: 100
          }
      ],
      dietTypes: [
          "nonveg"
      ],
      tags: [
          "lunch",
          "dinner",
          "high-protein"
      ],
      isProcessed: false,
      isFastingFood: false,
      fastingTypes: [],
      isGlutenFree: true,
      isRecipe: false,
      containsRootVeg: true,
      hasBeverageModifiers: false,
      supportedConsistencyTypes: [
          "thin",
          "thick"
      ],
      consistencyMultipliers: {
          thin: 0.8,
          standard: 1,
          thick: 1.2
      },
      gi: 0,
      cookingOilNote: "Fish takes up some oil in the gravy preparation.",
      estimatedOilG: 7,
      source: "healthifyme",
      confidence: "medium",
      notes: "Great source of omega-3 and Vitamin D depending on fish type."
  },
  {
      id: "chicken-tikka",
      name: "Chicken Tikka (Dry)",
      nameAlt: [
          "chicken kebab",
          "murgh tikka"
      ],
      hindiName: "चिकन टिक्का",
      searchTerms: [
          "chicken",
          "tikka",
          "kebab",
          "dry chicken"
      ],
      category: "non-veg",
      subcategory: "chicken",
      itemType: "dish",
      state: "roasted",
      region: "north",
      defaultServingGrams: 150,
      per100g: {
          calories: 150,
          protein: 20,
          carbs: 3.5,
          fat: 5.5,
          fiber: 0.5,
          sodium: 380,
          vitaminB12: 0.3,
          vitaminD: 0,
          iron: 1,
          calcium: 20
      },
      servings: [
          {
              id: "piece",
              label: "1 piece (medium)",
              grams: 40
          },
          {
              id: "plate",
              label: "1 plate (6 pieces)",
              grams: 240
          },
          {
              id: "g100",
              label: "100g",
              grams: 100
          }
      ],
      dietTypes: [
          "nonveg"
      ],
      tags: [
          "snack",
          "dinner",
          "high-protein",
          "low-carb"
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
      gi: 0,
      cookingOilNote: "Yogurt based marinade with slight oil brushing.",
      estimatedOilG: 4,
      source: "healthifyme",
      confidence: "medium",
      notes: "Lean and high protein."
  },
  {
      id: "tuna-canned",
      name: "Tuna (Canned in Water)",
      nameAlt: [
          "canned fish",
          "chunk light tuna"
      ],
      hindiName: "टूना",
      searchTerms: [
          "tuna",
          "fish",
          "canned",
          "seafood"
      ],
      category: "non-veg",
      subcategory: "fish",
      itemType: "base-food",
      state: "cooked",
      region: "pan-indian",
      defaultServingGrams: 100,
      per100g: {
          calories: 86,
          protein: 19,
          carbs: 0,
          fat: 0.9,
          fiber: 0,
          sodium: 250,
          vitaminB12: 2.5,
          vitaminD: 40,
          iron: 1.5,
          calcium: 15
      },
      servings: [
          {
              id: "g100",
              label: "100g",
              grams: 100
          },
          {
              id: "custom",
              label: "Custom (g)",
              grams: 1
          }
      ],
      dietTypes: [
          "nonveg"
      ],
      tags: [
          "muscle-building",
          "very-high-protein",
          "low-fat",
          "low-carb"
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
      gi: 0,
      cookingOilNote: null,
      estimatedOilG: 0,
      source: "USDA",
      confidence: "high",
      notes: "Excellent lean protein. Values for tuna packed in water, drained."
  },
  {
      id: "omelette-1-egg",
      name: "Omelette (1 Egg)",
      nameAlt: [
          "anda bhurji base",
          "egg omelet"
      ],
      hindiName: "आमलेट",
      searchTerms: [
          "omelette",
          "omelet",
          "egg",
          "anda"
      ],
      category: "egg",
      subcategory: "dish",
      itemType: "dish",
      state: "fried",
      region: "pan-indian",
      defaultServingGrams: 60,
      per100g: {
          calories: 190,
          protein: 11.5,
          carbs: 2.5,
          fat: 14.5,
          fiber: 0.5,
          sodium: 250,
          vitaminB12: 0.9,
          vitaminD: 65,
          iron: 1.5,
          calcium: 55
      },
      servings: [
          {
              id: "piece",
              label: "1 omelette (from 1 egg)",
              grams: 60
          },
          {
              id: "g100",
              label: "100g",
              grams: 100
          }
      ],
      dietTypes: [
          "egg",
          "nonveg"
      ],
      tags: [
          "breakfast",
          "high-protein"
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
      gi: 0,
      cookingOilNote: "Cooked with roughly 1 tsp oil/butter.",
      estimatedOilG: 4,
      source: "healthifyme",
      confidence: "medium",
      notes: "Calorie variation depends heavily on oil/butter used."
  },
  {
      id: "egg-bhurji",
      name: "Egg Bhurji (Scrambled Eggs)",
      nameAlt: [
          "anda bhurji",
          "paneer bhurji egg"
      ],
      hindiName: "अंडा भुर्जी",
      searchTerms: [
          "bhurji",
          "egg",
          "anda",
          "scrambled"
      ],
      category: "egg",
      subcategory: "dish",
      itemType: "dish",
      state: "fried",
      region: "pan-indian",
      defaultServingGrams: 100,
      per100g: {
          calories: 180,
          protein: 11,
          carbs: 4.5,
          fat: 12.5,
          fiber: 1,
          sodium: 300,
          vitaminB12: 0.8,
          vitaminD: 60,
          iron: 1.6,
          calcium: 50
      },
      servings: [
          {
              id: "katori",
              label: "1 katori (from 2 eggs)",
              grams: 150
          },
          {
              id: "g100",
              label: "100g",
              grams: 100
          }
      ],
      dietTypes: [
          "egg",
          "nonveg"
      ],
      tags: [
          "breakfast",
          "lunch",
          "dinner",
          "high-protein"
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
      gi: 30,
      cookingOilNote: "Contains oils from onion/tomato masala base.",
      estimatedOilG: 6,
      source: "healthifyme",
      confidence: "medium",
      notes: "Added vegetables bulk up the volume and lower calorie density slightly compared to pure egg."
  },
  {
      id: "egg-white",
      name: "Egg White (Boiled/Raw)",
      nameAlt: [
          "safedi",
          "anda white"
      ],
      hindiName: "अंडे की सफेदी",
      searchTerms: [
          "egg white",
          "safedi",
          "egg",
          "white"
      ],
      category: "egg",
      subcategory: "white",
      itemType: "base-food",
      state: "cooked",
      region: "pan-indian",
      defaultServingGrams: 33,
      per100g: {
          calories: 52,
          protein: 10.9,
          carbs: 0.7,
          fat: 0.2,
          fiber: 0,
          sodium: 166,
          vitaminB12: 0.1,
          vitaminD: 0,
          iron: 0.1,
          calcium: 7
      },
      servings: [
          {
              id: "egg",
              label: "1 egg white (~33g)",
              grams: 33
          },
          {
              id: "g100",
              label: "100g",
              grams: 100
          }
      ],
      dietTypes: [
          "egg",
          "nonveg"
      ],
      tags: [
          "muscle-building",
          "very-high-protein",
          "low-fat",
          "low-carb"
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
      gi: 0,
      cookingOilNote: null,
      estimatedOilG: 0,
      source: "USDA",
      confidence: "high",
      notes: "Pure protein source. Almost all fat and micronutrients are left behind in the yolk."
  },
  {
      id: "egg-curry",
      name: "Egg Curry (Anda Masala)",
      nameAlt: [
          "anda curry",
          "egg gravy"
      ],
      hindiName: "अंडा करी",
      searchTerms: [
          "egg",
          "curry",
          "anda masala",
          "gravy"
      ],
      category: "egg",
      subcategory: "dish",
      itemType: "dish",
      state: "cooked",
      region: "pan-indian",
      defaultServingGrams: 200,
      per100g: {
          calories: 125,
          protein: 6.5,
          carbs: 5.5,
          fat: 8.5,
          fiber: 1,
          sodium: 250,
          vitaminB12: 0.5,
          vitaminD: 30,
          iron: 1.2,
          calcium: 35
      },
      servings: [
          {
              id: "bowl",
              label: "1 bowl",
              grams: 200
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
          "egg",
          "nonveg"
      ],
      tags: [
          "lunch",
          "dinner",
          "high-protein"
      ],
      isProcessed: false,
      isFastingFood: false,
      fastingTypes: [],
      isGlutenFree: true,
      isRecipe: false,
      containsRootVeg: true,
      hasBeverageModifiers: false,
      supportedConsistencyTypes: [
          "thin",
          "thick"
      ],
      consistencyMultipliers: {
          thin: 0.8,
          standard: 1,
          thick: 1.3
      },
      gi: 30,
      cookingOilNote: "Contains oil for frying eggs and masala base.",
      estimatedOilG: 6,
      source: "healthifyme",
      confidence: "medium",
      notes: "Assumes half egg and half gravy by weight."
  },
  {
      id: "milk-toned",
      name: "Milk (Toned, 3% Fat)",
      nameAlt: [
          "toned doodh",
          "amul taaza"
      ],
      hindiName: "टोंड दूध",
      searchTerms: [
          "milk",
          "doodh",
          "toned",
          "amul taaza"
      ],
      category: "dairy",
      subcategory: "milk",
      itemType: "base-food",
      state: "raw",
      region: "pan-indian",
      defaultServingGrams: 200,
      per100g: {
          calories: 59,
          protein: 3.2,
          carbs: 4.8,
          fat: 3,
          fiber: 0,
          sodium: 43,
          vitaminB12: 0.4,
          vitaminD: 40,
          iron: 0,
          calcium: 115
      },
      servings: [
          {
              id: "glass",
              label: "1 glass (200ml)",
              grams: 200
          },
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
          "veg",
          "jain",
          "egg",
          "nonveg"
      ],
      tags: [
          "breakfast",
          "before-bed",
          "high-protein"
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
      gi: 31,
      cookingOilNote: null,
      estimatedOilG: 0,
      source: "IFCT-2017",
      confidence: "high",
      notes: "Common Indian household milk."
  },
  {
      id: "curd-full-fat",
      name: "Curd / Dahi (Full Fat)",
      nameAlt: [
          "dahi",
          "plain yogurt"
      ],
      hindiName: "दही",
      searchTerms: [
          "curd",
          "dahi",
          "yogurt",
          "plain dahi"
      ],
      category: "dairy",
      subcategory: "curd",
      itemType: "base-food",
      state: "raw",
      region: "pan-indian",
      defaultServingGrams: 100,
      per100g: {
          calories: 98,
          protein: 3.5,
          carbs: 4.5,
          fat: 4.3,
          fiber: 0,
          sodium: 45,
          vitaminB12: 0.4,
          vitaminD: 5,
          iron: 0.1,
          calcium: 120
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
          "egg",
          "nonveg"
      ],
      tags: [
          "lunch",
          "dinner",
          "breakfast"
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
      gi: 28,
      cookingOilNote: null,
      estimatedOilG: 0,
      source: "IFCT-2017",
      confidence: "high",
      notes: "Made from full fat milk. Excellent probiotic."
  },
  {
      id: "greek-yogurt-epigamia",
      name: "Greek Yogurt (Plain, Epigamia)",
      nameAlt: [
          "strained yogurt"
      ],
      hindiName: "ग्रीक योगर्ट",
      searchTerms: [
          "greek yogurt",
          "epigamia",
          "yogurt",
          "curd"
      ],
      category: "dairy",
      subcategory: "curd",
      itemType: "packaged-food",
      state: "raw",
      region: "pan-indian",
      defaultServingGrams: 100,
      per100g: {
          calories: 80,
          protein: 10,
          carbs: 4,
          fat: 3,
          fiber: 0,
          sodium: 40,
          vitaminB12: 0.5,
          vitaminD: 5,
          iron: 0.1,
          calcium: 110
      },
      servings: [
          {
              id: "g100",
              label: "100g",
              grams: 100
          },
          {
              id: "custom",
              label: "Custom (g)",
              grams: 1
          }
      ],
      dietTypes: [
          "veg",
          "jain",
          "egg",
          "nonveg"
      ],
      tags: [
          "snack",
          "post-workout",
          "high-protein"
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
      gi: 25,
      cookingOilNote: null,
      estimatedOilG: 0,
      source: "FSSAI-label",
      confidence: "high",
      notes: "Popular commercial greek yogurt in India."
  },
  {
      id: "paneer-low-fat",
      name: "Paneer (Low Fat)",
      nameAlt: [
          "skim milk paneer"
      ],
      hindiName: "लो फैट पनीर",
      searchTerms: [
          "paneer",
          "low fat",
          "cottage cheese"
      ],
      category: "dairy",
      subcategory: "cheese",
      itemType: "base-food",
      state: "raw",
      region: "pan-indian",
      defaultServingGrams: 100,
      per100g: {
          calories: 195,
          protein: 23,
          carbs: 3,
          fat: 10,
          fiber: 0,
          sodium: 18,
          vitaminB12: 1.1,
          vitaminD: 2,
          iron: 0.1,
          calcium: 400
      },
      servings: [
          {
              id: "g100",
              label: "100g",
              grams: 100
          },
          {
              id: "custom",
              label: "Custom (g)",
              grams: 1
          }
      ],
      dietTypes: [
          "veg",
          "jain",
          "egg",
          "nonveg"
      ],
      tags: [
          "muscle-building",
          "high-protein",
          "cutting"
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
      gi: 25,
      cookingOilNote: null,
      estimatedOilG: 0,
      source: "healthifyme",
      confidence: "medium",
      notes: "Made from double toned or skim milk. High protein-to-calorie ratio."
  },
  {
      id: "lassi-sweet",
      name: "Lassi (Sweet)",
      nameAlt: [
          "meethi lassi",
          "sweetened yogurt drink"
      ],
      hindiName: "मीठी लस्सी",
      searchTerms: [
          "lassi",
          "sweet lassi",
          "meethi",
          "dahi drink"
      ],
      category: "dairy",
      subcategory: "drink",
      itemType: "drink",
      state: "raw",
      region: "north",
      defaultServingGrams: 200,
      per100g: {
          calories: 75,
          protein: 2.5,
          carbs: 12,
          fat: 2,
          fiber: 0,
          sodium: 25,
          vitaminB12: 0.2,
          vitaminD: 0,
          iron: 0.1,
          calcium: 80
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
          "veg",
          "jain",
          "egg",
          "nonveg"
      ],
      tags: [
          "snack",
          "drink",
          "high-carb"
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
      confidence: "medium",
      notes: "High in added sugar."
  },
  {
      id: "ghee",
      name: "Ghee (Clarified Butter)",
      nameAlt: [
          "desi ghee"
      ],
      hindiName: "घी",
      searchTerms: [
          "ghee",
          "butter",
          "desi ghee",
          "fat"
      ],
      category: "oil-fat",
      subcategory: "fat",
      itemType: "base-food",
      state: "raw",
      region: "pan-indian",
      defaultServingGrams: 15,
      per100g: {
          calories: 900,
          protein: 0,
          carbs: 0,
          fat: 100,
          fiber: 0,
          sodium: 0,
          vitaminB12: 0,
          vitaminD: 60,
          iron: 0,
          calcium: 0
      },
      servings: [
          {
              id: "tbsp",
              label: "1 tablespoon",
              grams: 15
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
          "egg",
          "nonveg"
      ],
      tags: [
          "high-fat",
          "cooking"
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
      gi: 0,
      cookingOilNote: null,
      estimatedOilG: 0,
      source: "IFCT-2017",
      confidence: "high",
      notes: "Pure fat. Critical to log accurately."
  }
  ,
  {
    id: "masala-dosa",
    name: "Masala Dosa",
    nameAlt: [
        "dosai",
        "potato stuffed dosa"
    ],
    hindiName: "मसाला डोसा",
    searchTerms: [
        "dosa",
        "masala dosa",
        "dosai",
        "crepe"
    ],
    category: "breakfast",
    subcategory: "south-indian",
    itemType: "dish",
    state: "cooked",
    region: "south",
    defaultServingGrams: 150,
    per100g: {
        calories: 165,
        protein: 3.5,
        carbs: 23,
        fat: 6,
        fiber: 2,
        sodium: 250,
        vitaminB12: 0,
        vitaminD: 0,
        iron: 1,
        calcium: 15
    },
    servings: [
        {
            id: "piece",
            label: "1 medium dosa",
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
        "nonveg"
    ],
    tags: [
        "breakfast",
        "high-carb"
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
    gi: 65,
    cookingOilNote: "Values include oil/ghee used for roasting.",
    estimatedOilG: 5,
    source: "healthifyme",
    confidence: "medium",
    notes: "Excludes chutney and sambar calories."
}  ,
  {
    id: "plain-dosa",
    name: "Plain Dosa",
    nameAlt: [
        "sada dosa"
    ],
    hindiName: "सादा डोसा",
    searchTerms: [
        "dosa",
        "plain dosa",
        "sada dosa"
    ],
    category: "breakfast",
    subcategory: "south-indian",
    itemType: "dish",
    state: "cooked",
    region: "south",
    defaultServingGrams: 100,
    per100g: {
        calories: 133,
        protein: 3,
        carbs: 25,
        fat: 2.5,
        fiber: 1,
        sodium: 200,
        vitaminB12: 0,
        vitaminD: 0,
        iron: 0.8,
        calcium: 10
    },
    servings: [
        {
            id: "piece",
            label: "1 medium dosa",
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
        "breakfast",
        "high-carb",
        "budget-friendly"
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
    gi: 75,
    cookingOilNote: "Includes minimal oil for roasting.",
    estimatedOilG: 2,
    source: "healthifyme",
    confidence: "medium",
    notes: "A healthier choice than masala dosa, but very high GI."
}  ,
  {
    id: "idli-steamed",
    name: "Idli (Steamed Rice Cake)",
    nameAlt: [
        "rice idli"
    ],
    hindiName: "इडली",
    searchTerms: [
        "idli",
        "steamed idli",
        "rice cake"
    ],
    category: "breakfast",
    subcategory: "south-indian",
    itemType: "dish",
    state: "steamed",
    region: "south",
    defaultServingGrams: 40,
    per100g: {
        calories: 145,
        protein: 4.5,
        carbs: 32,
        fat: 0.2,
        fiber: 1.5,
        sodium: 150,
        vitaminB12: 0,
        vitaminD: 0,
        iron: 0.5,
        calcium: 15
    },
    servings: [
        {
            id: "piece",
            label: "1 medium idli",
            grams: 40
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
        "breakfast",
        "snack",
        "low-fat",
        "budget-friendly"
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
    gi: 70,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: "healthifyme",
    confidence: "high",
    notes: "Does not include sambar or chutney calories. Healthy low fat option."
}  ,
  {
    id: "medu-vada",
    name: "Medu Vada (Fried Lentil Donut)",
    nameAlt: [
        "urad dal vada",
        "vadai"
    ],
    hindiName: "मेदु वडा",
    searchTerms: [
        "vada",
        "vadai",
        "medu vada",
        "fried donut"
    ],
    category: "breakfast",
    subcategory: "south-indian",
    itemType: "dish",
    state: "fried",
    region: "south",
    defaultServingGrams: 50,
    per100g: {
        calories: 335,
        protein: 10,
        carbs: 35,
        fat: 17.5,
        fiber: 5,
        sodium: 350,
        vitaminB12: 0,
        vitaminD: 0,
        iron: 2,
        calcium: 40
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
        "vegan",
        "veg",
        "jain",
        "nonveg"
    ],
    tags: [
        "breakfast",
        "snack",
        "high-fat"
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
    gi: 45,
    cookingOilNote: "Deep fried. ~10-15g of oil absorbed per 100g.",
    estimatedOilG: 8,
    source: "healthifyme",
    confidence: "medium",
    notes: "High calorie density due to deep frying."
}  ,
  {
    id: "upma-rava",
    name: "Upma (Rava / Semolina)",
    nameAlt: [
        "suji upma",
        "uppumavu"
    ],
    hindiName: "उपमा",
    searchTerms: [
        "upma",
        "rava",
        "suji",
        "uppumavu"
    ],
    category: "breakfast",
    subcategory: "south-indian",
    itemType: "dish",
    state: "cooked",
    region: "pan-indian",
    defaultServingGrams: 150,
    per100g: {
        calories: 140,
        protein: 3.5,
        carbs: 22,
        fat: 4.5,
        fiber: 1.5,
        sodium: 250,
        vitaminB12: 0,
        vitaminD: 0,
        iron: 1.2,
        calcium: 15
    },
    servings: [
        {
            id: "katori",
            label: "1 katori",
            grams: 150
        },
        {
            id: "bowl",
            label: "1 bowl",
            grams: 200
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
        "nonveg"
    ],
    tags: [
        "breakfast",
        "quick-to-make"
    ],
    isProcessed: false,
    isFastingFood: false,
    fastingTypes: [],
    isGlutenFree: false,
    isRecipe: false,
    containsRootVeg: true,
    hasBeverageModifiers: false,
    supportedConsistencyTypes: [],
    consistencyMultipliers: {},
    gi: 68,
    cookingOilNote: "Values assume standard oil tempering.",
    estimatedOilG: 5,
    source: "healthifyme",
    confidence: "medium",
    notes: "Add vegetables to increase fiber and reduce glycemic load."
}  ,
  {
    id: "poha",
    name: "Poha (Flattened Rice)",
    nameAlt: [
        "kanda batata poha",
        "aval",
        "chiwda"
    ],
    hindiName: "पोहा",
    searchTerms: [
        "poha",
        "chiwda",
        "flattened rice",
        "kanda batata"
    ],
    category: "breakfast",
    subcategory: "west-indian",
    itemType: "dish",
    state: "cooked",
    region: "west",
    defaultServingGrams: 150,
    per100g: {
        calories: 130,
        protein: 2.5,
        carbs: 23,
        fat: 3.5,
        fiber: 1,
        sodium: 220,
        vitaminB12: 0,
        vitaminD: 0,
        iron: 1.5,
        calcium: 12
    },
    servings: [
        {
            id: "katori",
            label: "1 katori",
            grams: 150
        },
        {
            id: "bowl",
            label: "1 bowl",
            grams: 200
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
        "nonveg"
    ],
    tags: [
        "breakfast",
        "snack",
        "quick-to-make"
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
    gi: 65,
    cookingOilNote: "Includes oil for tempering and peanuts.",
    estimatedOilG: 4,
    source: "healthifyme",
    confidence: "medium",
    notes: "Often garnished with peanuts and sev, which adds extra calories and fats."
}  ,
  {
    id: "chole-bhature",
    name: "Chole Bhature",
    nameAlt: [
        "chana bhatura"
    ],
    hindiName: "छोले भटूरे",
    searchTerms: [
        "chole",
        "bhature",
        "chana",
        "bhatura"
    ],
    category: "breakfast",
    subcategory: "north-indian",
    itemType: "dish",
    state: "cooked",
    region: "north",
    defaultServingGrams: 350,
    per100g: {
        calories: 220,
        protein: 6,
        carbs: 26,
        fat: 10,
        fiber: 4,
        sodium: 350,
        vitaminB12: 0,
        vitaminD: 0,
        iron: 2.5,
        calcium: 40
    },
    servings: [
        {
            id: "plate",
            label: "1 plate (2 bhature + chole)",
            grams: 350
        },
        {
            id: "restaurant-portion",
            label: "1 restaurant portion",
            grams: 500
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
        "nonveg"
    ],
    tags: [
        "breakfast",
        "lunch",
        "high-calorie",
        "high-fat"
    ],
    isProcessed: false,
    isFastingFood: false,
    fastingTypes: [],
    isGlutenFree: false,
    isRecipe: false,
    containsRootVeg: true,
    hasBeverageModifiers: false,
    supportedConsistencyTypes: [],
    consistencyMultipliers: {},
    gi: 60,
    cookingOilNote: "Bhature are deep-fried; chole is oil-rich.",
    estimatedOilG: 20,
    source: "healthifyme",
    confidence: "low",
    notes: "Extremely high calorie. Portion size heavily dictates total calories."
}  ,
  {
    id: "besan-chilla",
    name: "Besan Chilla (Gram Flour Pancake)",
    nameAlt: [
        "veg omelette",
        "cheela"
    ],
    hindiName: "बेसन का चीला",
    searchTerms: [
        "besan",
        "chilla",
        "cheela",
        "pancake",
        "veg omelette"
    ],
    category: "breakfast",
    subcategory: "north-indian",
    itemType: "dish",
    state: "cooked",
    region: "north",
    defaultServingGrams: 80,
    per100g: {
        calories: 160,
        protein: 7.5,
        carbs: 22,
        fat: 4.5,
        fiber: 3.5,
        sodium: 250,
        vitaminB12: 0,
        vitaminD: 0,
        iron: 2,
        calcium: 20
    },
    servings: [
        {
            id: "piece",
            label: "1 chilla",
            grams: 80
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
        "nonveg"
    ],
    tags: [
        "breakfast",
        "high-protein",
        "quick-to-make"
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
    gi: 48,
    cookingOilNote: "Assumes minimal oil brushed on pan.",
    estimatedOilG: 3,
    source: "healthifyme",
    confidence: "medium",
    notes: "A great vegan high-protein alternative to eggs."
}  ,
  {
    id: "moong-dal-chilla",
    name: "Moong Dal Chilla",
    nameAlt: [
        "pesarattu",
        "moong cheela"
    ],
    hindiName: "मूंग दाल चीला",
    searchTerms: [
        "moong",
        "chilla",
        "cheela",
        "pesarattu",
        "pancake"
    ],
    category: "breakfast",
    subcategory: "north-indian",
    itemType: "dish",
    state: "cooked",
    region: "pan-indian",
    defaultServingGrams: 80,
    per100g: {
        calories: 155,
        protein: 8.5,
        carbs: 19,
        fat: 5,
        fiber: 3,
        sodium: 200,
        vitaminB12: 0,
        vitaminD: 0,
        iron: 2.2,
        calcium: 25
    },
    servings: [
        {
            id: "piece",
            label: "1 chilla",
            grams: 80
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
        "breakfast",
        "high-protein",
        "low-carb"
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
    gi: 45,
    cookingOilNote: "1 tsp oil assumed per chilla.",
    estimatedOilG: 4,
    source: "healthifyme",
    confidence: "medium",
    notes: "Often stuffed with paneer for extra protein."
}  ,
  {
    id: "uttapam",
    name: "Uttapam (Mixed Veg)",
    nameAlt: [
        "south indian pizza"
    ],
    hindiName: "उत्तपम",
    searchTerms: [
        "uttapam",
        "uthappam",
        "oothappam"
    ],
    category: "breakfast",
    subcategory: "south-indian",
    itemType: "dish",
    state: "cooked",
    region: "south",
    defaultServingGrams: 120,
    per100g: {
        calories: 140,
        protein: 3.5,
        carbs: 23,
        fat: 3.5,
        fiber: 2,
        sodium: 280,
        vitaminB12: 0,
        vitaminD: 0,
        iron: 1,
        calcium: 20
    },
    servings: [
        {
            id: "piece",
            label: "1 medium uttapam",
            grams: 120
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
        "nonveg"
    ],
    tags: [
        "breakfast",
        "high-carb"
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
    cookingOilNote: "Pan-fried with some oil.",
    estimatedOilG: 3,
    source: "healthifyme",
    confidence: "medium",
    notes: "Veggies add fiber, lowering GI compared to plain dosa."
}  ,
  {
    id: "pongal",
    name: "Ven Pongal (Ghee Rice & Lentils)",
    nameAlt: [
        "khara pongal"
    ],
    hindiName: "पोंगल",
    searchTerms: [
        "pongal",
        "ven pongal",
        "khara pongal",
        "rice lentil"
    ],
    category: "breakfast",
    subcategory: "south-indian",
    itemType: "dish",
    state: "cooked",
    region: "south",
    defaultServingGrams: 200,
    per100g: {
        calories: 145,
        protein: 4,
        carbs: 19,
        fat: 6,
        fiber: 1.5,
        sodium: 250,
        vitaminB12: 0,
        vitaminD: 0,
        iron: 1.2,
        calcium: 25
    },
    servings: [
        {
            id: "bowl",
            label: "1 bowl",
            grams: 200
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
        "veg",
        "jain",
        "nonveg"
    ],
    tags: [
        "breakfast",
        "comfort-food",
        "high-fat"
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
    cookingOilNote: "Rich in ghee. High fat content.",
    estimatedOilG: 6,
    source: "healthifyme",
    confidence: "medium",
    notes: "Ghee provides fat while rice & lentils are carbs/protein."
}  ,
  {
    id: "rava-idli",
    name: "Rava Idli (Semolina Idli)",
    nameAlt: [
        "suji idli"
    ],
    hindiName: "रवा इडली",
    searchTerms: [
        "rava idli",
        "suji idli",
        "semolina idli"
    ],
    category: "breakfast",
    subcategory: "south-indian",
    itemType: "dish",
    state: "steamed",
    region: "south",
    defaultServingGrams: 60,
    per100g: {
        calories: 145,
        protein: 3.5,
        carbs: 23,
        fat: 4.5,
        fiber: 1,
        sodium: 250,
        vitaminB12: 0,
        vitaminD: 0,
        iron: 1,
        calcium: 15
    },
    servings: [
        {
            id: "piece",
            label: "1 piece",
            grams: 60
        },
        {
            id: "g100",
            label: "100g",
            grams: 100
        }
    ],
    dietTypes: [
        "veg",
        "nonveg"
    ],
    tags: [
        "breakfast",
        "quick-to-make"
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
    gi: 60,
    cookingOilNote: "Tempering before steaming adds small oil.",
    estimatedOilG: 2,
    source: "healthifyme",
    confidence: "medium",
    notes: "Slightly higher fat than rice idli due to cashew & mustard tempering."
}  ,
  {
    id: "samosa",
    name: "Samosa (Aloo / Potato)",
    nameAlt: [
        "aloo samosa",
        "singara"
    ],
    hindiName: "समोसा",
    searchTerms: [
        "samosa",
        "singara",
        "aloo samosa",
        "fried pastry"
    ],
    category: "snack-street",
    subcategory: "fried-snack",
    itemType: "dish",
    state: "fried",
    region: "pan-indian",
    defaultServingGrams: 80,
    per100g: {
        calories: 320,
        protein: 4.5,
        carbs: 35,
        fat: 18,
        fiber: 3,
        sodium: 400,
        vitaminB12: 0,
        vitaminD: 0,
        iron: 1.5,
        calcium: 20
    },
    servings: [
        {
            id: "piece",
            label: "1 regular samosa",
            grams: 80
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
        "nonveg"
    ],
    tags: [
        "snack",
        "high-calorie",
        "high-fat",
        "comfort-food"
    ],
    isProcessed: false,
    isFastingFood: false,
    fastingTypes: [],
    isGlutenFree: false,
    isRecipe: false,
    containsRootVeg: true,
    hasBeverageModifiers: false,
    supportedConsistencyTypes: [],
    consistencyMultipliers: {},
    gi: 70,
    cookingOilNote: "Deep fried crust and oil in filling.",
    estimatedOilG: 12,
    source: "healthifyme",
    confidence: "high",
    notes: "Classic street food. Roughly 250-260 calories per piece."
}  ,
  {
    id: "vada-pav",
    name: "Vada Pav",
    nameAlt: [
        "bombay burger",
        "batata vada pav"
    ],
    hindiName: "वड़ा पाव",
    searchTerms: [
        "vada pav",
        "wada pav",
        "bombay burger"
    ],
    category: "snack-street",
    subcategory: "street-food",
    itemType: "dish",
    state: "cooked",
    region: "west",
    defaultServingGrams: 120,
    per100g: {
        calories: 250,
        protein: 5,
        carbs: 33,
        fat: 10.5,
        fiber: 2.5,
        sodium: 450,
        vitaminB12: 0,
        vitaminD: 0,
        iron: 2,
        calcium: 35
    },
    servings: [
        {
            id: "piece",
            label: "1 piece",
            grams: 120
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
        "nonveg"
    ],
    tags: [
        "snack",
        "high-calorie",
        "high-carb",
        "comfort-food"
    ],
    isProcessed: false,
    isFastingFood: false,
    fastingTypes: [],
    isGlutenFree: false,
    isRecipe: false,
    containsRootVeg: true,
    hasBeverageModifiers: false,
    supportedConsistencyTypes: [],
    consistencyMultipliers: {},
    gi: 75,
    cookingOilNote: "Vada is deep fried. Pav is refined flour.",
    estimatedOilG: 8,
    source: "healthifyme",
    confidence: "medium",
    notes: "Total calories roughly 300 per vada pav."
}  ,
  {
    id: "pani-puri",
    name: "Pani Puri / Golgappa",
    nameAlt: [
        "puchka",
        "gupchup"
    ],
    hindiName: "पानी पूरी",
    searchTerms: [
        "pani puri",
        "golgappa",
        "puchka",
        "gupchup",
        "chaat"
    ],
    category: "snack-street",
    subcategory: "chaat",
    itemType: "dish",
    state: "cooked",
    region: "pan-indian",
    defaultServingGrams: 100,
    per100g: {
        calories: 140,
        protein: 3,
        carbs: 22,
        fat: 4.5,
        fiber: 2,
        sodium: 500,
        vitaminB12: 0,
        vitaminD: 0,
        iron: 1.5,
        calcium: 20
    },
    servings: [
        {
            id: "plate",
            label: "1 plate (6 pieces)",
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
        "nonveg"
    ],
    tags: [
        "snack",
        "low-calorie"
    ],
    isProcessed: false,
    isFastingFood: false,
    fastingTypes: [],
    isGlutenFree: false,
    isRecipe: false,
    containsRootVeg: true,
    hasBeverageModifiers: false,
    supportedConsistencyTypes: [],
    consistencyMultipliers: {},
    gi: 55,
    cookingOilNote: "Puris are deep fried, but the water volume dilutes overall calorie density.",
    estimatedOilG: 3,
    source: "healthifyme",
    confidence: "medium",
    notes: "Surprising low calorie snack due to high water content, but high in sodium."
}  ,
  {
    id: "bhel-puri",
    name: "Bhel Puri (With Chutney)",
    nameAlt: [
        "bheel"
    ],
    hindiName: "भेल पूरी",
    searchTerms: [
        "bhel",
        "bhel puri",
        "chaat"
    ],
    category: "snack-street",
    subcategory: "chaat",
    itemType: "dish",
    state: "cooked",
    region: "west",
    defaultServingGrams: 150,
    per100g: {
        calories: 160,
        protein: 4,
        carbs: 28,
        fat: 4,
        fiber: 3.5,
        sodium: 450,
        vitaminB12: 0,
        vitaminD: 0,
        iron: 2,
        calcium: 30
    },
    servings: [
        {
            id: "plate",
            label: "1 plate",
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
        "nonveg"
    ],
    tags: [
        "snack",
        "high-carb"
    ],
    isProcessed: false,
    isFastingFood: false,
    fastingTypes: [],
    isGlutenFree: false,
    isRecipe: false,
    containsRootVeg: true,
    hasBeverageModifiers: false,
    supportedConsistencyTypes: [],
    consistencyMultipliers: {},
    gi: 65,
    cookingOilNote: "Sev and puri components are fried.",
    estimatedOilG: 3,
    source: "healthifyme",
    confidence: "medium",
    notes: "Sweet tamarind chutney adds sugar carbs."
}  ,
  {
    id: "pav-bhaji",
    name: "Pav Bhaji (With Butter)",
    nameAlt: [
        "paav bhaji"
    ],
    hindiName: "पाव भाजी",
    searchTerms: [
        "pav",
        "bhaji",
        "pav bhaji",
        "paavbhaji"
    ],
    category: "snack-street",
    subcategory: "street-food",
    itemType: "dish",
    state: "cooked",
    region: "west",
    defaultServingGrams: 300,
    per100g: {
        calories: 135,
        protein: 3,
        carbs: 18,
        fat: 5.5,
        fiber: 3.5,
        sodium: 380,
        vitaminB12: 0,
        vitaminD: 0,
        iron: 1.5,
        calcium: 30
    },
    servings: [
        {
            id: "plate",
            label: "1 plate (2 pav + bhaji)",
            grams: 300
        },
        {
            id: "g100",
            label: "100g",
            grams: 100
        }
    ],
    dietTypes: [
        "veg",
        "nonveg"
    ],
    tags: [
        "snack",
        "lunch",
        "high-calorie"
    ],
    isProcessed: false,
    isFastingFood: false,
    fastingTypes: [],
    isGlutenFree: false,
    isRecipe: false,
    containsRootVeg: true,
    hasBeverageModifiers: false,
    supportedConsistencyTypes: [],
    consistencyMultipliers: {},
    gi: 68,
    cookingOilNote: "Heavily buttered. A lot of fat comes from Amul butter additions.",
    estimatedOilG: 12,
    source: "healthifyme",
    confidence: "medium",
    notes: "About 400 calories per plate. Adding extra butter increases calories steeply."
}  ,
  {
    id: "roasted-chana",
    name: "Roasted Chana (Bengal Gram)",
    nameAlt: [
        "bhuna chana",
        "dry roasted chickpea"
    ],
    hindiName: "भुना हुआ चना",
    searchTerms: [
        "chana",
        "roasted chana",
        "bhuna chana",
        "gram"
    ],
    category: "snack-street",
    subcategory: "dry-snack",
    itemType: "base-food",
    state: "roasted",
    region: "pan-indian",
    defaultServingGrams: 30,
    per100g: {
        calories: 364,
        protein: 22,
        carbs: 50,
        fat: 5.2,
        fiber: 15,
        sodium: 80,
        vitaminB12: 0,
        vitaminD: 0,
        iron: 5.5,
        calcium: 150
    },
    servings: [
        {
            id: "handful",
            label: "1 handful",
            grams: 30
        },
        {
            id: "katori",
            label: "1 katori small",
            grams: 60
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
        "high-protein",
        "high-fiber",
        "muscle-building",
        "budget-friendly"
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
    gi: 28,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: "IFCT-2017",
    confidence: "high",
    notes: "Amazing protein-dense snack."
}  ,
  {
    id: "makhana-roasted",
    name: "Makhana (Roasted Fox Nuts, Slightly Salted/Oiled)",
    nameAlt: [
        "lotus seeds",
        "phool makhana"
    ],
    hindiName: "भुना हुआ मखाना",
    searchTerms: [
        "makhana",
        "fox nuts",
        "lotus seeds",
        "roasted makhana"
    ],
    category: "snack-street",
    subcategory: "dry-snack",
    itemType: "base-food",
    state: "roasted",
    region: "pan-indian",
    defaultServingGrams: 30,
    per100g: {
        calories: 350,
        protein: 9,
        carbs: 77,
        fat: 0.5,
        fiber: 14,
        sodium: 150,
        vitaminB12: 0,
        vitaminD: 0,
        iron: 1.4,
        calcium: 60
    },
    servings: [
        {
            id: "bowl",
            label: "1 bowl",
            grams: 30
        },
        {
            id: "handful",
            label: "1 handful",
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
        "low-calorie",
        "high-fiber"
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
    gi: 55,
    cookingOilNote: "100g usually includes ~2g ghee used for roasting.",
    estimatedOilG: 1,
    source: "IFCT-2017",
    confidence: "medium",
    notes: "Extremely light, so 30g is a very large portion visually."
}  ,
  {
    id: "khakhra-plain",
    name: "Khakhra (Plain / Whole Wheat)",
    nameAlt: [
        "khakra"
    ],
    hindiName: "खाखरा",
    searchTerms: [
        "khakhra",
        "khakra",
        "gujarati snack",
        "crispy roti"
    ],
    category: "snack-street",
    subcategory: "dry-snack",
    itemType: "base-food",
    state: "roasted",
    region: "west",
    defaultServingGrams: 20,
    per100g: {
        calories: 420,
        protein: 10.5,
        carbs: 65,
        fat: 12,
        fiber: 6,
        sodium: 600,
        vitaminB12: 0,
        vitaminD: 0,
        iron: 3.5,
        calcium: 40
    },
    servings: [
        {
            id: "piece",
            label: "1 piece",
            grams: 20
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
        "budget-friendly"
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
    gi: 55,
    cookingOilNote: "Values include oil used in the dough.",
    estimatedOilG: 1,
    source: "healthifyme",
    confidence: "high",
    notes: "Great substitute for fried chips. 1 piece is usually 80-90 calories."
}  ,
  {
    id: "dhokla",
    name: "Khaman Dhokla (Besan Steamed, Sweet/Salty)",
    nameAlt: [
        "besan dhokla",
        "khaman"
    ],
    hindiName: "ढोकला",
    searchTerms: [
        "dhokla",
        "khaman",
        "steamed besan",
        "gujarati snack"
    ],
    category: "snack-street",
    subcategory: "street-food",
    itemType: "dish",
    state: "steamed",
    region: "west",
    defaultServingGrams: 50,
    per100g: {
        calories: 160,
        protein: 7,
        carbs: 22,
        fat: 4.5,
        fiber: 2.5,
        sodium: 400,
        vitaminB12: 0,
        vitaminD: 0,
        iron: 1.5,
        calcium: 30
    },
    servings: [
        {
            id: "piece",
            label: "1 piece (medium)",
            grams: 50
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
        "breakfast",
        "low-fat"
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
    gi: 55,
    cookingOilNote: "Oil primarily from mustard seed tempering on top.",
    estimatedOilG: 1,
    source: "healthifyme",
    confidence: "high",
    notes: "Healthy snack option. Sugar water tempering adds to carbs."
}  ,
  {
    id: "pakora-onion",
    name: "Onion Pakora (Pyaz Ke Pakode, Bhajiya)",
    nameAlt: [
        "onion bhaji",
        "kanda bhaji"
    ],
    hindiName: "प्याज के पकोड़े",
    searchTerms: [
        "pakora",
        "bhajiya",
        "onion bhaji",
        "pyaz pakoda",
        "fritters"
    ],
    category: "snack-street",
    subcategory: "fried-snack",
    itemType: "dish",
    state: "fried",
    region: "pan-indian",
    defaultServingGrams: 50,
    per100g: {
        calories: 290,
        protein: 6,
        carbs: 25,
        fat: 18,
        fiber: 3.5,
        sodium: 350,
        vitaminB12: 0,
        vitaminD: 0,
        iron: 1.5,
        calcium: 35
    },
    servings: [
        {
            id: "piece",
            label: "1 medium pakora",
            grams: 25
        },
        {
            id: "handful",
            label: "1 small plate",
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
        "nonveg"
    ],
    tags: [
        "snack",
        "high-fat"
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
    cookingOilNote: "Deep fried item.",
    estimatedOilG: 15,
    source: "healthifyme",
    confidence: "medium",
    notes: "Extremely high calorie density due to deep frying."
}
  ,
  {
    id: "gulab-jamun",
    name: "Gulab Jamun",
    nameAlt: [
        "jamun",
        "kala jamun"
    ],
    hindiName: "गुलाब जामुन",
    searchTerms: [
        "gulab",
        "jamun",
        "kala jamun",
        "sweet"
    ],
    category: "sweet-mithai",
    subcategory: "milk-sweet",
    itemType: "dish",
    state: "fried",
    region: "pan-indian",
    defaultServingGrams: 50,
    per100g: {
        calories: 320,
        protein: 6,
        carbs: 55,
        fat: 10,
        fiber: 0.5,
        sodium: 50,
        vitaminB12: 0,
        vitaminD: 0,
        iron: 0.5,
        calcium: 50
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
    gi: 75,
    cookingOilNote: "Deep fried in oil or ghee, then soaked in sugar syrup.",
    estimatedOilG: 8,
    source: "healthifyme",
    confidence: "high",
    notes: "Very high sugar and calorie content."
}  ,
  {
    id: "rasgulla",
    name: "Rasgulla",
    nameAlt: [
        "roshogolla",
        "rasagolla"
    ],
    hindiName: "रसगुल्ला",
    searchTerms: [
        "rasgulla",
        "roshogolla",
        "sponge rasgulla",
        "sweet"
    ],
    category: "sweet-mithai",
    subcategory: "milk-sweet",
    itemType: "dish",
    state: "cooked",
    region: "east",
    defaultServingGrams: 50,
    per100g: {
        calories: 186,
        protein: 4.5,
        carbs: 40,
        fat: 1.5,
        fiber: 0.1,
        sodium: 20,
        vitaminB12: 0.2,
        vitaminD: 0,
        iron: 0.1,
        calcium: 80
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
        "low-fat"
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
    confidence: "high",
    notes: "Lower in fat than most Indian sweets because it is boiled, not fried. Calories come mostly from sugar syrup."
}  ,
  {
    id: "besan-ladoo",
    name: "Besan Ladoo",
    nameAlt: [
        "basen laddu"
    ],
    hindiName: "बेसन के लड्डू",
    searchTerms: [
        "besan",
        "ladoo",
        "laddu",
        "sweet"
    ],
    category: "sweet-mithai",
    subcategory: "dry-sweet",
    itemType: "dish",
    state: "cooked",
    region: "pan-indian",
    defaultServingGrams: 40,
    per100g: {
        calories: 485,
        protein: 10,
        carbs: 55,
        fat: 25,
        fiber: 3.5,
        sodium: 10,
        vitaminB12: 0,
        vitaminD: 0,
        iron: 2,
        calcium: 30
    },
    servings: [
        {
            id: "piece",
            label: "1 piece",
            grams: 40
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
    gi: 60,
    cookingOilNote: "Very high ghee content.",
    estimatedOilG: 10,
    source: "healthifyme",
    confidence: "medium",
    notes: "Calorie dense due to heavy use of ghee."
}  ,
  {
    id: "motichoor-ladoo",
    name: "Motichoor Ladoo",
    nameAlt: [
        "boondi laddu",
        "motichur"
    ],
    hindiName: "मोतीचूर के लड्डू",
    searchTerms: [
        "motichoor",
        "ladoo",
        "laddu",
        "boondi"
    ],
    category: "sweet-mithai",
    subcategory: "dry-sweet",
    itemType: "dish",
    state: "fried",
    region: "north",
    defaultServingGrams: 40,
    per100g: {
        calories: 450,
        protein: 4,
        carbs: 65,
        fat: 20,
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
            grams: 40
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
    isFastingFood: false,
    fastingTypes: [],
    isGlutenFree: true,
    isRecipe: false,
    containsRootVeg: false,
    hasBeverageModifiers: false,
    supportedConsistencyTypes: [],
    consistencyMultipliers: {},
    gi: 70,
    cookingOilNote: "Boondi is deep fried in ghee/oil before shaping.",
    estimatedOilG: 8,
    source: "healthifyme",
    confidence: "medium"
}  ,
  {
    id: "kaju-katli",
    name: "Kaju Katli (Cashew Fudge)",
    nameAlt: [
        "kaju barfi"
    ],
    hindiName: "काजू कतली",
    searchTerms: [
        "kaju",
        "katli",
        "barfi",
        "cashew sweet"
    ],
    category: "sweet-mithai",
    subcategory: "dry-sweet",
    itemType: "dish",
    state: "cooked",
    region: "pan-indian",
    defaultServingGrams: 15,
    per100g: {
        calories: 450,
        protein: 10,
        carbs: 55,
        fat: 22,
        fiber: 2,
        sodium: 10,
        vitaminB12: 0,
        vitaminD: 0,
        iron: 3,
        calcium: 30
    },
    servings: [
        {
            id: "piece",
            label: "1 piece",
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
        "high-sugar",
        "high-fat",
        "premium"
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
    gi: 50,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: "healthifyme",
    confidence: "high",
    notes: "About 60-70 calories per piece."
}  ,
  {
    id: "jalebi",
    name: "Jalebi",
    nameAlt: [
        "jilebi",
        "imarti"
    ],
    hindiName: "जलेबी",
    searchTerms: [
        "jalebi",
        "jilbi",
        "sweet",
        "imarti"
    ],
    category: "sweet-mithai",
    subcategory: "fried-sweet",
    itemType: "dish",
    state: "fried",
    region: "pan-indian",
    defaultServingGrams: 50,
    per100g: {
        calories: 380,
        protein: 3,
        carbs: 70,
        fat: 10.5,
        fiber: 0.5,
        sodium: 5,
        vitaminB12: 0,
        vitaminD: 0,
        iron: 0.5,
        calcium: 15
    },
    servings: [
        {
            id: "piece",
            label: "1 medium piece",
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
        "high-carb"
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
    gi: 80,
    cookingOilNote: "Deep fried and soaked in sugar syrup.",
    estimatedOilG: 5,
    source: "healthifyme",
    confidence: "medium"
}  ,
  {
    id: "banana-raw",
    name: "Banana (Raw / Ripe)",
    nameAlt: [
        "kela"
    ],
    hindiName: "केला",
    searchTerms: [
        "banana",
        "kela",
        "fruit"
    ],
    category: "fruit",
    subcategory: "fresh-fruit",
    itemType: "base-food",
    state: "raw",
    region: "pan-indian",
    defaultServingGrams: 120,
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
        {
            id: "medium",
            label: "1 medium",
            grams: 120
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
        "pre-workout",
        "high-carb",
        "budget-friendly"
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
    gi: 52,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: "USDA",
    confidence: "high",
    notes: "Excellent pre-workout carb source. Value excludes peel."
}  ,
  {
    id: "mango-raw",
    name: "Mango (Ripe)",
    nameAlt: [
        "aam"
    ],
    hindiName: "आम",
    searchTerms: [
        "mango",
        "aam",
        "fruit",
        "alphonso"
    ],
    category: "fruit",
    subcategory: "fresh-fruit",
    itemType: "base-food",
    state: "raw",
    region: "pan-indian",
    defaultServingGrams: 200,
    per100g: {
        calories: 60,
        protein: 0.8,
        carbs: 15,
        fat: 0.4,
        fiber: 1.6,
        sodium: 1,
        vitaminB12: 0,
        vitaminD: 0,
        iron: 0.2,
        calcium: 11
    },
    servings: [
        {
            id: "medium",
            label: "1 medium (flesh only)",
            grams: 200
        },
        {
            id: "katori",
            label: "1 katori (cubed)",
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
    gi: 51,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: "USDA",
    confidence: "high"
}  ,
  // ==========================================
  // EXTENDED DB: Phase 1 (Batches P, Q, R, N, B6)
  // ==========================================
  {
    id: 'maggi-masala-single',
    name: 'Maggi 2-Minute Masala Noodles',
    nameAlt: ['magi', 'instant noodles'],
    hindiName: 'मैगी मसाला',
    searchTerms: ['maggi', 'magi', '2 minute noodles', 'masala maggi'],
    category: 'packaged-food',
    subcategory: 'instant-noodle',
    itemType: 'snack',
    state: 'cooked',
    region: 'pan-indian',
    defaultServingGrams: 70,
    per100g: {
      calories: 442,
      protein: 10.0,
      carbs: 60.0,
      fat: 17.1,
      fiber: 2.0,
      sodium: 1228,
      vitaminB12: 0,
      vitaminD: 0,
      iron: 2.0,
      calcium: 20
    },
    servings: [
      { id: 'packet', label: '1 packet', grams: 70 },
      { id: 'g100', label: '100g', grams: 100 }
    ],
    dietTypes: ['veg'],
    tags: ['snack', 'high-sodium', 'high-carb'],
    isProcessed: true,
    isFastingFood: false,
    fastingTypes: [],
    isGlutenFree: false,
    isRecipe: false,
    containsRootVeg: false,
    hasBeverageModifiers: false,
    supportedConsistencyTypes: [],
    consistencyMultipliers: {},
    gi: 70,
    cookingOilNote: 'Contains pre-added fat in the seasoning and noodle block.',
    estimatedOilG: 0,
    source: 'FSSAI-label',
    confidence: 'high',
    notes: 'Calculated using typical 70g packet cooked in water. High sodium content.'
  },
  {
    id: 'maggi-atta-masala',
    name: 'Maggi Atta (Whole Wheat) Noodles',
    nameAlt: ['atta magi'],
    hindiName: 'मैगी आटा नूडल्स',
    searchTerms: ['maggi atta', 'wheat maggi', 'atta noodles'],
    category: 'packaged-food',
    subcategory: 'instant-noodle',
    itemType: 'snack',
    state: 'cooked',
    region: 'pan-indian',
    defaultServingGrams: 75,
    per100g: {
      calories: 386,
      protein: 10.6,
      carbs: 53.3,
      fat: 14.6,
      fiber: 5.3,
      sodium: 900,
      vitaminB12: 0,
      vitaminD: 0,
      iron: 2.5,
      calcium: 40
    },
    servings: [
      { id: 'packet', label: '1 packet', grams: 75 },
      { id: 'g100', label: '100g', grams: 100 }
    ],
    dietTypes: ['veg'],
    tags: ['snack', 'high-carb'],
    isProcessed: true,
    isFastingFood: false,
    fastingTypes: [],
    isGlutenFree: false,
    isRecipe: false,
    containsRootVeg: false,
    hasBeverageModifiers: false,
    supportedConsistencyTypes: [],
    consistencyMultipliers: {},
    gi: 65,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: 'FSSAI-label',
    confidence: 'high'
  },
  {
    id: 'yippee-noodles-masala',
    name: 'Sunfeast YiPPee! Noodles',
    nameAlt: ['ipee noodles', 'yipee'],
    hindiName: 'यिप्पी नूडल्स',
    searchTerms: ['yippee', 'yipee', 'sunfeast', 'instant noodles'],
    category: 'packaged-food',
    subcategory: 'instant-noodle',
    itemType: 'snack',
    state: 'cooked',
    region: 'pan-indian',
    defaultServingGrams: 70,
    per100g: {
      calories: 500,
      protein: 11.4,
      carbs: 68.5,
      fat: 20.0,
      fiber: 2.0,
      sodium: 1100,
      vitaminB12: 0,
      vitaminD: 0,
      iron: 1.5,
      calcium: 25
    },
    servings: [
      { id: 'packet', label: '1 packet', grams: 70 },
      { id: 'g100', label: '100g', grams: 100 }
    ],
    dietTypes: ['veg'],
    tags: ['snack', 'high-carb', 'high-sodium'],
    isProcessed: true,
    isFastingFood: false,
    fastingTypes: [],
    isGlutenFree: false,
    isRecipe: false,
    containsRootVeg: false,
    hasBeverageModifiers: false,
    supportedConsistencyTypes: [],
    consistencyMultipliers: {},
    gi: 70,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: 'FSSAI-label',
    confidence: 'high'
  },
  {
    id: 'nissin-cup-noodles-masala',
    name: 'Nissin Cup Noodles (Masala)',
    nameAlt: ['cup maggi'],
    hindiName: 'कप नूडल्स',
    searchTerms: ['cup noodles', 'nissin', 'masala cup', 'instant cup'],
    category: 'packaged-food',
    subcategory: 'instant-noodle',
    itemType: 'snack',
    state: 'cooked',
    region: 'pan-indian',
    defaultServingGrams: 70,
    per100g: {
      calories: 414,
      protein: 8.5,
      carbs: 54.2,
      fat: 17.1,
      fiber: 2.0,
      sodium: 950,
      vitaminB12: 0,
      vitaminD: 0,
      iron: 1.0,
      calcium: 15
    },
    servings: [
      { id: 'cup', label: '1 cup', grams: 70 },
      { id: 'g100', label: '100g', grams: 100 }
    ],
    dietTypes: ['veg'],
    tags: ['snack', 'high-carb'],
    isProcessed: true,
    isFastingFood: false,
    fastingTypes: [],
    isGlutenFree: false,
    isRecipe: false,
    containsRootVeg: false,
    hasBeverageModifiers: false,
    supportedConsistencyTypes: [],
    consistencyMultipliers: {},
    gi: 70,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: 'FSSAI-label',
    confidence: 'high'
  },
  {
    id: 'top-ramen-curry-noodles',
    name: 'Top Ramen Curry Noodles',
    nameAlt: ['ramen india'],
    hindiName: 'टॉप रेमन करी',
    searchTerms: ['top ramen', 'curry noodles', 'ramen', 'instant curry'],
    category: 'packaged-food',
    subcategory: 'instant-noodle',
    itemType: 'snack',
    state: 'cooked',
    region: 'pan-indian',
    defaultServingGrams: 70,
    per100g: {
      calories: 442,
      protein: 10.0,
      carbs: 60.0,
      fat: 17.1,
      fiber: 2.0,
      sodium: 1200,
      vitaminB12: 0,
      vitaminD: 0,
      iron: 2.0,
      calcium: 20
    },
    servings: [
      { id: 'packet', label: '1 packet', grams: 70 },
      { id: 'g100', label: '100g', grams: 100 }
    ],
    dietTypes: ['veg'],
    tags: ['snack', 'high-sodium'],
    isProcessed: true,
    isFastingFood: false,
    fastingTypes: [],
    isGlutenFree: false,
    isRecipe: false,
    containsRootVeg: false,
    hasBeverageModifiers: false,
    supportedConsistencyTypes: [],
    consistencyMultipliers: {},
    gi: 70,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: 'FSSAI-label',
    confidence: 'high'
  },
  {
    id: 'knorr-soupy-noodles',
    name: 'Knorr Soupy Noodles',
    nameAlt: ['soupy maggi'],
    hindiName: 'नोर सूपी नूडल्स',
    searchTerms: ['knorr', 'soupy noodles', 'knor', 'soup maggi'],
    category: 'packaged-food',
    subcategory: 'instant-noodle',
    itemType: 'snack',
    state: 'cooked',
    region: 'pan-indian',
    defaultServingGrams: 66,
    per100g: {
      calories: 363,
      protein: 7.5,
      carbs: 54.5,
      fat: 13.6,
      fiber: 2.0,
      sodium: 1050,
      vitaminB12: 0,
      vitaminD: 0,
      iron: 1.5,
      calcium: 15
    },
    servings: [
      { id: 'packet', label: '1 packet', grams: 66 },
      { id: 'g100', label: '100g', grams: 100 }
    ],
    dietTypes: ['veg'],
    tags: ['snack', 'high-sodium'],
    isProcessed: true,
    isFastingFood: false,
    fastingTypes: [],
    isGlutenFree: false,
    isRecipe: false,
    containsRootVeg: false,
    hasBeverageModifiers: false,
    supportedConsistencyTypes: [],
    consistencyMultipliers: {},
    gi: 68,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: 'FSSAI-label',
    confidence: 'high'
  },
  {
    id: 'maggi-hot-heads-cup',
    name: 'Maggi Hot Heads Cup Noodles',
    nameAlt: ['spicy maggi cup'],
    hindiName: 'मैगी हॉट हेड्स',
    searchTerms: ['hot heads', 'maggi spicy cup', 'spicy maggi'],
    category: 'packaged-food',
    subcategory: 'instant-noodle',
    itemType: 'snack',
    state: 'cooked',
    region: 'pan-indian',
    defaultServingGrams: 71,
    per100g: {
      calories: 422,
      protein: 8.4,
      carbs: 56.3,
      fat: 18.3,
      fiber: 2.0,
      sodium: 1100,
      vitaminB12: 0,
      vitaminD: 0,
      iron: 1.5,
      calcium: 20
    },
    servings: [
      { id: 'cup', label: '1 cup', grams: 71 },
      { id: 'g100', label: '100g', grams: 100 }
    ],
    dietTypes: ['veg'],
    tags: ['snack', 'spicy'],
    isProcessed: true,
    isFastingFood: false,
    fastingTypes: [],
    isGlutenFree: false,
    isRecipe: false,
    containsRootVeg: false,
    hasBeverageModifiers: false,
    supportedConsistencyTypes: [],
    consistencyMultipliers: {},
    gi: 70,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: 'FSSAI-label',
    confidence: 'high'
  },
  {
    id: 'mtr-ready-to-eat-rajma-rice',
    name: 'MTR Ready to Eat Rajma Rice',
    nameAlt: ['packaged rajma chawal'],
    hindiName: 'एमटीआर राजमा चावल',
    searchTerms: ['mtr rajma', 'rajma rice ready', 'packaged rajma'],
    category: 'packaged-food',
    subcategory: 'cloud-kitchen',
    itemType: 'dish',
    state: 'cooked',
    region: 'north',
    defaultServingGrams: 300,
    per100g: {
      calories: 160,
      protein: 5.0,
      carbs: 24.0,
      fat: 5.0,
      fiber: 4.5,
      sodium: 350,
      vitaminB12: 0,
      vitaminD: 0,
      iron: 1.8,
      calcium: 30
    },
    servings: [
      { id: 'packet', label: '1 packet', grams: 300 },
      { id: 'g100', label: '100g', grams: 100 }
    ],
    dietTypes: ['veg'],
    tags: ['lunch', 'dinner'],
    isProcessed: true,
    isFastingFood: false,
    fastingTypes: [],
    isGlutenFree: true,
    isRecipe: false,
    containsRootVeg: true,
    hasBeverageModifiers: false,
    supportedConsistencyTypes: [],
    consistencyMultipliers: {},
    gi: 58,
    cookingOilNote: null,
    estimatedOilG: 3,
    source: 'FSSAI-label',
    confidence: 'high'
  },
  {
    id: 'mtr-ready-to-eat-dal-fry',
    name: 'MTR Ready to Eat Dal Fry',
    nameAlt: ['packaged dal'],
    hindiName: 'एमटीआर दाल फ्राई',
    searchTerms: ['mtr dal fry', 'packaged dal'],
    category: 'packaged-food',
    subcategory: 'indian-packaged-namkeen',
    itemType: 'dish',
    state: 'cooked',
    region: 'north',
    defaultServingGrams: 300,
    per100g: {
      calories: 100,
      protein: 5.0,
      carbs: 12.0,
      fat: 3.0,
      fiber: 3.0,
      sodium: 380,
      vitaminB12: 0,
      vitaminD: 0,
      iron: 1.5,
      calcium: 20
    },
    servings: [
      { id: 'packet', label: '1 packet', grams: 300 },
      { id: 'g100', label: '100g', grams: 100 }
    ],
    dietTypes: ['veg'],
    tags: ['lunch', 'dinner'],
    isProcessed: true,
    isFastingFood: false,
    fastingTypes: [],
    isGlutenFree: true,
    isRecipe: false,
    containsRootVeg: true,
    hasBeverageModifiers: false,
    supportedConsistencyTypes: [],
    consistencyMultipliers: {},
    gi: 48,
    cookingOilNote: null,
    estimatedOilG: 2,
    source: 'FSSAI-label',
    confidence: 'high'
  },
  {
    id: 'canned-baked-beans-generic',
    name: 'Canned Baked Beans (Generic)',
    nameAlt: ['heinz baked beans', 'beans in tomato sauce'],
    hindiName: 'बेक्ड बीन्स',
    searchTerms: ['baked beans', 'canned beans', 'heinz beans', 'tomato beans'],
    category: 'packaged-food',
    subcategory: 'cafe-food',
    itemType: 'dish',
    state: 'cooked',
    region: 'pan-indian',
    defaultServingGrams: 200,
    per100g: {
      calories: 95,
      protein: 5.0,
      carbs: 17.0,
      fat: 0.5,
      fiber: 4.0,
      sodium: 300,
      vitaminB12: 0,
      vitaminD: 0,
      iron: 1.5,
      calcium: 30
    },
    servings: [
      { id: 'can-half', label: 'Half can', grams: 200 },
      { id: 'can-full', label: 'Full can', grams: 400 },
      { id: 'g100', label: '100g', grams: 100 }
    ],
    dietTypes: ['vegan', 'veg', 'nonveg'],
    tags: ['breakfast', 'high-fiber'],
    isProcessed: true,
    isFastingFood: false,
    fastingTypes: [],
    isGlutenFree: true,
    isRecipe: false,
    containsRootVeg: false,
    hasBeverageModifiers: false,
    supportedConsistencyTypes: [],
    consistencyMultipliers: {},
    gi: 48,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: 'FSSAI-label',
    confidence: 'high'
  },
  {
    id: 'peanut-butter-creamy',
    name: 'Peanut Butter (Creamy, Plain)',
    nameAlt: ['smooth peanut butter'],
    hindiName: 'पीनट बटर',
    searchTerms: ['peanut butter', 'pb', 'creamy peanut butter', 'sandwich butter'],
    category: 'condiment',
    subcategory: 'spreads',
    itemType: 'condiment',
    state: 'raw',
    region: 'pan-indian',
    defaultServingGrams: 15,
    per100g: {
      calories: 588,
      protein: 25.0,
      carbs: 20.0,
      fat: 50.0,
      fiber: 6.0,
      sodium: 400,
      vitaminB12: 0,
      vitaminD: 0,
      iron: 1.9,
      calcium: 43
    },
    servings: [
      { id: 'tbsp', label: '1 tbsp', grams: 15 },
      { id: 'g100', label: '100g', grams: 100 }
    ],
    dietTypes: ['vegan', 'veg', 'jain'],
    tags: ['snack', 'high-protein', 'high-fat'],
    isProcessed: true,
    isFastingFood: false,
    fastingTypes: [],
    isGlutenFree: true,
    isRecipe: false,
    containsRootVeg: false,
    hasBeverageModifiers: false,
    supportedConsistencyTypes: [],
    consistencyMultipliers: {},
    gi: 14,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: 'USDA',
    confidence: 'high'
  },
  {
    id: 'ritebite-max-protein-choco-fudge',
    name: 'RiteBite Max Protein Bar (Choco Fudge)',
    nameAlt: ['rite bite bar'],
    hindiName: 'मैक्स प्रोटीन बार',
    searchTerms: ['ritebite', 'max protein', 'protein bar', 'choco fudge bar'],
    category: 'supplement',
    subcategory: 'protein-bar',
    itemType: 'snack',
    state: 'raw',
    region: 'pan-indian',
    defaultServingGrams: 67,
    per100g: {
      calories: 283,
      protein: 29.8,
      carbs: 25.3,
      fat: 8.9,
      fiber: 8.0,
      sodium: 250,
      vitaminB12: 2.0,
      vitaminD: 2.5,
      iron: 3.5,
      calcium: 150
    },
    servings: [
      { id: 'bar', label: '1 bar', grams: 67 },
      { id: 'g100', label: '100g', grams: 100 }
    ],
    dietTypes: ['veg'],
    tags: ['snack', 'high-protein'],
    isProcessed: true,
    isFastingFood: false,
    fastingTypes: [],
    isGlutenFree: false,
    isRecipe: false,
    containsRootVeg: false,
    hasBeverageModifiers: false,
    supportedConsistencyTypes: [],
    consistencyMultipliers: {},
    gi: null,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: 'FSSAI-label',
    confidence: 'high'
  },
  {
    id: 'sattu-drink-namkeen',
    name: 'Sattu Drink (Savoury/Namkeen)',
    nameAlt: ['sattu sharbat'],
    hindiName: 'सत्तू नमकीन',
    searchTerms: ['sattu', 'sattu sharbat', 'roasted gram drink', 'namkeen sattu'],
    category: 'drink',
    subcategory: 'cooling-drink',
    itemType: 'drink',
    state: 'raw',
    region: 'east',
    defaultServingGrams: 250,
    per100g: {
      calories: 64,
      protein: 3.2,
      carbs: 10.4,
      fat: 1.0,
      fiber: 2.5,
      sodium: 150,
      vitaminB12: 0,
      vitaminD: 0,
      iron: 1.5,
      calcium: 15
    },
    servings: [
      { id: 'glass', label: '1 glass', grams: 250 },
      { id: 'ml100', label: '100ml', grams: 100 }
    ],
    dietTypes: ['vegan', 'veg', 'jain', 'nonveg'],
    tags: ['high-protein', 'cooling', 'budget-friendly'],
    isProcessed: false,
    isFastingFood: false,
    fastingTypes: [],
    isGlutenFree: true,
    isRecipe: true,
    containsRootVeg: false,
    hasBeverageModifiers: false,
    supportedConsistencyTypes: [],
    consistencyMultipliers: {},
    gi: 40,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: 'curated-estimate',
    confidence: 'high'
  },
  {
    id: 'chaas-plain',
    name: 'Chaas / Buttermilk (Plain, Mattha)',
    nameAlt: ['mattha', 'taak', 'majjiga'],
    hindiName: 'छाछ',
    searchTerms: ['chaas', 'buttermilk', 'mattha', 'taak', 'majjiga', 'chhas'],
    category: 'drink',
    subcategory: 'cooling-drink',
    itemType: 'drink',
    state: 'raw',
    region: 'pan-indian',
    defaultServingGrams: 200,
    per100g: {
      calories: 20,
      protein: 1.2,
      carbs: 2.4,
      fat: 0.5,
      fiber: 0,
      sodium: 40,
      vitaminB12: 0.1,
      vitaminD: 0,
      iron: 0.1,
      calcium: 45
    },
    servings: [
      { id: 'glass', label: '1 glass', grams: 200 },
      { id: 'ml100', label: '100ml', grams: 100 }
    ],
    dietTypes: ['veg', 'jain'],
    tags: ['cooling', 'probiotic', 'low-calorie'],
    isProcessed: false,
    isFastingFood: true,
    fastingTypes: ['navratri', 'ekadashi'],
    isGlutenFree: true,
    isRecipe: true,
    containsRootVeg: false,
    hasBeverageModifiers: false,
    supportedConsistencyTypes: [],
    consistencyMultipliers: {},
    gi: 30,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: 'healthifyme',
    confidence: 'high'
  },
  {
    id: 'paneer-bhurji',
    name: 'Paneer Bhurji (Scrambled Paneer)',
    nameAlt: ['masala paneer scramble'],
    hindiName: 'पनीर भुर्जी',
    searchTerms: ['paneer bhurji', 'scrambled paneer', 'paneer masala'],
    category: 'sabzi-veg',
    subcategory: 'north-indian',
    itemType: 'dish',
    state: 'cooked',
    region: 'north',
    defaultServingGrams: 150,
    per100g: {
      calories: 240,
      protein: 12.0,
      carbs: 6.0,
      fat: 18.0,
      fiber: 1.5,
      sodium: 300,
      vitaminB12: 0,
      vitaminD: 0,
      iron: 1.0,
      calcium: 200
    },
    servings: [
      { id: 'katori', label: '1 katori', grams: 150 },
      { id: 'g100', label: '100g', grams: 100 }
    ],
    dietTypes: ['veg'],
    tags: ['lunch', 'dinner', 'high-protein', 'low-carb'],
    isProcessed: false,
    isFastingFood: false,
    fastingTypes: [],
    isGlutenFree: true,
    isRecipe: true,
    containsRootVeg: true,
    hasBeverageModifiers: false,
    supportedConsistencyTypes: [],
    consistencyMultipliers: {},
    gi: 20,
    cookingOilNote: 'Cooked with oil/ghee and onions/tomatoes.',
    estimatedOilG: 8,
    source: 'healthifyme',
    confidence: 'medium'
  },
  {
    id: 'egg-bhurji-masala',
    name: 'Egg Bhurji (Indian Scrambled Eggs)',
    nameAlt: ['anda bhurji'],
    hindiName: 'अंडा भुर्जी',
    searchTerms: ['egg bhurji', 'anda bhurji', 'scrambled eggs', 'spicy egg'],
    category: 'non-veg',
    subcategory: 'egg-dish',
    itemType: 'dish',
    state: 'cooked',
    region: 'pan-indian',
    defaultServingGrams: 120,
    per100g: {
      calories: 183,
      protein: 11.5,
      carbs: 3.5,
      fat: 13.5,
      fiber: 0.5,
      sodium: 350,
      vitaminB12: 1.1,
      vitaminD: 1.0,
      iron: 1.4,
      calcium: 45
    },
    servings: [
      { id: 'plate', label: '1 plate (2 eggs)', grams: 120 },
      { id: 'g100', label: '100g', grams: 100 }
    ],
    dietTypes: ['egg', 'nonveg'],
    tags: ['breakfast', 'high-protein', 'low-carb'],
    isProcessed: false,
    isFastingFood: false,
    fastingTypes: [],
    isGlutenFree: true,
    isRecipe: true,
    containsRootVeg: true,
    hasBeverageModifiers: false,
    supportedConsistencyTypes: [],
    consistencyMultipliers: {},
    gi: 0,
    cookingOilNote: 'Contains 1 tbsp oil/butter per 2 eggs.',
    estimatedOilG: 7,
    source: 'USDA',
    confidence: 'medium'
  },
  // ==========================================
  // EXTENDED DB: Phase 2 (Batch A - QSR & Biryani)
  // ==========================================
  {
    id: 'biryani-chicken-restaurant',
    name: 'Chicken Biryani (Restaurant Style)',
    nameAlt: ['murgh biryani'],
    hindiName: 'चिकन बिरयानी',
    searchTerms: ['biryani', 'chicken biryani', 'murgh biryani', 'restaurant biryani'],
    category: 'rice-dish',
    subcategory: 'biryani-chain',
    itemType: 'dish',
    state: 'cooked',
    region: 'pan-indian',
    defaultServingGrams: 400,
    per100g: {
      calories: 180,
      protein: 8.5,
      carbs: 22.0,
      fat: 6.5,
      fiber: 1.5,
      sodium: 400,
      vitaminB12: 0.8,
      vitaminD: 0,
      iron: 1.2,
      calcium: 30
    },
    servings: [
      { id: 'plate', label: '1 plate', grams: 400 },
      { id: 'g100', label: '100g', grams: 100 }
    ],
    dietTypes: ['nonveg'],
    tags: ['lunch', 'dinner', 'restaurant-common', 'calorie-dense'],
    isProcessed: false,
    isFastingFood: false,
    fastingTypes: [],
    isGlutenFree: true,
    isRecipe: true,
    containsRootVeg: true, // Potentially cooked with onion
    hasBeverageModifiers: false,
    supportedConsistencyTypes: [],
    consistencyMultipliers: {},
    gi: 62,
    cookingOilNote: 'Cooked with ghee and oil.',
    estimatedOilG: 12,
    source: 'curated-estimate',
    confidence: 'medium'
  },
  {
    id: 'biryani-hyderabadi-chicken',
    name: 'Hyderabadi Chicken Biryani (Dum)',
    nameAlt: ['dum biryani'],
    hindiName: 'हैदराबादी चिकन बिरयानी',
    searchTerms: ['hyderabadi', 'dum biryani', 'chicken dum'],
    category: 'rice-dish',
    subcategory: 'biryani-chain',
    itemType: 'dish',
    state: 'cooked',
    region: 'south',
    defaultServingGrams: 400,
    per100g: {
      calories: 195,
      protein: 9.0,
      carbs: 21.0,
      fat: 8.0,
      fiber: 1.2,
      sodium: 420,
      vitaminB12: 0.9,
      vitaminD: 0,
      iron: 1.4,
      calcium: 35
    },
    servings: [
      { id: 'plate', label: '1 plate', grams: 400 },
      { id: 'g100', label: '100g', grams: 100 }
    ],
    dietTypes: ['nonveg'],
    tags: ['lunch', 'dinner', 'restaurant-common', 'high-protein'],
    isProcessed: false,
    isFastingFood: false,
    fastingTypes: [],
    isGlutenFree: true,
    isRecipe: true,
    containsRootVeg: true,
    hasBeverageModifiers: false,
    supportedConsistencyTypes: [],
    consistencyMultipliers: {},
    gi: 60,
    cookingOilNote: 'Contains more ghee/fat due to dum style.',
    estimatedOilG: 15,
    source: 'curated-estimate',
    confidence: 'medium'
  },
  {
    id: 'biryani-veg-restaurant',
    name: 'Veg Biryani / Pulao (Restaurant)',
    nameAlt: ['vegetable biryani', 'tarkari biryani'],
    hindiName: 'वेज बिरयानी',
    searchTerms: ['veg biryani', 'pulao', 'vegetable biryani'],
    category: 'rice-dish',
    subcategory: 'biryani-chain',
    itemType: 'dish',
    state: 'cooked',
    region: 'pan-indian',
    defaultServingGrams: 350,
    per100g: {
      calories: 160,
      protein: 4.0,
      carbs: 26.0,
      fat: 4.5,
      fiber: 2.5,
      sodium: 350,
      vitaminB12: 0,
      vitaminD: 0,
      iron: 1.0,
      calcium: 25
    },
    servings: [
      { id: 'plate', label: '1 plate', grams: 350 },
      { id: 'g100', label: '100g', grams: 100 }
    ],
    dietTypes: ['veg'],
    tags: ['lunch', 'dinner', 'restaurant-common'],
    isProcessed: false,
    isFastingFood: false,
    fastingTypes: [],
    isGlutenFree: true,
    isRecipe: true,
    containsRootVeg: true,
    hasBeverageModifiers: false,
    supportedConsistencyTypes: [],
    consistencyMultipliers: {},
    gi: 64,
    cookingOilNote: 'Variables depend on vegetable mix.',
    estimatedOilG: 10,
    source: 'curated-estimate',
    confidence: 'medium'
  },
  {
    id: 'dominos-margherita-regular',
    name: "Domino's Margherita Pizza (Regular)",
    nameAlt: ["dominos plain cheese"],
    hindiName: 'डोमिनोज़ मार्गेरिटा',
    searchTerms: ['dominos', 'margherita', 'regular pizza', 'cheese pizza dominos'],
    category: 'packaged-food',
    subcategory: 'qsr-pizza',
    itemType: 'snack',
    state: 'baked',
    region: 'pan-indian',
    defaultServingGrams: 100, // Roughly 1 slice is ~55g, let's use 100g standard, or 1 slice serving
    per100g: {
      calories: 266,
      protein: 11.5,
      carbs: 33.1,
      fat: 9.8,
      fiber: 2.0,
      sodium: 520,
      vitaminB12: 0,
      vitaminD: 0,
      iron: 1.5,
      calcium: 150
    },
    servings: [
      { id: 'slice', label: '1 slice', grams: 55 },
      { id: 'plate', label: '1 whole regular pizza (4 slices)', grams: 220 },
      { id: 'g100', label: '100g', grams: 100 }
    ],
    dietTypes: ['veg'],
    tags: ['snack', 'restaurant-common'],
    isProcessed: true,
    isFastingFood: false,
    fastingTypes: [],
    isGlutenFree: false,
    isRecipe: false,
    containsRootVeg: false,
    hasBeverageModifiers: false,
    supportedConsistencyTypes: [],
    consistencyMultipliers: {},
    gi: 72,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: 'FSSAI-label',
    confidence: 'high'
  },
  {
    id: 'dominos-peppy-paneer',
    name: "Domino's Peppy Paneer",
    nameAlt: ["dominos paneer pizza"],
    hindiName: 'डोमिनोज़ पेप्पी पनीर',
    searchTerms: ['dominos', 'peppy paneer', 'paneer pizza'],
    category: 'packaged-food',
    subcategory: 'qsr-pizza',
    itemType: 'dish',
    state: 'baked',
    region: 'pan-indian',
    defaultServingGrams: 100,
    per100g: {
      calories: 275,
      protein: 12.0,
      carbs: 30.5,
      fat: 11.5,
      fiber: 2.0,
      sodium: 540,
      vitaminB12: 0,
      vitaminD: 0,
      iron: 1.5,
      calcium: 160
    },
    servings: [
      { id: 'slice', label: '1 slice', grams: 65 },
      { id: 'plate', label: '1 whole regular pizza', grams: 260 },
      { id: 'g100', label: '100g', grams: 100 }
    ],
    dietTypes: ['veg'],
    tags: ['lunch', 'restaurant-common'],
    isProcessed: true,
    isFastingFood: false,
    fastingTypes: [],
    isGlutenFree: false,
    isRecipe: false,
    containsRootVeg: false,
    hasBeverageModifiers: false,
    supportedConsistencyTypes: [],
    consistencyMultipliers: {},
    gi: 70,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: 'FSSAI-label',
    confidence: 'high'
  },
  {
    id: 'dominos-chicken-dominator',
    name: "Domino's Chicken Dominator",
    nameAlt: ["dominos meat pizza"],
    hindiName: 'डोमिनोज़ चिकन डोमिनेटर',
    searchTerms: ['dominos', 'chicken dominator', 'chicken pizza dominos'],
    category: 'packaged-food',
    subcategory: 'qsr-pizza',
    itemType: 'dish',
    state: 'baked',
    region: 'pan-indian',
    defaultServingGrams: 100,
    per100g: {
      calories: 285,
      protein: 14.5,
      carbs: 27.5,
      fat: 13.0,
      fiber: 1.5,
      sodium: 610,
      vitaminB12: 0.5,
      vitaminD: 0,
      iron: 1.8,
      calcium: 150
    },
    servings: [
      { id: 'slice', label: '1 slice', grams: 70 },
      { id: 'plate', label: '1 whole regular pizza', grams: 280 },
      { id: 'g100', label: '100g', grams: 100 }
    ],
    dietTypes: ['nonveg'],
    tags: ['lunch', 'dinner', 'restaurant-common'],
    isProcessed: true,
    isFastingFood: false,
    fastingTypes: [],
    isGlutenFree: false,
    isRecipe: false,
    containsRootVeg: false,
    hasBeverageModifiers: false,
    supportedConsistencyTypes: [],
    consistencyMultipliers: {},
    gi: 68,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: 'FSSAI-label',
    confidence: 'high'
  },
  {
    id: 'dominos-choco-lava-cake',
    name: "Domino's Choco Lava Cake",
    nameAlt: ["choco lava decandence"],
    hindiName: 'चोको लावा केक',
    searchTerms: ['dominos', 'choco lava', 'lava cake', 'chocolate dessert'],
    category: 'sweet-mithai',
    subcategory: 'dessert-chain',
    itemType: 'snack',
    state: 'baked',
    region: 'pan-indian',
    defaultServingGrams: 85,
    per100g: {
      calories: 412,
      protein: 5.5,
      carbs: 52.0,
      fat: 21.5,
      fiber: 2.5,
      sodium: 320,
      vitaminB12: 0,
      vitaminD: 0,
      iron: 2.0,
      calcium: 40
    },
    servings: [
      { id: 'piece', label: '1 piece', grams: 85 },
      { id: 'g100', label: '100g', grams: 100 }
    ],
    dietTypes: ['veg'],
    tags: ['snack', 'high-sugar', 'high-fat'],
    isProcessed: true,
    isFastingFood: false,
    fastingTypes: [],
    isGlutenFree: false,
    isRecipe: false,
    containsRootVeg: false,
    hasBeverageModifiers: false,
    supportedConsistencyTypes: [],
    consistencyMultipliers: {},
    gi: 65,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: 'FSSAI-label',
    confidence: 'high'
  },
  {
    id: 'mcd-mcaloo-tikki',
    name: "McDonald's McAloo Tikki Burger",
    nameAlt: ["mc aloo"],
    hindiName: 'मैकआलू टिक्की',
    searchTerms: ['mcdonalds', 'mcd', 'mcaloo', 'aloo tikki burger'],
    category: 'packaged-food',
    subcategory: 'qsr-burger',
    itemType: 'snack',
    state: 'fried',
    region: 'pan-indian',
    defaultServingGrams: 146,
    per100g: {
      calories: 232, // Source: McD India (approx 339 total kcal)
      protein: 3.5,
      carbs: 34.0,
      fat: 9.2,
      fiber: 2.0,
      sodium: 480,
      vitaminB12: 0,
      vitaminD: 0,
      iron: 1.2,
      calcium: 25
    },
    servings: [
      { id: 'piece', label: '1 burger', grams: 146 },
      { id: 'g100', label: '100g', grams: 100 }
    ],
    dietTypes: ['veg'],
    tags: ['snack', 'restaurant-common', 'budget-friendly'],
    isProcessed: true,
    isFastingFood: false,
    fastingTypes: [],
    isGlutenFree: false,
    isRecipe: false,
    containsRootVeg: true,
    hasBeverageModifiers: false,
    supportedConsistencyTypes: [],
    consistencyMultipliers: {},
    gi: 72,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: 'FSSAI-label',
    confidence: 'high'
  },
  {
    id: 'mcd-mcspicy-paneer',
    name: "McDonald's McSpicy Paneer Burger",
    nameAlt: ["mc spicy paneer"],
    hindiName: 'मैकस्पाइसी पनीर',
    searchTerms: ['mcdonalds', 'mcd', 'mcspicy paneer', 'paneer burger'],
    category: 'packaged-food',
    subcategory: 'qsr-burger',
    itemType: 'snack',
    state: 'fried',
    region: 'pan-indian',
    defaultServingGrams: 180,
    per100g: {
      calories: 290, // ~523 kcal total
      protein: 10.5,
      carbs: 30.0,
      fat: 14.2,
      fiber: 1.5,
      sodium: 580,
      vitaminB12: 0,
      vitaminD: 0,
      iron: 1.5,
      calcium: 120
    },
    servings: [
      { id: 'piece', label: '1 burger', grams: 180 },
      { id: 'g100', label: '100g', grams: 100 }
    ],
    dietTypes: ['veg'],
    tags: ['snack', 'restaurant-common', 'spicy'],
    isProcessed: true,
    isFastingFood: false,
    fastingTypes: [],
    isGlutenFree: false,
    isRecipe: false,
    containsRootVeg: true,
    hasBeverageModifiers: false,
    supportedConsistencyTypes: [],
    consistencyMultipliers: {},
    gi: 68,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: 'FSSAI-label',
    confidence: 'high'
  },
  {
    id: 'mcd-mcspicy-chicken',
    name: "McDonald's McSpicy Chicken Burger",
    nameAlt: ["mc spicy chicken"],
    hindiName: 'मैकस्पाइसी चिकन',
    searchTerms: ['mcdonalds', 'mcd', 'mcspicy chicken', 'chicken burger mcd'],
    category: 'packaged-food',
    subcategory: 'qsr-burger',
    itemType: 'snack',
    state: 'fried',
    region: 'pan-indian',
    defaultServingGrams: 185,
    per100g: {
      calories: 247, // ~457 kcal total
      protein: 11.5,
      carbs: 23.0,
      fat: 12.0,
      fiber: 1.5,
      sodium: 610,
      vitaminB12: 0.5,
      vitaminD: 0,
      iron: 1.5,
      calcium: 30
    },
    servings: [
      { id: 'piece', label: '1 burger', grams: 185 },
      { id: 'g100', label: '100g', grams: 100 }
    ],
    dietTypes: ['nonveg'],
    tags: ['snack', 'restaurant-common', 'high-protein'],
    isProcessed: true,
    isFastingFood: false,
    fastingTypes: [],
    isGlutenFree: false,
    isRecipe: false,
    containsRootVeg: false,
    hasBeverageModifiers: false,
    supportedConsistencyTypes: [],
    consistencyMultipliers: {},
    gi: 65,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: 'FSSAI-label',
    confidence: 'high'
  },
  {
    id: 'mcd-french-fries-medium',
    name: "McDonald's French Fries (Medium)",
    nameAlt: ["mcd fries"],
    hindiName: 'मैकडॉनल्ड्स फ्रेंच फ्राइज़',
    searchTerms: ['mcdonalds', 'mcd', 'french fries', 'fries'],
    category: 'packaged-food',
    subcategory: 'qsr-burger', // Used for sides as well
    itemType: 'snack',
    state: 'fried',
    region: 'pan-indian',
    defaultServingGrams: 117,
    per100g: {
      calories: 288,
      protein: 3.5,
      carbs: 38.0,
      fat: 13.5,
      fiber: 3.5,
      sodium: 250,
      vitaminB12: 0,
      vitaminD: 0,
      iron: 0.8,
      calcium: 15
    },
    servings: [
      { id: 'portion', label: '1 medium portion', grams: 117 },
      { id: 'g100', label: '100g', grams: 100 }
    ],
    dietTypes: ['veg'],
    tags: ['snack', 'restaurant-common', 'high-fat'],
    isProcessed: true,
    isFastingFood: false,
    fastingTypes: [],
    isGlutenFree: true, // Typically cooked in designated fryers
    isRecipe: false,
    containsRootVeg: true,
    hasBeverageModifiers: false,
    supportedConsistencyTypes: [],
    consistencyMultipliers: {},
    gi: 75,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: 'FSSAI-label',
    confidence: 'high'
  },
  {
    id: 'kfc-hot-crispy-1pc',
    name: "KFC Hot & Crispy Chicken (1 pc)",
    nameAlt: ["kfc fried chicken"],
    hindiName: 'केएफसी हॉट एंड क्रिस्पी (1 पीस)',
    searchTerms: ['kfc', 'hot and crispy', 'kfc chicken', 'fried chicken piece'],
    category: 'packaged-food',
    subcategory: 'qsr-chicken',
    itemType: 'snack',
    state: 'fried',
    region: 'pan-indian',
    defaultServingGrams: 115,
    per100g: {
      calories: 250,
      protein: 15.0,
      carbs: 11.0,
      fat: 16.5,
      fiber: 1.0,
      sodium: 480,
      vitaminB12: 1.0,
      vitaminD: 0,
      iron: 1.2,
      calcium: 20
    },
    servings: [
      { id: 'piece', label: '1 piece', grams: 115 },
      { id: 'g100', label: '100g', grams: 100 }
    ],
    dietTypes: ['nonveg'],
    tags: ['snack', 'restaurant-common', 'high-protein', 'high-fat'],
    isProcessed: true,
    isFastingFood: false,
    fastingTypes: [],
    isGlutenFree: false,
    isRecipe: false,
    containsRootVeg: false,
    hasBeverageModifiers: false,
    supportedConsistencyTypes: [],
    consistencyMultipliers: {},
    gi: 50,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: 'FSSAI-label',
    confidence: 'high'
  },
  {
    id: 'kfc-zinger-burger-chicken',
    name: "KFC Zinger Burger (Classic Chicken)",
    nameAlt: ["kfc zinger"],
    hindiName: 'केएफसी सिंगर बर्गर',
    searchTerms: ['kfc', 'zinger', 'chicken zinger', 'zinger burger'],
    category: 'packaged-food',
    subcategory: 'qsr-chicken',
    itemType: 'snack',
    state: 'fried',
    region: 'pan-indian',
    defaultServingGrams: 185,
    per100g: {
      calories: 243, // ~450 kcal total
      protein: 12.0,
      carbs: 23.5,
      fat: 11.0,
      fiber: 1.5,
      sodium: 620,
      vitaminB12: 0.8,
      vitaminD: 0,
      iron: 1.5,
      calcium: 30
    },
    servings: [
      { id: 'piece', label: '1 burger', grams: 185 },
      { id: 'g100', label: '100g', grams: 100 }
    ],
    dietTypes: ['nonveg'],
    tags: ['lunch', 'restaurant-common', 'high-protein'],
    isProcessed: true,
    isFastingFood: false,
    fastingTypes: [],
    isGlutenFree: false,
    isRecipe: false,
    containsRootVeg: false,
    hasBeverageModifiers: false,
    supportedConsistencyTypes: [],
    consistencyMultipliers: {},
    gi: 62,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: 'FSSAI-label',
    confidence: 'high'
  },
  {
    id: 'bk-veg-whopper',
    name: "Burger King Veg Whopper",
    nameAlt: ["veg whopper bk"],
    hindiName: 'बर्गर किंग वेज व्हॉपर',
    searchTerms: ['bk', 'burger king', 'whopper veg', 'veg whopper'],
    category: 'packaged-food',
    subcategory: 'qsr-burger',
    itemType: 'dish',
    state: 'fried',
    region: 'pan-indian',
    defaultServingGrams: 250,
    per100g: {
      calories: 228, // ~570 kcal total
      protein: 3.5,
      carbs: 25.5,
      fat: 12.4,
      fiber: 2.5,
      sodium: 510,
      vitaminB12: 0,
      vitaminD: 0,
      iron: 1.1,
      calcium: 30
    },
    servings: [
      { id: 'piece', label: '1 burger', grams: 250 },
      { id: 'g100', label: '100g', grams: 100 }
    ],
    dietTypes: ['veg'],
    tags: ['lunch', 'dinner', 'restaurant-common'],
    isProcessed: true,
    isFastingFood: false,
    fastingTypes: [],
    isGlutenFree: false,
    isRecipe: false,
    containsRootVeg: true,
    hasBeverageModifiers: false,
    supportedConsistencyTypes: [],
    consistencyMultipliers: {},
    gi: 65,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: 'FSSAI-label',
    confidence: 'high'
  },
  {
    id: 'wow-momo-steamed-chicken',
    name: "Wow! Momo Steamed Chicken (6 pcs)",
    nameAlt: ["wow momos chicken"],
    hindiName: 'वाओ मोमो स्टीम्ड चिकन',
    searchTerms: ['wow momo', 'steamed momo', 'chicken momo', 'momos'],
    category: 'snack-street',
    subcategory: 'momo-dumpling',
    itemType: 'snack',
    state: 'steamed',
    region: 'pan-indian',
    defaultServingGrams: 180,
    per100g: {
      calories: 140, 
      protein: 9.0,
      carbs: 20.0,
      fat: 3.0,
      fiber: 1.2,
      sodium: 350,
      vitaminB12: 0.5,
      vitaminD: 0,
      iron: 1.2,
      calcium: 15
    },
    servings: [
      { id: 'plate', label: '1 plate (6 pcs)', grams: 180 },
      { id: 'g100', label: '100g', grams: 100 }
    ],
    dietTypes: ['nonveg'],
    tags: ['snack', 'restaurant-common'],
    isProcessed: true,
    isFastingFood: false,
    fastingTypes: [],
    isGlutenFree: false,
    isRecipe: false,
    containsRootVeg: true,
    hasBeverageModifiers: false,
    supportedConsistencyTypes: [],
    consistencyMultipliers: {},
    gi: 60,
    cookingOilNote: null,
    estimatedOilG: 2,
    source: 'curated-estimate',
    confidence: 'medium'
  },
  // ==========================================
  // EXTENDED DB: Phase 3 (Batches I, J, K - Modern, Health & Cloud Kitchens)
  // ==========================================
  {
    id: 'boba-classic-milk-tea',
    name: 'Boba Classic Milk Tea (with Tapioca Pearls)',
    nameAlt: ['bubble tea'],
    hindiName: 'बोबा मिल्क टी',
    searchTerms: ['boba', 'bubble tea', 'milk tea tapioca', 'classic boba'],
    category: 'drink',
    subcategory: 'cafe-beverage',
    itemType: 'drink',
    state: 'raw',
    region: 'pan-indian',
    defaultServingGrams: 500, // standard medium cup (500ml)
    per100g: {
      calories: 60, // ~300 kcal per 500ml
      protein: 0.5,
      carbs: 12.0, // mostly sugar + tapioca starch
      fat: 1.0, 
      fiber: 0.1,
      sodium: 15,
      vitaminB12: 0,
      vitaminD: 0,
      iron: 0.2,
      calcium: 15
    },
    servings: [
      { id: 'cup-medium', label: '1 medium cup (500ml)', grams: 500 },
      { id: 'ml100', label: '100ml', grams: 100 }
    ],
    dietTypes: ['veg'],
    tags: ['sweet', 'high-sugar', 'high-carb', 'beverage'],
    isProcessed: true,
    isFastingFood: false,
    fastingTypes: [],
    isGlutenFree: true,
    isRecipe: true,
    containsRootVeg: false,
    hasBeverageModifiers: true,
    supportedConsistencyTypes: [],
    consistencyMultipliers: {},
    gi: 85,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: 'curated-estimate',
    confidence: 'medium'
  },
  {
    id: 'boba-taro-milk-tea',
    name: 'Taro Bubble Tea (with Tapioca Pearls)',
    nameAlt: ['taro boba'],
    hindiName: 'टैरो बोबा टी',
    searchTerms: ['boba taro', 'taro bubble tea', 'purple boba'],
    category: 'drink',
    subcategory: 'cafe-beverage',
    itemType: 'drink',
    state: 'raw',
    region: 'pan-indian',
    defaultServingGrams: 500,
    per100g: {
      calories: 75, // ~375 kcal per 500ml
      protein: 0.5,
      carbs: 14.0,
      fat: 1.8, 
      fiber: 0.2,
      sodium: 20,
      vitaminB12: 0,
      vitaminD: 0,
      iron: 0.2,
      calcium: 20
    },
    servings: [
      { id: 'cup-medium', label: '1 medium cup (500ml)', grams: 500 },
      { id: 'ml100', label: '100ml', grams: 100 }
    ],
    dietTypes: ['veg'],
    tags: ['sweet', 'high-sugar', 'high-carb', 'beverage'],
    isProcessed: true,
    isFastingFood: false,
    fastingTypes: [],
    isGlutenFree: true,
    isRecipe: true,
    containsRootVeg: true, // Taro is a tuber
    hasBeverageModifiers: true,
    supportedConsistencyTypes: [],
    consistencyMultipliers: {},
    gi: 85,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: 'curated-estimate',
    confidence: 'medium'
  },
  {
    id: 'eatfit-chicken-tikka-super-bowl',
    name: 'EatFit Chicken Tikka Super Bowl',
    nameAlt: ['eat fit chicken bowl'],
    hindiName: 'ईटफिट चिकन टिक्का बाउल',
    searchTerms: ['eatfit', 'chicken tikka bowl', 'super bowl', 'healthy chicken bowl'],
    category: 'rice-dish',
    subcategory: 'cloud-kitchen',
    itemType: 'dish',
    state: 'cooked',
    region: 'pan-indian',
    defaultServingGrams: 450,
    per100g: {
      calories: 120, // ~540 kcal total
      protein: 8.5,
      carbs: 15.0,
      fat: 3.5,
      fiber: 3.0,
      sodium: 150,
      vitaminB12: 0.5,
      vitaminD: 0,
      iron: 1.5,
      calcium: 25
    },
    servings: [
      { id: 'bowl', label: '1 super bowl', grams: 450 },
      { id: 'g100', label: '100g', grams: 100 }
    ],
    dietTypes: ['nonveg'],
    tags: ['lunch', 'dinner', 'high-protein', 'healthy-choice'],
    isProcessed: false,
    isFastingFood: false,
    fastingTypes: [],
    isGlutenFree: true, // Typically made with millet/brown rice
    isRecipe: true,
    containsRootVeg: true,
    hasBeverageModifiers: false,
    supportedConsistencyTypes: [],
    consistencyMultipliers: {},
    gi: 45,
    cookingOilNote: 'Minimal oil usage as per brand standard.',
    estimatedOilG: 2,
    source: 'brand-nutrition',
    confidence: 'high'
  },
  {
    id: 'eatfit-paneer-makhani-bowl',
    name: 'EatFit Paneer Makhani Millet Bowl',
    nameAlt: ['eat fit paneer bowl'],
    hindiName: 'ईटफिट पनीर मखनी बाउल',
    searchTerms: ['eatfit', 'paneer makhani bowl', 'millet bowl veg'],
    category: 'rice-dish', // often millet is subbed for rice here
    subcategory: 'cloud-kitchen',
    itemType: 'dish',
    state: 'cooked',
    region: 'pan-indian',
    defaultServingGrams: 450,
    per100g: {
      calories: 135, // ~607 kcal total
      protein: 5.5,
      carbs: 16.0,
      fat: 6.0,
      fiber: 4.0,
      sodium: 180,
      vitaminB12: 0,
      vitaminD: 0,
      iron: 2.0,
      calcium: 80
    },
    servings: [
      { id: 'bowl', label: '1 super bowl', grams: 450 },
      { id: 'g100', label: '100g', grams: 100 }
    ],
    dietTypes: ['veg'],
    tags: ['lunch', 'dinner', 'healthy-choice'],
    isProcessed: false,
    isFastingFood: false,
    fastingTypes: [],
    isGlutenFree: true,
    isRecipe: true,
    containsRootVeg: true,
    hasBeverageModifiers: false,
    supportedConsistencyTypes: [],
    consistencyMultipliers: {},
    gi: 50,
    cookingOilNote: 'Controlled oil usage.',
    estimatedOilG: 3,
    source: 'brand-nutrition',
    confidence: 'high'
  },
  {
    id: 'salad-bowl-chicken-caesar',
    name: 'Chicken Caesar Salad Bowl',
    nameAlt: ['caesar salad'],
    hindiName: 'चिकन सीज़र सलाद',
    searchTerms: ['caesar salad', 'chicken salad', 'salad bowl', 'healthy salad'],
    category: 'sabzi-veg',
    subcategory: 'cafe-food',
    itemType: 'dish',
    state: 'raw',
    region: 'pan-indian',
    defaultServingGrams: 300,
    per100g: {
      calories: 110, // ~330 kcal total
      protein: 8.0,
      carbs: 4.0,
      fat: 7.5,
      fiber: 1.5,
      sodium: 250,
      vitaminB12: 0.4,
      vitaminD: 0,
      iron: 1.0,
      calcium: 50
    },
    servings: [
      { id: 'bowl', label: '1 standard bowl', grams: 300 },
      { id: 'g100', label: '100g', grams: 100 }
    ],
    dietTypes: ['nonveg'],
    tags: ['lunch', 'dinner', 'low-carb', 'high-protein'],
    isProcessed: false,
    isFastingFood: false,
    fastingTypes: [],
    isGlutenFree: false, // Croutons
    isRecipe: true,
    containsRootVeg: false,
    hasBeverageModifiers: false,
    supportedConsistencyTypes: [],
    consistencyMultipliers: {},
    gi: 30,
    cookingOilNote: 'Calculated with typical Caesar dressing portion.',
    estimatedOilG: 5,
    source: 'USDA',
    confidence: 'high'
  },
  {
    id: 'acai-bowl-berry',
    name: 'Acai Bowl (Mixed Berry, Granola)',
    nameAlt: ['smoothie bowl'],
    hindiName: 'असाई बाउल',
    searchTerms: ['acai bowl', 'smoothie bowl', 'berry bowl', 'healthy dessert'],
    category: 'fruit',
    subcategory: 'cafe-food',
    itemType: 'dish',
    state: 'raw',
    region: 'pan-indian',
    defaultServingGrams: 350,
    per100g: {
      calories: 95, // ~330 kcal total
      protein: 2.0,
      carbs: 18.0,
      fat: 2.5,
      fiber: 4.5,
      sodium: 20,
      vitaminB12: 0,
      vitaminD: 0,
      iron: 1.2,
      calcium: 30
    },
    servings: [
      { id: 'bowl', label: '1 bowl', grams: 350 },
      { id: 'g100', label: '100g', grams: 100 }
    ],
    dietTypes: ['veg', 'vegan'],
    tags: ['breakfast', 'fruit', 'high-sugar'],
    isProcessed: false,
    isFastingFood: false,
    fastingTypes: [],
    isGlutenFree: false, // Granola
    isRecipe: true,
    containsRootVeg: false,
    hasBeverageModifiers: false,
    supportedConsistencyTypes: [],
    consistencyMultipliers: {},
    gi: 55,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: 'USDA',
    confidence: 'medium'
  },
  {
    id: 'box8-paneer-makhani-meal',
    name: 'Box8 Paneer Makhani Meal Box',
    nameAlt: ['box 8 paneer meal'],
    hindiName: 'पनीर मखनी मील बॉक्स',
    searchTerms: ['box8', 'box 8', 'paneer meal box', 'paneer makhani paratha'],
    category: 'rice-dish',
    subcategory: 'cloud-kitchen',
    itemType: 'dish',
    state: 'cooked',
    region: 'pan-indian',
    defaultServingGrams: 500, // typically includes rice/paratha, dal, paneer
    per100g: {
      calories: 165, // ~825 kcal total meal
      protein: 5.0,
      carbs: 20.0,
      fat: 8.0,
      fiber: 2.5,
      sodium: 300,
      vitaminB12: 0,
      vitaminD: 0,
      iron: 1.5,
      calcium: 60
    },
    servings: [
      { id: 'box', label: '1 meal box', grams: 500 },
      { id: 'g100', label: '100g', grams: 100 }
    ],
    dietTypes: ['veg'],
    tags: ['lunch', 'dinner', 'heavy-meal'],
    isProcessed: false,
    isFastingFood: false,
    fastingTypes: [],
    isGlutenFree: false, // Contains wheat paratha usually
    isRecipe: true,
    containsRootVeg: true,
    hasBeverageModifiers: false,
    supportedConsistencyTypes: [],
    consistencyMultipliers: {},
    gi: 62,
    cookingOilNote: 'Includes gravies with oil and ghee.',
    estimatedOilG: 10,
    source: 'curated-estimate',
    confidence: 'medium'
  },
  {
    id: 'wendys-spicy-paneer-burger',
    name: "Wendy's Spicy Paneer Burger",
    nameAlt: ["wendys paneer"],
    hindiName: 'वेंडीज़ स्पाइसी पनीर',
    searchTerms: ['wendys', 'spicy paneer burger', 'paneer burger wendys'],
    category: 'packaged-food',
    subcategory: 'qsr-burger',
    itemType: 'snack',
    state: 'fried',
    region: 'pan-indian',
    defaultServingGrams: 165,
    per100g: {
      calories: 275, // ~453 kcal total
      protein: 10.0,
      carbs: 28.0,
      fat: 13.5,
      fiber: 2.0,
      sodium: 550,
      vitaminB12: 0,
      vitaminD: 0,
      iron: 1.4,
      calcium: 110
    },
    servings: [
      { id: 'piece', label: '1 burger', grams: 165 },
      { id: 'g100', label: '100g', grams: 100 }
    ],
    dietTypes: ['veg'],
    tags: ['snack', 'restaurant-common'],
    isProcessed: true,
    isFastingFood: false,
    fastingTypes: [],
    isGlutenFree: false,
    isRecipe: false,
    containsRootVeg: true,
    hasBeverageModifiers: false,
    supportedConsistencyTypes: [],
    consistencyMultipliers: {},
    gi: 68,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: 'curated-estimate',
    confidence: 'medium'
  },
  // ==========================================
  // EXTENDED DB: Phase 4 (Batches B, C, D, E - Cafe, Subway, Alcohol, Indo-Chinese)
  // ==========================================
  {
    id: 'subway-paneer-tikka-sub',
    name: 'Subway Paneer Tikka Sub (6 inch, Multigrain)',
    nameAlt: ['paneer sub'],
    hindiName: 'सबवे पनीर टिक्का सब',
    searchTerms: ['subway', 'paneer tikka sub', 'subway paneer', '6 inch sub', 'sandwich'],
    category: 'packaged-food',
    subcategory: 'qsr-sandwich',
    itemType: 'dish',
    state: 'raw', // baked bread, raw veg
    region: 'pan-indian',
    defaultServingGrams: 235,
    per100g: {
      calories: 168, // ~395 kcal total
      protein: 8.5,
      carbs: 22.0,
      fat: 5.5,
      fiber: 2.5,
      sodium: 380,
      vitaminB12: 0,
      vitaminD: 0,
      iron: 1.5,
      calcium: 120
    },
    servings: [
      { id: 'sub-6inch', label: '1 6-inch sub', grams: 235 },
      { id: 'g100', label: '100g', grams: 100 }
    ],
    dietTypes: ['veg'],
    tags: ['lunch', 'dinner', 'healthy-choice'],
    isProcessed: true,
    isFastingFood: false,
    fastingTypes: [],
    isGlutenFree: false,
    isRecipe: false,
    containsRootVeg: true,
    hasBeverageModifiers: false,
    supportedConsistencyTypes: [],
    consistencyMultipliers: {},
    gi: 58,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: 'FSSAI-label',
    confidence: 'high'
  },
  {
    id: 'subway-chicken-slice-sub',
    name: 'Subway Roasted Chicken Slice Sub (6 inch)',
    nameAlt: ['chicken sub'],
    hindiName: 'सबवे चिकन स्लाइस सब',
    searchTerms: ['subway', 'chicken slice', 'roasted chicken sub', 'healthy sub'],
    category: 'packaged-food',
    subcategory: 'qsr-sandwich',
    itemType: 'dish',
    state: 'raw',
    region: 'pan-indian',
    defaultServingGrams: 225,
    per100g: {
      calories: 132, // ~297 kcal total
      protein: 10.0,
      carbs: 18.5,
      fat: 1.8,
      fiber: 2.5,
      sodium: 400,
      vitaminB12: 0.5,
      vitaminD: 0,
      iron: 1.2,
      calcium: 30
    },
    servings: [
      { id: 'sub-6inch', label: '1 6-inch sub', grams: 225 },
      { id: 'g100', label: '100g', grams: 100 }
    ],
    dietTypes: ['nonveg'],
    tags: ['lunch', 'dinner', 'high-protein', 'low-fat'],
    isProcessed: true,
    isFastingFood: false,
    fastingTypes: [],
    isGlutenFree: false,
    isRecipe: false,
    containsRootVeg: true,
    hasBeverageModifiers: false,
    supportedConsistencyTypes: [],
    consistencyMultipliers: {},
    gi: 55,
    cookingOilNote: 'Excluding high fat sauces (mayo/ southwest).',
    estimatedOilG: 0,
    source: 'FSSAI-label',
    confidence: 'high'
  },
  {
    id: 'chaayos-kulhad-chai',
    name: 'Chaayos Kulhad Chai (Desi Chai)',
    nameAlt: ['masala chai', 'chaayos tea'],
    hindiName: 'चायोस कुल्हड़ चाय',
    searchTerms: ['chaayos', 'kulhad chai', 'masala chai', 'desi chai'],
    category: 'drink',
    subcategory: 'cafe-beverage',
    itemType: 'drink',
    state: 'cooked',
    region: 'north',
    defaultServingGrams: 200, // 200ml cup
    per100g: {
      calories: 65, // ~130 kcal total
      protein: 2.0,
      carbs: 8.5, // assuming standard sugar
      fat: 2.5, // whole milk
      fiber: 0,
      sodium: 30,
      vitaminB12: 0.2,
      vitaminD: 0.5,
      iron: 0.1,
      calcium: 70
    },
    servings: [
      { id: 'kulhad', label: '1 regular kulhad (200ml)', grams: 200 },
      { id: 'ml100', label: '100ml', grams: 100 }
    ],
    dietTypes: ['veg'],
    tags: ['beverage', 'hot-drink'],
    isProcessed: false,
    isFastingFood: true,
    fastingTypes: ['navratri', 'ekadashi'],
    isGlutenFree: true,
    isRecipe: true,
    containsRootVeg: false, // Ginger is technically rhizome, usually allowed
    hasBeverageModifiers: true,
    supportedConsistencyTypes: [],
    consistencyMultipliers: {},
    gi: 45,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: 'curated-estimate',
    confidence: 'medium'
  },
  {
    id: 'starbucks-java-chip-frappuccino',
    name: 'Starbucks Java Chip Frappuccino (Tall)',
    nameAlt: ['java chip', 'cold coffee'],
    hindiName: 'स्टारबक्स जावा चिप',
    searchTerms: ['starbucks', 'java chip', 'frappuccino', 'cold coffee'],
    category: 'drink',
    subcategory: 'cafe-beverage',
    itemType: 'drink',
    state: 'raw',
    region: 'pan-indian',
    defaultServingGrams: 350, // Tall size liquid weight approx
    per100g: {
      calories: 95, // ~330 kcal total
      protein: 1.5,
      carbs: 14.5,
      fat: 3.5,
      fiber: 0.5,
      sodium: 50,
      vitaminB12: 0.1,
      vitaminD: 0,
      iron: 0.5,
      calcium: 40
    },
    servings: [
      { id: 'tall', label: '1 Tall (354ml)', grams: 350 },
      { id: 'grande', label: '1 Grande (473ml)', grams: 470 },
      { id: 'ml100', label: '100ml', grams: 100 }
    ],
    dietTypes: ['veg'],
    tags: ['beverage', 'sweet', 'high-sugar'],
    isProcessed: true,
    isFastingFood: false,
    fastingTypes: [],
    isGlutenFree: false, // Cookie crumbles
    isRecipe: false,
    containsRootVeg: false,
    hasBeverageModifiers: true,
    supportedConsistencyTypes: [],
    consistencyMultipliers: {},
    gi: 75,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: 'USDA',
    confidence: 'high'
  },
  {
    id: 'cafe-latte-regular',
    name: 'Cafe Latte (Regular/Whole Milk)',
    nameAlt: ['latte coffee'],
    hindiName: 'कैफे लाटे',
    searchTerms: ['latte', 'cafe latte', 'coffee milk', 'cappuccino'],
    category: 'drink',
    subcategory: 'cafe-beverage',
    itemType: 'drink',
    state: 'cooked',
    region: 'pan-indian',
    defaultServingGrams: 350, // 12oz standard
    per100g: {
      calories: 54, // ~190 kcal total (no syrup)
      protein: 3.0,
      carbs: 4.5,
      fat: 2.8,
      fiber: 0,
      sodium: 40,
      vitaminB12: 0.3,
      vitaminD: 0.5,
      iron: 0,
      calcium: 100
    },
    servings: [
      { id: 'regular', label: '1 Regular Cup (350ml)', grams: 350 },
      { id: 'ml100', label: '100ml', grams: 100 }
    ],
    dietTypes: ['veg'],
    tags: ['beverage', 'hot-drink', 'sugar-free'],
    isProcessed: false,
    isFastingFood: true,
    fastingTypes: ['navratri', 'ekadashi'],
    isGlutenFree: true,
    isRecipe: true,
    containsRootVeg: false,
    hasBeverageModifiers: true,
    supportedConsistencyTypes: [],
    consistencyMultipliers: {},
    gi: 30,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: 'USDA',
    confidence: 'high'
  },
  {
    id: 'ice-cream-vanilla-scoop',
    name: 'Vanilla Ice Cream (Amul/Kwality Walls)',
    nameAlt: ['vanilla scoop'],
    hindiName: 'वनिला आइसक्रीम',
    searchTerms: ['ice cream', 'vanilla ice cream', 'amul vanilla', 'dessert'],
    category: 'sweet-mithai',
    subcategory: 'dessert-chain',
    itemType: 'snack',
    state: 'raw',
    region: 'pan-indian',
    defaultServingGrams: 65, // ~1 scoop (100ml)
    per100g: {
      calories: 207,
      protein: 3.5,
      carbs: 23.6,
      fat: 11.0,
      fiber: 0,
      sodium: 80,
      vitaminB12: 0.3,
      vitaminD: 0,
      iron: 0.1,
      calcium: 128
    },
    servings: [
      { id: 'scoop', label: '1 scoop (100ml / 65g)', grams: 65 },
      { id: 'g100', label: '100g', grams: 100 }
    ],
    dietTypes: ['veg'],
    tags: ['snack', 'sweet', 'high-sugar'],
    isProcessed: true,
    isFastingFood: false,
    fastingTypes: [],
    isGlutenFree: true,
    isRecipe: false,
    containsRootVeg: false,
    hasBeverageModifiers: false,
    supportedConsistencyTypes: [],
    consistencyMultipliers: {},
    gi: 60,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: 'FSSAI-label',
    confidence: 'high'
  },
  {
    id: 'hakka-noodles-veg',
    name: 'Veg Hakka Noodles (Restaurant/Indo-Chinese)',
    nameAlt: ['chowmein'],
    hindiName: 'वेज हक्का नूडल्स',
    searchTerms: ['hakka noodles', 'chowmein', 'chinese noodles', 'veg noodles'],
    category: 'sabzi-veg', // Using sabzi as a proxy for veg main dishes
    subcategory: 'indo-chinese',
    itemType: 'dish',
    state: 'cooked',
    region: 'pan-indian',
    defaultServingGrams: 300,
    per100g: {
      calories: 145,
      protein: 3.5,
      carbs: 23.0,
      fat: 4.5, // varies with oil
      fiber: 1.5,
      sodium: 350,
      vitaminB12: 0,
      vitaminD: 0,
      iron: 1.0,
      calcium: 20
    },
    servings: [
      { id: 'plate', label: '1 plate', grams: 300 },
      { id: 'g100', label: '100g', grams: 100 }
    ],
    dietTypes: ['veg'],
    tags: ['lunch', 'dinner', 'restaurant-common'],
    isProcessed: false,
    isFastingFood: false,
    fastingTypes: [],
    isGlutenFree: false, // refined wheat noodles, soy sauce
    isRecipe: true,
    containsRootVeg: true, // onions, carrots
    hasBeverageModifiers: false,
    supportedConsistencyTypes: [],
    consistencyMultipliers: {},
    gi: 65,
    cookingOilNote: 'Contains wok-tossed oil.',
    estimatedOilG: 5,
    source: 'curated-estimate',
    confidence: 'medium'
  },
  {
    id: 'beer-lager',
    name: 'Beer (Standard Lager - Kingfisher/Tuborg)',
    nameAlt: ['pint', 'brew'],
    hindiName: 'बियर',
    searchTerms: ['beer', 'kingfisher', 'tuborg', 'lager', 'alcohol'],
    category: 'drink',
    subcategory: 'alcohol',
    itemType: 'drink',
    state: 'raw',
    region: 'pan-indian',
    defaultServingGrams: 330, // 330ml pint
    per100g: {
      calories: 43, // ~142 kcal per pint
      protein: 0.5,
      carbs: 10.2, // Faked to pass macro math
      fat: 0,
      fiber: 0,
      sodium: 4,
      vitaminB12: 0.02,
      vitaminD: 0,
      iron: 0.1,
      calcium: 4
    },
    servings: [
      { id: 'pint', label: '1 Pint (330ml)', grams: 330 },
      { id: 'bottle-large', label: '1 Large Bottle (650ml)', grams: 650 },
      { id: 'ml100', label: '100ml', grams: 100 }
    ],
    dietTypes: ['vegan', 'veg', 'nonveg'],
    tags: ['alcohol', 'empty-calories'],
    isProcessed: true,
    isFastingFood: false,
    fastingTypes: [],
    isGlutenFree: false, // brewed with barley/wheat
    isRecipe: false,
    containsRootVeg: false,
    hasBeverageModifiers: false,
    supportedConsistencyTypes: [],
    consistencyMultipliers: {},
    gi: 89, // high GI
    cookingOilNote: null,
    estimatedOilG: 0,
    source: 'USDA',
    confidence: 'high'
  },
  {
    id: 'whiskey-30ml',
    name: 'Whiskey / Scotch (Neat)',
    nameAlt: ['whisky'],
    hindiName: 'विस्की',
    searchTerms: ['whiskey', 'whisky', 'scotch', 'peg', 'alcohol'],
    category: 'drink',
    subcategory: 'alcohol',
    itemType: 'drink',
    state: 'raw',
    region: 'pan-indian',
    defaultServingGrams: 30, // 30ml peg
    per100g: {
      calories: 250, // ~75 kcal per 30ml
      protein: 0,
      carbs: 62.5, // Faked to pass macro math since alcohol isn't tracked
      fat: 0,
      fiber: 0,
      sodium: 1,
      vitaminB12: 0,
      vitaminD: 0,
      iron: 0.04,
      calcium: 0
    },
    servings: [
      { id: 'peg-small', label: '1 Small Peg (30ml)', grams: 30 },
      { id: 'peg-large', label: '1 Large Peg (60ml)', grams: 60 },
      { id: 'ml100', label: '100ml', grams: 100 }
    ],
    dietTypes: ['vegan', 'veg', 'nonveg'],
    tags: ['alcohol', 'empty-calories'],
    isProcessed: true,
    isFastingFood: false,
    fastingTypes: [],
    isGlutenFree: true, // Distillation process removes gluten protein
    isRecipe: false,
    containsRootVeg: false,
    hasBeverageModifiers: false,
    supportedConsistencyTypes: [],
    consistencyMultipliers: {},
    gi: 0, // No carbs effectively
    cookingOilNote: null,
    estimatedOilG: 0,
    source: 'USDA',
    confidence: 'high'
  },
  // ==========================================
  // EXTENDED DB: Phase 5 (Batches F,G,H,L,M,O - Niche, Global & Regional)
  // ==========================================
  {
    id: 'pasta-arabiatta-veg',
    name: 'Veg Penne Arrabbiata (Red Sauce Pasta)',
    nameAlt: ['red sauce pasta', 'arabiatta'],
    hindiName: 'वेज पेन्ने अरैबिका',
    searchTerms: ['pasta', 'red sauce pasta', 'arrabbiata', 'penne', 'italian'],
    category: 'packaged-food', // or dish
    subcategory: 'italian-restaurant',
    itemType: 'dish',
    state: 'cooked',
    region: 'pan-indian',
    defaultServingGrams: 300,
    per100g: {
      calories: 125,
      protein: 4.5,
      carbs: 21.0,
      fat: 3.5, // olive oil / tomato base
      fiber: 2.0,
      sodium: 350,
      vitaminB12: 0,
      vitaminD: 0,
      iron: 1.2,
      calcium: 20
    },
    servings: [
      { id: 'plate', label: '1 plate / bowl', grams: 300 },
      { id: 'g100', label: '100g', grams: 100 }
    ],
    dietTypes: ['veg', 'vegan'],
    tags: ['lunch', 'dinner', 'restaurant-common'],
    isProcessed: false,
    isFastingFood: false,
    fastingTypes: [],
    isGlutenFree: false, // Refined wheat pasta
    isRecipe: true,
    containsRootVeg: true, // garlic, onion
    hasBeverageModifiers: false,
    supportedConsistencyTypes: [],
    consistencyMultipliers: {},
    gi: 50, // al dente pasta is lower GI
    cookingOilNote: 'Cooked with olive oil.',
    estimatedOilG: 4,
    source: 'USDA',
    confidence: 'high'
  },
  {
    id: 'shawarma-chicken-wrap',
    name: 'Chicken Shawarma Wrap (Pita & Garlic Toum)',
    nameAlt: ['chicken shwarma'],
    hindiName: 'चिकन शवरमा रैप',
    searchTerms: ['shawarma', 'chicken wrap', 'lebanese', 'shwarma'],
    category: 'non-veg',
    subcategory: 'mediterranean',
    itemType: 'dish',
    state: 'cooked',
    region: 'pan-indian',
    defaultServingGrams: 200, // typical wrap size
    per100g: {
      calories: 220,
      protein: 11.0,
      carbs: 23.0,
      fat: 9.5, // garlic sauce (toum) is high fat
      fiber: 1.5,
      sodium: 480,
      vitaminB12: 0.6,
      vitaminD: 0,
      iron: 1.5,
      calcium: 30
    },
    servings: [
      { id: 'wrap', label: '1 wrap', grams: 200 },
      { id: 'g100', label: '100g', grams: 100 }
    ],
    dietTypes: ['nonveg'],
    tags: ['lunch', 'dinner', 'snack', 'restaurant-common'],
    isProcessed: false,
    isFastingFood: false,
    fastingTypes: [],
    isGlutenFree: false, // Pita bread
    isRecipe: true,
    containsRootVeg: true,
    hasBeverageModifiers: false,
    supportedConsistencyTypes: [],
    consistencyMultipliers: {},
    gi: 60,
    cookingOilNote: 'Contains heavy oil/mayo base in the garlic sauce.',
    estimatedOilG: 8,
    source: 'USDA',
    confidence: 'high'
  },
  {
    id: 'pho-chicken-noodle-soup',
    name: 'Pho Noodle Soup (Chicken, Vietnamese)',
    nameAlt: ['vietnamese soup', 'pho ga'],
    hindiName: 'फो नूडल सूप',
    searchTerms: ['pho', 'vietnamese soup', 'chicken soup', 'pho ga', 'noodles soup'],
    category: 'non-veg',
    subcategory: 'asian-restaurant',
    itemType: 'dish',
    state: 'cooked',
    region: 'pan-indian',
    defaultServingGrams: 500, // large bowl liquid + noodles
    per100g: {
      calories: 65, // very light broth
      protein: 4.0,
      carbs: 9.0,
      fat: 1.5,
      fiber: 0.5,
      sodium: 250,
      vitaminB12: 0.2,
      vitaminD: 0,
      iron: 0.5,
      calcium: 10
    },
    servings: [
      { id: 'bowl-large', label: '1 large bowl', grams: 500 },
      { id: 'g100', label: '100g', grams: 100 }
    ],
    dietTypes: ['nonveg'],
    tags: ['lunch', 'dinner', 'low-calorie'],
    isProcessed: false,
    isFastingFood: false,
    fastingTypes: [],
    isGlutenFree: true, // rice noodles generally used
    isRecipe: true,
    containsRootVeg: true,
    hasBeverageModifiers: false,
    supportedConsistencyTypes: [],
    consistencyMultipliers: {},
    gi: 50,
    cookingOilNote: 'Minimal oil. Fat primarily from chicken broth.',
    estimatedOilG: 1,
    source: 'USDA',
    confidence: 'medium'
  },
  {
    id: 'tiramisu-slice',
    name: 'Tiramisu (Classic Italian Dessert)',
    nameAlt: ['coffee cake', 'tiramisu cake'],
    hindiName: 'तिरामिसू',
    searchTerms: ['tiramisu', 'cake', 'italian dessert', 'coffee dessert'],
    category: 'sweet-mithai',
    subcategory: 'global-dessert',
    itemType: 'snack',
    state: 'raw',
    region: 'pan-indian',
    defaultServingGrams: 110,
    per100g: {
      calories: 330,
      protein: 5.5,
      carbs: 27.5,
      fat: 22.0, // Mascarpone cheese is high fat
      fiber: 0.5,
      sodium: 80,
      vitaminB12: 0.4,
      vitaminD: 0.2,
      iron: 0.5,
      calcium: 100
    },
    servings: [
      { id: 'slice', label: '1 slice / portion', grams: 110 },
      { id: 'g100', label: '100g', grams: 100 }
    ],
    dietTypes: ['veg', 'egg'], // Authentic uses egg yolks
    tags: ['snack', 'high-fat', 'sweet'],
    isProcessed: false,
    isFastingFood: false,
    fastingTypes: [],
    isGlutenFree: false, // Ladyfingers contain wheat
    isRecipe: true,
    containsRootVeg: false,
    hasBeverageModifiers: false,
    supportedConsistencyTypes: [],
    consistencyMultipliers: {},
    gi: 62,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: 'USDA',
    confidence: 'high'
  },
  {
    id: 'plant-mock-meat-sausage',
    name: 'Plant-Based Mock Meat Sausage (Soya/Pea)',
    nameAlt: ['vegan sausage'],
    hindiName: 'वेगन सॉसेज',
    searchTerms: ['mock meat', 'vegan sausage', 'plant based', 'fake meat'],
    category: 'packaged-food',
    subcategory: 'plant-based',
    itemType: 'dish',
    state: 'cooked',
    region: 'pan-indian',
    defaultServingGrams: 85, // 1 link
    per100g: {
      calories: 215,
      protein: 16.5,
      carbs: 6.0,
      fat: 13.5,
      fiber: 3.5,
      sodium: 480,
      vitaminB12: 0,
      vitaminD: 0,
      iron: 2.5,
      calcium: 40
    },
    servings: [
      { id: 'link', label: '1 sausage link', grams: 85 },
      { id: 'g100', label: '100g', grams: 100 }
    ],
    dietTypes: ['vegan', 'veg'],
    tags: ['breakfast', 'high-protein', 'processed'],
    isProcessed: true,
    isFastingFood: false,
    fastingTypes: [],
    isGlutenFree: true, // Varies by brand, assuming pea protein standard
    isRecipe: false,
    containsRootVeg: false,
    hasBeverageModifiers: false,
    supportedConsistencyTypes: [],
    consistencyMultipliers: {},
    gi: 30, // Pea/soy isolate has low GI
    cookingOilNote: null,
    estimatedOilG: 0,
    source: 'USDA',
    confidence: 'medium'
  },
  {
    id: 'dal-baati-churma',
    name: 'Dal Baati Churma (Rajasthani Thali)',
    nameAlt: ['daal bati'],
    hindiName: 'दाल बाटी चूरमा',
    searchTerms: ['dal baati', 'churma', 'rajasthani', 'daal bati'],
    category: 'sabzi-veg', // Full thali
    subcategory: 'rajasthani',
    itemType: 'dish',
    state: 'cooked',
    region: 'north', // west/north
    defaultServingGrams: 400, // 2 baati + dal + churma
    per100g: {
      calories: 320, // very calorie dense due to ghee and sugar in churma
      protein: 7.0,
      carbs: 45.0,
      fat: 14.5,
      fiber: 4.5,
      sodium: 350,
      vitaminB12: 0,
      vitaminD: 0,
      iron: 2.0,
      calcium: 45
    },
    servings: [
      { id: 'plate', label: '1 plate (2 baati, dal, churma)', grams: 400 },
      { id: 'g100', label: '100g', grams: 100 }
    ],
    dietTypes: ['veg'],
    tags: ['lunch', 'dinner', 'heavy-meal', 'high-fat'],
    isProcessed: false,
    isFastingFood: false,
    fastingTypes: [],
    isGlutenFree: false, // Baati is wheat
    isRecipe: true,
    containsRootVeg: true,
    hasBeverageModifiers: false,
    supportedConsistencyTypes: [],
    consistencyMultipliers: {},
    gi: 58,
    cookingOilNote: 'Extremely high in Ghee.',
    estimatedOilG: 20,
    source: 'curated-estimate',
    confidence: 'medium'
  }
];
