import { useId } from 'react';
import { Portal } from '../../v1/shared/SharedComponents';
import { useMeasurements } from '../../../core/hooks/useMeasurements';
import { MEASUREMENT_FIELDS } from '../../../data/constants';
import { fmt } from '../../../utils/helpers';
import { QuestBlock, QuestBtn, QuestLabel } from '../primitives';
import PixelSprite from '../PixelSprite';

// ─── Kaaya Quest · Measurements — the stat sheet (plan §7.5, Q-7) ───────────
// Same brain as V1/Volt (useMeasurements), Quest presentation: tape values
// as character-stat tiles (tap to chart), the trend as the stepped
// square-point line, history as a ledger, logging in a Quest sheet.

// Stepped square-point trend — the Progress chart language, sky tone.
function StepTrend({ data }) {
  const gid = useId().replace(/:/g, '');
  const W = 560, H = 170, PAD = 12;
  const vals = data.map(d => d.value);
  const rawMin = Math.min(...vals);
  const rawMax = Math.max(...vals);
  const rawRange = (rawMax - rawMin) || 1;
  // Padded domain + five-value axis rail, no gridlines (Progress chart rules).
  const min = rawMin - rawRange * 0.12;
  const max = rawMax + rawRange * 0.12;
  const range = max - min;
  const pts = data.map((d, i) => [
    PAD + (i / Math.max(data.length - 1, 1)) * (W - PAD * 2),
    H - PAD - ((d.value - min) / range) * (H - PAD * 2),
  ]);
  let path = `M${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`;
  for (let i = 1; i < pts.length; i++) {
    path += ` H${pts[i][0].toFixed(1)} V${pts[i][1].toFixed(1)}`;
  }
  const area = `${path} L${pts[pts.length - 1][0].toFixed(1)},${H - PAD} L${pts[0][0].toFixed(1)},${H - PAD} Z`;
  const fmt = (v) => Math.round(v * 10) / 10;
  const ticks = [4, 3, 2, 1, 0].map(i => min + (range * i) / 4); // high → low
  const lastPt = pts[pts.length - 1];
  return (
    <div>
      <div style={{ display: 'flex', gap: 7 }}>
        <div style={{ width: 38, flexShrink: 0, height: 150, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', textAlign: 'right', paddingTop: 2, paddingBottom: 2 }}>
          {ticks.map((t, i) => (
            <span key={i} className="q-meta" style={{ fontSize: 16 }}>{fmt(t)}</span>
          ))}
        </div>
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ flex: 1, width: '100%', height: 150, display: 'block' }} role="img" aria-label="Measurement trend">
          <defs>
            <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--q-sky)" stopOpacity="0.32" />
              <stop offset="100%" stopColor="var(--q-sky)" stopOpacity="0.02" />
            </linearGradient>
          </defs>
          <path d={area} fill={`url(#${gid})`} stroke="none" />
          <path d={path} fill="none" stroke="var(--q-sky)" strokeWidth="3.5" shapeRendering="crispEdges" vectorEffect="non-scaling-stroke" />
          {pts.map((p, i) => (
            <rect key={i} x={p[0] - 4} y={p[1] - 4} width="8" height="8" fill="var(--q-sky)" stroke="var(--q-border)" strokeWidth="1.5" shapeRendering="crispEdges" vectorEffect="non-scaling-stroke" />
          ))}
          <rect x={lastPt[0] - 6} y={lastPt[1] - 6} width="12" height="12" fill="var(--q-sky)" stroke="var(--q-ink)" strokeWidth="2" shapeRendering="crispEdges" vectorEffect="non-scaling-stroke" />
        </svg>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 7, marginLeft: 45 }}>
        <span className="q-meta">MIN {rawMin}</span>
        <span className="q-meta">LATEST {vals[vals.length - 1]}</span>
        <span className="q-meta">MAX {rawMax}</span>
      </div>
    </div>
  );
}

