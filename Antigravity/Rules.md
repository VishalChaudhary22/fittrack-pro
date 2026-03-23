# FitTrack Pro — Antigravity Agent Rules

## 🧠 Project Overview
FitTrack Pro is an India-first fitness tracking web app. It is a **pure frontend React application** — there is no backend, no API, no database. All state is persisted in the browser via `localStorage`. The target user is an Indian fitness enthusiast, so all diet content, food items, pricing (₹), and cultural references must reflect the Indian context.

---

## 🛠️ Tech Stack
- **Framework**: React 19 (functional components + hooks only — no class components)
- **Routing**: React Router DOM v7 (`useNavigate`, `useLocation`)
- **Charts**: Recharts v3 (`AreaChart`, `BarChart`, `LineChart`, `ResponsiveContainer`)
- **Icons**: Lucide React (always import named — e.g. `import { Dumbbell } from 'lucide-react'`)
- **Build Tool**: Vite v8
- **No external UI library** — all UI is hand-rolled using the global CSS design system

---

## 📂 File Structure
```
src/
├── App.jsx                    # Root component, all routes defined here
├── main.jsx                   # Entry point
├── index.css                  # ALL global styles, CSS variables, themes, animations
├── App.css                    # App-level layout styles only
├── components/
│   ├── layout/                # Sidebar.jsx, BottomNav.jsx (exported from Layout.jsx)
│   ├── pages/                 # One file per page (DashboardPage.jsx, WorkoutPage.jsx, etc.)
│   └── shared/                # SharedComponents.jsx, BodyMapSVG.jsx
├── context/
│   └── AppContext.jsx         # Global state — ONLY place for shared state
├── data/                      # Static data: constants.js, splits.js, diets.js, muscleData.js, sample.js
├── hooks/                     # useLocalStorage.js, useTheme.js, useToast.js
└── utils/                     # calculations.js, helpers.js, storage.js
```

**Rules:**
- New pages go in `src/components/pages/`
- New reusable UI components go in `src/components/shared/SharedComponents.jsx`
- New static data goes in `src/data/`
- New utility functions go in `src/utils/helpers.js` or a new util file
- Never put business logic inside a page component — extract to `utils/`

---

## 🎨 Design System — CSS Classes (Never Deviate)

### Layout
- `.card` — Standard card container. Has border, shadow, border-radius 24px, bg `var(--c1)`. Use for all content blocks.
- `.card-p` — Secondary card, bg `var(--c2)`, border-radius 20px.
- `.mo` — Modal overlay (full screen, backdrop blur). Always wrap modal content in `.md`.
- `.md` — Modal dialog box. Max-width 480px by default. Adjust inline as needed.
- `.stripe` — Left orange accent border (`border-left: 3px solid var(--o)`). Use on highlight cards.

### Typography
- `.bb` — Bebas Neue font. Use for all headings, numbers, stat values.
- `.abar` — Orange accent underline bar (28px wide, 3px tall). Place under page titles.
- `.pt` — Page title override, font-size 32px. Apply alongside `.bb`.

### Buttons
- `.btn-p` — Primary CTA button. Orange gradient, white text, rounded 14px. Use for main actions.
- `.btn-g` — Secondary ghost button. Grey bg, subtle border. Use for cancel/secondary actions.
- `.btn-d` — Danger/outline button. Orange border, orange text, transparent bg. Use for delete/destructive.

### Form Elements & Inputs
- Always use bare `<input>`, `<select>`, `<textarea>` — global CSS styles them automatically.
- Always add `<label>` above inputs. Labels are auto-styled (uppercase, 10px, letter-spacing).
- **Input State Handling:** When dealing with number inputs (like reps or weight), allow them to be blank (`''`) by default rather than coercing immediate empty states to `0`. Use `parseFloat(v) || 0` only at the time of calculation or saving.
- **Checkboxes/Toggles:** For "Done" states (e.g. workout sets, supplement logs), use square checkboxes instead of round toggles. (Pattern: `s.done ? var(--o) : var(--c3)` with a white SVG checkmark).

### Tags & Badges
- `.tag` — Orange pill badge. Use for status indicators, active states, labels.
- `.tag-d` — Grey pill badge. Use for disabled/inactive states.

### Utility & Layout Practices
- **Card Readability:** Always ensure primary stat values inside cards are pure white (`var(--tx)`) and not faded `var(--t2)`. Labels should be bright enough to read (minimum `11px`, `var(--t2)`).
- `.sep` — 1px horizontal divider. Use inside cards between sections.
- `.row-sep` — Bottom border on list rows. Apply to list item `div`s.
- `.pbar` + `.pbar-fill` — Progress bar. Set `width` on `.pbar-fill` as percentage.
- `.g2`, `.g3`, `.g4` — Grid shorthand classes (collapse to 1 or 2 col on mobile).

### Navigation
- `.ni` — Nav item. Apply to sidebar and mobile nav links.
- `.ni.act` — Active nav state. Add class `act` when route matches.
- `.bn` — Bottom nav bar (mobile only, hidden on desktop via `display:none`).
- `.ds` — Desktop-only element. Hidden on mobile.

---

## 🎨 CSS Variables — Always Use These, Never Hardcode Colors

