import { createContext, useContext, useCallback, useEffect, useState, useRef } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useTheme } from '../hooks/useTheme';
import { useToast } from '../hooks/useToast';
import { genSample } from '../data/sample';
import { INIT_SPLITS } from '../data/splits';

// Supabase & Migration imports
import { supabase } from '../lib/supabaseClient';
import { getOldUserIdIfEmailMatches, migrateLocalData, cleanupOldAuthStorage, uploadLocalDataToCloud } from '../utils/authMigration';

const AppContext = createContext(null);
const SAMPLE = genSample();

const readPersistedUserArray = (prefix, userId) => {
  if (!userId) return [];
  try {
    const raw = localStorage.getItem(`${prefix}_${userId}`);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const normalizeNumber = (value) => {
  if (value === '' || value === null || value === undefined) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const READINESS_SORENESS_TO_DB = {
  none: 0,
  mild: 1,
  significant: 2,
};

const READINESS_SORENESS_FROM_DB = {
  0: 'none',
  1: 'mild',
  2: 'significant',
};

const READINESS_STRESS_TO_DB = {
  low: 0,
  medium: 1,
  high: 2,
};

const READINESS_STRESS_FROM_DB = {
  0: 'low',
  1: 'medium',
  2: 'high',
};

const mapFoodLogFromCloud = (item, cachedItem = null) => {
  const quantity = normalizeNumber(item.quantity);
  const grams = normalizeNumber(item.grams);
  const calories = normalizeNumber(item.calories);
  const protein = normalizeNumber(item.protein);
  const carbs = normalizeNumber(item.carbs);
  const fat = normalizeNumber(item.fat);
  const fiber = normalizeNumber(item.fiber);

  return {
    ...cachedItem,
    ...item,
    userId: item.user_id,
    mealType: item.meal_type || cachedItem?.mealType || 'Breakfast',
    slot: item.meal_type || cachedItem?.slot || 'Breakfast',
    foodId: item.food_id,
    foodName: item.food_name,
    name: item.food_name || cachedItem?.name || 'Food',
    servingId: item.serving_id || cachedItem?.servingId || '',
    servingLabel: item.serving_label || cachedItem?.servingLabel || '',
    qty: quantity ?? cachedItem?.qty ?? 1,
    quantity: quantity ?? cachedItem?.quantity ?? cachedItem?.qty ?? 1,
    customGrams: grams ?? cachedItem?.customGrams ?? '',
    grams: grams ?? cachedItem?.grams ?? null,
    sourceType: item.source_type || cachedItem?.sourceType || 'database',
    macros: {
      calories: calories ?? cachedItem?.macros?.calories ?? 0,
      protein: protein ?? cachedItem?.macros?.protein ?? 0,
      carbs: carbs ?? cachedItem?.macros?.carbs ?? 0,
      fat: fat ?? cachedItem?.macros?.fat ?? 0,
      fiber: fiber ?? cachedItem?.macros?.fiber ?? 0,
      iron: cachedItem?.macros?.iron ?? 0,
      vitaminB12: cachedItem?.macros?.vitaminB12 ?? 0,
      vitaminD: cachedItem?.macros?.vitaminD ?? 0,
    },
  };
};

const mapReadinessFromCloud = (item, cachedItem = null) => {
  const sorenessLevel = normalizeNumber(item.soreness_level);
  const stressLevel = normalizeNumber(item.stress_level);
  const score = normalizeNumber(item.score);
  const objectiveScore = normalizeNumber(item.objective_score);

  return {
    ...cachedItem,
    ...item,
    userId: item.user_id,
    sleepHours: normalizeNumber(item.sleep_hours) ?? cachedItem?.sleepHours ?? null,
    energyLevel: normalizeNumber(item.energy_level) ?? cachedItem?.energyLevel ?? null,
    sorenessLevel: READINESS_SORENESS_FROM_DB[sorenessLevel] ?? cachedItem?.sorenessLevel ?? null,
    stressLevel: READINESS_STRESS_FROM_DB[stressLevel] ?? cachedItem?.stressLevel ?? null,
    score: score ?? cachedItem?.score ?? null,
    objectiveScore: objectiveScore ?? cachedItem?.objectiveScore ?? null,
    checkInComplete: item.check_in_complete ?? cachedItem?.checkInComplete ?? false,
  };
};

export function AppProvider({ children }) {
  // --- Supabase Auth State ---
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [dataLoaded, setDataLoaded] = useState(false);

  // --- Cloud Sync State (Phase Auth-2) ---
  const [splits, setSplits] = useState([]);
  const [healthLogs, setHealthLogs] = useState([]);
  const [workoutLogs, setWorkoutLogs] = useState([]);
  const [readinessLog, setReadinessLogState] = useState(() => {
    const cachedUserId = localStorage.getItem('fittrack_last_user_id');
    if (!cachedUserId) return [];
    try { return JSON.parse(localStorage.getItem(`fittrack_readinessLog_${cachedUserId}`) || '[]'); }
    catch { return []; }
  });
  const [measurements, setMeasurements] = useState([]);
  const [foodLog, setFoodLogState] = useState(() => {
    const cachedUserId = localStorage.getItem('fittrack_last_user_id');
    if (!cachedUserId) return [];
    try { return JSON.parse(localStorage.getItem(`fittrack_foodLog_${cachedUserId}`) || '[]'); }
    catch { return []; }
  });

  const setReadinessLog = useCallback((updater) => {
    setReadinessLogState(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      const cachedUserId = localStorage.getItem('fittrack_last_user_id');
      if (cachedUserId) {
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - 90);
        const cutoffStr = cutoff.toISOString().split('T')[0];
        const pruned = next.filter(e => e.date >= cutoffStr);
        localStorage.setItem(`fittrack_readinessLog_${cachedUserId}`, JSON.stringify(pruned));
      }
      return next;
    });
  }, []);

  const setFoodLog = useCallback((updater) => {
    setFoodLogState(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      const cachedUserId = localStorage.getItem('fittrack_last_user_id');
      if (cachedUserId) {
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - 90);
        const cutoffStr = cutoff.toISOString().split('T')[0];
        const pruned = next.filter(e => e.date >= cutoffStr);
        localStorage.setItem(`fittrack_foodLog_${cachedUserId}`, JSON.stringify(pruned));
      }
      return next;
    });
  }, []);

  // --- Phase 3 / Non-Migrated Local State ---
  const [favoriteIds, setFavoriteIds] = useLocalStorage('fittrack_favoriteFoods', []);
  const [monthlyRankHistory, setMonthlyRankHistory] = useLocalStorage('fittrack_monthlyRankHistory', [
    { id: '2026-02', label: 'Feb 2026', xp: 175000 },
    { id: '2026-01', label: 'Jan 2026', xp: 130000 },
    { id: '2025-12', label: 'Dec 2025', xp: 98000 },
  ]);
  const [caloriesLog, setCaloriesLog] = useLocalStorage('fittrack_caloriesLog', []);
  const [waterLog, setWaterLog] = useLocalStorage('fittrack_waterLog', []);
  const [cardioLog, setCardioLog] = useLocalStorage('fittrack_cardioLog', []);
  const [supplementLog, setSupplementLog] = useLocalStorage('fittrack_supplementLog', []);
  const [supplementConfig, setSupplementConfig] = useLocalStorage('fittrack_supplementConfig', []);
  const [cycleConfig, setCycleConfig] = useLocalStorage('fp_cycle_config', { startDate: '', cycleLength: 28 });

  const { theme, toggleTheme, initTheme } = useTheme();
  const { toasts, addToast, removeToast } = useToast();

  useEffect(() => { initTheme(); }, [initTheme]);

  const isFetchingProfile = useRef(false);
  const prevUserIdRef = useRef(null);

  useEffect(() => {
    if (!session?.user?.id) {
      prevUserIdRef.current = null;
      return;
    }
  
    if (prevUserIdRef.current && prevUserIdRef.current !== session.user.id) {
      // A different user has logged in on this device in this session.
      console.log('[Auth] Account switched — resetting all local state');
      
      setWorkoutLogs([]);
      setHealthLogs([]);
      setMeasurements([]);
      setFoodLog([]);
      setCaloriesLog([]);
      setReadinessLog([]);
      setWaterLog([]);
      setCardioLog([]);
      setSupplementLog([]);
      setSupplementConfig([]);
      
      localStorage.removeItem(`fittrack_foodLog_${prevUserIdRef.current}`);
      localStorage.removeItem(`fittrack_readinessLog_${prevUserIdRef.current}`);
    }
  
    prevUserIdRef.current = session.user.id;
  }, [session?.user?.id]);

  // --- Supabase Auth Listener ---
  useEffect(() => {
    let initialized = false;

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log('[Auth] onAuthStateChange:', _event, session ? `user=${session.user.id}` : 'no session');
      initialized = true; // Mark IMMEDIATELY so the 3s timeout doesn't prematurely show login
      setSession(session);
      if (session?.user) {
        localStorage.setItem('fittrack_last_user_id', session.user.id);
        await fetchProfile(session.user.id);
      } else {
        localStorage.removeItem('fittrack_last_user_id');
        // Clear cloud state
        setProfile(null);
        setSplits(INIT_SPLITS);
        setHealthLogs([]);
        setWorkoutLogs([]);
        setReadinessLog([]);
        setMeasurements([]);
        setFoodLog([]);
        // Clear local-only prefs (Fix 6)
        setFavoriteIds([]);
        setSupplementConfig([]);
        setCycleConfig({ startDate: '', cycleLength: 28 });
        
        setDataLoaded(false);
        setAuthLoading(false);
      }
    });

    const timeout = setTimeout(() => {
      if (!initialized) setAuthLoading(false);
    }, 3000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, []);

  const fetchProfile = async (userId) => {
    if (isFetchingProfile.current) return;
    isFetchingProfile.current = true;

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code === 'PGRST116') {
        const { data: { user: authUser } } = await supabase.auth.getUser();
        const meta = authUser?.user_metadata || {};
        const newProfile = {
          id: userId,
          name: meta.full_name || meta.name || authUser?.email?.split('@')[0] || 'User',
          gender: meta.gender || 'male',
          avatar: (meta.full_name || meta.name || 'U').slice(0, 2).toUpperCase(),
        };
        const { data: created, error: upsertError } = await supabase
          .from('user_profiles')
          .upsert(newProfile, { onConflict: 'id' })
          .select()
          .single();
        
        if (upsertError) {
          console.error('[Auth] Profile upsert failed:', upsertError.message);
          const { data: retryData } = await supabase
            .from('user_profiles').select('*').eq('id', userId).single();
          setProfile(retryData);
        } else {
          setProfile(created);
          localStorage.setItem(`fittrack_onboarding_pending:${userId}`, 'true');
          localStorage.setItem('fittrack_user_created_at', new Date().toISOString());
        }
      } else if (error) {
        console.error('[Auth] Profile fetch error:', error.message);
        setProfile(null);
      } else {
        setProfile(data);
      }

      setSession(await supabase.auth.getSession().then(r => r.data.session));

      // Run data migration — email-gated
      const { data: { user: authUser } } = await supabase.auth.getUser();
      const { shouldMigrate, oldUid } = getOldUserIdIfEmailMatches(authUser?.email);
      if (shouldMigrate && oldUid) {
        migrateLocalData(userId, oldUid);
        addToast('Your existing data has been linked to your account!', 'success');
      }

      // Check for local data upload
      await uploadLocalDataToCloud(userId);

      // Load cloud data!
      await loadCloudData(userId);
    } finally {
      cleanupOldAuthStorage();
      isFetchingProfile.current = false;
      setAuthLoading(false);
    }
  };

  const loadCloudData = async (userId) => {
    const [
      { data: wl }, { data: hl }, { data: fl }, { data: ml }, { data: rl }, { data: sl }
    ] = await Promise.all([
      supabase.from('workout_logs').select('*').eq('user_id', userId),
      supabase.from('health_logs').select('*').eq('user_id', userId),
      supabase.from('food_logs').select('*').eq('user_id', userId),
      supabase.from('measurements').select('*').eq('user_id', userId),
      supabase.from('readiness_logs').select('*').eq('user_id', userId),
      supabase.from('user_splits').select('*').eq('user_id', userId),
    ]);

    const persistedFoodLog = readPersistedUserArray('fittrack_foodLog', userId);
    const persistedReadinessLog = readPersistedUserArray('fittrack_readinessLog', userId);
    const cachedFoodSource = foodLog.length > 0 ? foodLog : persistedFoodLog;
    const cachedReadinessSource = readinessLog.length > 0 ? readinessLog : persistedReadinessLog;

    setWorkoutLogs(wl?.map(i => ({ ...i, userId: i.user_id, splitId: i.split_id, dayId: i.day_id, dayName: i.day_name, durationMinutes: i.duration_minutes })) || []);
    setHealthLogs(hl?.map(i => ({ ...i, userId: i.user_id })) || []);
    const mappedFoodLog = fl?.length ? fl.map(item => {
      const cachedItem = cachedFoodSource.find(entry => entry.id === item.id);
      return mapFoodLogFromCloud(item, cachedItem);
    }) : cachedFoodSource;
    if (mappedFoodLog.length > 0 || foodLog.length === 0) {
      setFoodLog(mappedFoodLog);
    }
    setMeasurements(ml?.map(i => ({ ...i, userId: i.user_id })) || []);
    const mappedReadinessLog = rl?.length ? rl.map(item => {
      const cachedItem = cachedReadinessSource.find(entry => entry.id === item.id || (entry.userId === userId && entry.date === item.date));
      return mapReadinessFromCloud(item, cachedItem);
    }) : cachedReadinessSource;
    if (mappedReadinessLog.length > 0 || readinessLog.length === 0) {
      setReadinessLog(mappedReadinessLog);
    }
    
    // Spltis fallback to INIT_SPLITS if none exist
    setSplits(sl?.length > 0 ? sl.map(i => i.data) : INIT_SPLITS);
    setDataLoaded(true);
  };

  // --- Real-Time Sync (Optional fallback listener if we wanted cross-device immediate, but here we will just mutate explicitly to keep it simple) ---

  const updateProfile = async (updates) => {
    if (!profile) return;
    const keyMap = {
      name: 'name', gender: 'gender', age: 'age', height: 'height', weight: 'weight',
      weightGoal: 'weight_goal', weightGoalStart: 'weight_goal_start',
      goalWeeks: 'goal_weeks', goalSetDate: 'goal_set_date',
      activity: 'activity', activityLevel: 'activity', workoutDays: 'workout_days',
      dietType: 'diet_type', units: 'units', unitWeight: 'unit_weight', unitHeight: 'unit_height',
      avatar: 'avatar', avatarType: 'avatar_type', avatarUrl: 'avatar_url',
      activeSplitId: 'active_split_id', isAdmin: 'is_admin',
    };
    const snakeUpdates = {};
    for (const [camel, snake] of Object.entries(keyMap)) {
      if (updates[camel] !== undefined) snakeUpdates[snake] = updates[camel];
    }
    const { data, error } = await supabase.from('user_profiles')
      .update(snakeUpdates)
      .eq('id', profile.id)
      .select()
      .single();
    if (!error) setProfile(data);
    return { error };
  };

  const logout = async () => {
    // Immediately clear state so UI shows login page without waiting for onAuthStateChange
    setProfile(null);
    setSession(null);
    setDataLoaded(false);
    await supabase.auth.signOut();
  };

  const setActiveSplitId = useCallback(async (id) => {
    await updateProfile({ activeSplitId: id });
  }, [profile]);

  const user = profile ? {
    id: session?.user?.id, email: session?.user?.email, name: profile.name, gender: profile.gender, age: profile.age,
    height: profile.height, weight: profile.weight, weightGoal: profile.weight_goal, weightGoalStart: profile.weight_goal_start,
    goalWeeks: profile.goal_weeks, goalSetDate: profile.goal_set_date, activity: profile.activity, activityLevel: profile.activity, workoutDays: profile.workout_days,
    dietType: profile.diet_type, units: profile.units, unitWeight: profile.unit_weight || 'kg', unitHeight: profile.unit_height || 'cm',
    avatar: profile.avatar, avatarType: profile.avatar_type, avatarUrl: profile.avatar_url, activeSplitId: profile.active_split_id,
    isAdmin: profile.is_admin || false, purchasedPrograms: profile.purchased_programs || [], joinDate: profile.created_at?.split('T')[0],
  } : null;

  // --- Mutator Wrappers for Cloud Sync ---
  // To avoid rewriting all 21 setters in the app, we provide a smart wrapper that updates local AND cloud state.
  
  const createSyncSetter = (table, localState, setLocalState, mapperToCloud) => async (updater) => {
    setLocalState(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      
      // Compute delta and sync asynchronously to avoid blocking the React render
      setTimeout(async () => {
        const currentUserId = profile?.id;
        if (!currentUserId) return;
        
        const toUpsert = next.filter(n => !prev.some(p => p.id === n.id) || JSON.stringify(prev.find(p => p.id === n.id)) !== JSON.stringify(n));
        const toDeleteIds = prev.filter(p => !next.some(n => n.id === p.id)).map(p => p.id);

        if (toUpsert.length > 0) {
          const mapped = toUpsert.map(i => {
            const mappedItem = mapperToCloud(i);
            // Normalize values Supabase numeric columns reject, like undefined, empty string, and NaN.
            const cleanMappedItem = Object.fromEntries(
              Object.entries(mappedItem).map(([k, v]) => [
                k,
                v === undefined || v === '' || (typeof v === 'number' && Number.isNaN(v)) ? null : v,
              ])
            );
            return { ...cleanMappedItem, user_id: currentUserId };
          });
          const { error } = await supabase.from(table).upsert(mapped, { onConflict: 'id' });
          if (error) console.error(`[CloudSync] Upsert failed for ${table}:`, error.message, mapped);
        }
        if (toDeleteIds.length > 0) {
          const { error } = await supabase.from(table).delete().in('id', toDeleteIds);
          if (error) console.error(`[CloudSync] Delete failed for ${table}:`, error.message, toDeleteIds);
        }
      }, 0);

      return next;
    });
  };

  const setWorkoutLogsSync = useCallback(createSyncSetter('workout_logs', workoutLogs, setWorkoutLogs, (l) => ({
    id: l.id, split_id: l.splitId, day_id: l.dayId, day_name: l.dayName, date: l.date, notes: l.notes, duration_minutes: l.durationMinutes, exercises: l.exercises || []
  })), [profile, workoutLogs]);

  const setHealthLogsSync = useCallback(createSyncSetter('health_logs', healthLogs, setHealthLogs, (l) => ({
    id: l.id, date: l.date, weight: l.weight, notes: l.notes
  })), [profile, healthLogs]);

  const setFoodLogSync = useCallback(createSyncSetter('food_logs', foodLog, setFoodLog, (l) => ({
    id: l.id,
    date: l.date,
    meal_type: l.mealType || l.slot,
    food_id: l.foodId,
    food_name: l.foodName || l.name,
    serving_id: l.servingId,
    serving_label: l.servingLabel || null,
    grams: normalizeNumber(l.grams ?? l.customGrams),
    quantity: normalizeNumber(l.quantity ?? l.qty) ?? 1,
    calories: normalizeNumber(l.macros?.calories ?? l.calories),
    protein: normalizeNumber(l.macros?.protein ?? l.protein),
    carbs: normalizeNumber(l.macros?.carbs ?? l.carbs),
    fat: normalizeNumber(l.macros?.fat ?? l.fat),
    fiber: normalizeNumber(l.macros?.fiber ?? l.fiber),
    source_type: l.sourceType || null,
  })), [profile, foodLog]);

  const setMeasurementsSync = useCallback(createSyncSetter('measurements', measurements, setMeasurements, (l) => ({
    id: l.id, date: l.date, chest: l.chest, waist: l.waist, hips: l.hips, bicep: l.bicep, thigh: l.thigh, neck: l.neck
  })), [profile, measurements]);

  const setReadinessLogSync = useCallback(createSyncSetter('readiness_logs', readinessLog, setReadinessLog, (l) => ({
    id: l.id,
    date: l.date,
    sleep_hours: normalizeNumber(l.sleepHours),
    energy_level: normalizeNumber(l.energyLevel),
    soreness_level: typeof l.sorenessLevel === 'string'
      ? READINESS_SORENESS_TO_DB[l.sorenessLevel] ?? null
      : normalizeNumber(l.sorenessLevel),
    stress_level: typeof l.stressLevel === 'string'
      ? READINESS_STRESS_TO_DB[l.stressLevel] ?? null
      : normalizeNumber(l.stressLevel),
    score: normalizeNumber(l.score),
    objective_score: normalizeNumber(l.objectiveScore),
    check_in_complete: l.checkInComplete,
  })), [profile, readinessLog]);

  const setSplitsSync = useCallback(createSyncSetter('user_splits', splits, setSplits, (l) => ({
    id: l.id, data: l
  })), [profile, splits]);

  const logReadiness = useCallback((entry) => {
    setReadinessLogSync(prev => {
      const filtered = prev.filter(r => !(r.userId === entry.userId && r.date === entry.date));
      return [...filtered, { ...entry, id: entry.id || `${entry.userId}_${entry.date}` }];
    });
  }, [setReadinessLogSync]);

  const getStreak = useCallback(() => {
    // Streak logic unchanged
    if (!user) return { current: 0, longest: 0 };
    const userWo = workoutLogs.filter(l => l.userId === user.id);
    const dates = [...new Set(userWo.map(l => l.date))].sort((a, b) => new Date(b) - new Date(a));
    if (dates.length === 0) return { current: 0, longest: 0 };
    let current = 0, longest = 0, streak = 1;
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const latest = new Date(dates[0]); latest.setHours(0, 0, 0, 0);
    const diffFromToday = Math.floor((today - latest) / 86400000);
    if (diffFromToday > 1) { current = 0; } else {
      current = 1;
      for (let i = 1; i < dates.length; i++) {
        const d1 = new Date(dates[i - 1]), d2 = new Date(dates[i]);
        d1.setHours(0, 0, 0, 0); d2.setHours(0, 0, 0, 0);
        if (Math.floor((d1 - d2) / 86400000) === 1) current++; else break;
      }
    }
    streak = 1; longest = 1;
    for (let i = 1; i < dates.length; i++) {
      const d1 = new Date(dates[i - 1]), d2 = new Date(dates[i]);
      d1.setHours(0, 0, 0, 0); d2.setHours(0, 0, 0, 0);
      if (Math.floor((d1 - d2) / 86400000) === 1) { streak++; longest = Math.max(longest, streak); } else { streak = 1; }
    }
    return { current, longest: Math.max(longest, current) };
  }, [user, workoutLogs]);

  const getFoodStreak = useCallback(() => {
    if (!user) return { current: 0, longest: 0 };
    const userLogs = foodLog.filter(l => l.userId === user.id);
    const dates = [...new Set(userLogs.map(l => l.date))].sort((a, b) => new Date(b) - new Date(a));
    if (dates.length === 0) return { current: 0, longest: 0 };
    let current = 0, longest = 0, streak = 1;
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const latest = new Date(dates[0]); latest.setHours(0, 0, 0, 0);
    const diffFromToday = Math.floor((today - latest) / 86400000);
    if (diffFromToday > 1) { current = 0; } else {
      current = 1;
      for (let i = 1; i < dates.length; i++) {
        const d1 = new Date(dates[i - 1]), d2 = new Date(dates[i]);
        d1.setHours(0, 0, 0, 0); d2.setHours(0, 0, 0, 0);
        if (Math.floor((d1 - d2) / 86400000) === 1) current++; else break;
      }
    }
    streak = 1; longest = 1;
    for (let i = 1; i < dates.length; i++) {
      const d1 = new Date(dates[i - 1]), d2 = new Date(dates[i]);
      d1.setHours(0, 0, 0, 0); d2.setHours(0, 0, 0, 0);
      if (Math.floor((d1 - d2) / 86400000) === 1) { streak++; longest = Math.max(longest, streak); } else { streak = 1; }
    }
    return { current, longest: Math.max(longest, current) };
  }, [user, foodLog]);

  const toggleFavoriteFood = useCallback((foodId) => {
    setFavoriteIds(prev => prev.includes(foodId) ? prev.filter(id => id !== foodId) : [...prev, foodId]);
  }, [setFavoriteIds]);

  const value = {
    user, authLoading, dataLoaded, updateProfile, logout, session,
    // Provide the Sync wrappers in place of the old setters
    splits, setSplits: setSplitsSync, setActiveSplitId,
    workoutLogs, setWorkoutLogs: setWorkoutLogsSync,
    healthLogs, setHealthLogs: setHealthLogsSync,
    foodLog, setFoodLog: setFoodLogSync,
    measurements, setMeasurements: setMeasurementsSync,
    readinessLog, setReadinessLog: setReadinessLogSync, logReadiness,

    caloriesLog, setCaloriesLog,
    favoriteIds, setFavoriteIds,
    monthlyRankHistory, setMonthlyRankHistory,
    theme, toggleTheme,
    toasts, addToast, removeToast,
    getStreak, getFoodStreak,
    toggleFavoriteFood,
    waterLog, setWaterLog,
    cardioLog, setCardioLog,
    supplementLog, setSupplementLog,
    supplementConfig, setSupplementConfig,
    cycleConfig, setCycleConfig,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
