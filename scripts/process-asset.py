#!/usr/bin/env python3
import sys
from PIL import Image

def process(input_path, output_path):
    img = Image.open(input_path).convert("RGB")
    
    # Find bounding box of non-black pixels
    gray = img.convert("L")
    bbox = gray.point(lambda p: p > 20 and 255).getbbox()
    
    if not bbox:
        print("No figure found")
        return
        
    figure = img.crop(bbox)
    
    # Target size
    TARGET_W, TARGET_H = 640, 1280
    FIGURE_TARGET_H = int(TARGET_H * 0.70)
    
    # Calculate scale to make figure height = FIGURE_TARGET_H
    scale = FIGURE_TARGET_H / float(figure.height)
    new_w = int(figure.width * scale)
    new_h = FIGURE_TARGET_H
    
    # If width exceeds TARGET_W, scale by width instead
    if new_w > TARGET_W * 0.9:
        scale = (TARGET_W * 0.9) / float(figure.width)
        new_w = int(figure.width * scale)
        new_h = int(figure.height * scale)
        
    figure = figure.resize((new_w, new_h), Image.Resampling.LANCZOS)
    
    # Create new blank image
    out = Image.new("RGB", (TARGET_W, TARGET_H), (0, 0, 0))
    
    # Paste centered
    paste_x = (TARGET_W - new_w) // 2
    paste_y = (TARGET_H - new_h) // 2
    out.paste(figure, (paste_x, paste_y))
    
    # Sweep for stray light background pixels and force to black
    out_data = out.load()
    for y in range(TARGET_H):
        for x in range(TARGET_W):
            r, g, b = out_data[x, y]
            if r > 200 and g > 200 and b > 200 and abs(r-g) < 20 and abs(g-b) < 20:
                out_data[x, y] = (0, 0, 0)
    
    # Save
    out.save(output_path, format="PNG", optimize=True)
    print(f"Saved to {output_path}")

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: process-asset.py <input> <output>")
        sys.exit(1)
    process(sys.argv[1], sys.argv[2])
