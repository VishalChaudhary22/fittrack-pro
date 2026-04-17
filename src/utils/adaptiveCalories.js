/**
 * Smart Diet Auto-Adjustment Utilities
 * 
 * All functions are pure — no side effects, no imports from AppContext.
 * Uses evidence-based rates from NASM, ISSN, and NIN guidelines.
 */

/**
 * Compute rolling weekly rate of weight change from health logs.
 * Uses least-squares linear regression for noise resistance.
 *
 * @param {Array<{date: string, weight: number}>} logs - weight entries
 * @param {number} windowDays - lookback window (default 28)
 * @returns {{ rateKgPerWeek: number, confidence: 'low'|'medium'|'high', logsUsed: number, startWeight: number, endWeight: number }}
 */
export const computeWeeklyRate = (logs, windowDays = 28) => {
  if (!logs || logs.length === 0) {
    return { rateKgPerWeek: 0, confidence: 'low', logsUsed: 0, startWeight: 0, endWeight: 0 };
  }

  // Filter to window and sort ascending
  const now = new Date();
  const cutoff = new Date(now);
  cutoff.setDate(cutoff.getDate() - windowDays);

  const filtered = logs
    .filter(l => l.weight && l.date && new Date(l.date) >= cutoff)
    .sort((a, b) => a.date.localeCompare(b.date));

  if (filtered.length < 2) {
    return {
      rateKgPerWeek: 0,
      confidence: 'low',
      logsUsed: filtered.length,
      startWeight: filtered[0]?.weight || 0,
      endWeight: filtered[filtered.length - 1]?.weight || 0,
    };
  }

  // Compute days since first entry for each point
  const firstDate = new Date(filtered[0].date);
  const points = filtered.map(l => ({
    x: (new Date(l.date) - firstDate) / (1000 * 60 * 60 * 24), // days since start
    y: l.weight,
  }));

  const n = points.length;
  let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
  for (const p of points) {
    sumX += p.x;
    sumY += p.y;
    sumXY += p.x * p.y;
    sumXX += p.x * p.x;
  }

  const denominator = n * sumXX - sumX * sumX;
  // Slope is kg/day; multiply x7 for kg/week
  const slopePerDay = denominator !== 0 ? (n * sumXY - sumX * sumY) / denominator : 0;
  const rateKgPerWeek = slopePerDay * 7;

  // Confidence based on data density
  const confidence = n >= 11 ? 'high' : n >= 5 ? 'medium' : 'low';

  return {
    rateKgPerWeek: Math.round(rateKgPerWeek * 100) / 100,
    confidence,
    logsUsed: n,
    startWeight: filtered[0].weight,
    endWeight: filtered[filtered.length - 1].weight,
  };
};

/**
 * Classify the scenario based on weekly rate, goal, and bodyweight.
 * Returns one of S1–S10 scenario codes plus severity and actionable message.
 *
 * @param {{ rateKgPerWeek: number, confidence: string, logsUsed: number }} rateData
 * @param {{ goal: 'loss'|'gain'|'maintain', currentWeight: number, goalKcal: number, gender: string }} params
 * @returns {{ scenario: string, severity: 'info'|'warning'|'action', adjustKcal: number, message: string, reasoning: string }}
 */
