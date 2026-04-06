const fs = require('fs');
const path = require('path');

const rawData = [
  // Tier 1 Domestic Whey
  {
    id: "mb-biozyme-whey", brand: "MuscleBlaze", productLine: "Biozyme Whey Protein", subcategory: "whey-concentrate", proteinType: "concentrate", scoopWeightG: 33, priceINR: 2799, originCountry: "India", certifications: ["Labdoor", "Trustified Gold"], bcaaG: 5.5,
    perScoop: { calories: 120, protein: 25, carbs: 2.5, fat: 1.2, fiber: 0, sodium: 100 }
  },
  {
    id: "mb-biozyme-performance-whey", brand: "MuscleBlaze", productLine: "Biozyme Performance Whey", subcategory: "whey-concentrate", proteinType: "concentrate", scoopWeightG: 36, priceINR: 2999, originCountry: "India", certifications: ["Trustified Gold"], bcaaG: 5.5,
    perScoop: { calories: 141, protein: 25, carbs: 5.8, fat: 1.9, fiber: 0, sodium: 130 }
  },
  {
    id: "mb-raw-whey-concentrate", brand: "MuscleBlaze", productLine: "Raw Whey Protein Concentrate", subcategory: "whey-concentrate", proteinType: "concentrate", scoopWeightG: 33, priceINR: 1699, originCountry: "India", certifications: ["FSSAI-label"], bcaaG: 5.1,
    perScoop: { calories: 130, protein: 24, carbs: 4, fat: 1.5, fiber: 0, sodium: 80 }
  },
  {
    id: "asitis-atom-whey", brand: "AS-IT-IS", productLine: "ATOM Whey Protein", subcategory: "whey-concentrate", proteinType: "blend", scoopWeightG: 33, priceINR: 1499, originCountry: "India", certifications: ["USA Labdoor Certified", "NABL"], bcaaG: 6.1, eaaG: 12.9,
    perScoop: { calories: 127, protein: 27, carbs: 2, fat: 0.5, fiber: 0, sodium: 90 }
  },
  {
    id: "asitis-raw-whey-concentrate", brand: "AS-IT-IS", productLine: "Raw Whey Protein Concentrate", subcategory: "whey-concentrate", proteinType: "concentrate", scoopWeightG: 33, priceINR: 1199, originCountry: "India", certifications: ["Labdoor"], bcaaG: 5.9,
    perScoop: { calories: 129, protein: 26, carbs: 3, fat: 1.5, fiber: 0, sodium: 85 }
  },
  {
    id: "twt-whey-concentrate-unflavored", brand: "The Whole Truth", productLine: "Whey Protein Concentrate", subcategory: "whey-concentrate", proteinType: "concentrate", scoopWeightG: 30, priceINR: 2499, originCountry: "India", certifications: ["Clean Label"], bcaaG: 6.4,
    perScoop: { calories: 124, protein: 26, carbs: 2, fat: 1.5, fiber: 0, sodium: 70 }
  },
  {
    id: "twt-whey-isolate-unflavored", brand: "The Whole Truth", productLine: "Whey Protein Isolate", subcategory: "whey-isolate", proteinType: "isolate", scoopWeightG: 33, priceINR: 3499, originCountry: "India", certifications: ["Clean Label"], bcaaG: 7.3,
    perScoop: { calories: 130, protein: 30, carbs: 1, fat: 0.5, fiber: 0, sodium: 65 }
  },
  {
    id: "nakpro-impact-whey", brand: "NAKPRO", productLine: "Impact Whey Protein", subcategory: "whey-concentrate", proteinType: "blend", scoopWeightG: 33, priceINR: 1899, originCountry: "India", certifications: ["Trustified"], bcaaG: 5.4,
    perScoop: { calories: 124, protein: 24, carbs: 3, fat: 1.5, fiber: 0, sodium: 100 }
  },
  {
    id: "avvatar-absolute-whey", brand: "AVVATAR", productLine: "Absolute 100% Whey Protein", subcategory: "whey-concentrate", proteinType: "blend", scoopWeightG: 36, priceINR: 2599, originCountry: "India", certifications: ["Vegetarian"], bcaaG: 5.5,
    perScoop: { calories: 145, protein: 25, carbs: 5.5, fat: 2, fiber: 0, sodium: 120 }
  },
  {
    id: "truebasics-clean-whey-isolate", brand: "TrueBasics", productLine: "Clean Whey Isolate", subcategory: "whey-isolate", proteinType: "isolate", scoopWeightG: 33, priceINR: 3299, originCountry: "India", certifications: ["Trustified Gold"], bcaaG: 6.9,
    perScoop: { calories: 120, protein: 30, carbs: 1, fat: 0.5, fiber: 0, sodium: 80 }
  },
  
  // Tier 2 International Imports
  {
    id: "on-gold-standard-whey", brand: "Optimum Nutrition", productLine: "Gold Standard 100% Whey", subcategory: "whey-concentrate", proteinType: "blend", scoopWeightG: 30, priceINR: 3199, originCountry: "USA", certifications: ["Informed Choice"], bcaaG: 5.5,
    perScoop: { calories: 120, protein: 24, carbs: 3, fat: 1, fiber: 0, sodium: 130 }
  },
  {
    id: "on-gold-standard-whey-isolate", brand: "Optimum Nutrition", productLine: "Gold Standard 100% Whey Isolate", subcategory: "whey-isolate", proteinType: "isolate", scoopWeightG: 31, priceINR: 5999, originCountry: "USA", certifications: ["Informed Choice"], bcaaG: 5.5,
    perScoop: { calories: 110, protein: 25, carbs: 1, fat: 0.5, fiber: 0, sodium: 130 }
  },
  {
    id: "myprotein-impact-whey-concentrate", brand: "MyProtein", productLine: "Impact Whey Protein", subcategory: "whey-concentrate", proteinType: "concentrate", scoopWeightG: 25, priceINR: 1999, originCountry: "UK", certifications: ["Labdoor"], bcaaG: 4.5,
    perScoop: { calories: 103, protein: 20, carbs: 3, fat: 1.9, fiber: 0, sodium: 110 }
  },
  {
    id: "myprotein-impact-whey-isolate", brand: "MyProtein", productLine: "Impact Whey Isolate", subcategory: "whey-isolate", proteinType: "isolate", scoopWeightG: 25, priceINR: 2799, originCountry: "UK", certifications: ["Labdoor"], bcaaG: 4.9,
    perScoop: { calories: 93, protein: 22, carbs: 1, fat: 0.5, fiber: 0, sodium: 90 }
  },
  {
    id: "dymatize-iso100", brand: "Dymatize", productLine: "ISO 100 Hydrolyzed", subcategory: "whey-hydrolysate", proteinType: "hydrolysate", scoopWeightG: 31, priceINR: 6999, originCountry: "USA", certifications: ["Informed Choice"], bcaaG: 5.5,
    perScoop: { calories: 110, protein: 25, carbs: 1, fat: 0.5, fiber: 0, sodium: 160 }
  },
  {
    id: "bigmuscles-premium-gold-whey", brand: "Bigmuscles Nutrition", productLine: "Premium Gold Whey", subcategory: "whey-concentrate", proteinType: "blend", scoopWeightG: 36, priceINR: 2999, originCountry: "India", certifications: ["Informed Choice UK"], bcaaG: 5.8, eaaG: 11,
    perScoop: { calories: 145, protein: 25, carbs: 7, fat: 2, fiber: 0, sodium: 140 }
  },
  {
    id: "gnc-pro-performance-whey", brand: "GNC", productLine: "Pro Performance Whey Protein", subcategory: "whey-concentrate", proteinType: "concentrate", scoopWeightG: 34, priceINR: 3499, originCountry: "USA", certifications: ["GNC Guaranteed"], bcaaG: 5,
    perScoop: { calories: 130, protein: 24, carbs: 5, fat: 1.5, fiber: 0, sodium: 150 }
  },
  {
    id: "tata-1mg-whey", brand: "Tata 1mg", productLine: "Ultra Clean Whey Protein", subcategory: "whey-concentrate", proteinType: "blend", scoopWeightG: 36, priceINR: 2999, originCountry: "India", certifications: ["Trustified Gold"], bcaaG: 5.6,
    perScoop: { calories: 135, protein: 25, carbs: 4, fat: 1.5, fiber: 0, sodium: 120 }
  },

  // 8 Missing Brand WHEY Additions
  {
    id: "mb-biozyme-iso-zero", brand: "MuscleBlaze", productLine: "Biozyme Iso-Zero", subcategory: "whey-isolate", proteinType: "isolate", scoopWeightG: 34, priceINR: 3799, originCountry: "India", certifications: ["Trustified Gold"], bcaaG: 5.96, eaaG: 12.69,
    perScoop: { calories: 125, protein: 27, carbs: 1.5, fat: 1, fiber: 0, sodium: 90 }
  },
  {
    id: "nutrabay-pure-whey-concentrate", brand: "Nutrabay", productLine: "Pure 100% Whey Protein Concentrate", subcategory: "whey-concentrate", proteinType: "concentrate", scoopWeightG: 30, priceINR: 1299, originCountry: "India", certifications: ["Lab Tested"], bcaaG: 5.2,
    perScoop: { calories: 123, protein: 23.4, carbs: 2.3, fat: 2.2, fiber: 0, sodium: 95 }
  },
  {
    id: "nutrabay-pure-whey-isolate", brand: "Nutrabay", productLine: "Pure Whey Protein Isolate", subcategory: "whey-isolate", proteinType: "isolate", scoopWeightG: 30, priceINR: 1899, originCountry: "India", certifications: ["Lab Tested"], bcaaG: 5.8,
    perScoop: { calories: 112, protein: 26.5, carbs: 1, fat: 0.5, fiber: 0, sodium: 80 }
  },
  {
    id: "amul-whey-protein", brand: "Amul", productLine: "Whey Protein (Unflavoured)", subcategory: "whey-concentrate", proteinType: "concentrate", scoopWeightG: 32, priceINR: 1599, originCountry: "India", certifications: ["FSSAI", "Lactose Free"], bcaaG: 5,
    perScoop: { calories: 118, protein: 25, carbs: 2, fat: 1.5, fiber: 0, sodium: 85 }
  },
  {
    id: "naturaltein-whey-concentrate", brand: "Naturaltein", productLine: "Whey Protein Concentrate", subcategory: "whey-concentrate", proteinType: "concentrate", scoopWeightG: 30, priceINR: 2299, originCountry: "India", certifications: ["German Certified"], bcaaG: 5.2,
    perScoop: { calories: 110, protein: 21.6, carbs: 2.5, fat: 1.6, fiber: 0, sodium: 80 }
  },
  {
    id: "muscletech-nitrotech-whey", brand: "MuscleTech", productLine: "NitroTech Whey Protein", subcategory: "whey-isolate", proteinType: "blend", scoopWeightG: 46, priceINR: 4999, originCountry: "USA", certifications: ["Informed Choice"], bcaaG: 6.8,
    perScoop: { calories: 160, protein: 30, carbs: 4, fat: 2.5, fiber: 0, sodium: 160 }
  },
  {
    id: "protyze-clear-whey", brand: "Protyze", productLine: "Anytime Clear Whey Protein", subcategory: "clear-whey", proteinType: "isolate", scoopWeightG: 30, priceINR: 2699, originCountry: "India", certifications: ["99.9% Lactose-Free"], bcaaG: 7.2,
    perScoop: { calories: 103, protein: 24, carbs: 1.5, fat: 0, fiber: 0, sodium: 50 },
    tags: ["clear-whey", "lactose-free"]
  },
  {
    id: "kevin-levrone-gold-whey", brand: "Kevin Levrone", productLine: "Gold Whey", subcategory: "whey-concentrate", proteinType: "concentrate", scoopWeightG: 30, priceINR: 3499, originCountry: "Poland", certifications: ["EU Certified"], bcaaG: 4.8,
    perScoop: { calories: 119, protein: 22, carbs: 3, fat: 2, fiber: 0, sodium: 85 }
  },

  // 10 Mass Gainers
  {
    id: "mb-mass-gainer-xxl", brand: "MuscleBlaze", productLine: "Mass Gainer XXL", subcategory: "mass-gainer", proteinType: "blend", scoopWeightG: 150, priceINR: 1899, originCountry: "India", certifications: ["Trustified Gold"], bcaaG: 4.2,
    perScoop: { calories: 561, protein: 22.5, carbs: 112, fat: 3, fiber: 1, sodium: 200 },
    servingLabel: "1 serving (150g, 3 scoops)"
  },
  {
    id: "mb-super-gainer-xxl", brand: "MuscleBlaze", productLine: "Super Gainer XXL", subcategory: "mass-gainer", proteinType: "blend", scoopWeightG: 75, priceINR: 1699, originCountry: "India", certifications: ["FSSAI-label"],
    perScoop: { calories: 280, protein: 15, carbs: 53, fat: 2, fiber: 0.5, sodium: 160 },
    servingLabel: "1 serving (75g)"
  },
  {
    id: "mb-lean-mass-gainer", brand: "MuscleBlaze", productLine: "High Protein Lean Mass Gainer", subcategory: "lean-mass-gainer", proteinType: "blend", scoopWeightG: 75, priceINR: 2799, originCountry: "India", certifications: ["FSSAI-label"], bcaaG: 6.5,
    perScoop: { calories: 295, protein: 30, carbs: 47, fat: 2, fiber: 2, sodium: 180 },
    servingLabel: "1 serving (75g)"
  },
  {
    id: "asitis-atom-mass-gainer", brand: "AS-IT-IS", productLine: "ATOM Mass Gainer", subcategory: "mass-gainer", proteinType: "blend", scoopWeightG: 100, priceINR: 2199, originCountry: "India", certifications: ["Labdoor"],
    perScoop: { calories: 384, protein: 25, carbs: 63, fat: 4, fiber: 0, sodium: 150 },
    servingLabel: "1 serving (100g, 2 scoops)"
  },
  {
    id: "on-serious-mass", brand: "Optimum Nutrition", productLine: "Serious Mass", subcategory: "mass-gainer", proteinType: "blend", scoopWeightG: 334, priceINR: 4499, originCountry: "USA", certifications: ["Informed Choice"],
    perScoop: { calories: 1260, protein: 50, carbs: 253, fat: 4.5, fiber: 5, sodium: 420 },
    servingLabel: "1 serving (334g, 2 scoops)"
  },
  {
    id: "on-serious-mass-half", brand: "Optimum Nutrition", productLine: "Serious Mass (Half Serving)", subcategory: "mass-gainer", proteinType: "blend", scoopWeightG: 167, priceINR: 4499, originCountry: "USA", certifications: ["Informed Choice"],
    perScoop: { calories: 630, protein: 25, carbs: 126.5, fat: 2.25, fiber: 2.5, sodium: 210 },
    servingLabel: "1 scoop (167g, half serving)"
  },
  {
    id: "labrada-muscle-mass-gainer", brand: "Labrada", productLine: "Muscle Mass Gainer", subcategory: "mass-gainer", proteinType: "blend", scoopWeightG: 336, priceINR: 6999, originCountry: "USA", certifications: ["FSSAI-label"],
    perScoop: { calories: 1244, protein: 52, carbs: 251, fat: 8, fiber: 6, sodium: 560 },
    servingLabel: "1 serving (336g, 3 scoops)"
  },
  {
    id: "muscletech-mass-tech-extreme", brand: "MuscleTech", productLine: "Mass Tech Extreme 2000", subcategory: "mass-gainer", proteinType: "blend", scoopWeightG: 334, priceINR: 9999, originCountry: "USA", certifications: ["FSSAI-label"], bcaaG: 18.6,
    perScoop: { calories: 2000, protein: 80, carbs: 400, fat: 10, fiber: 0, sodium: 800 },
    servingLabel: "1 serving (~334g)", tags: ["extreme-calories", "advanced-only"]
  },
  {
    id: "gnc-pro-performance-weight-gainer", brand: "GNC", productLine: "Pro Performance Weight Gainer", subcategory: "mass-gainer", proteinType: "blend", scoopWeightG: 315, priceINR: 8999, originCountry: "USA", certifications: ["GNC Guaranteed"],
    perScoop: { calories: 1600, protein: 53, carbs: 380, fat: 15, fiber: 0, sodium: 600 },
    servingLabel: "1 serving (~315g)", tags: ["extreme-calories"]
  },
  {
    id: "bsn-true-mass-1200", brand: "BSN", productLine: "True Mass 1200", subcategory: "mass-gainer", proteinType: "blend", scoopWeightG: 254, priceINR: 7999, originCountry: "USA", certifications: ["FSSAI-label"],
    perScoop: { calories: 1210, protein: 50, carbs: 215, fat: 17, fiber: 7, sodium: 700 },
    servingLabel: "1 serving (254g, 3 scoops)"
  }
];

