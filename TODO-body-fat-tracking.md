# FitTrack Pro — Body Fat % Tracking
> **Created:** 2026-04-17
> **Effort:** 🟡 Medium (2–3 days)
> **Impact:** High — closes a critical gap vs HealthifyMe / Fittr; directly relevant to
>   India's "thin fat" epidemic where normal-weight Indians carry high visceral fat.
> **Files affected:** `AppContext.jsx`, `ProfilePage.jsx`, `DashboardPage.jsx`,
>   `src/utils/calculations.js`, `src/data/constants.js`,
>   `supabase/migrations/` (1 new migration)

---

## 🎯 Goal

Let users manually log their body fat percentage — from InBody scans, DEXA, smart scales,
calipers, or the Navy Method — and see a trend chart + goal card on the Dashboard.
The log button lives on the Profile page. The Dashboard shows a self-contained
"Body Composition" card with: current BF%, trend chart, and target BF%.

### Why this matters for Indian users

- **InBody machines** are installed in Cult.fit, Gold's Gym, and Anytime Fitness outlets
  across every Tier-1 and many Tier-2 Indian cities. Members get a printout with their
  BF% but have nowhere to track it over time.
- **DEXA mobile vans** (BodyInsight.in and competitors) now serve Indian metros starting
  at ₹2,999. Users want to track these quarterly scans.
- **"Thin-fat" phenomenon (TOFI):** India has a disproportionately high number of people
  with a normal BMI but dangerously elevated BF% and visceral fat. For these users, the
  weight chart is actively misleading — BF% is the correct metric.
- Tracking BF% over a cut/bulk cycle (recomposition) is the #1 request from Indian
  gym-goers who follow structured programs.

---

## 🔬 Research Notes — BF% Categories (Indian Context)

Indian users should use **ACE (American Council on Exercise)** ranges, which are the
most widely cited in Indian fitness communities and on InBody result sheets.
The ICMR does not publish widely-used body-fat classification tables specifically for
Indians, but research consistently shows Indians carry more visceral fat at lower BF%
than Western populations — so awareness of being in the "Average" band is especially
important to surface.

**Men:**

| Category | BF% Range | Color |
|----------|-----------|-------|
| Essential Fat | 2–5% | `#4ECDC4` (teal) |
| Athlete | 6–13% | `#51CF66` (green) |
| Fitness | 14–17% | `#82C91E` (lime) |
| Average | 18–24% | `#FFD166` (amber) |
| High | 25%+ | `#FF6B6B` (red) |

**Women:**

| Category | BF% Range | Color |
|----------|-----------|-------|
| Essential Fat | 10–13% | `#4ECDC4` |
| Athlete | 14–20% | `#51CF66` |
| Fitness | 21–24% | `#82C91E` |
| Average | 25–31% | `#FFD166` |
| High | 32%+ | `#FF6B6B` |

**Measurement methods supported (affects how results are labeled):**

| ID | Label | Accuracy note |
|----|-------|---------------|
| `inbody` | InBody Scan | ±1–2% (BIA multi-frequency) |
| `dexa` | DEXA Scan | ±1% (gold standard) |
| `smart_scale` | Smart Scale (BIA) | ±3–8% |
| `calipers` | Skinfold Calipers | ±3–5% |
| `navy` | Navy Method | ±3–4% (calculated) |
| `visual` | Visual Estimate / Other | — |

> **Why track method:** Different methods give systematically different readings.
> A user who alternates between InBody (16%) and smart scale (22%) will see a misleading
> trend. Labeling entries with the method lets users filter or at least understand variance.

---

## 📐 Data Model

### New `bodyFatLog` entry shape

```js
{
  id: gId(),           // unique
  userId: user.id,     // Supabase UUID
  date: tod(),         // 'YYYY-MM-DD'
  percentage: 18.5,    // number, required, range 2–60
  method: 'inbody',   // one of the 6 method IDs above
  notes: '',           // optional free-text (e.g. "post-Cult.fit InBody scan")
  createdAt: Date.now(),
}
```

### Profile extension: `bodyFatGoal`

Add a single numeric field `body_fat_goal` (nullable) to `user_profiles` in Supabase.
Exposed on the `user` object as `bodyFatGoal`.

---

## 🗄️ Database: Supabase Migration

**File:** `supabase/migrations/20260417_body_fat_logs.sql`

```sql
-- 1. Add target BF% to user profiles
alter table public.user_profiles
  add column if not exists body_fat_goal numeric(5,2);

-- 2. New body_fat_logs table
create table public.body_fat_logs (
  id          text        primary key,
  user_id     uuid        not null references auth.users(id) on delete cascade,
  date        date        not null,
  percentage  numeric(5,2) not null check (percentage >= 2 and percentage <= 60),
  method      text        not null default 'visual'
                          check (method in ('inbody','dexa','smart_scale','calipers','navy','visual')),
  notes       text,
  created_at  timestamptz default now()
);

-- 3. Index for fast per-user queries ordered by date
create index body_fat_logs_user_date on public.body_fat_logs(user_id, date desc);

-- 4. RLS — users can only read/write their own entries
alter table public.body_fat_logs enable row level security;

create policy "body_fat_logs: own data only"
  on public.body_fat_logs for all
  using (auth.uid() = user_id);
```

