// ─── useWorkoutSession ───────────────────────────────────────────────────────
// The complete workout-session state machine (session, sets, rest timer,
// swaps, finish flow) extracted from the V1 WorkoutPage (Kaaya Volt V-1).
// The V1 page renders three branches (done / in-session / planner) from
// these bindings; Volt's Workout page will consume the same hook.
import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Timer, Check } from 'lucide-react';
import { getLastSessionSets, getAllTimePR, beatsAllTimePR } from '../../utils/exerciseHistory';
import { useApp } from '../context/AppContext';
import { gId, tod } from '../../utils/helpers';
import { syncUserXPToCache } from '../../utils/xpCacheSync';
import { getSwappedExercise, registerSwap, removeSwap } from '../../utils/swapRegistry';
import { clearScrollPosition } from './useScrollRestoration';
import { EXERCISE_LIBRARY } from '../../data/exerciseLibrary';
import { getAudioCtx, playRestCompleteChime, vibrateRestComplete, REST_TIMER_KEY, REST_TIMER_POS_KEY, SESSION_STALE_MS, persistActiveSession, clearPersistedSession, loadPersistedSession, workoutPageCache } from '../services/workoutSession';

export function useWorkoutSession() {
  const { user, splits, workoutLogs, setWorkoutLogs, addToast } = useApp();
  const nav = useNavigate();
  const activeSplit = splits.find(s => s.id === user.activeSplitId) || splits[0];
  const [pastDate, setPastDate] = useState(tod());
  // --- Session state: auto-resume from localStorage on mount ---
  const [session, setSession] = useState(() => {
    try {
      const saved = loadPersistedSession(user?.id);
      if (saved && (Date.now() - (saved.lastUpdated || saved.startTime)) < SESSION_STALE_MS) {
        return saved; // Fresh session — auto-resume
      }
    } catch { /* best effort */ }
    return null;
  });
  const [done, setDone] = useState(null);

  // Resume card — only for stale sessions (8-24h)
  const [persistedSession, setPersistedSession] = useState(() => {
    try {
      const saved = loadPersistedSession(user?.id);
      if (saved && (Date.now() - (saved.lastUpdated || saved.startTime)) >= SESSION_STALE_MS) {
        return saved; // Stale — show resume card
      }
    } catch { /* best effort */ }
    return null;
  });
  const [confirmDiscard, setConfirmDiscard] = useState(false);
  const [swapTarget, setSwapTarget] = useState(null);
  const [showAddEx, setShowAddEx] = useState(false);
  const [addExSearch, setAddExSearch] = useState('');
  const [addExCat, setAddExCat] = useState('all');
  const [confirmRemoveIdx, setConfirmRemoveIdx] = useState(null);

  const prMap = useMemo(() => {
    const map = {};
    for (const ex of session?.exs ?? []) {
      const name = ex.sv || ex.name;
      map[name] = getAllTimePR(workoutLogs, name);
    }
    return map;
  }, [session?.exs, workoutLogs]);

  // Timer State (Fix 3 & 5)
  const [restDuration, setRestDuration] = useState(() => {
    const saved = localStorage.getItem('fittrack_restTimerDuration');
    return saved ? parseInt(saved, 10) : 90;
  });
  const [restActive, setRestActive] = useState(false);
  const [restEndsAt, setRestEndsAt] = useState(null);
  const [restSecondsLeft, setRestSecondsLeft] = useState(0);
  const [restTimerPosition, setRestTimerPosition] = useState(null); // { ei, si }

  const [confirmFinish, setConfirmFinish] = useState(false);
  const wDays = activeSplit?.days.filter(d => d.type !== 'rest') || [];

  const finishBtnRef = useRef(null);
  const [showFAB, setShowFAB] = useState(true);

  const startTimeRef = useRef(null);
  const [elapsed, setElapsed] = useState(0);

  // Recover startTime on auto-resume
  useEffect(() => {
    if (session && session.startTime && !startTimeRef.current) {
      startTimeRef.current = session.startTime;
    }
  }, [session]);

  // Persist active session (Fix 6)
  useEffect(() => {
    if (session && !done && !session.isYoga) {
      persistActiveSession({ ...session, userId: user.id });
    } else if (done) {
      clearPersistedSession();
    }
  }, [session, done, user]);

  // Read timer from localStorage on mount (Fix 3) — also restore position
  useEffect(() => {
    const saved = localStorage.getItem(REST_TIMER_KEY);
    if (saved) {
       const endsAt = parseInt(saved, 10);
       if (endsAt > Date.now()) {
          setRestEndsAt(endsAt);
          setRestActive(true);
          // Restore timer position
          try {
            const posRaw = localStorage.getItem(REST_TIMER_POS_KEY);
            if (posRaw) setRestTimerPosition(JSON.parse(posRaw));
          } catch { /* best effort */ }
       } else {
          localStorage.removeItem(REST_TIMER_KEY);
          localStorage.removeItem(REST_TIMER_POS_KEY);
          playRestCompleteChime();
          vibrateRestComplete();
       }
    }
  }, []);

  // Tick rest timer (Fix 3)
  useEffect(() => {
    if (!restActive || !restEndsAt) return;
    const interval = setInterval(() => {
      const remaining = Math.max(0, restEndsAt - Date.now());
      setRestSecondsLeft(Math.ceil(remaining / 1000));
      if (remaining <= 0) {
        clearInterval(interval);
        localStorage.removeItem(REST_TIMER_KEY);
        localStorage.removeItem(REST_TIMER_POS_KEY);
        setRestActive(false);
        setRestTimerPosition(null);
        playRestCompleteChime();
        vibrateRestComplete();
      }
    }, 250);
    return () => clearInterval(interval);
  }, [restActive, restEndsAt]);

  // Page visibility handler (Fix 3)
  useEffect(() => {
    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        const saved = localStorage.getItem(REST_TIMER_KEY);
        if (saved) {
          const endsAt = parseInt(saved, 10);
          if (endsAt <= Date.now()) {
            localStorage.removeItem(REST_TIMER_KEY);
            localStorage.removeItem(REST_TIMER_POS_KEY);
            setRestActive(false);
            setRestTimerPosition(null);
            playRestCompleteChime();
            vibrateRestComplete();
          } else {
            setRestEndsAt(endsAt);
          }
        }
      }
    };
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => document.removeEventListener('visibilitychange', onVisibilityChange);
  }, []);

  function handleRestDurationChange(newSeconds) {
    setRestDuration(newSeconds);
    localStorage.setItem('fittrack_restTimerDuration', String(newSeconds));
  }

  function skipRestTimer() {
    localStorage.removeItem(REST_TIMER_KEY);
    localStorage.removeItem(REST_TIMER_POS_KEY);
    setRestActive(false);
    setRestTimerPosition(null);
  }

  function extendRestTimer(extraSeconds) {
    setRestEndsAt(prev => {
      const newEnd = (prev || Date.now()) + extraSeconds * 1000;
      localStorage.setItem(REST_TIMER_KEY, String(newEnd));
      return newEnd;
    });
  }

  function doStartRestTimer(ei, si) {
    getAudioCtx(); // unlock audio on user gesture
    const endsAt = Date.now() + restDuration * 1000;
    localStorage.setItem(REST_TIMER_KEY, String(endsAt));
    localStorage.setItem(REST_TIMER_POS_KEY, JSON.stringify({ ei, si }));
    setRestEndsAt(endsAt);
    setRestSecondsLeft(restDuration);
    setRestActive(true);
    setRestTimerPosition({ ei, si });
  }

  // Unload Guard
  useEffect(() => {
    if (!session || done) return;
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [session, done]);

  // Ticking interval — runs only when a non-yoga session is active
  useEffect(() => {
    if (!session || session.isYoga || done) return;
    if (!startTimeRef.current) {
      startTimeRef.current = session.startTime || Date.now();
    }
    const tick = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }, 1000);
    return () => clearInterval(tick);
  }, [session, done]);

  const fmtElapsed = (secs) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    if (h > 0) return `${h}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
    return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  };

  useEffect(() => {
    if (!finishBtnRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => setShowFAB(!entry.isIntersecting),
      { threshold: 0.5 }
    );
    observer.observe(finishBtnRef.current);
    return () => observer.disconnect();
  }, [session]);

  const start = day => {
    workoutPageCache.trackerScroll = window.scrollY;
    if (day.type === 'yoga') {
      setSession({ day, isYoga: true });
      setDone(null);
      window.scrollTo({ top: 0, behavior: 'instant' });
      return;
    }
    const exs = day.exercises.map(ex => {
      // Cross-split: find the most recent log containing this exercise (any split, any day)
      const allNames = [ex.name, ...(ex.variants || [])];
      let prevEx = null;

      const sorted = [...workoutLogs]
        .filter(l => l.userId === user.id)
        .sort((a, b) => new Date(b.date) - new Date(a.date));

      for (const log of sorted) {
        for (const logEx of (log.exercises || [])) {
          if (allNames.some(n => n.toLowerCase() === logEx.name.toLowerCase())) {
            prevEx = logEx;
            break;
          }
        }
        if (prevEx) break;
      }

      // Feature 2: Apply cross-day swap if registered
      const swappedEx = getSwappedExercise(ex, activeSplit?.id, user.id);

      return {
        ...swappedEx,
        sv: prevEx?.name || (swappedEx.variants ? swappedEx.variants[0] : swappedEx.name),
        sets: Array.from({ length: ex.sets || 3 }, (_, i) => {
          const pSet = prevEx?.sets?.[i] ?? prevEx?.sets?.[prevEx.sets.length - 1];
          return {
            reps: '',
            weight: pSet ? String(pSet.weight) : '',
            done: false,
            targetRep: pSet ? String(pSet.reps) : (ex.repsRange || '8-12'),
          };
        }),
      };
    });
    const timestamp = Date.now();
    startTimeRef.current = timestamp;
    setSession({ day, exs, notes: '', startTime: timestamp });
    setDone(null);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const upd = (ei, si, f, v) => setSession(p => {
    const e = [...p.exs]; const s = [...e[ei].sets];
    s[si] = { ...s[si], [f]: f === 'done' ? v : v };
    e[ei] = { ...e[ei], sets: s };
    // Auto-start timer when marking set done
    if (f === 'done' && v) doStartRestTimer(ei, si);
    return { ...p, exs: e };
  });

  const addS = ei => setSession(p => { const e = [...p.exs]; const ls = e[ei].sets[e[ei].sets.length - 1]; e[ei] = { ...e[ei], sets: [...e[ei].sets, { ...ls, done: false }] }; return { ...p, exs: e }; });
  const rmS = (ei, si) => setSession(p => { const e = [...p.exs]; e[ei] = { ...e[ei], sets: e[ei].sets.filter((_, i) => i !== si) }; return { ...p, exs: e }; });
  const setV = (ei, v) => setSession(p => { const e = [...p.exs]; e[ei] = { ...e[ei], sv: v }; return { ...p, exs: e }; });

  const addExercise = useCallback((ex) => {
    setSession(prev => {
      if (!prev) return prev;
      const newEx = {
        id:              gId(),
        exerciseId:      ex.exerciseId || null,
        name:            ex.name,
        muscle:          ex.muscle || '',
        primaryMuscle:   ex.primaryMuscle || '',
        secondaryMuscles: ex.secondaryMuscles || [],
        repsRange:       ex.repsRange || '8-12',
        focusType:       ex.focusType || '',
        sets: Array.from({ length: ex.sets || 3 }, () => ({
          reps: '', weight: '', done: false,
          targetRep: ex.repsRange || '8-12',
        })),
        sv: null,
      };
      return { ...prev, exs: [...prev.exs, newEx] };
    });
    setAddExSearch('');
    setAddExCat('all');
    setShowAddEx(false);
  }, []);

  const removeExercise = useCallback((ei) => {
    if (restTimerPosition) {
      if (restTimerPosition.ei === ei) {
        setRestActive(false);
        setRestEndsAt(null);
        setRestTimerPosition(null);
        localStorage.removeItem(REST_TIMER_KEY);
        localStorage.removeItem(REST_TIMER_POS_KEY);
      } else if (restTimerPosition.ei > ei) {
        const shifted = { ...restTimerPosition, ei: restTimerPosition.ei - 1 };
        setRestTimerPosition(shifted);
        localStorage.setItem(REST_TIMER_POS_KEY, JSON.stringify(shifted));
      }
    }

    setSession(prev => {
      if (!prev) return prev;
      return { ...prev, exs: prev.exs.filter((_, i) => i !== ei) };
    });
    setConfirmRemoveIdx(null);
  }, [restTimerPosition]);

  useEffect(() => {
    if (confirmRemoveIdx === null) return;
    const timer = setTimeout(() => setConfirmRemoveIdx(null), 8000);
    return () => clearTimeout(timer);
  }, [confirmRemoveIdx]);

  const exercisePool = useMemo(() => {
    // Return a sorted copy of EXERCISE_LIBRARY excluding recovery/yoga poses
    const pool = EXERCISE_LIBRARY.filter(ex => ex.primaryMuscle !== null && ex.primaryMuscle !== 'recovery');
    
    return pool.sort((a, b) => {
      const pmA = a.muscle || '';
      const pmB = b.muscle || '';
      return pmA.localeCompare(pmB) || a.name.localeCompare(b.name);
    });
  }, []);

  const swapExercise = (exerciseIndex, newName) => {
    const lastSession = getLastSessionSets(workoutLogs, newName);
    const history = lastSession ? { weight: lastSession.sets[lastSession.sets.length - 1].weight, reps: lastSession.sets[lastSession.sets.length - 1].reps, date: lastSession.date } : null;

    setSession(prev => {
      const targetEx = prev.exs[exerciseIndex];
      if (!targetEx) return prev;

      const trueOriginal = targetEx._originalName || targetEx.originalName || targetEx.name;
      const originalId = targetEx.originalId || targetEx.exerciseId;
      const isRestoringOriginal = newName === trueOriginal;

      // Update swap registry for cross-day persistence
      if (isRestoringOriginal) {
        removeSwap(originalId, activeSplit?.id, user.id);
      } else {
        const libEntry = EXERCISE_LIBRARY.find(e => e.name === newName);
        const replacementId = libEntry ? libEntry.exerciseId : newName.toLowerCase().replace(/\s+/g, '-');
        registerSwap(originalId, trueOriginal, replacementId, newName, activeSplit?.id, user.id);
      }

      return {
        ...prev,
        exs: prev.exs.map((ex, i) => {
          if (i !== exerciseIndex) return ex;

          // Preserve the true original name so we can always swap back
          // Check both _originalName (in-session swap) and originalName (swap registry)
          const origVariants = ex._originalVariants || ex.variants || null;

          return {
            ...ex,
            sv: newName,
            name: newName, // Update the displayed name
            _originalName: trueOriginal, // Always keep the real original
            _originalVariants: origVariants,
            variants: isRestoringOriginal ? origVariants : null,
            _swapHistory: history ?? null,
            sets: ex.sets.map((set, si) => {
              if (set.done) return set;
              // Map set-by-set: use matching index, fall back to last historical set
              const histSet = lastSession
                ? (lastSession.sets[si] ?? lastSession.sets[lastSession.sets.length - 1])
                : null;
              return {
                ...set,
                weight: histSet ? String(histSet.weight) : '',
                reps:   histSet ? String(histSet.reps)   : '',
              };
            }),
          };
        }),
      };
    });
  };

  const finish = () => {
    const undoneCount = session.exs.reduce((acc, ex) => acc + ex.sets.filter(s => !s.done).length, 0);
    if (undoneCount > 0) {
      setConfirmFinish(true);
      return;
    }
    doFinish();
  };

  const doFinish = () => {
    setConfirmFinish(false);
    clearPersistedSession();
    startTimeRef.current = null;
    clearScrollPosition('/history');
    setElapsed(0);
    const endTimestamp = new Date().getTime();

    // Calculate new PRs before adding the log
    const newPRs = session.exs.map(ex => {
      const name = ex.sv || ex.name;
      const oldPR = getAllTimePR(workoutLogs, name);
      const sessionBest = Math.max(0, ...ex.sets.filter(s => s.done).map(s => parseFloat(s.weight) || 0));
      const sessionBestReps = ex.sets.filter(s => s.done && parseFloat(s.weight) === sessionBest).reduce((max, s) => Math.max(max, parseFloat(s.reps) || 0), 0);
      if (sessionBest > 0 || sessionBestReps > 0) { // Ensure there are actually completed sets
        if (beatsAllTimePR(oldPR, sessionBest, sessionBestReps)) {
          return { name, newWeight: sessionBest, oldWeight: oldPR?.weight ?? null, isBodyweight: sessionBest === 0, newReps: sessionBestReps, oldReps: oldPR?.reps ?? null };
        }
      }
      return null;
    }).filter(Boolean);

    const log = {
      id: gId(), userId: user.id, splitId: activeSplit.id, dayId: session.day.id, dayName: session.day.name, date: pastDate, notes: session.notes,
      durationMinutes: session.startTime ? Math.round((endTimestamp - session.startTime) / 60000) : null,
      exercises: session.exs.map(ex => ({
        name: ex.sv || ex.name,
        muscle: ex.muscle || null,
        primaryMuscle: ex.primaryMuscle || null,
        secondaryMuscles: ex.secondaryMuscles || [],
        sets: ex.sets.filter(s => s.done).map(s => ({ reps: parseFloat(s.reps) || 0, weight: parseFloat(s.weight) || 0 }))
      })).filter(ex => ex.sets.length > 0),
      _newPRs: newPRs
    };
    setWorkoutLogs(p => {
      const newLogs = [...p, log];
      syncUserXPToCache({ workoutLogs: newLogs, splits, user }).catch(console.warn);
      return newLogs;
    }); 
    setDone(log); skipRestTimer();
    addToast('Workout saved!', 'success');
  };


  return {
    user,
    splits,
    workoutLogs,
    setWorkoutLogs,
    addToast,
    nav,
    activeSplit,
    pastDate,
    setPastDate,
    session,
    setSession,
    done,
    setDone,
    persistedSession,
    setPersistedSession,
    confirmDiscard,
    setConfirmDiscard,
    swapTarget,
    setSwapTarget,
    showAddEx,
    setShowAddEx,
    addExSearch,
    setAddExSearch,
    addExCat,
    setAddExCat,
    confirmRemoveIdx,
    setConfirmRemoveIdx,
    prMap,
    restDuration,
    setRestDuration,
    restActive,
    setRestActive,
    restEndsAt,
    setRestEndsAt,
    restSecondsLeft,
    setRestSecondsLeft,
    restTimerPosition,
    setRestTimerPosition,
    confirmFinish,
    setConfirmFinish,
    wDays,
    finishBtnRef,
    showFAB,
    setShowFAB,
    startTimeRef,
    elapsed,
    setElapsed,
    handleRestDurationChange,
    skipRestTimer,
    extendRestTimer,
    doStartRestTimer,
    fmtElapsed,
    start,
    upd,
    addS,
    rmS,
    setV,
    addExercise,
    removeExercise,
    exercisePool,
    swapExercise,
    finish,
    doFinish,
  };
}
