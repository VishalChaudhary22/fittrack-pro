import { useEffect, useState } from 'react';
import { Portal } from '../../v1/shared/SharedComponents';
import { useApp } from '../../../core/context/AppContext';
import { calcReadinessScore, getTier } from '../../../utils/readinessUtils';
import { tod, kgToLbs, lbsToKg } from '../../../utils/helpers';
import { QuestBtn, QuestLabel } from '../primitives';
import PixelSprite from '../PixelSprite';
import { questSound } from '../sound';

// ─── Kaaya Quest · Today sheets (Q-10 parity pack) ───────────────────────────
// Quest twins of Volt's Today popup pack (V-7): readiness check-in, log
// weight, log steps, set weight goal. All state, scoring and save payloads
// come from the shared useToday hook / AppContext — identical to V1/Volt.
// Presentation only: bottom sheets in the Quest cartridge language.

export function QuestSheet({ label, title, onClose, children }) {
  return (
    <Portal>
      <div className="q-sheet-wrap" onClick={onClose}>
        <div className="q-sheet" role="dialog" aria-label={title} onClick={(e) => e.stopPropagation()}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 16 }}>
            <div>
              <QuestLabel tone="volt">{label}</QuestLabel>
              <div className="q-ps" style={{ fontSize: 15, lineHeight: 1.5, marginTop: 8, textTransform: 'uppercase' }}>{title}</div>
            </div>
            <button type="button" className="q-chip" onClick={onClose} aria-label="Close" style={{ cursor: 'pointer', padding: '8px 9px', flexShrink: 0 }}>
              <PixelSprite name="x" size={11} />
            </button>
          </div>
          {children}
        </div>
      </div>
    </Portal>
  );
}

// Weight field with arcade steppers — the Quest answer to Volt's scroll
// picker. Local string state so typing never fights the kg⇄lbs conversion;
// every change commits the kg value through onKgChange immediately.
function QuestWeightField({ label, isImpWeight, kgValue, onKgChange }) {
  const unit = isImpWeight ? 'lbs' : 'kg';
  const stepBy = isImpWeight ? 1 : 0.1;
  const [valStr, setValStr] = useState(() => {
    const v = parseFloat(kgValue);
    return isNaN(v) ? '' : String(isImpWeight ? kgToLbs(v) : +v.toFixed(1));
  });
  const commit = (str) => {
    setValStr(str);
    const v = parseFloat(str);
    if (!isNaN(v)) onKgChange(isImpWeight ? lbsToKg(v) : v);
  };
  const bump = (dir) => {
    const v = parseFloat(valStr) || 0;
    commit(String(+(v + dir * stepBy).toFixed(1)));
  };
  return (
    <div>
      <QuestLabel>{label} ({unit})</QuestLabel>
      <div style={{ display: 'flex', gap: 8, marginTop: 8, alignItems: 'stretch' }}>
        <QuestBtn sm onClick={() => bump(-1)} aria-label={`Decrease ${label}`} style={{ padding: '0 13px' }}>
          <PixelSprite name="minus" size={12} />
        </QuestBtn>
        <input
          className="q-slot-input"
          type="number"
          inputMode="decimal"
          step={stepBy}
          value={valStr}
          onChange={(e) => commit(e.target.value)}
          aria-label={`${label} in ${unit}`}
          style={{ flex: 1, minWidth: 0, textAlign: 'center', fontSize: 25 }}
        />
        <QuestBtn sm onClick={() => bump(1)} aria-label={`Increase ${label}`} style={{ padding: '0 13px' }}>
          <PixelSprite name="plus" size={12} />
        </QuestBtn>
      </div>
    </div>
  );
}

// ─── Readiness check-in ──────────────────────────────────────────────────────
// Identical questions, scoring and logReadiness payload to V1/Volt.

const QUESTIONS = [
  {
    field: 'sleepHours',
    label: 'How much did you sleep last night?',
    options: [
      { label: '< 5h', value: 4.5 },
      { label: '5–6h', value: 5.5 },
      { label: '6–7h', value: 6.5 },
      { label: '7–8h', value: 7.5 },
      { label: '8–9h', value: 8.5 },
      { label: '9h+', value: 9.5 },
    ],
  },
  {
    field: 'energyLevel',
    label: "How's your energy right now?",
    options: [
      { label: 'Drained', value: 1 },
      { label: 'Low', value: 2 },
      { label: 'Okay', value: 3 },
      { label: 'Good', value: 4 },
      { label: 'Peak', value: 5 },
    ],
  },
  {
    field: 'sorenessLevel',
    label: 'Any muscle soreness today?',
    options: [
      { label: 'None — feeling fresh', value: 'none' },
      { label: 'Mild — slight stiffness', value: 'mild' },
      { label: 'Significant — clearly sore', value: 'significant' },
    ],
  },
  {
    field: 'stressLevel',
    label: 'Mental stress level today?',
    options: [
      { label: 'Chill', value: 'low' },
      { label: 'Some', value: 'medium' },
      { label: 'Stressed', value: 'high' },
    ],
  },
];

