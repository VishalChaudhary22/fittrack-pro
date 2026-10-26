import { useState, useMemo } from 'react';
import { Search, X } from 'lucide-react';
import { EXERCISE_LIBRARY, ALL_MUSCLES } from '../../../data/exerciseLibrary';

// Volt twin of V1's ExercisePicker — identical props, search and filtering.
// Presentation: Volt bottom sheet (85dvh), muscle filters as Volt pills,
// results as bordered rows.
export default function VoltExercisePicker({
  onSelect,
  onClose,
  title = 'Select Exercise',
  excludeIds = [],
  customHeaderContent = null
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

  const filterPill = (active) => ({
    padding: '7px 15px', borderRadius: 999, whiteSpace: 'nowrap',
    border: '2.5px solid var(--v-edge)',
    background: active ? 'var(--v-volt)' : 'var(--v-canvas)',
    color: active ? '#141416' : 'var(--v-ink)',
    fontSize: 12.5, fontWeight: 700, cursor: 'pointer', minHeight: 36,
  });

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 1200,
        background: 'rgba(0,0,0,0.62)',
        display: 'flex', flexDirection: 'column',
      }}
      onClick={onClose}
    >
      <div
        className="v-sheet-up"
        style={{
          marginTop: 'auto',
          background: 'var(--v-panel)', color: 'var(--v-ink)',
          borderTop: '2.5px solid var(--v-edge)', borderLeft: '2.5px solid var(--v-edge)', borderRight: '2.5px solid var(--v-edge)',
          borderRadius: '24px 24px 0 0',
          boxShadow: '0 -6px 0 var(--v-shadow)',
          height: '85dvh', display: 'flex', flexDirection: 'column',
          width: '100%', maxWidth: 480, marginLeft: 'auto', marginRight: 'auto',
        }}
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div aria-hidden="true" style={{ width: 44, height: 5, borderRadius: 3, background: 'var(--v-edge)', opacity: .45, margin: '12px auto 0' }} />
        <div style={{ padding: '16px 20px 14px', borderBottom: '2px solid var(--v-edge-quiet)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <h2 style={{ fontSize: 19, fontWeight: 800, letterSpacing: '-0.01em', margin: 0 }}>{title}</h2>
            <button onClick={onClose} aria-label="Close" className="v-press" style={{ background: 'var(--v-canvas)', border: '2.5px solid var(--v-edge)', width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--v-ink)' }}>
              <X size={16} />
            </button>
          </div>

          {customHeaderContent}

          <div style={{ position: 'relative', marginBottom: 14 }}>
            <Search size={17} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--v-dim)' }} />
            <input
              type="text"
              placeholder="Search exercises..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: '100%', padding: '12px 16px 12px 42px',
                background: 'var(--v-canvas)', border: '2.5px solid var(--v-edge)',
                borderRadius: 12, color: 'var(--v-ink)',
                fontSize: 14, outline: 'none',
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4, scrollbarWidth: 'none' }} className="hide-scrollbar">
            <button onClick={() => setMuscleFilter(null)} className="v-press" style={filterPill(!muscleFilter)}>
              All
            </button>
            {ALL_MUSCLES.map(m => (
              <button
                key={m}
                onClick={() => setMuscleFilter(m)}
                className="v-press"
                style={filterPill(muscleFilter === m)}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px calc(20px + env(safe-area-inset-bottom, 0px))', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filteredExercises.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--v-dim)', marginTop: 40, fontSize: 14 }}>
              No exercises found.
            </div>
          ) : (
            filteredExercises.map(ex => (
              <div
                key={ex.exerciseId}
                onClick={() => onSelect(ex)}
                className="v-press"
                style={{
                  padding: '14px 16px', background: 'var(--v-canvas)',
                  border: '2px solid var(--v-edge-quiet)', borderRadius: 14,
                  display: 'flex', justifyContent: 'space-between',
                  alignItems: 'center', cursor: 'pointer',
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14.5, marginBottom: 3 }}>{ex.name}</div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--v-dim)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    {ex.muscle}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