---

## 📊 Constants (`src/data/constants.js`)

Add two new exports at the bottom of the file:

```js
// BF% category ranges by gender (ACE standard)
export const BF_CATEGORIES = {
  male: [
    { label: 'Essential Fat', min: 2,  max: 5,  color: '#4ECDC4' },
    { label: 'Athlete',       min: 6,  max: 13, color: '#51CF66' },
    { label: 'Fitness',       min: 14, max: 17, color: '#82C91E' },
    { label: 'Average',       min: 18, max: 24, color: '#FFD166' },
    { label: 'High',          min: 25, max: 100,color: '#FF6B6B' },
  ],
  female: [
    { label: 'Essential Fat', min: 10, max: 13, color: '#4ECDC4' },
    { label: 'Athlete',       min: 14, max: 20, color: '#51CF66' },
    { label: 'Fitness',       min: 21, max: 24, color: '#82C91E' },
    { label: 'Average',       min: 25, max: 31, color: '#FFD166' },
    { label: 'High',          min: 32, max: 100,color: '#FF6B6B' },
  ],
};

// Measurement methods for the log modal selector
export const BF_METHODS = [
  { id: 'inbody',      label: 'InBody Scan',       note: '±1–2%' },
  { id: 'dexa',        label: 'DEXA Scan',          note: '±1% (most accurate)' },
  { id: 'smart_scale', label: 'Smart Scale (BIA)',  note: '±3–8%' },
  { id: 'calipers',    label: 'Skinfold Calipers',  note: '±3–5%' },
  { id: 'navy',        label: 'Navy Method',        note: '±3–4% (calculated)' },
  { id: 'visual',      label: 'Visual / Other',     note: '' },
];
```

Also add a helper function to `src/utils/calculations.js` (or verify it already exists):

```js
/**
 * Classify a BF% reading into a category using ACE ranges.
 * @param {number} pct - Body fat percentage
 * @param {'male'|'female'|'other'} gender
 * @returns {{ label: string, color: string } | null}
 */
export const getBFCategory = (pct, gender = 'male') => {
  const cats = BF_CATEGORIES[gender === 'female' ? 'female' : 'male'];
  return cats.find(c => pct >= c.min && pct <= c.max) || cats[cats.length - 1];
};
```

Also verify the **Navy Method calculator** exists. Per `UX-9.1` in `TODO-ux-audit.md`, the spec says:

```js
export const calcBodyFat = (gender, waist, neck, height, hips = 0) => {
  if (gender === 'male')
    return +(495 / (1.0324 - 0.19077 * Math.log10(waist - neck) + 0.15456 * Math.log10(height)) - 450).toFixed(1);
  else
    return +(495 / (1.29579 - 0.35004 * Math.log10(waist + hips - neck) + 0.22100 * Math.log10(height)) - 450).toFixed(1);
};
```

If this is not yet in `calculations.js`, add it now.

---

## 🔄 AppContext Changes

**File:** `src/context/AppContext.jsx`

### Step 1 — Add `bodyFatLog` state alongside existing health/weight logs

```js
// Near other log state declarations (search for healthLogs):
const [bodyFatLogState, setBodyFatLogState] = useState([]);
```

### Step 2 — Add to `createSyncSetter` pattern for cloud sync

```js
// Cloud-backed setter (same pattern as workoutLogs, healthLogs, etc.)
const setBodyFatLog = createSyncSetter(
  'body_fat_logs',
  bodyFatLogState,
  setBodyFatLogState,
  (entry, userId) => ({
    id:         entry.id,
    user_id:    userId,
    date:       entry.date,
    percentage: entry.percentage,
    method:     entry.method || 'visual',
    notes:      entry.notes || null,
    created_at: entry.createdAt ? new Date(entry.createdAt).toISOString() : new Date().toISOString(),
  })
);
```

### Step 3 — Load from Supabase inside `loadCloudData`

```js
// Inside loadCloudData(), alongside the workout_logs fetch:
const { data: bfRows } = await supabase
  .from('body_fat_logs')
  .select('*')
  .eq('user_id', userId)
  .order('date', { ascending: false });

const cloudBF = (bfRows || []).map(row => ({
  id:          row.id,
  userId:      row.user_id,
  date:        row.date,
  percentage:  parseFloat(row.percentage),
  method:      row.method,
  notes:       row.notes || '',
  createdAt:   new Date(row.created_at).getTime(),
}));
setBodyFatLogState(cloudBF);
```

### Step 4 — `updateProfile` already handles `bodyFatGoal`

In the existing `keyMap` inside `updateProfile`, add:
```js
bodyFatGoal: 'body_fat_goal',
```

### Step 5 — Expose via context value

```js
// Add to the value object:
bodyFatLog: bodyFatLogState,
setBodyFatLog,
```

---

## 👤 Profile Page Changes

**File:** `src/components/pages/ProfilePage.jsx`

