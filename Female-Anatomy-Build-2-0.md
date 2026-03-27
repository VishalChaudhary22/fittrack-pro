# FitTrack Pro — Female Anatomy Assets: Complete Implementation Plan

> **Created:** 2026-03-24 · **Last Updated:** 2026-03-27
> **Status:** 🔴 Broken — 15 files exist but ALL are defective (6 AI-generated with grey BG + text; 9 are byte-identical copies of the base = no highlights). 2 extra files not yet created.
> **Scope:** Asset creation only. All code routing is already implemented in `BodyMapSVG.jsx`.

---

## 🎯 Goal

Replace all broken and placeholder files in `public/muscles/female/` with 17 clean,
correctly-styled PNG illustrations that match the exact visual language of the male
reference set in `public/muscles/`.

Female users (`user.gender === 'female'`) currently see either an "Image unavailable"
fallback (placeholder files) or a distorted canvas with grey checkerboard backgrounds and
text labels baked in (defective generated files). Both states are broken.

The code routing is **fully implemented**. No code changes needed — this task is entirely
about producing and committing correct assets.

```js
// BodyMapSVG.jsx — already in production
const getAssetUrl = (file) => gender === 'female'
  ? `/muscles/female/female-${file}`
  : `/muscles/${file}`;
```

---

## 🔍 How the Canvas Rendering Works

Understanding this is critical before generating any asset. The pipeline in `BodyMapSVG.jsx`:

1. Load `female-front-base.png` or `female-back-base.png` (the full teal-blue body)
2. For each muscle with XP, load its highlight PNG (full body + one muscle in coral-red)
3. Scan highlight PNG pixels for red-dominant values: `R > 130 && R > G + 20 && R > B + 20`
4. Copy ONLY those red pixels onto the base canvas (primary muscle = full opacity)
5. Secondary muscles are composited at 40% alpha (dimmed coral — handled in code)

This pixel-filter approach means:
- The **base image** must have absolutely zero red-dominant pixels anywhere
- Each **highlight image** must have exactly ONE muscle area with red-dominant pixels
- The rest of the highlight image body must stay teal-blue (non-red-dominant)

---

## 🎨 Visual Style Guide — Derived from Male Reference Set

The attached male images (`back-base.jpeg`, `back-traps.jpeg`, `back-back.jpeg`, etc.)
define the exact visual language to match.

### Color & Background

| Property | Exact Value | Notes |
|----------|-------------|-------|
| **Background** | Pure solid black `#000000` | NOT transparent, NOT checkerboard, NOT grey |
| **Base body fill** | Teal-blue `#5BA0AE` – `#4A8F9E` | Slightly desaturated cyan-teal |
| **Muscle outline lines** | Thin white `#C8D8DC` | Separates individual muscle groups |
| **Primary highlight** | Coral-red `#E8540D` – `#FF6B35` | Full opacity, only target muscle |
| **Secondary highlight** | Coral-red @ 40% alpha | Applied in code, not in assets |

> ⚠️ **Critical:** Do NOT use orange, pink, or magenta for the body — those colors
> have high R channel values and will falsely trigger the highlight filter on base images.

> ⚠️ **Critical:** Do NOT use grey, white, or any light color for the background —
> those will be visible on the dark card. Use solid black `#000000` only.

> ⚠️ **Critical — `stripBackground()` workaround interaction:** The current
> `stripBackground()` in production strips ALL pixels where `R > 180 && G > 180 && B > 180`
> (near-white) AND all pixels where `R < 60 && G < 60 && B < 60` (near-black).
> This means **solid black backgrounds ARE being stripped too** (making them transparent).
> Clean assets with solid black `#000000` backgrounds will have their backgrounds
> removed by `stripBackground()` as well — this is actually fine since the card
> background `var(--c1)` is very dark anyway. But once clean assets are deployed,
> `stripBackground()` should be removed to avoid stripping intentional near-black
> body shadow detail pixels.

### Figure & Composition

| Property | Value |
|----------|-------|
| **Format** | PNG (lossless — JPEG compression breaks pixel detection) |
| **Dimensions** | 640 × 1280 px (1:2 portrait ratio) |
| **Figure height** | ~70% of image height, centered horizontally |
| **Pose** | Relaxed anatomical stance, arms ~15° abducted from body |
| **Head** | Featureless smooth silhouette — NO facial features |
| **Style** | Stylized medical illustration — NOT photorealistic, NOT cartoon |
| **Labels** | ❌ NONE — no text, no muscle names, no arrows, no callouts ever |

### Female vs. Male Proportions

| Region | Female Difference from Male |
|--------|-----------------------------|
| **Shoulders** | Narrower, more sloped, less angular deltoid caps |
| **Hips** | Wider than shoulders — clear gynoid (pear) silhouette |
| **Waist** | Defined hourglass curve, narrower waist-to-hip ratio |
| **Chest** | Rounded breast tissue visible over pectoralis major |
| **Glutes** | Rounder, more projected, fuller than male gluteus maximus |
| **Thighs** | Slightly fuller medial quad, wider hip crease angle |
| **Lats** | Present but less dramatic V-taper than male |
| **Traps** | Smaller upper trap mass, less neck thickness |
| **Arms** | Slightly slimmer overall, same relative muscle group positions |

---

