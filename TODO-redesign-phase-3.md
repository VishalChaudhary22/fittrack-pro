# FitTrack Pro — TODO: Iron League Page Overhaul
> **Phase:** 3 · **Created:** 2026-03-31
> **Reference design:** Stitch-generated Kinetic Elite Leaderboard HTML
> **Skill used:** `stitch-design` — `text-to-design` + `generate-design-md` workflows
> **Effort:** 🔴 Large · **Impact:** High — flagship social/gamification page
> **Files affected:** `MuscleMapPage.jsx` (major overhaul), `leaderboardData.js` (new), `AvatarInitials.jsx` (new), `PlayerDetailModal.jsx` (new)

---

## 🎯 Goal

Transform the current two-tab "Iron League" page into the editorial, podium-first leaderboard
experience designed in the Stitch reference HTML. The redesign has two distinct interaction layers:

1. **Landing View** — Matches the Stitch design: achievement banner, Global/Friends tab switcher,
   top-3 podium with player avatars, and a scrollable ranked list.
2. **Player Detail Modal** — When tapping any user in the leaderboard (or the podium), a bottom-sheet
   modal slides up showing their `BodyMapSVG` muscle anatomy picture, overall rank, and per-muscle XP breakdown.

The "My Muscles" tab (personal muscle anatomy + rank context) is **retained but reorganised** —
it becomes a third tab (`My Stats`) below the leaderboard, not replaced.

---

## ⚠️ Pre-conditions — Codebase Reality Check

### 1. This page is `MuscleMapPage.jsx` ✅
The "Iron League" branding is the `<PageHeader>` on `MuscleMapPage.jsx` (line 148).
This is the only file to rewrite. It is routed as the muscle/league page in the nav.

### 2. No Tailwind — Inline Styles + CSS Tokens Only ✅
The reference Stitch HTML uses Tailwind class names for layout. These must be **translated
to equivalent inline styles or existing `index.css` classes**. Do NOT introduce Tailwind.
The project uses vanilla CSS with `--token` variables defined in `index.css`.

### 3. Material Symbols — DO NOT ADD ❌
The Stitch HTML references Material Symbols icons (`fitness_center`, `notifications`, etc.).
The codebase uses **Lucide React** exclusively. Use equivalents:
- `fitness_center` → `<Dumbbell />`
- `notifications` → `<Bell />`
- `auto_awesome` → `<Sparkles />` or `<Zap />`
- `rewarded_ads` / crown → `<Crown />` from lucide-react
- `insights` → `<Activity />`
- `person` → `<User />`

### 4. Mock Leaderboard Data — Static for Now ✅
The real app has no multi-user backend. The leaderboard list will be **mock data hardcoded**
inside `MuscleMapPage.jsx` (same pattern as `rankBenchmarks.js`). The current user (`user`)
should be detectable in the list and highlighted as "You".

The player detail modal **for the current user** shows real XP from `calcAllMuscleXP`.
The player detail modal **for mock users** shows static mock muscle XP data.

### 5. `BodyMapSVG` Already Exists ✅
`src/components/shared/BodyMapSVG.jsx` renders a canvas-based muscle anatomy with highlight layers.
We reuse this directly in the player detail modal.

**Full prop signature:** `{ muscleXP, primaryMuscles, secondaryMuscles, mini, gender }`
- `muscleXP` — `{[key]: number}` — muscles with XP > 0 get coral-red highlights
- `gender` — `'male' | 'female'` — selects the asset directory
- `mini` — if true, renders front-view-only at 55px width

**Sizing:** The component internally renders at 640×1280 (1:2 aspect). It auto-sizes to
100% of its container's width, so to control height, **constrain the parent wrapper width**.
For the modal, wrapping `<BodyMapSVG>` in a `<div style={{ maxWidth: 200, margin: '0 auto' }}>`
will yield roughly 400px tall — appropriate for a bottom sheet.

**⚠️ Gender for mock users:** All mock users will render with the current user's `gender`
prop since we don't store per-user gender data. This is an accepted limitation.

### 6. Avatar Images — Use Generated Placeholders 🟡
The Stitch design uses real photo URLs from Google CDN (ephemeral, will break).
Generate deterministic avatar placeholder initials circles instead (same approach
used by the existing profile page). No external image CDN dependency.

### 7. Friends Tab — Deferred Stub 🟡
"Friends" tab will show an `<EmptyState>` with a "Coming Soon" message.
No backend social graph to power it. Do not attempt to implement real friends logic.

### 8. `PageHeader` + Day/Night Toggle — Keep As-Is ✅
Do NOT remove `<PageHeader title="Iron League" ... />`. The day/night toggle lives there.

---

## 🎨 Stitch Design Workflow

