# FitTrack Pro — UI/UX Audit & Improvement Plan

> **Audit Date:** 2026-03-26  
> **Auditor:** UI/UX Pro Max Review  
> **Scope:** All pages, components, and interaction patterns across the entire codebase.  
> **Method:** Line-level code review against 99 UX heuristics, mobile-first fitness app patterns, and Indian market expectations.  
> **Not duplicated:** Items already tracked in Phase 1–4 TODOs are excluded unless a new angle is identified.

---

## Severity Legend

| Symbol | Meaning |
|--------|---------|
| 🔴 Critical | Breaks a core user task or causes drop-off |
| 🟠 High | Significantly degrades experience |
| 🟡 Medium | Noticeable friction, clearly improvable |
| 🟢 Low | Polish, delight, nice-to-have |

---

## Section Index

1. [Global Design System](#1-global-design-system)
2. [Navigation & Information Architecture](#2-navigation--information-architecture)
3. [Dashboard Page](#3-dashboard-page)
4. [Workout Tracker](#4-workout-tracker)
5. [Splits Page](#5-splits-page)
6. [Diet Page](#6-diet-page)
7. [Progress Page](#7-progress-page)
8. [Muscle Map Page](#8-muscle-map-page)
9. [Measurements Page](#9-measurements-page)
10. [Weight Log Page](#10-weight-log-page)
11. [Profile Page](#11-profile-page)
12. [Auth Modal](#12-auth-modal)
13. [Contact Page](#13-contact-page)
14. [Charts & Data Visualization](#14-charts--data-visualization)
15. [Micro-interactions & Animation](#15-micro-interactions--animation)
16. [Mobile UX](#16-mobile-ux)
17. [Motivation & Gamification](#17-motivation--gamification)
18. [Indian Market UX](#18-indian-market-ux)
19. [Accessibility](#19-accessibility)
20. [Performance UX](#20-performance-ux)

---

## 1. Global Design System

### UX-1.1 — `var(--t3)` Overuse Creates Invisible UI 🟠

**Problem:** The faintest palette step (`--t3: #38383E` in dark, `#9E9EA6` in light) is used as the *primary* color for labels, sublabels, icons in inactive states, and secondary text across almost every page. At small font sizes (9–10px), it fails WCAG AA contrast on both themes.

**Evidence from codebase:**
- `DashboardPage.jsx` — "Sessions / Week" label, BMI box labels, Streak sub-labels all use `var(--t3)`
- `WorkoutPage.jsx` — set number (`color: 'var(--t2)'` is fine, but exercise notes use `var(--t3)`)
- `MuscleMapPage.jsx` — XP labels (partially addressed in 1.15, but other uses remain)
- `DietPage.jsx` — "BODY STATS" row sub-labels

**Fix:** Establish a 3-tier text hierarchy enforced as a design rule:
```
Primary text   → var(--tx)   (headings, key values, active labels)
Secondary text → var(--t2)   (sub-labels, supporting info)  
Tertiary text  → var(--t3)   (timestamps, de-emphasized metadata ONLY)
```
Audit every `color: 'var(--t3)'` on text < 12px and upgrade to `var(--t2)`.

**Files:** All page components — systematic audit pass.

---

### UX-1.2 — Card Border Radius Inconsistency 🟢

**Problem:** Cards use `border-radius: 24px` globally (`.card` class). But inline `card-p` uses `20px`, stat badge backgrounds use `8–10px`, modal uses `28px`, and tags use `20px`. There are 7 distinct radius values across the app with no documented scale.

**Fix:** Document and enforce a spacing/radius scale in `index.css`:
```css
/* Radius scale — add as CSS variables */
--r-xs:  6px;   /* tags, chips, set badges */
--r-sm:  10px;  /* inputs, small cards */
--r-md:  14px;  /* buttons, secondary cards */
--r-lg:  20px;  /* primary cards (card-p) */
--r-xl:  24px;  /* major cards (.card) */
--r-2xl: 28px;  /* modals, full-page overlays */
```
Then replace all hardcoded `borderRadius` values with the variable.

---

### UX-1.3 — Hover States Only on Desktop, Touch Has No Feedback 🟠

**Problem:** Interactive cards use `onMouseEnter`/`onMouseLeave` for scale/border effects but there is zero `:active` / touch feedback for mobile users. Tapping a card feels unresponsive.

**Evidence:**
- `DashboardPage.jsx` L211 — muscle activity card uses `onMouseEnter` scale only
- `WorkoutPage.jsx` — day selection cards have `onMouseEnter/Leave` hover effects
- `SplitsPage.jsx` — split cards hover only

**Fix — add to `index.css`:**
```css
/* Touch feedback for all interactive cards */
.card-interactive:active {
  transform: scale(0.98);
  opacity: 0.9;
  transition: transform .1s, opacity .1s;
}
```
Or use CSS `:active` pseudo-class directly on the card wrapper. For React inline styles, add an `onTouchStart` handler with a brief opacity change.

---

### UX-1.4 — No Page Transition Animation Consistency 🟡

**Problem:** `index.css` defines `pgIn` (slide-right) and `pgOut` (slide-left) keyframe animations. The `.pg-in` class is applied in page components but `pgOut` is never triggered — there's no coordination between route change and the outgoing page animation. Users see an abrupt cut-out followed by a slide-in.

**Fix in `App.jsx`:** Use React Router's location key to manage transition state:
```jsx
// Wrap <Routes> in an AnimationWrapper that:
// 1. On location change: applies .pg-out to the exiting page (100ms)
// 2. After 100ms: mounts the new page with .pg-in
```
Alternatively, use `react-transition-group` (no bundle cost since routing is already imported) for coordinated enter/exit.

---

### UX-1.5 — Modal Scroll Lock Missing 🟠

**Problem:** When a modal (`.mo`) is open, the page behind it can still be scrolled on iOS Safari and some Android browsers. Users accidentally scroll the background while interacting with the modal.

**Fix in `SharedComponents.jsx`:** Add scroll-lock logic to all Portal-rendered overlays:
```jsx
// In Portal or ConfirmDialog/ScrollPicker modals:
useEffect(() => {
  document.body.style.overflow = 'hidden';
  return () => { document.body.style.overflow = ''; };
}, []);
```
And on iOS Safari specifically, also set `document.body.style.position = 'fixed'` with the current scroll offset to prevent elastic bounce.

---

### UX-1.6 — No Error Boundary — Single Component Crash = Full App Crash 🔴

**Problem:** There is no React Error Boundary anywhere in the component tree. A runtime error in `BodyMapSVG.jsx` (canvas ops), `DashboardPage.jsx` (chart rendering), or any other component will unmount the entire app and show a blank white screen with no recovery path.

**Fix — add `src/components/shared/ErrorBoundary.jsx`:**
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

---

### UX-1.7 — No Unload Guard for In-Progress Workout 🔴

**Problem:** If a user accidentally taps the browser back button, a nav link, or closes the tab during an active workout session (`session !== null`), all unsaved progress is lost silently.

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

// Warn on in-app navigation (React Router v6)
// Use useBlocker hook or prompt-based approach
```
Also: the `← Back` button in the session header should trigger a `ConfirmDialog` before discarding the session, not navigate immediately.

---

## 2. Navigation & Information Architecture

### UX-2.1 — No "Today's Workout" Shortcut from Dashboard 🟠

**Problem:** The single most common user action in a fitness app is "start today's workout." The current Dashboard shows the *active split* and *recent sessions* but provides no quick-launch button to start today's scheduled workout day. Users must navigate to Tracker → find the correct day → tap Start.

**This is a 3-tap flow that should be 1 tap.**

**Fix:** In `DashboardPage.jsx`, compute today's scheduled workout day from the active split:
```js
// Today's day index relative to split start
const splitDayIdx = /* compute from workout history */ ;
const todayDay = activeSplit?.days[splitDayIdx % activeSplit.days.length];
```
Add a prominent "Today's Workout" card above the stats grid:
```jsx
<div className="card stripe" style={{ padding: '14px 18px', marginBottom: 14, cursor: 'pointer' }}
  onClick={() => navigate('/workout')}>
  <div style={{ fontSize: 10, color: 'var(--t3)', fontWeight: 700, textTransform: 'uppercase' }}>
    Today's Plan
  </div>
  <div className="bb" style={{ fontSize: 22, color: 'var(--o)' }}>{todayDay.name}</div>
  <div style={{ fontSize: 12, color: 'var(--t2)' }}>{todayDay.exercises.length} exercises</div>
  <button className="btn-p" style={{ marginTop: 10, padding: '10px 20px', fontSize: 13 }}>
    Start Workout →
  </button>
</div>
```

---

### UX-2.2 — Sidebar Collapse Has No Persistent Memory 🟡

**Problem:** `Layout.jsx` initializes `const [sb, setSb] = useState(true)` — the sidebar always opens expanded on every page load. If a user on a small laptop collapses it to gain screen space, it's re-expanded on the next visit.

**Fix in `Layout.jsx`:** Persist sidebar state to `localStorage`:
```jsx
const [sb, setSb] = useLocalStorage('fittrack_sidebar_collapsed', true);
```

---

### UX-2.3 — Breadcrumbs Missing on Data-Heavy Pages 🟡

**Problem:** On `ProgressPage.jsx`, the user selects Split → Day → Exercise through 3 dropdowns. There's no indication of the current selection context at the top of the page. On mobile, the dropdowns are stacked and the last selection scrolls out of view.

**Fix:** Add a compact "breadcrumb trail" above the charts:
```
Push Pull Legs  ›  Pull Day A  ›  Deadlift
```
Each segment is a clickable chip that clears downstream selections.

---

### UX-2.4 — "More" Sheet Animation is Instant — No Slide-Up 🟡

**Problem:** `BottomNav.jsx` renders the "More" sheet by toggling `showMore` state — it appears/disappears instantly with no animation. The rest of the app has smooth transitions; this jarring pop is inconsistent.

**Fix in `Layout.jsx` (BottomNav section):**
```css
/* index.css */
@keyframes sheetUp {
  from { transform: translateY(100%); opacity: 0; }
  to   { transform: translateY(0); opacity: 1; }
}
.sheet-up { animation: sheetUp .22s cubic-bezier(.4,0,.2,1) forwards; }
```
Apply `className="sheet-up"` to the More sheet div.

---

### UX-2.5 — No Active Route Indication in "More" Sheet Items 🟡

**Problem:** `NAV_MOBILE_MORE` items inside the "More" sheet do use `isActive(path)` to apply `.act` class, which adds an orange background. But when the current page is from `NAV_MOBILE_MORE` (e.g., Muscle Map), the "More" button in the bottom nav shows no active state — the user has no indication which section they're in.

**Fix in `Layout.jsx` (BottomNav):**
```jsx
const moreActive = NAV_MOBILE_MORE.some(n => isActive(n.path));
// Already computed as moreActive — but the button color isn't applied:
// Change: color: showMore || moreActive ? 'var(--o)' : 'var(--t3)'
// This is already there in code but verify the "More" label also turns orange
```
Additionally, add a subtle orange dot indicator below the "More" icon when `moreActive` is true but `showMore` is false.

---

## 3. Dashboard Page

### UX-3.1 — No Time-Aware Greeting 🟢

**Problem:** Dashboard always shows `"Hey, {firstName}"` regardless of time. Indian users respond well to time-aware greetings — it adds warmth and makes the app feel alive.

**Fix in `DashboardPage.jsx`:**
```jsx
const hour = new Date().getHours();
const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';
// PageHeader title: `${greeting}, ${user.name.split(' ')[0]} 👋`
```

---

### UX-3.2 — BMI Card is a Number Without Visual Context 🟡

**Problem:** The BMI card shows a large number (`24.3`) and a category tag (`Normal`). There's no visual scale showing where 24.3 sits relative to the 18.5–25 normal range. Users don't intuitively know if they're near the top or bottom of "Normal."

**Fix:** Add a mini horizontal range indicator below the BMI number:
```jsx
// A 4-segment colored bar: [Underweight|Normal|Overweight|Obese]
// With a triangle marker positioned at the user's BMI value
// Total range: 10–40, marker at current BMI
const bmiPct = ((bmi - 10) / 30) * 100;
```
Keep it small (height: 6px, full width of card) below the category tag.

---

### UX-3.3 — Streak Display Has No Visual Calendar 🟡

**Problem:** The streak card shows "7 days / Best: 12 days" as numbers. HealthifyMe, Nike Run, and Fitbit all show a mini 7-day or 30-day calendar strip to make the streak *visually satisfying*. A number alone doesn't create the "don't break the chain" motivation that a visual gap would.

**Fix:** Add a 7-day mini strip below the streak numbers in `DashboardPage.jsx`:
```jsx
// Last 7 days — fill circle if workout logged that day
const last7 = Array.from({ length: 7 }, (_, i) => {
  const d = new Date();
  d.setDate(d.getDate() - (6 - i));
  const dateStr = d.toISOString().split('T')[0];
  const trained = userWo.some(l => l.date === dateStr);
  return { day: d.toLocaleDateString('en-IN', { weekday: 'narrow' }), trained };
});
// Render as 7 circles: filled orange = trained, grey outline = missed
```

---

### UX-3.4 — Goal Progress Card Has No "On Track" Indicator 🟡

**Problem:** The goal card shows target weight, kg remaining, and a progress bar — but gives no indication of whether the user is *on track* to hit the goal by the deadline. A user 60% done with 80% of the timeline elapsed is behind schedule.

**Fix in `DashboardPage.jsx`:**
```js
const timeElapsedPct = user.goalSetDate && user.goalWeeks
  ? Math.min(100, ((new Date() - new Date(user.goalSetDate)) / (user.goalWeeks * 7 * 86400000)) * 100)
  : 0;
const isOnTrack = goalPct >= timeElapsedPct - 5; // 5% tolerance
```
Show a badge: `"✓ On Track"` (green) or `"⚠ Falling Behind"` (amber) next to the progress bar.

---

### UX-3.5 — Recent Sessions Shows No Volume or Muscle Info 🟡

**Problem:** Recent sessions in `DashboardPage.jsx` only show workout day name, date, and exercise count. A user seeing "Push Day A · 6 exercises" has no data about how they actually performed.

**Fix:** Add total volume and primary muscles to each recent session row:
```jsx
const volume = w.exercises?.reduce((s, ex) =>
  s + ex.sets.reduce((a, set) => a + (set.reps || 0) * (set.weight || 0), 0), 0);
// Show: "Push Day A · 6 ex · 4,200 kg vol"
```

---

### UX-3.6 — Weight Trend Chart Has No Annotations 🟡

**Problem:** The weight trend `AreaChart` in Dashboard has a reference line for goal weight but no markers for highest/lowest recorded weight, or for when the goal was set.

**Fix:** Add two `ReferenceLine` elements to the Recharts `AreaChart`:
```jsx
const maxWeight = Math.max(...chartData.map(d => d.weight));
const minWeight = Math.min(...chartData.map(d => d.weight));
// <ReferenceLine y={maxWeight} stroke="var(--danger)" strokeDasharray="4 4"
//   label={{ value: `High: ${maxWeight}kg`, fill: 'var(--danger)', fontSize: 9 }} />
```

---

## 4. Workout Tracker

### UX-4.1 — Rest Timer Blocks Full Screen — Can't See Exercise Notes 🟠

**Problem:** `RestTimer` in `WorkoutPage.jsx` renders as a full-screen `position: fixed` overlay with a blurred backdrop. While resting, users cannot see the next exercise, their notes, or the weight from their last set. This is the opposite of what a gym user needs — they often check the next exercise during rest.

**Fix:** Make the rest timer a **non-blocking bottom bar** instead of a full overlay:
```jsx
// Instead of a Portal overlay, render as a fixed bottom notification bar:
<div style={{
  position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 400,
  background: 'var(--c1)', borderTop: '2px solid var(--o)',
  padding: '10px 20px',
  display: 'flex', alignItems: 'center', gap: 16,
}}>
  {/* Circular progress ring (small, 40px) */}
  {/* MM:SS countdown */}
  {/* "Skip" button */}
</div>
```
The page remains fully scrollable during rest. This matches how strong apps like Strong App and Hevy handle rest timers.

---

### UX-4.2 — No Progressive Overload Suggestion 🟠

**Problem:** When starting a workout, the previous session's weights are pre-loaded as defaults. But there is no suggestion to increase weight — the app is purely a logger, not a coach.

Progressive overload is the #1 mechanism for muscle growth and is a top differentiator for fitness apps in India (HealthifyMe's AI coach, for example, does this).

**Fix in `WorkoutPage.jsx`'s `start()` function:**
```js
// Detect if previous set hit the top of the rep range
const prevTopOfRange = pe?.sets?.every(s => s.reps >= parseInt(ex.repsRange?.split('-')[1] || 99));
const suggestedWeight = prevTopOfRange
  ? (pe.sets[0]?.weight || 0) + 2.5  // suggest +2.5kg
  : pe?.sets?.[i]?.weight || 0;
```
Show a subtle orange dot or `"+2.5 kg?"` chip next to the weight input for the first set only.

---

### UX-4.3 — No Workout Duration Timer 🟡

**Problem:** The active session has no elapsed time counter. Users frequently want to track how long their workout is taking — both to manage gym time and for progress tracking over sessions.

**Fix in `WorkoutPage.jsx`:**
```jsx
const startTimeRef = useRef(Date.now());
const [elapsed, setElapsed] = useState(0);
useEffect(() => {
  if (!session) return;
  const interval = setInterval(() => {
    setElapsed(Math.floor((Date.now() - startTimeRef.current) / 1000));
  }, 1000);
  return () => clearInterval(interval);
}, [!!session]);

// Display in session header:
const mins = Math.floor(elapsed / 60);
const secs = elapsed % 60;
// "⏱ 24:07" shown next to the day name
```
Also save `duration` in the workout log for display in history.

---

### UX-4.4 — No PR Detection & Celebration Mid-Workout 🟡

**Problem:** When a user logs a new personal record (weight × reps > all previous sessions), nothing happens. This is one of the highest-motivation moments in any workout and the app misses it entirely.

**Fix in `WorkoutPage.jsx`'s `upd()` function:**
```js
// After marking a set as done, check against all-time best
const currentBest = best1RMFromSets(
  workoutLogs.filter(l => l.dayId === session.day.id)
    .flatMap(l => l.exercises?.find(e => e.name === ex.name)?.sets || [])
);
const thisEst1RM = calc1RM(s.weight, s.reps);
if (thisEst1RM > currentBest) {
  addToast(`🏆 New PR on ${ex.name}! Est. 1RM: ${thisEst1RM} kg`, 'success', 4000);
}
```

---

### UX-4.5 — Previous Session Data Invisible During Current Session 🟠

**Problem:** When logging sets, users have no reference to what they did last time for the same exercise. The weight defaults are pre-filled (when available) but the previous session's full set list (reps × weight for each set) is not visible. In a real gym session, you'd look back at your log book.

**Fix:** Add a collapsible "Last Session" row beneath each exercise header:
```jsx
{pe && (
  <div style={{ marginBottom: 8, padding: '6px 10px', background: 'var(--c2)',
    borderRadius: 8, border: '1px solid var(--bd)', fontSize: 11 }}>
    <span style={{ color: 'var(--t3)', fontWeight: 700 }}>LAST TIME ({fmt(prevLog.date)}): </span>
    {pe.sets.map((s, i) => (
      <span key={i} style={{ color: 'var(--t2)', marginRight: 8 }}>
        {s.reps}r × {s.weight}kg
      </span>
    ))}
  </div>
)}
```

---

### UX-4.6 — "Finish Workout" Requires All Exercises — No Partial Save 🟠

**Problem:** The `finish()` function in `WorkoutPage.jsx` filters to `ex.sets.filter(s => s.done)` — exercises with zero completed sets are silently dropped. But there's no UI warning. A user who forgets to check their sets will have exercises disappear from the log without realising.

Additionally, if a user completes 3/5 exercises and needs to leave the gym early, they should be able to log the partial session.

**Fix:**
- Count unchecked sets before `finish()` is called
- Show a confirmation: `"You have 3 unchecked sets. Save partial session?"` with options: "Save Partial" / "Keep Editing"
- The partial session saves normally — the filter already handles it, just make it explicit

---

### UX-4.7 — Set Rows Have No Visual Separation at Scale 🟡

**Problem:** With 4+ sets per exercise and 6+ exercises per session, the set rows blur together. There's no visual grouping between exercises on small screens. The `card` per exercise helps but inside the card, sets have only a `marginBottom: 5` between them.

**Fix:** Alternate set row backgrounds for easier scanning:
```jsx
// In WorkoutPage.jsx set map:
background: si % 2 === 0 ? 'transparent' : 'rgba(255,255,255,.015)'
```
Or add a stronger left border on done sets:
```jsx
borderLeft: s.done ? '3px solid var(--o)' : '3px solid transparent'
```

---

## 5. Splits Page

### UX-5.1 — Expand State Not Persisted — Collapses on Every Navigation 🟡

**Problem:** `SplitsPage.jsx` uses `const [exp, setExp] = useState(null)` — all splits collapse when navigating away and returning. If a user is comparing exercises across two splits, they must re-expand both each time.

**Fix:** Persist `exp` (expanded split ID) in `sessionStorage` (not localStorage — reset on close is fine here):
```jsx
const [exp, setExp] = useState(() => sessionStorage.getItem('splits_exp') || null);
const setExpPersist = (id) => {
  setExp(id);
  if (id) sessionStorage.setItem('splits_exp', id);
  else sessionStorage.removeItem('splits_exp');
};
```

---

### UX-5.2 — No Estimated Workout Duration Per Day 🟡

**Problem:** A split day shows a list of exercises with sets × reps but no time estimate. Indian gym-goers are increasingly time-pressed (lunch-break workouts, pre-office sessions) and want to know if today's workout is 45 minutes or 75 minutes before starting.

**Fix in `SplitsPage.jsx` and `WorkoutPage.jsx` day cards:**
```js
// Estimate: ~3 min per set (work + rest)
const estimateMins = (day) => Math.round(
  day.exercises.reduce((s, ex) => s + ex.sets * 3, 0) / 5
) * 5; // round to nearest 5 mins
// Show: "~55 min" next to exercise count
```

---

### UX-5.3 — "Coming Soon" Split Wastes Prime Real Estate 🟡

**Problem:** The Powerlifting `comingSoon: true` split card appears in the list with the same visual weight as usable splits. On mobile, it takes up a full card height. Users who tap it are met with a dead card.

**Fix:** Render `comingSoon` splits as a compact horizontal banner at the bottom of the list, not a full card:
```jsx
{splits.filter(s => s.comingSoon).map(split => (
  <div key={split.id} style={{ padding: '10px 16px', background: 'var(--c2)',
    borderRadius: 12, border: '1px dashed var(--bd)', display: 'flex',
    alignItems: 'center', gap: 10, marginBottom: 8 }}>
    <span style={{ fontSize: 12, color: 'var(--t2)' }}>{split.name}</span>
    <span className="tag-d" style={{ fontSize: 9, marginLeft: 'auto' }}>Coming Soon</span>
  </div>
))}
```

---

### UX-5.4 — No Muscle Coverage Summary Per Split 🟡

**Problem:** Users choosing between splits (e.g., PPL vs Upper-Lower) have no quick way to see which muscle groups each covers. They must mentally scan all exercise lists.

**Fix:** Add a mini muscle coverage bar below each split description, showing which of the 12 muscle groups are targeted and how many times per week:
```jsx
// Compute covered muscles from split.days exercises via getMusclesForExercise
// Show as a row of colored dots or tiny labels: chest ● back ● shoulders ● ...
```

---

## 6. Diet Page

### UX-6.1 — Diet Type Selector Looks Like Tags, Not a Radio Group 🟠

**Problem:** The 4 diet type buttons (Vegan / Vegetarian / Egg / Non-Veg) are plain `<button>` elements styled like nav items. The selected state (orange bg + text) is not distinct enough from hover. Users can mistake these for filtering chips rather than a mutually-exclusive selection.

**Fix:** Redesign as segmented control with clear active indicator:
```jsx
// Replace individual buttons with a pill segmented control:
<div style={{
  display: 'flex', background: 'var(--c2)', borderRadius: 14,
  padding: 4, gap: 2, marginBottom: 14
}}>
  {Object.values(DIET_TYPES).map(d => (
    <button key={d.id} onClick={() => setDiet(d.id)} style={{
      flex: 1, padding: '9px 8px', borderRadius: 10, border: 'none',
      background: diet === d.id ? 'var(--o)' : 'transparent',
      color: diet === d.id ? '#fff' : 'var(--t2)',
      transition: 'all .2s', fontSize: 12, fontWeight: 600,
    }}>
      {d.icon} {d.label}
    </button>
  ))}
</div>
```

---

### UX-6.2 — Meal Cards Show Hardcoded Sample Macros, Not User-Scaled Values 🟠

**Problem:** Each meal card in `DietPage.jsx` shows macros like `P: 38g C: 52g F: 14g` sourced from `meal.macros` in `diets.js`. These are hardcoded reference values for a ~75kg person. A 95kg user and a 55kg user see the *exact same macro numbers* on every meal card, which is factually misleading.

**Fix:** Scale displayed meal macros by the ratio of the user's target calories to the reference plan:
```js
// In DietPage.jsx meal render:
const scaleFactor = goalKcal / 2100; // 2100 is the approximate base plan kcal
const scaledMacros = {
  p: Math.round(meal.macros.p * scaleFactor),
  c: Math.round(meal.macros.c * scaleFactor),
  f: Math.round(meal.macros.f * scaleFactor),
};
```
Display scaled values with a tiny `"(scaled)"` note for transparency.

---

### UX-6.3 — No Meal Timing Guidance 🟡

**Problem:** The diet plan lists meals as Breakfast / Mid-Morning / Lunch / Pre-Workout / Post-Workout Dinner / Before Bed but provides no suggested times. Indian users following structured diet plans need specific timing (e.g., "Pre-Workout: 45–60 min before training").

**Fix:** Add optional timing guidance to each `mk()` entry in `diets.js`:
```js
mk('Pre-Workout', '...', { timing: '45–60 min before training' }, ...)
mk('Post-Workout Dinner', '...', { timing: 'Within 30 min post-training' }, ...)
```
Display as a small time chip in the meal card header.

---

### UX-6.4 — Calorie Log Has No Edit or Delete 🟡

**Problem:** `DietPage.jsx` renders today's calorie entries as read-only tag chips. If a user logs `"Breakfast: 800 kcal"` by mistake, there's no way to edit or remove the entry without navigating to the storage layer.

**Fix:** Make the calorie entry chips tappable — long-press or tap opens a delete confirm:
```jsx
{todayCals.map(l => (
  <div key={l.id} style={{ /* existing chip styles */ }}
    onClick={() => {
      if (window.confirm(`Remove ${l.meal} (${l.calories} kcal)?`)) {
        setCaloriesLog(p => p.filter(e => e.id !== l.id));
      }
    }}>
    {l.meal}: {l.calories}kcal ✕
  </div>
))}
```
Or better: tap opens a `ConfirmDialog` using the existing component.

---

### UX-6.5 — "Best Protein Sources" Section Has No Quantities 🟢

**Problem:** The protein sources tag cloud at the bottom of `DietPage.jsx` lists items like "Tofu", "Rajma", "Chicken Breast" with no quantities. Users want to know: how much paneer = 30g protein?

**Fix:** Replace tag cloud with a structured mini-table or expandable list:
```
Paneer (100g)     → 18g protein
Chicken Breast (100g) → 31g protein
Rajma, cooked (1 cup) → 15g protein
```
This is extremely high-value for Indian users who are actively building meal plans.

---

## 7. Progress Page

### UX-7.1 — 3-Dropdown Selection is High Friction 🟠

**Problem:** `ProgressPage.jsx` requires users to select: (1) Split, (2) Day, (3) Exercise — then charts appear. This is a 3-step selection with no intelligent defaults. First-time visitors see an empty state with `"Select an exercise"` and three blank dropdowns.

**Fix:** Apply intelligent defaults on mount:
```js
// Auto-select active split, most-trained day, most-frequently logged exercise
const defaultSplit = splits.find(s => s.id === user.activeSplitId) || splits[0];
const defaultDay = defaultSplit?.days.filter(d => d.type !== 'rest')[0];
const topExercise = /* find exercise with most logs in this day */;
// Pre-fill se, sd, ss to these defaults
```
Users land on a page with charts already populated for their top exercise, not a blank state.

---

### UX-7.2 — All 4 Charts Are Always Visible — Information Overload 🟡

**Problem:** The 2×2 chart grid (max weight, volume, avg reps, est. 1RM) shows all 4 charts simultaneously. On mobile, this is 4 full-width charts stacked vertically — a lot of scrolling for information that partially overlaps (volume and weight are correlated).

**Fix:** Introduce a tab strip above the charts:
```
[Weight] [Volume] [Reps] [1RM]
```
Each tab shows one full-width chart. The most important metric (weight or 1RM) is active by default. This also gives each chart more vertical height on mobile, improving readability.

---

### UX-7.3 — No Comparison Mode 🟡

**Problem:** There's no way to compare this month's performance against last month, or this week vs. last week, on any chart. Indian gym users who track "gainz" want to see periodic comparisons.

**Fix:** Add a "Compare" toggle in the chart controls:
```jsx
const [compareMode, setCompareMode] = useState(false);
// When active, fetch data for the same exercise from the previous month/period
// Render as a second dotted line on the chart (Recharts supports multiple <Line> components)
// Color: orange for current period, var(--t2) for comparison period
```

---

### UX-7.4 — PR Badge Not Displayed 🟡

**Problem:** The `StatCard` for "Personal Record" on `ProgressPage.jsx` shows the max weight but there's no celebratory framing. It looks like any other stat — no date context, no delta from first session.

**Fix:** Add contextual PR enrichment:
- Show the date the PR was set: "80 kg (set Mar 14)"
- Show the improvement from first session: `"▲ +22.5 kg from first session"`

---

## 8. Muscle Map Page

### UX-8.1 — Canvas Takes 2–3 Seconds to Render With No Indicator 🟠

**Problem:** `BodyMapSVG.jsx` uses `Promise.all` to load base + muscle layer images and then runs canvas compositing. On the first load (no browser cache), this takes 2–3 seconds during which the canvas element shows nothing — not even a loading indicator. Users think the component failed.

**Fix in `CanvasBodyMap`:**
```jsx
const [loading, setLoading] = useState(true);

// Show skeleton while loading:
if (loading) return (
  <div style={{ width: '100%', paddingBottom: '200%', background: 'var(--c3)',
    borderRadius: 8, animation: 'skPulse 1.8s ease-in-out infinite' }} />
);
```
Set `loading = false` after `Promise.all` resolves and canvas is drawn.

---

### UX-8.2 — No "Weakest Muscle" Callout 🟡

**Problem:** The muscle cards are sorted by XP (highest first). The *lowest* ranked muscles — the ones the user most needs to address — are at the bottom of a long scroll. There's no proactive coaching nudge.

**Fix:** Add a "Needs Attention" section at the top of the muscle cards list:
```jsx
const weakestMuscles = MUSCLE_GROUPS
  .sort((a, b) => (muscleXP[a.key] || 0) - (muscleXP[b.key] || 0))
  .slice(0, 2);

// Render before the filter tabs:
<div className="card" style={{ padding: '12px 16px', marginBottom: 14,
  borderLeft: '3px solid var(--danger)', borderRadius: '0 14px 14px 0' }}>
  <div style={{ fontSize: 11, color: 'var(--t3)', fontWeight: 700 }}>
    NEEDS ATTENTION THIS MONTH
  </div>
  {weakestMuscles.map(m => (
    <span key={m.key} style={{ /* orange chip */ }}>{m.label}</span>
  ))}
</div>
```

---

### UX-8.3 — No Per-Muscle Historical Trend 🟡

**Problem:** Each `MuscleCard` shows current XP and rank, but no trend — is chest getting stronger or declining? Has shoulder XP increased since last month? This context would make the muscle map feel alive and dynamic.

**Fix:** Add a tiny sparkline (3–4 week trend) or a directional indicator on each `MuscleCard`:
```jsx
// Compare current month XP vs previous month XP for this muscle
const prevMonthXP = calcMuscleXPForMonth(workoutLogs, splits, userId, prevMonth);
const delta = (muscleXP[muscle.key] || 0) - (prevMonthXP[muscle.key] || 0);
// Show: ▲ +1,200 XP (green) or ▼ -400 XP (red) next to rank badge
```

---

### UX-8.4 — Rank Tier Legend is Visually Flat 🟢

**Problem:** The rank tier legend on `MuscleMapPage.jsx` is a flat tag cloud of all 14 tiers side by side. It gives no sense of the progression ladder — Bronze feels visually equivalent to Legend.

**Fix:** Display tiers as a vertical progression pyramid or a horizontal staircase where each tier is slightly larger/brighter than the previous, communicating ascending difficulty and prestige.

---

## 9. Measurements Page

### UX-9.1 — No Body Composition Estimate 🟡

**Problem:** `MeasurementsPage.jsx` collects chest, waist, hips, biceps, thighs, and neck measurements but never synthesizes them into a body composition estimate. Navy Method body fat percentage can be calculated from neck + waist (+ hips for women) measurements already logged.

**Fix — add to `calculations.js`:**
```js
// US Navy Body Fat Formula
export const calcBodyFat = (gender, waist, neck, height, hips = 0) => {
  if (gender === 'male')
    return (495 / (1.0324 - 0.19077 * Math.log10(waist - neck) + 0.15456 * Math.log10(height))) - 450;
  else
    return (495 / (1.29579 - 0.35004 * Math.log10(waist + hips - neck) + 0.22100 * Math.log10(height))) - 450;
};
```
Display as an additional stat card: `"Est. Body Fat: 18.3%"` with a category label (Essential / Athletic / Fitness / Average / Obese).

---

### UX-9.2 — Measurement Form Has No Reference Guide 🟡

**Problem:** `MeasurementsPage.jsx`'s add-measurement modal shows inputs for chest, waist, hips etc. but no guide on *where exactly to measure*. For inconsistent measurement spots, the trend data becomes meaningless. (e.g., waist at navel vs. narrowest point gives 5–8cm difference)

**Fix:** Add a small "?" icon next to each measurement label. Tapping it shows a 1-line guide:
```
Chest  ℹ → "At nipple line, arms relaxed"
Waist  ℹ → "At narrowest point, after exhale"
Hips   ℹ → "At widest point of glutes"
Bicep  ℹ → "Peak of flexed bicep, arm at 90°"
```

---

### UX-9.3 — Single-Metric Chart Requires Separate Tap to Switch 🟡

**Problem:** The measurements chart shows one metric at a time, selected by tapping the stat cards above. But there's no keyboard/swipe navigation between metrics — users must scroll up, tap a different card, then scroll back down to the chart.

**Fix:** Add left/right navigation arrows on the chart header:
```jsx
const fieldKeys = MEASUREMENT_FIELDS.map(f => f.key);
const currentIdx = fieldKeys.indexOf(chartField);
// ← Previous metric | "Chest Over Time" | Next metric →
```

---

## 10. Weight Log Page

### UX-10.1 — No Weight Entry Graph on the Log Page Itself 🟡

**Problem:** `WeightLogPage.jsx` shows a table of entries but no chart. The weight trend chart lives only on the Dashboard. Users who navigate to the weight log page to review their history have no visual overview — just a raw table.

**Fix:** Add a compact `AreaChart` at the top of `WeightLogPage.jsx` (similar to the Dashboard chart but scrollable for the full history, not just recent entries). Use the existing `chartData` computation pattern from `DashboardPage.jsx`.

---

### UX-10.2 — Weight Delta Color Logic is Backwards for Weight-Loss Goals 🟡

**Problem:** `WeightLogPage.jsx` L73 colors positive weight delta red and negative delta green regardless of the user's goal. But for a user in a bulk (gain goal), gaining 0.3kg is green, not red. The current logic assumes everyone wants to lose weight.

**Fix:**
```js
// Derive from user.weightGoal
const isGainGoal = user.weightGoal > user.weight;
const deltaColor = isGainGoal
  ? (parseFloat(diff) > 0 ? 'var(--success)' : 'var(--danger)')
  : (parseFloat(diff) < 0 ? 'var(--success)' : 'var(--danger)');
```

---

## 11. Profile Page

### UX-11.1 — Password Stored in Plain Text in localStorage 🔴

**Problem:** `AuthModal.jsx` stores `password: f.password` directly in the `users` array in localStorage with no hashing or encryption. `INIT_USERS` in `sample.js` has `password: 'admin123'` in plain text. Anyone with access to the browser's DevTools can read all passwords.

**Note:** This is client-side only with no backend, so the risk surface is limited. But it's still bad practice and a UX trust issue if users believe their data is secure.

**Fix:** Hash passwords client-side before storage using the Web Crypto API:
```js
const hashPassword = async (password) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0')).join('');
};
```
Store `passwordHash` instead of `password`. Update login comparison to hash the input and compare.

---

### UX-11.2 — Profile Edit Has No "Cancel" to Discard Changes 🟡

**Problem:** `ProfilePage.jsx` has an Edit/Save toggle button. In edit mode, all form fields are live. But if a user accidentally taps "Edit", starts changing fields, and wants to discard — there's no Cancel button. The only option is to manually re-enter original values.

**Fix:** In edit mode, show both "✓ Save" and "✕ Cancel" buttons. Cancel restores `f` to the current `user` object:
```jsx
{ed && (
  <button className="btn-g" style={{ fontSize: 12 }}
    onClick={() => { setF({ ...user }); setEd(false); }}>
    ✕ Cancel
  </button>
)}
```

---

### UX-11.3 — No "Joined X Days Ago" Relative Context 🟢

**Problem:** Profile shows `"Since 15 Jan"` for join date. This is correct but less motivating than `"Member for 72 days"` which creates a sense of commitment and investment.

**Fix:** Compute relative days and show both:
```js
const daysSince = Math.floor((new Date() - new Date(user.joinDate)) / 86400000);
// "Since 15 Jan · 72 days"
```

---

### UX-11.4 — Export/Import Buttons Have No Visual Feedback 🟡

**Problem:** `ProfilePage.jsx`'s Export button immediately triggers a file download with a toast `"Data exported!"`. The Import button opens a file picker. Neither button has a loading/processing state. On slow connections or large data files, the Export JSON can hang with no indicator.

**Fix:** Add brief loading state to both buttons:
```jsx
const [exporting, setExporting] = useState(false);
const handleExport = async () => {
  setExporting(true);
  await new Promise(r => setTimeout(r, 100)); // allow render
  exportData();
  setExporting(false);
  addToast('Data exported!', 'success');
};
// Button: {exporting ? 'Exporting...' : <><Download size={12} /> Export</>}
```

---

## 12. Auth Modal

### UX-12.1 — No "Try Demo" One-Click Button 🟡

**Problem:** The demo credentials `vishal@fittrack.com / admin123` are shown as plain text at the bottom of the login form. Users must manually read and type (or copy-paste) these credentials. A single "Try Demo →" button would immediately improve first-impression conversion.

**Fix in `AuthModal.jsx`:**
```jsx
{mode === 'login' && (
  <button className="btn-g" style={{ width: '100%', padding: '11px', marginBottom: 4 }}
    onClick={() => {
      setF(prev => ({ ...prev, email: 'vishal@fittrack.com', password: 'admin123' }));
      // Slight delay so user sees the form fill, then auto-submit:
      setTimeout(handleLogin, 400);
    }}>
    ⚡ Try Demo Account
  </button>
)}
```

---

### UX-12.2 — Registration Has No Password Strength Indicator 🟡

**Problem:** The registration form has an eye toggle but no password strength feedback. Users creating accounts have no guidance on what makes a strong password.

**Fix:** Add a 3-step strength bar below the password field during registration:
```jsx
const strength = !f.password ? 0 : f.password.length < 6 ? 1 : f.password.length < 10 ? 2 : 3;
const colors = ['transparent', 'var(--danger)', '#FFE66D', 'var(--success)'];
const labels = ['', 'Weak', 'OK', 'Strong'];
// 3 small segments: filled in color up to 'strength' index
```

---

### UX-12.3 — Email Validation Only Runs on Submit 🟡

**Problem:** In `AuthModal.jsx`, validation (`if (!f.name || !f.email || !f.password) return setErr(...)`) only runs when the submit button is clicked. Invalid email formats (e.g., `"vishalgmail.com"`) get through to `setErr` at the bottom without inline field-level feedback.

**Fix:** Add a simple regex validation on the email field's `onBlur`:
```jsx
const [emailErr, setEmailErr] = useState('');
// On blur:
if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) setEmailErr('Invalid email');
else setEmailErr('');
// Render: {emailErr && <div style={{ fontSize: 11, color: 'var(--danger)' }}>{emailErr}</div>}
```

---

## 13. Contact Page

### UX-13.1 — No WhatsApp Integration 🟠

**Problem:** `ContactPage.jsx` uses `mailto:` to send a pre-filled email. In India, WhatsApp is the dominant channel for business inquiries, coaching sign-ups, and support. Requiring email significantly reduces conversion for Indian users.

**Fix:** Add a WhatsApp CTA button alongside the email form submit:
```jsx
const whatsappMsg = encodeURIComponent(
  `Hi Vishal! I'm interested in the ${SVCS.find(s=>s.id===f.service)?.label}.\n` +
  `Name: ${f.name}\nGoal: ${f.goal || 'Not specified'}`
);
<a
  href={`https://wa.me/919876543210?text=${whatsappMsg}`}
  target="_blank" rel="noopener noreferrer"
  className="btn-p"
  style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '13px 26px' }}
>
  <svg /* WhatsApp SVG icon */ /> Message on WhatsApp
</a>
```
This should be the *primary* CTA; "Send Email" becomes secondary.

---

### UX-13.2 — Pricing Cards Show No Billing Frequency 🟡

**Problem:** Service cards show `₹2,000` / `₹3,000` / `₹4,500` with no indication if this is per month, one-time, or per session. For coaching, this ambiguity prevents decisions.

**Fix:** Add billing context to each service card:
```js
const SVCS = [
  { id: 'workout', label: 'Custom Workout Plan', price: '₹2,000', billing: 'one-time' },
  { id: 'coaching', label: 'Online Coaching', price: 'From ₹5,000', billing: 'per month' },
  ...
];
// Show: "₹2,000 / one-time" or "₹5,000 / month"
```

---

## 14. Charts & Data Visualization

### UX-14.1 — All Charts Use the Same Orange — No Semantic Color 🟡

**Problem:** Every Recharts chart across the app uses `stroke="#E8540D"` and `fill="url(#wg)"` (the orange gradient). There's no semantic distinction between chart types. A weight loss chart (where going down is good) uses the same color as a PR progress chart (where going up is good).

**Fix — introduce chart color semantics:**
```js
const CHART_COLORS = {
  weight:    '#E8540D',  // orange — neutral body metric
  strength:  '#4ECDC4',  // teal — strength/performance
  volume:    '#FFE66D',  // yellow — effort/volume
  recovery:  '#51CF66',  // green — recovery/rest metrics
};
```
Apply per chart type across `DashboardPage.jsx`, `ProgressPage.jsx`, `MeasurementsPage.jsx`.

---

### UX-14.2 — Chart X-Axis Dates Truncate Poorly on Mobile 🟡

**Problem:** Recharts `XAxis` with `dataKey="date"` renders formatted date strings like "14 Mar" on every data point. With 30+ entries, these overlap and become illegible on mobile screens. The `interval="preserveStartEnd"` setting only preserves the first and last tick.

**Fix:** Add dynamic interval based on data length:
```jsx
<XAxis
  dataKey="date"
  tick={{ fill: 'var(--t3)', fontSize: 9 }}
  interval={Math.max(0, Math.floor(chartData.length / 6) - 1)}
  // Shows ~6 labels regardless of data length
/>
```

---

### UX-14.3 — No "No Data" State Inside Charts 🟡

**Problem:** If `chartData` has only 1 entry, Recharts renders a single dot with no line. The chart area appears blank or broken. There's no message explaining why.

**Fix:** Wrap every chart in a conditional:
```jsx
{chartData.length < 2 ? (
  <div style={{ height: 170, display: 'flex', alignItems: 'center',
    justifyContent: 'center', color: 'var(--t3)', fontSize: 12 }}>
    Log at least 2 entries to see the trend
  </div>
) : (
  <ResponsiveContainer>...</ResponsiveContainer>
)}
```

---

### UX-14.4 — Tooltip Font & Styling Slightly Off-Brand 🟢

**Problem:** All charts use:
```js
contentStyle={{ background: 'var(--c2)', border: '1px solid var(--bd)', borderRadius: 10, fontSize: 12 }}
```
This is good but the default Recharts tooltip cursor (a thin vertical line) is the default grey, not orange. Minor but noticeable.

**Fix:**
```jsx
<Tooltip cursor={{ stroke: 'var(--o)', strokeWidth: 1, strokeDasharray: '4 4' }} ... />
```

---

## 15. Micro-interactions & Animation

### UX-15.1 — No Skeleton for Chart Loading 🟡

**Problem:** Charts in `DashboardPage.jsx` and `ProgressPage.jsx` load synchronously — they appear instantly. But if data computation is expensive (many workout logs), there's a visible layout jump as charts render. There's also no feedback during the 300ms artificial delay on the Dashboard.

**Fix:** Wrap chart containers in conditional skeleton during `!loaded` state:
```jsx
{!loaded ? (
  <Skeleton height={170} style={{ marginTop: 8 }} />
) : (
  <ResponsiveContainer>...</ResponsiveContainer>
)}
```

---

### UX-15.2 — Button Active States Use Only Opacity — No Transform Feedback 🟡

**Problem:** `.btn-p:active` in `index.css` sets `opacity: .95` and `transform: translateY(0)` (cancels the hover lift). The physical "press" sensation is subtle. Mobile users get essentially no tactile confirmation.

**Fix in `index.css`:**
```css
.btn-p:active {
  transform: scale(0.96);  /* slight shrink = press feel */
  opacity: .95;
  box-shadow: 0 1px 4px rgba(232,84,13,.15);
}
```
`scale(0.96)` on a 44px+ touch target is imperceptible as a layout shift but very satisfying as press feedback.

---

### UX-15.3 — Toast Notifications Lack Icon Personality 🟢

**Problem:** `ToastContainer` in `SharedComponents.jsx` uses a small circle with `✓`, `✕`, or `ℹ` inside. These are functional but generic. The app has a strong fitness identity that isn't reflected in notifications.

**Fix:** Replace text icons with Lucide icons for each toast type:
```jsx
const icons = {
  success: <CheckCircle size={16} />,
  error:   <XCircle size={16} />,
  info:    <Info size={16} />,
};
// Also: add a subtle left border on each toast in the type's color
```

---

### UX-15.4 — ScrollPicker Has No Haptic Feedback on Desktop 🟢

**Problem:** `ScrollPicker` in `SharedComponents.jsx` is smooth but silent. On mobile, each value snap could trigger a brief haptic pulse using the Vibration API, making weight logging feel more intentional.

**Fix in `ScrollPicker`'s `onScroll` handler:**
```js
const onScroll = useCallback(() => {
  // ... existing logic
  if (items[c] !== value) {
    onChange(items[c]);
    // Haptic on mobile:
    if ('vibrate' in navigator) navigator.vibrate(8);
  }
}, [items, onChange, value]);
```

---

## 16. Mobile UX

### UX-16.1 — Touch Targets Below 44px on Key Workout Actions 🔴

**Problem:** The set done/checkbox button in `WorkoutPage.jsx` is `width: 32, height: 32` — below the WCAG 2.5.5 minimum of 44×44px for touch targets. In a gym setting with sweaty hands and gloves, small touch targets cause frequent misfires.

**Fix:**
```jsx
// In WorkoutPage.jsx set row:
<button style={{
  width: 44, height: 44,  // ← minimum 44×44
  borderRadius: 8,
  // ... rest of styles
}} onClick={() => upd(ei, si, 'done', !s.done)}>
```
Also audit: the `✕` remove-set button at `padding: '7px 5px'` is similarly undersized.

---

### UX-16.2 — The "More" Sheet Overlaps with System Navigation Gesture Zone 🟠

**Problem:** `BottomNav.jsx`'s "More" sheet positions at:
```js
bottom: 'calc(52px + env(safe-area-inset-bottom))'
```
This is correct for clearing the bottom nav. But the sheet itself has no `padding-bottom` for the safe area, meaning items at the very bottom of the sheet sit in the iPhone home indicator zone and are hard to tap.

**Fix:**
```jsx
// More sheet div:
paddingBottom: 'calc(8px + env(safe-area-inset-bottom, 8px))'
```

---

### UX-16.3 — Workout Session Scrolling is Unconstrained 🟡

**Problem:** During an active workout session, the entire page (all exercises) is one long scroll. With 6 exercises and 4 sets each, on a 375px phone, this can be 2000px+ of content. Users lose their place and scroll significantly to reach the finish button (addressed by FAB in 2.7, but the scroll itself is still an issue).

**Alternative fix:** Introduce a swipeable exercise-by-exercise view as an option:
```
[ ← Exercise 2/6: Overhead Press  → ]
```
Each swipe advances to the next exercise, showing only one card at a time. The finish button becomes accessible when all exercises are swiped through. This is how strong app and Hevy handle long workouts.

---

### UX-16.4 — Inputs Don't Trigger Numeric Keyboard on iOS 🟡

**Problem:** `WorkoutPage.jsx` set input fields use `type="number"` with `step=".5"`. On iOS, `type="number"` with a decimal step triggers the standard keyboard, not the numeric pad. Users must manually switch keyboards to type weight values.

**Fix:**
```jsx
// Use type="text" with inputMode and pattern for proper iOS numeric keyboard:
<input
  type="text"
  inputMode="decimal"
  pattern="[0-9]*\.?[0-9]*"
  // This triggers the numeric keyboard with decimal point on iOS
/>
```

---

### UX-16.5 — Long Exercise Names Truncate in the Workout Grid 🟡

**Problem:** `WorkoutPage.jsx` day selection cards show exercise names at `fontSize: 12` with no text overflow handling. "Single Hand Overhead Cable Tricep Extension" wraps to 3 lines and breaks the card layout on narrow screens.

**Fix:**
```jsx
<span style={{
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
  display: 'block',
  maxWidth: '100%',
}}>
  {ex.name}
</span>
```

---

## 17. Motivation & Gamification

### UX-17.1 — No Onboarding Flow — New Users Land Cold on Dashboard 🔴

**Problem:** After registration, users are immediately taken to the Dashboard which shows Vishal's sample data (the `INIT_USERS` demo user). For a genuinely new user (non-demo), the Dashboard would be mostly empty — no workouts, no weight logs, no splits set. There is zero guidance on what to do first.

**An app is only as sticky as its first 5 minutes.**

**Fix — add an `Onboarding` component that fires once:**
```
Step 1: "Pick your split" → auto-navigate to Splits
Step 2: "Log your current weight" → opens weight log modal
Step 3: "Set your goal" → opens goal modal
Step 4: "You're set up! Here's your Dashboard" → dismiss

// Track completion in localStorage: fittrack_onboarding_done
```
Mark each step done as the user completes it. Skippable at any point.

---

### UX-17.2 — Streak Breaks With No Recovery Mechanic 🟡

**Problem:** If a user misses a workout, their streak resets to 0 with no recovery path. Apps like Duolingo, Strava, and Fitbit use "streak shields" or "streak freeze" mechanics to keep users engaged after a miss instead of driving them to abandon the app.

**Fix — "Streak Shield" mechanic:**
```js
// User earns one streak shield per 7-day streak
// Shield auto-activates on a missed day to preserve the streak (once only)
const streakShields = Math.floor(streak.longest / 7);
// Stored in user profile, consumed automatically
```
Show shield count on the Streak card: `"🛡 1 Shield Available"`

---

### UX-17.3 — No Weekly Summary Notification / Digest 🟡

**Problem:** There's no "Week in Review" moment — no Sunday recap that tells the user how their week went vs. the previous week. This is a key retention loop used by every successful fitness app.

**Fix — `WeeklySummaryCard` that appears on Sundays:**
```jsx
const isSunday = new Date().getDay() === 0;
const hasShownThisWeek = localStorage.getItem('fittrack_weekly_shown') === currentWeek;

if (isSunday && !hasShownThisWeek) {
  // Show a dismissible banner at the top of Dashboard:
  // "This Week: 4 sessions | 12,400 kg volume | +2.5 kg on bench"
}
```

---

### UX-17.4 — XP Points Gained Per Session Not Visible in History 🟡

**Problem:** `WorkoutHistoryPage.jsx` shows session name, date, and set count — but not XP gained. Users who care about the gamification system have no historical view of how much XP each session contributed.

**Fix:** Compute and display session XP in the history log:
```js
// WorkoutHistoryPage.jsx — for each log entry:
const sessionXP = log.exercises?.reduce((total, ex) => {
  const muscleField = exMuscleMap[ex.name];
  return total + (muscleField
    ? ex.sets.reduce((s, set) => s + (set.reps || 0) * Math.max(set.weight || 0, 1), 0)
    : 0);
}, 0);
// Show as: "+2,400 XP" tag on the session card
```

---

## 18. Indian Market UX

### UX-18.1 — Contact Page Uses Email-First Despite WhatsApp Dominance 🔴

*Already detailed in UX-13.1 — WhatsApp CTA. Cross-reference.*

---

### UX-18.2 — No Indian Food Database for Calorie Logging 🟠

**Problem:** The calorie log lets users manually enter meal name + calories but there's no food search or common Indian food database. Users must independently look up calories for dal, roti, sabzi, biryani, etc., then type them manually. This creates significant friction.

**Top 20 most common Indian foods with calories should be pre-loaded:**
```js
// src/data/indianFoods.js
export const INDIAN_FOODS = [
  { name: 'Roti (1 piece)', calories: 71, protein: 3, carbs: 15, fat: 0.4 },
  { name: 'Dal (1 cup)', calories: 198, protein: 14, carbs: 34, fat: 1 },
  { name: 'White Rice (1 cup)', calories: 242, protein: 4, carbs: 53, fat: 0.4 },
  { name: 'Paneer (100g)', calories: 265, protein: 18, carbs: 3, fat: 20 },
  { name: 'Chicken Breast (100g)', calories: 165, protein: 31, carbs: 0, fat: 3.6 },
  // ... 15 more
];
```
Add a searchable dropdown in the "Log Meal" form that pre-fills name + calories when a food is selected.

---

### UX-18.3 — Currency Symbol Inconsistency on Contact Page 🟢

**Problem:** `ContactPage.jsx` shows `₹2,000` which uses the correct ₹ symbol. But the `SVCS` array uses a plain `'₹'` string character. Ensure the symbol is consistent and correctly encoded as the Unicode rupee character (U+20B9, not U+0965 which looks similar but is a Devanagari sign).

**Fix:** Use `\u20B9` or the actual `₹` character throughout. Verify it renders correctly in both light and dark themes.

---

### UX-18.4 — No Regional Language Toggle 🟢

**Problem:** FitTrack Pro is entirely in English. A meaningful segment of Indian gym-goers — particularly in Tier 2/3 cities which are the fastest-growing fitness market — prefer Hindi for some content or at least key labels.

**Short-term fix (no full i18n needed):** Add Hindi equivalents to motivational copy only:
- Streak card: "Continuous streak" → small Hindi subtitle "लगातार सत्र"
- Goal card: "Target" → "लक्ष्य"
- This signals cultural awareness without full translation complexity

**Long-term:** Structure copy into a `strings.js` constant file now, even if only one language is used initially, to make i18n straightforward later.

---

### UX-18.5 — Gym-Finder Integration Missing 🟢

**Problem:** A fitness app that doesn't help users *find where to train* leaves a key user job unaddressed. In India, popular gym chains (Cult.fit, Gold's Gym, Anytime Fitness) are searchable via Maps APIs.

**Fix (Phase 3 scope):** Add a "Find Gyms Near Me" widget on the Dashboard or Contact page using the Google Maps/Places API or a simple Maps redirect:
```jsx
<a href={`https://www.google.com/maps/search/gym+near+me`} target="_blank">
  Find Gyms Near You 📍
</a>
```

---

## 19. Accessibility

### UX-19.1 — Orange on Dark Background Fails WCAG AA for Normal Text 🟠

**Problem:** `var(--o): #E8540D` on `var(--bg): #050506` has a contrast ratio of approximately **3.2:1** — below the WCAG AA requirement of **4.5:1 for normal text (< 18pt)** and **3:1 for large text (≥ 18pt)**.

This affects:
- All `.tag` text (10px, `color: var(--o)`, `background: var(--o2)`)
- Stat card units (13px, `color: var(--o)`)
- Workout exercise set counts when in orange

**Fix:** Use orange for **decoration and large text only** at 10–12px; at small sizes, use `var(--tx)` or `#fff` on orange backgrounds instead. Add a slightly lighter orange `--o-text: #F06728` (contrast 4.6:1) specifically for small orange text.

---

### UX-19.2 — All Icon-Only Buttons Lack `aria-label` 🟠

**Problem:** Across the app, many interactive icon buttons have no `aria-label`:
- `WorkoutPage.jsx` — rest timer cancel `X` button
- All modal close `X` buttons in `SharedComponents.jsx`, `DashboardPage.jsx`, `DietPage.jsx`
- Edit/Delete buttons in `WeightLogPage.jsx` (pencil icon, trash icon)
- Sidebar collapse toggle (`Dumbbell` icon click)

**Fix:** Add `aria-label` to every icon-only interactive element:
```jsx
<button aria-label="Close modal" ...><X size={14} /></button>
<button aria-label="Edit weight entry" ...><Edit2 size={10} /></button>
<button aria-label="Delete weight entry" ...><Trash2 size={10} /></button>
```

---

### UX-19.3 — Modal Focus Trap Not Implemented 🟠

**Problem:** When a modal opens, keyboard focus is not trapped inside it. Users tabbing through the interface after opening a modal will focus elements behind it. Screen reader users get no indication they're inside a modal.

**Fix in `SharedComponents.jsx` Portal/modal components:**
- On modal open: move focus to the first interactive element inside `.md`
- Trap Tab / Shift+Tab within the modal boundaries
- On modal close: restore focus to the element that opened the modal
- Add `role="dialog"` and `aria-modal="true"` to the `.md` wrapper

---

### UX-19.4 — No `prefers-reduced-motion` Respect 🟡

**Problem:** `index.css` defines 8+ keyframe animations that play on every load. Users who have set `prefers-reduced-motion: reduce` in their OS accessibility settings still see all animations.

**Fix in `index.css`:**
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: .01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: .01ms !important;
  }
}
```

---

### UX-19.5 — `ScrollPicker` Has No Keyboard Navigation 🟡

**Problem:** `ScrollPicker` in `SharedComponents.jsx` is a custom scroll-based component with no keyboard support. Keyboard users cannot change values with arrow keys, making weight/timeline selection inaccessible.

**Fix:**
```jsx
// Add to the scroll wrapper div:
tabIndex={0}
onKeyDown={(e) => {
  const currentIdx = items.findIndex(it => String(it) === String(value));
  if (e.key === 'ArrowDown' && currentIdx < items.length - 1) {
    onChange(items[currentIdx + 1]);
    ref.current.scrollTop = (currentIdx + 1) * H;
  }
  if (e.key === 'ArrowUp' && currentIdx > 0) {
    onChange(items[currentIdx - 1]);
    ref.current.scrollTop = (currentIdx - 1) * H;
  }
}}
aria-label="Scroll to select value"
role="spinbutton"
aria-valuenow={value}
```

---

## 20. Performance UX

### UX-20.1 — No Route-Level Code Splitting — All Code Loaded Upfront 🟡

**Problem:** `App.jsx` imports every page component at the top level (standard ES imports). All page code is bundled and loaded on the first visit, including heavy pages like `ProgressPage.jsx` (multiple chart imports) and `MuscleMapPage.jsx` (canvas operations).

**Fix — lazy load all routes in `App.jsx`:**
```jsx
const DashboardPage   = React.lazy(() => import('./components/pages/DashboardPage'));
const WorkoutPage     = React.lazy(() => import('./components/pages/WorkoutPage'));
const ProgressPage    = React.lazy(() => import('./components/pages/ProgressPage'));
// ... all pages

// Wrap <Routes> in <Suspense fallback={<LoadingScreen />}>
```
This splits the bundle and loads page code only when navigated to. Estimated bundle reduction: 40–60% of initial JS.

---

### UX-20.2 — `calcAllMuscleXP` Runs on Every Dashboard Render 🟡

**Problem:** `DashboardPage.jsx` calls `calcAllMuscleXP(workoutLogs, splits, user?.id)` inside `useMemo` — this is correct. But the dependency array `[workoutLogs, splits, user?.id]` means it re-runs whenever any workout log changes (e.g., every new set completion). Since `calcAllMuscleXP` iterates all splits, all days, all exercises, and all workout logs, this is an O(n³) operation.

**Fix:** Move the expensive `calcAllMuscleXP` computation to `AppContext.jsx` and compute it once, storing the result:
```jsx
// AppContext.jsx — compute once, store in state:
const muscleXP = useMemo(
  () => user ? calcAllMuscleXP(workoutLogs, splits, user.id) : {},
  [workoutLogs, splits, user?.id]
);
// Expose via context — all pages use context value instead of recomputing
```

---

### UX-20.3 — `localStorage` Writes on Every Keystroke in Forms 🟡

**Problem:** `useLocalStorage` in `useLocalStorage.js` writes to `localStorage` synchronously on every `setValue` call. During workout logging, every reps/weight keypress triggers a `localStorage.setItem`. `localStorage` I/O is synchronous and blocks the main thread briefly.

**Fix:** Debounce `setValue` writes for form inputs:
```js
// In useLocalStorage.js, add a debounced write option:
const setValue = useCallback(debounce((value) => {
  const valueToStore = value instanceof Function ? value(storedValue) : value;
  setStoredValue(valueToStore);
  window.localStorage.setItem(key, JSON.stringify(valueToStore));
}, 300), [key, storedValue]);
```
State updates remain immediate; storage writes batch to once per 300ms.

---

## 📊 Priority Summary

| # | Item | Page | Severity | Effort |
|---|------|------|----------|--------|
| UX-1.6 | Error Boundary | Global | 🔴 Critical | 🟢 Small |
| UX-1.7 | Workout unload guard | WorkoutPage | 🔴 Critical | 🟢 Small |
| UX-11.1 | Plain-text passwords | Auth/Profile | 🔴 Critical | 🟡 Medium |
| UX-17.1 | Onboarding flow | Global | 🔴 Critical | 🔴 Large |
| UX-16.1 | Touch targets 44px | WorkoutPage | 🔴 Critical | 🟢 Small |
| UX-4.1 | Non-blocking rest timer | WorkoutPage | 🟠 High | 🟡 Medium |
| UX-2.1 | Today's workout shortcut | Dashboard | 🟠 High | 🟡 Medium |
| UX-4.5 | Previous session visible | WorkoutPage | 🟠 High | 🟢 Small |
| UX-4.6 | Partial save warning | WorkoutPage | 🟠 High | 🟢 Small |
| UX-6.1 | Diet type segmented control | DietPage | 🟠 High | 🟢 Small |
| UX-6.2 | Scaled meal macros | DietPage | 🟠 High | 🟡 Medium |
| UX-1.5 | Modal scroll lock | Global | 🟠 High | 🟢 Small |
| UX-1.3 | Touch card feedback | Global | 🟠 High | 🟢 Small |
| UX-19.1 | Orange contrast WCAG | Global | 🟠 High | 🟡 Medium |
| UX-19.2 | aria-label icon buttons | Global | 🟠 High | 🟢 Small |
| UX-13.1 | WhatsApp CTA | ContactPage | 🟠 High | 🟢 Small |
| UX-18.2 | Indian food database | DietPage | 🟠 High | 🟡 Medium |
| UX-8.1 | Canvas loading skeleton | MuscleMap | 🟠 High | 🟢 Small |
| UX-4.2 | Progressive overload hint | WorkoutPage | 🟠 High | 🟡 Medium |
| UX-3.1 | Today's workout card | Dashboard | 🟠 High | 🟡 Medium |
| UX-4.3 | Workout duration timer | WorkoutPage | 🟡 Medium | 🟢 Small |
| UX-4.4 | PR detection + toast | WorkoutPage | 🟡 Medium | 🟢 Small |
| UX-3.3 | 7-day streak calendar | Dashboard | 🟡 Medium | 🟢 Small |
| UX-7.1 | Smart progress defaults | ProgressPage | 🟡 Medium | 🟢 Small |
| UX-12.1 | Try Demo one-click | AuthModal | 🟡 Medium | 🟢 Small |
| UX-10.2 | Weight delta goal-aware | WeightLog | 🟡 Medium | 🟢 Small |
| UX-11.2 | Profile cancel edit | ProfilePage | 🟡 Medium | 🟢 Small |
| UX-20.1 | Route code splitting | Global | 🟡 Medium | 🟡 Medium |
| UX-17.2 | Streak shield mechanic | Dashboard | 🟡 Medium | 🟡 Medium |
| UX-9.1 | Body fat estimate | Measurements | 🟡 Medium | 🟢 Small |
| UX-16.4 | iOS numeric keyboard | WorkoutPage | 🟡 Medium | 🟢 Small |
| UX-19.3 | Modal focus trap | Global | 🟡 Medium | 🟡 Medium |
| UX-19.4 | prefers-reduced-motion | Global | 🟡 Medium | 🟢 Small |
| UX-3.4 | On-track goal indicator | Dashboard | 🟡 Medium | 🟢 Small |
| UX-5.2 | Workout duration estimate | SplitsPage | 🟡 Medium | 🟢 Small |
| UX-6.4 | Calorie entry delete | DietPage | 🟡 Medium | 🟢 Small |
| UX-8.2 | Weakest muscle callout | MuscleMap | 🟡 Medium | 🟢 Small |
| UX-2.4 | More sheet animation | Navigation | 🟡 Medium | 🟢 Small |
| UX-1.2 | Radius scale tokens | Global | 🟢 Low | 🟡 Medium |
| UX-3.2 | BMI range indicator | Dashboard | 🟢 Low | 🟢 Small |
| UX-14.1 | Chart semantic colors | Charts | 🟢 Low | 🟢 Small |
| UX-17.3 | Weekly summary digest | Dashboard | 🟢 Low | 🟡 Medium |
| UX-18.4 | Hindi labels option | Global | 🟢 Low | 🔴 Large |

---

## 🗓️ Recommended Implementation Waves

### Wave 1 — Quick Wins (1–2 days each, immediate impact)
Items where effort is Small and severity is High/Critical:
UX-1.6, UX-1.7, UX-16.1, UX-1.5, UX-1.3, UX-4.6, UX-4.5, UX-6.1, UX-8.1, UX-13.1, UX-19.2, UX-19.4, UX-10.2, UX-11.2, UX-12.1, UX-4.3, UX-4.4, UX-3.3, UX-3.4, UX-16.4, UX-5.2, UX-6.4

### Wave 2 — Medium Effort, High Value
Items with Medium effort and High impact:
UX-4.1, UX-2.1, UX-6.2, UX-4.2, UX-9.1, UX-7.1, UX-8.2, UX-19.3, UX-20.1, UX-17.2

### Wave 3 — Strategic Enhancements
Larger scope items that require design + planning:
UX-17.1 (Onboarding), UX-11.1 (Password hashing), UX-18.2 (Food database), UX-19.1 (WCAG orange), UX-8.3 (Muscle trends)
