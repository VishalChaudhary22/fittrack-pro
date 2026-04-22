import { X, Activity } from 'lucide-react';
import { ResponsiveDialog } from './ResponsiveDialog';

export function TDEEDetailSheet({ isOpen, onClose, tdeeEstimate }) {
  if (!tdeeEstimate) return null;

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
    <ResponsiveDialog isOpen={isOpen} onClose={onClose} title="Adaptive TDEE Details">
      <div style={{ padding: 16 }}>
        <p style={{ color: 'var(--on-surface-variant)', fontSize: 14, margin: '0 0 24px 0', lineHeight: 1.5 }}>
          Your estimated Total Daily Energy Expenditure (TDEE) is reverse-engineered from your logged intake and weight changes over the past {windowDays} days.
        </p>

        <div style={{ background: 'var(--surface-light)', borderRadius: 16, padding: 16, marginBottom: 24, border: '1px solid var(--border)' }}>
           <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
             <span style={{ fontSize: 14, color: 'var(--on-surface)' }}>Confidence Score</span>
             <span style={{ 
               background: `rgba(${confidence === 'high' ? '36,210,137' : confidence === 'medium' ? '245,158,11' : '239,68,68'}, 0.1)`, 
               color: color, 
               padding: '4px 8px', borderRadius: 6, fontSize: 13, fontWeight: 600, textTransform: 'capitalize' 
             }}>
               {confidence}
             </span>
           </div>
           
           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 16 }}>
             <div>
               <div style={{ fontSize: 12, color: 'var(--on-surface-variant)' }}>Food Logged</div>
               <div style={{ fontSize: 15, fontWeight: 600 }}>{loggedDays}/{windowDays} days</div>
             </div>
             <div>
               <div style={{ fontSize: 12, color: 'var(--on-surface-variant)' }}>Weight Logged</div>
               <div style={{ fontSize: 15, fontWeight: 600 }}>{weightEntries} entries</div>
             </div>
           </div>
        </div>

        <h3 style={{ fontSize: 16, fontWeight: 600, margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Activity size={18} /> The Math
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
           <MathRow label="Average Daily Intake" value={`${avgDailyIntake} kcal`} />
           <MathRow label={`${windowDays}-Day Weight Delta`} value={`${weightDelta > 0 ? '+' : ''}${weightDelta} kg`} />
           <MathRow label="Implied Deficit/Surplus" value={`${Math.round(-weightDelta * 7700 / windowDays)} kcal`} />
           
           <div style={{ height: 1, background: 'var(--border)', margin: '4px 0' }} />
           
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 15, fontWeight: 600 }}>Adaptive TDEE</span>
              <span style={{ fontSize: 18, fontWeight: 700, color: 'var(--primary)' }}>{estimatedTDEE} kcal</span>
           </div>
        </div>

        <div style={{ marginTop: 24, fontSize: 13, color: 'var(--on-surface-variant)', lineHeight: 1.5, background: 'var(--surface)', padding: 12, borderRadius: 8 }}>
           <strong>Note:</strong> Your static calculated TDEE is {staticTDEE} kcal (difference of {delta > 0 ? '+' : ''}{delta} kcal). The adaptive engine overrides the static calculation by learning your actual metabolism.
        </div>

      </div>
    </ResponsiveDialog>
  );
}

function MathRow({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ color: 'var(--on-surface-variant)', fontSize: 14 }}>{label}</span>
      <span style={{ color: 'var(--on-surface)', fontSize: 15, fontWeight: 500 }}>{value}</span>
    </div>
  );
}