### Step 1 — Verify `.stitch/DESIGN.md` ✅ (already exists)
The design system file exists at `.stitch/DESIGN.md` with Kinetic Elite tokens.
No need to run the `generate-design-md` workflow. Use the existing DESIGN.md when
calling the Stitch prompt.

### Step 2 — Generate Stitch Screen (Leaderboard Landing)
Use the `stitch-design` skill's `text-to-design` workflow to generate a reference screen
for the leaderboard landing. This gives us a pixel-level design reference to code against.

**Enhanced Stitch Prompt:**

```markdown
Kinetic Elite Leaderboard — a high-performance dark gamification screen
that feels like a live sports scoreboard. Obsidian Performance aesthetic.

DESIGN SYSTEM (REQUIRED):
- Platform: Mobile-first, max-width 640px
- Palette: Ember Peach (#FFB59B) for primary accent text/icons, Burning Ember (#F85F1B)
  for CTAs and gradient fills, Obsidian Canvas (#131315) background,
  Charcoal Layer (#1A1A1D) for cards
- Typography: Space Grotesk (headlines/numbers), Be Vietnam Pro (body/labels)
- Shape: Cards 12–20px radius, pill tabs, no explicit border lines (tonal depth only)
- Atmosphere: Obsidian Performance — recessed dark, warm ember glows, glassmorphism cards

PAGE STRUCTURE:
1. Header: Sticky top bar — KINETIC ELITE wordmark (Space Grotesk, uppercase, ember orange)
   + user avatar icon left + notification bell right, frosted glass blur background.
2. Achievement Banner: Rounded card, gradient radial glow corner, headline "You are in the
   top 5%" + XP-to-next-tier label. Trophy icon with ember gradient background, 8px glow.
3. Tab Switcher: Pill-rounded container, two tabs "Global" and "Friends". Active tab uses
   ember gradient fill, inactive uses transparent with muted label.
4. Podium Section: 3-column medal layout. Center (1st) is elevated with scale-up,
   ember-ringed avatar (80px), golden crown icon above, ember gradient "1st" pill.
   Flanks (2nd, 3rd) at rest height, silver/bronze border avatars (64px).
   Each shows username beneath + XP in headline weight.
5. Scrollable Ranked List: Section header row (Rank & Athlete / Intensity Score).
   Each row: glassmorphic card, rank number, avatar circle, username + tier label,
   right-aligned XP with "XP" label below. Current user row gets left ember accent border
   + "MVP" badge inline. All rows are tappable (cursor pointer, hover bg shift).
6. Empty state for Friends tab.
```

### Step 3 — Generate Stitch Screen (Player Detail Modal)
Generate a second reference screen for the player modal popup.

**Enhanced Stitch Prompt:**

```markdown
Kinetic Elite — Athlete Profile Modal / Bottom Sheet. A slide-up overlay panel that
appears over the leaderboard when a user row is tapped.

DESIGN SYSTEM: Same as parent leaderboard screen (Kinetic Elite dark, ember accents).

MODAL STRUCTURE:
1. Drag Handle: Centered 40px × 4px pill at top of the sheet, frosted slate color.
2. Athlete Header: Avatar circle (64px) with rank-colored ring, name in Space Grotesk bold,
   rank tier badge using rank tier color. Close (X) button top-right.
3. Anatomy Heatmap: Centered full-width muscle anatomy SVG illustration. Trained muscles
   glow in ember/orange. Untrained muscles are desaturated charcoal. Proportional height ~280px.
4. Overall Rank Block: Centered — rank icon, tier name in headline, total XP.
   Horizontal XP progress bar to next tier, with tier labels.
5. Per-Muscle Breakdown: Scrollable list. Each row: muscle name left, rank badge right,
   XP value right-aligned, thin progress bar. Dividers are tonal (no lines).
6. Footer: "Close" ghost button, full-width, pill-shaped.
```

### Step 4 — Download Design Assets
After generation, download both screens' HTML + screenshots to `.stitch/designs/`.
- `iron-league-leaderboard.html`
- `iron-league-player-modal.html`

---

## 📋 Implementation Tasks

### TASK 1 — Mock Data Layer
**File:** `src/data/leaderboardData.js` [NEW]

Create a static array of mock users:

