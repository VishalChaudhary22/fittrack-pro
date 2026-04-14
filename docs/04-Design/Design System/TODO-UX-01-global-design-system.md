# TODO — UX-01: Global Design System

> **Scope:** Issues that span every page — color tokens, spacing, hover states, modals, error handling.  
> **Files primarily affected:** `index.css`, `SharedComponents.jsx`, `App.jsx`

---

## UX-1.1 — `var(--t3)` Overuse Creates Invisible UI 🟠

**Problem:** `--t3` (`#38383E` dark / `#9E9EA6` light) is the *primary* label color across the whole app. At 9–10px it fails WCAG AA contrast on both themes.

**Evidence:**
- `DashboardPage.jsx` — "Sessions / Week" label, BMI box labels, Streak sub-labels
- `WorkoutPage.jsx` — exercise notes
- `MuscleMapPage.jsx` — XP labels
- `DietPage.jsx` — "BODY STATS" row sub-labels

**Fix — enforce 3-tier text hierarchy:**
```
Primary text   → var(--tx)   (headings, key values, active labels)
Secondary text → var(--t2)   (sub-labels, supporting info)
Tertiary text  → var(--t3)   (timestamps, de-emphasised metadata ONLY)
```
Audit every `color: 'var(--t3)'` on text `< 12px` and upgrade to `var(--t2)`.

**Files:** All page components — systematic audit pass.

---

## UX-1.2 — Card Border Radius Inconsistency 🟢

**Problem:** 7 distinct `border-radius` values in use with no documented scale. `.card` = 24px, `card-p` = 20px, modals = 28px, tags = 20px, inputs = 14px, badges = 8–10px, buttons = 14px.

**Fix — add CSS variables to `index.css`:**
```css
--r-xs:  6px;   /* tags, chips, set badges */
--r-sm:  10px;  /* inputs, small cards */
--r-md:  14px;  /* buttons, secondary cards */
--r-lg:  20px;  /* primary cards (card-p) */
--r-xl:  24px;  /* major cards (.card) */
--r-2xl: 28px;  /* modals, full-page overlays */
```
Then replace all hardcoded `borderRadius` values with the variable.

**Files:** `index.css`, all components with inline `borderRadius`.

---

## UX-1.3 — Hover States Only on Desktop, Touch Has No Feedback 🟠

**Problem:** Interactive cards use `onMouseEnter/Leave` for scale/border effects with zero `:active` / touch feedback for mobile users. Tapping a card feels unresponsive.

**Evidence:**
- `DashboardPage.jsx` L211 — muscle activity card, scale on hover only
- `WorkoutPage.jsx` — day cards hover only
- `SplitsPage.jsx` — split cards hover only

**Fix — add to `index.css`:**
```css
.card-interactive:active {
  transform: scale(0.98);
  opacity: 0.9;
  transition: transform .1s, opacity .1s;
}
```
For React inline styles, add an `onTouchStart` handler with a brief opacity change.

**Files:** `index.css`, `DashboardPage.jsx`, `WorkoutPage.jsx`, `SplitsPage.jsx`.

---

## UX-1.4 — No Page Transition Animation Consistency 🟡

**Problem:** `pgIn` and `pgOut` keyframes are defined in `index.css`. `.pg-in` is applied on new pages but `pgOut` is never triggered — there's no coordination between route change and the outgoing page. Result: abrupt cut-out followed by slide-in.

**Fix in `App.jsx`:** Use React Router's location key to coordinate transitions:
```jsx
// Wrap <Routes> in an AnimationWrapper that:
// 1. On location change: applies .pg-out to the exiting page for 100ms
// 2. After 100ms: mounts the new page with .pg-in
```
Alternatively use `react-transition-group` (no extra bundle cost since React Router already imported).

**Files:** `App.jsx`, `index.css`.

---

## UX-1.5 — Modal Scroll Lock Missing 🟠

**Problem:** When a `.mo` modal is open, the page behind it still scrolls on iOS Safari and some Android browsers. Users accidentally scroll the background while interacting with the modal.

**Fix in `SharedComponents.jsx` — add to all Portal-rendered overlays:**
```jsx
useEffect(() => {
  document.body.style.overflow = 'hidden';
  return () => { document.body.style.overflow = ''; };
}, []);
```
On iOS Safari, also set `document.body.style.position = 'fixed'` with the current scroll offset to prevent elastic bounce.

**Files:** `SharedComponents.jsx` (Portal, ConfirmDialog), `DashboardPage.jsx`, `DietPage.jsx`.

---

## UX-1.6 — No Error Boundary — Single Component Crash = Full App Crash 🔴

**Problem:** No React Error Boundary anywhere. A runtime error in `BodyMapSVG.jsx` (canvas ops), `DashboardPage.jsx` (chart rendering), or any component unmounts the entire app showing a blank white screen with no recovery.

**Fix — create `src/components/shared/ErrorBoundary.jsx`:**
```jsx
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };
  static getDerivedStateFromError(error) { return { hasError: true, error }; }
  render() {
    if (this.state.hasError) return (
      <div style={{ padding: 40, textAlign: 'center' }}>
        <div style={{ fontSize: 14, color: 'var(--t2)', marginBottom: 16 }}>
          Something went wrong in this section.
        </div>
        <button className="btn-p" onClick={() => this.setState({ hasError: false })}>
          Try Again
        </button>
      </div>
    );
    return this.props.children;
  }
}
```
Wrap each page component and `BodyMapSVG` individually so failures are scoped.

**Files:** New `ErrorBoundary.jsx`, `App.jsx` (wrap each route), `BodyMapSVG.jsx`.

---

## UX-1.7 — No Unload Guard for In-Progress Workout 🔴

**Problem:** If a user taps the browser back button, a nav link, or closes the tab during an active workout session (`session !== null`), all unsaved progress is silently lost.

**Evidence:** `WorkoutPage.jsx` has no `beforeunload` listener and no navigation guard.

**Fix in `WorkoutPage.jsx`:**
```jsx
// Warn on browser close/refresh
useEffect(() => {
  if (!session) return;
  const onUnload = (e) => {
    e.preventDefault();
    e.returnValue = '';
  };
  window.addEventListener('beforeunload', onUnload);
  return () => window.removeEventListener('beforeunload', onUnload);
}, [session]);
```
Also: the `← Back` button in the session header should trigger a `ConfirmDialog` before discarding, not navigate immediately.

**Files:** `WorkoutPage.jsx`.

---

## Related Items in Other Files

- UX-19.1 (Orange contrast WCAG) → `TODO-UX-13-accessibility-performance.md`
- UX-19.4 (prefers-reduced-motion) → `TODO-UX-13-accessibility-performance.md`
- UX-20.3 (localStorage debounce) → `TODO-UX-13-accessibility-performance.md`
