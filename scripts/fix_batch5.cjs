const fs = require('fs');
const path = require('path');

const addBatch5Path = path.join(__dirname, 'add_batch5.cjs');
let addBatch5Content = fs.readFileSync(addBatch5Path, 'utf8');

// Find the end of the array inside add_batch5.cjs, which is around line 706.
// Luckily, the array closes with "\n];" right before the fs require
const endOfArray = addBatch5Content.indexOf('\n];\n');
let arrayCode = addBatch5Content.slice(0, endOfArray + 3);

// The arrayCode starts with:
// const fs = require('fs');
// const path = require('path');
// const batch5Foods = [
// We can just strip the require lines.

arrayCode = arrayCode.replace(/const fs = require\('fs'\);[\s\S]*const batch5Foods = /, 'const batch5Foods = ');

// Get the 34 foods from batch5_more.cjs
const batch5MorePath = path.join(__dirname, 'batch5_more.cjs');
let batch5MoreContent = fs.readFileSync(batch5MorePath, 'utf8');
// The file batch5_more.cjs declares batch5Sweets, batch5Fruits, batch5Drinks
// And puts them into batch5FoodsUpdated.
// Let's just create a combined script that eval's both.

const scriptToRun = `
  ${arrayCode}
  ${batch5MoreContent.replace(/const fs = require\('fs'\);[\s\S]*/, '')} // Strip the bad injection code
  return [...batch5Foods, ...batch5Sweets, ...batch5Fruits, ...batch5Drinks];
`;

const combinedFoods = eval(`(function() { ${scriptToRun} })()`);

const indianFoodsPath = path.join(__dirname, '../src/data/foods/indianFoods.js');
let fileContent = fs.readFileSync(indianFoodsPath, 'utf8');

const insertIndex = fileContent.lastIndexOf('];');
if (insertIndex === -1) {
    console.error("Could not find array end '];' in indianFoods.js");
    process.exit(1);
}

let injectedString = "";
for (let i = 0; i < combinedFoods.length; i++) {
   injectedString += "  ,\n  " + JSON.stringify(combinedFoods[i], null, 4).replace(/"([^"]+)":/g, '$1:');
}
injectedString += "\n";

const newFileContent = fileContent.slice(0, insertIndex) + injectedString + fileContent.slice(insertIndex);
fs.writeFileSync(indianFoodsPath, newFileContent);
console.log("Successfully appended " + combinedFoods.length + " Batch 5 items to indianFoods.js");

// Try restoring original add_batch5.cjs just in case it was in the branch
try { require('child_process').execSync('git restore scripts/add_batch5.cjs'); } catch(e){}

// Generate seed file
require('child_process').execSync('node scripts/generate_seed.js', {stdio: 'inherit'});
