import { useSplitBuilder } from '../../../core/hooks/useSplitBuilder';
import QuestExercisePicker from '../shared/QuestExercisePicker';
import { QuestBlock, QuestBtn, QuestChip, QuestLabel } from '../primitives';
import PixelSprite from '../PixelSprite';

// ─── Kaaya Quest · Split Builder — the loadout (plan §7.5, Q-6) ────────────
// Same brain as V1/Volt (useSplitBuilder), Quest presentation: days are
// inventory slots, exercises are items inside them, and Add Exercise opens
// the item list sheet (QuestExercisePicker).

const qSelect = {
  width: '100%', minHeight: 50, padding: '8px 12px', background: 'var(--q-slot)',
  border: '3px solid var(--q-border)', color: 'var(--q-ink)',
  fontFamily: "'VT323', monospace", fontSize: 19, boxSizing: 'border-box',
};

export default function SplitBuilderPage() {
  const {
    activeDayPicker, addDay, days, description, handleAddExercise, isSaving,
    name, navigate, removeDay, removeExercise, saveSplit, setActiveDayPicker,
    setDays, setDescription, setName, setTier, tier,
  } = useSplitBuilder();

  return (
    <div className="q-screen" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <header>
        <button type="button" onClick={() => navigate('/splits')} className="q-chip" style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 7, padding: '8px 11px' }}>
          <PixelSprite name="chevL" size={12} /> ALL SPLITS
        </button>
        <QuestLabel tone="volt" style={{ marginTop: 14 }}>Split Builder — Build Your Own Program</QuestLabel>
        <h1 className="q-ps" style={{ fontSize: 'clamp(19px, 6vw, 30px)', lineHeight: 1.35, margin: '10px 0 0' }}>LOADOUT BUILDER</h1>
      </header>

      <QuestBlock>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
          <div>
            <QuestLabel>Split Name</QuestLabel>
            <input className="q-slot-input" value={name} onChange={e => setName(e.target.value)} style={{ marginTop: 7 }} />
          </div>
          <div>
            <QuestLabel>Description</QuestLabel>
            <input className="q-slot-input" value={description} onChange={e => setDescription(e.target.value)} style={{ marginTop: 7 }} />
          </div>
          <div>
            <QuestLabel>Tier (Difficulty)</QuestLabel>
            <select value={tier} onChange={e => setTier(e.target.value)} style={{ ...qSelect, marginTop: 7 }} aria-label="Tier">
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
              <option value="specialty">Specialty</option>
            </select>
          </div>
        </div>
      </QuestBlock>

      <QuestLabel tone="volt">Schedule — Inventory Slots</QuestLabel>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {days.map(day => (
          <QuestBlock key={day.id} style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '11px 14px', background: 'var(--q-slot)', borderBottom: '3px solid var(--q-border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                <PixelSprite name="dots" size={15} />
                <input
                  value={day.name}
                  onChange={e => setDays(prev => prev.map(d => d.id === day.id ? { ...d, name: e.target.value } : d))}
                  aria-label="Day name"
                  style={{ background: 'transparent', border: 'none', outline: 'none', color: 'var(--q-ink)', fontWeight: 700, fontSize: 20, width: 150, fontFamily: "'VT323', monospace" }}
                />
                {day.type === 'rest' && <QuestChip>REST DAY</QuestChip>}
              </div>
              <button type="button" aria-label="Remove day" onClick={() => removeDay(day.id)} className="q-chip" style={{ cursor: 'pointer', padding: '7px 9px', color: 'var(--q-ember-text)' }}>
                <PixelSprite name="x" size={13} />
              </button>
            </div>
            {day.type !== 'rest' && (
              <div style={{ padding: 14 }}>
                {day.exercises.length === 0 ? (
                  <p style={{ textAlign: 'center', padding: '12px 0', color: 'var(--q-dim)', fontSize: 19 }}>Slot empty — no items yet.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 9, marginBottom: 13 }}>
                    {day.exercises.map(ex => (
                      <QuestBlock key={ex.id} variant="slot" flat style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px' }}>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontWeight: 700, fontSize: 19, lineHeight: 1.3 }}>{ex.name}</div>
                          <div style={{ fontSize: 17, color: 'var(--q-dim)', marginTop: 2 }}>{ex.sets} sets × {ex.repsRange} • {ex.muscle}</div>
                        </div>
                        <button type="button" aria-label="Remove exercise" onClick={() => removeExercise(day.id, ex.id)} className="q-chip" style={{ cursor: 'pointer', padding: '7px 9px', flexShrink: 0 }}>
                          <PixelSprite name="x" size={13} />
                        </button>
                      </QuestBlock>
                    ))}
                  </div>
                )}
                <QuestBtn onClick={() => setActiveDayPicker(day.id)} style={{ width: '100%' }}>
                  <PixelSprite name="plus" size={14} /> ADD EXERCISE
                </QuestBtn>
              </div>
            )}
          </QuestBlock>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        <QuestBtn tone="ghost" onClick={() => addDay(false)} style={{ flex: 1 }}>+ WORKOUT DAY</QuestBtn>
        <QuestBtn tone="ghost" onClick={() => addDay(true)} style={{ flex: 1 }}>+ REST DAY</QuestBtn>
      </div>

      <div style={{ position: 'sticky', bottom: 92, zIndex: 5 }}>
        <QuestBtn tone="ember" onClick={saveSplit} disabled={isSaving} style={{ width: '100%' }}>
          {isSaving ? 'SAVING…' : 'SAVE LOADOUT'}
        </QuestBtn>
      </div>

      {activeDayPicker && (
        <QuestExercisePicker
          onClose={() => setActiveDayPicker(null)}
          onSelect={handleAddExercise}
          excludeIds={days.find(d => d.id === activeDayPicker)?.exercises.map(e => e.exerciseId) || []}
        />
      )}
    </div>
  );
}
