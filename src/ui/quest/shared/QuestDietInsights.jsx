import { useState } from 'react';
import { Portal } from '../../v1/shared/SharedComponents';
import { classifyTDEEScenario } from '../../../utils/adaptiveCalories';
import { QuestBlock, QuestBtn, QuestLabel } from '../primitives';
import PixelSprite from '../PixelSprite';

// ─── Kaaya Quest · Diet insights ─────────────────────────────────────────────
// Quest twins of the Volt AdaptiveDietBanner / TDEEInsightCard /
// TDEEDetailSheet (which twin V1). Same props, state, handlers and
// localStorage dismissal keys — only the presentation changes.

const SEVERITY_ACCENT = {
  S1: 'var(--q-ember-text)',
  S2: 'var(--q-gold-text)',
  S2b: 'var(--q-gold-text)',
  S3: 'var(--q-ember-text)',
  S4: 'var(--q-gold-text)',
  S5: 'var(--q-gold-text)',
  S6: 'var(--q-volt-text)',
  S7: 'var(--q-gold-text)',
  S8: 'var(--q-gold-text)',
  S9: 'var(--q-volt-text)',
};

export function QuestAdaptiveBanner({ suggestion, currentKcal, newKcal, newMacros, onAccept, onDismiss }) {
  const [loading, setLoading] = useState(false);
  const [exiting, setExiting] = useState(false);

  if (!suggestion || exiting) return null;

  const accent = SEVERITY_ACCENT[suggestion.scenario] || 'var(--q-volt-text)';

  const handleAccept = async () => {
    setLoading(true);
    try {
      await onAccept(newKcal, newMacros?.protein);
    } finally {
      setLoading(false);
      setExiting(true);
    }
  };

  const handleDismiss = () => {
    setExiting(true);
    setTimeout(() => onDismiss(), 200);
  };

  return (
    <QuestBlock style={{ borderLeft: `5px solid ${accent}` }}>
      <QuestLabel style={{ color: accent }}>Adaptive Coach</QuestLabel>
      <div style={{ fontSize: 21, lineHeight: 1.35, marginTop: 10 }}>{suggestion.message}</div>
      <p style={{ fontSize: 17.5, color: 'var(--q-dim)', lineHeight: 1.45, margin: '8px 0 0', maxWidth: '92%' }}>
        {suggestion.reasoning}
      </p>

      {suggestion.adjustKcal !== 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 16 }}>
          <div style={{ padding: '10px 14px', border: '3px solid var(--q-border)', background: 'var(--q-slot)', display: 'flex', alignItems: 'center', gap: 14 }}>
            <div>
              <QuestLabel>Current</QuestLabel>
              <div style={{ fontSize: 19, color: 'var(--q-dim)', textDecoration: 'line-through', marginTop: 4 }}>{currentKcal}</div>
            </div>
            <PixelSprite name="chevR" size={13} />
            <div>
              <QuestLabel tone="volt">Suggested</QuestLabel>
              <div style={{ fontSize: 22, marginTop: 4 }}>{newKcal} <span style={{ fontSize: 14, color: 'var(--q-dim)' }}>kcal</span></div>
            </div>
          </div>
          {newMacros && (
            <div style={{ padding: '10px 14px', border: '3px solid var(--q-border)', background: 'var(--q-slot)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <QuestLabel>Updated Macros</QuestLabel>
              <div style={{ fontSize: 18, marginTop: 4, display: 'flex', gap: 8 }}>
                <span style={{ color: 'var(--q-sky)' }}>P {newMacros.protein}g</span>
                <span style={{ color: 'var(--q-dim)' }}>·</span>
                <span style={{ color: 'var(--q-gold-text)' }}>C {newMacros.carbs}g</span>
                <span style={{ color: 'var(--q-dim)' }}>·</span>
                <span style={{ color: 'var(--q-ember-text)' }}>F {newMacros.fat}g</span>
              </div>
            </div>
          )}
        </div>
      )}

      <div style={{ display: 'flex', gap: 10, marginTop: 18, flexWrap: 'wrap' }}>
        {suggestion.adjustKcal !== 0 ? (
          <>
            <QuestBtn onClick={handleAccept} disabled={loading}>{loading ? 'APPLYING…' : 'APPLY NEW TARGETS'}</QuestBtn>
            <QuestBtn tone="ghost" onClick={handleDismiss}>NOT NOW</QuestBtn>
          </>
        ) : (
          <QuestBtn tone="ghost" onClick={handleDismiss}>DISMISS</QuestBtn>
        )}
      </div>
    </QuestBlock>
  );
}

