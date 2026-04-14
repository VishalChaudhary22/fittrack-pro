# FitTrack Pro — Male Anatomy Reference

> **Created:** 2026-03-24 · Status: ✅ Assets committed · Scope: Documentation & verification only.

---

## 🎯 Goal

Document the existing male anatomical illustration system in `public/muscles/` so future contributors understand the asset conventions, canvas rendering mechanism, and naming rules. The male assets are **fully committed and deployed**.

---

## 🖼️ How the Canvas Rendering Works

The body map uses HTML5 Canvas to composite muscle highlights over a teal-blue base image. The rendering pipeline in `BodyMapSVG.jsx`:

1. Load `base.png` — full body in teal-blue, no highlights
2. Load highlight PNGs for active muscles — full body with ONE muscle in coral-red
3. For each highlight PNG, scan pixels for red-dominant values: `R > 130 && R > G + 20 && R > B + 20`
4. Copy only those red pixels onto the base image
5. Secondary muscles use 40% alpha blend (dimmed coral) instead of full opacity

This approach avoids CSS blend-mode color distortion and gives precise pixel-level control.

### Color Conventions

| Purpose | Color Range | Hex Example |
|---------|-------------|-------------|
| Base body (all muscles untrained) | Teal-blue | `#00B4D8`, `#0096C7`, `#0077B6` |
| Primary muscle highlight | Coral-red, full opacity | `#E8540D`, `#FF6B35` |
| Secondary muscle highlight | Coral-red, 40% alpha blend | `#E8540D` @ 0.4 opacity |

> ⚠️ Do NOT use orange, pink or magenta as the base body color — those shades have high red channel values and will falsely trigger the highlight filter.

---

## 📁 Existing Male Assets — 17 Files

All files are in **`public/muscles/`** and are tracked in git.

### Base Images (2 files)

| Filename | Description | Status |
|----------|-------------|--------|
| `front-base.png` | Full male body, front view, all muscles teal-blue, no highlights | ✅ Committed |
| `back-base.png` | Full male body, back view, all muscles teal-blue, no highlights | ✅ Committed |

### Front View Highlights (8 files)

| Filename | Muscle (`MUSCLE_IMAGES` key) | In Code Map | Status |
|----------|------------------------------|:-----------:|--------|
| `front-shoulders.png` | `shoulders` | ✅ | ✅ Committed |
| `front-chest.png` | `chest` | ✅ | ✅ Committed |
| `front-abs.png` | `abs` | ✅ | ✅ Committed |
| `front-biceps.png` | `biceps` | ✅ | ✅ Committed |
| `front-forearms.png` | `forearms` | ✅ | ✅ Committed |
| `front-quads.png` | `quads` | ✅ | ✅ Committed |
| `front-calves.png` | `calves` | ✅ | ✅ Committed |
| *(none for front-calves back view)* | — | — | — |

### Back View Highlights (7 files)

| Filename | Muscle (`MUSCLE_IMAGES` key) | In Code Map | Status |
|----------|------------------------------|:-----------:|--------|
| `back-shoulders.png` | `shoulders` (rear deltoid via `BACK_SHOULDER_IMG`) | ✅ | ✅ Committed |
| `back-traps.png` | `traps` | ✅ | ✅ Committed |
| `back-back.png` | `back` (lats) | ✅ | ✅ Committed |
| `back-triceps.png` | `triceps` | ✅ | ✅ Committed |
| `back-glutes.png` | `glutes` | ✅ | ✅ Committed |
| `back-hamstrings.png` | `hamstrings` | ✅ | ✅ Committed |
| `back-calves.png` | *(not in MUSCLE_IMAGES — extra asset)* | ❌ | ✅ Committed |
| `back-forearms.png` | *(not in MUSCLE_IMAGES — extra asset)* | ❌ | ✅ Committed |

> **Note:** `back-calves.png` and `back-forearms.png` exist on disk but are not referenced in `MUSCLE_IMAGES` in `BodyMapSVG.jsx`. They can be added to the code map in a future update if back-view calves/forearm highlighting is desired.

---

## 🗂️ Code Mapping (`BodyMapSVG.jsx`)

The `MUSCLE_IMAGES` constant maps canonical muscle IDs to their view and filename:

```js
const MUSCLE_IMAGES = {
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

// Special case — shoulders appear on both front and back views
const BACK_SHOULDER_IMG = 'back-shoulders.png';
```

The URL is resolved via `getAssetUrl`:
```js
// Male (default)
const getAssetUrl = (file) => `/muscles/${file}`;
// Female
const getAssetUrl = (file) => `/muscles/female/female-${file}`;
```

---

## ✅ Verification Checklist

Use this whenever the male assets are updated or replaced.

- [ ] `front-base.png` — no red-dominant pixels anywhere
- [ ] `back-base.png` — no red-dominant pixels anywhere
- [ ] Each highlight PNG — only the target muscle has `R > G+20 && R > B+20` pixels
- [ ] All 17 PNGs are tracked in git (`git ls-files public/muscles/`)
- [ ] Body map renders on `/muscle-map` in local dev with no console errors
- [ ] Back and front canvases both show the correct highlights after logging a workout
- [ ] Male rendering is unaffected after any female asset changes

---

## 🔗 Related Files

| File | Role |
|------|------|
| `src/components/shared/BodyMapSVG.jsx` | Canvas renderer + `MUSCLE_IMAGES` map |
| `src/components/pages/MuscleMapPage.jsx` | Passes `gender={user?.gender}` to `BodyMapSVG` |
| `src/components/pages/DashboardPage.jsx` | Passes `gender={user?.gender}` to `MiniBodyMap` |
| `src/components/pages/WorkoutPage.jsx` | Passes `gender={user?.gender}` to post-workout `BodyMapSVG` |
| `TODO-female-anatomy.md` | Sister document for female asset plan |
