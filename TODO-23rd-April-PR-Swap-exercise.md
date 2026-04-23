# FitTrack Pro — Feature Sprint TODO (Final)
> Updated: 2026-04-23 · All PR badge questions confirmed · Design specs follow Kinetic Elite + taste-design standards

---

## Design System Reference (Kinetic Elite — apply to all new UI)

All new UI elements must conform to these tokens. Do not introduce new ones.

| Token | Value | Use |
|-------|-------|-----|
| `--surface-container-low` | `#1A1A1D` | Card backgrounds |
| `--surface-container` | `#212124` | Elevated cards, set rows |
| `--surface-container-high` | `#2B2B2E` | Hover, active PR row state |
| `--primary` | `#FFB59B` | Ember Peach — accent text, icons |
| `--primary-container` | `#F85F1B` | CTA fills, gradient end, PR label |
| `--signature-gradient` | `135deg, #FFB59B to #F85F1B` | Buttons, PR badge circle |
| `--on-surface` | `#EAEAF0` | Primary text |
| `--on-surface-variant` | `#E3BFB3` | Secondary text (warm) |
| `--on-surface-dim` | `#6E6E76` | Metadata, ghost labels |
| `--ember-glow` | `0 0 20px rgba(248,95,27,0.2)` | High-intensity glow |
| `--ease-spring` | — | Interactive micro-motion |
| `--ease-smooth` | — | Panel and modal transitions |

**Typography:** Space Grotesk for metrics and headings. Be Vietnam Pro for labels and body.

**Anti-patterns — never add to new UI:**
No Inter font. No neon outer glow. No pure black. No 3-column equal card grids. No emoji in UI chrome (taste-design constraint — use Lucide icons instead). No inline rgba() one-offs (use CSS vars). No overlapping elements.

---

## Confirmed PR Badge Rules

| Question | Answer |
|----------|--------|
| Badge timing | After checkmark tap — not live while typing |
| Tied PR (same weight + same reps) | No badge — must strictly exceed to earn it |
| Bodyweight sets (weight = 0) | Badge fires — PR tracked by reps only |
| PR definition weighted | Heaviest weight ever; tiebreak: most reps at that weight |
| PR definition bodyweight | Most reps ever completed |

---

## Feature 1 — Olympus League as 5th Primary Nav Item

### Confirmed Changes
- Label: "Olympus League" (rendered as two lines: "Olympus" / "League")
- Analytics (/progress) moves to NAV_MOBILE_MORE

### Files to Modify

| File | Change |
|------|--------|
| `src/data/constants.js` | Promote /muscle-map to NAV_MOBILE_MAIN; demote /progress to NAV_MOBILE_MORE |
| `src/components/layout/Layout.jsx` | Two-line tab label support; tighten padding for 5-item bar |

### Step-by-Step

**Step 1 — src/data/constants.js**

> [!WARNING]
> **GAP: Wrong object shape and icon names.** The original TODO used `{ path, label, icon }` but the actual codebase uses `{ id, label, Icon, path }`. Icons referenced (`Home`, `Apple`, `LayoutGrid`, `BarChart2`, `ClipboardList`) don't match actual imports (`LayoutDashboard`, `Salad`, `Target`, `TrendingUp`, `Clock`, `Scale`, `Ruler`). `NAV_MOBILE_MORE` was also missing Weight Log, Measurements, and Coaching items.

**Corrected code** (matches actual `constants.js` shape):

Add `Trophy` to the import line at top of constants.js:
```js
import { LayoutDashboard, Dumbbell, Target, Salad, TrendingUp, Mail, User, Clock, Scale, Ruler, Activity, Trophy } from 'lucide-react';
```

```js
export const NAV_MOBILE_MAIN = [
  { id: 'dashboard', label: 'Home',              Icon: LayoutDashboard, path: '/' },
  { id: 'splits',    label: 'Splits',             Icon: Dumbbell,        path: '/splits' },
  { id: 'workout',   label: 'Tracker',            Icon: Target,          path: '/workout' },
  { id: 'diet',      label: 'Diet',               Icon: Salad,           path: '/diet' },
  { id: 'musclemap', label: 'Olympus\nLeague',    Icon: Trophy,          path: '/muscle-map' },
];

export const NAV_MOBILE_MORE = [
  { id: 'progress',     label: 'Analytics',      Icon: TrendingUp,  path: '/progress' },
  { id: 'history',      label: 'History',        Icon: Clock,       path: '/history' },
  { id: 'weightlog',    label: 'Weight Log',     Icon: Scale,       path: '/weight-log' },
  { id: 'measurements', label: 'Measurements',   Icon: Ruler,       path: '/measurements' },
  { id: 'contact',      label: 'Coaching',       Icon: Mail,        path: '/contact' },
  { id: 'profile',      label: 'Profile',        Icon: User,        path: '/profile' },
];
```

