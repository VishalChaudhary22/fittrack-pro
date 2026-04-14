# TODO — UX-09: Measurements & Weight Log Pages

> **Scope:** UX improvements to `MeasurementsPage.jsx` and `WeightLogPage.jsx`.  
> **Files primarily affected:** `MeasurementsPage.jsx`, `WeightLogPage.jsx`, `calculations.js`

---

## UX-9.1 — No Body Composition Estimate from Measurements 🟡

**Problem:** `MeasurementsPage.jsx` collects chest, waist, hips, biceps, thighs, and neck — but never synthesises them into a body composition estimate. The **US Navy Body Fat Formula** can calculate an estimated body fat % from measurements already being collected.

**Fix — add to `calculations.js`:**
```js
// US Navy Body Fat Formula
export const calcBodyFat = (gender, waist, neck, height, hips = 0) => {
  if (!waist || !neck || !height) return null;
  if (gender === 'male') {
    return parseFloat(
      (495 / (1.0324 - 0.19077 * Math.log10(waist - neck) + 0.15456 * Math.log10(height))) - 450
    ).toFixed(1);
  } else {
    if (!hips) return null;
    return parseFloat(
      (495 / (1.29579 - 0.35004 * Math.log10(waist + hips - neck) + 0.22100 * Math.log10(height))) - 450
    ).toFixed(1);
  }
};

// Body fat categories:
export const getBodyFatCategory = (bf, gender) => {
  if (gender === 'male') {
    if (bf < 6)  return 'Essential Fat';
    if (bf < 14) return 'Athletic';
    if (bf < 18) return 'Fitness';
    if (bf < 25) return 'Average';
    return 'Above Average';
  } else {
    if (bf < 14) return 'Essential Fat';
    if (bf < 21) return 'Athletic';
    if (bf < 25) return 'Fitness';
    if (bf < 32) return 'Average';
    return 'Above Average';
  }
};
```

Display as an additional stat card in the latest measurements grid:
```
"Est. Body Fat: 18.3% · Fitness"
```
Note: Show a disclaimer that this is an estimate (Navy method has ±3-4% accuracy).

**Files:** `calculations.js` (new functions), `MeasurementsPage.jsx` (display).

---

## UX-9.2 — Measurement Form Has No Reference Guide for Where to Measure 🟡

**Problem:** The add-measurement modal shows inputs for chest, waist, hips, etc. but no guide on *where exactly* to measure. Inconsistent measurement spots make the trend data meaningless (e.g., waist at navel vs. narrowest point gives 5–8cm difference).

**Fix — add a `"?"` info tooltip next to each measurement label:**
```jsx
const MEASUREMENT_GUIDES = {
  chest:  'At nipple line, arms relaxed at sides',
  waist:  'At narrowest point, measured after exhale',
  hips:   'At widest point of glutes / buttocks',
  bicepL: 'Peak of flexed bicep, arm at 90°',
  bicepR: 'Peak of flexed bicep, arm at 90°',
  thighL: 'At widest point of upper thigh, standing',
  thighR: 'At widest point of upper thigh, standing',
  neck:   'Just below the larynx (Adam\'s apple)',
};

// In each label:
<label>
  {f.label}
  <span
    title={MEASUREMENT_GUIDES[f.key]}
    style={{ marginLeft: 4, cursor: 'help', color: 'var(--t3)', fontSize: 10 }}
  >
    ℹ
  </span>
</label>
```

**Files:** `MeasurementsPage.jsx`.

---

## UX-9.3 — Single-Metric Chart Requires Tab-Scroll to Switch Metrics 🟡

**Problem:** The chart shows one metric at a time, selected by tapping the stat cards above. Users must scroll up, tap a card, then scroll back down to see the chart. No keyboard/swipe navigation between metrics.

**Fix — add prev/next navigation arrows on the chart header:**
```jsx
const fieldKeys = MEASUREMENT_FIELDS.map(f => f.key);
const currentIdx = fieldKeys.indexOf(chartField);

// Chart header:
<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
  <button
    onClick={() => setChartField(fieldKeys[Math.max(0, currentIdx - 1)])}
    disabled={currentIdx === 0}
    style={{ /* small nav button */ }}
  >
    ←
  </button>
  <div style={{ fontSize: 11, color: 'var(--t3)', fontWeight: 700 }}>
    {MEASUREMENT_FIELDS[currentIdx]?.label} Over Time
  </div>
  <button
    onClick={() => setChartField(fieldKeys[Math.min(fieldKeys.length - 1, currentIdx + 1)])}
    disabled={currentIdx === fieldKeys.length - 1}
    style={{ /* small nav button */ }}
  >
    →
  </button>
</div>
```

**Files:** `MeasurementsPage.jsx`.

---

## UX-10.1 — No Weight Entry Chart on the Weight Log Page Itself 🟡

**Problem:** `WeightLogPage.jsx` shows only a table of entries. The weight trend chart lives only on the Dashboard. Users who navigate to the weight log to review their history have no visual overview — just a raw table.

**Fix — add a compact `AreaChart` at the top of `WeightLogPage.jsx`:**
```jsx
// Reuse the same chartData computation pattern from DashboardPage.jsx:
const chartData = useMemo(() =>
  [...userLogs]
    .reverse()
    .map(l => ({ date: fmt(l.date), weight: l.weight })),
  [userLogs]
);

// Render above the table: <ResponsiveContainer height={160}><AreaChart .../>
// Show goal reference line if user.weightGoal exists
```

**Files:** `WeightLogPage.jsx`.

---

## UX-10.2 — Weight Delta Color Logic is Backwards for Weight-Gain Goals 🟡

**Problem:** `WeightLogPage.jsx` colors positive weight delta red and negative delta green regardless of the user's goal. For a user in a bulk (gain goal), gaining 0.3 kg is *good* — it should be green, not red.

**Fix:**
```js
// Derive direction from user.weightGoal
const isGainGoal = user.weightGoal && user.weightGoal > user.weight;

const getDeltaColor = (diff) => {
  const isGain = parseFloat(diff) > 0;
  return isGainGoal
    ? (isGain ? '#6BCB77' : '#FF6B6B')   // gain goal: gaining = good
    : (isGain ? '#FF6B6B' : '#6BCB77');  // loss goal: losing = good
};
```

**Files:** `WeightLogPage.jsx`.