## 📋 Complete File Inventory — 17 Files

All files go in `public/muscles/female/` with the `female-` prefix.

### Status Legend
> ✅ Clean & committed · ❌ Defective (regenerate) · ⏳ Placeholder (copy of base) · 🆕 Not yet created

### Base Images (2 files — HIGHEST PRIORITY)

| # | Filename | Description | Status | Issue |
|---|----------|-------------|--------|-------|
| 1 | `female-front-base.png` | Full female body, front view, ALL muscles teal-blue, zero red pixels | ❌ | Grey checkerboard BG + text labels baked in |
| 2 | `female-back-base.png` | Full female body, back view, ALL muscles teal-blue, zero red pixels | ❌ | Grey checkerboard BG + text labels baked in |

### Front View Highlights (8 files)

| # | Filename | Muscle ID (code) | Highlighted Anatomy | Status | Issue |
|---|----------|------------------|---------------------|--------|-------|
| 3 | `female-front-shoulders.png` | `shoulders` | Anterior + medial deltoid heads, both arms | ❌ | 49KB — generated but defective (grey BG + text labels) |
| 4 | `female-front-chest.png` | `chest` | Pectoralis major visible above/beside breast tissue, both sides | ❌ | 80KB — generated but defective (grey BG + text labels) |
| 5 | `female-front-abs.png` | `abs` | Rectus abdominis 6 segments + linea alba | ❌ | 55KB — generated but defective (grey BG + text labels) |
| 6 | `female-front-biceps.png` | `biceps` | Biceps brachii, both upper arms, anterior | ❌ | 61KB — generated but defective (grey BG + text labels) |
| 7 | `female-front-forearms.png` | `forearms` | Forearm flexors, both arms, anterior lower arm | ⏳ | 48,746 bytes — IDENTICAL to front-base (placeholder copy, no highlight) |
| 8 | `female-front-quads.png` | `quads` | Quadriceps group, both legs, full anterior thigh | ⏳ | 48,746 bytes — IDENTICAL to front-base (placeholder copy) |
| 9 | `female-front-calves.png` | `calves` | Gastrocnemius medial head (front-visible), both legs | ⏳ | 48,746 bytes — IDENTICAL to front-base (placeholder copy) |

### Back View Highlights (7 files)

| # | Filename | Muscle ID (code) | Highlighted Anatomy | Status | Issue |
|---|----------|------------------|---------------------|--------|-------|
| 10 | `female-back-shoulders.png` | `shoulders` (via `BACK_SHOULDER_IMG`) | Posterior deltoid cap only, both shoulders | ⏳ | 56,486 bytes — IDENTICAL to back-base (placeholder copy) |
| 11 | `female-back-traps.png` | `traps` | Trapezius diamond — neck base to T12, full width | ⏳ | 56,486 bytes — IDENTICAL to back-base (placeholder copy) |
| 12 | `female-back-back.png` | `back` | Latissimus dorsi sweep, armpits to lower back | ⏳ | 56,486 bytes — IDENTICAL to back-base (placeholder copy) |
| 13 | `female-back-triceps.png` | `triceps` | Triceps brachii, both upper arms, posterior | ⏳ | 56,486 bytes — IDENTICAL to back-base (placeholder copy) |
| 14 | `female-back-glutes.png` | `glutes` | Gluteus maximus, both sides — rounder female shape | ⏳ | 56,486 bytes — IDENTICAL to back-base (placeholder copy) |
| 15 | `female-back-hamstrings.png` | `hamstrings` | Biceps femoris + semitendinosus, both legs, posterior thigh | ⏳ | 56,486 bytes — IDENTICAL to back-base (placeholder copy) |

### Extra Assets (2 files — not in MUSCLE_IMAGES yet, low priority)

| # | Filename | Muscle | Status | Note |
|---|----------|--------|--------|------|
| 16 | `female-back-calves.png` | Gastrocnemius/soleus posterior | 🆕 | Male equivalent exists (`back-calves.png`) but not in `MUSCLE_IMAGES` code map |
| 17 | `female-back-forearms.png` | Forearm extensors posterior | 🆕 | Male equivalent exists (`back-forearms.png`) but not in `MUSCLE_IMAGES` code map |

---

## 📝 Generation Priority Order

Generate in this exact sequence — the base images unlock everything else:

| Priority | File | Reason |
|----------|------|--------|
| 1 | `female-back-base.png` | Renders on every Muscle Map visit, we have the perfect male reference (`back-base.jpeg`) |
| 2 | `female-front-base.png` | Same reason — most viewed image |
| 3 | `female-back-glutes.png` | Most commonly activated highlight for female users |
| 4 | `female-back-hamstrings.png` | Second most common back-view highlight |
| 5 | `female-back-traps.png` | Visually dominant on back view |
| 6 | `female-back-back.png` | Large lat sweep — visually prominent |
| 7 | `female-back-triceps.png` | Common push-day secondary |
| 8 | `female-back-shoulders.png` | Rear delt — common shoulder day activation |
| 9 | `female-front-quads.png` | Most common front-view highlight |
| 10 | `female-front-shoulders.png` | Common push/shoulder day |
| 11 | `female-front-chest.png` | Push day primary |
| 12 | `female-front-abs.png` | Core day |
| 13 | `female-front-biceps.png` | Pull day |
| 14 | `female-front-forearms.png` | Pull day secondary |
| 15 | `female-front-calves.png` | Leg day |
| 16 | `female-back-calves.png` | Extra — generate last |
| 17 | `female-back-forearms.png` | Extra — generate last |