**Step 2 — src/components/layout/Layout.jsx**

> [!WARNING]
> **GAP: Layout.jsx uses inline styles, not CSS classes.** The original TODO proposed `.bottom-tab` and `.tab-label` CSS classes, but the actual `BottomNav` component uses all inline styles. The iterator destructures `{ id, label, Icon, path }` not `item`. No CSS file changes needed.

**Corrected code** — replace the `NAV_MOBILE_MAIN.map(...)` block inside BottomNav:
```jsx
{NAV_MOBILE_MAIN.map(({ id, label, Icon, path }) => (
  <button key={id} onClick={() => { navigate(path); setShowMore(false); }} style={{
    flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
    background: 'none', border: 'none', cursor: 'pointer', padding: '6px 2px',
    color: isActive(path) ? 'var(--primary-container)' : 'var(--on-surface-variant)',
    transition: 'color .15s var(--ease-smooth)', minWidth: 0,
  }}>
    <Icon size={18} />
    <span style={{
      fontSize: 9, fontWeight: 600,
      fontFamily: "'Be Vietnam Pro', sans-serif",
      letterSpacing: '.3px', textTransform: 'uppercase',
      textAlign: 'center', lineHeight: 1.15,
      maxWidth: '100%',
    }}>
      {label.includes('\n')
        ? label.split('\n').map((line, i) => (
            <span key={i} style={{ display: 'block' }}>{line}</span>
          ))
        : label
      }
    </span>
  </button>
))}
```

> [!NOTE]
> Icon size reduced from 20→18 and gap from 4→2 to accommodate the taller two-line label within the same tab height budget.

**Step 3 — QA Checklist**
- [ ] 375px iPhone SE — 5 tabs, two-line label, no overflow
- [ ] 393px iPhone 14 Pro — comfortable, icons and labels not clipping
- [ ] 360px small Android — no horizontal scroll on nav bar
- [ ] Desktop sidebar — completely unchanged
- [ ] Active ember gradient on /muscle-map tab when on League page
- [ ] More sheet no longer contains Olympus League
- [ ] Analytics (/progress) appears in More sheet with correct label and icon

### Acceptance Criteria
- "Olympus League" two-line tab visible in primary BottomNav without opening More
- Tapping navigates to /muscle-map; active state highlights correctly
- Analytics accessible via the More sheet

---

## Feature 2 — Swapped Exercises: Pre-fill Last Weight and Reps

### Context
When a user swaps an exercise mid-session (ex.sv pattern), the replacement exercise's set rows are currently blank. After swap confirmation, look up the most recent completed set for the new exercise name in workoutLogs and pre-fill all pending (not-yet-done) set rows. Show a compact "Last session" chip beneath the exercise header.

### New Shared Utility: src/utils/exerciseHistory.js

Create this file once. Both Feature 2 and Feature 3 import from it.

```js
/**
 * exerciseHistory.js
 * Shared utilities for historical exercise data lookup.
 * Imported by WorkoutPage for swap pre-fill (F2) and PR badge (F3).
 */

const norm = (s) => s?.trim().toLowerCase() ?? '';

/**
 * Returns weight + reps of the most recent completed set for an exercise.
 * Searches workoutLogs newest-first. Returns the last done set of the first
 * matching log found (preserves that session's rep cadence).
 */
export function getLastLiftedForExercise(workoutLogs, exerciseName) {
  if (!workoutLogs?.length || !exerciseName) return null;
  const target = norm(exerciseName);
  const sorted = [...workoutLogs].sort((a, b) => new Date(b.date) - new Date(a.date));

  for (const log of sorted) {
    for (const ex of log.exercises ?? []) {
      if (norm(ex.name) !== target) continue;
      const done = (ex.sets ?? []).filter(s => s.done);
      if (!done.length) continue;
      const last = done[done.length - 1];
      return { weight: last.weight ?? 0, reps: last.reps ?? 0, date: log.date };
    }
  }
  return null;
}

/**
 * Returns the all-time PR for an exercise.
 * WEIGHTED (weight > 0): PR = heaviest weight. Tiebreak: most reps at that weight.
 * BODYWEIGHT (weight === 0): PR = most reps ever.
 */
export function getAllTimePR(workoutLogs, exerciseName) {
  if (!workoutLogs?.length || !exerciseName) return null;
  const target = norm(exerciseName);
  let pr = null;

  for (const log of workoutLogs) {
    for (const ex of log.exercises ?? []) {
      if (norm(ex.name) !== target) continue;
      for (const set of ex.sets ?? []) {
        if (!set.done) continue;
        const w = set.weight ?? 0;
        const r = set.reps ?? 0;
        if (r <= 0) continue;

        if (!pr) { pr = { weight: w, reps: r, isBodyweight: w === 0 }; continue; }

        if (w === 0) {
          if (r > pr.reps) pr = { weight: 0, reps: r, isBodyweight: true };
        } else {
          if (w > pr.weight || (w === pr.weight && r > pr.reps)) {
            pr = { weight: w, reps: r, isBodyweight: false };
          }
        }
      }
    }
  }
  return pr;
}

/**
 * Returns true if the given set STRICTLY beats the all-time PR.
 * Tied = false (design rule confirmed).
 * Bodyweight: beats if reps > pr.reps (weight ignored).
 * No prior PR: any valid set beats it — first ever IS a PR.
 */
export function beatsAllTimePR(pr, weight, reps) {
  if (!reps || reps <= 0) return false;
  if (!pr) return true;

  if (weight === 0) return reps > pr.reps;

  if (weight > pr.weight) return true;
  if (weight === pr.weight && reps > pr.reps) return true;
  return false;
}
```

