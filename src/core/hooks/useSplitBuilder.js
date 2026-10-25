// Extracted from the V1 SplitBuilderPage page in V-6 (Kaaya Volt) so both skins
// share one logic core. The logic below is byte-identical to the original
// page code; only its home changed.

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { gId } from '../../utils/helpers';
import { supabase } from '../../lib/supabaseClient';

export function useSplitBuilder() {
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

  return { activeDayPicker, addDay, days, description, handleAddExercise, isSaving, name, navigate, removeDay, removeExercise, saveSplit, setActiveDayPicker, setDays, setDescription, setName, setTier, tier };
}
