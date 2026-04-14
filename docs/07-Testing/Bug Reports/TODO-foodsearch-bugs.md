# FitTrack Pro — Bug Fixes: Food Search Modal
> **Created:** 2026-04-07 · **Phase:** Post-DietPage-Overhaul
> **Files affected:** `src/components/pages/DietPage.jsx`, `src/utils/foodUtils.js`
> **Priority:** 🔴 High — both bugs affect daily food logging UX

---

## Overview

Two related bugs in the Food Search Modal inside `DietPage.jsx`:

1. **Bug 1** — Search box retains the previous query after a food is logged and the user wants to log another item.
2. **Bug 2** — Search is slow and doesn't return the correct item — the results list snaps back to showing **all** foods instead of the filtered set.

---

## Bug 1 — Search Input Not Clearing After Logging a Food

### Symptom
User taps `+` on a meal slot → types "chicken" → selects Chicken Breast → taps "Add to Lunch". The modal stays open (or user opens it again for the same slot) but the search box still shows "chicken" and results still show chicken items. User has to manually clear the box.

### Root Cause
The `searchQuery` state is **only reset when the modal fully closes** (`setShowSearch(false)`), not when a food entry is confirmed and `selectedFood` is set back to `null`. So the flow is:

```
User adds food → addFoodToLog() → setSelectedFood(null) → back to results list
                                                         ↑
                                         searchQuery is NOT cleared here
```

### Fix
**File:** `src/components/pages/DietPage.jsx`

Locate the `addFoodToLog` function (the handler that fires when the user taps "Add to [Meal Slot]" in the Food Detail Pane). After the food entry is saved to `foodLog`, reset the search state:

```js
// CURRENT (approximate):
const addFoodToLog = () => {
  const entry = buildLogEntry(); // builds the { id, foodName, calories, ... } object
  setFoodLog(prev => [...prev, entry]);
  setSelectedFood(null);         // ← goes back to results view
  // ... maybe a toast
};

// FIXED — add 3 resets after setSelectedFood(null):
const addFoodToLog = () => {
  const entry = buildLogEntry();
  setFoodLog(prev => [...prev, entry]);
  setSelectedFood(null);
  
  // ← ADD THESE THREE LINES:
  setSearchQuery('');            // clear the search box
  setSearchCat('');              // clear any active category filter
  // Do NOT reset searchDiet — keep the user's diet preference active (e.g. 'veg')
  // Do NOT reset searchFasting — keep the user's fasting preference active
  
  addToast(`Added ${entry.foodName}`, 'success');
};
```

**Why only clear query + category, not diet/fasting?**
The diet type (Veg/Non-Veg) and fasting type are **user preferences** that stay relevant across multiple food additions in the same session. Clearing them would be annoying. But the search text and category pill are **intent-specific** — once a food is found and logged, that intent is done.

**Also reset on modal open** — add this to the `useEffect` that fires when `showSearch` becomes `true`:

```js
// Existing useEffect for body scroll lock:
useEffect(() => {
  if (showSearch) {
    // ... existing overflow lock code ...
    setSearchQuery('');      // ← ADD: always start fresh when modal opens
    setSearchCat('');        // ← ADD: clear category selection
    setSelectedFood(null);   // ← ADD: ensure detail pane doesn't show stale data
  } else {
    // ... existing cleanup ...
  }
}, [showSearch]);
```

---

## Bug 2 — Search Slow + Shows All Items Instead of Filtered Results

### Symptom
User types "paneer" in the search box. After a 1–2 second delay the list shows either:
- All 200+ food items (no filtering applied), OR
- Correct results for a moment then snaps to showing all items

### Root Cause Analysis (Two Sub-Bugs)

#### Sub-Bug 2a — `searchLocalFoods` runs on every single keystroke against 200+ items with array lookups

`searchLocalFoods` in `foodUtils.js` does fuzzy matching across `name`, `nameAlt` (array), `searchTerms` (array), `hindiName`, `brand`, `productLine` for **every food object** on every character typed. With ~207 foods and 4–6 string fields each, this is roughly **1,200+ string comparisons per keystroke** — on the JS main thread.

