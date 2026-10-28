import { Trash2, ChevronDown, Search, Edit2, Bot } from 'lucide-react';
import { useWorkoutHistory, fmtDuration, calcVolume } from '../../../core/hooks/useWorkoutHistory';
import { fmt } from '../../../utils/helpers';
import VoltEditWorkoutModal from '../shared/VoltEditWorkoutModal';
import { VoltConfirmDialog } from '../shared/VoltShared';
import { VoltBlock, VoltPill, VoltLabel } from '../primitives';

// ─── Kaaya Volt · Workout History (V-6a) ────────────────────────────────────
// Same logic core as V1 (useWorkoutHistory), Volt presentation.
// Edit modal + confirm dialog are Volt twins (V-7 popup pack).

const inputStyle = {
  width: '100%', padding: '12px 14px', borderRadius: 12, fontSize: 14,
  background: 'var(--v-canvas)', color: 'var(--v-ink)',
  border: '2px solid var(--v-edge-quiet)', outline: 'none', fontFamily: 'inherit',
};
const statLabel = { fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.13em', color: 'var(--v-dim)', textTransform: 'uppercase', marginBottom: 3 };

function TabSeg({ value, onChange }) {
  const tabs = [{ k: 'strength', label: 'Strength Logs' }, { k: 'cardio', label: 'Cardio Activity' }];
  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <div style={{ display: 'flex', background: 'var(--v-panel)', border: '2.5px solid var(--v-edge)', borderRadius: 999, padding: 4, gap: 4, width: '100%', maxWidth: 430 }}>
        {tabs.map(t => (
          <button
            key={t.k}
            type="button"
            onClick={() => onChange(t.k)}
            style={{
              flex: 1, padding: '10px 12px', borderRadius: 999, border: 'none', cursor: 'pointer',
              fontFamily: "'Archivo', sans-serif", fontSize: 13.5, fontWeight: 800,
              background: value === t.k ? 'var(--v-volt)' : 'transparent',
              color: value === t.k ? '#141416' : 'var(--v-dim)',
              transition: 'background-color 200ms cubic-bezier(0.23, 1, 0.32, 1), color 200ms cubic-bezier(0.23, 1, 0.32, 1)',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function VoltWorkoutHistoryPage({ chatbot }) {
  const {
    activeTab, addToast, cCals, cDist, cMins, cStats, cType, confirm,
    deleteCardio, deleteLog, editLog, expandId, filterSplit,
    getSessionMuscles, handleLogCardio, monthlyStats, search, setActiveTab,
    setCCals, setCDist, setCMins, setCType, setConfirm, setEditLog,
    setExpandId, setFilterSplit, setSearch, splits, updateWorkoutLog,
    userCardioLogs, userLogs,
  } = useWorkoutHistory();

  return (
    <div className="v-screen" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <header className="v-rise">
        <VoltLabel volt>
          History — {activeTab === 'strength' ? `${userLogs.length} sessions logged` : `${userCardioLogs.length} activities logged`}
        </VoltLabel>
        <h1 className="v-num" style={{ fontSize: 'clamp(1.9rem, 7vw, 2.8rem)', lineHeight: 1, margin: '8px 0 0', textTransform: 'uppercase' }}>
          {activeTab === 'strength' ? 'Workout history' : 'Cardio activity'}
        </h1>
      </header>

      <TabSeg value={activeTab} onChange={setActiveTab} />

      {activeTab === 'strength' ? (<>
        <div style={{ display: 'flex', gap: 12 }}>
          {[
            { label: 'Monthly Volume', value: monthlyStats.volumeTons, unit: 'tons' },
            { label: 'Time Active', value: monthlyStats.timeHrs, unit: 'hrs' },
            { label: 'Sessions', value: monthlyStats.sessions, unit: 'this month' },
          ].map(s => (
            <VoltBlock key={s.label} style={{ flex: 1, minWidth: 0, padding: '16px 14px' }}>
              <div style={statLabel}>{s.label}</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                <span className="v-num" style={{ fontSize: 24, color: 'var(--v-volt-text)' }}>{s.value}</span>
                <span style={{ fontSize: 11, color: 'var(--v-dim)' }}>{s.unit}</span>
              </div>
            </VoltBlock>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 0 }}>
            <Search size={16} color="var(--v-dim)" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
            <input placeholder="Search exercises or days..." value={search} onChange={e => setSearch(e.target.value)} style={{ ...inputStyle, paddingLeft: 40 }} />
          </div>
          <select value={filterSplit} onChange={e => setFilterSplit(e.target.value)} style={{ ...inputStyle, width: 'auto', maxWidth: 150 }}>
            <option value="">All Splits</option>
            {splits.filter(s => !s.comingSoon).map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>

        {userLogs.length === 0 ? (
          <VoltBlock>
            <p style={{ textAlign: 'center', color: 'var(--v-dim)', fontSize: 14, padding: '16px 0', lineHeight: 1.6 }}>
              <strong style={{ color: 'var(--v-ink)', display: 'block', fontSize: 16, marginBottom: 4 }}>No Workout History</strong>
              Start logging workouts to see your history here
            </p>
          </VoltBlock>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {userLogs.map(log => {
              const vol = calcVolume(log.exercises);
              const muscles = getSessionMuscles(log.exercises);
              const isExpanded = expandId === log.id;
              return (
                <VoltBlock key={log.id} style={{ padding: 0, overflow: 'hidden' }}>
                  <div style={{ padding: '16px 18px 14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                      <button type="button" onClick={() => setExpandId(isExpanded ? null : log.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, textAlign: 'left' }}>
                        <VoltLabel volt>{fmt(log.date)}</VoltLabel>
                        <span className="v-num" style={{ display: 'block', fontSize: 18, textTransform: 'uppercase', marginTop: 5, color: 'var(--v-ink)' }}>{log.dayName}</span>
                      </button>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <button
                          type="button" className="v-press" aria-label="Ask FORGE about this session"
                          onClick={() => {
                            if (chatbot) {
                              chatbot.openChat();
                              setTimeout(() => chatbot.sendMessage(
                                `How did I do on ${log.dayName} on ${fmt(log.date)}? Any improvements?`
                              ), 300);
                            }
                          }}
                          style={{ width: 40, height: 40, borderRadius: 11, background: 'var(--v-panel)', border: '2px solid var(--v-edge-quiet)', color: 'var(--v-dim)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                          <Bot size={17} />
                        </button>
                        <button type="button" className="v-press" aria-label="Expand session" onClick={() => setExpandId(isExpanded ? null : log.id)} style={{ width: 40, height: 40, borderRadius: 11, background: 'var(--v-panel)', border: '2px solid var(--v-edge-quiet)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <ChevronDown size={16} color="var(--v-dim)" style={{ transform: isExpanded ? 'rotate(180deg)' : '', transition: 'transform 0.2s' }} />
                        </button>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 18 }}>
                      {[
                        { label: 'Volume', value: vol >= 1000 ? `${(vol / 1000).toFixed(1)}k` : `${vol}`, unit: 'kg' },
                        { label: 'Duration', value: fmtDuration(log.durationMinutes), unit: '' },
                        { label: 'Exercises', value: `${log.exercises?.length || 0}`, unit: '' },
                        { label: 'Sets', value: `${log.exercises?.reduce((s, e) => s + e.sets.length, 0) || 0}`, unit: '' },
                      ].map(s => (
                        <div key={s.label} style={{ flex: 1, minWidth: 0 }}>
                          <div style={statLabel}>{s.label}</div>
                          <div className="v-num" style={{ fontSize: 17 }}>{s.value}{s.unit && <span style={{ fontSize: 10.5, color: 'var(--v-dim)', marginLeft: 3 }}>{s.unit}</span>}</div>
                        </div>
                      ))}
                    </div>
                    {muscles.length > 0 && (
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 12 }}>
                        {muscles.map(m => <span key={m} className="v-chip">{m}</span>)}
                      </div>
                    )}
                  </div>

                  {isExpanded && (
                    <div style={{ padding: '14px 18px 18px', borderTop: '2px solid var(--v-edge-quiet)' }}>
                      {log.exercises?.map((ex, i) => (
                        <div key={i} style={{ marginBottom: 13 }}>
                          <div style={{ fontWeight: 700, fontSize: 13.5, marginBottom: 6, color: 'var(--v-volt-text)' }}>{ex.name}</div>
                          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                            {ex.sets.map((s, j) => (
                              <span key={j} style={{ padding: '4px 10px', border: '2px solid var(--v-edge-quiet)', borderRadius: 8, fontSize: 12, fontWeight: 600, color: 'var(--v-ink)' }}>{s.reps}r × {s.weight}kg</span>
                            ))}
                          </div>
                        </div>
                      ))}
                      {log.notes && (
                        <p style={{ fontSize: 12.5, color: 'var(--v-dim)', fontStyle: 'italic', marginTop: 6, padding: '10px 12px', background: 'var(--v-canvas)', borderRadius: 10, lineHeight: 1.55 }}>{log.notes}</p>
                      )}
                      <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
                        <VoltPill onClick={() => setEditLog(log)} style={{ flex: 1, minHeight: 48, fontSize: 13.5 }}>
                          <Edit2 size={14} /> Edit Session
                        </VoltPill>
                        <VoltPill onClick={() => deleteLog(log.id)} style={{ flex: 1, minHeight: 48, fontSize: 13.5, background: 'var(--v-coral)', color: '#fff' }}>
                          <Trash2 size={14} /> Delete
                        </VoltPill>
                      </div>
                    </div>
                  )}
                </VoltBlock>
              );
            })}
          </div>
        )}

        {userLogs.length >= 10 && (
          <div style={{ textAlign: 'center', padding: '6px 0', fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.15em', color: 'var(--v-dim)' }}>SHOW PREVIOUS SESSIONS</div>
        )}
      </>) : (<>
        <div style={{ display: 'flex', gap: 12 }}>
          <VoltBlock style={{ flex: 1, padding: '16px 14px' }}>
            <div style={statLabel}>Total Minutes</div>
            <div className="v-num" style={{ fontSize: 24, color: 'var(--v-volt-text)' }}>{cStats.min}</div>
          </VoltBlock>
          <VoltBlock style={{ flex: 1, padding: '16px 14px' }}>
            <div style={statLabel}>Cals Burned</div>
            <div className="v-num" style={{ fontSize: 24, color: 'var(--v-coral-text)' }}>{cStats.cals}</div>
          </VoltBlock>
        </div>

        <VoltBlock>
          <VoltLabel volt>Log Activity</VoltLabel>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, margin: '13px 0 12px' }}>
            <select value={cType} onChange={e => setCType(e.target.value)} style={inputStyle}>
              {['Running', 'Cycling', 'Swimming', 'Walking', 'HIIT', 'Rowing', 'Other'].map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <input type="number" placeholder="Mins" value={cMins} onChange={e => setCMins(e.target.value)} style={inputStyle} />
            <input type="number" placeholder="Dist (km)" value={cDist} onChange={e => setCDist(e.target.value)} style={inputStyle} />
            <input type="number" placeholder="Kcal" value={cCals} onChange={e => setCCals(e.target.value)} style={inputStyle} />
          </div>
          <VoltPill onClick={handleLogCardio} style={{ width: '100%' }}>Log Cardio Activity</VoltPill>
        </VoltBlock>

        {userCardioLogs.length === 0 ? (
          <VoltBlock>
            <p style={{ textAlign: 'center', color: 'var(--v-dim)', fontSize: 14, padding: '16px 0', lineHeight: 1.6 }}>
              <strong style={{ color: 'var(--v-ink)', display: 'block', fontSize: 16, marginBottom: 4 }}>No Cardio Logged</strong>
              Track your endurance and aerobic sessions
            </p>
          </VoltBlock>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {userCardioLogs.map(c => (
              <VoltBlock key={c.id} style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, minWidth: 0 }}>
                    <div style={{ width: 48, height: 48, borderRadius: 12, border: '2px solid var(--v-edge-quiet)', background: 'var(--v-canvas)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <span style={{ fontSize: 9.5, color: 'var(--v-dim)', textTransform: 'uppercase', fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>{new Date(c.date).toLocaleDateString('en-US', { month: 'short' })}</span>
                      <span className="v-num" style={{ fontSize: 16, lineHeight: 1.1 }}>{new Date(c.date).getDate()}</span>
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--v-ink)', display: 'flex', alignItems: 'center', gap: 7 }}>
                        {c.type}
                        {c.source === 'strava' && (
                          <span style={{ fontSize: 9, background: '#FC4C02', color: '#fff', padding: '2px 6px', borderRadius: 4, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 800 }}>Strava</span>
                        )}
                      </div>
                      <div style={{ fontSize: 12.5, color: 'var(--v-dim)', marginTop: 2 }}>{c.minutes} mins{c.distance ? ` · ${c.distance} km` : ''}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
                    <span style={{ fontSize: 13.5, fontWeight: 800, color: 'var(--v-coral-text)' }}>{c.calories} kcal</span>
                    <button type="button" className="v-press" aria-label="Delete cardio session" onClick={() => deleteCardio(c.id)} style={{ background: 'none', border: 'none', color: 'var(--v-dim)', cursor: 'pointer', padding: 6, display: 'flex' }}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </VoltBlock>
            ))}
          </div>
        )}
      </>)}

      {editLog && (
        <VoltEditWorkoutModal
          log={editLog}
          splits={splits}
          onSave={async (updatedLog) => {
            await updateWorkoutLog(updatedLog.id, updatedLog);
            addToast('Workout updated', 'success');
          }}
          onClose={() => setEditLog(null)}
        />
      )}

      <VoltConfirmDialog open={!!confirm} title={confirm?.title} message={confirm?.message} onConfirm={confirm?.onConfirm} onCancel={() => setConfirm(null)} confirmLabel={confirm?.confirmLabel} danger={confirm?.danger} />
    </div>
  );
}