### Changes to WorkoutPage.jsx (Feature 2)

> [!WARNING]
> **GAP: Multiple naming mismatches.**
> - `session.exercises` → actual code uses `session.exs`
> - `newExercise.name` → swap modal passes a plain string `newName`
> - `swappedExIndex` → actual param is `exerciseIndex`
> - `Clock` is already imported at the top of WorkoutPage — no duplicate import needed
> - The swap handler `swapExercise()` (line ~865) currently only sets `sv` — pre-fill must be added there

Add import (only the utility — `Clock` already exists in imports):
```js
import { getLastLiftedForExercise } from '../../utils/exerciseHistory';
```

**Replace the existing `swapExercise` function** (line ~865) with this combined version:
```js
const swapExercise = (exerciseIndex, newName) => {
  const history = getLastLiftedForExercise(workoutLogs, newName);

  setSession(prev => ({
    ...prev,
    exs: prev.exs.map((ex, i) => {
      if (i !== exerciseIndex) return ex;
      return {
        ...ex,
        sv: newName,
        _swapHistory: history ?? null,
        sets: ex.sets.map(set => ({
          ...set,
          weight: set.done ? set.weight : (history ? String(history.weight) : set.weight),
          reps:   set.done ? set.reps   : (history ? String(history.reps)   : set.reps),
        })),
      };
    }),
  }));
};
```

> [!IMPORTANT]
> **GAP: Weight/reps must be String.** The existing set rows store `weight` and `reps` as strings (they come from `<input type="number">`). The pre-fill values from `getLastLiftedForExercise` are numbers. Wrap with `String()` to avoid type mismatch in the input `value` prop.

"Last session" chip — render below the swapped exercise name, above set rows:
```jsx
{ex._swapHistory && !ex.sets.every(s => s.done) && (
  <div style={{
    display: 'inline-flex',
    alignItems: 'center',
    gap: 5,
    color: 'var(--on-surface-dim)',
    background: 'var(--surface-container)',
    borderRadius: 8,
    padding: '3px 10px',
    marginTop: 4,
    marginBottom: 8,
    fontFamily: 'Be Vietnam Pro, sans-serif',
    fontSize: '11px',
    letterSpacing: '0.04em',
  }}>
    <Clock size={11} color="var(--on-surface-dim)" strokeWidth={2} />
    {ex._swapHistory.weight > 0
      ? `Last: ${ex._swapHistory.weight} kg x ${ex._swapHistory.reps} reps`
      : `Last: ${ex._swapHistory.reps} reps (bodyweight)`
    }
    {' · '}
    {new Date(ex._swapHistory.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
  </div>
)}
```

### Edge Cases
- [ ] No history for new exercise — silent; sets stay empty; no chip
- [ ] Name casing mismatch — norm() handles it
- [ ] Last matching log has all done:false sets — skips to next older log
- [ ] User swaps back to original — re-runs getLastLiftedForExercise for original name
- [ ] Bodyweight exercise history — chip shows "Last: 15 reps (bodyweight)"

### Acceptance Criteria
- Swapping fills pending set rows with last session weight and reps
- "Last: X kg x Y reps · DD Mon" chip shown below exercise name
- Chip disappears once all sets are marked done
- Bodyweight swaps: reps pre-filled, weight stays 0
- Already-done sets are never overwritten

---

## Feature 3 — All-Time PR Badge on Set Rows

### Design Spec (Kinetic Elite + taste-design)

The PR badge is a restrained premium signal. It replaces the plain set-number with a 22px ember circle housing a Lucide Flame icon. The set row gains an ember left-border and a short glow pulse. No emoji anywhere in the badge chrome.

**Badge anatomy:**

