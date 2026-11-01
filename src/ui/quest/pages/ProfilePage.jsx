import { Portal } from '../../v1/shared/SharedComponents';
import { useApp } from '../../../core/context/AppContext';
import { useProfile } from '../../../core/hooks/useProfile';
import { SkinPreviewVolt, SkinPreviewOriginal } from '../../volt/shared/SkinSwitch';
import { ACTIVITY } from '../../../data/constants';
import { getBMICat } from '../../../utils/calculations';
import { kgToLbs, cmToFtIn } from '../../../utils/helpers';
import { getRank } from '../../../data/muscleData';
import { FIGHTERS, FIGHTER_BY_ID, FighterSprite, isUnlocked, unlockLabel, useFighter } from '../fighters';
import { QuestConfirmDialog } from '../shared/QuestShared';
import { QuestBlock, QuestBtn, QuestChip, QuestLabel, SegBar } from '../primitives';
import PixelSprite from '../PixelSprite';

// ─── Kaaya Quest · Profile — the CHARACTER SHEET (plan §7.5, Q-7) ───────────
// Same brain as V1/Volt (useProfile), Quest presentation: your fighter is
// your avatar (the Quest identity since Q-1 — the picker below swaps the
// device-local fighter; preset/photo avatars remain untouched in the data
// and still show in the other skins), LVL badge, vitals tiles with the
// PR #47 BMR honesty rule, power stats as mastery segbars, settings as a
// menu list. Appearance carries the two existing skin previews (the same
// components V1/Volt use) plus the current Quest card — the 3-way switcher
// itself is Q-8.

const ACH_SPRITES = { streak: 'flame', 'volume-king': 'dumbbell', 'heavy-hitter': 'trophy', 'early-bird': 'clock' };

function QuestSeg({ options, value, onPick }) {
  return (
    <div style={{ display: 'flex', background: 'var(--q-slot)', border: '3px solid var(--q-border)', padding: 3, gap: 3, flexShrink: 0 }}>
      {options.map(o => (
        <button
          key={o.k}
          type="button"
          onClick={() => onPick(o.k)}
          style={{
            padding: '6px 13px', fontSize: 16, fontFamily: "'VT323', monospace", fontWeight: 700, cursor: 'pointer', border: 'none',
            background: value === o.k ? 'var(--q-volt)' : 'transparent',
            color: value === o.k ? 'var(--q-btn-fg)' : 'var(--q-dim)',
          }}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function SettingRow({ title, desc, children, last }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: last ? 'none' : '2px solid var(--q-panel2)' }}>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 19, fontWeight: 700 }}>{title}</div>
        {desc && <div style={{ fontSize: 16, color: 'var(--q-dim)', marginTop: 2, lineHeight: 1.4 }}>{desc}</div>}
      </div>
      {children}
    </div>
  );
}

