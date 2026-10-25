import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Dumbbell, GripVertical } from 'lucide-react';
import { useApp } from '../../../core/context/AppContext';
import { PageHeader, ModalPortal } from '../shared/SharedComponents';
import { gId } from '../../../utils/helpers';
import ExercisePicker from '../shared/ExercisePicker';
import { supabase } from '../../../lib/supabaseClient';

export default function SplitBuilderPage() {
  const navigate = useNavigate();
  const { user, setSplits, addToast } = useApp();

  const [name, setName] = useState('My Custom Split');
  const [description, setDescription] = useState('A personalized training program');
  const [tier, setTier] = useState('intermediate');
  
  const [days, setDays] = useState([
    { id: gId(), name: 'Day 1', type: 'custom', exercises: [] },
  ]);

  const [activeDayPicker, setActiveDayPicker] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleAddExercise = (exercise) => {
    setDays(prev => prev.map(d => {
      if (d.id === activeDayPicker) {
        return {
          ...d,
          exercises: [...d.exercises, { ...exercise, id: gId(), sets: 3, repsRange: '8-12' }]
        };
      }
      return d;
    }));
    setActiveDayPicker(null);
  };

  const removeExercise = (dayId, exId) => {
    setDays(prev => prev.map(d => {
      if (d.id === dayId) {
        return { ...d, exercises: d.exercises.filter(e => e.id !== exId) };
      }
      return d;
    }));
  };

  const addDay = (isRest = false) => {
    const nextNum = days.length + 1;
    setDays(prev => [
      ...prev, 
      { 
        id: gId(), 
        name: isRest ? 'Rest' : `Day ${nextNum}`, 
        type: isRest ? 'rest' : 'custom', 
        exercises: [] 
      }
    ]);
  };

  const removeDay = (dayId) => {
    setDays(prev => prev.filter(d => d.id !== dayId));
  };

  const saveSplit = async () => {
    if (!name.trim()) return addToast('Please enter a split name', 'error');
    if (days.length === 0) return addToast('Please add at least one day', 'error');
    
    setIsSaving(true);
    
    const schedule = days.map(d => d.name);
    
    const newSplit = {
      id: gId(),
      name,
      description,
      tier,
      icon: 'Dumbbell',
      schedule,
      days,
      isCustom: true
    };

    try {
      // Sync to cloud if user is logged in
      if (user?.id) {
        await supabase.from('user_splits').insert({
          user_id: user.id,
          data: newSplit,
          is_custom: true,
          split_definition: newSplit
        });
      }

      setSplits(prev => [...prev, newSplit]);
      addToast('Custom split created!', 'success');
      navigate('/splits');
    } catch (e) {
      console.error('Failed to save split', e);
      addToast('Failed to save split', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="pg-in" style={{ paddingBottom: 100 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <button onClick={() => navigate(-1)} style={{ background: 'var(--surface-container-high)', border: 'none', width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--on-surface)' }}>
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="headline-lg" style={{ fontSize: 22 }}>Custom Split</h1>
          <div style={{ fontSize: 13, color: 'var(--on-surface-variant)' }}>Build your own program</div>
        </div>
      </div>

      <div style={{ background: 'var(--surface-container-low)', padding: 20, borderRadius: 16, marginBottom: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--on-surface-variant)', marginBottom: 8, display: 'block' }}>SPLIT NAME</label>
          <input 
            value={name} 
            onChange={e => setName(e.target.value)}
            style={{ width: '100%', padding: '12px 16px', background: 'var(--surface-container-highest)', border: 'none', borderRadius: 12, color: 'var(--on-surface)', fontSize: 15, fontFamily: "'Be Vietnam Pro', sans-serif" }}
          />
        </div>
        
        <div>
          <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--on-surface-variant)', marginBottom: 8, display: 'block' }}>DESCRIPTION</label>
          <input 
            value={description} 
            onChange={e => setDescription(e.target.value)}
            style={{ width: '100%', padding: '12px 16px', background: 'var(--surface-container-highest)', border: 'none', borderRadius: 12, color: 'var(--on-surface)', fontSize: 14, fontFamily: "'Be Vietnam Pro', sans-serif" }}
          />
        </div>

        <div>
          <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--on-surface-variant)', marginBottom: 8, display: 'block' }}>TIER (DIFFICULTY)</label>
          <select 
            value={tier} 
            onChange={e => setTier(e.target.value)}
            style={{ width: '100%', padding: '12px 16px', background: 'var(--surface-container-highest)', border: 'none', borderRadius: 12, color: 'var(--on-surface)', fontSize: 14, fontFamily: "'Be Vietnam Pro', sans-serif", appearance: 'none' }}
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
            <option value="specialty">Specialty</option>
          </select>
        </div>
      </div>

      <div style={{ marginBottom: 24 }}>
        <h2 className="headline-md" style={{ fontSize: 18, marginBottom: 16 }}>Schedule</h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {days.map((day) => (
            <div key={day.id} style={{ background: 'var(--surface-container-low)', borderRadius: 16, overflow: 'hidden' }}>
              <div style={{ padding: '12px 16px', background: 'var(--surface-container)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--surface-container-highest)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <GripVertical size={16} color="var(--on-surface-dim)" />
                  <input 
                    value={day.name}
                    onChange={e => setDays(prev => prev.map(d => d.id === day.id ? { ...d, name: e.target.value } : d))}
                    style={{ background: 'transparent', border: 'none', color: 'var(--on-surface)', fontWeight: 600, fontSize: 15, width: 150, fontFamily: "'Be Vietnam Pro', sans-serif" }}
                  />
                  {day.type === 'rest' && <span className="tag" style={{ background: 'var(--surface-container-highest)', color: 'var(--on-surface-dim)' }}>Rest Day</span>}
                </div>
                <button onClick={() => removeDay(day.id)} style={{ background: 'none', border: 'none', color: 'var(--error)' }}>
                  <Trash2 size={16} />
                </button>
              </div>

              {day.type !== 'rest' && (
                <div style={{ padding: 16 }}>
                  {day.exercises.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '20px 0', color: 'var(--on-surface-dim)', fontSize: 13 }}>
                      No exercises added yet.
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
                      {day.exercises.map((ex) => (
                        <div key={ex.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: 'var(--surface-container-highest)', borderRadius: 12 }}>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--on-surface)' }}>{ex.name}</div>
                            <div style={{ fontSize: 12, color: 'var(--on-surface-variant)', marginTop: 2 }}>{ex.sets} sets × {ex.repsRange} • {ex.muscle}</div>
                          </div>
                          <button onClick={() => removeExercise(day.id, ex.id)} style={{ background: 'none', border: 'none', color: 'var(--on-surface-dim)', padding: 4 }}>
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <button 
                    onClick={() => setActiveDayPicker(day.id)}
                    style={{ width: '100%', padding: '12px', background: 'var(--primary-container)', color: 'var(--primary)', border: 'none', borderRadius: 12, fontWeight: 600, fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer' }}
                  >
                    <Plus size={16} /> Add Exercise
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
          <button onClick={() => addDay(false)} style={{ flex: 1, padding: '14px', background: 'var(--surface-container-high)', color: 'var(--on-surface)', border: 'none', borderRadius: 12, fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
            + Workout Day
          </button>
          <button onClick={() => addDay(true)} style={{ flex: 1, padding: '14px', background: 'var(--surface-container-high)', color: 'var(--on-surface-variant)', border: 'none', borderRadius: 12, fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
            + Rest Day
          </button>
        </div>
      </div>

      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, padding: '16px 24px 32px', background: 'var(--surface)', borderTop: '1px solid var(--surface-container)', zIndex: 10 }}>
        <button 
          onClick={saveSplit}
          disabled={isSaving}
          style={{ width: '100%', padding: '16px', background: 'linear-gradient(135deg, var(--primary), var(--primary-dark, #FF7043))', color: '#fff', border: 'none', borderRadius: 16, fontWeight: 700, fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: 'var(--glow-primary)', cursor: 'pointer', opacity: isSaving ? 0.7 : 1 }}
        >
          {isSaving ? 'Saving...' : 'Save Custom Split'}
        </button>
      </div>

      {activeDayPicker && (
        <ModalPortal>
          <ExercisePicker 
            onClose={() => setActiveDayPicker(null)} 
            onSelect={handleAddExercise} 
            excludeIds={days.find(d => d.id === activeDayPicker)?.exercises.map(e => e.exerciseId) || []}
          />
        </ModalPortal>
      )}
    </div>
  );
}
