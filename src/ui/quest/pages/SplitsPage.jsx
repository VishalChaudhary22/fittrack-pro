import { useState } from 'react';
import { Portal } from '../../v1/shared/SharedComponents';
import { useSplits } from '../../../core/hooks/useSplits';
import { QuestConfirmDialog } from '../shared/QuestShared';
import { QuestBlock, QuestBtn, QuestChip, QuestLabel } from '../primitives';
import PixelSprite from '../PixelSprite';

// ─── Kaaya Quest · Splits — cartridge select (plan §7.5, Q-6) ───────────────
// Same brain as V1/Volt (useSplits), Quest presentation: each split is a
// game cartridge, the active one is INSERTED (volt frame + chip), tiers are
// cartridge tabs. Split icons are lucide components in the shared data, so
// Quest maps the icon names to pixel sprites instead. Admin flows (edit /
// add / delete exercise, new split) mirror Volt exactly, in slot styling.

const SPLIT_SPRITES = {
  Repeat: 'dots', Zap: 'bolt', Target: 'chevR', Dumbbell: 'dumbbell',
  Trophy: 'trophy', Home: 'home', Award: 'crown', Flame: 'flame',
};
const TIER_SPRITES = { beginner: 'star', intermediate: 'bolt', advanced: 'flame', specialty: 'grid' };

const qSelect = {
  width: '100%', minHeight: 48, padding: '8px 12px', background: 'var(--q-slot)',
  border: '3px solid var(--q-border)', color: 'var(--q-ink)',
  fontFamily: "'VT323', monospace", fontSize: 19, boxSizing: 'border-box',
};

