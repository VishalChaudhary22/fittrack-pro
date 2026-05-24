import fs from 'fs';
import path from 'path';

const indbFoods = [
  // SOUTH INDIAN
  { name: 'Pesarattu', desc: 'Andhra green gram dosa', cal: 180, p: 7.5, c: 25, f: 5, fib: 3, cat: 'roti-bread', dt: ['veg'], srv: [{ id: 'piece', label: '1 dosa', g: 80 }] },
  { name: 'Appam', desc: 'Kerala fermented rice pancake', cal: 175, p: 2.5, c: 38, f: 1.5, fib: 1.5, cat: 'roti-bread', dt: ['veg'], srv: [{ id: 'piece', label: '1 appam', g: 50 }] },
  { name: 'Bisi Bele Bath', desc: 'Karnataka spicy rice and dal', cal: 140, p: 3.5, c: 22, f: 4, fib: 2, cat: 'rice-dish', dt: ['veg'], srv: [{ id: 'plate', label: '1 plate', g: 250 }, { id: 'bowl', label: '1 bowl', g: 200 }] },
  { name: 'Neer Dosa', desc: 'Mangalorean thin rice crepe', cal: 150, p: 2.5, c: 30, f: 2, fib: 1, cat: 'roti-bread', dt: ['veg'], srv: [{ id: 'piece', label: '1 dosa', g: 45 }] },
  { name: 'Kuzhi Paniyaram', desc: 'South Indian rice batter balls', cal: 195, p: 4, c: 30, f: 6, fib: 2, cat: 'snack-street', dt: ['veg'], srv: [{ id: 'piece', label: '1 piece', g: 25 }] },
  { name: 'Puttu', desc: 'Kerala steamed rice cake', cal: 170, p: 3.5, c: 35, f: 1, fib: 2, cat: 'roti-bread', dt: ['veg'], srv: [{ id: 'piece', label: '1 piece (log)', g: 100 }] },
  { name: 'Kadala Curry', desc: 'Kerala black chickpea curry', cal: 135, p: 6, c: 18, f: 4.5, fib: 5, cat: 'dal-legume', dt: ['veg'], srv: [{ id: 'katori', label: '1 katori', g: 150 }] },
  { name: 'Ven Pongal', desc: 'Tamil Nadu rice and moong dal', cal: 165, p: 4.5, c: 22, f: 6.5, fib: 2, cat: 'rice-dish', dt: ['veg'], srv: [{ id: 'bowl', label: '1 bowl', g: 200 }] },
  { name: 'Chettinad Chicken', desc: 'Spicy Tamil Nadu chicken curry', cal: 160, p: 14, c: 5, f: 9, fib: 1, cat: 'non-veg', dt: ['nonveg'], srv: [{ id: 'katori', label: '1 katori', g: 150 }, { id: 'bowl', label: '1 bowl', g: 250 }] },
  { name: 'Vangi Bath', desc: 'Karnataka eggplant rice', cal: 160, p: 3, c: 28, f: 4, fib: 2, cat: 'rice-dish', dt: ['veg'], srv: [{ id: 'plate', label: '1 plate', g: 250 }] },
  
  // RAJASTHANI / MARWARI
  { name: 'Dal Baati Churma', desc: 'Rajasthani lentil, baked wheat balls, sweet crumble', cal: 260, p: 6, c: 36, f: 10, fib: 4, cat: 'meal-combo', dt: ['veg'], srv: [{ id: 'plate', label: '1 plate', g: 300 }] },
  { name: 'Gatte ki Sabzi', desc: 'Rajasthani gram flour dumplings in yogurt gravy', cal: 145, p: 5, c: 14, f: 8, fib: 2, cat: 'veg-dish', dt: ['veg'], srv: [{ id: 'katori', label: '1 katori', g: 150 }] },
  { name: 'Pyaaz Kachori', desc: 'Rajasthani deep-fried onion pastry', cal: 310, p: 4, c: 38, f: 16, fib: 2, cat: 'snack-street', dt: ['veg'], srv: [{ id: 'piece', label: '1 piece', g: 120 }] },
  { name: 'Laal Maas', desc: 'Rajasthani spicy mutton curry', cal: 190, p: 12, c: 4, f: 14, fib: 1, cat: 'non-veg', dt: ['nonveg'], srv: [{ id: 'katori', label: '1 katori', g: 150 }, { id: 'bowl', label: '1 bowl', g: 250 }] },
  { name: 'Mirchi Bada', desc: 'Rajasthani potato stuffed chili fritter', cal: 240, p: 4, c: 26, f: 13, fib: 3, cat: 'snack-street', dt: ['veg'], srv: [{ id: 'piece', label: '1 piece', g: 100 }] },

  // GUJARATI
  { name: 'Undhiyu', desc: 'Gujarati mixed vegetable dish', cal: 130, p: 3, c: 15, f: 6, fib: 4, cat: 'veg-dish', dt: ['veg'], srv: [{ id: 'katori', label: '1 katori', g: 150 }] },
  { name: 'Khandvi', desc: 'Gujarati gram flour rolls', cal: 110, p: 4, c: 16, f: 3, fib: 2, cat: 'snack-street', dt: ['veg'], srv: [{ id: 'piece', label: '1 piece', g: 15 }] },
  { name: 'Thepla', desc: 'Gujarati spiced flatbread with fenugreek', cal: 280, p: 7, c: 42, f: 9, fib: 5, cat: 'roti-bread', dt: ['veg'], srv: [{ id: 'piece', label: '1 thepla', g: 40 }] },
  { name: 'Fafda', desc: 'Gujarati deep-fried chickpea snack', cal: 480, p: 10, c: 45, f: 28, fib: 4, cat: 'snack-street', dt: ['veg'], srv: [{ id: 'handful', label: '1 handful', g: 30 }, { id: 'plate', label: '1 plate', g: 100 }] },
  { name: 'Handvo', desc: 'Gujarati savory baked lentil cake', cal: 210, p: 7, c: 30, f: 7, fib: 4, cat: 'snack-street', dt: ['veg'], srv: [{ id: 'piece', label: '1 slice', g: 60 }] },
  { name: 'Patra', desc: 'Gujarati colocasia leaves snack', cal: 180, p: 5, c: 28, f: 5, fib: 3, cat: 'snack-street', dt: ['veg'], srv: [{ id: 'piece', label: '1 slice', g: 25 }] },

  // BENGALI
  { name: 'Cholar Dal', desc: 'Bengali chana dal with coconut', cal: 140, p: 5.5, c: 20, f: 4.5, fib: 4, cat: 'dal-legume', dt: ['veg'], srv: [{ id: 'katori', label: '1 katori', g: 150 }] },
  { name: 'Shukto', desc: 'Bengali mixed veg bitter stew', cal: 100, p: 2.5, c: 12, f: 4.5, fib: 3, cat: 'veg-dish', dt: ['veg'], srv: [{ id: 'katori', label: '1 katori', g: 150 }] },
  { name: 'Kosha Mangsho', desc: 'Bengali slow-cooked mutton curry', cal: 210, p: 13, c: 5, f: 15, fib: 1, cat: 'non-veg', dt: ['nonveg'], srv: [{ id: 'katori', label: '1 katori', g: 150 }, { id: 'bowl', label: '1 bowl', g: 250 }] },
  { name: 'Rasgulla', desc: 'Bengali syrupy cheese ball', cal: 260, p: 4, c: 55, f: 3, fib: 0, cat: 'sweet-mithai', dt: ['veg'], srv: [{ id: 'piece', label: '1 piece', g: 45 }] },
  { name: 'Machher Jhol', desc: 'Bengali light fish curry', cal: 120, p: 10, c: 4, f: 7, fib: 1, cat: 'non-veg', dt: ['nonveg'], srv: [{ id: 'katori', label: '1 katori', g: 150 }, { id: 'bowl', label: '1 bowl', g: 250 }] },
  { name: 'Aloo Posto', desc: 'Bengali potato with poppy seeds', cal: 160, p: 3, c: 22, f: 6, fib: 2, cat: 'veg-dish', dt: ['veg'], srv: [{ id: 'katori', label: '1 katori', g: 150 }] },
  { name: 'Jhal Muri', desc: 'Bengali puffed rice snack', cal: 350, p: 8, c: 65, f: 7, fib: 5, cat: 'snack-street', dt: ['veg'], srv: [{ id: 'packet', label: '1 thonga/cone', g: 60 }] },

  // STREET FOOD & MAHARASHTRIAN / BIHARI
  { name: 'Misal Pav', desc: 'Maharashtrian sprouted moth bean curry with bread', cal: 220, p: 7, c: 32, f: 7, fib: 5, cat: 'meal-combo', dt: ['veg'], srv: [{ id: 'plate', label: '1 plate (2 pav)', g: 300 }] },
  { name: 'Dabeli', desc: 'Kutchi sweet & spicy potato burger', cal: 240, p: 4, c: 42, f: 6, fib: 3, cat: 'snack-street', dt: ['veg'], srv: [{ id: 'piece', label: '1 piece', g: 120 }] },
  { name: 'Litti Chokha', desc: 'Bihari stuffed wheat balls with roasted eggplant', cal: 250, p: 8, c: 40, f: 6, fib: 6, cat: 'meal-combo', dt: ['veg'], srv: [{ id: 'plate', label: '1 plate (2 litti)', g: 200 }] },
  { name: 'Thalipeeth', desc: 'Maharashtrian multigrain flatbread', cal: 260, p: 8, c: 40, f: 7, fib: 6, cat: 'roti-bread', dt: ['veg'], srv: [{ id: 'piece', label: '1 thalipeeth', g: 80 }] },
  { name: 'Puran Poli', desc: 'Maharashtrian sweet lentil flatbread', cal: 310, p: 6, c: 58, f: 6, fib: 4, cat: 'sweet-mithai', dt: ['veg'], srv: [{ id: 'piece', label: '1 puran poli', g: 80 }] },
  { name: 'Sabudana Khichdi', desc: 'Maharashtrian tapioca pearl dish', cal: 280, p: 2, c: 50, f: 8, fib: 1, cat: 'snack-street', dt: ['veg'], srv: [{ id: 'plate', label: '1 plate', g: 200 }, { id: 'katori', label: '1 katori', g: 100 }] },
  { name: 'Kanda Poha', desc: 'Maharashtrian flattened rice with onions', cal: 180, p: 4, c: 32, f: 4, fib: 2, cat: 'snack-street', dt: ['veg'], srv: [{ id: 'plate', label: '1 plate', g: 150 }] },
];