```
+--------------------------------------------------+  <- .set-row.is-pr
|  NEW PR  <-- floats top-right, fades after 2.5s  |     border-left: 2.5px ember
|              only on 1st PR set per exercise      |     prFlash animation
|                                                   |
| [flame] |  80 kg  |  6 reps  |  [checkmark]      |
|    ^                                              |
|  22px circle, signature gradient, Flame 11px      |
+--------------------------------------------------+
```

Badge circle: 22x22px, border-radius 50%, background signature-gradient, Flame icon 11px white, box-shadow 0 0 8px rgba(248,95,27,0.35).

"NEW PR" label: absolute, top:-18px right:8px, Be Vietnam Pro 500, 9px, letter-spacing 0.12em, uppercase, color var(--primary-container). No pill or background — pure type signal. Only appears on the first PR set per exercise per session. Fades out after 2.5s via prLabelFade animation.

Set row when PR: border-left 2.5px solid var(--primary-container), background var(--surface-container-high), prFlash animation 700ms.

### Files to Modify

| File | Change |
|------|--------|
| `src/utils/exerciseHistory.js` | Already created in F2; getAllTimePR + beatsAllTimePR ready |
| `src/components/pages/WorkoutPage.jsx` | prMap useMemo; badge logic per set; Flame icon |
| `src/index.css` | prFlash, prLabelFade keyframes; .set-row.is-pr; .pr-badge-circle; .pr-new-label |

### Changes to WorkoutPage.jsx

> [!WARNING]
> **GAP: Same naming issues as Feature 2, plus type coercion.**
> - `session?.exercises` → `session?.exs`
> - `ex.sv?.name ?? ex.name` → `ex.sv || ex.name` (sv is a string, not an object)
> - `set.weight ?? 0` / `set.reps ?? 0` → must use `parseFloat(set.weight) || 0` / `parseFloat(set.reps) || 0` because values are **strings** from inputs
> - `setIndex` → `si` (actual iterator variable name)
> - Set row JSX had `{/* Weight input */}` **placeholders** instead of actual input/button code
> - `useMemo` is already imported

Add imports (merge into existing import line):
```js
import { getAllTimePR, beatsAllTimePR } from '../../utils/exerciseHistory';
import { Flame } from 'lucide-react';
```

PR lookup map — memoised, refreshes on exercise changes (swap triggers rebuild):
```js
const prMap = useMemo(() => {
  const map = {};
  for (const ex of session?.exs ?? []) {
    const name = ex.sv || ex.name;
    map[name] = getAllTimePR(workoutLogs, name);
  }
  return map;
}, [session?.exs, workoutLogs]);
```

Per-set badge logic (inside exercise render loop, at `ex.sets.map((s, si)` — add before the set-row div):
```js
const exName    = ex.sv || ex.name;
const pr        = prMap[exName] ?? null;
const isPR      = s.done && beatsAllTimePR(pr, parseFloat(s.weight) || 0, parseFloat(s.reps) || 0);

// "NEW PR" label fires only on the first PR set of this exercise in this session
const isFirstPR = isPR && !ex.sets
  .slice(0, si)
  .some(prev => prev.done && beatsAllTimePR(pr, parseFloat(prev.weight) || 0, parseFloat(prev.reps) || 0));
```

> [!IMPORTANT]
> **GAP: Set row JSX had placeholders.** The original TODO showed `{/* Weight input */} {/* Reps input */} {/* Checkmark button */}` placeholders. The actual implementation must preserve the existing input fields, hover handlers, rest timer, and remove-set button. Only **modify** the existing set-row div — don't replace it.

**Modifications to the existing set-row div** (line ~1084):

1. Add `is-pr` class and `position: relative` to the set-row div:
```jsx
<div className={`set-row ${isPR ? 'is-pr' : ''}`} style={{ 
  background: isPR ? 'var(--surface-container-high)' : 'var(--surface-container-low)',
  padding: 12, borderRadius: 12, transition: 'all 0.2s', position: 'relative',
  opacity: s.done ? (isPR ? 1 : 0.7) : 1,
  filter: s.done ? (isPR ? 'none' : 'grayscale(50%)') : 'none',
  borderLeft: isPR ? '2.5px solid var(--primary-container)' : 'none',
}} ...existing hover handlers... >
```

2. Replace the set-number cell (line ~1089) with PR badge logic:
```jsx
<div style={{ fontSize: 14, color: 'var(--on-surface)', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
  {isPR ? (
    <div className="pr-badge-circle" title="Personal Record">
      <Flame size={11} color="#fff" strokeWidth={2.5} />
    </div>
  ) : (
    si + 1
  )}
</div>
```

3. After the last closing `</div>` of the action buttons (before the set-row closing div), add the "NEW PR" label:
```jsx
{isFirstPR && <div className="pr-new-label">NEW PR</div>}
```
```

### CSS — src/index.css

```css
/* ── PR animations ───────────────────────────────────────────── */

