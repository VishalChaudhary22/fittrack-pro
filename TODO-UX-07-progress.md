# TODO — UX-07: Progress Page

> **Scope:** All UX improvements specific to `ProgressPage.jsx`.  
> **Files primarily affected:** `ProgressPage.jsx`

---

## UX-7.1 — 3-Dropdown Selection is High Friction 🟠

**Problem:** `ProgressPage.jsx` requires: (1) select Split, (2) select Day, (3) select Exercise — then charts appear. No intelligent defaults. First-time visitors see an empty state with `"Select an exercise"` and three blank dropdowns. High abandon rate likely.

**Fix — apply intelligent defaults on mount:**
```js
// Auto-select:
// 1. Active split (already done via ss state init)
// 2. Most recently trained day
// 3. Exercise with the most logged sessions in that day

const defaultDay = useMemo(() => {
  const recentLog = [...ul]
    .sort((a, b) => new Date(b.date) - new Date(a.date))[0];
  return recentLog?.dayId || days[0]?.id || '';
}, [ul, days]);

const defaultExercise = useMemo(() => {
  // Count which exercise has the most log entries for the selected day
  const counts = {};
  ul.filter(l => !sd || l.dayId === sd).forEach(l =>
    l.exercises?.forEach(e => { counts[e.name] = (counts[e.name] || 0) + 1; })
  );
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || '';
}, [ul, sd]);

// Initialize sd and se to these defaults on mount
useEffect(() => {
  if (!sd && defaultDay) setSd(defaultDay);
}, [defaultDay]);

useEffect(() => {
  if (!se && defaultExercise) setSe(defaultExercise);
}, [defaultExercise]);
```
Users land on a page with charts already populated for their most-trained exercise.

**Files:** `ProgressPage.jsx`.

---

## UX-7.2 — All 4 Charts Visible Simultaneously — Information Overload 🟡

**Problem:** The 2×2 chart grid (max weight, volume, avg reps, est. 1RM) shows all 4 at once. On mobile this is 4 full-width stacked charts — a lot of scrolling for information that partially overlaps (volume and weight are correlated).

**Fix — introduce a tab strip above the charts:**
```jsx
const CHART_TABS = [
  { key: 'maxWeight', label: 'Weight', type: 'area' },
  { key: 'est1rm',   label: '1RM',    type: 'area' },
  { key: 'volume',   label: 'Volume', type: 'bar' },
  { key: 'avgReps',  label: 'Reps',   type: 'line' },
];
const [activeChart, setActiveChart] = useState('maxWeight');

// One full-width chart shown at a time, full height (~240px)
// Tab strip: [Weight] [1RM] [Volume] [Reps]
// Default: Weight or 1RM (most motivating metric)
```

**Files:** `ProgressPage.jsx`.

---

## UX-7.3 — No Comparison Mode (This Period vs. Last Period) 🟡

**Problem:** No way to compare this month vs. last month, or this week vs. last week, on any chart. Indian gym users tracking "gainz" strongly want periodic comparisons.

**Fix — add a "Compare" toggle in the chart controls:**
```jsx
const [compareMode, setCompareMode] = useState(false);

// When active, compute data for the same exercise from the previous period
// const prevPeriodData = /* filter ul for prev 30 days */

// Render a second line on the chart:
// <Line dataKey="maxWeight" stroke="#E8540D" name="Current" />
// <Line dataKey="maxWeight" data={prevPeriodData} stroke="var(--t2)"
//   strokeDasharray="4 4" name="Previous" />
```

**Files:** `ProgressPage.jsx`.

---

## UX-7.4 — PR Badge Lacks Context and History 🟡

**Problem:** The "Personal Record" StatCard shows max weight but with no date context, no delta from the first session, and no visual celebration. It looks like any other stat.

**Fix — enrich the PR card with contextual data:**
```jsx
const prDate = cd.find(d => d.maxWeight === pr)?.date;
const firstWeight = cd[0]?.maxWeight || 0;
const prDelta = (pr - firstWeight).toFixed(1);

// StatCard sub prop:
sub={`Set ${prDate} · ▲ +${prDelta} kg from first session`}
```
Also consider a gold/trophy border on the StatCard when the PR is current (i.e., was set in the most recent session).

**Files:** `ProgressPage.jsx`.
