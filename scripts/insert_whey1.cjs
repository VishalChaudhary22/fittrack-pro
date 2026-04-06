const fs = require('fs');
const path = require('path');

const wheyBatch1 = [
  {
    id: "mb-biozyme-whey", name: "MuscleBlaze Biozyme Whey Protein", nameAlt: ["mb biozyme", "muscleblaze whey"], hindiName: "मसलब्लेज़ बायोज़ाइम व्हे", searchTerms: ["mb", "biozyme", "muscleblaze", "whey"],
    category: "supplement", subcategory: "whey-concentrate", itemType: "supplement", state: "raw", region: "pan-indian",
    brand: "MuscleBlaze", productLine: "Biozyme Performance Whey", scoopWeightG: 33, proteinType: "concentrate", bcaaG: 5.5, certifications: ["Labdoor", "Trustified Gold", "FSSAI"], priceINR: 2799, originCountry: "India",
    defaultServingGrams: 33,
    per100g: { calories: 364, protein: 75.8, carbs: 7.6, fat: 3.6, fiber: 0, sodium: 300, vitaminB12: 0, vitaminD: 0, iron: 0, calcium: 300 },
    servings: [ { id: "scoop", label: "1 scoop (33g)", grams: 33 }, { id: "g100", label: "100g", grams: 100 }, { id: "custom", label: "Custom (g)", grams: 1 } ],
    dietTypes: ["veg", "nonveg"], tags: ["muscle-building", "high-protein"], isProcessed: true, isFastingFood: false, fastingTypes: [], isGlutenFree: true, isRecipe: false, containsRootVeg: false, hasBeverageModifiers: false, supportedConsistencyTypes: [], consistencyMultipliers: {}, gi: 15, cookingOilNote: null, estimatedOilG: 0, source: "FSSAI-label", confidence: "high"
  },
  {
    id: "mb-biozyme-performance-whey", name: "MuscleBlaze Biozyme Performance Whey", nameAlt: ["mb performance whey"], hindiName: "मसलब्लेज़ परफॉरमेंस व्हे", searchTerms: ["mb", "biozyme performance", "muscleblaze"],
    category: "supplement", subcategory: "whey-concentrate", itemType: "supplement", state: "raw", region: "pan-indian",
    brand: "MuscleBlaze", productLine: "Biozyme Performance Whey", scoopWeightG: 36, proteinType: "concentrate", bcaaG: 5.5, certifications: ["Trustified Gold"], priceINR: 2999, originCountry: "India",
    defaultServingGrams: 36,
    per100g: { calories: 391, protein: 69.4, carbs: 16.1, fat: 5.3, fiber: 0, sodium: 360, vitaminB12: 0, vitaminD: 0, iron: 0, calcium: 300 },
    servings: [ { id: "scoop", label: "1 scoop (36g)", grams: 36 }, { id: "g100", label: "100g", grams: 100 }, { id: "custom", label: "Custom (g)", grams: 1 } ],
    dietTypes: ["veg", "nonveg"], tags: ["muscle-building", "high-protein"], isProcessed: true, isFastingFood: false, fastingTypes: [], isGlutenFree: true, isRecipe: false, containsRootVeg: false, hasBeverageModifiers: false, supportedConsistencyTypes: [], consistencyMultipliers: {}, gi: 15, cookingOilNote: null, estimatedOilG: 0, source: "FSSAI-label", confidence: "high"
  },
  {
    id: "mb-raw-whey-concentrate", name: "MuscleBlaze Raw Whey Protein Concentrate (80%)", nameAlt: ["mb raw whey"], hindiName: "मसलब्लेज़ रॉ व्हे", searchTerms: ["mb", "raw", "muscleblaze raw", "unflavoured"],
    category: "supplement", subcategory: "whey-concentrate", itemType: "supplement", state: "raw", region: "pan-indian",
    brand: "MuscleBlaze", productLine: "Raw Whey", scoopWeightG: 33, proteinType: "concentrate", bcaaG: 5.1, certifications: ["FSSAI"], priceINR: 1699, originCountry: "India",
    defaultServingGrams: 33,
    per100g: { calories: 394, protein: 72.7, carbs: 12.1, fat: 4.5, fiber: 0, sodium: 242, vitaminB12: 0, vitaminD: 0, iron: 0, calcium: 300 },
    servings: [ { id: "scoop", label: "1 scoop (33g)", grams: 33 }, { id: "g100", label: "100g", grams: 100 }, { id: "custom", label: "Custom (g)", grams: 1 } ],
    dietTypes: ["veg", "nonveg"], tags: ["muscle-building", "high-protein"], isProcessed: true, isFastingFood: false, fastingTypes: [], isGlutenFree: true, isRecipe: false, containsRootVeg: false, hasBeverageModifiers: false, supportedConsistencyTypes: [], consistencyMultipliers: {}, gi: 15, cookingOilNote: null, estimatedOilG: 0, source: "FSSAI-label", confidence: "high"
  },
  {
    id: "asitis-atom-whey", name: "AS-IT-IS Nutrition ATOM Whey Protein", nameAlt: ["atom whey", "asitis whey"], hindiName: "एज़ इट इज़ एटम व्हे", searchTerms: ["asitis", "atom", "as-it-is"],
    category: "supplement", subcategory: "whey-concentrate", itemType: "supplement", state: "raw", region: "pan-indian",
    brand: "AS-IT-IS", productLine: "ATOM", scoopWeightG: 33, proteinType: "concentrate", bcaaG: 6.1, eaaG: 12.9, certifications: ["Labdoor", "NABL"], priceINR: 1499, originCountry: "India",
    defaultServingGrams: 33,
    per100g: { calories: 385, protein: 81.8, carbs: 6.1, fat: 1.5, fiber: 0, sodium: 272, vitaminB12: 0, vitaminD: 0, iron: 0, calcium: 300 },
    servings: [ { id: "scoop", label: "1 scoop (33g)", grams: 33 }, { id: "g100", label: "100g", grams: 100 }, { id: "custom", label: "Custom (g)", grams: 1 } ],
    dietTypes: ["veg", "nonveg"], tags: ["muscle-building", "high-protein"], isProcessed: true, isFastingFood: false, fastingTypes: [], isGlutenFree: true, isRecipe: false, containsRootVeg: false, hasBeverageModifiers: false, supportedConsistencyTypes: [], consistencyMultipliers: {}, gi: 15, cookingOilNote: null, estimatedOilG: 0, source: "FSSAI-label", confidence: "high"
  },
  {
    id: "asitis-raw-whey-concentrate", name: "AS-IT-IS Raw Whey Protein Concentrate", nameAlt: ["asitis raw whey"], hindiName: "एज़ इट इज़ रॉ व्हे", searchTerms: ["asitis", "raw whey", "as-it-israw"],
    category: "supplement", subcategory: "whey-concentrate", itemType: "supplement", state: "raw", region: "pan-indian",
    brand: "AS-IT-IS", productLine: "Raw Whey", scoopWeightG: 33, proteinType: "concentrate", bcaaG: 5.9, certifications: ["Labdoor"], priceINR: 1199, originCountry: "India",
    defaultServingGrams: 33,
    per100g: { calories: 391, protein: 78.8, carbs: 9.1, fat: 4.5, fiber: 0, sodium: 257, vitaminB12: 0, vitaminD: 0, iron: 0, calcium: 300 },
    servings: [ { id: "scoop", label: "1 scoop (33g)", grams: 33 }, { id: "g100", label: "100g", grams: 100 }, { id: "custom", label: "Custom (g)", grams: 1 } ],
    dietTypes: ["veg", "nonveg"], tags: ["muscle-building", "high-protein"], isProcessed: true, isFastingFood: false, fastingTypes: [], isGlutenFree: true, isRecipe: false, containsRootVeg: false, hasBeverageModifiers: false, supportedConsistencyTypes: [], consistencyMultipliers: {}, gi: 15, cookingOilNote: null, estimatedOilG: 0, source: "FSSAI-label", confidence: "high"
  },
  {
    id: "twt-whey-concentrate-unflavored", name: "The Whole Truth Whey Protein Concentrate", nameAlt: ["twt whey", "whole truth whey"], hindiName: "दी होल ट्रुथ व्हे", searchTerms: ["twt", "whole truth", "unflavored"],
    category: "supplement", subcategory: "whey-concentrate", itemType: "supplement", state: "raw", region: "pan-indian",
    brand: "The Whole Truth", productLine: "Whey Protein Concentrate", scoopWeightG: 30, proteinType: "concentrate", bcaaG: 6.4, certifications: ["Clean label"], priceINR: 2499, originCountry: "India",
    defaultServingGrams: 30,
    per100g: { calories: 413, protein: 86.7, carbs: 6.7, fat: 5.0, fiber: 0, sodium: 233, vitaminB12: 0, vitaminD: 0, iron: 0, calcium: 300 },
    servings: [ { id: "scoop", label: "1 scoop (30g)", grams: 30 }, { id: "g100", label: "100g", grams: 100 }, { id: "custom", label: "Custom (g)", grams: 1 } ],
    dietTypes: ["veg", "nonveg"], tags: ["muscle-building", "high-protein"], isProcessed: true, isFastingFood: false, fastingTypes: [], isGlutenFree: true, isRecipe: false, containsRootVeg: false, hasBeverageModifiers: false, supportedConsistencyTypes: [], consistencyMultipliers: {}, gi: 15, cookingOilNote: null, estimatedOilG: 0, source: "FSSAI-label", confidence: "high"
  },
  {
    id: "twt-whey-isolate-unflavored", name: "The Whole Truth Whey Protein Isolate", nameAlt: ["twt isolate", "whole truth isolate"], hindiName: "दी होल ट्रुथ व्हे आइसोलेट", searchTerms: ["twt", "whole truth", "isolate"],
    category: "supplement", subcategory: "whey-isolate", itemType: "supplement", state: "raw", region: "pan-indian",
    brand: "The Whole Truth", productLine: "Whey Protein Isolate", scoopWeightG: 33, proteinType: "isolate", bcaaG: 7.3, certifications: ["Clean label"], priceINR: 3499, originCountry: "India",
    defaultServingGrams: 33,
    per100g: { calories: 394, protein: 90.9, carbs: 3.0, fat: 1.5, fiber: 0, sodium: 197, vitaminB12: 0, vitaminD: 0, iron: 0, calcium: 300 },
    servings: [ { id: "scoop", label: "1 scoop (33g)", grams: 33 }, { id: "g100", label: "100g", grams: 100 }, { id: "custom", label: "Custom (g)", grams: 1 } ],
    dietTypes: ["veg", "nonveg"], tags: ["muscle-building", "high-protein"], isProcessed: true, isFastingFood: false, fastingTypes: [], isGlutenFree: true, isRecipe: false, containsRootVeg: false, hasBeverageModifiers: false, supportedConsistencyTypes: [], consistencyMultipliers: {}, gi: 15, cookingOilNote: null, estimatedOilG: 0, source: "FSSAI-label", confidence: "high"
  },
  {
    id: "nakpro-impact-whey", name: "NAKPRO Impact Whey Protein", nameAlt: ["nakpro whey"], hindiName: "नैकप्रो इम्पैक्ट व्हे", searchTerms: ["nakpro", "impact"],
    category: "supplement", subcategory: "whey-concentrate", itemType: "supplement", state: "raw", region: "pan-indian",
    brand: "NAKPRO", productLine: "Impact Whey", scoopWeightG: 33, proteinType: "concentrate", bcaaG: 5.4, certifications: ["Trustified"], priceINR: 1899, originCountry: "India",
    defaultServingGrams: 33,
    per100g: { calories: 376, protein: 72.7, carbs: 9.1, fat: 4.5, fiber: 0, sodium: 303, vitaminB12: 0, vitaminD: 0, iron: 0, calcium: 300 },
    servings: [ { id: "scoop", label: "1 scoop (33g)", grams: 33 }, { id: "g100", label: "100g", grams: 100 }, { id: "custom", label: "Custom (g)", grams: 1 } ],
    dietTypes: ["veg", "nonveg"], tags: ["muscle-building", "high-protein"], isProcessed: true, isFastingFood: false, fastingTypes: [], isGlutenFree: true, isRecipe: false, containsRootVeg: false, hasBeverageModifiers: false, supportedConsistencyTypes: [], consistencyMultipliers: {}, gi: 15, cookingOilNote: null, estimatedOilG: 0, source: "FSSAI-label", confidence: "high"
  },
  {
    id: "avvatar-absolute-whey", name: "AVVATAR Absolute 100% Whey Protein", nameAlt: ["avvatar whey"], hindiName: "अवतार एब्सोल्यूट व्हे", searchTerms: ["avvatar", "absolute"],
    category: "supplement", subcategory: "whey-concentrate", itemType: "supplement", state: "raw", region: "pan-indian",
    brand: "AVVATAR", productLine: "Absolute Whey", scoopWeightG: 36, proteinType: "concentrate", bcaaG: 5.5, certifications: ["Vegetarian"], priceINR: 2599, originCountry: "India",
    defaultServingGrams: 36,
    per100g: { calories: 403, protein: 69.4, carbs: 15.3, fat: 5.6, fiber: 0, sodium: 333, vitaminB12: 0, vitaminD: 0, iron: 0, calcium: 300 },
    servings: [ { id: "scoop", label: "1 scoop (36g)", grams: 36 }, { id: "g100", label: "100g", grams: 100 }, { id: "custom", label: "Custom (g)", grams: 1 } ],
    dietTypes: ["veg", "nonveg"], tags: ["muscle-building", "high-protein"], isProcessed: true, isFastingFood: false, fastingTypes: [], isGlutenFree: true, isRecipe: false, containsRootVeg: false, hasBeverageModifiers: false, supportedConsistencyTypes: [], consistencyMultipliers: {}, gi: 15, cookingOilNote: null, estimatedOilG: 0, source: "FSSAI-label", confidence: "high"
  },
  {
    id: "truebasics-clean-whey-isolate", name: "TrueBasics Clean Whey Isolate", nameAlt: ["truebasics whey isolate"], hindiName: "ट्रूबेसिक्स क्लीन व्हे आइसोलेट", searchTerms: ["truebasics", "clean whey"],
    category: "supplement", subcategory: "whey-isolate", itemType: "supplement", state: "raw", region: "pan-indian",
    brand: "TrueBasics", productLine: "Clean Whey Isolate", scoopWeightG: 33, proteinType: "isolate", bcaaG: 6.9, certifications: ["Trustified Gold"], priceINR: 3299, originCountry: "India",
    defaultServingGrams: 33,
    per100g: { calories: 364, protein: 90.9, carbs: 3.0, fat: 1.5, fiber: 0, sodium: 242, vitaminB12: 0, vitaminD: 0, iron: 0, calcium: 300 },
    servings: [ { id: "scoop", label: "1 scoop (33g)", grams: 33 }, { id: "g100", label: "100g", grams: 100 }, { id: "custom", label: "Custom (g)", grams: 1 } ],
    dietTypes: ["veg", "nonveg"], tags: ["muscle-building", "high-protein"], isProcessed: true, isFastingFood: false, fastingTypes: [], isGlutenFree: true, isRecipe: false, containsRootVeg: false, hasBeverageModifiers: false, supportedConsistencyTypes: [], consistencyMultipliers: {}, gi: 15, cookingOilNote: null, estimatedOilG: 0, source: "FSSAI-label", confidence: "high"
  }
];

// Read and append script
const indianFoodsPath = path.join(__dirname, '../src/data/foods/indianFoods.js');
let fileContent = fs.readFileSync(indianFoodsPath, 'utf8');

const insertIndex = fileContent.lastIndexOf('];');
if (insertIndex === -1) {
    console.error("Could not find array end '];' in indianFoods.js");
    process.exit(1);
}

let injectedString = "";
for (let i = 0; i < wheyBatch1.length; i++) {
   injectedString += "  ,\n  " + JSON.stringify(wheyBatch1[i], null, 4).replace(/"([^"]+)":/g, '$1:');
}
injectedString += "\n";

const newFileContent = fileContent.slice(0, insertIndex) + injectedString + fileContent.slice(insertIndex);
fs.writeFileSync(indianFoodsPath, newFileContent);
console.log("Successfully appended " + wheyBatch1.length + " Batch 1 Whey items to indianFoods.js");
