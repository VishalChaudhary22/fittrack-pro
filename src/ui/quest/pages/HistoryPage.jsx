import { useWorkoutHistory, fmtDuration, calcVolume } from '../../../core/hooks/useWorkoutHistory';
import { fmt } from '../../../utils/helpers';
import { calcAllMuscleXP } from '../../../data/muscleData';
import QuestEditWorkoutModal from '../shared/QuestEditWorkoutModal';
import { QuestConfirmDialog } from '../shared/QuestShared';
import { QuestBlock, QuestBtn, QuestChip, QuestLabel } from '../primitives';
import PixelSprite from '../PixelSprite';

// ─── Kaaya Quest · History — the QUEST LOG (plan §7.5, Q-6) ─────────────────
// Same brain as V1/Volt (useWorkoutHistory), Quest presentation: sessions
// are log entries carrying their XP (calcAllMuscleXP over the single log,
// the same maths the battle screen pays out), expanding to the set table.
// Per-session FORGE rides the shared chatbot prop, as in Volt.

const qSelect = {
  minHeight: 48, padding: '8px 12px', background: 'var(--q-slot)',
  border: '3px solid var(--q-border)', color: 'var(--q-ink)',
  fontFamily: "'VT323', monospace", fontSize: 19, boxSizing: 'border-box',
};

function sessionXP(log, splits) {
  try {
    const xp = calcAllMuscleXP([log], splits, log.userId);
    return Object.values(xp).reduce((s, v) => s + (v || 0), 0);
  } catch {
    return 0;
  }
}

