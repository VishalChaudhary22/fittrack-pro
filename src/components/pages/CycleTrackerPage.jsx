import { useState } from 'react';
import { Settings, Save, Sparkles, Calendar } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PageHeader } from '../shared/SharedComponents';
import { getCyclePhase } from '../../utils/cycleCalculations';

export default function CycleTrackerPage() {
  const { cycleConfig, setCycleConfig, addToast } = useApp();
  
  const [startDate, setStartDate] = useState(cycleConfig?.startDate || '');
  const [cycleLength, setCycleLength] = useState(cycleConfig?.cycleLength || 28);
  
  const handleSave = () => {
    setCycleConfig({ startDate, cycleLength });
    addToast('Cycle info updated', 'success');
  };

  const currentPhase = getCyclePhase(cycleConfig?.startDate, cycleConfig?.cycleLength);

  return (
    <div className="pg-in">
      <PageHeader title="Cycle Syncing" sub="Align workouts with your physiology" />

      <div className="card" style={{ padding: 24, background: 'var(--surface-container-low)', marginBottom: 24 }}>
        <h3 className="headline-md" style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <Settings size={20} color="var(--primary)" /> Settings
        </h3>
        
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginBottom: 16 }}>
           <div style={{ flex: 1, minWidth: 150 }}>
             <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--on-surface-variant)', textTransform: 'uppercase', marginBottom: 8, display: 'block' }}>Last Period Start</label>
             <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: 12, border: 'none', background: 'var(--surface-container-highest)', color: 'var(--on-surface)' }} />
           </div>
           <div style={{ flex: 1, minWidth: 150 }}>
             <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--on-surface-variant)', textTransform: 'uppercase', marginBottom: 8, display: 'block' }}>Cycle Length (Days)</label>
             <input type="number" value={cycleLength} onChange={e => setCycleLength(parseInt(e.target.value) || 28)} style={{ width: '100%', padding: '12px', borderRadius: 12, border: 'none', background: 'var(--surface-container-highest)', color: 'var(--on-surface)' }} />
           </div>
        </div>
        
        <button onClick={handleSave} style={{ padding: '12px 24px', background: 'var(--primary)', color: 'var(--on-primary)', border: 'none', borderRadius: 12, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
          <Save size={16} /> Save Cycle Info
        </button>
      </div>

      {currentPhase ? (
        <div className="card" style={{ padding: '32px 24px', background: 'var(--surface-container-low)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -50, right: -50, width: 250, height: 250, background: currentPhase.theme, filter: 'blur(100px)', opacity: 0.15, pointerEvents: 'none' }} />
          
          <div className="label-md" style={{ color: currentPhase.theme, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Calendar size={16} /> DAY {currentPhase.currentDay}
          </div>
          <h2 className="display-md" style={{ color: 'var(--on-surface)', marginBottom: 4 }}>{currentPhase.phase} Phase</h2>
          <p style={{ color: 'var(--on-surface-variant)', fontSize: 14, fontWeight: 500, marginBottom: 24 }}>Next period in ~{currentPhase.nextPeriodIn} days</p>

          <div style={{ padding: 16, borderRadius: 16, background: 'rgba(255,255,255,0.03)', border: `1px solid ${currentPhase.theme}40` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, color: currentPhase.theme, fontWeight: 700, fontSize: 12, textTransform: 'uppercase', letterSpacing: '1px' }}>
              <Sparkles size={16} /> Training Advice
            </div>
            <p style={{ color: 'var(--on-surface)', fontSize: 14, lineHeight: 1.5 }}>
              {currentPhase.advice}
            </p>
          </div>
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '48px 24px', color: 'var(--on-surface-dim)' }}>
           Enter your cycle details above to receive synced training advice.
        </div>
      )}
    </div>
  );
}
