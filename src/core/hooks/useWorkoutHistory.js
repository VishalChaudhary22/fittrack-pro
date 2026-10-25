// Extracted from the V1 WorkoutHistoryPage page in V-6 (Kaaya Volt) so both skins
// share one logic core. The logic below is byte-identical to the original
// page code; only its home changed.

import { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { tod } from '../../utils/helpers';
import { getMusclesForExercise, MUSCLE_GROUPS } from '../../data/muscleData';
import { useScrollRestoration } from './useScrollRestoration';

const historyCache = { activeTab: 'strength', search: '', filterSplit: '' };

// Format duration from durationMinutes
export const fmtDuration = (mins) => {
  if (!mins) return '—';
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
};

// Compute total volume (reps × weight) for a session
export const calcVolume = (exercises) => {
  if (!exercises?.length) return 0;
  return exercises.reduce((total, ex) =>
    total + ex.sets.reduce((s, set) => s + (set.reps || 0) * (set.weight || 0), 0), 0
  );
};

export function useWorkoutHistory() {
  useScrollRestoration('/history');
  const { user, workoutLogs, setWorkoutLogs, splits, addToast, cardioLog, setCardioLog, updateWorkoutLog } = useApp();
  const [search, setSearchRaw] = useState(historyCache.search);
  const [filterSplit, setFilterSplitRaw] = useState(historyCache.filterSplit);
  const [expandId, setExpandId] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [editLog, setEditLog] = useState(null);
  const [activeTab, setActiveTabRaw] = useState(historyCache.activeTab); // 'strength' | 'cardio'

  const setSearch = (v) => { historyCache.search = v; setSearchRaw(v); };
  const setFilterSplit = (v) => { historyCache.filterSplit = v; setFilterSplitRaw(v); };
  const setActiveTab = (v) => { historyCache.activeTab = v; setActiveTabRaw(v); };
  
  // Cardio Form State
  const [cType, setCType] = useState('Running');
  const [cMins, setCMins] = useState('');
  const [cDist, setCDist] = useState('');
  const [cCals, setCCals] = useState('');

  const userLogs = useMemo(() => {
    let logs = [...workoutLogs]
      .filter(l => l.userId === user.id)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
    if (filterSplit) logs = logs.filter(l => l.splitId === filterSplit);
    if (search) {
      const q = search.toLowerCase();
      logs = logs.filter(l =>
        l.dayName?.toLowerCase().includes(q) ||
        l.exercises?.some(e => e.name.toLowerCase().includes(q))
      );
    }
    return logs;
  }, [workoutLogs, user.id, filterSplit, search]);

  // Build exercise name → muscle field lookup from splits
  const exMuscleMap = useMemo(() => {
    const map = {};
    splits.forEach(split => split.days?.forEach(day =>
      day.exercises?.forEach(ex => {
        if (ex.name && ex.muscle) map[ex.name] = ex.muscle;
      })
    ));
    return map;
  }, [splits]);

  // Get muscle group labels for a session
  const getSessionMuscles = (exercises) => {
    const muscles = new Set();
    exercises?.forEach(ex => {
      // Priority 1: use primaryMuscle stored directly in the log (works for swapped exercises)
      if (ex.primaryMuscle) {
        muscles.add(ex.primaryMuscle);
        (ex.secondaryMuscles || []).forEach(m => muscles.add(m));
      } else {
        // Priority 2: fallback to split-based name lookup
        const muscleField = exMuscleMap[ex.name];
        if (muscleField) {
          getMusclesForExercise(muscleField).forEach(m => muscles.add(m));
        }
      }
    });
    return [...muscles].slice(0, 3).map(key =>
      MUSCLE_GROUPS.find(mg => mg.key === key)?.label || key
    );
  };

  // Monthly aggregate stats for the bento header
  const monthlyStats = useMemo(() => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthLogs = userLogs.filter(l => new Date(l.date) >= startOfMonth);

    const volume = monthLogs.reduce((t, l) => t + calcVolume(l.exercises), 0);
    const timeHrs = monthLogs.reduce((t, l) => t + (l.durationMinutes || 0), 0) / 60;

    return {
      volumeTons: (volume / 1000).toFixed(1),
      timeHrs: timeHrs.toFixed(1),
      sessions: monthLogs.length,
    };
  }, [userLogs]);

  const deleteLog = (id) => {
    setConfirm({
      title: 'Delete Session?', message: 'This workout session will be permanently removed.',
      danger: true, confirmLabel: 'Delete',
      onConfirm: () => {
        setWorkoutLogs(p => p.filter(l => l.id !== id));
        setConfirm(null); setExpandId(null);
        addToast('Session deleted', 'info');
      },
    });
  };

  const deleteCardio = (id) => {
    setConfirm({
      title: 'Delete Cardio?', message: 'This cardio log will be removed.',
      danger: true, confirmLabel: 'Delete',
      onConfirm: () => {
        setCardioLog(p => p.filter(l => l.id !== id));
        setConfirm(null);
        addToast('Cardio log deleted', 'info');
      },
    });
  };

  const userCardioLogs = useMemo(() => {
    return (cardioLog || []).filter(c => c.userId === user.id).sort((a,b) => new Date(b.date) - new Date(a.date));
  }, [cardioLog, user.id]);

  const handleLogCardio = () => {
    if (!cMins || !cCals) { addToast('Please enter at least minutes and calories', 'error'); return; }
    setCardioLog(p => [...p, {
       id: Math.random().toString(36).substring(7),
       userId: user.id,
       date: tod(),
       type: cType,
       minutes: parseInt(cMins),
       distance: cDist ? parseFloat(cDist) : 0,
       calories: parseInt(cCals)
    }]);
    setCMins(''); setCDist(''); setCCals('');
    addToast('Cardio activity logged', 'success');
  };

  const cStats = useMemo(() => {
    const min = userCardioLogs.reduce((s, c) => s + c.minutes, 0);
    const cals = userCardioLogs.reduce((s, c) => s + c.calories, 0);
    return { min, cals };
  }, [userCardioLogs]);

  return { activeTab, addToast, cCals, cDist, cMins, cStats, cType, confirm, deleteCardio, deleteLog, editLog, expandId, filterSplit, getSessionMuscles, handleLogCardio, monthlyStats, search, setActiveTab, setCCals, setCDist, setCMins, setCType, setConfirm, setEditLog, setExpandId, setFilterSplit, setSearch, splits, updateWorkoutLog, userCardioLogs, userLogs };
}