Add a new **"Body Composition"** card between the BMI/BMR/TDEE stats strip and the Muscle Mastery section.

### New state inside ProfilePage

```js
const [showBFLog, setShowBFLog]   = useState(false);  // modal open/close
const [bfForm, setBFForm]         = useState({
  date: tod(),
  percentage: '',
  method: 'inbody',
  notes: '',
});
const [showNavyCalc, setShowNavyCalc] = useState(false);
const [navyMeasures, setNavyMeasures] = useState({
  waist: '', neck: '', hips: '', height: user?.height || '',
});
```

### Derived values

```js
// Consume from AppContext:
const { bodyFatLog, setBodyFatLog, updateProfile } = useApp();

// Latest BF% entry for this user
const userBFLog = bodyFatLog
  .filter(e => e.userId === user?.id)
  .sort((a, b) => new Date(b.date) - new Date(a.date));

const latestBF = userBFLog[0] || null;
const bfCat    = latestBF ? getBFCategory(latestBF.percentage, user?.gender) : null;
```

### Body Composition Card JSX

Position this card just before the **Muscle Mastery** section:

```jsx
{/* ── BODY COMPOSITION ─────────────────────────────── */}
<div className="glass-card" style={{
  padding: '20px 24px', borderRadius: 20, marginBottom: 32, position: 'relative',
}}>
  {/* Header row */}
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
    <div>
      <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase',
        letterSpacing: '0.12em', color: 'var(--on-surface-dim)', marginBottom: 4 }}>
        Body Composition
      </div>
      <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700,
        fontSize: 22, color: 'var(--on-surface)', lineHeight: 1 }}>
        {latestBF
          ? <>{latestBF.percentage.toFixed(1)}<span style={{ fontSize: 14, color: 'var(--on-surface-variant)', marginLeft: 3 }}>%</span></>
          : <span style={{ fontSize: 16, color: 'var(--on-surface-dim)' }}>Not logged</span>}
      </div>
      {latestBF && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
          <span style={{
            fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 6,
            background: `${bfCat?.color}22`, color: bfCat?.color,
            textTransform: 'uppercase', letterSpacing: '0.08em',
          }}>
            {bfCat?.label}
          </span>
          <span style={{ fontSize: 10, color: 'var(--on-surface-dim)' }}>
            via {BF_METHODS.find(m => m.id === latestBF.method)?.label}
          </span>
        </div>
      )}
    </div>

    {/* Right side: target + log button */}
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
      {/* Log button */}
      <button
        className="btn-p"
        onClick={() => setShowBFLog(true)}
        style={{ padding: '8px 16px', fontSize: 12, borderRadius: 12 }}
      >
        + Log BF%
      </button>
      {/* Target */}
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontSize: 10, color: 'var(--on-surface-dim)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Target
        </div>
        <div
          style={{ fontSize: 13, fontWeight: 700, color: 'var(--primary)', cursor: 'pointer' }}
          onClick={() => {
            const val = prompt(`Set your target body fat % (current: ${user?.bodyFatGoal ?? 'not set'})`);
            const num = parseFloat(val);
            if (!isNaN(num) && num >= 2 && num <= 60) updateProfile({ bodyFatGoal: num });
          }}
        >
          {user?.bodyFatGoal ? `${user.bodyFatGoal}%` : 'Set goal →'}
        </div>
      </div>
    </div>
  </div>

  {/* Recent entries list (last 4) */}
  {userBFLog.length > 0 ? (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {userBFLog.slice(0, 4).map((entry, i) => {
        const cat = getBFCategory(entry.percentage, user?.gender);
        return (
          <div key={entry.id} style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '10px 14px', borderRadius: 12,
            background: i === 0 ? 'var(--surface-container)' : 'var(--surface-container-lowest)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                background: cat?.color,
              }} />
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--on-surface)' }}>
                  {entry.percentage.toFixed(1)}%
                </div>
                <div style={{ fontSize: 10, color: 'var(--on-surface-dim)' }}>
                  {BF_METHODS.find(m => m.id === entry.method)?.label}
                </div>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 11, color: 'var(--on-surface-variant)' }}>
                {fmt(entry.date)}
              </div>
              {/* Delta vs previous entry */}
              {i < userBFLog.length - 1 && (() => {
                const prev = userBFLog[i + 1];
                const delta = (entry.percentage - prev.percentage).toFixed(1);
                const isDown = delta < 0;
                return (
                  <div style={{ fontSize: 10, fontWeight: 700,
                    color: isDown ? '#51CF66' : '#FF6B6B' }}>
                    {isDown ? '▼' : '▲'} {Math.abs(delta)}%
                  </div>
                );
              })()}
            </div>
          </div>
        );
      })}
    </div>
  ) : (
    <div style={{ textAlign: 'center', padding: '16px 0', fontSize: 12,
      color: 'var(--on-surface-dim)', fontStyle: 'italic' }}>
      Log your first reading from an InBody, DEXA, or smart scale scan to start tracking.
    </div>
  )}
</div>
```

### Log BF% Modal

