import { useEffect, useState } from 'react';
import { X, ChevronRight, RefreshCw, Sun, Moon, TrendingUp, TrendingDown, Share } from 'lucide-react';
import { ModalPortal } from '../../v1/shared/SharedComponents';
import { VoltSheet, VoltScrollPicker } from '../shared/VoltShared';
import VoltReadinessCheckIn from '../shared/VoltReadinessCheckIn';
import { VoltBodyFatCard } from '../shared/VoltBodyFat';
import { useApp } from '../../../core/context/AppContext';
import { useToday } from '../../../core/hooks/useToday';
import { useScrollRestoration } from '../../../core/hooks/useScrollRestoration';
import { useSpringNumber, SPRING_DATA, EASE_OUT } from '../../../core/motion/springs';
import { calcBMR } from '../../../utils/calculations';
import { ACTIVITY } from '../../../data/constants';
import { clamp, kgToLbs, lbsToKg } from '../../../utils/helpers';
import { STATUS_COLORS, MUSCLE_LABELS } from '../../../utils/readinessUtils';
import { formatSteps, getSourceLabel } from '../../../utils/activityUtils';
import { VoltBlock, VoltPill, VoltChip, Sticker, VoltLabel, VoltBar, LabFrame } from '../primitives';
import VoltParticles from '../components/VoltParticles';

// ─── Kaaya Volt · Today (V-3) ────────────────────────────────────────────────
// Same brain as V1's DashboardPage (useToday), Volt presentation. The Lab
// reproduces the V1 readiness composition exactly — particle field, the
// body scan twice (reflective floor + main figure, screen blend, masked)
// — re-lit in volt, with the score on a SPRING_DATA count-up.
// V-7 closed the staged gaps: the modals below are Volt sheets, the
// check-in is the Volt twin (drawer curve + drag-to-dismiss), and body
// composition has its Volt card (VoltBodyFatCard).

const CHAMBER_PAPER = '#F4F5E9';
const CHAMBER_DIM = '#B9BFA8';

// ─── Ink weight chart (hand-rolled SVG — no chart library, no gradients) ────
function InkChart({ data, goal }) {
  const [drawn, setDrawn] = useState(false);
  useEffect(() => {
    const r = requestAnimationFrame(() => setDrawn(true));
    return () => cancelAnimationFrame(r);
  }, []);

  const pts = data.slice(-30);
  if (pts.length < 2) return null;
  const W = 300;
  const H = 96;
  const PAD = 8;
  const vals = pts.map((p) => p.weight);
  if (goal) vals.push(goal);
  const min = Math.min(...vals);
  const max = Math.max(...vals);
  const span = max - min || 1;
  const x = (i) => PAD + (i / (pts.length - 1)) * (W - PAD * 2);
  const y = (v) => H - PAD - ((v - min) / span) * (H - PAD * 2);
  const line = pts.map((p, i) => `${x(i)},${y(p.weight)}`).join(' ');
  const area = `${x(0)},${H - PAD} ${line} ${x(pts.length - 1)},${H - PAD}`;
  const last = pts[pts.length - 1];

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 110, display: 'block' }} role="img" aria-label="Weight trend chart">
        <polygon points={area} fill="var(--v-volt)" opacity={drawn ? 0.13 : 0} style={{ transition: `opacity 600ms ${EASE_OUT} 200ms` }} />
        {goal && (
          <>
            <line x1={PAD} x2={W - PAD} y1={y(goal)} y2={y(goal)} stroke="var(--v-coral)" strokeWidth="1.5" strokeDasharray="4 4" />
            <text x={W - PAD} y={y(goal) - 4} textAnchor="end" fontSize="8" fill="var(--v-coral-text)" style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, letterSpacing: '0.1em' }}>GOAL</text>
          </>
        )}
        <polyline
          points={line}
          fill="none"
          stroke="var(--v-ink)"
          strokeWidth="2.5"
          strokeLinejoin="round"
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={drawn ? 0 : 1}
          style={{ transition: `stroke-dashoffset 900ms ${EASE_OUT}` }}
        />
        <circle cx={x(pts.length - 1)} cy={y(last.weight)} r="4" fill="var(--v-volt)" stroke="var(--v-edge)" strokeWidth="1.5" opacity={drawn ? 1 : 0} style={{ transition: `opacity 200ms ${EASE_OUT} 800ms` }} />
      </svg>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'var(--v-dim)', letterSpacing: '0.08em' }}>
        <span>{pts[0].date}</span>
        <span>{last.date}</span>
      </div>
    </div>
  );
}

