// ─── CONSTANTS ────────────────────────────────────────────────

export const READINESS_TIERS = [
  { min: 80, label: 'Optimal',  color: '#4ADE80', message: "Go heavy. This is your window." },
  { min: 60, label: 'Good',     color: '#FBBF24', message: "Solid session. Moderate intensity." },
  { min: 40, label: 'Moderate', color: '#F85F1B', message: "Light session or active recovery." },
  { min: 0,  label: 'Low',      color: '#F87171', message: "Rest day. Your body is building." },
];

export const getTier = (score) =>
  READINESS_TIERS.find(t => score >= t.min) ?? READINESS_TIERS[READINESS_TIERS.length - 1];

// ⚠️ GAP-G5: Labels below must match the display names used in MUSCLE_GROUPS (muscleData.js).
// muscleData.js uses `back: 'Back'` and `abs: 'Abs'` — align these or users will see
// different names for the same muscle group on different pages.
// CORRECTED values below (matching muscleData.js MUSCLE_GROUPS):
export const MUSCLE_LABELS = {
  chest: 'Chest', back: 'Back', shoulders: 'Deltoids',
  biceps: 'Biceps', triceps: 'Triceps', traps: 'Traps',
  quads: 'Quads', hamstrings: 'Hamstrings', glutes: 'Glutes',
  calves: 'Calves', abs: 'Abs', forearms: 'Forearms',
};

export const STATUS_COLORS = {
  optimal:  '#4ADE80',
  fatigued: '#FBBF24',
  critical: '#F87171',
};


// ─── MUSCLE RECOVERY STATUS ────────────────────────────────────
// Returns: { [muscleKey]: { status, hoursSince, label } }
// Uses the same 3-priority fallback chain as calcAllMuscleXP.
// Does NOT modify any existing util — this is a new standalone fn.

export function getMuscleRecoveryStatuses(workoutLogs, splits, userId) {
  const now = new Date();

  // Build exercise→primaryMuscle lookup from splits
  const exPrimaryMap = {};
  splits.forEach(split =>
    split.days?.forEach(day =>
      day.exercises?.forEach(ex => {
        if (ex.primaryMuscle && ex.name) exPrimaryMap[ex.name] = ex.primaryMuscle;
      })
    )
  );

  // Filter and sort user logs newest-first
  const userLogs = [...workoutLogs]
    .filter(l => l.userId === userId)
    .sort((a, b) => b.date.localeCompare(a.date));

  // Find most recent training date per muscle
  const lastTrainedMs = {}; // muscleKey → timestamp (ms)

  for (const log of userLogs) {
    const logTime = new Date(log.date + 'T00:00:00').getTime();
    for (const ex of (log.exercises || [])) {
      const completedSets = (ex.sets || []).filter(s => s.done !== false && s.reps > 0);
      if (completedSets.length === 0) continue;

      // Priority 1: split-based lookup
      // Priority 2: log exercise's own primaryMuscle field
      // Priority 3: log exercise's own muscle field (display name) — skip for now (label-only)
      const primary = exPrimaryMap[ex.name] || ex.primaryMuscle || null;
      if (primary && !lastTrainedMs[primary]) {
        lastTrainedMs[primary] = logTime;
      }
      for (const sec of (ex.secondaryMuscles || [])) {
        if (!lastTrainedMs[sec]) lastTrainedMs[sec] = logTime;
      }
    }
  }

  // Build status objects for all 12 muscle keys
  const ALL_MUSCLES = Object.keys(MUSCLE_LABELS);
  const result = {};

  for (const muscle of ALL_MUSCLES) {
    const lastMs = lastTrainedMs[muscle];
    if (!lastMs) {
      result[muscle] = { status: 'optimal', hoursSince: null, label: 'Fresh' };
      continue;
    }
    const hoursSince = (now.getTime() - lastMs) / 3600000;
    let status, label;
    if (hoursSince < 24) {
      status = 'critical';
      label = `${Math.round(hoursSince)}h Rest`;
    } else if (hoursSince < 48) {
      status = 'fatigued';
      label = `${Math.round(hoursSince)}h Rest`;
    } else {
      status = 'optimal';
      label = 'Optimal';
    }
    result[muscle] = { status, hoursSince, label };
  }

  return result;
}


// ─── OBJECTIVE READINESS (from training data only) ────────────
// 0–100 score based purely on workout history.
// Called even when check-in hasn't been completed.

