// ─── MUSCLE GROUPS ───────────────────────────────────────────────────────────
export const MUSCLE_GROUPS = [
  { key: 'chest',      label: 'Chest',       region: 'upper', side: 'front' },
  { key: 'back',       label: 'Back',        region: 'upper', side: 'back'  },
  { key: 'shoulders',  label: 'Shoulders',   region: 'upper', side: 'front' },
  { key: 'biceps',     label: 'Biceps',      region: 'upper', side: 'front' },
  { key: 'triceps',    label: 'Triceps',     region: 'upper', side: 'back'  },
  { key: 'traps',      label: 'Traps',       region: 'upper', side: 'back'  },
  { key: 'quads',      label: 'Quads',       region: 'lower', side: 'front' },
  { key: 'hamstrings', label: 'Hamstrings',  region: 'lower', side: 'back'  },
  { key: 'glutes',     label: 'Glutes',      region: 'lower', side: 'back'  },
  { key: 'calves',     label: 'Calves',      region: 'lower', side: 'back'  },
  { key: 'abs',        label: 'Abs',         region: 'core',  side: 'front' },
  { key: 'forearms',   label: 'Forearms',    region: 'upper', side: 'front' },
];

// ─── EXERCISE MUSCLE FIELD → CANONICAL MUSCLE GROUP(S) ──────────────────────
// Maps the `muscle` field on exercises to one or more canonical keys
const MAP = {
  'Chest':          ['chest'],
  'Back':           ['back', 'traps'],
  'Back/Hamstrings':['back', 'hamstrings'],
  'Shoulders':      ['shoulders'],
  'Rear Delts':     ['shoulders', 'back'],
  'Biceps':         ['biceps', 'forearms'],
  'Triceps':        ['triceps'],
  'Quads':          ['quads', 'glutes'],
  'Hamstrings':     ['hamstrings', 'glutes'],
  'Calves':         ['calves'],
  'Abs':            ['abs'],
  'Core':           ['abs'],
  'Abductors':      ['glutes', 'quads'],
  'Adductors':      ['quads'],
  'Forearms':       ['forearms'],
  'Traps':          ['traps'],
  'Glutes':         ['glutes'],
};

export const getMusclesForExercise = (muscleField) => MAP[muscleField] || [];

// ─── RANK TIERS ──────────────────────────────────────────────────────────────
const TIER_STYLES = [
  { name: 'Untrained',  color: '#555',     bg: 'rgba(85,85,85,.15)' },
  { name: 'Bronze I',   color: '#CD7F32',  bg: 'rgba(205,127,50,.15)' },
  { name: 'Bronze II',  color: '#CD7F32',  bg: 'rgba(205,127,50,.15)' },
  { name: 'Bronze III', color: '#CD7F32',  bg: 'rgba(205,127,50,.15)' },
  { name: 'Silver I',   color: '#C0C0C0',  bg: 'rgba(192,192,192,.15)' },
  { name: 'Silver II',  color: '#C0C0C0',  bg: 'rgba(192,192,192,.15)' },
  { name: 'Silver III', color: '#C0C0C0',  bg: 'rgba(192,192,192,.15)' },
  { name: 'Gold I',     color: '#FFD700',  bg: 'rgba(255,215,0,.15)' },
  { name: 'Gold II',    color: '#FFD700',  bg: 'rgba(255,215,0,.15)' },
  { name: 'Gold III',   color: '#FFD700',  bg: 'rgba(255,215,0,.15)' },
  { name: 'Platinum',   color: '#40E0D0',  bg: 'rgba(64,224,208,.15)' },
  { name: 'Diamond',    color: '#B9F2FF',  bg: 'rgba(185,242,255,.15)' },
  { name: 'Master',     color: '#FF69B4',  bg: 'rgba(255,105,180,.15)' },
  { name: 'Legend',     color: '#FFD700',  bg: 'linear-gradient(135deg,rgba(255,215,0,.2),rgba(232,84,13,.2))' },
];

const MUSCLE_XPS = [0, 200, 600, 1200, 2000, 3000, 4500, 6500, 9000, 12000, 16000, 22000, 30000, 40000];
const OVERALL_XPS = [0, 2000, 5000, 10000, 20000, 35000, 50000, 70000, 95000, 125000, 160000, 200000, 250000, 320000];

export const MUSCLE_RANK_TIERS = TIER_STYLES.map((t, i) => ({ ...t, minXP: MUSCLE_XPS[i] }));
export const OVERALL_RANK_TIERS = TIER_STYLES.map((t, i) => ({ ...t, minXP: OVERALL_XPS[i] }));
export const RANK_TIERS = MUSCLE_RANK_TIERS; // Backwards compat

export const getRank = (xp, type = 'muscle') => {
  const tiers = type === 'overall' ? OVERALL_RANK_TIERS : MUSCLE_RANK_TIERS;
  let rank = tiers[0];
  for (const tier of tiers) {
    if (xp >= tier.minXP) rank = tier;
    else break;
  }
  // Calculate progress to next tier
  const idx = tiers.indexOf(rank);
  const next = tiers[idx + 1];
  const progress = next ? xp / next.minXP : 1;
  return { ...rank, progress: Math.min(progress, 1), nextXP: next?.minXP || rank.minXP };
};