```css
/* Backgrounds */
--bg        /* Page background */
--c1        /* Card surface */
--c2        /* Elevated surface / input bg */
--c3        /* Deeper inset / pressed state */

/* Borders */
--bd        /* Subtle border */
--bd2       /* Slightly visible border */

/* Orange Accent */
--o         /* #E8540D — main orange */
--o2        /* rgba(232,84,13,.10) — orange tint bg */
--o3        /* rgba(232,84,13,.05) — orange wash bg */
--og        /* linear-gradient(135deg,#E8540D,#FF6B35) — orange gradient */

/* Text */
--tx        /* Primary text */
--t2        /* Secondary/muted text */
--t3        /* Placeholder/disabled text */
--t4        /* Very faint text */

/* Effects */
--shadow    /* Standard card shadow */
--shadow-lg /* Modal/elevated shadow */
--glow      /* Ambient orange glow */
```

---

## 🗃️ State Management Rules

- **All persistent state lives in `AppContext.jsx`** via `useLocalStorage` hook.
- **Never use `useState` for data that needs to persist** across sessions — always go through context.
- The context exposes: `users`, `user`, `uid`, `splits`, `healthLogs`, `workoutLogs`, `measurements`, `caloriesLog`, `theme`, `toasts`, `getStreak`.
- To add new persistent state: add a `useLocalStorage` entry in `AppContext.jsx` and expose it in the `value` object.
- **Storage keys convention**: always prefix with `fittrack_` (e.g. `fittrack_waterLog`).

---

## 🧩 Component Patterns

### Page Component Template
```jsx
export default function NewPage() {
  const { user, addToast } = useApp();
  // local UI state here
  
  return (
    <div className="pg-in">
      <PageHeader title="Page Title" sub="Subtitle text" action={<button className="btn-p">Action</button>} />
      {/* content */}
    </div>
  );
}
```

### Modal Pattern — Always use `Portal`
```jsx
import { Portal } from '../shared/SharedComponents';

{showModal && (
  <Portal>
    <div className="mo">
      <div className="md">
        {/* modal content */}
      </div>
    </div>
  </Portal>
)}
```

### Toast Notifications
```jsx
const { addToast } = useApp();
addToast('Message here', 'success');  // types: 'success' | 'error' | 'info'
```

### Confirmation Dialogs
```jsx
import { ConfirmDialog } from '../shared/SharedComponents';
<ConfirmDialog
  open={!!confirm}
  title="Title"
  message="Are you sure?"
  onConfirm={handleConfirm}
  onCancel={() => setConfirm(false)}
  confirmLabel="Yes, Delete"
  danger={true}
/>
```

---

## 🇮🇳 India-First Content Rules

- All food items must be Indian or widely available in India (rajma, paneer, dal, chana, roti, sabzi etc.).
- Pricing must be in ₹ (Indian Rupees), never $ or €.
- Measurements: weight in **kg**, height in **cm** — never lbs or feet/inches.
- Protein supplement brands to reference: MuscleBlaze, ON Gold Standard, MyProtein, Asitis.
- Date formatting: use `fmt()` from `helpers.js` which outputs `en-IN` locale format.
- Activity level defaults: `moderate` (most Indian office workers).
- Default user weight range: 50–100kg. Default height range: 150–185cm.

---

## 📐 Responsive Rules

- **Breakpoint**: `768px` — below this, sidebar is hidden (`.ds` → `display:none`) and bottom nav appears (`.bn` → `display:flex`).
- **Mobile page padding**: pages get class `mc` on mobile for `padding: 16px 14px 90px` (90px bottom clears the nav bar).
- **Grid collapse**: `.g2` → 1 col, `.g3` → 1 col, `.g4` → 2 col on mobile.
- **Modals on mobile**: sheet-style, anchored to bottom, full width, border-radius top-only.

---

## ✅ Coding Conventions

- **Functional components only** — no class components, no HOCs.
- **Arrow functions for event handlers** — `const handleX = () => {}` not `function handleX() {}`.
- **Inline styles for one-off layout** — use CSS classes for reusable patterns, inline `style={{}}` for unique positioning/sizing.
- **useMemo for derived data** — any computation from `workoutLogs`, `healthLogs`, or `splits` must be memoized.
- **useCallback for handlers passed as props** — prevents unnecessary re-renders.
- **IDs**: always use `gId()` from `helpers.js` to generate unique IDs, never `Date.now()` or `Math.random()` directly.
- **Dates**: always use `tod()` from `helpers.js` for today's date string (`YYYY-MM-DD`).
- **No TypeScript** — the project is plain JavaScript/JSX throughout.
- **No external state libraries** — no Redux, Zustand, Jotai etc. Use React context only.

---

## 🚫 What NOT To Do

- Never install a UI library (MUI, Chakra, Ant Design, shadcn) — this project uses a custom design system.
- Never hardcode hex colors — always use CSS variables.
- Never create a new CSS file — all styles go in `index.css` or inline `style={{}}`.
- Never use `document.querySelector` or direct DOM manipulation — use React refs (`useRef`) if needed.
- Never add a backend, API calls, or database — this is a localStorage-only app.
- Never use `localStorage` directly — always go through `useLocalStorage` hook or `AppContext`.
- Never break the orange accent theme — `--o: #E8540D` is the brand color, do not substitute.