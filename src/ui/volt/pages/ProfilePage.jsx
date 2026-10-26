import { useState, useEffect } from 'react';
import { LogOut, Download, Share2, Camera, Shield, Link, Bike, MessageSquare, ChevronDown, CheckCircle, AlertCircle, Bell } from 'lucide-react';
import { useApp } from '../../../core/context/AppContext';
import { useProfile } from '../../../core/hooks/useProfile';
import { VoltConfirmDialog, VoltThemeToggle, VoltScrollPicker } from '../shared/VoltShared';
import { SkinPreviewVolt, SkinPreviewOriginal } from '../shared/SkinSwitch';
import { ACTIVITY } from '../../../data/constants';
import { getBMICat } from '../../../utils/calculations';
import { kgToLbs, cmToFtIn } from '../../../utils/helpers';
import { getRank } from '../../../data/muscleData';
import { VoltBlock, VoltPill, VoltLabel, VoltBar } from '../primitives';

// ─── Kaaya Volt · Profile (V-6b) ────────────────────────────────────────────
// Same logic core as V1 (useProfile), Volt presentation. ConfirmDialog,
// ThemeTogglePill and ScrollPicker are V1 shared components (V-7 popup
// pack); the avatar picker below is the Volt twin of V1's in-file modal
// (same PRESETS data + upload flow, copied per the wardrobe pattern —
// V1's file is frozen).

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

const inputStyle = {
  width: '100%', padding: '9px 11px', borderRadius: 10, fontSize: 13.5,
  background: 'var(--v-canvas)', color: 'var(--v-ink)',
  border: '2px solid var(--v-edge-quiet)', outline: 'none', fontFamily: 'inherit',
};
const fieldLabel = {
  display: 'block', fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5,
  fontWeight: 700, letterSpacing: '0.12em', color: 'var(--v-dim)',
  textTransform: 'uppercase', marginBottom: 5,
};

