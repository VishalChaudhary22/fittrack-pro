// ─── Exercise name aliases ──────────────────────────────────────────────────
// The exercise data grew organically and several movements ended up with
// two (or three) names: word-order twins ("Machine Chest Press" vs
// "Chest Machine Press"), descriptor duplicates ("Flat Barbell Bench
// Press" vs "Barbell Bench Press") and outright synonyms ("Seated
// Horizontal Row" vs "Seated Cable Row"). Because the swap modal unions
// every same-muscle library entry plus their alternatives, those twins
// all surfaced side by side as if they were different exercises.
//
// This map resolves every known alias to ONE canonical name. It is
// applied when the exercise library is built and when swap lists are
// assembled, so pickers and swap modals only ever show canonical names.
// Split templates and saved user data keep their authored names — the
// alias resolves them at read time, nothing stored is rewritten.
export const EXERCISE_ALIASES = {
  'Machine Chest Press': 'Chest Machine Press',
  'Smith Machine Incline Press': 'Incline Smith Machine Press',
  'Flat Barbell Bench Press': 'Barbell Bench Press',
  'Bench Press': 'Barbell Bench Press',
  'Seated Horizontal Row': 'Seated Cable Row',
  'Seated Cable Row (Bar)': 'Seated Cable Row',
  'Bent-Over Barbell Row': 'Barbell Row',
  'One-Arm Dumbbell Row': 'Dumbbell Row',
  'Conventional Deadlift': 'Deadlift',
  'Back Squat': 'Barbell Back Squat',
  'Cable Overhead Triceps Extension': 'Overhead Triceps Extension (Cable)',
  'Overhead Tricep Extension (Cable)': 'Overhead Triceps Extension (Cable)',
  'Dumbbell Overhead Triceps Extension': 'Overhead Triceps Extension (Dumbbell)',
  'Overhead Tricep Extension (Dumbbell)': 'Overhead Triceps Extension (Dumbbell)',
  'Overhead Tricep Extension': 'Overhead Triceps Extension',
  'Single Hand Overhead Tricep Extension': 'Single Hand Overhead Triceps Extension',
  'Single Hand Overhead Cable Tricep Extension': 'Single Hand Overhead Cable Triceps Extension',
  'Cable Curls': 'Biceps Cable Curls',
  'Cable Triceps Pushdown': 'Tricep Pushdowns',
  'Walking Dumbbell Lunge': 'Walking Lunges',
};

export function canonicalExerciseName(name) {
  if (!name) return name;
  return EXERCISE_ALIASES[String(name).trim()] || name;
}