---

## 🤖 AI Generation Prompts — All 17 Files

Use these prompts verbatim with Midjourney, DALL-E 3, Gemini Imagen, or Adobe Firefly.
Male reference images are attached as style guides.

### CRITICAL RULES FOR ALL PROMPTS
- Always specify: **solid black background**, no checkerboard, no grey
- Always specify: **NO text labels**, NO annotations, NO muscle names
- Always specify: **full body visible** head to toe (not just the highlighted area)
- Coral-red ONLY on the target muscle — everything else stays teal-blue
- PNG export only — never JPEG (compression corrupts pixel detection)

---

### FILE 1 — `female-back-base.png`
**Reference image to attach:** `back-base.png` (male back base — NOTE: the file is `.png` not `.jpeg`)

```
Full-body female anatomical muscular illustration, BACK VIEW (posterior).
Style: medical fitness app illustration, matching Getty anatomical art style —
same clean stylized anatomy layers as the reference image.

Female proportions: hips wider than shoulders, pronounced rounded gluteus maximus,
visible waist curve from behind, narrower upper back than male reference.

BACKGROUND: Pure solid black #000000. No checkerboard pattern. No transparency.
No grey. No gradients. Solid black fills all non-body pixels.

BODY COLOR: ALL muscles and body tissue rendered in teal-blue/cyan (#5BA0AE).
White thin lines (#C8D8DC) separate muscle groups:
trapezius diamond from neck to mid-back, latissimus dorsi sweep on both sides,
posterior deltoid caps on shoulders, triceps on posterior upper arms,
erector spinae column down center spine, gluteus maximus (two rounded forms —
rounder and fuller than male), hamstring group on posterior thighs,
gastrocnemius diamond on calves, forearm extensors on lower arms.

POSE: Full body from head to feet. Arms relaxed, ~15 degrees abducted from body.
Head: smooth featureless silhouette (back of head only, no face details).
Figure occupies approximately 70% of image height, centered horizontally.

NO red, orange, pink, or magenta anywhere on the body.
NO text, NO labels, NO annotations, NO muscle names, NO arrows.
PNG format. Portrait 640x1280px. Stylized, NOT photorealistic.
```

---

### FILE 2 — `female-front-base.png`
**Reference image to attach:** `front-forearms.png` (male front view — full body visible — NOTE: `.png` not `.jpeg`)

```
Full-body female anatomical muscular illustration, FRONT VIEW (anterior).
Style: medical fitness app illustration, matching Getty anatomical art style —
same clean stylized anatomy layers as the reference image.

Female proportions: hips wider than shoulders, visible breast tissue as rounded
forms over the chest, defined hourglass waist, narrower shoulders than male.

BACKGROUND: Pure solid black #000000. No checkerboard. No grey. No gradients.

BODY COLOR: ALL muscles in teal-blue/cyan (#5BA0AE).
White thin lines (#C8D8DC) separate muscle groups:
anterior deltoids on shoulder caps, pectoralis major (upper chest, visible
sternal head below/beside breast tissue), rectus abdominis (6-segment grid
with white tendinous intersections and linea alba center line), biceps brachii
on anterior upper arms, forearm flexors on lower arms, quadriceps on anterior
thighs (rectus femoris center, vastus lateralis outer, vastus medialis inner
teardrop near knee), gastrocnemius medial head on front-visible calves.

POSE: Full body head to feet. Arms relaxed, ~15 degrees abducted.
Head: smooth featureless silhouette (no face details).
Figure ~70% of image height, centered.

NO red, orange, pink, or magenta anywhere.
NO text, NO labels, NO annotations, NO muscle names.
PNG. Portrait 640x1280px. Stylized, NOT photorealistic.
```

---

### FILE 3 — `female-front-shoulders.png`
**Reference image to attach:** `female-front-base.png` (once generated)

```
Full-body female anatomical muscular illustration, FRONT VIEW.
IDENTICAL female body, pose, and proportions to female-front-base.png.

BACKGROUND: Solid black #000000.

ALL muscles teal-blue (#5BA0AE) EXCEPT:
Both LEFT and RIGHT deltoids highlighted in solid coral-red (#E8540D).
Highlighted region: the rounded shoulder cap — anterior deltoid head (front-facing
portion), medial/lateral deltoid head (outer cap). Both arms.
The posterior deltoid does NOT appear in front view — keep teal.
The trapezius adjacent to the shoulder remains teal-blue.
The biceps below the shoulder remain teal-blue.

ONLY the deltoid cap on both shoulders is coral-red. Everything else teal-blue.
NO text, NO labels. PNG. Portrait 640x1280px.
```

---

### FILE 4 — `female-front-chest.png`
**Reference image to attach:** `female-front-base.png`