On low-end Android devices (Redmi, Realme — the dominant Indian market handsets), this blocks the UI for 300–800ms, causing the search input to feel laggy.

#### Sub-Bug 2b — `searchResults` useMemo stale or missing dependency

The `searchResults` useMemo likely looks like:

```js
// LIKELY CURRENT (buggy):
const searchResults = useMemo(() => {
  if (!searchQuery.trim()) return indianFoods; // ← BUG: returns ALL foods when query is short/empty
  return searchLocalFoods(indianFoods, searchQuery, { dietType: searchDiet, fastingType: searchFasting })
    .filter(f => !searchCat || f.category === searchCat);
}, [searchQuery, searchDiet, searchFasting, searchCat]);
```

The `if (!searchQuery.trim()) return indianFoods;` line is the culprit. It was added as a "show everything when search is empty" behaviour — correct for browse mode. But when `searchQuery` contains only spaces or gets cleared mid-type (e.g. user backspaces quickly), it momentarily returns all 200+ items. Combined with the input debounce delay, this manifests as "the filtered list briefly appears then snaps to all items."

### Fix

#### Step 1 — Add debounce to the search input handler
**File:** `src/components/pages/DietPage.jsx`

```js
// ADD at top of component (after other useState hooks):
const [debouncedQuery, setDebouncedQuery] = useState('');
const debounceRef = useRef(null);

// ADD: debounce handler for the search input onChange:
const handleSearchChange = (e) => {
  const val = e.target.value;
  setSearchQuery(val);                // update input immediately (no lag on the input box itself)
  clearTimeout(debounceRef.current);
  debounceRef.current = setTimeout(() => {
    setDebouncedQuery(val);           // this is what actually triggers the search
  }, 250);                            // 250ms debounce — fast enough to feel live, slow enough to batch keystrokes
};

// UPDATE the search input's onChange:
// BEFORE: onChange={e => setSearchQuery(e.target.value)}
// AFTER:  onChange={handleSearchChange}

// CLEANUP in useEffect:
useEffect(() => {
  return () => clearTimeout(debounceRef.current); // cleanup on unmount
}, []);
```

#### Step 2 — Fix the useMemo to use `debouncedQuery` and handle empty state correctly
**File:** `src/components/pages/DietPage.jsx`

```js
// REPLACE the current searchResults useMemo with this:
const searchResults = useMemo(() => {
  const query = debouncedQuery.trim();
  const hasFilters = searchCat || (searchDiet && searchDiet !== 'all') || searchFasting;
  
  let base;
  
  if (!query && !hasFilters) {
    // No query, no filters → show recent foods only (not all 200+ items)
    // This prevents the overwhelming all-items dump on first open
    base = getRecentFoods(foodLog, 15);   // last 15 unique foods
    if (base.length === 0) base = indianFoods.slice(0, 30); // fallback: first 30 items
  } else if (!query && hasFilters) {
    // No query but a filter is active → show all items matching the filter
    base = indianFoods;
  } else {
    // Query present → run fuzzy search
    base = searchLocalFoods(indianFoods, query, {
      dietType: searchDiet !== 'all' ? searchDiet : null,
      fastingType: searchFasting || null,
    });
  }
  
  // Apply category filter on top
  if (searchCat) {
    base = base.filter(f => f.category === searchCat);
  }
  
  // Apply Jain containsRootVeg filter
  if (searchDiet === 'jain') {
    base = base.filter(f => !f.containsRootVeg);
  }
  
  return base;
}, [debouncedQuery, searchDiet, searchFasting, searchCat, foodLog]);
```

**Key changes from the current version:**
- Uses `debouncedQuery` (the 250ms-debounced value) instead of `searchQuery` — so the expensive `searchLocalFoods` only runs after the user pauses, not on every character
- `searchQuery` still updates immediately (the input box feels instantaneous)
- Empty + no-filter state now shows recent foods instead of all 200+ items — much cleaner UX
- Category filter uses `f.category` (the Phase G bug fix is preserved)
- Jain filter (`containsRootVeg`) is applied at the `useMemo` level so it's always active when `searchDiet === 'jain'`