function FighterPicker({ open, onClose, lvl, tierName }) {
  const { fighter, setFighter } = useFighter();
  if (!open) return null;
  return (
    <Portal>
      <div className="q-sheet-wrap" onClick={onClose}>
        <div className="q-sheet" role="dialog" aria-label="Choose your fighter" onClick={e => e.stopPropagation()}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span className="q-ps" style={{ fontSize: 13 }}>CHOOSE YOUR FIGHTER</span>
            <button type="button" className="q-chip" aria-label="Close" onClick={onClose} style={{ cursor: 'pointer', padding: '7px 9px' }}>
              <PixelSprite name="x" size={13} />
            </button>
          </div>
          <p style={{ fontSize: 17, color: 'var(--q-dim)', marginBottom: 16, lineHeight: 1.45 }}>Your fighter is your Quest avatar — shown on Today and in battle. Unlock more by levelling up.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            {FIGHTERS.map(fr => {
              const unlocked = isUnlocked(fr, { level: lvl, tier: tierName });
              const selected = fighter === fr.id;
              return (
                <button
                  key={fr.id}
                  type="button"
                  disabled={!unlocked}
                  onClick={() => { setFighter(fr.id); onClose(); }}
                  className="q-block q-block--slot"
                  style={{
                    padding: '12px 6px 10px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7,
                    cursor: unlocked ? 'pointer' : 'not-allowed', opacity: unlocked ? 1 : 0.5,
                    borderColor: selected ? 'var(--q-volt)' : undefined, color: 'var(--q-ink)',
                  }}
                  aria-pressed={selected}
                >
                  <FighterSprite fighter={fr.id} state="idle" size={62} />
                  <span className="q-ps" style={{ fontSize: 10 }}>{fr.name}</span>
                  <span style={{ fontSize: 14, color: selected ? 'var(--q-volt-text)' : 'var(--q-dim)', lineHeight: 1.2, textAlign: 'center' }}>
                    {selected ? '▶ ACTIVE' : unlocked ? fr.title.replace('THE ', '') : `LOCKED · ${unlockLabel(fr)}`}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </Portal>
  );
}

export default function ProfilePage() {
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
  const { theme, toggleTheme } = useApp();
  const { fighter } = useFighter();

  // BMR is only meaningful with weight, height and age on file (PR #47 rule).
  const bmrValid = Boolean(user?.weight && user?.height && user?.age);
  const field = (fld, dispVal) => (
    <div key={fld.k} className="q-block q-block--slot" style={{ padding: '9px 11px', minWidth: 0 }}>
      <label htmlFor={`q-input-${fld.k}`} style={{ display: 'block' }}>
        <QuestLabel>{fld.l}</QuestLabel>
      </label>
      {ed ? (
        <input id={`q-input-${fld.k}`} type={fld.t} min={fld.min} max={fld.max} placeholder={fld.placeholder} value={f[fld.k] || ''} onChange={sf(fld.k)} style={{ width: '100%', padding: 0, fontSize: 19, background: 'transparent', border: 'none', color: 'var(--q-ink)', outline: 'none', fontFamily: "'VT323', monospace" }} />
      ) : (
        <div style={{ fontSize: 19, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: 2 }}>{dispVal}</div>
      )}
    </div>
  );
  const selectTileStyle = { width: '100%', padding: 0, fontSize: 19, background: 'transparent', border: 'none', color: 'var(--q-ink)', outline: 'none', fontFamily: "'VT323', monospace" };

  return (
    <div className="q-screen" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <header>
        <QuestLabel tone="volt">My Profile</QuestLabel>
        <h1 className="q-ps" style={{ fontSize: 'clamp(19px, 6vw, 30px)', lineHeight: 1.35, margin: '10px 0 0' }}>CHARACTER SHEET</h1>
      </header>

      {/* Identity */}
      <QuestBlock>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <div style={{ position: 'relative' }}>
            <button type="button" onClick={() => setShowAvatarPicker(true)} aria-label="Change fighter" className="q-block q-block--panel2" style={{ width: 124, height: 124, padding: 0, cursor: 'pointer', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FighterSprite fighter={fighter} state="idle" size={104} />
            </button>
            <span className="q-chip q-chip--gold" style={{ position: 'absolute', bottom: -10, right: -12 }}>LVL {lvl}</span>
          </div>
          <div className="q-ps" style={{ fontSize: 17, lineHeight: 1.5, marginTop: 24, textTransform: 'uppercase' }}>{user.name}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 18, color: 'var(--q-dim)', marginTop: 7 }}>
            <PixelSprite name="crown" size={15} />
            {FIGHTER_BY_ID[fighter]?.title} · {overall.name} — Olympus League
          </div>
          <div style={{ fontSize: 17, color: 'var(--q-dim)', marginTop: 4 }}>
            {Math.floor(overall.totalXP).toLocaleString()} XP · {streak?.current || 0} day streak
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
            <QuestBtn onClick={() => { document.getElementById('personal-details')?.scrollIntoView({ behavior: 'smooth' }); setEd(true); }}>EDIT PROFILE</QuestBtn>
            <QuestBtn tone="ghost" aria-label="Share profile" onClick={() => addToast('Profile shared!', 'success')} style={{ padding: '0 14px' }}>
              <PixelSprite name="mail" size={16} />
            </QuestBtn>
          </div>
        </div>
      </QuestBlock>

      {/* Vitals */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
        {[
          { label: 'BMI', value: bmi, chip: getBMICat(bmi).label },
          { label: 'BF%', value: latestBFPct ? `${latestBFPct.toFixed(1)}%` : '—' },
          { label: 'BMR', value: bmrValid ? bmr : '—', unit: bmrValid ? 'kcal' : '' },
          { label: 'TDEE', value: tdee, unit: 'kcal' },
        ].map(s => (
          <QuestBlock key={s.label} style={{ padding: '12px 11px', minWidth: 0 }}>
            <QuestLabel>{s.label}</QuestLabel>
            <div className="q-ps" style={{ fontSize: 15, color: 'var(--q-volt-text)', marginTop: 6, overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.value}</div>
            {s.chip && <div style={{ fontSize: 13, color: 'var(--q-dim)', marginTop: 4 }}>{s.chip}</div>}
            {s.unit && <div style={{ fontSize: 13, color: 'var(--q-dim)', marginTop: 4, textTransform: 'uppercase' }}>{s.unit}</div>}
          </QuestBlock>
        ))}
      </div>

      {/* Power Stats (Muscle Mastery) */}
      <QuestBlock>
        <QuestLabel tone="volt">Power Stats — Muscle Mastery</QuestLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 15, marginTop: 15 }}>
          {top4.map(m => {
            const xp = muscleXP[m.key] || 0;
            const isAct = xp > 200;
            const rank = getRank(xp);
            return (
              <div key={m.key}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 7, gap: 8 }}>
                  <span className="q-ps" style={{ fontSize: 10 }}>{m.label.toUpperCase()}</span>
                  <span style={{ textAlign: 'right' }}>
                    <span style={{ display: 'block', fontSize: 13, color: 'var(--q-dim)', letterSpacing: '0.06em' }}>{rank.name.toUpperCase()}</span>
                    <span style={{ fontSize: 18, fontWeight: 700, color: isAct ? 'var(--q-volt-text)' : 'var(--q-dim)' }}>{Math.floor(xp).toLocaleString()} XP</span>
                  </span>
                </div>
                <div style={isAct ? undefined : { opacity: 0.4 }}>
                  <SegBar value={rank.progress} segments={12} label={`${m.label} mastery`} />
                </div>
              </div>
            );
          })}
        </div>
      </QuestBlock>

      {/* Achievements */}
      <QuestBlock>
        <QuestLabel tone="volt">Elite Achievements</QuestLabel>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 11, marginTop: 14 }}>
          {achievements.map(ach => (
            <div key={ach.id} className="q-block q-block--slot" style={{ padding: 14, opacity: ach.locked ? 0.45 : 1 }}>
              <div style={{
                width: 46, height: 46, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10,
                background: ach.locked ? 'var(--q-panel)' : 'var(--q-volt)', border: '3px solid var(--q-border)',
              }}>
                <PixelSprite name={ACH_SPRITES[ach.id] || 'star'} size={23} />
              </div>
              <div className="q-ps" style={{ fontSize: 9, lineHeight: 1.6 }}>{ach.label.toUpperCase()}</div>
              <div style={{ fontSize: 15, color: 'var(--q-dim)', lineHeight: 1.45, marginTop: 5 }}>{ach.desc}</div>
            </div>
          ))}
        </div>
      </QuestBlock>

      {/* Personal Details */}
      <QuestBlock>
        <div id="personal-details" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 13 }}>
          <QuestLabel tone="volt">Personal Details</QuestLabel>
          <div style={{ display: 'flex', gap: 8 }}>
            {ed && <QuestBtn sm tone="ghost" onClick={() => setEd(false)}>CANCEL</QuestBtn>}
            <QuestBtn sm onClick={() => ed ? save() : setEd(true)}>{ed ? 'SAVE' : 'EDIT'}</QuestBtn>
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
            <div className="q-block q-block--slot" style={{ padding: '9px 11px' }}>
              <label htmlFor="q-input-gender" style={{ display: 'block' }}><QuestLabel>Gender</QuestLabel></label>
              {ed ? (
                <select id="q-input-gender" value={f.gender} onChange={sf('gender')} style={selectTileStyle}>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              ) : (
                <div style={{ fontSize: 19, fontWeight: 600, textTransform: 'capitalize', marginTop: 2 }}>{user.gender || '—'}</div>
              )}
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 10 }}>
            {[
              { l: 'Workout Days/Week', k: 'workoutDays', t: 'number', min: 1, max: 7 },
              { l: 'Daily Steps Goal', k: 'stepGoal', t: 'number', placeholder: 'e.g. 10000' },
              { l: 'Daily Water Goal (ml)', k: 'waterGoal', t: 'number', placeholder: 'e.g. 3000' },
            ].map(fld => field(fld, (!user[fld.k] && user[fld.k] !== 0) ? '—' : String(user[fld.k])))}
            <div className="q-block q-block--slot" style={{ padding: '9px 11px' }}>
              <label htmlFor="q-input-activityLevel" style={{ display: 'block' }}><QuestLabel>Activity Level</QuestLabel></label>
              {ed ? (
                <select id="q-input-activityLevel" value={f.activityLevel} onChange={sf('activityLevel')} style={selectTileStyle}>
                  {Object.entries(ACTIVITY).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                </select>
              ) : (
                <div style={{ fontSize: 19, fontWeight: 600, marginTop: 2 }}>{ACTIVITY[user.activityLevel || 'moderate']?.label || '—'}</div>
              )}
            </div>
          </div>
        </div>
        <div style={{ fontSize: 15, color: 'var(--q-dim)', marginTop: 11, textAlign: 'right' }}>To update your goal weight, visit the Home page.</div>
      </QuestBlock>

      {/* Connected Devices */}
      <QuestBlock>
        <QuestLabel tone="volt">Connected Devices</QuestLabel>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 11, marginTop: 14 }}>
          <QuestBtn tone="ghost" onClick={() => { window.location.href = `/fitbit/authorize?state=${user.id}`; }}>
            CONNECT FITBIT — AUTO-SYNC STEPS
          </QuestBtn>
          <QuestBtn tone="ghost" onClick={() => { window.location.href = `/strava/authorize?state=${user.id}`; }}>
            CONNECT STRAVA — CARDIO SYNC
          </QuestBtn>
        </div>
      </QuestBlock>

      {/* Metabolism & Targets */}
      <QuestBlock>
        <QuestLabel tone="volt">Metabolism &amp; Targets</QuestLabel>
        <SettingRow title="Adaptive TDEE" desc="Auto-adjust targets based on weight & food logs">
          <QuestSeg
            options={[{ k: 'on', label: 'ON' }, { k: 'off', label: 'OFF' }]}
            value={tdeePreferences?.useEstimatedTDEE ? 'on' : 'off'}
            onPick={(k) => setTdeePreferences(p => ({ ...p, useEstimatedTDEE: k === 'on' }))}
          />
        </SettingRow>
        <SettingRow title="Manual TDEE Override" desc="Force a specific baseline" last={!tdeePreferences?.manualTDEEOverride}>
          <button type="button" onClick={() => setShowManualTDEEPicker(true)} className="q-chip" style={{ cursor: 'pointer', padding: '8px 12px', fontSize: 16 }}>
            {tdeePreferences?.manualTDEEOverride ? `${tdeePreferences.manualTDEEOverride} kcal` : 'SET MANUAL'}
          </button>
        </SettingRow>
        {tdeePreferences?.manualTDEEOverride && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 8 }}>
            <button type="button" onClick={() => setTdeePreferences(p => ({ ...p, manualTDEEOverride: null }))} style={{ fontSize: 16, fontFamily: "'VT323', monospace", color: 'var(--q-ember-text)', background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px 8px' }}>CLEAR MANUAL OVERRIDE</button>
          </div>
        )}
      </QuestBlock>

      {/* Notifications */}
      <QuestBlock>
        <QuestLabel tone="volt">Notifications</QuestLabel>
        {!pushEnabled && (
          <div className="q-block q-block--slot" style={{ padding: 14, marginTop: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 11, marginBottom: 12 }}>
              <PixelSprite name="flame" size={21} />
              <div>
                <div style={{ fontSize: 19, fontWeight: 700 }}>Enable Push Notifications</div>
                <div style={{ fontSize: 16, color: 'var(--q-dim)', marginTop: 2, lineHeight: 1.4 }}>Get alerts for streaks and Olympus League ranking.</div>
              </div>
            </div>
            <QuestBtn onClick={enablePush} style={{ width: '100%' }}>ENABLE PUSH NOTIFICATIONS</QuestBtn>
          </div>
        )}
        {pushEnabled && (
          <SettingRow title="Push Notifications" desc="Enabled on this device">
            <button type="button" onClick={disablePush} className="q-chip" style={{ cursor: 'pointer', padding: '8px 12px', fontSize: 16 }}>DISABLE</button>
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
                <QuestSeg
                  options={[{ k: 'on', label: 'ON' }, { k: 'off', label: 'OFF' }]}
                  value={preferences[key] ? 'on' : 'off'}
                  onPick={(k) => updatePreferences({ [key]: k === 'on' })}
                />
              </SettingRow>
            ))}
          </div>
        )}
      </QuestBlock>

      {/* Appearance */}
      <QuestBlock>
        <QuestLabel tone="volt">Appearance</QuestLabel>
        <div style={{ fontSize: 20, fontWeight: 700, margin: '6px 0 4px' }}>App Design</div>
        <p style={{ fontSize: 17, color: 'var(--q-dim)', lineHeight: 1.5, margin: '0 0 13px' }}>
          Three looks, one app — same features, same data. Tap a look to switch instantly. Tip: long-press the bottom bar anywhere to switch fast.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <button type="button" onClick={() => setDesignVersion('volt')} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }} aria-pressed={designVersion === 'volt'}>
            <SkinPreviewVolt firstName={user?.name?.split(' ')[0] || ''} streakDays={streak?.current || 0} weightKg={f.weight || user?.weight || 0} selected={designVersion === 'volt'} />
          </button>
          <button type="button" onClick={() => setDesignVersion('v1')} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }} aria-pressed={designVersion === 'v1'}>
            <SkinPreviewOriginal firstName={user?.name?.split(' ')[0] || ''} streakDays={streak?.current || 0} weightKg={f.weight || user?.weight || 0} selected={designVersion === 'v1'} />
          </button>
        </div>
        <div className="q-block q-block--panel2" style={{ marginTop: 10, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 12, borderColor: 'var(--q-volt)' }}>
          <FighterSprite fighter={fighter} state="idle" size={40} />
          <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
            <div className="q-ps" style={{ fontSize: 11 }}>KAAYA QUEST</div>
            <div style={{ fontSize: 16, color: 'var(--q-dim)', marginTop: 3 }}>The 8-bit arcade look</div>
          </div>
          <QuestChip tone="volt">▶ INSERTED</QuestChip>
        </div>
      </QuestBlock>

      {/* Settings */}
      <QuestBlock>
        <QuestLabel tone="volt">Settings</QuestLabel>
        <SettingRow title="Weight Unit" desc="Log and display weight">
          <QuestSeg options={[{ k: 'kg', label: 'KG' }, { k: 'lbs', label: 'LBS' }]} value={unitWeight} onPick={() => toggleUnitWeight()} />
        </SettingRow>
        <SettingRow title="Height Unit" desc="Profile height display">
          <QuestSeg options={[{ k: 'cm', label: 'CM' }, { k: 'ft', label: 'FT/IN' }]} value={unitHeight} onPick={() => toggleUnitHeight()} />
        </SettingRow>
        <SettingRow title="Theme" desc="Switch display mode" last>
          <button type="button" onClick={toggleTheme} className="q-chip" aria-label="Toggle theme" style={{ cursor: 'pointer', padding: '8px 11px', display: 'inline-flex', alignItems: 'center', gap: 7 }}>
            <PixelSprite name={theme === 'dark' ? 'sun' : 'moon'} size={15} />
            {theme === 'dark' ? 'DAY CART' : 'DARK'}
          </button>
        </SettingRow>
        <QuestBtn tone="ghost" onClick={handleExport} style={{ width: '100%', marginTop: 15 }}>
          EXPORT DATA
        </QuestBtn>
        <QuestBtn tone="ember" onClick={() => setConfirm(true)} style={{ width: '100%', marginTop: 10 }}>
          LOGOUT
        </QuestBtn>
      </QuestBlock>

      {/* Feedback */}
      <QuestBlock style={{ padding: 0, overflow: 'hidden' }}>
        <button
          type="button"
          onClick={() => setFeedbackOpen(v => !v)}
          style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '15px 16px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--q-ink)' }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
            <span className="q-block q-block--slot" style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}>
              <PixelSprite name="bot" size={18} />
            </span>
            <span style={{ textAlign: 'left' }}>
              <span style={{ display: 'block', fontSize: 19, fontWeight: 700 }}>Feedback &amp; Bugs</span>
              <span style={{ display: 'block', fontSize: 15, color: 'var(--q-dim)', marginTop: 2 }}>Help us improve Kaaya Fit</span>
            </span>
          </span>
          <PixelSprite name="chevR" size={13} style={{ transform: feedbackOpen ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }} />
        </button>
        <div style={{ maxHeight: feedbackOpen ? 560 : 0, opacity: feedbackOpen ? 1 : 0, transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', overflow: 'hidden' }}>
          <div style={{ padding: '0 16px 16px' }}>
            {feedbackStatus === 'sent' ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px 0', gap: 9 }}>
                <PixelSprite name="check" size={32} />
                <div className="q-ps" style={{ fontSize: 12 }}>FEEDBACK SENT</div>
                <div style={{ fontSize: 17, color: 'var(--q-dim)', textAlign: 'center' }}>Thank you! Your input helps shape the future of Kaaya Fit.</div>
              </div>
            ) : feedbackStatus === 'error' ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px 0', gap: 9 }}>
                <PixelSprite name="x" size={32} />
                <div className="q-ps" style={{ fontSize: 12, color: 'var(--q-ember-text)' }}>FAILED TO SEND</div>
                <div style={{ fontSize: 17, color: 'var(--q-dim)', textAlign: 'center' }}>Something went wrong. Please try again later.</div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
                <input className="q-slot-input" type="text" placeholder="Subject (e.g. Bug, Feature Request)" value={feedbackSubject} onChange={e => setFeedbackSubject(e.target.value)} />
                <textarea className="q-slot-input" placeholder="Tell us what's on your mind..." value={feedbackMessage} onChange={e => setFeedbackMessage(e.target.value)} rows={4} style={{ resize: 'vertical', minHeight: 84, width: '100%' }} />
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', padding: '2px 0' }}>
                  <input type="checkbox" checked={includeProfile} onChange={e => setIncludeProfile(e.target.checked)} style={{ accentColor: 'var(--q-volt)', width: 17, height: 17 }} />
                  <span style={{ fontSize: 15, color: 'var(--q-dim)' }}>Include basic profile data (helps with debugging)</span>
                </label>
                <QuestBtn onClick={handleFeedbackSubmit} disabled={!feedbackMessage.trim() || feedbackStatus === 'sending'} style={{ width: '100%', opacity: feedbackMessage.trim() && feedbackStatus !== 'sending' ? 1 : 0.5 }}>
                  {feedbackStatus === 'sending' ? 'SENDING…' : 'SEND FEEDBACK'}
                </QuestBtn>
              </div>
            )}
          </div>
        </div>
      </QuestBlock>

      <QuestConfirmDialog open={confirm} title="Logout?" message="Are you sure you want to log out? Your data will persist." onConfirm={() => { setConfirm(false); logout(); }} onCancel={() => setConfirm(false)} confirmLabel="Logout" danger />
      <FighterPicker open={showAvatarPicker} onClose={() => setShowAvatarPicker(false)} lvl={lvl} tierName={overall.name} />
      {showManualTDEEPicker && (
        <Portal>
          <div className="q-sheet-wrap" onClick={() => setShowManualTDEEPicker(false)}>
            <div className="q-sheet" role="dialog" aria-label="Set default TDEE" onClick={e => e.stopPropagation()} style={{ maxHeight: '78vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <div className="q-ps" style={{ fontSize: 13, textAlign: 'center' }}>SET DEFAULT TDEE</div>
              <p style={{ fontSize: 17, color: 'var(--q-dim)', margin: '8px 0 13px', textAlign: 'center' }}>Choose your daily calorie target baseline</p>
              <div style={{ overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 7, paddingRight: 2 }}>
                {Array.from({ length: Math.floor((4500 - 1200) / 50) + 1 }, (_, i) => 1200 + i * 50).map(v => {
                  const active = (tdeePreferences?.manualTDEEOverride || tdee) === v;
                  return (
                    <button
                      key={v}
                      type="button"
                      className={active ? 'q-sheet-row q-sheet-row--active' : 'q-sheet-row'}
                      onClick={() => setTdeePreferences(p => ({ ...p, manualTDEEOverride: v }))}
                      style={{ justifyContent: 'center', fontSize: 20 }}
                    >
                      {v.toLocaleString()} kcal
                    </button>
                  );
                })}
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
                <QuestBtn tone="ghost" onClick={() => setShowManualTDEEPicker(false)} style={{ flex: 1 }}>CANCEL</QuestBtn>
                <QuestBtn onClick={() => setShowManualTDEEPicker(false)} style={{ flex: 1 }}>DONE</QuestBtn>
              </div>
            </div>
          </div>
        </Portal>
      )}
    </div>
  );
}