```
Full-body female anatomical muscular illustration, FRONT VIEW.
IDENTICAL female body to female-front-base.png.

BACKGROUND: Solid black #000000.

ALL muscles teal-blue EXCEPT:
Pectoralis major highlighted in coral-red (#E8540D) on BOTH sides.
On a female figure the pec is partially behind breast tissue.
Show the VISIBLE pectoralis major in red:
- The clavicular head: upper chest plate between the collarbone and breast
- The sternal head: the inner chest visible beside the breast tissue
- The lower chest border: the curved lower pec border below the breast
- The lateral border: where the pec meets the anterior deltoid/arm
The breast silhouette itself is NOT highlighted — keep teal.
Only the muscle tissue of pectoralis major is coral-red.

Deltoids and abs remain teal-blue. ONLY pec major is red.
NO text, NO labels. PNG. Portrait 640x1280px.
```

---

### FILE 5 — `female-front-abs.png`
**Reference image to attach:** `female-front-base.png`

```
Full-body female anatomical muscular illustration, FRONT VIEW.
IDENTICAL female body to female-front-base.png.

BACKGROUND: Solid black #000000.

ALL muscles teal-blue EXCEPT:
Rectus abdominis highlighted in coral-red (#E8540D).
Show the 6 individual segments of the rectus abdominis as coral-red rectangles:
3 segments on the left side of center, 3 on the right.
White tendinous intersections (horizontal lines) separate the segments.
White linea alba (center vertical line) divides left from right.
External obliques on the sides of the abdomen remain teal-blue.
Serratus anterior on the ribcage sides remains teal-blue.

ONLY the 6 rectus abdominis blocks are coral-red. Everything else teal-blue.
NO text, NO labels. PNG. Portrait 640x1280px.
```

---

### FILE 6 — `female-front-biceps.png`
**Reference image to attach:** `female-front-base.png`

```
Full-body female anatomical muscular illustration, FRONT VIEW.
IDENTICAL female body to female-front-base.png.

BACKGROUND: Solid black #000000.

ALL muscles teal-blue EXCEPT:
Both LEFT and RIGHT biceps brachii highlighted in coral-red (#E8540D).
Highlighted region: the anterior upper arm bulge — from just below the anterior
deltoid to just above the elbow crease on BOTH arms.
Show the characteristic bicep oval/teardrop shape on each arm.
Forearms below the elbow remain teal-blue.
Anterior deltoids remain teal-blue.
Brachialis (outer lower portion of upper arm) remains teal-blue.

ONLY the biceps brachii muscle belly on both arms is coral-red.
NO text, NO labels. PNG. Portrait 640x1280px.
```

---

### FILE 7 — `female-front-forearms.png`
**Reference image to attach:** `front-forearms.png` (male reference for forearm position — NOTE: `.png` not `.jpeg`)

```
Full-body female anatomical muscular illustration, FRONT VIEW.
IDENTICAL female body proportions and pose to female-front-base.png.

BACKGROUND: Solid black #000000.

ALL muscles teal-blue EXCEPT:
Both LEFT and RIGHT forearm flexor groups highlighted in coral-red (#E8540D).
Highlighted region: the lower arm from the elbow crease down to the wrist
on BOTH arms — anterior/medial face.
Show the forearm flexor muscle bellies: flexor carpi radialis, palmaris longus,
flexor carpi ulnaris, flexor digitorum superficialis.
The upper arms (biceps) above the elbow remain teal-blue.
Hands/fingers remain teal-blue.

ONLY the forearm flexor region on both arms is coral-red.
NO text, NO labels. PNG. Portrait 640x1280px.
```

---

### FILE 8 — `female-front-quads.png`
**Reference image to attach:** `female-front-base.png`

```
Full-body female anatomical muscular illustration, FRONT VIEW.
IDENTICAL female body to female-front-base.png.

BACKGROUND: Solid black #000000.

ALL muscles teal-blue EXCEPT:
Both LEFT and RIGHT quadriceps highlighted in coral-red (#E8540D).
Highlighted region: the full anterior thigh on BOTH legs from the hip crease
down to just above the knee.
Show the four quad heads:
- Rectus femoris: central column down the thigh
- Vastus lateralis: outer thigh bulge
- Vastus medialis: inner teardrop shape just above the knee (VMO)
- Vastus intermedius: visible between the other heads
On a female figure the medial quad and inner thigh are slightly fuller.
Glutes/hip above remain teal-blue. Calves below remain teal-blue.

ONLY the quadriceps group on both legs is coral-red.
NO text, NO labels. PNG. Portrait 640x1280px.
```

---

### FILE 9 — `female-front-calves.png`
**Reference image to attach:** `female-front-base.png`

```
Full-body female anatomical muscular illustration, FRONT VIEW.
IDENTICAL female body to female-front-base.png.

BACKGROUND: Solid black #000000.

ALL muscles teal-blue EXCEPT:
Both LEFT and RIGHT calf muscles (gastrocnemius medial head, front-visible
portion) highlighted in coral-red (#E8540D).
Highlighted region: the lower leg from just below the knee to the ankle
on BOTH legs — the rounded calf muscle belly as seen from the front.
Show the medial head of the gastrocnemius — the teardrop shape on the inner
lower leg that is visible from the front view.
Quadriceps above the knee remain teal-blue. Feet remain teal-blue.

ONLY the front-visible calf muscle belly on both legs is coral-red.
NO text, NO labels. PNG. Portrait 640x1280px.
```

---

### FILE 10 — `female-back-shoulders.png`
**Reference image to attach:** `back-shoulders.png` (male reference — NOTE: `.png` not `.jpeg`)

