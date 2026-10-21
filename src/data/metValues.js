// ──── MET VALUES FOR ENERGY EXPENDITURE ────────────────────────────────────
//
// MET (Metabolic Equivalent of Task) values come from the Compendium of
// Physical Activities. Resistance-training and calisthenic entries are
// deliberately coarse: we only need a session-level average, and the
// variance between individuals dwarfs the difference between two
// neighbouring exercises in the same movement pattern.
//
// KEYS are normalised exercise names, not display names. Always go through
// `normalizeExerciseKey()` — never index this table with a raw name.
//   'Bent-Over Barbell Row' → 'bent_over_barbell_row'
//
// Values for compound lifts are set at the heavier end of the band because
// Kaaya's split library is written for barbell/dumbbell training, while
// bodyweight variants get their own (lower) entries.

/**
 * Normalise an exercise name into a lookup key.
 * Lowercase, every run of non-alphanumerics collapsed to a single
 * underscore, no leading/trailing underscore.
 *
 * 'Bent-Over Barbell Row'  → 'bent_over_barbell_row'
 * 'Pull-ups'               → 'pull_ups'
 * 'Cable Fly'              → 'cable_fly'
 * 'Tricep Dips (Chair)'    → 'tricep_dips_chair'
 */
export const normalizeExerciseKey = (name) =>
  String(name || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');

// ──── PER-EXERCISE MET VALUES ──────────────────────────────────────────────
export const EXERCISE_MET = {
  // ── Squat patterns ──
  'squats': 5.0,
  'bodyweight_squats': 4.0,
  'back_squat': 5.0,
  'barbell_back_squat': 5.0,
  'high_bar_back_squat': 5.0,
  'jump_squats': 8.0,
  'bulgarian_split_squats': 5.0,
  'goblet_squats': 4.5,
  'front_squats': 5.5,
  'sumo_squats': 5.0,
  'smith_machine_squats': 5.0,
  'hack_squats': 6.0,
  'sissy_squats': 5.0,
  'pendulum_squats': 4.0,

  // ── Hinge / deadlift patterns ──
  'deadlift': 6.0,
  'conventional_deadlift': 6.0,
  'sumo_deadlift': 6.0,
  'trap_bar_deadlift': 6.0,
  'romanian_deadlift': 5.0,
  'stiff_leg_deadlift': 5.0,
  'block_pull': 5.0,
  'good_mornings': 4.0,

  // ── Horizontal push ──
  'bench_press': 5.0,
  'barbell_bench_press': 5.0,
  'flat_barbell_bench_press': 5.0,
  'incline_barbell_bench_press': 4.0,
  'flat_dumbbell_press': 3.5,
  'incline_dumbbell_press': 4.0,
  'incline_smith_machine_press': 4.0,
  'smith_machine_incline_press': 4.0,
  'chest_machine_press': 3.5,
  'machine_chest_press': 3.5,
  'dumbbell_floor_press': 3.5,
  'close_grip_bench_press': 4.0,
  'dumbbell_pullover': 3.5,
  'push_press': 6.0,

  // ── Chest isolation ──
  'cable_fly': 3.5,
  'low_to_high_cable_fly': 3.5,
  'pec_deck_fly': 3.0,
  'dumbbell_fly': 3.0,
  'svend_press': 3.0,

  // ── Vertical pull ──
  'pull_ups': 4.0,
  'weighted_pull_up': 5.0,
  'assisted_pull_ups': 3.5,
  'chin_ups': 4.0,
  'chin_ups_assisted': 3.5,
  'chin_ups_weighted': 5.0,
  'australian_pull_ups': 3.5,
  'lat_pulldown': 3.5,
  'wide_grip_lat_pulldowns': 3.5,
  'close_grip_lat_pulldowns': 3.5,
  'neutral_grip_lat_pulldown': 3.5,
  'straight_arm_lat_pulldown': 3.5,

  // ── Horizontal pull ──
  'seated_horizontal_row': 3.5,
  'seated_cable_row': 3.5,
  'seated_cable_row_bar': 3.5,
  'chest_supported_row': 3.5,
  'horizontal_machine_row': 3.5,
  'dumbbell_row': 4.0,
  'one_arm_dumbbell_row': 3.5,
  'barbell_row': 4.5,
  'bent_over_barbell_row': 4.5,
  't_bar_rows': 4.5,
  'wide_grip_t_bar_rows': 4.5,
  'resistance_band_rows': 3.0,
  'inverted_rows': 3.5,

  // ── Shoulders ──
  'shoulder_press': 4.0,
  'overhead_press': 4.0,
  'dumbbell_shoulder_press': 4.0,
  'machine_shoulder_press': 4.0,
  'standing_barbell_overhead_press': 4.5,
  'arnold_press': 4.0,
  'lateral_raises': 3.0,
  'machine_lateral_raise': 3.0,
  'dumbbell_lateral_raises': 3.0,
  'seated_dumbbell_lateral_raises': 3.0,
  'cable_lateral_raises': 3.0,
  'rear_delt_flyes': 3.0,
  'cable_reverse_fly': 3.0,
  'face_pulls': 3.0,
  'band_pull_apart': 2.5,

  // ── Biceps ──
  'bicep_curls': 3.0,
  'biceps_cable_curls': 3.0,
  'cable_curls': 3.0,
  'dumbbell_curls': 3.0,
  'alternating_dumbbell_curl': 3.0,
  'barbell_curl': 3.0,
  'ez_bar_curls': 3.0,
  'concentration_curls': 3.0,
  'cross_body_hammer_curl': 3.0,
  'hammer_curls': 3.0,
  'rope_hammer_curls': 3.0,
  'preacher_curls': 3.0,
  'machine_preacher_curl': 3.0,
  'reverse_curls': 3.0,
  'spider_curls': 3.0,

  // ── Triceps ──
  'tricep_pushdowns': 3.0,
  'tricep_rope_pushdowns': 3.0,
  'straight_bar_pushdowns': 3.0,
  'v_bar_pushdowns': 3.0,
  'cable_triceps_pushdown': 3.0,
  'overhead_triceps_extension': 3.0,
  'overhead_tricep_extension': 3.0,
  'overhead_tricep_extension_cable': 3.0,
  'overhead_tricep_extension_dumbbell': 3.0,
  'cable_overhead_triceps_extension': 3.0,
  'dumbbell_overhead_triceps_extension': 3.0,
  'single_hand_overhead_tricep_extension': 3.0,
  'single_hand_overhead_cable_tricep_extension': 3.0,
  'single_hand_rope_pushdowns': 3.0,
  'single_hand_tricep_pushdowns': 3.0,
  'skull_crushers': 3.0,
  'tricep_dips': 3.5,
  'tricep_dips_chair': 3.5,
  'bench_dips': 3.5,
  'weighted_dips': 5.0,

  // ── Legs & glutes ──
  'leg_press': 4.5,
  'leg_press_narrow_foot': 4.5,
  'leg_press_calf_raise': 3.0,
  'leg_extension': 4.0,
  'leg_curls': 3.5,
  'seated_leg_curls': 3.5,
  'lying_leg_curls': 3.5,
  'nordic_hamstring_curls': 4.5,
  'leg_abductor_machine': 3.0,
  'leg_adductor_machine': 3.0,
  'cable_hip_abduction': 3.0,
  'cable_hip_adduction': 3.0,
  'calf_raises': 3.0,
  'standing_calf_raises': 3.0,
  'seated_calf_raises': 3.0,
  'donkey_calf_raise': 4.0,
  'smith_machine_calf_raise': 3.0,
  'hip_thrust': 4.0,
  'barbell_hip_thrust': 4.5,
  'machine_hip_thrust': 4.0,
  'cable_hip_thrust': 4.0,
  'cable_pull_through': 4.0,
  'glute_bridges': 3.5,
  'single_leg_glute_bridges': 4.0,
  'single_leg_hip_thrust': 4.0,
  'banded_clamshells': 2.5,
  'side_lying_leg_raise': 2.5,
  'walking_lunges': 4.5,
  'walking_dumbbell_lunge': 4.5,
  'reverse_lunges': 4.0,
  'step_ups': 4.0,

  // ── Core ──
  'plank': 3.5,
  'hollow_body_hold': 3.5,
  'copenhagen_plank': 3.0,
  'mountain_climbers': 6.0,
  'burpees': 8.0,
  'box_jumps': 8.0,
  'high_knees': 7.0,
  'dead_bug': 3.0,
  'hanging_leg_raise': 3.5,
  'v_ups': 4.0,
  'bicycle_crunches': 4.0,
  'ab_wheel_rollout': 4.0,

  // ── Push-ups ──
  'push_ups': 3.5,
  'wide_push_ups': 3.5,
  'close_grip_push_ups': 4.0,
  'diamond_push_ups': 4.0,
  'decline_push_ups': 4.0,
  'incline_push_ups': 3.0,
  'pike_push_ups': 4.5,
  'handstand_push_ups': 5.0,

  // ── Yoga poses (whole-session MET is low, individual poses lower) ──
  'surya_namaskar_sun_salutation': 3.5,
  'adho_mukha_svanasana_downward_dog': 2.5,
  'virabhadrasana_i_ii_warriors': 3.0,
  'bhujangasana_cobra': 2.5,
  'setu_bandhasana_bridge': 3.0,
  'paschimottanasana_forward_bend': 3.0,
  'ardha_matsyendrasana_spinal_twist': 2.5,
  'balasana_child_pose': 2.0,
  'savasana': 2.0,
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

// ──── CARDIO MET VALUES ─────────────────────────────────────────────────────
// Keyed by the cardio type stored on a cardioLog entry.
export const CARDIO_MET = {
  'running': 8.0,
  'cycling': 8.0,
  'spinning': 8.0,
  'swimming': 7.0,
  'hiit': 8.0,
  'rowing': 7.0,
  'walking': 3.5,
  'elliptical': 5.0,
  'stair_climbing': 8.0,
  'jump_rope': 10.0,
  'skipping_rope': 10.0,
  'cricket': 4.0,
  'badminton': 5.5,
  'football': 7.0,
  'basketball': 6.5,
  'tennis': 7.0,
  'other': 5.0,
};

const DEFAULT_MET = 3.5;

/**
 * Resolve the MET value for a single exercise.
 * Lookup chain: EXERCISE_MET[normalised name] → CATEGORY_MET[primaryMuscle] → 3.5
 *
 * @param {string} name - Exercise display name, e.g. 'Bent-Over Barbell Row'
 * @param {string} [primaryMuscle] - e.g. 'back'
 * @returns {number}
 */
export const getExerciseMet = (name, primaryMuscle) =>
  EXERCISE_MET[normalizeExerciseKey(name)]
  ?? CATEGORY_MET[primaryMuscle]
  ?? DEFAULT_MET;

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
    ? log.exercises.reduce((sum, ex) => sum + getExerciseMet(ex.name, ex.primaryMuscle), 0) / log.exercises.length
    : DEFAULT_MET;
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
  const met = CARDIO_MET[normalizeExerciseKey(cardioEntry.type)] ?? 5.0;
  return Math.round(met * userWeightKg * (cardioEntry.minutes / 60));
};
