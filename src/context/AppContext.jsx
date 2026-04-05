import { createContext, useContext, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useTheme } from '../hooks/useTheme';
import { useToast } from '../hooks/useToast';
import { INIT_SPLITS } from '../data/splits';
import { genSample, INIT_USERS } from '../data/sample';
import { gId, tod } from '../utils/helpers';

const AppContext = createContext(null);
const SAMPLE = genSample();

export function AppProvider({ children }) {
  const [users, setUsers] = useLocalStorage('fittrack_users', INIT_USERS);
  const [uid, setUid] = useLocalStorage('fittrack_uid', null);
  const [splits, setSplits] = useLocalStorage('fittrack_splits', INIT_SPLITS);
  const [healthLogs, setHealthLogs] = useLocalStorage('fittrack_healthLogs', SAMPLE.hl);
  const [workoutLogs, setWorkoutLogs] = useLocalStorage('fittrack_workoutLogs', SAMPLE.wl);
  const [readinessLog, setReadinessLog] = useLocalStorage('fittrack_readinessLog', []);
  const [measurements, setMeasurements] = useLocalStorage('fittrack_measurements', []);
  const [caloriesLog, setCaloriesLog] = useLocalStorage('fittrack_caloriesLog', []);
  const [foodLog, setFoodLog] = useLocalStorage('fittrack_foodLog', []);
  const [favoriteIds, setFavoriteIds] = useLocalStorage('fittrack_favoriteFoods', []);
  const [monthlyRankHistory, setMonthlyRankHistory] = useLocalStorage('fittrack_monthlyRankHistory', [
    { id: '2026-02', label: 'Feb 2026', xp: 175000 },
    { id: '2026-01', label: 'Jan 2026', xp: 130000 },
    { id: '2025-12', label: 'Dec 2025', xp: 98000 },
  ]);

  const { theme, toggleTheme, initTheme } = useTheme();
  const { toasts, addToast, removeToast } = useToast();

  useEffect(() => { initTheme(); }, [initTheme]);

  const user = uid ? users.find(u => u.id === uid) : null;

  const login = useCallback((u) => { setUid(u.id); }, [setUid]);
  const logout = useCallback(() => { setUid(null); }, [setUid]);

  const setActiveSplitId = useCallback((id) => {
    setUsers(p => p.map(u => u.id === uid ? { ...u, activeSplitId: id } : u));
  }, [uid, setUsers]);

  // Upserts — one entry per user per date
  // ⚠️ GAP-G9 FIX: wrap in useCallback
  const logReadiness = useCallback((entry) => {
    setReadinessLog(prev => {
      const filtered = prev.filter(
        r => !(r.userId === entry.userId && r.date === entry.date)
      );
      return [...filtered, { ...entry, id: entry.id || `${entry.userId}_${entry.date}` }];
    });
  }, [setReadinessLog]);

  // Streak calculation
  const getStreak = useCallback(() => {
    if (!user) return { current: 0, longest: 0 };
    const userWo = workoutLogs.filter(l => l.userId === user.id || l.userId === 'vishal');
    const dates = [...new Set(userWo.map(l => l.date))].sort((a, b) => new Date(b) - new Date(a));
    if (dates.length === 0) return { current: 0, longest: 0 };

    let current = 0;
    let longest = 0;
    let streak = 1;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const latest = new Date(dates[0]);
    latest.setHours(0, 0, 0, 0);
    const diffFromToday = Math.floor((today - latest) / 86400000);

    if (diffFromToday > 1) {
      current = 0;
    } else {
      current = 1;
      for (let i = 1; i < dates.length; i++) {
        const d1 = new Date(dates[i - 1]);
        const d2 = new Date(dates[i]);
        d1.setHours(0, 0, 0, 0);
        d2.setHours(0, 0, 0, 0);
        if (Math.floor((d1 - d2) / 86400000) === 1) {
          current++;
        } else break;
      }
    }

    // Longest streak
    streak = 1;
    longest = 1;
    for (let i = 1; i < dates.length; i++) {
      const d1 = new Date(dates[i - 1]);
      const d2 = new Date(dates[i]);
      d1.setHours(0, 0, 0, 0);
      d2.setHours(0, 0, 0, 0);
      if (Math.floor((d1 - d2) / 86400000) === 1) {
        streak++;
        longest = Math.max(longest, streak);
      } else {
        streak = 1;
      }
    }

    return { current, longest: Math.max(longest, current) };
  }, [user, workoutLogs]);

  // Streak calculation for food logging
  const getFoodStreak = useCallback(() => {
    if (!user) return { current: 0, longest: 0 };
    const userLogs = foodLog.filter(l => l.userId === user.id);
    const dates = [...new Set(userLogs.map(l => l.date))].sort((a, b) => new Date(b) - new Date(a));
    if (dates.length === 0) return { current: 0, longest: 0 };

    let current = 0;
    let longest = 0;
    let streak = 1;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const latest = new Date(dates[0]);
    latest.setHours(0, 0, 0, 0);
    const diffFromToday = Math.floor((today - latest) / 86400000);

    if (diffFromToday > 1) {
      current = 0;
    } else {
      current = 1;
      for (let i = 1; i < dates.length; i++) {
        const d1 = new Date(dates[i - 1]);
        const d2 = new Date(dates[i]);
        d1.setHours(0, 0, 0, 0);
        d2.setHours(0, 0, 0, 0);
        if (Math.floor((d1 - d2) / 86400000) === 1) {
          current++;
        } else break;
      }
    }

    streak = 1;
    longest = 1;
    for (let i = 1; i < dates.length; i++) {
      const d1 = new Date(dates[i - 1]);
      const d2 = new Date(dates[i]);
      d1.setHours(0, 0, 0, 0);
      d2.setHours(0, 0, 0, 0);
      if (Math.floor((d1 - d2) / 86400000) === 1) {
        streak++;
        longest = Math.max(longest, streak);
      } else {
        streak = 1;
      }
    }
    return { current, longest: Math.max(longest, current) };
  }, [user, foodLog]);

  const toggleFavoriteFood = useCallback((foodId) => {
    setFavoriteIds(prev => prev.includes(foodId) ? prev.filter(id => id !== foodId) : [...prev, foodId]);
  }, [setFavoriteIds]);

  const value = {
    // Auth
    users, setUsers, user, uid, login, logout,
    // Splits
    splits, setSplits, setActiveSplitId,
    // Logs
    healthLogs, setHealthLogs,
    workoutLogs, setWorkoutLogs,
    readinessLog, setReadinessLog, logReadiness,
    // Measurements & Calories
    measurements, setMeasurements,
    caloriesLog, setCaloriesLog,
    foodLog, setFoodLog,
    favoriteIds, setFavoriteIds,
    monthlyRankHistory, setMonthlyRankHistory,
    // Theme
    theme, toggleTheme,
    // Toast
    toasts, addToast, removeToast,
    // Streak
    getStreak, getFoodStreak,
    // Favorites
    toggleFavoriteFood
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