export const classifyScenario = (rateData, params) => {
  const { rateKgPerWeek, confidence, logsUsed } = rateData;
  const { goal, currentWeight, goalKcal, gender } = params;
  const bwPct = currentWeight > 0 ? Math.abs(rateKgPerWeek) / currentWeight * 100 : 0;

  // S10: Insufficient data
  if (logsUsed < 5) {
    return {
      scenario: 'S10',
      severity: 'info',
      adjustKcal: 0,
      message: 'Need more data',
      reasoning: 'Log your weight for at least 2 weeks (5+ entries) to get personalised calorie adjustments.',
    };
  }

  if (goal === 'loss') {
    // S1: Losing too fast (>1.0% BW/week for 2+ weeks)
    if (rateKgPerWeek < 0 && bwPct > 1.0) {
      const adjust = bwPct > 1.5 ? 250 : 150;
      return {
        scenario: 'S1',
        severity: 'action',
        adjustKcal: adjust,
        message: "You're losing weight too fast",
        reasoning: `You're losing ${Math.abs(rateKgPerWeek).toFixed(1)} kg/week (${bwPct.toFixed(1)}% of bodyweight) — faster than the safe maximum of 1.0%. We suggest adding ${adjust} kcal to protect your muscle mass.`,
      };
    }
    // S3: Not losing / gaining when should lose
    if (rateKgPerWeek > 0.05) {
      const adjust = rateKgPerWeek > 0.3 ? -400 : -250;
      return {
        scenario: 'S3',
        severity: 'action',
        adjustKcal: adjust,
        message: "You're gaining instead of losing",
        reasoning: `You've gained ${rateKgPerWeek.toFixed(1)} kg/week over the last few weeks despite a weight loss goal. We recommend reducing your daily intake by ${Math.abs(adjust)} kcal.`,
      };
    }
    // S2: Losing too slowly (stall)
    if (Math.abs(rateKgPerWeek) < 0.1 && logsUsed >= 7) {
      return {
        scenario: 'S2',
        severity: 'warning',
        adjustKcal: -200,
        message: 'Weight loss has stalled',
        reasoning: `Your weight has barely moved (${Math.abs(rateKgPerWeek).toFixed(2)} kg/week) over the past 3+ weeks. A small reduction of 200 kcal may help break through.`,
      };
    }
    // S6: On track
    if (rateKgPerWeek < -0.1 && bwPct <= 1.0) {
      return {
        scenario: 'S6',
        severity: 'info',
        adjustKcal: 0,
        message: "You're on track! 🎯",
        reasoning: `Losing ${Math.abs(rateKgPerWeek).toFixed(1)} kg/week — right in the sweet spot. Keep it up!`,
      };
    }
  }

  if (goal === 'gain') {
    // S4: Gaining too fast (>0.5% BW/week)
    if (rateKgPerWeek > 0 && bwPct > 0.5) {
      const adjust = bwPct > 0.8 ? -250 : -150;
      return {
        scenario: 'S4',
        severity: 'warning',
        adjustKcal: adjust,
        message: "You're gaining too fast",
        reasoning: `Gaining ${rateKgPerWeek.toFixed(1)} kg/week (${bwPct.toFixed(1)}% BW) — much of this is likely fat. Reducing ${Math.abs(adjust)} kcal will promote leaner gains.`,
      };
    }
    // S5: Not gaining at all
    if (rateKgPerWeek < 0.05 && logsUsed >= 7) {
      return {
        scenario: 'S5',
        severity: 'warning',
        adjustKcal: 200,
        message: 'Not gaining weight',
        reasoning: `You're barely gaining (${rateKgPerWeek.toFixed(2)} kg/week). Adding 200 kcal should help push you into a productive surplus. Check protein intake too.`,
      };
    }
    // S6: On track
    if (rateKgPerWeek >= 0.05 && bwPct <= 0.5) {
      return {
        scenario: 'S6',
        severity: 'info',
        adjustKcal: 0,
        message: "You're on track! 💪",
        reasoning: `Gaining ${rateKgPerWeek.toFixed(2)} kg/week — ideal pace for lean muscle growth. Keep it up!`,
      };
    }
  }

  if (goal === 'maintain') {
    // S7: Drifting up
    if (rateKgPerWeek > 0.3) {
      return {
        scenario: 'S7',
        severity: 'warning',
        adjustKcal: -150,
        message: 'Weight creeping up',
        reasoning: `You're gaining ${rateKgPerWeek.toFixed(1)} kg/week, which adds up over time. A small 150 kcal reduction should stabilise you.`,
      };
    }
    // S8: Drifting down
    if (rateKgPerWeek < -0.3) {
      return {
        scenario: 'S8',
        severity: 'warning',
        adjustKcal: 150,
        message: 'Weight dropping unintentionally',
        reasoning: `You're losing ${Math.abs(rateKgPerWeek).toFixed(1)} kg/week while trying to maintain. Adding 150 kcal should help stabilise.`,
      };
    }
    // S6: On track
    return {
      scenario: 'S6',
      severity: 'info',
      adjustKcal: 0,
      message: 'Weight is stable ✓',
      reasoning: 'Your weight is holding steady — maintenance targets are working well.',
    };
  }

  // Fallback — on track / unknown
  return {
    scenario: 'S6',
    severity: 'info',
    adjustKcal: 0,
    message: "You're on track!",
    reasoning: 'Current rate of change looks healthy. Keep going!',
  };
};

