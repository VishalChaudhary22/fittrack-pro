// ──── PER-EXERCISE MET VALUES ──────────────────────────────────────
// Keys are the LOWERCASED, UNDERSCORE-SEPARATED versions of exercise
// names from splits.js (e.g. 'Overhead Press' → 'overhead_press').
// Lookup: ex.name.toLowerCase().replace(/\s+/g, '_')
export const EXERCISE_MET = {
  // ── Compound Strength (high metabolic demand) ──
  'squats': 5.0,
  'bodyweight_squats': 4.0,
  'jump_squats': 8.0,
  'bulgarian_split_squats': 5.0,
  'deadlift': 6.0,
  'romanian_deadlift': 5.0,
  'leg_press': 5.0,
  'overhead_press': 4.0,
  'shoulder_press': 4.0,
  'dumbbell_shoulder_press': 4.0,
  'hip_thrust': 4.0,
  'pull-ups': 4.0,
  'pull_ups': 4.0,
  'chin-ups': 4.0,
  'chin_ups': 4.0,
  'push-ups': 3.5,
  'push_ups': 3.5,
  'diamond_push-ups': 3.5,
  'decline_push-ups': 3.5,
  'burpees': 8.0,

  // ── Chest & Press ──
  'flat_dumbbell_press': 3.5,
  'incline_dumbbell_press': 3.5,
  'chest_machine_press': 3.5,
  'incline_smith_machine_press': 3.5,
  'barbell_bench': 3.5,
  'bench_press': 3.5,

  // ── Back & Row ──
  'wide_grip_lat_pulldowns': 3.5,
  'close_grip_lat_pulldowns': 3.5,
  'horizontal_machine_row': 3.5,
  'wide_grip_t-bar_rows': 4.0,
  'seated_cable_row_(bar)': 3.5,
  'seated_horizontal_row': 3.5,
  't-bar_rows': 4.0,
  'australian_pull-ups': 3.5,

  // ── Isolation — Arms ──
  'bicep_curls': 3.0,
  'hammer_curls': 3.0,
  'preacher_curls': 3.0,
  'incline_bench_bicep_curls': 3.0,
  'biceps_cable_curls': 3.0,
  'tricep_pushdowns': 3.0,
  'single_hand_rope_pushdowns': 3.0,
  'single_hand_tricep_pushdowns': 3.0,
  'overhead_tricep_extension': 3.0,
  'single_hand_overhead_tricep_extension': 3.0,
  'single_hand_overhead_tricep_extensions': 3.0,
  'tricep_dips_(chair)': 3.5,

  // ── Isolation — Shoulders ──
  'lateral_raises': 3.0,
  'rear_delt_flyes': 3.0,
  'pike_push-ups': 3.5,

  // ── Legs & Glutes ──
  'leg_extension': 4.0,
  'leg_curls': 3.5,
  'seated_leg_curls': 3.5,
  'lying_leg_curls': 3.5,
  'leg_abductor_machine': 3.0,
  'calf_raises': 3.0,
  'glute_bridges': 3.5,
  'single-leg_glute_bridges': 3.5,
  'walking_lunges': 4.5,

  // ── Core ──
  'plank': 3.5,
  'hollow_body_hold': 3.5,
  'mountain_climbers': 6.0,

  // ── Yoga (whole-session MET is low, individual poses too) ──
  'surya_namaskar_(sun_salutation)': 3.5,
  'adho_mukha_svanasana_(downward_dog)': 2.5,
  'default_yoga': 2.5,

  // ── Cardio types (from WorkoutHistoryPage cardioLog) ──
  'running': 8.0,
  'cycling': 8.0,
  'swimming': 7.0,
  'hiit': 8.0,
  'walking': 3.5,
  'skipping_rope': 10.0,
  'jump_rope': 10.0,
  'cricket': 4.0,
  'badminton': 5.5,
  'football': 7.0,
  'other': 5.0,
};

// Category-level MET fallbacks (for exercises not mapped individually).
// The key matches `ex.primaryMuscle` values used in splits.js.
export const CATEGORY_MET = {
  'chest': 4.0,    'back': 4.0,    'shoulders': 3.5,
  'biceps': 3.0,   'triceps': 3.0, 'legs': 5.0,
  'quads': 5.0,    'hamstrings': 4.5, 'glutes': 4.0,
  'calves': 3.0,   'abs': 3.5,     'traps': 3.5,
  'forearms': 3.0, 'cardio': 7.0,
};

/**
 * Calculate estimated calories burned for a single workout log.
 * Lookup chain: EXERCISE_MET[exact name] → CATEGORY_MET[primaryMuscle] → 3.5 (default)
 * @param {Object} log - A workoutLog entry with exercises[] and durationMinutes
 * @param {number} userWeightKg - The user's body weight in kg
 * @returns {number|null} Estimated kcal or null if duration/weight missing
 */
export const calcWorkoutCalories = (log, userWeightKg) => {
  if (!log.durationMinutes || !userWeightKg) return null;
  const durationHours = log.durationMinutes / 60;
  // Weighted average MET across exercises in the session
  const avgMet = log.exercises?.length
    ? log.exercises.reduce((sum, ex) => {
        const key = ex.name?.toLowerCase().replace(/\s+/g, '_');
        const met = EXERCISE_MET[key]
          || CATEGORY_MET[ex.primaryMuscle]
          || 3.5;
        return sum + met;
      }, 0) / log.exercises.length
    : 3.5;
  return Math.round(avgMet * userWeightKg * durationHours);
};

/**
 * Calculate estimated calories burned for a cardio log entry.
 * Uses the cardioLog's type field to look up MET, or falls back to 5.0.
 * @param {Object} cardioEntry - A cardioLog entry with type, minutes, and optionally calories
 * @param {number} userWeightKg
 * @returns {number} Estimated kcal (prefers entry.calories if already provided by user)
 */
export const calcCardioCalories = (cardioEntry, userWeightKg) => {
  // If user already provided calories on manual entry, use that
  if (cardioEntry.calories && cardioEntry.calories > 0) return cardioEntry.calories;
  if (!cardioEntry.minutes || !userWeightKg) return 0;
  const met = EXERCISE_MET[cardioEntry.type?.toLowerCase()] || 5.0;
  return Math.round(met * userWeightKg * (cardioEntry.minutes / 60));
};
