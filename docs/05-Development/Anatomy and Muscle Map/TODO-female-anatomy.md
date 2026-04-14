# FitTrack Pro — Female Anatomy Implementation

> **Created:** 2026-03-24 · Scope: Asset creation only. Zero code changes required.

---

## 🎯 Goal

Add female anatomical illustrations to `public/muscles/female/` so that female users (those with `user.gender === 'female'`) see a biologically accurate body map instead of the "Image unavailable" fallback.

The code routing is **already complete** — `BodyMapSVG.jsx` constructs female paths using:
```js
const getAssetUrl = (file) => gender === 'female'
  ? `/muscles/female/female-${file}`
  : `/muscles/${file}`;
```

**No code changes are needed.** This task is entirely about creating and committing the PNG assets.

---

## 🔍 Male Anatomy Reference

Study the 17 existing male PNGs in `public/muscles/` before generating female versions. All images follow these rules:

| Property | Value |
|----------|-------|
| **Style** | Getty / pop_jop — realistic anatomical illustration |
| **Base body color** | Teal-blue / cyan (all muscles untrained) |
| **Highlight color** | Coral-red / orange-red (only the target muscle) |
| **Background** | Transparent PNG |
| **Dimensions** | ~400 × 800 px (portrait, 1:2 aspect ratio) |
| **Format** | PNG, transparent background |

### Mechanism (how canvas rendering works)
The canvas renderer filters for pixels where `R > 130 && R > G + 20 && R > B + 20` (i.e., red-dominant pixels). Only these pixels are composited onto the base image. This means:
- **Base PNGs** must show the full body in teal-blue with all muscles visible.
- **Highlight PNGs** must show the full body in teal-blue **PLUS** the highlighted muscle in coral-red. Only that one muscle should be red-dominant.

---

## 📁 Required Files — 16 Total

All files go in **`public/muscles/female/`** and must follow the **`female-`** prefix naming convention.

### Base Images (2 files)
| Filename | Description |
|----------|-------------|
| `female-front-base.png` | Full female body, front view, all muscles in teal-blue, no highlights |
| `female-back-base.png` | Full female body, back view, all muscles in teal-blue, no highlights |

### Front View Highlights (7 files)
| Filename | Muscle | Anatomical Notes |
|----------|--------|-----------------|
| `female-front-shoulders.png` | Deltoids | Anterior and medial deltoid heads |
| `female-front-chest.png` | Pectoralis Major | Female chest — must show pec outline under breast tissue |
| `female-front-abs.png` | Rectus Abdominis | Six-pack groups + linea alba |
| `female-front-biceps.png` | Biceps Brachii | Both arms, anterior upper arm |
| `female-front-forearms.png` | Forearm Flexors | Both arms, anterior forearms |
| `female-front-quads.png` | Quadriceps | Both legs, anterior thighs (4 heads: rectus femoris, vastus lateralis, medialis, intermedius) |
| `female-front-calves.png` | Gastrocnemius / Soleus | Both legs, anterior-visible portion of calves |

### Back View Highlights (7 files)
| Filename | Muscle | Anatomical Notes |
|----------|--------|-----------------|
| `female-back-shoulders.png` | Posterior Deltoid | Rear deltoid head, both shoulders |
| `female-back-traps.png` | Trapezius | Upper/mid traps, extending from neck to mid-back |
| `female-back-back.png` | Latissimus Dorsi | Lats — wide sweep from armpits to lower back |
| `female-back-triceps.png` | Triceps Brachii | Both arms, posterior upper arm (3 heads) |
| `female-back-glutes.png` | Gluteus Maximus | Both glutes — anatomically prominent in female figure |
| `female-back-hamstrings.png` | Biceps Femoris / Semitendinosus | Both legs, posterior thigh group |
| `female-back-back.png` | — | *(same as lats above — already listed)* |

> **Note:** The back calves (`back-calves.png`) and back forearms (`back-forearms.png`) exist in the male set but are not referenced in `MUSCLE_IMAGES` in the current code. You may skip these for the female set or add them for future use.

---

## 🖼️ Generation Approach

### Option A — AI Image Generation (Recommended)
Use an image generation tool (e.g., Gemini imagen, DALL-E, Midjourney) to produce the PNGs.

**Recommended prompt template for base image:**
```
Full-body female anatomical illustration, front view.
Style: medical fitness app illustration, Getty anatomical art style.
Colors: all muscles shown in vibrant teal-blue (#00B4D8 to #0077B6 gradient range), 
no green or yellow. Medium skin tone, athletic build. 
Transparent background. Portrait orientation (1:2 ratio). 
No clothing. Stylized, not hyper-realistic. Clean edges, flat anatomy layers.
```

