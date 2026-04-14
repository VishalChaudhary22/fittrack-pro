# TODO — UX-11: Charts, Animations & Mobile UX

> **Scope:** Data visualization quality, micro-interaction polish, and mobile-specific UX issues.  
> **Files primarily affected:** `DashboardPage.jsx`, `ProgressPage.jsx`, `MeasurementsPage.jsx`, `WorkoutPage.jsx`, `index.css`, `SharedComponents.jsx`

---

## 14. Charts & Data Visualization

### UX-14.1 — All Charts Use the Same Orange — No Semantic Color 🟢

**Problem:** Every Recharts chart uses `stroke="#E8540D"` (orange). A weight loss chart (where going down is good) uses the same color as a strength chart (where going up is good). No semantic distinction.

**Fix — introduce chart color semantics in a shared constants file:**
```js
// src/data/constants.js or a new src/utils/chartColors.js
export const CHART_COLORS = {
  weight:   '#E8540D',  // orange — neutral body metric
  strength: '#4ECDC4',  // teal — strength & performance
  volume:   '#FFE66D',  // yellow — training effort & volume
  recovery: '#51CF66',  // green — rest, recovery, consistency metrics
};
```
Apply per chart type across `DashboardPage.jsx` (weight → orange), `ProgressPage.jsx` (strength → teal, volume → yellow), `MeasurementsPage.jsx` (body → orange).

**Files:** `DashboardPage.jsx`, `ProgressPage.jsx`, `MeasurementsPage.jsx`.

---

### UX-14.2 — Chart X-Axis Dates Truncate Poorly on Mobile 🟡

**Problem:** `XAxis` with `interval="preserveStartEnd"` only keeps first and last tick. With 30+ entries, intermediate dates overlap and become illegible on mobile.

**Fix — dynamic interval based on data length:**
```jsx
<XAxis
  dataKey="date"
  tick={{ fill: 'var(--t3)', fontSize: 9 }}
  interval={Math.max(0, Math.floor(chartData.length / 6) - 1)}
/>
// This shows approximately 6 labels regardless of total data points
```

**Files:** `DashboardPage.jsx`, `ProgressPage.jsx`, `MeasurementsPage.jsx`, `WeightLogPage.jsx`.

---

### UX-14.3 — No "Insufficient Data" State Inside Charts 🟡

**Problem:** When `chartData` has only 1 entry, Recharts renders a single dot with no line — chart appears blank or broken with no explanation.

**Fix — wrap every chart in a conditional check:**
```jsx
{chartData.length < 2 ? (
  <div style={{
    height: 170,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--t3)',
    fontSize: 12,
    fontStyle: 'italic',
  }}>
    Log at least 2 entries to see the trend
  </div>
) : (
  <ResponsiveContainer width="100%" height={170}>
    {/* chart */}
  </ResponsiveContainer>
)}
```

**Files:** `DashboardPage.jsx`, `ProgressPage.jsx`, `MeasurementsPage.jsx`.

---

### UX-14.4 — Tooltip Cursor Color Is Default Grey — Not On-Brand 🟢

**Problem:** The default Recharts tooltip cursor line is grey, not the app's orange. Minor but noticeable against the dark background.

**Fix — add orange cursor to every Tooltip:**
```jsx
<Tooltip
  cursor={{ stroke: 'rgba(232,84,13,.4)', strokeWidth: 1, strokeDasharray: '4 4' }}
  contentStyle={{ background: 'var(--c2)', border: '1px solid var(--bd)', borderRadius: 10, fontSize: 12 }}
/>
```

**Files:** `DashboardPage.jsx`, `ProgressPage.jsx`, `MeasurementsPage.jsx`.

---

## 15. Micro-interactions & Animation

### UX-15.1 — No Skeleton for Chart Loading 🟡

**Problem:** Charts load synchronously — but if data computation is slow (many workout logs), there's a visible layout jump. No feedback during the 300ms artificial dashboard delay.

**Fix — wrap chart containers in conditional skeleton during `!loaded` state:**
```jsx
{!loaded ? (
  <Skeleton height={170} style={{ marginTop: 8 }} />
) : (
  <ResponsiveContainer>...</ResponsiveContainer>
)}
// Skeleton component already exists in SharedComponents.jsx
```

**Files:** `DashboardPage.jsx`.

---

### UX-15.2 — Button Active State Has No "Press" Feel on Mobile 🟡

**Problem:** `.btn-p:active` in `index.css` sets `opacity: .95` and `transform: translateY(0)` (cancels hover lift). The physical press sensation is subtle. Mobile users get essentially no tactile confirmation.

**Fix in `index.css`:**
```css
.btn-p:active {
  transform: scale(0.96);  /* slight shrink = press sensation */
  opacity: .95;
  box-shadow: 0 1px 4px rgba(232,84,13,.15);
  transition: transform .08s, opacity .08s;
}
```
`scale(0.96)` on a 44px+ target is imperceptible as a layout shift but very satisfying as press feedback.

