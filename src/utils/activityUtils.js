export const calcStepsCalories = (steps, userWeightKg) => {
  // Using MET formula for moderate walking (3 mph = 3.5 METs)
  // Calories = (MET × 3.5 × weight_in_kg / 200) * duration_in_minutes
  // Assuming average of 100 steps per minute for moderate pace walking:
  // Calories = (3.5 × 3.5 × weight_in_kg / 200) * (steps / 100)
  // Which simplifies to: 0.0006125 * weight_in_kg * steps
  if (!userWeightKg || !steps) return 0;
  return Math.round(0.0006125 * userWeightKg * steps);
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
