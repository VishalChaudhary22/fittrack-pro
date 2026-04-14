# TODO — UX-13: Accessibility & Performance UX

> **Scope:** WCAG compliance, keyboard navigation, screen reader support, and performance perception.  
> **Files primarily affected:** `index.css`, `SharedComponents.jsx`, `App.jsx`, `useLocalStorage.js`

---

## 19. Accessibility

### UX-19.1 — Orange on Dark Background Fails WCAG AA for Normal Text 🟠

**Problem:** `var(--o): #E8540D` on `var(--bg): #050506` has a contrast ratio of approximately **3.2:1** — below the WCAG AA requirement of:
- **4.5:1** for normal text (< 18pt / < 14pt bold)
- **3:1** for large text (≥ 18pt / ≥ 14pt bold)

**Affected elements:**
- All `.tag` text (10px, `color: var(--o)`, on `var(--o2)` background)
- Stat card unit labels (13px, `color: var(--o)`)
- Streak XP and rank labels in smaller sizes
- Workout exercise muscle tags

**Fix — use orange for decoration and large text only; for small text, use a higher-contrast alternative:**
```css
/* Add to index.css */
:root, [data-theme="dark"] {
  /* Accessible orange for small text — lighter, passes 4.6:1 on #050506 */
  --o-text: #F06728;
}

[data-theme="light"] {
  /* For light theme, the existing --o already passes */
  --o-text: var(--o);
}
```
Replace `color: 'var(--o)'` with `color: 'var(--o-text)'` on all text at font sizes ≤ 13px.

**Files:** `index.css`, all page components (systematic audit pass).

---

### UX-19.2 — All Icon-Only Buttons Lack `aria-label` 🟠

**Problem:** Many interactive icon-only buttons have no `aria-label`, making them inaccessible to screen readers.

**Complete list of affected elements:**
- `WorkoutPage.jsx` — rest timer cancel `X` button
- All modal close `X` buttons in `SharedComponents.jsx` (ConfirmDialog), `DashboardPage.jsx`, `DietPage.jsx`, `MeasurementsPage.jsx`
- Edit/Delete buttons in `WeightLogPage.jsx` (pencil icon, trash icon)
- Sidebar collapse toggle (`Dumbbell` icon click) in `Layout.jsx`
- ScrollPicker prev/next navigation arrows
- `WorkoutHistoryPage.jsx` — delete session button (icon-only)

**Fix — add `aria-label` to every icon-only interactive element:**
```jsx
<button aria-label="Close modal"><X size={14} /></button>
<button aria-label="Edit weight entry"><Edit2 size={10} /></button>
<button aria-label="Delete weight entry"><Trash2 size={10} /></button>
<button aria-label="Toggle sidebar"><Dumbbell size={15} /></button>
<button aria-label="Delete session"><Trash2 size={10} /></button>
```

**Files:** `SharedComponents.jsx`, `WorkoutPage.jsx`, `WeightLogPage.jsx`, `WorkoutHistoryPage.jsx`, `Layout.jsx`, `DashboardPage.jsx`, `DietPage.jsx`, `MeasurementsPage.jsx`.

---

### UX-19.3 — Modal Focus Trap Not Implemented 🟡

**Problem:** When a modal opens, keyboard focus is not trapped inside it. Users tabbing after modal open will focus elements behind the modal. Screen reader users get no indication they're inside a dialog.

**Fix in `SharedComponents.jsx` Portal/modal components:**
```jsx
// In the .md wrapper div:
useEffect(() => {
  // 1. Move focus to first interactive element inside modal on open
  const firstFocusable = modalRef.current?.querySelector(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  firstFocusable?.focus();

  // 2. Trap Tab / Shift+Tab within modal boundaries
  const handleKeyDown = (e) => {
    if (e.key !== 'Tab') return;
    const focusables = modalRef.current?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first) { e.preventDefault(); last?.focus(); }
    } else {
      if (document.activeElement === last) { e.preventDefault(); first?.focus(); }
    }
  };
  document.addEventListener('keydown', handleKeyDown);
  return () => document.removeEventListener('keydown', handleKeyDown);
}, []);

// 3. Add ARIA attributes to .md wrapper:
<div ref={modalRef} role="dialog" aria-modal="true" aria-labelledby="modal-title" className="md">
```

Also: store the element that triggered the modal open and restore focus to it on close.

**Files:** `SharedComponents.jsx` (ConfirmDialog, Portal-rendered modals), `DashboardPage.jsx`.

---

### UX-19.4 — No `prefers-reduced-motion` Respect 🟡

**Problem:** `index.css` defines 8+ keyframe animations (`pgIn`, `pgOut`, `toastIn`, `toastOut`, `skPulse`, `sheetUp`, etc.) that play on every interaction. Users who have set `prefers-reduced-motion: reduce` in their OS accessibility settings still see all animations — which can cause physical discomfort for some users.

**Fix — add to `index.css`:**
```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: .01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: .01ms !important;
    scroll-behavior: auto !important;
  }
}
```
This is a one-line addition with broad impact and zero downside for users without motion sensitivity.

**Files:** `index.css`.