```js
// src/data/leaderboardData.js
export const MOCK_LEADERBOARD = [
  {
    id: 'marcus_k',
    name: 'marcus_k',
    tier: 'Gold III',
    totalXP: 24200,
    initials: 'MK',
    color: '#FFD700',   // gold color for avatar ring
    muscleXP: {
      chest: 3200, back: 4100, shoulders: 2800, biceps: 1900,
      triceps: 1600, traps: 1400, quads: 2600, hamstrings: 2100,
      glutes: 1800, calves: 900, abs: 1200, forearms: 600,
    },
  },
  {
    id: 'alex_fit',
    name: 'alex_fit',
    tier: 'Gold II',
    totalXP: 18400,
    initials: 'AF',
    color: '#FFD700',
    muscleXP: {
      chest: 2400, back: 3200, shoulders: 2100, biceps: 1500,
      triceps: 1200, traps: 1000, quads: 2200, hamstrings: 1800,
      glutes: 1400, calves: 700, abs: 800, forearms: 500,
    },
  },
  {
    id: 'sarah_lift',
    name: 'sarah_lift',
    tier: 'Gold I',
    totalXP: 15900,
    initials: 'SL',
    color: '#FFD700',
    muscleXP: {
      chest: 1800, back: 2800, shoulders: 1900, biceps: 1200,
      triceps: 1000, traps: 900, quads: 2100, hamstrings: 1600,
      glutes: 1800, calves: 600, abs: 1000, forearms: 400,
    },
  },
  {
    id: 'iron_master',
    name: 'iron_master',
    tier: 'Silver III',
    totalXP: 14205,
    initials: 'IM',
    color: '#C0C0C0',
    muscleXP: { chest: 1600, back: 2400, shoulders: 1700, biceps: 1100, triceps: 900, traps: 800, quads: 1900, hamstrings: 1400, glutes: 1600, calves: 500, abs: 900, forearms: 400 },
  },
  {
    id: 'velocity_vix',
    name: 'velocity_vix',
    tier: 'Silver II',
    totalXP: 12880,
    initials: 'VV',
    color: '#C0C0C0',
    muscleXP: { chest: 1400, back: 2100, shoulders: 1500, biceps: 900, triceps: 800, traps: 700, quads: 1700, hamstrings: 1200, glutes: 1400, calves: 450, abs: 780, forearms: 350 },
  },
  {
    id: 'titan_traps',
    name: 'titan_traps',
    tier: 'Silver I',
    totalXP: 11940,
    initials: 'TT',
    color: '#C0C0C0',
    muscleXP: { chest: 1200, back: 1900, shoulders: 1300, biceps: 800, triceps: 700, traps: 1800, quads: 1500, hamstrings: 1000, glutes: 1200, calves: 400, abs: 700, forearms: 300 },
  },
  {
    id: 'zen_squat',
    name: 'zen_squat',
    tier: 'Silver I',
    totalXP: 10112,
    initials: 'ZS',
    color: '#C0C0C0',
    muscleXP: { chest: 1000, back: 1600, shoulders: 1100, biceps: 700, triceps: 600, traps: 600, quads: 1900, hamstrings: 1400, glutes: 1600, calves: 500, abs: 600, forearms: 250 },
  },
];
```

**Note:** The current user (from `useApp()`) is inserted into this list at their actual XP level
and sorted to find their real rank position.

---

### TASK 2 — Avatar Initials Component
**File:** `src/components/shared/AvatarInitials.jsx` [NEW]

Reusable `<AvatarInitials>` that replaces external image URLs.

```jsx
// AvatarInitials.jsx
export default function AvatarInitials({ initials, color, size = 40, borderWidth = 2 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      border: `${borderWidth}px solid ${color}60`,
      background: `${color}15`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Space Grotesk', sans-serif",
      fontWeight: 700, fontSize: size * 0.35,
      color: color,
      flexShrink: 0,
    }}>
      {initials}
    </div>
  );
}
```

---

### TASK 3 — Player Detail Modal Component
**File:** `src/components/shared/PlayerDetailModal.jsx` [NEW]

A bottom-sheet modal that slides up from the bottom of the screen.

**Required imports inside PlayerDetailModal.jsx:**
```js
import { useState, useEffect } from 'react';
import { Trophy, Shield, X } from 'lucide-react';
import BodyMapSVG from './BodyMapSVG';
import AvatarInitials from './AvatarInitials';
import { MUSCLE_GROUPS, getRank, getOverallRank } from '../../data/muscleData';
```

**Props:**
- `player` — mock user object OR `null` for current user (renders real XP)
- `realMuscleXP` — the current user's real `calcAllMuscleXP` result (used when `player` is null)
- `realUserName` — current user's display name (used when `player` is null)
- `gender` — current user's gender (for BodyMapSVG, also used for mock users)
- `onClose` — dismiss callback

**Deriving rank inside the modal:**
```js
// The muscleXP to display — either mock user's or real user's
const displayXP = player ? player.muscleXP : realMuscleXP;
// getOverallRank takes a {key: number} object and returns {name, color, bg, progress, totalXP, nextXP}
const overall = getOverallRank(displayXP);
// For individual muscles:
MUSCLE_GROUPS.forEach(m => {
  const xp = displayXP[m.key] || 0;
  const rank = getRank(xp); // returns {name, color, bg, progress, nextXP}
});
```

