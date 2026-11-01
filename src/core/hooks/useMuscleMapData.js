import { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { calcAllMuscleXP } from '../../data/muscleData';
import { getMuscleRecoveryStatuses } from '../../utils/readinessUtils';
import { tod } from '../../utils/helpers';

// ─── Muscle-map day data (the Quest plan's ONE core extension, §7.4) ─────────
// Stored XP is cumulative-only, so "what did I train today" needs its own
// pass over the raw logs:
//   todayXP     — XP earned TODAY per muscle, from the same calcAllMuscleXP
//                 engine that produces the cumulative totals (today's logs
//                 only), so the numbers always reconcile with History.
//   todaySets   — completed sets today per muscle (primary attribution,
//                 the exercise→primaryMuscle chain readiness uses).
//   lastTrained — most recent training date per muscle (primary + secondary
//                 attribution, matching getMuscleRecoveryStatuses).
//   recovery    — getMuscleRecoveryStatuses, re-exported for convenience.
// V1/Volt ignore this hook; Quest's body map is its first consumer.

export function computeTodayMuscle(workoutLogs, splits, userId, todayStr = tod()) {
  const userLogs = (workoutLogs || []).filter(l => l.userId === userId);
  const todayLogs = userLogs.filter(l => l.date === todayStr);
  const todayXP = todayLogs.length ? calcAllMuscleXP(todayLogs, splits, userId) : {};

  // exercise name → primary muscle, from the splits (readiness' chain)
  const exPrimaryMap = {};
  (splits || []).forEach(split =>
    split.days?.forEach(day =>
      day.exercises?.forEach(ex => {
        if (ex.primaryMuscle && ex.name) exPrimaryMap[ex.name] = ex.primaryMuscle;
      })
    )
  );
  const primaryOf = (ex) => exPrimaryMap[ex.name] || ex.primaryMuscle || null;
  const completed = (ex) => (ex.sets || []).filter(s => s.done !== false && s.reps > 0);

  const todaySets = {};
  for (const log of todayLogs) {
    for (const ex of (log.exercises || [])) {
      const primary = primaryOf(ex);
      const n = completed(ex).length;
      if (primary && n > 0) todaySets[primary] = (todaySets[primary] || 0) + n;
    }
  }

  const lastTrained = {};
  const sorted = [...userLogs].sort((a, b) => b.date.localeCompare(a.date));
  for (const log of sorted) {
    for (const ex of (log.exercises || [])) {
      if (completed(ex).length === 0) continue;
      const primary = primaryOf(ex);
      if (primary && !lastTrained[primary]) lastTrained[primary] = log.date;
      for (const sec of (ex.secondaryMuscles || [])) {
        if (!lastTrained[sec]) lastTrained[sec] = log.date;
      }
    }
  }

  return { todayXP, todaySets, lastTrained };
}

export function useMuscleMapData() {
  const { user, splits, workoutLogs } = useApp();

  const { todayXP, todaySets, lastTrained } = useMemo(
    () => computeTodayMuscle(workoutLogs, splits, user?.id),
    [workoutLogs, splits, user?.id]
  );
  const recovery = useMemo(
    () => getMuscleRecoveryStatuses(workoutLogs, splits, user?.id),
    [workoutLogs, splits, user?.id]
  );

  return { todayXP, todaySets, lastTrained, recovery };
}
