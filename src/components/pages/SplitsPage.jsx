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
      {splits.map(split => (
        <div key={split.id} className="card" style={{ marginBottom: 10 }}>
          <div style={{ padding: '16px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', flex: 1, cursor: 'pointer' }} onClick={() => setExp(exp === split.id ? null : split.id)}>
              {(() => { const I = getIcon(split.icon); return <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--o2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><I size={17} color="var(--o)" /></div>; })()}
              <div><div className="bb" style={{ fontSize: 17, color: 'var(--o)', letterSpacing: '1px' }}>{split.name}</div><div style={{ fontSize: 12, color: 'var(--t2)' }}>{split.description}</div></div>
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              {split.comingSoon ? <span className="tag tag-d">Soon</span> : user.activeSplitId === split.id ? <span className="tag"><Check size={10} /> Active</span> : <button className="btn-p" style={{ padding: '7px 14px', fontSize: 13 }} onClick={() => pick(split.id)}>Select →</button>}
              <ChevronDown size={14} color="var(--t3)" style={{ transform: exp === split.id ? 'rotate(180deg)' : '', transition: '.2s', cursor: 'pointer', flexShrink: 0 }} onClick={() => setExp(exp === split.id ? null : split.id)} />
            </div>
          </div>
          {exp === split.id && !split.comingSoon && (
            <div style={{ borderTop: '1px solid var(--bd)', padding: '14px 18px 18px' }}>
              <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 12 }}>
                {split.schedule.map((d, i) => <div key={i} style={{ padding: '3px 8px', borderRadius: 6, fontSize: 9, fontWeight: 700, background: d === 'Rest' ? 'var(--c2)' : 'var(--o2)', color: d === 'Rest' ? 'var(--t3)' : 'var(--o)', border: `1px solid ${d === 'Rest' ? 'var(--bd)' : 'rgba(232,84,13,.25)'}` }}>D{i + 1}: {d}</div>)}
              </div>
              {split.days.filter(d => d.type !== 'rest').map(day => (
                <div key={day.id} style={{ background: 'var(--bg)', borderRadius: 10, marginBottom: 7 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', cursor: 'pointer' }} onClick={() => setExpDay(expDay === day.id ? null : day.id)}>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <span className="tag" style={{ fontSize: 9 }}>{day.type}</span>
                      <span style={{ fontWeight: 600, fontSize: 13 }}>{day.name}</span>
                      <span style={{ fontSize: 11, color: 'var(--t3)' }}>{day.exercises.length} ex</span>
                    </div>
                    <ChevronDown size={12} color="var(--t3)" style={{ transform: expDay === day.id ? 'rotate(180deg)' : '', transition: '.2s' }} />
                  </div>
                  {expDay === day.id && (
                    <div style={{ padding: '0 14px 14px' }}>
                      {day.exercises.map(ex => (
                        <div key={ex.id} className="row-sep" style={{ padding: '8px 0' }}>
                          {editEx === ex.id && isAdmin ? (
                            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 5 }}>
                              <input value={ex.name} onChange={e => updEx(split.id, day.id, ex.id, { name: e.target.value })} style={{ fontSize: 12, padding: '5px 8px' }} />
                              <input type="number" value={ex.sets} onChange={e => updEx(split.id, day.id, ex.id, { sets: parseInt(e.target.value) })} style={{ fontSize: 12, padding: '5px 8px' }} />
                              <input value={ex.repsRange} onChange={e => updEx(split.id, day.id, ex.id, { repsRange: e.target.value })} style={{ fontSize: 12, padding: '5px 8px' }} />
                              <input value={ex.muscle} onChange={e => updEx(split.id, day.id, ex.id, { muscle: e.target.value })} style={{ fontSize: 12, padding: '5px 8px' }} />
                            </div>
                          ) : (
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <div><span style={{ fontWeight: 500, fontSize: 13 }}>{ex.name}</span>{ex.variants && <span style={{ fontSize: 10, color: 'var(--t3)', marginLeft: 5 }}>(options)</span>}<span style={{ fontSize: 12, color: 'var(--t2)', marginLeft: 8 }}>{ex.sets}×{ex.repsRange}</span>{ex.muscle && <span style={{ fontSize: 10, color: 'var(--o)', marginLeft: 8 }}>{ex.muscle}</span>}</div>
                              {isAdmin && <div style={{ display: 'flex', gap: 5 }}><button className="btn-g" style={{ padding: '2px 7px', fontSize: 10 }} onClick={() => setEditEx(editEx === ex.id ? null : ex.id)}>{editEx === ex.id ? '✓' : <Edit2 size={10} />}</button><button className="btn-d" style={{ padding: '2px 7px' }} onClick={() => delEx(split.id, day.id, ex.id)}><Trash2 size={10} /></button></div>}
                            </div>
                          )}
                        </div>
                      ))}
                      {isAdmin && (addEx === day.id ? (
                        <div style={{ marginTop: 8, display: 'grid', gap: 7 }}>
                          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 7 }}>
                            <input placeholder="Exercise" value={newEx.name} onChange={e => setNewEx(p => ({ ...p, name: e.target.value }))} style={{ fontSize: 12, padding: '7px 10px' }} />
                            <input type="number" placeholder="Sets" value={newEx.sets} onChange={e => setNewEx(p => ({ ...p, sets: e.target.value }))} style={{ fontSize: 12, padding: '7px 10px' }} />
                            <input placeholder="8-12" value={newEx.repsRange} onChange={e => setNewEx(p => ({ ...p, repsRange: e.target.value }))} style={{ fontSize: 12, padding: '7px 10px' }} />
                          </div>
                          <input placeholder="Muscle group" value={newEx.muscle} onChange={e => setNewEx(p => ({ ...p, muscle: e.target.value }))} style={{ fontSize: 12, padding: '7px 10px' }} />
                          <div style={{ display: 'flex', gap: 7 }}><button className="btn-p" style={{ padding: '7px 14px', fontSize: 12 }} onClick={() => addExFn(split.id, day.id)}>Add</button><button className="btn-g" style={{ fontSize: 12 }} onClick={() => setAddEx(null)}>Cancel</button></div>
                        </div>
                      ) : <button className="btn-g" style={{ marginTop: 7, width: '100%', fontSize: 11 }} onClick={() => setAddEx(day.id)}>+ Add Exercise</button>)}
                    </div>
                  )}
                </div>
              ))}
              {user.activeSplitId !== split.id && <button className="btn-p" style={{ width: '100%', marginTop: 10, padding: '12px' }} onClick={() => pick(split.id)}>Select & Start Tracking →</button>}
            </div>
          )}
          {exp === split.id && split.comingSoon && (
            <div style={{ borderTop: '1px solid var(--bd)', padding: '36px 20px', textAlign: 'center' }}>
              <Dumbbell size={36} color="var(--t3)" style={{ marginBottom: 10 }} />
              <div className="bb" style={{ fontSize: 20, color: 'var(--o)' }}>Coming Soon</div>
              <div style={{ color: 'var(--t2)', fontSize: 12, marginTop: 6 }}>Powerlifting programming with Squat, Bench & Deadlift cycles is in development.</div>
            </div>
          )}
        </div>
      ))}
      {addSp && (
        <Portal><div className="mo"><div className="md" style={{ maxWidth: 400 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 18 }}><div className="bb" style={{ fontSize: 22 }}>New Split</div><button className="btn-g" style={{ padding: '5px 9px' }} onClick={() => setAddSp(false)}><X size={14} /></button></div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div><label>Name</label><input placeholder="e.g. Bro Split" value={ns.name} onChange={e => setNs(p => ({ ...p, name: e.target.value }))} /></div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: 10 }}><div><label>Icon</label><select value={ns.icon} onChange={e => setNs(p => ({ ...p, icon: e.target.value }))} style={{ fontSize: 12 }}>{Object.keys(ICON_MAP).map(k => <option key={k} value={k}>{k}</option>)}</select></div><div><label>Description</label><input placeholder="5 days/week..." value={ns.description} onChange={e => setNs(p => ({ ...p, description: e.target.value }))} /></div></div>
            <button className="btn-p" style={{ width: '100%', padding: '12px' }} onClick={addSpFn}>Create Split</button>
          </div>
        </div></div></Portal>
      )}
      <ConfirmDialog open={!!confirm} title={confirm?.title} message={confirm?.message} onConfirm={confirm?.onConfirm} onCancel={() => setConfirm(null)} confirmLabel={confirm?.confirmLabel} danger={confirm?.danger} />
    </div>
  );
}
