import { useState, useMemo, useEffect } from 'react';
import { Flame, Dumbbell, Trophy, Clock, Camera } from 'lucide-react';
import emailjs from '@emailjs/browser';
import { useApp } from '../../context/AppContext';
import { ConfirmDialog, ThemeTogglePill, ScrollPicker, ModalPortal } from '../shared/SharedComponents';
import { Screen, Sec, Hero, LedgerRow, Note, TLink, Action, Balance } from '../shared/Margin';
import { ACTIVITY } from '../../data/constants';
import { calcBMI, getBMICat, calcBMR, calcTDEE, calcTDEESource } from '../../utils/calculations';
import { kgToLbs, cmToFtIn } from '../../utils/helpers';
import { exportData } from '../../utils/storage';
import { calcAllMuscleXP, getRank, MUSCLE_GROUPS, getOverallRank } from '../../data/muscleData';
import { useScrollRestoration } from '../../hooks/useScrollRestoration';
import { useNotifications } from '../../hooks/useNotifications';


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

/* Two-word toggle rendered as text links; the active word carries the ember.
   Each option keeps its own handler so existing toggle semantics are preserved. */
const SegToggle = ({ options }) => (
  <div className="rowf g12">
    {options.map(o => (
      <TLink key={o.label} ember={o.active} onClick={o.onClick}>{o.label}</TLink>
    ))}
  </div>
);

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
      { id: 'streak', icon: Flame, label: '7 Day Streak', locked: streak.current < 7, desc: streak.current >= 7 ? `Current streak: ${streak.current}` : 'Log workouts 7 days in a row' },
      { id: 'volume-king', icon: Dumbbell, label: 'Volume King', locked: monthlyVol < 50000, desc: monthlyVol >= 50000 ? 'Moved 50k+ kg this month' : `Monthly volume: ${(monthlyVol/1000).toFixed(1)}k / 50k` },
      { id: 'heavy-hitter', icon: Trophy, label: 'Heavy Hitter', locked: !isHeavyHitter, desc: isHeavyHitter ? 'Lifted 2.5x bodyweight' : 'Lift 2.5x bodyweight in a single set' },
      { id: 'early-bird', icon: Clock, label: 'Early Bird', locked: true, desc: 'Complete a workout before 6 AM' },
    ];
  }, [streak, workoutLogs, user]);

  // Personal-details field groups (same fields, order and edit semantics as before)
  const textFields = [
    { l: 'Full Name', k: 'name', t: 'text' },
    { l: 'Email', k: 'email', t: 'email' },
  ];
  const bodyFields = [
    { l: 'Age', k: 'age', t: 'number', min: 10, max: 100 },
    { l: unitWeight === 'lbs' ? 'Weight (lbs)' : 'Weight (kg)', k: 'weight', t: 'number' },
    { l: unitHeight === 'ft' ? 'Height (ft/in)' : 'Height (cm)', k: 'height', t: 'number' },
  ];
  const bodyDisp = (fld) => {
    const v = user[fld.k];
    if (!v && v !== 0) return '—';
    if (v && unitWeight === 'lbs' && fld.k === 'weight') return kgToLbs(v);
    if (v && unitHeight === 'ft' && fld.k === 'height') return cmToFtIn(v);
    return String(v);
  };
  const goalFields = [
    { l: 'Workout Days/Week', k: 'workoutDays', t: 'number', min: 1, max: 7 },
    { l: 'Daily Steps Goal', k: 'stepGoal', t: 'number', placeholder: 'e.g. 10000' },
    { l: 'Daily Water Goal (ml)', k: 'waterGoal', t: 'number', placeholder: 'e.g. 3000' },
  ];

  const fieldRow = (fld, dispVal) => ed ? (
    <div className="field" key={fld.k}>
      <span>{fld.l}</span>
      <input className="input" id={`input-${fld.k}`} type={fld.t} min={fld.min} max={fld.max} placeholder={fld.placeholder} value={f[fld.k] || ''} onChange={sf(fld.k)} />
    </div>
  ) : (
    <LedgerRow key={fld.k} k={fld.l} v={dispVal} />
  );

  return (
    <>
    <Screen kicker="Body">
      <Sec n="01" label="Profile">
        <button onClick={() => setShowAvatarPicker(true)} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'block' }} aria-label="Change avatar">
          {user.avatarUrl
            ? <img src={user.avatarUrl} alt="" style={{ width: 96, height: 96, objectFit: 'cover', display: 'block' }} />
            : <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 40, fontWeight: 700, color: 'var(--ash)' }}>{user.avatar}</span>}
        </button>
        <p className="meta" style={{ marginTop: 8 }}>Tap avatar to change</p>
        <Hero value={user.name} />
        <LedgerRow k="Level" v={lvl} />
        <LedgerRow k="Olympus League" v={overall.name} />
        <div className="rowf g12" style={{ marginTop: 12 }}>
          <TLink onClick={() => { document.getElementById('personal-details')?.scrollIntoView({ behavior: 'smooth' }); setEd(true); }}>Edit profile</TLink>
          <TLink onClick={() => addToast('Profile shared!', 'success')}>Share</TLink>
        </div>
      </Sec>

      <Sec n="02" label="Numbers">
        <LedgerRow k="BMI" v={bmi} sub={` · ${getBMICat(bmi).label}`} />
        <LedgerRow k="Body fat" v={latestBFPct ? `${latestBFPct.toFixed(1)}%` : '—'} />
        <LedgerRow k="BMR" v={`${bmr} kcal`} />
        <LedgerRow k="TDEE" v={`${tdee} kcal`} />
      </Sec>

      <Sec n="03" label="Muscle mastery">
        {top4.map((m) => {
          const xp = muscleXP[m.key] || 0;
          const rank = getRank(xp);
          return (
            <Balance
              key={m.key}
              label={m.label}
              current={rank.name}
              pct={rank.progress * 100}
              note={`${Math.floor(xp).toLocaleString()} XP`}
            />
          );
        })}
      </Sec>

      <Sec n="04" label="Elite achievements">
        {achievements.map(ach => (
          <div key={ach.id}>
            <LedgerRow k={ach.label} v={ach.locked ? 'Locked' : 'Earned'} />
            <div className="rowf between" style={{ marginTop: -6, paddingBottom: 10 }}>
              <span className="meta">{ach.desc}</span>
            </div>
          </div>
        ))}
      </Sec>

      <div id="personal-details">
        <Sec n="05" label="Personal details">
          <div className="rowf g12" style={{ marginBottom: 10 }}>
            {ed ? (
              <>
                <TLink onClick={save}>Save</TLink>
                <TLink onClick={() => setEd(false)}>Cancel</TLink>
              </>
            ) : (
              <TLink onClick={() => setEd(true)}>Edit</TLink>
            )}
          </div>

          {textFields.map(fld => fieldRow(fld, user[fld.k] || '—'))}
          {bodyFields.map(fld => fieldRow(fld, bodyDisp(fld)))}

          {ed ? (
            <div className="field">
              <span>Gender</span>
              <select className="input" id="input-gender" value={f.gender} onChange={sf('gender')}>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          ) : (
            <LedgerRow k="Gender" v={user.gender ? user.gender.charAt(0).toUpperCase() + user.gender.slice(1) : '—'} />
          )}

          {goalFields.map(fld => fieldRow(fld, (!user[fld.k] && user[fld.k] !== 0) ? '—' : String(user[fld.k])))}

          {ed ? (
            <div className="field">
              <span>Activity Level</span>
              <select className="input" id="input-activityLevel" value={f.activityLevel} onChange={sf('activityLevel')}>
                {Object.entries(ACTIVITY).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
            </div>
          ) : (
            <LedgerRow k="Activity Level" v={ACTIVITY[user.activityLevel || 'moderate']?.label || '—'} />
          )}

          <Note>To update your goal weight, visit the Home page.</Note>
        </Sec>
      </div>

      <Sec n="06" label="Connected devices">
        <LedgerRow k="Fitbit" v="Connect" sub=" · auto-sync steps daily" onClick={() => { window.location.href = `/fitbit/authorize?state=${user.id}`; }} />
        <LedgerRow k="Strava" v="Connect" sub=" · auto-sync cardio runs & rides" onClick={() => { window.location.href = `/strava/authorize?state=${user.id}`; }} />
      </Sec>

      <Sec n="07" label="Metabolism & targets">
        <LedgerRow k="Adaptive TDEE">
          <SegToggle options={[
            { label: 'On', active: !!tdeePreferences?.useEstimatedTDEE, onClick: () => setTdeePreferences(p => ({ ...p, useEstimatedTDEE: true })) },
            { label: 'Off', active: !tdeePreferences?.useEstimatedTDEE, onClick: () => setTdeePreferences(p => ({ ...p, useEstimatedTDEE: false })) },
          ]} />
        </LedgerRow>
        <div className="rowf between" style={{ marginTop: -6, paddingBottom: 10 }}>
          <span className="meta">Auto-adjust targets based on weight & food logs</span>
        </div>

        <LedgerRow k="Manual TDEE override" v={tdeePreferences?.manualTDEEOverride ? `${tdeePreferences.manualTDEEOverride} kcal` : 'Set manual'} onClick={() => setShowManualTDEEPicker(true)} />
        <div className="rowf between" style={{ marginTop: -6, paddingBottom: 10 }}>
          <span className="meta">Force a specific baseline</span>
          {tdeePreferences?.manualTDEEOverride && (
            <TLink onClick={() => setTdeePreferences(p => ({ ...p, manualTDEEOverride: null }))} style={{ color: 'var(--bad)' }}>Clear manual override</TLink>
          )}
        </div>
      </Sec>

      <Sec n="08" label="Notifications">
        {!pushEnabled && (
          <>
            <Note>Enable push notifications — get alerts for streaks and Olympus League ranking.</Note>
            <Action onClick={enablePush}>Enable push notifications</Action>
          </>
        )}

        {pushEnabled && (
          <>
            <LedgerRow k="Push notifications" v="Enabled on this device" />
            <div className="rowf" style={{ justifyContent: 'flex-end', marginTop: -6, paddingBottom: 10 }}>
              <TLink onClick={disablePush}>Disable</TLink>
            </div>
          </>
        )}

        {!prefsLoading && preferences && (
          Object.entries({
            email_weekly: { label: 'Weekly Summary Email', desc: 'Your progress delivered to your inbox every Sunday' },
            ...(pushEnabled ? {
              workout_reminders: { label: 'Workout Reminders', desc: 'Daily nudges to hit your goals' },
              diet_reminders: { label: 'Diet Reminders', desc: 'Alerts to log your meals' },
              streak_alerts: { label: 'Streak Alerts', desc: 'Warning before you lose a streak' },
              olympus_weekly: { label: 'Olympus Weekly', desc: 'Weekly ranking summary via Push' },
              olympus_overtaken: { label: 'Overtaken Alerts', desc: 'When someone passes your rank' }
            } : {})
          }).map(([key, info]) => (
            <div key={key}>
              <LedgerRow k={info.label}>
                <SegToggle options={[
                  { label: 'On', active: !!preferences[key], onClick: () => updatePreferences({ [key]: true }) },
                  { label: 'Off', active: !preferences[key], onClick: () => updatePreferences({ [key]: false }) },
                ]} />
              </LedgerRow>
              <div className="rowf between" style={{ marginTop: -6, paddingBottom: 10 }}>
                <span className="meta">{info.desc}</span>
              </div>
            </div>
          ))
        )}
      </Sec>

      <Sec n="09" label="Settings">
        <LedgerRow k="Weight unit">
          <SegToggle options={[
            { label: 'KG', active: unitWeight === 'kg', onClick: toggleUnitWeight },
            { label: 'LBS', active: unitWeight === 'lbs', onClick: toggleUnitWeight },
          ]} />
        </LedgerRow>
        <div className="rowf between" style={{ marginTop: -6, paddingBottom: 10 }}>
          <span className="meta">Log and display weight</span>
        </div>

        <LedgerRow k="Height unit">
          <SegToggle options={[
            { label: 'CM', active: unitHeight === 'cm', onClick: toggleUnitHeight },
            { label: 'FT/IN', active: unitHeight === 'ft', onClick: toggleUnitHeight },
          ]} />
        </LedgerRow>
        <div className="rowf between" style={{ marginTop: -6, paddingBottom: 10 }}>
          <span className="meta">Profile height display</span>
        </div>

        <LedgerRow k="Theme">
          <ThemeTogglePill />
        </LedgerRow>
        <div className="rowf between" style={{ marginTop: -6, paddingBottom: 10 }}>
          <span className="meta">Switch display mode</span>
        </div>

        <div className="rowf g12" style={{ marginTop: 12 }}>
          <TLink onClick={handleExport}>Export data</TLink>
          <TLink onClick={() => setConfirm(true)} style={{ color: 'var(--bad)' }}>Logout</TLink>
        </div>
      </Sec>

      <Sec n="10" label="Feedback & bugs">
        <LedgerRow k="Help us improve Kaaya Fit" v={feedbackOpen ? 'Close' : 'Open'} onClick={() => setFeedbackOpen(v => !v)} />
        {feedbackOpen && (
          feedbackStatus === 'sent' ? (
            <Note>Feedback sent — thank you! Your input helps shape the future of Kaaya Fit.</Note>
          ) : feedbackStatus === 'error' ? (
            <Note>Failed to send — something went wrong. Please try again later.</Note>
          ) : (
            <>
              <div className="field">
                <span>Subject</span>
                <input className="input" type="text" placeholder="Subject (e.g. Bug, Feature Request)" value={feedbackSubject} onChange={e => setFeedbackSubject(e.target.value)} />
              </div>
              <div className="field">
                <span>Message</span>
                <textarea className="input" placeholder="Tell us what's on your mind..." value={feedbackMessage} onChange={e => setFeedbackMessage(e.target.value)} rows={4} style={{ resize: 'vertical', minHeight: 80 }} />
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', padding: '4px 0' }}>
                <input type="checkbox" checked={includeProfile} onChange={e => setIncludeProfile(e.target.checked)} style={{ accentColor: 'var(--ember)' }} />
                <span className="meta">Include basic profile data (helps with debugging)</span>
              </label>
              <Action ember onClick={handleFeedbackSubmit} disabled={!feedbackMessage.trim() || feedbackStatus === 'sending'}>
                {feedbackStatus === 'sending' ? 'Sending…' : 'Send feedback'}
              </Action>
            </>
          )
        )}
      </Sec>
    </Screen>

    <ConfirmDialog open={confirm} title="Logout?" message="Are you sure you want to log out? Your data will persist." onConfirm={() => { setConfirm(false); logout(); }} onCancel={() => setConfirm(false)} confirmLabel="Logout" danger />
    <AvatarPickerModal open={showAvatarPicker} onClose={() => setShowAvatarPicker(false)} />
    {showManualTDEEPicker && (
      <ModalPortal>
        <div className="mo" onClick={() => setShowManualTDEEPicker(false)}>
          <div className="md" onClick={e => e.stopPropagation()} style={{ maxWidth: 340, textAlign: 'center' }}>
            <div className="headline-md" style={{ marginBottom: 8, color: 'var(--on-surface)' }}>Set Default TDEE</div>
            <div style={{ fontSize: 12, color: 'var(--on-surface-variant)', marginBottom: 16 }}>Choose your daily calorie target baseline</div>
            <ScrollPicker
              value={tdeePreferences?.manualTDEEOverride || tdee}
              onChange={(v) => setTdeePreferences(p => ({ ...p, manualTDEEOverride: v }))}
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
