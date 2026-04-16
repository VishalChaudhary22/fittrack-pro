import json

b8_data = [
    # -----------------------------
    # INSTANT NOODLES (MAGGI)
    # -----------------------------
    {
        "id": "noodle-maggi-2min-masala-70g",
        "name": "Maggi 2-Minute Noodles (Masala)",
        "nameAlt": ["maggi masala", "maggi noodles"],
        "hindiName": "मैगी 2-मिनट नूडल्स (मसाला)",
        "searchTerms": ["maggi", "2 minute", "masala noodles", "nestle"],
        "category": "packaged-food",
        "subcategory": "instant-noodle",
        "itemType": "base-food",
        "state": "raw",
        "region": "pan-indian",
        "defaultServingGrams": 70,
        "brand": "Maggi",
        "allergens": ["gluten", "soy"],
        "per100g": {
            "calories": 442.0, "protein": 10.0, "carbs": 60.0, "fat": 18.0, "fiber": 2.0, "sodium": 1200,
            "vitaminB12": 0, "vitaminD": 0, "iron": 2.5, "calcium": 50
        },
        "servings": [
            { "id": "pack-70", "label": "1 Single Pack (70g)", "grams": 70 },
            { "id": "pack-140", "label": "1 Double Pack (140g)", "grams": 140 },
            { "id": "g100", "label": "100g (Dry weight)", "grams": 100 }
        ],
        "dietTypes": ["veg"],
        "tags": ["high-carb", "high-sodium", "calorie-dense"],
        "isProcessed": True, "isFastingFood": False, "fastingTypes": [],
        "isGlutenFree": False, "isRecipe": False, "containsRootVeg": True,
        "hasBeverageModifiers": False, "supportedConsistencyTypes": [], "consistencyMultipliers": {},
        "gi": 65, "cookingOilNote": None, "estimatedOilG": 0,
        "source": "FSSAI-label", "confidence": "high"
    },
    {
        "id": "noodle-maggi-atta-masala-70g",
        "name": "Maggi Atta Noodles (Masala)",
        "nameAlt": ["maggi atta", "whole wheat maggi"],
        "hindiName": "मैगी आटा नूडल्स",
        "searchTerms": ["maggi", "atta", "whole wheat", "masala noodles"],
        "category": "packaged-food",
        "subcategory": "instant-noodle",
        "itemType": "base-food",
        "state": "raw",
        "region": "pan-indian",
        "defaultServingGrams": 70,
        "brand": "Maggi",
        "allergens": ["gluten", "soy"],
        "per100g": {
            "calories": 440.0, "protein": 10.5, "carbs": 58.0, "fat": 17.0, "fiber": 5.0, "sodium": 1150,
            "vitaminB12": 0, "vitaminD": 0, "iron": 3.0, "calcium": 55
        },
        "servings": [
            { "id": "pack-70", "label": "1 Pack (70g)", "grams": 70 },
            { "id": "g100", "label": "100g (Dry weight)", "grams": 100 }
        ],
        "dietTypes": ["veg"],
        "tags": ["high-carb", "high-sodium", "moderate-fiber"],
        "isProcessed": True, "isFastingFood": False, "fastingTypes": [],
        "isGlutenFree": False, "isRecipe": False, "containsRootVeg": True,
        "hasBeverageModifiers": False, "supportedConsistencyTypes": [], "consistencyMultipliers": {},
        "gi": 55, "cookingOilNote": None, "estimatedOilG": 0,
        "source": "FSSAI-label", "confidence": "high"
    },
    {
        "id": "noodle-maggi-no-onion-garlic-70g",
        "name": "Maggi 2-Minute Noodles (No Onion No Garlic)",
        "nameAlt": ["maggi jain", "maggi nong"],
        "hindiName": "मैगी नो अनियन नो गार्लिक",
        "searchTerms": ["maggi", "jain maggi", "nong", "no onion garlic"],
        "category": "packaged-food",
        "subcategory": "instant-noodle",
        "itemType": "base-food",
        "state": "raw",
        "region": "pan-indian",
        "defaultServingGrams": 70,
        "brand": "Maggi",
        "allergens": ["gluten", "soy"],
        "per100g": {
            "calories": 442.0, "protein": 10.0, "carbs": 60.0, "fat": 18.0, "fiber": 2.0, "sodium": 1100,
            "vitaminB12": 0, "vitaminD": 0, "iron": 2.5, "calcium": 50
        },
        "servings": [
            { "id": "pack-70", "label": "1 Pack (70g)", "grams": 70 },
            { "id": "g100", "label": "100g", "grams": 100 }
        ],
        "dietTypes": ["veg", "jain"],
        "tags": ["high-carb", "high-sodium", "jain-friendly"],
        "isProcessed": True, "isFastingFood": False, "fastingTypes": [],
        "isGlutenFree": False, "isRecipe": False, "containsRootVeg": False,
        "hasBeverageModifiers": False, "supportedConsistencyTypes": [], "consistencyMultipliers": {},
        "gi": 65, "cookingOilNote": None, "estimatedOilG": 0,
        "source": "curated-estimate", "confidence": "high"
    },

    # -----------------------------
    # INSTANT NOODLES (OTHERS)
    # -----------------------------
    {
        "id": "noodle-yippee-magic-masala-70g",
        "name": "YiPPee! Magic Masala Noodles",
        "nameAlt": ["yippee noodles"],
        "hindiName": "यीप्पी मैजिक मसाला नूडल्स",
        "searchTerms": ["yippee", "magic masala", "itc noodles", "round block"],
        "category": "packaged-food",
        "subcategory": "instant-noodle",
        "itemType": "base-food",
        "state": "raw",
        "region": "pan-indian",
        "defaultServingGrams": 70,
        "brand": "ITC YiPPee!",
        "allergens": ["gluten", "soy"],
        "per100g": {
            "calories": 428.0, "protein": 9.5, "carbs": 62.0, "fat": 16.5, "fiber": 2.5, "sodium": 1150,
            "vitaminB12": 0, "vitaminD": 0, "iron": 2.0, "calcium": 40
        },
        "servings": [
            { "id": "pack-70", "label": "1 Single Pack (70g)", "grams": 70 },
            { "id": "g100", "label": "100g", "grams": 100 }
        ],
        "dietTypes": ["veg"],
        "tags": ["high-carb", "high-sodium"],
        "isProcessed": True, "isFastingFood": False, "fastingTypes": [],
        "isGlutenFree": False, "isRecipe": False, "containsRootVeg": True,
        "hasBeverageModifiers": False, "supportedConsistencyTypes": [], "consistencyMultipliers": {},
        "gi": 65, "cookingOilNote": None, "estimatedOilG": 0,
        "source": "curated-estimate", "confidence": "medium"
    },
    {
        "id": "noodle-waiwai-chicken-75g",
        "name": "Wai Wai Chicken Noodles",
        "nameAlt": ["wai wai brown"],
        "hindiName": "वाई वाई चिकन नूडल्स",
        "searchTerms": ["wai wai", "chicken noodles", "nepali noodles", "instant chicken"],
        "category": "packaged-food",
        "subcategory": "instant-noodle",
        "itemType": "snack",
        "state": "raw",
        "region": "pan-indian",
        "defaultServingGrams": 75,
        "brand": "Wai Wai",
        "allergens": ["gluten", "soy"],
        "per100g": {
            "calories": 471.0, "protein": 10.0, "carbs": 61.0, "fat": 21.0, "fiber": 2.0, "sodium": 1300,
            "vitaminB12": 0.5, "vitaminD": 0, "iron": 2.0, "calcium": 30
        },
        "servings": [
            { "id": "pack-75", "label": "1 Pack (75g)", "grams": 75 },
            { "id": "g100", "label": "100g", "grams": 100 }
        ],
        "dietTypes": ["non-veg"],
        "tags": ["high-sodium", "high-fat", "calorie-dense"],
        "isProcessed": True, "isFastingFood": False, "fastingTypes": [],
        "isGlutenFree": False, "isRecipe": False, "containsRootVeg": True,
        "hasBeverageModifiers": False, "supportedConsistencyTypes": [], "consistencyMultipliers": {},
        "gi": 65, "cookingOilNote": None, "estimatedOilG": 0,
        "source": "FSSAI-label", "confidence": "high"
    },

    # -----------------------------
    # READY TO EAT (RTE) MEALS
    # -----------------------------
    {
        "id": "rte-mtr-dal-makhani-300g",
        "name": "MTR Ready-To-Eat Dal Makhani",
        "nameAlt": ["mtr dal makhni rte"],
        "hindiName": "एमटीआर दाल मखनी (RTE)",
        "searchTerms": ["mtr", "dal makhani", "rte", "ready to eat", "pouch dal"],
        "category": "curry",
        "subcategory": "dal-lentils",
        "itemType": "base-food",
        "state": "cooked",
        "region": "north-indian",
        "defaultServingGrams": 150,
        "brand": "MTR",
        "allergens": ["milk"],
        "per100g": {
            "calories": 86.0, "protein": 3.3, "carbs": 6.6, "fat": 5.3, "fiber": 3.3, "sodium": 233,
            "vitaminB12": 0.2, "vitaminD": 0, "iron": 1.5, "calcium": 40
        },
        "servings": [
            { "id": "half-pack", "label": "Half Pouch (150g)", "grams": 150 },
            { "id": "pack-300", "label": "Full Pouch (300g)", "grams": 300 },
            { "id": "bowl", "label": "1 Bowl (200g)", "grams": 200 }
        ],
        "dietTypes": ["veg"],
        "tags": ["convenience", "moderate-fat"],
        "isProcessed": True, "isFastingFood": False, "fastingTypes": [],
        "isGlutenFree": True, "isRecipe": False, "containsRootVeg": True,
        "hasBeverageModifiers": False, "supportedConsistencyTypes": [], "consistencyMultipliers": {},
        "gi": 35, "cookingOilNote": "Includes butter/cream in product matrix", "estimatedOilG": 4,
        "source": "FSSAI-label", "confidence": "high"
    },
    {
        "id": "rte-itc-koi-dal-bukhara-285g",
        "name": "Kitchens of India Dal Bukhara (RTE)",
        "nameAlt": ["itc dal bukhara"],
        "hindiName": "किचन्स ऑफ इंडिया दाल बुखारा",
        "searchTerms": ["itc", "kitchens of india", "dal bukhara", "rte", "premium dal"],
        "category": "curry",
        "subcategory": "dal-lentils",
        "itemType": "base-food",
        "state": "cooked",
        "region": "north-indian",
        "defaultServingGrams": 142,
        "brand": "ITC Kitchens of India",
        "allergens": ["milk"],
        "per100g": {
            "calories": 115.0, "protein": 4.0, "carbs": 12.0, "fat": 5.5, "fiber": 3.0, "sodium": 480,
            "vitaminB12": 0.3, "vitaminD": 0, "iron": 1.2, "calcium": 30
        },
        "servings": [
            { "id": "half-pack", "label": "Half Pouch (~142g)", "grams": 142 },
            { "id": "pack-285", "label": "Full Pouch (285g)", "grams": 285 },
            { "id": "g100", "label": "100g", "grams": 100 }
        ],
        "dietTypes": ["veg"],
        "tags": ["restaurant-style", "high-sodium", "convenience"],
        "isProcessed": True, "isFastingFood": False, "fastingTypes": [],
        "isGlutenFree": True, "isRecipe": False, "containsRootVeg": True,
        "hasBeverageModifiers": False, "supportedConsistencyTypes": [], "consistencyMultipliers": {},
        "gi": 40, "cookingOilNote": "Includes butter/cream", "estimatedOilG": 5,
        "source": "FSSAI-label", "confidence": "high"
    }
]

db_path = "/Users/ample/Desktop/fittrack-pro/src/data/foods/indianFoods.js"
with open(db_path, "r", encoding="utf-8") as file:
    content = file.read()

new_content = "\n  // ==========================================\n  // BRAND FOODS: BATCH B8 - Noodles & RTE\n  // ==========================================\n"

for item in b8_data:
    js_str = json.dumps(item, indent=2, ensure_ascii=False)
    js_str = '  ' + js_str.replace('\n', '\n  ') + ',\n'
    new_content += js_str

new_content = new_content.rstrip(',\n') + '\n'

idx = content.rfind('];')
if idx != -1:
    content = content[:idx] + new_content + '];\n'
    with open(db_path, "w", encoding="utf-8") as file:
        file.write(content)
    print("Successfully injected Batch B8 Noodles/RTE")
else:
    print("Could not find ];")
