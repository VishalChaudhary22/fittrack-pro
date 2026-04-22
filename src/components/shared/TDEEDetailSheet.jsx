import { X, Activity } from 'lucide-react';
import { ModalPortal } from './SharedComponents';

export function TDEEDetailSheet({ isOpen, onClose, tdeeEstimate }) {
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
    high: 'var(--success, #24D289)',
    medium: 'var(--warning, #F59E0B)',
    low: 'var(--error, #EF4444)',
    insufficient: 'var(--on-surface-variant)'
  };
  const color = confidenceColors[confidence] || confidenceColors.insufficient;

  return (
    <ModalPortal>
      <div className="mo" onClick={onClose} style={{ zIndex: 9999 }}>
        <div className="md" onClick={e => e.stopPropagation()} style={{ padding: 0, maxWidth: 400, width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 20px 16px', borderBottom: '1px solid var(--surface-container-highest)' }}>
             <h2 className="headline-md" style={{ margin: 0, fontSize: 18, color: 'var(--on-surface)' }}>Adaptive TDEE Details</h2>
             <button onClick={onClose} style={{ background: 'var(--surface-container-highest)', border: 'none', width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--on-surface)' }}><X size={18} /></button>
          </div>
          <div style={{ padding: 20 }}>
            <p style={{ color: 'var(--on-surface-variant)', fontSize: 13, margin: '0 0 24px 0', lineHeight: 1.5 }}>
              Your estimated Total Daily Energy Expenditure (TDEE) is reverse-engineered from your logged intake and weight changes over the past {windowDays} days.
            </p>

            <div style={{ background: 'var(--surface-container-low)', borderRadius: 16, padding: 16, marginBottom: 24 }}>
               <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                 <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--on-surface)' }}>Confidence Score</span>
                 <span style={{ 
                   background: `rgba(${confidence === 'high' ? '36,210,137' : confidence === 'medium' ? '245,158,11' : '239,68,68'}, 0.1)`, 
                   color: color, 
                   padding: '4px 10px', borderRadius: 8, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' 
                 }}>
                   {confidence}
                 </span>
               </div>
               
               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                 <div style={{ background: 'var(--surface-container-highest)', padding: 12, borderRadius: 12 }}>
                   <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--on-surface-dim)', marginBottom: 2 }}>Food Logged</div>
                   <div className="display-sm" style={{ fontSize: 18, color: 'var(--on-surface)' }}>{loggedDays}<span style={{ fontSize: 11, color: 'var(--on-surface-variant)' }}>/{windowDays}d</span></div>
                 </div>
                 <div style={{ background: 'var(--surface-container-highest)', padding: 12, borderRadius: 12 }}>
                   <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--on-surface-dim)', marginBottom: 2 }}>Weights</div>
                   <div className="display-sm" style={{ fontSize: 18, color: 'var(--on-surface)' }}>{weightEntries}<span style={{ fontSize: 11, color: 'var(--on-surface-variant)' }}> logs</span></div>
                 </div>
               </div>
            </div>

            <h3 style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', color: 'var(--on-surface-variant)', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Activity size={16} /> The Math
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
               <MathRow label="Average Daily Intake" value={`${avgDailyIntake} kcal`} />
               <MathRow label={`${windowDays}-Day Weight Delta`} value={`${weightDelta > 0 ? '+' : ''}${weightDelta} kg`} />
               <MathRow label="Implied Deficit/Surplus" value={`${Math.round(-weightDelta * 7700 / windowDays)} kcal`} />
               
               <div style={{ height: 1, background: 'var(--surface-container-highest)', margin: '4px 0' }} />
               
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--on-surface)' }}>Adaptive TDEE</span>
                  <span style={{ fontSize: 20, fontWeight: 800, color: 'var(--primary)' }}>{estimatedTDEE}</span>
               </div>
            </div>

            <div style={{ marginTop: 24, fontSize: 12, color: 'var(--on-surface-variant)', lineHeight: 1.5, background: 'var(--surface-container-lowest)', padding: 14, borderRadius: 12 }}>
               <strong style={{ color: 'var(--on-surface)' }}>Note:</strong> Your static calculated TDEE is {staticTDEE} kcal. The adaptive engine suggests a {Math.abs(delta)} kcal {delta > 0 ? 'increase' : 'decrease'} based on your actual metabolism.
            </div>
            
            <button className="btn-g" style={{ width: '100%', marginTop: 24 }} onClick={onClose}>Close Details</button>

          </div>
        </div>
      </div>
    </ModalPortal>
  );
}

function MathRow({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ color: 'var(--on-surface-dim)', fontSize: 13, fontWeight: 600 }}>{label}</span>
      <span style={{ color: 'var(--on-surface)', fontSize: 14, fontWeight: 700, fontFamily: 'monospace' }}>{value}</span>
    </div>
  );
}
