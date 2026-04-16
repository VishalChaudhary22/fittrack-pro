import json

b5_data = [
    # -----------------------------
    # SEEDS
    # -----------------------------
    {
        "id": "snack-trueelements-seedsmix-roasted",
        "name": "True Elements Roasted Seeds Mix",
        "nameAlt": ["true elements seed mix", "sunflower pumpkin flax"],
        "hindiName": "ट्रू एलीमेंट्स रोस्टेड सीड्स मिक्स",
        "searchTerms": ["true elements", "seeds", "roasted", "mix", "sunflower", "pumpkin", "flax"],
        "category": "snack-street",
        "subcategory": "health-snack-packaged",
        "itemType": "snack",
        "state": "raw",
        "region": "pan-indian",
        "defaultServingGrams": 30,
        "brand": "True Elements",
        "allergens": ["seeds", "tree-nuts"],
        "per100g": {
            "calories": 648, "protein": 27.7, "carbs": 45.1, "fat": 56.4, "fiber": 9.8, "sodium": 16,
            "vitaminB12": 0, "vitaminD": 0, "iron": 4.5, "calcium": 60
        },
        "servings": [
            { "id": "tbsp-1", "label": "1 Tbsp (15g)", "grams": 15 },
            { "id": "handful", "label": "Small Handful (30g)", "grams": 30 },
            { "id": "g100", "label": "100g", "grams": 100 }
        ],
        "dietTypes": ["vegan", "veg", "keto", "jain"],
        "tags": ["high-fat", "high-protein", "keto-friendly"],
        "isProcessed": True, "isFastingFood": True, "fastingTypes": ["navratri"],
        "isGlutenFree": True, "isRecipe": False, "containsRootVeg": False,
        "hasBeverageModifiers": False, "supportedConsistencyTypes": [], "consistencyMultipliers": {},
        "gi": 20, "cookingOilNote": None, "estimatedOilG": 0,
        "source": "FSSAI-label", "confidence": "high"
    },
    {
        "id": "snack-farmley-seeds-pumpkin-roasted",
        "name": "Farmley Roasted Pumpkin Seeds",
        "nameAlt": ["roasted pumpkin seeds farmley"],
        "hindiName": "रोस्टेड कद्दू के बीज",
        "searchTerms": ["farmley", "pumpkin seeds", "roasted", "kaddu beej"],
        "category": "snack-street",
        "subcategory": "health-snack-packaged",
        "itemType": "snack",
        "state": "raw",
        "region": "pan-indian",
        "defaultServingGrams": 30,
        "brand": "Farmley",
        "allergens": ["seeds"],
        "per100g": {
            "calories": 569, "protein": 30.8, "carbs": 11.5, "fat": 44.4, "fiber": 6.4, "sodium": 305,
            "vitaminB12": 0, "vitaminD": 0, "iron": 8.8, "calcium": 45
        },
        "servings": [
            { "id": "tbsp-1", "label": "1 Tbsp (15g)", "grams": 15 },
            { "id": "handful", "label": "Small Handful (30g)", "grams": 30 },
            { "id": "g100", "label": "100g", "grams": 100 }
        ],
        "dietTypes": ["vegan", "veg", "keto", "jain"],
        "tags": ["high-protein", "high-fat", "keto-friendly"],
        "isProcessed": True, "isFastingFood": True, "fastingTypes": ["navratri"],
        "isGlutenFree": True, "isRecipe": False, "containsRootVeg": False,
        "hasBeverageModifiers": False, "supportedConsistencyTypes": [], "consistencyMultipliers": {},
        "gi": 15, "cookingOilNote": None, "estimatedOilG": 0,
        "source": "FSSAI-label", "confidence": "high"
    },
    
    # -----------------------------
    # TRAIL MIXES
    # -----------------------------
    {
        "id": "snack-happilo-trailmix-seeds-berries",
        "name": "Happilo Premium Trail Mix (Seeds & Berries)",
        "nameAlt": ["happilo trail mix"],
        "hindiName": "हैप्पीलो प्रीमियम ट्रेल मिक्स",
        "searchTerms": ["happilo", "trail mix", "seeds", "berries", "premium"],
        "category": "snack-street",
        "subcategory": "health-snack-packaged",
        "itemType": "snack",
        "state": "raw",
        "region": "pan-indian",
        "defaultServingGrams": 30,
        "brand": "Happilo",
        "allergens": ["seeds", "tree-nuts"],
        "per100g": {
            "calories": 480, "protein": 14.0, "carbs": 42.0, "fat": 30.0, "fiber": 8.0, "sodium": 15,
            "vitaminB12": 0, "vitaminD": 0, "iron": 3.0, "calcium": 50
        },
        "servings": [
            { "id": "handful", "label": "Small Handful (30g)", "grams": 30 },
            { "id": "g100", "label": "100g", "grams": 100 }
        ],
        "dietTypes": ["vegan", "veg", "jain"],
        "tags": ["nutrient-dense", "snack"],
        "isProcessed": True, "isFastingFood": True, "fastingTypes": ["navratri"],
        "isGlutenFree": True, "isRecipe": False, "containsRootVeg": False,
        "hasBeverageModifiers": False, "supportedConsistencyTypes": [], "consistencyMultipliers": {},
        "gi": 40, "cookingOilNote": None, "estimatedOilG": 0,
        "source": "curated-estimate", "confidence": "medium"
    },
    {
        "id": "snack-yogabar-trailmix-fruits-nuts",
        "name": "Yogabar Trail Mix (Fruits & Nuts)",
        "nameAlt": ["yogabar trail mix"],
        "hindiName": "योगा बार ट्रेल मिक्स",
        "searchTerms": ["yogabar", "trail mix", "fruits", "nuts"],
        "category": "snack-street",
        "subcategory": "health-snack-packaged",
        "itemType": "snack",
        "state": "raw",
        "region": "pan-indian",
        "defaultServingGrams": 30,
        "brand": "Yogabar",
        "allergens": ["tree-nuts", "seeds"],
        "per100g": {
            "calories": 450, "protein": 12.0, "carbs": 50.0, "fat": 25.0, "fiber": 7.0, "sodium": 50,
            "vitaminB12": 0, "vitaminD": 0, "iron": 2.5, "calcium": 40
        },
        "servings": [
            { "id": "handful", "label": "Small Handful (30g)", "grams": 30 },
            { "id": "g100", "label": "100g", "grams": 100 }
        ],
        "dietTypes": ["vegan", "veg", "jain"],
        "tags": ["sweet-snack", "nutrient-dense"],
        "isProcessed": True, "isFastingFood": True, "fastingTypes": ["navratri"],
        "isGlutenFree": True, "isRecipe": False, "containsRootVeg": False,
        "hasBeverageModifiers": False, "supportedConsistencyTypes": [], "consistencyMultipliers": {},
        "gi": 45, "cookingOilNote": None, "estimatedOilG": 0,
        "source": "curated-estimate", "confidence": "medium"
    },

    # -----------------------------
    # COOKIES & MAKHANA
    # -----------------------------
    {
        "id": "snack-opensecret-cookie-choco-almond",
        "name": "Open Secret Nutty Cookies (Choco Almond)",
        "nameAlt": ["open secret cookies"],
        "hindiName": "ओपन सीक्रेट चोको बादाम कुकीज़",
        "searchTerms": ["open secret", "cookie", "choco almond", "nutty", "un-junked"],
        "category": "snack-street",
        "subcategory": "health-snack-packaged",
        "itemType": "snack",
        "state": "raw",
        "region": "pan-indian",
        "defaultServingGrams": 25,
        "brand": "Open Secret",
        "allergens": ["tree-nuts", "milk", "soy", "gluten"],
        "per100g": {
            "calories": 417, "protein": 10.5, "carbs": 42.0, "fat": 23.0, "fiber": 4.0, "sodium": 110,
            "vitaminB12": 0, "vitaminD": 0, "iron": 2.0, "calcium": 50
        },
        "servings": [
            { "id": "cookie-1", "label": "1 Cookie (25g)", "grams": 25 },
            { "id": "g100", "label": "100g", "grams": 100 }
        ],
        "dietTypes": ["veg"],
        "tags": ["sweet-snack", "high-sugar"],
        "isProcessed": True, "isFastingFood": False, "fastingTypes": [],
        "isGlutenFree": False, "isRecipe": False, "containsRootVeg": False,
        "hasBeverageModifiers": False, "supportedConsistencyTypes": [], "consistencyMultipliers": {},
        "gi": 55, "cookingOilNote": None, "estimatedOilG": 0,
        "source": "FSSAI-label", "confidence": "high"
    },
    {
        "id": "snack-muscleblaze-protein-makhana-peri-peri",
        "name": "MuscleBlaze Protein Makhana (Peri Peri)",
        "nameAlt": ["mb makhana"],
        "hindiName": "मसलब्लेज़ प्रोटीन मखाना पेरी पेरी",
        "searchTerms": ["muscleblaze", "mb", "protein", "makhana", "fox nuts", "peri peri"],
        "category": "snack-street",
        "subcategory": "health-snack-packaged",
        "itemType": "snack",
        "state": "raw",
        "region": "pan-indian",
        "defaultServingGrams": 40,
        "brand": "MuscleBlaze",
        "allergens": ["milk", "soy"],
        "per100g": {
            "calories": 390, "protein": 20.0, "carbs": 60.0, "fat": 10.0, "fiber": 5.0, "sodium": 650,
            "vitaminB12": 0, "vitaminD": 0, "iron": 1.5, "calcium": 250
        },
        "servings": [
            { "id": "pack-1", "label": "1 Pack (40g)", "grams": 40 },
            { "id": "g100", "label": "100g", "grams": 100 }
        ],
        "dietTypes": ["veg"],
        "tags": ["high-protein", "savoury", "high-sodium"],
        "isProcessed": True, "isFastingFood": False, "fastingTypes": [],
        "isGlutenFree": True, "isRecipe": False, "containsRootVeg": False,
        "hasBeverageModifiers": False, "supportedConsistencyTypes": [], "consistencyMultipliers": {},
        "gi": 45, "cookingOilNote": None, "estimatedOilG": 0,
        "source": "curated-estimate", "confidence": "medium"
    },
    {
        "id": "snack-twt-minibar-cocoa-almond",
        "name": "The Whole Truth Mini Bar (Cocoa Almond)",
        "nameAlt": ["twt mini bar"],
        "hindiName": "द होल ट्रुथ मिनी बार",
        "searchTerms": ["twt", "the whole truth", "mini bar", "cocoa almond", "bite sized"],
        "category": "snack-street",
        "subcategory": "health-snack-packaged",
        "itemType": "snack",
        "state": "raw",
        "region": "pan-indian",
        "defaultServingGrams": 27,
        "brand": "The Whole Truth",
        "allergens": ["tree-nuts", "milk"],
        "per100g": {
            "calories": 481, "protein": 22.0, "carbs": 44.0, "fat": 25.0, "fiber": 8.0, "sodium": 150,
            "vitaminB12": 0, "vitaminD": 0, "iron": 1.5, "calcium": 60
        },
        "servings": [
            { "id": "bar-mini", "label": "1 Mini Bar (27g)", "grams": 27 },
            { "id": "g100", "label": "100g", "grams": 100 }
        ],
        "dietTypes": ["veg"],
        "tags": ["clean-label", "snack"],
        "isProcessed": True, "isFastingFood": False, "fastingTypes": [],
        "isGlutenFree": True, "isRecipe": False, "containsRootVeg": False,
        "hasBeverageModifiers": False, "supportedConsistencyTypes": [], "consistencyMultipliers": {},
        "gi": 40, "cookingOilNote": None, "estimatedOilG": 0,
        "source": "curated-estimate", "confidence": "high"
    }
]

db_path = "/Users/ample/Desktop/fittrack-pro/src/data/foods/indianFoods.js"
with open(db_path, "r", encoding="utf-8") as file:
    content = file.read()

new_content = "\n  // ==========================================\n  // BRAND FOODS: BATCH B5 - Snacks & Trail Mixes\n  // ==========================================\n"

for item in b5_data:
    js_str = json.dumps(item, indent=2, ensure_ascii=False)
    js_str = '  ' + js_str.replace('\n', '\n  ') + ',\n'
    new_content += js_str

new_content = new_content.rstrip(',\n') + '\n'

idx = content.rfind('];')
if idx != -1:
    content = content[:idx] + new_content + '];\n'
    with open(db_path, "w", encoding="utf-8") as file:
        file.write(content)
    print("Successfully injected Batch B5 Snacks")
else:
    print("Could not find ];")
