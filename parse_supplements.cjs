const fs = require('fs');

const md = fs.readFileSync('docs/05-Development/Food Database/TODO-supplement-db.md', 'utf8');

const blocks = md.match(/\*\*\d+\.\s+([^\*]+)\*\*[\s\S]*?Product ID:\s*([a-zA-Z0-9-]+)\n([\s\S]*?)(?=\n\*\*\d+\.|\n---|$)/g);
console.log(`Found ${blocks ? blocks.length : 0} blocks`);

let jsEntries = [];
let sqlEntries = [];
let servingsSql = [];

blocks.forEach(block => {
  const matchName = block.match(/\*\*\d+\.\s+([^\*]+)\*\*/);
  const brandProduct = matchName ? matchName[1].trim() : 'Unknown';
  
  // Extract Brand from brandProduct (first word is usually brand, but let's do a simple heuristic)
  let brand = brandProduct.split(' ')[0];
  if(brandProduct.startsWith('MuscleBlaze')) brand = 'MuscleBlaze';
  if(brandProduct.startsWith('AS-IT-IS')) brand = 'AS-IT-IS';
  if(brandProduct.startsWith('The Whole Truth')) brand = 'The Whole Truth';
  if(brandProduct.startsWith('Optimum Nutrition') || brandProduct.startsWith('ON ')) brand = 'Optimum Nutrition';
  if(brandProduct.startsWith('MyProtein')) brand = 'MyProtein';
  if(brandProduct.startsWith('Dymatize')) brand = 'Dymatize';
  if(brandProduct.startsWith('GNC')) brand = 'GNC';
  
  const idMatch = block.match(/Product ID:\s*([^\n]+)/);
  const id = idMatch[1].trim();

  const subCatMatch = block.match(/Sub-category:\s*([^\n\s]+)/);
  const subcategory = subCatMatch ? subCatMatch[1].trim() : 'supplement';

  const servingMatch = block.match(/Serving size:\s*([^\n]+)/);
  let servingStr = servingMatch ? servingMatch[1] : '';
  let scoopGrams = 30; // default fallback
  const scoopMatch = servingStr.match(/(\d+(?:\.\d+)?)\s*g/i);
  if(scoopMatch) scoopGrams = parseFloat(scoopMatch[1]);
  else if (servingStr.includes('half')) scoopGrams = 167; // special case ON serious mass half

  const calMatch = block.match(/Calories:\s*([\d,]+)/);
  const calories = calMatch ? parseFloat(calMatch[1].replace(/,/g, '')) : 0;

  const proMatch = block.match(/Protein:\s*([\d\.]+)/);
  const protein = proMatch ? parseFloat(proMatch[1]) : 0;

  const carbMatch = block.match(/Carbs:\s*([\d\.]+)/);
  const carbs = carbMatch ? parseFloat(carbMatch[1]) : 0;

  const fatMatch = block.match(/Fat:\s*([\d\.]+)/);
  const fat = fatMatch ? parseFloat(fatMatch[1]) : 0;

  const fibMatch = block.match(/Fiber:\s*([\d\.]+)/);
  const fiber = fibMatch ? parseFloat(fibMatch[1]) : 0;

  const sodMatch = block.match(/Sodium:\s*~?([\d\.]+)/);
  const sodium = sodMatch ? parseFloat(sodMatch[1]) : null;

  // Check if per 100g is explicitly provided
  const per100Match = block.match(/Per 100g powder:\s*(?:[\d,\.]+\s*kcal,\s*)?([\d\.]+)\s*g?\s*protein/i);
  
  let per100g = {};
  if (block.match(/Per 100g powder:/)) {
    const p100Line = block.match(/Per 100g powder:\s*([^\n]+)/)[1];
    const cMatch = p100Line.match(/([\d,\.]+)\s*kcal/);
    const pMatch = p100Line.match(/([\d\.]+)\s*g?\s*protein/);
    const crMatch = p100Line.match(/([\d\.]+)\s*g?\s*carbs/);
    const fMatch = p100Line.match(/([\d\.]+)\s*g?\s*fat/);

    per100g = {
      calories: cMatch ? parseFloat(cMatch[1].replace(/,/g, '')) : 0,
      protein: pMatch ? parseFloat(pMatch[1]) : 0,
      carbs: crMatch ? parseFloat(crMatch[1]) : 0,
      fat: fMatch ? parseFloat(fMatch[1]) : 0,
      fiber: (fiber / scoopGrams) * 100, // Extrapolate fiber
      sodium: sodium ? (sodium / scoopGrams) * 100 : null
    };
  } else {
    // Extrapolate from serving size
    const multiplier = 100 / scoopGrams;
    per100g = {
      calories: Math.round(calories * multiplier),
      protein: parseFloat((protein * multiplier).toFixed(1)),
      carbs: parseFloat((carbs * multiplier).toFixed(1)),
      fat: parseFloat((fat * multiplier).toFixed(1)),
      fiber: parseFloat((fiber * multiplier).toFixed(1)),
      sodium: sodium ? Math.round(sodium * multiplier) : null
    };
  }

  const jsEntry = `{
    id: '${id}',
    name: '${brandProduct}',
    brand: '${brand}',
    nameAlt: ['${brand.toLowerCase()}', 'protein', 'supplement', '${brand.toLowerCase().replace(/[\s-]/g, '')}'],
    searchTerms: ['${brand.toLowerCase()}', 'protein', '${subcategory.replace('-', ' ')}', '${brand.toLowerCase().replace(/[\s-]/g, '')}'],
    category: 'supplement',
    subcategory: '${subcategory}',
    itemType: 'supplement',
    state: 'raw',
    region: 'pan-indian',
    defaultServingGrams: ${scoopGrams},
    per100g: ${JSON.stringify(per100g)},
    servings: [
      { id: 'scoop', label: '1 scoop (${scoopGrams}g)', grams: ${scoopGrams} },
      { id: 'g100', label: '100g', grams: 100 }
    ],
    dietTypes: ['veg', 'nonveg'],
    tags: ['supplement'${subcategory.includes('mass') ? ", 'extreme-calories'" : ''}],
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
    source: 'FSSAI-label',
    confidence: 'high',
    notes: 'lastVerified: 2026-05'
  }`;

  jsEntries.push(jsEntry);

  const tagsSql = `ARRAY['supplement'${subcategory.includes('mass') ? ", 'extreme-calories'" : ''}]`;
  const nameAltSql = `ARRAY['${brand.toLowerCase()}', 'protein', 'supplement']`;
  const searchTermsSql = `ARRAY['${brand.toLowerCase()}', 'protein', '${subcategory.replace('-', ' ')}']`;
  const dietTypesSql = `ARRAY['veg'::public.diet_type_enum, 'nonveg'::public.diet_type_enum]`;

  sqlEntries.push(`
INSERT INTO public.foods (
  id, name, brand, name_alt, search_terms, category_id, subcategory, item_type, state, region,
  default_serving_grams, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sodium_per_100g,
  diet_types, tags, is_processed, source, confidence, notes
) VALUES (
  '${id}', '${brandProduct.replace(/'/g, "''")}', '${brand.replace(/'/g, "''")}', ${nameAltSql}, ${searchTermsSql}, 'supplement', '${subcategory}', 'supplement'::public.item_type_enum, 'raw'::public.food_state_enum, 'pan-indian'::public.region_enum,
  ${scoopGrams}, ${per100g.calories}, ${per100g.protein}, ${per100g.carbs}, ${per100g.fat}, ${per100g.fiber}, ${per100g.sodium || 'NULL'},
  ${dietTypesSql}, ${tagsSql}, true, 'FSSAI-label'::public.source_enum, 'high'::public.confidence_enum, 'lastVerified: 2026-05'
) ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, brand = EXCLUDED.brand, cal_per_100g = EXCLUDED.cal_per_100g, 
  protein_per_100g = EXCLUDED.protein_per_100g, carbs_per_100g = EXCLUDED.carbs_per_100g, fat_per_100g = EXCLUDED.fat_per_100g;
  `);

  servingsSql.push(`
INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES 
  ('${id}', 'scoop', '1 scoop (${scoopGrams}g)', ${scoopGrams}),
  ('${id}', 'g100', '100g', 100)
ON CONFLICT DO NOTHING;
  `);
});

fs.writeFileSync('supplements.js.txt', jsEntries.join(',\n'));
fs.writeFileSync('supplements.sql.txt', sqlEntries.join('\n') + '\n\n' + servingsSql.join('\n'));

console.log('Successfully wrote parsed supplements.');
