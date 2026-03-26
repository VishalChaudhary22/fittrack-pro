# TODO — UX-05: Splits Page

> **Scope:** All UX improvements to the split selection and exercise browsing experience.  
> **Files primarily affected:** `SplitsPage.jsx`, `WorkoutPage.jsx` (day cards)

---

## UX-5.1 — Expand State Not Persisted — Collapses on Every Navigation 🟡

**Problem:** `SplitsPage.jsx` uses `const [exp, setExp] = useState(null)` — all splits collapse when navigating away and back. Users comparing exercises across two splits must re-expand both each time.

**Fix — persist to `sessionStorage` (resets on tab close, which is fine):**
```jsx
const [exp, setExp] = useState(
  () => sessionStorage.getItem('splits_exp') || null
);

const setExpPersist = (id) => {
  setExp(id);
  if (id) sessionStorage.setItem('splits_exp', id);
  else sessionStorage.removeItem('splits_exp');
};
// Replace all setExp(...) calls with setExpPersist(...)
```

**Files:** `SplitsPage.jsx`.

---

## UX-5.2 — No Estimated Workout Duration Per Day 🟡

**Problem:** A split day shows exercises with sets × reps but no time estimate. Indian gym-goers are increasingly time-pressed (lunch-break sessions, pre-office workouts) and want to know if today's session is 45 or 75 minutes before starting.

**Fix — add duration estimate to both SplitsPage day rows and WorkoutPage day cards:**
```js
// Estimate: ~3 minutes per set (work time + rest)
const estimateMins = (day) =>
  Math.ceil(day.exercises.reduce((s, ex) => s + ex.sets * 3, 0) / 5) * 5;
// Round to nearest 5 mins. Example: 6 exercises × avg 3.5 sets × 3 min = ~65 min → "~65 min"

// Show next to exercise count:
// "6 exercises · ~65 min"
```

**Files:** `SplitsPage.jsx`, `WorkoutPage.jsx` (day card grid).

---

## UX-5.3 — "Coming Soon" Split Wastes Prime Real Estate 🟡

**Problem:** The Powerlifting `comingSoon: true` split card appears with the same visual weight as usable splits. On mobile it takes up a full card height. Users who tap it are met with a dead card.

**Fix — render `comingSoon` splits as a compact horizontal banner at the bottom of the list:**
```jsx
{splits.filter(s => s.comingSoon).map(split => (
  <div key={split.id} style={{
    padding: '10px 16px',
    background: 'var(--c2)',
    borderRadius: 12,
    border: '1px dashed var(--bd)',
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  }}>
    <span style={{ fontSize: 12, color: 'var(--t2)' }}>{split.name}</span>
    <span className="tag-d" style={{ fontSize: 9, marginLeft: 'auto' }}>Coming Soon</span>
  </div>
))}
```

**Files:** `SplitsPage.jsx`.

---

## UX-5.4 — No Muscle Coverage Summary Per Split 🟡

**Problem:** Users choosing between PPL vs Upper-Lower have no quick way to see which muscle groups each split covers. They must mentally scan all exercise lists.

**Fix — add a mini muscle coverage bar below each split description:**
```jsx
// Compute covered muscles from split.days exercises via getMusclesForExercise
import { getMusclesForExercise, MUSCLE_GROUPS } from '../../data/muscleData';

const coveredMuscles = new Set();
split.days.forEach(day =>
  day.exercises.forEach(ex =>
    getMusclesForExercise(ex.muscle).forEach(m => coveredMuscles.add(m))
  )
);

// Render as colored dots below the description:
// ● chest  ● back  ● shoulders  ● quads  ● hamstrings  (+3 more)
```

**Files:** `SplitsPage.jsx`, imports from `muscleData.js`.
