import json
import os

pb_data = [
    # Pintola
    {
        "id": "pb-pintola-all-natural",
        "name": "Pintola All Natural Peanut Butter",
        "nameAlt": ["unsweetened peanut butter"],
        "hindiName": "पिनटोला नेचुरल पीनट बटर",
        "searchTerms": ["pintola", "all natural", "peanut butter", "unsweetened", "natural"],
        "category": "oil-fat",
        "subcategory": "peanut-butter",
        "itemType": "snack",
        "state": "raw",
        "region": "pan-indian",
        "defaultServingGrams": 32,
        "brand": "Pintola",
        "allergens": ["peanuts"],
        "per100g": {
            "calories": 600, "protein": 30.0, "carbs": 18.0, "fat": 50.0, "fiber": 9.0, "sodium": 10,
            "vitaminB12": 0, "vitaminD": 0, "iron": 1.5, "calcium": 45
        },
        "servings": [
            { "id": "tbsp-1", "label": "1 Tbsp", "grams": 15 },
            { "id": "tbsp-2", "label": "2 Tbsp (Standard)", "grams": 32 },
            { "id": "g100", "label": "100g", "grams": 100 }
        ],
        "dietTypes": ["vegan", "veg", "jain"],
        "tags": ["high-protein", "high-fat", "no-added-sugar"],
        "isProcessed": True, "isFastingFood": True, "fastingTypes": ["navratri", "ekadashi"],
        "isGlutenFree": True, "isRecipe": False, "containsRootVeg": False,
        "hasBeverageModifiers": False, "supportedConsistencyTypes": [], "consistencyMultipliers": {},
        "gi": 14, "cookingOilNote": None, "estimatedOilG": 0,
        "source": "FSSAI-label", "confidence": "high"
    },
    {
        "id": "pb-pintola-classic",
        "name": "Pintola Classic Peanut Butter",
        "nameAlt": ["sweetened peanut butter"],
        "hindiName": "पिनटोला क्लासिक पीनट बटर",
        "searchTerms": ["pintola", "classic", "peanut butter", "sweetened"],
        "category": "oil-fat",
        "subcategory": "peanut-butter",
        "itemType": "snack",
        "state": "raw",
        "region": "pan-indian",
        "defaultServingGrams": 32,
        "brand": "Pintola",
        "allergens": ["peanuts"],
        "per100g": {
            "calories": 605, "protein": 26.0, "carbs": 22.0, "fat": 44.6, "fiber": 7.2, "sodium": 280,
            "vitaminB12": 0, "vitaminD": 0, "iron": 1.2, "calcium": 40
        },
        "servings": [
            { "id": "tbsp-1", "label": "1 Tbsp", "grams": 15 },
            { "id": "tbsp-2", "label": "2 Tbsp (Standard)", "grams": 32 },
            { "id": "g100", "label": "100g", "grams": 100 }
        ],
        "dietTypes": ["veg", "vegan"],
        "tags": ["high-fat", "high-calorie"],
        "isProcessed": True, "isFastingFood": False, "fastingTypes": [],
        "isGlutenFree": True, "isRecipe": False, "containsRootVeg": False,
        "hasBeverageModifiers": False, "supportedConsistencyTypes": [], "consistencyMultipliers": {},
        "gi": 25, "cookingOilNote": None, "estimatedOilG": 0,
        "source": "FSSAI-label", "confidence": "high"
    },
    {
        "id": "pb-pintola-high-protein-dark-choco",
        "name": "Pintola High Protein Dark Chocolate Peanut Butter",
        "nameAlt": ["whey peanut butter"],
        "hindiName": "पिनटोला हाई प्रोटीन पीनट बटर",
        "searchTerms": ["pintola", "high protein", "dark chocolate", "whey"],
        "category": "supplement",
        "subcategory": "peanut-butter",
        "itemType": "supplement",
        "state": "raw",
        "region": "pan-indian",
        "defaultServingGrams": 32,
        "brand": "Pintola",
        "allergens": ["peanuts", "milk", "soy"],
        "per100g": {
            "calories": 583, "protein": 30.0, "carbs": 36.0, "fat": 38.0, "fiber": 6.2, "sodium": 120,
            "vitaminB12": 0, "vitaminD": 0, "iron": 2.0, "calcium": 60
        },
        "servings": [
            { "id": "tbsp-1", "label": "1 Tbsp", "grams": 15 },
            { "id": "tbsp-2", "label": "2 Tbsp (Standard)", "grams": 32 },
            { "id": "g100", "label": "100g", "grams": 100 }
        ],
        "dietTypes": ["veg"],
        "tags": ["very-high-protein", "high-sugar"],
        "isProcessed": True, "isFastingFood": False, "fastingTypes": [],
        "isGlutenFree": True, "isRecipe": False, "containsRootVeg": False,
        "hasBeverageModifiers": False, "supportedConsistencyTypes": [], "consistencyMultipliers": {},
        "gi": 35, "cookingOilNote": None, "estimatedOilG": 0,
        "source": "FSSAI-label", "confidence": "high"
    },
    
    # MyFitness
    {
        "id": "pb-myfitness-original",
        "name": "MyFitness Original Peanut Butter",
        "nameAlt": ["my fitness classic peanut butter"],
        "hindiName": "मायफिटनेस पीनट बटर",
        "searchTerms": ["myfitness", "original", "peanut butter", "sweetened"],
        "category": "oil-fat",
        "subcategory": "peanut-butter",
        "itemType": "snack",
        "state": "raw",
        "region": "pan-indian",
        "defaultServingGrams": 32,
        "brand": "MyFitness",
        "allergens": ["peanuts", "soy"],
        "per100g": {
            "calories": 620, "protein": 26.0, "carbs": 19.0, "fat": 46.0, "fiber": 6.0, "sodium": 300,
            "vitaminB12": 0, "vitaminD": 0, "iron": 1.1, "calcium": 35
        },
        "servings": [
            { "id": "tbsp-1", "label": "1 Tbsp", "grams": 15 },
            { "id": "tbsp-2", "label": "2 Tbsp (Standard)", "grams": 32 },
            { "id": "g100", "label": "100g", "grams": 100 }
        ],
        "dietTypes": ["veg", "vegan"],
        "tags": ["high-protein", "high-fat"],
        "isProcessed": True, "isFastingFood": False, "fastingTypes": [],
        "isGlutenFree": True, "isRecipe": False, "containsRootVeg": False,
        "hasBeverageModifiers": False, "supportedConsistencyTypes": [], "consistencyMultipliers": {},
        "gi": 25, "cookingOilNote": None, "estimatedOilG": 0,
        "source": "FSSAI-label", "confidence": "high"
    },
    {
        "id": "pb-myfitness-chocolate-crispy",
        "name": "MyFitness Chocolate Peanut Butter (Crispy)",
        "nameAlt": ["chocolate peanut butter my fitness"],
        "hindiName": "मायफिटनेस चॉकलेट पीनट बटर",
        "searchTerms": ["myfitness", "chocolate", "peanut butter", "crispy"],
        "category": "oil-fat",
        "subcategory": "peanut-butter",
        "itemType": "snack",
        "state": "raw",
        "region": "pan-indian",
        "defaultServingGrams": 30,
        "brand": "MyFitness",
        "allergens": ["peanuts", "soy"],
        "per100g": {
            "calories": 630, "protein": 24.0, "carbs": 30.0, "fat": 50.0, "fiber": 10.0, "sodium": 186,
            "vitaminB12": 0, "vitaminD": 0, "iron": 1.5, "calcium": 40
        },
        "servings": [
            { "id": "tbsp-1", "label": "1 Tbsp", "grams": 15 },
            { "id": "tbsp-2", "label": "2 Tbsp (Standard)", "grams": 30 },
            { "id": "g100", "label": "100g", "grams": 100 }
        ],
        "dietTypes": ["veg"],
        "tags": ["high-sugar", "high-fat"],
        "isProcessed": True, "isFastingFood": False, "fastingTypes": [],
        "isGlutenFree": True, "isRecipe": False, "containsRootVeg": False,
        "hasBeverageModifiers": False, "supportedConsistencyTypes": [], "consistencyMultipliers": {},
        "gi": 38, "cookingOilNote": None, "estimatedOilG": 0,
        "source": "FSSAI-label", "confidence": "high"
    },

    # Alpino
    {
        "id": "pb-alpino-natural",
        "name": "Alpino Natural Peanut Butter",
        "nameAlt": ["alpino unsweetened"],
        "hindiName": "अल्पिनो नेचुरल पीनट बटर",
        "searchTerms": ["alpino", "natural", "peanut butter", "unsweetened"],
        "category": "oil-fat",
        "subcategory": "peanut-butter",
        "itemType": "snack",
        "state": "raw",
        "region": "pan-indian",
        "defaultServingGrams": 32,
        "brand": "Alpino",
        "allergens": ["peanuts"],
        "per100g": {
            "calories": 625, "protein": 30.0, "carbs": 18.0, "fat": 49.0, "fiber": 9.0, "sodium": 25,
            "vitaminB12": 0, "vitaminD": 0, "iron": 1.5, "calcium": 40
        },
        "servings": [
            { "id": "tbsp-1", "label": "1 Tbsp", "grams": 15 },
            { "id": "tbsp-2", "label": "2 Tbsp (Standard)", "grams": 32 },
            { "id": "g100", "label": "100g", "grams": 100 }
        ],
        "dietTypes": ["vegan", "veg", "jain"],
        "tags": ["high-protein", "high-fat", "no-added-sugar"],
        "isProcessed": True, "isFastingFood": True, "fastingTypes": ["navratri", "ekadashi"],
        "isGlutenFree": True, "isRecipe": False, "containsRootVeg": False,
        "hasBeverageModifiers": False, "supportedConsistencyTypes": [], "consistencyMultipliers": {},
        "gi": 14, "cookingOilNote": None, "estimatedOilG": 0,
        "source": "FSSAI-label", "confidence": "high"
    },
    
    # Sundrop
    {
        "id": "pb-sundrop-crunchy",
        "name": "Sundrop Peanut Butter (Crunchy)",
        "nameAlt": ["sundrop regular peanut butter"],
        "hindiName": "सनड्रॉप पीनट बटर (क्रंची)",
        "searchTerms": ["sundrop", "peanut butter", "crunchy", "sweetened"],
        "category": "oil-fat",
        "subcategory": "peanut-butter",
        "itemType": "snack",
        "state": "raw",
        "region": "pan-indian",
        "defaultServingGrams": 30,
        "brand": "Sundrop",
        "allergens": ["peanuts", "soy"],
        "per100g": {
            "calories": 600, "protein": 26.0, "carbs": 20.0, "fat": 45.0, "fiber": 6.0, "sodium": 320,
            "vitaminB12": 0, "vitaminD": 0, "iron": 1.0, "calcium": 35
        },
        "servings": [
            { "id": "tbsp-1", "label": "1 Tbsp", "grams": 15 },
            { "id": "tbsp-2", "label": "2 Tbsp (Standard)", "grams": 30 },
            { "id": "g100", "label": "100g", "grams": 100 }
        ],
        "dietTypes": ["veg"],
        "tags": ["high-fat", "high-calorie"],
        "isProcessed": True, "isFastingFood": False, "fastingTypes": [],
        "isGlutenFree": True, "isRecipe": False, "containsRootVeg": False,
        "hasBeverageModifiers": False, "supportedConsistencyTypes": [], "consistencyMultipliers": {},
        "gi": 28, "cookingOilNote": None, "estimatedOilG": 0,
        "source": "FSSAI-label", "confidence": "high"
    },

    # MuscleBlaze
    {
        "id": "pb-muscleblaze-high-protein-dark-choco",
        "name": "MuscleBlaze High Protein Peanut Butter (Dark Choco)",
        "nameAlt": ["mb peanut butter"],
        "hindiName": "मसलब्लेज़ हाई प्रोटीन पीनट बटर",
        "searchTerms": ["muscleblaze", "mb", "high protein", "peanut butter", "dark chocolate"],
        "category": "supplement",
        "subcategory": "peanut-butter",
        "itemType": "supplement",
        "state": "raw",
        "region": "pan-indian",
        "defaultServingGrams": 30,
        "brand": "MuscleBlaze",
        "allergens": ["peanuts", "milk", "soy"],
        "per100g": {
            "calories": 590, "protein": 30.0, "carbs": 25.0, "fat": 42.0, "fiber": 5.0, "sodium": 100,
            "vitaminB12": 0, "vitaminD": 0, "iron": 1.5, "calcium": 50
        },
        "servings": [
            { "id": "tbsp-1", "label": "1 Tbsp", "grams": 15 },
            { "id": "tbsp-2", "label": "2 Tbsp (Standard)", "grams": 30 },
            { "id": "g100", "label": "100g", "grams": 100 }
        ],
        "dietTypes": ["veg"],
        "tags": ["very-high-protein"],
        "isProcessed": True, "isFastingFood": False, "fastingTypes": [],
        "isGlutenFree": True, "isRecipe": False, "containsRootVeg": False,
        "hasBeverageModifiers": False, "supportedConsistencyTypes": [], "consistencyMultipliers": {},
        "gi": 30, "cookingOilNote": None, "estimatedOilG": 0,
        "source": "FSSAI-label", "confidence": "high"
    },

    # Yogabar
    {
        "id": "pb-yogabar-natural",
        "name": "Yoga Bar 100% Peanut Butter",
        "nameAlt": ["yogabar natural PB"],
        "hindiName": "योगा बार पीनट बटर",
        "searchTerms": ["yogabar", "yoga bar", "peanut butter", "natural", "unsweetened"],
        "category": "oil-fat",
        "subcategory": "peanut-butter",
        "itemType": "snack",
        "state": "raw",
        "region": "pan-indian",
        "defaultServingGrams": 32,
        "brand": "Yoga Bar",
        "allergens": ["peanuts"],
        "per100g": {
            "calories": 646, "protein": 31.0, "carbs": 14.0, "fat": 51.5, "fiber": 6.2, "sodium": 20,
            "vitaminB12": 0, "vitaminD": 0, "iron": 1.0, "calcium": 40
        },
        "servings": [
            { "id": "tbsp-1", "label": "1 Tbsp", "grams": 15 },
            { "id": "tbsp-2", "label": "2 Tbsp (Standard)", "grams": 32 },
            { "id": "g100", "label": "100g", "grams": 100 }
        ],
        "dietTypes": ["vegan", "veg", "jain"],
        "tags": ["high-protein", "high-fat", "no-added-sugar"],
        "isProcessed": True, "isFastingFood": True, "fastingTypes": ["navratri"],
        "isGlutenFree": True, "isRecipe": False, "containsRootVeg": False,
        "hasBeverageModifiers": False, "supportedConsistencyTypes": [], "consistencyMultipliers": {},
        "gi": 14, "cookingOilNote": None, "estimatedOilG": 0,
        "source": "FSSAI-label", "confidence": "high"
    },

    # The Whole Truth
    {
        "id": "pb-twt-natural-100peanut",
        "name": "The Whole Truth Peanut Butter (Natural)",
        "nameAlt": ["twt 100% peanut butter"],
        "hindiName": "द होल ट्रुथ पीनट बटर",
        "searchTerms": ["the whole truth", "twt", "peanut butter", "natural", "unsweetened"],
        "category": "oil-fat",
        "subcategory": "peanut-butter",
        "itemType": "snack",
        "state": "raw",
        "region": "pan-indian",
        "defaultServingGrams": 32,
        "brand": "The Whole Truth",
        "allergens": ["peanuts"],
        "per100g": {
            "calories": 651.4, "protein": 25.0, "carbs": 17.7, "fat": 53.4, "fiber": 8.7, "sodium": 26,
            "vitaminB12": 0, "vitaminD": 0, "iron": 1.1, "calcium": 35
        },
        "servings": [
            { "id": "tbsp-1", "label": "1 Tbsp", "grams": 15 },
            { "id": "tbsp-2", "label": "2 Tbsp (Standard)", "grams": 32 },
            { "id": "g100", "label": "100g", "grams": 100 }
        ],
        "dietTypes": ["vegan", "veg", "jain"],
        "tags": ["high-fat", "no-added-sugar", "clean-label"],
        "isProcessed": True, "isFastingFood": True, "fastingTypes": ["navratri"],
        "isGlutenFree": True, "isRecipe": False, "containsRootVeg": False,
        "hasBeverageModifiers": False, "supportedConsistencyTypes": [], "consistencyMultipliers": {},
        "gi": 14, "cookingOilNote": None, "estimatedOilG": 0,
        "source": "FSSAI-label", "confidence": "high"
    },

    # Happilo
    {
        "id": "pb-happilo-natural",
        "name": "Happilo All Natural Peanut Butter",
        "nameAlt": ["happilo unsweetened pb"],
        "hindiName": "हैपिलो नेचुरल पीनट बटर",
        "searchTerms": ["happilo", "natural", "peanut butter", "unsweetened"],
        "category": "oil-fat",
        "subcategory": "peanut-butter",
        "itemType": "snack",
        "state": "raw",
        "region": "pan-indian",
        "defaultServingGrams": 32,
        "brand": "Happilo",
        "allergens": ["peanuts"],
        "per100g": {
            "calories": 646, "protein": 29.0, "carbs": 20.0, "fat": 50.0, "fiber": 6.0, "sodium": 30,
            "vitaminB12": 0, "vitaminD": 0, "iron": 1.2, "calcium": 40
        },
        "servings": [
            { "id": "tbsp-1", "label": "1 Tbsp", "grams": 15 },
            { "id": "tbsp-2", "label": "2 Tbsp (Standard)", "grams": 32 },
            { "id": "g100", "label": "100g", "grams": 100 }
        ],
        "dietTypes": ["vegan", "veg", "jain"],
        "tags": ["high-protein", "high-fat", "no-added-sugar"],
        "isProcessed": True, "isFastingFood": True, "fastingTypes": ["navratri"],
        "isGlutenFree": True, "isRecipe": False, "containsRootVeg": False,
        "hasBeverageModifiers": False, "supportedConsistencyTypes": [], "consistencyMultipliers": {},
        "gi": 14, "cookingOilNote": None, "estimatedOilG": 0,
        "source": "FSSAI-label", "confidence": "high"
    },

    # Saffola Fittify
    {
        "id": "pb-saffola-fittify-plant-protein-creamy",
        "name": "Saffola FITTIFY Plant Protein Peanut Butter",
        "nameAlt": ["saffola peanut butter fittify"],
        "hindiName": "सफोला फिट्टीफाई प्लांट प्रोटीन पीनट बटर",
        "searchTerms": ["saffola", "fittify", "plant protein", "peanut butter", "creamy"],
        "category": "supplement",
        "subcategory": "peanut-butter",
        "itemType": "supplement",
        "state": "raw",
        "region": "pan-indian",
        "defaultServingGrams": 32,
        "brand": "Saffola FITTIFY",
        "allergens": ["peanuts"],
        "per100g": {
            "calories": 634, "protein": 34.5, "carbs": 12.3, "fat": 49.6, "fiber": 6.3, "sodium": 112,
            "vitaminB12": 0, "vitaminD": 0, "iron": 2.0, "calcium": 45
        },
        "servings": [
            { "id": "tbsp-1", "label": "1 Tbsp", "grams": 15 },
            { "id": "tbsp-2", "label": "2 Tbsp (Standard)", "grams": 32 },
            { "id": "g100", "label": "100g", "grams": 100 }
        ],
        "dietTypes": ["vegan", "veg", "jain"],
        "tags": ["very-high-protein"],
        "isProcessed": True, "isFastingFood": False, "fastingTypes": [],
        "isGlutenFree": True, "isRecipe": False, "containsRootVeg": False,
        "hasBeverageModifiers": False, "supportedConsistencyTypes": [], "consistencyMultipliers": {},
        "gi": 18, "cookingOilNote": None, "estimatedOilG": 0,
        "source": "FSSAI-label", "confidence": "high"
    },

    # Dr Oetker FunFoods
    {
        "id": "pb-droetker-funfoods-crunchy",
        "name": "Dr. Oetker FunFoods Crunchy Peanut Butter",
        "nameAlt": ["funfoods peanut butter"],
        "hindiName": "डॉ ओटेकर फनफूड्स पीनट बटर",
        "searchTerms": ["dr oetker", "funfoods", "peanut butter", "crunchy"],
        "category": "oil-fat",
        "subcategory": "peanut-butter",
        "itemType": "snack",
        "state": "raw",
        "region": "pan-indian",
        "defaultServingGrams": 32,
        "brand": "Dr. Oetker FunFoods",
        "allergens": ["peanuts", "soy"],
        "per100g": {
            "calories": 636, "protein": 25.6, "carbs": 20.3, "fat": 50.3, "fiber": 6.5, "sodium": 345,
            "vitaminB12": 0, "vitaminD": 0, "iron": 1.1, "calcium": 40
        },
        "servings": [
            { "id": "tbsp-1", "label": "1 Tbsp", "grams": 15 },
            { "id": "tbsp-2", "label": "2 Tbsp (Standard)", "grams": 32 },
            { "id": "g100", "label": "100g", "grams": 100 }
        ],
        "dietTypes": ["veg"],
        "tags": ["high-fat", "high-calorie"],
        "isProcessed": True, "isFastingFood": False, "fastingTypes": [],
        "isGlutenFree": True, "isRecipe": False, "containsRootVeg": False,
        "hasBeverageModifiers": False, "supportedConsistencyTypes": [], "consistencyMultipliers": {},
        "gi": 28, "cookingOilNote": None, "estimatedOilG": 0,
        "source": "FSSAI-label", "confidence": "high"
    }
]

db_path = "/Users/ample/Desktop/fittrack-pro/src/data/foods/indianFoods.js"
with open(db_path, "r", encoding="utf-8") as file:
    content = file.read()

new_content = "\n  // ==========================================\n  // BRAND FOODS: BATCH B1 - Peanut Butters (Pass 1)\n  // ==========================================\n"

for item in pb_data:
    js_str = json.dumps(item, indent=2, ensure_ascii=False)
    # Convert formatting
    js_str = '  ' + js_str.replace('\n', '\n  ') + ',\n'
    new_content += js_str

new_content = new_content.rstrip(',\n') + '\n'

# Find the last "];" carefully using string slicing
idx = content.rfind('];')
if idx != -1:
    content = content[:idx] + new_content + '];\n'
    with open(db_path, "w", encoding="utf-8") as file:
        file.write(content)
    print("Successfully injected Batch 1 Brand Foods via Python script!")
else:
    print("Could not find ]; block end!")

