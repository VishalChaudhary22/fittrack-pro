import { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Flame, Trophy, Target, ChevronDown, ChevronRight, X, Zap, Dumbbell, Activity, TrendingDown, TrendingUp, Footprints, Droplets, RefreshCw } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ScrollPicker, ModalPortal, GlassTooltip, PulseIndicator, ProgressOrb, ThemeTogglePill } from '../shared/SharedComponents';

import { calcBMI, getBMICat, calcBMR, calcTDEE, calcDeficit } from '../../utils/calculations';
import { ACTIVITY } from '../../data/constants';
import { gId, tod, fmt, clamp, mkWtItems, mkIntItems, kgToLbs, lbsToKg, mkWtItemsImperial } from '../../utils/helpers';
import { calcAllMuscleXP } from '../../data/muscleData';
import { getCyclePhase } from '../../utils/cycleCalculations';
import { getActiveFestival } from '../../utils/festivals';
import {
  calcObjectiveReadiness,
  getMuscleRecoveryStatuses,
  getTier,
  getSpotlightMuscles,
  STATUS_COLORS,
  MUSCLE_LABELS,
} from '../../utils/readinessUtils';
import ReadinessCheckIn from '../shared/ReadinessCheckIn';
import { calcWorkoutCalories, calcCardioCalories } from '../../data/metValues';
import { getStepGoalPercent, formatSteps, getDisplayStepLog, getSourceLabel } from '../../utils/activityUtils';
import { usePedometer } from '../../hooks/usePedometer';
import BodyFatRingCard from '../shared/BodyFatRingCard';
import AdaptiveDietBanner from '../shared/AdaptiveDietBanner';
import { hasSufficientData, computeNewTarget, recomputeMacros } from '../../utils/adaptiveCalories';
import { useScrollRestoration, clearScrollPosition } from '../../hooks/useScrollRestoration';



const ParticlesBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let width, height;

    const resize = () => {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const numParticles = 35;
    const particles = Array.from({ length: numParticles }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      size: Math.random() * 2 + 0.5,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = 'rgba(200, 240, 255, 0.4)';
      ctx.strokeStyle = 'rgba(200, 240, 255, 0.08)';
      
      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      });
      animationFrameId = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }} />;
};