#### Step 3 — Update `foodUtils.js` `searchLocalFoods` to short-circuit on very short queries
**File:** `src/utils/foodUtils.js`

```js
// FIND the searchLocalFoods function and add an early return for very short queries:
export const searchLocalFoods = (foodsList, query, { dietType, fastingType } = {}) => {
  const q = query?.trim().toLowerCase();
  
  // Short-circuit: query must be at least 2 characters to run fuzzy search
  // Single character queries cause too many false positives and are slow
  if (!q || q.length < 2) return foodsList;
  
  // ... rest of existing fuzzy search logic ...
};
```

**Why 2 characters minimum?** "p" matches paneer, potato, poha, peanut, pulao, pickle, paratha... (30+ items) with no useful signal. "pa" narrows to paneer, paratha, pakora, palak — actually useful. This also means the debounce fires with a useful query, preventing the "shows all" flash.

#### Step 4 — Show a loading indicator during the debounce window
**File:** `src/components/pages/DietPage.jsx`

During the 250ms debounce window, `searchQuery !== debouncedQuery`. Show a subtle indicator so the user knows their input is being processed:

```jsx
{/* In the results section, add a searching indicator: */}
{searchQuery !== debouncedQuery && searchQuery.length >= 2 && (
  <div style={{
    display: 'flex', alignItems: 'center', gap: 8,
    padding: '10px 16px',
    color: 'var(--on-surface-variant)', fontSize: 12,
  }}>
    <div style={{
      width: 12, height: 12, borderRadius: '50%',
      border: '2px solid var(--primary)', borderTopColor: 'transparent',
      animation: 'spin 0.6s linear infinite',
    }} />
    Searching...
  </div>
)}
```

Add the spin keyframe to `index.css` if not already present:
```css
@keyframes spin {
  to { transform: rotate(360deg); }
}
```

---

## Summary of All Changes

| File | Change | Why |
|------|--------|-----|
| `DietPage.jsx` | Reset `searchQuery` + `searchCat` in `addFoodToLog()` | Bug 1 — clear on re-log |
| `DietPage.jsx` | Reset `searchQuery` + `searchCat` + `setSelectedFood(null)` in modal open `useEffect` | Bug 1 — start fresh each open |
| `DietPage.jsx` | Add `debouncedQuery` state + `debounceRef` + `handleSearchChange` handler | Bug 2a — performance |
| `DietPage.jsx` | Rewire search input `onChange` to `handleSearchChange` | Bug 2a — performance |
| `DietPage.jsx` | Rewrite `searchResults` useMemo to use `debouncedQuery`, smart empty state | Bug 2b — shows all items |
| `DietPage.jsx` | Add "Searching..." spinner during debounce window | Bug 2a — UX feedback |
| `foodUtils.js` | Add `q.length < 2` short-circuit in `searchLocalFoods` | Bug 2a + 2b — fewer false positives, faster |

---

## QA Tests After Fix

1. **Bug 1 — Cleared on re-log**: Open modal → search "egg" → select Boiled Egg → add to Breakfast → verify search box is empty and results show recent foods.
2. **Bug 1 — Cleared on re-open**: Close modal → open again → verify search box is empty.
3. **Bug 2 — No all-items flash**: Type "pan" slowly → verify results stay filtered (paneer, pav bhaji etc.) and never snap to showing all 200+ items.
4. **Bug 2 — Performance**: On a slow device (or Chrome DevTools CPU throttle 4x) → type "chicken breast" → verify input box is responsive (no lag) and results appear ~250ms after last keypress.
5. **Bug 2 — Short query**: Type "p" → verify nothing/recent shown, not 50+ items starting with P.
6. **Bug 2 — Empty + category**: Clear search, tap "Dairy" category pill → verify all dairy items shown correctly.
7. **Bug 2 — Jain filter**: Set diet to Jain → search "aloo" → verify 0 results (aloo has `containsRootVeg: true`).
8. **Diet/fasting filter preserved**: Add a food → verify the active diet chip (e.g. "Veg") is still selected after adding.

