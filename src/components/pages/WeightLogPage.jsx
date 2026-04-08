import { useState, useMemo } from 'react';
import { Scale, Edit2, Trash2, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PageHeader, EmptyState, ConfirmDialog } from '../shared/SharedComponents';
import { fmt, gId, tod, kgToLbs } from '../../utils/helpers';

export default function WeightLogPage() {
  const { user, healthLogs, setHealthLogs, addToast } = useApp();
  const unitWeight = user.unitWeight || 'kg';
  const isImpWeight = unitWeight === 'lbs';
  const [editId, setEditId] = useState(null);
  const [editVal, setEditVal] = useState({ weight: '', notes: '' });
  const [confirm, setConfirm] = useState(null);

  const userLogs = useMemo(() =>
    [...healthLogs]
      .filter(l => l.userId === user.id)
      .sort((a, b) => new Date(b.date) - new Date(a.date)),
    [healthLogs, user.id]);

  const startEdit = (log) => { setEditId(log.id); setEditVal({ weight: log.weight, notes: log.notes || '' }); };
  const saveEdit = () => {
    setHealthLogs(p => p.map(l => l.id === editId ? { ...l, weight: parseFloat(editVal.weight), notes: editVal.notes } : l));
    setEditId(null);
    addToast('Weight entry updated', 'success');
  };

  const deleteLog = (id) => {
    setConfirm({
      title: 'Delete Entry?', message: 'This weight log entry will be permanently removed.',
      danger: true, confirmLabel: 'Delete',
      onConfirm: () => {
        setHealthLogs(p => p.filter(l => l.id !== id));
        setConfirm(null);
        addToast('Entry deleted', 'info');
      },
    });
  };

  return (
    <div className="pg-in">
      <PageHeader title="Weight Log" sub={`${userLogs.length} entries`} />

      {userLogs.length === 0 ? (
        <EmptyState Icon={Scale} title="No Weight Entries" message="Log your weight from the Dashboard to start tracking" />
      ) : (
        <div className="card" style={{ overflow: 'hidden', border: 'none' }}>
          {/* Header Row */}
          <div className="tonal-break" style={{ display: 'grid', gridTemplateColumns: 'minmax(100px, 1fr) 100px minmax(100px, 1fr) 80px', gap: 16, padding: '12px 20px', background: 'var(--surface-container-highest)' }}>
            <div style={{ fontSize: 11, color: 'var(--on-surface-dim)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.5px' }}>Date</div>
            <div style={{ fontSize: 11, color: 'var(--on-surface-dim)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.5px' }}>Weight</div>
            <div style={{ fontSize: 11, color: 'var(--on-surface-dim)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.5px' }}>Notes</div>
            <div style={{ fontSize: 11, color: 'var(--on-surface-dim)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.5px', textAlign: 'right' }}>Actions</div>
          </div>
          {userLogs.map((log, i) => {
            const prev = userLogs[i + 1];
            const diff = prev ? (log.weight - prev.weight).toFixed(1) : null;
            return (
              <div key={log.id} className="stripe" style={{ display: 'grid', gridTemplateColumns: 'minmax(100px, 1fr) 100px minmax(100px, 1fr) 80px', gap: 16, padding: '16px 20px', alignItems: 'center' }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--on-surface)' }}>{fmt(log.date)}</div>
                {editId === log.id ? (
                  <>
                    <input type="number" step=".1" value={editVal.weight} onChange={e => setEditVal(p => ({ ...p, weight: e.target.value }))} style={{ fontSize: 13, padding: '8px 12px', borderRadius: 8, border: 'none', background: 'var(--surface-container-highest)', color: 'var(--on-surface)' }} />
                    <input value={editVal.notes} onChange={e => setEditVal(p => ({ ...p, notes: e.target.value }))} placeholder="Notes..." style={{ fontSize: 13, padding: '8px 12px', borderRadius: 8, border: 'none', background: 'var(--surface-container-highest)', color: 'var(--on-surface)' }} />
                    <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                      <button className="btn-p" style={{ padding: '6px 12px', fontSize: 12, borderRadius: 8 }} onClick={saveEdit}>✓</button>
                      <button className="btn-g" style={{ padding: '6px 10px', fontSize: 12, borderRadius: 8 }} onClick={() => setEditId(null)}><X size={14} /></button>
                    </div>
                  </>
                ) : (
                  <>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span className="headline-md" style={{ color: 'var(--primary)', letterSpacing: '0px' }}>{isImpWeight ? kgToLbs(log.weight) : log.weight}</span>
                      <span style={{ fontSize: 12, color: 'var(--on-surface-variant)', fontWeight: 600 }}>{isImpWeight ? 'lbs' : 'kg'}</span>
                      {diff && <span style={{ fontSize: 11, color: parseFloat(diff) > 0 ? 'var(--danger)' : 'var(--success)', fontWeight: 700, background: parseFloat(diff) > 0 ? 'rgba(255,107,107,.15)' : 'rgba(81,207,102,.15)', padding: '2px 6px', borderRadius: 6, marginLeft: 4 }}>{parseFloat(diff) > 0 ? '+' : ''}{isImpWeight ? (parseFloat(diff) * 2.20462).toFixed(1) : diff}</span>}
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--on-surface-variant)' }}>{log.notes || '—'}</div>
                    <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                      <button className="btn-g" style={{ padding: '6px 10px', borderRadius: 8 }} onClick={() => startEdit(log)}><Edit2 size={14} /></button>
                      <button className="btn-d" style={{ padding: '6px 10px', borderRadius: 8 }} onClick={() => deleteLog(log.id)}><Trash2 size={14} /></button>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}
      <ConfirmDialog open={!!confirm} title={confirm?.title} message={confirm?.message} onConfirm={confirm?.onConfirm} onCancel={() => setConfirm(null)} confirmLabel={confirm?.confirmLabel} danger={confirm?.danger} />
    </div>
  );
}
