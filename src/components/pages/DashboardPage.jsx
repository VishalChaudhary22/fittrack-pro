import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ScrollPicker, ModalPortal } from '../shared/SharedComponents';
import ReadinessCheckIn from '../shared/ReadinessCheckIn';
import { Screen, Sec, Hero, LedgerRow, Amp, One, Note, Action, Word } from '../shared/Margin';

import { calcBMI, getBMICat, calcBMR, calcTDEE, calcDeficit } from '../../utils/calculations';
import { ACTIVITY } from '../../data/constants';
import { gId, tod, clamp, mkWtItems, mkIntItems, kgToLbs, lbsToKg, mkWtItemsImperial } from '../../utils/helpers';
import { getCyclePhase } from '../../utils/cycleCalculations';
import { getActiveFestival } from '../../utils/festivals';
import {
  calcObjectiveReadiness,
  getMuscleRecoveryStatuses,
  getTier,
  STATUS_COLORS,
  MUSCLE_LABELS,
} from '../../utils/readinessUtils';
import { calcWorkoutCalories, calcCardioCalories } from '../../data/metValues';
import { getDisplayStepLog } from '../../utils/activityUtils';
import { usePedometer } from '../../hooks/usePedometer';
import { useScrollRestoration, clearScrollPosition } from '../../hooks/useScrollRestoration';