export function QuestTDEECard({ tdeeEstimate, onUpdateTargets, onLearnMore }) {
  const [dismissed, setDismissed] = useState(false);

  if (!tdeeEstimate || dismissed) return null;

  let tdeeScenario;
  try {
    tdeeScenario = classifyTDEEScenario(tdeeEstimate);
  } catch {
    return null;
  }
  if (!tdeeScenario) return null;

  const handleDismiss = () => {
    const userId = localStorage.getItem('fittrack_last_user_id');
    if (userId) {
      localStorage.setItem(`fittrack_tdee_insight_dismissed_at_${userId}`, new Date().toISOString());
    }
    setDismissed(true);
  };

  const userId = localStorage.getItem('fittrack_last_user_id');
  if (userId) {
    const raw = localStorage.getItem(`fittrack_tdee_insight_dismissed_at_${userId}`);
    if (raw && (new Date() - new Date(raw)) / 86400000 < 7) {
      return null;
    }
  }

  const { severity, message, reasoning } = tdeeScenario;
  const accent = severity === 'warning' ? 'var(--q-gold-text)' : 'var(--q-volt-text)';

  return (
    <QuestBlock style={{ position: 'relative' }}>
      <button
        type="button"
        className="q-chip"
        onClick={handleDismiss}
        style={{ position: 'absolute', top: 10, right: 10, cursor: 'pointer' }}
        aria-label="Dismiss"
      >
        <PixelSprite name="x" size={10} />
      </button>
      <div style={{ display: 'flex', gap: 12 }}>
        <div style={{ width: 42, height: 42, flexShrink: 0, background: 'var(--q-slot)', border: '3px solid var(--q-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <PixelSprite name="bolt" size={20} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 20, lineHeight: 1.35, paddingRight: 26 }}>{message}</div>
          <p style={{ margin: '6px 0 0', fontSize: 17, color: 'var(--q-dim)', lineHeight: 1.45 }}>{reasoning}</p>

          <div style={{ marginTop: 12, display: 'flex', gap: 10, alignItems: 'center', border: '3px solid var(--q-border)', background: 'var(--q-slot)', padding: '10px 12px' }}>
            <div style={{ flex: 1 }}>
              <QuestLabel>Calculated</QuestLabel>
              <div style={{ fontSize: 21, marginTop: 3 }}>{tdeeEstimate.staticTDEE}</div>
            </div>
            <div style={{ width: 3, height: 30, background: 'var(--q-panel2)' }} />
            <div style={{ flex: 1, textAlign: 'right' }}>
              <QuestLabel style={{ color: accent }}>Adaptive ({tdeeEstimate.confidence})</QuestLabel>
              <div style={{ fontSize: 21, marginTop: 3 }}>{tdeeEstimate.estimatedTDEE}</div>
            </div>
          </div>

          <div style={{ marginTop: 14, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <QuestBtn sm onClick={onUpdateTargets}>UPDATE TARGETS</QuestBtn>
            <QuestBtn sm tone="ghost" onClick={onLearnMore}>DETAILS</QuestBtn>
          </div>
        </div>
      </div>
    </QuestBlock>
  );
}

function MathRow({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
      <span style={{ color: 'var(--q-dim)', fontSize: 17.5 }}>{label}</span>
      <span style={{ fontSize: 19 }}>{value}</span>
    </div>
  );
}

export function QuestTDEESheet({ isOpen, onClose, tdeeEstimate }) {
  if (!tdeeEstimate || !isOpen) return null;

  const {
    confidence, windowDays, avgDailyIntake, weightDelta,
    estimatedTDEE, staticTDEE, delta, loggedDays, weightEntries,
  } = tdeeEstimate;

  const confidenceColors = {
    high: 'var(--q-volt-text)',
    medium: 'var(--q-gold-text)',
    low: 'var(--q-ember-text)',
    insufficient: 'var(--q-dim)',
  };
  const color = confidenceColors[confidence] || confidenceColors.insufficient;

  return (
    <Portal>
      <div className="q-sheet-wrap" onClick={onClose}>
        <div className="q-sheet" role="dialog" aria-label="Adaptive TDEE details" onClick={e => e.stopPropagation()}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
            <div className="q-ps" style={{ fontSize: 14, lineHeight: 1.6 }}>ADAPTIVE TDEE</div>
            <button type="button" className="q-chip" onClick={onClose} style={{ cursor: 'pointer' }} aria-label="Close">
              <PixelSprite name="x" size={11} />
            </button>
          </div>
          <p style={{ color: 'var(--q-dim)', fontSize: 17.5, margin: '12px 0 0', lineHeight: 1.45 }}>
            Your estimated Total Daily Energy Expenditure (TDEE) is reverse-engineered from your logged intake and weight changes over the past {windowDays} days.
          </p>

          <div style={{ border: '3px solid var(--q-border)', background: 'var(--q-slot)', padding: 14, marginTop: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ fontSize: 18.5 }}>Confidence Score</span>
              <span className="q-chip" style={{ color, borderColor: color }}>{String(confidence).toUpperCase()}</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div style={{ border: '3px solid var(--q-border)', background: 'var(--q-panel)', padding: 10 }}>
                <QuestLabel>Food Logged</QuestLabel>
                <div style={{ fontSize: 21, marginTop: 3 }}>{loggedDays}<span style={{ fontSize: 14, color: 'var(--q-dim)' }}>/{windowDays}d</span></div>
              </div>
              <div style={{ border: '3px solid var(--q-border)', background: 'var(--q-panel)', padding: 10 }}>
                <QuestLabel>Weights</QuestLabel>
                <div style={{ fontSize: 21, marginTop: 3 }}>{weightEntries}<span style={{ fontSize: 14, color: 'var(--q-dim)' }}> logs</span></div>
              </div>
            </div>
          </div>

          <QuestLabel tone="volt" style={{ marginTop: 18 }}>The Math</QuestLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 11, marginTop: 10 }}>
            <MathRow label="Average Daily Intake" value={`${avgDailyIntake} kcal`} />
            <MathRow label={`${windowDays}-Day Weight Delta`} value={`${weightDelta > 0 ? '+' : ''}${weightDelta} kg`} />
            <MathRow label="Implied Deficit/Surplus" value={`${Math.round(-weightDelta * 7700 / windowDays)} kcal`} />
            <div style={{ height: 3, background: 'var(--q-panel2)' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 19 }}>Adaptive TDEE</span>
              <span style={{ fontSize: 26, color: 'var(--q-volt-text)' }}>{estimatedTDEE}</span>
            </div>
          </div>

          <div style={{ marginTop: 18, fontSize: 16.5, color: 'var(--q-dim)', lineHeight: 1.5, border: '3px solid var(--q-border)', background: 'var(--q-slot)', padding: 12 }}>
            <strong style={{ color: 'var(--q-ink)' }}>Note:</strong> Your static calculated TDEE is {staticTDEE} kcal. The adaptive engine suggests a {Math.abs(delta)} kcal {delta > 0 ? 'increase' : 'decrease'} based on your actual metabolism.
          </div>

          <QuestBtn tone="ghost" style={{ width: '100%', marginTop: 18 }} onClick={onClose}>CLOSE DETAILS</QuestBtn>
        </div>
      </div>
    </Portal>
  );
}
