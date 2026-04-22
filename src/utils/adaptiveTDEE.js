import { computeWeeklyRate } from './adaptiveCalories';
import { calcTDEE } from './calculations';
import { getCyclePhase } from './cycleCalculations';

export const WINDOW_DAYS = {
  short: 7,
  medium: 14,
  long: 28,
};

/**
 * Aggregates daily food intake from individual food log entries.
 * @param {Array} foodLogs 
 * @param {Date} startDate 
 * @param {Date} endDate 
 * @returns {Object} map of 'YYYY-MM-DD' => totalKcal
 */
export function aggregateDailyIntake(foodLogs, startDate, endDate) {
  const dailyMap = {}; 
  for (const entry of foodLogs) {
    if (!entry.date) continue;
    const entryDate = new Date(entry.date);
    if (entryDate < startDate || entryDate > endDate) continue;
    
    const cals = entry.macros?.calories || 0;
    if (cals <= 0) continue;
    
    dailyMap[entry.date] = (dailyMap[entry.date] || 0) + cals;
  }
  return dailyMap;
}

/**
 * Calculates confidence score
 */
export function scoreConfidence({ loggedDays, weightEntries, calorieVarianceKcal, windowDays }) {
  let score = 0;

  if (weightEntries < 2) return 'insufficient'; // Can't compute ΔW
  if (loggedDays < 4) return 'insufficient'; // Not enough intake data
  if (windowDays < 7) return 'insufficient'; // Window too short

  const coverageRatio = loggedDays / windowDays;
  if (coverageRatio >= 0.85) score += 40;
  else if (coverageRatio >= 0.65) score += 25;
  else if (coverageRatio >= 0.45) score += 10;

  if (weightEntries >= 4) score += 30;
  else if (weightEntries >= 2) score += 20;

  if (calorieVarianceKcal < 200) score += 30;
  else if (calorieVarianceKcal < 400) score += 20;
  else if (calorieVarianceKcal < 600) score += 10;

  if (score >= 80) return 'high';
  if (score >= 50) return 'medium';
  if (score >= 25) return 'low';
  return 'insufficient';
}

/**
 * Infers if estimated TDEE suggests a different activity level
 */
export function inferActivityLevelMismatch(estimatedTDEE, profile, bmr) {
  if (!bmr) return null;
  const ratio = estimatedTDEE / bmr;
  
  let inferredLabel = 'Sedentary';
  if (ratio >= 1.82) inferredLabel = 'Extremely Active (athlete)';
  else if (ratio >= 1.65) inferredLabel = 'Very Active (6–7 days/week)';
  else if (ratio >= 1.48) inferredLabel = 'Moderately Active (3–5 days/week)';
  else if (ratio >= 1.30) inferredLabel = 'Lightly Active (1–3 days/week)';
  
  const currentActivityLevel = profile?.activityLevel || 'sedentary';
  
  const ACTIVITY = {
    sedentary: 'Sedentary (no exercise)',
    light: 'Lightly Active (1–3 days/week)',
    moderate: 'Moderately Active (3–5 days/week)',
    active: 'Very Active (6–7 days/week)',
    extra: 'Extremely Active (athlete)',
  };

  const currentLabel = ACTIVITY[currentActivityLevel] || 'Sedentary (no exercise)';
  
  const staticTDEE = calcTDEE(bmr, currentActivityLevel);
  
  if (estimatedTDEE > staticTDEE * 1.08 && inferredLabel !== currentLabel) {
    return {
      type: 'activity-level-mismatch',
      currentActivityLabel: currentLabel,
      suggestedLabel: inferredLabel
    };
  }
  return null;
}

/**
 * Core engine estimate func
 */
