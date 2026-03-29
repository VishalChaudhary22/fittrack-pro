// ─── BENCHMARK PROFILES ──────────────────────────────────────────────────────
// Hardcoded reference benchmarks representing typical Indian gym-goers.
// Used for percentile-style comparison on the Iron League page.
// Total XP values correspond to monthly XP accumulation patterns.
export const MONTHLY_BENCHMARKS = [
  {
    label: 'Beginner',
    sub: '~3 months training',
    totalXP: 8000,
    chest: 800, back: 900, shoulders: 700, biceps: 600, triceps: 500,
    traps: 400, quads: 800, hamstrings: 500, glutes: 400, calves: 300, abs: 600, forearms: 500,
  },
  {
    label: 'Intermediate',
    sub: '~1 year consistent',
    totalXP: 35000,
    chest: 3500, back: 4000, shoulders: 3000, biceps: 2500, triceps: 2500,
    traps: 2000, quads: 3500, hamstrings: 3000, glutes: 2500, calves: 2000, abs: 3000, forearms: 3000,
  },
  {
    label: 'Advanced',
    sub: '3+ years dedicated',
    totalXP: 80000,
    chest: 8000, back: 10000, shoulders: 7000, biceps: 5500, triceps: 5500,
    traps: 5000, quads: 8000, hamstrings: 7000, glutes: 6000, calves: 4000, abs: 7000, forearms: 7000,
  },
  {
    label: 'Competitive',
    sub: '5+ years, structured',
    totalXP: 150000,
    chest: 15000, back: 18000, shoulders: 13000, biceps: 10000, triceps: 10000,
    traps: 9000, quads: 15000, hamstrings: 13000, glutes: 11000, calves: 8000, abs: 14000, forearms: 14000,
  },
  {
    label: 'Elite',
    sub: 'Athlete-level',
    totalXP: 250000,
    chest: 25000, back: 30000, shoulders: 22000, biceps: 18000, triceps: 18000,
    traps: 16000, quads: 25000, hamstrings: 22000, glutes: 18000, calves: 14000, abs: 22000, forearms: 20000,
  },
];

// Returns the bracket the user falls into based on total XP
export const getBenchmarkBracket = (totalXP) => {
  let lower = null;
  let upper = null;
  for (let i = 0; i < MONTHLY_BENCHMARKS.length; i++) {
    if (totalXP < MONTHLY_BENCHMARKS[i].totalXP) {
      upper = MONTHLY_BENCHMARKS[i];
      lower = i > 0 ? MONTHLY_BENCHMARKS[i - 1] : null;
      break;
    }
  }
  if (!upper) {
    lower = MONTHLY_BENCHMARKS[MONTHLY_BENCHMARKS.length - 1];
  }
  return { lower, upper };
};
