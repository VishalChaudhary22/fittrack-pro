import { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Ruler, X, Plus, Activity } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PageHeader, EmptyState, ModalPortal } from '../shared/SharedComponents';
import { MEASUREMENT_FIELDS } from '../../data/constants';
import { gId, tod, fmt } from '../../utils/helpers';

export default function MeasurementsPage() {
  const { user, measurements, setMeasurements, addToast } = useApp();
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({});
  const [chartField, setChartField] = useState('chest');

  const userMeasurements = useMemo(() =>
    [...measurements].filter(m => m.userId === user.id).sort((a, b) => new Date(b.date) - new Date(a.date)),
    [measurements, user.id]);

  const chartData = useMemo(() =>
    [...userMeasurements].reverse().map(m => ({
      date: fmt(m.date),
      value: m[chartField] || null,
    })).filter(d => d.value !== null),
    [userMeasurements, chartField]);

  const latest = userMeasurements[0] || {};

  const saveMeasurement = () => {
    const entry = { id: gId(), userId: user.id, date: tod(), ...form };
    setMeasurements(p => [...p, entry]);
    setForm({});
    setShowAdd(false);
    addToast('Measurements saved!', 'success');
  };

  const colors = ['#E8540D', '#FF7A3D', '#FF9A5C', '#FFB87D', '#E8540D', '#FF7A3D', '#FF9A5C', '#FFB87D'];

  return (
    <div className="pg-in">
      <PageHeader title="Body Measurements" sub="Track your physique changes"
        action={<button className="btn-p" style={{ padding: '9px 16px', fontSize: 13 }} onClick={() => setShowAdd(true)}><Plus size={14} style={{ marginRight: 4 }} /> Log Measurements</button>} />

      {/* Latest stats */}
      {userMeasurements.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(100px,1fr))', gap: 12, marginBottom: 24 }}>
          {MEASUREMENT_FIELDS.map((f, i) => (
            <div key={f.key} className="card" style={{ padding: '12px', textAlign: 'center', cursor: 'pointer', border: 'none', background: chartField === f.key ? 'var(--primary)' : 'var(--surface-container-lowest)', boxShadow: chartField === f.key ? 'var(--shadow-md)' : 'none', transition: 'all .2s var(--ease-smooth)' }} onClick={() => setChartField(f.key)}>
              <div style={{ fontSize: 10, color: chartField === f.key ? 'var(--on-primary)' : 'var(--on-surface-dim)', fontWeight: 700, textTransform: 'uppercase', marginBottom: 4 }}>{f.label}</div>
              <div className="headline-md" style={{ color: chartField === f.key ? 'var(--on-primary)' : 'var(--on-surface)' }}>{latest[f.key] || '—'}</div>
              <div style={{ fontSize: 10, color: chartField === f.key ? 'var(--on-primary)' : 'var(--on-surface-variant)', opacity: 0.8, marginTop: 2 }}>{f.unit}</div>
            </div>
          ))}
        </div>
      )}

      {/* Chart */}
      {chartData.length > 1 ? (
        <div className="card" style={{ padding: 20, marginBottom: 24, border: 'none' }}>
          <div style={{ fontSize: 11, color: 'var(--on-surface-dim)', fontWeight: 700, textTransform: 'uppercase', marginBottom: 16, letterSpacing: '.5px' }}>{MEASUREMENT_FIELDS.find(f => f.key === chartField)?.label} Over Time</div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--surface-container-lowest)" vertical={false} />
              <XAxis dataKey="date" tick={{ fill: 'var(--on-surface-dim)', fontSize: 10, fontWeight: 600 }} tickLine={false} axisLine={false} dy={10} />
              <YAxis tick={{ fill: 'var(--on-surface-dim)', fontSize: 10, fontWeight: 600 }} domain={['auto', 'auto']} tickLine={false} axisLine={false} dx={-10} />
              <Tooltip contentStyle={{ background: 'var(--surface-container-highest)', border: 'none', borderRadius: 12, boxShadow: 'var(--shadow-md)', fontSize: 12, color: 'var(--on-surface)', fontWeight: 600 }} itemStyle={{ color: 'var(--primary)' }} />
              <Line type="monotone" dataKey="value" stroke="var(--primary)" strokeWidth={3} dot={{ fill: 'var(--primary)', r: 4, strokeWidth: 3, stroke: 'var(--surface-container-low)' }} activeDot={{ r: 6, strokeWidth: 0 }} name={MEASUREMENT_FIELDS.find(f => f.key === chartField)?.label} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : userMeasurements.length === 0 ? (
        <EmptyState Icon={Ruler} title="No Measurements" message="Log your body measurements to track physique changes over time" action={() => setShowAdd(true)} actionLabel="Log First Measurement" />
      ) : (
        <div className="card" style={{ padding: 40, marginBottom: 24, border: 'none', textAlign: 'center', color: 'var(--on-surface-variant)' }}>
          <Activity size={32} color="var(--primary)" style={{ opacity: 0.8, marginBottom: 12, margin: '0 auto', filter: 'drop-shadow(var(--glow-primary))' }} />
          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--on-surface)' }}>Insufficient Data</div>
          <div style={{ fontSize: 12, marginTop: 4, maxWidth: 220, margin: '0 auto' }}>Log {MEASUREMENT_FIELDS.find(f => f.key === chartField)?.label.toLowerCase()} for at least two days to see your trend chart.</div>
          <button className="btn-g" style={{ marginTop: 20, padding: '10px 20px', fontSize: 13 }} onClick={() => setShowAdd(true)}>Log Measurement</button>
        </div>
      )}

      {/* History table */}
      {userMeasurements.length > 0 && (
        <div className="card" style={{ overflow: 'hidden', border: 'none' }}>
          <div className="tonal-break" style={{ padding: '16px 20px', background: 'var(--surface-container-highest)', fontSize: 12, color: 'var(--on-surface)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.5px' }}>History</div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ padding: '12px 20px', fontSize: 10, color: 'var(--on-surface-dim)', fontWeight: 700, textAlign: 'left', borderBottom: 'none', textTransform: 'uppercase', letterSpacing: '.5px', background: 'var(--surface-container-lowest)' }}>Date</th>
                  {MEASUREMENT_FIELDS.map(f => (
                    <th key={f.key} style={{ padding: '12px 10px', fontSize: 10, color: 'var(--on-surface-dim)', fontWeight: 700, textAlign: 'center', borderBottom: 'none', whiteSpace: 'nowrap', textTransform: 'uppercase', letterSpacing: '.5px', background: 'var(--surface-container-lowest)' }}>{f.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {userMeasurements.map(m => (
                  <tr key={m.id} className="stripe">
                    <td style={{ padding: '14px 20px', fontSize: 13, borderBottom: 'none', fontWeight: 600, color: 'var(--on-surface)' }}>{fmt(m.date)}</td>
                    {MEASUREMENT_FIELDS.map(f => (
                      <td key={f.key} style={{ padding: '14px 10px', fontSize: 13, textAlign: 'center', fontWeight: 600, borderBottom: 'none', color: m[f.key] ? 'var(--on-surface)' : 'var(--on-surface-dim)' }}>{m[f.key] || '—'}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {showAdd && (
        <ModalPortal>
        <div className="mo">
          <div className="md" style={{ maxWidth: 460 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div className="headline-lg">Log Measurements</div>
              <button className="btn-g" aria-label="Close add measurement" style={{ padding: '8px', borderRadius: 12 }} onClick={() => setShowAdd(false)}><X size={18} /></button>
            </div>
            <div style={{ fontSize: 13, color: 'var(--on-surface-variant)', marginBottom: 20 }}>Enter measurements in cm. Leave blank for any you don't want to track.</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: 16, marginBottom: 24 }}>
              {MEASUREMENT_FIELDS.map(f => (
                <div key={f.key} className="input-group">
                  <label style={{ fontSize: 11, color: 'var(--on-surface-dim)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 6, display: 'block' }}>{f.label} ({f.unit})</label>
                  <input type="number" step=".1" placeholder="—" value={form[f.key] || ''} onChange={e => setForm(p => ({ ...p, [f.key]: parseFloat(e.target.value) || '' }))} style={{ width: '100%', padding: '12px 16px', borderRadius: 12, background: 'var(--surface-container-highest)', border: 'none', color: 'var(--on-surface)', fontWeight: 600, fontSize: 15 }} />
                </div>
              ))}
            </div>
            <button className="btn-p" style={{ width: '100%', padding: '16px', fontSize: 15, borderRadius: 12 }} onClick={saveMeasurement}>Save Measurements</button>
          </div>
        </div>
        </ModalPortal>
      )}
    </div>
  );
}