The modal opens when `showBFLog === true`. Use an existing `Portal` + `.mo` + `.md` pattern.

Key fields:
1. **Date** — date input, default today
2. **Body Fat %** — number input, step `0.1`, min `2`, max `60`, required
3. **Method selector** — 6 pill buttons (the `BF_METHODS` array)
4. **Navy Method calculator** — collapsible section when `method === 'navy'` (see below)
5. **Notes** — optional short text input

```jsx
{showBFLog && (
  <div className="mo" onClick={e => e.target === e.currentTarget && setShowBFLog(false)}>
    <div className="md" style={{ maxWidth: 420, padding: '28px 24px' }}>
      <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700,
        fontSize: 18, marginBottom: 20, color: 'var(--on-surface)' }}>
        Log Body Fat %
      </div>

      {/* Date */}
      <div style={{ marginBottom: 16 }}>
        <div className="label-md" style={{ marginBottom: 6, color: 'var(--on-surface-dim)' }}>Date</div>
        <input
          type="date"
          value={bfForm.date}
          max={tod()}
          onChange={e => setBFForm(p => ({ ...p, date: e.target.value }))}
          style={{ width: '100%', padding: '10px 14px', borderRadius: 10,
            background: 'var(--surface-container-highest)', border: 'none',
            color: 'var(--on-surface)', fontSize: 14 }}
        />
      </div>

      {/* BF% input */}
      <div style={{ marginBottom: 16 }}>
        <div className="label-md" style={{ marginBottom: 6, color: 'var(--on-surface-dim)' }}>Body Fat %</div>
        <div style={{ position: 'relative' }}>
          <input
            type="number"
            inputMode="decimal"
            placeholder="e.g. 18.5"
            value={bfForm.percentage}
            min="2" max="60" step="0.1"
            onChange={e => setBFForm(p => ({ ...p, percentage: e.target.value }))}
            style={{ width: '100%', padding: '12px 44px 12px 14px', borderRadius: 10,
              background: 'var(--surface-container-highest)', border: 'none',
              color: 'var(--on-surface)', fontSize: 20, fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700 }}
          />
          <span style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
            fontSize: 16, color: 'var(--on-surface-variant)', fontWeight: 700 }}>%</span>
        </div>
        {/* Live category preview */}
        {bfForm.percentage && !isNaN(parseFloat(bfForm.percentage)) && (() => {
          const cat = getBFCategory(parseFloat(bfForm.percentage), user?.gender);
          return (
            <div style={{ marginTop: 6, fontSize: 11, fontWeight: 700,
              color: cat.color, letterSpacing: '0.08em' }}>
              ● {cat.label} range
            </div>
          );
        })()}
      </div>

      {/* Method selector */}
      <div style={{ marginBottom: 16 }}>
        <div className="label-md" style={{ marginBottom: 8, color: 'var(--on-surface-dim)' }}>
          How was it measured?
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {BF_METHODS.map(m => (
            <button key={m.id}
              onClick={() => setBFForm(p => ({ ...p, method: m.id }))}
              style={{
                padding: '7px 12px', borderRadius: 10, border: 'none', cursor: 'pointer',
                fontSize: 11, fontWeight: 700, transition: 'all .15s',
                background: bfForm.method === m.id
                  ? 'var(--primary-container)' : 'var(--surface-container-highest)',
                color: bfForm.method === m.id ? '#fff' : 'var(--on-surface-variant)',
              }}>
              {m.label}
            </button>
          ))}
        </div>
        {bfForm.method !== 'visual' && bfForm.method !== 'navy' && (
          <div style={{ marginTop: 6, fontSize: 10, color: 'var(--on-surface-dim)' }}>
            Accuracy: {BF_METHODS.find(m => m.id === bfForm.method)?.note}
          </div>
        )}
      </div>

      {/* Navy Method Calculator (collapsible — shows when method === 'navy') */}
      {bfForm.method === 'navy' && (
        <div style={{ marginBottom: 16, padding: '14px', borderRadius: 12,
          background: 'var(--surface-container-lowest)' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--primary)',
            textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>
            Navy Method Calculator
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {/* Waist */}
            <div>
              <div style={{ fontSize: 10, color: 'var(--on-surface-dim)', marginBottom: 4 }}>
                Waist (cm)
              </div>
              <input type="number" inputMode="decimal"
                value={navyMeasures.waist}
                onChange={e => setNavyMeasures(p => ({ ...p, waist: e.target.value }))}
                placeholder="at navel"
                style={{ width: '100%', padding: '8px 10px', borderRadius: 8,
                  background: 'var(--surface-container-highest)', border: 'none',
                  color: 'var(--on-surface)', fontSize: 13 }}
              />
            </div>
            {/* Neck */}
            <div>
              <div style={{ fontSize: 10, color: 'var(--on-surface-dim)', marginBottom: 4 }}>
                Neck (cm)
              </div>
              <input type="number" inputMode="decimal"
                value={navyMeasures.neck}
                onChange={e => setNavyMeasures(p => ({ ...p, neck: e.target.value }))}
                placeholder="narrowest point"
                style={{ width: '100%', padding: '8px 10px', borderRadius: 8,
                  background: 'var(--surface-container-highest)', border: 'none',
                  color: 'var(--on-surface)', fontSize: 13 }}
              />
            </div>
            {/* Hips — only for female */}
            {user?.gender === 'female' && (
              <div>
                <div style={{ fontSize: 10, color: 'var(--on-surface-dim)', marginBottom: 4 }}>
                  Hips (cm)
                </div>
                <input type="number" inputMode="decimal"
                  value={navyMeasures.hips}
                  onChange={e => setNavyMeasures(p => ({ ...p, hips: e.target.value }))}
                  placeholder="widest point"
                  style={{ width: '100%', padding: '8px 10px', borderRadius: 8,
                    background: 'var(--surface-container-highest)', border: 'none',
                    color: 'var(--on-surface)', fontSize: 13 }}
                />
              </div>
            )}
            {/* Height */}
            <div>
              <div style={{ fontSize: 10, color: 'var(--on-surface-dim)', marginBottom: 4 }}>
                Height (cm)
              </div>
              <input type="number" inputMode="decimal"
                value={navyMeasures.height}
                onChange={e => setNavyMeasures(p => ({ ...p, height: e.target.value }))}
                style={{ width: '100%', padding: '8px 10px', borderRadius: 8,
                  background: 'var(--surface-container-highest)', border: 'none',
                  color: 'var(--on-surface)', fontSize: 13 }}
              />
            </div>
          </div>
          {/* Calculate button */}
          <button
            style={{ marginTop: 10, width: '100%', padding: '9px', borderRadius: 8,
              background: 'var(--surface-container-highest)', border: 'none', cursor: 'pointer',
              fontSize: 12, fontWeight: 700, color: 'var(--primary)' }}
            onClick={() => {
              const { waist, neck, hips, height } = navyMeasures;
              if (!waist || !neck || !height) return;
              const result = calcBodyFat(
                user?.gender || 'male',
                parseFloat(waist), parseFloat(neck), parseFloat(height),
                parseFloat(hips || 0)
              );
              if (!isNaN(result) && result > 0) {
                setBFForm(p => ({ ...p, percentage: String(result) }));
              }
            }}
          >
            Calculate & Pre-fill
          </button>
          <div style={{ fontSize: 9, color: 'var(--on-surface-dim)', marginTop: 6 }}>
            Accuracy ±3–4%. Use for trend tracking, not absolute values.
          </div>
        </div>
      )}

      {/* Notes */}
      <div style={{ marginBottom: 20 }}>
        <div className="label-md" style={{ marginBottom: 6, color: 'var(--on-surface-dim)' }}>
          Notes (optional)
        </div>
        <input
          type="text"
          placeholder="e.g. Post Cult.fit InBody scan"
          value={bfForm.notes}
          onChange={e => setBFForm(p => ({ ...p, notes: e.target.value }))}
          style={{ width: '100%', padding: '10px 14px', borderRadius: 10,
            background: 'var(--surface-container-highest)', border: 'none',
            color: 'var(--on-surface)', fontSize: 14 }}
        />
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 10 }}>
        <button className="btn-g"
          style={{ flex: 1, padding: '12px' }}
          onClick={() => setShowBFLog(false)}>
          Cancel
        </button>
        <button className="btn-p"
          style={{ flex: 2, padding: '12px' }}
          disabled={!bfForm.percentage || isNaN(parseFloat(bfForm.percentage))}
          onClick={() => {
            const pct = parseFloat(bfForm.percentage);
            if (isNaN(pct) || pct < 2 || pct > 60) return;
            setBodyFatLog(prev => [
              ...prev.filter(e => !(e.userId === user.id && e.date === bfForm.date)), // dedup by date
              {
                id: gId(),
                userId: user.id,
                date: bfForm.date,
                percentage: pct,
                method: bfForm.method,
                notes: bfForm.notes.trim(),
                createdAt: Date.now(),
              },
            ]);
            addToast('Body fat % logged!', 'success');
            setShowBFLog(false);
            setBFForm({ date: tod(), percentage: '', method: 'inbody', notes: '' });
          }}>
          Save Entry
        </button>
      </div>
    </div>
  </div>
)}
```