---

## 🔴 Gaps Identified (Code Audit — 2026-04-08)

After cross-referencing this TODO with the actual code in `DietPage.jsx` (1042 lines) and `foodUtils.js` (274 lines), the following gaps were found. Each gap is tagged with its severity and the section of this TODO it invalidates or requires amending.

---

### Gap 1 — 🔴 CRITICAL: Search is Remote (Supabase), NOT Local

**TODO assumption:** The search uses `searchLocalFoods()` against an in-memory `indianFoods` array, causing ~1,200 string comparisons per keystroke on the main thread.

**Actual code (lines 190–206):** The search is entirely **remote via Supabase**. `searchRemoteFoods()` is called inside a `useEffect` with a 300ms `setTimeout` debounce. It calls the Supabase PostgREST API with `.or()` and `.ilike` filters. `searchLocalFoods` is **not imported or used** in `DietPage.jsx` at all.

**Impact on TODO:**
- **Bug 2a is misdiagnosed.** The slow search is NOT caused by in-memory array scanning — it's caused by **Supabase network latency** (cold connection, slow region, etc.) combined with the fact that every keystroke triggers a new remote fetch (the 300ms debounce helps but doesn't prevent stacking).
- **Step 3** (add `q.length < 2` short-circuit to `searchLocalFoods`) will have **zero effect** because `searchLocalFoods` is never called.
- The debounce in **Step 1** already exists (line 193, 300ms) — adding a second debounce layer would be redundant and cause double-delay.
- The `useMemo` rewrite in **Step 2** is wrong — `searchResults` is a `useState` (line 68), not a `useMemo`. It's set via `setSearchResults()` inside the async `useEffect`.

**Corrected approach:**
1. Increase the existing debounce from 300ms → 400ms to better batch keystrokes on slow devices.
2. Add an abort controller / request ID guard to prevent stale out-of-order responses from overwriting newer results.
3. Add the `q.length < 2` short-circuit inside `searchRemoteFoods` (not `searchLocalFoods`) to skip the Supabase call entirely for single-character queries.
4. Consider caching the last N queries in a `useRef` Map so repeated/backspace searches return instantly from cache.

---

### Gap 2 — 🔴 CRITICAL: `addFoodToLog` Already Closes the Modal

**TODO assumption (Bug 1):** After adding a food, the modal stays open and the search box retains the query. The fix is to add `setSearchQuery('')` and `setSearchCat('')` resets.

**Actual code (lines 316-323):**
```js
if (!isOil) {
  addToast(`${item.name} logged.`, 'success');
  setShowSearch(false);      // ← MODAL CLOSES
  setSelectedFood(null);
  setShowCustom(false);
  setCustomInput({ name: '', cals: '', p: '', c: '', f: '' });
  setEditingEntry(null);
}
```

The modal fully closes after every non-oil food add (`setShowSearch(false)`). The user would need to reopen it. So the stale searchQuery would only be visible if the user reopens the modal — not "the modal stays open."

**Impact on TODO:**
- Bug 1's symptom description is partially wrong: the modal doesn't stay open. The real issue is that `searchQuery` and `searchCat` aren't reset on close, so **reopening** the modal shows the previous query.
- The fix location is correct (reset on close/reopen) but the `addFoodToLog` reset is actually unnecessary — we should reset in the `handleOpenSearch` function (line 282) or in the `showSearch` useEffect instead, since the modal always closes after add.
- Only for the **oil add** path (`isOil === true`) does the modal stay open, and in that case the user wouldn't have been searching anyway (it's a one-tap button).

**Corrected approach:**
Add resets to `handleOpenSearch()`:
```js
const handleOpenSearch = (slot) => {
  setSearchMealSlot(slot);
  setShowSearch(true);
  setSelectedFood(null);
  setShowCustom(false);
  setSearchQuery('');       // ← ADD
  setSearchCat('All');      // ← ADD (note: default is 'All', not '')
};
```