**Key elements:**
1. **Backdrop** — `position: fixed, inset: 0`, semi-transparent `rgba(0,0,0,0.7)`, click to close, `z-index: 1000`
2. **Sheet** — `position: fixed, bottom: 0, left: 0, right: 0`, max-height 85vh, overflowY auto
   - Background: `var(--surface-container-low)`, border-radius `24px 24px 0 0`
   - Slide-up on mount: use CSS transform `translateY(0)` transition from `translateY(100%)`
   - `z-index: 1001`
3. **Drag handle pill** at top center (40×4px, `var(--surface-container-highest)`, borderRadius 2px)
4. **Athlete Header:** `<AvatarInitials>` + name + tier badge + `<X>` close button (top-right)
5. **`<BodyMapSVG>`** centered — wrap in `<div style={{ maxWidth: 200, margin: '0 auto' }}>` to control height
6. **Overall Rank Block:** Trophy icon + rank name + total XP + progress bar to next tier
7. **Per-Muscle Table:** scrollable list of `MUSCLE_GROUPS` with the muscle's XP from `displayXP`;
   each row: muscle label, `<RankBadge>` (or inline badge), XP number, thin progress bar.
   Sorted by XP descending.
8. **Close button** — full-width ghost pill at bottom

**Scroll lock (useEffect cleanup):**
```js
useEffect(() => {
  const prev = document.body.style.overflow;
  document.body.style.overflow = 'hidden';
  return () => { document.body.style.overflow = prev; };
}, []);
```

**Animation pattern (CSS only, no library):**
```js
// On mount: slide from bottom
const [visible, setVisible] = useState(false);
useEffect(() => { requestAnimationFrame(() => setVisible(true)); }, []);
// Sheet style:
style={{ transform: visible ? 'translateY(0)' : 'translateY(100%)', transition: 'transform .35s cubic-bezier(.4,0,.2,1)' }}
```

---

### TASK 4 — `MuscleMapPage.jsx` Overhaul
**File:** `src/components/pages/MuscleMapPage.jsx`
**Scope:** Major restructure. Preserve all existing logic, reorganise into 3 tabs.

#### 4a — New Imports
```js
import { useState, useMemo } from 'react';
import { Shield, Trophy, Crown, Zap, TrendingUp, Minus, Award, Calendar, Users } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PageHeader, EmptyState } from '../shared/SharedComponents';
import BodyMapSVG from '../shared/BodyMapSVG';
import AvatarInitials from '../shared/AvatarInitials';
import PlayerDetailModal from '../shared/PlayerDetailModal';
import { MUSCLE_GROUPS, RANK_TIERS, getRank, calcAllMuscleXP, getOverallRank } from '../../data/muscleData';
import { MONTHLY_BENCHMARKS, getBenchmarkBracket } from '../../data/rankBenchmarks';
import { MOCK_LEADERBOARD } from '../../data/leaderboardData';
```

**Icons removed vs. current file** (dead imports cleaned up):
- ❌ `ChevronRight` — imported but never used in existing JSX
- ❌ `TrendingDown` — imported but never used
- ❌ `AlertTriangle` — imported but never used
- ❌ `Bell` — not used anywhere in the page

**Icons added:**
- ✅ `Crown` — for #1 podium slot
- ✅ `Users` — for Friends empty state

#### 4b — State Changes
```js
const [activeTab, setActiveTab] = useState('leaderboard'); // 'leaderboard' | 'friends' | 'mystats'
const [selectedPlayer, setSelectedPlayer] = useState(null); // player object or null
const [filter, setFilter] = useState('all');  // KEEP — used in My Stats tab for muscle region filtering
```

**⚠️ DO NOT remove `filter` state.** It's used for the muscle filter pills in the My Stats tab.
The existing `activeTab` state (previously named the same but defaulting to `'muscles'`) is
replaced with the new 3-tab variant. The old inner sub-tab switcher
(`'muscles' | 'league'`) is removed — My Stats shows all content in a single scroll.

#### 4c — Leaderboard Computation

**⚠️ `getOverallRank` API reminder:** `getOverallRank(muscleXP)` takes a `{key: number}`
object and internally calls `Object.values(muscleXP).reduce(...)` to sum the total.
It returns `{ name, color, bg, progress, totalXP, nextXP }`. Do NOT pass a number to it.

