/**
 * exerciseHistory.js
 * Shared utilities for historical exercise data lookup.
 * Imported by WorkoutPage for swap pre-fill (F2) and PR badge (F3).
 *
 * History identity is the MOVEMENT, not the exact name a day template
 * happened to use. Saved logs store only the performed name string, and
 * the same movement appears in logs under twin names (see
 * data/exerciseAliases.js), under different variant selections on
 * different days, and under a replacement name when it was swapped in.
 * Every lookup here therefore matches by CANONICAL name and accepts a
 * POOL of equivalent names (single string or array): a log entry matches
 * when its canonical name is in the pool's canonical set. Day and split
 * are never part of the match — the most recent performance anywhere
 * wins.
 */

import { canonicalExerciseName } from '../data/exerciseAliases';

const norm = (s) => s?.trim().toLowerCase() ?? '';
const canonKey = (s) => norm(canonicalExerciseName(s));

function poolSet(exerciseNames) {
  const list = Array.isArray(exerciseNames) ? exerciseNames : [exerciseNames];
  const set = new Set();
  for (const n of list) {
    if (n) set.add(canonKey(n));
  }
  return set;
}

const matchesPool = (pool, loggedName) => pool.has(canonKey(loggedName));

/**
 * The full set of names that share one history for a session exercise:
 * the selected variant/current name, every variant the slot offers
 * (today's list and, for a swapped exercise, the original's list), and
 * the original exercise's name when this exercise was swapped in.
 */
export function exerciseNamePool(ex) {
  if (!ex) return [];
  const names = [
    ex.sv || ex.name,
    ...(ex.variants || []),
    ...(ex._originalVariants || []),
    ex._originalName,
    ex.originalName,
  ];
  return [...new Set(names.filter(Boolean))];
}

/**
 * Returns weight + reps of the most recent completed set for an exercise.
 * Searches workoutLogs newest-first. Returns the last set of the first
 * matching log found (preserves that session's rep cadence).
 */
export function getLastLiftedForExercise(workoutLogs, exerciseNames) {
  if (!workoutLogs?.length || !exerciseNames) return null;
  const pool = poolSet(exerciseNames);
  if (!pool.size) return null;
  const sorted = [...workoutLogs].sort((a, b) => new Date(b.date) - new Date(a.date));

  for (const log of sorted) {
    for (const ex of log.exercises ?? []) {
      if (!matchesPool(pool, ex.name)) continue;
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
export function getLastSessionSets(workoutLogs, exerciseNames) {
  if (!workoutLogs?.length || !exerciseNames) return null;
  const pool = poolSet(exerciseNames);
  if (!pool.size) return null;
  const sorted = [...workoutLogs].sort((a, b) => new Date(b.date) - new Date(a.date));

  for (const log of sorted) {
    for (const ex of log.exercises ?? []) {
      if (!matchesPool(pool, ex.name)) continue;
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
export function getAllTimePR(workoutLogs, exerciseNames) {
  if (!workoutLogs?.length || !exerciseNames) return null;
  const pool = poolSet(exerciseNames);
  if (!pool.size) return null;
  let pr = null;

  for (const log of workoutLogs) {
    for (const ex of log.exercises ?? []) {
      if (!matchesPool(pool, ex.name)) continue;
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
