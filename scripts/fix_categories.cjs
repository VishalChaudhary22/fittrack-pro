const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '../src/data/foods/indianFoods.js');
let content = fs.readFileSync(file, 'utf8');

// Replace standard categories that are misnamed
content = content.replace(/category: 'fasting'/g, "category: 'fasting-food'");
content = content.replace(/category: 'grain-millet'/g, "category: 'grain-cereal'");
content = content.replace(/category: "fasting"/g, "category: 'fasting-food'");
content = content.replace(/category: "grain-millet"/g, "category: 'grain-cereal'");

fs.writeFileSync(file, content);
console.log('Fixed categories!');
