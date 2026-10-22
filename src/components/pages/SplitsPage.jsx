import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dumbbell, Repeat, Zap, Target, Trophy, Home, Award, Flame, Sprout, Wrench } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ConfirmDialog, ModalPortal } from '../shared/SharedComponents';
import { Screen, Sec, LedgerRow, Action, TLink } from '../shared/Margin';
import { gId } from '../../utils/helpers';
import { useScrollRestoration } from '../../hooks/useScrollRestoration';

export default function SplitsPage() {
  useScrollRestoration('/splits');
  const { user, splits, setSplits, setActiveSplitId, addToast, workoutLogs } = useApp();
  const navigate = useNavigate();
  const isAdmin = user.isAdmin;
  
  const [activeTier, setActiveTier] = useState(() => {
    const activeSplit = splits.find(s => s.id === user.activeSplitId);
    return activeSplit?.tier || 'intermediate';
  });

  const [exp, setExp] = useState(null);
  const [expDay, setExpDay] = useState(null);
  const [editEx, setEditEx] = useState(null);
  const [addEx, setAddEx] = useState(null);
  const [newEx, setNewEx] = useState({ name: '', sets: 3, repsRange: '8-12', muscle: '', notes: '' });
  const [addSp, setAddSp] = useState(false);
  const [ns, setNs] = useState({ name: '', icon: 'Dumbbell', description: '' });

  // icons are still stored on splits (they drive the picker in the new-split
  // sheet) but MARGIN doesn't render glyphs in section headers
  const ICON_MAP = { Repeat, Zap, Target, Dumbbell, Trophy, Home, Award, Flame };
  const [confirm, setConfirm] = useState(null);

  const activeSplitRef = useRef(null);

  useEffect(() => {
    if (activeSplitRef.current) {
      activeSplitRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [activeTier]);

  const TIERS = [
    { key: 'beginner',     label: 'Beginner',     Icon: Sprout,  weeks: '3–4 days/week', tagline: 'Build the foundation',    desc: 'First 6 months, new to structured training' },
    { key: 'intermediate', label: 'Intermediate', Icon: Zap,     weeks: '4–6 days/week', tagline: 'Accelerate the gains',    desc: '6 months – 2 years, consistent training history' },
    { key: 'advanced',     label: 'Advanced',     Icon: Flame,   weeks: '6 days/week',   tagline: 'Maximum performance',      desc: '2+ years, ready for high frequency & volume' },
    { key: 'specialty',    label: 'Specialty',    Icon: Wrench,  weeks: 'Variable',      tagline: 'Beyond the weights',       desc: 'Home training, yoga, and powerlifting programs' },
  ];

  const pick = (split) => {
    if (split.comingSoon) return;
    
    // Check advanced tier requirement
    if (split.tier === 'advanced') {
      const userWorkoutDays = user.workoutDays || 0;
      const totalLogs = workoutLogs ? workoutLogs.length : 0;
      if (userWorkoutDays < 4 && totalLogs < 30) {
        setConfirm({
          title: 'Advanced split selected',
          message: 'This program is designed for athletes with 2+ years of consistent training. Based on your history, you may find Intermediate splits more effective and sustainable right now. Continue anyway?',
          confirmLabel: "Yes, I'm ready",
          onConfirm: () => activateSplit(split.id),
          onCancel: () => setConfirm(null)
        });
        return;
      }
    }
    
    activateSplit(split.id);
  };

  const activateSplit = (sid) => {
    setActiveSplitId(sid);
    addToast('Split activated! Redirecting to tracker...', 'success');
    setTimeout(() => navigate('/workout'), 250);
  };

  const updEx = (sId, dId, eId, data) => setSplits(p => p.map(s => s.id !== sId ? s : { ...s, days: s.days.map(d => d.id !== dId ? d : { ...d, exercises: d.exercises.map(e => e.id !== eId ? e : { ...e, ...data }) }) }));
  const delEx = (sId, dId, eId) => {
    setConfirm({
      title: 'Delete Exercise?', message: 'This exercise will be removed from the split.',
      danger: true, confirmLabel: 'Delete',
      onConfirm: () => {
        setSplits(p => p.map(s => s.id !== sId ? s : { ...s, days: s.days.map(d => d.id !== dId ? d : { ...d, exercises: d.exercises.filter(e => e.id !== eId) }) }));
        setConfirm(null);
        addToast('Exercise removed', 'info');
      },
    });
  };
  const addExFn = (sId, dId) => {
    const e = { id: gId(), ...newEx, sets: parseInt(newEx.sets) };
    setSplits(p => p.map(s => s.id !== sId ? s : { ...s, days: s.days.map(d => d.id !== dId ? d : { ...d, exercises: [...d.exercises, e] }) }));
    setNewEx({ name: '', sets: 3, repsRange: '8-12', muscle: '', notes: '' });
    setAddEx(null);
    addToast('Exercise added!', 'success');
  };
  const addSpFn = () => {
    // Add default tier assigned as activeTier
    const s = { id: gId(), ...ns, color: '#E8540D', tier: activeTier, schedule: ['Day 1', 'Rest'], days: [{ id: gId(), name: 'Day 1', type: 'custom', exercises: [] }, { id: gId(), name: 'Rest', type: 'rest', exercises: [] }] };
    setSplits(p => [...p, s]);
    setNs({ name: '', icon: 'Dumbbell', description: '' });
    setAddSp(false);
    addToast('New split created!', 'success');
  };

  const activeTierObj = TIERS.find(t => t.key === activeTier);
  const tieredSplits = splits.filter(s => s.tier === activeTier);

  return (
    <Screen
      kicker="Splits"
      right={<span className="kicker" style={{ color: 'var(--bone)' }}>{activeTierObj?.label || 'none'}</span>}
    >
      <Sec n="01" label="Level" right={activeTierObj?.weeks}>
        {TIERS.map(tier => {
          const isActive = activeTier === tier.key;
          return (
            <LedgerRow
              key={tier.key}
              k={tier.label}
              dim={!isActive}
              onClick={() => setActiveTier(tier.key)}
              style={{ cursor: 'pointer' }}
              v={isActive
                ? <span className="word ok">Selected</span>
                : <span className="v sm">→</span>}
            />
          );
        })}
      </Sec>

      {activeTierObj && (
        <Sec n="02" label={activeTierObj.tagline}>
          <p className="body-dim">{activeTierObj.desc}</p>

          <div className="meta mt14" style={{ flexWrap: 'wrap', gap: 14 }}>
            <span>{activeTierObj.weeks}</span>
            <span>45–60 min / session</span>
            {activeTier === 'advanced' && (
              <span style={{ color: 'var(--warn)' }}>2+ yrs training</span>
            )}
          </div>
        </Sec>
      )}

      <Sec n="03" label="Programs" right={`${tieredSplits.length} available`}>
        {tieredSplits.map(split => {
          const isActive = user.activeSplitId === split.id;
          const isOpen = exp === split.id;

          return (
            <div
              key={split.id}
              ref={isActive ? activeSplitRef : null}
              style={{ borderTop: '1px solid var(--hair-soft)', paddingTop: 16, marginTop: 16 }}
            >
              <div
                className="rowf between"
                style={{ alignItems: 'flex-start', gap: 12, cursor: split.comingSoon ? 'default' : 'pointer' }}
                onClick={() => !split.comingSoon && setExp(isOpen ? null : split.id)}
              >
                <div style={{ minWidth: 0 }}>
                  <div className="h2" style={{ fontSize: 17, color: isActive ? 'var(--ember-soft)' : 'var(--ink)' }}>
                    {split.name}
                  </div>
                  <div className="body-dim mt6" style={{ fontSize: 12 }}>{split.description}</div>
                </div>
                <div className="rowf g10" style={{ flexShrink: 0 }}>
                  {split.comingSoon ? (
                    <span className="word idle">Soon</span>
                  ) : isActive ? (
                    <span className="word ok">Active</span>
                  ) : (
                    <TLink onClick={() => pick(split)}>Select</TLink>
                  )}
                  {!split.comingSoon && (
                    <span style={{ color: 'var(--ash-dim)', fontSize: 11 }}>
                      {isOpen ? '−' : '+'}
                    </span>
                  )}
                </div>
              </div>

              {isOpen && !split.comingSoon && (
                <div style={{ marginTop: 16 }}>
                  {split.tierDescription && (
                    <p className="body-dim" style={{ marginBottom: 14 }}>{split.tierDescription}</p>
                  )}

                  <div className="meta" style={{ flexWrap: 'wrap', gap: 10, marginBottom: 6 }}>
                    {split.schedule.map((d, i) => (
                      <span key={i} style={{ color: d === 'Rest' ? 'var(--ash-dim)' : 'var(--bone)' }}>
                        D{i + 1} {d}
                      </span>
                    ))}
                  </div>

                  {split.days.filter(d => d.type !== 'rest').map(day => {
                    const dayOpen = expDay === day.id;
                    return (
                      <div key={day.id} style={{ marginTop: 14 }}>
                        <div
                          className="rowf between"
                          style={{ cursor: 'pointer', paddingBottom: 6 }}
                          onClick={() => setExpDay(dayOpen ? null : day.id)}
                        >
                          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>
                            {day.name}
                          </span>
                          <span className="meta">
                            {day.exercises.length} exercises
                            <span style={{ marginLeft: 10, color: 'var(--ash-dim)' }}>{dayOpen ? '−' : '+'}</span>
                          </span>
                        </div>

                        {dayOpen && (
                          <div>
                            {day.exercises.map(ex => (
                              <div key={ex.id} style={{ padding: '8px 0', borderTop: '1px solid var(--hair-soft)' }}>
                                {editEx === ex.id && isAdmin ? (
                                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 6 }}>
                                    <input value={ex.name} onChange={e => updEx(split.id, day.id, ex.id, { name: e.target.value })} style={{ fontSize: 13, padding: '6px 8px' }} />
                                    <input type="number" value={ex.sets} onChange={e => updEx(split.id, day.id, ex.id, { sets: parseInt(e.target.value) })} style={{ fontSize: 13, padding: '6px 8px' }} />
                                    <input value={ex.repsRange} onChange={e => updEx(split.id, day.id, ex.id, { repsRange: e.target.value })} style={{ fontSize: 13, padding: '6px 8px' }} />
                                    <input value={ex.primaryMuscle || ex.muscle} onChange={e => updEx(split.id, day.id, ex.id, { primaryMuscle: e.target.value })} style={{ fontSize: 13, padding: '6px 8px' }} />
                                  </div>
                                ) : (
                                  <div className="row" style={{ padding: 0, borderTop: 'none' }}>
                                    <span className="k" style={{ maxWidth: '52%' }}>
                                      {ex.name}
                                      {ex.variants && <span className="sub" style={{ marginLeft: 6 }}>opts</span>}
                                    </span>
                                    <span className="lead" />
                                    <span className="v sm">{ex.sets}×{ex.repsRange}</span>
                                    {isAdmin && (
                                      <span className="rowf g6" style={{ marginLeft: 8 }}>
                                        <TLink onClick={() => setEditEx(editEx === ex.id ? null : ex.id)}>
                                          {editEx === ex.id ? '✓' : 'edit'}
                                        </TLink>
                                        <TLink onClick={() => delEx(split.id, day.id, ex.id)} style={{ color: 'var(--bad)' }}>
                                          del
                                        </TLink>
                                      </span>
                                    )}
                                  </div>
                                )}
                              </div>
                            ))}

                            {isAdmin && (addEx === day.id ? (
                              <div style={{ marginTop: 12, display: 'grid', gap: 8 }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 8 }}>
                                  <input placeholder="Exercise" value={newEx.name} onChange={e => setNewEx(p => ({ ...p, name: e.target.value }))} style={{ fontSize: 13, padding: '8px 12px' }} />
                                  <input type="number" placeholder="Sets" value={newEx.sets} onChange={e => setNewEx(p => ({ ...p, sets: e.target.value }))} style={{ fontSize: 13, padding: '8px 12px' }} />
                                  <input placeholder="8-12" value={newEx.repsRange} onChange={e => setNewEx(p => ({ ...p, repsRange: e.target.value }))} style={{ fontSize: 13, padding: '8px 12px' }} />
                                </div>
                                <input placeholder="Muscle group" value={newEx.muscle} onChange={e => setNewEx(p => ({ ...p, muscle: e.target.value }))} style={{ fontSize: 13, padding: '8px 12px' }} />
                                <div className="rowf g16" style={{ marginTop: 4 }}>
                                  <TLink ember onClick={() => addExFn(split.id, day.id)}>Add</TLink>
                                  <TLink onClick={() => setAddEx(null)}>Cancel</TLink>
                                </div>
                              </div>
                            ) : (
                              <TLink onClick={() => setAddEx(day.id)} style={{ marginTop: 10 }}>
                                + Add exercise
                              </TLink>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {!isActive && (
                    <Action ember onClick={() => pick(split)} style={{ marginTop: 20 }}>
                      Select &amp; start tracking
                    </Action>
                  )}
                </div>
              )}

              {isOpen && split.comingSoon && (
                <p className="body-dim" style={{ marginTop: 14 }}>
                  Powerlifting programming with squat, bench and deadlift cycles is in development.
                </p>
              )}
            </div>
          );
        })}

        {tieredSplits.length === 0 && (
          <p className="body-dim">Nothing in this tier yet. Try another level.</p>
        )}
      </Sec>

      <Sec n="04" label="Build">
        <Action onClick={() => navigate('/split-builder')}>Custom split</Action>
        <TLink onClick={() => setAddSp(true)} style={{ marginTop: 14 }}>
          New split from scratch
        </TLink>
      </Sec>

      <div className="foot">
        <span>Kaaya Fit</span>
        <span>Margin</span>
      </div>

      {addSp && (
        <ModalPortal><div className="mo"><div className="md" style={{ maxWidth: 400 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 20 }}>
            <div className="h2">New split</div>
            <TLink onClick={() => setAddSp(false)}>Close</TLink>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label>Name</label>
              <input placeholder="e.g. Bro Split" value={ns.name} onChange={e => setNs(p => ({ ...p, name: e.target.value }))} style={{ width: '100%' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: 12 }}>
              <div>
                <label>Icon</label>
                <select value={ns.icon} onChange={e => setNs(p => ({ ...p, icon: e.target.value }))} style={{ fontSize: 13, width: '100%' }}>
                  {Object.keys(ICON_MAP).map(k => <option key={k} value={k}>{k}</option>)}
                </select>
              </div>
              <div>
                <label>Description</label>
                <input placeholder="5 days/week..." value={ns.description} onChange={e => setNs(p => ({ ...p, description: e.target.value }))} style={{ width: '100%' }} />
              </div>
            </div>
            <Action ember onClick={addSpFn}>Create split</Action>
          </div>
        </div></div></ModalPortal>
      )}

      <ConfirmDialog open={!!confirm} title={confirm?.title} message={confirm?.message} onConfirm={confirm?.onConfirm} onCancel={confirm?.onCancel} confirmLabel={confirm?.confirmLabel} danger={confirm?.danger} />
    </Screen>
  );
}
