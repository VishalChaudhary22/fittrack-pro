// ─── Custom exercises ───────────────────────────────────────────────────────
// User-created exercises (Workout → Swap → "Add exercise manually").
// Stored per user: localStorage for instant use + user_profiles
// .custom_exercises (JSONB) for cross-device sync, mirroring swapRegistry.
// A custom exercise is reusable: once created it appears in every swap
// sheet's YOUR EXERCISES section, and its sets/reps history pools by name
// like any other exercise (see utils/exerciseHistory).
import { supabase } from '../lib/supabaseClient';
import { EXERCISE_LIBRARY } from '../data/exerciseLibrary';
import { canonicalExerciseName } from '../data/exerciseAliases';

// Display muscle → body-map primary muscle, mirroring the library's own
// (muscle, primaryMuscle) pairs. Full Body maps to null (no single tile).
export const MUSCLE_TO_PRIMARY = {
  Chest: 'chest', Back: 'back', Shoulders: 'shoulders', 'Rear Delts': 'traps',
  Legs: 'quads', Quads: 'quads', Hamstrings: 'hamstrings', Glutes: 'glutes',
  Calves: 'calves', Abductors: 'glutes', Adductors: 'quads', Biceps: 'biceps',
  Triceps: 'triceps', Arms: 'biceps', Core: 'abs', 'Full Body': null,
};

export const CUSTOM_MUSCLE_OPTIONS = [
  'Chest', 'Back', 'Shoulders', 'Rear Delts', 'Legs', 'Quads', 'Hamstrings',
  'Glutes', 'Calves', 'Abductors', 'Adductors', 'Biceps', 'Triceps', 'Arms',
  'Core', 'Full Body',
];

const key = (userId) => `fittrack_customExercises_${userId}`;

export function customExerciseId(name) {
  return 'custom-' + String(name).toLowerCase().trim().replace(/\s+/g, '-');
}

export function getCustomExercises(userId) {
  if (!userId) return [];
  try {
    const raw = localStorage.getItem(key(userId));
    const list = raw ? JSON.parse(raw) : [];
    return Array.isArray(list) ? list.filter(e => e && e.name && e.muscle) : [];
  } catch {
    return [];
  }
}

function saveLocal(userId, list) {
  try { localStorage.setItem(key(userId), JSON.stringify(list)); } catch { /* private mode */ }
}

async function syncToCloud(userId, list) {
  try {
    await supabase.from('user_profiles').update({ custom_exercises: list }).eq('id', userId);
  } catch {
    /* column may not exist yet / offline — local copy still works */
  }
}

// If the typed name is (an alias of) a library exercise, the caller should
// swap to the library entry instead of creating a duplicate custom.
export function findLibraryExercise(name) {
  const canon = canonicalExerciseName(String(name).trim());
  return EXERCISE_LIBRARY.find(e => canonicalExerciseName(e.name) === canon) || null;
}

// Returns { entry } for a created/found custom, { library } when the name
// belongs to the library, or null for an unusable name.
export function addCustomExercise(userId, name, muscle) {
  const clean = String(name || '').trim().replace(/\s+/g, ' ');
  if (!userId || clean.length < 2) return null;
  const library = findLibraryExercise(clean);
  if (library) return { library };
  const list = getCustomExercises(userId);
  const canon = canonicalExerciseName(clean);
  const existing = list.find(e => canonicalExerciseName(e.name) === canon);
  if (existing) return { entry: existing };
  const entry = {
    name: clean,
    muscle: MUSCLE_TO_PRIMARY[muscle] !== undefined || CUSTOM_MUSCLE_OPTIONS.includes(muscle) ? muscle : 'Full Body',
    primaryMuscle: MUSCLE_TO_PRIMARY[muscle] ?? null,
    exerciseId: customExerciseId(clean),
    custom: true,
    createdAt: new Date().toISOString(),
  };
  const next = [...list, entry];
  saveLocal(userId, next);
  void syncToCloud(userId, next);
  return { entry };
}

export async function loadCustomExercisesFromCloud(userId) {
  if (!userId) return;
  try {
    const { data } = await supabase.from('user_profiles').select('custom_exercises').eq('id', userId).single();
    const cloud = Array.isArray(data?.custom_exercises) ? data.custom_exercises : [];
    if (!cloud.length) return;
    const local = getCustomExercises(userId);
    const seen = new Set(local.map(e => e.exerciseId));
    const merged = [...local, ...cloud.filter(e => e && e.exerciseId && !seen.has(e.exerciseId))];
    saveLocal(userId, merged);
  } catch {
    /* column may not exist yet — local copy remains the source */
  }
}
