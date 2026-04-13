export const calcStepsCalories = (steps, userWeightKg) => {
  // Average stride length: 0.762m for Indian men (~5'8"), 0.6858m for women (~5'4")
  // 1 kcal ≈ burned every 20 steps at moderate pace for 70kg person
  // MET for walking at 4 km/h = 3.0
  // This is an estimate — device data is always more accurate
  const kcalPer1000Steps = userWeightKg * 0.05; // approx
  return Math.round((steps / 1000) * kcalPer1000Steps);
};

export const getStepGoalPercent = (steps, goal = 10000) =>
  Math.min(100, Math.round((steps / goal) * 100));

export const formatSteps = (steps) =>
  steps >= 1000 ? `${(steps / 1000).toFixed(1)}k` : `${steps}`;

// Source priority selector for multi-source step logs
const SOURCE_PRIORITY = ['fitbit', 'strava', 'apple_health', 'browser_sensor', 'manual'];

export const getDisplayStepLog = (stepLogs, date) => {
  if (!stepLogs) return null;
  const todayLogs = stepLogs.filter(l => l.date === date);
  if (todayLogs.length === 0) return null;
  // Sort by source priority, then pick the first (highest priority)
  return todayLogs.sort((a, b) => 
    SOURCE_PRIORITY.indexOf(a.source) - SOURCE_PRIORITY.indexOf(b.source)
  )[0];
};

export const getSourceLabel = (source) => {
  const labels = {
    fitbit: '🔵 From Fitbit',
    strava: '🟣 From Strava',
    apple_health: '🍎 From Apple Health',
    browser_sensor: '📱 Browser sensor',
    manual: '✋ Manual entry',
  };
  return labels[source] || source;
};
