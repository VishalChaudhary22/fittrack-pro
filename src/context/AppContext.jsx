import { createContext, useContext, useCallback, useEffect, useState, useRef, useMemo } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useTheme } from '../hooks/useTheme';
import { useToast } from '../hooks/useToast';
import { genSample } from '../data/sample';
import { INIT_SPLITS } from '../data/splits';

// Supabase & Migration imports
import { supabase } from '../lib/supabaseClient';
import { getOldUserIdIfEmailMatches, migrateLocalData, cleanupOldAuthStorage, uploadLocalDataToCloud } from '../utils/authMigration';
import { calcStepsCalories } from '../utils/activityUtils';
import { syncUserXPToCache } from '../utils/xpCacheSync';
import { computeWeeklyRate, classifyScenario, hasSufficientData, checkSuggestionCooldown, computeNewTarget, recomputeMacros } from '../utils/adaptiveCalories';
import { calcBMR, calcTDEE, calcDeficit } from '../utils/calculations';

const AppContext = createContext(null);
const SAMPLE = genSample();
const getProfileCacheKey = (userId) => `fittrack_profile_${userId}`;

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

const readCachedProfile = (userId) => {
  if (!userId) return null;
  try {
    const raw = localStorage.getItem(getProfileCacheKey(userId));
    const parsed = raw ? JSON.parse(raw) : null;
    return parsed && typeof parsed === 'object' ? parsed : null;
  } catch {
    return null;
  }
};

const persistCachedProfile = (profile) => {
  if (!profile?.id) return;
  try {
    localStorage.setItem(getProfileCacheKey(profile.id), JSON.stringify(profile));
  } catch {
    // Ignore storage quota and private-mode write failures.
  }
};

