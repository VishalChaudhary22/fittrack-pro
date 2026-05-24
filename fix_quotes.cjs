const fs = require('fs');

const dataPath = 'src/data/foods/indianFoods.js';
let existingCode = fs.readFileSync(dataPath, 'utf8');

// Replace any '' inside a JS string with \'.
// The easiest is just doing a global replace of ''s to \'s and similar common ones
// But let's just do a blanket regex: replace '' with \' when preceded and followed by a letter.
existingCode = existingCode.replace(/([A-Za-z])''([A-Za-z])/g, "$1\\'$2");

fs.writeFileSync(dataPath, existingCode);
console.log('Fixed quotes in JS');
