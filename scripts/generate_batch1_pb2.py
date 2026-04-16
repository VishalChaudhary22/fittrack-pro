import json
import os
import re

pb_data = [
    # Disano Natural
    {
        "id": "pb-disano-natural",
        "name": "DiSano Natural Peanut Butter (Unsweetened)",
        "nameAlt": ["disano unsweetened pb"],
        "hindiName": "दिसानो नेचुरल पीनट बटर",
        "searchTerms": ["disano", "natural", "peanut butter", "unsweetened"],
        "category": "oil-fat",
        "subcategory": "peanut-butter",
        "itemType": "snack",
        "state": "raw",
        "region": "pan-indian",
        "defaultServingGrams": 32,
        "brand": "DiSano",
        "allergens": ["peanuts"],
        "per100g": {
            "calories": 639, "protein": 30.0, "carbs": 18.0, "fat": 49.0, "fiber": 9.0, "sodium": 19,
            "vitaminB12": 0, "vitaminD": 0, "iron": 1.5, "calcium": 40
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
    # Bagrry's Natural
    {
        "id": "pb-bagrrys-natural",
        "name": "Bagrry's Natural Peanut Butter",
        "nameAlt": ["bagrrys unsweetened pb"],
        "hindiName": "बॅगरीज नेचुरल पीनट बटर",
        "searchTerms": ["bagrrys", "bagrry", "natural", "peanut butter", "unsweetened"],
        "category": "oil-fat",
        "subcategory": "peanut-butter",
        "itemType": "snack",
        "state": "raw",
        "region": "pan-indian",
        "defaultServingGrams": 32,
        "brand": "Bagrry's",
        "allergens": ["peanuts"],
        "per100g": {
            "calories": 640, "protein": 30.0, "carbs": 18.0, "fat": 50.0, "fiber": 9.0, "sodium": 20,
            "vitaminB12": 0, "vitaminD": 0, "iron": 1.5, "calcium": 40
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
    # Nutralite Protein
    {
        "id": "pb-nutralite-protein",
        "name": "Nutralite Activ Protein Peanut Butter Crunchy",
        "nameAlt": ["nutralite peanut butter"],
        "hindiName": "न्यूट्रालाइट प्रोटीन पीनट बटर",
        "searchTerms": ["nutralite", "activ", "protein", "peanut butter"],
        "category": "supplement",
        "subcategory": "peanut-butter",
        "itemType": "supplement",
        "state": "raw",
        "region": "pan-indian",
        "defaultServingGrams": 32,
        "brand": "Nutralite",
        "allergens": ["peanuts"],
        "per100g": {
            "calories": 600, "protein": 26.0, "carbs": 20.0, "fat": 45.0, "fiber": 6.0, "sodium": 200,
            "vitaminB12": 0, "vitaminD": 0, "iron": 1.5, "calcium": 40
        },
        "servings": [
            { "id": "tbsp-1", "label": "1 Tbsp", "grams": 15 },
            { "id": "tbsp-2", "label": "2 Tbsp (Standard)", "grams": 32 },
            { "id": "g100", "label": "100g", "grams": 100 }
        ],
        "dietTypes": ["vegan", "veg"],
        "tags": ["high-protein"],
        "isProcessed": True, "isFastingFood": False, "fastingTypes": [],
        "isGlutenFree": True, "isRecipe": False, "containsRootVeg": False,
        "hasBeverageModifiers": False, "supportedConsistencyTypes": [], "consistencyMultipliers": {},
        "gi": 25, "cookingOilNote": None, "estimatedOilG": 0,
        "source": "curated-estimate", "confidence": "medium"
    },
    # RiteBite
    {
        "id": "pb-ritebite-max-protein",
        "name": "RiteBite Max Protein Peanut Butter",
        "nameAlt": ["max protein pb"],
        "hindiName": "रइटबाइट मैक्स प्रोटीन पीनट बटर",
        "searchTerms": ["ritebite", "max protein", "peanut butter"],
        "category": "supplement",
        "subcategory": "peanut-butter",
        "itemType": "supplement",
        "state": "raw",
        "region": "pan-indian",
        "defaultServingGrams": 32,
        "brand": "RiteBite",
        "allergens": ["peanuts"],
        "per100g": {
            "calories": 600, "protein": 26.0, "carbs": 20.0, "fat": 45.0, "fiber": 6.0, "sodium": 150,
            "vitaminB12": 0, "vitaminD": 0, "iron": 1.5, "calcium": 40
        },
        "servings": [
            { "id": "tbsp-1", "label": "1 Tbsp", "grams": 15 },
            { "id": "tbsp-2", "label": "2 Tbsp (Standard)", "grams": 32 },
            { "id": "g100", "label": "100g", "grams": 100 }
        ],
        "dietTypes": ["veg"],
        "tags": ["high-protein", "high-fat"],
        "isProcessed": True, "isFastingFood": False, "fastingTypes": [],
        "isGlutenFree": True, "isRecipe": False, "containsRootVeg": False,
        "hasBeverageModifiers": False, "supportedConsistencyTypes": [], "consistencyMultipliers": {},
        "gi": 25, "cookingOilNote": None, "estimatedOilG": 0,
        "source": "curated-estimate", "confidence": "medium"
    },
    # Jus Amazin
    {
        "id": "pb-jusamazin-crunchy-organic",
        "name": "Jus Amazin Organic Peanut Butter (Crunchy)",
        "nameAlt": ["jus amazin pb unsweetened"],
        "hindiName": "जस अमेज़िन ऑर्गेनिक पीनट बटर",
        "searchTerms": ["jus amazin", "organic", "peanut butter", "unsweetened", "crunchy"],
        "category": "oil-fat",
        "subcategory": "peanut-butter",
        "itemType": "snack",
        "state": "raw",
        "region": "pan-indian",
        "defaultServingGrams": 32,
        "brand": "Jus Amazin",
        "allergens": ["peanuts"],
        "per100g": {
            "calories": 576.4, "protein": 27.8, "carbs": 29.3, "fat": 38.6, "fiber": 14.2, "sodium": 15,
            "vitaminB12": 0, "vitaminD": 0, "iron": 2.0, "calcium": 40
        },
        "servings": [
            { "id": "tbsp-1", "label": "1 Tbsp", "grams": 15 },
            { "id": "tbsp-2", "label": "2 Tbsp (Standard)", "grams": 32 },
            { "id": "g100", "label": "100g", "grams": 100 }
        ],
        "dietTypes": ["vegan", "veg", "jain"],
        "tags": ["high-protein", "organic", "no-added-sugar", "clean-label"],
        "isProcessed": True, "isFastingFood": True, "fastingTypes": ["navratri"],
        "isGlutenFree": True, "isRecipe": False, "containsRootVeg": False,
        "hasBeverageModifiers": False, "supportedConsistencyTypes": [], "consistencyMultipliers": {},
        "gi": 14, "cookingOilNote": None, "estimatedOilG": 0,
        "source": "FSSAI-label", "confidence": "high"
    },
    
    # ALMOND BUTTERS
    {
        "id": "nb-pintola-almond-unsweetened",
        "name": "Pintola Almond Butter (Unsweetened)",
        "nameAlt": ["pintola natural almond butter"],
        "hindiName": "पिनटोला बादाम मक्खन",
        "searchTerms": ["pintola", "almond butter", "unsweetened", "natural"],
        "category": "oil-fat",
        "subcategory": "nut-butter",
        "itemType": "snack",
        "state": "raw",
        "region": "pan-indian",
        "defaultServingGrams": 32,
        "brand": "Pintola",
        "allergens": ["tree-nuts"],
        "per100g": {
            "calories": 582, "protein": 24.0, "carbs": 22.0, "fat": 49.0, "fiber": 12.0, "sodium": 1,
            "vitaminB12": 0, "vitaminD": 0, "iron": 3.7, "calcium": 269
        },
        "servings": [
            { "id": "tbsp-1", "label": "1 Tbsp", "grams": 15 },
            { "id": "tbsp-2", "label": "2 Tbsp (Standard)", "grams": 32 },
            { "id": "g100", "label": "100g", "grams": 100 }
        ],
        "dietTypes": ["vegan", "veg", "jain"],
        "tags": ["high-fat", "no-added-sugar", "keto-friendly"],
        "isProcessed": True, "isFastingFood": True, "fastingTypes": ["navratri", "ekadashi"],
        "isGlutenFree": True, "isRecipe": False, "containsRootVeg": False,
        "hasBeverageModifiers": False, "supportedConsistencyTypes": [], "consistencyMultipliers": {},
        "gi": 10, "cookingOilNote": None, "estimatedOilG": 0,
        "source": "FSSAI-label", "confidence": "high"
    },
    {
        "id": "nb-happilo-almond-unsweetened",
        "name": "Happilo All Natural Almond Butter",
        "nameAlt": ["happilo unsweetened almond butter"],
        "hindiName": "हैपिलो बादाम मक्खन",
        "searchTerms": ["happilo", "almond butter", "unsweetened", "natural"],
        "category": "oil-fat",
        "subcategory": "nut-butter",
        "itemType": "snack",
        "state": "raw",
        "region": "pan-indian",
        "defaultServingGrams": 32,
        "brand": "Happilo",
        "allergens": ["tree-nuts"],
        "per100g": {
            "calories": 600, "protein": 22.0, "carbs": 20.0, "fat": 50.0, "fiber": 12.0, "sodium": 5,
            "vitaminB12": 0, "vitaminD": 0, "iron": 3.5, "calcium": 260
        },
        "servings": [
            { "id": "tbsp-1", "label": "1 Tbsp", "grams": 15 },
            { "id": "tbsp-2", "label": "2 Tbsp (Standard)", "grams": 32 },
            { "id": "g100", "label": "100g", "grams": 100 }
        ],
        "dietTypes": ["vegan", "veg", "jain"],
        "tags": ["high-fat", "no-added-sugar", "keto-friendly"],
        "isProcessed": True, "isFastingFood": True, "fastingTypes": ["navratri", "ekadashi"],
        "isGlutenFree": True, "isRecipe": False, "containsRootVeg": False,
        "hasBeverageModifiers": False, "supportedConsistencyTypes": [], "consistencyMultipliers": {},
        "gi": 10, "cookingOilNote": None, "estimatedOilG": 0,
        "source": "curated-estimate", "confidence": "medium"
    },
    {
        "id": "nb-twt-almond-unsweetened",
        "name": "The Whole Truth Almond Butter",
        "nameAlt": ["twt 100% almond butter"],
        "hindiName": "द होल ट्रुथ बादाम मक्खन",
        "searchTerms": ["the whole truth", "twt", "almond butter", "unsweetened", "100%"],
        "category": "oil-fat",
        "subcategory": "nut-butter",
        "itemType": "snack",
        "state": "raw",
        "region": "pan-indian",
        "defaultServingGrams": 32,
        "brand": "The Whole Truth",
        "allergens": ["tree-nuts"],
        "per100g": {
            "calories": 620, "protein": 21.0, "carbs": 18.0, "fat": 52.0, "fiber": 11.0, "sodium": 5,
            "vitaminB12": 0, "vitaminD": 0, "iron": 3.4, "calcium": 265
        },
        "servings": [
            { "id": "tbsp-1", "label": "1 Tbsp", "grams": 15 },
            { "id": "tbsp-2", "label": "2 Tbsp (Standard)", "grams": 32 },
            { "id": "g100", "label": "100g", "grams": 100 }
        ],
        "dietTypes": ["vegan", "veg", "jain"],
        "tags": ["high-fat", "no-added-sugar", "clean-label", "keto-friendly"],
        "isProcessed": True, "isFastingFood": True, "fastingTypes": ["navratri", "ekadashi"],
        "isGlutenFree": True, "isRecipe": False, "containsRootVeg": False,
        "hasBeverageModifiers": False, "supportedConsistencyTypes": [], "consistencyMultipliers": {},
        "gi": 10, "cookingOilNote": None, "estimatedOilG": 0,
        "source": "curated-estimate", "confidence": "medium"
    }
]

db_path = "/Users/ample/Desktop/fittrack-pro/src/data/foods/indianFoods.js"
with open(db_path, "r", encoding="utf-8") as file:
    content = file.read()

new_content = "\n  // ==========================================\n  // BRAND FOODS: BATCH B1 - Nut Butters (Pass 2)\n  // ==========================================\n"

for item in pb_data:
    js_str = json.dumps(item, indent=2, ensure_ascii=False)
    js_str = '  ' + js_str.replace('\n', '\n  ') + ',\n'
    new_content += js_str

new_content = new_content.rstrip(',\n') + '\n'

idx = content.rfind('];')
if idx != -1:
    content = content[:idx] + new_content + '];\n'
    with open(db_path, "w", encoding="utf-8") as file:
        file.write(content)
    print("Successfully injected Pass 2 of Batch B1 Brand Foods")
else:
    print("Could not find ];")