export default function DashboardPage() {
  useScrollRestoration('/');
  const navigate = useNavigate();
  const { user, dataLoaded, healthLogs, setHealthLogs, workoutLogs, splits, updateProfile, addToast, getStreak, readinessLog, foodLog, waterLog, cycleConfig, stepLogs, logSteps, cardioLog, adaptiveSuggestion } = useApp();
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
  
  const [showLog, setShowLog] = useState(false);
  const [showGoal, setShowGoal] = useState(false);
  const [logWeight, setLogWeight] = useState(user.weight);
  const [logNote, setLogNote] = useState('');
  const [goalTarget, setGoalTarget] = useState(user.weightGoal || user.weight - 5);
  const [goalWeeks, setGoalWeeks] = useState(user.goalWeeks || 12);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => { const t = setTimeout(() => setLoaded(true), 300); return () => clearTimeout(t); }, []);

  // Auto-open check-in once per day on first dashboard load (if not done)
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
    if (!Number.isFinite(user?.weight) || !Number.isFinite(user?.height) || !Number.isFinite(user?.age)) {
      return { goalKcal: NaN, protTarget: NaN, carbTarget: NaN, fatTarget: NaN };
    }
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
  }, [
    user?.weight, user?.height, user?.age, user?.gender,
    user?.activityLevel, user?.weightGoal, user?.goalWeeks,
    user?.workoutDays, user?.customGoalKcal,
  ]);

  const calPct = clamp(Math.round((todayTotals.calories / goalKcal) * 100) || 0, 0, 100);


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
      <Screen
        kicker={new Date().toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' })}
        right={
          <>
            {cyclePhase && (
              <span className="kicker" style={{ color: 'var(--ash)', cursor: 'pointer' }} onClick={() => navigate('/cycle')}>
                {cyclePhase.phase}
              </span>
            )}
            <span className="kicker" style={{ color: 'var(--bone)' }}>
              {user.name.toLowerCase().startsWith('kaaya fit') ? 'Kaaya' : user.name.split(' ')[0]}
            </span>
          </>
        }
      >
        {/* ── 01 WEIGHT ─────────────────────────────────────────── */}
        <Sec n="01" label="Weight" right={isImpWeight ? 'lbs' : 'kg'}>
          <Hero
            value={latestWeight ? (isImpWeight ? kgToLbs(latestWeight) : latestWeight) : '—'}
            unit={isImpWeight ? 'lbs' : 'kg'}
          />

          <LedgerRow k="Last week" v={monthDelta > 0 ? `+${monthDelta}` : `${monthDelta}`} tone={monthDelta > 0 ? 'warn' : 'ok'} />
          {allUserLogs.length >= 2 && (
            <LedgerRow
              k="Previous weigh-in"
              v={isImpWeight ? kgToLbs(allUserLogs[allUserLogs.length - 2].weight) : allUserLogs[allUserLogs.length - 2].weight}
              tone="sm"
            />
          )}
          {user.weightGoal && (
            <LedgerRow k="Goal" v={isImpWeight ? kgToLbs(user.weightGoal) : user.weightGoal} tone="sm" />
          )}
          <LedgerRow
            k="Body mass index"
            v={`${bmi || '—'}`}
            sub={bmiCat?.label ? ` · ${bmiCat.label}` : ''}
            tone="sm"
          />

          <Action onClick={() => setShowLog(true)}>Log weight</Action>
        </Sec>

        {/* ── 02 THE ONE THING ──────────────────────────────────── */}
        <Sec n="02" label="Today" right={activeTier?.label ? `${activeTier.label} · ${activeScore}` : undefined}>
          {activeSplit ? (
            <One
              title={adaptiveSuggestion?.scenario && adaptiveSuggestion.scenario !== 'S10'
                ? 'Your calories need a small adjustment.'
                : `${activeSplit.name} is queued.`}
              sub={adaptiveSuggestion?.scenario && adaptiveSuggestion.scenario !== 'S10'
                ? `Based on ${adaptiveSuggestion.days ?? 'recent'} days of data. Review the new target on Food.`
                : `${thisWk} session${thisWk === 1 ? '' : 's'} this week. ${activeTier?.message || ''}`}
            />
          ) : (
            <One
              title="No split selected."
              sub="Pick a training split and the app can tell you what to do next."
            />
          )}

          <Action
            ember
            onClick={() => navigate(
              adaptiveSuggestion?.scenario && adaptiveSuggestion.scenario !== 'S10'
                ? '/diet'
                : activeSplit ? '/workout' : '/splits'
            )}
          >
            {adaptiveSuggestion?.scenario && adaptiveSuggestion.scenario !== 'S10'
              ? 'Review new target'
              : activeSplit ? 'Open session' : 'Choose a split'}
          </Action>

          {activeFestival && (
            <Note>
              <b>{activeFestival.name}</b> — {activeFestival.message}
            </Note>
          )}
        </Sec>

        {/* ── 03 REMAINING ──────────────────────────────────────── */}
        <Sec n="03" label="Remaining" right={Number.isFinite(goalKcal) ? `${goalKcal} kcal target` : 'add body metrics'}>
          {!Number.isFinite(goalKcal) ? (
            <>
              <p className="body-dim">
                Calorie and macro targets need your weight, height and age.
              </p>
              <Action onClick={() => navigate('/profile')}>Add body metrics</Action>
            </>
          ) : (
            <>
          <LedgerRow
            k="Calories"
            v={Math.max(0, Math.round(goalKcal - todayTotals.calories))}
            sub={` / ${goalKcal}`}
            tone="em"
            emberLead
          />
          <LedgerRow
            k="Protein"
            v={Math.max(0, Math.round(protTarget - todayTotals.protein))}
            sub={` / ${protTarget}g`}
          />
          <LedgerRow
            k="Carbs"
            v={Math.max(0, Math.round(carbTarget - todayTotals.carbs))}
            sub={` / ${carbTarget}g`}
            dim
          />
          <LedgerRow
            k="Fat"
            v={Math.max(0, Math.round(fatTarget - todayTotals.fats))}
            sub={` / ${fatTarget}g`}
            dim
          />
          <LedgerRow
            k="Water"
            v={`${(todayWaterTotal / 1000).toFixed(1)}`}
            sub={` / ${((user.waterGoal || 3500) / 1000).toFixed(1)} L`}
            dim
          />
          <LedgerRow
            k="Steps"
            v={todaySteps.toLocaleString()}
            sub={` / ${stepGoal.toLocaleString()}`}
            dim
            onClick={() => setShowStepModal(true)}
          />

          <Amp pct={calPct} cap style={{ marginTop: 14 }} />
          <div className="rowf between" style={{ marginTop: 8 }}>
            <span className="kicker" style={{ color: 'var(--ash-dim)' }}>{Math.round(todayTotals.calories)} eaten</span>
            <span className="kicker" style={{ color: 'var(--bone)' }}>{todayCaloriesBurned} burned</span>
          </div>

          <Action onClick={() => navigate('/diet')}>Open food log</Action>
            </>
          )}
        </Sec>

        {/* ── 04 RECOVERY ───────────────────────────────────────── */}
        <Sec n="04" label="Recovery" right="12 groups">
          {(() => {
            const TONE = { optimal: 'ok', fatigued: 'warn', critical: 'bad' };
            const LABEL = { optimal: 'Ready', fatigued: 'Loaded', critical: 'Recovering' };
            const entries = Object.entries(muscleStatuses || {});
            const sorted = entries.sort((a, b) => {
              const rank = { critical: 0, fatigued: 1, optimal: 2 };
              return (rank[a[1].status] ?? 3) - (rank[b[1].status] ?? 3);
            });
            return sorted.slice(0, 6).map(([key, st]) => (
              <LedgerRow
                key={key}
                k={MUSCLE_LABELS[key] || key}
                v={<Word tone={TONE[st.status] || 'idle'}>{LABEL[st.status] || 'Untrained'}</Word>}
              />
            ));
          })()}
          <LedgerRow
            k="All groups"
            v="→"
            tone="sm"
            onClick={() => navigate('/muscle-map')}
            style={{ cursor: 'pointer' }}
          />
          <Action onClick={() => setShowCheckIn(true)}>
            {hasCompletedReadiness ? 'Update check-in' : 'Readiness check-in'}
          </Action>
        </Sec>

        {/* ── 05 TRAINING OVERVIEW ──────────────────────────────── */}
        <Sec n="05" label="Training" right={`${userWo.length} all time`}>
          <LedgerRow k="Sessions this week" v={thisWk} />
          <LedgerRow k="All time" v={userWo.length} tone="sm" />
          <LedgerRow k="Current streak" v={streak.current} sub=" d" />
          <LedgerRow k="Best streak" v={streak.longest} sub=" d" tone="sm" />

          <div className="ticks" style={{ height: 40, marginTop: 18 }}>
            {Array.from({ length: Math.min(14, Math.max(7, userWo.length)) }).map((_, i) => {
              const filled = i < Math.min(14, userWo.length);
              return <i key={i} className={filled ? (i === Math.min(14, userWo.length) - 1 ? 'today' : 'full') : 'rest'} />;
            })}
          </div>
          <div className="rowf between">
            <span className="kicker" style={{ color: 'var(--ash-dim)' }}>recent</span>
            <span className="kicker" style={{ color: 'var(--bone)' }}>today</span>
          </div>
        </Sec>

        {/* ── 06 GOAL ───────────────────────────────────────────── */}
        <Sec n="06" label="Goal" right={user.weightGoal ? `${weeksLeft} wks left` : 'not set'}>
          {user.weightGoal ? (
            <>
              <LedgerRow
                k="Target"
                v={isImpWeight ? kgToLbs(user.weightGoal) : user.weightGoal}
                sub={isImpWeight ? ' lbs' : ' kg'}
              />
              <LedgerRow k={isLoss ? 'To lose' : 'To gain'} v={kgLeft} sub={isImpWeight ? ' lbs' : ' kg'} tone="sm" />
              <Amp pct={goalPct} cap style={{ marginTop: 14 }} />
              <div className="rowf between" style={{ marginTop: 8 }}>
                <span className="kicker" style={{ color: 'var(--ash-dim)' }}>{Math.round(goalPct)}%</span>
                <span className="kicker" style={{ color: 'var(--bone)' }}>{weeksLeft} weeks</span>
              </div>
            </>
          ) : (
            <p className="body-dim">No goal set. A target weight drives the calorie recommendations on Food.</p>
          )}
          <Action onClick={() => setShowGoal(true)}>
            {user.weightGoal ? 'Edit goal' : 'Set a goal'}
          </Action>
        </Sec>

        <div className="foot">
          <span>Kaaya Fit</span>
          <span>{isNewUser ? 'welcome' : 'margin'}</span>
        </div>
      </Screen>

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
