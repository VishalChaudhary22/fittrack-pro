import { supabase } from '../lib/supabaseClient';

/**
 * Phase Auth-1: Migration utilities to transition local fitness data from the old
 * random ID system to the new Supabase UUID system.
 */
export const getOldUserIdIfEmailMatches = (currentEmail) => {
  if (!currentEmail) return { shouldMigrate: false, oldUid: null };

  const raw = localStorage.getItem('fittrack_users');
  if (!raw) return { shouldMigrate: false, oldUid: null };

  try {
    const users = JSON.parse(raw);
    const oldUser = users?.[0];
    if (!oldUser?.id) return { shouldMigrate: false, oldUid: null };

    if (oldUser.email?.toLowerCase() === currentEmail.toLowerCase()) {
      return { shouldMigrate: true, oldUid: oldUser.id };
    }

    return { shouldMigrate: false, oldUid: null };
  } catch {
    return { shouldMigrate: false, oldUid: null };
  }
};

export const migrateLocalData = (newUid, oldUid) => {
  if (!oldUid || !newUid || newUid === oldUid) return;

  const dataKeys = [
    'fittrack_healthLogs', 'fittrack_workoutLogs', 'fittrack_readinessLog',
    'fittrack_measurements', 'fittrack_caloriesLog', 'fittrack_foodLog',
    'fittrack_waterLog', 'fittrack_cardioLog', 'fittrack_supplementLog',
  ];

  for (const key of dataKeys) {
    try {
      const stored = localStorage.getItem(key);
      if (!stored) continue;
      
      const arr = JSON.parse(stored);
      if (Array.isArray(arr)) {
        let changed = false;
        const rekeyed = arr.map(item => {
          if (item.userId === oldUid) {
            changed = true;
            return { ...item, userId: newUid };
          }
          return item;
        });

        if (changed) {
          localStorage.setItem(key, JSON.stringify(rekeyed));
          console.log(`[Migration] Re-keyed data in ${key}`);
        }
      }
    } catch (err) {
      console.warn(`[Migration] Failed to migrate ${key}:`, err);
    }
  }
  
  try {
    const splits = localStorage.getItem('fittrack_splits');
    if (splits) {
      const arr = JSON.parse(splits);
      if (Array.isArray(arr)) {
        let changed = false;
        const rekeyed = arr.map(split => {
          if (split.userId === oldUid) {
            changed = true;
            return { ...split, userId: newUid };
          }
          return split;
        });
        if (changed) localStorage.setItem('fittrack_splits', JSON.stringify(rekeyed));
      }
    }
  } catch {}
};

export const cleanupOldAuthStorage = () => {
  localStorage.removeItem('fittrack_users');
  localStorage.removeItem('fittrack_uid');
};

/**
 * Phase Auth-2: Full Cloud Sync Upload
 * Takes re-keyed localStorage data and uploads it to Supabase tables.
 */
export const uploadLocalDataToCloud = async (userId) => {
  console.log('[Auth-2 Migration] Uploading local data to cloud...');
  let uploadedAny = false;

  const safeParse = (key) => {
    try { 
      const parsed = JSON.parse(localStorage.getItem(key));
      if (!Array.isArray(parsed)) return [];
      // Only upload data matching the current user id
      return parsed.filter(i => i.userId === userId);
    } catch { return []; }
  };

  // 1. Workout Logs
  const wl = safeParse('fittrack_workoutLogs');
  if (wl.length) {
    const mapped = wl.map(l => ({
      id: l.id, user_id: userId, split_id: l.splitId, day_id: l.dayId,
      day_name: l.dayName, date: l.date, notes: l.notes,
      duration_minutes: l.durationMinutes, exercises: l.exercises || []
    }));
    await supabase.from('workout_logs').upsert(mapped, { onConflict: 'id' });
    localStorage.removeItem('fittrack_workoutLogs');
    uploadedAny = true;
  }

  // 2. Health Logs
  const hl = safeParse('fittrack_healthLogs');
  if (hl.length) {
    const mapped = hl.map(l => ({
      id: l.id, user_id: userId, date: l.date, weight: l.weight, notes: l.notes
    }));
    await supabase.from('health_logs').upsert(mapped, { onConflict: 'id' });
    localStorage.removeItem('fittrack_healthLogs');
    uploadedAny = true;
  }

  // 3. Food Logs
  const fl = safeParse('fittrack_foodLog');
  if (fl.length) {
    const mapped = fl.map(l => ({
      id: l.id, user_id: userId, date: l.date, meal_type: l.mealType,
      food_id: l.foodId, food_name: l.foodName, serving_id: l.servingId,
      serving_label: l.servingLabel, grams: l.grams, quantity: l.quantity,
      calories: l.calories, protein: l.protein, carbs: l.carbs, fat: l.fat, fiber: l.fiber
    }));
    await supabase.from('food_logs').upsert(mapped, { onConflict: 'id' });
    localStorage.removeItem('fittrack_foodLog');
    uploadedAny = true;
  }

  // 4. Measurements
  const ml = safeParse('fittrack_measurements');
  if (ml.length) {
    const mapped = ml.map(l => ({
      id: l.id, user_id: userId, date: l.date, chest: l.chest, waist: l.waist,
      hips: l.hips, bicep: l.bicep, thigh: l.thigh, neck: l.neck
    }));
    await supabase.from('measurements').upsert(mapped, { onConflict: 'id' });
    localStorage.removeItem('fittrack_measurements');
    uploadedAny = true;
  }

  // 5. Readiness Logs
  const rl = safeParse('fittrack_readinessLog');
  if (rl.length) {
    const mapped = rl.map(l => ({
      id: l.id, user_id: userId, date: l.date, sleep_hours: l.sleepHours,
      energy_level: l.energyLevel, soreness_level: l.sorenessLevel,
      stress_level: l.stressLevel, score: l.score, objective_score: l.objectiveScore,
      check_in_complete: l.checkInComplete
    }));
    await supabase.from('readiness_logs').upsert(mapped, { onConflict: 'id' });
    localStorage.removeItem('fittrack_readinessLog');
    uploadedAny = true;
  }

  // 6. User Splits
  const splits = safeParse('fittrack_splits');
  if (splits.length) {
    const mapped = splits.map(s => ({
      id: s.id, user_id: userId, data: s
    }));
    await supabase.from('user_splits').upsert(mapped, { onConflict: 'id' });
    localStorage.removeItem('fittrack_splits');
    uploadedAny = true;
  }

  return uploadedAny;
};