---

### Gap 3 — 🟡 MEDIUM: `searchCat` Default is `'All'`, Not `''`

**TODO assumption:** `setSearchCat('')` clears the category filter.

**Actual code (line 65):** `const [searchCat, setSearchCat] = useState('All');`

The default value for `searchCat` is `'All'`, not `''`. Setting it to `''` would leave no category pill highlighted and break the filter logic at line 201 (`searchCat !== 'All'`). Similarly, `searchDiet` defaults to `'All'` (line 66).

**Impact on TODO:**
- Every occurrence of `setSearchCat('')` in the TODO should be `setSearchCat('All')`.
- The useMemo rewrite in Step 2 uses `searchCat` checks that assume `''` is the no-filter state — this is wrong. The correct no-filter check is `searchCat === 'All'` or `searchCat !== 'All'`.
- The `hasFilters` check `searchCat || (searchDiet && searchDiet !== 'all')` would always be truthy because `searchCat` defaults to `'All'` (a truthy string). Should be `searchCat !== 'All'`.

---

### Gap 4 — 🟡 MEDIUM: `indianFoods` is NOT Imported — Favorites Section is Broken

**TODO assumption (Step 2):** References `indianFoods` as an available variable for fallback results and recent foods.

**Actual code:** `indianFoods` is used at line 979 (`const food = indianFoods.find(...)`) in the Favorites section, but it is **never imported**. The import at line 9 only imports `foodCategories`:
```js
import { foodCategories } from '../../data/foods/foodCategories';
```

This means:
1. The Favorites section at line 975-988 will throw a **ReferenceError** when any favorite foods are present, crashing the search modal.
2. Any TODO fix that references `indianFoods.slice(0, 30)` as a fallback would also crash.

**Corrected approach:**
- Add `import { indianFoods } from '../../data/foods/indianFoods';` to the imports **or**
- Use `searchRemoteFoods('', {})` to fetch a default set from Supabase (consistent with the remote-first architecture), **or**
- Pull favorites from the food log (which already stores the `food` object): `favoriteIds.map(id => foodLog.find(l => l.foodId === id)?.food).filter(Boolean)`

---

### Gap 5 — 🟡 MEDIUM: `@keyframes spin` Doesn't Exist in CSS

**TODO Step 4** references adding a `spin` keyframe to `index.css` "if not already present."

**Actual code:** The `spin` animation is **already used** at line 995 (`animation: 'spin 1s linear infinite'`) in the existing search loading indicator, but `@keyframes spin` is **not defined anywhere** in `index.css` or any other CSS file. This means the existing loading spinner already doesn't animate.