export default function SplitsPage() {
  const {
    ICON_MAP, TIERS, activeSplitRef, activeTier, activeTierObj, addEx, addExFn,
    addSp, addSpFn, confirm, delEx, editEx, exp, expDay, isAdmin,
    navigate, newEx, ns, pick, setActiveTier, setAddEx, setAddSp, setEditEx,
    setExp, setExpDay, setNewEx, setNs, tieredSplits, updEx, user,
  } = useSplits();

  // useSplits' delete-exercise confirm carries no onCancel (same as Volt);
  // track dismissal locally so the dialog can always be closed.
  const [hiddenConfirm, setHiddenConfirm] = useState(null);
  const confirmOpen = !!confirm && confirm !== hiddenConfirm;

  return (
    <div className="q-screen" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 12 }}>
        <div>
          <QuestLabel tone="volt">Training Splits — Choose Your Level</QuestLabel>
          <h1 className="q-ps" style={{ fontSize: 'clamp(19px, 6vw, 30px)', lineHeight: 1.35, margin: '10px 0 0' }}>SELECT CARTRIDGE</h1>
        </div>
        <QuestBtn onClick={() => navigate('/split-builder')} style={{ flexShrink: 0 }}>+ CUSTOM</QuestBtn>
      </header>

      {/* Tier cartridge tabs */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        {TIERS.map(t => (
          <button
            key={t.key}
            type="button"
            onClick={() => setActiveTier(t.key)}
            className="q-btn q-btn--sm"
            style={activeTier === t.key
              ? { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }
              : { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: 'var(--q-panel)', color: 'var(--q-dim)', boxShadow: '4px 4px 0 rgba(0,0,0,0.45)' }}
          >
            <PixelSprite name={TIER_SPRITES[t.key]} size={14} />
            {t.label.toUpperCase()}
          </button>
        ))}
      </div>

      {activeTierObj && (
        <QuestBlock>
          <QuestLabel tone="volt">{activeTierObj.key} tier</QuestLabel>
          <div className="q-ps" style={{ fontSize: 14, lineHeight: 1.6, marginTop: 9 }}>“{activeTierObj.tagline.toUpperCase()}”</div>
          <p style={{ fontSize: 19, color: 'var(--q-dim)', marginTop: 7, lineHeight: 1.45 }}>{activeTierObj.desc}</p>
          <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', marginTop: 13 }}>
            <QuestChip>{activeTierObj.weeks}</QuestChip>
            <QuestChip>45–60 min/session</QuestChip>
            {activeTier === 'advanced' && (
              <QuestChip tone="ember">! REQUIRES 2+ YRS TRAINING</QuestChip>
            )}
          </div>
        </QuestBlock>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {tieredSplits.map(split => {
          const isActive = user.activeSplitId === split.id;
          const open = exp === split.id;
          return (
            <div key={split.id} ref={isActive ? activeSplitRef : null}>
              <QuestBlock style={isActive ? { borderColor: 'var(--q-volt)', padding: 0, overflow: 'hidden' } : { padding: 0, overflow: 'hidden' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '15px 16px' }}>
                  <span style={{
                    width: 46, height: 46, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: isActive ? 'var(--q-volt)' : 'var(--q-slot)', border: '3px solid var(--q-border)',
                  }}>
                    <PixelSprite name={SPLIT_SPRITES[split.icon] || 'dumbbell'} size={22} />
                  </span>
                  <button type="button" onClick={() => setExp(open ? null : split.id)} style={{ flex: 1, minWidth: 0, textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: 'var(--q-ink)' }}>
                    <span className="q-ps" style={{ display: 'block', fontSize: 13, lineHeight: 1.5, color: isActive ? 'var(--q-volt-text)' : 'var(--q-ink)' }}>{split.name.toUpperCase()}</span>
                    <span style={{ display: 'block', fontSize: 18, color: 'var(--q-dim)', marginTop: 3, lineHeight: 1.35 }}>{split.description}</span>
                  </button>
                  {split.comingSoon ? (
                    <QuestChip>SOON</QuestChip>
                  ) : isActive ? (
                    <QuestChip tone="volt">▶ INSERTED</QuestChip>
                  ) : (
                    <QuestBtn sm onClick={() => pick(split)}>SELECT</QuestBtn>
                  )}
                  <button type="button" aria-label="Expand split" onClick={() => setExp(open ? null : split.id)} className="q-chip" style={{ cursor: 'pointer', padding: '8px 9px' }}>
                    <PixelSprite name="chevR" size={12} style={{ transform: open ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }} />
                  </button>
                </div>

                {open && !split.comingSoon && (
                  <div style={{ padding: '0 16px 16px' }}>
                    {split.tierDescription && (
                      <p style={{ fontSize: 18, color: 'var(--q-dim)', lineHeight: 1.5, background: 'var(--q-slot)', border: '3px solid var(--q-border)', padding: '10px 12px', margin: '0 0 14px' }}>{split.tierDescription}</p>
                    )}
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
                      {split.schedule.map((d, i) => (
                        <QuestChip key={i} tone={d === 'Rest' ? undefined : 'volt'}>D{i + 1}: {d}</QuestChip>
                      ))}
                    </div>
                    {split.days.filter(d => d.type !== 'rest').map(day => (
                      <QuestBlock key={day.id} variant="slot" flat style={{ marginBottom: 10, padding: 0, overflow: 'hidden' }}>
                        <button type="button" onClick={() => setExpDay(expDay === day.id ? null : day.id)} style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '11px 13px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--q-ink)' }}>
                          <span style={{ display: 'flex', gap: 8, alignItems: 'center', minWidth: 0 }}>
                            <QuestChip>{day.subtype || day.type}</QuestChip>
                            <span style={{ fontWeight: 700, fontSize: 19 }}>{day.name}</span>
                            <span className="q-meta">{day.exercises.length} ex</span>
                          </span>
                          <PixelSprite name="chevR" size={12} style={{ transform: expDay === day.id ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }} />
                        </button>
                        {expDay === day.id && (
                          <div style={{ padding: '2px 13px 13px' }}>
                            {day.exercises.map(ex => (
                              <div key={ex.id} style={{ padding: '9px 0', borderBottom: '2px solid var(--q-panel2)' }}>
                                {editEx === ex.id && isAdmin ? (
                                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 6 }}>
                                    <input className="q-slot-input" value={ex.name} onChange={e => updEx(split.id, day.id, ex.id, { name: e.target.value })} style={{ minHeight: 42, fontSize: 17 }} aria-label="Exercise name" />
                                    <input className="q-slot-input" type="number" value={ex.sets} onChange={e => updEx(split.id, day.id, ex.id, { sets: parseInt(e.target.value) })} style={{ minHeight: 42, fontSize: 17 }} aria-label="Sets" />
                                    <input className="q-slot-input" value={ex.repsRange} onChange={e => updEx(split.id, day.id, ex.id, { repsRange: e.target.value })} style={{ minHeight: 42, fontSize: 17 }} aria-label="Reps range" />
                                    <input className="q-slot-input" value={ex.primaryMuscle || ex.muscle} onChange={e => updEx(split.id, day.id, ex.id, { primaryMuscle: e.target.value })} style={{ minHeight: 42, fontSize: 17 }} aria-label="Muscle" />
                                  </div>
                                ) : (
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                                    <div style={{ minWidth: 0, fontSize: 18, lineHeight: 1.4 }}>
                                      <span style={{ fontWeight: 700 }}>{ex.name}</span>
                                      {ex.variants && <span style={{ color: 'var(--q-dim)', marginLeft: 6 }}>(options)</span>}
                                      <span style={{ color: 'var(--q-dim)', marginLeft: 8 }}>{ex.sets}×{ex.repsRange}</span>
                                      {(ex.primaryMuscle || ex.muscle) && <span style={{ color: 'var(--q-dim)', marginLeft: 8 }}>{ex.primaryMuscle || ex.muscle}</span>}
                                    </div>
                                    {isAdmin && (
                                      <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                                        <button type="button" className="q-chip" aria-label="Edit exercise" onClick={() => setEditEx(editEx === ex.id ? null : ex.id)} style={{ cursor: 'pointer', padding: '7px 9px' }}>
                                          <PixelSprite name={editEx === ex.id ? 'check' : 'dots'} size={13} />
                                        </button>
                                        <button type="button" className="q-chip" aria-label="Delete exercise" onClick={() => delEx(split.id, day.id, ex.id)} style={{ cursor: 'pointer', padding: '7px 9px' }}>
                                          <PixelSprite name="x" size={13} />
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            ))}
                            {isAdmin && (addEx === day.id ? (
                              <div style={{ marginTop: 12, display: 'grid', gap: 8 }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 8 }}>
                                  <input className="q-slot-input" placeholder="Exercise" value={newEx.name} onChange={e => setNewEx(p => ({ ...p, name: e.target.value }))} style={{ fontSize: 18 }} />
                                  <input className="q-slot-input" type="number" placeholder="Sets" value={newEx.sets} onChange={e => setNewEx(p => ({ ...p, sets: e.target.value }))} style={{ fontSize: 18 }} />
                                  <input className="q-slot-input" placeholder="8-12" value={newEx.repsRange} onChange={e => setNewEx(p => ({ ...p, repsRange: e.target.value }))} style={{ fontSize: 18 }} />
                                </div>
                                <input className="q-slot-input" placeholder="Muscle group" value={newEx.muscle} onChange={e => setNewEx(p => ({ ...p, muscle: e.target.value }))} style={{ fontSize: 18 }} />
                                <div style={{ display: 'flex', gap: 8 }}>
                                  <QuestBtn sm onClick={() => addExFn(split.id, day.id)}>ADD</QuestBtn>
                                  <QuestBtn sm tone="ghost" onClick={() => setAddEx(null)}>CANCEL</QuestBtn>
                                </div>
                              </div>
                            ) : (
                              <QuestBtn sm tone="ghost" onClick={() => setAddEx(day.id)} style={{ width: '100%', marginTop: 12 }}>+ ADD EXERCISE</QuestBtn>
                            ))}
                          </div>
                        )}
                      </QuestBlock>
                    ))}
                    {!isActive && (
                      <QuestBtn onClick={() => pick(split)} style={{ width: '100%', marginTop: 6 }}>SELECT &amp; START TRACKING ▶</QuestBtn>
                    )}
                  </div>
                )}

                {open && split.comingSoon && (
                  <div style={{ padding: '28px 20px 32px', textAlign: 'center' }}>
                    <PixelSprite name="dumbbell" size={40} style={{ marginBottom: 12, opacity: 0.75 }} />
                    <div className="q-ps" style={{ fontSize: 14, color: 'var(--q-volt-text)' }}>COMING SOON</div>
                    <p style={{ color: 'var(--q-dim)', fontSize: 18, marginTop: 9, lineHeight: 1.5 }}>Powerlifting programming with Squat, Bench &amp; Deadlift cycles is in development.</p>
                  </div>
                )}
              </QuestBlock>
            </div>
          );
        })}
        {tieredSplits.length === 0 && (
          <QuestBlock>
            <p style={{ textAlign: 'center', color: 'var(--q-dim)', fontSize: 19, padding: '14px 0' }}>No cartridges available in this tier yet.</p>
          </QuestBlock>
        )}
      </div>

      {isAdmin && !addSp && (
        <QuestBtn tone="ghost" onClick={() => setAddSp(true)} style={{ width: '100%' }}>+ NEW SPLIT</QuestBtn>
      )}

      {addSp && (
        <Portal>
          <div className="q-sheet-wrap" onClick={() => setAddSp(false)}>
            <div className="q-sheet" role="dialog" aria-label="New split" onClick={e => e.stopPropagation()}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <span className="q-ps" style={{ fontSize: 14 }}>NEW SPLIT</span>
                <button type="button" className="q-chip" aria-label="Close" onClick={() => setAddSp(false)} style={{ cursor: 'pointer', padding: '7px 9px' }}>
                  <PixelSprite name="x" size={13} />
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <QuestLabel>Name</QuestLabel>
                  <input className="q-slot-input" placeholder="e.g. Bro Split" value={ns.name} onChange={e => setNs(p => ({ ...p, name: e.target.value }))} style={{ marginTop: 7 }} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '110px 1fr', gap: 12 }}>
                  <div>
                    <QuestLabel>Icon</QuestLabel>
                    <select value={ns.icon} onChange={e => setNs(p => ({ ...p, icon: e.target.value }))} style={{ ...qSelect, marginTop: 7 }}>
                      {Object.keys(ICON_MAP).map(k => <option key={k} value={k}>{k}</option>)}
                    </select>
                  </div>
                  <div>
                    <QuestLabel>Description</QuestLabel>
                    <input className="q-slot-input" placeholder="5 days/week..." value={ns.description} onChange={e => setNs(p => ({ ...p, description: e.target.value }))} style={{ marginTop: 7 }} />
                  </div>
                </div>
                <QuestBtn onClick={addSpFn} style={{ width: '100%', marginTop: 2 }}>CREATE SPLIT</QuestBtn>
              </div>
            </div>
          </div>
        </Portal>
      )}

      <QuestConfirmDialog
        open={confirmOpen}
        title={confirm?.title}
        message={confirm?.message}
        onConfirm={confirm?.onConfirm}
        onCancel={() => { confirm?.onCancel?.(); setHiddenConfirm(confirm); }}
        confirmLabel={confirm?.confirmLabel}
        danger={confirm?.danger}
      />
    </div>
  );
}