function MiniSeg({ options, value, onPick }) {
  return (
    <div style={{ display: 'flex', background: 'var(--v-canvas)', border: '2px solid var(--v-edge-quiet)', borderRadius: 10, padding: 3, gap: 3, flexShrink: 0 }}>
      {options.map(o => (
        <button
          key={o.k}
          type="button"
          onClick={() => onPick(o.k)}
          style={{
            borderRadius: 7, padding: '6px 13px', fontSize: 11, fontWeight: 800, cursor: 'pointer', border: 'none',
            fontFamily: "'Archivo', sans-serif",
            background: value === o.k ? 'var(--v-volt)' : 'transparent',
            color: value === o.k ? '#141416' : 'var(--v-dim)',
            transition: 'background-color 180ms cubic-bezier(0.23, 1, 0.32, 1), color 180ms cubic-bezier(0.23, 1, 0.32, 1)',
          }}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function VoltAvatarPicker({ open, onClose }) {
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
    reader.onload = async (ev) => {
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
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  };

  const tabs = ['Marvel', 'DC', 'Avatar TLA', 'Upload'];
  const filtered = PRESETS.filter(p => p.universe === tab);

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(6,8,6,0.6)', zIndex: 90, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }} onClick={onClose}>
      <div className="v-sheet-up" onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: 500, background: 'var(--v-panel)', border: '2.5px solid var(--v-edge)', borderBottom: 'none', borderRadius: '22px 22px 0 0', padding: '20px 20px 30px', maxHeight: '82vh', overflowY: 'auto' }}>
        <div className="v-num" style={{ fontSize: 19, textTransform: 'uppercase', marginBottom: 16 }}>Choose avatar</div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 20, overflowX: 'auto', paddingBottom: 4 }}>
          {tabs.map(t => (
            <button key={t} type="button" onClick={() => setTab(t)} style={{
              padding: '8px 15px', borderRadius: 999, cursor: 'pointer', whiteSpace: 'nowrap',
              border: '2px solid var(--v-edge)', fontFamily: "'Archivo', sans-serif", fontSize: 12, fontWeight: 800,
              background: tab === t ? 'var(--v-volt)' : 'var(--v-panel)', color: tab === t ? '#141416' : 'var(--v-ink)',
            }}>{t}</button>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {tab !== 'Upload' ? filtered.map(p => {
            const url = `/avatars/${p.id}.png`;
            const isSelected = user.avatarUrl === url;
            return (
              <div key={p.id} onClick={() => handlePreset(p.id)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <img src={url} alt={p.name} style={{ width: 80, height: 80, borderRadius: 16, objectFit: 'cover', border: isSelected ? '3px solid var(--v-volt)' : '3px solid var(--v-edge-quiet)' }} />
                <span style={{ fontSize: 10.5, color: 'var(--v-dim)', fontWeight: 600, textAlign: 'center' }}>{p.name}</span>
              </div>
            );
          }) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
              <label style={{ width: 80, height: 80, borderRadius: 16, background: 'var(--v-canvas)', border: '2px solid var(--v-edge-quiet)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <Camera size={24} color="var(--v-dim)" />
                <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleUpload} />
              </label>
              <span style={{ fontSize: 10.5, color: 'var(--v-dim)', fontWeight: 600, textAlign: 'center' }}>Upload photo</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SettingRow({ title, desc, children, last }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, padding: '13px 0', borderBottom: last ? 'none' : '1.5px solid var(--v-edge-quiet)' }}>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--v-ink)' }}>{title}</div>
        {desc && <div style={{ fontSize: 12, color: 'var(--v-dim)', marginTop: 2 }}>{desc}</div>}
      </div>
      {children}
    </div>
  );
}

export default function VoltProfilePage() {
  const {
    achievements, addToast, bmi, bmr, confirm, designVersion, disablePush, ed,
    enablePush, f, feedbackMessage, feedbackOpen, feedbackStatus,
    feedbackSubject, handleExport, handleFeedbackSubmit, includeProfile,
    latestBFPct, logout, lvl, muscleXP, overall, preferences, prefsLoading,
    pushEnabled, save, setConfirm, setDesignVersion, setEd, setFeedbackMessage,
    setFeedbackOpen, setFeedbackSubject, setIncludeProfile,
    setShowAvatarPicker, setShowManualTDEEPicker, setTdeePreferences, sf,
    showAvatarPicker, showManualTDEEPicker, streak, tdee, tdeePreferences,
    toggleUnitHeight, toggleUnitWeight, top4, unitHeight, unitWeight,
    updatePreferences, user,
  } = useProfile();

  const field = (fld, dispVal) => (
    <div key={fld.k} style={{ background: 'var(--v-canvas)', border: '2px solid var(--v-edge-quiet)', borderRadius: 11, padding: '10px 12px', minWidth: 0 }}>
      <label htmlFor={`v-input-${fld.k}`} style={fieldLabel}>{fld.l}</label>
      {ed ? (
        <input id={`v-input-${fld.k}`} type={fld.t} min={fld.min} max={fld.max} placeholder={fld.placeholder} value={f[fld.k] || ''} onChange={sf(fld.k)} style={{ width: '100%', padding: 0, fontSize: 13.5, background: 'transparent', border: 'none', color: 'var(--v-ink)', outline: 'none', fontFamily: 'inherit' }} />
      ) : (
        <div style={{ fontSize: 13.5, color: 'var(--v-ink)', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{dispVal}</div>
      )}
    </div>
  );

  return (
    <div className="v-screen" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <header className="v-rise">
        <VoltLabel volt>My Profile</VoltLabel>
        <h1 className="v-num" style={{ fontSize: 'clamp(1.9rem, 7vw, 2.8rem)', lineHeight: 1, margin: '8px 0 0', textTransform: 'uppercase' }}>Profile</h1>
      </header>

      {/* Identity */}
      <VoltBlock hero>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <div style={{ position: 'relative' }}>
            <button type="button" onClick={() => setShowAvatarPicker(true)} aria-label="Change avatar" style={{ width: 120, height: 120, borderRadius: 24, padding: 0, border: '2.5px solid var(--v-edge)', background: 'var(--v-canvas)', cursor: 'pointer', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {user.avatarUrl
                ? <img src={user.avatarUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <span className="v-num" style={{ fontSize: 38, color: 'var(--v-dim)' }}>{user.avatar}</span>}
            </button>
            <span style={{ position: 'absolute', bottom: -9, right: -9, background: 'var(--v-volt)', color: '#141416', border: '2px solid var(--v-edge)', borderRadius: 8, padding: '3px 8px', fontSize: 11.5, fontWeight: 800 }}>LVL {lvl}</span>
          </div>
          <div className="v-num" style={{ fontSize: 27, marginTop: 22, textTransform: 'uppercase' }}>{user.name}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--v-dim)', marginTop: 6 }}>
            <Shield size={14} /> {overall.name} · Olympus League
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
            <VoltPill onClick={() => { document.getElementById('personal-details')?.scrollIntoView({ behavior: 'smooth' }); setEd(true); }} style={{ minHeight: 48, padding: '0 24px', fontSize: 13.5 }}>Edit Profile</VoltPill>
            <button type="button" className="v-press" aria-label="Share profile" onClick={() => addToast('Profile shared!', 'success')} style={{ width: 48, height: 48, borderRadius: 14, border: '2.5px solid var(--v-edge)', background: 'var(--v-panel)', color: 'var(--v-ink)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Share2 size={19} />
            </button>
          </div>
        </div>
      </VoltBlock>

      {/* Stats strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
        {[
          { label: 'BMI', value: bmi, chip: getBMICat(bmi).label },
          { label: 'BF%', value: latestBFPct ? `${latestBFPct.toFixed(1)}%` : '—' },
          { label: 'BMR', value: bmr, unit: 'kcal' },
          { label: 'TDEE', value: tdee, unit: 'kcal' },
        ].map(s => (
          <VoltBlock key={s.label} style={{ padding: '14px 12px', minWidth: 0 }}>
            <div style={{ ...fieldLabel, marginBottom: 6 }}>{s.label}</div>
            <div className="v-num" style={{ fontSize: 20, color: 'var(--v-volt-text)', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.value}</div>
            {s.chip && <div style={{ fontSize: 9.5, color: 'var(--v-dim)', marginTop: 4, fontWeight: 700 }}>{s.chip}</div>}
            {s.unit && <div style={{ fontSize: 9.5, color: 'var(--v-dim)', marginTop: 4, fontWeight: 700, textTransform: 'uppercase' }}>{s.unit}</div>}
          </VoltBlock>
        ))}
      </div>

      {/* Muscle Mastery */}
      <VoltBlock>
        <VoltLabel volt>Muscle Mastery</VoltLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 15, marginTop: 15 }}>
          {top4.map(m => {
            const xp = muscleXP[m.key] || 0;
            const isAct = xp > 200;
            const rank = getRank(xp);
            return (
              <div key={m.key}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 7, gap: 8 }}>
                  <span className="v-num" style={{ fontSize: 13, textTransform: 'uppercase' }}>{m.label}</span>
                  <span style={{ textAlign: 'right' }}>
                    <span style={{ display: 'block', fontSize: 9.5, color: 'var(--v-dim)', fontWeight: 700, letterSpacing: '0.08em' }}>{rank.name.toUpperCase()}</span>
                    <span style={{ fontSize: 13.5, fontWeight: 800, color: isAct ? 'var(--v-volt-text)' : 'var(--v-dim)' }}>{Math.floor(xp).toLocaleString()} XP</span>
                  </span>
                </div>
                {isAct
                  ? <VoltBar value={rank.progress} height={10} />
                  : <div style={{ height: 10, borderRadius: 5, border: '2px solid var(--v-edge-quiet)', overflow: 'hidden' }}><div style={{ height: '100%', width: `${Math.max(2, rank.progress * 100)}%`, background: 'var(--v-dim)', opacity: 0.4 }} /></div>}
              </div>
            );
          })}
        </div>
      </VoltBlock>

      {/* Achievements */}
      <VoltBlock>
        <VoltLabel volt>Elite Achievements</VoltLabel>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 15 }}>
          {achievements.map(ach => (
            <div key={ach.id} style={{ border: '2px solid var(--v-edge-quiet)', borderRadius: 16, padding: 16, opacity: ach.locked ? 0.45 : 1 }}>
              <div style={{ width: 46, height: 46, borderRadius: 13, background: ach.locked ? 'var(--v-canvas)' : 'var(--v-volt)', border: '2px solid var(--v-edge)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 11 }}>
                <ach.icon size={22} color={ach.locked ? 'var(--v-dim)' : '#141416'} />
              </div>
              <div className="v-num" style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{ach.label}</div>
              <div style={{ fontSize: 11, color: 'var(--v-dim)', lineHeight: 1.5, marginTop: 5 }}>{ach.desc}</div>
            </div>
          ))}
        </div>
      </VoltBlock>

      {/* Personal Details */}
      <VoltBlock>
        <div id="personal-details" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <VoltLabel volt>Personal Details</VoltLabel>
          <div style={{ display: 'flex', gap: 8 }}>
            {ed && <VoltPill ghost onClick={() => setEd(false)} style={{ minHeight: 40, padding: '0 16px', fontSize: 12.5 }}>Cancel</VoltPill>}
            <VoltPill onClick={() => ed ? save() : setEd(true)} style={{ minHeight: 40, padding: '0 18px', fontSize: 12.5 }}>{ed ? 'Save' : 'Edit'}</VoltPill>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 10 }}>
            {[{ l: 'Full Name', k: 'name', t: 'text' }, { l: 'Email', k: 'email', t: 'email' }].map(fld => field(fld, user[fld.k] || '—'))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))', gap: 10 }}>
            {[
              { l: 'Age', k: 'age', t: 'number', min: 10, max: 100 },
              { l: unitWeight === 'lbs' ? 'Weight (lbs)' : 'Weight (kg)', k: 'weight', t: 'number' },
              { l: unitHeight === 'ft' ? 'Height (ft/in)' : 'Height (cm)', k: 'height', t: 'number' },
            ].map(fld => {
              const v = user[fld.k];
              let dispVal = (!v && v !== 0) ? '—' : String(v);
              if (v && unitWeight === 'lbs' && fld.k === 'weight') dispVal = kgToLbs(v);
              if (v && unitHeight === 'ft' && fld.k === 'height') dispVal = cmToFtIn(v);
              return field(fld, dispVal);
            })}
            <div style={{ background: 'var(--v-canvas)', border: '2px solid var(--v-edge-quiet)', borderRadius: 11, padding: '10px 12px' }}>
              <label htmlFor="v-input-gender" style={fieldLabel}>Gender</label>
              {ed ? (
                <select id="v-input-gender" value={f.gender} onChange={sf('gender')} style={{ width: '100%', padding: 0, fontSize: 13.5, background: 'transparent', border: 'none', color: 'var(--v-ink)', outline: 'none', fontFamily: 'inherit' }}>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              ) : (
                <div style={{ fontSize: 13.5, color: 'var(--v-ink)', fontWeight: 600, textTransform: 'capitalize' }}>{user.gender || '—'}</div>
              )}
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 10 }}>
            {[
              { l: 'Workout Days/Week', k: 'workoutDays', t: 'number', min: 1, max: 7 },
              { l: 'Daily Steps Goal', k: 'stepGoal', t: 'number', placeholder: 'e.g. 10000' },
              { l: 'Daily Water Goal (ml)', k: 'waterGoal', t: 'number', placeholder: 'e.g. 3000' },
            ].map(fld => field(fld, (!user[fld.k] && user[fld.k] !== 0) ? '—' : String(user[fld.k])))}
            <div style={{ background: 'var(--v-canvas)', border: '2px solid var(--v-edge-quiet)', borderRadius: 11, padding: '10px 12px' }}>
              <label htmlFor="v-input-activityLevel" style={fieldLabel}>Activity Level</label>
              {ed ? (
                <select id="v-input-activityLevel" value={f.activityLevel} onChange={sf('activityLevel')} style={{ width: '100%', padding: 0, fontSize: 13.5, background: 'transparent', border: 'none', color: 'var(--v-ink)', outline: 'none', fontFamily: 'inherit' }}>
                  {Object.entries(ACTIVITY).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                </select>
              ) : (
                <div style={{ fontSize: 13.5, color: 'var(--v-ink)', fontWeight: 600 }}>{ACTIVITY[user.activityLevel || 'moderate']?.label || '—'}</div>
              )}
            </div>
          </div>
        </div>
        <div style={{ fontSize: 11.5, color: 'var(--v-dim)', marginTop: 12, textAlign: 'right' }}>To update your goal weight, visit the Home page.</div>
      </VoltBlock>

      {/* Connected Devices */}
      <VoltBlock>
        <VoltLabel volt>Connected Devices</VoltLabel>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 12, marginTop: 15 }}>
          <VoltPill ghost onClick={() => { window.location.href = `/fitbit/authorize?state=${user.id}`; }} style={{ minHeight: 50, fontSize: 13 }}>
            <Link size={15} /> Connect Fitbit — Auto-sync steps
          </VoltPill>
          <VoltPill ghost onClick={() => { window.location.href = `/strava/authorize?state=${user.id}`; }} style={{ minHeight: 50, fontSize: 13 }}>
            <Bike size={15} /> Connect Strava — Cardio sync
          </VoltPill>
        </div>
      </VoltBlock>

      {/* Metabolism & Targets */}
      <VoltBlock>
        <VoltLabel volt>Metabolism & Targets</VoltLabel>
        <SettingRow title="Adaptive TDEE" desc="Auto-adjust targets based on weight & food logs">
          <MiniSeg
            options={[{ k: 'on', label: 'ON' }, { k: 'off', label: 'OFF' }]}
            value={tdeePreferences?.useEstimatedTDEE ? 'on' : 'off'}
            onPick={(k) => setTdeePreferences(p => ({ ...p, useEstimatedTDEE: k === 'on' }))}
          />
        </SettingRow>
        <SettingRow title="Manual TDEE Override" desc="Force a specific baseline" last={!tdeePreferences?.manualTDEEOverride}>
          <button type="button" className="v-press" onClick={() => setShowManualTDEEPicker(true)} style={{ background: 'var(--v-canvas)', color: 'var(--v-ink)', border: '2px solid var(--v-edge-quiet)', padding: '7px 12px', borderRadius: 9, fontSize: 12.5, fontWeight: 700, cursor: 'pointer' }}>
            {tdeePreferences?.manualTDEEOverride ? `${tdeePreferences.manualTDEEOverride} kcal` : 'Set manual'}
          </button>
        </SettingRow>
        {tdeePreferences?.manualTDEEOverride && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 8 }}>
            <button type="button" onClick={() => setTdeePreferences(p => ({ ...p, manualTDEEOverride: null }))} style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--v-coral-text)', background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px 8px' }}>Clear manual override</button>
          </div>
        )}
      </VoltBlock>

      {/* Notifications */}
      <VoltBlock>
        <VoltLabel volt>Notifications</VoltLabel>
        {!pushEnabled && (
          <div style={{ border: '2px solid var(--v-edge-quiet)', borderRadius: 14, padding: 15, marginTop: 15 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 11, marginBottom: 12 }}>
              <Bell size={20} color="var(--v-volt-text)" />
              <div>
                <div style={{ fontSize: 14, fontWeight: 700 }}>Enable Push Notifications</div>
                <div style={{ fontSize: 12, color: 'var(--v-dim)', marginTop: 2 }}>Get alerts for streaks and Olympus League ranking.</div>
              </div>
            </div>
            <VoltPill onClick={enablePush} style={{ width: '100%', minHeight: 48, fontSize: 13.5 }}>Enable Push Notifications</VoltPill>
          </div>
        )}
        {pushEnabled && (
          <SettingRow title="Push Notifications" desc="Enabled on this device">
            <button type="button" className="v-press" onClick={disablePush} style={{ background: 'var(--v-canvas)', color: 'var(--v-ink)', border: '2px solid var(--v-edge-quiet)', padding: '7px 12px', borderRadius: 9, fontSize: 12.5, fontWeight: 700, cursor: 'pointer' }}>Disable</button>
          </SettingRow>
        )}
        {!prefsLoading && preferences && (
          <div>
            {Object.entries({
              email_weekly: { label: 'Weekly Summary Email', desc: 'Your progress delivered to your inbox every Sunday' },
              ...(pushEnabled ? {
                workout_reminders: { label: 'Workout Reminders', desc: 'Daily nudges to hit your goals' },
                diet_reminders: { label: 'Diet Reminders', desc: 'Alerts to log your meals' },
                streak_alerts: { label: 'Streak Alerts', desc: 'Warning before you lose a streak' },
                olympus_weekly: { label: 'Olympus Weekly', desc: 'Weekly ranking summary via Push' },
                olympus_overtaken: { label: 'Overtaken Alerts', desc: 'When someone passes your rank' },
              } : {}),
            }).map(([key, info], idx, arr) => (
              <SettingRow key={key} title={info.label} desc={info.desc} last={idx === arr.length - 1}>
                <MiniSeg
                  options={[{ k: 'on', label: 'ON' }, { k: 'off', label: 'OFF' }]}
                  value={preferences[key] ? 'on' : 'off'}
                  onPick={(k) => updatePreferences({ [key]: k === 'on' })}
                />
              </SettingRow>
            ))}
          </div>
        )}
      </VoltBlock>

      {/* Appearance — live mini-renders of your own Today in both looks (V-8) */}
      <VoltBlock>
        <VoltLabel volt>Appearance</VoltLabel>
        <div style={{ fontSize: 17, fontWeight: 800, letterSpacing: '-0.01em', margin: '5px 0 4px' }}>App Design</div>
        <p style={{ fontSize: 12.5, color: 'var(--v-dim)', lineHeight: 1.5, margin: '0 0 14px' }}>
          Two looks, one app — same features, same data. Tap a look to switch instantly. Tip: long-press the bottom bar anywhere to switch fast.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <button onClick={() => setDesignVersion('volt')} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }} aria-pressed={designVersion === 'volt'}>
            <SkinPreviewVolt firstName={user?.name?.split(' ')[0] || ''} streakDays={streak?.current || 0} weightKg={f.weight || user?.weight || 0} selected={designVersion === 'volt'} />
          </button>
          <button onClick={() => setDesignVersion('v1')} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }} aria-pressed={designVersion === 'v1'}>
            <SkinPreviewOriginal firstName={user?.name?.split(' ')[0] || ''} streakDays={streak?.current || 0} weightKg={f.weight || user?.weight || 0} selected={designVersion === 'v1'} />
          </button>
        </div>
      </VoltBlock>

      {/* Settings */}
      <VoltBlock>
        <VoltLabel volt>Settings</VoltLabel>
        <SettingRow title="Weight Unit" desc="Log and display weight">
          <MiniSeg options={[{ k: 'kg', label: 'KG' }, { k: 'lbs', label: 'LBS' }]} value={unitWeight} onPick={() => toggleUnitWeight()} />
        </SettingRow>
        <SettingRow title="Height Unit" desc="Profile height display">
          <MiniSeg options={[{ k: 'cm', label: 'CM' }, { k: 'ft', label: 'FT/IN' }]} value={unitHeight} onPick={() => toggleUnitHeight()} />
        </SettingRow>
        <SettingRow title="Theme" desc="Switch display mode" last>
          <VoltThemeToggle />
        </SettingRow>
        <VoltPill ghost onClick={handleExport} style={{ width: '100%', marginTop: 16 }}>
          <Download size={16} /> Export Data
        </VoltPill>
        <VoltPill onClick={() => setConfirm(true)} style={{ width: '100%', marginTop: 10, background: 'var(--v-coral)', color: '#fff' }}>
          <LogOut size={16} /> Logout
        </VoltPill>
      </VoltBlock>

      {/* Feedback */}
      <VoltBlock style={{ padding: 0, overflow: 'hidden' }}>
        <button
          type="button"
          onClick={() => setFeedbackOpen(v => !v)}
          style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 18px', background: 'none', border: 'none', cursor: 'pointer' }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
            <span style={{ background: 'var(--v-canvas)', border: '2px solid var(--v-edge-quiet)', width: 34, height: 34, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MessageSquare size={16} color="var(--v-volt-text)" />
            </span>
            <span style={{ textAlign: 'left' }}>
              <span style={{ display: 'block', fontSize: 13.5, fontWeight: 700, color: 'var(--v-ink)' }}>Feedback & Bugs</span>
              <span style={{ display: 'block', fontSize: 11.5, color: 'var(--v-dim)', marginTop: 2 }}>Help us improve Kaaya Fit</span>
            </span>
          </span>
          <ChevronDown size={18} color="var(--v-dim)" style={{ transform: feedbackOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
        </button>
        <div style={{ maxHeight: feedbackOpen ? 520 : 0, opacity: feedbackOpen ? 1 : 0, transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', overflow: 'hidden' }}>
          <div style={{ padding: '0 18px 18px' }}>
            {feedbackStatus === 'sent' ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '18px 0', gap: 10 }}>
                <CheckCircle size={32} color="var(--v-volt-text)" />
                <div style={{ fontSize: 14, fontWeight: 700 }}>Feedback Sent</div>
                <div style={{ fontSize: 12.5, color: 'var(--v-dim)', textAlign: 'center' }}>Thank you! Your input helps shape the future of Kaaya Fit.</div>
              </div>
            ) : feedbackStatus === 'error' ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '18px 0', gap: 10 }}>
                <AlertCircle size={32} color="var(--v-coral-text)" />
                <div style={{ fontSize: 14, fontWeight: 700 }}>Failed to send</div>
                <div style={{ fontSize: 12.5, color: 'var(--v-dim)', textAlign: 'center' }}>Something went wrong. Please try again later.</div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
                <input type="text" placeholder="Subject (e.g. Bug, Feature Request)" value={feedbackSubject} onChange={e => setFeedbackSubject(e.target.value)} style={inputStyle} />
                <textarea placeholder="Tell us what's on your mind..." value={feedbackMessage} onChange={e => setFeedbackMessage(e.target.value)} rows={4} style={{ ...inputStyle, resize: 'vertical', minHeight: 80 }} />
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', padding: '2px 0' }}>
                  <input type="checkbox" checked={includeProfile} onChange={e => setIncludeProfile(e.target.checked)} style={{ accentColor: 'var(--v-volt-text)', width: 16, height: 16 }} />
                  <span style={{ fontSize: 11.5, color: 'var(--v-dim)' }}>Include basic profile data (helps with debugging)</span>
                </label>
                <VoltPill onClick={handleFeedbackSubmit} disabled={!feedbackMessage.trim() || feedbackStatus === 'sending'} style={{ width: '100%', opacity: feedbackMessage.trim() && feedbackStatus !== 'sending' ? 1 : 0.5 }}>
                  {feedbackStatus === 'sending' ? 'Sending...' : 'Send Feedback'}
                </VoltPill>
              </div>
            )}
          </div>
        </div>
      </VoltBlock>

      <VoltConfirmDialog open={confirm} title="Logout?" message="Are you sure you want to log out? Your data will persist." onConfirm={() => { setConfirm(false); logout(); }} onCancel={() => setConfirm(false)} confirmLabel="Logout" danger />
      <VoltAvatarPicker open={showAvatarPicker} onClose={() => setShowAvatarPicker(false)} />
      {showManualTDEEPicker && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 90, background: 'rgba(6,8,6,0.6)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }} onClick={() => setShowManualTDEEPicker(false)}>
          <div className="v-sheet-up" onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: 420, background: 'var(--v-panel)', border: '2.5px solid var(--v-edge)', borderBottom: 'none', borderRadius: '22px 22px 0 0', padding: '20px 20px 30px', textAlign: 'center' }}>
            <div className="v-num" style={{ fontSize: 19, textTransform: 'uppercase', marginBottom: 6 }}>Set Default TDEE</div>
            <p style={{ fontSize: 12.5, color: 'var(--v-dim)', marginBottom: 14 }}>Choose your daily calorie target baseline</p>
            <VoltScrollPicker
              value={tdeePreferences?.manualTDEEOverride || tdee}
              onChange={(v) => setTdeePreferences(p => ({ ...p, manualTDEEOverride: v }))}
              items={Array.from({ length: Math.floor((4500 - 1200) / 50) + 1 }, (_, i) => 1200 + i * 50)}
              unit="kcal"
            />
            <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
              <VoltPill ghost onClick={() => setShowManualTDEEPicker(false)} style={{ flex: 1 }}>Cancel</VoltPill>
              <VoltPill onClick={() => setShowManualTDEEPicker(false)} style={{ flex: 1 }}>Done</VoltPill>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
