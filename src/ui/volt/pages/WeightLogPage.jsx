import { Edit2, Trash2, X } from 'lucide-react';
import { useWeightLog } from '../../../core/hooks/useWeightLog';
import { fmt, kgToLbs } from '../../../utils/helpers';
import { ConfirmDialog } from '../../v1/shared/SharedComponents';
import { VoltBlock, VoltPill, VoltLabel } from '../primitives';

// ─── Kaaya Volt · Weight Log (V-6b) ─────────────────────────────────────────
// Same logic core as V1 (useWeightLog), Volt presentation. Diff colors keep
// V1's semantics (gain = danger, loss = success). ConfirmDialog is V1's
// shared component (Volt skin = V-7 popup pack).

const inputStyle = {
  width: '100%', padding: '10px 12px', borderRadius: 10, fontSize: 13.5,
  background: 'var(--v-canvas)', color: 'var(--v-ink)',
  border: '2px solid var(--v-edge-quiet)', outline: 'none', fontFamily: 'inherit',
};

export default function VoltWeightLogPage() {
  const {
    confirm, deleteLog, editId, editVal, isImpWeight, saveEdit, setConfirm,
    setEditId, setEditVal, startEdit, userLogs,
  } = useWeightLog();

  return (
    <div className="v-screen" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <header className="v-rise">
        <VoltLabel volt>Weight Log — {userLogs.length} entries</VoltLabel>
        <h1 className="v-num" style={{ fontSize: 'clamp(1.9rem, 7vw, 2.8rem)', lineHeight: 1, margin: '8px 0 0', textTransform: 'uppercase' }}>Weight log</h1>
      </header>

      {userLogs.length === 0 ? (
        <VoltBlock>
          <p style={{ textAlign: 'center', color: 'var(--v-dim)', fontSize: 14, padding: '16px 0', lineHeight: 1.6 }}>
            <strong style={{ color: 'var(--v-ink)', display: 'block', fontSize: 16, marginBottom: 4 }}>No Weight Entries</strong>
            Log your weight from the Dashboard to start tracking
          </p>
        </VoltBlock>
      ) : (
        <VoltBlock style={{ padding: '6px 18px' }}>
          {userLogs.map((log, i) => {
            const prev = userLogs[i + 1];
            const diff = prev ? (log.weight - prev.weight).toFixed(1) : null;
            const gain = diff && parseFloat(diff) > 0;
            return (
              <div key={log.id} style={{ padding: '14px 0', borderBottom: i < userLogs.length - 1 ? '1.5px solid var(--v-edge-quiet)' : 'none' }}>
                {editId === log.id ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <div style={{ display: 'flex', gap: 10 }}>
                      <input type="number" step=".1" value={editVal.weight} onChange={e => setEditVal(p => ({ ...p, weight: e.target.value }))} style={{ ...inputStyle, maxWidth: 130 }} aria-label="Weight" />
                      <input value={editVal.notes} onChange={e => setEditVal(p => ({ ...p, notes: e.target.value }))} placeholder="Notes..." style={inputStyle} aria-label="Notes" />
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <VoltPill onClick={saveEdit} style={{ minHeight: 44, padding: '0 22px', fontSize: 13.5 }}>✓ Save</VoltPill>
                      <VoltPill ghost onClick={() => setEditId(null)} style={{ minHeight: 44, padding: '0 18px', fontSize: 13.5 }}><X size={14} /> Cancel</VoltPill>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12.5, color: 'var(--v-dim)', fontWeight: 600 }}>{fmt(log.date)}</div>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: 7, marginTop: 3, flexWrap: 'wrap' }}>
                        <span className="v-num" style={{ fontSize: 21, color: 'var(--v-volt-text)' }}>{isImpWeight ? kgToLbs(log.weight) : log.weight}</span>
                        <span style={{ fontSize: 12, color: 'var(--v-dim)', fontWeight: 600 }}>{isImpWeight ? 'lbs' : 'kg'}</span>
                        {diff && (
                          <span style={{
                            fontSize: 11, fontWeight: 700, padding: '2px 7px', borderRadius: 6,
                            color: gain ? 'var(--v-coral-text)' : 'var(--v-success-text)',
                            border: `1.5px solid ${gain ? 'var(--v-coral)' : 'var(--v-success)'}`,
                          }}>
                            {gain ? '+' : ''}{isImpWeight ? (parseFloat(diff) * 2.20462).toFixed(1) : diff}
                          </span>
                        )}
                      </div>
                      {log.notes && <div style={{ fontSize: 12.5, color: 'var(--v-dim)', marginTop: 3 }}>{log.notes}</div>}
                    </div>
                    <button type="button" className="v-press" aria-label="Edit weight log" onClick={() => startEdit(log)} style={{ minWidth: 40, height: 40, borderRadius: 11, border: '2px solid var(--v-edge-quiet)', background: 'var(--v-panel)', color: 'var(--v-ink)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Edit2 size={15} /></button>
                    <button type="button" className="v-press" aria-label="Delete weight log" onClick={() => deleteLog(log.id)} style={{ minWidth: 40, height: 40, borderRadius: 11, border: '2px solid var(--v-edge-quiet)', background: 'var(--v-panel)', color: 'var(--v-coral-text)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Trash2 size={15} /></button>
                  </div>
                )}
              </div>
            );
          })}
        </VoltBlock>
      )}

      <ConfirmDialog open={!!confirm} title={confirm?.title} message={confirm?.message} onConfirm={confirm?.onConfirm} onCancel={() => setConfirm(null)} confirmLabel={confirm?.confirmLabel} danger={confirm?.danger} />
    </div>
  );
}
