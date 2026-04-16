import json
import os

bar_data = [
    # -----------------------------
    # RITEBITE MAX PROTEIN
    # -----------------------------
    {
        "id": "bar-ritebite-max-10g-chocoalmond",
        "name": "RiteBite Max Protein Daily Bar (10g Protein)",
        "nameAlt": ["max protein 10g bar", "ritebite daily"],
        "hindiName": "रइटबाइट मैक्स प्रोटीन बार 10g",
        "searchTerms": ["ritebite", "max protein", "10g", "choco almond", "daily bar"],
        "category": "supplement",
        "subcategory": "energy-bar",
        "itemType": "supplement",
        "state": "raw",
        "region": "pan-indian",
        "defaultServingGrams": 50,
        "brand": "RiteBite Max Protein",
        "allergens": ["soy", "milk", "tree-nuts"],
        "per100g": {
            "calories": 420, "protein": 20.0, "carbs": 50.0, "fat": 15.0, "fiber": 10.0, "sodium": 200,
            "vitaminB12": 1.0, "vitaminD": 2.5, "iron": 3.0, "calcium": 100
        },
        "servings": [
            { "id": "bar-1", "label": "1 Bar (50g)", "grams": 50 },
            { "id": "g100", "label": "100g", "grams": 100 }
        ],
        "dietTypes": ["veg"],
        "tags": ["moderate-protein", "snack"],
        "isProcessed": True, "isFastingFood": False, "fastingTypes": [],
        "isGlutenFree": True, "isRecipe": False, "containsRootVeg": False,
        "hasBeverageModifiers": False, "supportedConsistencyTypes": [], "consistencyMultipliers": {},
        "gi": 40, "cookingOilNote": None, "estimatedOilG": 0,
        "source": "FSSAI-label", "confidence": "high"
    },
    {
        "id": "bar-ritebite-max-20g-chocobadamm",
        "name": "RiteBite Max Protein Active Bar (20g Protein)",
        "nameAlt": ["max protein 20g bar", "ritebite active choco"],
        "hindiName": "रइटबाइट मैक्स प्रोटीन बार 20g",
        "searchTerms": ["ritebite", "max protein", "20g", "choco badam", "active bar"],
        "category": "supplement",
        "subcategory": "protein-bar",
        "itemType": "supplement",
        "state": "raw",
        "region": "pan-indian",
        "defaultServingGrams": 67,
        "brand": "RiteBite Max Protein",
        "allergens": ["soy", "milk", "tree-nuts", "peanuts"],
        "per100g": {
            "calories": 467, "protein": 29.8, "carbs": 44.8, "fat": 17.9, "fiber": 10.4, "sodium": 224,
            "vitaminB12": 1.5, "vitaminD": 5.0, "iron": 4.5, "calcium": 200
        },
        "servings": [
            { "id": "bar-1", "label": "1 Bar (67g)", "grams": 67 },
            { "id": "g100", "label": "100g", "grams": 100 }
        ],
        "dietTypes": ["veg"],
        "tags": ["high-protein", "no-added-sugar"],
        "isProcessed": True, "isFastingFood": False, "fastingTypes": [],
        "isGlutenFree": True, "isRecipe": False, "containsRootVeg": False,
        "hasBeverageModifiers": False, "supportedConsistencyTypes": [], "consistencyMultipliers": {},
        "gi": 35, "cookingOilNote": None, "estimatedOilG": 0,
        "source": "FSSAI-label", "confidence": "high",
        "notes": "Zero added sugar, contains sugar alcohols."
    },
    {
        "id": "bar-ritebite-max-30g-chocoberry",
        "name": "RiteBite Max Protein Ultimate Bar (30g Protein)",
        "nameAlt": ["max protein 30g bar", "ritebite ultimate"],
        "hindiName": "रइटबाइट मैक्स प्रोटीन 30g अल्टीमेट",
        "searchTerms": ["ritebite", "max protein", "30g", "choco berry", "ultimate bar"],
        "category": "supplement",
        "subcategory": "protein-bar",
        "itemType": "supplement",
        "state": "raw",
        "region": "pan-indian",
        "defaultServingGrams": 100,
        "brand": "RiteBite Max Protein",
        "allergens": ["soy", "milk"],
        "per100g": {
            "calories": 401, "protein": 30.0, "carbs": 40.0, "fat": 12.0, "fiber": 10.0, "sodium": 350,
            "vitaminB12": 2.0, "vitaminD": 5.0, "iron": 5.0, "calcium": 250
        },
        "servings": [
            { "id": "bar-1", "label": "1 Bar (100g)", "grams": 100 }
        ],
        "dietTypes": ["veg"],
        "tags": ["very-high-protein", "no-added-sugar"],
        "isProcessed": True, "isFastingFood": False, "fastingTypes": [],
        "isGlutenFree": True, "isRecipe": False, "containsRootVeg": False,
        "hasBeverageModifiers": False, "supportedConsistencyTypes": [], "consistencyMultipliers": {},
        "gi": 30, "cookingOilNote": None, "estimatedOilG": 0,
        "source": "FSSAI-label", "confidence": "high"
    },
    
    # -----------------------------
    # THE WHOLE TRUTH (TWT)
    # -----------------------------
    {
        "id": "bar-twt-protein-20g-double-cocoa",
        "name": "The Whole Truth 20g Protein Bar (Double Cocoa)",
        "nameAlt": ["twt 20g protein bar", "whole truth bar"],
        "hindiName": "द होल ट्रुथ 20g प्रोटीन बार",
        "searchTerms": ["the whole truth", "twt", "20g", "protein bar", "double cocoa"],
        "category": "supplement",
        "subcategory": "protein-bar",
        "itemType": "supplement",
        "state": "raw",
        "region": "pan-indian",
        "defaultServingGrams": 67,
        "brand": "The Whole Truth",
        "allergens": ["milk", "tree-nuts"],
        "per100g": {
            "calories": 502, "protein": 30.3, "carbs": 31.9, "fat": 28.0, "fiber": 8.6, "sodium": 213,
            "vitaminB12": 0, "vitaminD": 0, "iron": 1.0, "calcium": 60
        },
        "servings": [
            { "id": "bar-1", "label": "1 Bar (67g)", "grams": 67 },
            { "id": "g100", "label": "100g", "grams": 100 }
        ],
        "dietTypes": ["veg"],
        "tags": ["high-protein", "clean-label", "no-added-sugar", "no-artificial-sweetener"],
        "isProcessed": True, "isFastingFood": True, "fastingTypes": ["navratri"],
        "isGlutenFree": True, "isRecipe": False, "containsRootVeg": False,
        "hasBeverageModifiers": False, "supportedConsistencyTypes": [], "consistencyMultipliers": {},
        "gi": 35, "cookingOilNote": None, "estimatedOilG": 0,
        "source": "FSSAI-label", "confidence": "high"
    },
    {
        "id": "bar-twt-energy-choco-fruit-nut",
        "name": "The Whole Truth Energy Bar (Choco Fruit & Nut)",
        "nameAlt": ["twt energy bar"],
        "hindiName": "द होल ट्रुथ एनर्जी बार",
        "searchTerms": ["the whole truth", "twt", "energy bar", "choco fruit nut"],
        "category": "supplement",
        "subcategory": "energy-bar",
        "itemType": "supplement",
        "state": "raw",
        "region": "pan-indian",
        "defaultServingGrams": 40,
        "brand": "The Whole Truth",
        "allergens": ["tree-nuts"],
        "per100g": {
            "calories": 425, "protein": 10.0, "carbs": 55.0, "fat": 20.0, "fiber": 9.0, "sodium": 15,
            "vitaminB12": 0, "vitaminD": 0, "iron": 2.0, "calcium": 40
        },
        "servings": [
            { "id": "bar-1", "label": "1 Bar (40g)", "grams": 40 },
            { "id": "g100", "label": "100g", "grams": 100 }
        ],
        "dietTypes": ["vegan", "veg"],
        "tags": ["high-fiber", "clean-label", "no-added-sugar"],
        "isProcessed": True, "isFastingFood": True, "fastingTypes": ["navratri"],
        "isGlutenFree": True, "isRecipe": False, "containsRootVeg": False,
        "hasBeverageModifiers": False, "supportedConsistencyTypes": [], "consistencyMultipliers": {},
        "gi": 45, "cookingOilNote": None, "estimatedOilG": 0,
        "source": "curated-estimate", "confidence": "medium"
    },

    # -----------------------------
    # YOGABAR
    # -----------------------------
    {
        "id": "bar-yogabar-protein-20g-chocobrownie",
        "name": "Yogabar 20g Protein Bar (Choco Brownie)",
        "nameAlt": ["yogabar protein bar"],
        "hindiName": "योगा बार 20g प्रोटीन बार",
        "searchTerms": ["yogabar", "20g", "protein bar", "choco brownie"],
        "category": "supplement",
        "subcategory": "protein-bar",
        "itemType": "supplement",
        "state": "raw",
        "region": "pan-indian",
        "defaultServingGrams": 60,
        "brand": "Yogabar",
        "allergens": ["milk", "tree-nuts"],
        "per100g": {
            "calories": 533, "protein": 33.3, "carbs": 43.3, "fat": 25.0, "fiber": 15.0, "sodium": 166,
            "vitaminB12": 0, "vitaminD": 0, "iron": 2.5, "calcium": 100
        },
        "servings": [
            { "id": "bar-1", "label": "1 Bar (60g)", "grams": 60 },
            { "id": "g100", "label": "100g", "grams": 100 }
        ],
        "dietTypes": ["veg"],
        "tags": ["high-protein", "high-fiber", "no-added-sugar"],
        "isProcessed": True, "isFastingFood": False, "fastingTypes": [],
        "isGlutenFree": True, "isRecipe": False, "containsRootVeg": False,
        "hasBeverageModifiers": False, "supportedConsistencyTypes": [], "consistencyMultipliers": {},
        "gi": 35, "cookingOilNote": None, "estimatedOilG": 0,
        "source": "FSSAI-label", "confidence": "high"
    },
    {
        "id": "bar-yogabar-energy-chocolate-chunk",
        "name": "Yogabar Multigrain Energy Bar (Chocolate Chunk)",
        "nameAlt": ["yogabar energy bar"],
        "hindiName": "योगा बार एनर्जी बार",
        "searchTerms": ["yogabar", "energy bar", "multigrain", "chocolate chunk"],
        "category": "supplement",
        "subcategory": "energy-bar",
        "itemType": "supplement",
        "state": "raw",
        "region": "pan-indian",
        "defaultServingGrams": 38,
        "brand": "Yogabar",
        "allergens": ["tree-nuts", "milk", "oats"],
        "per100g": {
            "calories": 420, "protein": 11.0, "carbs": 58.0, "fat": 15.0, "fiber": 10.0, "sodium": 120,
            "vitaminB12": 0, "vitaminD": 0, "iron": 2.0, "calcium": 50
        },
        "servings": [
            { "id": "bar-1", "label": "1 Bar (38g)", "grams": 38 },
            { "id": "g100", "label": "100g", "grams": 100 }
        ],
        "dietTypes": ["veg"],
        "tags": ["high-fiber", "snack"],
        "isProcessed": True, "isFastingFood": False, "fastingTypes": [],
        "isGlutenFree": False, "isRecipe": False, "containsRootVeg": False,
        "hasBeverageModifiers": False, "supportedConsistencyTypes": [], "consistencyMultipliers": {},
        "gi": 50, "cookingOilNote": None, "estimatedOilG": 0,
        "source": "curated-estimate", "confidence": "medium"
    },

    # -----------------------------
    # PHAB & MUSCLEBLAZE
    # -----------------------------
    {
        "id": "bar-phab-protein-20g-chocoalmond",
        "name": "Phab Protein Bar (20g, Choco Almond)",
        "nameAlt": ["phab 20g bar"],
        "hindiName": "फैब 20g प्रोटीन बार",
        "searchTerms": ["phab", "20g", "protein bar", "choco almond"],
        "category": "supplement",
        "subcategory": "protein-bar",
        "itemType": "supplement",
        "state": "raw",
        "region": "pan-indian",
        "defaultServingGrams": 65,
        "brand": "Phab",
        "allergens": ["milk", "soy", "tree-nuts"],
        "per100g": {
            "calories": 380, "protein": 30.7, "carbs": 40.0, "fat": 12.0, "fiber": 8.0, "sodium": 180,
            "vitaminB12": 0, "vitaminD": 0, "iron": 2.0, "calcium": 80
        },
        "servings": [
            { "id": "bar-1", "label": "1 Bar (65g)", "grams": 65 },
            { "id": "g100", "label": "100g", "grams": 100 }
        ],
        "dietTypes": ["veg"],
        "tags": ["high-protein"],
        "isProcessed": True, "isFastingFood": False, "fastingTypes": [],
        "isGlutenFree": True, "isRecipe": False, "containsRootVeg": False,
        "hasBeverageModifiers": False, "supportedConsistencyTypes": [], "consistencyMultipliers": {},
        "gi": 40, "cookingOilNote": None, "estimatedOilG": 0,
        "source": "curated-estimate", "confidence": "medium"
    },
    {
        "id": "bar-muscleblaze-protein-20g-cookiescream",
        "name": "MuscleBlaze Protein Bar (20g, Cookies & Cream)",
        "nameAlt": ["mb protein bar cookies and cream"],
        "hindiName": "मसलब्लेज़ 20g प्रोटीन बार",
        "searchTerms": ["muscleblaze", "mb", "20g", "protein bar", "cookies cream"],
        "category": "supplement",
        "subcategory": "protein-bar",
        "itemType": "supplement",
        "state": "raw",
        "region": "pan-indian",
        "defaultServingGrams": 65,
        "brand": "MuscleBlaze",
        "allergens": ["milk", "soy"],
        "per100g": {
            "calories": 372, "protein": 30.7, "carbs": 38.0, "fat": 13.0, "fiber": 6.0, "sodium": 200,
            "vitaminB12": 0, "vitaminD": 0, "iron": 1.5, "calcium": 100
        },
        "servings": [
            { "id": "bar-1", "label": "1 Bar (65g)", "grams": 65 },
            { "id": "g100", "label": "100g", "grams": 100 }
        ],
        "dietTypes": ["veg"],
        "tags": ["high-protein"],
        "isProcessed": True, "isFastingFood": False, "fastingTypes": [],
        "isGlutenFree": False, "isRecipe": False, "containsRootVeg": False,
        "hasBeverageModifiers": False, "supportedConsistencyTypes": [], "consistencyMultipliers": {},
        "gi": 42, "cookingOilNote": None, "estimatedOilG": 0,
        "source": "FSSAI-label", "confidence": "high"
    },

    # -----------------------------
    # OTHER BRANDS (HYP, EAT ANYTIME, OPEN SECRET, GRENADE)
    # -----------------------------
    {
        "id": "bar-hyp-lean-20g-darkchoco",
        "name": "HYP Lean Protein Bar (20g, Dark Choco)",
        "nameAlt": ["hyp lean bar"],
        "hindiName": "हाइप लीन प्रोटीन बार",
        "searchTerms": ["hyp", "lean", "20g", "protein bar", "dark choco"],
        "category": "supplement",
        "subcategory": "protein-bar",
        "itemType": "supplement",
        "state": "raw",
        "region": "pan-indian",
        "defaultServingGrams": 60,
        "brand": "HYP",
        "allergens": ["milk", "tree-nuts"],
        "per100g": {
            "calories": 360, "protein": 33.3, "carbs": 33.0, "fat": 11.0, "fiber": 12.0, "sodium": 110,
            "vitaminB12": 0, "vitaminD": 0, "iron": 2.0, "calcium": 120
        },
        "servings": [
            { "id": "bar-1", "label": "1 Bar (60g)", "grams": 60 },
            { "id": "g100", "label": "100g", "grams": 100 }
        ],
        "dietTypes": ["veg"],
        "tags": ["high-protein", "no-added-sugar", "clean-label"],
        "isProcessed": True, "isFastingFood": False, "fastingTypes": [],
        "isGlutenFree": True, "isRecipe": False, "containsRootVeg": False,
        "hasBeverageModifiers": False, "supportedConsistencyTypes": [], "consistencyMultipliers": {},
        "gi": 30, "cookingOilNote": None, "estimatedOilG": 0,
        "source": "curated-estimate", "confidence": "medium"
    },
    {
        "id": "bar-eatanytime-protein-10g-cranberry",
        "name": "Eat Anytime Protein Bar (10g, Cranberry)",
        "nameAlt": ["eat anytime bar"],
        "hindiName": "ईट एनीटाइम प्रोटीन बार",
        "searchTerms": ["eat anytime", "10g", "protein bar", "cranberry"],
        "category": "supplement",
        "subcategory": "energy-bar",
        "itemType": "supplement",
        "state": "raw",
        "region": "pan-indian",
        "defaultServingGrams": 40,
        "brand": "Eat Anytime",
        "allergens": ["soy", "milk"],
        "per100g": {
            "calories": 410, "protein": 25.0, "carbs": 55.0, "fat": 12.0, "fiber": 8.0, "sodium": 150,
            "vitaminB12": 0, "vitaminD": 0, "iron": 1.0, "calcium": 50
        },
        "servings": [
            { "id": "bar-1", "label": "1 Bar (40g)", "grams": 40 },
            { "id": "g100", "label": "100g", "grams": 100 }
        ],
        "dietTypes": ["veg"],
        "tags": ["moderate-protein"],
        "isProcessed": True, "isFastingFood": False, "fastingTypes": [],
        "isGlutenFree": False, "isRecipe": False, "containsRootVeg": False,
        "hasBeverageModifiers": False, "supportedConsistencyTypes": [], "consistencyMultipliers": {},
        "gi": 45, "cookingOilNote": None, "estimatedOilG": 0,
        "source": "curated-estimate", "confidence": "medium"
    },
    {
        "id": "bar-opensecret-protein-chocochip",
        "name": "Open Secret Protein Bar (Choco Chip)",
        "nameAlt": ["open secret bar"],
        "hindiName": "ओपन सीक्रेट प्रोटीन बार",
        "searchTerms": ["open secret", "protein bar", "choco chip", "un-junked"],
        "category": "supplement",
        "subcategory": "protein-bar",
        "itemType": "supplement",
        "state": "raw",
        "region": "pan-indian",
        "defaultServingGrams": 40,
        "brand": "Open Secret",
        "allergens": ["milk", "tree-nuts"],
        "per100g": {
            "calories": 450, "protein": 25.0, "carbs": 45.0, "fat": 18.0, "fiber": 7.0, "sodium": 100,
            "vitaminB12": 0, "vitaminD": 0, "iron": 1.5, "calcium": 60
        },
        "servings": [
            { "id": "bar-1", "label": "1 Bar (40g)", "grams": 40 },
            { "id": "g100", "label": "100g", "grams": 100 }
        ],
        "dietTypes": ["veg"],
        "tags": ["moderate-protein", "clean-label", "no-artificial-sweetener"],
        "isProcessed": True, "isFastingFood": False, "fastingTypes": [],
        "isGlutenFree": True, "isRecipe": False, "containsRootVeg": False,
        "hasBeverageModifiers": False, "supportedConsistencyTypes": [], "consistencyMultipliers": {},
        "gi": 40, "cookingOilNote": None, "estimatedOilG": 0,
        "source": "curated-estimate", "confidence": "medium"
    },
    {
        "id": "bar-grenade-carb-killa-white-choco",
        "name": "Grenade Carb Killa Protein Bar (White Choco)",
        "nameAlt": ["carb killa bar grenade"],
        "hindiName": "ग्रेनेड कार्ब किला प्रोटीन बार",
        "searchTerms": ["grenade", "carb killa", "protein bar", "white choco", "import"],
        "category": "supplement",
        "subcategory": "protein-bar",
        "itemType": "supplement",
        "state": "raw",
        "region": "imported",
        "defaultServingGrams": 60,
        "brand": "Grenade",
        "allergens": ["milk", "soy"],
        "per100g": {
            "calories": 386, "protein": 36.6, "carbs": 33.3, "fat": 16.6, "fiber": 8.3, "sodium": 233,
            "vitaminB12": 0, "vitaminD": 0, "iron": 1.0, "calcium": 150
        },
        "servings": [
            { "id": "bar-1", "label": "1 Bar (60g)", "grams": 60 },
            { "id": "g100", "label": "100g", "grams": 100 }
        ],
        "dietTypes": ["veg"],
        "tags": ["high-protein", "low-sugar"],
        "isProcessed": True, "isFastingFood": False, "fastingTypes": [],
        "isGlutenFree": True, "isRecipe": False, "containsRootVeg": False,
        "hasBeverageModifiers": False, "supportedConsistencyTypes": [], "consistencyMultipliers": {},
        "gi": 25, "cookingOilNote": None, "estimatedOilG": 0,
        "source": "FSSAI-label", "confidence": "high",
        "notes": "Imported product. Sweetened with maltitol."
    }
]

db_path = "/Users/ample/Desktop/fittrack-pro/src/data/foods/indianFoods.js"
with open(db_path, "r", encoding="utf-8") as file:
    content = file.read()

new_content = "\n  // ==========================================\n  // BRAND FOODS: BATCH B2 - Protein & Energy Bars\n  // ==========================================\n"

for item in bar_data:
    js_str = json.dumps(item, indent=2, ensure_ascii=False)
    js_str = '  ' + js_str.replace('\n', '\n  ') + ',\n'
    new_content += js_str

new_content = new_content.rstrip(',\n') + '\n'

idx = content.rfind('];')
if idx != -1:
    content = content[:idx] + new_content + '];\n'
    with open(db_path, "w", encoding="utf-8") as file:
        file.write(content)
    print("Successfully injected Batch B2 Bar Foods")
else:
    print("Could not find ];")
