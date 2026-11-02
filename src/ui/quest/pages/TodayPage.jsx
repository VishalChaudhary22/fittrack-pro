import { useMemo } from 'react';
import { useApp } from '../../../core/context/AppContext';
import { useToday } from '../../../core/hooks/useToday';
import { useScrollRestoration } from '../../../core/hooks/useScrollRestoration';
import { calcBMR } from '../../../utils/calculations';
import { ACTIVITY } from '../../../data/constants';
import { clamp, kgToLbs } from '../../../utils/helpers';
import { formatSteps, getSourceLabel } from '../../../utils/activityUtils';
import { calcAllMuscleXP, getOverallRank } from '../../../data/muscleData';
import { QuestBlock, QuestBtn, QuestChip, QuestLabel, SegBar } from '../primitives';
import PixelSprite from '../PixelSprite';
import ReadinessCard from './ReadinessCard';
import { QuestReadinessCheckIn, QuestLogWeightSheet, QuestStepsSheet, QuestGoalSheet } from '../shared/QuestTodaySheets';
import { QuestBodyFatCard } from '../shared/QuestBodyFat';

// ─── Kaaya Quest · Today (Q-2; sheets completed in the Q-10 parity pack) ────
// Same brain as Volt's Today (useToday), Quest presentation (plan §7.1):
// HUD strip → the animated readiness card (§6.1) → today's quest → stat
// tiles → fuel / activity / metabolic blocks → body composition. The
// sheet-backed actions (check-in, log weight/steps, set goal, body fat)
// are Quest twins of Volt's V-7 popup pack, on the same useToday state.

function QuestThemeToggle() {
  const { theme, toggleTheme } = useApp();
  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="q-chip"
      style={{ cursor: 'pointer', padding: '7px 9px' }}
    >
      <PixelSprite name={theme === 'dark' ? 'sun' : 'moon'} size={15} />
    </button>
  );
}

function MiniRow({ label, valText, frac, tone }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 5 }}>
        <span style={{ fontSize: 19 }}>{label}</span>
        <span className="q-meta">{valText}</span>
      </div>
      <SegBar value={frac} tone={tone} segments={10} />
    </div>
  );
}

function Tile({ label, onClick, children }) {
  return (
    <QuestBlock flat onClick={onClick} style={onClick ? { cursor: 'pointer' } : undefined}>
      <QuestLabel>{label}</QuestLabel>
      <div style={{ marginTop: 10 }}>{children}</div>
    </QuestBlock>
  );
}