---

## 🏠 Dashboard Changes

**File:** `src/components/pages/DashboardPage.jsx`

### New imports needed

```js
// Add to the existing Lucide import line:
import { Flame, Trophy, Target, ..., Droplets, TrendingDown, TrendingUp,
         Percent } from 'lucide-react'; // ← add Percent

// Add from constants:
import { BF_CATEGORIES } from '../../data/constants';

// Add from calculations:
import { getBFCategory } from '../../utils/calculations';
```

### New derived values (add after existing `bmi`, `trend`, etc.)

```js
// Body fat — from AppContext
const { bodyFatLog } = useApp();

// Per-user BF% log, sorted newest first
const userBFLog = useMemo(() =>
  bodyFatLog
    .filter(e => e.userId === user?.id)
    .sort((a, b) => new Date(b.date) - new Date(a.date)),
  [bodyFatLog, user?.id]
);

const latestBF      = userBFLog[0] || null;
const previousBF    = userBFLog[1] || null;
const bfDelta       = latestBF && previousBF
  ? +(latestBF.percentage - previousBF.percentage).toFixed(1) : null;
const bfCat         = latestBF ? getBFCategory(latestBF.percentage, user?.gender) : null;
const bfGoal        = user?.bodyFatGoal || null;

// Chart data — last 90 days, chronological order for Recharts
const bfChartData = useMemo(() => {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 90);
  return [...userBFLog]
    .filter(e => new Date(e.date) >= cutoff)
    .reverse() // chronological
    .map(e => ({ date: fmt(e.date), pct: e.percentage, method: e.method }));
}, [userBFLog]);
```

