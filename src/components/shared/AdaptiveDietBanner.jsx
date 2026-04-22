import { useState } from 'react';
import { TrendingUp, Brain, Check, X, Info } from 'lucide-react';

const SEVERITY_COLORS = {
  S1: 'var(--danger)', // Losing too fast
  S2: 'var(--primary-container)', // Stall
  S2b: 'var(--primary-container)', // Progress too slow
  S3: 'var(--danger)', // Gaining instead of losing
  S4: 'var(--primary-container)', // Gaining too fast
  S5: 'var(--primary-container)', // Not gaining at all
  S6: '#4ADE80', // On track
  S7: 'var(--primary)', // Weight creeping up
  S8: 'var(--primary)', // Weight dropping unintentionally
  S9: '#4ADE80', // (unused but green for good)
};

export default function AdaptiveDietBanner({ suggestion, currentKcal, newKcal, newMacros, onAccept, onDismiss, onDetails, compact = false }) {
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
      <div style={{
        position: 'relative', overflow: 'hidden',
        padding: '16px 20px', borderRadius: 16,
        background: 'var(--surface-container-low)',
        borderLeft: `4px solid ${severityColor}`,
        marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12,
        animation: 'cascadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
      }}>
        {/* Radial glow accent */}
        <div style={{
          position: 'absolute', top: -40, right: -40,
          width: 120, height: 120, borderRadius: '50%',
          background: severityColor, opacity: 0.08,
          filter: 'blur(30px)', pointerEvents: 'none',
        }} />

        <div style={{
          width: 36, height: 36, borderRadius: 10,
          background: `${severityColor}15`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0
        }}>
          <Icon size={18} color={severityColor} />
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
            <span style={{ fontSize: 9, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', color: severityColor }}>
              ⚡ Adaptive Coach
            </span>
          </div>
          <div className="headline-md" style={{ fontSize: 14, color: 'var(--on-surface)' }}>
            {suggestion.message}
          </div>
          {!isPositive && suggestion.adjustKcal !== 0 && (
             <div style={{ fontSize: 12, color: 'var(--on-surface-variant)', marginTop: 2 }}>
               Suggested target: <span style={{ fontWeight: 700, color: 'var(--on-surface)' }}>{newKcal} kcal</span>
             </div>
          )}
        </div>

        {!isPositive && onDetails && (
          <button
            onClick={onDetails}
            style={{
              padding: '8px 14px', borderRadius: '20px', border: 'none',
              background: 'var(--surface-container-highest)', color: 'var(--on-surface)',
              fontWeight: 700, fontSize: 12, cursor: 'pointer', whiteSpace: 'nowrap',
              display: 'flex', alignItems: 'center', gap: 4, transition: 'background 0.2s'
            }}
          >
            Review 
          </button>
        )}
        
        <style>{`
          @keyframes cascadeIn {
            from { opacity: 0; transform: translateY(8px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>
    );
  }

  // Full variant for DietPage
  return (
    <div style={{
      position: 'relative', overflow: 'hidden',
      padding: '24px', borderRadius: 24, marginBottom: 24,
      background: 'var(--surface-container-low)',
      borderLeft: `4px solid ${severityColor}`,
      animation: 'cascadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
    }}>
      {/* Radial glow accent */}
      <div style={{
        position: 'absolute', top: -50, right: -50,
        width: 150, height: 150, borderRadius: '50%',
        background: severityColor, opacity: 0.08,
        filter: 'blur(40px)', pointerEvents: 'none',
      }} />

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, position: 'relative' }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: `${severityColor}20`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon size={16} color={severityColor} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
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
            fontSize: 10, fontWeight: 800, textTransform: 'uppercase',
            letterSpacing: '0.15em', color: severityColor,
          }}>
            ⚡ Adaptive Coach
          </span>
        </div>
      </div>

      {/* Main message */}
      <div className="headline-lg" style={{
        color: 'var(--on-surface)', fontSize: 20, marginBottom: 8,
        lineHeight: 1.2,
      }}>
        {suggestion.message}
      </div>

      {/* Reasoning */}
      <div style={{
        fontSize: 14, color: 'var(--on-surface-variant)',
        lineHeight: 1.6, marginBottom: 20, maxWidth: '90%',
      }}>
        {suggestion.reasoning}
      </div>

      {/* Proposed change chips */}
      {suggestion.adjustKcal !== 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 24 }}>
          <div style={{
            padding: '12px 18px', borderRadius: 16,
            background: 'var(--surface-container-highest)',
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <div>
               <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Current</div>
               <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--on-surface-variant)', textDecoration: 'line-through' }}>{currentKcal}</div>
            </div>
            <TrendingUp size={16} color="var(--primary)" style={{ transform: suggestion.adjustKcal > 0 ? 'rotate(-45deg)' : 'rotate(45deg)' }} />
            <div>
               <div style={{ fontSize: 10, fontWeight: 800, color: severityColor, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Suggested</div>
               <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--on-surface)' }}>{newKcal} <span style={{ fontSize: 12 }}>kcal</span></div>
            </div>
          </div>
          
          {newMacros && (
            <div style={{
              padding: '12px 18px', borderRadius: 16,
              background: 'var(--surface-container)',
              display: 'flex', flexDirection: 'column', justifyContent: 'center',
            }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>Updated Macros</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--on-surface)', display: 'flex', gap: 8 }}>
                <span style={{ color: 'var(--primary)' }}>P {newMacros.protein}g</span>
                <span style={{ color: 'var(--outline)' }}>·</span>
                <span style={{ color: 'var(--tertiary)' }}>C {newMacros.carbs}g</span>
                <span style={{ color: 'var(--outline)' }}>·</span>
                <span style={{ color: '#F59E0B' }}>F {newMacros.fat}g</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* CTAs */}
      {suggestion.adjustKcal !== 0 ? (
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <button
            onClick={handleAccept}
            disabled={loading}
            style={{
              padding: '14px 24px', borderRadius: '16px', border: 'none',
              background: 'var(--signature-gradient)',
              color: 'white', fontWeight: 800, fontSize: 14, cursor: loading ? 'default' : 'pointer',
              opacity: loading ? 0.7 : 1, transition: 'all 0.2s',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              boxShadow: '0 4px 12px rgba(248, 95, 27, 0.25)'
            }}
          >
            {loading ? (
              <span style={{
                width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)',
                borderTopColor: '#fff', borderRadius: '50%',
                animation: 'spin 0.6s linear infinite', display: 'inline-block',
              }} />
            ) : (
              <>
                <Check size={16} strokeWidth={3} /> Apply New Targets
              </>
            )}
          </button>
          <button
            onClick={handleDismiss}
            style={{
              padding: '14px 20px', borderRadius: '16px', border: 'none',
              background: 'transparent', color: 'var(--on-surface-variant)',
              fontWeight: 700, fontSize: 14, cursor: 'pointer', transition: 'color 0.2s'
            }}
          >
            Not Now
          </button>
        </div>
      ) : (
        <button
          onClick={handleDismiss}
          style={{
            padding: '10px 16px', borderRadius: '16px', border: 'none',
            background: 'var(--surface-container-highest)',
            color: 'var(--on-surface-variant)', fontWeight: 700,
            fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6
          }}
        >
          <X size={14} />
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
