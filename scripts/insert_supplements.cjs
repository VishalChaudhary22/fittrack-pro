const fs = require('fs');
const path = require('path');

const generateSupplementsFromTSV = () => {
    // Columns: id | name | nameAlt | brand | productLine | subcategory | scoopWeightG | calories | protein | carbs | fat | bcaaG | eaaG | certifications | priceINR | originCountry
    const tsvData = `
on-gold-standard-whey	Optimum Nutrition Gold Standard 100% Whey	on gold	Optimum Nutrition	Gold Standard 100% Whey	whey-concentrate	30	120	24	3	1	5.5		Informed Choice	4499	USA
on-gold-standard-whey-isolate	Optimum Nutrition Gold Standard 100% Whey Isolate	on gold isolate	Optimum Nutrition	Gold Standard 100% Whey Isolate	whey-isolate	31	110	25	1	0.5	5.5		Informed Choice	5999	USA
myprotein-impact-whey-concentrate	MyProtein Impact Whey Protein	myprotein whey	MyProtein	Impact Whey	whey-concentrate	25	103	20	3	1.9	4.5		Labdoor	1999	UK
myprotein-impact-whey-isolate	MyProtein Impact Whey Isolate	myprotein isolate	MyProtein	Impact Whey Isolate	whey-isolate	25	93	22	1	0.5	4.9		Labdoor	2799	UK
dymatize-iso100	Dymatize ISO 100	iso 100	Dymatize	ISO 100	whey-hydrolysate	31	110	25	1	0.5	5.5		Informed Choice	6999	USA
bigmuscles-premium-gold-whey	Bigmuscles Nutrition Premium Gold Whey	bigmuscles whey	Bigmuscles Nutrition	Premium Gold Whey	whey-concentrate	36	145	25	7	2	5.8	11	Informed Choice UK	2999	India
gnc-pro-performance-whey	GNC Pro Performance Whey Protein	gnc whey	GNC	Pro Performance	whey-concentrate	34	130	24	5	1.5	5		GNC	3499	USA
tata-1mg-whey	Tata 1mg Ultra Clean Whey Protein	tata whey	Tata 1mg	Ultra Clean Whey	whey-concentrate	36	135	25	4	1.5	5.6		Trustified Gold	2999	India
mb-biozyme-iso-zero	MuscleBlaze Biozyme Iso-Zero	mb iso zero	MuscleBlaze	Biozyme Iso-Zero	whey-isolate	34	125	27	1.5	1	5.96	12.69	Trustified Gold	3799	India
nutrabay-pure-whey-concentrate	Nutrabay Pure 100% Whey Protein Concentrate	nutrabay wpc	Nutrabay	Pure 100% Whey	whey-concentrate	30	123	23.4	2.3	2.2	5.2		Nutrabay	1299	India
nutrabay-pure-whey-isolate	Nutrabay Pure Whey Protein Isolate	nutrabay wpi	Nutrabay	Pure Whey Protein Isolate	whey-isolate	30	112	26.5	1	0.5	5.8		Nutrabay	1899	India
amul-whey-protein	Amul Whey Protein	amul whey	Amul	Whey Protein	whey-concentrate	32	118	25	2	1.5	5		FSSAI	1599	India
naturaltein-whey-concentrate	Naturaltein Whey Protein Concentrate	naturaltein whey	Naturaltein	Whey Protein Concentrate	whey-concentrate	30	110	21.6	2.5	1.6	5.2		TUV	2299	India
muscletech-nitrotech-whey	MuscleTech NitroTech Whey Protein	nitrotech	MuscleTech	NitroTech	whey-isolate	46	160	30	4	2.5	6.8		Informed Choice	5500	USA
protyze-clear-whey	Protyze Anytime Clear Whey Protein	protyze clear	Protyze	Anytime Clear Whey	clear-whey	30	103	24	1.5	0	7.2		FSSAI	2699	India
kevin-levrone-gold-whey	Kevin Levrone Gold Whey	levrone gold whey	Kevin Levrone	Gold Whey	whey-concentrate	30	119	22	3	2	4.8		EU	3499	Poland
mb-mass-gainer-xxl	MuscleBlaze Mass Gainer XXL	mb mass gainer	MuscleBlaze	Mass Gainer XXL	mass-gainer	150	561	22.5	112	3	4.2		Trustified Gold	1899	India
mb-super-gainer-xxl	MuscleBlaze Super Gainer XXL	mb super gainer	MuscleBlaze	Super Gainer XXL	mass-gainer	75	280	15	53	2				1699	India
mb-lean-mass-gainer	MuscleBlaze High Protein Lean Mass Gainer	mb lean mass	MuscleBlaze	Lean Mass Gainer	lean-mass-gainer	75	295	30	47	2	6.5			2799	India
asitis-atom-mass-gainer	AS-IT-IS ATOM Mass Gainer	asitis mass gainer	AS-IT-IS	ATOM Mass Gainer	mass-gainer	100	384	25	63	4				2199	India
on-serious-mass	Optimum Nutrition Serious Mass	on serious mass	Optimum Nutrition	Serious Mass	mass-gainer	334	1260	50	253	4.5				Informed Choice	4499	USA
on-serious-mass-half	Optimum Nutrition Serious Mass (Half Serving)	on serious mass half	Optimum Nutrition	Serious Mass	mass-gainer	167	630	25	126.5	2.25				Informed Choice	4499	USA
labrada-muscle-mass-gainer	Labrada Muscle Mass Gainer	labrada mass gainer	Labrada	Muscle Mass Gainer	mass-gainer	336	1244	52	251	8				USA	6999	USA
muscletech-mass-tech-extreme	MuscleTech Mass Tech Extreme 2000	masstech extreme	MuscleTech	Mass Tech Extreme 2000	mass-gainer	334	2000	80	400	10				USA	9999	USA
gnc-pro-performance-weight-gainer	GNC Pro Performance Weight Gainer	gnc mass gainer	GNC	Pro Performance	mass-gainer	315	1600	53	380	15				GNC	8999	USA
bsn-true-mass-1200	BSN True Mass 1200	bsn true mass	BSN	True Mass 1200	mass-gainer	254	1210	50	215	17				USA	7999	USA`;

    const supplements = [];
    const lines = tsvData.trim().split('\n');

    for (const line of lines) {
        if (!line.trim()) continue;
        const cols = line.split('\t');
        const id = cols[0];
        const name = cols[1];
        const nameAlt = [cols[2]];
        const brand = cols[3];
        const productLine = cols[4];
        const subcategory = cols[5];
        const scoopWeightG = parseFloat(cols[6]);
        const cal = parseFloat(cols[7]);
        const prot = parseFloat(cols[8]);
        const carb = parseFloat(cols[9]);
        const fat = parseFloat(cols[10]);
        const bcaa = cols[11] ? parseFloat(cols[11]) : null;
        const eaa = cols[12] ? parseFloat(cols[12]) : null;
        const certs = cols[13] ? [cols[13]] : [];
        const price = cols[14] ? parseInt(cols[14]) : null;
        const country = cols[15] || 'USA';
        
        let tags = ['muscle-building'];
        if (subcategory === 'mass-gainer') tags.push('bulking', 'high-calorie');
        if (id.includes('extreme') || id.includes('gnc-pro-performance-weight')) tags.push('extreme-calories', 'advanced-only');

        supplements.push({
            id: id,
            name: name,
            nameAlt: nameAlt,
            searchTerms: [brand.toLowerCase(), cols[2].toLowerCase(), "whey", "protein", brand],
            category: "supplement",
            subcategory: subcategory,
            itemType: "supplement",
            state: "raw",
            region: "pan-indian",
            brand: brand,
            productLine: productLine,
            scoopWeightG: scoopWeightG,
            proteinType: subcategory.includes('isolate') ? 'isolate' : (subcategory.includes('hydrolysate') ? 'hydrolysate' : 'concentrate'),
            bcaaG: bcaa,
            eaaG: eaa,
            certifications: certs,
            priceINR: price,
            originCountry: country,
            defaultServingGrams: scoopWeightG,
            per100g: { 
                calories: Math.round((cal / scoopWeightG) * 100), 
                protein: Number(((prot / scoopWeightG) * 100).toFixed(1)), 
                carbs: Number(((carb / scoopWeightG) * 100).toFixed(1)), 
                fat: Number(((fat / scoopWeightG) * 100).toFixed(1)), 
                fiber: 0, 
                sodium: 150, 
                vitaminB12: 0, 
                vitaminD: 0, 
                iron: 0, 
                calcium: 200 
            },
            servings: [
                { id: "scoop", label: "1 scoop (" + scoopWeightG + "g)", grams: scoopWeightG },
                { id: "g100", label: "100g", grams: 100 },
                { id: "custom", label: "Custom (g)", grams: 1 }
            ],
            dietTypes: ["veg", "nonveg"],
            tags: tags,
            isProcessed: true,
            isFastingFood: false,
            fastingTypes: [],
            isGlutenFree: true,
            isRecipe: false,
            containsRootVeg: false,
            hasBeverageModifiers: false,
            supportedConsistencyTypes: [],
            consistencyMultipliers: {},
            gi: 15,
            cookingOilNote: null,
            estimatedOilG: 0,
            source: "FSSAI-label",
            confidence: "high"
        });
    }

    return supplements;
};

