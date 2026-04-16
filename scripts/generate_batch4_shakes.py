import json

b4_data = [
    # -----------------------------
    # DRINKS / SHAKES
    # -----------------------------
    {
        "id": "drink-amul-highprotein-milk-250ml",
        "name": "Amul High Protein Milk (Lactose Free)",
        "nameAlt": ["amul protein milk 35g"],
        "hindiName": "अमूल हाई प्रोटीन मिल्क",
        "searchTerms": ["amul", "high protein milk", "35g", "lactose free"],
        "category": "drink",
        "subcategory": "high-protein-milk",
        "itemType": "drink",
        "state": "ready-to-drink",
        "region": "pan-indian",
        "defaultServingGrams": 250,
        "brand": "Amul",
        "allergens": ["milk"],
        "per100g": {
            "calories": 90, "protein": 14.0, "carbs": 8.0, "fat": 0.2, "fiber": 0, "sodium": 60,
            "vitaminB12": 0.5, "vitaminD": 0, "iron": 0.1, "calcium": 150
        },
        "servings": [
            { "id": "pack-1", "label": "1 Pack (250ml)", "grams": 250 },
            { "id": "g100", "label": "100ml", "grams": 100 }
        ],
        "dietTypes": ["veg"],
        "tags": ["very-high-protein", "lactose-free", "low-fat"],
        "isProcessed": True, "isFastingFood": False, "fastingTypes": [],
        "isGlutenFree": True, "isRecipe": False, "containsRootVeg": False,
        "hasBeverageModifiers": False, "supportedConsistencyTypes": [], "consistencyMultipliers": {},
        "gi": 35, "cookingOilNote": None, "estimatedOilG": 0,
        "source": "FSSAI-label", "confidence": "high"
    },
    {
        "id": "drink-epigamia-proteinshake-chocolate",
        "name": "Epigamia Turbo Chocolate Protein Shake",
        "nameAlt": ["epigamia 25g protein shake"],
        "hindiName": "एपिगेमिया टर्बो प्रोटीन शेक",
        "searchTerms": ["epigamia", "turbo", "protein shake", "chocolate", "25g"],
        "category": "drink",
        "subcategory": "protein-shake-rtd",
        "itemType": "drink",
        "state": "ready-to-drink",
        "region": "pan-indian",
        "defaultServingGrams": 250,
        "brand": "Epigamia",
        "allergens": ["milk"],
        "per100g": {
            "calories": 54, "protein": 10.0, "carbs": 3.6, "fat": 0.4, "fiber": 0, "sodium": 50,
            "vitaminB12": 0.2, "vitaminD": 0, "iron": 0.5, "calcium": 120
        },
        "servings": [
            { "id": "pack-1", "label": "1 Bottle (250ml)", "grams": 250 },
            { "id": "g100", "label": "100ml", "grams": 100 }
        ],
        "dietTypes": ["veg"],
        "tags": ["high-protein", "no-added-sugar", "low-fat"],
        "isProcessed": True, "isFastingFood": False, "fastingTypes": [],
        "isGlutenFree": True, "isRecipe": False, "containsRootVeg": False,
        "hasBeverageModifiers": False, "supportedConsistencyTypes": [], "consistencyMultipliers": {},
        "gi": 40, "cookingOilNote": None, "estimatedOilG": 0,
        "source": "FSSAI-label", "confidence": "high"
    },
    {
        "id": "drink-muscleblaze-proteinshake-chocolate",
        "name": "MuscleBlaze Protein Shake (Chocolate)",
        "nameAlt": ["mb shake 18g"],
        "hindiName": "मसलब्लेज़ प्रोटीन शेक",
        "searchTerms": ["muscleblaze", "mb", "protein shake", "chocolate", "rtd"],
        "category": "drink",
        "subcategory": "protein-shake-rtd",
        "itemType": "drink",
        "state": "ready-to-drink",
        "region": "pan-indian",
        "defaultServingGrams": 200,
        "brand": "MuscleBlaze",
        "allergens": ["milk"],
        "per100g": {
            "calories": 65, "protein": 9.0, "carbs": 5.0, "fat": 1.0, "fiber": 0.5, "sodium": 60,
            "vitaminB12": 0, "vitaminD": 0, "iron": 0.5, "calcium": 100
        },
        "servings": [
            { "id": "pack-1", "label": "1 Bottle (200ml)", "grams": 200 }
        ],
        "dietTypes": ["veg"],
        "tags": ["high-protein"],
        "isProcessed": True, "isFastingFood": False, "fastingTypes": [],
        "isGlutenFree": True, "isRecipe": False, "containsRootVeg": False,
        "hasBeverageModifiers": False, "supportedConsistencyTypes": [], "consistencyMultipliers": {},
        "gi": 40, "cookingOilNote": None, "estimatedOilG": 0,
        "source": "curated-estimate", "confidence": "medium"
    },

    # -----------------------------
    # BREADS
    # -----------------------------
    {
        "id": "bread-britannia-white-slice",
        "name": "Britannia White Bread",
        "nameAlt": ["white bread slice"],
        "hindiName": "ब्रिटानिया वाइट ब्रेड",
        "searchTerms": ["britannia", "white bread", "maida bread", "slice"],
        "category": "roti-bread",
        "subcategory": "packaged-bread",
        "itemType": "base-food",
        "state": "raw",
        "region": "pan-indian",
        "defaultServingGrams": 25,
        "brand": "Britannia",
        "allergens": ["gluten", "soy"],
        "per100g": {
            "calories": 250, "protein": 7.0, "carbs": 50.0, "fat": 2.0, "fiber": 2.0, "sodium": 350,
            "vitaminB12": 0, "vitaminD": 0, "iron": 2.0, "calcium": 50
        },
        "servings": [
            { "id": "slice-1", "label": "1 Slice (25g)", "grams": 25 },
            { "id": "slice-2", "label": "2 Slices (50g)", "grams": 50 },
            { "id": "g100", "label": "100g", "grams": 100 }
        ],
        "dietTypes": ["vegan", "veg"],
        "tags": ["high-carb"],
        "isProcessed": True, "isFastingFood": False, "fastingTypes": [],
        "isGlutenFree": False, "isRecipe": False, "containsRootVeg": False,
        "hasBeverageModifiers": False, "supportedConsistencyTypes": [], "consistencyMultipliers": {},
        "gi": 75, "cookingOilNote": None, "estimatedOilG": 0,
        "source": "FSSAI-label", "confidence": "high"
    },
    {
        "id": "bread-britannia-brown-slice",
        "name": "Britannia Brown Bread",
        "nameAlt": ["brown bread slice"],
        "hindiName": "ब्रिटानिया ब्राउन ब्रेड",
        "searchTerms": ["britannia", "brown bread", "slice", "wheat bread"],
        "category": "roti-bread",
        "subcategory": "packaged-bread",
        "itemType": "base-food",
        "state": "raw",
        "region": "pan-indian",
        "defaultServingGrams": 25,
        "brand": "Britannia",
        "allergens": ["gluten", "soy"],
        "per100g": {
            "calories": 252, "protein": 8.0, "carbs": 48.0, "fat": 2.5, "fiber": 4.0, "sodium": 360,
            "vitaminB12": 0, "vitaminD": 0, "iron": 2.5, "calcium": 60
        },
        "servings": [
            { "id": "slice-1", "label": "1 Slice (25g)", "grams": 25 },
            { "id": "slice-2", "label": "2 Slices (50g)", "grams": 50 },
            { "id": "g100", "label": "100g", "grams": 100 }
        ],
        "dietTypes": ["vegan", "veg"],
        "tags": ["moderate-fiber"],
        "isProcessed": True, "isFastingFood": False, "fastingTypes": [],
        "isGlutenFree": False, "isRecipe": False, "containsRootVeg": False,
        "hasBeverageModifiers": False, "supportedConsistencyTypes": [], "consistencyMultipliers": {},
        "gi": 65, "cookingOilNote": None, "estimatedOilG": 0,
        "source": "FSSAI-label", "confidence": "high",
        "notes": "Blend of refined and whole wheat flour."
    },
    {
        "id": "bread-englishoven-100ww-slice",
        "name": "English Oven 100% Whole Wheat Bread",
        "nameAlt": ["english oven whole wheat"],
        "hindiName": "इंग्लिश ओवन 100% व्होल वीट ब्रेड",
        "searchTerms": ["english oven", "100% whole wheat", "zero maida", "brown bread", "slice"],
        "category": "roti-bread",
        "subcategory": "high-protein-bread",
        "itemType": "base-food",
        "state": "raw",
        "region": "pan-indian",
        "defaultServingGrams": 30,
        "brand": "English Oven",
        "allergens": ["gluten", "soy"],
        "per100g": {
            "calories": 281, "protein": 10.6, "carbs": 50.1, "fat": 2.0, "fiber": 10.0, "sodium": 474,
            "vitaminB12": 0, "vitaminD": 0, "iron": 3.0, "calcium": 70
        },
        "servings": [
            { "id": "slice-1", "label": "1 Slice (~30g)", "grams": 30 },
            { "id": "slice-2", "label": "2 Slices (~60g)", "grams": 60 },
            { "id": "g100", "label": "100g", "grams": 100 }
        ],
        "dietTypes": ["vegan", "veg"],
        "tags": ["high-fiber", "clean-label", "zero-maida"],
        "isProcessed": True, "isFastingFood": False, "fastingTypes": [],
        "isGlutenFree": False, "isRecipe": False, "containsRootVeg": False,
        "hasBeverageModifiers": False, "supportedConsistencyTypes": [], "consistencyMultipliers": {},
        "gi": 50, "cookingOilNote": None, "estimatedOilG": 0,
        "source": "FSSAI-label", "confidence": "high"
    },
    {
        "id": "bread-harvestgold-white-slice",
        "name": "Harvest Gold White Bread",
        "nameAlt": ["harvest gold white"],
        "hindiName": "हार्वेस्ट गोल्ड वाइट ब्रेड",
        "searchTerms": ["harvest gold", "white bread", "maida", "slice"],
        "category": "roti-bread",
        "subcategory": "packaged-bread",
        "itemType": "base-food",
        "state": "raw",
        "region": "pan-indian",
        "defaultServingGrams": 30,
        "brand": "Harvest Gold",
        "allergens": ["gluten", "soy"],
        "per100g": {
            "calories": 255, "protein": 7.5, "carbs": 52.0, "fat": 1.5, "fiber": 1.5, "sodium": 400,
            "vitaminB12": 0, "vitaminD": 0, "iron": 1.5, "calcium": 45
        },
        "servings": [
            { "id": "slice-1", "label": "1 Slice (~30g)", "grams": 30 },
            { "id": "slice-2", "label": "2 Slices (~60g)", "grams": 60 },
            { "id": "g100", "label": "100g", "grams": 100 }
        ],
        "dietTypes": ["vegan", "veg"],
        "tags": ["high-carb"],
        "isProcessed": True, "isFastingFood": False, "fastingTypes": [],
        "isGlutenFree": False, "isRecipe": False, "containsRootVeg": False,
        "hasBeverageModifiers": False, "supportedConsistencyTypes": [], "consistencyMultipliers": {},
        "gi": 75, "cookingOilNote": None, "estimatedOilG": 0,
        "source": "curated-estimate", "confidence": "medium"
    }
]

db_path = "/Users/ample/Desktop/fittrack-pro/src/data/foods/indianFoods.js"
with open(db_path, "r", encoding="utf-8") as file:
    content = file.read()

new_content = "\n  // ==========================================\n  // BRAND FOODS: BATCH B4 - RTD Shakes & Bread\n  // ==========================================\n"

for item in b4_data:
    js_str = json.dumps(item, indent=2, ensure_ascii=False)
    js_str = '  ' + js_str.replace('\n', '\n  ') + ',\n'
    new_content += js_str

new_content = new_content.rstrip(',\n') + '\n'

idx = content.rfind('];')
if idx != -1:
    content = content[:idx] + new_content + '];\n'
    with open(db_path, "w", encoding="utf-8") as file:
        file.write(content)
    print("Successfully injected Batch B4 RTD & Breads")
else:
    print("Could not find ];")
