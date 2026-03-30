import { useState, useMemo } from 'react';
import { Clock, Trash2, ChevronDown, Search } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PageHeader, EmptyState, ConfirmDialog } from '../shared/SharedComponents';
import { fmt } from '../../utils/helpers';

export default function WorkoutHistoryPage() {
  const { user, workoutLogs, setWorkoutLogs, splits, addToast } = useApp();
  const [search, setSearch] = useState('');
  const [filterSplit, setFilterSplit] = useState('');
  const [expandId, setExpandId] = useState(null);
  const [confirm, setConfirm] = useState(null);

  const userLogs = useMemo(() => {
    let logs = [...workoutLogs]
      .filter(l => l.userId === user.id || l.userId === 'vishal')
      .sort((a, b) => new Date(b.date) - new Date(a.date));
    if (filterSplit) logs = logs.filter(l => l.splitId === filterSplit);
    if (search) {
      const q = search.toLowerCase();
      logs = logs.filter(l =>
        l.dayName?.toLowerCase().includes(q) ||
        l.exercises?.some(e => e.name.toLowerCase().includes(q))
      );
    }
    return logs;
  }, [workoutLogs, user.id, filterSplit, search]);

  const deleteLog = (id) => {
    setConfirm({
      title: 'Delete Session?', message: 'This workout session will be permanently removed.',
      danger: true, confirmLabel: 'Delete',
      onConfirm: () => {
        setWorkoutLogs(p => p.filter(l => l.id !== id));
        setConfirm(null); setExpandId(null);
        addToast('Session deleted', 'info');
      },
    });
  };

  return (
    <div className="pg-in">
      <PageHeader title="Workout History" sub={`${userLogs.length} sessions logged`} />

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(200px, 1fr) auto', gap: 12, marginBottom: 24 }}>
        <div style={{ position: 'relative' }}>
          <Search size={16} color="var(--on-surface-dim)" style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)' }} />
          <input placeholder="Search exercises or days..." value={search} onChange={e => setSearch(e.target.value)} style={{ width: '100%', padding: '12px 16px 12px 42px', background: 'var(--surface-container-highest)', border: 'none', borderRadius: 12, color: 'var(--on-surface)', fontWeight: 600, fontSize: 14 }} />
        </div>
        <select value={filterSplit} onChange={e => setFilterSplit(e.target.value)} style={{ padding: '12px 16px', background: 'var(--surface-container-highest)', border: 'none', borderRadius: 12, color: 'var(--on-surface)', fontWeight: 600, fontSize: 14 }}>
          <option value="">All Splits</option>
          {splits.filter(s => !s.comingSoon).map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
      </div>

      {userLogs.length === 0 ? (
        <EmptyState Icon={Clock} title="No Workout History" message="Start logging workouts to see your history here" />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {userLogs.map(log => (
            <div key={log.id} className="card" style={{ overflow: 'hidden', border: 'none', background: 'var(--surface-container-lowest)' }}>
              <div style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', transition: 'background .2s var(--ease-smooth)' }} onClick={() => setExpandId(expandId === log.id ? null : log.id)} onMouseOver={e => e.currentTarget.style.background = 'var(--surface-container-low)'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                  <div className="headline-md" style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(232,84,13,.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>{new Date(log.date).getDate()}</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--on-surface)' }}>{log.dayName}</div>
                    <div style={{ fontSize: 12, color: 'var(--on-surface-variant)', fontWeight: 600, marginTop: 2 }}>{fmt(log.date)} · {log.exercises?.length || 0} exercises</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--on-surface-variant)', background: 'var(--surface-container-highest)', padding: '4px 10px', borderRadius: 8 }}>{log.exercises?.reduce((s, e) => s + e.sets.length, 0) || 0} sets</span>
                  <ChevronDown size={16} color="var(--on-surface-dim)" style={{ transform: expandId === log.id ? 'rotate(180deg)' : '', transition: '.2s' }} />
                </div>
              </div>
              {expandId === log.id && (
                <div className="tonal-break" style={{ padding: '20px', background: 'var(--surface-container-highest)' }}>
                  {log.exercises?.map((ex, i) => (
                    <div key={i} style={{ marginBottom: 16 }}>
                      <div className="headline-sm" style={{ marginBottom: 8, color: 'var(--primary)' }}>{ex.name}</div>
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        {ex.sets.map((s, j) => (
                          <span key={j} style={{ padding: '4px 10px', background: 'var(--surface-container-lowest)', borderRadius: 8, fontSize: 12, fontWeight: 600, color: 'var(--on-surface)' }}>
                            {s.reps}r × {s.weight}kg
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                  {log.notes && <div style={{ fontSize: 13, color: 'var(--on-surface-variant)', fontStyle: 'italic', marginTop: 8, padding: '12px', background: 'var(--surface-container-lowest)', borderRadius: 8 }}>{log.notes}</div>}
                  <button className="btn-d" style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, padding: '8px 12px', borderRadius: 8 }} onClick={(e) => { e.stopPropagation(); deleteLog(log.id); }}><Trash2 size={12} /> Delete Session</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      <ConfirmDialog open={!!confirm} title={confirm?.title} message={confirm?.message} onConfirm={confirm?.onConfirm} onCancel={() => setConfirm(null)} confirmLabel={confirm?.confirmLabel} danger={confirm?.danger} />
    </div>
  );
}