### Body Composition Card JSX

Place this full-width card **after the Weight Trend chart (Row 4) and before the Weight Goal card (Row 5)**:

```jsx
{/* ═══════════════════════════════════════════════════════════ */}
{/* BODY COMPOSITION CARD                                       */}
{/* ═══════════════════════════════════════════════════════════ */}

{latestBF ? (
  /* ── CARD: data exists ─────────────────────────────────── */
  <div className="glass-card" style={{
    padding: 24, borderRadius: 16, marginBottom: 16,
    display: 'grid', gridTemplateColumns: '1fr 1.6fr 0.9fr',
    gap: 20, alignItems: 'center',
  }}>

    {/* LEFT: Current BF% + category */}
    <div>
      <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase',
        letterSpacing: '0.15em', color: 'var(--on-surface-variant)', marginBottom: 4 }}>
        Body Fat
      </div>
      <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800,
        fontSize: 'clamp(2rem, 5vw, 2.5rem)', color: 'var(--on-surface)',
        lineHeight: 1, letterSpacing: '-0.04em' }}>
        {latestBF.percentage.toFixed(1)}
        <span style={{ fontSize: '1rem', color: 'var(--on-surface-variant)',
          marginLeft: 2, fontWeight: 700 }}>%</span>
      </div>
      {/* Category badge */}
      <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: bfCat?.color }} />
        <span style={{ fontSize: 11, fontWeight: 700, color: bfCat?.color }}>
          {bfCat?.label}
        </span>
      </div>
      {/* Delta vs previous reading */}
      {bfDelta !== null && (
        <div style={{ marginTop: 6, fontSize: 11, fontWeight: 700,
          color: bfDelta < 0 ? '#51CF66' : bfDelta > 0 ? '#FF6B6B' : 'var(--on-surface-dim)',
          display: 'flex', alignItems: 'center', gap: 3 }}>
          {bfDelta < 0 ? <TrendingDown size={12} /> : bfDelta > 0 ? <TrendingUp size={12} /> : null}
          {bfDelta === 0 ? 'No change' : `${bfDelta > 0 ? '+' : ''}${bfDelta}% vs prev`}
        </div>
      )}
      <div style={{ fontSize: 9, color: 'var(--on-surface-dim)', marginTop: 4 }}>
        {fmt(latestBF.date)} · {BF_METHODS.find(m => m.id === latestBF.method)?.label || latestBF.method}
      </div>
    </div>

    {/* CENTER: Trend mini-chart */}
    <div>
      {bfChartData.length >= 2 ? (
        <ResponsiveContainer width="100%" height={80}>
          <AreaChart data={bfChartData} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="bf-gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor={bfCat?.color || '#F85F1B'} stopOpacity={0.35} />
                <stop offset="95%" stopColor={bfCat?.color || '#F85F1B'} stopOpacity={0}   />
              </linearGradient>
            </defs>
            <Tooltip
              cursor={false}
              contentStyle={{
                background: 'var(--glass-bg)', backdropFilter: 'var(--glass-blur-sm)',
                border: 'none', borderRadius: 10, fontSize: 11,
                color: 'var(--on-surface)', fontWeight: 700,
              }}
              formatter={(val) => [`${val}%`, 'Body Fat']}
            />
            {/* Goal reference line if set */}
            {bfGoal && (
              <ReferenceLine y={bfGoal} stroke="var(--primary)" strokeDasharray="4 4"
                label={{ value: `Goal ${bfGoal}%`, fill: 'var(--primary)', fontSize: 9,
                  position: 'insideTopRight' }} />
            )}
            <Area
              type="monotone" dataKey="pct"
              stroke={bfCat?.color || 'var(--primary-container)'}
              strokeWidth={2}
              fill="url(#bf-gradient)"
              dot={false}
              activeDot={{ r: 4, fill: bfCat?.color || 'var(--primary)', strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      ) : (
        <div style={{ height: 80, display: 'flex', alignItems: 'center',
          justifyContent: 'center', fontSize: 11, color: 'var(--on-surface-dim)' }}>
          Log 2+ readings to see trend
        </div>
      )}
    </div>

    {/* RIGHT: Goal + progress */}
    <div style={{ textAlign: 'right' }}>
      {bfGoal ? (
        <>
          <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase',
            letterSpacing: '0.12em', color: 'var(--on-surface-dim)', marginBottom: 6 }}>
            Goal
          </div>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800,
            fontSize: 22, color: 'var(--primary)', lineHeight: 1 }}>
            {bfGoal}%
          </div>
          {/* Gap to goal */}
          <div style={{ fontSize: 11, color: 'var(--on-surface-variant)', marginTop: 6 }}>
            {latestBF.percentage > bfGoal
              ? <><span style={{ color: '#51CF66', fontWeight: 700 }}>
                  {(latestBF.percentage - bfGoal).toFixed(1)}% to go
                </span></>
              : <span style={{ color: '#51CF66', fontWeight: 700 }}>✓ Goal reached!</span>}
          </div>
          {/* Thin progress bar */}
          <div style={{ marginTop: 10, height: 4, borderRadius: 2,
            background: 'var(--surface-container-highest)', overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: 2,
              background: `linear-gradient(90deg, ${bfCat?.color || 'var(--primary)'}, var(--primary))`,
              width: `${Math.min(100, Math.max(0,
                ((bfGoal - latestBF.percentage) /
                 (bfGoal - (userBFLog[userBFLog.length - 1]?.percentage || bfGoal + 5))) * 100
              ))}%`,
              transition: 'width .3s var(--ease-smooth)',
            }} />
          </div>
          <div style={{ fontSize: 9, color: 'var(--on-surface-dim)', marginTop: 4 }}>
            Started at {userBFLog[userBFLog.length - 1]?.percentage?.toFixed(1) ?? '—'}%
          </div>
        </>
      ) : (
        <div style={{ fontSize: 11, color: 'var(--on-surface-dim)', fontStyle: 'italic', lineHeight: 1.5 }}>
          Set a goal on your profile
        </div>
      )}
    </div>
  </div>
) : (
  /* ── EMPTY STATE: no readings logged yet ──────────────── */
  <div className="glass-card" style={{
    padding: '20px 24px', borderRadius: 16, marginBottom: 16,
    display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
  }}>
    <div>
      <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase',
        letterSpacing: '0.15em', color: 'var(--on-surface-dim)', marginBottom: 6 }}>
        Body Fat %
      </div>
      <div style={{ fontSize: 13, color: 'var(--on-surface-variant)', lineHeight: 1.5 }}>
        Track your body composition journey.<br />
        Log your first reading from an InBody,<br />
        DEXA, or smart scale scan.
      </div>
    </div>
    <button
      className="btn-p"
      onClick={() => navigate('/profile')}
      style={{ flexShrink: 0, padding: '10px 18px', fontSize: 12, borderRadius: 12 }}
    >
      Log BF% →
    </button>
  </div>
)}
```

