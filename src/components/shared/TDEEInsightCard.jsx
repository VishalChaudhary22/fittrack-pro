import { useState } from 'react';
import { TrendingUp, TrendingDown, Info, HelpCircle } from 'lucide-react';
import { classifyTDEEScenario } from '../../utils/adaptiveCalories';

export function TDEEInsightCard({ tdeeEstimate, onUpdateTargets, onLearnMore }) {
  const [dismissed, setDismissed] = useState(false);
  
  if (!tdeeEstimate || dismissed) return null;
  const tdeeScenario = classifyTDEEScenario(tdeeEstimate);
  if (!tdeeScenario) return null;

  const handleDismiss = () => {
    // 7-day dismiss
    const userId = localStorage.getItem('fittrack_last_user_id');
    if (userId) {
      localStorage.setItem(`fittrack_tdee_insight_dismissed_at_${userId}`, new Date().toISOString());
    }
    setDismissed(true);
  };

  // Check if previously dismissed
  const userId = localStorage.getItem('fittrack_last_user_id');
  if (userId) {
    const raw = localStorage.getItem(`fittrack_tdee_insight_dismissed_at_${userId}`);
    if (raw && (new Date() - new Date(raw)) / 86400000 < 7) {
      return null; // Suppress
    }
  }

  const { severity, message, reasoning, adjustKcal } = tdeeScenario;

  const colors = {
    info: 'var(--primary)',
    warning: 'var(--warning, #F59E0B)',
  };
  const color = colors[severity] || '#fff';

  return (
    <div style={{
      background: 'var(--surface-light)',
      borderRadius: 16,
      padding: 16,
      border: '1px solid var(--border)',
      marginBottom: 16,
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{ position: 'absolute', top: 12, right: 12, cursor: 'pointer' }} onClick={handleDismiss}>
        <span style={{ fontSize: 18, color: 'var(--on-surface-variant)' }}>&times;</span>
      </div>

      <div style={{ display: 'flex', gap: 12 }}>
        <div style={{ 
          width: 40, height: 40, borderRadius: '50%', 
          background: `rgba(${severity === 'warning' ? '245,158,11' : '36,210,137'}, 0.1)`, 
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 
        }}>
          {severity === 'warning' ? <Info size={20} color={color} /> : adjustKcal > 0 ? <TrendingUp size={20} color={color} /> : <TrendingDown size={20} color={color} />}
        </div>
        <div>
          <h4 style={{ margin: '0 0 4px 0', fontSize: 15, fontWeight: 600, color: 'var(--on-surface)', paddingRight: 16 }}>
            {message}
          </h4>
          <p style={{ margin: 0, fontSize: 13, color: 'var(--on-surface-variant)', lineHeight: 1.4 }}>
            {reasoning}
          </p>

          <div style={{
             marginTop: 12, display: 'flex', gap: 8, alignItems: 'center', background: 'var(--surface)',
             padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border)'
          }}>
            <div style={{ flex: 1 }}>
               <div style={{ fontSize: 11, color: 'var(--on-surface-variant)' }}>Calculated</div>
               <div style={{ fontSize: 14, fontWeight: 600 }}>{tdeeEstimate.staticTDEE} kcal</div>
            </div>
            <div style={{ fontSize: 14, color: 'var(--on-surface-variant)' }}>vs</div>
            <div style={{ flex: 1, textAlign: 'right' }}>
               <div style={{ fontSize: 11, color: color, fontWeight: 600 }}>Estimated Data ({tdeeEstimate.confidence})</div>
               <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--on-surface)' }}>{tdeeEstimate.estimatedTDEE} kcal</div>
            </div>
          </div>

          <div style={{ marginTop: 16, display: 'flex', gap: 10 }}>
             <button 
               onClick={onUpdateTargets}
               style={{
                 flex: 1,
                 background: color,
                 color: '#000',
                 border: 'none',
                 padding: '8px 16px',
                 borderRadius: 100,
                 fontSize: 13,
                 fontWeight: 600,
                 cursor: 'pointer'
               }}
             >
               Update my targets
             </button>
             <button 
               onClick={onLearnMore}
               style={{
                 background: 'transparent',
                 color: 'var(--on-surface)',
                 border: '1px solid var(--border)',
                 padding: '8px 16px',
                 borderRadius: 100,
                 fontSize: 13,
                 fontWeight: 600,
                 cursor: 'pointer',
                 display: 'flex',
                 alignItems: 'center',
                 gap: 4
               }}
             >
               <HelpCircle size={14} /> Learn more
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}
