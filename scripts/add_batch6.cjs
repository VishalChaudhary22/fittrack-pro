const batch6OilsFats = [
  {
    id: 'ghee-cow', name: 'Ghee (Cow)', nameAlt: ['clarified butter', 'desi ghee'], hindiName: 'देसी घी', searchTerms: ['ghee', 'desi ghee', 'butter oil'],
    category: 'oil-fat', subcategory: 'animal-fat', itemType: 'base-food', state: 'raw', region: 'pan-indian', defaultServingGrams: 15,
    per100g: { calories: 900, protein: 0, carbs: 0, fat: 100, fiber: 0, sodium: 0, vitaminB12: 0, vitaminD: 0, iron: 0, calcium: 0 },
    servings: [{ id: 'tbsp', label: '1 tbsp', grams: 15 }, { id: 'g100', label: '100g', grams: 100 }],
    dietTypes: ['veg', 'jain', 'nonveg'], tags: ['high-fat', 'high-calorie'],
    isProcessed: false, isFastingFood: true, fastingTypes: ['navratri', 'ekadashi', 'jain-paryushana'], isGlutenFree: true, isRecipe: false, containsRootVeg: false, hasBeverageModifiers: false, supportedConsistencyTypes: [], consistencyMultipliers: {}, gi: 0, cookingOilNote: null, estimatedOilG: 0, source: 'USDA', confidence: 'high'
  },
  {
    id: 'coconut-oil', name: 'Coconut Oil', nameAlt: ['nariyal tel'], hindiName: 'नारियल तेल', searchTerms: ['coconut oil', 'nariyal tel'],
    category: 'oil-fat', subcategory: 'plant-fat', itemType: 'base-food', state: 'raw', region: 'south', defaultServingGrams: 15,
    per100g: { calories: 862, protein: 0, carbs: 0, fat: 100, fiber: 0, sodium: 0, vitaminB12: 0, vitaminD: 0, iron: 0, calcium: 0 },
    servings: [{ id: 'tbsp', label: '1 tbsp', grams: 15 }, { id: 'g100', label: '100g', grams: 100 }],
    dietTypes: ['vegan', 'veg', 'jain', 'nonveg'], tags: ['high-fat'],
    isProcessed: false, isFastingFood: true, fastingTypes: ['navratri', 'ekadashi', 'jain-paryushana'], isGlutenFree: true, isRecipe: false, containsRootVeg: false, hasBeverageModifiers: false, supportedConsistencyTypes: [], consistencyMultipliers: {}, gi: 0, cookingOilNote: null, estimatedOilG: 0, source: 'USDA', confidence: 'high'
  },
  {
    id: 'mustard-oil', name: 'Mustard Oil', nameAlt: ['sarson ka tel'], hindiName: 'सरसों का तेल', searchTerms: ['mustard oil', 'sarson'],
    category: 'oil-fat', subcategory: 'plant-fat', itemType: 'base-food', state: 'raw', region: 'north', defaultServingGrams: 15,
    per100g: { calories: 884, protein: 0, carbs: 0, fat: 100, fiber: 0, sodium: 0, vitaminB12: 0, vitaminD: 0, iron: 0, calcium: 0 },
    servings: [{ id: 'tbsp', label: '1 tbsp', grams: 15 }, { id: 'g100', label: '100g', grams: 100 }],
    dietTypes: ['vegan', 'veg', 'jain', 'nonveg'], tags: ['high-fat'],
    isProcessed: false, isFastingFood: false, fastingTypes: [], isGlutenFree: true, isRecipe: false, containsRootVeg: false, hasBeverageModifiers: false, supportedConsistencyTypes: [], consistencyMultipliers: {}, gi: 0, cookingOilNote: null, estimatedOilG: 0, source: 'USDA', confidence: 'high'
  },
  {
    id: 'sunflower-oil', name: 'Sunflower Oil / Refined Oil', nameAlt: ['refined oil'], hindiName: 'रिफाइंड तेल', searchTerms: ['sunflower oil', 'refined', 'oil', 'saffola'],
    category: 'oil-fat', subcategory: 'plant-fat', itemType: 'base-food', state: 'raw', region: 'pan-indian', defaultServingGrams: 15,
    per100g: { calories: 884, protein: 0, carbs: 0, fat: 100, fiber: 0, sodium: 0, vitaminB12: 0, vitaminD: 0, iron: 0, calcium: 0 },
    servings: [{ id: 'tbsp', label: '1 tbsp', grams: 15 }, { id: 'g100', label: '100g', grams: 100 }],
    dietTypes: ['vegan', 'veg', 'jain', 'nonveg'], tags: ['high-fat'],
    isProcessed: true, isFastingFood: true, fastingTypes: ['jain-paryushana'], isGlutenFree: true, isRecipe: false, containsRootVeg: false, hasBeverageModifiers: false, supportedConsistencyTypes: [], consistencyMultipliers: {}, gi: 0, cookingOilNote: null, estimatedOilG: 0, source: 'USDA', confidence: 'high'
  },
  {
    id: 'olive-oil', name: 'Olive Oil', nameAlt: ["jaitun ka tel"], hindiName: 'जैतून का तेल', searchTerms: ['olive', 'oil'],
    category: 'oil-fat', subcategory: 'plant-fat', itemType: 'base-food', state: 'raw', region: 'pan-indian', defaultServingGrams: 15,
    per100g: { calories: 884, protein: 0, carbs: 0, fat: 100, fiber: 0, sodium: 0, vitaminB12: 0, vitaminD: 0, iron: 0, calcium: 0 },
    servings: [{ id: 'tbsp', label: '1 tbsp', grams: 15 }, { id: 'g100', label: '100g', grams: 100 }],
    dietTypes: ['vegan', 'veg', 'jain', 'nonveg'], tags: ['high-fat', 'healthy-fats'],
    isProcessed: false, isFastingFood: false, fastingTypes: [], isGlutenFree: true, isRecipe: false, containsRootVeg: false, hasBeverageModifiers: false, supportedConsistencyTypes: [], consistencyMultipliers: {}, gi: 0, cookingOilNote: null, estimatedOilG: 0, source: 'USDA', confidence: 'high'
  },
  {
    id: 'butter-amul', name: 'Butter (Salted, e.g. Amul)', nameAlt: ['makhan', 'makkhan'], hindiName: 'मक्खन', searchTerms: ['butter', 'amul', 'makhan'],
    category: 'oil-fat', subcategory: 'animal-fat', itemType: 'base-food', state: 'raw', region: 'pan-indian', defaultServingGrams: 14,
    per100g: { calories: 717, protein: 0.9, carbs: 0.1, fat: 81.1, fiber: 0, sodium: 643, vitaminB12: 0.2, vitaminD: 60, iron: 0, calcium: 24 },
    servings: [{ id: 'tbsp', label: '1 pat / slice', grams: 14 }, { id: 'g100', label: '100g', grams: 100 }],
    dietTypes: ['veg', 'jain', 'nonveg'], tags: ['high-fat', 'high-calorie'],
    isProcessed: true, isFastingFood: false, fastingTypes: [], isGlutenFree: true, isRecipe: false, containsRootVeg: false, hasBeverageModifiers: false, supportedConsistencyTypes: [], consistencyMultipliers: {}, gi: 0, cookingOilNote: null, estimatedOilG: 0, source: 'USDA', confidence: 'high'
  },
  {
    id: 'malai-cream', name: 'Fresh Cream / Malai', nameAlt: ['amul cream'], hindiName: 'मलाई', searchTerms: ['cream', 'malai', 'fresh cream'],
    category: 'oil-fat', subcategory: 'animal-fat', itemType: 'base-food', state: 'raw', region: 'pan-indian', defaultServingGrams: 15,
    per100g: { calories: 345, protein: 2.1, carbs: 2.8, fat: 37.0, fiber: 0, sodium: 40, vitaminB12: 0.2, vitaminD: 10, iron: 0, calcium: 80 },
    servings: [{ id: 'tbsp', label: '1 tbsp', grams: 15 }, { id: 'g100', label: '100g', grams: 100 }],
    dietTypes: ['veg', 'jain', 'nonveg'], tags: ['high-fat'],
    isProcessed: false, isFastingFood: true, fastingTypes: ['navratri', 'ekadashi'], isGlutenFree: true, isRecipe: false, containsRootVeg: false, hasBeverageModifiers: false, supportedConsistencyTypes: [], consistencyMultipliers: {}, gi: 0, cookingOilNote: null, estimatedOilG: 0, source: 'IFCT-2017', confidence: 'high'
  },
  {
    id: 'mayonnaise', name: 'Mayonnaise (Veg)', nameAlt: ['mayo'], hindiName: 'मेयोनेज़', searchTerms: ['mayo', 'mayonnaise', 'dip'],
    category: 'oil-fat', subcategory: 'condiment', itemType: 'base-food', state: 'raw', region: 'pan-indian', defaultServingGrams: 15,
    per100g: { calories: 340, protein: 0.5, carbs: 12.0, fat: 32.0, fiber: 0, sodium: 600, vitaminB12: 0, vitaminD: 0, iron: 0, calcium: 10 },
    servings: [{ id: 'tbsp', label: '1 tbsp', grams: 15 }, { id: 'g100', label: '100g', grams: 100 }],
    dietTypes: ['veg', 'jain', 'nonveg'], tags: ['high-fat', 'processed'],
    isProcessed: true, isFastingFood: false, fastingTypes: [], isGlutenFree: true, isRecipe: false, containsRootVeg: false, hasBeverageModifiers: false, supportedConsistencyTypes: [], consistencyMultipliers: {}, gi: 0, cookingOilNote: null, estimatedOilG: 0, source: 'FSSAI-label', confidence: 'high'
  },
  {
    id: 'peanut-butter', name: 'Peanut Butter (Unsweetened)', nameAlt: ['pb'], hindiName: 'पीनट बटर', searchTerms: ['peanut butter', 'pb', 'pintola', 'myfitness'],
    category: 'oil-fat', subcategory: 'nut-butter', itemType: 'base-food', state: 'raw', region: 'pan-indian', defaultServingGrams: 32,
    per100g: { calories: 598, protein: 25.0, carbs: 22.0, fat: 51.0, fiber: 8.0, sodium: 17, vitaminB12: 0, vitaminD: 0, iron: 2.0, calcium: 43 },
    servings: [{ id: 'tbsp', label: '1 tbsp', grams: 16 }, { id: 'custom', label: 'Custom (g)', grams: 1 }, { id: 'g100', label: '100g', grams: 100 }],
    dietTypes: ['vegan', 'veg', 'jain', 'nonveg'], tags: ['muscle-building', 'high-protein', 'high-fat', 'healthy-fats'],
    isProcessed: false, isFastingFood: false, fastingTypes: [], isGlutenFree: true, isRecipe: false, containsRootVeg: false, hasBeverageModifiers: false, supportedConsistencyTypes: [], consistencyMultipliers: {}, gi: 15, cookingOilNote: null, estimatedOilG: 0, source: 'USDA', confidence: 'high'
  },
  {
    id: 'almond-butter', name: 'Almond Butter (Unsweetened)', nameAlt: ['badam butter'], hindiName: 'बादाम बटर', searchTerms: ['almond butter', 'badam butter', 'spread'],
    category: 'oil-fat', subcategory: 'nut-butter', itemType: 'base-food', state: 'raw', region: 'pan-indian', defaultServingGrams: 32,
    per100g: { calories: 614, protein: 21.0, carbs: 18.0, fat: 55.0, fiber: 10.0, sodium: 0, vitaminB12: 0, vitaminD: 0, iron: 3.5, calcium: 350 },
    servings: [{ id: 'tbsp', label: '1 tbsp', grams: 16 }, { id: 'g100', label: '100g', grams: 100 }],
    dietTypes: ['vegan', 'veg', 'jain', 'nonveg'], tags: ['healthy-fats', 'high-protein'],
    isProcessed: false, isFastingFood: false, fastingTypes: [], isGlutenFree: true, isRecipe: false, containsRootVeg: false, hasBeverageModifiers: false, supportedConsistencyTypes: [], consistencyMultipliers: {}, gi: 15, cookingOilNote: null, estimatedOilG: 0, source: 'USDA', confidence: 'high'
  }
];

