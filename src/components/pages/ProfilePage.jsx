import { useState, useMemo, useEffect } from 'react';
import { LogOut, Download, Share2, Flame, Dumbbell, Trophy, Clock, Camera, Zap, Shield, Link, Bike, MessageSquare, ChevronDown, CheckCircle, AlertCircle } from 'lucide-react';
import emailjs from '@emailjs/browser';
import { useApp } from '../../context/AppContext';
import { PageHeader, ConfirmDialog, ThemeTogglePill, ScrollPicker, ModalPortal } from '../shared/SharedComponents';
import { ACTIVITY } from '../../data/constants';
import { calcBMI, getBMICat, calcBMR, calcTDEE, calcTDEESource } from '../../utils/calculations';
import { fmt, kgToLbs, cmToFtIn, gId, tod } from '../../utils/helpers';
import { exportData } from '../../utils/storage';
import { calcAllMuscleXP, getRank, MUSCLE_GROUPS, getOverallRank } from '../../data/muscleData';
import { useScrollRestoration } from '../../hooks/useScrollRestoration';


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
               <span style={{ fontSize: 10, color: 'var(--on-surface-variant)', fontWeight: 600, textAlign: 'center' }}>Upload Info</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  useScrollRestoration('/profile');
  const { user, updateProfile, logout, toggleTheme, addToast, workoutLogs, splits, getStreak, healthLogs, foodLog, measurements, readinessLog, stepLogs, bodyFatLog, setBodyFatLog, tdeeEstimate, tdeePreferences, setTdeePreferences } = useApp();
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
          from_name:  user?.name   || 'FitTrack User',
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

  return (
    <>
    <div className="pg-in" style={{ paddingBottom: 60 }}>
      <PageHeader title="My Profile" />

      {/* Avatar Hero (9.2) */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 32, position: 'relative' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 250, height: 250, background: 'radial-gradient(circle, rgba(255,181,155,0.15) 0%, transparent 70%)', zIndex: -1 }} />
        <div style={{ position: 'relative', width: 128, height: 128, borderRadius: 24, padding: 4, border: '2px solid rgba(255,181,155,0.20)', boxShadow: 'var(--glow-primary)', background: 'var(--surface-container)', cursor: 'pointer' }} onClick={() => setShowAvatarPicker(true)}>
          <div style={{ width: '100%', height: '100%', borderRadius: 18, overflow: 'hidden', position: 'relative', background: 'var(--surface-container-highest)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {user.avatarUrl ? <img src={user.avatarUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 40, fontWeight: 700, color: 'var(--on-surface-variant)' }}>{user.avatar}</div>}
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity .2s' }} onMouseEnter={e => e.currentTarget.style.opacity=1} onMouseLeave={e => e.currentTarget.style.opacity=0}><Camera size={32} color="#fff" /></div>
          </div>
          <div style={{ position: 'absolute', bottom: -8, right: -8, background: 'var(--signature-gradient)', borderRadius: 8, padding: '4px 8px', fontSize: 12, fontWeight: 700, color: 'var(--on-primary)', boxShadow: 'var(--shadow-md)' }}>LVL {lvl}</div>
        </div>
        <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 28, fontWeight: 700, letterSpacing: '-0.03em', textTransform: 'uppercase', color: 'var(--on-surface)', marginTop: 20 }}>{user.name}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--on-surface-variant)', marginTop: 6 }}><Shield size={14} /> {overall.name} · Olympus League</div>
        <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
          <button style={{ background: 'var(--signature-gradient)', color: 'var(--on-primary)', borderRadius: 14, fontWeight: 700, fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.12em', padding: '0 24px', height: 48, border: 'none', cursor: 'pointer' }} onClick={() => { document.getElementById('personal-details')?.scrollIntoView({ behavior: 'smooth' }); setEd(true); }}>Edit Profile</button>
          <button style={{ background: 'var(--surface-container-highest)', color: 'var(--on-surface)', borderRadius: 14, width: 48, height: 48, border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} onClick={() => addToast('Profile shared!', 'success')}><Share2 size={20} /></button>
        </div>
      </div>

      {/* Stats Strip (9.8) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 12 }}>
        <div style={{ background: 'var(--surface-container-low)', borderRadius: 16, padding: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}><span style={{ fontSize: 10, textTransform: 'uppercase', color: 'var(--on-surface-dim)', fontWeight: 700 }}>BMI</span><span style={{ fontSize: 8, background: 'var(--surface-container-highest)', borderRadius: 8, color: 'var(--on-surface-variant)', padding: '3px 8px' }}>{getBMICat(bmi).label}</span></div>
          <div className="display-lg" style={{ color: 'var(--primary)' }}>{bmi}</div>
        </div>
        <div style={{ background: 'var(--surface-container-low)', borderRadius: 16, padding: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ fontSize: 10, textTransform: 'uppercase', color: 'var(--on-surface-dim)', fontWeight: 700 }}>BF%</div>
          <div className="display-lg" style={{ color: 'var(--primary)' }}>{latestBFPct ? `${latestBFPct.toFixed(1)}%` : '—'}</div>
        </div>
        <div style={{ background: 'var(--surface-container-low)', borderRadius: 16, padding: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ fontSize: 10, textTransform: 'uppercase', color: 'var(--on-surface-dim)', fontWeight: 700 }}>BMR</div>
          <div className="headline-lg" style={{ color: 'var(--on-surface)' }}>{bmr}</div>
          <div style={{ fontSize: 10, color: 'var(--on-surface-dim)' }}>KCAL</div>
        </div>
        <div style={{ background: 'var(--surface-container-low)', borderRadius: 16, padding: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ fontSize: 10, textTransform: 'uppercase', color: 'var(--on-surface-dim)', fontWeight: 700 }}>TDEE</div>
          <div className="headline-lg" style={{ color: 'var(--on-surface)' }}>{tdee}</div>
          <div style={{ fontSize: 10, color: 'var(--on-surface-dim)' }}>KCAL</div>
        </div>
      </div>

      {/* Muscle Mastery (9.4) */}
      <div style={{ marginBottom: 40 }}>
        <div className="headline-md" style={{ color: 'var(--on-surface)', marginBottom: 16 }}>Muscle Mastery</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {top4.map((m) => {
            const xp = muscleXP[m.key] || 0;
            const isAct = xp > 200;
            const rank = getRank(xp);
            const w = Math.max(2, rank.progress * 100);
            return (
              <div key={m.key} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                  <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, fontWeight: 700, textTransform: 'uppercase', color: 'var(--on-surface)' }}>{m.label}</span>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2 }}>
                    <span style={{ fontSize: 9, color: 'var(--on-surface-variant)', fontWeight: 600 }}>{rank.name.toUpperCase()}</span>
                    <span style={{ fontSize: 14, fontWeight: 700, color: isAct ? 'var(--primary)' : 'var(--on-surface-variant)' }}>{Math.floor(xp).toLocaleString()} XP</span>
                  </div>
                </div>
                <div style={{ height: 12, borderRadius: 6, background: 'var(--surface-container-lowest)', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${w}%`, background: isAct ? 'var(--signature-gradient)' : 'var(--surface-container-highest)', boxShadow: isAct ? '0 0 12px rgba(248,95,27,0.4)' : 'none', borderRadius: 6, transition: 'width 1s ease' }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Elite Achievements (9.5) */}
      <div style={{ marginBottom: 40 }}>
        <div className="headline-md" style={{ color: 'var(--on-surface)', marginBottom: 16 }}>Elite Achievements</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
          {achievements.map(ach => (
            <div key={ach.id} style={{ background: 'var(--surface-container-low)', borderRadius: 20, padding: 20, opacity: ach.locked ? 0.4 : 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: ach.locked ? 'var(--surface-container-highest)' : 'rgba(255,181,155,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: ach.locked ? 'var(--on-surface-variant)' : 'var(--primary)' }}><ach.icon size={24} /></div>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--on-surface)' }}>{ach.label}</div>
              <div style={{ fontSize: 10, color: 'var(--on-surface-variant)', lineHeight: 1.5 }}>{ach.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Personal Details (9.6) */}
      <div id="personal-details" style={{ background: 'var(--surface-container-low)', borderRadius: 20, padding: '18px 20px', marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14, alignItems: 'center' }}>
          <div className="headline-md" style={{ color: 'var(--on-surface)' }}>Personal Details</div>
          <div style={{ display: 'flex', gap: 8 }}>
            {ed && <button style={{ fontSize: 12, padding: '8px 16px', borderRadius: 12, border: 'none', cursor: 'pointer', fontWeight: 600, color: 'var(--on-surface-variant)', background: 'transparent' }} onClick={() => setEd(false)}>Cancel</button>}
            <button style={{ fontSize: 12, padding: '8px 16px', borderRadius: 12, border: 'none', cursor: 'pointer', fontWeight: 600, color: ed ? 'var(--on-primary)' : 'var(--on-surface)', background: ed ? 'var(--signature-gradient)' : 'var(--surface-container-highest)' }} onClick={() => ed ? save() : setEd(true)}>{ed ? '✓ Save' : 'Edit'}</button>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {/* Row 1: Full Name, Email */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 10 }}>
            {[{ l: 'Full Name', k: 'name', t: 'text' }, { l: 'Email', k: 'email', t: 'email' }].map(fld => {
              const dispVal = user[fld.k] || '—';
              return (
                <div key={fld.k} style={{ background: 'var(--surface-container)', borderRadius: 10, padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <label htmlFor={`input-${fld.k}`} style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', color: 'var(--on-surface-dim)', fontFamily: "'Space Grotesk', sans-serif" }}>{fld.l}</label>
                  {ed ? <input id={`input-${fld.k}`} type={fld.t} value={f[fld.k] || ''} onChange={sf(fld.k)} style={{ padding: '6px 0', fontSize: 13, width: '100%', background: 'transparent', border: 'none', color: 'var(--on-surface)', outline: 'none' }} /> : <div style={{ fontSize: 13, color: 'var(--on-surface)', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{dispVal}</div>}
                </div>
              );
            })}
          </div>

          {/* Row 2: Age, Weight, Height, Gender */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))', gap: 10 }}>
            {[{ l: 'Age', k: 'age', t: 'number', min: 10, max: 100 }, { l: unitWeight === 'lbs' ? 'Weight (lbs)' : 'Weight (kg)', k: 'weight', t: 'number' }, { l: unitHeight === 'ft' ? 'Height (ft/in)' : 'Height (cm)', k: 'height', t: 'number' }].map(fld => {
              const v = user[fld.k];
              let dispVal = (!v && v !== 0) ? '—' : String(v);
              if (v && unitWeight === 'lbs' && fld.k === 'weight') dispVal = kgToLbs(v);
              if (v && unitHeight === 'ft' && fld.k === 'height') dispVal = cmToFtIn(v);
              return (
                <div key={fld.k} style={{ background: 'var(--surface-container)', borderRadius: 10, padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <label htmlFor={`input-${fld.k}`} style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', color: 'var(--on-surface-dim)', fontFamily: "'Space Grotesk', sans-serif" }}>{fld.l}</label>
                  {ed ? <input id={`input-${fld.k}`} type={fld.t} min={fld.min} max={fld.max} value={f[fld.k] || ''} onChange={sf(fld.k)} style={{ padding: '6px 0', fontSize: 13, width: '100%', background: 'transparent', border: 'none', color: 'var(--on-surface)', outline: 'none' }} /> : <div style={{ fontSize: 13, color: 'var(--on-surface)', fontWeight: 500, fontFamily: 'monospace' }}>{dispVal}</div>}
                </div>
              );
            })}
            
            <div style={{ background: 'var(--surface-container)', borderRadius: 10, padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label htmlFor="input-gender" style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', color: 'var(--on-surface-dim)', fontFamily: "'Space Grotesk', sans-serif" }}>Gender</label>
              {ed ? (
                <select id="input-gender" value={f.gender} onChange={sf('gender')} style={{ padding: '6px 0', fontSize: 13, width: '100%', background: 'transparent', border: 'none', color: 'var(--on-surface)', outline: 'none' }}>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              ) : (
                <div style={{ fontSize: 13, color: 'var(--on-surface)', fontWeight: 500, textTransform: 'capitalize' }}>{user.gender || '—'}</div>
              )}
            </div>
          </div>

          {/* Row 3: Workout Days, Steps, Activity */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 10 }}>
            {[{ l: 'Workout Days/Week', k: 'workoutDays', t: 'number', min: 1, max: 7 }, { l: 'Daily Steps Goal', k: 'stepGoal', t: 'number', placeholder: 'e.g. 10000' }].map(fld => {
              const dispVal = (!user[fld.k] && user[fld.k] !== 0) ? '—' : String(user[fld.k]);
              return (
                <div key={fld.k} style={{ background: 'var(--surface-container)', borderRadius: 10, padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <label htmlFor={`input-${fld.k}`} style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', color: 'var(--on-surface-dim)', fontFamily: "'Space Grotesk', sans-serif" }}>{fld.l}</label>
                  {ed ? <input id={`input-${fld.k}`} type={fld.t} placeholder={fld.placeholder} min={fld.min} max={fld.max} value={f[fld.k] || ''} onChange={sf(fld.k)} style={{ padding: '6px 0', fontSize: 13, width: '100%', background: 'transparent', border: 'none', color: 'var(--on-surface)', outline: 'none' }} /> : <div style={{ fontSize: 13, color: 'var(--on-surface)', fontWeight: 500, fontFamily: 'monospace' }}>{dispVal}</div>}
                </div>
              );
            })}
            
            <div style={{ background: 'var(--surface-container)', borderRadius: 10, padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label htmlFor="input-activityLevel" style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', color: 'var(--on-surface-dim)', fontFamily: "'Space Grotesk', sans-serif" }}>Activity Level</label>
              {ed ? (
                <select id="input-activityLevel" value={f.activityLevel} onChange={sf('activityLevel')} style={{ padding: '6px 0', fontSize: 13, width: '100%', background: 'transparent', border: 'none', color: 'var(--on-surface)', outline: 'none' }}>
                  {Object.entries(ACTIVITY).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                </select>
              ) : (
                <div style={{ fontSize: 13, color: 'var(--on-surface)', fontWeight: 500 }}>{ACTIVITY[user.activityLevel || 'moderate']?.label || '—'}</div>
              )}
            </div>
          </div>
        </div>
        <div style={{ fontSize: 11, color: 'var(--on-surface-dim)', marginTop: 12, textAlign: 'right' }}>To update your goal weight, visit the Home page.</div>
      </div>

      {/* Connected Devices (9.6b) */}
      <div id="connected-devices" style={{ background: 'var(--surface-container-low)', borderRadius: 20, padding: 24, marginBottom: 24 }}>
        <div className="headline-md" style={{ color: 'var(--on-surface)', marginBottom: 16 }}>Connected Devices</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 16 }}>
          <button
            onClick={() => {
              window.location.href = `/fitbit/authorize?state=${user.id}`;
            }}
            style={{ width: '100%', padding: '14px', background: 'var(--surface-container-highest)', color: 'var(--on-surface)', borderRadius: 12, border: 'none', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
          >
            <Link size={16} /> Connect Fitbit — Auto-sync steps daily
          </button>
          <button
            onClick={() => {
              window.location.href = `/strava/authorize?state=${user.id}`;
            }}
            style={{ width: '100%', padding: '14px', background: 'var(--surface-container-highest)', color: 'var(--on-surface)', borderRadius: 12, border: 'none', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
          >
            <Bike size={16} /> Connect Strava — Auto-sync cardio runs & rides
          </button>
        </div>
      </div>

      {/* Adaptive TDEE Settings */}
      <div style={{ background: 'var(--surface-container-low)', borderRadius: 20, padding: 24, marginBottom: 24 }}>
        <div className="label-md" style={{ textTransform: 'uppercase', color: 'var(--on-surface-dim)', marginBottom: 16 }}>Metabolism & Targets</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
           <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--on-surface)' }}>Adaptive TDEE</div>
              <div style={{ fontSize: 12, color: 'var(--on-surface-variant)', marginTop: 2 }}>Auto-adjust targets based on weight & food logs</div>
           </div>
           <div style={{ display: 'flex', gap: 2, padding: 3, borderRadius: 10, background: 'var(--surface-container-highest)' }}>
             <button onClick={() => setTdeePreferences(p => ({ ...p, useEstimatedTDEE: true }))} style={{ borderRadius: 8, padding: '6px 14px', fontSize: 11, fontWeight: 700, cursor: 'pointer', border: 'none', background: tdeePreferences?.useEstimatedTDEE ? 'var(--primary)' : 'transparent', color: tdeePreferences?.useEstimatedTDEE ? 'var(--on-primary)' : 'var(--on-surface-variant)' }}>ON</button>
             <button onClick={() => setTdeePreferences(p => ({ ...p, useEstimatedTDEE: false }))} style={{ borderRadius: 8, padding: '6px 14px', fontSize: 11, fontWeight: 700, cursor: 'pointer', border: 'none', background: !tdeePreferences?.useEstimatedTDEE ? 'var(--primary)' : 'transparent', color: !tdeePreferences?.useEstimatedTDEE ? 'var(--on-primary)' : 'var(--on-surface-variant)' }}>OFF</button>
           </div>
        </div>
        <div style={{ height: 1, background: 'var(--surface-container-highest)', margin: '16px 0' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
           <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--on-surface)' }}>Manual TDEE Override</div>
              <div style={{ fontSize: 12, color: 'var(--on-surface-variant)', marginTop: 2 }}>Force a specific baseline</div>
           </div>
           <button style={{ background: 'var(--surface-container-highest)', color: 'var(--on-surface)', border: 'none', padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer' }} onClick={() => setShowManualTDEEPicker(true)}>
              {tdeePreferences?.manualTDEE ? `${tdeePreferences.manualTDEE} kcal` : 'Set manual'}
           </button>
        </div>
        {tdeePreferences?.manualTDEE && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
            <button style={{ fontSize: 11, fontWeight: 600, color: 'var(--error)', background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px 8px' }} onClick={() => setTdeePreferences(p => ({ ...p, manualTDEE: null }))}>Clear manual override</button>
          </div>
        )}
      </div>

      {/* Settings & Actions (9.7) */}
      <div style={{ background: 'var(--surface-container-low)', borderRadius: 20, padding: 24, marginBottom: 24 }}>
        <div className="label-md" style={{ textTransform: 'uppercase', color: 'var(--on-surface-dim)', marginBottom: 16 }}>Settings</div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 24 }}>
          {/* Weight */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
             <div><div style={{ fontSize: 14, fontWeight: 600, color: 'var(--on-surface)' }}>Weight Unit</div><div style={{ fontSize: 12, color: 'var(--on-surface-variant)', marginTop: 2 }}>Log and display weight</div></div>
             <div style={{ display: 'flex', gap: 2, padding: 3, borderRadius: 10, background: 'var(--surface-container-highest)' }}>
               <button onClick={toggleUnitWeight} style={{ borderRadius: 8, padding: '6px 14px', fontSize: 11, fontWeight: 700, cursor: 'pointer', border: 'none', background: unitWeight === 'kg' ? 'var(--primary)' : 'transparent', color: unitWeight === 'kg' ? 'var(--on-primary)' : 'var(--on-surface-variant)' }}>KG</button>
               <button onClick={toggleUnitWeight} style={{ borderRadius: 8, padding: '6px 14px', fontSize: 11, fontWeight: 700, cursor: 'pointer', border: 'none', background: unitWeight === 'lbs' ? 'var(--primary)' : 'transparent', color: unitWeight === 'lbs' ? 'var(--on-primary)' : 'var(--on-surface-variant)' }}>LBS</button>
             </div>
          </div>
          <div style={{ height: 1, background: 'var(--surface-container-highest)' }} />
          {/* Height */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
             <div><div style={{ fontSize: 14, fontWeight: 600, color: 'var(--on-surface)' }}>Height Unit</div><div style={{ fontSize: 12, color: 'var(--on-surface-variant)', marginTop: 2 }}>Profile height display</div></div>
             <div style={{ display: 'flex', gap: 2, padding: 3, borderRadius: 10, background: 'var(--surface-container-highest)' }}>
               <button onClick={toggleUnitHeight} style={{ borderRadius: 8, padding: '6px 14px', fontSize: 11, fontWeight: 700, cursor: 'pointer', border: 'none', background: unitHeight === 'cm' ? 'var(--primary)' : 'transparent', color: unitHeight === 'cm' ? 'var(--on-primary)' : 'var(--on-surface-variant)' }}>CM</button>
               <button onClick={toggleUnitHeight} style={{ borderRadius: 8, padding: '6px 14px', fontSize: 11, fontWeight: 700, cursor: 'pointer', border: 'none', background: unitHeight === 'ft' ? 'var(--primary)' : 'transparent', color: unitHeight === 'ft' ? 'var(--on-primary)' : 'var(--on-surface-variant)' }}>FT/IN</button>
             </div>
          </div>
          <div style={{ height: 1, background: 'var(--surface-container-highest)' }} />
          {/* Theme */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
             <div><div style={{ fontSize: 14, fontWeight: 600, color: 'var(--on-surface)' }}>Theme</div><div style={{ fontSize: 12, color: 'var(--on-surface-variant)', marginTop: 2 }}>Switch display mode</div></div>
             <ThemeTogglePill />
          </div>
        </div>

        <div style={{ marginBottom: 16 }}>
           <button style={{ width: '100%', background: 'var(--surface-container-highest)', color: 'var(--on-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '12px', border: 'none', borderRadius: 12, cursor: 'pointer', fontWeight: 600, fontSize: 13 }} onClick={handleExport}><Download size={16} /> Export Data</button>
        </div>
        
        <button style={{ width: '100%', background: 'rgba(255,107,107,0.08)', color: 'var(--danger)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '14px', border: 'none', borderRadius: 12, cursor: 'pointer', fontWeight: 600, fontSize: 14 }} onClick={() => setConfirm(true)}><LogOut size={16} /> Logout</button>
      </div>

      {/* Feedback Card */}
      <div style={{ background: 'var(--surface-container-low)', borderRadius: 16, marginTop: 12, overflow: 'hidden' }}>
        <button
          onClick={() => setFeedbackOpen(v => !v)}
          style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', background: 'none', border: 'none', cursor: 'pointer' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ background: 'var(--surface-container-high)', width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MessageSquare size={16} color="var(--primary)" />
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--on-surface)' }}>Feedback & Bugs</div>
              <div style={{ fontSize: 11, color: 'var(--on-surface-variant)', marginTop: 2 }}>Help us improve FitTrack</div>
            </div>
          </div>
          <ChevronDown size={18} color="var(--on-surface-dim)" style={{ transform: feedbackOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
        </button>

        <div style={{ maxHeight: feedbackOpen ? 500 : 0, opacity: feedbackOpen ? 1 : 0, transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', overflow: 'hidden' }}>
          <div style={{ padding: '0 20px 20px 20px' }}>
            <div style={{ height: 1, background: 'var(--surface-container-highest)', marginBottom: 16 }} />
            
            {feedbackStatus === 'sent' ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px 0', gap: 12 }}>
                <CheckCircle size={32} color="var(--primary)" />
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--on-surface)' }}>Feedback Sent</div>
                <div style={{ fontSize: 12, color: 'var(--on-surface-variant)', textAlign: 'center' }}>Thank you! Your input helps shape the future of FitTrack.</div>
              </div>
            ) : feedbackStatus === 'error' ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px 0', gap: 12 }}>
                <AlertCircle size={32} color="var(--danger)" />
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--on-surface)' }}>Failed to send</div>
                <div style={{ fontSize: 12, color: 'var(--on-surface-variant)', textAlign: 'center' }}>Something went wrong. Please try again later.</div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <input
                  type="text"
                  placeholder="Subject (e.g. Bug, Feature Request)"
                  value={feedbackSubject}
                  onChange={e => setFeedbackSubject(e.target.value)}
                  style={{ width: '100%', background: 'var(--surface-container-highest)', border: 'none', borderRadius: 10, padding: '12px 14px', fontSize: 13, color: 'var(--on-surface)', outline: 'none' }}
                />
                <textarea
                  placeholder="Tell us what's on your mind..."
                  value={feedbackMessage}
                  onChange={e => setFeedbackMessage(e.target.value)}
                  rows={4}
                  style={{ width: '100%', background: 'var(--surface-container-highest)', border: 'none', borderRadius: 10, padding: '12px 14px', fontSize: 13, color: 'var(--on-surface)', outline: 'none', resize: 'vertical', minHeight: 80 }}
                />
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', padding: '4px 0' }}>
                  <input type="checkbox" checked={includeProfile} onChange={e => setIncludeProfile(e.target.checked)} style={{ accentColor: 'var(--primary)' }} />
                  <span style={{ fontSize: 11, color: 'var(--on-surface-variant)' }}>Include basic profile data (helps with debugging)</span>
                </label>
                <button
                  onClick={handleFeedbackSubmit}
                  disabled={!feedbackMessage.trim() || feedbackStatus === 'sending'}
                  style={{ width: '100%', background: 'var(--primary)', color: 'var(--on-primary)', border: 'none', borderRadius: 10, padding: '12px', fontSize: 13, fontWeight: 700, cursor: feedbackMessage.trim() && feedbackStatus !== 'sending' ? 'pointer' : 'not-allowed', opacity: feedbackMessage.trim() && feedbackStatus !== 'sending' ? 1 : 0.5, marginTop: 4, transition: 'opacity 0.2s' }}
                >
                  {feedbackStatus === 'sending' ? 'Sending...' : 'Send Feedback'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

    </div>

    <ConfirmDialog open={confirm} title="Logout?" message="Are you sure you want to log out? Your data will persist." onConfirm={() => { setConfirm(false); logout(); }} onCancel={() => setConfirm(false)} confirmLabel="Logout" danger />
    <AvatarPickerModal open={showAvatarPicker} onClose={() => setShowAvatarPicker(false)} />
    {showManualTDEEPicker && (
      <ModalPortal>
        <div className="mo" onClick={() => setShowManualTDEEPicker(false)}>
          <div className="md" onClick={e => e.stopPropagation()} style={{ maxWidth: 340, textAlign: 'center' }}>
            <div className="headline-md" style={{ marginBottom: 8, color: 'var(--on-surface)' }}>Set Default TDEE</div>
            <div style={{ fontSize: 12, color: 'var(--on-surface-variant)', marginBottom: 16 }}>Choose your daily calorie target baseline</div>
            <ScrollPicker
              value={tdeePreferences?.manualTDEE || tdee}
              onChange={(v) => setTdeePreferences(p => ({ ...p, manualTDEE: v }))}
              items={Array.from({ length: Math.floor((4500 - 1200) / 50) + 1 }, (_, i) => 1200 + i * 50)}
              unit="kcal"
            />
            <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
              <button className="btn-g" style={{ flex: 1, padding: '12px' }} onClick={() => setShowManualTDEEPicker(false)}>Cancel</button>
              <button className="btn-p" style={{ flex: 1, padding: '12px' }} onClick={() => setShowManualTDEEPicker(false)}>Done</button>
            </div>
          </div>
        </div>
      </ModalPortal>
    )}
  </>
  );
}
