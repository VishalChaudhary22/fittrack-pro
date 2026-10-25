# Design Engineering & Motion Audit: FitTrack Pro (Kaaya Fit)

> **Audited Repository**: `fittrack-pro` (Kaaya Fit)  
> **Framework & Principles**: [Emil Kowalski’s Design Engineering](https://github.com/emilkowalski/skills) (`emil-design-eng`, `mobile-native`, `animate`, `animation-performance`, `apple-design`, `ask-sonner`)  
> **Core Focus**: UI Polish, Interaction Physics, Micro-animations, Mobile-Native Feel, and the Invisible Compounding Details  
> **Date**: October 2026  

---

## 1. Executive Taste & Craft Assessment

> *"All those unseen details combine to produce something that’s just stunning, like a thousand barely audible voices all singing in tune."* — Paul Graham

In modern software, feature parity is easy; **taste and tactile feedback are the real differentiators**. FitTrack Pro has impressive feature depth (adaptive macro calculation, Indian food library, high-detail training logs, AI chatbot), but in its current state it **feels like a browser website trying to look like an app**, rather than a piece of crafted, tactile software.

### Key Tactical Deficits Identified:
1. **Dead Button Syndrome**: Most interactive elements only react to `hover` (which gets stuck on mobile) or use imperatively hacked `onMouseDown` JavaScript listeners. They lack the instantaneous `scale(0.97)` physical response on `:active` that signals the interface has heard the user.
2. **Sluggish `transition: all` Sprawl**: 9 core CSS rules across `src/index.css` broadcast `transition: all 0.2s`, triggering layout and repaint calculations across unrelated properties on every frame.
3. **Mobile Browser Tells Everywhere**:
   - Tapping anything in Safari triggers the default gray translucent tap highlight flash (`-webkit-tap-highlight-color` is missing).
   - Inputs in `AuthModal`, `SplitsPage`, and search bars use `font-size: 13px–15px`, which forces iOS Safari to violently zoom into the page and lock the viewport in a cropped state.
   - Letters and button labels get highlighted and selected if a user rests their thumb on a button for more than 400ms (`user-select: none` is missing on controls).
   - The viewport meta tag omits `viewport-fit=cover`, creating letterboxed bars under the iPhone notch and Dynamic Island.
4. **Non-Interruptible Keyframe Toasts**: Notifications use rigid CSS `@keyframes` that snap back to zero when multiple toasts trigger in sequence, violating Sonner principles.
5. **Teleporting Modals**: Dialogs (`.mo` / `.md`) pop in instantly with zero scale or opacity interpolation, contrasting jarringly with 20px blur filters.

---

## 2. The Master Review Table (Emil Kowalski Format)

| Before | After | Why |
| --- | --- | --- |
| `transition: all .25s var(--ease-spring)` (`index.css:175`) | `transition: transform 160ms var(--ease-out), opacity 160ms ease, background-color 160ms ease` | Never use `all`; it triggers layout recalculation across all properties. Specify exact GPU-accelerated properties. |
| `.btn-p:hover { transform: scale(1.02); }` (`index.css:178`) | `@media (hover: hover) and (pointer: fine) { .btn-p:hover { transform: scale(1.02); } }` | Touch devices fake hover on tap; without this media query, buttons remain stuck in the scaled hover state after tapping. |
| `.btn-p:active { transform: translateY(2px); }` (`index.css:179`) | `.btn-p:active { transform: scale(0.97); }` | `translateY(2px)` feels like a physical mechanical keycap from 2012; `scale(0.97)` creates an instantaneous modern tactile push that scales children proportionally. |
| `onMouseDown={e => e.currentTarget.style.transform = 'scale(0.98)'}` (`WorkoutPage.jsx:617`) | CSS `.interactive:active { transform: scale(0.97); }` | Imperative mouse listeners drop touch events on mobile and break gesture pipelines. Native CSS `:active` responds immediately on `pointerdown`. |
| `<meta name="viewport" content="width=device-width, initial-scale=1.0" />` (`index.html:7`) | `<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover, interactive-widget=resizes-content" />` | Without `viewport-fit=cover`, iOS letterboxes the app around the notch. `interactive-widget=resizes-content` ensures the Android virtual keyboard shrinks the viewport cleanly. |
| `<meta name="theme-color" content="#131315" />` (`index.html:8`) | `<meta name="theme-color" media="(prefers-color-scheme: light)" content="#F5F0EB" /><meta name="theme-color" media="(prefers-color-scheme: dark)" content="#131315" />` | Status bar color must match the top chrome for both light and dark modes. Single theme-color results in mismatched status bars. |
| No tap highlight suppression in CSS | `html { -webkit-tap-highlight-color: transparent; }` | iOS Safari and Android Chrome paint an ugly translucent gray flash on tap that fights custom button states. |
| No pull-to-refresh overscroll guard in CSS | `html, body { overscroll-behavior: none; }` | Stops the entire screen from rubber-banding and triggering unwanted browser pull-to-refresh inside custom scroll containers. |
| `input { font-size: 14px; }` (`index.css:208`, `AuthModal.jsx:225`) | `input, select, textarea { font-size: 16px; }` | Any font size under 16px triggers an automatic, irreversible page zoom in iOS Safari upon focus. |
| Missing text selection guard on buttons | `button, [role="button"], .ni, .tag { user-select: none; -webkit-user-select: none; }` | Long-pressing a button on iOS highlights its text and pops the iOS share callout. Controls should never be selectable. |
| `@keyframes toastIn` & `@keyframes toastOut` (`index.css:352`) | CSS `transform` & `opacity` transitions with `translateY(-100%)` | Keyframe animations restart from zero when interrupted. Transitions retarget smoothly when toasts are dismissed or stacked rapidly (Sonner Principle). |
| Modal `.md` appears instantly (`index.css:265`) | `.md { animation: modalEnter 220ms var(--ease-out); }` (`scale(0.96) opacity(0)` → `scale(1) opacity(1)`) | Instant appearance feels jarring and unpolished. Animate from `scale(0.96)` with opacity for a natural physical expansion. |
| Never animate from `scale(0)` | Start from `scale(0.95)` with `opacity: 0` | Nothing in the real world appears out of a microscopic point; starting from 0.95 gives weight and spatial presence. |
| `--ease-spring: cubic-bezier(0.175, 0.885, 0.32, 1.275)` (`index.css:79`) | `--ease-spring: cubic-bezier(0.16, 1, 0.3, 1)` | Overshooting above 1.0 creates a dated, cartoonish wobble. Premium interfaces use smooth exponential deceleration (Apple-style ease-out). |
| SVG Progress circle: `transition: stroke-dashoffset 1s var(--ease-spring)` (`SharedComponents.jsx:51`) | `transition: stroke-dashoffset 600ms cubic-bezier(0.23, 1, 0.32, 1)` | A 1-second bouncy easing on a progress gauge feels sluggish. A 600ms quintic ease-out feels responsive and precise. |

---

## 3. Deep Dive: The 5 Motion & Interaction Pillars

### Pillar 1: Button Responsiveness & Active State (The 100ms Rule)
**The Problem**:
When a user taps a button on a phone, they need tactile confirmation that the device registered the tap **the moment their finger touches the glass**, not when they lift it. Currently, buttons only transition on `:hover` (which doesn't exist on touch screens) or with slow 250ms transitions.

**The Fix**:
Every button, card, and actionable row must have:
- `touch-action: manipulation;` (eliminates the 300ms mobile tap delay)
- Fast 100–160ms ease-out press scale:
```css
button, [role="button"], .card-interactive, .picker-item {
  touch-action: manipulation;
  user-select: none;
  -webkit-user-select: none;
  transition: transform 140ms cubic-bezier(0.23, 1, 0.32, 1), opacity 140ms ease;
}

button:active, [role="button"]:active {
  transform: scale(0.97);
}
```

---

### Pillar 2: Motion Physics & Custom Easing Curves
**The Problem**:
`fittrack-pro` relies on `--ease-spring: cubic-bezier(0.175, 0.885, 0.32, 1.275)`. The coordinate `1.275` causes an exaggerated elastic bounce. In professional apps (Apple Fitness, Linear, Raycast), springs are tightly damped with zero overshoot or subtle settling.

**The Fix**:
Replace the easing system with Emil's recommended motion curve suite:

```css
:root {
  /* Strong ease-out: starts fast, lands with weight (UI entrances, button releases) */
  --ease-out: cubic-bezier(0.23, 1, 0.32, 1);

  /* iOS-like sheet & modal curve (from Ionic/Apple) */
  --ease-sheet: cubic-bezier(0.32, 0.72, 0, 1);

  /* Smooth state-to-state morphing */
  --ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);

  /* Fast snappy feedback for micro-interactions (<160ms) */
  --ease-press: cubic-bezier(0.16, 1, 0.3, 1);
}
```

---

### Pillar 3: Mobile Native Feeling (The iOS/Android "Un-Webbing")
**The Problem**:
The app runs on mobile devices, but gives away that it's a website through 4 distinct micro-tells:
1. **Gray tap highlight rectangle**: Whenever an exercise card or tab is tapped.
2. **Double-tap zoom drift**: Accidental double taps zoom into the UI.
3. **Form input zoom**: Tapping any text box triggers an automatic 120% camera zoom in Mobile Safari because font sizes are 13px–15px.
4. **Notch letterboxing**: Viewport stops short of the home indicator and notch.

**The Fix**:
Implement the **Mobile-Native Platform Baseline**:

```html
<!-- In index.html -->
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, interactive-widget=resizes-content" />
<meta name="theme-color" media="(prefers-color-scheme: light)" content="#F5F0EB" />
<meta name="theme-color" media="(prefers-color-scheme: dark)" content="#131315" />
```

```css
/* In index.css */
html {
  -webkit-tap-highlight-color: transparent;
  -webkit-text-size-adjust: 100%;
  overscroll-behavior: none;
}

/* Fix iOS Safari auto-zoom on inputs */
input, textarea, select {
  font-size: 16px !important;
}

/* Control selection hygiene */
button, [role="button"], .ni, .tag, .badge {
  user-select: none;
  -webkit-user-select: none;
  -webkit-touch-callout: none;
}

/* Safe areas */
.bottom-nav {
  padding-bottom: env(safe-area-inset-bottom, 16px);
}
```

---

### Pillar 4: Sonner-Grade Toast Architecture
**The Problem**:
In `src/components/shared/SharedComponents.jsx`, `ToastContainer` maps toasts to `.toast-enter` and `.toast-exit` keyframe classes pinned to `top: 20, right: 20`.
- On mobile devices, toasts overflow off-screen or sit under the battery/clock icons.
- CSS keyframes cannot be smoothly retargeted when multiple toasts trigger in rapid succession (e.g., logging 3 sets in a row).
- Toasts lack swipe-to-dismiss gesture momentum.

**The Fix**:
Refactor toast transitions from `@keyframes` to **interruptible CSS transforms**:

```css
/* Interruptible Sonner-style Toast */
.toast-item {
  transform: translateY(0) scale(1);
  opacity: 1;
  transition: transform 260ms var(--ease-out), opacity 200ms ease;
  will-change: transform, opacity;
}

/* Starting state (enters from top on mobile, right on desktop) */
@starting-style {
  .toast-item {
    transform: translateY(-20px) scale(0.95);
    opacity: 0;
  }
}

.toast-item.exiting {
  transform: translateY(-16px) scale(0.92);
  opacity: 0;
  pointer-events: none;
}
```

---

### Pillar 5: Modal & Dialog Expansion Choreography
**The Problem**:
Currently in `src/index.css`:
```css
.mo { position: fixed; inset: 0; backdrop-filter: var(--glass-blur); }
.md { width: 100%; max-width: 480px; }
```
When opening `AuthModal`, `EditWorkoutModal`, or `ConfirmDialog`, the dialog appears instantly with no entry choreography. When dismissed, it vanishes mid-air.

**The Fix**:
Add physical scale-up entry from `0.96` with backdrop fade:

```css
@keyframes modalBackdropFade {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes modalContentEnter {
  from {
    opacity: 0;
    transform: scale(0.96) translateY(8px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.mo {
  animation: modalBackdropFade 180ms ease forwards;
}

.md {
  animation: modalContentEnter 220ms var(--ease-out) forwards;
  will-change: transform, opacity;
}
```

---

## 4. Concrete Code Implementation Guide

Here are the exact code updates ready to be applied.

---

### File 1: `index.html` (Mobile Meta Tags & Viewport)

```diff
   <head>
     <meta charset="UTF-8" />
     <link rel="icon" type="image/png" href="/favicon.png" />
     <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
-    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
-    <meta name="theme-color" content="#131315" />
+    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover, interactive-widget=resizes-content" />
+    <meta name="theme-color" media="(prefers-color-scheme: light)" content="#F5F0EB" />
+    <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#131315" />
+    <meta name="color-scheme" content="light dark" />
     <title>Kaaya Fit — Master Your Physique</title>
   </head>
```

---

### File 2: `src/index.css` (Platform Foundation, Easings & Press States)

```diff
 /* ─── RESET ─────────────────────────────────────────────────────── */
-*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
+*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
+
+html {
+  -webkit-tap-highlight-color: transparent;
+  -webkit-text-size-adjust: 100%;
+  overscroll-behavior: none;
+}

 /* ─── EASINGS (Emil Kowalski Physics Suite) ───────────────────────── */
-:root {
-  --ease-spring: cubic-bezier(0.175, 0.885, 0.32, 1.275);
-  --ease-smooth: cubic-bezier(0.4, 0, 0.2, 1);
-  --ease-decel: cubic-bezier(0, 0, 0.2, 1);
-  --ease-accel: cubic-bezier(0.4, 0, 1, 1);
+  --ease-out: cubic-bezier(0.23, 1, 0.32, 1);
+  --ease-spring: cubic-bezier(0.16, 1, 0.3, 1);
+  --ease-smooth: cubic-bezier(0.4, 0, 0.2, 1);
+  --ease-sheet: cubic-bezier(0.32, 0.72, 0, 1);
+  --ease-press: cubic-bezier(0.16, 1, 0.3, 1);
+}

-button, a, input, select, .card, .picker-item, .tm, .ni, .gb {
-  touch-action: manipulation;
-}
+button, a, input, select, .card, .picker-item, .tm, .ni, .gb, .tag {
+  touch-action: manipulation;
+  user-select: none;
+  -webkit-user-select: none;
+}

+/* Enforce 16px minimum font size on mobile to prevent iOS Safari auto-zoom */
+input, textarea, select {
+  font-size: 16px !important;
+}

 /* ─── BUTTONS ───────────────────────────────────────────────────── */
 .btn-p{
   background:var(--signature-gradient);color:var(--on-primary);border:none;border-radius:24px;padding:13px 26px;
   font-family:'Be Vietnam Pro',sans-serif;font-weight:700;font-size:14px;cursor:pointer;
-  transition:all .25s var(--ease-spring);letter-spacing:.3px;
+  transition:transform 140ms var(--ease-press), opacity 140ms ease;
+  letter-spacing:.3px;
 }
-.btn-p:hover{opacity:.92;transform:scale(1.02);box-shadow:var(--glow-primary)}
-.btn-p:active{transform:translateY(2px);opacity:.95;}
+@media (hover: hover) and (pointer: fine) {
+  .btn-p:hover{opacity:.92;transform:scale(1.02);box-shadow:var(--glow-primary)}
+}
+.btn-p:active{transform:scale(0.97);opacity:.95;}
```

---

### File 3: `src/components/shared/SharedComponents.jsx` (Modal Choreography)

Add smooth entry animation to `.md` dialogs:

```diff
 /* In src/index.css */
+.md {
+  animation: modalEnter 220ms cubic-bezier(0.23, 1, 0.32, 1) forwards;
+  will-change: transform, opacity;
+}
+@keyframes modalEnter {
+  from {
+    opacity: 0;
+    transform: scale(0.96) translateY(6px);
+  }
+  to {
+    opacity: 1;
+    transform: scale(1) translateY(0);
+  }
+}
```

---

## 5. Verification Checklist

Before considering the design engineering complete:

- [ ] **Test on Physical Hardware**: Connect an iPhone/Android over Wi-Fi/USB. Verify that tapping buttons produces zero gray highlight flash.
- [ ] **Input Focus Test**: Tap into `AuthModal` email input on an iPhone. Ensure the page does **not** auto-zoom or pan off center.
- [ ] **Sticky Hover Test**: Tap a button or card, then tap somewhere neutral. Ensure the button doesn't remain visually stuck in the hover state.
- [ ] **Long Press Test**: Hold your thumb on a tab or button for 2 seconds. Ensure native text selection handles do not appear.
- [ ] **Modal Feel Test**: Open and close `ConfirmDialog` and `EditWorkoutModal`. Confirm smooth 220ms scale/fade entry without bounce overshoot.
- [ ] **Rapid Toast Triggering**: Add 3 sets in quick succession. Confirm toasts animate into position without visual tearing or resetting.
