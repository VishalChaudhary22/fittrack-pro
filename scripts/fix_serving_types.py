import re
import json

indian_foods_path = "/Users/ample/Desktop/fittrack-pro/src/data/foods/indianFoods.js"
serving_types_path = "/Users/ample/Desktop/fittrack-pro/src/data/foods/servingTypes.js"

with open(indian_foods_path, "r", encoding="utf-8") as f:
    text = f.read()

# Since indianFoods.js is JS, we use regex to find all serving ids
ids = set(re.findall(r'id:\s*[\'"]([^\'"]+)[\'"]\s*,\s*.*?grams:', text, re.DOTALL))
ids2 = set(re.findall(r'\"id\":\s*\"([^\"]+)\"\s*,.*?\"grams\":', text, re.DOTALL))
all_ids = ids.union(ids2)

with open(serving_types_path, "r", encoding="utf-8") as f:
    st_text = f.read()

existing = set(re.findall(r'id:\s*[\'"]([^\'"]+)[\'"]', st_text))

missing = all_ids - existing

# remove any id that happens to match main food ids (we only want serving ids)
# typically serving ids are short
missing = set([m for m in missing if len(m) < 25 and not m.startswith('pb-') and not 'biscuit' in m and not 'rte' in m])

if missing:
    print(f"Missing {len(missing)} IDs. Injecting...")
    # Find the end of the array
    idx = st_text.rfind('];')
    if idx != -1:
        new_items = []
        for m in missing:
            new_items.append(f"  {{ id: '{m}', label: '{m} (auto)', defaultGrams: 50, usedFor: 'Auto-extracted' }}")
        
        insert_str = ",\n" + ",\n".join(new_items) + "\n"
        
        new_st = st_text[:idx].rstrip() + insert_str + "];\n"
        with open(serving_types_path, "w", encoding="utf-8") as f:
            f.write(new_st)
        print("Done injecting.")
else:
    print("No missing IDs found.")

