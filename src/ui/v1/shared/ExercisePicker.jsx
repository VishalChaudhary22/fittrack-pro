import { useState, useMemo } from 'react';
import { Search, X } from 'lucide-react';
import { EXERCISE_LIBRARY, ALL_MUSCLES } from '../../../data/exerciseLibrary';

export default function ExercisePicker({ 
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

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 600,
        background: 'var(--glass-bg-heavy, rgba(0,0,0,0.7))',
        backdropFilter: 'var(--glass-blur-sm, blur(8px))',
        display: 'flex', flexDirection: 'column',
      }}
      onClick={onClose}
    >
      <style>{`
        @keyframes slideUpModal {
          from { transform: translateY(100%); }
          to   { transform: translateY(0); }
        }
      `}</style>
      <div
        style={{
          marginTop: 'auto',
          background: 'var(--surface-container)',
          borderTopLeftRadius: '24px', borderTopRightRadius: '24px',
          height: '85vh', display: 'flex', flexDirection: 'column',
          animation: 'slideUpModal 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ padding: '24px 24px 16px', borderBottom: '1px solid var(--surface-container-highest)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 className="headline-md" style={{ fontSize: 20 }}>{title}</h2>
            <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--on-surface-variant)', padding: 4 }}>
              <X size={24} />
            </button>
          </div>
          
          {customHeaderContent}

          <div style={{ position: 'relative', marginBottom: 16 }}>
            <Search size={18} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--on-surface-dim)' }} />
            <input
              type="text"
              placeholder="Search exercises..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: '100%', padding: '12px 16px 12px 42px',
                background: 'var(--surface-container-highest)', border: 'none',
                borderRadius: 12, color: 'var(--on-surface)',
                fontFamily: "'Be Vietnam Pro', sans-serif", fontSize: 14
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 8, msOverflowStyle: 'none', scrollbarWidth: 'none' }} className="hide-scrollbar">
            <button
              onClick={() => setMuscleFilter(null)}
              style={{
                padding: '6px 16px', borderRadius: 20, whiteSpace: 'nowrap',
                background: !muscleFilter ? 'var(--primary)' : 'var(--surface-container-high)',
                color: !muscleFilter ? '#fff' : 'var(--on-surface)',
                border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer'
              }}
            >
              All
            </button>
            {ALL_MUSCLES.map(m => (
              <button
                key={m}
                onClick={() => setMuscleFilter(m)}
                style={{
                  padding: '6px 16px', borderRadius: 20, whiteSpace: 'nowrap',
                  background: muscleFilter === m ? 'var(--primary)' : 'var(--surface-container-high)',
                  color: muscleFilter === m ? '#fff' : 'var(--on-surface)',
                  border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer'
                }}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filteredExercises.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--on-surface-variant)', marginTop: 40, fontSize: 14 }}>
              No exercises found.
            </div>
          ) : (
            filteredExercises.map(ex => (
              <div
                key={ex.exerciseId}
                onClick={() => onSelect(ex)}
                style={{
                  padding: 16, background: 'var(--surface-container-low)',
                  borderRadius: 16, display: 'flex', justifyContent: 'space-between',
                  alignItems: 'center', cursor: 'pointer',
                  border: '1px solid transparent', transition: 'border-color 0.2s'
                }}
                onMouseOver={e => e.currentTarget.style.borderColor = 'var(--primary-container)'}
                onMouseOut={e => e.currentTarget.style.borderColor = 'transparent'}
              >
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--on-surface)', marginBottom: 4 }}>{ex.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
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
