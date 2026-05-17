import { INIT_SPLITS } from './splits';

// Extract a unique list of all exercises defined in the predefined splits
export const EXERCISE_LIBRARY = (() => {
  const map = new Map();
  
  INIT_SPLITS.forEach(split => {
    split.days.forEach(day => {
      day.exercises.forEach(ex => {
        if (!ex.exerciseId) return;
        if (!map.has(ex.exerciseId)) {
          // Store a clean copy of the exercise for the builder
          const { id, _swapHistory, isSwapped, originalId, originalName, ...cleanEx } = ex;
          map.set(ex.exerciseId, cleanEx);
        }
      });
    });
  });
  
  return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
})();

// Helper to get all unique muscles
export const ALL_MUSCLES = Array.from(new Set(EXERCISE_LIBRARY.map(ex => ex.muscle))).sort();
