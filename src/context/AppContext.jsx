import { createContext, useContext, useCallback, useEffect, useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useTheme } from '../hooks/useTheme';
import { useToast } from '../hooks/useToast';
import { genSample } from '../data/sample';
import { INIT_SPLITS } from '../data/splits';

// Supabase & Migration imports
import { supabase } from '../lib/supabaseClient';
import { getOldUserId, uploadLocalDataToCloud } from '../utils/authMigration';

const AppContext = createContext(null);
const SAMPLE = genSample();

export function AppProvider({ children }) {
  // --- Supabase Auth State ---
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // --- Cloud Sync State (Phase Auth-2) ---
  const [splits, setSplits] = useState([]);
  const [healthLogs, setHealthLogs] = useState([]);
  const [workoutLogs, setWorkoutLogs] = useState([]);
  const [readinessLog, setReadinessLog] = useState([]);
  const [measurements, setMeasurements] = useState([]);
  const [foodLog, setFoodLog] = useState([]);

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

  // --- Supabase Auth Listener ---
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) fetchProfile(session.user.id);
      else setAuthLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setProfile(null);
        setAuthLoading(false);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId) => {
    // Check for local data upload FIRST
    await uploadLocalDataToCloud(userId);

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
      const { data: created } = await supabase
        .from('user_profiles')
        .insert(newProfile)
        .select()
        .single();
      
      setProfile(created);
      localStorage.setItem('fittrack_onboarding_pending', 'true');
    } else {
      setProfile(data);
    }

    // Load cloud data!
    await loadCloudData(userId);
    setAuthLoading(false);
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

    setWorkoutLogs(wl?.map(i => ({ ...i, userId: i.user_id, splitId: i.split_id, dayId: i.day_id, dayName: i.day_name, durationMinutes: i.duration_minutes })) || []);
    setHealthLogs(hl?.map(i => ({ ...i, userId: i.user_id })) || []);
    setFoodLog(fl?.map(i => ({ ...i, userId: i.user_id, mealType: i.meal_type, foodId: i.food_id, foodName: i.food_name, servingId: i.serving_id, servingLabel: i.serving_label })) || []);
    setMeasurements(ml?.map(i => ({ ...i, userId: i.user_id })) || []);
    setReadinessLog(rl?.map(i => ({ ...i, userId: i.user_id, sleepHours: i.sleep_hours, energyLevel: i.energy_level, sorenessLevel: i.soreness_level, stressLevel: i.stress_level, objectiveScore: i.objective_score, checkInComplete: i.check_in_complete })) || []);
    
    // Spltis fallback to INIT_SPLITS if none exist
    setSplits(sl?.length > 0 ? sl.map(i => i.data) : INIT_SPLITS);
  };

  // --- Real-Time Sync (Optional fallback listener if we wanted cross-device immediate, but here we will just mutate explicitly to keep it simple) ---

  const updateProfile = async (updates) => {
    if (!profile) return;
    const keyMap = {
      name: 'name', gender: 'gender', age: 'age', height: 'height', weight: 'weight',
      weightGoal: 'weight_goal', weightGoalStart: 'weight_goal_start',
      goalWeeks: 'goal_weeks', goalSetDate: 'goal_set_date',
      activity: 'activity', workoutDays: 'workout_days',
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
    await supabase.auth.signOut();
  };

  const setActiveSplitId = useCallback(async (id) => {
    await updateProfile({ activeSplitId: id });
  }, [profile]);

  const user = profile ? {
    id: session?.user?.id, email: session?.user?.email, name: profile.name, gender: profile.gender, age: profile.age,
    height: profile.height, weight: profile.weight, weightGoal: profile.weight_goal, weightGoalStart: profile.weight_goal_start,
    goalWeeks: profile.goal_weeks, goalSetDate: profile.goal_set_date, activity: profile.activity, workoutDays: profile.workout_days,
    dietType: profile.diet_type, units: profile.units, unitWeight: profile.unit_weight || 'kg', unitHeight: profile.unit_height || 'cm',
    avatar: profile.avatar, avatarType: profile.avatar_type, avatarUrl: profile.avatar_url, activeSplitId: profile.active_split_id,
    isAdmin: profile.is_admin || false, purchasedPrograms: profile.purchased_programs || [], joinDate: profile.created_at?.split('T')[0],
  } : null;

  // --- Mutator Wrappers for Cloud Sync ---
  // To avoid rewriting all 21 setters in the app, we provide a smart wrapper that updates local AND cloud state.
  
  const createSyncSetter = (table, localState, setLocalState, mapperToCloud) => async (updater) => {
    const prev = localState;
    const next = typeof updater === 'function' ? updater(prev) : updater;
    setLocalState(next); // Synchronous UI update

    // Side-effects run safely outside of setState React logic
    const currentUserId = profile?.id;
    if (!currentUserId) return;
    
    // Find added/updated
    const toUpsert = next.filter(n => !prev.some(p => p.id === n.id) || JSON.stringify(prev.find(p => p.id === n.id)) !== JSON.stringify(n));
    // Find deleted
    const toDeleteIds = prev.filter(p => !next.some(n => n.id === p.id)).map(p => p.id);

    try {
      if (toUpsert.length > 0) {
        const mapped = toUpsert.map(i => ({ ...mapperToCloud(i), user_id: currentUserId }));
        await supabase.from(table).upsert(mapped, { onConflict: 'id' });
      }
      if (toDeleteIds.length > 0) {
        await supabase.from(table).delete().in('id', toDeleteIds);
      }
    } catch (e) {
      console.error(`[CloudSync] Failed to sync ${table}:`, e);
    }
  };

  const setWorkoutLogsSync = useCallback(createSyncSetter('workout_logs', workoutLogs, setWorkoutLogs, (l) => ({
    id: l.id, split_id: l.splitId, day_id: l.dayId, day_name: l.dayName, date: l.date, notes: l.notes, duration_minutes: l.durationMinutes, exercises: l.exercises || []
  })), [profile, workoutLogs]);

  const setHealthLogsSync = useCallback(createSyncSetter('health_logs', healthLogs, setHealthLogs, (l) => ({
    id: l.id, date: l.date, weight: l.weight, notes: l.notes
  })), [profile, healthLogs]);

  const setFoodLogSync = useCallback(createSyncSetter('food_logs', foodLog, setFoodLog, (l) => ({
    id: l.id, date: l.date, meal_type: l.mealType, food_id: l.foodId, food_name: l.foodName, serving_id: l.servingId, serving_label: l.servingLabel, grams: l.grams, quantity: l.quantity, calories: l.calories, protein: l.protein, carbs: l.carbs, fat: l.fat, fiber: l.fiber
  })), [profile, foodLog]);

  const setMeasurementsSync = useCallback(createSyncSetter('measurements', measurements, setMeasurements, (l) => ({
    id: l.id, date: l.date, chest: l.chest, waist: l.waist, hips: l.hips, bicep: l.bicep, thigh: l.thigh, neck: l.neck
  })), [profile, measurements]);

  const setReadinessLogSync = useCallback(createSyncSetter('readiness_logs', readinessLog, setReadinessLog, (l) => ({
    id: l.id, date: l.date, sleep_hours: l.sleepHours, energy_level: l.energyLevel, soreness_level: l.sorenessLevel, stress_level: l.stressLevel, score: l.score, objective_score: l.objectiveScore, check_in_complete: l.checkInComplete
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
    const userWo = workoutLogs.filter(l => l.userId === user.id || l.userId === 'vishal');
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
    user, authLoading, updateProfile, logout, session,
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
