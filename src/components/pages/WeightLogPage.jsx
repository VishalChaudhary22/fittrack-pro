import { useState, useMemo } from 'react';
import { Scale, Edit2, Trash2, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PageHeader, EmptyState, ConfirmDialog } from '../shared/SharedComponents';
import { fmt, gId, tod } from '../../utils/helpers';

export default function WeightLogPage() {
  const { user, healthLogs, setHealthLogs, addToast } = useApp();
  const [editId, setEditId] = useState(null);
  const [editVal, setEditVal] = useState({ weight: '', notes: '' });
  const [confirm, setConfirm] = useState(null);

  const userLogs = useMemo(() =>
    [...healthLogs]
      .filter(l => l.userId === user.id || l.userId === 'vishal')
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
        <div className="card" style={{ overflow: 'hidden' }}>
          {/* Header Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px 1fr 80px', gap: 10, padding: '10px 16px', borderBottom: '1px solid var(--bd)', background: 'var(--c2)' }}>
            <div style={{ fontSize: 10, color: 'var(--t3)', fontWeight: 700, textTransform: 'uppercase' }}>Date</div>
            <div style={{ fontSize: 10, color: 'var(--t3)', fontWeight: 700, textTransform: 'uppercase' }}>Weight</div>
            <div style={{ fontSize: 10, color: 'var(--t3)', fontWeight: 700, textTransform: 'uppercase' }}>Notes</div>
            <div style={{ fontSize: 10, color: 'var(--t3)', fontWeight: 700, textTransform: 'uppercase', textAlign: 'right' }}>Actions</div>
          </div>
          {userLogs.map((log, i) => {
            const prev = userLogs[i + 1];
            const diff = prev ? (log.weight - prev.weight).toFixed(1) : null;
            return (
              <div key={log.id} className="row-sep" style={{ display: 'grid', gridTemplateColumns: '1fr 100px 1fr 80px', gap: 10, padding: '10px 16px', alignItems: 'center' }}>
                <div style={{ fontSize: 13 }}>{fmt(log.date)}</div>
                {editId === log.id ? (
                  <>
                    <input type="number" step=".1" value={editVal.weight} onChange={e => setEditVal(p => ({ ...p, weight: e.target.value }))} style={{ fontSize: 13, padding: '5px 8px' }} />
                    <input value={editVal.notes} onChange={e => setEditVal(p => ({ ...p, notes: e.target.value }))} placeholder="Notes..." style={{ fontSize: 12, padding: '5px 8px' }} />
                    <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
                      <button className="btn-p" style={{ padding: '4px 10px', fontSize: 11 }} onClick={saveEdit}>✓</button>
                      <button className="btn-g" style={{ padding: '4px 8px', fontSize: 11 }} onClick={() => setEditId(null)}><X size={10} /></button>
                    </div>
                  </>
                ) : (
                  <>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontWeight: 600, fontSize: 14, color: 'var(--o)' }}>{log.weight}</span>
                      <span style={{ fontSize: 11, color: 'var(--t3)' }}>kg</span>
                      {diff && <span style={{ fontSize: 10, color: parseFloat(diff) > 0 ? '#FF6B6B' : '#6BCB77', fontWeight: 600 }}>{parseFloat(diff) > 0 ? '+' : ''}{diff}</span>}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--t3)' }}>{log.notes || '—'}</div>
                    <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
                      <button className="btn-g" style={{ padding: '3px 7px' }} onClick={() => startEdit(log)}><Edit2 size={10} /></button>
                      <button className="btn-d" style={{ padding: '3px 7px' }} onClick={() => deleteLog(log.id)}><Trash2 size={10} /></button>
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