export default function HistoryPage({ chatbot }) {
  const {
    activeTab, addToast, cCals, cDist, cMins, cStats, cType, confirm,
    deleteCardio, deleteLog, editLog, expandId, filterSplit,
    getSessionMuscles, handleLogCardio, monthlyStats, search, setActiveTab,
    setCCals, setCDist, setCMins, setCType, setConfirm, setEditLog,
    setExpandId, setFilterSplit, setSearch, splits, updateWorkoutLog,
    userCardioLogs, userLogs,
  } = useWorkoutHistory();

  return (
    <div className="q-screen" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <header>
        <QuestLabel tone="volt">
          History — {activeTab === 'strength' ? `${userLogs.length} sessions logged` : `${userCardioLogs.length} activities logged`}
        </QuestLabel>
        <h1 className="q-ps" style={{ fontSize: 'clamp(19px, 6vw, 30px)', lineHeight: 1.35, margin: '10px 0 0' }}>QUEST LOG</h1>
      </header>

      {/* Cartridge tabs */}
      <div style={{ display: 'flex', gap: 8 }}>
        {[{ k: 'strength', label: 'STRENGTH' }, { k: 'cardio', label: 'CARDIO' }].map(t => (
          <button
            key={t.k}
            type="button"
            onClick={() => setActiveTab(t.k)}
            className="q-btn q-btn--sm"
            style={activeTab === t.k
              ? { flex: 1 }
              : { flex: 1, background: 'var(--q-panel)', color: 'var(--q-dim)', boxShadow: '4px 4px 0 rgba(0,0,0,0.45)' }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'strength' ? (<>
        <div style={{ display: 'flex', gap: 12 }}>
          {[
            { label: 'Monthly Volume', value: monthlyStats.volumeTons, unit: 'tons' },
            { label: 'Time Active', value: monthlyStats.timeHrs, unit: 'hrs' },
            { label: 'Sessions', value: monthlyStats.sessions, unit: 'this month' },
          ].map(s => (
            <QuestBlock key={s.label} style={{ flex: 1, minWidth: 0, padding: '14px 13px' }}>
              <QuestLabel>{s.label}</QuestLabel>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginTop: 6 }}>
                <span className="q-ps" style={{ fontSize: 19, color: 'var(--q-volt-text)' }}>{s.value}</span>
                <span style={{ fontSize: 15, color: 'var(--q-dim)' }}>{s.unit}</span>
              </div>
            </QuestBlock>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <input className="q-slot-input" placeholder="Search exercises or days..." value={search} onChange={e => setSearch(e.target.value)} aria-label="Search history" style={{ flex: 1, minWidth: 0 }} />
          <select value={filterSplit} onChange={e => setFilterSplit(e.target.value)} style={{ ...qSelect, width: 'auto', maxWidth: 150 }} aria-label="Filter by split">
            <option value="">All Splits</option>
            {splits.filter(s => !s.comingSoon).map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>

        {userLogs.length === 0 ? (
          <QuestBlock>
            <div style={{ textAlign: 'center', padding: '18px 0' }}>
              <PixelSprite name="skull" size={34} style={{ marginBottom: 12, opacity: 0.8 }} />
              <div className="q-ps" style={{ fontSize: 13 }}>NO QUESTS LOGGED</div>
              <p style={{ color: 'var(--q-dim)', fontSize: 19, marginTop: 8, lineHeight: 1.5 }}>Start logging workouts to see your history here</p>
            </div>
          </QuestBlock>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {userLogs.map(log => {
              const vol = calcVolume(log.exercises);
              const muscles = getSessionMuscles(log.exercises);
              const isExpanded = expandId === log.id;
              const xp = sessionXP(log, splits);
              return (
                <QuestBlock key={log.id} style={{ padding: 0, overflow: 'hidden' }}>
                  <div style={{ padding: '15px 16px 13px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 11 }}>
                      <button type="button" onClick={() => setExpandId(isExpanded ? null : log.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, textAlign: 'left', color: 'var(--q-ink)' }}>
                        <QuestLabel tone="volt">{fmt(log.date)}</QuestLabel>
                        <span className="q-ps" style={{ display: 'block', fontSize: 14, lineHeight: 1.5, marginTop: 6 }}>{(log.dayName || 'SESSION').toUpperCase()}</span>
                      </button>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        {xp > 0 && <QuestChip tone="gold">+{Math.round(xp)} XP</QuestChip>}
                        <button
                          type="button" aria-label="Ask FORGE about this session"
                          onClick={() => {
                            if (chatbot) {
                              chatbot.openChat();
                              chatbot.sendMessage(
                                `How did I do on ${log.dayName} on ${fmt(log.date)}? Any improvements?`
                              );
                            }
                          }}
                          className="q-chip"
                          style={{ cursor: 'pointer', padding: '8px 9px' }}
                        >
                          <PixelSprite name="bot" size={16} />
                        </button>
                        <button type="button" aria-label="Expand session" onClick={() => setExpandId(isExpanded ? null : log.id)} className="q-chip" style={{ cursor: 'pointer', padding: '8px 9px' }}>
                          <PixelSprite name="chevR" size={12} style={{ transform: isExpanded ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }} />
                        </button>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 16 }}>
                      {[
                        { label: 'Volume', value: vol >= 1000 ? `${(vol / 1000).toFixed(1)}k` : `${vol}`, unit: 'kg' },
                        { label: 'Duration', value: fmtDuration(log.durationMinutes), unit: '' },
                        { label: 'Exercises', value: `${log.exercises?.length || 0}`, unit: '' },
                        { label: 'Sets', value: `${log.exercises?.reduce((s, e) => s + e.sets.length, 0) || 0}`, unit: '' },
                      ].map(s => (
                        <div key={s.label} style={{ flex: 1, minWidth: 0 }}>
                          <QuestLabel>{s.label}</QuestLabel>
                          <div style={{ fontSize: 21, marginTop: 3 }}>{s.value}{s.unit && <span style={{ fontSize: 15, color: 'var(--q-dim)', marginLeft: 3 }}>{s.unit}</span>}</div>
                        </div>
                      ))}
                    </div>
                    {muscles.length > 0 && (
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 11 }}>
                        {muscles.map(m => <QuestChip key={m}>{m}</QuestChip>)}
                      </div>
                    )}
                  </div>

                  {isExpanded && (
                    <div style={{ padding: '13px 16px 16px', borderTop: '3px solid var(--q-border)' }}>
                      {log.exercises?.map((ex, i) => (
                        <div key={i} style={{ marginBottom: 12 }}>
                          <div style={{ fontWeight: 700, fontSize: 19, marginBottom: 6, color: 'var(--q-volt-text)' }}>{ex.name}</div>
                          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                            {ex.sets.map((s, j) => (
                              <QuestChip key={j}>{s.reps}R × {s.weight}KG</QuestChip>
                            ))}
                          </div>
                        </div>
                      ))}
                      {log.notes && (
                        <p style={{ fontSize: 18, color: 'var(--q-dim)', fontStyle: 'italic', marginTop: 6, padding: '10px 12px', background: 'var(--q-slot)', border: '3px solid var(--q-border)', lineHeight: 1.5 }}>{log.notes}</p>
                      )}
                      <div style={{ display: 'flex', gap: 10, marginTop: 13 }}>
                        <QuestBtn sm onClick={() => setEditLog(log)} style={{ flex: 1 }}>EDIT SESSION</QuestBtn>
                        <QuestBtn sm tone="ember" onClick={() => deleteLog(log.id)} style={{ flex: 1 }}>DELETE</QuestBtn>
                      </div>
                    </div>
                  )}
                </QuestBlock>
              );
            })}
          </div>
        )}

        {userLogs.length >= 10 && (
          <div style={{ textAlign: 'center', padding: '6px 0' }}>
            <QuestLabel>Show previous sessions</QuestLabel>
          </div>
        )}
      </>) : (<>
        <div style={{ display: 'flex', gap: 12 }}>
          <QuestBlock style={{ flex: 1, padding: '14px 13px' }}>
            <QuestLabel>Total Minutes</QuestLabel>
            <div className="q-ps" style={{ fontSize: 19, color: 'var(--q-volt-text)', marginTop: 6 }}>{cStats.min}</div>
          </QuestBlock>
          <QuestBlock style={{ flex: 1, padding: '14px 13px' }}>
            <QuestLabel>Cals Burned</QuestLabel>
            <div className="q-ps" style={{ fontSize: 19, color: 'var(--q-ember-text)', marginTop: 6 }}>{cStats.cals}</div>
          </QuestBlock>
        </div>

        <QuestBlock>
          <QuestLabel tone="volt">Log Activity</QuestLabel>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, margin: '12px 0' }}>
            <select value={cType} onChange={e => setCType(e.target.value)} style={qSelect} aria-label="Cardio type">
              {['Running', 'Cycling', 'Swimming', 'Walking', 'HIIT', 'Rowing', 'Other'].map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <input className="q-slot-input" type="number" placeholder="Mins" value={cMins} onChange={e => setCMins(e.target.value)} aria-label="Minutes" />
            <input className="q-slot-input" type="number" placeholder="Dist (km)" value={cDist} onChange={e => setCDist(e.target.value)} aria-label="Distance in km" />
            <input className="q-slot-input" type="number" placeholder="Kcal" value={cCals} onChange={e => setCCals(e.target.value)} aria-label="Calories" />
          </div>
          <QuestBtn onClick={handleLogCardio} style={{ width: '100%' }}>LOG CARDIO ACTIVITY</QuestBtn>
        </QuestBlock>

        {userCardioLogs.length === 0 ? (
          <QuestBlock>
            <div style={{ textAlign: 'center', padding: '18px 0' }}>
              <div className="q-ps" style={{ fontSize: 13 }}>NO CARDIO LOGGED</div>
              <p style={{ color: 'var(--q-dim)', fontSize: 19, marginTop: 8, lineHeight: 1.5 }}>Track your endurance and aerobic sessions</p>
            </div>
          </QuestBlock>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {userCardioLogs.map(c => (
              <QuestBlock key={c.id} style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '13px 15px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 13, minWidth: 0 }}>
                    <div style={{ width: 48, height: 48, border: '3px solid var(--q-border)', background: 'var(--q-slot)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <span style={{ fontSize: 13, color: 'var(--q-dim)', textTransform: 'uppercase', lineHeight: 1 }}>{new Date(c.date).toLocaleDateString('en-US', { month: 'short' })}</span>
                      <span style={{ fontSize: 20, lineHeight: 1.15 }}>{new Date(c.date).getDate()}</span>
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 19, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 7 }}>
                        {c.type}
                        {c.source === 'strava' && (
                          <span style={{ fontSize: 12, background: '#FC4C02', color: '#fff', padding: '2px 6px', textTransform: 'uppercase', fontWeight: 700 }}>Strava</span>
                        )}
                      </div>
                      <div style={{ fontSize: 17, color: 'var(--q-dim)', marginTop: 2 }}>{c.minutes} mins{c.distance ? ` · ${c.distance} km` : ''}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 11, flexShrink: 0 }}>
                    <span style={{ fontSize: 18, fontWeight: 700, color: 'var(--q-ember-text)' }}>{c.calories} kcal</span>
                    <button type="button" aria-label="Delete cardio session" onClick={() => deleteCardio(c.id)} className="q-chip" style={{ cursor: 'pointer', padding: '7px 9px' }}>
                      <PixelSprite name="x" size={13} />
                    </button>
                  </div>
                </div>
              </QuestBlock>
            ))}
          </div>
        )}
      </>)}

      {editLog && (
        <QuestEditWorkoutModal
          log={editLog}
          splits={splits}
          onSave={async (updatedLog) => {
            await updateWorkoutLog(updatedLog.id, updatedLog);
            addToast('Workout updated', 'success');
          }}
          onClose={() => setEditLog(null)}
        />
      )}

      <QuestConfirmDialog open={!!confirm} title={confirm?.title} message={confirm?.message} onConfirm={confirm?.onConfirm} onCancel={() => setConfirm(null)} confirmLabel={confirm?.confirmLabel} danger={confirm?.danger} />
    </div>
  );
}
