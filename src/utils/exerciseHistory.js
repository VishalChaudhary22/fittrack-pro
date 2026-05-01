/**
 * exerciseHistory.js
 * Shared utilities for historical exercise data lookup.
 * Imported by WorkoutPage for swap pre-fill (F2) and PR badge (F3).
 */

const norm = (s) => s?.trim().toLowerCase() ?? '';

/**
 * Returns weight + reps of the most recent completed set for an exercise.
 * Searches workoutLogs newest-first. Returns the last set of the first
 * matching log found (preserves that session's rep cadence).
 */
export function getLastLiftedForExercise(workoutLogs, exerciseName) {
  if (!workoutLogs?.length || !exerciseName) return null;
  const target = norm(exerciseName);
  const sorted = [...workoutLogs].sort((a, b) => new Date(b.date) - new Date(a.date));

  for (const log of sorted) {
    for (const ex of log.exercises ?? []) {
      if (norm(ex.name) !== target) continue;
      const sets = ex.sets ?? [];
      if (!sets.length) continue;
      const last = sets[sets.length - 1];
      return { weight: last.weight ?? 0, reps: last.reps ?? 0, date: log.date };
    }
  }
  return null;
}

/**
 * Returns ALL sets from the most recent session for an exercise.
 * Used by swap pre-fill to map set-1→set-1, set-2→set-2, etc.
 * Returns { sets: [{weight, reps}, ...], date } or null.
 */
export function getLastSessionSets(workoutLogs, exerciseName) {
  if (!workoutLogs?.length || !exerciseName) return null;
  const target = norm(exerciseName);
  const sorted = [...workoutLogs].sort((a, b) => new Date(b.date) - new Date(a.date));

  for (const log of sorted) {
    for (const ex of log.exercises ?? []) {
      if (norm(ex.name) !== target) continue;
      const sets = ex.sets ?? [];
      if (!sets.length) continue;
      return { sets: sets.map(s => ({ weight: s.weight ?? 0, reps: s.reps ?? 0 })), date: log.date };
    }
  }
  return null;
}

/**
 * Returns the all-time PR for an exercise.
 * WEIGHTED (weight > 0): PR = heaviest weight. Tiebreak: most reps at that weight.
 * BODYWEIGHT (weight === 0): PR = most reps ever.
 */
export function getAllTimePR(workoutLogs, exerciseName) {
  if (!workoutLogs?.length || !exerciseName) return null;
  const target = norm(exerciseName);
  let pr = null;

  for (const log of workoutLogs) {
    for (const ex of log.exercises ?? []) {
      if (norm(ex.name) !== target) continue;
      for (const set of ex.sets ?? []) {
        // Saved logs don't have a `done` flag (stripped during save)
        const w = set.weight ?? 0;
        const r = set.reps ?? 0;
        if (r <= 0) continue;

        if (!pr) { pr = { weight: w, reps: r, isBodyweight: w === 0 }; continue; }

        if (w === 0) {
          if (r > pr.reps) pr = { weight: 0, reps: r, isBodyweight: true };
        } else {
          if (w > pr.weight || (w === pr.weight && r > pr.reps)) {
            pr = { weight: w, reps: r, isBodyweight: false };
          }
        }
      }
    }
  }
  return pr;
}

/**
 * Returns true if the given set STRICTLY beats the all-time PR.
 * Tied = false (design rule confirmed).
 * Bodyweight: beats if reps > pr.reps (weight ignored).
 * No prior PR: any valid set beats it — first ever IS a PR.
 */
export function beatsAllTimePR(pr, weight, reps) {
  if (!reps || reps <= 0) return false;
  if (!pr) return true;

  if (weight === 0) return reps > pr.reps;

  if (weight > pr.weight) return true;
  if (weight === pr.weight && reps > pr.reps) return true;
  return false;
}
