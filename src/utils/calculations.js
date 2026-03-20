import { ACTIVITY } from '../data/constants';

// ─── BMI ──────────────────────────────────────────────────────────────────────
export const calcBMI = (w, h) => (!w || !h) ? null : (w / ((h / 100) ** 2)).toFixed(1);

export const getBMICat = b => {
  if (!b) return { label: 'N/A' };
  const v = parseFloat(b);
  if (v < 18.5) return { label: 'Underweight' };
  if (v < 25) return { label: 'Normal' };
  if (v < 30) return { label: 'Overweight' };
  return { label: 'Obese' };
};

// ─── BMR (Mifflin-St Jeor) ───────────────────────────────────────────────────
export const calcBMR = (w, h, age, g) =>
  Math.round(10 * w + 6.25 * h - 5 * age + (g === 'male' ? 5 : g === 'female' ? -161 : -78));

// ─── TDEE ─────────────────────────────────────────────────────────────────────
export const calcTDEE = (bmr, lvl) =>
  Math.round(bmr * (ACTIVITY[lvl]?.mult || 1.55));

// ─── Goal from weight difference ─────────────────────────────────────────────
export const goalFromWeight = (curr, tgt) => {
  if (!tgt) return 'maintenance';
  const d = curr - tgt;
  if (d > 2) return 'loss';
  if (d < -2) return 'gain';
  return 'maintenance';
};

// ─── Dynamic caloric deficit/surplus based on timeline ────────────────────────
// 1 kg of body fat ≈ 7700 kcal. So to lose/gain X kg in Y weeks:
// daily deficit/surplus = (X * 7700) / (Y * 7)
export const calcDeficit = (currWeight, goalWeight, goalWeeks) => {
  if (!goalWeight || !goalWeeks || goalWeeks <= 0) return { goal: 'maintenance', dailyDelta: 0 };
  const diff = currWeight - goalWeight; // positive = loss, negative = gain
  const absDiff = Math.abs(diff);
  if (absDiff < 0.5) return { goal: 'maintenance', dailyDelta: 0 };
  const daily = Math.round((absDiff * 7700) / (goalWeeks * 7));
  // Cap at 1000 kcal/day for safety
  const capped = Math.min(daily, 1000);
  const goal = diff > 0 ? 'loss' : 'gain';
  return { goal, dailyDelta: capped, weeklyKg: +(capped * 7 / 7700).toFixed(2) };
};

// ─── 1RM Calculator (Epley Formula) ──────────────────────────────────────────
export const calc1RM = (weight, reps) => {
  if (!weight || weight <= 0 || !reps || reps <= 0) return 0;
  if (reps === 1) return weight;
  return Math.round(weight * (1 + reps / 30));
};

// ─── Estimate 1RM from sets array ────────────────────────────────────────────
export const best1RMFromSets = (sets) => {
  if (!sets || !sets.length) return 0;
  return Math.max(...sets.map(s => calc1RM(s.weight || 0, s.reps || 0)));
};
