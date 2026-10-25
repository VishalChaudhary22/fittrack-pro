import { ChevronDown, X, Edit2, Trash2, Check, Dumbbell, AlertCircle } from 'lucide-react';
import { useSplits } from '../../../core/hooks/useSplits';
import { ConfirmDialog } from '../../v1/shared/SharedComponents';
import { VoltBlock, VoltPill, VoltLabel } from '../primitives';

// ─── Kaaya Volt · Splits (V-6a) ─────────────────────────────────────────────
// Same logic core as V1 (useSplits), Volt presentation. ConfirmDialog is
// V1's shared component (Volt skin = V-7 popup pack). One deliberate
// completion: V1's New Split modal exists but has NO trigger anywhere in
// V1 (setAddSp(true) is never called) — Volt wires it to an admin-only
// button below the list, matching the modal's evident intent.

const inputStyle = {
  width: '100%', padding: '11px 13px', borderRadius: 12, fontSize: 14,
  background: 'var(--v-canvas)', color: 'var(--v-ink)',
  border: '2px solid var(--v-edge-quiet)', outline: 'none', fontFamily: 'inherit',
};
const labelStyle = {
  display: 'block', fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5,
  letterSpacing: '0.14em', color: 'var(--v-dim)', marginBottom: 6, textTransform: 'uppercase',
};

