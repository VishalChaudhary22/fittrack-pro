# TODO — UX-03: Dashboard Page

> **Scope:** All UI/UX improvements specific to `DashboardPage.jsx`.  
> **Files primarily affected:** `DashboardPage.jsx`

---

## UX-3.1 — No Time-Aware Greeting 🟢

**Problem:** Dashboard always shows `"Hey, {firstName}"` regardless of time of day. Indian users respond well to time-aware greetings — it adds warmth and makes the app feel alive.

**Fix:**
```jsx
const hour = new Date().getHours();
const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';
// PageHeader title: `${greeting}, ${user.name.split(' ')[0]} 👋`
```

**Files:** `DashboardPage.jsx`.

---

## UX-3.2 — BMI Card Shows Number Without Visual Context 🟢

**Problem:** The BMI card shows a large number (`24.3`) and a category tag (`Normal`) but no visual scale. Users don't intuitively know if 24.3 is near the top or bottom of "Normal."

**Fix — add a mini 4-segment colored range bar below the category tag:**
```jsx
// Segments: [Underweight|Normal|Overweight|Obese]
// Triangle marker positioned at user's BMI value
// Total range: 10–40, marker at current BMI
const bmiPct = ((bmi - 10) / 30) * 100;
// 6px height bar, full width of card, below the tag
```

**Files:** `DashboardPage.jsx`.

---

## UX-3.3 — Streak Display Has No Visual Calendar 🟡

**Problem:** Streak card shows "7 days / Best: 12 days" as raw numbers. A mini calendar strip creates the "don't break the chain" motivation that a number alone cannot. (Reference: HealthifyMe, Nike Run, Fitbit all use this pattern.)

**Fix — add a 7-day mini strip below the streak numbers:**
```jsx
const last7 = Array.from({ length: 7 }, (_, i) => {
  const d = new Date();
  d.setDate(d.getDate() - (6 - i));
  const dateStr = d.toISOString().split('T')[0];
  const trained = userWo.some(l => l.date === dateStr);
  return {
    day: d.toLocaleDateString('en-IN', { weekday: 'narrow' }),
    trained,
  };
});
// Render: 7 circles, filled orange = trained, grey outline = missed
// Today's circle has a bolder border
```

**Files:** `DashboardPage.jsx`.

---

## UX-3.4 — Goal Progress Card Has No "On Track" Indicator 🟡

**Problem:** The goal card shows target weight, kg remaining, and a progress bar — but gives no indication if the user is *on track* to hit the goal by the deadline. A user 60% done with 80% of timeline elapsed is clearly behind schedule, but the app doesn't signal this.

**Fix:**
```js
const timeElapsedPct = user.goalSetDate && user.goalWeeks
  ? Math.min(100, ((new Date() - new Date(user.goalSetDate)) / (user.goalWeeks * 7 * 86400000)) * 100)
  : 0;
const isOnTrack = goalPct >= timeElapsedPct - 5; // 5% tolerance
```
Show a badge next to the progress bar:
- `"✓ On Track"` (green) 
- `"⚠ Falling Behind"` (amber)

**Files:** `DashboardPage.jsx`.

---

## UX-3.5 — Recent Sessions Shows No Volume or Muscle Info 🟡

**Problem:** Recent sessions list only shows workout day name, date, and exercise count. "Push Day A · 6 exercises" gives no performance data.

**Fix — add total volume to each session row:**
```jsx
const volume = w.exercises?.reduce((s, ex) =>
  s + ex.sets.reduce((a, set) => a + (set.reps || 0) * (set.weight || 0), 0), 0);
// Display: "Push Day A · 6 ex · 4,200 kg vol"
```

**Files:** `DashboardPage.jsx`.

---

## UX-3.6 — Weight Trend Chart Has No Min/Max Annotations 🟡

**Problem:** The weight trend `AreaChart` has a reference line for goal weight but no markers for the highest or lowest recorded weight, which would give the chart visual anchors.

**Fix — add two `ReferenceLine` elements:**
```jsx
const maxWeight = Math.max(...chartData.map(d => d.weight));
const minWeight = Math.min(...chartData.map(d => d.weight));

<ReferenceLine
  y={maxWeight}
  stroke="rgba(255,107,107,.5)"
  strokeDasharray="4 4"
  label={{ value: `High: ${maxWeight}kg`, fill: 'var(--t3)', fontSize: 9, position: 'insideTopRight' }}
/>
<ReferenceLine
  y={minWeight}
  stroke="rgba(81,207,102,.5)"
  strokeDasharray="4 4"
  label={{ value: `Low: ${minWeight}kg`, fill: 'var(--t3)', fontSize: 9, position: 'insideBottomRight' }}
/>
```

**Files:** `DashboardPage.jsx`.
