// Extracted from the V1 ProfilePage page in V-6 (Kaaya Volt) so both skins
// share one logic core. The logic below is byte-identical to the original
// page code; only its home changed.

import { useState, useMemo, useEffect } from 'react';
import { Flame, Dumbbell, Trophy, Clock } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useDesignVersion } from '../context/DesignVersionContext';
import { useNotifications } from './useNotifications';
import { supabase } from '../../lib/supabaseClient';
import { ACTIVITY } from '../../data/constants';
import { calcBMI, calcBMR, calcTDEE, calcTDEESource } from '../../utils/calculations';
import { exportData } from '../../utils/storage';
import { calcAllMuscleXP, MUSCLE_GROUPS, getOverallRank } from '../../data/muscleData';
import { useScrollRestoration } from './useScrollRestoration';

export function useProfile() {
  useScrollRestoration('/profile');
  const { user, updateProfile, logout, addToast, workoutLogs, splits, getStreak, healthLogs, foodLog, measurements, readinessLog, stepLogs, bodyFatLog, tdeeEstimate, tdeePreferences, setTdeePreferences } = useApp();
  const { preferences, updatePreferences, loading: prefsLoading, pushEnabled, enablePush, disablePush } = useNotifications();
  const { version: designVersion, setVersion: setDesignVersion } = useDesignVersion();
  const [ed, setEd] = useState(false);
  const [f, setF] = useState({ ...user });
  const [confirm, setConfirm] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [showManualTDEEPicker, setShowManualTDEEPicker] = useState(false);

  const [feedbackOpen,    setFeedbackOpen]    = useState(false);
  const [feedbackSubject, setFeedbackSubject] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [includeProfile,  setIncludeProfile]  = useState(true);
  const [feedbackStatus,  setFeedbackStatus]  = useState('idle');

  const handleFeedbackSubmit = async () => {
    if (!feedbackMessage.trim() || feedbackStatus === 'sending') return;
    setFeedbackStatus('sending');

    const meta = includeProfile
      ? `Age: ${user?.age ?? '-'}, Weight: ${user?.weight ?? '-'} kg, Goal: ${user?.weightGoal ?? '-'} kg, Diet: ${user?.dietType ?? '-'}, Activity: ${user?.activity ?? '-'}, Gender: ${user?.gender ?? '-'}`
      : 'Not shared';

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not signed in');

      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-feedback`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            subject: feedbackSubject.trim() || 'General Feedback',
            message: feedbackMessage.trim(),
            meta,
          }),
        }
      );
      if (!res.ok) throw new Error(`Feedback request failed (${res.status})`);
      setFeedbackStatus('sent');
      setFeedbackSubject('');
      setFeedbackMessage('');
      setTimeout(() => setFeedbackStatus('idle'), 4500);
    } catch (err) {
      console.error('[Feedback] Send error:', err);
      setFeedbackStatus('error');
      setTimeout(() => setFeedbackStatus('idle'), 4500);
    }
  };
  
  useEffect(() => {
    if (user && !ed) {
      setF({
        ...user,
        name: user.name || '',
        gender: user.gender || 'male',
        age: user.age ?? '',
        height: user.height ?? '',
        weight: user.weight ?? '',
        weightGoal: user.weightGoal ?? '',
        activity: user.activity || 'moderate',
        workoutDays: user.workoutDays ?? 4,
        dietType: ({ veg: 'vegetarian', jain: 'vegetarian', eggetarian: 'egg' })[user.dietType] || user.dietType || 'vegetarian',
        stepGoal: user.stepGoal ?? 10000,
        waterGoal: user.waterGoal ?? 3000,
      });
    }
  }, [user?.id, user?.weight, user?.height, user?.name, user?.age]);
  
  const unitWeight = user.unitWeight || 'kg';
  const unitHeight = user.unitHeight || 'cm';
  const toggleUnitWeight = async () => await updateProfile({ unitWeight: unitWeight === 'kg' ? 'lbs' : 'kg' });
  const toggleUnitHeight = async () => await updateProfile({ unitHeight: unitHeight === 'cm' ? 'ft' : 'cm' });
  const sf = k => e => setF(p => ({ ...p, [k]: e.target.value }));

  const save = async () => {
    try {
      const safeParse = (v, fn = parseFloat) => {
        if (v === '' || v == null) return null;
        const n = fn(v);
        return Number.isFinite(n) ? n : null;
      };
      const sanitized = {
        name: f.name || '',
        gender: f.gender || 'male',
        age: safeParse(f.age, parseInt),
        weight: safeParse(f.weight),
        height: safeParse(f.height),
        activityLevel: f.activityLevel || f.activity || 'moderate',
        workoutDays: safeParse(f.workoutDays, parseInt) ?? 4,
        stepGoal: safeParse(f.stepGoal, parseInt) ?? 10000,
        waterGoal: safeParse(f.waterGoal, parseInt) ?? 3000,
        dietType: ({ veg: 'vegetarian', jain: 'vegetarian', eggetarian: 'egg' })[f.dietType] || f.dietType || 'vegetarian',
      };

      const result = await updateProfile(sanitized);

      if (!result || result.error) {
        addToast(`Save failed: ${result?.error?.message || 'Unknown error'}`, 'error');
      } else {
        addToast('Profile updated successfully', 'success');
        setEd(false);
      }
    } catch (ex) {
      addToast(`Save crashed: ${ex.message}`, 'error');
      console.error('[ProfilePage] save EXCEPTION:', ex);
    }
  };

  const handleExport = () => { 
    exportData({
      workoutLogs,
      splits,
      healthLogs,
      foodLog,
      measurements,
      readinessLog,
      stepLogs,
      bodyFatLog
    });
    addToast('Data exported!', 'success');
  };

  const bmi = calcBMI(user.weight, user.height);
  const bmr = calcBMR(user.weight, user.height, user.age, user.gender);
  const tdeeConfig = calcTDEESource(user, tdeeEstimate);
  const tdee = tdeeConfig?.value || calcTDEE(bmr, user.activityLevel || 'moderate');

  const latestBFPct = useMemo(() => {
    const logs = bodyFatLog.filter(e => e.userId === user?.id).sort((a, b) => new Date(b.date) - new Date(a.date));
    return logs.length > 0 ? logs[0].percentage : null;
  }, [bodyFatLog, user?.id]);

  // Muscle Mastery Data
  const muscleXP = useMemo(() => calcAllMuscleXP(workoutLogs, splits, user?.id), [workoutLogs, splits, user?.id]);
  const overall = useMemo(() => getOverallRank(muscleXP), [muscleXP]);
  const top4 = useMemo(() => [...MUSCLE_GROUPS].sort((a,b) => (muscleXP[b.key]||0) - (muscleXP[a.key]||0)).slice(0,4), [muscleXP]);

  const lvl = Math.min(99, Math.floor(overall.totalXP / 5000) + 1);

  // Elite Achievements Data
  const streak = getStreak();
  const achievements = useMemo(() => {
    const isHeavyHitter = workoutLogs.filter(l => l.userId === user.id).some(log => 
      log.exercises?.some(ex => ex.sets?.some(s => s.weight >= user.weight * 2.5))
    );
    const monthlyVol = workoutLogs.filter(l => l.userId === user.id).filter(l => {
      const d = new Date(l.date); const now = new Date();
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }).reduce((acc, log) => {
      let v = 0;
      log.exercises?.forEach(ex => ex.sets?.forEach(s => v += (s.weight||0)*(s.reps||0)));
      return acc + v;
    }, 0);

    return [
      { id: 'streak', icon: Flame, label: '7 Day Streak', locked: streak.current < 7, desc: streak.current >= 7 ? `Current streak: ${streak.current}` : 'Log workouts 7 days in a row' },
      { id: 'volume-king', icon: Dumbbell, label: 'Volume King', locked: monthlyVol < 50000, desc: monthlyVol >= 50000 ? 'Moved 50k+ kg this month' : `Monthly volume: ${(monthlyVol/1000).toFixed(1)}k / 50k` },
      { id: 'heavy-hitter', icon: Trophy, label: 'Heavy Hitter', locked: !isHeavyHitter, desc: isHeavyHitter ? 'Lifted 2.5x bodyweight' : 'Lift 2.5x bodyweight in a single set' },
      { id: 'early-bird', icon: Clock, label: 'Early Bird', locked: true, desc: 'Complete a workout before 6 AM' },
    ];
  }, [streak, workoutLogs, user]);

  return { achievements, addToast, bmi, bmr, confirm, designVersion, disablePush, ed, enablePush, f, feedbackMessage, feedbackOpen, feedbackStatus, feedbackSubject, handleExport, handleFeedbackSubmit, includeProfile, latestBFPct, logout, lvl, muscleXP, overall, preferences, prefsLoading, pushEnabled, save, setConfirm, setDesignVersion, setEd, setFeedbackMessage, setFeedbackOpen, setFeedbackSubject, setIncludeProfile, setShowAvatarPicker, setShowManualTDEEPicker, setTdeePreferences, sf, showAvatarPicker, showManualTDEEPicker, streak, tdee, tdeePreferences, toggleUnitHeight, toggleUnitWeight, top4, unitHeight, unitWeight, updatePreferences, user };
}
