import re

db_path = "/Users/ample/Desktop/fittrack-pro/src/data/foods/indianFoods.js"
with open(db_path, "r", encoding="utf-8") as f:
    text = f.read()

# Add missing commas before each injected batch block
fixed_text = re.sub(r'\}\n(\s*// ===+)', r'},\n\1', text)

# Just in case there are missing commas between objects directly (if a script didn't trailing comma properly)
# e.g., }\n  { -> },\n  {
fixed_text = re.sub(r'\}\n(\s*)\{', r'},\n\1{', fixed_text)

with open(db_path, "w", encoding="utf-8") as file:
    file.write(fixed_text)
print("Syntax fixed gracefully")
