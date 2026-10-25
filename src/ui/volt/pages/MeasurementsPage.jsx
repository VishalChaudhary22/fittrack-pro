import { X, Plus } from 'lucide-react';
import { useMeasurements } from '../../../core/hooks/useMeasurements';
import { MEASUREMENT_FIELDS } from '../../../data/constants';
import { fmt } from '../../../utils/helpers';
import { VoltBlock, VoltPill, VoltLabel } from '../primitives';

// ─── Kaaya Volt · Body Measurements (V-6b) ──────────────────────────────────
// Same logic core as V1 (useMeasurements), Volt presentation. The Recharts
// line becomes a hand-rolled SVG trend on the shared .v-draw draw-on.

const inputStyle = {
  width: '100%', padding: '12px 14px', borderRadius: 12, fontSize: 15,
  background: 'var(--v-canvas)', color: 'var(--v-ink)',
  border: '2px solid var(--v-edge-quiet)', outline: 'none', fontFamily: 'inherit', fontWeight: 600,
};
const labelStyle = {
  display: 'block', fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5,
  letterSpacing: '0.14em', color: 'var(--v-dim)', marginBottom: 6, textTransform: 'uppercase',
};

function TrendChart({ data }) {
  const W = 640, H = 190, PADX = 14, PADT = 16, PADB = 26;
  const vals = data.map(d => d.value);
  const min = Math.min(...vals), max = Math.max(...vals);
  const span = max - min || 1;
  const x = (i) => PADX + (i * (W - PADX * 2)) / Math.max(1, data.length - 1);
  const y = (v) => PADT + (1 - (v - min) / span) * (H - PADT - PADB);
  const pts = data.map((d, i) => `${x(i)},${y(d.value)}`).join(' ');
  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto', display: 'block' }} role="img" aria-label="Measurement trend">
        {[0.25, 0.55, 0.85].map(f => (
          <line key={f} x1={PADX} x2={W - PADX} y1={H * f} y2={H * f} stroke="var(--v-edge-quiet)" strokeWidth="1" strokeDasharray="3 5" opacity="0.5" />
        ))}
        <polyline points={pts} fill="none" stroke="var(--v-cobalt)" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" pathLength={1} className="v-draw" />
        {data.map((d, i) => (
          <g key={i}>
            <circle cx={x(i)} cy={y(d.value)} r="4.5" fill="var(--v-panel)" stroke="var(--v-cobalt)" strokeWidth="2.5" />
            <text x={x(i)} y={H - 6} textAnchor="middle" fontSize="10.5" fill="var(--v-dim)" fontFamily="'JetBrains Mono', monospace">{d.date}</text>
          </g>
        ))}
      </svg>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
        <span style={{ fontSize: 11.5, color: 'var(--v-dim)' }}>Min <strong style={{ color: 'var(--v-ink)' }}>{min}</strong></span>
        <span style={{ fontSize: 11.5, color: 'var(--v-dim)' }}>Latest <strong style={{ color: 'var(--v-volt-text)' }}>{vals[vals.length - 1]}</strong></span>
        <span style={{ fontSize: 11.5, color: 'var(--v-dim)' }}>Max <strong style={{ color: 'var(--v-ink)' }}>{max}</strong></span>
      </div>
    </div>
  );
}