/**
 * Compute new suggested daily calorie target after adjustment.
 * Enforces absolute floors and ceilings.
 *
 * @param {number} currentKcal
 * @param {number} adjustKcal - positive = increase, negative = decrease
 * @param {string} gender - 'male' | 'female'
 * @param {number} tdee - for ceiling computation
 * @returns {{ newKcal: number, clamped: boolean, reason?: string }}
 */
export const computeNewTarget = (currentKcal, adjustKcal, gender = 'male', tdee = 2500) => {
  const floor = gender === 'female' ? 1200 : 1400;
  const ceiling = tdee + 600;
  let newKcal = Math.round(currentKcal + adjustKcal);
  let clamped = false;
  let reason = null;

  if (newKcal < floor) {
    newKcal = floor;
    clamped = true;
    reason = `Adjusted to minimum safe intake of ${floor} kcal`;
  } else if (newKcal > ceiling) {
    newKcal = ceiling;
    clamped = true;
    reason = `Capped at TDEE + 600 (${ceiling} kcal)`;
  }

  return { newKcal, clamped, reason };
};

/**
 * Recompute protein/carbs/fat targets based on new calorie target and goal.
 *
 * @param {{ goal: string, currentWeight: number, goalWeight: number, newKcal: number, workoutDays: number }} params
 * @returns {{ protein: number, carbs: number, fat: number }}
 */
export const recomputeMacros = ({ goal, currentWeight, goalWeight, newKcal, workoutDays = 5 }) => {
  let protein, carbs, fat;

  if (goal === 'loss') {
    // Use goal weight for protein calc (NASM standard)
    const baseWeight = goalWeight && goalWeight < currentWeight ? goalWeight : currentWeight;
    const isHeavyCut = workoutDays >= 5;
    protein = Math.round(baseWeight * (isHeavyCut ? 2.0 : 1.8));
    fat = Math.round((newKcal * 0.25) / 9);
    carbs = Math.round((newKcal - protein * 4 - fat * 9) / 4);
  } else if (goal === 'gain') {
    protein = Math.round(currentWeight * 2.0);
    fat = Math.round((newKcal * 0.20) / 9);
    carbs = Math.round((newKcal - protein * 4 - fat * 9) / 4);
  } else {
    // maintain
    protein = Math.round(currentWeight * 1.8);
    fat = Math.round((newKcal * 0.25) / 9);
    carbs = Math.round((newKcal - protein * 4 - fat * 9) / 4);
  }

  // Guard against negative carbs
  if (carbs < 50) carbs = 50;

  return { protein, carbs, fat };
};

/**
 * Returns true if enough data exists to make a suggestion.
 * Requires 5+ weight logs spanning ≥ 14 days.
 *
 * @param {Array<{date: string, weight: number}>} logs
 * @returns {boolean}
 */
export const hasSufficientData = (logs) => {
  if (!logs || logs.length < 5) return false;

  const valid = logs.filter(l => l.weight && l.date).sort((a, b) => a.date.localeCompare(b.date));
  if (valid.length < 5) return false;

  const first = new Date(valid[0].date);
  const last = new Date(valid[valid.length - 1].date);
  const spanDays = (last - first) / (1000 * 60 * 60 * 24);

  return spanDays >= 14;
};

/**
 * Check whether enough time has passed since the last suggestion (7-day cooldown).
 *
 * @param {string|null} lastSuggestionDate - ISO date string
 * @returns {{ canSuggest: boolean, daysSinceLast: number | null }}
 */
export const checkSuggestionCooldown = (lastSuggestionDate) => {
  if (!lastSuggestionDate) return { canSuggest: true, daysSinceLast: null };

  const last = new Date(lastSuggestionDate);
  const now = new Date();
  const diffMs = now - last;
  const daysSinceLast = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  return {
    canSuggest: daysSinceLast >= 7,
    daysSinceLast,
  };
};