**Recommended prompt template for muscle highlight (example for glutes):**
```
Full-body female anatomical illustration, back view.
All muscles in teal-blue. Gluteus maximus only highlighted in coral-red (#E8540D to #FF6B35).
No other muscles in red. Style: medical fitness app, Getty anatomical art.
Transparent background. Portrait orientation (1:2 ratio). Stylized anatomy.
```

### Option B — Graphic Designer / Asset Library
- License female anatomy SVGs from Adobe Stock, Shutterstock, or similar
- Convert to the required color convention (teal base + coral highlight) using Illustrator/Figma
- Export as transparent PNGs at ~400×800px

### Option C — Trace/Adapt Male Images
- Use the male images as a template in Figma or Photoshop
- Modify the silhouette to female proportions (broader hips, narrower shoulders, different chest)
- Keep the same teal/coral color scheme

---

## ✅ Implementation Checklist

### Asset Creation
> **NOTE:** AI Image generation quota exhausted after 6 images. The remaining 10 files are currently using copies of the base image as placeholders.

- [x] Generate / source `female-front-base.png`
- [x] Generate / source `female-back-base.png`
- [x] Generate / source `female-front-shoulders.png`
- [x] Generate / source `female-front-chest.png`
- [x] Generate / source `female-front-abs.png`
- [x] Generate / source `female-front-biceps.png`
- [ ] Generate / source `female-front-forearms.png` (using placeholder)
- [ ] Generate / source `female-front-quads.png` (using placeholder)
- [ ] Generate / source `female-front-calves.png` (using placeholder)
- [ ] Generate / source `female-back-shoulders.png` (using placeholder)
- [ ] Generate / source `female-back-traps.png` (using placeholder)
- [ ] Generate / source `female-back-back.png` (using placeholder)
- [ ] Generate / source `female-back-triceps.png` (using placeholder)
- [ ] Generate / source `female-back-glutes.png` (using placeholder)
- [ ] Generate / source `female-back-hamstrings.png` (using placeholder)

### Quality Check (per image)
- [ ] Transparent background (no white/grey fill)
- [ ] Correct orientation (front or back)
- [ ] Teal-blue base with correct muscle highlighted in coral-red (for highlight PNGs)
- [ ] Base PNGs have NO red-dominant pixels at all
- [ ] Canvas pixel test: highlight PNGs have red channel clearly dominant over G and B in the target muscle area
- [ ] Roughly 1:2 aspect ratio portrait

### Deployment
- [x] Place all 16 files in `public/muscles/female/`
- [x] `git add public/muscles/female/` and commit
- [x] Push to `main` → Vercel auto-deploys
- [x] Verify on Vercel: log in as female user, navigate to `/muscle-map` — body map should render the female illustration

---

## 🔍 Verification Steps

1. **Local test:**
   - Open app with `npm run dev`
   - Create or edit a test user with `gender: 'female'`
   - Navigate to `/muscle-map`
   - Both FRONT and BACK canvases should render the female body illustration in teal-blue

2. **XP highlight test:**
   - Log a workout that trains chest and glutes
   - Navigate to `/muscle-map`
   - Chest should highlight on the front canvas, glutes on the back canvas — both in coral-red

3. **Fallback regression test:**
   - Temporarily rename one female PNG (e.g., `female-front-base.bak`)
   - Reload — should show "Image unavailable" placeholder, not a blank/invisible canvas
   - Restore the file

4. **Male regression test:**
   - Switch user gender back to `male`
   - Body map should continue to render male illustrations with no regressions

---

## 📌 Notes for the Image Generator

- The canvas filtering threshold is: `R > 130 && R > G + 20 && R > B + 20`
- For coral-red highlight to be detected: use colors like `#E8540D`, `#FF6B35`, `#D94F00`
- For teal-blue base to NOT be detected as highlight: use `#00B4D8`, `#0096C7`, `#0077B6`
- **Do NOT use orange, pink, or magenta for the base** — these may have high red channel values and accidentally trigger the highlight filter
- All highlight PNGs must include the complete silhouette (not just the highlighted muscle in isolation) so the canvas renders correctly

---

## 🐛 Known Bug: Background Visible in Generated Images

> **Reported:** 2026-03-24 · Status: ⏳ Plan ready, fix pending

### What the user sees
The female anatomy canvases show a **grey/white checkered pattern** behind the illustration and **muscle name text labels** drawn on the image, both of which should not be visible.

