import React, { useState } from 'react';
import { Portal } from '../../v1/shared/SharedComponents';
import { QuestConfirmDialog } from './QuestShared';
import { QuestBtn, QuestLabel } from '../primitives';
import PixelSprite from '../PixelSprite';
import { tod } from '../../../utils/helpers';
import { MUSCLE_GROUPS } from '../../../data/muscleData';

// ─── Kaaya Quest · Edit Session sheet (plan §7.5, Q-6) ──────────────────────
// Quest twin of VoltEditWorkoutModal — draft state, save filtering, split /
// custom add-exercise flows and the remove-exercise confirm are identical.
// Presentation: a tall Quest sheet; sets are slot rows, the remove-exercise
// confirm is the Quest YES/NO menu.

const qMiniInput = {
  width: '100%', minHeight: 44, padding: '6px 8px', background: 'var(--q-panel)',
  border: '3px solid var(--q-border)', color: 'var(--q-ink)', textAlign: 'center',
  fontFamily: "'VT323', monospace", fontSize: 19, boxSizing: 'border-box',
};
const qSelect = {
  width: '100%', minHeight: 50, padding: '8px 12px', background: 'var(--q-slot)',
  border: '3px solid var(--q-border)', color: 'var(--q-ink)',
  fontFamily: "'VT323', monospace", fontSize: 19, boxSizing: 'border-box',
};