export function calcObjectiveReadiness(workoutLogs, stepLogs, user) {
  const userId = user?.id;
  const now = new Date();

  const userLogs = workoutLogs.filter(l => l.userId === userId);
  const userSteps = (stepLogs || []).filter(l => l.user_id === userId || l.userId === userId);

  const logVolume = (log) =>
    (log.exercises || []).reduce((t, ex) =>
      t + (ex.sets || []).reduce((s, set) =>
        s + (set.reps || 0) * Math.max(set.weight || 0, 0), 0), 0);

  // 7-day rolling average (baseline)
  const d7Ago = new Date(now); d7Ago.setDate(d7Ago.getDate() - 7);
  const weekLogs = userLogs.filter(l =>
    new Date(l.date + 'T00:00:00') >= d7Ago
  );
  const avgDailyVol = weekLogs.length > 0
    ? weekLogs.reduce((t, l) => t + logVolume(l), 0) / 7
    : 0;

  // Last 3 days volume
  const d3Ago = new Date(now); d3Ago.setDate(d3Ago.getDate() - 3);
  const recentLogs = userLogs.filter(l =>
    new Date(l.date + 'T00:00:00') >= d3Ago
  );
  const recentVol = recentLogs.reduce((t, l) => t + logVolume(l), 0);

  // Load ratio: how hard were the last 3 days vs weekly baseline?
  const loadRatio = avgDailyVol > 0
    ? recentVol / (avgDailyVol * 3)
    : recentLogs.length > 0 ? 1.0 : 0.3; // 0.3 = fresh/new user

  // Load → base score
  let loadScore;
  if (loadRatio > 1.5)      loadScore = 38;
  else if (loadRatio > 1.2) loadScore = 58;
  else if (loadRatio > 0.9) loadScore = 72;
  else if (loadRatio > 0.5) loadScore = 86;
  else                      loadScore = 95; // well rested

  // Rest gap bonus
  const latestLog = [...userLogs].sort((a, b) => b.date.localeCompare(a.date))[0];
  let restBonus = 0;
  if (!latestLog) {
    restBonus = 10; // never trained → fresh
  } else {
    const daysSince = Math.floor(
      (now - new Date(latestLog.date + 'T00:00:00')) / 86400000
    );
    if (daysSince === 0)      restBonus = 0;   // trained today
    else if (daysSince === 1) restBonus = 4;   // trained yesterday
    else if (daysSince === 2) restBonus = 8;   // 1 rest day (ideal)
    else                      restBonus = 4;   // 2+ rest days (slight detrain offset)
  }

  // Overtraining penalty (6+ sessions in 7 days)
  const penalty = weekLogs.length >= 6 ? 14 : weekLogs.length >= 5 ? 6 : 0;

  // Active recovery bonus from steps (or fatigue from extreme steps)
  const stepGoal = user?.stepGoal || 10000;
  const recentStepLogs = userSteps.filter(l => new Date((l.date || '') + 'T00:00:00') >= d3Ago);
  const avgRecentSteps = recentStepLogs.length > 0 
    ? recentStepLogs.reduce((acc, l) => acc + (l.steps || 0), 0) / recentStepLogs.length 
    : 0;
    
  let stepFactor = 0;
  if (avgRecentSteps > stepGoal * 1.5) stepFactor = -8; // Fatigue from excessive walking
  else if (avgRecentSteps > stepGoal * 0.5) stepFactor = 5; // Light active recovery

  return {
    score: Math.round(Math.min(100, Math.max(0, loadScore + restBonus - penalty + stepFactor))),
    loadRatio,
  };
}


// ─── FULL SCORE (objective + check-in) ────────────────────────

export function calcReadinessScore(checkIn, objectiveScore) {
  // Sleep: 4–10h mapped to 0–100
  const sleepScore = (() => {
    const h = checkIn.sleepHours;
    if (h >= 8) return 100;
    if (h >= 7) return 88;
    if (h >= 6) return 68;
    if (h >= 5) return 44;
    return 20;
  })();

  // Energy: 1–5 → 0–100
  const energyScore = (checkIn.energyLevel - 1) * 25;

  // Soreness
  const sorenessScore = { none: 100, mild: 60, significant: 25 }[checkIn.sorenessLevel] ?? 60;

  // Stress
  const stressScore = { low: 100, medium: 62, high: 28 }[checkIn.stressLevel] ?? 62;

  // Weighted subjective blend
  const subjective =
    sleepScore    * 0.35 +
    energyScore   * 0.30 +
    sorenessScore * 0.20 +
    stressScore   * 0.15;

  // 40% objective (training history) + 60% subjective (check-in feelings)
  return Math.round(Math.min(100, Math.max(0, objectiveScore * 0.40 + subjective * 0.60)));
}


// ─── SPOTLIGHT MUSCLES (for the bottom chips) ─────────────────
// Returns 3–4 muscles worth showing in the widget.
// Priority: Critical first, then Fatigued, then one Optimal muscle.

export function getSpotlightMuscles(muscleStatuses, limit = 4) {
  const all = Object.entries(muscleStatuses)
    .map(([key, val]) => ({ key, ...val }));

  const critical = all.filter(m => m.status === 'critical');
  const fatigued = all.filter(m => m.status === 'fatigued');
  // Pick one fresh muscle (the most recently trained that is now optimal, or just any)
  const optimal = all
    .filter(m => m.status === 'optimal' && m.hoursSince !== null)
    .sort((a, b) => a.hoursSince - b.hoursSince) // most recently recovered first
    .slice(0, 1);

  const combined = [...critical, ...fatigued, ...optimal].slice(0, limit);

  // If nothing was ever trained (all "Fresh"), show top 3 muscle groups as Fresh
  if (combined.length === 0) {
    return all.slice(0, 3);
  }

  return combined;
}
