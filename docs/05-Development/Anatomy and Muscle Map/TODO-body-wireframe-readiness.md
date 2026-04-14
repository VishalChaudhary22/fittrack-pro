# Body Wireframe Readiness Card — Reference Analysis & Implementation Plan

## 📸 Reference Image Analysis

The attached reference image (`image.png`) shows a **Daily Readiness** card with the following visual elements:

### Visual Elements Present in Reference
1. **3D Wireframe Body Figure** — A translucent polygon-mesh/wireframe human body, NOT a flat anatomical silhouette. The wireframe has:
   - Polygon grid lines (triangulated mesh) visible across the entire body
   - Subtle teal-grey coloring on the wireframe lines
   - A glowing, slightly ethereal quality
   - Semi-transparent — the dark background shows through the mesh
2. **Pure Black Background** (`#0a0a0c` or similar) — The card background is near-black
3. **Atmospheric Background Effects** — Scattered particles/network nodes and connecting lines behind and around the figure (subtle neural-network / constellation aesthetic)
4. **Reflective Floor** — A faint mirror/reflection of the lower body visible below the figure's feet
5. **Score Badge (top-left)** — `84%` in large warm/amber text + `OVERALL READINESS` label below, inside a dark glass pill
6. **Legend (top-right)** — Three stacked pills: `● RECOVERED` (green), `● FATIGUED` (yellow/amber), `● CRITICAL` (red), each with a glowing dot
7. **Muscle Chips (bottom)** — Dark glass cards with colored left-border accents:
   - `QUADS → Optimal` (green left border)
   - `LOWER BACK → 92h Rest` (green left border)
   - `DELTOIDS → Prime` (green left border — partially visible at very bottom)
8. **Bottom gradient fade** — Gradient from transparent to black hides the lower body and creates depth

---

## 🔍 Gap Analysis: Reference Image vs Current TODO Spec vs Actual Implementation

### GAP 1 — Body Figure Type (CRITICAL)
| Aspect | Reference Image | Current TODO Spec | Actual Code |
|---|---|---|---|
| Body type | **3D Wireframe Mesh** (polygon grid) | Describes "teal-grey wireframe mesh" but assumes a pre-baked PNG from Stitch | Uses `/muscles/front-base.png` (flat anatomical illustration with `grayscale(100%) brightness(0.6)`) |
| **Gap** | The TODO correctly identifies a wireframe but treats it as a Stitch-generated asset (`body-wireframe.png`) that must be saved from a URL. The actual code doesn't use any wireframe at all — it uses the existing anatomical illustration with CSS filters. **The reference shows a polygon-mesh wireframe, not a flat illustration.** |

### GAP 2 — Body Wireframe Asset Missing
| Aspect | Reference Image | Current TODO Spec | Actual Code |
|---|---|---|---|
| Asset | Pre-baked `body-wireframe.png` | Mentions saving from Stitch URL | No `body-wireframe.png` exists in `public/` |
| **Gap** | The TODO tells us to save `body-wireframe.png` from a temporary URL or Claude output, but no such file exists. The checklist item `- [ ] Save body-wireframe.png to public/` is incomplete. The actual code falls back to the flat anatomical base image. |

### GAP 3 — Atmospheric Background (Particle/Node Network)
| Aspect | Reference Image | Current TODO Spec | Actual Code |
|---|---|---|---|
| Background FX | Subtle constellation/neural-network particle effect behind the figure | **Not mentioned at all** | **Not implemented** |
| **Gap** | The reference clearly shows scattered dots and connecting lines creating an atmospheric backdrop. Neither the TODO nor the code addresses this. |

### GAP 4 — Reflective Floor Effect  
| Aspect | Reference Image | Current TODO Spec | Actual Code |
|---|---|---|---|
| Reflection | Mirror/reflection of lower body below feet | **Not mentioned** | **Not implemented** |
| **Gap** | The reference shows a faint reflection below the figure's feet. This adds depth and realism. Neither the TODO nor the code addresses this. |

### GAP 5 — Image Positioning & Cropping
| Aspect | Reference Image | Current TODO Spec | Actual Code |
|---|---|---|---|
| Position | Figure centered, showing head-to-upper-thighs, with gradient fading legs | `objectPosition: 'center top'` to show "head + torso, not legs" | `top: 50%, left: 50%, transform: translate(-50%,-50%)`, `width: 55%` — centered with mask |
| **Gap** | The TODO's `objectFit: 'cover'` + `objectPosition: 'center top'` approach is correct for a full-bleed image. The actual code uses `position: absolute` centered approach with a mask gradient. Both are valid approaches, but the actual code's `width: 55%` may be too small to match the imposing full-width presence in the reference. |

