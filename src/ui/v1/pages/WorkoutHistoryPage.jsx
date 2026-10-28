import { Clock, Trash2, ChevronDown, Search, Activity, Timer, Dumbbell, Flame, Footprints, Edit2, Bot } from 'lucide-react';
import EditWorkoutModal from '../shared/EditWorkoutModal';
import { PageHeader, EmptyState, ConfirmDialog } from '../shared/SharedComponents';
import { fmt } from '../../../utils/helpers';
import { useWorkoutHistory, fmtDuration, calcVolume } from '../../../core/hooks/useWorkoutHistory';

export default function WorkoutHistoryPage({ chatbot }) {
  const { activeTab, addToast, cCals, cDist, cMins, cStats, cType, confirm, deleteCardio, deleteLog, editLog, expandId, filterSplit, getSessionMuscles, handleLogCardio, monthlyStats, search, setActiveTab, setCCals, setCDist, setCMins, setCType, setConfirm, setEditLog, setExpandId, setFilterSplit, setSearch, splits, updateWorkoutLog, userCardioLogs, userLogs } = useWorkoutHistory();
  return (
    <div className="pg-in">
      <PageHeader title={activeTab === 'strength' ? "Workout History" : "Cardio Activity"} sub={activeTab === 'strength' ? `${userLogs.length} sessions logged` : `${userCardioLogs.length} activities logged`} />

      <div style={{ display: 'flex', gap: 8, marginBottom: 24, background: 'var(--surface-container-low)', padding: 4, borderRadius: 12 }}>
        <button onClick={() => setActiveTab('strength')} style={{ flex: 1, padding: 12, borderRadius: 8, background: activeTab === 'strength' ? 'var(--primary)' : 'transparent', color: activeTab === 'strength' ? 'var(--on-primary)' : 'var(--on-surface-variant)', border: 'none', fontWeight: 700, fontSize: 13, transition: '0.2s', cursor: 'pointer' }}>
          STRENGTH LOGS
        </button>
        <button onClick={() => setActiveTab('cardio')} style={{ flex: 1, padding: 12, borderRadius: 8, background: activeTab === 'cardio' ? 'var(--primary)' : 'transparent', color: activeTab === 'cardio' ? 'var(--on-primary)' : 'var(--on-surface-variant)', border: 'none', fontWeight: 700, fontSize: 13, transition: '0.2s', cursor: 'pointer' }}>
          CARDIO ACTIVITY
        </button>
      </div>

      {activeTab === 'strength' ? (<>
      <section style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginBottom: 28,
      }} className="g3">
        {[
          { Icon: Activity, label: 'Monthly Volume', value: monthlyStats.volumeTons, unit: 'tons' },
          { Icon: Timer,    label: 'Time Active',    value: monthlyStats.timeHrs,    unit: 'hrs'  },
          { Icon: Dumbbell, label: 'Sessions',       value: monthlyStats.sessions,   unit: 'this month' },
        ].map(stat => (
          <div key={stat.label} className="glass-card" style={{
            padding: '20px 18px', borderRadius: 16, border: 'none',
            position: 'relative', overflow: 'hidden',
          }}>
            <stat.Icon size={44} style={{
              position: 'absolute', top: 10, right: 12,
              color: 'var(--on-surface)', opacity: 0.06, pointerEvents: 'none',
            }} />
            <div className="label-md" style={{
              color: 'var(--on-surface-variant)', marginBottom: 8,
            }}>
              {stat.label}
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
              <span className="display-lg" style={{ color: 'var(--primary)' }}>
                {stat.value}
              </span>
              <span style={{ fontSize: 11, color: 'var(--on-surface-dim)' }}>
                {stat.unit}
              </span>
            </div>
          </div>
        ))}
      </section>

      {/* ── FILTERS ───────────────────────────────────────── */}
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

      {/* ── SESSION CARDS ──────────────────────────────────── */}
      {userLogs.length === 0 ? (
        <EmptyState Icon={Clock} title="No Workout History" message="Start logging workouts to see your history here" />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {userLogs.map(log => {
            const vol = calcVolume(log.exercises);
            const muscles = getSessionMuscles(log.exercises);
            const isExpanded = expandId === log.id;

            return (
              <div key={log.id} className="card" style={{
                overflow: 'hidden', border: 'none',
                background: 'var(--surface-container-low)',
                borderLeft: isExpanded ? '3px solid var(--primary-container)' : '3px solid transparent',
                transition: 'all .2s var(--ease-smooth)',
              }}>
                <div style={{
                  padding: '18px 20px', cursor: 'pointer',
                  transition: 'background .2s var(--ease-smooth)',
                }}
                  onClick={() => setExpandId(isExpanded ? null : log.id)}
                  onMouseOver={e => e.currentTarget.style.background = 'var(--surface-container)'}
                  onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                    <div>
                      <div className="label-md" style={{ color: 'var(--primary)', marginBottom: 4 }}>
                        {fmt(log.date)}
                      </div>
                      <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.1rem', fontWeight: 700, letterSpacing: '-0.02em', textTransform: 'uppercase', color: 'var(--on-surface)' }}>
                        {log.dayName}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(248,95,27,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Dumbbell size={18} color="var(--primary)" />
                      </div>
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          if (chatbot) {
                            chatbot.openChat();
                            chatbot.sendMessage(
                              `How did I do on ${log.dayName} on ${fmt(log.date)}? Any improvements?`
                            );
                          }
                        }}
                        style={{ width: 36, height: 36, borderRadius: 10, background: 'transparent', border: '1px solid var(--outline-variant)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--on-surface-dim)', transition: '0.2s' }}
                        onMouseEnter={e => { e.currentTarget.style.color = 'var(--primary)'; e.currentTarget.style.borderColor = 'var(--primary)'; }}
                        onMouseLeave={e => { e.currentTarget.style.color = 'var(--on-surface-dim)'; e.currentTarget.style.borderColor = 'var(--outline-variant)'; }}
                        aria-label="Ask FORGE about this session"
                      >
                        <Bot size={18} />
                      </button>
                      <ChevronDown size={16} color="var(--on-surface-dim)" style={{ transform: isExpanded ? 'rotate(180deg)' : '', transition: '.2s' }} />
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 24, marginBottom: muscles.length > 0 ? 14 : 0 }}>
                    {[
                      { label: 'Volume',    value: vol >= 1000 ? `${(vol/1000).toFixed(1)}k` : `${vol}`, unit: 'kg' },
                      { label: 'Duration',  value: fmtDuration(log.durationMinutes), unit: '' },
                      { label: 'Exercises', value: `${log.exercises?.length || 0}`, unit: '' },
                      { label: 'Sets',      value: `${log.exercises?.reduce((s, e) => s + e.sets.length, 0) || 0}`, unit: '' },
                    ].map(s => (
                      <div key={s.label}>
                        <div className="label-md" style={{ color: 'var(--on-surface-variant)', marginBottom: 2 }}>{s.label}</div>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: 3 }}>
                          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.1rem', fontWeight: 700, color: 'var(--on-surface)' }}>{s.value}</span>
                          {s.unit && <span style={{ fontSize: 10, color: 'var(--on-surface-dim)' }}>{s.unit}</span>}
                        </div>
                      </div>
                    ))}
                  </div>

                  {muscles.length > 0 && (
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {muscles.map(m => (
                        <span key={m} style={{ padding: '3px 10px', borderRadius: 20, background: 'var(--surface-container-highest)', fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--on-surface-variant)', fontFamily: "'Be Vietnam Pro', sans-serif" }}>
                          {m}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {isExpanded && (
                  <div style={{ padding: '0 20px 20px 20px', borderTop: '1px solid var(--outline-variant)' }}>
                    <div style={{ paddingTop: 16 }}>
                      {log.exercises?.map((ex, i) => (
                        <div key={i} style={{ marginBottom: 14 }}>
                          <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 6, color: 'var(--primary)' }}>
                            {ex.name}
                          </div>
                          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                            {ex.sets.map((s, j) => (
                              <span key={j} style={{ padding: '4px 10px', background: 'var(--surface-container-highest)', borderRadius: 8, fontSize: 12, fontWeight: 600, color: 'var(--on-surface)' }}>
                                {s.reps}r × {s.weight}kg
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                      {log.notes && (
                        <div style={{ fontSize: 12, color: 'var(--on-surface-variant)', fontStyle: 'italic', marginTop: 8, padding: '12px', background: 'var(--surface-container-lowest)', borderRadius: 8 }}>
                          {log.notes}
                        </div>
                      )}
                      <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
                        <button className="btn-p" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: 13, padding: '10px 12px', borderRadius: 8 }} onClick={e => { e.stopPropagation(); setEditLog(log); }}>
                          <Edit2 size={14} /> Edit Session
                        </button>
                        <button className="btn-d" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: 13, padding: '10px 12px', borderRadius: 8, color: 'var(--error)', borderColor: 'rgba(255,59,48,0.3)', background: 'transparent' }} onClick={e => { e.stopPropagation(); deleteLog(log.id); }}>
                          <Trash2 size={14} /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}


      {userLogs.length >= 10 && (
        <button style={{ width: '100%', marginTop: 28, padding: '14px', borderRadius: 16, background: 'var(--surface-container-lowest)', border: '1px solid var(--outline-variant)', color: 'var(--on-surface-dim)', fontSize: 11, fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: "'Be Vietnam Pro', sans-serif", transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-container-low)'} onMouseLeave={e => e.currentTarget.style.background = 'var(--surface-container-lowest)'}>
          Show Previous Sessions
        </button>
      )}
      </>) : (<>
      {/* ── CARDIO TAB CONTENT ───────────────────────────── */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12, marginBottom: 28 }} className="g3">
        <div className="glass-card" style={{ padding: '20px 18px', borderRadius: 16, border: 'none', position: 'relative', overflow: 'hidden' }}>
          <Timer size={44} style={{ position: 'absolute', top: 10, right: 12, color: 'var(--on-surface)', opacity: 0.06 }} />
          <div className="label-md" style={{ color: 'var(--on-surface-variant)', marginBottom: 8 }}>Total Minutes</div>
          <div className="display-lg" style={{ color: 'var(--primary)' }}>{cStats.min}</div>
        </div>
        <div className="glass-card" style={{ padding: '20px 18px', borderRadius: 16, border: 'none', position: 'relative', overflow: 'hidden' }}>
          <Flame size={44} style={{ position: 'absolute', top: 10, right: 12, color: 'var(--on-surface)', opacity: 0.06 }} />
          <div className="label-md" style={{ color: 'var(--on-surface-variant)', marginBottom: 8 }}>Cals Burned</div>
          <div className="display-lg" style={{ color: '#F85F1B' }}>{cStats.cals}</div>
        </div>
      </section>

      <div className="card" style={{ background: 'var(--surface-container-low)', padding: 24, marginBottom: 24 }}>
        <h3 className="headline-md" style={{ fontSize: 16, marginBottom: 16 }}>Log Activity</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 12, marginBottom: 16 }}>
          <select value={cType} onChange={e => setCType(e.target.value)} style={{ padding: 12, borderRadius: 12, background: 'var(--surface-container-highest)', border: 'none', color: 'var(--on-surface)', fontWeight: 600 }}>
            {['Running', 'Cycling', 'Swimming', 'Walking', 'HIIT', 'Rowing', 'Other'].map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <input type="number" placeholder="Mins" value={cMins} onChange={e => setCMins(e.target.value)} style={{ padding: 12, borderRadius: 12, background: 'var(--surface-container-highest)', border: 'none', color: 'var(--on-surface)', fontWeight: 600 }} />
          <input type="number" placeholder="Dist (km)" value={cDist} onChange={e => setCDist(e.target.value)} style={{ padding: 12, borderRadius: 12, background: 'var(--surface-container-highest)', border: 'none', color: 'var(--on-surface)', fontWeight: 600 }} />
          <input type="number" placeholder="Kcal" value={cCals} onChange={e => setCCals(e.target.value)} style={{ padding: 12, borderRadius: 12, background: 'var(--surface-container-highest)', border: 'none', color: 'var(--on-surface)', fontWeight: 600 }} />
        </div>
        <button className="btn-p" style={{ width: '100%', padding: 14, borderRadius: 12 }} onClick={handleLogCardio}>Log Cardio Activity</button>
      </div>

      {userCardioLogs.length === 0 ? (
        <EmptyState Icon={Footprints} title="No Cardio Logged" message="Track your endurance and aerobic sessions" />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {userCardioLogs.map(c => (
            <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 16, background: 'var(--surface-container-low)', borderRadius: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: 'var(--surface-container-highest)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: 10, color: 'var(--on-surface-variant)', textTransform: 'uppercase', fontWeight: 600 }}>{new Date(c.date).toLocaleDateString('en-US', { month: 'short' })}</span>
                  <span style={{ fontSize: 16, color: 'var(--on-surface)', fontWeight: 700, lineHeight: 1 }}>{new Date(c.date).getDate()}</span>
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--on-surface)', display: 'flex', alignItems: 'center', gap: 6 }}>
                    {c.type}
                    {c.source === 'strava' && (
                      <span style={{ fontSize: 9, background: '#FC4C02', color: '#fff', padding: '2px 6px', borderRadius: 4, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 800 }}>
                        Strava
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--on-surface-variant)' }}>{c.minutes} mins {c.distance ? `· ${c.distance} km` : ''}</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 13, fontWeight: 800, color: '#F85F1B' }}>{c.calories} kcal</div>
                </div>
                <button aria-label="Delete cardio session" style={{ background: 'transparent', border: 'none', color: 'var(--on-surface-dim)', cursor: 'pointer' }} onClick={() => deleteCardio(c.id)}><Trash2 size={16} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
      </>)}

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
    </div>
  );
}