```
Full-body female anatomical muscular illustration, BACK VIEW.
IDENTICAL female body, pose, and proportions to female-back-base.png.

BACKGROUND: Solid black #000000.

ALL muscles teal-blue EXCEPT:
Both LEFT and RIGHT posterior deltoids highlighted in coral-red (#E8540D).
Highlighted region: the rear deltoid cap only — a relatively small region
at the back of each shoulder, forming the posterior rounded cap.
Position: at the top back of each arm, between the trapezius and the triceps.
The trapezius adjacent to it remains teal-blue.
The triceps below remain teal-blue.
This highlight is smaller than the traps — just the posterior deltoid head.

ONLY the posterior deltoid cap on both shoulders is coral-red.
NO text, NO labels. PNG. Portrait 640x1280px.
```

---

### FILE 11 — `female-back-traps.png`
**Reference image to attach:** `back-traps.png` (male reference — exact same region — NOTE: `.png` not `.jpeg`)

```
Full-body female anatomical muscular illustration, BACK VIEW.
IDENTICAL female body to female-back-base.png.

BACKGROUND: Solid black #000000.

ALL muscles teal-blue EXCEPT:
Trapezius highlighted in coral-red (#E8540D).
The trapezius forms a large diamond / kite shape on the upper back:
- Upper traps: two triangular regions from the base of the skull / back of
  neck, spreading across both upper shoulders (like a yoke or collar)
- Middle traps: narrowing inward along the spine
- Lower traps: converging to a point around T10-T12 vertebra level
The shape should look like a diamond spanning the full width of the upper back.
On a female figure the upper traps are slightly less thick at the neck.
The latissimus dorsi BELOW the traps remains teal-blue.
The posterior deltoids on the shoulder caps remain teal-blue.

ONLY the full trapezius diamond is coral-red. Everything else teal-blue.
NO text, NO labels. PNG. Portrait 640x1280px.
```

---

### FILE 12 — `female-back-back.png`
**Reference image to attach:** `back-back.png` (male reference — exact same region — NOTE: `.png` not `.jpeg`)

```
Full-body female anatomical muscular illustration, BACK VIEW.
IDENTICAL female body to female-back-base.png.

BACKGROUND: Solid black #000000.

ALL muscles teal-blue EXCEPT:
Latissimus dorsi (lats) highlighted in coral-red (#E8540D) on BOTH sides.
The lats are the largest back muscles — they form a wide triangular sweep:
- Origin: from under the posterior axillary fold (armpit area), both sides
- Sweep: downward and inward toward the spine and hip crest
- Insertion: converging at the lower thoracic / lumbar region
On a female figure this creates a less dramatic V-taper than male —
the sweep is still present but hips are wider so the taper is subtler.
Show both left and right lat as two large coral-red triangular sweeps.
The trapezius above remains teal-blue.
The posterior deltoids remain teal-blue.
The glutes below remain teal-blue.

ONLY the latissimus dorsi on both sides is coral-red.
NO text, NO labels. PNG. Portrait 640x1280px.
```

---

### FILE 13 — `female-back-triceps.png`
**Reference image to attach:** `back-triceps.png` (male reference — NOTE: `.png` not `.jpeg`)

```
Full-body female anatomical muscular illustration, BACK VIEW.
IDENTICAL female body to female-back-base.png.

BACKGROUND: Solid black #000000.

ALL muscles teal-blue EXCEPT:
Both LEFT and RIGHT triceps brachii highlighted in coral-red (#E8540D).
Highlighted region: the full posterior upper arm on BOTH arms.
Show the three heads of the triceps:
- Long head: the largest, running down the center-inner posterior upper arm
- Lateral head: the outer upper arm, creating the visible horseshoe shape
- Medial head: deeper, visible at the lower inner posterior arm
The horseshoe / diamond shape of the triceps should be clearly defined in red.
Region: from just below the posterior deltoid cap down to just above the elbow.
Posterior deltoids above remain teal-blue. Forearms below remain teal-blue.

ONLY the triceps brachii on both arms is coral-red.
NO text, NO labels. PNG. Portrait 640x1280px.
```

---

### FILE 14 — `female-back-glutes.png`
**Reference image to attach:** `back-glutes.png` (male reference — note female should be rounder — NOTE: `.png` not `.jpeg`)

```
Full-body female anatomical muscular illustration, BACK VIEW.
IDENTICAL female body to female-back-base.png.

BACKGROUND: Solid black #000000.

ALL muscles teal-blue EXCEPT:
Both LEFT and RIGHT gluteus maximus highlighted in coral-red (#E8540D).
This is the most anatomically distinctive female highlight — the glutes
must look rounder, fuller, and more projected than the male reference.
Highlighted region on each side:
- From the iliac crest border at the top (hip bone ridge)
- Across the full posterior hip — the two large rounded buttock forms
- Down to the gluteal fold / crease where glute meets hamstring
- Include the upper gluteus medius border (slight fan shape at hip)
The two glute forms should appear as large, round, clearly-defined coral-red
shapes — the fullest and roundest highlight in the entire female set.
Hamstrings below the gluteal fold remain teal-blue.
Lower back erectors between the glutes remain teal-blue (show as a teal stripe).

ONLY the gluteus maximus on both sides is coral-red.
NO text, NO labels. PNG. Portrait 640x1280px.
```

