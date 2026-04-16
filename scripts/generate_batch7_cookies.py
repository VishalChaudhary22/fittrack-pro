import json

b7_data = [
    # -----------------------------
    # PROTEIN COOKIES
    # -----------------------------
    {
        "id": "cookie-muscleblaze-protein-20g-doublechoco",
        "name": "MuscleBlaze Protein Cookie (Double Choco)",
        "nameAlt": ["mb protein cookie 20g"],
        "hindiName": "मसलब्लेज़ प्रोटीन कुकी",
        "searchTerms": ["muscleblaze", "mb", "protein cookie", "double choco", "20g"],
        "category": "supplement",
        "subcategory": "protein-cookie",
        "itemType": "snack",
        "state": "raw",
        "region": "pan-indian",
        "defaultServingGrams": 60,
        "brand": "MuscleBlaze",
        "allergens": ["gluten", "milk", "soy"],
        "per100g": {
            "calories": 400.0, "protein": 33.3, "carbs": 40.0, "fat": 15.0, "fiber": 5.0, "sodium": 150,
            "vitaminB12": 0, "vitaminD": 0, "iron": 2.0, "calcium": 100
        },
        "servings": [
            { "id": "cookie-1", "label": "1 Cookie (60g)", "grams": 60 }
        ],
        "dietTypes": ["veg"],
        "tags": ["high-protein"],
        "isProcessed": True, "isFastingFood": False, "fastingTypes": [],
        "isGlutenFree": False, "isRecipe": False, "containsRootVeg": False,
        "hasBeverageModifiers": False, "supportedConsistencyTypes": [], "consistencyMultipliers": {},
        "gi": 45, "cookingOilNote": None, "estimatedOilG": 0,
        "source": "curated-estimate", "confidence": "medium"
    },
    {
        "id": "cookie-twt-protein-15g-choco-chip",
        "name": "The Whole Truth Protein Cookie (Choco Chip)",
        "nameAlt": ["twt protein cookie"],
        "hindiName": "द होल ट्रुथ प्रोटीन कुकी",
        "searchTerms": ["the whole truth", "twt", "protein cookie", "15g", "choco chip"],
        "category": "supplement",
        "subcategory": "protein-cookie",
        "itemType": "snack",
        "state": "raw",
        "region": "pan-indian",
        "defaultServingGrams": 50,
        "brand": "The Whole Truth",
        "allergens": ["tree-nuts", "milk"],
        "per100g": {
            "calories": 420.0, "protein": 30.0, "carbs": 35.0, "fat": 20.0, "fiber": 8.0, "sodium": 80,
            "vitaminB12": 0, "vitaminD": 0, "iron": 1.5, "calcium": 80
        },
        "servings": [
            { "id": "cookie-1", "label": "1 Cookie (50g)", "grams": 50 }
        ],
        "dietTypes": ["veg"],
        "tags": ["high-protein", "clean-label", "no-added-sugar"],
        "isProcessed": True, "isFastingFood": False, "fastingTypes": [],
        "isGlutenFree": True, "isRecipe": False, "containsRootVeg": False,
        "hasBeverageModifiers": False, "supportedConsistencyTypes": [], "consistencyMultipliers": {},
        "gi": 35, "cookingOilNote": None, "estimatedOilG": 0,
        "source": "curated-estimate", "confidence": "high"
    },

    # -----------------------------
    # PROTEIN CHIPS
    # -----------------------------
    {
        "id": "chip-ritebite-protein-chips-cheese-jalapeno",
        "name": "RiteBite Max Protein Chips (Cheese Jalapeno)",
        "nameAlt": ["max protein chips"],
        "hindiName": "रइटबाइट मैक्स प्रोटीन चिप्स",
        "searchTerms": ["ritebite", "max protein", "chips", "cheese jalapeno", "baked"],
        "category": "snack-street",
        "subcategory": "protein-chip",
        "itemType": "snack",
        "state": "raw",
        "region": "pan-indian",
        "defaultServingGrams": 60,
        "brand": "RiteBite Max Protein",
        "allergens": ["soy", "gluten", "milk"],
        "per100g": {
            "calories": 420.0, "protein": 20.0, "carbs": 60.0, "fat": 11.0, "fiber": 10.0, "sodium": 650,
            "vitaminB12": 0, "vitaminD": 0, "iron": 2.0, "calcium": 50
        },
        "servings": [
            { "id": "pack-1", "label": "1 Pack (60g)", "grams": 60 },
            { "id": "g100", "label": "100g", "grams": 100 }
        ],
        "dietTypes": ["veg"],
        "tags": ["high-sodium", "high-protein", "baked"],
        "isProcessed": True, "isFastingFood": False, "fastingTypes": [],
        "isGlutenFree": False, "isRecipe": False, "containsRootVeg": False,
        "hasBeverageModifiers": False, "supportedConsistencyTypes": [], "consistencyMultipliers": {},
        "gi": 40, "cookingOilNote": None, "estimatedOilG": 0,
        "source": "FSSAI-label", "confidence": "high"
    },
    {
        "id": "chip-tooyumm-protein-puff-herbs-cheese",
        "name": "Too Yumm! Protein Puffs (Herbs & Cheese)",
        "nameAlt": ["too yumm protein puffs"],
        "hindiName": "टू यम प्रोटीन पफ्स",
        "searchTerms": ["too yumm", "protein puffs", "herbs cheese", "baked"],
        "category": "snack-street",
        "subcategory": "protein-chip",
        "itemType": "snack",
        "state": "raw",
        "region": "pan-indian",
        "defaultServingGrams": 28,
        "brand": "Too Yumm",
        "allergens": ["milk", "soy"],
        "per100g": {
            "calories": 469.0, "protein": 10.0, "carbs": 68.0, "fat": 17.7, "fiber": 4.0, "sodium": 760,
            "vitaminB12": 0, "vitaminD": 0, "iron": 1.5, "calcium": 60
        },
        "servings": [
            { "id": "pack-1", "label": "1 Pack (28g)", "grams": 28 },
            { "id": "g100", "label": "100g", "grams": 100 }
        ],
        "dietTypes": ["veg"],
        "tags": ["baked", "high-sodium"],
        "isProcessed": True, "isFastingFood": False, "fastingTypes": [],
        "isGlutenFree": False, "isRecipe": False, "containsRootVeg": False,
        "hasBeverageModifiers": False, "supportedConsistencyTypes": [], "consistencyMultipliers": {},
        "gi": 50, "cookingOilNote": None, "estimatedOilG": 0,
        "source": "FSSAI-label", "confidence": "high"
    },

    # -----------------------------
    # STANDARD BISCUITS
    # -----------------------------
    {
        "id": "biscuit-parle-g-original",
        "name": "Parle-G Glucose Biscuit",
        "nameAlt": ["parle g"],
        "hindiName": "पारले-जी बिस्कुट",
        "searchTerms": ["parle", "parle-g", "glucose", "biscuit", "chai"],
        "category": "snack-street",
        "subcategory": "packaged-biscuit",
        "itemType": "snack",
        "state": "raw",
        "region": "pan-indian",
        "defaultServingGrams": 15,
        "brand": "Parle-G",
        "allergens": ["gluten", "milk", "soy"],
        "per100g": {
            "calories": 450.0, "protein": 7.0, "carbs": 77.0, "fat": 13.0, "fiber": 1.5, "sodium": 280,
            "vitaminB12": 0, "vitaminD": 0, "iron": 1.0, "calcium": 30
        },
        "servings": [
            { "id": "biscuit-3", "label": "3 Biscuits (~15g)", "grams": 15 },
            { "id": "pack-small", "label": "1 Small Pack (75g)", "grams": 75 },
            { "id": "g100", "label": "100g", "grams": 100 }
        ],
        "dietTypes": ["veg"],
        "tags": ["high-carb", "high-sugar", "calorie-dense"],
        "isProcessed": True, "isFastingFood": False, "fastingTypes": [],
        "isGlutenFree": False, "isRecipe": False, "containsRootVeg": False,
        "hasBeverageModifiers": False, "supportedConsistencyTypes": [], "consistencyMultipliers": {},
        "gi": 70, "cookingOilNote": None, "estimatedOilG": 0,
        "source": "FSSAI-label", "confidence": "high"
    },
    {
        "id": "biscuit-britannia-nutrichoice-digestive",
        "name": "Britannia NutriChoice High Fibre Digestive",
        "nameAlt": ["nutrichoice digestive"],
        "hindiName": "ब्रिटानिया न्यूट्रीचॉइस",
        "searchTerms": ["britannia", "nutrichoice", "digestive", "high fibre", "biscuit"],
        "category": "snack-street",
        "subcategory": "packaged-biscuit",
        "itemType": "snack",
        "state": "raw",
        "region": "pan-indian",
        "defaultServingGrams": 20,
        "brand": "Britannia NutriChoice",
        "allergens": ["gluten"],
        "per100g": {
            "calories": 493.0, "protein": 8.0, "carbs": 68.0, "fat": 21.0, "fiber": 6.0, "sodium": 400,
            "vitaminB12": 0, "vitaminD": 0, "iron": 2.0, "calcium": 45
        },
        "servings": [
            { "id": "biscuit-2", "label": "2 Biscuits (~20g)", "grams": 20 },
            { "id": "g100", "label": "100g", "grams": 100 }
        ],
        "dietTypes": ["veg"],
        "tags": ["high-fat", "moderate-fiber", "calorie-dense"],
        "isProcessed": True, "isFastingFood": False, "fastingTypes": [],
        "isGlutenFree": False, "isRecipe": False, "containsRootVeg": False,
        "hasBeverageModifiers": False, "supportedConsistencyTypes": [], "consistencyMultipliers": {},
        "gi": 55, "cookingOilNote": None, "estimatedOilG": 0,
        "source": "FSSAI-label", "confidence": "high"
    },
    {
        "id": "biscuit-britannia-marie-gold",
        "name": "Britannia Marie Gold Biscuit",
        "nameAlt": ["marie gold"],
        "hindiName": "मरी गोल्ड बिस्कुट",
        "searchTerms": ["britannia", "marie", "gold", "biscuit", "tea time"],
        "category": "snack-street",
        "subcategory": "packaged-biscuit",
        "itemType": "snack",
        "state": "raw",
        "region": "pan-indian",
        "defaultServingGrams": 20,
        "brand": "Britannia Marie Gold",
        "allergens": ["gluten", "milk"],
        "per100g": {
            "calories": 440.0, "protein": 8.0, "carbs": 76.0, "fat": 11.5, "fiber": 2.0, "sodium": 350,
            "vitaminB12": 0, "vitaminD": 0, "iron": 1.5, "calcium": 40
        },
        "servings": [
            { "id": "biscuit-4", "label": "4 Biscuits (~20g)", "grams": 20 },
            { "id": "g100", "label": "100g", "grams": 100 }
        ],
        "dietTypes": ["veg"],
        "tags": ["high-carb", "calorie-dense"],
        "isProcessed": True, "isFastingFood": False, "fastingTypes": [],
        "isGlutenFree": False, "isRecipe": False, "containsRootVeg": False,
        "hasBeverageModifiers": False, "supportedConsistencyTypes": [], "consistencyMultipliers": {},
        "gi": 65, "cookingOilNote": None, "estimatedOilG": 0,
        "source": "curated-estimate", "confidence": "medium"
    },
    {
        "id": "biscuit-sunfeast-darkfantasy-choco-fills",
        "name": "Sunfeast Dark Fantasy (Choco Fills)",
        "nameAlt": ["dark fantasy biscuit"],
        "hindiName": "डार्क फैंटेसी चोको फिल्स",
        "searchTerms": ["sunfeast", "dark fantasy", "choco fills", "chocolate biscuit"],
        "category": "snack-street",
        "subcategory": "packaged-biscuit",
        "itemType": "snack",
        "state": "raw",
        "region": "pan-indian",
        "defaultServingGrams": 25,
        "brand": "Sunfeast Dark Fantasy",
        "allergens": ["gluten", "milk", "soy"],
        "per100g": {
            "calories": 530.0, "protein": 5.0, "carbs": 65.0, "fat": 28.0, "fiber": 2.0, "sodium": 180,
            "vitaminB12": 0, "vitaminD": 0, "iron": 1.5, "calcium": 50
        },
        "servings": [
            { "id": "biscuit-2", "label": "2 Biscuits (~25g)", "grams": 25 },
            { "id": "g100", "label": "100g", "grams": 100 }
        ],
        "dietTypes": ["veg"],
        "tags": ["very-high-fat", "high-sugar", "calorie-dense", "sweet-snack"],
        "isProcessed": True, "isFastingFood": False, "fastingTypes": [],
        "isGlutenFree": False, "isRecipe": False, "containsRootVeg": False,
        "hasBeverageModifiers": False, "supportedConsistencyTypes": [], "consistencyMultipliers": {},
        "gi": 65, "cookingOilNote": None, "estimatedOilG": 0,
        "source": "curated-estimate", "confidence": "high"
    }
]

db_path = "/Users/ample/Desktop/fittrack-pro/src/data/foods/indianFoods.js"
with open(db_path, "r", encoding="utf-8") as file:
    content = file.read()

new_content = "\n  // ==========================================\n  // BRAND FOODS: BATCH B7 - Cookies, Chips, Biscuits\n  // ==========================================\n"

for item in b7_data:
    js_str = json.dumps(item, indent=2, ensure_ascii=False)
    js_str = '  ' + js_str.replace('\n', '\n  ') + ',\n'
    new_content += js_str

new_content = new_content.rstrip(',\n') + '\n'

idx = content.rfind('];')
if idx != -1:
    content = content[:idx] + new_content + '];\n'
    with open(db_path, "w", encoding="utf-8") as file:
        file.write(content)
    print("Successfully injected Batch B7 Cookies/Chips")
else:
    print("Could not find ];")
