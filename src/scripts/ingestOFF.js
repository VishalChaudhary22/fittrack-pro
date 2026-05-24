import fs from 'fs';
import path from 'path';

const BRANDS = [
  'muscleblaze', 'the-whole-truth', 'yogabar', 'ritebite', 'pintola',
  'myfitness', 'alpino', 'epigamia', 'amul', 'britannia', 'parle',
  'itc', 'nestle', 'kellogg-s', 'bagrry-s', 'quaker', 'slurrp-farm',
  'haldiram-s', 'bikaji', 'bikanervala', 'fast-up', 'oziva', 'dabur', 'patanjali'
];

// Mapping OFF category tags to FitTrack categories
function mapCategory(categoriesTags) {
  if (!categoriesTags) return 'packaged-food';
  const tags = categoriesTags.join(' ').toLowerCase();

  if (tags.includes('breakfast-cereals') || tags.includes('oats') || tags.includes('muesli')) return 'grain-cereal';
  if (tags.includes('breads')) return 'roti-bread';
  if (tags.includes('biscuits') || tags.includes('cakes') || tags.includes('cookies')) return 'packaged-food';
  if (tags.includes('chips') || tags.includes('crisps') || tags.includes('namkeen')) return 'snack-street';
  if (tags.includes('dairy') || tags.includes('milk') || tags.includes('yogurt') || tags.includes('paneer') || tags.includes('cheese')) return 'dairy';
  if (tags.includes('protein-supplements') || tags.includes('whey')) return 'supplement';
  if (tags.includes('peanut-butters') || tags.includes('nut-butters') || tags.includes('ghee') || tags.includes('butter')) return 'oil-fat';
  if (tags.includes('juices') || tags.includes('nectars') || tags.includes('drinks') || tags.includes('beverages')) return 'drink';
  if (tags.includes('instant-noodles') || tags.includes('pasta')) return 'packaged-food';
  if (tags.includes('confectioneries') || tags.includes('sweets') || tags.includes('chocolates')) return 'sweet-mithai';
  if (tags.includes('frozen-foods')) return 'packaged-food';
  if (tags.includes('dal') || tags.includes('legumes')) return 'dal-legume';
  if (tags.includes('nuts') || tags.includes('seeds')) return 'nut-seed';

  return 'packaged-food'; // fallback
}

// Map servings according to Indian Serving Mapper
function mapServings(category, productName, defaultServingSize) {
  const servings = [{ id: 'g100', label: '100g', grams: 100 }];
  let defaultGrams = 100;
  
  const nameL = productName.toLowerCase();
  
  // Try to parse serving size from OFF if available (e.g. "30 g" -> 30)
  let declaredGrams = null;
  if (defaultServingSize) {
    const match = defaultServingSize.match(/(\d+(?:\.\d+)?)\s*g/i);
    if (match) declaredGrams = parseFloat(match[1]);
  }

  if (nameL.includes('noodle') || nameL.includes('maggi')) {
    defaultGrams = declaredGrams || 70;
    servings.unshift({ id: 'piece', label: '1 packet', grams: defaultGrams });
  } else if (nameL.includes('biscuit') || nameL.includes('cookie')) {
    defaultGrams = declaredGrams || 13;
    servings.unshift({ id: 'piece', label: '1 biscuit', grams: defaultGrams });
  } else if (nameL.includes('peanut butter') || category === 'oil-fat') {
    defaultGrams = declaredGrams || 16;
    servings.unshift({ id: 'tbsp', label: '1 tablespoon', grams: defaultGrams });
  } else if (nameL.includes('oats') || nameL.includes('muesli') || nameL.includes('cereal')) {
    defaultGrams = declaredGrams || 40;
    servings.unshift({ id: 'bowl', label: '1 bowl', grams: defaultGrams });
  } else if (nameL.includes('yogurt') || nameL.includes('curd')) {
    defaultGrams = declaredGrams || 120;
    servings.unshift({ id: 'bowl', label: '1 cup/tub', grams: defaultGrams });
  } else if (nameL.includes('bar')) {
    defaultGrams = declaredGrams || 50;
    servings.unshift({ id: 'piece', label: '1 bar', grams: defaultGrams });
  } else if (category === 'snack-street') {
    defaultGrams = declaredGrams || 30;
    servings.unshift({ id: 'handful', label: '1 handful', grams: 30 });
    if (declaredGrams) servings.unshift({ id: 'packet', label: '1 packet', grams: declaredGrams });
  } else if (nameL.includes('cheese slice')) {
    defaultGrams = declaredGrams || 20;
    servings.unshift({ id: 'slice', label: '1 slice', grams: defaultGrams });
  } else if (nameL.includes('whey') || category === 'supplement') {
    defaultGrams = declaredGrams || 33;
    servings.unshift({ id: 'scoop', label: '1 scoop', grams: defaultGrams });
  } else if (category === 'drink') {
    defaultGrams = declaredGrams || 200;
    servings.unshift({ id: 'glass', label: '1 glass', grams: defaultGrams });
  } else {
    // Generic fallback
    if (declaredGrams) {
      defaultGrams = declaredGrams;
      servings.unshift({ id: 'serving', label: '1 serving', grams: declaredGrams });
    }
  }

  return { servings, defaultGrams };
}