function TierSeg({ TIERS, value, onChange }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <div style={{ display: 'flex', background: 'var(--v-panel)', border: '2.5px solid var(--v-edge)', borderRadius: 999, padding: 4, gap: 4, width: '100%', maxWidth: 520 }}>
        {TIERS.map(t => (
          <button
            key={t.key}
            type="button"
            onClick={() => onChange(t.key)}
            style={{
              flex: 1, padding: '10px 6px', borderRadius: 999, border: 'none', cursor: 'pointer',
              fontFamily: "'Archivo', sans-serif", fontSize: 12.5, fontWeight: 800, whiteSpace: 'nowrap',
              background: value === t.key ? 'var(--v-volt)' : 'transparent',
              color: value === t.key ? '#141416' : 'var(--v-dim)',
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

export default function VoltSplitsPage() {
  const {
    ICON_MAP, TIERS, activeSplitRef, activeTier, activeTierObj, addEx, addExFn,
    addSp, addSpFn, confirm, delEx, editEx, exp, expDay, getIcon, isAdmin,
    navigate, newEx, ns, pick, setActiveTier, setAddEx, setAddSp, setEditEx,
    setExp, setExpDay, setNewEx, setNs, tieredSplits, updEx, user,
  } = useSplits();

  return (
    <div className="v-screen" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <header className="v-rise" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 12 }}>
        <div>
          <VoltLabel volt>Training Splits — choose your level</VoltLabel>
          <h1 className="v-num" style={{ fontSize: 'clamp(1.9rem, 7vw, 2.8rem)', lineHeight: 1, margin: '8px 0 0', textTransform: 'uppercase' }}>Pick your program</h1>
        </div>
        <VoltPill onClick={() => navigate('/split-builder')} style={{ minHeight: 48, padding: '0 20px', fontSize: 14, flexShrink: 0 }}>+ Custom Split</VoltPill>
      </header>

      <TierSeg TIERS={TIERS} value={activeTier} onChange={setActiveTier} />

      {activeTierObj && (
        <VoltBlock>
          <VoltLabel volt>{activeTierObj.key} tier</VoltLabel>
          <div className="v-num" style={{ fontSize: 22, marginTop: 8 }}>“{activeTierObj.tagline}”</div>
          <p style={{ fontSize: 13.5, color: 'var(--v-dim)', marginTop: 6, lineHeight: 1.55 }}>{activeTierObj.desc}</p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 14 }}>
            <span className="v-chip">{activeTierObj.weeks}</span>
            <span className="v-chip">45–60 min/session</span>
            {activeTier === 'advanced' && (
              <span className="v-chip" style={{ color: 'var(--v-coral-text)', display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                <AlertCircle size={12} /> Requires 2+ yrs training
              </span>
            )}
          </div>
        </VoltBlock>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {tieredSplits.map(split => {
          const isActive = user.activeSplitId === split.id;
          const I = getIcon(split.icon);
          const open = exp === split.id;
          return (
            <div key={split.id} ref={isActive ? activeSplitRef : null}>
              <VoltBlock hero={isActive} style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 18px' }}>
                  <span style={{
                    width: 44, height: 44, borderRadius: 13, flexShrink: 0,
                    background: isActive ? 'var(--v-volt)' : 'var(--v-canvas)',
                    border: '2px solid var(--v-edge)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <I size={19} color={isActive ? '#141416' : 'var(--v-dim)'} />
                  </span>
                  <button type="button" className="v-press" onClick={() => setExp(open ? null : split.id)} style={{ flex: 1, minWidth: 0, textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                    <span className="v-num" style={{ display: 'block', fontSize: 17, color: isActive ? 'var(--v-volt-text)' : 'var(--v-ink)', textTransform: 'uppercase' }}>{split.name}</span>
                    <span style={{ display: 'block', fontSize: 13, color: 'var(--v-dim)', marginTop: 2 }}>{split.description}</span>
                  </button>
                  {split.comingSoon ? (
                    <span className="v-chip">Soon</span>
                  ) : isActive ? (
                    <span className="v-chip" style={{ background: 'var(--v-volt)', color: '#141416', display: 'inline-flex', alignItems: 'center', gap: 4 }}><Check size={11} /> Active</span>
                  ) : (
                    <VoltPill onClick={() => pick(split)} style={{ minHeight: 44, padding: '0 18px', fontSize: 13.5 }}>Select</VoltPill>
                  )}
                  <button type="button" className="v-press" aria-label="Expand split" onClick={() => setExp(open ? null : split.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6, display: 'flex' }}>
                    <ChevronDown size={16} color="var(--v-dim)" style={{ transform: open ? 'rotate(180deg)' : '', transition: 'transform 0.2s' }} />
                  </button>
                </div>

                {open && !split.comingSoon && (
                  <div style={{ padding: '0 18px 18px' }}>
                    {split.tierDescription && (
                      <p style={{ fontSize: 13, color: 'var(--v-dim)', lineHeight: 1.55, background: 'var(--v-canvas)', border: '2px solid var(--v-edge-quiet)', borderRadius: 10, padding: '10px 12px', marginBottom: 14 }}>{split.tierDescription}</p>
                    )}
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
                      {split.schedule.map((d, i) => (
                        <span key={i} className="v-chip" style={d === 'Rest' ? undefined : { color: 'var(--v-volt-text)' }}>D{i + 1}: {d}</span>
                      ))}
                    </div>
                    {split.days.filter(d => d.type !== 'rest').map(day => (
                      <div key={day.id} style={{ border: '2px solid var(--v-edge-quiet)', borderRadius: 14, marginBottom: 10, overflow: 'hidden' }}>
                        <button type="button" onClick={() => setExpDay(expDay === day.id ? null : day.id)} style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', background: 'var(--v-canvas)', border: 'none', cursor: 'pointer' }}>
                          <span style={{ display: 'flex', gap: 8, alignItems: 'center', minWidth: 0 }}>
                            <span className="v-chip" style={{ fontSize: 9.5, padding: '4px 8px' }}>{day.subtype || day.type}</span>
                            <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--v-ink)' }}>{day.name}</span>
                            <span style={{ fontSize: 11.5, color: 'var(--v-dim)' }}>{day.exercises.length} ex</span>
                          </span>
                          <ChevronDown size={14} color="var(--v-dim)" style={{ transform: expDay === day.id ? 'rotate(180deg)' : '', transition: 'transform 0.2s' }} />
                        </button>
                        {expDay === day.id && (
                          <div style={{ padding: '4px 14px 14px' }}>
                            {day.exercises.map(ex => (
                              <div key={ex.id} style={{ padding: '9px 0', borderBottom: '1.5px solid var(--v-edge-quiet)' }}>
                                {editEx === ex.id && isAdmin ? (
                                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 6 }}>
                                    <input value={ex.name} onChange={e => updEx(split.id, day.id, ex.id, { name: e.target.value })} style={{ ...inputStyle, padding: '8px 10px', fontSize: 13 }} />
                                    <input type="number" value={ex.sets} onChange={e => updEx(split.id, day.id, ex.id, { sets: parseInt(e.target.value) })} style={{ ...inputStyle, padding: '8px 10px', fontSize: 13 }} />
                                    <input value={ex.repsRange} onChange={e => updEx(split.id, day.id, ex.id, { repsRange: e.target.value })} style={{ ...inputStyle, padding: '8px 10px', fontSize: 13 }} />
                                    <input value={ex.primaryMuscle || ex.muscle} onChange={e => updEx(split.id, day.id, ex.id, { primaryMuscle: e.target.value })} style={{ ...inputStyle, padding: '8px 10px', fontSize: 13 }} />
                                  </div>
                                ) : (
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                                    <div style={{ minWidth: 0 }}>
                                      <span style={{ fontWeight: 700, fontSize: 13.5, color: 'var(--v-ink)' }}>{ex.name}</span>
                                      {ex.variants && <span style={{ fontSize: 10.5, color: 'var(--v-dim)', marginLeft: 6 }}>(options)</span>}
                                      <span style={{ fontSize: 12.5, color: 'var(--v-dim)', marginLeft: 8 }}>{ex.sets}×{ex.repsRange}</span>
                                      {(ex.primaryMuscle || ex.muscle) && <span style={{ fontSize: 11, color: 'var(--v-dim)', marginLeft: 8 }}>{ex.primaryMuscle || ex.muscle}</span>}
                                    </div>
                                    {isAdmin && (
                                      <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                                        <button type="button" className="v-press" aria-label="Edit exercise" onClick={() => setEditEx(editEx === ex.id ? null : ex.id)} style={{ minWidth: 36, height: 36, borderRadius: 10, border: '2px solid var(--v-edge-quiet)', background: 'var(--v-panel)', color: 'var(--v-ink)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{editEx === ex.id ? '✓' : <Edit2 size={13} />}</button>
                                        <button type="button" className="v-press" aria-label="Delete exercise" onClick={() => delEx(split.id, day.id, ex.id)} style={{ minWidth: 36, height: 36, borderRadius: 10, border: '2px solid var(--v-edge-quiet)', background: 'var(--v-panel)', color: 'var(--v-coral-text)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Trash2 size={13} /></button>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            ))}
                            {isAdmin && (addEx === day.id ? (
                              <div style={{ marginTop: 12, display: 'grid', gap: 8 }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 8 }}>
                                  <input placeholder="Exercise" value={newEx.name} onChange={e => setNewEx(p => ({ ...p, name: e.target.value }))} style={{ ...inputStyle, fontSize: 13 }} />
                                  <input type="number" placeholder="Sets" value={newEx.sets} onChange={e => setNewEx(p => ({ ...p, sets: e.target.value }))} style={{ ...inputStyle, fontSize: 13 }} />
                                  <input placeholder="8-12" value={newEx.repsRange} onChange={e => setNewEx(p => ({ ...p, repsRange: e.target.value }))} style={{ ...inputStyle, fontSize: 13 }} />
                                </div>
                                <input placeholder="Muscle group" value={newEx.muscle} onChange={e => setNewEx(p => ({ ...p, muscle: e.target.value }))} style={{ ...inputStyle, fontSize: 13 }} />
                                <div style={{ display: 'flex', gap: 8 }}>
                                  <VoltPill onClick={() => addExFn(split.id, day.id)} style={{ minHeight: 44, padding: '0 20px', fontSize: 13.5 }}>Add</VoltPill>
                                  <VoltPill ghost onClick={() => setAddEx(null)} style={{ minHeight: 44, padding: '0 20px', fontSize: 13.5 }}>Cancel</VoltPill>
                                </div>
                              </div>
                            ) : (
                              <VoltPill ghost onClick={() => setAddEx(day.id)} style={{ width: '100%', minHeight: 44, marginTop: 12, fontSize: 13 }}>+ Add Exercise</VoltPill>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                    {!isActive && (
                      <VoltPill onClick={() => pick(split)} style={{ width: '100%', marginTop: 6 }}>Select & Start Tracking →</VoltPill>
                    )}
                  </div>
                )}

                {open && split.comingSoon && (
                  <div style={{ padding: '30px 20px 34px', textAlign: 'center' }}>
                    <Dumbbell size={40} color="var(--v-dim)" style={{ marginBottom: 14 }} />
                    <div className="v-num" style={{ fontSize: 22, color: 'var(--v-volt-text)', textTransform: 'uppercase' }}>Coming Soon</div>
                    <p style={{ color: 'var(--v-dim)', fontSize: 13.5, marginTop: 8, lineHeight: 1.55 }}>Powerlifting programming with Squat, Bench & Deadlift cycles is in development.</p>
                  </div>
                )}
              </VoltBlock>
            </div>
          );
        })}
        {tieredSplits.length === 0 && (
          <VoltBlock>
            <p style={{ textAlign: 'center', color: 'var(--v-dim)', fontSize: 14, padding: '14px 0' }}>No splits available in this tier yet.</p>
          </VoltBlock>
        )}
      </div>

      {isAdmin && !addSp && (
        <VoltPill ghost onClick={() => setAddSp(true)} style={{ width: '100%' }}>+ New Split</VoltPill>
      )}

      {addSp && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 80, background: 'rgba(6,8,6,0.55)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }} onClick={() => setAddSp(false)}>
          <div className="v-sheet-up" onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: 480, background: 'var(--v-panel)', border: '2.5px solid var(--v-edge)', borderBottom: 'none', borderRadius: '22px 22px 0 0', padding: '20px 20px 30px', maxHeight: '86vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <span className="v-num" style={{ fontSize: 19, textTransform: 'uppercase' }}>New Split</span>
              <button type="button" className="v-press" aria-label="Close" onClick={() => setAddSp(false)} style={{ width: 40, height: 40, borderRadius: 12, border: '2px solid var(--v-edge-quiet)', background: 'var(--v-canvas)', color: 'var(--v-ink)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={16} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={labelStyle}>Name</label>
                <input placeholder="e.g. Bro Split" value={ns.name} onChange={e => setNs(p => ({ ...p, name: e.target.value }))} style={inputStyle} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '110px 1fr', gap: 12 }}>
                <div>
                  <label style={labelStyle}>Icon</label>
                  <select value={ns.icon} onChange={e => setNs(p => ({ ...p, icon: e.target.value }))} style={inputStyle}>
                    {Object.keys(ICON_MAP).map(k => <option key={k} value={k}>{k}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Description</label>
                  <input placeholder="5 days/week..." value={ns.description} onChange={e => setNs(p => ({ ...p, description: e.target.value }))} style={inputStyle} />
                </div>
              </div>
              <VoltPill onClick={addSpFn} style={{ width: '100%', marginTop: 4 }}>Create Split</VoltPill>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog open={!!confirm} title={confirm?.title} message={confirm?.message} onConfirm={confirm?.onConfirm} onCancel={confirm?.onCancel} confirmLabel={confirm?.confirmLabel} danger={confirm?.danger} />
    </div>
  );
}
