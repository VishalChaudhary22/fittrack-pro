import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Flame, Trophy, Target, ChevronDown, ChevronRight, X, Zap, Dumbbell, Activity, TrendingDown, TrendingUp, Footprints, Droplets, RefreshCw, Moon } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ScrollPicker, Portal, GlassTooltip, PulseIndicator, ProgressOrb, ThemeTogglePill } from '../shared/SharedComponents';
import BodyMapSVG from '../shared/BodyMapSVG';
import { calcBMI, getBMICat } from '../../utils/calculations';
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

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user, healthLogs, setHealthLogs, workoutLogs, splits, setUsers, addToast, getStreak, readinessLog } = useApp();
  const [showCheckIn, setShowCheckIn] = useState(false);
  const unitWeight = user.unitWeight || 'kg';
  const isImpWeight = unitWeight === 'lbs';
  
  const muscleXP = useMemo(() => calcAllMuscleXP(workoutLogs, splits, user?.id), [workoutLogs, splits, user?.id]);
  
  const objectiveScoreObj = useMemo(() => calcObjectiveReadiness(workoutLogs, user?.id), [workoutLogs, user?.id]);
  const objectiveScore = objectiveScoreObj.score;
  const loadRatio = objectiveScoreObj.loadRatio;

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

        {/* Placeholder Activity Cards (1fr 1fr 1fr) */}
        <div className="g3" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 16 }}>
          {[
            { label: 'DAILY ACTIVITY', icon: Footprints, unit: 'steps today' },
            { label: 'CALORIES BURNED', icon: Zap, unit: 'kcal today' },
            { label: 'WATER INTAKE', icon: Droplets, unit: 'ml today' }
          ].map(c => (
            <div key={c.label} className="glass-card" style={{ padding: 20, borderRadius: 16, border: 'none' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <div style={{ fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--on-surface-variant)' }}>{c.label}</div>
                <div className="ember-glow" style={{ width: 40, height: 40, borderRadius: 12, background: 'var(--surface-container-highest)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <c.icon size={18} color="var(--primary)" />
                </div>
              </div>
              <div className="headline-lg" style={{ color: 'var(--primary)', marginBottom: 4 }}>—</div>
              <div style={{ fontSize: 11, color: 'var(--on-surface-variant)', marginBottom: 12 }}>{c.unit}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <PulseIndicator />
                <span style={{ fontSize: 10, color: 'var(--on-surface-dim)' }}>Coming Soon</span>
              </div>
            </div>
          ))}
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
          borderRadius: 24, padding: 24,
          background: 'var(--surface-container-low)',
          border: '1px solid var(--surface-container-highest)',
          overflow: 'hidden', minHeight: 380,
          display: 'flex', flexDirection: 'column',
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
        }}>

          {/* ── Layer 1: Body Silhouette Background ── */}
          <div style={{
            position: 'absolute', top: 30, right: 0, bottom: 0, left: 0, // centered
            opacity: 0.65, zIndex: 0, pointerEvents: 'none',
          }}>

            {/* Body map — darkened via CSS filter on the wrapper */}
            {/* ⚠️ GAP-G1 resolved: Option C — full BodyMapSVG (front+back) constrained + darkened */}
            {/* muscleXP reused from L29 (GAP-G4) — no redeclaration needed */}
            <div style={{
              filter: 'grayscale(45%) brightness(0.42) contrast(1.15)',
              maxWidth: 260, margin: '0 auto',
              // Constrains the dual-panel canvas to a centered column
              // The gradient overlay below visually unifies the two panels
            }}>
              <BodyMapSVG
                muscleXP={muscleXP}    // ← reuses existing muscleXP from DashboardPage L29
                gender={user?.gender}
                mini={false}
              />
            </div>

            {/* Bottom fade overlay (creates ground depth + text legibility) */}
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0, height: '45%',
              background: 'linear-gradient(to top, var(--surface-container-low) 10%, rgba(20,20,22,0.85) 45%, transparent 100%)',
            }} />
          </div>

          {/* ── Layer 2: Top Header & Badges ── */}
          <div style={{
            position: 'relative', zIndex: 1,
            display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
            marginBottom: 'auto', // pushes everything else down
          }}>
            {/* Score Badge (Glassmorphic) */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.04)',
              backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              borderRadius: 20, padding: '16px 20px',
              display: 'flex', flexDirection: 'column', gap: 4,
            }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--on-surface-variant)' }}>
                Daily Score
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                <span style={{
                  fontFamily: "'Space Grotesk', sans-serif", fontSize: '3rem',
                  fontWeight: 800, lineHeight: 1, color: activeTier.color,
                }}>
                  {activeScore}
                </span>
                <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--on-surface)' }}>
                  {activeTier.label}
                </span>
              </div>

              {/* Check-in CTA or Status */}
              <button
                onClick={() => setShowCheckIn(true)}
                style={{
                  marginTop: 6, display: 'flex', alignItems: 'center', gap: 6,
                  background: 'none', border: 'none', padding: 0, cursor: 'pointer',
                  fontSize: 11, fontWeight: 600, color: 'var(--primary)',
                }}
              >
                {!todayReadiness?.checkInComplete ? (
                  <>Complete Check-In <ChevronRight size={12} /></>
                ) : (
                  <><RefreshCw size={11} /> Update Check-In</>
                )}
              </button>
            </div>

            {/* Muscle Recovery Status Legend */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-end' }}>
              <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--on-surface-dim)', marginBottom: 2 }}>
                Recovery Status
              </div>
              {/* Legend Items */}
              {[
                { label: 'Optimal',  color: STATUS_COLORS.optimal },
                { label: 'Fatigued', color: STATUS_COLORS.fatigued },
                { label: 'Critical', color: STATUS_COLORS.critical },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 11, color: 'var(--on-surface-variant)', fontWeight: 600 }}>{item.label}</span>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: item.color, boxShadow: `0 0 6px ${item.color}80` }} />
                </div>
              ))}
            </div>
          </div>

          {/* ── Layer 3: Factor Pills (Training Load summary) ── */}
          <div style={{ position: 'relative', zIndex: 1, display: 'flex', gap: 8, marginTop: '15%' }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.03)', backdropFilter: 'blur(8px)',
              padding: '6px 12px', borderRadius: 20, display: 'flex', alignItems: 'center', gap: 6,
              border: '1px solid rgba(255, 255, 255, 0.05)'
            }}>
              <Activity size={12} color="var(--primary)" />
              <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--on-surface)' }}>
                {loadRatio > 1.2 ? 'High Load' : loadRatio > 0.8 ? 'Opt. Load' : 'Low Load'}
              </span>
            </div>
            {todayReadiness?.checkInComplete && (
              <div style={{
                background: 'rgba(255, 255, 255, 0.03)', backdropFilter: 'blur(8px)',
                padding: '6px 12px', borderRadius: 20, display: 'flex', alignItems: 'center', gap: 6,
                border: '1px solid rgba(255, 255, 255, 0.05)'
              }}>
                <Moon size={12} color="var(--primary)" />
                <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--on-surface)' }}>
                  {todayReadiness.sleepHours}h Sleep
                </span>
              </div>
            )}
          </div>

          {/* ── Layer 4: Muscle Recovery Chips (bottom overlay) ── */}
          {/* ⚠️ GAP-G6 FIX: Use var(--surface-container) instead of rgba for light theme compatibility */}
          {/* ⚠️ GAP-G12: Guard with spotlightMuscles.length check — during first render before useMemo */}
          {/*             resolves, array may be empty. The guard prevents rendering an empty chip row. */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 5,
            padding: '56px 16px 20px', // top padding = fade space
            display: 'flex', flexWrap: 'wrap', gap: 8,
          }}>
            {spotlightMuscles.length === 0 ? null : spotlightMuscles.map(m => (
              <div key={m.key} style={{
                // ⚠️ GAP-G6 FIX: was rgba(14,14,16,0.82) — breaks light mode. Use CSS var instead:
                background: 'var(--surface-container)',
                border: '1px solid var(--outline-variant)', // definition on light backgrounds
                backdropFilter: 'blur(14px)',
                borderRadius: 12, padding: '9px 14px',
                borderLeft: `3px solid ${STATUS_COLORS[m.status]}`,
                minWidth: 100,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--on-surface)' }}>
                    {MUSCLE_LABELS[m.key] || m.key}
                  </span>
                  <div style={{ width: 4, height: 4, borderRadius: '50%', background: STATUS_COLORS[m.status] }} />
                </div>
                <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--on-surface-dim)' }}>
                  {m.label}
                </div>
              </div>
            ))}
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
