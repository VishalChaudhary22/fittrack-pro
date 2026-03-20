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

      <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, position: 'relative', minWidth: 200 }}>
          <Search size={14} color="var(--t3)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
          <input placeholder="Search exercises or days..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 34 }} />
        </div>
        <select value={filterSplit} onChange={e => setFilterSplit(e.target.value)} style={{ width: 'auto', minWidth: 160 }}>
          <option value="">All Splits</option>
          {splits.filter(s => !s.comingSoon).map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
      </div>

      {userLogs.length === 0 ? (
        <EmptyState Icon={Clock} title="No Workout History" message="Start logging workouts to see your history here" />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {userLogs.map(log => (
            <div key={log.id} className="card" style={{ overflow: 'hidden' }}>
              <div style={{ padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }} onClick={() => setExpandId(expandId === log.id ? null : log.id)}>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--o2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Bebas Neue'", fontSize: 14, color: 'var(--o)' }}>{new Date(log.date).getDate()}</div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{log.dayName}</div>
                    <div style={{ fontSize: 11, color: 'var(--t2)' }}>{fmt(log.date)} · {log.exercises?.length || 0} exercises</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <span className="tag" style={{ fontSize: 9 }}>{log.exercises?.reduce((s, e) => s + e.sets.length, 0) || 0} sets</span>
                  <ChevronDown size={14} color="var(--t3)" style={{ transform: expandId === log.id ? 'rotate(180deg)' : '', transition: '.2s' }} />
                </div>
              </div>
              {expandId === log.id && (
                <div style={{ borderTop: '1px solid var(--bd)', padding: '12px 16px' }}>
                  {log.exercises?.map((ex, i) => (
                    <div key={i} style={{ marginBottom: 10 }}>
                      <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 4, color: 'var(--o)' }}>{ex.name}</div>
                      <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                        {ex.sets.map((s, j) => (
                          <span key={j} style={{ padding: '3px 8px', background: 'var(--c3)', borderRadius: 6, fontSize: 11, border: '1px solid var(--bd)' }}>
                            {s.reps}r × {s.weight}kg
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                  {log.notes && <div style={{ fontSize: 11, color: 'var(--t3)', fontStyle: 'italic', marginTop: 6 }}>{log.notes}</div>}
                  <button className="btn-d" style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 4, fontSize: 11 }} onClick={(e) => { e.stopPropagation(); deleteLog(log.id); }}><Trash2 size={10} /> Delete Session</button>
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