export default function MeasurementsPage() {
  const {
    chartData, chartField, form, latest, saveMeasurement, setChartField,
    setForm, setShowAdd, showAdd, userMeasurements,
  } = useMeasurements();

  const activeField = MEASUREMENT_FIELDS.find(f => f.key === chartField);

  return (
    <div className="q-screen" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 12 }}>
        <div>
          <QuestLabel tone="volt">Body Measurements — Track Physique Changes</QuestLabel>
          <h1 className="q-ps" style={{ fontSize: 'clamp(19px, 6vw, 30px)', lineHeight: 1.35, margin: '10px 0 0' }}>STAT SHEET</h1>
        </div>
        <QuestBtn onClick={() => setShowAdd(true)} style={{ flexShrink: 0 }}>+ LOG</QuestBtn>
      </header>

      {userMeasurements.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(96px, 1fr))', gap: 10 }}>
          {MEASUREMENT_FIELDS.map(f => {
            const active = chartField === f.key;
            return (
              <button
                key={f.key}
                type="button"
                onClick={() => setChartField(f.key)}
                className="q-block"
                aria-pressed={active}
                style={{
                  padding: '11px 8px', textAlign: 'center', cursor: 'pointer',
                  background: active ? 'var(--q-volt)' : 'var(--q-panel)',
                  color: active ? 'var(--q-btn-fg)' : 'var(--q-ink)',
                }}
              >
                <span className="q-label" style={{ display: 'block', color: active ? 'var(--q-btn-fg)' : 'var(--q-dim)', marginBottom: 4 }}>{f.label}</span>
                <span style={{ display: 'block', fontSize: 23 }}>{latest[f.key] || '—'}</span>
                <span style={{ display: 'block', fontSize: 14, color: active ? 'var(--q-btn-fg)' : 'var(--q-dim)', marginTop: 1 }}>{f.unit}</span>
              </button>
            );
          })}
        </div>
      )}

      {chartData.length > 1 ? (
        <QuestBlock>
          <QuestLabel tone="volt">{activeField?.label} over time</QuestLabel>
          <div style={{ marginTop: 13 }}>
            <StepTrend data={chartData} />
          </div>
        </QuestBlock>
      ) : userMeasurements.length === 0 ? (
        <QuestBlock>
          <div style={{ textAlign: 'center', padding: '18px 0' }}>
            <PixelSprite name="ruler" size={34} style={{ marginBottom: 12, opacity: 0.8 }} />
            <div className="q-ps" style={{ fontSize: 13 }}>NO MEASUREMENTS</div>
            <p style={{ color: 'var(--q-dim)', fontSize: 19, marginTop: 8, lineHeight: 1.5 }}>Log your body measurements to track physique changes over time</p>
          </div>
          <QuestBtn onClick={() => setShowAdd(true)} style={{ width: '100%' }}>LOG FIRST MEASUREMENT</QuestBtn>
        </QuestBlock>
      ) : (
        <QuestBlock>
          <div style={{ textAlign: 'center', padding: '12px 0 14px' }}>
            <div className="q-ps" style={{ fontSize: 12 }}>INSUFFICIENT DATA</div>
            <p style={{ color: 'var(--q-dim)', fontSize: 18, marginTop: 8, lineHeight: 1.5 }}>
              Log {activeField?.label.toLowerCase()} for at least two days to see your trend chart.
            </p>
          </div>
          <QuestBtn tone="ghost" onClick={() => setShowAdd(true)} style={{ width: '100%' }}>LOG MEASUREMENT</QuestBtn>
        </QuestBlock>
      )}

      {userMeasurements.length > 0 && (
        <QuestBlock style={{ padding: '4px 16px' }}>
          <QuestLabel tone="volt" style={{ padding: '12px 0 4px' }}>History</QuestLabel>
          {userMeasurements.map((m, i) => (
            <div key={m.id} style={{ padding: '12px 0', borderBottom: i < userMeasurements.length - 1 ? '2px solid var(--q-panel2)' : 'none' }}>
              <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>{fmt(m.date)}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px 15px' }}>
                {MEASUREMENT_FIELDS.filter(f => m[f.key]).map(f => (
                  <span key={f.key} style={{ fontSize: 17, color: 'var(--q-dim)' }}>
                    {f.label} <strong style={{ color: 'var(--q-ink)' }}>{m[f.key]}</strong>
                  </span>
                ))}
              </div>
            </div>
          ))}
        </QuestBlock>
      )}

      {showAdd && (
        <Portal>
          <div className="q-sheet-wrap" onClick={() => setShowAdd(false)}>
            <div className="q-sheet" role="dialog" aria-label="Log measurements" onClick={e => e.stopPropagation()}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span className="q-ps" style={{ fontSize: 13 }}>LOG MEASUREMENTS</span>
                <button type="button" className="q-chip" aria-label="Close" onClick={() => setShowAdd(false)} style={{ cursor: 'pointer', padding: '7px 9px' }}>
                  <PixelSprite name="x" size={13} />
                </button>
              </div>
              <p style={{ fontSize: 18, color: 'var(--q-dim)', marginBottom: 16, lineHeight: 1.5 }}>Enter measurements in cm. Leave blank for any you don't want to track.</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 13, marginBottom: 18 }}>
                {MEASUREMENT_FIELDS.map(f => (
                  <div key={f.key}>
                    <QuestLabel>{f.label} ({f.unit})</QuestLabel>
                    <input className="q-slot-input" type="number" step=".1" placeholder="—" value={form[f.key] || ''} onChange={e => setForm(p => ({ ...p, [f.key]: parseFloat(e.target.value) || '' }))} style={{ marginTop: 6 }} aria-label={f.label} />
                  </div>
                ))}
              </div>
              <QuestBtn onClick={saveMeasurement} style={{ width: '100%' }}>SAVE MEASUREMENTS</QuestBtn>
            </div>
          </div>
        </Portal>
      )}
    </div>
  );
}