const getAvatarInitials = (value) => {
  if (!value) return 'U';
  const initials = value
    .trim()
    .split(/\s+/)
    .map(part => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
  return initials || value.slice(0, 2).toUpperCase() || 'U';
};

const buildFallbackProfile = (sessionUser, cachedProfile = null) => {
  if (!sessionUser?.id) return null;

  const meta = sessionUser.user_metadata || {};
  const displayName = cachedProfile?.name
    || meta.full_name
    || meta.name
    || sessionUser.email?.split('@')[0]
    || 'User';

  return {
    id: sessionUser.id,
    name: displayName,
    gender: cachedProfile?.gender || meta.gender || 'male',
    avatar: cachedProfile?.avatar || getAvatarInitials(displayName),
    avatar_type: cachedProfile?.avatar_type || null,
    avatar_url: cachedProfile?.avatar_url || null,
    active_split_id: cachedProfile?.active_split_id || null,
    unit_weight: cachedProfile?.unit_weight || 'kg',
    unit_height: cachedProfile?.unit_height || 'cm',
    is_admin: cachedProfile?.is_admin || false,
    created_at: cachedProfile?.created_at || sessionUser.created_at || null,
    ...cachedProfile,
    id: sessionUser.id,
  };
};

const getEntryTime = (entry) => {
  const candidate = entry?.updated_at || entry?.created_at || entry?.timestamp;
  const timestamp = candidate ? new Date(candidate).getTime() : NaN;
  if (Number.isFinite(timestamp)) return timestamp;

  const fallback = entry?.date ? new Date(`${entry.date}T12:00:00`).getTime() : NaN;
  return Number.isFinite(fallback) ? fallback : 0;
};

const mergeFoodEntries = (cloudEntries, localEntries, userId) => {
  const merged = [...cloudEntries];
  const knownIds = new Set(cloudEntries.map(entry => entry.id));

  localEntries
    .filter(entry => entry?.userId === userId)
    .forEach(entry => {
      if (!knownIds.has(entry.id)) merged.push(entry);
    });

  return merged.sort((a, b) => getEntryTime(b) - getEntryTime(a));
};

const mergeStepEntries = (cloudEntries, localEntries, userId) => {
  const merged = [...cloudEntries];
  const knownIds = new Set(cloudEntries.map(entry => entry.id));

  localEntries
    .filter(entry => entry?.user_id === userId || entry?.userId === userId)
    .forEach(entry => {
      if (!knownIds.has(entry.id)) merged.push(entry);
    });

  return merged.sort((a, b) => b.date.localeCompare(a.date));
};

const getReadinessKey = (entry, userId) => `${entry?.userId || userId}:${entry?.date || ''}`;

const pickPreferredReadinessEntry = (existingEntry, nextEntry) => {
  const existingComplete = Boolean(existingEntry?.checkInComplete);
  const nextComplete = Boolean(nextEntry?.checkInComplete);
  if (existingComplete !== nextComplete) return nextComplete ? nextEntry : existingEntry;

  const existingTime = getEntryTime(existingEntry);
  const nextTime = getEntryTime(nextEntry);
  if (existingTime !== nextTime) return nextTime > existingTime ? nextEntry : existingEntry;

  return nextEntry;
};

const mergeReadinessEntries = (cloudEntries, localEntries, userId) => {
  const mergedByDate = new Map();

  [...localEntries.filter(entry => entry?.userId === userId), ...cloudEntries].forEach(entry => {
    const key = getReadinessKey(entry, userId);
    const existingEntry = mergedByDate.get(key);
    mergedByDate.set(key, existingEntry ? pickPreferredReadinessEntry(existingEntry, entry) : entry);
  });

  return [...mergedByDate.values()].sort((a, b) => b.date.localeCompare(a.date));
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
  const [stepLogs, setStepLogsState] = useState(() => {
    const cachedUserId = localStorage.getItem('fittrack_last_user_id');
    if (!cachedUserId) return [];
    try { return JSON.parse(localStorage.getItem(`fittrack_stepLog_${cachedUserId}`) || '[]'); }
    catch { return []; }
  });
  const [bodyFatLog, setBodyFatLogState] = useState(() => {
    const cachedUserId = localStorage.getItem('fittrack_last_user_id');
    if (!cachedUserId) return [];
    try { return JSON.parse(localStorage.getItem(`fittrack_bodyFatLog_${cachedUserId}`) || '[]'); }
    catch { return []; }
  });

  const setStepLogs = useCallback((updater) => {
    setStepLogsState(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      const cachedUserId = localStorage.getItem('fittrack_last_user_id');
      if (cachedUserId) {
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - 90);
        const cutoffStr = cutoff.toISOString().split('T')[0];
        const pruned = next.filter(e => e.date >= cutoffStr);
        localStorage.setItem(`fittrack_stepLog_${cachedUserId}`, JSON.stringify(pruned));
      }
      return next;
    });
  }, []);

  const setBodyFatLog = useCallback((updater) => {
    setBodyFatLogState(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      const cachedUserId = localStorage.getItem('fittrack_last_user_id');
      if (cachedUserId) {
        localStorage.setItem(`fittrack_bodyFatLog_${cachedUserId}`, JSON.stringify(next));
      }
      return next;
    });
  }, []);

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
  const [lastSuggestionDate, setLastSuggestionDate] = useLocalStorage('fittrack_last_suggestion_date', null);

  const { theme, toggleTheme, initTheme } = useTheme();
  const { toasts, addToast, removeToast } = useToast();

  useEffect(() => { initTheme(); }, [initTheme]);

  const isFetchingProfile = useRef(false);
  const prevUserIdRef = useRef(null);
  const foodLogRef = useRef(foodLog);
  const readinessLogRef = useRef(readinessLog);
  const stepLogsRef = useRef(stepLogs);
  const bodyFatLogRef = useRef(bodyFatLog);
  const currentUserIdRef = useRef(null);
  const cloudRefreshTimerRef = useRef(null);

  useEffect(() => {
    foodLogRef.current = foodLog;
  }, [foodLog]);

  useEffect(() => {
    readinessLogRef.current = readinessLog;
  }, [readinessLog]);

  useEffect(() => {
    stepLogsRef.current = stepLogs;
  }, [stepLogs]);

  useEffect(() => {
    bodyFatLogRef.current = bodyFatLog;
  }, [bodyFatLog]);

  useEffect(() => {
    currentUserIdRef.current = session?.user?.id || profile?.id || localStorage.getItem('fittrack_last_user_id') || null;
  }, [session?.user?.id, profile?.id]);

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
      setBodyFatLog([]);
      
      localStorage.removeItem(`fittrack_foodLog_${prevUserIdRef.current}`);
      localStorage.removeItem(`fittrack_readinessLog_${prevUserIdRef.current}`);
      localStorage.removeItem(`fittrack_bodyFatLog_${prevUserIdRef.current}`);
    }
  
    prevUserIdRef.current = session.user.id;
  }, [session?.user?.id]);

  // --- Supabase Auth Listener ---
  useEffect(() => {
    let initialized = false;
    let mounted = true;

    const handleSessionBootstrap = (nextSession) => {
      if (!mounted) return;

      const nextUser = nextSession?.user || null;
      console.log('[Auth] Session bootstrap:', nextUser ? `user=${nextUser.id}` : 'no session');
      initialized = true;
      setSession(nextSession);

      if (nextUser) {
        localStorage.setItem('fittrack_last_user_id', nextUser.id);
        const cachedProfile = readCachedProfile(nextUser.id);
        const fallbackProfile = buildFallbackProfile(nextUser, cachedProfile);
        if (fallbackProfile) {
          setProfile(prev => {
            if (prev?.id === nextUser.id) return { ...fallbackProfile, ...prev };
            return fallbackProfile;
          });
          persistCachedProfile(fallbackProfile);
        }
        setAuthLoading(false);
        void fetchProfile(nextUser.id);
        return;
      }

      localStorage.removeItem('fittrack_last_user_id');
      // Clear cloud state
      setProfile(null);
      setSplits(INIT_SPLITS);
      setHealthLogs([]);
      setWorkoutLogs([]);
      setReadinessLog([]);
      setMeasurements([]);
      setFoodLog([]);
      setStepLogs([]);
      setBodyFatLog([]);
      // Clear local-only prefs (Fix 6)
      setFavoriteIds([]);
      setSupplementConfig([]);
      setCycleConfig({ startDate: '', cycleLength: 28 });
      
      setDataLoaded(false);
      setAuthLoading(false);
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      console.log('[Auth] onAuthStateChange:', _event, nextSession ? `user=${nextSession.user.id}` : 'no session');
      handleSessionBootstrap(nextSession);
    });

    supabase.auth.getSession()
      .then(({ data }) => {
        if (!initialized) handleSessionBootstrap(data.session);
      })
      .catch((error) => {
        console.error('[Auth] Initial session check failed:', error?.message || error);
        if (mounted) setAuthLoading(false);
      });

    const timeout = setTimeout(() => {
      if (!initialized && mounted) setAuthLoading(false);
    }, 3000);

    return () => {
      mounted = false;
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
          if (retryData) {
            setProfile(retryData);
            persistCachedProfile(retryData);
          }
        } else {
          setProfile(created);
          persistCachedProfile(created);
          localStorage.setItem(`fittrack_onboarding_pending:${userId}`, 'true');
          localStorage.setItem('fittrack_user_created_at', new Date().toISOString());
        }
      } else if (error) {
        console.error('[Auth] Profile fetch error:', error.message);
      } else {
        setProfile(data);
        persistCachedProfile(data);
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
    } catch (error) {
      console.error('[Auth] Profile bootstrap failed:', error?.message || error);
    } finally {
      cleanupOldAuthStorage();
      isFetchingProfile.current = false;
      setAuthLoading(false);
    }
  };

  const loadCloudData = useCallback(async (userId) => {
    if (!userId) return;

    const [
      workoutRes, healthRes, foodRes, measurementRes, readinessRes, splitsRes, stepRes, bfRes
    ] = await Promise.all([
      supabase.from('workout_logs').select('*').eq('user_id', userId),
      supabase.from('health_logs').select('*').eq('user_id', userId),
      supabase.from('food_logs').select('*').eq('user_id', userId),
      supabase.from('measurements').select('*').eq('user_id', userId),
      supabase.from('readiness_logs').select('*').eq('user_id', userId),
      supabase.from('user_splits').select('*').eq('user_id', userId),
      supabase.from('step_logs').select('*').eq('user_id', userId).order('date', { ascending: false }).limit(90),
      supabase.from('body_fat_logs').select('*').eq('user_id', userId).order('date', { ascending: false }),
    ]);

    const cloudErrors = [workoutRes, healthRes, foodRes, measurementRes, readinessRes, splitsRes, stepRes, bfRes]
      .map(result => result.error)
      .filter(Boolean);
    if (cloudErrors.length > 0) {
      console.error('[CloudSync] Cloud load errors:', cloudErrors.map(error => error.message));
    }

    const wl = workoutRes.data || [];
    const hl = healthRes.data || [];
    const fl = foodRes.data || [];
    const ml = measurementRes.data || [];
    const rl = readinessRes.data || [];
    const sl = splitsRes.data || [];
    const stepData = stepRes.data || [];
    const bfData = bfRes.data || [];

    const persistedFoodLog = readPersistedUserArray('fittrack_foodLog', userId);
    const persistedReadinessLog = readPersistedUserArray('fittrack_readinessLog', userId);
    const persistedStepLog = readPersistedUserArray('fittrack_stepLog', userId);
    const cachedFoodSource = foodLogRef.current.length > 0 ? foodLogRef.current : persistedFoodLog;
    const cachedReadinessSource = readinessLogRef.current.length > 0 ? readinessLogRef.current : persistedReadinessLog;
    const cachedStepSource = stepLogsRef.current.length > 0 ? stepLogsRef.current : persistedStepLog;

    setWorkoutLogs(wl.map(i => ({ ...i, userId: i.user_id, splitId: i.split_id, dayId: i.day_id, dayName: i.day_name, durationMinutes: i.duration_minutes })));
    setHealthLogs(hl.map(i => ({ ...i, userId: i.user_id })));

    const mappedFoodLogFromCloud = fl.map(item => {
      const cachedItem = cachedFoodSource.find(entry => entry.id === item.id);
      return mapFoodLogFromCloud(item, cachedItem);
    });
    const mergedFoodLog = mappedFoodLogFromCloud.length > 0
      ? mergeFoodEntries(mappedFoodLogFromCloud, cachedFoodSource, userId)
      : cachedFoodSource;
    if (mergedFoodLog.length > 0 || foodLogRef.current.length === 0) {
      setFoodLog(mergedFoodLog);
    }

    setMeasurements(ml.map(i => ({ ...i, userId: i.user_id })));

    const mappedReadinessFromCloud = rl.map(item => {
      const cachedItem = cachedReadinessSource.find(entry => entry.id === item.id || (entry.userId === userId && entry.date === item.date));
      return mapReadinessFromCloud(item, cachedItem);
    });
    const mergedReadinessLog = mappedReadinessFromCloud.length > 0
      ? mergeReadinessEntries(mappedReadinessFromCloud, cachedReadinessSource, userId)
      : cachedReadinessSource;
    if (mergedReadinessLog.length > 0 || readinessLogRef.current.length === 0) {
      setReadinessLog(mergedReadinessLog);
    }
    
    const mergedStepLog = stepData.length > 0
      ? mergeStepEntries(stepData, cachedStepSource, userId)
      : cachedStepSource;
    if (mergedStepLog.length > 0 || stepLogsRef.current.length === 0) {
      setStepLogs(mergedStepLog);
    }

    // Body fat logs — merge local entries to avoid wiping unsynced local logs
    const cloudBF = bfData.map(row => ({
      id: row.id, userId: row.user_id, date: row.date,
      percentage: parseFloat(row.percentage), method: row.method,
      notes: row.notes || '', createdAt: new Date(row.created_at).getTime(),
    }));
    const persistedBFLog = readPersistedUserArray('fittrack_bodyFatLog', userId);
    const localBFSource = bodyFatLogRef.current.length > 0 ? bodyFatLogRef.current : persistedBFLog;
    const cloudBFIds = new Set(cloudBF.map(e => e.id));
    const localOnlyBF = localBFSource.filter(e => e.userId === userId && !cloudBFIds.has(e.id));
    const mergedBF = [...cloudBF, ...localOnlyBF].sort((a, b) => new Date(b.date) - new Date(a.date));
    if (mergedBF.length > 0 || bodyFatLogRef.current.length === 0) {
      setBodyFatLog(mergedBF);
    }

    // Spltis fallback to INIT_SPLITS if none exist
    const mappedSplits = sl.length > 0 ? sl.map(i => i.data) : INIT_SPLITS;
    setSplits(mappedSplits);

    // Sync XP to leaderboard cache now that logs are loaded
    if (userId && wl.length > 0) {
      setTimeout(() => {
        const mappedLogs = wl.map(i => ({ ...i, userId: i.user_id, splitId: i.split_id, dayId: i.day_id, dayName: i.day_name, durationMinutes: i.duration_minutes }));
        // user object is not fully reconstructed here, but we just need id, name, avatar
        syncUserXPToCache({ workoutLogs: mappedLogs, splits: mappedSplits, user: { id: userId, name: 'Athlete' } }).catch(console.warn);
      }, 2000);
    }
    
    setDataLoaded(true);
  }, [setFoodLog, setReadinessLog]);

  const scheduleCloudRefresh = useCallback((userId) => {
    if (!userId) return;
    if (cloudRefreshTimerRef.current) clearTimeout(cloudRefreshTimerRef.current);
    cloudRefreshTimerRef.current = setTimeout(() => {
      cloudRefreshTimerRef.current = null;
      void loadCloudData(userId);
    }, 250);
  }, [loadCloudData]);

  useEffect(() => {
    const userId = session?.user?.id || profile?.id;
    if (!userId) return undefined;

    const handleRefresh = () => {
      if (document.visibilityState === 'visible') {
        scheduleCloudRefresh(userId);
      }
    };

    const pollIfVisible = () => {
      if (document.visibilityState === 'visible') {
        scheduleCloudRefresh(userId);
      }
    };

    window.addEventListener('focus', handleRefresh);
    window.addEventListener('online', handleRefresh);
    window.addEventListener('pageshow', handleRefresh);
    document.addEventListener('visibilitychange', handleRefresh);
    const pollInterval = window.setInterval(pollIfVisible, 15000);

    const channel = supabase
      .channel(`fittrack-sync-${userId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'food_logs',
        filter: `user_id=eq.${userId}`,
      }, () => {
        scheduleCloudRefresh(userId);
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'readiness_logs',
        filter: `user_id=eq.${userId}`,
      }, () => {
        scheduleCloudRefresh(userId);
      })
      .subscribe();

    return () => {
      window.removeEventListener('focus', handleRefresh);
      window.removeEventListener('online', handleRefresh);
      window.removeEventListener('pageshow', handleRefresh);
      document.removeEventListener('visibilitychange', handleRefresh);
      window.clearInterval(pollInterval);
      if (cloudRefreshTimerRef.current) {
        clearTimeout(cloudRefreshTimerRef.current);
        cloudRefreshTimerRef.current = null;
      }
      supabase.removeChannel(channel);
    };
  }, [session?.user?.id, profile?.id, scheduleCloudRefresh]);

  const updateProfile = async (updates) => {
    if (!profile) {
      console.warn('[updateProfile] No profile loaded — cannot save');
      return { error: { message: 'Profile not loaded' } };
    }
    const keyMap = {
      name: 'name', gender: 'gender', age: 'age', height: 'height', weight: 'weight',
      weightGoal: 'weight_goal', weightGoalStart: 'weight_goal_start',
      goalWeeks: 'goal_weeks', goalSetDate: 'goal_set_date',
      activity: 'activity', activityLevel: 'activity', workoutDays: 'workout_days',
      dietType: 'diet_type', units: 'units', unitWeight: 'unit_weight', unitHeight: 'unit_height',
      avatar: 'avatar', avatarType: 'avatar_type', avatarUrl: 'avatar_url',
      activeSplitId: 'active_split_id', isAdmin: 'is_admin', stepGoal: 'step_goal',
      bodyFatGoal: 'body_fat_goal',
      customGoalKcal: 'custom_goal_kcal', customProteinG: 'custom_protein_g',
      lastKcalSuggestionDate: 'last_kcal_suggestion_date',
    };
    const snakeUpdates = {};
    for (const [camel, snake] of Object.entries(keyMap)) {
      if (updates[camel] !== undefined) snakeUpdates[snake] = updates[camel];
    }
    console.log('[updateProfile] snakeUpdates:', snakeUpdates, 'profile.id:', profile.id);

    let { data, error } = await supabase.from('user_profiles')
      .update(snakeUpdates)
      .eq('id', profile.id)
      .select()
      .maybeSingle();

    console.log('[updateProfile] update result:', { data: !!data, error: error?.message || null });

    if (!data && !error) {
      // Row update returned nothing — could be missing row or RLS block.
      // Try upsert instead of insert to avoid duplicate key errors.
      console.log('[updateProfile] No data returned from update, trying upsert fallback...');
      const { data: upsertData, error: upsertError } = await supabase.from('user_profiles')
        .upsert({ id: profile.id, ...snakeUpdates }, { onConflict: 'id' })
        .select()
        .single();
      data = upsertData;
      error = upsertError;
      console.log('[updateProfile] upsert result:', { data: !!data, error: error?.message || null });
    }

    if (!error && data) setProfile(data);
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
    stepGoal: profile.step_goal || 10000,
    bodyFatGoal: profile.body_fat_goal || null,
    customGoalKcal: profile.custom_goal_kcal || null,
    customProteinG: profile.custom_protein_g || null,
    lastKcalSuggestionDate: profile.last_kcal_suggestion_date || null,
  } : null;

  // --- Mutator Wrappers for Cloud Sync ---
  // To avoid rewriting all 21 setters in the app, we provide a smart wrapper that updates local AND cloud state.
  
  const createSyncSetter = (table, localState, setLocalState, mapperToCloud) => async (updater) => {
    setLocalState(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      
      // Compute delta and sync asynchronously to avoid blocking the React render
      setTimeout(async () => {
        const currentUserId = currentUserIdRef.current;
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
          if (error) console.error(`[CloudSync] ❌ Upsert FAILED for ${table}:`, error.message, mapped);
          else console.log(`[CloudSync] ✅ Upserted ${mapped.length} row(s) to ${table}`);
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

  const setBodyFatLogSync = useCallback(createSyncSetter('body_fat_logs', bodyFatLog, setBodyFatLog, (l) => ({
    id: l.id, date: l.date, percentage: l.percentage,
    method: l.method || 'visual', notes: l.notes || null,
    created_at: l.createdAt ? new Date(l.createdAt).toISOString() : new Date().toISOString(),
  })), [profile, bodyFatLog]);

  const logReadiness = useCallback((entry) => {
    setReadinessLogSync(prev => {
      const filtered = prev.filter(r => !(r.userId === entry.userId && r.date === entry.date));
      return [...filtered, { ...entry, id: entry.id || `${entry.userId}_${entry.date}` }];
    });
  }, [setReadinessLogSync]);

  const logSteps = useCallback(async ({ steps, date, source = 'manual', distanceKm, caloriesActive, floors }) => {
    if (!profile?.id) return;
    const userId = profile.id;
    const calculatedCals = caloriesActive ?? calcStepsCalories(steps, profile.weight || 70);

    const entry = {
      id: `${userId}_${date}_${source}`,
      user_id: userId,
      date,
      steps,
      distance_km: distanceKm || null,
      calories_active: calculatedCals || null,
      floors: floors || null,
      source,
      synced_at: new Date().toISOString(),
    };
    await supabase.from('step_logs').upsert(entry, { onConflict: 'id' });
    setStepLogs(prev => {
      const filtered = prev.filter(l => !(l.date === date && l.source === source));
      return [...filtered, entry].sort((a, b) => b.date.localeCompare(a.date));
    });
  }, [profile?.id]);

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

  // --- Adaptive Diet Suggestion ---
  const adaptiveSuggestion = useMemo(() => {
    if (!user || !healthLogs || healthLogs.length < 5) return null;
    if (!checkSuggestionCooldown(lastSuggestionDate).canSuggest) return null;
    const userLogs = healthLogs.filter(l => l.userId === user.id && l.weight);
    if (!hasSufficientData(userLogs)) return null;
    const rateData = computeWeeklyRate(userLogs);

    // Determine goal from deficit calculation
    const bmr = calcBMR(user.weight, user.height, user.age, user.gender);
    const tdee = calcTDEE(bmr, user.activityLevel || 'moderate');
    const deficitInfo = calcDeficit(user.weight, user.weightGoal, user.goalWeeks);
    const goal = deficitInfo.goal;
    const dailyDelta = deficitInfo.dailyDelta || (goal === 'loss' ? 500 : goal === 'gain' ? 400 : 0);
    const computedKcal = goal === 'loss' ? tdee - dailyDelta : goal === 'gain' ? tdee + dailyDelta : tdee;
    const goalKcal = user.customGoalKcal || computedKcal;

    const scenario = classifyScenario(rateData, {
      goal,
      currentWeight: user.weight,
      goalKcal,
      gender: user.gender,
    });
    return { ...scenario, goalKcal, tdee, goal };
  }, [user, healthLogs, lastSuggestionDate]);

  const acceptSuggestion = useCallback(async (newKcal, newProtein) => {
    const today = new Date().toISOString().split('T')[0];
    await updateProfile({
      customGoalKcal: newKcal,
      customProteinG: newProtein || null,
      lastKcalSuggestionDate: today,
    });
    setLastSuggestionDate(today);
    addToast('Targets updated! 🎯', 'success');
  }, [updateProfile, setLastSuggestionDate, addToast]);

  const dismissSuggestion = useCallback(() => {
    const today = new Date().toISOString().split('T')[0];
    setLastSuggestionDate(today);
  }, [setLastSuggestionDate]);

  const value = {
    user, authLoading, dataLoaded, updateProfile, logout, session,
    // Provide the Sync wrappers in place of the old setters
    splits, setSplits: setSplitsSync, setActiveSplitId,
    workoutLogs, setWorkoutLogs: setWorkoutLogsSync,
    healthLogs, setHealthLogs: setHealthLogsSync,
    foodLog, setFoodLog: setFoodLogSync,
    measurements, setMeasurements: setMeasurementsSync,
    readinessLog, setReadinessLog: setReadinessLogSync, logReadiness,

    stepLogs, logSteps,
    bodyFatLog, setBodyFatLog: setBodyFatLogSync,

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
    // Adaptive Diet
    adaptiveSuggestion, acceptSuggestion, dismissSuggestion,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