---

### FILE 15 — `female-back-hamstrings.png`
**Reference image to attach:** `back-hamstrings.png` (male reference — NOTE: `.png` not `.jpeg`)

```
Full-body female anatomical muscular illustration, BACK VIEW.
IDENTICAL female body to female-back-base.png.

BACKGROUND: Solid black #000000.

ALL muscles teal-blue EXCEPT:
Both LEFT and RIGHT hamstring groups highlighted in coral-red (#E8540D).
Highlighted region: full posterior thigh from the gluteal fold (crease below
glute) down to the back of the knee, BOTH legs.
Show the three hamstring muscles as distinct bellies separated by white lines:
- Biceps femoris long + short head: outer posterior thigh, runs down the
  lateral side and curves toward the outer knee
- Semitendinosus: inner posterior thigh, long cord-like belly on medial side
- Semimembranosus: deeper inner thigh, visible as a broad flat band
On a female figure the semitendinosus / inner hamstring is proportionally
wider due to the wider hip angle.
Glutes above the gluteal fold remain teal-blue.
Gastrocnemius below the knee remains teal-blue.

ONLY the hamstring group on both legs is coral-red.
NO text, NO labels. PNG. Portrait 640x1280px.
```

---

### FILE 16 — `female-back-calves.png` *(Extra — generate after core 15)*
**Reference image to attach:** `back-calves.png` (male reference — NOTE: `.png` not `.jpeg`)

```
Full-body female anatomical muscular illustration, BACK VIEW.
IDENTICAL female body to female-back-base.png.

BACKGROUND: Solid black #000000.

ALL muscles teal-blue EXCEPT:
Both LEFT and RIGHT calf muscles highlighted in coral-red (#E8540D).
Highlighted region: posterior lower leg on BOTH legs, from below the knee
to the ankle.
Show the gastrocnemius (medial and lateral heads — the diamond/heart shape
of the calf) and the soleus (wider, lower, visible below the gastrocnemius
bellies on both sides).
Hamstrings above the knee remain teal-blue. Feet remain teal-blue.

ONLY the gastrocnemius and soleus on both legs is coral-red.
NO text, NO labels. PNG. Portrait 640x1280px.
```

---

### FILE 17 — `female-back-forearms.png` *(Extra — generate after core 15)*
**Reference image to attach:** `back-forearms.png` (male reference — NOTE: `.png` not `.jpeg`)

```
Full-body female anatomical muscular illustration, BACK VIEW.
IDENTICAL female body to female-back-base.png.

BACKGROUND: Solid black #000000.

ALL muscles teal-blue EXCEPT:
Both LEFT and RIGHT forearm extensor groups highlighted in coral-red (#E8540D).
Highlighted region: the posterior lower arm on BOTH arms, from the elbow
down to the wrist â€” the extensor side (back of the forearm).
Show the forearm extensor muscle bellies: extensor carpi radialis longus/brevis,
extensor digitorum, extensor carpi ulnaris.
Triceps above the elbow remain teal-blue. Hands remain teal-blue.

ONLY the forearm extensor group on both arms is coral-red.
NO text, NO labels. PNG. Portrait 640x1280px.
```

---

## ðŸ—‚ï¸ Code Mapping (`BodyMapSVG.jsx`)

Already implemented — no changes needed **for the core 15 files**. Shown here for reference.

> ⚠️ **GAP: Extra assets (files 16–17) require a code change.** The male set has
> `back-calves.png` and `back-forearms.png` in `public/muscles/`, but
> **neither is listed in `MUSCLE_IMAGES`** in `BodyMapSVG.jsx`. This means even the
> male versions are never rendered. If you want files 16–17 to actually display,
> you must add `calves` back-view and `forearms` back-view entries to the code map.
> This is a **low priority** code change — only needed after those extra assets exist.

```js
// FEMALE_MUSCLE_IMAGES mirrors MUSCLE_IMAGES exactly — filenames without the female- prefix
// because getAssetUrl prepends /muscles/female/female- automatically

const FEMALE_MUSCLE_IMAGES = {
  // Front view
  shoulders:  { view: 'front', file: 'front-shoulders.png' },
  chest:      { view: 'front', file: 'front-chest.png' },
  abs:        { view: 'front', file: 'front-abs.png' },
  biceps:     { view: 'front', file: 'front-biceps.png' },
  forearms:   { view: 'front', file: 'front-forearms.png' },
  quads:      { view: 'front', file: 'front-quads.png' },
  calves:     { view: 'front', file: 'front-calves.png' },
  // Back view
  traps:      { view: 'back',  file: 'back-traps.png' },
  back:       { view: 'back',  file: 'back-back.png' },
  triceps:    { view: 'back',  file: 'back-triceps.png' },
  glutes:     { view: 'back',  file: 'back-glutes.png' },
  hamstrings: { view: 'back',  file: 'back-hamstrings.png' },
};

// Shoulders appear on both views â€” special case
const FEMALE_BACK_SHOULDER_IMG = 'back-shoulders.png';

// URL resolver â€” prepends correct folder and prefix
const getAssetUrl = (file) => gender === 'female'
  ? `/muscles/female/female-${file}`
  : `/muscles/${file}`;
```