**⚠️ Responsive note:** The 3-column `gridTemplateColumns: '1fr 1.6fr 0.9fr'` will look cramped on mobile (< 480px). Add a media query in `index.css` or use the `.g2` pattern to collapse to a 2-row layout:

```css
/* index.css — add with other responsive rules */
@media (max-width: 480px) {
  .bf-card-grid {
    grid-template-columns: 1fr 1fr !important;
    grid-template-rows: auto auto;
  }
  .bf-card-chart {
    grid-column: 1 / -1;  /* chart spans full width on second row */
    order: 3;
  }
}
```

Apply `className="bf-card-grid"` on the grid div and `className="bf-card-chart"` on the chart div.

---

## 📦 Required Recharts Imports (DashboardPage)

`ReferenceLine` may not yet be imported. Verify the existing Recharts import includes it:

```js
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine,  // ← ensure ReferenceLine is here
} from 'recharts';
```

---

## ✅ Implementation Checklist

### Supabase
- [ ] Run `supabase/migrations/20260417_body_fat_logs.sql` against your project
- [ ] Verify `body_fat_goal` column added to `user_profiles`
- [ ] Verify `body_fat_logs` table created with RLS enabled

### Constants (`src/data/constants.js`)
- [x] Add `BF_CATEGORIES` export (gender-aware ACE ranges with colors)
- [x] Add `BF_METHODS` export (6 measurement methods)

### Calculations (`src/utils/calculations.js`)
- [x] Add `getBFCategory(pct, gender)` helper function
- [x] Verify `calcBodyFat(gender, waist, neck, height, hips)` exists — add if missing

### AppContext (`src/context/AppContext.jsx`)
- [x] Add `bodyFatLogState` + `setBodyFatLogState` local state
- [x] Add `setBodyFatLog` via `createSyncSetter` (table: `body_fat_logs`)
- [x] Add `bodyFatGoal` → `body_fat_goal` to the `keyMap` inside `updateProfile`
- [x] Load `body_fat_logs` rows inside `loadCloudData`, map to camelCase shape
- [x] Expose `bodyFatLog` + `setBodyFatLog` in context value
- [x] Update `user` object to include `bodyFatGoal: profile.body_fat_goal`
- [x] *(Extra)* Write-through localStorage cache for `bodyFatLog`
- [x] *(Extra)* Account switch cleanup (clear bodyFatLog + localStorage)
- [x] *(Extra)* Added bodyFatLog to CSV export payload

