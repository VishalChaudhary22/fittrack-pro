import { useState, useMemo, useEffect } from 'react';
import { LogOut, Download, Share2, Flame, Dumbbell, Trophy, Camera, Shield, Link, Bike, MessageSquare, ChevronDown, CheckCircle, AlertCircle, Bell } from 'lucide-react';
import emailjs from '@emailjs/browser';
import { useApp } from '../../context/AppContext';
import { ConfirmDialog, ThemeTogglePill, ScrollPicker, ModalPortal } from '../shared/SharedComponents';
import { ACTIVITY } from '../../data/constants';
import { calcBMI, getBMICat, calcBMR, calcTDEE, calcTDEESource } from '../../utils/calculations';
import { kgToLbs, cmToFtIn } from '../../utils/helpers';
import { exportData } from '../../utils/storage';
import { calcAllMuscleXP, getRank, MUSCLE_GROUPS, getOverallRank } from '../../data/muscleData';
import { useScrollRestoration } from '../../hooks/useScrollRestoration';
import { useNotifications } from '../../hooks/useNotifications';
import { Screen, Sec, LedgerRow, Action, Note, Word, TLink } from '../shared/Margin';


const PRESETS = [
  { id: 'iron-man', name: 'Iron Man', universe: 'Marvel' },
  { id: 'captain-america', name: 'Captain America', universe: 'Marvel' },
  { id: 'black-panther', name: 'Black Panther', universe: 'Marvel' },
  { id: 'doctor-strange', name: 'Doctor Strange', universe: 'Marvel' },
  { id: 'wonder-woman', name: 'Wonder Woman', universe: 'DC' },
  { id: 'batman', name: 'Batman', universe: 'DC' },
  { id: 'superman', name: 'Superman', universe: 'DC' },
  { id: 'aquaman', name: 'Aquaman', universe: 'DC' },
  { id: 'aang', name: 'Aang', universe: 'Avatar TLA' },
  { id: 'zuko', name: 'Zuko', universe: 'Avatar TLA' },
  { id: 'toph', name: 'Toph', universe: 'Avatar TLA' },
  { id: 'katara', name: 'Katara', universe: 'Avatar TLA' },
];

