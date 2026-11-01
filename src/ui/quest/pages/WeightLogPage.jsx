import { useWeightLog } from '../../../core/hooks/useWeightLog';
import { fmt, kgToLbs } from '../../../utils/helpers';
import { QuestConfirmDialog } from '../shared/QuestShared';
import { QuestBlock, QuestBtn, QuestLabel } from '../primitives';
import PixelSprite from '../PixelSprite';

// ─── Kaaya Quest · Weight Log — ledger + stepped sparkline (plan §7.5, Q-6) ─
// Same brain as V1/Volt (useWeightLog), Quest presentation: entries are
// ledger rows, the trend is the stepped square-point line (the Progress
// chart language). Diff colours keep V1's semantics — gain ember, loss
// volt (Quest has no success token; volt is the positive hue).

// Stepped square-point line, chronological — same construction as the
// Progress StepChart (H-then-V path, square markers, crispEdges).
function WeightSpark({ entries }) {
  const W = 560, H = 150, PAD = 12;
  const vals = entries.map(d => d.weight);
  const min = Math.min(...vals);
  const max = Math.max(...vals);
  const range = (max - min) || 1;
  const pts = entries.map((d, i) => [
    PAD + (i / Math.max(entries.length - 1, 1)) * (W - PAD * 2),
    H - PAD - ((d.weight - min) / range) * (H - PAD * 2),
  ]);
  let path = `M${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`;
  for (let i = 1; i < pts.length; i++) {
    path += ` H${pts[i][0].toFixed(1)} V${pts[i][1].toFixed(1)}`;
  }
  const gridY = [0, 1, 2, 3, 4].map(i => PAD + ((H - PAD * 2) * i) / 4);
  return (
    <div>
      <div style={{ display: 'flex', gap: 7 }}>
        <div style={{ width: 38, flexShrink: 0, height: 132, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', textAlign: 'right', paddingTop: 2, paddingBottom: 2 }}>
          <span className="q-meta">{max}</span>
          <span className="q-meta">{min}</span>
        </div>
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ flex: 1, width: '100%', height: 132, display: 'block' }} aria-hidden="true">
          {gridY.map((y, i) => (
            <line key={i} x1={0} x2={W} y1={y} y2={y} stroke="var(--q-panel2)" strokeWidth="2" />
          ))}
          <path d={path} fill="none" stroke="var(--q-sky)" strokeWidth="3.5" shapeRendering="crispEdges" vectorEffect="non-scaling-stroke" />
          {pts.map((p, i) => (
            <rect key={i} x={p[0] - 4} y={p[1] - 4} width="8" height="8" fill="var(--q-sky)" stroke="var(--q-border)" strokeWidth="1.5" shapeRendering="crispEdges" vectorEffect="non-scaling-stroke" />
          ))}
        </svg>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 7, marginLeft: 45 }}>
        <span className="q-meta">{fmt(entries[0]?.date)}</span>
        <span className="q-meta">{fmt(entries[entries.length - 1]?.date)}</span>
      </div>
    </div>
  );
}

