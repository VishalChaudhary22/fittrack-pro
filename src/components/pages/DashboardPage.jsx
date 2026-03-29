import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Scale, BarChart2, Ruler, Flame, Trophy, Target, ChevronDown, ChevronRight, Check, X, Zap, Repeat, Dumbbell, Home, Award, Activity, Shield } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatCard, PageHeader, ScrollPicker, SkeletonCard, Portal } from '../shared/SharedComponents';
import { MiniBodyMap } from '../shared/BodyMapSVG';
import { calcBMI, getBMICat } from '../../utils/calculations';
import { gId, tod, fmt, clamp, mkWtItems, mkIntItems, displayWeight, displayHeight, kgToLbs, lbsToKg, mkWtItemsImperial } from '../../utils/helpers';
import { calcAllMuscleXP, getWeeklyMuscles, getOverallRank, MUSCLE_GROUPS } from '../../data/muscleData';
import { useState as useStateR, useEffect } from 'react';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user, healthLogs, setHealthLogs, workoutLogs, splits, setUsers, addToast, getStreak } = useApp();
  const unitWeight = user.unitWeight || 'kg';
  const isImpWeight = unitWeight === 'lbs';
  const unitHeight = user.unitHeight || 'cm';
  const isImpHeight = unitHeight === 'ft';
  const weeklyMuscles = useMemo(() => getWeeklyMuscles(workoutLogs, splits, user?.id), [workoutLogs, splits, user?.id]);
  const muscleXP = useMemo(() => calcAllMuscleXP(workoutLogs, splits, user?.id), [workoutLogs, splits, user?.id]);
  const overallRank = useMemo(() => getOverallRank(muscleXP), [muscleXP]);
  const [showLog, setShowLog] = useState(false);
  const [showGoal, setShowGoal] = useState(false);
  const [logWeight, setLogWeight] = useState(user.weight);
  const [logNote, setLogNote] = useState('');
  const [goalTarget, setGoalTarget] = useState(user.weightGoal || user.weight - 5);
  const [goalWeeks, setGoalWeeks] = useState(user.goalWeeks || 12);
  const [loaded, setLoaded] = useStateR(false);

  useEffect(() => { const t = setTimeout(() => setLoaded(true), 300); return () => clearTimeout(t); }, []);

  const allUserLogs = useMemo(() => [...healthLogs].filter(l => l.userId === user.id || l.userId === 'vishal').sort((a, b) => new Date(a.date) - new Date(b.date)), [healthLogs, user.id]);
  const latestWeight = allUserLogs.length > 0 ? allUserLogs[allUserLogs.length - 1].weight : user.weight;
  const bmi = calcBMI(latestWeight, user.height);
  const bmiCat = getBMICat(bmi);
  const chartData = useMemo(() => allUserLogs.map(l => ({ date: fmt(l.date), weight: l.weight, raw: new Date(l.date).getTime() })), [allUserLogs]);

  const trend = useMemo(() => {
    if (allUserLogs.length < 2) return undefined;
    const latest = allUserLogs[allUserLogs.length - 1].weight;
    const previous = allUserLogs[allUserLogs.length - 2].weight;
    return +(latest - previous).toFixed(1);
  }, [allUserLogs]);

  const activeSplit = splits.find(s => s.id === user.activeSplitId);
  const userWo = workoutLogs.filter(l => l.userId === user.id || l.userId === 'vishal');
  const recent = [...userWo].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 3);
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
      <PageHeader title="Loading..." />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(148px,1fr))', gap: 10 }}>
        {[1, 2, 3, 4, 5].map(i => <SkeletonCard key={i} />)}
      </div>
    </div>
  );

  return (
    <div className="pg-in">
      <PageHeader title={`Hey, ${user.name.split(' ')[0]}`} sub={new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        action={<button className="btn-p" style={{ padding: '10px 18px', fontSize: 13 }} onClick={() => setShowLog(true)}>+ Log Weight</button>} />

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(148px,1fr))', gap: 10, marginBottom: 14 }}>
        <StatCard label="Current Weight" value={isImpWeight ? kgToLbs(latestWeight) : latestWeight} unit={isImpWeight ? 'lbs' : 'kg'} Icon={Scale} trend={trend ? (isImpWeight ? +(trend * 2.20462).toFixed(1) : trend) : undefined} />
        <StatCard label="BMI" value={bmi || '—'} unit="" Icon={BarChart2} sub={bmiCat.label} />
        <StatCard label="Height" value={displayHeight(user.height, unitHeight).replace(/ cm$/, '')} unit={isImpHeight ? '' : 'cm'} Icon={Ruler} />
        <StatCard label="Sessions / Week" value={thisWk} unit="" Icon={Flame} sub="this week" />
        <StatCard label="All Time" value={userWo.length} unit="" Icon={Trophy} sub="sessions" />
      </div>

      {/* Streak Card */}
      <div className="card stripe" style={{ padding: '14px 16px', marginBottom: 14, display: 'flex', gap: 14, alignItems: 'center' }}>
        <div style={{ width: 42, height: 42, borderRadius: 12, background: 'var(--o2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Flame size={20} color="var(--o)" /></div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', gap: 16, alignItems: 'baseline' }}>
            <div>
              <div style={{ fontSize: 10, color: 'var(--t3)', fontWeight: 700, textTransform: 'uppercase' }}>Current Streak</div>
              <div className="bb" style={{ fontSize: 28, color: 'var(--o)' }}>{streak.current}<span style={{ fontSize: 14, color: 'var(--t2)', fontFamily: "'DM Sans'", marginLeft: 3 }}>days</span></div>
            </div>
            <div>
              <div style={{ fontSize: 10, color: 'var(--t3)', fontWeight: 700, textTransform: 'uppercase' }}>Best Streak</div>
              <div className="bb" style={{ fontSize: 28, color: 'var(--tx)' }}>{streak.longest}<span style={{ fontSize: 14, color: 'var(--t2)', fontFamily: "'DM Sans'", marginLeft: 3 }}>days</span></div>
            </div>
          </div>
        </div>
        {streak.current >= 3 && <span className="tag" style={{ fontSize: 9 }}><Zap size={10} /> On Fire!</span>}
      </div>

      {/* Goal Progress Card */}
      <div className="card stripe" style={{ padding: '18px 20px', marginBottom: 14, cursor: 'pointer', transition: 'opacity .2s' }} onClick={() => setShowGoal(true)}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <div style={{ width: 34, height: 34, borderRadius: 9, background: 'var(--o2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Target size={16} color="var(--o)" /></div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14 }}>Weight Goal</div>
              <div style={{ fontSize: 11, color: 'var(--t2)' }}>Tap to update your target</div>
            </div>
          </div>
          <ChevronDown size={14} color="var(--t3)" />
        </div>
        {user.weightGoal ? (<>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 14 }}>
            {[{ l: 'Target', v: isImpWeight ? `${kgToLbs(user.weightGoal)} lbs` : `${user.weightGoal} kg` }, { l: 'Remaining', v: `${kgLeft} ${isImpWeight ? 'lbs' : 'kg'} ${isLoss ? 'to lose' : 'to gain'}` }, { l: 'Weeks Left', v: weeksLeft !== null ? `${weeksLeft} wks` : '—' }].map(s => (
              <div key={s.l} style={{ background: 'var(--c2)', borderRadius: 10, padding: '10px 12px', border: '1px solid var(--bd)' }}>
                <div style={{ fontSize: 10, color: 'var(--t3)', fontWeight: 700, textTransform: 'uppercase', marginBottom: 3 }}>{s.l}</div>
                <div style={{ fontFamily: "'Bebas Neue'", fontSize: 20, color: 'var(--o)', letterSpacing: '1px' }}>{s.v}</div>
              </div>
            ))}
          </div>
          <div style={{ marginBottom: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: 12, color: 'var(--t2)' }}>Goal Completion</div>
            <div style={{ fontSize: 12, color: 'var(--o)', fontWeight: 700 }}>{goalPct}%</div>
          </div>
          <div className="pbar"><div className="pbar-fill" style={{ width: `${goalPct}%` }} /></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--t3)', marginTop: 5 }}>
            <span>{isImpWeight ? kgToLbs(user.weightGoalStart) + ' lbs' : user.weightGoalStart + ' kg'} (start)</span><span>{isImpWeight ? kgToLbs(user.weightGoal) + ' lbs' : user.weightGoal + ' kg'} (goal)</span>
          </div>
        </>) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px', background: 'var(--c2)', borderRadius: 10, border: '1px dashed var(--bd2)' }}>
            <Target size={14} color="var(--t3)" />
            <span style={{ fontSize: 13, color: 'var(--t2)' }}>Set your target weight & timeline</span>
            <ChevronRight size={13} color="var(--t3)" style={{ marginLeft: 'auto' }} />
          </div>
        )}
      </div>

      {/* Chart + BMI */}
      <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 12, marginBottom: 12 }} className="g2">
        <div className="card" style={{ padding: 18 }}>
          <div style={{ fontSize: 11, color: 'var(--t3)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 12 }}>Weight Trend</div>
          <ResponsiveContainer width="100%" height={170}>
            <AreaChart data={chartData}>
              <defs><linearGradient id="wg" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#E8540D" stopOpacity={.18} /><stop offset="95%" stopColor="#E8540D" stopOpacity={0} /></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--bd)" />
              <XAxis dataKey="date" tick={{ fill: 'var(--t3)', fontSize: 9 }} interval="preserveStartEnd" />
              <YAxis domain={['auto', 'auto']} tick={{ fill: 'var(--t3)', fontSize: 9 }} width={38} />
              <Tooltip contentStyle={{ background: 'var(--c2)', border: '1px solid var(--bd)', borderRadius: 10, fontSize: 12 }} />
              <Area type="monotone" dataKey="weight" stroke="#E8540D" strokeWidth={2} fill="url(#wg)" dot={{ fill: '#E8540D', r: 3, strokeWidth: 0 }} activeDot={{ r: 5 }} name="Weight (kg)" />
              {user.weightGoal && <ReferenceLine y={user.weightGoal} stroke="rgba(232,84,13,.4)" strokeDasharray="5 5" label={{ value: 'Goal', fill: 'var(--o)', fontSize: 10, position: 'insideTopRight' }} />}
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="card" style={{ padding: 18, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <div style={{ fontSize: 10, color: 'var(--t3)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.5px' }}>BMI Status</div>
          <div className="bb" style={{ fontSize: 58, color: 'var(--o)', lineHeight: 1 }}>{bmi || '—'}</div>
          <span className="tag" style={{ fontSize: 11 }}>{bmiCat.label}</span>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 5, width: '100%', marginTop: 4 }}>
            {[{ l: 'Under', r: '<18.5' }, { l: 'Normal', r: '18.5–25' }, { l: 'Over', r: '25–30' }, { l: 'Obese', r: '>30' }].map(s => (
              <div key={s.l} style={{ textAlign: 'center', padding: '5px', borderRadius: 8, background: bmiCat.label.startsWith(s.l) ? 'var(--o2)' : 'var(--c2)', border: `1px solid ${bmiCat.label.startsWith(s.l) ? 'rgba(232,84,13,.35)' : 'var(--bd)'}` }}>
                <div style={{ fontSize: 10, color: bmiCat.label.startsWith(s.l) ? 'var(--o)' : 'var(--t2)', fontWeight: 700 }}>{s.l}</div>
                <div style={{ fontSize: 9, color: 'var(--t3)' }}>{s.r}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Active Split + Recent */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 12 }} className="g2">
        <div className="card" style={{ padding: 18 }}>
          <div style={{ fontSize: 11, color: 'var(--t3)', fontWeight: 700, textTransform: 'uppercase', marginBottom: 12 }}>Active Split</div>
          {activeSplit ? <>
            <div style={{ fontFamily: "'Bebas Neue'", fontSize: 20, color: 'var(--o)', letterSpacing: '1px', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 8 }}>{(() => { const I = { Repeat, Zap, Target, Dumbbell, Trophy, Home, Award }[activeSplit.icon] || Flame; return <I size={16} />; })()}{activeSplit.name}</div>
            <div style={{ fontSize: 12, color: 'var(--t2)', marginBottom: 12 }}>{activeSplit.description}</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {activeSplit.schedule.map((d, i) => (
                <div key={i} style={{ padding: '3px 8px', borderRadius: 6, fontSize: 10, fontWeight: 600, background: d === 'Rest' ? 'var(--c2)' : 'var(--o2)', color: d === 'Rest' ? 'var(--t3)' : 'var(--o)', border: `1px solid ${d === 'Rest' ? 'var(--bd)' : 'rgba(232,84,13,.3)'}` }}>D{i + 1}: {d}</div>
              ))}
            </div>
          </> : <div style={{ color: 'var(--t2)', fontSize: 13 }}>No split active</div>}
        </div>
        <div className="card" style={{ padding: 18 }}>
          <div style={{ fontSize: 11, color: 'var(--t3)', fontWeight: 700, textTransform: 'uppercase', marginBottom: 12 }}>Recent Sessions</div>
          {recent.length === 0 ? <div style={{ color: 'var(--t3)', fontSize: 13 }}>No sessions yet — go crush it!</div> :
            recent.map(w => (
              <div key={w.id} className="row-sep" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{w.dayName}</div>
                  <div style={{ fontSize: 11, color: 'var(--t2)', marginTop: 2 }}>{fmt(w.date)} · {w.exercises?.length || 0} exercises</div>
                </div>
                <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--o2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Check size={12} color="var(--o)" /></div>
              </div>
            ))}
        </div>
      </div>

      {/* Muscle Activity Widget */}
      <div className="card" style={{ padding: 18, cursor: 'pointer', marginTop: 12 }} onClick={() => navigate('/muscle-map')}
        onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.01)'; }} onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <div style={{ fontSize: 11, color: 'var(--t3)', fontWeight: 700, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Activity size={13} color="var(--o)" /> Muscle Activity
          </div>
          <ChevronRight size={14} color="var(--t3)" />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <MiniBodyMap weeklyMuscles={weeklyMuscles} gender={user?.gender} />
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
              <Shield size={14} color={overallRank.color} />
              <span className="bb" style={{ fontSize: 18, color: overallRank.color }}>{overallRank.name}</span>
            </div>
            <div style={{ fontSize: 11, color: 'var(--t2)', marginBottom: 8 }}>{Math.round(overallRank.totalXP).toLocaleString()} Total XP</div>
            <div style={{ fontSize: 10, color: 'var(--t3)', marginBottom: 4 }}>This week: {weeklyMuscles.length}/{MUSCLE_GROUPS.length} muscle groups trained</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
              {weeklyMuscles.slice(0, 6).map(m => (
                <span key={m} style={{ padding: '2px 6px', borderRadius: 4, background: 'var(--c3)', color: 'var(--t2)', fontSize: 8, fontWeight: 700, textTransform: 'uppercase' }}>{m}</span>
              ))}
              {weeklyMuscles.length > 6 && <span style={{ fontSize: 8, color: 'var(--t3)', padding: '2px 4px' }}>+{weeklyMuscles.length - 6}</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Log Weight Modal */}
      {showLog && (
        <Portal>
        <div className="mo">
          <div className="md" style={{ maxWidth: 360 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div className="bb" style={{ fontSize: 22 }}>Log Weight</div>
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
              <div className="bb" style={{ fontSize: 22 }}>Set Weight Goal</div>
              <button className="btn-g" style={{ padding: '5px 9px' }} onClick={() => setShowGoal(false)}><X size={14} /></button>
            </div>
            <div style={{ fontSize: 12, color: 'var(--t2)', marginBottom: 18 }}>Current: <strong style={{ color: 'var(--o)' }}>{isImpWeight ? kgToLbs(latestWeight) + ' lbs' : latestWeight + ' kg'}</strong> · Your goal drives the calorie recommendations on the Diet page.</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 }}>
              <div><label>Target Weight ({isImpWeight ? 'lbs' : 'kg'})</label><ScrollPicker value={isImpWeight ? kgToLbs(goalTarget) : goalTarget} onChange={v => setGoalTarget(isImpWeight ? lbsToKg(v) : v)} items={wtItems} unit={isImpWeight ? 'lbs' : 'kg'} fmtVal={v => v.toFixed(1)} /></div>
              <div><label>Timeline (weeks)</label><ScrollPicker value={goalWeeks} onChange={setGoalWeeks} items={wkItems} unit="wks" /></div>
            </div>
            {goalTarget && goalWeeks && (
              <div style={{ padding: '12px 14px', background: 'var(--o3)', borderRadius: 10, border: '1px solid rgba(232,84,13,.2)', fontSize: 12, color: 'var(--o)', marginBottom: 16 }}>
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
    </div>
  );
}
