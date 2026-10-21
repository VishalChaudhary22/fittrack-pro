import { INIT_SPLITS } from './splits';

// Static list of additional exercises from EXERCISE_ALTERNATIVES that are not in default splits
const ADDITIONAL_EXERCISES = [
  { name: 'Ab Wheel Rollout', muscle: 'Core', primaryMuscle: 'abs', secondaryMuscles: [] },
  { name: 'Arnold Press', muscle: 'Shoulders', primaryMuscle: 'shoulders', secondaryMuscles: ['triceps'] },
  { name: 'Assisted Pull-ups', muscle: 'Back', primaryMuscle: 'back', secondaryMuscles: ['biceps'] },
  { name: 'Band Pull-Apart', muscle: 'Shoulders', primaryMuscle: 'shoulders', secondaryMuscles: [] },
  { name: 'Banded Clamshells', muscle: 'Glutes', primaryMuscle: 'glutes', secondaryMuscles: [] },
  { name: 'Bench Dips', muscle: 'Triceps', primaryMuscle: 'triceps', secondaryMuscles: ['chest'] },
  { name: 'Bicycle Crunches', muscle: 'Core', primaryMuscle: 'abs', secondaryMuscles: [] },
  { name: 'Block Pull', muscle: 'Back', primaryMuscle: 'back', secondaryMuscles: ['hamstrings', 'glutes'] },
  { name: 'Box Jumps', muscle: 'Quads', primaryMuscle: 'quads', secondaryMuscles: ['calves'] },
  { name: 'Cable Curls', muscle: 'Biceps', primaryMuscle: 'biceps', secondaryMuscles: ['forearms'] },
  { name: 'Cable Hip Abduction', muscle: 'Glutes', primaryMuscle: 'glutes', secondaryMuscles: [] },
  { name: 'Cable Hip Adduction', muscle: 'Adductors', primaryMuscle: 'quads', secondaryMuscles: [] },
  { name: 'Cable Pull-Through', muscle: 'Glutes', primaryMuscle: 'glutes', secondaryMuscles: ['hamstrings'] },
  { name: 'Cable Reverse Fly', muscle: 'Rear Delts', primaryMuscle: 'traps', secondaryMuscles: ['shoulders'] },
  { name: 'Close-Grip Bench Press', muscle: 'Triceps', primaryMuscle: 'triceps', secondaryMuscles: ['chest', 'shoulders'] },
  { name: 'Close-Grip Push-ups', muscle: 'Triceps', primaryMuscle: 'triceps', secondaryMuscles: ['chest'] },
  { name: 'Concentration Curls', muscle: 'Biceps', primaryMuscle: 'biceps', secondaryMuscles: [] },
  { name: 'Copenhagen Plank', muscle: 'Adductors', primaryMuscle: 'quads', secondaryMuscles: ['abs'] },
  { name: 'Cross-Body Hammer Curl', muscle: 'Biceps', primaryMuscle: 'biceps', secondaryMuscles: ['forearms'] },
  { name: 'Dead Bug', muscle: 'Core', primaryMuscle: 'abs', secondaryMuscles: [] },
  { name: 'Donkey Calf Raise', muscle: 'Calves', primaryMuscle: 'calves', secondaryMuscles: [] },
  { name: 'Dumbbell Curls', muscle: 'Biceps', primaryMuscle: 'biceps', secondaryMuscles: [] },
  { name: 'Dumbbell Floor Press', muscle: 'Chest', primaryMuscle: 'chest', secondaryMuscles: ['triceps'] },
  { name: 'Dumbbell Fly', muscle: 'Chest', primaryMuscle: 'chest', secondaryMuscles: [] },
  { name: 'Dumbbell Pullover', muscle: 'Chest', primaryMuscle: 'chest', secondaryMuscles: ['back'] },
  { name: 'Dumbbell Row', muscle: 'Back', primaryMuscle: 'back', secondaryMuscles: ['biceps'] },
  { name: 'EZ Bar Curls', muscle: 'Biceps', primaryMuscle: 'biceps', secondaryMuscles: [] },
  { name: 'Face Pulls', muscle: 'Rear Delts', primaryMuscle: 'traps', secondaryMuscles: ['shoulders'] },
  { name: 'Front Squats', muscle: 'Quads', primaryMuscle: 'quads', secondaryMuscles: ['glutes', 'hamstrings'] },
  { name: 'Goblet Squats', muscle: 'Quads', primaryMuscle: 'quads', secondaryMuscles: ['glutes'] },
  { name: 'Good Mornings', muscle: 'Hamstrings', primaryMuscle: 'hamstrings', secondaryMuscles: ['back'] },
  { name: 'Hack Squats', muscle: 'Quads', primaryMuscle: 'quads', secondaryMuscles: ['glutes'] },
  { name: 'Handstand Push-ups', muscle: 'Shoulders', primaryMuscle: 'shoulders', secondaryMuscles: ['triceps'] },
  { name: 'Hanging Leg Raise', muscle: 'Core', primaryMuscle: 'abs', secondaryMuscles: [] },
  { name: 'High Knees', muscle: 'Core', primaryMuscle: 'abs', secondaryMuscles: [] },
  { name: 'Incline Machine Press', muscle: 'Chest', primaryMuscle: 'chest', secondaryMuscles: ['triceps'] },
  { name: 'Incline Push-ups', muscle: 'Chest', primaryMuscle: 'chest', secondaryMuscles: ['triceps'] },
  { name: 'Inverted Rows', muscle: 'Back', primaryMuscle: 'back', secondaryMuscles: ['biceps'] },
  { name: 'Leg Press (narrow foot)', muscle: 'Quads', primaryMuscle: 'quads', secondaryMuscles: [] },
  { name: 'Leg Press Calf Raise', muscle: 'Calves', primaryMuscle: 'calves', secondaryMuscles: [] },
  { name: 'Low-to-High Cable Fly', muscle: 'Chest', primaryMuscle: 'chest', secondaryMuscles: [] },
  { name: 'Machine Chest Press', muscle: 'Chest', primaryMuscle: 'chest', secondaryMuscles: ['triceps'] },
  { name: 'Machine Lateral Raise', muscle: 'Shoulders', primaryMuscle: 'shoulders', secondaryMuscles: [] },
  { name: 'Machine Preacher Curl', muscle: 'Biceps', primaryMuscle: 'biceps', secondaryMuscles: [] },
  { name: 'Neutral Grip Lat Pulldown', muscle: 'Back', primaryMuscle: 'back', secondaryMuscles: ['biceps'] },
  { name: 'Nordic Hamstring Curls', muscle: 'Hamstrings', primaryMuscle: 'hamstrings', secondaryMuscles: [] },
  { name: 'Overhead Tricep Extension (Cable)', muscle: 'Triceps', primaryMuscle: 'triceps', secondaryMuscles: [] },
  { name: 'Overhead Tricep Extension (Dumbbell)', muscle: 'Triceps', primaryMuscle: 'triceps', secondaryMuscles: [] },
  { name: 'Pec Deck Fly', muscle: 'Chest', primaryMuscle: 'chest', secondaryMuscles: [] },
  { name: 'Push Press', muscle: 'Shoulders', primaryMuscle: 'shoulders', secondaryMuscles: ['triceps'] },
  { name: 'Resistance Band Rows', muscle: 'Back', primaryMuscle: 'back', secondaryMuscles: ['biceps'] },
  { name: 'Reverse Curls', muscle: 'Biceps', primaryMuscle: 'biceps', secondaryMuscles: ['forearms'] },
  { name: 'Reverse Lunges', muscle: 'Quads', primaryMuscle: 'quads', secondaryMuscles: ['glutes'] },
  { name: 'Rope Hammer Curls', muscle: 'Biceps', primaryMuscle: 'biceps', secondaryMuscles: ['forearms'] },
  { name: 'Seated Calf Raises', muscle: 'Calves', primaryMuscle: 'calves', secondaryMuscles: [] },
  { name: 'Side-Lying Leg Raise', muscle: 'Glutes', primaryMuscle: 'glutes', secondaryMuscles: [] },
  { name: 'Single-Leg Hip Thrust', muscle: 'Glutes', primaryMuscle: 'glutes', secondaryMuscles: [] },
  { name: 'Sissy Squats', muscle: 'Quads', primaryMuscle: 'quads', secondaryMuscles: [] },
  { name: 'Skull Crushers', muscle: 'Triceps', primaryMuscle: 'triceps', secondaryMuscles: [] },
  { name: 'Smith Machine Calf Raise', muscle: 'Calves', primaryMuscle: 'calves', secondaryMuscles: [] },
  { name: 'Smith Machine Squats', muscle: 'Quads', primaryMuscle: 'quads', secondaryMuscles: ['glutes'] },
  { name: 'Spider Curls', muscle: 'Biceps', primaryMuscle: 'biceps', secondaryMuscles: [] },
  { name: 'Step-Ups', muscle: 'Quads', primaryMuscle: 'quads', secondaryMuscles: ['glutes'] },
  { name: 'Stiff-Leg Deadlift', muscle: 'Hamstrings', primaryMuscle: 'hamstrings', secondaryMuscles: ['back'] },
  { name: 'Straight Bar Pushdowns', muscle: 'Triceps', primaryMuscle: 'triceps', secondaryMuscles: [] },
  { name: 'Straight-Arm Lat Pulldown', muscle: 'Back', primaryMuscle: 'back', secondaryMuscles: [] },
  { name: 'Sumo Deadlift', muscle: 'Back', primaryMuscle: 'back', secondaryMuscles: ['hamstrings', 'glutes'] },
  { name: 'Sumo Squats', muscle: 'Quads', primaryMuscle: 'quads', secondaryMuscles: ['glutes'] },
  { name: 'Svend Press', muscle: 'Chest', primaryMuscle: 'chest', secondaryMuscles: [] },
  { name: 'Thrusters', muscle: 'Quads', primaryMuscle: 'quads', secondaryMuscles: ['shoulders'] },
  { name: 'Trap Bar Deadlift', muscle: 'Back', primaryMuscle: 'back', secondaryMuscles: ['hamstrings', 'glutes'] },
  { name: 'Tricep Dips', muscle: 'Triceps', primaryMuscle: 'triceps', secondaryMuscles: ['chest'] },
  { name: 'Tricep Rope Pushdowns', muscle: 'Triceps', primaryMuscle: 'triceps', secondaryMuscles: [] },
  { name: 'V-Bar Pushdowns', muscle: 'Triceps', primaryMuscle: 'triceps', secondaryMuscles: [] },
  { name: 'V-Ups', muscle: 'Core', primaryMuscle: 'abs', secondaryMuscles: [] },
  { name: 'Wall Sits', muscle: 'Quads', primaryMuscle: 'quads', secondaryMuscles: [] },
  { name: 'Weighted Dips', muscle: 'Chest', primaryMuscle: 'chest', secondaryMuscles: ['triceps'] },
  { name: 'Wide Push-ups', muscle: 'Chest', primaryMuscle: 'chest', secondaryMuscles: [] }
];

