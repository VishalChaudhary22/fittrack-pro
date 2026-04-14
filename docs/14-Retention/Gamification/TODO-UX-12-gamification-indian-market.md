# TODO — UX-12: Gamification, Motivation & Indian Market UX

> **Scope:** Retention mechanics, onboarding, gamification loops, and India-specific UX improvements.  
> **Files primarily affected:** `DashboardPage.jsx`, `WorkoutHistoryPage.jsx`, `AppContext.jsx`, `ContactPage.jsx`, `DietPage.jsx`, new files.

---

## 17. Motivation & Gamification

### UX-17.1 — No Onboarding Flow — New Users Land Cold on Dashboard 🔴

**Problem:** After registration, users are immediately taken to the Dashboard showing Vishal's demo data. For a genuine new user, the Dashboard would be mostly empty — no workouts, no weight logs, no splits set. There is **zero guidance** on what to do first.

> **An app is only as sticky as its first 5 minutes.**

**Fix — add an `Onboarding` component that fires once after first registration:**
```
Step 1: "Pick your workout split" → auto-navigate to /splits
Step 2: "Log your starting weight" → opens weight log modal  
Step 3: "Set your first goal" → opens goal modal
Step 4: "You're all set! Here's your Dashboard." → dismiss

// Track in localStorage: fittrack_onboarding_done = 'true'
// Each step marked done as user completes it
// Entirely skippable at any step
```

**Implementation:**
```jsx
// New file: src/components/pages/OnboardingPage.jsx
// Or an overlay component triggered in AppContext/App.jsx:

const [onboardingDone, setOnboardingDone] = useLocalStorage('fittrack_onboarding_done', false);
const [onboardingStep, setOnboardingStep] = useState(0);

// Show when: user exists AND !onboardingDone
// Render a 4-step guided overlay with progress dots
// Each step: icon + title + action button + "Skip for now" link
```

**Files:** New `OnboardingPage.jsx` or `OnboardingOverlay.jsx`, `AppContext.jsx`, `App.jsx`.

---

### UX-17.2 — Streak Breaks With No Recovery Mechanic 🟡

**Problem:** If a user misses a workout, their streak resets to 0. Apps like Duolingo, Strava, and Fitbit use "streak shields" or "streak freeze" mechanics to keep users engaged after a miss instead of driving abandonment.

**Fix — "Streak Shield" mechanic:**
```js
// In AppContext.jsx:
// User earns one streak shield per 7-day streak milestone
const streakShields = useMemo(() =>
  Math.floor(streak.longest / 7),
[streak.longest]);

// When calculating current streak in getStreak():
// If today would break the streak AND user has shields available:
// - Auto-consume one shield
// - Streak continues
// - Store consumed shields in user profile

// In DashboardPage.jsx streak card:
// Show: "🛡 1 Shield Available" or "🛡 No Shields"
```

**Files:** `AppContext.jsx` (streak logic), `DashboardPage.jsx` (display), user data model.

---

### UX-17.3 — No Weekly Summary Digest on Sundays 🟢

**Problem:** No "Week in Review" moment exists. A Sunday recap telling users how their week went vs. the previous week is a key retention loop used by every successful fitness app (Fitbit, Strava, Apple Fitness+).

**Fix — `WeeklySummaryCard` component that appears on Sundays:**
```jsx
const today = new Date();
const isSunday = today.getDay() === 0;
const currentWeek = `${today.getFullYear()}-W${Math.ceil(today.getDate() / 7)}`;
const hasShownThisWeek = localStorage.getItem('fittrack_weekly_shown') === currentWeek;

// On Sundays before dismissal, show a dismissible banner at top of Dashboard:
// "📊 This Week: 4 sessions | 12,400 kg total volume | +2.5 kg on Bench Press"
// [View Details →]  [Dismiss]

// On dismiss: localStorage.setItem('fittrack_weekly_shown', currentWeek)
```

**Files:** `DashboardPage.jsx`.

---

### UX-17.4 — XP Points Per Session Not Visible in History 🟡

**Problem:** `WorkoutHistoryPage.jsx` shows session name, date, and set count — but not XP gained. Users who care about the gamification system have no historical view of how much XP each session contributed.