### ProfilePage (`src/components/pages/ProfilePage.jsx`)
- [x] Import `getBFCategory`, `calcBodyFat`, `BF_METHODS` from constants/calculations
- [x] Import `bodyFatLog`, `setBodyFatLog` from `useApp()`
- [x] Add `showBFLog`, `bfForm`, `showNavyCalc`, `navyMeasures` state
- [x] Derive `userBFLog`, `latestBF`, `bfCat` from the log + user gender
- [x] Add Body Composition card (before Muscle Mastery section)
  - [x] Header: current BF% + category badge + method + Log button + target
  - [x] Recent entries list (last 4, with delta vs previous)
  - [x] Empty state when no readings exist
- [x] Add Log BF% modal (Portal-based)
  - [x] Date input
  - [x] BF% number input with live category preview
  - [x] Method selector (6 pill buttons)
  - [x] Navy Method calculator (collapsible, fires when `method === 'navy'`)
  - [x] Notes input
  - [x] Save creates entry in `setBodyFatLog`
- [x] *(Bug fix)* Replaced `prompt()` for goal with themed modal (Space Grotesk, live category preview)

### DashboardPage (`src/components/pages/DashboardPage.jsx`)
- [x] Import `getBFCategory`, `BF_METHODS` 
- [x] Import `bodyFatLog` from `useApp()`
- [x] Add `userBFLog`, `latestBF`, `bfDelta`, `bfCat`, `bfGoal`, `bfChartData` derived values
- [x] Add Body Composition card (between Weight Trend and Live Suggestion)
  - [x] 3-col grid: Left (current BF% + category + delta) · Center (mini trend chart) · Right (goal + progress)
  - [x] Empty state card with "Log BF% →" CTA that navigates to Profile page
  - [x] Goal reference line on chart when `bfGoal` is set
  - [x] Gradient fill color matches the current BF% category color
- [x] Add mobile-responsive CSS for `.bf-card-grid`
- [x] Verify `ReferenceLine` is in Recharts imports
- [x] *(Bug fix)* BF badge on BMI card uses theme-native surface vars (not raw hex alpha)
- [x] *(Bug fix)* Chart threshold lowered to 1 entry, dots always visible

### index.css
- [x] Add `.bf-card-grid` and `.bf-card-chart` responsive rules for `< 480px`

### QA
- [ ] Log first BF% entry from Profile → appears on Dashboard immediately
- [ ] BF% category badge color changes correctly across ranges for both genders
- [ ] Navy Method calculator pre-fills the BF% input correctly for male and female
- [ ] Setting a body fat goal on Profile → goal appears on Dashboard chart as dashed reference line
- [ ] Delta `▼ / ▲ X%` shows correct direction (green when going down, red when going up)
- [ ] Empty state on Dashboard shows "Log BF% →" CTA, navigates to Profile
- [ ] Chart data respects 90-day cutoff
- [ ] Different measurement method label shown correctly per entry
- [ ] Deduplication: logging the same date twice replaces the old entry (not duplicates)
- [ ] Data syncs to Supabase `body_fat_logs` table — verify with browser DevTools
- [ ] Refresh: BF% log persists after page reload (cloud rehydration works)
- [ ] Mobile layout: card collapses cleanly, no horizontal overflow

---

## 🚫 Out of Scope

- Automated BF% from smart scale Bluetooth integration (needs hardware API)
- Lean mass / fat mass absolute values (requires weight + BF% combined — Phase 2)
- Body fat chart on the MuscleMapPage
- Deleting individual BF% entries (can be added later, same pattern as weight log)
- Public BF% on the Iron League leaderboard (privacy concern)

---

## 🗒️ Implementation Notes

- **Delta color convention:** Green (`#51CF66`) = BF% going DOWN (losing fat = good). Red (`#FF6B6B`) = BF% going UP. This is the *opposite* of weight delta logic for a weight-loss goal — do not share delta color logic between the two features.
- **Goal progress bar direction:** Unlike weight goal (which can be gain or loss), body fat goals are almost always "reduce to X%". The progress bar fills as the user approaches their goal BF%. If `latestBF.percentage <= bfGoal`, show "✓ Goal reached" in green.
- **Method disclaimer:** The gap between DEXA and smart scale can be 8+ percentage points for the same person. The method label on each entry helps users understand why readings may jump — they should compare InBody to InBody, not InBody to smart scale. Consider adding a small tooltip or info banner in the trend chart when different methods are mixed.
- **Indian context note:** The "Thin Fat" label — people who look slim but have 30%+ body fat — is disproportionately common in India. If a male user has BMI < 25 but BF% > 25%, surface a subtle insight chip: "Your BMI appears healthy but body fat is elevated — common in Indian adults. Focus on muscle building." This can be added as a Phase 2 enhancement.
- **`updateProfile` for `bodyFatGoal`:** Since `updateProfile` handles the Supabase upsert, users can set their goal from either Profile page (the inline edit) or via a proper modal later. For v1, the `prompt()` approach is acceptable to keep scope tight; replace with a proper `ScrollPicker` modal as a follow-up.
