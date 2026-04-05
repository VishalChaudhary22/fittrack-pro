import { searchLocalFoods, calcMacros, calcBeverageMacros } from '../src/utils/foodUtils.js';
import { indianFoods } from '../src/data/foods/indianFoods.js';

console.log("=== Running UAT Suite ===");

let passed = 0;
let failed = 0;

const assert = (condition, name) => {
  if (condition) {
    console.log(`✅ PASS: ${name}`);
    passed++;
  } else {
    console.error(`❌ FAIL: ${name}`);
    failed++;
  }
};

// UAT 1: Search "chicken"
let chickenRes = searchLocalFoods(indianFoods, "chicken", {});
assert(chickenRes.some(f => f.id === 'chicken-breast-raw'), "Search 'chicken' returns chicken breast");
assert(chickenRes.some(f => f.name.toLowerCase().includes('curry')), "Search 'chicken' returns chicken curry");

// UAT 2: Search "makhana"
let makhanaRes = searchLocalFoods(indianFoods, "makhana", {});
assert(makhanaRes.some(f => f.id === 'makhana-roasted'), "Search 'makhana' returns roasted makhana");

// UAT 3: Search "sattu"
let sattuRes = searchLocalFoods(indianFoods, "sattu", {});
assert(sattuRes.some(f => f.id === 'sattu-sharbat'), "Search 'sattu' returns sattu sharbat");

// UAT 5: Navratri Fasting
let navratriRes = searchLocalFoods(indianFoods, "khichdi", { fastingType: "navratri" });
assert(navratriRes.filter(f => f.isFastingFood === false).length === 0, "Fasting filter correctly excludes non-fasting khichdi");

// UAT 6: Calc Macros 200g
let chickenMatch = indianFoods.find(f => f.id === 'chicken-breast-raw');
if (chickenMatch) {
  let m200 = calcMacros(chickenMatch, "g100", 2); // 2 x 100g = 200g
  assert(m200.calories === Math.round(chickenMatch.per100g.calories * 2), "200g macro calc doubles calories");
  assert(m200.protein === Number((chickenMatch.per100g.protein * 2).toFixed(1)), "200g macro calc doubles protein");
}

// UAT 9: Transliteration "gobhi"
let gobhiRes = searchLocalFoods(indianFoods, "gobhi", {});
assert(gobhiRes.some(f => f.name.toLowerCase().includes('gobi')), "Search 'gobhi' correctly transliterates and returns 'gobi' items");

// UAT 11: Beverage Builder
let chaiMatch = indianFoods.find(f => f.id === 'chai-base');
if (chaiMatch) {
  let chaiMacros = calcBeverageMacros(chaiMatch, 'toned', ['sugar']);
  assert(chaiMacros.calories > 40 && chaiMacros.calories < 60, "Chai with toned milk and 1 tsp sugar evaluates correctly ~46 cals");
}

// UAT 12: Jain Filter
let jainGobiRes = searchLocalFoods(indianFoods, "aloo gobi", { dietType: "jain" });
assert(jainGobiRes.length === 0, "Jain filter strictly excludes aloo gobi due to root veg");
let jainRotiRes = searchLocalFoods(indianFoods, "roti", { dietType: "jain" });
assert(jainRotiRes.length > 0, "Jain filter passes plain roti");

console.log(`\nResults: ${passed} Passed, ${failed} Failed`);
if (failed > 0) process.exit(1);
