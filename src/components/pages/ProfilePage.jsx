import { useState } from 'react';
import { LogOut, Download, Upload } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PageHeader, ConfirmDialog, ThemeTogglePill } from '../shared/SharedComponents';
import { ACTIVITY } from '../../data/constants';
import { calcBMI, getBMICat, calcBMR, calcTDEE } from '../../utils/calculations';
import { fmt, kgToLbs, cmToFtIn } from '../../utils/helpers';
import { exportData, importData } from '../../utils/storage';

export default function ProfilePage() {
  const { user, setUsers, logout, theme, toggleTheme, addToast } = useApp();
  const unitWeight = user.unitWeight || 'kg';
  const unitHeight = user.unitHeight || 'cm';
  const toggleUnitWeight = () => {
    setUsers(p => p.map(u => u.id === user.id ? { ...u, unitWeight: unitWeight === 'kg' ? 'lbs' : 'kg' } : u));
  };
  const toggleUnitHeight = () => {
    setUsers(p => p.map(u => u.id === user.id ? { ...u, unitHeight: unitHeight === 'cm' ? 'ft' : 'cm' } : u));
  };
  const [ed, setEd] = useState(false);
  const [f, setF] = useState({ ...user });
  const [confirm, setConfirm] = useState(false);
  const sf = k => e => setF(p => ({ ...p, [k]: e.target.value }));

  const save = () => {
    setUsers(p => p.map(u => u.id === user.id ? { ...u, ...f, weight: parseFloat(f.weight), height: parseFloat(f.height), age: parseInt(f.age), workoutDays: parseInt(f.workoutDays), weightGoal: f.weightGoal ? parseFloat(f.weightGoal) : null } : u));
    setEd(false);
    addToast('Profile updated!', 'success');
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

  return (
    <div className="pg-in">
      <PageHeader title="My Profile" />
      <div style={{ display: 'grid', gridTemplateColumns: '230px 1fr', gap: 14 }} className="g2">
        <div className="card" style={{ padding: 22, textAlign: 'center', height: 'fit-content' }}>
          <div style={{ width: 66, height: 66, borderRadius: '50%', background: 'linear-gradient(45deg, var(--primary), var(--surface-container-high))', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', fontFamily: "'Bebas Neue'", fontSize: 24, color: '#fff', letterSpacing: '2px', boxShadow: 'var(--glow-primary)' }}>{user.avatar}</div>
          <div className="headline-md" style={{ fontSize: 18, color: 'var(--on-surface)' }}>{user.name}</div>
          {user.isAdmin && <div style={{ marginTop: 5 }}><span className="tag" style={{ fontSize: 8, background: 'var(--surface-container-highest)', color: 'var(--primary)' }}>⚡ Admin</span></div>}
          <div style={{ fontSize: 10, color: 'var(--on-surface-dim)', marginTop: 5 }}>Since {fmt(user.joinDate)}</div>
          <div className="tonal-break" style={{ height: 1, background: 'var(--surface-container-highest)', margin: '14px 0' }} />
          <div className="display-lg" style={{ color: 'var(--primary)', lineHeight: 1 }}>{bmi}</div>
          <span className="tag" style={{ marginTop: 8, display: 'inline-flex', fontSize: 10, background: 'var(--surface-container-highest)', color: 'var(--on-surface-variant)' }}>{getBMICat(bmi).label} BMI</span>
          <div style={{ marginTop: 12, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {[{ l: 'BMR', v: bmr, u: 'kcal' }, { l: 'TDEE', v: tdee, u: 'kcal' }].map(m => (
              <div key={m.l} style={{ padding: '10px 8px', background: 'var(--surface-container-lowest)', borderRadius: 10, border: 'none' }}>
                <div style={{ fontSize: 9, color: 'var(--on-surface-dim)', fontWeight: 700 }}>{m.l}</div>
                <div className="headline-md" style={{ color: 'var(--primary)', marginTop: 2 }}>{m.v}</div>
                <div style={{ fontSize: 9, color: 'var(--on-surface-dim)', marginTop: 2 }}>{m.u}</div>
              </div>
            ))}
          </div>
          <div className="sep" style={{ background: 'var(--surface-container-highest)' }} />

          {/* Weight Unit toggle */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 12px', background: 'var(--surface-container-low)', borderRadius: 14, border: 'none', marginBottom: 10 }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--on-surface)' }}>Weight Unit</div>
              <div style={{ fontSize: 11, color: 'var(--on-surface-variant)', marginTop: 2 }}>Log and display weight</div>
            </div>
            <div style={{ display: 'flex', gap: 2, padding: 3, borderRadius: 10, background: 'var(--surface-container-highest)' }}>
              <button onClick={toggleUnitWeight} style={{ borderRadius: 8, padding: '6px 14px', fontSize: 11, fontWeight: 700, cursor: 'pointer', border: 'none', background: unitWeight === 'kg' ? 'var(--primary)' : 'transparent', color: unitWeight === 'kg' ? 'var(--on-primary)' : 'var(--on-surface-variant)', boxShadow: unitWeight === 'kg' ? 'var(--shadow-lg)' : 'none', transition: 'all .2s var(--ease-smooth)' }}>KG</button>
              <button onClick={toggleUnitWeight} style={{ borderRadius: 8, padding: '6px 14px', fontSize: 11, fontWeight: 700, cursor: 'pointer', border: 'none', background: unitWeight === 'lbs' ? 'var(--primary)' : 'transparent', color: unitWeight === 'lbs' ? 'var(--on-primary)' : 'var(--on-surface-variant)', boxShadow: unitWeight === 'lbs' ? 'var(--shadow-lg)' : 'none', transition: 'all .2s var(--ease-smooth)' }}>LBS</button>
            </div>
          </div>

          {/* Height Unit toggle */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 12px', background: 'var(--surface-container-low)', borderRadius: 14, border: 'none', marginBottom: 10 }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--on-surface)' }}>Height Unit</div>
              <div style={{ fontSize: 11, color: 'var(--on-surface-variant)', marginTop: 2 }}>Profile height display</div>
            </div>
            <div style={{ display: 'flex', gap: 2, padding: 3, borderRadius: 10, background: 'var(--surface-container-highest)' }}>
              <button onClick={toggleUnitHeight} style={{ borderRadius: 8, padding: '6px 14px', fontSize: 11, fontWeight: 700, cursor: 'pointer', border: 'none', background: unitHeight === 'cm' ? 'var(--primary)' : 'transparent', color: unitHeight === 'cm' ? 'var(--on-primary)' : 'var(--on-surface-variant)', boxShadow: unitHeight === 'cm' ? 'var(--shadow-lg)' : 'none', transition: 'all .2s var(--ease-smooth)' }}>CM</button>
              <button onClick={toggleUnitHeight} style={{ borderRadius: 8, padding: '6px 14px', fontSize: 11, fontWeight: 700, cursor: 'pointer', border: 'none', background: unitHeight === 'ft' ? 'var(--primary)' : 'transparent', color: unitHeight === 'ft' ? 'var(--on-primary)' : 'var(--on-surface-variant)', boxShadow: unitHeight === 'ft' ? 'var(--shadow-lg)' : 'none', transition: 'all .2s var(--ease-smooth)' }}>FT/IN</button>
            </div>
          </div>

          {/* Theme toggle */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 12px', background: 'var(--surface-container-low)', borderRadius: 14, border: 'none', marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--on-surface)' }}>Theme</div>
              <div style={{ fontSize: 11, color: 'var(--on-surface-variant)', marginTop: 2 }}>Switch display mode</div>
            </div>
            <ThemeTogglePill />
          </div>

          {/* Export/Import */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginBottom: 8 }}>
            <button className="btn-g" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, fontSize: 11 }} onClick={handleExport}><Download size={12} /> Export</button>
            <button className="btn-g" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, fontSize: 11 }} onClick={handleImport}><Upload size={12} /> Import</button>
          </div>

          <button className="btn-d" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, borderRadius: 10, padding: '10px' }} onClick={() => setConfirm(true)}><LogOut size={13} /> Logout</button>
        </div>
        <div className="card" style={{ padding: 22 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
            <div className="headline-md" style={{ color: 'var(--on-surface)' }}>Personal Details</div>
            <button className="btn-g" style={{ fontSize: 12, padding: '6px 12px' }} onClick={() => ed ? save() : setEd(true)}>{ed ? '✓ Save' : '✏️ Edit'}</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            {[{ l: 'Full Name', k: 'name', t: 'text' }, { l: 'Age', k: 'age', t: 'number' }, { l: 'Email', k: 'email', t: 'email' }, { l: unitWeight === 'lbs' ? 'Weight (lbs)' : 'Weight (kg)', k: 'weight', t: 'number' }, { l: unitHeight === 'ft' ? 'Height (ft/in)' : 'Height (cm)', k: 'height', t: 'number' }, { l: unitWeight === 'lbs' ? 'Weight Goal (lbs)' : 'Weight Goal (kg)', k: 'weightGoal', t: 'number' }, { l: 'Workout Days/Week', k: 'workoutDays', t: 'number' }].map(fld => {
              const dispVal = (k, v) => {
                if (!v && v !== 0) return 'Not set';
                if (unitWeight === 'lbs' && (k === 'weight' || k === 'weightGoal')) return kgToLbs(v);
                if (unitHeight === 'ft' && k === 'height') return cmToFtIn(v);
                return String(v);
              };
              return (
              <div key={fld.k}><label style={{ color: 'var(--on-surface-dim)' }}>{fld.l}</label>{ed ? <input type={fld.t} value={f[fld.k] || ''} onChange={sf(fld.k)} style={{ padding: '10px 12px', fontSize: 14, width: '100%' }} /> : <div style={{ padding: '10px 12px', background: 'var(--surface-container-lowest)', borderRadius: '10px 10px 0 0', fontSize: 14, border: 'none', borderBottom: '2px solid var(--surface-container-highest)', color: fld.k === 'weightGoal' && !user[fld.k] ? 'var(--on-surface-dim)' : 'var(--on-surface)' }}>{dispVal(fld.k, user[fld.k])}</div>}</div>
              );
            })}
            <div><label style={{ color: 'var(--on-surface-dim)' }}>Gender</label>{ed ? <select value={f.gender} onChange={sf('gender')} style={{ padding: '10px 12px', fontSize: 14, width: '100%' }}><option value="male">Male</option><option value="female">Female</option><option value="other">Other</option></select> : <div style={{ padding: '10px 12px', background: 'var(--surface-container-lowest)', borderRadius: '10px 10px 0 0', fontSize: 14, border: 'none', borderBottom: '2px solid var(--surface-container-highest)', color: 'var(--on-surface)' }}>{user.gender}</div>}</div>
            <div><label style={{ color: 'var(--on-surface-dim)' }}>Activity Level</label>{ed ? <select value={f.activityLevel} onChange={sf('activityLevel')} style={{ padding: '10px 12px', fontSize: 14, width: '100%' }}>{Object.entries(ACTIVITY).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}</select> : <div style={{ padding: '10px 12px', background: 'var(--surface-container-lowest)', borderRadius: '10px 10px 0 0', fontSize: 14, border: 'none', borderBottom: '2px solid var(--surface-container-highest)', color: 'var(--on-surface)' }}>{ACTIVITY[user.activityLevel || 'moderate']?.label}</div>}</div>
          </div>
        </div>
      </div>
      <ConfirmDialog open={confirm} title="Logout?" message="Are you sure you want to log out? Your data will persist." onConfirm={() => { setConfirm(false); logout(); }} onCancel={() => setConfirm(false)} confirmLabel="Logout" danger />
    </div>
  );
}
