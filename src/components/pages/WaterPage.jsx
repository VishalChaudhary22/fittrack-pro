import { useMemo } from 'react';
import { ChevronLeft, Plus, Droplets, Droplet } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { PageHeader, ProgressOrb } from '../shared/SharedComponents';
import { gId, tod } from '../../utils/helpers';

export default function WaterPage() {
  const navigate = useNavigate();
  const { user, waterLog, setWaterLog, addToast } = useApp();
  
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);
  const todayWater = useMemo(() => waterLog.filter(l => l.userId === user.id && l.date === todayStr), [waterLog, user.id, todayStr]);
  const todayTotal = useMemo(() => todayWater.reduce((acc, curr) => acc + curr.ml, 0), [todayWater]);
  const goalWater = user.waterGoal || 3000;
  
  const pct = Math.min(Math.round((todayTotal / goalWater) * 100) || 0, 100);

  const addWater = (ml) => {
    setWaterLog(p => [...p, { id: gId(), userId: user.id, date: todayStr, ml, timestamp: new Date().toISOString() }]);
    addToast(`Added ${ml}ml of water`, 'success');
  };

  return (
    <div className="pg-in">
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <button className="btn-g" style={{ padding: 8, borderRadius: '50%' }} onClick={() => navigate(-1)}>
          <ChevronLeft size={20} />
        </button>
        <PageHeader title="Hydration" sub="Track your daily water intake" style={{ marginBottom: 0 }} />
      </div>

      <div className="glass-card" style={{ padding: 32, borderRadius: 24, textAlign: 'center', marginBottom: 24, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <ProgressOrb progress={pct} size={150} label={`${todayTotal}`} subLabel={`/ ${goalWater} ml`} color="var(--primary)" />
        <p style={{ marginTop: 24, color: 'var(--on-surface-variant)', fontSize: 13 }}>
          {pct >= 100 ? "You've hit your hydration goal! Stay healthy." : "Keep drinking to reach your daily goal."}
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0,1fr))', gap: 12, width: '100%', marginTop: 24 }}>
          {[{ ml: 250, label: 'Glass' }, { ml: 500, label: 'Bottle' }, { ml: 750, label: 'Shaker' }].map(preset => (
            <button key={preset.ml} onClick={() => addWater(preset.ml)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: 16, background: 'var(--surface-container-highest)', borderRadius: 16, border: 'none', cursor: 'pointer', transition: 'transform 0.1s' }} className="active:scale-95">
              <Droplet size={24} color="var(--primary)" fill="var(--primary)" fillOpacity={0.2} />
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--on-surface)' }}>+{preset.ml}</div>
                <div style={{ fontSize: 10, color: 'var(--on-surface-variant)' }}>{preset.label}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <h3 className="headline-md" style={{ marginBottom: 16 }}>Today's Logs</h3>
      {todayWater.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 24, color: 'var(--on-surface-dim)' }}>No water logged today yet.</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
           {todayWater.slice().reverse().map(log => (
             <div key={log.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 16, background: 'var(--surface-container-low)', borderRadius: 12 }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                 <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(59, 130, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                   <Droplets size={16} color="#3b82f6" />
                 </div>
                 <span style={{ fontSize: 14, fontWeight: 600 }}>{log.ml} ml</span>
               </div>
               <span style={{ fontSize: 11, color: 'var(--on-surface-variant)' }}>
                  {new Date(log.timestamp || tod()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
               </span>
             </div>
           ))}
        </div>
      )}
    </div>
  );
}