const supplementFoods = rawData.map(data => {
  const ratio = 100 / data.scoopWeightG;

  const per100g = {
    calories: Math.round(data.perScoop.calories * ratio),
    protein: Number((data.perScoop.protein * ratio).toFixed(1)),
    carbs: Number((data.perScoop.carbs * ratio).toFixed(1)),
    fat: Number((data.perScoop.fat * ratio).toFixed(1)),
    fiber: data.perScoop.fiber ? Number((data.perScoop.fiber * ratio).toFixed(1)) : 0,
    sodium: data.perScoop.sodium ? Math.round(data.perScoop.sodium * ratio) : null,
    vitaminB12: 0,
    vitaminD: 0,
    iron: 0,
    calcium: 0
  };

  const name = \`\${data.brand} \${data.productLine}\`;

  return {
    id: data.id,
    name: name,
    nameAlt: [data.brand.toLowerCase(), data.productLine.toLowerCase()],
    hindiName: name,
    searchTerms: [data.brand.toLowerCase(), ...data.productLine.toLowerCase().split(' '), 'protein powder', 'whey', 'supplements', 'gym supplement'],
    category: "supplement",
    subcategory: data.subcategory,
    itemType: "supplement",
    state: "raw",
    region: "pan-indian",
    defaultServingGrams: data.scoopWeightG,
    per100g,
    servings: [
      {
        id: "scoop",
        label: data.servingLabel || \`1 scoop (~\${data.scoopWeightG}g)\`,
        grams: data.scoopWeightG
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
    dietTypes: ["veg", "nonveg"],
    tags: data.tags || (data.subcategory.includes('mass') ? ['bulking', 'high-calorie'] : ["muscle-building", "high-protein", "post-workout"]),
    isProcessed: true,
    isFastingFood: false,
    fastingTypes: [],
    isGlutenFree: true,
    isRecipe: false,
    containsRootVeg: false,
    hasBeverageModifiers: false,
    supportedConsistencyTypes: [],
    consistencyMultipliers: {},
    gi: data.subcategory.includes('mass') ? 80 : 15,
    cookingOilNote: null,
    estimatedOilG: 0,
    source: "FSSAI-label",
    confidence: "high",
    
    // Supplement specific fields
    brand: data.brand,
    productLine: data.productLine,
    scoopWeightG: data.scoopWeightG,
    proteinType: data.proteinType,
    bcaaG: data.bcaaG || null,
    eaaG: data.eaaG || null,
    certifications: data.certifications || [],
    priceINR: data.priceINR || null,
    originCountry: data.originCountry || null
  };
});

const content = \`/**
 * Supplement Foods Database Module (Brand Specific)
 * Generated from Phase 5 specifications.
 */

export const supplementFoods = \${JSON.stringify(supplementFoods, null, 2)};
\`;

fs.writeFileSync(path.join(__dirname, '../src/data/foods/supplementFoods.js'), content, 'utf8');
console.log('Successfully generated src/data/foods/supplementFoods.js');
