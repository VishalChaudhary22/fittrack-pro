const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../data/foods/indianFoods.js');
let lines = fs.readFileSync(dataPath, 'utf8').split('\n');

let inPer100g = false;
let currentPer100gLines = [];
let per100gStartIndex = -1;

for (let i = 0; i < lines.length; i++) {
  let line = lines[i];

  if (line.includes('per100g: {')) {
    // We found a start. But if it's single line, handle it.
    if (line.includes('}') && !line.includes('//')) {
      // It's a single line per100g without comments. We can easily inject.
      if (!line.includes('iron:')) {
        lines[i] = line.replace('per100g: {', 'per100g: { vitaminB12: null, vitaminD: null, iron: null, calcium: null,');
      }
      continue;
    } else {
      inPer100g = true;
      currentPer100gLines = [];
      per100gStartIndex = i;
      currentPer100gLines.push(line);
      continue;
    }
  }

  if (inPer100g) {
    currentPer100gLines.push(line);
    // If we hit the closing brace (not in a comment)
    // Actually, checking for '},' or '}' at the start of a line is safer
    if (line.trim().startsWith('}') || (line.includes('}') && line.split('//')[0].includes('}'))) {
      inPer100g = false;
      const blockStr = currentPer100gLines.join('\n');
      if (!blockStr.includes('iron:')) {
        // Inject right after 'per100g: {'
        lines[per100gStartIndex] = lines[per100gStartIndex].replace('per100g: {', 'per100g: {\n      vitaminB12: null,\n      vitaminD: null,\n      iron: null,\n      calcium: null,');
      }
    }
  }
}

// Write back
fs.writeFileSync(dataPath, lines.join('\n'));

// Now we do consistency and searchTerms on the full string using safer methods.
let content = fs.readFileSync(dataPath, 'utf8');

let items = content.split('  },');
for (let i = 0; i < items.length; i++) {
  let item = items[i];
  
  if (item.includes("category: 'dal-legume'") || item.includes("category: 'veg-dish'") || item.includes("category: 'non-veg'")) {
    if (item.includes('isRecipe: true') || item.includes("state: 'cooked'")) {
      item = item.replace(/supportedConsistencyTypes:\s*\[[^\]]*\]/, "supportedConsistencyTypes: ['thick', 'standard', 'watery']");
      item = item.replace(/consistencyMultipliers:\s*\{[^\}]*\}/, "consistencyMultipliers: { thick: 1.2, standard: 1.0, watery: 0.8 }");
    }
  }

  const nameMatch = item.match(/name:\s*'([^']+)'/);
  const brandMatch = item.match(/brand:\s*'([^']+)'/);
  const catMatch = item.match(/category:\s*'([^']+)'/);
  
  if (nameMatch && item.includes('searchTerms:')) {
    const name = nameMatch[1];
    const brand = brandMatch ? brandMatch[1] : '';
    const cat = catMatch ? catMatch[1] : '';
    
    const searchMatch = item.match(/searchTerms:\s*\[(.*?)\]/);
    let existingTerms = [];
    if (searchMatch && searchMatch[1]) {
      existingTerms = searchMatch[1].split(',').map(s => s.trim().replace(/'/g, '')).filter(Boolean);
    }
    
    let words = name.toLowerCase().replace(/[^a-z0-9 ]/g, '').split(' ').filter(Boolean);
    let newTerms = new Set([...existingTerms, ...words]);
    if (brand && brand !== 'Generic') newTerms.add(brand.toLowerCase());
    if (cat) newTerms.add(cat.replace('-', ' '));
    
    const newTermsArr = Array.from(newTerms).map(t => `'${t}'`).join(', ');
    item = item.replace(/searchTerms:\s*\[.*?\]/, `searchTerms: [${newTermsArr}]`);
  }

  items[i] = item;
}

fs.writeFileSync(dataPath, items.join('  },'));
console.log('Intelligence Audit completed.');
