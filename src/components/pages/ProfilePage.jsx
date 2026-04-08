import { useState, useMemo, useEffect } from 'react';
import { LogOut, Download, Upload, Share2, Flame, Dumbbell, Trophy, Clock, Camera, Zap, Shield } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PageHeader, ConfirmDialog, ThemeTogglePill } from '../shared/SharedComponents';
import { ACTIVITY } from '../../data/constants';
import { calcBMI, getBMICat, calcBMR, calcTDEE } from '../../utils/calculations';
import { fmt, kgToLbs, cmToFtIn } from '../../utils/helpers';
import { exportData, importData } from '../../utils/storage';
import { calcAllMuscleXP, getRank, MUSCLE_GROUPS, getOverallRank } from '../../data/muscleData';

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
  const { user, updateProfile, logout, toggleTheme, addToast, workoutLogs, splits, getStreak } = useApp();
  const [ed, setEd] = useState(false);
  const [f, setF] = useState({ ...user });
  const [confirm, setConfirm] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  
  const unitWeight = user.unitWeight || 'kg';
  const unitHeight = user.unitHeight || 'cm';
  const toggleUnitWeight = async () => await updateProfile({ unitWeight: unitWeight === 'kg' ? 'lbs' : 'kg' });
  const toggleUnitHeight = async () => await updateProfile({ unitHeight: unitHeight === 'cm' ? 'ft' : 'cm' });
  const sf = k => e => setF(p => ({ ...p, [k]: e.target.value }));

  const save = async () => {
    await updateProfile({ ...f, weight: parseFloat(f.weight), height: parseFloat(f.height), age: parseInt(f.age), workoutDays: parseInt(f.workoutDays), weightGoal: f.weightGoal ? parseFloat(f.weightGoal) : null });
    setEd(false);
    addToast('Profile updated successfully', 'success');
  };

  const handleExport = () => { exportData(); addToast('Data exported!', 'success'); };
  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file'; input.accept = '.json';
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      try {
        const count = await importData(file);
        addToast(`Imported ${count} data sets! Reloading...`, 'success');
        setTimeout(() => window.location.reload(), 1500);
      } catch (err) {
        addToast(err.message, 'error');
      }
    };
    input.click();
  };

  const bmi = calcBMI(user.weight, user.height);
  const bmr = calcBMR(user.weight, user.height, user.age, user.gender);
  const tdee = calcTDEE(bmr, user.activityLevel || 'moderate');

  // Muscle Mastery Data
  const muscleXP = useMemo(() => calcAllMuscleXP(workoutLogs, splits, user?.id), [workoutLogs, splits, user?.id]);
  const overall = useMemo(() => getOverallRank(muscleXP), [muscleXP]);
  const top4 = useMemo(() => [...MUSCLE_GROUPS].sort((a,b) => (muscleXP[b.key]||0) - (muscleXP[a.key]||0)).slice(0,4), [muscleXP]);

  const lvl = Math.min(99, Math.floor(overall.totalXP / 5000) + 1);

  // Elite Achievements Data
  const streak = getStreak();
  const achievements = useMemo(() => {
    const isHeavyHitter = workoutLogs.filter(l => l.userId === user.id || l.userId === 'vishal').some(log => 
      log.exercises?.some(ex => ex.sets?.some(s => s.weight >= user.weight * 2.5))
    );
    const monthlyVol = workoutLogs.filter(l => l.userId === user.id || l.userId === 'vishal').filter(l => {
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
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 32 }}>
        <div style={{ background: 'var(--surface-container-low)', borderRadius: 16, padding: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}><span style={{ fontSize: 10, uppercase: 'uppercase', color: 'var(--on-surface-dim)', fontWeight: 700 }}>BMI</span><span style={{ fontSize: 8, background: 'var(--surface-container-highest)', borderRadius: 8, color: 'var(--on-surface-variant)', padding: '3px 8px' }}>{getBMICat(bmi).label}</span></div>
          <div className="display-lg" style={{ color: 'var(--primary)' }}>{bmi}</div>
        </div>
        <div style={{ background: 'var(--surface-container-low)', borderRadius: 16, padding: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ fontSize: 10, uppercase: 'uppercase', color: 'var(--on-surface-dim)', fontWeight: 700 }}>BMR</div>
          <div className="headline-lg" style={{ color: 'var(--on-surface)' }}>{bmr}</div>
          <div style={{ fontSize: 10, color: 'var(--on-surface-dim)' }}>KCAL</div>
        </div>
        <div style={{ background: 'var(--surface-container-low)', borderRadius: 16, padding: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ fontSize: 10, uppercase: 'uppercase', color: 'var(--on-surface-dim)', fontWeight: 700 }}>TDEE</div>
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
      <div id="personal-details" style={{ background: 'var(--surface-container-low)', borderRadius: 20, padding: 24, marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20, alignItems: 'center' }}>
          <div className="headline-md" style={{ color: 'var(--on-surface)' }}>Personal Details</div>
          <button style={{ fontSize: 12, padding: '8px 16px', borderRadius: 12, border: 'none', cursor: 'pointer', fontWeight: 600, color: ed ? 'var(--on-primary)' : 'var(--on-surface)', background: ed ? 'var(--signature-gradient)' : 'var(--surface-container-highest)' }} onClick={() => ed ? save() : setEd(true)}>{ed ? '✓ Save' : 'Edit'}</button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
          {[{ l: 'Full Name', k: 'name', t: 'text' }, { l: 'Age', k: 'age', t: 'number' }, { l: 'Email', k: 'email', t: 'email' }, { l: unitWeight === 'lbs' ? 'Weight (lbs)' : 'Weight (kg)', k: 'weight', t: 'number' }, { l: unitHeight === 'ft' ? 'Height (ft/in)' : 'Height (cm)', k: 'height', t: 'number' }, { l: unitWeight === 'lbs' ? 'Weight Goal (lbs)' : 'Weight Goal (kg)', k: 'weightGoal', t: 'number' }, { l: 'Workout Days/Week', k: 'workoutDays', t: 'number' }].map(fld => {
            const dispVal = (k, v) => {
              if (!v && v !== 0) return 'Not set';
              if (unitWeight === 'lbs' && (k === 'weight' || k === 'weightGoal')) return kgToLbs(v);
              if (unitHeight === 'ft' && k === 'height') return cmToFtIn(v);
              return String(v);
            };
            return (
              <div key={fld.k} style={{ background: 'var(--surface-container)', borderRadius: 12, padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 4 }}>
                <label style={{ fontSize: 10, fontWeight: 700, uppercase: 'uppercase', color: 'var(--on-surface-dim)' }}>{fld.l}</label>
                {ed ? <input type={fld.t} value={f[fld.k] || ''} onChange={sf(fld.k)} style={{ padding: '6px 0', fontSize: 14, width: '100%', background: 'transparent', border: 'none', color: 'var(--on-surface)', outline: 'none' }} /> : <div style={{ fontSize: 14, color: fld.k === 'weightGoal' && !user[fld.k] ? 'var(--on-surface-dim)' : 'var(--on-surface)', fontWeight: 500 }}>{dispVal(fld.k, user[fld.k])}</div>}
              </div>
            );
          })}
          <div style={{ background: 'var(--surface-container)', borderRadius: 12, padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 4 }}><label style={{ fontSize: 10, fontWeight: 700, uppercase: 'uppercase', color: 'var(--on-surface-dim)' }}>Gender</label>{ed ? <select value={f.gender} onChange={sf('gender')} style={{ padding: '6px 0', fontSize: 14, width: '100%', background: 'transparent', border: 'none', color: 'var(--on-surface)', outline: 'none' }}><option value="male">Male</option><option value="female">Female</option><option value="other">Other</option></select> : <div style={{ fontSize: 14, color: 'var(--on-surface)', fontWeight: 500 }}>{user.gender}</div>}</div>
          <div style={{ background: 'var(--surface-container)', borderRadius: 12, padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 4 }}><label style={{ fontSize: 10, fontWeight: 700, uppercase: 'uppercase', color: 'var(--on-surface-dim)' }}>Activity Level</label>{ed ? <select value={f.activityLevel} onChange={sf('activityLevel')} style={{ padding: '6px 0', fontSize: 14, width: '100%', background: 'transparent', border: 'none', color: 'var(--on-surface)', outline: 'none' }}>{Object.entries(ACTIVITY).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}</select> : <div style={{ fontSize: 14, color: 'var(--on-surface)', fontWeight: 500 }}>{ACTIVITY[user.activityLevel || 'moderate']?.label}</div>}</div>
        </div>
      </div>

      {/* Settings & Actions (9.7) */}
      <div style={{ background: 'var(--surface-container-low)', borderRadius: 20, padding: 24, marginBottom: 24 }}>
        <div className="label-md" style={{ uppercase: 'uppercase', color: 'var(--on-surface-dim)', marginBottom: 16 }}>Settings</div>
        
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

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
           <button style={{ background: 'var(--surface-container-highest)', color: 'var(--on-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '12px', border: 'none', borderRadius: 12, cursor: 'pointer', fontWeight: 600, fontSize: 13 }} onClick={handleExport}><Download size={16} /> Export Data</button>
           <button style={{ background: 'var(--surface-container-highest)', color: 'var(--on-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '12px', border: 'none', borderRadius: 12, cursor: 'pointer', fontWeight: 600, fontSize: 13 }} onClick={handleImport}><Upload size={16} /> Import Data</button>
        </div>
        
        <button style={{ width: '100%', background: 'rgba(255,107,107,0.08)', color: 'var(--danger)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '14px', border: 'none', borderRadius: 12, cursor: 'pointer', fontWeight: 600, fontSize: 14 }} onClick={() => setConfirm(true)}><LogOut size={16} /> Logout</button>
      </div>
    </div>

    <ConfirmDialog open={confirm} title="Logout?" message="Are you sure you want to log out? Your data will persist." onConfirm={() => { setConfirm(false); logout(); }} onCancel={() => setConfirm(false)} confirmLabel="Logout" danger />
    <AvatarPickerModal open={showAvatarPicker} onClose={() => setShowAvatarPicker(false)} />
    </>
  );
}
