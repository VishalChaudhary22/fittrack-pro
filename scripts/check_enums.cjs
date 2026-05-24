const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, '../todo_food_listings.md');
const content = fs.readFileSync(inputPath, 'utf8');
const match = content.match(/```javascript([\s\S]*?)```/);

const executableCode = match[1].replace(/export const/g, 'const');
const fn = new Function('', `${executableCode}; return foodExpansionListings;`);
let foods = fn();

const sources = new Set();
const confidences = new Set();
const itemTypes = new Set();
const states = new Set();
const regions = new Set();

foods.forEach(f => {
  sources.add(f.source);
  confidences.add(f.confidence);
  itemTypes.add(f.itemType);
  states.add(f.state);
  regions.add(f.region);
});

console.log('Sources:', Array.from(sources));
console.log('Confidences:', Array.from(confidences));
console.log('Item Types:', Array.from(itemTypes));
console.log('States:', Array.from(states));
console.log('Regions:', Array.from(regions));
