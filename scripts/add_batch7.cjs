const batch7Packaged = [
  {
    id: 'maggi-masala', name: 'Maggi Masala Noodles', nameAlt: ['maggi', '2 minute noodles'], hindiName: 'मैगी', searchTerms: ['maggi', 'noodles', 'masala', 'packaged'],
    category: 'packaged-food', subcategory: 'noodles', itemType: 'dish', state: 'cooked', region: 'pan-indian', defaultServingGrams: 70, // typical 1 pack
    per100g: { calories: 427, protein: 8.0, carbs: 63.5, fat: 15.7, fiber: 2.0, sodium: 1100, vitaminB12: 0, vitaminD: 0, iron: 1.5, calcium: 15 },
    servings: [{ id: 'packet', label: '1 pack (70g)', grams: 70 }, { id: 'g100', label: '100g', grams: 100 }],
    dietTypes: ['veg', 'nonveg'], tags: ['snack', 'high-carb', 'processed', 'high-sodium'],
    isProcessed: true, isFastingFood: false, fastingTypes: [], isGlutenFree: false, isRecipe: false, containsRootVeg: true, hasBeverageModifiers: false, supportedConsistencyTypes: [], consistencyMultipliers: {}, gi: 70, cookingOilNote: null, estimatedOilG: 0, source: 'FSSAI-label', confidence: 'high'
  },
  {
    id: 'yippee-noodles', name: 'Yippee Magic Masala Noodles', nameAlt: ['yippee'], hindiName: 'यिप्पी नूडल्स', searchTerms: ['yippee', 'noodles', 'sunfeast', 'packaged'],
    category: 'packaged-food', subcategory: 'noodles', itemType: 'dish', state: 'cooked', region: 'pan-indian', defaultServingGrams: 60,
    per100g: { calories: 450, protein: 9.0, carbs: 61.0, fat: 17.5, fiber: 2.5, sodium: 1150, vitaminB12: 0, vitaminD: 0, iron: 1.0, calcium: 20 },
    servings: [{ id: 'packet', label: '1 pack (60g)', grams: 60 }, { id: 'g100', label: '100g', grams: 100 }],
    dietTypes: ['veg', 'nonveg'], tags: ['snack', 'high-carb', 'processed', 'high-sodium'],
    isProcessed: true, isFastingFood: false, fastingTypes: [], isGlutenFree: false, isRecipe: false, containsRootVeg: true, hasBeverageModifiers: false, supportedConsistencyTypes: [], consistencyMultipliers: {}, gi: 70, cookingOilNote: null, estimatedOilG: 0, source: 'FSSAI-label', confidence: 'high'
  },
  {
    id: 'kurkure-masala', name: 'Kurkure Masala Munch', nameAlt: ['kurkure'], hindiName: 'कुरकुरे', searchTerms: ['kurkure', 'chips', 'masala munch', 'snack'],
    category: 'packaged-food', subcategory: 'chips', itemType: 'snack', state: 'fried', region: 'pan-indian', defaultServingGrams: 30,
    per100g: { calories: 554, protein: 5.6, carbs: 56.4, fat: 34.0, fiber: 2.0, sodium: 790, vitaminB12: 0, vitaminD: 0, iron: 1.0, calcium: 10 },
    servings: [{ id: 'packet', label: '1 small pack (~30g)', grams: 30 }, { id: 'packet-lg', label: '1 large pack (~90g)', grams: 90 }, { id: 'g100', label: '100g', grams: 100 }],
    dietTypes: ['veg', 'jain', 'nonveg'], tags: ['snack', 'high-fat', 'processed', 'high-sodium'],
    isProcessed: true, isFastingFood: false, fastingTypes: [], isGlutenFree: false, isRecipe: false, containsRootVeg: false, hasBeverageModifiers: false, supportedConsistencyTypes: [], consistencyMultipliers: {}, gi: 75, cookingOilNote: null, estimatedOilG: 0, source: 'FSSAI-label', confidence: 'high'
  },
  {
    id: 'lays-salted', name: "Lay's Classic Salted", nameAlt: ['lays yellow'], hindiName: 'लेज़ (नमक)', searchTerms: ['lays', 'classic salted', 'chips', 'potato chip'],
    category: 'packaged-food', subcategory: 'chips', itemType: 'snack', state: 'fried', region: 'pan-indian', defaultServingGrams: 30,
    per100g: { calories: 544, protein: 6.8, carbs: 51.4, fat: 34.6, fiber: 4.0, sodium: 550, vitaminB12: 0, vitaminD: 0, iron: 1.5, calcium: 15 },
    servings: [{ id: 'packet', label: '1 small pack (~30g)', grams: 30 }, { id: 'g100', label: '100g', grams: 100 }],
    dietTypes: ['vegan', 'veg', 'nonveg'], tags: ['snack', 'high-fat', 'processed', 'high-sodium'],
    isProcessed: true, isFastingFood: false, fastingTypes: [], isGlutenFree: true, isRecipe: false, containsRootVeg: true, hasBeverageModifiers: false, supportedConsistencyTypes: [], consistencyMultipliers: {}, gi: 80, cookingOilNote: null, estimatedOilG: 0, source: 'FSSAI-label', confidence: 'high'
  },
  {
    id: 'lays-magic-masala', name: "Lay's India's Magic Masala", nameAlt: ['lays blue'], hindiName: 'लेज़ ম্যাजिक मसाला', searchTerms: ['lays', 'magic masala', 'blue lays', 'chips'],
    category: 'packaged-food', subcategory: 'chips', itemType: 'snack', state: 'fried', region: 'pan-indian', defaultServingGrams: 30,
    per100g: { calories: 540, protein: 7.0, carbs: 51.0, fat: 34.0, fiber: 4.0, sodium: 700, vitaminB12: 0, vitaminD: 0, iron: 1.5, calcium: 20 },
    servings: [{ id: 'packet', label: '1 small pack (~30g)', grams: 30 }, { id: 'g100', label: '100g', grams: 100 }],
    dietTypes: ['veg', 'nonveg'], tags: ['snack', 'high-fat', 'processed', 'high-sodium'],
    isProcessed: true, isFastingFood: false, fastingTypes: [], isGlutenFree: true, isRecipe: false, containsRootVeg: true, hasBeverageModifiers: false, supportedConsistencyTypes: [], consistencyMultipliers: {}, gi: 80, cookingOilNote: null, estimatedOilG: 0, source: 'FSSAI-label', confidence: 'high'
  },
  {
    id: 'bingo-mad-angles', name: 'Bingo Mad Angles', nameAlt: ['bingo chips'], hindiName: 'बिंगो', searchTerms: ['bingo', 'mad angles', 'chips'],
    category: 'packaged-food', subcategory: 'chips', itemType: 'snack', state: 'fried', region: 'pan-indian', defaultServingGrams: 40,
    per100g: { calories: 535, protein: 5.5, carbs: 56.0, fat: 32.0, fiber: 3.0, sodium: 800, vitaminB12: 0, vitaminD: 0, iron: 1.0, calcium: 15 },
    servings: [{ id: 'packet', label: '1 pack (~40g)', grams: 40 }, { id: 'g100', label: '100g', grams: 100 }],
    dietTypes: ['veg', 'nonveg'], tags: ['snack', 'high-fat', 'processed'],
    isProcessed: true, isFastingFood: false, fastingTypes: [], isGlutenFree: false, isRecipe: false, containsRootVeg: true, hasBeverageModifiers: false, supportedConsistencyTypes: [], consistencyMultipliers: {}, gi: 75, cookingOilNote: null, estimatedOilG: 0, source: 'FSSAI-label', confidence: 'high'
  },
  {
    id: 'haldiram-aloo-bhujia', name: 'Haldiram Aloo Bhujia', nameAlt: ['aloo bhujia'], hindiName: 'आलू भुजिया', searchTerms: ['haldiram', 'aloo bhujia', 'namkeen'],
    category: 'packaged-food', subcategory: 'namkeen', itemType: 'snack', state: 'fried', region: 'pan-indian', defaultServingGrams: 35,
    per100g: { calories: 580, protein: 10.0, carbs: 42.0, fat: 42.0, fiber: 2.0, sodium: 850, vitaminB12: 0, vitaminD: 0, iron: 1.5, calcium: 25 },
    servings: [{ id: 'katori', label: '1 katori', grams: 35 }, { id: 'g100', label: '100g', grams: 100 }],
    dietTypes: ['vegan', 'veg', 'nonveg'], tags: ['snack', 'very-high-fat', 'processed', 'high-sodium'],
    isProcessed: true, isFastingFood: false, fastingTypes: [], isGlutenFree: true, isRecipe: false, containsRootVeg: true, hasBeverageModifiers: false, supportedConsistencyTypes: [], consistencyMultipliers: {}, gi: 65, cookingOilNote: null, estimatedOilG: 0, source: 'FSSAI-label', confidence: 'high'
  },
  {
    id: 'haldiram-moong-dal', name: 'Haldiram Moong Dal (Fried)', nameAlt: ['fried moong dal snack'], hindiName: 'हल्दीराम मूंग दाल', searchTerms: ['haldiram', 'moong dal', 'namkeen'],
    category: 'packaged-food', subcategory: 'namkeen', itemType: 'snack', state: 'fried', region: 'pan-indian', defaultServingGrams: 35,
    per100g: { calories: 460, protein: 22.0, carbs: 45.0, fat: 21.0, fiber: 5.0, sodium: 600, vitaminB12: 0, vitaminD: 0, iron: 3.0, calcium: 40 },
    servings: [{ id: 'katori', label: '1 katori', grams: 35 }, { id: 'packet', label: '1 small pack', grams: 40 }, { id: 'g100', label: '100g', grams: 100 }],
    dietTypes: ['vegan', 'veg', 'jain', 'nonveg'], tags: ['snack', 'high-fat', 'high-protein', 'processed'],
    isProcessed: true, isFastingFood: false, fastingTypes: [], isGlutenFree: true, isRecipe: false, containsRootVeg: false, hasBeverageModifiers: false, supportedConsistencyTypes: [], consistencyMultipliers: {}, gi: 45, cookingOilNote: null, estimatedOilG: 0, source: 'FSSAI-label', confidence: 'high'
  },
  {
    id: 'parleg-biscuit', name: 'Parle-G Biscuit', nameAlt: ['parle g', 'glucose biscuit'], hindiName: 'पार्ले जी', searchTerms: ['parle', 'parle-g', 'biscuit', 'glucose'],
    category: 'packaged-food', subcategory: 'biscuit', itemType: 'snack', state: 'baked', region: 'pan-indian', defaultServingGrams: 20, // ~4 biscuits
    per100g: { calories: 455, protein: 6.5, carbs: 74.0, fat: 14.5, fiber: 1.0, sodium: 300, vitaminB12: 0, vitaminD: 0, iron: 1.5, calcium: 15 },
    servings: [{ id: 'piece', label: '4 biscuits', grams: 20 }, { id: 'g100', label: '100g', grams: 100 }],
    dietTypes: ['veg', 'jain', 'nonveg'], tags: ['snack', 'high-sugar', 'processed'],
    isProcessed: true, isFastingFood: false, fastingTypes: [], isGlutenFree: false, isRecipe: false, containsRootVeg: false, hasBeverageModifiers: false, supportedConsistencyTypes: [], consistencyMultipliers: {}, gi: 75, cookingOilNote: null, estimatedOilG: 0, source: 'FSSAI-label', confidence: 'high'
  },
  {
    id: 'marie-gold-biscuit', name: 'Britannia Marie Gold Biscuit', nameAlt: ['marie biscuit'], hindiName: 'मैरी गोल्ड बिस्कुट', searchTerms: ['marie', 'marie gold', 'britannia', 'biscuit'],
    category: 'packaged-food', subcategory: 'biscuit', itemType: 'snack', state: 'baked', region: 'pan-indian', defaultServingGrams: 22, // ~5 biscuits
    per100g: { calories: 440, protein: 8.0, carbs: 75.0, fat: 12.0, fiber: 3.0, sodium: 350, vitaminB12: 0, vitaminD: 0, iron: 1.0, calcium: 10 },
    servings: [{ id: 'piece', label: '5 biscuits', grams: 22 }, { id: 'g100', label: '100g', grams: 100 }],
    dietTypes: ['veg', 'jain', 'nonveg'], tags: ['snack', 'processed'],
    isProcessed: true, isFastingFood: false, fastingTypes: [], isGlutenFree: false, isRecipe: false, containsRootVeg: false, hasBeverageModifiers: false, supportedConsistencyTypes: [], consistencyMultipliers: {}, gi: 65, cookingOilNote: null, estimatedOilG: 0, source: 'FSSAI-label', confidence: 'high'
  },
  {
    id: 'bourbon-biscuit', name: 'Bourbon Biscuit (Chocolate Cream)', nameAlt: ['britannia bourbon'], hindiName: 'बर्बन बिस्कुट', searchTerms: ['bourbon', 'biscuit', 'chocolate biscuit'],
    category: 'packaged-food', subcategory: 'biscuit', itemType: 'snack', state: 'baked', region: 'pan-indian', defaultServingGrams: 28, // ~2 biscuits
    per100g: { calories: 490, protein: 5.5, carbs: 70.0, fat: 21.0, fiber: 2.0, sodium: 300, vitaminB12: 0, vitaminD: 0, iron: 1.5, calcium: 15 },
    servings: [{ id: 'piece', label: '2 biscuits', grams: 28 }, { id: 'g100', label: '100g', grams: 100 }],
    dietTypes: ['veg', 'jain', 'nonveg'], tags: ['snack', 'high-sugar', 'high-fat', 'processed'],
    isProcessed: true, isFastingFood: false, fastingTypes: [], isGlutenFree: false, isRecipe: false, containsRootVeg: false, hasBeverageModifiers: false, supportedConsistencyTypes: [], consistencyMultipliers: {}, gi: 70, cookingOilNote: null, estimatedOilG: 0, source: 'FSSAI-label', confidence: 'high'
  },
  {
    id: 'good-day-cashew', name: 'Good Day Cashew Biscuit', nameAlt: ['britannia good day'], hindiName: 'गुड डे बिस्कुट', searchTerms: ['good day', 'britannia', 'kaju biscuit'],
    category: 'packaged-food', subcategory: 'biscuit', itemType: 'snack', state: 'baked', region: 'pan-indian', defaultServingGrams: 25, // ~3 biscuits
    per100g: { calories: 512, protein: 7.0, carbs: 64.0, fat: 25.0, fiber: 1.5, sodium: 230, vitaminB12: 0, vitaminD: 0, iron: 1.0, calcium: 15 },
    servings: [{ id: 'piece', label: '3 biscuits', grams: 25 }, { id: 'g100', label: '100g', grams: 100 }],
    dietTypes: ['veg', 'jain', 'nonveg'], tags: ['snack', 'high-fat', 'processed'],
    isProcessed: true, isFastingFood: false, fastingTypes: [], isGlutenFree: false, isRecipe: false, containsRootVeg: false, hasBeverageModifiers: false, supportedConsistencyTypes: [], consistencyMultipliers: {}, gi: 70, cookingOilNote: null, estimatedOilG: 0, source: 'FSSAI-label', confidence: 'high'
  },
  {
    id: 'oreo-biscuit', name: 'Oreo Biscuit (Original)', nameAlt: ['cadbury oreo'], hindiName: 'ओरियो बिस्कुट', searchTerms: ['oreo', 'biscuit', 'chocolate cream'],
    category: 'packaged-food', subcategory: 'biscuit', itemType: 'snack', state: 'baked', region: 'pan-indian', defaultServingGrams: 28.5, // 3 cookies
    per100g: { calories: 480, protein: 5.0, carbs: 68.0, fat: 20.0, fiber: 3.0, sodium: 400, vitaminB12: 0, vitaminD: 0, iron: 2.0, calcium: 15 },
    servings: [{ id: 'piece', label: '3 biscuits', grams: 28.5 }, { id: 'g100', label: '100g', grams: 100 }],
    dietTypes: ['vegan', 'veg', 'jain', 'nonveg'], tags: ['snack', 'high-sugar', 'processed'],
    isProcessed: true, isFastingFood: false, fastingTypes: [], isGlutenFree: false, isRecipe: false, containsRootVeg: false, hasBeverageModifiers: false, supportedConsistencyTypes: [], consistencyMultipliers: {}, gi: 70, cookingOilNote: null, estimatedOilG: 0, source: 'FSSAI-label', confidence: 'high'
  },
  {
    id: 'nutrichoice-digestive', name: 'NutriChoice Digestive Biscuit', nameAlt: ['digestive biscuit'], hindiName: 'डाइजेस्टिव बिस्कुट', searchTerms: ['digestive', 'nutrichoice', 'britannia', 'biscuit'],
    category: 'packaged-food', subcategory: 'biscuit', itemType: 'snack', state: 'baked', region: 'pan-indian', defaultServingGrams: 30, // ~3 biscuits
    per100g: { calories: 470, protein: 7.0, carbs: 65.0, fat: 20.0, fiber: 6.0, sodium: 350, vitaminB12: 0, vitaminD: 0, iron: 1.5, calcium: 20 },
    servings: [{ id: 'piece', label: '3 biscuits', grams: 30 }, { id: 'g100', label: '100g', grams: 100 }],
    dietTypes: ['veg', 'jain', 'nonveg'], tags: ['snack', 'processed'],
    isProcessed: true, isFastingFood: false, fastingTypes: [], isGlutenFree: false, isRecipe: false, containsRootVeg: false, hasBeverageModifiers: false, supportedConsistencyTypes: [], consistencyMultipliers: {}, gi: 60, cookingOilNote: null, estimatedOilG: 0, source: 'FSSAI-label', confidence: 'high'
  },
  {
    id: 'kelloggs-corn-flakes', name: "Kellogg's Corn Flakes", nameAlt: ['cornflakes'], hindiName: 'कॉर्नफ्लेक्स', searchTerms: ['corn flakes', 'kelloggs', 'cereal'],
    category: 'packaged-food', subcategory: 'cereal', itemType: 'base-food', state: 'raw', region: 'pan-indian', defaultServingGrams: 30,
    per100g: { calories: 380, protein: 7.0, carbs: 88.0, fat: 1.0, fiber: 2.0, sodium: 650, vitaminB12: 1.0, vitaminD: 0, iron: 15.0 /* fortified */, calcium: 15 },
    servings: [{ id: 'katori', label: '1 katori (30g)', grams: 30 }, { id: 'g100', label: '100g', grams: 100 }],
    dietTypes: ['vegan', 'veg', 'jain', 'nonveg'], tags: ['breakfast', 'high-carb', 'processed'],
    isProcessed: true, isFastingFood: false, fastingTypes: [], isGlutenFree: true, isRecipe: false, containsRootVeg: false, hasBeverageModifiers: false, supportedConsistencyTypes: [], consistencyMultipliers: {}, gi: 81, cookingOilNote: null, estimatedOilG: 0, source: 'FSSAI-label', confidence: 'high'
  },
  {
    id: 'kelloggs-chocos', name: "Kellogg's Chocos", nameAlt: ['chocos'], hindiName: 'चोकोस', searchTerms: ['chocos', 'kelloggs', 'chocolate cereal'],
    category: 'packaged-food', subcategory: 'cereal', itemType: 'base-food', state: 'raw', region: 'pan-indian', defaultServingGrams: 30,
    per100g: { calories: 390, protein: 9.0, carbs: 82.0, fat: 3.0, fiber: 5.0, sodium: 350, vitaminB12: 1.0, vitaminD: 0, iron: 10.0, calcium: 150 },
    servings: [{ id: 'katori', label: '1 katori (30g)', grams: 30 }, { id: 'g100', label: '100g', grams: 100 }],
    dietTypes: ['veg', 'jain', 'nonveg'], tags: ['breakfast', 'high-sugar', 'processed'],
    isProcessed: true, isFastingFood: false, fastingTypes: [], isGlutenFree: false, isRecipe: false, containsRootVeg: false, hasBeverageModifiers: false, supportedConsistencyTypes: [], consistencyMultipliers: {}, gi: 77, cookingOilNote: null, estimatedOilG: 0, source: 'FSSAI-label', confidence: 'high'
  },
  {
    id: 'oats-masala-saffola', name: 'Saffola Masala Oats', nameAlt: ['masala oats packet'], hindiName: 'मसाला ओट्स', searchTerms: ['saffola', 'masala oats', 'oats'],
    category: 'packaged-food', subcategory: 'oats', itemType: 'dish', state: 'raw', region: 'pan-indian', defaultServingGrams: 39,
    per100g: { calories: 390, protein: 10.5, carbs: 68.0, fat: 8.5, fiber: 7.0, sodium: 1200, vitaminB12: 0, vitaminD: 0, iron: 3.0, calcium: 30 },
    servings: [{ id: 'packet', label: '1 pack (~39g)', grams: 39 }, { id: 'g100', label: '100g', grams: 100 }],
    dietTypes: ['veg', 'nonveg'], tags: ['breakfast', 'high-sodium', 'processed'],
    isProcessed: true, isFastingFood: false, fastingTypes: [], isGlutenFree: false, isRecipe: false, containsRootVeg: true,  hasBeverageModifiers: false, supportedConsistencyTypes: [], consistencyMultipliers: {}, gi: 60, cookingOilNote: null, estimatedOilG: 0, source: 'FSSAI-label', confidence: 'high'
  },
  {
    id: 'maggi-pazzta', name: 'Maggi Pazzta (Cheese Macaroni)', nameAlt: ['maggi pasta'], hindiName: 'मैगी पास्ता', searchTerms: ['maggi', 'pasta', 'pazzta', 'macaroni'],
    category: 'packaged-food', subcategory: 'pasta', itemType: 'dish', state: 'raw', region: 'pan-indian', defaultServingGrams: 70,
    per100g: { calories: 400, protein: 12.0, carbs: 70.0, fat: 8.0, fiber: 2.0, sodium: 1100, vitaminB12: 0, vitaminD: 0, iron: 1.0, calcium: 100 },
    servings: [{ id: 'packet', label: '1 pack (70g)', grams: 70 }, { id: 'g100', label: '100g', grams: 100 }],
    dietTypes: ['veg', 'nonveg'], tags: ['snack', 'processed', 'high-sodium'],
    isProcessed: true, isFastingFood: false, fastingTypes: [], isGlutenFree: false, isRecipe: false, containsRootVeg: true, hasBeverageModifiers: false, supportedConsistencyTypes: [], consistencyMultipliers: {}, gi: 65, cookingOilNote: null, estimatedOilG: 0, source: 'FSSAI-label', confidence: 'high'
  },
  {
    id: 'popcorn-act2-butter', name: 'Act II Butter Popcorn', nameAlt: ['act 2 popcorn', 'microwave popcorn'], hindiName: 'पॉपकॉर्न (बटर)', searchTerms: ['popcorn', 'act 2', 'act ii', 'butter'],
    category: 'packaged-food', subcategory: 'snack', itemType: 'snack', state: 'cooked', region: 'pan-indian', defaultServingGrams: 30,
    per100g: { calories: 480, protein: 6.5, carbs: 55.0, fat: 26.0, fiber: 9.0, sodium: 1050, vitaminB12: 0, vitaminD: 0, iron: 2.0, calcium: 15 },
    servings: [{ id: 'katori', label: '1 katori (popped)', grams: 10 }, { id: 'packet', label: '1 small pack (raw/microwaved)', grams: 35 }, { id: 'g100', label: '100g', grams: 100 }],
    dietTypes: ['veg', 'jain', 'nonveg'], tags: ['snack', 'high-fat', 'processed'],
    isProcessed: true, isFastingFood: false, fastingTypes: [], isGlutenFree: true, isRecipe: false, containsRootVeg: false, hasBeverageModifiers: false, supportedConsistencyTypes: [], consistencyMultipliers: {}, gi: 65, cookingOilNote: null, estimatedOilG: 0, source: 'FSSAI-label', confidence: 'high'
  },
  {
    id: 'cadbury-dairy-milk', name: 'Cadbury Dairy Milk Chocolate', nameAlt: ['dairy milk', 'chocolate bar'], hindiName: 'कैडबरी डेयरी मिल्क', searchTerms: ['cadbury', 'dairy milk', 'chocolate'],
    category: 'packaged-food', subcategory: 'chocolate', itemType: 'snack', state: 'raw', region: 'pan-indian', defaultServingGrams: 13.2,
    per100g: { calories: 532, protein: 7.7, carbs: 60.5, fat: 28.6, fiber: 2.0, sodium: 135, vitaminB12: 0.5, vitaminD: 0, iron: 1.5, calcium: 200 },
    servings: [{ id: 'piece', label: '1 small ₹10 bar (~13g)', grams: 13.2 }, { id: 'g100', label: '100g', grams: 100 }],
    dietTypes: ['veg', 'jain', 'nonveg'], tags: ['snack', 'high-sugar', 'high-fat', 'processed'],
    isProcessed: true, isFastingFood: false, fastingTypes: [], isGlutenFree: true, isRecipe: false, containsRootVeg: false, hasBeverageModifiers: false, supportedConsistencyTypes: [], consistencyMultipliers: {}, gi: 45, cookingOilNote: null, estimatedOilG: 0, source: 'FSSAI-label', confidence: 'high'
  }
];

