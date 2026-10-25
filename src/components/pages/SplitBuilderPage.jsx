import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { ModalPortal } from '../shared/SharedComponents';
import { Screen, Sec, LedgerRow, Note, TLink, Action } from '../shared/Margin';
import { gId } from '../../utils/helpers';
import ExercisePicker from '../shared/ExercisePicker';
import { supabase } from '../../lib/supabaseClient';

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
    <Screen kicker="Custom Split" right={<TLink onClick={() => navigate(-1)}>Back</TLink>}>
      <p className="meta" style={{ marginBottom: 8 }}>Build your own program</p>

      <Sec n="01" label="Details">
        <div className="field">
          <span>Split name</span>
          <input className="input" value={name} onChange={e => setName(e.target.value)} />
        </div>
        <div className="field">
          <span>Description</span>
          <input className="input" value={description} onChange={e => setDescription(e.target.value)} />
        </div>
        <div className="field">
          <span>Tier (difficulty)</span>
          <select className="input" value={tier} onChange={e => setTier(e.target.value)}>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
            <option value="specialty">Specialty</option>
          </select>
        </div>
      </Sec>

      <Sec n="02" label="Schedule" right={`${days.length} ${days.length === 1 ? 'day' : 'days'}`}>
        {days.map((day, idx) => (
          <div key={day.id} style={{ marginBottom: 30 }}>
            <div className="field">
              <span>{day.type === 'rest' ? 'Rest day' : `Day ${idx + 1}`}</span>
              <input
                className="input"
                value={day.name}
                onChange={e => setDays(prev => prev.map(d => d.id === day.id ? { ...d, name: e.target.value } : d))}
              />
            </div>

            {day.type !== 'rest' && (
              day.exercises.length === 0 ? (
                <Note>No exercises added yet.</Note>
              ) : (
                day.exercises.map((ex) => (
                  <div key={ex.id}>
                    <LedgerRow k={ex.name} v={`${ex.sets} sets × ${ex.repsRange}`} sub={ex.muscle ? ` · ${ex.muscle}` : ''} />
                    <div className="rowf" style={{ justifyContent: 'flex-end', marginTop: -6, paddingBottom: 10 }}>
                      <TLink onClick={() => removeExercise(day.id, ex.id)} style={{ color: 'var(--bad)' }}>Remove</TLink>
                    </div>
                  </div>
                ))
              )
            )}

            <div className="rowf g12" style={{ marginTop: 10 }}>
              {day.type !== 'rest' && <TLink onClick={() => setActiveDayPicker(day.id)}>+ Add exercise</TLink>}
              <TLink onClick={() => removeDay(day.id)} style={{ color: 'var(--bad)' }}>Remove day</TLink>
            </div>
          </div>
        ))}

        <div className="rowf g12">
          <TLink onClick={() => addDay(false)}>+ Workout day</TLink>
          <TLink onClick={() => addDay(true)}>+ Rest day</TLink>
        </div>
      </Sec>

      <Action ember onClick={saveSplit} disabled={isSaving}>
        {isSaving ? 'Saving…' : 'Save custom split'}
      </Action>

      {activeDayPicker && (
        <ModalPortal>
          <ExercisePicker
            onClose={() => setActiveDayPicker(null)}
            onSelect={handleAddExercise}
            excludeIds={days.find(d => d.id === activeDayPicker)?.exercises.map(e => e.exerciseId) || []}
          />
        </ModalPortal>
      )}
    </Screen>
  );
}