export default function QuestEditWorkoutModal({ log, splits, onSave, onClose }) {
  const [draft, setDraft] = useState(() => JSON.parse(JSON.stringify(log)));
  const [saving, setSaving] = useState(false);
  const [addingExercise, setAddingExercise] = useState(false); // false | 'split' | 'custom'

  const [customName, setCustomName] = useState('');
  const [customMuscle, setCustomMuscle] = useState(MUSCLE_GROUPS[0].key);
  const [customSets, setCustomSets] = useState(3);

  const [confirmDelEx, setConfirmDelEx] = useState(null);

  const handleSave = async () => {
    setSaving(true);
    const finalDraft = {
      ...draft,
      exercises: draft.exercises.map(ex => ({
        ...ex,
        sets: (ex.sets || []).filter(s => s.reps !== '' || s.weight !== ''),
      })),
    };
    try {
      await onSave(finalDraft);
      onClose();
    } catch (e) {
      console.error('Save failed', e);
      setSaving(false);
    }
  };

  const handleAddFromSplit = (ex) => {
    const defSets = Array.from({ length: ex.sets || 3 }).map(() => ({ reps: '', weight: '', done: false }));
    setDraft(prev => ({
      ...prev,
      exercises: [...prev.exercises, { name: ex.name, primaryMuscle: ex.primaryMuscle || ex.muscle, sets: defSets }],
    }));
    setAddingExercise(false);
  };

  const handleAddCustom = () => {
    if (!customName) return;
    const defSets = Array.from({ length: customSets }).map(() => ({ reps: '', weight: '', done: false }));
    const mLabel = MUSCLE_GROUPS.find(m => m.key === customMuscle)?.label || customMuscle;
    setDraft(prev => ({
      ...prev,
      exercises: [...prev.exercises, { name: customName, primaryMuscle: customMuscle, muscle: mLabel, sets: defSets }],
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
      <div style={{ padding: '16px 18px 13px', borderBottom: '3px solid var(--q-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexShrink: 0 }}>
        <div>
          <div className="q-ps" style={{ fontSize: 14, lineHeight: 1.5 }}>{(draft.dayName || 'SESSION').toUpperCase()}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginTop: 11 }}>
            <span className="q-chip" style={{ gap: 7 }}>
              <PixelSprite name="clock" size={13} />
              <input type="date" max={tod()} value={draft.date} onChange={e => setDraft({ ...draft, date: e.target.value })} aria-label="Session date" style={{ background: 'transparent', border: 'none', color: 'var(--q-ink)', fontSize: 17, fontFamily: "'VT323', monospace", outline: 'none', padding: 0 }} />
            </span>
            <span className="q-chip" style={{ gap: 7 }}>
              <input
                type="number"
                value={durationVal}
                onChange={e => setDraft({ ...draft, durationMinutes: parseInt(e.target.value) || 0 })}
                aria-label="Duration in minutes"
                style={{ width: 44, background: 'transparent', border: 'none', color: 'var(--q-ink)', textAlign: 'right', fontSize: 17, fontFamily: "'VT323', monospace", padding: 0, outline: 'none' }}
              />
              <span style={{ color: 'var(--q-dim)' }}>MIN</span>
            </span>
          </div>
        </div>
        <button type="button" aria-label="Close" className="q-chip" style={{ cursor: 'pointer', padding: '7px 9px', flexShrink: 0 }} onClick={onClose}><PixelSprite name="x" size={13} /></button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 18px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
          {draft.exercises.map((ex, exIdx) => (
            <section key={`${ex.name}-${exIdx}`} className="q-block q-block--slot" style={{ position: 'relative', padding: 13 }}>
              <button type="button" aria-label={`Remove ${ex.name}`} className="q-chip" style={{ position: 'absolute', top: 9, right: 9, cursor: 'pointer', padding: '6px 8px', color: 'var(--q-ember-text)' }} onClick={() => setConfirmDelEx(exIdx)}><PixelSprite name="x" size={12} /></button>
              <div style={{ paddingRight: 36, marginBottom: 11 }}>
                <div style={{ fontSize: 19, fontWeight: 700, lineHeight: 1.3 }}>{ex.name}</div>
                <div style={{ fontSize: 17, color: 'var(--q-volt-text)' }}>{ex.primaryMuscle || ex.muscle || 'General'}</div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '38px 1fr 1fr 34px', gap: 7, marginBottom: 7, padding: '0 6px' }}>
                <QuestLabel>Set</QuestLabel><QuestLabel>Reps</QuestLabel><QuestLabel>KG</QuestLabel><div />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                {(ex.sets || []).map((set, sIdx) => {
                  const isNew = set.reps === '' && set.weight === '';
                  return (
                    <div key={sIdx} style={{ display: 'grid', gridTemplateColumns: '38px 1fr 1fr 34px', gap: 7, alignItems: 'center', padding: '0 6px', opacity: isNew ? 0.7 : 1 }}>
                      <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--q-dim)' }}>{sIdx + 1}</div>
                      <input type="number" placeholder="—" value={set.reps} aria-label={`Set ${sIdx + 1} reps`} onChange={e => {
                        const r = e.target.value;
                        const ne = [...draft.exercises];
                        ne[exIdx].sets[sIdx].reps = r ? parseInt(r) : '';
                        setDraft({ ...draft, exercises: ne });
                      }} style={qMiniInput} />
                      <input type="number" step="0.5" placeholder="—" value={set.weight} aria-label={`Set ${sIdx + 1} weight`} onChange={e => {
                        const w = e.target.value;
                        const ne = [...draft.exercises];
                        ne[exIdx].sets[sIdx].weight = w ? parseFloat(w) : '';
                        setDraft({ ...draft, exercises: ne });
                      }} style={qMiniInput} />
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {ex.sets.length > 1 && (
                          <button type="button" aria-label="Remove set" style={{ background: 'transparent', border: 'none', color: 'var(--q-dim)', padding: 4, cursor: 'pointer', display: 'flex' }} onClick={() => {
                            const ne = [...draft.exercises];
                            ne[exIdx].sets.splice(sIdx, 1);
                            setDraft({ ...draft, exercises: ne });
                          }}><PixelSprite name="x" size={13} /></button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              <button type="button" style={{ width: 'calc(100% - 12px)', margin: '11px 6px 0', padding: '9px', background: 'transparent', border: '3px dashed var(--q-dim)', color: 'var(--q-dim)', fontFamily: "'VT323', monospace", fontSize: 18, cursor: 'pointer' }} onClick={() => {
                const ne = [...draft.exercises];
                ne[exIdx].sets.push({ reps: '', weight: '', done: false });
                setDraft({ ...draft, exercises: ne });
              }}>+ ADD SET</button>
            </section>
          ))}
        </div>

        <div style={{ marginTop: 18 }}>
          <QuestLabel>Session Notes</QuestLabel>
          <textarea value={draft.notes || ''} onChange={e => setDraft({ ...draft, notes: e.target.value })} placeholder="How did it feel?" rows={3} className="q-slot-input" style={{ marginTop: 7, resize: 'vertical', width: '100%' }} />
        </div>

        <QuestBtn tone="ghost" style={{ width: '100%', marginTop: 16 }} onClick={() => setAddingExercise(dayDef ? 'split' : 'custom')}>
          <PixelSprite name="plus" size={14} /> ADD EXERCISE
        </QuestBtn>
      </div>

      <div style={{ padding: '13px 18px 16px', borderTop: '3px solid var(--q-border)', display: 'flex', gap: 10, flexShrink: 0, alignItems: 'center' }}>
        <button type="button" style={{ padding: '10px 8px', background: 'transparent', color: 'var(--q-ember-text)', fontSize: 19, fontFamily: "'VT323', monospace", border: 'none', cursor: 'pointer', minHeight: 48 }} onClick={onClose}>DISCARD</button>
        {hasChanges ? (
          <QuestBtn tone="ember" style={{ flex: 1, opacity: saving ? 0.7 : 1 }} onClick={!saving ? handleSave : undefined}>{saving ? 'SAVING…' : 'SAVE CHANGES'}</QuestBtn>
        ) : (
          <QuestBtn tone="ghost" style={{ flex: 1 }} onClick={onClose}>CLOSE</QuestBtn>
        )}
      </div>
    </>
  );

  const renderAddExercisePanel = () => (
    <>
      <div style={{ padding: '16px 18px 13px', borderBottom: '3px solid var(--q-border)', display: 'flex', alignItems: 'center', gap: 13, flexShrink: 0 }}>
        <button type="button" aria-label="Back" className="q-chip" style={{ cursor: 'pointer', padding: '7px 9px' }} onClick={() => setAddingExercise(false)}><PixelSprite name="chevL" size={13} /></button>
        <div className="q-ps" style={{ fontSize: 14 }}>ADD EXERCISE</div>
      </div>

      <div style={{ display: 'flex', padding: '13px 18px 0', gap: 8, flexShrink: 0 }}>
        {dayDef && (
          <button type="button" onClick={() => setAddingExercise('split')} className="q-btn q-btn--sm" style={addingExercise === 'split' ? { flex: 1 } : { flex: 1, background: 'var(--q-panel)', color: 'var(--q-dim)', boxShadow: '4px 4px 0 rgba(0,0,0,0.45)' }}>FROM SPLIT</button>
        )}
        <button type="button" onClick={() => setAddingExercise('custom')} className="q-btn q-btn--sm" style={addingExercise === 'custom' ? { flex: 1 } : { flex: 1, background: 'var(--q-panel)', color: 'var(--q-dim)', boxShadow: '4px 4px 0 rgba(0,0,0,0.45)' }}>CUSTOM</button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '14px 18px 18px' }}>
        {addingExercise === 'split' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
            {availableFromSplit.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 36, color: 'var(--q-dim)', fontSize: 19 }}>All exercises from this split day are already added.</div>
            ) : availableFromSplit.map(ex => (
              <button
                key={ex.name}
                type="button"
                className="q-sheet-row"
                style={{ width: '100%', textAlign: 'left', borderLeft: '6px solid var(--q-volt)' }}
                onClick={() => handleAddFromSplit(ex)}
              >
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ display: 'block', fontSize: 19, fontWeight: 700, lineHeight: 1.3 }}>{ex.name}</span>
                  <span style={{ display: 'block', fontSize: 17, color: 'var(--q-dim)', marginTop: 2 }}>{ex.muscle || ex.primaryMuscle} · {ex.sets} sets × {ex.repsRange || 'max'}</span>
                </span>
                <PixelSprite name="plus" size={15} />
              </button>
            ))}
          </div>
        )}

        {addingExercise === 'custom' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
            <div>
              <QuestLabel>Exercise Name</QuestLabel>
              <input type="text" value={customName} onChange={e => setCustomName(e.target.value)} className="q-slot-input" style={{ marginTop: 7 }} placeholder="e.g. Bicep Curl" />
            </div>
            <div>
              <QuestLabel>Primary Muscle</QuestLabel>
              <select value={customMuscle} onChange={e => setCustomMuscle(e.target.value)} style={{ ...qSelect, marginTop: 7 }}>
                {MUSCLE_GROUPS.map(m => <option key={m.key} value={m.key}>{m.label}</option>)}
              </select>
            </div>
            <div>
              <QuestLabel>Sets</QuestLabel>
              <input type="number" value={customSets} onChange={e => setCustomSets(parseInt(e.target.value) || 1)} className="q-slot-input" style={{ marginTop: 7 }} />
            </div>
            <QuestBtn
              style={{ width: '100%', marginTop: 2, opacity: customName ? 1 : 0.5 }}
              onClick={customName ? handleAddCustom : undefined}
            >
              ADD TO SESSION
            </QuestBtn>
          </div>
        )}
      </div>
    </>
  );

  return (
    <Portal>
      <div className="q-sheet-wrap" onClick={onClose}>
        <div
          className="q-sheet"
          role="dialog"
          aria-modal="true"
          aria-label="Edit session"
          onClick={e => e.stopPropagation()}
          style={{ height: '92vh', maxHeight: '92vh', width: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: 0 }}
        >
          {addingExercise ? renderAddExercisePanel() : renderMainContent()}
        </div>
      </div>

      <QuestConfirmDialog open={confirmDelEx !== null} title="Remove Exercise?" message="Are you sure you want to remove this exercise?" onConfirm={() => {
        const ne = [...draft.exercises];
        ne.splice(confirmDelEx, 1);
        setDraft({ ...draft, exercises: ne });
        setConfirmDelEx(null);
      }} onCancel={() => setConfirmDelEx(null)} confirmLabel="Remove" danger />
    </Portal>
  );
}
