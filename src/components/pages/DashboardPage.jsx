import { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Flame, Trophy, Target, ChevronDown, ChevronRight, X, Zap, Dumbbell, Activity, TrendingDown, TrendingUp, Footprints, Droplets, RefreshCw } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ScrollPicker, Portal, GlassTooltip, PulseIndicator, ProgressOrb, ThemeTogglePill } from '../shared/SharedComponents';

import { calcBMI, getBMICat, calcBMR, calcTDEE, calcDeficit } from '../../utils/calculations';
import { gId, tod, fmt, clamp, mkWtItems, mkIntItems, kgToLbs, lbsToKg, mkWtItemsImperial } from '../../utils/helpers';
import { calcAllMuscleXP } from '../../data/muscleData';
import {
  calcObjectiveReadiness,
  getMuscleRecoveryStatuses,
  getTier,
  getSpotlightMuscles,
  STATUS_COLORS,
  MUSCLE_LABELS,
} from '../../utils/readinessUtils';
import ReadinessCheckIn from '../shared/ReadinessCheckIn';

const getBMIInsight = (bmi) => {
  if (!bmi) return '';
  if (bmi < 16)   return "Severely underweight. Consult a nutritionist and increase caloric intake immediately.";
  if (bmi < 18.5) return "You're underweight. A caloric surplus with protein focus will help build lean mass.";
  if (bmi < 25)   return "You're within the healthy range. Maintain current caloric deficit to hit peak definition.";
  if (bmi < 30)   return "Slightly above the healthy range. A moderate deficit and strength training will get you there.";
  if (bmi < 35)   return "Obese range detected. Focus on a sustainable caloric deficit and daily movement.";
  return "High obesity range. Prioritise medical guidance alongside your fitness plan.";
};

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
  const navigate = useNavigate();
  const { user, healthLogs, setHealthLogs, workoutLogs, splits, setUsers, addToast, getStreak, readinessLog, foodLog } = useApp();
  const [showCheckIn, setShowCheckIn] = useState(false);
  const unitWeight = user.unitWeight || 'kg';
  const isImpWeight = unitWeight === 'lbs';
  
  const muscleXP = useMemo(() => calcAllMuscleXP(workoutLogs, splits, user?.id), [workoutLogs, splits, user?.id]);
  
  const objectiveScoreObj = useMemo(() => calcObjectiveReadiness(workoutLogs, user?.id), [workoutLogs, user?.id]);
  const objectiveScore = objectiveScoreObj.score;


  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);
  const todayReadiness = useMemo(() => readinessLog.find(r => r.userId === user?.id && r.date === todayStr), [readinessLog, user?.id, todayStr]);

  const activeScore = todayReadiness?.checkInComplete ? todayReadiness.score : objectiveScore;
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
    if (!todayReadiness && user?.id) {
      const timer = setTimeout(() => setShowCheckIn(true), 1400);
      return () => clearTimeout(timer);
    }
  }, [todayReadiness, user?.id]); // intentional — todayReadiness is stable per-render

  const allUserLogs = useMemo(() => [...healthLogs].filter(l => l.userId === user.id || l.userId === 'vishal').sort((a, b) => new Date(a.date) - new Date(b.date)), [healthLogs, user.id]);
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
  const userWo = workoutLogs.filter(l => l.userId === user.id || l.userId === 'vishal');
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

  // Phase 3: Dashboard Macro Widget Data
  const todayLog = useMemo(() => foodLog.filter(l => l.userId === user.id && l.date === todayStr), [foodLog, user.id, todayStr]);
  const todayTotals = useMemo(() => {
    return todayLog.reduce((acc, item) => ({
      calories: acc.calories + (item.macros?.calories || 0),
      protein: acc.protein + (item.macros?.protein || 0),
      carbs: acc.carbs + (item.macros?.carbs || 0),
      fat: acc.fat + (item.macros?.fat || 0)
    }), { calories: 0, protein: 0, carbs: 0, fat: 0 });
  }, [todayLog]);

  const { goalKcal, protTarget, carbTarget, fatTarget } = useMemo(() => {
    const bmr = calcBMR(latestWeight, user.height, user.age, user.gender);
    const tdee = calcTDEE(bmr, user.activityLevel || 'moderate');
    const deficitInfo = calcDeficit(latestWeight, user.weightGoal, user.goalWeeks);
    const goal = deficitInfo.goal;
    const dailyDelta = deficitInfo.dailyDelta || (goal === 'loss' ? 500 : goal === 'gain' ? 400 : 0);
    const k = goal === 'loss' ? tdee - dailyDelta : goal === 'gain' ? tdee + dailyDelta : tdee;

    const baseWeightForProtein = (goal === 'loss' && user.weightGoal && user.weightGoal < latestWeight) ? user.weightGoal : latestWeight;
    
    return {
      goalKcal: Math.round(k),
      protTarget: goal === 'loss' ? Math.round(baseWeightForProtein * 2.2) : goal === 'gain' ? Math.round(latestWeight * 2.0) : Math.round(latestWeight * 1.8),
      carbTarget: Math.round((k * (goal === 'loss' ? .38 : .44)) / 4),
      fatTarget: Math.round((k * .26) / 9),
    };
  }, [user, latestWeight]);

  const calPct = clamp(Math.round((todayTotals.calories / goalKcal) * 100) || 0, 0, 100);

  const saveLog = () => {
    const w = parseFloat(logWeight);
    if (!w || isNaN(w)) return;
    setHealthLogs(p => [...p, { id: gId(), userId: user.id, date: tod(), weight: w, notes: logNote }]);
    setLogNote(''); setShowLog(false);
    addToast(`Weight logged: ${isImpWeight ? kgToLbs(w) + ' lbs' : w + ' kg'}`, 'success');
  };

  const saveGoal = () => {
    setUsers(p => p.map(u => u.id === user.id ? { ...u, weightGoal: goalTarget, weightGoalStart: latestWeight, goalWeeks: goalWeeks, goalSetDate: tod() } : u));
    setShowGoal(false);
    addToast('Weight goal updated!', 'success');
  };

  const wtItems = isImpWeight ? mkWtItemsImperial(66, 440, 1) : mkWtItems(30, 200, 0.5);
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
            WELCOME BACK,<br/>
            <span className="text-gradient-primary">{user.name.split(' ')[0].toUpperCase()}</span>
          </div>
          <div style={{ fontSize: 12, color: 'var(--on-surface-variant)', marginTop: 8 }}>
            {new Date().toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
          <Dumbbell size={120} style={{ position: 'absolute', top: -16, right: -16, opacity: 0.06, color: 'var(--on-surface)' }} />
          <button className="btn-p" style={{ position: 'absolute', top: 0, right: 0, padding: '7px 13px', fontSize: 10 }} onClick={() => setShowLog(true)}>
            + Log Weight
          </button>
          <div style={{ position: 'absolute', top: 38, right: 0 }}>
            <ThemeTogglePill />
          </div>
        </header>

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
                    {isImpWeight ? kgToLbs(latestWeight) : latestWeight}
                  </span>
                  <span style={{ fontSize: 13, color: 'var(--on-surface-variant)' }}>{isImpWeight ? 'lbs' : 'kg'}</span>
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
          <div className="glass-card" style={{ padding: 24, borderRadius: 16, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', position: 'relative', border: 'none' }}>
            <Activity size={28} style={{ position: 'absolute', top: 16, right: 16, opacity: 0.15, color: 'var(--on-surface)' }} />
            <div style={{ fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--on-surface-variant)', marginBottom: 16 }}>METABOLIC INDEX</div>
            
            <div style={{ position: 'relative', width: 140, height: 140, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
              <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '4px solid var(--surface-container-lowest)' }}></div>
              <div className="ember-glow" style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '4px solid var(--primary-container)', borderTopColor: 'transparent', borderRightColor: 'transparent', transform: 'rotate(45deg)' }}></div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span className="headline-lg" style={{ fontSize: '2.5rem', color: 'var(--on-surface)' }}>{bmi || '—'}</span>
                <span style={{ fontSize: 10, color: 'var(--primary-container)', marginTop: 4, fontWeight: 700 }}>{bmiCat.label}</span>
              </div>
            </div>
            
            <div style={{ fontSize: 11, color: 'var(--on-surface-variant)', textAlign: 'center', padding: '0 8px', lineHeight: 1.4, marginTop: 12, marginBottom: 12 }}>
              {getBMIInsight(bmi)}
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 5, width: '100%' }}>
              {[{ l: 'Under', r: '<18.5' }, { l: 'Normal', r: '18.5–25' }, { l: 'Over', r: '25–30' }, { l: 'Obese', r: '>30' }].map(s => {
                const isActive = bmiCat.label.startsWith(s.l);
                return (
                  <div key={s.l} style={{ textAlign: 'center', padding: '5px', borderRadius: 8, background: isActive ? 'var(--surface-container-highest)' : 'var(--surface-container-lowest)', color: isActive ? 'var(--primary)' : 'var(--on-surface-variant)' }}>
                    <div style={{ fontSize: 10, fontWeight: 700 }}>{s.l}</div>
                    <div style={{ fontSize: 9, opacity: 0.7 }}>{s.r}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sessions + Streak Row (1fr 1fr) */}
        <div className="g2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          {/* Sessions */}
          <div className="glass-card" style={{ padding: 24, borderRadius: 16, border: 'none', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 16 }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
               <div>
                 <div style={{ fontSize: 10, textTransform: 'uppercase', color: 'var(--on-surface-variant)', fontWeight: 700 }}>Sessions / Week</div>
                 <div className="headline-lg" style={{ color: 'var(--primary)' }}>{thisWk}</div>
               </div>
               <div style={{ width: 42, height: 42, borderRadius: 12, background: 'var(--surface-container-highest)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Flame size={20} color="var(--primary)" /></div>
             </div>
             
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
               <div>
                 <div style={{ fontSize: 10, textTransform: 'uppercase', color: 'var(--on-surface-variant)', fontWeight: 700 }}>All Time Sessions</div>
                 <div className="headline-lg" style={{ color: 'var(--on-surface)' }}>{userWo.length}</div>
               </div>
               <div style={{ width: 42, height: 42, borderRadius: 12, background: 'var(--surface-container-highest)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Trophy size={20} color="var(--on-surface)" /></div>
             </div>
          </div>

          {/* Streak */}
          <div className="glass-card" style={{ padding: 24, borderRadius: 16, border: 'none', display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 50, height: 50, borderRadius: 14, background: 'var(--surface-container-highest)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--glow-primary)' }}><Flame size={24} color="var(--primary)" /></div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', gap: 20, alignItems: 'baseline', marginBottom: 6 }}>
                <div>
                  <div style={{ fontSize: 10, color: 'var(--on-surface-dim)', fontWeight: 700, textTransform: 'uppercase' }}>Current Streak</div>
                  <div className="headline-lg" style={{ color: 'var(--primary)' }}>{streak.current}<span style={{ fontSize: 14, color: 'var(--on-surface-variant)', fontFamily: "'Be Vietnam Pro', sans-serif", marginLeft: 3 }}>days</span></div>
                </div>
                <div>
                  <div style={{ fontSize: 10, color: 'var(--on-surface-dim)', fontWeight: 700, textTransform: 'uppercase' }}>Best Streak</div>
                  <div className="headline-lg" style={{ color: 'var(--on-surface)' }}>{streak.longest}<span style={{ fontSize: 14, color: 'var(--on-surface-variant)', fontFamily: "'Be Vietnam Pro', sans-serif", marginLeft: 3 }}>days</span></div>
                </div>
              </div>
              {streak.current >= 3 && <span className="tag" style={{ fontSize: 10, margin: 0 }}><Zap size={10} /> On Fire!</span>}
            </div>
          </div>
        </div>

        {/* Today's Nutrition (Phase 3 Macro Widget) */}
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
                { label: 'Fats', val: todayTotals.fat, target: fatTarget, color: '#f59e0b' }
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

        {/* Daily Activity (Similar to Today's Nutrition) */}
        <div className="glass-card" style={{ padding: 24, borderRadius: 16, border: 'none', marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div>
              <div style={{ fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--on-surface-variant)', fontWeight: 700 }}>DAILY ACTIVITY</div>
              <div className="headline-md" style={{ color: 'var(--on-surface)', marginTop: 2 }}>0 / 10K <span style={{ fontSize: 14, color: 'var(--on-surface-variant)' }}>Steps</span></div>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
            <div style={{ flexShrink: 0 }}>
               <ProgressOrb progress={0} size={90} label={`0%`} subLabel="Steps" color="var(--primary)" />
            </div>
            
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { label: 'Steps', val: 0, target: 10000, color: 'var(--primary)' },
                { label: 'Cals Burned', val: 0, target: 500, color: '#F85F1B' },
                { label: 'Water', val: 0, target: 3000, color: '#3b82f6', unit: 'ml' }
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
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr) minmax(0,1fr)', gap: 10, marginBottom: 14 }}>
              {[{ l: 'Target', v: isImpWeight ? `${kgToLbs(user.weightGoal)} lbs` : `${user.weightGoal} kg` }, { l: 'Remaining', v: `${kgLeft} ${isImpWeight ? 'lbs' : 'kg'} ${isLoss ? 'to lose' : 'to gain'}` }, { l: 'Weeks Left', v: weeksLeft !== null ? `${weeksLeft} wks` : '—' }].map(s => (
                <div key={s.l} style={{ background: 'var(--surface-container-highest)', borderRadius: 10, padding: '10px 12px', border: 'none' }}>
                  <div style={{ fontSize: 10, color: 'var(--on-surface-dim)', fontWeight: 700, textTransform: 'uppercase', marginBottom: 3 }}>{s.l}</div>
                  <div className="headline-md" style={{ color: 'var(--primary)' }}>{s.v}</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
              <ProgressOrb progress={goalPct} size={80} label={`${goalPct}%`} subLabel="Done" />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--on-surface-variant)', fontWeight: 600 }}>
                  <span>{isImpWeight ? kgToLbs(user.weightGoalStart) + ' lbs' : user.weightGoalStart + ' kg'} (start)</span><span>{isImpWeight ? kgToLbs(user.weightGoal) + ' lbs' : user.weightGoal + ' kg'} (goal)</span>
                </div>
              </div>
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
        <Portal>
          <ReadinessCheckIn
            objectiveScore={objectiveScore}
            onClose={() => setShowCheckIn(false)}
          />
        </Portal>
      )}

      {/* Log Weight Modal */}
      {showLog && (
        <Portal>
        <div className="mo">
          <div className="md" style={{ maxWidth: 360 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div className="headline-md" style={{ color: 'var(--on-surface)' }}>Log Weight</div>
              <button className="btn-g" style={{ padding: '5px 9px' }} onClick={() => setShowLog(false)}><X size={14} /></button>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label>Select Weight ({isImpWeight ? 'lbs' : 'kg'})</label>
              <ScrollPicker value={isImpWeight ? kgToLbs(logWeight) : logWeight} onChange={v => setLogWeight(isImpWeight ? lbsToKg(v) : v)} items={wtItems} unit={isImpWeight ? 'lbs' : 'kg'} fmtVal={v => v.toFixed(1)} />
            </div>
            <div style={{ marginBottom: 16 }}><label>Notes (optional)</label><input placeholder="Post-morning, post-workout..." value={logNote} onChange={e => setLogNote(e.target.value)} /></div>
            <button className="btn-p" style={{ width: '100%', padding: '13px' }} onClick={saveLog}>Save Log</button>
          </div>
        </div>
        </Portal>
      )}

      {/* Set Goal Modal */}
      {showGoal && (
        <Portal>
        <div className="mo">
          <div className="md" style={{ maxWidth: 400 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <div className="headline-md" style={{ color: 'var(--on-surface)' }}>Set Weight Goal</div>
              <button className="btn-g" style={{ padding: '5px 9px' }} onClick={() => setShowGoal(false)}><X size={14} /></button>
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
              {user.weightGoal && <button className="btn-g" style={{ padding: '13px 16px' }} onClick={() => { setUsers(p => p.map(u => u.id === user.id ? { ...u, weightGoal: null, weightGoalStart: null, goalWeeks: null } : u)); setShowGoal(false); addToast('Goal cleared', 'info'); }}>Clear</button>}
            </div>
          </div>
        </div>
        </Portal>
      )}
    </>
  );
}