export default function DashboardPage() {
  useScrollRestoration('/');
  const navigate = useNavigate();
  const { user, authLoading, dataLoaded, healthLogs, setHealthLogs, workoutLogs, splits, updateProfile, addToast, getStreak, readinessLog, foodLog, waterLog, cycleConfig, stepLogs, logSteps, cardioLog, bodyFatLog, adaptiveSuggestion, acceptSuggestion, dismissSuggestion, tdeeEstimate } = useApp();
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
  
  const muscleXP = useMemo(() => calcAllMuscleXP(workoutLogs, splits, user?.id), [workoutLogs, splits, user?.id]);
  
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
      goalKcal: Math.round(k),
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

  if (!loaded) return (
    <div className="pg-in">
      <header style={{ position: 'relative', marginBottom: 32 }}>
        <div style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--on-surface-variant)', fontFamily: "'Space Grotesk'" }}>Loading</div>
        <div className="headline-lg" style={{ color: 'var(--on-surface)', marginTop: 4 }}>DASHBOARD</div>
      </header>
      <div className="g2" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
        <div className="glass-card" style={{ height: 200, borderRadius: 16, background: 'var(--surface-container-high)', animation: 'pulse 1.5s infinite', border: 'none' }} />
        <div className="glass-card" style={{ height: 200, borderRadius: 16, background: 'var(--surface-container-high)', animation: 'pulse 1.5s infinite', border: 'none' }} />
      </div>
    </div>
  );

  return (
    <>
      <div className="pg-in">
        {/* Welcome Header */}
        <header style={{ position: 'relative', marginBottom: 32 }}>
          <div style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--on-surface-variant)', fontFamily: "'Space Grotesk'" }}>
            SESSION ACTIVE
          </div>
          <div style={{ fontFamily: "'Space Grotesk'", fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 700, letterSpacing: '-0.04em', lineHeight: 1 }}>
            {isNewUser ? 'WELCOME,' : 'WELCOME BACK,'}<br/>
            <span className="text-gradient-primary">{user.name.split(' ')[0].toUpperCase()}</span>
          </div>
          <div style={{ fontSize: 12, color: 'var(--on-surface-variant)', marginTop: 8, display: 'flex', alignItems: 'center', gap: 12 }}>
            <span>{new Date().toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
            {cyclePhase && (
              <span onClick={() => navigate('/cycle')} style={{ cursor: 'pointer', background: cyclePhase.theme, color: 'var(--on-primary)', fontSize: 10, fontWeight: 800, padding: '2px 8px', borderRadius: 12, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                Day {cyclePhase.currentDay} · {cyclePhase.phase}
              </span>
            )}
          </div>
          <Dumbbell size={120} style={{ position: 'absolute', top: -16, right: -16, opacity: 0.06, color: 'var(--on-surface)' }} />
          <button className="btn-p" style={{ position: 'absolute', top: 0, right: 0, padding: '7px 13px', fontSize: 10 }} onClick={() => setShowLog(true)}>
            + Log Weight
          </button>
          <div style={{ position: 'absolute', top: 38, right: 0 }}>
            <ThemeTogglePill />
          </div>
        </header>

        {activeFestival && (
          <div style={{ background: 'linear-gradient(135deg, rgba(248,95,27,0.1) 0%, rgba(248,95,27,0.05) 100%)', border: '1px solid var(--primary-container)', borderRadius: 16, padding: 20, marginBottom: 24, display: 'flex', alignItems: 'flex-start', gap: 16 }}>
            <div style={{ fontSize: 24 }}>✨</div>
            <div>
              <h3 className="headline-md" style={{ color: 'var(--primary)', fontSize: 16, marginBottom: 4 }}>{activeFestival.name}</h3>
              <p style={{ color: 'var(--on-surface-variant)', fontSize: 13, lineHeight: 1.5 }}>{activeFestival.message}</p>
            </div>
          </div>
        )}

        {/* Row 1: Weight Snapshot + BMI  (1fr / 1fr) */}
        <div className="g2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          {/* Weight Snapshot */}
          <div className="glass-card" style={{ padding: 24, borderRadius: 16, border: 'none', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div>
                <div style={{ fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--on-surface-dim)' }}>PERFORMANCE TREND</div>
                <div className="headline-lg" style={{ color: 'var(--on-surface)', marginTop: 2, lineHeight: 1.1 }}>WEIGHT<br/>ANALYSIS</div>
              </div>
              <span style={{ background: 'var(--primary-container)', color: 'var(--on-primary)', borderRadius: 14, padding: '6px 12px', fontSize: 10, fontWeight: 700, position: 'relative', zIndex: 1, textAlign: 'center', lineHeight: 1.2 }}>
                {monthDelta > 0 ? '+' : ''}{monthDelta} {isImpWeight ? 'LBS' : 'KG'} THIS<br/>MONTH
              </span>
            </div>
            
            <svg viewBox="0 0 300 80" preserveAspectRatio="none" style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: 75, opacity: 0.35, pointerEvents: 'none', zIndex: 0 }}>
              <path d="M 0 75 Q 120 75, 180 40 T 300 20" fill="none" stroke="var(--primary-container)" strokeWidth="3" />
            </svg>

            <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginTop: 16, position: 'relative', zIndex: 1 }}>
              <div>
                <div style={{ fontSize: 10, textTransform: 'uppercase', color: 'var(--on-surface-dim)', marginBottom: 4 }}>CURRENT</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                  <span style={{ fontFamily: "'Space Grotesk'", fontSize: 'clamp(2.5rem, 6vw, 3.5rem)', fontWeight: 700, color: 'var(--on-surface)', lineHeight: 1 }}>
                    {latestWeight ? (isImpWeight ? kgToLbs(latestWeight) : latestWeight) : '—'}
                  </span>
                  {latestWeight && <span style={{ fontSize: 13, color: 'var(--on-surface-variant)' }}>{isImpWeight ? 'lbs' : 'kg'}</span>}
                </div>
              </div>
              
              <div style={{ alignSelf: 'center', marginTop: 16, opacity: 0.9 }}>
                {trendArrow.up
                  ? <TrendingUp size={22} color={trendArrow.color} />
                  : <TrendingDown size={22} color={trendArrow.color} />
                }
              </div>

              {allUserLogs.length >= 2 && (
                <div style={{ marginLeft: 16 }}>
                  <div style={{ fontSize: 10, textTransform: 'uppercase', color: 'var(--on-surface-dim)', marginBottom: 4 }}>PREVIOUS</div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                    <span style={{ fontFamily: "'Space Grotesk'", fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: 700, color: 'var(--on-surface-variant)', opacity: 0.55, lineHeight: 1 }}>
                      {isImpWeight ? kgToLbs(allUserLogs[allUserLogs.length - 2].weight) : allUserLogs[allUserLogs.length - 2].weight}
                    </span>
                    <span style={{ fontSize: 11, color: 'var(--on-surface-dim)' }}>{isImpWeight ? 'lbs' : 'kg'}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Metabolic Index */}
          <div className="glass-card" style={{ padding: 16, borderRadius: 16, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', position: 'relative', border: 'none' }}>
            <Activity size={24} style={{ position: 'absolute', top: 12, right: 12, opacity: 0.15, color: 'var(--on-surface)' }} />
            <div style={{ fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--on-surface-variant)', marginBottom: 12 }}>METABOLIC INDEX</div>
            
            {Math.round(bmi) && !isNaN(bmi) ? (
              <div style={{ display: 'flex', gap: 16, width: '100%' }}>
                 {/* BMI Side */}
                 <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ position: 'relative', width: 90, height: 90, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                      <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '4px solid var(--surface-container-lowest)' }}></div>
                      <div className="ember-glow" style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '4px solid var(--primary-container)', borderTopColor: 'transparent', borderRightColor: 'transparent', transform: 'rotate(45deg)' }}></div>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <span className="headline-lg" style={{ fontSize: '2rem', color: 'var(--on-surface)' }}>{bmi}</span>
                      </div>
                    </div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--primary)', textAlign: 'center', lineHeight: 1.2 }}>BMI:<br/>{bmiCat.label}</div>
                 </div>

                 {/* TDEE Side */}
                 {(() => {
                    const hasAdaptive = tdeeEstimate?.estimatedTDEE && (tdeeEstimate.confidence === 'high' || tdeeEstimate.confidence === 'medium');
                    const displayTDEE = hasAdaptive ? tdeeEstimate.estimatedTDEE : (user.weight && user.height && user.age ? Math.round(calcBMR(user.weight, user.height, user.age, user.gender) * (ACTIVITY[user.activityLevel || 'moderate']?.mult || 1.55)) : null);
                    return (
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--surface-container-lowest)', borderRadius: 12, padding: '12px 8px', position: 'relative' }}>
                         {tdeeEstimate?.insights?.some(i => i.type === 'metabolic-adaptation') && (
                           <div style={{ position: 'absolute', top: 6, right: 6, width: 8, height: 8, borderRadius: '50%', background: 'var(--error)', animation: 'pulse 2s infinite' }} title="Metabolic Adaptation Detected" />
                         )}
                         <Zap size={20} color="var(--tertiary-container)" style={{ marginBottom: 4 }} />
                         <span style={{ fontSize: 10, color: 'var(--on-surface-variant)', textTransform: 'uppercase', letterSpacing: '1px' }}>TDEE</span>
                         <span style={{ fontSize: 18, fontWeight: 800, color: 'var(--on-surface)', marginTop: 4 }}>
                           {displayTDEE || '—'}
                         </span>
                         <span style={{ fontSize: 9, color: 'var(--on-surface-dim)', marginTop: 2 }}>
                           {hasAdaptive ? (tdeeEstimate.confidence === 'high' ? '🛡️ Adaptive' : '⚡ Adaptive') : (displayTDEE ? '📊 Formula' : 'Set profile')}
                         </span>
                      </div>
                    );
                 })()}
              </div>
            ) : (
              <div style={{ fontSize: 11, color: 'var(--on-surface-dim)', textAlign: 'center', padding: '16px' }}>
                Add weight & height
              </div>
            )}
          </div>
        </div>
        {/* ADAPTIVE DIET — Compact Banner */}
        {adaptiveSuggestion && adaptiveSuggestion.scenario !== 'S10' && (() => {
          const { newKcal } = computeNewTarget(adaptiveSuggestion.goalKcal, adaptiveSuggestion.adjustKcal, user.gender, adaptiveSuggestion.tdee);
          const newMacros = adaptiveSuggestion.adjustKcal !== 0 ? recomputeMacros({
            goal: adaptiveSuggestion.goal,
            currentWeight: user.weight,
            goalWeight: user.weightGoal,
            newKcal,
            workoutDays: user.workoutDays,
          }) : null;
          return (
            <AdaptiveDietBanner
              suggestion={adaptiveSuggestion}
              currentKcal={adaptiveSuggestion.goalKcal}
              newKcal={newKcal}
              newMacros={newMacros}
              onAccept={acceptSuggestion}
              onDismiss={dismissSuggestion}
              compact
              onDetails={() => navigate('/diet')}
            />
          );
        })()}
        {/* ADAPTIVE DIET — Insufficient Data Nudge */}
        {(() => {
          const userHealthLogs = (healthLogs || []).filter(l => l.userId === user?.id && l.weight);
          const hasStarted = userHealthLogs.length >= 1;
          const hasSufficient = hasSufficientData(userHealthLogs);
          if (hasStarted && !hasSufficient) {
            return (
              <div style={{ fontSize: 11, color: 'var(--on-surface-dim)', textAlign: 'center', padding: '8px 12px', background: 'var(--surface-container-lowest)', borderRadius: 12, marginBottom: 12 }}>
                💡 Log your weight for 2+ more weeks to unlock personalised calorie adjustments
              </div>
            );
          }
          return null;
        })()}

        {/* Row 2: Body Composition */}
        <div style={{ marginBottom: 16 }}>
          <BodyFatRingCard />
        </div>

        {/* Combined Sessions + Streak Card */}
        <div className="glass-card" style={{ padding: 24, borderRadius: 16, border: 'none', marginBottom: 16 }}>
          <div style={{ fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--on-surface-variant)', fontWeight: 700, marginBottom: 16 }}>
            TRAINING OVERVIEW
          </div>
          <div className="g2" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(65px, 1fr))', gap: 10 }}>
            <div style={{ background: 'var(--surface-container-lowest)', borderRadius: 12, padding: '12px 6px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
              <div style={{ fontSize: 9, textTransform: 'uppercase', color: 'var(--on-surface-dim)', fontWeight: 700, marginBottom: 4, letterSpacing: '0.05em' }}>Sessions/Wk</div>
              <div className="headline-lg" style={{ color: 'var(--primary)', lineHeight: 1 }}>{thisWk}</div>
            </div>
            <div style={{ background: 'var(--surface-container-lowest)', borderRadius: 12, padding: '12px 6px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
              <div style={{ fontSize: 9, textTransform: 'uppercase', color: 'var(--on-surface-dim)', fontWeight: 700, marginBottom: 4, letterSpacing: '0.05em' }}>All Time</div>
              <div className="headline-lg" style={{ color: 'var(--on-surface)', lineHeight: 1 }}>{userWo.length}</div>
            </div>
            <div style={{ background: 'var(--surface-container-lowest)', borderRadius: 12, padding: '12px 6px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
              <div style={{ fontSize: 9, color: 'var(--on-surface-dim)', fontWeight: 700, textTransform: 'uppercase', marginBottom: 4, letterSpacing: '0.05em' }}>Current</div>
              <div className="headline-lg" style={{ color: 'var(--primary)', display: 'flex', alignItems: 'baseline', lineHeight: 1 }}>
                {streak.current}<span style={{ fontSize: 12, color: 'var(--on-surface-variant)', fontFamily: "'Be Vietnam Pro', sans-serif", marginLeft: 2 }}>d</span>
              </div>
            </div>
            <div style={{ background: 'var(--surface-container-lowest)', borderRadius: 12, padding: '12px 6px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', position: 'relative' }}>
              <div style={{ fontSize: 9, color: 'var(--on-surface-dim)', fontWeight: 700, textTransform: 'uppercase', marginBottom: 4, letterSpacing: '0.05em' }}>Best Streak</div>
              <div className="headline-lg" style={{ color: 'var(--on-surface)', display: 'flex', alignItems: 'baseline', lineHeight: 1 }}>
                {streak.longest}<span style={{ fontSize: 12, color: 'var(--on-surface-variant)', fontFamily: "'Be Vietnam Pro', sans-serif", marginLeft: 2 }}>d</span>
              </div>
              {streak.current >= 3 && <div style={{ position: 'absolute', top: -6, right: -6, background: 'rgba(248,95,27,0.1)', color: 'var(--primary)', padding: '4px', borderRadius: '50%' }}><Zap size={10} /></div>}
            </div>
          </div>
        </div>

        {/* Today's Nutrition (Phase 3 Macro Widget) */}
        {!hasNutritionTargets ? (
          <div className="glass-card" style={{ padding: 24, borderRadius: 16, border: 'none', marginBottom: 16, cursor: 'pointer', textAlign: 'center' }} onClick={() => navigate('/profile')}>
            <div style={{ fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--on-surface-variant)', fontWeight: 700, marginBottom: 8 }}>TODAY'S NUTRITION</div>
            <div style={{ fontSize: 13, color: 'var(--on-surface-variant)' }}>Complete your profile to unlock daily targets</div>
          </div>
        ) : (
        <div className="glass-card" style={{ padding: 24, borderRadius: 16, border: 'none', marginBottom: 16, cursor: 'pointer', transition: 'all .2s var(--ease-smooth)' }} onClick={() => navigate('/diet')}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div>
              <div style={{ fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--on-surface-variant)', fontWeight: 700 }}>TODAY'S NUTRITION</div>
              <div className="headline-md" style={{ color: 'var(--on-surface)', marginTop: 2 }}>{Math.round(todayTotals.calories)} / {goalKcal} <span style={{ fontSize: 14, color: 'var(--on-surface-variant)' }}>Kcal</span></div>
            </div>
            <ChevronRight size={16} color="var(--on-surface-dim)" />
          </div>
          
          <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
            <div style={{ flexShrink: 0 }}>
               <ProgressOrb progress={calPct} size={90} label={`${calPct}%`} subLabel="Cal" color={calPct >= 100 ? 'var(--primary)' : 'var(--primary)'} />
            </div>
            
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { label: 'Protein', val: todayTotals.protein, target: protTarget, color: '#3b82f6' },
                { label: 'Carbs', val: todayTotals.carbs, target: carbTarget, color: '#10b981' },
                { label: 'Fats', val: todayTotals.fats, target: fatTarget, color: '#f59e0b' }
              ].map(m => {
                const pct = clamp(Math.round((m.val / m.target) * 100) || 0, 0, 100);
                const over = m.val > m.target;
                return (
                  <div key={m.label}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 4 }}>
                      <span style={{ color: 'var(--on-surface)', fontWeight: 600 }}>{m.label}</span>
                      <span style={{ color: 'var(--on-surface-variant)' }}>{Math.round(m.val)} / {m.target}g</span>
                    </div>
                    <div style={{ height: 6, background: 'var(--surface-container-highest)', borderRadius: 4, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: over ? 'var(--error)' : m.color, borderRadius: 4, transition: 'width 0.5s ease-out' }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        )}

        {/* Daily Activity (Similar to Today's Nutrition) */}
        <div className="glass-card" style={{ padding: 24, borderRadius: 16, border: 'none', marginBottom: 16, cursor: 'pointer', transition: 'all .2s var(--ease-smooth)' }} onClick={() => setShowStepModal(true)}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div>
              <div style={{ fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--on-surface-variant)', fontWeight: 700 }}>DAILY ACTIVITY</div>
              {todaySteps > 0 ? (
                <div className="headline-md" style={{ color: 'var(--on-surface)', marginTop: 2 }}>
                  {formatSteps(todaySteps)} <span style={{ fontSize: 14, color: 'var(--on-surface-variant)' }}>/ {formatSteps(stepGoal)}</span>
                </div>
              ) : (
                <div className="headline-md" style={{ color: 'var(--on-surface)', marginTop: 2 }}>
                  — <span style={{ fontSize: 14, color: 'var(--on-surface-variant)' }}>tap to log</span>
                </div>
              )}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
              {displayStepLog?.source && (
                 <div style={{ fontSize: 10, color: 'var(--on-surface-dim)' }}>
                   {getSourceLabel(displayStepLog.source)}
                 </div>
              )}
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
            <div style={{ flexShrink: 0 }}>
               <ProgressOrb progress={stepPct} size={90} label={`${stepPct}%`} subLabel="Steps" color="var(--primary)" />
            </div>
            
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { label: 'Steps', val: todaySteps, target: stepGoal, color: 'var(--primary)' },
                { label: 'Cals Burned', val: todayCaloriesBurned + (displayStepLog?.calories_active || 0), target: 500, color: '#F85F1B' },
                { label: 'Water', val: todayWaterTotal, target: user.waterGoal || 3000, color: '#3b82f6', unit: 'ml' }
              ].map(m => {
                const pct = clamp(Math.round((m.val / m.target) * 100) || 0, 0, 100);
                return (
                  <div key={m.label}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 4 }}>
                      <span style={{ color: 'var(--on-surface)', fontWeight: 600 }}>{m.label}</span>
                      <span style={{ color: 'var(--on-surface-variant)' }}>{Math.round(m.val)} / {m.target}{m.unit || ''}</span>
                    </div>
                    <div style={{ height: 6, background: 'var(--surface-container-highest)', borderRadius: 4, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: m.color, borderRadius: 4, transition: 'width 0.5s ease-out' }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Goal Progress Card */}
        <div className="glass-card" style={{ padding: 20, borderRadius: 16, border: 'none', marginBottom: 16, cursor: 'pointer', transition: 'all .2s var(--ease-smooth)' }} onClick={() => setShowGoal(true)}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <div style={{ width: 34, height: 34, borderRadius: 9, background: 'var(--surface-container-highest)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--glow-primary)' }}><Target size={16} color="var(--primary)" /></div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14 }}>Weight Goal</div>
                <div style={{ fontSize: 11, color: 'var(--on-surface-variant)' }}>Tap to update your target</div>
              </div>
            </div>
            <ChevronDown size={14} color="var(--on-surface-dim)" />
          </div>
          {user.weightGoal ? (<>
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr) minmax(0,1fr)', gap: 10, marginBottom: 0 }}>
              {[{ l: 'Target', v: isImpWeight ? `${kgToLbs(user.weightGoal)} lbs` : `${user.weightGoal} kg` }, { l: 'Remaining', v: `${kgLeft} ${isImpWeight ? 'lbs' : 'kg'} ${isLoss ? 'to lose' : 'to gain'}` }, { l: 'Weeks Left', v: weeksLeft !== null ? `${weeksLeft} wks` : '—' }].map(s => (
                <div key={s.l} style={{ background: 'var(--surface-container-highest)', borderRadius: 10, padding: '10px 12px', border: 'none' }}>
                  <div style={{ fontSize: 10, color: 'var(--on-surface-dim)', fontWeight: 700, textTransform: 'uppercase', marginBottom: 3 }}>{s.l}</div>
                  <div className="headline-md" style={{ color: 'var(--primary)' }}>{s.v}</div>
                </div>
              ))}
            </div>
          </>) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px', background: 'var(--surface-container-highest)', borderRadius: 10, border: 'none' }}>
              <Target size={14} color="var(--on-surface-dim)" />
              <span style={{ fontSize: 13, color: 'var(--on-surface-variant)' }}>Set your target weight & timeline</span>
              <ChevronRight size={13} color="var(--on-surface-dim)" style={{ marginLeft: 'auto' }} />
            </div>
          )}
        </div>

        {/* Weight Trend Chart */}
        <div className="glass-card" style={{ padding: 24, borderRadius: 16, border: 'none', marginBottom: 16 }}>
          <div style={{ fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--on-surface-variant)', marginBottom: 16 }}>WEIGHT TREND</div>
          {chartData.length >= 2 ? (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={chartData}>
                <defs><linearGradient id="wg" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#F85F1B" stopOpacity={.18} /><stop offset="95%" stopColor="#F85F1B" stopOpacity={0} /></linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--surface-container-highest)" />
                <XAxis dataKey="date" tick={{ fill: 'var(--on-surface-dim)', fontSize: 9 }} interval="preserveStartEnd" axisLine={false} tickLine={false} />
                <YAxis domain={['auto', 'auto']} tick={{ fill: 'var(--on-surface-dim)', fontSize: 9 }} width={38} axisLine={false} tickLine={false} />
                <Tooltip content={<GlassTooltip />} cursor={{ fill: 'var(--surface-variant)' }} />
                <Area type="monotone" dataKey="weight" stroke="#F85F1B" strokeWidth={2} fill="url(#wg)" dot={{ fill: '#F85F1B', r: 3, strokeWidth: 0 }} activeDot={{ r: 5 }} name="Weight" />
                {user.weightGoal && <ReferenceLine y={isImpWeight ? kgToLbs(user.weightGoal) : user.weightGoal} stroke="rgba(248,95,27,.4)" strokeDasharray="5 5" label={{ value: 'Goal', fill: 'var(--primary)', fontSize: 10, position: 'insideTopRight' }} />}
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ height: 200, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--on-surface-variant)' }}>
               <Activity size={32} color="var(--primary)" style={{ opacity: 0.8, marginBottom: 12, filter: 'drop-shadow(var(--glow-primary))' }} />
               <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--on-surface)' }}>Insufficient Data</div>
               <div style={{ fontSize: 12, marginTop: 4, maxWidth: 220, textAlign: 'center' }}>Log weight for at least two days to see your trend chart.</div>
               <button className="btn-g" style={{ marginTop: 20, padding: '10px 20px', fontSize: 13 }} onClick={() => setShowLog(true)}>Log Weight</button>
            </div>
          )}
        </div>



        {/* Live Suggestion Banner */}
        <div style={{ borderRadius: 16, overflow: 'hidden', position: 'relative', minHeight: 180, marginBottom: 16 }}>
          <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuA5YpbGNIoffyZlhuSOD4j3ahpYBQQfFB1zqtCjL7_BUk6tA9p0a2lG1HEdiThIXTYVvnA-b2UjzmbZYd6rat_MwXd9ODZuWMaRe032I3mzdPojqaOMzCMuRODYzlRH9HlY4iTumjwp8hBdSRz10dmucVjk_M38BsbuYmWp1pWbWzth6YNIBRy9LJp_cEya6moQ0MDMrpczz829a-mzevNqgxlRdofFwnDBCoEoiIqa-dekVLFyHK3u02-qrQe5iqKtus-ZsA1--JiE" alt="Gym" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 30%', opacity: 0.5, filter: 'grayscale(100%)' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, var(--background) 15%, transparent 100%)' }}></div>
          <div style={{ position: 'relative', zIndex: 1, padding: 24, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', minHeight: 180 }}>
            {activeSplit ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <PulseIndicator />
                  <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--on-surface)' }}>LIVE SUGGESTION</span>
                </div>
                <div className="headline-md" style={{ color: 'var(--on-surface)', textTransform: 'uppercase', marginBottom: 4 }}>{activeSplit.name}</div>
                <div style={{ fontSize: 13, color: 'var(--on-surface-variant)', marginBottom: 10, maxWidth: '75%' }}>{activeSplit.description}</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
                  {activeSplit.schedule.slice(0, 4).map((d, i) => (
                    <div key={i} style={{ padding: '4px 8px', borderRadius: 8, fontSize: 10, fontWeight: 700, background: d === 'Rest' ? 'rgba(255,255,255,0.07)' : 'var(--primary-container)', color: d === 'Rest' ? 'var(--on-surface-dim)' : 'var(--on-primary)', backdropFilter: 'blur(10px)' }}>
                      D{i + 1}: {d}
                    </div>
                  ))}
                  {activeSplit.schedule.length > 4 && (
                    <div style={{ padding: '4px 8px', borderRadius: 8, fontSize: 10, color: 'var(--on-surface-dim)', background: 'rgba(255,255,255,0.05)' }}>
                      +{activeSplit.schedule.length - 4} more
                    </div>
                  )}
                </div>
                <button className="btn-p" style={{ alignSelf: 'flex-start', background: 'var(--signature-gradient)', borderRadius: 14, fontFamily: "'Space Grotesk'", fontWeight: 700, border: 'none', padding: '10px 20px' }} onClick={() => navigate('/workout')}>
                  START WORKOUT
                </button>
              </>
            ) : (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <PulseIndicator color="var(--on-surface-dim)" />
                  <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--on-surface-dim)' }}>NO ACTIVE SPLIT</span>
                </div>
                <div style={{ fontSize: 13, color: 'var(--on-surface-variant)', maxWidth: '75%', marginBottom: 16 }}>
                  Set up a training split to get personalised workout recommendations.
                </div>
                <button className="btn-p" style={{ alignSelf: 'flex-start', background: 'var(--signature-gradient)', borderRadius: 14, fontFamily: "'Space Grotesk'", fontWeight: 700, border: 'none', padding: '10px 20px' }} onClick={() => navigate('/splits')}>
                  SET UP A SPLIT
                </button>
              </>
            )}
          </div>
        </div>


        {/* ════════════════════════════════════════════════════════ */}
        {/* NEW DAILY READINESS WIDGET                               */}
        {/* ════════════════════════════════════════════════════════ */}
        <div style={{
          position: 'relative',
          borderRadius: 24,
          background: '#0E0E10', // P2-G1: hardcoded near-black for mix-blend-screen
          overflow: 'hidden', minHeight: 500,
          display: 'flex', flexDirection: 'column',
        }}>

          {/* ── Background Atmosphere (Particles/Nodes) ── */}
          <ParticlesBackground />

          {/* ── Reflective Floor ── */}
          <img
            src={user?.gender === 'female' ? '/muscles/female/female-body-wireframe.png' : '/muscles/body-wireframe.png'}
            alt=""
            style={{
              position: 'absolute',
              top: '95%', left: '50%',
              transform: `translate(-50%, -50%) scaleY(-1) ${user?.gender === 'female' ? 'scale(1.15)' : ''}`,
              width: '135%',
              maxWidth: 800,
              height: 'auto',
              objectFit: 'contain',
              zIndex: 1,
              pointerEvents: 'none',
              opacity: 0.15,
              mixBlendMode: 'screen',
              WebkitMaskImage: 'linear-gradient(to top, black 0%, transparent 40%)',
              maskImage: 'linear-gradient(to top, black 0%, transparent 40%)',
            }}
          />

          {/* ── Body Map & Silhouette Background ── */}
          <img
            src={user?.gender === 'female' ? '/muscles/female/female-body-wireframe.png' : '/muscles/body-wireframe.png'}
            alt=""
            style={{
              position: 'absolute',
              top: '45%', left: '50%',
              transform: `translate(-50%, -50%) ${user?.gender === 'female' ? 'scale(1.15)' : ''}`,
              width: '135%',
              maxWidth: 800,
              height: 'auto',
              objectFit: 'contain',
              zIndex: 1,
              pointerEvents: 'none',
              mixBlendMode: 'screen',
              WebkitMaskImage: 'linear-gradient(to bottom, black 65%, transparent 88%)',
              maskImage: 'linear-gradient(to bottom, black 65%, transparent 88%)',
            }}
          />

          {/* ── Bottom Gradient Overlay ── */}
          <div style={{
            position: 'absolute',
            bottom: 0, left: 0, right: 0,
            height: '45%',
            background: 'linear-gradient(to bottom, transparent, #0E0E10 80%)',
            zIndex: 2,
            pointerEvents: 'none',
          }} />

          {/* ── Content Layer ── */}
          <div style={{
            position: 'relative', zIndex: 10,
            padding: 24, flex: 1,
            display: 'flex', flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: 500,
          }}>

            {/* TOP ROW: Badge and Legend */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              
              {/* Score Badge */}
              <div style={{
                background: 'rgba(53, 52, 55, 0.4)',
                backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
                borderRadius: 12, padding: '10px 16px',
                border: '1px solid rgba(90, 65, 56, 0.15)',
                display: 'inline-flex', flexDirection: 'column', gap: 2,
              }}>
                <span style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: '2.4rem', fontWeight: 700, lineHeight: 1,
                  color: activeTier.color,
                }}>
                  {activeScore}%
                </span>
                <span style={{
                  fontSize: 10, fontWeight: 600, textTransform: 'uppercase',
                  letterSpacing: '-0.01em', color: 'var(--on-surface-variant)',
                }}>
                  Overall Readiness
                </span>
              </div>

              {/* Legend */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {[
                  { label: 'Recovered', color: STATUS_COLORS.optimal },
                  { label: 'Fatigued', color: STATUS_COLORS.fatigued },
                  { label: 'Critical', color: STATUS_COLORS.critical },
                ].map(item => (
                  <div key={item.label} style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    background: 'rgba(53, 52, 55, 0.4)',
                    backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
                    padding: '5px 10px', borderRadius: 8,
                    border: '1px solid rgba(90, 65, 56, 0.15)',
                  }}>
                    <div style={{
                      width: 8, height: 8, borderRadius: '50%',
                      background: item.color,
                      boxShadow: `0 0 8px ${item.color}99`,
                      flexShrink: 0,
                    }} />
                    <span style={{
                      fontSize: 10, fontWeight: 700, textTransform: 'uppercase',
                      letterSpacing: '0.08em', color: 'rgba(255, 255, 255, 0.9)', // force light color due to dark bg 
                    }}>
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Check-in CTA */}
            {!todayReadiness?.checkInComplete ? (
              <button
                onClick={() => setShowCheckIn(true)}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  background: 'none', border: 'none', padding: '4px 0', cursor: 'pointer',
                  fontSize: 11, fontWeight: 700, color: 'var(--primary)',
                  letterSpacing: '0.08em', textTransform: 'uppercase',
                  alignSelf: 'flex-start', marginTop: 12,
                }}
              >
                ✦ Complete Check-In <ChevronRight size={12} />
              </button>
            ) : (
              <button
                onClick={() => setShowCheckIn(true)}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  background: 'none', border: 'none', padding: '4px 0', cursor: 'pointer',
                  fontSize: 11, fontWeight: 600, color: 'rgba(255, 255, 255, 0.6)',
                  alignSelf: 'flex-start', marginTop: 12,
                }}
              >
                <RefreshCw size={11} /> Update Check-In
              </button>
            )}

            {/* BOTTOM ROW: Muscle Chips */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 'auto', rowGap: 8 }}>
              {spotlightMuscles.length === 0 ? null : spotlightMuscles.map(m => (
                <div key={m.key} style={{
                  background: 'rgba(19, 19, 21, 0.80)',
                  backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
                  padding: '8px 12px', borderRadius: 8,
                  borderLeft: `3px solid ${STATUS_COLORS[m.status]}`,
                  minWidth: 'calc(50% - 4px)', // Force 2 columns if space allows
                  flex: '1 1 calc(50% - 4px)',
                }}>
                  <div style={{
                    fontSize: 10, fontWeight: 600, textTransform: 'uppercase',
                    color: 'rgba(255, 255, 255, 0.6)', marginBottom: 2, letterSpacing: '0.04em',
                  }}>
                    {MUSCLE_LABELS[m.key] || m.key}
                  </div>
                  <div style={{
                    fontSize: 14, fontWeight: 700, color: '#fff',
                    fontFamily: "'Space Grotesk', sans-serif",
                  }}>
                    {m.label}
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>

      </div>

      {/* ── Check-in Modal ── */}
      {/* ⚠️ GAP-G8 FIX: Wrap in Portal to guarantee z-index layering above all Dashboard modals */}
      {showCheckIn && (
        <ModalPortal>
          <ReadinessCheckIn
            objectiveScore={objectiveScore}
            onClose={() => setShowCheckIn(false)}
          />
        </ModalPortal>
      )}

      {/* Log Weight Modal */}
      {showLog && (
        <ModalPortal>
        <div className="mo">
          <div className="md" style={{ maxWidth: 360 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div className="headline-md" style={{ color: 'var(--on-surface)' }}>Log Weight</div>
              <button className="btn-g" aria-label="Close modal" style={{ padding: '5px 9px' }} onClick={() => setShowLog(false)}><X size={14} /></button>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label>Select Weight ({isImpWeight ? 'lbs' : 'kg'})</label>
              <ScrollPicker value={isImpWeight ? kgToLbs(logWeight) : logWeight} onChange={v => setLogWeight(isImpWeight ? lbsToKg(v) : v)} items={wtItems} unit={isImpWeight ? 'lbs' : 'kg'} fmtVal={v => v.toFixed(1)} />
            </div>
            <div style={{ marginBottom: 16 }}><label>Notes (optional)</label><input placeholder="Post-morning, post-workout..." value={logNote} onChange={e => setLogNote(e.target.value)} /></div>
            <button className="btn-p" style={{ width: '100%', padding: '13px' }} onClick={saveLog}>Save Log</button>
          </div>
        </div>
        </ModalPortal>
      )}

      {/* Log Steps Modal */}
      {showStepModal && (
        <ModalPortal>
        <div className="mo">
          <div className="md" style={{ maxWidth: 360 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div className="headline-md" style={{ color: 'var(--on-surface)' }}>Log Steps</div>
              <button className="btn-g" aria-label="Close step modal" style={{ padding: '5px 9px' }} onClick={() => setShowStepModal(false)}><X size={14} /></button>
            </div>

            {/* Manual Entry */}
            <div style={{ marginBottom: 24 }}>
              <label style={{ fontSize: 13, color: 'var(--on-surface-variant)', marginBottom: 8, display: 'block' }}>Manual Entry</label>
              <div style={{ display: 'flex', gap: 12 }}>
                <input
                  type="number"
                  placeholder="e.g. 8500"
                  value={stepInputVal}
                  onChange={e => setStepInputVal(e.target.value)}
                  style={{ flex: 1, padding: '12px', background: 'var(--surface-container-highest)', borderRadius: 8, border: 'none', color: '#fff', fontSize: 16 }}
                />
                <button className="btn-p" style={{ padding: '0 20px' }} onClick={() => {
                  const val = parseInt(stepInputVal, 10);
                  if (val > 0) {
                    logSteps({ steps: val, date: todayStr, source: 'manual' });
                    addToast('Steps logged for today!', 'success');
                  }
                  setShowStepModal(false);
                }}>Save</button>
              </div>
            </div>

            <div style={{ height: 1, background: 'var(--surface-container-highest)', marginBottom: 24 }} />

            {/* Live Pedometer */}
            <div>
              <label style={{ fontSize: 13, color: 'var(--on-surface-variant)', marginBottom: 8, display: 'block' }}>Live Browser Sensor</label>
              {supported ? (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--surface-container-lowest)', padding: 16, borderRadius: 12, marginBottom: 16 }}>
                    <div style={{ fontSize: 13, color: 'var(--on-surface-variant)' }}>Live Steps</div>
                    <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--primary)' }}>{isTracking ? liveSteps : (displayStepLog?.source === 'browser_sensor' ? todaySteps : 0)}</div>
                  </div>
                  {pedoError && <div style={{ fontSize: 12, color: 'var(--error)', marginBottom: 12 }}>{pedoError}</div>}
                  {isTracking ? (
                    <button className="btn-g" style={{ width: '100%', padding: '13px' }} onClick={() => {
                      stopTracking();
                      logSteps({ steps: liveSteps, date: todayStr, source: 'browser_sensor' });
                      addToast('Tracking stopped & saved', 'success');
                    }}>Stop Tracking & Save</button>
                  ) : (
                    <button className="btn-p" style={{ width: '100%', padding: '13px', background: 'var(--signature-gradient)' }} onClick={startTracking}>
                      Start Live Tracking
                    </button>
                  )}
                </>
              ) : (
                <div style={{ fontSize: 12, color: 'var(--error)', background: 'rgba(239, 68, 68, 0.1)', padding: 12, borderRadius: 8 }}>
                  Device motion not supported on this browser/device.
                </div>
              )}
            </div>
            
          </div>
        </div>
        </ModalPortal>
      )}

      {/* Set Goal Modal */}
      {showGoal && (
        <ModalPortal>
        <div className="mo">
          <div className="md" style={{ maxWidth: 400 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <div className="headline-md" style={{ color: 'var(--on-surface)' }}>Set Weight Goal</div>
              <button className="btn-g" aria-label="Close goal modal" style={{ padding: '5px 9px' }} onClick={() => setShowGoal(false)}><X size={14} /></button>
            </div>
            <div style={{ fontSize: 12, color: 'var(--on-surface-variant)', marginBottom: 18 }}>Current: <strong style={{ color: 'var(--primary)' }}>{isImpWeight ? kgToLbs(latestWeight) + ' lbs' : latestWeight + ' kg'}</strong> · Your goal drives the calorie recommendations on the Diet page.</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 }}>
              <div><label>Target Weight ({isImpWeight ? 'lbs' : 'kg'})</label><ScrollPicker value={isImpWeight ? kgToLbs(goalTarget) : goalTarget} onChange={v => setGoalTarget(isImpWeight ? lbsToKg(v) : v)} items={wtItems} unit={isImpWeight ? 'lbs' : 'kg'} fmtVal={v => v.toFixed(1)} /></div>
              <div><label>Timeline (weeks)</label><ScrollPicker value={goalWeeks} onChange={setGoalWeeks} items={wkItems} unit="wks" /></div>
            </div>
            {goalTarget && goalWeeks && (
              <div style={{ padding: '12px 14px', background: 'var(--surface-container-highest)', borderRadius: 10, border: 'none', fontSize: 12, color: 'var(--primary)', marginBottom: 16 }}>
                {goalTarget < latestWeight
                  ? `Lose ${(latestWeight - goalTarget).toFixed(1)} kg in ${goalWeeks} weeks → ~${Math.round((latestWeight - goalTarget) * 7700 / goalWeeks / 7)} kcal/day deficit`
                  : goalTarget > latestWeight
                    ? `Gain ${(goalTarget - latestWeight).toFixed(1)} kg in ${goalWeeks} weeks — diet page will show surplus plan`
                    : 'Maintain current weight — diet page will show maintenance plan'}
              </div>
            )}
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn-p" style={{ flex: 1, padding: '13px' }} onClick={saveGoal}>Set Goal</button>
              {user.weightGoal && <button className="btn-g" style={{ padding: '13px 16px' }} onClick={async () => { await updateProfile({ weightGoal: null, weightGoalStart: null, goalWeeks: null }); setShowGoal(false); addToast('Goal cleared', 'info'); }}>Clear</button>}
            </div>
          </div>
        </div>
        </ModalPortal>
      )}
    </>
  );
}