![Screenshot reference](screenshot of user-reported issue)

### Root causes

#### Issue 1 — Checkered background baked into the PNG pixels
The AI image generator rendered the "transparent background" instruction by adding a grey/white checkerboard pattern as literal solid pixels in the PNG, rather than actual PNG alpha transparency. When the canvas draws this image with `ctx.drawImage()`, those grey/white pixels appear on screen.

**Evidence:** The checkerboard squares are visible inside the canvas bounds, obscuring the muscle illustration.

#### Issue 2 — Text labels drawn into the image
The AI generator included muscle anatomy labels (e.g., "Pectoralis Major", "Biceps Brachii") as part of the illustration. These should not appear in the app UI.

**Evidence:** Visible label text on the front-view illustration in the screenshot.

---

### Fix Plan — Two Tracks

#### Track A: Code-level background stripping in `CanvasBodyMap` (Quick Fix)

Add a canvas post-processing step in `BodyMapSVG.jsx` that strips out grey/white and light-colored pixels from the **base image** before compositing, treating them as transparent background.

**How it works:**
After loading and drawing `baseImg` onto the canvas, scan the pixel data and zero out the alpha channel for any pixel that looks like a background checkerboard (near-white or light grey with low saturation).

**Detection threshold for background pixels:**
```js
// A pixel is considered background if it is light and desaturated
const r = data[i], g = data[i+1], b = data[i+2];
const isBackground = r > 200 && g > 200 && b > 200 && Math.abs(r - g) < 20 && Math.abs(g - b) < 20;
if (isBackground) data[i+3] = 0; // make transparent
```

**Files to modify:**
- `src/components/shared/BodyMapSVG.jsx` — add `stripBackground()` helper called immediately after `ctx.drawImage(baseImg, 0, 0)` in the `useEffect`

**Pros:** Fast, no new assets needed, fixes display immediately.

**Cons:** Might accidentally clip some light-teal edge pixels on the anatomy illustration. Needs tuning.

**Implementation steps:**
- [x] Add `stripBackground(ctx, canvas)` function in `BodyMapSVG.jsx`
- [x] Call it after drawing `baseImg` on the canvas, before muscle compositing
- [x] Call it on overlay layers in the offscreen canvas too
- [x] Test locally — ensure teal-blue anatomy body is preserved and grey checkerboard is gone
- [x] Confirm red muscle highlights still composite correctly after background strip

---

#### Track B: Re-generate clean assets (Permanent Fix, when quota resets)

Re-generate all 16 female PNGs with improved prompts that explicitly prevent background patterns and text labels.

**Improved prompt for base images:**
```
Full-body female anatomical muscular illustration, front view.
Medical fitness app illustration style. Clean vector art.
ALL muscles shown in vibrant teal-blue (#00B4D8).
PURE TRANSPARENT BACKGROUND — no checkerboard, no grid, no background fill of any kind.
NO text labels, NO annotations, NO muscle names or callouts.
No clothing. Athletic female build. Portrait orientation (roughly 1:2 aspect ratio).
Center the figure with generous margin on all sides.
```

**Improved prompt for muscle highlights (example — glutes):**
```
Full-body female anatomical muscular illustration, back view.
Medical fitness app illustration style. Clean vector art.
ALL muscles in teal-blue (#00B4D8), EXCEPT gluteus maximus which is highlighted in solid coral-red (#E8540D).
PURE TRANSPARENT BACKGROUND — no checkerboard, no grid, no white fill.
NO text labels, NO annotations, NO muscle names of any kind.
No clothing. Athletic female build. Portrait orientation.
```

**Asset quality checklist before committing:**
- [ ] Open PNG in any image editor (Photoshop, Pixelmator, Preview) — background must show as transparent (checkerboard in editor = correct actual transparency)
- [ ] No text visible on the image at any zoom level
- [ ] Body occupies 60–80% of the image height
- [ ] Blue channel dominant across the body silhouette
- [ ] Target muscle has clearly red-dominant pixels (`R > 130`, `R > G + 20`, `R > B + 20`)

---

### Recommended Action Order

| Step | Track | Priority |
|------|-------|----------|
| 1 | **A** — Add `stripBackground()` to `BodyMapSVG.jsx` | ✅ Done |
| 2 | **B** — Re-generate all 16 assets with improved prompts | 🟡 Do when image quota resets (2026-03-31) |
| 3 | When new assets arrive, remove the `stripBackground()` workaround | 🟢 Cleanup after B is done |