**Fix — compute and display session XP on each history card:**
```js
// In WorkoutHistoryPage.jsx, build exMuscleMap (same as muscleData.js):
const exMuscleMap = {};
splits.forEach(split =>
  split.days?.forEach(day =>
    day.exercises?.forEach(ex => {
      if (ex.name && ex.muscle) exMuscleMap[ex.name] = ex.muscle;
    })
  )
);

// Per log entry:
const sessionXP = log.exercises?.reduce((total, ex) => {
  const muscleField = exMuscleMap[ex.name];
  if (!muscleField) return total;
  return total + ex.sets.reduce(
    (s, set) => s + (set.reps || 0) * Math.max(set.weight || 0, 1), 0
  );
}, 0) || 0;

// Display as tag: "+2,400 XP" on the session card header
```

**Files:** `WorkoutHistoryPage.jsx`, imports from `muscleData.js`.

---

## 18. Indian Market UX

### UX-18.1 — Contact Page Uses Email-First Despite WhatsApp Dominance 🔴

*Duplicate of UX-13.1 in `TODO-UX-10-profile-auth-contact.md`. See WhatsApp CTA fix there.*

---

### UX-18.2 — No Indian Food Database for Calorie Logging 🟠

**Problem:** The calorie log lets users manually enter meal name + calories but there's no food search or pre-loaded database. Users must independently look up calories for dal, roti, sabzi, biryani, etc., then type them manually. This creates significant friction for the primary user demographic.

**Fix — create `src/data/indianFoods.js`:**
```js
export const INDIAN_FOODS = [
  // Staples
  { name: 'Roti (1 piece, ~30g)',       calories: 71,  protein: 3,   carbs: 15,  fat: 0.4 },
  { name: 'Chapati with ghee (1)',       calories: 105, protein: 3,   carbs: 15,  fat: 4   },
  { name: 'White Rice (1 cup cooked)',   calories: 242, protein: 4,   carbs: 53,  fat: 0.4 },
  { name: 'Brown Rice (1 cup cooked)',   calories: 216, protein: 5,   carbs: 45,  fat: 1.8 },
  { name: 'Paratha plain (1)',           calories: 260, protein: 5,   carbs: 36,  fat: 11  },
  // Proteins
  { name: 'Paneer (100g)',               calories: 265, protein: 18,  carbs: 3,   fat: 20  },
  { name: 'Chicken Breast (100g)',       calories: 165, protein: 31,  carbs: 0,   fat: 3.6 },
  { name: 'Egg (1 whole)',               calories: 78,  protein: 6,   carbs: 0.6, fat: 5   },
  { name: 'Egg White (1)',               calories: 17,  protein: 3.6, carbs: 0.2, fat: 0.1 },
  { name: 'Dal (1 cup cooked)',          calories: 198, protein: 14,  carbs: 34,  fat: 1   },
  { name: 'Rajma (1 cup cooked)',        calories: 225, protein: 15,  carbs: 40,  fat: 0.9 },
  { name: 'Chana (1 cup cooked)',        calories: 269, protein: 15,  carbs: 45,  fat: 4   },
  { name: 'Soya Chunks (100g dry)',      calories: 345, protein: 52,  carbs: 33,  fat: 0.5 },
  { name: 'Fish (Rohu, 100g)',           calories: 97,  protein: 17,  carbs: 0,   fat: 2.7 },
  // Dairy
  { name: 'Full-fat Milk (1 glass)',     calories: 150, protein: 8,   carbs: 12,  fat: 8   },
  { name: 'Curd / Dahi (100g)',          calories: 61,  protein: 3.5, carbs: 4.7, fat: 3.3 },
  { name: 'Greek Yogurt (100g)',         calories: 59,  protein: 10,  carbs: 3.6, fat: 0.4 },
  { name: 'Whey Protein (1 scoop)',      calories: 120, protein: 25,  carbs: 3,   fat: 1.5 },
  // Common dishes
  { name: 'Dal Makhani (1 cup)',         calories: 215, protein: 9,   carbs: 25,  fat: 9   },
  { name: 'Chicken Curry (150g)',        calories: 250, protein: 28,  carbs: 6,   fat: 12  },
  { name: 'Palak Paneer (1 bowl)',       calories: 280, protein: 14,  carbs: 12,  fat: 20  },
  { name: 'Biryani, Chicken (1 plate)', calories: 490, protein: 28,  carbs: 60,  fat: 14  },
  { name: 'Idli (1 piece)',              calories: 39,  protein: 2,   carbs: 8,   fat: 0.4 },
  { name: 'Dosa plain (1)',             calories: 133, protein: 3,   carbs: 24,  fat: 3   },
  { name: 'Sambar (1 cup)',             calories: 90,  protein: 5,   carbs: 15,  fat: 2   },
  { name: 'Peanut Butter (1 tbsp)',     calories: 94,  protein: 4,   carbs: 3.1, fat: 8   },
  { name: 'Banana (1 medium)',          calories: 89,  protein: 1.1, carbs: 23,  fat: 0.3 },
  { name: 'Makhana / Fox Nuts (30g)',   calories: 103, protein: 3.5, carbs: 22,  fat: 0.2 },
];
```