**Corrected approach:**
- Confirm this is a pre-existing bug (spinner doesn't spin) and add the keyframe as part of this fix.

---

### Gap 6 — 🟡 MEDIUM: `getRecentFoods` May Return Incomplete Objects

**TODO Step 2** uses `getRecentFoods(foodLog, 15)` as the default empty-search fallback. 

**Actual code (foodUtils.js lines 248-262):** `getRecentFoods` extracts `entry.food` from the food log. But the `food` object stored in the log (line 305) is the full Supabase-returned object — it includes `servings`, `per100g`, etc. This should work fine for display.

**However:** For custom food entries (line 301: `isCustom ? null : selectedFood`), the `food` field is `null`. `getRecentFoods` skips these (line 255: `if (entry.food && foodId`), so custom foods will never appear in recent. This is a minor UX gap — custom entries are invisible in the recent foods section.

---

### Gap 7 — 🟡 MEDIUM: Race Condition in Remote Search — Stale Responses

**Not mentioned in TODO at all.** The current search `useEffect` (lines 191-206) creates a new `setTimeout`/async call per keystroke but doesn't guard against out-of-order responses. Example:
1. User types "pan" → request A fires after 300ms
2. User types "paneer" → request B fires after 300ms
3. Request B resolves first (returns 3 paneer items) → `setSearchResults(3 items)`
4. Request A resolves later (returns 15 "pan" items) → `setSearchResults(15 items)` — **OVERWRITES the correct results**

This is likely the actual root cause of Bug 2's "snaps back to showing all items" symptom.

**Fix:** Add an AbortController or a request-sequence counter:
```js
useEffect(() => {
  const controller = new AbortController();
  const timer = setTimeout(async () => {
    setIsSearching(true);
    try {
      const res = await searchRemoteFoods(searchQuery, { ... });
      if (!controller.signal.aborted) {
        setSearchResults(finalRes);
        setIsSearching(false);
      }
    } catch (e) {
      if (!controller.signal.aborted) setIsSearching(false);
    }
  }, 300);
  return () => { clearTimeout(timer); controller.abort(); };
}, [searchQuery, searchDiet, searchFasting, searchCat]);
```

---

### Gap 8 — 🟢 LOW: Empty Query Still Fires a Supabase Request

When `searchQuery` is `''`, the current `useEffect` still fires `searchRemoteFoods('')` which queries Supabase with no search filter — returning **all rows up to the 50-item limit**. This is wasteful and causes a network request on modal open.

**Fix:** Short-circuit inside the useEffect:
```js
if (!searchQuery.trim() && searchCat === 'All' && searchDiet === 'All' && !searchFasting) {
  setSearchResults([]);
  setIsSearching(false);
  return;
}
```
Then rely on the `recentFoods` and `Favorites` sections (already rendered when `!searchQuery`) for the default view.

---

### Gap 9 — 🟢 LOW: `editEntry` Doesn't Reset `searchQuery`

When a user taps the Edit button on a logged food (line 341-353), `editEntry()` calls `setShowSearch(true)` and `handleSelectFood()` but doesn't reset `searchQuery`. If the user had a previous search query, it will still be visible behind the detail pane. This is a minor visual bug — the user would see the old query if they tap the back button.

**Fix:** Add `setSearchQuery(''); setSearchCat('All');` inside `editEntry()`.

---

### Gap 10 — 🟢 LOW: `searchResults` is Never Cleared on Modal Close

When the modal closes (`setShowSearch(false)`), the 50+ item `searchResults` array stays in state, consuming memory. On next open, the old results flash briefly before new ones load.

**Fix:** In `handleOpenSearch`, add `setSearchResults([]);`.

---

## Summary of Gaps

| # | Severity | Gap | TODO Section Affected |
|---|----------|-----|-----------------------|
| 1 | 🔴 CRITICAL | Search is Supabase-remote, not local. `searchLocalFoods` is unused. The perf diagnosis and Steps 1–3 are wrong. | Bug 2a, 2b, Steps 1–3 |
| 2 | 🔴 CRITICAL | `addFoodToLog` already closes modal. Bug 1 symptom is stale query on **reopen**, not on **staying open**. | Bug 1 Fix |
| 3 | 🟡 MEDIUM | `searchCat` default is `'All'`, not `''`. All `setSearchCat('')` calls should be `setSearchCat('All')`. | Bug 1, Step 2 |
| 4 | 🟡 MEDIUM | `indianFoods` is not imported, Favorites section will crash. | Step 2, Favorites |
| 5 | 🟡 MEDIUM | `@keyframes spin` doesn't exist anywhere — existing spinner is already broken. | Step 4 |
| 6 | 🟡 MEDIUM | `getRecentFoods` silently excludes custom food entries. | Step 2 fallback |
| 7 | 🟡 MEDIUM | Race condition — stale out-of-order Supabase responses overwrite newer results. Likely the actual cause of Bug 2's "snap back" symptom. | Bug 2b (not mentioned) |
| 8 | 🟢 LOW | Empty query fires a Supabase request returning 50 items unnecessarily. | Bug 2b |
| 9 | 🟢 LOW | `editEntry` doesn't clear `searchQuery`, old query leaks behind detail pane. | Bug 1 (not mentioned) |
| 10 | 🟢 LOW | `searchResults` is never cleared on modal close, stale data flashes on reopen. | Bug 1 (not mentioned) |