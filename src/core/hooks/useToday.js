// ─── useToday ────────────────────────────────────────────────────────────────
// All data logic for the Today screen, extracted from the V1 DashboardPage
// (Kaaya Volt V-1) so both skins render the same brain. The V1 page is a
// pure consumer; Volt's Today page will consume this identically.
import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { calcBMI, getBMICat, calcBMR, calcTDEE, calcDeficit } from '../../utils/calculations';
import { gId, tod, fmt, clamp, mkWtItems, mkIntItems, kgToLbs, mkWtItemsImperial } from '../../utils/helpers';
import { getCyclePhase } from '../../utils/cycleCalculations';
import { getActiveFestival } from '../../utils/festivals';
import { calcObjectiveReadiness, getMuscleRecoveryStatuses, getTier, getSpotlightMuscles } from '../../utils/readinessUtils';
import { calcWorkoutCalories, calcCardioCalories } from '../../data/metValues';
import { getStepGoalPercent, getDisplayStepLog } from '../../utils/activityUtils';
import { usePedometer } from './usePedometer';
import { clearScrollPosition } from './useScrollRestoration';

export function useToday() {
  const navigate = useNavigate();
  const { user, dataLoaded, healthLogs, setHealthLogs, workoutLogs, splits, updateProfile, addToast, getStreak, readinessLog, foodLog, waterLog, cycleConfig, stepLogs, logSteps, cardioLog, adaptiveSuggestion, acceptSuggestion, dismissSuggestion, tdeeEstimate } = useApp();
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [showStepModal, setShowStepModal] = useState(false);
  const [stepInputVal, setStepInputVal] = useState('');
  const unitWeight = user.unitWeight || 'kg';
  const isImpWeight = unitWeight === 'lbs';

  const isNewUser = useMemo(() => {
    if (!user?.id) return false;
    const onboardingKey = `fittrack_onboarding_pending:${user.id}`;
    const hasSeenWelcomeKey = `fittrack_has_seen_welcome:${user.id}`;
    return localStorage.getItem(onboardingKey) === 'true'
      && localStorage.getItem(hasSeenWelcomeKey) !== 'true';
  }, [user?.id]);

  useEffect(() => {
    if (!user?.id || !isNewUser) return;
    const onboardingKey = `fittrack_onboarding_pending:${user.id}`;
    const hasSeenWelcomeKey = `fittrack_has_seen_welcome:${user.id}`;
    localStorage.removeItem(onboardingKey);
    localStorage.setItem(hasSeenWelcomeKey, 'true');
  }, [user?.id, isNewUser]);
  
  const objectiveScoreObj = useMemo(() => calcObjectiveReadiness(workoutLogs, stepLogs, user), [workoutLogs, stepLogs, user]);
  const objectiveScore = objectiveScoreObj.score;


  const todayStr = useMemo(() => tod(), []);
  const todayReadiness = useMemo(() => readinessLog.find(r => r.userId === user?.id && r.date === todayStr), [readinessLog, user?.id, todayStr]);
  const hasCompletedReadiness = Boolean(
    todayReadiness?.checkInComplete
    && Number.isFinite(todayReadiness?.score)
  );

  const activeScore = hasCompletedReadiness ? todayReadiness.score : objectiveScore;
  const activeTier = getTier(activeScore);

  const muscleStatuses = useMemo(() => getMuscleRecoveryStatuses(workoutLogs, splits, user?.id), [workoutLogs, splits, user?.id]);
  const spotlightMuscles = useMemo(() => getSpotlightMuscles(muscleStatuses), [muscleStatuses]);
  
  const [showLog, setShowLog] = useState(false);
  const [showGoal, setShowGoal] = useState(false);
  const [showIosInstall, setShowIosInstall] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  useEffect(() => {
    const isIos = () => {
      const userAgent = window.navigator.userAgent.toLowerCase();
      return /iphone|ipad|ipod/.test(userAgent);
    };
    const isInStandaloneMode = () => ('standalone' in window.navigator) && (window.navigator.standalone);
    if (isIos() && !isInStandaloneMode()) {
      setShowIosInstall(true);
    }
  }, []);
  const [logWeight, setLogWeight] = useState(user.weight);
  const [logNote, setLogNote] = useState('');
  const [goalTarget, setGoalTarget] = useState(user.weightGoal || user.weight - 5);
  const [goalWeeks, setGoalWeeks] = useState(user.goalWeeks || 12);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => { const t = setTimeout(() => setLoaded(true), 300); return () => clearTimeout(t); }, []);

  // Auto-open check-in once per day on first dashboard load (if not done)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!dataLoaded) return; // wait for cloud data to fully load (readinessLog populated)
    if (!hasCompletedReadiness && user?.id) {
      const timer = setTimeout(() => setShowCheckIn(true), 800);
      return () => clearTimeout(timer);
    }
  }, [hasCompletedReadiness, user?.id, dataLoaded]); // intentional — readiness completion is stable per-render



  const allUserLogs = useMemo(() => [...healthLogs].filter(l => l.userId === user.id).sort((a, b) => new Date(a.date) - new Date(b.date)), [healthLogs, user.id]);
  const latestWeight = allUserLogs.length > 0 ? allUserLogs[allUserLogs.length - 1].weight : user.weight;
  const bmi = calcBMI(latestWeight, user.height);
  const bmiCat = getBMICat(bmi);
  const chartData = useMemo(() => allUserLogs.map(l => ({ date: fmt(l.date), weight: isImpWeight ? kgToLbs(l.weight) : l.weight, raw: new Date(l.date).getTime() })), [allUserLogs, isImpWeight]);

  const monthFirstWeight = useMemo(() => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const thisMonthLogs = allUserLogs.filter(l => {
      const d = new Date(l.date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });
    if (thisMonthLogs.length === 0) return null;
    return thisMonthLogs[0].weight;
  }, [allUserLogs]);

  const monthDelta = useMemo(() => {
    if (monthFirstWeight === null) return 0;
    const diff = latestWeight - monthFirstWeight;
    return isImpWeight ? +(diff * 2.20462).toFixed(1) : +diff.toFixed(1);
  }, [latestWeight, monthFirstWeight, isImpWeight]);

  const trend = useMemo(() => {
    if (allUserLogs.length < 2) return undefined;
    const latest = allUserLogs[allUserLogs.length - 1].weight;
    const previous = allUserLogs[allUserLogs.length - 2].weight;
    return +(latest - previous).toFixed(1);
  }, [allUserLogs]);


  const activeSplit = splits.find(s => s.id === user.activeSplitId);
  const userWo = workoutLogs.filter(l => l.userId === user.id);
  const thisWk = userWo.filter(l => (new Date() - new Date(l.date)) / 86400000 <= 7).length;
  const streak = getStreak();

  const goalPct = useMemo(() => {
    if (!user.weightGoal || !user.weightGoalStart) return null;
    const total = Math.abs(user.weightGoalStart - user.weightGoal);
    // A goal equal to the starting weight leaves nothing to travel, so there
    // is no meaningful percentage to show.
    if (total === 0) return null;
    const done = Math.abs(user.weightGoalStart - latestWeight);
    return clamp(Math.round(done / total * 100), 0, 100);
  }, [user, latestWeight]);

  const weeksLeft = useMemo(() => {
    if (!user.goalSetDate || !user.goalWeeks) return null;
    const deadline = new Date(user.goalSetDate); deadline.setDate(deadline.getDate() + user.goalWeeks * 7);
    const diff = (deadline - new Date()) / 86400000 / 7;
    return Math.max(0, Math.round(diff));
  }, [user]);

  const kgLeftRaw = user.weightGoal ? Math.abs(latestWeight - user.weightGoal).toFixed(1) : null;
  const kgLeft = isImpWeight && kgLeftRaw ? kgToLbs(parseFloat(kgLeftRaw)) : kgLeftRaw;
  const isLoss = user.weightGoal && latestWeight > user.weightGoal;

  // Goal-aware trend arrow based on log-to-log change (CURRENT vs PREVIOUS)
  // green = moving toward goal, red = moving away
  const trendArrow = useMemo(() => {
    const weightUp = trend !== undefined && trend > 0;
    if (!user.weightGoal) {
      // No goal set — just show direction with neutral color
      return { up: weightUp, color: 'var(--on-surface-dim)' };
    }
    if (isLoss) {
      // Goal: lose weight. Down = good (green), Up = bad (red)
      return weightUp
        ? { up: true,  color: 'var(--error)' }
        : { up: false, color: 'var(--success)' };
    } else {
      // Goal: gain weight. Up = good (green), Down = bad (red)
      return weightUp
        ? { up: true,  color: 'var(--success)' }
        : { up: false, color: 'var(--error)' };
    }
  }, [trend, isLoss, user.weightGoal]);

  const todayLog = useMemo(() => foodLog.filter(l => l.userId === user.id && l.date === todayStr), [foodLog, user.id, todayStr]);
  const todayWaterLog = useMemo(() => (waterLog || []).filter(l => l.userId === user.id && l.date === todayStr), [waterLog, user.id, todayStr]);
  const todayWaterTotal = useMemo(() => todayWaterLog.reduce((acc, curr) => acc + curr.ml, 0), [todayWaterLog]);

  const todayTotals = useMemo(() => {
    return todayLog.reduce((acc, item) => ({
      calories: acc.calories + (item.macros?.calories || 0),
      protein: acc.protein + (item.macros?.protein || 0),
      carbs: acc.carbs + (item.macros?.carbs || 0),
      fats: acc.fats + (item.macros?.fats || 0)
    }), { calories: 0, protein: 0, carbs: 0, fats: 0 });
  }, [todayLog]);

  const todayCaloriesBurned = useMemo(() => {
    const workoutCals = workoutLogs
      .filter(l => l.date === todayStr && l.userId === user?.id)
      .reduce((sum, log) => sum + (calcWorkoutCalories(log, user?.weight) || 0), 0);
    const cardioCals = (cardioLog || [])
      .filter(c => c.date === todayStr && c.userId === user?.id)
      .reduce((sum, c) => sum + calcCardioCalories(c, user?.weight), 0);
    return workoutCals + cardioCals;
  }, [workoutLogs, cardioLog, user?.id, user?.weight, todayStr]);

  const displayStepLog = useMemo(() => getDisplayStepLog(stepLogs, todayStr), [stepLogs, todayStr]);
  const todaySteps = displayStepLog?.steps || 0;
  const stepGoal = user.stepGoal || 10000;
  const stepPct = getStepGoalPercent(todaySteps, stepGoal);

  const cyclePhase = useMemo(() => user.gender === 'female' ? getCyclePhase(cycleConfig?.startDate, cycleConfig?.cycleLength) : null, [user.gender, cycleConfig]);
  const activeFestival = useMemo(() => getActiveFestival(), []);

  // Set up live pedometer
  const initialBrowserSteps = displayStepLog?.source === 'browser_sensor' ? todaySteps : 0;
  const { isTracking, steps: liveSteps, supported, error: pedoError, startTracking, stopTracking } = usePedometer(initialBrowserSteps);

  // Auto-save logic: every 50 steps
  useEffect(() => {
    if (isTracking && liveSteps > 0 && liveSteps % 50 === 0) {
      logSteps({ steps: liveSteps, date: todayStr, source: 'browser_sensor' });
    }
  }, [liveSteps, isTracking, logSteps, todayStr]);

  // Use user.weight (profile weight) for macro calculations — must match DietPage exactly
  const { goalKcal, protTarget, carbTarget, fatTarget } = useMemo(() => {
    const bmr = calcBMR(user.weight, user.height, user.age, user.gender);
    const tdee = calcTDEE(bmr, user.activityLevel || 'moderate');
    const deficitInfo = calcDeficit(user.weight, user.weightGoal, user.goalWeeks);
    const goal = deficitInfo.goal;
    const dailyDelta = deficitInfo.dailyDelta || (goal === 'loss' ? 500 : goal === 'gain' ? 400 : 0);
    const k = goal === 'loss' ? tdee - dailyDelta : goal === 'gain' ? tdee + dailyDelta : tdee;

    const baseWeightForProtein = (goal === 'loss' && user.weightGoal && user.weightGoal < user.weight) ? user.weightGoal : user.weight;
    
    const isHeavyCut = user.workoutDays >= 5 && goal === 'loss';
    const proteinMultiplier = isHeavyCut ? 2.0 : 1.8;

    return {
      goalKcal: user?.customGoalKcal || Math.round(k),
      protTarget: Math.round(baseWeightForProtein * proteinMultiplier),
      carbTarget: Math.round((k * (goal === 'loss' ? .38 : .44)) / 4),
      fatTarget: Math.round((k * .26) / 9),
    };
  }, [user]);

  const calPct = clamp(Math.round((todayTotals.calories / goalKcal) * 100) || 0, 0, 100);

  const hasBodyMetrics = Number.isFinite(user?.weight) && Number.isFinite(user?.height) && Number.isFinite(user?.age);
  const hasNutritionTargets = hasBodyMetrics && Number.isFinite(goalKcal) && Number.isFinite(protTarget);

  const saveLog = () => {
    const w = parseFloat(logWeight);
    if (!w || isNaN(w)) return;
    setHealthLogs(p => [...p, { id: gId(), userId: user.id, date: tod(), weight: w, notes: logNote }]);
    setLogNote(''); setShowLog(false);
    clearScrollPosition('/');
    addToast(`Weight logged: ${isImpWeight ? kgToLbs(w) + ' lbs' : w + ' kg'}`, 'success');
  };

  const saveGoal = async () => {
    await updateProfile({ weightGoal: goalTarget, weightGoalStart: latestWeight, goalWeeks: goalWeeks, goalSetDate: tod() });
    setShowGoal(false);
    addToast('Weight goal updated!', 'success');
  };

  const wtItems = isImpWeight ? mkWtItemsImperial(66, 440, 1) : mkWtItems(30, 200, 0.1);
  const wkItems = mkIntItems(1, 52);


  return {
    navigate,
    user,
    dataLoaded,
    healthLogs,
    setHealthLogs,
    workoutLogs,
    splits,
    updateProfile,
    addToast,
    getStreak,
    readinessLog,
    foodLog,
    waterLog,
    cycleConfig,
    stepLogs,
    logSteps,
    cardioLog,
    adaptiveSuggestion,
    acceptSuggestion,
    dismissSuggestion,
    tdeeEstimate,
    showCheckIn,
    setShowCheckIn,
    showStepModal,
    setShowStepModal,
    stepInputVal,
    setStepInputVal,
    unitWeight,
    isImpWeight,
    isNewUser,
    objectiveScoreObj,
    objectiveScore,
    todayStr,
    todayReadiness,
    hasCompletedReadiness,
    activeScore,
    activeTier,
    muscleStatuses,
    spotlightMuscles,
    showLog,
    setShowLog,
    showGoal,
    setShowGoal,
    showIosInstall,
    setShowIosInstall,
    deferredPrompt,
    setDeferredPrompt,
    handleInstallClick,
    logWeight,
    setLogWeight,
    logNote,
    setLogNote,
    goalTarget,
    setGoalTarget,
    goalWeeks,
    setGoalWeeks,
    loaded,
    setLoaded,
    allUserLogs,
    latestWeight,
    bmi,
    bmiCat,
    chartData,
    monthFirstWeight,
    monthDelta,
    trend,
    activeSplit,
    userWo,
    thisWk,
    streak,
    goalPct,
    weeksLeft,
    kgLeftRaw,
    kgLeft,
    isLoss,
    trendArrow,
    todayLog,
    todayWaterLog,
    todayWaterTotal,
    todayTotals,
    todayCaloriesBurned,
    displayStepLog,
    todaySteps,
    stepGoal,
    stepPct,
    cyclePhase,
    activeFestival,
    initialBrowserSteps,
    isTracking,
    liveSteps,
    supported,
    pedoError,
    startTracking,
    stopTracking,
    goalKcal,
    protTarget,
    carbTarget,
    fatTarget,
    calPct,
    hasBodyMetrics,
    hasNutritionTargets,
    saveLog,
    saveGoal,
    wtItems,
    wkItems,
  };
}