```js
// existing (keep):
const muscleXP = useMemo(() => calcAllMuscleXP(workoutLogs, splits, user?.id), [workoutLogs, splits, user?.id]);
const overall = useMemo(() => getOverallRank(muscleXP), [muscleXP]);

// NEW: Build and sort the full leaderboard including the real user
const fullLeaderboard = useMemo(() => {
  const meEntry = {
    id: user?.id || 'vishal',
    name: 'You',
    isMe: true,
    totalXP: overall.totalXP,
    tier: overall.name,         // computed rank name ("Bronze I", "Silver II", etc.)
    initials: (user?.name || 'VC').slice(0, 2).toUpperCase(),
    color: '#FFB59B',  // primary color
    muscleXP: muscleXP,
  };
  return [...MOCK_LEADERBOARD, meEntry]
    .sort((a, b) => b.totalXP - a.totalXP)
    .map((p, i) => ({ ...p, rank: i + 1 }));
}, [overall.totalXP, overall.name, muscleXP, user]);

const podium = fullLeaderboard.slice(0, 3);
const myRank = fullLeaderboard.find(p => p.isMe)?.rank;
```

**Note:** `remainingList` is removed from the proposed code — the full list renders all
ranks (not just 4+) so we iterate `fullLeaderboard` directly.

#### 4d — JSX Structure