function cleanString(str) {
  if(!str) return '';
  return str.replace(/'/g, "''").trim();
}

async function run() {
  const dataPath = path.join(process.cwd(), 'src/data/foods/indianFoods.js');
  let existingCode = fs.readFileSync(dataPath, 'utf8');
  
  let jsEntries = [];
  let sqlEntries = [];
  let servingsSql = [];
  
  let addedCount = 0;

  for (const brandTag of BRANDS) {
    console.log(`Fetching OFF data for ${brandTag}...`);
    try {
      const res = await fetch(`https://in.openfoodfacts.org/api/v2/search?brands_tags=${brandTag}&fields=code,product_name,brands,nutriments,serving_size,categories_tags,allergens_tags&page_size=15`);
      if (!res.ok) {
        console.warn(`Failed to fetch ${brandTag}: ${res.status}`);
        continue;
      }
      const data = await res.json();
      
      let brandCount = 0;

      for (const product of data.products) {
        if (brandCount >= 10) break; // limit to top 10

        const name = product.product_name;
        if (!name) continue;

        const nut = product.nutriments || {};
        const calories = nut['energy-kcal_100g'];
        const protein = nut['proteins_100g'];
        const carbs = nut['carbohydrates_100g'];
        const fat = nut['fat_100g'];

        // Must have core macros
        if (calories == null || protein == null || carbs == null || fat == null) continue;

        const brandStr = product.brands ? product.brands.split(',')[0].trim() : brandTag;
        
        // Use barcode as ID prefix to guarantee uniqueness, or slugify name
        const id = `off-${product.code || Math.random().toString(36).substring(2, 9)}`;

        // Deduplication check: extremely simple check if name already in JS string
        if (existingCode.toLowerCase().includes(name.toLowerCase())) {
          console.log(`Skipping duplicate: ${name}`);
          continue;
        }

        const category = mapCategory(product.categories_tags);
        const { servings, defaultGrams } = mapServings(category, name, product.serving_size);

        const per100g = {
          calories: Math.round(calories),
          protein: parseFloat(protein.toFixed(1)),
          carbs: parseFloat(carbs.toFixed(1)),
          fat: parseFloat(fat.toFixed(1)),
          fiber: nut['fiber_100g'] ? parseFloat(nut['fiber_100g'].toFixed(1)) : 0,
          sodium: nut['sodium_100g'] ? Math.round(nut['sodium_100g'] * 1000) : null // convert to mg
        };

        const allergens = product.allergens_tags ? product.allergens_tags.map(a => a.replace('en:', '')) : [];
        const barcode = product.code || '';

        const nameAlt = [brandStr.toLowerCase(), ...name.toLowerCase().split(' ').slice(0, 2)];
        const searchTerms = [brandStr.toLowerCase(), ...name.toLowerCase().split(' ')];

        const jsEntry = `{
    id: '${id}',
    name: '${cleanString(name)}',
    brand: '${cleanString(brandStr)}',
    barcode: '${barcode}',
    nameAlt: ${JSON.stringify(nameAlt)},
    searchTerms: ${JSON.stringify(searchTerms)},
    category: '${category}',
    subcategory: 'packaged',
    itemType: 'packaged',
    state: 'raw',
    region: 'pan-indian',
    defaultServingGrams: ${defaultGrams},
    per100g: ${JSON.stringify(per100g)},
    servings: ${JSON.stringify(servings)},
    dietTypes: ['veg', 'nonveg'],
    tags: ['packaged', 'fmcg'],
    isProcessed: true,
    isFastingFood: false,
    fastingTypes: [],
    isGlutenFree: false,
    isRecipe: false,
    containsRootVeg: false,
    hasBeverageModifiers: false,
    supportedConsistencyTypes: [],
    consistencyMultipliers: {},
    gi: null,
    allergens: ${JSON.stringify(allergens)},
    source: 'off-india',
    confidence: 'medium',
    notes: 'lastVerified: 2026-05'
  }`;

        jsEntries.push(jsEntry);

        const dietTypesSql = `ARRAY['veg'::public.diet_type_enum, 'nonveg'::public.diet_type_enum]`;
        const tagsSql = `ARRAY['packaged', 'fmcg']`;
        const allergensSql = allergens.length > 0 ? `ARRAY[${allergens.map(a => `'${cleanString(a)}'`).join(', ')}]` : `NULL`;
        const searchTermsSql = `ARRAY[${searchTerms.map(t => `'${cleanString(t)}'`).join(', ')}]`;
        const nameAltSql = `ARRAY[${nameAlt.map(t => `'${cleanString(t)}'`).join(', ')}]`;

        sqlEntries.push(`
INSERT INTO public.foods (
  id, name, brand, barcode, allergens, name_alt, search_terms, category_id, subcategory, item_type, state, region,
  default_serving_grams, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sodium_per_100g,
  diet_types, tags, is_processed, source, confidence, last_verified, notes
) VALUES (
  '${id}', '${cleanString(name)}', '${cleanString(brandStr)}', '${barcode}', ${allergensSql}, ${nameAltSql}, ${searchTermsSql}, '${category}', 'packaged', 'packaged'::public.item_type_enum, 'raw'::public.food_state_enum, 'pan-indian'::public.region_enum,
  ${defaultGrams}, ${per100g.calories}, ${per100g.protein}, ${per100g.carbs}, ${per100g.fat}, ${per100g.fiber}, ${per100g.sodium || 'NULL'},
  ${dietTypesSql}, ${tagsSql}, true, 'off-india'::public.source_enum, 'medium'::public.confidence_enum, '2026-05-01', 'Open Food Facts India'
) ON CONFLICT (id) DO NOTHING;`);

        servings.forEach(s => {
          servingsSql.push(`
INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('${id}', '${s.id}', '${cleanString(s.label)}', ${s.grams})
ON CONFLICT DO NOTHING;`);
        });

        brandCount++;
        addedCount++;
      }
    } catch (e) {
      console.error(`Error fetching ${brandTag}: ${e.message}`);
    }
  }

  console.log(`\nFound ${addedCount} valid products to ingest.`);

  if (addedCount > 0) {
    // Append JS
    const lastIndex = existingCode.lastIndexOf('];');
    if (lastIndex !== -1) {
      const before = existingCode.substring(0, lastIndex);
      const after = existingCode.substring(lastIndex);
      let newCode = before;
      if (!newCode.trim().endsWith(',')) newCode += ',\n';
      newCode += jsEntries.join(',\n') + '\n' + after;
      fs.writeFileSync(dataPath, newCode);
      console.log('Appended to indianFoods.js');
    }

    // Write SQL Migration
    const sqlPath = path.join(process.cwd(), 'supabase/migrations/20260522000002_seed_off_india.sql');
    fs.writeFileSync(sqlPath, `-- OFF India FMCG Ingestion\n\n` + sqlEntries.join('\n') + '\n\n' + servingsSql.join('\n'));
    console.log(`Created SQL migration: ${sqlPath}`);
  }
}

run();
