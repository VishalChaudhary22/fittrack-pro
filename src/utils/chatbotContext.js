// src/utils/chatbotContext.js

import { calcBMI, getBMICat, calcBMR, calcTDEE } from './calculations';
import { getOverallRank, MUSCLE_GROUPS, calcAllMuscleXP } from '../data/muscleData';
import { tod } from './helpers';

/**
 * Builds the dynamic system prompt for FORGE.
 * Called once when the chat panel opens.
 */
export function buildForgeSystemPrompt({
  user,
  workoutLogs,
  healthLogs,
  foodLog,
  readinessLog,
  splits,
  bodyFatLog,
}) {
  if (!user) return '';

  // ── Identity & Body Metrics ──────────────────────────────
  const sortedHealthLogs = [...healthLogs]
    .filter(l => l.userId === user.id)
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const latestWeight = sortedHealthLogs.at(-1)?.weight || user.weight || null;
  const weightStart30 = sortedHealthLogs.findLast(l =>
    new Date(l.date) <= new Date(Date.now() - 30 * 86400000)
  )?.weight || sortedHealthLogs[0]?.weight || latestWeight;

  const weightDelta = latestWeight && weightStart30
    ? +(latestWeight - weightStart30).toFixed(1) : null;
  const daysOfData = sortedHealthLogs.length > 1
    ? Math.ceil((new Date(sortedHealthLogs.at(-1).date) - new Date(sortedHealthLogs[0].date)) / 86400000)
    : 1;
  const weightDeltaPerWeek = weightDelta !== null
    ? +((weightDelta / Math.max(daysOfData, 7)) * 7).toFixed(2) : null;

  const bmi = latestWeight && user.height
    ? calcBMI(latestWeight, user.height) : null;
  const bmiCat = bmi ? getBMICat(bmi) : null;
  const bmr = user.weight && user.height && user.age
    ? calcBMR(user.weight, user.height, user.age, user.gender) : null;
  const tdee = bmr ? calcTDEE(bmr, user.activity) : null;

  const goalDescription = user.weightGoal
    ? (latestWeight > user.weightGoal ? 'Fat Loss' : 'Muscle Gain / Bulk')
    : 'Maintenance';

  // ── Weight Progress Text ─────────────────────────────────
  let weightGoalProgress = 'No weight goal set.';
  if (user.weightGoal && latestWeight) {
    const remaining = +(latestWeight - user.weightGoal).toFixed(1);
    const direction = remaining > 0 ? 'to lose' : 'to gain';
    weightGoalProgress = `${Math.abs(remaining)}kg ${direction} to reach goal.`;
    if (user.goalWeeks && user.goalSetDate) {
      const elapsed = Math.ceil((Date.now() - new Date(user.goalSetDate)) / 604800000);
      weightGoalProgress += ` ${elapsed} of ${user.goalWeeks} weeks elapsed.`;
    }
  }

  // ── Recent Workouts (last 10) ────────────────────────────
  const userWorkouts = workoutLogs
    .filter(l => l.userId === user.id)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 10);

  const workoutHistorySummary = userWorkouts.length === 0
    ? 'No workouts logged yet.'
    : userWorkouts.map(log => {
        const exStr = (log.exercises || []).map(ex => {
          const setStr = (ex.sets || [])
            .filter(s => s.done || s.reps)
            .map(s => `${s.reps || '?'}×${s.weight || 0}kg`)
            .join(', ');
          return `${ex.name} (${setStr})`;
        }).join(' | ');
        return `${log.date} — ${log.dayName}: ${exStr}`;
      }).join('\n');

  // ── Personal Records per exercise ───────────────────────
  const prMap = {};
  workoutLogs
    .filter(l => l.userId === user.id)
    .forEach(log => {
      (log.exercises || []).forEach(ex => {
        (ex.sets || []).forEach(s => {
          if (!s.weight || !s.reps) return;
          const est1rm = +(s.weight * (1 + s.reps / 30)).toFixed(1);
          if (!prMap[ex.name] || est1rm > prMap[ex.name].est1rm) {
            prMap[ex.name] = { weight: s.weight, reps: s.reps, est1rm, date: log.date };
          }
        });
      });
    });

  const prSummary = Object.keys(prMap).length === 0
    ? 'No PRs recorded yet.'
    : Object.entries(prMap)
        .sort((a, b) => b[1].est1rm - a[1].est1rm)
        .slice(0, 15) // top 15 exercises
        .map(([name, pr]) =>
          `${name}: ${pr.weight}kg × ${pr.reps} reps (est. 1RM: ${pr.est1rm}kg) on ${pr.date}`)
        .join('\n');

  // ── Active Split ─────────────────────────────────────────
  const allSplits = splits || [];
  const activeSplit = allSplits.find(s => s.id === user.activeSplitId);
  const splitSummary = activeSplit
    ? `${activeSplit.name} — ${(activeSplit.schedule || []).join(' → ')}\n` +
      (activeSplit.days || []).map(d =>
        `  ${d.name}: ${(d.exercises || []).map(e => e.name).join(', ')}`
      ).join('\n')
    : 'No active split selected.';

  // ── Today's Food Log ─────────────────────────────────────
  const today = tod();
  const todayFood = (foodLog || []).filter(e =>
    (e.userId === user.id || e.user_id === user.id) &&
    (e.date === today || e.logDate === today)
  );
  // IMPORTANT: Food log entries store macros under a nested `macros` object
  // (e.g. entry.macros.calories, entry.macros.protein) — NOT at the top level.
  // This matches DietPage.jsx's todayTotals reducer pattern.
  const todayCals = todayFood.reduce((s, e) => s + (e.macros?.calories || e.calories || 0), 0);
  const todayProtein = todayFood.reduce((s, e) => s + (e.macros?.protein || e.protein || 0), 0);
  const todayCarbs = todayFood.reduce((s, e) => s + (e.macros?.carbs || e.carbs || 0), 0);
  const todayFat = todayFood.reduce((s, e) => s + (e.macros?.fat || e.fat || 0), 0);

  const mealSlots = ['Breakfast', 'Mid-Morning', 'Lunch', 'Pre-Workout', 'Post-Workout Dinner', 'Before Bed'];
  const mealSummary = mealSlots.map(slot => {
    const entries = todayFood.filter(e => e.slot === slot || e.mealType === slot);
    if (entries.length === 0) return null;
    const names = entries.map(e => e.foodName || e.name || 'item').join(', ');
    const kcal = entries.reduce((s, e) => s + (e.calories || 0), 0);
    return `  ${slot}: ${names} (${Math.round(kcal)} kcal)`;
  }).filter(Boolean).join('\n') || '  Nothing logged yet today.';

  // Macro targets — mirrors DietPage.jsx exactly (lines 160-177)
  const isLoss = user.weightGoal && latestWeight && user.weightGoal < latestWeight;
  const isGain = user.weightGoal && latestWeight && user.weightGoal > latestWeight;
  const goal = isLoss ? 'loss' : isGain ? 'gain' : 'maintenance';
  const computedGoalKcal = tdee
    ? Math.round(isLoss ? tdee - 500 : isGain ? tdee + 400 : tdee)
    : null;
  // customGoalKcal takes priority — same as DietPage line 167
  const goalKcal = user.customGoalKcal || computedGoalKcal;
  const baseWeight = (isLoss && user.weightGoal) ? user.weightGoal : (latestWeight || user.weight);
  // DietPage uses 2.0 for heavy cut (5+ days), 1.8 otherwise — simplified here
  const isHeavyCut = (user.workoutDays || 0) >= 5 && goal === 'loss';
  const protMultiplier = isHeavyCut ? 2.0 : 1.8;
  const targetProtein = user.customProteinG || (baseWeight
    ? Math.round(baseWeight * protMultiplier) : null);

  // ── Readiness ─────────────────────────────────────────────
  const todayReadiness = (readinessLog || [])
    .filter(r => (r.userId === user.id || r.user_id === user.id) && r.date === today && r.checkInComplete)
    .sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0))[0];

  const readinessSection = todayReadiness
    ? `Today's Score: ${todayReadiness.score}/100 (${
        todayReadiness.score >= 80 ? 'Optimal' :
        todayReadiness.score >= 60 ? 'Good' :
        todayReadiness.score >= 40 ? 'Moderate' : 'Low — consider rest'
      })
Sleep: ${todayReadiness.sleepHours || '?'}hrs | Energy: ${todayReadiness.energyLevel || '?'}/5
Soreness: ${todayReadiness.sorenessLevel || 'unknown'} | Stress: ${todayReadiness.stressLevel || 'unknown'}`
    : 'No check-in today yet.';

  // ── Olympus League ────────────────────────────────────────
  const muscleXP = calcAllMuscleXP(workoutLogs, splits, user.id);
  const overallRank = getOverallRank(muscleXP);
  const sortedMuscles = MUSCLE_GROUPS
    .map(m => ({ ...m, xp: muscleXP[m.key] || 0 }))
    .sort((a, b) => b.xp - a.xp);
  const strongest = sortedMuscles[0];
  const weakest = sortedMuscles.at(-1);

  // ── Body Fat ─────────────────────────────────────────────
  const userBF = (bodyFatLog || [])
    .filter(e => e.userId === user.id || e.user_id === user.id)
    .sort((a, b) => new Date(b.date) - new Date(a.date));
  const latestBF = userBF[0];
  const prevBF = userBF[1];
  const bfSection = latestBF
    ? `Latest BF%: ${latestBF.percentage}% (${latestBF.method || 'logged'}) on ${latestBF.date}
BF% change vs previous: ${prevBF ? `${+(latestBF.percentage - prevBF.percentage).toFixed(1)}%` : 'only 1 entry'}
Goal BF%: ${user.bodyFatGoal || 'not set'}`
    : 'No body fat entries logged yet.';

  // ── Build Final Prompt ────────────────────────────────────
  return `You are FORGE, the AI fitness coach inside FitTrack Pro — a premium Indian fitness tracking app. You are like a knowledgeable personal trainer who has full access to this user's training history, diet logs, and body metrics. You are direct, motivating, and evidence-based. IMPORTANT: Always match the user's language exactly — if they write in English, reply fully in English. Only use Hinglish if the user writes in Hinglish first. Never default to Hinglish or Hindi. You never make up numbers about the user's data — only cite what is in this prompt. Keep responses concise but complete — aim for 150–300 words.

════════════════════════════
USER PROFILE
════════════════════════════
Name: ${user.name} | Age: ${user.age || '?'} | Gender: ${user.gender || '?'}
Height: ${user.height || '?'}cm | Weight: ${latestWeight || '?'}kg
Goal: ${goalDescription}${user.weightGoal ? ` → Target: ${user.weightGoal}kg` : ''}
Diet: ${user.dietType || 'not set'} | Training: ${user.workoutDays || '?'} days/week
BMI: ${bmi ? `${bmi} (${bmiCat?.label || '?'})` : 'unknown'}
TDEE: ${tdee ? `~${Math.round(tdee)} kcal/day` : 'unknown'}

════════════════════════════
ACTIVE SPLIT
════════════════════════════
${splitSummary}

════════════════════════════
RECENT WORKOUTS (last 10 sessions)
════════════════════════════
${workoutHistorySummary}

════════════════════════════
PERSONAL RECORDS
════════════════════════════
${prSummary}

════════════════════════════
WEIGHT TREND (last 30 days)
════════════════════════════
Start: ${weightStart30 || '?'}kg | Now: ${latestWeight || '?'}kg
Change: ${weightDelta !== null ? `${weightDelta > 0 ? '+' : ''}${weightDelta}kg` : '?'} (${weightDeltaPerWeek !== null ? `${weightDeltaPerWeek > 0 ? '+' : ''}${weightDeltaPerWeek}kg/week` : '?'}/week)
${weightGoalProgress}

════════════════════════════
BODY COMPOSITION
════════════════════════════
${bfSection}

════════════════════════════
TODAY'S NUTRITION (${today})
════════════════════════════
Logged: ${Math.round(todayCals)} kcal${goalKcal ? ` / ${goalKcal} kcal target` : ''}
Protein: ${Math.round(todayProtein)}g${targetProtein ? ` / ${targetProtein}g target` : ''} | Carbs: ${Math.round(todayCarbs)}g | Fat: ${Math.round(todayFat)}g
Meals:
${mealSummary}

════════════════════════════
READINESS TODAY
════════════════════════════
${readinessSection}

════════════════════════════
OLYMPUS LEAGUE
════════════════════════════
Rank: ${overallRank.name} (${overallRank.totalXP.toLocaleString()} XP)
Strongest: ${strongest.label} (${strongest.xp.toLocaleString()} XP)
Needs work: ${weakest.label} (${weakest.xp.toLocaleString()} XP)

════════════════════════════
RULES
════════════════════════════
1. Only cite numbers present in this prompt. Never invent workout data.
2. Injury questions: give safe modifications + always end with "See a physio for persistent pain."
3. Diet: prioritise Indian foods (dal, paneer, eggs, chicken, curd, roti, rice).
4. Supplements: recommend Indian brands first (MuscleBlaze, AS-IT-IS, NAKPRO, Nutrabay) with ₹/kg price context.
5. For "what did I do last time on X" — scan Recent Workouts above and quote exact numbers and date.
6. For plateau advice — look at last 4 sessions of that exercise. If weight hasn't changed, suggest deload or variation.
7. Keep responses under 200 words by default. Expand only when asked.
8. Respond in Hinglish if the user writes in Hinglish.
9. Always end injury/rehab advice with a safety note.`;
}

/**
 * Builds the conversation history array for the Gemini API
 * (last 20 messages to stay within token budget).
 */
export function buildConversationHistory(messages) {
  return messages
    .slice(-20) // last 20 msgs (~8000 tokens typical)
    .map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));
}