```jsx
return (
  <div className="pg-in">
    <PageHeader title="Iron League" sub="Your monthly strength league — climb the ranks" />

    {/* ── 3-TAB SWITCHER ────────────────────────────────── */}
    <nav style={{ display: 'flex', gap: 4, marginBottom: 20, background: 'var(--surface-container-highest)', borderRadius: 14, padding: 4 }}>
      {[
        { key: 'leaderboard', label: 'Global' },
        { key: 'friends',     label: 'Friends' },
        { key: 'mystats',     label: 'My Stats' },
      ].map(t => (
        <button key={t.key} onClick={() => setActiveTab(t.key)} style={{
          flex: 1, padding: '11px 8px', borderRadius: 10, border: 'none', cursor: 'pointer',
          fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em',
          fontFamily: "'Space Grotesk', sans-serif",
          background: activeTab === t.key
            ? 'linear-gradient(135deg, #FFB59B, #F85F1B)'
            : 'transparent',
          color: activeTab === t.key ? '#fff' : 'var(--on-surface-variant)',
          boxShadow: activeTab === t.key ? '0 4px 12px rgba(248,95,27,0.2)' : 'none',
          transition: 'all .2s var(--ease-smooth)',
        }}>
          {t.label}
        </button>
      ))}
    </nav>


    {/* ═══════════════════════════════════════════════════ */}
    {/* TAB 1: LEADERBOARD (Global)                        */}
    {/* ═══════════════════════════════════════════════════ */}
    {activeTab === 'leaderboard' && (<>

      {/* Achievement Banner (current user's standing) */}
      <div className="glass-card" style={{
        padding: '20px', marginBottom: 20, borderRadius: 20, position: 'relative', overflow: 'hidden',
        background: 'var(--surface-container-high)',
      }}>
        {/* Radial glow top-right */}
        <div style={{
          position: 'absolute', top: -40, right: -40, width: 120, height: 120,
          background: 'rgba(248,95,27,0.1)', borderRadius: '50%', filter: 'blur(30px)',
        }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 1 }}>
          <div>
            <div style={{
              fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, color: 'var(--primary)',
              fontSize: 11, textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 6,
            }}>
              Elite Standing
            </div>
            <div style={{
              fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: '1.65rem',
              color: 'var(--on-surface)', lineHeight: 1.1, marginBottom: 6,
            }}>
              Rank #{myRank} of {fullLeaderboard.length}
            </div>
            <div style={{ fontSize: 12, color: 'var(--on-surface-variant)' }}>
              {overall.progress < 1
                ? `${Math.round(overall.nextXP - overall.totalXP).toLocaleString()} XP to next tier`
                : '✦ Max tier reached'}
            </div>
          </div>
          <div style={{
            width: 56, height: 56, borderRadius: '50%', flexShrink: 0,
            background: 'linear-gradient(135deg, #FFB59B, #F85F1B)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 24px rgba(232,84,13,0.3)',
          }}>
            <Zap size={28} color="#fff" fill="#fff" />
          </div>
        </div>
      </div>

      {/* PODIUM — Top 3 Players */}
      <section style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 16, marginBottom: 28, padding: '0 8px' }}>
        {/* Visual order: [2nd, 1st, 3rd] left-to-right. Slot index 1 is center (elevated). */}
        {[podium[1], podium[0], podium[2]].filter(Boolean).map((player, slotIndex) => {
          const isCenter = slotIndex === 1;  // center slot is rank 1
          // Medal color by actual rank, not by slot index
          const medalColor = player.rank === 1 ? 'var(--primary)'
            : player.rank === 2 ? '#C0C0C0'
            : 'var(--outline-variant)';
          const rankLabel = player.rank === 1 ? '1st' : player.rank === 2 ? '2nd' : '3rd';

          return (
            <div key={player.id} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              flex: 1, paddingBottom: isCenter ? 16 : 0, cursor: 'pointer',
            }} onClick={() => setSelectedPlayer(player)}>
              <div style={{ position: 'relative', marginBottom: isCenter ? 16 : 12 }}>
                {isCenter && (
                  <div style={{ position: 'absolute', top: -20, left: '50%', transform: 'translateX(-50%)' }}>
                    <Crown size={22} color="var(--primary)" fill="rgba(255,181,155,0.3)" />
                  </div>
                )}
                <AvatarInitials
                  initials={player.initials}
                  color={medalColor}
                  size={isCenter ? 72 : 56}
                  borderWidth={isCenter ? 4 : 2}
                />
                <div style={{
                  position: 'absolute', bottom: -10, left: '50%', transform: 'translateX(-50%)',
                  padding: '2px 10px', borderRadius: 20, fontSize: 10, fontWeight: 800,
                  fontFamily: "'Space Grotesk', sans-serif", textTransform: 'uppercase',
                  whiteSpace: 'nowrap',
                  background: isCenter ? 'linear-gradient(135deg, #FFB59B, #F85F1B)' : `${medalColor}22`,
                  color: isCenter ? '#fff' : medalColor,
                  boxShadow: isCenter ? '0 4px 12px rgba(248,95,27,0.3)' : 'none',
                }}>
                  {rankLabel}
                </div>
              </div>
              <div style={{
                fontFamily: "'Be Vietnam Pro', sans-serif",
                fontWeight: 700, fontSize: 12, color: 'var(--on-surface)', marginTop: 6,
                maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                {player.name}
              </div>
              <div style={{
                fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700,
                fontSize: isCenter ? 13 : 11, color: medalColor, marginTop: 2,
              }}>
                {player.totalXP >= 1000 ? `${(player.totalXP / 1000).toFixed(1)}K` : player.totalXP} XP
              </div>
            </div>
          );
        })}
      </section>

      {/* LIST HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 4px', marginBottom: 10 }}>
        <span style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.15em', color: 'var(--on-surface-dim)' }}>
          Rank &amp; Athlete
        </span>
        <span style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.15em', color: 'var(--on-surface-dim)' }}>
          XP Score
        </span>
      </div>

      {/* SCROLLABLE RANKED LIST (all ranks — podium users also appear here) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {fullLeaderboard.map(player => (
          <div key={player.id}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '14px 16px', borderRadius: 16, cursor: 'pointer',
              background: 'rgba(53, 52, 55, 0.4)', backdropFilter: 'blur(12px)',
              borderLeft: player.isMe ? '4px solid var(--primary)' : '4px solid transparent',
              transition: 'background .15s var(--ease-smooth)',
            }}
            onClick={() => setSelectedPlayer(player)}
            onMouseOver={e => e.currentTarget.style.background = 'rgba(53,52,55,0.7)'}
            onMouseOut={e => e.currentTarget.style.background = 'rgba(53,52,55,0.4)'}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <span style={{
                fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700,
                color: player.isMe ? 'var(--primary)' : 'var(--on-surface-variant)',
                width: 24, fontSize: 14,
              }}>
                {String(player.rank).padStart(2, '0')}
              </span>
              <AvatarInitials initials={player.initials} color={player.color} size={40} />
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--on-surface)' }}>
                    {player.name}
                  </span>
                  {player.isMe && (
                    <span style={{
                      fontSize: 9, padding: '2px 6px', borderRadius: 4,
                      background: 'rgba(255,181,155,0.2)', color: 'var(--primary)',
                      fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700,
                      textTransform: 'uppercase',
                    }}>
                      YOU
                    </span>
                  )}
                </div>
                <div style={{ fontSize: 10, color: 'var(--on-surface-variant)', textTransform: 'uppercase', letterSpacing: '.08em', marginTop: 2 }}>
                  {player.tier || getRank(player.totalXP, 'overall').name}
                </div>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{
                fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700,
                fontSize: 15, color: 'var(--on-surface)',
              }}>
                {player.totalXP >= 1000 ? `${(player.totalXP / 1000).toFixed(1)}K` : player.totalXP}
              </div>
              <div style={{ fontSize: 9, textTransform: 'uppercase', fontWeight: 700, color: player.isMe ? 'var(--primary)' : 'var(--on-surface-dim)', letterSpacing: '.08em' }}>
                XP
              </div>
            </div>
          </div>
        ))}
      </div>
    </>)}


    {/* ═══════════════════════════════════════════════════ */}
    {/* TAB 2: FRIENDS                                     */}
    {/* ═══════════════════════════════════════════════════ */}
    {activeTab === 'friends' && (
      <EmptyState
        Icon={Users}
        title="Friends Coming Soon"
        message="Connect with training partners and compete on a shared leaderboard"
      />
    )}


    {/* ═══════════════════════════════════════════════════ */}
    {/* TAB 3: MY STATS (existing muscle map view)         */}
    {/* ═══════════════════════════════════════════════════ */}
    {activeTab === 'mystats' && (<>
      {/* ── Move ALL existing JSX from both old tabs here ────────── */}
      {/* Remove the old 2-tab sub-switcher (tabs array + map).       */}
      {/* Show everything in a single scroll:                         */}
      {/*                                                             */}
      {/* FROM OLD 'muscles' TAB (lines 169–241):                     */}
      {/*   • Overall Rank Card (BodyMapSVG + rank display)           */}
      {/*   • Rank Legend (tier badges)                                */}
      {/*   • Filter Tabs (all/upper/lower/core) — uses `filter` state */}
      {/*   • MuscleCard list — filtered + sorted by XP               */}
      {/*                                                             */}
      {/* FROM OLD 'league' TAB (lines 247–468):                      */}
      {/*   • Monthly Rank Hero card (overall.name + progress bar)    */}
      {/*   • Per-Muscle League Table (grid rows)                     */}
      {/*   • Percentile Benchmarks (gradient bar + text summary)     */}
      {/*   • Monthly Rank History Timeline (horizontal scroll)       */}
      {/*                                                             */}
      {/* Required state/vars to preserve:                            */}
      {/*   - filter (useState, used for muscle region pills)          */}
      {/*   - daysInMonth, thisWeekDays, sortedMuscles, weakestMuscle */}
      {/*   - benchmark, benchmarkPct, bestMonth                      */}
      {/*   - monthlyRankHistory (from useApp context)                 */}
    </>)}


    {/* ═══════════════════════════════════════════════════ */}
    {/* PLAYER MODAL (rendered at page root level)         */}
    {/* ═══════════════════════════════════════════════════ */}
    {selectedPlayer && (
      <PlayerDetailModal
        player={selectedPlayer.isMe ? null : selectedPlayer}
        realMuscleXP={muscleXP}
        realUserName={user?.name || 'You'}
        gender={user?.gender}
        onClose={() => setSelectedPlayer(null)}
      />
    )}
  </div>
);
```

