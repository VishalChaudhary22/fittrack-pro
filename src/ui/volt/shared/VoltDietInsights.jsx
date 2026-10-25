import { useState } from 'react';
import { TrendingUp, TrendingDown, Brain, Check, X, Activity, AlertTriangle } from 'lucide-react';
import { classifyTDEEScenario } from '../../../utils/adaptiveCalories';
import { ModalPortal } from '../../v1/shared/SharedComponents';
import { VoltBlock, VoltPill, VoltLabel } from '../primitives';
import { VoltSheet } from './VoltShared';

// Volt twins of V1's AdaptiveDietBanner, TDEEInsightCard and TDEEDetailSheet
// (V-7). Props, state and handlers are identical to V1; only the presentation
// changes. Scenario colors are data (severity), mapped onto Volt tokens.

// ─── Adaptive Diet Banner ─────────────────────────────────────────────────────
const SEVERITY_ACCENT = {
  S1: 'var(--v-coral-text)', // Losing too fast
  S2: 'var(--v-volt-text)', // Stall
  S2b: 'var(--v-volt-text)', // Progress too slow
  S3: 'var(--v-coral-text)', // Gaining instead of losing
  S4: 'var(--v-volt-text)', // Gaining too fast
  S5: 'var(--v-volt-text)', // Not gaining at all
  S6: 'var(--v-success-text)', // On track
  S7: 'var(--v-volt-text)', // Weight creeping up
  S8: 'var(--v-volt-text)', // Weight dropping unintentionally
  S9: 'var(--v-success-text)',
};

