import { useState } from 'react';
import { TrendingUp, Brain, Check, X } from 'lucide-react';

const SEVERITY_COLORS = {
  S1: 'var(--error)',
  S2: 'var(--primary-container)',
  S3: 'var(--error)',
  S4: 'var(--primary-container)',
  S5: 'var(--primary-container)',
  S6: '#4ADE80',
  S7: 'var(--primary)',
  S8: 'var(--primary)',
  S9: '#4ADE80',
};

export default function AdaptiveDietBanner({ suggestion, currentKcal, newKcal, newMacros, onAccept, onDismiss, compact = false }) {
  const [loading, setLoading] = useState(false);
  const [exiting, setExiting] = useState(false);

  if (!suggestion || exiting) return null;

  const severityColor = SEVERITY_COLORS[suggestion.scenario] || 'var(--primary)';
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
      <div
        style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '12px 16px', borderRadius: 12,
          background: 'var(--surface-container-lowest)',
          borderLeft: `3px solid ${severityColor}`,
          marginBottom: 16,
          animation: 'cascadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <Icon size={16} color={severityColor} style={{ flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--on-surface)' }}>{suggestion.message}</span>
          {!isPositive && suggestion.adjustKcal !== 0 && (
            <span style={{ fontSize: 12, color: 'var(--on-surface-variant)', marginLeft: 8 }}>
              → {newKcal} kcal
            </span>
          )}
        </div>
        {!isPositive && (
          <button
            onClick={() => window.location.hash = '#/diet'}
            style={{
              fontSize: 11, fontWeight: 700, color: 'var(--primary)',
              background: 'none', border: 'none', cursor: 'pointer',
              whiteSpace: 'nowrap', padding: '4px 8px',
            }}
          >
            View Details →
          </button>
        )}
      </div>
    );
  }

  // Full variant for DietPage
  return (
    <div
      className="glass-card"
      style={{
        padding: '18px 20px', borderRadius: 20, marginBottom: 20,
        borderLeft: `4px solid ${severityColor}`,
        position: 'relative', overflow: 'hidden',
        animation: 'cascadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      {/* Radial glow accent */}
      <div style={{
        position: 'absolute', top: -40, right: -40,
        width: 120, height: 120, borderRadius: '50%',
        background: severityColor, opacity: 0.06,
        filter: 'blur(40px)', pointerEvents: 'none',
      }} />

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, position: 'relative' }}>
        <div style={{
          width: 28, height: 28, borderRadius: 8,
          background: `${severityColor}20`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon size={14} color={severityColor} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {/* Pulse dot */}
          <span style={{ position: 'relative', display: 'inline-flex', width: 6, height: 6 }}>
            <span style={{
              animation: 'pulse 2s cubic-bezier(0, 0, 0.2, 1) infinite',
              position: 'absolute', display: 'inline-flex',
              height: '100%', width: '100%', borderRadius: '50%',
              background: severityColor, opacity: 0.75,
            }} />
            <span style={{
              position: 'relative', display: 'inline-flex', borderRadius: '50%',
              height: 6, width: 6, background: severityColor,
            }} />
          </span>
          <span style={{
            fontSize: 9, fontWeight: 700, textTransform: 'uppercase',
            letterSpacing: '0.15em', color: severityColor,
          }}>
            Adaptive Coach
          </span>
        </div>
      </div>

      {/* Main message */}
      <div className="headline-md" style={{
        color: 'var(--on-surface)', fontSize: 16, marginBottom: 6,
      }}>
        {suggestion.message}
      </div>

      {/* Reasoning */}
      <div style={{
        fontSize: 12, color: 'var(--on-surface-variant)',
        lineHeight: 1.5, marginBottom: 16,
      }}>
        {suggestion.reasoning}
      </div>

      {/* Proposed change chips */}
      {suggestion.adjustKcal !== 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
          <div style={{
            padding: '8px 14px', borderRadius: 12,
            background: 'var(--surface-container-highest)',
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            <span style={{ fontSize: 14, fontWeight: 800, color: 'var(--on-surface)' }}>
              {newKcal} kcal / day
            </span>
            <span style={{ fontSize: 11, color: 'var(--on-surface-dim)' }}>
              (was {currentKcal})
            </span>
          </div>
          {newMacros && (
            <div style={{
              padding: '8px 14px', borderRadius: 12,
              background: 'var(--surface-container)',
              fontSize: 12, fontWeight: 600, color: 'var(--on-surface-variant)',
            }}>
              P {newMacros.protein}g · C {newMacros.carbs}g · F {newMacros.fat}g
            </div>
          )}
        </div>
      )}

      {/* CTAs */}
      {suggestion.adjustKcal !== 0 ? (
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <button
            onClick={handleAccept}
            disabled={loading}
            style={{
              flex: 1, padding: '12px 16px', borderRadius: 12, border: 'none',
              background: 'linear-gradient(135deg, var(--ember-start), var(--ember-end))',
              color: 'white', fontWeight: 700, fontSize: 13, cursor: loading ? 'default' : 'pointer',
              opacity: loading ? 0.7 : 1,
              transition: 'all 0.2s',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            }}
          >
            {loading ? (
              <span style={{
                width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)',
                borderTopColor: '#fff', borderRadius: '50%',
                animation: 'spin 0.6s linear infinite', display: 'inline-block',
              }} />
            ) : (
              <>
                <Check size={14} /> Update Targets
              </>
            )}
          </button>
          <button
            onClick={handleDismiss}
            style={{
              padding: '12px 16px', borderRadius: 12, border: 'none',
              background: 'transparent', color: 'var(--on-surface-variant)',
              fontWeight: 600, fontSize: 13, cursor: 'pointer',
            }}
          >
            Not Now
          </button>
        </div>
      ) : (
        <button
          onClick={handleDismiss}
          style={{
            padding: '8px 14px', borderRadius: 12, border: 'none',
            background: 'var(--surface-container-highest)',
            color: 'var(--on-surface-variant)', fontWeight: 600,
            fontSize: 12, cursor: 'pointer',
          }}
        >
          <X size={12} style={{ marginRight: 4, verticalAlign: 'middle' }} />
          Dismiss
        </button>
      )}

      <style>{`
        @keyframes cascadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