const batch7FastingVrat = [
  {
    id: 'sabudana-khichdi', name: 'Sabudana Khichdi', nameAlt: ['sago khichdi', 'sabu dana'], hindiName: 'साबूदाना खिचड़ी', searchTerms: ['sabudana', 'khichdi', 'vrat', 'fasting', 'sago'],
    category: 'fasting', subcategory: 'dish', itemType: 'dish', state: 'cooked', region: 'west', defaultServingGrams: 150,
    per100g: { calories: 230, protein: 3.5, carbs: 32.0, fat: 9.5, fiber: 2.0, sodium: 300, vitaminB12: 0, vitaminD: 0, iron: 1.0, calcium: 15 },
    servings: [{ id: 'katori', label: '1 katori', grams: 150 }, { id: 'g100', label: '100g', grams: 100 }],
    dietTypes: ['vegan', 'veg', 'nonveg'], tags: ['vrat', 'high-carb', 'high-carb'],
    isProcessed: false, isFastingFood: true, fastingTypes: ['navratri', 'ekadashi', 'maha-shivratri'], isGlutenFree: true, isRecipe: false, containsRootVeg: true,  hasBeverageModifiers: false, supportedConsistencyTypes: [], consistencyMultipliers: {}, gi: 75, cookingOilNote: 'Peanut oil / Ghee', estimatedOilG: 6, source: 'healthifyme', confidence: 'high', notes: 'Almost always contains potatoes.'
  },
  {
    id: 'sabudana-vada', name: 'Sabudana Vada', nameAlt: ['sago vada', 'vrat vada'], hindiName: 'साबूदाना वडा', searchTerms: ['sabudana', 'vada', 'vrat', 'fried'],
    category: 'fasting', subcategory: 'snack', itemType: 'dish', state: 'fried', region: 'west', defaultServingGrams: 50,
    per100g: { calories: 340, protein: 4.0, carbs: 45.0, fat: 16.0, fiber: 2.5, sodium: 400, vitaminB12: 0, vitaminD: 0, iron: 1.2, calcium: 20 },
    servings: [{ id: 'piece', label: '1 medium vada', grams: 50 }, { id: 'g100', label: '100g', grams: 100 }],
    dietTypes: ['vegan', 'veg', 'nonveg'], tags: ['vrat', 'high-fat', 'fried'],
    isProcessed: false, isFastingFood: true, fastingTypes: ['navratri', 'ekadashi', 'maha-shivratri'], isGlutenFree: true, isRecipe: false, containsRootVeg: true,  hasBeverageModifiers: false, supportedConsistencyTypes: [], consistencyMultipliers: {}, gi: 80, cookingOilNote: 'Deep fried', estimatedOilG: 12, source: 'healthifyme', confidence: 'medium'
  },
  {
    id: 'kuttu-puri', name: 'Kuttu Ki Puri (Buckwheat)', nameAlt: ['kuttu poori'], hindiName: 'कुट्टू की पूरी', searchTerms: ['kuttu', 'puri', 'poori', 'vrat', 'buckwheat'],
    category: 'fasting', subcategory: 'bread', itemType: 'dish', state: 'fried', region: 'north', defaultServingGrams: 30, // 1 puri
    per100g: { calories: 380, protein: 7.0, carbs: 55.0, fat: 15.0, fiber: 8.0, sodium: 200, vitaminB12: 0, vitaminD: 0, iron: 2.5, calcium: 30 },
    servings: [{ id: 'piece', label: '1 puri', grams: 30 }, { id: 'g100', label: '100g', grams: 100 }],
    dietTypes: ['vegan', 'veg', 'nonveg'], tags: ['vrat', 'fried'],
    isProcessed: false, isFastingFood: true, fastingTypes: ['navratri', 'ekadashi', 'maha-shivratri'], isGlutenFree: true, isRecipe: false, containsRootVeg: true,  hasBeverageModifiers: false, supportedConsistencyTypes: [], consistencyMultipliers: {}, gi: 55, cookingOilNote: 'Deep fried, dough bound with boiled potato.', estimatedOilG: 6, source: 'healthifyme', confidence: 'medium'
  },
  {
    id: 'singhare-puri', name: 'Singhare Ki Puri (Water Chestnut)', nameAlt: ['singara puri'], hindiName: 'सिंघाड़े की पूरी', searchTerms: ['singhare', 'puri', 'poori', 'vrat', 'water chestnut'],
    category: 'fasting', subcategory: 'bread', itemType: 'dish', state: 'fried', region: 'north', defaultServingGrams: 30,
    per100g: { calories: 360, protein: 5.0, carbs: 60.0, fat: 12.0, fiber: 5.0, sodium: 200, vitaminB12: 0, vitaminD: 0, iron: 1.5, calcium: 20 },
    servings: [{ id: 'piece', label: '1 puri', grams: 30 }, { id: 'g100', label: '100g', grams: 100 }],
    dietTypes: ['vegan', 'veg', 'nonveg'], tags: ['vrat', 'fried'],
    isProcessed: false, isFastingFood: true, fastingTypes: ['navratri', 'ekadashi', 'maha-shivratri'], isGlutenFree: true, isRecipe: false, containsRootVeg: true,  hasBeverageModifiers: false, supportedConsistencyTypes: [], consistencyMultipliers: {}, gi: 55, cookingOilNote: 'Deep fried, dough bound with boiled potato.', estimatedOilG: 5, source: 'healthifyme', confidence: 'medium'
  },
  {
    id: 'sama-chawal', name: 'Sama Ke Chawal (Barnyard Millet/Samak)', nameAlt: ['samak chawal', 'bhagar', 'millet'], hindiName: 'समा के चावल', searchTerms: ['sama', 'samak', 'bhagar', 'barnyard millet', 'vrat rice'],
    category: 'fasting', subcategory: 'dish', itemType: 'dish', state: 'cooked', region: 'pan-indian', defaultServingGrams: 150,
    per100g: { calories: 120, protein: 2.5, carbs: 24.0, fat: 1.5, fiber: 3.5, sodium: 10, vitaminB12: 0, vitaminD: 0, iron: 1.2, calcium: 10 },
    servings: [{ id: 'katori', label: '1 katori (cooked)', grams: 150 }, { id: 'g100', label: '100g', grams: 100 }],
    dietTypes: ['vegan', 'veg', 'nonveg'], tags: ['vrat', 'low-GI', 'healthy'],
    isProcessed: false, isFastingFood: true, fastingTypes: ['navratri', 'ekadashi', 'maha-shivratri'], isGlutenFree: true, isRecipe: false, containsRootVeg: false, hasBeverageModifiers: false, supportedConsistencyTypes: [], consistencyMultipliers: {}, gi: 50, cookingOilNote: 'Often cooked in 1 tsp ghee.', estimatedOilG: 2, source: 'IFCT-2017', confidence: 'high'
  },
  {
    id: 'vrat-wale-aloo', name: 'Vrat Wale Aloo (Dry Sabzi)', nameAlt: ['jeera aloo vrat', 'falahari aloo'], hindiName: 'व्रत वाले आलू', searchTerms: ['aloo', 'vrat', 'falahari', 'jeera aloo'],
    category: 'fasting', subcategory: 'dish', itemType: 'dish', state: 'cooked', region: 'north', defaultServingGrams: 150,
    per100g: { calories: 110, protein: 2.0, carbs: 18.0, fat: 3.5, fiber: 2.5, sodium: 250, vitaminB12: 0, vitaminD: 0, iron: 0.8, calcium: 15 },
    servings: [{ id: 'katori', label: '1 katori', grams: 150 }, { id: 'g100', label: '100g', grams: 100 }],
    dietTypes: ['vegan', 'veg', 'nonveg'], tags: ['vrat'],
    isProcessed: false, isFastingFood: true, fastingTypes: ['navratri', 'ekadashi', 'maha-shivratri'], isGlutenFree: true, isRecipe: false, containsRootVeg: true,  hasBeverageModifiers: false, supportedConsistencyTypes: [], consistencyMultipliers: {}, gi: 65, cookingOilNote: 'Tempered in ghee/peanut oil.', estimatedOilG: 4, source: 'healthifyme', confidence: 'high'
  },
  {
    id: 'makhana-kheer', name: 'Makhana Kheer', nameAlt: ['phool makhana kheer'], hindiName: 'मखाना खीर', searchTerms: ['makhana', 'kheer', 'vrat', 'sweet'],
    category: 'fasting', subcategory: 'sweet', itemType: 'dish', state: 'cooked', region: 'north', defaultServingGrams: 150,
    per100g: { calories: 140, protein: 4.5, carbs: 20.0, fat: 5.0, fiber: 0.5, sodium: 40, vitaminB12: 0.2, vitaminD: 0, iron: 1.0, calcium: 110 },
    servings: [{ id: 'katori', label: '1 katori', grams: 150 }, { id: 'g100', label: '100g', grams: 100 }],
    dietTypes: ['veg', 'nonveg'], tags: ['vrat', 'high-sugar'],
    isProcessed: false, isFastingFood: true, fastingTypes: ['navratri', 'ekadashi', 'maha-shivratri'], isGlutenFree: true, isRecipe: false, containsRootVeg: false, hasBeverageModifiers: false, supportedConsistencyTypes: [], consistencyMultipliers: {}, gi: 55, cookingOilNote: 'Makhana roasted in ghee.', estimatedOilG: 3, source: 'curated-estimate', confidence: 'medium'
  },
  {
    id: 'rajgira-paratha', name: 'Rajgira Paratha (Amaranth)', nameAlt: ['amaranth paratha'], hindiName: 'राजगिरा पराठा', searchTerms: ['rajgira', 'paratha', 'vrat', 'amaranth'],
    category: 'fasting', subcategory: 'bread', itemType: 'dish', state: 'cooked', region: 'west', defaultServingGrams: 60,
    per100g: { calories: 310, protein: 8.0, carbs: 50.0, fat: 9.0, fiber: 7.0, sodium: 150, vitaminB12: 0, vitaminD: 0, iron: 3.5, calcium: 90 },
    servings: [{ id: 'piece', label: '1 paratha', grams: 60 }, { id: 'g100', label: '100g', grams: 100 }],
    dietTypes: ['vegan', 'veg', 'nonveg'], tags: ['vrat', 'high-fiber'],
    isProcessed: false, isFastingFood: true, fastingTypes: ['navratri', 'ekadashi', 'maha-shivratri'], isGlutenFree: true, isRecipe: false, containsRootVeg: true,  hasBeverageModifiers: false, supportedConsistencyTypes: [], consistencyMultipliers: {}, gi: 45, cookingOilNote: 'Bound with potato, roasted with ghee/oil.', estimatedOilG: 4, source: 'healthifyme', confidence: 'medium'
  },
  {
    id: 'banana-chips', name: 'Banana Chips (Kerala Style / Yellow)', nameAlt: ['kela chips', 'nendran chips'], hindiName: 'केले के चिप्स', searchTerms: ['banana chips', 'kela chips', 'nendran'],
    category: 'packaged-food', subcategory: 'chips', itemType: 'snack', state: 'fried', region: 'south', defaultServingGrams: 30, // handful
    per100g: { calories: 519, protein: 2.3, carbs: 58.0, fat: 33.0, fiber: 7.0, sodium: 350, vitaminB12: 0, vitaminD: 0, iron: 1.0, calcium: 15 },
    servings: [{ id: 'handful', label: '1 handful (~30g)', grams: 30 }, { id: 'g100', label: '100g', grams: 100 }],
    dietTypes: ['vegan', 'veg', 'jain', 'nonveg'], tags: ['vrat', 'snack', 'high-fat'],
    isProcessed: true, isFastingFood: true, fastingTypes: ['navratri', 'ekadashi', 'maha-shivratri'], isGlutenFree: true, isRecipe: false, containsRootVeg: false, hasBeverageModifiers: false, supportedConsistencyTypes: [], consistencyMultipliers: {}, gi: 65, cookingOilNote: 'Deep fried in coconut oil.', estimatedOilG: 10, source: 'USDA', confidence: 'high'
  },
  {
    id: 'farali-chivda', name: 'Farali Chivda (Potato & Peanuts Sweet/Salty)', nameAlt: ['falahari chivda', 'vrat namkeen'], hindiName: 'फराली चिवड़ा', searchTerms: ['farali', 'chivda', 'vrat namkeen', 'potato chewda'],
    category: 'fasting', subcategory: 'snack', itemType: 'snack', state: 'fried', region: 'west', defaultServingGrams: 30,
    per100g: { calories: 530, protein: 8.0, carbs: 50.0, fat: 34.0, fiber: 3.5, sodium: 400, vitaminB12: 0, vitaminD: 0, iron: 1.5, calcium: 30 },
    servings: [{ id: 'katori', label: '1 small katori (~30g)', grams: 30 }, { id: 'g100', label: '100g', grams: 100 }],
    dietTypes: ['vegan', 'veg', 'nonveg'], tags: ['vrat', 'snack', 'high-fat', 'sweet-salty'],
    isProcessed: true, isFastingFood: true, fastingTypes: ['navratri', 'ekadashi', 'maha-shivratri'], isGlutenFree: true, isRecipe: false, containsRootVeg: true,  hasBeverageModifiers: false, supportedConsistencyTypes: [], consistencyMultipliers: {}, gi: 70, cookingOilNote: 'Deep fried potato sticks and peanuts.', estimatedOilG: 8, source: 'healthifyme', confidence: 'medium'
  }
];

const fs = require('fs');
const path = require('path');

const combinedFoods = [...batch7Packaged, ...batch7FastingVrat];

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
console.log("Successfully appended " + combinedFoods.length + " Batch 7 items to indianFoods.js");

// Generate seed file
try {
  require('child_process').execSync('node scripts/generate_seed.js', {stdio: 'inherit'});
} catch (error) {
  console.error("Error running generate_seed.js", error);
}
