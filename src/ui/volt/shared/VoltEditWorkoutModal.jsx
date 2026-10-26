import React, { useState, useEffect } from 'react';
import { Calendar, Clock, X, Plus, ChevronLeft } from 'lucide-react';
import { ModalPortal } from '../../v1/shared/SharedComponents';
import { VoltConfirmDialog } from './VoltShared';
import { VoltPill, VoltLabel } from '../primitives';
import { tod } from '../../../utils/helpers';
import { MUSCLE_GROUPS } from '../../../data/muscleData';

// Volt twin of V1's EditWorkoutModal — draft state, save filtering, split /
// custom add-exercise flows and the remove-exercise confirm are identical.
// Presentation: Volt sheet on the drawer curve, bordered exercise panels.
const inputStyle = {
  width: '100%', padding: '12px 14px', borderRadius: 12,
  background: 'var(--v-canvas)', border: '2.5px solid var(--v-edge)',
  color: 'var(--v-ink)', fontSize: 14.5, fontWeight: 600, outline: 'none',
};

const chipStyle = {
  background: 'var(--v-canvas)', border: '2px solid var(--v-edge-quiet)',
  padding: '5px 12px', borderRadius: 999, display: 'flex', alignItems: 'center', gap: 6,
};

export default function VoltEditWorkoutModal({ log, splits, onSave, onClose }) {
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

  const renderMainContent = () => (
    <>
      {/* Header */}
      <div style={{ padding: '10px 20px 14px', borderBottom: '2px solid var(--v-edge-quiet)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexShrink: 0 }}>
        <div>
          <div style={{ fontSize: 19, fontWeight: 800, letterSpacing: '-0.01em', marginBottom: 8 }}>{draft.dayName}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <div style={chipStyle}>
              <Calendar size={13} color="var(--v-volt-text)" />
              <input type="date" max={tod()} value={draft.date} onChange={e => setDraft({ ...draft, date: e.target.value })} style={{ background: 'transparent', border: 'none', color: 'var(--v-ink)', fontSize: 12.5, fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif", outline: 'none' }} />
            </div>
            <div style={chipStyle}>
              <Clock size={13} color="var(--v-volt-text)" />
              <input
                type="number"
                value={durationVal}
                onChange={e => setDraft({ ...draft, durationMinutes: parseInt(e.target.value) || 0 })}
                style={{
                  width: 42, background: 'transparent', border: 'none',
                  color: 'var(--v-ink)', textAlign: 'right',
                  fontWeight: 700, fontSize: 12.5, fontFamily: "'Space Grotesk', sans-serif",
                  padding: 0, outline: 'none',
                }}
              />
              <span style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--v-dim)', fontFamily: "'Space Grotesk', sans-serif" }}>min</span>
            </div>
          </div>
        </div>
        <button aria-label="Close" className="v-press" style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--v-canvas)', color: 'var(--v-ink)', border: '2.5px solid var(--v-edge)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }} onClick={handleClose}><X size={16} /></button>
      </div>

      {/* Scrollable Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '18px 20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {draft.exercises.map((ex, exIdx) => (
            <div key={`${ex.name}-${exIdx}`} style={{ padding: 14, background: 'var(--v-canvas)', border: '2px solid var(--v-edge-quiet)', borderRadius: 18, position: 'relative' }}>
              <button aria-label={`Remove ${ex.name}`} className="v-press" style={{ position: 'absolute', top: 10, right: 10, width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--v-coral)', color: 'var(--v-coral-text)', background: 'transparent', cursor: 'pointer' }} onClick={() => setConfirmDelEx(exIdx)}><X size={13} /></button>
              <div style={{ paddingRight: 34, marginBottom: 12 }}>
                <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 2 }}>{ex.name}</div>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--v-volt-text)' }}>{ex.primaryMuscle || ex.muscle || 'General'}</div>
              </div>

              {/* Sets Table */}
              <div style={{ display: 'grid', gridTemplateColumns: '40px 1fr 1fr 40px', gap: 8, marginBottom: 8, padding: '0 8px' }}>
                <VoltLabel>Set</VoltLabel><VoltLabel>Reps</VoltLabel><VoltLabel>KG</VoltLabel><div></div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {(ex.sets || []).map((set, sIdx) => {
                  const isNew = set.reps === '' && set.weight === '';
                  return (
                    <div key={sIdx} style={{ display: 'grid', gridTemplateColumns: '40px 1fr 1fr 40px', gap: 8, alignItems: 'center', padding: '0 8px', opacity: isNew ? 0.7 : 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--v-dim)' }}>{sIdx + 1}</div>
                      <input type="number" placeholder="—" value={set.reps} onChange={e => {
                        const r = e.target.value;
                        const ne = [...draft.exercises];
                        ne[exIdx].sets[sIdx].reps = r ? parseInt(r) : '';
                        setDraft({ ...draft, exercises: ne });
                      }} style={{ width: '100%', background: 'var(--v-panel)', border: '2px solid var(--v-edge-quiet)', borderRadius: 9, padding: '8px', color: 'var(--v-ink)', fontSize: 14, fontWeight: 600, textAlign: 'center', outline: 'none' }} />
                      <input type="number" step="0.5" placeholder="—" value={set.weight} onChange={e => {
                        const w = e.target.value;
                        const ne = [...draft.exercises];
                        ne[exIdx].sets[sIdx].weight = w ? parseFloat(w) : '';
                        setDraft({ ...draft, exercises: ne });
                      }} style={{ width: '100%', background: 'var(--v-panel)', border: '2px solid var(--v-edge-quiet)', borderRadius: 9, padding: '8px', color: 'var(--v-ink)', fontSize: 14, fontWeight: 600, textAlign: 'center', outline: 'none' }} />
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {(ex.sets.length > 1) && (
                          <button aria-label="Remove set" style={{ background: 'transparent', border: 'none', color: 'var(--v-dim)', padding: 4, cursor: 'pointer' }} onClick={() => {
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
              <button className="v-press" style={{ width: 'calc(100% - 16px)', margin: '12px 8px 0', padding: '9px', background: 'transparent', border: '2px dashed var(--v-edge-quiet)', borderRadius: 9, color: 'var(--v-dim)', fontSize: 12, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }} onClick={() => {
                const ne = [...draft.exercises];
                ne[exIdx].sets.push({ reps: '', weight: '', done: false });
                setDraft({ ...draft, exercises: ne });
              }}><Plus size={14} /> Add Set</button>
            </div>
          ))}
        </div>

        {/* Notes */}
        <div style={{ padding: 14, border: '2px solid var(--v-edge-quiet)', marginTop: 20, borderRadius: 18 }}>
          <VoltLabel>Session Notes</VoltLabel>
          <textarea value={draft.notes || ''} onChange={e => setDraft({ ...draft, notes: e.target.value })} placeholder="How did it feel?" rows={3} style={{ width: '100%', background: 'var(--v-canvas)', border: '2px solid var(--v-edge-quiet)', borderRadius: 12, padding: 12, color: 'var(--v-ink)', fontSize: 14, resize: 'vertical', marginTop: 8, outline: 'none' }} />
        </div>

        {/* Add Exercise Trigger */}
        <VoltPill ghost style={{ width: '100%', marginTop: 20 }} onClick={() => setAddingExercise(dayDef ? 'split' : 'custom')}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}><Plus size={16} /> Add Exercise</span>
        </VoltPill>
      </div>

      {/* Footer */}
      <div style={{ padding: '14px 20px calc(20px + env(safe-area-inset-bottom, 0px))', borderTop: '2px solid var(--v-edge-quiet)', display: 'flex', gap: 10, flexShrink: 0, alignItems: 'center' }}>
        <button style={{ padding: '12px 10px', borderRadius: 12, background: 'transparent', color: 'var(--v-coral-text)', fontSize: 14.5, fontWeight: 700, border: 'none', cursor: 'pointer', minHeight: 48 }} onClick={handleClose}>Discard</button>
        {hasChanges ? (
          <VoltPill style={{ flex: 1, opacity: saving ? 0.7 : 1 }} onClick={!saving ? handleSave : undefined}>{saving ? 'Saving...' : 'Save Changes'}</VoltPill>
        ) : (
          <VoltPill ghost style={{ flex: 1 }} onClick={handleClose}>Close</VoltPill>
        )}
      </div>
    </>
  );

  const tabPill = (active) => ({
    flex: 1, padding: '10px', borderRadius: 999, fontSize: 13, fontWeight: 700,
    border: '2.5px solid var(--v-edge)', cursor: 'pointer', minHeight: 44,
    background: active ? 'var(--v-volt)' : 'var(--v-canvas)',
    color: active ? '#141416' : 'var(--v-ink)',
  });

  const renderAddExercisePanel = () => (
    <>
      {/* Sub-panel Header */}
      <div style={{ padding: '10px 20px 14px', borderBottom: '2px solid var(--v-edge-quiet)', display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0 }}>
        <button aria-label="Back" className="v-press" style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--v-canvas)', color: 'var(--v-ink)', border: '2.5px solid var(--v-edge)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} onClick={() => setAddingExercise(false)}><ChevronLeft size={17} /></button>
        <div style={{ fontSize: 19, fontWeight: 800, letterSpacing: '-0.01em' }}>Add Exercise</div>
      </div>

      {/* Split / Custom Tabs */}
      <div style={{ display: 'flex', padding: '14px 20px', gap: 8, flexShrink: 0 }}>
        {dayDef && (
          <button style={tabPill(addingExercise === 'split')} onClick={() => setAddingExercise('split')}>From Split</button>
        )}
        <button style={tabPill(addingExercise === 'custom')} onClick={() => setAddingExercise('custom')}>Custom</button>
      </div>

      {/* Sub-panel Scrollable Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px calc(20px + env(safe-area-inset-bottom, 0px))' }}>
        {addingExercise === 'split' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {availableFromSplit.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 40, color: 'var(--v-dim)', fontSize: 13.5 }}>All exercises from this split day are already added.</div>
            ) : availableFromSplit.map(ex => (
              <div
                key={ex.name}
                className="v-press"
                role="button"
                tabIndex={0}
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleAddFromSplit(ex); } }}
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', cursor: 'pointer', background: 'var(--v-canvas)', border: '2px solid var(--v-edge-quiet)', borderLeft: '5px solid var(--v-volt)', borderRadius: 14 }}
                onClick={() => handleAddFromSplit(ex)}
              >
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 3 }}>{ex.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--v-dim)' }}>{ex.muscle || ex.primaryMuscle} · {ex.sets} sets × {ex.repsRange || 'max'}</div>
                </div>
                <Plus size={20} color="var(--v-volt-text)" />
              </div>
            ))}
          </div>
        )}

        {addingExercise === 'custom' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <VoltLabel>Exercise Name</VoltLabel>
              <input type="text" value={customName} onChange={e => setCustomName(e.target.value)} style={{ ...inputStyle, marginTop: 6 }} placeholder="e.g. Bicep Curl" />
            </div>
            <div>
              <VoltLabel>Primary Muscle</VoltLabel>
              <select value={customMuscle} onChange={e => setCustomMuscle(e.target.value)} style={{ ...inputStyle, marginTop: 6 }}>
                {MUSCLE_GROUPS.map(m => <option key={m.key} value={m.key}>{m.label}</option>)}
              </select>
            </div>
            <div>
              <VoltLabel>Sets</VoltLabel>
              <input type="number" value={customSets} onChange={e => setCustomSets(parseInt(e.target.value) || 1)} style={{ ...inputStyle, marginTop: 6 }} />
            </div>
            <VoltPill
              style={{ width: '100%', marginTop: 4, opacity: customName ? 1 : 0.5 }}
              onClick={customName ? handleAddCustom : undefined}
            >
              Add to Session
            </VoltPill>
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
          background: 'rgba(0,0,0,0.65)',
          zIndex: 1200,
          display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center',
          transition: 'opacity 0.3s ease',
          opacity: animIn ? 1 : 0
        }}
        onClick={handleClose}
      >
        {/* Modal Sheet — conditionally renders either main content OR add-exercise panel */}
        <div
          style={{
            background: 'var(--v-panel)', color: 'var(--v-ink)',
            height: '92dvh', width: '100%', maxWidth: 480,
            borderTop: '2.5px solid var(--v-edge)', borderLeft: '2.5px solid var(--v-edge)', borderRight: '2.5px solid var(--v-edge)',
            borderTopLeftRadius: 26, borderTopRightRadius: 26,
            boxShadow: '0 -6px 0 var(--v-shadow)',
            display: 'flex', flexDirection: 'column',
            transform: animIn ? 'translateY(0)' : 'translateY(100%)',
            transition: 'transform 0.34s cubic-bezier(0.32, 0.72, 0, 1)',
            overflow: 'hidden'
          }}
          onClick={e => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
        >
          <div aria-hidden="true" style={{ width: 44, height: 5, borderRadius: 3, background: 'var(--v-edge)', opacity: .45, margin: '10px auto 0', flexShrink: 0 }} />
          {addingExercise ? renderAddExercisePanel() : renderMainContent()}
        </div>
      </div>

      <VoltConfirmDialog open={confirmDelEx !== null} title="Remove Exercise?" message="Are you sure you want to remove this exercise?" onConfirm={() => {
        const ne = [...draft.exercises];
        ne.splice(confirmDelEx, 1);
        setDraft({ ...draft, exercises: ne });
        setConfirmDelEx(null);
      }} onCancel={() => setConfirmDelEx(null)} confirmLabel="Remove" danger />
    </ModalPortal>
  );
}