export function estimateTDEE(weightLogs = [], foodLogs = [], profile = {}, windowType = 'medium') {
  const windowDays = WINDOW_DAYS[windowType] || 14;
  
  const now = new Date();
  const startDate = new Date(now);
  startDate.setDate(now.getDate() - windowDays);

  const staticTDEE = profile.tdee || calcTDEE(profile.bmr || 2000, profile.activityLevel || 'sedentary');

  // 1. Weight regression
  const { rateKgPerWeek, logsUsed: weightEntries } = computeWeeklyRate(weightLogs, windowDays);
  
  // weightDelta (negative for loss)
  const weightDelta = rateKgPerWeek * (windowDays / 7);

  // 2. Aggregate Intake
  const dailyIntakeMap = aggregateDailyIntake(foodLogs, startDate, now);
  const intakeValues = Object.values(dailyIntakeMap);
  const loggedDays = intakeValues.length;

  if (loggedDays === 0 || weightEntries < 2) {
    return { confidence: 'insufficient', insights: [] };
  }

  const sumIntake = intakeValues.reduce((a, b) => a + b, 0);
  const avgDailyIntake = sumIntake / loggedDays;

  // variance
  const varianceSum = intakeValues.reduce((acc, val) => acc + Math.pow(val - avgDailyIntake, 2), 0);
  const calorieVarianceKcal = Math.sqrt(varianceSum / loggedDays) || 0;

  // TDEE = avgIntake - (weightDelta * 7700 / windowDays)
  // weightDelta = endWeight - startWeight (negative for loss)
  // So for weight loss: TDEE = avgIntake - (negative * 7700 / N) = avgIntake + |deficit|
  let estimatedTDEE = avgDailyIntake - (weightDelta * 7700 / windowDays);
  
  let confidence = scoreConfidence({ loggedDays, weightEntries, calorieVarianceKcal, windowDays });
  let notes = [];

  // Clamp limits
  if (estimatedTDEE < 800) {
    estimatedTDEE = 800;
    confidence = 'low';
    notes.push('physiological floor applied');
  } else if (estimatedTDEE > 6000) {
    estimatedTDEE = 6000;
    confidence = 'low';
    notes.push('physiological cap applied');
  }

  // Menstrual cycle water retention penalty
  if (profile.gender === 'female' && profile.lastCycleStart) {
    const cycleData = getCyclePhase(profile.lastCycleStart, profile.cycleLength || 28);
    // Rough check if currently in luteal. A fuller check would iterate through the last 14 days
    if (cycleData && cycleData.phase === 'Luteal' && confidence === 'high') {
       confidence = 'medium';
       notes.push('Weight may be elevated from water retention');
    }
  }

  const delta = Math.round(estimatedTDEE - staticTDEE);
  const deltaPercent = (delta / staticTDEE) * 100;

  const insights = [];
  if (confidence === 'high' || confidence === 'medium') {
    if (deltaPercent >= 8) {
      insights.push({ type: 'tdee-higher-than-static', delta, deltaPercent, confidence });
    } else if (deltaPercent <= -8) {
      insights.push({ type: 'tdee-lower-than-static', delta, deltaPercent, confidence });
    }
    
    if (profile.bmr) {
      const match = inferActivityLevelMismatch(estimatedTDEE, profile, profile.bmr);
      if (match) insights.push(match);
    }
  }

  return {
    windowDays,
    windowStart: startDate.toISOString().split('T')[0],
    windowEnd: now.toISOString().split('T')[0],
    avgDailyIntake: Math.round(avgDailyIntake),
    weightDelta: Number(weightDelta.toFixed(2)),
    estimatedTDEE: Math.round(estimatedTDEE),
    staticTDEE,
    delta,
    deltaPercent: Number(deltaPercent.toFixed(1)),
    confidence,
    loggedDays,
    weightEntries,
    calorieVarianceKcal: Math.round(calorieVarianceKcal),
    insights,
    metabolicAdaptation: false,
    notes: notes.join(', '),
    updatedAt: new Date().toISOString()
  };
}

export function getBestTDEE(weightLogs, foodLogs, profile, manualTDEEOverride = null) {
  if (manualTDEEOverride) {
    return { value: manualTDEEOverride, source: 'manual', confidence: 'manual' };
  }
  
  const estimate = estimateTDEE(weightLogs, foodLogs, profile, 'medium');
  
  // If useEstimatedTDEE is explicitly accepted, any medium/high confidence works
  if (profile.useEstimatedTDEE && (estimate.confidence === 'high' || estimate.confidence === 'medium')) {
    return { value: estimate.estimatedTDEE, source: 'estimated', confidence: estimate.confidence, estimate };
  }

  // Auto-apply only if high confidence
  if (estimate.confidence === 'high') {
    return { value: estimate.estimatedTDEE, source: 'estimated', confidence: estimate.confidence, estimate };
  }
  
  const staticTDEE = profile.tdee || calcTDEE(profile.bmr || 2000, profile.activityLevel || 'sedentary');
  return { value: staticTDEE, source: 'static', confidence: null, estimate };
}

export function detectMetabolicAdaptation(estimateHistory = [], profile) {
  if (!estimateHistory || estimateHistory.length < 6) {
    return { detected: false, deficitWeeks: 0, adaptationPercent: 0 };
  }
  
  // Must be sorted oldest to newest. Let's assume estimateHistory is already so, 
  // but let's grab the last 6 weeks
  const recent6 = estimateHistory.slice(-6);
  
  let deficitWeeks = 0;
  for (let i = recent6.length - 1; i >= 0; i--) {
     if (recent6[i].avgIntake < recent6[i].estimatedTDEE) {
        deficitWeeks++;
     } else {
        break; // Chain broken
     }
  }

  if (deficitWeeks >= 6) {
     const oldest = recent6[0].estimatedTDEE;
     const newest = recent6[recent6.length - 1].estimatedTDEE;
     if (newest <= oldest * 0.90) {
        return {
           detected: true,
           deficitWeeks,
           adaptationPercent: Math.round(((oldest - newest) / oldest) * 100)
        };
     }
  }

  return { detected: false, deficitWeeks, adaptationPercent: 0 };
}