// ─── XP CALCULATION ──────────────────────────────────────────────────────────
// Computes total XP per muscle group from workout logs
// Filters to current calendar month only and applies volume + consistency bonuses.
export const calcAllMuscleXP = (workoutLogs, splits, user) => {
  const userId = typeof user === 'string' ? user : (user?.id || 'vishal');
  const activeSplitId = typeof user === 'string' ? 'ppl' : (user?.activeSplitId || 'ppl');
  
  const xp = {};
  const sessionsPerMuscle = {};
  MUSCLE_GROUPS.forEach(m => { 
    xp[m.key] = 0; 
    sessionsPerMuscle[m.key] = 0;
  });

  // Build exercise name → muscle field lookup from splits
  const exMuscleMap = {};
  splits.forEach(split => {
    split.days?.forEach(day => {
      day.exercises?.forEach(ex => {
        if (ex.name && ex.muscle) exMuscleMap[ex.name] = ex.muscle;
      });
    });
  });

  // Filter logs to current calendar month
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);
  
  const userLogs = workoutLogs.filter(l => 
    (l.userId === userId || l.userId === 'vishal') && 
    new Date(l.date) >= startOfMonth
  );

  // Process workout logs
  userLogs.forEach(log => {
    // Keep track of which muscles were trained in this specific session
    const trainedInSession = new Set();
    
    log.exercises?.forEach(ex => {
      const muscleField = exMuscleMap[ex.name];
      if (!muscleField) return;
      const muscles = getMusclesForExercise(muscleField);
      if (muscles.length === 0) return;

      let exXP = 0;
      let completedSets = 0;
      let totalWeight = 0;

      ex.sets?.forEach(s => {
        const reps = s.reps || 0;
        const weight = s.weight || 0;
        if (reps > 0) {
          completedSets++;
          totalWeight += weight;
        }
        exXP += reps * Math.max(weight, 1); // Bodyweight exercises get at least 1
      });

      // Volume quality bonus (≥3 sets, meaningful weight ≥20kg or bodyweight)
      const avgWeight = completedSets > 0 ? totalWeight / completedSets : 0;
      const qualityBonus = (completedSets >= 3 && (avgWeight >= 20 || avgWeight === 0)) ? 1.15 : 1.0;
      exXP = exXP * qualityBonus;

      // Distribute XP across targeted muscles (primary gets more)
      const perMuscle = Math.round(exXP / muscles.length);
      muscles.forEach(m => { 
        xp[m] = (xp[m] || 0) + perMuscle; 
        trainedInSession.add(m);
      });
    });

    // Mark sessions for consistency bonus later
    trainedInSession.forEach(m => {
      if (sessionsPerMuscle[m] !== undefined) {
        sessionsPerMuscle[m]++;
      }
    });
  });

  // Estimate expected sessions per month based on split (rough heuristics: PPL = ~8x/mo)
  const activeSplit = splits.find(s => s.id === activeSplitId);
  const expectedSessionsPerMuscle = {};
  MUSCLE_GROUPS.forEach(m => { expectedSessionsPerMuscle[m.key] = 0; });
  
  if (activeSplit && activeSplit.days) {
    const splitLength = activeSplit.days.length; // e.g. 6 days
    // Assume 4 weeks per month, multiply by (7 / splitLength) roughly 
    const weeksInMonth = 4.3;
    const splitCyclesPerMonth = (7 / Math.max(splitLength, 1)) * weeksInMonth;
    
    activeSplit.days.forEach(day => {
      const dayMuscles = new Set();
      day.exercises?.forEach(ex => {
        const mf = exMuscleMap[ex.name] || ex.muscle;
        getMusclesForExercise(mf).forEach(m => dayMuscles.add(m));
      });
      dayMuscles.forEach(m => {
        if (expectedSessionsPerMuscle[m] !== undefined) {
          expectedSessionsPerMuscle[m] += splitCyclesPerMonth;
        }
      });
    });
  }

  // Apply Consistency Bonus
  MUSCLE_GROUPS.forEach(m => {
    const expected = Math.max(Math.round(expectedSessionsPerMuscle[m.key] || 4), 4); // Default 4x/month
    const actual = sessionsPerMuscle[m.key];
    const consistencyRatio = actual / expected;
    
    if (consistencyRatio >= 1.0) {
      xp[m.key] = Math.round(xp[m.key] * 1.5);
    } else if (consistencyRatio >= 0.8) {
      xp[m.key] = Math.round(xp[m.key] * 1.25);
    }
  });

  return xp;
};

// ─── WEEKLY MUSCLE TRACKING ──────────────────────────────────────────────────
export const getWeeklyMuscles = (workoutLogs, splits, userId) => {
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay()); // Sunday
  startOfWeek.setHours(0, 0, 0, 0);

  const trained = new Set();

  const exMuscleMap = {};
  splits.forEach(split => {
    split.days?.forEach(day => {
      day.exercises?.forEach(ex => {
        if (ex.name && ex.muscle) exMuscleMap[ex.name] = ex.muscle;
      });
    });
  });

  const userLogs = workoutLogs.filter(l =>
    (l.userId === userId || l.userId === 'vishal') &&
    new Date(l.date) >= startOfWeek
  );

  userLogs.forEach(log => {
    log.exercises?.forEach(ex => {
      const muscleField = exMuscleMap[ex.name];
      if (!muscleField) return;
      getMusclesForExercise(muscleField).forEach(m => trained.add(m));
    });
  });

  return [...trained];
};

// ─── OVERALL RANK ────────────────────────────────────────────────────────────
export const getOverallRank = (muscleXP) => {
  const totalXP = Object.values(muscleXP).reduce((a, b) => a + b, 0);
  return { ...getRank(totalXP, 'overall'), totalXP };
};
