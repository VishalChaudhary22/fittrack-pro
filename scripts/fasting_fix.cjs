const fs = require('fs');
const { indianFoods } = require('../src/data/foods/indianFoods.js');

const valid = new Set(['navratri', 'ekadashi', 'jain-paryushana', 'ramzan']);
let cnt = 0;

const path = require('path');
const file = path.join(__dirname, '../src/data/foods/indianFoods.js');
let text = fs.readFileSync(file, 'utf8');

text = text.replace(/"maha-shivratri"/g, '"navratri"');
text = text.replace(/"sawan"/g, '"navratri"');
text = text.replace(/"janmashtami"/g, '"navratri"');

fs.writeFileSync(file, text);
console.log('Done replacing invalid fasting types');