**Files:** `index.css`.

---

### UX-15.3 — Toast Notifications Use Text Icons — Not Lucide Icons 🟢

**Problem:** `ToastContainer` uses a small circle with `✓`, `✕`, or `ℹ` text inside. Generic; doesn't match the app's Lucide icon set.

**Fix in `SharedComponents.jsx`:**
```jsx
import { CheckCircle, XCircle, Info } from 'lucide-react';

const toastIcons = {
  success: <CheckCircle size={16} />,
  error:   <XCircle size={16} />,
  info:    <Info size={16} />,
};

// Replace the existing circle span with:
<span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
  {toastIcons[t.type] || toastIcons.info}
</span>
```

**Files:** `SharedComponents.jsx`.

---

### UX-15.4 — ScrollPicker Has No Haptic Feedback on Mobile 🟢

**Problem:** `ScrollPicker` is smooth but silent. Each value snap could trigger a brief haptic pulse using the Vibration API, making weight selection feel more intentional and physical.

**Fix in `ScrollPicker`'s `onScroll` handler in `SharedComponents.jsx`:**
```js
const onScroll = useCallback(() => {
  if (!ref.current) return;
  const i = Math.round(ref.current.scrollTop / H);
  const c = clamp(i, 0, items.length - 1);
  if (items[c] !== value) {
    onChange(items[c]);
    // Haptic feedback on supported mobile devices:
    if ('vibrate' in navigator) navigator.vibrate(8);
  }
}, [items, onChange, value]);
```

**Files:** `SharedComponents.jsx`.

---

## 16. Mobile UX

### UX-16.1 — Touch Targets Below 44px on Key Workout Actions 🔴

**Problem:** The set done/checkbox button in `WorkoutPage.jsx` renders at approximately `width: 32, height: 32` — below WCAG 2.5.5's minimum of 44×44px for touch targets. In a gym with sweaty hands, small targets cause constant misfires.

**Fix:**
```jsx
// In WorkoutPage.jsx set row, the done button:
<button style={{
  width: 44,
  height: 44,
  minWidth: 44,  // prevent shrink in flex
  borderRadius: 8,
  // ... existing color/state styles
}} onClick={() => upd(ei, si, 'done', !s.done)}>
  {s.done ? '✓' : '○'}
</button>

// Also audit: the "✕" remove-set button at padding:'7px 5px' — increase to padding:'10px'
```

**Files:** `WorkoutPage.jsx`.

---

### UX-16.2 — "More" Sheet Bottom Items in iOS Home Indicator Zone 🟠

**Problem:** The "More" sheet positions correctly above the bottom nav but has no `padding-bottom` for the safe area. Items at the very bottom of the sheet sit in the iPhone home indicator zone and are hard to tap.

**Fix:**
```jsx
// More sheet div in Layout.jsx BottomNav:
paddingBottom: 'calc(8px + env(safe-area-inset-bottom, 8px))'
```

**Files:** `Layout.jsx`.

---

### UX-16.3 — Active Workout Session is One Long Scroll — No Exercise Navigation 🟡

**Problem:** During a session, the entire page is one long scroll. With 6 exercises × 4 sets each, on a 375px phone this is 2000px+ of content. Users lose their place and must scroll far to reach the Finish button.

**Fix — offer an optional exercise-by-exercise card view:**
```jsx
// Toggle button in session header: "📋 List" | "◉ Focus"
// Focus mode: shows one exercise card at a time with prev/next navigation:
// [ ← Exercise 2/6: Overhead Press → ]
// Finish becomes accessible after swiping past the last exercise
```
Reference: Strong App and Hevy both implement this pattern for better gym usability.

**Files:** `WorkoutPage.jsx`.

---

### UX-16.4 — Inputs Don't Trigger Numeric Keyboard on iOS 🟡

**Problem:** `type="number"` with `step=".5"` on iOS triggers the standard full keyboard, not the numeric pad. Users must manually switch keyboards to type weight values during a workout.

**Fix:**
```jsx
// Replace type="number" step=".5" with:
<input
  type="text"
  inputMode="decimal"
  pattern="[0-9]*\.?[0-9]*"
  // inputMode="decimal" triggers the numeric keyboard with a decimal point on iOS
  value={s.weight}
  onChange={e => upd(ei, si, 'weight', e.target.value)}
/>
// Same for reps inputs: inputMode="numeric" pattern="[0-9]*"
```

**Files:** `WorkoutPage.jsx`.

---

### UX-16.5 — Long Exercise Names Truncate Poorly in Workout Day Cards 🟡

**Problem:** Day selection cards show exercise names at `fontSize: 12` with no overflow handling. "Single Hand Overhead Cable Tricep Extension" wraps to 3 lines and breaks the card layout on narrow screens.

**Fix:**
```jsx
<span style={{
  display: 'block',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
  maxWidth: '100%',
}}>
  {ex.name}
</span>
```

**Files:** `WorkoutPage.jsx`.