const verdictFor = (score) => (score >= 80 ? 'BATTLE READY' : score >= 60 ? 'STEADY' : score >= 40 ? 'EASE IN' : 'RECHARGE NEEDED');

export function QuestReadinessCheckIn({ objectiveScore, onClose }) {
  const { user, logReadiness } = useApp();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({
    sleepHours: null,
    energyLevel: null,
    sorenessLevel: null,
    stressLevel: null,
  });
  const [finalScore, setFinalScore] = useState(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const answer = (field, value) => {
    const updated = { ...answers, [field]: value };
    setAnswers(updated);
    questSound('set');

    if (step < 3) {
      setTimeout(() => setStep(s => s + 1), 220);
    } else {
      // Final step — compute and save (identical payload to V1/Volt)
      const score = calcReadinessScore(updated, objectiveScore);
      setFinalScore(score);
      logReadiness({
        userId: user.id,
        date: tod(),
        ...updated,
        score,
        objectiveScore,
        checkInComplete: true,
      });
      questSound('xp');
      setTimeout(onClose, 2200); // show score for 2.2s then close
    }
  };

  const q = QUESTIONS[step];

  return (
    <Portal>
      <div className="q-sheet-wrap" onClick={onClose}>
        <div className="q-sheet" role="dialog" aria-label="Daily check-in" onClick={(e) => e.stopPropagation()}>
          {finalScore !== null ? (
            /* ── Score reveal ── */
            <div style={{ textAlign: 'center', padding: '16px 0 10px' }}>
              <QuestLabel tone="volt">Readiness Score</QuestLabel>
              <div className="q-ps" style={{ fontSize: 46, lineHeight: 1.15, marginTop: 12, color: getTier(finalScore).color }}>
                {finalScore}
              </div>
              <div className="q-ps" style={{ fontSize: 13, marginTop: 12 }}>{verdictFor(finalScore)}</div>
              <p style={{ fontSize: 20, color: 'var(--q-dim)', margin: '9px 0 0' }}>{getTier(finalScore).message}</p>
            </div>
          ) : (
            /* ── Questions ── */
            <>
              {/* Progress segments */}
              <div style={{ display: 'flex', gap: 6, marginBottom: 18 }} aria-hidden="true">
                {QUESTIONS.map((_, i) => (
                  <div key={i} style={{ flex: 1, height: 10, border: '3px solid var(--q-border)', background: i <= step ? 'var(--q-volt)' : 'var(--q-slot)' }} />
                ))}
              </div>

              <QuestLabel tone="volt">Check-In · {step + 1} of 4</QuestLabel>
              <div style={{ fontSize: 27, lineHeight: 1.25, margin: '10px 0 18px' }}>{q.label}</div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {q.options.map(opt => {
                  const selected = answers[q.field] === opt.value;
                  return (
                    <button
                      key={String(opt.value)}
                      type="button"
                      onClick={() => answer(q.field, opt.value)}
                      style={{
                        padding: '13px 14px', minHeight: 52, textAlign: 'left', cursor: 'pointer',
                        border: '3px solid var(--q-border)',
                        background: selected ? 'var(--q-volt)' : 'var(--q-slot)',
                        color: selected ? 'var(--q-btn-fg)' : 'var(--q-ink)',
                        fontFamily: "'VT323', monospace", fontSize: 21,
                      }}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={onClose}
                style={{
                  display: 'block', margin: '18px auto 0', minHeight: 44, padding: '0 12px',
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontFamily: "'VT323', monospace", fontSize: 18, letterSpacing: '0.06em',
                  textTransform: 'uppercase', color: 'var(--q-dim)',
                }}
              >
                Skip today
              </button>
            </>
          )}
        </div>
      </div>
    </Portal>
  );
}

// ─── Log weight ──────────────────────────────────────────────────────────────

export function QuestLogWeightSheet({ isImpWeight, logWeight, setLogWeight, logNote, setLogNote, saveLog, onClose }) {
  return (
    <QuestSheet label="Log" title="Log Weight" onClose={onClose}>
      <QuestWeightField label="Select Weight" isImpWeight={isImpWeight} kgValue={logWeight} onKgChange={setLogWeight} />
      <div style={{ marginTop: 16 }}>
        <QuestLabel>Notes (optional)</QuestLabel>
        <input
          className="q-slot-input"
          placeholder="Post-morning, post-workout..."
          value={logNote}
          onChange={(e) => setLogNote(e.target.value)}
          style={{ marginTop: 8 }}
        />
      </div>
      <QuestBtn onClick={saveLog} style={{ width: '100%', marginTop: 18 }}>Save Log</QuestBtn>
    </QuestSheet>
  );
}

// ─── Log steps ───────────────────────────────────────────────────────────────

export function QuestStepsSheet({
  stepInputVal, setStepInputVal, todayStr, todaySteps, displayStepLog,
  supported, isTracking, liveSteps, pedoError, startTracking, stopTracking,
  logSteps, addToast, onClose,
}) {
  const saveManual = () => {
    const val = parseInt(stepInputVal, 10);
    if (val > 0) {
      logSteps({ steps: val, date: todayStr, source: 'manual' });
      addToast('Steps logged for today!', 'success');
    }
    onClose();
  };
  const stopAndSave = () => {
    stopTracking();
    logSteps({ steps: liveSteps, date: todayStr, source: 'browser_sensor' });
    addToast('Tracking stopped & saved', 'success');
  };
  return (
    <QuestSheet label="Log" title="Log Steps" onClose={onClose}>
      <QuestLabel>Manual Entry</QuestLabel>
      <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
        <input
          className="q-slot-input"
          type="number"
          placeholder="e.g. 8500"
          value={stepInputVal}
          onChange={(e) => setStepInputVal(e.target.value)}
          aria-label="Steps"
          style={{ flex: 1, minWidth: 0, fontSize: 22 }}
        />
        <QuestBtn onClick={saveManual} style={{ padding: '0 22px' }}>Save</QuestBtn>
      </div>

      <div style={{ height: 3, background: 'var(--q-panel2)', margin: '22px 0' }} />

      <QuestLabel>Live Browser Sensor</QuestLabel>
      {supported ? (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '3px solid var(--q-border)', background: 'var(--q-slot)', padding: '13px 14px', margin: '10px 0 14px' }}>
            <span style={{ fontSize: 19, color: 'var(--q-dim)' }}>Live Steps</span>
            <span className="q-ps" style={{ fontSize: 19, color: 'var(--q-volt-text)' }}>
              {isTracking ? liveSteps : (displayStepLog?.source === 'browser_sensor' ? todaySteps : 0)}
            </span>
          </div>
          {pedoError && <div style={{ fontSize: 18, color: 'var(--q-ember-text)', marginBottom: 12 }}>{pedoError}</div>}
          {isTracking ? (
            <QuestBtn tone="ghost" onClick={stopAndSave} style={{ width: '100%' }}>Stop Tracking &amp; Save</QuestBtn>
          ) : (
            <QuestBtn onClick={startTracking} style={{ width: '100%' }}>Start Live Tracking</QuestBtn>
          )}
        </>
      ) : (
        <div style={{ fontSize: 18, color: 'var(--q-ember-text)', border: '3px solid var(--q-ember)', padding: '11px 13px', marginTop: 10, lineHeight: 1.35 }}>
          Device motion not supported on this browser/device.
        </div>
      )}
    </QuestSheet>
  );
}

// ─── Set weight goal ─────────────────────────────────────────────────────────

export function QuestGoalSheet({
  user, isImpWeight, latestWeight, goalTarget, setGoalTarget,
  goalWeeks, setGoalWeeks, saveGoal, onClear, onClose,
}) {
  const [weeksStr, setWeeksStr] = useState(String(goalWeeks || 12));
  const commitWeeks = (str) => {
    setWeeksStr(str);
    const v = parseInt(str, 10);
    if (!isNaN(v) && v >= 1 && v <= 52) setGoalWeeks(v);
  };
  return (
    <QuestSheet label="Goal" title="Set Weight Goal" onClose={onClose}>
      <p style={{ fontSize: 19, color: 'var(--q-dim)', margin: '0 0 18px', lineHeight: 1.4 }}>
        Current: <strong style={{ color: 'var(--q-volt-text)' }}>{isImpWeight ? kgToLbs(latestWeight) + ' lbs' : latestWeight + ' kg'}</strong>
        {' '}· Your goal drives the calorie recommendations on the Diet page.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
        <QuestWeightField label="Target Weight" isImpWeight={isImpWeight} kgValue={goalTarget} onKgChange={setGoalTarget} />
        <div>
          <QuestLabel>Timeline (weeks)</QuestLabel>
          <input
            className="q-slot-input"
            type="number"
            min="1"
            max="52"
            value={weeksStr}
            onChange={(e) => commitWeeks(e.target.value)}
            aria-label="Timeline in weeks"
            style={{ marginTop: 8, textAlign: 'center', fontSize: 25 }}
          />
        </div>
      </div>
      {goalTarget && goalWeeks ? (
        <div style={{ padding: '11px 13px', border: '3px solid var(--q-border)', background: 'var(--q-slot)', fontSize: 19, color: 'var(--q-volt-text)', marginBottom: 16, lineHeight: 1.4 }}>
          {goalTarget < latestWeight
            ? `Lose ${(latestWeight - goalTarget).toFixed(1)} kg in ${goalWeeks} weeks → ~${Math.round((latestWeight - goalTarget) * 7700 / goalWeeks / 7)} kcal/day deficit`
            : goalTarget > latestWeight
              ? `Gain ${(goalTarget - latestWeight).toFixed(1)} kg in ${goalWeeks} weeks — diet page will show surplus plan`
              : 'Maintain current weight — diet page will show maintenance plan'}
        </div>
      ) : null}
      <div style={{ display: 'flex', gap: 10 }}>
        <QuestBtn style={{ flex: 1 }} onClick={saveGoal}>Set Goal</QuestBtn>
        {user.weightGoal && (
          <QuestBtn tone="ghost" style={{ padding: '0 18px' }} onClick={onClear}>Clear</QuestBtn>
        )}
      </div>
    </QuestSheet>
  );
}
