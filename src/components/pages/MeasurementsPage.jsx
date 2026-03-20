import { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Ruler, X, Plus } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PageHeader, EmptyState } from '../shared/SharedComponents';
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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(100px,1fr))', gap: 8, marginBottom: 14 }}>
          {MEASUREMENT_FIELDS.map((f, i) => (
            <div key={f.key} className="card" style={{ padding: '10px 12px', textAlign: 'center', cursor: 'pointer', border: chartField === f.key ? '1px solid var(--o)' : '1px solid var(--bd)' }} onClick={() => setChartField(f.key)}>
              <div style={{ fontSize: 9, color: 'var(--t3)', fontWeight: 700, textTransform: 'uppercase', marginBottom: 2 }}>{f.label}</div>
              <div className="bb" style={{ fontSize: 20, color: chartField === f.key ? 'var(--o)' : 'var(--tx)' }}>{latest[f.key] || '—'}</div>
              <div style={{ fontSize: 9, color: 'var(--t3)' }}>{f.unit}</div>
            </div>
          ))}
        </div>
      )}

      {/* Chart */}
      {chartData.length > 1 ? (
        <div className="card" style={{ padding: 18, marginBottom: 14 }}>
          <div style={{ fontSize: 11, color: 'var(--t3)', fontWeight: 700, textTransform: 'uppercase', marginBottom: 10 }}>{MEASUREMENT_FIELDS.find(f => f.key === chartField)?.label} Over Time</div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--bd)" />
              <XAxis dataKey="date" tick={{ fill: 'var(--t3)', fontSize: 9 }} />
              <YAxis tick={{ fill: 'var(--t3)', fontSize: 9 }} domain={['auto', 'auto']} />
              <Tooltip contentStyle={{ background: 'var(--c2)', border: '1px solid var(--bd)', borderRadius: 8, fontSize: 11 }} />
              <Line type="monotone" dataKey="value" stroke="#E8540D" strokeWidth={2} dot={{ fill: '#E8540D', r: 4, strokeWidth: 0 }} name={MEASUREMENT_FIELDS.find(f => f.key === chartField)?.label} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : userMeasurements.length === 0 ? (
        <EmptyState Icon={Ruler} title="No Measurements" message="Log your body measurements to track physique changes over time" action={() => setShowAdd(true)} actionLabel="Log First Measurement" />
      ) : null}

      {/* History table */}
      {userMeasurements.length > 0 && (
        <div className="card" style={{ overflow: 'hidden' }}>
          <div style={{ padding: '10px 16px', borderBottom: '1px solid var(--bd)', background: 'var(--c2)', fontSize: 11, color: 'var(--t3)', fontWeight: 700, textTransform: 'uppercase' }}>History</div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ padding: '8px 12px', fontSize: 10, color: 'var(--t3)', fontWeight: 700, textAlign: 'left', borderBottom: '1px solid var(--bd)' }}>Date</th>
                  {MEASUREMENT_FIELDS.map(f => (
                    <th key={f.key} style={{ padding: '8px 6px', fontSize: 10, color: 'var(--t3)', fontWeight: 700, textAlign: 'center', borderBottom: '1px solid var(--bd)', whiteSpace: 'nowrap' }}>{f.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {userMeasurements.map(m => (
                  <tr key={m.id} className="row-sep">
                    <td style={{ padding: '8px 12px', fontSize: 12, borderBottom: '1px solid var(--bd)' }}>{fmt(m.date)}</td>
                    {MEASUREMENT_FIELDS.map(f => (
                      <td key={f.key} style={{ padding: '8px 6px', fontSize: 12, textAlign: 'center', borderBottom: '1px solid var(--bd)', color: m[f.key] ? 'var(--tx)' : 'var(--t3)' }}>{m[f.key] || '—'}</td>
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
        <div className="mo">
          <div className="md" style={{ maxWidth: 420 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div className="bb" style={{ fontSize: 22 }}>Log Measurements</div>
              <button className="btn-g" style={{ padding: '5px 9px' }} onClick={() => setShowAdd(false)}><X size={14} /></button>
            </div>
            <div style={{ fontSize: 11, color: 'var(--t2)', marginBottom: 14 }}>Enter measurements in cm. Leave blank for any you don't want to track.</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
              {MEASUREMENT_FIELDS.map(f => (
                <div key={f.key}>
                  <label>{f.label} ({f.unit})</label>
                  <input type="number" step=".1" placeholder="—" value={form[f.key] || ''} onChange={e => setForm(p => ({ ...p, [f.key]: parseFloat(e.target.value) || '' }))} />
                </div>
              ))}
            </div>
            <button className="btn-p" style={{ width: '100%', padding: '13px' }} onClick={saveMeasurement}>Save Measurements</button>
          </div>
        </div>
      )}
    </div>
  );
}