The `gender` prop reaches `BodyMapSVG` from three pages:
- `MuscleMapPage.jsx` â†’ `<BodyMapSVG gender={user?.gender} />`
- `DashboardPage.jsx` â†’ `<MiniBodyMap gender={user?.gender} />`
- `WorkoutPage.jsx` â†’ post-workout summary `<BodyMapSVG gender={user?.gender} />`

---

## ðŸ› Known Bug: `stripBackground()` Workaround

A temporary fix was applied to `BodyMapSVG.jsx` to strip grey/white checkerboard
pixels from the base image after `ctx.drawImage()`:

```js
// BodyMapSVG.jsx â€” TEMPORARY workaround for defective female assets
function stripBackground(ctx, canvas) {
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    // Strip near-white, near-grey, desaturated light pixels
    const isBackground = r > 200 && g > 200 && b > 200
                      && Math.abs(r - g) < 20
                      && Math.abs(g - b) < 20;
    if (isBackground) data[i + 3] = 0; // make transparent
  }
  ctx.putImageData(imageData, 0, 0);
}
// Called: after ctx.drawImage(baseImg, 0, 0) on the main canvas
// Called: on offscreen canvas overlay layers too
```

**Status:** âœ… Implemented
**When to remove:** Once all 17 clean assets (solid black background) are committed,
delete `stripBackground()` and its call sites. Clean black-background PNGs don't need it â€”
the black pixels blend naturally into the dark card background `var(--c1)` (~#0C0C0E).

---

## ðŸ”§ Generating from Male Reference Images (Recommended Workflow)

The 10 attached male images (`back-base.jpeg`, `back-traps.jpeg`, etc.) are the
canonical style reference. Use this workflow for best consistency:

1. **Attach the matching male reference** to every AI generation prompt
   (e.g., attach `back-glutes.jpeg` when generating `female-back-glutes.png`)
2. Add to every prompt: *"Match the exact illustration style, line weight, and
   teal-blue color of the attached reference image. Change only the body
   proportions to female and adjust the highlighted muscle accordingly."*
3. **Back view images:** Use `back-base.jpeg` as style anchor
4. **Front view images:** Use `front-forearms.jpeg` as style anchor (shows full front body)
5. After generating, verify in an image editor â€” **background must be solid black**,
   not grey/checkered

---

## 🔬 Pixel Verification Script

Run this after generating each image to programmatically verify quality gates.
Save as `scripts/verify-anatomy-png.py` (do NOT commit — dev tool only).

```python
#!/usr/bin/env python3
"""Verify a female anatomy PNG meets the rendering pipeline requirements."""
import sys
from PIL import Image

def verify(path, is_base=False):
    img = Image.open(path).convert('RGBA')
    w, h = img.size
    px = img.load()
    red_count = 0
    bad_bg = 0
    total = w * h

    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if r > 130 and r > g + 20 and r > b + 20 and a > 0:
                red_count += 1
            if a > 0 and r > 180 and g > 180 and b > 180 and abs(r-g) < 30 and abs(g-b) < 30:
                bad_bg += 1

    print(f"File: {path}")
    print(f"Dimensions: {w}x{h} (expected 640x1280)")
    print(f"Red-dominant pixels: {red_count} ({red_count/total*100:.2f}%)")
    print(f"Grey/white BG pixels: {bad_bg} ({bad_bg/total*100:.2f}%)")

    ok = True
    if w != 640 or h != 1280:
        print("FAIL: WRONG DIMENSIONS")
        ok = False
    if bad_bg > 100:
        print("FAIL: BACKGROUND NOT CLEAN BLACK")
        ok = False
    if is_base and red_count > 50:
        print("FAIL: BASE IMAGE HAS RED PIXELS")
        ok = False
    if not is_base and red_count < 500:
        print("FAIL: HIGHLIGHT HAS TOO FEW RED PIXELS")
        ok = False
    if ok:
        print("PASSED")
    return ok

if __name__ == '__main__':
    is_base = '--base' in sys.argv
    path = [a for a in sys.argv[1:] if not a.startswith('--')][0]
    verify(path, is_base)
```

**Usage:**
```bash
# Base images (should have ZERO red pixels)
python3 scripts/verify-anatomy-png.py public/muscles/female/female-front-base.png --base

# Highlight images (should have red ONLY on target muscle)
python3 scripts/verify-anatomy-png.py public/muscles/female/female-back-glutes.png
```

---

## ✅ Implementation Checklist

### Per-Image Quality Gates
Check every image before adding to the repo:

- [ ] Background is **pure solid black** `#000000` â€” no checkerboard, grey, white, or gradients
- [ ] **No text** anywhere â€” no muscle names, no labels, no annotations, no arrows
- [ ] Full body visible â€” head to feet â€” correct view (front or back)
- [ ] Female proportions â€” wider hips, narrower shoulders, breast tissue on front view
- [ ] Figure occupies ~70% of image height, centered
- [ ] Format is **PNG** (not JPEG)
- [ ] Dimensions: ~640 Ã— 1280px (1:2 portrait ratio)
- [ ] **For base images only:** Zero red-dominant pixels (`R < 130 OR R < G+20 OR R < B+20` everywhere)
- [ ] **For highlight images only:** Target muscle clearly red-dominant (`R > 130 AND R > G+20 AND R > B+20`)
- [ ] **For highlight images only:** Only the target muscle is red â€” all others stay teal-blue
- [ ] File size < 500KB

### Asset Generation Tracker

| # | Filename | Generated | Quality Checked | Committed |
|---|----------|:---------:|:---------------:|:---------:|
| 1 | `female-front-base.png` | âŒ | âŒ | âŒ |
| 2 | `female-back-base.png` | âŒ | âŒ | âŒ |
| 3 | `female-front-shoulders.png` | âŒ | âŒ | âŒ |
| 4 | `female-front-chest.png` | âŒ | âŒ | âŒ |
| 5 | `female-front-abs.png` | âŒ | âŒ | âŒ |
| 6 | `female-front-biceps.png` | âŒ | âŒ | âŒ |
| 7 | `female-front-forearms.png` | âŒ | âŒ | âŒ |
| 8 | `female-front-quads.png` | âŒ | âŒ | âŒ |
| 9 | `female-front-calves.png` | âŒ | âŒ | âŒ |
| 10 | `female-back-shoulders.png` | âŒ | âŒ | âŒ |
| 11 | `female-back-traps.png` | âŒ | âŒ | âŒ |
| 12 | `female-back-back.png` | âŒ | âŒ | âŒ |
| 13 | `female-back-triceps.png` | âŒ | âŒ | âŒ |
| 14 | `female-back-glutes.png` | âŒ | âŒ | âŒ |
| 15 | `female-back-hamstrings.png` | âŒ | âŒ | âŒ |
| 16 | `female-back-calves.png` *(extra)* | âŒ | âŒ | âŒ |
| 17 | `female-back-forearms.png` *(extra)* | âŒ | âŒ | âŒ |

> Mark âœ… as each file clears each gate. Do not commit until all three columns are âœ….

### Deployment Steps

- [ ] All 15 core files (files 1â€“15) pass quality gates
- [ ] `cp` or drag all 15+ PNGs into `public/muscles/female/`
- [ ] Verify filenames exactly match the `female-` prefix convention
- [ ] `git add public/muscles/female/`
- [ ] `git commit -m "feat: female anatomy assets â€” all 17 PNGs, clean black BG"`
- [ ] `git push origin main` â†’ Vercel auto-deploys in ~30 seconds
- [ ] After deploy: run full verification protocol below
- [ ] Once verified: remove `stripBackground()` from `BodyMapSVG.jsx` and commit

---

## ðŸ” Verification Protocol (After Deployment)

### Test 1 â€” Base Render
1. Open app (`npm run dev` or production URL)
2. Log in or create a test user with `gender: 'female'`
3. Navigate to `/muscle-map`
4. âœ… Both FRONT canvas and BACK canvas show the female teal-blue body illustration
5. âœ… Neither canvas shows "Image unavailable" placeholder
6. âœ… No grey checkerboard visible anywhere
7. âœ… No text labels visible on the illustration

### Test 2 â€” Single Highlight
1. Log a workout with only one exercise: Hip Thrust (glutes)
2. Return to `/muscle-map`
3. âœ… BACK canvas shows glutes highlighted in coral-red
4. âœ… All other back muscles remain teal-blue
5. âœ… FRONT canvas shows no highlights (no front muscles trained)

### Test 3 â€” Multiple Highlights
1. Log a workout: Bench Press (chest), Lat Pulldown (back), Back Squat (quads + glutes secondary)
2. Return to `/muscle-map`
3. âœ… FRONT canvas: chest in full coral-red, quads in full coral-red
4. âœ… BACK canvas: lats (back) in full coral-red, glutes in dimmed coral (40% â€” secondary)
5. âœ… No other muscles highlighted

### Test 4 â€” Fallback Safety
1. Temporarily rename `female-front-base.png` â†’ `female-front-base.bak`
2. Reload `/muscle-map`
3. âœ… Shows "Image unavailable" placeholder â€” NOT blank/invisible canvas
4. Restore the file

### Test 5 â€” Male Regression
1. Switch user `gender` to `male` (or use a male test account)
2. Navigate to `/muscle-map`
3. âœ… Male illustrations render correctly â€” zero regressions

### Test 6 â€” MiniBodyMap on Dashboard
1. While logged in as female user, navigate to `/`
2. âœ… Mini body map widget on Dashboard shows the female illustration
3. âœ… Trained muscles from this week are highlighted correctly

---

## ðŸ”— Related Files

| File | Role |
|------|------|
| `src/components/shared/BodyMapSVG.jsx` | Canvas renderer, `FEMALE_MUSCLE_IMAGES`, `getAssetUrl`, `stripBackground()` |
| `src/components/pages/MuscleMapPage.jsx` | Passes `gender={user?.gender}` to `BodyMapSVG` |
| `src/components/pages/DashboardPage.jsx` | Passes `gender={user?.gender}` to `MiniBodyMap` |
| `src/components/pages/WorkoutPage.jsx` | Passes `gender={user?.gender}` to post-workout body map |
| `public/muscles/` | Male assets directory â€” style reference |
| `public/muscles/female/` | Female assets directory â€” target |
| `TODO-male-anatomy.md` | Male canvas rendering reference and asset documentation |
| `TODO-phase2-features.md` | Item 2.1 (original feature spec), Item 2.5 (body map bug fixes) |