export default function VoltMeasurementsPage() {
  const {
    chartData, chartField, form, latest, saveMeasurement, setChartField,
    setForm, setShowAdd, showAdd, userMeasurements,
  } = useMeasurements();

  const activeField = MEASUREMENT_FIELDS.find(f => f.key === chartField);

  return (
    <div className="v-screen" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <header className="v-rise" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 12 }}>
        <div>
          <VoltLabel volt>Body Measurements — track physique changes</VoltLabel>
          <h1 className="v-num" style={{ fontSize: 'clamp(1.9rem, 7vw, 2.8rem)', lineHeight: 1, margin: '8px 0 0', textTransform: 'uppercase' }}>Measurements</h1>
        </div>
        <VoltPill onClick={() => setShowAdd(true)} style={{ minHeight: 48, padding: '0 20px', fontSize: 14, flexShrink: 0 }}><Plus size={15} /> Log</VoltPill>
      </header>

      {userMeasurements.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(96px, 1fr))', gap: 10 }}>
          {MEASUREMENT_FIELDS.map(f => {
            const active = chartField === f.key;
            return (
              <button
                key={f.key}
                type="button"
                className="v-press"
                onClick={() => setChartField(f.key)}
                style={{
                  padding: '12px 8px', textAlign: 'center', cursor: 'pointer', borderRadius: 16,
                  background: active ? 'var(--v-volt)' : 'var(--v-panel)',
                  border: '2.5px solid var(--v-edge)',
                  boxShadow: active ? '4px 4px 0 var(--v-shadow-hero)' : '4px 4px 0 var(--v-shadow)',
                  color: active ? '#141416' : 'var(--v-ink)',
                }}
              >
                <span style={{ display: 'block', fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: active ? '#141416' : 'var(--v-dim)', marginBottom: 4 }}>{f.label}</span>
                <span className="v-num" style={{ display: 'block', fontSize: 19 }}>{latest[f.key] || '—'}</span>
                <span style={{ display: 'block', fontSize: 10, color: active ? '#141416' : 'var(--v-dim)', marginTop: 2 }}>{f.unit}</span>
              </button>
            );
          })}
        </div>
      )}

      {chartData.length > 1 ? (
        <VoltBlock>
          <VoltLabel volt>{activeField?.label} over time</VoltLabel>
          <div style={{ marginTop: 14 }}>
            <TrendChart data={chartData} />
          </div>
        </VoltBlock>
      ) : userMeasurements.length === 0 ? (
        <VoltBlock>
          <p style={{ textAlign: 'center', color: 'var(--v-dim)', fontSize: 14, padding: '16px 0', lineHeight: 1.6 }}>
            <strong style={{ color: 'var(--v-ink)', display: 'block', fontSize: 16, marginBottom: 4 }}>No Measurements</strong>
            Log your body measurements to track physique changes over time
          </p>
          <VoltPill onClick={() => setShowAdd(true)} style={{ width: '100%' }}>Log First Measurement</VoltPill>
        </VoltBlock>
      ) : (
        <VoltBlock>
          <p style={{ textAlign: 'center', color: 'var(--v-dim)', fontSize: 13.5, padding: '10px 0 14px', lineHeight: 1.6 }}>
            <strong style={{ color: 'var(--v-ink)', display: 'block', fontSize: 15, marginBottom: 4 }}>Insufficient Data</strong>
            Log {activeField?.label.toLowerCase()} for at least two days to see your trend chart.
          </p>
          <VoltPill ghost onClick={() => setShowAdd(true)} style={{ width: '100%' }}>Log Measurement</VoltPill>
        </VoltBlock>
      )}

      {userMeasurements.length > 0 && (
        <VoltBlock style={{ padding: '6px 18px' }}>
          <VoltLabel style={{ padding: '12px 0 4px' }}>History</VoltLabel>
          {userMeasurements.map((m, i) => (
            <div key={m.id} style={{ padding: '13px 0', borderBottom: i < userMeasurements.length - 1 ? '1.5px solid var(--v-edge-quiet)' : 'none' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--v-ink)', marginBottom: 7 }}>{fmt(m.date)}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 16px' }}>
                {MEASUREMENT_FIELDS.filter(f => m[f.key]).map(f => (
                  <span key={f.key} style={{ fontSize: 12.5, color: 'var(--v-dim)' }}>
                    {f.label} <strong style={{ color: 'var(--v-ink)' }}>{m[f.key]}</strong>
                  </span>
                ))}
              </div>
            </div>
          ))}
        </VoltBlock>
      )}

      {showAdd && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 80, background: 'rgba(6,8,6,0.55)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }} onClick={() => setShowAdd(false)}>
          <div className="v-sheet-up" onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: 480, background: 'var(--v-panel)', border: '2.5px solid var(--v-edge)', borderBottom: 'none', borderRadius: '22px 22px 0 0', padding: '20px 20px 30px', maxHeight: '88vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span className="v-num" style={{ fontSize: 19, textTransform: 'uppercase' }}>Log Measurements</span>
              <button type="button" className="v-press" aria-label="Close" onClick={() => setShowAdd(false)} style={{ width: 40, height: 40, borderRadius: 12, border: '2px solid var(--v-edge-quiet)', background: 'var(--v-canvas)', color: 'var(--v-ink)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={16} /></button>
            </div>
            <p style={{ fontSize: 13, color: 'var(--v-dim)', marginBottom: 18, lineHeight: 1.55 }}>Enter measurements in cm. Leave blank for any you don't want to track.</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 20 }}>
              {MEASUREMENT_FIELDS.map(f => (
                <div key={f.key}>
                  <label style={labelStyle}>{f.label} ({f.unit})</label>
                  <input type="number" step=".1" placeholder="—" value={form[f.key] || ''} onChange={e => setForm(p => ({ ...p, [f.key]: parseFloat(e.target.value) || '' }))} style={inputStyle} />
                </div>
              ))}
            </div>
            <VoltPill onClick={saveMeasurement} style={{ width: '100%' }}>Save Measurements</VoltPill>
          </div>
        </div>
      )}
    </div>
  );
}
