import { useState, useMemo, useCallback } from 'react';
import { useApp } from '../../context/AppContext';
import EditWorkoutModal from '../shared/EditWorkoutModal';
import { ConfirmDialog } from '../shared/SharedComponents';
import { fmt, tod } from '../../utils/helpers';
import { getMusclesForExercise, MUSCLE_GROUPS } from '../../data/muscleData';
import { useScrollRestoration } from '../../hooks/useScrollRestoration';
import { Screen, Sec, Hero, LedgerRow, Action, TLink, Note } from '../shared/Margin';

const historyCache = { activeTab: 'strength', search: '', filterSplit: '' };

// Format duration from durationMinutes
const fmtDuration = (mins) => {
  if (!mins) return '—';
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
};

// Compute total volume (reps × weight) for a session
const calcVolume = (exercises) => {
  if (!exercises?.length) return 0;
  return exercises.reduce((total, ex) =>
    total + ex.sets.reduce((s, set) => s + (set.reps || 0) * (set.weight || 0), 0), 0
  );
};

export default function WorkoutHistoryPage({ chatbot }) {
  useScrollRestoration('/history');
  const { user, workoutLogs, setWorkoutLogs, splits, addToast, cardioLog, setCardioLog, updateWorkoutLog } = useApp();
  const [search, setSearchRaw] = useState(historyCache.search);
  const [filterSplit, setFilterSplitRaw] = useState(historyCache.filterSplit);
  const [expandId, setExpandId] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [editLog, setEditLog] = useState(null);
  const [activeTab, setActiveTabRaw] = useState(historyCache.activeTab); // 'strength' | 'cardio'

  const setSearch = useCallback((v) => { historyCache.search = v; setSearchRaw(v); }, []);
  const setFilterSplit = useCallback((v) => { historyCache.filterSplit = v; setFilterSplitRaw(v); }, []);
  const setActiveTab = useCallback((v) => { historyCache.activeTab = v; setActiveTabRaw(v); }, []);

  // Cardio Form State
  const [cType, setCType] = useState('Running');
  const [cMins, setCMins] = useState('');
  const [cDist, setCDist] = useState('');
  const [cCals, setCCals] = useState('');

  const userLogs = useMemo(() => {
    let logs = [...workoutLogs]
      .filter(l => l.userId === user.id)
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

  // Build exercise name → muscle field lookup from splits
  const exMuscleMap = useMemo(() => {
    const map = {};
    splits.forEach(split => split.days?.forEach(day =>
      day.exercises?.forEach(ex => {
        if (ex.name && ex.muscle) map[ex.name] = ex.muscle;
      })
    ));
    return map;
  }, [splits]);

  // Get muscle group labels for a session
  const getSessionMuscles = (exercises) => {
    const muscles = new Set();
    exercises?.forEach(ex => {
      // Priority 1: use primaryMuscle stored directly in the log (works for swapped exercises)
      if (ex.primaryMuscle) {
        muscles.add(ex.primaryMuscle);
        (ex.secondaryMuscles || []).forEach(m => muscles.add(m));
      } else {
        // Priority 2: fallback to split-based name lookup
        const muscleField = exMuscleMap[ex.name];
        if (muscleField) {
          getMusclesForExercise(muscleField).forEach(m => muscles.add(m));
        }
      }
    });
    return [...muscles].slice(0, 3).map(key =>
      MUSCLE_GROUPS.find(mg => mg.key === key)?.label || key
    );
  };

  // Monthly aggregate stats for the header section
  const monthlyStats = useMemo(() => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthLogs = userLogs.filter(l => new Date(l.date) >= startOfMonth);

    const volume = monthLogs.reduce((t, l) => t + calcVolume(l.exercises), 0);
    const timeHrs = monthLogs.reduce((t, l) => t + (l.durationMinutes || 0), 0) / 60;

    return {
      volumeTons: (volume / 1000).toFixed(1),
      timeHrs: timeHrs.toFixed(1),
      sessions: monthLogs.length,
    };
  }, [userLogs]);

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

  const deleteCardio = (id) => {
    setConfirm({
      title: 'Delete Cardio?', message: 'This cardio log will be removed.',
      danger: true, confirmLabel: 'Delete',
      onConfirm: () => {
        setCardioLog(p => p.filter(l => l.id !== id));
        setConfirm(null);
        addToast('Cardio log deleted', 'info');
      },
    });
  };

  const userCardioLogs = useMemo(() => {
    return (cardioLog || []).filter(c => c.userId === user.id).sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [cardioLog, user.id]);

  const handleLogCardio = () => {
    if (!cMins || !cCals) { addToast('Please enter at least minutes and calories', 'error'); return; }
    setCardioLog(p => [...p, {
       id: Math.random().toString(36).substring(7),
       userId: user.id,
       date: tod(),
       type: cType,
       minutes: parseInt(cMins),
       distance: cDist ? parseFloat(cDist) : 0,
       calories: parseInt(cCals)
    }]);
    setCMins(''); setCDist(''); setCCals('');
    addToast('Cardio activity logged', 'success');
  };

  const cStats = useMemo(() => {
    const min = userCardioLogs.reduce((s, c) => s + c.minutes, 0);
    const cals = userCardioLogs.reduce((s, c) => s + c.calories, 0);
    return { min, cals };
  }, [userCardioLogs]);

  const monthName = new Date().toLocaleDateString('en-US', { month: 'long' });

  const askForge = (log) => {
    if (!chatbot) return;
    chatbot.openChat();
    setTimeout(() => chatbot.sendMessage(
      `How did I do on ${log.dayName} on ${fmt(log.date)}? Any improvements?`
    ), 300);
  };

  return (
    <>
      <Screen
        kicker="History"
        right={
          <div className="rowf g12">
            {[
              { id: 'strength', label: 'Strength' },
              { id: 'cardio', label: 'Cardio' },
            ].map(t => (
              <TLink
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                style={{ color: activeTab === t.id ? 'var(--ink)' : 'var(--ash-dim)' }}
              >
                {t.label}
              </TLink>
            ))}
          </div>
        }
      >
        {activeTab === 'strength' ? (<>
          <Sec n="01" label="This month" right={monthName}>
            <Hero value={monthlyStats.volumeTons} unit="tons" />
            <p className="body-dim" style={{ marginTop: 8 }}>Volume lifted in {monthName}.</p>
            <div style={{ marginTop: 18 }}>
              <LedgerRow k="Time active" v={`${monthlyStats.timeHrs} hrs`} />
              <LedgerRow k="Sessions" v={monthlyStats.sessions} />
              <LedgerRow k="All time" v={`${userLogs.length} sessions`} />
            </div>
          </Sec>

          <Sec n="02" label="Sessions" right={`${userLogs.length} logged`}>
            <div>
              <label className="kicker">Search</label>
              <input
                className="field"
                placeholder="Exercises or days…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <div style={{ marginTop: 18 }}>
              <label className="kicker">Split</label>
              <select className="field" value={filterSplit} onChange={e => setFilterSplit(e.target.value)}>
                <option value="">All splits</option>
                {splits.filter(s => !s.comingSoon).map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>

            {userLogs.length === 0 ? (
              <div style={{ marginTop: 24 }}>
                <Note>
                  <b>No sessions yet.</b> Finish a workout and it is written here, set by set.
                </Note>
              </div>
            ) : (
              <div style={{ marginTop: 10 }}>
                {userLogs.map(log => {
                  const vol = calcVolume(log.exercises);
                  const muscles = getSessionMuscles(log.exercises);
                  const isExpanded = expandId === log.id;
                  const setCount = log.exercises?.reduce((s, e) => s + e.sets.length, 0) || 0;

                  return (
                    <div key={log.id} style={{ borderTop: '1px solid var(--hair-soft)', paddingTop: 16, marginTop: 16 }}>
                      <div
                        className="rowf between"
                        style={{ alignItems: 'flex-start', gap: 12, cursor: 'pointer' }}
                        onClick={() => setExpandId(isExpanded ? null : log.id)}
                      >
                        <div style={{ minWidth: 0 }}>
                          <div className="kicker" style={{ color: 'var(--ash-dim)' }}>{fmt(log.date)}</div>
                          <div className="h2" style={{ fontSize: 17, marginTop: 4 }}>{log.dayName}</div>
                        </div>
                        <span style={{ color: 'var(--ash-dim)', fontSize: 11, flexShrink: 0 }}>
                          {isExpanded ? '−' : '+'}
                        </span>
                      </div>

                      <div style={{ marginTop: 12 }}>
                        <LedgerRow
                          k="Volume"
                          v={vol >= 1000 ? `${(vol / 1000).toFixed(1)}k` : `${vol}`}
                          sub=" kg"
                        />
                        <LedgerRow k="Duration" v={fmtDuration(log.durationMinutes)} />
                        <LedgerRow k="Exercises" v={log.exercises?.length || 0} />
                        <LedgerRow k="Sets" v={setCount} />
                      </div>

                      {muscles.length > 0 && (
                        <p className="meta" style={{ marginTop: 10 }}>
                          {muscles.join(' · ')}
                        </p>
                      )}

                      {isExpanded && (
                        <div style={{ marginTop: 16 }}>
                          {log.exercises?.map((ex, i) => (
                            <div key={i} style={{ marginTop: i === 0 ? 0 : 16 }}>
                              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>
                                {ex.name}
                              </div>
                              <div style={{ marginTop: 4 }}>
                                {ex.sets.map((s, j) => (
                                  <LedgerRow
                                    key={j}
                                    k={`Set ${j + 1}`}
                                    v={`${s.reps} × ${s.weight}`}
                                    sub=" kg"
                                    dim
                                  />
                                ))}
                              </div>
                            </div>
                          ))}

                          {log.notes && (
                            <div style={{ marginTop: 16 }}>
                              <Note>{log.notes}</Note>
                            </div>
                          )}

                          <div className="rowf g16" style={{ marginTop: 18 }}>
                            <TLink onClick={() => setEditLog(log)}>Edit session</TLink>
                            {chatbot && <TLink onClick={() => askForge(log)}>Ask FORGE</TLink>}
                            <TLink onClick={() => deleteLog(log.id)} style={{ color: 'var(--bad)' }}>Delete</TLink>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </Sec>
        </>) : (<>
          <Sec n="01" label="All time" right={`${userCardioLogs.length} activities`}>
            <Hero size="sm" value={cStats.min} unit="min" />
            <p className="body-dim" style={{ marginTop: 8 }}>Cardio minutes logged, all time.</p>
            <div style={{ marginTop: 18 }}>
              <LedgerRow k="Calories burned" v={`${cStats.cals} kcal`} />
              <LedgerRow k="Activities" v={userCardioLogs.length} />
            </div>
          </Sec>

          <Sec n="02" label="Log activity">
            <div>
              <label className="kicker">Type</label>
              <select className="field" value={cType} onChange={e => setCType(e.target.value)}>
                {['Running', 'Cycling', 'Swimming', 'Walking', 'HIIT', 'Rowing', 'Other'].map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div style={{ marginTop: 18 }}>
              <label className="kicker">Minutes</label>
              <input className="field" type="number" placeholder="30" value={cMins} onChange={e => setCMins(e.target.value)} />
            </div>
            <div style={{ marginTop: 18 }}>
              <label className="kicker">Distance (km, optional)</label>
              <input className="field" type="number" placeholder="5.0" value={cDist} onChange={e => setCDist(e.target.value)} />
            </div>
            <div style={{ marginTop: 18 }}>
              <label className="kicker">Calories</label>
              <input className="field" type="number" placeholder="300" value={cCals} onChange={e => setCCals(e.target.value)} />
            </div>
            <Action ember onClick={handleLogCardio}>Log cardio activity</Action>
          </Sec>

          <Sec n="03" label="Activities" right={`${userCardioLogs.length} logged`}>
            {userCardioLogs.length === 0 ? (
              <Note>
                <b>No cardio yet.</b> Log a run, ride or swim above and it lands here.
              </Note>
            ) : (
              <div>
                {userCardioLogs.map(c => (
                  <div key={c.id} style={{ borderTop: '1px solid var(--hair-soft)', paddingTop: 14, marginTop: 14 }}>
                    <div className="rowf between" style={{ alignItems: 'flex-start', gap: 12 }}>
                      <div style={{ minWidth: 0 }}>
                        <div className="kicker" style={{ color: 'var(--ash-dim)' }}>{fmt(c.date)}</div>
                        <div className="h2" style={{ fontSize: 16, marginTop: 4 }}>
                          {c.type}
                          {c.source === 'strava' && (
                            <span className="meta" style={{ marginLeft: 10, color: 'var(--ash)' }}>via Strava</span>
                          )}
                        </div>
                      </div>
                      <TLink onClick={() => deleteCardio(c.id)} style={{ color: 'var(--bad)', flexShrink: 0 }}>Delete</TLink>
                    </div>
                    <div style={{ marginTop: 10 }}>
                      <LedgerRow k="Duration" v={`${c.minutes} min`} />
                      {c.distance ? <LedgerRow k="Distance" v={`${c.distance} km`} /> : null}
                      <LedgerRow k="Calories" v={`${c.calories} kcal`} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Sec>
        </>)}

        <div className="foot">
          <span>Kaaya Fit</span>
          <span>History</span>
        </div>
      </Screen>

      {editLog && (
        <EditWorkoutModal
          log={editLog}
          splits={splits}
          onSave={async (updatedLog) => {
            await updateWorkoutLog(updatedLog.id, updatedLog);
            addToast('Workout updated', 'success');
          }}
          onClose={() => setEditLog(null)}
        />
      )}

      <ConfirmDialog open={!!confirm} title={confirm?.title} message={confirm?.message} onConfirm={confirm?.onConfirm} onCancel={() => setConfirm(null)} confirmLabel={confirm?.confirmLabel} danger={confirm?.danger} />
    </>
  );
}
