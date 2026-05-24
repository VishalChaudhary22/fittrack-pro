const fs = require('fs');

let content = fs.readFileSync('src/data/foods/indianFoods.js', 'utf8');

// Replace 'non-veg' with 'nonveg'
content = content.replace(/'non-veg'/g, "'nonveg'");

// Replace category: 'curry' with category: 'dal-legume'
content = content.replace(/category:\s*'curry'/g, "category: 'dal-legume'");

fs.writeFileSync('src/data/foods/indianFoods.js', content);
console.log('Fixed indianFoods.js');
