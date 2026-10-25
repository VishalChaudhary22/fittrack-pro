import React, { useState, useEffect } from 'react';
import { Calendar, Clock, X, Plus, ChevronLeft } from 'lucide-react';
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

  const handleAddFromSplit = (ex) => {
    const defSets = Array.from({ length: ex.sets || 3 }).map(() => ({ reps: '', weight: '', done: false }));
    setDraft(prev => ({ 
      ...prev, 
      exercises: [...prev.exercises, { name: ex.name, primaryMuscle: ex.primaryMuscle || ex.muscle, sets: defSets }] 
    }));
    setAddingExercise(false);
  };

  const handleAddCustom = () => {
    if (!customName) return;
    const defSets = Array.from({ length: customSets }).map(() => ({ reps: '', weight: '', done: false }));
    const mLabel = MUSCLE_GROUPS.find(m => m.key === customMuscle)?.label || customMuscle;
    setDraft(prev => ({ 
      ...prev, 
      exercises: [...prev.exercises, { name: customName, primaryMuscle: customMuscle, muscle: mLabel, sets: defSets }] 
    }));
    setAddingExercise(false);
    setCustomName(''); 
    setCustomSets(3);
  };

  const hasChanges = JSON.stringify(log) !== JSON.stringify(draft);
  const splitDef = splits.find(s => s.id === log.splitId);
  const dayDef = splitDef?.days.find(d => d.id === log.dayId);
  const availableFromSplit = dayDef?.exercises.filter(e => !draft.exercises.some(de => de.name === e.name)) || [];
  const durationVal = draft.durationMinutes || 0;

  // When addingExercise is active, render ONLY the sub-panel (no main content at all)
  const renderMainContent = () => (
    <>
      {/* Header */}
      <div style={{ padding: '24px 24px 16px', borderBottom: '1px solid var(--surface-container-highest)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexShrink: 0, position: 'relative' }}>
         <div style={{ position: 'absolute', top: 8, left: '50%', transform: 'translateX(-50%)', width: 40, height: 4, borderRadius: 2, background: 'var(--surface-container-highest)' }} />
         <div>
           <div className="headline-md" style={{ color: 'var(--on-surface)', marginBottom: 6 }}>{draft.dayName}</div>
           <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
             <div style={{ background: 'var(--surface-container-highest)', padding: '4px 12px', borderRadius: 16, display: 'flex', alignItems: 'center', gap: 6 }}>
               <Calendar size={14} color="var(--primary)" />
               <input type="date" max={tod()} value={draft.date} onChange={e => setDraft({ ...draft, date: e.target.value })} style={{ background: 'transparent', border: 'none', color: 'var(--on-surface-variant)', fontSize: 13, fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif" }} />
             </div>
             <div style={{ background: 'var(--surface-container-highest)', padding: '4px 12px', borderRadius: 16, display: 'flex', alignItems: 'center', gap: 6 }}>
               <Clock size={14} color="var(--primary)" />
               <input 
                 type="number" 
                 value={durationVal} 
                 onChange={e => setDraft({ ...draft, durationMinutes: parseInt(e.target.value) || 0 })} 
                 style={{ 
                   width: 40, background: 'transparent', border: 'none', 
                   color: 'var(--on-surface-variant)', textAlign: 'right', 
                   fontWeight: 700, fontSize: 13, fontFamily: "'Space Grotesk', sans-serif",
                   padding: 0, borderRadius: 0
                 }} 
               />
               <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--on-surface-variant)', fontFamily: "'Space Grotesk', sans-serif" }}>min</span>
             </div>
           </div>
         </div>
         <button style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--surface-container-highest)', color: 'var(--on-surface-variant)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} onClick={handleClose}><X size={18} /></button>
      </div>

      {/* Scrollable Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {draft.exercises.map((ex, exIdx) => (
            <div key={`${ex.name}-${exIdx}`} style={{ padding: 16, background: 'var(--surface-container-lowest)', border: '1px solid var(--surface-container)', borderRadius: 24, position: 'relative' }}>
              <button style={{ position: 'absolute', top: 12, right: 12, width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', color: 'var(--danger)', background: 'rgba(255,107,107,0.1)', cursor: 'pointer' }} onClick={() => setConfirmDelEx(exIdx)}><X size={14} /></button>
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
                           <button style={{ background: 'transparent', border: 'none', color: 'var(--on-surface-dim)', padding: 4, cursor: 'pointer' }} onClick={() => {
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
        <div style={{ padding: 16, background: 'var(--surface-container-low)', marginTop: 24, borderRadius: 24 }}>
          <div className="label-md" style={{ color: 'var(--on-surface-dim)', marginBottom: 8 }}>SESSION NOTES</div>
          <textarea value={draft.notes || ''} onChange={e => setDraft({ ...draft, notes: e.target.value })} placeholder="How did it feel?" rows={3} style={{ width: '100%', background: 'var(--surface-container-highest)', border: 'none', borderRadius: 12, padding: 12, color: 'var(--on-surface)', fontSize: 14, resize: 'vertical' }} />
        </div>

        {/* Add Exercise Trigger */}
        <button style={{ width: '100%', padding: '14px', background: 'var(--surface-container-highest)', color: 'var(--on-surface)', borderRadius: 16, border: 'none', fontSize: 14, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 24, cursor: 'pointer' }} onClick={() => setAddingExercise(dayDef ? 'split' : 'custom')}><Plus size={16} /> ADD EXERCISE</button>
      </div>
      
      {/* Footer */}
      <div style={{ padding: '16px 24px 32px', background: 'var(--surface-container)', display: 'flex', gap: 12, flexShrink: 0 }}>
         <button style={{ flex: 1, padding: '16px', borderRadius: 16, background: 'transparent', color: 'var(--danger)', fontSize: 15, fontWeight: 700, border: 'none', cursor: 'pointer' }} onClick={handleClose}>Discard</button>
         <button style={{ flex: 2, padding: '16px', borderRadius: 16, background: hasChanges ? 'var(--signature-gradient)' : 'var(--surface-container-highest)', color: hasChanges ? 'var(--on-primary)' : 'var(--on-surface)', fontSize: 15, fontWeight: 700, border: 'none', opacity: saving ? 0.7 : 1, cursor: 'pointer' }} onClick={hasChanges && !saving ? handleSave : handleClose}>{saving ? 'Saving...' : hasChanges ? 'SAVE CHANGES' : 'Close'}</button>
      </div>
    </>
  );

  const renderAddExercisePanel = () => (
    <>
      {/* Sub-panel Header */}
      <div style={{ padding: '24px 24px 16px', borderBottom: '1px solid var(--surface-container-highest)', display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0 }}>
        <button style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--surface-container-highest)', color: 'var(--on-surface)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} onClick={() => setAddingExercise(false)}><ChevronLeft size={18} /></button>
        <div className="headline-md" style={{ color: 'var(--on-surface)' }}>Add Exercise</div>
      </div>
      
      {/* Split / Custom Tabs */}
      <div style={{ display: 'flex', padding: '16px 24px', gap: 8, flexShrink: 0 }}>
        {dayDef && (
          <button style={{ flex: 1, padding: '10px', borderRadius: 12, fontSize: 13, fontWeight: 700, border: 'none', background: addingExercise === 'split' ? 'var(--primary)' : 'var(--surface-container)', color: addingExercise === 'split' ? 'var(--on-primary)' : 'var(--on-surface)', cursor: 'pointer' }} onClick={() => setAddingExercise('split')}>From Split</button>
        )}
        <button style={{ flex: 1, padding: '10px', borderRadius: 12, fontSize: 13, fontWeight: 700, border: 'none', background: addingExercise === 'custom' ? 'var(--primary)' : 'var(--surface-container)', color: addingExercise === 'custom' ? 'var(--on-primary)' : 'var(--on-surface)', cursor: 'pointer' }} onClick={() => setAddingExercise('custom')}>Custom</button>
      </div>

      {/* Sub-panel Scrollable Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 24px 24px' }}>
        {addingExercise === 'split' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {availableFromSplit.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 40, color: 'var(--on-surface-variant)' }}>All exercises from this split day are already added.</div>
            ) : availableFromSplit.map(ex => (
              <div 
                key={ex.name} 
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 16, cursor: 'pointer', background: 'var(--surface-container-low)', borderRadius: 20, borderLeft: '3px solid var(--primary-container)' }} 
                onClick={() => handleAddFromSplit(ex)}
              >
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
            <div>
              <label style={{ fontSize: 11, color: 'var(--on-surface-dim)', fontWeight: 700, textTransform: 'uppercase', marginBottom: 6, display: 'block' }}>Exercise Name</label>
              <input type="text" value={customName} onChange={e => setCustomName(e.target.value)} style={{ width: '100%', padding: '12px 16px', borderRadius: 12, background: 'var(--surface-container-highest)', border: 'none', color: 'var(--on-surface)', fontWeight: 600, fontSize: 15 }} placeholder="e.g. Bicep Curl" />
            </div>
            <div>
              <label style={{ fontSize: 11, color: 'var(--on-surface-dim)', fontWeight: 700, textTransform: 'uppercase', marginBottom: 6, display: 'block' }}>Primary Muscle</label>
              <select value={customMuscle} onChange={e => setCustomMuscle(e.target.value)} style={{ width: '100%', padding: '12px 16px', borderRadius: 12, background: 'var(--surface-container-highest)', border: 'none', color: 'var(--on-surface)', fontWeight: 600, fontSize: 15 }}>
                {MUSCLE_GROUPS.map(m => <option key={m.key} value={m.key}>{m.label}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 11, color: 'var(--on-surface-dim)', fontWeight: 700, textTransform: 'uppercase', marginBottom: 6, display: 'block' }}>Sets</label>
              <input type="number" value={customSets} onChange={e => setCustomSets(parseInt(e.target.value) || 1)} style={{ width: '100%', padding: '12px 16px', borderRadius: 12, background: 'var(--surface-container-highest)', border: 'none', color: 'var(--on-surface)', fontWeight: 600, fontSize: 15 }} />
            </div>
            <button 
              style={{ width: '100%', padding: '16px', background: customName ? 'var(--primary)' : 'var(--surface-container-highest)', color: customName ? 'var(--on-primary)' : 'var(--on-surface-dim)', borderRadius: 16, border: 'none', fontSize: 15, fontWeight: 700, marginTop: 12, cursor: customName ? 'pointer' : 'default', opacity: customName ? 1 : 0.5 }} 
              disabled={!customName} 
              onClick={handleAddCustom}
            >
              ADD TO SESSION
            </button>
          </div>
        )}
      </div>
    </>
  );

  return (
    <ModalPortal>
      {/* Backdrop */}
      <div 
        style={{ 
          position: 'fixed', inset: 0, 
          background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(24px)', 
          zIndex: 'var(--z-modal)', 
          display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', 
          transition: 'all 0.3s cubic-bezier(.4, 0, .2, 1)', 
          opacity: animIn ? 1 : 0 
        }} 
        onClick={handleClose}
      >
        {/* Modal Sheet — conditionally renders either main content OR add-exercise panel */}
        <div 
          style={{ 
            background: 'var(--surface)', 
            height: '90dvh', 
            borderTopLeftRadius: 32, borderTopRightRadius: 32, 
            display: 'flex', flexDirection: 'column', 
            transform: animIn ? 'translateY(0)' : 'translateY(100%)', 
            transition: 'transform 0.3s cubic-bezier(.4, 0, .2, 1)',
            overflow: 'hidden'
          }} 
          onClick={e => e.stopPropagation()}
        >
          {addingExercise ? renderAddExercisePanel() : renderMainContent()}
        </div>
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