const batch6Condiments = [
  {
    id: 'green-chutney', name: 'Green Chutney (Mint/Coriander)', nameAlt: ['pudina chutney', 'hari chutney'], hindiName: 'हरी चटनी', searchTerms: ['green chutney', 'pudina', 'hari chutney', 'mint'],
    category: 'condiment', subcategory: 'chutney', itemType: 'dish', state: 'raw', region: 'pan-indian', defaultServingGrams: 30,
    per100g: { calories: 45, protein: 2.0, carbs: 6.0, fat: 1.5, fiber: 2.5, sodium: 300, vitaminB12: 0, vitaminD: 0, iron: 3.0, calcium: 50 },
    servings: [{ id: 'tbsp', label: '1 tbsp', grams: 15 }, { id: 'katori', label: '1 katori (small)', grams: 50 }, { id: 'g100', label: '100g', grams: 100 }],
    dietTypes: ['vegan', 'veg', 'nonveg'], tags: ['low-calorie'],
    isProcessed: false, isFastingFood: false, fastingTypes: [], isGlutenFree: true, isRecipe: false, containsRootVeg: true,  hasBeverageModifiers: false, supportedConsistencyTypes: [], consistencyMultipliers: {}, gi: 0, cookingOilNote: null, estimatedOilG: 0, source: 'healthifyme', confidence: 'medium', notes: 'Almost always contains garlic and sometimes onion.'
  },
  {
    id: 'imli-chutney', name: 'Tamarind Chutney (Meethi Imli)', nameAlt: ['meethi chutney'], hindiName: 'इमली की चटनी', searchTerms: ['tamarind', 'imli', 'meethi chutney', 'sweet chutney'],
    category: 'condiment', subcategory: 'chutney', itemType: 'dish', state: 'cooked', region: 'pan-indian', defaultServingGrams: 30,
    per100g: { calories: 180, protein: 1.0, carbs: 43.0, fat: 0.5, fiber: 3.0, sodium: 250, vitaminB12: 0, vitaminD: 0, iron: 1.5, calcium: 30 },
    servings: [{ id: 'tbsp', label: '1 tbsp', grams: 15 }, { id: 'g100', label: '100g', grams: 100 }],
    dietTypes: ['vegan', 'veg', 'jain', 'nonveg'], tags: ['high-sugar'],
    isProcessed: false, isFastingFood: false, fastingTypes: [], isGlutenFree: true, isRecipe: false, containsRootVeg: false, hasBeverageModifiers: false, supportedConsistencyTypes: [], consistencyMultipliers: {}, gi: 60, cookingOilNote: null, estimatedOilG: 0, source: 'healthifyme', confidence: 'medium', notes: 'Very high sugar/jaggery content.'
  },
  {
    id: 'pickle-mango', name: 'Mango Pickle (Aam ka Achar)', nameAlt: ['aam ka achar'], hindiName: 'आम का आचार', searchTerms: ['pickle', 'achar', 'mango'],
    category: 'condiment', subcategory: 'pickle', itemType: 'dish', state: 'raw', region: 'pan-indian', defaultServingGrams: 15,
    per100g: { calories: 250, protein: 1.5, carbs: 12.0, fat: 22.0, fiber: 3.0, sodium: 1200, vitaminB12: 0, vitaminD: 0, iron: 2.0, calcium: 40 },
    servings: [{ id: 'tbsp', label: '1 tbsp', grams: 15 }, { id: 'g100', label: '100g', grams: 100 }],
    dietTypes: ['vegan', 'veg', 'jain', 'nonveg'], tags: ['high-fat', 'high-sodium'],
    isProcessed: true, isFastingFood: false, fastingTypes: [], isGlutenFree: true, isRecipe: false, containsRootVeg: false, hasBeverageModifiers: false, supportedConsistencyTypes: [], consistencyMultipliers: {}, gi: 0, cookingOilNote: 'Contains significant mustard/sesame oil.', estimatedOilG: 10, source: 'healthifyme', confidence: 'medium'
  },
  {
    id: 'pickle-lemon', name: 'Lemon Pickle (Nimbu ka Achar)', nameAlt: ['nimbu ka achar'], hindiName: 'नींबू का आचार', searchTerms: ['pickle', 'achar', 'nimbu', 'lemon'],
    category: 'condiment', subcategory: 'pickle', itemType: 'dish', state: 'raw', region: 'pan-indian', defaultServingGrams: 15,
    per100g: { calories: 150, protein: 1.0, carbs: 25.0, fat: 5.0, fiber: 4.0, sodium: 1400, vitaminB12: 0, vitaminD: 0, iron: 1.5, calcium: 30 },
    servings: [{ id: 'tbsp', label: '1 tbsp', grams: 15 }, { id: 'g100', label: '100g', grams: 100 }],
    dietTypes: ['vegan', 'veg', 'jain', 'nonveg'], tags: ['high-sodium'],
    isProcessed: true, isFastingFood: false, fastingTypes: [], isGlutenFree: true, isRecipe: false, containsRootVeg: false, hasBeverageModifiers: false, supportedConsistencyTypes: [], consistencyMultipliers: {}, gi: 0, cookingOilNote: null, estimatedOilG: 2, source: 'healthifyme', confidence: 'medium', notes: 'Often oil-free or low-oil compared to mango pickle, but high in sugar/salt.'
  },
  {
    id: 'pickle-mixed', name: 'Mixed Pickle (Panchranga)', nameAlt: ['mixed achar'], hindiName: 'मिक्स आचार', searchTerms: ['pickle', 'achar', 'mixed', 'panchranga'],
    category: 'condiment', subcategory: 'pickle', itemType: 'dish', state: 'raw', region: 'pan-indian', defaultServingGrams: 15,
    per100g: { calories: 230, protein: 1.5, carbs: 14.0, fat: 19.0, fiber: 3.5, sodium: 1300, vitaminB12: 0, vitaminD: 0, iron: 2.0, calcium: 40 },
    servings: [{ id: 'tbsp', label: '1 tbsp', grams: 15 }, { id: 'g100', label: '100g', grams: 100 }],
    dietTypes: ['vegan', 'veg', 'nonveg'], tags: ['high-sodium', 'high-fat'],
    isProcessed: true, isFastingFood: false, fastingTypes: [], isGlutenFree: true, isRecipe: false, containsRootVeg: true,  hasBeverageModifiers: false, supportedConsistencyTypes: [], consistencyMultipliers: {}, gi: 0, cookingOilNote: 'Contains significant oil.', estimatedOilG: 8, source: 'healthifyme', confidence: 'medium', notes: 'Contains carrot and ginger.'
  },
  {
    id: 'raita-cucumber', name: 'Cucumber Raita', nameAlt: ['kheera raita'], hindiName: 'खीरा रायता', searchTerms: ['raita', 'cucumber', 'kheera', 'curd dip'],
    category: 'condiment', subcategory: 'raita', itemType: 'dish', state: 'raw', region: 'pan-indian', defaultServingGrams: 150,
    per100g: { calories: 45, protein: 2.5, carbs: 4.5, fat: 2.0, fiber: 0.5, sodium: 150, vitaminB12: 0.2, vitaminD: 0, iron: 0.2, calcium: 80 },
    servings: [{ id: 'katori', label: '1 katori', grams: 150 }, { id: 'g100', label: '100g', grams: 100 }],
    dietTypes: ['veg', 'jain', 'nonveg'], tags: ['low-calorie', 'cooling', 'calcium-rich'],
    isProcessed: false, isFastingFood: true, fastingTypes: ['navratri', 'ekadashi', 'ramzan'], isGlutenFree: true, isRecipe: false, containsRootVeg: false, hasBeverageModifiers: false, supportedConsistencyTypes: [], consistencyMultipliers: {}, gi: 25, cookingOilNote: null, estimatedOilG: 0, source: 'healthifyme', confidence: 'high'
  },
  {
    id: 'raita-boondi', name: 'Boondi Raita', nameAlt: [], hindiName: 'बूंदी रायता', searchTerms: ['raita', 'boondi', 'curd dip'],
    category: 'condiment', subcategory: 'raita', itemType: 'dish', state: 'raw', region: 'north', defaultServingGrams: 150,
    per100g: { calories: 90, protein: 3.5, carbs: 8.0, fat: 4.5, fiber: 0.5, sodium: 180, vitaminB12: 0.2, vitaminD: 0, iron: 0.5, calcium: 85 },
    servings: [{ id: 'katori', label: '1 katori', grams: 150 }, { id: 'g100', label: '100g', grams: 100 }],
    dietTypes: ['veg', 'jain', 'nonveg'], tags: ['calcium-rich'],
    isProcessed: false, isFastingFood: false, fastingTypes: [], isGlutenFree: true, isRecipe: false, containsRootVeg: false, hasBeverageModifiers: false, supportedConsistencyTypes: [], consistencyMultipliers: {}, gi: 40, cookingOilNote: 'Boondi is deep dried before adding to curd.', estimatedOilG: 2, source: 'healthifyme', confidence: 'high'
  },
  {
    id: 'papad-roasted', name: 'Papad (Roasted)', nameAlt: ['pappadum'], hindiName: 'पापड़ (भुना हुआ)', searchTerms: ['papad', 'roasted', 'pappadum'],
    category: 'condiment', subcategory: 'crisp', itemType: 'dish', state: 'roasted', region: 'pan-indian', defaultServingGrams: 15, // 1 medium papad
    per100g: { calories: 370, protein: 25.0, carbs: 60.0, fat: 3.0, fiber: 5.0, sodium: 1500, vitaminB12: 0, vitaminD: 0, iron: 5.0, calcium: 80 },
    servings: [{ id: 'piece', label: '1 medium papad', grams: 15 }, { id: 'g100', label: '100g', grams: 100 }],
    dietTypes: ['vegan', 'veg', 'jain', 'nonveg'], tags: ['low-calorie', 'high-sodium'],
    isProcessed: false, isFastingFood: false, fastingTypes: [], isGlutenFree: true, isRecipe: false, containsRootVeg: false, hasBeverageModifiers: false, supportedConsistencyTypes: [], consistencyMultipliers: {}, gi: 50, cookingOilNote: null, estimatedOilG: 0, source: 'USDA', confidence: 'medium', notes: 'Almost 55 calories per piece.'
  },
  {
    id: 'papad-fried', name: 'Papad (Fried)', nameAlt: ['fried pappadum'], hindiName: 'पापड़ (तला हुआ)', searchTerms: ['papad', 'fried', 'pappadum'],
    category: 'condiment', subcategory: 'crisp', itemType: 'dish', state: 'fried', region: 'pan-indian', defaultServingGrams: 20, // absorbs oil
    per100g: { calories: 510, protein: 20.0, carbs: 48.0, fat: 26.0, fiber: 4.0, sodium: 1200, vitaminB12: 0, vitaminD: 0, iron: 4.0, calcium: 65 },
    servings: [{ id: 'piece', label: '1 medium papad (fried)', grams: 20 }, { id: 'g100', label: '100g', grams: 100 }],
    dietTypes: ['vegan', 'veg', 'jain', 'nonveg'], tags: ['high-fat'],
    isProcessed: false, isFastingFood: false, fastingTypes: [], isGlutenFree: true, isRecipe: false, containsRootVeg: false, hasBeverageModifiers: false, supportedConsistencyTypes: [], consistencyMultipliers: {}, gi: 50, cookingOilNote: 'Deep fried', estimatedOilG: 5, source: 'USDA', confidence: 'medium'
  },
  {
    id: 'sugar-white', name: 'Sugar (White / Table Sugar)', nameAlt: ['cheeni'], hindiName: 'चीनी', searchTerms: ['sugar', 'cheeni', 'shakar'],
    category: 'condiment', subcategory: 'sweetener', itemType: 'base-food', state: 'raw', region: 'pan-indian', defaultServingGrams: 5, // 1 tsp
    per100g: { calories: 387, protein: 0, carbs: 100, fat: 0, fiber: 0, sodium: 1, vitaminB12: 0, vitaminD: 0, iron: 0, calcium: 1 },
    servings: [{ id: 'tbsp', label: '1 tsp', grams: 5 }, { id: 'tbsp', label: '1 tbsp', grams: 15 }, { id: 'g100', label: '100g', grams: 100 }],
    dietTypes: ['vegan', 'veg', 'jain', 'nonveg'], tags: ['high-sugar'],
    isProcessed: true, isFastingFood: true, fastingTypes: ['navratri', 'ekadashi', 'jain-paryushana'], isGlutenFree: true, isRecipe: false, containsRootVeg: false, hasBeverageModifiers: false, supportedConsistencyTypes: [], consistencyMultipliers: {}, gi: 65, cookingOilNote: null, estimatedOilG: 0, source: 'USDA', confidence: 'high'
  },
  {
    id: 'honey', name: 'Honey', nameAlt: ['shehad'], hindiName: 'शहद', searchTerms: ['honey', 'shehad', 'sweetener'],
    category: 'condiment', subcategory: 'sweetener', itemType: 'base-food', state: 'raw', region: 'pan-indian', defaultServingGrams: 21, // 1 tbsp
    per100g: { calories: 304, protein: 0.3, carbs: 82.4, fat: 0, fiber: 0.2, sodium: 4, vitaminB12: 0, vitaminD: 0, iron: 0.4, calcium: 6 },
    servings: [{ id: 'tbsp', label: '1 tbsp', grams: 21 }, { id: 'tbsp', label: '1 tsp', grams: 7 }, { id: 'g100', label: '100g', grams: 100 }],
    dietTypes: ['veg', 'jain', 'nonveg'], tags: ['high-sugar'],
    isProcessed: false, isFastingFood: true, fastingTypes: ['navratri', 'ekadashi', 'jain-paryushana'], isGlutenFree: true, isRecipe: false, containsRootVeg: false, hasBeverageModifiers: false, supportedConsistencyTypes: [], consistencyMultipliers: {}, gi: 58, cookingOilNote: null, estimatedOilG: 0, source: 'USDA', confidence: 'high'
  },
  {
    id: 'tomato-ketchup', name: 'Tomato Ketchup', nameAlt: ['tomato sauce'], hindiName: 'टोमेटो केचप', searchTerms: ['ketchup', 'sauce', 'tomato'],
    category: 'condiment', subcategory: 'sauce', itemType: 'base-food', state: 'raw', region: 'pan-indian', defaultServingGrams: 15,
    per100g: { calories: 120, protein: 1.0, carbs: 30.0, fat: 0.1, fiber: 0.3, sodium: 900, vitaminB12: 0, vitaminD: 0, iron: 0.4, calcium: 15 },
    servings: [{ id: 'tbsp', label: '1 tbsp', grams: 15 }, { id: 'g100', label: '100g', grams: 100 }],
    dietTypes: ['vegan', 'veg', 'jain', 'nonveg'], tags: ['high-sugar'],
    isProcessed: true, isFastingFood: false, fastingTypes: [], isGlutenFree: true, isRecipe: false, containsRootVeg: true,  hasBeverageModifiers: false, supportedConsistencyTypes: [], consistencyMultipliers: {}, gi: 55, cookingOilNote: null, estimatedOilG: 0, source: 'USDA', confidence: 'high', notes: 'Almost always contains onion/garlic powder.'
  },
  {
    id: 'jaggery', name: 'Jaggery (Gud)', nameAlt: ['gud', 'gur'], hindiName: 'गुड़', searchTerms: ['jaggery', 'gud', 'gur', 'sweetener'],
    category: 'condiment', subcategory: 'sweetener', itemType: 'base-food', state: 'raw', region: 'pan-indian', defaultServingGrams: 10,
    per100g: { calories: 383, protein: 0.4, carbs: 98.0, fat: 0.1, fiber: 0, sodium: 30, vitaminB12: 0, vitaminD: 0, iron: 11.0, calcium: 80 },
    servings: [{ id: 'piece', label: '1 small piece (pingpong ball size)', grams: 25 }, { id: 'tbsp', label: '1 tsp (crushed)', grams: 7 }, { id: 'g100', label: '100g', grams: 100 }],
    dietTypes: ['vegan', 'veg', 'jain', 'nonveg'], tags: ['high-sugar'],
    isProcessed: false, isFastingFood: true, fastingTypes: ['navratri', 'ekadashi', 'jain-paryushana'], isGlutenFree: true, isRecipe: false, containsRootVeg: false, hasBeverageModifiers: false, supportedConsistencyTypes: [], consistencyMultipliers: {}, gi: 65, cookingOilNote: null, estimatedOilG: 0, source: 'IFCT-2017', confidence: 'high', notes: 'Good iron source compared to white sugar.'
  },
  {
    id: 'sendha-namak', name: 'Sendha Namak (Rock Salt)', nameAlt: ['rock salt', 'pink salt', 'vrat ka namak'], hindiName: 'सेंधा नमक', searchTerms: ['sendha namak', 'rock salt', 'salt', 'pink salt'],
    category: 'condiment', subcategory: 'seasoning', itemType: 'base-food', state: 'raw', region: 'pan-indian', defaultServingGrams: 5,
    per100g: { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sodium: 38000, vitaminB12: 0, vitaminD: 0, iron: 0, calcium: 0 },
    servings: [{ id: 'tbsp', label: '1 tsp', grams: 5 }, { id: 'g100', label: '100g', grams: 100 }],
    dietTypes: ['vegan', 'veg', 'jain', 'nonveg'], tags: ['very-high-sodium'],
    isProcessed: false, isFastingFood: true, fastingTypes: ['navratri', 'ekadashi', 'jain-paryushana', 'ramzan'], isGlutenFree: true, isRecipe: false, containsRootVeg: false, hasBeverageModifiers: false, supportedConsistencyTypes: [], consistencyMultipliers: {}, gi: 0, cookingOilNote: null, estimatedOilG: 0, source: 'USDA', confidence: 'high'
  }
];