function AvatarPickerModal({ open, onClose }) {
  const [tab, setTab] = useState('Marvel');
  const { user, updateProfile } = useApp();

  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape') onClose(); };
    if (open) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [open, onClose]);

  if (!open) return null;

  const handlePreset = async (id) => {
    const url = `/avatars/${id}.png`;
    await updateProfile({ avatarUrl: url, avatarType: 'preset' });
    onClose();
  };

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
      const reader = new FileReader();
      reader.onload = async (e) => {
        const img = new Image();
        img.onload = async () => {
          const canvas = document.createElement('canvas');
          let w = img.width, h = img.height;
          if (w > h) { if (w > 400) { h *= 400 / w; w = 400; } }
          else { if (h > 400) { w *= 400 / h; h = 400; } }
          canvas.width = w; canvas.height = h;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
          await updateProfile({ avatarUrl: dataUrl, avatarType: 'upload' });
          onClose();
        };
        img.src = e.target.result;
      };
    reader.readAsDataURL(file);
  };

  const tabs = ['Marvel', 'DC', 'Avatar TLA', 'Upload'];
  const filtered = PRESETS.filter(p => p.universe === tab);

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(24px)', zIndex: 'var(--z-modal)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={onClose}>
      <div style={{ width: '100%', maxWidth: '500px', margin: '0 20px', background: 'var(--surface-container-low)', borderRadius: '24px', padding: '24px 20px', maxHeight: '80vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 24, overflowX: 'auto', paddingBottom: 4 }}>
          {tabs.map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ padding: '8px 16px', borderRadius: '12px', border: 'none', background: tab === t ? 'var(--primary)' : 'var(--surface-container-highest)', color: tab === t ? 'var(--on-primary)' : 'var(--on-surface)', fontFamily: "'Space Grotesk', sans-serif", fontSize: '12px', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>{t}</button>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          {tab !== 'Upload' ? filtered.map(p => {
             const url = `/avatars/${p.id}.png`;
             const isSelected = user.avatarUrl === url;
             return (
               <div key={p.id} onClick={() => handlePreset(p.id)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                 <img src={url} style={{ width: 80, height: 80, borderRadius: 16, objectFit: 'cover', border: isSelected ? '2px solid var(--primary)' : '2px solid transparent', boxShadow: isSelected ? 'var(--glow-primary)' : 'none' }} />
                 <span style={{ fontSize: 10, color: 'var(--on-surface-variant)', fontWeight: 600, textAlign: 'center' }}>{p.name}</span>
               </div>
             )
          }) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
               <label style={{ width: 80, height: 80, borderRadius: 16, background: 'var(--surface-container-highest)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                 <Camera size={24} color="var(--on-surface-variant)" />
                 <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleUpload} />
               </label>
               <span style={{ fontSize: 10, color: 'var(--on-surface-variant)', fontWeight: 600, textAlign: 'center' }}>Upload</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  useScrollRestoration('/profile');
  const { user, updateProfile, logout, addToast, workoutLogs, splits, getStreak, healthLogs, foodLog, measurements, readinessLog, stepLogs, bodyFatLog, tdeeEstimate, tdeePreferences, setTdeePreferences } = useApp();
  const { preferences, updatePreferences, loading: prefsLoading, pushEnabled, enablePush, disablePush } = useNotifications();
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
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        {
          from_name:  user?.name   || 'Kaaya Fit User',
          from_email: user?.email  || 'anonymous',
          subject:    feedbackSubject.trim() || 'General Feedback',
          message:    feedbackMessage.trim(),
          user_id:    user?.id     || 'unknown',
          meta,
        },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );
      setFeedbackStatus('sent');
      setFeedbackSubject('');
      setFeedbackMessage('');
      setTimeout(() => setFeedbackStatus('idle'), 4500);
    } catch (err) {
      console.error('[Feedback] EmailJS error:', err);
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
        dietType: user.dietType || 'veg',
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
        dietType: f.dietType || 'veg',
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
      { id: 'streak', label: '7 Day Streak', locked: streak.current < 7, desc: streak.current >= 7 ? `Current streak: ${streak.current}` : 'Log workouts 7 days in a row' },
      { id: 'volume-king', label: 'Volume King', locked: monthlyVol < 50000, desc: monthlyVol >= 50000 ? 'Moved 50k+ kg this month' : `Monthly volume: ${(monthlyVol/1000).toFixed(1)}k / 50k` },
      { id: 'heavy-hitter', label: 'Heavy Hitter', locked: !isHeavyHitter, desc: isHeavyHitter ? 'Lifted 2.5x bodyweight' : 'Lift 2.5x bodyweight in a single set' },
      { id: 'early-bird', label: 'Early Bird', locked: true, desc: 'Complete a workout before 6 AM' },
    ];
  }, [streak, workoutLogs, user]);

  return (
    <>
      <Screen
        kicker="Profile"
        right={<span className="kicker" style={{ color: 'var(--bone)' }}>{user.name?.split(' ')[0]}</span>}
      >
        {/* Hero */}
        <Sec n="01" label="You">
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div
              style={{ position: 'relative', width: 72, height: 72, borderRadius: 18, overflow: 'hidden', background: 'var(--surface-container)', border: '1px solid var(--hair)', cursor: 'pointer' }}
              onClick={() => setShowAvatarPicker(true)}
            >
              {user.avatarUrl ? <img src={user.avatarUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Space Grotesk', sans-serif", fontSize: 24, fontWeight: 700, color: 'var(--ash)' }}>{user.avatar || user.name?.[0]}</div>}
            </div>
            <div style={{ flex: 1 }}>
              <div className="h1" style={{ fontSize: 28 }}>{user.name}</div>
              <div className="rowf g12 mt6">
                <span className="meta"><Shield size={10} style={{ marginRight: 4 }} />{overall.name}</span>
                <span className="meta">Level {lvl}</span>
              </div>
            </div>
            <TLink onClick={() => setEd(!ed)}>{ed ? 'Cancel' : 'Edit'}</TLink>
          </div>
          <div className="rowf g12 mt18" style={{ flexWrap: 'wrap' }}>
            <TLink onClick={() => addToast('Profile shared!', 'success')}><Share2 size={12} style={{ marginRight: 6 }} />Share</TLink>
            <TLink onClick={handleExport}><Download size={12} style={{ marginRight: 6 }} />Export</TLink>
            <ThemeTogglePill />
          </div>
        </Sec>

        {/* Stats */}
        <Sec n="02" label="Vitals" right={`${getBMICat(bmi).label}`}>
          <LedgerRow k="BMI" v={bmi || '—'} />
          <LedgerRow k="Body fat" v={latestBFPct ? `${latestBFPct.toFixed(1)}%` : '—'} tone="sm" />
          <LedgerRow k="BMR" v={`${bmr} kcal`} tone="sm" />
          <LedgerRow k="TDEE" v={`${tdee} kcal`} tone="sm" />
        </Sec>

        {/* Muscle Mastery */}
        <Sec n="03" label="Muscle mastery" right={`${overall.name}`}>
          {top4.map((m) => {
            const xp = muscleXP[m.key] || 0;
            const rank = getRank(xp);
            const pct = Math.max(2, rank.progress * 100);
            return (
              <div key={m.key} style={{ marginTop: 14 }}>
                <div className="rowf between">
                  <span style={{ fontSize: 13, color: 'var(--bone)' }}>{m.label}</span>
                  <span className="meta">{rank.name} · {Math.floor(xp).toLocaleString()} XP</span>
                </div>
                <div style={{ height: 1, background: 'var(--hair)', marginTop: 10, position: 'relative' }}>
                  <div style={{ position: 'absolute', left: 0, top: 0, height: 1, width: `${pct}%`, background: 'var(--ember)' }} />
                </div>
              </div>
            );
          })}
        </Sec>

        {/* Achievements */}
        <Sec n="04" label="Achievements" right={`${achievements.filter(a => !a.locked).length}/${achievements.length}`}>
          {achievements.map(a => (
            <LedgerRow
              key={a.id}
              k={a.label}
              dim={a.locked}
              v={a.locked ? <span className="word idle">Locked</span> : <span className="word ok">Unlocked</span>}
            />
          ))}
        </Sec>

        {/* Details */}
        <Sec n="05" label="Details">
          <LedgerRow k="Name" v={ed ? <input className="field-inline" value={f.name} onChange={sf('name')} /> : user.name} />
          <LedgerRow k="Email" v={user.email} tone="sm" />
          <LedgerRow k="Gender" v={ed ? (
            <select className="field-inline" value={f.gender} onChange={sf('gender')} style={{ width: 'auto' }}>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          ) : (user.gender || '—')} tone="sm" />
          <LedgerRow k={unitWeight === 'lbs' ? 'Weight (lbs)' : 'Weight (kg)'} v={ed ? <input className="field-inline" type="number" value={f.weight || ''} onChange={sf('weight')} /> : (user.weight ? (unitWeight === 'lbs' ? kgToLbs(user.weight) : user.weight) : '—')} tone="sm" />
          <LedgerRow k={unitHeight === 'ft' ? 'Height (ft/in)' : 'Height (cm)'} v={ed ? <input className="field-inline" type="number" value={f.height || ''} onChange={sf('height')} /> : (user.height ? (unitHeight === 'ft' ? cmToFtIn(user.height) : user.height) : '—')} tone="sm" />
          <LedgerRow k="Age" v={ed ? <input className="field-inline" type="number" value={f.age || ''} onChange={sf('age')} /> : (user.age || '—')} tone="sm" />
          <LedgerRow k="Workout days/week" v={ed ? <input className="field-inline" type="number" value={f.workoutDays || ''} onChange={sf('workoutDays')} /> : (user.workoutDays || '—')} tone="sm" />
          <LedgerRow k="Activity" v={ed ? (
            <select className="field-inline" value={f.activityLevel || f.activity} onChange={sf('activityLevel')} style={{ width: 'auto' }}>
              {Object.entries(ACTIVITY).map(([k,v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
          ) : (ACTIVITY[user.activityLevel || 'moderate']?.label || '—')} tone="sm" />
          <div className="rowf g16 mt18">
            <TLink onClick={toggleUnitWeight}>{unitWeight === 'kg' ? 'Switch to lbs' : 'Switch to kg'}</TLink>
            <TLink onClick={toggleUnitHeight}>{unitHeight === 'cm' ? 'Switch to ft/in' : 'Switch to cm'}</TLink>
          </div>
          {ed && <Action onClick={save} style={{ marginTop: 18 }}>Save changes</Action>}
        </Sec>

        {/* Connected */}
        <Sec n="06" label="Connected">
          <LedgerRow k="Fitbit" v="Connect" onClick={() => { window.location.href = `/fitbit/authorize?state=${user.id}`; }} />
          <LedgerRow k="Strava" v="Connect" onClick={() => { window.location.href = `/strava/authorize?state=${user.id}`; }} />
        </Sec>

        {/* Notifications */}
        <Sec n="07" label="Notifications">
          {!pushEnabled ? (
            <Action onClick={enablePush}>Enable push notifications</Action>
          ) : (
            <LedgerRow k="Push" v={<Word tone="ok">Enabled</Word>} onClick={disablePush} />
          )}
        </Sec>

        {/* Feedback */}
        <Sec n="08" label="Feedback">
          <Action onClick={() => setFeedbackOpen(!feedbackOpen)}>{feedbackOpen ? 'Close' : 'Send feedback / report bug'}</Action>
          {feedbackOpen && (
            <div style={{ marginTop: 18 }}>
              {feedbackStatus === 'sent' ? (
                <Note><b>Sent.</b> Thanks — it helps shape Kaaya Fit.</Note>
              ) : feedbackStatus === 'error' ? (
                <Note><b>Failed.</b> Something went wrong, try again.</Note>
              ) : (
                <>
                  <input className="field" placeholder="Subject (Bug, Feature Request)" value={feedbackSubject} onChange={e => setFeedbackSubject(e.target.value)} />
                  <textarea className="field" rows={4} placeholder="Tell us what's on your mind..." value={feedbackMessage} onChange={e => setFeedbackMessage(e.target.value)} style={{ marginTop: 14, resize: 'vertical' }} />
                  <div className="rowf g10 mt14">
                    <input type="checkbox" checked={includeProfile} onChange={e => setIncludeProfile(e.target.checked)} id="incp" />
                    <label htmlFor="incp" className="body-dim" style={{ fontSize: 11 }}>Include basic profile data</label>
                  </div>
                  <Action onClick={handleFeedbackSubmit} disabled={!feedbackMessage.trim() || feedbackStatus === 'sending'}>
                    {feedbackStatus === 'sending' ? 'Sending...' : 'Send feedback'}
                  </Action>
                </>
              )}
            </div>
          )}
        </Sec>

        {/* Session */}
        <Sec n="09" label="Session">
          <Action onClick={() => setConfirm(true)}>Sign out</Action>
        </Sec>

        <div className="foot">
          <span>Kaaya Fit</span>
          <span>Profile</span>
        </div>
      </Screen>

      <ConfirmDialog open={confirm} title="Logout?" message="Are you sure you want to log out? Your data will persist." onConfirm={() => { setConfirm(false); logout(); }} onCancel={() => setConfirm(false)} confirmLabel="Logout" danger />
      <AvatarPickerModal open={showAvatarPicker} onClose={() => setShowAvatarPicker(false)} />
      {showManualTDEEPicker && (
        <ModalPortal>
          <div className="mo" onClick={() => setShowManualTDEEPicker(false)}>
            <div className="md" onClick={e => e.stopPropagation()} style={{ maxWidth: 340, textAlign: 'center' }}>
              <div className="h2" style={{ marginBottom: 8 }}>Set TDEE</div>
              <p className="body-dim" style={{ marginBottom: 16 }}>Baseline calorie target</p>
              <ScrollPicker
                value={tdeePreferences?.manualTDEEOverride || tdee}
                onChange={(v) => setTdeePreferences(p => ({ ...p, manualTDEEOverride: v }))}
                items={Array.from({ length: Math.floor((4500 - 1200) / 50) + 1 }, (_, i) => 1200 + i * 50)}
                unit="kcal"
              />
              <div className="rowf g12" style={{ marginTop: 16 }}>
                <TLink onClick={() => setShowManualTDEEPicker(false)} style={{ flex: 1, textAlign: 'center' }}>Cancel</TLink>
                <TLink onClick={() => setShowManualTDEEPicker(false)} style={{ flex: 1, textAlign: 'center', color: 'var(--ember-soft)' }}>Done</TLink>
              </div>
            </div>
          </div>
        </ModalPortal>
      )}
    </>
  );
}
