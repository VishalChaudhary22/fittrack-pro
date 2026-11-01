import { useState, useMemo } from 'react';
import { Portal } from '../../v1/shared/SharedComponents';
import { EXERCISE_LIBRARY, ALL_MUSCLES } from '../../../data/exerciseLibrary';
import { QuestLabel } from '../primitives';
import PixelSprite from '../PixelSprite';

// ─── Kaaya Quest · Exercise picker — the item list sheet (plan §7.5, Q-6) ──
// Quest twin of VoltExercisePicker: identical props, search and filtering,
// presented as a tall bottom sheet with cartridge filter chips and item
// rows. Used first by the Split Builder loadout.

export default function QuestExercisePicker({
  onSelect,
  onClose,
  title = 'Select Exercise',
  excludeIds = [],
  customHeaderContent = null,
}) {
  const [search, setSearch] = useState('');
  const [muscleFilter, setMuscleFilter] = useState(null);

  const filteredExercises = useMemo(() => {
    return EXERCISE_LIBRARY.filter(ex => {
      if (excludeIds.includes(ex.exerciseId)) return false;
      if (muscleFilter && ex.muscle !== muscleFilter) return false;
      if (search) {
        const query = search.toLowerCase();
        return ex.name.toLowerCase().includes(query) || ex.muscle.toLowerCase().includes(query);
      }
      return true;
    });
  }, [search, muscleFilter, excludeIds]);

  const filterChip = (active) => ({
    cursor: 'pointer', flexShrink: 0,
    ...(active ? { background: 'var(--q-volt)', color: 'var(--q-btn-fg)', borderColor: 'var(--q-border)' } : {}),
  });

  return (
    <Portal>
      <div className="q-sheet-wrap" onClick={onClose}>
        <div
          className="q-sheet"
          role="dialog"
          aria-modal="true"
          aria-label={title}
          onClick={e => e.stopPropagation()}
          style={{ height: '88vh', maxHeight: '88vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: 0, width: '100%' }}
        >
          <div style={{ padding: '18px 18px 13px', borderBottom: '3px solid var(--q-border)', flexShrink: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 13 }}>
              <span className="q-ps" style={{ fontSize: 13 }}>{title.toUpperCase()}</span>
              <button type="button" onClick={onClose} aria-label="Close" className="q-chip" style={{ cursor: 'pointer', padding: '7px 9px' }}>
                <PixelSprite name="x" size={13} />
              </button>
            </div>

            {customHeaderContent}

            <input
              className="q-slot-input"
              type="text"
              placeholder="Search exercises..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              aria-label="Search exercises"
            />

            <div style={{ display: 'flex', gap: 7, overflowX: 'auto', paddingBottom: 2, marginTop: 12, scrollbarWidth: 'none' }} className="hide-scrollbar">
              <button type="button" onClick={() => setMuscleFilter(null)} className="q-chip" style={filterChip(!muscleFilter)}>
                ALL
              </button>
              {ALL_MUSCLES.map(m => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMuscleFilter(m)}
                  className="q-chip"
                  style={filterChip(muscleFilter === m)}
                >
                  {m.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '14px 18px 20px', display: 'flex', flexDirection: 'column', gap: 9 }}>
            {filteredExercises.length === 0 ? (
              <div style={{ textAlign: 'center', color: 'var(--q-dim)', marginTop: 40, fontSize: 19 }}>
                No exercises found.
              </div>
            ) : (
              filteredExercises.map(ex => (
                <button
                  key={ex.exerciseId}
                  type="button"
                  onClick={() => onSelect(ex)}
                  className="q-sheet-row"
                  style={{ width: '100%', textAlign: 'left' }}
                >
                  <span style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ display: 'block', fontWeight: 700, fontSize: 19, lineHeight: 1.3 }}>{ex.name}</span>
                    <QuestLabel style={{ marginTop: 3 }}>{ex.muscle}</QuestLabel>
                  </span>
                  <PixelSprite name="plus" size={15} />
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    </Portal>
  );
}