const batch6SupplementsSoy = [
  {
    id: 'whey-protein', name: 'Whey Protein Concentrate (80%)', nameAlt: ['whey powder', 'protein powder', 'mb whey'], hindiName: 'व्हे प्रोटीन', searchTerms: ['whey', 'protein powder', 'mb', 'muscleblaze', 'on'],
    category: 'supplement', subcategory: 'powder', itemType: 'supplement', state: 'raw', region: 'pan-indian', defaultServingGrams: 33, // typical scoop
    per100g: { calories: 400, protein: 75.0, carbs: 8.0, fat: 6.0, fiber: 0, sodium: 200, vitaminB12: 0, vitaminD: 0, iron: 1.0, calcium: 400 },
    servings: [{ id: 'scoop', label: '1 scoop (~33g)', grams: 33 }, { id: 'g100', label: '100g', grams: 100 }],
    dietTypes: ['veg', 'nonveg'], tags: ['muscle-building', 'very-high-protein', 'post-workout'],
    isProcessed: true, isFastingFood: false, fastingTypes: [], isGlutenFree: true, isRecipe: false, containsRootVeg: false, hasBeverageModifiers: false, supportedConsistencyTypes: [], consistencyMultipliers: {}, gi: 15, cookingOilNote: null, estimatedOilG: 0, source: 'FSSAI-label', confidence: 'high'
  },
  {
    id: 'whey-protein-isolate', name: 'Whey Protein Isolate (90%)', nameAlt: ['whey isolate'], hindiName: 'व्हे प्रोटीन आइसोलेट', searchTerms: ['whey isolate', 'protein powder', 'isolate'],
    category: 'supplement', subcategory: 'powder', itemType: 'supplement', state: 'raw', region: 'pan-indian', defaultServingGrams: 30, // typical scoop
    per100g: { calories: 370, protein: 90.0, carbs: 2.0, fat: 1.0, fiber: 0, sodium: 150, vitaminB12: 0, vitaminD: 0, iron: 0.5, calcium: 300 },
    servings: [{ id: 'scoop', label: '1 scoop (~30g)', grams: 30 }, { id: 'g100', label: '100g', grams: 100 }],
    dietTypes: ['veg', 'nonveg'], tags: ['muscle-building', 'very-high-protein', 'cutting', 'post-workout'],
    isProcessed: true, isFastingFood: false, fastingTypes: [], isGlutenFree: true, isRecipe: false, containsRootVeg: false, hasBeverageModifiers: false, supportedConsistencyTypes: [], consistencyMultipliers: {}, gi: 10, cookingOilNote: null, estimatedOilG: 0, source: 'FSSAI-label', confidence: 'high'
  },
  {
    id: 'casein-protein', name: 'Casein Protein Powder', nameAlt: ['micellar casein'], hindiName: 'कैसिइन प्रोटीन', searchTerms: ['casein', 'protein powder', 'night protein'],
    category: 'supplement', subcategory: 'powder', itemType: 'supplement', state: 'raw', region: 'pan-indian', defaultServingGrams: 30, // typical scoop
    per100g: { calories: 360, protein: 80.0, carbs: 5.0, fat: 1.5, fiber: 0, sodium: 220, vitaminB12: 0, vitaminD: 0, iron: 1.0, calcium: 500 },
    servings: [{ id: 'scoop', label: '1 scoop (~30g)', grams: 30 }, { id: 'g100', label: '100g', grams: 100 }],
    dietTypes: ['veg', 'nonveg'], tags: ['muscle-building', 'very-high-protein', 'before-bed'],
    isProcessed: true, isFastingFood: false, fastingTypes: [], isGlutenFree: true, isRecipe: false, containsRootVeg: false, hasBeverageModifiers: false, supportedConsistencyTypes: [], consistencyMultipliers: {}, gi: 15, cookingOilNote: null, estimatedOilG: 0, source: 'FSSAI-label', confidence: 'high'
  },
  {
    id: 'soy-protein-isolate', name: 'Soy Protein Isolate Powder', nameAlt: ['vegan protein soy'], hindiName: 'सोया प्रोटीन', searchTerms: ['soy protein', 'vegan protein', 'isolate', 'powder'],
    category: 'supplement', subcategory: 'powder', itemType: 'supplement', state: 'raw', region: 'pan-indian', defaultServingGrams: 30,
    per100g: { calories: 380, protein: 88.0, carbs: 2.0, fat: 1.5, fiber: 1.0, sodium: 800, vitaminB12: 0, vitaminD: 0, iron: 14.0, calcium: 150 },
    servings: [{ id: 'scoop', label: '1 scoop (~30g)', grams: 30 }, { id: 'g100', label: '100g', grams: 100 }],
    dietTypes: ['vegan', 'veg', 'jain', 'nonveg'], tags: ['muscle-building', 'very-high-protein', 'post-workout'],
    isProcessed: true, isFastingFood: false, fastingTypes: [], isGlutenFree: true, isRecipe: false, containsRootVeg: false, hasBeverageModifiers: false, supportedConsistencyTypes: [], consistencyMultipliers: {}, gi: 15, cookingOilNote: null, estimatedOilG: 0, source: 'FSSAI-label', confidence: 'medium'
  },
  {
    id: 'mass-gainer', name: 'Mass Gainer Powder', nameAlt: ['weight gainer'], hindiName: 'मास गेनर', searchTerms: ['mass gainer', 'weight gainer', 'powder'],
    category: 'supplement', subcategory: 'powder', itemType: 'supplement', state: 'raw', region: 'pan-indian', defaultServingGrams: 100,
    per100g: { calories: 380, protein: 15.0, carbs: 75.0, fat: 2.5, fiber: 1.0, sodium: 150, vitaminB12: 0, vitaminD: 0, iron: 2.0, calcium: 100 },
    servings: [{ id: 'scoop', label: '1 scoop (~100g)', grams: 100 }, { id: 'g100', label: '100g', grams: 100 }],
    dietTypes: ['veg', 'nonveg'], tags: ['bulking', 'high-carb', 'high-calorie'],
    isProcessed: true, isFastingFood: false, fastingTypes: [], isGlutenFree: true, isRecipe: false, containsRootVeg: false, hasBeverageModifiers: false, supportedConsistencyTypes: [], consistencyMultipliers: {}, gi: 80, cookingOilNote: null, estimatedOilG: 0, source: 'FSSAI-label', confidence: 'high'
  },
  {
    id: 'creatine-monohydrate', name: 'Creatine Monohydrate', nameAlt: ['creatine powder'], hindiName: 'क्रिएटिन', searchTerms: ['creatine', 'monohydrate', 'pre workout'],
    category: 'supplement', subcategory: 'powder', itemType: 'supplement', state: 'raw', region: 'pan-indian', defaultServingGrams: 5,
    per100g: { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sodium: 0, vitaminB12: 0, vitaminD: 0, iron: 0, calcium: 0 },
    servings: [{ id: 'tbsp', label: '1 scoop (5g)', grams: 5 }, { id: 'custom', label: 'Custom (g)', grams: 1 }],
    dietTypes: ['vegan', 'veg', 'jain', 'nonveg'], tags: ['muscle-building', 'pre-workout'],
    isProcessed: true, isFastingFood: true, fastingTypes: ['navratri', 'ekadashi'], isGlutenFree: true, isRecipe: false, containsRootVeg: false, hasBeverageModifiers: false, supportedConsistencyTypes: [], consistencyMultipliers: {}, gi: 0, cookingOilNote: null, estimatedOilG: 0, source: 'USDA', confidence: 'high'
  },
  {
    id: 'bcaa-powder', name: 'BCAA Powder', nameAlt: ['intra workout', 'eaas'], hindiName: 'बीसीएए', searchTerms: ['bcaa', 'amino', 'eaa', 'intra workout'],
    category: 'supplement', subcategory: 'powder', itemType: 'supplement', state: 'raw', region: 'pan-indian', defaultServingGrams: 10,
    per100g: { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sodium: 10, vitaminB12: 0, vitaminD: 0, iron: 0, calcium: 0 },
    servings: [{ id: 'tbsp', label: '1 scoop (10g)', grams: 10 }],
    dietTypes: ['vegan', 'veg', 'jain', 'nonveg'], tags: ['muscle-building'],
    isProcessed: true, isFastingFood: true, fastingTypes: [], isGlutenFree: true, isRecipe: false, containsRootVeg: false, hasBeverageModifiers: false, supportedConsistencyTypes: [], consistencyMultipliers: {}, gi: 0, cookingOilNote: null, estimatedOilG: 0, source: ' USDA', confidence: 'medium', notes: 'Almost 0 calories, pure amino acids.'
  },
  {
    id: 'soya-granules', name: 'Soya Granules (Dry/Raw)', nameAlt: ['soya keema dry', 'minced soya'], hindiName: 'सोया ग्रैन्यूल्स', searchTerms: ['soya', 'granules', 'keema', 'mince'],
    category: 'sprout-soy', subcategory: 'soy', itemType: 'supplement', state: 'raw', region: 'pan-indian', defaultServingGrams: 50,
    per100g: { calories: 345, protein: 52.0, carbs: 33.0, fat: 0.5, fiber: 13.0, sodium: 15, vitaminB12: 0, vitaminD: 0, iron: 15.0, calcium: 350 },
    servings: [{ id: 'katori', label: '1 katori (dry)', grams: 50 }, { id: 'g100', label: '100g', grams: 100 }],
    dietTypes: ['vegan', 'veg', 'jain', 'nonveg'], tags: ['muscle-building', 'very-high-protein', 'budget-friendly'],
    isProcessed: true, isFastingFood: false, fastingTypes: [], isGlutenFree: true, isRecipe: false, containsRootVeg: false, hasBeverageModifiers: false, supportedConsistencyTypes: [], consistencyMultipliers: {}, gi: 15, cookingOilNote: null, estimatedOilG: 0, source: 'FSSAI-label', confidence: 'high'
  },
  {
    id: 'tofu-firm', name: 'Tofu (Firm)', nameAlt: ['soya paneer'], hindiName: 'टोफू', searchTerms: ['tofu', 'soya paneer', 'firm tofu'],
    category: 'sprout-soy', subcategory: 'soy', itemType: 'base-food', state: 'raw', region: 'pan-indian', defaultServingGrams: 100,
    per100g: { calories: 144, protein: 17.0, carbs: 3.0, fat: 8.0, fiber: 2.0, sodium: 15, vitaminB12: 0, vitaminD: 0, iron: 2.7, calcium: 683 },
    servings: [{ id: 'g100', label: '100g', grams: 100 }, { id: 'piece', label: 'half block (~150g)', grams: 150 }],
    dietTypes: ['vegan', 'veg', 'jain', 'nonveg'], tags: ['high-protein', 'muscle-building'],
    isProcessed: true, isFastingFood: false, fastingTypes: [], isGlutenFree: true, isRecipe: false, containsRootVeg: false, hasBeverageModifiers: false, supportedConsistencyTypes: [], consistencyMultipliers: {}, gi: 15, cookingOilNote: null, estimatedOilG: 0, source: 'USDA', confidence: 'high', notes: 'Calcium-set tofu is extremely high in calcium.'
  },
  {
    id: 'tofu-silken', name: 'Tofu (Silken / Soft)', nameAlt: ['soft tofu'], hindiName: 'मुलायम टोफू', searchTerms: ['tofu', 'silken', 'soft'],
    category: 'sprout-soy', subcategory: 'soy', itemType: 'base-food', state: 'raw', region: 'pan-indian', defaultServingGrams: 100,
    per100g: { calories: 55, protein: 4.8, carbs: 2.9, fat: 2.7, fiber: 0.1, sodium: 5, vitaminB12: 0, vitaminD: 0, iron: 1.0, calcium: 110 },
    servings: [{ id: 'g100', label: '100g', grams: 100 }, { id: 'piece', label: 'half block (~150g)', grams: 150 }],
    dietTypes: ['vegan', 'veg', 'jain', 'nonveg'], tags: ['low-calorie', 'high-protein'],
    isProcessed: true, isFastingFood: false, fastingTypes: [], isGlutenFree: true, isRecipe: false, containsRootVeg: false, hasBeverageModifiers: false, supportedConsistencyTypes: [], consistencyMultipliers: {}, gi: 15, cookingOilNote: null, estimatedOilG: 0, source: 'USDA', confidence: 'high'
  },
  {
    id: 'soy-milk', name: 'Soy Milk (Unsweetened)', nameAlt: ['soya milk'], hindiName: 'सोया दूध', searchTerms: ['soy milk', 'soya milk', 'vegan milk'],
    category: 'sprout-soy', subcategory: 'soy-milk', itemType: 'drink', state: 'raw', region: 'pan-indian', defaultServingGrams: 200,
    per100g: { calories: 33, protein: 3.3, carbs: 1.8, fat: 1.8, fiber: 0.6, sodium: 45, vitaminB12: 1.2, vitaminD: 45, iron: 0.4, calcium: 120 },
    servings: [{ id: 'glass', label: '1 glass (200ml)', grams: 200 }, { id: 'g100', label: '100ml', grams: 100 }],
    dietTypes: ['vegan', 'veg', 'jain', 'nonveg'], tags: ['high-protein', 'low-calorie'],
    isProcessed: true, isFastingFood: false, fastingTypes: [], isGlutenFree: true, isRecipe: false, containsRootVeg: false, hasBeverageModifiers: false, supportedConsistencyTypes: [], consistencyMultipliers: {}, gi: 30, cookingOilNote: null, estimatedOilG: 0, source: 'USDA', confidence: 'high', notes: 'Almost always fortified with B12, D3 and Calcium in India (e.g. Sofit, So Good).'
  },
  {
    id: 'protein-bar', name: 'Protein Bar (e.g. RiteBite/Yoga Bar)', nameAlt: ['max protein bar'], hindiName: 'प्रोटीन बार', searchTerms: ['protein bar', 'ritebite', 'yoga bar', 'nutrition bar'],
    category: 'supplement', subcategory: 'bar', itemType: 'snack', state: 'raw', region: 'pan-indian', defaultServingGrams: 50,
    per100g: { calories: 380, protein: 30.0, carbs: 45.0, fat: 10.0, fiber: 15.0, sodium: 200, vitaminB12: 1.0, vitaminD: 100, iron: 5.0, calcium: 150 },
    servings: [{ id: 'piece', label: '1 Bar (50g)', grams: 50 }, { id: 'piece', label: 'Large Bar (70g)', grams: 70 }],
    dietTypes: ['veg', 'nonveg'], tags: ['snack', 'high-protein', 'processed'],
    isProcessed: true, isFastingFood: false, fastingTypes: [], isGlutenFree: true, isRecipe: false, containsRootVeg: false, hasBeverageModifiers: false, supportedConsistencyTypes: [], consistencyMultipliers: {}, gi: 40, cookingOilNote: null, estimatedOilG: 0, source: 'FSSAI-label', confidence: 'medium'
  },
  {
    id: 'soya-chaap-raw', name: 'Soya Chaap (Raw/Stick)', nameAlt: ['soya champ', 'mock meat'], hindiName: 'सोया चाप', searchTerms: ['soya', 'chaap', 'champ', 'stick'],
    category: 'sprout-soy', subcategory: 'soy', itemType: 'base-food', state: 'raw', region: 'north', defaultServingGrams: 100,
    per100g: { calories: 150, protein: 18.0, carbs: 12.0, fat: 3.5, fiber: 3.0, sodium: 100, vitaminB12: 0, vitaminD: 0, iron: 3.0, calcium: 60 },
    servings: [{ id: 'piece', label: '1 stick (~80g)', grams: 80 }, { id: 'g100', label: '100g', grams: 100 }],
    dietTypes: ['vegan', 'veg', 'jain', 'nonveg'], tags: ['muscle-building', 'high-protein'],
    isProcessed: true, isFastingFood: false, fastingTypes: [], isGlutenFree: false, isRecipe: false, containsRootVeg: false, hasBeverageModifiers: false, supportedConsistencyTypes: [], consistencyMultipliers: {}, gi: 30, cookingOilNote: null, estimatedOilG: 0, source: 'healthifyme', confidence: 'medium', notes: 'Often contains ~30-40% maida (refined wheat flour) mixed with soy. Not gluten-free.'
  },
  {
    id: 'peanut-butter-powder', name: 'Powdered Peanut Butter', nameAlt: ['pb fit', 'defatted peanut'], hindiName: 'मूंगफली का पाउडर (वसा रहित)', searchTerms: ['peanut butter', 'powder', 'pb fit'],
    category: 'supplement', subcategory: 'powder', itemType: 'supplement', state: 'raw', region: 'pan-indian', defaultServingGrams: 16,
    per100g: { calories: 375, protein: 50.0, carbs: 31.0, fat: 10.0, fiber: 15.0, sodium: 150, vitaminB12: 0, vitaminD: 0, iron: 4.5, calcium: 60 },
    servings: [{ id: 'tbsp', label: '2 tbsp (16g)', grams: 16 }, { id: 'g100', label: '100g', grams: 100 }],
    dietTypes: ['vegan', 'veg', 'jain', 'nonveg'], tags: ['muscle-building', 'high-protein', 'low-fat'],
    isProcessed: true, isFastingFood: false, fastingTypes: [], isGlutenFree: true, isRecipe: false, containsRootVeg: false, hasBeverageModifiers: false, supportedConsistencyTypes: [], consistencyMultipliers: {}, gi: 15, cookingOilNote: null, estimatedOilG: 0, source: 'USDA', confidence: 'high'
  },
  {
    id: 'vegan-pea-protein', name: 'Vegan Protein Powder (Pea/Brown Rice)', nameAlt: ['plant protein powder'], hindiName: 'वीगन प्रोटीन', searchTerms: ['vegan', 'protein', 'pea protein', 'plant protein'],
    category: 'supplement', subcategory: 'powder', itemType: 'supplement', state: 'raw', region: 'pan-indian', defaultServingGrams: 35,
    per100g: { calories: 380, protein: 72.0, carbs: 12.0, fat: 6.0, fiber: 4.0, sodium: 600, vitaminB12: 3.0 /* fortified */, vitaminD: 0, iron: 25.0, calcium: 100 },
    servings: [{ id: 'scoop', label: '1 scoop (~35g)', grams: 35 }, { id: 'g100', label: '100g', grams: 100 }],
    dietTypes: ['vegan', 'veg', 'jain', 'nonveg'], tags: ['muscle-building', 'very-high-protein'],
    isProcessed: true, isFastingFood: false, fastingTypes: [], isGlutenFree: true, isRecipe: false, containsRootVeg: false, hasBeverageModifiers: false, supportedConsistencyTypes: [], consistencyMultipliers: {}, gi: 15, cookingOilNote: null, estimatedOilG: 0, source: 'FSSAI-label', confidence: 'medium', notes: 'Iron content is very high from peas.'
  }
];

const fs = require('fs');
const path = require('path');

const combinedFoods = [...batch6OilsFats, ...batch6Condiments, ...batch6SupplementsSoy];

const indianFoodsPath = path.join(__dirname, '../src/data/foods/indianFoods.js');
let fileContent = fs.readFileSync(indianFoodsPath, 'utf8');

const insertIndex = fileContent.lastIndexOf('];');
if (insertIndex === -1) {
    console.error("Could not find array end '];' in indianFoods.js");
    process.exit(1);
}

let injectedString = "";
for (let i = 0; i < combinedFoods.length; i++) {
   injectedString += "  ,\n  " + JSON.stringify(combinedFoods[i], null, 4).replace(/"([^"]+)":/g, '$1:');
}
injectedString += "\n";

const newFileContent = fileContent.slice(0, insertIndex) + injectedString + fileContent.slice(insertIndex);
fs.writeFileSync(indianFoodsPath, newFileContent);
console.log("Successfully appended " + combinedFoods.length + " Batch 6 items to indianFoods.js");

// Generate seed file
try {
  require('child_process').execSync('node scripts/generate_seed.js', {stdio: 'inherit'});
} catch (error) {
  console.error("Error running generate_seed.js", error);
}
