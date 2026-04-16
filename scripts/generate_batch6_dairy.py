import json

b6_data = [
    # -----------------------------
    # EPIGAMIA
    # -----------------------------
    {
        "id": "dairy-epigamia-greek-plain-90g",
        "name": "Epigamia Greek Yogurt (Plain)",
        "nameAlt": ["epigamia natural", "epigamia plain greek"],
        "hindiName": "एपिगेमिया ग्रीक दही (प्लेन)",
        "searchTerms": ["epigamia", "greek yogurt", "plain", "natural", "dahi"],
        "category": "dairy",
        "subcategory": "greek-yogurt",
        "itemType": "snack",
        "state": "raw",
        "region": "pan-indian",
        "defaultServingGrams": 90,
        "brand": "Epigamia",
        "allergens": ["milk"],
        "per100g": {
            "calories": 76.6, "protein": 8.0, "carbs": 6.2, "fat": 2.2, "fiber": 0, "sodium": 55,
            "vitaminB12": 0.5, "vitaminD": 0, "iron": 0.1, "calcium": 175.5
        },
        "servings": [
            { "id": "cup-90", "label": "1 Cup (90g)", "grams": 90 },
            { "id": "g100", "label": "100g", "grams": 100 }
        ],
        "dietTypes": ["veg", "keto", "jain"],
        "tags": ["high-protein", "low-sugar"],
        "isProcessed": True, "isFastingFood": True, "fastingTypes": ["navratri"],
        "isGlutenFree": True, "isRecipe": False, "containsRootVeg": False,
        "hasBeverageModifiers": False, "supportedConsistencyTypes": [], "consistencyMultipliers": {},
        "gi": 15, "cookingOilNote": None, "estimatedOilG": 0,
        "source": "FSSAI-label", "confidence": "high"
    },
    {
        "id": "dairy-epigamia-greek-strawberry-85g",
        "name": "Epigamia Greek Yogurt (Strawberry)",
        "nameAlt": ["epigamia strawberry"],
        "hindiName": "एपिगेमिया ग्रीक दही (स्ट्रॉबेरी)",
        "searchTerms": ["epigamia", "greek yogurt", "strawberry", "flavoured"],
        "category": "dairy",
        "subcategory": "greek-yogurt",
        "itemType": "snack",
        "state": "raw",
        "region": "pan-indian",
        "defaultServingGrams": 85,
        "brand": "Epigamia",
        "allergens": ["milk"],
        "per100g": {
            "calories": 98.0, "protein": 6.6, "carbs": 13.7, "fat": 1.8, "fiber": 0.5, "sodium": 45,
            "vitaminB12": 0.2, "vitaminD": 0, "iron": 0.1, "calcium": 145.7
        },
        "servings": [
            { "id": "cup-85", "label": "1 Cup (85g)", "grams": 85 },
            { "id": "g100", "label": "100g", "grams": 100 }
        ],
        "dietTypes": ["veg"],
        "tags": ["sweet-snack", "moderate-protein"],
        "isProcessed": True, "isFastingFood": False, "fastingTypes": [],
        "isGlutenFree": True, "isRecipe": False, "containsRootVeg": False,
        "hasBeverageModifiers": False, "supportedConsistencyTypes": [], "consistencyMultipliers": {},
        "gi": 40, "cookingOilNote": None, "estimatedOilG": 0,
        "source": "FSSAI-label", "confidence": "high"
    },
    {
        "id": "dairy-epigamia-turbo-coffee-200ml",
        "name": "Epigamia Turbo Yogurt Drink (Coffee)",
        "nameAlt": ["epigamia turbo coffee"],
        "hindiName": "एपिगेमिया टर्बो कॉफी",
        "searchTerms": ["epigamia", "turbo", "coffee", "yogurt drink", "high protein"],
        "category": "dairy",
        "subcategory": "greek-yogurt",
        "itemType": "drink",
        "state": "ready-to-drink",
        "region": "pan-indian",
        "defaultServingGrams": 200,
        "brand": "Epigamia",
        "allergens": ["milk"],
        "per100g": {
            "calories": 60.0, "protein": 8.5, "carbs": 5.0, "fat": 1.5, "fiber": 0, "sodium": 40,
            "vitaminB12": 0.3, "vitaminD": 0, "iron": 0.1, "calcium": 130
        },
        "servings": [
            { "id": "bottle", "label": "1 Bottle (200ml)", "grams": 200 }
        ],
        "dietTypes": ["veg"],
        "tags": ["very-high-protein", "post-workout"],
        "isProcessed": True, "isFastingFood": False, "fastingTypes": [],
        "isGlutenFree": True, "isRecipe": False, "containsRootVeg": False,
        "hasBeverageModifiers": False, "supportedConsistencyTypes": [], "consistencyMultipliers": {},
        "gi": 25, "cookingOilNote": None, "estimatedOilG": 0,
        "source": "curated-estimate", "confidence": "medium"
    },

    # -----------------------------
    # MILKY MIST
    # -----------------------------
    {
        "id": "dairy-milkymist-skyr-plain-150g",
        "name": "Milky Mist Skyr (Plain)",
        "nameAlt": ["milky mist skyr plain", "icelandic yogurt"],
        "hindiName": "मिल्की मिस्ट स्काईर (प्लेन)",
        "searchTerms": ["milky mist", "skyr", "plain", "icelandic", "thick yogurt"],
        "category": "dairy",
        "subcategory": "greek-yogurt",
        "itemType": "snack",
        "state": "raw",
        "region": "pan-indian",
        "defaultServingGrams": 150,
        "brand": "Milky Mist",
        "allergens": ["milk"],
        "per100g": {
            "calories": 70.0, "protein": 12.0, "carbs": 10.0, "fat": 1.5, "fiber": 0, "sodium": 60,
            "vitaminB12": 0.4, "vitaminD": 0, "iron": 0.1, "calcium": 200
        },
        "servings": [
            { "id": "cup-150", "label": "1 Cup (150g)", "grams": 150 },
            { "id": "g100", "label": "100g", "grams": 100 }
        ],
        "dietTypes": ["veg", "jain"],
        "tags": ["very-high-protein", "low-fat"],
        "isProcessed": True, "isFastingFood": True, "fastingTypes": ["navratri"],
        "isGlutenFree": True, "isRecipe": False, "containsRootVeg": False,
        "hasBeverageModifiers": False, "supportedConsistencyTypes": [], "consistencyMultipliers": {},
        "gi": 15, "cookingOilNote": None, "estimatedOilG": 0,
        "source": "FSSAI-label", "confidence": "high"
    },
    {
        "id": "dairy-milkymist-greek-plain-100g",
        "name": "Milky Mist Greek Yogurt (Plain)",
        "nameAlt": ["milky mist greek"],
        "hindiName": "मिल्की मिस्ट ग्रीक दही",
        "searchTerms": ["milky mist", "greek yogurt", "plain"],
        "category": "dairy",
        "subcategory": "greek-yogurt",
        "itemType": "snack",
        "state": "raw",
        "region": "pan-indian",
        "defaultServingGrams": 100,
        "brand": "Milky Mist",
        "allergens": ["milk"],
        "per100g": {
            "calories": 85.0, "protein": 8.0, "carbs": 6.5, "fat": 3.0, "fiber": 0, "sodium": 50,
            "vitaminB12": 0.3, "vitaminD": 0, "iron": 0.1, "calcium": 150
        },
        "servings": [
            { "id": "cup-100", "label": "1 Cup (100g)", "grams": 100 }
        ],
        "dietTypes": ["veg", "jain"],
        "tags": ["high-protein"],
        "isProcessed": True, "isFastingFood": True, "fastingTypes": ["navratri"],
        "isGlutenFree": True, "isRecipe": False, "containsRootVeg": False,
        "hasBeverageModifiers": False, "supportedConsistencyTypes": [], "consistencyMultipliers": {},
        "gi": 15, "cookingOilNote": None, "estimatedOilG": 0,
        "source": "curated-estimate", "confidence": "medium"
    },

    # -----------------------------
    # HIGH PROTEIN CURD (AMUL & MOTHER DAIRY)
    # -----------------------------
    {
        "id": "dairy-amul-highprotein-curd-400g",
        "name": "Amul High Protein Dahi",
        "nameAlt": ["amul protein curd"],
        "hindiName": "अमूल हाई प्रोटीन दही",
        "searchTerms": ["amul", "high protein dahi", "curd", "protein curd", "25g"],
        "category": "dairy",
        "subcategory": "high-protein-curd",
        "itemType": "base-food",
        "state": "raw",
        "region": "pan-indian",
        "defaultServingGrams": 100,
        "brand": "Amul",
        "allergens": ["milk"],
        "per100g": {
            "calories": 68.0, "protein": 6.3, "carbs": 10.0, "fat": 0.1, "fiber": 0, "sodium": 60,
            "vitaminB12": 0.3, "vitaminD": 0, "iron": 0.1, "calcium": 140
        },
        "servings": [
            { "id": "cup-100", "label": "Small Bowl (100g)", "grams": 100 },
            { "id": "pack-400", "label": "Full Pack (400g)", "grams": 400 }
        ],
        "dietTypes": ["veg", "jain"],
        "tags": ["high-protein", "fat-free"],
        "isProcessed": True, "isFastingFood": True, "fastingTypes": ["navratri"],
        "isGlutenFree": True, "isRecipe": False, "containsRootVeg": False,
        "hasBeverageModifiers": False, "supportedConsistencyTypes": [], "consistencyMultipliers": {},
        "gi": 20, "cookingOilNote": None, "estimatedOilG": 0,
        "source": "FSSAI-label", "confidence": "high",
        "notes": "25g protein per 400g pack."
    },
    {
        "id": "dairy-motherdairy-protein-curd-400g",
        "name": "Mother Dairy High Protein Curd",
        "nameAlt": ["mother dairy protein curd", "protein dahi"],
        "hindiName": "मदर डेयरी हाई प्रोटीन दही",
        "searchTerms": ["mother dairy", "high protein curd", "dahi"],
        "category": "dairy",
        "subcategory": "high-protein-curd",
        "itemType": "base-food",
        "state": "raw",
        "region": "pan-indian",
        "defaultServingGrams": 100,
        "brand": "Mother Dairy",
        "allergens": ["milk"],
        "per100g": {
            "calories": 65.0, "protein": 8.0, "carbs": 5.0, "fat": 1.0, "fiber": 0, "sodium": 55,
            "vitaminB12": 0.3, "vitaminD": 0, "iron": 0.1, "calcium": 150
        },
        "servings": [
            { "id": "cup-100", "label": "Small Bowl (100g)", "grams": 100 },
            { "id": "pack-400", "label": "Full Tub (400g)", "grams": 400 }
        ],
        "dietTypes": ["veg", "jain"],
        "tags": ["high-protein", "low-fat"],
        "isProcessed": True, "isFastingFood": True, "fastingTypes": ["navratri"],
        "isGlutenFree": True, "isRecipe": False, "containsRootVeg": False,
        "hasBeverageModifiers": False, "supportedConsistencyTypes": [], "consistencyMultipliers": {},
        "gi": 20, "cookingOilNote": None, "estimatedOilG": 0,
        "source": "curated-estimate", "confidence": "medium"
    }
]

db_path = "/Users/ample/Desktop/fittrack-pro/src/data/foods/indianFoods.js"
with open(db_path, "r", encoding="utf-8") as file:
    content = file.read()

new_content = "\n  // ==========================================\n  // BRAND FOODS: BATCH B6 - Greek Yogurt & Dairy\n  // ==========================================\n"

for item in b6_data:
    js_str = json.dumps(item, indent=2, ensure_ascii=False)
    js_str = '  ' + js_str.replace('\n', '\n  ') + ',\n'
    new_content += js_str

new_content = new_content.rstrip(',\n') + '\n'

idx = content.rfind('];')
if idx != -1:
    content = content[:idx] + new_content + '];\n'
    with open(db_path, "w", encoding="utf-8") as file:
        file.write(content)
    print("Successfully injected Batch B6 Dairy")
else:
    print("Could not find ];")