export default function TodayPage() {
  useScrollRestoration('/');
  const {
    navigate, user, updateProfile, addToast, logSteps, isImpWeight, isNewUser, tdeeEstimate,
    showIosInstall, setShowIosInstall, deferredPrompt, setDeferredPrompt,
    handleInstallClick, hasCompletedReadiness, activeScore, activeTier,
    spotlightMuscles, loaded, allUserLogs, latestWeight, bmi, bmiCat,
    monthDelta, activeSplit, thisWk, streak, goalPct, todayWaterTotal,
    todayTotals, todayCaloriesBurned, displayStepLog, todaySteps, stepGoal,
    stepPct, cyclePhase, activeFestival, goalKcal, protTarget, carbTarget,
    fatTarget, calPct, hasNutritionTargets, userWo,
    showCheckIn, setShowCheckIn, objectiveScore,
    showLog, setShowLog, logWeight, setLogWeight, logNote, setLogNote, saveLog,
    showStepModal, setShowStepModal, stepInputVal, setStepInputVal, todayStr,
    isTracking, liveSteps, supported, pedoError, startTracking, stopTracking,
    showGoal, setShowGoal, goalTarget, setGoalTarget, goalWeeks, setGoalWeeks, saveGoal,
  } = useToday();

  const clearGoal = async () => {
    await updateProfile({ weightGoal: null, weightGoalStart: null, goalWeeks: null });
    setShowGoal(false);
    addToast('Goal cleared', 'info');
  };
  const { workoutLogs, splits } = useApp();

  const { totalXP, lvl, intoLevel, toNext } = useMemo(() => {
    const xp = calcAllMuscleXP(workoutLogs, splits, user?.id);
    const overall = getOverallRank(xp);
    const level = Math.min(99, Math.floor(overall.totalXP / 5000) + 1);
    return {
      totalXP: overall.totalXP,
      lvl: level,
      intoLevel: overall.totalXP - (level - 1) * 5000,
      toNext: level >= 99 ? 0 : level * 5000 - overall.totalXP,
    };
  }, [workoutLogs, splits, user?.id]);

  if (!loaded) {
    return (
      <div className="q-screen">
        <QuestLabel tone="volt">Loading</QuestLabel>
        <div className="q-ps" style={{ fontSize: 24, marginTop: 10 }}>
          TODAY<span className="q-blink" aria-hidden="true" style={{ display: 'inline-block', width: 13, height: 19, background: 'var(--q-ink)', marginLeft: 4, verticalAlign: '-3px' }} />
        </div>
      </div>
    );
  }

  const firstName = user.name.toLowerCase().startsWith('kaaya fit') ? 'KAAYA FIT' : user.name.split(' ')[0].toUpperCase();
  const unit = isImpWeight ? 'lbs' : 'kg';
  const displayWeight = latestWeight ? (isImpWeight ? kgToLbs(latestWeight) : latestWeight) : '—';

  const hasAdaptive = tdeeEstimate?.estimatedTDEE && (tdeeEstimate.confidence === 'high' || tdeeEstimate.confidence === 'medium');
  const staticTDEE = (user.weight && user.height && user.age)
    ? Math.round(calcBMR(user.weight, user.height, user.age, user.gender) * (ACTIVITY[user.activityLevel || 'moderate']?.mult || 1.55))
    : null;
  const displayTDEE = hasAdaptive ? tdeeEstimate.estimatedTDEE : staticTDEE;

  const macroRows = [
    { label: 'Protein', val: todayTotals.protein, target: protTarget, tone: 'sky' },
    { label: 'Carbs', val: todayTotals.carbs, target: carbTarget, tone: 'gold' },
    { label: 'Fats', val: todayTotals.fats, target: fatTarget, tone: 'ember' },
  ];
  const activityRows = [
    { label: 'Steps', val: todaySteps, target: stepGoal, tone: 'sky', valText: `${formatSteps(todaySteps)} / ${formatSteps(stepGoal)}` },
    { label: 'Cals Burned', val: todayCaloriesBurned + (displayStepLog?.calories_active || 0), target: 500, tone: 'ember', valText: `${Math.round(todayCaloriesBurned + (displayStepLog?.calories_active || 0))} / 500` },
    { label: 'Water', val: todayWaterTotal, target: user.waterGoal || 3000, tone: 'sky', valText: `${Math.round(todayWaterTotal)} / ${user.waterGoal || 3000} ml` },
  ];

  return (
    <div className="q-screen">
      {/* ── Header / HUD ── */}
      <header>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
          <QuestLabel tone="volt">{new Date().toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' })}</QuestLabel>
          <QuestThemeToggle />
        </div>
        <h1 className="q-ps" style={{ fontSize: 19, lineHeight: 1.5, margin: '12px 0 0', textTransform: 'uppercase' }}>
          {isNewUser ? 'Welcome,' : 'Hey,'}<br />{firstName}
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginTop: 14 }}>
          <QuestChip tone="gold">{totalXP} XP</QuestChip>
          {streak.current > 0 && <QuestChip tone="ember"><PixelSprite name="flame" size={13} /> {streak.current} DAY STREAK</QuestChip>}
          <QuestChip><PixelSprite name="star" size={13} /> LVL {lvl}</QuestChip>
          {cyclePhase && (
            <button type="button" onClick={() => navigate('/cycle')} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>
              <QuestChip tone="volt">DAY {cyclePhase.currentDay} · {cyclePhase.phase}</QuestChip>
            </button>
          )}
          <span style={{ flex: 1 }} />
          <QuestBtn sm tone="ghost" onClick={() => setShowLog(true)}>+ Weight</QuestBtn>
        </div>
      </header>

      {/* ── Install banners ── */}
      {showIosInstall && (
        <QuestBlock flat style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <div style={{ flex: 1, fontSize: 18, lineHeight: 1.35 }}>
            <strong>Install Kaaya Fit.</strong> Share → <strong>Add to Home Screen</strong> for the best experience.
          </div>
          <button type="button" className="q-chip" onClick={() => setShowIosInstall(false)} style={{ cursor: 'pointer' }} aria-label="Dismiss install tip"><PixelSprite name="x" size={11} /></button>
        </QuestBlock>
      )}
      {deferredPrompt && (
        <QuestBlock flat style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <div style={{ flex: 1, fontSize: 18, lineHeight: 1.35 }}>
            <strong>Install Kaaya Fit</strong> on your device for quick access and notifications.
          </div>
          <QuestBtn sm onClick={handleInstallClick}>Install</QuestBtn>
          <button type="button" className="q-chip" onClick={() => setDeferredPrompt(null)} style={{ cursor: 'pointer' }} aria-label="Dismiss install offer"><PixelSprite name="x" size={11} /></button>
        </QuestBlock>
      )}

      {/* ── Festival ── */}
      {activeFestival && (
        <QuestBlock variant="panel2">
          <div className="q-ps" style={{ fontSize: 13 }}>{activeFestival.name}</div>
          <p className="q-meta" style={{ margin: '7px 0 0', color: 'var(--q-ink)', fontSize: 18 }}>{activeFestival.message}</p>
        </QuestBlock>
      )}

      {/* ── Readiness — the signature scene ── */}
      <ReadinessCard
        score={activeScore}
        tier={activeTier}
        hasCompletedReadiness={hasCompletedReadiness}
        spotlightMuscles={spotlightMuscles}
      />

      {/* ── Check-in row (Volt parity: pill + status caption) ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginTop: -4 }}>
        <QuestBtn sm onClick={() => setShowCheckIn(true)}>
          {hasCompletedReadiness ? 'Update Check-In' : 'Complete Check-In'}
        </QuestBtn>
        <span className="q-meta">
          {hasCompletedReadiness ? 'CHECK-IN LOGGED TODAY' : 'OBJECTIVE SCORE — CHECK IN TO PERSONALISE'}
        </span>
      </div>

      {/* ── Today's quest ── */}
      <QuestBlock variant="panel2">
        <QuestLabel tone="volt">{activeSplit ? "Today's Quest" : 'New Game'}</QuestLabel>
        {activeSplit ? (
          <>
            <div className="q-ps" style={{ fontSize: 16, lineHeight: 1.5, marginTop: 10, textTransform: 'uppercase' }}>{activeSplit.name}</div>
            {activeSplit.description && (
              <p className="q-meta" style={{ margin: '7px 0 0', fontSize: 18 }}>{activeSplit.description}</p>
            )}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 13 }}>
              {activeSplit.schedule.slice(0, 4).map((d, i) => (
                <QuestChip key={i} tone={d === 'Rest' ? undefined : 'volt'}>D{i + 1} · {d}</QuestChip>
              ))}
              {activeSplit.schedule.length > 4 && <QuestChip>+{activeSplit.schedule.length - 4} MORE</QuestChip>}
            </div>
            <QuestBtn onClick={() => navigate('/workout')} style={{ width: '100%', marginTop: 16 }}>Start Quest</QuestBtn>
          </>
        ) : (
          <>
            <p className="q-meta" style={{ margin: '9px 0 0', fontSize: 18 }}>
              Set up a training split to get personalised workout recommendations.
            </p>
            <QuestBtn onClick={() => navigate('/splits')} style={{ width: '100%', marginTop: 16 }}>Set Up a Split</QuestBtn>
          </>
        )}
      </QuestBlock>

      {/* ── Stat tiles ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <Tile label="Weight" onClick={() => navigate('/weight-log')}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 5 }}>
            <span className="q-ps" style={{ fontSize: 24 }}>{displayWeight}</span>
            {latestWeight && <span className="q-meta">{unit}</span>}
          </div>
          <div className="q-meta" style={{ marginTop: 6 }}>
            {allUserLogs.length ? `${monthDelta > 0 ? '+' : ''}${monthDelta} ${unit} this month` : 'No logs yet'}
          </div>
          {goalPct !== null ? (
            <>
              <SegBar value={goalPct / 100} tone="gold" segments={10} style={{ marginTop: 10 }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 }}>
                <div className="q-meta">{goalPct}% to goal</div>
                <button type="button" className="q-chip" aria-label="Edit weight goal" onClick={(e) => { e.stopPropagation(); setShowGoal(true); }} style={{ cursor: 'pointer', padding: '5px 8px' }}>GOAL</button>
              </div>
            </>
          ) : (
            <button type="button" className="q-chip" aria-label="Set weight goal" onClick={(e) => { e.stopPropagation(); setShowGoal(true); }} style={{ cursor: 'pointer', padding: '5px 8px', marginTop: 10 }}>SET GOAL</button>
          )}
        </Tile>

        <Tile label="Level">
          <div className="q-ps" style={{ fontSize: 24, color: 'var(--q-violet)' }}>LVL {lvl}</div>
          <SegBar value={intoLevel / 5000} tone="violet" segments={10} style={{ marginTop: 10 }} />
          <div className="q-meta" style={{ marginTop: 6 }}>
            {lvl >= 99 ? 'MAX LEVEL' : `${toNext} XP to LVL ${lvl + 1}`}
          </div>
        </Tile>

        <Tile label="Sessions">
          <div className="q-ps" style={{ fontSize: 24 }}>{thisWk}</div>
          <div className="q-meta" style={{ marginTop: 6 }}>this week · {userWo.length} all time</div>
        </Tile>

        <Tile label="Streak">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <PixelSprite name="flame" size={22} />
            <span className="q-ps" style={{ fontSize: 24 }}>{streak.current}</span>
          </div>
          <div className="q-meta" style={{ marginTop: 6 }}>day streak · best {streak.longest}</div>
        </Tile>
      </div>

      {/* ── Fuel ── */}
      {!hasNutritionTargets ? (
        <QuestBlock flat onClick={() => navigate('/profile')} style={{ cursor: 'pointer' }}>
          <QuestLabel>Fuel</QuestLabel>
          <p className="q-meta" style={{ margin: '9px 0 0', fontSize: 18 }}>Complete your stats to open daily targets</p>
        </QuestBlock>
      ) : (
        <QuestBlock onClick={() => navigate('/diet')} style={{ cursor: 'pointer' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <QuestLabel tone="gold">Fuel</QuestLabel>
            <PixelSprite name="chevR" size={11} />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 7, marginTop: 9 }}>
            <span className="q-ps" style={{ fontSize: 19 }}>{Math.round(todayTotals.calories)} / {goalKcal}</span>
            <span className="q-meta">KCAL · {calPct}%</span>
          </div>
          <SegBar value={calPct / 100} tone="gold" segments={12} style={{ margin: '12px 0 14px' }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {macroRows.map((m) => (
              <MiniRow
                key={m.label}
                label={m.label}
                valText={`${Math.round(m.val)} / ${m.target} g`}
                frac={clamp((m.val / m.target) || 0, 0, 1)}
                tone={m.val > m.target ? 'red' : m.tone}
              />
            ))}
          </div>
        </QuestBlock>
      )}

      {/* ── Activity (tap → log steps sheet, Volt parity) ── */}
      <QuestBlock onClick={() => setShowStepModal(true)} style={{ cursor: 'pointer' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <QuestLabel tone="ember">Daily Activity</QuestLabel>
          <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {displayStepLog?.source && <span className="q-meta" style={{ fontSize: 15 }}>{getSourceLabel(displayStepLog.source).toUpperCase()}</span>}
            <PixelSprite name="chevR" size={11} />
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 7, marginTop: 9 }}>
          <span className="q-ps" style={{ fontSize: 19 }}>{todaySteps > 0 ? formatSteps(todaySteps) : '0'}</span>
          <span className="q-meta">{todaySteps > 0 ? `/ ${formatSteps(stepGoal)} STEPS · ${stepPct}%` : 'NO STEPS LOGGED TODAY'}</span>
        </div>
        <SegBar value={stepPct / 100} tone="sky" segments={12} style={{ margin: '12px 0 14px' }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {activityRows.map((m) => (
            <MiniRow key={m.label} label={m.label} valText={m.valText} frac={clamp((m.val / m.target) || 0, 0, 1)} tone={m.tone} />
          ))}
        </div>
      </QuestBlock>

      {/* ── Metabolic ── */}
      <QuestBlock flat>
        <QuestLabel>Metabolic Index</QuestLabel>
        {Math.round(bmi) && !isNaN(bmi) ? (
          <div style={{ display: 'flex', gap: 20, marginTop: 12, flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 110 }}>
              <div className="q-meta">BMI</div>
              <div className="q-ps" style={{ fontSize: 26, marginTop: 4 }}>{bmi}</div>
              <div style={{ marginTop: 8 }}><QuestChip>{bmiCat.label}</QuestChip></div>
            </div>
            <div style={{ flex: 1, minWidth: 110 }}>
              <div className="q-meta">TDEE</div>
              <div className="q-ps" style={{ fontSize: 26, marginTop: 4 }}>{displayTDEE || '—'}</div>
              <div className="q-meta" style={{ marginTop: 8 }}>
                {hasAdaptive ? 'ADAPTIVE' : displayTDEE ? 'CALCULATED' : 'SET PROFILE'}
              </div>
            </div>
          </div>
        ) : (
          <p className="q-meta" style={{ margin: '9px 0 0', fontSize: 18 }}>Add weight &amp; height in your profile to unlock this.</p>
        )}
      </QuestBlock>

      {/* ── Body composition (Volt parity, Q-10) ── */}
      <QuestBodyFatCard />

      {/* ── Sheets: Quest popup pack (Q-10) ── */}
      {showCheckIn && (
        <QuestReadinessCheckIn
          objectiveScore={objectiveScore}
          onClose={() => setShowCheckIn(false)}
        />
      )}
      {showLog && (
        <QuestLogWeightSheet
          isImpWeight={isImpWeight}
          logWeight={logWeight}
          setLogWeight={setLogWeight}
          logNote={logNote}
          setLogNote={setLogNote}
          saveLog={saveLog}
          onClose={() => setShowLog(false)}
        />
      )}
      {showStepModal && (
        <QuestStepsSheet
          stepInputVal={stepInputVal}
          setStepInputVal={setStepInputVal}
          todayStr={todayStr}
          todaySteps={todaySteps}
          displayStepLog={displayStepLog}
          supported={supported}
          isTracking={isTracking}
          liveSteps={liveSteps}
          pedoError={pedoError}
          startTracking={startTracking}
          stopTracking={stopTracking}
          logSteps={logSteps}
          addToast={addToast}
          onClose={() => setShowStepModal(false)}
        />
      )}
      {showGoal && (
        <QuestGoalSheet
          user={user}
          isImpWeight={isImpWeight}
          latestWeight={latestWeight}
          goalTarget={goalTarget}
          setGoalTarget={setGoalTarget}
          goalWeeks={goalWeeks}
          setGoalWeeks={setGoalWeeks}
          saveGoal={saveGoal}
          onClear={clearGoal}
          onClose={() => setShowGoal(false)}
        />
      )}
    </div>
  );
}
