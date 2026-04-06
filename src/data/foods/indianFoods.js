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
      itemType: "packaged",
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
  {
    id: "almonds-raw",
    name: "Almonds (Badam, Raw)",
    nameAlt: [
        "badam"
    ],
    hindiName: "बादाम",
    searchTerms: [
        "almond",
        "badam",
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
        {
            id: "handful",
            label: "1 handful",
            grams: 30
        },
        {
            id: "piece",
            label: "5 pieces",
            grams: 6
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
    gi: 0,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: "USDA",
    confidence: "high"
}  ,
  {
    id: "dates-khajoor",
    name: "Dates (Khajoor, Dried)",
    nameAlt: [
        "khajur",
        "pind khajoor"
    ],
    hindiName: "खजूर",
    searchTerms: [
        "dates",
        "khajoor",
        "khajur",
        "dry fruit"
    ],
    category: "fruit",
    subcategory: "dry-fruits-nuts",
    itemType: "base-food",
    state: "raw",
    region: "pan-indian",
    defaultServingGrams: 24,
    per100g: {
        calories: 277,
        protein: 1.8,
        carbs: 75,
        fat: 0.2,
        fiber: 8,
        sodium: 1,
        vitaminB12: 0,
        vitaminD: 0,
        iron: 1,
        calcium: 64
    },
    servings: [
        {
            id: "piece",
            label: "1 date (pitted)",
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
        "pre-workout",
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
    gi: 42,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: "USDA",
    confidence: "high",
    notes: "Excellent natural pre-workout energy. Staple for Ramzan iftar."
}  ,
  {
    id: "chai-base",
    name: "Chai (Base — Black Tea)",
    nameAlt: [
        "chai",
        "tea black",
        "plain tea"
    ],
    hindiName: "चाय",
    searchTerms: [
        "chai",
        "tea",
        "black tea"
    ],
    category: "drink",
    subcategory: "tea-coffee",
    itemType: "drink",
    state: "cooked",
    region: "pan-indian",
    defaultServingGrams: 150,
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
        {
            id: "cup",
            label: "1 cup (150ml)",
            grams: 150
        },
        {
            id: "glass",
            label: "1 tall glass",
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
        "breakfast",
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
    hasBeverageModifiers: true,
    supportedConsistencyTypes: [],
    consistencyMultipliers: {},
    gi: 0,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: "USDA",
    confidence: "high",
    notes: "Base values only. Use the Beverage Builder to add milk and sugar."
}  ,
  {
    id: "coffee-black",
    name: "Black Coffee (Base)",
    nameAlt: [
        "filter coffee base",
        "nescafe black"
    ],
    hindiName: "ब्लैक कॉफ़ी",
    searchTerms: [
        "coffee",
        "black coffee",
        "americano",
        "nescafe"
    ],
    category: "drink",
    subcategory: "tea-coffee",
    itemType: "drink",
    state: "cooked",
    region: "pan-indian",
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
        {
            id: "cup",
            label: "1 cup (150ml)",
            grams: 150
        },
        {
            id: "glass",
            label: "1 tall glass",
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
        "breakfast",
        "pre-workout",
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
    hasBeverageModifiers: true,
    supportedConsistencyTypes: [],
    consistencyMultipliers: {},
    gi: 0,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: "USDA",
    confidence: "high"
}  ,
  {
    id: "haldi-doodh-base",
    name: "Haldi Doodh (Base — Turmeric Water/Mix)",
    nameAlt: [
        "turmeric latte base",
        "golden milk base"
    ],
    hindiName: "हल्दी दूध बेस",
    searchTerms: [
        "haldi",
        "doodh",
        "turmeric",
        "golden milk"
    ],
    category: "drink",
    subcategory: "milk-based",
    itemType: "drink",
    state: "cooked",
    region: "pan-indian",
    defaultServingGrams: 150,
    per100g: {
        calories: 5,
        protein: 0.2,
        carbs: 1,
        fat: 0.1,
        fiber: 0.5,
        sodium: 2,
        vitaminB12: 0,
        vitaminD: 0,
        iron: 0.5,
        calcium: 5
    },
    servings: [
        {
            id: "glass",
            label: "1 glass (200ml)",
            grams: 200
        },
        {
            id: "cup",
            label: "1 cup",
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
        "nonveg"
    ],
    tags: [
        "before-bed",
        "immunity",
        "low-calorie"
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
    hasBeverageModifiers: true,
    supportedConsistencyTypes: [],
    consistencyMultipliers: {},
    gi: 0,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: "curated-estimate",
    confidence: "medium",
    notes: "Base values for haldi+water. Must add milk and sugar/honey via Beverage Builder."
}  ,
  {
    id: "sattu-sharbat",
    name: "Sattu Sharbat (Namkeen/Salty)",
    nameAlt: [
        "sattu drink",
        "sattu cooler"
    ],
    hindiName: "सत्तू शर्बत",
    searchTerms: [
        "sattu",
        "sharbat",
        "drink",
        "desi protein shake"
    ],
    category: "drink",
    subcategory: "cooling",
    itemType: "dish",
    state: "raw",
    region: "north",
    defaultServingGrams: 300,
    per100g: {
        calories: 45,
        protein: 2.2,
        carbs: 7.5,
        fat: 0.7,
        fiber: 2,
        sodium: 120,
        vitaminB12: 0,
        vitaminD: 0,
        iron: 0.8,
        calcium: 15
    },
    servings: [
        {
            id: "glass",
            label: "1 tall glass (300ml)",
            grams: 300
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
        "high-protein",
        "cooling",
        "budget-friendly"
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
    gi: 25,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: "healthifyme",
    confidence: "medium",
    notes: "The Indian \"Desi Protein Shake\". Made with 30-40g roasted bengal gram powder per glass."
}  ,
  {
    id: "coconut-water",
    name: "Coconut Water (Tender)",
    nameAlt: [
        "nariyal pani",
        "daab"
    ],
    hindiName: "नारियल पानी",
    searchTerms: [
        "coconut water",
        "nariyal pani",
        "daab"
    ],
    category: "drink",
    subcategory: "fruit-juice",
    itemType: "base-food",
    state: "raw",
    region: "pan-indian",
    defaultServingGrams: 250,
    per100g: {
        calories: 19,
        protein: 0.7,
        carbs: 4,
        fat: 0.2,
        fiber: 1.1,
        sodium: 105,
        vitaminB12: 0,
        vitaminD: 0,
        iron: 0.3,
        calcium: 24
    },
    servings: [
        {
            id: "medium",
            label: "1 medium coconut (~250ml)",
            grams: 250
        },
        {
            id: "glass",
            label: "1 glass",
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
        "post-workout",
        "hydration",
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
    gi: 35,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: "USDA",
    confidence: "high",
    notes: "Must-have post-workout hydration. Very rich in potassium."
}  ,
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
}
  ,
  {
    id: "ghee-cow",
    name: "Ghee (Cow)",
    nameAlt: [
        "clarified butter",
        "desi ghee"
    ],
    hindiName: "देसी घी",
    searchTerms: [
        "ghee",
        "desi ghee",
        "butter oil"
    ],
    category: "oil-fat",
    subcategory: "animal-fat",
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
        vitaminD: 0,
        iron: 0,
        calcium: 0
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
        "veg",
        "jain",
        "nonveg"
    ],
    tags: [
        "high-fat",
        "high-calorie"
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
    id: "coconut-oil",
    name: "Coconut Oil",
    nameAlt: [
        "nariyal tel"
    ],
    hindiName: "नारियल तेल",
    searchTerms: [
        "coconut oil",
        "nariyal tel"
    ],
    category: "oil-fat",
    subcategory: "plant-fat",
    itemType: "base-food",
    state: "raw",
    region: "south",
    defaultServingGrams: 15,
    per100g: {
        calories: 862,
        protein: 0,
        carbs: 0,
        fat: 100,
        fiber: 0,
        sodium: 0,
        vitaminB12: 0,
        vitaminD: 0,
        iron: 0,
        calcium: 0
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
        "high-fat"
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
    id: "mustard-oil",
    name: "Mustard Oil",
    nameAlt: [
        "sarson ka tel"
    ],
    hindiName: "सरसों का तेल",
    searchTerms: [
        "mustard oil",
        "sarson"
    ],
    category: "oil-fat",
    subcategory: "plant-fat",
    itemType: "base-food",
    state: "raw",
    region: "north",
    defaultServingGrams: 15,
    per100g: {
        calories: 884,
        protein: 0,
        carbs: 0,
        fat: 100,
        fiber: 0,
        sodium: 0,
        vitaminB12: 0,
        vitaminD: 0,
        iron: 0,
        calcium: 0
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
    gi: 0,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: "USDA",
    confidence: "high"
}  ,
  {
    id: "sunflower-oil",
    name: "Sunflower Oil / Refined Oil",
    nameAlt: [
        "refined oil"
    ],
    hindiName: "रिफाइंड तेल",
    searchTerms: [
        "sunflower oil",
        "refined",
        "oil",
        "saffola"
    ],
    category: "oil-fat",
    subcategory: "plant-fat",
    itemType: "base-food",
    state: "raw",
    region: "pan-indian",
    defaultServingGrams: 15,
    per100g: {
        calories: 884,
        protein: 0,
        carbs: 0,
        fat: 100,
        fiber: 0,
        sodium: 0,
        vitaminB12: 0,
        vitaminD: 0,
        iron: 0,
        calcium: 0
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
        "high-fat"
    ],
    isProcessed: true,
    isFastingFood: true,
    fastingTypes: [
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
    id: "olive-oil",
    name: "Olive Oil",
    nameAlt: [
        "jaitun ka tel"
    ],
    hindiName: "जैतून का तेल",
    searchTerms: [
        "olive",
        "oil"
    ],
    category: "oil-fat",
    subcategory: "plant-fat",
    itemType: "base-food",
    state: "raw",
    region: "pan-indian",
    defaultServingGrams: 15,
    per100g: {
        calories: 884,
        protein: 0,
        carbs: 0,
        fat: 100,
        fiber: 0,
        sodium: 0,
        vitaminB12: 0,
        vitaminD: 0,
        iron: 0,
        calcium: 0
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
        "high-fat",
        "healthy-fats"
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
    confidence: "high"
}  ,
  {
    id: "butter-amul",
    name: "Butter (Salted, e.g. Amul)",
    nameAlt: [
        "makhan",
        "makkhan"
    ],
    hindiName: "मक्खन",
    searchTerms: [
        "butter",
        "amul",
        "makhan"
    ],
    category: "oil-fat",
    subcategory: "animal-fat",
    itemType: "base-food",
    state: "raw",
    region: "pan-indian",
    defaultServingGrams: 14,
    per100g: {
        calories: 717,
        protein: 0.9,
        carbs: 0.1,
        fat: 81.1,
        fiber: 0,
        sodium: 643,
        vitaminB12: 0.2,
        vitaminD: 60,
        iron: 0,
        calcium: 24
    },
    servings: [
        {
            id: "tbsp",
            label: "1 pat / slice",
            grams: 14
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
        "high-fat",
        "high-calorie"
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
    confidence: "high"
}  ,
  {
    id: "malai-cream",
    name: "Fresh Cream / Malai",
    nameAlt: [
        "amul cream"
    ],
    hindiName: "मलाई",
    searchTerms: [
        "cream",
        "malai",
        "fresh cream"
    ],
    category: "oil-fat",
    subcategory: "animal-fat",
    itemType: "base-food",
    state: "raw",
    region: "pan-indian",
    defaultServingGrams: 15,
    per100g: {
        calories: 345,
        protein: 2.1,
        carbs: 2.8,
        fat: 37,
        fiber: 0,
        sodium: 40,
        vitaminB12: 0.2,
        vitaminD: 10,
        iron: 0,
        calcium: 80
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
        "veg",
        "jain",
        "nonveg"
    ],
    tags: [
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
    gi: 0,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: "IFCT-2017",
    confidence: "high"
}  ,
  {
    id: "mayonnaise",
    name: "Mayonnaise (Veg)",
    nameAlt: [
        "mayo"
    ],
    hindiName: "मेयोनेज़",
    searchTerms: [
        "mayo",
        "mayonnaise",
        "dip"
    ],
    category: "oil-fat",
    subcategory: "condiment",
    itemType: "base-food",
    state: "raw",
    region: "pan-indian",
    defaultServingGrams: 15,
    per100g: {
        calories: 340,
        protein: 0.5,
        carbs: 12,
        fat: 32,
        fiber: 0,
        sodium: 600,
        vitaminB12: 0,
        vitaminD: 0,
        iron: 0,
        calcium: 10
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
        "veg",
        "jain",
        "nonveg"
    ],
    tags: [
        "high-fat",
        "processed"
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
    source: "FSSAI-label",
    confidence: "high"
}  ,
  {
    id: "peanut-butter",
    name: "Peanut Butter (Unsweetened)",
    nameAlt: [
        "pb"
    ],
    hindiName: "पीनट बटर",
    searchTerms: [
        "peanut butter",
        "pb",
        "pintola",
        "myfitness"
    ],
    category: "oil-fat",
    subcategory: "nut-butter",
    itemType: "base-food",
    state: "raw",
    region: "pan-indian",
    defaultServingGrams: 32,
    per100g: {
        calories: 598,
        protein: 25,
        carbs: 22,
        fat: 51,
        fiber: 8,
        sodium: 17,
        vitaminB12: 0,
        vitaminD: 0,
        iron: 2,
        calcium: 43
    },
    servings: [
        {
            id: "tbsp",
            label: "1 tbsp",
            grams: 16
        },
        {
            id: "custom",
            label: "Custom (g)",
            grams: 1
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
        "muscle-building",
        "high-protein",
        "high-fat",
        "healthy-fats"
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
    gi: 15,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: "USDA",
    confidence: "high"
}  ,
  {
    id: "almond-butter",
    name: "Almond Butter (Unsweetened)",
    nameAlt: [
        "badam butter"
    ],
    hindiName: "बादाम बटर",
    searchTerms: [
        "almond butter",
        "badam butter",
        "spread"
    ],
    category: "oil-fat",
    subcategory: "nut-butter",
    itemType: "base-food",
    state: "raw",
    region: "pan-indian",
    defaultServingGrams: 32,
    per100g: {
        calories: 614,
        protein: 21,
        carbs: 18,
        fat: 55,
        fiber: 10,
        sodium: 0,
        vitaminB12: 0,
        vitaminD: 0,
        iron: 3.5,
        calcium: 350
    },
    servings: [
        {
            id: "tbsp",
            label: "1 tbsp",
            grams: 16
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
        "healthy-fats",
        "high-protein"
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
    gi: 15,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: "USDA",
    confidence: "high"
}  ,
  {
    id: "green-chutney",
    name: "Green Chutney (Mint/Coriander)",
    nameAlt: [
        "pudina chutney",
        "hari chutney"
    ],
    hindiName: "हरी चटनी",
    searchTerms: [
        "green chutney",
        "pudina",
        "hari chutney",
        "mint"
    ],
    category: "condiment",
    subcategory: "chutney",
    itemType: "dish",
    state: "raw",
    region: "pan-indian",
    defaultServingGrams: 30,
    per100g: {
        calories: 45,
        protein: 2,
        carbs: 6,
        fat: 1.5,
        fiber: 2.5,
        sodium: 300,
        vitaminB12: 0,
        vitaminD: 0,
        iron: 3,
        calcium: 50
    },
    servings: [
        {
            id: "tbsp",
            label: "1 tbsp",
            grams: 15
        },
        {
            id: "katori",
            label: "1 katori (small)",
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
        "nonveg"
    ],
    tags: [
        "low-calorie"
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
    cookingOilNote: null,
    estimatedOilG: 0,
    source: "healthifyme",
    confidence: "medium",
    notes: "Almost always contains garlic and sometimes onion."
}  ,
  {
    id: "imli-chutney",
    name: "Tamarind Chutney (Meethi Imli)",
    nameAlt: [
        "meethi chutney"
    ],
    hindiName: "इमली की चटनी",
    searchTerms: [
        "tamarind",
        "imli",
        "meethi chutney",
        "sweet chutney"
    ],
    category: "condiment",
    subcategory: "chutney",
    itemType: "dish",
    state: "cooked",
    region: "pan-indian",
    defaultServingGrams: 30,
    per100g: {
        calories: 180,
        protein: 1,
        carbs: 43,
        fat: 0.5,
        fiber: 3,
        sodium: 250,
        vitaminB12: 0,
        vitaminD: 0,
        iron: 1.5,
        calcium: 30
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
    cookingOilNote: null,
    estimatedOilG: 0,
    source: "healthifyme",
    confidence: "medium",
    notes: "Very high sugar/jaggery content."
}  ,
  {
    id: "pickle-mango",
    name: "Mango Pickle (Aam ka Achar)",
    nameAlt: [
        "aam ka achar"
    ],
    hindiName: "आम का आचार",
    searchTerms: [
        "pickle",
        "achar",
        "mango"
    ],
    category: "condiment",
    subcategory: "pickle",
    itemType: "dish",
    state: "raw",
    region: "pan-indian",
    defaultServingGrams: 15,
    per100g: {
        calories: 250,
        protein: 1.5,
        carbs: 12,
        fat: 22,
        fiber: 3,
        sodium: 1200,
        vitaminB12: 0,
        vitaminD: 0,
        iron: 2,
        calcium: 40
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
        "high-fat",
        "high-sodium"
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
    cookingOilNote: "Contains significant mustard/sesame oil.",
    estimatedOilG: 10,
    source: "healthifyme",
    confidence: "medium"
}  ,
  {
    id: "pickle-lemon",
    name: "Lemon Pickle (Nimbu ka Achar)",
    nameAlt: [
        "nimbu ka achar"
    ],
    hindiName: "नींबू का आचार",
    searchTerms: [
        "pickle",
        "achar",
        "nimbu",
        "lemon"
    ],
    category: "condiment",
    subcategory: "pickle",
    itemType: "dish",
    state: "raw",
    region: "pan-indian",
    defaultServingGrams: 15,
    per100g: {
        calories: 150,
        protein: 1,
        carbs: 25,
        fat: 5,
        fiber: 4,
        sodium: 1400,
        vitaminB12: 0,
        vitaminD: 0,
        iron: 1.5,
        calcium: 30
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
        "high-sodium"
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
    estimatedOilG: 2,
    source: "healthifyme",
    confidence: "medium",
    notes: "Often oil-free or low-oil compared to mango pickle, but high in sugar/salt."
}  ,
  {
    id: "pickle-mixed",
    name: "Mixed Pickle (Panchranga)",
    nameAlt: [
        "mixed achar"
    ],
    hindiName: "मिक्स आचार",
    searchTerms: [
        "pickle",
        "achar",
        "mixed",
        "panchranga"
    ],
    category: "condiment",
    subcategory: "pickle",
    itemType: "dish",
    state: "raw",
    region: "pan-indian",
    defaultServingGrams: 15,
    per100g: {
        calories: 230,
        protein: 1.5,
        carbs: 14,
        fat: 19,
        fiber: 3.5,
        sodium: 1300,
        vitaminB12: 0,
        vitaminD: 0,
        iron: 2,
        calcium: 40
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
        "nonveg"
    ],
    tags: [
        "high-sodium",
        "high-fat"
    ],
    isProcessed: true,
    isFastingFood: false,
    fastingTypes: [],
    isGlutenFree: true,
    isRecipe: false,
    containsRootVeg: true,
    hasBeverageModifiers: false,
    supportedConsistencyTypes: [],
    consistencyMultipliers: {},
    gi: 0,
    cookingOilNote: "Contains significant oil.",
    estimatedOilG: 8,
    source: "healthifyme",
    confidence: "medium",
    notes: "Contains carrot and ginger."
}  ,
  {
    id: "raita-cucumber",
    name: "Cucumber Raita",
    nameAlt: [
        "kheera raita"
    ],
    hindiName: "खीरा रायता",
    searchTerms: [
        "raita",
        "cucumber",
        "kheera",
        "curd dip"
    ],
    category: "condiment",
    subcategory: "raita",
    itemType: "dish",
    state: "raw",
    region: "pan-indian",
    defaultServingGrams: 150,
    per100g: {
        calories: 45,
        protein: 2.5,
        carbs: 4.5,
        fat: 2,
        fiber: 0.5,
        sodium: 150,
        vitaminB12: 0.2,
        vitaminD: 0,
        iron: 0.2,
        calcium: 80
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
        "low-calorie",
        "cooling",
        "calcium-rich"
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
    gi: 25,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: "healthifyme",
    confidence: "high"
}  ,
  {
    id: "raita-boondi",
    name: "Boondi Raita",
    nameAlt: [],
    hindiName: "बूंदी रायता",
    searchTerms: [
        "raita",
        "boondi",
        "curd dip"
    ],
    category: "condiment",
    subcategory: "raita",
    itemType: "dish",
    state: "raw",
    region: "north",
    defaultServingGrams: 150,
    per100g: {
        calories: 90,
        protein: 3.5,
        carbs: 8,
        fat: 4.5,
        fiber: 0.5,
        sodium: 180,
        vitaminB12: 0.2,
        vitaminD: 0,
        iron: 0.5,
        calcium: 85
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
        "calcium-rich"
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
    gi: 40,
    cookingOilNote: "Boondi is deep dried before adding to curd.",
    estimatedOilG: 2,
    source: "healthifyme",
    confidence: "high"
}  ,
  {
    id: "papad-roasted",
    name: "Papad (Roasted)",
    nameAlt: [
        "pappadum"
    ],
    hindiName: "पापड़ (भुना हुआ)",
    searchTerms: [
        "papad",
        "roasted",
        "pappadum"
    ],
    category: "condiment",
    subcategory: "crisp",
    itemType: "dish",
    state: "roasted",
    region: "pan-indian",
    defaultServingGrams: 15,
    per100g: {
        calories: 370,
        protein: 25,
        carbs: 60,
        fat: 3,
        fiber: 5,
        sodium: 1500,
        vitaminB12: 0,
        vitaminD: 0,
        iron: 5,
        calcium: 80
    },
    servings: [
        {
            id: "piece",
            label: "1 medium papad",
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
        "low-calorie",
        "high-sodium"
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
    gi: 50,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: "USDA",
    confidence: "medium",
    notes: "Almost 55 calories per piece."
}  ,
  {
    id: "papad-fried",
    name: "Papad (Fried)",
    nameAlt: [
        "fried pappadum"
    ],
    hindiName: "पापड़ (तला हुआ)",
    searchTerms: [
        "papad",
        "fried",
        "pappadum"
    ],
    category: "condiment",
    subcategory: "crisp",
    itemType: "dish",
    state: "fried",
    region: "pan-indian",
    defaultServingGrams: 20,
    per100g: {
        calories: 510,
        protein: 20,
        carbs: 48,
        fat: 26,
        fiber: 4,
        sodium: 1200,
        vitaminB12: 0,
        vitaminD: 0,
        iron: 4,
        calcium: 65
    },
    servings: [
        {
            id: "piece",
            label: "1 medium papad (fried)",
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
    gi: 50,
    cookingOilNote: "Deep fried",
    estimatedOilG: 5,
    source: "USDA",
    confidence: "medium"
}  ,
  {
    id: "sugar-white",
    name: "Sugar (White / Table Sugar)",
    nameAlt: [
        "cheeni"
    ],
    hindiName: "चीनी",
    searchTerms: [
        "sugar",
        "cheeni",
        "shakar"
    ],
    category: "condiment",
    subcategory: "sweetener",
    itemType: "base-food",
    state: "raw",
    region: "pan-indian",
    defaultServingGrams: 5,
    per100g: {
        calories: 387,
        protein: 0,
        carbs: 100,
        fat: 0,
        fiber: 0,
        sodium: 1,
        vitaminB12: 0,
        vitaminD: 0,
        iron: 0,
        calcium: 1
    },
    servings: [
        {
            id: "tbsp",
            label: "1 tsp",
            grams: 5
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
        "high-sugar"
    ],
    isProcessed: true,
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
    gi: 65,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: "USDA",
    confidence: "high"
}  ,
  {
    id: "honey",
    name: "Honey",
    nameAlt: [
        "shehad"
    ],
    hindiName: "शहद",
    searchTerms: [
        "honey",
        "shehad",
        "sweetener"
    ],
    category: "condiment",
    subcategory: "sweetener",
    itemType: "base-food",
    state: "raw",
    region: "pan-indian",
    defaultServingGrams: 21,
    per100g: {
        calories: 304,
        protein: 0.3,
        carbs: 82.4,
        fat: 0,
        fiber: 0.2,
        sodium: 4,
        vitaminB12: 0,
        vitaminD: 0,
        iron: 0.4,
        calcium: 6
    },
    servings: [
        {
            id: "tbsp",
            label: "1 tbsp",
            grams: 21
        },
        {
            id: "tbsp",
            label: "1 tsp",
            grams: 7
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
        "high-sugar"
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
    gi: 58,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: "USDA",
    confidence: "high"
}  ,
  {
    id: "tomato-ketchup",
    name: "Tomato Ketchup",
    nameAlt: [
        "tomato sauce"
    ],
    hindiName: "टोमेटो केचप",
    searchTerms: [
        "ketchup",
        "sauce",
        "tomato"
    ],
    category: "condiment",
    subcategory: "sauce",
    itemType: "base-food",
    state: "raw",
    region: "pan-indian",
    defaultServingGrams: 15,
    per100g: {
        calories: 120,
        protein: 1,
        carbs: 30,
        fat: 0.1,
        fiber: 0.3,
        sodium: 900,
        vitaminB12: 0,
        vitaminD: 0,
        iron: 0.4,
        calcium: 15
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
        "high-sugar"
    ],
    isProcessed: true,
    isFastingFood: false,
    fastingTypes: [],
    isGlutenFree: true,
    isRecipe: false,
    containsRootVeg: true,
    hasBeverageModifiers: false,
    supportedConsistencyTypes: [],
    consistencyMultipliers: {},
    gi: 55,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: "USDA",
    confidence: "high",
    notes: "Almost always contains onion/garlic powder."
}  ,
  {
    id: "jaggery",
    name: "Jaggery (Gud)",
    nameAlt: [
        "gud",
        "gur"
    ],
    hindiName: "गुड़",
    searchTerms: [
        "jaggery",
        "gud",
        "gur",
        "sweetener"
    ],
    category: "condiment",
    subcategory: "sweetener",
    itemType: "base-food",
    state: "raw",
    region: "pan-indian",
    defaultServingGrams: 10,
    per100g: {
        calories: 383,
        protein: 0.4,
        carbs: 98,
        fat: 0.1,
        fiber: 0,
        sodium: 30,
        vitaminB12: 0,
        vitaminD: 0,
        iron: 11,
        calcium: 80
    },
    servings: [
        {
            id: "piece",
            label: "1 small piece (pingpong ball size)",
            grams: 25
        },
        {
            id: "tbsp",
            label: "1 tsp (crushed)",
            grams: 7
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
        "high-sugar"
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
    gi: 65,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: "IFCT-2017",
    confidence: "high",
    notes: "Good iron source compared to white sugar."
}  ,
  {
    id: "sendha-namak",
    name: "Sendha Namak (Rock Salt)",
    nameAlt: [
        "rock salt",
        "pink salt",
        "vrat ka namak"
    ],
    hindiName: "सेंधा नमक",
    searchTerms: [
        "sendha namak",
        "rock salt",
        "salt",
        "pink salt"
    ],
    category: "condiment",
    subcategory: "seasoning",
    itemType: "base-food",
    state: "raw",
    region: "pan-indian",
    defaultServingGrams: 5,
    per100g: {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        fiber: 0,
        sodium: 38000,
        vitaminB12: 0,
        vitaminD: 0,
        iron: 0,
        calcium: 0
    },
    servings: [
        {
            id: "tbsp",
            label: "1 tsp",
            grams: 5
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
        "very-high-sodium"
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
    source: "USDA",
    confidence: "high"
}  ,
  {
    id: "whey-protein",
    name: "Whey Protein Concentrate (80%)",
    nameAlt: [
        "whey powder",
        "protein powder",
        "mb whey"
    ],
    hindiName: "व्हे प्रोटीन",
    searchTerms: [
        "whey",
        "protein powder",
        "mb",
        "muscleblaze",
        "on"
    ],
    category: "supplement",
    subcategory: "powder",
    itemType: "supplement",
    state: "raw",
    region: "pan-indian",
    defaultServingGrams: 33,
    per100g: {
        calories: 400,
        protein: 75,
        carbs: 8,
        fat: 6,
        fiber: 0,
        sodium: 200,
        vitaminB12: 0,
        vitaminD: 0,
        iron: 1,
        calcium: 400
    },
    servings: [
        {
            id: "scoop",
            label: "1 scoop (~33g)",
            grams: 33
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
        "muscle-building",
        "very-high-protein",
        "post-workout"
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
    gi: 15,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: "FSSAI-label",
    confidence: "high"
}  ,
  {
    id: "whey-protein-isolate",
    name: "Whey Protein Isolate (90%)",
    nameAlt: [
        "whey isolate"
    ],
    hindiName: "व्हे प्रोटीन आइसोलेट",
    searchTerms: [
        "whey isolate",
        "protein powder",
        "isolate"
    ],
    category: "supplement",
    subcategory: "powder",
    itemType: "supplement",
    state: "raw",
    region: "pan-indian",
    defaultServingGrams: 30,
    per100g: {
        calories: 370,
        protein: 90,
        carbs: 2,
        fat: 1,
        fiber: 0,
        sodium: 150,
        vitaminB12: 0,
        vitaminD: 0,
        iron: 0.5,
        calcium: 300
    },
    servings: [
        {
            id: "scoop",
            label: "1 scoop (~30g)",
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
        "nonveg"
    ],
    tags: [
        "muscle-building",
        "very-high-protein",
        "cutting",
        "post-workout"
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
    gi: 10,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: "FSSAI-label",
    confidence: "high"
}  ,
  {
    id: "casein-protein",
    name: "Casein Protein Powder",
    nameAlt: [
        "micellar casein"
    ],
    hindiName: "कैसिइन प्रोटीन",
    searchTerms: [
        "casein",
        "protein powder",
        "night protein"
    ],
    category: "supplement",
    subcategory: "powder",
    itemType: "supplement",
    state: "raw",
    region: "pan-indian",
    defaultServingGrams: 30,
    per100g: {
        calories: 360,
        protein: 80,
        carbs: 5,
        fat: 1.5,
        fiber: 0,
        sodium: 220,
        vitaminB12: 0,
        vitaminD: 0,
        iron: 1,
        calcium: 500
    },
    servings: [
        {
            id: "scoop",
            label: "1 scoop (~30g)",
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
        "nonveg"
    ],
    tags: [
        "muscle-building",
        "very-high-protein",
        "before-bed"
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
    gi: 15,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: "FSSAI-label",
    confidence: "high"
}  ,
  {
    id: "soy-protein-isolate",
    name: "Soy Protein Isolate Powder",
    nameAlt: [
        "vegan protein soy"
    ],
    hindiName: "सोया प्रोटीन",
    searchTerms: [
        "soy protein",
        "vegan protein",
        "isolate",
        "powder"
    ],
    category: "supplement",
    subcategory: "powder",
    itemType: "supplement",
    state: "raw",
    region: "pan-indian",
    defaultServingGrams: 30,
    per100g: {
        calories: 380,
        protein: 88,
        carbs: 2,
        fat: 1.5,
        fiber: 1,
        sodium: 800,
        vitaminB12: 0,
        vitaminD: 0,
        iron: 14,
        calcium: 150
    },
    servings: [
        {
            id: "scoop",
            label: "1 scoop (~30g)",
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
        "muscle-building",
        "very-high-protein",
        "post-workout"
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
    gi: 15,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: "FSSAI-label",
    confidence: "medium"
}  ,
  {
    id: "mass-gainer",
    name: "Mass Gainer Powder",
    nameAlt: [
        "weight gainer"
    ],
    hindiName: "मास गेनर",
    searchTerms: [
        "mass gainer",
        "weight gainer",
        "powder"
    ],
    category: "supplement",
    subcategory: "powder",
    itemType: "supplement",
    state: "raw",
    region: "pan-indian",
    defaultServingGrams: 100,
    per100g: {
        calories: 380,
        protein: 15,
        carbs: 75,
        fat: 2.5,
        fiber: 1,
        sodium: 150,
        vitaminB12: 0,
        vitaminD: 0,
        iron: 2,
        calcium: 100
    },
    servings: [
        {
            id: "scoop",
            label: "1 scoop (~100g)",
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
        "nonveg"
    ],
    tags: [
        "bulking",
        "high-carb",
        "high-calorie"
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
    gi: 80,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: "FSSAI-label",
    confidence: "high"
}  ,
  {
    id: "creatine-monohydrate",
    name: "Creatine Monohydrate",
    nameAlt: [
        "creatine powder"
    ],
    hindiName: "क्रिएटिन",
    searchTerms: [
        "creatine",
        "monohydrate",
        "pre workout"
    ],
    category: "supplement",
    subcategory: "powder",
    itemType: "supplement",
    state: "raw",
    region: "pan-indian",
    defaultServingGrams: 5,
    per100g: {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        fiber: 0,
        sodium: 0,
        vitaminB12: 0,
        vitaminD: 0,
        iron: 0,
        calcium: 0
    },
    servings: [
        {
            id: "tbsp",
            label: "1 scoop (5g)",
            grams: 5
        },
        {
            id: "custom",
            label: "Custom (g)",
            grams: 1
        }
    ],
    dietTypes: [
        "vegan",
        "veg",
        "jain",
        "nonveg"
    ],
    tags: [
        "muscle-building",
        "pre-workout"
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
    gi: 0,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: "USDA",
    confidence: "high"
}  ,
  {
    id: "bcaa-powder",
    name: "BCAA Powder",
    nameAlt: [
        "intra workout",
        "eaas"
    ],
    hindiName: "बीसीएए",
    searchTerms: [
        "bcaa",
        "amino",
        "eaa",
        "intra workout"
    ],
    category: "supplement",
    subcategory: "powder",
    itemType: "supplement",
    state: "raw",
    region: "pan-indian",
    defaultServingGrams: 10,
    per100g: {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        fiber: 0,
        sodium: 10,
        vitaminB12: 0,
        vitaminD: 0,
        iron: 0,
        calcium: 0
    },
    servings: [
        {
            id: "tbsp",
            label: "1 scoop (10g)",
            grams: 10
        }
    ],
    dietTypes: [
        "vegan",
        "veg",
        "jain",
        "nonveg"
    ],
    tags: [
        "muscle-building"
    ],
    isProcessed: true,
    isFastingFood: true,
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
    source: " USDA",
    confidence: "medium",
    notes: "Almost 0 calories, pure amino acids."
}  ,
  {
    id: "soya-granules",
    name: "Soya Granules (Dry/Raw)",
    nameAlt: [
        "soya keema dry",
        "minced soya"
    ],
    hindiName: "सोया ग्रैन्यूल्स",
    searchTerms: [
        "soya",
        "granules",
        "keema",
        "mince"
    ],
    category: "sprout-soy",
    subcategory: "soy",
    itemType: "supplement",
    state: "raw",
    region: "pan-indian",
    defaultServingGrams: 50,
    per100g: {
        calories: 345,
        protein: 52,
        carbs: 33,
        fat: 0.5,
        fiber: 13,
        sodium: 15,
        vitaminB12: 0,
        vitaminD: 0,
        iron: 15,
        calcium: 350
    },
    servings: [
        {
            id: "katori",
            label: "1 katori (dry)",
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
        "muscle-building",
        "very-high-protein",
        "budget-friendly"
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
    gi: 15,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: "FSSAI-label",
    confidence: "high"
}  ,
  {
    id: "tofu-firm",
    name: "Tofu (Firm)",
    nameAlt: [
        "soya paneer"
    ],
    hindiName: "टोफू",
    searchTerms: [
        "tofu",
        "soya paneer",
        "firm tofu"
    ],
    category: "sprout-soy",
    subcategory: "soy",
    itemType: "base-food",
    state: "raw",
    region: "pan-indian",
    defaultServingGrams: 100,
    per100g: {
        calories: 144,
        protein: 17,
        carbs: 3,
        fat: 8,
        fiber: 2,
        sodium: 15,
        vitaminB12: 0,
        vitaminD: 0,
        iron: 2.7,
        calcium: 683
    },
    servings: [
        {
            id: "g100",
            label: "100g",
            grams: 100
        },
        {
            id: "piece",
            label: "half block (~150g)",
            grams: 150
        }
    ],
    dietTypes: [
        "vegan",
        "veg",
        "jain",
        "nonveg"
    ],
    tags: [
        "high-protein",
        "muscle-building"
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
    gi: 15,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: "USDA",
    confidence: "high",
    notes: "Calcium-set tofu is extremely high in calcium."
}  ,
  {
    id: "tofu-silken",
    name: "Tofu (Silken / Soft)",
    nameAlt: [
        "soft tofu"
    ],
    hindiName: "मुलायम टोफू",
    searchTerms: [
        "tofu",
        "silken",
        "soft"
    ],
    category: "sprout-soy",
    subcategory: "soy",
    itemType: "base-food",
    state: "raw",
    region: "pan-indian",
    defaultServingGrams: 100,
    per100g: {
        calories: 55,
        protein: 4.8,
        carbs: 2.9,
        fat: 2.7,
        fiber: 0.1,
        sodium: 5,
        vitaminB12: 0,
        vitaminD: 0,
        iron: 1,
        calcium: 110
    },
    servings: [
        {
            id: "g100",
            label: "100g",
            grams: 100
        },
        {
            id: "piece",
            label: "half block (~150g)",
            grams: 150
        }
    ],
    dietTypes: [
        "vegan",
        "veg",
        "jain",
        "nonveg"
    ],
    tags: [
        "low-calorie",
        "high-protein"
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
    gi: 15,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: "USDA",
    confidence: "high"
}  ,
  {
    id: "soy-milk",
    name: "Soy Milk (Unsweetened)",
    nameAlt: [
        "soya milk"
    ],
    hindiName: "सोया दूध",
    searchTerms: [
        "soy milk",
        "soya milk",
        "vegan milk"
    ],
    category: "sprout-soy",
    subcategory: "soy-milk",
    itemType: "drink",
    state: "raw",
    region: "pan-indian",
    defaultServingGrams: 200,
    per100g: {
        calories: 33,
        protein: 3.3,
        carbs: 1.8,
        fat: 1.8,
        fiber: 0.6,
        sodium: 45,
        vitaminB12: 1.2,
        vitaminD: 45,
        iron: 0.4,
        calcium: 120
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
        "high-protein",
        "low-calorie"
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
    gi: 30,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: "USDA",
    confidence: "high",
    notes: "Almost always fortified with B12, D3 and Calcium in India (e.g. Sofit, So Good)."
}  ,
  {
    id: "protein-bar",
    name: "Protein Bar (e.g. RiteBite/Yoga Bar)",
    nameAlt: [
        "max protein bar"
    ],
    hindiName: "प्रोटीन बार",
    searchTerms: [
        "protein bar",
        "ritebite",
        "yoga bar",
        "nutrition bar"
    ],
    category: "supplement",
    subcategory: "bar",
    itemType: "snack",
    state: "raw",
    region: "pan-indian",
    defaultServingGrams: 50,
    per100g: {
        calories: 380,
        protein: 30,
        carbs: 45,
        fat: 10,
        fiber: 15,
        sodium: 200,
        vitaminB12: 1,
        vitaminD: 100,
        iron: 5,
        calcium: 150
    },
    servings: [
        {
            id: "piece",
            label: "1 Bar (50g)",
            grams: 50
        },
        {
            id: "piece",
            label: "Large Bar (70g)",
            grams: 70
        }
    ],
    dietTypes: [
        "veg",
        "nonveg"
    ],
    tags: [
        "snack",
        "high-protein",
        "processed"
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
    gi: 40,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: "FSSAI-label",
    confidence: "medium"
}  ,
  {
    id: "soya-chaap-raw",
    name: "Soya Chaap (Raw/Stick)",
    nameAlt: [
        "soya champ",
        "mock meat"
    ],
    hindiName: "सोया चाप",
    searchTerms: [
        "soya",
        "chaap",
        "champ",
        "stick"
    ],
    category: "sprout-soy",
    subcategory: "soy",
    itemType: "base-food",
    state: "raw",
    region: "north",
    defaultServingGrams: 100,
    per100g: {
        calories: 150,
        protein: 18,
        carbs: 12,
        fat: 3.5,
        fiber: 3,
        sodium: 100,
        vitaminB12: 0,
        vitaminD: 0,
        iron: 3,
        calcium: 60
    },
    servings: [
        {
            id: "piece",
            label: "1 stick (~80g)",
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
        "muscle-building",
        "high-protein"
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
    gi: 30,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: "healthifyme",
    confidence: "medium",
    notes: "Often contains ~30-40% maida (refined wheat flour) mixed with soy. Not gluten-free."
}  ,
  {
    id: "peanut-butter-powder",
    name: "Powdered Peanut Butter",
    nameAlt: [
        "pb fit",
        "defatted peanut"
    ],
    hindiName: "मूंगफली का पाउडर (वसा रहित)",
    searchTerms: [
        "peanut butter",
        "powder",
        "pb fit"
    ],
    category: "supplement",
    subcategory: "powder",
    itemType: "supplement",
    state: "raw",
    region: "pan-indian",
    defaultServingGrams: 16,
    per100g: {
        calories: 375,
        protein: 50,
        carbs: 31,
        fat: 10,
        fiber: 15,
        sodium: 150,
        vitaminB12: 0,
        vitaminD: 0,
        iron: 4.5,
        calcium: 60
    },
    servings: [
        {
            id: "tbsp",
            label: "2 tbsp (16g)",
            grams: 16
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
        "muscle-building",
        "high-protein",
        "low-fat"
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
    gi: 15,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: "USDA",
    confidence: "high"
}  ,
  {
    id: "vegan-pea-protein",
    name: "Vegan Protein Powder (Pea/Brown Rice)",
    nameAlt: [
        "plant protein powder"
    ],
    hindiName: "वीगन प्रोटीन",
    searchTerms: [
        "vegan",
        "protein",
        "pea protein",
        "plant protein"
    ],
    category: "supplement",
    subcategory: "powder",
    itemType: "supplement",
    state: "raw",
    region: "pan-indian",
    defaultServingGrams: 35,
    per100g: {
        calories: 380,
        protein: 72,
        carbs: 12,
        fat: 6,
        fiber: 4,
        sodium: 600,
        vitaminB12: 3,
        vitaminD: 0,
        iron: 25,
        calcium: 100
    },
    servings: [
        {
            id: "scoop",
            label: "1 scoop (~35g)",
            grams: 35
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
        "muscle-building",
        "very-high-protein"
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
    gi: 15,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: "FSSAI-label",
    confidence: "medium",
    notes: "Iron content is very high from peas."
}
  ,
  {
    id: "maggi-masala",
    name: "Maggi Masala Noodles",
    nameAlt: [
        "maggi",
        "2 minute noodles"
    ],
    hindiName: "मैगी",
    searchTerms: [
        "maggi",
        "noodles",
        "masala",
        "packaged"
    ],
    category: "packaged-food",
    subcategory: "noodles",
    itemType: "dish",
    state: "cooked",
    region: "pan-indian",
    defaultServingGrams: 70,
    per100g: {
        calories: 427,
        protein: 8,
        carbs: 63.5,
        fat: 15.7,
        fiber: 2,
        sodium: 1100,
        vitaminB12: 0,
        vitaminD: 0,
        iron: 1.5,
        calcium: 15
    },
    servings: [
        {
            id: "packet",
            label: "1 pack (70g)",
            grams: 70
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
        "high-carb",
        "processed",
        "high-sodium"
    ],
    isProcessed: true,
    isFastingFood: false,
    fastingTypes: [],
    isGlutenFree: false,
    isRecipe: false,
    containsRootVeg: true,
    hasBeverageModifiers: false,
    supportedConsistencyTypes: [],
    consistencyMultipliers: {},
    gi: 70,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: "FSSAI-label",
    confidence: "high"
}  ,
  {
    id: "yippee-noodles",
    name: "Yippee Magic Masala Noodles",
    nameAlt: [
        "yippee"
    ],
    hindiName: "यिप्पी नूडल्स",
    searchTerms: [
        "yippee",
        "noodles",
        "sunfeast",
        "packaged"
    ],
    category: "packaged-food",
    subcategory: "noodles",
    itemType: "dish",
    state: "cooked",
    region: "pan-indian",
    defaultServingGrams: 60,
    per100g: {
        calories: 450,
        protein: 9,
        carbs: 61,
        fat: 17.5,
        fiber: 2.5,
        sodium: 1150,
        vitaminB12: 0,
        vitaminD: 0,
        iron: 1,
        calcium: 20
    },
    servings: [
        {
            id: "packet",
            label: "1 pack (60g)",
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
        "snack",
        "high-carb",
        "processed",
        "high-sodium"
    ],
    isProcessed: true,
    isFastingFood: false,
    fastingTypes: [],
    isGlutenFree: false,
    isRecipe: false,
    containsRootVeg: true,
    hasBeverageModifiers: false,
    supportedConsistencyTypes: [],
    consistencyMultipliers: {},
    gi: 70,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: "FSSAI-label",
    confidence: "high"
}  ,
  {
    id: "kurkure-masala",
    name: "Kurkure Masala Munch",
    nameAlt: [
        "kurkure"
    ],
    hindiName: "कुरकुरे",
    searchTerms: [
        "kurkure",
        "chips",
        "masala munch",
        "snack"
    ],
    category: "packaged-food",
    subcategory: "chips",
    itemType: "snack",
    state: "fried",
    region: "pan-indian",
    defaultServingGrams: 30,
    per100g: {
        calories: 554,
        protein: 5.6,
        carbs: 56.4,
        fat: 34,
        fiber: 2,
        sodium: 790,
        vitaminB12: 0,
        vitaminD: 0,
        iron: 1,
        calcium: 10
    },
    servings: [
        {
            id: "packet",
            label: "1 small pack (~30g)",
            grams: 30
        },
        {
            id: "packet-lg",
            label: "1 large pack (~90g)",
            grams: 90
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
        "high-fat",
        "processed",
        "high-sodium"
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
    gi: 75,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: "FSSAI-label",
    confidence: "high"
}  ,
  {
    id: "lays-salted",
    name: "Lay's Classic Salted",
    nameAlt: [
        "lays yellow"
    ],
    hindiName: "लेज़ (नमक)",
    searchTerms: [
        "lays",
        "classic salted",
        "chips",
        "potato chip"
    ],
    category: "packaged-food",
    subcategory: "chips",
    itemType: "snack",
    state: "fried",
    region: "pan-indian",
    defaultServingGrams: 30,
    per100g: {
        calories: 544,
        protein: 6.8,
        carbs: 51.4,
        fat: 34.6,
        fiber: 4,
        sodium: 550,
        vitaminB12: 0,
        vitaminD: 0,
        iron: 1.5,
        calcium: 15
    },
    servings: [
        {
            id: "packet",
            label: "1 small pack (~30g)",
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
        "nonveg"
    ],
    tags: [
        "snack",
        "high-fat",
        "processed",
        "high-sodium"
    ],
    isProcessed: true,
    isFastingFood: false,
    fastingTypes: [],
    isGlutenFree: true,
    isRecipe: false,
    containsRootVeg: true,
    hasBeverageModifiers: false,
    supportedConsistencyTypes: [],
    consistencyMultipliers: {},
    gi: 80,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: "FSSAI-label",
    confidence: "high"
}  ,
  {
    id: "lays-magic-masala",
    name: "Lay's India's Magic Masala",
    nameAlt: [
        "lays blue"
    ],
    hindiName: "लेज़ ম্যাजिक मसाला",
    searchTerms: [
        "lays",
        "magic masala",
        "blue lays",
        "chips"
    ],
    category: "packaged-food",
    subcategory: "chips",
    itemType: "snack",
    state: "fried",
    region: "pan-indian",
    defaultServingGrams: 30,
    per100g: {
        calories: 540,
        protein: 7,
        carbs: 51,
        fat: 34,
        fiber: 4,
        sodium: 700,
        vitaminB12: 0,
        vitaminD: 0,
        iron: 1.5,
        calcium: 20
    },
    servings: [
        {
            id: "packet",
            label: "1 small pack (~30g)",
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
        "nonveg"
    ],
    tags: [
        "snack",
        "high-fat",
        "processed",
        "high-sodium"
    ],
    isProcessed: true,
    isFastingFood: false,
    fastingTypes: [],
    isGlutenFree: true,
    isRecipe: false,
    containsRootVeg: true,
    hasBeverageModifiers: false,
    supportedConsistencyTypes: [],
    consistencyMultipliers: {},
    gi: 80,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: "FSSAI-label",
    confidence: "high"
}  ,
  {
    id: "bingo-mad-angles",
    name: "Bingo Mad Angles",
    nameAlt: [
        "bingo chips"
    ],
    hindiName: "बिंगो",
    searchTerms: [
        "bingo",
        "mad angles",
        "chips"
    ],
    category: "packaged-food",
    subcategory: "chips",
    itemType: "snack",
    state: "fried",
    region: "pan-indian",
    defaultServingGrams: 40,
    per100g: {
        calories: 535,
        protein: 5.5,
        carbs: 56,
        fat: 32,
        fiber: 3,
        sodium: 800,
        vitaminB12: 0,
        vitaminD: 0,
        iron: 1,
        calcium: 15
    },
    servings: [
        {
            id: "packet",
            label: "1 pack (~40g)",
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
        "nonveg"
    ],
    tags: [
        "snack",
        "high-fat",
        "processed"
    ],
    isProcessed: true,
    isFastingFood: false,
    fastingTypes: [],
    isGlutenFree: false,
    isRecipe: false,
    containsRootVeg: true,
    hasBeverageModifiers: false,
    supportedConsistencyTypes: [],
    consistencyMultipliers: {},
    gi: 75,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: "FSSAI-label",
    confidence: "high"
}  ,
  {
    id: "haldiram-aloo-bhujia",
    name: "Haldiram Aloo Bhujia",
    nameAlt: [
        "aloo bhujia"
    ],
    hindiName: "आलू भुजिया",
    searchTerms: [
        "haldiram",
        "aloo bhujia",
        "namkeen"
    ],
    category: "packaged-food",
    subcategory: "namkeen",
    itemType: "snack",
    state: "fried",
    region: "pan-indian",
    defaultServingGrams: 35,
    per100g: {
        calories: 580,
        protein: 10,
        carbs: 42,
        fat: 42,
        fiber: 2,
        sodium: 850,
        vitaminB12: 0,
        vitaminD: 0,
        iron: 1.5,
        calcium: 25
    },
    servings: [
        {
            id: "katori",
            label: "1 katori",
            grams: 35
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
        "very-high-fat",
        "processed",
        "high-sodium"
    ],
    isProcessed: true,
    isFastingFood: false,
    fastingTypes: [],
    isGlutenFree: true,
    isRecipe: false,
    containsRootVeg: true,
    hasBeverageModifiers: false,
    supportedConsistencyTypes: [],
    consistencyMultipliers: {},
    gi: 65,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: "FSSAI-label",
    confidence: "high"
}  ,
  {
    id: "haldiram-moong-dal",
    name: "Haldiram Moong Dal (Fried)",
    nameAlt: [
        "fried moong dal snack"
    ],
    hindiName: "हल्दीराम मूंग दाल",
    searchTerms: [
        "haldiram",
        "moong dal",
        "namkeen"
    ],
    category: "packaged-food",
    subcategory: "namkeen",
    itemType: "snack",
    state: "fried",
    region: "pan-indian",
    defaultServingGrams: 35,
    per100g: {
        calories: 460,
        protein: 22,
        carbs: 45,
        fat: 21,
        fiber: 5,
        sodium: 600,
        vitaminB12: 0,
        vitaminD: 0,
        iron: 3,
        calcium: 40
    },
    servings: [
        {
            id: "katori",
            label: "1 katori",
            grams: 35
        },
        {
            id: "packet",
            label: "1 small pack",
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
        "snack",
        "high-fat",
        "high-protein",
        "processed"
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
    gi: 45,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: "FSSAI-label",
    confidence: "high"
}  ,
  {
    id: "parleg-biscuit",
    name: "Parle-G Biscuit",
    nameAlt: [
        "parle g",
        "glucose biscuit"
    ],
    hindiName: "पार्ले जी",
    searchTerms: [
        "parle",
        "parle-g",
        "biscuit",
        "glucose"
    ],
    category: "packaged-food",
    subcategory: "biscuit",
    itemType: "snack",
    state: "baked",
    region: "pan-indian",
    defaultServingGrams: 20,
    per100g: {
        calories: 455,
        protein: 6.5,
        carbs: 74,
        fat: 14.5,
        fiber: 1,
        sodium: 300,
        vitaminB12: 0,
        vitaminD: 0,
        iron: 1.5,
        calcium: 15
    },
    servings: [
        {
            id: "piece",
            label: "4 biscuits",
            grams: 20
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
        "processed"
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
    gi: 75,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: "FSSAI-label",
    confidence: "high"
}  ,
  {
    id: "marie-gold-biscuit",
    name: "Britannia Marie Gold Biscuit",
    nameAlt: [
        "marie biscuit"
    ],
    hindiName: "मैरी गोल्ड बिस्कुट",
    searchTerms: [
        "marie",
        "marie gold",
        "britannia",
        "biscuit"
    ],
    category: "packaged-food",
    subcategory: "biscuit",
    itemType: "snack",
    state: "baked",
    region: "pan-indian",
    defaultServingGrams: 22,
    per100g: {
        calories: 440,
        protein: 8,
        carbs: 75,
        fat: 12,
        fiber: 3,
        sodium: 350,
        vitaminB12: 0,
        vitaminD: 0,
        iron: 1,
        calcium: 10
    },
    servings: [
        {
            id: "piece",
            label: "5 biscuits",
            grams: 22
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
        "processed"
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
    gi: 65,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: "FSSAI-label",
    confidence: "high"
}  ,
  {
    id: "bourbon-biscuit",
    name: "Bourbon Biscuit (Chocolate Cream)",
    nameAlt: [
        "britannia bourbon"
    ],
    hindiName: "बर्बन बिस्कुट",
    searchTerms: [
        "bourbon",
        "biscuit",
        "chocolate biscuit"
    ],
    category: "packaged-food",
    subcategory: "biscuit",
    itemType: "snack",
    state: "baked",
    region: "pan-indian",
    defaultServingGrams: 28,
    per100g: {
        calories: 490,
        protein: 5.5,
        carbs: 70,
        fat: 21,
        fiber: 2,
        sodium: 300,
        vitaminB12: 0,
        vitaminD: 0,
        iron: 1.5,
        calcium: 15
    },
    servings: [
        {
            id: "piece",
            label: "2 biscuits",
            grams: 28
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
        "high-fat",
        "processed"
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
    gi: 70,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: "FSSAI-label",
    confidence: "high"
}  ,
  {
    id: "good-day-cashew",
    name: "Good Day Cashew Biscuit",
    nameAlt: [
        "britannia good day"
    ],
    hindiName: "गुड डे बिस्कुट",
    searchTerms: [
        "good day",
        "britannia",
        "kaju biscuit"
    ],
    category: "packaged-food",
    subcategory: "biscuit",
    itemType: "snack",
    state: "baked",
    region: "pan-indian",
    defaultServingGrams: 25,
    per100g: {
        calories: 512,
        protein: 7,
        carbs: 64,
        fat: 25,
        fiber: 1.5,
        sodium: 230,
        vitaminB12: 0,
        vitaminD: 0,
        iron: 1,
        calcium: 15
    },
    servings: [
        {
            id: "piece",
            label: "3 biscuits",
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
        "high-fat",
        "processed"
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
    gi: 70,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: "FSSAI-label",
    confidence: "high"
}  ,
  {
    id: "oreo-biscuit",
    name: "Oreo Biscuit (Original)",
    nameAlt: [
        "cadbury oreo"
    ],
    hindiName: "ओरियो बिस्कुट",
    searchTerms: [
        "oreo",
        "biscuit",
        "chocolate cream"
    ],
    category: "packaged-food",
    subcategory: "biscuit",
    itemType: "snack",
    state: "baked",
    region: "pan-indian",
    defaultServingGrams: 28.5,
    per100g: {
        calories: 480,
        protein: 5,
        carbs: 68,
        fat: 20,
        fiber: 3,
        sodium: 400,
        vitaminB12: 0,
        vitaminD: 0,
        iron: 2,
        calcium: 15
    },
    servings: [
        {
            id: "piece",
            label: "3 biscuits",
            grams: 28.5
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
        "processed"
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
    gi: 70,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: "FSSAI-label",
    confidence: "high"
}  ,
  {
    id: "nutrichoice-digestive",
    name: "NutriChoice Digestive Biscuit",
    nameAlt: [
        "digestive biscuit"
    ],
    hindiName: "डाइजेस्टिव बिस्कुट",
    searchTerms: [
        "digestive",
        "nutrichoice",
        "britannia",
        "biscuit"
    ],
    category: "packaged-food",
    subcategory: "biscuit",
    itemType: "snack",
    state: "baked",
    region: "pan-indian",
    defaultServingGrams: 30,
    per100g: {
        calories: 470,
        protein: 7,
        carbs: 65,
        fat: 20,
        fiber: 6,
        sodium: 350,
        vitaminB12: 0,
        vitaminD: 0,
        iron: 1.5,
        calcium: 20
    },
    servings: [
        {
            id: "piece",
            label: "3 biscuits",
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
        "processed"
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
    gi: 60,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: "FSSAI-label",
    confidence: "high"
}  ,
  {
    id: "kelloggs-corn-flakes",
    name: "Kellogg's Corn Flakes",
    nameAlt: [
        "cornflakes"
    ],
    hindiName: "कॉर्नफ्लेक्स",
    searchTerms: [
        "corn flakes",
        "kelloggs",
        "cereal"
    ],
    category: "packaged-food",
    subcategory: "cereal",
    itemType: "base-food",
    state: "raw",
    region: "pan-indian",
    defaultServingGrams: 30,
    per100g: {
        calories: 380,
        protein: 7,
        carbs: 88,
        fat: 1,
        fiber: 2,
        sodium: 650,
        vitaminB12: 1,
        vitaminD: 0,
        iron: 15,
        calcium: 15
    },
    servings: [
        {
            id: "katori",
            label: "1 katori (30g)",
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
        "breakfast",
        "high-carb",
        "processed"
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
    gi: 81,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: "FSSAI-label",
    confidence: "high"
}  ,
  {
    id: "kelloggs-chocos",
    name: "Kellogg's Chocos",
    nameAlt: [
        "chocos"
    ],
    hindiName: "चोकोस",
    searchTerms: [
        "chocos",
        "kelloggs",
        "chocolate cereal"
    ],
    category: "packaged-food",
    subcategory: "cereal",
    itemType: "base-food",
    state: "raw",
    region: "pan-indian",
    defaultServingGrams: 30,
    per100g: {
        calories: 390,
        protein: 9,
        carbs: 82,
        fat: 3,
        fiber: 5,
        sodium: 350,
        vitaminB12: 1,
        vitaminD: 0,
        iron: 10,
        calcium: 150
    },
    servings: [
        {
            id: "katori",
            label: "1 katori (30g)",
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
        "breakfast",
        "high-sugar",
        "processed"
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
    gi: 77,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: "FSSAI-label",
    confidence: "high"
}  ,
  {
    id: "oats-masala-saffola",
    name: "Saffola Masala Oats",
    nameAlt: [
        "masala oats packet"
    ],
    hindiName: "मसाला ओट्स",
    searchTerms: [
        "saffola",
        "masala oats",
        "oats"
    ],
    category: "packaged-food",
    subcategory: "oats",
    itemType: "dish",
    state: "raw",
    region: "pan-indian",
    defaultServingGrams: 39,
    per100g: {
        calories: 390,
        protein: 10.5,
        carbs: 68,
        fat: 8.5,
        fiber: 7,
        sodium: 1200,
        vitaminB12: 0,
        vitaminD: 0,
        iron: 3,
        calcium: 30
    },
    servings: [
        {
            id: "packet",
            label: "1 pack (~39g)",
            grams: 39
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
        "high-sodium",
        "processed"
    ],
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
    estimatedOilG: 0,
    source: "FSSAI-label",
    confidence: "high"
}  ,
  {
    id: "maggi-pazzta",
    name: "Maggi Pazzta (Cheese Macaroni)",
    nameAlt: [
        "maggi pasta"
    ],
    hindiName: "मैगी पास्ता",
    searchTerms: [
        "maggi",
        "pasta",
        "pazzta",
        "macaroni"
    ],
    category: "packaged-food",
    subcategory: "pasta",
    itemType: "dish",
    state: "raw",
    region: "pan-indian",
    defaultServingGrams: 70,
    per100g: {
        calories: 400,
        protein: 12,
        carbs: 70,
        fat: 8,
        fiber: 2,
        sodium: 1100,
        vitaminB12: 0,
        vitaminD: 0,
        iron: 1,
        calcium: 100
    },
    servings: [
        {
            id: "packet",
            label: "1 pack (70g)",
            grams: 70
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
        "processed",
        "high-sodium"
    ],
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
    source: "FSSAI-label",
    confidence: "high"
}  ,
  {
    id: "popcorn-act2-butter",
    name: "Act II Butter Popcorn",
    nameAlt: [
        "act 2 popcorn",
        "microwave popcorn"
    ],
    hindiName: "पॉपकॉर्न (बटर)",
    searchTerms: [
        "popcorn",
        "act 2",
        "act ii",
        "butter"
    ],
    category: "packaged-food",
    subcategory: "snack",
    itemType: "snack",
    state: "cooked",
    region: "pan-indian",
    defaultServingGrams: 30,
    per100g: {
        calories: 480,
        protein: 6.5,
        carbs: 55,
        fat: 26,
        fiber: 9,
        sodium: 1050,
        vitaminB12: 0,
        vitaminD: 0,
        iron: 2,
        calcium: 15
    },
    servings: [
        {
            id: "katori",
            label: "1 katori (popped)",
            grams: 10
        },
        {
            id: "packet",
            label: "1 small pack (raw/microwaved)",
            grams: 35
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
        "high-fat",
        "processed"
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
    gi: 65,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: "FSSAI-label",
    confidence: "high"
}  ,
  {
    id: "cadbury-dairy-milk",
    name: "Cadbury Dairy Milk Chocolate",
    nameAlt: [
        "dairy milk",
        "chocolate bar"
    ],
    hindiName: "कैडबरी डेयरी मिल्क",
    searchTerms: [
        "cadbury",
        "dairy milk",
        "chocolate"
    ],
    category: "packaged-food",
    subcategory: "chocolate",
    itemType: "snack",
    state: "raw",
    region: "pan-indian",
    defaultServingGrams: 13.2,
    per100g: {
        calories: 532,
        protein: 7.7,
        carbs: 60.5,
        fat: 28.6,
        fiber: 2,
        sodium: 135,
        vitaminB12: 0.5,
        vitaminD: 0,
        iron: 1.5,
        calcium: 200
    },
    servings: [
        {
            id: "piece",
            label: "1 small ₹10 bar (~13g)",
            grams: 13.2
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
        "high-fat",
        "processed"
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
    gi: 45,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: "FSSAI-label",
    confidence: "high"
}  ,
  {
    id: "sabudana-khichdi",
    name: "Sabudana Khichdi",
    nameAlt: [
        "sago khichdi",
        "sabu dana"
    ],
    hindiName: "साबूदाना खिचड़ी",
    searchTerms: [
        "sabudana",
        "khichdi",
        "vrat",
        "fasting",
        "sago"
    ],
    category: 'fasting-food',
    subcategory: "dish",
    itemType: "dish",
    state: "cooked",
    region: "west",
    defaultServingGrams: 150,
    per100g: {
        calories: 230,
        protein: 3.5,
        carbs: 32,
        fat: 9.5,
        fiber: 2,
        sodium: 300,
        vitaminB12: 0,
        vitaminD: 0,
        iron: 1,
        calcium: 15
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
        "vegan",
        "veg",
        "nonveg"
    ],
    tags: [
        "vrat",
        "high-carb",
        "high-carb"
    ],
    isProcessed: false,
    isFastingFood: true,
    fastingTypes: [
        "navratri",
        "ekadashi",
        "maha-shivratri"
    ],
    isGlutenFree: true,
    isRecipe: false,
    containsRootVeg: true,
    hasBeverageModifiers: false,
    supportedConsistencyTypes: [],
    consistencyMultipliers: {},
    gi: 75,
    cookingOilNote: "Peanut oil / Ghee",
    estimatedOilG: 6,
    source: "healthifyme",
    confidence: "high",
    notes: "Almost always contains potatoes."
}  ,
  {
    id: "sabudana-vada",
    name: "Sabudana Vada",
    nameAlt: [
        "sago vada",
        "vrat vada"
    ],
    hindiName: "साबूदाना वडा",
    searchTerms: [
        "sabudana",
        "vada",
        "vrat",
        "fried"
    ],
    category: 'fasting-food',
    subcategory: "snack",
    itemType: "dish",
    state: "fried",
    region: "west",
    defaultServingGrams: 50,
    per100g: {
        calories: 340,
        protein: 4,
        carbs: 45,
        fat: 16,
        fiber: 2.5,
        sodium: 400,
        vitaminB12: 0,
        vitaminD: 0,
        iron: 1.2,
        calcium: 20
    },
    servings: [
        {
            id: "piece",
            label: "1 medium vada",
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
        "nonveg"
    ],
    tags: [
        "vrat",
        "high-fat",
        "fried"
    ],
    isProcessed: false,
    isFastingFood: true,
    fastingTypes: [
        "navratri",
        "ekadashi",
        "maha-shivratri"
    ],
    isGlutenFree: true,
    isRecipe: false,
    containsRootVeg: true,
    hasBeverageModifiers: false,
    supportedConsistencyTypes: [],
    consistencyMultipliers: {},
    gi: 80,
    cookingOilNote: "Deep fried",
    estimatedOilG: 12,
    source: "healthifyme",
    confidence: "medium"
}  ,
  {
    id: "kuttu-puri",
    name: "Kuttu Ki Puri (Buckwheat)",
    nameAlt: [
        "kuttu poori"
    ],
    hindiName: "कुट्टू की पूरी",
    searchTerms: [
        "kuttu",
        "puri",
        "poori",
        "vrat",
        "buckwheat"
    ],
    category: 'fasting-food',
    subcategory: "bread",
    itemType: "dish",
    state: "fried",
    region: "north",
    defaultServingGrams: 30,
    per100g: {
        calories: 380,
        protein: 7,
        carbs: 55,
        fat: 15,
        fiber: 8,
        sodium: 200,
        vitaminB12: 0,
        vitaminD: 0,
        iron: 2.5,
        calcium: 30
    },
    servings: [
        {
            id: "piece",
            label: "1 puri",
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
        "nonveg"
    ],
    tags: [
        "vrat",
        "fried"
    ],
    isProcessed: false,
    isFastingFood: true,
    fastingTypes: [
        "navratri",
        "ekadashi",
        "maha-shivratri"
    ],
    isGlutenFree: true,
    isRecipe: false,
    containsRootVeg: true,
    hasBeverageModifiers: false,
    supportedConsistencyTypes: [],
    consistencyMultipliers: {},
    gi: 55,
    cookingOilNote: "Deep fried, dough bound with boiled potato.",
    estimatedOilG: 6,
    source: "healthifyme",
    confidence: "medium"
}  ,
  {
    id: "singhare-puri",
    name: "Singhare Ki Puri (Water Chestnut)",
    nameAlt: [
        "singara puri"
    ],
    hindiName: "सिंघाड़े की पूरी",
    searchTerms: [
        "singhare",
        "puri",
        "poori",
        "vrat",
        "water chestnut"
    ],
    category: 'fasting-food',
    subcategory: "bread",
    itemType: "dish",
    state: "fried",
    region: "north",
    defaultServingGrams: 30,
    per100g: {
        calories: 360,
        protein: 5,
        carbs: 60,
        fat: 12,
        fiber: 5,
        sodium: 200,
        vitaminB12: 0,
        vitaminD: 0,
        iron: 1.5,
        calcium: 20
    },
    servings: [
        {
            id: "piece",
            label: "1 puri",
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
        "nonveg"
    ],
    tags: [
        "vrat",
        "fried"
    ],
    isProcessed: false,
    isFastingFood: true,
    fastingTypes: [
        "navratri",
        "ekadashi",
        "maha-shivratri"
    ],
    isGlutenFree: true,
    isRecipe: false,
    containsRootVeg: true,
    hasBeverageModifiers: false,
    supportedConsistencyTypes: [],
    consistencyMultipliers: {},
    gi: 55,
    cookingOilNote: "Deep fried, dough bound with boiled potato.",
    estimatedOilG: 5,
    source: "healthifyme",
    confidence: "medium"
}  ,
  {
    id: "sama-chawal",
    name: "Sama Ke Chawal (Barnyard Millet/Samak)",
    nameAlt: [
        "samak chawal",
        "bhagar",
        "millet"
    ],
    hindiName: "समा के चावल",
    searchTerms: [
        "sama",
        "samak",
        "bhagar",
        "barnyard millet",
        "vrat rice"
    ],
    category: 'fasting-food',
    subcategory: "dish",
    itemType: "dish",
    state: "cooked",
    region: "pan-indian",
    defaultServingGrams: 150,
    per100g: {
        calories: 120,
        protein: 2.5,
        carbs: 24,
        fat: 1.5,
        fiber: 3.5,
        sodium: 10,
        vitaminB12: 0,
        vitaminD: 0,
        iron: 1.2,
        calcium: 10
    },
    servings: [
        {
            id: "katori",
            label: "1 katori (cooked)",
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
        "vrat",
        "low-GI",
        "healthy"
    ],
    isProcessed: false,
    isFastingFood: true,
    fastingTypes: [
        "navratri",
        "ekadashi",
        "maha-shivratri"
    ],
    isGlutenFree: true,
    isRecipe: false,
    containsRootVeg: false,
    hasBeverageModifiers: false,
    supportedConsistencyTypes: [],
    consistencyMultipliers: {},
    gi: 50,
    cookingOilNote: "Often cooked in 1 tsp ghee.",
    estimatedOilG: 2,
    source: "IFCT-2017",
    confidence: "high"
}  ,
  {
    id: "vrat-wale-aloo",
    name: "Vrat Wale Aloo (Dry Sabzi)",
    nameAlt: [
        "jeera aloo vrat",
        "falahari aloo"
    ],
    hindiName: "व्रत वाले आलू",
    searchTerms: [
        "aloo",
        "vrat",
        "falahari",
        "jeera aloo"
    ],
    category: 'fasting-food',
    subcategory: "dish",
    itemType: "dish",
    state: "cooked",
    region: "north",
    defaultServingGrams: 150,
    per100g: {
        calories: 110,
        protein: 2,
        carbs: 18,
        fat: 3.5,
        fiber: 2.5,
        sodium: 250,
        vitaminB12: 0,
        vitaminD: 0,
        iron: 0.8,
        calcium: 15
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
        "vegan",
        "veg",
        "nonveg"
    ],
    tags: [
        "vrat"
    ],
    isProcessed: false,
    isFastingFood: true,
    fastingTypes: [
        "navratri",
        "ekadashi",
        "maha-shivratri"
    ],
    isGlutenFree: true,
    isRecipe: false,
    containsRootVeg: true,
    hasBeverageModifiers: false,
    supportedConsistencyTypes: [],
    consistencyMultipliers: {},
    gi: 65,
    cookingOilNote: "Tempered in ghee/peanut oil.",
    estimatedOilG: 4,
    source: "healthifyme",
    confidence: "high"
}  ,
  {
    id: "makhana-kheer",
    name: "Makhana Kheer",
    nameAlt: [
        "phool makhana kheer"
    ],
    hindiName: "मखाना खीर",
    searchTerms: [
        "makhana",
        "kheer",
        "vrat",
        "sweet"
    ],
    category: 'fasting-food',
    subcategory: "sweet",
    itemType: "dish",
    state: "cooked",
    region: "north",
    defaultServingGrams: 150,
    per100g: {
        calories: 140,
        protein: 4.5,
        carbs: 20,
        fat: 5,
        fiber: 0.5,
        sodium: 40,
        vitaminB12: 0.2,
        vitaminD: 0,
        iron: 1,
        calcium: 110
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
        "nonveg"
    ],
    tags: [
        "vrat",
        "high-sugar"
    ],
    isProcessed: false,
    isFastingFood: true,
    fastingTypes: [
        "navratri",
        "ekadashi",
        "maha-shivratri"
    ],
    isGlutenFree: true,
    isRecipe: false,
    containsRootVeg: false,
    hasBeverageModifiers: false,
    supportedConsistencyTypes: [],
    consistencyMultipliers: {},
    gi: 55,
    cookingOilNote: "Makhana roasted in ghee.",
    estimatedOilG: 3,
    source: "curated-estimate",
    confidence: "medium"
}  ,
  {
    id: "rajgira-paratha",
    name: "Rajgira Paratha (Amaranth)",
    nameAlt: [
        "amaranth paratha"
    ],
    hindiName: "राजगिरा पराठा",
    searchTerms: [
        "rajgira",
        "paratha",
        "vrat",
        "amaranth"
    ],
    category: 'fasting-food',
    subcategory: "bread",
    itemType: "dish",
    state: "cooked",
    region: "west",
    defaultServingGrams: 60,
    per100g: {
        calories: 310,
        protein: 8,
        carbs: 50,
        fat: 9,
        fiber: 7,
        sodium: 150,
        vitaminB12: 0,
        vitaminD: 0,
        iron: 3.5,
        calcium: 90
    },
    servings: [
        {
            id: "piece",
            label: "1 paratha",
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
        "nonveg"
    ],
    tags: [
        "vrat",
        "high-fiber"
    ],
    isProcessed: false,
    isFastingFood: true,
    fastingTypes: [
        "navratri",
        "ekadashi",
        "maha-shivratri"
    ],
    isGlutenFree: true,
    isRecipe: false,
    containsRootVeg: true,
    hasBeverageModifiers: false,
    supportedConsistencyTypes: [],
    consistencyMultipliers: {},
    gi: 45,
    cookingOilNote: "Bound with potato, roasted with ghee/oil.",
    estimatedOilG: 4,
    source: "healthifyme",
    confidence: "medium"
}  ,
  {
    id: "banana-chips",
    name: "Banana Chips (Kerala Style / Yellow)",
    nameAlt: [
        "kela chips",
        "nendran chips"
    ],
    hindiName: "केले के चिप्स",
    searchTerms: [
        "banana chips",
        "kela chips",
        "nendran"
    ],
    category: "packaged-food",
    subcategory: "chips",
    itemType: "snack",
    state: "fried",
    region: "south",
    defaultServingGrams: 30,
    per100g: {
        calories: 519,
        protein: 2.3,
        carbs: 58,
        fat: 33,
        fiber: 7,
        sodium: 350,
        vitaminB12: 0,
        vitaminD: 0,
        iron: 1,
        calcium: 15
    },
    servings: [
        {
            id: "handful",
            label: "1 handful (~30g)",
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
        "vrat",
        "snack",
        "high-fat"
    ],
    isProcessed: true,
    isFastingFood: true,
    fastingTypes: [
        "navratri",
        "ekadashi",
        "maha-shivratri"
    ],
    isGlutenFree: true,
    isRecipe: false,
    containsRootVeg: false,
    hasBeverageModifiers: false,
    supportedConsistencyTypes: [],
    consistencyMultipliers: {},
    gi: 65,
    cookingOilNote: "Deep fried in coconut oil.",
    estimatedOilG: 10,
    source: "USDA",
    confidence: "high"
}  ,
  {
    id: "farali-chivda",
    name: "Farali Chivda (Potato & Peanuts Sweet/Salty)",
    nameAlt: [
        "falahari chivda",
        "vrat namkeen"
    ],
    hindiName: "फराली चिवड़ा",
    searchTerms: [
        "farali",
        "chivda",
        "vrat namkeen",
        "potato chewda"
    ],
    category: 'fasting-food',
    subcategory: "snack",
    itemType: "snack",
    state: "fried",
    region: "west",
    defaultServingGrams: 30,
    per100g: {
        calories: 530,
        protein: 8,
        carbs: 50,
        fat: 34,
        fiber: 3.5,
        sodium: 400,
        vitaminB12: 0,
        vitaminD: 0,
        iron: 1.5,
        calcium: 30
    },
    servings: [
        {
            id: "katori",
            label: "1 small katori (~30g)",
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
        "nonveg"
    ],
    tags: [
        "vrat",
        "snack",
        "high-fat",
        "sweet-salty"
    ],
    isProcessed: true,
    isFastingFood: true,
    fastingTypes: [
        "navratri",
        "ekadashi",
        "maha-shivratri"
    ],
    isGlutenFree: true,
    isRecipe: false,
    containsRootVeg: true,
    hasBeverageModifiers: false,
    supportedConsistencyTypes: [],
    consistencyMultipliers: {},
    gi: 70,
    cookingOilNote: "Deep fried potato sticks and peanuts.",
    estimatedOilG: 8,
    source: "healthifyme",
    confidence: "medium"
}
  ,
  {
    id: "mb-biozyme-whey",
    name: "MuscleBlaze Biozyme Whey Protein",
    nameAlt: [
        "mb biozyme",
        "muscleblaze whey"
    ],
    hindiName: "मसलब्लेज़ बायोज़ाइम व्हे",
    searchTerms: [
        "mb",
        "biozyme",
        "muscleblaze",
        "whey"
    ],
    category: "supplement",
    subcategory: "whey-concentrate",
    itemType: "supplement",
    state: "raw",
    region: "pan-indian",
    brand: "MuscleBlaze",
    productLine: "Biozyme Performance Whey",
    scoopWeightG: 33,
    proteinType: "concentrate",
    bcaaG: 5.5,
    certifications: [
        "Labdoor",
        "Trustified Gold",
        "FSSAI"
    ],
    priceINR: 2799,
    originCountry: "India",
    defaultServingGrams: 33,
    per100g: {
        calories: 364,
        protein: 75.8,
        carbs: 7.6,
        fat: 3.6,
        fiber: 0,
        sodium: 300,
        vitaminB12: 0,
        vitaminD: 0,
        iron: 0,
        calcium: 300
    },
    servings: [
        {
            id: "scoop",
            label: "1 scoop (33g)",
            grams: 33
        },
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
        "nonveg"
    ],
    tags: [
        "muscle-building",
        "high-protein"
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
    gi: 15,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: "FSSAI-label",
    confidence: "high"
}  ,
  {
    id: "mb-biozyme-performance-whey",
    name: "MuscleBlaze Biozyme Performance Whey",
    nameAlt: [
        "mb performance whey"
    ],
    hindiName: "मसलब्लेज़ परफॉरमेंस व्हे",
    searchTerms: [
        "mb",
        "biozyme performance",
        "muscleblaze"
    ],
    category: "supplement",
    subcategory: "whey-concentrate",
    itemType: "supplement",
    state: "raw",
    region: "pan-indian",
    brand: "MuscleBlaze",
    productLine: "Biozyme Performance Whey",
    scoopWeightG: 36,
    proteinType: "concentrate",
    bcaaG: 5.5,
    certifications: [
        "Trustified Gold"
    ],
    priceINR: 2999,
    originCountry: "India",
    defaultServingGrams: 36,
    per100g: {
        calories: 391,
        protein: 69.4,
        carbs: 16.1,
        fat: 5.3,
        fiber: 0,
        sodium: 360,
        vitaminB12: 0,
        vitaminD: 0,
        iron: 0,
        calcium: 300
    },
    servings: [
        {
            id: "scoop",
            label: "1 scoop (36g)",
            grams: 36
        },
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
        "nonveg"
    ],
    tags: [
        "muscle-building",
        "high-protein"
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
    gi: 15,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: "FSSAI-label",
    confidence: "high"
}  ,
  {
    id: "mb-raw-whey-concentrate",
    name: "MuscleBlaze Raw Whey Protein Concentrate (80%)",
    nameAlt: [
        "mb raw whey"
    ],
    hindiName: "मसलब्लेज़ रॉ व्हे",
    searchTerms: [
        "mb",
        "raw",
        "muscleblaze raw",
        "unflavoured"
    ],
    category: "supplement",
    subcategory: "whey-concentrate",
    itemType: "supplement",
    state: "raw",
    region: "pan-indian",
    brand: "MuscleBlaze",
    productLine: "Raw Whey",
    scoopWeightG: 33,
    proteinType: "concentrate",
    bcaaG: 5.1,
    certifications: [
        "FSSAI"
    ],
    priceINR: 1699,
    originCountry: "India",
    defaultServingGrams: 33,
    per100g: {
        calories: 394,
        protein: 72.7,
        carbs: 12.1,
        fat: 4.5,
        fiber: 0,
        sodium: 242,
        vitaminB12: 0,
        vitaminD: 0,
        iron: 0,
        calcium: 300
    },
    servings: [
        {
            id: "scoop",
            label: "1 scoop (33g)",
            grams: 33
        },
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
        "nonveg"
    ],
    tags: [
        "muscle-building",
        "high-protein"
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
    gi: 15,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: "FSSAI-label",
    confidence: "high"
}  ,
  {
    id: "asitis-atom-whey",
    name: "AS-IT-IS Nutrition ATOM Whey Protein",
    nameAlt: [
        "atom whey",
        "asitis whey"
    ],
    hindiName: "एज़ इट इज़ एटम व्हे",
    searchTerms: [
        "asitis",
        "atom",
        "as-it-is"
    ],
    category: "supplement",
    subcategory: "whey-concentrate",
    itemType: "supplement",
    state: "raw",
    region: "pan-indian",
    brand: "AS-IT-IS",
    productLine: "ATOM",
    scoopWeightG: 33,
    proteinType: "concentrate",
    bcaaG: 6.1,
    eaaG: 12.9,
    certifications: [
        "Labdoor",
        "NABL"
    ],
    priceINR: 1499,
    originCountry: "India",
    defaultServingGrams: 33,
    per100g: {
        calories: 385,
        protein: 81.8,
        carbs: 6.1,
        fat: 1.5,
        fiber: 0,
        sodium: 272,
        vitaminB12: 0,
        vitaminD: 0,
        iron: 0,
        calcium: 300
    },
    servings: [
        {
            id: "scoop",
            label: "1 scoop (33g)",
            grams: 33
        },
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
        "nonveg"
    ],
    tags: [
        "muscle-building",
        "high-protein"
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
    gi: 15,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: "FSSAI-label",
    confidence: "high"
}  ,
  {
    id: "asitis-raw-whey-concentrate",
    name: "AS-IT-IS Raw Whey Protein Concentrate",
    nameAlt: [
        "asitis raw whey"
    ],
    hindiName: "एज़ इट इज़ रॉ व्हे",
    searchTerms: [
        "asitis",
        "raw whey",
        "as-it-israw"
    ],
    category: "supplement",
    subcategory: "whey-concentrate",
    itemType: "supplement",
    state: "raw",
    region: "pan-indian",
    brand: "AS-IT-IS",
    productLine: "Raw Whey",
    scoopWeightG: 33,
    proteinType: "concentrate",
    bcaaG: 5.9,
    certifications: [
        "Labdoor"
    ],
    priceINR: 1199,
    originCountry: "India",
    defaultServingGrams: 33,
    per100g: {
        calories: 391,
        protein: 78.8,
        carbs: 9.1,
        fat: 4.5,
        fiber: 0,
        sodium: 257,
        vitaminB12: 0,
        vitaminD: 0,
        iron: 0,
        calcium: 300
    },
    servings: [
        {
            id: "scoop",
            label: "1 scoop (33g)",
            grams: 33
        },
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
        "nonveg"
    ],
    tags: [
        "muscle-building",
        "high-protein"
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
    gi: 15,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: "FSSAI-label",
    confidence: "high"
}  ,
  {
    id: "twt-whey-concentrate-unflavored",
    name: "The Whole Truth Whey Protein Concentrate",
    nameAlt: [
        "twt whey",
        "whole truth whey"
    ],
    hindiName: "दी होल ट्रुथ व्हे",
    searchTerms: [
        "twt",
        "whole truth",
        "unflavored"
    ],
    category: "supplement",
    subcategory: "whey-concentrate",
    itemType: "supplement",
    state: "raw",
    region: "pan-indian",
    brand: "The Whole Truth",
    productLine: "Whey Protein Concentrate",
    scoopWeightG: 30,
    proteinType: "concentrate",
    bcaaG: 6.4,
    certifications: [
        "Clean label"
    ],
    priceINR: 2499,
    originCountry: "India",
    defaultServingGrams: 30,
    per100g: {
        calories: 413,
        protein: 86.7,
        carbs: 6.7,
        fat: 5,
        fiber: 0,
        sodium: 233,
        vitaminB12: 0,
        vitaminD: 0,
        iron: 0,
        calcium: 300
    },
    servings: [
        {
            id: "scoop",
            label: "1 scoop (30g)",
            grams: 30
        },
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
        "nonveg"
    ],
    tags: [
        "muscle-building",
        "high-protein"
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
    gi: 15,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: "FSSAI-label",
    confidence: "high"
}  ,
  {
    id: "twt-whey-isolate-unflavored",
    name: "The Whole Truth Whey Protein Isolate",
    nameAlt: [
        "twt isolate",
        "whole truth isolate"
    ],
    hindiName: "दी होल ट्रुथ व्हे आइसोलेट",
    searchTerms: [
        "twt",
        "whole truth",
        "isolate"
    ],
    category: "supplement",
    subcategory: "whey-isolate",
    itemType: "supplement",
    state: "raw",
    region: "pan-indian",
    brand: "The Whole Truth",
    productLine: "Whey Protein Isolate",
    scoopWeightG: 33,
    proteinType: "isolate",
    bcaaG: 7.3,
    certifications: [
        "Clean label"
    ],
    priceINR: 3499,
    originCountry: "India",
    defaultServingGrams: 33,
    per100g: {
        calories: 394,
        protein: 90.9,
        carbs: 3,
        fat: 1.5,
        fiber: 0,
        sodium: 197,
        vitaminB12: 0,
        vitaminD: 0,
        iron: 0,
        calcium: 300
    },
    servings: [
        {
            id: "scoop",
            label: "1 scoop (33g)",
            grams: 33
        },
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
        "nonveg"
    ],
    tags: [
        "muscle-building",
        "high-protein"
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
    gi: 15,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: "FSSAI-label",
    confidence: "high"
}  ,
  {
    id: "nakpro-impact-whey",
    name: "NAKPRO Impact Whey Protein",
    nameAlt: [
        "nakpro whey"
    ],
    hindiName: "नैकप्रो इम्पैक्ट व्हे",
    searchTerms: [
        "nakpro",
        "impact"
    ],
    category: "supplement",
    subcategory: "whey-concentrate",
    itemType: "supplement",
    state: "raw",
    region: "pan-indian",
    brand: "NAKPRO",
    productLine: "Impact Whey",
    scoopWeightG: 33,
    proteinType: "concentrate",
    bcaaG: 5.4,
    certifications: [
        "Trustified"
    ],
    priceINR: 1899,
    originCountry: "India",
    defaultServingGrams: 33,
    per100g: {
        calories: 376,
        protein: 72.7,
        carbs: 9.1,
        fat: 4.5,
        fiber: 0,
        sodium: 303,
        vitaminB12: 0,
        vitaminD: 0,
        iron: 0,
        calcium: 300
    },
    servings: [
        {
            id: "scoop",
            label: "1 scoop (33g)",
            grams: 33
        },
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
        "nonveg"
    ],
    tags: [
        "muscle-building",
        "high-protein"
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
    gi: 15,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: "FSSAI-label",
    confidence: "high"
}  ,
  {
    id: "avvatar-absolute-whey",
    name: "AVVATAR Absolute 100% Whey Protein",
    nameAlt: [
        "avvatar whey"
    ],
    hindiName: "अवतार एब्सोल्यूट व्हे",
    searchTerms: [
        "avvatar",
        "absolute"
    ],
    category: "supplement",
    subcategory: "whey-concentrate",
    itemType: "supplement",
    state: "raw",
    region: "pan-indian",
    brand: "AVVATAR",
    productLine: "Absolute Whey",
    scoopWeightG: 36,
    proteinType: "concentrate",
    bcaaG: 5.5,
    certifications: [
        "Vegetarian"
    ],
    priceINR: 2599,
    originCountry: "India",
    defaultServingGrams: 36,
    per100g: {
        calories: 403,
        protein: 69.4,
        carbs: 15.3,
        fat: 5.6,
        fiber: 0,
        sodium: 333,
        vitaminB12: 0,
        vitaminD: 0,
        iron: 0,
        calcium: 300
    },
    servings: [
        {
            id: "scoop",
            label: "1 scoop (36g)",
            grams: 36
        },
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
        "nonveg"
    ],
    tags: [
        "muscle-building",
        "high-protein"
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
    gi: 15,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: "FSSAI-label",
    confidence: "high"
}  ,
  {
    id: "truebasics-clean-whey-isolate",
    name: "TrueBasics Clean Whey Isolate",
    nameAlt: [
        "truebasics whey isolate"
    ],
    hindiName: "ट्रूबेसिक्स क्लीन व्हे आइसोलेट",
    searchTerms: [
        "truebasics",
        "clean whey"
    ],
    category: "supplement",
    subcategory: "whey-isolate",
    itemType: "supplement",
    state: "raw",
    region: "pan-indian",
    brand: "TrueBasics",
    productLine: "Clean Whey Isolate",
    scoopWeightG: 33,
    proteinType: "isolate",
    bcaaG: 6.9,
    certifications: [
        "Trustified Gold"
    ],
    priceINR: 3299,
    originCountry: "India",
    defaultServingGrams: 33,
    per100g: {
        calories: 364,
        protein: 90.9,
        carbs: 3,
        fat: 1.5,
        fiber: 0,
        sodium: 242,
        vitaminB12: 0,
        vitaminD: 0,
        iron: 0,
        calcium: 300
    },
    servings: [
        {
            id: "scoop",
            label: "1 scoop (33g)",
            grams: 33
        },
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
        "nonveg"
    ],
    tags: [
        "muscle-building",
        "high-protein"
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
    gi: 15,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: "FSSAI-label",
    confidence: "high"
}
  ,
  {
    id: "on-gold-standard-whey",
    name: "Optimum Nutrition Gold Standard 100% Whey",
    nameAlt: [
        "on gold"
    ],
    searchTerms: [
        "optimum nutrition",
        "on gold",
        "whey",
        "protein",
        "Optimum Nutrition"
    ],
    category: "supplement",
    subcategory: "whey-concentrate",
    itemType: "supplement",
    state: "raw",
    region: "pan-indian",
    brand: "Optimum Nutrition",
    productLine: "Gold Standard 100% Whey",
    scoopWeightG: 30,
    proteinType: "concentrate",
    bcaaG: 5.5,
    eaaG: null,
    certifications: [
        "Informed Choice"
    ],
    priceINR: 4499,
    originCountry: "USA",
    defaultServingGrams: 30,
    per100g: {
        calories: 400,
        protein: 80,
        carbs: 10,
        fat: 3.3,
        fiber: 0,
        sodium: 150,
        vitaminB12: 0,
        vitaminD: 0,
        iron: 0,
        calcium: 200
    },
    servings: [
        {
            id: "scoop",
            label: "1 scoop (30g)",
            grams: 30
        },
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
        "nonveg"
    ],
    tags: [
        "muscle-building"
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
    gi: 15,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: "FSSAI-label",
    confidence: "high"
}  ,
  {
    id: "on-gold-standard-whey-isolate",
    name: "Optimum Nutrition Gold Standard 100% Whey Isolate",
    nameAlt: [
        "on gold isolate"
    ],
    searchTerms: [
        "optimum nutrition",
        "on gold isolate",
        "whey",
        "protein",
        "Optimum Nutrition"
    ],
    category: "supplement",
    subcategory: "whey-isolate",
    itemType: "supplement",
    state: "raw",
    region: "pan-indian",
    brand: "Optimum Nutrition",
    productLine: "Gold Standard 100% Whey Isolate",
    scoopWeightG: 31,
    proteinType: "isolate",
    bcaaG: 5.5,
    eaaG: null,
    certifications: [
        "Informed Choice"
    ],
    priceINR: 5999,
    originCountry: "USA",
    defaultServingGrams: 31,
    per100g: {
        calories: 355,
        protein: 80.6,
        carbs: 3.2,
        fat: 1.6,
        fiber: 0,
        sodium: 150,
        vitaminB12: 0,
        vitaminD: 0,
        iron: 0,
        calcium: 200
    },
    servings: [
        {
            id: "scoop",
            label: "1 scoop (31g)",
            grams: 31
        },
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
        "nonveg"
    ],
    tags: [
        "muscle-building"
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
    gi: 15,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: "FSSAI-label",
    confidence: "high"
}  ,
  {
    id: "myprotein-impact-whey-concentrate",
    name: "MyProtein Impact Whey Protein",
    nameAlt: [
        "myprotein whey"
    ],
    searchTerms: [
        "myprotein",
        "myprotein whey",
        "whey",
        "protein",
        "MyProtein"
    ],
    category: "supplement",
    subcategory: "whey-concentrate",
    itemType: "supplement",
    state: "raw",
    region: "pan-indian",
    brand: "MyProtein",
    productLine: "Impact Whey",
    scoopWeightG: 25,
    proteinType: "concentrate",
    bcaaG: 4.5,
    eaaG: null,
    certifications: [
        "Labdoor"
    ],
    priceINR: 1999,
    originCountry: "UK",
    defaultServingGrams: 25,
    per100g: {
        calories: 412,
        protein: 80,
        carbs: 12,
        fat: 7.6,
        fiber: 0,
        sodium: 150,
        vitaminB12: 0,
        vitaminD: 0,
        iron: 0,
        calcium: 200
    },
    servings: [
        {
            id: "scoop",
            label: "1 scoop (25g)",
            grams: 25
        },
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
        "nonveg"
    ],
    tags: [
        "muscle-building"
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
    gi: 15,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: "FSSAI-label",
    confidence: "high"
}  ,
  {
    id: "myprotein-impact-whey-isolate",
    name: "MyProtein Impact Whey Isolate",
    nameAlt: [
        "myprotein isolate"
    ],
    searchTerms: [
        "myprotein",
        "myprotein isolate",
        "whey",
        "protein",
        "MyProtein"
    ],
    category: "supplement",
    subcategory: "whey-isolate",
    itemType: "supplement",
    state: "raw",
    region: "pan-indian",
    brand: "MyProtein",
    productLine: "Impact Whey Isolate",
    scoopWeightG: 25,
    proteinType: "isolate",
    bcaaG: 4.9,
    eaaG: null,
    certifications: [
        "Labdoor"
    ],
    priceINR: 2799,
    originCountry: "UK",
    defaultServingGrams: 25,
    per100g: {
        calories: 372,
        protein: 88,
        carbs: 4,
        fat: 2,
        fiber: 0,
        sodium: 150,
        vitaminB12: 0,
        vitaminD: 0,
        iron: 0,
        calcium: 200
    },
    servings: [
        {
            id: "scoop",
            label: "1 scoop (25g)",
            grams: 25
        },
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
        "nonveg"
    ],
    tags: [
        "muscle-building"
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
    gi: 15,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: "FSSAI-label",
    confidence: "high"
}  ,
  {
    id: "dymatize-iso100",
    name: "Dymatize ISO 100",
    nameAlt: [
        "iso 100"
    ],
    searchTerms: [
        "dymatize",
        "iso 100",
        "whey",
        "protein",
        "Dymatize"
    ],
    category: "supplement",
    subcategory: "whey-hydrolysate",
    itemType: "supplement",
    state: "raw",
    region: "pan-indian",
    brand: "Dymatize",
    productLine: "ISO 100",
    scoopWeightG: 31,
    proteinType: "hydrolysate",
    bcaaG: 5.5,
    eaaG: null,
    certifications: [
        "Informed Choice"
    ],
    priceINR: 6999,
    originCountry: "USA",
    defaultServingGrams: 31,
    per100g: {
        calories: 355,
        protein: 80.6,
        carbs: 3.2,
        fat: 1.6,
        fiber: 0,
        sodium: 150,
        vitaminB12: 0,
        vitaminD: 0,
        iron: 0,
        calcium: 200
    },
    servings: [
        {
            id: "scoop",
            label: "1 scoop (31g)",
            grams: 31
        },
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
        "nonveg"
    ],
    tags: [
        "muscle-building"
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
    gi: 15,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: "FSSAI-label",
    confidence: "high"
}  ,
  {
    id: "bigmuscles-premium-gold-whey",
    name: "Bigmuscles Nutrition Premium Gold Whey",
    nameAlt: [
        "bigmuscles whey"
    ],
    searchTerms: [
        "bigmuscles nutrition",
        "bigmuscles whey",
        "whey",
        "protein",
        "Bigmuscles Nutrition"
    ],
    category: "supplement",
    subcategory: "whey-concentrate",
    itemType: "supplement",
    state: "raw",
    region: "pan-indian",
    brand: "Bigmuscles Nutrition",
    productLine: "Premium Gold Whey",
    scoopWeightG: 36,
    proteinType: "concentrate",
    bcaaG: 5.8,
    eaaG: 11,
    certifications: [
        "Informed Choice UK"
    ],
    priceINR: 2999,
    originCountry: "India",
    defaultServingGrams: 36,
    per100g: {
        calories: 403,
        protein: 69.4,
        carbs: 19.4,
        fat: 5.6,
        fiber: 0,
        sodium: 150,
        vitaminB12: 0,
        vitaminD: 0,
        iron: 0,
        calcium: 200
    },
    servings: [
        {
            id: "scoop",
            label: "1 scoop (36g)",
            grams: 36
        },
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
        "nonveg"
    ],
    tags: [
        "muscle-building"
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
    gi: 15,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: "FSSAI-label",
    confidence: "high"
}  ,
  {
    id: "gnc-pro-performance-whey",
    name: "GNC Pro Performance Whey Protein",
    nameAlt: [
        "gnc whey"
    ],
    searchTerms: [
        "gnc",
        "gnc whey",
        "whey",
        "protein",
        "GNC"
    ],
    category: "supplement",
    subcategory: "whey-concentrate",
    itemType: "supplement",
    state: "raw",
    region: "pan-indian",
    brand: "GNC",
    productLine: "Pro Performance",
    scoopWeightG: 34,
    proteinType: "concentrate",
    bcaaG: 5,
    eaaG: null,
    certifications: [
        "GNC"
    ],
    priceINR: 3499,
    originCountry: "USA",
    defaultServingGrams: 34,
    per100g: {
        calories: 382,
        protein: 70.6,
        carbs: 14.7,
        fat: 4.4,
        fiber: 0,
        sodium: 150,
        vitaminB12: 0,
        vitaminD: 0,
        iron: 0,
        calcium: 200
    },
    servings: [
        {
            id: "scoop",
            label: "1 scoop (34g)",
            grams: 34
        },
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
        "nonveg"
    ],
    tags: [
        "muscle-building"
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
    gi: 15,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: "FSSAI-label",
    confidence: "high"
}  ,
  {
    id: "tata-1mg-whey",
    name: "Tata 1mg Ultra Clean Whey Protein",
    nameAlt: [
        "tata whey"
    ],
    searchTerms: [
        "tata 1mg",
        "tata whey",
        "whey",
        "protein",
        "Tata 1mg"
    ],
    category: "supplement",
    subcategory: "whey-concentrate",
    itemType: "supplement",
    state: "raw",
    region: "pan-indian",
    brand: "Tata 1mg",
    productLine: "Ultra Clean Whey",
    scoopWeightG: 36,
    proteinType: "concentrate",
    bcaaG: 5.6,
    eaaG: null,
    certifications: [
        "Trustified Gold"
    ],
    priceINR: 2999,
    originCountry: "India",
    defaultServingGrams: 36,
    per100g: {
        calories: 375,
        protein: 69.4,
        carbs: 11.1,
        fat: 4.2,
        fiber: 0,
        sodium: 150,
        vitaminB12: 0,
        vitaminD: 0,
        iron: 0,
        calcium: 200
    },
    servings: [
        {
            id: "scoop",
            label: "1 scoop (36g)",
            grams: 36
        },
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
        "nonveg"
    ],
    tags: [
        "muscle-building"
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
    gi: 15,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: "FSSAI-label",
    confidence: "high"
}  ,
  {
    id: "mb-biozyme-iso-zero",
    name: "MuscleBlaze Biozyme Iso-Zero",
    nameAlt: [
        "mb iso zero"
    ],
    searchTerms: [
        "muscleblaze",
        "mb iso zero",
        "whey",
        "protein",
        "MuscleBlaze"
    ],
    category: "supplement",
    subcategory: "whey-isolate",
    itemType: "supplement",
    state: "raw",
    region: "pan-indian",
    brand: "MuscleBlaze",
    productLine: "Biozyme Iso-Zero",
    scoopWeightG: 34,
    proteinType: "isolate",
    bcaaG: 5.96,
    eaaG: 12.69,
    certifications: [
        "Trustified Gold"
    ],
    priceINR: 3799,
    originCountry: "India",
    defaultServingGrams: 34,
    per100g: {
        calories: 368,
        protein: 79.4,
        carbs: 4.4,
        fat: 2.9,
        fiber: 0,
        sodium: 150,
        vitaminB12: 0,
        vitaminD: 0,
        iron: 0,
        calcium: 200
    },
    servings: [
        {
            id: "scoop",
            label: "1 scoop (34g)",
            grams: 34
        },
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
        "nonveg"
    ],
    tags: [
        "muscle-building"
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
    gi: 15,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: "FSSAI-label",
    confidence: "high"
}  ,
  {
    id: "nutrabay-pure-whey-concentrate",
    name: "Nutrabay Pure 100% Whey Protein Concentrate",
    nameAlt: [
        "nutrabay wpc"
    ],
    searchTerms: [
        "nutrabay",
        "nutrabay wpc",
        "whey",
        "protein",
        "Nutrabay"
    ],
    category: "supplement",
    subcategory: "whey-concentrate",
    itemType: "supplement",
    state: "raw",
    region: "pan-indian",
    brand: "Nutrabay",
    productLine: "Pure 100% Whey",
    scoopWeightG: 30,
    proteinType: "concentrate",
    bcaaG: 5.2,
    eaaG: null,
    certifications: [
        "Nutrabay"
    ],
    priceINR: 1299,
    originCountry: "India",
    defaultServingGrams: 30,
    per100g: {
        calories: 410,
        protein: 78,
        carbs: 7.7,
        fat: 7.3,
        fiber: 0,
        sodium: 150,
        vitaminB12: 0,
        vitaminD: 0,
        iron: 0,
        calcium: 200
    },
    servings: [
        {
            id: "scoop",
            label: "1 scoop (30g)",
            grams: 30
        },
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
        "nonveg"
    ],
    tags: [
        "muscle-building"
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
    gi: 15,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: "FSSAI-label",
    confidence: "high"
}  ,
  {
    id: "nutrabay-pure-whey-isolate",
    name: "Nutrabay Pure Whey Protein Isolate",
    nameAlt: [
        "nutrabay wpi"
    ],
    searchTerms: [
        "nutrabay",
        "nutrabay wpi",
        "whey",
        "protein",
        "Nutrabay"
    ],
    category: "supplement",
    subcategory: "whey-isolate",
    itemType: "supplement",
    state: "raw",
    region: "pan-indian",
    brand: "Nutrabay",
    productLine: "Pure Whey Protein Isolate",
    scoopWeightG: 30,
    proteinType: "isolate",
    bcaaG: 5.8,
    eaaG: null,
    certifications: [
        "Nutrabay"
    ],
    priceINR: 1899,
    originCountry: "India",
    defaultServingGrams: 30,
    per100g: {
        calories: 373,
        protein: 88.3,
        carbs: 3.3,
        fat: 1.7,
        fiber: 0,
        sodium: 150,
        vitaminB12: 0,
        vitaminD: 0,
        iron: 0,
        calcium: 200
    },
    servings: [
        {
            id: "scoop",
            label: "1 scoop (30g)",
            grams: 30
        },
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
        "nonveg"
    ],
    tags: [
        "muscle-building"
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
    gi: 15,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: "FSSAI-label",
    confidence: "high"
}  ,
  {
    id: "amul-whey-protein",
    name: "Amul Whey Protein",
    nameAlt: [
        "amul whey"
    ],
    searchTerms: [
        "amul",
        "amul whey",
        "whey",
        "protein",
        "Amul"
    ],
    category: "supplement",
    subcategory: "whey-concentrate",
    itemType: "supplement",
    state: "raw",
    region: "pan-indian",
    brand: "Amul",
    productLine: "Whey Protein",
    scoopWeightG: 32,
    proteinType: "concentrate",
    bcaaG: 5,
    eaaG: null,
    certifications: [
        "FSSAI"
    ],
    priceINR: 1599,
    originCountry: "India",
    defaultServingGrams: 32,
    per100g: {
        calories: 369,
        protein: 78.1,
        carbs: 6.3,
        fat: 4.7,
        fiber: 0,
        sodium: 150,
        vitaminB12: 0,
        vitaminD: 0,
        iron: 0,
        calcium: 200
    },
    servings: [
        {
            id: "scoop",
            label: "1 scoop (32g)",
            grams: 32
        },
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
        "nonveg"
    ],
    tags: [
        "muscle-building"
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
    gi: 15,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: "FSSAI-label",
    confidence: "high"
}  ,
  {
    id: "naturaltein-whey-concentrate",
    name: "Naturaltein Whey Protein Concentrate",
    nameAlt: [
        "naturaltein whey"
    ],
    searchTerms: [
        "naturaltein",
        "naturaltein whey",
        "whey",
        "protein",
        "Naturaltein"
    ],
    category: "supplement",
    subcategory: "whey-concentrate",
    itemType: "supplement",
    state: "raw",
    region: "pan-indian",
    brand: "Naturaltein",
    productLine: "Whey Protein Concentrate",
    scoopWeightG: 30,
    proteinType: "concentrate",
    bcaaG: 5.2,
    eaaG: null,
    certifications: [
        "TUV"
    ],
    priceINR: 2299,
    originCountry: "India",
    defaultServingGrams: 30,
    per100g: {
        calories: 367,
        protein: 72,
        carbs: 8.3,
        fat: 5.3,
        fiber: 0,
        sodium: 150,
        vitaminB12: 0,
        vitaminD: 0,
        iron: 0,
        calcium: 200
    },
    servings: [
        {
            id: "scoop",
            label: "1 scoop (30g)",
            grams: 30
        },
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
        "nonveg"
    ],
    tags: [
        "muscle-building"
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
    gi: 15,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: "FSSAI-label",
    confidence: "high"
}  ,
  {
    id: "muscletech-nitrotech-whey",
    name: "MuscleTech NitroTech Whey Protein",
    nameAlt: [
        "nitrotech"
    ],
    searchTerms: [
        "muscletech",
        "nitrotech",
        "whey",
        "protein",
        "MuscleTech"
    ],
    category: "supplement",
    subcategory: "whey-isolate",
    itemType: "supplement",
    state: "raw",
    region: "pan-indian",
    brand: "MuscleTech",
    productLine: "NitroTech",
    scoopWeightG: 46,
    proteinType: "isolate",
    bcaaG: 6.8,
    eaaG: null,
    certifications: [
        "Informed Choice"
    ],
    priceINR: 5500,
    originCountry: "USA",
    defaultServingGrams: 46,
    per100g: {
        calories: 348,
        protein: 65.2,
        carbs: 8.7,
        fat: 5.4,
        fiber: 0,
        sodium: 150,
        vitaminB12: 0,
        vitaminD: 0,
        iron: 0,
        calcium: 200
    },
    servings: [
        {
            id: "scoop",
            label: "1 scoop (46g)",
            grams: 46
        },
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
        "nonveg"
    ],
    tags: [
        "muscle-building"
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
    gi: 15,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: "FSSAI-label",
    confidence: "high"
}  ,
  {
    id: "protyze-clear-whey",
    name: "Protyze Anytime Clear Whey Protein",
    nameAlt: [
        "protyze clear"
    ],
    searchTerms: [
        "protyze",
        "protyze clear",
        "whey",
        "protein",
        "Protyze"
    ],
    category: "supplement",
    subcategory: "clear-whey",
    itemType: "supplement",
    state: "raw",
    region: "pan-indian",
    brand: "Protyze",
    productLine: "Anytime Clear Whey",
    scoopWeightG: 30,
    proteinType: "concentrate",
    bcaaG: 7.2,
    eaaG: null,
    certifications: [
        "FSSAI"
    ],
    priceINR: 2699,
    originCountry: "India",
    defaultServingGrams: 30,
    per100g: {
        calories: 343,
        protein: 80,
        carbs: 5,
        fat: 0,
        fiber: 0,
        sodium: 150,
        vitaminB12: 0,
        vitaminD: 0,
        iron: 0,
        calcium: 200
    },
    servings: [
        {
            id: "scoop",
            label: "1 scoop (30g)",
            grams: 30
        },
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
        "nonveg"
    ],
    tags: [
        "muscle-building"
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
    gi: 15,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: "FSSAI-label",
    confidence: "high"
}  ,
  {
    id: "kevin-levrone-gold-whey",
    name: "Kevin Levrone Gold Whey",
    nameAlt: [
        "levrone gold whey"
    ],
    searchTerms: [
        "kevin levrone",
        "levrone gold whey",
        "whey",
        "protein",
        "Kevin Levrone"
    ],
    category: "supplement",
    subcategory: "whey-concentrate",
    itemType: "supplement",
    state: "raw",
    region: "pan-indian",
    brand: "Kevin Levrone",
    productLine: "Gold Whey",
    scoopWeightG: 30,
    proteinType: "concentrate",
    bcaaG: 4.8,
    eaaG: null,
    certifications: [
        "EU"
    ],
    priceINR: 3499,
    originCountry: "Poland",
    defaultServingGrams: 30,
    per100g: {
        calories: 397,
        protein: 73.3,
        carbs: 10,
        fat: 6.7,
        fiber: 0,
        sodium: 150,
        vitaminB12: 0,
        vitaminD: 0,
        iron: 0,
        calcium: 200
    },
    servings: [
        {
            id: "scoop",
            label: "1 scoop (30g)",
            grams: 30
        },
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
        "nonveg"
    ],
    tags: [
        "muscle-building"
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
    gi: 15,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: "FSSAI-label",
    confidence: "high"
}  ,
  {
    id: "mb-mass-gainer-xxl",
    name: "MuscleBlaze Mass Gainer XXL",
    nameAlt: [
        "mb mass gainer"
    ],
    searchTerms: [
        "muscleblaze",
        "mb mass gainer",
        "whey",
        "protein",
        "MuscleBlaze"
    ],
    category: "supplement",
    subcategory: "mass-gainer",
    itemType: "supplement",
    state: "raw",
    region: "pan-indian",
    brand: "MuscleBlaze",
    productLine: "Mass Gainer XXL",
    scoopWeightG: 150,
    proteinType: "concentrate",
    bcaaG: 4.2,
    eaaG: null,
    certifications: [
        "Trustified Gold"
    ],
    priceINR: 1899,
    originCountry: "India",
    defaultServingGrams: 150,
    per100g: {
        calories: 374,
        protein: 15,
        carbs: 74.7,
        fat: 2,
        fiber: 0,
        sodium: 150,
        vitaminB12: 0,
        vitaminD: 0,
        iron: 0,
        calcium: 200
    },
    servings: [
        {
            id: "scoop",
            label: "1 scoop (150g)",
            grams: 150
        },
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
        "nonveg"
    ],
    tags: [
        "muscle-building",
        "bulking",
        "high-calorie"
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
    gi: 15,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: "FSSAI-label",
    confidence: "high"
}  ,
  {
    id: "mb-super-gainer-xxl",
    name: "MuscleBlaze Super Gainer XXL",
    nameAlt: [
        "mb super gainer"
    ],
    searchTerms: [
        "muscleblaze",
        "mb super gainer",
        "whey",
        "protein",
        "MuscleBlaze"
    ],
    category: "supplement",
    subcategory: "mass-gainer",
    itemType: "supplement",
    state: "raw",
    region: "pan-indian",
    brand: "MuscleBlaze",
    productLine: "Super Gainer XXL",
    scoopWeightG: 75,
    proteinType: "concentrate",
    bcaaG: null,
    eaaG: null,
    certifications: [],
    priceINR: 1699,
    originCountry: "India",
    defaultServingGrams: 75,
    per100g: {
        calories: 373,
        protein: 20,
        carbs: 70.7,
        fat: 2.7,
        fiber: 0,
        sodium: 150,
        vitaminB12: 0,
        vitaminD: 0,
        iron: 0,
        calcium: 200
    },
    servings: [
        {
            id: "scoop",
            label: "1 scoop (75g)",
            grams: 75
        },
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
        "nonveg"
    ],
    tags: [
        "muscle-building",
        "bulking",
        "high-calorie"
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
    gi: 15,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: "FSSAI-label",
    confidence: "high"
}  ,
  {
    id: "mb-lean-mass-gainer",
    name: "MuscleBlaze High Protein Lean Mass Gainer",
    nameAlt: [
        "mb lean mass"
    ],
    searchTerms: [
        "muscleblaze",
        "mb lean mass",
        "whey",
        "protein",
        "MuscleBlaze"
    ],
    category: "supplement",
    subcategory: "lean-mass-gainer",
    itemType: "supplement",
    state: "raw",
    region: "pan-indian",
    brand: "MuscleBlaze",
    productLine: "Lean Mass Gainer",
    scoopWeightG: 75,
    proteinType: "concentrate",
    bcaaG: 6.5,
    eaaG: null,
    certifications: [],
    priceINR: 2799,
    originCountry: "India",
    defaultServingGrams: 75,
    per100g: {
        calories: 393,
        protein: 40,
        carbs: 62.7,
        fat: 2.7,
        fiber: 0,
        sodium: 150,
        vitaminB12: 0,
        vitaminD: 0,
        iron: 0,
        calcium: 200
    },
    servings: [
        {
            id: "scoop",
            label: "1 scoop (75g)",
            grams: 75
        },
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
        "nonveg"
    ],
    tags: [
        "muscle-building"
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
    gi: 15,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: "FSSAI-label",
    confidence: "high"
}  ,
  {
    id: "asitis-atom-mass-gainer",
    name: "AS-IT-IS ATOM Mass Gainer",
    nameAlt: [
        "asitis mass gainer"
    ],
    searchTerms: [
        "as-it-is",
        "asitis mass gainer",
        "whey",
        "protein",
        "AS-IT-IS"
    ],
    category: "supplement",
    subcategory: "mass-gainer",
    itemType: "supplement",
    state: "raw",
    region: "pan-indian",
    brand: "AS-IT-IS",
    productLine: "ATOM Mass Gainer",
    scoopWeightG: 100,
    proteinType: "concentrate",
    bcaaG: null,
    eaaG: null,
    certifications: [],
    priceINR: 2199,
    originCountry: "India",
    defaultServingGrams: 100,
    per100g: {
        calories: 384,
        protein: 25,
        carbs: 63,
        fat: 4,
        fiber: 0,
        sodium: 150,
        vitaminB12: 0,
        vitaminD: 0,
        iron: 0,
        calcium: 200
    },
    servings: [
        {
            id: "scoop",
            label: "1 scoop (100g)",
            grams: 100
        },
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
        "nonveg"
    ],
    tags: [
        "muscle-building",
        "bulking",
        "high-calorie"
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
    gi: 15,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: "FSSAI-label",
    confidence: "high"
}  ,
  {
    id: "on-serious-mass",
    name: "Optimum Nutrition Serious Mass",
    nameAlt: [
        "on serious mass"
    ],
    searchTerms: [
        "optimum nutrition",
        "on serious mass",
        "whey",
        "protein",
        "Optimum Nutrition"
    ],
    category: "supplement",
    subcategory: "mass-gainer",
    itemType: "supplement",
    state: "raw",
    region: "pan-indian",
    brand: "Optimum Nutrition",
    productLine: "Serious Mass",
    scoopWeightG: 334,
    proteinType: "concentrate",
    bcaaG: null,
    eaaG: null,
    certifications: [],
    priceINR: null,
    originCountry: "4499",
    defaultServingGrams: 334,
    per100g: {
        calories: 377,
        protein: 15,
        carbs: 75.7,
        fat: 1.3,
        fiber: 0,
        sodium: 150,
        vitaminB12: 0,
        vitaminD: 0,
        iron: 0,
        calcium: 200
    },
    servings: [
        {
            id: "scoop",
            label: "1 scoop (334g)",
            grams: 334
        },
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
        "nonveg"
    ],
    tags: [
        "muscle-building",
        "bulking",
        "high-calorie"
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
    gi: 15,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: "FSSAI-label",
    confidence: "high"
}  ,
  {
    id: "on-serious-mass-half",
    name: "Optimum Nutrition Serious Mass (Half Serving)",
    nameAlt: [
        "on serious mass half"
    ],
    searchTerms: [
        "optimum nutrition",
        "on serious mass half",
        "whey",
        "protein",
        "Optimum Nutrition"
    ],
    category: "supplement",
    subcategory: "mass-gainer",
    itemType: "supplement",
    state: "raw",
    region: "pan-indian",
    brand: "Optimum Nutrition",
    productLine: "Serious Mass",
    scoopWeightG: 167,
    proteinType: "concentrate",
    bcaaG: null,
    eaaG: null,
    certifications: [],
    priceINR: null,
    originCountry: "4499",
    defaultServingGrams: 167,
    per100g: {
        calories: 377,
        protein: 15,
        carbs: 75.7,
        fat: 1.3,
        fiber: 0,
        sodium: 150,
        vitaminB12: 0,
        vitaminD: 0,
        iron: 0,
        calcium: 200
    },
    servings: [
        {
            id: "scoop",
            label: "1 scoop (167g)",
            grams: 167
        },
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
        "nonveg"
    ],
    tags: [
        "muscle-building",
        "bulking",
        "high-calorie"
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
    gi: 15,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: "FSSAI-label",
    confidence: "high"
}  ,
  {
    id: "labrada-muscle-mass-gainer",
    name: "Labrada Muscle Mass Gainer",
    nameAlt: [
        "labrada mass gainer"
    ],
    searchTerms: [
        "labrada",
        "labrada mass gainer",
        "whey",
        "protein",
        "Labrada"
    ],
    category: "supplement",
    subcategory: "mass-gainer",
    itemType: "supplement",
    state: "raw",
    region: "pan-indian",
    brand: "Labrada",
    productLine: "Muscle Mass Gainer",
    scoopWeightG: 336,
    proteinType: "concentrate",
    bcaaG: null,
    eaaG: null,
    certifications: [],
    priceINR: null,
    originCountry: "6999",
    defaultServingGrams: 336,
    per100g: {
        calories: 370,
        protein: 15.5,
        carbs: 74.7,
        fat: 2.4,
        fiber: 0,
        sodium: 150,
        vitaminB12: 0,
        vitaminD: 0,
        iron: 0,
        calcium: 200
    },
    servings: [
        {
            id: "scoop",
            label: "1 scoop (336g)",
            grams: 336
        },
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
        "nonveg"
    ],
    tags: [
        "muscle-building",
        "bulking",
        "high-calorie"
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
    gi: 15,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: "FSSAI-label",
    confidence: "high"
}  ,
  {
    id: "muscletech-mass-tech-extreme",
    name: "MuscleTech Mass Tech Extreme 2000",
    nameAlt: [
        "masstech extreme"
    ],
    searchTerms: [
        "muscletech",
        "masstech extreme",
        "whey",
        "protein",
        "MuscleTech"
    ],
    category: "supplement",
    subcategory: "mass-gainer",
    itemType: "supplement",
    state: "raw",
    region: "pan-indian",
    brand: "MuscleTech",
    productLine: "Mass Tech Extreme 2000",
    scoopWeightG: 334,
    proteinType: "concentrate",
    bcaaG: null,
    eaaG: null,
    certifications: [],
    priceINR: null,
    originCountry: "9999",
    defaultServingGrams: 334,
    per100g: {
        calories: 599,
        protein: 24,
        carbs: 119.8,
        fat: 3,
        fiber: 0,
        sodium: 150,
        vitaminB12: 0,
        vitaminD: 0,
        iron: 0,
        calcium: 200
    },
    servings: [
        {
            id: "scoop",
            label: "1 scoop (334g)",
            grams: 334
        },
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
        "nonveg"
    ],
    tags: [
        "muscle-building",
        "bulking",
        "high-calorie",
        "extreme-calories",
        "advanced-only"
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
    gi: 15,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: "FSSAI-label",
    confidence: "high"
}  ,
  {
    id: "gnc-pro-performance-weight-gainer",
    name: "GNC Pro Performance Weight Gainer",
    nameAlt: [
        "gnc mass gainer"
    ],
    searchTerms: [
        "gnc",
        "gnc mass gainer",
        "whey",
        "protein",
        "GNC"
    ],
    category: "supplement",
    subcategory: "mass-gainer",
    itemType: "supplement",
    state: "raw",
    region: "pan-indian",
    brand: "GNC",
    productLine: "Pro Performance",
    scoopWeightG: 315,
    proteinType: "concentrate",
    bcaaG: null,
    eaaG: null,
    certifications: [],
    priceINR: null,
    originCountry: "8999",
    defaultServingGrams: 315,
    per100g: {
        calories: 508,
        protein: 16.8,
        carbs: 120.6,
        fat: 4.8,
        fiber: 0,
        sodium: 150,
        vitaminB12: 0,
        vitaminD: 0,
        iron: 0,
        calcium: 200
    },
    servings: [
        {
            id: "scoop",
            label: "1 scoop (315g)",
            grams: 315
        },
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
        "nonveg"
    ],
    tags: [
        "muscle-building",
        "bulking",
        "high-calorie",
        "extreme-calories",
        "advanced-only"
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
    gi: 15,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: "FSSAI-label",
    confidence: "high"
}  ,
  {
    id: "bsn-true-mass-1200",
    name: "BSN True Mass 1200",
    nameAlt: [
        "bsn true mass"
    ],
    searchTerms: [
        "bsn",
        "bsn true mass",
        "whey",
        "protein",
        "BSN"
    ],
    category: "supplement",
    subcategory: "mass-gainer",
    itemType: "supplement",
    state: "raw",
    region: "pan-indian",
    brand: "BSN",
    productLine: "True Mass 1200",
    scoopWeightG: 254,
    proteinType: "concentrate",
    bcaaG: null,
    eaaG: null,
    certifications: [],
    priceINR: null,
    originCountry: "7999",
    defaultServingGrams: 254,
    per100g: {
        calories: 476,
        protein: 19.7,
        carbs: 84.6,
        fat: 6.7,
        fiber: 0,
        sodium: 150,
        vitaminB12: 0,
        vitaminD: 0,
        iron: 0,
        calcium: 200
    },
    servings: [
        {
            id: "scoop",
            label: "1 scoop (254g)",
            grams: 254
        },
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
        "nonveg"
    ],
    tags: [
        "muscle-building",
        "bulking",
        "high-calorie"
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
    gi: 15,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: "FSSAI-label",
    confidence: "high"
}
];
