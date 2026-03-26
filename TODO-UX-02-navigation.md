# TODO — UX-02: Navigation & Information Architecture

> **Scope:** Routing, sidebar, bottom nav, breadcrumbs, and quick-action shortcuts.  
> **Files primarily affected:** `Layout.jsx`, `DashboardPage.jsx`, `constants.js`

---

## UX-2.1 — No "Today's Workout" Shortcut from Dashboard 🟠

**Problem:** The #1 user action in a fitness app is "start today's workout." Current Dashboard shows the active split and recent sessions but no quick-launch. Users must navigate: Tracker → find correct day → tap Start. **This is a 3-tap flow that should be 1 tap.**

**Fix in `DashboardPage.jsx` — compute today's scheduled day from the active split:**
```js
// Today's day index relative to split start (based on last workout date pattern)
const splitDayIdx = /* compute from workout history */;
const todayDay = activeSplit?.days[splitDayIdx % activeSplit.days.length];
```
Add a prominent card above the stats grid:
```jsx
<div className="card stripe" style={{ padding: '14px 18px', marginBottom: 14, cursor: 'pointer' }}
  onClick={() => navigate('/workout')}>
  <div style={{ fontSize: 10, color: 'var(--t3)', fontWeight: 700, textTransform: 'uppercase' }}>
    Today's Plan
  </div>
  <div className="bb" style={{ fontSize: 22, color: 'var(--o)' }}>{todayDay.name}</div>
  <div style={{ fontSize: 12, color: 'var(--t2)' }}>{todayDay.exercises.length} exercises · ~55 min</div>
  <button className="btn-p" style={{ marginTop: 10, padding: '10px 20px', fontSize: 13 }}>
    Start Workout →
  </button>
</div>
```

**Files:** `DashboardPage.jsx`.

---

## UX-2.2 — Sidebar Collapse Has No Persistent Memory 🟡

**Problem:** `Layout.jsx` initializes `const [sb, setSb] = useState(true)` — sidebar always opens expanded on every page load. Collapsing it to gain screen space on a small laptop resets on next visit.

**Fix in `Layout.jsx`:**
```jsx
const [sb, setSb] = useLocalStorage('fittrack_sidebar_collapsed', true);
```

**Files:** `Layout.jsx`.

---

## UX-2.3 — Breadcrumbs Missing on Data-Heavy Pages 🟡

**Problem:** On `ProgressPage.jsx` the user selects Split → Day → Exercise through 3 dropdowns. There's no indication of the current selection context. On mobile, the last selection scrolls out of view while viewing charts.

**Fix — add a compact breadcrumb trail above the charts:**
```
Push Pull Legs  ›  Pull Day A  ›  Deadlift
```
Each segment is a clickable chip that clears downstream selections when tapped.

**Files:** `ProgressPage.jsx`.

---

## UX-2.4 — "More" Sheet Animation is Instant — No Slide-Up 🟡

**Problem:** `BottomNav` in `Layout.jsx` renders the "More" sheet by toggling `showMore` — it appears/disappears instantly with no animation. The rest of the app has smooth transitions; this jarring pop is inconsistent.

**Fix — add to `index.css`:**
```css
@keyframes sheetUp {
  from { transform: translateY(100%); opacity: 0; }
  to   { transform: translateY(0); opacity: 1; }
}
.sheet-up { animation: sheetUp .22s cubic-bezier(.4,0,.2,1) forwards; }
```
Apply `className="sheet-up"` to the More sheet div.

**Files:** `index.css`, `Layout.jsx` (BottomNav section).

---

## UX-2.5 — No Active Route Indicator on "More" Button When on a "More" Page 🟡

**Problem:** When on a `NAV_MOBILE_MORE` page (e.g., Muscle Map, History), the "More" button in the bottom nav shows no active state. Users have no visual indication of which section they're in.

**Fix — already computed but not applied correctly:**
```jsx
const moreActive = NAV_MOBILE_MORE.some(n => isActive(n.path));
// Verify the "More" button text label also turns orange:
color: showMore || moreActive ? 'var(--o)' : 'var(--t3)'
```
Additionally, add a subtle orange dot indicator below the "More" icon when `moreActive && !showMore`.

**Files:** `Layout.jsx` (BottomNav section).
