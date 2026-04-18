import React, { useState, useEffect } from 'react';
import { Calendar, Clock, X, Plus } from 'lucide-react';
import { ModalPortal, ConfirmDialog } from './SharedComponents';
import { tod } from '../../utils/helpers';
import { MUSCLE_GROUPS } from '../../data/muscleData';

export default function EditWorkoutModal({ log, splits, onSave, onClose }) {
  const [draft, setDraft] = useState(() => JSON.parse(JSON.stringify(log)));
  const [saving, setSaving] = useState(false);
  const [addingExercise, setAddingExercise] = useState(false); // false | 'split' | 'custom'
  const [animIn, setAnimIn] = useState(false);
  
  // Custom exercise state
  const [customName, setCustomName] = useState('');
  const [customMuscle, setCustomMuscle] = useState(MUSCLE_GROUPS[0].key);
  const [customSets, setCustomSets] = useState(3);
  
  const [confirmDelEx, setConfirmDelEx] = useState(null);

  useEffect(() => {
    requestAnimationFrame(() => setAnimIn(true));
  }, []);

  const handleClose = () => {
    setAnimIn(false);
    setTimeout(onClose, 300);
  };

  const handleSave = async () => {
    setSaving(true);
    // Strip empty sets
    const finalDraft = {
      ...draft,
      exercises: draft.exercises.map(ex => ({
        ...ex,
        sets: (ex.sets || []).filter(s => s.reps !== '' || s.weight !== '')
      }))
    };
    try {
      await onSave(finalDraft);
      handleClose();
    } catch (e) {
       console.error("Save failed", e);
       setSaving(false);
    }
  };

  const hasChanges = JSON.stringify(log) !== JSON.stringify(draft);
  const splitDef = splits.find(s => s.id === log.splitId);
  const dayDef = splitDef?.days.find(d => d.id === log.dayId);
  
  // Available from split (not already in draft)
  const availableFromSplit = dayDef?.exercises.filter(e => !draft.exercises.some(de => de.name === e.name)) || [];

  return (
    <ModalPortal>
      <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(24px)', zIndex: 'var(--z-modal)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', transition: 'all 0.3s cubic-bezier(.4, 0, .2, 1)', opacity: animIn ? 1 : 0 }} onClick={handleClose}>
        <div style={{ background: 'var(--background)', height: '90dvh', borderTopLeftRadius: 32, borderTopRightRadius: 32, display: 'flex', flexDirection: 'column', transform: animIn ? 'translateY(0)' : 'translateY(100%)', transition: 'transform 0.3s cubic-bezier(.4, 0, .2, 1)' }} onClick={e => e.stopPropagation()}>
          
          {/* Header */}
          <div style={{ padding: '24px 24px 16px', borderBottom: '1px solid var(--surface-container-highest)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexShrink: 0, position: 'relative' }}>
             <div style={{ position: 'absolute', top: 8, left: '50%', transform: 'translateX(-50%)', width: 40, height: 4, borderRadius: 2, background: 'var(--surface-container-highest)' }} />
             <div>
               <div className="headline-md" style={{ color: 'var(--on-surface)', marginBottom: 6 }}>{draft.dayName}</div>
               <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                 <div style={{ background: 'var(--surface-container-highest)', padding: '4px 12px', borderRadius: 16, display: 'flex', alignItems: 'center', gap: 6, position: 'relative' }}>
                   <Calendar size={14} color="var(--primary)" />
                   <input type="date" max={tod()} value={draft.date} onChange={e => setDraft({ ...draft, date: e.target.value })} style={{ background: 'transparent', border: 'none', color: 'var(--on-surface-variant)', fontSize: 13, fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif" }} />
                 </div>
                 <div style={{ background: 'var(--surface-container-highest)', padding: '4px 12px', borderRadius: 16, display: 'flex', alignItems: 'center', gap: 6, fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, fontWeight: 700, color: 'var(--on-surface-variant)' }}>
                   <Clock size={14} color="var(--primary)" />
                   <span style={{ display: 'flex', alignItems: 'center' }}>
                     <input type="number" value={draft.durationMinutes || 0} onChange={e => setDraft({ ...draft, durationMinutes: parseInt(e.target.value) || 0 })} style={{ width: 36, background: 'transparent', border: 'none', color: 'var(--on-surface-variant)', textAlign: 'right', fontWeight: 700 }} />m
                   </span>
                 </div>
               </div>
             </div>
             <button style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--surface-container-highest)', color: 'var(--on-surface-variant)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={handleClose}><X size={18} /></button>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
            {/* Exercises List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {draft.exercises.map((ex, exIdx) => (
                <div key={`${ex.name}-${exIdx}`} className="card" style={{ padding: 16, background: 'var(--surface-container-lowest)', border: '1px solid var(--surface-container)', position: 'relative' }}>
                  <button style={{ position: 'absolute', top: 12, right: 12, width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', color: 'var(--danger)', background: 'rgba(255,107,107,0.1)' }} onClick={() => setConfirmDelEx(exIdx)}><X size={14} /></button>
                  <div style={{ paddingRight: 32, marginBottom: 12 }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--on-surface)', marginBottom: 2 }}>{ex.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--primary)' }}>{ex.primaryMuscle || ex.muscle || 'General'}</div>
                  </div>
                  
                  {/* Sets Table */}
                  <div style={{ display: 'grid', gridTemplateColumns: '40px 1fr 1fr 40px', gap: 8, marginBottom: 8, fontSize: 11, fontWeight: 700, color: 'var(--on-surface-dim)', letterSpacing: '0.05em', padding: '0 8px' }}>
                    <div>SET</div><div>REPS</div><div>KG</div><div></div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {(ex.sets || []).map((set, sIdx) => {
                       const isNew = set.reps === '' && set.weight === '';
                       return (
                         <div key={sIdx} style={{ display: 'grid', gridTemplateColumns: '40px 1fr 1fr 40px', gap: 8, alignItems: 'center', padding: '0 8px', opacity: isNew ? 0.7 : 1 }}>
                           <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--on-surface-dim)' }}>{sIdx + 1}</div>
                           <input type="number" placeholder="—" value={set.reps} onChange={e => {
                               const r = e.target.value;
                               const ne = [...draft.exercises];
                               ne[exIdx].sets[sIdx].reps = r ? parseInt(r) : '';
                               setDraft({ ...draft, exercises: ne });
                           }} style={{ width: '100%', background: 'var(--surface-container)', border: 'none', borderRadius: 8, padding: '8px', color: 'var(--on-surface)', fontSize: 14, fontWeight: 600, textAlign: 'center' }} />
                           <input type="number" step="0.5" placeholder="—" value={set.weight} onChange={e => {
                               const w = e.target.value;
                               const ne = [...draft.exercises];
                               ne[exIdx].sets[sIdx].weight = w ? parseFloat(w) : '';
                               setDraft({ ...draft, exercises: ne });
                           }} style={{ width: '100%', background: 'var(--surface-container)', border: 'none', borderRadius: 8, padding: '8px', color: 'var(--on-surface)', fontSize: 14, fontWeight: 600, textAlign: 'center' }} />
                           <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                             {(ex.sets.length > 1) && (
                               <button style={{ background: 'transparent', border: 'none', color: 'var(--on-surface-dim)', padding: 4 }} onClick={() => {
                                 const ne = [...draft.exercises];
                                 ne[exIdx].sets.splice(sIdx, 1);
                                 setDraft({ ...draft, exercises: ne });
                               }}><X size={14} /></button>
                             )}
                           </div>
                         </div>
                       );
                    })}
                  </div>
                  <button style={{ width: 'calc(100% - 16px)', margin: '12px 8px 0', padding: '8px', background: 'transparent', border: '1px dashed var(--outline-variant)', borderRadius: 8, color: 'var(--on-surface-variant)', fontSize: 12, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }} onClick={() => {
                     const ne = [...draft.exercises];
                     ne[exIdx].sets.push({ reps: '', weight: '', done: false });
                     setDraft({ ...draft, exercises: ne });
                  }}><Plus size={14} /> Add Set</button>
                </div>
              ))}
            </div>

            {/* Notes */}
            <div className="card" style={{ padding: 16, background: 'var(--surface-container-low)', marginTop: 24 }}>
              <div className="label-md" style={{ color: 'var(--on-surface-dim)', marginBottom: 8 }}>SESSION NOTES</div>
              <textarea value={draft.notes || ''} onChange={e => setDraft({ ...draft, notes: e.target.value })} placeholder="How did it feel?" rows={3} style={{ width: '100%', background: 'var(--surface-container-highest)', border: 'none', borderRadius: 12, padding: 12, color: 'var(--on-surface)', fontSize: 14, resize: 'vertical' }} />
            </div>

            {/* Add Exercise Trigger */}
            <button style={{ width: '100%', padding: '14px', background: 'var(--surface-container-highest)', color: 'var(--on-surface)', borderRadius: 16, border: 'none', fontSize: 14, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 24 }} onClick={() => setAddingExercise(dayDef ? 'split' : 'custom')}><Plus size={16} /> ADD EXERCISE</button>
          </div>
          
          {/* Footer */}
          <div style={{ padding: '16px 24px 32px', background: 'var(--surface-container)', display: 'flex', gap: 12, flexShrink: 0 }}>
             <button style={{ flex: 1, padding: '16px', borderRadius: 16, background: 'transparent', color: 'var(--danger)', fontSize: 15, fontWeight: 700, border: 'none' }} onClick={handleClose}>Discard</button>
             <button style={{ flex: 2, padding: '16px', borderRadius: 16, background: hasChanges ? 'var(--signature-gradient)' : 'var(--surface-container-highest)', color: hasChanges ? 'var(--on-primary)' : 'var(--on-surface)', fontSize: 15, fontWeight: 700, border: 'none', opacity: saving ? 0.7 : 1 }} onClick={hasChanges && !saving ? handleSave : handleClose}>{saving ? 'Saving...' : hasChanges ? 'SAVE CHANGES' : 'Close'}</button>
          </div>
        </div>

        {/* Add Exercise Sub-Panel */}
        {addingExercise && (
          <div style={{ position: 'absolute', inset: 0, background: 'var(--background)', zIndex: 10, display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '24px 24px 16px', borderBottom: '1px solid var(--surface-container-highest)', display: 'flex', alignItems: 'center', gap: 16 }}>
               <button style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--surface-container-highest)', color: 'var(--on-surface)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setAddingExercise(false)}><X size={18} /></button>
               <div className="headline-md" style={{ color: 'var(--on-surface)' }}>Add Exercise</div>
            </div>
            
            <div style={{ display: 'flex', padding: '16px 24px', gap: 8 }}>
              {dayDef && <button style={{ flex: 1, padding: '10px', borderRadius: 12, fontSize: 13, fontWeight: 700, border: 'none', background: addingExercise === 'split' ? 'var(--primary)' : 'var(--surface-container)', color: addingExercise === 'split' ? 'var(--on-primary)' : 'var(--on-surface)' }} onClick={() => setAddingExercise('split')}>From Split</button>}
              <button style={{ flex: 1, padding: '10px', borderRadius: 12, fontSize: 13, fontWeight: 700, border: 'none', background: addingExercise === 'custom' ? 'var(--primary)' : 'var(--surface-container)', color: addingExercise === 'custom' ? 'var(--on-primary)' : 'var(--on-surface)' }} onClick={() => setAddingExercise('custom')}>Custom</button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '0 24px 24px' }}>
               {addingExercise === 'split' && (
                 <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                   {availableFromSplit.length === 0 ? (
                     <div style={{ textAlign: 'center', padding: 40, color: 'var(--on-surface-variant)' }}>All exercises from this split day are already added.</div>
                   ) : availableFromSplit.map(ex => (
                     <div key={ex.name} className="card stripe" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 16, cursor: 'pointer' }} onClick={() => {
                         const defSets = Array.from({ length: ex.sets || 3 }).map(() => ({ reps: '', weight: '', done: false }));
                         setDraft({ ...draft, exercises: [...draft.exercises, { name: ex.name, primaryMuscle: ex.primaryMuscle || ex.muscle, sets: defSets }] });
                         setAddingExercise(false);
                     }}>
                       <div>
                         <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--on-surface)', marginBottom: 4 }}>{ex.name}</div>
                         <div style={{ fontSize: 12, color: 'var(--on-surface-variant)' }}>{ex.muscle || ex.primaryMuscle} · {ex.sets} sets × {ex.repsRange || 'max'}</div>
                       </div>
                       <Plus size={20} color="var(--primary)" />
                     </div>
                   ))}
                 </div>
               )}
               
               {addingExercise === 'custom' && (
                 <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                   <div className="input-group">
                     <label style={{ fontSize: 11, color: 'var(--on-surface-dim)', fontWeight: 700, textTransform: 'uppercase', marginBottom: 6, display: 'block' }}>Exercise Name</label>
                     <input type="text" value={customName} onChange={e => setCustomName(e.target.value)} style={{ width: '100%', padding: '12px 16px', borderRadius: 12, background: 'var(--surface-container-highest)', border: 'none', color: 'var(--on-surface)', fontWeight: 600, fontSize: 15 }} placeholder="e.g. Bicep Curl" />
                   </div>
                   <div className="input-group">
                     <label style={{ fontSize: 11, color: 'var(--on-surface-dim)', fontWeight: 700, textTransform: 'uppercase', marginBottom: 6, display: 'block' }}>Primary Muscle</label>
                     <select value={customMuscle} onChange={e => setCustomMuscle(e.target.value)} style={{ width: '100%', padding: '12px 16px', borderRadius: 12, background: 'var(--surface-container-highest)', border: 'none', color: 'var(--on-surface)', fontWeight: 600, fontSize: 15 }}>
                       {MUSCLE_GROUPS.map(m => <option key={m.key} value={m.key}>{m.label}</option>)}
                     </select>
                   </div>
                   <div className="input-group">
                     <label style={{ fontSize: 11, color: 'var(--on-surface-dim)', fontWeight: 700, textTransform: 'uppercase', marginBottom: 6, display: 'block' }}>Sets</label>
                     <input type="number" value={customSets} onChange={e => setCustomSets(parseInt(e.target.value) || 1)} style={{ width: '100%', padding: '12px 16px', borderRadius: 12, background: 'var(--surface-container-highest)', border: 'none', color: 'var(--on-surface)', fontWeight: 600, fontSize: 15 }} />
                   </div>
                   <button style={{ width: '100%', padding: '16px', background: 'var(--primary)', color: 'var(--on-primary)', borderRadius: 16, border: 'none', fontSize: 15, fontWeight: 700, marginTop: 12, opacity: customName ? 1 : 0.5 }} disabled={!customName} onClick={() => {
                     const defSets = Array.from({ length: customSets }).map(() => ({ reps: '', weight: '', done: false }));
                     const mLabel = MUSCLE_GROUPS.find(m => m.key === customMuscle)?.label || customMuscle;
                     setDraft({ ...draft, exercises: [...draft.exercises, { name: customName, primaryMuscle: customMuscle, muscle: mLabel, sets: defSets }] });
                     setAddingExercise(false);
                     setCustomName(''); setCustomSets(3);
                   }}>ADD TO SESSION</button>
                 </div>
               )}
            </div>
          </div>
        )}
      </div>
      <ConfirmDialog open={confirmDelEx !== null} title="Remove Exercise?" message="Are you sure you want to remove this exercise?" onConfirm={() => {
         const ne = [...draft.exercises];
         ne.splice(confirmDelEx, 1);
         setDraft({ ...draft, exercises: ne });
         setConfirmDelEx(null);
      }} onCancel={() => setConfirmDelEx(null)} confirmLabel="Remove" danger />
    </ModalPortal>
  );
}
