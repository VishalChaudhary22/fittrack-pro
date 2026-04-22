import { useState } from 'react';
import { TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
import { classifyTDEEScenario } from '../../utils/adaptiveCalories';

export function TDEEInsightCard({ tdeeEstimate, onUpdateTargets, onLearnMore }) {
  const [dismissed, setDismissed] = useState(false);
  
  if (!tdeeEstimate || dismissed) return null;
  
  let tdeeScenario;
  try {
    tdeeScenario = classifyTDEEScenario(tdeeEstimate);
  } catch (e) {
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
  const accentColor = isWarning ? 'var(--warning, #F59E0B)' : 'var(--primary)';

  return (
    <div style={{
      background: 'var(--surface-container-low)',
      borderRadius: 16,
      padding: 16,
      marginBottom: 16,
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Dismiss */}
      <button 
        onClick={handleDismiss} 
        style={{ position: 'absolute', top: 10, right: 10, background: 'none', border: 'none', fontSize: 16, color: 'var(--on-surface-dim)', cursor: 'pointer', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 8 }}
        aria-label="Dismiss"
      >&times;</button>

      <div style={{ display: 'flex', gap: 12 }}>
        <div style={{ 
          width: 38, height: 38, borderRadius: 12, flexShrink: 0,
          background: isWarning ? 'rgba(245,158,11,0.1)' : 'rgba(248,95,27,0.1)', 
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {isWarning ? <AlertTriangle size={18} color={accentColor} /> : adjustKcal > 0 ? <TrendingUp size={18} color={accentColor} /> : <TrendingDown size={18} color={accentColor} />}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h4 style={{ margin: '0 0 4px 0', fontSize: 14, fontWeight: 700, color: 'var(--on-surface)', paddingRight: 20, fontFamily: "'Space Grotesk', sans-serif" }}>
            {message}
          </h4>
          <p style={{ margin: 0, fontSize: 12, color: 'var(--on-surface-variant)', lineHeight: 1.5, fontFamily: "'Be Vietnam Pro', sans-serif" }}>
            {reasoning}
          </p>

          {/* Comparison strip */}
          <div style={{
             marginTop: 12, display: 'flex', gap: 8, alignItems: 'center', 
             background: 'var(--surface-container-lowest)',
             padding: '10px 12px', borderRadius: 12,
          }}>
            <div style={{ flex: 1 }}>
               <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--on-surface-dim)', marginBottom: 2 }}>Calculated</div>
               <div style={{ fontSize: 15, fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif", color: 'var(--on-surface)' }}>{tdeeEstimate.staticTDEE}</div>
            </div>
            <div style={{ width: 1, height: 28, background: 'var(--surface-container-high)' }} />
            <div style={{ flex: 1, textAlign: 'right' }}>
               <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: accentColor, marginBottom: 2 }}>Adaptive ({tdeeEstimate.confidence})</div>
               <div style={{ fontSize: 15, fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif", color: 'var(--on-surface)' }}>{tdeeEstimate.estimatedTDEE}</div>
            </div>
          </div>

          {/* Actions */}
          <div style={{ marginTop: 14, display: 'flex', gap: 8 }}>
             <button className="btn-p" onClick={onUpdateTargets} style={{ flex: 1, padding: '10px 16px', fontSize: 12 }}>
               Update targets
             </button>
             <button className="btn-g" onClick={onLearnMore} style={{ padding: '10px 16px', fontSize: 12 }}>
               Details
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}