const newSupplements = generateSupplementsFromTSV();

const indianFoodsPath = path.join(__dirname, '../src/data/foods/indianFoods.js');
let fileContent = fs.readFileSync(indianFoodsPath, 'utf8');

// Also inject the fields for all existing "itemType: 'supplement'" generic objects
// Such as: id: 'whey-protein', 'mass-gainer' etc
// Find them by replacing `itemType: 'supplement',` (if not already done)
// We'll use a regex replacement to add the brand backfill logic to generic entries.
// To make it safe, we'll only replace if brand isn't already there.
// Instead of risky regex for the whole object, let's just make the backfill simple:
if (!fileContent.includes("brand: ")) {
    fileContent = fileContent.replace(/itemType: 'supplement',(\s*)state:/g, "itemType: 'supplement',$1brand: null, productLine: null, scoopWeightG: null, proteinType: null, bcaaG: null, certifications: [], priceINR: null, originCountry: null,$1state:");
    fileContent = fileContent.replace(/itemType: "supplement",(\s*)state:/g, 'itemType: "supplement",$1brand: null, productLine: null, scoopWeightG: null, proteinType: null, bcaaG: null, certifications: [], priceINR: null, originCountry: null,$1state:');
}

const insertIndex = fileContent.lastIndexOf('];');
if (insertIndex === -1) {
    console.error("Could not find array end '];' in indianFoods.js");
    process.exit(1);
}

let injectedString = "";
for (let i = 0; i < newSupplements.length; i++) {
   injectedString += "  ,\n  " + JSON.stringify(newSupplements[i], null, 4).replace(/"([^"]+)":/g, '$1:');
}
injectedString += "\n";

const newFileContent = fileContent.slice(0, insertIndex) + injectedString + fileContent.slice(insertIndex);
fs.writeFileSync(indianFoodsPath, newFileContent);
console.log("Successfully appended " + newSupplements.length + " TSV items to indianFoods.js");
// Re-generate seed
try {
  require('child_process').execSync('node scripts/generate_seed.js', {stdio: 'inherit'});
} catch (error) {
  console.error("Error generating seed", error.message);
}
