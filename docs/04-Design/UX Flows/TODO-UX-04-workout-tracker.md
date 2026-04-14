# TODO — UX-04: Workout Tracker

> **Scope:** All UX issues within the active workout session experience.  
> **Files primarily affected:** `WorkoutPage.jsx`, `calculations.js`

---

## UX-4.1 — Rest Timer Blocks Full Screen — Can't See Exercise Notes 🟠

**Problem:** `RestTimer` renders as a `position: fixed` full-screen overlay with blurred backdrop. While resting, users cannot see the next exercise, their notes, or the weight from their last set. This is the opposite of what a gym user needs — most people check the next exercise *during* rest.

**Fix — replace full overlay with a non-blocking bottom bar:**
```jsx
// Instead of a Portal overlay, render as a fixed bottom notification bar:
<div style={{
  position: 'fixed',
  bottom: 'calc(0px + env(safe-area-inset-bottom))',
  left: 0, right: 0,
  zIndex: 400,
  background: 'var(--c1)',
  borderTop: '2px solid var(--o)',
  padding: '10px 20px',
  display: 'flex',
  alignItems: 'center',
  gap: 16,
}}>
  {/* Small 40px circular progress ring */}
  {/* MM:SS countdown in Bebas Neue */}
  {/* "Skip →" button */}
</div>
```
Page remains fully scrollable during rest. Reference: Strong App and Hevy both use this pattern.

**Files:** `WorkoutPage.jsx` (RestTimer component).

---

## UX-4.2 — No Progressive Overload Suggestion 🟠

**Problem:** When starting a workout, previous session weights are pre-loaded but there's no suggestion to increase weight. Progressive overload is the #1 mechanism for muscle growth and is a key differentiator among Indian fitness apps (HealthifyMe AI coach, for example, does this).

**Fix in `WorkoutPage.jsx`'s `start()` function:**
```js
// Check if user completed every rep at the top of the rep range last session
const prevTopOfRange = pe?.sets?.every(
  s => s.reps >= parseInt(ex.repsRange?.split('-')[1] || 99)
);
const suggestedWeight = prevTopOfRange
  ? (pe.sets[0]?.weight || 0) + 2.5   // suggest +2.5 kg
  : pe?.sets?.[i]?.weight || 0;
```
Show a subtle `"+2.5 kg?"` chip or orange dot next to the first set's weight input only.

**Files:** `WorkoutPage.jsx`.

---

## UX-4.3 — No Workout Duration Timer 🟡

**Problem:** The active session has no elapsed time counter. Users want to track how long their workout is taking — both to manage gym time and for session history.

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

**Files:** `WorkoutPage.jsx`.

---

## UX-4.4 — No PR Detection & Celebration Mid-Workout 🟡

**Problem:** When a user logs a new personal record (estimated 1RM > all previous), nothing happens. This is one of the highest-motivation moments in any workout session and the app misses it entirely.

**Fix in `WorkoutPage.jsx`'s `upd()` function — check after marking a set as done:**
```js
// After marking a set done:
const allPrevSets = workoutLogs
  .filter(l => l.dayId === session.day.id)
  .flatMap(l => l.exercises?.find(e => e.name === (ex.sv || ex.name))?.sets || []);

const currentBest = best1RMFromSets(allPrevSets);
const thisEst1RM = calc1RM(s.weight, s.reps);

if (thisEst1RM > currentBest && s.weight > 0 && s.reps > 0) {
  addToast(`🏆 New PR on ${ex.sv || ex.name}! Est. 1RM: ${thisEst1RM} kg`, 'success', 4000);
}
```

**Files:** `WorkoutPage.jsx`, imports from `calculations.js`.

---

## UX-4.5 — Previous Session Data Invisible During Current Session 🟠

**Problem:** When logging sets, users have no reference to what they did last session for the same exercise. The weight defaults are pre-filled but the full set list is not visible — no equivalent of checking a gym log book.

**Fix — add a collapsible "Last Session" row beneath each exercise header:**
```jsx
{pe && prevLog && (
  <div style={{
    marginBottom: 8, padding: '6px 10px',
    background: 'var(--c2)', borderRadius: 8,
    border: '1px solid var(--bd)', fontSize: 11,
  }}>
    <span style={{ color: 'var(--t3)', fontWeight: 700 }}>
      LAST TIME ({fmt(prevLog.date)}):
    </span>
    {pe.sets.map((s, i) => (
      <span key={i} style={{ color: 'var(--t2)', marginLeft: 8 }}>
        {s.reps}r × {s.weight}kg
      </span>
    ))}
  </div>
)}
```

**Files:** `WorkoutPage.jsx`.

---

## UX-4.6 — "Finish Workout" Has No Partial Save Warning 🟠

**Problem:** `finish()` silently drops exercises with zero checked sets. A user who forgets to tick their sets has exercises disappear from the log without realising. Also, a user needing to leave the gym early has no explicit "save partial" path.

**Fix — add pre-finish check:**
```js
const uncheckedExercises = session.exs.filter(ex => ex.sets.every(s => !s.done));
if (uncheckedExercises.length > 0) {
  // Show ConfirmDialog:
  // "You have X unchecked exercises. Save partial session?"
  // Options: "Save Partial" | "Keep Editing"
}
```
The partial session saves normally (the filter already handles it) — just make it explicit and intentional.

**Files:** `WorkoutPage.jsx`, `SharedComponents.jsx` (ConfirmDialog already exists).

---

## UX-4.7 — Set Rows Have No Visual Separation at Scale 🟡

**Problem:** With 4+ sets per exercise and 6+ exercises per session, set rows blur together. Inside each exercise card, sets have only `marginBottom: 5` between them.

**Fix — alternate set row backgrounds for easier scanning:**
```jsx
// In the set map:
background: si % 2 === 0 ? 'transparent' : 'rgba(255,255,255,.015)'
```
Or add a left accent border on done sets:
```jsx
borderLeft: s.done ? '3px solid var(--o)' : '3px solid transparent',
paddingLeft: 6,
```

**Files:** `WorkoutPage.jsx`.