export function VoltAdaptiveDietBanner({ suggestion, currentKcal, newKcal, newMacros, onAccept, onDismiss, onDetails, compact = false }) {
  const [loading, setLoading] = useState(false);
  const [exiting, setExiting] = useState(false);

  if (!suggestion || exiting) return null;

  const accent = SEVERITY_ACCENT[suggestion.scenario] || 'var(--v-volt-text)';
  const isPositive = suggestion.scenario === 'S6' || suggestion.scenario === 'S9';
  const Icon = isPositive ? Check : suggestion.severity === 'action' ? TrendingUp : Brain;

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

  // Compact variant for Dashboard — just headline + link
  if (compact) {
    return (
      <VoltBlock quiet className="v-rise" style={{ borderLeft: `5px solid ${accent}`, display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10, flexShrink: 0,
          background: `color-mix(in srgb, ${accent} 16%, transparent)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon size={18} color={accent} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.14em', color: accent, marginBottom: 3 }}>
            ⚡ Adaptive Coach
          </div>
          <div style={{ fontSize: 14.5, fontWeight: 700, lineHeight: 1.3 }}>{suggestion.message}</div>
          {!isPositive && suggestion.adjustKcal !== 0 && (
            <div style={{ fontSize: 12, color: 'var(--v-dim)', marginTop: 2 }}>
              Suggested target: <span style={{ fontWeight: 700, color: 'var(--v-ink)' }}>{newKcal} kcal</span>
            </div>
          )}
        </div>
        {!isPositive && onDetails && (
          <VoltPill ghost onClick={onDetails} style={{ minHeight: 40, padding: '0 16px', fontSize: 12.5, whiteSpace: 'nowrap' }}>
            Review
          </VoltPill>
        )}
      </VoltBlock>
    );
  }

  // Full variant for DietPage
  return (
    <VoltBlock className="v-rise" style={{ borderLeft: `5px solid ${accent}` }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: `color-mix(in srgb, ${accent} 18%, transparent)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon size={16} color={accent} />
        </div>
        <span style={{ fontSize: 10.5, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', color: accent }}>
          ⚡ Adaptive Coach
        </span>
      </div>

      {/* Main message */}
      <div style={{ fontSize: 19, fontWeight: 800, letterSpacing: '-0.01em', marginBottom: 8, lineHeight: 1.25 }}>
        {suggestion.message}
      </div>

      {/* Reasoning */}
      <div style={{ fontSize: 13.5, color: 'var(--v-dim)', lineHeight: 1.6, marginBottom: 18, maxWidth: '92%' }}>
        {suggestion.reasoning}
      </div>

      {/* Proposed change chips */}
      {suggestion.adjustKcal !== 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 20 }}>
          <div style={{
            padding: '12px 18px', borderRadius: 14,
            border: '2px solid var(--v-edge-quiet)',
            display: 'flex', alignItems: 'center', gap: 14,
          }}>
            <div>
              <VoltLabel>Current</VoltLabel>
              <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--v-dim)', textDecoration: 'line-through' }}>{currentKcal}</div>
            </div>
            <TrendingUp size={16} color={accent} style={{ transform: suggestion.adjustKcal > 0 ? 'rotate(-45deg)' : 'rotate(45deg)' }} />
            <div>
              <VoltLabel volt>Suggested</VoltLabel>
              <div className="v-num" style={{ fontSize: 20, lineHeight: 1.1 }}>{newKcal} <span style={{ fontSize: 12, color: 'var(--v-dim)' }}>kcal</span></div>
            </div>
          </div>

          {newMacros && (
            <div style={{
              padding: '12px 18px', borderRadius: 14,
              border: '2px solid var(--v-edge-quiet)',
              display: 'flex', flexDirection: 'column', justifyContent: 'center',
            }}>
              <VoltLabel>Updated Macros</VoltLabel>
              <div style={{ fontSize: 14, fontWeight: 700, display: 'flex', gap: 8, marginTop: 3 }}>
                <span style={{ color: 'var(--v-volt-text)' }}>P {newMacros.protein}g</span>
                <span style={{ color: 'var(--v-dim)' }}>·</span>
                <span style={{ color: 'var(--v-cobalt)' }}>C {newMacros.carbs}g</span>
                <span style={{ color: 'var(--v-dim)' }}>·</span>
                <span style={{ color: '#D97706' }}>F {newMacros.fat}g</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* CTAs */}
      {suggestion.adjustKcal !== 0 ? (
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <VoltPill onClick={handleAccept} disabled={loading} style={{ padding: '0 24px', opacity: loading ? 0.7 : 1 }}>
            {loading ? (
              <span style={{
                width: 18, height: 18, border: '2.5px solid rgba(20,20,22,0.3)',
                borderTopColor: '#141416', borderRadius: '50%',
                animation: 'v-spin 0.6s linear infinite', display: 'inline-block',
              }} />
            ) : (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}><Check size={16} strokeWidth={3} /> Apply New Targets</span>
            )}
          </VoltPill>
          <VoltPill ghost onClick={handleDismiss} style={{ padding: '0 20px' }}>
            Not Now
          </VoltPill>
        </div>
      ) : (
        <VoltPill ghost onClick={handleDismiss} style={{ minHeight: 44, padding: '0 16px', fontSize: 13 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><X size={14} /> Dismiss</span>
        </VoltPill>
      )}
      <style>{`@keyframes v-spin { to { transform: rotate(360deg); } }`}</style>
    </VoltBlock>
  );
}

// ─── TDEE Insight Card ────────────────────────────────────────────────────────
export function VoltTDEEInsightCard({ tdeeEstimate, onUpdateTargets, onLearnMore }) {
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

  // Check if previously dismissed (7-day cooldown)
  const userId = localStorage.getItem('fittrack_last_user_id');
  if (userId) {
    const raw = localStorage.getItem(`fittrack_tdee_insight_dismissed_at_${userId}`);
    if (raw && (new Date() - new Date(raw)) / 86400000 < 7) {
      return null;
    }
  }

  const { severity, message, reasoning, adjustKcal } = tdeeScenario;
  const isWarning = severity === 'warning';
  const accent = isWarning ? '#D97706' : 'var(--v-volt-text)';

  return (
    <VoltBlock className="v-rise" style={{ position: 'relative' }}>
      {/* Dismiss */}
      <button
        onClick={handleDismiss}
        className="v-press"
        style={{ position: 'absolute', top: 10, right: 10, background: 'none', border: 'none', fontSize: 17, color: 'var(--v-dim)', cursor: 'pointer', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 8 }}
        aria-label="Dismiss"
      >&times;</button>

      <div style={{ display: 'flex', gap: 12 }}>
        <div style={{
          width: 38, height: 38, borderRadius: 12, flexShrink: 0,
          background: isWarning ? 'rgba(217,119,6,0.14)' : 'color-mix(in srgb, var(--v-volt) 22%, transparent)',
          border: '2px solid var(--v-edge)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {isWarning ? <AlertTriangle size={18} color={accent} /> : adjustKcal > 0 ? <TrendingUp size={18} color={accent} /> : <TrendingDown size={18} color={accent} />}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h4 style={{ margin: '0 0 4px 0', fontSize: 14.5, fontWeight: 800, letterSpacing: '-0.01em', paddingRight: 22 }}>
            {message}
          </h4>
          <p style={{ margin: 0, fontSize: 12.5, color: 'var(--v-dim)', lineHeight: 1.55 }}>
            {reasoning}
          </p>

          {/* Comparison strip */}
          <div style={{
            marginTop: 12, display: 'flex', gap: 8, alignItems: 'center',
            border: '2px solid var(--v-edge-quiet)',
            padding: '10px 12px', borderRadius: 12,
          }}>
            <div style={{ flex: 1 }}>
              <VoltLabel>Calculated</VoltLabel>
              <div className="v-num" style={{ fontSize: 16, marginTop: 2 }}>{tdeeEstimate.staticTDEE}</div>
            </div>
            <div style={{ width: 2, height: 28, background: 'var(--v-edge-quiet)' }} />
            <div style={{ flex: 1, textAlign: 'right' }}>
              <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: accent }}>Adaptive ({tdeeEstimate.confidence})</div>
              <div className="v-num" style={{ fontSize: 16, marginTop: 2 }}>{tdeeEstimate.estimatedTDEE}</div>
            </div>
          </div>

          {/* Actions */}
          <div style={{ marginTop: 14, display: 'flex', gap: 8 }}>
            <VoltPill onClick={onUpdateTargets} style={{ flex: 1, minHeight: 44, fontSize: 12.5 }}>
              Update targets
            </VoltPill>
            <VoltPill ghost onClick={onLearnMore} style={{ minHeight: 44, padding: '0 16px', fontSize: 12.5 }}>
              Details
            </VoltPill>
          </div>
        </div>
      </div>
    </VoltBlock>
  );
}

// ─── TDEE Detail Sheet ────────────────────────────────────────────────────────
export function VoltTDEEDetailSheet({ isOpen, onClose, tdeeEstimate }) {
  if (!tdeeEstimate || !isOpen) return null;

  const {
    confidence,
    windowDays,
    avgDailyIntake,
    weightDelta,
    estimatedTDEE,
    staticTDEE,
    delta,
    loggedDays,
    weightEntries
  } = tdeeEstimate;

  const confidenceColors = {
    high: 'var(--v-success-text)',
    medium: '#D97706',
    low: 'var(--v-coral-text)',
    insufficient: 'var(--v-dim)'
  };
  const color = confidenceColors[confidence] || confidenceColors.insufficient;

  return (
    <ModalPortal>
      <VoltSheet onClose={onClose}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
          <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: '-0.01em' }}>Adaptive TDEE Details</div>
          <button onClick={onClose} aria-label="Close" className="v-press" style={{ background: 'var(--v-canvas)', border: '2.5px solid var(--v-edge)', width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--v-ink)' }}><X size={17} /></button>
        </div>
        <p style={{ color: 'var(--v-dim)', fontSize: 13, margin: '0 0 20px 0', lineHeight: 1.55 }}>
          Your estimated Total Daily Energy Expenditure (TDEE) is reverse-engineered from your logged intake and weight changes over the past {windowDays} days.
        </p>

        <div style={{ border: '2px solid var(--v-edge-quiet)', borderRadius: 16, padding: 16, marginBottom: 22 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <span style={{ fontSize: 13.5, fontWeight: 700 }}>Confidence Score</span>
            <span style={{
              color: color, border: `2px solid ${color}`,
              padding: '3px 10px', borderRadius: 8, fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em',
            }}>
              {confidence}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div style={{ border: '2px solid var(--v-edge-quiet)', padding: 12, borderRadius: 12 }}>
              <VoltLabel>Food Logged</VoltLabel>
              <div className="v-num" style={{ fontSize: 19, marginTop: 3 }}>{loggedDays}<span style={{ fontSize: 11, color: 'var(--v-dim)' }}>/{windowDays}d</span></div>
            </div>
            <div style={{ border: '2px solid var(--v-edge-quiet)', padding: 12, borderRadius: 12 }}>
              <VoltLabel>Weights</VoltLabel>
              <div className="v-num" style={{ fontSize: 19, marginTop: 3 }}>{weightEntries}<span style={{ fontSize: 11, color: 'var(--v-dim)' }}> logs</span></div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <Activity size={15} color="var(--v-volt-text)" />
          <VoltLabel volt>The Math</VoltLabel>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <MathRow label="Average Daily Intake" value={`${avgDailyIntake} kcal`} />
          <MathRow label={`${windowDays}-Day Weight Delta`} value={`${weightDelta > 0 ? '+' : ''}${weightDelta} kg`} />
          <MathRow label="Implied Deficit/Surplus" value={`${Math.round(-weightDelta * 7700 / windowDays)} kcal`} />

          <div style={{ height: 2, background: 'var(--v-edge-quiet)', margin: '4px 0' }} />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 14.5, fontWeight: 700 }}>Adaptive TDEE</span>
            <span className="v-num" style={{ fontSize: 22, color: 'var(--v-volt-text)' }}>{estimatedTDEE}</span>
          </div>
        </div>

        <div style={{ marginTop: 22, fontSize: 12.5, color: 'var(--v-dim)', lineHeight: 1.55, border: '2px solid var(--v-edge-quiet)', padding: 14, borderRadius: 12 }}>
          <strong style={{ color: 'var(--v-ink)' }}>Note:</strong> Your static calculated TDEE is {staticTDEE} kcal. The adaptive engine suggests a {Math.abs(delta)} kcal {delta > 0 ? 'increase' : 'decrease'} based on your actual metabolism.
        </div>

        <VoltPill ghost style={{ width: '100%', marginTop: 22 }} onClick={onClose}>Close Details</VoltPill>
      </VoltSheet>
    </ModalPortal>
  );
}

function MathRow({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ color: 'var(--v-dim)', fontSize: 13, fontWeight: 600 }}>{label}</span>
      <span style={{ fontSize: 14, fontWeight: 700, fontFamily: "'Space Grotesk', monospace" }}>{value}</span>
    </div>
  );
}