@keyframes prFlash {
  0%   { box-shadow: none; background-color: var(--surface-container); }
  20%  {
    box-shadow:
      inset 0 0 0 1px rgba(248, 95, 27, 0.20),
      0 0 24px rgba(248, 95, 27, 0.30);
    background-color: var(--surface-container-high);
  }
  100% {
    box-shadow: 0 0 8px rgba(248, 95, 27, 0.08);
    background-color: var(--surface-container-high);
  }
}

@keyframes prLabelFade {
  0%   { opacity: 0; transform: translateY(5px); }
  12%  { opacity: 1; transform: translateY(0);   }
  72%  { opacity: 1; }
  100% { opacity: 0; }
}

/* ── PR set row ──────────────────────────────────────────────── */

.set-row.is-pr {
  border-left: 2.5px solid var(--primary-container);
  border-radius: 10px;
  animation: prFlash 700ms var(--ease-smooth) forwards;
  background-color: var(--surface-container-high) !important;
}

/* ── PR badge circle ─────────────────────────────────────────── */

.pr-badge-circle {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #FFB59B, #F85F1B);
  box-shadow: 0 0 8px rgba(248, 95, 27, 0.35);
  flex-shrink: 0;
  will-change: transform;
}

/* ── "NEW PR" floating type label ────────────────────────────── */

