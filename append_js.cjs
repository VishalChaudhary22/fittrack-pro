const fs = require('fs');
let code = fs.readFileSync('src/data/foods/indianFoods.js', 'utf8');
const supps = fs.readFileSync('supplements.js.txt', 'utf8');

// The file should end with something like:
//   }
// ];
// export default indianFoods;

// Find the last '];'
const lastIndex = code.lastIndexOf('];');
if (lastIndex !== -1) {
  const before = code.substring(0, lastIndex);
  const after = code.substring(lastIndex);
  // Ensure we add a comma if the previous element doesn't have one
  let newCode = before;
  if (!newCode.trim().endsWith(',')) {
    newCode += ',\n';
  }
  newCode += supps + '\n' + after;
  fs.writeFileSync('src/data/foods/indianFoods.js', newCode);
  console.log('Appended to indianFoods.js');
} else {
  console.log('Could not find array end in indianFoods.js');
}
