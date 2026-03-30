import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronRight, X, Edit2, Trash2, Check, Dumbbell, Repeat, Zap, Target, Trophy, Home, Award, Flame } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PageHeader, ConfirmDialog, Portal } from '../shared/SharedComponents';
import { gId } from '../../utils/helpers';

export default function SplitsPage() {
  const { user, splits, setSplits, setActiveSplitId, addToast } = useApp();
  const navigate = useNavigate();
  const isAdmin = user.isAdmin;
  const [exp, setExp] = useState(null);
  const [expDay, setExpDay] = useState(null);
  const [editEx, setEditEx] = useState(null);
  const [addEx, setAddEx] = useState(null);
  const [newEx, setNewEx] = useState({ name: '', sets: 3, repsRange: '8-12', muscle: '', notes: '' });
  const [addSp, setAddSp] = useState(false);
  const [ns, setNs] = useState({ name: '', icon: 'Dumbbell', description: '' });

  const ICON_MAP = { Repeat, Zap, Target, Dumbbell, Trophy, Home, Award, Flame };
  const getIcon = (name) => ICON_MAP[name] || Dumbbell;
  const [confirm, setConfirm] = useState(null);

  const pick = sid => {
    if (splits.find(s => s.id === sid)?.comingSoon) return;
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
    const s = { id: gId(), ...ns, color: '#E8540D', schedule: ['Day 1', 'Rest'], days: [{ id: gId(), name: 'Day 1', type: 'custom', exercises: [] }, { id: gId(), name: 'Rest', type: 'rest', exercises: [] }] };
    setSplits(p => [...p, s]);
    setNs({ name: '', icon: 'Dumbbell', description: '' });
    setAddSp(false);
    addToast('New split created!', 'success');
  };

  return (
    <div className="pg-in">
      <PageHeader title="Choose Split" sub="Select a program — auto-redirects to tracker" action={isAdmin && <button className="btn-p" style={{ padding: '9px 16px', fontSize: 13 }} onClick={() => setAddSp(true)}>+ New Split</button>} />
      {splits.map(split => {
        const isActive = user.activeSplitId === split.id;
        return (
          <div key={split.id} className="card stripe" style={{ marginBottom: 12, transition: 'all 0.2s var(--ease-smooth)', transform: exp === split.id ? 'scale(1.01)' : 'scale(1)' }}>
            <div style={{ padding: '16px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center', flex: 1, cursor: 'pointer' }} onClick={() => setExp(exp === split.id ? null : split.id)}>
                {(() => { 
                  const I = getIcon(split.icon); 
                  return (
                    <div style={{ 
                      width: 40, height: 40, borderRadius: 12, 
                      background: isActive ? 'var(--surface-container-highest)' : 'var(--surface-container-low)', 
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: isActive ? 'var(--glow-primary)' : 'none',
                      transition: 'all 0.2s var(--ease-smooth)'
                    }}>
                      <I size={18} color={isActive ? "var(--primary)" : "var(--on-surface-dim)"} />
                    </div>
                  ); 
                })()}
                <div>
                  <div className="headline-md" style={{ color: isActive ? 'var(--primary)' : 'var(--on-surface)', letterSpacing: '1px' }}>{split.name}</div>
                  <div style={{ fontSize: 13, color: 'var(--on-surface-variant)', marginTop: 2 }}>{split.description}</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                {split.comingSoon ? <span className="tag" style={{ background: 'var(--surface-container-highest)' }}>Soon</span> : isActive ? <span className="tag" style={{ background: 'var(--primary)', color: 'var(--on-primary)' }}><Check size={10} /> Active</span> : <button className="btn-p" style={{ padding: '7px 14px', fontSize: 13 }} onClick={() => pick(split.id)}>Select →</button>}
                <ChevronDown size={14} color="var(--on-surface-dim)" style={{ transform: exp === split.id ? 'rotate(180deg)' : '', transition: '0.2s var(--ease-spring)', cursor: 'pointer', flexShrink: 0 }} onClick={() => setExp(exp === split.id ? null : split.id)} />
              </div>
            </div>
            {exp === split.id && !split.comingSoon && (
              <div style={{ padding: '0px 18px 18px' }}>
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 16 }}>
                  {split.schedule.map((d, i) => <div key={i} style={{ padding: '4px 10px', borderRadius: 8, fontSize: 10, fontWeight: 700, background: d === 'Rest' ? 'var(--surface-container-lowest)' : 'var(--surface-container-highest)', color: d === 'Rest' ? 'var(--on-surface-dim)' : 'var(--primary)', border: 'none' }}>D{i + 1}: {d}</div>)}
                </div>
                {split.days.filter(d => d.type !== 'rest').map(day => (
                  <div key={day.id} style={{ background: 'var(--surface-container-low)', borderRadius: 12, marginBottom: 8 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', cursor: 'pointer' }} onClick={() => setExpDay(expDay === day.id ? null : day.id)}>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <span className="tag" style={{ fontSize: 10, background: 'var(--surface-container-high)', color: 'var(--on-surface-variant)' }}>{day.type}</span>
                        <span style={{ fontWeight: 600, fontSize: 14, color: 'var(--on-surface)' }}>{day.name}</span>
                        <span style={{ fontSize: 11, color: 'var(--on-surface-dim)' }}>{day.exercises.length} ex</span>
                      </div>
                      <ChevronDown size={14} color="var(--on-surface-dim)" style={{ transform: expDay === day.id ? 'rotate(180deg)' : '', transition: '.2s var(--ease-spring)' }} />
                    </div>
                    {expDay === day.id && (
                      <div style={{ padding: '0 16px 16px' }}>
                        {day.exercises.map(ex => (
                          <div key={ex.id} style={{ padding: '10px 0' }}>
                            {editEx === ex.id && isAdmin ? (
                              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 6 }}>
                                <input value={ex.name} onChange={e => updEx(split.id, day.id, ex.id, { name: e.target.value })} style={{ fontSize: 13, padding: '7px 10px' }} />
                                <input type="number" value={ex.sets} onChange={e => updEx(split.id, day.id, ex.id, { sets: parseInt(e.target.value) })} style={{ fontSize: 13, padding: '7px 10px' }} />
                                <input value={ex.repsRange} onChange={e => updEx(split.id, day.id, ex.id, { repsRange: e.target.value })} style={{ fontSize: 13, padding: '7px 10px' }} />
                                <input value={ex.muscle} onChange={e => updEx(split.id, day.id, ex.id, { muscle: e.target.value })} style={{ fontSize: 13, padding: '7px 10px' }} />
                              </div>
                            ) : (
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                  <span style={{ fontWeight: 600, fontSize: 13, color: 'var(--on-surface)' }}>{ex.name}</span>
                                  {ex.variants && <span style={{ fontSize: 10, color: 'var(--on-surface-dim)', marginLeft: 6 }}>(options)</span>}
                                  <span style={{ fontSize: 12, color: 'var(--on-surface-variant)', marginLeft: 8 }}>{ex.sets}×{ex.repsRange}</span>
                                  {ex.muscle && <span style={{ fontSize: 10, color: 'var(--on-surface-variant)', marginLeft: 8 }}>{ex.muscle}</span>}
                                </div>
                                {isAdmin && <div style={{ display: 'flex', gap: 6 }}><button className="btn-g" style={{ padding: '4px 8px', fontSize: 11 }} onClick={() => setEditEx(editEx === ex.id ? null : ex.id)}>{editEx === ex.id ? '✓' : <Edit2 size={11} />}</button><button className="btn-d" style={{ padding: '4px 8px' }} onClick={() => delEx(split.id, day.id, ex.id)}><Trash2 size={11} /></button></div>}
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
                            <div style={{ display: 'flex', gap: 8 }}><button className="btn-p" style={{ padding: '8px 16px', fontSize: 13 }} onClick={() => addExFn(split.id, day.id)}>Add</button><button className="btn-g" style={{ fontSize: 13 }} onClick={() => setAddEx(null)}>Cancel</button></div>
                          </div>
                        ) : <button className="btn-g" style={{ marginTop: 12, width: '100%', fontSize: 12, padding: '10px' }} onClick={() => setAddEx(day.id)}>+ Add Exercise</button>)}
                      </div>
                    )}
                  </div>
                ))}
                {!isActive && <button className="btn-p" style={{ width: '100%', marginTop: 12, padding: '14px', borderRadius: 12, fontSize: 15 }} onClick={() => pick(split.id)}>Select & Start Tracking →</button>}
              </div>
            )}
            {exp === split.id && split.comingSoon && (
              <div style={{ padding: '36px 20px', textAlign: 'center', background: 'var(--surface-container-lowest)', borderRadius: '0 0 16px 16px' }}>
                <Dumbbell size={42} color="var(--on-surface-dim)" style={{ marginBottom: 16 }} />
                <div className="headline-lg" style={{ color: 'var(--primary)' }}>Coming Soon</div>
                <div style={{ color: 'var(--on-surface-variant)', fontSize: 14, marginTop: 8 }}>Powerlifting programming with Squat, Bench & Deadlift cycles is in development.</div>
              </div>
            )}
          </div>
        );
      })}
      {addSp && (
        <Portal><div className="mo"><div className="md" style={{ maxWidth: 400 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}><div className="headline-lg" style={{ color: 'var(--on-surface)' }}>New Split</div><button className="btn-g" style={{ padding: '6px 10px', border: 'none', background: 'var(--surface-container-highest)' }} onClick={() => setAddSp(false)}><X size={16} /></button></div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div><label style={{ color: 'var(--on-surface-variant)', fontSize: 12, marginBottom: 6, display: 'block' }}>Name</label><input placeholder="e.g. Bro Split" value={ns.name} onChange={e => setNs(p => ({ ...p, name: e.target.value }))} style={{ width: '100%' }} /></div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: 12 }}><div><label style={{ color: 'var(--on-surface-variant)', fontSize: 12, marginBottom: 6, display: 'block' }}>Icon</label><select value={ns.icon} onChange={e => setNs(p => ({ ...p, icon: e.target.value }))} style={{ fontSize: 13, width: '100%' }}>{Object.keys(ICON_MAP).map(k => <option key={k} value={k}>{k}</option>)}</select></div><div><label style={{ color: 'var(--on-surface-variant)', fontSize: 12, marginBottom: 6, display: 'block' }}>Description</label><input placeholder="5 days/week..." value={ns.description} onChange={e => setNs(p => ({ ...p, description: e.target.value }))} style={{ width: '100%' }} /></div></div>
            <button className="btn-p" style={{ width: '100%', padding: '14px', borderRadius: 12, fontSize: 15, marginTop: 8 }} onClick={addSpFn}>Create Split</button>
          </div>
        </div></div></Portal>
      )}
      <ConfirmDialog open={!!confirm} title={confirm?.title} message={confirm?.message} onConfirm={confirm?.onConfirm} onCancel={() => setConfirm(null)} confirmLabel={confirm?.confirmLabel} danger={confirm?.danger} />
    </div>
  );
}