---

### UX-19.5 — ScrollPicker Has No Keyboard Navigation 🟡

**Problem:** `ScrollPicker` in `SharedComponents.jsx` is a custom scroll-based component with no keyboard support. Keyboard users cannot change weight/timeline values with arrow keys, making the Dashboard weight log modal and goal modal inaccessible.

**Fix — add keyboard handling to the scroll wrapper div:**
```jsx
<div
  ref={ref}
  className="picker-scroll"
  onScroll={onScroll}
  tabIndex={0}
  role="spinbutton"
  aria-valuenow={value}
  aria-label={`Select value, currently ${value}`}
  onKeyDown={(e) => {
    const currentIdx = items.findIndex(it => String(it) === String(value));
    if (e.key === 'ArrowDown' && currentIdx < items.length - 1) {
      e.preventDefault();
      const newIdx = currentIdx + 1;
      onChange(items[newIdx]);
      ref.current.scrollTop = newIdx * H;
    }
    if (e.key === 'ArrowUp' && currentIdx > 0) {
      e.preventDefault();
      const newIdx = currentIdx - 1;
      onChange(items[newIdx]);
      ref.current.scrollTop = newIdx * H;
    }
  }}
>
```

**Files:** `SharedComponents.jsx`.

---

## 20. Performance UX

### UX-20.1 — No Route-Level Code Splitting — All Code Loaded Upfront 🟡

**Problem:** `App.jsx` imports every page component with standard ES imports. All page code is bundled and loaded on first visit, including heavy pages like `ProgressPage.jsx` (multiple chart imports) and `MuscleMapPage.jsx` (canvas operations).

**Estimated impact:** 40–60% reduction in initial JS bundle size.

**Fix — lazy load all routes in `App.jsx`:**
```jsx
import React, { Suspense, lazy } from 'react';

const DashboardPage     = lazy(() => import('./components/pages/DashboardPage'));
const WorkoutPage       = lazy(() => import('./components/pages/WorkoutPage'));
const ProgressPage      = lazy(() => import('./components/pages/ProgressPage'));
const MuscleMapPage     = lazy(() => import('./components/pages/MuscleMapPage'));
const SplitsPage        = lazy(() => import('./components/pages/SplitsPage'));
const DietPage          = lazy(() => import('./components/pages/DietPage'));
const MeasurementsPage  = lazy(() => import('./components/pages/MeasurementsPage'));
const WeightLogPage     = lazy(() => import('./components/pages/WeightLogPage'));
const WorkoutHistoryPage = lazy(() => import('./components/pages/WorkoutHistoryPage'));
const ProfilePage       = lazy(() => import('./components/pages/ProfilePage'));
const ContactPage       = lazy(() => import('./components/pages/ContactPage'));

// Wrap <Routes> in:
<Suspense fallback={<LoadingScreen />}>
  <Routes>
    {/* ... existing routes */}
  </Routes>
</Suspense>
```

**Files:** `App.jsx`.

---

### UX-20.2 — `calcAllMuscleXP` Recomputed on Multiple Pages Independently 🟡

**Problem:** `DashboardPage.jsx` and `MuscleMapPage.jsx` both call `calcAllMuscleXP(workoutLogs, splits, user?.id)` independently in their own `useMemo` hooks. Since the same `workoutLogs` and `splits` are in context, this is duplicated O(n³) work whenever either page renders.

**Fix — move computation to `AppContext.jsx` and share the result:**
```jsx
// AppContext.jsx — compute once, store in context value:
const muscleXP = useMemo(
  () => user ? calcAllMuscleXP(workoutLogs, splits, user.id) : {},
  [workoutLogs, splits, user?.id]
);

// Expose via context:
const value = {
  // ... existing values
  muscleXP,  // ← add this
};

// All pages use: const { muscleXP } = useApp();
// Remove the local useMemo calls in DashboardPage.jsx and MuscleMapPage.jsx
```

**Files:** `AppContext.jsx`, `DashboardPage.jsx`, `MuscleMapPage.jsx`.

---

### UX-20.3 — `localStorage` Writes on Every Keystroke in Workout Forms 🟡

**Problem:** `useLocalStorage.js` writes to `localStorage` synchronously on every `setValue` call. During workout logging, every reps/weight keypress triggers a `localStorage.setItem`. The `localStorage` I/O is synchronous and briefly blocks the main thread on every keystroke.

**Fix — debounce storage writes in `useLocalStorage.js`:**
```js
import { useState, useCallback, useRef } from 'react';

export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => { /* existing */ });
  const writeTimer = useRef(null);

  const setValue = useCallback((value) => {
    const valueToStore = value instanceof Function ? value(storedValue) : value;
    setStoredValue(valueToStore); // immediate state update
    
    // Debounce the actual localStorage write to 300ms:
    clearTimeout(writeTimer.current);
    writeTimer.current = setTimeout(() => {
      try {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error);
      }
    }, 300);
  }, [key, storedValue]);

  return [storedValue, setValue];
}
```
State updates remain immediate (no UX impact); storage writes batch to once per 300ms.

**Files:** `useLocalStorage.js`.