### GAP 6 — Gradient Fade Coverage
| Aspect | Reference Image | Current TODO Spec | Actual Code |
|---|---|---|---|
| Gradient | Bottom ~40% fades from transparent to pure black | `height: 52%` starting at `55%` transparent | Uses CSS `mask-image` on the img itself (`black 55%, transparent 95%`) |
| **Gap** | The TODO uses a separate overlay `<div>` for the gradient. The actual code uses `mask-image` on the `<img>`. The reference shows the gradient starting around the hip area. The actual code's mask may not extend low enough to properly hide the lower body and create the same depth effect. A separate gradient overlay would give more control. |

### GAP 7 — TODO Document Is Incomplete / Malformed
| Aspect | Issue |
|---|---|
| Missing header/context | The TODO file starts mid-JSX with `{/* ── Body Map Card ── */}` — no title, no intro, no context about what this file is for |
| No gap analysis | The original document assumes "just save the PNG and paste the JSX" without analyzing gaps against the actual implementation |
| Stale URLs | The TODO references Route A with a code.html approach and URLs that may have expired |
| No implementation status | No tracking of what's been done vs. what remains |

### GAP 8 — Card Border Radius
| Aspect | Reference Image | Current TODO Spec | Actual Code |
|---|---|---|---|
| Border radius | Appears to have standard rounded corners (~16px) | `borderRadius: '0 0 16px 16px'` (bottom only) | `borderRadius: 24` |
| **Gap** | Minor — the TODO uses bottom-only radius (assuming it's part of a larger card), while the actual code uses a full 24px radius (standalone card). The reference image shows full rounded corners, so the actual code is closer. |

### GAP 9 — `mix-blend-mode: screen` Technique
| Aspect | Reference Image | Current TODO Spec | Actual Code |
|---|---|---|---|
| Blend mode | N/A (visual result) | Correctly describes `mixBlendMode: 'screen'` trick | Uses `mixBlendMode: 'screen'` ✅ |
| **Status** | ✅ Both the TODO and actual code correctly implement the screen blend mode. The TODO's explanation of why this works is accurate. |

### GAP 10 — Chip Layout
| Aspect | Reference Image | Current TODO Spec | Actual Code |
|---|---|---|---|
| Layout | Chips are in a 2-column grid at bottom (QUADS + LOWER BACK side by side, DELTOIDS below) | `flexWrap: 'wrap'` with `gap: 8` | `flexWrap: 'wrap'` with `gap: 12` |
| **Gap** | Minor — the reference shows chips more tightly packed in a grid-like layout. Both TODO and code use flex-wrap which achieves a similar result. |

---

## ✅ What's Already Correct in the Actual Implementation

- [x] Dark card background (`#0E0E10`)
- [x] `mixBlendMode: 'screen'` on the body image
- [x] Score badge (top-left) with dynamic `readinessTier.color`
- [x] Legend pills (top-right) — Recovered, Fatigued, Critical
- [x] Muscle chips at bottom with colored left-border
- [x] Glass-morphism on overlays (`backdropFilter: blur`)
- [x] Check-in CTA button
- [x] Card has rounded corners (borderRadius: 24)

---

## 📋 Implementation Checklist

### Priority 1: Asset (CRITICAL — blocks everything)
- [x] **Generate or source a wireframe mesh body PNG** 
      → Option A: Use AI image generation to create a transparent wireframe human body
      → Option B: Use CSS/Canvas to render a polygon-mesh wireframe effect over the existing base image
      → Option C: Use CSS filters (`contrast`, `invert`, custom SVG filters) on the existing anatomical illustration to approximate a wireframe look
      → Save as `public/body-wireframe.png` (664×966px or similar, pure black background, bright wireframe lines)

### Priority 2: Background Atmosphere
- [x] Add subtle particle/node network effect behind the body figure
      → CSS-only approach: Use radial-gradient dots + decorative pseudo-elements
      → OR: Lightweight Canvas particle system (constellation-style, ~30 nodes)
      → Keep it subtle — the reference shows it as a background texture, not a dominant element

### Priority 3: Reflective Floor  
- [x] Add a mirrored/reflected copy of the body image below the figure
      → Use CSS `transform: scaleY(-1)` on a cloned `<img>` with heavy opacity reduction (~0.1)
      → Apply gradient mask so reflection fades quickly
      → Position below the main figure

### Priority 4: Image Sizing & Position
- [x] Increase body figure width from `55%` to `~70-75%` to match the imposing presence in the reference
- [x] Adjust vertical centering so figure is slightly higher (more torso visible, legs fade into gradient)
- [x] Add proper bottom gradient overlay `<div>` in addition to the CSS mask for better control

### Priority 5: Polish
- [x] Ensure gradient fade properly hides baked-in elements (if using wireframe PNG with baked UI)
- [x] Fine-tune chip positioning for tighter 2-column layout at bottom
### Priority 6: 3D Y-Axis Rotation
- [x] Explicitly configure a true 3D perspective rotation so the figure turns 30 degrees to the right:
      → Use `transform: perspective(1000px) translate(-50%, -50%) rotateY(30deg)` on the main body
      → Use `transform: perspective(1000px) translate(-50%, -50%) scaleY(-1) rotateY(30deg)` on the reflective floor
      → This ensures the image actually achieves a 3D depth-rotation rather than just squashing horizontally (which happens when `rotateY` is used without `perspective`).
### Priority 7: Correct 3/4 View — Regenerate Asset (NOT CSS transform)

**Root Cause:** CSS `rotateY()` on a flat 2D PNG does NOT create a true 3D rotation. It merely squashes/compresses the image horizontally like a horizontal skew. The reference shows a **3D mesh model rendered from a 3/4 right-back angle** — this is baked into the image itself.

**What the reference image shows:**
- The body is NOT facing straight forward
- The figure is rotated ~30-45° so you see the RIGHT side of the body (chest-right, left shoulder blade partially visible)
- The left arm hangs further back in perspective, the right arm is closer to the viewer
- This is a genuine 3D perspective render, not a CSS 2D transform

**Correct Solution:**
- [x] **Remove** all `rotateY` and `perspective` CSS transforms from the wireframe `<img>` elements in `DashboardPage.jsx` — revert to simple `translate(-50%, -50%)`
- [x] **Regenerate** `public/muscles/body-wireframe.png` using AI image generation with the correct camera angle prompt:
      → Prompt: *"3D polygon-mesh wireframe of an athletic male human figure, 3/4 view from front-right, rotated about 30-40 degrees so right side of chest faces the viewer, pure black background, bright glowing teal-grey wireframe lines, futuristic medical scan style, transparent-looking mesh"*
- [x] **Regenerate** `public/muscles/female/female-body-wireframe.png` with matching prompt but female anatomy
- [x] The correct `transform` for the main image after new asset: `translate(-50%, -50%)` (no rotation needed — angle is baked in)
- [x] The correct `transform` for the reflection: `translate(-50%, -50%) scaleY(-1)` (no rotation needed)

**Why this approach is correct:**
The `mix-blend-mode: screen` trick relies on the asset having a pure black background so dark areas become transparent. As long as we generate the new asset on a pure black background, the screen blend will still work perfectly after the swap.



## 🔑 The `mixBlendMode: 'screen'` Key

This is the same trick Stitch uses (`mix-blend-screen` class in their HTML). On a black card background (`#0a0a0c`), screen blending makes the dark pixels in the wireframe image **completely transparent** and the bright wireframe lines **glow**. The result:

- Black background of the PNG → invisible (becomes the card's dark background)
- Grey wireframe mesh → shows as a glowing white-grey silhouette
- Baked-in Stitch chip backgrounds (dark rounded rects) → nearly invisible on black

This means **even a PNG with baked-in dark UI elements works** — the dark chip backgrounds disappear via `mix-blend-screen`, and only the body figure's bright wireframe lines remain visible. Our React overlays then sit on top in the exact positions.

---

## 📐 Overlay Coverage Map

| Reference element | React overlay | Strategy | Status |
|---|---|---|---|
| "84% / OVERALL READINESS" badge (top-left) | Score badge at `top:16, left:16` | Positioned overlay | ✅ Done |
| "RECOVERED/FATIGUED/CRITICAL" (top-right) | Legend at `top:16, right:16` | Positioned overlay | ✅ Done |
| Muscle chips (bottom) | Muscle chips with `marginTop: auto` | Flex-end positioning | ✅ Done |
| Wireframe body figure | `<img>` with `mixBlendMode: 'screen'` | Blend mode | ⚠️ Wrong asset (uses anatomical illustration, not wireframe) |
| Atmospheric particles | — | Not implemented | ❌ Missing |
| Reflective floor | — | Not implemented | ❌ Missing |

---

## 🏗️ Recommended Implementation Order

```
1. Generate wireframe body asset (or CSS-approximate it)
2. Swap <img> src to use the wireframe asset
3. Adjust sizing (width 70-75%, vertical position)
4. Add gradient overlay <div> for bottom fade
5. Add particle/node background effect
6. Add reflective floor clone
7. Final polish & QA against reference
```