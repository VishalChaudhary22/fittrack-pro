# TODO — UX-08: Muscle Map Page

> **Scope:** All UX improvements to `MuscleMapPage.jsx` and `BodyMapSVG.jsx`.  
> **Files primarily affected:** `MuscleMapPage.jsx`, `BodyMapSVG.jsx`, `muscleData.js`

---

## UX-8.1 — Canvas Takes 2–3 Seconds to Render With No Loading Indicator 🟠

**Problem:** `BodyMapSVG.jsx` uses `Promise.all` to load base + muscle layer images, then runs canvas compositing. On first load (no browser cache), this takes 2–3 seconds during which the canvas element shows **nothing**. Users think the component failed.

**Fix in `CanvasBodyMap` component:**
```jsx
const [loading, setLoading] = useState(true);

// Inside Promise.all().then():
// After ctx.putImageData(baseData, 0, 0) is called:
setLoading(false);

// Render:
if (loading) return (
  <div style={{
    width: '100%',
    paddingBottom: '200%',   // maintains aspect ratio
    background: 'var(--c3)',
    borderRadius: 8,
    animation: 'skPulse 1.8s ease-in-out infinite',  // existing skeleton animation
  }} />
);
```

**Files:** `BodyMapSVG.jsx`.

---

## UX-8.2 — No "Weakest Muscle" Callout to Guide Training Focus 🟡

**Problem:** Muscle cards are sorted by XP (highest first). The lowest-ranked muscles — the ones most needing attention — sit at the bottom of a long scroll with no proactive coaching nudge.

**Fix — add a "Needs Attention" callout above the filter tabs:**
```jsx
const weakestMuscles = [...MUSCLE_GROUPS]
  .sort((a, b) => (muscleXP[a.key] || 0) - (muscleXP[b.key] || 0))
  .slice(0, 2)
  .filter(m => (muscleXP[m.key] || 0) < 500); // only show if genuinely undertrained

{weakestMuscles.length > 0 && (
  <div className="card" style={{
    padding: '12px 16px',
    marginBottom: 14,
    borderLeft: '3px solid #FF6B6B',
    borderRadius: '0 14px 14px 0',
  }}>
    <div style={{ fontSize: 10, color: 'var(--t3)', fontWeight: 700, marginBottom: 6 }}>
      NEEDS ATTENTION THIS MONTH
    </div>
    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
      {weakestMuscles.map(m => (
        <span key={m.key} style={{
          padding: '3px 10px', borderRadius: 20,
          background: 'rgba(255,107,107,.1)',
          color: '#FF6B6B',
          border: '1px solid rgba(255,107,107,.2)',
          fontSize: 11, fontWeight: 600,
        }}>
          {m.label}
        </span>
      ))}
    </div>
  </div>
)}
```

**Files:** `MuscleMapPage.jsx`.

---

## UX-8.3 — No Per-Muscle Historical Trend 🟡

**Problem:** Each `MuscleCard` shows current XP and rank but no trend — is this muscle getting stronger or declining? Has shoulder XP increased since last month? This context would make the muscle map feel alive.

**Fix — add a month-over-month delta indicator on each MuscleCard:**
```jsx
// In muscleData.js — add a helper:
export const calcMuscleXPForMonth = (workoutLogs, splits, userId, targetDate) => {
  const startOfMonth = new Date(targetDate.getFullYear(), targetDate.getMonth(), 1);
  const endOfMonth = new Date(targetDate.getFullYear(), targetDate.getMonth() + 1, 0);
  const monthLogs = workoutLogs.filter(l =>
    (l.userId === userId || l.userId === 'vishal') &&
    new Date(l.date) >= startOfMonth &&
    new Date(l.date) <= endOfMonth
  );
  return calcAllMuscleXP(monthLogs, splits, userId);
};

// In MuscleCard — compare current month vs last month:
const now = new Date();
const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
const prevMonthXP = calcMuscleXPForMonth(workoutLogs, splits, userId, lastMonth);
const delta = (muscleXP[muscle.key] || 0) - (prevMonthXP[muscle.key] || 0);

// Display next to rank badge:
// ▲ +1,200 XP (green) or ▼ -400 XP (red) or — (grey if no prev data)
```

**Files:** `MuscleMapPage.jsx`, `muscleData.js`.

---

## UX-8.4 — Rank Tier Legend is Visually Flat 🟢

**Problem:** The rank tier legend on `MuscleMapPage.jsx` is a flat tag cloud of all 14 tiers side by side. It gives no sense of the progression ladder — Bronze feels visually equivalent to Legend.

**Fix — display tiers as a horizontal staircase or vertical progression bar:**
- Each tier chip is slightly larger/brighter than the previous
- Group by metal: Bronze (3 sub-tiers) → Silver → Gold → Platinum → Diamond → Master → Legend
- Add XP thresholds inline: `"Gold I · 7,500 XP"`
- Show the user's current tier as highlighted/active

**Files:** `MuscleMapPage.jsx`.