// ─── Labelled VoltBar row (nutrition + activity) ─────────────────────────────
function BarRow({ label, valText, frac, tone }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 5 }}>
        <span style={{ fontSize: 13, fontWeight: 700 }}>{label}</span>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'var(--v-dim)' }}>{valText}</span>
      </div>
      <VoltBar value={frac} tone={tone} height={10} />
    </div>
  );
}

// ─── The Lab ─────────────────────────────────────────────────────────────────
function ReadinessLab({ user, activeScore, activeTier, hasCompletedReadiness, spotlightMuscles, onCheckIn }) {
  const animated = useSpringNumber(activeScore, SPRING_DATA, 0);
  const female = user?.gender === 'female';
  const bodySrc = female ? '/muscles/volt/female-body-wireframe-volt.jpg' : '/muscles/volt/body-wireframe-volt.jpg';
  const femaleScale = female ? ' scale(1.15)' : '';

  return (
    <LabFrame style={{ minHeight: 500, display: 'flex', flexDirection: 'column' }}>
      <VoltParticles />

      {/* Reflective floor — the scan flipped, faint, masked (V1 composition) */}
      <img
        src={bodySrc}
        alt=""
        style={{
          position: 'absolute', top: '95%', left: '50%',
          transform: `translate(-50%, -50%) scaleY(-1)${femaleScale}`,
          width: '135%', maxWidth: 800, height: 'auto', objectFit: 'contain',
          zIndex: 1, pointerEvents: 'none', opacity: 0.15, mixBlendMode: 'screen',
          WebkitMaskImage: 'linear-gradient(to top, black 0%, transparent 40%)',
          maskImage: 'linear-gradient(to top, black 0%, transparent 40%)',
        }}
      />
      {/* Main figure */}
      <img
        src={bodySrc}
        alt=""
        style={{
          position: 'absolute', top: '45%', left: '50%',
          transform: `translate(-50%, -50%)${femaleScale}`,
          width: '135%', maxWidth: 800, height: 'auto', objectFit: 'contain',
          zIndex: 1, pointerEvents: 'none', mixBlendMode: 'screen',
          WebkitMaskImage: 'linear-gradient(to bottom, black 65%, transparent 88%)',
          maskImage: 'linear-gradient(to bottom, black 65%, transparent 88%)',
        }}
      />
      {/* Bottom fade into the chamber */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '45%', background: 'linear-gradient(to bottom, transparent, #04060A 80%)', zIndex: 2, pointerEvents: 'none' }} />

      {/* Content layer */}
      <div style={{ position: 'relative', zIndex: 10, padding: 22, flex: 1, display: 'flex', flexDirection: 'column', minHeight: 500 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
          <div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, fontWeight: 700, letterSpacing: '0.14em', color: CHAMBER_DIM }}>
              OVERALL READINESS
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', marginTop: 4 }}>
              <span className="v-num" style={{ fontSize: 64, lineHeight: 1, color: CHAMBER_PAPER }}>{Math.round(animated)}</span>
              <span className="v-num" style={{ fontSize: 26, color: 'var(--v-volt)' }}>%</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
              <span style={{ width: 9, height: 9, borderRadius: '50%', background: activeTier.color, boxShadow: `0 0 8px ${activeTier.color}99`, flexShrink: 0 }} />
              <span style={{ fontSize: 15, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.02em', color: CHAMBER_PAPER }}>{activeTier.label}</span>
            </div>
            <div style={{ fontSize: 12.5, color: CHAMBER_DIM, marginTop: 3 }}>{activeTier.message}</div>
          </div>

          {/* Legend */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {[
              { label: 'Recovered', color: STATUS_COLORS.optimal },
              { label: 'Fatigued', color: STATUS_COLORS.fatigued },
              { label: 'Critical', color: STATUS_COLORS.critical },
            ].map((item) => (
              <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(19, 19, 21, 0.55)', padding: '5px 10px', borderRadius: 8, border: '1px solid rgba(244, 245, 233, 0.18)' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: item.color, boxShadow: `0 0 8px ${item.color}99`, flexShrink: 0 }} />
                <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(244, 245, 233, 0.92)' }}>{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Check-in */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap', marginTop: 18 }}>
          <VoltPill onClick={onCheckIn}>
            {hasCompletedReadiness ? <><RefreshCw size={15} /> Update Check-In</> : 'Complete Check-In'}
          </VoltPill>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.1em', color: CHAMBER_DIM }}>
            {hasCompletedReadiness ? 'CHECK-IN LOGGED TODAY' : 'OBJECTIVE SCORE — CHECK IN TO PERSONALISE'}
          </span>
        </div>

        {/* Muscle chips */}
        <div style={{ marginTop: 'auto', paddingTop: 20 }}>
          {spotlightMuscles.length === 0 ? (
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, letterSpacing: '0.1em', color: CHAMBER_DIM }}>
              LOG A WORKOUT TO LIGHT UP YOUR MUSCLE MAP
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {spotlightMuscles.map((m) => (
                <div key={m.key} style={{ background: 'rgba(10, 10, 9, 0.82)', padding: '8px 12px', borderRadius: 10, border: '2px solid rgba(244, 245, 233, 0.28)', borderLeft: `4px solid ${STATUS_COLORS[m.status]}` }}>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 700, textTransform: 'uppercase', color: CHAMBER_DIM, letterSpacing: '0.08em', marginBottom: 2 }}>
                    {MUSCLE_LABELS[m.key] || m.key}
                  </div>
                  <div style={{ fontSize: 14.5, fontWeight: 800, color: CHAMBER_PAPER }}>{m.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </LabFrame>
  );
}

export default function TodayPage() {
  useScrollRestoration('/');
  const { theme, toggleTheme } = useApp();
  const {
    navigate, user, updateProfile, addToast, logSteps, tdeeEstimate,
    showCheckIn, setShowCheckIn, showStepModal, setShowStepModal,
    stepInputVal, setStepInputVal, isImpWeight, isNewUser, objectiveScore,
    todayStr, hasCompletedReadiness, activeScore, activeTier,
    spotlightMuscles, showLog, setShowLog, showGoal, setShowGoal,
    showIosInstall, setShowIosInstall, deferredPrompt, setDeferredPrompt,
    handleInstallClick, logWeight, setLogWeight, logNote, setLogNote,
    goalTarget, setGoalTarget, goalWeeks, setGoalWeeks, loaded, allUserLogs,
    latestWeight, bmi, bmiCat, chartData, monthDelta, activeSplit, userWo,
    thisWk, streak, goalPct, weeksLeft, kgLeft, isLoss, trendArrow,
    todayWaterTotal, todayTotals, todayCaloriesBurned, displayStepLog,
    todaySteps, stepGoal, stepPct, cyclePhase, activeFestival, isTracking,
    liveSteps, supported, pedoError, startTracking, stopTracking, goalKcal,
    protTarget, carbTarget, fatTarget, calPct, hasNutritionTargets, saveLog,
    saveGoal, wtItems, wkItems,
  } = useToday();

  if (!loaded) {
    return (
      <div className="v-screen" style={{ padding: '10px 2px' }}>
        <VoltLabel volt>Loading</VoltLabel>
        <div className="v-num" style={{ fontSize: 42, marginTop: 8, textTransform: 'uppercase' }}>Today</div>
      </div>
    );
  }

  const firstName = user.name.toLowerCase().startsWith('kaaya fit') ? 'KAAYA FIT' : user.name.split(' ')[0].toUpperCase();
  const unit = isImpWeight ? 'lbs' : 'kg';
  const displayWeight = latestWeight ? (isImpWeight ? kgToLbs(latestWeight) : latestWeight) : '—';
  const prevWeight = allUserLogs.length >= 2 ? allUserLogs[allUserLogs.length - 2].weight : null;

  const hasAdaptive = tdeeEstimate?.estimatedTDEE && (tdeeEstimate.confidence === 'high' || tdeeEstimate.confidence === 'medium');
  const staticTDEE = (user.weight && user.height && user.age)
    ? Math.round(calcBMR(user.weight, user.height, user.age, user.gender) * (ACTIVITY[user.activityLevel || 'moderate']?.mult || 1.55))
    : null;
  const displayTDEE = hasAdaptive ? tdeeEstimate.estimatedTDEE : staticTDEE;

  const macroRows = [
    { label: 'Protein', val: todayTotals.protein, target: protTarget, tone: 'cobalt' },
    { label: 'Carbs', val: todayTotals.carbs, target: carbTarget, tone: undefined },
    { label: 'Fats', val: todayTotals.fats, target: fatTarget, tone: 'coral' },
  ];
  const activityRows = [
    { label: 'Steps', val: todaySteps, target: stepGoal, tone: undefined, valText: `${formatSteps(todaySteps)} / ${formatSteps(stepGoal)}` },
    { label: 'Cals Burned', val: todayCaloriesBurned + (displayStepLog?.calories_active || 0), target: 500, tone: 'coral', valText: `${Math.round(todayCaloriesBurned + (displayStepLog?.calories_active || 0))} / 500` },
    { label: 'Water', val: todayWaterTotal, target: user.waterGoal || 3000, tone: 'cobalt', valText: `${Math.round(todayWaterTotal)} / ${user.waterGoal || 3000} ml` },
  ];

  let rise = 0;
  const riseStyle = () => ({ animationDelay: `${(rise++) * 55}ms` });

  return (
    <>
      <div className="v-screen" style={{ display: 'flex', flexDirection: 'column', gap: 16, paddingBottom: 8 }}>
        {/* ── Header ── */}
        <header className="v-rise" style={riseStyle()}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
            <VoltLabel volt>{new Date().toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</VoltLabel>
            <button type="button" className="v-chip" onClick={toggleTheme} style={{ cursor: 'pointer' }} aria-label="Toggle light or dark theme">
              {theme === 'dark' ? <Sun size={13} /> : <Moon size={13} />}
              {theme === 'dark' ? 'LIGHT' : 'DARK'}
            </button>
          </div>
          <h1 className="v-num" style={{ fontSize: 'clamp(2.3rem, 9vw, 3.6rem)', lineHeight: 0.98, margin: '12px 0 0', textTransform: 'uppercase' }}>
            {isNewUser ? 'Welcome,' : 'Welcome back,'}<br />{firstName}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginTop: 14 }}>
            {streak.current > 0 && <Sticker tone="volt">{streak.current} Day Streak</Sticker>}
            {cyclePhase && (
              <button type="button" className="v-chip" onClick={() => navigate('/cycle')} style={{ cursor: 'pointer' }}>
                Day {cyclePhase.currentDay} · {cyclePhase.phase}
              </button>
            )}
            <span style={{ flex: 1 }} />
            <VoltPill ghost onClick={() => setShowLog(true)}>+ Log Weight</VoltPill>
          </div>
        </header>

        {/* ── Install banners ── */}
        {showIosInstall && (
          <VoltBlock quiet className="v-rise" style={{ ...riseStyle(), display: 'flex', gap: 14, alignItems: 'center' }}>
            <div style={{ flex: 1, fontSize: 13, lineHeight: 1.5 }}>
              <strong>Install Kaaya Fit.</strong> Tap <Share size={13} style={{ verticalAlign: 'middle', display: 'inline' }} /> then <strong>Add to Home Screen</strong> for the best experience.
            </div>
            <button type="button" className="v-chip" onClick={() => setShowIosInstall(false)} style={{ cursor: 'pointer' }} aria-label="Dismiss install tip"><X size={13} /></button>
          </VoltBlock>
        )}
        {deferredPrompt && (
          <VoltBlock quiet className="v-rise" style={{ ...riseStyle(), display: 'flex', gap: 14, alignItems: 'center' }}>
            <div style={{ flex: 1, fontSize: 13, lineHeight: 1.5 }}>
              <strong>Install Kaaya Fit</strong> on your device for quick access and push notifications.
            </div>
            <VoltPill onClick={handleInstallClick} style={{ minHeight: 48 }}>Install</VoltPill>
            <button type="button" className="v-chip" onClick={() => setDeferredPrompt(null)} style={{ cursor: 'pointer' }} aria-label="Dismiss install offer"><X size={13} /></button>
          </VoltBlock>
        )}

        {/* ── Festival ── */}
        {activeFestival && (
          <VoltBlock variant="volt" className="v-rise" style={riseStyle()}>
            <div style={{ fontSize: 17, fontWeight: 900, letterSpacing: '-0.01em' }}>✨ {activeFestival.name}</div>
            <p style={{ fontSize: 13, lineHeight: 1.55, margin: '5px 0 0' }}>{activeFestival.message}</p>
          </VoltBlock>
        )}

        {/* ── The Lab ── */}
        <div className="v-rise" style={riseStyle()}>
          <ReadinessLab
            user={user}
            activeScore={activeScore}
            activeTier={activeTier}
            hasCompletedReadiness={hasCompletedReadiness}
            spotlightMuscles={spotlightMuscles}
            onCheckIn={() => setShowCheckIn(true)}
          />
        </div>

        {/* ── Today's session ── */}
        <VoltBlock hero className="v-rise" style={riseStyle()}>
          <VoltLabel volt>{activeSplit ? "Today's Session" : 'Get Started'}</VoltLabel>
          {activeSplit ? (
            <>
              <div className="v-num" style={{ fontSize: 30, textTransform: 'uppercase', marginTop: 8, lineHeight: 1.05 }}>{activeSplit.name}</div>
              <p style={{ fontSize: 13.5, color: 'var(--v-dim)', lineHeight: 1.55, margin: '7px 0 0', maxWidth: '85%' }}>{activeSplit.description}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginTop: 14 }}>
                {activeSplit.schedule.slice(0, 4).map((d, i) => (
                  <VoltChip key={i} style={d === 'Rest' ? { opacity: 0.55 } : undefined}>D{i + 1} · {d}</VoltChip>
                ))}
                {activeSplit.schedule.length > 4 && <VoltChip>+{activeSplit.schedule.length - 4} more</VoltChip>}
              </div>
              <VoltPill onClick={() => navigate('/workout')} style={{ marginTop: 16 }}>Start Workout</VoltPill>
            </>
          ) : (
            <>
              <p style={{ fontSize: 13.5, color: 'var(--v-dim)', lineHeight: 1.55, margin: '9px 0 0', maxWidth: '85%' }}>
                Set up a training split to get personalised workout recommendations.
              </p>
              <VoltPill onClick={() => navigate('/splits')} style={{ marginTop: 16 }}>Set Up a Split</VoltPill>
            </>
          )}
        </VoltBlock>

        {/* ── Weight ── */}
        <VoltBlock className="v-rise" style={riseStyle()}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
            <VoltLabel>Weight Analysis</VoltLabel>
            <VoltChip>{monthDelta > 0 ? '+' : ''}{monthDelta} {unit} this month</VoltChip>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 22, marginTop: 14, flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.12em', color: 'var(--v-dim)', marginBottom: 3 }}>CURRENT</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                <span className="v-num" style={{ fontSize: 54, lineHeight: 1 }}>{displayWeight}</span>
                {latestWeight && <span style={{ fontSize: 13, color: 'var(--v-dim)', fontWeight: 700 }}>{unit}</span>}
              </div>
            </div>
            {latestWeight && (
              trendArrow.up
                ? <TrendingUp size={24} color={trendArrow.color} />
                : <TrendingDown size={24} color={trendArrow.color} />
            )}
            {prevWeight !== null && (
              <div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.12em', color: 'var(--v-dim)', marginBottom: 3 }}>PREVIOUS</div>
                <span className="v-num" style={{ fontSize: 26, lineHeight: 1, color: 'var(--v-dim)' }}>
                  {isImpWeight ? kgToLbs(prevWeight) : prevWeight}
                </span>
                <span style={{ fontSize: 11, color: 'var(--v-dim)', fontWeight: 700 }}> {unit}</span>
              </div>
            )}
          </div>

          <div style={{ marginTop: 16 }}>
            {chartData.length >= 2 ? (
              <InkChart data={chartData} goal={user.weightGoal ? (isImpWeight ? kgToLbs(user.weightGoal) : user.weightGoal) : null} />
            ) : (
              <div style={{ textAlign: 'center', padding: '14px 0 4px' }}>
                <div style={{ fontSize: 14, fontWeight: 800 }}>Not enough data yet</div>
                <p style={{ fontSize: 12.5, color: 'var(--v-dim)', margin: '5px auto 12px', maxWidth: 250, lineHeight: 1.5 }}>Log weight on two different days to see your trend chart.</p>
                <VoltPill ghost onClick={() => setShowLog(true)}>Log Weight</VoltPill>
              </div>
            )}
          </div>

          {/* Goal strip */}
          <div style={{ borderTop: '2px solid var(--v-edge-quiet)', marginTop: 16, paddingTop: 15 }}>
            {user.weightGoal ? (
              <div onClick={() => setShowGoal(true)} style={{ cursor: 'pointer' }} role="button" aria-label="Update weight goal">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, letterSpacing: '0.12em', color: 'var(--v-dim)' }}>PROGRESS TO GOAL — TAP TO UPDATE</span>
                  {goalPct !== null && <span className="v-num" style={{ fontSize: 19, color: 'var(--v-volt-text)' }}>{goalPct}%</span>}
                </div>
                {goalPct !== null && <VoltBar value={goalPct / 100} style={{ marginBottom: 13 }} />}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                  {[
                    { l: 'Target', v: isImpWeight ? `${kgToLbs(user.weightGoal)} lbs` : `${user.weightGoal} kg` },
                    { l: 'Remaining', v: `${kgLeft} ${unit} ${isLoss ? 'to lose' : 'to gain'}` },
                    { l: 'Weeks Left', v: weeksLeft !== null ? `${weeksLeft}` : '—' },
                  ].map((s) => (
                    <div key={s.l}>
                      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.1em', color: 'var(--v-dim)', marginBottom: 3 }}>{s.l.toUpperCase()}</div>
                      <div style={{ fontSize: 16, fontWeight: 800 }}>{s.v}</div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div onClick={() => setShowGoal(true)} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }} role="button" aria-label="Set weight goal">
                <span style={{ fontSize: 13.5, fontWeight: 700 }}>Set your target weight &amp; timeline</span>
                <ChevronRight size={15} color="var(--v-dim)" style={{ marginLeft: 'auto' }} />
              </div>
            )}
          </div>
        </VoltBlock>

        {/* ── Training overview ── */}
        <VoltBlock quiet className="v-rise" style={riseStyle()}>
          <VoltLabel>Training Overview</VoltLabel>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(70px, 1fr))', gap: 12, marginTop: 14 }}>
            {[
              { l: 'Sessions / Wk', v: thisWk, volt: true },
              { l: 'All Time', v: userWo.length },
              { l: 'Streak', v: streak.current, u: 'd', volt: true },
              { l: 'Best Streak', v: streak.longest, u: 'd' },
            ].map((s) => (
              <div key={s.l}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.1em', color: 'var(--v-dim)', marginBottom: 4 }}>{s.l.toUpperCase()}</div>
                <span className="v-num" style={{ fontSize: 31, lineHeight: 1, color: s.volt ? 'var(--v-volt-text)' : undefined }}>
                  {s.v}{s.u && <span style={{ fontSize: 14, color: 'var(--v-dim)' }}>{s.u}</span>}
                </span>
              </div>
            ))}
          </div>
        </VoltBlock>

        {/* ── Nutrition ── */}
        {!hasNutritionTargets ? (
          <VoltBlock className="v-rise" style={{ ...riseStyle(), cursor: 'pointer', textAlign: 'center' }} onClick={() => navigate('/profile')}>
            <VoltLabel>Today's Nutrition</VoltLabel>
            <p style={{ fontSize: 13.5, color: 'var(--v-dim)', margin: '9px 0 0' }}>Complete your profile to unlock daily targets</p>
          </VoltBlock>
        ) : (
          <VoltBlock className="v-rise" style={{ ...riseStyle(), cursor: 'pointer' }} onClick={() => navigate('/diet')}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <VoltLabel>Today's Nutrition</VoltLabel>
              <ChevronRight size={16} color="var(--v-dim)" />
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 7, marginTop: 9 }}>
              <span className="v-num" style={{ fontSize: 31 }}>{Math.round(todayTotals.calories)} / {goalKcal}</span>
              <span style={{ fontSize: 13, color: 'var(--v-dim)', fontWeight: 700 }}>KCAL · {calPct}%</span>
            </div>
            <VoltBar value={calPct / 100} tone="cobalt" style={{ margin: '13px 0 16px' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
              {macroRows.map((m) => (
                <BarRow
                  key={m.label}
                  label={m.label}
                  valText={`${Math.round(m.val)} / ${m.target} g`}
                  frac={clamp((m.val / m.target) || 0, 0, 1)}
                  tone={m.val > m.target ? 'coral' : m.tone}
                />
              ))}
            </div>
          </VoltBlock>
        )}

        {/* ── Activity ── */}
        <VoltBlock className="v-rise" style={{ ...riseStyle(), cursor: 'pointer' }} onClick={() => setShowStepModal(true)}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <VoltLabel>Daily Activity</VoltLabel>
            {displayStepLog?.source && (
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'var(--v-dim)', letterSpacing: '0.08em' }}>{getSourceLabel(displayStepLog.source).toUpperCase()}</span>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 7, marginTop: 9 }}>
            <span className="v-num" style={{ fontSize: 31 }}>{todaySteps > 0 ? formatSteps(todaySteps) : '—'}</span>
            <span style={{ fontSize: 13, color: 'var(--v-dim)', fontWeight: 700 }}>{todaySteps > 0 ? `/ ${formatSteps(stepGoal)} STEPS · ${stepPct}%` : 'TAP TO LOG STEPS'}</span>
          </div>
          <VoltBar value={stepPct / 100} style={{ margin: '13px 0 16px' }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
            {activityRows.map((m) => (
              <BarRow key={m.label} label={m.label} valText={m.valText} frac={clamp((m.val / m.target) || 0, 0, 1)} tone={m.tone} />
            ))}
          </div>
        </VoltBlock>

        {/* ── Metabolic index ── */}
        <VoltBlock quiet className="v-rise" style={riseStyle()}>
          <VoltLabel>Metabolic Index</VoltLabel>
          {Math.round(bmi) && !isNaN(bmi) ? (
            <div style={{ display: 'flex', gap: 20, marginTop: 13, flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 120 }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.12em', color: 'var(--v-dim)', marginBottom: 4 }}>BMI</div>
                <span className="v-num" style={{ fontSize: 38, lineHeight: 1 }}>{bmi}</span>
                <div style={{ marginTop: 7 }}><VoltChip>{bmiCat.label}</VoltChip></div>
              </div>
              <div style={{ flex: 1, minWidth: 120 }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.12em', color: 'var(--v-dim)', marginBottom: 4 }}>TDEE</div>
                <span className="v-num" style={{ fontSize: 38, lineHeight: 1 }}>{displayTDEE || '—'}</span>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'var(--v-dim)', letterSpacing: '0.08em', marginTop: 8 }}>
                  {hasAdaptive ? 'ADAPTIVE' : displayTDEE ? 'CALCULATED' : 'SET PROFILE'}
                </div>
              </div>
            </div>
          ) : (
            <p style={{ fontSize: 13, color: 'var(--v-dim)', margin: '9px 0 0' }}>Add weight &amp; height in your profile to unlock this.</p>
          )}
        </VoltBlock>

        {/* ── Body composition (Volt twin of V1's BodyFatRingCard, V-7) ── */}
        <VoltBodyFatCard />
      </div>

      {/* ── Modals: Volt popup pack (V-7) ── */}
      {showCheckIn && (
        <ModalPortal>
          <VoltReadinessCheckIn
            objectiveScore={objectiveScore}
            onClose={() => setShowCheckIn(false)}
          />
        </ModalPortal>
      )}

      {showLog && (
        <ModalPortal>
          <VoltSheet onClose={() => setShowLog(false)}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <div style={{ fontSize: 19, fontWeight: 800, letterSpacing: '-0.01em' }}>Log Weight</div>
              <button aria-label="Close modal" className="v-press" style={{ background: 'var(--v-canvas)', border: '2.5px solid var(--v-edge)', width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--v-ink)' }} onClick={() => setShowLog(false)}><X size={15} /></button>
            </div>
            <div style={{ marginBottom: 16 }}>
              <VoltLabel>Select Weight ({isImpWeight ? 'lbs' : 'kg'})</VoltLabel>
              <div style={{ marginTop: 8 }}>
                <VoltScrollPicker value={isImpWeight ? kgToLbs(logWeight) : logWeight} onChange={(v) => setLogWeight(isImpWeight ? lbsToKg(v) : v)} items={wtItems} unit={isImpWeight ? 'lbs' : 'kg'} fmtVal={(v) => v.toFixed(1)} />
              </div>
            </div>
            <div style={{ marginBottom: 18 }}>
              <VoltLabel>Notes (optional)</VoltLabel>
              <input placeholder="Post-morning, post-workout..." value={logNote} onChange={(e) => setLogNote(e.target.value)} style={{ width: '100%', marginTop: 8, padding: '12px 14px', borderRadius: 12, background: 'var(--v-canvas)', border: '2.5px solid var(--v-edge)', color: 'var(--v-ink)', fontSize: 14, outline: 'none' }} />
            </div>
            <VoltPill style={{ width: '100%' }} onClick={saveLog}>Save Log</VoltPill>
          </VoltSheet>
        </ModalPortal>
      )}

      {showStepModal && (
        <ModalPortal>
          <VoltSheet onClose={() => setShowStepModal(false)}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <div style={{ fontSize: 19, fontWeight: 800, letterSpacing: '-0.01em' }}>Log Steps</div>
              <button aria-label="Close step modal" className="v-press" style={{ background: 'var(--v-canvas)', border: '2.5px solid var(--v-edge)', width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--v-ink)' }} onClick={() => setShowStepModal(false)}><X size={15} /></button>
            </div>
            <div style={{ marginBottom: 22 }}>
              <VoltLabel>Manual Entry</VoltLabel>
              <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                <input
                  type="number"
                  placeholder="e.g. 8500"
                  value={stepInputVal}
                  onChange={(e) => setStepInputVal(e.target.value)}
                  style={{ flex: 1, minWidth: 0, padding: '12px 14px', background: 'var(--v-canvas)', borderRadius: 12, border: '2.5px solid var(--v-edge)', color: 'var(--v-ink)', fontSize: 16, outline: 'none' }}
                />
                <VoltPill style={{ padding: '0 22px' }} onClick={() => {
                  const val = parseInt(stepInputVal, 10);
                  if (val > 0) {
                    logSteps({ steps: val, date: todayStr, source: 'manual' });
                    addToast('Steps logged for today!', 'success');
                  }
                  setShowStepModal(false);
                }}>Save</VoltPill>
              </div>
            </div>
            <div style={{ height: 2, background: 'var(--v-edge-quiet)', marginBottom: 22 }} />
            <div>
              <VoltLabel>Live Browser Sensor</VoltLabel>
              {supported ? (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '2px solid var(--v-edge-quiet)', padding: 16, borderRadius: 12, margin: '10px 0 14px' }}>
                    <div style={{ fontSize: 13, color: 'var(--v-dim)', fontWeight: 600 }}>Live Steps</div>
                    <div className="v-num" style={{ fontSize: 24, color: 'var(--v-volt-text)' }}>{isTracking ? liveSteps : (displayStepLog?.source === 'browser_sensor' ? todaySteps : 0)}</div>
                  </div>
                  {pedoError && <div style={{ fontSize: 12, color: 'var(--v-coral-text)', marginBottom: 12 }}>{pedoError}</div>}
                  {isTracking ? (
                    <VoltPill ghost style={{ width: '100%' }} onClick={() => {
                      stopTracking();
                      logSteps({ steps: liveSteps, date: todayStr, source: 'browser_sensor' });
                      addToast('Tracking stopped & saved', 'success');
                    }}>Stop Tracking &amp; Save</VoltPill>
                  ) : (
                    <VoltPill style={{ width: '100%' }} onClick={startTracking}>
                      Start Live Tracking
                    </VoltPill>
                  )}
                </>
              ) : (
                <div style={{ fontSize: 12, color: 'var(--v-coral-text)', border: '2px solid var(--v-coral)', padding: 12, borderRadius: 10, marginTop: 10 }}>
                  Device motion not supported on this browser/device.
                </div>
              )}
            </div>
          </VoltSheet>
        </ModalPortal>
      )}

      {showGoal && (
        <ModalPortal>
          <VoltSheet onClose={() => setShowGoal(false)}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <div style={{ fontSize: 19, fontWeight: 800, letterSpacing: '-0.01em' }}>Set Weight Goal</div>
              <button aria-label="Close goal modal" className="v-press" style={{ background: 'var(--v-canvas)', border: '2.5px solid var(--v-edge)', width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--v-ink)' }} onClick={() => setShowGoal(false)}><X size={15} /></button>
            </div>
            <div style={{ fontSize: 12.5, color: 'var(--v-dim)', marginBottom: 18 }}>Current: <strong style={{ color: 'var(--v-volt-text)' }}>{isImpWeight ? kgToLbs(latestWeight) + ' lbs' : latestWeight + ' kg'}</strong> · Your goal drives the calorie recommendations on the Diet page.</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
              <div><VoltLabel>Target Weight ({isImpWeight ? 'lbs' : 'kg'})</VoltLabel><div style={{ marginTop: 8 }}><VoltScrollPicker value={isImpWeight ? kgToLbs(goalTarget) : goalTarget} onChange={(v) => setGoalTarget(isImpWeight ? lbsToKg(v) : v)} items={wtItems} unit={isImpWeight ? 'lbs' : 'kg'} fmtVal={(v) => v.toFixed(1)} /></div></div>
              <div><VoltLabel>Timeline (weeks)</VoltLabel><div style={{ marginTop: 8 }}><VoltScrollPicker value={goalWeeks} onChange={setGoalWeeks} items={wkItems} unit="wks" /></div></div>
            </div>
            {goalTarget && goalWeeks && (
              <div style={{ padding: '12px 14px', border: '2px solid var(--v-edge-quiet)', borderRadius: 12, fontSize: 12.5, fontWeight: 600, color: 'var(--v-volt-text)', marginBottom: 16 }}>
                {goalTarget < latestWeight
                  ? `Lose ${(latestWeight - goalTarget).toFixed(1)} kg in ${goalWeeks} weeks → ~${Math.round((latestWeight - goalTarget) * 7700 / goalWeeks / 7)} kcal/day deficit`
                  : goalTarget > latestWeight
                    ? `Gain ${(goalTarget - latestWeight).toFixed(1)} kg in ${goalWeeks} weeks — diet page will show surplus plan`
                    : 'Maintain current weight — diet page will show maintenance plan'}
              </div>
            )}
            <div style={{ display: 'flex', gap: 10 }}>
              <VoltPill style={{ flex: 1 }} onClick={saveGoal}>Set Goal</VoltPill>
              {user.weightGoal && <VoltPill ghost style={{ padding: '0 18px' }} onClick={async () => { await updateProfile({ weightGoal: null, weightGoalStart: null, goalWeeks: null }); setShowGoal(false); addToast('Goal cleared', 'info'); }}>Clear</VoltPill>}
            </div>
          </VoltSheet>
        </ModalPortal>
      )}
    </>
  );
}
