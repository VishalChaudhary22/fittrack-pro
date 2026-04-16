import json
import os

b3_data = [
    # -----------------------------
    # OATS (PLAIN)
    # -----------------------------
    {
        "id": "oats-quaker-rolled",
        "name": "Quaker Rolled Oats",
        "nameAlt": ["quaker plain oats"],
        "hindiName": "क्वेकर रोल्ड ओट्स",
        "searchTerms": ["quaker", "oats", "rolled", "plain", "breakfast"],
        "category": "grain-cereal",
        "subcategory": "breakfast-oats",
        "itemType": "base-food",
        "state": "raw",
        "region": "pan-indian",
        "defaultServingGrams": 40,
        "brand": "Quaker",
        "allergens": ["oats"],
        "per100g": {
            "calories": 380, "protein": 13.0, "carbs": 68.0, "fat": 6.5, "fiber": 10.0, "sodium": 5,
            "vitaminB12": 0, "vitaminD": 0, "iron": 4.0, "calcium": 50
        },
        "servings": [
            { "id": "cup-half", "label": "1/2 cup (dry)", "grams": 40 },
            { "id": "g100", "label": "100g", "grams": 100 }
        ],
        "dietTypes": ["vegan", "veg", "jain"],
        "tags": ["high-fiber"],
        "isProcessed": False, "isFastingFood": False, "fastingTypes": [],
        "isGlutenFree": False, "isRecipe": False, "containsRootVeg": False,
        "hasBeverageModifiers": False,
        "supportedConsistencyTypes": ["porridge"],
        "consistencyMultipliers": { "porridge": 0.25 },
        "gi": 55, "cookingOilNote": "Use milk or water to boil.", "estimatedOilG": 0,
        "source": "curated-estimate", "confidence": "high"
    },
    {
        "id": "oats-bagrrys-rolled",
        "name": "Bagrry's White Oats (Rolled)",
        "nameAlt": ["bagrrys plain oats"],
        "hindiName": "बॅगरीज व्हाइट ओट्स",
        "searchTerms": ["bagrrys", "bagrry", "oats", "white", "plain"],
        "category": "grain-cereal",
        "subcategory": "breakfast-oats",
        "itemType": "base-food",
        "state": "raw",
        "region": "pan-indian",
        "defaultServingGrams": 40,
        "brand": "Bagrry's",
        "allergens": ["oats"],
        "per100g": {
            "calories": 380, "protein": 14.0, "carbs": 66.0, "fat": 8.0, "fiber": 10.5, "sodium": 5,
            "vitaminB12": 0, "vitaminD": 0, "iron": 4.0, "calcium": 50
        },
        "servings": [
            { "id": "cup-half", "label": "1/2 cup (dry)", "grams": 40 },
            { "id": "g100", "label": "100g", "grams": 100 }
        ],
        "dietTypes": ["vegan", "veg", "jain"],
        "tags": ["high-fiber", "clean-label"],
        "isProcessed": False, "isFastingFood": False, "fastingTypes": [],
        "isGlutenFree": False, "isRecipe": False, "containsRootVeg": False,
        "hasBeverageModifiers": False,
        "supportedConsistencyTypes": ["porridge"],
        "consistencyMultipliers": { "porridge": 0.25 },
        "gi": 55, "cookingOilNote": "Use milk or water to boil.", "estimatedOilG": 0,
        "source": "curated-estimate", "confidence": "high"
    },

    # -----------------------------
    # MASALA OATS
    # -----------------------------
    {
        "id": "oats-saffola-masala-classic",
        "name": "Saffola Masala Oats (Classic Masala)",
        "nameAlt": ["saffola masala oats"],
        "hindiName": "सफोला मसाला ओट्स",
        "searchTerms": ["saffola", "masala oats", "classic masala", "savoury"],
        "category": "grain-cereal",
        "subcategory": "breakfast-oats",
        "itemType": "base-food",
        "state": "raw",
        "region": "pan-indian",
        "defaultServingGrams": 40,
        "brand": "Saffola",
        "allergens": ["oats", "soy", "gluten"],
        "per100g": {
            "calories": 380, "protein": 10.0, "carbs": 65.0, "fat": 8.0, "fiber": 10.0, "sodium": 1100,
            "vitaminB12": 0, "vitaminD": 0, "iron": 2.0, "calcium": 40
        },
        "servings": [
            { "id": "pouch-1", "label": "1 Small Pouch (40g dry)", "grams": 40 },
            { "id": "g100", "label": "100g", "grams": 100 }
        ],
        "dietTypes": ["veg"],
        "tags": ["high-sodium", "savoury"],
        "isProcessed": True, "isFastingFood": False, "fastingTypes": [],
        "isGlutenFree": False, "isRecipe": False, "containsRootVeg": True,
        "hasBeverageModifiers": False,
        "supportedConsistencyTypes": ["cooked"],
        "consistencyMultipliers": { "cooked": 0.3 },
        "gi": 60, "cookingOilNote": "Cooked with water.", "estimatedOilG": 0,
        "source": "FSSAI-label", "confidence": "high"
    },

    # -----------------------------
    # MUESLI & GRANOLA
    # -----------------------------
    {
        "id": "muesli-bagrrys-no-added-sugar",
        "name": "Bagrry's Muesli (No Added Sugar)",
        "nameAlt": ["bagrrys diet muesli"],
        "hindiName": "बॅगरीज मूसली नो एडेड शुगर",
        "searchTerms": ["bagrrys", "bagrry", "muesli", "no added sugar", "nas"],
        "category": "breakfast",
        "subcategory": "muesli",
        "itemType": "base-food",
        "state": "raw",
        "region": "pan-indian",
        "defaultServingGrams": 30,
        "brand": "Bagrry's",
        "allergens": ["gluten", "tree-nuts"],
        "per100g": {
            "calories": 383, "protein": 10.0, "carbs": 75.0, "fat": 5.0, "fiber": 10.0, "sodium": 50,
            "vitaminB12": 0, "vitaminD": 0, "iron": 3.0, "calcium": 60
        },
        "servings": [
            { "id": "bowl-1", "label": "1 Bowl (30g)", "grams": 30 },
            { "id": "g100", "label": "100g", "grams": 100 }
        ],
        "dietTypes": ["vegan", "veg"],
        "tags": ["no-added-sugar", "high-fiber"],
        "isProcessed": True, "isFastingFood": False, "fastingTypes": [],
        "isGlutenFree": False, "isRecipe": False, "containsRootVeg": False,
        "hasBeverageModifiers": False, "supportedConsistencyTypes": [], "consistencyMultipliers": {},
        "gi": 50, "cookingOilNote": None, "estimatedOilG": 0,
        "source": "FSSAI-label", "confidence": "high"
    },
    {
        "id": "muesli-yogabar-protein-chocoalmond",
        "name": "Yogabar High Protein Muesli (Choco Almond)",
        "nameAlt": ["yogabar protein muesli"],
        "hindiName": "योगा बार प्रोटीन मूसली",
        "searchTerms": ["yogabar", "muesli", "high protein", "choco almond"],
        "category": "breakfast",
        "subcategory": "muesli",
        "itemType": "base-food",
        "state": "raw",
        "region": "pan-indian",
        "defaultServingGrams": 50,
        "brand": "Yogabar",
        "allergens": ["soy", "tree-nuts", "milk", "gluten"],
        "per100g": {
            "calories": 430, "protein": 25.0, "carbs": 55.0, "fat": 11.4, "fiber": 9.0, "sodium": 150,
            "vitaminB12": 0, "vitaminD": 0, "iron": 3.5, "calcium": 80
        },
        "servings": [
            { "id": "bowl-1", "label": "1 Bowl (50g)", "grams": 50 },
            { "id": "g100", "label": "100g", "grams": 100 }
        ],
        "dietTypes": ["veg"],
        "tags": ["high-protein"],
        "isProcessed": True, "isFastingFood": False, "fastingTypes": [],
        "isGlutenFree": False, "isRecipe": False, "containsRootVeg": False,
        "hasBeverageModifiers": False, "supportedConsistencyTypes": [], "consistencyMultipliers": {},
        "gi": 55, "cookingOilNote": None, "estimatedOilG": 0,
        "source": "FSSAI-label", "confidence": "high"
    },
    {
        "id": "granola-trueelements-dark-choc",
        "name": "True Elements Baked Granola (Dark Chocolate)",
        "nameAlt": ["true elements granola"],
        "hindiName": "ट्रू एलीमेंट्स बेक्ड ग्रेनोला",
        "searchTerms": ["true elements", "granola", "baked", "dark chocolate"],
        "category": "breakfast",
        "subcategory": "granola",
        "itemType": "base-food",
        "state": "raw",
        "region": "pan-indian",
        "defaultServingGrams": 30,
        "brand": "True Elements",
        "allergens": ["tree-nuts", "oats"],
        "per100g": {
            "calories": 431, "protein": 11.8, "carbs": 71.2, "fat": 11.0, "fiber": 10.0, "sodium": 19,
            "vitaminB12": 0, "vitaminD": 0, "iron": 2.5, "calcium": 60
        },
        "servings": [
            { "id": "bowl-1", "label": "1 Bowl (30g)", "grams": 30 },
            { "id": "g100", "label": "100g", "grams": 100 }
        ],
        "dietTypes": ["veg"],
        "tags": ["high-fiber"],
        "isProcessed": True, "isFastingFood": False, "fastingTypes": [],
        "isGlutenFree": False, "isRecipe": False, "containsRootVeg": False,
        "hasBeverageModifiers": False, "supportedConsistencyTypes": [], "consistencyMultipliers": {},
        "gi": 55, "cookingOilNote": None, "estimatedOilG": 0,
        "source": "FSSAI-label", "confidence": "high"
    },
    {
        "id": "muesli-muscleblaze-dark-choco-cranberry",
        "name": "MuscleBlaze Protein Muesli (Dark Choco Cranberry)",
        "nameAlt": ["mb muesli"],
        "hindiName": "मसलब्लेज़ प्रोटीन मूसली",
        "searchTerms": ["muscleblaze", "mb", "muesli", "protein", "dark choco", "cranberry"],
        "category": "breakfast",
        "subcategory": "muesli",
        "itemType": "base-food",
        "state": "raw",
        "region": "pan-indian",
        "defaultServingGrams": 50,
        "brand": "MuscleBlaze",
        "allergens": ["soy", "gluten", "milk"],
        "per100g": {
            "calories": 410, "protein": 22.0, "carbs": 58.0, "fat": 10.0, "fiber": 7.0, "sodium": 160,
            "vitaminB12": 0, "vitaminD": 0, "iron": 3.0, "calcium": 80
        },
        "servings": [
            { "id": "bowl-1", "label": "1 Bowl (50g)", "grams": 50 },
            { "id": "g100", "label": "100g", "grams": 100 }
        ],
        "dietTypes": ["veg"],
        "tags": ["high-protein"],
        "isProcessed": True, "isFastingFood": False, "fastingTypes": [],
        "isGlutenFree": False, "isRecipe": False, "containsRootVeg": False,
        "hasBeverageModifiers": False, "supportedConsistencyTypes": [], "consistencyMultipliers": {},
        "gi": 55, "cookingOilNote": None, "estimatedOilG": 0,
        "source": "curated-estimate", "confidence": "medium"
    },
    {
        "id": "muesli-soulfull-millet-muesli-crunchy",
        "name": "Tata Soulfull Millet Muesli (Crunchy)",
        "nameAlt": ["tata soulfull muesli", "millet muesli"],
        "hindiName": "टाटा सोलफुल मिलेट मूसली",
        "searchTerms": ["tata", "soulfull", "millet", "muesli", "crunchy"],
        "category": "breakfast",
        "subcategory": "muesli",
        "itemType": "base-food",
        "state": "raw",
        "region": "pan-indian",
        "defaultServingGrams": 40,
        "brand": "TATA Soulfull",
        "allergens": ["tree-nuts", "gluten"],
        "per100g": {
            "calories": 390, "protein": 9.0, "carbs": 75.0, "fat": 5.7, "fiber": 8.0, "sodium": 185,
            "vitaminB12": 0, "vitaminD": 0, "iron": 2.5, "calcium": 70
        },
        "servings": [
            { "id": "bowl-1", "label": "1 Bowl (40g)", "grams": 40 },
            { "id": "g100", "label": "100g", "grams": 100 }
        ],
        "dietTypes": ["veg"],
        "tags": ["millet-based"],
        "isProcessed": True, "isFastingFood": False, "fastingTypes": [],
        "isGlutenFree": False, "isRecipe": False, "containsRootVeg": False,
        "hasBeverageModifiers": False, "supportedConsistencyTypes": [], "consistencyMultipliers": {},
        "gi": 55, "cookingOilNote": None, "estimatedOilG": 0,
        "source": "FSSAI-label", "confidence": "high"
    },
    {
        "id": "muesli-kelloggs-fruit-nut",
        "name": "Kellogg's Muesli (Fruit Nut & Seeds)",
        "nameAlt": ["kelloggs muesli fruit & nut"],
        "hindiName": "केलॉग्स मूसली फ्रूट एंड नट",
        "searchTerms": ["kelloggs", "muesli", "fruit nut", "seeds"],
        "category": "breakfast",
        "subcategory": "muesli",
        "itemType": "base-food",
        "state": "raw",
        "region": "pan-indian",
        "defaultServingGrams": 40,
        "brand": "Kellogg's",
        "allergens": ["gluten", "tree-nuts"],
        "per100g": {
            "calories": 396, "protein": 9.0, "carbs": 75.0, "fat": 6.5, "fiber": 5.0, "sodium": 120,
            "vitaminB12": 0, "vitaminD": 0, "iron": 2.0, "calcium": 40
        },
        "servings": [
            { "id": "bowl-1", "label": "1 Bowl (40g)", "grams": 40 },
            { "id": "g100", "label": "100g", "grams": 100 }
        ],
        "dietTypes": ["veg"],
        "tags": ["high-sugar"],
        "isProcessed": True, "isFastingFood": False, "fastingTypes": [],
        "isGlutenFree": False, "isRecipe": False, "containsRootVeg": False,
        "hasBeverageModifiers": False, "supportedConsistencyTypes": [], "consistencyMultipliers": {},
        "gi": 60, "cookingOilNote": None, "estimatedOilG": 0,
        "source": "curated-estimate", "confidence": "medium"
    },
    {
        "id": "muesli-twt-no-added-sugar",
        "name": "The Whole Truth Muesli (No Added Sugar)",
        "nameAlt": ["twt muesli"],
        "hindiName": "द होल ट्रुथ मूसली",
        "searchTerms": ["the whole truth", "twt", "muesli", "no added sugar", "nas"],
        "category": "breakfast",
        "subcategory": "muesli",
        "itemType": "base-food",
        "state": "raw",
        "region": "pan-indian",
        "defaultServingGrams": 40,
        "brand": "The Whole Truth",
        "allergens": ["tree-nuts", "oats"],
        "per100g": {
            "calories": 400, "protein": 12.0, "carbs": 60.0, "fat": 12.0, "fiber": 10.0, "sodium": 50,
            "vitaminB12": 0, "vitaminD": 0, "iron": 3.0, "calcium": 60
        },
        "servings": [
            { "id": "bowl-1", "label": "1 Bowl (40g)", "grams": 40 },
            { "id": "g100", "label": "100g", "grams": 100 }
        ],
        "dietTypes": ["vegan", "veg"],
        "tags": ["no-added-sugar", "clean-label", "high-fiber"],
        "isProcessed": True, "isFastingFood": False, "fastingTypes": [],
        "isGlutenFree": False, "isRecipe": False, "containsRootVeg": False,
        "hasBeverageModifiers": False, "supportedConsistencyTypes": [], "consistencyMultipliers": {},
        "gi": 50, "cookingOilNote": None, "estimatedOilG": 0,
        "source": "curated-estimate", "confidence": "medium"
    }
]

db_path = "/Users/ample/Desktop/fittrack-pro/src/data/foods/indianFoods.js"
with open(db_path, "r", encoding="utf-8") as file:
    content = file.read()

new_content = "\n  // ==========================================\n  // BRAND FOODS: BATCH B3 - Oats, Muesli, Granola\n  // ==========================================\n"

for item in b3_data:
    js_str = json.dumps(item, indent=2, ensure_ascii=False)
    js_str = '  ' + js_str.replace('\n', '\n  ') + ',\n'
    new_content += js_str

new_content = new_content.rstrip(',\n') + '\n'

idx = content.rfind('];')
if idx != -1:
    content = content[:idx] + new_content + '];\n'
    with open(db_path, "w", encoding="utf-8") as file:
        file.write(content)
    print("Successfully injected Batch B3 Oats & Muesli Foods")
else:
    print("Could not find ];")
