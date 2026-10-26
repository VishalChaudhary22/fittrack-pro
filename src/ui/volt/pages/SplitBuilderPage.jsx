import { Plus, Trash2, X, GripVertical } from 'lucide-react';
import { useSplitBuilder } from '../../../core/hooks/useSplitBuilder';
import { ModalPortal } from '../../v1/shared/SharedComponents';
import VoltExercisePicker from '../shared/VoltExercisePicker';
import { VoltBlock, VoltPill, VoltLabel } from '../primitives';

// ─── Kaaya Volt · Split Builder (V-6a) ──────────────────────────────────────
// Same logic core as V1 (useSplitBuilder), Volt presentation. The exercise
// picker is the Volt twin (V-7 popup pack).

const inputStyle = {
  width: '100%', padding: '12px 14px', borderRadius: 12, fontSize: 14.5,
  background: 'var(--v-canvas)', color: 'var(--v-ink)',
  border: '2px solid var(--v-edge-quiet)', outline: 'none', fontFamily: 'inherit',
};
const labelStyle = {
  display: 'block', fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5,
  letterSpacing: '0.14em', color: 'var(--v-dim)', marginBottom: 7, textTransform: 'uppercase',
};

export default function VoltSplitBuilderPage() {
  const {
    activeDayPicker, addDay, days, description, handleAddExercise, isSaving,
    name, navigate, removeDay, removeExercise, saveSplit, setActiveDayPicker,
    setDays, setDescription, setName, setTier, tier,
  } = useSplitBuilder();

  return (
    <div className="v-screen" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <header className="v-rise">
        <button type="button" className="v-press" onClick={() => navigate('/splits')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: "'JetBrains Mono', monospace", fontSize: 11.5, letterSpacing: '0.12em', color: 'var(--v-dim)' }}>
          ← ALL SPLITS
        </button>
        <VoltLabel volt style={{ marginTop: 12 }}>Split Builder — build your own program</VoltLabel>
        <h1 className="v-num" style={{ fontSize: 'clamp(1.9rem, 7vw, 2.8rem)', lineHeight: 1, margin: '8px 0 0', textTransform: 'uppercase' }}>Custom split</h1>
      </header>

      <VoltBlock>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
          <div>
            <label style={labelStyle}>Split name</label>
            <input value={name} onChange={e => setName(e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Description</label>
            <input value={description} onChange={e => setDescription(e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Tier (difficulty)</label>
            <select value={tier} onChange={e => setTier(e.target.value)} style={inputStyle}>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
              <option value="specialty">Specialty</option>
            </select>
          </div>
        </div>
      </VoltBlock>

      <VoltLabel>Schedule</VoltLabel>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {days.map(day => (
          <VoltBlock key={day.id} style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: 'var(--v-canvas)', borderBottom: '2px solid var(--v-edge-quiet)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                <GripVertical size={16} color="var(--v-dim)" />
                <input
                  value={day.name}
                  onChange={e => setDays(prev => prev.map(d => d.id === day.id ? { ...d, name: e.target.value } : d))}
                  style={{ background: 'transparent', border: 'none', outline: 'none', color: 'var(--v-ink)', fontWeight: 700, fontSize: 15, width: 150, fontFamily: 'inherit' }}
                />
                {day.type === 'rest' && <span className="v-chip">Rest Day</span>}
              </div>
              <button type="button" className="v-press" aria-label="Remove day" onClick={() => removeDay(day.id)} style={{ background: 'none', border: 'none', color: 'var(--v-coral-text)', cursor: 'pointer', padding: 6, display: 'flex' }}>
                <Trash2 size={16} />
              </button>
            </div>
            {day.type !== 'rest' && (
              <div style={{ padding: 16 }}>
                {day.exercises.length === 0 ? (
                  <p style={{ textAlign: 'center', padding: '14px 0', color: 'var(--v-dim)', fontSize: 13.5 }}>No exercises added yet.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 9, marginBottom: 14 }}>
                    {day.exercises.map(ex => (
                      <div key={ex.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', border: '2px solid var(--v-edge-quiet)', borderRadius: 12 }}>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--v-ink)' }}>{ex.name}</div>
                          <div style={{ fontSize: 12, color: 'var(--v-dim)', marginTop: 2 }}>{ex.sets} sets × {ex.repsRange} • {ex.muscle}</div>
                        </div>
                        <button type="button" className="v-press" aria-label="Remove exercise" onClick={() => removeExercise(day.id, ex.id)} style={{ background: 'none', border: 'none', color: 'var(--v-dim)', cursor: 'pointer', padding: 6, display: 'flex', flexShrink: 0 }}>
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <VoltPill onClick={() => setActiveDayPicker(day.id)} style={{ width: '100%', minHeight: 50, fontSize: 14 }}>
                  <Plus size={16} /> Add Exercise
                </VoltPill>
              </div>
            )}
          </VoltBlock>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        <VoltPill ghost onClick={() => addDay(false)} style={{ flex: 1, minHeight: 50, fontSize: 14 }}>+ Workout Day</VoltPill>
        <VoltPill ghost onClick={() => addDay(true)} style={{ flex: 1, minHeight: 50, fontSize: 14 }}>+ Rest Day</VoltPill>
      </div>

      <div style={{ position: 'sticky', bottom: 10, zIndex: 5 }}>
        <VoltPill onClick={saveSplit} disabled={isSaving} style={{ width: '100%' }}>
          {isSaving ? 'Saving...' : 'Save Custom Split'}
        </VoltPill>
      </div>

      {activeDayPicker && (
        <ModalPortal>
          <VoltExercisePicker
            onClose={() => setActiveDayPicker(null)}
            onSelect={handleAddExercise}
            excludeIds={days.find(d => d.id === activeDayPicker)?.exercises.map(e => e.exerciseId) || []}
          />
        </ModalPortal>
      )}
    </div>
  );
}
