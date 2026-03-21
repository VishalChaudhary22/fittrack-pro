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
export const RANK_TIERS = [
  { name: 'Untrained',   minXP: 0,      color: '#555',     bg: 'rgba(85,85,85,.15)' },
  { name: 'Bronze I',    minXP: 200,    color: '#CD7F32',  bg: 'rgba(205,127,50,.15)' },
  { name: 'Bronze II',   minXP: 500,    color: '#CD7F32',  bg: 'rgba(205,127,50,.15)' },
  { name: 'Bronze III',  minXP: 1000,   color: '#CD7F32',  bg: 'rgba(205,127,50,.15)' },
  { name: 'Silver I',    minXP: 2000,   color: '#C0C0C0',  bg: 'rgba(192,192,192,.15)' },
  { name: 'Silver II',   minXP: 3500,   color: '#C0C0C0',  bg: 'rgba(192,192,192,.15)' },
  { name: 'Silver III',  minXP: 5000,   color: '#C0C0C0',  bg: 'rgba(192,192,192,.15)' },
  { name: 'Gold I',      minXP: 7500,   color: '#FFD700',  bg: 'rgba(255,215,0,.15)' },
  { name: 'Gold II',     minXP: 10000,  color: '#FFD700',  bg: 'rgba(255,215,0,.15)' },
  { name: 'Gold III',    minXP: 15000,  color: '#FFD700',  bg: 'rgba(255,215,0,.15)' },
  { name: 'Platinum',    minXP: 25000,  color: '#40E0D0',  bg: 'rgba(64,224,208,.15)' },
  { name: 'Diamond',     minXP: 40000,  color: '#B9F2FF',  bg: 'rgba(185,242,255,.15)' },
  { name: 'Master',      minXP: 60000,  color: '#FF69B4',  bg: 'rgba(255,105,180,.15)' },
  { name: 'Legend',      minXP: 100000, color: '#FFD700',  bg: 'linear-gradient(135deg,rgba(255,215,0,.2),rgba(232,84,13,.2))' },
];

export const getRank = (xp) => {
  let rank = RANK_TIERS[0];
  for (const tier of RANK_TIERS) {
    if (xp >= tier.minXP) rank = tier;
    else break;
  }
  // Calculate progress to next tier
  const idx = RANK_TIERS.indexOf(rank);
  const next = RANK_TIERS[idx + 1];
  const progress = next ? (xp - rank.minXP) / (next.minXP - rank.minXP) : 1;
  return { ...rank, progress: Math.min(progress, 1), nextXP: next?.minXP || rank.minXP };
};

// ─── XP CALCULATION ──────────────────────────────────────────────────────────
// Computes total XP per muscle group from workout logs
// XP = sum of (reps × weight) for each set, mapped through the exercise→muscle mapping
export const calcAllMuscleXP = (workoutLogs, splits, userId) => {
  const xp = {};
  MUSCLE_GROUPS.forEach(m => { xp[m.key] = 0; });

  // Build exercise name → muscle field lookup from splits
  const exMuscleMap = {};
  splits.forEach(split => {
    split.days?.forEach(day => {
      day.exercises?.forEach(ex => {
        if (ex.name && ex.muscle) exMuscleMap[ex.name] = ex.muscle;
      });
    });
  });

  // Process workout logs
  const userLogs = workoutLogs.filter(l => l.userId === userId || l.userId === 'vishal');
  userLogs.forEach(log => {
    log.exercises?.forEach(ex => {
      const muscleField = exMuscleMap[ex.name];
      if (!muscleField) return;
      const muscles = getMusclesForExercise(muscleField);
      if (muscles.length === 0) return;

      let exXP = 0;
      ex.sets?.forEach(s => {
        const reps = s.reps || 0;
        const weight = s.weight || 0;
        exXP += reps * Math.max(weight, 1); // Bodyweight exercises get at least 1
      });

      // Distribute XP across targeted muscles (primary gets more)
      const perMuscle = Math.round(exXP / muscles.length);
      muscles.forEach(m => { xp[m] = (xp[m] || 0) + perMuscle; });
    });
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
  return { ...getRank(totalXP), totalXP };
};