**Add searchable food autocomplete to the DietPage calorie log form:**
```jsx
// In the "Log Meal" section of DietPage.jsx:
// Replace the plain text "Meal" input with a searchable select/autocomplete:
// - Type to filter INDIAN_FOODS by name
// - Selecting a food auto-fills: meal name + calories + (optionally) macros
// - "Custom" option lets users type in their own entries as before
```

**Files:** New `src/data/indianFoods.js`, `DietPage.jsx`.

---

### UX-18.3 — Currency Symbol Encoding Inconsistency 🟢

**Problem:** `ContactPage.jsx` uses `₹` which is the correct Unicode Rupee sign (U+20B9). But verify it's not accidentally using U+0965 (Devanagari sign, visually similar). Ensure consistency across all price displays.

**Fix:** Explicitly use the Unicode escape in all price strings:
```js
// In SVCS array:
price: '\u20B92,000'   // ₹ (RUPEE SIGN, U+20B9)
```
Test that it renders correctly in both light and dark themes across iOS Safari, Chrome Android, and desktop browsers.

**Files:** `ContactPage.jsx`.

---

### UX-18.4 — No Regional Language Support 🟢

**Problem:** FitTrack Pro is entirely in English. A meaningful and fast-growing segment of Indian gym-goers — particularly in Tier 2/3 cities — prefer Hindi for at least key motivational content.

**Short-term fix (no full i18n required):** Add Hindi subtitles to motivational copy only:
```jsx
// Streak card: add small Hindi subtitle
<div style={{ fontSize: 10, color: 'var(--t3)' }}>लगातार सत्र</div>  // "Continuous sessions"

// Goal card target label:
<div style={{ fontSize: 9, color: 'var(--t3)' }}>लक्ष्य</div>  // "Target"

// Workout complete screen:
<div style={{ fontSize: 12, color: 'var(--t2)' }}>शाबाश! 💪</div>  // "Well done!"
```

**Long-term:** Structure all UI copy into a `src/data/strings.js` constant file now — even if only English — to make full i18n straightforward later:
```js
// src/data/strings.js
export const strings = {
  en: {
    greeting_morning: 'Good Morning',
    streak_label: 'Current Streak',
    goal_label: 'Target',
    // ...
  },
  hi: {
    greeting_morning: 'सुप्रभात',
    streak_label: 'लगातार सत्र',
    goal_label: 'लक्ष्य',
    // ...
  }
};
```

**Files:** New `src/data/strings.js`, `DashboardPage.jsx`, `WorkoutPage.jsx`.

---

### UX-18.5 — No Gym-Finder Integration 🟢

**Problem:** A fitness app that doesn't help users *find where to train* leaves a core user job unaddressed. In India, finding nearby gyms (Cult.fit, Gold's Gym, Anytime Fitness) is a common pre-workout action.

**Fix (Phase 3 scope) — add a "Find Gyms Near Me" quick link:**
```jsx
// On Dashboard or Contact page:
<a
  href="https://www.google.com/maps/search/gym+near+me"
  target="_blank"
  rel="noopener noreferrer"
  className="btn-g"
  style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}
>
  📍 Find Gyms Near You
</a>
```
For a richer experience (Phase 3): integrate Google Maps Places API to show nearby gyms with ratings and distance.

**Files:** `DashboardPage.jsx` or `ContactPage.jsx`.