.pr-new-label {
  position: absolute;
  top: -18px;
  right: 8px;
  font-family: 'Be Vietnam Pro', sans-serif;
  font-weight: 500;
  font-size: 9px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--primary-container);
  animation: prLabelFade 2.5s var(--ease-smooth) forwards;
  pointer-events: none;
  white-space: nowrap;
  will-change: opacity, transform;
}
```

### Edge Cases (all confirmed)
- [ ] First ever set on exercise — pr is null — beatsAllTimePR returns true — badge fires
- [ ] Tied PR same weight same reps — beatsAllTimePR returns false — no badge
- [ ] Bodyweight set weight=0 — reps-only branch — badge fires if strictly more reps
- [ ] Swapped exercise — prMap uses ex.sv.name — correct PR fetched
- [ ] Un-done set checkmark removed — set.done false — isPR false — badge disappears instantly
- [ ] Multiple PR sets in one session — each row shows badge independently; NEW PR label only on first
- [ ] Current session not in workoutLogs yet — no self-contamination of PR baseline mid-session

### Acceptance Criteria
- Ember Flame circle (22px, signature gradient) in set-number cell after checkmark on a PR set
- prFlash plays for 700ms: glow + background lift
- "NEW PR" type label floats above first PR set per exercise; fades after 2.5s
- PR row: 2.5px ember left-border + elevated background persist for session
- Swapped exercises badge against new exercise's historical PR
- Tied PR — no badge
- Bodyweight — badge fires on strictly more reps ever
- First ever set on any exercise — badge fires
- Removing checkmark removes badge immediately

---

## Feature 4 — Feedback Form Under Profile Page

### Design Spec (Kinetic Elite + taste-design)
- Background: var(--surface-container-low) — matches adjacent profile glass cards
- Collapses with ChevronDown rotating 180 degrees (0.22s --ease-smooth)
- Inputs: var(--surface-container) background, no border, border-radius 10px
- Submit CTA: signature-gradient when active; var(--surface-container-highest) disabled
- Status icons: CheckCircle / AlertCircle from Lucide (no emoji in production chrome — taste-design rule)
- Tactile button: translateY(-1px) on mousedown — taste-design button feedback rule

### One-Time Setup (Outside Codebase — do once)
1. Create free account at emailjs.com
2. Add Email Service — connect Gmail vishalchaudhary28@gmail.com
3. Create Email Template with variables: {{from_name}}, {{from_email}}, {{subject}}, {{message}}, {{user_id}}, {{meta}}
   - To: vishalchaudhary28@gmail.com
   - Subject: FitTrack Feedback: {{subject}}
4. Save Service ID, Template ID, Public Key
5. Add to .env:
   ```
   VITE_EMAILJS_SERVICE_ID=service_xxxxxxx
   VITE_EMAILJS_TEMPLATE_ID=template_xxxxxxx
   VITE_EMAILJS_PUBLIC_KEY=xxxxxxxxxxxxxxx
   ```

### Files to Modify

| File | Change |
|------|--------|
| `package.json` | Add @emailjs/browser |
| `.env` | Add 3 EmailJS vars |
| `src/components/pages/ProfilePage.jsx` | Add collapsible Feedback card at the bottom |

Install:
```bash
npm install @emailjs/browser
```

### Changes to ProfilePage.jsx

> [!WARNING]
> **GAP: Wrong variable names for data access.**
> - `profile?.age`, `profile?.weight`, `profile?.name` → ProfilePage uses the `user` object from `useApp()`, not `profile` directly. The `user` object already maps all profile fields (see AppContext line ~816).
> - `session?.user?.email` / `session?.user?.id` → The `user` object already includes `user.email` and `user.id` (mapped from `session?.user?.email` at AppContext line ~817). No need to access `session` directly.
> - The `session` from `useApp()` IS the Supabase auth session, but destructuring it in ProfilePage is unnecessary — `user` already has everything needed.

Add imports:
```js
import emailjs from '@emailjs/browser';
import { MessageSquare, ChevronDown, CheckCircle, AlertCircle } from 'lucide-react';
```

Add state alongside existing profile state:
```js
const [feedbackOpen,    setFeedbackOpen]    = useState(false);
const [feedbackSubject, setFeedbackSubject] = useState('');
const [feedbackMessage, setFeedbackMessage] = useState('');
const [includeProfile,  setIncludeProfile]  = useState(true);
const [feedbackStatus,  setFeedbackStatus]  = useState('idle');
// 'idle' | 'sending' | 'sent' | 'error'
```

Submit handler (**corrected — uses `user` not `profile`/`session`**):
```js
const handleFeedbackSubmit = async () => {
  if (!feedbackMessage.trim() || feedbackStatus === 'sending') return;
  setFeedbackStatus('sending');

  const meta = includeProfile
    ? `Age: ${user?.age ?? '-'}, Weight: ${user?.weight ?? '-'} kg, Goal: ${user?.weightGoal ?? '-'} kg, Diet: ${user?.dietType ?? '-'}, Activity: ${user?.activity ?? '-'}, Gender: ${user?.gender ?? '-'}`
    : 'Not shared';

  try {
    await emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
      {
        from_name:  user?.name   || 'FitTrack User',
        from_email: user?.email  || 'anonymous',
        subject:    feedbackSubject.trim() || 'General Feedback',
        message:    feedbackMessage.trim(),
        user_id:    user?.id     || 'unknown',
        meta,
      },
      import.meta.env.VITE_EMAILJS_PUBLIC_KEY
    );
    setFeedbackStatus('sent');
    setFeedbackSubject('');
    setFeedbackMessage('');
    setTimeout(() => setFeedbackStatus('idle'), 4500);
  } catch (err) {
    console.error('[Feedback] EmailJS error:', err);
    setFeedbackStatus('error');
    setTimeout(() => setFeedbackStatus('idle'), 4500);
  }
};
```

Feedback card JSX — insert after the Settings & Actions card (after the Logout button's parent div closing tag, ~line 478), before `</div>` that closes `<div className="pg-in">`:

> [!NOTE]
> **Insertion point:** ProfilePage.jsx line ~478. The card goes between the Settings div and the closing `</div>` of the page container. The page structure is: `<> <div className="pg-in"> ... Settings card ... **INSERT HERE** </div> <ConfirmDialog/> ... </>`

```jsx
<div style={{ background: 'var(--surface-container-low)', borderRadius: 16, marginTop: 12, overflow: 'hidden' }}>

  {/* Collapsible header */}
  <button
    onClick={() => setFeedbackOpen(v => !v)}
    style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', background: 'none', border: 'none', cursor: 'pointer' }}
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <MessageSquare size={17} color="var(--primary)" strokeWidth={2} />
      <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: '0.95rem', color: 'var(--on-surface)', letterSpacing: '-0.01em' }}>
        Send Feedback
      </span>
    </div>
    <ChevronDown size={16} style={{ color: 'var(--on-surface-dim)', transform: feedbackOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.22s var(--ease-smooth)', willChange: 'transform' }} />
  </button>

  {/* Body */}
  {feedbackOpen && (
    <div style={{ padding: '0 20px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>

      <p style={{ fontFamily: 'Be Vietnam Pro, sans-serif', fontSize: '0.875rem', color: 'var(--on-surface-variant)', lineHeight: 1.6, margin: 0 }}>
        Report a bug, suggest a feature, or just say hi — I read every message.
      </p>

      {/* Subject */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <label style={{ fontFamily: 'Be Vietnam Pro, sans-serif', fontWeight: 500, fontSize: '10px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--on-surface-dim)' }}>
          Subject (optional)
        </label>
        <input
          type="text"
          value={feedbackSubject}
          onChange={e => setFeedbackSubject(e.target.value)}
          placeholder="Bug report, Feature idea, General"
          maxLength={100}
          style={{ background: 'var(--surface-container)', border: 'none', borderRadius: 10, padding: '11px 14px', color: 'var(--on-surface)', fontFamily: 'Be Vietnam Pro, sans-serif', fontSize: '0.875rem', outline: 'none', width: '100%', boxSizing: 'border-box' }}
        />
      </div>

      {/* Message */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <label style={{ fontFamily: 'Be Vietnam Pro, sans-serif', fontWeight: 500, fontSize: '10px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--on-surface-dim)' }}>
          Message *
        </label>
        <textarea
          value={feedbackMessage}
          onChange={e => setFeedbackMessage(e.target.value)}
          placeholder="Describe the issue or idea in as much detail as you like..."
          maxLength={2000}
          rows={5}
          style={{ background: 'var(--surface-container)', border: 'none', borderRadius: 10, padding: '11px 14px', color: 'var(--on-surface)', fontFamily: 'Be Vietnam Pro, sans-serif', fontSize: '0.875rem', resize: 'vertical', minHeight: 100, outline: 'none', width: '100%', boxSizing: 'border-box', lineHeight: 1.55 }}
        />
        <span style={{ fontFamily: 'Be Vietnam Pro, sans-serif', fontSize: '10px', color: 'var(--on-surface-dim)', textAlign: 'right', letterSpacing: '0.04em' }}>
          {feedbackMessage.length} / 2000
        </span>
      </div>

      {/* Profile info toggle */}
      <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
        <input
          type="checkbox"
          checked={includeProfile}
          onChange={e => setIncludeProfile(e.target.checked)}
          style={{ width: 16, height: 16, accentColor: 'var(--primary-container)', cursor: 'pointer', flexShrink: 0 }}
        />
        <span style={{ fontFamily: 'Be Vietnam Pro, sans-serif', fontSize: '0.85rem', color: 'var(--on-surface-variant)' }}>
          Include basic profile info (helps diagnose issues)
        </span>
      </label>

      {/* Submit CTA */}
      <button
        onClick={handleFeedbackSubmit}
        disabled={!feedbackMessage.trim() || feedbackStatus === 'sending'}
        onMouseDown={e => { if (!e.currentTarget.disabled) e.currentTarget.style.transform = 'translateY(-1px)'; }}
        onMouseUp={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
          padding: '13px 20px', borderRadius: 12, border: 'none', width: '100%',
          cursor: (!feedbackMessage.trim() || feedbackStatus === 'sending') ? 'not-allowed' : 'pointer',
          background: (!feedbackMessage.trim() || feedbackStatus === 'sending')
            ? 'var(--surface-container-highest)'
            : 'linear-gradient(135deg, #FFB59B, #F85F1B)',
          color: (!feedbackMessage.trim() || feedbackStatus === 'sending')
            ? 'var(--on-surface-dim)'
            : '#fff',
          fontFamily: 'Be Vietnam Pro, sans-serif', fontWeight: 600,
          fontSize: '0.875rem', letterSpacing: '0.04em',
          transition: 'background 0.2s var(--ease-smooth), transform 0.1s',
        }}
      >
        {feedbackStatus === 'sending' && 'Sending...'}
        {feedbackStatus === 'sent'    && <><CheckCircle size={14} strokeWidth={2.5} style={{ marginRight: 4 }} /> Message sent — thanks!</>}
        {feedbackStatus === 'error'   && <><AlertCircle size={14} strokeWidth={2.5} style={{ marginRight: 4 }} /> Failed — try again</>}
        {feedbackStatus === 'idle'    && 'Send Feedback'}
      </button>

    </div>
  )}
</div>
```

### Edge Cases
- [ ] Empty message — Submit disabled; no send attempted
- [ ] Not logged in or demo mode — from_email 'anonymous' — form still submits
- [ ] EmailJS 200/month quota — catch block fires error state for 4.5s
- [ ] Network offline — same error state; no crash
- [ ] Form state preserved on collapse + re-open mid-fill
- [ ] Double-tap guard — feedbackStatus === 'sending' disables button during in-flight send
- [ ] Successful send — fields clear; status resets to idle after 4.5s

### Acceptance Criteria
- Collapsible "Send Feedback" card at bottom of Profile; matches Kinetic Elite glass-card language
- ChevronDown rotates on expand/collapse (0.22s spring); willChange: transform for GPU compositing
- Subject (optional, 100ch) + Message (required, 2000ch, live char count) + profile checkbox
- Submit CTA: ghost disabled state; signature gradient active state; Lucide icon status on sent/error
- Tactile -1px translateY on mousedown
- Emails arrive at vishalchaudhary28@gmail.com with name, email, user ID, message, optional profile meta
- No page reload, no redirect, no emoji in UI chrome

---

## Implementation Order

| # | Feature | Effort | Notes |
|:-:|---------|:------:|-------|
| 1 | Olympus League nav | 30 min | constants.js + Layout two-line label |
| 2 | Feedback form | 2 hrs | EmailJS setup (10 min) + Profile card |
| 3 | Swapped exercise pre-fill | 2-3 hrs | Create exerciseHistory.js |
| 4 | PR badge | 3-4 hrs | Reuses exerciseHistory.js from step 3 |

Recommended sequence: 1 then 2 then 3 then 4.
Ship nav and feedback first (zero regression risk), then tackle 3 and 4 together using the shared utility file.

---

## Shared Utility Summary: src/utils/exerciseHistory.js

| Export | Consumer | Purpose |
|--------|----------|---------|
| `getLastLiftedForExercise(logs, name)` | Feature 2 swap pre-fill | Most recent session weight and reps |
| `getAllTimePR(logs, name)` | Feature 3 PR badge | All-time heaviest or most-reps; bodyweight branch included |
| `beatsAllTimePR(pr, weight, reps)` | Feature 3 PR badge | Strict comparison; tied = false; bodyweight = reps-only |

All three share norm() — case-insensitive, trimmed — for resilient name matching across logs.

---

## Gap Analysis Summary (Added 2026-04-23)

All gaps identified by auditing the TODO against the actual codebase. Corrections applied inline above.

### Quick Reference: All Gaps Found

| # | Feature | Gap | Severity | Fix Applied |
|:-:|---------|-----|:--------:|:-----------:|
| 1 | F1 Nav | Object shape `{path,label,icon}` doesn't match actual `{id,label,Icon,path}` | 🔴 Critical | ✅ |
| 2 | F1 Nav | Wrong icon names (Home→LayoutDashboard, Apple→Salad, etc.) | 🔴 Critical | ✅ |
| 3 | F1 Nav | NAV_MOBILE_MORE missing Weight Log, Measurements, Coaching | 🟡 Medium | ✅ |
| 4 | F1 Nav | CSS classes (`.bottom-tab`, `.tab-label`) don't exist — code uses inline styles | 🔴 Critical | ✅ |
| 5 | F2 Swap | `session.exercises` should be `session.exs` | 🔴 Critical | ✅ |
| 6 | F2 Swap | `newExercise.name` is just `newName` (string) | 🔴 Critical | ✅ |
| 7 | F2 Swap | `swappedExIndex` → actual param is `exerciseIndex` | 🟡 Medium | ✅ |
| 8 | F2 Swap | Pre-fill values (numbers) must be `String()` wrapped for input compatibility | 🟡 Medium | ✅ |
| 9 | F2 Swap | `Clock` already imported — duplicate import would error | 🟢 Minor | ✅ |
| 10 | F2 Swap | Pre-fill logic must be merged into existing `swapExercise()` function, not added separately | 🔴 Critical | ✅ |
| 11 | F3 PR | `session?.exercises` → `session?.exs` (same as F2) | 🔴 Critical | ✅ |
| 12 | F3 PR | `ex.sv?.name` → `ex.sv` is a string, use `ex.sv \|\| ex.name` | 🔴 Critical | ✅ |
| 13 | F3 PR | `set.weight ?? 0` needs `parseFloat()` since values are strings | 🔴 Critical | ✅ |
| 14 | F3 PR | `setIndex` → actual var is `si` | 🟡 Medium | ✅ |
| 15 | F3 PR | Set row JSX had placeholder comments instead of actual inputs/buttons | 🔴 Critical | ✅ |
| 16 | F4 Feedback | `profile?.age` etc. → use `user?.age` (ProfilePage uses `user` from useApp) | 🔴 Critical | ✅ |
| 17 | F4 Feedback | `session?.user?.email` → use `user?.email` (already mapped in context) | 🔴 Critical | ✅ |
| 18 | F4 Feedback | Missing exact insertion point in ProfilePage | 🟡 Medium | ✅ |

### Additional Implementation Notes

> [!IMPORTANT]
> **`@emailjs/browser` must be installed before Feature 4 can work.**
> Run: `npm install @emailjs/browser`
> And add the 3 `VITE_EMAILJS_*` vars to `.env` (see Feature 4 One-Time Setup).

> [!NOTE]
> **`exerciseHistory.js` does not exist yet.** It must be created at `src/utils/exerciseHistory.js` before Features 2 and 3. The code is provided verbatim in the "New Shared Utility" section — it is correct as-is and needs no gap fixes.

> [!NOTE]
> **PR badge CSS (Feature 3) is correct as-written.** The `@keyframes prFlash`, `prLabelFade`, `.set-row.is-pr`, `.pr-badge-circle`, and `.pr-new-label` classes should be appended to `src/index.css` — no gaps found in the CSS section.

> [!NOTE]
> **Sidebar (desktop) is unaffected.** The `NAV` array and sidebar rendering in Layout.jsx don't need changes — only `NAV_MOBILE_MAIN` and `NAV_MOBILE_MORE` + the `BottomNav` component are modified.