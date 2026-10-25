// Extracted from the V1 SplitsPage page in V-6 (Kaaya Volt) so both skins
// share one logic core. The logic below is byte-identical to the original
// page code; only its home changed.

import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Repeat, Zap, Target, Dumbbell, Trophy, Home, Award, Flame, Sprout, Wrench } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { gId } from '../../utils/helpers';
import { useScrollRestoration } from './useScrollRestoration';

export function useSplits() {
  useScrollRestoration('/splits');
  const { user, splits, setSplits, setActiveSplitId, addToast, workoutLogs } = useApp();
  const navigate = useNavigate();
  const isAdmin = user.isAdmin;
  
  const [activeTier, setActiveTier] = useState(() => {
    const activeSplit = splits.find(s => s.id === user.activeSplitId);
    return activeSplit?.tier || 'intermediate';
  });

  const [exp, setExp] = useState(null);
  const [expDay, setExpDay] = useState(null);
  const [editEx, setEditEx] = useState(null);
  const [addEx, setAddEx] = useState(null);
  const [newEx, setNewEx] = useState({ name: '', sets: 3, repsRange: '8-12', muscle: '', notes: '' });
  const [addSp, setAddSp] = useState(false);
  const [ns, setNs] = useState({ name: '', icon: 'Dumbbell', description: '' });

  const ICON_MAP = { Repeat, Zap, Target, Dumbbell, Trophy, Home, Award, Flame };
  const getIcon = (name) => ICON_MAP[name] || Dumbbell;
  const [confirm, setConfirm] = useState(null);

  const activeSplitRef = useRef(null);

  useEffect(() => {
    if (activeSplitRef.current) {
      activeSplitRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [activeTier]);

  const TIERS = [
    { key: 'beginner',     label: 'Beginner',     Icon: Sprout,  weeks: '3–4 days/week', tagline: 'Build the foundation',    desc: 'First 6 months, new to structured training' },
    { key: 'intermediate', label: 'Intermediate', Icon: Zap,     weeks: '4–6 days/week', tagline: 'Accelerate the gains',    desc: '6 months – 2 years, consistent training history' },
    { key: 'advanced',     label: 'Advanced',     Icon: Flame,   weeks: '6 days/week',   tagline: 'Maximum performance',      desc: '2+ years, ready for high frequency & volume' },
    { key: 'specialty',    label: 'Specialty',    Icon: Wrench,  weeks: 'Variable',      tagline: 'Beyond the weights',       desc: 'Home training, yoga, and powerlifting programs' },
  ];

  const pick = (split) => {
    if (split.comingSoon) return;
    
    // Check advanced tier requirement
    if (split.tier === 'advanced') {
      const userWorkoutDays = user.workoutDays || 0;
      const totalLogs = workoutLogs ? workoutLogs.length : 0;
      if (userWorkoutDays < 4 && totalLogs < 30) {
        setConfirm({
          title: 'Advanced split selected',
          message: 'This program is designed for athletes with 2+ years of consistent training. Based on your history, you may find Intermediate splits more effective and sustainable right now. Continue anyway?',
          confirmLabel: "Yes, I'm ready",
          onConfirm: () => activateSplit(split.id),
          onCancel: () => setConfirm(null)
        });
        return;
      }
    }
    
    activateSplit(split.id);
  };

  const activateSplit = (sid) => {
    setActiveSplitId(sid);
    addToast('Split activated! Redirecting to tracker...', 'success');
    setTimeout(() => navigate('/workout'), 250);
  };

  const updEx = (sId, dId, eId, data) => setSplits(p => p.map(s => s.id !== sId ? s : { ...s, days: s.days.map(d => d.id !== dId ? d : { ...d, exercises: d.exercises.map(e => e.id !== eId ? e : { ...e, ...data }) }) }));
  const delEx = (sId, dId, eId) => {
    setConfirm({
      title: 'Delete Exercise?', message: 'This exercise will be removed from the split.',
      danger: true, confirmLabel: 'Delete',
      onConfirm: () => {
        setSplits(p => p.map(s => s.id !== sId ? s : { ...s, days: s.days.map(d => d.id !== dId ? d : { ...d, exercises: d.exercises.filter(e => e.id !== eId) }) }));
        setConfirm(null);
        addToast('Exercise removed', 'info');
      },
    });
  };
  const addExFn = (sId, dId) => {
    const e = { id: gId(), ...newEx, sets: parseInt(newEx.sets) };
    setSplits(p => p.map(s => s.id !== sId ? s : { ...s, days: s.days.map(d => d.id !== dId ? d : { ...d, exercises: [...d.exercises, e] }) }));
    setNewEx({ name: '', sets: 3, repsRange: '8-12', muscle: '', notes: '' });
    setAddEx(null);
    addToast('Exercise added!', 'success');
  };
  const addSpFn = () => {
    // Add default tier assigned as activeTier
    const s = { id: gId(), ...ns, color: '#E8540D', tier: activeTier, schedule: ['Day 1', 'Rest'], days: [{ id: gId(), name: 'Day 1', type: 'custom', exercises: [] }, { id: gId(), name: 'Rest', type: 'rest', exercises: [] }] };
    setSplits(p => [...p, s]);
    setNs({ name: '', icon: 'Dumbbell', description: '' });
    setAddSp(false);
    addToast('New split created!', 'success');
  };

  const activeTierObj = TIERS.find(t => t.key === activeTier);
  const tieredSplits = splits.filter(s => s.tier === activeTier);

  return { ICON_MAP, TIERS, activeSplitRef, activeTier, activeTierObj, addEx, addExFn, addSp, addSpFn, confirm, delEx, editEx, exp, expDay, getIcon, isAdmin, navigate, newEx, ns, pick, setActiveTier, setAddEx, setAddSp, setEditEx, setExp, setExpDay, setNewEx, setNs, splits, tieredSplits, updEx, user };
}