---

### ~~TASK 5 — `index.css` Additions~~ — NOT NEEDED ✅

`.glass-card` already exists at line 187 of `index.css`:
```css
.glass-card {
  background: var(--glass-bg);         /* dark: rgba(53,52,55,0.60), light: rgba(255,255,255,0.60) */
  backdrop-filter: var(--glass-blur);
  border: none;
}
```

The existing definition uses `var(--glass-bg)` at 60% opacity vs. the Stitch design's 40%.
This is fine — the leaderboard list rows use **inline** glassmorphic styles (`rgba(53,52,55,0.4)`
with `backdropFilter: 'blur(12px)'`) directly rather than the `.glass-card` class.
The `.glass-card` class is only used on the achievement banner card.

**No changes to `index.css` are required.**

**⚠️ Light theme note:** The inline `rgba(53,52,55,0.4)` glass will look wrong on the
light theme (dark tint on white background). The implementation should use
`'var(--glass-bg)'` for the list row backgrounds instead of hardcoded RGBA values, OR
fall back to `'var(--surface-container-lowest)'` on light theme. Simplest fix: use
the `glass-card` class on list rows too, accepting the 60% vs 40% difference.

---

## 📦 File Change Summary

| File | Change Type | What Changes |
|------|------------|--------------|
| `src/data/leaderboardData.js` | **[NEW]** | Static mock leaderboard with 7 users + per-muscle XP |
| `src/components/shared/AvatarInitials.jsx` | **[NEW]** | Initials avatar circle with rank-colored ring |
| `src/components/shared/PlayerDetailModal.jsx` | **[NEW]** | Slide-up sheet with BodyMapSVG + rank + muscle breakdown |
| `src/components/pages/MuscleMapPage.jsx` | **Major rewrite** | 3-tab layout, podium, ranked list, player click handling |

**Files NOT touched:** `index.css`, `WorkoutPage.jsx`, `WorkoutHistoryPage.jsx`, `DashboardPage.jsx`, `index.html`

---

## ✅ Implementation Checklist

### Stitch Design Phase
- [x] Run Stitch `text-to-design` workflow for leaderboard landing screen
- [x] Run Stitch `text-to-design` workflow for player modal screen
- [x] Download both HTML + screenshots to `.stitch/designs/`
- [x] Review generated screens, note any detail differences vs. the prompt

### New Files
- [x] Create `src/data/leaderboardData.js` with `MOCK_LEADERBOARD` array
- [x] Create `src/components/shared/AvatarInitials.jsx`
- [x] Create `src/components/shared/PlayerDetailModal.jsx`
  - [x] Backdrop + sheet structure with slide-up animation
  - [x] Athlete header (AvatarInitials + name + tier badge + close X)
  - [x] BodyMapSVG centered
  - [x] Overall rank block + progress bar
  - [x] Per-muscle scrollable list
  - [x] Close button