// Extract a unique list of all exercises defined in the predefined splits, including their variants and swap alternatives
export const EXERCISE_LIBRARY = (() => {
  const map = new Map();

  // Helper to add an exercise and prevent duplicates (indexed by normalized lowercase name)
  const addExercise = (ex) => {
    if (!ex.name) return;
    const key = ex.name.toLowerCase().trim();
    if (!map.has(key)) {
      // Store a clean copy of the exercise for the builder. Fields the builder
      // does not use (ids, swap bookkeeping, variants) are deliberately dropped.
      map.set(key, {
        exerciseId: ex.exerciseId || key.replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        name: ex.name.trim(),
        sets: ex.sets || 3,
        repsRange: ex.repsRange || '10-12',
        muscle: ex.muscle || 'Full Body',
        primaryMuscle: ex.primaryMuscle || null,
        secondaryMuscles: ex.secondaryMuscles || [],
        notes: ex.notes || ''
      });
    }
  };

  // 1. Process all default split exercises
  INIT_SPLITS.forEach(split => {
    split.days.forEach(day => {
      (day.exercises || []).forEach(ex => {
        addExercise(ex);

        // Process any variants defined inline in the split
        if (ex.variants && Array.isArray(ex.variants)) {
          ex.variants.forEach(variantName => {
            addExercise({
              exerciseId: variantName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
              name: variantName,
              sets: ex.sets,
              repsRange: ex.repsRange,
              muscle: ex.muscle,
              primaryMuscle: ex.primaryMuscle,
              secondaryMuscles: ex.secondaryMuscles,
              notes: ex.notes
            });
          });
        }
      });
    });
  });

  // 2. Process all additional exercises defined statically
  ADDITIONAL_EXERCISES.forEach(ex => {
    addExercise(ex);
  });

  return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
})();

// Helper to get all unique muscles
export const ALL_MUSCLES = Array.from(new Set(EXERCISE_LIBRARY.map(ex => ex.muscle))).sort();
