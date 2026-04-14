# FitTrack Pro — Phase 4: Technical Improvements

<!-- Scope: Technical debt, performance, accessibility, testing. No new user-facing features. -->

> **Last updated:** 2026-03-23 · Low urgency but high long-term value. Tackle after Phase 1–3.

---

## 📋 Phase 4 — Technical Improvements

### 4.1 Data Export / Import — CSV Support

**Current state:** JSON export/import already exists in `ProfilePage.jsx` via `src/utils/storage.js`.

**Gap:** No CSV export option. Power users want to open data in Excel/Google Sheets.

**Requirements:**
- Add a "Export as CSV" button alongside the existing JSON export on `ProfilePage.jsx`.
- Export separate CSVs for: weight log, workout log, measurements, calorie log.
- Each CSV should have a proper header row and date-sorted entries.
- No new dependency needed — generate CSV strings manually and use `Blob` + `URL.createObjectURL`.

**Files to modify:**
- `src/utils/storage.js` — add `exportCSV(type)` function
- `src/components/pages/ProfilePage.jsx` — add CSV export buttons

---

### 4.2 Offline Support

**Goal:** App should work fully offline after first load.

**Requirements:**
- Service Worker caching of the app shell (HTML, JS, CSS bundles) and all static assets.
- All workout logging, weight logging, and other writes go to `localStorage` as they do now — no change needed there since there's no backend.
- Show a small "Offline" badge in the sidebar/header when the network is unavailable.
- Ties directly into 3.6 (PWA Support) — implement together.

**Files to modify / create:**
- `public/sw.js` — cache-first strategy for app shell assets
- `vite.config.js` — configure SW asset injection
- `src/components/layout/Layout.jsx` — add offline indicator

---

### 4.3 Dark / Light Theme Polish

**Goal:** Eliminate all hardcoded color values and ensure full theme consistency.

**Known issues:**
- Some inline `style={{}}` blocks use hardcoded hex values (e.g. `#FF6B6B`, `#51CF66`, `#6BCB77`) instead of CSS variables.
- A few cards have hardcoded `background: '#0C0C0E'` in `Layout.jsx` that don't respond to light mode.

**Requirements:**
- Audit every `.jsx` file for hardcoded color strings.
- Replace with CSS variables or add new semantic variables to `index.css` (e.g. `--success: #51CF66`, `--danger: #FF6B6B`).
- Test every page in both dark and light mode after changes.

**Files to modify:**
- `src/index.css` — add `--success`, `--danger`, `--warning` semantic color variables for both themes
- `src/components/layout/Layout.jsx` — fix hardcoded sidebar background
- All page components — replace hardcoded hex colors with CSS variables

---

### 4.4 Accessibility (a11y)

**Goal:** Make the app usable with keyboard and screen readers.

**Requirements:**
- Add `aria-label` to all icon-only buttons:
  - Rest timer cancel button (`WorkoutPage.jsx`)
  - Modal close buttons (`X` icon in all modals)
  - Edit/delete action buttons in `WeightLogPage.jsx`, `WorkoutHistoryPage.jsx`
- Ensure proper focus trap in modals — focus should stay inside `.md` when open.
- Add keyboard navigation for `ScrollPicker` component — Up/Down arrow keys should scroll the picker.
- Color contrast audit: verify `#E8540D` orange on `#050506` dark background meets WCAG AA (4.5:1 ratio for normal text, 3:1 for large text).

**Files to modify:**
- `src/components/shared/SharedComponents.jsx` — `ScrollPicker`, `ConfirmDialog`, modal components
- `src/components/pages/WorkoutPage.jsx` — rest timer buttons
- `src/components/pages/WeightLogPage.jsx` — action buttons
- `src/components/pages/WorkoutHistoryPage.jsx` — action buttons

---

### 4.5 Performance

**Goal:** Faster initial load and smoother interactions.

**Requirements:**
- Lazy-load all page components using `React.lazy()` + `Suspense` in `App.jsx`:
  ```jsx
  const DashboardPage = React.lazy(() => import('./components/pages/DashboardPage'));
  ```
- Add a `Suspense` fallback that uses the existing `.skeleton-pulse` CSS class.
- Audit `DashboardPage.jsx` — it currently imports and runs heavy computations (`calcAllMuscleXP`, `getWeeklyMuscles`) on every render. Ensure all are inside `useMemo`.
- Add `useCallback` to all event handlers in `WorkoutPage.jsx` that are passed as props to child components.
- Consider splitting `SharedComponents.jsx` into individual files if it grows beyond 300 lines — currently one large file.

**Files to modify:**
- `src/App.jsx` — add `React.lazy` imports for all page components
- `src/components/pages/DashboardPage.jsx` — memoization audit
- `src/components/pages/WorkoutPage.jsx` — `useCallback` for handlers

---

### 4.6 Testing

**Goal:** Prevent regressions as the codebase grows.

**Requirements:**
- Use `vitest` (Vite-native) + `@testing-library/react` — no Jest needed.
- Unit tests for all utility functions:
  - `src/utils/calculations.js` — `calcBMI`, `calcBMR`, `calcTDEE`, `calc1RM`, `calcDeficit`
  - `src/utils/helpers.js` — `gId`, `tod`, `fmt`, `clamp`, `mkWtItems`
  - `src/data/muscleData.js` — `getRank`, `calcAllMuscleXP`, `getWeeklyMuscles`
- Integration tests for key user flows:
  - Login flow (`AuthModal.jsx`)
  - Logging a weight entry (`DashboardPage.jsx` → modal → `healthLogs`)
  - Starting and finishing a workout session (`WorkoutPage.jsx`)
- Test configuration: add `vitest.config.js`, `src/test/setup.js`.

**New files:**
- `src/test/setup.js`
- `src/test/calculations.test.js`
- `src/test/helpers.test.js`
- `src/test/muscleData.test.js`
- `src/test/flows/login.test.jsx`
- `src/test/flows/workoutLog.test.jsx`
- **New dev dependencies:** `vitest`, `@testing-library/react`, `@testing-library/user-event`, `jsdom`

---

## 🗓️ Phase 4 Implementation Order

| Order | Item | Effort | Impact |
|:-----:|------|:------:|:------:|
| 1     | 4.3 Theme Polish | 🟡 Medium | High |
| 2     | 4.1 CSV Export | 🟢 Small | Medium |
| 3     | 4.5 Performance | 🟡 Medium | High |
| 4     | 4.4 Accessibility | 🟡 Medium | Medium |
| 5     | 4.2 Offline Support | 🔴 Large | High |
| 6     | 4.6 Testing | 🔴 Ongoing | High |