### MuscleMapPage.jsx
- [x] Update imports (add new components, add `Users` from lucide-react)
- [x] Add `activeTab` state (default `'leaderboard'`)
- [x] Add `selectedPlayer` state
- [x] Add `fullLeaderboard` useMemo (merge mock + real user, sort, rank)
- [x] Add `podium` / `remainingList` / `myRank` derived values
- [x] Replace existing two-tab switcher with three-tab switcher
- [x] Implement Tab 1: Leaderboard
  - [x] Achievement banner with current user rank
  - [x] Podium (3-column, center elevated, Crown icon for #1)
  - [x] Full list (all ranks, highlighted "You" row with amber border-left)
  - [x] Click handler → `setSelectedPlayer(player)`
- [x] Implement Tab 2: Friends (EmptyState)
- [x] Implement Tab 3: My Stats (move all existing muscles + league JSX here)
- [x] Wire `PlayerDetailModal` at page root, conditionally rendered

### index.css
- [x] ~~Check and add `.glass-card`~~ — already exists at line 187, no changes needed

### QA
- [x] Leaderboard sorts correctly with real user XP inserted
- [x] "You" row always highlighted regardless of rank
- [x] Crown renders only on rank 1 podium slot
- [x] Clicking any row (including podium) opens `PlayerDetailModal`
- [x] Current user modal shows **real** muscle XP from `calcAllMuscleXP`
- [x] Mock user modals show their static `muscleXP` data
- [x] `BodyMapSVG` renders correctly in the modal (parent wrapper maxWidth ~200px → ~400px tall)
- [x] Slide-up animation plays on modal open
- [x] Clicking backdrop closes modal
- [x] My Stats tab preserves all old functionality (muscle filter, rank history, benchmarks)
- [x] Friends tab shows EmptyState (no crash)
- [x] Both dark and light themes render correctly
- [x] Mobile responsive (375px minimum width)
- [x] ESLint clean before commit

---

## 🚫 Out of Scope

- Real social friends backend / friend requests
- Persistent leaderboard (requires server)
- Animated stagger entrance on list mount (can be added post-phase)
- Pagination (stubbed "Show More" button is acceptable)
- Push notifications (no bell icon added — notification is out of scope)
- Any changes to the existing nav, routing, or shared layout

---

## 🗒️ Implementation Notes

- **Podium render order is critical**: The visual layout is `[2nd, 1st, 3rd]` left-to-right,
  but the center slot is elevated (`paddingBottom: 16`). Map `podium[1]` to slot 0,
  `podium[0]` to slot 1 (center), `podium[2]` to slot 2.
- **Medal color by `player.rank`, not by slot index**: The original code had a circular
  reference bug deriving `medalColor` from the same reordered array. Fixed: use
  `player.rank === 1` directly.
- **`fullLeaderboard` includes the real user**: If the user's real XP is higher than a mock
  user, they will displace that mock from the podium. Handle `podium[1]` and `podium[2]`
  as potentially being `undefined` if fewer than 3 on the list (the `.filter(Boolean)` handles this).
- **`getOverallRank` vs `getRank` — critical distinction**:
  - `getOverallRank(muscleXP)` → takes `{key: number}` object, sums internally, returns `{name, color, bg, progress, totalXP, nextXP}`
  - `getRank(xpNumber, 'overall')` → takes a single number, returns `{name, color, bg, progress, nextXP}`
  - In the leaderboard list, the `tier` fallback uses `getRank(player.totalXP, 'overall').name`
  - In the modal, use `getOverallRank(displayXP)` for the full rank object
- **`PlayerDetailModal` scroll lock**: Must save `document.body.style.overflow` before
  overriding, and restore in useEffect cleanup. Also sets `z-index: 1000+` to layer
  above the bottom nav bar.
- **Light theme glass rows**: The inline `rgba(53,52,55,0.4)` will render as a dark
  translucent tint on light backgrounds. Either use `var(--glass-bg)` (theme-aware)
  or the `glass-card` class for list rows. The achievement banner already uses the class.
- **`monthlyRankHistory` from context**: The My Stats tab preserves the rank history
  timeline. `monthlyRankHistory` comes from `useApp()` — verify it's still destructured.
- **`RankBadge` sub-component**: Keep the existing `RankBadge` component defined inside
  `MuscleMapPage.jsx` (lines 12–26). It's used in both the My Stats tab and can be
  reused in the `PlayerDetailModal` if exported, or duplicated.
- **`MuscleCard` sub-component**: Keep the existing `MuscleCard` component defined inside
  `MuscleMapPage.jsx` (lines 28–73). Used in the My Stats muscle filter list.