export default function WeightLogPage() {
  const {
    confirm, deleteLog, editId, editVal, isImpWeight, saveEdit, setConfirm,
    setEditId, setEditVal, startEdit, userLogs,
  } = useWeightLog();

  const disp = (kg) => (isImpWeight ? kgToLbs(kg) : kg);
  const unit = isImpWeight ? 'lbs' : 'kg';
  const chrono = [...userLogs].reverse();
  const latest = userLogs[0];
  const oldest = userLogs[userLogs.length - 1];
  const totalChange = latest && oldest && userLogs.length > 1 ? (latest.weight - oldest.weight) : null;

  return (
    <div className="q-screen" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <header>
        <QuestLabel tone="volt">Weight Log — {userLogs.length} entries</QuestLabel>
        <h1 className="q-ps" style={{ fontSize: 'clamp(19px, 6vw, 30px)', lineHeight: 1.35, margin: '10px 0 0' }}>WEIGHT LOG</h1>
      </header>

      {userLogs.length === 0 ? (
        <QuestBlock>
          <div style={{ textAlign: 'center', padding: '18px 0' }}>
            <PixelSprite name="scale" size={34} style={{ marginBottom: 12, opacity: 0.8 }} />
            <div className="q-ps" style={{ fontSize: 13 }}>NO WEIGHT ENTRIES</div>
            <p style={{ color: 'var(--q-dim)', fontSize: 19, marginTop: 8, lineHeight: 1.5 }}>Log your weight from the Dashboard to start tracking</p>
          </div>
        </QuestBlock>
      ) : (<>
        <QuestBlock>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 10, flexWrap: 'wrap', marginBottom: 12 }}>
            <div>
              <QuestLabel>Latest</QuestLabel>
              <div style={{ marginTop: 5 }}>
                <span className="q-ps" style={{ fontSize: 23, color: 'var(--q-volt-text)' }}>{disp(latest.weight)}</span>
                <span style={{ fontSize: 17, color: 'var(--q-dim)', marginLeft: 6 }}>{unit}</span>
              </div>
            </div>
            {totalChange !== null && (
              <div style={{ textAlign: 'right' }}>
                <QuestLabel>Total Change</QuestLabel>
                <div style={{ fontSize: 21, marginTop: 5, color: totalChange > 0 ? 'var(--q-ember-text)' : 'var(--q-volt-text)' }}>
                  {totalChange > 0 ? '+' : ''}{disp(Math.round(totalChange * 10) / 10)} {unit}
                </div>
              </div>
            )}
          </div>
          {userLogs.length >= 2 && <WeightSpark entries={chrono} />}
        </QuestBlock>

        <QuestBlock style={{ padding: '4px 16px' }}>
          {userLogs.map((log, i) => {
            const prev = userLogs[i + 1];
            const diff = prev ? (log.weight - prev.weight).toFixed(1) : null;
            const gain = diff && parseFloat(diff) > 0;
            return (
              <div key={log.id} style={{ padding: '13px 0', borderBottom: i < userLogs.length - 1 ? '2px solid var(--q-panel2)' : 'none' }}>
                {editId === log.id ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <div style={{ display: 'flex', gap: 10 }}>
                      <input className="q-slot-input" type="number" step=".1" value={editVal.weight} onChange={e => setEditVal(p => ({ ...p, weight: e.target.value }))} style={{ maxWidth: 130 }} aria-label="Weight" />
                      <input className="q-slot-input" value={editVal.notes} onChange={e => setEditVal(p => ({ ...p, notes: e.target.value }))} placeholder="Notes..." style={{ flex: 1, minWidth: 0 }} aria-label="Notes" />
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <QuestBtn sm onClick={saveEdit}>SAVE</QuestBtn>
                      <QuestBtn sm tone="ghost" onClick={() => setEditId(null)}>CANCEL</QuestBtn>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 16, color: 'var(--q-dim)' }}>{fmt(log.date)}</div>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: 7, marginTop: 3, flexWrap: 'wrap' }}>
                        <span style={{ fontSize: 24, color: 'var(--q-volt-text)' }}>{disp(log.weight)}</span>
                        <span style={{ fontSize: 15, color: 'var(--q-dim)' }}>{unit}</span>
                        {diff && (
                          <span className="q-chip" style={{ color: gain ? 'var(--q-ember-text)' : 'var(--q-volt-text)', borderColor: gain ? 'var(--q-ember)' : 'var(--q-volt)' }}>
                            {gain ? '+' : ''}{isImpWeight ? (parseFloat(diff) * 2.20462).toFixed(1) : diff}
                          </span>
                        )}
                      </div>
                      {log.notes && <div style={{ fontSize: 17, color: 'var(--q-dim)', marginTop: 3 }}>{log.notes}</div>}
                    </div>
                    <button type="button" className="q-chip" aria-label="Edit weight log" onClick={() => startEdit(log)} style={{ cursor: 'pointer', padding: '8px 10px', flexShrink: 0 }}>EDIT</button>
                    <button type="button" className="q-chip" aria-label="Delete weight log" onClick={() => deleteLog(log.id)} style={{ cursor: 'pointer', padding: '8px 9px', color: 'var(--q-ember-text)', flexShrink: 0 }}>
                      <PixelSprite name="x" size={13} />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </QuestBlock>
      </>)}

      <QuestConfirmDialog open={!!confirm} title={confirm?.title} message={confirm?.message} onConfirm={confirm?.onConfirm} onCancel={() => setConfirm(null)} confirmLabel={confirm?.confirmLabel} danger={confirm?.danger} />
    </div>
  );
}