function cleanJsStr(str) {
  if(!str) return '';
  return str.replace(/'/g, "\\'"); // escape single quotes for JS
}

function cleanSqlStr(str) {
  if(!str) return '';
  return str.replace(/'/g, "''"); // escape single quotes for SQL
}

function toId(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

async function run() {
  const dataPath = path.join(process.cwd(), 'src/data/foods/indianFoods.js');
  let existingCode = fs.readFileSync(dataPath, 'utf8');
  
  let jsEntries = [];
  let sqlEntries = [];
  let servingsSql = [];
  
  let addedCount = 0;

  for (const item of indbFoods) {
    const id = toId(item.name);
    
    // Deduplication check
    if (existingCode.toLowerCase().includes(item.name.toLowerCase())) {
      console.log(`Skipping duplicate: ${item.name}`);
      continue;
    }

    const defaultGrams = item.srv[0].g;
    item.srv.push({ id: 'g100', label: '100g', g: 100 });
    
    const servingsJs = item.srv.map(s => `{ id: '${s.id}', label: '${cleanJsStr(s.label)}', grams: ${s.g} }`).join(', ');

    const nameAlt = [item.name.toLowerCase(), ...item.name.toLowerCase().split(' ')];
    const searchTerms = [item.name.toLowerCase(), ...item.name.toLowerCase().split(' '), item.cat.replace('-', ' ')];

    const jsEntry = `{
    id: '${id}',
    name: '${cleanJsStr(item.name)}',
    brand: 'Generic',
    barcode: '',
    nameAlt: ${JSON.stringify(nameAlt)},
    searchTerms: ${JSON.stringify(searchTerms)},
    category: '${item.cat}',
    subcategory: 'regional',
    itemType: 'prepared',
    state: 'cooked',
    region: 'pan-indian',
    defaultServingGrams: ${defaultGrams},
    per100g: { calories: ${item.cal}, protein: ${item.p}, carbs: ${item.c}, fat: ${item.f}, fiber: ${item.fib}, sodium: null },
    servings: [${servingsJs}],
    dietTypes: ${JSON.stringify(item.dt)},
    tags: ['regional', 'indb-deep'],
    isProcessed: false,
    isFastingFood: false,
    fastingTypes: [],
    isGlutenFree: false,
    isRecipe: true,
    containsRootVeg: false,
    hasBeverageModifiers: false,
    supportedConsistencyTypes: [],
    consistencyMultipliers: {},
    gi: null,
    allergens: [],
    source: 'curated-estimate',
    confidence: 'high',
    notes: 'lastVerified: 2026-05 | ${cleanJsStr(item.desc)}'
  }`;

    jsEntries.push(jsEntry);

    const dietTypesSql = `ARRAY[${item.dt.map(d => `'${d}'::public.diet_type_enum`).join(', ')}]`;
    const tagsSql = `ARRAY['regional', 'indb-deep']`;
    const searchTermsSql = `ARRAY[${searchTerms.map(t => `'${cleanSqlStr(t)}'`).join(', ')}]`;
    const nameAltSql = `ARRAY[${nameAlt.map(t => `'${cleanSqlStr(t)}'`).join(', ')}]`;

    sqlEntries.push(`
INSERT INTO public.foods (
  id, name, brand, name_alt, search_terms, category_id, subcategory, item_type, state, region,
  default_serving_grams, cal_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sodium_per_100g,
  diet_types, tags, is_processed, is_recipe, source, confidence, last_verified, notes
) VALUES (
  '${id}', '${cleanSqlStr(item.name)}', 'Generic', ${nameAltSql}, ${searchTermsSql}, '${item.cat}', 'regional', 'prepared'::public.item_type_enum, 'cooked'::public.food_state_enum, 'pan-indian'::public.region_enum,
  ${defaultGrams}, ${item.cal}, ${item.p}, ${item.c}, ${item.f}, ${item.fib}, NULL,
  ${dietTypesSql}, ${tagsSql}, false, true, 'curated-estimate'::public.source_enum, 'high'::public.confidence_enum, '2026-05-01', '${cleanSqlStr(item.desc)}'
) ON CONFLICT (id) DO NOTHING;`);

    item.srv.forEach(s => {
      servingsSql.push(`
INSERT INTO public.food_servings (food_id, serving_id, label, grams)
VALUES ('${id}', '${s.id}', '${cleanSqlStr(s.label)}', ${s.g})
ON CONFLICT DO NOTHING;`);
    });

    addedCount++;
  }

  console.log(`\nGenerated ${addedCount} INDB Deep Expansion items.`);

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
    const sqlPath = path.join(process.cwd(), 'supabase/migrations/20260522000003_seed_indb_deep_expansion.sql');
    fs.writeFileSync(sqlPath, `-- INDB Deep Expansion (Phase 3)\n\n` + sqlEntries.join('\n') + '\n\n' + servingsSql.join('\n'));
    console.log(`Created SQL migration: ${sqlPath}`);
  }
}

run();
